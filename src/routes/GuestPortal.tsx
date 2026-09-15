import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BrandBar from '../components/BrandBar'
import RequestSheet from '../components/RequestSheet'
import RequestsTray from '../components/RequestsTray'
import ServiceCard from '../components/ServiceCard'
import { phaseOrder, phaseTitles } from '../lib/format'
import { data, useStayRequests } from '../lib/store'
import type { Property, Service } from '../lib/types'

export default function GuestPortal({ token }: { token?: string }) {
  const { stayToken = token ?? '' } = useParams()
  const stay = data.stays.find((s) => s.token === stayToken)
  const requests = useStayRequests(stayToken)
  const [openService, setOpenService] = useState<Service | null>(null)
  const property = data.properties.find((p) => p.id === stay?.propertyId)

  useEffect(() => {
    document.title = property ? `${property.name} · Otiara` : 'Otiara'
  }, [property])

  if (!stay || !property) return <ExpiredLink />

  const latestFor = (serviceId: string) =>
    [...requests].reverse().find((r) => r.serviceId === serviceId && r.status !== 'cancelled')

  return (
    <div className="min-h-dvh bg-stone pb-40">
      <BrandBar />
      <PropertyBar property={property} />

      <main className="mx-auto max-w-[480px] px-4">
        <header className="pt-6">
          <h1 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em]">
            Welcome, <em>{stay.guestName}</em>
          </h1>
          <div className="mt-4 border-t border-deep/10" />
          <p className="mt-4 text-[17px] leading-[1.5]">
            Make your stay as easy and stress-free as possible.
          </p>
          <p className="mt-2 text-[17px] leading-[1.5] text-deep/78">
            Anything below can be arranged for you, by the same people who look after the house.
            Prices are final — no booking fees.
          </p>
        </header>

        <div className="pt-7">
          {phaseOrder.map((phase) => {
            const services = data.services.filter((s) => s.phase === phase)
            if (!services.length) return null

            return (
              <section key={phase} className="relative pb-[30px] last:pb-0">
                {/* The timeline spine: the stay runs top to bottom, and so do the services. */}
                <span
                  aria-hidden="true"
                  className="absolute top-4 bottom-0 left-1 w-px bg-deep/14"
                />
                <span aria-hidden="true" className="absolute top-2 left-0 h-[9px] w-[9px] bg-deep" />

                <div className="pl-[30px]">
                  <h2 className="text-[12.5px] font-semibold tracking-[0.14em] uppercase">
                    {phaseTitles[phase]}
                  </h2>

                  <div className="mt-3 flex flex-col gap-3">
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        request={latestFor(service.id)}
                        onOpen={() => setOpenService(service)}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <footer className="mt-7 border-t border-deep/10 pt-4 pb-6">
          <p className="text-[14px] leading-[1.5] text-deep/50">
            Arranged by {data.agency.name}, {data.agency.town}. Everything here is booked and paid
            through your host — no booking fees, no tipping expected.
          </p>
          <DemoNav />
        </footer>
      </main>

      <RequestsTray requests={requests} />

      {openService && (
        <RequestSheet
          service={openService}
          stay={stay}
          onClose={() => setOpenService(null)}
          onSubmitted={() => setOpenService(null)}
        />
      )}
    </div>
  )
}

function PropertyBar({ property }: { property: Property }) {
  return (
    <div className="border-b border-deep/10 bg-paper">
      <div className="mx-auto max-w-[480px] px-4 pt-3.5 pb-3">
        <p className="text-[12.5px] tracking-[0.14em] text-water uppercase">
          {property.name} · {property.town}
        </p>
      </div>
    </div>
  )
}

/** Not part of the product — the way into the other side of the demo. */
export function DemoNav({ className = '' }: { className?: string }) {
  return (
    <p className={`mt-4 text-[13px] text-deep/35 ${className}`}>
      Demo ·{' '}
      <Link to="/agency" className="underline underline-offset-2">
        agency console
      </Link>
    </p>
  )
}

function ExpiredLink() {
  return (
    <div className="min-h-dvh bg-stone">
      <BrandBar />
      <div className="border-b border-deep/10 bg-paper">
        <div className="mx-auto max-w-[480px] px-4 pt-3.5 pb-3">
          <p className="text-[12.5px] tracking-[0.14em] text-water uppercase">
            {data.properties[0].name} · {data.properties[0].town}
          </p>
        </div>
      </div>

      <main className="mx-auto flex max-w-[480px] flex-col gap-4 px-4 pt-8">
        <h1 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em]">
          This link has ended
        </h1>
        <p className="text-[17px] leading-[1.5] text-deep/70">
          It covered a stay that is over, so nothing can be requested through it now.
        </p>

        <div className="rounded-card border border-deep/10 bg-paper p-4">
          <p className="text-[13px] font-semibold tracking-[0.08em] text-deep/60 uppercase">
            Still the people to ask
          </p>
          <p className="mt-2 text-[17px] leading-[1.4]">{data.agency.name}</p>
          <p className="text-[14px] text-deep/55">{data.agency.town}</p>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 block rounded-control border border-water/40 px-4 py-3.5 text-center text-[17px] font-semibold text-water"
          >
            Message {data.agency.shortName}
          </a>
        </div>

        <DemoNav />
      </main>
    </div>
  )
}
