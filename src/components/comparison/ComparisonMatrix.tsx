import { Tooltip } from '@/components/ui/Tooltip'
import { ScoreBadge } from './ScoreBadge'
import { MatrixCell } from './MatrixCell'
import { useVendorComparison } from '@/hooks/useVendorComparison'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatWeight } from '@/utils/formatUtils'
import { clsx } from 'clsx'

export function ComparisonMatrix() {
  const { selectedVendors, visibleCategories } = useVendorComparison()

  if (selectedVendors.length === 0) {
    return <EmptyState title="No vendors selected" description="Select vendors from the sidebar to start comparing." />
  }

  return (
    <div className="overflow-auto print-full-width">
      <table className="w-full border-collapse text-sm" style={{ minWidth: `${200 + selectedVendors.length * 120}px` }}>
        <thead>
          <tr className="sticky top-0 z-20 bg-bg-card">
            <th className="sticky left-0 z-30 bg-bg-card w-48 min-w-[12rem] px-4 py-3 text-left border-b border-r border-border-color">
              <span className="type-tbl-head text-text-muted uppercase">Category</span>
            </th>

            {selectedVendors.map((vendor) => (
              <th
                key={vendor.id}
                className={clsx(
                  'px-3 py-3 border-b border-border-color text-center min-w-[110px]',
                  vendor.isSophos && 'border-l-2 border-r-2 border-t-2 border-sophos-blue/40',
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: vendor.logoColor }}
                    />
                    <span className="type-tbl-head text-text-primary truncate max-w-[80px]">
                      {vendor.name}
                    </span>
                    {vendor.isSophos && (
                      <span
                        className="type-badge-small px-2 py-0.5 rounded flex-shrink-0"
                        style={{ background: 'var(--color-sophos-tag-bg)', color: 'var(--color-sophos-tag-fg)' }}
                      >
                        US
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate max-w-[100px]">{vendor.productName}</p>
                  <ScoreBadge score={vendor.overallScore} size="sm" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleCategories.map((category, rowIdx) => (
            <tr
              key={category.id}
              className={clsx(
                'border-b border-border-color transition-colors hover:bg-bg-secondary/50',
                rowIdx % 2 === 0 ? 'bg-bg-card' : 'bg-bg-primary',
              )}
            >
              <td className="sticky left-0 z-10 px-4 py-2 border-r border-border-color"
                style={{ backgroundColor: 'var(--color-bg-card)' }}>
                <Tooltip
                  content={
                    <div>
                      <p className="font-semibold mb-1">{category.label}</p>
                      <p className="text-gray-300 mb-2">{category.description}</p>
                      <p className="text-gray-400 text-[11px]">Weight: {formatWeight(category.weight)}</p>
                    </div>
                  }
                  placement="right"
                >
                  <div className="cursor-help">
                    <p className="text-sm font-medium text-text-primary">{category.label}</p>
                    <p className="text-xs text-text-muted">{formatWeight(category.weight)}</p>
                  </div>
                </Tooltip>
              </td>

              {selectedVendors.map((vendor) => (
                <td
                  key={vendor.id}
                  className={clsx(
                    'text-center border-border-color',
                    vendor.isSophos && 'border-l-2 border-r-2 border-sophos-blue/40',
                  )}
                >
                  <MatrixCell
                    vendor={vendor}
                    category={category}
                    scoreEntry={vendor.scores[category.id]}
                    isSophos={vendor.isSophos}
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Overall score row — big number display */}
          <tr className="bg-bg-secondary border-t-2 border-border-color font-semibold">
            <td className="sticky left-0 z-10 px-4 py-3 border-r border-border-color bg-bg-secondary">
              <p className="type-base-semibold text-text-primary">Overall Score</p>
              <p className="text-xs text-text-muted">Weighted average</p>
            </td>
            {selectedVendors.map((vendor) => (
              <td
                key={vendor.id}
                className={clsx(
                  'text-center py-3',
                  vendor.isSophos && 'border-l-2 border-r-2 border-b-2 border-sophos-blue/40',
                )}
              >
                <div className="flex flex-col items-center gap-1">
                  <span style={{ font: '400 36px/1.22 Inter', color: 'var(--color-text-primary)' }}>
                    {vendor.overallScore.toFixed(1)}
                  </span>
                  <span className="type-base-small uppercase" style={{ color: 'var(--color-text-muted)' }}>
                    Weighted
                  </span>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
