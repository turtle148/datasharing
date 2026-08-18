import { useSyncExternalStore } from 'react'
import { seed } from './seed'
import { seedRequests } from './seedRequests'
import type { RequestStatus, ServiceRequest } from './types'

const KEY = 'gsp.requests.v1'
const POLL_MS = 1500

const listeners = new Set<() => void>()
let requests: ServiceRequest[] = read()
let lastRaw = rawFromStorage()

function rawFromStorage(): string | null {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function read(): ServiceRequest[] {
  const raw = rawFromStorage()
  if (!raw) return seedRequests
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as ServiceRequest[]) : seedRequests
  } catch {
    return seedRequests
  }
}

function write(next: ServiceRequest[]) {
  requests = next
  try {
    lastRaw = JSON.stringify(next)
    window.localStorage.setItem(KEY, lastRaw)
  } catch {
    /* private mode — the demo still runs, it just won't survive a reload */
  }
  emit()
}

function emit() {
  for (const listener of listeners) listener()
}

/**
 * The guest is on a phone and the agency is on a laptop, so the console and the
 * portal are two separate windows. Both watch the same key: `storage` fires
 * across tabs, and the poll covers the tab that made the change itself.
 */
function subscribe(listener: () => void) {
  if (listeners.size === 0) startWatching()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) stopWatching()
  }
}

let timer: number | undefined

function refreshFromStorage() {
  const raw = rawFromStorage()
  if (raw === lastRaw) return
  lastRaw = raw
  requests = read()
  emit()
}

function startWatching() {
  window.addEventListener('storage', refreshFromStorage)
  timer = window.setInterval(refreshFromStorage, POLL_MS)
}

function stopWatching() {
  window.removeEventListener('storage', refreshFromStorage)
  if (timer) window.clearInterval(timer)
  timer = undefined
}

export function useRequests(): ServiceRequest[] {
  return useSyncExternalStore(subscribe, () => requests, () => requests)
}

export function useStayRequests(stayToken: string): ServiceRequest[] {
  const all = useRequests()
  return all.filter((r) => r.stayToken === stayToken)
}

export function addRequest(request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) {
  const full: ServiceRequest = {
    ...request,
    id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    status: 'requested',
    createdAt: new Date().toISOString(),
  }
  write([...read(), full])
  return full
}

export const nextStatus: Partial<Record<RequestStatus, RequestStatus>> = {
  requested: 'confirmed',
  confirmed: 'scheduled',
}

export function advanceRequest(id: string, scheduledFor?: string) {
  write(
    read().map((r) => {
      if (r.id !== id) return r
      const next = nextStatus[r.status]
      if (!next) return r
      return { ...r, status: next, scheduledFor: next === 'scheduled' ? scheduledFor : r.scheduledFor }
    }),
  )
}

export function setStatus(id: string, status: RequestStatus, scheduledFor?: string) {
  write(read().map((r) => (r.id === id ? { ...r, status, scheduledFor: scheduledFor ?? r.scheduledFor } : r)))
}

export function cancelRequest(id: string) {
  write(read().map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)))
}

export function resetDemo() {
  write(seedRequests)
}

export const data = seed
