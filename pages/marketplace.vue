<template>
  <div class="mp-page mobile-container">
    <div class="mp-topbar">
      <button class="mp-back" @click="router.back()" aria-label="Back">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="mp-top-title">Marketplace</div>
      <div class="mp-top-spacer" />
    </div>

    <div class="mp-hero">
      <div class="mp-emoji">🛠️</div>
      <h1 class="mp-h1">Trusted services, on the way</h1>
      <p class="mp-sub">
        We're putting together a hand-picked panel of conveyancers, surveyors,
        insurers and energy installers — vetted to work with Property Passports
        so the data they need is already verified.
      </p>

      <div class="mp-feat">
        <div class="mp-feat-row">
          <span class="mp-feat-check">✓</span>
          <div>
            <div class="mp-feat-title">Pre-quoted, no haggling</div>
            <div class="mp-feat-sub">
              Fixed-fee conveyancing and survey quotes — see the price before
              you instruct.
            </div>
          </div>
        </div>
        <div class="mp-feat-row">
          <span class="mp-feat-check">✓</span>
          <div>
            <div class="mp-feat-title">Faster completion</div>
            <div class="mp-feat-sub">
              Your Passport feeds straight into their forms — no re-typing,
              no waiting.
            </div>
          </div>
        </div>
        <div class="mp-feat-row">
          <span class="mp-feat-check">✓</span>
          <div>
            <div class="mp-feat-title">Independent reviews</div>
            <div class="mp-feat-sub">
              Real ratings from real UMU users — no astroturfing.
            </div>
          </div>
        </div>
      </div>

      <div class="mp-preview">
        <div class="mp-preview-head">
          <div>
            <div class="mp-preview-eyebrow">Launching soon</div>
            <div class="mp-preview-title">Trusted service categories</div>
          </div>
          <div class="mp-preview-pill">Preview</div>
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
            <div class="mp-preview-card-sub">Fixed-fee quotes matched to your Passport data.</div>
          </div>
          <div class="mp-preview-card">
            <div class="mp-preview-ic">🏗️</div>
            <div class="mp-preview-card-title">Surveyors</div>
            <div class="mp-preview-card-sub">Get to the right expert faster with verified property info.</div>
          </div>
          <div class="mp-preview-card">
            <div class="mp-preview-ic">🌡️</div>
            <div class="mp-preview-card-title">Energy upgrades</div>
            <div class="mp-preview-card-sub">Installers can see the EPC clues before they quote.</div>
          </div>
        </div>
      </div>

      <div class="mp-notify">
        <div class="mp-notify-eyebrow">Get early access</div>
        <p class="mp-notify-body">
          We'll email you when the Marketplace opens, with a £25 credit for
          first-time bookings.
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
          <button
            class="mp-notify-btn"
            type="submit"
            :disabled="submitting || submitted"
          >
            <span v-if="submitting" class="mp-spinner" />
            {{ submitted ? 'You\'re on the list ✓' : 'Notify me' }}
          </button>
        </form>
        <div v-if="errorMsg" class="mp-notify-err">{{ errorMsg }}</div>
      </div>
    </div>

    <div style="height: 100px" />
    <BottomNav active="marketplace" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '~/components/core/BottomNav.vue'

const router = useRouter()
const config = useRuntimeConfig()

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
.mp-page {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 86% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  padding: 8px 12px 28px;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  color: #231d45;
  -webkit-font-smoothing: antialiased;
}
.mp-topbar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 14px 18px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
  background: rgba(249, 252, 255, 0.92);
  border: 1px solid rgba(187, 211, 235, 0.58);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow:
    0 12px 28px rgba(17, 52, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  position: sticky;
  top: 8px;
  z-index: 20;
}
.mp-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ececef;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.mp-back svg {
  width: 16px;
  height: 16px;
  color: #231d45;
}
.mp-back:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(35, 29, 69, 0.12);
}
.mp-top-title {
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.2px;
}
.mp-top-spacer {
  width: 36px;
}

.mp-hero {
  width: min(100%, 980px);
  margin: 12px auto 0;
  padding: 28px 22px 32px;
  text-align: center;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(242, 250, 255, 0.94) 52%,
    rgba(236, 255, 249, 0.96) 100%
  );
  border: 1px solid rgba(174, 201, 231, 0.48);
  border-radius: 24px;
  box-shadow:
    0 14px 34px rgba(17, 52, 88, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  position: relative;
  overflow: hidden;
}
.mp-hero::before {
  content: '';
  position: absolute;
  top: -28px;
  right: -18px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.12) 0%, transparent 72%);
  border-radius: 50%;
  pointer-events: none;
}
.mp-emoji {
  font-size: 48px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}
.mp-h1 {
  font-size: 26px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin: 0 0 10px;
  position: relative;
  z-index: 1;
}
.mp-sub {
  font-size: 14px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto 24px;
  position: relative;
  z-index: 1;
}

.mp-feat {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(174, 201, 231, 0.44);
  border-radius: 18px;
  padding: 18px 18px 16px;
  margin: 0 4px 24px;
  box-shadow:
    0 10px 24px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
}
.mp-feat-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
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

.mp-notify {
  text-align: left;
  background: linear-gradient(135deg, #f2faf8 0%, #fff 70%);
  border: 1px solid #e5f4f2;
  border-radius: 18px;
  padding: 18px;
  margin: 0 4px;
  box-shadow:
    0 10px 24px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.mp-preview {
  text-align: left;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(174, 201, 231, 0.44);
  border-radius: 18px;
  padding: 18px;
  margin: 0 4px 24px;
  box-shadow:
    0 10px 24px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.mp-preview-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.mp-preview-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9c98ad;
  margin-bottom: 4px;
}
.mp-preview-title {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.2px;
}
.mp-preview-pill {
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
  margin-bottom: 16px;
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
  border: 1.5px solid #ececef;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.mp-notify-input:focus {
  outline: none;
  border-color: #00a19a;
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
  box-shadow: 0 8px 22px rgba(0, 161, 154, 0.3);
  transition: transform 0.15s ease, filter 0.15s ease;
}
.mp-notify-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.mp-notify-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
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

@media (max-width: 700px) {
  .mp-page {
    padding: 0 10px 24px;
  }

  .mp-topbar {
    width: 100%;
    border-radius: 16px;
    top: 0;
  }

  .mp-hero {
    width: 100%;
    padding: 24px 16px 24px;
    border-radius: 20px;
  }

  .mp-h1 {
    font-size: 24px;
  }

  .mp-sub {
    max-width: none;
  }

  .mp-feat,
  .mp-preview,
  .mp-notify {
    margin-left: 0;
    margin-right: 0;
  }

  .mp-notify-form {
    flex-direction: column;
  }

  .mp-notify-btn {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mp-back,
  .mp-notify-input,
  .mp-notify-btn,
  .mp-spinner {
    transition: none !important;
    animation: none !important;
  }
}
</style>
