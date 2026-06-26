import { cn } from '@/lib/utils'

type BadgeVariant = 'pending' | 'approved' | 'rejected' | 'active' | 'paid' | 'unpaid' | 'bronze' | 'silver' | 'gold' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  pending:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  approved: 'text-green-400 bg-green-400/10 border-green-400/25',
  rejected: 'text-red-400 bg-red-400/10 border-red-400/25',
  active:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/25',
  paid:     'text-green-400 bg-green-400/10 border-green-400/25',
  unpaid:   'text-slate-400 bg-slate-400/10 border-slate-400/25',
  bronze:   'text-amber-400 bg-amber-400/10 border-amber-400/25',
  silver:   'text-slate-300 bg-slate-300/10 border-slate-300/25',
  gold:     'text-champagne bg-champagne/10 border-champagne/25',
  default:  'text-slate-400 bg-slate-400/10 border-slate-400/25',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-display',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
