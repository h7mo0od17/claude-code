import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service" }

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="glass-card prose-invert space-y-8">
          {[
            {
              title: "1. Acceptance of Terms",
              content: "By accessing or using AutoFX services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
            },
            {
              title: "2. Description of Services",
              content: "AutoFX provides a copy trading platform that automatically replicates trades from a master account to subscriber accounts. We do not provide financial advice, and past performance is not indicative of future results.",
            },
            {
              title: "3. Eligibility",
              content: "You must be at least 18 years of age and legally able to trade in your jurisdiction. By using AutoFX, you represent and warrant that you meet these requirements.",
            },
            {
              title: "4. Account Registration",
              content: "You agree to provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
            },
            {
              title: "5. Subscription and Billing",
              content: "Subscriptions are billed monthly on a rolling basis. Payments are processed securely via Stripe. Failed payments will trigger automatic retry attempts. Access may be suspended after the grace period if payment is not completed.",
            },
            {
              title: "6. Broker Account Requirements",
              content: "You must maintain sufficient funds in your broker account as required by your selected package. AutoFX verifies account eligibility only during initial onboarding. You are responsible for maintaining your account in accordance with these terms.",
            },
            {
              title: "7. Risk Acknowledgment",
              content: "Trading foreign exchange involves substantial risk of loss. You acknowledge that you understand the risks involved and that AutoFX does not guarantee profits. You should only trade with money you can afford to lose.",
            },
            {
              title: "8. Limitation of Liability",
              content: "AutoFX shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our services, including but not limited to trading losses.",
            },
            {
              title: "9. Intellectual Property",
              content: "All content, software, and systems comprising the AutoFX platform are the intellectual property of AutoFX and its licensors.",
            },
            {
              title: "10. Termination",
              content: "AutoFX reserves the right to suspend or terminate accounts that violate these terms. You may cancel your subscription at any time from your dashboard.",
            },
            {
              title: "11. Changes to Terms",
              content: "We reserve the right to modify these terms at any time. We will notify users of material changes. Continued use of the service after changes constitutes acceptance.",
            },
            {
              title: "12. Governing Law",
              content: "These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through binding arbitration.",
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
