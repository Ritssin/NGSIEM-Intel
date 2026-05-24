import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'purple'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'bg-bg-hover text-text-secondary': variant === 'default',
          'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300': variant === 'blue',
          'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300': variant === 'green',
          'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300': variant === 'amber',
          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300': variant === 'red',
          'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300': variant === 'purple',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
