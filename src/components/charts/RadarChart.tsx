import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { useVendorComparison } from '@/hooks/useVendorComparison'
import { EmptyState } from '@/components/ui/EmptyState'

export function RadarChart() {
  const { selectedVendors, visibleCategories } = useVendorComparison()

  if (selectedVendors.length === 0) {
    return <EmptyState title="No vendors selected" description="Select vendors from the sidebar." />
  }

  const data = visibleCategories.map((cat) => {
    const point: Record<string, string | number> = { category: cat.shortLabel }
    for (const vendor of selectedVendors) {
      point[vendor.id] = vendor.scores[cat.id]?.score ?? 0
    }
    return point
  })

  return (
    <ResponsiveContainer width="100%" height={420}>
      <RechartsRadarChart data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
          tickCount={6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: 'var(--color-text-primary)',
            fontSize: '12px',
          }}
        />
        {selectedVendors.map((vendor) => (
          <Radar
            key={vendor.id}
            name={vendor.name}
            dataKey={vendor.id}
            stroke={vendor.logoColor}
            fill={vendor.logoColor}
            fillOpacity={vendor.isSophos ? 0.25 : 0.08}
            strokeWidth={vendor.isSophos ? 2.5 : 1.5}
          />
        ))}
        <Legend
          wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
          formatter={(value) => {
            const v = selectedVendors.find((vendor) => vendor.name === value)
            return v?.isSophos ? `${value} ★` : value
          }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
