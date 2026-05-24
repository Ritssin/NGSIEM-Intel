import { clsx } from 'clsx'
import { getScoreBgColor } from '@/utils/scoreUtils'

interface ScoreBadgeProps {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ScoreBadge({ score, size = 'md', className }: ScoreBadgeProps) {
  const { bg, fg } = getScoreBgColor(score)
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-bold rounded',
        {
          'w-7 h-7 text-xs': size === 'sm',
          'w-9 h-9 text-sm': size === 'md',
          'w-11 h-11 text-base': size === 'lg',
        },
        className,
      )}
      style={{ backgroundColor: bg, color: fg }}
    >
      {score !== null ? score : '—'}
    </span>
  )
}
