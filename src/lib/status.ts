import { formatDay, formatTime } from './format'
import type { Provider, Service, ServiceRequest } from './types'

/** The date and time the guest asked for, read back out of their answers. */
export function requestedSlot(request: ServiceRequest, service: Service): string {
  const dateField = service.scheduleFields?.date
  const timeField = service.scheduleFields?.time
  const date = dateField ? String(request.fields[dateField] ?? '') : ''
  const time = timeField ? String(request.fields[timeField] ?? '') : ''
  if (!date) return ''
  return time ? `${formatDay(date)}, ${formatTime(time)}` : formatDay(date)
}

export function statusLabel(
  request: ServiceRequest,
  service: Service,
  provider: Provider,
): string {
  switch (request.status) {
    case 'requested':
      return 'Requested'
    case 'confirmed':
      return `Confirmed by ${provider.firstName}`
    case 'scheduled': {
      const slot = request.scheduledFor || requestedSlot(request, service)
      return slot ? `Scheduled for ${slot}` : 'Scheduled'
    }
    case 'cancelled':
      return 'Cancelled'
  }
}

/** What the button in the agency console does next. */
export function advanceLabel(request: ServiceRequest, provider: Provider): string | null {
  switch (request.status) {
    case 'requested':
      return `Confirm with ${provider.firstName}`
    case 'confirmed':
      return 'Mark scheduled'
    default:
      return null
  }
}
