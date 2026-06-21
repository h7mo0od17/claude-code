import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Risk Disclosure — AutoFX' }

export default async function RiskDisclosurePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-3">Legal</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Risk Disclosure</h1>
            <p className="text-sm text-slate-500">Last updated: January 2025</p>
          </div>

          {/* Warning banner */}
          <div className="flex items-start gap-4 p-5 rounded-xl bg-red-950/30 border border-red-500/30 mb-8">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-sm text-red-300 leading-relaxed">
              <span className="font-semibold">Important Warning:</span> Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. You could lose some or all of your invested capital. Only trade with money you can afford to lose.
            </p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8 text-slate-400 leading-relaxed">

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">1. High Risk of Loss</h2>
              <p>Foreign exchange (forex) trading involves a substantial risk of loss. Leverage amplifies both potential profits and potential losses. It is possible to lose more than your initial deposit. The high degree of leverage that is often obtainable in forex trading can work against you as well as for you. Before deciding to trade, you should carefully consider your investment objectives, level of experience, and risk appetite.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">2. Trade Mirroring Risk</h2>
              <p className="mb-3">AutoFX operates as a trade mirroring service. There are specific risks associated with mirroring:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="text-slate-300 font-medium">Execution slippage:</span> Mirror trades may be executed at different prices than the master account due to market conditions and timing.</li>
                <li><span className="text-slate-300 font-medium">Partial execution:</span> Not all trades from the master account may be mirrored into your account, particularly during periods of high volatility or low liquidity.</li>
                <li><span className="text-slate-300 font-medium">Proportional sizing:</span> Trade sizes are proportionally adjusted based on your account balance relative to the master account. This may result in minimum lot size rounding.</li>
                <li><span className="text-slate-300 font-medium">Service interruption:</span> Technical issues, connectivity failures, or broker restrictions may interrupt or delay trade mirroring.</li>
                <li><span className="text-slate-300 font-medium">Past performance:</span> The master account&apos;s historical performance is not indicative of future results.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">3. Market Risk</h2>
              <p className="mb-3">Forex markets are subject to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="text-slate-300 font-medium">Volatility:</span> Currency prices can change rapidly in response to economic data, geopolitical events, and market sentiment.</li>
                <li><span className="text-slate-300 font-medium">Liquidity risk:</span> During periods of low liquidity (e.g., market open/close, public holidays), spreads may widen significantly and orders may not be filled at expected prices.</li>
                <li><span className="text-slate-300 font-medium">Gap risk:</span> Markets may open at significantly different levels from the prior close, leading to losses that exceed stop-loss orders.</li>
                <li><span className="text-slate-300 font-medium">Leverage risk:</span> Exness offers high leverage. A small adverse market movement can result in a margin call or stop-out, closing your positions at a loss.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">4. No Investment Advice</h2>
              <p>AutoFX does not provide investment advice, financial advice, tax advice, or any other form of regulated advice. The trade mirroring service is provided on a purely informational and execution basis. Nothing on the Platform should be construed as a recommendation to buy or sell any financial instrument. You are solely responsible for your investment and trading decisions.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">5. Regulatory Status</h2>
              <p>AutoFX is not registered as an investment advisor, fund manager, or regulated financial services provider in any jurisdiction. The Platform is not regulated by any financial regulatory authority. By using AutoFX, you acknowledge that you are not receiving regulated investment management services.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">6. Exness Broker Risk</h2>
              <p>Your funds are held in your personal Exness trading account. AutoFX has no custody or control over these funds. Risks associated with Exness (including broker insolvency, regulatory action, or account restrictions) are separate from and independent of AutoFX. You should review Exness&apos;s own risk disclosure documents and terms of service.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">7. Technology & Operational Risk</h2>
              <p>The Platform depends on third-party infrastructure including internet connectivity, cloud services, and the Exness trading infrastructure. System failures, network outages, cyberattacks, or software errors could result in missed trades, duplicate trades, or inability to access the service. AutoFX shall not be liable for losses resulting from technical failures beyond its reasonable control.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">8. Jurisdiction & Legal Risk</h2>
              <p>Forex trading and copy/mirror trading services may be restricted or prohibited in certain jurisdictions. It is your responsibility to ensure that your use of the Platform complies with all applicable laws and regulations in your country of residence. AutoFX accepts no liability for your use of the Platform in jurisdictions where such use is prohibited.</p>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">9. Acknowledgement</h2>
              <p>By using the AutoFX Platform, you confirm that:</p>
              <ul className="space-y-2 list-disc list-inside mt-3">
                <li>You have read and understood this Risk Disclosure in full.</li>
                <li>You are aware that you may lose all capital invested through the mirror trading service.</li>
                <li>You are financially able to bear the risk of loss without affecting your standard of living.</li>
                <li>Your decision to use the Platform is based on your own independent assessment.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-6 border border-glass-border">
              <h2 className="font-display font-semibold text-white text-lg mb-4">10. Contact</h2>
              <p>For questions regarding this Risk Disclosure, contact us at: <span className="text-amethyst-light font-mono">legal@autofx.ae</span></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
