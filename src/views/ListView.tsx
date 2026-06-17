import { MapPin, Euro, Calendar, Wifi, Users } from 'lucide-react'
import type { Profile } from '../types'
import { useApp } from '../context/AppContext'

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

function ListItem({ profile }: { profile: Profile }) {
  const { setDetailProfile } = useApp()
  const images = profile.kind === 'seeker' ? profile.photos : profile.images
  const photo = images[0]

  if (profile.kind === 'flatshare') {
    return (
      <div onClick={() => setDetailProfile(profile)} className="bg-white rounded-2xl overflow-hidden flex flex-col border border-pink-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
        {/* Vollbild-Foto */}
        <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
          {photo ? (
            <img src={photo} alt={profile.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">🏠</span>
          )}
        </div>

        {/* Info-Block */}
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
            <InfoCell icon={<Users className="w-3.5 h-3.5 text-purple-500" />} label="Mitbewohner" value={`${profile.roommates} Person${profile.roommates !== 1 ? 'en' : ''}`} />
            <InfoCell icon={<Wifi className="w-3.5 h-3.5 text-blue-500" />} label="Internet" value={profile.internetSpeed} />
          </div>

          {profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {profile.tags.slice(0, 3).map((t) => (
                <Badge key={t} label={t} color="pink" />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div onClick={() => setDetailProfile(profile)} className="bg-white rounded-2xl overflow-hidden flex flex-col border border-pink-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform">
      {/* Vollbild-Foto */}
      <div className="w-full h-48 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center flex-shrink-0">
        {photo ? (
          <img src={photo} alt={profile.firstName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">👤</span>
        )}
      </div>

      {/* Info-Block */}
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
            {profile.hobbies.slice(0, 3).map((h) => (
              <Badge key={h} label={h} color="pink" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function ListView({ queue }: { queue: Profile[] }) {
  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
        <span className="text-4xl">🔍</span>
        <p className="text-gray-400 text-sm">Keine Profile mehr verfügbar</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar w-full">
      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex-shrink-0">
        <h2 className="text-base font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          {queue.length} {queue.length !== 1 ? 'Profile' : 'Profil'} in deiner Nähe
        </h2>
      </div>
      <div className="px-4 pt-4 pb-4 space-y-4">
        {queue.map((profile) => (
          <ListItem key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  )
}
