// Passport back-navigation trail.
//
// Every page in the passport flow (/passport, /passportview, /buyer-passport
// and everything under them) carries a Back button in its navbar that
// returns to the passport page the user was on before, on the exact screen
// they left, with the browser's own back button agreeing with it.
//
// How it stays in sync: Vue Router stamps every history entry with its
// `position` (history.state.position). Each trail entry remembers the
// position of the history entry it belongs to, so:
//
//   - plugins/passport-trail.client.ts records every navigation, mirroring
//     what the browser does to its own history: a push drops everything at
//     or after the new position (the forward entries), a replace swaps just
//     the one entry, and back/forward (popstate) only moves along it, so
//     forward entries keep their saved screens. Pages outside the passport
//     flow take part in that bookkeeping but are not kept, so a detour to a
//     property page or sign-in doesn't break the chain.
//   - Back steps through real history (router.go(-n)) to the previous
//     passport entry, so the browser's back and forward buttons carry on
//     from the same place afterwards.
//   - Pages with in-page screens (tabs on the passport, the current question
//     on a questions page...) save them onto their own entry and restore
//     them when the user comes back to that entry, whichever back button
//     brought them there.
//
// Kept in sessionStorage so a refresh keeps the trail, while a new tab starts
// clean (its history positions start again from 0 and truncate everything).

/** How the browser history changed: a new entry, a swapped one, or a move. */
export type PassportNavKind = 'push' | 'replace' | 'pop'

export interface PassportTrailEntry {
  /** route.path, used to match entries */
  path: string
  /** what to navigate to if history can't be stepped back to it */
  fullPath: string
  /** history.state.position of the entry this page lives in */
  pos: number
  /** in-page screen state the page saved (tab, question...) */
  screen?: Record<string, unknown>
}

const STORAGE_KEY = 'umu_pp_trail_v1'
const MAX_ENTRIES = 40
export const PASSPORT_HOME = '/passport/collections'

export function isPassportFlowPath(path: string): boolean {
  return (
    path === '/passport' ||
    path.startsWith('/passport/') ||
    path.startsWith('/passportview/') ||
    path.startsWith('/buyer-passport/')
  )
}

function historyPosition(): number | null {
  if (typeof window === 'undefined') return null
  const pos = (window.history.state as any)?.position
  return typeof pos === 'number' ? pos : null
}

function readStored(): PassportTrailEntry[] {
  if (typeof sessionStorage === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((e) => e && typeof e.path === 'string' && typeof e.pos === 'number')
      : []
  } catch {
    return []
  }
}

// Label for a Back button that returns to `entry`.
function labelFor(entry: PassportTrailEntry): string {
  const p = entry.path
  const tab = entry.screen?.tab
  if (p === '/passport' || p === PASSPORT_HOME) return 'Back to passport'
  if (p === '/passport/sample') return 'Back to sample'
  if (p.startsWith('/passportview/steps/tasks/')) return 'Back to questions'
  if (p === '/passportview/steps/complete') return 'Back to section'
  if (p.startsWith('/passportview/steps/')) return 'Back to section'
  if (p === '/passportview/expert') return 'Back to expert'
  if (p === '/passportview/done') return 'Back to summary'
  if (p.startsWith('/buyer-passport/section/task/')) return 'Back to answers'
  if (p.startsWith('/buyer-passport/section/')) return 'Back to section'
  if (p.startsWith('/buyer-passport/')) return 'Back to buyer view'
  if (p.startsWith('/passportview/landlord/')) {
    if (tab === 'vault') return 'Back to vault'
    if (tab === 'tenancy') return 'Back to tenancy'
    return 'Back to passport'
  }
  if (p.startsWith('/passportview/')) {
    // The seller passport: name the tab we will land on.
    switch (tab) {
      case 'street':
        return 'Back to street'
      case 'buyers':
        return 'Back to buyers'
      case 'vault':
        return 'Back to vault'
      case 'history':
        return 'Back to history'
      default:
        return 'Back to passport'
    }
  }
  return 'Back to passport'
}

export function usePassportTrail() {
  const trail = useState<PassportTrailEntry[]>('pp-trail', () => [])
  const loaded = useState<boolean>('pp-trail-loaded', () => false)
  // Captured during setup: click handlers run outside Nuxt's context.
  const router = useRouter()

  function load() {
    if (loaded.value || typeof window === 'undefined') return
    trail.value = readStored()
    loaded.value = true
  }

  function save() {
    if (typeof sessionStorage === 'undefined') return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trail.value.slice(-MAX_ENTRIES)))
    } catch {
      /* private mode / quota: the trail just won't survive a refresh */
    }
  }

  /**
   * Router hook: record a completed navigation (any page, passport or not).
   * `kind` says how browser history changed; see the header comment.
   */
  function record(path: string, fullPath: string, kind: PassportNavKind) {
    load()
    const pos = historyPosition()
    if (pos == null) return
    const here = trail.value.find((e) => e.pos === pos)
    // A push starts new history from here: the forward entries are gone.
    // Otherwise only this position's entry can change.
    const list = trail.value.filter((e) => (kind === 'push' ? e.pos < pos : e.pos !== pos))
    if (isPassportFlowPath(path)) {
      // Back/forward onto (or a refresh of) an entry we already know keeps
      // the screen it saved; a new page in this slot starts fresh.
      const keep = kind !== 'push' && here && here.path === path
      list.push(keep ? { ...here, fullPath } : { path, fullPath, pos })
      list.sort((a, b) => a.pos - b.pos)
    }
    trail.value = list.slice(-MAX_ENTRIES)
    save()
  }

  /** Make sure the page on screen is recorded (first load, hydration). */
  function ensureCurrent() {
    const route = router.currentRoute.value
    const pos = historyPosition()
    if (pos == null || !isPassportFlowPath(route.path)) return
    load()
    const here = trail.value.find((e) => e.pos === pos)
    if (!here || here.path !== route.path) record(route.path, route.fullPath, 'pop')
  }

  /** The entry for the page currently shown. */
  function currentEntry(path: string): PassportTrailEntry | undefined {
    ensureCurrent()
    const pos = historyPosition()
    return trail.value.find((e) => e.pos === pos && e.path === path)
  }

  /** The passport page Back should return to from `path`. */
  function previousEntry(path: string): PassportTrailEntry | undefined {
    ensureCurrent()
    const pos = historyPosition()
    if (pos == null) return undefined
    // Nearest earlier passport page that isn't this same page again (a
    // detour out and back in would otherwise offer Back to itself).
    for (let i = trail.value.length - 1; i >= 0; i--) {
      const e = trail.value[i]
      if (e.pos < pos && e.path !== path) return e
    }
    return undefined
  }

  /** Save this page's in-page screen state onto its own entry. */
  function saveScreen(path: string, screen: Record<string, unknown>) {
    const entry = currentEntry(path)
    if (!entry) return
    entry.screen = { ...entry.screen, ...screen }
    save()
  }

  /** The screen state this page saved last time the user was on this entry. */
  function savedScreen(path: string): Record<string, unknown> | undefined {
    return currentEntry(path)?.screen
  }

  // Step browser history back to `entry` so both back buttons stay in step;
  // if its position can't be reached (history out of our view), push it.
  function goToEntry(entry: PassportTrailEntry) {
    const pos = historyPosition()
    if (pos != null && entry.pos < pos && entry.pos >= 0) router.go(entry.pos - pos)
    else router.push(entry.fullPath)
  }

  /**
   * Navigate to the previous passport page. Returns false when there is no
   * previous passport page, so the caller can use its own fallback.
   */
  function back(path: string): boolean {
    const target = previousEntry(path)
    if (!target) return false
    goToEntry(target)
    return true
  }

  /**
   * Go to `targetPath`: by stepping back through history when the user came
   * from there (restoring the screen they left it on), otherwise by pushing
   * `fallbackFullPath`. Used where a page sends the user "up" to a page they
   * have usually just come from (a finished section back to its list, the
   * passport back to the collection).
   */
  function returnTo(targetPath: string, fallbackFullPath: string) {
    ensureCurrent()
    const pos = historyPosition()
    const current = router.currentRoute.value.path
    if (pos != null && targetPath !== current) {
      for (let i = trail.value.length - 1; i >= 0; i--) {
        const e = trail.value[i]
        if (e.pos < pos && e.path === targetPath) return goToEntry(e)
      }
    }
    return router.push(fallbackFullPath)
  }

  return {
    trail,
    record,
    ensureCurrent,
    currentEntry,
    previousEntry,
    saveScreen,
    savedScreen,
    back,
    returnTo,
    labelFor,
  }
}

/**
 * Navbar Back button state for one passport page.
 *   const ppBack = usePassportBack(() => `/passportview/${id}`, 'Back to passport')
 *   <button :aria-label="ppBack.label" @click="ppBack.go">{{ ppBack.label }}</button>
 * `fallback` is where Back goes when the user landed on this page directly
 * (no earlier passport page in this tab).
 */
export function usePassportBack(
  fallback: (() => string | null) | null = () => PASSPORT_HOME,
  fallbackLabel = 'Back to passport',
) {
  const route = useRoute()
  const router = useRouter()
  const t = usePassportTrail()
  // Only resolved on the client, after mount, so SSR and the first client
  // render agree (sessionStorage doesn't exist on the server).
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const target = computed(() => {
    // Re-evaluate when the trail changes.
    void t.trail.value.length
    void route.fullPath
    return mounted.value ? t.previousEntry(route.path) : undefined
  })
  const fallbackPath = computed(() => (fallback ? fallback() : null))
  const visible = computed(() => !!target.value || !!fallbackPath.value)
  const label = computed(() => (target.value ? t.labelFor(target.value) : fallbackLabel))

  function go() {
    if (t.back(route.path)) return
    // Landed here directly: go "up" in place of this entry, so there is no
    // loop of Back buttons between this page and its fallback.
    if (fallbackPath.value) router.replace(fallbackPath.value)
  }

  return reactive({ visible, label, go })
}

/**
 * The main passport pages (seller, buyer and landlord landing screens):
 * Back always reads "Back to passport" and goes to the passport collection,
 * stepping back through history when that is where the user came from.
 */
export function usePassportHomeBack() {
  const t = usePassportTrail()
  function go() {
    t.returnTo(PASSPORT_HOME, PASSPORT_HOME)
  }
  return reactive({ visible: true, label: 'Back to passport', go })
}
