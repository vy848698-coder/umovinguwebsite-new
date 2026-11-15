// Backfills the umu_has_session flag cookie (see composables/useSessionFlag.ts
// and middleware/guest.ts) for sessions that predate it: a user who was
// already signed in before this shipped has a valid token in localStorage but
// nothing ever set the cookie for them, since it is only written at
// login/signup. Without this they would keep getting the landing-page flash
// until their token expires and they sign in again — up to 7 days.
//
// Runs once per app boot, client-only: if a token exists but the flag does
// not, set it, so their very next visit to `/` gets the flash-free SSR
// redirect. Also self-heals a cookie the user cleared without signing out.
//
// Security review finding #7 (2026-11-15): the access token moved out of
// localStorage into memory only (composables/useAuthToken.ts) — new
// logins never write here again. This plugin now only ever sees a STALE
// leftover from before that change, expired within its 1h TTL regardless,
// and deliberately reads raw localStorage (not getToken()) one last time
// to use it as a "this browser was logged in" signal, then scrubs it
// immediately so it isn't left sitting around as a dead, unused secret.
import { setSessionFlag } from '~/composables/useSessionFlag'

export default defineNuxtPlugin(() => {
  let token: string | null = null
  try {
    token = localStorage.getItem('token')
  } catch {
    // Private mode / blocked site data — nothing to sync.
    return
  }
  if (!token) return
  setSessionFlag()
  try {
    localStorage.removeItem('token')
  } catch {
    // ignore
  }
})
