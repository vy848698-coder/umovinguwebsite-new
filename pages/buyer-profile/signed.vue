<template>
  <div class="sn-page">

    <BuyerProfileNav back-label="My profile" @back="goView" />

    <main class="sn-shell">
      <!-- Celebration hero -->
      <div class="sn-hero">
        <div class="sn-badge">
          <Icon name="heroicons:check-badge-solid" class="sn-badge-ic" />
        </div>
        <div class="sn-kicker"><span class="sn-kicker-dot" />PROFILE SIGNED</div>
        <h1 class="sn-title">Your profile is signed &amp; sealed</h1>
        <p class="sn-sub">
          Your digital signature has been embedded. The certified PDF is now ready
          to share with agents or download.
        </p>
      </div>

      <div class="sn-grid">
        <!-- Signed document preview (teal-bordered card) -->
        <div class="sn-doc-card">
          <div class="sn-doc-head">
            <div class="sn-doc-eyebrow">
              <Icon name="heroicons:document-check" class="sn-doc-eyebrow-ic" />
              SIGNED DOCUMENT
            </div>
            <span class="sn-doc-verified">
              <Icon name="heroicons:check-16-solid" class="sn-pill-ic" />eIDAS
            </span>
          </div>
          <div class="sn-doc-title">UMU Buyer Profile — {{ displayName }}</div>

          <!-- Signature — image OR typed -->
          <div class="sn-sig-wrap">
            <div class="sn-sig-label">Authorised signature</div>
            <div v-if="passport?.signatureData" class="sn-sig-img-frame">
              <img :src="passport.signatureData" alt="Signature" class="sn-sig-img" />
            </div>
            <div v-else class="sn-sig-typed">
              {{ passport?.signedName || displayName }}
            </div>
          </div>

          <div class="sn-doc-meta">
            Signed {{ formatSignedAt(passport?.signedAt) }} · eIDAS compliant · UMU
            ref: {{ publicRef }}-SIG
          </div>
          <div class="sn-doc-hash">
            <Icon name="heroicons:finger-print" class="sn-hash-ic" />
            sig:sha256·umu·{{ publicRef }}·{{ sigStamp }}·eidas·verified
          </div>
        </div>

        <!-- Actions -->
        <div class="sn-side">
          <div class="sn-side-card">
            <div class="sn-side-title">What's next?</div>
            <button class="sn-action sn-action--primary" @click="goPdf">
              <span class="sn-action-ic"><Icon name="heroicons:arrow-down-tray" /></span>
              <span class="sn-action-body">
                <span class="sn-action-t">Download signed PDF</span>
                <span class="sn-action-s">Certified, ready to send</span>
              </span>
              <Icon name="heroicons:chevron-right" class="sn-action-chev" />
            </button>
            <button class="sn-action" @click="goSendAgent">
              <span class="sn-action-ic"><Icon name="heroicons:paper-airplane" /></span>
              <span class="sn-action-body">
                <span class="sn-action-t">Share with agent</span>
                <span class="sn-action-s">Send a secure link</span>
              </span>
              <Icon name="heroicons:chevron-right" class="sn-action-chev" />
            </button>
            <button class="sn-action" @click="goView">
              <span class="sn-action-ic"><Icon name="heroicons:user-circle" /></span>
              <span class="sn-action-body">
                <span class="sn-action-t">Back to my profile</span>
                <span class="sn-action-s">View your full profile</span>
              </span>
              <Icon name="heroicons:chevron-right" class="sn-action-chev" />
            </button>
          </div>

          <div class="sn-trust">
            <Icon name="heroicons:lock-closed" class="sn-trust-ic" />
            <span>Legally binding under eIDAS &amp; UK eIDAS regulations. Tamper-evident.</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useBuyerProfile,
  type BuyerProfile,
} from '~/composables/useBuyerProfile'
import { useProfile } from '~/composables/useProfile'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'

definePageMeta({ title: 'Profile Signed — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile } = useBuyerProfile()
const { fetchProfile, profile } = useProfile()

const passport = ref<BuyerProfile | null>(null)

onMounted(async () => {
  fetchProfile?.().catch(() => {})
  try {
    const p = await getBuyerProfile()
    passport.value = p
    if (!p?.signedAt) {
      router.replace('/buyer-profile/sign')
    }
  } catch {
    router.replace('/buyer-profile')
  }
})

const displayName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return passport.value?.signedName || 'Buyer'
})
const publicRef = computed(
  () => (passport.value as any)?.publicRef || '—',
)
const sigStamp = computed(() => {
  if (!passport.value?.signedAt) return ''
  const d = new Date(passport.value.signedAt)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}Z`
})

function formatSignedAt(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' GMT'
}

function goPdf() { router.push('/buyer-profile/pdf') }
function goSendAgent() { router.push('/buyer-profile/send-agent') }
function goView() { router.push('/buyer-profile/view') }
</script>

<style scoped>
.sn-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: hidden;
}
.sn-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.sn-ambient-a { width: 540px; height: 540px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(0,161,154,0.12) 0%, transparent 70%); }
.sn-ambient-b { width: 480px; height: 480px; bottom: 6%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.1) 0%, transparent 70%); }

.sn-shell { width: min(1100px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; padding: 44px 0 90px; }

/* Hero */
.sn-hero { text-align: center; max-width: 620px; margin: 0 auto 36px; }
.sn-badge {
  width: 72px; height: 72px; border-radius: 22px; margin: 0 auto 18px;
  background: linear-gradient(140deg, #00b6ae, #007e78);
  box-shadow: 0 16px 34px -8px rgba(0,161,154,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  animation: sn-pop 0.5s cubic-bezier(.22,1,.36,1) 0.05s both;
}
.sn-badge-ic { width: 40px; height: 40px; color: #fff; }
@keyframes sn-pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
.sn-kicker {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
  color: #067a74; background: rgba(229,255,248,0.92); border: 1px solid rgba(0,161,154,0.28);
  padding: 6px 12px; border-radius: 100px; margin-bottom: 14px;
  animation: sn-fadeUp 0.4s 0.12s both;
}
.sn-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: #00a19a; }
.sn-title { font-size: 38px; font-weight: 800; color: #231d45; letter-spacing: -1px; line-height: 1.1; margin-bottom: 12px; animation: sn-fadeUp 0.4s 0.16s both; }
.sn-sub { font-size: 15px; color: #627891; line-height: 1.6; font-weight: 500; animation: sn-fadeUp 0.4s 0.2s both; }
@keyframes sn-fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* Grid: doc + actions */
.sn-grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 24px; align-items: start; }

/* Signed document card */
.sn-doc-card {
  background: white; border: 2px solid #00a19a; border-radius: 22px;
  box-shadow: 0 18px 40px -14px rgba(0,161,154,0.25), inset 0 1px 0 rgba(255,255,255,0.96);
  padding: 26px 28px;
  animation: sn-fadeUp 0.4s 0.24s both;
}
.sn-doc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.sn-doc-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #007e78; }
.sn-doc-eyebrow-ic { width: 16px; height: 16px; }
.sn-doc-verified { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #007e78; background: #f2faf8; border: 1px solid #d8efeb; border-radius: 100px; padding: 5px 11px; }
.sn-pill-ic { width: 13px; height: 13px; }
.sn-doc-title { font-size: 18px; font-weight: 800; color: #231d45; margin-bottom: 4px; }
.sn-sig-wrap { border-top: 1px solid #eef1f5; border-bottom: 1px solid #eef1f5; padding: 18px 0; margin: 16px 0; }
.sn-sig-label { font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #9aa9bd; margin-bottom: 10px; }
.sn-sig-typed { font-family: Georgia, serif; font-size: 30px; font-style: italic; color: #231d45; }
.sn-sig-img-frame { display: inline-block; background: white; border-radius: 8px; }
.sn-sig-img { max-width: 320px; max-height: 96px; display: block; }
.sn-doc-meta { font-size: 11.5px; color: #9c98ad; line-height: 1.5; }
.sn-doc-hash {
  margin-top: 14px; background: #f2faf8; border-radius: 10px; padding: 12px 14px;
  font-size: 11px; font-family: 'SF Mono', Menlo, monospace; color: #007e78; word-break: break-all;
  display: flex; align-items: flex-start; gap: 8px;
}
.sn-hash-ic { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }

/* Side actions */
.sn-side { display: flex; flex-direction: column; gap: 16px; animation: sn-fadeUp 0.4s 0.3s both; }
.sn-side-card { background: white; border: 1px solid #e8eef5; border-radius: 22px; box-shadow: 0 14px 34px rgba(15,44,76,0.07); padding: 22px; display: flex; flex-direction: column; gap: 10px; }
.sn-side-title { font-size: 12px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #8a97a8; margin-bottom: 4px; }
.sn-action {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1.5px solid #e8eef5; border-radius: 14px;
  padding: 14px 16px; cursor: pointer; font-family: inherit; text-align: left; width: 100%;
  transition: all 0.18s cubic-bezier(.22,1,.36,1);
}
.sn-action:hover { transform: translateY(-2px); border-color: #a8d5c8; box-shadow: 0 10px 24px rgba(0,161,154,0.1); }
.sn-action--primary { background: #00857f; border: none; color: #fff; }
.sn-action--primary:hover { box-shadow: 0 12px 26px rgba(0,161,154,0.3); }
.sn-action-ic { width: 38px; height: 38px; border-radius: 11px; background: #eef6f4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #007e78; }
.sn-action-ic :deep(svg) { width: 20px; height: 20px; }
.sn-action--primary .sn-action-ic { background: rgba(255,255,255,0.2); color: #fff; }
.sn-action-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.sn-action-t { font-size: 14px; font-weight: 800; color: #231d45; }
.sn-action-s { font-size: 11.5px; color: #6b6783; margin-top: 1px; }
.sn-action--primary .sn-action-t { color: #fff; }
.sn-action--primary .sn-action-s { color: rgba(255,255,255,0.82); }
.sn-action-chev { width: 18px; height: 18px; color: #b5bdc9; flex-shrink: 0; }
.sn-action--primary .sn-action-chev { color: rgba(255,255,255,0.85); }
.sn-trust { display: flex; align-items: center; gap: 10px; font-size: 11.5px; font-weight: 600; color: #627891; background: #f0f4fa; border: 1px solid #dce6f0; border-radius: 14px; padding: 14px 16px; }
.sn-trust-ic { width: 18px; height: 18px; color: #231d45; flex-shrink: 0; }

@media (max-width: 940px) {
  .sn-grid { grid-template-columns: 1fr; gap: 20px; }
  .sn-title { font-size: 30px; }
}
@media (max-width: 760px) {
  .sn-shell { width: calc(100% - 32px); padding: 32px 0 64px; }
  .sn-title { font-size: 26px; }
  .sn-sub { font-size: 14px; }
  .sn-doc-card { padding: 22px 20px; border-radius: 18px; }
  .sn-sig-typed { font-size: 26px; }
}
@media (max-width: 480px) {
  .sn-shell { width: calc(100% - 24px); }
  .sn-title { font-size: 23px; }
  .sn-badge { width: 60px; height: 60px; border-radius: 18px; }
  .sn-badge-ic { width: 34px; height: 34px; }
}
</style>
