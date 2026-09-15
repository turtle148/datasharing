import { dateBounds } from '../lib/format'
import { num } from '../lib/pricing'
import type { Field } from '../lib/types'

type Value = string | number | string[]

const control =
  'w-full rounded-control border border-deep/22 bg-paper px-3.5 py-3 text-[17px] leading-[1.3] placeholder:text-deep/40'

/** Every input in the request sheet is driven by the service's fieldSchema. */
export default function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field
  value: Value
  onChange: (value: Value) => void
}) {
  const id = `field-${field.id}`

  return (
    <div className={field.half ? 'min-w-0 flex-1' : ''}>
      <label
        htmlFor={id}
        className="block text-[13px] font-semibold tracking-[0.08em] text-deep/60 uppercase"
      >
        {field.label}
      </label>

      <div className="mt-1.5">{input()}</div>

      {field.help && <p className="mt-1.5 text-[14px] text-deep/55">{field.help}</p>}
    </div>
  )

  function input() {
    switch (field.type) {
      case 'date': {
        const { min } = dateBounds()
        return (
          <input
            id={id}
            type="date"
            className={`${control} tnum`}
            value={String(value ?? '')}
            min={min}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      }

      case 'time':
        return (
          <input
            id={id}
            type="time"
            className={`${control} tnum`}
            value={String(value ?? '')}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'text':
        return (
          <input
            id={id}
            type="text"
            className={control}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'textarea':
        return (
          <textarea
            id={id}
            className={`${control} min-h-[76px] resize-none leading-[1.45]`}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'select':
        return (
          <div className="relative">
            <select
              id={id}
              className={`${control} appearance-none pr-10`}
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-deep/45"
            >
              ▾
            </span>
          </div>
        )

      case 'checkboxes': {
        const chosen = Array.isArray(value) ? value : []
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const on = chosen.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    onChange(
                      on ? chosen.filter((v) => v !== option.value) : [...chosen, option.value],
                    )
                  }
                  className={`cursor-pointer rounded-full px-3.5 py-2.5 text-[15px] leading-none ${
                    on ? 'bg-mint text-deep' : 'border border-deep/22 bg-paper'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )
      }

      case 'stepper': {
        const min = field.min ?? 0
        const max = field.max ?? 99
        const step = field.step ?? 1
        const current = num(value, min)
        const set = (next: number) => onChange(Math.min(Math.max(next, min), max))

        return (
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => set(current - step)}
              disabled={current <= min}
              aria-label={`Fewer — ${field.label.toLowerCase()}`}
              className="h-11 w-11 cursor-pointer rounded-full border border-deep/22 bg-paper text-[20px] leading-none disabled:opacity-35"
            >
              −
            </button>
            <span id={id} className="tnum min-w-6 text-center text-[17px] font-semibold">
              {current}
              {field.suffix ? ` ${field.suffix}` : ''}
            </span>
            <button
              type="button"
              onClick={() => set(current + step)}
              disabled={current >= max}
              aria-label={`More — ${field.label.toLowerCase()}`}
              className="h-11 w-11 cursor-pointer rounded-full border border-deep/22 bg-paper text-[20px] leading-none disabled:opacity-35"
            >
              +
            </button>
          </div>
        )
      }
    }
  }
}
