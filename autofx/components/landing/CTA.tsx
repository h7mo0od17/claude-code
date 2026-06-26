'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative glass rounded-2xl p-12 sm:p-16 text-center overflow-hidden
                     border border-amethyst/20"
        >
          {/* Background glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 70%)',
            }}
          />

          {/* Content */}
          <div className="relative">
            <p className="text-xs font-display uppercase tracking-[0.2em] text-amethyst-light mb-6">
              Limited Availability
            </p>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
              Ready to start mirroring?
            </h2>

            <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
              AutoFX currently accepts a limited number of clients to maintain
              service quality. Begin your application — you need an Exness
              account with a minimum $500 balance to qualify.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="min-w-[200px] shadow-xl shadow-amethyst/20">
                  Apply for Access <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/exness">
                <Button variant="gold" size="lg" className="min-w-[200px]">
                  Open Exness Account <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-600 mt-8 max-w-md mx-auto">
              Don&apos;t have an Exness account? Open one through our partner link
              and return to apply. Minimum qualifying balance is $500 USD.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
