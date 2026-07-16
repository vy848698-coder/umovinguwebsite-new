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

        <nav class="web-links" aria-label="Primary navigation">
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/#passport')">Passport</button>
          <button type="button" @click="navigateTo('/#story')">Story</button>
          <button type="button" @click="navigateTo('/#market')">Market</button>
          <button type="button" @click="navigateTo('/#reviews')">Reviews</button>
        </nav>

        <div class="web-actions">
          <button class="web-btn ghost" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button class="web-btn solid" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
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
          <button type="button" @click="goMobile('/#passport')">Passport</button>
          <button type="button" @click="goMobile('/#story')">Story</button>
          <button type="button" @click="goMobile('/#market')">Market</button>
          <button type="button" @click="goMobile('/#reviews')">Reviews</button>
          <button type="button" @click="goMobile('/onboarding/signin')">Sign in</button>
          <button type="button" class="claim" @click="goMobile('/onboarding/signup')">Get started</button>
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
            Instantly scored from public EPC data — for any address, anyone.
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
          <div class="visual-glow" />
          <div class="house-stage">
            <img src="/images/uk-houses/house-1.jpg" alt="Modern UK home" class="hero-house" />
            <div class="score-card">
              <div class="score-card-eyebrow">HomeScore</div>
              <div class="score-ring-holder">
                <ScoreRing :score="74" rating="Good" rating-color="#00a19a" />
              </div>
              <ul class="score-breakdown">
                <li>
                  <span class="sb-dot teal" />
                  <span class="sb-label">Energy &amp; running costs</span>
                  <span class="sb-value good">Good</span>
                </li>
                <li>
                  <span class="sb-dot teal" />
                  <span class="sb-label">Environmental impact</span>
                  <span class="sb-value good">Good</span>
                </li>
                <li>
                  <span class="sb-dot amber" />
                  <span class="sb-label">Heating efficiency</span>
                  <span class="sb-value avg">Average</span>
                </li>
                <li>
                  <span class="sb-dot blue" />
                  <span class="sb-label">Potential savings</span>
                  <span class="sb-value">£340 / year</span>
                </li>
              </ul>
              <button class="score-breakdown-btn" type="button">
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
          <div class="hs-real-story-icon" aria-hidden="true">&ldquo;</div>
          <div class="hs-real-story-body">
            <div class="hs-real-story-eyebrow">Real story</div>
            <p class="hs-real-story-quote">
              "My neighbour was being charged £150 a month extra — her supplier
              thought she had a swimming pool."
            </p>
            <p class="hs-real-story-text">
              Energy suppliers estimate usage based on assumptions. Those
              assumptions are sometimes very wrong. HomeScore shows you what your
              home should actually cost — and flags when something doesn't add up.
            </p>
          </div>
        </article>

        <aside class="hs-activity-card">
          <div class="hs-activity-head">
            <span class="hs-live-pulse" />
            <strong>147</strong>
          </div>
          <p class="hs-activity-label">HomeScores run in the last hour</p>
          <div class="hs-activity-chart" aria-hidden="true">
            <span v-for="(h, i) in chartBars" :key="i" :style="{ height: h + '%' }" />
          </div>
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
              <svg v-if="i === 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
              </svg>
              <svg v-else-if="i === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="6" y1="20" x2="6" y2="13" /><line x1="12" y1="20" x2="12" y2="8" /><line x1="18" y1="20" x2="18" y2="4" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" /><polyline points="9 14 11 16 15 12" />
              </svg>
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
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import ScoreRing from '~/components/homescore/ScoreRing.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const route = useRoute()
const router = useRouter()
const mobileNavOpen = ref(false)

const heroMeta = ['Free', 'Instant', 'No account needed']
const chartBars = [38, 52, 30, 60, 44, 72, 50, 66, 40, 84, 58, 96]
const stepTones = ['teal', 'purple', 'amber']

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

const howCopy: Record<HowId, { title: string; sub: string }[]> = {
  buyers: [
    {
      title: 'Search any UK address',
      sub: 'Type a postcode or street and see how it scores against its neighbours.',
    },
    {
      title: 'See running costs & risks',
      sub: 'Energy costs, sold history, flood risk — everything public records can tell you before you make an offer.',
    },
    {
      title: 'Know what to ask before you view',
      sub: 'Get a list of questions based on what the EPC data flags — walk in already informed.',
    },
  ],
  owners: [
    {
      title: 'Search your address',
      sub: "See your property's estimated score from public EPC data — takes 5 seconds.",
    },
    {
      title: 'See how you compare to your street',
      sub: 'Find out if this property is costing more to run than similar homes nearby — and why.',
    },
    {
      title: 'Upload bills to get your real number',
      sub: 'Public EPC data can be years out of date. Your actual bills tell the real story — and start building your Property Passport.',
    },
  ],
  curious: [
    {
      title: "Search any address — yours or anyone's",
      sub: 'No account, no commitment. Just type a postcode and see what the data says.',
    },
    {
      title: 'See what your street is paying',
      sub: 'Compare running costs across nearby homes — renting or owning, the data is the same for everyone.',
    },
    {
      title: 'Find out if you could be paying less',
      sub: 'If this property is costing more than its neighbours, the HomeScore shows you exactly why — and what could change it.',
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
  grid-template-columns: 1fr 1fr;
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
  min-height: 520px;
}

.visual-glow {
  position: absolute;
  right: 0;
  top: 40px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.12), transparent 66%);
  filter: blur(8px);
}

.house-stage {
  position: relative;
  /* inset: 30px 0 0 0; */
}

.hero-house {
  position: absolute;
  right: 41px;
  top: 31px;
  width: min(560px, 88%);
  height: 410px;
  border-radius: 24px;
  object-fit: cover;
  object-position: center;
  filter: saturate(1.03) contrast(1.02);
  box-shadow: 0 30px 56px rgba(31, 61, 98, 0.18);
}

.score-card {
  position: relative;
  /* left: 0; */
  /* top: 14px; */
  max-width: 372px;
  padding: 26px 26px 24px;
  border: 1px solid rgba(20, 40, 70, 0.06);
  border-radius: 26px;
  background: #ffffff;
  box-shadow:
    0 2px 0 rgba(255, 255, 255, 0.95) inset,
    0 30px 60px rgba(23, 52, 92, 0.18),
    0 6px 16px rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.score-card-eyebrow {
  text-align: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #009b93;
  margin-bottom: 6px;
}

.score-ring-holder {
  display: flex;
  justify-content: center;
  margin: 2px 0 6px;
}

.score-ring-holder :deep(svg) {
  width: 168px;
  height: 168px;
}

.score-ring-holder :deep(.hs-ring-label) {
  font-size: 12px;
  color: #9e9ea7;
  margin-top: 4px;
  font-weight: 500;
}

.score-breakdown {
  list-style: none;
  margin: 6px 0 18px;
  padding: 18px 2px 0;
  border-top: 1px solid #ebeef2;
  display: grid;
  gap: 16px;
}

.score-breakdown li {
  display: flex;
  align-items: center;
  gap: 11px;
  font-size: 14.5px;
}

.sb-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  flex-shrink: 0;
}

.sb-dot.teal { background: #12b3a6; }
.sb-dot.amber { background: #d99a2b; }
.sb-dot.blue { background: #8b8ff5; }

.sb-label {
  flex: 1;
  color: #231d45;
  font-weight: 600;
  gap: 10px;
  line-height: 1.5;
}

.sb-value {
  font-weight: 800;
  color: #1a2340;
  white-space: nowrap;
}

.sb-value.good { color: #009b8f; }
.sb-value.avg { color: #d6921f; }

.score-breakdown-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: #d7efea;
  color: #017a72;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  letter-spacing: 0.01em;
}

.score-breakdown-btn:hover {
  background: #c7e8e1;
}

.score-breakdown-btn svg {
  width: 15px;
  height: 15px;
}

/* ── Real story + activity ────────────────────────────────────────── */
.hs-story-section {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 26px;
  margin-top: 28px;
}

.hs-real-story {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 30px 32px 30px 36px;
  border: 1px solid rgba(231, 236, 242, 0.9);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 253, 251, 0.92));
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 18px 40px rgba(31, 61, 98, 0.08);
  overflow: hidden;
}

.hs-real-story-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(180deg, #00a19a, #00b6ad);
}

.hs-real-story-icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(150deg, #e4faf3, #c3f0e3);
  color: #00857f;
  font-size: 34px;
  font-weight: 900;
  line-height: 0;
  padding-top: 14px;
}

.hs-real-story-eyebrow {
  font-size: 11px;
  font-weight: 900;
  color: #007e78;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hs-real-story-quote {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 800;
  color: #231d45;
  line-height: 1.36;
  letter-spacing: -0.01em;
}

.hs-real-story-text {
  margin: 0;
  font-size: 15px;
  color: #6b6783;
  line-height: 1.6;
  font-weight: 500;
}

.hs-activity-card {
  display: flex;
  flex-direction: column;
  padding: 26px;
  border: 1px solid rgba(229, 244, 242, 0.9);
  border-radius: 22px;
  background: linear-gradient(180deg, #f4faf8, #ffffff);
  box-shadow: 0 18px 40px rgba(31, 61, 98, 0.06);
}

.hs-activity-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hs-activity-head strong {
  font-size: 30px;
  font-weight: 900;
  color: #00a19a;
  letter-spacing: -0.02em;
}

.hs-activity-label {
  margin: 6px 0 0;
  font-size: 14px;
  font-weight: 700;
  color: #4a5570;
  line-height: 1.4;
}

.hs-activity-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin-top: auto;
  padding-top: 22px;
  height: 96px;
}

.hs-activity-chart span {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, #00b6ad, rgba(0, 161, 154, 0.25));
  min-height: 6px;
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
  top: 38px;
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

.hs-step-icon {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 24px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.8),
    0 12px 26px rgba(24, 52, 88, 0.1);
}

.hs-step-icon svg {
  width: 30px;
  height: 30px;
}

.hs-step-icon.teal {
  background: linear-gradient(150deg, #e4faf3, #c3f0e3);
  color: #00857f;
}

.hs-step-icon.purple {
  background: linear-gradient(150deg, #f3effe, #e1d9fd);
  color: #5a4cf0;
}

.hs-step-icon.amber {
  background: linear-gradient(150deg, #fff6e0, #ffe9bd);
  color: #e59100;
}

.hs-step-badge {
  position: absolute;
  top: -8px;
  right: -8px;
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
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .hero-content {
    max-width: 760px;
  }

  .hero-visual {
    min-height: 470px;
  }

  .hs-story-section {
    grid-template-columns: 1fr;
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
    grid-template-columns: 1fr;
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

  .hero-content h1 {
    font-size: 38px;
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

  .hero-visual {
    min-height: 430px;
  }

  .hero-house {
    width: 80%;
    height: 280px;
  }

  .score-card {
    width: 260px;
  }

  .hs-real-story {
    padding: 24px 22px 24px 26px;
  }

  .hs-real-story-quote {
    font-size: 19px;
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
</style>
