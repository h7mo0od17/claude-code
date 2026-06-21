import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Refund Policy — AutoFX' }

export default async function RefundPolicyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-3">Legal</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Refund Policy</h1>
            <p className="text-sm text-slate-500">Last updated: January 2025</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">1. Overview</h2>
              <p>This Refund Policy applies to all subscription fees paid to AutoFX for access to our trade mirroring Platform. By subscribing to AutoFX, you agree to the terms set out in this policy. Please read it carefully before making a payment.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">2. General No-Refund Policy</h2>
              <p>All subscription fees paid to AutoFX are <span className="text-white font-medium">non-refundable</span>. This includes:</p>
              <ul className="space-y-2 list-disc list-inside mt-3">
                <li>Monthly subscription charges for any AutoFX package (BronzeFX, SilverFX, GoldFX).</li>
                <li>Fees paid for partial months of service.</li>
                <li>Fees paid in advance for any period.</li>
              </ul>
              <p className="mt-3">This policy exists because the digital nature of our service means that once access is activated, the service has been rendered.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">3. Billing Commencement</h2>
              <p>Importantly, your subscription billing only begins after AutoFX manually reviews your application, confirms your Exness account eligibility, and activates your trade mirroring service. <span className="text-white font-medium">You will not be charged before activation.</span> This ensures you are only billed for periods when the service is actually live for your account.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">4. Exceptions — When Refunds May Be Granted</h2>
              <p className="mb-3">At AutoFX&apos;s sole discretion, a partial or full refund may be considered in the following limited circumstances:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="text-slate-300 font-medium">Duplicate billing:</span> If you were charged twice for the same billing period due to a technical error.</li>
                <li><span className="text-slate-300 font-medium">Extended service outage:</span> If AutoFX experiences a prolonged service disruption (exceeding 7 consecutive days) through no fault of the client, a pro-rated credit may be offered at AutoFX&apos;s discretion.</li>
                <li><span className="text-slate-300 font-medium">Charging error:</span> If you were charged an incorrect amount that does not match the package price stated at approval.</li>
              </ul>
              <p className="mt-3">Refund requests must be submitted within 30 days of the charge. We do not issue refunds for losses incurred through trade mirroring.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">5. Cancellation</h2>
              <p>You may cancel your AutoFX subscription at any time by contacting us at <span className="text-amethyst-light font-mono">support@autofx.ae</span>. Upon cancellation:</p>
              <ul className="space-y-2 list-disc list-inside mt-3">
                <li>Your trade mirroring service will be deactivated, typically within one business day.</li>
                <li>No further charges will be made after cancellation is confirmed.</li>
                <li>No refund will be issued for the current billing period already paid.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">6. Trading Losses</h2>
              <p>AutoFX subscription fees are for access to the trade mirroring service, not a guarantee of profits. <span className="text-white font-medium">Refunds will not be issued on the basis of trading losses</span>, regardless of the performance of the mirrored strategy. By subscribing, you acknowledge and accept that trading results are variable and may result in a loss of capital.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">7. How to Request a Refund</h2>
              <p className="mb-3">If you believe you qualify for a refund under Section 4, please contact us with the following information:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Your registered email address.</li>
                <li>The date and amount of the charge.</li>
                <li>A description of the issue and the reason for your refund request.</li>
              </ul>
              <p className="mt-3">Send refund requests to: <span className="text-amethyst-light font-mono">billing@autofx.ae</span></p>
              <p className="mt-2">We aim to respond to all refund requests within 5 business days.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">8. Payment Processor</h2>
              <p>All subscription payments are processed by Stripe. In the event of a dispute, you may also contact your bank or card issuer. However, initiating a chargeback without first contacting AutoFX may result in the immediate suspension of your account. We encourage you to reach out to us directly first so we can resolve any billing issue quickly.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">9. Changes to This Policy</h2>
              <p>AutoFX reserves the right to update this Refund Policy at any time. Changes will be communicated via email or by posting on the Platform with at least 14 days&apos; notice before taking effect for existing subscribers.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">10. Contact</h2>
              <p>For refund or billing enquiries, contact us at: <span className="text-amethyst-light font-mono">billing@autofx.ae</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
