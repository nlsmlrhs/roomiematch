import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin,
  Languages, Tag, Sun, Moon, Minus, Cigarette, CigaretteOff, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Profile } from '../types'

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${palettes[color] ?? palettes.gray}`}>
      {label}
    </span>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {children}
      </div>
    </div>
  )
}

function DetailContent({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const images = profile.kind === 'seeker' ? profile.photos : profile.images
  const [photoIdx, setPhotoIdx] = useState(0)

  return (
    <div className="flex flex-col h-full">
      {/* Photo area */}
      <div className="relative h-72 flex-shrink-0 bg-gradient-to-br from-pink-200 to-purple-200">
        {images.length > 0 ? (
          <img src={images[photoIdx]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {profile.kind === 'flatshare' ? '🏠' : '👤'}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Back button */}
        <button
          onClick={onClose}
          className="absolute top-10 left-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:bg-black/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Photo navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setPhotoIdx((i) => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center disabled:opacity-30"
              disabled={photoIdx === 0}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setPhotoIdx((i) => Math.min(images.length - 1, i + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center disabled:opacity-30"
              disabled={photoIdx === images.length - 1}
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === photoIdx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        {/* Title overlay on photo */}
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          {profile.kind === 'flatshare' ? (
            <>
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">{profile.title}</h2>
              <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {profile.address}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">
                {profile.firstName}, {profile.age}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">{profile.occupation}</p>
            </>
          )}
        </div>
      </div>

      {/* Scrollable details */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
        {profile.kind === 'flatshare' ? (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-gray-100">
              <div className="bg-green-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Miete</p>
                <p className="text-base font-bold text-green-700">{profile.rentMonthly} €<span className="text-sm font-normal">/Mo</span></p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Frei ab</p>
                <p className="text-base font-bold text-indigo-700">
                  {new Date(profile.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Mitbewohner</p>
                <p className="text-base font-bold text-purple-700">{profile.roommates} Person{profile.roommates !== 1 ? 'en' : ''}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Internet</p>
                <p className="text-base font-bold text-blue-700">{profile.internetSpeed}</p>
              </div>
            </div>

            {/* Description */}
            {profile.description && (
              <div className="py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">Über die WG</p>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
              </div>
            )}

            {/* Tags */}
            {profile.tags.length > 0 && (
              <div className="py-4">
                <p className="text-sm font-semibold text-gray-900 mb-2">Ausstattung & Extras</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.tags.map((t) => <Badge key={t} label={t} color="pink" />)}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-gray-100">
              <div className="bg-green-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Max. Budget</p>
                <p className="text-base font-bold text-green-700">bis {profile.budgetMax} €<span className="text-sm font-normal">/Mo</span></p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Einzug ab</p>
                <p className="text-base font-bold text-indigo-700">
                  {new Date(profile.movingDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 mb-2">Über mich</p>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Detail rows */}
            <div className="py-2">
              <InfoRow
                icon={profile.dailyRhythm === 'early-bird'
                  ? <Sun className="w-4 h-4 text-amber-500" />
                  : profile.dailyRhythm === 'night-owl'
                  ? <Moon className="w-4 h-4 text-indigo-500" />
                  : <Minus className="w-4 h-4 text-gray-400" />}
                label="Tagesrhythmus"
              >
                <Badge
                  label={profile.dailyRhythm === 'early-bird' ? 'Frühaufsteher' : profile.dailyRhythm === 'night-owl' ? 'Nachtmensch' : 'Flexibel'}
                  color={profile.dailyRhythm === 'early-bird' ? 'amber' : profile.dailyRhythm === 'night-owl' ? 'purple' : 'gray'}
                />
              </InfoRow>
              <InfoRow
                icon={profile.smoker ? <Cigarette className="w-4 h-4 text-amber-500" /> : <CigaretteOff className="w-4 h-4 text-gray-400" />}
                label="Rauchen"
              >
                <Badge label={profile.smoker ? 'Raucher' : 'Nichtraucher'} color={profile.smoker ? 'amber' : 'gray'} />
              </InfoRow>
              {profile.languages.length > 0 && (
                <InfoRow icon={<Languages className="w-4 h-4 text-blue-500" />} label="Sprachen">
                  <div className="flex flex-wrap gap-1">
                    {profile.languages.map((l) => <Badge key={l} label={l} color="blue" />)}
                  </div>
                </InfoRow>
              )}
              {profile.hobbies.length > 0 && (
                <InfoRow icon={<Tag className="w-4 h-4 text-pink-500" />} label="Hobbys">
                  <div className="flex flex-wrap gap-1">
                    {profile.hobbies.map((h) => <Badge key={h} label={h} color="pink" />)}
                  </div>
                </InfoRow>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function ProfileDetail() {
  const { detailProfile, setDetailProfile } = useApp()

  return (
    <AnimatePresence>
      {detailProfile && (
        <motion.div
          key={detailProfile.id}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="absolute inset-0 z-50 bg-white flex flex-col overflow-hidden"
        >
          <DetailContent profile={detailProfile} onClose={() => setDetailProfile(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
