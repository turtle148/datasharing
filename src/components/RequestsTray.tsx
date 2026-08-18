import { useState } from 'react'
import StatusDots from './StatusDots'
import { formatStayRange, money } from '../lib/format'
import { requestedSlot, statusLabel } from '../lib/status'
import { cancelRequest, data } from '../lib/store'
import type { ServiceRequest, Stay } from '../lib/types'

export default function RequestsTray({
  requests,
  stay,
}: {
  requests: ServiceRequest[]
  stay: Stay
}) {
  const [open, setOpen] = useState(false)
  const live = requests.filter((r) => r.status !== 'cancelled')
  const total = live.reduce((sum, r) => sum + r.estimate, 0)

  if (!live.length) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-deep/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto max-w-[480px] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <p className="text-[15px] text-deep/60">
            Nothing requested yet. Start with the fridge — it's the one most families are glad they
            did.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-deep/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto max-w-[480px] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {open && (
          <ul className="max-h-[50vh] divide-y divide-deep/10 overflow-y-auto pt-3">
            {live.map((request) => {
              const service = data.services.find((s) => s.id === request.serviceId)!
              const provider = data.providers.find((p) => p.id === service.providerId)!
              return (
                <li key={request.id} className="py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[15px] font-medium text-deep">{service.title}</p>
                    <span className="tnum text-[15px] text-deep/70">{money(request.estimate)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <StatusDots status={request.status} />
                    <span className="text-[15px] text-deep/70">
                      {statusLabel(request, service, provider)}
                    </span>
                  </div>
                  {request.status === 'requested' && (
                    <button
                      type="button"
                      onClick={() => cancelRequest(request.id)}
                      className="mt-1.5 cursor-pointer text-[15px] text-clay underline underline-offset-4"
                    >
                      Cancel request
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {open && (
          <a
            href={whatsappLink(live, stay)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-[15px] text-water underline underline-offset-4"
          >
            Send these to your host on WhatsApp
          </a>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between py-3"
        >
          <span className="font-medium text-deep">Your requests ({live.length})</span>
          <span className="tnum text-[15px] text-deep/60">
            {money(total)} {open ? '▾' : '▴'}
          </span>
        </button>
      </div>
    </div>
  )
}

/** Stretch item from the spec: hand the whole list over in one message. */
function whatsappLink(requests: ServiceRequest[], stay: Stay): string {
  const property = data.properties.find((p) => p.id === stay.propertyId)!
  const lines = requests.map((request) => {
    const service = data.services.find((s) => s.id === request.serviceId)!
    const provider = data.providers.find((p) => p.id === service.providerId)!
    const slot = requestedSlot(request, service)
    return `• ${service.title} — ${provider.firstName}${slot ? `, ${slot}` : ''} (${money(
      request.estimate,
    )})`
  })

  const text = [
    `${property.name} — ${stay.guestName}`,
    `${formatStayRange(stay.arrival, stay.departure)}`,
    '',
    ...lines,
  ].join('\n')

  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
