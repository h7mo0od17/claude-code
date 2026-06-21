import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-300 font-display"
          >
            {label}
            {props.required && (
              <span className="text-amethyst-light ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg bg-nebula border px-4 py-2.5 text-sm text-slate-100',
              'placeholder:text-slate-600 font-body',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-amethyst/40 focus:border-amethyst/50',
              error
                ? 'border-red-500/50 focus:ring-red-500/30'
                : 'border-glass-border hover:border-glass-border-hover',
              prefix && 'pl-8',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-500">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
