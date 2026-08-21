import { useMemo, useState } from 'react'
import ProviderSlot from './ProviderSlot'
import FieldInput from './FieldInput'
import Sheet from './Sheet'
import { money } from '../lib/format'
import {
  estimate,
  headlinePrice,
  initialValues,
  variableExtra,
  type FieldValues,
} from '../lib/pricing'
import { addRequest } from '../lib/store'
import type { Field, Provider, Service, Stay } from '../lib/types'

export default function RequestSheet({
  service,
  provider,
  stay,
  onClose,
  onSubmitted,
}: {
  service: Service
  provider: Provider
  stay: Stay
  onClose: () => void
  onSubmitted: () => void
}) {
  const [values, setValues] = useState<FieldValues>(() => initialValues(service, stay))
  const total = useMemo(() => estimate(service, values), [service, values])
  const extra = useMemo(() => variableExtra(service, values), [service, values])
  const rows = useMemo(() => groupFields(service.fieldSchema), [service])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    addRequest({ stayToken: stay.token, serviceId: service.id, fields: values, estimate: total })
    onSubmitted()
  }

  return (
    <Sheet
      label={service.title}
      onClose={onClose}
      footer={
        <>
          <p className="text-[15px] text-deep/62">
            <span className="tnum">
              Estimated <span className="font-semibold">{money(total)}</span>
              {extra > 0 && (
                <>
                  {' '}
                  + about <span className="font-semibold">{money(extra)}</span>{' '}
                  {service.variableExtra?.label}
                </>
              )}
            </span>{' '}
            · confirmed by {provider.firstName} before anything is charged
          </p>
          <button
            type="submit"
            form="request-form"
            className="mt-3 w-full cursor-pointer rounded-control bg-water px-4 py-3.5 text-[17px] font-semibold text-paper"
          >
            Request this
          </button>
        </>
      }
    >
      <h2 className="text-[20px] leading-[1.3] font-semibold">{service.title}</h2>

      <div className="mt-3.5 flex items-start gap-3 rounded-xl border border-deep/10 p-3">
        <ProviderSlot provider={provider} size={44} />
        <div className="min-w-0">
          <p className="text-[15px] leading-[1.3]">
            <span className="font-semibold">{provider.firstName}</span> · {provider.role}
          </p>
          <p className="mt-1 text-[14px] leading-[1.3] text-deep/55">
            Verified: {provider.verified.join(' · ')}
          </p>
        </div>
      </div>

      <p className="mt-3.5 text-[17px] leading-[1.5] text-deep/78">{service.description}</p>

      <p className="mt-3.5 flex flex-wrap items-baseline gap-x-2 text-[15px] text-deep/55">
        <span className="tnum text-[17px] font-semibold text-deep">{headlinePrice(service)}</span>
        <span>{service.leadTime}</span>
      </p>

      <div className="mt-3.5 border-t border-deep/10" />

      <form id="request-form" onSubmit={submit} className="mt-4 flex flex-col gap-4">
        {rows.map((row, i) =>
          row.length === 1 ? (
            <FieldInput
              key={row[0].id}
              field={row[0]}
              value={values[row[0].id]}
              stay={stay}
              onChange={(value) => set(row[0].id, value)}
            />
          ) : (
            <div key={i} className="flex gap-3">
              {row.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  stay={stay}
                  onChange={(value) => set(field.id, value)}
                />
              ))}
            </div>
          ),
        )}
      </form>
    </Sheet>
  )

  function set(id: string, value: FieldValues[string]) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }
}

/** Fields marked `half` pair up onto one row, the way the design shows date and time. */
function groupFields(schema: Field[]): Field[][] {
  const rows: Field[][] = []
  for (const field of schema) {
    const last = rows[rows.length - 1]
    if (field.half && last?.length === 1 && last[0].half) last.push(field)
    else rows.push([field])
  }
  return rows
}
