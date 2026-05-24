export type CategoryKey = string

export interface CategoryDefinition {
  id: CategoryKey
  label: string
  shortLabel: string
  description: string
  weight: number
  icon: string
  isBuiltIn: boolean
  scoringGuide: {
    low: string
    mid: string
    high: string
  }
}

export interface CategoryScore {
  score: number | null
  rationale: string
  highlights: string[]
  dataSource: 'manual' | 'ai-generated' | 'ai-reviewed' | 'unscored'
}

export interface Vendor {
  id: string
  name: string
  productName: string
  website: string
  logoColor: string
  isSophos: boolean
  isCustom: boolean
  description: string
  scores: Record<CategoryKey, CategoryScore>
  overallScore: number
  tags: string[]
  marketPosition: 'Leader' | 'Challenger' | 'Niche' | 'Visionary'
  createdAt: string
  updatedAt: string
}
