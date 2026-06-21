'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'purple' | 'gold' | 'blue' | 'bronze' | 'silver' | 'none'
  animate?: boolean
  delay?: number
}

const glowStyles: Record<string, string> = {
  purple: 'hover:border-amethyst/40 hover:shadow-lg hover:shadow-amethyst/10',
  gold:   'hover:border-champagne/40 hover:shadow-lg hover:shadow-champagne/10',
  blue:   'hover:border-sapphire/40 hover:shadow-lg hover:shadow-sapphire/10',
  bronze: 'hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10',
  silver: 'hover:border-slate-400/40 hover:shadow-lg hover:shadow-slate-400/10',
  none:   '',
}

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = 'purple',
  animate = true,
  delay = 0,
}: GlassCardProps) {
  const content = (
    <div
      className={cn(
        'glass rounded-xl p-6',
        'transition-all duration-300',
        hover && 'cursor-pointer',
        hover && glow !== 'none' && glowStyles[glow],
        className
      )}
    >
      {children}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {content}
    </motion.div>
  )
}
