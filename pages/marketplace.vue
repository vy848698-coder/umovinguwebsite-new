<template>
  <div class="mp-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <header class="mp-web-nav">
      <div class="mp-shell mp-nav-inner">
        <button class="mp-brand" type="button" @click="navigateTo('/')">
          <span class="mp-brand-dot" />
          <span>umovingu</span>
        </button>

        <nav class="mp-links" aria-label="Marketplace navigation">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Passport</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>

        <div class="mp-actions">
          <button class="mp-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
          <button class="mp-btn solid" type="button" @click="navigateTo('/claim')">Claim Passport</button>
        </div>

        <button
          class="mp-mobile-toggle"
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

      <div class="mp-shell">
        <div class="mp-mobile-backdrop" :class="{ open: mobileNavOpen }" @click="mobileNavOpen = false" />
        <div class="mp-mobile-panel" :class="{ open: mobileNavOpen }">
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

    <main class="mp-shell mp-main">
      <section class="mp-hero">
        <div class="mp-hero-copy">
          <p class="mp-eyebrow">Marketplace</p>
          <h1>Trusted property services, redesigned for the web</h1>
          <p class="mp-sub">
            We are building a curated panel of conveyancers, surveyors, insurers and installers
            who can work directly with your Property Passport data.
          </p>

          <div class="mp-kpis" aria-label="Marketplace highlights">
            <article>
              <strong>Fixed-fee</strong>
              <span>Transparent pricing upfront</span>
            </article>
            <article>
              <strong>Faster setup</strong>
              <span>Passport-ready data handover</span>
            </article>
            <article>
              <strong>Real reviews</strong>
              <span>Independent UMU user feedback</span>
            </article>
          </div>

          <div class="mp-notify">
            <div class="mp-notify-eyebrow">Get early access</div>
            <p class="mp-notify-body">
              Join the waitlist and we will notify you when Marketplace opens, including a £25 credit for first bookings.
            </p>
            <form class="mp-notify-form" @submit.prevent="submitNotify">
              <input
                v-model="email"
                type="email"
                class="mp-notify-input"
                placeholder="you@example.com"
                :disabled="submitting || submitted"
                required
              />
              <button class="mp-notify-btn" type="submit" :disabled="submitting || submitted">
                <span v-if="submitting" class="mp-spinner" />
                {{ submitted ? 'You\'re on the list ✓' : 'Notify me' }}
              </button>
            </form>
            <div v-if="errorMsg" class="mp-notify-err">{{ errorMsg }}</div>
          </div>
        </div>

        <aside class="mp-hero-panels" aria-label="Marketplace service preview">
          <article class="mp-panel">
            <div class="mp-panel-head">
              <div>
                <p class="mp-panel-eyebrow">Launching soon</p>
                <h2>Service categories</h2>
              </div>
              <span class="mp-panel-pill">Preview</span>
            </div>
            <div class="mp-chip-row">
              <span class="mp-chip">Conveyancing</span>
              <span class="mp-chip">Surveying</span>
              <span class="mp-chip">Inspections</span>
              <span class="mp-chip">Energy</span>
              <span class="mp-chip">Removal</span>
            </div>
            <div class="mp-preview-grid">
              <div class="mp-preview-card">
                <div class="mp-preview-ic">⚖️</div>
                <div class="mp-preview-card-title">Conveyancing</div>
                <div class="mp-preview-card-sub">Fixed-fee quotes matched to Passport data.</div>
              </div>
              <div class="mp-preview-card">
                <div class="mp-preview-ic">🏗️</div>
                <div class="mp-preview-card-title">Surveyors</div>
                <div class="mp-preview-card-sub">Verified property context before first call.</div>
              </div>
              <div class="mp-preview-card">
                <div class="mp-preview-ic">🌡️</div>
                <div class="mp-preview-card-title">Energy upgrades</div>
                <div class="mp-preview-card-sub">EPC and property clues available before quoting.</div>
              </div>
            </div>
          </article>

          <article class="mp-panel mp-panel-soft">
            <h3>Why this feels different</h3>
            <div class="mp-feat-row">
              <span class="mp-feat-check">✓</span>
              <div>
                <div class="mp-feat-title">Pre-quoted, no haggling</div>
                <div class="mp-feat-sub">See total cost before you instruct.</div>
              </div>
            </div>
            <div class="mp-feat-row">
              <span class="mp-feat-check">✓</span>
              <div>
                <div class="mp-feat-title">Faster onboarding</div>
                <div class="mp-feat-sub">Passport data maps into service workflows.</div>
              </div>
            </div>
            <div class="mp-feat-row">
              <span class="mp-feat-check">✓</span>
              <div>
                <div class="mp-feat-title">Verified trust signals</div>
                <div class="mp-feat-sub">Independent feedback from UMU journeys.</div>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section class="mp-value-grid" aria-label="Marketplace value cards">
        <article>
          <h3>Price certainty</h3>
          <p>Clear fixed-fee bands for common transaction paths.</p>
        </article>
        <article>
          <h3>Lower friction</h3>
          <p>Property details flow through once, reducing repeat admin.</p>
        </article>
        <article>
          <h3>Quality partners</h3>
          <p>Vetted panel designed for Passport-enabled transactions.</p>
        </article>
      </section>
    </main>

    <div class="mp-mobile-nav">
      <BottomNav active="marketplace" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BottomNav from '~/components/core/BottomNav.vue'

const route = useRoute()
const config = useRuntimeConfig()
const mobileNavOpen = ref(false)

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

const email = ref('')
const submitting = ref(false)
const submitted = ref(false)
const errorMsg = ref('')

async function submitNotify() {
  errorMsg.value = ''
  if (!email.value.trim()) return
  submitting.value = true
  try {
    // Re-use the existing /support/request endpoint — message goes to the
    // support inbox with a tag so the team can pull a marketplace-interest list.
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
    errorMsg.value = "Couldn't add you — try again in a moment."
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:root {
  --mp-aqua: #00a19a;
  --mp-blue: #2f9bdf;
  --mp-ink: #1f2b3f;
  --mp-card-border: #d8e3ee;
}

.mp-page {
  min-height: 100dvh;
  color: var(--mp-ink);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 8% 11%, rgba(13, 191, 181, 0.14) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.13) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f8fbff 0%, #f0f5ff 48%, #effaf8 100%);
  position: relative;
}

.mesh {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.025;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72), transparent 92%);
}

.ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(44px);
  pointer-events: none;
  opacity: 0.24;
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
}

.mp-shell {
  width: min(1260px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.mp-web-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
  backdrop-filter: blur(12px);
}

.mp-nav-inner {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.mp-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #1e2b41;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.mp-brand-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--mp-aqua) 0%, var(--mp-blue) 55%, #4f4ff2 100%);
  box-shadow: 0 0 0 5px rgba(0, 161, 154, 0.16);
}

.mp-links {
  display: flex;
  gap: 8px;
}

.mp-links button {
  border: 0;
  background: transparent;
  color: #52627e;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.mp-links button:hover {
  background: rgba(20, 53, 98, 0.06);
  color: #1e2b41;
}

.mp-links button.active {
  background: linear-gradient(120deg, rgba(0, 161, 154, 0.14) 0%, rgba(47, 155, 223, 0.14) 100%);
  color: #153457;
  box-shadow: inset 0 0 0 1px rgba(44, 125, 203, 0.18);
}

.mp-actions {
  display: inline-flex;
  gap: 8px;
}

.mp-btn {
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}

.mp-btn.solid {
  color: #fff;
  background: linear-gradient(120deg, var(--mp-aqua) 0%, var(--mp-blue) 48%, #4f4ff2 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.mp-btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}

.mp-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.mp-mobile-toggle span {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #2b3c56;
}

.mp-mobile-panel {
  display: none;
}

.mp-mobile-backdrop {
  display: none;
}

.mp-main {
  padding: 22px 0 36px;
}

.mp-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 18px;
  align-items: start;
}

.mp-hero-copy {
  border: 1px solid var(--mp-card-border);
  border-radius: 24px;
  padding: 24px;
  background: linear-gradient(152deg, rgba(255, 255, 255, 0.96), rgba(239, 247, 255, 0.92));
  box-shadow: 0 14px 26px rgba(36, 66, 102, 0.08);
}

.mp-eyebrow {
  margin: 0;
  color: #0f756f;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-size: 11px;
  font-weight: 800;
}

.mp-hero-copy h1 {
  margin: 8px 0 12px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.04;
  letter-spacing: -1px;
  color: #152942;
}

.mp-sub {
  margin: 0;
  max-width: 62ch;
  font-size: 15px;
  line-height: 1.6;
  color: #617690;
}

.mp-kpis {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.mp-kpis article {
  border: 1px solid #dbe7f3;
  border-radius: 14px;
  padding: 11px;
  background: rgba(255, 255, 255, 0.9);
}

.mp-kpis strong {
  display: block;
  font-size: 16px;
  color: #17385d;
}

.mp-kpis span {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: #5f7594;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  font-weight: 700;
}

.mp-notify {
  margin-top: 18px;
  background: linear-gradient(135deg, #f2faf8 0%, #fff 70%);
  border: 1px solid #e5f4f2;
  border-radius: 18px;
  padding: 18px;
}

.mp-notify-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #007e78;
  margin-bottom: 6px;
}

.mp-notify-body {
  font-size: 13px;
  color: #4a4566;
  line-height: 1.5;
  margin: 0 0 14px;
}

.mp-notify-form {
  display: flex;
  gap: 8px;
}

.mp-notify-input {
  flex: 1;
  padding: 12px 14px;
  border: 1.5px solid #d8e3ee;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
}

.mp-notify-input:focus {
  outline: none;
  border-color: var(--mp-aqua);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.12);
}

.mp-notify-btn {
  background: linear-gradient(135deg, #00a19a 0%, #00b6ae 60%, #0f8f88 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.mp-notify-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mp-notify-err {
  font-size: 12px;
  color: #c73e36;
  margin-top: 8px;
}

.mp-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: mp-spin 0.6s linear infinite;
}

@keyframes mp-spin {
  to {
    transform: rotate(360deg);
  }
}

.mp-hero-panels {
  display: grid;
  gap: 14px;
}

.mp-panel {
  border: 1px solid rgba(174, 201, 231, 0.44);
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 24px rgba(17, 52, 88, 0.08);
}

.mp-panel-soft {
  background: linear-gradient(150deg, rgba(243, 251, 255, 0.95), rgba(238, 253, 248, 0.95));
}

.mp-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.mp-panel-eyebrow {
  margin: 0 0 4px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9c98ad;
}

.mp-panel h2,
.mp-panel h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.25;
  color: #1f2f4a;
}

.mp-panel-pill {
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  color: #007e78;
  font-size: 11px;
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
}

.mp-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.mp-chip {
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border-radius: 999px;
  background: #f6f8fc;
  border: 1px solid rgba(174, 201, 231, 0.5);
  color: #4a4566;
  font-size: 12px;
  font-weight: 700;
}

.mp-preview-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.mp-preview-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(170deg, #fbfdff 0%, #f6f9ff 100%);
  border: 1px solid rgba(174, 201, 231, 0.36);
}

.mp-preview-ic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  font-size: 17px;
}

.mp-preview-card-title {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
}

.mp-preview-card-sub {
  font-size: 12px;
  line-height: 1.45;
  color: #6b6783;
}

.mp-feat-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 12px;
}

.mp-feat-check {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e6f4f1;
  color: #007e78;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}

.mp-feat-title {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
  margin-bottom: 2px;
}

.mp-feat-sub {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.45;
}

.mp-value-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.mp-value-grid article {
  border: 1px solid var(--mp-card-border);
  border-radius: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 20px rgba(17, 52, 88, 0.06);
}

.mp-value-grid h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2f4a;
}

.mp-value-grid p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #617690;
}

.mp-mobile-nav {
  display: none;
}

@media (max-width: 980px) {
  .mp-shell {
    width: calc(100% - 18px);
  }

  .mesh {
    display: none;
  }

  .ambient {
    opacity: 0.15;
  }

  .mp-links,
  .mp-actions {
    display: none;
  }

  .mp-mobile-toggle {
    display: inline-flex;
  }

  .mp-mobile-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    padding: 0;
    border-radius: 14px;
    border: 0;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: none;
    transform-origin: top;
    transform: scaleY(0.92);
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease;
    position: relative;
    z-index: 2;
  }

  .mp-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(16, 27, 43, 0.26);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1;
  }

  .mp-mobile-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }

  .mp-mobile-panel.open {
    transform: scaleY(1);
    opacity: 1;
    pointer-events: auto;
    max-height: 420px;
    margin: 8px 0 12px;
    padding: 10px;
    border: 1px solid #dbe7f3;
    box-shadow: 0 14px 24px rgba(21, 58, 95, 0.1);
  }

  .mp-mobile-panel button {
    border: 1px solid #dde8f3;
    background: #fff;
    color: #22405f;
    border-radius: 10px;
    padding: 10px 12px;
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .mp-mobile-panel button.active {
    border-color: rgba(44, 125, 203, 0.34);
    background: linear-gradient(120deg, rgba(0, 161, 154, 0.1) 0%, rgba(47, 155, 223, 0.1) 100%);
    color: #17365a;
  }

  .mp-mobile-panel button.claim {
    border: 0;
    color: #fff;
    background: linear-gradient(120deg, var(--mp-aqua) 0%, var(--mp-blue) 48%, #4f4ff2 100%);
  }

  .mp-main {
    padding-top: 14px;
    padding-bottom: 94px;
  }

  .mp-hero {
    grid-template-columns: 1fr;
  }

  .mp-value-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .mp-mobile-nav {
    display: block;
  }
}

@media (max-width: 640px) {
  .mp-nav-inner {
    min-height: 58px;
  }

  .mp-brand {
    font-size: 15px;
    gap: 8px;
  }

  .mp-brand-dot {
    width: 14px;
    height: 14px;
    box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
  }

  .mp-hero-copy {
    border-radius: 18px;
    padding: 16px;
  }

  .mp-hero-copy h1 {
    font-size: 30px;
  }

  .mp-sub {
    font-size: 14px;
  }

  .mp-kpis {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .mp-notify-form {
    flex-direction: column;
  }

  .mp-notify-btn {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }

  .mp-panel {
    border-radius: 16px;
    padding: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mp-notify-btn,
  .mp-spinner {
    transition: none !important;
    animation: none !important;
  }
}
</style>
