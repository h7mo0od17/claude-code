'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import Button from '@/components/ui/Button'

/* ------------------------------------------------------------------ */
/* Mirror Rings — the signature element                                 */
/* Two counter-rotating conic rings visualise "two accounts mirroring" */
/* ------------------------------------------------------------------ */
function MirrorRings() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* Outer glow diffuse */}
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-30"
           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />

      {/* Outer ring — rotates clockwise */}
      <motion.div
        className="absolute w-[520px] h-[520px] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'conic-gradient(from 0deg, transparent 60%, rgba(124,58,237,0.5) 80%, rgba(167,139,250,0.8) 85%, rgba(124,58,237,0.5) 90%, transparent 100%)',
          borderRadius: '50%',
        }}
      />

      {/* Middle ring — rotates counter-clockwise */}
      <motion.div
        className="absolute w-[380px] h-[380px] rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'conic-gradient(from 180deg, transparent 55%, rgba(37,99,235,0.5) 75%, rgba(96,165,250,0.8) 80%, rgba(37,99,235,0.5) 85%, transparent 100%)',
          borderRadius: '50%',
        }}
      />

      {/* Inner champagne glow — pulses gently */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0.08) 60%, transparent 100%)',
        }}
      />

      {/* Centre label */}
      <div className="relative flex flex-col items-center justify-center text-center z-10">
        <span className="font-mono text-xs text-champagne/70 tracking-[0.2em] uppercase mb-1">
          LIVE
        </span>
        <motion.div
          className="w-2 h-2 rounded-full bg-champagne"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stats bar                                                           */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: '18', label: 'Active accounts', mono: true },
  { value: '$7,400', label: 'Avg. AUM', mono: true },
  { value: '99.4%', label: 'Execution rate', mono: true },
]

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background — starfield-like noise overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.12) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(37,99,235,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Mirror rings */}
      <MirrorRings />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                     border border-amethyst/25 bg-amethyst/8 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
          <span className="text-xs font-display font-medium text-slate-400 tracking-wider uppercase">
            Invite-Only Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl
                     text-white leading-[1.05] tracking-tight mb-6"
        >
          Your account.
          <br />
          <span className="text-gradient">Their edge.</span>
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          AutoFX mirrors professional trading strategies directly into your Exness
          account in real time. Your funds never leave your control — experts
          execute the strategy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/signup">
            <Button variant="primary" size="lg" className="shadow-xl shadow-amethyst/20 min-w-[200px]">
              Apply for Access <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" size="lg" className="min-w-[160px]">
              How it works
            </Button>
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-mono text-2xl font-semibold text-white mb-0.5">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-display">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#how-it-works"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                   text-slate-600 hover:text-slate-400 transition-colors"
      >
        <span className="text-xs font-display uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  )
}
