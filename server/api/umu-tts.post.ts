// UMU's voice. POST { text, voice, rate } → audio/mpeg.
//
// Uses Microsoft Edge's read-aloud service: the same neural voices as Azure,
// free and without a key. It is unofficial and can change without notice,
// so the page falls back to the browser's own voice whenever this fails.

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import { UMU_VOICES, MIN_UMU_RATE, MAX_UMU_RATE } from '../../utils/umuVoices'

// UMU speaks a sentence or two per request; this caps abuse of the endpoint.
const MAX_CHARS = 600
const TIMEOUT_MS = 15000

// The same questions are asked to every seller, so keep recent audio.
const cache = new Map<string, Buffer>()
const CACHE_LIMIT = 500

export default defineEventHandler(async (event) => {
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
    try {
      // Edge drops a connection now and then, so one retry before giving up
      bytes = await edgeSlot(() => edge(voice, text, rate).catch(() => edge(voice, text, rate)))
    } catch (err) {
      console.error('[umu-tts]', voice, (err as Error).message)
      throw createError({ statusCode: 502, statusMessage: 'Voice service failed' })
    }
    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value!)
    cache.set(key, bytes)
  }

  setResponseHeaders(event, {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'private, max-age=86400',
  })
  return bytes
})

// The page loads several sentences at once; Edge refuses too many parallel
// connections, so at most EDGE_MAX run together and the rest wait their turn.
const EDGE_MAX = 3
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

async function edge(voice: string, text: string, rate: number) {
  const tts = new MsEdgeTTS()
  try {
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
    const percent = Math.round((rate - 1) * 100)
    const { audioStream } = tts.toStream(escapeXml(text), { rate: `${percent >= 0 ? '+' : ''}${percent}%` })
    const read = (async () => {
      const chunks: Buffer[] = []
      for await (const c of audioStream) chunks.push(c as Buffer)
      return Buffer.concat(chunks)
    })()
    const bytes = await withTimeout(read, 'Edge voice timed out')
    if (!bytes.length) throw new Error('Edge returned no audio')
    return bytes
  } finally {
    tts.close()
  }
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

function withTimeout<T>(p: Promise<T>, message: string) {
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([
    p,
    new Promise<never>((_, reject) => (timer = setTimeout(() => reject(new Error(message)), TIMEOUT_MS))),
  ]).finally(() => clearTimeout(timer))
}
