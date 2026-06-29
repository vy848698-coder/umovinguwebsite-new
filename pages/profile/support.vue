<template>
  <div class="hs-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <WebTopNav>
      <template #actions>
        <button class="hs-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="hs-quick-btn solid" type="button" @click="navigateTo('/profile/settings')">Settings</button>
      </template>
    </WebTopNav>

    <main class="hs-body">
      <button class="hs-back-btn" type="button" @click="goBack">
        <span aria-hidden="true">&larr;</span>
        Back
      </button>

      <!-- Hero -->
      <section class="hs-hero">
        <div class="hs-hero-copy">
          <div class="hero-greeting">We're here for you</div>
          <h1 class="hs-h1">How can we help?</h1>
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
        </button>

        <a class="hs-contact-card teal" href="mailto:help@umovingu.com">
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
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Help & Support - UmovingU', middleware: 'auth' })

const openIdx = ref<number>(0)

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

const goBack = useGoBack('/profile')
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
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 48px;
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

.hs-back-btn {
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
  margin-bottom: 18px;
}

/* ── Hero ───────────────────────────────────────────────── */
.hs-hero {
  position: relative;
  border-radius: 28px;
  padding: 38px 40px;
  border: 1px solid rgba(173, 201, 231, 0.5);
  background:
    radial-gradient(circle at 88% 14%, rgba(0, 161, 154, 0.1) 0%, rgba(0, 161, 154, 0) 42%),
    linear-gradient(150deg, rgba(232, 248, 244, 0.95) 0%, rgba(238, 244, 255, 0.95) 55%, rgba(238, 236, 255, 0.95) 100%);
  box-shadow:
    0 18px 48px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  overflow: hidden;
  margin-bottom: 28px;
}
.hs-hero-copy { position: relative; z-index: 2; max-width: 640px; }
.hero-greeting {
  font-size: 12px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: var(--fx-aqua);
  font-weight: 800;
  margin-bottom: 8px;
}
.hs-h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 46px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -1.3px;
  line-height: 1.02;
}
.hs-hero-sub {
  font-size: 15px;
  font-weight: 600;
  color: #5b6f88;
  margin-top: 12px;
}

.hs-online {
  margin-top: 26px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.07);
  max-width: 720px;
}
.hs-online-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eaf6f2;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  position: relative;
  color: #067a74;
}
.hs-online-icon::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: #14c08a;
  border: 2px solid #fff;
  border-radius: 50%;
  animation: ss-pulse 2s ease-in-out infinite;
}
@keyframes ss-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(20, 192, 138, 0.5); }
  50% { box-shadow: 0 0 0 7px rgba(20, 192, 138, 0); }
}
.hs-online-icon svg { width: 20px; height: 20px; }
.hs-online-info { flex: 1; min-width: 0; }
.hs-online-headline { font-size: 15px; font-weight: 800; color: #17314a; }
.hs-online-sub { font-size: 12.5px; font-weight: 600; color: #627891; margin-top: 2px; }
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
  inset: 10%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(220, 245, 240, 0) 70%);
}
.hs-art-headset {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: linear-gradient(150deg, #ffffff 0%, #eafaf5 100%);
  color: var(--fx-aqua);
  display: grid;
  place-items: center;
  box-shadow: 0 18px 40px rgba(0, 150, 130, 0.18);
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
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid transparent;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s;
}
.hs-contact-card:hover { transform: translateY(-3px); }
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

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 920px) {
  .hs-hero-art { display: none; }
  .hs-contact-grid { grid-template-columns: 1fr; gap: 16px; }
  .hs-faq-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .hs-body { padding: 16px 14px 0; }
  .hs-hero { padding: 26px 22px; }
  .hs-h1 { font-size: 34px; }
  .hs-online { flex-wrap: wrap; }
  .hs-chat-btn { width: 100%; justify-content: center; }
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
