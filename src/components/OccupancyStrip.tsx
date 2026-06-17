import { UserRound } from 'lucide-react'

const GENDER_COLOR: Record<string, string> = {
  männlich: 'text-blue-600',
  weiblich: 'text-rose-500',
  divers: 'text-amber-500',
}

interface Props {
  genders: string[]
  size?: 'sm' | 'md'
}

export function OccupancyStrip({ genders, size = 'md' }: Props) {
  const iconClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const ringClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <div className="flex items-center gap-0.5">
      {genders.map((g, i) => (
        <UserRound
          key={i}
          className={`${iconClass} ${GENDER_COLOR[g] ?? 'text-gray-400'} flex-shrink-0`}
        />
      ))}
      {/* open slot */}
      <div
        className={`${ringClass} rounded-full border-2 border-dashed border-pink-400 flex-shrink-0 inline-flex`}
      />
    </div>
  )
}
