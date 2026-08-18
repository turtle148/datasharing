export const PRODUCT_NAME = 'Limonaia'

let hashRouting = false

/** The single-file artifact build serves every route from one URL. */
export function useHashRouting() {
  hashRouting = true
}

/** Absolute, because the point is that it gets scanned from someone else's phone. */
export function guestUrl(token: string): string {
  if (typeof window === 'undefined') return `/s/${token}`
  const { origin, pathname } = window.location
  return hashRouting ? `${origin}${pathname}#/s/${token}` : `${origin}/s/${token}`
}
