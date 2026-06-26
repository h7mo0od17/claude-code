import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "FAQ" }

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I get started with AutoFX?",
        a: "Create a free account, verify your email, choose a package, complete payment, connect your broker account, and you're live. The whole process takes under 10 minutes.",
      },
      {
        q: "What broker do I need?",
        a: "AutoFX currently supports MetaTrader 4 (MT4) and MetaTrader 5 (MT5) accounts. You need an account with our approved broker. Contact support for details on which broker we support.",
      },
      {
        q: "What is the minimum investment?",
        a: "BronzeFX requires a minimum account balance of $500. SilverFX requires $3,000. GoldFX requires $10,000.",
      },
    ],
  },
  {
    category: "Copy Trading",
    items: [
      {
        q: "How does copy trading work?",
        a: "When our master account opens a trade, our engine automatically copies that trade to all active subscriber accounts. The lot size is scaled proportionally based on your package tier.",
      },
      {
        q: "How fast are trades copied?",
        a: "Trades are typically copied within milliseconds of the master account executing. Exact timing depends on broker server latency.",
      },
      {
        q: "Can I still place my own trades?",
        a: "Yes, copied trades run alongside your own manual trades. However, we recommend not interfering with copied positions.",
      },
      {
        q: "What happens to open trades if I cancel my subscription?",
        a: "Copying will stop but any open positions copied before cancellation will remain open on your account. You will need to manage them manually.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    items: [
      {
        q: "How does billing work?",
        a: "Subscriptions are billed monthly on a rolling cycle. Your billing date is set from when your subscription is first activated.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept Visa, Mastercard, and other major debit and credit cards. Cryptocurrency payments are not currently supported.",
      },
      {
        q: "What happens if my payment fails?",
        a: "We'll retry failed payments automatically. You'll receive an email notification. A grace period applies before service is suspended.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel anytime from your dashboard. Access continues until the end of your current billing period.",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        q: "Is my broker account safe?",
        a: "Your credentials are encrypted with AES-256 encryption. We use read-only access where possible, and we can never withdraw funds from your account.",
      },
      {
        q: "Do you support Two-Factor Authentication?",
        a: "Yes. We strongly recommend enabling 2FA in your account settings for additional security.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Help Center</Badge>
          <h1 className="text-5xl font-black text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="text-primary-400 hover:underline">Contact our support team</a>.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-primary-400 mb-4 pb-2 border-b border-autofx-dark-border">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.q} className="glass-card">
                    <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
