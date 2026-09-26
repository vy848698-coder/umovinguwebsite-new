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
function mockFor(url) {
  const p = new URL(url).pathname.replace(/^\/__backend/, '')
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
if (MOCK) await send('Fetch.enable', { patterns: [{ urlPattern: '*__backend*', requestStage: 'Request' }] })

const tokenSetup = `try{localStorage.setItem('token','probe-token');['umu_tour_passport_v1','umu_tour_question_v1'].forEach(k=>localStorage.setItem(k,'1'))}catch{};document.cookie='umu_has_session=1; path=/'`
let problems = 0
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const phone = width < 768
    const height = phone ? 844 : width < 1366 ? 1024 : Math.round(width * 0.5625)
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: phone })
    await send('Emulation.setTouchEmulationEnabled', { enabled: phone })
    if (AUTH) { await send('Page.navigate', { url: `${ORIGIN}/favicon.ico` }); await sleep(800); await send('Runtime.evaluate', { expression: tokenSetup }) }
    await send('Page.navigate', { url: ORIGIN + route })
    await sleep(9000)
    await send('Runtime.evaluate', { expression: `[...document.querySelectorAll('button')].filter(b=>/^Skip$/i.test(b.textContent.trim())).forEach(b=>b.click())` })
    await sleep(600)
    const r = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify({w: innerWidth, sw: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, zoom: getComputedStyle(document.documentElement).getPropertyValue('--wide-zoom').trim() || '-'})` })
    const d = JSON.parse(r.result.value)
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(d.h, 3200), scale: 1 } })
    const name = `${route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}_${width}.png`
    fs.writeFileSync(path.join(OUT, name), Buffer.from(shot.data, 'base64'))
    const overflow = d.sw > d.w
    if (overflow) problems++
    console.log(`${name.padEnd(48)} viewport ${d.w}  scrollWidth ${d.sw}  zoom ${d.zoom}${overflow ? '   <-- HORIZONTAL OVERFLOW' : ''}`)
  }
}
console.log(errors.length ? 'JS errors:\n  ' + [...new Set(errors)].slice(0, 15).join('\n  ') : 'no JS errors')
console.log(problems ? `${problems} screenshot(s) overflow horizontally` : 'no horizontal overflow')
ws.close(); chrome.kill(); process.exit(0)
