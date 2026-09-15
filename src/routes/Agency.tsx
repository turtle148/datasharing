import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BrandBar from '../components/BrandBar'
import ProviderSlot from '../components/ProviderSlot'
import ResetDemo from '../components/ResetDemo'
import { formatDay, money } from '../lib/format'
import { guestUrl } from '../lib/links'
import { commission } from '../lib/pricing'
import { advanceLabel, requestedSlot, statusLabel } from '../lib/status'
import { advanceRequest, data, useRequests } from '../lib/store'
import type { Property, ServiceRequest } from '../lib/types'

type Tab = 'requests' | 'properties' | 'providers'

const tabs: { id: Tab; label: string }[] = [
  { id: 'requests', label: 'Requests' },
  { id: 'properties', label: 'Properties' },
  { id: 'providers', label: 'Providers' },
]

/** Property · Service · Provider · Requested for · Value · Share · Status · action */
const columns =
  'grid-cols-[140px_minmax(240px,1fr)_80px_112px_62px_74px_140px_116px] gap-3'

export default function Agency() {
  const [tab, setTab] = useState<Tab>('requests')
  const requests = useRequests()

  return (
    <div className="min-h-dvh bg-stone">
      <BrandBar width="max-w-[1200px]" />
      <TopBar />

      <main className="mx-auto max-w-[1200px] px-6 py-6">
        <Stats requests={requests} />

        <nav className="mt-7 flex gap-6 border-b border-deep/14">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`-mb-px cursor-pointer border-b-2 pb-2.5 text-[15px] ${
                tab === id ? 'border-deep font-semibold' : 'border-transparent text-deep/55'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="pt-4">
          {tab === 'requests' && <RequestTable requests={requests} />}
          {tab === 'properties' && <Properties />}
          {tab === 'providers' && <Providers />}
        </div>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-deep/12 pt-4 text-[14px] text-deep/55">
          <p>
            Commission split: provider {pct(data.agency.split.provider)} · agency{' '}
            {pct(data.agency.split.agency)} · platform {pct(data.agency.split.platform)}. Your share
            is paid monthly against the requests above.
          </p>
          <ResetDemo />
        </footer>
      </main>
    </div>
  )
}

function pct(fraction: number) {
  return `${Math.round(fraction * 100)}%`
}

function TopBar() {
  return (
    <header className="border-b border-deep/10 bg-paper">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-[17px] font-semibold">{data.agency.name}</p>
          <p className="text-[14px] text-deep/55">
            Guest services · {data.properties.length} properties
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/" className="text-[15px] underline underline-offset-2">
            Guest view
          </Link>
          <GuestLinkButton property={data.properties[0]} />
        </div>
      </div>
    </header>
  )
}

function GuestLinkButton({ property, outlined }: { property: Property; outlined?: boolean }) {
  const [copied, setCopied] = useState(false)
  const stay = data.stays.find((s) => s.propertyId === property.id)
  if (!stay) return null

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(guestUrl(stay.token)).catch(() => undefined)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }}
      className={`cursor-pointer rounded-control text-[15px] font-semibold ${
        outlined
          ? 'border border-water/40 px-3 py-2 text-water'
          : 'bg-mint px-4 py-2.5 text-deep'
      }`}
    >
      {copied ? 'Link copied' : 'Get guest link'}
    </button>
  )
}

function Stats({ requests }: { requests: ServiceRequest[] }) {
  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = requests.filter((r) => {
      const created = new Date(r.createdAt)
      return (
        r.status !== 'cancelled' &&
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      )
    })
    const gross = thisMonth.reduce((sum, r) => sum + r.estimate, 0)
    const share = thisMonth.reduce(
      (sum, r) => sum + commission(r.estimate, data.agency.split).agency,
      0,
    )
    const fee = thisMonth.reduce(
      (sum, r) => sum + commission(r.estimate, data.agency.split).platform,
      0,
    )
    const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(now)
    return { count: thisMonth.length, gross, share, fee, month }
  }, [requests])

  return (
    <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
      <div className="flex flex-col justify-between gap-6 rounded-card bg-deep p-6">
        <p className="text-[13px] font-semibold tracking-[0.12em] text-paper/60 uppercase">
          Your share · {stats.month}
        </p>
        <p className="font-display tnum text-[72px] leading-none tracking-[-0.02em] text-mint">
          {money(stats.share)}
        </p>
        <p className="text-[15px] leading-[1.45] text-paper/68">
          {pct(data.agency.split.agency)} of everything below, paid monthly. Nothing to invoice.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-rows-3">
        <Stat label="Requests this month" value={String(stats.count)} />
        <Stat label="Gross value" value={money(stats.gross)} />
        <Stat label="Our fee" value={money(stats.fee)} />
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-card bg-paper px-5 py-4">
      <p className="text-[13px] font-semibold tracking-[0.12em] text-deep/60 uppercase">{label}</p>
      <p className="font-display tnum text-[32px] leading-none tracking-[-0.01em]">
        {value}
      </p>
    </div>
  )
}

function RequestTable({ requests }: { requests: ServiceRequest[] }) {
  const [expanded, setExpanded] = useState<string[]>([])
  const rows = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (!rows.length) return <p className="text-[15px] text-deep/55">No requests yet.</p>

  return (
    <div className="overflow-x-auto rounded-card border border-deep/10 bg-paper">
      <div role="table" className="min-w-[1048px]">
        <div
          role="row"
          className={`grid ${columns} border-b border-deep/10 px-5 py-3 text-[13px] font-semibold tracking-[0.08em] text-deep/55 uppercase`}
        >
          <span role="columnheader">Property</span>
          <span role="columnheader">Service</span>
          <span role="columnheader">Provider</span>
          <span role="columnheader">Requested for</span>
          <span role="columnheader" className="text-right">
            Value
          </span>
          <span role="columnheader" className="text-right">
            Your share
          </span>
          <span role="columnheader">Status</span>
          <span role="columnheader" />
        </div>

        {rows.map((request) => {
          const service = data.services.find((s) => s.id === request.serviceId)!
          const provider = data.providers.find((p) => p.id === service.providerId)!
          const stay = data.stays.find((s) => s.token === request.stayToken)!
          const property = data.properties.find((p) => p.id === stay.propertyId)!
          const advance = advanceLabel(request, provider)
          const open = expanded.includes(request.id)
          const split = commission(request.estimate, data.agency.split)
          const closed = request.status === 'scheduled' || request.status === 'cancelled'

          return (
            <div key={request.id}>
              <div
                role="row"
                tabIndex={0}
                onClick={() =>
                  setExpanded((prev) =>
                    open ? prev.filter((id) => id !== request.id) : [...prev, request.id],
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setExpanded((prev) =>
                      open ? prev.filter((id) => id !== request.id) : [...prev, request.id],
                    )
                  }
                }}
                className={`grid ${columns} cursor-pointer items-center border-b border-deep/8 px-5 py-4 text-[15px] hover:bg-rowfill`}
              >
                <span role="cell">{property.name}</span>
                <span role="cell">{service.title}</span>
                <span role="cell" className="text-deep/70">
                  {provider.firstName}
                </span>
                <span role="cell" className="tnum text-deep/70">
                  {requestedSlot(request, service) || '—'}
                </span>
                <span role="cell" className="tnum text-right">
                  {money(request.estimate)}
                </span>
                <span role="cell" className="tnum text-right font-semibold">
                  {request.status === 'cancelled' ? '—' : money(split.agency)}
                </span>
                <span role="cell" className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{
                      background: closed ? 'rgba(15,28,34,0.25)' : 'var(--color-mint)',
                    }}
                  />
                  <span className={request.status === 'cancelled' ? 'text-clay' : ''}>
                    {statusLabel(request, service, provider)}
                  </span>
                </span>
                <span role="cell">
                  {advance && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        advanceRequest(request.id, requestedSlot(request, service))
                      }}
                      className="w-full cursor-pointer rounded-control border border-water/40 px-3 py-2 text-[15px] leading-[1.2] font-semibold text-water"
                    >
                      {advance}
                    </button>
                  )}
                </span>
              </div>

              {open && (
                <div className="border-b border-deep/10 bg-rowfill px-5 py-4.5">
                  <dl className="grid grid-cols-3 gap-6">
                    {service.fieldSchema.map((field) => {
                      const text = renderValue(field.id, request.fields[field.id], service.id)
                      if (!text) return null
                      return (
                        <div key={field.id}>
                          <dt className="text-[13px] font-semibold tracking-[0.08em] text-deep/55 uppercase">
                            {field.label}
                          </dt>
                          <dd className="mt-1 text-[15px]">{text}</dd>
                        </div>
                      )
                    })}
                  </dl>
                  <p className="mt-4 text-[14px] text-deep/55">
                    Requested {formatDay(request.createdAt.slice(0, 10))} · {provider.firstName}{' '}
                    takes {money(split.provider)} · platform fee {money(split.platform)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderValue(fieldId: string, value: unknown, serviceId: string): string {
  const service = data.services.find((s) => s.id === serviceId)!
  const field = service.fieldSchema.find((f) => f.id === fieldId)
  if (value === undefined || value === '' || (Array.isArray(value) && !value.length)) return ''

  if (Array.isArray(value)) {
    return value
      .map((v) => field?.options?.find((o) => o.value === v)?.label ?? String(v))
      .join(', ')
  }
  if (field?.type === 'select') {
    return field.options?.find((o) => o.value === value)?.label ?? String(value)
  }
  if (field?.type === 'date') return formatDay(String(value))
  return String(value)
}

function Properties() {
  return (
    <div className="flex flex-col gap-3">
      {data.properties.map((property) => {
        const stay = data.stays.find((s) => s.propertyId === property.id)
        return (
          <div
            key={property.id}
            className="grid items-center gap-6 rounded-card border border-deep/10 bg-paper p-5 md:grid-cols-[280px_1fr_160px_150px]"
          >
            <div>
              <p className="text-[17px] font-semibold">{property.name}</p>
              <p className="text-[14px] text-deep/55">{property.town}</p>
            </div>

            <div>
              <p className="text-[13px] font-semibold tracking-[0.12em] text-deep/60 uppercase">
                Guest link
              </p>
              <p className="mt-1 text-[15px]">{stay ? 'Live for this stay' : 'Not set up'}</p>
            </div>

            <div>
              <p className="text-[13px] font-semibold tracking-[0.12em] text-deep/60 uppercase">
                Services on
              </p>
              <p className="tnum mt-1 text-[15px]">
                {property.servicesOn} of {data.services.length}
              </p>
            </div>

            <div className="justify-self-start md:justify-self-end">
              <GuestLinkButton property={property} outlined />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Providers() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {data.providers.map((provider) => {
        const count = data.services.filter((s) => s.providerId === provider.id).length
        return (
          <div
            key={provider.id}
            className="flex gap-3.5 rounded-card border border-deep/10 bg-paper p-4"
          >
            <ProviderSlot provider={provider} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[17px] font-semibold">{provider.firstName}</p>
                <span
                  className="rounded-full px-2 py-0.5 text-[13px]"
                  style={{
                    background: 'color-mix(in srgb, var(--color-mint) 22%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-mint) 55%, transparent)',
                  }}
                >
                  Verified
                </span>
              </div>
              <p className="mt-1 text-[15px] text-deep/70">{provider.role}</p>
              <div className="mt-2 border-t border-deep/8" />
              <p className="mt-2 text-[14px] text-deep/50">
                Checked: {provider.verified.join(' · ')} · {count}{' '}
                {count === 1 ? 'service' : 'services'}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
