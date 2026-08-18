export const PRODUCT_NAME = 'Limonaia'

/** Absolute, because the point is that it gets scanned from someone else's phone. */
export function guestUrl(token: string): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/s/${token}`
}
