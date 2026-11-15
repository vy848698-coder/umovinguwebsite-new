// UMU's voice. POST { text, voice, rate } → audio/mpeg. Needs the seller's
// sign-in token (Authorization: Bearer), and is rate limited per seller.
//
// Uses Microsoft Edge's read-aloud service (server/utils/edgeVoice.ts). Most
// of what UMU says is pre-recorded (utils/umuVoiceClips.ts) and never comes
// here; this makes the rest. If it fails, the page falls back to the
// browser's own voice for that sentence.
//
// In development, UMU_VOICE_LOG=<file> adds every new default-voice line to
// that file, so scripts/build-umu-voice.ts can pre-record it.

import { appendFile } from 'node:fs/promises'
import { UMU_VOICES, MIN_UMU_RATE, MAX_UMU_RATE, DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE } from '../../utils/umuVoices'

// UMU speaks a sentence or two per request; this caps abuse of the endpoint.
const MAX_CHARS = 600

// Only signed-in sellers can use it, and each one only so often. UMU loads
// every line it might say next (the answer options, the follow-up prompts),
// so a busy minute is a few dozen requests; these limits sit well above
// that. Lines already in the cache cost nothing, so only new speech counts
// towards the tighter limit.
const REQUESTS_PER_MINUTE = 300
const NEW_SPEECH_PER_MINUTE = 120
const NEW_SPEECH_PER_HOUR = 1500

// The same questions are asked to every seller, so keep recent audio.
const cache = new Map<string, Buffer>()
const CACHE_LIMIT = 500

export default defineEventHandler(async (event) => {
  const userId = await requireUmuUser(event)
  throttleUmuUser(event, userId, 'tts', REQUESTS_PER_MINUTE, 60_000)

  const body = await readBody<{ text?: unknown; voice?: unknown; rate?: unknown }>(event).catch(() => null)
  const text = typeof body?.text === 'string' ? body.text.replace(/\s+/g, ' ').trim() : ''
  const voice = UMU_VOICES.find((v) => v.id === body?.voice)?.id
  const rate = Math.min(MAX_UMU_RATE, Math.max(MIN_UMU_RATE, Number(body?.rate) || 1))
  if (!text || text.length > MAX_CHARS || !voice) {
    throw createError({ statusCode: 400, statusMessage: 'text (up to 600 characters) and a UMU voice are required' })
  }

  const key = `${voice}|${rate}|${text}`
  let bytes = cache.get(key)
  if (!bytes) {
    throttleUmuUser(event, userId, 'tts-new', NEW_SPEECH_PER_MINUTE, 60_000)
    throttleUmuUser(event, userId, 'tts-new-hour', NEW_SPEECH_PER_HOUR, 3_600_000)
    try {
      // Edge drops a connection now and then, so one retry before giving up
      bytes = await edgeSlot(() => edgeSpeak(voice, text, rate).catch(() => edgeSpeak(voice, text, rate)))
    } catch (err) {
      console.error('[umu-tts]', voice, (err as Error).message)
      throw createError({ statusCode: 502, statusMessage: 'Voice service failed' })
    }
    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!)
    cache.set(key, bytes)
    logLine(voice, rate, text)
  }

  setResponseHeaders(event, {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'private, max-age=86400',
  })
  return bytes
})

// The page loads several sentences at once; Edge refuses too many parallel
// connections, so at most EDGE_MAX run together and the rest wait their turn.
const EDGE_MAX = 4
let edgeActive = 0
const edgeQueue: (() => void)[] = []

async function edgeSlot<T>(fn: () => Promise<T>) {
  if (edgeActive < EDGE_MAX) edgeActive++
  else await new Promise<void>((resolve) => edgeQueue.push(resolve)) // slot handed over below
  try {
    return await fn()
  } finally {
    const next = edgeQueue.shift()
    if (next) next()
    else edgeActive--
  }
}

// Development only: collects the lines UMU still makes live
const logged = new Set<string>()
function logLine(voice: string, rate: number, text: string) {
  const file = process.env.UMU_VOICE_LOG
  if (!file || process.env.NODE_ENV === 'production') return
  if (voice !== DEFAULT_UMU_VOICE || rate !== DEFAULT_UMU_RATE || logged.has(text)) return
  logged.add(text)
  appendFile(file, text + '\n').catch(() => {})
}
