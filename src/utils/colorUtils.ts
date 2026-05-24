export function interpolateColor(score: number): string {
  if (score >= 9) return '#3B82F6'
  if (score >= 7) return '#22C55E'
  if (score >= 5) return '#F59E0B'
  return '#EF4444'
}

export function scoreToHeatmapBg(score: number | null, isDark: boolean): string {
  if (score === null) return isDark ? '#1E293B' : '#F1F5F9'
  const opacity = 0.15 + (score / 10) * 0.55
  const color = interpolateColor(score)
  return hexToRgba(color, opacity)
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
