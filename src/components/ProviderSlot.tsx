import { useState } from 'react'
import type { Provider } from '../lib/types'

const monogramSize: Record<number, string> = { 36: '18px', 44: '22px', 56: '24px' }

/**
 * The provider's photograph — the thing that separates this from a search
 * result. Until one exists the slot shows the designed monogram fallback
 * rather than a broken image or a category icon.
 */
export default function ProviderSlot({
  provider,
  size = 36,
}: {
  provider: Provider
  size?: 36 | 44 | 56
}) {
  const [failed, setFailed] = useState(false)
  const box = {
    width: size,
    height: size,
    borderRadius: size === 56 ? 10 : 8,
  }

  if (failed || !provider.photo) {
    return (
      <div
        style={{ ...box, fontSize: monogramSize[size] ?? '20px' }}
        className="font-display flex shrink-0 items-center justify-center bg-monogram leading-none text-water"
        aria-hidden="true"
      >
        {provider.firstName.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={provider.photo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={box}
      className="photo-hatch shrink-0 object-cover"
    />
  )
}
