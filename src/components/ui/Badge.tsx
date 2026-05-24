import { type ReactNode, type CSSProperties } from 'react'
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
        'inline-flex items-center font-semibold rounded',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
          'bg-bg-hover text-text-secondary': variant === 'default',
        },
        className,
      )}
      style={variant !== 'default' ? getFeedbackStyle(variant) : undefined}
    >
      {children}
    </span>
  )
}

function getFeedbackStyle(variant: string): CSSProperties {
  switch (variant) {
    case 'blue':   return { background: 'var(--color-sophos-tag-bg)', color: 'var(--color-sophos-tag-fg)' }
    case 'green':  return { background: 'var(--color-bg-positive)', color: '#1f5a2b' }
    case 'amber':  return { background: 'var(--color-bg-caution)', color: '#5c4a07' }
    case 'red':    return { background: 'var(--color-bg-negative)', color: '#6c0511' }
    case 'purple': return { background: 'var(--color-bg-info)', color: 'var(--color-info)' }
    default:       return {}
  }
}
