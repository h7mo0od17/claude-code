import { Resend } from "resend"
import { emailTemplates } from "./templates"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.EMAIL_FROM ?? "AutoFX <noreply@autofx.io>"

async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Email] To: ${to} | Subject: ${subject}`)
    return { id: "dev-mock" }
  }
  return resend.emails.send({ from: FROM_EMAIL, to, subject, html })
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
  const { subject, html } = emailTemplates.verifyEmail(name, url)
  return sendEmail(email, subject, html)
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  amount: string,
  packageName: string,
  invoiceUrl: string
) {
  const { subject, html } = emailTemplates.paymentConfirmation(name, amount, packageName, invoiceUrl)
  return sendEmail(email, subject, html)
}

export async function sendSubscriptionActivatedEmail(
  email: string,
  name: string,
  packageName: string
) {
  const { subject, html } = emailTemplates.subscriptionActivated(name, packageName)
  return sendEmail(email, subject, html)
}

export async function sendPaymentFailedEmail(
  email: string,
  name: string,
  amount: string,
  retryUrl: string
) {
  const { subject, html } = emailTemplates.paymentFailed(name, amount, retryUrl)
  return sendEmail(email, subject, html)
}

export async function sendSubscriptionRenewalEmail(
  email: string,
  name: string,
  packageName: string,
  nextBillingDate: string,
  amount: string
) {
  const { subject, html } = emailTemplates.subscriptionRenewal(name, packageName, nextBillingDate, amount)
  return sendEmail(email, subject, html)
}
