import { dateBounds } from '../lib/format'
import { num } from '../lib/pricing'
import type { Field, Stay } from '../lib/types'

type Value = string | number | string[]

const inputClass =
  'w-full rounded-xl border border-deep/15 bg-paper px-3 py-2.5 text-deep placeholder:text-deep/35'

/** Every input in the request sheet is driven by the service's fieldSchema. */
export default function FieldInput({
  field,
  value,
  stay,
  onChange,
}: {
  field: Field
  value: Value
  stay: Stay
  onChange: (value: Value) => void
}) {
  const id = `field-${field.id}`

  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-medium text-deep/80">
        {field.label}
      </label>

      <div className="mt-1.5">{control()}</div>

      {field.help && <p className="mt-1.5 text-[14px] text-deep/55">{field.help}</p>}
    </div>
  )

  function control() {
    switch (field.type) {
      case 'date': {
        const { min, max } = dateBounds(field.range, stay)
        return (
          <input
            id={id}
            type="date"
            className={`${inputClass} tnum`}
            value={String(value ?? '')}
            min={min}
            max={max}
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
            className={`${inputClass} tnum`}
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
            className={inputClass}
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
            rows={3}
            className={`${inputClass} resize-none`}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )

      case 'select':
        return (
          <select
            id={id}
            className={inputClass}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
                  className={`cursor-pointer rounded-full px-3 py-2 text-[15px] ${
                    on
                      ? 'bg-water text-paper'
                      : 'border border-deep/15 bg-paper text-deep/75'
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set(current - step)}
              disabled={current <= min}
              aria-label={`Fewer ${field.label.toLowerCase()}`}
              className="h-11 w-11 cursor-pointer rounded-full border border-deep/15 bg-paper text-xl disabled:opacity-35"
            >
              −
            </button>
            <span id={id} className="tnum min-w-16 text-center text-lg">
              {current}
              {field.suffix ? ` ${field.suffix}` : ''}
            </span>
            <button
              type="button"
              onClick={() => set(current + step)}
              disabled={current >= max}
              aria-label={`More ${field.label.toLowerCase()}`}
              className="h-11 w-11 cursor-pointer rounded-full border border-deep/15 bg-paper text-xl disabled:opacity-35"
            >
              +
            </button>
          </div>
        )
      }
    }
  }
}
