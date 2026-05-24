import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_VENDORS } from '@/data/vendors'
import type { Vendor, CategoryKey, CategoryScore } from '@/types/vendor'
import { calculateOverallScore } from '@/utils/scoreUtils'
import { useCategoryStore } from './useCategoryStore'

interface VendorState {
  vendors: Vendor[]
  addVendor: (vendor: Vendor) => void
  updateVendor: (id: string, patch: Partial<Vendor>) => void
  deleteVendor: (id: string) => void
  addCategoryToAllVendors: (id: CategoryKey) => void
  removeCategoryFromAllVendors: (id: CategoryKey) => void
  recomputeAllScores: () => void
}

const UNSCORED: CategoryScore = {
  score: null,
  rationale: '',
  highlights: [],
  dataSource: 'unscored',
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, _get) => ({
      vendors: SEED_VENDORS,

      addVendor: (vendor) => set((s) => ({ vendors: [...s.vendors, vendor] })),

      updateVendor: (id, patch) => {
        const categories = useCategoryStore.getState().categories
        set((s) => ({
          vendors: s.vendors.map((v) => {
            if (v.id !== id) return v
            const updated = { ...v, ...patch, updatedAt: new Date().toISOString() }
            updated.overallScore = calculateOverallScore(updated, categories)
            return updated
          }),
        }))
      },

      deleteVendor: (id) =>
        set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),

      addCategoryToAllVendors: (id) => {
        set((s) => ({
          vendors: s.vendors.map((v) => ({
            ...v,
            scores: { ...v.scores, [id]: { ...UNSCORED } },
          })),
        }))
      },

      removeCategoryFromAllVendors: (id) => {
        const categories = useCategoryStore.getState().categories.filter((c) => c.id !== id)
        set((s) => ({
          vendors: s.vendors.map((v) => {
            const scores = { ...v.scores }
            delete scores[id]
            const updated = { ...v, scores }
            updated.overallScore = calculateOverallScore(updated, categories)
            return updated
          }),
        }))
      },

      recomputeAllScores: () => {
        const categories = useCategoryStore.getState().categories
        set((s) => ({
          vendors: s.vendors.map((v) => ({
            ...v,
            overallScore: calculateOverallScore(v, categories),
          })),
        }))
      },
    }),
    {
      name: 'ng-siem-vendors',
      partialize: (state) => ({ vendors: state.vendors }),
    },
  ),
)
