// Redirect logged-in users away from auth pages to Explore.
//
// Uses `external: true` (full page navigation) rather than a client-side SPA
// hop. Rationale: /explore is SSR-rendered with only its own scoped CSS
// inlined. With an in-app `navigateTo`, Vue Router swaps in the destination
// component before its scoped CSS chunk finishes loading, so the first paint
// has no layout — hero collapses, buttons drift to the middle of the
// viewport. A refresh or later navigation looks fine because the CSS is
// cached by then, which is what makes it easy to miss. `external: true`
// forces a fresh browser request that renders with the full inlined
// stylesheet — no race, no unstyled first paint. The full-reload cost is paid
// only on the auth-continuation path (an already-signed-in user landing on a
// sign-in / sign-up route), which is rare.
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('token')
  if (!token) return

  return navigateTo('/explore', { replace: true, external: true })
})
