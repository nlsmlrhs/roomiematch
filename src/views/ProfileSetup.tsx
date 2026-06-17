import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { DailyRhythm } from '../types'

const HOBBY_OPTIONS = ['Kochen', 'Sport', 'Gaming', 'Musik', 'Reisen', 'Klettern', 'Kunst', 'Lesen', 'Fotografie', 'Yoga', 'Kino', 'Brettspiele']
const LANG_OPTIONS = ['Deutsch', 'Englisch', 'Spanisch', 'Französisch', 'Türkisch', 'Arabisch', 'Chinesisch', 'Italienisch']

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

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-gray-100 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition"
    />
  )
}

export function ProfileSetup() {
  const { setView } = useApp()
  const [saved, setSaved] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [age, setAge] = useState('')
  const [occupation, setOccupation] = useState('')
  const [hobbies, setHobbies] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>(['Deutsch'])
  const [smoker, setSmoker] = useState(false)
  const [rhythm, setRhythm] = useState<DailyRhythm>('flexible')
  const [budget, setBudget] = useState('')
  const [movingDate, setMovingDate] = useState('')
  const [bio, setBio] = useState('')

  if (saved) {
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

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Mein Profil</h2>
        <p className="text-sm text-gray-400 mt-0.5">So siehst du für andere aus</p>
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
          <Input placeholder="Lena" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Alter">
          <Input type="number" placeholder="24" value={age} onChange={(e) => setAge(e.target.value)} />
        </Field>
        <Field label="Beruf / Studium">
          <Input placeholder="z.B. Architektur-Studentin" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
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
          <Input type="number" placeholder="650" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </Field>
        <Field label="Einzug ab">
          <Input type="date" value={movingDate} onChange={(e) => setMovingDate(e.target.value)} />
        </Field>

        <button
          onClick={() => setSaved(true)}
          className="w-full py-3.5 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl font-semibold text-base active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Profil speichern <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
