// HomeScore back-navigation trail.
//
// Every HomeScore page (/homescore and everything under it) carries a Back
// button in its navbar that returns to the HomeScore page the user was on
// before, not just "the previous browser entry". To do that we keep our own
// trail of visited HomeScore pages for this tab:
//
//   - plugins/homescore-trail.client.ts records each navigation into it.
//   - The results page (/homescore/:id) is one route with many in-page
//     screens (landing, results, buyer report, quick wins...). It writes its
//     current screen and its own screen-back stack onto its trail entry, so
//     coming back to it lands on the exact screen the user left, and its
//     in-page back buttons keep retracing from there.
//   - The browser's own back button stays in sync: stepping back onto the
//     previous trail entry pops it just like our button does.
//
// Kept in sessionStorage so a refresh keeps the trail, while a new tab starts
// clean.

export interface HomescoreTrailEntry {
  /** route.path, used to match entries */
  path: string
  /** what to navigate to (path + any query the page needs) */
  fullPath: string
  /** /homescore/:id only: the in-page screen the user was on */
  screen?: string
  /** /homescore/:id only: that page's own screen-back stack */
  stack?: string[]
}

const STORAGE_KEY = 'umu_hs_trail_v1'
const MAX_ENTRIES = 30
// Query params that only mean something on arrival and must not be replayed
// when we navigate back to an entry.
const TRANSIENT_QUERY = new Set(['screen', 'from'])

export function isHomescorePath(path: string): boolean {
  return path === '/homescore' || path.startsWith('/homescore/')
}

function readStored(): HomescoreTrailEntry[] {
  if (typeof sessionStorage === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((e) => e && typeof e.path === 'string') : []
  } catch {
    return []
  }
}

function cleanFullPath(path: string, query: Record<string, unknown>): string {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query || {})) {
    if (TRANSIENT_QUERY.has(k) || v == null) continue
    for (const item of Array.isArray(v) ? v : [v]) {
      if (item != null) params.append(k, String(item))
    }
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

// Label for a Back button that returns to `entry`.
function labelFor(entry: HomescoreTrailEntry): string {
  const p = entry.path
  if (p === '/homescore') return 'Back to HomeScore'
  if (p.startsWith('/homescore/costs/')) return 'Back to running costs'
  if (p.startsWith('/homescore/street/')) return 'Back to street'
  if (p.startsWith('/homescore/pathway/')) return 'Back to pathway'
  if (p.startsWith('/homescore/passport/')) return 'Back to passport'
  if (p.startsWith('/homescore/jobs')) return 'Back to jobs'
  if (p.startsWith('/homescore/marketplace')) return 'Back to marketplace'
  if (p.startsWith('/homescore/messages')) return 'Back to messages'
  if (p.startsWith('/homescore/supplier/')) return 'Back to supplier'
  // The results page: name the screen we will land on.
  switch (entry.screen) {
    case 'buyer-results':
      return 'Back to report'
    case 'quick-wins':
      return 'Back to quick wins'
    case 'boost':
      return 'Back to boost'
    case 'level-up':
      return 'Back to your level'
    case 'passport':
      return 'Back to passport'
    case 'questions':
      return 'Back to questions'
    default:
      return 'Back to score'
  }
}

export function useHomescoreTrail() {
  const trail = useState<HomescoreTrailEntry[]>('hs-trail', () => [])
  // Set just before our own back navigation so the router hook doesn't treat
  // it as a fresh visit.
  const pendingBack = useState<boolean>('hs-trail-pending-back', () => false)
  const loaded = useState<boolean>('hs-trail-loaded', () => false)
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

  /** Router hook: record a completed navigation to a HomeScore page. */
  function record(path: string, query: Record<string, unknown>) {
    load()
    const fullPath = cleanFullPath(path, query)
    const list = [...trail.value]
    const top = list[list.length - 1]
    const prev = list[list.length - 2]

    if (pendingBack.value) {
      // Our Back button: drop entries until the one we returned to is on top.
      pendingBack.value = false
      while (list.length && list[list.length - 1].path !== path) list.pop()
      if (!list.length) list.push({ path, fullPath })
    } else if (prev && prev.path === path) {
      // Browser back (or a link) onto the previous HomeScore page: same as Back.
      list.pop()
    } else if (top && top.path === path) {
      // Same page again (refresh, query change): keep its saved screen.
      top.fullPath = fullPath
    } else {
      list.push({ path, fullPath })
    }
    trail.value = list.slice(-MAX_ENTRIES)
    save()
  }

  /** The entry for the page currently shown, if the trail is in sync. */
  function currentEntry(path: string): HomescoreTrailEntry | undefined {
    load()
    const top = trail.value[trail.value.length - 1]
    return top && top.path === path ? top : undefined
  }

  /** The HomeScore page Back should return to from `path`. */
  function previousEntry(path: string): HomescoreTrailEntry | undefined {
    load()
    const list = trail.value
    const top = list[list.length - 1]
    if (!top) return undefined
    // Normally the current page is on top; if a navigation slipped past the
    // hook, the top itself is the page to go back to.
    if (top.path !== path) return top
    return list[list.length - 2]
  }

  /**
   * Drop the current page's entry before a `router.replace` away from it
   * (Back's fallback), so the page it is replaced by doesn't offer Back to
   * a page that is no longer in browser history.
   */
  function dropCurrent(path: string) {
    if (!currentEntry(path)) return
    trail.value = trail.value.slice(0, -1)
    save()
  }

  /** /homescore/:id stores its screen state on its own entry. */
  function saveScreen(path: string, screen: string, stack: string[]) {
    const entry = currentEntry(path)
    if (!entry) return
    entry.screen = screen
    entry.stack = [...stack]
    save()
  }

  /**
   * Navigate to the previous HomeScore page. Uses the browser's own back
   * step when that is exactly where we are going (so history stays clean),
   * otherwise replaces the current entry. Returns false when there is no
   * previous HomeScore page, so the caller can use its own fallback.
   */
  function back(path: string): boolean {
    const target = previousEntry(path)
    if (!target) return false
    pendingBack.value = true
    const browserBack =
      typeof window !== 'undefined' ? (window.history.state as any)?.back : null
    if (typeof browserBack === 'string' && browserBack.split('?')[0] === target.path) {
      router.back()
    } else {
      router.replace(target.fullPath).catch(() => {
        pendingBack.value = false
      })
    }
    return true
  }

  return { trail, record, currentEntry, previousEntry, dropCurrent, saveScreen, back, labelFor }
}

/**
 * Navbar Back button state for one HomeScore page.
 *   const hsBack = useHomescoreBack(() => `/homescore/${id}`, 'Back to score')
 *   <button @click="hsBack.go">{{ hsBack.label }}</button>
 * `fallback` is where Back goes when the user landed on this page directly
 * (no earlier HomeScore page in this tab). Pass null to hide the button then.
 */
export function useHomescoreBack(
  fallback: (() => string | null) | null = null,
  fallbackLabel = 'Back to HomeScore',
) {
  const route = useRoute()
  const router = useRouter()
  const t = useHomescoreTrail()
  // Only resolved on the client, after mount, so SSR and the first client
  // render agree (sessionStorage doesn't exist on the server).
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const target = computed(() => {
    // Re-evaluate when the trail changes.
    void t.trail.value.length
    return mounted.value ? t.previousEntry(route.path) : undefined
  })
  const fallbackPath = computed(() => (fallback ? fallback() : null))
  const visible = computed(() => !!target.value || !!fallbackPath.value)
  const label = computed(() =>
    target.value ? t.labelFor(target.value) : fallbackLabel,
  )

  function go() {
    if (t.back(route.path)) return
    if (!fallbackPath.value) return
    t.dropCurrent(route.path)
    router.replace(fallbackPath.value)
  }

  return reactive({ visible, label, go })
}
