/**
 * Dev-only service-worker cleanup.
 *
 * In development the PWA service worker is disabled (see nuxt.config.ts
 * devOptions.enabled = false). But a worker registered during an earlier dev
 * session stays installed in the browser and keeps serving the cached
 * `/offline` navigateFallback for every route. This plugin unregisters any
 * leftover worker and clears its caches on first load so the app self-heals.
 *
 * It is a no-op in production (the `.client` plugin only runs in the browser,
 * and the guard below skips it unless we're in dev).
 */
export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => {
      if (!regs.length) return false
      return Promise.all(regs.map((r) => r.unregister())).then(() => true)
    })
    .then((hadWorker) => {
      if (!hadWorker) return
      // Wipe Workbox caches, then reload once to drop the controlled page.
      if (typeof caches !== 'undefined') {
        caches
          .keys()
          .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
          .finally(() => window.location.reload())
      } else {
        window.location.reload()
      }
    })
    .catch(() => {
      /* nothing we can do — ignore */
    })
})
