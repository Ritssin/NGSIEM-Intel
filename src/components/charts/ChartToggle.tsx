import { useComparisonStore } from '@/store/useComparisonStore'
import { MIcon } from '@/components/ui/MIcon'
import { Tabs } from '@/components/ui/Tabs'
import { RadarChart } from './RadarChart'
import { HeatmapGrid } from './HeatmapGrid'
import { BarComparison } from './BarComparison'

const CHART_TABS = [
  { id: 'radar', label: 'Radar', icon: <MIcon name="radar" size={13} /> },
  { id: 'heatmap', label: 'Heatmap', icon: <MIcon name="grid_view" size={13} /> },
  { id: 'bar', label: 'Bar Chart', icon: <MIcon name="bar_chart" size={13} /> },
]

export function ChartToggle() {
  const { activeView, setActiveView } = useComparisonStore()

  const view = activeView === 'matrix' ? 'radar' : activeView

  return (
    <div className="bg-bg-card border border-border-color rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-color">
        <h2 className="text-sm font-semibold text-text-primary">Visual Comparison</h2>
        <Tabs
          tabs={CHART_TABS}
          activeTab={view}
          onChange={(id) => setActiveView(id as 'radar' | 'heatmap' | 'bar')}
        />
      </div>
      <div className="p-4">
        {view === 'radar' && <RadarChart />}
        {view === 'heatmap' && <HeatmapGrid />}
        {view === 'bar' && <BarComparison />}
      </div>
    </div>
  )
}
