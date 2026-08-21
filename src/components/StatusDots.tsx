import type { RequestStatus } from '../lib/types'

const steps: RequestStatus[] = ['requested', 'confirmed', 'scheduled']

export default function StatusDots({ status }: { status: RequestStatus }) {
  const reached = steps.indexOf(status)

  return (
    <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      {steps.map((step, i) => (
        <span
          key={step}
          className="h-[7px] w-[7px] rounded-full"
          style={{ background: i <= reached ? 'var(--color-citron)' : 'rgba(14,38,34,0.18)' }}
        />
      ))}
    </span>
  )
}
