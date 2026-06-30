<template>
  <div class="lg-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <WebTopNav>
      <template #actions>
        <button class="lg-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="lg-quick-btn solid" type="button" @click="navigateTo('/profile/settings')">Settings</button>
      </template>
    </WebTopNav>

    <main class="lg-body">
      <button class="lg-back-btn" type="button" @click="goBack">
        <span aria-hidden="true">&larr;</span>
        Back
      </button>

      <div class="lg-hero">
        <div class="lg-greeting">No tracking nonsense</div>
        <h1 class="lg-h1">Cookie Policy</h1>
        <div class="lg-meta">Last updated March 2025 · No advertising · ICO ZC111880</div>
      </div>

      <div class="lg-content">
        <h2>01 · What are cookies</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. umovingu uses
          cookies to make the site function correctly and to understand how it is being used. We do not
          use cookies to serve advertising or to track you across other websites.
        </p>

        <h2>02 · Cookies we use</h2>
        <div class="lg-table">
          <div class="lg-table-row lg-table-head">
            <div>Cookie</div>
            <div>Category</div>
            <div>Purpose</div>
            <div>Duration</div>
          </div>
          <div class="lg-table-row">
            <div><code>u_session</code></div>
            <div><span class="pill ess">Essential</span></div>
            <div>Maintains your session when logged in. Required for the service to function. Cleared on logout.</div>
            <div>Session</div>
          </div>
          <div class="lg-table-row">
            <div><code>u_csrf</code></div>
            <div><span class="pill ess">Essential</span></div>
            <div>Cross-site request forgery protection. Security requirement.</div>
            <div>Session</div>
          </div>
          <div class="lg-table-row">
            <div><code>u_consent</code></div>
            <div><span class="pill ess">Essential</span></div>
            <div>Records your cookie consent choices so we do not ask again on every visit.</div>
            <div>12 months</div>
          </div>
          <div class="lg-table-row">
            <div><code>_ga</code></div>
            <div><span class="pill ana">Analytics</span></div>
            <div>Google Analytics 4. Distinguishes unique users. IP anonymisation enabled. No individual-level tracking.</div>
            <div>2 years</div>
          </div>
          <div class="lg-table-row">
            <div><code>_ga_[ID]</code></div>
            <div><span class="pill ana">Analytics</span></div>
            <div>Google Analytics 4 session state. Used alongside <code>_ga</code>.</div>
            <div>2 years</div>
          </div>
        </div>
        <p class="lg-note">
          Essential cookies cannot be disabled. Analytics cookies are only set if you consent.
        </p>

        <h2>03 · Third-party cookies</h2>
        <p>
          Google Analytics sets cookies on our behalf. Their privacy policy is at
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a>.
          You can opt out of Google Analytics across all websites using the Google Analytics opt-out
          add-on at
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a>.
          We do not use advertising network cookies.
        </p>

        <h2>04 · Your choices</h2>
        <ul>
          <li>
            <strong>Cookie banner</strong> — accept or decline analytics cookies when you first visit.
            Change your preference at any time by clearing your cookies and revisiting.
          </li>
          <li>
            <strong>Browser settings</strong> — all modern browsers allow you to block or delete cookies.
            Blocking essential cookies will prevent some features from working.
          </li>
          <li>
            <strong>Contact us</strong> — email
            <a href="mailto:hello@umovingu.io">hello@umovingu.io</a> with any questions about specific cookies.
          </li>
        </ul>

        <h2>05 · Changes to this policy</h2>
        <p>
          We will update this policy if we change the cookies we use. The "last updated" date will reflect
          any changes. If we add new cookie categories, we will reset the consent banner so you can make a
          fresh choice.
        </p>

        <p class="lg-fineprint">umovingu Limited · ICO registration ZC111880</p>
      </div>
    </main>

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="lg-site-foot">
      <div class="lg-foot-grid">
        <div class="lg-foot-intro">
          <div class="lg-foot-brand">
            <img src="/logo-new.png" alt="" class="lg-foot-logo" />
            <strong>umovingu</strong>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="lg-foot-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="lg-foot-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/explore')">Explore</button>
        </div>

        <div class="lg-foot-col">
          <h5>Account</h5>
          <button type="button" @click="navigateTo('/profile')">Profile</button>
          <button type="button" @click="navigateTo('/profile/settings')">Settings</button>
          <button type="button" @click="navigateTo('/profile/support')">Support</button>
        </div>

        <div class="lg-foot-col">
          <h5>Legal</h5>
          <button type="button" @click="navigateTo('/legal/terms')">Terms of Service</button>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy Policy</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookie preferences</button>
        </div>
      </div>
      <div class="lg-foot-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Cookie Policy · UMovingU' })

const goBack = useGoBack('/profile/settings')
</script>

<style scoped>
.lg-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: #1f2b3f;
  position: relative;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
.ambient-a { width: 260px; height: 260px; top: 120px; left: -60px; background: rgba(0, 161, 154, 0.3); }
.ambient-b { width: 280px; height: 280px; top: 160px; right: -80px; background: rgba(95, 139, 255, 0.26); }

/* ── Nav action buttons ─────────────────────────────────── */
.lg-quick-btn {
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}
.lg-quick-btn.solid {
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

/* ── Body ───────────────────────────────────────────────── */
.lg-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 20px 22px 56px;
}
.lg-back-btn {
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 9px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 22px;
}

/* ── Hero ───────────────────────────────────────────────── */
.lg-hero { margin-bottom: 24px; }
.lg-greeting {
  font-size: 12px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--fx-aqua);
  font-weight: 800;
  margin-bottom: 8px;
}
.lg-h1 {
  font-size: 42px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -1.3px;
  line-height: 1.03;
  margin: 0;
}
.lg-meta {
  font-size: 13px;
  font-weight: 600;
  color: #5b6f88;
  margin-top: 12px;
}

/* ── Content ────────────────────────────────────────────── */
.lg-content {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(173, 201, 231, 0.5);
  border-radius: 22px;
  padding: 28px 30px;
  box-shadow: 0 18px 48px rgba(18, 55, 88, 0.08);
}
.lg-content h2 {
  font-size: 17px;
  font-weight: 800;
  color: #10263d;
  letter-spacing: -0.4px;
  margin: 28px 0 10px;
}
.lg-content h2:first-child { margin-top: 0; }
.lg-content p {
  font-size: 15px;
  font-weight: 500;
  color: #4a5868;
  line-height: 1.7;
  margin-bottom: 12px;
}
.lg-content ul { margin: 0 0 12px 20px; padding: 0; }
.lg-content li {
  font-size: 15px;
  font-weight: 500;
  color: #4a5868;
  line-height: 1.65;
  margin-bottom: 8px;
}
.lg-content a {
  color: #067a74;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(6, 122, 116, 0.4);
}
.lg-content a:hover { border-bottom-color: #067a74; }
.lg-content strong { color: #10263d; font-weight: 800; }
.lg-content code {
  background: #f1f9f4;
  color: #067a74;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  padding: 1px 6px;
  border-radius: 6px;
}
.lg-fineprint {
  margin-top: 30px !important;
  padding-top: 18px;
  border-top: 1px solid #e8eceb;
  font-size: 12.5px !important;
  color: #8a95a0 !important;
  font-weight: 600 !important;
  text-align: center;
}

/* ── Cookie table ───────────────────────────────────────── */
.lg-table {
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 14px;
  overflow: hidden;
  margin: 14px 0 10px;
  font-size: 13px;
}
.lg-table-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 2.4fr 1fr;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f2f1;
  align-items: start;
}
.lg-table-row:last-child { border-bottom: none; }
.lg-table-head {
  background: #f5f4f0;
  font-weight: 800;
  color: #4a5868;
  font-size: 10.5px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.lg-table-row > div { color: #4a5868; line-height: 1.5; }
.pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3px;
  padding: 2px 8px;
  border-radius: 100px;
  text-transform: uppercase;
}
.pill.ess { background: #e2f1ea; color: #067a74; }
.pill.ana { background: #fdf4dc; color: #6f4d14; }
.lg-note {
  font-size: 13px !important;
  font-weight: 700 !important;
  color: #067a74 !important;
}

/* ── Footer ─────────────────────────────────────────────── */
.lg-site-foot {
  position: relative;
  z-index: 1;
  background: linear-gradient(155deg, #1a1838 0%, #15132e 100%);
  color: #fff;
  padding: 56px 0 28px;
}
.lg-foot-grid,
.lg-foot-bottom {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 22px;
  padding-right: 22px;
}
.lg-foot-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.lg-foot-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.lg-foot-logo { height: 26px; width: auto; display: block; object-fit: contain; }
.lg-foot-brand strong { font-size: 18px; font-weight: 800; color: #fff; }
.lg-foot-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.lg-foot-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.lg-foot-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.lg-foot-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.lg-foot-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.lg-foot-col button:hover { color: #2fe0bd; }
.lg-foot-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .lg-foot-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .lg-body { padding: 16px 14px 40px; }
  .lg-h1 { font-size: 32px; }
  .lg-content { padding: 22px 18px; }
  .lg-table { font-size: 12px; }
  .lg-table-row { grid-template-columns: 1fr; gap: 4px; }
  .lg-table-head { display: none; }
  .lg-table-row > div:nth-child(1)::before { content: 'Cookie · '; color: #8a95a0; font-weight: 800; }
  .lg-table-row > div:nth-child(3)::before { content: 'Purpose · '; color: #8a95a0; font-weight: 800; }
  .lg-table-row > div:nth-child(4)::before { content: 'Duration · '; color: #8a95a0; font-weight: 800; }
  .lg-foot-grid { grid-template-columns: 1fr; gap: 22px; }
  .lg-foot-grid, .lg-foot-bottom { padding-left: 16px; padding-right: 16px; }
}
</style>
