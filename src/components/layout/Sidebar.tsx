import { useState } from 'react'
import { useVendorStore } from '@/store/useVendorStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { Button } from '@/components/ui/Button'
import { MIcon } from '@/components/ui/MIcon'
import { AddVendorModal } from '@/components/vendors/AddVendorModal'

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
    <aside
      className="w-64 flex-shrink-0 flex flex-col h-full no-print"
      style={{ background: 'var(--color-bg-sidebar)', color: '#e0e0e0' }}
    >
      <div className="p-3" style={{ borderBottom: '1px solid #3a3b3c' }}>
        <p className="type-badge-small mb-2" style={{ color: '#9e9e9e' }}>
          Vendors · {selectedVendorIds.length} of 7 selected
        </p>
        <div className="relative">
          <MIcon name="search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
            style={{
              background: '#363738',
              border: '1px solid #434343',
              color: '#e0e0e0',
            }}
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
              className="w-full flex items-center gap-2 px-2 py-2 text-left transition-all duration-150 mb-0.5 rounded"
              style={{
                background: selected ? '#404142' : undefined,
                color: selected ? '#f5f5f5' : '#bdbdbd',
                borderLeft: selected ? '3px solid #65adf6' : '3px solid transparent',
                opacity: disabled && !selected ? 0.4 : 1,
                cursor: disabled && !selected ? 'not-allowed' : locked ? 'default' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!selected && !disabled) e.currentTarget.style.background = '#3a3b3c'
              }}
              onMouseLeave={(e) => {
                if (!selected) e.currentTarget.style.background = ''
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: vendor.logoColor }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium truncate">{vendor.name}</span>
                  {vendor.isSophos && (
                    <span
                      className="type-badge-small px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--color-sophos-tag-bg)', color: 'var(--color-sophos-tag-fg)' }}
                    >
                      US
                    </span>
                  )}
                  {vendor.isCustom && (
                    <span
                      className="type-badge-small px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'var(--color-bg-info)', color: 'var(--color-info)' }}
                    >
                      CUSTOM
                    </span>
                  )}
                </div>
                <p className="text-xs truncate" style={{ color: '#9e9e9e' }}>{vendor.productName}</p>
              </div>

              <div className="flex-shrink-0 flex items-center">
                {selected ? (
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ background: 'var(--color-sophos-blue)' }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border-2" style={{ borderColor: '#434343' }} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="p-3" style={{ borderTop: '1px solid #3a3b3c' }}>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => setAddOpen(true)}
        >
          <MIcon name="add" size={14} />
          Add Vendor
        </Button>
      </div>

      <AddVendorModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </aside>
  )
}
