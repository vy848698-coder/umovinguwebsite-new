<template>
  <div class="contact-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-back" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </header>

    <main class="cw-main">
      <div class="cw-shell">

        <!-- ── Header ─────────────────────────────────────────────────── -->
        <div class="cw-head">
          <div class="cw-eyebrow">Direct message</div>
          <h1 class="cw-title">Message the owner</h1>
          <p class="cw-sub">
            Ask anything you need before you offer — your message goes straight
            to the owner, no estate agent in between.
          </p>
        </div>

        <!-- ── Two-column body ────────────────────────────────────────── -->
        <div class="cw-grid">

          <!-- Main column -->
          <div class="cw-col-main">
            <div class="cw-card">
              <h2 class="cw-card-title">Your message</h2>
              <p class="cw-card-sub">
                Owners respond best to specific, friendly questions.
              </p>
              <textarea
                v-model="message"
                class="cw-textarea"
                placeholder="e.g. Who did your rendering, and roughly when was it done?"
                rows="7"
              ></textarea>

              <div class="cw-options">
                <button type="button" class="cw-option" @click="togglePhone">
                  <div class="cw-option-body">
                    <span class="cw-option-text">Share my phone number</span>
                    <span class="cw-option-hint">Let the owner call you back directly</span>
                  </div>
                  <span class="cw-check" :class="{ checked: sharePhone }">
                    <svg v-if="sharePhone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                </button>
                <button type="button" class="cw-option" @click="toggleEmail">
                  <div class="cw-option-body">
                    <span class="cw-option-text">Email me a copy</span>
                    <span class="cw-option-hint">Keep a record of what you sent</span>
                  </div>
                  <span class="cw-check" :class="{ checked: sendEmailCopy }">
                    <svg v-if="sendEmailCopy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                </button>
              </div>

              <p v-if="errorMsg" class="cw-error">{{ errorMsg }}</p>

              <button class="cw-send" @click="sendMessage" :disabled="!canSend">
                <span v-if="sending" class="cw-spinner" />
                {{ sending ? 'Sending…' : 'Send message' }}
              </button>
              <p class="cw-send-foot">
                No fees · No commissions · Your details stay private until you share them
              </p>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="cw-col-side">
            <!-- Property -->
            <div class="cw-side-card cw-prop">
              <div class="cw-prop-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div class="cw-prop-body">
                <div class="cw-prop-label">You're contacting about</div>
                <div class="cw-prop-addr">{{ property?.addressLine1 || 'This property' }}</div>
                <div class="cw-prop-sub">{{ propLocation }}</div>
              </div>
            </div>

            <!-- Safety -->
            <div class="cw-side-card">
              <div class="cw-side-head">
                <span class="cw-side-badge cw-side-badge--safe">🔒</span>
                <h3 class="cw-side-title">Safe messaging</h3>
              </div>
              <ul class="cw-side-list">
                <li>All messages are monitored for safety</li>
                <li>Personal details kept private until you choose to share</li>
                <li>Report inappropriate behaviour anytime</li>
              </ul>
            </div>

            <!-- Response -->
            <div class="cw-side-card">
              <div class="cw-side-head">
                <span class="cw-side-badge cw-side-badge--chat">💬</span>
                <h3 class="cw-side-title">What happens next</h3>
              </div>
              <ul class="cw-side-list">
                <li>Your message goes directly to the owner</li>
                <li>Most owners respond within 4 hours</li>
                <li>You'll be notified when they reply</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <SiteFooter />

    <Toast
      v-if="toastState.visible"
      :message="toastState.message"
      :icon-emoji="toastState.iconEmoji"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '~/components/ui/Toast.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import { useAppToast } from '~/composables/useCustomToast'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { toastState, showToast, hideToast } = useAppToast()

const propertyId = route.params.id
const property = ref(null)
// Prefill the message from the ?prefill= query (set by "Ask the seller").
const message = ref(
  typeof route.query.prefill === 'string' ? route.query.prefill : '',
)
const sharePhone = ref(true)
const sendEmailCopy = ref(false)
const sending = ref(false)
const errorMsg = ref('')

const propLocation = computed(() => {
  if (!property.value) return 'Loading property…'
  const city = property.value.city || ''
  const pc = property.value.postcode || ''
  return [city, pc].filter(Boolean).join(' · ') || '—'
})

const canSend = computed(
  () => !!message.value.trim() && !sending.value && !!property.value,
)

onMounted(async () => {
  if (!propertyId) return
  try {
    property.value = await $fetch(
      `${config.public.apiBase}/property/${propertyId}`,
    )
  } catch {
    errorMsg.value = "Couldn't load property — try again."
  }
})

const goBack = () => router.back()
const togglePhone = () => (sharePhone.value = !sharePhone.value)
const toggleEmail = () => (sendEmailCopy.value = !sendEmailCopy.value)

const sendMessage = async () => {
  if (!canSend.value) return
  errorMsg.value = ''
  sending.value = true
  try {
    const token = localStorage.getItem('token')
    await $fetch(
      `${config.public.apiBase}/property/${propertyId}/tap-owner`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          message: message.value.trim(),
          sharePhone: sharePhone.value,
        },
      },
    )
    showToast({
      message: 'Sent — the owner has been notified',
      iconEmoji: '✅',
    })
    // Give the toast a moment, then send the user back to the property.
    setTimeout(() => router.push(`/property/${propertyId}`), 1200)
  } catch (err) {
    // Phone-required failures get a clearer message and a profile link.
    const msg =
      err?.data?.message ||
      err?.message ||
      "Couldn't send — please try again."
    errorMsg.value = msg
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.contact-page {
  --navy: #231d45;
  --teal: #00a19a;
  --teal-dark: #00857f;
  --ink: #231d45;
  --ink-soft: #5a5570;
  --ink-faint: #8b8799;
  --line: #ececf2;
  --bg: #f3f2ef;
  --serif: 'Plus Jakarta Sans', sans-serif;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Web nav ──────────────────────────────────────────────────────── */
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; }
.hsw-nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.hsw-nav-inner { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 9px; color: var(--navy); cursor: pointer; font-size: 19px; font-weight: 800; letter-spacing: -0.4px; flex-shrink: 0; font-family: inherit; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; gap: 4px; }
.hsw-links button { border: 0; background: transparent; color: var(--ink-soft); cursor: pointer; font-size: 14px; font-weight: 600; padding: 8px 12px; border-radius: 9px; white-space: nowrap; font-family: inherit; transition: background 0.15s, color 0.15s; }
.hsw-links button:hover { color: var(--navy); background: rgba(35, 29, 69, 0.05); }
.hsw-actions { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.hsw-back { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: border-color 0.16s, transform 0.16s; }
.hsw-back:hover { border-color: var(--teal); transform: translateY(-1px); }
.hsw-back svg { width: 15px; height: 15px; }

/* ── Shell ────────────────────────────────────────────────────────── */
.cw-main { padding: 34px 0 72px; }
.cw-shell { width: min(1040px, calc(100% - 48px)); margin: 0 auto; }

/* ── Header ───────────────────────────────────────────────────────── */
.cw-head { margin-bottom: 26px; }
.cw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 8px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  color: var(--teal);
}
.cw-eyebrow-dash { width: 22px; height: 2px; border-radius: 2px; background: currentColor; }
.cw-title {
  font-family: var(--serif);
  font-size: clamp(28px, 3.6vw, 40px);
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.05;
  margin: 0 0 8px;
  color: var(--ink);
}
.cw-sub {
  font-size: 14.5px;
  color: var(--ink-faint);
  margin: 0;
  line-height: 1.55;
  max-width: 60ch;
}

/* ── Grid ─────────────────────────────────────────────────────────── */
.cw-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}
.cw-col-side { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 92px; }

/* ── Compose card ─────────────────────────────────────────────────── */
.cw-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 26px 26px 24px;
  box-shadow: 0 14px 34px rgba(35, 29, 69, 0.07);
}
.cw-card-title { font-size: 17px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin: 0 0 4px; }
.cw-card-sub { font-size: 13px; color: var(--ink-faint); margin: 0 0 16px; }
.cw-textarea {
  width: 100%;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 15px 16px;
  font-size: 15px;
  line-height: 1.5;
  color: #2a2540;
  background: #fbfbfa;
  resize: vertical;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.16s, background 0.16s;
  color-scheme: light;
}
.cw-textarea:focus { border-color: var(--teal); background: #fff; }
.cw-textarea::placeholder { color: #a5a1b4; }

/* Options */
.cw-options { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
.cw-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  background: #fbfbfa;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.16s, background 0.16s;
}
.cw-option:hover { border-color: rgba(0, 161, 154, 0.4); }
.cw-option-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.cw-option-text { font-size: 14px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
.cw-option-hint { font-size: 12px; color: var(--ink-faint); }
.cw-check {
  width: 26px;
  height: 26px;
  border: 2px solid #d3d0dd;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.16s, border-color 0.16s;
}
.cw-check.checked { background: var(--teal); border-color: var(--teal); }

/* Send */
.cw-error {
  color: #c73e36;
  background: #fef2f1;
  border: 1px solid #fbcec9;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  margin: 16px 0 0;
  text-align: center;
}
.cw-send {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background: linear-gradient(135deg, var(--teal), var(--teal-dark));
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.3);
  transition: transform 0.14s, box-shadow 0.16s, opacity 0.16s;
}
.cw-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(0, 161, 154, 0.4); }
.cw-send:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.cw-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: cw-spin 0.6s linear infinite;
  margin-right: 8px;
  vertical-align: -2px;
}
@keyframes cw-spin { to { transform: rotate(360deg); } }
.cw-send-foot { font-size: 11.5px; color: var(--ink-faint); text-align: center; margin: 12px 0 0; }

/* ── Sidebar cards ────────────────────────────────────────────────── */
.cw-side-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.06);
}
.cw-prop { display: flex; align-items: flex-start; gap: 13px; }
.cw-prop-ic {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(0, 161, 154, 0.08);
  border: 1px solid rgba(0, 161, 154, 0.18);
  color: var(--teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.cw-prop-ic svg { width: 22px; height: 22px; }
.cw-prop-body { min-width: 0; }
.cw-prop-label { font-size: 9.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: var(--ink-faint); margin-bottom: 4px; }
.cw-prop-addr { font-size: 15px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; line-height: 1.2; }
.cw-prop-sub { font-size: 12.5px; color: var(--ink-faint); margin-top: 3px; }
.cw-side-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.cw-side-badge {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 16px;
  flex-shrink: 0;
}
.cw-side-badge--safe { background: #e6f9f7; border: 1px solid #cdeee9; }
.cw-side-badge--chat { background: #eef0ff; border: 1px solid #e0e3fb; }
.cw-side-title { font-size: 14.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin: 0; }
.cw-side-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
.cw-side-list li {
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.45;
  padding-left: 18px;
  position: relative;
}
.cw-side-list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--teal);
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 60px; }
  .cw-shell { width: calc(100% - 32px); }
  .cw-grid { grid-template-columns: 1fr; }
  .cw-col-side { position: static; }
}
</style>
