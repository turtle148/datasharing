import { stays } from './seed'
import type { ServiceRequest } from './types'

const [, porto, oliva] = stays

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
      date: inDays(11),
      people: 3,
      needs: ['milk_bread', 'fruit', 'coffee'],
      notes: 'Something for a 9-year-old who only eats plain things. No nuts.',
    },
    estimate: 30,
    status: 'scheduled',
    createdAt: daysAgo(6),
  },
  {
    id: 'req-seed-2',
    stayToken: oliva.token,
    serviceId: 'transfer-in',
    fields: {
      pickup: 'vrn',
      date: inDays(11),
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
    serviceId: 'transfer-out',
    fields: {
      dropoff: 'vrn',
      date: inDays(6),
      time: '18:20',
      flight: 'KL 1594',
      car_seats: 0,
      notes: 'We would rather leave early and wait at the airport.',
    },
    estimate: 120,
    status: 'confirmed',
    createdAt: daysAgo(3),
  },
  {
    id: 'req-seed-4',
    stayToken: porto.token,
    serviceId: 'chef-dinner',
    fields: {
      date: inDays(5),
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
      date: inDays(14),
      window: 'morning',
      notes: 'The children nap in the small bedroom until 10.',
    },
    estimate: 70,
    status: 'requested',
    createdAt: daysAgo(2),
  },
]

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** Seed requests sit a week or two out, so the demo never opens on a past date. */
function inDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
