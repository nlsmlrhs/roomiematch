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
  swipeProfile: (profileId: string, direction: 'left' | 'right') => boolean
  undoSwipe: () => void
  canUndo: boolean
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
  myProfile: Seeker | null
  saveMyProfile: (profile: Seeker) => void
  unreadMatchCount: number
  readMatchIds: Set<string>
  markMatchRead: (matchId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

type LastSwiped = { id: string; direction: 'left' | 'right'; role: UserRole; matchId?: string }

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>('seeker')
  const [view, setView] = useState<AppView>('swipe')
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [myListings, setMyListings] = useState<Flatshare[]>([])

  // Per-role swipe history so switching roles doesn't reset progress
  const [seekerSwipedRight, setSeekerSwipedRight] = useState<Set<string>>(new Set())
  const [seekerSwipedLeft, setSeekerSwipedLeft] = useState<Set<string>>(new Set())
  const [wgSwipedRight, setWgSwipedRight] = useState<Set<string>>(new Set())
  const [wgSwipedLeft, setWgSwipedLeft] = useState<Set<string>>(new Set())

  const [lastSwiped, setLastSwiped] = useState<LastSwiped | null>(null)
  const [readMatchIds, setReadMatchIds] = useState<Set<string>>(new Set())
  const [detailProfile, setDetailProfile] = useState<Profile | null>(null)
  const [profileVisible, setProfileVisible] = useState(false)
  const [myProfile, setMyProfile] = useState<Seeker | null>(null)

  const swipedRight = userRole === 'seeker' ? seekerSwipedRight : wgSwipedRight
  const swipedLeft = userRole === 'seeker' ? seekerSwipedLeft : wgSwipedLeft

  const unreadMatchCount = matches.filter((m) => !readMatchIds.has(m.id)).length

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role)
  }, [])

  const saveMyProfile = useCallback((profile: Seeker) => {
    setMyProfile(profile)
  }, [])

  const markMatchRead = useCallback((matchId: string) => {
    setReadMatchIds((prev) => new Set([...prev, matchId]))
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

  const allProfiles: Profile[] = userRole === 'seeker'
    ? [...mockFlatshares, ...myListings]
    : [...mockSeekers]
  const queue = allProfiles.filter((p) => !swipedRight.has(p.id) && !swipedLeft.has(p.id))

  const swipe = useCallback(
    (direction: 'left' | 'right'): boolean => {
      const setSRight = userRole === 'seeker' ? setSeekerSwipedRight : setWgSwipedRight
      const setSLeft = userRole === 'seeker' ? setSeekerSwipedLeft : setWgSwipedLeft
      const sRight = userRole === 'seeker' ? seekerSwipedRight : wgSwipedRight
      const sLeft = userRole === 'seeker' ? seekerSwipedLeft : wgSwipedLeft

      const current = allProfiles.find((p) => !sRight.has(p.id) && !sLeft.has(p.id))
      if (!current) return false

      if (direction === 'right') {
        setSRight((prev) => new Set([...prev, current.id]))
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          seeker:
            userRole === 'seeker'
              ? (myProfile ?? { kind: 'seeker', id: 'me', firstName: 'Du', lastName: '', age: 0, gender: 'divers', photos: [], occupation: '', hobbies: [], languages: [], smoker: false, dailyRhythm: 'flexible', budgetMax: 0, movingDate: '', bio: '', prompts: [] } as Seeker)
              : (current as Seeker),
          flatshare:
            userRole === 'seeker'
              ? (current as Flatshare)
              : ({ kind: 'flatshare', id: 'me', title: 'Deine WG', images: [], rentMonthly: 0, availableFrom: '', internetSpeed: '', address: '', roommates: 0, description: '', tags: [], amenities: [], roommateLanguages: [], roommateGenders: [], preferredGender: 'alle', smokingAllowed: false, wgRhythm: 'flexible', preferredAgeMin: 18, preferredAgeMax: 40 } as Flatshare),
          matchedAt: new Date().toISOString(),
          messages: [],
        }
        setMatches((prev) => [newMatch, ...prev])
        setLastSwiped({ id: current.id, direction: 'right', role: userRole, matchId: newMatch.id })
        return true
      } else {
        setSLeft((prev) => new Set([...prev, current.id]))
        setLastSwiped({ id: current.id, direction: 'left', role: userRole })
        return false
      }
    },
    [allProfiles, seekerSwipedRight, seekerSwipedLeft, wgSwipedRight, wgSwipedLeft, userRole, myProfile],
  )

  const swipeProfile = useCallback(
    (profileId: string, direction: 'left' | 'right'): boolean => {
      const setSRight = userRole === 'seeker' ? setSeekerSwipedRight : setWgSwipedRight
      const setSLeft = userRole === 'seeker' ? setSeekerSwipedLeft : setWgSwipedLeft

      const target = allProfiles.find((p) => p.id === profileId)
      if (!target) return false

      if (direction === 'right') {
        setSRight((prev) => new Set([...prev, target.id]))
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          seeker:
            userRole === 'seeker'
              ? (myProfile ?? { kind: 'seeker', id: 'me', firstName: 'Du', lastName: '', age: 0, gender: 'divers', photos: [], occupation: '', hobbies: [], languages: [], smoker: false, dailyRhythm: 'flexible', budgetMax: 0, movingDate: '', bio: '', prompts: [] } as Seeker)
              : (target as Seeker),
          flatshare:
            userRole === 'seeker'
              ? (target as Flatshare)
              : ({ kind: 'flatshare', id: 'me', title: 'Deine WG', images: [], rentMonthly: 0, availableFrom: '', internetSpeed: '', address: '', roommates: 0, description: '', tags: [], amenities: [], roommateLanguages: [], roommateGenders: [], preferredGender: 'alle', smokingAllowed: false, wgRhythm: 'flexible', preferredAgeMin: 18, preferredAgeMax: 40 } as Flatshare),
          matchedAt: new Date().toISOString(),
          messages: [],
        }
        setMatches((prev) => [newMatch, ...prev])
        setLastSwiped({ id: target.id, direction: 'right', role: userRole, matchId: newMatch.id })
        return true
      } else {
        setSLeft((prev) => new Set([...prev, target.id]))
        setLastSwiped({ id: target.id, direction: 'left', role: userRole })
        return false
      }
    },
    [allProfiles, userRole, myProfile],
  )

  const undoSwipe = useCallback(() => {
    if (!lastSwiped) return
    const setSRight = lastSwiped.role === 'seeker' ? setSeekerSwipedRight : setWgSwipedRight
    const setSLeft = lastSwiped.role === 'seeker' ? setSeekerSwipedLeft : setWgSwipedLeft

    if (lastSwiped.direction === 'right') {
      setSRight((prev) => { const next = new Set(prev); next.delete(lastSwiped.id); return next })
      if (lastSwiped.matchId) {
        setMatches((prev) => prev.filter((m) => m.id !== lastSwiped.matchId))
      }
    } else {
      setSLeft((prev) => { const next = new Set(prev); next.delete(lastSwiped.id); return next })
    }
    setLastSwiped(null)
  }, [lastSwiped])

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
        swipeProfile,
        undoSwipe,
        canUndo: lastSwiped !== null,
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
        myProfile,
        saveMyProfile,
        unreadMatchCount,
        readMatchIds,
        markMatchRead,
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
