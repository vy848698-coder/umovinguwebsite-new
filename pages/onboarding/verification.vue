<template>
  <div class="otp-page">
    <!-- ── Left brand / illustration panel (light) ── -->
    <aside class="otp-aside">
      <div class="otp-brand" style="cursor: default">
        <span class="otp-brand-logo"><img src="/op-icons/logo.png" alt="" /></span>
        <span class="otp-brand-name">umovingu</span>
        <span class="otp-brand-beta">Beta</span>
      </div>

      <div class="otp-illus-wrap">
        <p class="otp-eyebrow">One more step</p>
        <h1 class="otp-headline">Check your email.</h1>
        <p class="otp-sub">We've sent a six-digit code to your inbox.</p>
        <img
          src="/op-icons/onboarding/email.png"
          alt=""
          class="otp-illus-img"
        />
      </div>
    </aside>

    <!-- ── Right form panel ── -->
    <main class="otp-main">
      <VerificationCode />
    </main>
  </div>
</template>

<script setup lang="ts">
import VerificationCode from '@/components/VerificationCode.vue'

if (typeof definePageMeta === 'function') {
  definePageMeta({
    title: 'Email Verification - UmovingU',
  })
}
</script>

<style scoped>
.otp-page {
  min-height: 100dvh;
  display: flex;
  background: #faf9f5;
}

/* ── Left panel (light) ── */
.otp-aside {
  position: relative;
  width: 40%;
  max-width: 780px;
  min-height: 100dvh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
    radial-gradient(circle at 78% 12%, rgba(0, 161, 154, 0.06) 0%, transparent 42%),
    #fbfbf9;
  overflow: hidden;
}

.otp-brand {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 11px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.otp-brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.06);
  border: 2px solid #00a19a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}
.otp-brand-logo img {
  width: 32px;
  height: auto;
  display: block;
}
.otp-brand-name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
}
.otp-brand-beta {
  align-self: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.32);
  border-radius: 6px;
  padding: 3px 8px;
}

.otp-illus-wrap {
  flex: 1;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.otp-eyebrow {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #00a19a;
}
.otp-headline {
  margin: 0;
  font-size: clamp(38px, 4vw, 50px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #231d45;
}
.otp-sub {
  margin: 16px 0 0;
  font-size: 16px;
  line-height: 1.6;
  color: #6b6783;
  max-width: 34ch;
}
.otp-illus-img {
  width: 100%;
  max-width: 300px;
  height: auto;
  display: block;
  margin: 36px auto 0;
  object-fit: contain;
}

/* ── Right panel ── */
.otp-main {
  flex: 1;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}

/* ── Responsive: stack on narrow screens, hide the art panel ── */
@media (max-width: 900px) {
  .otp-page {
    flex-direction: column;
  }
  .otp-aside {
    width: 100%;
    max-width: none;
    min-height: auto;
    padding: 24px 24px 20px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .otp-illus-wrap {
    display: none;
  }
  .otp-main {
    min-height: auto;
    padding: 40px 22px 64px;
    align-items: flex-start;
  }
}

/* Phone: tighter header and side padding */
@media (max-width: 520px) {
  .otp-aside { padding: 20px 20px 16px; }
  .otp-main { padding: 32px 20px 56px; }
}

/* ── Big screens ──────────────────────────────────────────────────────
   Scale with the window width (--wide-zoom = width / 1366, set in
   nuxt.config.ts) so a desktop monitor shows this exactly as a 1366px
   laptop does, only bigger. Zoom multiplies vh/dvh too, so the full-height
   rules divide the zoom back out. Nothing changes at 1366px or below. */
@media (min-width: 1367px) {
  .otp-aside,
  .otp-main {
    zoom: var(--wide-zoom, 1);
    min-height: calc(100dvh / var(--wide-zoom, 1));
  }
}
</style>
