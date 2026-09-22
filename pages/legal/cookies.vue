<template>
  <div class="lg-page">

    <WebTopNav>
      <template #actions>
        <button class="lg-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="lg-quick-btn solid" type="button" @click="navigateTo('/profile/settings')">Settings</button>
      </template>
    </WebTopNav>

    <main class="lg-body">
      <!-- ── Hero: title on the left, the key points on the right. Every line
           in the glance card is stated in the cookie policy below. ── -->
      <header class="lg-hero">
        <div class="lg-hero-main">
          <button class="lg-back-btn" type="button" @click="goBack">
            <Icon name="i-lucide-arrow-left" />
            Back
          </button>
          <div class="lg-greeting">No tracking nonsense</div>
          <h1 class="lg-h1">Cookie Policy<span class="lg-dot">.</span></h1>
          <p class="lg-lede">
            The small set of cookies umovingu uses, what each one is for, how long it lasts — and how to turn the optional ones off.
          </p>
          <div class="lg-meta">
            <span><Icon name="i-lucide-calendar" />Last updated March 2025</span>
            <span><Icon name="i-lucide-megaphone-off" />No advertising</span>
            <span><Icon name="i-lucide-badge-check" />ICO ZC111880</span>
          </div>
        </div>

        <aside class="lg-glance" aria-label="At a glance">
          <p class="lg-glance-title">At a glance</p>
          <ul>
            <li>
              <span class="lg-glance-ic"><Icon name="i-lucide-megaphone-off" /></span>
              <span><strong>No advertising cookies</strong> — we never use ad-network cookies.</span>
            </li>
            <li>
              <span class="lg-glance-ic"><Icon name="i-lucide-eye-off" /></span>
              <span><strong>No cross-site tracking</strong> of you on other websites.</span>
            </li>
            <li>
              <span class="lg-glance-ic"><Icon name="i-lucide-toggle-right" /></span>
              <span><strong>Analytics only with consent</strong> — essential cookies are the only ones set by default.</span>
            </li>
            <li>
              <span class="lg-glance-ic"><Icon name="i-lucide-user-x" /></span>
              <span><strong>IP anonymisation enabled</strong> on Google Analytics, with no individual-level tracking.</span>
            </li>
          </ul>
        </aside>
      </header>

      <div class="lg-layout">
        <!-- ── Sticky contents + contact ── -->
        <aside class="lg-side">
          <nav class="lg-toc" aria-label="On this page">
            <p class="lg-toc-title">On this page</p>
            <a
              v-for="s in sections"
              :key="s.id"
              :href="`#${s.id}`"
              class="lg-toc-link"
              :class="{ active: activeId === s.id }"
              @click.prevent="scrollToSection(s.id)"
            >
              <span class="lg-toc-num">{{ s.num }}</span>
              {{ s.title }}
            </a>
          </nav>

          <div class="lg-contact">
            <p class="lg-contact-title">Questions about a cookie?</p>
            <p class="lg-contact-sub">Email us about any specific cookie and we will explain it.</p>
            <a class="lg-contact-btn" href="mailto:hello@umovingu.io">
              <Icon name="i-lucide-mail" />
              hello@umovingu.io
            </a>
          </div>

          <nav class="lg-others" aria-label="Other policies">
            <p class="lg-others-title">Other policies</p>
            <NuxtLink to="/legal/terms">
              Terms of Service
              <Icon name="i-lucide-arrow-up-right" />
            </NuxtLink>
            <NuxtLink to="/legal/privacy">
              Privacy Policy
              <Icon name="i-lucide-arrow-up-right" />
            </NuxtLink>
          </nav>
        </aside>

        <!-- ── Policy ── -->
        <div class="lg-content">
          <section id="what-are-cookies" class="lg-sec">
            <h2><span class="lg-num">01</span>What are cookies</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. umovingu uses
              cookies to make the site function correctly and to understand how it is being used. We do not
              use cookies to serve advertising or to track you across other websites.
            </p>
          </section>

          <section id="cookies-we-use" class="lg-sec">
            <h2><span class="lg-num">02</span>Cookies we use</h2>
            <div class="lg-table" role="table" aria-label="Cookies we use">
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
                <div class="lg-table-dur">Session</div>
              </div>
              <div class="lg-table-row">
                <div><code>u_csrf</code></div>
                <div><span class="pill ess">Essential</span></div>
                <div>Cross-site request forgery protection. Security requirement.</div>
                <div class="lg-table-dur">Session</div>
              </div>
              <div class="lg-table-row">
                <div><code>u_consent</code></div>
                <div><span class="pill ess">Essential</span></div>
                <div>Records your cookie consent choices so we do not ask again on every visit.</div>
                <div class="lg-table-dur">12 months</div>
              </div>
              <div class="lg-table-row">
                <div><code>_ga</code></div>
                <div><span class="pill ana">Analytics</span></div>
                <div>Google Analytics 4. Distinguishes unique users. IP anonymisation enabled. No individual-level tracking.</div>
                <div class="lg-table-dur">2 years</div>
              </div>
              <div class="lg-table-row">
                <div><code>_ga_[ID]</code></div>
                <div><span class="pill ana">Analytics</span></div>
                <div>Google Analytics 4 session state. Used alongside <code>_ga</code>.</div>
                <div class="lg-table-dur">2 years</div>
              </div>
            </div>
            <p class="lg-callout">
              <Icon name="i-lucide-shield-check" />
              Essential cookies cannot be disabled. Analytics cookies are only set if you consent.
            </p>
          </section>

          <section id="third-party" class="lg-sec">
            <h2><span class="lg-num">03</span>Third-party cookies</h2>
            <p>
              Google Analytics sets cookies on our behalf. Their privacy policy is at
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a>.
              You can opt out of Google Analytics across all websites using the Google Analytics opt-out
              add-on at
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">tools.google.com/dlpage/gaoptout</a>.
              We do not use advertising network cookies.
            </p>
          </section>

          <section id="your-choices" class="lg-sec">
            <h2><span class="lg-num">04</span>Your choices</h2>
            <ul class="lg-list">
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
          </section>

          <section id="changes" class="lg-sec">
            <h2><span class="lg-num">05</span>Changes to this policy</h2>
            <p>
              We will update this policy if we change the cookies we use. The "last updated" date will reflect
              any changes. If we add new cookie categories, we will reset the consent banner so you can make a
              fresh choice.
            </p>
          </section>

          <p class="lg-fineprint">umovingu Limited · ICO registration ZC111880</p>
        </div>
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
          <button type="button" @click="navigateTo('/dashboard')">Dashboard</button>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Cookie Policy · UMovingU' })

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    },
  ],
})

const goBack = useGoBack('/profile/settings')

const sections = [
  { id: 'what-are-cookies', num: '01', title: 'What are cookies' },
  { id: 'cookies-we-use', num: '02', title: 'Cookies we use' },
  { id: 'third-party', num: '03', title: 'Third-party cookies' },
  { id: 'your-choices', num: '04', title: 'Your choices' },
  { id: 'changes', num: '05', title: 'Changes to this policy' },
]

// ── Contents highlighting ──
// The section nearest the top of the viewport is the one being read.
const activeId = ref(sections[0].id)
let observer: IntersectionObserver | null = null

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  activeId.value = id
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  const visible = new Map<string, number>()
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top)
        else visible.delete(e.target.id)
      }
      if (visible.size) {
        activeId.value = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0]
      }
    },
    { rootMargin: '-90px 0px -55% 0px', threshold: 0 },
  )
  for (const s of sections) {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  }
  const hash = location.hash.slice(1)
  if (hash && sections.some((s) => s.id === hash)) activeId.value = hash
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.lg-page {
  --ink: #231d45;
  --ink-2: #4a5268;
  --ink-3: #8a90a6;
  --brand: #00a19a;
  --brand-deep: #00756f;
  --brand-wash: #eafaf8;
  --line: rgba(35, 29, 69, 0.08);
  min-height: 100dvh;
  background: #f3f2ef;
  color: #1f2b3f;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Nav action buttons ─────────────────────────────────────
   Solid brand teal, the same treatment as every other page's primary nav
   action (it was a teal-to-indigo gradient nothing else on the site uses). */
.lg-quick-btn {
  border-radius: 12px;
  border: 1px solid #dcd9e4;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 16px;
  font-size: 14px;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.lg-quick-btn:hover { background: #f7f6f2; }
.lg-quick-btn.solid {
  border-color: var(--brand);
  background: var(--brand);
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 161, 154, 0.22);
}
.lg-quick-btn.solid:hover {
  background: #018e88;
  border-color: #018e88;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.3);
}

/* ── Body ───────────────────────────────────────────────── */
.lg-body {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px 80px;
}
.lg-back-btn {
  border: 1px solid #dcd9e4;
  background: #fff;
  color: var(--ink);
  border-radius: 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  padding: 8px 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  margin-bottom: 26px;
  transition: background 0.15s ease;
}
.lg-back-btn:hover { background: #f7f6f2; }
.lg-back-btn :deep(svg) { width: 16px; height: 16px; }

/* ── Hero ───────────────────────────────────────────────── */
.lg-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 40px;
  align-items: end;
  margin-bottom: 40px;
}
.lg-greeting {
  font-size: 12px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--brand);
  font-weight: 800;
  margin-bottom: 10px;
}
.lg-h1 {
  font-size: 54px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -2px;
  line-height: 1.02;
  margin: 0;
}
.lg-dot { color: var(--brand); }
.lg-lede {
  margin: 16px 0 0;
  max-width: 58ch;
  font-size: 16.5px;
  line-height: 1.6;
  color: var(--ink-2);
}
.lg-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.lg-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-2);
}
.lg-meta > span > :deep(*:first-child) { width: 14px; height: 14px; color: var(--brand); flex-shrink: 0; }

.lg-glance {
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(145deg, #241e4c, #14102f 75%);
  color: #fff;
  box-shadow: 0 22px 48px rgba(20, 16, 47, 0.24);
}
.lg-glance-title {
  margin: 0 0 14px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5eead4;
}
.lg-glance ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.lg-glance li { display: flex; gap: 12px; align-items: flex-start; font-size: 13.5px; line-height: 1.5; color: #c9c5e6; }
.lg-glance strong { color: #fff; font-weight: 800; }
.lg-glance-ic {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: rgba(94, 234, 212, 0.14);
  color: #5eead4;
}
.lg-glance-ic :deep(svg) { width: 15px; height: 15px; }

/* ── Two-column layout ──────────────────────────────────── */
.lg-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}
.lg-side {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.lg-toc {
  padding: 16px 12px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--line);
}
.lg-toc-title {
  margin: 0 8px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lg-toc-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 11px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-2);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.lg-toc-link:hover { background: #f7f6f2; color: var(--ink); }
.lg-toc-num {
  flex-shrink: 0;
  width: 26px;
  font-size: 11.5px;
  font-weight: 800;
  color: var(--ink-3);
  font-variant-numeric: tabular-nums;
}
.lg-toc-link.active { background: var(--brand-wash); color: var(--brand-deep); font-weight: 800; }
.lg-toc-link.active .lg-toc-num { color: var(--brand); }

.lg-contact {
  padding: 18px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--line);
}
.lg-contact-title { margin: 0 0 4px; font-size: 14px; font-weight: 800; color: var(--ink); }
.lg-contact-sub { margin: 0 0 14px; font-size: 12.5px; line-height: 1.5; color: var(--ink-3); }
.lg-contact-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--brand);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  transition: background 0.15s ease;
}
.lg-contact-btn:hover { background: #018e88; }
.lg-contact-btn :deep(svg) { width: 15px; height: 15px; }

/* ── Policy content ─────────────────────────────────────── */
.lg-content { display: flex; flex-direction: column; gap: 16px; }
.lg-sec {
  padding: 28px 32px;
  border-radius: 22px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 1px 2px rgba(26, 21, 53, 0.03), 0 8px 22px rgba(26, 21, 53, 0.04);
  scroll-margin-top: 90px;
}
.lg-sec h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.4px;
}
.lg-num {
  flex-shrink: 0;
  padding: 4px 9px;
  border-radius: 9px;
  background: var(--brand-wash);
  color: var(--brand-deep);
  font-size: 12px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
}
.lg-sec p {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-2);
  line-height: 1.75;
  margin: 0 0 12px;
}
.lg-sec p:last-child { margin-bottom: 0; }
.lg-sec a {
  color: var(--brand-deep);
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 117, 111, 0.35);
}
.lg-sec a:hover { border-bottom-color: var(--brand-deep); }
.lg-sec strong { color: var(--ink); font-weight: 800; }

.lg-list { list-style: none; margin: 0 0 14px; padding: 0; display: grid; gap: 10px; }
.lg-list:last-child { margin-bottom: 0; }
.lg-list li {
  position: relative;
  padding-left: 28px;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-2);
  line-height: 1.6;
}
.lg-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--brand-wash)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300a19a' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E")
    center / 11px no-repeat;
}

.lg-callout {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f5fbfa;
  border: 1px solid #d4efeb;
}
.lg-callout :deep(svg) { flex-shrink: 0; width: 18px; height: 18px; margin-top: 4px; color: var(--brand); }

.lg-rows { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
.lg-row {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 20px;
  align-items: center;
  padding: 14px 18px;
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--ink-2);
}
.lg-row + .lg-row { border-top: 1px solid var(--line); }
.lg-row:nth-child(odd) { background: #fbfaf8; }
.lg-row strong { font-size: 14.5px; }
.lg-pill {
  justify-self: start;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--brand-wash);
  color: var(--brand-deep);
  font-size: 13px;
  font-weight: 800;
}

.lg-rights {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 4px 0 16px;
}
.lg-right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  border-radius: 16px;
  background: #fbfaf8;
  border: 1px solid var(--line);
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink-2);
}
.lg-right strong { font-size: 14.5px; }
.lg-right-ic {
  width: 32px;
  height: 32px;
  margin-bottom: 6px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--brand-wash);
  color: var(--brand);
}
.lg-right-ic :deep(svg) { width: 16px; height: 16px; }

.lg-contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.lg-contact-grid div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fbfaf8;
  border: 1px solid var(--line);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}
.lg-contact-grid small {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lg-contact-grid a { align-self: flex-start; }

.lg-fineprint {
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--ink-3);
  font-weight: 600;
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
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
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
@media (max-width: 1080px) {
  .lg-hero { grid-template-columns: 1fr; gap: 24px; }
  .lg-glance ul { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 1024px) {
  .lg-foot-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .lg-layout { grid-template-columns: 1fr; }
  .lg-side { position: static; }
  .lg-toc {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 10px;
  }
  .lg-toc::-webkit-scrollbar { display: none; }
  .lg-toc-title { display: none; }
  .lg-toc-link { flex-shrink: 0; white-space: nowrap; }
  .lg-contact { display: none; }
}
@media (max-width: 640px) {
  .lg-body { padding: 18px 16px 56px; }
  .lg-h1 { font-size: 38px; letter-spacing: -1.2px; }
  .lg-lede { font-size: 15px; }
  .lg-glance ul { grid-template-columns: 1fr; }
  .lg-sec { padding: 22px 18px; }
  .lg-sec h2 { font-size: 18px; }
  .lg-row { grid-template-columns: 1fr; gap: 4px; }
  .lg-contact-grid { grid-template-columns: 1fr; }
  .lg-foot-grid { grid-template-columns: 1fr; gap: 22px; }
  .lg-foot-grid, .lg-foot-bottom { padding-left: 16px; padding-right: 16px; }
}

/* ── Other policies (sidebar) ───────────────────────────── */
.lg-others {
  padding: 14px 12px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid var(--line);
}
.lg-others-title {
  margin: 0 8px 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.lg-others a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 10px;
  border-radius: 11px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
  transition: background 0.15s ease;
}
.lg-others a:hover { background: #f7f6f2; }
.lg-others a :deep(svg) { width: 15px; height: 15px; color: var(--ink-3); }
@media (max-width: 900px) {
  .lg-others { display: none; }
}

/* ── Cookie table ───────────────────────────────────────── */
.lg-table { border: 1px solid var(--line); border-radius: 16px; overflow: hidden; margin-bottom: 14px; }
.lg-table-row {
  display: grid;
  grid-template-columns: 130px 120px minmax(0, 1fr) 100px;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--ink-2);
}
.lg-table-row + .lg-table-row { border-top: 1px solid var(--line); }
.lg-table-row:nth-child(even) { background: #fbfaf8; }
.lg-table-head {
  background: #f7f6f2 !important;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-top: 11px;
  padding-bottom: 11px;
}
.lg-table code {
  padding: 3px 8px;
  border-radius: 7px;
  background: #f1f0f6;
  color: var(--ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12.5px;
  font-weight: 700;
}
.lg-table-dur { font-weight: 700; color: var(--ink); }
.pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 800;
}
.pill.ess { background: var(--brand-wash); color: var(--brand-deep); }
.pill.ana { background: #efeafe; color: #6d4fd8; }
@media (max-width: 760px) {
  .lg-table-head { display: none; }
  .lg-table-row { grid-template-columns: 1fr auto; gap: 8px 12px; }
  .lg-table-row > :nth-child(3) { grid-column: 1 / -1; order: 3; }
  .lg-table-row > :nth-child(4) { order: 4; grid-column: 1 / -1; font-size: 12.5px; }
}
</style>
