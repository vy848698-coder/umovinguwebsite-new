<template>
  <div class="lg-page">

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
        <div class="lg-greeting">The legal bit</div>
        <h1 class="lg-h1">Terms of Service</h1>
        <div class="lg-meta">Last updated March 2025 · Governing law: England &amp; Wales · ICO ZC111880</div>
      </div>

      <div class="lg-content">
        <h2>01 · Who we are and what we provide</h2>
        <p>
          umovingu Limited is registered in England and Wales, Company No. 13321548, 116 Yardley Road,
          Birmingham, B27 6LG. The company operates the Property Passport platform, allowing homeowners
          and buyers to build, store and share property documents, certificates and history. The service
          is currently in early access with features still being developed.
        </p>

        <h2>02 · Accepting these terms</h2>
        <p>
          By creating an account, submitting contact forms, joining early access, or using any service
          component, you agree to these terms. Users must be at least 18 years old.
        </p>

        <h2>03 · What we provide — and what we do not</h2>
        <p>
          umovingu provides a platform for organising, storing and sharing property-related documents and
          information. The company is not solicitors, conveyancers, financial advisers, surveyors or
          estate agents. Nothing constitutes legal, financial, mortgage or property advice.
        </p>
        <p>
          The service does not guarantee faster sales, prevent transaction failures, or ensure lender
          acceptance. It functions as a preparation tool only, with outcomes depending on factors beyond
          the company's control.
        </p>

        <h2>04 · Your account and your responsibilities</h2>
        <p>Users must:</p>
        <ul>
          <li>Provide accurate personal and property information</li>
          <li>Keep login credentials secure and not share them</li>
          <li>Notify us immediately if accounts are compromised</li>
          <li>Only upload documents you have rights to share</li>
        </ul>
        <p>
          Users must not misrepresent property conditions, store others' documents without permission,
          or use the service unlawfully.
        </p>

        <h2>05 · Your content</h2>
        <p>
          Users own uploaded documents and information. By uploading, users grant the company licences
          to store, process and share content per instructions and these terms. The company claims no
          ownership. Deleted accounts result in content deletion per the Privacy Policy.
        </p>

        <h2>06 · Sharing your Passport</h2>
        <p>
          Users control Property Passport visibility and duration. Access can be revoked anytime. The
          company is not responsible for third-party use of shared information. Transferring Passports
          to new owners upon completion requires confirmation of rights and accuracy.
        </p>

        <h2>07 · Pricing and payment</h2>
        <p>
          Early access is currently free. Paid features may be introduced with clear advance notice and
          explicit user agreement before charges apply.
        </p>

        <h2>08 · Availability and service changes</h2>
        <p>
          The company aims for constant availability but cannot guarantee uninterrupted access. Features
          may be added, changed or removed. Significant changes receive reasonable notice.
        </p>

        <h2>09 · Our liability to you</h2>
        <p>
          The company is not liable for unforeseeable losses, losses from user actions, losses from
          inaccurate uploaded information, or business losses including lost profits or interruption.
          For free services, total liability per claim is limited to £100. Nothing limits liability for
          death, personal injury from negligence, fraud, or non-excludable liabilities.
        </p>

        <h2>10 · Intellectual property</h2>
        <p>
          All website and platform content — including text, design, graphics, software and the Property
          Passport concept — belongs to umovingu Limited or licensors. The umovingu name, logo and
          branding are protected. Use requires prior written consent.
        </p>

        <h2>11 · Closing your account</h2>
        <p>
          Users can close accounts anytime by emailing
          <a href="mailto:hello@umovingu.io">hello@umovingu.io</a>. Requests are actioned within
          10 working days.
        </p>

        <h2>12 · Governing law and disputes</h2>
        <p>
          These terms are governed by England and Wales law. Disputes fall under exclusive jurisdiction
          of English and Welsh courts. Complaints should first go to
          <a href="mailto:hello@umovingu.io">hello@umovingu.io</a>, as direct conversation resolves
          most issues.
        </p>

        <p class="lg-fineprint">
          umovingu Limited · 116 Yardley Road, Birmingham, B27 6LG · Company No. 13321548 · ICO ZC111880
        </p>
      </div>
    </main>

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="lg-site-foot">
      <div class="lg-foot-grid">
        <div class="lg-foot-intro">
          <div class="lg-foot-brand">
            <img src="/logo-new.png" alt="" class="lg-foot-logo" />
            <strong>umovingu</strong>
            <span style="font-size:9.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#2fd0c6;background:rgba(0,161,154,.16);border:1px solid rgba(47,208,198,.35);border-radius:6px;padding:2px 7px;margin-left:2px;">BETA</span>
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

definePageMeta({ title: 'Terms of Service · UMovingU' })

const goBack = useGoBack('/profile/settings')
</script>

<style scoped>
.lg-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  min-height: 100dvh;
  background: #f3f2ef;
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
  color: #231d45;
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
  color: #231d45;
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
  margin-bottom: 6px;
}
.lg-content a {
  color: #067a74;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(6, 122, 116, 0.4);
}
.lg-content a:hover { border-bottom-color: #067a74; }
.lg-fineprint {
  margin-top: 30px !important;
  padding-top: 18px;
  border-top: 1px solid #e8eceb;
  font-size: 12.5px !important;
  color: #8a95a0 !important;
  font-weight: 600 !important;
  text-align: center;
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
  .lg-foot-grid { grid-template-columns: 1fr; gap: 22px; }
  .lg-foot-grid, .lg-foot-bottom { padding-left: 16px; padding-right: 16px; }
}
</style>
