// Records every navigation into the passport back-navigation trail (see
// composables/usePassportTrail.ts). Every page is recorded, not just passport
// ones, because any navigation can change which history entries exist; only
// passport pages are kept in the trail.
import type { PassportNavKind } from '~/composables/usePassportTrail'

export default defineNuxtPlugin(() => {
  const router = useRouter()
  const trail = usePassportTrail()

  // Browser back/forward (and our own Back, which steps through history)
  // arrive as popstate before the router finishes the navigation.
  let popped = false
  window.addEventListener('popstate', () => {
    popped = true
  })
  // The first navigation is the page load itself: a refresh or a return to
  // this tab, which must keep the entry's saved screen and forward entries.
  let loaded = false

  function kindOfLastNavigation(): PassportNavKind {
    if (popped || !loaded) return 'pop'
    return (window.history.state as any)?.replaced ? 'replace' : 'push'
  }

  router.afterEach((to, _from, failure) => {
    const kind = kindOfLastNavigation()
    popped = false
    if (failure) return
    loaded = true
    trail.record(to.path, to.fullPath, kind)
  })
  // The first navigation can finish before this hook is registered; record
  // the landing page once the router has settled on it. (If afterEach did
  // catch it, this changes nothing.)
  router.isReady().then(() => {
    loaded = true
    trail.ensureCurrent()
  })
})
