<template>
  <footer class="ex-footer">
    <div class="ex-footer-inner">
      <div class="web-footer-grid">
        <div class="web-footer-intro">
          <div class="web-footer-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /><rect x="10" y="14" width="4" height="6" />
            </svg>
            <strong>umovingu</strong>
          </div>
          <span class="web-footer-chip">Built for UK property journeys</span>
          <p>
            Professional property intelligence for sellers, buyers, and landlords.
            Start with HomeScore and progress with confidence.
          </p>
          <button type="button" class="web-footer-cta" @click="navigateTo('/homescore')">Run a HomeScore check</button>
        </div>

        <div class="web-footer-col">
          <h5><span class="footer-hicon footer-hicon--product" aria-hidden="true" />Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport/collections')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
        </div>

        <div class="web-footer-col">
          <h5><span class="footer-hicon footer-hicon--legal" aria-hidden="true" />Legal</h5>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy</button>
          <button type="button" @click="navigateTo('/legal/terms')">Terms</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookies</button>
        </div>

        <div class="web-footer-col">
          <h5><span class="footer-hicon footer-hicon--account" aria-hidden="true" />Account</h5>
          <button type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button type="button" @click="navigateTo('/onboarding/signup')">Create account</button>
        </div>
      </div>
      <div class="web-footer-bottom">© 2026 UMU. All rights reserved.</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// navigateTo is auto-imported by Nuxt.
</script>

<style scoped>
.ex-footer {
  margin-top: 40px;
  padding: 16px 0 24px;
  background: #231d45;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  z-index: 2;
}
.ex-footer-inner {
  width: min(1260px, calc(100% - 48px));
  margin: 0 auto;
}

.web-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 44px 0 0;
}

.web-footer-intro {
  display: grid;
  gap: 14px;
  align-content: start;
}
.web-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}
.web-footer-brand img,
.web-footer-brand svg {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.web-footer-brand strong {
  font-size: 21px;
  color: #fff;
  font-weight: 800;
  letter-spacing: -0.4px;
}
.web-footer-chip {
  justify-self: start;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 800;
}
.web-footer-intro p {
  margin: 0;
  max-width: 300px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.6;
}
.web-footer-cta {
  display: inline-flex;
  justify-self: start;
  align-items: center;
  border: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  cursor: pointer;
  transition: color 0.18s ease;
}
.web-footer-cta:hover {
  color: #2fd0c6;
}

.web-footer-col {
  display: grid;
  align-content: start;
}
.web-footer-col h5 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1.1px;
}
.web-footer-grid button {
  appearance: none;
  border: 0;
  display: block;
  background: transparent;
  color: rgba(255, 255, 255, 0.62);
  padding: 0;
  margin-top: 11px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.18s ease;
}
.web-footer-grid button:hover {
  color: #fff;
}

/* Sits directly on the dark #231d45 footer background, so keep it light */
.web-footer-bottom {
  margin-top: 44px;
  padding: 22px 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.45);
  font-size: 13px;
}

/* ── Header icons ──────────────────────────────────────────────────── */
.footer-hicon {
  width: 18px;
  height: 18px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.7);
}
.footer-hicon::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: currentColor;
}
.footer-hicon--product {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
}
.footer-hicon--product::before {
  width: 4px;
  height: 4px;
  border-radius: 1px;
  box-shadow:
    5px 0 0 currentColor,
    0 5px 0 currentColor,
    5px 5px 0 currentColor;
  transform: translate(-2px, -2px);
}
.footer-hicon--legal {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
}
.footer-hicon--legal::before {
  width: 9px;
  height: 10px;
  border-radius: 2px 2px 5px 5px;
  clip-path: polygon(50% 0%, 95% 18%, 82% 100%, 18% 100%, 5% 18%);
}
.footer-hicon--account {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
}
.footer-hicon--account::before {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  transform: translateY(-3px);
}
.footer-hicon--account::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 6px;
  border-radius: 6px 6px 4px 4px;
  background: currentColor;
  transform: translateY(4px);
}

@media (max-width: 980px) {
  .web-footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .web-footer-intro {
    grid-column: 1 / -1;
  }
}
@media (max-width: 640px) {
  .ex-footer-inner {
    width: calc(100% - 28px);
  }
  .web-footer-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 16px;
    border-radius: 18px;
  }
  .web-footer-cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
