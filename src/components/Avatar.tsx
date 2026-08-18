import { useState } from 'react'
import type { Provider } from '../lib/types'

/**
 * Provider identity is the product, so the photo is never a logo or a category
 * icon. If the image doesn't load we fall back to the initial, not to a glyph.
 */
export default function Avatar({ provider, size = 44 }: { provider: Provider; size?: number }) {
  const [failed, setFailed] = useState(false)
  const dimension = { width: size, height: size }

  if (failed) {
    return (
      <div
        style={dimension}
        className="flex shrink-0 items-center justify-center rounded-full bg-water/10 font-display text-water"
        aria-hidden="true"
      >
        {provider.firstName.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={provider.photo}
      alt={provider.firstName}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={dimension}
      className="shrink-0 rounded-full object-cover"
    />
  )
}
