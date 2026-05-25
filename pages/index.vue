<template>
  <div class="landing-v2" :class="{ 'calm-mode': isCalmMode, [`variant-${ctaVariant.toLowerCase()}`]: true }">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <header class="header">
      <div class="shell header-inner">
        <button class="brand" type="button" @click="scrollToTop">
          <OPIcon name="logo" class="brand-logo" />
          <span>umovingu</span>
        </button>

        <nav class="nav" aria-label="Primary navigation">
          <button type="button" @click="scrollToSection('homescore')">HomeScore</button>
          <button type="button" @click="scrollToSection('passport')">Passport</button>
          <button type="button" @click="scrollToSection('story')">Story</button>
          <button type="button" @click="scrollToSection('market')">Market</button>
          <button type="button" @click="scrollToSection('reviews')">Reviews</button>
        </nav>

        <div class="header-actions">
          <button class="btn ghost" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button class="btn solid" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
        </div>
      </div>
    </header>

    <main>
      <section class="hero reveal is-visible" data-reveal @mousemove="onHeroMove" @mouseleave="resetHeroMove">
        <div class="shell hero-grid" :style="heroStyleVars">
          <div class="hero-copy">
            <p class="eyebrow">Property intelligence, redesigned for the web</p>
            <h1>
              Find your <span>HomeScore</span>
              before the market finds your weak points.
            </h1>
            <p class="hero-sub">
              A future-ready property website with immediate scoring, structured passport evidence,
              real-case narrative, and live market context in one clear flow.
            </p>

            <form class="hero-search" @submit.prevent="onHomeScoreCheckClick">
              <label class="hero-label">Start with HomeScore</label>
              <div class="hero-search-row">
                <PropertySearchInput
                  placeholder="Postcode or address"
                  variant="light"
                  :show-passport-status="true"
                  @select="onHomeScoreResultSelect"
                  @enter="onHomeScoreSearchEnter"
                />
                <button class="btn solid lg" type="submit" @click="trackCtaClick('hero_search_button', '/homescore')">
                  {{ primaryCtaLabel }}
                </button>
              </div>
            </form>

            <div class="stat-row">
              <article>
                <strong>74 / 100</strong>
                <span>Sample HomeScore</span>
              </article>
              <article>
                <strong>17 sections</strong>
                <span>Passport structure</span>
              </article>
              <article>
                <strong>14 days</strong>
                <span>Illustrative prepared completion</span>
              </article>
            </div>
          </div>

          <div class="hero-visual">
            <article class="panel score-panel float-a">
              <div class="panel-top">
                <span>HomeScore</span>
                <span class="chip">Primary</span>
              </div>

              <div class="score-body">
                <div class="score-ring-wrap" aria-label="HomeScore value 74 out of 100">
                  <svg class="score-ring" viewBox="0 0 140 140">
                    <circle class="ring-bg" cx="70" cy="70" r="52" />
                    <circle class="ring-meter" cx="70" cy="70" r="52" />
                  </svg>
                  <div class="ring-center">
                    <strong>{{ gaugeScore }}</strong>
                    <span>{{ gaugeLabel }}</span>
                  </div>
                </div>

                <div class="score-copy">
                  <h2>Instant signal, clear next action.</h2>
                  <p>Score first. Evidence second. Decisions with confidence.</p>
                </div>
              </div>
            </article>

            <article class="panel passport-preview float-b">
              <div class="passport-card-inline">
                <PassportCard
                  :line1="dummyPassportAddress.line1"
                  :line2="dummyPassportAddress.line2"
                />
              </div>
              <div class="passport-content">
                <span>Property Passport</span>
                <strong>Real app visual, now in web flow</strong>
                <p>Title deeds, searches, fixtures, boundaries, and compliance in one verified record.</p>
              </div>
            </article>

            <article class="panel image-preview float-c">
              <img src="/images/findPropertyBackground.png" alt="Residential property" />
              <div class="image-caption">
                <span>Market visibility</span>
                <strong>See profile, risk, and readiness together</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="media-strip reveal" data-reveal>
        <div class="media-track">
          <figure v-for="(item, index) in ukHouseSamples" :key="`uk-house-${index}`">
            <img :src="item.src" :alt="item.alt" @error="onMediaImageError(index)" />
          </figure>
        </div>
      </section>

      <section id="homescore" class="section reveal" data-reveal>
        <div class="shell split">
          <div class="copy">
            <p class="eyebrow">HomeScore first</p>
            <h2>Lead with the thing users care about immediately</h2>
            <p>
              Search-led websites win because the first action is obvious. Here, that first action is HomeScore.
              From there, users can move into structured passport evidence without friction.
            </p>
            <ul>
              <li>Energy and cost signals in seconds</li>
              <li>Readiness indicators before listing or offering</li>
              <li>Natural bridge into passport detail</li>
            </ul>
            <button class="btn solid lg" type="button" @click="goToHomeScore">Open HomeScore</button>
          </div>

          <article class="panel detail-panel">
            <div class="detail-head">
              <span>Sample property profile</span>
              <span>CV5 6AJ</span>
            </div>
            <div class="detail-main">
              <strong>74</strong>
              <div>
                <h3>Good readiness</h3>
                <p>Strong baseline with practical opportunities to improve before transaction pressure starts.</p>
              </div>
            </div>
            <div class="progress-set">
              <div><label>Energy profile</label><i style="width: 72%" /></div>
              <div><label>Documentation readiness</label><i style="width: 84%" /></div>
              <div><label>Buyer confidence</label><i style="width: 78%" /></div>
            </div>
          </article>
        </div>
      </section>

      <section id="passport" class="section reveal" data-reveal>
        <div class="shell split reverse">
          <article class="panel passport-panel">
            <div class="passport-book-wrap">
              <div class="passport-card-inline passport-card-inline-lg">
                <PassportCard
                  :line1="dummyPassportAddress.line1"
                  :line2="dummyPassportAddress.line2"
                />
              </div>
            </div>
            <div class="passport-list">
              <div>Title deeds and plan</div>
              <div>Searches and planning</div>
              <div>Fixtures and fittings</div>
              <div>Boundaries and compliance</div>
            </div>
          </article>

          <div class="copy">
            <p class="eyebrow">Property Passport</p>
            <h2>Same trusted passport identity as your app</h2>
            <p>
              The web page now uses the real passport visual and presents the structure in a way that feels
              product-grade and ready for serious property workflows.
            </p>
          </div>
        </div>
      </section>

      <section id="story" class="section reveal" data-reveal>
        <div class="shell split">
          <div class="copy">
            <p class="eyebrow">A real story</p>
            <h2>Aisha sold in fourteen days because preparation started early</h2>
            <p>
              Case content is fully visible, not hidden. Users can understand outcomes and trust before signup.
            </p>
            <blockquote>
              "We prepared documents before viewings, so legal review started with context, not confusion."
            </blockquote>
          </div>

          <article class="panel timeline">
            <div>
              <span>Before</span>
              <strong>Preparation before viewings</strong>
              <p>Evidence and documents were organized before buyer enquiries.</p>
            </div>
            <div>
              <span>During</span>
              <strong>Faster solicitor response</strong>
              <p>Fewer surprises and lower delay risk across the transaction path.</p>
            </div>
            <div>
              <span>After</span>
              <strong>14-day completion path</strong>
              <p>A practical proof of what structured preparation can change.</p>
            </div>
          </article>
        </div>
      </section>

      <section id="market" class="section reveal" data-reveal>
        <div class="shell market-block">
          <div class="copy compact">
            <p class="eyebrow">Market Today</p>
            <h2>Show urgency with clear market data</h2>
          </div>

          <div class="market-grid">
            <article class="panel market-card">
              <strong>179 days</strong>
              <p>Average sale path when key information appears late.</p>
            </article>
            <article class="panel market-card">
              <strong>GBP 2.7k</strong>
              <p>Average consumer loss when transactions fail.</p>
            </article>
            <article class="panel market-card">
              <strong>1 in 3</strong>
              <p>Sales that still collapse before completion.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="reviews" class="section reveal" data-reveal>
        <div class="shell review-block">
          <div class="copy compact">
            <p class="eyebrow">Social proof</p>
            <h2>Credibility in a visible position</h2>
          </div>

          <div class="review-grid">
            <article class="panel review-card">
              <div class="stars">★★★★★</div>
              <p>"HomeScore made the first week dramatically clearer than our previous process."</p>
              <span>Seller · Coventry</span>
            </article>
            <article class="panel review-card">
              <div class="stars">★★★★★</div>
              <p>"Passport structure reduced solicitor back-and-forth and made the workflow calmer."</p>
              <span>Landlord · Manchester</span>
            </article>
            <article class="panel review-card">
              <div class="stars">★★★★★</div>
              <p>"Score + story + market context made value obvious in under a minute."</p>
              <span>Buyer · London</span>
            </article>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="shell footer-grid">
          <div>
            <div class="footer-brand">
              <OPIcon name="logo" class="brand-logo" />
              <strong>umovingu</strong>
            </div>
            <p>
              Professional property intelligence for sellers, buyers, and landlords.
              Start with HomeScore and progress with confidence.
            </p>
          </div>

          <div>
            <h3>Product</h3>
            <ul>
              <li><a href="/homescore">HomeScore</a></li>
              <li><a href="/passport/collections">Property Passport</a></li>
              <li><a href="/marketplace">Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h3>Legal</h3>
            <ul>
              <li><a href="/legal/privacy">Privacy</a></li>
              <li><a href="/legal/terms">Terms</a></li>
              <li><a href="/legal/cookies">Cookies</a></li>
            </ul>
          </div>

          <div>
            <h3>Account</h3>
            <ul>
              <li><a href="/onboarding/signin">Sign in</a></li>
              <li><a href="/onboarding/signup">Create account</a></li>
            </ul>
          </div>
        </div>
        <div class="shell footer-bottom">© 2026 UMU. All rights reserved.</div>
      </footer>
    </main>

    <transition name="cta-fade">
      <button
        v-if="showStickyCta"
        class="sticky-cta btn solid"
        type="button"
        @click="goToStickyCtaDestination"
      >
        {{ stickyCtaLabel }}
      </button>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import OPIcon from '~/components/ui/OPIcon.vue'

definePageMeta({ middleware: 'guest' })

const gaugeScore = 74
const showStickyCta = ref(false)
const isCalmMode = ref(false)
const ctaVariant = ref<'A' | 'B'>('A')
const dummyPassportAddress = {
  line1: '42 Willow Bank Road',
  line2: 'Coventry, CV5 6AJ',
}
const ukHouseSamples = ref([
  {
    src: '/images/uk-houses/house-1.jpg',
    alt: 'Sample UK detached home exterior',
  },
  {
    src: '/images/uk-houses/house-2.jpg',
    alt: 'Sample UK terraced homes',
  },
  {
    src: '/images/uk-houses/house-3.jpg',
    alt: 'Sample UK semi-detached house',
  },
  {
    src: '/images/uk-houses/house-4.jpg',
    alt: 'Sample London residential house exterior',
  },
  {
    src: '/images/uk-houses/house-5.jpg',
    alt: 'Sample British suburban home',
  },
  {
    src: '/images/uk-houses/house-6.jpg',
    alt: 'Sample England brick house exterior',
  },
  {
    src: '/images/uk-houses/house-7.jpg',
    alt: 'Sample UK cottage style house',
  },
  {
    src: '/images/uk-houses/house-8.jpg',
    alt: 'Sample Manchester residential street homes',
  },
])
let revealObserver: IntersectionObserver | null = null

const heroTilt = reactive({ x: 0, y: 0 })

const heroStyleVars = computed(() => ({
  '--tilt-x': `${heroTilt.x}px`,
  '--tilt-y': `${heroTilt.y}px`,
}))

const gaugeLabel = computed(() => {
  if (gaugeScore >= 80) return 'Excellent'
  if (gaugeScore >= 60) return 'Good'
  return 'Needs work'
})

const primaryCtaLabel = computed(() =>
  ctaVariant.value === 'A' ? 'Check HomeScore' : 'Start in 60 seconds',
)

const stickyCtaLabel = computed(() =>
  ctaVariant.value === 'A' ? 'Check your HomeScore' : 'Start your Property Passport',
)

function onHeroMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  if (!target) return
  const rect = target.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  heroTilt.x = (x - 0.5) * 12
  heroTilt.y = (y - 0.5) * 10
}

function resetHeroMove() {
  heroTilt.x = 0
  heroTilt.y = 0
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function trackLandingEvent(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const eventData = {
    event: eventName,
    page: 'landing',
    ctaVariant: ctaVariant.value,
    ...payload,
    ts: Date.now(),
  }
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> }
  if (!Array.isArray(win.dataLayer)) {
    win.dataLayer = []
  }
  win.dataLayer.push(eventData)
  window.dispatchEvent(new CustomEvent('umu:analytics', { detail: eventData }))
}

function trackCtaClick(source: string, destination: string) {
  trackLandingEvent('landing_cta_click', { source, destination })
}

function goToHomeScore() {
  goToHomeScoreFrom('general_cta')
}

function goToHomeScoreFrom(source: string) {
  trackCtaClick(source, '/homescore')
  navigateTo('/homescore')
}

function onHomeScoreResultSelect(property: { id: string }) {
  trackLandingEvent('landing_homescore_search_select', {
    source: 'hero_search',
    propertyId: property.id,
  })
  navigateTo(`/homescore/${property.id}`)
}

function onHomeScoreSearchEnter(_q: string) {
  // PropertySearchInput opens/selects from dropdown on enter, mirroring /homescore.
}

function onHomeScoreCheckClick() {
  trackLandingEvent('landing_homescore_search_check_click', {
    source: 'hero_search',
  })
  const input = document.querySelector<HTMLInputElement>('.hero-search-row input')
  input?.focus()
}

function onMediaImageError(index: number) {
  const fallback = '/op-icons/backgroundImage.jpeg'
  if (!ukHouseSamples.value[index]) return
  ukHouseSamples.value[index] = {
    ...ukHouseSamples.value[index],
    src: fallback,
  }
}

function goToStickyCtaDestination() {
  if (ctaVariant.value === 'B') {
    trackCtaClick('sticky_cta', '/passport/collections')
    navigateTo('/passport/collections')
    return
  }
  goToHomeScoreFrom('sticky_cta')
}

function onWindowScroll() {
  if (typeof window === 'undefined') return
  const threshold = window.innerWidth <= 760 ? 320 : 520
  showStickyCta.value = window.scrollY > threshold
  isCalmMode.value = window.scrollY > 760
}

function initCtaVariant() {
  if (typeof window === 'undefined') return
  const key = 'umu_landing_cta_variant'
  const saved = window.localStorage.getItem(key)
  if (saved === 'A' || saved === 'B') {
    ctaVariant.value = saved
    return
  }
  const assigned = Math.random() >= 0.5 ? 'B' : 'A'
  ctaVariant.value = assigned
  window.localStorage.setItem(key, assigned)
}

function trackVariantExposure() {
  if (typeof window === 'undefined') return
  const key = `umu_landing_exposure_${ctaVariant.value}`
  if (window.sessionStorage.getItem(key)) return
  window.sessionStorage.setItem(key, '1')
  trackLandingEvent('landing_cta_variant_exposure', {
    variant: ctaVariant.value,
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  initCtaVariant()
  trackVariantExposure()

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]')
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    sections.forEach((section) => revealObserver?.observe(section))
  }

  onWindowScroll()
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})

onUnmounted(() => {
  revealObserver?.disconnect()
  revealObserver = null
  window.removeEventListener('scroll', onWindowScroll)
})
</script>

<style scoped>
.landing-v2 {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-card-border: #d8e3ee;
  --fx-card-shadow: 0 18px 32px rgba(33, 61, 98, 0.08);
  position: relative;
  min-height: 100dvh;
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 8% 11%, rgba(13, 191, 181, 0.2) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.18) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  overflow-x: hidden;
}

.mesh {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 92%);
}

.ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(36px);
  pointer-events: none;
  opacity: 0.32;
  animation: drift 20s ease-in-out infinite;
}

.ambient-a {
  width: 260px;
  height: 260px;
  top: 120px;
  left: -60px;
  background: rgba(0, 161, 154, 0.3);
}

.ambient-b {
  width: 280px;
  height: 280px;
  top: 160px;
  right: -80px;
  background: rgba(95, 139, 255, 0.26);
  animation-duration: 30s;
}

.shell {
  width: min(1240px, calc(100% - 40px));
  margin: 0 auto;
}

.header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
}

.header-inner {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #1e2b41;
  cursor: pointer;
}

.brand-logo {
  width: 30px;
  height: 30px;
  color: #00a19a;
}

.nav {
  display: flex;
  gap: 8px;
}

.nav button {
  border: 0;
  background: transparent;
  color: #52627e;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.nav button:hover {
  background: rgba(20, 53, 98, 0.06);
  color: #1e2b41;
}

.header-actions {
  display: inline-flex;
  gap: 8px;
}

.btn {
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn.solid {
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
  background-size: 150% 150%;
  animation: ctaPulse 5.6s ease-in-out infinite;
}

.btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}

.btn.lg { padding: 14px 20px; font-size: 15px; }
.btn:not(.lg) { padding: 10px 14px; font-size: 14px; }

.btn.solid:hover {
  box-shadow: 0 16px 28px rgba(26, 121, 200, 0.3);
  background-position: 85% 15%;
}

.hero {
  padding: 58px 0 40px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 24px;
  align-items: start;
}

.eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.8px;
  color: #00857f;
  font-weight: 800;
}

.hero-copy h1 {
  margin: 0;
  color: #18263b;
  font-size: clamp(34px, 4.6vw, 56px);
  line-height: 0.98;
  letter-spacing: -1.2px;
  font-weight: 650;
}

.hero-copy h1 span {
  color: #00a19a;
}

.hero-sub,
.copy p,
.timeline p,
.market-card p,
.review-card p,
.footer p,
.footer a,
.footer-bottom {
  color: #586a83;
  line-height: 1.65;
}

.hero-sub {
  margin: 18px 0 0;
  font-size: 17px;
}

.hero-search {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #d8e3ef;
  border-radius: 20px;
  box-shadow: 0 20px 34px rgba(32, 60, 96, 0.08);
  padding: 18px;
}

.hero-label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  color: #50637f;
  font-weight: 700;
}

.hero-search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.hero-search-row :deep(.psi-input) {
  min-height: 50px;
  border-radius: 14px;
  border-color: #d2dcea;
  background: #fff;
}

.hero-search-row :deep(.psi-input:focus) {
  border-color: #8ab4db;
}

.hero-search-row :deep(.psi-drop) {
  z-index: 12;
}

.stat-row {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stat-row article {
  border-radius: 14px;
  border: 1px solid #d9e4ee;
  background: rgba(255, 255, 255, 0.88);
  padding: 12px;
  transition: transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease;
}

.stat-row article:hover {
  transform: translateY(-3px);
  border-color: #c5dcef;
  box-shadow: 0 14px 24px rgba(35, 64, 102, 0.12);
}

.stat-row strong {
  display: block;
  color: #18293f;
  font-size: 20px;
  font-weight: 700;
}

.stat-row span {
  display: block;
  margin-top: 3px;
  font-size: 13px;
  color: #60728c;
}

.hero-visual {
  display: grid;
  gap: 10px;
  transform: translate3d(var(--tilt-x, 0), var(--tilt-y, 0), 0);
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--fx-card-border);
  border-radius: 20px;
  box-shadow: var(--fx-card-shadow);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  overflow: hidden;
}

.panel:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: #b9d5ea;
  box-shadow: 0 24px 38px rgba(33, 61, 98, 0.16);
}

.panel::before {
  content: '';
  position: absolute;
  inset: -140% auto auto -40%;
  width: 52%;
  height: 300%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.42) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(16deg);
  transition: transform 0.7s ease;
  pointer-events: none;
}

.panel:hover::before {
  transform: translateX(210%) rotate(16deg);
}

.score-panel {
  padding: 18px;
}

.panel-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: #4b657f;
  font-size: 12px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  font-weight: 700;
}

.chip {
  border-radius: 999px;
  background: #eafaf7;
  color: #00857f;
  padding: 5px 10px;
}

.score-body {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 14px;
  align-items: center;
}

.score-ring-wrap {
  position: relative;
  width: 170px;
  height: 170px;
}

.score-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg,
.ring-meter {
  fill: none;
  stroke-width: 10;
}

.ring-bg {
  stroke: #dcebf4;
}

.ring-meter {
  stroke: #00a19a;
  stroke-linecap: round;
  stroke-dasharray: 326.73;
  stroke-dashoffset: 84.95;
  filter: drop-shadow(0 0 8px rgba(0, 161, 154, 0.36));
  animation: ringGlow 3.4s ease-in-out infinite;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.ring-center strong {
  color: #16263d;
  font-size: 50px;
  line-height: 1;
  font-weight: 700;
}

.ring-center span {
  margin-top: 4px;
  color: #00857f;
  font-weight: 700;
}

.score-copy h2 {
  margin: 0;
  color: #15263d;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.4px;
  font-weight: 600;
}

.score-copy p {
  margin: 8px 0 0;
  font-size: 14px;
}

.passport-preview,
.image-preview {
  padding: 14px;
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  align-items: center;
}

.passport-preview img {
  width: 100%;
  max-width: 94px;
  filter: drop-shadow(0 12px 20px rgba(21, 40, 66, 0.25));
}

.passport-card-inline {
  width: 94px;
}

.passport-card-inline :deep(.passport-card) {
  margin: 0;
}

.passport-card-inline :deep(.passport-container) {
  max-width: 94px;
}

.passport-card-inline :deep(.passport-address) {
  bottom: 13%;
}

.passport-card-inline-lg {
  width: 132px;
}

.passport-card-inline-lg :deep(.passport-container) {
  max-width: 132px;
}

.image-preview img {
  width: 100%;
  max-width: 110px;
  border-radius: 12px;
  height: 86px;
  object-fit: cover;
}

.passport-content span,
.image-caption span {
  display: block;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 10px;
  color: #00857f;
  font-weight: 800;
}

.passport-content strong,
.image-caption strong {
  display: block;
  margin-top: 6px;
  color: #1d2e47;
  font-size: 18px;
  line-height: 1.14;
  font-weight: 650;
}

.passport-content p,
.image-caption p {
  margin: 6px 0 0;
  color: #5d708a;
  font-size: 13px;
}

.float-a { animation: float 8s ease-in-out infinite; }
.float-b { animation: float 10s ease-in-out infinite; }
.float-c { animation: float 9s ease-in-out infinite; }

.variant-b .sticky-cta {
  background: linear-gradient(135deg, #1573bf, #00a19a);
}

.variant-b .hero-search {
  border-color: #c8ddef;
}

.media-strip {
  padding: 10px 0 6px;
  overflow: hidden;
}

.media-track {
  --item-width: 220px;
  --item-gap: 12px;
  --item-count: 8;
  display: flex;
  gap: var(--item-gap);
  width: max-content;
  animation: marquee 52s linear infinite;
}

.media-track figure {
  margin: 0;
  width: var(--item-width);
  height: 130px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #dbe6ef;
  box-shadow: 0 14px 26px rgba(36, 64, 100, 0.1);
}

.media-track img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section {
  padding: 44px 0;
}

.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal .panel {
  opacity: 0;
  transform: translateY(16px);
}

.reveal.is-visible .panel {
  opacity: 1;
  transform: translateY(0);
}

.market-grid .market-card:nth-child(2),
.review-grid .review-card:nth-child(2),
.timeline > div:nth-child(2) {
  transition-delay: 70ms;
}

.market-grid .market-card:nth-child(3),
.review-grid .review-card:nth-child(3),
.timeline > div:nth-child(3) {
  transition-delay: 130ms;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.reverse > :first-child { order: 1; }
.reverse > :last-child { order: 2; }

.copy h2 {
  margin: 0;
  color: #18273c;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.06;
  letter-spacing: -0.6px;
  font-weight: 620;
}

.copy ul {
  margin: 14px 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.copy li {
  position: relative;
  padding-left: 16px;
  color: #596b84;
}

.copy li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00a19a;
}

.detail-panel {
  padding: 18px;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  color: #5f748f;
  font-size: 13px;
  font-weight: 700;
}

.detail-main {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
}

.detail-main > strong {
  font-size: 68px;
  line-height: 1;
  color: #00a19a;
  letter-spacing: -1.8px;
  font-weight: 700;
}

.detail-main h3 {
  margin: 0;
  color: #1d2f48;
  font-size: 20px;
  font-weight: 620;
}

.detail-main p {
  margin: 6px 0 0;
}

.progress-set {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.progress-set div {
  display: grid;
  gap: 4px;
}

.progress-set label {
  color: #5a6d86;
  font-size: 13px;
  font-weight: 700;
}

.progress-set i {
  display: block;
  height: 9px;
  border-radius: 999px;
  background: linear-gradient(90deg, #00a19a, #5898f6);
}

.passport-panel {
  padding: 16px;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 14px;
  align-items: center;
}

.passport-book-wrap {
  display: grid;
  place-items: center;
}

.passport-book-wrap img {
  width: 100%;
  max-width: 132px;
  filter: drop-shadow(0 14px 22px rgba(22, 42, 67, 0.24));
}

.passport-list {
  display: grid;
  gap: 8px;
}

.passport-list div {
  border-radius: 12px;
  border: 1px solid #dde8f1;
  background: #f7fbff;
  color: #28384e;
  padding: 11px;
  font-weight: 650;
  font-size: 14px;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.passport-list div:hover {
  transform: translateY(-2px);
  border-color: #c5dcef;
  box-shadow: 0 10px 18px rgba(34, 65, 103, 0.12);
}

blockquote {
  margin: 16px 0 0;
  border-left: 3px solid #00a19a;
  padding-left: 14px;
  color: #1f324d;
  font-size: 18px;
  line-height: 1.55;
}

.timeline {
  padding: 16px;
  display: grid;
  gap: 8px;
}

.timeline div {
  border-radius: 12px;
  border: 1px solid #dce7f0;
  background: #fff;
  padding: 12px;
}

.timeline span {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 10px;
  color: #00857f;
  font-weight: 800;
}

.timeline strong {
  display: block;
  margin-top: 7px;
  color: #1e314a;
  font-size: 18px;
  line-height: 1.16;
  font-weight: 620;
}

.market-block,
.review-block {
  display: grid;
  gap: 14px;
}

.market-grid,
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.market-card {
  padding: 16px;
}

.market-card strong {
  display: block;
  color: #1d2f47;
  font-size: 32px;
  line-height: 1;
  letter-spacing: -0.7px;
  font-weight: 650;
}

.review-card {
  padding: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 36px rgba(35, 66, 106, 0.14);
}

.stars {
  color: #ffb31a;
  font-size: 16px;
  letter-spacing: 1px;
}

.review-card span {
  display: block;
  margin-top: 10px;
  color: #61758f;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.footer {
  margin-top: 34px;
  padding: 26px 0 16px;
  background: linear-gradient(180deg, rgba(246, 251, 255, 0.88), rgba(235, 243, 249, 0.95));
  border-top: 1px solid rgba(30, 47, 71, 0.11);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1fr;
  gap: 16px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.footer-brand strong {
  color: #1f3049;
  font-size: 18px;
  font-weight: 700;
}

.footer h3 {
  margin: 2px 0 8px;
  color: #21354f;
  font-size: 14px;
}

.footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}

.footer a {
  text-decoration: none;
}

.footer a:hover {
  color: #21354f;
}

.footer-bottom {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(30, 47, 71, 0.1);
  font-size: 13px;
}

.sticky-cta {
  position: fixed;
  right: 20px;
  bottom: 18px;
  z-index: 55;
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 14px;
  box-shadow: 0 16px 30px rgba(27, 118, 193, 0.36);
}

.variant-b .sticky-cta {
  left: 20px;
  right: auto;
}

.calm-mode .ambient,
.calm-mode .mesh {
  opacity: 0.18;
}

.calm-mode .panel,
.calm-mode .btn,
.calm-mode .hero-visual {
  transition-duration: 0.18s;
}

.calm-mode .float-a,
.calm-mode .float-b,
.calm-mode .float-c,
.calm-mode .media-track,
.calm-mode .ring-meter,
.calm-mode .btn.solid {
  animation-play-state: paused;
}

.cta-fade-enter-active,
.cta-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.cta-fade-enter-from,
.cta-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes drift {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(22px, -16px, 0) scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% {
    transform: translateX(
      calc((var(--item-width) + var(--item-gap)) * var(--item-count) * -1)
    );
  }
}

@keyframes ringGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 8px rgba(0, 161, 154, 0.32));
  }
  50% {
    filter: drop-shadow(0 0 14px rgba(0, 161, 154, 0.48));
  }
}

@keyframes ctaPulse {
  0%,
  100% {
    box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
  }
  50% {
    box-shadow: 0 18px 30px rgba(26, 121, 200, 0.32);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient,
  .media-track,
  .float-a,
  .float-b,
  .float-c,
  .ring-meter,
  .btn.solid,
  .reveal {
    animation: none;
    transition: none;
  }

  .reveal {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 1120px) {
  .hero-grid,
  .split {
    grid-template-columns: 1fr;
  }

  .stat-row,
  .market-grid,
  .review-grid,
  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .reverse > :first-child,
  .reverse > :last-child {
    order: initial;
  }
}

@media (max-width: 760px) {
  .shell { width: calc(100% - 28px); }

  .header { position: static; }

  .nav,
  .header-actions .btn.ghost { display: none; }

  .header-inner { min-height: 64px; }

  .hero { padding: 30px 0 26px; }

  .hero-copy h1 { font-size: 38px; }

  .hero-search-row,
  .score-body,
  .passport-preview,
  .image-preview,
  .detail-main,
  .passport-panel,
  .stat-row,
  .market-grid,
  .review-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .score-ring-wrap { margin: 0 auto; }

  .section { padding: 34px 0; }

  .copy h2 { font-size: 30px; }

  .passport-card-inline {
    width: 110px;
  }

  .passport-card-inline :deep(.passport-container) {
    max-width: 110px;
  }

  .passport-card-inline-lg {
    width: 132px;
  }

  .sticky-cta {
    right: 14px;
    left: 14px;
    bottom: 14px;
    text-align: center;
    justify-content: center;
  }
}
</style>
