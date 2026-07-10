<template>
  <div class="otp-page">
    <!-- ── Left brand / illustration panel ── -->
    <aside class="otp-aside">
      <button class="otp-brand" type="button" @click="navigateTo('/')">
        <img src="/logo-new.png" alt="" class="otp-brand-logo" />
        <span class="otp-brand-name">umovingu</span>
        <span class="otp-brand-beta">Beta</span>
      </button>

      <div class="otp-illus" aria-hidden="true">
        <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- soft glow -->
          <circle cx="180" cy="188" r="132" fill="url(#glow)" />

          <!-- decorative dots -->
          <circle cx="66" cy="150" r="6" fill="#E0A43A" />
          <circle cx="300" cy="150" r="7" fill="#17B3A6" />
          <circle cx="70" cy="250" r="7" fill="#17B3A6" />
          <circle cx="292" cy="256" r="6" fill="#8E82C4" />

          <!-- envelope -->
          <rect x="86" y="176" width="188" height="130" rx="16" fill="#3A3368" />
          <rect x="86" y="176" width="188" height="130" rx="16" stroke="#4E4788" stroke-width="2" />
          <path d="M92 190 L180 250 L268 190" stroke="#6C63A6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <path d="M92 300 L150 250" stroke="#4E4788" stroke-width="3" stroke-linecap="round" />
          <path d="M268 300 L210 250" stroke="#4E4788" stroke-width="3" stroke-linecap="round" />

          <!-- OTP pill -->
          <rect x="112" y="120" width="136" height="52" rx="14" fill="#12B5A6" />
          <circle cx="140" cy="146" r="6" fill="#fff" />
          <circle cx="164" cy="146" r="6" fill="#fff" />
          <circle cx="188" cy="146" r="6" fill="#fff" />
          <circle cx="212" cy="146" r="6" fill="#fff" />
          <circle cx="236" cy="146" r="6" fill="#fff" />

          <defs>
            <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="#2FBFB6" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#2FBFB6" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <!-- progress dots -->
      <div class="otp-progress">
        <span class="on" />
        <span class="on" />
        <span />
        <span />
        <span />
        <span />
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

/* ── Left panel ── */
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
    radial-gradient(circle at 78% 12%, rgba(47, 191, 182, 0.10) 0%, transparent 42%),
    linear-gradient(158deg, #241d47 0%, #2c2658 52%, #201b46 100%);
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
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  flex-shrink: 0;
}
.otp-brand-name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #fff;
}
.otp-brand-beta {
  align-self: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #6fe6dc;
  background: rgba(47, 191, 182, 0.16);
  border: 1px solid rgba(47, 191, 182, 0.42);
  border-radius: 6px;
  padding: 3px 8px;
}

.otp-illus {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.otp-illus svg {
  width: 100%;
  max-width: 360px;
  height: auto;
}

.otp-progress {
  display: flex;
  gap: 10px;
  padding-bottom: 8px;
}
.otp-progress span {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.16);
}
.otp-progress span.on {
  background: #12b5a6;
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
  .otp-illus,
  .otp-progress {
    display: none;
  }
  .otp-main {
    min-height: auto;
    padding: 40px 22px 64px;
    align-items: flex-start;
  }
}
</style>
