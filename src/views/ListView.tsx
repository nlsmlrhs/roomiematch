import { useState } from 'react'
import { MapPin, Euro, Calendar, Wifi, Heart, X, Sparkles, Users } from 'lucide-react'
import type { Flatshare, Profile, Seeker } from '../types'
import { useApp } from '../context/AppContext'
import { OccupancyStrip } from '../components/OccupancyStrip'
import { computeScore, scoreColor } from '../utils/matchScore'

type FilterMode = 'new' | 'liked' | 'disliked'
type SortMode = 'score' | 'price' | 'date'

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${palettes[color] ?? palettes.gray}`}>
      {label}
    </span>
  )
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-1.5">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: FilterMode }) {
  if (status === 'liked') return (
    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
    </div>
  )
  if (status === 'disliked') return (
    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
      <X className="w-3.5 h-3.5 text-rose-500" strokeWidth={2.5} />
    </div>
  )
  return (
    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
      <Sparkles className="w-3.5 h-3.5 text-green-500" />
    </div>
  )
}

function ListItem({ profile, status }: { profile: Profile; status: FilterMode }) {
  const { setDetailProfile, userRole, myProfile, myListings } = useApp()
  const images = profile.kind === 'seeker' ? profile.photos : profile.images
  const photo = images[0]

  const score =
    userRole === 'seeker' && myProfile && profile.kind === 'flatshare'
      ? computeScore(myProfile, profile)
      : userRole === 'wg' && myListings.length > 0 && profile.kind === 'seeker'
      ? computeScore(profile, myListings[0])
      : null

  if (profile.kind === 'flatshare') {
    return (
      <div
        onClick={() => setDetailProfile(profile)}
        className="bg-white rounded-2xl overflow-hidden flex flex-col border border-pink-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="relative w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
          {photo ? (
            <img src={photo} alt={profile.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🏠</span>
          )}
          {score !== null && (
            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${scoreColor(score)}`}>
              {score} %
            </div>
          )}
          <StatusBadge status={status} />
        </div>

        <div className="p-3 space-y-2.5">
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-snug">{profile.title}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0 text-rose-400" />{profile.address}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <InfoCell icon={<Euro className="w-3.5 h-3.5 text-green-500" />} label="Miete" value={`${profile.rentMonthly} €/Mo`} />
            <InfoCell icon={<Calendar className="w-3.5 h-3.5 text-indigo-500" />} label="Frei ab" value={new Date(profile.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })} />
            <div className="flex items-start gap-1.5">
              <div className="mt-0.5 flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Belegung</p>
                <OccupancyStrip genders={profile.roommateGenders} size="sm" />
              </div>
            </div>
            <InfoCell icon={<Wifi className="w-3.5 h-3.5 text-blue-500" />} label="Internet" value={profile.internetSpeed} />
          </div>
          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {profile.tags.slice(0, 3).map((t) => <Badge key={t} label={t} color="pink" />)}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Seeker card
  return (
    <div
      onClick={() => setDetailProfile(profile)}
      className="bg-white rounded-2xl overflow-hidden flex flex-col border border-pink-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
        {photo ? (
          <img src={photo} alt={profile.firstName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">👤</span>
        )}
        {score !== null && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${scoreColor(score)}`}>
            {score} %
          </div>
        )}
        <StatusBadge status={status} />
      </div>

      <div className="p-3 space-y-2.5">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{profile.firstName}, {profile.age}</p>
          <p className="text-xs text-gray-400 mt-0.5">{profile.occupation}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <InfoCell icon={<Euro className="w-3.5 h-3.5 text-green-500" />} label="Max. Budget" value={`bis ${profile.budgetMax} €/Mo`} />
          <InfoCell icon={<Calendar className="w-3.5 h-3.5 text-indigo-500" />} label="Einzug ab" value={new Date(profile.movingDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })} />
        </div>
        {profile.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {profile.hobbies.slice(0, 3).map((h) => <Badge key={h} label={h} color="pink" />)}
          </div>
        )}
      </div>
    </div>
  )
}

function sortProfiles(
  profiles: Profile[],
  sort: SortMode,
  myProfile: Seeker | null,
  myListings: Flatshare[],
): Profile[] {
  const firstListing = myListings[0] ?? null
  return [...profiles].sort((a, b) => {
    if (sort === 'score') {
      const getScore = (p: Profile) => {
        if (p.kind === 'flatshare' && myProfile) return computeScore(myProfile, p)
        if (p.kind === 'seeker' && firstListing) return computeScore(p, firstListing)
        return 0
      }
      return getScore(b) - getScore(a)
    }
    if (sort === 'price') {
      const pa = a.kind === 'flatshare' ? a.rentMonthly : a.budgetMax
      const pb = b.kind === 'flatshare' ? b.rentMonthly : b.budgetMax
      return pa - pb
    }
    // date
    const da = a.kind === 'flatshare' ? a.availableFrom : a.movingDate
    const db = b.kind === 'flatshare' ? b.availableFrom : b.movingDate
    return da.localeCompare(db)
  })
}

const FILTER_TABS: { mode: FilterMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'new',      icon: <Sparkles className="w-3.5 h-3.5" />,                    label: 'Neu' },
  { mode: 'liked',    icon: <Heart className="w-3.5 h-3.5 fill-current" />,           label: 'Geliked' },
  { mode: 'disliked', icon: <X className="w-3.5 h-3.5" strokeWidth={2.5} />,          label: 'Disliked' },
]

const SORT_OPTIONS: { mode: SortMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'score', icon: <Sparkles className="w-3 h-3" />, label: 'Best Match' },
  { mode: 'price', icon: <Euro className="w-3 h-3" />,     label: 'Preis' },
  { mode: 'date',  icon: <Calendar className="w-3 h-3" />, label: 'Einzug' },
]

export function ListView() {
  const { allProfiles, swipedRight, swipedLeft, myProfile, myListings } = useApp()
  const [filter, setFilter] = useState<FilterMode>('new')
  const [sort, setSort] = useState<SortMode>('score')

  const newProfiles = allProfiles.filter((p) => !swipedRight.has(p.id) && !swipedLeft.has(p.id))
  const likedProfiles = allProfiles.filter((p) => swipedRight.has(p.id))
  const dislikedProfiles = allProfiles.filter((p) => swipedLeft.has(p.id))

  const counts: Record<FilterMode, number> = {
    new: newProfiles.length,
    liked: likedProfiles.length,
    disliked: dislikedProfiles.length,
  }

  const raw = filter === 'new' ? newProfiles : filter === 'liked' ? likedProfiles : dislikedProfiles
  const displayed = sortProfiles(raw, sort, myProfile, myListings)

  const tabColors: Record<FilterMode, { active: string; dot: string }> = {
    new:      { active: 'text-green-600 border-green-500', dot: 'bg-green-500' },
    liked:    { active: 'text-pink-600 border-pink-500',   dot: 'bg-pink-500' },
    disliked: { active: 'text-rose-600 border-rose-500',   dot: 'bg-rose-500' },
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar w-full">
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100">
        <h2 className="text-base font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Mainz
        </h2>
        {/* Sort chips */}
        <div className="flex gap-1.5 mt-2">
          {SORT_OPTIONS.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setSort(mode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                sort === mode
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-white text-gray-400 border border-gray-200'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-100 bg-white px-2">
        {FILTER_TABS.map(({ mode, icon, label }) => {
          const active = filter === mode
          const { active: activeClass, dot: dotClass } = tabColors[mode]
          return (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                active ? `${activeClass} ` : 'text-gray-400 border-transparent'
              }`}
            >
              {icon}
              {label}
              <span className={`ml-0.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center ${dotClass}`}>
                {counts[mode]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      {displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 text-center px-8 py-16">
          <span className="text-4xl">
            {filter === 'new' ? '✨' : filter === 'liked' ? '💜' : '🙈'}
          </span>
          <p className="text-gray-400 text-sm">
            {filter === 'new' ? 'Keine neuen Profile mehr' : filter === 'liked' ? 'Noch keine gelikeden Profile' : 'Noch keine dislikeden Profile'}
          </p>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-4 space-y-4">
          {displayed.map((profile) => (
            <ListItem
              key={profile.id}
              profile={profile}
              status={filter}
            />
          ))}
        </div>
      )}
    </div>
  )
}
