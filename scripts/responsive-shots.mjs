// Responsive check: screenshots pages at phone, laptop and big-desktop widths
// in headless Chrome and reports horizontal overflow + console errors.
//
//   node scripts/responsive-shots.mjs <outDir> [widths] [routes] [--auth] [--mock-passport]
//
//   widths  comma list, default 390,768,1366,1920,2560
//   routes  comma list of paths, default "/"
//   --auth           set a placeholder login token first (for auth-gated pages)
//   --mock-passport  answer /__backend passport sections + task questions with
//                    test data, so passport pages render without a real login
//   --no-skip        don't auto-click "Skip" buttons (tour dismissal) - needed
//                    on pages whose own Skip button navigates away (preferences)
//   --scroll         scroll through the page before capturing, so scroll-reveal
//                    sections and lazy images are shown (landing page)
//   --mock-buyer     answer /__backend buyer-passport calls (profile, shares,
//                    verifier access requests, /profile/me) with test data, so
//                    the buyer-profile pages render their filled-in state
//   --mock-dash      answer the dashboard's calls (role, passport, saved /
//                    watched / recently-viewed / for-you properties) with test
//                    data; the role comes from DASH_ROLE=buy|sell|landlord|both
//   --desktop        never emulate a phone: narrow widths render as a shrunk
//                    desktop browser window (no touch, desktop UA metrics)
//
// Needs the dev server on http://localhost:3000 and Chrome installed. Widths
// below 768 are emulated as a touch phone. Each page is captured full-length
// (capped at 3200px) to <outDir>/<route>_<width>.png.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [OUT = 'responsive-shots', widthArg, routeArg, ...flags] = process.argv.slice(2)
const WIDTHS = (widthArg || '390,768,1366,1920,2560').split(',').map(Number)
// Git Bash on Windows rewrites a leading "/path" argument into
// "C:/Program Files/Git/path"; undo that, and accept routes without a slash.
const ROUTES = (routeArg || '/').split(',').map((r) => {
  const m = r.match(/^[A-Za-z]:[\\/].*?[\\/]Git([\\/].*)$/)
  const route = (m ? m[1] : r).replace(/\\/g, '/')
  return route.startsWith('/') ? route : '/' + route
})
const AUTH = flags.includes('--auth')
const MOCK = flags.includes('--mock-passport')
const NO_SKIP = flags.includes('--no-skip')
const SCROLL = flags.includes('--scroll')
const DESKTOP = flags.includes('--desktop')
const MOCK_BUYER = flags.includes('--mock-buyer')
const MOCK_DASH = flags.includes('--mock-dash')
const DASH_ROLE = process.env.DASH_ROLE || 'buy'
const ORIGIN = 'http://localhost:3000'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PORT = 9333
fs.mkdirSync(OUT, { recursive: true })

// ── Passport test data (only used with --mock-passport) ────────────────────
const SECTIONS = [
  ['ownershipProfile', 'Ownership Profile'], ['boundaries', 'Boundaries'],
  ['disputesAndComplaints', 'Disputes and Complaints'], ['noticesAndProposals', 'Notices and Proposals'],
  ['alterationsAndPlanning', 'Alterations and Planning'], ['guaranteesAndWarranties', 'Guarantees and Warranties'],
  ['insurance', 'Insurance'], ['environmental', 'Environmental'],
  ['rightsAndInformalArrangements', 'Rights and Informal Arrangements'], ['parking', 'Parking'],
  ['otherCharges', 'Other Charges'], ['occupiers', 'Occupiers'], ['services', 'Services'],
  ['transactionInformation', 'Transaction Information'], ['fixturesAndFittings', 'Fixtures and Fittings'],
  ['titleDeedsAndPlan', 'Title Deeds and Plan'], ['searches', 'Searches'],
].map(([key, title], si) => ({
  id: `sec-${si + 1}`, key, imageKey: key, title, order: si + 1,
  description: `Details about ${title.toLowerCase()}`,
  tasks: ['Notes', 'Details', 'Documents', 'Summary'].map((t, ti) => ({
    id: `task-${si + 1}-${ti + 1}`, title: t, order: ti + 1,
    description: 'Add the details so we can keep things moving smoothly.',
    totalQuestions: 4, answeredQuestions: si === 0 ? ti : 0, hasPublishRequired: ti === 1,
  })),
}))
const NOTE_Q = {
  id: 'q-note', type: 'NOTE', title: 'Notes', question: 'Notes', points: 100, completed: false, answer: null,
  prewritten: {
    infoCard: { title: 'About this form', description: 'This form is completed by the seller to supply the detailed information and documents relied upon for conveyancing.', sections: [{ title: 'Definitions' }] },
    sellers: ['If you do not know the answer to any question, you must say so.', 'If you later become aware of any information which would alter any replies you have given, you must inform your solicitor immediately.'],
    buyers: ['If the seller gives you, separately from this form, any information concerning the property, you are entitled to rely on it.'],
  },
}
const FORM_Q = {
  id: 'q-form', type: 'MULTIFIELDFORM', title: 'Sellers Solicitor', question: 'Sellers Solicitor', points: 100, completed: false, answer: null,
  fields: ['Name of the Solicitors firm', 'Contact name', 'Enter address', 'Enter email', 'Enter phone number'].map((p, i) => ({ key: `f${i}`, label: p.replace(/^Enter /, ''), placeholder: p })),
}
// ── Buyer passport test data (only used with --mock-buyer) ─────────────────
const NOW = '2026-09-20T10:00:00.000Z'
const BUYER = {
  id: 'bp-1', userId: 'u-1', publicRef: 'UMU-BP-4821', tier: 'VERIFIED', tierPaidAt: NOW,
  idDocumentType: 'passport', idDocumentUrl: null, idVerified: true, idVerifiedAt: NOW,
  fundsType: 'mortgage', fundsAmount: 350000, fundsDocumentUrl: null, fundsReviewStatus: 'approved',
  fundsVerified: true, fundsAmountVerified: 350000, mortgageAipUrl: null, mortgageAipReviewStatus: 'pending',
  mortgageAipVerified: false, amlStatus: 'clear', affordabilityScore: 78, sourceOfFundsJson: null,
  chainPosition: 'ftb', solicitorStatus: 'instructed', timeline: '3-6 months', propertyType: 'house',
  statement: 'First-time buyers with a mortgage in principle, ready to move quickly.',
  signatureData: null, signedName: 'Alex Morgan', signedAt: NOW, completedSteps: 4, strengthScore: 82,
  published: true, publishedAt: NOW, createdAt: NOW, updatedAt: NOW,
}
const ACCESS_REQ = {
  id: 'x1', status: 'PENDING', requestedScopes: ['identity', 'proof_of_deposit', 'source_of_funds'],
  approvedScopes: ['identity', 'proof_of_deposit'], reason: 'Mortgage application for a property you offered on.',
  expiresAt: '2026-10-20T10:00:00.000Z', createdAt: NOW, decidedAt: NOW,
  org: { id: 'o-1', name: 'Harbour Mortgages', legalName: 'Harbour Mortgages Ltd', logoEmoji: null,
    description: 'Independent mortgage broker', fcaNumber: '123456', websiteUrl: 'https://example.com' },
  grant: { id: 'g-1', scopes: ['identity', 'proof_of_deposit'], expiresAt: '2026-10-20T10:00:00.000Z', revokedAt: null, lastUsedAt: null, useCount: 0 },
}
// Buyer view of a seller's passport (/buyer-passport/*): 17 sections, the
// first partly answered. Routes: /buyer-passport/bp-view,
// /buyer-passport/section/sec-11?passportId=bp-view,
// /buyer-passport/section/task/task-11-2?passportId=bp-view&sectionId=sec-11
const BUYER_VIEW = {
  passport: { id: 'bp-view', addressLine: '100, Arbury Avenue', addressLine1: '100, Arbury Avenue', postcode: 'CV6 6EX', type: 'SELLER', city: 'Coventry' },
  property: { estimatedPrice: 173000, epcRating: 'D', epcScore: 67, homeScore: 67, propertyType: 'Terraced', sqft: 850, titleNumber: 'WM123456', yearBuilt: 1930, tenure: 'Freehold' },
  sections: SECTIONS.map((s, si) => ({
    ...s,
    tasks: s.tasks.slice(0, 2).map((t, ti) => ({
      ...t,
      questions: [
        { id: `${t.id}-n`, type: 'NOTE', question: 'Notes' },
        { id: `${t.id}-q`, type: 'TEXT', question: 'Does the seller have to pay any charges relating to the property (excluding any payments such as council tax, utility charges, etc.), for example payments to a management company?',
          answer: si === 0 && ti === 0 ? { answerText: 'No, there are no other charges.' } : null },
      ],
    })),
  })),
}
function buyerMockFor(p) {
  if (/^\/passport\/[^/]+\/buyer-view$/.test(p)) return BUYER_VIEW
  if (/^\/passport\/[^/]+\/(comparables|notes)$/.test(p)) return []
  if (p === '/buyer-profile') return BUYER
  if (p === '/buyer-profile/shares') return []
  if (p === '/buyer-profile/access-requests') return [ACCESS_REQ]
  if (/^\/buyer-profile\/access-requests\/[^/]+$/.test(p)) return ACCESS_REQ
  if (p === '/profile/me') return { id: 'u-1', firstName: 'Alex', lastName: 'Morgan', email: 'alex.morgan@example.com', createdAt: '2025-03-01T10:00:00.000Z' }
  return null
}
// ── Dashboard test data (only used with --mock-dash) ───────────────────────
const PROPS = [
  ['14 Willow Lane', 'Coventry', 'CV5 8HE', 'Semi-detached', 325000, 'C', 72],
  ['7 Harbour Road', 'Bristol', 'BS1 4RN', 'Terraced', 289000, 'D', 61],
  ['Flat 3, 22 Queens Court', 'Leeds', 'LS1 2AB', 'Flat', 214000, 'B', 80],
  ['The Old Rectory, Church Street', 'Stratford-upon-Avon', 'CV37 6HB', 'Detached', 745000, 'E', 55],
].map(([line, city, pc, type, price, epc, hs], i) => ({
  id: `prop-${i + 1}`, propertyId: `prop-${i + 1}`, addressLine: line, addressLine1: line,
  address: `${line}, ${city}`, city, postcode: pc, area: city, propertyType: type, type, tenure: 'Freehold',
  epcScore: epc, estimatedPrice: price, priceDisplay: `£${price.toLocaleString('en-GB')}`, imageUrl: null,
  image: null, passportPublished: i === 0, hasPassport: i === 0, homeScore: hs,
}))
function dashMockFor(p) {
  if (p === '/profile/preferences') return { purpose: [DASH_ROLE] }
  if (p === '/profile/passports') return [{
    id: 'pp-1', type: DASH_ROLE === 'landlord' ? 'LANDLORD' : 'SELLER', propertyId: 'prop-1',
    address: '14 Willow Lane, Coventry', addressLine1: '14 Willow Lane', postcode: 'CV5 8HE',
    completionPercentage: 46, status: 'DRAFT', homeScore: 72, homeScorePotential: 84,
    createdAt: '2026-08-01T10:00:00.000Z', lastVisitedAt: '2026-09-20T10:00:00.000Z',
  }]
  if (p === '/passport/pp-1/sections') return SECTIONS
  if (p === '/property/saved') return PROPS.slice(0, 3)
  if (p === '/property/watches') return PROPS.slice(1, 3)
  if (p === '/property/recently-viewed') return PROPS
  if (p === '/property/for-you') return { items: PROPS, needsPostcode: false }
  // /passport/collections: one collection + loose passports in two cities.
  if (p === '/collection/my') {
    const pp = (i, line, city, pc, type, done, status) => ({
      id: `pc-${i}`, addressLine1: line, city, postcode: pc, type, status,
      totalSections: 17, completedSections: done, updatedAt: `2026-09-2${i}T10:00:00.000Z`,
    })
    return {
      collections: [{ id: 'col-1', name: 'Coventry lets', items: [
        { id: 'ci-1', passport: pp(1, '14 Willow Lane', 'Coventry', 'CV5 8HE', 'LANDLORD', 6, 'DRAFT') },
        { id: 'ci-2', passport: pp(2, '9 Mill Street', 'Coventry', 'CV1 4AB', 'LANDLORD', 11, 'DRAFT') },
      ] }],
      uncollectedPassports: [
        pp(3, '7 Harbour Road', 'Bristol', 'BS1 4RN', 'SELLER', 8, 'DRAFT'),
        pp(4, 'The Old Rectory, Church Street', 'Stratford-upon-Avon', 'CV37 6HB', 'SELLER', 17, 'PUBLISHED'),
        pp(5, '100 Dulverton Avenue', 'Coventry', 'CV5 8HE', 'SELLER', 2, 'DRAFT'),
      ],
    }
  }
  if (p === '/passport/buyer-access') return [{
    id: 'ba-1', passportId: 'pc-9', addressLine1: '22 Queens Court', postcode: 'LS1 2AB',
    property: { epcRating: 'B' }, purchasedAt: '2026-09-12T10:00:00.000Z',
  }]
  return buyerMockFor(p)
}
function mockFor(url) {
  const p = new URL(url).pathname.replace(/^\/__backend/, '')
  if (MOCK_DASH) return dashMockFor(p)
  if (MOCK_BUYER) return buyerMockFor(p)
  if (/^\/passport\/[^/]+\/sections$/.test(p)) return SECTIONS
  if (/^\/tasks\/task-\d+-1\/questions$/.test(p)) return [NOTE_Q, FORM_Q]
  if (/^\/tasks\/[^/]+\/questions$/.test(p)) return [FORM_Q]
  return null
}

// ── Chrome over CDP ────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${path.resolve(OUT, '.chrome-profile')}`, 'about:blank'], { stdio: 'ignore' })
let targets = []
for (let i = 0; i < 50 && !targets.length; i++) {
  try { targets = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).filter((t) => t.type === 'page') } catch {}
  if (!targets.length) await sleep(300)
}
const ws = new WebSocket(targets[0].webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let seq = 0
const pending = new Map()
const send = (method, params = {}) => new Promise((res) => { const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })) })
const errors = []
ws.onmessage = async (ev) => {
  const m = JSON.parse(ev.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); return }
  if (m.method === 'Fetch.requestPaused') {
    const body = mockFor(m.params.request.url)
    await send('Fetch.fulfillRequest', {
      requestId: m.params.requestId, responseCode: body ? 200 : 404,
      responseHeaders: [{ name: 'Content-Type', value: 'application/json' }],
      body: Buffer.from(JSON.stringify(body ?? { message: 'mock: not found' })).toString('base64'),
    })
  }
  if (m.method === 'Runtime.exceptionThrown') errors.push('EXC ' + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || '').split('\n')[0])
}
await send('Page.enable')
await send('Runtime.enable')
if (MOCK || MOCK_BUYER || MOCK_DASH) await send('Fetch.enable', { patterns: [{ urlPattern: '*__backend*', requestStage: 'Request' }] })

const tokenSetup = `try{localStorage.setItem('token','probe-token');['umu_tour_passport_v1','umu_tour_question_v1'].forEach(k=>localStorage.setItem(k,'1'))}catch{};document.cookie='umu_has_session=1; path=/'`
let problems = 0
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const phone = !DESKTOP && width < 768
    const height = phone ? 844 : width < 1366 ? 1024 : Math.round(width * 0.5625)
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: phone })
    await send('Emulation.setTouchEmulationEnabled', { enabled: phone })
    if (AUTH) { await send('Page.navigate', { url: `${ORIGIN}/favicon.ico` }); await sleep(800); await send('Runtime.evaluate', { expression: tokenSetup }) }
    await send('Page.navigate', { url: ORIGIN + route })
    await sleep(9000)
    if (!NO_SKIP) await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].filter(b=>/^Skip$/i.test(b.textContent.trim())).forEach(b=>b.click())` })
    await sleep(600)
    if (SCROLL) {
      await send('Runtime.evaluate', { awaitPromise: true, expression: `(async()=>{const w=(ms)=>new Promise(r=>setTimeout(r,ms));for(let y=0;y<document.documentElement.scrollHeight;y+=Math.round(innerHeight*0.6)){scrollTo(0,y);await w(150)}scrollTo(0,0);await w(1200)})()` })
    }
    const r = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify({w: innerWidth, sw: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, zoom: getComputedStyle(document.documentElement).getPropertyValue('--wide-zoom').trim() || '-'})` })
    const d = JSON.parse(r.result.value)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(d.h, 3200), scale: 1 } })
    const name = `${route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}_${width}${DESKTOP ? 'd' : ''}.png`
    fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'))
    const overflow = d.sw > d.w
    if (overflow) problems++
    console.log(`${name.padEnd(48)} viewport ${d.w}  scrollWidth ${d.sw}  zoom ${d.zoom}${overflow ? '   <-- HORIZONTAL OVERFLOW' : ''}`)
  }
}
console.log(errors.length ? 'JS errors:\n  ' + [...new Set(errors)].slice(0, 15).join('\n  ') : 'no JS errors')
console.log(problems ? `${problems} screenshot(s) overflow horizontally` : 'no horizontal overflow')
ws.close(); chrome.kill(); process.exit(0)
