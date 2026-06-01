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
            Ask practical questions about surveys, conveyancing, offers, timelines, and documents without losing track of the conversation.
          </p>

          <div class="chat-intro-meta">
            <article>
              <strong>Guided</strong>
              <span>Answers framed for real property decisions</span>
            </article>
            <article>
              <strong>Fast</strong>
              <span>Start with a suggested question or type your own</span>
            </article>
          </div>

          <div class="chat-suggestions" v-if="messages.length === 0">
            <p class="chat-suggestions-title">Start with one of these</p>
            <button
              v-for="q in suggestedQuestions"
              :key="q"
              type="button"
              class="chat-suggestion"
              :disabled="isLoading"
              @click="handleSuggestedQuestion(q)"
            >
              {{ q }}
            </button>
          </div>
        </aside>

        <section class="chat-panel">
          <div class="chat-panel-head">
            <div class="chat-panel-title-wrap">
              <div class="chat-avatar">
                <Icon name="i-heroicons-sparkles" class="chat-avatar-icon" />
              </div>
              <div>
                <h2>Live conversation</h2>
                <p>Powered by UMovingU AI</p>
              </div>
            </div>
            <button class="chat-inline-clear" type="button" @click="clearChat">Clear</button>
          </div>

          <div ref="scrollContainer" class="chat-messages">
            <div v-if="messages.length === 0" class="chat-empty-state">
              <h3>Ask anything about property</h3>
              <p>
                I can help with selling readiness, missing documents, accepted offers, passports, and common reasons transactions slow down.
              </p>
            </div>

            <template v-for="(msg, i) in messages" :key="i">
              <div v-if="msg.role === 'user'" class="chat-row chat-row-user">
                <div class="chat-bubble chat-bubble-user">
                  <p>{{ msg.content }}</p>
                </div>
              </div>

              <div v-else class="chat-row chat-row-assistant">
                <div class="chat-avatar small">
                  <Icon name="i-heroicons-sparkles" class="chat-avatar-icon" />
                </div>
                <div class="chat-bubble chat-bubble-assistant">
                  <p>{{ msg.content }}</p>
                </div>
              </div>
            </template>

            <div v-if="isLoading" class="chat-row chat-row-assistant">
              <div class="chat-avatar small">
                <Icon name="i-heroicons-sparkles" class="chat-avatar-icon" />
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
              <input
                v-model="inputText"
                type="text"
                placeholder="Ask anything related to your property"
                @keydown.enter.prevent="handleSend"
              >

              <button
                v-if="inputText.trim()"
                type="button"
                class="chat-send"
                :disabled="isLoading"
                @click="handleSend"
              >
                <Icon name="i-heroicons-arrow-up" class="chat-send-icon" />
              </button>

              <button v-else type="button" class="chat-mic" disabled>
                <Icon name="i-heroicons-microphone" class="chat-send-icon" />
              </button>
            </div>
          </footer>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
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
  'Am I ready to sell my house?',
  "What documents am I missing?",
  'What happens after an offer is accepted?',
  'What is a property passport?',
  'Why do house sales fall through?',
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
  --chat-ink: #1f2b3f;
  --chat-border: #d8e3ee;
  min-height: 100dvh;
  color: var(--chat-ink);
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
  background: linear-gradient(120deg, var(--chat-aqua) 0%, var(--chat-blue) 48%, var(--chat-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.chat-btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}

.chat-mobile-clear {
  border: 0;
  color: #fff;
  background: linear-gradient(120deg, var(--chat-aqua) 0%, var(--chat-blue) 48%, var(--chat-indigo) 100%);
}

.chat-main {
  padding: 22px 0 36px;
}

.chat-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.36fr) minmax(0, 0.64fr);
  gap: 18px;
  align-items: start;
}

.chat-intro-panel,
.chat-panel {
  border: 1px solid var(--chat-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 14px 26px rgba(36, 66, 102, 0.08);
}

.chat-intro-panel {
  padding: 22px;
  position: sticky;
  top: 92px;
}

.chat-eyebrow {
  margin: 0;
  color: #0f756f;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-size: 11px;
  font-weight: 800;
}

.chat-intro-panel h1 {
  margin: 8px 0 12px;
  font-size: clamp(28px, 3.8vw, 40px);
  line-height: 1.05;
  letter-spacing: -1px;
  color: #152942;
}

.chat-sub {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #617690;
}

.chat-intro-meta {
  margin-top: 18px;
  display: grid;
  gap: 10px;
}

.chat-intro-meta article {
  border: 1px solid #dbe7f3;
  border-radius: 14px;
  padding: 12px;
  background: rgba(248, 251, 255, 0.92);
}

.chat-intro-meta strong {
  display: block;
  color: #17385d;
  font-size: 15px;
}

.chat-intro-meta span {
  display: block;
  margin-top: 4px;
  color: #5f7594;
  font-size: 12px;
  line-height: 1.45;
}

.chat-suggestions {
  margin-top: 20px;
}

.chat-suggestions-title {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #70839c;
}

.chat-suggestion {
  width: 100%;
  margin-top: 8px;
  border: 1px solid #dfe8f3;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  padding: 12px;
  text-align: left;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #17314a;
  cursor: pointer;
}

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
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(216, 227, 238, 0.9);
}

.chat-panel-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--chat-aqua) 0%, var(--chat-blue) 48%, var(--chat-indigo) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}

.chat-avatar.small {
  width: 32px;
  height: 32px;
  box-shadow: none;
}

.chat-avatar-icon {
  width: 18px;
  height: 18px;
}

.chat-panel-title-wrap h2 {
  margin: 0;
  font-size: 20px;
  color: #172f4c;
}

.chat-panel-title-wrap p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #71849b;
}

.chat-inline-clear {
  border: 0;
  background: transparent;
  color: #0d7f79;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: linear-gradient(180deg, rgba(247, 251, 255, 0.9) 0%, rgba(255, 255, 255, 0.96) 100%);
}

.chat-empty-state {
  border: 1px dashed #d2dfec;
  border-radius: 18px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.88);
}

.chat-empty-state h3 {
  margin: 0;
  font-size: 20px;
  color: #152942;
}

.chat-empty-state p {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: #617690;
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-row-user {
  justify-content: flex-end;
}

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

.chat-bubble-assistant.typing {
  padding: 16px;
}

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

.chat-typing span:nth-child(2) {
  animation-delay: 0.15s;
}

.chat-typing span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes chat-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.65;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-error {
  text-align: center;
}

.chat-error p {
  margin: 0;
  color: #c73e36;
  font-size: 13px;
  font-weight: 600;
}

.chat-composer {
  padding: 14px 18px 18px;
  border-top: 1px solid rgba(216, 227, 238, 0.9);
  background: rgba(255, 255, 255, 0.96);
}

.chat-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 6px 6px 6px 14px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}

.chat-input-wrap:focus-within {
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}

.chat-input-wrap input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  color: #17314a;
  min-width: 0;
}

.chat-input-wrap input::placeholder {
  color: #8a95a0;
}

.chat-send,
.chat-mic {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-send {
  border: 0;
  background: linear-gradient(120deg, var(--chat-aqua) 0%, var(--chat-blue) 48%, var(--chat-indigo) 100%);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.chat-mic {
  border: 1px solid #e5e5ea;
  background: #fff;
  color: #8f9094;
}

.chat-send-icon {
  width: 18px;
  height: 18px;
}

@media (max-width: 980px) {
  .chat-shell {
    width: calc(100% - 18px);
  }

  .mesh {
    display: none;
  }

  .ambient {
    opacity: 0.15;
  }

  .chat-layout {
    grid-template-columns: 1fr;
  }

  .chat-intro-panel {
    position: static;
  }
}

@media (max-width: 640px) {
  .chat-main {
    padding-top: 14px;
    padding-bottom: 18px;
  }

  .chat-intro-panel,
  .chat-panel {
    border-radius: 18px;
  }

  .chat-intro-panel,
  .chat-panel-head,
  .chat-messages,
  .chat-composer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .chat-intro-panel h1 {
    font-size: 30px;
  }

  .chat-bubble {
    max-width: 88%;
  }

  .chat-panel {
    min-height: 72dvh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chat-typing span {
    animation: none !important;
  }
}
</style>
