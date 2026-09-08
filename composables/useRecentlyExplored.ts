// Guest-safe "recently explored" list, backed entirely by localStorage.
//
// Deliberately NOT the same thing as the backend's /property/recently-viewed
// feed that the dashboard's RecentlyViewedFeed uses. That one is JWT-gated —
// a signed-out visitor has no user row to attach a view to, so it can never
// return anything for them. Discover is a pre-login page whose whole promise
// is "no account needed", so its history has to live in the browser.
//
// Both are written from the same place (pages/property/[id].vue) and they do
// not overlap: this one always records, the backend one only fires when a
// token exists.
export interface RecentlyExploredEntry {
  id: string
  addressLine1: string
  postcode: string | null
  city: string | null
  estimatedPrice: number | null
  lastSoldPrice: number | null
  lastSoldDate: string | null
  image: string | null
  viewedAt: number
}

const STORAGE_KEY = 'umu.recentlyExplored'
const MAX_ENTRIES = 10

function readAll(): RecentlyExploredEntry[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Private-mode browsers can throw on read, and a half-written value
    // parses as garbage. Either way an empty history is the right answer.
    return []
  }
}

function writeAll(entries: RecentlyExploredEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* storage full / disabled - fine, just don't persist */
  }
}

export function useRecentlyExplored() {
  function getRecentlyExplored(): RecentlyExploredEntry[] {
    return readAll()
  }

  // Called from the property detail page once it has real data - dedupes by
  // id (moves the entry to the front rather than duplicating it) and caps the
  // list so it can't grow unbounded in localStorage.
  function recordExplored(entry: Omit<RecentlyExploredEntry, 'viewedAt'>) {
    if (typeof localStorage === 'undefined') return
    if (!entry?.id) return
    const existing = readAll().filter((e) => e.id !== entry.id)
    const next = [{ ...entry, viewedAt: Date.now() }, ...existing].slice(
      0,
      MAX_ENTRIES,
    )
    writeAll(next)
  }

  function clearRecentlyExplored() {
    writeAll([])
  }

  return { getRecentlyExplored, recordExplored, clearRecentlyExplored }
}
