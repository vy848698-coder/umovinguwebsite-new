<template>
  <div class="sc-root">
    <div class="sc-ambient sc-ambient-a" />
    <div class="sc-ambient sc-ambient-b" />
    <div class="sc-mesh" />

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-back" type="button" @click="router.back()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell scw-main">
      <div class="sc-card">
        <div class="sc-emoji">🎉</div>
        <h1 class="sc-title">Well done</h1>
        <p class="sc-sub">You completed this step.</p>
        <button class="sc-cta" type="button" @click="goNextStep">
          Continue
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 5 19 12 13 19" />
          </svg>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { usePassportSteps } from '~/composables/usePassportSteps'
const { steps } = usePassportSteps()
const route = useRoute()
const router = useRouter()
const passportId = route.params.id
const stepId = route.params.stepId

const goNextStep = () => {
  const idx = steps.value.findIndex((s) => s.id === stepId)
  if (idx + 1 < steps.value.length) {
    const next = steps.value[idx + 1]
    router.push(`/passportview/steps/${next.id}?propertyId=${passportId}`)
  } else {
    // all done - show final thank you / completed passport page
    router.push('/passportview/done')
  }
}
</script>

<style scoped>
.sc-root {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #231d45;
  background:
    radial-gradient(circle at 78% 8%, rgba(0, 161, 154, 0.1), transparent 34%),
    radial-gradient(circle at 8% 14%, rgba(90, 76, 240, 0.08), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8fdfb 46%, #ffffff 100%);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}
.sc-ambient,
.sc-mesh { pointer-events: none; position: fixed; }
.sc-ambient { border-radius: 999px; filter: blur(48px); opacity: 0.16; }
.sc-ambient-a { width: 300px; height: 300px; left: -100px; top: 120px; background: #00a19a; }
.sc-ambient-b { width: 320px; height: 320px; right: -120px; top: 160px; background: #5a4cf0; }
.sc-mesh {
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
}

/* ── Web nav ──────────────────────────────────────────────────────── */
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
}
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 10px; color: #0d1835; cursor: pointer; font-size: 20px; font-weight: 800; flex-shrink: 0; font-family: inherit; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; gap: 6px; }
.hsw-links button { border: 0; background: transparent; color: #475a7b; cursor: pointer; font-size: 14px; font-weight: 700; padding: 10px 14px; border-radius: 10px; white-space: nowrap; font-family: inherit; transition: background 0.18s, color 0.18s; }
.hsw-links button:hover { color: #0c2342; background: rgba(0, 161, 154, 0.08); }
.hsw-links button.active { color: #00857f; background: rgba(0, 161, 154, 0.1); box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24); }
.hsw-actions { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.hsw-back { display: inline-flex; align-items: center; gap: 6px; height: 42px; padding: 0 14px; border-radius: 10px; border: 1px solid #d8e3ee; background: #fff; color: #0c2342; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: border-color 0.18s, background 0.18s; }
.hsw-back:hover { border-color: #bfd1e4; background: #f8fbff; }
.hsw-back svg { width: 15px; height: 15px; }

/* ── Completion card ──────────────────────────────────────────────── */
.scw-main {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  padding: 60px 0 80px;
  min-height: calc(100dvh - 66px);
}
.sc-card {
  width: min(440px, 100%);
  text-align: center;
  padding: 44px 32px 36px;
  border: 1px solid rgba(231, 236, 242, 0.9);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 24px 56px rgba(23, 52, 92, 0.12);
}
.sc-emoji { font-size: 52px; margin-bottom: 14px; }
.sc-title { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.02em; color: #08102f; }
.sc-sub { margin: 10px 0 26px; font-size: 15px; color: #5b6d89; line-height: 1.5; }
.sc-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  background: linear-gradient(120deg, #00a19a, #2f9bdf 52%, #5a4cf0);
  box-shadow: 0 10px 22px rgba(47, 93, 223, 0.2);
  transition: transform 0.18s;
}
.sc-cta:hover { transform: translateY(-1px); }
.sc-cta svg { width: 16px; height: 16px; }

@media (max-width: 899px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 58px; }
}
@media (max-width: 640px) {
  .hsw-shell { width: calc(100% - 24px); }
  .hsw-back { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sc-cta { transition: none; }
}
</style>
