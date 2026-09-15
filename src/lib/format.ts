import type { Phase } from './types'

/** Parse a YYYY-MM-DD seed date at local noon, so no timezone can shift the day. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12)
}

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function addDays(iso: string, days: number): string {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

const weekday = new Intl.DateTimeFormat('en-GB', { weekday: 'short' })
const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })

/** "Mon 4 Aug" */
export function formatDay(iso: string): string {
  const d = parseDate(iso)
  return `${weekday.format(d)} ${dayMonth.format(d)}`
}



/** "3pm", "3.30pm" */
export function formatTime(value: string): string {
  if (!value) return ''
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h)) return value
  const suffix = h < 12 ? 'am' : 'pm'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m ? `${hour}.${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`
}

const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function money(amount: number): string {
  return euro.format(amount)
}



export const phaseOrder: Phase[] = [
  'before_arrival',
  'first_evening',
  'during_stay',
  'before_departure',
]

export const phaseTitles: Record<Phase, string> = {
  before_arrival: 'Before you arrive',
  first_evening: 'Your first evening',
  during_stay: 'During the week',
  before_departure: 'Before you leave',
}


/** Dates can be picked from today onwards — the stay itself is not in our system. */
export function dateBounds() {
  return { min: toIso(new Date()) }
}
