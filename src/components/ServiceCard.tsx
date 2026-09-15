import ProviderSlot from './ProviderSlot'
import StatusDots from './StatusDots'
import { headlinePrice } from '../lib/pricing'
import { requestedSlot, statusLabel, statusNote } from '../lib/status'
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
  const live = request && request.status !== 'cancelled' ? request : undefined
  const cancellable = live?.status === 'requested' || live?.status === 'confirmed'
  const note = live ? statusNote(live, provider) : ''

  return (
    <article
      className={`overflow-hidden rounded-card bg-paper ${
        live ? 'animate-settle border border-mint' : 'border border-deep/10'
      }`}
    >
      {live && (
        <div
          className="border-b px-4 py-3"
          style={{
            background: 'color-mix(in srgb, var(--color-mint) 16%, transparent)',
            borderColor: 'color-mix(in srgb, var(--color-mint) 45%, transparent)',
          }}
        >
          <div className="flex items-center">
            <StatusDots status={live.status} />
            <span className="ml-1 text-[15px] font-semibold">
              {statusLabel(live, service, provider)}
            </span>
          </div>
          {note && <p className="mt-1.5 text-[14px] text-deep/60">{note}</p>}
        </div>
      )}

      <div className="p-4">
        <button type="button" onClick={onOpen} className="block w-full cursor-pointer text-left">
          <h3 className="text-[17px] leading-[1.35] font-medium tracking-[-0.01em]">
            {service.title}
          </h3>

          <div className="mt-3 flex items-start gap-2.5">
            <ProviderSlot provider={provider} size={36} />
            <div className="min-w-0">
              <p className="text-[15px] leading-[1.3] font-semibold">{provider.firstName}</p>
              <p className="text-[14px] leading-[1.3] text-deep/55">{provider.role}</p>
            </div>
          </div>
        </button>

        <div className="mt-3.5 border-t border-deep/8" />

        <div className="mt-3.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="tnum text-[17px] font-semibold">{headlinePrice(service)}</span>
            {live ? (
              <span className="tnum text-[14px] text-deep/55">
                {requestedSlot(live, service)}
              </span>
            ) : (
              service.priceNote && (
                <span className="text-[14px] text-deep/55">{service.priceNote}</span>
              )
            )}
          </p>

          {cancellable && live && (
            <button
              type="button"
              onClick={() => cancelRequest(live.id)}
              className="cursor-pointer text-[15px] text-clay"
            >
              Cancel request
            </button>
          )}
        </div>

        {!live && (
          <p className="mt-3 inline-block rounded-full bg-pill px-2.5 py-[5px] text-[13px] text-deep/62">
            {service.leadTime}
          </p>
        )}
      </div>
    </article>
  )
}
