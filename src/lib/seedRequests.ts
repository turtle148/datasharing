import { stays } from './seed'
import type { ServiceRequest } from './types'

const [, oliva, porto] = stays

/**
 * A little history, so the agency console has something in it the moment you
 * turn the laptop round. Reset demo puts these back.
 */
export const seedRequests: ServiceRequest[] = [
  {
    id: 'req-seed-1',
    stayToken: oliva.token,
    serviceId: 'groceries',
    fields: {
      date: oliva.arrival,
      needs: ['gluten_free', 'bread_daily'],
      notes: 'Coffee, milk, pasta, fruit, and something for a 9-year-old who only eats plain things.',
    },
    estimate: 54,
    status: 'scheduled',
    createdAt: daysAgo(6),
  },
  {
    id: 'req-seed-2',
    stayToken: oliva.token,
    serviceId: 'transfer-in',
    fields: {
      pickup: 'vrn',
      date: oliva.arrival,
      time: '14:35',
      flight: 'AF 1214',
      car_seats: 1,
      notes: 'Three cases and a booster.',
    },
    estimate: 120,
    status: 'confirmed',
    createdAt: daysAgo(5),
  },
  {
    id: 'req-seed-3',
    stayToken: porto.token,
    serviceId: 'boat',
    fields: {
      date: addDays(porto.arrival, 2),
      length: 'half_pm',
      people: 4,
      notes: 'We would like to swim somewhere quiet rather than see towns.',
    },
    estimate: 280,
    status: 'confirmed',
    createdAt: daysAgo(3),
  },
  {
    id: 'req-seed-4',
    stayToken: porto.token,
    serviceId: 'chef-dinner',
    fields: {
      date: addDays(porto.arrival, 1),
      time: '20:00',
      adults: 4,
      children: 0,
      menu: 'lake',
      notes: 'No shellfish.',
    },
    estimate: 260,
    status: 'requested',
    createdAt: daysAgo(1),
  },
  {
    id: 'req-seed-5',
    stayToken: oliva.token,
    serviceId: 'mid-clean',
    fields: {
      date: addDays(oliva.arrival, 3),
      window: 'morning',
      notes: 'The children nap in the small bedroom until 10.',
    },
    estimate: 70,
    status: 'requested',
    createdAt: daysAgo(1),
  },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function addDays(iso: string, n: number): string {
  const [y, m, day] = iso.split('-').map(Number)
  const d = new Date(y, m - 1, day + n, 12)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
