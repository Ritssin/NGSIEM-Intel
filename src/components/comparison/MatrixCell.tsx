import { useState } from 'react'
import { Info, Sparkles, Plus } from 'lucide-react'
import { ScoreBadge } from './ScoreBadge'
import type { CategoryScore, Vendor } from '@/types/vendor'
import type { CategoryDefinition } from '@/types/vendor'
import { useVendorStore } from '@/store/useVendorStore'
import { clsx } from 'clsx'

interface MatrixCellProps {
  vendor: Vendor
  category: CategoryDefinition
  scoreEntry: CategoryScore | undefined
  isSophos: boolean
}

export function MatrixCell({ vendor, category, scoreEntry, isSophos }: MatrixCellProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [editScore, setEditScore] = useState<string>('')
  const [editRationale, setEditRationale] = useState<string>('')
  const updateVendor = useVendorStore((s) => s.updateVendor)

  const score = scoreEntry?.score ?? null
  const isUnscored = !scoreEntry || scoreEntry.dataSource === 'unscored' || score === null

  function openEdit() {
    setEditScore(score !== null ? String(score) : '')
    setEditRationale(scoreEntry?.rationale ?? '')
    setPopoverOpen(true)
  }

  function saveEdit() {
    const num = parseFloat(editScore)
    if (isNaN(num) || num < 1 || num > 10) return
    const newScore: CategoryScore = {
      score: Math.round(num * 10) / 10,
      rationale: editRationale,
      highlights: scoreEntry?.highlights ?? [],
      dataSource: 'manual',
    }
    updateVendor(vendor.id, {
      scores: { ...vendor.scores, [category.id]: newScore },
    })
    setPopoverOpen(false)
  }

  return (
    <div className={clsx('relative flex items-center justify-center p-2', isSophos && 'bg-blue-50/30 dark:bg-blue-900/10')}>
      {isUnscored ? (
        <button
          onClick={openEdit}
          className="w-9 h-9 rounded-full border-2 border-dashed border-border-color flex items-center justify-center text-text-muted hover:border-sophos-blue hover:text-sophos-blue transition-colors"
          title="Add score"
        >
          <Plus size={14} />
        </button>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <ScoreBadge score={score} />
          <div className="flex items-center gap-1">
            {scoreEntry?.dataSource === 'ai-generated' && (
              <Sparkles size={10} className="text-purple-400" />
            )}
            <button
              onClick={openEdit}
              className="text-text-muted hover:text-text-secondary transition-colors"
              title="View details / edit"
            >
              <Info size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Score detail popover */}
      {popoverOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopoverOpen(false)} />
          <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-80 bg-bg-card border border-border-color rounded-xl shadow-2xl p-4">
            <p className="text-xs font-semibold text-text-secondary mb-3">
              {vendor.name} — {category.label}
            </p>

            {/* Show existing rationale */}
            {scoreEntry && !isUnscored && scoreEntry.rationale && (
              <div className="mb-3">
                <p className="text-xs text-text-secondary leading-relaxed mb-2">{scoreEntry.rationale}</p>
                {scoreEntry.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {scoreEntry.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-sophos-blue mt-0.5">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-border-color mt-3 pt-3" />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Score (1–10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={editScore}
                  onChange={(e) => setEditScore(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Rationale</label>
                <textarea
                  rows={3}
                  value={editRationale}
                  onChange={(e) => setEditRationale(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40 resize-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-sophos-blue text-white rounded-lg hover:bg-sophos-blue-light"
                >
                  Save
                </button>
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-bg-hover text-text-secondary rounded-lg hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
