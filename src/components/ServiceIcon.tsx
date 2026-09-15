import type { ReactElement } from 'react'
import type { ServiceIcon as IconName } from '../lib/types'

const paths: Record<IconName, ReactElement> = {
  basket: (
    <>
      <path d="M3 8h18l-1.8 10.2a2 2 0 0 1-2 1.8H6.8a2 2 0 0 1-2-1.8Z" />
      <path d="M8 8 10 3M16 8 14 3" />
    </>
  ),
  car: (
    <>
      <path d="M3 14.5h18M5.5 14.5 7 8.2A2 2 0 0 1 8.9 6.7h6.2A2 2 0 0 1 17 8.2l1.5 6.3" />
      <path d="M4 14.5v3.8h3v-3.8M17 14.5v3.8h3v-3.8" />
      <circle cx="7.5" cy="14.5" r="0.6" />
      <circle cx="16.5" cy="14.5" r="0.6" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8M16 16l2-2M18.5 18.5 20 17" />
    </>
  ),
  pot: (
    <>
      <path d="M4 10h16v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
      <path d="M2.5 10h19M8 6.5V5M12 6.5V4.5M16 6.5V5" />
    </>
  ),
  glass: (
    <>
      <path d="M6 4h12l-1 4.5A5 5 0 0 1 12 12a5 5 0 0 1-5-3.5Z" />
      <path d="M12 12v7M8.5 19h7" />
    </>
  ),
  bear: (
    <>
      <circle cx="12" cy="13.5" r="6" />
      <circle cx="6.8" cy="7.2" r="2.6" />
      <circle cx="17.2" cy="7.2" r="2.6" />
      <path d="M10 13h.01M14 13h.01M10.5 16.2a2.4 2.4 0 0 0 3 0" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-9M3 13h18v5M21 18v-5" />
      <path d="M7 13v-2.5h4.5V13" />
      <path d="M12.5 13v-2.5H17V13" />
    </>
  ),
  washer: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
      <circle cx="12" cy="13" r="4" />
      <path d="M4 8h16M7.5 5.8h.01M10.5 5.8h.01" />
    </>
  ),
  boat: (
    <>
      <path d="M3.5 16.5h17l-2.2 3.2a2 2 0 0 1-1.6.8H7.3a2 2 0 0 1-1.6-.8Z" />
      <path d="M12 3.5v13M12 3.5 5.5 13h6.5M12 6.5l5 6.5h-5" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 2.5h4v3.2c0 1 .4 1.6 1 2.3.8.9 1.2 1.7 1.2 3v9.5a1.5 1.5 0 0 1-1.5 1.5h-5.4A1.5 1.5 0 0 1 7.8 20v-9c0-1.3.4-2.1 1.2-3 .6-.7 1-1.3 1-2.3Z" />
      <path d="M7.8 13h8.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8-5 12-11 12H4c0-8 5-12 11-12Z" />
      <path d="M4 20c2.5-4.5 6-7.5 10.5-9.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  plane: (
    <>
      <path d="M10.5 3.2a1.5 1.5 0 0 1 3 0V9l7 4v2.2l-7-2v4l2.2 1.6v1.6l-3.7-1-3.7 1v-1.6L10.5 17v-4l-7 2V13l7-4Z" />
    </>
  ),
}

/**
 * Services are sold as services: an icon stands for the job, not for the person
 * who happens to do it — the agency arranges that side.
 */
export default function ServiceIcon({
  name,
  size = 36,
}: {
  name: IconName
  size?: 36 | 44
}) {
  return (
    <span
      style={{ width: size, height: size, borderRadius: size === 44 ? 10 : 8 }}
      className="flex shrink-0 items-center justify-center bg-monogram text-water"
    >
      <svg
        width={size === 44 ? 24 : 20}
        height={size === 44 ? 24 : 20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths[name]}
      </svg>
    </span>
  )
}
