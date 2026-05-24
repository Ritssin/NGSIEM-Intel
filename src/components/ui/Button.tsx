import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-semibold tracking-[0.025em] rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sophos-blue focus:ring-offset-1',
          {
            'bg-sophos-blue text-white hover:bg-sophos-blue-light': variant === 'primary',
            'bg-transparent text-text-primary border border-border-color hover:bg-bg-hover': variant === 'secondary',
            'text-text-secondary hover:text-text-primary hover:bg-bg-hover': variant === 'ghost',
            'bg-[var(--color-negative)] text-white hover:bg-[#8e0217]': variant === 'danger',
            'h-7 px-2.5 text-xs gap-1.5': size === 'sm',
            'h-9 px-3.5 text-sm gap-2': size === 'md',
            'h-11 px-5 text-base gap-2.5': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
