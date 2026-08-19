<template>
  <div class="pb-shell">
    <WebTopNav>
      <template #actions>
        <button class="pb-nav-back" type="button" @click="onBack">
          <Icon name="i-lucide-arrow-left" /> Back
        </button>
      </template>
    </WebTopNav>

    <div class="pb-page">
      <!-- ── Page head ─────────────────────────────────────────────── -->
      <div class="pb-head anim-1">
        <div class="pb-head-eyebrow">Your passport dashboard</div>
        <h1 class="pb-head-title">Build your Property Passport</h1>
        <div class="pb-head-sub">
          <Icon name="i-lucide-map-pin" /> {{ addressLine }}
        </div>
      </div>

      <div class="pb-cols">
        <div class="pb-main">
      <!-- ── Hero: the two scores + what moves them ───────────────── -->
      <section class="pb-hero anim-1">
        <div class="pb-hero-top">
          <div class="pb-hero-eyebrow">
            <Icon name="i-lucide-shield" />
            Your passport progress
          </div>
          <span class="pb-hero-chip">
            <Icon name="i-lucide-bell" /> Updates as you add docs
          </span>
        </div>

        <div class="pb-hero-main">
          <div class="pb-hero-rings">
            <div class="pb-ring-block">
              <span class="pb-ring">
                <svg viewBox="0 0 72 72" aria-hidden="true">
                  <circle class="pb-ring-track" cx="36" cy="36" r="30" />
                  <circle
                    class="pb-ring-fill"
                    cx="36"
                    cy="36"
                    r="30"
                    stroke-dasharray="188.5"
                    :stroke-dashoffset="188.5 - (188.5 * homeScorePct) / 100"
                  />
                </svg>
                <span class="pb-ring-val"><b>{{ homeScore || '—' }}</b></span>
              </span>
              <span class="pb-ring-cap">HomeScore</span>
              <span class="pb-ring-sub accent">{{ homeScoreBand }}</span>
            </div>

            <div class="pb-ring-block">
              <span class="pb-ring">
                <svg viewBox="0 0 72 72" aria-hidden="true">
                  <circle class="pb-ring-track" cx="36" cy="36" r="30" />
                  <circle
                    class="pb-ring-fill accent"
                    cx="36"
                    cy="36"
                    r="30"
                    stroke-dasharray="188.5"
                    :stroke-dashoffset="188.5 - (188.5 * passportPct) / 100"
                  />
                </svg>
                <span class="pb-ring-val"><b>{{ passportPct }}</b><i>%</i></span>
              </span>
              <span class="pb-ring-cap">Passport</span>
              <span class="pb-ring-sub">
                {{ hasPassport ? 'Add your documents' : 'Not started yet' }}
              </span>
            </div>
          </div>

          <div class="pb-hero-right">
            <p class="pb-hero-note">
              Add key documents to reach <b>60%</b> and unlock
              <b>Move Ready</b>.
            </p>
            <button class="pb-hero-btn" type="button" @click="goToMilestones">
              See milestones <Icon name="i-lucide-arrow-right" />
            </button>
          </div>
        </div>

        <div class="pb-hero-foot">
          <span class="pb-hero-foot-ic"><Icon name="i-lucide-bar-chart-3" /></span>
          Add documents and evidence to build your Passport and unlock
          <b>Move Ready</b>.
        </div>
      </section>

      <!-- ── EPC age nudge ────────────────────────────────────────── -->
      <section v-if="epcYear" class="pb-epc anim-2">
        <img class="pb-epc-ic" src="/homescore-icon/epcAssessment.png" alt="" loading="lazy" />
        <div class="pb-epc-body">
          <div class="pb-epc-title">Your EPC is from {{ epcYear }}</div>
          <p class="pb-epc-sub">
            An updated EPC brings your public energy record up to date and
            strengthens your Passport.
          </p>
        </div>
        <button class="pb-epc-btn" type="button" @click="goToMarketplace">
          Arrange a new EPC
          <Icon name="i-lucide-arrow-right" />
        </button>
      </section>

      <!-- ── Add to your passport ─────────────────────── -->
      <div class="pb-section-h">
        <Icon name="i-lucide-paperclip" />
        Add to your Passport
        <span v-if="!hasPassport">(after claiming your property)</span>
      </div>
      <div class="pb-doc-grid anim-2">
        <div
          v-for="d in docTiles"
          :key="d.title"
          class="pb-doc-card"
          :class="{ locked: !hasPassport }"
        >
          <img class="pb-doc-ic" :src="d.icon" alt="" loading="lazy" />
          <div class="pb-doc-title">{{ d.title }}</div>
          <div class="pb-doc-sub">{{ d.sub }}</div>
          <span v-if="!hasPassport" class="pb-doc-lock">
            <Icon name="i-lucide-lock" />
          </span>
        </div>
      </div>
      <p v-if="!hasPassport" class="pb-note">
        <Icon name="i-lucide-lock" />
        You'll be able to add these once you've claimed your property.
      </p>

      <!-- ── Professional evidence ───────────────────── -->
      <div class="pb-section-h">
        <Icon name="i-lucide-user-round" />
        Get professional evidence
      </div>
      <div class="pb-pro-card anim-3">
        <button
          v-for="p in proServices"
          :key="p.title"
          class="pb-pro-row"
          type="button"
          @click="goToMarketplace"
        >
          <img class="pb-pro-ic" :src="p.icon" alt="" loading="lazy" />
          <span class="pb-pro-body">
            <span class="pb-pro-title">{{ p.title }}</span>
            <span class="pb-pro-sub">{{ p.sub }}</span>
          </span>
          <Icon name="i-lucide-chevron-right" class="pb-pro-chev" />
        </button>
      </div>
      <p class="pb-note">
        <Icon name="i-lucide-lock" />
        Professional bookings link to your Passport once claimed.
      </p>

        </div><!-- /pb-main -->

        <aside class="pb-side">
      <!-- ── Claim / open CTA ─────────────────────────────
           Same card either way — only the copy and the destination change,
           so an already-claimed property never reads "claim to get started". -->
      <section class="pb-claim anim-4">
        <span class="pb-claim-art">
          <img
            src="/op-icons/passportview/umu-passport.png"
            alt="Property Passport"
            loading="lazy"
          />
        </span>

        <h2 class="pb-claim-title">
          {{ hasPassport ? 'Your Passport is ready to build' : 'Claim your Passport to get started' }}
        </h2>
        <p class="pb-claim-lede">
          <template v-if="hasPassport">
            Your Passport is live for this property. Open it to add documents,
            invite your solicitor or agent, and publish it when you're ready.
          </template>
          <template v-else>
            Your Passport is free. To confirm you own this property, you'll
            need to verify ownership and complete ID checks. This one-off step
            keeps your Passport secure and trusted.
          </template>
        </p>

        <ul class="pb-claim-points">
          <li v-for="c in claimPoints" :key="c.title">
            <span class="pb-claim-tick"><Icon name="i-lucide-check" /></span>
            <span class="pb-claim-point-txt">
              <b>{{ c.title }}</b>
              <span>{{ c.sub }}</span>
            </span>
          </li>
        </ul>

        <button
          class="pb-claim-btn"
          type="button"
          @click="hasPassport ? goToPassportView() : goToClaim()"
        >
          <span class="pb-claim-btn-main">
            <Icon :name="hasPassport ? 'i-lucide-book-open' : 'i-lucide-lock'" />
            {{ hasPassport ? 'Open my Passport' : 'Claim my Passport' }}
          </span>
          <span class="pb-claim-btn-note">
            {{ hasPassport ? 'Add documents & publish' : 'One-off fee to verify ownership' }}
            <Icon name="i-lucide-arrow-right" />
          </span>
        </button>

        <button
          v-if="!hasPassport"
          class="pb-claim-link"
          type="button"
          @click="navigateTo('/onboarding/signin')"
        >
          I already have an account →
        </button>
      </section>

      <p class="pb-privacy">
        <Icon name="i-lucide-shield" />
        Your data is secure. Your Passport is private and only shared when you
        choose.
      </p>
        </aside>
      </div><!-- /pb-cols -->
    </div>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const propertyId = computed(() => String(route.params.id))

const property = ref<any>(null)

onMounted(async () => {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId.value}`,
    )
    if (res.ok) property.value = await res.json()
  } catch {
    /* keep null — the page degrades to its empty-state copy */
  }
})

const addressLine = computed(() => {
  const p: any = property.value
  if (!p) return 'Your property'
  return [p.addressLine1 ?? p.address, p.postcode].filter(Boolean).join(' · ')
})

// HomeScore comes straight off the EPC — no estimate, no placeholder.
const homeScore = computed(() => {
  const p: any = property.value
  return Number(p?.epcScore ?? p?.epcCert?.epcScore ?? 0) || 0
})
const homeScorePct = computed(() =>
  Math.max(0, Math.min(100, homeScore.value)),
)

const epcYear = computed(() => {
  const p: any = property.value
  const raw = p?.lodgementDate ?? p?.epcCert?.lodgementDate ?? p?.epcLodgementDate ?? null
  if (!raw) return null
  const y = new Date(raw).getFullYear()
  return Number.isFinite(y) ? y : null
})

const hasPassport = computed(() => Boolean(property.value?.hasPassport))
// Nothing has been uploaded before the property is claimed, so this is a
// real 0 rather than a stand-in. Once a passport exists the backend owns
// the number — until that endpoint lands we show the claimed state instead
// of inventing a percentage.
const passportPct = computed(() => (hasPassport.value ? 0 : 0))

// Band label under the HomeScore ring — same wording the score view uses.
const homeScoreBand = computed(() => {
  const v = homeScore.value
  if (!v) return 'No EPC on record'
  if (v >= 80) return 'Top of the street'
  if (v >= 60) return 'Above average'
  if (v >= 40) return 'Around average'
  return 'Below average'
})

const docTiles = [
  {
    icon: '/homescore-icon/utilityBills.png',
    title: 'Utility bills',
    sub: 'Show your real energy use',
  },
  {
    icon: '/homescore-icon/clipboardChecklist.png',
    title: 'Certificates & reports',
    sub: 'EPC, warranties, inspections & more',
  },
  {
    icon: '/homescore-icon/house.png',
    title: 'Property documents',
    sub: 'Deeds, plans, guarantees & more',
  },
  {
    icon: '/homescore-icon/camera.png',
    title: 'Photos & evidence',
    sub: 'Add photos to support your record',
  },
]

const proServices = [
  {
    icon: '/homescore-icon/gasSafety.png',
    title: 'Book a Gas Safe engineer',
    sub: 'Service your boiler · cert auto-lands in your Passport',
  },
  {
    icon: '/homescore-icon/electrician.png',
    title: 'Book an electrician (EICR)',
    sub: 'Electrical inspection · from £150',
  },
  {
    icon: '/homescore-icon/epcAssessment.png',
    title: 'New EPC assessment',
    sub: 'From £60 · required if yours is 10+ years old',
  },
]

const claimPoints = computed(() =>
  hasPassport.value
    ? [
        {
          title: 'Add your documents',
          sub: 'Bills, certificates, deeds and photos',
        },
        {
          title: 'Invite collaborators',
          sub: 'Your solicitor, agent or co-owner',
        },
        {
          title: 'Publish when ready',
          sub: 'You control what buyers can see',
        },
      ]
    : [
        {
          title: 'Confirm ownership',
          sub: 'Verify you own this property',
        },
        {
          title: 'ID verification (KYC)',
          sub: 'Quick & secure identity checks',
        },
        {
          title: 'Secure & private',
          sub: 'Your data is encrypted and only you control it',
        },
      ],
)

function goToClaim() {
  router.push(`/claim/${propertyId.value}`)
}
function goToPassportView() {
  router.push(`/passportview/${propertyId.value}`)
}
function goToPathway() {
  router.push(`/homescore/pathway/${propertyId.value}?from=landing`)
}
function goToMilestones() {
  router.push(`/homescore/pathway/${propertyId.value}?from=landing`)
}
function goToMarketplace() {
  router.push('/marketplace')
}
function onBack() {
  router.back()
}
</script>

<style scoped>
.pb-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #231d45;
}
.pb-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #f3f2ef;
  pointer-events: none;
}
.pb-page {
  flex: 1 0 auto;
  width: min(1240px, calc(100% - 48px));
  margin: 0 auto;
  padding: 28px 0 64px;
}

/* Left column scrolls, right column sticks alongside it. */
.pb-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}
@media (min-width: 1000px) {
  .pb-cols {
    grid-template-columns: minmax(0, 1.65fr) minmax(340px, 0.85fr);
    gap: 26px;
  }
  .pb-side {
    position: sticky;
    /* Clears the sticky site nav. */
    top: 92px;
  }
  /* Too short to hold the panel — let it scroll with the page instead of
     giving the column its own scrollbar. */
  @media (max-height: 820px) {
    .pb-side { position: static; }
  }
}
.pb-main { min-width: 0; }
.pb-side {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.pb-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  background: #00a19a;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.pb-nav-back :deep(svg) { width: 15px; height: 15px; }

/* ── Page head ─────────────────────────────────────────────────────── */
.pb-head { margin-bottom: 18px; }
.pb-head-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #00867f;
}
.pb-head-title {
  margin: 8px 0 6px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.7px;
}
.pb-head-sub {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b6880;
}
.pb-head-sub :deep(svg) { width: 14px; height: 14px; color: #9c98ad; }

/* ── Hero ──────────────────────────────────────────── */
.pb-hero {
  padding: 22px 24px;
  border-radius: 20px;
  color: #fff;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(0, 212, 195, 0.22), transparent 58%),
    linear-gradient(135deg, #2b2450, #221c41);
  box-shadow: 0 12px 30px rgba(23, 18, 48, 0.22);
}
.pb-hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}
.pb-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
}
.pb-hero-eyebrow :deep(svg) { width: 16px; height: 16px; color: #2fd0c6; }
.pb-hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 11.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}
.pb-hero-chip :deep(svg) { width: 13px; height: 13px; }

.pb-hero-main {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
  margin-top: 20px;
}
@media (min-width: 820px) {
  .pb-hero-main {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    align-items: center;
    gap: 28px;
  }
}
.pb-hero-rings {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}
.pb-ring-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}
.pb-ring {
  position: relative;
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  flex: none;
}
.pb-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.pb-ring-track { fill: none; stroke: rgba(255, 255, 255, 0.16); stroke-width: 7; }
.pb-ring-fill {
  fill: none;
  stroke: #2fd0c6;
  stroke-width: 7;
  stroke-linecap: round;
}
.pb-ring-fill.accent { stroke: #6f6a9c; }
.pb-ring-val { font-weight: 800; line-height: 1; }
.pb-ring-val b { font-size: 27px; font-weight: 800; }
.pb-ring-val i {
  font-style: normal;
  font-size: 15px;
  font-weight: 800;
}
.pb-ring-cap {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}
.pb-ring-sub {
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
}
.pb-ring-sub.accent { color: #2fd0c6; }

.pb-hero-note {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
}
.pb-hero-note b { color: #fff; font-weight: 800; }
.pb-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 11px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s;
}
.pb-hero-btn:hover { background: rgba(255, 255, 255, 0.18); }
.pb-hero-btn :deep(svg) { width: 15px; height: 15px; }

.pb-hero-foot {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 20px;
  padding: 13px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}
.pb-hero-foot b { color: #2fd0c6; font-weight: 800; }
.pb-hero-foot-ic {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  flex: none;
}
.pb-hero-foot-ic :deep(svg) { width: 15px; height: 15px; color: #2fd0c6; }

/* ── EPC nudge ─────────────────────────────────────────────────────── */
.pb-epc {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e9e7f0;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(35, 29, 69, 0.05);
}
.pb-epc-ic { width: 42px; height: 42px; object-fit: contain; flex: none; }
.pb-epc-body { flex: 1; min-width: 0; }
.pb-epc-title { font-size: 14px; font-weight: 800; }
.pb-epc-sub {
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b6880;
  line-height: 1.5;
}
.pb-epc-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex: none;
  padding: 11px 18px;
  border: 1.5px solid #00a19a;
  border-radius: 999px;
  background: #fff;
  color: #00867f;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pb-epc-btn:hover { background: #00a19a; color: #fff; }
.pb-epc-btn :deep(svg) { width: 15px; height: 15px; }

/* ── Section headings + notes ────────────────────────── */
.pb-section-h {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 26px 0 12px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #231d45;
}
.pb-section-h :deep(svg) { width: 15px; height: 15px; color: #00a19a; }
.pb-section-h span {
  font-weight: 700;
  color: #9c98ad;
  letter-spacing: 0.2px;
  text-transform: none;
}
/* Mint info strip under each locked section. */
.pb-note {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 12px;
  padding: 12px 16px;
  background: #eefaf6;
  border: 1px solid #cfeee4;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: #0d7c6d;
}
.pb-note :deep(svg) { width: 15px; height: 15px; color: #0d7c6d; flex: none; }

/* ── Document tiles ────────────────────────────────────────────────── */
.pb-doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 14px;
}
.pb-doc-card {
  position: relative;
  padding: 18px;
  background: #fff;
  border: 1px solid #e9e7f0;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(35, 29, 69, 0.05);
}
.pb-doc-card.locked { background: #fff; }
.pb-doc-ic { width: 46px; height: 46px; object-fit: contain; }
.pb-doc-title {
  margin-top: 14px;
  font-size: 15px;
  font-weight: 800;
}
.pb-doc-sub {
  margin-top: 5px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b6880;
  line-height: 1.5;
}
.pb-doc-lock {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1eefa;
  display: grid;
  place-items: center;
}
.pb-doc-lock :deep(svg) { width: 14px; height: 14px; color: #5b3795; }

/* ── Professional evidence ──────────────────────────── */
.pb-pro-card {
  background: #fff;
  border: 1px solid #e9e7f0;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(35, 29, 69, 0.04);
  overflow: hidden;
}
.pb-pro-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  border: none;
  background: none;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}
.pb-pro-row + .pb-pro-row { border-top: 1px solid #f0eef6; }
.pb-pro-row:hover { background: #fafaf9; }
.pb-pro-ic { width: 40px; height: 40px; object-fit: contain; flex: none; }
.pb-pro-body { flex: 1; min-width: 0; }
.pb-pro-title {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
}
.pb-pro-sub {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b6880;
}
.pb-pro-chev { width: 17px; height: 17px; color: #b8b4c6; flex: none; }

/* ── Claim card ──────────────────────────────────── */
.pb-claim {
  padding: 26px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid #e6e2f3;
  border-radius: 22px;
  box-shadow: 0 10px 28px rgba(35, 29, 69, 0.06);
}
/* Passport artwork on a soft mint plinth. */
.pb-claim-art {
  position: relative;
  display: inline-grid;
  place-items: center;
  padding: 10px 26px 0;
}
.pb-claim-art::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 6px;
  transform: translateX(-50%);
  width: 132px;
  height: 92px;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.1);
  filter: blur(2px);
}
.pb-claim-art img {
  position: relative;
  width: 104px;
  height: auto;
  border-radius: 8px;
  filter: drop-shadow(0 14px 22px rgba(0, 122, 114, 0.28));
}
.pb-claim-title {
  margin: 16px 0 10px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
}
.pb-claim-lede {
  margin: 0 auto;
  max-width: 42ch;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  color: #6b6880;
}
/* Tick list — left aligned inside the centred card. */
.pb-claim-points {
  list-style: none;
  margin: 22px 0;
  padding: 0;
  text-align: left;
}
.pb-claim-points li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.pb-claim-points li + li { margin-top: 15px; }
.pb-claim-tick {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #e4f6f1;
  display: grid;
  place-items: center;
  flex: none;
  margin-top: 1px;
}
.pb-claim-tick :deep(svg) { width: 14px; height: 14px; color: #00867f; }
.pb-claim-point-txt { min-width: 0; }
.pb-claim-points b {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
}
.pb-claim-points span span,
.pb-claim-point-txt span {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b6880;
}
.pb-claim-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: 14px;
  background: #5b3795;
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(91, 55, 149, 0.26);
  transition: background 0.15s;
}
.pb-claim-btn:hover { background: #4b2c7d; }
.pb-claim-btn-main {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 14.5px;
  font-weight: 800;
}
.pb-claim-btn-main :deep(svg) { width: 16px; height: 16px; }
.pb-claim-btn-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
}
.pb-claim-btn-note :deep(svg) { width: 14px; height: 14px; }
.pb-claim-link {
  display: block;
  margin: 16px auto 0;
  border: none;
  background: none;
  color: #5b3795;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

/* Privacy reassurance under the claim card. */
/* Sits as its own card under the claim panel in the sidebar. */
.pb-privacy {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #eceaf4;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #8b8799;
}
.pb-privacy :deep(svg) { width: 15px; height: 15px; margin-top: 1px; color: #00a19a; flex: none; }

/* ── Entry animations ──────────────────────────────────────────────── */
.anim-1, .anim-2, .anim-3, .anim-4 {
  animation: pbFade 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.anim-2 { animation-delay: 0.06s; }
.anim-3 { animation-delay: 0.12s; }
.anim-4 { animation-delay: 0.18s; }
@keyframes pbFade {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .anim-1, .anim-2, .anim-3, .anim-4 { animation: none; }
}

@media (max-width: 680px) {
  .pb-page { width: calc(100% - 32px); }
  .pb-head-title { font-size: 22px; }
  .pb-hero-rings { flex-direction: column; align-items: flex-start; gap: 16px; }
  .pb-epc { flex-wrap: wrap; }
  .pb-epc-btn { width: 100%; justify-content: center; }
  .pb-hero-rings { gap: 20px; }
  .pb-claim { padding: 22px 18px; }
  .pb-claim-btn { flex-direction: column; align-items: stretch; gap: 6px; }
  .pb-claim-btn-main, .pb-claim-btn-note { justify-content: center; }
}
</style>
