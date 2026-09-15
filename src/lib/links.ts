export const PRODUCT_NAME = 'Otiara'

let hashRouting = false

/** The single-file build serves every route from one URL. */
export function useHashRouting() {
  hashRouting = true
}

/** Absolute, because the whole point is that this link gets sent to someone. */
export function guestUrl(token: string): string {
  if (typeof window === 'undefined') return `/s/${token}`
  const { origin, pathname } = window.location
  return hashRouting ? `${origin}${pathname}#/s/${token}` : `${origin}/s/${token}`
}
