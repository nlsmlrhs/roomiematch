export type DailyRhythm = 'early-bird' | 'night-owl' | 'flexible'

export interface Seeker {
  kind: 'seeker'
  id: string
  firstName: string
  lastName: string
  age: number
  photos: string[]
  occupation: string
  hobbies: string[]
  languages: string[]
  smoker: boolean
  dailyRhythm: DailyRhythm
  budgetMax: number
  movingDate: string
  bio: string
}

export interface Flatshare {
  kind: 'flatshare'
  id: string
  title: string
  images: string[]
  rentMonthly: number
  availableFrom: string
  internetSpeed: string
  address: string
  roommates: number
  description: string
  tags: string[]
}

export type Profile = Seeker | Flatshare

export type SwipeDirection = 'left' | 'right'

export interface Match {
  id: string
  seeker: Seeker
  flatshare: Flatshare
  matchedAt: string
  messages: ChatMessage[]
}

export interface ChatMessage {
  id: string
  senderId: string
  text: string
  sentAt: string
}

export type AppView = 'swipe' | 'matches' | 'profile-setup' | 'my-listings'

export type UserRole = 'seeker' | 'wg'
