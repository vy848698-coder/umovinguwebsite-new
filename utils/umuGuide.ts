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

// Part descriptions count too: the last three guarantee questions share one
// title and only their part description ("Roofing", "Underpinning") differs.
const has = (q: Q, re: RegExp) => {
  const parts = Array.isArray(q.parts) ? q.parts.flatMap((p: Q) => [p?.title || '', p?.description || '']) : []
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
      // UMU then reads out the address we found and asks the seller to
      // confirm it, or asks them to type it when none was found
      say: "Let's make sure we have the right property.",
      tip: 'Confirm the address we found, or change it if it is not right. Use the full address, including the postcode.',
    },
  },
  {
    match: (q) => has(q, /full names? of the seller/i),
    guide: {
      say: 'I need the full name of everyone named as owner on the title deeds, exactly as written. Then whether you are the owner yourself.',
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
    match: (q) => has(q, /what we love/i),
    guide: {
      say: 'Tell buyers what you love about your home and the area. Pick the ones that fit or add your own, then set each slider.',
      tip: 'Honest details, like bin days or school run traffic, help buyers trust everything else you say.',
    },
  },
  {
    match: (q) => has(q, /type of property you are selling/i),
    guide: {
      say: 'Tell me what kind of home it is, like detached, terraced or a flat. Then the bedrooms and bathrooms, and any special features.',
      tip: 'Pick every feature that applies. You can change these later.',
    },
  },
  {
    match: (q) => has(q, /service charge/i),
    guide: {
      say: 'Your lease sets out the service charge. Tell me how often you pay it and how much, then upload a recent statement.',
      tip: 'The amount and how often you pay are on your latest service charge demand.',
    },
  },
  {
    // \b, so "please" in any other question's wording is not a lease
    match: (q) => has(q, /\blease/i),
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

// Boundaries, Disputes and Complaints, Notices and Proposals. Most of these
// are a Yes or No that opens a details box on Yes, so "say" puts the long
// question in plain words and "tip" says what to write if the answer is Yes.
// UMU then adds "Tap Yes or No" (or "You can say Yes or No") itself.
const NEIGHBOURS: { match: (q: Q) => boolean; guide: Guide }[] = [
  {
    match: (q) => (q.type || '').toLowerCase() === 'boundary',
    guide: {
      say: 'Picture your home from the road. For each side, left, right, rear and front, choose who looks after the fence, wall or hedge.',
      tip: 'The T marks on your title plan show who owns each boundary. Choose Unknown for any side you are not sure about.',
    },
  },
  {
    match: (q) => has(q, /boundaries irregular/i),
    guide: {
      say: "Put simply, does the boundary follow an unusual line, rather than a straight or obvious one? If yes, I'll ask you to describe it.",
      tip: 'If yes, describe where the boundary runs, using landmarks or measurements, or upload a plan that shows it.',
    },
  },
  {
    match: (q) => has(q, /boundary feature having been moved/i),
    guide: {
      say: 'Put simply, has any fence, wall or hedge been moved in the last 10 years?',
      tip: 'If yes, say what was moved, when, and roughly how far. Photos or a sketch help.',
    },
  },
  {
    match: (q) => has(q, /adjacent land/i),
    guide: {
      say: "Put simply, have you bought any land or property next door while you've owned this home?",
      tip: 'If yes, add the address, the title number or a description of the extra land.',
    },
  },
  {
    match: (q) => has(q, /overhang|project under/i),
    guide: {
      say: 'Put simply, does any part of your home stick out over, or under, the boundary? Like roof eaves, or a cellar under the pavement.',
      tip: 'If yes, say what it is, where it is and roughly how big. Add any permission you have for it.',
    },
  },
  {
    match: (q) => has(q, /party wall/i),
    guide: {
      say: 'A party wall notice is a formal letter a neighbour sends before building work on a shared wall or boundary. Have you had one?',
      tip: 'If yes, say what the work was, who sent the notice, when, and whether the work is finished.',
    },
  },
  {
    match: (q) => has(q, /disputes or complaints regarding/i),
    guide: {
      say: 'Put simply, have there been any disagreements or complaints about this home, or one nearby? For example about noise, parking or boundaries.',
      tip: "If yes, say what it was about, who was involved, when it happened, and whether it's settled or still going on.",
    },
  },
  {
    match: (q) => has(q, /might lead to a dispute/i),
    guide: {
      say: 'Put simply, do you know of anything that could cause a disagreement in future, about this home or one nearby?',
      tip: 'If yes, say what the issue is, who it involves, and anything already done about it.',
    },
  },
  {
    match: (q) => has(q, /notices or correspondence/i),
    guide: {
      say: 'Put simply, have you sent or received any letters or notices, or had talks with a neighbour, the council or the government, about something that affects this home or one nearby?',
      tip: 'For example planning or enforcement notices, party wall letters, tree preservation orders or roadworks. If yes, say what it was and when.',
    },
  },
  {
    match: (q) => has(q, /proposals to develop/i),
    guide: {
      say: 'Put simply, do you know of any plans to build on, or change, land or buildings nearby?',
      tip: "For example new housing or an extension next door. Planning notices on lamp posts, or your council's planning website, show these.",
    },
  },
]

// Alterations and Planning, Guarantees and Warranties, Insurance and
// Environmental, matched on the live question wording. Where the question
// is long or legal, "say" puts it in plain words ("Put simply, ..."); where
// it is already short, "say" explains the term and where to find the
// answer, so UMU never just reads the same question twice.
const WARRANTY_TIP =
  'If yes, add the provider, the policy number, the start and end dates and any claims. Upload the certificate if you have it.'

const HOME_WORKS: { match: (q: Q) => boolean; guide: Guide }[] = [
  // ── Alterations and Planning ──
  {
    match: (q) => has(q, /following changes been made/i),
    guide: {
      say: 'There are four kinds of change: building works like an extension, a change of use, new windows or glazed doors since April 2002, and a conservatory. Answer yes or no to each, and add the date for any yes.',
      tip: "Then add your planning permissions, Building Regulations approvals and completion certificates, or say why they weren't needed.",
    },
  },
  {
    match: (q) => has(q, /works disclosed in previous questions unfinished/i),
    guide: {
      say: 'Put simply, is any of that work still not finished?',
      tip: 'If yes, say what is unfinished, where it is, and what is left to do.',
    },
  },
  {
    match: (q) => has(q, /breaches of planning/i),
    guide: {
      say: 'Put simply, do you know of any work that broke the conditions of its planning permission or Building Regulations approval, or that never got every approval it needed?',
      tip: 'If yes, say what the work was, when it was done, and what the problem is.',
    },
  },
  {
    match: (q) => has(q, /building control issues to resolve/i),
    guide: {
      say: "Put simply, is anything still to be sorted out with the council's planning or building control team?",
      tip: "For example a retrospective planning application. Say what it is, what's been done so far and what's still to do.",
    },
  },
  {
    match: (q) => has(q, /solar panels been installed/i),
    guide: {
      say: 'Do you have solar panels? If yes, add the date they were fitted.',
      tip: 'The date is on your installation papers, guarantee or energy statements.',
    },
  },
  {
    match: (q) => has(q, /solar panels owned outright/i),
    guide: {
      say: 'Put simply, do the panels belong to you? Say no if a solar company owns them, or rents your roof space for them.',
      tip: 'Your purchase invoice, or any agreement with the solar company, shows who owns them.',
    },
  },
  {
    match: (q) => has(q, /long lease of the roof/i),
    guide: {
      say: 'Put simply, has a solar company been given a long lease of your roof, or the space above it, for its panels?',
      tip: "If yes, upload the agreement, recent electricity bills or tariff payments, and the company's contact details.",
    },
  },
  {
    match: (q) => has(q, /listed building/i),
    guide: {
      say: 'A listed building is on the National Heritage List because of its history or architecture.',
      tip: "Historic England's website can confirm it. If yes, upload the listing confirmation and any consent for works.",
    },
  },
  {
    match: (q) => has(q, /conservation area/i),
    guide: {
      say: 'A conservation area is where the council protects the look of the neighbourhood with extra planning rules.',
      tip: "Your council's planning website has a map. If yes, upload the confirmation and any consents or conditions.",
    },
  },
  {
    match: (q) => has(q, /terms of the order been complied/i),
    guide: {
      say: "Put simply, have you only done work on the protected trees with the council's permission, and followed its conditions?",
      tip: 'If yes, upload any applications, consent letters, or proof of replanting.',
    },
  },
  {
    match: (q) => has(q, /tree preservation order/i),
    guide: {
      say: 'A Tree Preservation Order is a council order that protects a tree, so it cannot be cut back or removed without permission.',
      tip: 'You would usually know from your purchase paperwork, or a letter from the council.',
    },
  },

  // ── Guarantees and Warranties ──
  {
    match: (q) => has(q, /new home guarantees/i),
    guide: {
      say: 'A new home warranty, from NHBC, Premier Guarantee or similar, usually covers the structure for 10 years after the home is built.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /damp proofing guarantees/i),
    guide: {
      say: 'This is a certificate from the company that treated damp in your home.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /timber treatment guarantees/i),
    guide: {
      say: 'This is a certificate from a company that treated woodworm or rot in the timbers.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /windows, roof lights/i),
    guide: {
      say: 'This is the guarantee from the company that fitted new windows, roof lights or glazed doors.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /electrical work guarantees/i),
    guide: {
      say: 'This covers electrical work like rewiring, a new fuse box or new circuits. The electrician gives it when the work is finished.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /guarantee|warrant/i) && has(q, /roofing/i),
    guide: {
      say: 'This covers a roof that was replaced or repaired, including a flat roof.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /guarantee|warrant/i) && has(q, /central heating/i),
    guide: {
      say: 'This covers your boiler or heating system, gas, electric, oil or a heat pump. The installer or the maker gives it.',
      tip: WARRANTY_TIP,
    },
  },
  {
    match: (q) => has(q, /guarantee|warrant/i) && has(q, /underpinning/i),
    guide: {
      say: 'Underpinning is work to strengthen the foundations, often after subsidence.',
      tip: WARRANTY_TIP,
    },
  },

  // ── Insurance ──
  {
    match: (q) => has(q, /does the seller insure the property/i),
    guide: {
      say: "This means buildings insurance you pay for yourself, covering things like fire or flood. If not, I'll ask why.",
      tip: "If you don't insure it, for example because the landlord insures the building, say so.",
    },
  },
  {
    match: (q) => has(q, /landlord insure the building/i),
    guide: {
      say: 'In many flats the landlord or freeholder insures the whole building, and the cost is part of the service charge.',
      tip: 'Your lease or service charge statement shows who insures the building.',
    },
  },
  {
    match: (q) => has(q, /abnormal rise in premiums/i),
    guide: {
      say: 'Put simply, has the price of your buildings insurance ever gone up by much more than usual?',
      tip: 'A big jump can follow a claim, or a risk such as flooding.',
    },
  },
  {
    match: (q) => has(q, /subject to high excesses/i),
    guide: {
      say: 'Put simply, has your buildings insurance ever had an unusually high excess? That is the amount you pay yourself towards a claim.',
      tip: 'Your policy schedule shows the excess.',
    },
  },
  {
    match: (q) => has(q, /subject to unusual conditions/i),
    guide: {
      say: 'Put simply, has your buildings insurance ever come with unusual conditions, like extra rules or things it would not cover?',
      tip: 'These are listed in your policy schedule as conditions, endorsements or exclusions.',
    },
  },
  {
    match: (q) => has(q, /insurance .*ever been refused/i),
    guide: {
      say: 'Put simply, has an insurer ever refused to give you buildings insurance for this home?',
      tip: 'This only means buildings insurance taken out by you.',
    },
  },
  {
    match: (q) => has(q, /made any buildings insurance claims/i),
    guide: {
      say: "Have you ever claimed on your buildings insurance for this home? If yes, I'll ask for the details.",
      tip: 'Say what each claim was for, roughly when, and what the outcome was.',
    },
  },

  // ── Environmental ──
  {
    match: (q) => has(q, /ever been flooded/i),
    guide: {
      say: 'This includes the house, the garden and any land, even if it flooded only once.',
      tip: 'Flooding can come from a river, the sea, heavy rain, groundwater or drains. If yes, say when it happened and which parts flooded.',
    },
  },
  {
    match: (q) => has(q, /flood risk report/i),
    guide: {
      say: 'That is a report from a specialist on how likely your home is to flood. If you have one, upload a copy.',
      tip: 'You can check the flood risk for any address on GOV.UK.',
    },
  },
  {
    match: (q) => has(q, /radon test/i),
    guide: {
      say: 'Radon is a natural gas that can rise from the ground. If your home was tested for it, upload the result.',
      tip: 'The result is a letter or report from the testing company.',
    },
  },
  {
    match: (q) => has(q, /recommended action level/i),
    guide: {
      say: 'Your radon result letter says whether the level was below the recommended action level.',
      tip: 'Below the action level means no work was recommended.',
    },
  },
  {
    match: (q) => has(q, /remedial measures/i),
    guide: {
      say: 'Put simply, when your home was built, was anything added to keep radon gas out, like a barrier under the floor?',
      tip: "A new home's paperwork, or your survey, may mention a radon barrier or sump.",
    },
  },
  {
    match: (q) => has(q, /copy of the EPC/i),
    guide: {
      say: 'Upload your Energy Performance Certificate. If you do not have it, you can download it free from GOV.UK.',
      tip: 'Tap the upload box and choose the file.',
    },
  },
  {
    match: (q) => has(q, /green deal/i),
    guide: {
      say: 'The Green Deal was a scheme where energy improvements, like insulation or solar panels, were paid back through the electricity bill. Was anything in your home paid for that way?',
      tip: 'If yes, list each installation and upload your latest electricity bill, which shows the Green Deal charge.',
    },
  },
  {
    match: (q) => has(q, /japanese knotweed/i),
    guide: {
      say: 'Japanese knotweed is a fast growing plant with hollow, bamboo like stems that can damage buildings.',
      tip: "If yes, say whether there's a treatment plan in place, and upload it with any insurance that backs it.",
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
      // UMU then says which end is which ("between Quiet and Loud")
      return { say: '', tip: 'Drag the slider, or press the mic and say it.' }
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
  // Notes are matched by the Ownership notes guide, so the more specific
  // lists go first. HOME_WORKS goes before OWNERSHIP, whose /\blease/ and
  // /photo/ would otherwise catch the solar roof lease and the EPC upload.
  const hit =
    NEIGHBOURS.find((g) => g.match(question)) ||
    HOME_WORKS.find((g) => g.match(question)) ||
    OWNERSHIP.find((g) => g.match(question))
  return hit ? hit.guide : typeGuide(type)
}

// Notes left in some help texts for the content team ("- please remove text
// answer yes or no") are cut off, so the seller never sees them
export function cleanHelpText(text: unknown): string {
  return String(text ?? '')
    .replace(/\s*-?\s*(also bottom bit is wrong|please remove|remove please)\b[\s\S]*$/i, '')
    .trim()
}

// An option as UMU says it: "Yes, select year" is "Yes", "Other, specify
// below" is "Other"
export function optionSaid(label: string): string {
  return String(label || '')
    .trim()
    .replace(/,\s*(please\s+)?(select|enter|choose|add|specify|state)\b.*$/i, '')
}

// "Go to boundaries", "let's do disputes": switching section by voice. A
// verb is required, so an answer that simply mentions boundaries or a
// dispute is still typed in as an answer.
const SECTION_WORDS: [string, RegExp][] = [
  ['ownershipProfile', /^(the )?(ownership( profile)?)( section)?$/],
  ['boundaries', /^(the )?(boundaries|boundary)( section)?$/],
  ['disputesAndComplaints', /^(the )?(disputes?( and complaints)?|complaints)( section)?$/],
  ['noticesAndProposals', /^(the )?(notices?( and proposals)?|proposals)( section)?$/],
  ['alterationsAndPlanning', /^(the )?(alterations?( and planning)?|planning)( section)?$/],
  ['guaranteesAndWarranties', /^(the )?(guarantees?( and warranties)?|warrant(y|ies))( section)?$/],
  ['insurance', /^(the )?insurance( section)?$/],
  ['environmental', /^(the )?environment(al)?( matters)?( section)?$/],
]

export function sectionCommand(said: string): string | null {
  const w = words(said).trim().replace(/^(umu |please |ok |okay |um |er )+/, '')
  const m = w.match(/^(go to|go back to|switch to|move to|move on to|take me to|open|start|let s do|let s go to|do|i want to do|can we do)\s+(.+)$/)
  if (!m) return null
  const hit = SECTION_WORDS.find(([, re]) => re.test(m[2].trim()))
  return hit ? hit[0] : null
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

// Every option the seller named, for tick boxes where several can be
// chosen ("river and surface water"). A word only one option has counts on
// its own ("river" for River flooding); words most options share, like
// "flooding", do not.
export function matchOptions<T extends { label: string }>(said: string | string[], options: T[]): T[] {
  const readings = (Array.isArray(said) ? said : [said]).filter(Boolean)
  const tokensOf = (label: string) =>
    words(optionSaid(label)).trim().split(' ').filter((t) => t.length > 2 && !STOP.has(t))
  const counts = new Map<string, number>()
  options.forEach((o) => new Set(tokensOf(o.label)).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)))
  for (const reading of readings) {
    const heard = words(reading)
    const hits = options.filter(
      (o) =>
        scoreOption(heard, optionSaid(o.label)) > 0 ||
        tokensOf(o.label).some((t) => counts.get(t) === 1 && heard.includes(` ${t} `)),
    )
    if (hits.length) return hits
  }
  const one = matchOption(readings, options)
  return one ? [one] : []
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
