<template>
  <div class="claim-root">
    <!-- Sticky topbar -->
    <div class="cl-topbar">
      <button class="cl-back" @click="onBack" aria-label="Back">‹</button>
      <div class="cl-top-text">
        <div class="cl-top-title">Find your property</div>
        <div class="cl-top-sub">Step 1 of 2</div>
      </div>
      <div class="cl-spacer" />
    </div>
    <div class="cl-prog-strip">
      <span style="width: 50%" />
    </div>

    <!-- Search screen -->
    <div class="cl-screen-wrap">
      <div class="cl-screen">
        <div class="cl-icon-square">🏠</div>
        <h1 class="cl-h2 cl-center">Which property are you claiming?</h1>
        <p class="cl-body cl-center cl-mb-lg">
          Enter your postcode and select your address. We'll verify ownership via
          HM Land Registry.
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'

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
.claim-root {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 86% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  --brand: #00a19a;
  --brand-pale: #f0fdfa;
  --brand-soft: #99f6e4;
  --brand-dark: #007d78;
  --navy: #231d45;
  --ink: #1a1a2e;
  --ink-soft: #4a4a6a;
  --ink-faint: #9090a8;
  --line: #dbe7f5;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 8px 12px 26px;
}

.cl-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(100%, 980px);
  margin: 0 auto;
  border: 1px solid rgba(187, 211, 235, 0.58);
  border-radius: 20px;
  background: rgba(249, 252, 255, 0.92);
  box-shadow:
    0 12px 28px rgba(17, 52, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
  padding: 14px 18px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.cl-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ececef;
  background: #fff;
  font-size: 22px;
  line-height: 1;
  color: var(--navy);
  cursor: pointer;
  display: grid;
  place-items: center;
  padding-bottom: 3px;
}
.cl-top-text { flex: 1; min-width: 0; }
.cl-top-title { font-size: 15px; font-weight: 800; color: var(--navy); letter-spacing: -0.01em; }
.cl-top-sub { font-size: 11px; color: #7f7b96; margin-top: 1px; }
.cl-spacer { width: 36px; }

.cl-prog-strip {
  width: min(100%, 980px);
  margin: 8px auto 0;
  height: 4px;
  background: rgba(219, 231, 245, 0.88);
  border-radius: 100px;
  overflow: hidden;
}
.cl-prog-strip span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #00a19a, #4dd4ce);
  transition: width 0.3s ease;
}

.cl-screen-wrap {
  width: min(100%, 980px);
  margin: 0 auto;
  padding-top: 16px;
}

.cl-screen {
  padding: 26px 18px 28px;
  max-width: 560px;
  margin: 0 auto;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.93) 0%, rgba(246, 252, 255, 0.9) 52%, rgba(239, 255, 251, 0.92) 100%);
  border: 1px solid rgba(174, 201, 231, 0.48);
  border-radius: 22px;
  box-shadow:
    0 16px 36px rgba(17, 52, 88, 0.12),
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
  margin: 0 auto 20px;
  font-size: 32px;
}
.cl-h2 {
  font-size: 30px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.03em;
  margin: 0 0 10px;
  line-height: 1.15;
}
.cl-center { text-align: center; }
.cl-body {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.6;
  margin: 0 0 16px;
}
.cl-mb-lg { margin-bottom: 24px; }

.cl-field-wrap { margin-bottom: 16px; }
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
.cl-lock-ic { font-size: 18px; flex-shrink: 0; }
.cl-lock-body {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.5;
}
.cl-lock-body strong { color: var(--ink); }

.cl-resolving {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  to { transform: rotate(360deg); }
}

@media (max-width: 700px) {
  .claim-root {
    padding: 0 10px 24px;
  }

  .cl-topbar {
    border-radius: 16px;
    padding: 12px 12px 8px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .cl-screen {
    border-radius: 18px;
    padding: 22px 14px 22px;
  }

  .cl-h2 {
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .claim-root {
    padding: 10px 20px 34px;
  }

  .cl-topbar,
  .cl-prog-strip,
  .cl-screen-wrap {
    width: min(100%, 1080px);
  }
}
</style>
