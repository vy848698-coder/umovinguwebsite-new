// Hides the mobile-app marketplace screens that were ported under /homescore
// (marketplace home, category listing, supplier profile, jobs, post a job,
// messages). The desktop site covers the same job with the top-level
// /marketplace page and the InstallerFlowSheet drawer on the pathway, so
// these routes are not shown. The page files stay in place; anyone landing
// on one (old bookmark, typed URL) is sent to /marketplace instead.
const HIDDEN = /^\/homescore\/(marketplace|supplier|jobs|messages)(\/|$)/

export default defineNuxtRouteMiddleware((to) => {
  if (HIDDEN.test(to.path)) {
    return navigateTo('/marketplace', { replace: true, redirectCode: 302 })
  }
})
