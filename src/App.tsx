import { AppProvider, useApp } from './context/AppContext'
import { SwipeView } from './views/SwipeView'
import { MatchView } from './views/MatchView'
import { ProfileSetup } from './views/ProfileSetup'
import { BottomNav } from './components/BottomNav'

function AppShell() {
  const { view } = useApp()

  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 px-4 pt-10 pb-3 bg-white border-b border-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            RoomieMatch
          </h1>
          <span className="text-xs bg-pink-50 text-pink-500 px-2 py-1 rounded-full font-medium">
            {view === 'swipe' ? '🏠 Entdecken' : view === 'matches' ? '💬 Matches' : '👤 Profil'}
          </span>
        </div>
      </header>

      {/* View */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {view === 'swipe' && <SwipeView />}
        {view === 'matches' && <MatchView />}
        {view === 'profile-setup' && <ProfileSetup />}
      </main>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
