import type { Seeker, WGProfile } from '../types'

export const DEMO_SEEKER: Seeker = {
  kind: 'seeker',
  id: 'me',
  firstName: 'Anna',
  lastName: 'Müller',
  age: 26,
  gender: 'weiblich',
  photos: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
  ],
  occupation: 'UX Designerin',
  hobbies: ['Kochen', 'Yoga', 'Lesen'],
  languages: ['Deutsch', 'Englisch'],
  smoker: false,
  dailyRhythm: 'early-bird',
  budgetMax: 900,
  movingDate: '2026-08-01',
  bio: 'Hey! Ich bin Anna, 26 Jahre alt und arbeite als UX Designerin in Mainz. Ich suche eine ruhige, gemütliche WG mit netten Leuten. Koche gerne und freue mich über gemeinsame Abendessen.',
  prompts: [
    { question: 'Mein perfektes Wochenende …', answer: 'Gemeinsames Frühstück, danach jeder macht sein Ding.' },
    { question: 'In der WG bin ich für … zuständig', answer: 'Küche putzen und den besten Kaffee kochen.' },
  ],
}

export const DEMO_WG_PROFILE: WGProfile = {
  name: 'Das Mainzer Kollektiv',
  address: 'Weißliliengasse 12, Altstadt, Mainz',
  description: 'Wir sind eine kreative WG in der Mainzer Altstadt – offen, entspannt und immer für ein spontanes Feierabend-Bier zu haben. Die Wohnung hat viel Licht, einen großen Balkon und liegt direkt in der Innenstadt.',
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  ],
  roommateProfiles: [
    {
      name: 'Leon',
      age: 28,
      occupation: 'Grafikdesigner',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      bio: 'Kreativer Typ, koche gerne und bin meistens abends zu Hause. Stehe auf gute Musik und gemeinsame Abende.',
    },
  ],
  pendingInvites: [],
  amenities: ['balkon', 'waschmaschine', 'spuelmaschine', 'fahrradkeller'],
  tags: ['Kreativ', 'LGBTQ+ freundlich', 'Zentral', 'WG-Abende'],
  internetSpeed: '500 Mbit/s',
  wgRhythm: 'early-bird',
  smokingAllowed: false,
  roommateLanguages: ['Deutsch', 'Englisch'],
}

export const DEMO_INVITE_EMAIL = 'jan.mueller@uni-mainz.de'
