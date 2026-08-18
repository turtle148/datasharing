/**
 * localStorage where it exists, memory where it doesn't. Sandboxed hosts (the
 * Claude artifact viewer, Safari private mode) throw on access rather than
 * returning null, so the probe has to be a real write.
 */
export interface SafeStorage {
  get(key: string): string | null
  set(key: string, value: string): void
  /** true when other windows on this machine see the same data */
  readonly shared: boolean
}

function probe(): Storage | null {
  try {
    const store = window.localStorage
    const key = '__probe__'
    store.setItem(key, '1')
    store.removeItem(key)
    return store
  } catch {
    return null
  }
}

function create(): SafeStorage {
  const native = typeof window === 'undefined' ? null : probe()

  if (native) {
    return {
      get: (key) => native.getItem(key),
      set: (key, value) => native.setItem(key, value),
      shared: true,
    }
  }

  const memory = new Map<string, string>()
  return {
    get: (key) => memory.get(key) ?? null,
    set: (key, value) => void memory.set(key, value),
    shared: false,
  }
}

export const storage: SafeStorage = create()
