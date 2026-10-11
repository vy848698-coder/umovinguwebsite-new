// Who is calling one of our own server routes, and how often.
//
// The app signs in against the backend, which issues the JWT, and this
// server doesn't hold the backend's secret to check it. So the token is
// checked by asking the backend who it belongs to (/profile/me), and the
// answer is kept for a few minutes so UMU's many short voice requests don't
// each cost a backend call.

import type { H3Event } from 'h3'

const VERIFIED_MS = 10 * 60_000
const REJECTED_MS = 60_000
const TOKEN_CACHE_LIMIT = 2000

const tokens = new Map<string, { userId: string | null; until: number }>()

function backendBase(event: H3Event) {
  const apiBase = String(useRuntimeConfig(event).public.apiBase || '')
  // In dev apiBase is the same-origin proxy path; go straight to the backend
  if (/^https?:\/\//.test(apiBase)) return apiBase.replace(/\/$/, '')
  return (process.env.NUXT_PROXY_TARGET || 'https://demo-umu-backend-production.up.railway.app').replace(/\/$/, '')
}

// The signed-in user's id. Throws 401 when there is no valid token, and
// 503 when the backend can't be asked.
export async function requireUmuUser(event: H3Event): Promise<string> {
  const header = getHeader(event, 'authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '').trim()
  if (!token || token === 'null' || token === 'undefined') {
    throw createError({ statusCode: 401, statusMessage: 'Sign in to use this' })
  }

  const now = Date.now()
  const known = tokens.get(token)
  if (known && known.until > now) {
    if (known.userId) return known.userId
    throw createError({ statusCode: 401, statusMessage: 'Sign in to use this' })
  }

  let userId: string | null = null
  try {
    const me = await $fetch<{ id?: string }>(`${backendBase(event)}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 12000,
    })
    userId = me?.id ? String(me.id) : null
  } catch (err: any) {
    const status = err?.response?.status ?? err?.statusCode
    if (status !== 401 && status !== 403) {
      console.error('[umu-user] could not check the token:', status ?? '', err?.message)
      throw createError({ statusCode: 503, statusMessage: 'Could not check who is signed in' })
    }
  }

  if (tokens.size >= TOKEN_CACHE_LIMIT) tokens.delete(tokens.keys().next().value!)
  tokens.set(token, { userId, until: now + (userId ? VERIFIED_MS : REJECTED_MS) })
  if (!userId) throw createError({ statusCode: 401, statusMessage: 'Sign in to use this' })
  return userId
}

// Fixed-window rate limits, kept in memory per server instance.
const windows = new Map<string, { count: number; resetAt: number }>()

// Counts one use of `bucket` by `userId`. Throws 429, with Retry-After, once
// the user has used it `limit` times within `windowMs`.
export function throttleUmuUser(event: H3Event, userId: string, bucket: string, limit: number, windowMs: number) {
  const now = Date.now()
  const key = `${bucket}|${userId}`
  let w = windows.get(key)
  if (!w || w.resetAt <= now) {
    w = { count: 0, resetAt: now + windowMs }
    windows.set(key, w)
  }
  w.count++
  if (w.count > limit) {
    setResponseHeader(event, 'Retry-After', Math.ceil((w.resetAt - now) / 1000))
    throw createError({ statusCode: 429, statusMessage: 'Too many requests, please slow down' })
  }
  // Old windows are dropped now and then so the map stays small
  if (windows.size > 5000) {
    for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k)
  }
}
