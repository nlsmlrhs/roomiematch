import { useState } from 'react'
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import {
  MapPin, Wifi, Euro, Calendar, Moon, Sun, Minus,
  Languages, Briefcase, Tag, ChevronDown, ChevronUp, Users, Cigarette, CigaretteOff, Info,
} from 'lucide-react'
import type { Profile } from '../types'
import { useApp } from '../context/AppContext'
import { OccupancyStrip } from './OccupancyStrip'
import { computeScore, scoreColor } from '../utils/matchScore'

interface Props {
  profile: Profile
  onSwipe: (dir: 'left' | 'right') => void
  zIndex?: number
  isTop?: boolean
}

const SWIPE_THRESHOLD = 100

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    pink: 'bg-pink-100 text-pink-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    rose: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${palettes[color] ?? palettes.gray}`}>
      {label}
    </span>
  )
}

function RhythmIcon({ rhythm }: { rhythm: string }) {
  if (rhythm === 'early-bird') return <Sun className="w-4 h-4 text-amber-500" />
  if (rhythm === 'night-owl') return <Moon className="w-4 h-4 text-indigo-500" />
  return <Minus className="w-4 h-4 text-gray-400" />
}

export function SwipeCard({ profile, onSwipe, zIndex = 0, isTop = false }: Props) {
  const { setDetailProfile, userRole, myProfile, myListings } = useApp()
  const score =
    userRole === 'seeker' && myProfile && profile.kind === 'flatshare'
      ? computeScore(myProfile, profile)
      : userRole === 'wg' && myListings.length > 0 && profile.kind === 'seeker'
      ? computeScore(profile, myListings[0])
      : null
  const [photoIdx, setPhotoIdx] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-18, 18])
  const likeOpacity = useTransform(x, [20, 120], [0, 1])
  const passOpacity = useTransform(x, [-120, -20], [1, 0])

  const images = profile.kind === 'seeker' ? profile.photos : profile.images
  const hasMultiple = images.length > 1

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe('right')
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('left')
  }


  return (
    <motion.div
      style={{ x, rotate, zIndex }}
      drag={isTop && !expanded ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 select-none ${expanded ? '' : 'touch-none'}`}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
      exit={{ x: 0, opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
    >
      <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Photo — always fills card as background */}
        <div className="absolute inset-0">
          {images.length > 0 ? (
            <img
              src={images[photoIdx]}
              alt="profile"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-rose-200">
              <span className="text-6xl">🏠</span>
            </div>
          )}

          {/* Photo tap areas — disabled when expanded */}
          {hasMultiple && !expanded && (
            <>
              <button
                className="absolute left-0 top-0 h-full w-1/3"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))}
              />
              <button
                className="absolute right-0 top-0 h-full w-1/3"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setPhotoIdx((i) => Math.min(images.length - 1, i + 1))}
              />
              <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 pointer-events-none">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${i === photoIdx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Score badge — top-left */}
          {score !== null && (
            <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-xl text-xs font-bold shadow-sm backdrop-blur-sm ${scoreColor(score)}`}>
              {score}%
            </div>
          )}

          {/* Info button */}
          <button
            className="absolute top-10 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:bg-black/50 transition-colors"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setDetailProfile(profile) }}
          >
            <Info className="w-4 h-4 text-white" />
          </button>

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

          {/* Name / title — moves up when panel expands (CSS transition) */}
          <div
            className="absolute left-4 right-4 text-white pointer-events-none transition-all duration-300 ease-out"
            style={{ bottom: expanded ? 'calc(62% + 14px)' : '86px' }}
          >
            {profile.kind === 'seeker' ? (
              <>
                <h2 className="text-2xl font-bold leading-tight drop-shadow-sm">
                  {profile.firstName}, {profile.age}
                </h2>
                <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" /> {profile.occupation}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold leading-tight drop-shadow-sm">{profile.title}</h2>
                <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {profile.address}
                </p>
              </>
            )}
          </div>

          {/* LIKE / PASS overlays */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-6 left-5 border-4 border-green-400 text-green-400 rounded-xl px-3 py-1 rotate-[-20deg] font-black text-2xl uppercase tracking-widest pointer-events-none"
              >
                Like
              </motion.div>
              <motion.div
                style={{ opacity: passOpacity }}
                className="absolute top-6 right-5 border-4 border-rose-400 text-rose-400 rounded-xl px-3 py-1 rotate-[20deg] font-black text-2xl uppercase tracking-widest pointer-events-none"
              >
                Nope
              </motion.div>
            </>
          )}
        </div>

        {/* Info panel — CSS transition for reliable px/% height animation */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl overflow-hidden flex flex-col transition-all duration-300 ease-out"
          style={{ height: expanded ? '62%' : '84px' }}
        >
          {/* Toggle strip — always visible */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-full pt-2.5 pb-2.5 flex flex-col items-center gap-2"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
            {expanded ? (
              <div className="flex items-center gap-1 text-gray-400">
                <ChevronDown className="w-4 h-4" />
                <span className="text-xs font-medium">Weniger anzeigen</span>
              </div>
            ) : (
              <div className="w-full px-3 flex items-center gap-1.5">
                {profile.kind === 'flatshare' ? (
                  <>
                    <div className="flex-1 bg-green-50 rounded-xl py-1.5 px-2 min-w-0">
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Miete</p>
                      <p className="text-xs font-bold text-green-700 leading-none truncate">{profile.rentMonthly} €</p>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl py-1.5 px-2 min-w-0">
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Frei ab</p>
                      <p className="text-xs font-bold text-indigo-700 leading-none truncate">
                        {new Date(profile.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex-1 bg-purple-50 rounded-xl py-1.5 px-2 min-w-0">
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Belegung</p>
                      <div className="flex items-center">
                        <OccupancyStrip genders={profile.roommateGenders} size="sm" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 bg-green-50 rounded-xl py-1.5 px-2 min-w-0">
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Budget</p>
                      <p className="text-xs font-bold text-green-700 leading-none truncate">bis {profile.budgetMax} €</p>
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-xl py-1.5 px-2 min-w-0">
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Einzug ab</p>
                      <p className="text-xs font-bold text-indigo-700 leading-none truncate">
                        {new Date(profile.movingDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </p>
                    </div>
                    <div className={`flex-1 rounded-xl py-1.5 px-2 min-w-0 ${profile.smoker ? 'bg-amber-50' : 'bg-gray-50'}`}>
                      <p className="text-[10px] text-gray-400 leading-none mb-0.5">Rauchen</p>
                      <p className={`text-xs font-bold leading-none ${profile.smoker ? 'text-amber-700' : 'text-gray-500'}`}>
                        {profile.smoker ? 'Raucher' : 'Nein'}
                      </p>
                    </div>
                  </>
                )}
                <ChevronUp className="w-4 h-4 text-pink-400 flex-shrink-0" />
              </div>
            )}
          </button>

          {/* Scrollable profile details */}
          {expanded && <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 space-y-4">
            {/* Quick stats */}
            <div className="flex flex-wrap gap-2">
              {profile.kind === 'seeker' ? (
                <>
                  <Badge label={`bis ${profile.budgetMax} €/Mo`} color="green" />
                  <Badge label={`ab ${new Date(profile.movingDate).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`} color="blue" />
                  <Badge label={profile.smoker ? 'Raucher' : 'Nichtraucher'} color={profile.smoker ? 'amber' : 'gray'} />
                </>
              ) : (
                <>
                  <Badge label={`${profile.rentMonthly} €/Mo`} color="green" />
                  <Badge label={`ab ${new Date(profile.availableFrom).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`} color="blue" />
                  <Badge label={`${profile.roommates} Mitbewohner`} color="purple" />
                </>
              )}
            </div>

            {/* Bio / description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {profile.kind === 'seeker' ? profile.bio : profile.description}
            </p>

            <div className="border-t border-gray-100" />

            {/* Detail rows */}
            {profile.kind === 'seeker' ? (
              <div className="space-y-3">
                <InfoRow
                  icon={<Languages className="w-4 h-4 text-blue-500" />}
                  label="Sprachen"
                  content={<div className="flex flex-wrap gap-1">{profile.languages.map((l) => <Badge key={l} label={l} color="blue" />)}</div>}
                />
                <InfoRow
                  icon={<RhythmIcon rhythm={profile.dailyRhythm} />}
                  label="Tagesrhythmus"
                  content={
                    <Badge
                      label={profile.dailyRhythm === 'early-bird' ? 'Frühaufsteher' : profile.dailyRhythm === 'night-owl' ? 'Nachtmensch' : 'Flexibel'}
                      color={profile.dailyRhythm === 'early-bird' ? 'amber' : profile.dailyRhythm === 'night-owl' ? 'purple' : 'gray'}
                    />
                  }
                />
                <InfoRow
                  icon={profile.smoker ? <Cigarette className="w-4 h-4 text-amber-500" /> : <CigaretteOff className="w-4 h-4 text-gray-400" />}
                  label="Rauchen"
                  content={<Badge label={profile.smoker ? 'Raucher' : 'Nichtraucher'} color={profile.smoker ? 'amber' : 'gray'} />}
                />
                <InfoRow
                  icon={<Tag className="w-4 h-4 text-pink-500" />}
                  label="Hobbys"
                  content={<div className="flex flex-wrap gap-1">{profile.hobbies.map((h) => <Badge key={h} label={h} color="pink" />)}</div>}
                />
                <InfoRow
                  icon={<Euro className="w-4 h-4 text-green-500" />}
                  label="Budget"
                  content={<span className="text-sm font-semibold text-gray-800">bis {profile.budgetMax} €/Monat</span>}
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4 text-indigo-500" />}
                  label="Einzug ab"
                  content={<span className="text-sm text-gray-700">{new Date(profile.movingDate).toLocaleDateString('de-DE')}</span>}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <InfoRow
                  icon={<Wifi className="w-4 h-4 text-blue-500" />}
                  label="Internet"
                  content={<Badge label={profile.internetSpeed} color="blue" />}
                />
                <InfoRow
                  icon={<Users className="w-4 h-4 text-purple-500" />}
                  label="Mitbewohner:innen"
                  content={(() => {
                    const counts: Record<string, number> = {}
                    for (const g of profile.roommateGenders) counts[g] = (counts[g] ?? 0) + 1
                    const COLOR: Record<string, string> = { männlich: 'blue', weiblich: 'rose', divers: 'amber' }
                    return (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(counts).map(([g, n]) => (
                          <Badge key={g} label={`${n}× ${g}`} color={COLOR[g] ?? 'gray'} />
                        ))}
                      </div>
                    )
                  })()}
                />
                <InfoRow
                  icon={<Euro className="w-4 h-4 text-green-500" />}
                  label="Miete"
                  content={<span className="text-sm font-semibold text-gray-800">{profile.rentMonthly} €/Monat</span>}
                />
                <InfoRow
                  icon={<Calendar className="w-4 h-4 text-indigo-500" />}
                  label="Frei ab"
                  content={<span className="text-sm text-gray-700">{new Date(profile.availableFrom).toLocaleDateString('de-DE')}</span>}
                />
                <InfoRow
                  icon={<Tag className="w-4 h-4 text-pink-500" />}
                  label="Tags"
                  content={<div className="flex flex-wrap gap-1">{profile.tags.map((t) => <Badge key={t} label={t} color="pink" />)}</div>}
                />
              </div>
            )}
          </div>}
        </div>
      </div>
    </motion.div>
  )
}

function InfoRow({ icon, label, content }: { icon: React.ReactNode; label: string; content: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        {content}
      </div>
    </div>
  )
}
