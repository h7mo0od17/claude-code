import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, Users, Award } from "lucide-react"

export const metadata: Metadata = { title: "About Us" }

const values = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Performance First",
    desc: "We obsess over execution speed, reliability, and consistent returns for our clients.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trust & Security",
    desc: "Bank-grade security for all credentials. We never access your funds — only trade copying.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Client Centric",
    desc: "Every feature is built around what our clients need to succeed in the markets.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Transparency",
    desc: "Clear pricing, honest performance data, and full trade history — always.",
  },
]

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-20">
          <Badge variant="default" className="mb-4">Our Story</Badge>
          <h1 className="text-5xl font-black text-white mb-6">
            About <span className="gradient-text">AutoFX</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AutoFX was founded with one mission: to democratize access to professional forex trading.
            We believe every investor deserves access to the same strategies used by institutional traders.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card mb-16 text-center glow-purple">
          <h2 className="text-3xl font-black text-white mb-4">Our Mission</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            To provide a transparent, reliable, and fully automated copy trading platform that lets anyone —
            regardless of experience — benefit from professional forex trading expertise.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white text-center mb-10">
            Our <span className="gradient-text">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="glass-card flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-purple-blue/20 border border-primary-600/30 flex items-center justify-center text-primary-400 flex-shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How we operate */}
        <div className="glass-card">
          <h2 className="text-2xl font-bold text-white mb-4">How AutoFX Operates</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              AutoFX operates a professional master trading account managed by our expert traders. When our
              master account opens or closes positions, those exact trades are replicated in real-time across
              all active subscriber accounts — sized proportionally to each client&apos;s package tier.
            </p>
            <p>
              We use a secure broker bridge to connect to MT4/MT5 servers. Your broker account credentials
              are encrypted with industry-standard encryption and used solely for trade execution. AutoFX
              never has the ability to withdraw funds from your account.
            </p>
            <p>
              Our platform performs a one-time verification of your broker account during onboarding to
              confirm eligibility based on your selected package&apos;s minimum deposit requirement. After
              activation, you remain in full control of your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
