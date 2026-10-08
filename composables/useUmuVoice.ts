// UMU's voice for the AI assistant: reads text aloud with the clearest
// English voice the device offers, and listens to the seller.
//
// Speaking uses the browser's speech synthesis. Voices differ by device, so
// the best en-GB voice is picked by name (Edge's "Natural" voices, then
// Google UK English, then Apple's enhanced voices). Text is spoken sentence
// by sentence: Chrome cuts off single utterances longer than about 15
// seconds, and short chunks also start sooner.
//
// Listening uses the browser's speech recognition (en-GB) and reports text
// as it is heard, so it can be typed into a field while the seller talks.
// It is never on while UMU is speaking, so UMU doesn't hear itself.

import { ref } from 'vue'

const MUTE_KEY = 'umu_voice_muted'

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

// Higher is better. Unknown en-GB voices still beat other English ones.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  const lang = (v.lang || '').toLowerCase().replace('_', '-')
  let s = 0
  if (lang === 'en-gb') s += 50
  else if (lang.startsWith('en')) s += 20
  else return -1
  if (name.includes('natural')) s += 40 // Edge neural voices
  if (name.includes('sonia') || name.includes('libby') || name.includes('ryan')) s += 10
  if (name.includes('google uk english female')) s += 30
  else if (name.includes('google uk english')) s += 25
  if (name.includes('enhanced') || name.includes('premium')) s += 25 // Apple
  if (name.includes('serena') || name.includes('kate') || name.includes('daniel')) s += 8
  if (v.localService === false) s += 4
  return s
}

function splitSentences(text: string): string[] {
  // Split after a full stop followed by a space, so "GOV.UK" stays whole
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function useUmuVoice() {
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
  const SR: any =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null
  const canListen = !!SR

  const speaking = ref(false)
  const listening = ref(false)
  const muted = ref(readMuted())
  // The browser refused to speak before the page had a tap (autoplay rule).
  const blocked = ref(false)

  // Live captions: the sentence being spoken and how many of its words have
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

  let voice: SpeechSynthesisVoice | null = null
  let speakRun = 0
  let recognition: any = null

  function pickVoice() {
    if (!canSpeak) return
    const all = window.speechSynthesis.getVoices()
    let best: SpeechSynthesisVoice | null = null
    let bestScore = -1
    for (const v of all) {
      const sc = scoreVoice(v)
      if (sc > bestScore) {
        best = v
        bestScore = sc
      }
    }
    voice = best
  }

  if (canSpeak) {
    pickVoice()
    window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice)
  }

  function setMuted(value: boolean) {
    muted.value = value
    try {
      localStorage.setItem(MUTE_KEY, value ? '1' : '0')
    } catch {
      /* preference just won't persist */
    }
    if (value) stopSpeaking()
  }

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
    const clean = (text || '').trim()
    // Muted or no voice: the caption still shows the whole line
    if (!canSpeak || muted.value || !clean) {
      if (clean) showCaption(clean, true)
      return Promise.resolve(false)
    }
    if (!voice) pickVoice()
    const run = ++speakRun
    const parts = splitSentences(clean)

    return new Promise((resolve) => {
      let i = 0
      const next = () => {
        if (run !== speakRun) return resolve(false)
        if (i >= parts.length) {
          speaking.value = false
          return resolve(true)
        }
        const u = new SpeechSynthesisUtterance(parts[i++])
        if (voice) u.voice = voice
        u.lang = voice?.lang || 'en-GB'
        u.rate = 1.06
        u.pitch = 1
        const sentence = parts[i - 1]
        const total = sentence.split(/\s+/).filter(Boolean).length
        let boundaries = false
        u.onstart = () => {
          if (run !== speakRun) return
          speaking.value = true
          blocked.value = false
          showCaption(sentence, false)
          const started = performance.now()
          wordTimer = setInterval(() => {
            if (boundaries) return
            // About 2.9 words a second at this rate
            const est = Math.floor(((performance.now() - started) / 1000) * 2.9 * u.rate) + 1
            captionWords.value = Math.min(total, est)
          }, 90)
        }
        u.onboundary = (e: any) => {
          if (run !== speakRun || e.name !== 'word') return
          boundaries = true
          captionWords.value = Math.min(total, sentence.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length + 1)
        }
        u.onend = () => {
          stopWordTimer()
          if (run === speakRun) captionWords.value = total
          next()
        }
        u.onerror = (e: any) => {
          if (run !== speakRun) return resolve(false)
          speaking.value = false
          if (e?.error === 'not-allowed') blocked.value = true
          resolve(false)
        }
        window.speechSynthesis.speak(u)
      }
      next()
    })
  }

  interface ListenHandlers {
    onInterim?: (text: string) => void
  }

  // Listens for one answer. Resolves with what was said, or '' if nothing
  // was heard. Partial text arrives through onInterim as the seller talks.
  function listen(handlers: ListenHandlers = {}): Promise<string> {
    stopListening()
    if (!canListen) return Promise.resolve('')
    stopSpeaking()
    return new Promise((resolve) => {
      const rec = new SR()
      recognition = rec
      rec.lang = 'en-GB'
      rec.continuous = false
      rec.interimResults = true
      rec.maxAlternatives = 1
      let finalText = ''
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        if (recognition === rec) recognition = null
        listening.value = false
        resolve(finalText.trim())
      }
      rec.onstart = () => (listening.value = true)
      rec.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript
          if (event.results[i].isFinal) finalText += t + ' '
          else interim += t
        }
        handlers.onInterim?.((finalText + interim).trim())
      }
      rec.onerror = () => finish()
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
    setMuted,
    speak,
    stopSpeaking,
    listen,
    stopListening,
    stopAll,
  }
}
