import { clsx } from 'clsx'
import { useCategoryStore } from '@/store/useCategoryStore'

export function WeightSummaryBar() {
  const totalWeight = useCategoryStore((s) => s.totalWeight())
  const pct = Math.round(totalWeight * 100)
  const isOk = Math.abs(pct - 100) <= 1
  const isWarning = !isOk && Math.abs(pct - 100) <= 5
  const isError = !isOk && !isWarning

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-text-secondary">Total weight</span>
        <span
          className={clsx('text-sm font-bold', {
            'text-green-500': isOk,
            'text-amber-500': isWarning,
            'text-red-500': isError,
          })}
        >
          {pct}%
          {!isOk && <span className="text-xs font-normal ml-1">— click Normalize to fix</span>}
        </span>
      </div>
      <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300', {
            'bg-green-500': isOk,
            'bg-amber-500': isWarning,
            'bg-red-500': isError,
          })}
          style={{ width: `${Math.min(pct, 110)}%` }}
        />
      </div>
    </div>
  )
}
