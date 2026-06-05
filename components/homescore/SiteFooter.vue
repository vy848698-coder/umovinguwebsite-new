<template>
  <footer class="ex-footer">
    <div class="ex-footer-inner">
      <div class="web-footer-grid">
        <div class="web-footer-intro">
          <div class="web-footer-brand">
            <img src="/logo.png" alt="" />
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
  margin-top: 20px;
  padding: 40px 0 0;
  border-top: 1px solid rgba(30, 47, 71, 0.12);
  background:
    radial-gradient(circle at 86% 18%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 46%),
    linear-gradient(180deg, rgba(247, 252, 255, 0.96), rgba(236, 246, 252, 0.98));
  backdrop-filter: blur(10px);
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
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(182, 203, 228, 0.55);
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 20px 36px rgba(30, 58, 92, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.web-footer-intro {
  display: grid;
  gap: 10px;
}
.web-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.web-footer-brand img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.web-footer-brand strong {
  font-size: 20px;
  color: #1c2d44;
  letter-spacing: -0.4px;
}
.web-footer-chip {
  justify-self: start;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #0f756f;
  border: 1px solid rgba(0, 161, 154, 0.3);
  background: rgba(230, 252, 249, 0.95);
  border-radius: 999px;
  padding: 5px 10px;
  font-weight: 800;
}
.web-footer-intro p {
  margin: 0;
  color: #5b7192;
  font-size: 13px;
  line-height: 1.55;
}
.web-footer-cta {
  display: inline-flex;
  justify-self: start;
  align-items: center;
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  color: #fff;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 100%);
  box-shadow: 0 10px 18px rgba(30, 128, 196, 0.24);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.web-footer-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(30, 128, 196, 0.22);
}

.web-footer-col {
  display: grid;
  align-content: start;
}
.web-footer-col h5 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 12px;
  color: #1f3450;
  text-transform: uppercase;
  letter-spacing: 1.1px;
}
.web-footer-grid button {
  appearance: none;
  border: 0;
  display: block;
  background: transparent;
  color: #50637f;
  padding: 0;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.18s ease, transform 0.18s ease;
}
.web-footer-grid button:hover {
  color: #113352;
}

.web-footer-bottom {
  margin-top: 14px;
  padding: 12px 0 20px;
  border-top: 1px solid rgba(30, 47, 71, 0.11);
  color: #60748f;
  font-size: 12px;
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
  border: 1px solid transparent;
  background: rgba(227, 240, 255, 0.9);
  color: #2a4a70;
}
.footer-hicon::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: currentColor;
}
.footer-hicon--product {
  background: rgba(223, 241, 255, 0.95);
  border-color: rgba(87, 156, 217, 0.35);
  color: #2f5f89;
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
  background: rgba(229, 248, 241, 0.95);
  border-color: rgba(45, 154, 120, 0.35);
  color: #1f7f5b;
}
.footer-hicon--legal::before {
  width: 9px;
  height: 10px;
  border-radius: 2px 2px 5px 5px;
  clip-path: polygon(50% 0%, 95% 18%, 82% 100%, 18% 100%, 5% 18%);
}
.footer-hicon--account {
  background: rgba(248, 238, 255, 0.95);
  border-color: rgba(145, 111, 203, 0.35);
  color: #6c4fb0;
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
