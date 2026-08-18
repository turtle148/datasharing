import type { Phase, Stay } from './types'

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
const dayMonthLong = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' })

/** "Mon 4 Aug" */
export function formatDay(iso: string): string {
  const d = parseDate(iso)
  return `${weekday.format(d)} ${dayMonth.format(d)}`
}

/** "4 – 11 August" */
export function formatStayRange(arrival: string, departure: string): string {
  const a = parseDate(arrival)
  const b = parseDate(departure)
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()} – ${dayMonthLong.format(b)}`
  }
  return `${dayMonthLong.format(a)} – ${dayMonthLong.format(b)}`
}

/** "Tue 5 – Sat 10 Aug" */
export function formatDayRange(from: string, to: string): string {
  if (from === to) return formatDay(from)
  return `${formatDay(from)} – ${formatDay(to)}`
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

/** "2 adults, 2 children" */
export function partyLine(stay: Stay): string {
  const bits = [`${stay.adults} ${stay.adults === 1 ? 'adult' : 'adults'}`]
  if (stay.children.length) {
    bits.push(`${stay.children.length} ${stay.children.length === 1 ? 'child' : 'children'}`)
  }
  return bits.join(', ')
}

/** "aged 4 and 7" */
export function childAges(stay: Stay): string {
  const ages = stay.children.map((c) => String(c.age))
  if (!ages.length) return ''
  if (ages.length === 1) return `aged ${ages[0]}`
  return `aged ${ages.slice(0, -1).join(', ')} and ${ages[ages.length - 1]}`
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

/** The real dates each band of the timeline covers. */
export function phaseCaption(phase: Phase, stay: Stay): string {
  switch (phase) {
    case 'before_arrival':
      return `In place by ${formatDay(stay.arrival)}`
    case 'first_evening':
      return formatDay(stay.arrival)
    case 'during_stay': {
      const from = addDays(stay.arrival, 1)
      const to = addDays(stay.departure, -1)
      return parseDate(from) > parseDate(to) ? formatDay(from) : formatDayRange(from, to)
    }
    case 'before_departure':
      return formatDay(stay.departure)
  }
}

/** The dates a date field may be set to, given the stay. */
export function dateBounds(range: 'stay' | 'arrival_day' | 'departure_day' | undefined, stay: Stay) {
  switch (range) {
    case 'arrival_day':
      return { min: stay.arrival, max: stay.arrival }
    case 'departure_day':
      return { min: stay.departure, max: stay.departure }
    default:
      return { min: stay.arrival, max: stay.departure }
  }
}
