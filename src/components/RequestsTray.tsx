import { useState } from 'react'
import Sheet from './Sheet'
import { money } from '../lib/format'
import { guestStatusLabel } from '../lib/status'
import { cancelRequest, data } from '../lib/store'
import type { ServiceRequest } from '../lib/types'

export default function RequestsTray({ requests }: { requests: ServiceRequest[] }) {
  const [open, setOpen] = useState(false)
  const live = requests.filter((r) => r.status !== 'cancelled')
  const total = live.reduce((sum, r) => sum + r.estimate, 0)

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-[480px] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {live.length === 0 ? (
            <p className="pointer-events-auto rounded-card border border-dashed border-deep/22 bg-paper/90 px-4 py-3.5 text-[17px] leading-[1.45] text-deep/68 backdrop-blur">
              Nothing requested yet. Start with the fridge — it's the one most families are glad
              they did.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="pointer-events-auto flex w-full cursor-pointer items-center justify-between gap-4 rounded-card border border-deep/14 bg-paper px-4 py-3.5 text-left"
            >
              <span>
                <span className="block text-[17px] font-semibold">
                  {live.length} {live.length === 1 ? 'request' : 'requests'}
                </span>
                <span className="tnum block text-[14px] text-deep/55">
                  {money(total)} · none charged yet
                </span>
              </span>
              <span className="text-[15px] font-semibold text-water">Show</span>
            </button>
          )}
        </div>
      </div>

      {open && (
        <Sheet label="Your requests" onClose={() => setOpen(false)}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[20px] font-semibold">Your requests</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer text-[15px] text-water"
            >
              Hide
            </button>
          </div>

          <ul className="mt-2">
            {live.map((request, i) => {
              const service = data.services.find((s) => s.id === request.serviceId)!
              const cancellable = request.status === 'requested' || request.status === 'confirmed'

              return (
                <li
                  key={request.id}
                  className={`flex items-start justify-between gap-4 py-3 ${
                    i ? 'border-t border-deep/8' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[17px] leading-[1.35]">{service.title}</p>
                    <p className="mt-0.5 text-[14px] text-deep/55">
                      {guestStatusLabel(request, service)}
                      {cancellable && (
                        <>
                          {' · '}
                          <button
                            type="button"
                            onClick={() => cancelRequest(request.id)}
                            className="cursor-pointer text-clay underline underline-offset-2"
                          >
                            Cancel request
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="tnum shrink-0 text-[17px] font-semibold">
                    {money(request.estimate)}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-deep/14 pt-3">
            <span className="text-[15px] text-deep/62">Total, paid through your host</span>
            <span className="tnum text-[17px] font-semibold">{money(total)}</span>
          </div>
        </Sheet>
      )}
    </>
  )
}
