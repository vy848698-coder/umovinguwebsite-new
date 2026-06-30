<template>
  <div class="chat-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <WebTopNav :include-chat-in-learn="true">
      <template #actions>
        <button class="chat-btn ghost" type="button" @click="navigateTo('/profile/learn')">Back to Learn</button>
        <button class="chat-btn solid" type="button" @click="clearChat">Clear Chat</button>
      </template>
      <template #mobile-extra="{ closeMenu }">
        <button type="button" class="chat-mobile-clear" @click="closeMenu(); clearChat()">Clear Chat</button>
      </template>
    </WebTopNav>

    <main class="chat-shell chat-main">
      <section class="chat-layout">
        <aside class="chat-intro-panel">
          <p class="chat-eyebrow">MoveCompanion</p>
          <h1>Property help in a clearer web workspace</h1>
          <p class="chat-sub">
            Get practical answers on surveys, conveyancing, offers, timelines and documents — without losing track of the conversation.
          </p>

          <div class="chat-intro-meta">
            <article class="chat-meta-row">
              <span class="chat-meta-icon teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </span>
              <div class="chat-meta-body">
                <strong>Guided</strong>
                <span>Answers framed for real property decisions</span>
              </div>
              <span class="chat-meta-chev">›</span>
            </article>
            <article class="chat-meta-row">
              <span class="chat-meta-icon violet">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </span>
              <div class="chat-meta-body">
                <strong>Fast</strong>
                <span>Start with a suggested question or type your own</span>
              </div>
              <span class="chat-meta-chev">›</span>
            </article>
          </div>

          <div class="chat-suggestions" v-if="messages.length === 0">
            <p class="chat-suggestions-title">Start with one of these</p>
            <button
              v-for="q in suggestedQuestions"
              :key="q.text"
              type="button"
              class="chat-suggestion"
              :disabled="isLoading"
              @click="handleSuggestedQuestion(q.text)"
            >
              <span class="chat-suggestion-icon" v-html="q.icon" />
              <span class="chat-suggestion-text">{{ q.text }}</span>
              <span class="chat-suggestion-chev">›</span>
            </button>
          </div>
        </aside>

        <section class="chat-panel">
          <div class="chat-panel-head">
            <div class="chat-panel-title-wrap">
              <div class="chat-avatar bot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="8" width="16" height="11" rx="3" />
                  <path d="M12 8V4M9 4h6" />
                  <circle cx="9" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
                  <path d="M2 12v3M22 12v3" />
                </svg>
              </div>
              <div>
                <h2>
                  Live conversation
                  <span class="chat-ai-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>
                    AI
                  </span>
                </h2>
                <p>Powered by UMovingU AI</p>
              </div>
            </div>
            <button class="chat-inline-clear" type="button" @click="clearChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
              </svg>
              Clear chat
            </button>
          </div>

          <div ref="scrollContainer" class="chat-messages">
            <div v-if="messages.length === 0" class="chat-empty-state">
              <div class="chat-mascot" aria-hidden="true">
                <span class="chat-mascot-spark">✦</span>
                <div class="chat-mascot-bot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="8" width="16" height="11" rx="4" />
                    <path d="M12 8V4M9 4h6" />
                    <path d="M2 11v4M22 11v4" />
                  </svg>
                  <div class="chat-mascot-face">
                    <span /><span />
                  </div>
                </div>
              </div>
              <div class="chat-empty-copy">
                <h3>Hi! I'm MoveCompanion AI <span class="wave">👋</span></h3>
                <p>
                  Ask anything about property.<br>
                  I can help with selling readiness, missing documents, accepted offers, passports, and more.
                </p>
                <div class="chat-feature-chips">
                  <span class="chat-feature-chip teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
                    Accurate answers
                  </span>
                  <span class="chat-feature-chip violet">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    Up-to-date insights
                  </span>
                  <span class="chat-feature-chip green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    Private &amp; secure
                  </span>
                </div>
              </div>
            </div>

            <template v-for="(msg, i) in messages" :key="i">
              <div v-if="msg.role === 'user'" class="chat-row chat-row-user">
                <div class="chat-bubble chat-bubble-user">
                  <p>{{ msg.content }}</p>
                </div>
              </div>

              <div v-else class="chat-row chat-row-assistant">
                <div class="chat-avatar small bot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="8" width="16" height="11" rx="3" />
                    <path d="M12 8V4M9 4h6" />
                    <circle cx="9" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div class="chat-bubble chat-bubble-assistant">
                  <p>{{ msg.content }}</p>
                </div>
              </div>
            </template>

            <div v-if="isLoading" class="chat-row chat-row-assistant">
              <div class="chat-avatar small bot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="8" width="16" height="11" rx="3" />
                  <path d="M12 8V4M9 4h6" />
                  <circle cx="9" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
                  <circle cx="15" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div class="chat-bubble chat-bubble-assistant typing">
                <div class="chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div v-if="error" class="chat-error">
              <p>{{ error }}</p>
            </div>

            <div ref="scrollAnchor" />
          </div>

          <footer class="chat-composer">
            <div class="chat-input-wrap">
              <textarea
                v-model="inputText"
                rows="1"
                maxlength="1000"
                placeholder="Ask anything related to your property..."
                @keydown.enter.exact.prevent="handleSend"
              />
              <div class="chat-input-bottom">
                <span class="chat-counter">{{ inputText.length }}/1000</span>
                <div class="chat-input-actions">
                  <button type="button" class="chat-mic" disabled>
                    <Icon name="i-heroicons-microphone" class="chat-send-icon" />
                  </button>
                  <button
                    type="button"
                    class="chat-send"
                    :disabled="isLoading || !inputText.trim()"
                    @click="handleSend"
                  >
                    <Icon name="i-heroicons-paper-airplane" class="chat-send-icon" />
                  </button>
                </div>
              </div>
            </div>
            <p class="chat-privacy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Your conversations are private and encrypted
            </p>
          </footer>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'
definePageMeta({
  title: 'MoveMate AI - UmovingU',
  middleware: 'auth',
})

const { messages, isLoading, error, sendMessage, clearChat } = useChat()

const route = useRoute()
const inputText = ref('')
const scrollContainer = ref<HTMLElement | null>(null)
const scrollAnchor = ref<HTMLElement | null>(null)
const handledPrefill = ref(false)

const suggestedQuestions = [
  {
    text: 'Am I ready to sell my house?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/></svg>',
  },
  {
    text: 'What documents am I missing?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  },
  {
    text: 'What happens after an offer is accepted?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10z"/><circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>',
  },
  {
    text: 'What is a property passport?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 18h8"/></svg>',
  },
  {
    text: 'Why do house sales fall through?',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17 9 11l4 4 8-8"/><path d="M17 7h4v4"/></svg>',
  },
]

const handleSend = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  inputText.value = ''
  await sendMessage(text)
}

const handleSuggestedQuestion = async (q: string) => {
  if (isLoading.value) return
  await sendMessage(q)
}

onMounted(async () => {
  const prefill = route.query.prefill
  if (handledPrefill.value || typeof prefill !== 'string' || !prefill.trim()) return
  handledPrefill.value = true
  await sendMessage(prefill.trim())
})

// Auto-scroll to bottom on new messages
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    scrollAnchor.value?.scrollIntoView({ behavior: 'smooth' })
  },
)

watch(isLoading, async (val) => {
  if (val) {
    await nextTick()
    scrollAnchor.value?.scrollIntoView({ behavior: 'smooth' })
  }
})
</script>

<style scoped>
.chat-page {
  --chat-aqua: #00a19a;
  --chat-blue: #2f9bdf;
  --chat-indigo: #4f4ff2;
  --chat-violet: #6c5ce7;
  --chat-ink: #1f2b3f;
  --chat-border: #d8e3ee;
  --bg: #f3f2ef;
  min-height: 100dvh;
  color: var(--chat-ink);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
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

.chat-shell {
  width: min(1260px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.chat-btn {
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}
.chat-btn.solid {
  color: #fff;
  background: #00a19a;
  box-shadow: 0 12px 24px rgba(0, 161, 154, 0.2);
}
.chat-btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}
.chat-mobile-clear {
  border: 0;
  color: #fff;
  background: #00a19a;
}

.chat-main {
  padding: 22px 0 36px;
}

.chat-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.36fr) minmax(0, 0.64fr);
  gap: 22px;
  align-items: start;
}

.chat-intro-panel,
.chat-panel {
  border: 1px solid var(--chat-border);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 16px 30px rgba(36, 66, 102, 0.08);
}

.chat-intro-panel {
  padding: 28px;
  position: sticky;
  top: 92px;
}

.chat-eyebrow {
  margin: 0;
  color: #0f756f;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 12px;
  font-weight: 800;
}
.chat-intro-panel h1 {
  margin: 12px 0 14px;
  font-size: clamp(28px, 3.6vw, 38px);
  line-height: 1.08;
  letter-spacing: -1px;
  color: #152942;
  font-weight: 750;
}
.chat-sub {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #617690;
}

.chat-intro-meta {
  margin-top: 22px;
  display: grid;
  gap: 12px;
}
.chat-meta-row {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e2ebf5;
  border-radius: 16px;
  padding: 14px 16px;
  background: rgba(250, 252, 255, 0.95);
}
.chat-meta-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.chat-meta-icon svg { width: 20px; height: 20px; }
.chat-meta-icon.teal { background: rgba(0, 161, 154, 0.12); color: var(--chat-aqua); }
.chat-meta-icon.violet { background: rgba(112, 92, 240, 0.12); color: var(--chat-violet); }
.chat-meta-body { flex: 1; min-width: 0; }
.chat-meta-body strong {
  display: block;
  color: #17385d;
  font-size: 15px;
  font-weight: 800;
}
.chat-meta-body span {
  display: block;
  margin-top: 3px;
  color: #5f7594;
  font-size: 12.5px;
  line-height: 1.45;
}
.chat-meta-chev { color: #9fb1c8; font-size: 18px; flex-shrink: 0; }

.chat-suggestions { margin-top: 24px; }
.chat-suggestions-title {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #70839c;
}
.chat-suggestion {
  width: 100%;
  margin-top: 10px;
  border: 1px solid #e2ebf5;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  padding: 13px 14px;
  text-align: left;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  color: #17314a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.2s, transform 0.2s;
}
.chat-suggestion:hover:not(:disabled) { border-color: #bfd9ec; transform: translateY(-1px); }
.chat-suggestion:disabled { opacity: 0.6; cursor: not-allowed; }
.chat-suggestion-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f0f5fb;
  color: #51698a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.chat-suggestion-icon :deep(svg) { width: 17px; height: 17px; }
.chat-suggestion-text { flex: 1; }
.chat-suggestion-chev { color: #9fb1c8; font-size: 17px; flex-shrink: 0; }

.chat-panel {
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 130px);
  overflow: hidden;
}

.chat-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 18px;
  border-bottom: 1px solid rgba(216, 227, 238, 0.9);
}
.chat-panel-title-wrap {
  display: flex;
  align-items: center;
  gap: 13px;
}
.chat-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--chat-violet) 0%, var(--chat-blue) 60%, var(--chat-aqua) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.chat-avatar svg { width: 24px; height: 24px; }
.chat-avatar.small {
  width: 34px;
  height: 34px;
  box-shadow: none;
}
.chat-avatar.small svg { width: 19px; height: 19px; }
.chat-panel-title-wrap h2 {
  margin: 0;
  font-size: 19px;
  color: #172f4c;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}
.chat-ai-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 800;
  color: #067a74;
  background: #e2f1ea;
  border-radius: 100px;
  padding: 3px 9px 3px 7px;
}
.chat-ai-pill svg { width: 13px; height: 13px; }
.chat-panel-title-wrap p {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: #71849b;
  font-weight: 600;
}
.chat-inline-clear {
  border: 1px solid #dfe8f3;
  background: #fff;
  color: #17314a;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  padding: 9px 14px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.chat-inline-clear svg { width: 15px; height: 15px; color: #51698a; }
.chat-inline-clear:hover { border-color: #bfd9ec; }

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: linear-gradient(180deg, rgba(247, 251, 255, 0.6) 0%, rgba(255, 255, 255, 0.96) 100%);
}

/* Empty state with mascot */
.chat-empty-state {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 20px 8px;
}
.chat-mascot {
  position: relative;
  flex-shrink: 0;
}
.chat-mascot-spark {
  position: absolute;
  top: -6px;
  right: -2px;
  color: var(--chat-aqua);
  font-size: 26px;
}
.chat-mascot-bot {
  position: relative;
  width: 130px;
  height: 130px;
  border-radius: 32px;
  background: linear-gradient(160deg, #ffffff 0%, #eef6ff 100%);
  color: var(--chat-aqua);
  display: grid;
  place-items: center;
  box-shadow: 0 20px 44px rgba(48, 98, 214, 0.14);
}
.chat-mascot-bot > svg { width: 78px; height: 78px; }
.chat-mascot-face {
  position: absolute;
  top: 52%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 12px;
}
.chat-mascot-face span {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #2bdcc7, #0a8f86);
  box-shadow: 0 0 10px rgba(20, 192, 138, 0.6);
}
.chat-empty-copy { min-width: 0; }
.chat-empty-copy h3 {
  margin: 0;
  font-size: 26px;
  color: #152942;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.chat-empty-copy h3 .wave { display: inline-block; }
.chat-empty-copy p {
  margin: 10px 0 0;
  font-size: 15px;
  line-height: 1.6;
  color: #617690;
}
.chat-feature-chips {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chat-feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 100px;
  background: #fff;
  border: 1px solid #e2ebf5;
}
.chat-feature-chip svg { width: 15px; height: 15px; }
.chat-feature-chip.teal { color: #067a74; }
.chat-feature-chip.violet { color: #6049d8; }
.chat-feature-chip.green { color: #1f9d6b; }

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}
.chat-row-user { justify-content: flex-end; }
.chat-bubble {
  max-width: min(78%, 640px);
  border-radius: 20px;
  padding: 14px 16px;
}
.chat-bubble p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}
.chat-bubble-user {
  background: #1f2b3f;
  color: #fff;
  border-bottom-right-radius: 6px;
}
.chat-bubble-assistant {
  background: #fff;
  color: #1f2b3f;
  border: 1px solid #e1e9f2;
  box-shadow: 0 10px 18px rgba(17, 52, 88, 0.06);
  border-bottom-left-radius: 6px;
}
.chat-bubble-assistant.typing { padding: 16px; }
.chat-typing {
  display: flex;
  gap: 6px;
  align-items: center;
  min-height: 14px;
}
.chat-typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b4b5b8;
  animation: chat-bounce 0.9s infinite ease-in-out;
}
.chat-typing span:nth-child(2) { animation-delay: 0.15s; }
.chat-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes chat-bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.65; }
  40% { transform: translateY(-4px); opacity: 1; }
}

.chat-error { text-align: center; }
.chat-error p {
  margin: 0;
  color: #c73e36;
  font-size: 13px;
  font-weight: 600;
}

.chat-composer {
  padding: 16px 22px 20px;
  border-top: 1px solid rgba(216, 227, 238, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 251, 255, 0.96) 100%);
}
.chat-input-wrap {
  background: #fff;
  border: 1px solid #dfe8f3;
  border-radius: 18px;
  padding: 14px 16px 10px;
  box-shadow: 0 8px 18px rgba(19, 51, 82, 0.06);
}
.chat-input-wrap:focus-within {
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.chat-input-wrap textarea {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  color: #17314a;
  resize: none;
  line-height: 1.5;
  max-height: 140px;
}
.chat-input-wrap textarea::placeholder { color: #8a95a0; }
.chat-input-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.chat-counter {
  font-size: 12px;
  font-weight: 700;
  color: #9aa8bb;
}
.chat-input-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.chat-send,
.chat-mic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chat-send {
  border: 0;
  background: linear-gradient(120deg, #0fae7e 0%, var(--chat-aqua) 100%);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 150, 130, 0.26);
}
.chat-send:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.chat-mic {
  border: 1px solid #e2ebf5;
  background: #fff;
  color: #8f9094;
}
.chat-send-icon { width: 18px; height: 18px; }

.chat-privacy {
  margin: 12px 0 0;
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  color: #8294aa;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}
.chat-privacy svg { width: 14px; height: 14px; }

@media (max-width: 980px) {
  .chat-shell { width: calc(100% - 18px); }
  .mesh { display: none; }
  .ambient { opacity: 0.15; }
  .chat-layout { grid-template-columns: 1fr; }
  .chat-intro-panel { position: static; }
}

@media (max-width: 640px) {
  .chat-main { padding-top: 14px; padding-bottom: 18px; }
  .chat-intro-panel,
  .chat-panel { border-radius: 18px; }
  .chat-intro-panel { padding: 20px; }
  .chat-panel-head,
  .chat-messages,
  .chat-composer {
    padding-left: 16px;
    padding-right: 16px;
  }
  .chat-intro-panel h1 { font-size: 28px; }
  .chat-bubble { max-width: 88%; }
  .chat-panel { min-height: 72dvh; }
  .chat-empty-state { flex-direction: column; text-align: center; gap: 18px; }
  .chat-feature-chips { justify-content: center; }
  .chat-mascot-bot { width: 104px; height: 104px; }
  .chat-mascot-bot > svg { width: 60px; height: 60px; }
  .chat-empty-copy h3 { font-size: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  .chat-typing span { animation: none !important; }
}
</style>
