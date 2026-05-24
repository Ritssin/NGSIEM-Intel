import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-card': 'var(--color-bg-card)',
        'bg-sidebar': 'var(--color-bg-sidebar)',
        'bg-hover': 'var(--color-bg-hover)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'border-color': 'var(--color-border)',
        'sophos-blue': 'var(--color-sophos-blue)',
        'sophos-blue-light': 'var(--color-sophos-blue-light)',
      },
    },
  },
  plugins: [],
} satisfies Config
