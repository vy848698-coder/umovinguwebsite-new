import { clearSessionFlag } from '~/composables/useSessionFlag'

// Security review finding #7 (2026-11-15): the access token now lives only
// in memory (composables/useAuthToken.ts), so a fresh load/reload always
// starts with none — that no longer means signed-out. Before redirecting,
// try the httpOnly refresh cookie once; only a failed refresh (missing/
// expired/revoked cookie) is a real "no session".
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  if (!getToken()) {
    try {
      const { refreshAccessToken } = useAuth()
      await refreshAccessToken()
    } catch {
      // No valid refresh cookie — genuinely signed out.
    }
  }

  if (!getToken()) {
    // The umu_has_session_new cookie is only a routing hint for SSR (see
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
