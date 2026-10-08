// UMU's voice for the AI assistant: reads text aloud with the clearest
// English voice the device offers, and listens to the seller.
//
// Everything runs in the browser, with no paid speech service.
//
// Speaking uses speech synthesis. Voices differ a lot by device, so the
// best English (UK) voice is picked by name: Edge's "Natural" voices, then
// Google UK English, then Apple's enhanced voices. The seller can choose
// another voice and speed; both are remembered. Text is rewritten for the
// ear first (amounts, abbreviations, symbols) and spoken in natural phrases
// of a sentence or two: Chrome drops utterances longer than about 15
// seconds, and very short pieces sound choppy. A watchdog moves on if the
// browser never reports the end of a phrase (a known Chrome bug).
//
// Listening uses speech recognition (en-GB) with its own end of speech
// detection: it keeps listening through the natural pauses of a sentence
// and stops once the seller has been quiet for a moment, or never started.
// Several possible readings of what was said are kept, so the caller can
// pick the one that fits the question. Soft chimes mark the start and end
// of listening, and the live microphone level drives the sound bars. It is
// never on while UMU is speaking, so UMU doesn't hear itself.

import { ref } from 'vue'

const MUTE_KEY = 'umu_voice_muted'
const VOICE_KEY = 'umu_voice_name'
const RATE_KEY = 'umu_voice_rate'

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

// Higher is better. English (UK) first, then the most natural engines.
export function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  const lang = (v.lang || '').toLowerCase().replace('_', '-')
  let s = 0
  if (lang === 'en-gb') s += 50
  else if (lang.startsWith('en')) s += 15
  else return -1
  if (name.includes('natural')) s += 45 // Edge neural voices
  if (/sonia|libby|ryan|maisie|thomas/.test(name)) s += 10
  if (name.includes('google uk english female')) s += 32
  else if (name.includes('google uk english')) s += 28
  if (name.includes('enhanced') || name.includes('premium')) s += 28 // Apple
  if (/serena|kate|daniel|stephanie|jamie/.test(name)) s += 8
  if (/hazel|george|susan/.test(name)) s += 2 // older Windows voices
  if (v.localService === false) s += 3
  return s
}

// Rewrites display text so it reads naturally aloud.
export function speakable(text: string): string {
  return text
    .replace(/\bGOV\.UK\b/gi, 'gov dot UK')
    .replace(/£\s?([\d,]+(?:\.\d+)?)\s?(k|K)\b/g, '$1 thousand pounds')
    .replace(/£\s?([\d,]+(?:\.\d+)?)/g, '$1 pounds')
    .replace(/(\d)\s?%/g, '$1 percent')
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
    .replace(/(,\s*){2,}/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// Natural phrases: whole sentences, joined while short, split at commas
// when one sentence alone is too long for Chrome to speak in one go.
function phrases(text: string, max = 170): string[] {
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
      if (last && last.length < 70 && (last + ' ' + p).length <= max) out[out.length - 1] = `${last} ${p}`
      else out.push(p)
    }
  }
  return out
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export interface VoiceOption {
  name: string
  lang: string
  recommended: boolean
}

export function useUmuVoice() {
  const isClient = typeof window !== 'undefined'
  const canSpeak = isClient && 'speechSynthesis' in window
  const SR: any = isClient
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null
  const canListen = !!SR
  const isAndroid = isClient && /android/i.test(navigator.userAgent)
  const isTouch = isClient && matchMedia?.('(pointer: coarse)').matches

  const speaking = ref(false)
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

  // Voice and speed the seller chose.
  const voices = ref<VoiceOption[]>([])
  const voiceName = ref(store.get(VOICE_KEY) || '')
  const rate = ref(Number(store.get(RATE_KEY)) || 1)

  // Live captions: the phrase being spoken and how many of its words have
  // been said. Word timing comes from the browser where it reports it, and
  // is estimated from the speaking rate where it doesn't.
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
  let voice: SpeechSynthesisVoice | null = null

  function loadVoices() {
    if (!canSpeak) return
    const all = window.speechSynthesis.getVoices().filter((v) => scoreVoice(v) >= 0)
    all.sort((a, b) => scoreVoice(b) - scoreVoice(a))
    const top = all[0] ? scoreVoice(all[0]) : 0
    voices.value = all.map((v) => ({
      name: v.name,
      lang: v.lang,
      recommended: scoreVoice(v) === top,
    }))
    voice = all.find((v) => v.name === voiceName.value) || all[0] || null
  }

  if (canSpeak) {
    loadVoices()
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
  }

  function setVoice(name: string) {
    voiceName.value = name
    store.set(VOICE_KEY, name)
    loadVoices()
  }

  function setRate(value: number) {
    rate.value = Math.min(1.25, Math.max(0.8, value))
    store.set(RATE_KEY, String(rate.value))
  }

  function setMuted(value: boolean) {
    muted.value = value
    store.set(MUTE_KEY, value ? '1' : '0')
    if (value) stopSpeaking()
  }

  // ── Soft chimes ──
  let audioCtx: AudioContext | null = null

  // Call from a tap, so the chimes are allowed to play later.
  function unlockAudio() {
    if (!isClient) return
    try {
      audioCtx ||= new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioCtx.state === 'suspended') audioCtx.resume()
    } catch {
      audioCtx = null
    }
  }

  function chime(kind: 'start' | 'stop') {
    if (!audioCtx || muted.value) return
    const notes = kind === 'start' ? [660, 880] : [880, 600]
    const t0 = audioCtx.currentTime
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator()
      const gain = audioCtx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = t0 + i * 0.09
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.05, start + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16)
      osc.connect(gain).connect(audioCtx!.destination)
      osc.start(start)
      osc.stop(start + 0.18)
    })
  }

  // ── Speaking ──
  let speakRun = 0

  function stopSpeaking() {
    speakRun++
    speaking.value = false
    stopWordTimer()
    if (canSpeak) window.speechSynthesis.cancel()
  }

  // Speaks the text and resolves when it has finished, been stopped, or
  // could not be spoken. Resolves true only if it was spoken to the end.
  function speak(text: string): Promise<boolean> {
    stopSpeaking()
    const clean = (text || '').replace(/\s+/g, ' ').trim()
    // Muted or no voice: the caption still shows the whole line
    if (!canSpeak || muted.value || !clean) {
      if (clean) showCaption(clean, true)
      return Promise.resolve(false)
    }
    if (!voice) loadVoices()
    const run = ++speakRun
    const parts = phrases(clean)

    return new Promise((resolve) => {
      let i = 0
      const next = () => {
        if (run !== speakRun) return resolve(false)
        if (i >= parts.length) {
          speaking.value = false
          return resolve(true)
        }
        const shown = parts[i++]
        const u = new SpeechSynthesisUtterance(speakable(shown))
        if (voice) u.voice = voice
        u.lang = voice?.lang || 'en-GB'
        u.rate = rate.value
        u.pitch = 1
        const total = shown.split(/\s+/).filter(Boolean).length
        let boundaries = false
        let ended = false
        // Moves on if the browser never says this phrase ended
        const watchdog = setTimeout(() => finish(), (total / (2.3 * u.rate)) * 1000 + 3500)
        const finish = () => {
          if (ended) return
          ended = true
          clearTimeout(watchdog)
          stopWordTimer()
          if (run === speakRun) captionWords.value = total
          next()
        }
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
        u.onend = () => finish()
        u.onerror = (e: any) => {
          clearTimeout(watchdog)
          if (run !== speakRun) return resolve(false)
          if (e?.error === 'interrupted' || e?.error === 'canceled') return finish()
          speaking.value = false
          stopWordTimer()
          if (e?.error === 'not-allowed') blocked.value = true
          resolve(false)
        }
        // Chrome can leave the queue paused after a tab switch
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
        window.speechSynthesis.speak(u)
      }
      next()
    })
  }

  // Plays a short sample of the chosen voice.
  function preview() {
    return speak("Hi, I'm UMU. This is how I'll sound while we build your passport.")
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
      unlockAudio()
      if (!audioCtx || !listening.value) return stopLevel()
      const source = audioCtx.createMediaStreamSource(micStream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
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

  interface ListenOptions {
    onInterim?: (text: string) => void
    // Quiet time after speech that ends the answer
    endSilenceMs?: number
    // How long to wait for the seller to start talking
    noSpeechMs?: number
    // Longest single answer
    maxMs?: number
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
    if (speaking.value) stopSpeaking()
    // Let the last of UMU's voice fade so it isn't heard as the answer
    await wait(220)
    const { onInterim, endSilenceMs = 1500, noSpeechMs = 9000, maxMs = 25000 } = options

    return new Promise((resolve) => {
      const rec = new SR()
      recognition = rec
      rec.lang = 'en-GB'
      // Android's continuous mode repeats results, and its own end of
      // speech detection is good, so it listens one phrase at a time there.
      rec.continuous = !isAndroid
      rec.interimResults = true
      rec.maxAlternatives = 5

      const finals: string[][] = []
      let interim = ''
      let heardAnything = false
      let settled = false
      let silenceTimer: ReturnType<typeof setTimeout> | null = null
      const timers: ReturnType<typeof setTimeout>[] = []

      const clearTimers = () => {
        if (silenceTimer) clearTimeout(silenceTimer)
        timers.forEach(clearTimeout)
      }
      const stopRec = () => {
        try {
          rec.stop()
        } catch {
          /* already stopped */
        }
      }
      const finish = () => {
        if (settled) return
        settled = true
        clearTimers()
        if (recognition === rec) recognition = null
        listening.value = false
        stopLevel()
        chime('stop')
        // The answer, best reading first, then other readings of the last
        // phrase with the earlier phrases kept as they were
        const lead = finals.slice(0, -1).map((alts) => alts[0]).join(' ')
        const last = finals[finals.length - 1] || []
        let readings = last.map((alt) => `${lead} ${alt}`.trim())
        if (!readings.length && interim) readings = [interim.trim()]
        alternatives.value = [...new Set(readings.filter(Boolean))]
        resolve(alternatives.value[0] || '')
      }

      rec.onstart = () => {
        listening.value = true
        micError.value = ''
        chime('start')
        startLevel()
        timers.push(setTimeout(() => !heardAnything && stopRec(), noSpeechMs))
        timers.push(setTimeout(stopRec, maxMs))
      }
      rec.onresult = (event: any) => {
        heardAnything = true
        interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            const alts: string[] = []
            for (let a = 0; a < result.length; a++) alts.push(result[a].transcript.trim())
            finals.push(alts)
          } else interim += result[0].transcript
        }
        const sofar = [...finals.map((alts) => alts[0]), interim].join(' ').replace(/\s+/g, ' ').trim()
        onInterim?.(sofar)
        // End of the answer: a short quiet spell after the last words
        if (silenceTimer) clearTimeout(silenceTimer)
        silenceTimer = setTimeout(stopRec, endSilenceMs)
      }
      rec.onerror = (e: any) => {
        if (e?.error === 'not-allowed' || e?.error === 'service-not-allowed') micError.value = 'denied'
        else if (e?.error === 'audio-capture') micError.value = 'no-mic'
        else if (e?.error === 'network') micError.value = 'network'
        finish()
      }
      rec.onend = () => finish()
      try {
        rec.start()
      } catch {
        finish()
      }
    })
  }

  function stopListening() {
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
    caption,
    captionWords,
    showCaption,
    listening,
    muted,
    blocked,
    micError,
    level,
    alternatives,
    voices,
    voiceName,
    rate,
    setVoice,
    setRate,
    setMuted,
    unlockAudio,
    prepareMic,
    speak,
    preview,
    stopSpeaking,
    listen,
    stopListening,
    stopAll,
  }
}
