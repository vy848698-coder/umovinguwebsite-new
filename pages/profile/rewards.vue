<template>
  <div class="rw-page">
    <WebTopNav>
      <template #actions>
        <button class="rw-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="rw-quick-btn solid" type="button" @click="navigateTo('/marketplace')">Marketplace</button>
      </template>
    </WebTopNav>

    <main class="rw-body">
      <!-- ── Hero ─────────────────────────────────────────────────── -->
      <header class="rw-hero">
        <div class="rw-hero-copy">
          <p class="rw-kicker"><span class="rw-kicker-dot" />Passport Rewards</p>
          <h1 class="rw-h1">Points you've earned,<br />and what they unlock</h1>
          <p class="rw-sub">
            Every useful step you complete on your Property Passport earns
            Passport Points. Track your balance, your stamps, and the rewards
            waiting for you here.
          </p>
          <div class="rw-hero-identity">
            <UserAvatar
              :src="profile?.avatarUrl"
              :firstName="profile?.firstName"
              :lastName="profile?.lastName"
              :size="44"
            />
            <div>
              <div class="rw-hero-name">{{ fullName || 'Your account' }}</div>
              <div class="rw-hero-role">{{ hasPassport ? 'Property Passport Member' : 'UMU Member' }}</div>
            </div>
          </div>
        </div>
        <img src="/profile%20new%20icon/rewards.png" alt="" class="rw-hero-art" />
      </header>

      <!-- ── Balance / stats ──────────────────────────────────────── -->
      <section class="rw-stats">
        <div class="rw-stat">
          <img src="/profile%20new%20icon/passportPoints.png" alt="" class="rw-stat-ic" loading="lazy" />
          <div class="rw-stat-copy">
            <div v-if="loadingBalance" class="rw-skel" />
            <div v-else class="rw-stat-num">{{ balance.toLocaleString('en-GB') }}</div>
            <div class="rw-stat-lab">Passport Points</div>
          </div>
        </div>

        <div class="rw-stat">
          <img src="/profile%20new%20icon/rewardsReady.png" alt="" class="rw-stat-ic" loading="lazy" />
          <div class="rw-stat-copy">
            <div v-if="loadingCatalogue" class="rw-skel" />
            <div v-else class="rw-stat-num">{{ rewardsReadyCount }}</div>
            <div class="rw-stat-lab">Rewards ready</div>
          </div>
        </div>

        <div class="rw-stat">
          <img src="/homescore-icon/trophy.png" alt="" class="rw-stat-ic" loading="lazy" />
          <div class="rw-stat-copy">
            <div v-if="loadingStamps" class="rw-skel" />
            <div v-else class="rw-stat-num">
              {{ earnedStampIds.size }}<small v-if="stampCatalogue.length">/{{ stampCatalogue.length }}</small>
            </div>
            <div class="rw-stat-lab">Passport stamps</div>
          </div>
        </div>

        <div v-if="!loadingCatalogue && nextReward" class="rw-stat rw-stat--progress">
          <div class="rw-stat-copy">
            <div class="rw-stat-num">{{ pointsToNext.toLocaleString('en-GB') }}</div>
            <div class="rw-stat-lab">Points to your next reward</div>
            <div class="rw-progress-track">
              <div class="rw-progress-fill" :style="{ width: `${nextRewardProgressPct}%` }" />
            </div>
            <div class="rw-progress-next">Next up · {{ nextReward.title }}</div>
          </div>
        </div>
      </section>

      <!-- ── Marketplace notice ───────────────────────────────────── -->
      <section class="rw-launch">
        <img src="/profile%20new%20icon/rocket.png" alt="" class="rw-launch-ic" loading="lazy" />
        <div class="rw-launch-copy">
          <h2 class="rw-launch-title">Marketplace launching soon</h2>
          <p class="rw-launch-sub">
            Your rewards are being unlocked now and will be ready to claim when
            the marketplace goes live. Nothing expires in the meantime — keep
            earning and your balance carries over.
          </p>
        </div>
        <button class="rw-launch-btn" type="button" @click="navigateTo('/marketplace')">
          Preview the marketplace
        </button>
      </section>

      <!-- ── Rewards catalogue ────────────────────────────────────── -->
      <section class="rw-panel">
        <div class="rw-panel-head">
          <div>
            <p class="rw-overline">Rewards catalogue</p>
            <h2 class="rw-panel-title">What your points unlock</h2>
          </div>
          <span v-if="!loadingCatalogue && catalogue.length" class="rw-count-pill">
            {{ readyRewards.length }} of {{ catalogue.length }} unlocked
          </span>
        </div>

        <div v-if="loadingCatalogue" class="rw-loading"><div class="rw-spinner" /></div>

        <template v-else-if="catalogue.length">
          <template v-if="readyRewards.length">
            <p class="rw-sec-label">Rewards waiting for you</p>
            <div class="rw-cards-grid">
              <article v-for="item in readyRewards" :key="item.id" class="rw-reward-card">
                <div class="rw-reward-tile" :style="{ background: tileBackground(item) }">
                  <img v-if="tileIcon(item)" :src="tileIcon(item)!" alt="" class="rw-reward-tile-img" loading="lazy" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="34" height="34">
                    <rect x="3" y="9" width="14" height="10" rx="1.5" />
                    <path d="M17 12h3.2a1 1 0 0 1 .9.55L23 16v3a1 1 0 0 1-1 1h-1" />
                    <circle cx="7.5" cy="19" r="1.6" />
                    <circle cx="17.5" cy="19" r="1.6" />
                  </svg>
                </div>
                <div class="rw-reward-partner">{{ item.partner }}</div>
                <h3 class="rw-reward-title">{{ item.title }}</h3>
                <span class="rw-reward-pill rw-reward-pill--unlocked">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="11" height="11"><polyline points="20 6 9 17 4 12" /></svg>
                  Unlocked
                </span>
                <p class="rw-reward-note">{{ item.description || 'Available at launch.' }}</p>
              </article>
            </div>
          </template>

          <template v-if="lockedRewards.length">
            <p class="rw-sec-label">More rewards to unlock</p>
            <div class="rw-cards-grid">
              <article
                v-for="item in lockedRewards"
                :key="item.id"
                class="rw-reward-card rw-reward-card--locked"
              >
                <div class="rw-reward-tile rw-reward-tile--locked">
                  <img v-if="tileIcon(item)" :src="tileIcon(item)!" alt="" class="rw-reward-tile-img rw-reward-tile-img--locked" loading="lazy" />
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
                    <rect x="3" y="9" width="14" height="10" rx="1.5" />
                    <path d="M17 12h3.2a1 1 0 0 1 .9.55L23 16v3a1 1 0 0 1-1 1h-1" />
                    <circle cx="7.5" cy="19" r="1.6" />
                    <circle cx="17.5" cy="19" r="1.6" />
                  </svg>
                  <span class="rw-reward-tile-lock">
                    <img src="/op-icons/passportview/pointsLock.svg" alt="" width="11" height="14" />
                  </span>
                </div>
                <div class="rw-reward-partner">{{ item.partner }}</div>
                <h3 class="rw-reward-title">{{ item.title }}</h3>
                <div class="rw-reward-meter">
                  <div class="rw-reward-meter-fill" :style="{ width: `${unlockPct(item)}%` }" />
                </div>
                <p class="rw-reward-note">
                  Unlock at {{ item.pointsRequired.toLocaleString('en-GB') }} points
                  <span class="rw-reward-gap">· {{ (item.pointsRequired - balance).toLocaleString('en-GB') }} to go</span>
                </p>
              </article>
            </div>
          </template>
        </template>

        <div v-else class="rw-empty">
          <img src="/homescore-icon/gift.png" alt="" class="rw-empty-ic" loading="lazy" />
          <p class="rw-empty-title">Rewards catalogue coming soon</p>
          <p class="rw-empty-sub">Keep earning points — offers will appear here as partners come on board.</p>
        </div>
      </section>

      <!-- ── Stamps + ways to earn ────────────────────────────────── -->
      <div class="rw-split">
        <section class="rw-panel">
          <div class="rw-panel-head">
            <div>
              <p class="rw-overline">Passport stamps</p>
              <h2 class="rw-panel-title">Milestones you've stamped</h2>
            </div>
            <span v-if="!loadingStamps && stampCatalogue.length" class="rw-count-pill">
              {{ earnedStampIds.size }} of {{ stampCatalogue.length }} earned
            </span>
          </div>

          <div v-if="loadingStamps" class="rw-loading"><div class="rw-spinner" /></div>

          <div v-else-if="stampCatalogue.length" class="rw-stamps-grid">
            <!-- No :title passed to StampFrame — this grid prints the full
                 title underneath instead. The title-inside-the-ring variant is
                 for the single large celebration stamp, and longer achievement
                 names spill past the ring at this size. -->
            <div
              v-for="def in stampCatalogue"
              :key="def.id"
              class="rw-stamp-cell"
              :class="{ 'rw-stamp-cell--locked': !earnedStampIds.has(def.id) }"
            >
              <StampFrame :icon-asset="earnedStampIds.has(def.id) ? def.iconAsset : null" :size="88" />
              <div class="rw-stamp-label">{{ def.title }}</div>
            </div>
          </div>

          <div v-else class="rw-empty">
            <img src="/homescore-icon/target.png" alt="" class="rw-empty-ic" loading="lazy" />
            <p class="rw-empty-title">No stamps yet</p>
            <p class="rw-empty-sub">Complete a Passport section to earn your first stamp.</p>
          </div>
        </section>

        <section class="rw-panel rw-earn">
          <p class="rw-overline">Ways to earn</p>
          <h2 class="rw-panel-title">How points add up</h2>
          <p class="rw-earn-intro">
            Points come from completing useful steps — the same work that makes
            your Passport worth sharing.
          </p>
          <button
            v-for="way in earnWays"
            :key="way.title"
            type="button"
            class="rw-earn-row"
            @click="navigateTo(way.route)"
          >
            <img :src="way.icon" alt="" class="rw-earn-ic" loading="lazy" />
            <span class="rw-earn-copy">
              <span class="rw-earn-title">{{ way.title }}</span>
              <span class="rw-earn-sub">{{ way.sub }}</span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="rw-earn-chev">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </section>
      </div>

      <!-- ── History ──────────────────────────────────────────────── -->
      <section class="rw-panel">
        <div class="rw-panel-head">
          <div>
            <p class="rw-overline">Points history</p>
            <h2 class="rw-panel-title">Everything you've earned</h2>
          </div>
          <span v-if="entries.length" class="rw-count-pill">{{ entries.length }} entries</span>
        </div>

        <div v-if="loadingHistory && entries.length === 0" class="rw-loading"><div class="rw-spinner" /></div>

        <div v-else-if="entries.length === 0" class="rw-empty">
          <img src="/homescore-icon/cashAndCoins.png" alt="" class="rw-empty-ic" loading="lazy" />
          <p class="rw-empty-title">No points yet</p>
          <p class="rw-empty-sub">
            Complete useful steps — like verifying your identity or claiming a
            property — to start earning.
          </p>
          <button class="rw-empty-btn" type="button" @click="navigateTo('/claim')">Claim your property</button>
        </div>

        <div v-else class="rw-list">
          <RewardHistoryRow v-for="entry in entries" :key="entry.id" :entry="entry" />
          <button v-if="nextCursor" class="rw-loadmore" :disabled="loadingHistory" @click="loadMore">
            {{ loadingHistory ? 'Loading…' : 'Load more' }}
          </button>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import StampFrame from '~/components/rewards/StampFrame.vue'
import RewardHistoryRow from '~/components/profile/RewardHistoryRow.vue'

definePageMeta({
  title: 'Rewards - UmovingU',
  middleware: 'auth',
})

const config = useRuntimeConfig()
const { profile, fullName, fetchProfile } = useProfile()

const balance = ref(0)
const loadingBalance = ref(true)
const hasPassport = ref(false)

// Desktop shows the list inline and pages it in place — no bottom-sheet
// drawer like the mobile app, where screen height forced a 5-row preview.
const HISTORY_PAGE = 20
const entries = ref<any[]>([])
const nextCursor = ref<string | null>(null)
const loadingHistory = ref(true)

interface CatalogueItem {
  id: string
  partner: string
  title: string
  description: string | null
  pointsRequired: number
}
const catalogue = ref<CatalogueItem[]>([])
const loadingCatalogue = ref(true)

interface StampDef {
  id: string
  key: string
  title: string
  iconAsset: string | null
}
const earnedStamps = ref<Array<{ stampDefinitionId: string }>>([])
const stampCatalogue = ref<StampDef[]>([])
const loadingStamps = ref(true)
const earnedStampIds = computed(() => new Set(earnedStamps.value.map((s) => s.stampDefinitionId)))

function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  return { Authorization: `Bearer ${token}` }
}

// Nothing is actually redeemable yet (no redemption backend) — "ready" here
// just means the balance already covers the points required, purely for the
// "N rewards ready" / "Unlocked" display.
const readyRewards = computed(() => catalogue.value.filter((c) => balance.value >= c.pointsRequired))
const lockedRewards = computed(() => catalogue.value.filter((c) => balance.value < c.pointsRequired))
const rewardsReadyCount = computed(() => readyRewards.value.length)
const nextReward = computed(() =>
  lockedRewards.value.length
    ? [...lockedRewards.value].sort((a, b) => a.pointsRequired - b.pointsRequired)[0]
    : null,
)
const pointsToNext = computed(() => (nextReward.value ? nextReward.value.pointsRequired - balance.value : 0))
const nextRewardProgressPct = computed(() => {
  if (!nextReward.value) return 100
  const prevThreshold = readyRewards.value.reduce((max, r) => Math.max(max, r.pointsRequired), 0)
  const span = nextReward.value.pointsRequired - prevThreshold
  if (span <= 0) return 0
  return Math.min(100, Math.max(0, Math.round(((balance.value - prevThreshold) / span) * 100)))
})

function unlockPct(item: CatalogueItem) {
  if (item.pointsRequired <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((balance.value / item.pointsRequired) * 100)))
}

// Small deterministic palette so each partner tile gets a stable colour
// without needing real partner logo assets.
const PALETTE = [
  'linear-gradient(135deg, #231d45, #352d5c)',
  'linear-gradient(135deg, #00a19a, #00635e)',
  'linear-gradient(135deg, #c9974a, #9a6e2c)',
  'linear-gradient(135deg, #4a4566, #231d45)',
]
function tileBackground(item: CatalogueItem) {
  const idx = catalogue.value.findIndex((c) => c.id === item.id)
  return PALETTE[idx % PALETTE.length]
}

// Real icon assets matched by partner name (small, known seed set).
const TILE_ICON_BY_PARTNER: Record<string, string> = {
  'Todd & Co Solicitors': '/buyer-profile-icon/scales.png',
  'Broadband Partner': '/property-cards/broadband.jpeg',
  'Storage Partner': '/profile%20new%20icon/storageUnit.png',
  AnyVan: '/profile%20new%20icon/removalsVan.png',
}
function tileIcon(item: CatalogueItem) {
  return TILE_ICON_BY_PARTNER[item.partner] ?? null
}

// Routes into the work that actually credits points — descriptive only, no
// per-step point values are shown since the backend owns those amounts.
const earnWays = [
  {
    title: 'Verify your identity',
    sub: 'Complete your Buyer Profile with verified ID and proof of funds.',
    icon: '/buyer-profile-icon/idCard.png',
    route: '/buyer-profile',
  },
  {
    title: 'Claim your property',
    sub: 'Confirm you own the home and open up your Property Passport.',
    icon: '/homescore-icon/house.png',
    route: '/claim',
  },
  {
    title: 'Answer Passport questions',
    sub: 'Each completed section adds points and earns you a stamp.',
    icon: '/homescore-icon/clipboardChecklist.png',
    route: '/passport',
  },
  {
    title: 'Add your running costs',
    sub: 'Upload real bills so your HomeScore reflects what the home costs.',
    icon: '/homescore-icon/utilityBills.png',
    route: '/homescore',
  },
]

async function loadBalance() {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/rewards/balance`, { headers: authHeaders() })
    balance.value = res?.balance ?? 0
  } catch {
    /* stays at 0 */
  } finally {
    loadingBalance.value = false
  }
}

async function loadCatalogue() {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/rewards/catalogue`, { headers: authHeaders() })
    catalogue.value = Array.isArray(res) ? res : []
  } catch {
    /* catalogue just stays empty on failure */
  } finally {
    loadingCatalogue.value = false
  }
}

async function loadHistory(cursor?: string) {
  loadingHistory.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/rewards/history`, {
      headers: authHeaders(),
      query: { limit: HISTORY_PAGE, ...(cursor ? { cursor } : {}) },
    })
    entries.value = cursor ? [...entries.value, ...(res?.entries ?? [])] : (res?.entries ?? [])
    nextCursor.value = res?.nextCursor ?? null
  } catch {
    /* history just stays empty/stale on failure */
  } finally {
    loadingHistory.value = false
  }
}

function loadMore() {
  if (nextCursor.value) loadHistory(nextCursor.value)
}

async function loadStamps() {
  try {
    const [earned, all]: any = await Promise.all([
      $fetch(`${config.public.apiBase}/rewards/stamps`, { headers: authHeaders() }),
      $fetch(`${config.public.apiBase}/rewards/stamps/catalogue`, { headers: authHeaders() }),
    ])
    earnedStamps.value = Array.isArray(earned) ? earned : []
    stampCatalogue.value = Array.isArray(all) ? all : []
  } catch {
    /* stamps section just stays empty on failure */
  } finally {
    loadingStamps.value = false
  }
}

async function loadPassportFlag() {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/passport/my`, { headers: authHeaders() })
    hasPassport.value = Array.isArray(res)
      ? res.length > 0
      : Array.isArray(res?.passports) && res.passports.length > 0
  } catch {
    /* stays false — falls back to the generic "UMU Member" label */
  }
}

onMounted(() => {
  fetchProfile()
  loadBalance()
  loadCatalogue()
  loadHistory()
  loadStamps()
  loadPassportFlag()
})
</script>

<style scoped>
.rw-page {
  --navy: #231d45;
  --teal: #00a19a;
  --muted: #6e6879;
  --line: rgba(193, 215, 237, 0.62);
  position: relative;
  min-height: 100dvh;
  background: #f3f2ef;
  color: #1f2b3f;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.rw-body {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 34px 22px 68px;
}

.rw-quick-btn {
  border: 1px solid rgba(35, 29, 69, 0.14);
  background: rgba(255, 255, 255, 0.72);
  color: var(--navy);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  padding: 9px 16px;
  border-radius: 11px;
  cursor: pointer;
  transition: background 0.16s ease, border-color 0.16s ease;
}
.rw-quick-btn:hover { background: #fff; border-color: rgba(35, 29, 69, 0.24); }
.rw-quick-btn.solid {
  border-color: transparent;
  background: var(--teal);
  color: #fff;
}
.rw-quick-btn.solid:hover { background: #008a84; }

/* ── Hero ───────────────────────────────────────────────────────── */
.rw-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 28px;
}

.rw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #00857f;
}
.rw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.14);
}

.rw-h1 {
  margin-top: 14px;
  font-size: 44px;
  line-height: 1.08;
  letter-spacing: -1.4px;
  font-weight: 800;
  color: var(--navy);
}

.rw-sub {
  margin-top: 14px;
  max-width: 560px;
  font-size: 15.5px;
  line-height: 1.6;
  color: #5b6e86;
}

.rw-hero-identity {
  margin-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 13px;
  padding: 10px 18px 10px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.86);
}
.rw-hero-name { font-size: 15px; font-weight: 800; color: var(--navy); letter-spacing: -0.2px; }
.rw-hero-role { font-size: 12.5px; font-weight: 700; color: var(--teal); margin-top: 1px; }

.rw-hero-art {
  width: 260px;
  max-width: 34vw;
  height: auto;
  filter: drop-shadow(0 24px 34px rgba(18, 55, 88, 0.18));
  animation: rw-float 6s ease-in-out infinite;
}
@keyframes rw-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ── Stats ──────────────────────────────────────────────────────── */
.rw-stats {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.rw-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 22px;
  border-radius: 22px;
  border: 1px solid var(--line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 250, 255, 0.92) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.07);
}
.rw-stat--progress { grid-column: span 1; }
.rw-stat-copy { min-width: 0; flex: 1; }
.rw-stat-ic { width: 54px; height: 54px; object-fit: contain; flex-shrink: 0; }
.rw-stat-num {
  font-size: 30px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -1px;
  line-height: 1.1;
}
.rw-stat-num small { font-size: 17px; font-weight: 700; color: #8b95a8; letter-spacing: -0.3px; }
.rw-stat-lab { font-size: 12.5px; color: var(--muted); font-weight: 700; margin-top: 3px; }
.rw-skel { height: 30px; width: 74px; border-radius: 8px; background: #e6ecf3; }

.rw-progress-track {
  height: 8px;
  border-radius: 5px;
  background: #e6ecf3;
  margin-top: 12px;
  overflow: hidden;
}
.rw-progress-fill {
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, #00a19a, #00c2b8);
  transition: width 0.3s ease;
}
.rw-progress-next {
  margin-top: 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: #8b95a8;
}

/* ── Marketplace notice ─────────────────────────────────────────── */
.rw-launch {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 26px;
  border-radius: 24px;
  border: 1px solid #cdeee8;
  background: linear-gradient(140deg, #eafaf7 0%, #f3fdfb 60%, #eafaf7 100%);
}
.rw-launch-ic { width: 76px; height: 76px; object-fit: contain; flex-shrink: 0; }
.rw-launch-copy { flex: 1; min-width: 0; }
.rw-launch-title { font-size: 18px; font-weight: 800; color: var(--navy); letter-spacing: -0.4px; }
.rw-launch-sub { margin-top: 6px; font-size: 14px; line-height: 1.6; color: #57707f; }
.rw-launch-btn {
  flex-shrink: 0;
  border: 1px solid rgba(0, 161, 154, 0.32);
  background: #fff;
  color: #00726d;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  padding: 12px 20px;
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.16s ease, transform 0.16s ease;
}
.rw-launch-btn:hover { background: #ecfbf8; transform: translateY(-1px); }

/* ── Panels ─────────────────────────────────────────────────────── */
.rw-panel {
  margin-top: 18px;
  border-radius: 26px;
  padding: 24px 26px 26px;
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.07);
}

.rw-panel-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.rw-overline {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 800;
}

.rw-panel-title {
  margin-top: 6px;
  font-size: 22px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.6px;
}

.rw-count-pill {
  font-size: 12px;
  font-weight: 800;
  color: #00726d;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.22);
  border-radius: 999px;
  padding: 6px 12px;
}

.rw-sec-label {
  margin: 22px 0 12px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── Reward cards ───────────────────────────────────────────────── */
.rw-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.rw-reward-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  padding: 14px;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.rw-reward-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(15, 44, 76, 0.1); }

.rw-reward-tile {
  position: relative;
  height: 118px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}
/* The source icons are isometric renders with a lot of transparent margin
   baked in around the object — at 1:1 they read as a small floating icon
   rather than a tile-filling image. Scaling up and letting overflow:hidden
   crop the excess makes the object fill most of the tile. */
.rw-reward-tile-img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.55); }
.rw-reward-tile-img--locked { filter: grayscale(1) opacity(0.55); }
.rw-reward-tile--locked { background: #f1eff5; color: var(--muted); }
.rw-reward-tile-lock {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--navy);
  display: grid;
  place-items: center;
}

.rw-reward-partner {
  margin-top: 12px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: #8b95a8;
}
.rw-reward-title {
  margin-top: 4px;
  font-size: 14.5px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.32;
  letter-spacing: -0.2px;
}
.rw-reward-card--locked .rw-reward-title { color: #6c7488; }

.rw-reward-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 9px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
}
.rw-reward-pill--unlocked { background: #dff2e9; color: #186b48; }

.rw-reward-meter {
  height: 5px;
  border-radius: 3px;
  background: #eceff5;
  margin-top: 11px;
  overflow: hidden;
}
.rw-reward-meter-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #00a19a, #00c2b8);
}

.rw-reward-note { margin-top: 8px; font-size: 11.5px; color: var(--muted); line-height: 1.5; font-weight: 600; }
.rw-reward-gap { color: #a0a7b6; }

/* ── Stamps ─────────────────────────────────────────────────────── */
.rw-split {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}
.rw-split > .rw-panel { margin-top: 18px; }

.rw-stamps-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 20px 12px;
}
.rw-stamp-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  text-align: center;
}
/* Locked stamps dial the whole badge back rather than overlaying a dominant
   grey padlock — StampFrame already renders a neutral placeholder face. */
.rw-stamp-cell--locked { opacity: 0.4; }
.rw-stamp-label { font-size: 11px; font-weight: 800; color: var(--navy); line-height: 1.3; }
.rw-stamp-cell--locked .rw-stamp-label { color: var(--muted); }

/* ── Ways to earn ───────────────────────────────────────────────── */
.rw-earn-intro { margin-top: 10px; font-size: 13.5px; line-height: 1.6; color: #5b6e86; }
.rw-earn-row {
  width: 100%;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: #fff;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.rw-earn-row:hover { border-color: rgba(0, 161, 154, 0.4); transform: translateX(2px); }
.rw-earn-ic { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
.rw-earn-copy { flex: 1; min-width: 0; display: block; }
.rw-earn-title { display: block; font-size: 13.5px; font-weight: 800; color: var(--navy); }
.rw-earn-sub { display: block; font-size: 11.5px; color: var(--muted); margin-top: 3px; line-height: 1.45; font-weight: 600; }
.rw-earn-chev { width: 16px; height: 16px; color: #b4bccb; flex-shrink: 0; }

/* ── History ────────────────────────────────────────────────────── */
.rw-list { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
.rw-loadmore {
  margin-top: 4px;
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-family: inherit;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.16s ease;
}
.rw-loadmore:hover:not(:disabled) { border-color: rgba(0, 161, 154, 0.45); }
.rw-loadmore:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Shared states ──────────────────────────────────────────────── */
.rw-loading { display: flex; justify-content: center; padding: 48px 0; }
.rw-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e6ecf3;
  border-top-color: var(--teal);
  border-radius: 50%;
  animation: rw-spin 0.8s linear infinite;
}
@keyframes rw-spin { to { transform: rotate(360deg); } }

.rw-empty { text-align: center; padding: 44px 20px 34px; }
.rw-empty-ic { width: 76px; height: 76px; object-fit: contain; margin: 0 auto 12px; display: block; }
.rw-empty-title { font-size: 17px; font-weight: 800; color: var(--navy); letter-spacing: -0.3px; }
.rw-empty-sub { margin: 7px auto 0; max-width: 440px; font-size: 13.5px; color: var(--muted); line-height: 1.55; }
.rw-empty-btn {
  margin-top: 18px;
  border: 0;
  background: var(--teal);
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  padding: 12px 22px;
  border-radius: 13px;
  cursor: pointer;
  transition: background 0.16s ease, transform 0.16s ease;
}
.rw-empty-btn:hover { background: #008a84; transform: translateY(-1px); }

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .rw-hero { grid-template-columns: 1fr; }
  .rw-hero-art { display: none; }
  .rw-h1 { font-size: 34px; letter-spacing: -1px; }
  .rw-split { grid-template-columns: 1fr; }
  .rw-launch { flex-wrap: wrap; }
  .rw-launch-btn { width: 100%; }
}

@media (max-width: 560px) {
  .rw-body { padding: 18px 16px 52px; }
  .rw-h1 { font-size: 28px; }
  .rw-panel { padding: 20px 16px 22px; border-radius: 22px; }
  .rw-panel-title { font-size: 19px; }
  .rw-stat { padding: 16px 18px; }
  .rw-stat-ic { width: 46px; height: 46px; }
  .rw-stat-num { font-size: 26px; }
  .rw-launch { padding: 18px; gap: 14px; }
  .rw-launch-ic { width: 58px; height: 58px; }
  .rw-cards-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
}
</style>
