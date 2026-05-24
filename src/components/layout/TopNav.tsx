import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { MIcon } from '@/components/ui/MIcon'
import { useVendorStore } from '@/store/useVendorStore'
import { useCategoryStore } from '@/store/useCategoryStore'

export function TopNav() {
  const [exportOpen, setExportOpen] = useState(false)
  const vendors = useVendorStore((s) => s.vendors)
  const categories = useCategoryStore((s) => s.categories)

  function exportCSV() {
    const headers = ['Vendor', 'Product', 'Overall Score', ...categories.map((c) => c.label)]
    const rows = vendors.map((v) => [
      v.name,
      v.productName,
      v.overallScore.toString(),
      ...categories.map((c) => {
        const s = v.scores[c.id]
        return s?.score !== null ? String(s?.score ?? '') : 'N/A'
      }),
    ])
    const csv = [headers, ...rows].map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ng-siem-comparison.csv'
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ vendors, categories }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ng-siem-comparison.json'
    a.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }

  function printPage() {
    window.print()
    setExportOpen(false)
  }

  return (
    <header
      className="h-12 flex items-center px-4 gap-3 sticky top-0 z-40 no-print"
      style={{ background: 'var(--color-nav-bg)', color: '#fff' }}
    >
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <img src="/sophos-logo-white.svg" alt="Sophos" className="h-5" />
      </div>

      <div className="w-px h-5 bg-white/20 mx-1" />

      <div className="flex-1 min-w-0">
        <h1 className="type-page-title text-white truncate" style={{ fontSize: 16 }}>
          NG SIEM Vendor Intelligence
        </h1>
        <p className="type-base-small hidden sm:block uppercase" style={{ color: 'var(--color-nav-text)', fontSize: 10 }}>
          NG SIEM vendor analysis
        </p>
      </div>

      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            onClick={() => setExportOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg transition-all duration-150 type-button"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.08)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <MIcon name="download" size={16} />
            Export
            <MIcon name="expand_more" size={16} />
          </button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-bg-card border border-border-color rounded shadow-lg overflow-hidden">
                <button
                  onClick={exportCSV}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-hover"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportJSON}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-hover"
                >
                  Export JSON
                </button>
                <button
                  onClick={printPage}
                  className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-hover"
                >
                  Print
                </button>
              </div>
            </>
          )}
        </div>

        <ThemeToggle className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10" />
      </div>
    </header>
  )
}
