<template>
  <div class="bph-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" class="active" @click="navigateTo('/dashboard')">Explore</button>
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

    <!-- ── Page head ── -->
    <div class="hsw-shell bph-hero-head">
      <div>
        <p class="bph-eyebrow">Buyer Passport</p>
        <h1 class="bph-h1">Your Buyer Passport</h1>
        <p class="bph-sub">Build trust. Show you're a serious, ready buyer.</p>
      </div>
      <button class="bph-info-btn" type="button" @click="showInfo = true">
        <Icon name="i-lucide-circle-help" class="bph-info-ic" />
        What is a Buyer Passport?
      </button>
    </div>

    <main class="hsw-shell bph-layout">
      <!-- ── Left: passport card + progress + privacy ── -->
      <aside class="bph-aside">
        <div class="bph-hero-card" @click="goToBuild">
          <img
            src="/op-icons/passport-covers/buyer_tilted_right_on_tile.png"
            alt=""
            class="bph-hero-icon"
            loading="lazy"
          />
          <div class="bph-hero-body">
            <div class="bph-hero-title">Your Buyer Passport</div>
            <div class="bph-hero-sub">
              Build trust. Show you're a serious, ready buyer.
            </div>
            <span class="bph-status-pill" :class="'bph-status-pill--' + statusKey">
              <span class="bph-status-dot" />
              {{ statusLabel }}
            </span>
          </div>
        </div>

        <!-- Progress -->
        <div class="bph-progress-block">
          <div class="bph-progress-row">
            <span class="bph-progress-label">Passport progress</span>
            <span class="bph-progress-pct">{{ progressPct }}%</span>
          </div>
          <div class="bph-progress-track">
            <div class="bph-progress-fill" :style="{ width: progressPct + '%' }" />
          </div>
          <p class="bph-progress-hint">
            Complete your passport to verify who you are and your buying position.
          </p>
        </div>

        <button class="bph-cta" @click="goToBuild">
          {{ progressPct > 0 ? 'Continue my Passport' : 'Start my Passport' }}
          <Icon name="i-lucide-arrow-right" class="bph-cta-ic" />
        </button>

        <!-- Secure / private banner -->
        <div class="bph-secure-banner">
          <img
            src="/op-icons/investment/padlock.png"
            alt=""
            class="bph-secure-ic"
            loading="lazy"
          />
          <div>
            <div class="bph-secure-h">Your information is secure and private.</div>
            <div class="bph-secure-v">You choose what to share and with whom.</div>
          </div>
        </div>
      </aside>

      <!-- ── Right: checklist ── -->
      <div class="bph-content">
        <div class="bph-checklist">
          <div
            v-for="(item, i) in checklistItems"
            :key="item.key"
            class="bph-check-row"
            @click="goToBuild"
          >
            <div class="bph-check-icon" :class="{ 'is-done': item.done }">
              <img :src="item.icon" alt="" loading="lazy" />
            </div>
            <div class="bph-check-body">
              <div class="bph-check-title">{{ i + 1 }}. {{ item.title }}</div>
              <div class="bph-check-sub">{{ item.sub }}</div>
            </div>
            <span v-if="item.done" class="bph-check-done">
              <Icon name="heroicons:check-16-solid" class="bph-check-done-ic" />
              Complete
            </span>
            <span class="bph-check-chev">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- Info dialog -->
    <Teleport to="body">
      <div v-if="showInfo" class="bph-sheet-overlay" @click="showInfo = false" />
      <div v-if="showInfo" class="bph-sheet" role="dialog" aria-modal="true">
        <h3 class="bph-sheet-title">What is a Buyer Passport?</h3>
        <p class="bph-sheet-body">
          A verified profile that shows sellers and agents you're a serious,
          ready buyer — your identity, buying position, finances and chain
          position, all confirmed up front. Verified buyers get 3× more offers
          accepted.
        </p>
        <button class="bph-sheet-close" @click="showInfo = false">Got it</button>
      </div>
    </Teleport>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBuyerProfile } from '~/composables/useBuyerProfile'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const router = useRouter()
const { getBuyerProfile } = useBuyerProfile()

const existing = ref<any>(null)
const showInfo = ref(false)

const goBack = useGoBack('/profile')

// Completion per core step — mirrors the 4-step wizard in build.vue
// (Identity / Buying position / Finance / Chain position).
const stepDone = computed(() => {
  const p = existing.value
  return {
    identity: !!p?.idVerified,
    buying: !!(p?.timeline && p?.propertyType),
    finance: !!p?.fundsType,
    chain: !!p?.chainPosition,
  }
})

const checklistItems = computed(() => [
  {
    key: 'identity',
    icon: '/op-icons/buyer-profile-build/idCard.png',
    title: 'Your identity',
    sub: 'Verify your identity to get started.',
    done: stepDone.value.identity,
  },
  {
    key: 'buying',
    icon: '/op-icons/buyer-profile-build/target.png',
    title: 'Buying position',
    sub: 'Tell us about your buying plans.',
    done: stepDone.value.buying,
  },
  {
    key: 'finance',
    icon: '/op-icons/buyer-profile-build/bank.png',
    title: 'Finance',
    sub: 'Add proof of funds or mortgage position.',
    done: stepDone.value.finance,
  },
  {
    key: 'chain',
    icon: '/op-icons/investment/chainLink.png',
    title: 'Chain position',
    sub: 'Help sellers understand your position in the chain.',
    done: stepDone.value.chain,
  },
])

const completedCount = computed(
  () => Object.values(stepDone.value).filter(Boolean).length,
)
const progressPct = computed(() => Math.round((completedCount.value / 4) * 100))
const statusKey = computed(() => {
  if (progressPct.value === 100) return 'complete'
  if (progressPct.value > 0) return 'progress'
  return 'not-started'
})
const statusLabel = computed(() => {
  if (statusKey.value === 'complete') return 'Complete'
  if (statusKey.value === 'progress') return 'In progress'
  return 'Not started'
})

function goToBuild() {
  router.push('/buyer-profile/build')
}

onMounted(async () => {
  try {
    const data = await getBuyerProfile()
    existing.value = data
    if (data?.published) {
      router.replace('/buyer-profile/view')
    }
  } catch {
    /* token may be missing — stay on the checklist */
  }
})
</script>

<style scoped>
.bph-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: clip;
}

/* ── Web nav ── */
.hsw-nav { position: sticky; top: 0; z-index: 100; background: rgba(243,242,239,0.88); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(35,29,69,0.07); }
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; letter-spacing: -0.4px; color: #231d45; background: none; border: none; cursor: pointer; flex-shrink: 0; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; align-items: center; gap: 4px; }
.hsw-links button { background: none; border: none; font-size: 13.5px; font-weight: 600; color: #516070; padding: 7px 13px; border-radius: 10px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-links button:hover { color: #231d45; background: rgba(0,0,0,0.05); }
.hsw-links button.active { color: #00a19a; font-weight: 700; background: rgba(0,161,154,0.08); }
.hsw-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.hsw-back { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #516070; background: rgba(255,255,255,0.8); border: 1px solid rgba(173,201,231,0.5); border-radius: 10px; padding: 7px 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-back svg { width: 15px; height: 15px; flex-shrink: 0; }
.hsw-back:hover { color: #231d45; border-color: #b9d5ea; }

/* ── Page head ── */
.bph-hero-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 34px 0 6px; }
.bph-eyebrow {
  margin: 0 0 12px; font-size: 12.5px; font-weight: 700;
  letter-spacing: 1.75px; text-transform: uppercase; color: #00a19a;
}
.bph-h1 {
  margin: 0; font-size: clamp(28px, 3.4vw, 40px); font-weight: 800;
  line-height: 1.08; letter-spacing: -0.02em; color: #231d45;
}
.bph-sub { margin: 14px 0 0; max-width: 480px; font-size: 15.5px; font-weight: 500; line-height: 1.6; color: #5b6e86; }
.bph-info-btn {
  flex-shrink: 0; display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: #231d45;
  background: #fff; border: 1px solid rgba(173,201,231,0.5);
  border-radius: 100px; padding: 9px 16px; cursor: pointer; font-family: inherit;
  transition: all 0.18s;
}
.bph-info-btn:hover { border-color: #b9d5ea; box-shadow: 0 4px 12px rgba(15,44,76,0.08); }
.bph-info-ic { width: 15px; height: 15px; color: #94a3b8; }

/* ── Two-column layout ── */
.bph-layout { display: grid; grid-template-columns: 380px minmax(0,1fr); gap: 32px; align-items: start; padding: 24px 0 40px; }
.bph-aside { display: flex; flex-direction: column; gap: 16px; }

/* ── Hero card ── */
.bph-hero-card {
  background: #fff; border: 1.5px solid #e2f1ea; border-radius: 20px;
  padding: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer;
  box-shadow: 0 10px 28px -12px rgba(0, 40, 38, 0.14);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.bph-hero-card:hover { border-color: #b9e3da; box-shadow: 0 14px 34px -12px rgba(0, 40, 38, 0.2); }
.bph-hero-icon { width: 76px; height: auto; object-fit: contain; flex-shrink: 0; }
.bph-hero-body { flex: 1; min-width: 0; }
.bph-hero-title { color: #231d45; font-size: 17px; font-weight: 800; letter-spacing: -0.2px; margin-bottom: 4px; }
.bph-hero-sub { color: #6b7089; font-size: 12.5px; line-height: 1.4; margin-bottom: 12px; }
.bph-status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f2faf8; border: 1px solid #d7ece9; color: #00857f;
  font-size: 11px; font-weight: 700; padding: 5px 11px; border-radius: 100px;
}
.bph-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #9c98ad; }
.bph-status-pill--progress .bph-status-dot,
.bph-status-pill--complete .bph-status-dot { background: #4ade80; }

/* ── Progress block ── */
.bph-progress-block {
  background: #fff; border: 1px solid #e8eef5; border-radius: 18px; padding: 18px 20px;
}
.bph-progress-row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px; }
.bph-progress-label { font-size: 14px; font-weight: 800; color: #231d45; }
.bph-progress-pct { font-size: 13px; font-weight: 700; color: #94a3b8; }
.bph-progress-track { height: 8px; border-radius: 100px; background: #e7e8ec; overflow: hidden; }
.bph-progress-fill { height: 100%; background: #00a19a; border-radius: 100px; transition: width 0.3s ease; }
.bph-progress-hint { font-size: 12.5px; color: #6b6783; line-height: 1.5; margin: 10px 0 0; }

/* ── CTA ── */
.bph-cta {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; background: #00a19a; color: #fff; border: none;
  border-radius: 14px; padding: 15px; font-size: 14.5px; font-weight: 800;
  font-family: inherit; cursor: pointer; transition: background 0.18s;
}
.bph-cta:hover { background: #00857f; }
.bph-cta-ic { width: 17px; height: 17px; }

/* ── Secure banner ── */
.bph-secure-banner {
  background: #f2faf8; border: 1px solid #dcf0ee; border-radius: 16px;
  padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px;
}
.bph-secure-ic { width: 30px; height: 30px; object-fit: contain; flex-shrink: 0; margin-top: 1px; }
.bph-secure-h { font-size: 12.5px; font-weight: 800; color: #007e78; line-height: 1.4; }
.bph-secure-v { font-size: 12px; color: #4b8c87; line-height: 1.4; margin-top: 2px; }

/* ── Checklist ── */
.bph-checklist { display: flex; flex-direction: column; gap: 12px; }
.bph-check-row {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1px solid #eef0f6; border-radius: 16px;
  padding: 18px; cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 3px rgba(35, 29, 69, 0.05);
}
.bph-check-row:hover { border-color: #d7ece9; box-shadow: 0 6px 18px -8px rgba(15, 44, 76, 0.16); }
.bph-check-icon {
  width: 54px; height: 54px; border-radius: 14px;
  background: #f2faf8; border: 1px solid #e5f4f2;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bph-check-icon img { width: 32px; height: 32px; object-fit: contain; }
.bph-check-icon.is-done { background: #e8f9ee; border-color: #cdeedb; }
.bph-check-body { flex: 1; min-width: 0; }
.bph-check-title { font-size: 14.5px; font-weight: 800; color: #231d45; letter-spacing: -0.1px; margin-bottom: 2px; }
.bph-check-sub { font-size: 12px; color: #6b6783; line-height: 1.4; }
.bph-check-done {
  display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0;
  font-size: 10px; font-weight: 800; letter-spacing: 0.3px;
  background: #e8f5ee; color: #2eab55; border: 1px solid #b8e8c8;
  border-radius: 100px; padding: 4px 9px; text-transform: uppercase;
}
.bph-check-done-ic { width: 12px; height: 12px; }
.bph-check-chev { color: #c3c5cf; flex-shrink: 0; display: flex; }

/* ── Info dialog ── */
.bph-sheet-overlay { position: fixed; inset: 0; background: rgba(15, 12, 30, 0.45); z-index: 60; }
.bph-sheet {
  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(440px, calc(100% - 40px));
  background: #fff; border-radius: 20px; padding: 26px;
  box-shadow: 0 24px 60px rgba(15, 44, 76, 0.24); z-index: 61;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
}
.bph-sheet-title { font-size: 17px; font-weight: 800; color: #231d45; margin: 0 0 10px; }
.bph-sheet-body { font-size: 13.5px; color: #6b6783; line-height: 1.55; margin: 0 0 20px; }
.bph-sheet-close {
  width: 100%; background: #00a19a; color: #fff; border: none;
  border-radius: 14px; padding: 14px; font-size: 14px; font-weight: 800;
  font-family: inherit; cursor: pointer;
}
.bph-sheet-close:hover { background: #00857f; }

/* ── Responsive ── */
@media (max-width: 940px) {
  .bph-layout { grid-template-columns: 1fr; gap: 20px; }
  .bph-hero-head { flex-direction: column; align-items: flex-start; gap: 16px; }
}
@media (max-width: 720px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .bph-check-row { padding: 14px; }
  .bph-check-done { display: none; }
}
</style>
