import { Download, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
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
    <header className="h-14 flex items-center px-4 gap-3 border-b border-border-color bg-bg-card sticky top-0 z-40 no-print">
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <img src="/sophos-logo.svg" alt="Sophos" className="h-7 text-text-primary" />
      </div>

      <div className="w-px h-6 bg-border-color mx-1" />

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-text-primary truncate">
          NG SIEM Vendor Intelligence
        </h1>
        <p className="text-xs text-text-muted hidden sm:block">Competitive Analysis Platform</p>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Export dropdown */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExportOpen((o) => !o)}
          >
            <Download size={14} />
            Export
            <ChevronDown size={12} />
          </Button>
          {exportOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setExportOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-bg-card border border-border-color rounded-lg shadow-lg overflow-hidden">
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

        <ThemeToggle />
      </div>
    </header>
  )
}
