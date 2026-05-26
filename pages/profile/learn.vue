<template>
  <div class="ai-page mobile-container">
    <!-- Nav bar -->
    <div class="ai-nav-bar">
      <button class="ai-nav-icon-btn" aria-label="Back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="ai-nav-title">Learn &amp; Ask AI</div>
      <button class="ai-nav-icon-btn" aria-label="Chat history" @click="navigateTo('/profile/chat')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </button>
    </div>

    <main class="ai-body">
      <div class="atm-bg atm-bg-teal" />

      <!-- Hero with breathing AI orb -->
      <div class="ai-hero">
        <div class="ai-orb" />
        <div class="ai-greeting">Hi {{ firstName || 'there' }}</div>
        <div class="ai-headline">
          Ask me <span class="ai-headline-italic">anything</span> about your property journey.
        </div>
        <div class="ai-sub">
          From legal jargon to chain timelines. I know UMU and the UK property market inside out.
        </div>
      </div>

      <!-- Input — voice button hidden until Web Speech wiring lands -->
      <form class="ai-input-wrap" @submit.prevent="askWith(question)">
        <input
          v-model="question"
          type="text"
          placeholder="Ask a question…"
          @keydown.enter.prevent="askWith(question)"
        />
        <button type="submit" class="ai-send" aria-label="Send" :disabled="!question.trim()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </form>

      <!-- Suggested prompts -->
      <div class="section-heading">Try asking</div>
      <div class="ai-prompts">
        <button
          v-for="p in prompts"
          :key="p.text"
          type="button"
          class="ai-prompt"
          @click="askWith(p.text)"
        >
          <div class="ai-prompt-icon" v-html="p.icon" />
          <div class="ai-prompt-text">{{ p.text }}</div>
          <div class="ai-prompt-arrow">›</div>
        </button>
      </div>

      <!-- Library section hidden until Articles + Video walk-throughs ship -->
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

function askWith(text: string) {
  const q = text.trim()
  if (!q) return
  navigateTo(`/profile/chat?prefill=${encodeURIComponent(q)}`)
}

const goBack = useGoBack('/profile')
</script>

<style scoped>
.ai-page {
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
  padding-bottom: 32px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ai-nav-bar {
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
.ai-nav-icon-btn {
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
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: inherit;
}
.ai-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow: 0 12px 24px rgba(19, 48, 71, 0.12);
}
.ai-nav-icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ai-nav-icon-btn svg { width: 18px; height: 18px; }
.ai-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.ai-body {
  position: relative;
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
  height: 320px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-teal {
  background: radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

.ai-hero {
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
  text-align: center;
}
.ai-orb {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.45), transparent 54%),
    radial-gradient(circle at 68% 72%, rgba(245, 196, 76, 0.48), transparent 62%),
    linear-gradient(135deg, var(--fx-aqua) 0%, var(--fx-blue) 52%, var(--fx-indigo) 100%);
  margin: 0 auto 12px;
  position: relative;
  box-shadow:
    0 12px 32px rgba(58, 87, 206, 0.28),
    inset 0 0 0 2px rgba(255, 255, 255, 0.2);
  animation: orbBreathe 4s ease-in-out infinite;
}
@keyframes orbBreathe {
  0%, 100% {
    box-shadow:
      0 12px 32px rgba(58, 87, 206, 0.28),
      inset 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow:
      0 14px 40px rgba(58, 87, 206, 0.34),
      0 0 54px rgba(61, 189, 163, 0.15),
      inset 0 0 0 2px rgba(255, 255, 255, 0.25);
  }
}
.ai-orb::before {
  content: '✨';
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 14px;
}

.ai-greeting {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
  margin-bottom: 4px;
}
.ai-headline {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  line-height: 1.06;
  letter-spacing: -0.9px;
  font-weight: 750;
  color: #10263d;
  margin-bottom: 8px;
}
.ai-headline-italic {
  font-style: italic;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-weight: 700;
  color: #067a74;
}
.ai-sub {
  font-size: 13px;
  font-weight: 600;
  color: #627891;
  line-height: 1.45;
  max-width: 460px;
  margin: 0 auto;
}

.ai-input-wrap {
  margin: 14px 0 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  transition: all 0.18s;
  position: relative;
  z-index: 1;
}
.ai-input-wrap:focus-within {
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.ai-input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #17314a;
  min-width: 0;
}
.ai-input-wrap input::placeholder {
  color: #8a95a0;
  font-weight: 500;
}

.ai-send {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  font-family: inherit;
}
.ai-send:hover { transform: translateY(-1px); }
.ai-send:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.ai-send svg { width: 14px; height: 14px; }

.section-heading {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 16px 2px 8px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-prompts {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.ai-prompt {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  text-align: left;
  font-family: inherit;
  width: 100%;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}
.ai-prompt:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.ai-prompt-icon {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ai-prompt-icon svg { width: 13px; height: 13px; }
.ai-prompt-text {
  font-size: 12.5px;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.1px;
  line-height: 1.3;
  flex: 1;
}
.ai-prompt-arrow {
  color: #8fa2bc;
  font-size: 15px;
  flex-shrink: 0;
}

.article-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 14px;
  margin: 0 0 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  z-index: 1;
}
.article-card.coming-soon { opacity: 0.7; }
.article-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.article-icon svg { width: 16px; height: 16px; }
.article-info { flex: 1; min-width: 0; }
.article-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  line-height: 1.2;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.article-meta {
  font-size: 11px;
  font-weight: 600;
  color: #7f91a8;
  margin-top: 2px;
}
.pill-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 100px;
}
.pill-tag.gold {
  background: #fdf4dc;
  color: #6f4d14;
}

@media (min-width: 768px) {
  .ai-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .ai-body {
    padding: 0 18px;
  }

  .ai-hero {
    padding: 28px 24px 24px;
  }

  .ai-headline {
    font-size: 36px;
  }
}

@media (max-width: 430px) {
  .ai-nav-title {
    font-size: 18px;
  }

  .ai-headline {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai-nav-icon-btn,
  .ai-orb,
  .ai-input-wrap,
  .ai-send,
  .ai-prompt,
  .article-card {
    transition: none;
    animation: none;
  }
}
</style>
