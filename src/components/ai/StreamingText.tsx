import { useEffect, useRef } from 'react'

interface StreamingTextProps {
  text: string
  isStreaming: boolean
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [text])

  if (!text && !isStreaming) return null

  return (
    <div
      ref={ref}
      className="bg-bg-secondary rounded-lg p-3 text-sm text-text-secondary leading-relaxed max-h-48 overflow-y-auto font-mono"
    >
      <p className="whitespace-pre-wrap break-words">
        {text}
        {isStreaming && (
          <span className="inline-block w-1.5 h-4 bg-sophos-blue ml-0.5 animate-pulse align-text-bottom" />
        )}
      </p>
    </div>
  )
}
