import { useState } from 'react'
import { Settings2, ArrowUpDown, ChevronDown } from 'lucide-react'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { ManageCategoriesModal } from '@/components/categories/ManageCategoriesModal'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

export function FilterBar() {
  const categories = useCategoryStore((s) => s.categories)
  const { hiddenCategories, toggleCategory, sortBy, sortDirection, setSortBy, setSortDirection } = useComparisonStore()
  const [manageOpen, setManageOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const sortOptions = [
    { value: 'overallScore', label: 'Overall Score' },
    { value: 'name', label: 'Vendor Name' },
    ...categories.map((c) => ({ value: c.id, label: c.label })),
  ]

  const activeSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sort'

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border-color bg-bg-card flex-wrap no-print">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide flex-shrink-0">Filters:</span>

      {/* Category chips */}
      <div className="flex items-center gap-1 flex-wrap flex-1">
        {categories.map((cat) => {
          const hidden = hiddenCategories.includes(cat.id)
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={clsx(
                'px-2.5 py-0.5 text-xs rounded-full transition-all duration-150 font-medium',
                hidden
                  ? 'bg-bg-hover text-text-muted line-through'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
              )}
            >
              {cat.shortLabel}
            </button>
          )
        })}
      </div>

      {/* Sort */}
      <div className="relative flex-shrink-0">
        <Button variant="ghost" size="sm" onClick={() => setSortOpen((o) => !o)}>
          <ArrowUpDown size={12} />
          {activeSortLabel}
          <ChevronDown size={12} />
        </Button>
        {sortOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-bg-card border border-border-color rounded-lg shadow-lg overflow-hidden">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (sortBy === opt.value) {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortBy(opt.value)
                      setSortDirection('desc')
                    }
                    setSortOpen(false)
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm hover:bg-bg-hover flex items-center justify-between',
                    sortBy === opt.value ? 'text-sophos-blue font-medium' : 'text-text-primary',
                  )}
                >
                  {opt.label}
                  {sortBy === opt.value && (
                    <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Manage categories */}
      <Button variant="ghost" size="sm" onClick={() => setManageOpen(true)} className="flex-shrink-0">
        <Settings2 size={12} />
        Manage
      </Button>

      <ManageCategoriesModal isOpen={manageOpen} onClose={() => setManageOpen(false)} />
    </div>
  )
}
