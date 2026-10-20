// UMU's voice for the AI assistant: reads text aloud in a natural human
// voice, and listens to the seller.
//
// Speaking uses Microsoft Edge's neural voices (free, no key). Text is
// spoken sentence by sentence. Fixed sentences (the questions, options,
// tips, short replies) are pre-recorded files (utils/umuVoiceClips.ts) that
// play at once; the rest are made live by our /api/umu-tts route, which
// needs the seller's sign-in token, and kept in the browser so they are
// instant next time. Every sentence starts loading at once, the first plays
// as soon as it arrives, and each clip's own silence is trimmed and replaced
// by a short, natural pause, a little longer after a question. A sentence
// whose audio can't be had is said by the browser's own voice instead, so
// nothing is skipped, and with no voice at all the caption still shows the
// whole line. The seller can choose another voice and speed; both are
// remembered.
//
// Listening uses the browser's speech recognition, in the seller's own
// English (UK, India, US and so on, from the browser's languages). It only
// shows "listening" once the microphone is really live, so the first words
// aren't lost. It keeps listening through the natural pauses of an answer,
// and restarts itself when the browser ends a session early (Chrome stops
// after a few quiet seconds, phones after every phrase). It stops once the
// seller has been quiet for a moment, or never started. Several possible
// readings of what was said are kept, so the caller can pick the one that
// fits the question. Soft chimes mark the start and end of listening, and
// the live microphone level drives the sound bars. It is never on while
// UMU is speaking, so UMU doesn't hear itself.

import { ref, computed } from 'vue'
import {
  UMU_VOICES,
  DEFAULT_UMU_VOICE,
  DEFAULT_UMU_RATE,
  MIN_UMU_RATE,
  MAX_UMU_RATE,
} from '~/utils/umuVoices'
import { UMU_CLIP_DIR, UMU_CLIP_MANIFEST, umuClipId, type UmuClipManifest } from '~/utils/umuVoiceClips'

const MUTE_KEY = 'umu_voice_muted'
// v2 (2026-10-20): the default became Andrew at normal speed, so earlier
// choices (Ryan, 0.92) are not carried over
const VOICE_KEY = 'umu_voice_id_v2'
const BROWSER_VOICE_KEY = 'umu_voice_name'
const RATE_KEY = 'umu_voice_speed_v2'

const store = {
  get(key: string) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* preference just won't persist */
    }
  },
}

// Higher is better. US English first, to match UMU's own voice, then UK
// English, the most natural engines, and a male voice. Only used when the
// Edge voices can't be reached.
export function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  const lang = (v.lang || '').toLowerCase().replace('_', '-')
  let s = 0
  if (lang === 'en-us') s += 55
  else if (lang === 'en-gb') s += 50
  else if (lang.startsWith('en')) s += 15
  else return -1
  if (name.includes('natural')) s += 45 // Edge neural voices
  if (/andrew|prabhat|ryan|thomas|guy|brian|christopher|connor|william/.test(name)) s += 14
  if (name.includes('google uk english male')) s += 34
  else if (name.includes('google uk english')) s += 22
  if (name.includes('enhanced') || name.includes('premium')) s += 28 // Apple
  if (/daniel|arthur|oliver|jamie/.test(name)) s += 10 // Apple, male
  if (/george/.test(name)) s += 4 // older Windows voice, male
  if (v.localService === false) s += 3
  return s
}

// Abbreviations UMU says as words. A voice reads an unknown short word or
// a word in capitals letter by letter ("mic" as "M I C"), which sounds
// robotic, so these are written out in full for the voice only; the screen
// keeps the short form.
const SAY_AS: [RegExp, string][] = [
  [/\b(press|tap|use|hold) the mic\b/gi, '$1 the microphone button'],
  [/\bmics\b/gi, 'microphones'],
  [/\bmic\b/gi, 'microphone'],
  [/\bN\/A\b/gi, 'not applicable'],
  [/\bT&Cs?\b/g, 'terms and conditions'],
  [/\bapprox\.?(?=\s|$)/gi, 'approximately'],
  [/\bmax\.?(?=\s|$)/gi, 'maximum'],
  [/\bmin\.?(?=\s\d)/gi, 'minimum'],
  [/\bno\.\s?(?=\d)/gi, 'number '],
  [/\bLtd\b/g, 'Limited'],
  [/\bPLC\b/g, 'P L C'],
  [/\b(\d+)\s?yrs?\b/gi, '$1 years'],
  [/\b(\d+)\s?mths?\b/gi, '$1 months'],
  [/\bsq\.?\s?ft\b/gi, 'square feet'],
  [/\bsq\.?\s?m\b|m²/gi, 'square metres'],
  [/\binfo\b/gi, 'information'],
  [/\bdocs\b/gi, 'documents'],
  [/\bID\b/g, 'I D'],
  [/\bMPAN\b/g, 'M P A N'],
  [/\bMPRN\b/g, 'M P R N'],
  [/\bEICR\b/g, 'E I C R'],
  // Fixtures and Fittings writes it as one word
  [/\bGasFires\b/g, 'Gas fires'],
  // A typo in a Leasehold option ("Long leasehold housee"), said as meant
  [/\bhousee\b/gi, 'house'],
]

// Acronyms that really are said letter by letter; any other word in capitals
// is a normal word written loudly ("FREEHOLD", "YES") and is said as a word.
const ACRONYMS = new Set(['UPRN', 'EPC', 'HMRC', 'HMLR', 'VAT', 'KYC', 'NHBC', 'FENSA', 'UMU', 'TA6', 'TA10', 'GOV', 'DIY', 'LPA', 'CCTV', 'NHS', 'ISA', 'LISA', 'SDLT', 'AML', 'PDF', 'PLC', 'MPAN', 'MPRN', 'EICR'])
const softenCaps = (text: string) =>
  text.replace(/\b[A-Z]{2,}\b/g, (w) => (ACRONYMS.has(w) || (w.length <= 3 && !/^(YES|NO|AND|THE|FOR|NOT|ALL|ANY|OWN)$/.test(w)) ? w : w.toLowerCase()))

// Rewrites display text so it reads naturally aloud.
export function speakable(text: string): string {
  return SAY_AS.reduce((t, [from, to]) => t.replace(from, to), softenCaps(text))
    .replace(/\bGOV\.UK\b/gi, 'gov dot UK')
    .replace(/£\s?([\d,]+(?:\.\d+)?)\s?(k|K)\b/g, '$1 thousand pounds')
    .replace(/£\s?([\d,]+(?:\.\d+)?)/g, '$1 pounds')
    .replace(/(\d)\s?%/g, '$1 percent')
    // A reference number ("like 12345678") is read digit by digit, not as
    // "twelve million three hundred and forty five thousand..."
    .replace(/\b\d{6,}\b/g, (d) => d.split('').join(' '))
    .replace(/\be\.g\.\s*/gi, 'for example, ')
    .replace(/\bi\.e\.\s*/gi, 'that is, ')
    .replace(/\betc\.?/gi, 'and so on')
    .replace(/\(s\)/g, 's')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/(\w)\s*\/\s*(\w)/g, '$1 or $2')
    .replace(/\bUPRN\b/g, 'U P R N')
    .replace(/\bHM\b/g, 'H M')
    .replace(/\bEPC\b/g, 'E P C')
    .replace(/\s+[–—-]\s+/g, ', ')
    .replace(/\s*\(\s*/g, ', ')
    .replace(/\s*\)\s*/g, ', ')
    .replace(/[•*_#]/g, ' ')
    .replace(/,\s*([.?!])/g, '$1')
    // "a listed building??", "occurred?." from the form read as one stop
    .replace(/([?!])[?!.:]+/g, '$1')
    .replace(/(,\s*){2,}/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Natural phrases: whole sentences, joined while short, split at commas
// when one sentence alone is too long.
function phrases(text: string, max: number, joinBelow: number): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean)
  const out: string[] = []
  for (const sentence of sentences) {
    const pieces: string[] = []
    if (sentence.length > max) {
      let cur = ''
      for (const part of sentence.split(/(?<=,)\s+/)) {
        if (cur && (cur + ' ' + part).length > max) {
          pieces.push(cur)
          cur = part
        } else cur = cur ? `${cur} ${part}` : part
      }
      if (cur) pieces.push(cur)
    } else pieces.push(sentence)
    for (const p of pieces) {
      const last = out[out.length - 1]
      if (last && last.length < joinBelow && (last + ' ' + p).length <= max) out[out.length - 1] = `${last} ${p}`
      else out.push(p)
    }
  }
  return out
}

// The pause after a phrase, once its own silence is trimmed: longer after a
// question so it can sink in, shortest mid-sentence. Kept short so UMU
// talks in one flow, as a person does, rather than line by line.
function pauseAfter(phrase: string) {
  if (phrase.endsWith('?')) return 420
  if (/[.!]$/.test(phrase)) return 300
  return 160
}

// Cuts the near-silence a voice clip starts and ends with, keeping a little
// so words aren't clipped.
function trimSilence(ctx: BaseAudioContext, buf: AudioBuffer) {
  const data = buf.getChannelData(0)
  const floor = 0.012
  let a = 0
  let b = data.length - 1
  while (a < b && Math.abs(data[a]) < floor) a++
  while (b > a && Math.abs(data[b]) < floor) b--
  a = Math.max(0, a - Math.round(buf.sampleRate * 0.03))
  b = Math.min(data.length - 1, b + Math.round(buf.sampleRate * 0.09))
  if (b - a < buf.sampleRate * 0.1) return buf // nearly silent: leave as is
  const out = ctx.createBuffer(buf.numberOfChannels, b - a + 1, buf.sampleRate)
  for (let ch = 0; ch < buf.numberOfChannels; ch++) out.copyToChannel(buf.getChannelData(ch).subarray(a, b + 1), ch)
  return out
}

// Every clip at the same loudness. The voice service makes some lines
// (short replies like "Saved.") up to half as loud again as others, which
// sounded like UMU dropping its voice between the question and the rest.
// Measured on the speech only, so silences don't count, and never pushed
// past the clip's own peak.
const TARGET_RMS = 0.13
function levelLoudness(buf: AudioBuffer) {
  const data = buf.getChannelData(0)
  let sum = 0
  let n = 0
  let peak = 0
  for (let i = 0; i < data.length; i++) {
    const a = Math.abs(data[i])
    if (a > 0.01) {
      sum += data[i] * data[i]
      n++
    }
    if (a > peak) peak = a
  }
  if (!n || !peak) return buf
  const gain = Math.min(2, TARGET_RMS / Math.sqrt(sum / n), 0.98 / peak)
  if (Math.abs(gain - 1) < 0.03) return buf
  for (let ch = 0; ch < buf.numberOfChannels; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < d.length; i++) d[i] *= gain
  }
  return buf
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

// English locales the speech recogniser knows. The seller's own one is used
// when the browser lists it, so an Indian or American accent is heard by a
// model trained on it; otherwise UK English.
const LISTEN_LOCALES = ['en-GB', 'en-IN', 'en-US', 'en-AU', 'en-IE', 'en-CA', 'en-NZ', 'en-ZA']
function listenLocale() {
  const langs = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : []
  for (const l of langs) {
    const hit = LISTEN_LOCALES.find((x) => x.toLowerCase() === (l || '').toLowerCase())
    if (hit) return hit
  }
  return 'en-GB'
}

// A live sentence normally arrives in one to two seconds; past this the
// browser's voice says it instead.
const CLIP_TIMEOUT_MS = 6000
const PREFETCH_MAX = 2
const PREFETCH_QUEUE_LIMIT = 40
const prefetchQueue: (() => Promise<unknown>)[] = []
let prefetchActive = 0

// Shared across pages within the visit. The MP3 bytes are small (about
// 20 KB a sentence), so many are kept; decoded audio is ten times bigger,
// so only the lines in play are.
const BYTES_CACHE_LIMIT = 400
const BUFFER_CACHE_LIMIT = 40
const bytesCache = new Map<string, Promise<ArrayBuffer>>()
const bufferCache = new Map<string, Promise<AudioBuffer>>()
let audioCtx: AudioContext | null = null
let voiceOut: AudioNode | null = null
let voiceOutCtx: AudioContext | null = null
// The Edge voice failed: no live sentences until this time.
let cloudDownUntil = 0

// Ids of the pre-recorded sentences (utils/umuVoiceClips.ts)
let recorded = new Set<string>()
let recordedLoad: Promise<void> | null = null
function loadRecorded() {
  recordedLoad ||= fetch(UMU_CLIP_MANIFEST)
    .then((res) => (res.ok ? (res.json() as Promise<UmuClipManifest>) : null))
    .then((m) => {
      if (Array.isArray(m?.clips)) recorded = new Set(m!.clips)
    })
    .catch(() => {})
  return recordedLoad
}

// Live sentences are kept in the browser (Cache Storage) between visits, so
// a line made once never waits for the voice service again on this device.
const LIVE_CACHE = 'umu-voice-live-v1'
const LIVE_CACHE_LIMIT = 600
const liveUrl = (id: string) => `/umu-voice/live/${id}.mp3`
let liveTrimmed = false

async function cachedLive(id: string): Promise<ArrayBuffer | null> {
  try {
    const hit = await (await caches.open(LIVE_CACHE)).match(liveUrl(id))
    return hit ? await hit.arrayBuffer() : null
  } catch {
    return null // no Cache Storage (private window, old browser)
  }
}

async function keepLive(id: string, bytes: ArrayBuffer) {
  try {
    const cache = await caches.open(LIVE_CACHE)
    await cache.put(liveUrl(id), new Response(bytes.slice(0), { headers: { 'Content-Type': 'audio/mpeg' } }))
    if (liveTrimmed) return
    liveTrimmed = true
    const keys = await cache.keys()
    // Oldest first
    for (const k of keys.slice(0, Math.max(0, keys.length - LIVE_CACHE_LIMIT))) await cache.delete(k)
  } catch {
    /* it just won't be kept */
  }
}

function remember<T>(map: Map<string, T>, key: string, value: T, limit: number) {
  if (map.size >= limit) map.delete(map.keys().next().value!)
  map.set(key, value)
}

export interface VoiceOption {
  name: string
  label: string
  note: string
  recommended: boolean
}

export function useUmuVoice() {
  const isClient = typeof window !== 'undefined'
  const hasAudio = isClient && !!(window.AudioContext || (window as any).webkitAudioContext)
  const hasBrowserVoice = isClient && 'speechSynthesis' in window
  const canSpeak = hasAudio || hasBrowserVoice
  const SR: any = isClient
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null
  const canListen = !!SR
  const isAndroid = isClient && /android/i.test(navigator.userAgent)
  const isTouch = isClient && matchMedia?.('(pointer: coarse)').matches

  const speaking = ref(false)
  // Waiting for the first sentence's audio to arrive.
  const preparing = ref(false)
  const listening = ref(false)
  const muted = ref(store.get(MUTE_KEY) === '1')
  // The browser refused to speak before the page had a tap (autoplay rule).
  const blocked = ref(false)
  // Why listening failed, in plain words for the page to show.
  const micError = ref<'' | 'denied' | 'no-mic' | 'network' | 'unsupported'>('')
  // 0 to 1, the seller's live voice level while listening.
  const level = ref(0)
  // Other readings of the last answer, best first.
  const alternatives = ref<string[]>([])
  // Whether the natural Edge voice is working right now.
  const natural = ref(true)

  // Voice and speed the seller chose.
  const voiceName = ref(store.get(VOICE_KEY) || DEFAULT_UMU_VOICE)
  if (!UMU_VOICES.some((v) => v.id === voiceName.value)) voiceName.value = DEFAULT_UMU_VOICE
  const browserVoiceName = ref(store.get(BROWSER_VOICE_KEY) || '')
  const storedRate = Number(store.get(RATE_KEY))
  const rate = ref(storedRate >= MIN_UMU_RATE && storedRate <= MAX_UMU_RATE ? storedRate : DEFAULT_UMU_RATE)

  // Live captions: the phrase being spoken and how many of its words have
  // been said, timed from the audio itself.
  const caption = ref('')
  const captionWords = ref(0)
  let wordTimer: ReturnType<typeof setInterval> | null = null

  function stopWordTimer() {
    if (wordTimer) clearInterval(wordTimer)
    wordTimer = null
  }

  function showCaption(text: string, spoken: boolean) {
    stopWordTimer()
    caption.value = text
    const total = text.split(/\s+/).filter(Boolean).length
    captionWords.value = spoken ? total : 0
  }

  // ── Voices ──
  // The natural voices when they work; the device's own English voices if not.
  const browserVoices = ref<SpeechSynthesisVoice[]>([])
  let browserVoice: SpeechSynthesisVoice | null = null

  function loadBrowserVoices() {
    if (!hasBrowserVoice) return
    const all = window.speechSynthesis.getVoices().filter((v) => scoreVoice(v) >= 0)
    all.sort((a, b) => scoreVoice(b) - scoreVoice(a))
    browserVoices.value = all
    browserVoice = all.find((v) => v.name === browserVoiceName.value) || all[0] || null
  }

  if (hasBrowserVoice) {
    loadBrowserVoices()
    window.speechSynthesis.addEventListener?.('voiceschanged', loadBrowserVoices)
  }

  const voices = computed<VoiceOption[]>(() => {
    if (natural.value) {
      return UMU_VOICES.map((v) => ({
        name: v.id,
        label: v.name,
        note: v.note,
        recommended: v.id === DEFAULT_UMU_VOICE,
      }))
    }
    const top = browserVoices.value[0] ? scoreVoice(browserVoices.value[0]) : 0
    return browserVoices.value.map((v) => ({
      name: v.name,
      label: v.name.replace(/^Microsoft\s+/i, '').replace(/\s*-\s*English.*$/i, '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/Online/i, '').trim(),
      note: v.lang,
      recommended: scoreVoice(v) === top,
    }))
  })

  const activeVoice = computed(() => (natural.value ? voiceName.value : browserVoice?.name || ''))

  function setVoice(name: string) {
    if (UMU_VOICES.some((v) => v.id === name)) {
      voiceName.value = name
      store.set(VOICE_KEY, name)
    } else {
      browserVoiceName.value = name
      store.set(BROWSER_VOICE_KEY, name)
      loadBrowserVoices()
    }
  }

  function setRate(value: number) {
    rate.value = Math.min(MAX_UMU_RATE, Math.max(MIN_UMU_RATE, Math.round(value * 100) / 100))
    store.set(RATE_KEY, String(rate.value))
  }

  function setMuted(value: boolean) {
    muted.value = value
    store.set(MUTE_KEY, value ? '1' : '0')
    if (value) stopSpeaking()
  }

  // ── Audio ──
  function ctx(): AudioContext | null {
    if (!hasAudio) return null
    try {
      audioCtx ||= new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch {
      audioCtx = null
    }
    return audioCtx
  }

  // Call from a tap, so UMU's voice and the chimes are allowed to play.
  function unlockAudio() {
    const c = ctx()
    if (c && c.state !== 'running') c.resume().catch(() => {})
  }

  function chime(kind: 'start' | 'stop') {
    const c = audioCtx
    if (!c || c.state !== 'running' || muted.value) return
    const notes = kind === 'start' ? [660, 880] : [880, 600]
    const t0 = c.currentTime
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = t0 + i * 0.09
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.05, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16)
      osc.connect(gain).connect(c.destination)
      osc.start(start)
      osc.stop(start + 0.18)
    })
  }

  // UMU's voice comes out a touch louder and fuller than the raw clip: a
  // gentle lift, with a compressor so the loudest words never distort.
  function output(c: AudioContext): AudioNode {
    if (voiceOut && voiceOutCtx === c) return voiceOut
    const gain = c.createGain()
    gain.gain.value = 1.6
    const comp = c.createDynamicsCompressor()
    comp.threshold.value = -16
    comp.knee.value = 10
    comp.ratio.value = 3
    comp.attack.value = 0.005
    comp.release.value = 0.2
    gain.connect(comp).connect(c.destination)
    voiceOut = gain
    voiceOutCtx = c
    return gain
  }

  // The live voice service is working (as far as we know)
  const liveUp = () => Date.now() >= cloudDownUntil

  function markNaturalDown() {
    cloudDownUntil = Date.now() + 60_000
    natural.value = false
    loadBrowserVoices()
  }

  if (isClient) loadRecorded()

  const clipKey = (text: string) => `${voiceName.value}|${rate.value}|${text}`
  const isRecorded = (text: string) => recorded.has(umuClipId(voiceName.value, rate.value, text))

  // One sentence's MP3: the pre-recorded file when there is one, else the
  // copy this browser kept, else made live (cached).
  function clipBytes(text: string): Promise<ArrayBuffer> {
    const key = clipKey(text)
    let p = bytesCache.get(key)
    if (p) return p
    const voice = voiceName.value
    const speed = rate.value
    const id = umuClipId(voice, speed, text)
    const timed = (url: string, init?: RequestInit) => {
      const ac = new AbortController()
      const timer = setTimeout(() => ac.abort(), CLIP_TIMEOUT_MS)
      return fetch(url, { ...init, signal: ac.signal }).finally(() => clearTimeout(timer))
    }
    const live = async () => {
      const kept = await cachedLive(id)
      if (kept) return kept
      // Down a minute ago: don't keep the seller waiting on it again
      if (!liveUp()) throw new Error('voice service down')
      // The voice route only serves signed-in sellers
      const res = await timed('/api/umu-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${store.get('token') ?? ''}` },
        body: JSON.stringify({ text, voice, rate: speed }),
      }).catch((e) => {
        markNaturalDown() // offline or timed out
        throw e
      })
      // 429 is our own limit and 401 a lapsed sign-in: only this line fails
      if (!res.ok) {
        if (res.status >= 500) markNaturalDown()
        throw new Error(`tts ${res.status}`)
      }
      const bytes = await res.arrayBuffer()
      keepLive(id, bytes)
      return bytes
    }
    p = recorded.has(id)
      ? timed(`${UMU_CLIP_DIR}/${id}.mp3`)
          .then((res) => (res.ok ? res.arrayBuffer() : live()))
          .catch(live)
      : live()
    p.catch(() => bytesCache.delete(key)) // allow a retry later
    remember(bytesCache, key, p, BYTES_CACHE_LIMIT)
    return p
  }

  // One sentence of the natural voice, decoded and trimmed (cached).
  function clip(text: string): Promise<AudioBuffer> {
    const c = ctx()
    if (!c) return Promise.reject(new Error('no audio'))
    const key = clipKey(text)
    let p = bufferCache.get(key)
    if (!p) {
      // decodeAudioData detaches its input, so it decodes a copy
      p = clipBytes(text)
        .then((bytes) => c.decodeAudioData(bytes.slice(0)))
        .then((buf) => levelLoudness(trimSilence(c, buf)))
      p.catch(() => bufferCache.delete(key))
      remember(bufferCache, key, p, BUFFER_CACHE_LIMIT)
    }
    return p
  }

  // Sentences stay separate here: a short one ("Saved.") loads in a moment,
  // and the question after it matches the clip loaded ahead by prefetch.
  const cloudPhrases = (text: string) => phrases(text, 220, 0)

  // Loads a line ahead of time, so it plays straight away when spoken.
  // Pre-recorded sentences are small files and load at once; live ones wait
  // their turn, two at a time, so they never hold up a line UMU needs to
  // say right now.
  async function prefetch(text: string) {
    if (muted.value || !hasAudio) return
    await loadRecorded()
    const clean = (text || '').replace(/\s+/g, ' ').trim()
    for (const p of cloudPhrases(clean)) {
      const say = speakable(p)
      if (bytesCache.has(clipKey(say))) continue
      if (isRecorded(say)) clipBytes(say).catch(() => {})
      else if (liveUp()) prefetchQueue.push(() => clipBytes(say).catch(() => {}))
    }
    // Only the most recent wishes matter
    if (prefetchQueue.length > PREFETCH_QUEUE_LIMIT) prefetchQueue.splice(0, prefetchQueue.length - PREFETCH_QUEUE_LIMIT)
    pumpPrefetch()
  }

  function pumpPrefetch() {
    while (prefetchActive < PREFETCH_MAX && prefetchQueue.length) {
      const job = prefetchQueue.shift()!
      prefetchActive++
      job().finally(() => {
        prefetchActive--
        pumpPrefetch()
      })
    }
  }

  // ── Speaking ──
  let speakRun = 0
  let source: AudioBufferSourceNode | null = null
  let lastCancel = -1e9

  function stopSpeaking() {
    speakRun++
    speaking.value = false
    preparing.value = false
    stopWordTimer()
    if (source) {
      try {
        source.stop()
      } catch {
        /* not started or already stopped */
      }
      source = null
    }
    if (hasBrowserVoice) {
      window.speechSynthesis.cancel()
      lastCancel = performance.now()
    }
  }

  // Speaks the text and resolves when it has finished, been stopped, or
  // could not be spoken. Resolves true only if it was spoken to the end.
  async function speak(text: string): Promise<boolean> {
    stopSpeaking()
    const clean = (text || '').replace(/\s+/g, ' ').trim()
    // Muted or no voice: the caption still shows the whole line
    if (!canSpeak || muted.value || !clean) {
      if (clean) showCaption(clean, true)
      return false
    }
    const run = ++speakRun
    if (hasAudio) {
      const spoken = await speakNatural(clean, run)
      if (spoken !== null) return spoken
      if (run !== speakRun) return false
    }
    if (hasBrowserVoice) return speakBrowser(clean, run)
    showCaption(clean, true)
    return false
  }

  // The natural voice. Resolves null if it couldn't start, so the browser's
  // voice can take over the whole line.
  async function speakNatural(clean: string, run: number): Promise<boolean | null> {
    const c = ctx()
    if (!c) return null
    if (c.state !== 'running') {
      await Promise.race([c.resume().catch(() => {}), wait(400)])
      if (run !== speakRun) return false
      // Not allowed to play yet (no tap so far): the browser voice reports it
      if (c.state !== 'running') return null
    }
    await Promise.race([loadRecorded(), wait(1500)])
    if (run !== speakRun) return false
    const parts = cloudPhrases(clean)
    const said = parts.map((p) => speakable(p))
    // Voice service down and nothing here pre-recorded: no point waiting
    if (!liveUp() && !said.some(isRecorded)) return null
    const clips = said.map((p) => clip(p).catch(() => null))
    showCaption(parts[0], false)
    preparing.value = true
    const first = await clips[0]
    if (run !== speakRun) return false
    preparing.value = false
    if (first) natural.value = true
    blocked.value = false
    speaking.value = true
    for (let i = 0; i < parts.length; i++) {
      const buf = await clips[i]
      if (run !== speakRun) return false
      // No audio for this sentence: the browser's voice says it, in its
      // place, so no part of the line goes missing
      if (buf) await playClip(c, buf, parts[i], run)
      else if (hasBrowserVoice) await sayBrowserPhrase(parts[i], run)
      else showCaption(parts[i], true)
      if (run !== speakRun) return false
      speaking.value = true
      if (i < parts.length - 1) await wait(pauseAfter(parts[i]))
      if (run !== speakRun) return false
    }
    speaking.value = false
    return true
  }

  function playClip(c: AudioContext, buf: AudioBuffer, shown: string, run: number) {
    return new Promise<void>((resolve) => {
      const src = c.createBufferSource()
      src.buffer = buf
      src.connect(output(c))
      source = src
      showCaption(shown, false)
      const total = shown.split(/\s+/).filter(Boolean).length
      const started = c.currentTime
      wordTimer = setInterval(() => {
        const p = (c.currentTime - started) / buf.duration
        captionWords.value = Math.min(total, Math.floor(p * total) + 1)
      }, 80)
      let ended = false
      const end = () => {
        if (ended) return
        ended = true
        clearTimeout(watchdog)
        stopWordTimer()
        if (source === src) source = null
        if (run === speakRun) captionWords.value = total
        resolve()
      }
      // Moves on if the device pauses audio and never reports the end
      const watchdog = setTimeout(end, buf.duration * 1000 + 1500)
      src.onended = end
      src.start()
    })
  }

  // The browser's own voice, for a whole line when the natural one can't
  // be reached at all. Resolves true only if it was said to the end.
  async function speakBrowser(clean: string, run: number): Promise<boolean> {
    // Chrome drops utterances longer than about 15 seconds
    const parts = phrases(clean, 170, 70)
    for (const shown of parts) {
      const result = await sayBrowserPhrase(shown, run)
      if (result === 'stopped' || run !== speakRun) return false
      if (result === 'failed') {
        speaking.value = false
        return false
      }
      await wait(pauseAfter(shown) / 2)
    }
    speaking.value = false
    return run === speakRun
  }

  // One phrase in the browser's voice, with live captions.
  function sayBrowserPhrase(shown: string, run: number): Promise<'done' | 'stopped' | 'failed'> {
    if (!browserVoice) loadBrowserVoices()
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(speakable(shown))
      if (browserVoice) u.voice = browserVoice
      u.lang = browserVoice?.lang || 'en-GB'
      // The seller's speed, relative to UMU's usual one: the browser's
      // voices already talk at a normal pace
      u.rate = Math.min(1.3, Math.max(0.8, rate.value / DEFAULT_UMU_RATE))
      u.pitch = 1
      const total = shown.split(/\s+/).filter(Boolean).length
      let boundaries = false
      let ended = false
      const finish = (result: 'done' | 'stopped' | 'failed') => {
        if (ended) return
        ended = true
        clearTimeout(watchdog)
        stopWordTimer()
        if (run === speakRun && result === 'done') captionWords.value = total
        resolve(run === speakRun ? result : 'stopped')
      }
      // Moves on if the browser never says this phrase ended
      const watchdog = setTimeout(() => finish('done'), (total / (2.3 * u.rate)) * 1000 + 3500)
      u.onstart = () => {
        if (run !== speakRun) return
        speaking.value = true
        blocked.value = false
        showCaption(shown, false)
        const started = performance.now()
        wordTimer = setInterval(() => {
          if (boundaries) return
          // About 2.6 words a second at normal speed
          const est = Math.floor(((performance.now() - started) / 1000) * 2.6 * u.rate) + 1
          captionWords.value = Math.min(total, est)
        }, 90)
      }
      u.onboundary = (e: any) => {
        if (run !== speakRun || e.name !== 'word') return
        boundaries = true
        const spokenSoFar = u.text.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length
        const ratio = total / Math.max(1, u.text.split(/\s+/).filter(Boolean).length)
        captionWords.value = Math.min(total, Math.round(spokenSoFar * ratio) + 1)
      }
      u.onend = () => finish('done')
      u.onerror = (e: any) => {
        if (run !== speakRun) return finish('stopped')
        if (e?.error === 'interrupted' || e?.error === 'canceled') return finish('done')
        if (e?.error === 'not-allowed') {
          blocked.value = true
          showCaption(shown, true)
        }
        finish('failed')
      }
      // Chrome silently drops speech queued straight after cancel(), which
      // left UMU quiet on a question it had just been asked to read
      const sinceCancel = performance.now() - lastCancel
      setTimeout(() => {
        if (run !== speakRun) return finish('stopped')
        // Chrome can leave the queue paused after a tab switch
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
        window.speechSynthesis.speak(u)
      }, sinceCancel < 120 ? 120 - sinceCancel : 0)
    })
  }

  // Plays a short sample of the chosen voice.
  function preview() {
    unlockAudio()
    return speak("Hi, I'm UMU. I'll read each question to you, nice and clearly, and you can answer in your own words.")
  }

  // ── Microphone level ──
  let micStream: MediaStream | null = null
  let levelRaf = 0

  async function startLevel() {
    // Phones can't always share the mic between this and speech
    // recognition, so the live level is a desktop extra.
    if (isTouch || !navigator.mediaDevices?.getUserMedia) return
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      const c = ctx()
      if (!c || !listening.value) return stopLevel()
      const sourceNode = c.createMediaStreamSource(micStream)
      const analyser = c.createAnalyser()
      analyser.fftSize = 512
      sourceNode.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const v of data) sum += ((v - 128) / 128) ** 2
        const rms = Math.sqrt(sum / data.length)
        level.value = level.value * 0.6 + Math.min(1, rms * 5) * 0.4
        levelRaf = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      stopLevel()
    }
  }

  function stopLevel() {
    cancelAnimationFrame(levelRaf)
    micStream?.getTracks().forEach((t) => t.stop())
    micStream = null
    level.value = 0
  }

  // Asks for the microphone once, from a tap, so the first answer isn't
  // lost to the permission prompt. Resolves false if it's blocked.
  async function prepareMic(): Promise<boolean> {
    unlockAudio()
    if (!canListen) {
      micError.value = 'unsupported'
      return false
    }
    if (!navigator.mediaDevices?.getUserMedia) return true
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      s.getTracks().forEach((t) => t.stop())
      micError.value = ''
      return true
    } catch (e: any) {
      micError.value = e?.name === 'NotFoundError' ? 'no-mic' : 'denied'
      return false
    }
  }

  // ── Listening ──
  let recognition: any = null
  let listenRun = 0

  interface ListenOptions {
    onInterim?: (text: string) => void
    // Quiet time after speech that ends the answer
    endSilenceMs?: number
    // How long to wait for the seller to start talking
    noSpeechMs?: number
    // Longest single answer
    maxMs?: number
    // True once what was heard is a whole answer ("yes", an option's
    // name), so listening ends at once instead of waiting for silence
    isComplete?: (text: string) => boolean
  }

  // Listens for one answer. Resolves with what was said, or '' if nothing
  // was heard. Partial text arrives through onInterim as the seller talks;
  // other readings of the answer land in `alternatives`.
  async function listen(options: ListenOptions = {}): Promise<string> {
    stopListening()
    alternatives.value = []
    if (!canListen) {
      micError.value = 'unsupported'
      return ''
    }
    if (speaking.value || preparing.value) stopSpeaking()
    const token = ++listenRun
    // Let the last of UMU's voice fade so it isn't heard as the answer
    await wait(150)
    if (token !== listenRun) return ''
    const { onInterim, isComplete, endSilenceMs = 1800, noSpeechMs = 10000, maxMs = 30000 } = options
    const lang = listenLocale()

    return new Promise((resolve) => {
      // Each finished phrase, with its other readings
      const finals: string[][] = []
      // Words of the current session not yet finished
      let interim = ''
      let heard = false
      let micLive = false
      let settled = false
      let ending = false
      let fatal = false
      let rec: any = null
      let quickEnds = 0
      let silenceTimer: ReturnType<typeof setTimeout> | null = null
      const timers: ReturnType<typeof setTimeout>[] = []
      const t0 = performance.now()

      const finish = () => {
        if (settled) return
        settled = true
        if (silenceTimer) clearTimeout(silenceTimer)
        timers.forEach(clearTimeout)
        if (interim.trim()) finals.push([interim.trim()])
        interim = ''
        if (rec) {
          try {
            rec.abort()
          } catch {
            /* already stopped */
          }
        }
        if (recognition === rec) recognition = null
        rec = null
        listening.value = false
        stopLevel()
        if (micLive) chime('stop')
        // The answer, best reading first, then other readings of the last
        // phrase with the earlier phrases kept as they were
        const lead = finals.slice(0, -1).map((alts) => alts[0]).join(' ')
        const last = finals[finals.length - 1] || []
        const readings = last.map((alt) => `${lead} ${alt}`.replace(/\s+/g, ' ').trim())
        alternatives.value = [...new Set(readings.filter(Boolean))]
        resolve(alternatives.value[0] || '')
      }

      // Ends the answer: lets the browser hand over its last words first
      const endAnswer = () => {
        if (settled) return
        ending = true
        if (!rec) return finish()
        try {
          rec.stop()
        } catch {
          return finish()
        }
        timers.push(setTimeout(finish, 1500))
      }

      // The microphone is really live: now the seller can talk
      const markLive = () => {
        if (micLive || settled) return
        micLive = true
        listening.value = true
        micError.value = ''
        chime('start')
        startLevel()
      }

      const session = () => {
        if (settled || token !== listenRun) return finish()
        const r = new SR()
        rec = r
        recognition = r
        r.lang = lang
        // Android's continuous mode repeats results, so it listens one
        // phrase at a time there and is restarted between phrases.
        r.continuous = !isAndroid
        r.interimResults = true
        r.maxAlternatives = 5
        const startedAt = performance.now()
        // Some browsers never report audiostart
        const liveTimer = setTimeout(markLive, 900)

        r.onaudiostart = markLive
        r.onresult = (event: any) => {
          if (rec !== r) return
          markLive()
          heard = true
          interim = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            if (result.isFinal) {
              const alts: string[] = []
              for (let a = 0; a < result.length; a++) alts.push(result[a].transcript.trim())
              if (alts.some(Boolean)) finals.push(alts)
            } else interim += result[0].transcript
          }
          const sofar = [...finals.map((alts) => alts[0]), interim].join(' ').replace(/\s+/g, ' ').trim()
          onInterim?.(sofar)
          // A whole answer already: no need to wait for the quiet spell
          if (!interim && isComplete?.(sofar)) return endAnswer()
          // End of the answer: a short quiet spell after the last words
          if (silenceTimer) clearTimeout(silenceTimer)
          silenceTimer = setTimeout(endAnswer, endSilenceMs)
        }
        r.onerror = (e: any) => {
          const err = e?.error
          if (err === 'not-allowed' || err === 'service-not-allowed') micError.value = 'denied'
          else if (err === 'audio-capture') micError.value = 'no-mic'
          else if (err === 'network') micError.value = 'network'
          // "no-speech" just means a quiet spell: the session restarts below
          if (err && err !== 'no-speech') fatal = true
        }
        r.onend = () => {
          clearTimeout(liveTimer)
          if (rec !== r) return
          // Keep words this session heard but never finished
          if (interim.trim()) finals.push([interim.trim()])
          interim = ''
          rec = null
          if (settled) return
          if (fatal || ending || token !== listenRun) return finish()
          const elapsed = performance.now() - t0
          if (elapsed >= maxMs || (!heard && elapsed >= noSpeechMs)) return finish()
          // Phones end a session after each phrase, and their own end of
          // speech detection is good, so a phrase heard there is the answer
          if (isAndroid && heard) return finish()
          // Ending again and again straight away: the mic isn't working
          if (performance.now() - startedAt < 400 && ++quickEnds > 3) return finish()
          session()
        }
        try {
          r.start()
        } catch {
          clearTimeout(liveTimer)
          rec = null
          finish()
        }
      }

      timers.push(setTimeout(() => !heard && endAnswer(), noSpeechMs))
      timers.push(setTimeout(endAnswer, maxMs))
      session()
    })
  }

  function stopListening() {
    listenRun++
    if (recognition) {
      try {
        recognition.abort()
      } catch {
        /* already stopped */
      }
      recognition = null
    }
    listening.value = false
    stopLevel()
  }

  function stopAll() {
    stopSpeaking()
    stopListening()
  }

  return {
    canSpeak,
    canListen,
    speaking,
    preparing,
    caption,
    captionWords,
    showCaption,
    listening,
    muted,
    blocked,
    micError,
    level,
    alternatives,
    natural,
    voices,
    voiceName,
    activeVoice,
    rate,
    setVoice,
    setRate,
    setMuted,
    unlockAudio,
    prepareMic,
    speak,
    prefetch,
    preview,
    stopSpeaking,
    listen,
    stopListening,
    stopAll,
  }
}
