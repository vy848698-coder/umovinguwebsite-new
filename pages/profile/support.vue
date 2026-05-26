<template>
  <div class="hs-page mobile-container">
    <!-- Nav bar -->
    <div class="hs-nav-bar">
      <button class="hs-nav-icon-btn" aria-label="Back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="hs-nav-title">Help &amp; Support</div>
      <button class="hs-nav-icon-btn" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>
    </div>

    <main class="hs-body">
      <div class="atm-bg atm-bg-coral" />

      <!-- Hero -->
      <div class="hs-hero">
        <div class="hero-greeting">We're here for you</div>
        <div class="hs-h1">How can we help?</div>
      </div>

      <!-- Live status card -->
      <div class="support-status">
        <div class="ss-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1v-7h3z" />
            <path d="M3 19a2 2 0 0 0 2 2h1v-7H3z" />
          </svg>
        </div>
        <div class="ss-info">
          <div class="ss-headline">Support team is online</div>
          <div class="ss-sub">Mon–Fri · 9am–6pm UK · usual reply under 4 hours</div>
        </div>
      </div>

      <!-- Get in touch grid -->
      <div class="section-heading">Get in touch</div>
      <div class="contact-grid">
        <button class="contact-card primary" type="button" @click="navigateTo('/profile/chat')">
          <div class="contact-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15 9 22 9 16 14 18 21 12 17 6 21 8 14 2 9 9 9 12 2" />
            </svg>
          </div>
          <div class="contact-card-name">Ask AI first</div>
          <div class="contact-card-meta">Instant answers · 24/7</div>
        </button>
        <a class="contact-card" href="mailto:help@umovingu.com">
          <div class="contact-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22 6 12 13 2 6" />
            </svg>
          </div>
          <div class="contact-card-name">Email us</div>
          <div class="contact-card-meta">help@umovingu.com</div>
        </a>
      </div>

      <!-- FAQ -->
      <div class="section-heading">
        Frequently asked
        <span class="sh-action" @click="openIdx = -2">Browse all</span>
      </div>

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

      <!-- Status -->
      <div class="section-heading">
        Status
        <span class="sh-action">All systems</span>
      </div>
      <div class="hs-status-card">
        <div class="hs-status-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
  --fx-text: #1f2b3f;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 34px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.hs-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.hs-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  font-family: inherit;
}
.hs-nav-icon-btn:hover { transform: translateY(-2px); }
.hs-nav-icon-btn svg { width: 18px; height: 18px; }
.hs-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.hs-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 14px;
}
.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-coral {
  background: radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

.hs-hero {
  margin-top: 8px;
  border-radius: 28px;
  padding: 24px 18px 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
}
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
  margin-bottom: 4px;
}
.hs-h1 {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -0.9px;
  line-height: 1.06;
}

.support-status {
  margin: 14px 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  border: 1px solid rgba(173, 201, 231, 0.48);
  border-radius: 18px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.08);
}
.ss-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.ss-icon-wrap::after {
  content: '';
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 11px;
  height: 11px;
  background: #3dbda3;
  border: 2px solid #f8fbff;
  border-radius: 50%;
  animation: ss-pulse 2s ease-in-out infinite;
}
@keyframes ss-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(61, 189, 163, 0.55); }
  50% { box-shadow: 0 0 0 7px rgba(61, 189, 163, 0); }
}
.ss-icon-wrap svg { width: 16px; height: 16px; color: #067a74; }
.ss-info { flex: 1; min-width: 0; }
.ss-headline {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
}
.ss-sub {
  font-size: 12px;
  font-weight: 600;
  color: #627891;
  margin-top: 1px;
}

.section-heading {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 10px 4px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sh-action {
  margin-left: auto;
  font-size: 12px;
  font-weight: 800;
  color: #067a74;
  text-transform: none;
  cursor: pointer;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}
.contact-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  text-decoration: none;
  color: inherit;
  display: block;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.contact-card:hover { transform: translateY(-2px); }
.contact-card.primary {
  background: linear-gradient(135deg, rgba(240, 237, 255, 0.96), rgba(227, 219, 255, 0.94));
  border-color: rgba(131, 111, 220, 0.24);
}
.contact-card-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.contact-card.primary .contact-card-icon {
  background: linear-gradient(135deg, #7c72f5, #5875ea);
  color: #fff;
}
.contact-card-icon svg { width: 15px; height: 15px; }
.contact-card-name {
  font-size: 13px;
  font-weight: 800;
  color: #17314a;
  margin-bottom: 1px;
}
.contact-card-meta {
  font-size: 11px;
  font-weight: 600;
  color: #627891;
  line-height: 1.3;
}

.faq-item {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 14px;
  margin: 0 0 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.faq-item.open {
  border-color: #bfd9ec;
  background: rgba(245, 250, 255, 0.9);
}
.faq-q {
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 800;
  color: #17314a;
  line-height: 1.3;
}
.faq-num {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 12px;
  color: #067a74;
  font-weight: 700;
  flex-shrink: 0;
  width: 20px;
}
.faq-text { flex: 1; }
.faq-chev {
  color: #8fa2bc;
  font-size: 14px;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.faq-item.open .faq-chev {
  transform: rotate(90deg);
  color: #067a74;
}
.faq-a {
  padding: 0 14px 13px 36px;
  font-size: 12px;
  font-weight: 600;
  color: #627891;
  line-height: 1.5;
}

.hs-status-card {
  margin: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.hs-status-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hs-status-icon svg { width: 16px; height: 16px; }
.hs-status-content { flex: 1; min-width: 0; }
.hs-status-title {
  font-size: 13px;
  font-weight: 800;
  color: #17314a;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.hs-status-sub {
  font-size: 11.5px;
  font-weight: 600;
  color: #627891;
  margin-top: 1px;
}
.hs-status-arrow { color: #8fa2bc; font-size: 18px; flex-shrink: 0; }

.pill-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 100px;
}
.pill-tag.live {
  background: #e2f1ea;
  color: #1f7a66;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.live-dot {
  width: 6px;
  height: 6px;
  background: #3dbda3;
  border-radius: 50%;
}

@media (min-width: 768px) {
  .hs-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .hs-body {
    padding: 0 18px;
  }

  .hs-hero {
    padding: 28px 24px 24px;
  }

  .hs-h1 {
    font-size: 36px;
  }
}

@media (max-width: 430px) {
  .hs-nav-title {
    font-size: 18px;
  }

  .hs-h1 {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hs-nav-icon-btn,
  .contact-card,
  .faq-chev {
    transition: none;
    animation: none;
  }
}
</style>
