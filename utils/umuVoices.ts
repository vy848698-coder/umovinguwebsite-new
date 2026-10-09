// UMU's voices: Microsoft Edge's neural read-aloud voices, free and with no
// key. Shared by the /api/umu-tts route (which only speaks with these) and
// the voice picker on the assistant page.

export interface UmuVoice {
  id: string
  name: string
  note: string
}

// Male voices only (client request, 2026-10-09: the female voice sounded
// too soft). Ryan first: a clear, confident British voice.
export const UMU_VOICES: UmuVoice[] = [
  { id: 'en-GB-RyanNeural', name: 'Ryan', note: 'British, clear' },
  { id: 'en-GB-ThomasNeural', name: 'Thomas', note: 'British, steady' },
  { id: 'en-IE-ConnorNeural', name: 'Connor', note: 'Irish, friendly' },
  { id: 'en-US-AndrewMultilingualNeural', name: 'Andrew', note: 'American, warm' },
  { id: 'en-US-BrianMultilingualNeural', name: 'Brian', note: 'American, relaxed' },
  { id: 'en-US-GuyNeural', name: 'Guy', note: 'American, bright' },
]

export const DEFAULT_UMU_VOICE = UMU_VOICES[0].id

// Speaking speed as a multiplier. A little under normal pace by default, so
// the seller can follow each question without rushing.
export const DEFAULT_UMU_RATE = 0.92
export const MIN_UMU_RATE = 0.8
export const MAX_UMU_RATE = 1.12
