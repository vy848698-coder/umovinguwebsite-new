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
        <div class="lg-greeting">How we handle your data</div>
        <h1 class="lg-h1">Privacy Policy</h1>
        <div class="lg-meta">Last updated March 2025 · Controller: umovingu Limited · ICO ZC111880</div>
      </div>

      <div class="lg-content">
        <h2>01 · Who we are</h2>
        <p>
          umovingu Limited operates the Property Passport and umovingu platform. Registered in England
          and Wales, Company No. 13321548, at 116 Yardley Road, Birmingham, B27 6LG. For UK data
          protection purposes, umovingu Limited is the data controller. Contact:
          <a href="mailto:hello@umovingu.io">hello@umovingu.io</a>.
        </p>
        <p>
          The company is registered with the Information Commissioner's Office (ICO) under reference
          ZC111880.
        </p>

        <h2>02 · What information we collect</h2>
        <p>
          Information collected includes: name (via contact form), email address (contact form or
          signup), phone number (voluntarily provided), property address (during Passport setup),
          uploaded documents, and website usage data (via cookies).
        </p>
        <p>
          The company does not collect payment card details, health information, or government identity
          documents at this stage.
        </p>

        <h2>03 · Our legal basis for using your information</h2>
        <ul>
          <li>Contractual necessity when you sign up for a Property Passport or early access</li>
          <li>Legitimate interests to analyse website usage and improve it</li>
          <li>Consent for marketing emails, withdrawable at any time</li>
          <li>Legal obligation in rare cases</li>
        </ul>

        <h2>04 · How we use your information</h2>
        <ul>
          <li>Respond to contact form enquiries</li>
          <li>Set up and manage Property Passport records</li>
          <li>Send updates about records, expiring documents or new features where agreed</li>
          <li>Contact applicants about Founding 30 applications</li>
          <li>Improve website and product using anonymised analytics</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          The company does not use information for automated decision-making, does not sell information,
          and does not share it with third parties for marketing purposes.
        </p>

        <h2>05 · Who we share your information with</h2>
        <ul>
          <li>Google Analytics: receives anonymised website usage data</li>
          <li>Mailchimp or equivalent: receives name and email if subscribed to updates</li>
          <li>OpenProperty Tech Ltd: receives property address and record data</li>
          <li>Legal or regulatory authorities: information required by law or court order</li>
        </ul>

        <h2>06 · How long we keep your information</h2>
        <ul>
          <li>Contact form enquiries: 2 years</li>
          <li>Property Passport records: for the duration of an active account plus up to 2 years after closure</li>
          <li>Marketing preferences: until changed</li>
          <li>Analytics data: anonymised data retained per Google's standard settings (default 26 months)</li>
        </ul>

        <h2>07 · Your rights</h2>
        <p>
          Under UK GDPR, individuals may exercise rights by emailing
          <a href="mailto:hello@umovingu.io">hello@umovingu.io</a> within one month:
        </p>
        <ul>
          <li><strong>Access:</strong> confirm held information and receive a copy</li>
          <li><strong>Rectification:</strong> correct inaccurate or incomplete information</li>
          <li><strong>Erasure:</strong> delete information in certain circumstances</li>
          <li><strong>Restriction:</strong> pause information use while disputing accuracy</li>
          <li><strong>Portability:</strong> receive information in portable format</li>
          <li><strong>Object:</strong> object to processing based on legitimate interests</li>
          <li><strong>Withdraw consent:</strong> withdraw marketing consent at any time</li>
        </ul>
        <p>
          Right to complain to the ICO at
          <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a> or 0303 123 1113.
        </p>

        <h2>08 · Security</h2>
        <ul>
          <li>Encrypted transmission between browser and servers (HTTPS)</li>
          <li>Access controls for authorised team members only</li>
          <li>Regular review of data handling practices</li>
          <li>Use of reputable third-party platforms with maintained security standards</li>
        </ul>
        <p>Data breach notification to ICO within 72 hours if likely to affect rights.</p>

        <h2>09 · Links and children</h2>
        <p>
          External site links are not covered by this privacy policy. The service is not directed at
          children under 16. Contact the company if a child has provided information.
        </p>

        <h2>10 · Contact us</h2>
        <p>
          Email: <a href="mailto:hello@umovingu.io">hello@umovingu.io</a><br />
          Post: umovingu Limited, 116 Yardley Road, Birmingham, B27 6LG<br />
          Company No. 13321548<br />
          Response within five working days.
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

definePageMeta({ title: 'Privacy Policy · UMovingU' })

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
  margin-bottom: 6px;
}
.lg-content a {
  color: #067a74;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(6, 122, 116, 0.4);
}
.lg-content a:hover { border-bottom-color: #067a74; }
.lg-content strong { color: #10263d; font-weight: 800; }
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
