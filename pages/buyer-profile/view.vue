<template>
  <div class="bp-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" class="active" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-iconbtn" type="button" @click="goShare()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </button>
          <button class="hsw-help" type="button" @click="router.push('/profile/support')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Need Help?
          </button>
          <button class="hsw-back" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </header>

    <!-- Loading / empty -->
    <div v-if="loading" class="bp-loading">Loading your Profile…</div>
    <div v-else-if="!passport" class="bp-empty">
      <div class="bp-empty-ic">📘</div>
      <div class="bp-empty-title">No Profile yet</div>
      <div class="bp-empty-sub">
        Build your Buyer Profile to share with sellers and agents.
      </div>
      <button class="cta-btn" @click="router.push('/buyer-profile')">
        Build my Profile
      </button>
    </div>

    <template v-else>
      <!-- ── Page hero ── -->
      <div class="hsw-shell bpvw-hero">
        <div class="bpvw-hero-text">
          <p class="bpvw-eyebrow">Buyer Profile</p>
          <h1 class="bpvw-h1">Your verified <span class="bpvw-h1-accent">buyer profile</span></h1>
          <p class="bpvw-sub">
            Share proof of identity, funds and chain position with agents and
            sellers in one trusted link.
          </p>
        </div>
        <button class="bpvw-help" @click="router.push('/profile/support')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          Need Help?
        </button>
      </div>

      <main class="hsw-shell bpvw-layout">
      <!-- ── Left aside: one tall white panel ── -->
      <aside class="bpvw-aside">
        <!-- Hero card with gauge + actions (flush to panel top) -->
        <div class="hero-card">
          <div class="bp-hero-top">
            <span class="bp-hero-eyebrow">{{ tierLabel.toUpperCase() }}</span>
            <span class="bp-hero-strength">{{ Math.round(animatedStrength) }}% COMPLETE</span>
          </div>
          <div class="bp-hero-body">
            <!-- Circular gauge -->
            <div class="bp-gauge-wrap">
              <svg width="108" height="108" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="7" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="7"
                  :stroke-dasharray="passportGaugeDash"
                  :stroke-dashoffset="passportGaugeOffset"
                  stroke-linecap="round"
                  transform="rotate(-90 50 50)"
                  style="transition: stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)"
                />
                <text x="50" y="46" text-anchor="middle" font-size="22" font-weight="800" fill="white">
                  {{ Math.round(animatedStrength) }}%
                </text>
                <text x="50" y="62" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.72)">
                  Profile
                </text>
                <text x="50" y="71" text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.72)">
                  Strength
                </text>
              </svg>
            </div>
            <div class="bp-hero-info">
              <div class="bp-hero-name">{{ displayName }}</div>
              <div class="bp-hero-ref">{{ tierLabel }}</div>
            </div>
          </div>
          <div class="bp-hero-actions">
            <button class="bp-hero-btn bp-hero-btn--solid" @click="goShare">View Profile</button>
            <button class="bp-hero-btn bp-hero-btn--ghost" @click="goEdit">Settings</button>
          </div>
        </div>

        <!-- White panel body -->
        <div class="bpvw-aside-body">
          <!-- Profile completion -->
          <div class="bp-pb-wrap">
            <div class="bp-pb-row">
              <span class="bp-pb-label">Profile Completion</span>
              <span class="bp-pb-pct">{{ Math.round(animatedStrength) }}%</span>
            </div>
            <div class="pb-track">
              <div class="pb-fill" :style="{ width: Math.round(animatedStrength) + '%' }" />
            </div>
            <div v-if="completionTip" class="bp-pb-tip">{{ completionTip }}</div>
          </div>

          <!-- Identity verified strip -->
          <div class="dvs-strip">
            <div class="dvs-badge-ic">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007e78" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <div class="dvs-text">
              <div class="dvs-title">Identity verified via OneID &amp; KYC Digital Verification</div>
              <div class="dvs-sub">Secured by Bank-Grade Encryption</div>
            </div>
          </div>

          <!-- Reward banner -->
          <div class="reward-banner">
            <div class="reward-icon">🎁</div>
            <div>
              <div class="reward-title">Your profile creation reward</div>
              <div class="reward-sub">
                You're almost there! Complete your profile identity and documents to
                earn exclusive rewards instantly.
              </div>
            </div>
          </div>

          <!-- Tier upgrade nudge -->
          <button
            v-if="tier !== 'PREMIUM'"
            class="upgrade-nudge"
            @click="tierDrawerOpen = true"
          >
            <div class="upgrade-star">★</div>
            <div class="upgrade-body">
              <div class="upgrade-title">
                {{ tier === 'BASIC' ? 'Upgrade to Verified' : 'Upgrade to Platinum' }}
              </div>
              <div class="upgrade-sub">
                {{ tier === 'BASIC'
                  ? 'Add powerful bonds, affordability + CFO'
                  : 'Add Equifax + lender API access — takes 2 minutes' }}
              </div>
            </div>
            <span class="upgrade-arrow">›</span>
          </button>
        </div>
      </aside><!-- /bpvw-aside -->

      <!-- ── Right content column ── -->
      <div class="bpvw-content">
      <!-- Pending access request banner (OPDA verifier flow) -->
      <button
        v-for="r in pendingRequests"
        :key="r.id"
        class="bp-access-banner"
        @click="goAccessRequest(r.id)"
      >
        <div class="bp-access-banner-ic">{{ r.org.logoEmoji || '🏦' }}</div>
        <div class="bp-access-banner-text">
          <div class="bp-access-banner-title">
            New access request · {{ r.org.name }}
          </div>
          <div class="bp-access-banner-sub">
            {{ r.requestedScopes.length }} scope{{ r.requestedScopes.length === 1 ? '' : 's' }} requested · tap to review
          </div>
        </div>
        <span class="bp-access-banner-chev">→</span>
      </button>

      <!-- ── Verified Credentials section ── -->
      <div class="section-header">
        <div class="sec-icon"><Icon name="heroicons:shield-check" class="sec-icon-svg" /></div>
        <div>
          <div class="sec-title">VERIFIED CREDENTIALS</div>
          <div class="sec-sub">Your verified information</div>
        </div>
      </div>
      <div class="tile-grid">
        <div class="tile">
          <div class="tile-head">
            <div class="tile-icon"><Icon name="heroicons:identification" class="tile-icon-svg" /></div>
            <div class="tile-title">Identity</div>
          </div>
          <div class="tile-value">Verified</div>
          <div class="tile-prov">OneID &amp; KYC Verified</div>
        </div>
        <div class="tile" :class="{ amber: !passport.fundsType }" @click="goEdit">
          <div class="tile-head">
            <div class="tile-icon" :class="{ 'amber-bg': !passport.fundsType }">
              <Icon name="heroicons:banknotes" class="tile-icon-svg" :class="{ 'icon-amber': !passport.fundsType }" />
            </div>
            <div class="tile-title">Funds</div>
          </div>
          <div class="tile-value" :class="{ amber: !passport.fundsType }">
            {{ passport.fundsType ? fundsLabelLong : 'Add proof' }}
          </div>
          <div class="tile-prov" :class="{ amber: !passport.fundsType }">
            {{ passport.fundsType ? fundsTypeLong : 'Add proof of funds' }}
          </div>
        </div>
        <div class="tile">
          <div class="tile-head">
            <div class="tile-icon"><Icon name="heroicons:link" class="tile-icon-svg" /></div>
            <div class="tile-title">Chain</div>
          </div>
          <div class="tile-value">{{ chainShortLabel }}</div>
          <div class="tile-prov">Link attached</div>
        </div>
        <div class="tile" :class="{ amber: !hasMortgageAip }" @click="goEdit">
          <div class="tile-head">
            <div class="tile-icon" :class="{ 'amber-bg': !hasMortgageAip }">
              <Icon :name="hasMortgageAip ? 'heroicons:building-library' : 'heroicons:exclamation-triangle'" class="tile-icon-svg" :class="{ 'icon-amber': !hasMortgageAip }" />
            </div>
            <div class="tile-title">Mortgage</div>
          </div>
          <div class="tile-value" :class="{ amber: !hasMortgageAip }">
            {{ hasMortgageAip ? 'AIP held' : 'Add LVR' }}
          </div>
          <div class="tile-prov" :class="{ amber: !hasMortgageAip }">
            {{ hasMortgageAip ? 'Lender verified' : 'Add LVR details' }}
          </div>
        </div>
      </div>

      <!-- ── Documents section ── -->
      <div class="section-header">
        <div class="sec-icon"><Icon name="heroicons:document-text" class="sec-icon-svg" /></div>
        <div>
          <div class="sec-title">DOCUMENTS</div>
          <div class="sec-sub">Your verified records</div>
        </div>
      </div>
      <div class="teal-card bp-docs-card">
        <div class="doc-row">
          <div class="doc-icon"><Icon name="heroicons:identification" class="doc-icon-svg" /></div>
          <div class="doc-body">
            <div class="doc-title">Identity Verification</div>
            <div class="doc-meta">OneID / KYC Process · Last verified: {{ lastVerifiedLabel }}</div>
          </div>
          <div class="doc-right">
            <span class="risk-pill clear"><Icon name="heroicons:check-16-solid" class="pill-ic" />VERIFIED</span>
            <Icon name="heroicons:chevron-right" class="doc-chev" />
          </div>
        </div>
        <div class="doc-row">
          <div class="doc-icon"><Icon name="heroicons:banknotes" class="doc-icon-svg" /></div>
          <div class="doc-body">
            <div class="doc-title">Proof of Funds</div>
            <div class="doc-meta">{{ passport.fundsType ? fundsMetaText : 'Banking or financial proof documents' }}</div>
          </div>
          <div class="doc-right">
            <span v-if="passport.fundsType" class="risk-pill clear"><Icon name="heroicons:check-16-solid" class="pill-ic" />VERIFIED</span>
            <span v-else class="risk-pill add">ADD DOCS</span>
            <Icon name="heroicons:chevron-right" class="doc-chev" />
          </div>
        </div>
        <div class="doc-row" @click="goEdit()">
          <div class="doc-icon"><Icon name="heroicons:document-text" class="doc-icon-svg" /></div>
          <div class="doc-body">
            <div class="doc-title">Mortgage in Principle</div>
            <div class="doc-meta">
              {{ hasMortgageAip
                ? 'AIP on file · lender verified'
                : 'Optional if your LVR · Lender can view or fund' }}
            </div>
          </div>
          <div class="doc-right">
            <span :class="hasMortgageAip ? 'risk-pill clear' : 'risk-pill add'">
              <Icon v-if="hasMortgageAip" name="heroicons:check-16-solid" class="pill-ic" />{{ hasMortgageAip ? 'VERIFIED' : 'ADD DOCS' }}
            </span>
            <Icon name="heroicons:chevron-right" class="doc-chev" />
          </div>
        </div>
        <div class="doc-row" @click="goEdit()">
          <div class="doc-icon"><Icon name="heroicons:link" class="doc-icon-svg" /></div>
          <div class="doc-body">
            <div class="doc-title">Chain Position</div>
            <div class="doc-meta">Existing sale information · Verify to move</div>
          </div>
          <div class="doc-right">
            <span class="risk-pill add">Link / Add details</span>
            <Icon name="heroicons:chevron-right" class="doc-chev" />
          </div>
        </div>
        <div v-if="passport.solicitorStatus === 'yes'" class="doc-row">
          <div class="doc-icon"><Icon name="heroicons:building-library" class="doc-icon-svg" /></div>
          <div class="doc-body">
            <div class="doc-title">Solicitor</div>
            <div class="doc-meta">Solicitor instructed</div>
            <div class="sol-verified">
              <Icon name="heroicons:check-16-solid" class="sol-check" />
              Confirmed on Law Society register
            </div>
          </div>
          <div class="doc-right">
            <span class="risk-pill ok"><Icon name="heroicons:check-16-solid" class="pill-ic" />INSTRUCTED</span>
            <Icon name="heroicons:chevron-right" class="doc-chev" />
          </div>
        </div>
      </div>

      </div><!-- /bpvw-content -->
      </main><!-- /bpvw-layout -->

      <!-- ── Share section (full-width below the grid) ── -->
      <section class="hsw-shell bpvw-share-section">
        <div class="section-header">
          <div class="sec-icon"><Icon name="heroicons:arrow-up-tray" class="sec-icon-svg" /></div>
          <div>
            <div class="sec-title">SHARE YOUR PROFILE</div>
            <div class="sec-sub">Connect &amp; share your profile instantly</div>
          </div>
        </div>
        <div class="bp-share-grid">
          <button class="share-card" @click="goShare">
            <div class="share-card-icon"><Icon name="heroicons:arrow-up-tray" class="share-icon-svg" /></div>
            <div class="share-card-body">
              <div class="share-card-title">Share</div>
              <div class="share-card-sub">Send to agents or professionals</div>
            </div>
            <Icon name="heroicons:chevron-right" class="share-card-chev" />
          </button>
          <button class="share-card" @click="goPdf">
            <div class="share-card-icon"><Icon name="heroicons:document-arrow-down" class="share-icon-svg" /></div>
            <div class="share-card-body">
              <div class="share-card-title">Download PDF</div>
              <div class="share-card-sub">Get a linked profile document</div>
            </div>
            <Icon name="heroicons:chevron-right" class="share-card-chev" />
          </button>
          <button class="share-card" @click="goSign">
            <div class="share-card-icon"><Icon name="heroicons:link" class="share-icon-svg" /></div>
            <div class="share-card-body">
              <div class="share-card-title">Re-link profile</div>
              <div class="share-card-sub">Expand to OneID, Equifax &amp; more</div>
            </div>
            <Icon name="heroicons:chevron-right" class="share-card-chev" />
          </button>
          <button class="share-card" @click="goEdit">
            <div class="share-card-icon"><Icon name="heroicons:pencil-square" class="share-icon-svg" /></div>
            <div class="share-card-body">
              <div class="share-card-title">Edit Profile</div>
              <div class="share-card-sub">Update your information</div>
            </div>
            <Icon name="heroicons:chevron-right" class="share-card-chev" />
          </button>
        </div>

        <!-- Privacy footer banner -->
        <div class="bp-privacy-banner">
          <div class="bp-privacy-icon">
            <Icon name="heroicons:lock-closed" class="bp-privacy-icon-svg" />
          </div>
          <div class="bp-privacy-text">
            <div class="bp-privacy-title">Your privacy &amp; data security is our priority</div>
            <div class="bp-privacy-sub">All information is encrypted and securely stored. You control what you share.</div>
          </div>
          <button class="bp-privacy-btn" @click="router.push('/legal/privacy')">Privacy &amp; Security</button>
        </div>
      </section>
    </template>

    <!-- Tier upgrade drawer (Stripe checkout) -->
    <TierUpgradeDrawer
      :open="tierDrawerOpen"
      :current-tier="tier"
      @close="tierDrawerOpen = false"
      @tier-changed="onTierChanged"
    />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  useBuyerProfile,
  type BuyerProfile,
} from '~/composables/useBuyerProfile'
import {
  useVerifierAccess,
  type AccessRequest,
} from '~/composables/useVerifierAccess'
import { useProfile } from '~/composables/useProfile'
import { useAppToast } from '~/composables/useCustomToast'
import TierUpgradeDrawer from '~/components/buyer-profile/TierUpgradeDrawer.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ title: 'Buyer Profile — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile } = useBuyerProfile()
const { listRequests } = useVerifierAccess()
const { fetchProfile, profile } = useProfile()
const { showToast } = useAppToast()

const passport = ref<BuyerProfile | null>(null)
const loading = ref(true)
const tierDrawerOpen = ref(false)
const accessRequests = ref<AccessRequest[]>([])
const pendingRequests = computed(() =>
  accessRequests.value.filter((r) => r.status === 'PENDING'),
)
function goAccessRequest(id: string) {
  router.push(`/buyer-profile/access-request/${id}`)
}

const goBack = useGoBack('/buyer-profile')

onMounted(async () => {
  fetchProfile?.().catch(() => {})
  // Verifier requests load in parallel — never blocks the badge.
  listRequests()
    .then((rs) => { accessRequests.value = rs })
    .catch(() => { /* silent */ })
  try {
    const data = await getBuyerProfile()
    passport.value = data
    if (!data) {
      router.replace('/buyer-profile')
      return
    }
  } catch {
    router.replace('/buyer-profile')
  } finally {
    loading.value = false
  }
})

// ── Tier ─────────────────────────────────────────────────────
const tier = computed<'BASIC' | 'VERIFIED' | 'PREMIUM'>(
  () => ((passport.value as any)?.tier as any) || 'BASIC',
)
const tierLabel = computed(() => {
  if (tier.value === 'PREMIUM') return 'Platinum Buyer'
  if (tier.value === 'VERIFIED') return 'Verified Buyer'
  return 'Trusted Buyer'
})

async function onTierChanged(_t: string) {
  const p = await getBuyerProfile()
  if (p) passport.value = p
  showToast({ message: 'Tier updated', iconEmoji: '✓' })
}

// ── Strength gauge (animated) ────────────────────────────────
const strength = computed(() => {
  const p: any = passport.value
  if (!p) return 0
  if (typeof p.strengthScore === 'number') return p.strengthScore
  return 0
})

const animatedStrength = ref(0)
let strengthRaf = 0
function tweenStrength(to: number) {
  // SSR-safe: no rAF on the server (the immediate watcher runs during SSR).
  const reduce =
    typeof window === 'undefined' ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) { animatedStrength.value = to; return }
  cancelAnimationFrame(strengthRaf)
  const from = animatedStrength.value
  if (from === to) return
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / 900)
    const eased = 1 - Math.pow(1 - t, 3)
    animatedStrength.value = from + (to - from) * eased
    if (t < 1) strengthRaf = requestAnimationFrame(tick)
  }
  strengthRaf = requestAnimationFrame(tick)
}
watch(strength, (v) => tweenStrength(Number(v) || 0), { immediate: true })
onBeforeUnmount(() => cancelAnimationFrame(strengthRaf))

// SVG gauge — r=40 → circumference ≈ 251
const passportGaugeDash = 251
const passportGaugeOffset = computed(
  () => passportGaugeDash - (passportGaugeDash * animatedStrength.value) / 100,
)

// ── Display labels ───────────────────────────────────────────
const displayName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return profile.value?.email?.split('@')[0] || 'Buyer'
})

const fundsLabelShort = computed(() => {
  const amt = passport.value?.fundsAmount
  if (!amt) return ''
  if (amt >= 1_000_000) return `£${(amt / 1_000_000).toFixed(1)}M`
  if (amt >= 1000) return `£${Math.round(amt / 1000)}K`
  return `£${amt}`
})

const fundsLabelLong = computed(() => fundsLabelShort.value)

const fundsTypeLong = computed(() => {
  const t = passport.value?.fundsType
  if (t === 'mortgage') return 'Mortgage in principle'
  if (t === 'cash') return 'Cash buyer'
  if (t === 'help') return 'Help to Buy scheme'
  return 'Not yet verified'
})

const fundsMetaText = computed(() => {
  const t = passport.value?.fundsType
  const amt = fundsLabelShort.value
  if (t === 'mortgage') return `Mortgage in principle · ${amt} verified`
  if (t === 'cash') return `Cash buyer · ${amt} on deposit`
  if (t === 'help') return `Help to Buy scheme · ${amt} max`
  return 'Add your funds proof to unlock'
})

const chainShortLabel = computed(() => {
  const c = passport.value?.chainPosition
  if (c === 'sold') return 'Chain free'
  if (c === 'selling') return 'Selling'
  if (c === 'ftb') return 'First-time'
  if (c === 'renting') return 'Renting'
  return 'Add chain'
})

const idTypeLabel = computed(() => {
  const t = passport.value?.idDocumentType
  if (t === 'passport') return 'UK / EU Passport'
  if (t === 'drivingLicence') return 'UK Driving Licence'
  if (t === 'nationalId') return 'National ID Card'
  return 'Photo ID'
})

const hasMortgageAip = computed(
  () => passport.value?.fundsType === 'mortgage' && !!passport.value?.fundsDocumentUrl,
)

const lastVerifiedLabel = computed(() => {
  const iso =
    (passport.value as any)?.identityVerifiedAt ||
    (passport.value as any)?.verifiedAt ||
    (passport.value as any)?.updatedAt ||
    (passport.value as any)?.createdAt
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

const completionTip = computed(() => {
  if (animatedStrength.value >= 95) return ''
  if (!hasMortgageAip.value) return '+ Add Mortgage AIP to reach 100% Platinum'
  if (!passport.value?.statement) return '+ Add your story to reach 100% Platinum'
  return '+ Upgrade your tier to reach 100% Platinum'
})

function formatSignedAt(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ── Navigation ───────────────────────────────────────────────
function goShare(_e?: MouseEvent) { router.push('/buyer-profile/share') }
function goPdf() { router.push('/buyer-profile/pdf') }
function goSign() { router.push('/buyer-profile/sign') }
function goEdit() { router.push('/buyer-profile/build') }
</script>

<style scoped>
.bp-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: hidden;
}

/* ── Ambient orbs ── */
.bp-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.bp-ambient-a { width: 560px; height: 560px; top: -140px; left: -160px; background: radial-gradient(circle, rgba(0,161,154,0.13) 0%, transparent 70%); }
.bp-ambient-b { width: 480px; height: 480px; bottom: 10%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.11) 0%, transparent 70%); }
.bp-mesh { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(rgba(0,161,154,0.04) 1px, transparent 1px); background-size: 28px 28px; }

/* ── Web nav ── */
.hsw-nav { position: sticky; top: 0; z-index: 100; background: rgba(243,242,239,0.88); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(35,29,69,0.07); }
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { display: flex; align-items: center; gap: 10px; font-size: 19px; font-weight: 800; letter-spacing: -0.4px; color: #231d45; background: none; border: none; cursor: pointer; flex-shrink: 0; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; align-items: center; gap: 4px; }
.hsw-links button { background: none; border: none; font-size: 13.5px; font-weight: 600; color: #516070; padding: 7px 13px; border-radius: 10px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-links button:hover { color: #231d45; background: rgba(0,0,0,0.05); }
.hsw-links button.active { color: #00a19a; font-weight: 700; background: rgba(0,161,154,0.08); }
.hsw-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.hsw-iconbtn { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #00a19a; background: rgba(0,161,154,0.08); border: 1px solid rgba(0,161,154,0.2); border-radius: 10px; padding: 7px 13px; cursor: pointer; font-family: inherit; }
.hsw-back { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #516070; background: rgba(255,255,255,0.8); border: 1px solid rgba(173,201,231,0.5); border-radius: 10px; padding: 7px 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-back svg { width: 15px; height: 15px; flex-shrink: 0; }
.hsw-back:hover { color: #231d45; border-color: #b9d5ea; }
.hsw-help { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #231d45; background: rgba(255,255,255,0.9); border: 1px solid rgba(173,201,231,0.5); border-radius: 10px; padding: 7px 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.hsw-help:hover { background: #fff; border-color: #b9d5ea; }

/* ── Page hero (app eyebrow-dash + H1 pattern) ── */
.bpvw-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 34px 0 6px; }
.bpvw-hero-text { min-width: 0; }
.bpvw-eyebrow {
  display: inline-flex; align-items: center; gap: 9px; margin: 0 0 12px;
  font-size: 12.5px; font-weight: 700; letter-spacing: 1.75px;
  text-transform: uppercase; color: #00a19a;
}
.bpvw-eyebrow-dash { width: 22px; height: 2px; border-radius: 2px; background: currentColor; }
.bpvw-h1 {
  margin: 0; font-size: clamp(28px, 3.4vw, 40px); font-weight: 800;
  line-height: 1.08; letter-spacing: -0.02em; color: #231d45;
}
.bpvw-h1-accent { color: #00a19a; }
.bpvw-sub {
  margin: 14px 0 0; max-width: 480px; font-size: 15.5px;
  font-weight: 500; line-height: 1.6; color: #5b6e86;
}
.bpvw-help {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: #231d45;
  background: #fff; border: 1px solid rgba(173,201,231,0.5);
  border-radius: 100px; padding: 9px 16px; cursor: pointer; font-family: inherit;
  transition: all 0.18s;
}
.bpvw-help:hover { border-color: #b9d5ea; box-shadow: 0 4px 12px rgba(15,44,76,0.08); }

/* ── Two-column layout ── */
.bpvw-layout { display: grid; grid-template-columns: 380px minmax(0,1fr); gap: 32px; align-items: start; padding: 24px 0 28px; }

/* Left column is ONE tall white panel that fills the row height */
.bpvw-aside {
  display: flex; flex-direction: column;
  background: #fff;
  border: 1px solid #e8eef5;
  border-radius: 24px;
  box-shadow: 0 14px 36px rgba(15, 44, 76, 0.07);
  overflow: hidden;
  animation: bp-fadeUp 0.4s 0.1s both;
}
.bpvw-aside-body {
  display: flex; flex-direction: column; gap: 18px;
  padding: 22px;
}
.bpvw-content { display: flex; flex-direction: column; align-items: stretch; gap: 28px; min-width: 0; }
.bpvw-content > * { width: 100%; }

/* ── Loading / empty ── */
.bp-loading { padding: 80px 22px; text-align: center; color: #6b6783; font-size: 13px; font-weight: 600; }
.bp-empty { margin: 36px auto; max-width: 560px; border-radius: 22px; border: 1px solid rgba(174,201,231,0.48); background: linear-gradient(160deg,rgba(255,255,255,0.92) 0%,rgba(242,250,255,0.9) 52%,rgba(236,255,249,0.95) 100%); box-shadow: 0 14px 34px rgba(17,52,88,0.12),inset 0 1px 0 rgba(255,255,255,0.96); padding: 60px 22px; text-align: center; }
.bp-empty-ic { font-size: 48px; margin-bottom: 12px; }
.bp-empty-title { font-size: 18px; font-weight: 800; color: #231d45; margin-bottom: 8px; }
.bp-empty-sub { font-size: 13px; color: #6b6783; line-height: 1.55; max-width: 22rem; margin: 0 auto 18px; }

/* ── Pending access request banner ── */
.bp-access-banner { background: linear-gradient(135deg, #fef3c7, #fffaf0); border: 1.5px solid #f0b460; border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; font-family: inherit; animation: bp-pulse-glow 2s ease-in-out infinite; width: 100%; }
.bp-access-banner-ic { width: 38px; height: 38px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(212,130,42,0.18); }
.bp-access-banner-text { flex: 1; min-width: 0; }
.bp-access-banner-title { font-size: 12.5px; font-weight: 800; color: #231d45; }
.bp-access-banner-sub { font-size: 11px; color: #6b6783; margin-top: 1px; }
.bp-access-banner-chev { font-size: 16px; font-weight: 800; color: #c4821a; }
@keyframes bp-pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(240,180,96,0.4); } 50% { box-shadow: 0 0 0 6px rgba(240,180,96,0); } }

@keyframes bp-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Hero card (flush to top of white panel) ── */
.hero-card {
  background: linear-gradient(150deg, #00b6ae 0%, #009a93 48%, #00514d 100%);
  padding: 26px 26px 26px;
  color: white;
  position: relative; overflow: hidden;
  flex-shrink: 0;
}
.hero-card::after {
  content: ''; position: absolute; top: -40%; right: -20%;
  width: 320px; height: 320px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 65%);
  pointer-events: none;
}
.hero-card > * { position: relative; z-index: 1; }
.bp-hero-top {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 18px;
}
.bp-hero-eyebrow {
  font-size: 10px; font-weight: 800; letter-spacing: 1.4px;
  color: rgba(255, 255, 255, 0.6);
}
.bp-hero-strength {
  font-size: 10px; font-weight: 800;
  background: rgba(255, 255, 255, 0.95); color: #007e78;
  border-radius: 100px; padding: 5px 12px;
  letter-spacing: 0.4px;
}
.bp-hero-body {
  display: flex; align-items: center; gap: 18px;
  margin-bottom: 20px;
}
.bp-gauge-wrap { flex-shrink: 0; }
.bp-hero-info { flex: 1; min-width: 0; }
.bp-hero-name {
  font-size: 22px; font-weight: 800; color: white;
  margin-bottom: 4px; letter-spacing: -0.4px;
}
.bp-hero-ref {
  font-size: 13px; color: rgba(255, 255, 255, 0.72);
  font-weight: 600;
}
.bp-hero-actions { display: flex; gap: 10px; }
.bp-hero-btn {
  flex: 1; font-size: 13.5px; font-weight: 800; font-family: inherit;
  border-radius: 12px; padding: 12px; cursor: pointer;
  transition: all 0.18s;
}
.bp-hero-btn--solid {
  background: #fff; color: #007e78; border: none;
}
.bp-hero-btn--solid:hover { background: #f2faf8; }
.bp-hero-btn--ghost {
  background: rgba(255,255,255,0.12); color: #fff;
  border: 1.5px solid rgba(255,255,255,0.4);
}
.bp-hero-btn--ghost:hover { background: rgba(255,255,255,0.2); }

/* ── Profile completion bar ── */
.bp-pb-wrap {
  animation: bp-fadeUp 0.4s 0.15s both;
}
.bp-pb-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
}
.bp-pb-label { font-size: 12px; font-weight: 700; color: #231d45; }
.bp-pb-pct { font-size: 12px; font-weight: 800; color: #00a19a; }
.pb-track {
  height: 10px; background: #ececef; border-radius: 100px; overflow: hidden;
}
.pb-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a19a, #00b6ae);
  border-radius: 100px;
  transition: width 1s 0.4s cubic-bezier(.22, 1, .36, 1);
}
.bp-pb-tip {
  font-size: 11px; font-weight: 700; color: #007e78;
  margin-top: 7px;
}

/* ── Identity verified strip ── */
.dvs-strip {
  background: #f2faf8;
  border: 1px solid #d8efeb;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  animation: bp-fadeUp 0.4s 0.18s both;
}
.dvs-badge-ic {
  width: 36px; height: 36px; border-radius: 10px;
  background: #fff; border: 1px solid #d8efeb;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.dvs-text { min-width: 0; }
.dvs-title { font-size: 12.5px; font-weight: 800; color: #17314a; line-height: 1.3; }
.dvs-sub { font-size: 11px; font-weight: 600; color: #6b6783; margin-top: 2px; }

/* ── Reward banner ── */
.reward-banner {
  background: #f7f6fc;
  border: 1px solid #ebe8f6;
  border-radius: 14px;
  padding: 16px;
  display: flex; align-items: flex-start; gap: 12px;
}
.reward-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
.reward-title { font-size: 13px; font-weight: 800; color: #231d45; margin-bottom: 4px; }
.reward-sub { font-size: 11.5px; color: #6b6783; line-height: 1.5; }

/* ── Tier upgrade nudge ── */
.upgrade-nudge {
  background: linear-gradient(135deg, #fffaf0, #fff6e8);
  border: 1px solid #f5e4c4;
  border-radius: 14px;
  padding: 16px;
  display: flex; align-items: center; gap: 14px;
  font-family: inherit; cursor: pointer; text-align: left; width: 100%;
  transition: all 0.2s cubic-bezier(.22,1,.36,1);
}
.upgrade-nudge:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(196,130,26,0.14); }
.upgrade-star { font-size: 20px; flex-shrink: 0; color: #231d45; }
.upgrade-body { flex: 1; min-width: 0; }
.upgrade-title { font-size: 14px; font-weight: 800; color: #231d45; }
.upgrade-sub { font-size: 12px; color: #8a7a5a; margin-top: 2px; }
.upgrade-arrow { font-size: 20px; font-weight: 800; color: #c4821a; }

/* ── Section header ── */
.section-header {
  display: flex; align-items: center; gap: 12px;
  padding: 4px 0 6px;
}
.sec-icon {
  width: 36px; height: 36px; border-radius: 11px;
  background: linear-gradient(135deg, #00b6ae, #007e78);
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.28);
  display: flex; align-items: center; justify-content: center;
  color: white; flex-shrink: 0;
}
.sec-icon-svg { width: 19px; height: 19px; color: #fff; }
.sec-title { font-size: 15px; font-weight: 800; color: #231d45; letter-spacing: 0.6px; }
.sec-sub { font-size: 12px; color: #6b6783; margin-top: 1px; }

/* ── Tile grid ── */
.tile-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0;
}
.tile {
  background: white; border-radius: 18px;
  padding: 20px 20px 18px;
  border: 1.5px solid #eef2f7;
  box-shadow: 0 2px 10px rgba(15, 44, 76, 0.04);
  transition: all 0.22s cubic-bezier(.22, 1, .36, 1);
  display: flex; flex-direction: column;
}
.tile:hover {
  transform: translateY(-3px);
  border-color: #b5d8f0;
  box-shadow: 0 10px 28px rgba(15, 44, 76, 0.1);
}
.tile.amber { border-color: #f3d489; background: linear-gradient(180deg, #fffdf8, #fffaf0); }
.tile-head {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 16px;
}
.tile-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: #eef6f4;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.tile-icon.amber-bg { background: #fbeed4; }
.tile-icon-svg { width: 22px; height: 22px; color: #00a19a; }
.tile-icon-svg.icon-amber { color: #d99a2b; }
.tile-title {
  font-size: 12px; font-weight: 700; color: #8a97a8;
  text-transform: uppercase; letter-spacing: 0.8px;
}
.tile-value { font-size: 20px; font-weight: 800; color: #009a93; margin-bottom: 12px; letter-spacing: -0.3px; }
.tile-value.amber { color: #c4821a; }
.tile-prov {
  font-size: 10.5px; font-weight: 700; color: #007e78;
  background: #edf9f7; border: 1px solid #c8ece9;
  border-radius: 100px; padding: 5px 12px;
  align-self: flex-start;
  cursor: pointer;
}
.tile-prov.amber {
  color: #c4821a; background: #fbefd9; border-color: #f0c96a; cursor: pointer;
}

/* ── Documents card ── */
.teal-card {
  background: white;
  border: 2px solid #00a19a;
  border-radius: 18px;
  box-shadow: 0 6px 22px rgba(0, 161, 154, 0.1);
}
.bp-docs-card {
  overflow: hidden;
  animation: bp-fadeUp 0.4s 0.3s both;
}
.doc-row {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid #f1f3f6;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.doc-row:last-child { border-bottom: none; }
.doc-row:hover { background: #fafafa; }
.doc-icon {
  width: 38px; height: 38px; border-radius: 11px;
  background: #f2faf8;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.doc-icon-svg { width: 20px; height: 20px; color: #3a4a5e; }
.doc-body { flex: 1; min-width: 0; }
.doc-title {
  font-size: 14.5px; font-weight: 800; color: #231d45;
}
.doc-meta {
  font-size: 12px; color: #6b6783; margin-top: 2px;
}
.doc-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.doc-right--col { flex-direction: column; align-items: flex-end; gap: 4px; }
.doc-chev { width: 18px; height: 18px; color: #9c98ad; flex-shrink: 0; }

.risk-pill {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 10px; font-weight: 800;
  padding: 4px 9px; border-radius: 100px;
  white-space: nowrap; letter-spacing: 0.3px;
}
.pill-ic { width: 12px; height: 12px; }
.risk-pill.clear {
  background: #f2faf8; color: #007e78; border: 1px solid #e5f4f2;
}
.risk-pill.flag {
  background: #fbefd9; color: #e6a23c;
}
.risk-pill.ok {
  background: #e8f5ee; color: #2eab55; border: 1px solid #b8e8c8;
}
.risk-pill.add {
  background: #fbefd9; color: #c4821a; border: 1px solid #e6a23c;
}

.sol-verified {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #007e78;
  margin-top: 3px;
}
.sol-check { width: 12px; height: 12px; color: #007e78; }

/* ── Share section (full-width below grid) ── */
.bpvw-share-section {
  display: flex; flex-direction: column; gap: 20px;
  padding-bottom: 80px;
}
.bp-share-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: stretch;          /* equal height across the row */
  animation: bp-fadeUp 0.4s 0.4s both;
}
.share-card {
  background: white;
  border: 1.5px solid #e8eef5;
  border-radius: 18px;
  padding: 20px;
  display: flex; flex-direction: column; align-items: flex-start;
  cursor: pointer; font-family: inherit; text-align: left;
  transition: all 0.2s cubic-bezier(.22,1,.36,1);
  box-shadow: 0 2px 10px rgba(15,44,76,0.05);
}
.share-card:hover {
  transform: translateY(-3px);
  border-color: #a8d5c8;
  box-shadow: 0 10px 28px rgba(0,161,154,0.12);
}
.share-card-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: #eef6f4;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px; flex-shrink: 0;
}
.share-icon-svg { width: 21px; height: 21px; color: #007e78; display: block; }
.share-card-body { width: 100%; }
.share-card-title { font-size: 15px; font-weight: 800; color: #231d45; margin-bottom: 4px; }
.share-card-sub {
  font-size: 12.5px; color: #6b6783; line-height: 1.5;
}
/* chevron sits just under the text, pushed to the right; margin-top:auto keeps
   it at the bottom only when grid-stretch makes a card taller than its content */
.share-card-chev {
  align-self: flex-end;
  margin-top: auto;
  padding-top: 12px;
  width: 18px; height: 18px; color: #b5bdc9;
  display: block;
}

/* ── Privacy footer banner ── */
.bp-privacy-banner {
  display: flex; align-items: center; gap: 16px;
  background: #f0f4fa;
  border: 1.5px solid #dce6f0;
  border-radius: 16px;
  padding: 18px 22px;
  animation: bp-fadeUp 0.4s 0.45s both;
}
.bp-privacy-icon {
  width: 40px; height: 40px; border-radius: 12px;
  background: white; border: 1px solid #dce6f0;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.bp-privacy-icon-svg { width: 20px; height: 20px; color: #231d45; }
.bp-privacy-text { flex: 1; min-width: 0; }
.bp-privacy-title { font-size: 13px; font-weight: 800; color: #231d45; margin-bottom: 2px; }
.bp-privacy-sub { font-size: 11px; color: #627891; line-height: 1.4; }
.bp-privacy-btn {
  background: #231d45; color: white; border: none;
  border-radius: 10px; padding: 10px 18px;
  font-size: 12px; font-weight: 800; font-family: inherit;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: background 0.18s;
}
.bp-privacy-btn:hover { background: #17314a; }

/* ── CTA button (shared) ── */
.cta-btn {
  width: 100%;
  background: #00a19a; color: white; border: none;
  border-radius: 14px;
  padding: 16px;
  font-size: 14px; font-weight: 800; font-family: inherit;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.35);
  cursor: pointer;
  margin-top: 12px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.cta-btn:hover {
  background: #00b6ae;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.32);
}

/* Tablet: 2-column layout collapses, share goes 2-up */
@media (max-width: 1080px) {
  .bp-share-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 980px) {
  .bpvw-layout { grid-template-columns: 1fr; align-items: start; gap: 24px; }
  .tile-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .bp-privacy-banner { flex-wrap: wrap; }
  .upgrade-nudge { margin-top: 0; }
}
@media (max-width: 760px) {
  .hsw-links, .hsw-cta { display: none; }
  .bpvw-layout { padding: 20px 0 20px; gap: 20px; }
  .bpvw-share-section { padding-bottom: 56px; gap: 16px; }
  .bpvw-hero { padding: 24px 0 4px; }
  .bp-share-grid { gap: 14px; }
  .share-card { padding: 18px 16px; }
  .share-card-icon { width: 40px; height: 40px; margin-bottom: 12px; }
  .doc-row { padding: 14px 14px; gap: 12px; }
  .doc-icon { width: 34px; height: 34px; }
  .bp-hero-name { font-size: 19px; }
}
@media (max-width: 560px) {
  /* Stack credential tiles + share cards to a single column on phones */
  .tile-grid { grid-template-columns: 1fr; }
  .bp-share-grid { grid-template-columns: 1fr; }
  .bpvw-aside-body { padding: 18px; gap: 14px; }
  .hero-card { padding: 22px 20px 20px; }
  .bp-hero-body { gap: 14px; }
  /* Privacy banner: button drops below text, full-width */
  .bp-privacy-banner { padding: 16px 18px; }
  .bp-privacy-btn { width: 100%; }
  .doc-title { font-size: 13.5px; }
  .doc-meta { font-size: 11px; }
  .bpvw-help span, .bpvw-help { font-size: 12px; }
}
</style>
