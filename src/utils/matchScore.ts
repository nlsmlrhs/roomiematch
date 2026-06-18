import type { Seeker, Flatshare } from '../types'

const TAG_HOBBY_AFFINITY: Record<string, string[]> = {
  'WG-Abende':         ['Kochen', 'Kino', 'Brettspiele', 'Gaming'],
  'Gemeinschaft':      ['Kochen', 'Sport', 'Brettspiele', 'Kino'],
  'Kreativ':           ['Kunst', 'Fotografie', 'Musik', 'Kino'],
  'Keine Partys':      ['Lesen', 'Yoga', 'Kunst', 'Fotografie'],
  'Zweck-WG':          ['Lesen', 'Yoga'],
  'Remote-freundlich': ['Gaming', 'Lesen', 'Kunst', 'Fotografie'],
  'Zentral':           ['Kino', 'Reisen'],
  'Ruhige Lage':       ['Lesen', 'Yoga', 'Klettern'],
  'LGBTQ+ freundlich': [],
}

export function computeScore(seeker: Seeker, flatshare: Flatshare): number {
  let score = 0

  // Budget (25 pts)
  if (seeker.budgetMax >= flatshare.rentMonthly) {
    score += 25
  } else {
    const overBy = (flatshare.rentMonthly - seeker.budgetMax) / seeker.budgetMax
    score += Math.max(0, 25 * (1 - overBy / 0.15))
  }

  // Smoking (15 pts)
  if (!seeker.smoker || flatshare.smokingAllowed) {
    score += 15
  }

  // Daily rhythm (15 pts)
  if (seeker.dailyRhythm === flatshare.wgRhythm) {
    score += 15
  } else if (seeker.dailyRhythm === 'flexible' || flatshare.wgRhythm === 'flexible') {
    score += 10
  }

  // Age (15 pts)
  if (seeker.age >= flatshare.preferredAgeMin && seeker.age <= flatshare.preferredAgeMax) {
    score += 15
  }

  // Languages (10 pts)
  if (flatshare.roommateLanguages.length === 0) {
    score += 10
  } else {
    const overlap = seeker.languages.filter((l) => flatshare.roommateLanguages.includes(l)).length
    const maxPossible = Math.min(seeker.languages.length, flatshare.roommateLanguages.length)
    score += maxPossible > 0 ? 10 * (overlap / maxPossible) : 10
  }

  // Gender preference (10 pts)
  if (flatshare.preferredGender === 'alle' || flatshare.preferredGender === seeker.gender) {
    score += 10
  }

  // Tags ↔ Hobbys (5 pts)
  const relevantTags = flatshare.tags.filter((t) => TAG_HOBBY_AFFINITY[t] !== undefined)
  if (relevantTags.length > 0) {
    const matches = relevantTags.filter((t) =>
      (TAG_HOBBY_AFFINITY[t] ?? []).some((h) => seeker.hobbies.includes(h)),
    ).length
    score += 5 * (matches / relevantTags.length)
  } else {
    score += 5
  }

  // Moving date (5 pts)
  if (seeker.movingDate && flatshare.availableFrom) {
    const diffDays =
      Math.abs(new Date(seeker.movingDate).getTime() - new Date(flatshare.availableFrom).getTime()) /
      (1000 * 60 * 60 * 24)
    if (diffDays <= 14) score += 5
    else if (diffDays <= 30) score += 3
    else if (diffDays <= 60) score += 1
  }

  return Math.round(Math.min(100, score))
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700'
  if (score >= 60) return 'bg-amber-100 text-amber-700'
  return 'bg-rose-100 text-rose-700'
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'Sehr gut'
  if (score >= 60) return 'Gut'
  return 'Mäßig'
}
