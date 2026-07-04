<template>
  <div class="sh-page">

    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="sh-shell">
      <div class="sh-head">
        <div class="sh-kicker"><span class="sh-kicker-dot" />SHARE YOUR PROFILE</div>
        <h1 class="sh-h1">Share your verified profile</h1>
        <p class="sh-sub">
          Send a secure link to an agent, generate a QR, manage who has access,
          or download the certified PDF.
        </p>
      </div>

      <!-- Tab switcher -->
      <div class="sh-tabs-wrap">
        <div class="how-tabs">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="how-tab"
            :class="{ active: activeTab === t.id }"
            @click="activeTab = t.id"
          >
            <Icon :name="t.icon" class="how-tab-ic" />
            <template v-if="t.id === 'active' && activeCount > 0">
              Active <span class="how-tab-dot" />
            </template>
            <template v-else-if="t.id === 'link'">Link &amp; QR</template>
            <template v-else>{{ t.label }}</template>
          </button>
        </div>
      </div>

    <!-- ── SEND tab ── -->
    <div v-if="activeTab === 'people'" class="sh-pane">
      <!-- Scope disclosure -->
      <div class="scope-panel">
        <div class="scope-title"><Icon name="heroicons:eye" class="scope-title-ic" />THEY WILL SEE</div>
        <div class="scope-row">
          <div class="scope-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
          ID Verified (Onfido / DVS)
        </div>
        <div v-if="passport?.fundsAmount" class="scope-row">
          <div class="scope-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
          Budget — up to {{ fundsShort }}
        </div>
        <div class="scope-row">
          <div class="scope-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
          {{ chainShort }}{{ passport?.solicitorStatus === 'yes' ? ' · solicitor instructed' : '' }}
        </div>
        <div v-if="passport?.statement" class="scope-row">
          <div class="scope-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg></div>
          Your story (optional)
        </div>
        <div class="scope-hidden">
          <Icon name="heroicons:lock-closed" class="scope-hidden-ic" />
          Not shared: personal address, full name, date of birth, account numbers
        </div>
      </div>

      <span class="sec-label">SEND TO AGENT</span>
      <!-- Send to a specific agent: routes to the dedicated form so we
           don't show fake "suggested agents" to the user. -->
      <div class="recipient-card recipient-empty">
        <div class="recipient-empty-emoji"><Icon name="heroicons:paper-airplane" class="recipient-empty-ic" /></div>
        <div class="recipient-empty-title">Send to your agent</div>
        <div class="recipient-empty-sub">
          Enter their name + email — we'll deliver a secure link that
          expires in 30 days.
        </div>
        <button class="cta-btn" @click="goSendAgent">
          <span class="cta-btn-inner">Open send form<Icon name="heroicons:arrow-right" class="cta-ic" /></span>
        </button>
      </div>

      <button
        class="sh-link-instead"
        @click="activeTab = 'link'"
      >
        Or share a link instead
        <Icon name="heroicons:arrow-right" class="sh-link-instead-ic" />
      </button>
    </div>

    <!-- ── ACTIVE tab ── -->
    <div v-else-if="activeTab === 'active'" class="sh-pane">
      <span class="sec-label">WHO HAS ACCESS</span>
      <div v-if="loadingShares" class="sh-empty">Loading…</div>
      <div v-else-if="shares.length === 0" class="sh-empty">
        No active shares yet. Send a link from the Send tab.
      </div>
      <div v-else class="teal-card sh-list">
        <div
          v-for="s in shares"
          :key="s.id"
          class="share-entry"
          :class="{ revoked: !!s.revokedAt }"
        >
          <div class="avatar" :style="{ background: s.revokedAt ? '#9c98ad' : '#00a19a' }">
            {{ initialsFor(s.recipientName) }}
          </div>
          <div class="share-meta">
            <div class="share-name">{{ s.recipientName || 'Unnamed share' }}</div>
            <div class="share-scope">{{ scopeShort(s.scope) }}</div>
            <div class="share-expiry">
              <Icon name="heroicons:clock" class="share-expiry-ic" />
              <template v-if="s.revokedAt">Revoked</template>
              <template v-else-if="isExpired(s)">Expired</template>
              <template v-else>Expires in {{ daysUntil(s.expiresAt) }} days</template>
            </div>
          </div>
          <button
            v-if="!s.revokedAt && !isExpired(s)"
            class="revoke-btn"
            @click="onRevoke(s.id)"
          >
            Revoke
          </button>
          <span v-else class="revoke-disabled">—</span>
        </div>
      </div>
      <p class="sh-expires-note">
        Access expires automatically after 30 days.<br />
        You can revoke at any time.
      </p>
      <div class="sh-cta-wrap">
        <button class="cta-btn outline" @click="activeTab = 'people'">
          + Send to another agent
        </button>
      </div>
    </div>

    <!-- ── LINK & QR tab ── -->
    <div v-else-if="activeTab === 'link'" class="sh-pane">
      <span class="sec-label">YOUR UNIQUE LINK</span>
      <div class="teal-card sh-link-card">
        <div class="sh-link-url">
          {{ canonicalShareLink }}
        </div>
        <button class="sh-link-copy" @click="copyLink">Copy link</button>
      </div>

      <!-- QR code -->
      <div class="navy-card sh-qr-card">
        <div class="sh-qr-frame">
          <div class="sh-qr-canvas" ref="qrCanvasEl">
            <!-- Skeleton until the QR resolves -->
            <div class="sh-qr-skeleton" />
          </div>
        </div>
        <div class="sh-qr-meta">Scan to verify</div>
        <button class="sh-qr-save" type="button" @click="downloadQr">
          <Icon name="heroicons:arrow-down-tray" class="sh-qr-save-ic" />Save QR
        </button>
      </div>
      <p class="sh-expires-note">
        Valid for 30 days · Share only with trusted parties
      </p>
    </div>

    <!-- ── PDF tab ── -->
    <div v-else-if="activeTab === 'pdf'" class="sh-pane">
      <span class="sec-label">DOWNLOAD YOUR PROFILE</span>
      <!-- Preview card -->
      <div class="sh-pdf-preview">
        <div class="sh-pdf-eyebrow">UMU BUYER PROFILE</div>
        <div class="sh-pdf-tagline">"Trusted, ready, chain-free."</div>
        <div class="sh-pdf-name">{{ displayName }}</div>
        <div class="sh-pdf-pills">
          <span class="sh-pdf-pill"><Icon name="heroicons:check-16-solid" class="sh-pdf-pill-ic" />ID Verified</span>
          <span v-if="fundsShort" class="sh-pdf-pill">{{ fundsShort }} Funds</span>
          <span class="sh-pdf-pill">{{ chainShort }}</span>
        </div>
      </div>
      <div class="sh-cta-wrap">
        <button class="cta-btn" @click="goPdf">
          <span class="cta-btn-inner"><Icon name="heroicons:document-arrow-down" class="cta-ic" />Preview &amp; Download PDF</span>
        </button>
      </div>
      <button class="sh-sign-link" @click="goSign">
        <Icon name="heroicons:pencil-square" class="sh-sign-ic" />Add digital signature
      </button>
      <p class="sh-pdf-note">
        PDF includes your verified badge and is digitally signed by UMU
      </p>
    </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  useBuyerProfile,
  type BuyerProfile,
  type BuyerProfileShare,
} from '~/composables/useBuyerProfile'
import { useProfile } from '~/composables/useProfile'
import { useAppToast } from '~/composables/useCustomToast'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'

definePageMeta({ title: 'Share Profile — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile, listShares, revokeShare } = useBuyerProfile()
const { fetchProfile, profile } = useProfile()
const { showToast } = useAppToast()

type TabId = 'people' | 'active' | 'link' | 'pdf'
const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'people', label: 'Send', icon: 'heroicons:paper-airplane' },
  { id: 'active', label: 'Active', icon: 'heroicons:users' },
  { id: 'link', label: 'Link', icon: 'heroicons:qr-code' },
  { id: 'pdf', label: 'PDF', icon: 'heroicons:document-arrow-down' },
]
const activeTab = ref<TabId>('people')

const passport = ref<BuyerProfile | null>(null)
const shares = ref<BuyerProfileShare[]>([])
const loadingShares = ref(false)

// The "Send" tab used to render three hardcoded sample agents (James
// Cooper / Sarah Mitchell / David Chen) with one-tap send buttons. That
// implied UMU had a partnership directory; we don't. Removed in favour of
// the dedicated /buyer-profile/send-agent form which takes free-text name
// + email. `sending` and `sentSet` went away with them.

onMounted(async () => {
  fetchProfile?.().catch(() => {})
  await Promise.all([
    refreshProfile(),
    refreshShares(),
  ])
})
async function refreshProfile() {
  try {
    const p = await getBuyerProfile()
    passport.value = p
    if (!p) router.replace('/buyer-profile')
  } catch {
    router.replace('/buyer-profile')
  }
}

async function refreshShares() {
  loadingShares.value = true
  try {
    shares.value = await listShares()
  } finally {
    loadingShares.value = false
  }
}

function goSendAgent() {
  router.push('/buyer-profile/send-agent')
}

const activeCount = computed(
  () => shares.value.filter((s) => !s.revokedAt && !isExpired(s)).length,
)

// ── Display helpers ────────────────────────────────────────
const displayName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return 'Verified buyer'
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
  if (c === 'selling') return 'Selling'
  if (c === 'ftb') return 'First-time'
  return 'Add chain'
})

const canonicalShareLink = computed(() => {
  const ref = (passport.value as any)?.publicRef
  if (!ref) return 'umu.co/profile/—'
  return `umu.co/profile/${ref}`
})

function initialsFor(name: string | null | undefined): string {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '??'
}
function isExpired(s: BuyerProfileShare) {
  return new Date(s.expiresAt).getTime() < Date.now()
}
function daysUntil(iso: string) {
  return Math.max(
    0,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000),
  )
}
function scopeShort(scope: any): string {
  if (!Array.isArray(scope)) return 'ID · Budget · Chain · Story'
  const map: Record<string, string> = {
    identity: 'ID',
    deposit: 'Budget',
    sof: 'SoF',
    afford: 'Afford',
    credit: 'Credit',
    story: 'Story',
  }
  return scope.map((s) => map[s] || s).join(' · ')
}

async function onRevoke(id: string) {
  try {
    await revokeShare(id)
    await refreshShares()
    showToast({ message: 'Share revoked', iconEmoji: '🚫' })
  } catch (e: any) {
    showToast({
      message: e?.data?.message || 'Could not revoke',
      iconEmoji: '⚠️',
    })
  }
}

async function copyLink() {
  const text = canonicalShareLink.value
  try {
    await navigator.clipboard.writeText(text)
    showToast({ message: 'Link copied', iconEmoji: '🔗' })
  } catch {
    showToast({ message: text, iconEmoji: '🔗' })
  }
}

// ── QR ────────────────────────────────────────────────────
// Cached data URL so we can re-render synchronously on tab switches.
const qrCanvasEl = ref<HTMLElement | null>(null)
const qrDataUrl = ref<string>('')

async function buildQrDataUrl(text: string): Promise<string> {
  const { default: QRCode } = await import('qrcode')
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 220,
    errorCorrectionLevel: 'M',
    color: { dark: '#231d45', light: '#ffffff' },
  })
}

async function drawQr() {
  if (!qrCanvasEl.value) return
  // Use a fully-qualified URL so a scan opens the real site, not "umu.co/..."
  // as a search query. Falls back to the canonical short form if window
  // isn't available (SSR).
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://umu.co'
  const publicRef = (passport.value as any)?.publicRef
  const target = publicRef
    ? `${origin}/profile/${publicRef}`
    : canonicalShareLink.value
  try {
    qrDataUrl.value = await buildQrDataUrl(target)
    qrCanvasEl.value.innerHTML = `<img src="${qrDataUrl.value}" alt="Share QR code" width="220" height="220" />`
  } catch {
    qrCanvasEl.value.innerHTML =
      '<div style="font-size:11px;color:#6b6783;padding:24px;text-align:center;">QR library missing — run <code>npm i qrcode</code></div>'
  }
}

// Re-draw whenever the user lands on the Link & QR tab, or when the
// public ref arrives async from the profile load.
watch(activeTab, async (t) => {
  if (t === 'link') {
    await nextTick()
    drawQr()
  }
})
watch(
  () => (passport.value as any)?.publicRef,
  async (ref) => {
    if (ref && activeTab.value === 'link') {
      await nextTick()
      drawQr()
    }
  },
)

// Save the QR to the camera roll / downloads folder.
async function downloadQr() {
  if (!qrDataUrl.value) {
    try {
      const target =
        typeof window !== 'undefined' && window.location?.origin
          ? `${window.location.origin}/profile/${
              (passport.value as any)?.publicRef ?? ''
            }`
          : canonicalShareLink.value
      qrDataUrl.value = await buildQrDataUrl(target)
    } catch {
      showToast({ message: 'Could not generate QR', iconEmoji: '⚠️' })
      return
    }
  }
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = `umu-buyer-profile-qr-${
    (passport.value as any)?.publicRef ?? 'share'
  }.png`
  a.click()
  showToast({ message: 'QR saved', iconEmoji: '📥' })
}

// ── Navigation ────────────────────────────────────────────
const goBack = useGoBack('/buyer-profile/view')
function goView() { router.push('/buyer-profile/view') }
function goPdf() { router.push('/buyer-profile/pdf') }
function goSign() { router.push('/buyer-profile/sign') }
</script>

<style scoped>
.sh-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: hidden;
}
.sh-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.sh-ambient-a { width: 540px; height: 540px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(0,161,154,0.1) 0%, transparent 70%); }
.sh-ambient-b { width: 480px; height: 480px; bottom: 6%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.1) 0%, transparent 70%); }

.sh-shell { width: min(880px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; padding: 40px 0 90px; }
.sh-head { margin-bottom: 22px; max-width: 640px; }
.sh-kicker { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: #067a74; background: rgba(229,255,248,0.92); border: 1px solid rgba(0,161,154,0.28); padding: 6px 12px; border-radius: 100px; margin-bottom: 14px; }
.sh-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: #00a19a; }
.sh-h1 { font-size: 36px; font-weight: 800; color: #231d45; letter-spacing: -1px; line-height: 1.08; margin-bottom: 10px; }
.sh-sub { font-size: 15px; color: #627891; line-height: 1.6; font-weight: 500; }

/* Tab switcher */
.sh-tabs-wrap {
  display: flex; justify-content: flex-start;
  margin: 0 0 22px;
  animation: sh-fadeDown 0.4s 0.05s both;
}
@keyframes sh-fadeDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.how-tabs {
  display: inline-flex; flex-wrap: wrap;
  background: #fff; border: 1px solid #e8eef5;
  border-radius: 14px; padding: 5px; gap: 4px;
  box-shadow: 0 4px 14px rgba(15,44,76,0.05);
}
.how-tab {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: inherit; font-size: 13px; font-weight: 700;
  color: #6b6783; background: transparent; border: none;
  padding: 9px 16px; border-radius: 10px;
  cursor: pointer; transition: all 0.15s;
}
.how-tab:hover { color: #231d45; background: rgba(0,0,0,0.03); }
.how-tab-ic { width: 16px; height: 16px; }
.how-tab-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }
.how-tab.active {
  background: #00857f; color: white;
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.3);
}
.how-tab.active:hover { color: #fff; }

.sh-pane {
  animation: sh-fadeUp 0.4s 0.1s both;
}

/* ── Icon sizing for converted emojis ── */
.scope-title-ic { width: 15px; height: 15px; }
.scope-hidden-ic { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
.recipient-empty-ic { width: 26px; height: 26px; color: #00a19a; }
.sh-link-instead-ic { width: 15px; height: 15px; }
.share-expiry-ic { width: 13px; height: 13px; }
.sh-qr-save-ic { width: 16px; height: 16px; }
.sh-pdf-pill-ic { width: 12px; height: 12px; }
.sh-sign-ic { width: 16px; height: 16px; }
.cta-btn-inner { display: inline-flex; align-items: center; justify-content: center; gap: 7px; }
.cta-ic { width: 17px; height: 17px; }
@keyframes sh-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scope panel */
.scope-panel {
  width: min(100%, 1080px);
  background: #f2faf8;
  border: 1.5px solid #e5f4f2;
  border-radius: 14px;
  padding: 12px 14px;
  margin: 14px auto 0;
}
.scope-title {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 800;
  color: #007e78; letter-spacing: 0.5px;
  margin-bottom: 7px;
}
.scope-row {
  display: flex; align-items: center; gap: 7px;
  font-size: 11.5px; font-weight: 700; color: #231d45;
  margin-bottom: 4px;
}
.scope-row:last-of-type { margin-bottom: 0; }
.scope-check {
  width: 14px; height: 14px; border-radius: 50%;
  background: #00a19a;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.scope-hidden {
  display: flex; align-items: flex-start; gap: 7px;
  font-size: 10px; font-weight: 700; color: #9c98ad;
  margin-top: 7px;
  padding-top: 7px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* Section label */
.sec-label {
  font-size: 11px; font-weight: 800;
  color: #6b6783; letter-spacing: 1px;
  text-transform: uppercase;
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 16px 0 8px;
  display: block;
}

/* Recipient card */
.recipient-card {
  width: min(100%, 1080px);
  background: white; border: 2px solid #00a19a;
  border-radius: 14px; overflow: hidden;
  margin: 0 auto;
}
.recipient-empty {
  padding: 22px 18px 18px;
  text-align: center;
}
.recipient-empty-emoji {
  width: 56px; height: 56px; border-radius: 16px;
  background: #eef6f4;
  display: inline-flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.recipient-empty-title {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.2px;
  margin-bottom: 4px;
}
.recipient-empty-sub {
  font-size: 12px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.45;
  margin: 0 auto 14px;
  max-width: 280px;
}
.recipient-empty .cta-btn {
  width: 100%;
  margin: 0;
}
.recipient-row {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid #f5f5f7;
}
.recipient-row:last-child { border-bottom: none; }
.avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #231d45; color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
}
.recipient-meta { flex: 1; min-width: 0; }
.recipient-firm {
  font-size: 12px; font-weight: 800; color: #231d45;
}
.recipient-name {
  font-size: 11px; color: #6b6783;
}
.send-btn {
  background: #00a19a; color: white; border: none;
  border-radius: 100px;
  padding: 7px 13px;
  font-family: inherit; font-size: 11px; font-weight: 800;
  cursor: pointer; white-space: nowrap;
}
.send-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.sent-badge {
  background: #e8f5ee; color: #2eab55;
  border: 1px solid #b8e8c8; border-radius: 100px;
  padding: 6px 12px;
  font-size: 11px; font-weight: 800; white-space: nowrap;
}

.sh-link-instead {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  margin: 14px auto 0;
  background: none; border: none;
  font-family: inherit;
  font-size: 13px; font-weight: 700;
  color: #007e78;
  cursor: pointer; padding: 8px 22px;
}
.sh-link-instead:hover { color: #00514d; }

/* Active shares */
.teal-card {
  background: white;
  border: 2px solid #00a19a;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.08);
}
.sh-list {
  width: min(100%, 1080px);
  margin: 0 auto;
  overflow: hidden;
}
.share-entry {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid #f5f5f7;
}
.share-entry:last-child { border-bottom: none; }
.share-entry.revoked { opacity: 0.55; }
.share-meta { flex: 1; min-width: 0; }
.share-name {
  font-size: 12px; font-weight: 800; color: #231d45;
}
.share-scope {
  font-size: 10.5px; color: #6b6783; margin-top: 1px;
}
.share-expiry {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #c4821a;
  margin-top: 2px;
}
.revoke-btn {
  background: #fcebea; color: #c73e36;
  border: 1px solid #f5c6c4; border-radius: 100px;
  padding: 6px 12px;
  font-family: inherit; font-size: 10.5px; font-weight: 800;
  cursor: pointer;
}
.revoke-disabled {
  color: #c0bdcc; font-size: 14px; font-weight: 800;
  padding: 0 8px;
}
.sh-empty {
  width: min(100%, 1080px);
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid rgba(174, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(242, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 34px rgba(17, 52, 88, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  padding: 28px 22px; text-align: center;
  color: #6b6783; font-size: 12.5px; font-weight: 600;
}
.sh-expires-note {
  width: min(100%, 1080px);
  margin: 0 auto;
  padding: 14px 0 0;
  font-size: 11px; color: #9c98ad;
  text-align: center; line-height: 1.5;
}
.sh-cta-wrap {
  width: min(100%, 1080px);
  margin: 14px auto 0;
}

/* Link tab */
.sh-link-card {
  width: min(100%, 1080px);
  margin: 0 auto;
  overflow: hidden;
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
}
.sh-link-url {
  flex: 1; min-width: 0;
  font-size: 13px; font-weight: 700; color: #231d45;
  font-family: 'SF Mono', Menlo, monospace;
  word-break: break-all;
}
.sh-link-copy {
  background: #00a19a; color: white; border: none;
  border-radius: 100px;
  padding: 8px 14px;
  font-family: inherit; font-size: 11px; font-weight: 800;
  cursor: pointer; flex-shrink: 0;
}
.navy-card {
  background: white;
  border: 2px solid #231d45;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(35, 29, 69, 0.08);
}
.sh-qr-card {
  width: min(100%, 1080px);
  margin: 16px auto 0;
  padding: 20px; text-align: center;
}
.sh-qr-frame {
  display: inline-block;
  padding: 12px;
  background: #fff;
  border-radius: 14px;
  box-shadow: inset 0 0 0 2px #f1efee;
}
.sh-qr-canvas {
  display: inline-block;
  width: 220px;
  height: 220px;
}
.sh-qr-canvas img { display: block; }
.sh-qr-skeleton {
  width: 220px;
  height: 220px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #f1efee 0%,
    #fafafa 50%,
    #f1efee 100%
  );
  background-size: 200% 100%;
  animation: sh-qr-shimmer 1.4s ease-in-out infinite;
}
@keyframes sh-qr-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.sh-qr-meta {
  font-size: 11px; color: #6b6783;
  margin-top: 10px; font-weight: 600;
}
.sh-qr-save {
  display: inline-flex; align-items: center; gap: 6px;
  margin-top: 14px;
  border: 1.5px solid #231d45;
  background: #fff;
  color: #231d45;
  border-radius: 999px;
  padding: 9px 18px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.16s;
}
.sh-qr-save:hover { background: #231d45; color: #fff; }
.sh-qr-save:active { transform: scale(0.98); }

/* PDF tab */
.sh-pdf-preview {
  width: min(100%, 1080px);
  margin: 0 auto;
  background: #231d45; border-radius: 16px;
  padding: 20px; color: white;
}
.sh-pdf-eyebrow {
  font-size: 9px; font-weight: 800; letter-spacing: 1.5px;
  opacity: 0.5; text-transform: uppercase;
  margin-bottom: 8px;
}
.sh-pdf-tagline {
  font-size: 16px; font-weight: 800; font-style: italic;
  margin-bottom: 10px;
}
.sh-pdf-name {
  font-size: 12px; font-weight: 700;
  margin-bottom: 10px;
}
.sh-pdf-pills {
  display: flex; flex-wrap: wrap; gap: 5px;
}
.sh-pdf-pill {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 9px; font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100px;
  padding: 4px 9px;
  white-space: nowrap;
}
.sh-sign-link {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  margin: 12px auto 0;
  background: none; border: none;
  font-family: inherit;
  font-size: 13px; font-weight: 800; color: #007e78;
  cursor: pointer; padding: 8px 22px; width: 100%;
}
.sh-sign-link:hover { color: #00514d; }
.sh-pdf-note {
  width: min(100%, 1080px);
  margin: 0 auto;
  text-align: center;
  font-size: 11px; color: #9c98ad;
  padding: 10px 0;
}

/* CTA buttons */
.cta-btn {
  width: 100%;
  background: #00a19a; color: white; border: none;
  border-radius: 14px; padding: 16px;
  font-family: inherit; font-size: 14px; font-weight: 800;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.35);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.cta-btn:hover {
  background: #00b6ae;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.32);
}
.cta-btn.outline {
  background: white; color: #231d45;
  border: 1.5px solid #231d45;
  box-shadow: none;
}

/* Inner pane elements fill the centered shell */
.scope-panel,
.sec-label,
.recipient-card,
.recipient-empty,
.sh-link-instead,
.sh-list,
.sh-empty,
.sh-expires-note,
.sh-cta-wrap,
.sh-link-card,
.sh-qr-card,
.sh-pdf-preview,
.sh-pdf-note {
  width: 100%;
  max-width: none;
  margin-left: 0;
  margin-right: 0;
}

@media (max-width: 760px) {
  .sh-shell { width: calc(100% - 32px); padding: 32px 0 64px; }
  .sh-h1 { font-size: 28px; }
  .sh-sub { font-size: 14px; }
  .how-tabs { width: 100%; justify-content: space-between; }
  .how-tab { padding: 9px 12px; font-size: 12px; }
  .sh-link-card { flex-direction: column; align-items: stretch; }
  .sh-link-copy { width: 100%; }
}
@media (max-width: 480px) {
  .sh-shell { width: calc(100% - 24px); }
  .sh-h1 { font-size: 24px; }
  .how-tab span:not(.how-tab-dot) { display: inline; }
}
</style>
