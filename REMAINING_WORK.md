# UmovingU Frontend — Remaining Work & Deploy Handoff

_Last updated: 2026-06-12_

This file captures the state of the project audit so we can continue later.
Nuxt 3 + Capacitor PWA. Deploys to `demo-umu-frontend.vercel.app`.

---

## ✅ DONE THIS SESSION

### Broken links fixed (verified zero remaining references)
- `/support` → `/profile/support` — 3 spots:
  - pages/buyer-profile/view.vue:30
  - pages/buyer-profile/view.vue:70
  - components/buyer-profile/BuyerProfileNav.vue:16
- `/profile/privacy` → `/legal/privacy` — 1 spot:
  - pages/buyer-profile/view.vue:387

All other ~80 internal nav targets (navigateTo / router.push / NuxtLink) resolve to real pages. ✓

---

## 🔴 DEPLOY BLOCKERS (do before deploying)

### 1. Set env vars on Vercel (CRITICAL)
Currently default to localhost / committed test keys:
- `NUXT_PUBLIC_API_BASE`  ← CRITICAL. Defaults to http://localhost:3002 → API fails in prod if unset.
- `NUXT_PUBLIC_MAPBOX_TOKEN`  ← maps break without it
- `NUXT_PUBLIC_OS_API_KEY`    ← address search breaks without it
- `NUXT_PUBLIC_STRIPE_KEY`        ← replace committed pk_test_... with prod key
- `NUXT_PUBLIC_GOOGLE_CLIENT_ID`  ← replace committed default with prod
- (Apple redirect URI already points at the vercel domain — OK)

### 2. SSR build OOMs locally — DECISION NEEDED
- `nuxt build` SSR/server stage fails locally with silent exit (no error msg).
- ROOT CAUSE: this machine = 8 GB RAM, only ~1.3 GB free → V8 OOM-kills the
  SSR "transforming..." stage. Client bundle builds cleanly EVERY time.
- This is an ENVIRONMENT memory limit, NOT a code bug. Reproduced 3x.
- App is effectively client-rendered: 0 pages use useFetch/useAsyncData,
  54 pages fetch in onMounted. Only 2 server routes (Apple/Google OAuth callbacks).
- mapbox-gl (only heavy dep) is already correctly lazy-loaded via dynamic import.

OPTIONS (pick one when we continue):
- A) Leave SSR on — change nothing. Vercel (~8GB dedicated) builds SSR fine.
     Local full `nuxt build` will keep OOM-ing. OAuth server routes stay normal.
- B) Add `ssr: false` (SPA mode) in nuxt.config.ts — skips heavy SSR transform,
     builds complete locally AND on Vercel, faster. App behavior unchanged
     (already client-rendered). OAuth Nitro routes still work. SEO slightly worse.
- C) Decide later.

NOTE: user has NOT chosen yet. Do not change nuxt.config.ts until they pick.

---

## 🟡 POLISH BACKLOG (not deploy blockers) — mobile-only pages → desktop

Pattern reference already established: pages/profile/document.vue and
pages/profile/collaborator-information.vue (mobile-first FAB pattern, max-width
1080px container but single-column, no min-width MQ, no desktop grid).

Established desktop pattern to follow: HomeScore redesign + buyer-profile/build.vue
(uses min-width:1024px desktop grids).

### Mobile-only pages with NO desktop adaptation (minMQ=0, no md:/lg:) — the real backlog
profile/:
- document.vue                (1080px wide but single col — fixable)
- collaborator-information.vue (1080px wide but single col — fixable)
- collaborator-detail.vue
- add-collaborator.vue
- calendar.vue
- chat.vue
- personal-information.vue
- property-information.vue
- saved-properties.vue
- settings.vue
- subscription-plan.vue
- snapshot.vue   (WIDE single-col)
- support.vue    (WIDE single-col)
- learn.vue      (1040px single-col)

buyer-profile/:
- index.vue
- pdf.vue
- send-agent.vue
- share.vue
- sign.vue
- signed.vue

Medium single-column (work on desktop, look sparse):
- homescore/costs/[id].vue, homescore/street/[id].vue (980px)
- passportview/[id].vue, passportview/steps/* (980px)
- buyer-passport/section/[id].vue, section/task/[id].vue (980px)

### Intentionally mobile — LEAVE AS-IS (focused flows, fine as narrow)
- onboarding/* (welcome, signin, signup, create-account, preferences,
  questionnaire/*, thank-you, verification)
- legal/* (cookies, privacy, terms)
- shared/[token], shared-buyer/[token], shared-tenant/[token]
- payment/[id], verify-ownership/[id], contact/[id], owner/[id]
- buyer-profile/build.vue — core buyer flow (per user: NO desktop work here)

### Already desktop-ready (no work needed)
- explore.vue, index.vue, dashboard.vue, profile.vue, profile/index.vue
- buyer-profile/view.vue, build.vue, access-granted/[id], access-request/[id]
- homescore/index.vue, marketplace.vue (1180px desktop containers)

---

## ℹ️ MINOR / NICE-TO-HAVE (non-blocking)
- pages/index.vue + pages/profile/settings.vue use raw <a href="/..."> for
  internal links → work but cause full page reloads. Convert to <NuxtLink> for SPA nav.
- One client chunk is 1.7MB (gzip 468KB), Vite warns. Not blocking. Mostly
  @nuxt/ui + app code. mapbox already split out. Could manualChunks later.

---

## NEXT STEPS WHEN WE RESUME
1. User picks build mode A/B/C above (SSR-on vs ssr:false).
2. Set the Vercel env vars.
3. (Optional) Start desktop conversion of profile/ pages, beginning with
   document.vue + collaborator-information.vue using the build.vue desktop pattern.
