import { NextResponse } from "next/server"
import { z } from "zod"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

const schema = z.object({
  packageId: z.string(),
  paymentMethodId: z.string(),
})

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

    const { packageId, paymentMethodId } = parsed.data

    const pkg = await db.package.findUnique({ where: { id: packageId, isActive: true } })
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 })

    if (!pkg.stripePriceId) {
      return NextResponse.json({ error: "Package billing not configured" }, { status: 500 })
    }

    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Please verify your email before subscribing." }, { status: 400 })
    }

    // Check for existing subscription
    const existing = await db.subscription.findUnique({ where: { userId: session.userId } })
    if (existing && existing.status === "ACTIVE") {
      return NextResponse.json({ error: "You already have an active subscription." }, { status: 400 })
    }

    // Create/get Stripe customer
    let stripeCustomerId = existing?.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      })
      stripeCustomerId = customer.id
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: stripeCustomerId })
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: pkg.stripePriceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    })

    // Upsert subscription in DB
    await db.subscription.upsert({
      where: { userId: session.userId },
      update: {
        packageId: pkg.id,
        status: "PENDING_PAYMENT",
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId,
      },
      create: {
        userId: session.userId,
        packageId: pkg.id,
        status: "PENDING_PAYMENT",
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId,
      },
    })

    const invoice = stripeSubscription.latest_invoice as {
      payment_intent?: { client_secret?: string; status?: string }
    }

    return NextResponse.json({
      subscriptionId: stripeSubscription.id,
      clientSecret: invoice?.payment_intent?.client_secret,
      status: invoice?.payment_intent?.status,
    })
  } catch (err) {
    console.error("[create-subscription]", err)
    return NextResponse.json({ error: "Payment setup failed" }, { status: 500 })
  }
}
