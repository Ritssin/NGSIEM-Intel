import type { Vendor, CategoryDefinition } from '@/types/vendor'
import { scoreToBg } from '@/utils/colorUtils'

export function calculateOverallScore(vendor: Vendor, categories: CategoryDefinition[]): number {
  let weightedSum = 0
  let weightTotal = 0

  for (const cat of categories) {
    const scoreEntry = vendor.scores[cat.id]
    if (scoreEntry && scoreEntry.score !== null) {
      weightedSum += scoreEntry.score * cat.weight
      weightTotal += cat.weight
    }
  }

  if (weightTotal === 0) return 0
  return Math.round((weightedSum / weightTotal) * 10) / 10
}

export function getScoreColor(score: number | null): string {
  if (score === null) return 'text-text-muted'
  if (score >= 7) return 'text-feedback-positive'
  if (score >= 5) return 'text-feedback-caution'
  return 'text-feedback-negative'
}

export function getScoreBgColor(score: number | null): { bg: string; fg: string } {
  return scoreToBg(score)
}

export function getScoreBarColor(score: number | null): string {
  if (score === null) return 'bg-border-color'
  if (score >= 7) return 'bg-feedback-positive'
  if (score >= 5) return 'bg-feedback-caution'
  return 'bg-feedback-negative'
}

export function normalizeWeights(weights: Record<string, number>): Record<string, number> {
  const total = Object.values(weights).reduce((s, w) => s + w, 0)
  if (total === 0) return weights
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(weights)) {
    result[k] = v / total
  }
  return result
}

export const CUSTOM_COLORS = [
  '#3996f3', '#007769', '#bc108e', '#cc5c00',
  '#5a068e', '#0c70d4', '#538184', '#9976a6',
]

export function getCustomColor(index: number): string {
  return CUSTOM_COLORS[index % CUSTOM_COLORS.length]
}
