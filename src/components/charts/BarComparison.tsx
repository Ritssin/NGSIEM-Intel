import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useVendorComparison } from '@/hooks/useVendorComparison'
import { EmptyState } from '@/components/ui/EmptyState'

export function BarComparison() {
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
    <ResponsiveContainer width="100%" height={Math.max(300, visibleCategories.length * 50)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 10]}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
          tickCount={6}
        />
        <YAxis
          dataKey="category"
          type="category"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
          width={75}
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
        <Legend
          wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}
        />
        {selectedVendors.map((vendor) => (
          <Bar
            key={vendor.id}
            dataKey={vendor.id}
            name={vendor.name}
            fill={vendor.logoColor}
            radius={[0, 3, 3, 0]}
            maxBarSize={20}
            fillOpacity={vendor.isSophos ? 1 : 0.75}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
