import { NextResponse } from "next/server"
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe"
import { db } from "@/lib/db"
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail, sendSubscriptionRenewalEmail } from "@/lib/email"
import { generateInvoiceNumber } from "@/lib/utils"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
          include: { user: true, package: true },
        })
        if (!subscription) break

        const invoiceNumber = generateInvoiceNumber()
        const amount = (invoice.amount_paid / 100)

        await db.$transaction([
          db.payment.create({
            data: {
              userId: subscription.userId,
              subscriptionId: subscription.id,
              stripeInvoiceId: invoice.id,
              amount,
              currency: invoice.currency.toUpperCase(),
              status: "SUCCEEDED",
              invoiceUrl: invoice.hosted_invoice_url ?? undefined,
              invoiceNumber,
              paidAt: new Date(invoice.status_transitions?.paid_at ? invoice.status_transitions.paid_at * 1000 : Date.now()),
            },
          }),
          db.subscription.update({
            where: { id: subscription.id },
            data: {
              status: "ACTIVE",
              currentPeriodStart: new Date((invoice.period_start ?? 0) * 1000),
              currentPeriodEnd: new Date((invoice.period_end ?? 0) * 1000),
            },
          }),
          db.notification.create({
            data: {
              userId: subscription.userId,
              type: "PAYMENT_SUCCESS",
              title: "Payment Successful",
              message: `Your payment of $${amount.toFixed(2)} for ${subscription.package.name} has been confirmed.`,
            },
          }),
        ])

        if (subscription.user) {
          await sendPaymentConfirmationEmail(
            subscription.user.email,
            subscription.user.name ?? "Valued Client",
            `$${amount.toFixed(2)}`,
            subscription.package.name,
            invoice.hosted_invoice_url ?? "#"
          )
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const subscription = await db.subscription.findFirst({
          where: { stripeCustomerId: customerId },
          include: { user: true, package: true },
        })
        if (!subscription) break

        const gracePeriodEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days grace

        await db.$transaction([
          db.subscription.update({
            where: { id: subscription.id },
            data: { status: "PAST_DUE", gracePeriodEnd },
          }),
          db.notification.create({
            data: {
              userId: subscription.userId,
              type: "PAYMENT_FAILED",
              title: "Payment Failed",
              message: "We were unable to process your subscription payment. Please update your payment method.",
            },
          }),
        ])

        if (subscription.user) {
          const amount = `$${((invoice.amount_due ?? 0) / 100).toFixed(2)}`
          await sendPaymentFailedEmail(
            subscription.user.email,
            subscription.user.name ?? "Valued Client",
            amount,
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`
          )
        }
        break
      }

      case "customer.subscription.deleted": {
        const stripeSubscription = event.data.object as Stripe.Subscription
        const dbSubscription = await db.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubscription.id },
        })
        if (!dbSubscription) break

        await db.$transaction([
          db.subscription.update({
            where: { id: dbSubscription.id },
            data: { status: "CANCELLED", cancelledAt: new Date() },
          }),
          db.brokerAccount.updateMany({
            where: { userId: dbSubscription.userId },
            data: { status: "SUSPENDED" },
          }),
        ])
        break
      }
    }
  } catch (err) {
    console.error("[webhook]", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
