// One sentence in one of UMU's voices, from Microsoft Edge's read-aloud
// service: the same neural voices as Azure, free and without a key. It is
// unofficial and can change without notice (on 2026-10-13 Microsoft moved
// it and msedge-tts 2.0.9 was refused until 2.1.0), which is one more reason
// UMU's fixed lines are pre-recorded.
//
// Used by /api/umu-tts and by scripts/build-umu-voice.ts, so the live and
// the pre-recorded clips are made exactly the same way. Imports nothing
// from Nuxt for that reason.

import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const TIMEOUT_MS = 15000

export async function edgeSpeak(voice: string, text: string, rate: number): Promise<Buffer> {
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
