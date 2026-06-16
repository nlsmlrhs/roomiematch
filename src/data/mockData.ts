import type { Seeker, Flatshare, Match } from '../types'

export const mockSeekers: Seeker[] = [
  {
    kind: 'seeker',
    id: 's1',
    firstName: 'Lena',
    lastName: 'Wagner',
    age: 24,
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    ],
    occupation: 'Architektur-Studentin (5. Sem.)',
    hobbies: ['Klettern', 'Aquarellmalerei', 'Vinylsammeln', 'Kochen'],
    languages: ['Deutsch', 'Englisch', 'Französisch'],
    smoker: false,
    dailyRhythm: 'early-bird',
    budgetMax: 650,
    movingDate: '2026-08-01',
    bio: 'Ich suche eine entspannte WG, in der man abends auch mal zusammen kocht. Bin tagsüber viel an der Uni, abends gerne zu Hause. Sauber, aber kein Reinlichkeitsfanatiker.',
  },
  {
    kind: 'seeker',
    id: 's2',
    firstName: 'Jonas',
    lastName: 'Becker',
    age: 27,
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    ],
    occupation: 'Software-Entwickler (Remote)',
    hobbies: ['Bouldern', 'Brettspiele', 'E-Gitarre', 'Homebrewing'],
    languages: ['Deutsch', 'Englisch'],
    smoker: false,
    dailyRhythm: 'night-owl',
    budgetMax: 900,
    movingDate: '2026-07-15',
    bio: 'Arbeite von zu Hause – brauche daher gutes Internet und ein ruhiges Zimmer. Abends gerne gesellig, Wochenenden oft draußen. Suche WG mit eigenem Rhythm.',
  },
  {
    kind: 'seeker',
    id: 's3',
    firstName: 'Mia',
    lastName: 'Hoffmann',
    age: 22,
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
    ],
    occupation: 'Medizin-Studentin (3. Sem.)',
    hobbies: ['Yoga', 'Laufen', 'Podcasts', 'Pflanzenpflege'],
    languages: ['Deutsch', 'Englisch', 'Spanisch'],
    smoker: false,
    dailyRhythm: 'early-bird',
    budgetMax: 550,
    movingDate: '2026-09-01',
    bio: 'Früh aufstehen, früh schlafen – Medizin-Studentin eben. Ich bin ruhig, ordentlich und sehr offen für WG-Abende wenn die Zeit es zulässt.',
  },
  {
    kind: 'seeker',
    id: 's4',
    firstName: 'Tom',
    lastName: 'Richter',
    age: 29,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    ],
    occupation: 'Grafikdesigner (Freelance)',
    hobbies: ['Fotografie', 'Skateboarden', 'Kino', 'Street Food'],
    languages: ['Deutsch', 'Englisch'],
    smoker: true,
    dailyRhythm: 'flexible',
    budgetMax: 750,
    movingDate: '2026-07-01',
    bio: 'Freelancer mit flexiblen Arbeitszeiten. Rauche nur draußen. Suche kreative Atmosphäre, coole Mitbewohner und gute Lage. Kein Fan von strikten Hausregeln.',
  },
]

export const mockFlatshares: Flatshare[] = [
  {
    kind: 'flatshare',
    id: 'f1',
    title: 'Helles 3er-WG Zimmer in Sachsenhausen',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    ],
    rentMonthly: 620,
    availableFrom: '2026-08-01',
    internetSpeed: '500 Mbit/s',
    address: 'Sachsenhausen, Frankfurt',
    roommates: 2,
    description:
      'Wir sind zwei Freundinnen (25, 26) aus dem Kulturbereich und suchen eine dritte Person, die gerne zusammen kocht, aber auch Eigenraum respektiert. WG-Abende ja, Zwang nein.',
    tags: ['Kochen zusammen', 'Haustierfreundlich', 'Balkon', 'Fahrradkeller', 'LGBTQ+ freundlich'],
  },
  {
    kind: 'flatshare',
    id: 'f2',
    title: 'Ruhiges Zimmer für Remote-Worker – Altbau Nordend',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80',
    ],
    rentMonthly: 850,
    availableFrom: '2026-07-15',
    internetSpeed: '1 Gbit/s',
    address: 'Nordend-West, Frankfurt',
    roommates: 2,
    description:
      'Zwei Devs suchen dritten Mitbewohner. Alle arbeiten remote – stilles Arbeitsklima tagsüber, gesellige Abende optional. Fiber-Leitung, stehende Schreibtische, 3 Bäder.',
    tags: ['Remote-freundlich', 'Glasfaser', 'Stehschreibtisch', 'Zweck-WG', 'Keine Partys'],
  },
  {
    kind: 'flatshare',
    id: 'f3',
    title: 'Kreative 4er-WG in Bornheim – sucht Energie!',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    ],
    rentMonthly: 490,
    availableFrom: '2026-09-01',
    internetSpeed: '250 Mbit/s',
    address: 'Bornheim, Frankfurt',
    roommates: 3,
    description:
      'Wir sind eine bunte WG aus Designerin, Musikerin und Sozialarbeiter. Das Zimmer ist kompakt aber die Gemeinschaft ist groß. Wir feiern gerne, kochen oft zusammen und haben immer ein offenes Ohr.',
    tags: ['Kreativ', 'Gemeinschaft', 'WG-Abende', 'Garten', 'Hund vorhanden'],
  },
  {
    kind: 'flatshare',
    id: 'f4',
    title: 'Modernes Zimmer in Eckenheim – ruhige Lage',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    ],
    rentMonthly: 580,
    availableFrom: '2026-08-15',
    internetSpeed: '300 Mbit/s',
    address: 'Eckenheim, Frankfurt',
    roommates: 1,
    description:
      'Ich (28, Ingenieur) suche eine zweite Person für meine 2er-WG. Ruhige Gegend, frisch saniertes Bad, große Gemeinschaftsküche. Bin viel unterwegs, daher sehr entspannte Atmosphäre.',
    tags: ['Ruhig', '2er-WG', 'Neubau', 'Tiefgarage', 'Zweck-WG ok'],
  },
]

export const mockMatches: Match[] = [
  {
    id: 'm1',
    seeker: mockSeekers[0],
    flatshare: mockFlatshares[0],
    matchedAt: '2026-06-15T14:32:00Z',
    messages: [
      {
        id: 'msg1',
        senderId: 'f1',
        text: 'Hey Lena! Super dass es ein Match gibt 🎉 Hast du Lust auf einen kurzen Videocall diese Woche?',
        sentAt: '2026-06-15T15:00:00Z',
      },
      {
        id: 'msg2',
        senderId: 's1',
        text: 'Ja sehr gerne! Wie wäre es Mittwoch Abend so um 19 Uhr?',
        sentAt: '2026-06-15T15:12:00Z',
      },
    ],
  },
  {
    id: 'm2',
    seeker: mockSeekers[1],
    flatshare: mockFlatshares[1],
    matchedAt: '2026-06-14T09:10:00Z',
    messages: [],
  },
]
