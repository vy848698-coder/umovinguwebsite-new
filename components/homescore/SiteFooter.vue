<template>
  <footer class="uf">
    <div class="uf-shell">
      <div class="uf-grid">
        <!-- Brand / intro -->
        <div class="uf-intro">
          <button class="uf-brand" type="button" @click="navigateTo('/')">
            <img src="/logo-new.png" alt="umovingu" class="uf-brand-logo" />
            <strong>umovingu</strong>
            <span style="font-size:9.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#2fd0c6;background:rgba(0,161,154,.16);border:1px solid rgba(47,208,198,.35);border-radius:6px;padding:2px 7px;margin-left:2px;">BETA</span>
          </button>

          <span class="uf-chip">Built for UK property journeys</span>

          <p class="uf-tagline">
            Professional property intelligence for sellers, buyers, and landlords.
            Start with HomeScore and progress with confidence.
          </p>

          <button class="uf-cta" type="button" @click="navigateTo('/homescore')">
            Run a HomeScore check
          </button>

          <div class="uf-social">
            <a class="uf-social-btn" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.4-3H14V4.5c0-.9.3-1.5 1.6-1.5H17V.3C16.7.2 15.8.1 14.7.1 12.3.1 10.7 1.6 10.7 4.2V6H8v3h2.7v9H14z"/></svg>
            </a>
            <a class="uf-social-btn" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-6.6 7.5L21.8 21h-6.1l-4.3-5.6L6.4 21H3.3l7.1-8L2.6 3h6.2l3.9 5.1zm-1.1 16h1.7L7.7 4.8H5.9z"/></svg>
            </a>
            <a class="uf-social-btn" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3 8.5h3.8V21H3zM9.5 8.5h3.6v1.7h.05c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V21h-3.8v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.5z"/></svg>
            </a>
            <a class="uf-social-btn" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
          </div>
        </div>

        <!-- Product -->
        <div class="uf-col">
          <h5><span class="uf-hicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></span>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport/collections')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
        </div>

        <!-- Legal -->
        <div class="uf-col">
          <h5><span class="uf-hicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.5 9 8 9s8-4 8-9V6z"/></svg></span>Legal</h5>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy</button>
          <button type="button" @click="navigateTo('/legal/terms')">Terms</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookies</button>
        </div>

        <!-- Account -->
        <div class="uf-col">
          <h5><span class="uf-hicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>Account</h5>
          <button type="button" @click="navigateTo('/onboarding/signin')">Sign In</button>
          <button type="button" @click="navigateTo('/onboarding/signup')">Create account</button>
        </div>
      </div>

      <div class="uf-bottom">© 2026 UMU. All rights reserved.</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// navigateTo is auto-imported by Nuxt.
</script>

<style scoped>
.uf {
  --teal: #00a19a;
  --teal-bright: #2fd0c6;
  position: relative;
  z-index: 2;
  margin-top: 48px;
  background: linear-gradient(180deg, #231d45 0%, #1c1738 100%);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.uf-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 56px 0 26px;
}

.uf-grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: 36px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* ── Brand intro ──────────────────────────────────────────────────── */
.uf-intro {
  display: grid;
  align-content: start;
  gap: 16px;
}

.uf-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.uf-brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.uf-brand strong {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #fff;
}

.uf-chip {
  justify-self: start;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  padding: 6px 12px;
  margin-top: -2px;
}

.uf-tagline {
  margin: 0;
  max-width: 36ch;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.58);
}

.uf-cta {
  justify-self: start;
  border: 0;
  padding: 0;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  position: relative;
  transition: color 0.18s ease;
}

.uf-cta::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3px;
  width: 100%;
  height: 1.5px;
  background: var(--teal-bright);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s ease;
}

.uf-cta:hover {
  color: var(--teal-bright);
}

.uf-cta:hover::after {
  transform: scaleX(1);
}

.uf-social {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.uf-social-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.66);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.uf-social-btn svg {
  width: 16px;
  height: 16px;
}

.uf-social-btn:hover {
  color: #fff;
  border-color: var(--teal);
  background: rgba(0, 161, 154, 0.18);
  transform: translateY(-2px);
}

/* ── Link columns ─────────────────────────────────────────────────── */
.uf-col {
  display: grid;
  align-content: start;
}

.uf-col h5 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0 16px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}

.uf-hicon {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.uf-hicon svg {
  width: 11px;
  height: 11px;
}

.uf-col button {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 0;
  padding: 0;
  margin-bottom: 12px;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  text-align: left;
  transition: color 0.18s ease;
}

.uf-col button::before {
  content: '';
  width: 0;
  border-radius: 2px;
  height: 1.5px;
  background: var(--teal-bright);
  transition: width 0.18s ease, margin-right 0.18s ease;
}

.uf-col button:hover {
  color: #fff;
}

.uf-col button:hover::before {
  width: 12px;
  margin-right: 7px;
}

/* ── Bottom bar ───────────────────────────────────────────────────── */
.uf-bottom {
  padding-top: 22px;
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.42);
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .uf-grid {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
  .uf-intro {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .uf-shell {
    width: calc(100% - 32px);
    padding: 40px 0 22px;
  }
  .uf-grid {
    grid-template-columns: 1fr;
    gap: 26px;
  }
}
</style>
