import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_CATEGORIES } from '@/data/categories'
import type { CategoryDefinition, CategoryKey } from '@/types/vendor'
import { generateId, slugify } from '@/utils/formatUtils'

interface CategoryState {
  categories: CategoryDefinition[]
  addCategory: (def: Omit<CategoryDefinition, 'id' | 'isBuiltIn'>) => string
  removeCategory: (id: CategoryKey) => void
  updateWeight: (id: CategoryKey, weight: number) => void
  updateCategory: (id: CategoryKey, patch: Partial<Omit<CategoryDefinition, 'id' | 'isBuiltIn'>>) => void
  normalizeWeights: () => void
  totalWeight: () => number
  _onCategoryAdded?: (id: CategoryKey) => void
  _onCategoryRemoved?: (id: CategoryKey) => void
  registerCallbacks: (onAdded: (id: CategoryKey) => void, onRemoved: (id: CategoryKey) => void) => void
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (def) => {
        const id = slugify(def.label) + '-' + generateId()
        const newCat: CategoryDefinition = { ...def, id, isBuiltIn: false }
        set((s) => ({ categories: [...s.categories, newCat] }))
        get()._onCategoryAdded?.(id)
        return id
      },

      removeCategory: (id) => {
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }))
        get()._onCategoryRemoved?.(id)
      },

      updateWeight: (id, weight) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, weight } : c)),
        }))
      },

      updateCategory: (id, patch) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }))
      },

      normalizeWeights: () => {
        const cats = get().categories
        const total = cats.reduce((s, c) => s + c.weight, 0)
        if (total === 0) return
        set({
          categories: cats.map((c) => ({ ...c, weight: c.weight / total })),
        })
      },

      totalWeight: () => get().categories.reduce((s, c) => s + c.weight, 0),

      registerCallbacks: (onAdded, onRemoved) => {
        set({ _onCategoryAdded: onAdded, _onCategoryRemoved: onRemoved })
      },
    }),
    {
      name: 'ng-siem-categories',
      partialize: (state) => ({ categories: state.categories }),
    },
  ),
)
