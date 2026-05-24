export function scoreToBg(score: number | null): { bg: string; fg: string } {
  if (score === null) return { bg: 'var(--color-bg-hover)', fg: 'var(--color-text-secondary)' }
  if (score >= 7) return { bg: 'var(--color-bg-positive)', fg: '#1f5a2b' }
  if (score >= 5) return { bg: 'var(--color-bg-caution)', fg: '#5c4a07' }
  return { bg: 'var(--color-bg-negative)', fg: '#6c0511' }
}

export function scoreToHeatmapBg(score: number | null): string {
  return scoreToBg(score).bg
}

export function interpolateColor(score: number): string {
  if (score >= 7) return 'var(--color-positive)'
  if (score >= 5) return 'var(--color-caution)'
  return 'var(--color-negative)'
}
