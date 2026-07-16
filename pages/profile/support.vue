<template>
  <div class="hs-page">

    <WebTopNav>
      <template #actions>
        <button class="hs-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="hs-quick-btn solid" type="button" @click="navigateTo('/profile/settings')">Settings</button>
      </template>
    </WebTopNav>

    <main class="hs-body">
      <!-- Hero -->
      <section class="hs-hero">
        <div class="hs-hero-copy">
          <div class="hero-greeting">We're here for you</div>
          <h1 class="hs-h1">How can we <span class="accent">help?</span></h1>
          <p class="hs-hero-sub">Find answers, get support, and make the most of your UMU experience.</p>

          <div class="hs-online">
            <div class="hs-online-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3z" />
                <path d="M3 19a2 2 0 0 0 2 2h1v-7H3z" />
              </svg>
            </div>
            <div class="hs-online-info">
              <div class="hs-online-headline">Support team is online</div>
              <div class="hs-online-sub">Mon–Fri · 9am–6pm UK · Usual reply under 4 hours</div>
            </div>
            <button class="hs-chat-btn" type="button" @click="navigateTo('/profile/chat')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat with us
            </button>
          </div>
        </div>

        <div class="hs-hero-art" aria-hidden="true">
          <div class="hs-art-glow" />
          <div class="hs-art-headset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
              <rect x="2.5" y="13.5" width="4" height="7" rx="1.6" />
              <rect x="17.5" y="13.5" width="4" height="7" rx="1.6" />
              <path d="M20 20.5a3 3 0 0 1-3 2.5h-3" />
            </svg>
            <div class="hs-art-bubble">
              <span /><span /><span />
            </div>
          </div>
          <span class="hs-spark hs-spark-1">✦</span>
          <span class="hs-spark hs-spark-2">✦</span>
          <span class="hs-spark hs-spark-3">✦</span>
        </div>
      </section>

      <!-- Get in touch -->
      <div class="hs-section-heading">Get in touch</div>
      <div class="hs-contact-grid">
        <button class="hs-contact-card violet" type="button" @click="navigateTo('/profile/chat')">
          <div class="hs-contact-main">
            <div class="hs-contact-icon violet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9 12 2" />
              </svg>
            </div>
            <div class="hs-contact-body">
              <div class="hs-contact-name">Ask AI first</div>
              <div class="hs-contact-meta">Instant answers · 24/7</div>
            </div>
            <span class="hs-contact-pill violet">Ask a question <span class="chev">›</span></span>
          </div>
          <div class="hs-contact-art robot" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none">
              <!-- chat bubble -->
              <g>
                <rect x="14" y="12" width="34" height="24" rx="9" fill="#fff" />
                <path d="M22 36l-3 8 12-6z" fill="#fff" />
                <circle cx="24" cy="24" r="2.4" fill="#7c72f5" />
                <circle cx="31" cy="24" r="2.4" fill="#7c72f5" />
                <circle cx="38" cy="24" r="2.4" fill="#7c72f5" />
              </g>
              <!-- robot body -->
              <rect x="44" y="74" width="44" height="30" rx="14" fill="#e7e1ff" />
              <!-- robot head -->
              <circle cx="66" cy="58" r="30" fill="#f4f1ff" />
              <circle cx="66" cy="58" r="30" fill="url(#robotGlow)" />
              <rect x="48" y="44" width="36" height="28" rx="14" fill="#2b2660" />
              <circle cx="59" cy="58" r="4.4" fill="#5fe9ff" />
              <circle cx="73" cy="58" r="4.4" fill="#5fe9ff" />
              <path d="M59 66q7 5 14 0" stroke="#5fe9ff" stroke-width="2.4" stroke-linecap="round" />
              <!-- antenna -->
              <line x1="66" y1="44" x2="66" y2="34" stroke="#cdc5ff" stroke-width="3" stroke-linecap="round" />
              <circle cx="66" cy="32" r="3.4" fill="#7c72f5" />
              <defs>
                <radialGradient id="robotGlow" cx="0.5" cy="0.35" r="0.7">
                  <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </button>

        <a class="hs-contact-card teal" href="mailto:help@umovingu.com">
          <div class="hs-contact-main">
            <div class="hs-contact-icon teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22 6 12 13 2 6" />
              </svg>
            </div>
            <div class="hs-contact-body">
              <div class="hs-contact-name">Email us</div>
              <div class="hs-contact-meta">We'll get back to you as soon as possible</div>
            </div>
            <span class="hs-contact-pill teal">Send an email <span class="chev">›</span></span>
          </div>
          <div class="hs-contact-art mail" aria-hidden="true">
            <svg viewBox="0 0 120 120" fill="none">
              <!-- letter sticking out -->
              <rect x="40" y="30" width="34" height="40" rx="4" fill="#fff" />
              <line x1="47" y1="40" x2="67" y2="40" stroke="#bfe5dc" stroke-width="2.6" stroke-linecap="round" />
              <line x1="47" y1="47" x2="67" y2="47" stroke="#bfe5dc" stroke-width="2.6" stroke-linecap="round" />
              <line x1="47" y1="54" x2="60" y2="54" stroke="#bfe5dc" stroke-width="2.6" stroke-linecap="round" />
              <!-- envelope back -->
              <rect x="26" y="58" width="60" height="42" rx="8" fill="#0fae7e" />
              <!-- envelope front flap -->
              <path d="M26 64l30 22 30-22v36a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z" fill="#17c08e" />
              <path d="M26 64l30 22 30-22" stroke="#0c9a6f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              <!-- paper plane -->
              <path d="M88 30l16 6-12 9-1-6z" fill="#bcdcff" />
              <path d="M104 36l-11 9-4-3z" fill="#9cc6f7" />
              <path d="M99 52q6 6 0 12" stroke="#bcdcff" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="2 5" fill="none" />
            </svg>
          </div>
        </a>
      </div>

      <!-- FAQ -->
      <div class="hs-section-heading">
        Frequently asked
        <span class="sh-action" @click="openIdx = -2">View all articles →</span>
      </div>

      <div class="hs-faq-grid">
        <div
          v-for="(item, idx) in faqs"
          :key="item.q"
          class="faq-item"
          :class="{ open: openIdx === idx || openIdx === -2 }"
          @click="toggleFaq(idx)"
        >
          <div class="faq-q">
            <span class="faq-num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span class="faq-text">{{ item.q }}</span>
            <span class="faq-chev">›</span>
          </div>
          <div v-if="openIdx === idx || openIdx === -2" class="faq-a">
            {{ item.a }}
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="hs-section-heading">
        Status
        <span class="sh-action plain">All systems <span class="hs-status-check">✓</span></span>
      </div>
      <div class="hs-status-card">
        <div class="hs-status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h4l3 8 4-16 3 8h4" />
          </svg>
        </div>
        <div class="hs-status-content">
          <div class="hs-status-title">
            UMU systems
            <span class="pill-tag live"><span class="live-dot" />All operational</span>
          </div>
          <div class="hs-status-sub">No issues reported in the last 30 days</div>
        </div>
        <span class="hs-status-arrow">›</span>
      </div>
    </main>

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="hs-footer">
      <div class="hs-footer-grid">
        <div class="hs-footer-intro">
          <div class="hs-footer-brand">
            <img src="/logo-new.png" alt="" class="hs-footer-logo" />
            <strong>umovingu</strong>
            <span style="font-size:9.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#2fd0c6;background:rgba(0,161,154,.16);border:1px solid rgba(47,208,198,.35);border-radius:6px;padding:2px 7px;margin-left:2px;">BETA</span>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="hs-footer-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="hs-footer-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/explore')">Explore</button>
        </div>

        <div class="hs-footer-col">
          <h5>Account</h5>
          <button type="button" @click="navigateTo('/profile')">Profile</button>
          <button type="button" @click="navigateTo('/profile/personal-information')">Personal info</button>
          <button type="button" @click="navigateTo('/profile/support')">Support</button>
        </div>

        <div class="hs-footer-col">
          <h5>Legal</h5>
          <button type="button" @click="navigateTo('/legal/terms')">Terms of Service</button>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy Policy</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookie preferences</button>
        </div>
      </div>
      <div class="hs-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Help & Support - UmovingU', middleware: 'auth' })

const openIdx = ref<number>(-1)

function toggleFaq(idx: number) {
  if (openIdx.value === -2) {
    openIdx.value = idx
    return
  }
  openIdx.value = openIdx.value === idx ? -1 : idx
}

const faqs = [
  {
    q: 'What is a Property Passport and why do I need one?',
    a: 'A Property Passport is a verified, legally-backed dossier of every important detail about a property — title deeds, EPC, floor plan, surveys, certificates. It speeds up sales and lettings dramatically by giving buyers and tenants everything they need upfront.',
  },
  {
    q: 'How does identity verification work?',
    a: 'We use a combination of passport / driving-licence checks, liveness detection, and AML screening. The whole flow takes 2–3 minutes and only happens once.',
  },
  {
    q: 'Can I share my Buyer Profile with someone outside UMU?',
    a: 'Yes — generate a secure share link from your Buyer Profile. The recipient sees a verified read-only view in their browser; no UMU account required.',
  },
  {
    q: "What happens if a seller doesn't have a passport yet?",
    a: 'You can register interest. We notify the owner; once they prepare their passport, you get first access before it is published publicly.',
  },
  {
    q: 'How is my data protected?',
    a: 'Documents are stored encrypted at rest, transferred over TLS, and never sold. You control who sees what — every share is auditable and revocable.',
  },
  {
    q: 'How does the £49 passport unlock work?',
    a: 'A one-time payment per passport. It gives you full access to that passport — documents, AI summaries, and direct messaging with the owner.',
  },
  {
    q: 'Can I delete my account?',
    a: 'Yes — Settings → Delete account. Your passports, documents, and personal data are removed within 30 days; verifiable share links are revoked immediately.',
  },
]
</script>

<style scoped>
.hs-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-violet: #6c5ce7;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background: #f3f2ef;
  color: var(--fx-text);
  position: relative;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.hs-page :deep(.webtop-nav) {
  background: rgba(243, 242, 239, 0.86);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
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
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.1;
}
.ambient-a {
  width: 260px;
  height: 260px;
  top: 120px;
  left: -60px;
  background: rgba(0, 161, 154, 0.3);
}
.ambient-b {
  width: 280px;
  height: 280px;
  top: 160px;
  right: -80px;
  background: rgba(95, 139, 255, 0.26);
}

.hs-quick-btn {
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
.hs-quick-btn.solid {
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.hs-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 22px 0;
}

/* ── Hero ───────────────────────────────────────────────── */
.hs-hero {
  position: relative;
  border-radius: 28px;
  padding: 38px 40px;
  border: 1px solid rgba(58, 74, 130, 0.5);
  background:
    radial-gradient(circle at 86% 12%, rgba(0, 161, 154, 0.22) 0%, rgba(0, 161, 154, 0) 46%),
    radial-gradient(circle at 12% 100%, rgba(79, 79, 242, 0.18) 0%, rgba(79, 79, 242, 0) 50%),
    linear-gradient(150deg, #1b1b46 0%, #201a4f 52%, #161533 100%);
  box-shadow:
    0 24px 56px rgba(13, 18, 51, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;
  margin-bottom: 28px;
}
.hs-hero-copy { position: relative; z-index: 2; max-width: 640px; }
.hero-greeting {
  font-size: 12px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #2fd4c4;
  font-weight: 800;
  margin-bottom: 8px;
}
.hs-h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 46px;
  font-weight: 750;
  color: #ffffff;
  letter-spacing: -1.3px;
  line-height: 1.02;
}
.hs-h1 .accent { color: #2fd4c4; }
.hs-hero-sub {
  font-size: 15px;
  font-weight: 600;
  color: rgba(214, 222, 245, 0.78);
  margin-top: 12px;
}

.hs-online {
  margin-top: 26px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  max-width: 720px;
}
.hs-online-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(47, 212, 196, 0.14);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  position: relative;
  color: #2fd4c4;
}
.hs-online-icon::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #14c08a;
  border: 2px solid #1b1b46;
  border-radius: 50%;
  animation: ss-pulse 2s ease-in-out infinite;
}
@keyframes ss-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(20, 192, 138, 0.5); }
  50% { box-shadow: 0 0 0 7px rgba(20, 192, 138, 0); }
}
.hs-online-icon svg { width: 20px; height: 20px; }
.hs-online-info { flex: 1; min-width: 0; }
.hs-online-headline { font-size: 15px; font-weight: 800; color: #ffffff; }
.hs-online-sub { font-size: 12.5px; font-weight: 600; color: rgba(198, 208, 235, 0.7); margin-top: 2px; }
.hs-chat-btn {
  border: none;
  border-radius: 100px;
  background: linear-gradient(120deg, #0fae7e 0%, var(--fx-aqua) 100%);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  padding: 11px 20px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  box-shadow: 0 12px 24px rgba(0, 150, 130, 0.28);
}
.hs-chat-btn svg { width: 17px; height: 17px; }

/* hero artwork */
.hs-hero-art {
  position: absolute;
  top: 50%;
  right: 48px;
  transform: translateY(-50%);
  width: 180px;
  height: 180px;
  z-index: 1;
}
.hs-art-glow {
  position: absolute;
  inset: 6%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 212, 196, 0.4) 0%, rgba(47, 212, 196, 0) 70%);
}
.hs-art-headset {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: linear-gradient(150deg, #1bb6a6 0%, #0a8f86 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  box-shadow:
    0 22px 46px rgba(0, 0, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.25);
}
.hs-art-headset svg { width: 64px; height: 64px; }
.hs-art-bubble {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}
.hs-art-bubble span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua), var(--fx-blue));
  animation: art-blink 1.4s ease-in-out infinite;
}
.hs-art-bubble span:nth-child(2) { animation-delay: 0.2s; }
.hs-art-bubble span:nth-child(3) { animation-delay: 0.4s; }
@keyframes art-blink { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
.hs-spark { position: absolute; color: #9be3c9; font-size: 14px; }
.hs-spark-1 { top: 4%; left: 6%; font-size: 18px; color: #b6d6ff; }
.hs-spark-2 { top: 8%; right: 0; color: #9be3c9; }
.hs-spark-3 { bottom: 12%; right: 8%; font-size: 12px; color: #b6d6ff; }

/* ── Section heading ────────────────────────────────────── */
.hs-section-heading {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 6px 4px 14px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sh-action {
  margin-left: auto;
  font-size: 13px;
  font-weight: 800;
  color: var(--fx-aqua);
  text-transform: none;
  letter-spacing: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.sh-action.plain { cursor: default; }
.hs-status-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--fx-aqua);
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
}

/* ── Get in touch ───────────────────────────────────────── */
.hs-contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}
.hs-contact-card {
  position: relative;
  border-radius: 22px;
  padding: 26px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid transparent;
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s;
}
.hs-contact-card:hover { transform: translateY(-3px); }
.hs-contact-main {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}
.hs-contact-art {
  flex-shrink: 0;
  width: 128px;
  height: 128px;
  margin: -14px -8px -14px 0;
  align-self: center;
  filter: drop-shadow(0 14px 22px rgba(15, 44, 76, 0.16));
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-contact-art svg { width: 100%; height: 100%; }
.hs-contact-card:hover .hs-contact-art { transform: translateY(-4px) scale(1.04); }
.hs-contact-card.violet {
  background: linear-gradient(150deg, rgba(243, 240, 255, 0.96), rgba(233, 226, 255, 0.92));
  border-color: rgba(112, 92, 240, 0.22);
  box-shadow: 0 14px 32px rgba(112, 92, 240, 0.12);
}
.hs-contact-card.teal {
  background: linear-gradient(150deg, rgba(232, 248, 244, 0.96), rgba(224, 244, 255, 0.92));
  border-color: rgba(0, 161, 154, 0.2);
  box-shadow: 0 14px 32px rgba(0, 161, 154, 0.1);
}
.hs-contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  flex-shrink: 0;
}
.hs-contact-icon svg { width: 22px; height: 22px; }
.hs-contact-icon.violet { background: linear-gradient(135deg, #7c72f5, #5875ea); box-shadow: 0 10px 20px rgba(112, 92, 240, 0.3); }
.hs-contact-icon.teal { background: linear-gradient(135deg, #0fae7e, var(--fx-aqua)); box-shadow: 0 10px 20px rgba(0, 150, 130, 0.3); }
.hs-contact-body { display: flex; flex-direction: column; gap: 3px; }
.hs-contact-name { font-size: 19px; font-weight: 800; color: #17314a; letter-spacing: -0.4px; }
.hs-contact-meta { font-size: 13.5px; font-weight: 600; color: #627891; }
.hs-contact-pill {
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border-radius: 100px;
  padding: 9px 18px;
  font-size: 13.5px;
  font-weight: 800;
  box-shadow: 0 6px 14px rgba(15, 44, 76, 0.08);
}
.hs-contact-pill.violet { color: #6049d8; }
.hs-contact-pill.teal { color: #067a74; }
.hs-contact-pill .chev { font-size: 16px; }

/* ── FAQ ────────────────────────────────────────────────── */
.hs-faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
  align-items: start;
  position: relative;
  z-index: 1;
}
.faq-item {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e2ebf5;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(15, 44, 76, 0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item:hover { box-shadow: 0 12px 26px rgba(15, 44, 76, 0.08); }
.faq-item.open {
  border-color: #bfd9ec;
  background: rgba(247, 251, 255, 0.95);
}
.faq-q {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14.5px;
  font-weight: 800;
  color: #17314a;
  line-height: 1.35;
}
.faq-num {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 13px;
  color: #067a74;
  font-weight: 800;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #eaf6f2;
  display: grid;
  place-items: center;
}
.faq-text { flex: 1; }
.faq-chev {
  color: #8fa2bc;
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.faq-item.open .faq-chev { transform: rotate(90deg); color: #067a74; }
.faq-a {
  padding: 0 20px 18px 62px;
  font-size: 13px;
  font-weight: 600;
  color: #627891;
  line-height: 1.55;
}

/* ── Status ─────────────────────────────────────────────── */
.hs-status-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e2ebf5;
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 24px rgba(15, 44, 76, 0.06);
}
.hs-status-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #eaf6f2;
  color: #067a74;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.hs-status-icon svg { width: 22px; height: 22px; }
.hs-status-content { flex: 1; min-width: 0; }
.hs-status-title {
  font-size: 15px;
  font-weight: 800;
  color: #17314a;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.hs-status-sub {
  font-size: 13px;
  font-weight: 600;
  color: #627891;
  margin-top: 3px;
}
.hs-status-arrow { color: #8fa2bc; font-size: 20px; flex-shrink: 0; }

.pill-tag {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 100px;
}
.pill-tag.live {
  background: #e2f1ea;
  color: #1f7a66;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.live-dot { width: 6px; height: 6px; background: #14c08a; border-radius: 50%; }

/* ── Footer ─────────────────────────────────────────────── */
.hs-footer {
  position: relative;
  z-index: 1;
  margin-top: 56px;
  background: linear-gradient(155deg, #1a1838 0%, #15132e 100%);
  color: #fff;
  padding: 56px 0 28px;
}
.hs-footer-grid,
.hs-footer-bottom {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 22px;
  padding-right: 22px;
}
.hs-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.hs-footer-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.hs-footer-logo {
  height: 32px; width: auto; display: block; object-fit: contain; flex-shrink: 0;
}
.hs-footer-brand strong { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.hs-footer-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.hs-footer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.hs-footer-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.hs-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.hs-footer-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.hs-footer-col button:hover { color: #2fe0bd; }
.hs-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .hs-footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 920px) {
  .hs-hero-art { display: none; }
  .hs-contact-grid { grid-template-columns: 1fr; gap: 16px; }
  .hs-faq-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .hs-body { padding: 16px 14px 0; }
  .hs-contact-art { display: none; }
  .hs-hero { padding: 26px 22px; }
  .hs-h1 { font-size: 34px; }
  .hs-online { flex-wrap: wrap; }
  .hs-chat-btn { width: 100%; justify-content: center; }
  .hs-footer-grid { grid-template-columns: 1fr; gap: 22px; }
  .hs-footer-grid, .hs-footer-bottom { padding-left: 16px; padding-right: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .hs-contact-card,
  .faq-chev,
  .hs-online-icon::after,
  .hs-art-bubble span {
    transition: none;
    animation: none;
  }
}
</style>
