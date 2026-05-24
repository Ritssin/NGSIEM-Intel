import { useState } from 'react'
import { Trash2, Plus, RotateCcw } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { WeightSummaryBar } from './WeightSummaryBar'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useVendorStore } from '@/store/useVendorStore'
import { clsx } from 'clsx'

interface ManageCategoriesModalProps {
  isOpen: boolean
  onClose: () => void
}

const ICON_OPTIONS = [
  'Cpu', 'Clock', 'TrendingUp', 'FileText', 'Rocket', 'Plug',
  'Code2', 'Layers', 'Shield', 'Globe', 'Database', 'Zap',
  'Users', 'Lock', 'Eye', 'Server',
]

export function ManageCategoriesModal({ isOpen, onClose }: ManageCategoriesModalProps) {
  const { categories, updateWeight, removeCategory, addCategory, normalizeWeights } = useCategoryStore()
  const { vendors, addCategoryToAllVendors, removeCategoryFromAllVendors } = useVendorStore()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newShortLabel, setNewShortLabel] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newWeight, setNewWeight] = useState('10')
  const [newIcon, setNewIcon] = useState('Shield')
  const [newScoringLow, setNewScoringLow] = useState('')
  const [newScoringMid, setNewScoringMid] = useState('')
  const [newScoringHigh, setNewScoringHigh] = useState('')

  function handleWeightChange(id: string, pct: number) {
    updateWeight(id, Math.max(0, Math.min(100, pct)) / 100)
  }

  function handleRemove(id: string) {
    const hasScores = vendors.some((v) => {
      const s = v.scores[id]
      return s && s.score !== null
    })
    if (hasScores) {
      setDeleteConfirmId(id)
    } else {
      doRemove(id)
    }
  }

  function doRemove(id: string) {
    removeCategoryFromAllVendors(id)
    removeCategory(id)
    setDeleteConfirmId(null)
  }

  function handleAddCategory() {
    if (!newLabel.trim()) return
    const id = addCategory({
      label: newLabel.trim(),
      shortLabel: newShortLabel.trim() || newLabel.slice(0, 5),
      description: newDescription.trim(),
      weight: parseFloat(newWeight) / 100 || 0.1,
      icon: newIcon,
      scoringGuide: {
        low: newScoringLow || 'Poor performance in this area.',
        mid: newScoringMid || 'Average performance in this area.',
        high: newScoringHigh || 'Excellent performance in this area.',
      },
    })
    addCategoryToAllVendors(id)
    setNewLabel('')
    setNewShortLabel('')
    setNewDescription('')
    setNewWeight('10')
    setShowAddForm(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories" width="lg">
      <WeightSummaryBar />

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-text-secondary">
          {categories.length} categories · drag weights to adjust scoring model
        </p>
        <Button variant="secondary" size="sm" onClick={normalizeWeights}>
          <RotateCcw size={12} />
          Normalize
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        {categories.map((cat) => {
          const pct = Math.round(cat.weight * 100)
          const isConfirming = deleteConfirmId === cat.id
          return (
            <div key={cat.id} className="bg-bg-secondary rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-text-primary">{cat.label}</span>
                    {cat.isBuiltIn && (
                      <span className="text-xs text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">built-in</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="1"
                      value={pct}
                      onChange={(e) => handleWeightChange(cat.id, parseInt(e.target.value))}
                      className="flex-1 h-1.5 accent-sophos-blue cursor-pointer"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={pct}
                        onChange={(e) => handleWeightChange(cat.id, parseInt(e.target.value) || 0)}
                        className="w-12 text-center text-xs bg-bg-card border border-border-color rounded px-1 py-0.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-sophos-blue"
                      />
                      <span className="text-xs text-text-muted">%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(cat.id)}
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors flex-shrink-0',
                    isConfirming
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
                  )}
                  title="Remove category"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Inline delete confirmation */}
              {isConfirming && (
                <div className="px-3 pb-3 border-t border-red-200 dark:border-red-800/50 pt-2.5 bg-red-50/50 dark:bg-red-900/10">
                  <p className="text-xs text-red-700 dark:text-red-300 mb-2">
                    Removing <strong>{cat.label}</strong> will delete scores for all vendors. Continue?
                  </p>
                  <div className="flex gap-2">
                    <Button variant="danger" size="sm" onClick={() => doRemove(cat.id)}>Delete</Button>
                    <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new category */}
      {showAddForm ? (
        <div className="border border-border-color rounded p-4 space-y-3">
          <p className="text-sm font-semibold text-text-primary">New Category</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Label *</label>
              <input
                type="text"
                placeholder="e.g. Compliance Support"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Short label</label>
              <input
                type="text"
                placeholder="e.g. Comply"
                maxLength={8}
                value={newShortLabel}
                onChange={(e) => setNewShortLabel(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Description</label>
            <input
              type="text"
              placeholder="What does this category measure?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Initial weight %</label>
              <input
                type="number"
                min="1"
                max="100"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Icon</label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary">Scoring guide</p>
            <input
              type="text"
              placeholder="Score 1–4: What does poor look like?"
              value={newScoringLow}
              onChange={(e) => setNewScoringLow(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-bg-secondary border border-red-200 dark:border-red-900/50 rounded-lg text-text-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Score 5–6: What does average look like?"
              value={newScoringMid}
              onChange={(e) => setNewScoringMid(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-bg-secondary border border-amber-200 dark:border-amber-900/50 rounded-lg text-text-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Score 7–10: What does excellent look like?"
              value={newScoringHigh}
              onChange={(e) => setNewScoringHigh(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-bg-secondary border border-green-200 dark:border-green-900/50 rounded-lg text-text-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button variant="primary" size="sm" onClick={handleAddCategory} disabled={!newLabel.trim()}>
              <Plus size={12} />
              Add Category
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setShowAddForm(true)} className="w-full">
          <Plus size={14} />
          Add New Category
        </Button>
      )}

      <div className="mt-4 pt-4 border-t border-border-color">
        <p className="text-xs text-text-muted">
          Tip: Use "Normalize" to automatically redistribute weights to 100%.
          Changes to categories and weights are saved automatically.
        </p>
      </div>
    </Modal>
  )
}
