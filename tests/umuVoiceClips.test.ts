import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { umuClipId, clipText, type UmuClipManifest } from '../utils/umuVoiceClips'
import { DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE, UMU_VOICES, MIN_UMU_RATE, MAX_UMU_RATE, UMU_RATE_STEP } from '../utils/umuVoices'

// The page and scripts/build-umu-voice.ts must name a clip the same way,
// or every pre-recorded line would be made live again.
describe('pre-recorded clip names', () => {
  it('stay the same as the recorded files', () => {
    expect(umuClipId('en-IN-PrabhatNeural', 1.2, 'Saved.')).toBe('0170057c876032')
  })

  it('ignore spacing, as the voice route does', () => {
    expect(umuClipId(DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE, '  Saved,\n plus   50 points. ')).toBe(
      umuClipId(DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE, 'Saved, plus 50 points.'),
    )
    expect(clipText(' a \n b ')).toBe('a b')
  })

  it('differ by voice, speed and words', () => {
    const base = umuClipId(DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE, 'Saved.')
    expect(umuClipId('en-GB-RyanNeural', DEFAULT_UMU_RATE, 'Saved.')).not.toBe(base)
    expect(umuClipId(DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE + 0.1, 'Saved.')).not.toBe(base)
    expect(umuClipId(DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE, 'Saved!')).not.toBe(base)
    expect(base).toMatch(/^[0-9a-f]{14}$/)
  })
})

describe('UMU voice settings', () => {
  it('default to Andrew, a voice the route accepts, at a speed the slider can reach', () => {
    expect(DEFAULT_UMU_VOICE).toBe('en-US-AndrewNeural')
    // Multilingual voices guess the language per sentence and got it wrong
    expect(UMU_VOICES.some((v) => /Multilingual/.test(v.id))).toBe(false)
    expect(UMU_VOICES.some((v) => v.id === DEFAULT_UMU_VOICE)).toBe(true)
    expect(DEFAULT_UMU_RATE).toBeGreaterThanOrEqual(MIN_UMU_RATE)
    expect(DEFAULT_UMU_RATE).toBeLessThanOrEqual(MAX_UMU_RATE)
    const steps = (DEFAULT_UMU_RATE - MIN_UMU_RATE) / UMU_RATE_STEP
    expect(Math.abs(steps - Math.round(steps))).toBeLessThan(1e-9)
  })

  it('has every listed clip on disk, recorded in the default voice', () => {
    const dir = join(__dirname, '..', 'public', 'umu-voice')
    const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')) as UmuClipManifest
    expect(manifest.voices).toEqual([`${DEFAULT_UMU_VOICE}|${DEFAULT_UMU_RATE}`])
    expect(manifest.clips.length).toBeGreaterThan(900)
    for (const id of manifest.clips) expect(existsSync(join(dir, 'clips', `${id}.mp3`))).toBe(true)
  })
})
