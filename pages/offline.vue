<template>
  <div class="offline-root">

    <div class="offline-card">
      <div class="offline-icon">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="28" stroke="#00a19a" stroke-width="3" opacity="0.2" />
          <path d="M12 20C17.5 14 24.4 10 32 10C39.6 10 46.5 14 52 20" stroke="#00a19a" stroke-width="3" stroke-linecap="round" opacity="0.4" />
          <path d="M18 27C22 22.5 26.8 20 32 20C37.2 20 42 22.5 46 27" stroke="#00a19a" stroke-width="3" stroke-linecap="round" opacity="0.6" />
          <path d="M24 34C26.6 31 29.2 30 32 30C34.8 30 37.4 31 40 34" stroke="#00a19a" stroke-width="3" stroke-linecap="round" />
          <circle cx="32" cy="43" r="4" fill="#00a19a" />
          <line x1="8" y1="8" x2="56" y2="56" stroke="#e53e3e" stroke-width="3" stroke-linecap="round" />
        </svg>
      </div>

      <h1 class="offline-title">You're offline</h1>
      <p class="offline-sub">
        No internet connection detected. Check your Wi-Fi or mobile data and try again.
      </p>

      <button class="offline-btn" @click="retry">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Try again
      </button>

      <p class="offline-hint">Some pages you've visited recently may still be available.</p>
    </div>

    <div class="offline-brand">
      <img src="/logo-new.png" alt="UmovingU" class="offline-logo" />
      <span>umovingu</span><span class="offline-beta">BETA</span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

function retry() {
  window.location.reload()
}
</script>

<style scoped>
.offline-root {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
}
.offline-ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(56px);
  opacity: 0.12;
  pointer-events: none;
}
.offline-ambient-a { width: 260px; height: 260px; left: -80px; top: 80px; background: #00a19a; }
.offline-ambient-b { width: 280px; height: 280px; right: -100px; bottom: 80px; background: #5a4cf0; }

.offline-card {
  width: min(440px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(231, 236, 242, 0.9);
  border-radius: 28px;
  padding: 48px 36px 40px;
  text-align: center;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 24px 56px rgba(23, 52, 92, 0.1);
  position: relative;
  z-index: 1;
}

.offline-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}
.offline-icon svg { width: 100%; height: 100%; }

.offline-title {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #08102f;
  margin: 0 0 10px;
}

.offline-sub {
  font-size: 15px;
  color: #5b6d89;
  line-height: 1.6;
  margin: 0 0 28px;
}

.offline-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 28px;
  border: 0;
  border-radius: 12px;
  background: #00857f;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(47, 93, 223, 0.18);
  transition: transform 0.18s;
  margin-bottom: 20px;
}
.offline-btn:hover { transform: translateY(-1px); }
.offline-btn svg { width: 16px; height: 16px; }

.offline-hint {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

.offline-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 36px;
  color: #475a7b;
  font-size: 16px;
  font-weight: 800;
  opacity: 0.6;
  position: relative;
  z-index: 1;
}
.offline-logo { width: 24px; height: 24px; object-fit: contain; }
.offline-beta { font-size: 9px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 6px; margin-left: 2px; }

@media (prefers-reduced-motion: reduce) {
  .offline-btn { transition: none; }
}
</style>
