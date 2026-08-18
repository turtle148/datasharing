import type { Agency, Property, Provider, SeedData, Service, Stay } from './types'

/**
 * The seed stays are written as real August dates so the copy reads right
 * ("4 – 11 August"). The year rolls forward once the season has passed, so the
 * demo never opens on a stay that already happened.
 */
export function seasonYear(today = new Date()): number {
  const y = today.getFullYear()
  const seasonOver = today.getMonth() > 7 || (today.getMonth() === 7 && today.getDate() > 15)
  return seasonOver ? y + 1 : y
}

const Y = seasonYear()
const d = (month: number, day: number) =>
  `${Y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

export const agency: Agency = {
  id: 'lago-verde',
  name: 'Lago Verde Property Management',
  town: 'Salò',
  split: { provider: 0.8, agency: 0.1, platform: 0.1 },
}

export const properties: Property[] = [
  {
    id: 'villa-serena',
    name: 'Villa Serena',
    town: 'Manerba del Garda',
    address: 'Via delle Limonaie 12, 25080 Manerba del Garda BS',
    agencyId: 'lago-verde',
    heroColor: '#1E5F56',
  },
  {
    id: 'casa-oliva',
    name: 'Casa Oliva',
    town: 'Padenghe sul Garda',
    address: 'Via Belvedere 7, 25080 Padenghe sul Garda BS',
    agencyId: 'lago-verde',
    heroColor: '#0E2E2A',
  },
  {
    id: 'ca-del-porto',
    name: "Ca' del Porto",
    town: 'Moniga del Garda',
    address: 'Via Porto 3, 25080 Moniga del Garda BS',
    agencyId: 'lago-verde',
    heroColor: '#2A5F6E',
  },
]

export const stays: Stay[] = [
  {
    token: 'villa-serena-0811',
    propertyId: 'villa-serena',
    guestName: 'the Brandt family',
    arrival: d(8, 4),
    departure: d(8, 11),
    adults: 2,
    children: [{ age: 4 }, { age: 7 }],
    language: 'de',
  },
  {
    token: 'casa-oliva-0815',
    propertyId: 'casa-oliva',
    guestName: 'the Laurent family',
    arrival: d(8, 8),
    departure: d(8, 15),
    adults: 2,
    children: [{ age: 9 }],
    language: 'fr',
  },
  {
    token: 'ca-del-porto-0209',
    propertyId: 'ca-del-porto',
    guestName: 'the Van Dijk family',
    arrival: d(8, 2),
    departure: d(8, 9),
    adults: 4,
    children: [],
    language: 'nl',
  },
]

const portrait = (sex: 'women' | 'men', n: number) =>
  `https://randomuser.me/api/portraits/${sex}/${n}.jpg`

export const providers: Provider[] = [
  {
    id: 'elena',
    firstName: 'Elena',
    role: 'shops at the Manerba market',
    town: 'Manerba del Garda',
    photo: portrait('women', 65),
    blurb:
      "I'll get whatever you need from the Coop and the market and have it in the house before you walk in. Tell me about allergies and I'll work around them.",
    verified: ['ID', 'insurance', 'references'],
  },
  {
    id: 'marco',
    firstName: 'Marco',
    role: 'cooks in your kitchen',
    town: 'Salò',
    photo: portrait('men', 32),
    blurb:
      "I cook in your kitchen and clean it before I go — lake fish, a pasta the children will actually eat, and something for the adults. You stay at the table.",
    verified: ['ID', 'insurance', 'HACCP certificate', 'references'],
  },
  {
    id: 'giulia',
    firstName: 'Giulia',
    role: 'babysits, trained nursery teacher',
    town: 'Moniga del Garda',
    photo: portrait('women', 44),
    blurb:
      "I've worked in a nursery in Desenzano for nine years. I bring books and games, and I'm happy to do the bedtime routine so you can go out to dinner.",
    verified: ['ID', 'insurance', 'DBS-equivalent check', 'references'],
  },
  {
    id: 'tommaso',
    firstName: 'Tommaso',
    role: 'drives, licensed NCC',
    town: 'Desenzano del Garda',
    photo: portrait('men', 51),
    blurb:
      "I watch the flight and wait if you're late — there's no extra charge for that. Car seats are fitted before I leave the garage, not in the airport car park.",
    verified: ['ID', 'NCC licence', 'insurance', 'references'],
  },
  {
    id: 'anna',
    firstName: 'Anna',
    role: 'housekeeping and laundry',
    town: 'Manerba del Garda',
    photo: portrait('women', 26),
    blurb:
      "I do a full change of beds and towels and take the week's washing with me. Two hours, usually while you're at the beach.",
    verified: ['ID', 'insurance', 'references'],
  },
  {
    id: 'luca',
    firstName: 'Luca',
    role: 'skippers his own boat',
    town: 'Moniga del Garda',
    photo: portrait('men', 12),
    blurb:
      "We leave from Moniga, swim off San Biagio where the water is shallow enough for small children, and I have life jackets in every size on board.",
    verified: ['ID', 'skipper licence', 'boat insurance', 'references'],
  },
  {
    id: 'sofia',
    firstName: 'Sofia',
    role: 'babysits, English and German',
    town: 'Padenghe sul Garda',
    photo: portrait('women', 90),
    blurb:
      "I studied in Munich, so the children can talk to me in German or English. I'm used to evenings — I'll stay until you're back.",
    verified: ['ID', 'insurance', 'references'],
  },
  {
    id: 'chiara',
    firstName: 'Chiara',
    role: 'welcome host for Lago Verde',
    town: 'Manerba del Garda',
    photo: portrait('women', 33),
    blurb:
      "I look after the house between guests. I can set up the cot and high chair before you arrive, and hold your bags on the last day so you're not sitting on a suitcase.",
    verified: ['ID', 'insurance', 'references'],
  },
  {
    id: 'davide',
    firstName: 'Davide',
    role: 'makes wine in the Valtènesi',
    town: 'Moniga del Garda',
    photo: portrait('men', 78),
    blurb:
      "I bring four wines from our own vines — the Chiaretto is made here in Moniga, ten minutes from your door — with cheese and salumi to go with them.",
    verified: ['ID', 'insurance', 'references'],
  },
  {
    id: 'francesca',
    firstName: 'Francesca',
    role: 'massage therapist',
    town: 'Salò',
    photo: portrait('women', 5),
    blurb:
      "I bring the table, the oils and quiet music. On the terrace at the end of the afternoon is what most people choose.",
    verified: ['ID', 'professional registration', 'insurance', 'references'],
  },
]

const notes = (label: string, placeholder: string) => ({
  id: 'notes',
  type: 'textarea' as const,
  label,
  placeholder,
})

export const services: Service[] = [
  // ── Before you arrive ────────────────────────────────────────────────────
  {
    id: 'groceries',
    providerId: 'elena',
    title: 'Fridge stocked before you arrive',
    phase: 'before_arrival',
    priceModel: 'fixed',
    priceValue: 45,
    priceNote: '+ the cost of the shopping',
    leadTime: 'Order by 6pm the day before',
    description:
      "I'll get whatever you need from the Coop and the market and have it in the house before you walk in. Tell me about allergies and I'll work around them.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'In the house by', range: 'stay', prefill: 'arrival', required: true },
      {
        id: 'needs',
        type: 'checkboxes',
        label: 'Anything specific?',
        options: [
          { value: 'baby_food', label: 'Baby food' },
          { value: 'gluten_free', label: 'Gluten-free' },
          { value: 'nappies', label: 'Nappies, size 4' },
          { value: 'lactose_free', label: 'Lactose-free' },
          { value: 'bread_daily', label: 'Fresh bread every morning', priceDelta: 9 },
        ],
      },
      notes('Your list', 'Milk, coffee, pasta, a bottle of Chiaretto, fruit for the children…'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'transfer-in',
    providerId: 'tommaso',
    title: 'Met at the airport and driven to the house',
    phase: 'before_arrival',
    priceModel: 'fixed',
    priceValue: 120,
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I watch the flight and wait if you're late — there's no extra charge for that. Car seats are fitted before I leave the garage, not in the airport car park.",
    fieldSchema: [
      {
        id: 'pickup',
        type: 'select',
        label: 'Pick-up from',
        required: true,
        options: [
          { value: 'vrn', label: 'Verona Villafranca (VRN)' },
          { value: 'bgy', label: 'Bergamo Orio al Serio (BGY)', priceDelta: 30 },
          { value: 'mxp', label: 'Milan Malpensa (MXP)', priceDelta: 95 },
          { value: 'bs', label: 'Brescia station', priceDelta: -35 },
        ],
      },
      { id: 'date', type: 'date', label: 'Arrival date', range: 'stay', prefill: 'arrival', required: true },
      { id: 'time', type: 'time', label: 'Landing time', required: true },
      { id: 'flight', type: 'text', label: 'Flight number', placeholder: 'e.g. LH 292' },
      {
        id: 'car_seats',
        type: 'stepper',
        label: 'Car seats needed',
        min: 0,
        max: 4,
        prefill: 'children',
        pricePerUnit: 0,
        help: 'Fitted before he leaves, at no extra cost',
      },
      notes('Anything else?', 'Two large cases and a buggy.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'baby-kit',
    providerId: 'chiara',
    title: 'Cot, high chair and stair gate set up before you arrive',
    phase: 'before_arrival',
    priceModel: 'fixed',
    priceValue: 40,
    priceNote: 'for the whole stay',
    leadTime: 'Order by 6pm the day before',
    description:
      "I'll have everything up and wiped down before you get here, and I'll take it away on the last morning so it isn't in your way.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Ready by', range: 'stay', prefill: 'arrival', required: true },
      {
        id: 'items',
        type: 'checkboxes',
        label: 'What do you need?',
        options: [
          { value: 'cot', label: 'Travel cot with fresh bedding' },
          { value: 'high_chair', label: 'High chair' },
          { value: 'stair_gate', label: 'Stair gate' },
          { value: 'bath', label: 'Baby bath' },
          { value: 'buggy', label: 'Buggy', priceDelta: 15 },
        ],
      },
      notes('Anything else?', 'The stair gate is for the steps down to the garden.'),
    ],
    scheduleFields: { date: 'date' },
  },

  // ── Your first evening ───────────────────────────────────────────────────
  {
    id: 'chef-dinner',
    providerId: 'marco',
    title: 'Dinner cooked at the villa on your first night',
    phase: 'first_evening',
    priceModel: 'per_person',
    priceValue: 65,
    unit: 'adult',
    leadTime: 'Book at least 48 hours ahead',
    description:
      "I cook in your kitchen and clean it before I go — lake fish, a pasta the children will actually eat, and something for the adults. You stay at the table.",
    multiplierFields: ['adults'],
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', prefill: 'arrival', required: true },
      { id: 'time', type: 'time', label: 'Sit down at', required: true },
      { id: 'adults', type: 'stepper', label: 'Adults', min: 1, max: 16, prefill: 'adults' },
      {
        id: 'children',
        type: 'stepper',
        label: 'Children',
        min: 0,
        max: 10,
        prefill: 'children',
        pricePerUnit: 32,
        help: 'Children eat at €32 each',
      },
      {
        id: 'menu',
        type: 'select',
        label: 'Menu',
        required: true,
        options: [
          { value: 'lake', label: 'Lake and garden — four courses' },
          { value: 'tasting', label: 'Tasting menu — six courses', priceDelta: 18 },
          { value: 'simple', label: 'Simple family dinner — three courses', priceDelta: -12 },
        ],
        scalesWithMultiplier: true,
        help: 'Per adult, on top of the base price',
      },
      notes('Allergies and dislikes', 'One of us is coeliac. The 4-year-old will only eat plain pasta.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'welcome-table',
    providerId: 'elena',
    title: 'Aperitivo waiting on the table when you walk in',
    phase: 'first_evening',
    priceModel: 'fixed',
    priceValue: 38,
    leadTime: 'Order by 6pm the day before',
    description:
      "A bottle of Chiaretto, salumi from the butcher in Manerba, bread, olives and something sweet for the children — enough that nobody has to cook on the first night.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'For the evening of', range: 'stay', prefill: 'arrival', required: true },
      {
        id: 'extras',
        type: 'checkboxes',
        label: 'Add anything?',
        options: [
          { value: 'second_bottle', label: 'A second bottle', priceDelta: 14 },
          { value: 'no_alcohol', label: 'No alcohol, please' },
          { value: 'cake', label: "Cake — it's someone's birthday", priceDelta: 22 },
        ],
      },
      notes('Anything else?', 'Nothing with nuts.'),
    ],
    scheduleFields: { date: 'date' },
  },

  // ── During the week ──────────────────────────────────────────────────────
  {
    id: 'babysitting',
    providerId: 'giulia',
    title: 'Babysitting so you can go out to dinner',
    phase: 'during_stay',
    priceModel: 'hourly',
    priceValue: 18,
    unit: 'hour',
    priceNote: '3 hour minimum',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I've worked in a nursery in Desenzano for nine years. I bring books and games, and I'm happy to do the bedtime routine so you can go out to dinner.",
    multiplierFields: ['hours'],
    minMultiplier: 3,
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true },
      { id: 'time', type: 'time', label: 'Start at', required: true },
      { id: 'hours', type: 'stepper', label: 'For how long', min: 3, max: 8, suffix: 'hours' },
      { id: 'ages', type: 'text', label: "Children's ages", prefill: 'children_ages' },
      notes('Anything she should know?', 'Bedtime is 8. The little one needs the landing light left on.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'babysitting-en',
    providerId: 'sofia',
    title: 'Evening babysitting in English or German',
    phase: 'during_stay',
    priceModel: 'hourly',
    priceValue: 20,
    unit: 'hour',
    priceNote: '3 hour minimum',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I studied in Munich, so the children can talk to me in German or English. I'm used to evenings — I'll stay until you're back.",
    multiplierFields: ['hours'],
    minMultiplier: 3,
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true },
      { id: 'time', type: 'time', label: 'Start at', required: true },
      { id: 'hours', type: 'stepper', label: 'For how long', min: 3, max: 8, suffix: 'hours' },
      {
        id: 'language',
        type: 'select',
        label: 'Language with the children',
        options: [
          { value: 'en', label: 'English' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
        ],
      },
      { id: 'ages', type: 'text', label: "Children's ages", prefill: 'children_ages' },
      notes('Anything she should know?', 'They will be in bed by 8.30.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'mid-clean',
    providerId: 'anna',
    title: 'Mid-stay clean, fresh beds and towels',
    phase: 'during_stay',
    priceModel: 'fixed',
    priceValue: 70,
    leadTime: 'Book by the evening before',
    description:
      "I do a full change of beds and towels and take the week's washing with me. Two hours, usually while you're at the beach.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which day', range: 'stay', required: true },
      {
        id: 'window',
        type: 'select',
        label: 'Time window',
        options: [
          { value: 'morning', label: 'Morning, 9 – 12' },
          { value: 'afternoon', label: 'Afternoon, 2 – 5' },
        ],
      },
      notes('Anything to leave alone?', 'The children will be asleep in the small bedroom until 10.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'laundry',
    providerId: 'anna',
    title: 'Washing collected and back the next morning',
    phase: 'during_stay',
    priceModel: 'fixed',
    priceValue: 22,
    priceNote: 'per bag, washed and folded',
    leadTime: 'Collected the same evening if you ask before 4pm',
    description:
      "Leave the bag by the door. I wash, dry and fold, and it's back before you've finished breakfast the next day.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Collect on', range: 'stay', required: true },
      { id: 'bags', type: 'stepper', label: 'How many bags', min: 1, max: 6, pricePerUnit: 22, freeUnits: 1 },
      notes('Anything delicate?', 'One dress that should be hung up, not folded.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'boat',
    providerId: 'luca',
    title: 'An afternoon on the lake with a skipper',
    phase: 'during_stay',
    priceModel: 'from',
    priceValue: 280,
    priceNote: 'half day, up to 7 people',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "We leave from Moniga, swim off San Biagio where the water is shallow enough for small children, and I have life jackets in every size on board.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which day', range: 'stay', required: true },
      {
        id: 'length',
        type: 'select',
        label: 'How long',
        options: [
          { value: 'half_pm', label: 'Afternoon, 2 – 6' },
          { value: 'half_am', label: 'Morning, 9 – 1' },
          { value: 'full', label: 'Full day, 9 – 6', priceDelta: 190 },
        ],
      },
      { id: 'people', type: 'stepper', label: 'How many of you', min: 1, max: 9, pricePerUnit: 30, freeUnits: 7 },
      notes('Anything else?', 'Two of us would like to try the paddleboard.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'wine',
    providerId: 'davide',
    title: 'Valtènesi wines tasted at your table',
    phase: 'during_stay',
    priceModel: 'per_person',
    priceValue: 30,
    unit: 'person',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I bring four wines from our own vines — the Chiaretto is made here in Moniga, ten minutes from your door — with cheese and salumi to go with them.",
    multiplierFields: ['people'],
    minMultiplier: 4,
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true },
      { id: 'time', type: 'time', label: 'Start at', required: true },
      { id: 'people', type: 'stepper', label: 'How many tasting', min: 4, max: 12, prefill: 'adults' },
      notes('Anything else?', 'We would like to buy a case to take home.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'massage',
    providerId: 'francesca',
    title: 'A massage on the terrace',
    phase: 'during_stay',
    priceModel: 'fixed',
    priceValue: 80,
    priceNote: '60 minutes, at the house',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I bring the table, the oils and quiet music. On the terrace at the end of the afternoon is what most people choose.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which day', range: 'stay', required: true },
      { id: 'time', type: 'time', label: 'Start at', required: true },
      { id: 'people', type: 'stepper', label: 'How many massages', min: 1, max: 4, pricePerUnit: 80, freeUnits: 1 },
      notes('Anything she should know?', 'A bad shoulder on the right side.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },

  // ── Before you leave ─────────────────────────────────────────────────────
  {
    id: 'late-checkout',
    providerId: 'chiara',
    title: 'Late checkout and somewhere to leave the bags',
    phase: 'before_departure',
    priceModel: 'fixed',
    priceValue: 35,
    priceNote: 'subject to the house being free',
    leadTime: 'Ask by the day before',
    description:
      "If nobody is arriving that afternoon you can stay until 4. If someone is, I'll take the bags and you can use the pool until you leave.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Departure day', range: 'stay', prefill: 'departure', required: true },
      {
        id: 'until',
        type: 'select',
        label: 'Stay until',
        options: [
          { value: '14', label: '2pm' },
          { value: '16', label: '4pm', priceDelta: 15 },
        ],
      },
      notes('Anything else?', 'Our flight is at 8pm.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'transfer-out',
    providerId: 'tommaso',
    title: 'Driven back to the airport on the last day',
    phase: 'before_departure',
    priceModel: 'fixed',
    priceValue: 120,
    leadTime: 'Book at least 24 hours ahead',
    description:
      "I'll be outside 15 minutes early. Tell me the flight and I'll work out when we need to leave — you don't have to do that sum on holiday.",
    fieldSchema: [
      {
        id: 'dropoff',
        type: 'select',
        label: 'Drop-off at',
        required: true,
        options: [
          { value: 'vrn', label: 'Verona Villafranca (VRN)' },
          { value: 'bgy', label: 'Bergamo Orio al Serio (BGY)', priceDelta: 30 },
          { value: 'mxp', label: 'Milan Malpensa (MXP)', priceDelta: 95 },
          { value: 'bs', label: 'Brescia station', priceDelta: -35 },
        ],
      },
      { id: 'date', type: 'date', label: 'Departure date', range: 'stay', prefill: 'departure', required: true },
      { id: 'time', type: 'time', label: 'Flight departs at', required: true },
      { id: 'flight', type: 'text', label: 'Flight number', placeholder: 'e.g. LH 293' },
      { id: 'car_seats', type: 'stepper', label: 'Car seats needed', min: 0, max: 4, prefill: 'children' },
      notes('Anything else?', 'We would rather leave early and wait at the airport.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
]

export const seed: SeedData = { agency, properties, stays, providers, services }
