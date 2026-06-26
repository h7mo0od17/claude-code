'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  href?: string
}

const variants: Record<Variant, string> = {
  primary:
    'bg-amethyst text-white hover:bg-amethyst-dark shadow-lg shadow-amethyst/20 border border-amethyst/30',
  secondary:
    'bg-glass text-slate-200 hover:bg-glass-hover border border-glass-border hover:border-glass-border-hover',
  ghost:
    'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent',
  danger:
    'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40',
  gold:
    'bg-champagne/10 text-champagne hover:bg-champagne/20 border border-champagne/30 hover:border-champagne/50',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-5 py-2.5 text-sm h-10',
  lg: 'px-7 py-3.5 text-base h-12',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-display font-medium',
          'transition-colors duration-200 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
