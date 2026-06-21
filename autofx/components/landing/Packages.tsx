'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Info } from 'lucide-react'
import Button from '@/components/ui/Button'

const PACKAGES = [
  {
    id: 'bronze',
    name: 'BronzeFX',
    price: 149,
    range: '$500 – $2,999',
    rangeLabel: 'Qualifying balance',
    accentClass: 'border-amber-500/30 hover:border-amber-500/60',
    glowClass: 'hover:shadow-amber-500/10',
    badgeClass: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
    iconColor: 'text-amber-400',
    priceColor: 'text-amber-300',
    features: [
      'Professional trade mirroring',
      'Real-time execution',
      'Monthly performance summary',
      'Email support',
    ],
  },
  {
    id: 'silver',
    name: 'SilverFX',
    price: 399,
    range: '$3,000 – $9,999',
    rangeLabel: 'Qualifying balance',
    featured: true,
    accentClass: 'border-slate-400/40 hover:border-slate-400/70',
    glowClass: 'hover:shadow-slate-300/10',
    badgeClass: 'text-slate-300 bg-slate-300/10 border-slate-300/25',
    iconColor: 'text-slate-300',
    priceColor: 'text-slate-200',
    features: [
      'Professional trade mirroring',
      'Real-time execution',
      'Weekly performance reports',
      'Priority support',
      'Strategy updates',
    ],
  },
  {
    id: 'gold',
    name: 'GoldFX',
    price: 1499,
    range: '$10,000+',
    rangeLabel: 'Qualifying balance',
    accentClass: 'border-champagne/35 hover:border-champagne/65',
    glowClass: 'hover:shadow-champagne/10',
    badgeClass: 'text-champagne bg-champagne/10 border-champagne/25',
    iconColor: 'text-champagne',
    priceColor: 'text-champagne-light',
    features: [
      'Professional trade mirroring',
      'Real-time execution',
      'Daily performance reports',
      'Dedicated account manager',
      'Strategy updates & briefings',
      'Direct WhatsApp access',
    ],
  },
]

export default function Packages() {
  return (
    <section id="packages" className="py-28 px-4 sm:px-6 relative">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-4">
            Subscription Plans
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Three tiers. One system.
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Your eligible package is determined by your Exness account balance
            at the time of application. All plans use the same mirroring infrastructure.
          </p>
        </motion.div>

        {/* Eligibility notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-16"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-sapphire/8 border border-sapphire/20 text-sapphire-light text-xs font-display">
            <Info className="h-3.5 w-3.5 shrink-0" />
            Package eligibility is confirmed during admin review — not shown until approval
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative glass rounded-2xl p-8 flex flex-col border
                         transition-all duration-300 hover:shadow-xl
                         ${pkg.accentClass} ${pkg.glowClass}
                         ${pkg.featured ? 'md:-translate-y-2 md:scale-[1.02]' : ''}`}
            >
              {/* Package badge */}
              <div className="flex items-center justify-between mb-6">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-display
                                 font-medium border ${pkg.badgeClass}`}>
                  {pkg.name}
                </span>
                {pkg.featured && (
                  <span className="text-xs font-display text-slate-500">Most popular</span>
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                <span className={`font-mono text-4xl font-bold ${pkg.priceColor}`}>
                  ${pkg.price.toLocaleString()}
                </span>
                <span className="text-slate-500 text-sm ml-1">/month</span>
              </div>

              {/* Balance range */}
              <div className="mb-8">
                <span className="text-xs text-slate-600 font-display uppercase tracking-wider">
                  {pkg.rangeLabel}
                </span>
                <p className="font-mono text-sm text-slate-400 mt-0.5">{pkg.range}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${pkg.iconColor}`} />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href="/signup" className="block">
                <Button
                  variant="secondary"
                  size="md"
                  className={`w-full border ${pkg.accentClass}`}
                >
                  Apply for Access
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-xs text-slate-600 mt-10 max-w-lg mx-auto"
        >
          Billing begins only after your application is approved and your subscription is
          manually activated by the AutoFX team. Accounts below $500 are not currently eligible.
        </motion.p>
      </div>
    </section>
  )
}
