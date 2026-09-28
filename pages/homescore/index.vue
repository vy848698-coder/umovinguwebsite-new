<template>
  <div class="hs-root">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hs-web-nav">
      <div class="hs-web-shell nav-inner">
        <button class="brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="umovingu" class="brand-logo" />
          <span class="brand-name">umovingu</span>
          <span class="brand-beta">BETA</span>
        </button>

        <!-- The Story/Market/Reviews links are sections of the landing page,
             and `/` carries the guest middleware: a signed-in visitor hitting
             it is redirected to /dashboard, so those anchors would silently
             dump them on the dashboard. Signed in, the menu points at the
             real app pages instead. -->
        <nav class="web-links" aria-label="Primary navigation">
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
          <template v-if="signedIn">
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </template>
          <template v-else>
            <button type="button" @click="navigateTo('/#passport')">Passport</button>
            <button type="button" @click="navigateTo('/#story')">Story</button>
            <button type="button" @click="navigateTo('/#market')">Market</button>
            <button type="button" @click="navigateTo('/#reviews')">Reviews</button>
          </template>
        </nav>

        <div class="web-actions">
          <template v-if="signedIn">
            <button class="web-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
            <button class="web-btn solid" type="button" @click="navigateTo('/dashboard')">Dashboard</button>
          </template>
          <template v-else>
            <button class="web-btn ghost" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
            <button class="web-btn solid" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
          </template>
        </div>

        <button
          class="web-mobile-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          :aria-expanded="mobileNavOpen ? 'true' : 'false'"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div class="hs-web-shell">
        <div class="web-mobile-backdrop" :class="{ open: mobileNavOpen }" @click="mobileNavOpen = false" />
        <div class="web-mobile-panel" :class="{ open: mobileNavOpen }">
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="goMobile('/homescore')">HomeScore</button>
          <template v-if="signedIn">
            <button type="button" @click="goMobile('/passport')">Passport</button>
            <button type="button" @click="goMobile('/marketplace')">Marketplace</button>
            <button type="button" @click="goMobile('/profile/learn')">Learn</button>
            <button type="button" @click="goMobile('/profile')">Profile</button>
            <button type="button" class="claim" @click="goMobile('/dashboard')">Dashboard</button>
          </template>
          <template v-else>
            <button type="button" @click="goMobile('/#passport')">Passport</button>
            <button type="button" @click="goMobile('/#story')">Story</button>
            <button type="button" @click="goMobile('/#market')">Market</button>
            <button type="button" @click="goMobile('/#reviews')">Reviews</button>
            <button type="button" @click="goMobile('/onboarding/signin')">Sign in</button>
            <button type="button" class="claim" @click="goMobile('/onboarding/signup')">Get started</button>
          </template>
        </div>
      </div>
    </header>

    <main class="hs-web-shell hs-main">
      <!-- ── Hero ───────────────────────────────────────────────────── -->
      <section class="hs-hero">
        <div class="hero-content">
          <p class="section-kicker"><span class="kicker-dot" />HomeScore</p>
          <h1>What does any UK<br class="h1-br-mobile" /> home really<br class="h1-br-mobile" /> cost to run?</h1>
          <p class="hero-description">
            Instantly scored from public EPC data, for any address, anyone.
            See how a property compares to its street in seconds.
          </p>

          <div class="hs-search-wrap">
            <PropertySearchInput
              placeholder="Postcode or address"
              variant="light"
              :show-passport-status="true"
              @select="onResultSelect"
              @enter="onSearchEnter"
            />
            <button class="hs-search-go" type="button" @click="onCheckClick">
              Check
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 5 19 12 13 19" />
              </svg>
            </button>
          </div>

          <div class="hs-meta-row">
            <span v-for="m in heroMeta" :key="m" class="hs-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ m }}
            </span>
          </div>
        </div>

        <aside class="hero-visual" aria-label="HomeScore preview">
          <!-- House-shaped score card: roof + chimney outline drawn in SVG
               (halo stroke under a crisp stroke for the teal glow); the
               content sits on top. Sample figures for the preview only. -->
          <div class="hs-house">
            <svg class="hs-house-shape" viewBox="0 0 400 502" aria-hidden="true">
              <defs>
                <linearGradient id="hsHouseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#f5f8f8" />
                </linearGradient>
              </defs>
              <path class="hs-house-halo" d="M38 472 L38 173 Q38 165 32 165 L28 165 C18 165 14 159 27.7 147.5 L187.5 20 Q200 10 212.5 20 L292 83.4 L292 58 Q292 50 300 50 L322 50 Q330 50 330 58 L330 113.7 L372.3 147.5 C386 159 382 165 372 165 L368 165 Q362 165 362 173 L362 472 Q362 490 344 490 L56 490 Q38 490 38 472 Z" />
              <path class="hs-house-fill" d="M38 472 L38 173 Q38 165 32 165 L28 165 C18 165 14 159 27.7 147.5 L187.5 20 Q200 10 212.5 20 L292 83.4 L292 58 Q292 50 300 50 L322 50 Q330 50 330 58 L330 113.7 L372.3 147.5 C386 159 382 165 372 165 L368 165 Q362 165 362 173 L362 472 Q362 490 344 490 L56 490 Q38 490 38 472 Z" />
              <path class="hs-house-edge" d="M38 472 L38 173 Q38 165 32 165 L28 165 C18 165 14 159 27.7 147.5 L187.5 20 Q200 10 212.5 20 L292 83.4 L292 58 Q292 50 300 50 L322 50 Q330 50 330 58 L330 113.7 L372.3 147.5 C386 159 382 165 372 165 L368 165 Q362 165 362 173 L362 472 Q362 490 344 490 L56 490 Q38 490 38 472 Z" />
            </svg>

            <div class="hs-house-body">
              <div class="hs-house-eyebrow">HomeScore</div>

              <div class="hs-house-ring">
                <svg viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="hsHouseRingGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#34cdb5" />
                      <stop offset="100%" stop-color="#0b8676" />
                    </linearGradient>
                  </defs>
                  <circle class="hs-house-ring-track" cx="60" cy="60" r="52" />
                  <circle
                    class="hs-house-ring-fill"
                    cx="60"
                    cy="60"
                    r="52"
                    stroke-dasharray="326.7"
                    :stroke-dashoffset="326.7 * (1 - 0.74)"
                  />
                </svg>
                <div class="hs-house-ring-label">
                  <strong>74</strong>
                  <span>Good</span>
                </div>
              </div>
              <div class="hs-house-outof">out of 100</div>

              <ul class="hs-house-rows">
                <li>
                  <span class="hs-house-dot" style="background: #0f8f7d" />
                  <span class="hs-house-label">Energy &amp; running costs</span>
                  <span class="hs-house-val" style="color: #0f8f7d">Good</span>
                </li>
                <li>
                  <span class="hs-house-dot" style="background: #3cb46a" />
                  <span class="hs-house-label">Environmental impact</span>
                  <span class="hs-house-val" style="color: #2f9a58">Good</span>
                </li>
                <li>
                  <span class="hs-house-dot" style="background: #d08b16" />
                  <span class="hs-house-label">Heating efficiency</span>
                  <span class="hs-house-val" style="color: #c98612">Average</span>
                </li>
                <li>
                  <span class="hs-house-dot" style="background: #8b5cf6" />
                  <span class="hs-house-label">Potential savings</span>
                  <span class="hs-house-val">£340 / year</span>
                </li>
              </ul>

              <button class="hs-house-btn" type="button" :disabled="breakdownLoading" @click="onBreakdownClick">
                View full breakdown
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 5 19 12 13 19" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      </section>

      <!-- ── Real story + live activity ─────────────────────────────── -->
      <section class="hs-story-section">
        <article class="hs-real-story">
          <div class="hs-real-story-bar" />
          <div class="hs-real-story-main">
            <div class="hs-card-top">
              <span class="hs-card-tag">
                <Icon name="i-lucide-quote" class="hs-card-tag-ic" />Real story
              </span>
            </div>

            <p class="hs-real-story-quote">
              "My neighbour was being charged £150 a month extra. Her supplier
              thought she had a swimming pool."
            </p>
            <p class="hs-real-story-text">
              Energy suppliers estimate usage based on assumptions. Those
              assumptions are sometimes very wrong. HomeScore shows you what your
              home should actually cost, and flags when something doesn't add up.
            </p>
          </div>

          <div class="hs-real-story-visual" aria-hidden="true">
            <img class="hs-real-story-art" src="/homescore-icon/wallet.png" alt="" loading="lazy" />
          </div>
        </article>

        <aside class="hs-activity-card">
          <div class="hs-card-top">
            <span class="hs-card-tag">
              <span class="hs-live-pulse" />Live activity
            </span>
            <span v-if="lastHourUpdated" class="hs-activity-updated">Updated {{ lastHourUpdated }}</span>
          </div>

          <div class="hs-activity-head">
            <strong v-if="lastHourLoading" class="hs-activity-skel" />
            <strong v-else>{{ lastHourCount }}</strong>
            <span class="hs-activity-unit">in the last hour</span>
          </div>
          <p class="hs-activity-label">
            {{ lastHourCount === 1 ? 'HomeScore' : 'HomeScores' }} run by people checking
            what their home really costs.
          </p>

          <ul class="hs-activity-list">
            <li>
              <span class="hs-activity-ic"><img src="/homescore-icon/epcAssessment.png" alt="" /></span>
              <span class="hs-activity-li-text"><b>EPC &amp; energy rating</b><small>From the EPC register</small></span>
            </li>
            <li>
              <span class="hs-activity-ic"><img src="/homescore-icon/utilityBills.png" alt="" /></span>
              <span class="hs-activity-li-text"><b>Running cost estimate</b><small>Yearly energy bills</small></span>
            </li>
            <li>
              <span class="hs-activity-ic"><img src="/homescore-icon/houseSearch.png" alt="" /></span>
              <span class="hs-activity-li-text"><b>Sold prices nearby</b><small>Recent local sales</small></span>
            </li>
          </ul>

          <p class="hs-activity-note">Live count, straight from the HomeScore engine.</p>
        </aside>
      </section>

      <!-- ── How it works ───────────────────────────────────────────── -->
      <section class="hs-how">
        <div class="hs-how-head">
          <p class="section-kicker center">How it works</p>
          <h2>Getting your HomeScore is simple</h2>
        </div>

        <div class="hs-how-tabs" role="tablist">
          <button
            v-for="t in howTabs"
            :key="t.id"
            class="hs-how-tab"
            :class="{ active: activeHow === t.id }"
            role="tab"
            :aria-selected="activeHow === t.id"
            @click="activeHow = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <div class="hs-steps-grid">
          <article v-for="(step, i) in currentHowSteps" :key="i" class="hs-step-card">
            <div :class="['hs-step-icon', stepTones[i]]">
              <span class="hs-step-badge">{{ i + 1 }}</span>
              <img :src="`/homescore-icon/${step.icon}.png`" alt="" class="hs-step-art" loading="lazy" />
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.sub }}</p>
          </article>
        </div>
      </section>

      <!-- ── Powered by OpenProperty ────────────────────────────────── -->
      <section class="hs-powered">
        <div class="hs-powered-eyebrow">Powered by</div>
        <div class="hs-powered-row">
          <img src="/op-icons/opLogo.png" alt="OpenProperty" class="hs-powered-logo" />
          <div>
            <div class="hs-powered-name">OpenProperty</div>
            <div class="hs-powered-tag">Property data infrastructure</div>
          </div>
        </div>
      </section>
    </main>

    <!-- ── Footer (shared, matches Explore) ─────────────────────────── -->
    <SiteFooter wide />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import { useRecentlyExplored } from '~/composables/useRecentlyExplored'

const route = useRoute()
const router = useRouter()
const mobileNavOpen = ref(false)

// Resolved after mount because localStorage doesn't exist during SSR, so the
// first paint shows the guest menu and the two swap on hydration — the same
// approach WebTopNav uses.
const signedIn = ref(false)
onMounted(() => {
  try {
    signedIn.value = !!localStorage.getItem('token')
  } catch {
    /* private mode / blocked storage — stays signed out */
  }
})

const heroMeta = ['Free', 'Instant', 'No account needed']
const stepTones = ['teal', 'purple', 'amber']

// ── Real "N HomeScores run in the last hour" count ──────────────────
// Public endpoint (no auth) — same source the deployed app reads. The
// number used to be hardcoded at 147 alongside a decorative bar chart
// that looked like real activity data; both were invented.
const config = useRuntimeConfig()
const lastHourCount = ref(0)
const lastHourLoading = ref(true)

const lastHourUpdated = ref('')
let lastHourTimer: ReturnType<typeof setInterval> | null = null

async function loadLastHour() {
  try {
    const res: any = await $fetch(`${config.public.apiBase}/property/activity/last-hour`)
    lastHourCount.value = res?.count ?? 0
    lastHourUpdated.value = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch {
    /* keeps the last good value on failure */
  } finally {
    lastHourLoading.value = false
  }
}

// Re-poll every minute so the "live" count actually moves while the page
// is open (it used to be read once on mount).
onMounted(() => {
  loadLastHour()
  lastHourTimer = setInterval(loadLastHour, 60_000)
})
onBeforeUnmount(() => {
  if (lastHourTimer) clearInterval(lastHourTimer)
})

function onResultSelect(property: any) {
  // HomeScore detail is the page's main purpose — go there directly.
  router.push(`/homescore/${property.id}`)
}

function onSearchEnter(_q: string) {
  // PropertySearchInput already opens its dropdown on enter.
}

function onCheckClick() {
  const input = document.querySelector<HTMLInputElement>('.hs-search-wrap input')
  input?.focus()
}

// ── "View full breakdown" on the house preview card ─────────────────
// The card shows sample figures, so the button takes people to the most
// relevant REAL breakdown it can find:
//   1. signed in with a Passport → their own home's HomeScore
//   2. a property they explored earlier in this browser → that one
//   3. nothing yet → scroll to the search so they can run one
const { getRecentlyExplored } = useRecentlyExplored()
const breakdownLoading = ref(false)

async function onBreakdownClick() {
  if (breakdownLoading.value) return
  breakdownLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const list = await $fetch<any[]>(`${config.public.apiBase}/profile/passports`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const own = (list ?? []).find((p: any) => p?.propertyId)?.propertyId
        if (own) return router.push(`/homescore/${own}`)
      } catch {
        /* fall through to the next option */
      }
    }

    const recent = getRecentlyExplored()[0]
    if (recent?.id) return router.push(`/homescore/${recent.id}`)

    const input = document.querySelector<HTMLInputElement>('.hs-search-wrap input')
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    input?.focus({ preventScroll: true })
  } finally {
    breakdownLoading.value = false
  }
}

const navIsActive = (basePath: string) =>
  route.path === basePath || route.path.startsWith(`${basePath}/`)

const goMobile = (path: string) => {
  mobileNavOpen.value = false
  navigateTo(path)
}

watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false
  },
)

// ── How it works tabs ────────────────────────────────────────────────
type HowId = 'buyers' | 'owners' | 'curious'
const activeHow = ref<HowId>('buyers')

const howTabs: { id: HowId; label: string }[] = [
  { id: 'buyers', label: 'Looking to buy' },
  { id: 'owners', label: "It's my property" },
  { id: 'curious', label: 'Just curious' },
]

const howCopy: Record<HowId, { title: string; sub: string; icon: string }[]> = {
  buyers: [
    {
      title: 'Search any UK address',
      icon: 'magnifier',
      sub: 'Type a postcode or street and see how it scores against its neighbours.',
    },
    {
      title: 'See running costs & risks',
      icon: 'utilityBills',
      sub: 'Energy costs, sold history, flood risk: everything public records can tell you before you make an offer.',
    },
    {
      title: 'Know what to ask before you view',
      icon: 'clipboardChecklist',
      sub: 'Get a list of questions based on what the EPC data flags, so you walk in already informed.',
    },
  ],
  owners: [
    {
      title: 'Search your address',
      icon: 'houseSearch',
      sub: "See your property's estimated score from public EPC data. It takes 5 seconds.",
    },
    {
      title: 'See how you compare to your street',
      icon: 'housesCluster',
      sub: 'Find out if this property is costing more to run than similar homes nearby, and why.',
    },
    {
      title: 'Upload bills to get your real number',
      icon: 'utilityBills',
      sub: 'Public EPC data can be years out of date. Your actual bills tell the real story and start building your Property Passport.',
    },
  ],
  curious: [
    {
      title: "Search any address, yours or anyone's",
      icon: 'magnifier',
      sub: 'No account, no commitment. Just type a postcode and see what the data says.',
    },
    {
      title: 'See what your street is paying',
      icon: 'housesCluster',
      sub: 'Compare running costs across nearby homes. Renting or owning, the data is the same for everyone.',
    },
    {
      title: 'Find out if you could be paying less',
      icon: 'moneyBagPound',
      sub: 'If this property is costing more than its neighbours, the HomeScore shows you exactly why and what could change it.',
    },
  ],
}
const currentHowSteps = computed(() => howCopy[activeHow.value])
</script>

<style scoped>
.hs-root {
  --color-teal: #00a19a;
  --color-blue: #2f9bdf;
  --color-purple: #5a4cf0;
  --color-ink: #231d45;
  --color-muted: #6b6783;
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: var(--color-ink);
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  /* `clip` keeps the sticky nav working (vs `hidden`, which makes this a
     scroll container and breaks position: sticky). */
  overflow: clip;
  position: relative;
}

.ambient,
.mesh {
  pointer-events: none;
  position: fixed;
}

.ambient {
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.16;
}

.ambient-b {
  width: 320px;
  height: 320px;
  right: -120px;
  top: 160px;
  background: #5a4cf0;
}

.mesh {
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
}

.hs-web-shell {
  width: min(1260px, calc(100% - 64px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* ── Nav ──────────────────────────────────────────────────────────── */
.hs-web-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
  backdrop-filter: blur(12px);
}

.nav-inner {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
}

.brand,
.web-links button,
.footer-col button {
  font-family: inherit;
}

.brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0d1835;
  cursor: pointer;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
}

.brand-logo {
  width: auto;
  height: 32px;
  object-fit: contain;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #0d1835;
}

.brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #007e78;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}

.web-links {
  display: flex;
  gap: 20px;
}

.web-links button {
  border: 0;
  background: transparent;
  color: #475a7b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 14px;
  border-radius: 10px;
  white-space: nowrap;
}

.web-links button:hover,
.web-links button.active {
  color: #0c2342;
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.25);
}

.web-actions {
  display: inline-flex;
  gap: 12px;
  flex-shrink: 0;
}

.web-btn {
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  padding: 0 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  white-space: nowrap;
}

.web-btn:hover {
  transform: translateY(-1px);
}

.web-btn.solid {
  color: #fff;
  background: #00a19a;
  box-shadow: 0 10px 20px rgba(0, 161, 154, 0.22);
}

.web-btn.solid:hover {
  background: #00857f;
}

.web-btn.ghost {
  color: #231d45;
  background: #fff;
  border-color: #e3e1ea;
}

.web-mobile-toggle,
.web-mobile-panel,
.web-mobile-backdrop {
  display: none;
}

.web-mobile-toggle {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.web-mobile-toggle span {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #1c2b46;
}

/* ── Layout ───────────────────────────────────────────────────────── */
.hs-main {
  padding: 54px 0 18px;
}

.section-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-kicker.center {
  justify-content: center;
}

.kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}

/* ── Hero ─────────────────────────────────────────────────────────── */
.hs-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 5vw, 72px);
  min-height: 500px;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 clamp(24px, 4vw, 64px);
}

.hero-content {
  max-width: 560px;
}

.hero-content h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 800;
  line-height: 1.07;
  letter-spacing: -0.02em;
}

/* Forced line breaks only on narrow/mobile widths; desktop wraps naturally. */
.h1-br-mobile {
  display: none;
}

.hero-description {
  margin: 26px 0 0;
  max-width: 540px;
  color: #5b6d89;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.65;
}

/* ── Search ───────────────────────────────────────────────────────── */
.hs-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 540px;
  margin-top: 34px;
  background: #fff;
  border: 1.5px solid #e7ecf2;
  border-radius: 16px;
  padding: 6px 6px 6px 12px;
  box-shadow: 0 14px 30px rgba(24, 52, 88, 0.08);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.hs-search-wrap :deep(.psi-wrap) {
  position: static !important;
}

.hs-search-wrap :deep(.psi-drop) {
  left: 0;
  right: 0;
  width: auto;
  top: calc(100% + 8px);
}

.hs-search-wrap:focus-within {
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12), 0 14px 30px rgba(24, 52, 88, 0.08);
}

.hs-search-wrap :deep(> div),
.hs-search-wrap :deep(.property-search) {
  flex: 1;
  min-width: 0;
}

.hs-search-wrap :deep(input) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 13px 4px 13px 38px !important;
  font-size: 15px;
  font-weight: 600;
  color: #231d45;
  outline: none !important;
}

.hs-search-wrap :deep(input::placeholder) {
  color: #9c98ad;
  font-weight: 500;
}

.hs-search-go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #00a19a 0%, #00b6ad 100%);
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(0, 161, 154, 0.24);
  transition: transform 0.15s, box-shadow 0.15s;
}

.hs-search-go:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(0, 161, 154, 0.3);
}

.hs-search-go svg {
  width: 13px;
  height: 13px;
}

.hs-meta-row {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #647590;
  font-weight: 600;
  margin: 18px 0 0;
}

.hs-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.hs-meta-item svg {
  width: 14px;
  height: 14px;
  color: #00a19a;
}

/* ── Hero visual / score card ─────────────────────────────────────── */
.hero-visual {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 480px;
}

/* ── House-shaped score card ──
   Outline (rounded peak, overhanging eaves, chimney) is one SVG path:
   a blurred halo stroke under a crisp stroke gives the teal glow. */
.hs-house {
  position: relative;
  width: 400px;
  height: 502px;
}

.hs-house-shape {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.hs-house-halo {
  fill: none;
  stroke: rgba(56, 214, 192, 0.55);
  stroke-width: 18;
  stroke-linejoin: round;
  filter: blur(10px);
}

/* Two-tone rim: a deep teal band with a lighter aqua line through it. */
.hs-house-fill {
  fill: url(#hsHouseFill);
  stroke: #1cb4a0;
  stroke-width: 7.5;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 5px rgba(64, 224, 200, 0.7)) drop-shadow(0 26px 40px rgba(20, 60, 70, 0.16));
}

.hs-house-edge {
  fill: none;
  stroke: #9ff3e4;
  stroke-width: 3.5;
  stroke-linejoin: round;
  opacity: 0.45;
  filter: blur(0.6px);
}

.hs-house-body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 58px 28px;
}

/* Same label style as the site's section kickers (.section-kicker). */
.hs-house-eyebrow {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #00857f;
  margin-bottom: 14px;
}

.hs-house-ring {
  position: relative;
  width: 138px;
  height: 138px;
}

.hs-house-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.hs-house-ring-track {
  fill: none;
  stroke: #e9f1ef;
  stroke-width: 10;
}

.hs-house-ring-fill {
  fill: none;
  stroke: url(#hsHouseRingGrad);
  stroke-width: 10;
  stroke-linecap: round;
}

.hs-house-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.hs-house-ring-label strong {
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--color-ink);
}

.hs-house-ring-label span {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 800;
  color: #0f9582;
}

.hs-house-outof {
  margin-top: 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: #8a8fa0;
}

.hs-house-rows {
  list-style: none;
  width: 100%;
  margin: 14px 0 0;
  padding: 0;
  border-top: 1px solid #edf0f3;
}

.hs-house-rows li {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 35px;
  padding: 0 2px;
  border-bottom: 1px solid #edf0f3;
}

.hs-house-rows li:last-child {
  border-bottom: 0;
}

.hs-house-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hs-house-label {
  flex: 1;
  min-width: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #2a2f4a;
  white-space: nowrap;
}

.hs-house-val {
  font-size: 13.5px;
  font-weight: 800;
  color: #1f2547;
  white-space: nowrap;
}

.hs-house-btn {
  margin-top: auto;
  width: 100%;
  height: 46px;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, #14a08e 0%, #0a7468 100%);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 8px 18px rgba(11, 127, 114, 0.32);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hs-house-btn:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 12px 24px rgba(11, 127, 114, 0.4);
}

.hs-house-btn svg {
  width: 16px;
  height: 16px;
}

/* ── Real story + activity ────────────────────────────────────────── */
.hs-story-section {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 26px;
  margin-top: 28px;
}

/* Both cards share one frame: white, hairline border, soft shadow,
   same padding and header row, so they read as a matched pair. */
.hs-real-story,
.hs-activity-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 26px 30px 26px;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(31, 61, 98, 0.06);
}

.hs-real-story {
  padding-left: 34px;
}

.hs-real-story-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #00a19a, #00b6ad);
}

.hs-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 30px;
  margin-bottom: 18px;
}

.hs-card-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px 0 11px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(0, 161, 154, 0.22);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #00776f;
}
.hs-card-tag .hs-live-pulse { width: 7px; height: 7px; }
.hs-card-tag-ic { width: 13px; height: 13px; }

.hs-real-story-quote {
  margin: 0 0 14px;
  font-size: 23px;
  font-weight: 800;
  color: #231d45;
  line-height: 1.34;
  letter-spacing: -0.015em;
}

.hs-real-story-text {
  margin: 0;
  font-size: 15px;
  color: #6b6783;
  line-height: 1.6;
  font-weight: 500;
}

/* Text column + big 3D art column, both vertically centred so the card
   has no dead space when it stretches to match the activity card. */
.hs-real-story {
  flex-direction: row;
  align-items: center;
  gap: 24px;
}

.hs-real-story-main {
  flex: 1;
  min-width: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
}

/* Tag stays pinned top (level with the Live activity tag); the quote and
   copy centre in the space below it. */
.hs-real-story-quote {
  margin-top: auto !important;
}
.hs-real-story-text {
  margin-bottom: auto !important;
  padding-bottom: 30px;
}

.hs-real-story-visual {
  position: relative;
  flex-shrink: 0;
  width: 190px;
  height: 190px;
  display: grid;
  place-items: center;
}

.hs-real-story-visual::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.16) 0%, rgba(0, 161, 154, 0.05) 55%, rgba(0, 161, 154, 0) 72%);
}

.hs-real-story-art {
  position: relative;
  width: 150px;
  height: 150px;
  object-fit: contain;
  filter: drop-shadow(0 18px 24px rgba(31, 61, 98, 0.2));
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.hs-real-story:hover .hs-real-story-art {
  transform: translateY(-6px) rotate(-3deg);
}

.hs-activity-updated {
  font-size: 11.5px;
  font-weight: 600;
  color: #9a97aa;
}

.hs-activity-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.hs-activity-head strong {
  font-size: 52px;
  line-height: 1;
  font-weight: 900;
  color: #00a19a;
  letter-spacing: -0.04em;
}

.hs-activity-unit {
  font-size: 14px;
  font-weight: 700;
  color: #4a5570;
}

.hs-activity-label {
  margin: 8px 0 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #6b6783;
  line-height: 1.5;
}

.hs-activity-skel {
  display: inline-block;
  width: 64px;
  height: 52px;
  border-radius: 10px;
  background: rgba(0, 161, 154, 0.14);
}

.hs-activity-list {
  list-style: none;
  margin: 18px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid #f0eee9;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hs-activity-list li {
  display: flex;
  align-items: center;
  gap: 14px;
}
/* 3D illustrated icon, shown large with no tile so it reads clearly */
.hs-activity-ic {
  width: 52px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.hs-activity-ic img {
  max-width: 48px;
  max-height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(24, 52, 88, 0.12));
}
.hs-activity-li-text { display: flex; flex-direction: column; min-width: 0; }
.hs-activity-li-text b { font-size: 13.5px; font-weight: 800; color: #231d45; }
.hs-activity-li-text small { font-size: 12px; font-weight: 600; color: #8b8799; margin-top: 1px; }

.hs-activity-note {
  margin: auto 0 0;
  padding-top: 18px;
  font-size: 12px;
  font-weight: 600;
  color: #8b8799;
  line-height: 1.5;
}

.hs-live-pulse {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #00a19a;
  position: relative;
}

.hs-live-pulse::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 161, 154, 0.4);
  animation: hs-live-pulse 1.6s ease-out infinite;
}

@keyframes hs-live-pulse {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

/* ── How it works ─────────────────────────────────────────────────── */
.hs-how {
  padding-top: 64px;
  text-align: center;
}

.hs-how-head h2 {
  margin: 0;
  color: #1a1340;
  font-size: clamp(32px, 3.6vw, 44px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.hs-how-tabs {
  display: inline-flex;
  background: #ffffff;
  border: 1px solid #ece8df;
  border-radius: 100px;
  padding: 6px;
  gap: 4px;
  margin: 30px 0 44px;
  box-shadow: 0 6px 18px rgba(26, 19, 64, 0.06);
}

.hs-how-tab {
  white-space: nowrap;
  border: none;
  background: transparent;
  color: #6b6783;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  padding: 11px 26px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.18s;
}

.hs-how-tab:hover {
  color: #1a1340;
}

.hs-how-tab.active {
  background: #1a1340;
  color: #ffffff;
  font-weight: 800;
  box-shadow: 0 6px 16px rgba(26, 19, 64, 0.28);
}

.hs-steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  position: relative;
}

.hs-steps-grid::before {
  content: '';
  position: absolute;
  left: 20%;
  right: 20%;
  top: 52px;
  border-top: 2px dashed #d5e6e2;
  z-index: 0;
}

.hs-step-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 14px;
}

/* Bare 3D icon - no tile. The page colour behind it breaks the dashed
   connector cleanly around each icon. */
.hs-step-icon {
  position: relative;
  z-index: 1;
  width: 104px;
  height: 104px;
  display: grid;
  place-items: center;
  margin-bottom: 18px;
  background: #f3f2ef;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.hs-step-art {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 12px 16px rgba(24, 52, 88, 0.16));
}

.hs-step-card:hover .hs-step-icon { transform: translateY(-4px); }

/* tone only drives the step-number colour now */
.hs-step-icon.teal { color: #00857f; }
.hs-step-icon.purple { color: #5a4cf0; }
.hs-step-icon.amber { color: #e59100; }

.hs-step-badge {
  position: absolute;
  top: 0;
  right: -2px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #fff;
  color: currentColor;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(24, 52, 88, 0.16);
}

.hs-step-card h3 {
  margin: 0 0 10px;
  color: #231d45;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.25;
}

.hs-step-card p {
  margin: 0;
  max-width: 280px;
  color: #6b6783;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 500;
}

/* ── Powered by ───────────────────────────────────────────────────── */
.hs-powered {
  margin-top: 58px;
  padding: 28px 32px;
  border: 1px solid rgba(231, 236, 242, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  text-align: center;
}

.hs-powered-eyebrow {
  font-size: 11px;
  font-weight: 900;
  color: #9c98ad;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.hs-powered-row {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}

.hs-powered-logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.24);
}

.hs-powered-name {
  font-size: 17px;
  font-weight: 900;
  color: #231d45;
  letter-spacing: -0.01em;
}

.hs-powered-tag {
  font-size: 14px;
  font-weight: 500;
  color: #6b6783;
  margin-top: 2px;
}

/* ── Footer ───────────────────────────────────────────────────────── */
.hs-footer {
  position: relative;
  z-index: 2;
  background: #231d45;
  color: #cbd9ea;
  padding: 56px 32px 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr repeat(4, 1fr);
  gap: 40px;
  width: min(1260px, 100%);
  margin: 0 auto 32px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-brand img {
  width: 30px;
  height: 30px;
}

.footer-brand strong {
  color: #fff;
  font-size: 20px;
}

.footer-intro p {
  max-width: 280px;
  margin: 0 0 20px;
  color: #b8c8dc;
  font-size: 14px;
  line-height: 1.6;
}

.footer-social {
  display: flex;
  gap: 10px;
}

.footer-social button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: #cbd9ea;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.footer-social button:hover {
  background: rgba(0, 161, 154, 0.2);
  color: #fff;
}

.footer-col h5 {
  margin: 0 0 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
}

.footer-col button {
  display: block;
  border: 0;
  background: transparent;
  color: #cbd9ea;
  cursor: pointer;
  font-size: 14px;
  padding: 7px 0;
  text-align: left;
}

.footer-col button:hover {
  color: #fff;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  width: min(1260px, 100%);
  margin: 0 auto;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #91a3bb;
  font-size: 12px;
}

.footer-made .heart {
  color: #00b6ad;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 1180px) {
  .hs-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
  }

  .hero-content {
    max-width: 760px;
  }

  .hero-visual {
    min-height: 0;
    padding: 12px 0;
  }

  .hs-story-section {
    grid-template-columns: minmax(0, 1fr);
  }

  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer-intro {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .hs-web-shell {
    width: calc(100% - 32px);
  }

  .web-links,
  .web-actions {
    display: none;
  }

  .web-mobile-toggle {
    display: inline-flex;
  }

  .web-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1;
    background: rgba(8, 16, 47, 0.24);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .web-mobile-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }

  .web-mobile-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    position: relative;
    z-index: 2;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-8px);
    transition: max-height 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
  }

  .web-mobile-panel.open {
    max-height: 480px;
    margin: 0 0 12px;
    padding: 10px;
    border: 1px solid #dbe7f3;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 16px 30px rgba(21, 58, 95, 0.12);
    opacity: 1;
    transform: translateY(0);
  }

  .web-mobile-panel button {
    border: 1px solid #dde8f3;
    border-radius: 10px;
    background: #fff;
    color: #22405f;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 800;
    padding: 12px;
    text-align: left;
  }

  .web-mobile-panel button.active {
    background: rgba(0, 161, 154, 0.1);
    color: #08294b;
  }

  .web-mobile-panel button.claim {
    border: 0;
    color: #fff;
    background: linear-gradient(120deg, var(--color-teal), var(--color-blue) 48%, var(--color-purple));
  }

  .hs-main {
    padding-top: 40px;
    padding-bottom: 48px;
  }

  .hs-steps-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
  }

  .hs-steps-grid::before {
    display: none;
  }

  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hs-web-shell {
    width: calc(100% - 24px);
  }

  .nav-inner {
    min-height: 62px;
  }

  .brand {
    font-size: 17px;
  }

  .brand-logo {
    width: auto;
    height: 28px;
  }

  .hs-main {
    padding-top: 26px;
  }

  /* The shell already gives the page its side gutter on phones. */
  .hs-hero {
    padding: 0;
    min-height: 0;
  }

  .hero-content h1 {
    font-size: 38px;
  }

  .hs-activity-head strong {
    font-size: 44px;
  }

  .hero-content h1 .h1-br-mobile {
    display: inline;
  }

  .hero-description {
    font-size: 16px;
  }

  .hs-search-wrap {
    flex-wrap: wrap;
  }

  .hs-search-go {
    width: 100%;
    justify-content: center;
  }

  /* Phone: same panel, a little shorter; the house card scales down
     as one piece so its outline never distorts. */

  .hs-real-story,
  .hs-activity-card {
    padding: 22px 20px 20px;
  }

  .hs-real-story {
    padding-left: 24px;
  }

  .hs-real-story-quote {
    font-size: 19px;
  }

  .hs-real-story {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 6px;
  }

  .hs-real-story-visual {
    width: 120px;
    height: 120px;
    align-self: center;
  }

  .hs-real-story-text {
    padding-bottom: 0;
  }

  .hs-real-story-art {
    width: 100px;
    height: 100px;
  }

  .hs-how {
    padding-top: 48px;
  }

  .hs-how-tabs {
    display: flex;
    width: 100%;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
    gap: 3px;
    padding: 4px;
  }

  .hs-how-tab {
    flex: 1 1 0;
    min-width: 0;
    padding: 9px 6px;
    font-size: 12px;
    white-space: normal;
    line-height: 1.2;
    text-align: center;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-bottom {
    justify-content: center;
    text-align: center;
  }
}

@media (max-width: 440px) {
  .hs-house {
    zoom: 0.86;
  }
}

@media (max-width: 360px) {
  .hero-content h1 {
    font-size: 33px;
  }

  .hs-house {
    zoom: 0.7;
  }
}

@media (max-width: 300px) {
  .hs-house {
    zoom: 0.58;
  }
}

@media (prefers-reduced-motion: reduce) {
  .web-btn,
  .hs-search-go,
  .web-mobile-panel,
  .web-mobile-backdrop {
    transition: none;
  }

  .hs-live-pulse::after {
    animation: none;
  }
}

/* ── Big screens ──────────────────────────────────────────────────────
   Scale with the window width (--wide-zoom = width / 1366, set in
   nuxt.config.ts) so a desktop monitor shows this exactly as a 1366px
   laptop does, only bigger. Nav row and page content zoom; the footer
   scales via its `wide` prop. */
@media (min-width: 1367px) {
  .nav-inner,
  .hs-main {
    zoom: var(--wide-zoom, 1);
  }
}
</style>
