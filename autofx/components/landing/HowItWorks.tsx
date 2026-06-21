'use client'

import { motion } from 'framer-motion'
import { UserPlus, LinkIcon, ClipboardCheck, Zap } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    body: 'Sign up on AutoFX and complete your profile. Takes under two minutes.',
  },
  {
    number: '02',
    icon: LinkIcon,
    title: 'Connect your Exness account',
    body: "Submit your Exness account details. You'll need an active Exness trading account with a qualifying balance.",
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Application reviewed',
    body: 'Our team reviews your application within 24–48 hours. Your account balance determines your package eligibility.',
  },
  {
    number: '04',
    icon: Zap,
    title: 'Activate and mirror',
    body: 'Once approved, activate your subscription. AutoFX begins mirroring strategies into your account immediately.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-4 sm:px-6 relative">
      {/* Subtle divider gradient */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-4">
            The Process
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            From application to live mirroring
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A structured four-step process designed for serious investors.
            Every account is individually reviewed before activation.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)]"
          >
            <div
              className="h-px"
              style={{
                background:
                  'linear-gradient(90deg, rgba(124,58,237,0.6), rgba(37,99,235,0.6))',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center
                                 bg-amethyst/10 border border-amethyst/25 relative z-10"
                    >
                      <Icon className="h-7 w-7 text-amethyst-light" strokeWidth={1.5} />
                    </div>
                    {/* Step number */}
                    <span
                      className="absolute -top-2 -right-2 font-mono text-xs font-semibold
                                 text-champagne bg-void px-1.5 py-0.5 rounded border border-champagne/25"
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-white text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.body}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
