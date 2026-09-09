// A small, NON-secret flag cookie — not the JWT itself, and never read or
// trusted by the backend API. Its only job is letting the Nuxt SERVER know
// "this browser probably has a session" before it renders anything, so
// middleware/guest.ts can redirect an already-signed-in visitor server-side
// instead of flashing the marketing landing page and only then discovering
// the token in localStorage after hydration.
//
// Worst case if this is stale or forged: the server guesses the wrong page to
// render first. It grants no privilege — every real page and API call is
// still gated by the actual JWT in localStorage, sent as an Authorization
// header. This cookie is purely a routing hint.
//
// Plain document.cookie rather than Nuxt's useCookie() is deliberate: these
// setters get called from places that aren't inside a fresh Nuxt composable
// context (e.g. a `finally` block after an `await`), where useCookie() can
// throw. The reading side (middleware/guest.ts) uses useCookie(), which is
// exactly where Nuxt expects it and is what makes the cookie visible to SSR.
const SESSION_FLAG_COOKIE = 'umu_has_session'

// 7 days, matching the JWT's own expiry — no point outliving the token it is
// shadowing.
const SESSION_FLAG_MAX_AGE = 60 * 60 * 24 * 7

export function setSessionFlag() {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_FLAG_COOKIE}=1; path=/; max-age=${SESSION_FLAG_MAX_AGE}; samesite=lax`
}

export function clearSessionFlag() {
  if (typeof document === 'undefined') return
  document.cookie = `${SESSION_FLAG_COOKIE}=; path=/; max-age=0; samesite=lax`
}
