import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'

export function AppShell() {
  return (
    <div className="h-screen flex flex-col bg-bg-primary overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <MainContent />
        </main>
      </div>
    </div>
  )
}
