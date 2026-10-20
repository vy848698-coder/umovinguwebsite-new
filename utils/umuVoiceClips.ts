// UMU's pre-recorded lines. Nearly everything UMU says is fixed text: the
// questions, their options, its tips and short replies. Those sentences are
// recorded once, ahead of time, by scripts/build-umu-voice.ts and served as
// plain files from public/umu-voice/, so UMU starts speaking at once instead
// of waiting a second or two for the voice service to make each sentence.
// Anything else (a line with the seller's own words, another voice or speed)
// is still made live by /api/umu-tts.
//
// A clip is named from its voice, speed and exact words, so it is only ever
// played for those words in that voice, and a published file never changes
// (browsers and the CDN can keep it for good).
//
// Shared by the page and the build script, so it imports nothing.

export const UMU_CLIP_DIR = '/umu-voice/clips'
export const UMU_CLIP_MANIFEST = '/umu-voice/manifest.json'

export interface UmuClipManifest {
  // voice|rate the clips were made with, for the build script's records
  voices: string[]
  clips: string[]
}

// The words exactly as sent to the voice service.
export const clipText = (text: string) => text.replace(/\s+/g, ' ').trim()

// 53-bit string hash (cyrb53) as 14 hex digits: short, and stable across
// the browser and Node.
export function umuClipId(voice: string, rate: number, text: string): string {
  const s = `${voice}|${rate}|${clipText(text)}`
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761)
    h2 = Math.imul(h2 ^ c, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0')
}
