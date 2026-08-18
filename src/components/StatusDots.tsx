import type { RequestStatus } from '../lib/types'

const steps: RequestStatus[] = ['requested', 'confirmed', 'scheduled']

export default function StatusDots({ status }: { status: RequestStatus }) {
  const reached = steps.indexOf(status)

  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {steps.map((step, i) => (
        <span
          key={step}
          className={`h-1.5 w-1.5 rounded-full ${
            i <= reached ? 'bg-citron' : 'bg-deep/15'
          }`}
        />
      ))}
    </span>
  )
}
