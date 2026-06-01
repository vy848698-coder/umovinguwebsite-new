<template>
  <div class="learn-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

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
      <button class="learn-back-btn" type="button" @click="goBack">
        <span aria-hidden="true">&larr;</span>
        Back
      </button>

      <section class="learn-hero">
        <div class="learn-hero-copy">
          <p class="learn-eyebrow">Learn and Ask AI</p>
          <h1>
            Ask <span>anything</span> about your property journey
          </h1>
          <p class="learn-sub">
            From legal jargon to chain timelines, get practical and plain-English help built for UMU users and UK home movers.
          </p>

          <div class="learn-meta-grid" aria-label="Learning highlights">
            <article>
              <strong>Personalized</strong>
              <span>Hi {{ firstName || 'there' }}, answers tailored to your path</span>
            </article>
            <article>
              <strong>Actionable</strong>
              <span>Clear next steps, not generic advice</span>
            </article>
            <article>
              <strong>Always available</strong>
              <span>Ask quick questions whenever you need clarity</span>
            </article>
          </div>

          <form class="learn-input-wrap" @submit.prevent="askWith(question)">
            <input
              v-model="question"
              type="text"
              placeholder="Ask a question..."
              @keydown.enter.prevent="askWith(question)"
            >
            <button type="submit" class="learn-send" aria-label="Send" :disabled="!question.trim()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </form>
        </div>

        <aside class="learn-hero-panel" aria-label="Popular questions">
          <div class="learn-panel-head">
            <p class="learn-panel-eyebrow">Popular right now</p>
            <h2>Start with these</h2>
          </div>
          <button
            v-for="p in prompts.slice(0, 3)"
            :key="`hero-${p.text}`"
            type="button"
            class="learn-mini-prompt"
            @click="askWith(p.text)"
          >
            <span class="learn-mini-icon" v-html="p.icon" />
            <span>{{ p.text }}</span>
          </button>
        </aside>
      </section>

      <section class="learn-prompts-section" aria-label="Suggested prompts">
        <div class="learn-section-head">
          <p>Try asking</p>
          <h3>Helpful conversation starters</h3>
        </div>

        <div class="learn-prompts-grid">
          <button
            v-for="p in prompts"
            :key="p.text"
            type="button"
            class="learn-prompt"
            @click="askWith(p.text)"
          >
            <span class="learn-prompt-icon" v-html="p.icon" />
            <span class="learn-prompt-text">{{ p.text }}</span>
            <span class="learn-prompt-arrow">></span>
          </button>
        </div>
      </section>

      <section class="learn-library-grid" aria-label="Learning resources overview">
        <article class="learn-library-panel">
          <div class="learn-section-head compact">
            <p>Learning paths</p>
            <h3>Browse by journey stage</h3>
          </div>

          <div class="learn-track-list">
            <button
              v-for="track in learningTracks"
              :key="track.title"
              type="button"
              class="learn-track-card"
              @click="askWith(track.prompt)"
            >
              <span class="learn-track-kicker">{{ track.kicker }}</span>
              <strong>{{ track.title }}</strong>
              <p>{{ track.body }}</p>
            </button>
          </div>
        </article>

        <article class="learn-library-panel learn-library-panel-soft">
          <div class="learn-section-head compact">
            <p>What UMU can help with</p>
            <h3>Fast answers for common blockers</h3>
          </div>

          <div class="learn-signal-list">
            <div v-for="item in supportAreas" :key="item.title" class="learn-signal-row">
              <span class="learn-signal-mark">{{ item.mark }}</span>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.body }}</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ title: 'Learn & Ask AI - UmovingU', middleware: 'auth' })

const { profile, fetchProfile } = useProfile()

onMounted(() => {
  if (!profile.value) fetchProfile().catch(() => null)
})

const firstName = computed(() => profile.value?.firstName ?? '')

const question = ref('')

const prompts = [
  {
    text: "What's an EICR and do I need one?",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 4 14 12 14 11 22 20 10 12 10 13 2"/></svg>',
  },
  {
    text: 'How long does conveyancing usually take?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  },
  {
    text: 'What stamp duty will I pay on a £450k home?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7c0-2-1.6-3.5-4.5-3.5S9 5 9 7c0 4 9 4 9 8 0 2-1.6 3.5-4.5 3.5S9 17 9 15"/><line x1="13.5" y1="2" x2="13.5" y2="22"/></svg>',
  },
  {
    text: 'Should I get a homebuyer survey?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></svg>',
  },
]

const learningTracks = [
  {
    kicker: 'Buying',
    title: 'Before you make an offer',
    body: 'Understand surveys, mortgage steps, and the documents worth checking early.',
    prompt: 'What should I check before making an offer on a property?',
  },
  {
    kicker: 'Selling',
    title: 'Prepare your sale properly',
    body: 'Get ahead of delays with the forms, certificates, and timeline questions buyers ask first.',
    prompt: 'How can I prepare my documents before listing my home?',
  },
  {
    kicker: 'Moving',
    title: 'Reduce last-minute friction',
    body: 'Learn what usually slows exchange, completion, and post-move admin.',
    prompt: 'What usually delays exchange and completion in the UK?',
  },
]

const supportAreas = [
  {
    mark: '01',
    title: 'Legal and conveyancing terms',
    body: 'Translate property language into plain English before you speak to a solicitor.',
  },
  {
    mark: '02',
    title: 'Costs, tax, and surveys',
    body: 'Get quick guidance on stamp duty, buyer fees, and which checks matter most.',
  },
  {
    mark: '03',
    title: 'Process and timing questions',
    body: 'Understand the likely sequence, expected wait times, and common hold-ups.',
  },
]

function askWith(text: string) {
  const q = text.trim()
  if (!q) return
  navigateTo(`/profile/chat?prefill=${encodeURIComponent(q)}`)
}

const goBack = useGoBack('/profile')
</script>

<style scoped>
.learn-page {
  --learn-aqua: #00a19a;
  --learn-blue: #2f9bdf;
  --learn-indigo: #4f4ff2;
  --learn-ink: #1f2b3f;
  --learn-border: #d8e3ee;
  min-height: 100dvh;
  color: var(--learn-ink);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 8% 11%, rgba(13, 191, 181, 0.14) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.13) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f8fbff 0%, #f0f5ff 48%, #effaf8 100%);
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

.learn-shell {
  width: min(1260px, calc(100% - 40px));
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
  background: linear-gradient(120deg, var(--learn-aqua) 0%, var(--learn-blue) 48%, var(--learn-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.learn-btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}

.learn-mobile-chat {
  border: 0;
  color: #fff;
  background: linear-gradient(120deg, var(--learn-aqua) 0%, var(--learn-blue) 48%, var(--learn-indigo) 100%);
}

.learn-main {
  padding: 22px 0 36px;
}

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
  margin-bottom: 14px;
}

.learn-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 18px;
  align-items: start;
}

.learn-hero-copy {
  border: 1px solid var(--learn-border);
  border-radius: 24px;
  padding: 24px;
  background: linear-gradient(152deg, rgba(255, 255, 255, 0.96), rgba(239, 247, 255, 0.92));
  box-shadow: 0 14px 26px rgba(36, 66, 102, 0.08);
}

.learn-eyebrow {
  margin: 0;
  color: #0f756f;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-size: 11px;
  font-weight: 800;
}

.learn-hero-copy h1 {
  margin: 8px 0 12px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.04;
  letter-spacing: -1px;
  color: #152942;
}

.learn-hero-copy h1 span {
  color: #0d7f79;
}

.learn-sub {
  margin: 0;
  max-width: 62ch;
  font-size: 15px;
  line-height: 1.6;
  color: #617690;
}

.learn-meta-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.learn-meta-grid article {
  border: 1px solid #dbe7f3;
  border-radius: 14px;
  padding: 11px;
  background: rgba(255, 255, 255, 0.9);
}

.learn-meta-grid strong {
  display: block;
  font-size: 15px;
  color: #17385d;
}

.learn-meta-grid span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #5f7594;
  line-height: 1.35;
}

.learn-input-wrap {
  margin-top: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}

.learn-input-wrap:focus-within {
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}

.learn-input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #17314a;
  min-width: 0;
}

.learn-input-wrap input::placeholder {
  color: #8a95a0;
  font-weight: 500;
}

.learn-send {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--learn-aqua) 0%, var(--learn-blue) 48%, var(--learn-indigo) 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}

.learn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.learn-send svg {
  width: 14px;
  height: 14px;
}

.learn-hero-panel {
  border: 1px solid rgba(174, 201, 231, 0.44);
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 24px rgba(17, 52, 88, 0.08);
}

.learn-panel-head {
  margin-bottom: 12px;
}

.learn-panel-eyebrow {
  margin: 0 0 4px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9c98ad;
}

.learn-panel-head h2 {
  margin: 0;
  font-size: 20px;
  line-height: 1.2;
  color: #1f2f4a;
}

.learn-mini-prompt {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #dfe8f3;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #17314a;
  cursor: pointer;
}

.learn-mini-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #eaf6f2;
  color: #067a74;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.learn-mini-icon :deep(svg) {
  width: 14px;
  height: 14px;
}

.learn-prompts-section {
  margin-top: 18px;
  border: 1px solid var(--learn-border);
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 20px rgba(17, 52, 88, 0.06);
}

.learn-section-head p {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #70839c;
}

.learn-section-head h3 {
  margin: 6px 0 0;
  font-size: 24px;
  color: #172f4c;
}

.learn-section-head.compact h3 {
  font-size: 22px;
}

.learn-prompts-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.learn-prompt {
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.learn-prompt-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #eaf6f2;
  color: #067a74;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.learn-prompt-icon :deep(svg) {
  width: 14px;
  height: 14px;
}

.learn-prompt-text {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: #17314a;
}

.learn-prompt-arrow {
  color: #8fa2bc;
  font-size: 15px;
  flex-shrink: 0;
}

.learn-library-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: 18px;
}

.learn-library-panel {
  border: 1px solid var(--learn-border);
  border-radius: 20px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 20px rgba(17, 52, 88, 0.06);
}

.learn-library-panel-soft {
  background: linear-gradient(150deg, rgba(243, 251, 255, 0.95), rgba(238, 253, 248, 0.95));
}

.learn-track-list {
  margin-top: 14px;
  display: grid;
  gap: 10px;
}

.learn-track-card {
  width: 100%;
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  padding: 16px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}

.learn-track-kicker {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f756f;
}

.learn-track-card strong {
  display: block;
  font-size: 16px;
  color: #17314a;
}

.learn-track-card p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #617690;
}

.learn-signal-list {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.learn-signal-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(174, 201, 231, 0.42);
  background: rgba(255, 255, 255, 0.78);
}

.learn-signal-mark {
  min-width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(120deg, rgba(0, 161, 154, 0.12) 0%, rgba(47, 155, 223, 0.16) 100%);
  color: #17385d;
  font-size: 12px;
  font-weight: 800;
}

.learn-signal-row strong {
  display: block;
  font-size: 15px;
  color: #17314a;
}

.learn-signal-row p {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #617690;
}

@media (max-width: 980px) {
  .learn-shell {
    width: calc(100% - 18px);
  }

  .mesh {
    display: none;
  }

  .ambient {
    opacity: 0.15;
  }

  .learn-main {
    padding-top: 14px;
  }

  .learn-hero {
    grid-template-columns: 1fr;
  }

  .learn-library-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .learn-hero-copy,
  .learn-hero-panel,
  .learn-prompts-section {
    border-radius: 16px;
    padding: 14px;
  }

  .learn-hero-copy h1 {
    font-size: 30px;
  }

  .learn-sub {
    font-size: 14px;
  }

  .learn-meta-grid,
  .learn-prompts-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .learn-input-wrap,
  .learn-send,
  .learn-prompt,
  .learn-mini-prompt {
    transition: none !important;
    animation: none !important;
  }
}
</style>
