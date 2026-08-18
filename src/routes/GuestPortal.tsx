import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RequestSheet from '../components/RequestSheet'
import RequestsTray from '../components/RequestsTray'
import ServiceCard from '../components/ServiceCard'
import {
  childAges,
  formatStayRange,
  partyLine,
  phaseCaption,
  phaseOrder,
  phaseTitles,
} from '../lib/format'
import { data, useStayRequests } from '../lib/store'
import type { Service } from '../lib/types'

export default function GuestPortal() {
  const { stayToken = '' } = useParams()
  const stay = data.stays.find((s) => s.token === stayToken)
  const requests = useStayRequests(stayToken)
  const [openService, setOpenService] = useState<Service | null>(null)

  const property = data.properties.find((p) => p.id === stay?.propertyId)

  useEffect(() => {
    document.title = property ? `${property.name} · guest services` : 'Guest services'
  }, [property])

  if (!stay || !property) return <ExpiredLink />

  const provider = (id: string) => data.providers.find((p) => p.id === id)!
  const latestFor = (serviceId: string) =>
    [...requests].reverse().find((r) => r.serviceId === serviceId && r.status !== 'cancelled')

  return (
    <div className="min-h-dvh bg-stone pb-28">
      <main className="mx-auto max-w-[480px] px-4">
        <header className="pt-10 pb-8">
          <p className="text-[13px] tracking-[0.14em] text-deep/55 uppercase">
            {property.name} · {property.town}
          </p>
          <h1 className="font-display mt-3 text-[34px] leading-[1.15] text-deep">
            Welcome, {stay.guestName}
          </h1>
          <p className="tnum mt-2 text-deep/75">
            {formatStayRange(stay.arrival, stay.departure)} · {partyLine(stay)}
            {stay.children.length ? ` ${childAges(stay)}` : ''}
          </p>
          <p className="mt-5 text-deep/70">
            Anything below can be arranged for you. Prices are final — no booking fees.
          </p>
        </header>

        {phaseOrder.map((phase) => {
          const services = data.services.filter((s) => s.phase === phase)
          if (!services.length) return null

          return (
            <section key={phase} className="pb-8">
              <div className="border-t-2 border-water pt-3 pb-4">
                <h2 className="text-[15px] font-medium tracking-[0.08em] text-deep uppercase">
                  {phaseTitles[phase]}
                </h2>
                <p className="tnum mt-1 text-[15px] text-deep/55">{phaseCaption(phase, stay)}</p>
              </div>

              <div className="flex flex-col gap-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    provider={provider(service.providerId)}
                    request={latestFor(service.id)}
                    onOpen={() => setOpenService(service)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <footer className="pb-6 text-[14px] text-deep/45">
          <p>
            Arranged by {data.agency.name}, {data.agency.town}. Everything here is booked and paid
            through your host — no booking fees, no tipping expected.
          </p>
        </footer>
      </main>

      <RequestsTray requests={requests} stay={stay} />

      {openService && (
        <RequestSheet
          service={openService}
          provider={provider(openService.providerId)}
          stay={stay}
          onClose={() => setOpenService(null)}
          onSubmitted={() => setOpenService(null)}
        />
      )}
    </div>
  )
}

function ExpiredLink() {
  return (
    <div className="flex min-h-dvh items-center bg-stone">
      <main className="mx-auto max-w-[480px] px-6 text-center">
        <h1 className="font-display text-2xl leading-snug text-deep">
          This link has expired — ask your host for a new one
        </h1>
        <p className="mt-3 text-deep/65">
          Guest links are tied to a single stay, so they stop working once the stay is over.
        </p>
        <Link to="/" className="mt-6 inline-block text-water underline underline-offset-4">
          Back to the start
        </Link>
      </main>
    </div>
  )
}
