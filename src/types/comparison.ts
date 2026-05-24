import type { CategoryKey } from './vendor'

export type SortOption = 'overallScore' | 'name' | CategoryKey

export interface ComparisonState {
  selectedVendorIds: string[]
  activeView: 'matrix' | 'radar' | 'heatmap' | 'bar'
  activeCategories: CategoryKey[]
  sortBy: SortOption
  sortDirection: 'asc' | 'desc'
}
