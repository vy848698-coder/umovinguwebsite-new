// UMU's voices: Microsoft Edge's neural read-aloud voices, free and with no
// key. Shared by the /api/umu-tts route (which only speaks with these), the
// voice picker on the assistant page and scripts/build-umu-voice.ts, which
// pre-records UMU's fixed lines in the default voice.

export interface UmuVoice {
  id: string
  name: string
  note: string
}

// Male voices only (client request, 2026-10-09: the female voice sounded
// too soft). Andrew first (2026-10-20): the British voices were too heavy
// an accent for many sellers to follow; the user picked Andrew, warm and
// confident, from the voice samples.
//
// English-only voices, never the "Multilingual" ones: those guess the
// language of each sentence and said "Saved, plus 50 points." as if it
// were French ("plus"), heard back as "Summit priestess pullout". The free
// service refuses SSML that would pin the language, so the English-only
// Andrew (same persona: warm, confident) is used instead.
export const UMU_VOICES: UmuVoice[] = [
  { id: 'en-US-AndrewNeural', name: 'Andrew', note: 'American, warm' },
  { id: 'en-IN-PrabhatNeural', name: 'Prabhat', note: 'Indian, clear' },
  { id: 'en-US-BrianNeural', name: 'Brian', note: 'American, relaxed' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', note: 'British, clear' },
  { id: 'en-GB-ThomasNeural', name: 'Thomas', note: 'British, steady' },
  { id: 'en-IE-ConnorNeural', name: 'Connor', note: 'Irish, friendly' },
]

export const DEFAULT_UMU_VOICE = UMU_VOICES[0].id

// Speaking speed as a multiplier. Andrew's own pace (about 187 words a
// minute) is already an easy conversational one, as in the sample the user
// chose, so UMU speaks at it. The pre-recorded lines use this speed.
export const DEFAULT_UMU_RATE = 1
export const MIN_UMU_RATE = 0.8
export const MAX_UMU_RATE = 1.25
export const UMU_RATE_STEP = 0.05
