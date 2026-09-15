export type Phase = 'before_arrival' | 'first_evening' | 'during_stay' | 'before_departure'

export type PriceModel = 'fixed' | 'hourly' | 'per_person' | 'from'

export type RequestStatus = 'requested' | 'confirmed' | 'scheduled' | 'cancelled'

export interface Agency {
  id: string
  name: string
  /** what the guest sees in a sentence — the full legal name is too long */
  shortName: string
  town: string
  /** provider / agency / platform, summing to 1 */
  split: { provider: number; agency: number; platform: number }
}

export interface Property {
  id: string
  name: string
  town: string
  address: string
  agencyId: string
  heroColor: string
  /** how many of the catalogue's services this house offers */
  servicesOn: number
}

export interface Stay {
  token: string
  propertyId: string
  guestName: string
  /** ISO date, YYYY-MM-DD */
  arrival: string
  departure: string
  adults: number
  children: { age: number }[]
  language: string
}

export interface Provider {
  id: string
  firstName: string
  role: string
  town: string
  photo: string
  blurb: string
  verified: string[]
  /** the line under "Confirmed by …", written in this provider's own terms */
  confirmedNote: string
}

export type FieldType =
  | 'date'
  | 'time'
  | 'stepper'
  | 'checkboxes'
  | 'select'
  | 'textarea'
  | 'text'

export interface FieldOption {
  value: string
  label: string
  /** added to the estimate when picked */
  priceDelta?: number
}

export interface Field {
  id: string
  type: FieldType
  label: string
  help?: string
  placeholder?: string
  required?: boolean
  /** date fields are clamped to the stay unless told otherwise */
  range?: 'stay' | 'arrival_day' | 'departure_day'
  min?: number
  max?: number
  /** what the field opens with, when the minimum is not a sensible default */
  defaultValue?: number
  step?: number
  suffix?: string
  options?: FieldOption[]
  /** stepper: each unit above `free` adds this much */
  pricePerUnit?: number
  freeUnits?: number
  /** option deltas on this field are charged per head/hour rather than once */
  scalesWithMultiplier?: boolean
  /** sits beside the next field rather than on its own row */
  half?: boolean
}

export type ServiceIcon =
  | 'basket'
  | 'car'
  | 'key'
  | 'pot'
  | 'glass'
  | 'bear'
  | 'bed'
  | 'washer'
  | 'boat'
  | 'bottle'
  | 'leaf'
  | 'clock'
  | 'plane'

export interface Service {
  id: string
  /** who actually does it — the agency's business, never shown to the guest */
  providerId: string
  title: string
  icon: ServiceIcon
  /** one line on the card, under the title */
  summary: string
  phase: Phase
  priceModel: PriceModel
  priceValue: number
  /** rendered after the price: 'hour', 'head', … */
  unit?: string
  /** trailing note on the price line, e.g. "+ the cost of the shopping" */
  priceNote?: string
  leadTime: string
  description: string
  /** field ids whose numeric values are summed into the price multiplier */
  multiplierFields?: string[]
  minMultiplier?: number
  fieldSchema: Field[]
  /** shown once a request exists, to build "Scheduled for …" */
  scheduleFields?: { date?: string; time?: string }
  /**
   * A cost the provider passes on at cost — the shopping bill, not the fee.
   * Estimated, never added to the quoted price.
   */
  variableExtra?: { label: string; perUnitField: string; perUnit: number }
}

export interface ServiceRequest {
  id: string
  stayToken: string
  serviceId: string
  fields: Record<string, string | number | string[]>
  estimate: number
  status: RequestStatus
  createdAt: string
  /** set by the agency console when the request is scheduled */
  scheduledFor?: string
}

export interface SeedData {
  agency: Agency
  properties: Property[]
  stays: Stay[]
  providers: Provider[]
  services: Service[]
}

export interface DemoState extends SeedData {
  requests: ServiceRequest[]
}
