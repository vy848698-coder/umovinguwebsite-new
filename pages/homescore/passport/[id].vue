<template>
  <div class="pb-shell">
    <WebTopNav wide>
      <template #actions>
        <button
          class="pb-tour-btn"
          type="button"
          title="How does this work?"
          aria-label="How does this work?"
          @click="tour.restart()"
        >
          ?
        </button>
        <button class="pb-nav-back" type="button" @click="onBack">
          <Icon name="i-lucide-arrow-left" /> {{ hsBack.label }}
        </button>
      </template>
    </WebTopNav>

    <div class="pb-page">
      <!-- Phones: the navbar folds its actions into the menu, so Back sits
           at the top of the page instead (same target and label). -->
      <div class="pb-mobile-bar">
        <button class="pb-mobile-back" type="button" @click="onBack">
          <Icon name="i-lucide-arrow-left" /> {{ hsBack.label }}
        </button>
        <button
          class="pb-tour-btn pb-tour-btn--mobile"
          type="button"
          aria-label="How does this work?"
          @click="tour.restart()"
        >
          ?
        </button>
      </div>

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
      <section class="pb-hero anim-1" data-tour="progress">
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
                <span class="pb-ring-val"><b>{{ homeScore || 'N/A' }}</b></span>
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
                {{ ownsPassport ? 'Add your documents' : 'Not started yet' }}
              </span>
            </div>
          </div>

          <div class="pb-hero-right">
            <p class="pb-hero-note">
              Add key documents to reach <b>60%</b> and unlock
              <b>Upfront Ready</b>.
            </p>
            <button class="pb-hero-btn" type="button" @click="goToMilestones">
              See milestones <Icon name="i-lucide-arrow-right" />
            </button>
          </div>
        </div>

        <div class="pb-hero-foot">
          <span class="pb-hero-foot-ic"><Icon name="i-lucide-bar-chart-3" /></span>
          <span>Add documents and evidence to build your Passport and unlock <b>Upfront Ready</b>.</span>
        </div>
      </section>

      <!-- ── EPC age nudge ────────────────────────────────────────── -->
      <section v-if="epcYear" class="pb-epc anim-2">
        <img class="pb-epc-ic" src="/op-icons/calendar/document.png" alt="" loading="lazy" />
        <div class="pb-epc-body">
          <div class="pb-epc-title">Your EPC is from {{ epcYear }}</div>
          <p class="pb-epc-sub">
            An updated EPC brings your public energy record up to date and
            strengthens your Passport.
          </p>
        </div>
        <button class="pb-epc-btn" type="button" @click="openInstallerSheet('epc')">
          Arrange a new EPC
          <Icon name="i-lucide-arrow-right" />
        </button>
      </section>

      <!-- ── Add to your passport ─────────────────────── -->
      <div class="pb-section-h">
        <Icon name="i-lucide-paperclip" />
        Add to your Passport
        <span v-if="!ownsPassport">(after claiming your property)</span>
      </div>
      <div class="pb-doc-grid anim-2" data-tour="add">
        <component
          :is="ownsPassport ? 'button' : 'div'"
          v-for="d in docTiles"
          :key="d.title"
          class="pb-doc-card"
          :class="{ locked: !ownsPassport }"
          :type="ownsPassport ? 'button' : undefined"
          @click="ownsPassport && goToPassportView()"
        >
          <span class="pb-doc-art" aria-hidden="true">
            <img class="pb-doc-ic" :src="d.icon" alt="" loading="lazy" />
            <span v-if="!ownsPassport" class="pb-doc-lock">
              <img src="/op-icons/claim/padlock.png" alt="" loading="lazy" />
            </span>
          </span>
          <span class="pb-doc-body">
            <span class="pb-doc-title">{{ d.title }}</span>
            <span class="pb-doc-sub">{{ d.sub }}</span>
            <span v-if="ownsPassport" class="pb-doc-status is-open">
              Add in your Passport <Icon name="i-lucide-arrow-right" />
            </span>
            <span v-else class="pb-doc-status">
              <Icon name="i-lucide-lock" /> Unlocks when you claim
            </span>
          </span>
        </component>
      </div>
      <p v-if="!ownsPassport" class="pb-note">
        <Icon name="i-lucide-lock" />
        You'll be able to add these once you've claimed your property.
      </p>

      <!-- ── Professional evidence ───────────────────── -->
      <div class="pb-section-h">
        <Icon name="i-lucide-user-round" />
        Hire a professional
      </div>
      <div class="pb-pro-grid anim-3" data-tour="evidence">
        <button
          v-for="p in proServices"
          :key="p.title"
          class="pb-pro-card"
          type="button"
          @click="openInstallerSheet(p.kind, p.measure)"
        >
          <span class="pb-pro-art" aria-hidden="true">
            <img class="pb-pro-ic" :src="p.icon" alt="" loading="lazy" />
          </span>
          <span class="pb-pro-body">
            <span class="pb-pro-badge"><Icon name="i-lucide-badge-check" /> {{ p.badge }}</span>
            <span class="pb-pro-title">{{ p.title }}</span>
            <span class="pb-pro-sub">{{ p.sub }}</span>
          </span>
          <span class="pb-pro-foot">
            <span class="pb-pro-price">{{ p.price }}</span>
            <span class="pb-pro-cta">Book <Icon name="i-lucide-arrow-right" /></span>
          </span>
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
        <div class="pb-claim-stage">
        <span class="pb-claim-art">
          <!-- The clone's 3D passport-with-documents, in both states.
               umu-passport.png is a flat book cover and read as a different,
               plainer asset next to the 3D icons below it. -->
          <img
            src="/op-icons/passportview/passportClaim.png"
            alt="Property Passport"
            loading="lazy"
          />
        </span>
        </div>

        <div class="pb-claim-body">
        <span class="pb-claim-pill">
          <Icon :name="ownsPassport ? 'i-lucide-badge-check' : 'i-lucide-sparkles'" />
          {{ ownsPassport ? 'Passport live' : 'Free Property Passport' }}
        </span>
        <h2 class="pb-claim-title">
          {{ ownsPassport ? 'Your Passport is ready to build' : 'Claim your Passport to get started' }}
        </h2>
        <p class="pb-claim-lede">
          <template v-if="ownsPassport">
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
            <span class="pb-claim-tick" aria-hidden="true">
              <img :src="c.icon" alt="" loading="lazy" />
            </span>
            <span class="pb-claim-point-txt">
              <b>{{ c.title }}</b>
              <span>{{ c.sub }}</span>
            </span>
          </li>
        </ul>

        <button
          class="pb-claim-btn"
          data-tour="claim"
          type="button"
          @click="ownsPassport ? goToPassportView() : goToClaim()"
        >
          <span class="pb-claim-btn-main">
            <Icon :name="ownsPassport ? 'i-lucide-book-open' : 'i-lucide-lock'" />
            {{ ownsPassport ? 'Open my Passport' : 'Claim my Passport' }}
          </span>
          <span class="pb-claim-btn-note">
            {{ ownsPassport ? 'Add documents & publish' : 'One-off fee to verify ownership' }}
            <Icon name="i-lucide-arrow-right" />
          </span>
        </button>

        <button
          v-if="!ownsPassport"
          class="pb-claim-link"
          type="button"
          @click="navigateTo('/onboarding/signin')"
        >
          I already have an account →
        </button>
        </div>
      </section>

      <p class="pb-privacy">
        <Icon name="i-lucide-shield" />
        Your data is secure. Your Passport is private and only shared when you
        choose.
      </p>
        </aside>
      </div><!-- /pb-cols -->
    </div>

    <SiteFooter wide />

    <!-- Guided tour overlay (renders only when active) -->
    <TourCoach :tour="tour" />

    <!-- ── Auth-required popup ───────────────────────────────────────
         A guest tapping "Claim my Passport" gets this choice rather than
         being dropped into the claim flow and bounced by the middleware. -->
    <Teleport to="body">
      <Transition name="pbauth">
        <div
          v-if="authPromptOpen"
          class="pbauth-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pbauth-title"
          @click.self="authPromptOpen = false"
        >
          <div class="pbauth-card" @click.stop>
            <button
              class="pbauth-close"
              type="button"
              aria-label="Close"
              @click="authPromptOpen = false"
            >
              <Icon name="i-lucide-x" />
            </button>
            <span class="pbauth-icon">
              <img src="/op-icons/claim/padlock.png" alt="" loading="lazy" />
            </span>
            <h2 id="pbauth-title" class="pbauth-title">Sign in to claim this property</h2>
            <p class="pbauth-body">
              You'll need a free account to verify ownership and build your
              Passport. Takes about a minute.
            </p>
            <div class="pbauth-actions">
              <button class="pbauth-btn primary" type="button" @click="goAuth('signup')">
                Create free account
              </button>
              <button class="pbauth-btn secondary" type="button" @click="goAuth('signin')">
                I already have an account
              </button>
              <button class="pbauth-btn ghost" type="button" @click="authPromptOpen = false">
                Not now
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Booking flow for the EPC nudge and the professional rows. -->
    <InstallerFlowSheet
      v-model:open="installerSheetOpen"
      :kind="installerKind"
      :measure-title="installerMeasureTitle"
      :property-id="propertyId"
      :postcode="propertyPostcode"
      :address="addressLine"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import InstallerFlowSheet from '~/components/homescore/InstallerFlowSheet.vue'
import TourCoach from '~/components/homescore/TourCoach.vue'
import { useHomescoreTour } from '~/composables/useHomescoreTour'

type InstallerKind = 'gas' | 'electrician' | 'epc' | 'other'

const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const propertyId = computed(() => String(route.params.id))

// ── Guided tour: the app's 4 steps explaining this page (starts once per
// property, "?" in the navbar replays it). The claim step's copy follows
// whether this user already owns the Passport.
const tour = useHomescoreTour({
  storageKey: `umu-tour-bpp-${propertyId.value}`,
  autoStart: true,
  steps: [
    {
      sel: '[data-tour="progress"]',
      title: 'Your Passport progress',
      body: 'The left ring is your HomeScore, the right is how much of your Passport is built. Add documents to raise it and unlock Upfront Ready.',
    },
    {
      sel: '[data-tour="add"]',
      title: 'What you can add',
      body: "These slots unlock once you've claimed the property: certificates, warranties and other evidence that build out your Passport.",
    },
    {
      sel: '[data-tour="evidence"]',
      title: 'Hire a professional',
      body: "Don't have a document yet? Book a certified professional here and it links straight to your Passport once claimed.",
    },
    {
      sel: '[data-tour="claim"]',
      title: 'Claim your Passport',
      get body() {
        return ownsPassport.value
          ? 'Your Passport is live for this property. Open it to add documents, invite your solicitor or agent, and publish when you are ready.'
          : 'A one-off ownership and ID check activates everything above: your Passport, free, verified and yours to control.'
      },
    },
  ],
})

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

// The property record's own `hasPassport` says that SOMEONE has claimed this
// address — it is true for every property in this dataset, which is why the
// claim card never used to appear. What decides the card is whether THIS
// viewer can build the passport, which only the authenticated
// passport-status endpoint knows (same source the HomeScore page uses).
const passportStatus = ref<{
  hasPassport: boolean
  passportId: string | null
  isOwner: boolean
  isCollaborator: boolean
  canAccess?: boolean
} | null>(null)

const ownsPassport = computed(() => {
  const s = passportStatus.value
  if (!s?.hasPassport || !s.passportId) return false
  return Boolean(s.isOwner || s.isCollaborator || s.canAccess)
})
// Nothing has been uploaded before the property is claimed, so this is a
// real 0 rather than a stand-in. Once a passport exists the backend owns
// the number — until that endpoint lands we show the claimed state instead
// of inventing a percentage.
const passportPct = computed(() => (ownsPassport.value ? 0 : 0))

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

// Badge = the accreditation the booking sheet matches on (InstallerFlowSheet
// TRADES); price = the figure the old row copy already quoted.
const proServices: Array<{
  icon: string
  title: string
  sub: string
  badge: string
  price: string
  kind: InstallerKind
  measure: string
}> = [
  {
    icon: '/homescore-icon/gasSafety.png',
    title: 'Book a Gas Safe engineer',
    sub: 'Service your boiler. The certificate auto-lands in your Passport.',
    badge: 'Gas Safe registered',
    price: 'Annual check',
    kind: 'gas',
    measure: 'Gas safety check (CP12)',
  },
  {
    icon: '/homescore-icon/electrician.png',
    title: 'Book an electrician (EICR)',
    sub: 'Electrical inspection that removes a major buyer concern.',
    badge: 'NICEIC registered',
    price: 'From £150',
    kind: 'electrician',
    measure: 'EICR · Electrical safety report',
  },
  {
    icon: '/homescore-icon/epcAssessment.png',
    title: 'New EPC assessment',
    sub: 'Required if yours is 10+ years old.',
    badge: 'Accredited assessor',
    price: 'From £60',
    kind: 'epc',
    measure: 'EPC assessment',
  },
]

// ── Booking sheet ──────────────────────────────────────────────────
const installerSheetOpen = ref(false)
const installerKind = ref<InstallerKind>('other')
const installerMeasureTitle = ref('')
const propertyPostcode = computed(() => property.value?.postcode ?? '')

function openInstallerSheet(kind: InstallerKind, measure = '') {
  installerKind.value = kind
  installerMeasureTitle.value = measure
  installerSheetOpen.value = true
}

// ── Guest gate on the claim button ─────────────────────────────────
const authPromptOpen = ref(false)
const signedIn = ref(false)
onMounted(async () => {
  try {
    signedIn.value = !!localStorage.getItem('token')
  } catch {
    /* blocked storage — treated as signed out */
  }
  // A guest can't own anything, so the claim card is the right card and
  // there is nothing to ask the backend.
  if (!signedIn.value) return
  const { getPassportStatus } = usePassportClaim()
  passportStatus.value = await getPassportStatus(propertyId.value)
})

function goAuth(mode: 'signin' | 'signup') {
  authPromptOpen.value = false
  try {
    localStorage.setItem('redirectAfterLogin', `/claim/${propertyId.value}`)
  } catch {
    /* non-fatal: they just land on the dashboard after signing in */
  }
  router.push(`/onboarding/${mode}`)
}

const claimPoints = computed(() =>
  ownsPassport.value
    ? [
        {
          icon: '/homescore-icon/clipboardChecklist.png',
          title: 'Add your documents',
          sub: 'Bills, certificates, deeds and photos',
        },
        {
          icon: '/homescore-icon/people.png',
          title: 'Invite collaborators',
          sub: 'Your solicitor, agent or co-owner',
        },
        {
          icon: '/homescore-icon/shield.png',
          title: 'Publish when ready',
          sub: 'You control what buyers can see',
        },
      ]
    : [
        {
          icon: '/op-icons/claim/ownershipCheck.png',
          title: 'Confirm ownership',
          sub: 'Verify you own this property',
        },
        {
          icon: '/op-icons/verify-identity/idBadge.png',
          title: 'ID & security step',
          sub: 'Quick & secure identity check',
        },
        {
          icon: '/op-icons/verify-identity/shield.png',
          title: 'Secure & private',
          sub: 'Your data is encrypted and only you control it',
        },
      ],
)

function goToClaim() {
  // Guests get the sign-in choice first; the claim route is auth-gated, so
  // sending them straight there just bounces them to the sign-in screen.
  if (!signedIn.value) {
    authPromptOpen.value = true
    return
  }
  router.push(`/claim/${propertyId.value}`)
}
function goToPassportView() {
  // /passportview expects the passport's id, not the property's.
  const id = passportStatus.value?.passportId ?? propertyId.value
  router.push(`/passportview/${id}`)
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
// Navbar Back: the HomeScore page the user came from (restored on the screen
// they left), else this property's score when they landed here directly.
const hsBack = useHomescoreBack(() => `/homescore/${propertyId.value}`, 'Back to score')
function onBack() {
  hsBack.go()
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

/* "?" replays the guided tour (same look as the other HomeScore pages). */
.pb-tour-btn {
  width: 40px;
  height: 40px;
  flex: none;
  display: grid;
  place-items: center;
  margin-right: 8px;
  border: 1px solid #cdeee9;
  border-radius: 12px;
  background: #e8f7f5;
  color: #00867f;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pb-tour-btn:hover { background: #00a19a; color: #fff; }
.pb-tour-btn--mobile { margin-right: 0; }

/* Shown only where WebTopNav hides its actions (<= 980px). */
.pb-mobile-bar {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}
.pb-mobile-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border: 1px solid #dbe5ef;
  border-radius: 12px;
  background: #fff;
  color: #231d45;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.pb-mobile-back :deep(svg) { width: 15px; height: 15px; }
@media (max-width: 980px) {
  .pb-mobile-bar { display: flex; }
}

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
.pb-epc-ic { width: 56px; height: 56px; object-fit: contain; flex: none; }
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
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
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

/* ── Document tiles: artwork on a mint stage, text beside it ────────── */
/* Two columns, not auto-fit: there are four tiles, and a three-wide row
   left the fourth stranded on a line of its own. */
.pb-doc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 560px) {
  .pb-doc-grid { grid-template-columns: minmax(0, 1fr); }
}
.pb-doc-card {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  min-width: 0;
  padding: 0;
  border: 1px solid #e9e7f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(35, 29, 69, 0.06);
  text-align: left;
  font-family: inherit;
  color: #231d45;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.pb-doc-card:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 161, 154, 0.3);
  box-shadow: 0 14px 30px rgba(35, 29, 69, 0.1);
}
button.pb-doc-card { cursor: pointer; }
button.pb-doc-card:focus-visible { outline: 2px solid #00a19a; outline-offset: 2px; }
/* Mint stage with a soft glow under the artwork. */
.pb-doc-art {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 118px;
  background:
    radial-gradient(70px 34px at 50% 80%, rgba(0, 161, 154, 0.2), transparent 70%),
    linear-gradient(180deg, #f2fbf9 0%, #e4f5f2 100%);
  border-right: 1px solid #e6f3f0;
}
.pb-doc-ic {
  width: 84px;
  height: 84px;
  object-fit: contain;
  filter: drop-shadow(0 10px 12px rgba(35, 29, 69, 0.18));
  transition: transform 0.25s ease;
}
.pb-doc-card:hover .pb-doc-ic { transform: translateY(-3px) scale(1.04); }
/* Padlock sits on the stage's corner as a small badge. */
.pb-doc-lock {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 3px 8px rgba(35, 29, 69, 0.14);
}
.pb-doc-lock img { width: 20px; height: 20px; object-fit: contain; }
.pb-doc-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 16px 18px;
}
.pb-doc-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.2px;
  line-height: 1.3;
}
.pb-doc-sub {
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: #6b6880;
}
.pb-doc-status {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 5px;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f1eefa;
  color: #5b4f86;
  font-size: 11px;
  font-weight: 800;
}
.pb-doc-status :deep(svg) { width: 12px; height: 12px; }
.pb-doc-status.is-open { background: #e8f7f5; color: #00867f; }
.pb-doc-card:hover .pb-doc-status.is-open :deep(svg) { transform: translateX(2px); }

/* ── Hire a professional: three premium cards side by side ──────────── */
.pb-pro-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  container-type: inline-size;
}
.pb-pro-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
  padding: 0;
  border: 1px solid #e9e7f0;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(35, 29, 69, 0.06);
  text-align: left;
  font-family: inherit;
  color: #231d45;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.pb-pro-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 161, 154, 0.35);
  box-shadow: 0 16px 34px rgba(35, 29, 69, 0.12);
}
.pb-pro-card:focus-visible { outline: 2px solid #00a19a; outline-offset: 2px; }
/* Artwork on a soft mint stage with a glow under it. */
.pb-pro-art {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  background:
    radial-gradient(120px 60px at 50% 82%, rgba(0, 161, 154, 0.18), transparent 70%),
    linear-gradient(180deg, #f2fbf9 0%, #e6f6f3 100%);
  border-bottom: 1px solid #e6f3f0;
}
.pb-pro-ic {
  position: relative;
  width: 112px;
  height: 112px;
  object-fit: contain;
  filter: drop-shadow(0 12px 16px rgba(35, 29, 69, 0.18));
  transition: transform 0.25s ease;
}
.pb-pro-card:hover .pb-pro-ic { transform: translateY(-4px) scale(1.04); }
.pb-pro-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 18px 0;
}
.pb-pro-badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 5px;
  padding: 4px 9px;
  border-radius: 999px;
  background: #e8f7f5;
  color: #00867f;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.2px;
}
.pb-pro-badge :deep(svg) { width: 13px; height: 13px; }
.pb-pro-title {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.2px;
  line-height: 1.3;
}
.pb-pro-sub {
  margin-top: 5px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: #6b6880;
}
.pb-pro-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 16px 18px 18px;
  padding-top: 14px;
  border-top: 1px solid #f0eef6;
}
.pb-pro-price { font-size: 13.5px; font-weight: 800; color: #231d45; white-space: nowrap; }
.pb-pro-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #00a19a;
  color: #fff;
  font-size: 12.5px;
  font-weight: 800;
  transition: background 0.15s;
}
.pb-pro-cta :deep(svg) { width: 14px; height: 14px; transition: transform 0.2s; }
.pb-pro-card:hover .pb-pro-cta { background: #00867f; }
.pb-pro-card:hover .pb-pro-cta :deep(svg) { transform: translateX(2px); }

/* Three narrow cards (e.g. a 1024px window): price above a full-width Book
   button, so every card's footer lines up the same way. */
@container (max-width: 700px) {
  .pb-pro-foot { flex-direction: column; align-items: stretch; gap: 10px; }
  .pb-pro-cta { justify-content: center; }
}

/* Tablets / phones: one card per row, artwork beside the text. */
@media (max-width: 720px) {
  .pb-pro-grid { grid-template-columns: minmax(0, 1fr); }
  .pb-pro-card {
    display: grid;
    grid-template-columns: 116px minmax(0, 1fr);
  }
  .pb-pro-art {
    grid-row: 1 / span 2;
    height: auto;
    min-height: 100%;
    border-bottom: 0;
    border-right: 1px solid #e6f3f0;
  }
  .pb-pro-ic { width: 88px; height: 88px; }
  .pb-pro-body { padding: 14px 16px 0; }
  .pb-pro-foot { margin: 12px 16px 14px; padding-top: 12px; flex-direction: row; align-items: center; }
}
@media (max-width: 420px) {
  .pb-pro-card { grid-template-columns: 88px minmax(0, 1fr); }
  .pb-pro-ic { width: 68px; height: 68px; }
  .pb-pro-body { padding: 12px 12px 0; }
  .pb-pro-foot { margin: 10px 12px 12px; flex-wrap: wrap; }
  .pb-doc-card { grid-template-columns: 92px minmax(0, 1fr); }
  .pb-doc-art { min-height: 104px; }
  .pb-doc-ic { width: 68px; height: 68px; }
  .pb-doc-body { padding: 14px; }
  .pb-epc-ic { width: 48px; height: 48px; }
}

/* ── Claim card ──────────────────────────────────── */
.pb-claim {
  padding: 0;
  text-align: center;
  background: #fff;
  border: 1px solid #e6e2f3;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(35, 29, 69, 0.09);
  overflow: hidden;
}
/* Full-width illustrated header: the passport on a mint stage with a
   glow and two soft rings behind it. */
.pb-claim-stage {
  position: relative;
  display: grid;
  place-items: center;
  padding: 28px 20px 18px;
  background:
    radial-gradient(160px 70px at 50% 88%, rgba(0, 161, 154, 0.26), transparent 70%),
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.8), transparent 38%),
    linear-gradient(180deg, #effaf7 0%, #d9f1ec 100%);
  border-bottom: 1px solid #dcefeb;
  overflow: hidden;
}
.pb-claim-stage::before,
.pb-claim-stage::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 161, 154, 0.16);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pb-claim-stage::before { width: 230px; height: 230px; }
.pb-claim-stage::after { width: 310px; height: 310px; border-color: rgba(0, 161, 154, 0.09); }
.pb-claim-art {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
}
.pb-claim-art img {
  width: 196px;
  height: auto;
  filter: drop-shadow(0 18px 26px rgba(0, 110, 103, 0.3));
  transition: transform 0.35s ease;
}
.pb-claim:hover .pb-claim-art img { transform: translateY(-4px) rotate(-1.5deg); }
.pb-claim-body { padding: 20px 24px 24px; }
.pb-claim-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f1ebfb;
  color: #5b3795;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.2px;
}
.pb-claim-pill :deep(svg) { width: 13px; height: 13px; }
.pb-claim-title {
  margin: 12px 0 8px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.25;
}
.pb-claim-lede {
  margin: 0 auto;
  max-width: 42ch;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  color: #6b6880;
}
/* The three checks as clear rows: big icon on a white tile, text beside. */
.pb-claim-points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
  padding: 0;
  text-align: left;
}
.pb-claim-points li {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px 10px 10px;
  border: 1px solid #efedf5;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfbfd 0%, #f6f5fa 100%);
}
.pb-claim-tick {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(35, 29, 69, 0.08);
}
.pb-claim-tick img { width: 42px; height: 42px; object-fit: contain; }
.pb-claim-point-txt { min-width: 0; }
.pb-claim-points b {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
}
.pb-claim-points span span,
.pb-claim-point-txt span {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.45;
  color: #6b6880;
}
/* Stacked, not side by side: in a 340px sidebar the label and the fee note
   competed for one row and "Claim my Passport" broke across two lines. */
.pb-claim-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
  padding: 13px 18px;
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
  white-space: nowrap;
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
  .pb-claim-body { padding: 18px 16px 20px; }
  .pb-claim-art img { width: 170px; }
  .pb-claim-btn { flex-direction: column; align-items: stretch; gap: 6px; }
  .pb-claim-btn-main, .pb-claim-btn-note { justify-content: center; }
}

/* ── Auth-required popup ──────────────────────────────── */
.pbauth-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(35, 29, 69, 0.45);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}
.pbauth-card {
  position: relative;
  width: min(420px, 100%);
  padding: 32px 28px 26px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 36px 80px rgba(35, 29, 69, 0.3);
  text-align: center;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #231d45;
}
.pbauth-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(35, 29, 69, 0.1);
  background: #fff;
  color: #6b6880;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;
}
.pbauth-close:hover { background: #f3f2f7; color: #231d45; }
.pbauth-close :deep(svg) { width: 16px; height: 16px; }
.pbauth-icon {
  display: inline-grid;
  place-items: center;
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
}
.pbauth-icon img { width: 64px; height: 64px; object-fit: contain; }
.pbauth-title {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  line-height: 1.3;
}
.pbauth-body {
  margin: 8px 0 0;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.6;
  color: #6b6880;
}
.pbauth-actions {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 22px;
}
.pbauth-btn {
  width: 100%;
  padding: 13px 16px;
  border-radius: 13px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
}
.pbauth-btn:hover { transform: translateY(-1px); }
.pbauth-btn.primary {
  border: 0;
  background: linear-gradient(135deg, #5b3795, #3f2470);
  color: #fff;
  box-shadow: 0 10px 22px rgba(91, 55, 149, 0.28);
}
.pbauth-btn.secondary {
  border: 1px solid #ded9ee;
  background: #fff;
  color: #231d45;
}
.pbauth-btn.secondary:hover { border-color: #c3b9e4; }
.pbauth-btn.ghost {
  border: 0;
  background: transparent;
  color: #6b6880;
  font-weight: 700;
}
.pbauth-btn.ghost:hover { color: #231d45; }

.pbauth-enter-active,
.pbauth-leave-active { transition: opacity 0.2s ease; }
.pbauth-enter-active .pbauth-card,
.pbauth-leave-active .pbauth-card { transition: transform 0.22s ease, opacity 0.22s ease; }
.pbauth-enter-from,
.pbauth-leave-to { opacity: 0; }
.pbauth-enter-from .pbauth-card,
.pbauth-leave-to .pbauth-card { opacity: 0; transform: translateY(12px) scale(0.98); }
@media (prefers-reduced-motion: reduce) {
  .pbauth-enter-active,
  .pbauth-leave-active,
  .pbauth-enter-active .pbauth-card,
  .pbauth-leave-active .pbauth-card { transition: none; }
}

/* Big screens (>1366px): the laptop layout scaled up (--wide-zoom = width /
   1366, nuxt.config.ts). The page body zooms (the navbar + footer take
   `wide`); the auth popup lives on <body>, so its card zooms itself. */
@media (min-width: 1367px) {
  .pb-page,
  .pbauth-card {
    zoom: var(--wide-zoom, 1);
  }
}
</style>
