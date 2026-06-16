import { Home, Heart, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { AppView } from '../types'

const tabs: { view: AppView; icon: typeof Home; label: string }[] = [
  { view: 'swipe', icon: Home, label: 'Entdecken' },
  { view: 'matches', icon: Heart, label: 'Matches' },
  { view: 'profile-setup', icon: User, label: 'Profil' },
]

export function BottomNav() {
  const { view, setView, matches } = useApp()

  return (
    <nav className="flex-shrink-0 bg-white border-t border-gray-100 flex safe-bottom">
      {tabs.map(({ view: v, icon: Icon, label }) => {
        const active = view === v
        const badge = v === 'matches' && matches.length > 0

        return (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 relative active:bg-gray-50 transition-colors"
          >
            <div className="relative">
              <Icon
                className={`w-6 h-6 transition-colors ${active ? 'text-pink-500' : 'text-gray-400'}`}
                fill={active && v === 'matches' ? 'currentColor' : 'none'}
              />
              {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {matches.length}
                </span>
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
