'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  Eye,
  Lock,
} from 'lucide-react'

const FEATURES = [
  {
    icon: ShieldCheck,
    category: 'Control',
    title: 'Your funds never leave your account',
    body: 'AutoFX never holds, touches, or transfers your money. Funds stay inside your own verified Exness account throughout.',
  },
  {
    icon: Zap,
    category: 'Execution',
    title: 'Real-time strategy mirroring',
    body: 'The moment a strategy trade executes, the same trade mirrors into your account — automatically, with no manual intervention needed.',
  },
  {
    icon: BarChart3,
    category: 'Transparency',
    title: 'Full trade visibility in Exness',
    body: 'Every mirrored trade appears directly in your Exness account history. You see exactly what was placed, when, and at what price.',
  },
  {
    icon: Lock,
    category: 'Risk',
    title: 'Position sizing proportional to your balance',
    body: 'Trade sizes are scaled to your account balance — not the strategy account\'s. You are never over-exposed relative to your capital.',
  },
  {
    icon: Users,
    category: 'Access',
    title: 'Individually reviewed applications',
    body: 'Every account is reviewed by a human before activation. We keep client numbers manageable to maintain quality of service.',
  },
  {
    icon: Eye,
    category: 'Oversight',
    title: 'Cancel at any time',
    body: 'Stop mirroring and cancel your subscription at any point. Your Exness account and funds are always under your sole control.',
  },
]

export default function Features() {
  return (
    <section className="py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-4">
            Why AutoFX
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white max-w-lg leading-tight">
              Designed around trust and control
            </h2>
            <p className="text-slate-500 max-w-sm leading-relaxed text-sm">
              Every structural decision in AutoFX was made to keep the investor
              in control and fully informed.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-xl p-6 border border-glass-border
                           hover:border-amethyst/25 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amethyst/10 border border-amethyst/20
                                 flex items-center justify-center shrink-0
                                 group-hover:bg-amethyst/15 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-amethyst-light" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-display uppercase tracking-wider
                                 text-amethyst-light/70 mb-1">
                      {feature.category}
                    </p>
                    <h3 className="font-display font-semibold text-white text-base mb-2 leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
