import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useVendorStore } from '@/store/useVendorStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { Button } from '@/components/ui/Button'
import { AddVendorModal } from '@/components/vendors/AddVendorModal'
import { clsx } from 'clsx'

export function Sidebar() {
  const vendors = useVendorStore((s) => s.vendors)
  const { selectedVendorIds, toggleVendor, vendorSearch, setVendorSearch } = useComparisonStore()
  const [addOpen, setAddOpen] = useState(false)

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
      v.productName.toLowerCase().includes(vendorSearch.toLowerCase()),
  )

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border-color bg-bg-sidebar flex flex-col h-full no-print">
      <div className="p-3 border-b border-border-color">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
          Vendors ({selectedVendorIds.length}/7)
        </p>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-bg-card border border-border-color rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filtered.map((vendor) => {
          const selected = selectedVendorIds.includes(vendor.id)
          const disabled = !selected && selectedVendorIds.length >= 7
          const locked = vendor.isSophos

          return (
            <button
              key={vendor.id}
              onClick={() => !locked && toggleVendor(vendor.id)}
              disabled={disabled && !selected}
              className={clsx(
                'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 mb-0.5',
                selected
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
                disabled && !selected && 'opacity-40 cursor-not-allowed',
                locked && 'cursor-default',
              )}
            >
              {/* Color dot */}
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: vendor.logoColor }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate">{vendor.name}</span>
                  {vendor.isSophos && (
                    <span className="text-xs bg-sophos-blue text-white px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                      Us
                    </span>
                  )}
                  {vendor.isCustom && (
                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-1.5 py-0.5 rounded flex-shrink-0">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted truncate">{vendor.productName}</p>
              </div>

              <div className="flex-shrink-0 flex items-center">
                {selected ? (
                  <div className="w-4 h-4 rounded bg-sophos-blue flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border-2 border-border-color" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="p-3 border-t border-border-color">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={14} />
          Add Vendor
        </Button>
      </div>

      <AddVendorModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </aside>
  )
}
