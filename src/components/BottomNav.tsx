import { Home, Heart, User, Building2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { AppView } from '../types'

const tabs: { view: AppView; icon: typeof Home; label: string }[] = [
  { view: 'swipe', icon: Home, label: 'Entdecken' },
  { view: 'matches', icon: Heart, label: 'Matches' },
  { view: 'my-listings', icon: Building2, label: 'Inserate' },
  { view: 'profile-setup', icon: User, label: 'Profil' },
]

export function BottomNav() {
  const { view, setView, unreadMatchCount, profileVisible } = useApp()

  return (
    <nav className="flex-shrink-0 bg-white border-t border-pink-100 flex safe-bottom">
      {tabs.map(({ view: v, icon: Icon, label }) => {
        const active = view === v
        const badge = v === 'matches' && unreadMatchCount > 0
        const pauseDot = v === 'profile-setup' && !profileVisible

        return (
          <button
            key={v}
            onClick={() => setView(v)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative transition-colors"
          >
            {active && (
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
            )}
            <div className={`relative p-1.5 rounded-xl transition-colors ${active ? 'bg-pink-50' : ''}`}>
              <Icon
                className={`w-5 h-5 transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}
                fill={active ? 'currentColor' : 'none'}
              />
              {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {unreadMatchCount}
                </span>
              )}
              {pauseDot && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white" />
              )}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
