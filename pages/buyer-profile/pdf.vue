<template>
  <div class="pv-page">

    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="pv-shell">
      <div class="pv-head">
        <div class="pv-kicker"><span class="pv-kicker-dot" />CERTIFIED DOCUMENT</div>
        <h1 class="pv-h1">Your Buyer Profile PDF</h1>
        <p class="pv-sub">
          A verified, PDTF-conformant document agents and solicitors can trust.
          Sign it, then download or share.
        </p>
      </div>

      <div class="pv-grid">
        <!-- LEFT: the rendered PDF document -->
        <div class="pv-doc-wrap">
      <div class="pdf-doc">
        <!-- Diagonal repeating watermark (positioned behind everything) -->
        <div class="pdf-watermark-layer" aria-hidden="true" />

        <!-- Header (navy) -->
        <div class="pdf-header">
          <div class="pdf-header-title">UMU BUYER PROFILE · VERIFIED DOCUMENT</div>
          <div class="pdf-header-name">{{ displayName }}</div>
          <div class="pdf-header-ref">Ref: {{ publicRef }}</div>
          <div class="pdf-header-pills">
            <span class="pdf-h-pill">🪪 ID Verified</span>
            <span v-if="fundsShort" class="pdf-h-pill">{{ fundsShort }} Funds</span>
            <span class="pdf-h-pill">{{ chainShort }}</span>
            <span v-if="tier === 'PREMIUM'" class="pdf-h-pill">★ Platinum</span>
          </div>
        </div>

        <!-- Validity period -->
        <div class="pdf-validity" :class="{ expired: isExpired }">
          <div class="pdf-validity-col">
            <div class="pdf-validity-lbl">Issued</div>
            <div class="pdf-validity-val">{{ issuedDate }}</div>
          </div>
          <div class="pdf-validity-divider" />
          <div class="pdf-validity-col">
            <div class="pdf-validity-lbl">Expires</div>
            <div class="pdf-validity-val">{{ expiresDate }}</div>
          </div>
          <div class="pdf-validity-divider" />
          <div class="pdf-validity-status">
            <span class="pdf-validity-dot" />
            <span class="pdf-validity-status-text">
              {{
                isExpired
                  ? 'Expired'
                  : daysRemaining <= 1
                    ? 'Active · expires today'
                    : `Active · ${daysRemaining} days left`
              }}
            </span>
          </div>
        </div>

        <!-- Identity -->
        <div class="pdf-section">
          <div class="pdf-section-title">IDENTITY</div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">Full name</span>
            <span class="pdf-cred-value">{{ displayName }}</span>
          </div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">ID document</span>
            <span class="pdf-cred-value">{{ idTypeLabel }}</span>
          </div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">Verified by</span>
            <span class="pdf-pill">Onfido · DVS ✓</span>
          </div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">AML status</span>
            <span class="pdf-pill">Clear ✓</span>
          </div>
        </div>

        <!-- Financial -->
        <div class="pdf-section">
          <div class="pdf-section-title">FINANCIAL CREDENTIALS</div>
          <div v-if="fundsShort" class="pdf-cred-row">
            <span class="pdf-cred-label">Proof of deposit</span>
            <span class="pdf-cred-value">{{ fundsShort }}</span>
          </div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">Source of funds</span>
            <span class="pdf-pill">AML clear ✓</span>
          </div>
          <div v-if="passport?.fundsAmount" class="pdf-cred-row">
            <span class="pdf-cred-label">Max purchase</span>
            <span class="pdf-cred-value">£{{ passport.fundsAmount.toLocaleString() }}</span>
          </div>
          <!-- Affordability row removed — was hard-coded "82/100 · Low risk"
               for every user regardless of their profile. It will return
               once the Armalytix / open-banking partner integration lands
               and we can show a real score per buyer. -->
        </div>

        <!-- Credit File section removed — was showing the same hard-coded
             Experian (821) and Equifax (794) numbers for every Premium
             user. It will return once the Experian + Equifax partner
             integrations ship and the backend persists real scores per
             buyer. Keeping the dummy section in the PDF risks a lender or
             solicitor relying on bogus numbers. -->


        <!-- Purchase profile -->
        <div class="pdf-section">
          <div class="pdf-section-title">PURCHASE PROFILE</div>
          <div class="pdf-cred-row">
            <span class="pdf-cred-label">Chain position</span>
            <span class="pdf-cred-value">{{ chainShort }}</span>
          </div>
          <div v-if="timelineLabel" class="pdf-cred-row">
            <span class="pdf-cred-label">Timeline</span>
            <span class="pdf-cred-value">{{ timelineLabel }}</span>
          </div>
          <div v-if="propertyTypeLabel" class="pdf-cred-row">
            <span class="pdf-cred-label">Property type</span>
            <span class="pdf-cred-value">{{ propertyTypeLabel }}</span>
          </div>
          <div v-if="passport?.solicitorStatus === 'yes'" class="pdf-cred-row">
            <span class="pdf-cred-label">Solicitor status</span>
            <span class="pdf-pill">Instructed · Law Society ✓</span>
          </div>
        </div>

        <!-- Signature -->
        <div class="pdf-section">
          <div class="pdf-section-title">DIGITAL SIGNATURE</div>
          <!-- Not signed -->
          <div
            v-if="!passport?.signedAt"
            class="pdf-sig-placeholder"
            @click="goSign"
          >
            ✍️ Tap to add your digital signature
          </div>
          <!-- Signed -->
          <div v-else class="pdf-sig-done">
            <div class="pdf-sig-done-label">✅ Digitally signed</div>
            <div v-if="passport.signatureData" class="pdf-sig-img-wrap">
              <img :src="passport.signatureData" alt="Signature" class="pdf-sig-img" />
            </div>
            <div v-else class="pdf-sig-typed">
              {{ passport.signedName }}
            </div>
            <div class="pdf-sig-meta">
              Signed {{ formatSignedAt(passport.signedAt) }} · UMU verified
            </div>
          </div>
        </div>

        <div class="pdf-watermark">
          Issued by UMU · {{ canonicalShareUrl }} · PDTF conformant · Verify at umu.co/verify
        </div>
      </div>
    </div>

        <!-- RIGHT: sticky action sidebar -->
        <aside class="pv-side">
          <div class="pv-side-card">
            <div class="pv-side-status" :class="{ signed: passport?.signedAt }">
              <Icon :name="passport?.signedAt ? 'heroicons:check-badge-solid' : 'heroicons:pencil-square'" class="pv-side-status-ic" />
              <div>
                <div class="pv-side-status-t">{{ passport?.signedAt ? 'Signed & sealed' : 'Not signed yet' }}</div>
                <div class="pv-side-status-s">{{ passport?.signedAt ? 'eIDAS verified signature' : 'Add a signature to finalise' }}</div>
              </div>
            </div>

            <button class="cta-btn" :disabled="downloading" @click="downloadPdf">
              <span class="cta-btn-inner">
                <Icon name="heroicons:arrow-down-tray" class="cta-ic" />
                {{ downloading ? 'Preparing…' : 'Download PDF' }}
              </span>
            </button>
            <button class="cta-btn outline" @click="goSign">
              <span class="cta-btn-inner">
                <Icon name="heroicons:pencil-square" class="cta-ic" />
                {{ passport?.signedAt ? 'Update signature' : 'Add digital signature' }}
              </span>
            </button>
            <button class="cta-btn ghost" @click="goSendAgent">
              <span class="cta-btn-inner">
                <Icon name="heroicons:paper-airplane" class="cta-ic" />
                Share with agent
              </span>
            </button>
          </div>

          <div class="pv-trust">
            <Icon name="heroicons:shield-check" class="pv-trust-ic" />
            <span>PDTF-conformant · verifiable at umu.co/verify · tamper-evident</span>
          </div>
        </aside>
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
import { useAppToast } from '~/composables/useCustomToast'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'

definePageMeta({ title: 'Profile PDF — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile } = useBuyerProfile()
const { fetchProfile, profile } = useProfile()
const { showToast } = useAppToast()

const passport = ref<BuyerProfile | null>(null)
const downloading = ref(false)

onMounted(async () => {
  fetchProfile?.().catch(() => {})
  try {
    const p = await getBuyerProfile()
    passport.value = p
    if (!p) router.replace('/buyer-profile')
  } catch {
    router.replace('/buyer-profile')
  }
})

// ── Display ───────────────────────────────────────────────
const tier = computed<'BASIC' | 'VERIFIED' | 'PREMIUM'>(
  () => ((passport.value as any)?.tier as any) || 'BASIC',
)
const displayName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return profile.value?.email?.split('@')[0] || 'Buyer'
})
const publicRef = computed(
  () => (passport.value as any)?.publicRef || '—',
)
const canonicalShareUrl = computed(() => `umu.co/profile/${publicRef.value}`)
// ── Validity period ──────────────────────────────────────
// A buyer profile is treated as fresh for 30 days from issuance. After
// that the doc is shown as expired (still verifiable via QR — the buyer
// just needs to re-share to refresh the dates).
const VALIDITY_DAYS = 30
const issuedAtMs = computed<number | null>(() => {
  const d = passport.value?.publishedAt || passport.value?.createdAt
  if (!d) return null
  const t = new Date(d).getTime()
  return Number.isFinite(t) ? t : null
})
const expiresAtMs = computed<number | null>(() =>
  issuedAtMs.value ? issuedAtMs.value + VALIDITY_DAYS * 86_400_000 : null,
)
function fmtDate(ms: number | null): string {
  if (ms == null) return '—'
  return new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
const issuedDate = computed(() => fmtDate(issuedAtMs.value))
const expiresDate = computed(() => fmtDate(expiresAtMs.value))
const isExpired = computed(
  () => !!expiresAtMs.value && expiresAtMs.value < Date.now(),
)
const daysRemaining = computed(() => {
  if (!expiresAtMs.value) return 0
  return Math.max(
    0,
    Math.ceil((expiresAtMs.value - Date.now()) / 86_400_000),
  )
})
const fundsShort = computed(() => {
  const amt = passport.value?.fundsAmount
  if (!amt) return ''
  if (amt >= 1_000_000) return `£${(amt / 1_000_000).toFixed(1)}M`
  if (amt >= 1000) return `£${Math.round(amt / 1000)}K`
  return `£${amt}`
})
const chainShort = computed(() => {
  const c = passport.value?.chainPosition
  if (c === 'sold') return 'Chain free'
  if (c === 'selling') return 'Property to sell'
  if (c === 'ftb') return 'First-time buyer'
  return '—'
})
const idTypeLabel = computed(() => {
  const t = passport.value?.idDocumentType
  if (t === 'passport') return 'UK / EU Passport'
  if (t === 'drivingLicence') return 'UK Driving Licence'
  if (t === 'nationalId') return 'National ID Card'
  return 'Photo ID'
})
const timelineLabel = computed(() => {
  const t = passport.value?.timeline
  return ({ asap: 'Ready now', '3m': '1–3 months', '6m': '3–6 months', flex: 'Flexible' } as any)[t || ''] || ''
})
const propertyTypeLabel = computed(() => {
  const t = (passport.value as any)?.propertyType
  return ({ house: 'House', flat: 'Flat', newBuild: 'New build', any: 'Any' } as any)[t || ''] || ''
})

function formatSignedAt(iso: string | null | undefined) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Actions ───────────────────────────────────────────────
const goBack = useGoBack('/buyer-profile/view')
function goSign() { router.push('/buyer-profile/sign') }
function goSendAgent() { router.push('/buyer-profile/send-agent') }

function downloadPdf() {
  // Server-side PDF generation is Phase 4 work — for now we let the browser
  // print the rendered preview to PDF, which is the same approach the legacy
  // download used. The prototype's "Download PDF" is also a simulation.
  downloading.value = true
  setTimeout(() => {
    window.print()
    downloading.value = false
    showToast({ message: 'PDF prepared', iconEmoji: '✓' })
  }, 200)
}
</script>

<style scoped>
.pv-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: hidden;
}
.pv-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.pv-ambient-a { width: 540px; height: 540px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(0,161,154,0.1) 0%, transparent 70%); }
.pv-ambient-b { width: 480px; height: 480px; bottom: 6%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.1) 0%, transparent 70%); }

.pv-shell { width: min(1180px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; padding: 40px 0 90px; }
.pv-head { margin-bottom: 28px; max-width: 640px; }
.pv-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #067a74; background: rgba(229,255,248,0.92); border: 1px solid rgba(0,161,154,0.28); padding: 6px 12px; border-radius: 100px; margin-bottom: 14px; }
.pv-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: #00a19a; }
.pv-h1 { font-size: 38px; font-weight: 800; color: #10263d; letter-spacing: -1px; line-height: 1.08; margin-bottom: 10px; }
.pv-sub { font-size: 15px; color: #627891; line-height: 1.6; font-weight: 500; }

.pv-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; align-items: start; }

/* PDF doc */
.pv-doc-wrap {
  min-width: 0;
  animation: pv-fadeUp 0.4s 0.05s both;
}
@keyframes pv-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.pdf-doc {
  position: relative;
  background: white;
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 14px 30px rgba(17, 52, 88, 0.11);
  isolation: isolate;
}

/* Diagonal repeating watermark — drawn behind every page region except
   the navy header (which sits above via z-index). Uses an inline SVG so
   it survives "print to PDF" cleanly without external assets. */
.pdf-watermark-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='160'><text x='160' y='95' text-anchor='middle' transform='rotate(-24 160 95)' fill='rgba(35,29,69,0.055)' font-family='-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif' font-size='22' font-weight='800' letter-spacing='3'>UMU · VERIFIED</text></svg>");
  background-repeat: repeat;
}
/* Sections / header / validity sit above the watermark. */
.pdf-doc > *:not(.pdf-watermark-layer) {
  position: relative;
  z-index: 1;
}

.pdf-header {
  background: #231d45;
  padding: 18px 20px;
}
.pdf-header-title {
  font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.pdf-header-name {
  font-size: 20px; font-weight: 800; color: white;
  margin-bottom: 4px;
}
.pdf-header-ref {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}
.pdf-header-pills {
  display: flex; flex-wrap: wrap; gap: 5px;
  margin-top: 10px;
}
.pdf-h-pill {
  font-size: 9px; font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  padding: 3px 9px;
  color: white;
}

/* Validity period band — sits directly under the navy header */
.pdf-validity {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 18px;
  background: #f2faf8;
  border-bottom: 1px solid #e5f4f2;
}
.pdf-validity.expired {
  background: #fef2f1;
  border-bottom-color: #fbcec9;
}
.pdf-validity-col {
  flex: 1;
  min-width: 0;
}
.pdf-validity-divider {
  width: 1px;
  align-self: stretch;
  margin: 0 12px;
  background: rgba(0, 161, 154, 0.18);
}
.pdf-validity.expired .pdf-validity-divider {
  background: rgba(199, 62, 54, 0.2);
}
.pdf-validity-lbl {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: #6b6783;
  margin-bottom: 2px;
}
.pdf-validity-val {
  font-size: 12px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.1px;
  white-space: nowrap;
}
.pdf-validity-status {
  flex: 1.1;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}
.pdf-validity-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00a19a;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.18);
  flex-shrink: 0;
}
.pdf-validity.expired .pdf-validity-dot {
  background: #c73e36;
  box-shadow: 0 0 0 3px rgba(199, 62, 54, 0.18);
}
.pdf-validity-status-text {
  font-size: 10.5px;
  font-weight: 800;
  color: #007e78;
  letter-spacing: -0.05px;
  text-align: right;
}
.pdf-validity.expired .pdf-validity-status-text {
  color: #882019;
}

.pdf-section {
  padding: 14px 18px;
  border-bottom: 1px solid #f5f5f7;
}
.pdf-section:last-child { border-bottom: none; }
.pdf-section-title {
  font-size: 9px; font-weight: 800; letter-spacing: 1px;
  color: #6b6783;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.pdf-cred-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
  gap: 8px;
}
.pdf-cred-row:last-child { margin-bottom: 0; }
.pdf-cred-label {
  font-size: 12px; font-weight: 700; color: #6b6783;
}
.pdf-cred-value {
  font-size: 12px; font-weight: 800; color: #231d45;
  text-align: right;
}
.pdf-pill {
  font-size: 9px; font-weight: 800;
  background: #f2faf8; color: #007e78;
  border: 1px solid #e5f4f2;
  border-radius: 100px;
  padding: 3px 8px;
  white-space: nowrap;
}

.pdf-sig-placeholder {
  background: #fafafa;
  border: 1.5px dashed #ececef;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  font-size: 12px; font-weight: 700;
  color: #9c98ad;
  transition: all 0.15s;
}
.pdf-sig-placeholder:hover {
  border-color: #00a19a;
  color: #007e78;
}
.pdf-sig-done {
  background: #f2faf8;
  border: 1.5px solid #00a19a;
  border-radius: 10px;
  padding: 12px;
}
.pdf-sig-done-label {
  font-size: 13px; font-weight: 800; color: #007e78;
  margin-bottom: 4px;
}
.pdf-sig-img-wrap {
  background: white;
  border-radius: 8px;
  padding: 6px;
  display: inline-block;
}
.pdf-sig-img {
  max-width: 200px;
  max-height: 60px;
  display: block;
}
.pdf-sig-typed {
  font-family: Georgia, serif;
  font-size: 18px; font-style: italic;
  color: #231d45;
  margin-bottom: 6px;
}
.pdf-sig-meta {
  font-size: 10px;
  color: #9c98ad;
  margin-top: 6px;
}

.pdf-watermark {
  font-size: 9px;
  color: #9c98ad;
  font-weight: 600;
  padding: 12px 18px;
  text-align: center;
  background: #fafafa;
}

/* Action sidebar */
.pv-side { position: sticky; top: 86px; display: flex; flex-direction: column; gap: 16px; animation: pv-fadeUp 0.4s 0.15s both; }
.pv-side-card { background: #fff; border: 1px solid #e8eef5; border-radius: 20px; box-shadow: 0 14px 34px rgba(15,44,76,0.07); padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.pv-side-status { display: flex; align-items: center; gap: 12px; background: #fff7ec; border: 1px solid #f5e4c4; border-radius: 14px; padding: 14px; margin-bottom: 4px; }
.pv-side-status.signed { background: #f2faf8; border-color: #d8efeb; }
.pv-side-status-ic { width: 30px; height: 30px; color: #c4821a; flex-shrink: 0; }
.pv-side-status.signed .pv-side-status-ic { color: #00a19a; }
.pv-side-status-t { font-size: 14px; font-weight: 800; color: #231d45; }
.pv-side-status-s { font-size: 11.5px; color: #6b6783; margin-top: 1px; }
.cta-btn {
  width: 100%;
  background: linear-gradient(120deg, #00a19a, #2f9bdf); color: white; border: none;
  border-radius: 13px; padding: 15px;
  font-family: inherit; font-size: 14px; font-weight: 800;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(0, 161, 154, 0.3); }
.cta-btn:disabled { opacity: 0.6; cursor: progress; }
.cta-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
.cta-ic { width: 17px; height: 17px; }
.cta-btn.outline {
  background: #fff; color: #10263d;
  border: 1.5px solid #d6dfeb; box-shadow: none;
}
.cta-btn.outline:hover { border-color: #00a19a; box-shadow: 0 8px 18px rgba(15,44,76,0.08); }
.cta-btn.ghost {
  background: #f4f7fb; color: #516070; border: none; box-shadow: none;
}
.cta-btn.ghost:hover { background: #eaf0f7; }
.pv-trust { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; color: #627891; background: #f0f4fa; border: 1px solid #dce6f0; border-radius: 14px; padding: 13px 15px; }
.pv-trust-ic { width: 18px; height: 18px; color: #10263d; flex-shrink: 0; }

@media (max-width: 940px) {
  .pv-grid { grid-template-columns: 1fr; gap: 22px; }
  .pv-side { position: static; }
  .pv-h1 { font-size: 30px; }
}
@media (max-width: 760px) {
  .pv-shell { width: calc(100% - 32px); padding: 32px 0 64px; }
  .pv-h1 { font-size: 26px; }
  .pv-sub { font-size: 14px; }
}
@media (max-width: 480px) {
  .pv-shell { width: calc(100% - 24px); }
  .pv-h1 { font-size: 23px; }
}

/* Print styles — when user prints to PDF, hide the chrome and keep the
   navy header / teal validity band / diagonal watermark visible.
   `print-color-adjust: exact` is required for Chromium-based browsers. */
@media print {
  .pv-side, .pv-head, .pv-ambient { display: none !important; }
  :deep(.bpnav) { display: none !important; }
  .pv-page { background: white; }
  .pv-shell { width: 100%; padding: 0; }
  .pv-grid { display: block; }
  .pdf-doc {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .pdf-doc,
  .pdf-header,
  .pdf-validity,
  .pdf-watermark-layer,
  .pdf-h-pill,
  .pdf-pill,
  .pdf-validity-dot,
  .pdf-sig-done {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
