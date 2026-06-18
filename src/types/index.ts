export type DailyRhythm = 'early-bird' | 'night-owl' | 'flexible'

export interface ProfilePrompt {
  question: string
  answer: string
}

export type Gender = 'männlich' | 'weiblich' | 'divers'
export type PreferredGender = 'alle' | Gender

export interface Seeker {
  kind: 'seeker'
  id: string
  firstName: string
  lastName: string
  age: number
  gender: Gender
  photos: string[]
  occupation: string
  hobbies: string[]
  languages: string[]
  smoker: boolean
  dailyRhythm: DailyRhythm
  budgetMax: number
  movingDate: string
  bio: string
  prompts?: ProfilePrompt[]
}

export interface RoommateProfile {
  name: string
  age: number
  occupation: string
  photo: string
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
  amenities: string[]
  roommateLanguages: string[]
  roommateGenders: string[]
  roommateProfiles?: RoommateProfile[]
  preferredGender: PreferredGender
  smokingAllowed: boolean
  wgRhythm: DailyRhythm
  preferredAgeMin: number
  preferredAgeMax: number
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

export type AppView = 'swipe' | 'matches' | 'my-area'

export type UserRole = 'seeker' | 'wg'
