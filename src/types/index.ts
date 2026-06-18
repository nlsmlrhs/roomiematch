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

export interface WGProfile {
  name: string
  address: string
  description: string
  images: string[]
  roommateProfiles: RoommateProfile[]
  pendingInvites: string[]
  amenities: string[]
  tags: string[]
  internetSpeed: string
  wgRhythm: DailyRhythm
  smokingAllowed: boolean
  roommateLanguages: string[]
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

export interface DirectConversation {
  id: string
  profileId: string
  profileName: string
  profilePhoto: string
  profileKind: 'seeker' | 'flatshare'
  startedAt: string
  messages: ChatMessage[]
}

export type AppView = 'swipe' | 'matches' | 'listings' | 'my-area'

export type UserRole = 'seeker' | 'wg'
