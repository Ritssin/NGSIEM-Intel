import { type ReactNode } from 'react'
import { clsx } from 'clsx'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex gap-1 p-1 bg-bg-secondary rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-150',
            activeTab === tab.id
              ? 'bg-bg-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover',
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )
}
