import type { Vendor, CategoryDefinition } from '@/types/vendor'

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
  if (score >= 9) return 'text-blue-500'
  if (score >= 7) return 'text-green-500'
  if (score >= 5) return 'text-amber-500'
  return 'text-red-500'
}

export function getScoreBgColor(score: number | null): string {
  if (score === null) return 'bg-bg-hover text-text-muted'
  if (score >= 9) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  if (score >= 7) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
  if (score >= 5) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
}

export function getScoreBarColor(score: number | null): string {
  if (score === null) return 'bg-border-color'
  if (score >= 9) return 'bg-blue-500'
  if (score >= 7) return 'bg-green-500'
  if (score >= 5) return 'bg-amber-500'
  return 'bg-red-500'
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
  '#8B5CF6', '#10B981', '#F59E0B', '#EC4899',
  '#6366F1', '#14B8A6', '#F97316', '#DB2777',
]

export function getCustomColor(index: number): string {
  return CUSTOM_COLORS[index % CUSTOM_COLORS.length]
}
