interface MIconProps {
  name: string
  size?: number
  className?: string
}

export function MIcon({ name, size = 20, className }: MIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`}
      style={{ fontSize: size, lineHeight: 1, fontVariationSettings: "'wght' 400, 'GRAD' 0, 'opsz' 20" }}
      aria-hidden="true"
    >{name}</span>
  )
}
