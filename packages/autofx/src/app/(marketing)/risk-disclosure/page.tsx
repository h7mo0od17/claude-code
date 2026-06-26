import type { Metadata } from "next"

export const metadata: Metadata = { title: "Risk Disclosure" }

export default function RiskDisclosurePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-black text-white mb-2">Risk Disclosure</h1>
        <p className="text-gray-500 mb-10">Please read this document carefully before using AutoFX services.</p>

        <div className="glass-card border-yellow-500/30 mb-8">
          <p className="text-yellow-400 font-semibold">
            ⚠️ Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors.
            The high degree of leverage can work against you as well as for you.
          </p>
        </div>

        <div className="glass-card space-y-8">
          {[
            {
              title: "1. High Risk of Loss",
              content: "Before deciding to trade foreign exchange you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose.",
            },
            {
              title: "2. Leverage Risk",
              content: "The high degree of leverage that is often obtainable in forex trading can work against you as well as for you. The use of leverage can lead to large losses as well as large gains. You should understand the full implications of leverage before trading.",
            },
            {
              title: "3. Copy Trading Risk",
              content: "Copying trades from a master account does not guarantee profits. The master account's performance in the past is not necessarily indicative of future performance. Market conditions change, and strategies that worked previously may not work in the future.",
            },
            {
              title: "4. Technical Risk",
              content: "Copy trading involves electronic systems that may be subject to failures, delays, or errors. Internet connectivity issues, broker server downtime, or system failures may result in trades not being copied or being copied incorrectly.",
            },
            {
              title: "5. Slippage Risk",
              content: "Due to market conditions and broker execution, trades copied to your account may be executed at different prices than the master account, resulting in different outcomes (slippage).",
            },
            {
              title: "6. Market Risk",
              content: "Forex markets are subject to sudden and significant price movements driven by economic data, central bank decisions, geopolitical events, and other factors outside AutoFX's control.",
            },
            {
              title: "7. Regulatory Risk",
              content: "Regulatory changes in your jurisdiction may affect your ability to trade or use copy trading services. You are responsible for ensuring that using AutoFX is legal in your jurisdiction.",
            },
            {
              title: "8. Acknowledgment",
              content: "By using AutoFX services, you acknowledge that you have read and understood this risk disclosure, that you are aware of the risks involved in forex trading, and that you accept full responsibility for your trading decisions and outcomes.",
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
