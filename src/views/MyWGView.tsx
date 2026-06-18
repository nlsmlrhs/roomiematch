import { useState } from 'react'
import {
  Pencil, X, Minus, Send, UserPlus,
  Sun, Moon, Cigarette, CigaretteOff, Languages,
  Bath, Shirt, Utensils, Trees, Car, Bike, Archive, ArrowUpDown, Home, Dog, Wind,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { WGProfile, DailyRhythm } from '../types'
import { DEMO_WG_PROFILE, DEMO_INVITE_EMAIL } from '../data/demoData'

// ─── Constants ────────────────────────────────────────────────────────────────

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

const AMENITY_MAP = Object.fromEntries(AMENITY_OPTIONS.map(({ id, label, Icon }) => [id, { label, Icon }]))

const LANGUAGE_OPTIONS = [
  'Deutsch', 'Englisch', 'Spanisch', 'Französisch', 'Arabisch',
  'Türkisch', 'Italienisch', 'Russisch', 'Polnisch', 'Portugiesisch',
]

// ─── Display Primitives ───────────────────────────────────────────────────────

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray:   'bg-gray-100 text-gray-600',
    pink:   'bg-pink-100 text-pink-700',
    blue:   'bg-blue-100 text-blue-700',
    amber:  'bg-amber-100 text-amber-700',
    teal:   'bg-teal-100 text-teal-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${palettes[color] ?? palettes.gray}`}>
      {label}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-gray-900 mb-3">{children}</p>
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

// ─── Form Sub-Components ──────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition ${props.className ?? ''}`}
    />
  )
}

function MultiSelect({
  options,
  selected,
  onChange,
  color = 'pink',
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
  color?: string
}) {
  function toggle(val: string) {
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val])
  }
  const activeClasses: Record<string, string> = {
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
            selected.includes(opt)
              ? (activeClasses[color] ?? activeClasses.pink)
              : 'bg-gray-50 text-gray-500 border-gray-200'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ─── WGProfileView ────────────────────────────────────────────────────────────

function WGProfileView({ profile, onEdit }: { profile: WGProfile; onEdit: () => void }) {
  const { saveMyWGProfile, myProfile, demoMode } = useApp()
  const [showInviteInput, setShowInviteInput] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)

  function handleInvite() {
    const email = inviteEmail.trim()
    if (!email.includes('@')) {
      setInviteError('Bitte eine gültige E-Mail-Adresse eingeben.')
      return
    }
    if (profile.pendingInvites.includes(email)) {
      setInviteError('Diese Person wurde bereits eingeladen.')
      return
    }
    saveMyWGProfile({ ...profile, pendingInvites: [...profile.pendingInvites, email] })
    setInviteEmail('')
    setInviteError(null)
    setShowInviteInput(false)
  }

  function cancelInvite(email: string) {
    saveMyWGProfile({ ...profile, pendingInvites: profile.pendingInvites.filter((e) => e !== email) })
  }

  const adminInitial = myProfile?.firstName?.[0] ?? 'D'
  const adminName = myProfile ? myProfile.firstName : 'Du'
  const adminSub = myProfile?.occupation ?? 'WG-Admin'
  const adminPhoto = myProfile?.photos?.[0] ?? ''

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Hero */}
      <div className="relative h-64 flex-shrink-0 bg-gradient-to-br from-teal-400 to-cyan-500">
        {profile.images.length > 0 ? (
          <img src={profile.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl">🏠</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">{profile.name}</h2>
          <p className="text-sm text-white/80 mt-0.5">{profile.address}</p>
        </div>
      </div>

      <div className="px-4">
        {/* Personen in der WG */}
        <div className="py-4 border-b border-gray-100">
          <SectionTitle>Personen in der WG</SectionTitle>

          {/* Admin */}
          <div className="flex items-center gap-3 py-2.5">
            {adminPhoto ? (
              <img src={adminPhoto} alt={adminName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {adminInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{adminName}</p>
              <p className="text-xs text-gray-400">{adminSub}</p>
            </div>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Admin</span>
          </div>

          {/* Confirmed members */}
          {profile.roommateProfiles.map((r, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              {r.photo ? (
                <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-600 flex-shrink-0">
                  {r.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{r.name}, {r.age}</p>
                {r.occupation && <p className="text-xs text-gray-400">{r.occupation}</p>}
              </div>
            </div>
          ))}

          {/* Pending invites */}
          {profile.pendingInvites.map((email) => (
            <div key={email} className="flex items-center gap-3 py-2.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-dashed border-amber-300 flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 truncate">{email}</p>
                <p className="text-xs text-amber-500">Einladung ausstehend</p>
              </div>
              <button
                onClick={() => cancelInvite(email)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 flex-shrink-0"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          ))}

          {/* Invite input */}
          {showInviteInput ? (
            <div className="mt-1">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-Mail-Adresse…"
                  value={inviteEmail}
                  autoFocus
                  onChange={(e) => { setInviteEmail(e.target.value); setInviteError(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={handleInvite}
                  disabled={!inviteEmail.trim()}
                  className="flex-shrink-0 px-3.5 py-2 bg-gradient-to-br from-teal-400 to-cyan-500 text-white rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setShowInviteInput(false); setInviteEmail(''); setInviteError(null) }}
                  className="flex-shrink-0 px-3.5 py-2 bg-gray-100 text-gray-500 rounded-xl active:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {inviteError && <p className="text-xs text-rose-500 mt-1.5">{inviteError}</p>}
            </div>
          ) : (
            <button
              onClick={() => { setShowInviteInput(true); if (demoMode) setInviteEmail(DEMO_INVITE_EMAIL) }}
              className="mt-2 flex items-center gap-1.5 text-xs text-teal-600 font-medium py-1.5 px-3 rounded-xl bg-teal-50 border border-teal-100 active:bg-teal-100 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Person einladen
            </button>
          )}
        </div>

        {/* Description */}
        {profile.description && (
          <div className="py-4 border-b border-gray-100">
            <SectionTitle>Über unsere WG</SectionTitle>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
          </div>
        )}

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div className="py-4 border-b border-gray-100">
            <SectionTitle>Vibe & Extras</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {profile.tags.map((t) => <Badge key={t} label={t} color="teal" />)}
            </div>
          </div>
        )}

        {/* Internet stat */}
        {profile.internetSpeed && (
          <div className="py-4 border-b border-gray-100">
            <div className="bg-blue-50 rounded-2xl p-3 inline-block">
              <p className="text-xs text-gray-400 mb-0.5">Internet</p>
              <p className="text-base font-bold text-blue-700">{profile.internetSpeed}</p>
            </div>
          </div>
        )}

        {/* WG-Details */}
        <div className="py-2 border-b border-gray-100">
          <SectionTitle>WG-Details</SectionTitle>
          <InfoRow icon={<RhythmIcon rhythm={profile.wgRhythm} />} label="Tagesrhythmus">
            <RhythmLabel rhythm={profile.wgRhythm} />
          </InfoRow>
          <InfoRow
            icon={profile.smokingAllowed
              ? <Cigarette className="w-4 h-4 text-amber-500" />
              : <CigaretteOff className="w-4 h-4 text-gray-400" />}
            label="Rauchen"
          >
            <Badge
              label={profile.smokingAllowed ? 'Erlaubt' : 'Nicht erlaubt'}
              color={profile.smokingAllowed ? 'amber' : 'gray'}
            />
          </InfoRow>
          {profile.roommateLanguages.length > 0 && (
            <InfoRow icon={<Languages className="w-4 h-4 text-blue-500" />} label="Sprachen in der WG">
              <div className="flex flex-wrap gap-1">
                {profile.roommateLanguages.map((l) => <Badge key={l} label={l} color="blue" />)}
              </div>
            </InfoRow>
          )}
        </div>

        {/* Amenities */}
        {profile.amenities.length > 0 && (
          <div className="py-4">
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
      </div>

      {/* Sticky edit button */}
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onEdit}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
        >
          <Pencil className="w-4 h-4" /> WG-Profil bearbeiten
        </button>
      </div>
    </div>
  )
}

// ─── WGProfileForm ────────────────────────────────────────────────────────────

function WGProfileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: WGProfile
  onSave: () => void
  onCancel?: () => void
}) {
  const { saveMyWGProfile } = useApp()

  const [name, setName] = useState(initial?.name ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [internetSpeed, setInternetSpeed] = useState(initial?.internetSpeed ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? [])
  const [wgRhythm, setWgRhythm] = useState<DailyRhythm>(initial?.wgRhythm ?? 'flexible')
  const [smokingAllowed, setSmokingAllowed] = useState(initial?.smokingAllowed ?? false)
  const [roommateLanguages, setRoommateLanguages] = useState<string[]>(initial?.roommateLanguages ?? [])
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    if (!name.trim() || !address.trim()) {
      setError('Name und Adresse sind Pflichtfelder.')
      return
    }
    saveMyWGProfile({
      name: name.trim(),
      address: address.trim(),
      description: description.trim(),
      images: initial?.images ?? [],
      roommateProfiles: initial?.roommateProfiles ?? [],
      pendingInvites: initial?.pendingInvites ?? [],
      amenities,
      tags,
      internetSpeed: internetSpeed.trim(),
      wgRhythm,
      smokingAllowed,
      roommateLanguages,
    })
    onSave()
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900">
          {initial ? 'WG bearbeiten' : 'Meine WG anlegen'}
        </h2>
        {onCancel && (
          <button onClick={onCancel} className="p-2 rounded-full active:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 space-y-5">
        {error && (
          <p className="text-sm text-rose-500 bg-rose-50 rounded-xl px-3 py-2">{error}</p>
        )}

        <Field label="WG-Name *">
          <TextInput
            placeholder="z.B. Die Sonnenblume-WG"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Adresse *">
          <TextInput
            placeholder="z.B. Altstadt, Mainz"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>

        <Field label="Über unsere WG">
          <textarea
            placeholder="Erzählt ein bisschen von eurer WG, dem Wohnklima und was euch wichtig ist…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition resize-none"
          />
        </Field>

        <Field label="Internet">
          <TextInput
            placeholder="z.B. 500 Mbit/s"
            value={internetSpeed}
            onChange={(e) => setInternetSpeed(e.target.value)}
          />
        </Field>

        <Field label="Tagesrhythmus">
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: 'early-bird', label: 'Frühaufsteher', Icon: Sun },
              { value: 'flexible',   label: 'Flexibel',      Icon: Minus },
              { value: 'night-owl',  label: 'Nachtmensch',   Icon: Moon },
            ] as const).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setWgRhythm(value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  wgRhythm === value
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Rauchen">
          <div className="grid grid-cols-2 gap-2">
            {([
              { value: false, label: 'Nicht erlaubt', Icon: CigaretteOff },
              { value: true,  label: 'Erlaubt',       Icon: Cigarette },
            ] as const).map(({ value, label, Icon }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setSmokingAllowed(value)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                  smokingAllowed === value
                    ? (value ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-100 border-gray-300 text-gray-700')
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Sprachen in der WG">
          <MultiSelect
            options={LANGUAGE_OPTIONS}
            selected={roommateLanguages}
            onChange={setRoommateLanguages}
            color="pink"
          />
        </Field>

        <Field label="Vibe & Extras">
          <MultiSelect
            options={TAG_OPTIONS}
            selected={tags}
            onChange={setTags}
            color="teal"
          />
        </Field>

        <Field label="Ausstattung">
          <div className="grid grid-cols-2 gap-2">
            {AMENITY_OPTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAmenities((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors text-left ${
                  amenities.includes(id)
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="flex-shrink-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold active:scale-95 transition-transform shadow-lg"
        >
          {initial ? 'Änderungen speichern' : 'WG anlegen'}
        </button>
      </div>
    </div>
  )
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function MyWGView() {
  const { myWGProfile, demoMode } = useApp()
  const [mode, setMode] = useState<'view' | 'edit'>('view')

  if (!myWGProfile || mode === 'edit') {
    return (
      <WGProfileForm
        initial={myWGProfile ?? (demoMode ? DEMO_WG_PROFILE : undefined)}
        onSave={() => setMode('view')}
        onCancel={myWGProfile ? () => setMode('view') : undefined}
      />
    )
  }

  return <WGProfileView profile={myWGProfile} onEdit={() => setMode('edit')} />
}
