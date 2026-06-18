import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, ChevronRight, Euro, Calendar, MapPin, X,
  Sun, Moon, Minus, Cigarette, CigaretteOff, Languages, User, CalendarRange,
  Bath, Shirt, Utensils, Trees, Car, Bike, Archive, ArrowUpDown, Home, Dog, Wind,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Flatshare, PreferredGender } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────

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

const PREFERRED_GENDER_OPTIONS: { value: PreferredGender; label: string }[] = [
  { value: 'alle',      label: 'Alle' },
  { value: 'weiblich',  label: 'Weiblich' },
  { value: 'männlich',  label: 'Männlich' },
  { value: 'divers',    label: 'Divers' },
]

// ─── Display Primitives ───────────────────────────────────────────────────────

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray:   'bg-gray-100 text-gray-600',
    pink:   'bg-pink-100 text-pink-700',
    green:  'bg-green-100 text-green-700',
    blue:   'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber:  'bg-amber-100 text-amber-700',
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

function RhythmIcon({ rhythm }: { rhythm: string }) {
  if (rhythm === 'early-bird') return <Sun className="w-4 h-4 text-amber-500" />
  if (rhythm === 'night-owl') return <Moon className="w-4 h-4 text-indigo-500" />
  return <Minus className="w-4 h-4 text-gray-400" />
}

function RhythmLabel({ rhythm }: { rhythm: string }) {
  if (rhythm === 'early-bird') return <Badge label="Frühaufsteher" color="amber" />
  if (rhythm === 'night-owl') return <Badge label="Nachtmensch" color="purple" />
  return <Badge label="Flexibel" color="gray" />
}

// ─── Form helpers ─────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
    />
  )
}

// Room-specific form data — WG details come from myWGProfile
type RoomFormData = {
  title: string
  rentMonthly: number
  availableFrom: string
  description: string
  preferredGender: PreferredGender
  preferredAgeMin: number
  preferredAgeMax: number
}

const EMPTY_ROOM_FORM: RoomFormData = {
  title: '',
  rentMonthly: 0,
  availableFrom: '',
  description: '',
  preferredGender: 'alle',
  preferredAgeMin: 18,
  preferredAgeMax: 40,
}

const DEMO_ROOM_FORM: RoomFormData = {
  title: 'Helles 14m² Zimmer mit Balkonzugang',
  rentMonthly: 750,
  availableFrom: '2026-08-01',
  description: 'Ein helles, ruhig gelegenes Zimmer im Hinterhaus. Frisch gestrichen, neue Holzböden. Das Zimmer hat direkten Zugang zum gemeinsamen Balkon.',
  preferredGender: 'alle',
  preferredAgeMin: 22,
  preferredAgeMax: 35,
}

// ─── Listing Form ─────────────────────────────────────────────────────────────

function ListingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: RoomFormData
  onSave: (data: Omit<Flatshare, 'id' | 'kind'>) => void
  onCancel?: () => void
}) {
  const { myWGProfile, setMyAreaTab, setView } = useApp()
  const [title, setTitle] = useState(initial.title)
  const [rentMonthly, setRentMonthly] = useState(initial.rentMonthly)
  const [availableFrom, setAvailableFrom] = useState(initial.availableFrom)
  const [description, setDescription] = useState(initial.description)
  const [preferredGender, setPreferredGender] = useState<PreferredGender>(initial.preferredGender)
  const [preferredAgeMin, setPreferredAgeMin] = useState(initial.preferredAgeMin)
  const [preferredAgeMax, setPreferredAgeMax] = useState(initial.preferredAgeMax)

  // Guard — parent should not render this without a WG profile
  if (!myWGProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl">🏠</div>
        <p className="font-semibold text-gray-800">Erst WG-Profil anlegen</p>
        <p className="text-sm text-gray-400">Inserate sind mit deinem WG-Profil verknüpft. Leg zuerst eine WG an.</p>
        <button
          onClick={() => { setView('my-area'); setMyAreaTab('wg') }}
          className="px-5 py-2.5 bg-gradient-to-br from-teal-400 to-cyan-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          Zur Meine WG →
        </button>
      </div>
    )
  }

  const valid = title.trim() && rentMonthly > 0 && availableFrom && preferredAgeMin < preferredAgeMax

  function handleSave() {
    if (!valid) return
    onSave({
      title: title.trim(),
      images: [],
      rentMonthly,
      availableFrom,
      description: description.trim(),
      preferredGender,
      preferredAgeMin,
      preferredAgeMax,
      // From WG profile (non-null guaranteed by early return guard above)
      address: myWGProfile!.address,
      internetSpeed: myWGProfile!.internetSpeed,
      amenities: myWGProfile!.amenities,
      tags: myWGProfile!.tags,
      roommateProfiles: myWGProfile!.roommateProfiles,
      roommates: myWGProfile!.roommateProfiles.length,
      wgRhythm: myWGProfile!.wgRhythm,
      smokingAllowed: myWGProfile!.smokingAllowed,
      roommateLanguages: myWGProfile!.roommateLanguages,
      roommateGenders: [],
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
        {onCancel && (
          <button onClick={onCancel} className="p-1.5 -ml-1 rounded-full active:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{initial.title ? 'Inserat bearbeiten' : 'Neues Inserat'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">Zimmer zur WG ausschreiben</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5">
        {/* WG-Profil verknüpft */}
        <div className="bg-teal-50 rounded-2xl px-3.5 py-3 border border-teal-100">
          <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-2">WG-Profil verknüpft</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-lg flex-shrink-0">
              🏠
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{myWGProfile.name}</p>
              <p className="text-xs text-gray-400 truncate">{myWGProfile.address}</p>
            </div>
          </div>
          <p className="text-xs text-teal-400 mt-2 leading-relaxed">
            Adresse, Ausstattung & WG-Vibe werden automatisch übernommen.
          </p>
        </div>

        {/* Zimmer-Details */}
        <Field label="Titel des Inserats *">
          <TextInput
            placeholder="z.B. Helles Zimmer mit Balkon"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Miete (€/Monat) *">
          <TextInput
            type="number"
            placeholder="650"
            value={rentMonthly || ''}
            onChange={(e) => setRentMonthly(Number(e.target.value))}
          />
        </Field>

        <Field label="Verfügbar ab *">
          <TextInput
            type="date"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
          />
        </Field>

        <Field label="Zimmer-Beschreibung">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was ist besonders an diesem Zimmer?"
            className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 resize-none transition"
          />
        </Field>

        {/* Wen sucht ihr? */}
        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Wen sucht ihr?</p>
          <div className="space-y-4">
            <Field label="Bevorzugtes Geschlecht">
              <div className="grid grid-cols-2 gap-2">
                {PREFERRED_GENDER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPreferredGender(value)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      preferredGender === value ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Altersbereich">
              <div className="flex items-center gap-3">
                <TextInput
                  type="number"
                  placeholder="18"
                  value={preferredAgeMin || ''}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setPreferredAgeMin(v)
                    if (v >= preferredAgeMax) setPreferredAgeMax(v + 1)
                  }}
                />
                <span className="text-gray-400 text-sm flex-shrink-0">bis</span>
                <TextInput
                  type="number"
                  placeholder="40"
                  value={preferredAgeMax || ''}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setPreferredAgeMax(v)
                    if (v <= preferredAgeMin) setPreferredAgeMin(Math.max(16, v - 1))
                  }}
                />
                <span className="text-gray-400 text-sm flex-shrink-0">Jahre</span>
              </div>
              {preferredAgeMin >= preferredAgeMax && (
                <p className="text-xs text-rose-500 mt-1">Min. muss kleiner als Max. sein.</p>
              )}
            </Field>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSave}
          disabled={!valid}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-base active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Inserat veröffentlichen <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ─── Listing Detail View ──────────────────────────────────────────────────────

function ListingDetailView({
  listing,
  onEdit,
  onDelete,
  onAdd,
}: {
  listing: Flatshare
  onEdit: () => void
  onDelete: () => void
  onAdd: () => void
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-br from-pink-400 to-rose-500 flex-shrink-0">
        {listing.images[0] ? (
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-7xl">🏠</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        <button
          onClick={onAdd}
          aria-label="Inserat hinzufügen"
          className="absolute top-10 right-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:bg-black/50 transition-colors"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">{listing.title}</h2>
          <p className="text-sm text-white/80 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5" /> {listing.address}
          </p>
        </div>
      </div>

      <div className="px-4 pb-32">
        {/* Key stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-2xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Miete</p>
            <p className="text-base font-bold text-green-700">
              {listing.rentMonthly} €<span className="text-sm font-normal">/Mo</span>
            </p>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-3">
            <p className="text-xs text-gray-400 mb-0.5">Frei ab</p>
            <p className="text-base font-bold text-indigo-700">
              {new Date(listing.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
            </p>
          </div>
          {listing.roommates > 0 && (
            <div className="bg-purple-50 rounded-2xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Mitbewohner</p>
              <p className="text-base font-bold text-purple-700">
                {listing.roommates} Person{listing.roommates !== 1 ? 'en' : ''}
              </p>
            </div>
          )}
          {listing.internetSpeed && (
            <div className="bg-blue-50 rounded-2xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Internet</p>
              <p className="text-base font-bold text-blue-700">{listing.internetSpeed}</p>
            </div>
          )}
        </div>

        {/* Roommate profiles carousel */}
        {listing.roommateProfiles && listing.roommateProfiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <SectionTitle>Deine zukünftigen Mitbewohner</SectionTitle>
            <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-2 mt-3">
              {listing.roommateProfiles.map((r, i) => (
                <div key={i} className="flex-shrink-0 w-44 snap-center bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  {r.photo ? (
                    <img src={r.photo} alt={r.name} className="w-full h-28 object-cover rounded-xl mb-2" />
                  ) : (
                    <div className="w-full h-28 rounded-xl mb-2 bg-teal-100 flex items-center justify-center text-3xl font-bold text-teal-500">
                      {r.name[0]}
                    </div>
                  )}
                  <p className="font-semibold text-sm text-gray-900">{r.name}, {r.age}</p>
                  <p className="text-xs text-gray-400 mb-1">{r.occupation}</p>
                  {r.bio && <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{r.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <SectionTitle>Über das Zimmer</SectionTitle>
            <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
        )}

        {/* Tags */}
        {listing.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <SectionTitle>Vibe & Extras</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {listing.tags.map((t) => <Badge key={t} label={t} color="pink" />)}
            </div>
          </div>
        )}

        {/* WG-Details */}
        <div className="mt-4 pt-2 border-t border-gray-100">
          <SectionTitle>WG-Details</SectionTitle>
          <InfoRow icon={<RhythmIcon rhythm={listing.wgRhythm} />} label="Tagesrhythmus">
            <RhythmLabel rhythm={listing.wgRhythm} />
          </InfoRow>
          <InfoRow
            icon={listing.smokingAllowed
              ? <Cigarette className="w-4 h-4 text-amber-500" />
              : <CigaretteOff className="w-4 h-4 text-gray-400" />}
            label="Rauchen"
          >
            <Badge label={listing.smokingAllowed ? 'Erlaubt' : 'Nicht erlaubt'} color={listing.smokingAllowed ? 'amber' : 'gray'} />
          </InfoRow>
          {listing.roommateLanguages.length > 0 && (
            <InfoRow icon={<Languages className="w-4 h-4 text-blue-500" />} label="Sprachen in der WG">
              <div className="flex flex-wrap gap-1">
                {listing.roommateLanguages.map((l) => <Badge key={l} label={l} color="blue" />)}
              </div>
            </InfoRow>
          )}
        </div>

        {/* Wen sucht ihr? */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <SectionTitle>Wen sucht ihr?</SectionTitle>
          <InfoRow icon={<User className="w-4 h-4 text-pink-500" />} label="Geschlecht">
            <Badge
              label={listing.preferredGender === 'alle' ? 'Alle willkommen' : listing.preferredGender}
              color={listing.preferredGender === 'alle' ? 'green' : 'pink'}
            />
          </InfoRow>
          <InfoRow icon={<CalendarRange className="w-4 h-4 text-indigo-500" />} label="Alter">
            <span className="text-sm text-gray-700">{listing.preferredAgeMin} – {listing.preferredAgeMax} Jahre</span>
          </InfoRow>
        </div>

        {/* Amenities */}
        {listing.amenities.length > 0 && (
          <div className="mt-2 pt-4 border-t border-gray-100">
            <SectionTitle>Ausstattung</SectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {listing.amenities.map((id) => {
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
      </div>

      {/* Sticky action buttons */}
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent space-y-2">
        <button
          onClick={onEdit}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
        >
          <Pencil className="w-4 h-4" /> Inserat bearbeiten
        </button>
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium active:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2.5 rounded-2xl bg-rose-500 text-white text-sm font-semibold active:bg-rose-600"
            >
              Wirklich löschen
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-2 text-sm text-rose-400 font-medium flex items-center justify-center gap-1.5 active:text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Inserat löschen
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Overview (multiple listings) ────────────────────────────────────────────

function ListingMiniCard({ listing, onSelect }: { listing: Flatshare; onSelect: () => void }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200 flex-shrink-0">
        {listing.images[0]
          ? <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 truncate">{listing.title}</p>
        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 flex-shrink-0 text-rose-400" />{listing.address}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
            <Euro className="w-3 h-3" />{listing.rentMonthly}
          </span>
          <span className="text-xs text-indigo-500 flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            {new Date(listing.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </motion.button>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

type Mode = 'overview' | 'create' | { viewing: Flatshare } | { editing: Flatshare }

export function MyListingsView() {
  const { myListings, myWGProfile, addListing, updateListing, deleteListing, setView, setMyAreaTab, demoMode } = useApp()
  const [mode, setMode] = useState<Mode>('overview')

  // Create form
  if (mode === 'create') {
    return (
      <ListingForm
        initial={demoMode ? DEMO_ROOM_FORM : EMPTY_ROOM_FORM}
        onSave={(data) => { addListing(data); setMode('overview') }}
        onCancel={myListings.length > 0 ? () => setMode('overview') : undefined}
      />
    )
  }

  // Edit form
  if (typeof mode === 'object' && 'editing' in mode) {
    const { editing } = mode
    const initial: RoomFormData = {
      title: editing.title,
      rentMonthly: editing.rentMonthly,
      availableFrom: editing.availableFrom,
      description: editing.description,
      preferredGender: editing.preferredGender,
      preferredAgeMin: editing.preferredAgeMin,
      preferredAgeMax: editing.preferredAgeMax,
    }
    return (
      <ListingForm
        initial={initial}
        onSave={(data) => { updateListing({ ...editing, ...data }); setMode('overview') }}
        onCancel={() => setMode('overview')}
      />
    )
  }

  // Detail view
  if (typeof mode === 'object' && 'viewing' in mode) {
    const live = myListings.find((l) => l.id === mode.viewing.id) ?? mode.viewing
    return (
      <ListingDetailView
        listing={live}
        onEdit={() => setMode({ editing: live })}
        onDelete={() => { deleteListing(live.id); setMode('overview') }}
        onAdd={() => setMode('create')}
      />
    )
  }

  // No WG profile — prompt to create one first
  if (!myWGProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl">🏠</div>
        <p className="font-semibold text-gray-800">Erst WG-Profil anlegen</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Inserate sind mit deinem WG-Profil verknüpft. Leg zuerst eine WG an — Adresse, Ausstattung und Vibe werden dann automatisch übernommen.
        </p>
        <button
          onClick={() => { setView('my-area'); setMyAreaTab('wg') }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-teal-400 to-cyan-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          WG-Profil anlegen →
        </button>
      </div>
    )
  }

  // No listings yet
  if (myListings.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-3xl">📋</div>
        <p className="font-semibold text-gray-800">Noch kein Inserat erstellt</p>
        <p className="text-sm text-gray-400">Schaltet ein Zimmer-Inserat und findet passende Mitbewohner.</p>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" /> Inserat erstellen
        </button>
      </div>
    )
  }

  // Single listing — show detail directly
  if (myListings.length === 1) {
    return (
      <ListingDetailView
        listing={myListings[0]}
        onEdit={() => setMode({ editing: myListings[0] })}
        onDelete={() => { deleteListing(myListings[0].id); setMode('overview') }}
        onAdd={() => setMode('create')}
      />
    )
  }

  // Multiple listings — selectable list
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Meine Inserate
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{myListings.length} Inserate</p>
        </div>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform shadow-sm"
        >
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {myListings.map((listing) => (
            <ListingMiniCard key={listing.id} listing={listing} onSelect={() => setMode({ viewing: listing })} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
