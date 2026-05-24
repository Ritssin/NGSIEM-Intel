import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/useThemeStore'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-all duration-200"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <div className="transition-transform duration-300" style={{ transform: theme === 'dark' ? 'rotate(20deg)' : 'rotate(0deg)' }}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  )
}
