import { clsx } from 'clsx'
import { getScoreBgColor } from '@/utils/scoreUtils'

interface ScoreBadgeProps {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-bold rounded-full',
        {
          'w-7 h-7 text-xs': size === 'sm',
          'w-9 h-9 text-sm': size === 'md',
          'w-11 h-11 text-base': size === 'lg',
        },
        getScoreBgColor(score),
        className,
      )}
    >
      {score !== null ? score : '—'}
    </span>
  )
}
