import { useThemeStore } from '@/store/useThemeStore'
import { MIcon } from './MIcon'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className={className ?? 'w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all duration-200'}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(20deg)' : 'rotate(0deg)' }}>
        <MIcon name={theme === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
      </div>
    </button>
  )
}
