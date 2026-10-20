// Pre-records every fixed sentence UMU says, in its default voice and speed,
// so the assistant speaks at once instead of waiting a second or two for
// the voice service to make each sentence, and keeps talking even when
// that service is down. See utils/umuVoiceClips.ts.
//
//   npm run voice:build
//
// Reads scripts/umu-voice/lines.txt: one sentence per line, exactly as the
// page sends it to /api/umu-tts. Writes public/umu-voice/clips/<id>.mp3 and
// public/umu-voice/manifest.json. Sentences already recorded are skipped
// and clips no longer listed are deleted, so re-run it after changing the
// default voice or speed, or after adding lines.
//
// To collect new lines (new questions, new wording), run the app with
//   UMU_VOICE_LOG=scripts/umu-voice/lines.txt npm run dev
// and go through the assistant: every line UMU still makes live is added.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_UMU_VOICE, DEFAULT_UMU_RATE } from '../utils/umuVoices.ts'
import { clipText, umuClipId, type UmuClipManifest } from '../utils/umuVoiceClips.ts'
import { edgeSpeak } from '../server/utils/edgeVoice.ts'

const ROOT = process.cwd()
const LINES = join(ROOT, 'scripts', 'umu-voice', 'lines.txt')
const OUT = join(ROOT, 'public', 'umu-voice')
const CLIPS = join(OUT, 'clips')
const WORKERS = 3

const voice = DEFAULT_UMU_VOICE
const rate = DEFAULT_UMU_RATE

// The same limit as /api/umu-tts: longer lines are split by the page
const MAX_CHARS = 600
const lines = [
  ...new Set(
    readFileSync(LINES, 'utf8')
      .split(/\r?\n/)
      .map(clipText)
      .filter((l) => l && l.length <= MAX_CHARS && /\p{L}{2}/u.test(l)),
  ),
].sort((a, b) => a.localeCompare(b))
// Keep the list tidy: sorted, one copy of each
writeFileSync(LINES, lines.join('\n') + '\n')

mkdirSync(CLIPS, { recursive: true })
const ids = new Map(lines.map((l) => [umuClipId(voice, rate, l), l]))
const todo = [...ids].filter(([id]) => !existsSync(join(CLIPS, `${id}.mp3`)))
console.log(`${voice} at ${rate}: ${ids.size} sentences, ${todo.length} to record`)

const failed: string[] = []
let done = 0
async function worker() {
  for (let job = todo.shift(); job; job = todo.shift()) {
    const [id, text] = job
    try {
      // Edge drops a connection now and then
      let bytes: Buffer | null = null
      for (let attempt = 0; !bytes; attempt++) {
        try {
          bytes = await edgeSpeak(voice, text, rate)
        } catch (err) {
          // Microsoft rate-limits a long run (429): back off and try again
          if (attempt >= 5) throw err
          await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)))
        }
      }
      writeFileSync(join(CLIPS, `${id}.mp3`), bytes)
    } catch (err) {
      failed.push(`${text}  (${(err as Error).message})`)
    }
    if (++done % 50 === 0) console.log(`  ${done} recorded`)
  }
}
await Promise.all(Array.from({ length: WORKERS }, worker))

let removed = 0
for (const f of readdirSync(CLIPS)) {
  if (!ids.has(f.replace(/\.mp3$/, ''))) {
    rmSync(join(CLIPS, f))
    removed++
  }
}
if (failed.length) console.error(`${failed.length} failed (the page makes these live):\n  ${failed.join('\n  ')}`)

const clips = [...ids.keys()].filter((id) => existsSync(join(CLIPS, `${id}.mp3`))).sort()
const manifest: UmuClipManifest = { voices: [`${voice}|${rate}`], clips }
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest))
const bytes = clips.reduce((n, id) => n + readFileSync(join(CLIPS, `${id}.mp3`)).length, 0)
console.log(`manifest written: ${clips.length} clips, ${(bytes / 1048576).toFixed(1)} MB, ${removed} old clips removed`)
