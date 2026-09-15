import type { Field, Service } from './types'

export type FieldValues = Record<string, string | number | string[]>

export function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** The values a sheet opens with. Nothing is assumed about the stay. */
export function initialValues(service: Service): FieldValues {
  const values: FieldValues = {}
  for (const field of service.fieldSchema) {
    values[field.id] = initialValue(field)
  }
  return values
}

function initialValue(field: Field): string | number | string[] {
  switch (field.type) {
    case 'stepper':
      return field.defaultValue ?? field.min ?? 1
    case 'checkboxes':
      return []
    case 'select':
      return field.options?.[0]?.value ?? ''
    default:
      return ''
  }
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

/** Shares round down, the way they are shown in the console (€54 → €5). */
export function commission(gross: number, split: { provider: number; agency: number; platform: number }) {
  return {
    provider: Math.floor(gross * split.provider),
    agency: Math.floor(gross * split.agency),
    platform: Math.floor(gross * split.platform),
  }
}

/**
 * What the provider will spend on your behalf — the shopping bill, not the fee.
 * Shown beside the estimate, never folded into it.
 */
export function variableExtra(service: Service, values: FieldValues): number {
  if (!service.variableExtra) return 0
  const units = num(values[service.variableExtra.perUnitField], 1)
  return Math.max(0, Math.round(units * service.variableExtra.perUnit))
}
