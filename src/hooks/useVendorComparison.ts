import { useMemo } from 'react'
import { useVendorStore } from '@/store/useVendorStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { calculateOverallScore } from '@/utils/scoreUtils'

export function useVendorComparison() {
  const vendors = useVendorStore((s) => s.vendors)
  const categories = useCategoryStore((s) => s.categories)
  const { selectedVendorIds, hiddenCategories, sortBy, sortDirection } = useComparisonStore()

  const selectedVendors = useMemo(() => {
    const selected = vendors.filter((v) => selectedVendorIds.includes(v.id))

    // Recalculate overall scores with current category weights
    const withScores = selected.map((v) => ({
      ...v,
      overallScore: calculateOverallScore(v, categories),
    }))

    // Sort — but keep Sophos pinned first
    const sophos = withScores.find((v) => v.isSophos)
    const others = withScores.filter((v) => !v.isSophos)

    others.sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      if (sortBy === 'overallScore') {
        aVal = a.overallScore
        bVal = b.overallScore
      } else if (sortBy === 'name') {
        aVal = a.name
        bVal = b.name
      } else {
        aVal = a.scores[sortBy]?.score ?? -1
        bVal = b.scores[sortBy]?.score ?? -1
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      const diff = (aVal as number) - (bVal as number)
      return sortDirection === 'asc' ? diff : -diff
    })

    return sophos ? [sophos, ...others] : others
  }, [vendors, categories, selectedVendorIds, sortBy, sortDirection])

  const visibleCategories = useMemo(
    () => categories.filter((c) => !hiddenCategories.includes(c.id)),
    [categories, hiddenCategories],
  )

  return { selectedVendors, visibleCategories, categories }
}
