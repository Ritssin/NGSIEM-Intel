import { useVendorComparison } from '@/hooks/useVendorComparison'
import { useThemeStore } from '@/store/useThemeStore'
import { scoreToHeatmapBg } from '@/utils/colorUtils'
import { EmptyState } from '@/components/ui/EmptyState'

export function HeatmapGrid() {
  const { selectedVendors, visibleCategories } = useVendorComparison()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  if (selectedVendors.length === 0) {
    return <EmptyState title="No vendors selected" description="Select vendors from the sidebar." />
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-xs" style={{ minWidth: `${160 + selectedVendors.length * 100}px` }}>
        <thead>
          <tr>
            <th className="sticky left-0 bg-bg-card z-10 px-4 py-2.5 text-left border-b border-r border-border-color text-text-muted font-medium w-48">
              Category
            </th>
            {selectedVendors.map((v) => (
              <th
                key={v.id}
                className="px-3 py-2.5 border-b border-border-color text-center font-medium"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.logoColor }} />
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
                return (
                  <td
                    key={vendor.id}
                    className="text-center py-3 font-bold transition-colors"
                    style={{ backgroundColor: scoreToHeatmapBg(score, isDark) }}
                  >
                    <span className="text-text-primary">
                      {score !== null ? score : '—'}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
          <tr className="border-t-2 border-border-color font-bold">
            <td className="sticky left-0 z-10 px-4 py-2.5 border-r border-border-color text-text-primary font-semibold"
              style={{ backgroundColor: 'var(--color-bg-card)' }}>
              Overall
            </td>
            {selectedVendors.map((vendor) => {
              const score = vendor.overallScore
              return (
                <td
                  key={vendor.id}
                  className="text-center py-2.5 text-sm"
                  style={{ backgroundColor: scoreToHeatmapBg(score, isDark) }}
                >
                  <span className="font-bold text-text-primary">{score}</span>
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
