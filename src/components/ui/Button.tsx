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
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sophos-blue focus:ring-offset-1',
          {
            'bg-sophos-blue text-white hover:bg-sophos-blue-light shadow-sm': variant === 'primary',
            'bg-bg-card text-text-primary border border-border-color hover:bg-bg-hover': variant === 'secondary',
            'text-text-secondary hover:text-text-primary hover:bg-bg-hover': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            'px-2 py-1 text-xs gap-1': size === 'sm',
            'px-3 py-1.5 text-sm gap-1.5': size === 'md',
            'px-4 py-2 text-base gap-2': size === 'lg',
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
