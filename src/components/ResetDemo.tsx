import { useState } from 'react'
import { resetDemo } from '../lib/store'

/** Unobtrusive, but always to hand — the pitch gets run more than once. */
export default function ResetDemo({ className = '' }: { className?: string }) {
  const [asking, setAsking] = useState(false)

  if (asking) {
    return (
      <span className={`text-[14px] text-deep/60 ${className}`}>
        Clear every request and start again?{' '}
        <button
          type="button"
          onClick={() => {
            resetDemo()
            setAsking(false)
          }}
          className="cursor-pointer text-clay underline underline-offset-4"
        >
          Reset
        </button>{' '}
        ·{' '}
        <button
          type="button"
          onClick={() => setAsking(false)}
          className="cursor-pointer underline underline-offset-4"
        >
          Keep
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      className={`cursor-pointer text-[14px] text-deep/40 underline underline-offset-4 ${className}`}
    >
      Reset demo
    </button>
  )
}
