<template>
  <div class="cl-root">

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
          <button class="hsw-back" type="button" @click="onBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell clw-main">
      <!-- Page head -->
      <div class="clw-head">
        <p class="clw-kicker"><span class="clw-kicker-dot" />Claim your Passport</p>
        <h1>Claim your Property Passport</h1>
        <p class="clw-lede">
          Find your property and we'll verify ownership via HM Land Registry —
          then your Property Passport is yours to build and share.
        </p>
        <div class="clw-progress">
          <span class="clw-step-pill">Step 1 of 2</span>
          <div class="clw-prog-strip"><span style="width: 50%" /></div>
        </div>
      </div>

      <div class="clw-layout">
        <!-- Search card -->
        <section class="clw-card">
          <div class="cl-icon-square">🏠</div>
          <h2 class="cl-h2">Which property are you claiming?</h2>
          <p class="cl-body">
            Enter your postcode and select your address. We'll verify ownership
            via HM Land Registry.
          </p>

          <div class="cl-field-wrap">
            <div class="cl-field-label">Postcode or address</div>
            <PropertySearchInput
              placeholder="e.g. SK7 4BL"
              variant="light"
              @select="onPropertySelect"
            />
          </div>

          <div class="cl-lock-note">
            <div class="cl-lock-ic">🔒</div>
            <div class="cl-lock-body">
              We verify ownership via
              <strong>HM Land Registry</strong> — encrypted and never sold.
            </div>
          </div>

          <div v-if="resolving" class="cl-resolving">
            <div class="cl-resolving-spinner" />
            <div>Taking you to your property…</div>
          </div>
        </section>

        <!-- What happens next -->
        <aside class="clw-aside">
          <div class="clw-aside-card">
            <h3 class="clw-aside-title">What happens next</h3>
            <ol class="clw-steps">
              <li>
                <span class="clw-step-num">1</span>
                <div>
                  <div class="clw-step-h">Find your property</div>
                  <p>Search your postcode and pick your exact address.</p>
                </div>
              </li>
              <li>
                <span class="clw-step-num">2</span>
                <div>
                  <div class="clw-step-h">Verify ownership</div>
                  <p>We confirm you're the owner via HM Land Registry — securely.</p>
                </div>
              </li>
            </ol>
            <div class="clw-trust">
              <span class="clw-trust-item">🔒 Encrypted</span>
              <span class="clw-trust-item">🏛️ HM Land Registry</span>
              <span class="clw-trust-item">🚫 Never sold</span>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <SiteFooter />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({
  middleware: 'auth',
  title: 'Claim your Property Passport',
})

const router = useRouter()
const resolving = ref(false)

function onPropertySelect(property: any) {
  if (!property?.id) return
  resolving.value = true
  router.push(`/claim/${property.id}`)
}

const onBack = useGoBack('/explore')
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.cl-root {
  --brand: #00a19a;
  --brand-pale: #f0fdfa;
  --brand-soft: #99f6e4;
  --brand-dark: #007d78;
  --navy: #231d45;
  --ink: #1a1a2e;
  --ink-soft: #4a4a6a;
  --ink-faint: #9090a8;
  --line: #dbe7f5;
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: var(--navy);
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* `clip` keeps the sticky nav working. */
  overflow: clip;
  position: relative;
}

.cl-ambient,
.cl-mesh {
  pointer-events: none;
  position: fixed;
}

.cl-ambient {
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.16;
}

.cl-ambient-a {
  width: 300px;
  height: 300px;
  left: -100px;
  top: 120px;
  background: #00a19a;
}

.cl-ambient-b {
  width: 320px;
  height: 320px;
  right: -120px;
  top: 160px;
  background: #5a4cf0;
}

.cl-mesh {
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
}

/* ── Web nav (shared HomeScore pattern) ───────────────────────────── */
.hsw-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hsw-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.hsw-nav-inner {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hsw-brand {
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
  font-family: inherit;
}

.hsw-brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.hsw-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}

.hsw-links {
  display: flex;
  gap: 6px;
}

.hsw-links button {
  border: 0;
  background: transparent;
  color: #475a7b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 14px;
  border-radius: 10px;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.18s, color 0.18s;
}

.hsw-links button:hover {
  color: #0c2342;
  background: rgba(0, 161, 154, 0.08);
}

.hsw-links button.active {
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.hsw-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.hsw-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d8e3ee;
  background: #fff;
  color: #0c2342;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.hsw-back:hover {
  border-color: #bfd1e4;
  background: #f8fbff;
}

.hsw-back svg {
  width: 15px;
  height: 15px;
}

/* ── Page head ────────────────────────────────────────────────────── */
.clw-main {
  padding: 48px 0 60px;
}

.clw-head {
  max-width: 720px;
}

.clw-kicker {
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

.clw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}

.clw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.clw-lede {
  margin: 18px 0 0;
  max-width: 560px;
  color: #5b6d89;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
}

.clw-progress {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  max-width: 420px;
}

.clw-step-pill {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 800;
  color: #007e78;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.22);
  padding: 6px 12px;
  border-radius: 999px;
}

.clw-prog-strip {
  flex: 1;
  height: 5px;
  background: rgba(219, 231, 245, 0.88);
  border-radius: 100px;
  overflow: hidden;
}

.clw-prog-strip span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00a19a, #4dd4ce);
  transition: width 0.3s ease;
}

/* ── Two-column layout ────────────────────────────────────────────── */
.clw-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 36px;
  margin-top: 40px;
  align-items: start;
}

/* ── Search card ──────────────────────────────────────────────────── */
.clw-card {
  padding: 32px 30px 34px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 252, 255, 0.94) 52%, rgba(239, 255, 251, 0.95) 100%);
  border: 1px solid rgba(174, 201, 231, 0.48);
  border-radius: 22px;
  box-shadow:
    0 18px 44px rgba(17, 52, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}

.cl-icon-square {
  width: 70px;
  height: 70px;
  background: var(--brand-pale);
  border: 2px solid var(--brand-soft);
  border-radius: 22px;
  display: grid;
  place-items: center;
  margin: 0 0 20px;
  font-size: 32px;
}

.cl-h2 {
  font-size: 26px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  line-height: 1.2;
}

.cl-body {
  font-size: 15px;
  color: var(--ink-soft);
  line-height: 1.6;
  margin: 0 0 22px;
}

.cl-field-wrap {
  margin-bottom: 16px;
}

.cl-field-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--ink-soft);
  margin-bottom: 7px;
  letter-spacing: 0.04em;
}

.cl-lock-note {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 14px;
  background: #f2faf8;
  border: 1px solid #cceeea;
  border-radius: 14px;
}

.cl-lock-ic {
  font-size: 18px;
  flex-shrink: 0;
}

.cl-lock-body {
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.5;
}

.cl-lock-body strong {
  color: var(--ink);
}

.cl-resolving {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-soft);
  font-size: 13px;
  font-weight: 600;
}

.cl-resolving-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--line);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: cl-spin 0.7s linear infinite;
}

@keyframes cl-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── What happens next ────────────────────────────────────────────── */
.clw-aside {
  position: sticky;
  top: 90px;
}

.clw-aside-card {
  padding: 28px 26px;
  border: 1px solid rgba(231, 236, 242, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 34px rgba(17, 52, 88, 0.06);
}

.clw-aside-title {
  margin: 0 0 18px;
  font-size: 17px;
  font-weight: 900;
  color: #231d45;
  letter-spacing: -0.01em;
}

.clw-steps {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: grid;
  gap: 18px;
}

.clw-steps li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.clw-step-num {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(150deg, #e4faf3, #c3f0e3);
  color: #00857f;
  font-size: 14px;
  font-weight: 900;
}

.clw-step-h {
  font-size: 14.5px;
  font-weight: 800;
  color: #1a1535;
  margin-bottom: 3px;
}

.clw-steps p {
  margin: 0;
  font-size: 13px;
  color: #6b6783;
  line-height: 1.5;
}

.clw-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 18px;
  border-top: 1px solid #eef2f6;
}

.clw-trust-item {
  font-size: 11.5px;
  font-weight: 700;
  color: #4a5570;
  background: #f6fafd;
  border: 1px solid #e7ecf2;
  padding: 6px 10px;
  border-radius: 999px;
}

.cl-mobile-nav {
  display: none;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .clw-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .clw-aside {
    position: static;
    top: auto;
  }
}

@media (max-width: 899px) {
  .hsw-links {
    display: none;
  }

  .hsw-shell {
    width: calc(100% - 32px);
  }

  .hsw-nav-inner {
    min-height: 58px;
  }

  .clw-main {
    padding-top: 32px;
    padding-bottom: 96px;
  }

  .cl-mobile-nav {
    display: block;
  }
}

@media (max-width: 640px) {
  .hsw-shell {
    width: calc(100% - 24px);
  }

  .clw-card {
    padding: 24px 18px 26px;
  }

  .cl-h2 {
    font-size: 23px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hsw-back,
  .clw-prog-strip span {
    transition: none;
  }
}
</style>
