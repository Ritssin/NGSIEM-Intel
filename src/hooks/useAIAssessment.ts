import { useState, useRef, useCallback } from 'react'
import { generateVendorAssessment } from '@/services/claudeService'
import { useCategoryStore } from '@/store/useCategoryStore'
import type { AIAssessmentRequest, AIAssessmentResponse } from '@/types/ai'

interface UseAIAssessmentReturn {
  generate: (vendorName: string, productName: string, context?: string) => Promise<void>
  isLoading: boolean
  streamText: string
  result: AIAssessmentResponse | null
  error: string | null
  cancel: () => void
  reset: () => void
}

export function useAIAssessment(): UseAIAssessmentReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [result, setResult] = useState<AIAssessmentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const categories = useCategoryStore((s) => s.categories)

  const generate = useCallback(
    async (vendorName: string, productName: string, context?: string) => {
      abortRef.current?.abort()
      abortRef.current = new AbortController()
      setIsLoading(true)
      setStreamText('')
      setResult(null)
      setError(null)

      const request: AIAssessmentRequest = {
        vendorName,
        productName,
        additionalContext: context,
        categories: categories.map((c) => ({
          id: c.id,
          label: c.label,
          description: c.description,
          scoringGuide: c.scoringGuide,
        })),
      }

      try {
        const response = await generateVendorAssessment(
          request,
          (text) => setStreamText((prev) => prev + text),
          abortRef.current.signal,
        )
        setResult(response)
      } catch (err) {
        if (err instanceof Error && err.message !== 'Cancelled') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [categories],
  )

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
    setStreamText('')
    setResult(null)
    setError(null)
  }, [])

  return { generate, isLoading, streamText, result, error, cancel, reset }
}
