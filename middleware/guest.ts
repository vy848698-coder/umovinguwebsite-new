// Redirect already-signed-in users away from the landing and auth pages to
// /dashboard. Applied to `/` plus the onboarding sign-in / sign-up routes.
//
// This is what makes /explore a genuine pre-login entry point, matching the
// reference app: the only in-app links to it live on the landing page and in
// the guest nav, so once you have a session nothing routes you there and you
// search from the dashboard instead. The /explore route itself stays open
// (no auth middleware, no redirect), so bookmarks and shared property links
// keep working for everyone.
//
// TWO checks, in order:
//
// 1. `umu_has_session` — a small, non-secret flag cookie (see
//    composables/useSessionFlag.ts), set alongside the real JWT at every
//    login/signup and cleared at logout. Unlike localStorage, a cookie rides
//    along with the initial request, so useCookie() can read it during SSR —
//    meaning a signed-in visitor gets a real HTTP redirect before any
//    landing-page HTML is sent, with no flash. The cookie grants no
//    privilege on its own: worst case if it is stale or forged is guessing
//    the wrong page to render first, and every real page and API call still
//    gates on the actual JWT exactly as before.
//
// 2. The original client-only localStorage check, kept as the fallback for
//    the one gap the cookie cannot cover: a user signed in from BEFORE the
//    cookie existed has a valid token but no cookie yet on their first visit
//    post-deploy. (plugins/session-flag-sync.client.ts backfills it on their
//    next app load either way.)
//
//    `external: true` (a full page navigation) is deliberate on this path
//    rather than an in-app SPA hop. Rationale: `/` is SSR-rendered with only
//    its own scoped CSS inlined. With an in-app navigateTo, Vue Router swaps
//    in the destination component before its scoped CSS chunk finishes
//    loading — hero collapses, buttons drift to the middle of the viewport.
//    A refresh or later navigation looks fine because the CSS is cached by
//    then, which is what makes it easy to miss. A fresh request renders with
//    the full inlined stylesheet: no race, no unstyled first paint.
//
// Note: no `?sample=` exemption here, unlike the reference app. That exists
// there because its landing page renders the sample passport decks in place
// on `/`. Ours navigates to a separate /passport/sample route, which carries
// no middleware and stays reachable signed in or out — so there is nothing
// on `/` a signed-in user still needs.
export default defineNuxtRouteMiddleware(() => {
  const sessionFlag = useCookie('umu_has_session')
  if (sessionFlag.value) {
    return navigateTo('/dashboard', { replace: true })
  }

  if (import.meta.server) return

  let token: string | null = null
  try {
    token = localStorage.getItem('token')
  } catch {
    return
  }
  if (!token) return

  return navigateTo('/dashboard', { replace: true, external: true })
})
