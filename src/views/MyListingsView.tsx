import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Pencil, Trash2, ChevronRight, Euro, Calendar, MapPin, Users, Wifi, X,
  Sun, Moon, Minus, Cigarette, CigaretteOff,
  Bath, Shirt, Utensils, Trees, Car, Bike, Archive, ArrowUpDown, Home, Dog, Wind,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Flatshare, DailyRhythm, PreferredGender } from '../types'

const TAG_OPTIONS = [
  'Remote-freundlich', 'Ruhige Lage', 'Zentral', 'WG-Abende', 'Keine Partys',
  'Kreativ', 'LGBTQ+ freundlich', 'Zweck-WG', 'Gemeinschaft',
]

const AMENITY_OPTIONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'balkon',        label: 'Balkon',        Icon: Sun },
  { id: 'badewanne',     label: 'Badewanne',     Icon: Bath },
  { id: 'waschmaschine', label: 'Waschmaschine', Icon: Shirt },
  { id: 'spuelmaschine', label: 'Spülmaschine',  Icon: Utensils },
  { id: 'garten',        label: 'Garten',        Icon: Trees },
  { id: 'parkplatz',     label: 'Parkplatz',     Icon: Car },
  { id: 'fahrradkeller', label: 'Fahrradkeller', Icon: Bike },
  { id: 'keller',        label: 'Keller',        Icon: Archive },
  { id: 'aufzug',        label: 'Aufzug',        Icon: ArrowUpDown },
  { id: 'moebliert',     label: 'Möbliert',      Icon: Home },
  { id: 'haustiere',     label: 'Haustiere ok',  Icon: Dog },
  { id: 'klimaanlage',   label: 'Klimaanlage',   Icon: Wind },
]

const LANGUAGE_OPTIONS = [
  'Deutsch', 'Englisch', 'Französisch', 'Spanisch', 'Arabisch',
  'Türkisch', 'Italienisch', 'Russisch', 'Portugiesisch', 'Chinesisch',
]

const GENDER_OPTIONS = ['männlich', 'weiblich', 'divers'] as const
const PREFERRED_GENDER_OPTIONS: { value: PreferredGender; label: string }[] = [
  { value: 'alle', label: 'Alle' },
  { value: 'weiblich', label: 'Weiblich' },
  { value: 'männlich', label: 'Männlich' },
  { value: 'divers', label: 'Divers' },
]
const RHYTHM_OPTIONS: { value: DailyRhythm; label: string; icon: React.ReactNode }[] = [
  { value: 'early-bird', label: 'Frühaufsteher', icon: <Sun className="w-3.5 h-3.5" /> },
  { value: 'flexible', label: 'Flexibel', icon: <Minus className="w-3.5 h-3.5" /> },
  { value: 'night-owl', label: 'Nachtmensch', icon: <Moon className="w-3.5 h-3.5" /> },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
    />
  )
}

type FormData = Omit<Flatshare, 'id' | 'kind' | 'images'>

const EMPTY_FORM: FormData = {
  title: '',
  address: '',
  rentMonthly: 0,
  availableFrom: '',
  internetSpeed: '',
  roommates: 1,
  description: '',
  tags: [],
  amenities: [],
  roommateLanguages: [],
  roommateGenders: [],
  preferredGender: 'alle',
  smokingAllowed: false,
  wgRhythm: 'flexible',
  preferredAgeMin: 18,
  preferredAgeMax: 40,
}

function GenderCounter({
  label,
  count,
  onChange,
}: {
  label: string
  count: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, count - 1))}
          className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg leading-none active:bg-gray-200 transition-colors"
        >
          −
        </button>
        <span className="w-4 text-center text-sm font-semibold text-gray-900">{count}</span>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-lg leading-none active:bg-gray-200 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

function buildGendersArray(counts: Record<string, number>): string[] {
  return Object.entries(counts).flatMap(([g, n]) => Array(n).fill(g))
}

function parseGendersArray(arr: string[]): Record<string, number> {
  const counts: Record<string, number> = { männlich: 0, weiblich: 0, divers: 0 }
  for (const g of arr) if (g in counts) counts[g]++
  return counts
}

function ListingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: FormData
  onSave: (data: FormData) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<FormData>(initial)
  const [genderCounts, setGenderCounts] = useState<Record<string, number>>(
    parseGendersArray(initial.roommateGenders),
  )

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleTag(tag: string) {
    set('tags', form.tags.includes(tag) ? form.tags.filter((t) => t !== tag) : [...form.tags, tag])
  }

  function toggleAmenity(id: string) {
    set('amenities', form.amenities.includes(id) ? form.amenities.filter((a) => a !== id) : [...form.amenities, id])
  }

  function toggleLanguage(lang: string) {
    set(
      'roommateLanguages',
      form.roommateLanguages.includes(lang)
        ? form.roommateLanguages.filter((l) => l !== lang)
        : [...form.roommateLanguages, lang],
    )
  }

  function updateGenderCount(gender: string, n: number) {
    const updated = { ...genderCounts, [gender]: n }
    setGenderCounts(updated)
    set('roommateGenders', buildGendersArray(updated))
  }

  const valid = form.title.trim() && form.address.trim() && form.rentMonthly > 0 && form.availableFrom

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
      <div className="px-4 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center gap-3">
        <button onClick={onCancel} className="p-1.5 -ml-1 rounded-full active:bg-pink-100 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-base font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          {initial.title ? 'Inserat bearbeiten' : 'Neues Inserat'}
        </h2>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Basis */}
        <Field label="Titel">
          <Input placeholder="z.B. Helles WG-Zimmer in Schwabing" value={form.title} onChange={(e) => set('title', e.target.value)} />
        </Field>
        <Field label="Adresse">
          <Input placeholder="z.B. Leopoldstr. 12, München" value={form.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
        <Field label="Miete (€/Monat)">
          <Input type="number" placeholder="650" value={form.rentMonthly || ''} onChange={(e) => set('rentMonthly', Number(e.target.value))} />
        </Field>
        <Field label="Verfügbar ab">
          <Input type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
        </Field>
        <Field label="Mitbewohner bereits da">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => set('roommates', n)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${form.roommates === n ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </Field>

        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">WG-Details</p>

          <div className="space-y-5">
            <Field label="Tagesrhythmus der WG">
              <div className="flex gap-2">
                {RHYTHM_OPTIONS.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('wgRhythm', value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${form.wgRhythm === value ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Rauchen erlaubt?">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => set('smokingAllowed', false)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${!form.smokingAllowed ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <CigaretteOff className="w-4 h-4" /> Nein
                </button>
                <button
                  type="button"
                  onClick={() => set('smokingAllowed', true)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${form.smokingAllowed ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Cigarette className="w-4 h-4" /> Ja
                </button>
              </div>
            </Field>

            <Field label="Sprachen in der WG">
              <div className="flex flex-wrap gap-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const on = form.roommateLanguages.includes(lang)
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${on ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {lang}
                    </button>
                  )
                })}
              </div>
            </Field>

            <Field label="Geschlecht der Mitbewohner">
              <div className="bg-gray-50 rounded-xl px-3 py-1 divide-y divide-gray-100">
                {GENDER_OPTIONS.map((g) => (
                  <GenderCounter
                    key={g}
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                    count={genderCounts[g] ?? 0}
                    onChange={(n) => updateGenderCount(g, n)}
                  />
                ))}
              </div>
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Wen sucht ihr?</p>

          <div className="space-y-5">
            <Field label="Bevorzugtes Geschlecht">
              <div className="grid grid-cols-2 gap-2">
                {PREFERRED_GENDER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set('preferredGender', value)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${form.preferredGender === value ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Altersbereich">
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  placeholder="18"
                  value={form.preferredAgeMin || ''}
                  onChange={(e) => set('preferredAgeMin', Number(e.target.value))}
                />
                <span className="text-gray-400 text-sm flex-shrink-0">bis</span>
                <Input
                  type="number"
                  placeholder="40"
                  value={form.preferredAgeMax || ''}
                  onChange={(e) => set('preferredAgeMax', Number(e.target.value))}
                />
                <span className="text-gray-400 text-sm flex-shrink-0">Jahre</span>
              </div>
            </Field>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Sonstiges</p>

          <div className="space-y-5">
            <Field label="Internetgeschwindigkeit">
              <Input placeholder="z.B. 500 Mbit/s" value={form.internetSpeed} onChange={(e) => set('internetSpeed', e.target.value)} />
            </Field>
            <Field label="Beschreibung">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Was macht eure WG besonders?"
                className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 resize-none transition"
              />
            </Field>
            <Field label="Ausstattung">
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map(({ id, label, Icon }) => {
                  const on = form.amenities.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAmenity(id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${on ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {label}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label="Vibe & Extras">
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const on = form.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${on ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </Field>
          </div>
        </div>

        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-base active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Speichern <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function ListingCard({ listing, onEdit, onDelete }: { listing: Flatshare; onEdit: () => void; onDelete: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden"
    >
      {listing.images[0] ? (
        <img src={listing.images[0]} alt={listing.title} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
          <span className="text-4xl">🏠</span>
        </div>
      )}

      <div className="p-3 space-y-2">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{listing.title}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3 flex-shrink-0 text-rose-400" />
          {listing.address}
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Euro className="w-3.5 h-3.5 text-green-500" />
            {listing.rentMonthly} €/Mo
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            ab {new Date(listing.availableFrom).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Users className="w-3.5 h-3.5 text-purple-500" />
            {listing.roommates} Mitbew.
          </div>
          {listing.internetSpeed && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <Wifi className="w-3.5 h-3.5 text-blue-500" />
              {listing.internetSpeed}
            </div>
          )}
        </div>

        {listing.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {listing.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700">{t}</span>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium active:bg-gray-200 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Bearbeiten
          </button>
          {confirmDelete ? (
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500 text-white text-sm font-medium active:bg-rose-600 transition-colors"
            >
              Wirklich löschen?
            </button>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-500 text-sm font-medium active:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function MyListingsView() {
  const { myListings, addListing, updateListing, deleteListing } = useApp()
  const [mode, setMode] = useState<'list' | 'create' | { editing: Flatshare }>('list')

  if (mode === 'create') {
    return (
      <ListingForm
        initial={EMPTY_FORM}
        onSave={(data) => { addListing({ ...data, images: [] }); setMode('list') }}
        onCancel={() => setMode('list')}
      />
    )
  }

  if (typeof mode === 'object' && 'editing' in mode) {
    const { editing } = mode
    const initial: FormData = {
      title: editing.title,
      address: editing.address,
      rentMonthly: editing.rentMonthly,
      availableFrom: editing.availableFrom,
      internetSpeed: editing.internetSpeed,
      roommates: editing.roommates,
      description: editing.description,
      tags: editing.tags,
      amenities: editing.amenities,
      roommateLanguages: editing.roommateLanguages,
      roommateGenders: editing.roommateGenders,
      preferredGender: editing.preferredGender,
      smokingAllowed: editing.smokingAllowed,
      wgRhythm: editing.wgRhythm,
      preferredAgeMin: editing.preferredAgeMin,
      preferredAgeMax: editing.preferredAgeMax,
    }
    return (
      <ListingForm
        initial={initial}
        onSave={(data) => { updateListing({ ...editing, ...data }); setMode('list') }}
        onCancel={() => setMode('list')}
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="px-4 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Meine Inserate
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {myListings.length === 0 ? 'Noch kein Inserat' : `${myListings.length} Inserat${myListings.length !== 1 ? 'e' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setMode('create')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform shadow-sm"
        >
          <Plus className="w-4 h-4" /> Neu
        </button>
      </div>

      {myListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-20 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center text-3xl">🏠</div>
          <p className="text-gray-500 font-medium">Noch kein Inserat erstellt</p>
          <p className="text-gray-400 text-sm">Erstelle dein erstes Inserat und finde passende Mitbewohner.</p>
          <button
            onClick={() => setMode('create')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" /> Inserat erstellen
          </button>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-4 space-y-4">
          <AnimatePresence>
            {myListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onEdit={() => setMode({ editing: listing })}
                onDelete={() => deleteListing(listing.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
