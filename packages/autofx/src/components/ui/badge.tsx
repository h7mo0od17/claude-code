import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-600/20 text-primary-400 border border-primary-600/30",
        success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        danger: "bg-red-500/20 text-red-400 border border-red-500/30",
        secondary: "bg-secondary-600/20 text-secondary-400 border border-secondary-600/30",
        outline: "border border-autofx-dark-border text-gray-400",
        bronze: "bg-amber-600/20 text-amber-400 border border-amber-600/30",
        silver: "bg-slate-400/20 text-slate-300 border border-slate-400/30",
        gold: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
