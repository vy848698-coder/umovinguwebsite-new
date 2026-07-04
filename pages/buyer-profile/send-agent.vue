<template>
  <div class="sa-page">

    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="sa-shell">
      <div class="sa-head">
        <div class="sa-kicker"><span class="sa-kicker-dot" />SHARE WITH AGENT</div>
        <h1 class="sa-h1">Send your verified profile</h1>
        <p class="sa-sub">
          Email a secure, time-limited link to any agent. They see only your
          verified credentials — never your raw data.
        </p>
      </div>

      <div class="sa-grid">
        <!-- LEFT: form / confirmation -->
        <div class="sa-card sa-form-card">
          <template v-if="!sentId">
            <div class="sa-card-eyebrow"><Icon name="heroicons:user-plus" class="sa-eyebrow-ic" />AGENT DETAILS</div>
            <form class="recipient-form" @submit.prevent="onSend">
              <label class="sa-field">
                <span class="sa-field-label">Agent name</span>
                <input
                  v-model="form.name"
                  type="text"
                  class="sa-input"
                  placeholder="e.g. James Cooper"
                  required
                  :disabled="sending"
                />
              </label>
              <label class="sa-field">
                <span class="sa-field-label">
                  Email <span class="sa-field-hint">— the secure link is sent here</span>
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  class="sa-input"
                  placeholder="agent@savills.co.uk"
                  required
                  :disabled="sending"
                />
              </label>
              <label class="sa-field">
                <span class="sa-field-label">
                  Firm <span class="sa-field-hint">— optional</span>
                </span>
                <input
                  v-model="form.firm"
                  type="text"
                  class="sa-input"
                  placeholder="e.g. Savills, Knight Frank"
                  :disabled="sending"
                />
              </label>

              <button type="submit" class="cta-btn" :disabled="sending || !canSubmit">
                <span class="cta-btn-inner">
                  <span v-if="sending" class="sa-spinner" />
                  <Icon v-else name="heroicons:paper-airplane" class="cta-ic" />
                  {{ sending ? 'Sending…' : 'Send secure link' }}
                </span>
              </button>
            </form>
          </template>

          <!-- Confirmation -->
          <div v-else class="sa-confirm">
            <div class="sa-confirm-badge"><Icon name="heroicons:check-badge-solid" class="sa-confirm-badge-ic" /></div>
            <div class="sa-confirm-title">Profile sent!</div>
            <div class="sa-confirm-sub">{{ sentSubLine }}</div>
            <div class="sa-confirm-foot">
              They'll receive a secure link to view your verified credentials.
            </div>
            <div class="sa-confirm-actions">
              <button class="cta-btn outline" @click="goView">Back to my profile</button>
              <button class="sa-add-another" @click="resetForm">
                <Icon name="heroicons:plus" class="sa-add-ic" />Send to another agent
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT: scope panel -->
        <div class="sa-side">
          <div class="sa-card scope-panel">
            <div class="scope-title"><Icon name="heroicons:eye" class="scope-title-ic" />THEY WILL SEE</div>
            <div class="scope-row">
              <span class="scope-check"><Icon name="heroicons:check-16-solid" class="scope-check-ic" /></span>
              ID Verified (Onfido / DVS)
            </div>
            <div class="scope-row">
              <span class="scope-check"><Icon name="heroicons:check-16-solid" class="scope-check-ic" /></span>
              Budget · Proof of deposit · AML clear
            </div>
            <div class="scope-row">
              <span class="scope-check"><Icon name="heroicons:check-16-solid" class="scope-check-ic" /></span>
              Chain free · Solicitor instructed
            </div>
            <div class="scope-hidden">
              <Icon name="heroicons:lock-closed" class="scope-hidden-ic" />
              Not shared: account numbers, full DOB, credit score, personal address
            </div>
          </div>

          <div class="sa-trust">
            <Icon name="heroicons:clock" class="sa-trust-ic" />
            <span>Links expire automatically after 30 days. You can revoke access anytime.</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBuyerProfile } from '~/composables/useBuyerProfile'
import { useAppToast } from '~/composables/useCustomToast'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'

definePageMeta({ title: 'Share with Agent — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile, createShare } = useBuyerProfile()
const { showToast } = useAppToast()

const sending = ref(false)
const sentId = ref<string | null>(null)
const sentAgent = ref<{ firm: string; name: string; email: string } | null>(null)
const published = ref(false)

const form = ref<{ name: string; email: string; firm: string }>({
  name: '',
  email: '',
  firm: '',
})

const canSubmit = computed(
  () => form.value.name.trim().length > 1 && /.+@.+\..+/.test(form.value.email),
)

onMounted(async () => {
  try {
    const p = await getBuyerProfile()
    if (!p) router.replace('/buyer-profile')
    else published.value = !!p.published
  } catch {
    router.replace('/buyer-profile')
  }
})

const sentSubLine = computed(() => {
  if (!sentAgent.value) return ''
  const firmBit = sentAgent.value.firm ? ` at ${sentAgent.value.firm}` : ''
  return `${sentAgent.value.name}${firmBit} has been notified.`
})

function resetForm() {
  form.value = { name: '', email: '', firm: '' }
  sentId.value = null
  sentAgent.value = null
}

async function onSend() {
  if (!published.value) {
    showToast({ message: 'Publish your profile first', iconEmoji: '⚠️' })
    return
  }
  if (!canSubmit.value) return
  sending.value = true
  try {
    const name = form.value.name.trim()
    const email = form.value.email.trim()
    const firm = form.value.firm.trim()
    const recipientName = firm ? `${name} · ${firm}` : name
    await createShare({
      recipientName,
      recipientEmail: email,
      expiresInDays: 30,
      scope: ['identity', 'deposit', 'sof', 'afford', 'story'],
    })
    // Stamp a synthetic id so the confirmation panel switches in.
    sentId.value = `${Date.now()}`
    sentAgent.value = { firm, name, email }
  } catch (e: any) {
    showToast({
      message: e?.data?.message || 'Could not send',
      iconEmoji: '⚠️',
    })
  } finally {
    sending.value = false
  }
}

const goBack = useGoBack('/buyer-profile/view')
function goView() { router.push('/buyer-profile/view') }
</script>

<style scoped>
.sa-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45; width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased; position: relative; overflow-x: hidden;
}
.sa-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.sa-ambient-a { width: 540px; height: 540px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(0,161,154,0.12) 0%, transparent 70%); }
.sa-ambient-b { width: 480px; height: 480px; bottom: 6%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.1) 0%, transparent 70%); }

.sa-shell { width: min(1100px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; padding: 40px 0 90px; }
.sa-head { margin-bottom: 28px; max-width: 640px; }
.sa-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #067a74; background: rgba(229,255,248,0.92); border: 1px solid rgba(0,161,154,0.28); padding: 6px 12px; border-radius: 100px; margin-bottom: 14px; }
.sa-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: #00a19a; }
.sa-h1 { font-size: 38px; font-weight: 800; color: #231d45; letter-spacing: -1px; line-height: 1.08; margin-bottom: 10px; }
.sa-sub { font-size: 15px; color: #627891; line-height: 1.6; font-weight: 500; }

.sa-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 24px; align-items: start; }
.sa-card { background: #fff; border: 1px solid #e8eef5; border-radius: 22px; box-shadow: 0 14px 34px rgba(15,44,76,0.07); padding: 26px; }
.sa-card-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #8a97a8; margin-bottom: 18px; }
.sa-eyebrow-ic { width: 15px; height: 15px; }

.recipient-form { display: flex; flex-direction: column; gap: 16px; }
.sa-field { display: flex; flex-direction: column; gap: 7px; }
.sa-field-label { font-size: 13px; font-weight: 700; color: #17314a; }
.sa-field-hint { font-weight: 500; color: #9aa9bd; }
.sa-input { width: 100%; border: 1.5px solid #e2e8f1; border-radius: 12px; padding: 14px 16px; font-size: 15px; font-family: inherit; color: #231d45; background: #fbfdff; transition: border-color 0.18s, box-shadow 0.18s; }
.sa-input:focus { outline: none; border-color: #00a19a; box-shadow: 0 0 0 3px rgba(0,161,154,0.12); }
.sa-input::placeholder { color: #b5bdc9; }
.sa-input:disabled { background: #f4f6f9; color: #9aa9bd; }

.cta-btn { width: 100%; margin-top: 6px; background: #00857f; color: #fff; border: none; border-radius: 14px; padding: 17px; font-size: 15px; font-weight: 800; font-family: inherit; box-shadow: 0 14px 26px rgba(58,87,206,0.26); cursor: pointer; transition: transform 0.2s cubic-bezier(.22,1,.36,1), box-shadow 0.2s; }
.cta-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 32px rgba(58,87,206,0.32); }
.cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cta-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
.cta-ic { width: 17px; height: 17px; }
.cta-btn.outline { background: #fff; color: #231d45; border: 1.5px solid #d6dfeb; box-shadow: none; }
.cta-btn.outline:hover { border-color: #00a19a; transform: translateY(-1px); box-shadow: 0 8px 18px rgba(15,44,76,0.08); }
.sa-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: sa-spin 0.7s linear infinite; }
@keyframes sa-spin { to { transform: rotate(360deg); } }

/* Confirmation */
.sa-confirm { text-align: center; padding: 14px 0; }
.sa-confirm-badge { width: 64px; height: 64px; border-radius: 20px; margin: 0 auto 16px; background: linear-gradient(140deg, #00b6ae, #007e78); box-shadow: 0 14px 30px -8px rgba(0,161,154,0.5); display: flex; align-items: center; justify-content: center; animation: sa-pop 0.5s cubic-bezier(.22,1,.36,1) both; }
.sa-confirm-badge-ic { width: 36px; height: 36px; color: #fff; }
@keyframes sa-pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
.sa-confirm-title { font-size: 22px; font-weight: 800; color: #231d45; margin-bottom: 6px; }
.sa-confirm-sub { font-size: 14px; color: #17314a; font-weight: 600; margin-bottom: 6px; }
.sa-confirm-foot { font-size: 13px; color: #6b6783; line-height: 1.5; max-width: 360px; margin: 0 auto 22px; }
.sa-confirm-actions { display: flex; flex-direction: column; gap: 10px; max-width: 320px; margin: 0 auto; }
.sa-add-another { display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: none; border: none; font-family: inherit; font-size: 13px; font-weight: 700; color: #00a19a; cursor: pointer; padding: 8px; }
.sa-add-ic { width: 15px; height: 15px; }

/* Scope panel */
.sa-side { display: flex; flex-direction: column; gap: 16px; }
.scope-panel { background: linear-gradient(150deg, #00b6ae 0%, #009a93 48%, #00514d 100%); border: none; color: #fff; box-shadow: 0 16px 36px -12px rgba(0,161,154,0.45); }
.scope-title { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: rgba(255,255,255,0.72); margin-bottom: 16px; }
.scope-title-ic { width: 15px; height: 15px; }
.scope-row { display: flex; align-items: center; gap: 11px; font-size: 13.5px; font-weight: 600; color: #fff; padding: 8px 0; }
.scope-check { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.scope-check-ic { width: 13px; height: 13px; color: #fff; }
.scope-hidden { display: flex; align-items: flex-start; gap: 8px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.18); font-size: 11.5px; color: rgba(255,255,255,0.78); line-height: 1.5; }
.scope-hidden-ic { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
.sa-trust { display: flex; align-items: center; gap: 10px; font-size: 11.5px; font-weight: 600; color: #627891; background: #f0f4fa; border: 1px solid #dce6f0; border-radius: 14px; padding: 14px 16px; }
.sa-trust-ic { width: 18px; height: 18px; color: #231d45; flex-shrink: 0; }

@media (max-width: 940px) {
  .sa-grid { grid-template-columns: 1fr; gap: 20px; }
  .sa-h1 { font-size: 30px; }
}
@media (max-width: 760px) {
  .sa-shell { width: calc(100% - 32px); padding: 32px 0 64px; }
  .sa-h1 { font-size: 26px; }
  .sa-sub { font-size: 14px; }
  .sa-card { padding: 22px 20px; border-radius: 18px; }
}
@media (max-width: 480px) {
  .sa-shell { width: calc(100% - 24px); }
  .sa-h1 { font-size: 23px; }
}
</style>
