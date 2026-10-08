// What UMU says and shows for each passport question, and the helpers that
// turn speech into field values.
//
// Questions are recognised by their wording (ids differ per passport). The
// Ownership Profile questions have their own guidance; anything else gets
// guidance built from its answer type. Guidance only explains how to answer
// and where the information is usually found. It never gives legal advice.

type Q = Record<string, any>

export interface Guide {
  // Spoken after the question is read out. Short, so UMU stays quick.
  say: string
  // Shown under the question in UMU's speech bubble.
  tip: string
}

const has = (q: Q, re: RegExp) => {
  const parts = Array.isArray(q.parts) ? q.parts.map((p: Q) => p?.title || '') : []
  return re.test([q.question, q.title, q.description, ...parts].join(' '))
}

// Ownership Profile, in the order the section asks them.
const OWNERSHIP: { match: (q: Q) => boolean; guide: Guide }[] = [
  {
    match: (q) => (q.type || '').toLowerCase() === 'note',
    guide: {
      say: "Before we start, please read these notes. Press the mic and I'll read them to you, then tap I've read this.",
      tip: "Read the notes below, then tap I've read this.",
    },
  },
  {
    match: (q) => has(q, /address of the property/i),
    guide: {
      say: 'Check the address we found, or start typing it and pick it from the list.',
      tip: 'Use the full address, including the postcode.',
    },
  },
  {
    match: (q) => has(q, /full names? of the seller/i),
    guide: {
      say: 'Tell me the full name of everyone named as owner on the title deeds, exactly as written. Then tell me if you are the owner.',
      tip: 'Use the names exactly as they appear on the HM Land Registry title or deeds. Add each seller separately.',
    },
  },
  {
    match: (q) => has(q, /on (the )?behalf of the seller/i),
    guide: {
      say: 'If you are filling this in for someone else, choose how. For example, power of attorney or as a trustee.',
      tip: 'If the seller is a company, add its name, registration number, a director and the country it is registered in.',
    },
  },
  {
    match: (q) => has(q, /solicitor/i),
    guide: {
      say: "Add your solicitor's details. You'll find them on their letter or email to you. If you haven't chosen one yet, say skip question.",
      tip: "The firm name, contact, address, email and your reference are usually on the solicitor's first letter.",
    },
  },
  {
    match: (q) => has(q, /photo/i) || (q.type || '').toLowerCase() === 'upload',
    guide: {
      say: 'Add a few good photos of your home. Tap the upload box to choose them from your device.',
      tip: 'Bright, tidy photos of the front, kitchen and living room work best.',
    },
  },
  {
    match: (q) => has(q, /council tax band/i),
    guide: {
      say: 'Your band is on your latest council tax bill, or on the GOV.UK website. Move the slider, or just say the letter, like band C.',
      tip: 'Council tax bands run from A to H in England.',
    },
  },
  {
    match: (q) => has(q, /asking price/i),
    guide: {
      say: 'Type the amount in the box, or tell me, for example, three hundred and fifty thousand pounds.',
      tip: 'You can change this later if your agent suggests a different price.',
    },
  },
  {
    match: (q) => has(q, /type of (the )?ownership/i),
    guide: {
      say: 'Choose the type of ownership, or say it. You will find it on your title deeds.',
      tip: 'Most houses are freehold and most flats are leasehold. Check your title deeds if you are not sure.',
    },
  },
  {
    match: (q) => has(q, /shared ownership/i),
    guide: {
      say: 'Tell me the percentage you own, and the rent you pay each year on the rest.',
      tip: 'Both figures are on your shared ownership lease or your housing association statement.',
    },
  },
  {
    match: (q) => has(q, /lease/i),
    guide: {
      say: 'You will find these lease details on your lease or title deeds. Fill in what you know.',
      tip: 'If something does not apply to your lease, leave it empty.',
    },
  },
  {
    match: (q) => has(q, /commonhold/i),
    guide: {
      say: 'Add the commonhold details you have. The commonhold community statement has most of them.',
      tip: 'Your solicitor can give you a copy of the commonhold community statement.',
    },
  },
]

function typeGuide(type: string): Guide {
  switch (type) {
    case 'radio':
    case 'single_choice':
    case 'chips':
      return { say: 'Choose the answer that fits, or just say it.', tip: 'Tap an answer, or press the mic and say it.' }
    case 'checkbox':
    case 'multiple_choice':
      return { say: 'Choose all that apply.', tip: 'Tap every answer that applies.' }
    case 'date':
      return { say: 'Fill in the details, or press the mic and tell me.', tip: 'Tap a box to type, or press the mic and say it.' }
    case 'scale':
      return { say: 'Move the slider to your answer, or say it.', tip: 'Drag the slider, or press the mic and say it.' }
    case 'upload':
      return { say: 'Tap the upload box to add a file from your device.', tip: 'PDFs and photos both work.' }
    case 'multifieldform':
    case 'multipart':
      return {
        say: 'Fill in each box. Or press the mic and I will go through them with you, one by one.',
        tip: 'Tap a box to type, or press the mic and I will ask for each one.',
      }
    default:
      return { say: 'Type your answer, or press the mic and say it.', tip: 'Tap the box to type, or press the mic and say it.' }
  }
}

export function guideFor(question: Q, type: string): Guide {
  const hit = OWNERSHIP.find((g) => g.match(question))
  return hit ? hit.guide : typeGuide(type)
}

// ── Speech helpers ──────────────────────────────────────────────────

const words = (s: unknown) =>
  ` ${String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `

// skip moves past one box; skipQuestion leaves the whole question for later.
export type VoiceCommand = 'skip' | 'skipQuestion' | 'back' | 'repeat' | 'stop' | 'save' | null

// Only a short utterance counts as a command, so an answer that happens to
// contain "save" or "next" is still typed in.
export function voiceCommand(said: string): VoiceCommand {
  const w = words(said).trim().replace(/^(umu |please |ok |okay |um |er )+/, '')
  if (!w || w.split(' ').length > 5) return null
  if (/^(go back|back|previous( question)?|last question|go to the last question)$/.test(w)) return 'back'
  if (/^(skip (the |this )?question|next question|move on|not now|come back to (this|it)( later)?|later|skip this one for now)$/.test(w)) return 'skipQuestion'
  if (/^(skip|skip (this|it|that)( one)?|next|pass|i don t know|don t know|no idea|not sure|i m not sure|i m not certain)$/.test(w)) return 'skip'
  if (/^(repeat|again|say (that|it) again|repeat (that|the question|please)|pardon|sorry|what|what was that|come again)$/.test(w)) return 'repeat'
  if (/^(stop|stop listening|pause|cancel|that s all|be quiet|quiet)$/.test(w)) return 'stop'
  if (/^(save|save it|save (that|this)|done|i m done|all done|that s it|that s all done|continue|yes save|ok save|okay save|save and continue|i ve read (it|this|them)|read it|finished)$/.test(w)) return 'save'
  return null
}

const NUM_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8',
  nine: '9', ten: '10', eleven: '11', twelve: '12', single: '1', double: '2', twin: '2',
}
const ORDINALS: Record<string, number> = {
  first: 0, second: 1, third: 2, fourth: 3, fifth: 4, sixth: 5, seventh: 6, eighth: 7, ninth: 8, tenth: 9,
}
const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'to', 'it', 'is', 'my', 'our', 'we', 'its', 'with', 'for', 'per'])

// Number words to digits, so "three bedrooms" matches a "3 bedrooms" label.
const withDigits = (s: string) =>
  s.replace(/ (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|single|double|twin)(?= )/g, (_, n) => ` ${NUM_WORDS[n]}`)

const YES = [' yes ', ' yeah ', ' yep ', ' yup ', ' correct ', ' i am ', ' i do ', ' that s right ', ' that is right ', ' sure ', ' absolutely ', ' of course ', ' definitely ', ' affirmative ', ' it is ', ' we are ', ' we do ']
const NO = [' no ', ' nope ', ' nah ', ' not ', ' i m not ', ' i don t ', ' we don t ', ' we re not ', ' never ', ' negative ', ' it isn t ']

function scoreOption(heard: string, label: string): number {
  const l = words(label).trim()
  if (!l) return 0
  // Said word for word
  if (heard.includes(` ${l} `)) return 100 + l.length
  const hd = withDigits(heard)
  const ld = ` ${withDigits(` ${l} `).trim()} `
  if (hd.includes(ld)) return 95 + l.length
  // Same letters, different spacing: "free hold" for "Freehold"
  const compact = (x: string) => x.replace(/\s+/g, '')
  if (l.length > 3 && compact(hd).includes(compact(ld))) return 80 + l.length
  // Most of the label's words were said
  const tokens = ld.trim().split(' ').filter((t) => t.length > 1 && !STOP.has(t))
  if (!tokens.length) return 0
  const hits = tokens.filter((t) => hd.includes(` ${t} `) || (t.length > 4 && hd.includes(` ${t.slice(0, -1)}`)))
  const share = hits.length / tokens.length
  // Every word of a longer label said, in any order: as good as word for
  // word, so "a share of the freehold" beats plain "Freehold"
  if (share === 1 && tokens.length >= 2) return 100 + l.length
  return share >= 0.6 ? Math.round(share * 60) + hits.length : 0
}

// The option the seller meant, or null. Takes the answer and any other
// readings of it (best first). Matches whole labels, spacing slips, most
// of a label's words, its position ("the second one", "option 3", "the
// last one") and everyday ways of saying yes and no.
export function matchOption<T extends { label: string }>(said: string | string[], options: T[]): T | null {
  const readings = (Array.isArray(said) ? said : [said]).filter(Boolean)
  for (const reading of readings) {
    const heard = words(reading)
    let best: T | null = null
    let bestScore = 0
    for (const o of options) {
      const sc = scoreOption(heard, o.label)
      if (sc > bestScore) {
        best = o
        bestScore = sc
      }
    }
    if (best) return best
  }
  for (const reading of readings) {
    const heard = words(reading)
    // By position
    const ord = heard.match(/ (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) /)
    if (ord && options[ORDINALS[ord[1]]]) return options[ORDINALS[ord[1]]]
    if (/ (last|final) (one|option) /.test(heard)) return options[options.length - 1] || null
    const num = withDigits(heard).match(/ (?:option|number|choice) (\d+) /)
    if (num && options[+num[1] - 1]) return options[+num[1] - 1]
    // Yes and No in other words
    const yes = options.find((o) => words(o.label).trim().startsWith('yes'))
    const no = options.find((o) => words(o.label).trim().startsWith('no'))
    if (no && NO.some((w) => heard.includes(w))) return no
    if (yes && YES.some((w) => heard.includes(w))) return yes
  }
  return null
}

const SMALL: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
}

// "350,000", "£350k", "three hundred and fifty thousand pounds" -> 350000.
// Returns null if no number was said.
export function spokenNumber(said: string): number | null {
  const t = said.toLowerCase().replace(/,/g, '')
  const digit = t.match(/(\d+(?:\.\d+)?)\s*(k|thousand|m|million)?\b/)
  if (digit) {
    let n = parseFloat(digit[1])
    const unit = digit[2]
    if (unit === 'k' || unit === 'thousand') n *= 1000
    if (unit === 'm' || unit === 'million') n *= 1_000_000
    return n
  }
  let total = 0
  let current = 0
  let seen = false
  for (const w of t.replace(/-/g, ' ').split(/\s+/)) {
    if (w in SMALL) {
      current += SMALL[w]
      seen = true
    } else if (w === 'hundred') {
      current = (current || 1) * 100
      seen = true
    } else if (w === 'thousand') {
      total += (current || 1) * 1000
      current = 0
      seen = true
    } else if (w === 'million') {
      total += (current || 1) * 1_000_000
      current = 0
      seen = true
    }
  }
  return seen ? total + current : null
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

// "31 March 2125", "March 31st 2125", "31/03/2125" -> "2125-03-31".
export function spokenDate(said: string): string | null {
  const t = said.toLowerCase().replace(/(\d+)(st|nd|rd|th)\b/g, '$1')
  const numeric = t.match(/(\d{1,2})[\s/.-](\d{1,2})[\s/.-](\d{4})/)
  let d: number | null = null
  let m: number | null = null
  let y: number | null = null
  if (numeric) {
    d = +numeric[1]
    m = +numeric[2]
    y = +numeric[3]
  } else {
    const mi = MONTHS.findIndex((name) => t.includes(name) || t.includes(name.slice(0, 3) + ' '))
    const year = t.match(/\b(\d{4})\b/)
    const day = t.replace(/\b\d{4}\b/, '').match(/\b(\d{1,2})\b/)
    if (mi >= 0 && year) {
      m = mi + 1
      y = +year[1]
      d = day ? +day[1] : 1
    }
  }
  if (!d || !m || !y || m > 12 || d > 31) return null
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// "john at example dot com" -> "john@example.com". Spelled letters
// ("s a r a h") are joined, and "underscore", "dash" and "hyphen" become
// the symbols.
export function spokenEmail(said: string): string {
  return said
    .toLowerCase()
    .replace(/\s+(at|at sign)\s+/g, '@')
    .replace(/\s+(dot|full stop|point)\s+/g, '.')
    .replace(/\s*underscore\s*/g, '_')
    .replace(/\s*(dash|hyphen)\s*/g, '-')
    .replace(/\s+/g, '')
}

// "oh seven seven double one..." -> "07711..."
export function spokenPhone(said: string): string {
  const t = ` ${said.toLowerCase().replace(/[^a-z0-9+ ]/g, ' ')} `
    .replace(/ (oh|o|zero|nought)(?= )/g, ' 0')
    .replace(/ (one|two|three|four|five|six|seven|eight|nine)(?= )/g, (_, n) => ` ${NUM_WORDS[n]}`)
    .replace(/ (double|triple) (\d)(?= )/g, (_, k, d) => ` ${d.repeat(k === 'double' ? 2 : 3)}`)
  const digits = t.replace(/[^\d+]/g, '')
  return digits.length >= 6 ? digits : said
}

// "c v six six e x" -> "CV6 6EX"; leaves anything else as said.
export function spokenPostcode(said: string): string {
  const joined = ` ${said.toLowerCase()} `
    .replace(/ (one|two|three|four|five|six|seven|eight|nine|zero|oh)(?= )/g, (_, n) => ` ${n === 'oh' ? '0' : NUM_WORDS[n]}`)
    .replace(/\s+/g, '')
    .toUpperCase()
  const m = joined.match(/([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/)
  return m ? `${m[1]} ${m[2]}` : said
}

// An address that ends in a spoken postcode: "12 High Street Coventry c v
// six six e x" -> "12 High Street Coventry CV6 6EX".
export function spokenAddress(said: string): string {
  const parts = said.trim().split(/\s+/)
  // Longest tail first, and only a tail that is wholly a postcode, so no
  // street or town words are swallowed
  for (let take = Math.min(8, parts.length); take >= 1; take--) {
    const compact = parts
      .slice(-take)
      .map((t) => t.toLowerCase())
      .map((t) => (t === 'oh' ? '0' : NUM_WORDS[t] ?? t))
      .join('')
      .toUpperCase()
    const m = compact.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/)
    if (m) return [...parts.slice(0, -take), `${m[1]} ${m[2]}`].join(' ')
  }
  return said
}

// Spelled codes such as references: "a b one two three" -> "AB123".
// Ordinary words are left alone.
export function spokenCode(said: string): string {
  const tokens = said
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t === 'oh' ? '0' : NUM_WORDS[t] ?? t))
  const spelled = tokens.length > 1 && tokens.every((t) => t.length === 1 || /^\d+$/.test(t))
  return spelled ? tokens.join('').toUpperCase() : said
}

// "band C", "C", "it's band see" -> "C"
export function spokenLetter(said: string): string | null {
  const t = ` ${said.toLowerCase().replace(/[^a-z ]/g, ' ')} `
  const sounds: Record<string, string> = { see: 'c', sea: 'c', bee: 'b', be: 'b', dee: 'd', gee: 'g', aitch: 'h', eh: 'a', ay: 'a', eff: 'f' }
  const band = t.match(/band\s+([a-z]+)/)
  const token = band ? band[1] : t.trim().split(/\s+/).find((w) => w.length === 1 || w in sounds)
  if (!token) return null
  const letter = token.length === 1 ? token : sounds[token]
  return letter && /^[a-i]$/.test(letter) ? letter.toUpperCase() : null
}
