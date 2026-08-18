import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import QrCode, { downloadQr } from '../components/QrCode'
import ResetDemo from '../components/ResetDemo'
import { formatDay, money } from '../lib/format'
import { PRODUCT_NAME, guestUrl } from '../lib/links'
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

export default function Agency() {
  const [tab, setTab] = useState<Tab>('requests')
  const requests = useRequests()

  return (
    <div className="min-h-dvh bg-stone">
      <header className="border-b border-deep/10 bg-paper">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-medium text-deep">{data.agency.name}</p>
            <p className="text-[14px] text-deep/55">
              {PRODUCT_NAME} guest services · {data.properties.length} properties
            </p>
          </div>
          <Link to="/" className="text-[14px] text-water underline underline-offset-4">
            Pitch screen
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Stats requests={requests} />

        <nav className="mt-10 flex gap-1 border-b border-deep/10">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[15px] ${
                tab === id
                  ? 'border-water font-medium text-deep'
                  : 'border-transparent text-deep/55'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="py-6">
          {tab === 'requests' && <RequestTable requests={requests} />}
          {tab === 'properties' && <Properties />}
          {tab === 'providers' && <Providers />}
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-deep/10 py-6 text-[14px] text-deep/50">
          <p>
            Commission split: provider {pct(data.agency.split.provider)} · agency{' '}
            {pct(data.agency.split.agency)} · platform {pct(data.agency.split.platform)}. Your share
            is paid monthly against the requests below.
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
    return { count: thisMonth.length, gross, ...commission(gross, data.agency.split) }
  }, [requests])

  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-deep/10 bg-deep/10 md:grid-cols-4">
      <Stat label="Requests this month" value={String(stats.count)} />
      <Stat label="Gross value" value={money(stats.gross)} />
      <Stat label="Your share" value={money(stats.agency)} accent />
      <Stat label="Our fee" value={money(stats.platform)} />
    </section>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-paper px-5 py-5">
      <p className="text-[13px] tracking-[0.08em] text-deep/55 uppercase">{label}</p>
      <p
        className={`font-display tnum mt-2 ${
          accent ? 'text-[44px] text-citron' : 'text-[32px] text-deep'
        } leading-none`}
      >
        {value}
      </p>
    </div>
  )
}

function RequestTable({ requests }: { requests: ServiceRequest[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const rows = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (!rows.length) {
    return <p className="text-deep/55">No requests yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-card border border-deep/10 bg-paper">
      <table className="w-full min-w-[900px] border-collapse text-[15px]">
        <thead>
          <tr className="border-b border-deep/10 text-left text-[13px] tracking-[0.06em] text-deep/55 uppercase">
            <th className="px-4 py-3 font-medium">Guest</th>
            <th className="px-4 py-3 font-medium">Property</th>
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Provider</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Requested for</th>
            <th className="px-4 py-3 text-right font-medium">Value</th>
            <th className="px-4 py-3 text-right font-medium">Your share</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>

        {rows.map((request) => {
          const service = data.services.find((s) => s.id === request.serviceId)!
          const provider = data.providers.find((p) => p.id === service.providerId)!
          const stay = data.stays.find((s) => s.token === request.stayToken)!
          const property = data.properties.find((p) => p.id === stay.propertyId)!
          const advance = advanceLabel(request, provider)
          const open = expanded === request.id
          const share = commission(request.estimate, data.agency.split).agency

          return (
            <tbody key={request.id} className="border-b border-deep/10 last:border-0">
              <tr
                onClick={() => setExpanded(open ? null : request.id)}
                className="cursor-pointer align-top hover:bg-stone/60"
              >
                <td className="px-4 py-3 whitespace-nowrap">{stay.guestName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-deep/75">{property.name}</td>
                <td className="px-4 py-3">{service.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-deep/75">{provider.firstName}</td>
                <td className="tnum px-4 py-3 whitespace-nowrap text-deep/75">
                  {requestedSlot(request, service) || '—'}
                </td>
                <td className="tnum px-4 py-3 text-right whitespace-nowrap">{money(request.estimate)}</td>
                <td className="tnum px-4 py-3 text-right whitespace-nowrap text-deep/75">
                  {request.status === 'cancelled' ? '—' : money(share)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={request.status === 'cancelled' ? 'text-clay' : 'text-deep/75'}
                  >
                    {statusLabel(request, service, provider)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {advance && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        advanceRequest(request.id, requestedSlot(request, service))
                      }}
                      className="cursor-pointer rounded-lg bg-water px-3 py-1.5 text-[14px] text-paper"
                    >
                      {advance}
                    </button>
                  )}
                </td>
              </tr>

              {open && (
                <tr className="bg-stone/60">
                  <td colSpan={9} className="px-4 py-4">
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-3">
                      {service.fieldSchema.map((field) => {
                        const value = request.fields[field.id]
                        const text = renderValue(field.id, value, service.id)
                        if (!text) return null
                        return (
                          <div key={field.id}>
                            <dt className="text-[13px] text-deep/55">{field.label}</dt>
                            <dd className="text-deep">{text}</dd>
                          </div>
                        )
                      })}
                    </dl>
                    <p className="mt-4 text-[14px] text-deep/55">
                      Requested {formatDay(request.createdAt.slice(0, 10))} · {provider.firstName}{' '}
                      takes {money(commission(request.estimate, data.agency.split).provider)} ·
                      platform fee{' '}
                      {money(commission(request.estimate, data.agency.split).platform)}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          )
        })}
      </table>
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
    <div className="flex flex-col gap-4">
      {data.properties.map((property) => (
        <PropertyRow key={property.id} property={property} />
      ))}
    </div>
  )
}

function PropertyRow({ property }: { property: Property }) {
  const [open, setOpen] = useState(false)
  const stay = data.stays.find((s) => s.propertyId === property.id)
  const url = stay ? guestUrl(stay.token) : ''
  const [copied, setCopied] = useState(false)

  return (
    <div className="rounded-card border border-deep/10 bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium text-deep">{property.name}</p>
          <p className="text-[15px] text-deep/60">{property.address}</p>
          {stay && (
            <p className="tnum mt-1 text-[15px] text-deep/60">
              Current stay: {stay.guestName}, {formatDay(stay.arrival)} – {formatDay(stay.departure)}
            </p>
          )}
        </div>

        {stay && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer rounded-lg bg-water px-4 py-2 text-[15px] text-paper"
          >
            Get guest link
          </button>
        )}
      </div>

      {open && stay && (
        <div className="mt-5 flex flex-wrap items-center gap-6 border-t border-deep/10 pt-5">
          <QrCode value={url} size={148} />
          <div className="flex flex-col gap-2">
            <p className="tnum text-[15px] break-all text-deep/75">{url}</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(url).catch(() => undefined)
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 1600)
                }}
                className="cursor-pointer rounded-lg border border-deep/15 px-3 py-1.5 text-[14px]"
              >
                {copied ? 'Copied' : 'Copy link'}
              </button>
              <button
                type="button"
                onClick={() => downloadQr(url, `${property.id}-guest-qr.png`)}
                className="cursor-pointer rounded-lg border border-deep/15 px-3 py-1.5 text-[14px]"
              >
                Download QR
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-deep/15 px-3 py-1.5 text-[14px]"
              >
                Open guest view
              </a>
            </div>
            <p className="text-[14px] text-deep/50">
              Print it for the welcome folder. The link is the credential — no account, no app.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Providers() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.providers.map((provider) => (
        <div
          key={provider.id}
          className="flex gap-4 rounded-card border border-deep/10 bg-paper p-5"
        >
          <img
            src={provider.photo}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-deep">{provider.firstName}</p>
              <span className="rounded-full bg-citron/20 px-2 py-0.5 text-[13px] text-deep">
                Verified
              </span>
            </div>
            <p className="text-[15px] text-deep/65">
              {provider.role}, {provider.town}
            </p>
            <p className="mt-2 text-[14px] text-deep/55">
              Checked: {provider.verified.join(' · ')}
            </p>
            <p className="mt-2 text-[15px] text-deep/75">
              {data.services.filter((s) => s.providerId === provider.id).length} services
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
