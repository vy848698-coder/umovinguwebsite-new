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
export type VoiceCommand = 'skip' | 'skipQuestion' | 'repeat' | 'stop' | 'save' | null

// Only a short utterance counts as a command, so an answer that happens to
// contain "save" or "next" is still typed in.
export function voiceCommand(said: string): VoiceCommand {
  const w = words(said).trim()
  if (!w || w.split(' ').length > 4) return null
  if (/^(skip (the |this )?question|next question|not now|come back to (this|it)( later)?|later)$/.test(w)) return 'skipQuestion'
  if (/^(skip|skip (this|it|that)( one)?|next|pass|i don t know|don t know|not sure|i m not sure)$/.test(w)) return 'skip'
  if (/^(repeat|again|say (that|it) again|repeat (that|the question)|pardon|what)$/.test(w)) return 'repeat'
  if (/^(stop|stop listening|pause|cancel|that s all)$/.test(w)) return 'stop'
  if (/^(save|save it|save (that|this)|done|i m done|that s it|continue|yes save|ok save|okay save|i ve read (it|this|them)|read it)$/.test(w)) return 'save'
  return null
}

const YES = [' yes ', ' yeah ', ' yep ', ' correct ', ' i am ', ' i do ', ' that s right ']
const NO = [' no ', ' nope ', ' not ', ' i m not ', ' i don t ']

// The option whose label was said; the longest match wins. Yes and No also
// accept everyday ways of saying them.
export function matchOption<T extends { label: string }>(said: string, options: T[]): T | null {
  const heard = words(said)
  let best: T | null = null
  let bestLen = 0
  for (const o of options) {
    const label = words(o.label).trim()
    if (label && heard.includes(` ${label} `) && label.length > bestLen) {
      best = o
      bestLen = label.length
    }
  }
  if (best) return best
  const yes = options.find((o) => words(o.label).trim().startsWith('yes'))
  const no = options.find((o) => words(o.label).trim().startsWith('no'))
  if (no && NO.some((w) => heard.includes(w))) return no
  if (yes && YES.some((w) => heard.includes(w))) return yes
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

// "john at example dot com" -> "john@example.com"
export function spokenEmail(said: string): string {
  return said
    .toLowerCase()
    .replace(/\s+at\s+/g, '@')
    .replace(/\s+dot\s+/g, '.')
    .replace(/\s+/g, '')
}

// "band C", "C", "it's band see" -> "C"
export function spokenLetter(said: string): string | null {
  const t = ` ${said.toLowerCase().replace(/[^a-z ]/g, ' ')} `
  const sounds: Record<string, string> = { see: 'c', sea: 'c', bee: 'b', be: 'b', dee: 'd', gee: 'g', aitch: 'h', eh: 'a', ay: 'a', eff: 'f' }
  const band = t.match(/band\s+([a-z]+)/)
  const token = band ? band[1] : t.trim().split(/\s+/).find((w) => w.length === 1 || w in sounds)
  if (!token) return null
  const letter = token.length === 1 ? token : sounds[token]
  return letter && /^[a-h]$/.test(letter) ? letter.toUpperCase() : null
}
