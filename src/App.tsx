import { useState, useEffect } from 'react'
import wohniLogo from './logos/wohni_logo.svg'
import { AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { SwipeView } from './views/SwipeView'
import { MatchView } from './views/MatchView'
import { MyListingsView } from './views/MyListingsView'
import { MyAreaView } from './views/MyAreaView'
import { BottomNav } from './components/BottomNav'
import { ProfileDetail } from './components/ProfileDetail'
import { SplashScreen } from './components/SplashScreen'

function AppShell() {
  const { view } = useApp()

  return (
    <div className="h-full flex flex-col max-w-md mx-auto bg-gradient-to-b from-pink-50/40 to-white shadow-2xl relative overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 px-4 pt-10 pb-3 bg-white/80 backdrop-blur border-b border-pink-100/60">
        <div className="flex items-center justify-between">
          <img src={wohniLogo} alt="Wohni" className="h-8 w-auto object-contain" />
          <span className="text-xs bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full font-medium shadow-sm">
            {view === 'swipe' ? '🏠 Entdecken' : view === 'matches' ? '💬 Nachrichten' : view === 'listings' ? '📋 Inserate' : '🏠 Mein Bereich'}
          </span>
        </div>
      </header>

      {/* View */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {view === 'swipe' && <SwipeView />}
        {view === 'matches' && <MatchView />}
        {view === 'listings' && <MyListingsView />}
        {view === 'my-area' && <MyAreaView />}
      </main>

      {/* Bottom nav */}
      <BottomNav />

      {/* Detail overlay — covers everything incl. nav */}
      <ProfileDetail />
    </div>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AppProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <AppShell />
    </AppProvider>
  )
}
