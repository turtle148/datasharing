import type { Agency, Property, Provider, SeedData, Service, Stay } from './types'

export const agency: Agency = {
  id: 'lago-verde',
  name: 'Lago Verde Property Management',
  shortName: 'Lago Verde',
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
    heroColor: '#1A5049',
    servicesOn: 10,
  },
  {
    id: 'ca-del-porto',
    name: "Ca' del Porto",
    town: 'Moniga del Garda',
    address: 'Via Porto 3, 25080 Moniga del Garda BS',
    agencyId: 'lago-verde',
    heroColor: '#0E2622',
    servicesOn: 8,
  },
  {
    id: 'casa-oliva',
    name: 'Casa Oliva',
    town: 'Padenghe sul Garda',
    address: 'Via Belvedere 7, 25080 Padenghe sul Garda BS',
    agencyId: 'lago-verde',
    heroColor: '#2A5F6E',
    servicesOn: 10,
  },
]

export const stays: Stay[] = [
  { token: 'villa-serena-0811', propertyId: 'villa-serena' },
  { token: 'ca-del-porto-0108', propertyId: 'ca-del-porto' },
  { token: 'casa-oliva-0815', propertyId: 'casa-oliva' },
]

const portrait = (sex: 'women' | 'men', n: number) =>
  `https://randomuser.me/api/portraits/${sex}/${n}.jpg`

export const providers: Provider[] = [
  {
    id: 'elena',
    firstName: 'Elena',
    role: 'shops at the Manerba market, Manerba del Garda',
    town: 'Manerba del Garda',
    photo: portrait('women', 65),
    blurb:
      "I'll get whatever you need from the Coop and the market and have it in the house before you walk in. Tell me about allergies and I'll work around them.",
    verified: ['ID', 'insurance', 'references'],
    confirmedNote: 'She will send a time once she has been to the market',
  },
  {
    id: 'marco',
    firstName: 'Marco',
    role: 'cooks in your kitchen, Salò',
    town: 'Salò',
    photo: portrait('men', 32),
    blurb:
      'I cook in your kitchen and clean it before I go — lake fish, a pasta the children will actually eat, and something for the adults. You stay at the table.',
    verified: ['ID', 'insurance', 'HACCP certificate', 'references'],
    confirmedNote: 'Marco will confirm the menu and what time to start',
  },
  {
    id: 'giulia',
    firstName: 'Giulia',
    role: 'babysits, trained nursery teacher, Moniga del Garda',
    town: 'Moniga del Garda',
    photo: portrait('women', 44),
    blurb:
      "I've worked in a nursery in Desenzano for nine years. I bring books and games, and I'm happy to do the bedtime routine so you can go out to dinner.",
    verified: ['ID', 'insurance', 'DBS-equivalent check', 'references'],
    confirmedNote: 'Giulia will confirm the evening and when to arrive',
  },
  {
    id: 'tommaso',
    firstName: 'Tommaso',
    role: 'drives, licensed NCC, Desenzano del Garda',
    town: 'Desenzano del Garda',
    photo: portrait('men', 51),
    blurb:
      "I watch the flight and wait if you're late — there's no extra charge for that. Car seats are fitted before I leave the garage, not in the airport car park.",
    verified: ['ID', 'NCC licence', 'insurance', 'references'],
    confirmedNote: 'Tommaso will send a pick-up time once the flight is checked',
  },
  {
    id: 'anna',
    firstName: 'Anna',
    role: 'housekeeping and laundry, Manerba del Garda',
    town: 'Manerba del Garda',
    photo: portrait('women', 26),
    blurb:
      "I do a full change of beds and towels and take the week's washing with me. Two hours, usually while you're at the beach.",
    verified: ['ID', 'insurance', 'references'],
    confirmedNote: 'Anna will confirm which morning suits the house',
  },
  {
    id: 'sofia',
    firstName: 'Sofia',
    role: 'babysits, English and German, Padenghe sul Garda',
    town: 'Padenghe sul Garda',
    photo: portrait('women', 90),
    blurb:
      "I studied in Munich, so the children can talk to me in German or English. I'm used to evenings — I'll stay until you're back.",
    verified: ['ID', 'insurance', 'references'],
    confirmedNote: 'Sofia will confirm the evening and when to arrive',
  },
  {
    id: 'chiara',
    firstName: 'Chiara',
    role: 'welcome host for Lago Verde, Manerba del Garda',
    town: 'Manerba del Garda',
    photo: portrait('women', 33),
    blurb:
      "I look after the house between guests. I'll meet you, show you how everything works, and have the cot and high chair up before you arrive.",
    verified: ['ID', 'insurance', 'references'],
    confirmedNote: 'Chiara will confirm what time she can meet you',
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
    icon: 'basket',
    summary: 'Your first shop done before you walk in the door.',
    phase: 'before_arrival',
    priceModel: 'fixed',
    priceValue: 30,
    priceNote: '+ the cost of the shopping',
    leadTime: 'Order by 6pm the day before',
    description:
      "Tell us what you need and it will be in the house before you arrive — the Coop for the basics, the market in Manerba for the rest. Allergies and preferences are worked around.",
    variableExtra: { label: 'of shopping', perUnitField: 'people', perUnit: 20 },
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which day', range: 'stay', required: true },
      { id: 'people', type: 'stepper', label: 'How many people eating', min: 1, max: 12, defaultValue: 4 },
      {
        id: 'needs',
        type: 'checkboxes',
        label: 'What to get in',
        options: [
          { value: 'milk_bread', label: 'Milk and bread' },
          { value: 'fruit', label: 'Fruit' },
          { value: 'coffee', label: 'Coffee' },
          { value: 'pasta', label: 'Pasta and sauce' },
          { value: 'wine', label: 'Beer and wine' },
          { value: 'nappies', label: 'Nappies' },
        ],
      },
      notes('Anything else, or anything to avoid', 'No nuts in the house please. Oat milk if you can find it.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'transfer-in',
    providerId: 'tommaso',
    title: 'Met at the airport and driven to the house',
    icon: 'car',
    summary: 'A licensed driver waiting when you land, car seats fitted.',
    phase: 'before_arrival',
    priceModel: 'fixed',
    priceValue: 120,
    leadTime: 'Book at least 24 hours ahead',
    description:
      "Your flight is watched, so a delay costs you nothing. Car seats are fitted before the car leaves the garage, not in the airport car park.",
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
      { id: 'date', type: 'date', label: 'Arrival date', range: 'stay', required: true, half: true },
      { id: 'time', type: 'time', label: 'Landing time', required: true, half: true },
      { id: 'flight', type: 'text', label: 'Flight number', placeholder: 'LH 292' },
      {
        id: 'car_seats',
        type: 'stepper',
        label: 'Car seats needed',
        min: 0,
        max: 4,
        help: 'Fitted in advance, at no extra cost',
      },
      notes('Anything else?', 'Two large cases and a buggy.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },

  // ── Your first evening ───────────────────────────────────────────────────
  {
    id: 'chef-dinner',
    providerId: 'marco',
    title: 'Dinner cooked at the villa on your first night',
    icon: 'pot',
    summary: 'A cook in your kitchen, and the kitchen left clean.',
    phase: 'first_evening',
    priceModel: 'per_person',
    priceValue: 65,
    unit: 'adult',
    leadTime: 'Book at least 48 hours ahead',
    description:
      "Dinner is cooked in your own kitchen and the kitchen is cleaned before anyone leaves — lake fish, a pasta the children will actually eat, and something for the adults. You stay at the table.",
    multiplierFields: ['adults'],
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true, half: true },
      { id: 'time', type: 'time', label: 'Sit down at', required: true, half: true },
      { id: 'adults', type: 'stepper', label: 'Adults', min: 1, max: 16, defaultValue: 2 },
      {
        id: 'children',
        type: 'stepper',
        label: 'Children',
        min: 0,
        max: 10,
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
    icon: 'glass',
    summary: 'Wine, salumi and bread, so nobody has to cook on the first night.',
    phase: 'first_evening',
    priceModel: 'fixed',
    priceValue: 38,
    leadTime: 'Order by 6pm the day before',
    description:
      "A bottle of Chiaretto, salumi from the butcher in Manerba, bread, olives and something sweet for the children — enough that nobody has to cook on the first night.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'For the evening of', range: 'stay', required: true },
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
    icon: 'bear',
    summary: 'A trained nursery teacher, bedtime routine included.',
    phase: 'during_stay',
    priceModel: 'hourly',
    priceValue: 18,
    unit: 'hour',
    priceNote: '3 hour minimum',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "A trained nursery teacher comes to the house with books and games, and can do the whole bedtime routine so you can go out to dinner.",
    multiplierFields: ['hours'],
    minMultiplier: 3,
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true, half: true },
      { id: 'time', type: 'time', label: 'Start at', required: true, half: true },
      { id: 'hours', type: 'stepper', label: 'For how long', min: 3, max: 8, suffix: 'hours' },
      { id: 'ages', type: 'text', label: "Children's ages" },
      notes('Anything we should know?', 'Bedtime is 8. The little one needs the landing light left on.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'babysitting-en',
    providerId: 'sofia',
    title: 'Evening babysitting in English or German',
    icon: 'bear',
    summary: "A sitter who speaks your children's language.",
    phase: 'during_stay',
    priceModel: 'hourly',
    priceValue: 20,
    unit: 'hour',
    priceNote: '3 hour minimum',
    leadTime: 'Book at least 24 hours ahead',
    description:
      "An English- and German-speaking sitter for the evening, used to staying until you are back.",
    multiplierFields: ['hours'],
    minMultiplier: 3,
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Which evening', range: 'stay', required: true, half: true },
      { id: 'time', type: 'time', label: 'Start at', required: true, half: true },
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
      { id: 'ages', type: 'text', label: "Children's ages" },
      notes('Anything we should know?', 'They will be in bed by 8.30.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
  {
    id: 'mid-clean',
    providerId: 'anna',
    title: 'Mid-stay clean, fresh beds and towels',
    icon: 'bed',
    summary: 'Two hours while you are at the beach.',
    phase: 'during_stay',
    priceModel: 'fixed',
    priceValue: 70,
    leadTime: 'Book by the evening before',
    description:
      "A full change of beds and towels, the house put back in order, and the week's washing taken away. Usually two hours, while you are out.",
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
      notes('Anything to leave alone?', 'The children nap in the small bedroom until 10.'),
    ],
    scheduleFields: { date: 'date' },
  },
  {
    id: 'laundry',
    providerId: 'anna',
    title: 'Washing collected and back the next morning',
    icon: 'washer',
    summary: 'Leave the bag by the door.',
    phase: 'during_stay',
    priceModel: 'fixed',
    priceValue: 22,
    priceNote: 'per bag, washed and folded',
    leadTime: 'Collected the same evening if you ask before 4pm',
    description:
      "Leave the bag by the door. Everything is washed, dried and folded, and back before you have finished breakfast the next day.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Collect on', range: 'stay', required: true },
      { id: 'bags', type: 'stepper', label: 'How many bags', min: 1, max: 6, pricePerUnit: 22, freeUnits: 1 },
      notes('Anything delicate?', 'One dress that should be hung up, not folded.'),
    ],
    scheduleFields: { date: 'date' },
  },

  // ── Before you leave ─────────────────────────────────────────────────────
  {
    id: 'late-checkout',
    providerId: 'chiara',
    title: 'Late checkout and somewhere to leave the bags',
    icon: 'clock',
    summary: 'Stay until the afternoon, or leave the bags and use the pool.',
    phase: 'before_departure',
    priceModel: 'fixed',
    priceValue: 35,
    priceNote: 'subject to the house being free',
    leadTime: 'Ask by the day before',
    description:
      "If nobody is arriving that afternoon, you can stay until 4. If someone is, your bags are looked after and the pool stays yours until you leave.",
    fieldSchema: [
      { id: 'date', type: 'date', label: 'Departure day', range: 'stay', required: true },
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
    icon: 'plane',
    summary: 'Outside fifteen minutes early, timed to your flight.',
    phase: 'before_departure',
    priceModel: 'fixed',
    priceValue: 120,
    leadTime: 'Book at least 24 hours ahead',
    description:
      "The car is outside fifteen minutes early. Tell us the flight and the departure time is worked out for you — you don't have to do that sum on holiday.",
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
      { id: 'date', type: 'date', label: 'Departure date', range: 'stay', required: true, half: true },
      { id: 'time', type: 'time', label: 'Flight departs at', required: true, half: true },
      { id: 'flight', type: 'text', label: 'Flight number', placeholder: 'LH 293' },
      { id: 'car_seats', type: 'stepper', label: 'Car seats needed', min: 0, max: 4 },
      notes('Anything else?', 'We would rather leave early and wait at the airport.'),
    ],
    scheduleFields: { date: 'date', time: 'time' },
  },
]

export const seed: SeedData = { agency, properties, stays, providers, services }
