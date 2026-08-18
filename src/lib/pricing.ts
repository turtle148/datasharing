import type { Field, Service, Stay } from './types'

export type FieldValues = Record<string, string | number | string[]>

export function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** The values a sheet opens with — prefilled from the stay wherever we can. */
export function initialValues(service: Service, stay: Stay): FieldValues {
  const values: FieldValues = {}
  for (const field of service.fieldSchema) {
    values[field.id] = initialValue(field, stay)
  }
  return values
}

function initialValue(field: Field, stay: Stay): string | number | string[] {
  switch (field.prefill) {
    case 'adults':
      return clampStepper(field, stay.adults)
    case 'children':
      return clampStepper(field, stay.children.length)
    case 'children_ages':
      return stay.children.map((c) => c.age).join(' and ')
    case 'arrival':
      return stay.arrival
    case 'departure':
      return stay.departure
  }

  switch (field.type) {
    case 'stepper':
      return field.min ?? 1
    case 'checkboxes':
      return []
    case 'select':
      return field.options?.[0]?.value ?? ''
    default:
      return ''
  }
}

function clampStepper(field: Field, value: number): number {
  const min = field.min ?? 0
  const max = field.max ?? Number.MAX_SAFE_INTEGER
  return Math.min(Math.max(value, min), max)
}

/** How many hours / heads the base price is charged for. */
export function multiplier(service: Service, values: FieldValues): number {
  if (!service.multiplierFields?.length) return 1
  const total = service.multiplierFields.reduce((sum, id) => sum + num(values[id]), 0)
  return Math.max(total, service.minMultiplier ?? 0, 1)
}

/**
 * One estimator for every service: base price × multiplier, plus whatever the
 * chosen options and steppers add. New services are data, not code.
 */
export function estimate(service: Service, values: FieldValues): number {
  const mult = multiplier(service, values)
  const scaled = service.priceModel === 'hourly' || service.priceModel === 'per_person'
  let total = scaled ? service.priceValue * mult : service.priceValue

  for (const field of service.fieldSchema) {
    const value = values[field.id]

    if (field.type === 'select') {
      const option = field.options?.find((o) => o.value === value)
      if (option?.priceDelta) {
        total += field.scalesWithMultiplier ? option.priceDelta * mult : option.priceDelta
      }
    }

    if (field.type === 'checkboxes' && Array.isArray(value)) {
      for (const chosen of value) {
        const option = field.options?.find((o) => o.value === chosen)
        if (option?.priceDelta) total += option.priceDelta
      }
    }

    if (field.type === 'stepper' && field.pricePerUnit) {
      const chargeable = Math.max(0, num(value) - (field.freeUnits ?? 0))
      total += chargeable * field.pricePerUnit
    }
  }

  return Math.max(0, Math.round(total))
}

/** The price line on the card, before anyone has filled anything in. */
export function headlinePrice(service: Service): string {
  const amount = `€${service.priceValue}`
  switch (service.priceModel) {
    case 'hourly':
      return `${amount}/${service.unit ?? 'hour'}`
    case 'per_person':
      return `${amount} per ${service.unit ?? 'person'}`
    case 'from':
      return `from ${amount}`
    default:
      return amount
  }
}

export function commission(gross: number, split: { provider: number; agency: number; platform: number }) {
  return {
    provider: Math.round(gross * split.provider),
    agency: Math.round(gross * split.agency),
    platform: Math.round(gross * split.platform),
  }
}
