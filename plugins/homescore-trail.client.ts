// Records every visit to a HomeScore page into the back-navigation trail
// (see composables/useHomescoreTrail.ts). Pages outside /homescore are not
// recorded, so a detour to a property page or sign-in and back doesn't break
// the chain of HomeScore pages the Back buttons retrace.
export default defineNuxtPlugin(() => {
  const router = useRouter()
  const trail = useHomescoreTrail()

  const recordRoute = (to: { path: string; query: Record<string, unknown> }) => {
    if (isHomescorePath(to.path)) trail.record(to.path, to.query)
  }

  router.afterEach((to, _from, failure) => {
    if (!failure) recordRoute(to)
  })
  // The first navigation can finish before this hook is registered; record
  // the landing page once the router has settled on it. (If afterEach did
  // catch it, this is a same-page update and changes nothing.)
  router.isReady().then(() => recordRoute(router.currentRoute.value))
})
