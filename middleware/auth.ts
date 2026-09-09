import { clearSessionFlag } from '~/composables/useSessionFlag'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const token = localStorage.getItem('token')

  if (!token) {
    // The umu_has_session cookie is only a routing hint for SSR (see
    // composables/useSessionFlag.ts). Reaching here means it lied: no real
    // token. Clear it, or middleware/guest.ts keeps trusting it and the two
    // middlewares ping-pong forever — /dashboard sends us to sign-in for
    // having no token, guest sees the cookie and sends us back to
    // /dashboard. Only happens when localStorage was cleared while cookies
    // survived, but the failure mode is an infinite redirect, so it is worth
    // the one line.
    clearSessionFlag()

    if (to.fullPath !== '/onboarding/signin') {
      localStorage.setItem('redirectAfterLogin', to.fullPath)
    }
    return navigateTo('/onboarding/signin?reason=session', { replace: true })
  }
})
