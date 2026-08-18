import Avatar from './Avatar'
import StatusDots from './StatusDots'
import { headlinePrice } from '../lib/pricing'
import { money } from '../lib/format'
import { statusLabel } from '../lib/status'
import { cancelRequest } from '../lib/store'
import type { Provider, Service, ServiceRequest } from '../lib/types'

export default function ServiceCard({
  service,
  provider,
  request,
  onOpen,
}: {
  service: Service
  provider: Provider
  request?: ServiceRequest
  onOpen: () => void
}) {
  const live = request && request.status !== 'cancelled'

  return (
    <div
      className={`hairline rounded-card bg-paper transition-colors ${
        live ? 'animate-settle border-water/30' : ''
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full cursor-pointer px-4 py-4 text-left"
        aria-label={`${service.title} — ${provider.firstName}`}
      >
        <p className="font-medium text-deep">{service.title}</p>

        <div className="mt-3 flex items-center gap-3">
          <Avatar provider={provider} />
          <p className="text-[15px] leading-snug text-deep/70">
            <span className="font-medium text-deep/85">{provider.firstName}</span> · {provider.role},{' '}
            {provider.town}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="tnum font-medium text-deep">{headlinePrice(service)}</span>
          {service.priceNote && (
            <span className="text-[15px] text-deep/60">{service.priceNote}</span>
          )}
        </div>

        <p className="mt-3 inline-block rounded-full bg-stone px-2.5 py-1 text-[13px] text-deep/70">
          {service.leadTime}
        </p>
      </button>

      {live && request && (
        <div className="border-t border-deep/10 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <StatusDots status={request.status} />
              <span className="text-[15px] text-deep/80">
                {statusLabel(request, service, provider)}
              </span>
            </div>
            <span className="tnum text-[15px] text-deep/60">{money(request.estimate)}</span>
          </div>

          {request.status === 'requested' && (
            <button
              type="button"
              onClick={() => cancelRequest(request.id)}
              className="mt-2 cursor-pointer text-[15px] text-clay underline underline-offset-4"
            >
              Cancel request
            </button>
          )}
        </div>
      )}
    </div>
  )
}
