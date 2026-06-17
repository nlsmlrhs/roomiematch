import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Profile, Match, AppView, UserRole, Seeker, Flatshare, ChatMessage } from '../types'
import { mockSeekers, mockFlatshares } from '../data/mockData'

interface AppContextValue {
  userRole: UserRole
  setUserRole: (r: UserRole) => void
  queue: Profile[]
  swipe: (direction: 'left' | 'right') => boolean
  matches: Match[]
  sendMessage: (matchId: string, text: string) => void
  view: AppView
  setView: (v: AppView) => void
  activeChatMatchId: string | null
  setActiveChatMatchId: (id: string | null) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('seeker')
  const [view, setView] = useState<AppView>('swipe')
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])

  const baseQueue: Profile[] =
    userRole === 'seeker'
      ? [...mockFlatshares]
      : [...mockSeekers]

  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const queue = baseQueue.filter((p) => !dismissed.has(p.id))

  const swipe = useCallback(
    (direction: 'left' | 'right'): boolean => {
      const current = baseQueue.find((p) => !dismissed.has(p.id))
      if (!current) return false

      setDismissed((prev) => new Set([...prev, current.id]))

      if (direction === 'right') {
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          seeker:
            userRole === 'seeker'
              ? ({ kind: 'seeker', id: 'me', firstName: 'Du', lastName: '', age: 0, photos: [], occupation: '', hobbies: [], languages: [], smoker: false, dailyRhythm: 'flexible', budgetMax: 0, movingDate: '', bio: '' } as Seeker)
              : (current as Seeker),
          flatshare:
            userRole === 'seeker'
              ? (current as Flatshare)
              : ({ kind: 'flatshare', id: 'me', title: 'Deine WG', images: [], rentMonthly: 0, availableFrom: '', internetSpeed: '', address: '', roommates: 0, description: '', tags: [] } as Flatshare),
          matchedAt: new Date().toISOString(),
          messages: [],
        }
        setMatches((prev) => [newMatch, ...prev])
        return true
      }
      return false
    },
    [baseQueue, dismissed, userRole],
  )

  const sendMessage = useCallback((matchId: string, text: string) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      sentAt: new Date().toISOString(),
    }
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, messages: [...m.messages, msg] } : m,
      ),
    )
  }, [])

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        queue,
        swipe,
        matches,
        sendMessage,
        view,
        setView,
        activeChatMatchId,
        setActiveChatMatchId,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
