<template>
  <div class="learn-page">

    <WebTopNav>
      <template #actions>
        <button class="learn-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="learn-btn solid" type="button" @click="navigateTo('/profile/chat')">Chat History</button>
      </template>
      <template #mobile-extra="{ closeMenu }">
        <button type="button" class="learn-mobile-chat" @click="closeMenu(); navigateTo('/profile/chat')">Chat History</button>
      </template>
    </WebTopNav>

    <main class="learn-shell learn-main">
      <!-- ── Hero ─────────────────────────────────────────── -->
      <section class="learn-hero">
        <div class="learn-hero-copy">
          <span class="learn-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>
            LEARN &amp; ASK AI
          </span>
          <h1>Ask anything about your <span>property</span> journey</h1>
          <p class="learn-sub">
            Get instant, plain-English answers about surveys, conveyancing, mortgages, costs and more.
          </p>

          <div class="learn-feature-pills">
            <span class="learn-feature-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>Personalized</span>
            <span class="learn-feature-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Instant answers</span>
            <span class="learn-feature-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Available 24/7</span>
            <span class="learn-feature-pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/></svg>Secure &amp; private</span>
          </div>

          <form class="learn-search" @submit.prevent="askWith(question)">
            <div class="learn-search-top">
              <span class="learn-search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
              </span>
              <input
                v-model="question"
                type="text"
                placeholder="Ask a question about property..."
                @keydown.enter.prevent="askWith(question)"
              >
              <button type="submit" class="learn-send" aria-label="Send" :disabled="!question.trim()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
            <div class="learn-search-actions">
              <button type="button" class="learn-search-chip" @click="askWith(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg>
                Voice search
              </button>
              <button type="button" class="learn-search-chip" @click="askWith(question)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m7 7 2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/></svg>
                AI Generate
              </button>
            </div>
          </form>
        </div>

        <aside class="learn-hero-art" aria-hidden="true">
          <div class="learn-art-glow" />
          <div class="learn-orbit" />
          <div class="learn-orbit learn-orbit-2" />

          <span class="learn-spark learn-spark-1">✦</span>
          <span class="learn-spark learn-spark-2">✦</span>
          <span class="learn-spark learn-spark-3">✧</span>
          <span class="learn-dot learn-dot-1" />
          <span class="learn-dot learn-dot-2" />

          <div class="learn-float learn-float-house">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/></svg>
          </div>
          <div class="learn-float learn-float-doc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          </div>
          <div class="learn-float learn-float-bubble">
            How do I calculate stamp duty?
            <span class="learn-wave"><span /><span /><span /><span /></span>
          </div>

          <div class="learn-bot">
            <span class="learn-bot-shadow" />
            <svg class="learn-bot-svg" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="botBody" x1="40" y1="40" x2="170" y2="200" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#ffffff"/>
                  <stop offset="1" stop-color="#e7f4ff"/>
                </linearGradient>
                <linearGradient id="botAccent" x1="60" y1="70" x2="150" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#19c6b6"/>
                  <stop offset="1" stop-color="#0a8f86"/>
                </linearGradient>
                <radialGradient id="botEye" cx="0.4" cy="0.35" r="0.7">
                  <stop stop-color="#5cf0df"/>
                  <stop offset="1" stop-color="#0a8f86"/>
                </radialGradient>
              </defs>

              <!-- antenna -->
              <line x1="100" y1="40" x2="100" y2="22" stroke="#19c6b6" stroke-width="5" stroke-linecap="round"/>
              <circle cx="100" cy="17" r="7" fill="url(#botAccent)"/>

              <!-- headphones band -->
              <path d="M52 92a48 48 0 0 1 96 0" stroke="#19c6b6" stroke-width="7" stroke-linecap="round" fill="none"/>

              <!-- head -->
              <rect x="48" y="58" width="104" height="80" rx="30" fill="url(#botBody)" stroke="#dbeafe" stroke-width="2"/>
              <!-- face screen -->
              <rect x="64" y="74" width="72" height="48" rx="20" fill="#10303f"/>
              <ellipse cx="86" cy="98" rx="9" ry="11" fill="url(#botEye)"/>
              <ellipse cx="114" cy="98" rx="9" ry="11" fill="url(#botEye)"/>
              <path d="M88 112q12 9 24 0" stroke="#5cf0df" stroke-width="4" stroke-linecap="round" fill="none"/>

              <!-- ear cups -->
              <rect x="38" y="84" width="20" height="30" rx="9" fill="url(#botAccent)"/>
              <rect x="142" y="84" width="20" height="30" rx="9" fill="url(#botAccent)"/>

              <!-- body -->
              <rect x="62" y="138" width="76" height="58" rx="26" fill="url(#botBody)" stroke="#dbeafe" stroke-width="2"/>
              <circle cx="100" cy="166" r="11" fill="url(#botAccent)" opacity="0.9"/>
              <circle cx="100" cy="166" r="4.5" fill="#fff"/>

              <!-- waving arm -->
              <g class="learn-bot-arm">
                <rect x="138" y="146" width="34" height="13" rx="6.5" fill="url(#botBody)" stroke="#dbeafe" stroke-width="2"/>
                <circle cx="176" cy="152" r="9" fill="url(#botAccent)"/>
              </g>
              <!-- left arm -->
              <rect x="40" y="150" width="26" height="13" rx="6.5" fill="url(#botBody)" stroke="#dbeafe" stroke-width="2"/>
            </svg>
          </div>
        </aside>
      </section>

      <!-- ── Trending questions ───────────────────────────── -->
      <section class="learn-block">
        <div class="learn-block-head">
          <h2><span class="learn-fire">🔥</span> Trending questions</h2>
          <button type="button" class="learn-link" @click="askWith('Show me trending property questions')">View all questions →</button>
        </div>
        <div class="learn-trending-grid">
          <button
            v-for="t in trending"
            :key="t.title"
            type="button"
            class="learn-trend-card"
            @click="askWith(t.prompt)"
          >
            <span class="learn-trend-icon" :class="t.tone" v-html="t.icon" />
            <strong>{{ t.title }}</strong>
            <p>{{ t.body }}</p>
            <span class="learn-trend-arrow">→</span>
          </button>
        </div>
      </section>

      <!-- ── Learning paths + Why ─────────────────────────── -->
      <section class="learn-two-col">
        <div class="learn-paths">
          <div class="learn-col-head">
            <h2>Learning paths</h2>
            <p>Follow each stage of your property journey</p>
          </div>
          <div class="learn-paths-grid">
            <article
              v-for="path in learningPaths"
              :key="path.title"
              class="learn-path-card"
              :class="path.tone"
            >
              <span class="learn-path-icon" v-html="path.icon" />
              <h3>{{ path.title }}</h3>
              <ul class="learn-path-steps">
                <li v-for="step in path.steps" :key="step">{{ step }}</li>
              </ul>
              <button type="button" class="learn-path-cta" @click="askWith(path.prompt)">
                {{ path.cta }} →
              </button>
            </article>
          </div>
        </div>

        <aside class="learn-why">
          <div class="learn-col-head">
            <h2>Why use MoveCompanion AI?</h2>
            <p>Built to make your journey simpler</p>
          </div>
          <div class="learn-why-list">
            <div v-for="item in whyItems" :key="item.title" class="learn-why-row">
              <span class="learn-why-icon" :class="item.tone" v-html="item.icon" />
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.body }}</p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <!-- ── Continue conversations ───────────────────────── -->
      <section class="learn-block">
        <div class="learn-block-head">
          <h2 class="plain">Continue your conversations</h2>
          <button type="button" class="learn-link" @click="navigateTo('/profile/chat')">View all →</button>
        </div>
        <div class="learn-recent-grid">
          <button
            v-for="r in recentConversations"
            :key="r.title"
            type="button"
            class="learn-recent-card"
            @click="askWith(r.prompt)"
          >
            <span class="learn-recent-icon" :class="r.tone" v-html="r.icon" />
            <strong>{{ r.title }}</strong>
            <span class="learn-recent-time">{{ r.time }}</span>
          </button>
        </div>
      </section>

      <!-- ── CTA banner ───────────────────────────────────── -->
      <section class="learn-cta">
        <div class="learn-cta-shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div class="learn-cta-copy">
          <strong>Not sure what to ask?</strong>
          <p>Try one of our popular questions or start a conversation.</p>
        </div>
        <button type="button" class="learn-cta-btn" @click="navigateTo('/profile/chat')">
          Ask a new question →
        </button>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
definePageMeta({ title: 'Learn & Ask AI - UmovingU', middleware: 'auth' })

const { profile, fetchProfile } = useProfile()

onMounted(() => {
  if (!profile.value) fetchProfile().catch(() => null)
})

const firstName = computed(() => profile.value?.firstName ?? '')

const question = ref('')

const trending = [
  {
    title: 'What is an EICR?',
    body: 'Understand electrical safety reports for your property.',
    tone: 'green',
    prompt: "What's an EICR and do I need one?",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></svg>',
  },
  {
    title: 'How long does conveyancing take?',
    body: 'Typical timelines and what can affect the process.',
    tone: 'violet',
    prompt: 'How long does conveyancing usually take?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  },
  {
    title: 'What stamp duty will I pay on a £450k home?',
    body: 'Calculate your stamp duty based on property price.',
    tone: 'green',
    prompt: 'What stamp duty will I pay on a £450k home?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7c0-2-1.6-3.5-4.5-3.5S9 5 9 7c0 4 9 4 9 8 0 2-1.6 3.5-4.5 3.5S9 17 9 15"/><line x1="13.5" y1="2" x2="13.5" y2="22"/></svg>',
  },
  {
    title: 'Should I get a homebuyer survey?',
    body: 'Types of surveys and which one is right for you.',
    tone: 'blue',
    prompt: 'Should I get a homebuyer survey?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>',
  },
]

const learningPaths = [
  {
    title: 'Buying a property',
    tone: 'green',
    cta: 'Explore buying guide',
    prompt: 'Guide me through buying a property step by step',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/></svg>',
    steps: ['Before you make an offer', 'Surveys and checks', 'Mortgage and costs', 'Exchange & completion'],
  },
  {
    title: 'Selling a property',
    tone: 'amber',
    cta: 'Explore selling guide',
    prompt: 'Guide me through selling a property step by step',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10z"/><circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>',
    steps: ['Prepare your home', 'Documents & certificates', 'Marketing & offers', 'Exchange & completion'],
  },
  {
    title: 'Moving home',
    tone: 'blue',
    cta: 'Explore moving guide',
    prompt: 'Guide me through moving home step by step',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h13v13H1z"/><path d="M14 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/></svg>',
    steps: ['Organise your move', 'Utilities & council tax', 'Change of address', 'Settling in'],
  },
]

const whyItems = [
  {
    title: 'Instant answers',
    body: 'Get clear, plain-English answers in seconds.',
    tone: 'blue',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  },
  {
    title: 'Property knowledge',
    body: 'Trained on trusted UK property guidance and regulations.',
    tone: 'violet',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z"/></svg>',
  },
  {
    title: 'Secure & private',
    body: 'Your conversations are encrypted and never shared.',
    tone: 'green',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  },
  {
    title: 'Up-to-date guidance',
    body: 'Always using the latest rules and information.',
    tone: 'blue',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
  },
  {
    title: 'End-to-end support',
    body: "From first steps to moving day, we're here all the way.",
    tone: 'pink',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  },
  {
    title: 'Personalised for you',
    body: 'Tailored to your situation and property goals.',
    tone: 'teal',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>',
  },
]

const recentConversations = [
  {
    title: 'Stamp duty on £450k property',
    time: '2 mins ago',
    tone: 'green',
    prompt: 'What stamp duty will I pay on a £450k home?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7c0-2-1.6-3.5-4.5-3.5S9 5 9 7c0 4 9 4 9 8 0 2-1.6 3.5-4.5 3.5S9 17 9 15"/><line x1="13.5" y1="2" x2="13.5" y2="22"/></svg>',
  },
  {
    title: 'EICR certificate requirements',
    time: '1 hour ago',
    tone: 'violet',
    prompt: "What's an EICR and do I need one?",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  },
  {
    title: 'Conveyancing timeline',
    time: 'Yesterday',
    tone: 'blue',
    prompt: 'How long does conveyancing usually take?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  },
  {
    title: 'Homebuyer survey recommendation',
    time: '2 days ago',
    tone: 'amber',
    prompt: 'Should I get a homebuyer survey?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>',
  },
]

function askWith(text: string) {
  const q = text.trim()
  if (!q) return
  navigateTo(`/profile/chat?prefill=${encodeURIComponent(q)}`)
}
</script>

<style scoped>
.learn-page {
  --learn-aqua: #00a19a;
  --learn-blue: #2f9bdf;
  --learn-indigo: #4f4ff2;
  --learn-violet: #6c5ce7;
  --learn-ink: #1f2b3f;
  --learn-border: #d8e3ee;
  min-height: 100dvh;
  color: var(--learn-ink);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f3f2ef;
  position: relative;
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
  opacity: 0.18;
}
.ambient-a { width: 260px; height: 260px; top: 340px; left: -80px; background: rgba(0, 161, 154, 0.3); }
.ambient-b { width: 280px; height: 280px; top: 380px; right: -100px; background: rgba(47, 191, 182, 0.26); }

.learn-shell {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.learn-btn {
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}
.learn-btn.solid {
  color: #fff;
  background: #00a19a;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
}
.learn-btn.solid:hover { background: #00857f; }
.learn-btn.ghost { background: #fff; color: #231d45; border-color: #e7e2d6; }
.learn-mobile-chat {
  border: 0;
  color: #fff;
  background: #00a19a;
}

.learn-main { padding: 22px 0 40px; }

.learn-back-btn {
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
  margin-bottom: 16px;
}

/* ── Hero ───────────────────────────────────────────────── */
.learn-hero {
  position: relative;
  border: 1px solid rgba(173, 201, 231, 0.5);
  border-radius: 28px;
  padding: 40px 44px;
  background:
    radial-gradient(circle at 80% 30%, rgba(112, 92, 240, 0.1) 0%, rgba(112, 92, 240, 0) 45%),
    linear-gradient(150deg, rgba(232, 248, 244, 0.95) 0%, rgba(238, 244, 255, 0.95) 55%, rgba(240, 236, 255, 0.95) 100%);
  box-shadow: 0 18px 48px rgba(18, 55, 88, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.95);
  overflow: hidden;
  margin-bottom: 26px;
}
.learn-hero-copy { position: relative; z-index: 2; max-width: 600px; }
.learn-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(0, 161, 154, 0.12);
  color: #067a74;
  border-radius: 100px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}
.learn-pill svg { width: 14px; height: 14px; }
.learn-hero-copy h1 {
  margin: 16px 0 12px;
  font-size: clamp(32px, 4.4vw, 46px);
  line-height: 1.06;
  letter-spacing: -1.2px;
  color: #152942;
  font-weight: 750;
}
.learn-hero-copy h1 span { color: var(--learn-aqua); }
.learn-sub {
  margin: 0;
  max-width: 48ch;
  font-size: 16px;
  line-height: 1.6;
  color: #5b6f88;
  font-weight: 500;
}

.learn-feature-pills {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.learn-feature-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(173, 201, 231, 0.5);
  border-radius: 100px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #2d4a63;
}
.learn-feature-pill svg { width: 15px; height: 15px; color: var(--learn-aqua); }

.learn-search {
  margin-top: 24px;
  max-width: 620px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #dfe8f3;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 16px 32px rgba(19, 51, 82, 0.08);
}
.learn-search:focus-within { border-color: #b9d5ea; }
.learn-search-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.learn-search-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f0f5fb;
  color: #51698a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.learn-search-icon svg { width: 18px; height: 18px; }
.learn-search-top input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  color: #17314a;
  min-width: 0;
}
.learn-search-top input::placeholder { color: #97a4b5; }
.learn-send {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(120deg, #0fae7e 0%, var(--learn-aqua) 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 12px 22px rgba(0, 150, 130, 0.28);
}
.learn-send:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.learn-send svg { width: 19px; height: 19px; }
.learn-search-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}
.learn-search-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #dfe8f3;
  background: #fff;
  border-radius: 100px;
  padding: 9px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #2d4a63;
  cursor: pointer;
}
.learn-search-chip:hover { border-color: #bfd9ec; }
.learn-search-chip svg { width: 15px; height: 15px; color: #51698a; }

/* hero art */
.learn-hero-art {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 46%;
  z-index: 1;
}
.learn-art-glow {
  position: absolute;
  top: 50%;
  right: 22%;
  width: 340px;
  height: 340px;
  transform: translateY(-50%);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(0, 161, 154, 0.18) 0%, rgba(0, 161, 154, 0) 60%),
    radial-gradient(circle at 60% 40%, rgba(112, 92, 240, 0.16) 0%, rgba(112, 92, 240, 0) 62%);
  filter: blur(6px);
}

/* orbit rings behind the bot */
.learn-orbit {
  position: absolute;
  top: 50%;
  right: 30%;
  width: 230px;
  height: 230px;
  transform: translateY(-50%);
  border-radius: 50%;
  border: 1.5px dashed rgba(0, 161, 154, 0.28);
  animation: learn-spin 26s linear infinite;
}
.learn-orbit-2 {
  width: 300px;
  height: 300px;
  right: 26.5%;
  border-color: rgba(112, 92, 240, 0.18);
  border-style: solid;
  animation-duration: 40s;
  animation-direction: reverse;
}
@keyframes learn-spin {
  from { transform: translateY(-50%) rotate(0deg); }
  to { transform: translateY(-50%) rotate(360deg); }
}

/* sparkles + dots */
.learn-spark {
  position: absolute;
  color: #19c6b6;
  animation: learn-twinkle 2.6s ease-in-out infinite;
}
.learn-spark-1 { top: 26%; right: 20%; font-size: 20px; color: #7aa7ff; }
.learn-spark-2 { top: 60%; right: 46%; font-size: 14px; animation-delay: 0.6s; }
.learn-spark-3 { bottom: 22%; right: 28%; font-size: 22px; color: #9b8cff; animation-delay: 1.1s; }
@keyframes learn-twinkle {
  0%, 100% { opacity: 0.35; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.15); }
}
.learn-dot {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--learn-aqua), var(--learn-blue));
  opacity: 0.55;
}
.learn-dot-1 { width: 9px; height: 9px; top: 40%; right: 16%; }
.learn-dot-2 { width: 6px; height: 6px; bottom: 34%; right: 50%; background: var(--learn-violet); }

/* the robot */
.learn-bot {
  position: absolute;
  top: 50%;
  right: 26%;
  transform: translateY(-50%);
  width: 184px;
  z-index: 2;
  animation: learn-bob 4.5s ease-in-out infinite;
}
.learn-bot-svg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 26px 36px rgba(20, 110, 130, 0.22));
}
.learn-bot-shadow {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  width: 96px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(20, 90, 120, 0.22) 0%, rgba(20, 90, 120, 0) 70%);
  animation: learn-shadow 4.5s ease-in-out infinite;
}
@keyframes learn-bob {
  0%, 100% { transform: translateY(-50%); }
  50% { transform: translateY(calc(-50% - 12px)); }
}
@keyframes learn-shadow {
  0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateX(-50%) scale(0.82); }
}
.learn-bot-arm {
  transform-origin: 150px 152px;
  animation: learn-wave-arm 2.4s ease-in-out infinite;
}
@keyframes learn-wave-arm {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-18deg); }
  60% { transform: rotate(8deg); }
}

/* floating cards */
.learn-float {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  box-shadow: 0 16px 34px rgba(18, 55, 88, 0.14);
  display: grid;
  place-items: center;
  z-index: 3;
}
.learn-float-house {
  width: 58px; height: 58px;
  top: 24%; right: 52%;
  color: var(--learn-blue);
  animation: learn-float-a 5s ease-in-out infinite;
}
.learn-float-house svg { width: 27px; height: 27px; }
.learn-float-doc {
  width: 54px; height: 54px;
  bottom: 18%; right: 10%;
  color: var(--learn-blue);
  animation: learn-float-b 5.6s ease-in-out infinite;
}
.learn-float-doc svg { width: 25px; height: 25px; }
.learn-float-bubble {
  top: 10%; right: 6%;
  padding: 13px 15px;
  max-width: 162px;
  font-size: 13px;
  font-weight: 700;
  color: #2d4a63;
  line-height: 1.35;
  border-radius: 18px 18px 18px 5px;
  animation: learn-float-a 6s ease-in-out infinite;
}
@keyframes learn-float-a {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes learn-float-b {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(9px); }
}
.learn-wave {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 14px;
  margin-top: 7px;
}
.learn-wave span {
  width: 3px;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--learn-aqua), var(--learn-blue));
  animation: learn-eq 1.1s ease-in-out infinite;
}
.learn-wave span:nth-child(1) { height: 6px; }
.learn-wave span:nth-child(2) { height: 12px; animation-delay: 0.15s; }
.learn-wave span:nth-child(3) { height: 8px; animation-delay: 0.3s; }
.learn-wave span:nth-child(4) { height: 11px; animation-delay: 0.45s; }
@keyframes learn-eq { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }

/* ── Generic block ──────────────────────────────────────── */
.learn-block { margin-bottom: 26px; }
.learn-block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.learn-block-head h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #172f4c;
  letter-spacing: -0.4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.learn-fire { font-size: 18px; }
.learn-link {
  border: none;
  background: transparent;
  color: var(--learn-aqua);
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.learn-link:hover { text-decoration: underline; }

/* ── Trending ───────────────────────────────────────────── */
.learn-trending-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.learn-trend-card {
  position: relative;
  border: 1px solid var(--learn-border);
  border-radius: 20px;
  padding: 20px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 10px 24px rgba(15, 44, 76, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.learn-trend-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px rgba(15, 44, 76, 0.1); }
.learn-trend-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}
.learn-trend-icon :deep(svg) { width: 21px; height: 21px; }
.learn-trend-icon.green { background: rgba(20, 192, 138, 0.12); color: #14a36e; }
.learn-trend-icon.violet { background: rgba(112, 92, 240, 0.12); color: var(--learn-violet); }
.learn-trend-icon.blue { background: rgba(47, 155, 223, 0.12); color: var(--learn-blue); }
.learn-trend-card strong {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
  line-height: 1.25;
}
.learn-trend-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #627891;
  padding-right: 24px;
}
.learn-trend-arrow {
  position: absolute;
  right: 18px;
  bottom: 18px;
  color: #9fb1c8;
  font-size: 18px;
  font-weight: 600;
}

/* ── Two column ─────────────────────────────────────────── */
.learn-two-col {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: 26px;
  margin-bottom: 26px;
}
.learn-col-head { margin-bottom: 16px; }
.learn-col-head h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #172f4c;
  letter-spacing: -0.4px;
}
.learn-col-head p {
  margin: 4px 0 0;
  font-size: 13.5px;
  color: #627891;
  font-weight: 500;
}

.learn-paths-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.learn-path-card {
  border: 1px solid var(--learn-border);
  border-radius: 20px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(15, 44, 76, 0.06);
}
.learn-path-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}
.learn-path-icon :deep(svg) { width: 22px; height: 22px; }
.learn-path-card.green .learn-path-icon { background: rgba(20, 192, 138, 0.12); color: #14a36e; }
.learn-path-card.amber .learn-path-icon { background: rgba(243, 156, 18, 0.14); color: #e08a0b; }
.learn-path-card.blue .learn-path-icon { background: rgba(47, 155, 223, 0.12); color: var(--learn-blue); }
.learn-path-card h3 {
  margin: 0 0 14px;
  font-size: 17px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
}
.learn-path-steps {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  position: relative;
}
.learn-path-steps li {
  position: relative;
  padding: 0 0 14px 22px;
  font-size: 13.5px;
  font-weight: 600;
  color: #3f5670;
  line-height: 1.3;
}
.learn-path-steps li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2.5px solid currentColor;
}
.learn-path-steps li::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 16px;
  bottom: 2px;
  width: 2px;
  background: #e1e9f2;
}
.learn-path-steps li:last-child { padding-bottom: 0; }
.learn-path-steps li:last-child::after { display: none; }
.learn-path-card.green .learn-path-steps li::before { border-color: #14a36e; }
.learn-path-card.amber .learn-path-steps li::before { border-color: #e08a0b; }
.learn-path-card.blue .learn-path-steps li::before { border-color: #2f8fd0; }
.learn-path-cta {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  padding: 0;
}
.learn-path-card.green .learn-path-cta { color: #14a36e; }
.learn-path-card.amber .learn-path-cta { color: #e08a0b; }
.learn-path-card.blue .learn-path-cta { color: var(--learn-blue); }

/* ── Why list ───────────────────────────────────────────── */
.learn-why-list {
  display: grid;
  gap: 12px;
}
.learn-why-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border: 1px solid var(--learn-border);
  border-radius: 16px;
  padding: 14px 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(15, 44, 76, 0.05);
}
.learn-why-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.learn-why-icon :deep(svg) { width: 20px; height: 20px; }
.learn-why-icon.blue { background: rgba(47, 155, 223, 0.12); color: var(--learn-blue); }
.learn-why-icon.violet { background: rgba(112, 92, 240, 0.12); color: var(--learn-violet); }
.learn-why-icon.green { background: rgba(20, 192, 138, 0.12); color: #14a36e; }
.learn-why-icon.pink { background: rgba(236, 72, 130, 0.12); color: #e1547f; }
.learn-why-icon.teal { background: rgba(0, 161, 154, 0.12); color: var(--learn-aqua); }
.learn-why-row strong {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #17314a;
}
.learn-why-row p {
  margin: 3px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: #627891;
}

/* ── Recent ─────────────────────────────────────────────── */
.learn-block-head h2.plain { gap: 0; }
.learn-recent-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.learn-recent-card {
  border: 1px solid var(--learn-border);
  border-radius: 18px;
  padding: 18px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 8px 20px rgba(15, 44, 76, 0.05);
  transition: transform 0.2s;
}
.learn-recent-card:hover { transform: translateY(-2px); }
.learn-recent-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  margin-bottom: 12px;
}
.learn-recent-icon :deep(svg) { width: 18px; height: 18px; }
.learn-recent-icon.green { background: rgba(20, 192, 138, 0.12); color: #14a36e; }
.learn-recent-icon.violet { background: rgba(112, 92, 240, 0.12); color: var(--learn-violet); }
.learn-recent-icon.blue { background: rgba(47, 155, 223, 0.12); color: var(--learn-blue); }
.learn-recent-icon.amber { background: rgba(243, 156, 18, 0.14); color: #e08a0b; }
.learn-recent-card strong {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
  line-height: 1.3;
}
.learn-recent-time {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #8294aa;
}

/* ── CTA ────────────────────────────────────────────────── */
.learn-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 26px 30px;
  background: #231d45;
  box-shadow: 0 14px 32px rgba(35, 29, 69, 0.22);
}
.learn-cta-shield {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: linear-gradient(150deg, #0fae7e 0%, var(--learn-aqua) 100%);
  color: #fff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 12px 24px rgba(0, 150, 130, 0.26);
}
.learn-cta-shield svg { width: 28px; height: 28px; }
.learn-cta-copy { flex: 1; min-width: 0; }
.learn-cta-copy strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}
.learn-cta-copy p {
  margin: 4px 0 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.62);
  font-weight: 500;
}
.learn-cta-btn {
  border: none;
  border-radius: 14px;
  background: linear-gradient(120deg, #0fae7e 0%, var(--learn-aqua) 100%);
  color: #fff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  padding: 13px 22px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 12px 24px rgba(0, 150, 130, 0.26);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 1040px) {
  .learn-trending-grid { grid-template-columns: repeat(2, 1fr); }
  .learn-recent-grid { grid-template-columns: repeat(2, 1fr); }
  .learn-two-col { grid-template-columns: 1fr; }
}

@media (max-width: 980px) {
  .learn-shell { width: calc(100% - 18px); }
  .mesh { display: none; }
  .ambient { opacity: 0.15; }
  .learn-hero-art { display: none; }
  .learn-hero-copy { max-width: none; }
  .learn-paths-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .learn-hero { padding: 26px 22px; border-radius: 20px; }
  .learn-hero-copy h1 { font-size: 32px; }
  .learn-trending-grid,
  .learn-recent-grid { grid-template-columns: 1fr; }
  .learn-cta { flex-direction: column; align-items: flex-start; }
  .learn-cta-btn { width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .learn-trend-card,
  .learn-recent-card,
  .learn-wave span,
  .learn-orbit,
  .learn-spark,
  .learn-bot,
  .learn-bot-shadow,
  .learn-bot-arm,
  .learn-float {
    transition: none !important;
    animation: none !important;
  }
}
</style>
