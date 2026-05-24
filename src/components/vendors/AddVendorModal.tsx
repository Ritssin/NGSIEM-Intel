import { useState } from 'react'
import { Sparkles, User, AlertCircle, CheckCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { StreamingText } from '@/components/ai/StreamingText'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAIAssessment } from '@/hooks/useAIAssessment'
import { useVendorStore } from '@/store/useVendorStore'
import { useComparisonStore } from '@/store/useComparisonStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { calculateOverallScore, getCustomColor } from '@/utils/scoreUtils'
import { generateId } from '@/utils/formatUtils'
import type { Vendor, CategoryScore } from '@/types/vendor'

interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
}

const hasApiKey = Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY)

const MODAL_TABS = [
  { id: 'manual', label: 'Manual Entry', icon: <User size={13} /> },
  { id: 'ai', label: 'AI Generate', icon: <Sparkles size={13} /> },
]

export function AddVendorModal({ isOpen, onClose }: AddVendorModalProps) {
  const [activeTab, setActiveTab] = useState('manual')
  const categories = useCategoryStore((s) => s.categories)
  const addVendor = useVendorStore((s) => s.addVendor)
  const vendors = useVendorStore((s) => s.vendors)
  const { selectedVendorIds, toggleVendor } = useComparisonStore()
  const { generate, isLoading, streamText, result, error, cancel, reset } = useAIAssessment()

  // Manual form state
  const [name, setName] = useState('')
  const [productName, setProductName] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [manualScores, setManualScores] = useState<Record<string, number>>({})
  const [marketPosition, setMarketPosition] = useState<Vendor['marketPosition']>('Challenger')

  // AI form state
  const [aiVendorName, setAiVendorName] = useState('')
  const [aiProductName, setAiProductName] = useState('')
  const [aiContext, setAiContext] = useState('')

  function resetForm() {
    setName('')
    setProductName('')
    setWebsite('')
    setDescription('')
    setManualScores({})
    setAiVendorName('')
    setAiProductName('')
    setAiContext('')
    reset()
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function saveManual() {
    if (!name.trim()) return
    const now = new Date().toISOString()
    const scores: Record<string, CategoryScore> = {}
    for (const cat of categories) {
      const s = manualScores[cat.id]
      scores[cat.id] = {
        score: s ?? null,
        rationale: '',
        highlights: [],
        dataSource: s ? 'manual' : 'unscored',
      }
    }
    const vendor: Vendor = {
      id: generateId(),
      name: name.trim(),
      productName: productName.trim() || name.trim(),
      website: website.trim(),
      logoColor: getCustomColor(vendors.length),
      isSophos: false,
      isCustom: true,
      description: description.trim(),
      scores,
      overallScore: 0,
      tags: [],
      marketPosition,
      createdAt: now,
      updatedAt: now,
    }
    vendor.overallScore = calculateOverallScore(vendor, categories)
    addVendor(vendor)
    if (selectedVendorIds.length < 7) {
      toggleVendor(vendor.id)
    }
    handleClose()
  }

  function saveAIResult() {
    if (!result) return
    const now = new Date().toISOString()
    const scores: Record<string, CategoryScore> = {}
    for (const cat of categories) {
      const aiScore = result.scores[cat.id]
      scores[cat.id] = aiScore
        ? {
            score: aiScore.score,
            rationale: aiScore.rationale,
            highlights: aiScore.highlights,
            dataSource: 'ai-generated',
          }
        : { score: null, rationale: '', highlights: [], dataSource: 'unscored' }
    }
    const vendor: Vendor = {
      id: generateId(),
      name: result.vendorName,
      productName: result.productName,
      website: '',
      logoColor: getCustomColor(vendors.length),
      isSophos: false,
      isCustom: true,
      description: result.description,
      scores,
      overallScore: 0,
      tags: result.tags,
      marketPosition: result.marketPosition,
      createdAt: now,
      updatedAt: now,
    }
    vendor.overallScore = calculateOverallScore(vendor, categories)
    addVendor(vendor)
    if (selectedVendorIds.length < 7) {
      toggleVendor(vendor.id)
    }
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Vendor" width="lg">
      <Tabs tabs={MODAL_TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />

      {/* Manual Entry */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Vendor Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. IBM"
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. QRadar SIEM"
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1 block">Market Position</label>
              <select
                value={marketPosition}
                onChange={(e) => setMarketPosition(e.target.value as Vendor['marketPosition'])}
                className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40"
              >
                <option>Leader</option>
                <option>Challenger</option>
                <option>Visionary</option>
                <option>Niche</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief vendor/product overview..."
              className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40 resize-none"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary mb-2">Category Scores (1–10, optional)</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary flex-1 truncate">{cat.label}</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={manualScores[cat.id] ?? ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      if (!isNaN(v)) setManualScores((s) => ({ ...s, [cat.id]: v }))
                      else setManualScores((s) => { const n = { ...s }; delete n[cat.id]; return n })
                    }}
                    placeholder="—"
                    className="w-14 text-center px-2 py-1 text-xs bg-bg-card border border-border-color rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-sophos-blue"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="primary" size="md" onClick={saveManual} disabled={!name.trim()}>
              Save Vendor
            </Button>
            <Button variant="ghost" size="md" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* AI Generate */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          {!hasApiKey && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                AI features require an Anthropic API key. Add <code>VITE_ANTHROPIC_API_KEY=your_key</code> to your <code>.env</code> file and restart.
              </p>
            </div>
          )}

          {!result ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Vendor Name *</label>
                  <input
                    type="text"
                    value={aiVendorName}
                    onChange={(e) => setAiVendorName(e.target.value)}
                    placeholder="e.g. Exabeam"
                    disabled={isLoading}
                    className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary mb-1 block">Product Name</label>
                  <input
                    type="text"
                    value={aiProductName}
                    onChange={(e) => setAiProductName(e.target.value)}
                    placeholder="e.g. Exabeam Fusion SIEM"
                    disabled={isLoading}
                    className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary mb-1 block">Additional Context (optional)</label>
                <textarea
                  rows={3}
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="Any specific details about deployment, pricing, target market..."
                  disabled={isLoading}
                  className="w-full px-3 py-1.5 text-sm bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-sophos-blue/40 disabled:opacity-50 resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <StreamingText text={streamText} isStreaming={isLoading} />

              <div className="flex gap-2">
                {isLoading ? (
                  <Button variant="secondary" size="md" onClick={cancel}>
                    <LoadingSpinner size="sm" />
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => generate(aiVendorName, aiProductName || aiVendorName, aiContext)}
                    disabled={!aiVendorName.trim() || !hasApiKey}
                  >
                    <Sparkles size={14} />
                    Generate with AI
                  </Button>
                )}
                <Button variant="ghost" size="md" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            /* AI result review */
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">{result.vendorName} — {result.productName}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">{result.description}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-text-secondary mb-2">AI-Generated Scores</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((cat) => {
                    const s = result.scores[cat.id]
                    return (
                      <div key={cat.id} className="flex items-center justify-between px-3 py-1.5 bg-bg-secondary rounded-lg">
                        <span className="text-xs text-text-secondary truncate flex-1">{cat.label}</span>
                        <span className="text-sm font-bold text-text-primary ml-2">
                          {s?.score ?? '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {result.caveats && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-xs text-amber-700 dark:text-amber-300">{result.caveats}</p>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="md" onClick={saveAIResult}>
                  <CheckCircle size={14} />
                  Accept & Save
                </Button>
                <Button variant="secondary" size="md" onClick={reset}>
                  Re-generate
                </Button>
                <Button variant="ghost" size="md" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
