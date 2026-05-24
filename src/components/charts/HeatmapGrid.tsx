import { useVendorComparison } from '@/hooks/useVendorComparison'
import { scoreToBg } from '@/utils/colorUtils'
import { EmptyState } from '@/components/ui/EmptyState'

export function HeatmapGrid() {
  const { selectedVendors, visibleCategories } = useVendorComparison()

  if (selectedVendors.length === 0) {
    return <EmptyState title="No vendors selected" description="Select vendors from the sidebar." />
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-xs" style={{ minWidth: `${160 + selectedVendors.length * 100}px` }}>
        <thead>
          <tr>
            <th className="sticky left-0 bg-bg-card z-10 px-4 py-2 text-left border-b border-r border-border-color w-48 type-tbl-head text-text-muted">
              Category
            </th>
            {selectedVendors.map((v) => (
              <th
                key={v.id}
                className="px-3 py-2 border-b border-border-color text-center type-tbl-head"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.logoColor }} />
                  <span className="text-text-primary truncate max-w-[80px]">{v.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleCategories.map((cat) => (
            <tr key={cat.id} className="border-b border-border-color">
              <td className="sticky left-0 z-10 px-4 py-2 border-r border-border-color font-medium text-text-primary"
                style={{ backgroundColor: 'var(--color-bg-card)' }}>
                {cat.label}
              </td>
              {selectedVendors.map((vendor) => {
                const score = vendor.scores[cat.id]?.score ?? null
                const { bg, fg } = scoreToBg(score)
                return (
                  <td
                    key={vendor.id}
                    className="text-center py-3 font-bold transition-colors"
                    style={{ backgroundColor: bg, color: fg }}
                  >
                    {score !== null ? score : '—'}
                  </td>
                )
              })}
            </tr>
          ))}
          <tr className="border-t-2 border-border-color font-bold">
            <td className="sticky left-0 z-10 px-4 py-2 border-r border-border-color text-text-primary font-semibold"
              style={{ backgroundColor: 'var(--color-bg-card)' }}>
              Overall
            </td>
            {selectedVendors.map((vendor) => {
              const score = vendor.overallScore
              const { bg, fg } = scoreToBg(score)
              return (
                <td
                  key={vendor.id}
                  className="text-center py-2 text-sm"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  <span className="font-bold">{score}</span>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
