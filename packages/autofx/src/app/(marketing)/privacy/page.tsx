import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="glass-card space-y-8">
          {[
            {
              title: "Information We Collect",
              content: "We collect information you provide directly: name, email address, phone number, country, and broker account credentials. We also collect usage data, IP addresses, and device information for security and analytics.",
            },
            {
              title: "How We Use Your Information",
              content: "We use your information to provide our copy trading service, process payments, send transactional emails, provide customer support, and improve our platform. We do not sell your personal data to third parties.",
            },
            {
              title: "Broker Credential Security",
              content: "Broker credentials (account number, password, server) are encrypted at rest using AES-256 encryption. They are used solely for the purpose of copying trades to your account. AutoFX cannot withdraw funds from your broker account.",
            },
            {
              title: "Data Sharing",
              content: "We share data with: Stripe (payment processing), Resend (email delivery), and our broker integration partners. All third-party providers are bound by data processing agreements.",
            },
            {
              title: "Data Retention",
              content: "We retain your data for as long as your account is active. Upon account deletion, we remove your personal data within 30 days, except where required by law.",
            },
            {
              title: "Your Rights",
              content: "You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask us to restrict processing by contacting support@autofx.io.",
            },
            {
              title: "Cookies",
              content: "We use essential cookies for authentication and security. We do not use tracking or advertising cookies.",
            },
            {
              title: "Contact",
              content: "For privacy-related inquiries, contact us at privacy@autofx.io.",
            },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-white mb-2">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
