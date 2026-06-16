import { useState } from 'react'
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import {
  Heart, X, MapPin, Wifi, Euro, Calendar, Moon, Sun, Minus,
  Languages, Briefcase, Tag, ChevronDown, Users, Cigarette, CigaretteOff,
} from 'lucide-react'
import type { Profile } from '../types'

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
  const [photoIdx, setPhotoIdx] = useState(0)
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
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 select-none touch-none"
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
      exit={{ x: 0, opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
    >
      {/* Card */}
      <div className="relative h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Photo area */}
        <div className="relative flex-shrink-0 h-[55%] bg-gray-200">
          {images.length > 0 ? (
            <img
              src={images[photoIdx]}
              alt="profile"
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200">
              <span className="text-6xl">🏠</span>
            </div>
          )}

          {/* Photo tap areas */}
          {hasMultiple && (
            <>
              <button
                className="absolute left-0 top-0 h-full w-1/3"
                onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))}
              />
              <button
                className="absolute right-0 top-0 h-full w-1/3"
                onClick={() => setPhotoIdx((i) => Math.min(images.length - 1, i + 1))}
              />
              {/* Dot indicators */}
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

          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Name / title */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            {profile.kind === 'seeker' ? (
              <>
                <h2 className="text-2xl font-bold leading-tight">
                  {profile.firstName}, {profile.age}
                </h2>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> {profile.occupation}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold leading-tight">{profile.title}</h2>
                <p className="text-sm text-white/80 flex items-center gap-1">
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

        {/* Scrollable info */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-3 pb-6 space-y-4">
          {/* Quick stats row */}
          <div className="flex flex-wrap gap-2">
            {profile.kind === 'seeker' ? (
              <>
                <Badge label={`bis ${profile.budgetMax} €/Mo`} color="green" />
                <Badge label={`ab ${new Date(profile.movingDate).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' })}`} color="blue" />
                {profile.smoker
                  ? <Badge label="Raucher" color="amber" />
                  : <Badge label="Nichtraucher" color="gray" />}
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

          {/* Divider */}
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
                label="Mitbewohner"
                content={<span className="text-sm text-gray-700">{profile.roommates} Person{profile.roommates !== 1 ? 'en' : ''} bereits da</span>}
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
        </div>

        {/* Scroll hint arrow */}
        <div className="absolute bottom-[4.5rem] left-0 right-0 flex justify-center pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-300 animate-bounce" />
        </div>

        {/* Action buttons */}
        {isTop && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 px-8">
            <button
              onClick={() => onSwipe('left')}
              className="w-14 h-14 rounded-full bg-white shadow-lg border border-rose-100 flex items-center justify-center active:scale-90 transition-transform"
            >
              <X className="w-7 h-7 text-rose-400" />
            </button>
            <button
              onClick={() => onSwipe('right')}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            >
              <Heart className="w-7 h-7 text-white fill-white" />
            </button>
          </div>
        )}
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
