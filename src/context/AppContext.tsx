import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Profile, Match, AppView, UserRole, Seeker, Flatshare, ChatMessage } from '../types'
import { mockSeekers, mockFlatshares } from '../data/mockData'

interface AppContextValue {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  allProfiles: Profile[]
  queue: Profile[]
  swipedRight: Set<string>
  swipedLeft: Set<string>
  swipe: (direction: 'left' | 'right') => boolean
  matches: Match[]
  sendMessage: (matchId: string, text: string) => void
  view: AppView
  setView: (v: AppView) => void
  activeChatMatchId: string | null
  setActiveChatMatchId: (id: string | null) => void
  myListings: Flatshare[]
  addListing: (data: Omit<Flatshare, 'id' | 'kind'>) => void
  updateListing: (listing: Flatshare) => void
  deleteListing: (id: string) => void
  detailProfile: Profile | null
  setDetailProfile: (p: Profile | null) => void
  profileVisible: boolean
  setProfileVisible: (v: boolean) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>('seeker')
  const [view, setView] = useState<AppView>('swipe')
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [myListings, setMyListings] = useState<Flatshare[]>([])
  const [swipedRight, setSwipedRight] = useState<Set<string>>(new Set())
  const [swipedLeft, setSwipedLeft] = useState<Set<string>>(new Set())
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null)
  const [profileVisible, setProfileVisible] = useState(false)

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role)
    setSwipedRight(new Set())
    setSwipedLeft(new Set())
  }, [])

  const addListing = useCallback((data: Omit<Flatshare, 'id' | 'kind'>) => {
    const listing: Flatshare = { kind: 'flatshare', id: `listing-${Date.now()}`, ...data }
    setMyListings((prev) => [listing, ...prev])
  }, [])

  const updateListing = useCallback((listing: Flatshare) => {
    setMyListings((prev) => prev.map((l) => (l.id === listing.id ? listing : l)))
  }, [])

  const deleteListing = useCallback((id: string) => {
    setMyListings((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const allProfiles: Profile[] = userRole === 'seeker' ? [...mockFlatshares] : [...mockSeekers]
  const queue = allProfiles.filter((p) => !swipedRight.has(p.id) && !swipedLeft.has(p.id))

  const swipe = useCallback(
    (direction: 'left' | 'right'): boolean => {
      const current = allProfiles.find((p) => !swipedRight.has(p.id) && !swipedLeft.has(p.id))
      if (!current) return false

      if (direction === 'right') {
        setSwipedRight((prev) => new Set([...prev, current.id]))
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          seeker:
            userRole === 'seeker'
              ? ({ kind: 'seeker', id: 'me', firstName: 'Du', lastName: '', age: 0, gender: 'divers', photos: [], occupation: '', hobbies: [], languages: [], smoker: false, dailyRhythm: 'flexible', budgetMax: 0, movingDate: '', bio: '', prompts: [] } as Seeker)
              : (current as Seeker),
          flatshare:
            userRole === 'seeker'
              ? (current as Flatshare)
              : ({ kind: 'flatshare', id: 'me', title: 'Deine WG', images: [], rentMonthly: 0, availableFrom: '', internetSpeed: '', address: '', roommates: 0, description: '', tags: [], amenities: [], roommateLanguages: [], roommateGenders: [], preferredGender: 'alle', smokingAllowed: false, wgRhythm: 'flexible', preferredAgeMin: 18, preferredAgeMax: 40 } as Flatshare),
          matchedAt: new Date().toISOString(),
          messages: [],
        }
        setMatches((prev) => [newMatch, ...prev])
        return true
      } else {
        setSwipedLeft((prev) => new Set([...prev, current.id]))
        return false
      }
    },
    [allProfiles, swipedRight, swipedLeft, userRole],
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
        allProfiles,
        queue,
        swipedRight,
        swipedLeft,
        swipe,
        matches,
        sendMessage,
        view,
        setView,
        activeChatMatchId,
        setActiveChatMatchId,
        myListings,
        addListing,
        updateListing,
        deleteListing,
        detailProfile,
        setDetailProfile,
        profileVisible,
        setProfileVisible,
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
