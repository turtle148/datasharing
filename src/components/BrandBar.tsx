import type { ReactNode } from 'react'
import { PRODUCT_NAME } from '../lib/links'

/**
 * The dark chrome from otiara.it, so the portal reads as Otiara's from the
 * first pixel. The mark is a placeholder for the real logo file.
 */
export default function BrandBar({
  right,
  width = 'max-w-[480px]',
}: {
  right?: ReactNode
  width?: string
}) {
  return (
    <div className="bg-deep">
      <div className={`mx-auto flex ${width} items-center justify-between gap-4 px-4 py-3`}>
        <span className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill="none" stroke="var(--color-mint)" strokeWidth="2.5" />
            <circle cx="13.5" cy="13.5" r="2.5" fill="var(--color-mint)" />
          </svg>
          <span className="text-[19px] font-semibold tracking-[-0.01em] text-paper">
            {PRODUCT_NAME}
          </span>
        </span>
        {right}
      </div>
    </div>
  )
}
