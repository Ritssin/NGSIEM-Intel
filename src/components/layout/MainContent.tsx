import { Table2, Activity, AlertTriangle } from 'lucide-react'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { ComparisonMatrix } from '@/components/comparison/ComparisonMatrix'
import { ChartToggle } from '@/components/charts/ChartToggle'
import { FilterBar } from '@/components/filters/FilterBar'
import { Tabs } from '@/components/ui/Tabs'
import { clsx } from 'clsx'

const MAIN_TABS = [
  { id: 'matrix', label: 'Matrix', icon: <Table2 size={13} /> },
  { id: 'chart', label: 'Charts', icon: <Activity size={13} /> },
]

export function MainContent() {
  const { activeView, setActiveView } = useComparisonStore()
  const categories = useCategoryStore((s) => s.categories)
  const totalWeight = useCategoryStore((s) => s.totalWeight())
  const weightOff = Math.abs(Math.round(totalWeight * 100) - 100) > 1

  const mainView = activeView === 'matrix' ? 'matrix' : 'chart'

  return (
    <div className="flex flex-col h-full">
      {/* Weight warning banner */}
      {weightOff && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs no-print">
          <AlertTriangle size={14} />
          Category weights sum to {Math.round(totalWeight * 100)}% — overall scores may be inaccurate. Open Manage Categories to normalize.
        </div>
      )}

      {/* Toolbar */}
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
          <div className="bg-bg-card border border-border-color rounded-xl overflow-hidden">
            <ComparisonMatrix />
          </div>
        ) : (
          <ChartToggle />
        )}
      </div>
    </div>
  )
}
