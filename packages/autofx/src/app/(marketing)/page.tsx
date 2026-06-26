import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Lock,
} from "lucide-react"

const stats = [
  { value: "2,400+", label: "Active Traders" },
  { value: "$12M+", label: "Copied Volume" },
  { value: "94.2%", label: "Uptime" },
  { value: "3 Tiers", label: "Available Plans" },
]

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Trade Copying",
    description: "Trades are copied to your account within milliseconds of the master account executing.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Encrypted",
    description: "Bank-grade encryption for all broker credentials. Your data is always protected.",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Real-time Performance",
    description: "Monitor your account performance with live charts, trade history, and P&L analytics.",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Automated Renewals",
    description: "Seamless monthly billing with automatic renewal. No interruptions to your trading.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Risk Management",
    description: "Package-specific lot sizing and risk settings designed for your account tier.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Dedicated Support",
    description: "Expert support team available to help you get the most out of AutoFX.",
  },
]

const steps = [
  { step: "01", title: "Create Account", desc: "Register and verify your email in minutes." },
  { step: "02", title: "Choose Package", desc: "Select the plan that matches your investment." },
  { step: "03", title: "Complete Payment", desc: "Secure card payment processed instantly." },
  { step: "04", title: "Connect Broker", desc: "Link your MT4/MT5 broker account." },
  { step: "05", title: "Go Live", desc: "Trades start copying automatically." },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 bg-hero-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Badge variant="default" className="mb-6 inline-flex">
            <TrendingUp className="w-3 h-3 mr-1" />
            Professional Copy Trading
          </Badge>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="text-white">Copy Expert Trades</span>
            <br />
            <span className="gradient-text">Automatically</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe to AutoFX and let our professional trading engine copy expert forex trades
            directly to your broker account. No experience required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" className="gap-2">
                Start Trading Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="xl" variant="outline">View Pricing</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card text-center">
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Simple Process</Badge>
            <h2 className="text-4xl font-black text-white mb-4">
              Get Started in <span className="gradient-text">5 Steps</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our automated onboarding gets you from signup to live copy trading with zero manual intervention.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-purple-blue opacity-20" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((s, i) => (
                <div key={s.step} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-purple-blue mb-4 text-white font-black text-lg relative z-10">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-8 -right-3 text-primary-600 w-4 h-4 z-20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-autofx-dark-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl font-black text-white mb-4">
              Built for <span className="gradient-text">Serious Traders</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card group hover:border-primary-600/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple-blue/20 border border-primary-600/30 flex items-center justify-center text-primary-400 mb-4 group-hover:bg-gradient-purple-blue group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Pricing Plans</Badge>
            <h2 className="text-4xl font-black text-white mb-4">
              Choose Your <span className="gradient-text">Package</span>
            </h2>
            <p className="text-gray-400">Three tiers designed for every level of investment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "BronzeFX", price: "$49", deposit: "$500", tier: "bronze", features: ["Automatic trade copying", "Performance dashboard", "Email notifications", "Basic support"] },
              { name: "SilverFX", price: "$99", deposit: "$3,000", tier: "silver", features: ["Priority execution", "Advanced analytics", "Priority support", "Monthly reports"], popular: true },
              { name: "GoldFX", price: "$199", deposit: "$10,000", tier: "gold", features: ["Dedicated manager", "Custom risk settings", "VIP 24/7 support", "Exclusive signals"] },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`glass-card relative flex flex-col ${pkg.popular ? "border-primary-600 ring-1 ring-primary-600 glow-purple" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="px-4">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <Badge variant={pkg.tier as "bronze" | "silver" | "gold"} className="mb-3">{pkg.name}</Badge>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Min. deposit: {pkg.deposit}</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant={pkg.popular ? "default" : "outline"} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button variant="ghost" className="gap-2">
                View full pricing details <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card glow-purple">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Start <span className="gradient-text">Copy Trading?</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Join thousands of traders already using AutoFX. Set up takes less than 10 minutes.
            </p>
            <Link href="/register">
              <Button size="xl" className="gap-2">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-xs text-gray-600 mt-4">
              No commitment required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
