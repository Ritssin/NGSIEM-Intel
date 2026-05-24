import { useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useThemeStore } from '@/store/useThemeStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { useVendorStore } from '@/store/useVendorStore'
import { useComparisonStore } from '@/store/useComparisonStore'

export default function App() {
  const { theme } = useThemeStore()
  const registerCallbacks = useCategoryStore((s) => s.registerCallbacks)
  const addCategoryToAllVendors = useVendorStore((s) => s.addCategoryToAllVendors)
  const removeCategoryFromAllVendors = useVendorStore((s) => s.removeCategoryFromAllVendors)
  const removeHiddenCategory = useComparisonStore((s) => s.removeHiddenCategory)

  // Apply persisted theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Wire category store callbacks to vendor store
  useEffect(() => {
    registerCallbacks(
      (id) => addCategoryToAllVendors(id),
      (id) => {
        removeCategoryFromAllVendors(id)
        removeHiddenCategory(id)
      },
    )
  }, [registerCallbacks, addCategoryToAllVendors, removeCategoryFromAllVendors, removeHiddenCategory])

  return <AppShell />
}
