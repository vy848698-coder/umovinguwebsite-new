<template>
  <div class="marketplace-root">

    <header class="marketplace-web-nav">
      <div class="marketplace-web-shell nav-inner">
        <button class="brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="brand-logo" />
          <span class="brand-name">umovingu</span>
          <span class="brand-beta">BETA</span>
        </button>

        <nav class="web-links" aria-label="Marketplace navigation">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Passport</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>

        <div class="web-actions">
          <button class="web-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
          <button class="web-btn solid" type="button" @click="navigateTo('/claim')">Claim Passport</button>
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

      <div class="marketplace-web-shell">
        <div class="web-mobile-backdrop" :class="{ open: mobileNavOpen }" @click="mobileNavOpen = false" />
        <div class="web-mobile-panel" :class="{ open: mobileNavOpen }">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="goMobile('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="goMobile('/homescore')">HomeScore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="goMobile('/passport')">Passport</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="goMobile('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="goMobile('/profile/learn')">Learn</button>
          <button type="button" :class="{ active: navIsActive('/profile') }" @click="goMobile('/profile')">Profile</button>
          <button type="button" class="claim" @click="goMobile('/claim')">Claim Passport</button>
        </div>
      </div>
    </header>

    <main class="marketplace-web-shell marketplace-main">
      <section class="marketplace-hero">
        <div class="hero-content">
          <p class="section-kicker">Marketplace</p>
          <h1>Trusted property services, built around your Property Passport.</h1>
          <p class="hero-description">
            Compare quotes, read verified reviews and book the right professionals - all powered by your property data.
          </p>

          <div class="hero-cta-group">
            <button class="web-btn primary" type="button" @click="scrollToWaitlist">Join the waitlist</button>
            <button class="web-btn secondary play-btn" type="button" @click="scrollToServices">
              <span class="play-dot" aria-hidden="true">Play</span>
              Watch how it works
            </button>
          </div>

          <div class="hero-trust" aria-label="Marketplace trust highlights">
            <div class="rating-block">
              <div class="stars" aria-hidden="true">*****</div>
              <strong>4.8/5</strong>
              <span>From early access users</span>
            </div>
            <div class="trust-divider" />
            <div class="verified-block">
              <span class="mini-icon teal">PP</span>
              <div>
                <strong>Independent & verified</strong>
                <span>We check every professional</span>
              </div>
            </div>
          </div>
        </div>

        <aside class="hero-visual" aria-label="Property passport preview">
          <div class="orbit-line" />
          <div class="service-bubble bubble-conveyancing">CV</div>
          <div class="service-bubble bubble-survey">SV</div>
          <div class="service-bubble bubble-energy">EN</div>
          <div class="service-bubble bubble-removal">RM</div>

          <div class="house-stage">
            <img src="/images/uk-houses/house-6.jpg" alt="Modern UK home" class="hero-house" />
            <div class="passport-card">
              <div class="passport-logo"><img src="/logo-new.png" alt="" /></div>
              <p>Property Passport</p>
              <h2>12 Bott Road</h2>
              <span>Coventry, CV5 6AZ</span>
              <dl>
                <div>
                  <dt>Property details</dt>
                  <dd>Verified</dd>
                </div>
                <div>
                  <dt>Documents</dt>
                  <dd>12 uploaded</dd>
                </div>
                <div>
                  <dt>Utilities</dt>
                  <dd>Connected</dd>
                </div>
                <div>
                  <dt>Legal & Compliance</dt>
                  <dd>Up to date</dd>
                </div>
              </dl>
              <strong>100% Complete</strong>
              <div class="passport-progress"><span /></div>
            </div>
          </div>
        </aside>
      </section>

      <section class="value-strip" aria-label="Marketplace advantages">
        <article v-for="item in valueItems" :key="item.title" class="value-item">
          <span :class="['round-icon', item.tone]">{{ item.icon }}</span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </article>
      </section>

      <section class="marketplace-services" id="services-section">
        <div class="services-header">
          <p class="section-kicker">Explore services</p>
          <h2>Find the right expert for your needs</h2>
          <p>Curated professionals. Transparent pricing. Powered by your property data.</p>
        </div>

        <div class="services-grid">
          <article v-for="service in services" :key="service.title" class="service-card">
            <span :class="['round-icon large', service.tone]">{{ service.icon }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul class="service-features">
              <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
            </ul>
            <button class="service-btn" type="button" @click="scrollToWaitlist">
              <span>Explore</span>
              <span aria-hidden="true">-></span>
            </button>
          </article>
        </div>
      </section>

      <section class="proof-section">
        <div class="testimonial-visual">
          <img src="/images/uk-houses/house-2.jpg" alt="Bright home interior" />
          <article class="quote-card">
            <div class="stars" aria-hidden="true">*****</div>
            <p>"Super quick turnaround and great communication from start to finish."</p>
            <div class="quote-person">
              <span>SJ</span>
              <div>
                <strong>Sarah J.</strong>
                <small>Homebuyer</small>
              </div>
            </div>
          </article>
        </div>

        <div class="proof-copy">
          <p class="section-kicker">Why homeowners love Marketplace</p>
          <h2>A better way to get things done</h2>
          <div class="proof-list">
            <article v-for="benefit in benefits" :key="benefit.title">
              <span>OK</span>
              <div>
                <h3>{{ benefit.title }}</h3>
                <p>{{ benefit.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="marketplace-how-it-works">
        <p class="section-kicker">How it works</p>
        <h2>Simple steps to move with confidence</h2>
        <div class="steps-row">
          <article v-for="step in steps" :key="step.number" :class="['step-item', step.tone]">
            <span class="step-number">{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="marketplace-cta" id="waitlist-section">
        <div class="mail-icon" aria-hidden="true">
          <span>@</span>
        </div>
        <div class="cta-copy">
          <h2>Be first when Marketplace launches</h2>
          <p>Join the waitlist and we'll give you a GBP 25 credit towards your first booking.</p>
        </div>
        <form class="cta-form" @submit.prevent="submitNotify">
          <label class="sr-only" for="marketplace-email">Email address</label>
          <input
            id="marketplace-email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            :disabled="submitting || submitted"
            required
          />
          <button type="submit" :disabled="submitting || submitted">
            <span v-if="submitting">Joining...</span>
            <span v-else-if="submitted">Joined</span>
            <span v-else>Join waitlist</span>
          </button>
          <p class="cta-notice">OK No spam. Unsubscribe anytime.</p>
          <div v-if="errorMsg" class="cta-error">{{ errorMsg }}</div>
        </form>
      </section>
    </main>

    <SiteFooter />

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const route = useRoute()
const config = useRuntimeConfig()
const mobileNavOpen = ref(false)

const valueItems = [
  {
    icon: 'FF',
    tone: 'teal',
    title: 'Fixed-fee pricing',
    description: 'Clear quotes, no surprises',
  },
  {
    icon: 'PP',
    tone: 'purple',
    title: 'Passport-ready handover',
    description: 'Data pre-filled, saves time',
  },
  {
    icon: 'VP',
    tone: 'amber',
    title: 'Verified professionals',
    description: 'Checked, rated and reviewed',
  },
  {
    icon: 'FT',
    tone: 'blue',
    title: 'Faster transactions',
    description: 'Everything in one place',
  },
]

const services = [
  {
    icon: 'CV',
    tone: 'teal',
    title: 'Conveyancing',
    description: 'Fixed-fee quotes matched to Passport data.',
    features: ['Property sale & purchase', 'Remortgage', 'Transfer of ownership'],
  },
  {
    icon: 'SV',
    tone: 'purple',
    title: 'Surveying',
    description: 'RICS certified surveys and property reports.',
    features: ['Homebuyer reports', 'Building surveys', 'Valuations'],
  },
  {
    icon: 'EN',
    tone: 'amber',
    title: 'Energy',
    description: 'EPCs, upgrades and energy efficiency services.',
    features: ['EPC certificates', 'Energy upgrades', 'Advice & compliance'],
  },
  {
    icon: 'RM',
    tone: 'blue',
    title: 'Removal',
    description: 'Trusted removal services for a stress-free move.',
    features: ['Home removals', 'Packing & storage', 'Nationwide coverage'],
  },
]

const benefits = [
  {
    title: 'Pre-quoted, no haggling',
    description: 'See total cost before you instruct.',
  },
  {
    title: 'Faster onboarding',
    description: 'Passport data maps into service workflows.',
  },
  {
    title: 'Verified trust signals',
    description: 'Independent feedback from UMU journeys.',
  },
  {
    title: 'Everything in one place',
    description: 'Manage quotes, bookings and updates.',
  },
]

const steps = [
  {
    number: '1',
    tone: 'teal',
    title: 'Complete your Passport',
    description: 'Add your property details and documents.',
  },
  {
    number: '2',
    tone: 'purple',
    title: 'Get matched & compare',
    description: 'We match you with trusted professionals and quotes.',
  },
  {
    number: '3',
    tone: 'amber',
    title: 'Book with confidence',
    description: 'Choose, book and manage everything in one place.',
  },
]

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

const scrollToWaitlist = () => {
  const el = document.querySelector('#waitlist-section')
  el?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToServices = () => {
  const el = document.querySelector('#services-section')
  el?.scrollIntoView({ behavior: 'smooth' })
}

const email = ref('')
const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

async function submitNotify() {
  errorMsg.value = ''
  if (!email.value.trim()) return
  submitting.value = true
  try {
    // Re-use the existing /support/request endpoint so the team can pull a marketplace-interest list.
    await $fetch(`${config.public.apiBase}/support/request`, {
      method: 'POST',
      body: {
        email: email.value.trim(),
        subject: 'Marketplace early access',
        message: 'Add me to the marketplace waitlist.',
        kind: 'marketplace_waitlist',
      },
    })
    submitted.value = true
  } catch (e: any) {
    errorMsg.value = "Couldn't add you - try again in a moment."
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.marketplace-root {
  --color-teal: #00a19a;
  --color-blue: #2f9bdf;
  --color-purple: #5a4cf0;
  --color-ink: #080f2d;
  --color-muted: #586987;
  --color-border: #dde8f3;
  min-height: 100dvh;
  color: var(--color-ink);
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
  position: relative;
}

.mesh {
  pointer-events: none;
  position: fixed;
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

.marketplace-web-shell {
  width: min(1260px, calc(100% - 64px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.marketplace-web-nav {
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
  gap: 9px;
  color: #231d45;
  cursor: pointer;
  flex-shrink: 0;
}

.brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
}

.brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
}

.brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.web-links {
  display: flex;
  gap: 4px;
}

.web-links button {
  border: 0;
  background: transparent;
  color: #5a5570;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 13px;
  border-radius: 10px;
  white-space: nowrap;
  transition: background 0.18s, color 0.18s;
}

.web-links button:hover {
  color: #231d45;
  background: rgba(35, 29, 69, 0.05);
}

.web-links button.active {
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
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
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
}

.web-btn.solid:hover {
  background: #00857f;
}

.web-btn.ghost,
.web-btn.secondary {
  color: #231d45;
  background: rgba(255, 255, 255, 0.9);
  border-color: #e7e2d6;
}

.web-btn.primary {
  color: #fff;
  background: linear-gradient(135deg, #00a19a 0%, #00b6ad 100%);
  box-shadow: 0 14px 26px rgba(0, 161, 154, 0.22);
}

.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.play-dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-grid;
  place-items: center;
  background: #071137;
  color: #fff;
  font-size: 7px;
  font-weight: 900;
  line-height: 1;
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

.marketplace-main {
  padding: 76px 0 54px;
}

.section-kicker {
  margin: 0 0 12px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.marketplace-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(520px, 1.08fr);
  align-items: center;
  gap: 46px;
  min-height: 500px;
}

.hero-content {
  max-width: 560px;
}

.hero-content h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(42px, 4.8vw, 58px);
  font-weight: 900;
  line-height: 1.08;
}

.hero-description {
  margin: 28px 0 0;
  max-width: 590px;
  color: #5b6d89;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.65;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 40px;
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 42px;
  color: #5b6d89;
}

.rating-block {
  display: grid;
  grid-template-columns: auto auto;
  gap: 4px 12px;
  align-items: center;
}

.stars {
  color: #ffb703;
  font-size: 18px;
  letter-spacing: 2px;
}

.rating-block strong,
.verified-block strong {
  color: #091537;
  font-size: 14px;
  font-weight: 900;
}

.rating-block span {
  grid-column: 1 / -1;
  font-size: 14px;
}

.trust-divider {
  width: 1px;
  align-self: stretch;
  min-height: 54px;
  background: #d9e3ee;
}

.verified-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.verified-block span:not(.mini-icon) {
  display: block;
  margin-top: 3px;
  color: #5b6d89;
  font-size: 14px;
}

.mini-icon,
.round-icon {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  font-weight: 900;
}

.mini-icon {
  width: 48px;
  height: 48px;
}

.round-icon {
  width: 54px;
  height: 54px;
  font-size: 15px;
  letter-spacing: 0.02em;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.8),
    0 8px 18px rgba(24, 52, 88, 0.1);
}

.round-icon.large {
  width: 66px;
  height: 66px;
  margin-bottom: 22px;
  font-size: 17px;
  border-radius: 20px;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.service-card:hover .round-icon.large {
  transform: scale(1.06) rotate(-3deg);
}

.mini-icon.teal,
.round-icon.teal {
  color: #00857f;
  background: linear-gradient(150deg, #e4faf3, #c3f0e3);
}

.round-icon.purple {
  color: #5a4cf0;
  background: linear-gradient(150deg, #f3effe, #e1d9fd);
}

.round-icon.amber {
  color: #e59100;
  background: linear-gradient(150deg, #fff6e0, #ffe9bd);
}

.round-icon.blue {
  color: #0899bf;
  background: linear-gradient(150deg, #e6faff, #cdf2fc);
}

.hero-visual {
  min-height: 500px;
  position: relative;
}

.house-stage {
  position: absolute;
  inset: 70px 20px 0 20px;
}

.hero-house {
  position: absolute;
  right: 58px;
  bottom: 4px;
  width: min(470px, 78%);
  height: 330px;
  border-radius: 24px 24px 4px 4px;
  object-fit: cover;
  object-position: center;
  filter: saturate(1.03) contrast(1.02);
  box-shadow: 0 30px 54px rgba(31, 61, 98, 0.16);
  clip-path: polygon(4% 20%, 46% 0, 96% 17%, 96% 100%, 4% 100%);
}

.house-stage::after {
  content: '';
  position: absolute;
  right: 30px;
  bottom: -10px;
  width: 520px;
  height: 42px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(34, 67, 102, 0.19), transparent 68%);
  z-index: -1;
}

.passport-card {
  position: absolute;
  left: 28px;
  top: 0;
  width: 245px;
  transform: rotate(-7deg);
  border: 1px solid rgba(209, 222, 236, 0.85);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 28px 46px rgba(23, 52, 92, 0.15);
  padding: 28px 28px 26px;
  z-index: 4;
}

.passport-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.passport-logo img {
  width: 30px;
  height: 30px;
}

.passport-card p {
  margin: 0 0 22px;
  color: #071137;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
}

.passport-card h2 {
  margin: 0 0 2px;
  color: #231d45;
  font-size: 20px;
  font-weight: 900;
}

.passport-card > span {
  display: block;
  color: #61728e;
  font-size: 12px;
  margin-bottom: 18px;
}

.passport-card dl {
  display: grid;
  gap: 13px;
  margin: 0 0 20px;
}

.passport-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.passport-card dt {
  color: #182746;
  font-size: 11px;
  font-weight: 800;
}

.passport-card dd {
  margin: 0;
  color: #00857f;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.passport-card strong {
  display: block;
  margin-bottom: 10px;
  color: #071137;
  font-size: 13px;
  font-weight: 900;
}

.passport-progress {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #e8eef5;
}

.passport-progress span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #00a19a, #00b6ad);
}

.orbit-line {
  position: absolute;
  top: 58px;
  right: 0;
  width: 430px;
  height: 380px;
  border: 2px dashed rgba(88, 134, 189, 0.28);
  border-left-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
}

.service-bubble {
  position: absolute;
  z-index: 5;
  width: 70px;
  height: 70px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 18px 36px rgba(24, 52, 88, 0.09);
}

.bubble-conveyancing {
  right: 225px;
  top: 16px;
  color: #00857f;
  background: #cef3e5;
}

.bubble-survey {
  right: 72px;
  top: 76px;
  color: #5a4cf0;
  background: #eeeafe;
}

.bubble-energy {
  right: 0;
  top: 220px;
  color: #e59100;
  background: #fff3d7;
}

.bubble-removal {
  right: 28px;
  top: 350px;
  color: #0899bf;
  background: #dcf7ff;
}

.value-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 46px;
  padding: 18px;
  border: 1px solid rgba(219, 230, 241, 0.9);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(247, 251, 255, 0.86));
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 20px 44px rgba(31, 61, 98, 0.1);
}

.value-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border-radius: 16px;
  transition: background 0.25s ease, transform 0.25s ease;
}

.value-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.value-item h3,
.value-item p {
  margin: 0;
}

.value-item h3 {
  color: #231d45;
  font-size: 15px;
  font-weight: 900;
}

.value-item p {
  margin-top: 5px;
  color: #647590;
  font-size: 13px;
}

.marketplace-services {
  padding-top: 58px;
}

.services-header {
  max-width: 720px;
  margin-bottom: 30px;
}

.services-header h2,
.proof-copy h2,
.marketplace-how-it-works h2,
.marketplace-cta h2 {
  margin: 0;
  color: #231d45;
  font-weight: 900;
  line-height: 1.16;
}

.services-header h2,
.proof-copy h2,
.marketplace-how-it-works h2 {
  font-size: clamp(28px, 3vw, 36px);
}

.services-header > p:not(.section-kicker) {
  margin: 12px 0 0;
  color: #5b6d89;
  font-size: 15px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.service-card {
  position: relative;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  padding: 30px 26px 26px;
  border: 1px solid rgba(221, 232, 243, 0.9);
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.92));
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 14px 32px rgba(24, 52, 88, 0.07);
  overflow: hidden;
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease, border-color 0.32s ease;
}

.service-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 3px;
  background: linear-gradient(90deg, var(--color-teal), var(--color-blue) 50%, var(--color-purple));
  opacity: 0;
  transition: opacity 0.32s ease;
}

.service-card::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -30%;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.12), transparent 70%);
  opacity: 0;
  transition: opacity 0.32s ease;
}

.service-card:hover {
  transform: translateY(-6px);
  border-color: rgba(47, 155, 223, 0.35);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 28px 50px rgba(24, 52, 88, 0.16);
}

.service-card:hover::before,
.service-card:hover::after {
  opacity: 1;
}

.service-card h3 {
  margin: 0 0 12px;
  color: #231d45;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.01em;
}

.service-card > p {
  margin: 0 0 18px;
  color: #5d6e89;
  font-size: 14px;
  line-height: 1.55;
}

.service-features {
  display: grid;
  gap: 12px;
  margin: 0 0 24px;
  padding: 0;
  list-style-position: inside;
  color: #142341;
  font-size: 13px;
  line-height: 1.35;
}

.service-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding: 12px 16px;
  border: 1px solid rgba(0, 161, 154, 0.18);
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.06);
  color: #007f91;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.service-btn:hover {
  background: rgba(0, 161, 154, 0.12);
  border-color: rgba(0, 161, 154, 0.4);
}

.service-btn span:last-child {
  transition: transform 0.25s ease;
}

.service-card:hover .service-btn span:last-child {
  transform: translateX(4px);
}

.proof-section {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1fr);
  align-items: center;
  gap: 74px;
  padding-top: 52px;
}

.testimonial-visual {
  position: relative;
  min-height: 330px;
}

.testimonial-visual img {
  width: 100%;
  height: 330px;
  border-radius: 22px;
  object-fit: cover;
  box-shadow: 0 24px 48px rgba(24, 52, 88, 0.14);
}

.quote-card {
  position: absolute;
  left: 26px;
  bottom: 34px;
  width: 235px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 24px 50px rgba(17, 43, 78, 0.22);
}

.quote-card p {
  margin: 12px 0 20px;
  color: #152341;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
}

.quote-person {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quote-person > span {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f1c0a9, #80533f);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
}

.quote-person strong,
.quote-person small {
  display: block;
}

.quote-person strong {
  color: #231d45;
  font-size: 13px;
  font-weight: 900;
}

.quote-person small {
  color: #6a7a91;
  font-size: 12px;
}

.proof-copy {
  max-width: 560px;
}

.proof-list {
  display: grid;
  gap: 20px;
  margin-top: 28px;
}

.proof-list article {
  display: flex;
  gap: 14px;
}

.proof-list span {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #d9f6ee;
  color: #00857f;
  font-size: 9px;
  font-weight: 900;
}

.proof-list h3,
.proof-list p {
  margin: 0;
}

.proof-list h3 {
  color: #231d45;
  font-size: 15px;
  font-weight: 900;
}

.proof-list p {
  margin-top: 4px;
  color: #5b6d89;
  font-size: 14px;
  line-height: 1.45;
}

.marketplace-how-it-works {
  padding-top: 58px;
}

.steps-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 84px;
  margin-top: 42px;
  position: relative;
}

.steps-row::before {
  content: '';
  position: absolute;
  left: 22%;
  right: 22%;
  top: 27px;
  border-top: 2px dashed #d4deea;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 22px;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.step-number {
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border: 1px solid currentColor;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff, #f4f8fd);
  box-shadow:
    inset 0 0 0 6px rgba(255, 255, 255, 0.9),
    0 12px 26px rgba(24, 52, 88, 0.1);
  font-size: 28px;
  font-weight: 900;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.step-item:hover .step-number {
  transform: translateY(-3px) scale(1.04);
}

.step-item.teal {
  color: #00a19a;
}

.step-item.purple {
  color: #5a4cf0;
}

.step-item.amber {
  color: #e59100;
}

.step-item h3,
.step-item p {
  margin: 0;
}

.step-item h3 {
  color: #231d45;
  font-size: 15px;
  font-weight: 900;
}

.step-item p {
  margin-top: 6px;
  color: #5b6d89;
  font-size: 14px;
  line-height: 1.45;
}

.marketplace-cta {
  display: grid;
  grid-template-columns: auto minmax(240px, 1fr) minmax(380px, 0.9fr);
  align-items: center;
  gap: 34px;
  margin-top: 58px;
  margin-bottom: 26px;
  padding: 42px 46px;
  border-radius: 16px;
  background: #231d45;
  box-shadow: 0 24px 44px rgba(35, 29, 69, 0.22);
  color: #fff;
}

.mail-icon {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.mail-icon span {
  font-size: 40px;
}

.marketplace-cta h2 {
  color: #fff;
  font-size: clamp(26px, 2.6vw, 34px);
}

.cta-copy p {
  margin: 10px 0 0;
  max-width: 520px;
  color: rgba(255, 255, 255, 0.94);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.cta-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
}

.cta-form input {
  min-width: 0;
  min-height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  color: #231d45;
  font-family: inherit;
  font-size: 15px;
  padding: 0 20px;
}

.cta-form input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.24);
}

.cta-form button {
  min-height: 54px;
  border: 0;
  border-radius: 10px;
  background: #fff;
  color: #071137;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  padding: 0 28px;
  white-space: nowrap;
}

.cta-form button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.cta-notice,
.cta-error {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.cta-notice {
  color: rgba(255, 255, 255, 0.9);
}

.cta-error {
  color: #ffe5e5;
}

.marketplace-footer {
  position: relative;
  z-index: 2;
  background: #231d45;
  color: #cbd9ea;
  padding: 56px 32px 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 44px;
  width: min(1260px, 100%);
  margin: 0 auto 32px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.footer-brand img {
  width: 30px;
  height: 30px;
}

.footer-brand strong {
  color: #fff;
  font-size: 20px;
}

.footer-chip {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 7px 12px;
  border-radius: 999px;
  background: rgba(0, 161, 154, 0.15);
  color: #5eeee6;
  font-size: 12px;
  font-weight: 800;
}

.footer-intro p {
  max-width: 410px;
  margin: 0 0 18px;
  color: #b8c8dc;
  font-size: 14px;
  line-height: 1.6;
}

.footer-cta {
  border: 0;
  border-radius: 10px;
  background: #00a19a;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  padding: 13px 18px;
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
  width: min(1260px, 100%);
  margin: 0 auto;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #91a3bb;
  font-size: 12px;
  text-align: center;
}

.marketplace-mobile-nav {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 1180px) {
  .marketplace-hero {
    grid-template-columns: 1fr;
    gap: 26px;
  }

  .hero-content {
    max-width: 760px;
  }

  .hero-visual {
    min-height: 470px;
  }

  .services-grid,
  .value-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .proof-section,
  .marketplace-cta {
    grid-template-columns: 1fr;
  }

  .cta-form {
    max-width: 680px;
  }
}

@media (max-width: 900px) {
  .marketplace-web-shell {
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
    background: #00a19a;
  }

  .marketplace-main {
    padding-top: 44px;
    padding-bottom: 100px;
  }

  .marketplace-mobile-nav {
    display: block;
  }

  .hero-content h1 {
    font-size: clamp(36px, 8vw, 48px);
  }

  .hero-description {
    font-size: 16px;
  }

  .steps-row {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .steps-row::before {
    display: none;
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-intro {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .marketplace-web-shell {
    width: calc(100% - 24px);
  }

  .nav-inner {
    min-height: 62px;
  }

  .brand {
    font-size: 17px;
  }

  .brand-logo {
    height: 28px;
    width: auto;
  }

  .marketplace-main {
    padding-top: 30px;
  }

  .hero-content h1 {
    font-size: 34px;
  }

  .hero-cta-group,
  .hero-trust {
    align-items: stretch;
    flex-direction: column;
  }

  .web-btn.primary,
  .web-btn.secondary {
    width: 100%;
    justify-content: center;
  }

  .trust-divider {
    display: none;
  }

  .hero-visual {
    min-height: 390px;
  }

  .house-stage {
    inset: 76px 0 0;
  }

  .hero-house {
    right: 0;
    width: 88%;
    height: 250px;
  }

  .passport-card {
    left: 0;
    width: 200px;
    padding: 20px;
  }

  .passport-card p {
    font-size: 10px;
  }

  .passport-card h2 {
    font-size: 17px;
  }

  .passport-card dl {
    gap: 9px;
  }

  .orbit-line {
    display: none;
  }

  .service-bubble {
    width: 54px;
    height: 54px;
    font-size: 24px;
  }

  .bubble-conveyancing {
    right: 34%;
    top: 12px;
  }

  .bubble-survey {
    right: 2%;
    top: 54px;
  }

  .bubble-energy,
  .bubble-removal {
    display: none;
  }

  .value-strip,
  .services-grid {
    grid-template-columns: 1fr;
  }

  .value-strip {
    margin-top: 28px;
    padding: 20px;
  }

  .marketplace-services,
  .proof-section,
  .marketplace-how-it-works {
    padding-top: 42px;
  }

  .proof-section {
    gap: 34px;
  }

  .testimonial-visual,
  .testimonial-visual img {
    min-height: 280px;
    height: 280px;
  }

  .quote-card {
    left: 16px;
    right: 16px;
    bottom: 18px;
    width: auto;
  }

  .step-item {
    align-items: flex-start;
  }

  .marketplace-cta {
    gap: 22px;
    margin-top: 42px;
    padding: 28px 20px;
  }

  .mail-icon {
    width: 68px;
    height: 68px;
  }

  .cta-form {
    grid-template-columns: 1fr;
  }

  .cta-form button {
    width: 100%;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer-intro {
    grid-column: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .web-btn,
  .service-card,
  .web-mobile-panel,
  .web-mobile-backdrop {
    transition: none;
  }
}
</style>
