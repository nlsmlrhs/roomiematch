import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Users, ExternalLink,
  Languages, Tag, Sun, Moon, Minus, Cigarette, CigaretteOff, ChevronLeft, ChevronRight,
  User, CalendarRange,
  Bath, Shirt, Utensils, Trees, Car, Bike, Archive, ArrowUpDown, Home, Dog, Wind,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Profile } from '../types'

const AMENITY_MAP: Record<string, { label: string; Icon: LucideIcon }> = {
  balkon:        { label: 'Balkon',        Icon: Sun },
  badewanne:     { label: 'Badewanne',     Icon: Bath },
  waschmaschine: { label: 'Waschmaschine', Icon: Shirt },
  spuelmaschine: { label: 'Spülmaschine',  Icon: Utensils },
  garten:        { label: 'Garten',        Icon: Trees },
  parkplatz:     { label: 'Parkplatz',     Icon: Car },
  fahrradkeller: { label: 'Fahrradkeller', Icon: Bike },
  keller:        { label: 'Keller',        Icon: Archive },
  aufzug:        { label: 'Aufzug',        Icon: ArrowUpDown },
  moebliert:     { label: 'Möbliert',      Icon: Home },
  haustiere:     { label: 'Haustiere ok',  Icon: Dog },
  klimaanlage:   { label: 'Klimaanlage',   Icon: Wind },
}

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-600',
    pink: 'bg-pink-100 text-pink-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${palettes[color] ?? palettes.gray}`}>
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-gray-900 mb-2">{children}</p>
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

function RhythmLabel({ rhythm }: { rhythm: string }) {
  if (rhythm === 'early-bird') return <Badge label="Frühaufsteher" color="amber" />
  if (rhythm === 'night-owl') return <Badge label="Nachtmensch" color="purple" />
  return <Badge label="Flexibel" color="gray" />
}

function RhythmIcon({ rhythm }: { rhythm: string }) {
  if (rhythm === 'early-bird') return <Sun className="w-4 h-4 text-amber-500" />
  if (rhythm === 'night-owl') return <Moon className="w-4 h-4 text-indigo-500" />
  return <Minus className="w-4 h-4 text-gray-400" />
}

const GENDER_BADGE_COLOR: Record<string, string> = {
  männlich: 'blue',
  weiblich: 'rose',
  divers: 'amber',
}

function GenderBadges({ genders }: { genders: string[] }) {
  const counts: Record<string, number> = {}
  for (const g of genders) counts[g] = (counts[g] ?? 0) + 1
  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(counts).map(([g, n]) => (
        <Badge key={g} label={`${n}× ${g}`} color={GENDER_BADGE_COLOR[g] ?? 'gray'} />
      ))}
    </div>
  )
}

function AddressMap({ address }: { address: string }) {
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setCoords(null)
    setFailed(false)
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=de&q=${encodeURIComponent(address)}`,
      { headers: { Accept: 'application/json' } },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data[0]) setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        else setFailed(true)
      })
      .catch(() => setFailed(true))
  }, [address])

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  if (failed) return null

  return (
    <div className="py-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <SectionTitle>Lage</SectionTitle>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-pink-500 font-medium"
        >
          In Maps öffnen <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {!coords ? (
        <div className="h-44 bg-gray-100 rounded-2xl flex items-center justify-center">
          <p className="text-xs text-gray-400">Karte wird geladen…</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-gray-100" style={{ height: 176 }}>
          <iframe
            title="Karte"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords[1] - 0.012},${coords[0] - 0.008},${coords[1] + 0.012},${coords[0] + 0.008}&layer=mapnik&marker=${coords[0]},${coords[1]}`}
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        </div>
      )}
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-10 left-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:bg-black/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

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
                <SectionTitle>Über die WG</SectionTitle>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
              </div>
            )}

            {/* WG & Mitbewohner */}
            <div className="py-2 border-b border-gray-100">
              <SectionTitle>WG & Mitbewohner</SectionTitle>
              <InfoRow icon={<RhythmIcon rhythm={profile.wgRhythm} />} label="Tagesrhythmus">
                <RhythmLabel rhythm={profile.wgRhythm} />
              </InfoRow>
              <InfoRow
                icon={profile.smokingAllowed
                  ? <Cigarette className="w-4 h-4 text-amber-500" />
                  : <CigaretteOff className="w-4 h-4 text-gray-400" />}
                label="Rauchen"
              >
                <Badge label={profile.smokingAllowed ? 'Erlaubt' : 'Nicht erlaubt'} color={profile.smokingAllowed ? 'amber' : 'gray'} />
              </InfoRow>
              {profile.roommateLanguages.length > 0 && (
                <InfoRow icon={<Languages className="w-4 h-4 text-blue-500" />} label="Sprachen in der WG">
                  <div className="flex flex-wrap gap-1">
                    {profile.roommateLanguages.map((l) => <Badge key={l} label={l} color="blue" />)}
                  </div>
                </InfoRow>
              )}
              {profile.roommateGenders.length > 0 && (
                <InfoRow icon={<Users className="w-4 h-4 text-purple-500" />} label="Mitbewohner:innen">
                  <GenderBadges genders={profile.roommateGenders} />
                </InfoRow>
              )}
            </div>

            {/* Wen suchen wir? */}
            <div className="py-2 border-b border-gray-100">
              <SectionTitle>Wen suchen wir?</SectionTitle>
              <InfoRow icon={<User className="w-4 h-4 text-pink-500" />} label="Geschlecht">
                <Badge
                  label={profile.preferredGender === 'alle' ? 'Alle willkommen' : profile.preferredGender}
                  color={profile.preferredGender === 'alle' ? 'green' : 'pink'}
                />
              </InfoRow>
              <InfoRow icon={<CalendarRange className="w-4 h-4 text-indigo-500" />} label="Alter">
                <span className="text-sm text-gray-700">{profile.preferredAgeMin} – {profile.preferredAgeMax} Jahre</span>
              </InfoRow>
            </div>

            {/* Map */}
            <AddressMap address={profile.address} />

            {/* Amenities */}
            {profile.amenities.length > 0 && (
              <div className="py-4 border-b border-gray-100">
                <SectionTitle>Ausstattung</SectionTitle>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {profile.amenities.map((id) => {
                    const a = AMENITY_MAP[id]
                    if (!a) return null
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <a.Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{a.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {profile.tags.length > 0 && (
              <div className="py-4">
                <SectionTitle>Vibe & Extras</SectionTitle>
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
                <SectionTitle>Über mich</SectionTitle>
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Prompts */}
            {profile.prompts && profile.prompts.length > 0 && (
              <div className="py-4 border-b border-gray-100">
                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-1">
                  {profile.prompts.map((p, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[82%] snap-center bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-4"
                    >
                      <p className="text-xs text-pink-400 font-medium mb-2 leading-snug">{p.question}</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{p.answer}</p>
                    </div>
                  ))}
                </div>
                {profile.prompts.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-2.5">
                    {profile.prompts.map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-200" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Detail rows */}
            <div className="py-2">
              <InfoRow icon={<User className="w-4 h-4 text-pink-500" />} label="Geschlecht">
                <Badge label={profile.gender} color="pink" />
              </InfoRow>
              <InfoRow
                icon={<RhythmIcon rhythm={profile.dailyRhythm} />}
                label="Tagesrhythmus"
              >
                <RhythmLabel rhythm={profile.dailyRhythm} />
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
