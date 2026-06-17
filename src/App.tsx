import { AppProvider, useApp } from './context/AppContext'
import { SwipeView } from './views/SwipeView'
import { MatchView } from './views/MatchView'
import { ProfileSetup } from './views/ProfileSetup'
import { MyListingsView } from './views/MyListingsView'
import { BottomNav } from './components/BottomNav'
import { ProfileDetail } from './components/ProfileDetail'

function AppShell() {
  const { view } = useApp()

  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-gradient-to-b from-pink-50/40 to-white shadow-2xl relative overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 px-4 pt-10 pb-3 bg-white/80 backdrop-blur border-b border-pink-100/60">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Wohni
          </h1>
          <span className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
            {view === 'swipe' ? '🏠 Entdecken' : view === 'matches' ? '💬 Matches' : view === 'my-listings' ? '🏢 Inserate' : '👤 Profil'}
          </span>
        </div>
      </header>

      {/* View */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {view === 'swipe' && <SwipeView />}
        {view === 'matches' && <MatchView />}
        {view === 'my-listings' && <MyListingsView />}
        {view === 'profile-setup' && <ProfileSetup />}
      </main>

      {/* Bottom nav */}
      <BottomNav />

      {/* Detail overlay — covers everything incl. nav */}
      <ProfileDetail />
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
