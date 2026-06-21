import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Terms of Service — AutoFX' }

export default async function TermsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-3">Legal</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Terms of Service</h1>
            <p className="text-sm text-slate-500">Last updated: January 2025</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">1. Agreement to Terms</h2>
              <p>By accessing or using AutoFX (&quot;the Platform&quot;), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these terms, you may not use the Platform.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">2. Description of Service</h2>
              <p className="mb-3">AutoFX is a subscription-based trade mirroring platform. The Platform mirrors trading strategies from a master trading account into subscriber Exness trading accounts. Key characteristics of the service:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Client funds remain within the client&apos;s own Exness trading account at all times.</li>
                <li>AutoFX does not hold, manage, or custody client funds.</li>
                <li>Trade mirroring is performed on a best-efforts basis and is not guaranteed.</li>
                <li>AutoFX is not a regulated investment advisor or fund manager.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">3. Eligibility</h2>
              <p className="mb-3">To use the Platform, you must:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Be at least 18 years of age.</li>
                <li>Maintain an active Exness trading account in good standing.</li>
                <li>Have a minimum account balance as required for your applicable package.</li>
                <li>Comply with all applicable laws in your jurisdiction.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">4. Application & Approval</h2>
              <p>Submission of an application does not guarantee access to the Platform. AutoFX reserves the right to approve or reject any application at its sole discretion. Package eligibility is determined by the verified Exness account balance at the time of review. AutoFX may request additional documentation to verify account details.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">5. Subscription & Payment</h2>
              <p className="mb-3">Subscription fees are charged monthly through Stripe. By subscribing:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>You authorise recurring monthly charges at the rate specified for your package.</li>
                <li>Billing begins only after AutoFX manually activates your trade mirroring service.</li>
                <li>Subscription fees are non-refundable except as set out in our Refund Policy.</li>
                <li>Prices are subject to change with 30 days&apos; written notice.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">6. No Investment Advice</h2>
              <p>Nothing on the Platform constitutes financial, investment, tax, or legal advice. AutoFX does not make recommendations regarding trading, investment strategies, or the suitability of any financial product. You are solely responsible for your trading and investment decisions.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">7. Risk Disclosure</h2>
              <p>Trading foreign exchange involves substantial risk of loss and is not suitable for all investors. Please review our full <Link href="/risk-disclosure" className="text-amethyst-light hover:underline">Risk Disclosure</Link> before using the Platform.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, AutoFX shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, arising from your use of the Platform or from any trading losses incurred in connection with the mirroring service.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">9. Termination</h2>
              <p>You may cancel your subscription at any time. AutoFX reserves the right to suspend or terminate access to the Platform for any breach of these Terms, without notice or liability.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">10. Governing Law</h2>
              <p>These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be resolved in the courts of Dubai, UAE.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">11. Contact</h2>
              <p>For questions regarding these Terms, contact us at: <span className="text-amethyst-light font-mono">legal@autofx.ae</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
