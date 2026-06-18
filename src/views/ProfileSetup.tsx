import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Check, ChevronRight, Upload, X, Plus, Pencil,
  Sun, Moon, Minus, Cigarette, CigaretteOff,
  Languages, Tag, User,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { DailyRhythm, ProfilePrompt, Seeker } from '../types'
import { DEMO_SEEKER } from '../data/demoData'

const PROMPT_QUESTIONS = [
  'Was ich an meiner zukünftigen WG schätzen würde …',
  'Mein perfektes Wochenende …',
  'In der WG bin ich für … zuständig',
  'Warum ich ausziehe …',
  'Bei mir zu Hause findet man immer …',
  'Auf WG-Abenden bin ich meistens …',
]

const HOBBY_OPTIONS = ['Kochen', 'Sport', 'Gaming', 'Musik', 'Reisen', 'Klettern', 'Kunst', 'Lesen', 'Fotografie', 'Yoga', 'Kino', 'Brettspiele']
const LANG_OPTIONS = ['Deutsch', 'Englisch', 'Spanisch', 'Französisch', 'Türkisch', 'Arabisch', 'Chinesisch', 'Italienisch']

// ─── Display primitives (mirror ProfileDetail style) ─────────────────────────

function Badge({ label, color = 'gray' }: { label: string; color?: string }) {
  const palettes: Record<string, string> = {
    gray:   'bg-gray-100 text-gray-600',
    pink:   'bg-pink-100 text-pink-700',
    blue:   'bg-blue-100 text-blue-700',
    amber:  'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
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
  const palettes: Record<string, { active: string; inactive: string }> = {
    pink: { active: 'bg-pink-500 text-white', inactive: 'bg-gray-100 text-gray-600' },
    blue: { active: 'bg-blue-500 text-white', inactive: 'bg-gray-100 text-gray-600' },
  }
  const { active, inactive } = palettes[color] ?? palettes.pink
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o)
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(on ? selected.filter((s) => s !== o) : [...selected, o])}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${on ? active : inactive}`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

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

// ─── Profile Form ─────────────────────────────────────────────────────────────

function ProfileForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Seeker
  onSave: (isNew: boolean) => void
  onCancel?: () => void
}) {
  const { saveMyProfile, setProfileVisible } = useApp()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isNew = !initial

  const [firstName, setFirstName] = useState(initial?.firstName ?? '')
  const [age, setAge] = useState(initial?.age ? String(initial.age) : '')
  const [occupation, setOccupation] = useState(initial?.occupation ?? '')
  const [hobbies, setHobbies] = useState<string[]>(initial?.hobbies ?? [])
  const [languages, setLanguages] = useState<string[]>(initial?.languages ?? ['Deutsch'])
  const [smoker, setSmoker] = useState(initial?.smoker ?? false)
  const [rhythm, setRhythm] = useState<DailyRhythm>(initial?.dailyRhythm ?? 'flexible')
  const [budget, setBudget] = useState(initial?.budgetMax ? String(initial.budgetMax) : '')
  const [movingDate, setMovingDate] = useState(initial?.movingDate ?? '')
  const [bio, setBio] = useState(initial?.bio ?? '')
  const [prompts, setPrompts] = useState<ProfilePrompt[]>(initial?.prompts ?? [])

  const usedQuestions = new Set(prompts.map((p) => p.question))

  function addPrompt() {
    const next = PROMPT_QUESTIONS.find((q) => !usedQuestions.has(q))
    if (prompts.length < 3 && next) setPrompts([...prompts, { question: next, answer: '' }])
  }
  function removePrompt(i: number) {
    setPrompts(prompts.filter((_, idx) => idx !== i))
  }
  function updatePrompt(i: number, field: keyof ProfilePrompt, value: string) {
    setPrompts(prompts.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)))
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = 'Bitte gib deinen Vornamen ein.'
    const ageNum = parseInt(age)
    if (!age || ageNum < 16 || ageNum > 99) e.age = 'Bitte ein gültiges Alter (16–99) eingeben.'
    if (!budget || parseInt(budget) <= 0) e.budget = 'Bitte ein Budget über 0 € eingeben.'
    if (!movingDate) e.movingDate = 'Bitte ein Einzugsdatum wählen.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    const seeker: Seeker = {
      kind: 'seeker',
      id: 'me',
      firstName: firstName.trim() || 'Du',
      lastName: '',
      age: parseInt(age) || 0,
      gender: 'divers',
      photos: [],
      occupation: occupation.trim(),
      hobbies,
      languages,
      smoker,
      dailyRhythm: rhythm,
      budgetMax: parseInt(budget) || 0,
      movingDate,
      bio: bio.trim(),
      prompts: prompts.filter((p) => p.answer.trim()),
    }
    saveMyProfile(seeker)
    if (isNew) setProfileVisible(true)
    onSave(isNew)
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
        {onCancel && (
          <button onClick={onCancel} className="p-1.5 -ml-1 rounded-full active:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{isNew ? 'Mein Profil' : 'Profil bearbeiten'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">So siehst du für andere aus</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        <div className="flex gap-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-24 h-28 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">{i === 0 ? 'Hauptfoto' : 'Foto 2'}</span>
            </div>
          ))}
        </div>

        <Field label="Vorname">
          <TextInput placeholder="Lena" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          {errors.firstName && <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>}
        </Field>
        <Field label="Alter">
          <TextInput type="number" placeholder="24" value={age} onChange={(e) => setAge(e.target.value)} />
          {errors.age && <p className="text-xs text-rose-500 mt-1">{errors.age}</p>}
        </Field>
        <Field label="Beruf / Studium">
          <TextInput placeholder="z.B. Architektur-Studentin" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
        </Field>
        <Field label="Über mich">
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kurze Beschreibung über dich…"
            className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 resize-none transition"
          />
        </Field>
        <Field label="Kurz-Prompts">
          <div className="space-y-3">
            {prompts.map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-3 space-y-2 relative">
                <button
                  type="button"
                  onClick={() => removePrompt(i)}
                  className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <select
                  value={p.question}
                  onChange={(e) => updatePrompt(i, 'question', e.target.value)}
                  className="w-full bg-white rounded-xl px-3 py-2 text-xs text-gray-600 border border-gray-200 outline-none pr-2"
                >
                  {PROMPT_QUESTIONS.map((q) => (
                    <option key={q} value={q} disabled={usedQuestions.has(q) && q !== p.question}>
                      {q}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  value={p.answer}
                  onChange={(e) => updatePrompt(i, 'answer', e.target.value)}
                  placeholder="Deine Antwort…"
                  className="w-full bg-white rounded-xl px-3 py-2 text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-pink-300 resize-none transition"
                />
              </div>
            ))}
            {prompts.length < 3 && (
              <button
                type="button"
                onClick={addPrompt}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Prompt hinzufügen
              </button>
            )}
          </div>
        </Field>
        <Field label="Hobbys">
          <MultiSelect options={HOBBY_OPTIONS} selected={hobbies} onChange={setHobbies} color="pink" />
        </Field>
        <Field label="Sprachen">
          <MultiSelect options={LANG_OPTIONS} selected={languages} onChange={setLanguages} color="blue" />
        </Field>
        <Field label="Tagesrhythmus">
          <div className="flex gap-2">
            {(['early-bird', 'flexible', 'night-owl'] as DailyRhythm[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRhythm(r)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${rhythm === r ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {r === 'early-bird' ? '🌅 Frühaufst.' : r === 'night-owl' ? '🌙 Nachtmensch' : '⚡ Flexibel'}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Raucher?">
          <div className="flex gap-2">
            {[false, true].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setSmoker(v)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${smoker === v ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {v ? '🚬 Ja' : '🚭 Nein'}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Max. Budget (€/Monat)">
          <TextInput type="number" placeholder="650" value={budget} onChange={(e) => setBudget(e.target.value)} />
          {errors.budget && <p className="text-xs text-rose-500 mt-1">{errors.budget}</p>}
        </Field>
        <Field label="Einzug ab">
          <TextInput type="date" value={movingDate} onChange={(e) => setMovingDate(e.target.value)} />
          {errors.movingDate && <p className="text-xs text-rose-500 mt-1">{errors.movingDate}</p>}
        </Field>

        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-base active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Profil speichern <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ─── Profile View (detail-style read view) ────────────────────────────────────

function ProfileView({ profile, onEdit }: { profile: Seeker; onEdit: () => void }) {
  const { profileVisible, setProfileVisible } = useApp()
  const initials = profile.firstName.charAt(0).toUpperCase()

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-br from-pink-400 to-rose-500 flex-shrink-0">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {initials}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white drop-shadow-sm">{profile.firstName}, {profile.age}</h2>
          {profile.occupation && <p className="text-sm text-white/80 mt-0.5">{profile.occupation}</p>}
        </div>
      </div>

      <div className="px-4 pb-28">
        {/* Visibility toggle */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{profileVisible ? '🔍' : '💤'}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {profileVisible ? 'Profil aktiv' : 'Profil pausiert'}
              </p>
              <p className="text-xs text-gray-400">
                {profileVisible ? 'Für andere sichtbar' : 'Wirst nicht angezeigt'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setProfileVisible(!profileVisible)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${profileVisible ? 'bg-green-400' : 'bg-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-all duration-200 ${profileVisible ? 'left-[26px]' : 'left-[2px]'}`}
            />
          </button>
        </div>

        {/* Key stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Über mich</p>
            <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Prompts carousel */}
        {profile.prompts && profile.prompts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
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
          </div>
        )}

        {/* Detail info rows */}
        <div className="mt-4 pt-2 border-t border-gray-100">
          <InfoRow icon={<User className="w-4 h-4 text-pink-500" />} label="Geschlecht">
            <Badge label={profile.gender} color="pink" />
          </InfoRow>
          <InfoRow icon={<RhythmIcon rhythm={profile.dailyRhythm} />} label="Tagesrhythmus">
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
      </div>

      {/* Sticky edit button */}
      <div className="sticky bottom-0 px-4 pb-6 pt-3 bg-gradient-to-t from-white via-white to-transparent">
        <button
          onClick={onEdit}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
        >
          <Pencil className="w-4 h-4" /> Profil bearbeiten
        </button>
      </div>
    </div>
  )
}

// ─── First-save success screen ────────────────────────────────────────────────

function SavedScreen() {
  const { setView } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
        <Check className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Profil gespeichert!</h2>
      <p className="text-gray-500">Dein Profil ist jetzt für andere sichtbar. Viel Erfolg beim Matchen!</p>
      <button
        onClick={() => setView('swipe')}
        className="mt-2 px-6 py-3 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold active:scale-95 transition-transform"
      >
        Zum Swipen →
      </button>
    </motion.div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function ProfileSetup() {
  const { myProfile, demoMode } = useApp()
  const [mode, setMode] = useState<'view' | 'edit' | 'new-saved'>('view')

  if (mode === 'new-saved') return <SavedScreen />

  if (!myProfile || mode === 'edit') {
    return (
      <ProfileForm
        initial={myProfile ?? (demoMode ? DEMO_SEEKER : undefined)}
        onSave={(isNew) => setMode(isNew ? 'new-saved' : 'view')}
        onCancel={myProfile ? () => setMode('view') : undefined}
      />
    )
  }

  return <ProfileView profile={myProfile} onEdit={() => setMode('edit')} />
}
