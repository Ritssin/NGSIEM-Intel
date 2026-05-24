import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SortOption } from '@/types/comparison'
import type { CategoryKey } from '@/types/vendor'

interface ComparisonState {
  selectedVendorIds: string[]
  activeView: 'matrix' | 'radar' | 'heatmap' | 'bar'
  hiddenCategories: CategoryKey[]
  sortBy: SortOption
  sortDirection: 'asc' | 'desc'
  vendorSearch: string
  toggleVendor: (id: string) => void
  setActiveView: (view: ComparisonState['activeView']) => void
  toggleCategory: (id: CategoryKey) => void
  setSortBy: (sortBy: SortOption) => void
  setSortDirection: (dir: 'asc' | 'desc') => void
  setVendorSearch: (q: string) => void
  removeHiddenCategory: (id: CategoryKey) => void
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedVendorIds: ['sophos', 'splunk', 'microsoft-sentinel', 'crowdstrike'],
      activeView: 'matrix',
      hiddenCategories: [],
      sortBy: 'overallScore',
      sortDirection: 'desc',
      vendorSearch: '',

      toggleVendor: (id) => {
        const { selectedVendorIds } = get()
        if (selectedVendorIds.includes(id)) {
          // Can't deselect Sophos
          if (id === 'sophos') return
          set({ selectedVendorIds: selectedVendorIds.filter((v) => v !== id) })
        } else {
          if (selectedVendorIds.length >= 7) return
          set({ selectedVendorIds: [...selectedVendorIds, id] })
        }
      },

      setActiveView: (view) => set({ activeView: view }),

      toggleCategory: (id) => {
        const { hiddenCategories } = get()
        if (hiddenCategories.includes(id)) {
          set({ hiddenCategories: hiddenCategories.filter((c) => c !== id) })
        } else {
          set({ hiddenCategories: [...hiddenCategories, id] })
        }
      },

      setSortBy: (sortBy) => set({ sortBy }),
      setSortDirection: (dir) => set({ sortDirection: dir }),
      setVendorSearch: (q) => set({ vendorSearch: q }),

      removeHiddenCategory: (id) => {
        set((s) => ({ hiddenCategories: s.hiddenCategories.filter((c) => c !== id) }))
      },
    }),
    {
      name: 'ng-siem-comparison',
      partialize: (s) => ({
        selectedVendorIds: s.selectedVendorIds,
        activeView: s.activeView,
        hiddenCategories: s.hiddenCategories,
        sortBy: s.sortBy,
        sortDirection: s.sortDirection,
      }),
    },
  ),
)
