import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from './Avatar'
import FieldInput from './FieldInput'
import { money } from '../lib/format'
import { estimate, headlinePrice, initialValues, type FieldValues } from '../lib/pricing'
import { addRequest } from '../lib/store'
import type { Provider, Service, Stay } from '../lib/types'

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
  const panel = useRef<HTMLDivElement>(null)
  const total = useMemo(() => estimate(service, values), [service, values])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    addRequest({ stayToken: stay.token, serviceId: service.id, fields: values, estimate: total })
    onSubmitted()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="animate-scrim absolute inset-0 cursor-pointer bg-deep/40"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
        tabIndex={-1}
        className="animate-sheet-up relative flex max-h-[92vh] w-full max-w-[480px] flex-col rounded-t-3xl bg-paper"
      >
        <div className="shrink-0 px-5 pt-3 pb-1">
          <div className="mx-auto h-1 w-10 rounded-full bg-deep/15" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <h2 className="mt-3 text-xl leading-snug font-medium text-deep">{service.title}</h2>

          <div className="mt-4 flex gap-3">
            <Avatar provider={provider} size={52} />
            <div>
              <p className="text-[15px] text-deep/70">
                <span className="font-medium text-deep/85">{provider.firstName}</span> ·{' '}
                {provider.role}, {provider.town}
              </p>
              <p className="mt-1 text-[13px] text-deep/50">
                Verified: {provider.verified.join(' · ')}
              </p>
            </div>
          </div>

          <p className="mt-4 text-deep/85">{service.description}</p>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-2 text-[15px]">
            <span className="tnum font-medium text-deep">{headlinePrice(service)}</span>
            {service.priceNote && <span className="text-deep/60">{service.priceNote}</span>}
            <span className="text-deep/60">· {service.leadTime}</span>
          </div>

          <form id="request-form" onSubmit={submit} className="mt-6 flex flex-col gap-5">
            {service.fieldSchema.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                value={values[field.id]}
                stay={stay}
                onChange={(value) => setValues((prev) => ({ ...prev, [field.id]: value }))}
              />
            ))}
          </form>
        </div>

        <div className="shrink-0 border-t border-deep/10 bg-paper px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p className="text-[15px] text-deep/70">
            <span className="tnum font-medium text-deep">Estimated {money(total)}</span>
            {service.priceNote?.startsWith('+') ? ` ${service.priceNote}` : ''} · confirmed by{' '}
            {provider.firstName} before anything is charged
          </p>
          <button
            type="submit"
            form="request-form"
            className="mt-3 w-full cursor-pointer rounded-xl bg-water px-4 py-3.5 font-medium text-paper"
          >
            Request this
          </button>
        </div>
      </div>
    </div>
  )
}
