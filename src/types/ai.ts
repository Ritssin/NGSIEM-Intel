import type { CategoryKey } from './vendor'

export interface AIAssessmentRequest {
  vendorName: string
  productName: string
  additionalContext?: string
  categories: Array<{
    id: CategoryKey
    label: string
    description: string
    scoringGuide: { low: string; mid: string; high: string }
  }>
}

export interface AICategoryScore {
  score: number
  rationale: string
  highlights: string[]
}

export interface AIAssessmentResponse {
  vendorName: string
  productName: string
  description: string
  scores: Record<CategoryKey, AICategoryScore>
  tags: string[]
  marketPosition: 'Leader' | 'Challenger' | 'Niche' | 'Visionary'
  confidence: 'high' | 'medium' | 'low'
  caveats: string
}
