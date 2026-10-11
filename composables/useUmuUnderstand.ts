// Asks /api/umu-understand what the seller meant, when UMU's own matching
// couldn't place a spoken answer. Resolves null whenever it can't help (not
// set up, signed out, busy, slow), so UMU simply asks again as before.

export interface UnderstandField {
  kind: 'choice' | 'number' | 'letter' | 'text'
  question: string
  label: string
  options?: string[]
  min?: number | null
  max?: number | null
  lowLabel?: string
  highLabel?: string
}

export interface Understanding {
  intent: 'answer' | 'not_sure' | 'skip' | 'unclear'
  option: string | null
  value: string | null
}

// The server isn't set up for it: stop asking for the rest of the visit
let unavailable = false
const WAIT_MS = 9000

export async function understandAnswer(field: UnderstandField, said: string[]): Promise<Understanding | null> {
  const readings = said.map((s) => (s || '').trim()).filter(Boolean)
  if (unavailable || !readings.length || typeof window === 'undefined') return null
  let token = ''
  try {
    token = localStorage.getItem('token') || ''
  } catch {
    /* no token, no request */
  }
  if (!token) return null
  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), WAIT_MS)
  try {
    const res = await fetch('/api/umu-understand', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ field, said: readings }),
      signal: ac.signal,
    })
    if (res.status === 501) unavailable = true
    if (!res.ok) return null
    return (await res.json()) as Understanding
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
