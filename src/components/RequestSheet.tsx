import { useMemo, useState } from 'react'
import FieldInput from './FieldInput'
import ServiceIcon from './ServiceIcon'
import Sheet from './Sheet'
import { money } from '../lib/format'
import {
  estimate,
  headlinePrice,
  initialValues,
  variableExtra,
  type FieldValues,
} from '../lib/pricing'
import { addRequest, data } from '../lib/store'
import type { Field, Service, Stay } from '../lib/types'

export default function RequestSheet({
  service,
  stay,
  onClose,
  onSubmitted,
}: {
  service: Service
  stay: Stay
  onClose: () => void
  onSubmitted: () => void
}) {
  const [values, setValues] = useState<FieldValues>(() => initialValues(service))
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
            · confirmed before anything is charged
          </p>
          <button
            type="submit"
            form="request-form"
            className="mt-3 w-full cursor-pointer rounded-control bg-mint px-4 py-3.5 text-[17px] font-semibold text-deep"
          >
            Request this
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <ServiceIcon name={service.icon} size={44} />
        <h2 className="mt-0.5 text-[20px] leading-[1.3] font-semibold">{service.title}</h2>
      </div>

      <p className="mt-3.5 text-[17px] leading-[1.5] text-deep/78">{service.description}</p>

      <p className="mt-3.5 rounded-xl border border-deep/10 p-3 text-[14px] leading-[1.45] text-deep/62">
        Arranged and paid through {data.agency.name}. Everyone sent to the house is checked for
        ID, insurance and references.
      </p>

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
              onChange={(value) => set(row[0].id, value)}
            />
          ) : (
            <div key={i} className="flex gap-3">
              {row.map((field) => (
                <FieldInput
                  key={field.id}
                  field={field}
                  value={values[field.id]}
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
