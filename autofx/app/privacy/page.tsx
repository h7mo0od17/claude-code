import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Privacy Policy — AutoFX' }

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-3">Legal</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Privacy Policy</h1>
            <p className="text-sm text-slate-500">Last updated: January 2025</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">1. Introduction</h2>
              <p>AutoFX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our trade mirroring platform at autofx.ae (the &quot;Platform&quot;). Please read this policy carefully.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">2. Information We Collect</h2>
              <p className="mb-3">We collect the following categories of information:</p>
              <ul className="space-y-2 list-disc list-inside mb-3">
                <li><span className="text-slate-300 font-medium">Account Information:</span> Name, email address, phone number, and country of residence provided at registration.</li>
                <li><span className="text-slate-300 font-medium">Trading Account Data:</span> Your Exness UID, Exness account number, and stated account balance submitted in your application.</li>
                <li><span className="text-slate-300 font-medium">Payment Information:</span> Subscription payment records processed through Stripe. We do not store card details — Stripe handles all payment data.</li>
                <li><span className="text-slate-300 font-medium">Usage Data:</span> Log data, IP addresses, browser type, and pages visited for security and analytics.</li>
                <li><span className="text-slate-300 font-medium">Communications:</span> Messages you send to us via email or support channels.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Verify your identity and Exness account eligibility.</li>
                <li>Review and process your application for the Platform.</li>
                <li>Activate and manage your trade mirroring subscription.</li>
                <li>Process subscription payments via Stripe.</li>
                <li>Communicate service updates, billing notices, and support responses.</li>
                <li>Maintain the security and integrity of the Platform.</li>
                <li>Comply with legal obligations and resolve disputes.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">4. Data Sharing</h2>
              <p className="mb-3">We do not sell your personal information. We share data only in the following circumstances:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="text-slate-300 font-medium">Stripe:</span> Payment processing. Subject to Stripe&apos;s Privacy Policy.</li>
                <li><span className="text-slate-300 font-medium">Supabase:</span> Database and authentication infrastructure.</li>
                <li><span className="text-slate-300 font-medium">Legal requirements:</span> When required by law, court order, or governmental authority.</li>
                <li><span className="text-slate-300 font-medium">Business transfers:</span> In connection with a merger, acquisition, or sale of assets, with prior notice to you.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">5. Data Retention</h2>
              <p>We retain your personal data for as long as your account is active or as necessary to provide our services. Application records and subscription history are retained for seven (7) years for financial compliance purposes. You may request deletion of your account data, subject to our legal retention obligations.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">6. Security</h2>
              <p>We implement industry-standard security measures including TLS encryption in transit, encrypted storage via Supabase, and role-based access controls. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security of your data.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">7. Cookies</h2>
              <p>The Platform uses essential cookies for authentication session management (via Supabase). We do not use third-party advertising or tracking cookies. You may disable cookies in your browser settings, though this may impair Platform functionality.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">8. Your Rights</h2>
              <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access a copy of the personal data we hold about you.</li>
                <li>Correct inaccurate or incomplete personal data.</li>
                <li>Request deletion of your personal data (subject to legal retention requirements).</li>
                <li>Object to or restrict processing of your data.</li>
                <li>Data portability — receive your data in a machine-readable format.</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact us at <span className="text-amethyst-light font-mono">privacy@autofx.ae</span>.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">9. Exness Affiliate Disclosure</h2>
              <p>AutoFX participates in the Exness Partner Programme. When you open an Exness account through our referral link, AutoFX may receive an affiliate commission from Exness. This does not affect your Exness account terms or trading conditions.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the Platform. Your continued use of the Platform after the effective date constitutes acceptance of the updated policy.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">11. Contact</h2>
              <p>For privacy-related questions or to exercise your rights, contact us at: <span className="text-amethyst-light font-mono">privacy@autofx.ae</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
