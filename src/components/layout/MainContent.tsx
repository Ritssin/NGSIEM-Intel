import { useComparisonStore } from '@/store/useComparisonStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { ComparisonMatrix } from '@/components/comparison/ComparisonMatrix'
import { ChartToggle } from '@/components/charts/ChartToggle'
import { FilterBar } from '@/components/filters/FilterBar'
import { Tabs } from '@/components/ui/Tabs'
import { MIcon } from '@/components/ui/MIcon'
import { clsx } from 'clsx'

const MAIN_TABS = [
  { id: 'matrix', label: 'Matrix', icon: <MIcon name="grid_on" size={14} /> },
  { id: 'chart', label: 'Charts', icon: <MIcon name="radar" size={14} /> },
]

export function MainContent() {
  const { activeView, setActiveView } = useComparisonStore()
  const categories = useCategoryStore((s) => s.categories)
  const totalWeight = useCategoryStore((s) => s.totalWeight())
  const weightOff = Math.abs(Math.round(totalWeight * 100) - 100) > 1

  const mainView = activeView === 'matrix' ? 'matrix' : 'chart'

  return (
    <div className="flex flex-col h-full">
      {weightOff && (
        <div
          className="flex items-center gap-3 px-4 py-3 no-print"
          style={{ background: 'var(--color-bg-caution)', color: '#5c4a07' }}
        >
          <MIcon name="warning" size={16} />
          <span className="type-base">
            <b>Category weights sum to {Math.round(totalWeight * 100)}%.</b>{' '}
            Open Manage categories to normalize before publishing the comparison.
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-color bg-bg-card no-print">
        <Tabs
          tabs={MAIN_TABS}
          activeTab={mainView}
          onChange={(id) => setActiveView(id === 'matrix' ? 'matrix' : 'radar')}
        />
        <div className="text-xs text-text-muted ml-auto">
          {categories.length} categories
        </div>
      </div>

      <FilterBar />

      <div className={clsx('flex-1 overflow-auto p-4', mainView === 'matrix' ? '' : '')}>
        {mainView === 'matrix' ? (
          <div className="bg-bg-card border border-border-color rounded overflow-hidden">
            <ComparisonMatrix />
          </div>
        ) : (
          <ChartToggle />
        )}
      </div>
    </div>
  )
}
