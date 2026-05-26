<template>
  <div class="mp-page">
    <!-- Top nav: back + eyebrow pill + sign-in/save -->
    <div class="mp-top-nav">
      <button class="mp-back" @click="goBack" aria-label="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>
      <div class="mp-nav-centre">
        <div class="eyebrow-pill">
          <span class="eyebrow-dot" />Buyer Profile
        </div>
      </div>
      <div style="width: 44px" />
    </div>

    <!-- ── Hero ─────────────────────────────────────────── -->
    <div class="mp-hero-head">
      <h1 class="mp-hero-title">Stand out as a serious buyer</h1>
      <p class="mp-hero-sub">
        Verified buyers get 3× more offers accepted. Build your profile in
        about 5 minutes.
      </p>
    </div>

    <div class="mp-main-grid">
    <!-- ── Hero card (prototype-exact gradient + shimmer) ── -->
    <div class="mp-hero-wrap">
      <div class="hero-card" @click="goToBuild">
        <div class="hero-eyebrow">UMU Buyer Profile</div>
        <div class="hero-tagline">"Trusted, ready,<br />chain-free."</div>
        <div class="hero-name">{{ heroName }}</div>
        <div class="hero-pills">
          <div class="hero-pill">🪪 ID Verified</div>
          <div v-if="heroFunds" class="hero-pill">{{ heroFunds }}</div>
          <div class="hero-pill">Chain free</div>
        </div>
        <div class="hero-footer">
          <span class="hero-footer-text">{{
            hasProgress ? 'Tap to continue' : 'Tap to start'
          }}</span>
          <span class="hero-share-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- ── Why it matters ─────────────────────────────────── -->
    <div class="section-header section-header--why">
      <div class="sec-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <div>
        <div class="sec-title">WHY IT MATTERS</div>
        <div class="sec-sub">Your competitive edge</div>
      </div>
    </div>
    <div class="mp-benefits">
      <div v-for="b in benefits" :key="b" class="mp-benefit">
        <div class="mp-tick">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <span>{{ b }}</span>
      </div>
    </div>

    <!-- ── Live activity ──────────────────────────────────── -->
    <div v-if="activityStats.publishedLast7d > 0" class="live-bar">
      <div class="pulse-dot" />
      <span>
        <strong>{{ activityStats.publishedLast7d.toLocaleString() }}</strong>
        {{ activityStats.publishedLast7d === 1 ? 'buyer' : 'buyers' }}
        verified this week · avg. 4 min to complete
      </span>
    </div>

    <!-- ── What's inside ──────────────────────────────────── -->
    <div class="section-header section-header--inside">
      <div class="sec-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M8 2v4M16 2v4M3 10h18" />
        </svg>
      </div>
      <div>
        <div class="sec-title">WHAT'S INSIDE</div>
        <div class="sec-sub">Your five sections</div>
      </div>
    </div>
    <div class="options-block">
      <div v-for="s in sections" :key="s.title" class="opt-card opt-card--compact">
        <div class="opt-icon">{{ s.emoji }}</div>
        <div class="opt-text">
          <div class="opt-title">{{ s.title }}</div>
          <div class="opt-sub">{{ s.sub }}</div>
        </div>
        <span
          class="rec-pill"
          :class="s.required ? 'rec-pill--req' : 'rec-pill--opt'"
        >
          {{ s.required ? 'REQUIRED' : 'OPTIONAL' }}
        </span>
      </div>
    </div>

    <!-- ── CTA ────────────────────────────────────────────── -->
    <div class="mp-cta-wrap">
      <button class="cta-btn" @click="goToBuild">
        <span class="cta-btn-inner">
          {{ hasProgress ? 'Continue my Profile' : 'Build my Buyer Profile' }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </button>
      <div class="ghost-link">Free · No subscription · 5-minute build</div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBuyerProfile } from '~/composables/useBuyerProfile'
import { useProfile } from '~/composables/useProfile'

const router = useRouter()
const { getBuyerProfile, getActivityStats } = useBuyerProfile()
const { fetchProfile, profile } = useProfile()

const existing = ref<any>(null)
const loading = ref(true)
const activityStats = ref({ publishedLast7d: 0, totalPublished: 0 })

const hasProgress = computed(() => {
  const p = existing.value
  if (!p) return false
  return !!(
    p.idDocumentType ||
    p.fundsType ||
    p.chainPosition ||
    p.solicitorStatus ||
    p.timeline ||
    p.statement
  )
})

const heroName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return 'Your name here'
})

const heroFunds = computed(() => {
  const amt = existing.value?.fundsAmount
  if (!amt) return ''
  if (amt >= 1_000_000) return `£${(amt / 1_000_000).toFixed(1)}M Funds`
  if (amt >= 1000) return `£${Math.round(amt / 1000)}K Funds`
  return `£${amt} Funds`
})

const benefits = [
  'Sellers take your offer seriously',
  'Agents prioritise your viewings',
  'Solicitors can start faster',
  'Verified credentials replace endless paperwork',
]

const sections = [
  { emoji: '🪪', title: 'Verified identity', sub: 'Onfido KYC + DVS-certified', required: true },
  { emoji: '🏦', title: 'Proof of funds', sub: 'Mortgage AIP or bank statement', required: true },
  { emoji: '🔗', title: 'Chain position', sub: 'First-time, chain-free, or selling', required: true },
  { emoji: '⚖️', title: 'Solicitor & timeline', sub: 'Move-readiness signals', required: false },
  { emoji: '✍️', title: 'Your story', sub: 'Optional short intro to sellers', required: false },
]

const goBack = useGoBack('/explore')

function goToBuild() {
  router.push('/buyer-profile/build')
}

onMounted(async () => {
  // Activity ticker — public endpoint, fire-and-forget.
  getActivityStats()
    .then((s) => { activityStats.value = s })
    .catch(() => { /* no-op */ })
  fetchProfile?.().catch(() => {})
  try {
    const data = await getBuyerProfile()
    existing.value = data
    if (data?.published) {
      router.replace('/buyer-profile/view')
      return
    }
  } catch {
    /* token may be missing — stay on intro */
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ───────────── Page shell ───────────── */
.mp-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  max-width: none;
  width: 100%;
  margin: 0 auto;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 0 14px 34px;
  position: relative;
}

/* ───────────── Top nav ───────────── */
.mp-top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: none;
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 12px 4px 8px;
  padding-top: calc(12px + env(safe-area-inset-top));
}
.mp-back {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #143047;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.mp-back:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow: 0 12px 24px rgba(19, 48, 71, 0.12);
}
.mp-nav-centre { flex: 1; display: flex; justify-content: center; }

/* ───────────── Eyebrow pill ───────────── */
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #067a74;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.28);
  padding: 6px 12px;
  border-radius: 100px;
  text-transform: uppercase;
}
.eyebrow-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00a19a;
}

/* ───────────── Hero head ───────────── */
.mp-hero-head {
  width: min(100%, 980px);
  margin-top: 8px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 28px;
  padding: 24px 18px 18px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
}
.mp-hero-head::before {
  content: '';
  position: absolute;
  inset: -145% auto auto -40%;
  width: 54%;
  height: 320%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.38) 46%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-130%) rotate(16deg);
  transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.mp-hero-head:hover::before {
  transform: translateX(220%) rotate(16deg);
}
.mp-hero-title {
  position: relative;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  font-weight: 750;
  color: #10263d;
  line-height: 1.06;
  margin-bottom: 8px;
  letter-spacing: -0.9px;
}
.mp-hero-sub {
  position: relative;
  font-size: 13px;
  color: #627891;
  line-height: 1.5;
  font-weight: 600;
}

/* ───────────── Hero card ───────────── */
.mp-hero-wrap { padding: 14px 0 0; }

.mp-main-grid {
  display: block;
  width: min(100%, 980px);
  margin: 0 auto;
}
.hero-card {
  background: linear-gradient(140deg, #00b6ae 0%, #00a19a 40%, #1d6aa0 100%);
  box-shadow:
    0 18px 34px -12px rgba(17, 87, 145, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-radius: 22px;
  padding: 22px;
  color: #fff;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 24px 40px -14px rgba(17, 87, 145, 0.46),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}
.hero-card::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 65%);
  pointer-events: none;
}
.hero-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%) skewX(-15deg);
  animation: mp-shimmer 3s ease-in-out infinite;
  pointer-events: none;
}
.hero-card > * { position: relative; z-index: 1; }
@keyframes mp-shimmer {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(600%) skewX(-15deg); }
}
.hero-eyebrow {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  opacity: 0.74;
  margin-bottom: 4px;
}
.hero-tagline {
  font-size: 22px;
  font-weight: 800;
  font-style: italic;
  line-height: 1.2;
  margin-bottom: 12px;
}
.hero-name {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
  opacity: 0.92;
}
.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}
.hero-pill {
  font-size: 10px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 100px;
  padding: 5px 10px;
  color: #fff;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.08);
}
.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hero-footer-text {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.82;
}
.hero-share-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ───────────── Section header ───────────── */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 2px 10px;
}
.sec-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  box-shadow: 0 10px 18px rgba(48, 98, 214, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.sec-title {
  font-size: 11px;
  font-weight: 800;
  color: #71849b;
  letter-spacing: 1.2px;
}
.sec-sub {
  font-size: 15px;
  color: #17314a;
  font-weight: 800;
  letter-spacing: -0.25px;
}

/* ───────────── Benefits ───────────── */
.mp-benefits {
  border-radius: 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.08);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mp-benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  font-weight: 700;
  color: #17314a;
}
.mp-tick {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ───────────── Live bar ───────────── */
.live-bar {
  margin-top: 16px;
  border-radius: 14px;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.28);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #067a74;
  font-weight: 700;
}
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a19a;
  position: relative;
  flex-shrink: 0;
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: #00a19a;
  opacity: 0.35;
  animation: mp-pulse 1.8s ease-out infinite;
}
@keyframes mp-pulse {
  0% { transform: scale(1); opacity: 0.35; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* ───────────── Sections options-block ───────────── */
.options-block {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.opt-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 13px 14px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}
.opt-card--compact { cursor: default; }
.opt-card:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.opt-card.sel {
  background: rgba(229, 255, 248, 0.9);
  border-color: rgba(0, 161, 154, 0.45);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.1);
}
.opt-icon {
  font-size: 20px;
  width: 36px;
  text-align: center;
  flex-shrink: 0;
}
.opt-text { flex: 1; min-width: 0; }
.opt-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #17314a;
}
.opt-sub {
  font-size: 11px;
  color: #627891;
  margin-top: 1px;
}
.rec-pill {
  font-size: 9px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 100px;
  letter-spacing: 1px;
  flex-shrink: 0;
}
.rec-pill--req {
  background: #e2f1ea;
  color: #067a74;
  border: 1px solid rgba(0, 161, 154, 0.25);
}
.rec-pill--opt {
  background: #edf2f8;
  color: #627891;
}

/* ───────────── CTA ───────────── */
.mp-cta-wrap { padding: 20px 0 0; }
.cta-btn {
  width: 100%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.cta-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%) skewX(-15deg);
  animation: mp-shimmer 2.5s ease-in-out 1s infinite;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}
.cta-btn-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.ghost-link {
  text-align: center;
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #627891;
  padding: 12px 10px 4px;
}

@media (min-width: 768px) {
  .mp-page {
    padding: 0 18px 40px;
  }

  .mp-top-nav {
    padding: 14px 4px 10px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .mp-hero-head {
    padding: 28px 24px 24px;
  }

  .mp-hero-title {
    font-size: 38px;
  }

  .hero-tagline {
    font-size: 24px;
  }

  .options-block {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
}

@media (min-width: 1440px) {
  .mp-page {
    padding: 0 22px 42px;
  }

  .mp-top-nav,
  .mp-hero-head,
  .mp-main-grid {
    width: min(100%, 1180px);
  }

  .mp-main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
    gap: 14px 18px;
    align-items: start;
  }

  .mp-hero-wrap,
  .section-header--why,
  .mp-benefits,
  .live-bar {
    grid-column: 1;
  }

  .section-header--inside,
  .options-block,
  .mp-cta-wrap {
    grid-column: 2;
  }

  .section-header--inside {
    padding-top: 14px;
  }

  .mp-cta-wrap {
    padding-top: 12px;
  }

  .options-block {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }
}

@media (min-width: 1024px) and (max-width: 1439px) {
  .mp-page {
    padding: 0 20px 34px;
  }

  .mp-hero-head {
    margin-top: 6px;
    padding: 22px 18px 16px;
    border-radius: 24px;
  }

  .mp-hero-title {
    font-size: 32px;
    line-height: 1.08;
    margin-bottom: 6px;
  }

  .mp-hero-sub {
    font-size: 12.5px;
    line-height: 1.45;
  }

  .mp-main-grid { display: block; }

  .mp-hero-wrap {
    padding-top: 10px;
  }

  .hero-card {
    padding: 18px;
    border-radius: 20px;
  }

  .hero-tagline {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .hero-pills {
    margin-bottom: 12px;
  }

  .section-header {
    padding: 14px 2px 8px;
  }

  .section-header--inside {
    padding-top: 8px;
  }

  .mp-benefits {
    padding: 12px;
    gap: 8px;
    border-radius: 18px;
  }

  .mp-benefit {
    font-size: 13px;
    gap: 10px;
  }

  .mp-tick {
    width: 24px;
    height: 24px;
  }

  .live-bar {
    margin-top: 10px;
    padding: 9px 10px;
    font-size: 10.5px;
  }

  .options-block {
    gap: 8px;
  }

  .opt-card {
    padding: 11px 12px;
    border-radius: 14px;
  }

  .opt-title {
    font-size: 13px;
  }

  .opt-sub {
    font-size: 10.5px;
  }

  .mp-cta-wrap {
    padding-top: 8px;
  }

  .cta-btn {
    padding: 14px;
    border-radius: 12px;
  }

  .ghost-link {
    padding-top: 9px;
  }
}

@media (max-width: 430px) {
  .mp-hero-title {
    font-size: 30px;
  }

  .hero-tagline {
    font-size: 20px;
  }

  .sec-sub {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mp-back,
  .hero-card,
  .opt-card,
  .cta-btn,
  .mp-hero-head::before,
  .hero-card::before,
  .pulse-dot::after {
    transition: none;
    animation: none;
  }
}
</style>
