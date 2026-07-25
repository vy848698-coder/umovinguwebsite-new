<template>
  <div class="mp-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" class="active" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-back" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell mp-body">
    <!-- ── Page head ────────────────────────────────────────── -->
    <div class="mp-hero-head">
      <div class="mp-hero-head-copy">
        <div class="mp-kicker">BUYER PROFILE</div>
        <h1 class="mp-hero-title">Stand out as a<br /><span class="mp-hero-title-accent">serious buyer</span></h1>
        <p class="mp-hero-sub">
          Verified buyers get 3× more offers accepted.<br />Build your profile in
          about 5 minutes.
        </p>
      </div>

      <!-- Floating shield illustration (sits on the page background) -->
      <div class="mp-illus" aria-hidden="true">
        <div class="mp-illus-arc" />
        <div class="mp-illus-chip mp-illus-chip-1"><Icon name="heroicons:user" /></div>
        <div class="mp-illus-chip mp-illus-chip-2"><Icon name="heroicons:document-text" /></div>
        <div class="mp-illus-chip mp-illus-chip-3"><Icon name="heroicons:check-badge" /></div>
        <div class="mp-illus-shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </div>
        <div class="mp-illus-pedestal" />
      </div>
    </div>

    <!-- ── Full-width hero banner with stats ── -->
    <div class="mp-hero-wrap">
      <div class="hero-card">
        <div class="hero-card-copy">
          <div class="hero-eyebrow">VERIFIED BUYER STANDARD</div>
          <div class="hero-tagline">“Trusted, ready,<br /><span class="hero-tagline-accent">chain-free.”</span></div>
          <div class="hero-name">{{ heroName }}</div>
          <div class="hero-pills">
            <div class="hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
              ID Verified
            </div>
            <div class="hero-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
              Chain Free
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="hero-stats">
          <div v-for="st in heroStats" :key="st.label" class="hero-stat">
            <div class="hero-stat-ic"><Icon :name="st.icon" class="hero-stat-ic-svg" /></div>
            <div class="hero-stat-val">{{ st.value }}</div>
            <div class="hero-stat-label">{{ st.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Two-column body: Why / What's inside ── -->
    <div class="mp-main-grid">
      <!-- LEFT: Why it matters -->
      <div class="mp-col">
        <div class="section-header">
          <div class="sec-icon sec-icon--img">
            <img src="/buyer-profile-icon/target.png" alt="" class="sec-icon-img" loading="lazy" />
          </div>
          <div>
            <div class="sec-title">WHY IT MATTERS</div>
            <div class="sec-sub">Your competitive edge</div>
          </div>
        </div>
        <div class="mp-benefits">
          <div v-for="b in benefits" :key="b.text" class="mp-benefit">
            <img :src="b.icon" alt="" class="mp-benefit-ic" loading="lazy" />
            <div class="mp-tick">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 12 5 5L20 7" />
              </svg>
            </div>
            <span>{{ b.text }}</span>
          </div>
        </div>

        <!-- Live activity -->
        <div v-if="activityStats.publishedLast7d > 0" class="live-bar">
          <img src="/buyer-profile-icon/buyers.png" alt="" class="live-bar-ic" loading="lazy" />
          <div class="pulse-dot" />
          <span>
            <strong>{{ activityStats.publishedLast7d.toLocaleString() }}</strong>
            {{ activityStats.publishedLast7d === 1 ? 'buyer' : 'buyers' }}
            verified this week · avg. 4 min to complete
          </span>
        </div>

        <!-- Complete your profile nudge -->
        <button class="mp-nudge" @click="goToBuild">
          <div class="mp-nudge-ic">
            <Icon name="heroicons:sparkles-solid" class="mp-nudge-ic-svg" />
          </div>
          <div class="mp-nudge-body">
            <div class="mp-nudge-title">Complete your profile.</div>
            <div class="mp-nudge-sub">Increase trust. Get better offers.</div>
          </div>
          <Icon name="heroicons:chevron-right" class="mp-nudge-arrow" />
        </button>
      </div>

      <!-- RIGHT: What's inside -->
      <div class="mp-col">
        <div class="section-header">
          <div class="sec-icon sec-icon--img">
            <img src="/buyer-profile-icon/clipboard.png" alt="" class="sec-icon-img" loading="lazy" />
          </div>
          <div>
            <div class="sec-title">WHAT'S INSIDE</div>
            <div class="sec-sub">Your five sections</div>
          </div>
        </div>
        <div class="options-block">
          <div v-for="s in sections" :key="s.title" class="opt-card opt-card--compact">
            <div class="opt-icon opt-icon--img">
              <img :src="s.icon" alt="" class="opt-icon-img" loading="lazy" />
            </div>
            <div class="opt-text">
              <div class="opt-title">{{ s.title }}</div>
              <div class="opt-sub">{{ s.sub }}</div>
            </div>
            <span
              class="rec-pill"
              :class="s.required ? 'rec-pill--req' : 'rec-pill--opt'"
            >
              <Icon v-if="s.required" name="heroicons:check-16-solid" class="rec-pill-ic" />
              <Icon v-else name="heroicons:sparkles-16-solid" class="rec-pill-ic" />
              {{ s.required ? 'COMPLETED' : 'OPTIONAL' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Safety footer banner ── -->
    <div class="mp-safety-banner">
      <div class="mp-safety-ic">
        <Icon name="heroicons:shield-check" class="mp-safety-ic-svg" />
      </div>
      <div class="mp-safety-text">
        <div class="mp-safety-title">Your information is safe with us</div>
        <div class="mp-safety-sub">We use bank-grade encryption to protect your data.</div>
      </div>
      <div class="mp-safety-badge">
        <Icon name="heroicons:lock-closed-solid" class="mp-safety-badge-ic" />
        100% Secure
      </div>
    </div>

    <!-- ── CTA ────────────────────────────────────────────── -->
    <div class="mp-cta-wrap">
      <button class="cta-btn" @click="goToBuild">
        <span class="cta-btn-inner">
          <img src="/buyer-profile-icon/target.png" alt="" class="cta-btn-ic" loading="lazy" />
          {{ hasProgress ? 'Continue my Profile' : 'Build my Buyer Profile' }}
          <Icon name="heroicons:arrow-right" class="cta-btn-arrow" />
        </span>
      </button>
      <div class="ghost-link">
        <span class="ghost-item"><Icon name="heroicons:bookmark" class="ghost-ic" />Save anytime</span>
        <span class="ghost-dot">·</span>
        <span class="ghost-item"><Icon name="heroicons:x-mark" class="ghost-ic" />No subscriptions</span>
        <span class="ghost-dot">·</span>
        <span class="ghost-item"><Icon name="heroicons:sparkles" class="ghost-ic" />Minimal &amp; helpful</span>
      </div>
    </div>
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBuyerProfile } from '~/composables/useBuyerProfile'
import { useProfile } from '~/composables/useProfile'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

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

const benefits = [
  { icon: '/buyer-profile-icon/house.png', text: 'Sellers take your offer seriously' },
  { icon: '/buyer-profile-icon/agent.png', text: 'Agents prioritise your viewings' },
  { icon: '/buyer-profile-icon/stopwatch.png', text: 'Solicitors can start faster' },
  { icon: '/buyer-profile-icon/verifiedDoc.png', text: 'Verified credentials replace endless paperwork' },
]

const heroStats = [
  { icon: 'heroicons:chart-bar', value: '3x', label: 'More offers accepted' },
  { icon: 'heroicons:clock', value: '5 min', label: 'Average time to complete' },
  { icon: 'heroicons:shield-check', value: '100%', label: 'Data protection guaranteed' },
]

const sections = [
  { icon: '/buyer-profile-icon/idCard.png', title: 'Verified Identity', sub: 'OneID / KYC · IDV verified', required: true },
  { icon: '/buyer-profile-icon/bank.png', title: 'Proof of Funds', sub: 'Mortgage / Bank statement', required: true },
  { icon: '/buyer-profile-icon/chain.png', title: 'Chain Position', sub: 'Free from chain, free to sell', required: true },
  { icon: '/buyer-profile-icon/scales.png', title: 'Solution & Timeline', sub: 'Move readiness signals', required: false },
  { icon: '/buyer-profile-icon/notepad.png', title: 'Your Story', sub: 'Optional buyer introduction', required: false },
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
    // Do NOT auto-redirect — let the user see the landing page.
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
  background: #f3f2ef;
  color: var(--fx-text);
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow-x: hidden;
}

.mp-mesh {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: radial-gradient(rgba(0,161,154,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* ── Web nav (shared hsw-nav block) ── */
.hsw-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.hsw-shell { width: min(1280px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { display: flex; align-items: center; gap: 9px; font-size: 16px; font-weight: 800; color: #231d45; background: none; border: none; cursor: pointer; flex-shrink: 0; }
.hsw-brand-logo { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; align-items: center; gap: 4px; }
.hsw-links button { background: none; border: none; font-size: 13.5px; font-weight: 600; color: #516070; padding: 7px 13px; border-radius: 10px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-links button:hover { color: #231d45; background: rgba(0,0,0,0.05); }
.hsw-links button.active { color: #00a19a; font-weight: 700; background: rgba(0,161,154,0.08); }
.hsw-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.hsw-back { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 700; color: #fff; background: #00a19a; border: 1px solid #00a19a; border-radius: 12px; padding: 9px 18px; cursor: pointer; box-shadow: 0 6px 16px rgba(0, 161, 154, 0.28); transition: filter 0.16s, transform 0.16s, box-shadow 0.16s; font-family: inherit; }
.hsw-back svg { width: 15px; height: 15px; flex-shrink: 0; }
.hsw-back:hover { filter: brightness(1.06); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0, 161, 154, 0.34); }
.hsw-cta { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #fff; background: #00857f; border: none; border-radius: 10px; padding: 8px 16px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-cta:hover { filter: brightness(1.06); transform: translateY(-1px); }

/* ── Main body + layout ── */
.mp-body { padding: 40px 0 80px; }

/* ───────────── Page head ───────────── */
.mp-hero-head {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 32px;
  margin-bottom: 36px;
}
.mp-hero-head-copy { min-width: 0; }
.mp-kicker {
  display: inline-flex; align-items: center;
  font-size: 12px; font-weight: 800; letter-spacing: 2px;
  color: #00a19a; text-transform: uppercase;
  margin-bottom: 16px;
}
.mp-hero-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 80px; font-weight: 800; color: #231d45;
  line-height: 1.02; margin-bottom: 16px; letter-spacing: -1.8px;
}
.mp-hero-title-accent { color: #00a19a; }
.mp-hero-sub {
  font-size: 20px; color: #627891; line-height: 1.6; font-weight: 600; max-width: 460px;
}

/* ── Floating shield illustration ── */
.mp-illus {
  position: relative;
  height: 260px;
  display: flex; align-items: center; justify-content: center;
}
.mp-illus-arc {
  position: absolute; top: 14px; left: 50%; transform: translateX(-50%);
  width: 320px; height: 200px;
  border: 1.5px dashed rgba(0, 161, 154, 0.18);
  border-bottom: none;
  border-radius: 320px 320px 0 0;
  pointer-events: none;
}
.mp-illus-shield {
  position: relative; z-index: 2;
  width: 118px; height: 134px;
  background: linear-gradient(160deg, #19c2b3 0%, #00a19a 48%, #00736e 100%);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3C/svg%3E") center / contain no-repeat;
  display: flex; align-items: center; justify-content: center;
  filter: drop-shadow(0 18px 30px rgba(0, 161, 154, 0.4));
  animation: mp-float 4s ease-in-out infinite;
}
.mp-illus-shield svg { width: 48px; height: 48px; }
.mp-illus-pedestal {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  width: 200px; height: 30px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0,161,154,0.12) 0%, transparent 70%);
}
.mp-illus-chip {
  position: absolute; z-index: 3;
  width: 44px; height: 44px; border-radius: 13px;
  background: #fff;
  border: 1px solid rgba(173, 201, 231, 0.5);
  box-shadow: 0 10px 22px rgba(15, 44, 76, 0.1);
  display: flex; align-items: center; justify-content: center;
  color: #00a19a;
}
.mp-illus-chip :deep(svg) { width: 20px; height: 20px; }
.mp-illus-chip-1 { top: 30px; left: 14%; animation: mp-float 5s ease-in-out infinite; }
.mp-illus-chip-2 { top: 18px; right: 16%; animation: mp-float 4.4s ease-in-out 0.5s infinite; }
.mp-illus-chip-3 { bottom: 64px; right: 10%; color: #4f4ff2; animation: mp-float 4.8s ease-in-out 1s infinite; }

/* ───────────── Full-width hero banner ───────────── */
.mp-hero-wrap { padding: 4px 0 0; margin-bottom: 30px; }
.hero-card {
  background: #231d45;
  box-shadow:
    0 28px 54px -18px rgba(20, 18, 56, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border-radius: 26px;
  padding: 44px 52px;
  color: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  min-height: 230px;
}
.hero-card::after {
  content: '';
  position: absolute;
  top: -30%;
  right: 4%;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.16) 0%, transparent 62%);
  pointer-events: none;
}
.hero-card-copy { position: relative; z-index: 2; flex-shrink: 0; }
@keyframes mp-shimmer {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(600%) skewX(-15deg); }
}
.hero-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #2dd4bf;
  margin-bottom: 16px;
}
.hero-tagline {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.12;
  margin-bottom: 18px;
  letter-spacing: -0.8px;
}
.hero-tagline-accent { color: #2dd4bf; }
.hero-name {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 16px;
  opacity: 0.96;
}
.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hero-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 100px;
  padding: 7px 14px;
  color: #fff;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.06);
}
.hero-pill svg { color: #2dd4bf; }

/* ── Hero stats ── */
.hero-stats {
  position: relative; z-index: 2;
  display: flex;
  gap: 40px;
  padding-left: 48px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}
.hero-stat { display: flex; flex-direction: column; align-items: flex-start; }
.hero-stat-ic {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.hero-stat-ic-svg { width: 20px; height: 20px; color: rgba(255, 255, 255, 0.92); }
.hero-stat-val { font-size: 30px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 8px; letter-spacing: -0.5px; }
.hero-stat-label { font-size: 12.5px; color: rgba(255, 255, 255, 0.6); font-weight: 600; line-height: 1.4; max-width: 110px; }

@keyframes mp-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ───────────── Two-column body ───────────── */
.mp-main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;
  align-items: start;
}
.mp-col { display: flex; flex-direction: column; }
.mp-cta-wrap { padding-top: 28px; }

/* ───────────── Section header ───────────── */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 2px 10px;
}
.sec-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #e3f4f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sec-icon-svg { width: 20px; height: 20px; color: #00a19a; }
/* 3D PNG header icon — drop the tinted chip, show the artwork */
.sec-icon--img { background: transparent; }
.sec-icon-img { width: 34px; height: 34px; object-fit: contain; }
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
  border-radius: 22px;
  border: 1px solid rgba(173, 201, 231, 0.4);
  background: #fff;
  box-shadow: 0 12px 30px rgba(15, 44, 76, 0.07);
  padding: 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: relative;
}
.mp-benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #17314a;
  position: relative;
}
.mp-benefit-ic {
  width: 34px;
  height: 34px;
  object-fit: contain;
  flex-shrink: 0;
}
/* vertical connector line between ticks */
.mp-benefit:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 14px; top: 30px;
  width: 1.5px; height: 22px;
  background: linear-gradient(180deg, rgba(0,161,154,0.4), rgba(0,161,154,0.1));
}
.mp-tick {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  box-shadow: 0 4px 10px rgba(0,161,154,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

/* ───────────── Complete-profile nudge ───────────── */
.mp-nudge {
  margin-top: 16px;
  display: flex; align-items: center; gap: 16px;
  width: 100%; text-align: left; cursor: pointer;
  font-family: inherit;
  background: #fff;
  border: 1px solid rgba(173, 201, 231, 0.4);
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 8px 22px rgba(15, 44, 76, 0.06);
  transition: all 0.2s cubic-bezier(.22,1,.36,1);
}
.mp-nudge:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(15,44,76,0.1); border-color: #c5b8f5; }
.mp-nudge-ic {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #ece9ff, #eef4ff);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mp-nudge-ic-svg { width: 22px; height: 22px; color: #6a5af0; }
.mp-nudge-body { flex: 1; min-width: 0; }
.mp-nudge-title { font-size: 15px; font-weight: 800; color: #17314a; margin-bottom: 2px; }
.mp-nudge-sub { font-size: 13px; color: #627891; font-weight: 600; }
.mp-nudge-arrow { width: 22px; height: 22px; color: #9aa9bd; flex-shrink: 0; }

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
.live-bar-ic { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; }
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
  gap: 12px;
}
.opt-card {
  background: #fff;
  border: 1px solid #e8eef5;
  border-radius: 16px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 18px rgba(19, 51, 82, 0.05);
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
  width: 44px; height: 44px;
  border-radius: 12px;
  background: #eef2f7;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.opt-icon-svg { width: 22px; height: 22px; color: #3a4a5e; }
/* 3D PNG section-row icon — transparent chip so the artwork floats */
.opt-icon--img { background: transparent; }
.opt-icon-img { width: 40px; height: 40px; object-fit: contain; }
.opt-text { flex: 1; min-width: 0; }
.opt-title {
  font-size: 15px;
  font-weight: 800;
  color: #17314a;
}
.opt-sub {
  font-size: 12.5px;
  color: #627891;
  margin-top: 2px;
}
.rec-pill {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px;
  font-weight: 800;
  padding: 5px 11px;
  border-radius: 100px;
  letter-spacing: 0.6px;
  flex-shrink: 0;
}
.rec-pill-ic { width: 12px; height: 12px; }
.rec-pill--req {
  background: #e2f1ea;
  color: #067a74;
  border: 1px solid rgba(0, 161, 154, 0.25);
}
.rec-pill--opt {
  background: #eef0ff;
  color: #6a6ae0;
  border: 1px solid rgba(106,106,224,0.2);
}

/* ───────────── Safety banner ───────────── */
.mp-safety-banner {
  margin-top: 36px;
  display: flex; align-items: center; gap: 18px;
  background: #fff;
  border: 1px solid rgba(173, 201, 231, 0.4);
  border-radius: 20px;
  padding: 22px 28px;
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.06);
}
.mp-safety-ic {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #ece9ff, #eef4ff);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.mp-safety-ic-svg { width: 22px; height: 22px; color: #4f4ff2; }
.mp-safety-text { flex: 1; min-width: 0; }
.mp-safety-title { font-size: 15px; font-weight: 800; color: #231d45; margin-bottom: 2px; }
.mp-safety-sub { font-size: 13px; color: #627891; font-weight: 600; }
.mp-safety-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 800; color: #067a74;
  white-space: nowrap; flex-shrink: 0;
}
.mp-safety-badge-ic { width: 15px; height: 15px; color: #067a74; }

/* ───────────── CTA ───────────── */
.mp-cta-wrap { padding: 20px 0 0; }
.cta-btn {
  width: 100%;
  background: #00a19a;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 22px;
  font-size: 17px;
  font-weight: 800;
  font-family: inherit;
  box-shadow: 0 18px 32px rgba(20, 18, 56, 0.28);
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
  box-shadow: 0 18px 30px rgba(20, 18, 56, 0.34);
  filter: saturate(1.06);
}
.cta-btn-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.cta-btn-arrow { width: 18px; height: 18px; }
.cta-btn-ic { width: 24px; height: 24px; object-fit: contain; flex-shrink: 0; }
.ghost-link {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #627891;
  padding: 18px 10px 4px;
}
.ghost-item { display: inline-flex; align-items: center; gap: 6px; }
.ghost-ic { width: 15px; height: 15px; color: #8a97a8; }
.ghost-dot { color: #c2cdd9; }

@media (max-width: 980px) {
  .mp-main-grid { grid-template-columns: 1fr; gap: 28px; }
  .mp-hero-head { grid-template-columns: 1fr; gap: 8px; }
  .mp-illus { order: -1; height: 200px; }
  .mp-hero-title { font-size: 42px; }
  .mp-hero-sub { max-width: 100%; }
  .hero-card { flex-direction: column; align-items: flex-start; padding: 32px; min-height: 0; gap: 28px; }
  .hero-stats {
    width: 100%;
    padding-left: 0;
    border-left: none;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    justify-content: space-between;
    gap: 16px;
  }
  .mp-safety-banner { flex-wrap: wrap; }
}
@media (max-width: 760px) {
  .hsw-links, .hsw-cta { display: none; }
  .mp-hero-head { margin-bottom: 22px; }
  .mp-hero-title { font-size: 30px; letter-spacing: -0.8px; }
  .mp-hero-sub { font-size: 14px; }
  .hero-card { padding: 26px 22px; border-radius: 22px; }
  .hero-tagline { font-size: 27px; }
  .hero-name { font-size: 16px; }
  .hero-stat-val { font-size: 24px; }
  .mp-illus { height: 170px; }
  .mp-body { padding: 24px 0 56px; }
  .mp-benefits { padding: 20px; gap: 18px; }
  .opt-card { padding: 14px; }
  .cta-btn { padding: 18px; font-size: 15px; }
}
@media (max-width: 480px) {
  .mp-hero-title { font-size: 26px; }
  .hero-tagline { font-size: 23px; }
  .hero-pills { gap: 6px; }
  .hero-pill { font-size: 11px; padding: 6px 11px; }
  .hero-stats { flex-wrap: wrap; gap: 18px; }
  .hero-stat { min-width: 42%; }
  /* Safety banner stacks: text full width, badge below */
  .mp-safety-banner { padding: 18px 20px; gap: 14px; }
  .mp-safety-badge { width: 100%; }
  /* What's-inside pills don't shrink the title */
  .opt-title { font-size: 14px; }
  .opt-sub { font-size: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-card,
  .opt-card,
  .cta-btn,
  .mp-nudge,
  .mp-illus-shield,
  .mp-illus-chip,
  .pulse-dot::after {
    transition: none;
    animation: none;
  }
}
</style>
