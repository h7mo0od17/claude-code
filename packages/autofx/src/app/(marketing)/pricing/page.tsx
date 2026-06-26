import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, HelpCircle, ArrowRight } from "lucide-react"

export const metadata: Metadata = { title: "Pricing" }

const packages = [
  {
    name: "BronzeFX",
    tier: "bronze" as const,
    price: 49,
    minDeposit: 500,
    description: "Perfect for new traders looking to get started with copy trading.",
    features: [
      "Automatic trade copying",
      "Real-time trade execution",
      "Performance dashboard",
      "Trade history & analytics",
      "Email notifications",
      "Email support",
    ],
    notIncluded: ["Priority execution", "Advanced analytics", "Phone support"],
  },
  {
    name: "SilverFX",
    tier: "silver" as const,
    price: 99,
    minDeposit: 3000,
    popular: true,
    description: "Ideal for experienced traders seeking superior execution and analytics.",
    features: [
      "Everything in BronzeFX",
      "Priority trade execution",
      "Advanced analytics & charts",
      "Monthly performance report",
      "Priority email support",
      "Faster copy speed",
    ],
    notIncluded: ["Dedicated account manager", "VIP 24/7 support"],
  },
  {
    name: "GoldFX",
    tier: "gold" as const,
    price: 199,
    minDeposit: 10000,
    description: "Our premium tier for serious investors demanding the very best.",
    features: [
      "Everything in SilverFX",
      "Dedicated account manager",
      "Custom risk settings",
      "VIP 24/7 support",
      "Exclusive trading signals",
      "Priority onboarding",
    ],
    notIncluded: [],
  },
]

const faq = [
  {
    q: "When does my subscription start?",
    a: "Your subscription starts immediately after payment is confirmed and your broker account is successfully verified.",
  },
  {
    q: "Can I upgrade my package?",
    a: "Yes, you can upgrade your package at any time from your dashboard. Your billing cycle will be adjusted accordingly.",
  },
  {
    q: "What happens if I don't maintain the minimum deposit?",
    a: "AutoFX only verifies your account balance during initial onboarding. You are responsible for maintaining adequate funds per our Terms of Service.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, and most major debit and credit cards. Cryptocurrency payments are not supported.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time. Access continues until the end of the current billing period.",
  },
]

export default function PricingPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Transparent Pricing</Badge>
          <h1 className="text-5xl font-black text-white mb-4">
            Simple, <span className="gradient-text">Honest Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the package that matches your investment level. No hidden fees, no surprises.
          </p>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`glass-card relative flex flex-col ${
                pkg.popular ? "border-primary-600 ring-1 ring-primary-600 glow-purple" : ""
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-4">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <Badge variant={pkg.tier} className="mb-3">{pkg.name}</Badge>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black text-white">${pkg.price}</span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                <p className="text-sm text-primary-400 font-medium">
                  Min. deposit: ${pkg.minDeposit.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-3">{pkg.description}</p>
              </div>

              <div className="flex-1">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Included
                </h4>
                <ul className="space-y-2.5 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {pkg.notIncluded.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600 line-through">
                      <div className="w-4 h-4 flex-shrink-0 mt-0.5 rounded-full border border-gray-700" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={`/register?package=${pkg.tier.toLowerCase()}`}>
                <Button
                  variant={pkg.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  Get Started with {pkg.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Risk warning */}
        <div className="glass-card mb-20 border-yellow-500/30">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-400 mb-1">Risk Disclosure</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Trading foreign exchange on margin carries a high level of risk, and may not be suitable for
                all investors. The high degree of leverage can work against you as well as for you. Before
                deciding to trade forex you should carefully consider your investment objectives, level of
                experience, and risk appetite. Past performance is not indicative of future results.{" "}
                <Link href="/risk-disclosure" className="text-primary-400 hover:underline">
                  Read full Risk Disclosure →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-10">
            Pricing <span className="gradient-text">FAQs</span>
          </h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="glass-card">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/register">
            <Button size="xl" className="gap-2">
              Create Your Account <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
