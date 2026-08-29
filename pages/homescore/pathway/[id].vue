<template>
  <div class="hs-v6-pathway-shell">
    <!-- Site navbar — landing-page style (sticky, translucent cream).
         Back button is right-aligned for the pathway page. -->
    <header class="pw-nav">
      <div class="pw-nav-inner">
        <div class="pw-nav-left">
          <button class="pw-brand" type="button" @click="navigateTo('/')" aria-label="umovingu home">
            <img src="/op-icons/logo.png" alt="umovingu" class="pw-brand-img" />
            <span class="pw-brand-name">umovingu</span>
            <span class="pw-brand-beta">BETA</span>
          </button>
        </div>

        <nav class="pw-nav-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>

        <div class="pw-nav-actions">
          <button
            v-if="showPathwayBackButton"
            class="pw-nav-back"
            type="button"
            @click="onBack"
            aria-label="Back"
          >
            <Icon name="i-lucide-arrow-left" class="pw-nav-back-arrow" />
            Back
          </button>
        </div>
      </div>

      <transition name="pw-menu">
        <nav v-if="mobileMenuOpen" class="pw-mobile-menu" aria-label="Mobile navigation">
          <button type="button" @click="navGo('/explore')">Explore</button>
          <button type="button" @click="navGo('/homescore')">HomeScore</button>
          <button type="button" @click="navGo('/passport')">Passport</button>
          <button type="button" @click="navGo('/marketplace')">Marketplace</button>
          <button type="button" @click="navGo('/profile/learn')">Learn</button>
          <button class="pw-mobile-signin" type="button" @click="navGo('/onboarding/signin')">Sign in</button>
        </nav>
      </transition>
    </header>

    <div class="hs-v6-pathway">
      <!-- Hero shell: headline + illustration on the left, the teal
           improvement card inset on the right. -->
      <div class="pw-hero-shell anim-1">
        <div class="pw-hero-left">
          <div class="pw-pagehead">
            <div class="pw-pagehead-eyebrow">
              Your HomeScore: <b>{{ fromScore }}</b>
            </div>
            <h1 class="pw-pagehead-title">
              Here's how your home could improve further.
            </h1>
            <div class="pw-pagehead-sub">
              <Icon name="i-lucide-map-pin" /> {{ addressLine }}
            </div>
          </div>
          <img
            class="pw-pagehead-art"
            src="/homescore-icon/homeScoreCard.png"
            alt=""
            loading="lazy"
          />
        </div>

      <!-- Improvement pathway — current vs potential HomeScore -->
      <section class="pw-improve">
        <div class="pw-improve-eyebrow">
          <span class="pw-improve-eyebrow-ic">
            <img src="/homescore-icon/targetPathway.png" alt="" loading="lazy" />
          </span>
          Your improvement pathway
        </div>

        <div class="pw-improve-body">
          <div class="pw-improve-scores">
            <div class="pw-ring-block">
              <span class="pw-ring">
                <svg viewBox="0 0 72 72" aria-hidden="true">
                  <circle class="pw-ring-track" cx="36" cy="36" r="30" />
                  <circle
                    class="pw-ring-fill"
                    cx="36"
                    cy="36"
                    r="30"
                    stroke-dasharray="188.5"
                    :stroke-dashoffset="188.5 - (188.5 * ringPct(fromScore)) / 100"
                  />
                </svg>
                <span class="pw-ring-val">
                  <b>{{ fromScore }}</b><i>/100</i>
                </span>
              </span>
              <span class="pw-ring-label">Current<br />HomeScore</span>
            </div>

            <span class="pw-improve-arrow" aria-hidden="true">→</span>

            <div class="pw-ring-block">
              <span class="pw-ring">
                <svg viewBox="0 0 72 72" aria-hidden="true">
                  <circle class="pw-ring-track" cx="36" cy="36" r="30" />
                  <circle
                    class="pw-ring-fill"
                    cx="36"
                    cy="36"
                    r="30"
                    stroke-dasharray="188.5"
                    :stroke-dashoffset="188.5 - (188.5 * ringPct(toScore)) / 100"
                  />
                </svg>
                <span class="pw-ring-val">
                  <b>{{ toScore }}</b><i>/100</i>
                </span>
              </span>
              <span class="pw-ring-label">Potential<br />HomeScore</span>
            </div>
          </div>

          <div class="pw-improve-gains">
            <div v-if="totalSavings" class="pw-gain">
              <img src="/homescore-icon/wallet.png" alt="" loading="lazy" />
              <div>
                <span>Save up to</span>
                <b>£{{ totalSavings }}/year</b>
              </div>
            </div>
            <div v-if="co2Cut" class="pw-gain">
              <img src="/homescore-icon/environmental.png" alt="" loading="lazy" />
              <div>
                <span>Lower</span>
                <b>carbon impact</b>
              </div>
            </div>
          </div>
        </div>

        <div class="pw-improve-note">
          Based on the improvements recommended in your EPC. Costs and savings
          are estimates.
        </div>
      </section>
      </div>

      <!-- Grants listed on the EPC -->
      <div class="grant-banner anim-2">
        <div class="grant-banner-ic">
          <img src="/homescore-icon/gift.png" alt="" loading="lazy" />
        </div>
        <div class="grant-banner-body">
          <div class="grant-banner-title">
            You may be able to get help with the cost
          </div>
          <div class="grant-banner-sub">
            You could be eligible for: <b>Warm Homes Local Grant</b>,
            <b>Boiler Upgrade Scheme</b>, and
            <b>Energy Company Obligation (ECO)</b>.
          </div>
          <div class="grant-banner-fine">
            Eligibility depends on income, property type and area.
          </div>
        </div>
      </div>

      <div class="pw-grid">
        <div class="pw-main">
          <!-- Section heading -->
          <div class="section-h-row">
            <div class="section-h">
              EPC's {{ missions.length }} step{{ missions.length === 1 ? '' : 's' }} · in published order
            </div>
            <div v-if="fromScore && toScore" class="section-h-sub">
              {{ fromScore }} → {{ toScore }} points
            </div>
          </div>

          <!-- Empty state when the EPC has no improvement steps -->
          <div v-if="missions.length === 0" class="pathway-empty">
            <div class="pathway-empty-icon"><Icon name="i-lucide-check" /></div>
            <div class="pathway-empty-title">No improvements on this EPC</div>
            <div class="pathway-empty-sub">
              The certificate for this property doesn't list any energy-saving
              steps — usually means it's already in good shape.
            </div>
          </div>

          <!-- Mission list -->
          <div v-else class="mission-list anim-3">
            <div
              v-for="(m, i) in missions"
              :key="m.id"
              class="mission-card"
              :class="{ priority: i === 0 && !m.done, 'mission-card--done': m.done }"
            >
              <span v-if="i === 0 && !m.done" class="mission-flag">
                <Icon name="i-lucide-flag" /> Priority
              </span>
              <div class="mission-top">
                <div class="mission-icon" :class="{ 'has-img': !m.done && m.icon.includes('/') }">
                  <Icon v-if="m.done" name="i-lucide-check" />
                  <img v-else-if="m.icon.includes('/')" :src="m.icon" :alt="m.title" loading="lazy" />
                  <Icon v-else :name="m.icon" />
                </div>
                <div class="mission-info">
                  <div class="mission-step">Step {{ i + 1 }}</div>
                  <div class="mission-title">
                    {{ m.title }}
                    <span v-if="m.done" class="mission-done-pill">Already done</span>
                  </div>
                  <div class="mission-meta">
                    <template v-if="m.done">
                      You said this is in place — upload {{ m.docLabel }} to verify it on your Passport.
                    </template>
                    <template v-else>{{ m.meta }}</template>
                  </div>
                </div>
              </div>
              <div v-if="!m.done" class="mission-rewards">
                <span v-if="m.pts" class="quest-reward stat">
                  <Icon name="i-lucide-arrow-up-right" />{{ m.pts }}
                </span>
                <span v-if="m.save" class="quest-reward money">
                  <Icon name="i-lucide-piggy-bank" />{{ m.save }}
                </span>
                <span v-if="m.cost" class="quest-reward grant">
                  <Icon name="i-lucide-tag" />{{ m.cost }}
                </span>
              </div>
              <div class="mission-actions">
                <template v-if="m.done">
                  <button class="mission-btn-verify" type="button" @click="verifyDocsOpen = true">
                    <Icon name="i-lucide-paperclip" /> Verify with a document
                  </button>
                </template>
                <template v-else>
                  <!-- Phase 1: no live marketplace, but the drawer captures
                       real demand (match request + grant check + early
                       access) so the pathway CTA does something useful.
                       Backed by CaptureEvent rows on the backend — see
                       useCaptureEvent / InstallerFlowSheet. -->
                  <button
                    class="mission-btn-supplier"
                    :class="{ ghost: i !== 0 }"
                    type="button"
                    @click="openInstallerSheet(m)"
                  >
                    <img class="mission-btn-ico" src="/homescore-icon/magnifier.png" alt="" /> {{ m.supplierLabel }}
                    <Icon name="i-lucide-arrow-right" class="mission-btn-arrow" />
                  </button>
                </template>
              </div>
            </div>
          </div>

        </div><!-- /pw-main -->

        <div class="pw-side">
          <!-- Path summary -->
          <div class="path-summary anim-4">
            <div class="path-summary-icon"><Icon name="i-lucide-shield-check" /></div>
            <div class="path-summary-body">
              <div class="path-summary-title">All suppliers are UMU-verified</div>
              <div class="path-summary-sub">
                Payments held in escrow via UProtect. ECO4-registered installers only.
              </div>
            </div>
          </div>

          <!-- Passport nudge — what sits beyond the EPC pathway. -->
          <div class="pw-beyond anim-4">
            <img
              class="pw-beyond-ic"
              src="/homescore-icon/boostBolt.png"
              alt=""
              loading="lazy"
            />
            <div class="pw-beyond-body">
              <div class="pw-beyond-title">Beyond the pathway</div>
              <p class="pw-beyond-sub">
                Build your Property Passport to record improvements, boost your
                HomeScore and unlock more benefits.
              </p>
            </div>
            <button class="pw-beyond-btn" type="button" @click="goToPassport">
              Build my Property Passport
              <Icon name="i-lucide-arrow-right" />
            </button>
          </div>

          <!-- Bottom CTAs
               Phase 1: no live marketplace. Both buttons open the demand-
               capture drawer instead — one collects early-access sign-ups
               for the marketplace, the other lets the user see the
               match requests they've already fired. All demand lands in
               the CaptureEvent table on the backend. -->
          <div class="bottom-cta">
            <button
              class="bottom-cta-btn"
              type="button"
              @click="openMarketplaceSheet"
            >
              <Icon name="i-lucide-shopping-cart" /> Join the marketplace early access
            </button>
            <button
              class="bottom-cta-secondary"
              type="button"
              @click="openTrackerSheet"
            >
              <Icon name="i-lucide-list-checks" /> See your requests
            </button>
          </div>
        </div><!-- /pw-side -->
      </div><!-- /pw-grid -->

      <!-- Demand-capture drawer — replaces the coming-soon badge with
           a real flow that records grant checks, match requests and
           early-access sign-ups against the current property. -->
      <InstallerFlowSheet
        v-model:open="installerSheetOpen"
        :kind="installerKind"
        :measure-title="installerMeasureTitle"
        :property-id="propertyId"
        :postcode="propertyPostcode"
        :address="addressLine"
        :initial-state="installerInitialState"
      />

      <!-- Floating "Verify your answers" pill — re-opens the modal if the
           user dismissed it. Only shown when they've claimed at least one
           improvement as done. -->
      <button
        v-if="doneMissionDocs.length > 0 && !verifyDocsOpen"
        class="verify-pill"
        type="button"
        @click="verifyDocsOpen = true"
      >
        <Icon name="i-lucide-paperclip" /> Verify {{ doneMissionDocs.length }} answer{{ doneMissionDocs.length === 1 ? '' : 's' }}
      </button>

      <!-- Verify-documents modal — pops on first arrival when the user has
           answered the quiz with at least one "already done" answer. Asks
           for the supporting docs so the claimed work can be verified on
           their Property Passport. -->
      <Teleport to="body">
        <div v-if="verifyDocsOpen" class="vd-overlay" @click.self="closeVerifyDocs">
          <div class="vd-sheet">
            <div class="vd-grip" />
            <div class="vd-header">
              <div class="vd-eyebrow">
                <Icon name="i-lucide-circle-check" /> You've already done some of these
              </div>
              <div class="vd-title">Verify your answers with documents</div>
              <div class="vd-sub">
                You told us {{ doneMissionDocs.length }} improvement{{ doneMissionDocs.length === 1 ? ' is' : 's are' }}
                already in place. Upload a document for each so buyers and lenders
                see a verified record on your Property Passport.
              </div>
            </div>
            <div class="vd-list">
              <label
                v-for="m in doneMissionDocs"
                :key="m.id"
                class="vd-row"
                :class="{ 'vd-row--filled': !!verifyDocsUploaded[m.docKey ?? ''] }"
              >
                <div class="vd-row-ic"><Icon :name="m.icon" /></div>
                <div class="vd-row-body">
                  <div class="vd-row-title">{{ m.title }}</div>
                  <div class="vd-row-sub">{{ m.docLabel }}</div>
                  <div v-if="verifyDocsUploaded[m.docKey ?? '']" class="vd-row-file">
                    <Icon name="i-lucide-check" /> {{ verifyDocsUploaded[m.docKey ?? ''] }}
                  </div>
                </div>
                <div class="vd-row-cta">
                  <span v-if="verifyDocsUploaded[m.docKey ?? '']">Replace</span>
                  <span v-else>+ Add</span>
                </div>
                <input
                  type="file"
                  class="vd-row-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.heic"
                  @change="onVerifyDocPicked($event, m.docKey ?? '')"
                />
              </label>
            </div>
            <div class="vd-footer">
              <button class="vd-btn ghost" type="button" @click="closeVerifyDocs">
                Maybe later
              </button>
              <button class="vd-btn primary" type="button" @click="closeVerifyDocs">
                Done
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div><!-- /hs-v6-pathway -->

    <!-- Shared site footer (full-bleed) -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import InstallerFlowSheet from '~/components/homescore/InstallerFlowSheet.vue'
import { refreshEpcIfMissing } from '~/utils/epcSelfHeal'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

// Landing-style navbar state.
const mobileMenuOpen = ref(false)
function navGo(path: string) {
  mobileMenuOpen.value = false
  navigateTo(path)
}

const router = useRouter()
const route = useRoute()
const showPathwayBackButton = computed(
  () => (route.query.from as string | undefined) === 'landing',
)
const propertyId = computed(() => String(route.params.id))
const config = useRuntimeConfig()

// Real property data fetched on mount so the pathway page shows the
// actual EPC recommendations for THIS property (not the prototype's
// hard-coded 6 steps).
const property = ref<any>(null)
// Homescore quiz answers — used to mark missions the user has already
// reported as done, and to surface a "verify with documents" prompt.
const quizAnswers = ref<Record<string, string>>({})

onMounted(async () => {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId.value}`,
    )
    // The whole page is built from this property's EPC recommendations, so a
    // partially-failed enrichment would leave it permanently empty. Re-pull.
    if (res.ok) {
      property.value = await refreshEpcIfMissing(
        config.public.apiBase as string,
        propertyId.value,
        await res.json(),
      )
    }
  } catch {
    /* keep null — page falls back to a friendly empty state */
  }
  // Load the user's quiz answers — try the backend first (authed users),
  // then localStorage (guests / unsaved answers). Either source is fine
  // because the doneness heuristic only needs the answer values.
  try {
    const token =
      typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      const r = await fetch(
        `${config.public.apiBase}/property/${propertyId.value}/homescore`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (r.ok) {
        const j = await r.json()
        if (j?.answers && typeof j.answers === 'object') {
          quizAnswers.value = j.answers as Record<string, string>
        }
      }
    }
    if (
      Object.keys(quizAnswers.value).length === 0 &&
      typeof localStorage !== 'undefined'
    ) {
      const raw = localStorage.getItem(`hs_answers_${propertyId.value}`)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') quizAnswers.value = parsed
        } catch {}
      }
    }
  } catch {
    /* non-critical — pathway still renders, just without done-state */
  }
  // Pop the verify-documents modal on first visit when the user has at
  // least one "already done" mission. We only auto-open once per visit;
  // they can re-open it from the "Verify your answers" link.
  if (doneMissionDocs.value.length > 0) {
    verifyDocsOpen.value = true
  }
})

const addressLine = computed(() => {
  const p = property.value
  return p?.addressLine1 || 'Your property'
})

const propertyPostcode = computed<string>(() => {
  const p = property.value
  return (p?.postcode || p?.epcCert?.postcode || '') as string
})

// Demand-capture drawer state. `kind` picks the correct trade card
// inside the sheet (TrustMark vs MCS self-search link, grant flow
// on/off, accreditation string logged with the match request).
type InstallerKind = 'insulation' | 'solarpv' | 'other'
type SheetState =
  | 'routes' | 'elig' | 'result' | 'form' | 'confirm'
  | 'tracker' | 'market' | 'ea-form' | 'ea-confirm'
const installerSheetOpen = ref(false)
const installerKind = ref<InstallerKind>('other')
const installerMeasureTitle = ref('')
const installerInitialState = ref<SheetState>('routes')

// Rough mapping mission title → trade kind. Only used to pick which
// accreditation copy (TrustMark vs MCS) the drawer shows; everything
// downstream (capture events) records the exact measure title too.
function kindForMissionTitle(title: string): InstallerKind {
  const t = (title ?? '').toLowerCase()
  if (/solar pv|photovoltaic/.test(t)) return 'solarpv'
  if (/(cavity|wall|loft|roof|floor|insulat)/.test(t)) return 'insulation'
  return 'other'
}

function openInstallerSheet(m: { title: string }) {
  installerKind.value = kindForMissionTitle(m.title)
  installerMeasureTitle.value = m.title
  installerInitialState.value = 'routes'
  installerSheetOpen.value = true
}

function openTrackerSheet() {
  installerInitialState.value = 'tracker'
  installerSheetOpen.value = true
}

function openMarketplaceSheet() {
  installerInitialState.value = 'market'
  installerSheetOpen.value = true
}

const fromScore = computed(() => {
  const p: any = property.value
  return Number(p?.epcScore ?? p?.epcCert?.epcScore ?? 0) || 0
})
// Potential SAP straight from the payload — mirrors the deployed app,
// which reads the EPC's `potentialScore` field directly with no
// recommendation-derived fallback. A property with no potential on file
// therefore shows Potential · 0 (grade G), exactly like the clone.
const toScore = computed(() => {
  const p: any = property.value
  return Number(p?.epcScorePotential ?? p?.epcCert?.potentialScore ?? 0) || 0
})
// Raw difference, as shown on the deployed build. For a property with a
// real potential (e.g. 55 → 75) this is the true climb (+20); for a
// no-improvements property whose potential field is 0 it mirrors the
// clone's "+-55".
const pointsToGain = computed(() => toScore.value - fromScore.value)

// Ring fill for the current / potential HomeScore dials.
function ringPct(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score || 0)))
}

// Pick a 3D icon (from /public/homescore-icon) for each EPC recommendation
// type based on title keywords, matching the deployed mobile-app look.
function iconForRec(title: string): string {
  const t = (title ?? '').toLowerCase()
  if (/solar pv|photovoltaic/.test(t)) return '/homescore-icon/lightning.png'
  if (/solar (?:water|thermal)/.test(t)) return '/homescore-icon/lightning.png'
  if (/(loft|roof)/.test(t)) return '/homescore-icon/roof.png'
  if (/(cavity|wall)/.test(t)) return '/homescore-icon/walls.png'
  if (/floor/.test(t)) return '/homescore-icon/floor.png'
  if (/(led|light)/.test(t)) return '/homescore-icon/lightbulb.png'
  if (/(boiler|heat pump|heating)/.test(t)) return '/homescore-icon/boiler.png'
  if (/thermostat|controls/.test(t)) return '/homescore-icon/heatingControls.png'
  if (/hot water|cylinder/.test(t)) return '/homescore-icon/tap.png'
  return '/homescore-icon/bulb.png'
}

function supplierLabelForRec(title: string): string {
  const t = (title ?? '').toLowerCase()
  if (/solar pv|photovoltaic/.test(t)) return 'Find solar PV installers'
  if (/solar (?:water|thermal)/.test(t)) return 'Find solar thermal installers'
  if (/(led|light)/.test(t)) return 'LED suppliers'
  if (/(boiler)/.test(t)) return 'Find Gas Safe engineers'
  if (/heat pump/.test(t)) return 'Find heat-pump installers'
  if (/(thermostat|controls)/.test(t)) return 'Find heating-controls fitters'
  if (/(cavity|wall|loft|roof|floor|insulat)/.test(t))
    return 'Find insulation installers'
  return 'Find a verified pro'
}

function gradeFor(score: number): string {
  if (score >= 92) return 'A'
  if (score >= 81) return 'B'
  if (score >= 69) return 'C'
  if (score >= 55) return 'D'
  if (score >= 39) return 'E'
  if (score >= 21) return 'F'
  return 'G'
}
const fromLevel = computed(() => gradeFor(fromScore.value))
const toLevel = computed(() => gradeFor(toScore.value))

interface Mission {
  id: string
  icon: string
  title: string
  meta: string
  pts: string
  save: string
  cost: string
  supplierLabel: string
  // True when the user's quiz answers say this improvement is already in
  // place — flips the card to a "done · upload to verify" state.
  done: boolean
  // The document the user should upload to verify this completed step,
  // when they've claimed it as done. Null when no upload makes sense.
  docKey: string | null
  docLabel: string | null
}

// Heuristic: given the EPC mission title and the user's quiz answers,
// decide whether the user has already reported this improvement as done.
// Conservative — only flips true when the answer clearly indicates the
// upgrade is in place, not for "partial" or ambiguous responses.
function isMissionDone(
  title: string,
  answers: Record<string, string>,
): { done: boolean; docKey: string | null; docLabel: string | null } {
  const t = (title ?? '').toLowerCase()
  if (/(loft|roof.*insulat)/.test(t) && answers.loftInsulation === 'well') {
    return { done: true, docKey: 'loft-insulation', docLabel: 'Loft insulation photos or installer invoice' }
  }
  if (
    /(cavity|wall.*insulat|external wall|internal wall)/.test(t) &&
    ['cavity_ins', 'solid_ins', 'timber'].includes(answers.wallType)
  ) {
    return { done: true, docKey: 'wall-insulation', docLabel: 'Wall insulation guarantee or CIGA certificate' }
  }
  if (
    /(floor.*insulat)/.test(t) &&
    ['floor_ins', 'concrete'].includes(answers.floorInsulation)
  ) {
    return { done: true, docKey: 'floor-insulation', docLabel: 'Floor insulation invoice or photos' }
  }
  if (
    /(window|glaz)/.test(t) &&
    ['triple', 'new_double'].includes(answers.windows)
  ) {
    return { done: true, docKey: 'glazing', docLabel: 'FENSA / CERTASS certificate' }
  }
  if (/solar pv|photovoltaic/.test(t) && /solar_pv/.test(answers.renewables ?? '')) {
    return { done: true, docKey: 'solar-pv', docLabel: 'MCS certificate for solar PV' }
  }
  if (/solar (?:water|thermal)/.test(t) && /solar_thermal/.test(answers.renewables ?? '')) {
    return { done: true, docKey: 'solar-thermal', docLabel: 'MCS certificate for solar thermal' }
  }
  if (
    /(boiler|heating system|heat pump)/.test(t) &&
    ['heat_pump', 'gas_modern', 'electric_modern'].includes(answers.heatingType)
  ) {
    return { done: true, docKey: 'heating-cert', docLabel: 'Heating system certificate or installer invoice' }
  }
  if (
    /(led|low.energy.light|lighting)/.test(t) &&
    /(led|low)/.test(answers.energyTariff ?? '')
  ) {
    return { done: true, docKey: 'led-lighting', docLabel: 'Photos of LED fittings (optional)' }
  }
  return { done: false, docKey: null, docLabel: null }
}

// Build the mission list from the property's real epcRecommendations.
// Falls back to an empty list (page shows a friendly note) when the
// property has no EPC steps on file.
const missions = computed<Mission[]>(() => {
  const p: any = property.value
  const recs: any[] = p?.epcRecommendations || p?.epcCert?.epcRecommendations
  if (!Array.isArray(recs) || recs.length === 0) return []
  // Preserve the EPC's published order.
  const sorted = [...recs].sort((a, b) => {
    const an = Number(a?.id)
    const bn = Number(b?.id)
    if (Number.isFinite(an) && Number.isFinite(bn)) return an - bn
    return 0
  })
  return sorted.map((r: any, idx: number) => {
    const title = r?.title || r?.improvementDescr || 'EPC recommendation'
    const sap = Number(r?.resultingSap ?? 0)
    const grade = sap > 0 ? gradeFor(sap) : ''
    const doneInfo = isMissionDone(title, quizAnswers.value)
    return {
      id: String(r?.id ?? idx),
      icon: iconForRec(title),
      title,
      meta:
        r?.description ||
        `Step ${idx + 1} on this property's EPC pathway.`,
      pts: sap > 0 ? `→ ${sap} ${grade}` : `Step ${idx + 1}`,
      save: r?.typicalSaving ? `£${r.typicalSaving}/yr` : '',
      cost: r?.costRange || '',
      supplierLabel: supplierLabelForRec(title),
      done: doneInfo.done,
      docKey: doneInfo.docKey,
      docLabel: doneInfo.docLabel,
    }
  })
})

// Missions the user has reported as done — drives the verify-documents
// modal and the inline "Verify with a document" CTA on the done cards.
const doneMissionDocs = computed(() =>
  missions.value.filter((m) => m.done && m.docKey && m.docLabel),
)

// ── Verify-documents modal state ─────────────────────────────────
const verifyDocsOpen = ref(false)
// Files the user has picked, keyed by docKey. We're not actually wiring
// uploads to the backend yet — this state lets the modal show a "ready
// to upload" indicator so the user knows what they've staged. A backend
// endpoint would replace the in-memory map.
const verifyDocsUploaded = reactive<Record<string, string>>({})

function onVerifyDocPicked(e: Event, docKey: string) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  verifyDocsUploaded[docKey] = file.name
  if (input) input.value = ''
}

function closeVerifyDocs() {
  verifyDocsOpen.value = false
}

const totalSavings = computed(() => {
  const p: any = property.value
  const recs: any[] = p?.epcRecommendations || p?.epcCert?.epcRecommendations
  if (!Array.isArray(recs)) return 0
  return recs.reduce(
    (acc, r) => acc + (Number(r?.typicalSaving) || 0),
    0,
  )
})
const co2Cut = computed(() => {
  const p: any = property.value
  const now = Number(p?.co2Emissions ?? p?.epcCert?.co2Emissions ?? 0)
  const pot = Number(
    p?.co2EmissionsPotential ?? p?.epcCert?.co2EmissionsPotential ?? 0,
  )
  if (!now || !pot || pot >= now) return '0'
  return (now - pot).toFixed(1)
})

// "Build my Property Passport" — the passport dashboard, which explains
// what can be added and routes on into the claim flow.
function goToPassport() {
  router.push(`/homescore/passport/${propertyId.value}`)
}

// Back button — restore the homescore screen the user was on before they
// opened the pathway page (passed via `?from=level-up` etc.). Falls back
// to `level-up` because that's the only place the pathway button lives
// today. Bypassing `router.back()` ensures the in-page screen state is
// recreated even if the browser history was nuked.
function onBack() {
  // `replace` rather than `push` so the pathway URL gets removed from
  // browser history. Otherwise back-navigating from the resulting
  // homescore page would bounce the user right back into the pathway
  // they just left, breaking the in-page screen-history retracing
  // (level-up → questions → landing → exit).
  const from = (route.query.from as string) || 'level-up'
  router.replace(`/homescore/${propertyId.value}?screen=${encodeURIComponent(from)}`)
}

</script>

<style scoped>
/* Full-width page shell — hosts the sticky site nav, the centred content
   column, and the full-bleed footer, stacked vertically so the footer is
   pushed to the bottom on short pages. */
.hs-v6-pathway-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.hs-v6-pathway-shell > .hs-v6-pathway {
  flex: 1 0 auto;
}

/* Full-bleed page background behind everything (nav is translucent, the
   footer paints its own dark panel). Flat cream per the app-wide look —
   no gradients, no ambient orbs. Fixed so it always covers the viewport. */
.hs-v6-pathway-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #f3f2ef;
  pointer-events: none;
}

/* ── Navbar — landing-page style (pages/index.vue .lp-nav) ─────────────── */
.pw-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(243, 242, 239, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.pw-nav-inner {
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.pw-nav-left {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
/* Solid teal brand button — matches the app's primary CTA so the back
   control reads as an intentional action against the cream nav rather
   than a washed-out white box. */
.pw-nav-back {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 11px 18px;
  background: #00a19a;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  justify-content: center;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(0, 161, 154, 0.24);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.pw-nav-back:hover {
  background: #008a84;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.3);
}
.pw-nav-back:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0, 161, 154, 0.2);
}
.pw-nav-back-arrow {
  font-size: 16px;
  line-height: 1;
}
.pw-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #231d45;
}
.pw-brand-img { height: 34px; width: auto; display: block; object-fit: contain; }
.pw-brand-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
}
.pw-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}
.pw-nav-links { display: flex; gap: 4px; }
.pw-nav-links button {
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #5a5570;
  padding: 8px 12px;
  border-radius: 9px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.pw-nav-links button:hover { color: #231d45; background: rgba(35, 29, 69, 0.05); }
.pw-nav-actions { display: inline-flex; align-items: center; gap: 10px; }
.pw-nav-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ececf2;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  padding: 0;
}
.pw-mobile-menu {
  display: none;
  border-top: 1px solid rgba(35, 29, 69, 0.07);
  background: rgba(243, 242, 239, 0.97);
  backdrop-filter: blur(12px);
  padding: 8px 0 14px;
  flex-direction: column;
}
.pw-mobile-menu button {
  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #231d45;
  text-align: left;
  padding: 13px 4px;
  cursor: pointer;
  border-bottom: 1px solid rgba(35, 29, 69, 0.06);
}
.pw-mobile-menu button:last-child { border-bottom: 0; }
.pw-mobile-signin { color: #00857f !important; font-weight: 700 !important; }
.pw-menu-enter-active, .pw-menu-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pw-menu-enter-from, .pw-menu-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 960px) {
  .pw-nav-links { display: none; }
  .pw-nav-burger { display: inline-flex; }
  .pw-mobile-menu { display: flex; }
}

/* ── Content column ─────────────────────────────────────────────────── */
.hs-v6-pathway {
  --primary: #231d45;
  --accent: #00a19a;
  --accent-dark: #008a84;
  --accent-light: #00b8b0;
  --accent-pale: #e5f4f2;
  --accent-paler: #f2faf8;
  --card: #ffffff;
  --text: #231d45;
  --text-secondary: #6b7089;
  --text-faint: #a8a9ad;
  --border: #ececf2;
  --border-soft: #f2f3f7;
  --purple: #5b3795;
  --purple-pale: #f4eefe;
  --purple-border: #ddccf5;
  --warning-pale: #fff6e6;
  --shadow-sm: 0 1px 2px rgba(35, 29, 69, 0.04);
  --shadow-card: 0 4px 20px rgba(35, 29, 69, 0.06);
  --shadow-lift: 0 16px 40px rgba(35, 29, 69, 0.1);

  width: min(1180px, calc(100% - 56px));
  margin: 0 auto;
  padding: 30px 0 64px;
  color: var(--text);
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
}

@keyframes hs-v6-fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.anim-1 { animation: hs-v6-fadeUp 0.5s 0.04s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-2 { animation: hs-v6-fadeUp 0.5s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-3 { animation: hs-v6-fadeUp 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-4 { animation: hs-v6-fadeUp 0.5s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* ── Page heading ───────────────────────────────────────────────────── */
/* White shell holding the headline column and the teal card. */
.pw-hero-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  padding: 20px 22px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 6px 20px rgba(35, 29, 69, 0.06);
}
@media (min-width: 900px) {
  .pw-hero-shell {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 26px;
    align-items: center;
  }
}
.pw-hero-left {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 4px 4px 0;
  min-width: 0;
}
/* Soft mint blob behind the illustration. */
.pw-hero-left::before {
  content: '';
  position: absolute;
  left: -4%;
  bottom: 2%;
  width: 62%;
  padding-bottom: 62%;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.07);
  pointer-events: none;
}
.pw-hero-left > * { position: relative; z-index: 1; }
.pw-pagehead-art {
  width: 100%;
  max-width: 218px;
  margin-top: 14px;
  align-self: center;
  object-fit: contain;
}
.pw-pagehead-eyebrow {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
}
.pw-pagehead-eyebrow b {
  color: var(--accent-dark);
  font-weight: 800;
}
.pw-pagehead-title {
  margin: 8px 0 9px;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.7px;
  color: var(--text);
  line-height: 1.15;
  max-width: 16ch;
}
.pw-pagehead-sub {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}
.pw-pagehead-sub :deep(svg) {
  width: 14px;
  height: 14px;
  color: var(--text-faint);
}
@media (max-width: 700px) {
  .pw-hero-shell { padding: 18px; border-radius: 22px; }
  .pw-pagehead-title { font-size: 26px; }
  .pw-pagehead-art { max-width: 240px; align-self: center; }
}

/* ── Improvement pathway card ─────────────────────────────── */
.pw-improve {
  /* Sized to its content and centred against the taller left column —
     stretching it to full height left a dead band under the dials. */
  align-self: center;
  padding: 20px 22px;
  border-radius: 18px;
  color: #fff;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(0, 212, 195, 0.35), transparent 60%),
    linear-gradient(135deg, #009a92 0%, #067a72 100%);
  box-shadow: 0 10px 26px rgba(0, 122, 114, 0.18);
}
.pw-improve-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
}
.pw-improve-eyebrow-ic {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
  flex: none;
}
.pw-improve-eyebrow-ic img {
  width: 19px;
  height: 19px;
  object-fit: contain;
}
/* Two even columns so the dials and the gains each own half the card —
   a flex row let the gains drift to the far edge with dead space between. */
.pw-improve-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  margin-top: 16px;
}
@media (min-width: 700px) {
  .pw-improve-body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
  }
}

/* Current → potential dials */
.pw-improve-scores {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-width: 0;
}
.pw-ring-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.pw-ring {
  position: relative;
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
}
.pw-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.pw-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 6;
}
.pw-ring-fill {
  fill: none;
  stroke: #fff;
  stroke-width: 6;
  stroke-linecap: round;
}
.pw-ring-val {
  font-weight: 800;
  line-height: 1;
}
.pw-ring-val b { font-size: 21px; font-weight: 800; }
.pw-ring-val i {
  font-style: normal;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
}
.pw-ring-label {
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
}
.pw-improve-arrow {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 22px;
}

/* Gains column, split off by a hairline on wider screens */
.pw-improve-gains {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
}
@media (min-width: 700px) {
  .pw-improve-gains {
    padding: 0 0 0 24px;
    border-top: 0;
    border-left: 1px solid rgba(255, 255, 255, 0.25);
  }
}
.pw-gain {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* Hairline between the two gain rows. */
.pw-gain + .pw-gain {
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.pw-gain img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex: none;
}
.pw-gain span {
  display: block;
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}
.pw-gain b {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  margin-top: 2px;
}
.pw-improve-note {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  font-size: 10.5px;
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

/* ── Grant banner ───────────────────────────────────────────────────── */
.grant-banner {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: linear-gradient(135deg, #2f2760, #241e4a);
  border-radius: 20px;
  color: #fff;
  box-shadow: 0 14px 32px rgba(29, 24, 66, 0.28);
}
.grant-banner-ic {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.grant-banner-ic img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.grant-banner-title {
  font-size: 14.5px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
}
.grant-banner-sub {
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
}
.grant-banner-sub :deep(b) {
  color: #ffd48a;
  font-weight: 700;
}
.grant-banner-fine {
  margin-top: 5px;
  font-size: 11.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

/* ── Beyond the pathway — passport nudge ────────────────────────────── */
/* Lives in the ~330px sidebar, so it stacks rather than sitting in a row. */
.pw-beyond {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 18px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
}
.pw-beyond-ic {
  width: 42px;
  height: 42px;
  object-fit: contain;
  flex: none;
}
.pw-beyond-body { min-width: 0; }
.pw-beyond-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
}
.pw-beyond-sub {
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 46ch;
}
.pw-beyond-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: none;
  width: 100%;
  padding: 12px 18px;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: #fff;
  color: var(--accent-dark);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.25;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pw-beyond-btn :deep(svg) { width: 15px; height: 15px; flex: none; }
.pw-beyond-btn:hover {
  background: var(--accent);
  color: #fff;
}

/* ── Layout grid ────────────────────────────────────────────────────── */
.pw-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 26px;
}
.pw-main,
.pw-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
@media (min-width: 900px) {
  .pw-grid {
    grid-template-columns: minmax(0, 1.6fr) minmax(330px, 1fr);
    gap: 28px;
    align-items: start;
  }
  .pw-side {
    position: sticky;
    top: 92px;
  }
}

/* ── Section heading ────────────────────────────────────────────────── */
.section-h-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 4px 2px;
}
.section-h {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.section-h-sub {
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-dark);
  white-space: nowrap;
}

/* ── Empty state ────────────────────────────────────────────────────── */
.pathway-empty {
  padding: 34px 24px;
  background: var(--card);
  border: 1.5px dashed var(--border);
  border-radius: 20px;
  text-align: center;
  box-shadow: var(--shadow-card);
}
.pathway-empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin: 0 auto 14px;
  background: var(--accent-paler);
  color: var(--accent-dark);
  display: grid;
  place-items: center;
}
.pathway-empty-icon :deep(svg) { width: 26px; height: 26px; }
.pathway-empty-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 6px;
}
.pathway-empty-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 40ch;
  margin: 0 auto;
}

/* ── Mission cards ──────────────────────────────────────────────────── */
.mission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mission-card {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  box-shadow: var(--shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.mission-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-pale);
  box-shadow: var(--shadow-lift);
}
.mission-card.priority {
  border-color: rgba(0, 161, 154, 0.4);
  background: linear-gradient(180deg, var(--accent-paler), #fff 60%);
}
.mission-flag {
  position: absolute;
  top: -11px;
  left: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.9px;
  text-transform: uppercase;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  border-radius: 999px;
  box-shadow: 0 6px 14px rgba(0, 161, 154, 0.3);
}
.mission-flag :deep(svg) { width: 11px; height: 11px; }
.mission-top {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 13px;
}
.mission-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: #f4f5f9;
  color: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 1px solid var(--border-soft);
}
.mission-icon :deep(svg) { width: 21px; height: 21px; }
.mission-card.priority .mission-icon {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(0, 161, 154, 0.28);
}
/* 3D PNG recommendation icons: show the artwork itself, no tinted chip */
.mission-icon.has-img,
.mission-card.priority .mission-icon.has-img {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.mission-icon.has-img img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.mission-info {
  flex: 1;
  min-width: 0;
}
.mission-step {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--accent-dark);
  margin-bottom: 4px;
}
.mission-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.3px;
  margin-bottom: 4px;
  line-height: 1.3;
}
.mission-meta {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.5;
}
.mission-rewards {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.quest-reward {
  padding: 6px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.quest-reward :deep(svg) { width: 13px; height: 13px; }
.quest-reward.stat {
  background: var(--accent-paler);
  color: var(--accent-dark);
  border: 1px solid var(--accent-pale);
}
.quest-reward.money {
  background: var(--warning-pale);
  color: #966400;
  border: 1px solid rgba(245, 166, 35, 0.28);
}
.quest-reward.grant {
  background: var(--purple-pale);
  color: var(--purple);
  border: 1px solid var(--purple-border);
}
.mission-actions {
  display: flex;
  gap: 10px;
  padding-top: 13px;
  border-top: 1px solid var(--border-soft);
}
.mission-btn-supplier {
  flex: 1;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.22);
}
.mission-btn-supplier :deep(svg) { width: 16px; height: 16px; }
.mission-btn-ico { width: 20px; height: 20px; object-fit: contain; flex-shrink: 0; }
.mission-btn-supplier .mission-btn-arrow {
  margin-left: -2px;
  transition: transform 0.18s ease;
}
.mission-btn-supplier:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.3);
}
.mission-btn-supplier:hover .mission-btn-arrow {
  transform: translateX(3px);
}

/* Non-priority steps use a lighter outline treatment so the pathway
   isn't wall-to-wall solid teal — only the priority (step 1) CTA stays
   filled, giving the list a clear visual hierarchy. */
.mission-btn-supplier.ghost {
  background: #fff;
  color: var(--accent-dark);
  border: 1.5px solid var(--accent-pale);
  box-shadow: none;
}
.mission-btn-supplier.ghost:hover {
  background: var(--accent-paler);
  border-color: var(--accent);
  box-shadow: none;
}

/* "Already done" mission state — derived from quiz answers. Dialled
   back colours + a tick icon instead of the loud priority gradient. */
.mission-card--done {
  background: linear-gradient(180deg, #f2faf8, #fff 60%);
  border-color: #cfe9df;
}
.mission-card--done .mission-icon {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  border-color: transparent;
}
.mission-done-pill {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(0, 161, 154, 0.14);
  color: #007e78;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  vertical-align: middle;
}
.mission-btn-verify {
  flex: 1;
  padding: 13px 16px;
  background: #fff;
  color: #007e78;
  border: 1.5px solid var(--accent);
  border-radius: 13px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.mission-btn-verify :deep(svg) { width: 16px; height: 16px; }
.mission-btn-verify:hover {
  background: var(--accent-paler);
}

/* ── Floating "Verify N answers" pill ───────────────────────────────── */
.verify-pill {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  padding: 13px 22px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 34px rgba(35, 29, 69, 0.34);
  letter-spacing: -0.1px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.16s ease;
}
.verify-pill :deep(svg) { width: 15px; height: 15px; }
.verify-pill:hover {
  transform: translateX(-50%) translateY(-2px);
}

/* ── Sidebar: verified summary ──────────────────────────────────────── */
.path-summary {
  padding: 20px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 15px;
}
.path-summary-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent-paler);
  color: var(--accent-dark);
  display: grid;
  place-items: center;
}
.path-summary-icon :deep(svg) { width: 24px; height: 24px; }
.path-summary-body { flex: 1; }
.path-summary-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 3px;
}
.path-summary-sub {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ── Sidebar CTAs ───────────────────────────────────────────────────── */
.bottom-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bottom-cta-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: #fff;
  border: none;
  border-radius: 15px;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(0, 161, 154, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.bottom-cta-btn :deep(svg) { width: 18px; height: 18px; }
.bottom-cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(0, 161, 154, 0.38);
}
.bottom-cta-secondary {
  width: 100%;
  padding: 14px;
  background: var(--card);
  color: var(--text);
  border: 1.5px solid var(--border);
  border-radius: 15px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: border-color 0.15s, background 0.15s;
}
.bottom-cta-secondary :deep(svg) { width: 16px; height: 16px; }
.bottom-cta-secondary:hover {
  border-color: var(--accent);
  background: var(--accent-paler);
}

/* ── Verify-documents bottom sheet ──────────────────────────────────── */
.vd-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.vd-sheet {
  width: 100%;
  max-width: 30rem;
  background: #fff;
  border-radius: 24px;
  max-height: 92dvh;
  overflow-y: auto;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.3);
}
.vd-grip {
  width: 42px;
  height: 4px;
  background: #e4e5ed;
  border-radius: 100px;
  margin: 12px auto 0;
}
.vd-header {
  padding: 16px 26px 10px;
  text-align: center;
}
.vd-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  color: #007e78;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.vd-eyebrow :deep(svg) { width: 13px; height: 13px; }
.vd-title {
  font-size: 20px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.4px;
  margin-bottom: 8px;
}
.vd-sub {
  font-size: 13px;
  font-weight: 500;
  color: #6b7089;
  line-height: 1.6;
}
.vd-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vd-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  background: #f6f7fa;
  border: 1.5px solid transparent;
  border-radius: 15px;
  padding: 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.vd-row:hover { background: #eef0f6; }
.vd-row--filled {
  background: rgba(0, 161, 154, 0.08);
  border-color: rgba(0, 161, 154, 0.32);
}
.vd-row-ic {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border-soft);
  color: var(--primary);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.vd-row-ic :deep(svg) { width: 20px; height: 20px; }
.vd-row-body { flex: 1; min-width: 0; }
.vd-row-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #231d45;
  margin-bottom: 2px;
}
.vd-row-sub {
  font-size: 11.5px;
  font-weight: 500;
  color: #6b7089;
  line-height: 1.45;
}
.vd-row-file {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #007e78;
  margin-top: 5px;
}
.vd-row-file :deep(svg) { width: 13px; height: 13px; }
.vd-row-cta {
  font-size: 12.5px;
  font-weight: 800;
  color: #007e78;
  flex-shrink: 0;
}
.vd-row-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.vd-footer {
  display: flex;
  gap: 10px;
  padding: 14px 20px 22px;
}
.vd-btn {
  flex: 1;
  padding: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  border-radius: 14px;
  cursor: pointer;
  border: none;
  transition: transform 0.15s ease, background 0.15s ease;
}
.vd-btn.primary {
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.3);
}
.vd-btn.primary:hover { transform: translateY(-1px); }
.vd-btn.ghost {
  background: #fff;
  border: 1.5px solid #e4e5ed;
  color: #6b7089;
}
.vd-btn.ghost:hover { background: #f6f7fa; }

/* ── Responsive ─────────────────────────────────────────────────────── */
@media (max-width: 560px) {
  .hs-v6-pathway { width: calc(100% - 32px); padding: 22px 0 56px; }
  .pw-pagehead-title { font-size: 24px; }
  .pw-pagehead-art { width: 104px; height: 104px; }
  .pw-improve { padding: 20px 18px; border-radius: 18px; }
  .pw-improve-scores { gap: 12px; min-width: 0; }
  .pw-ring { width: 74px; height: 74px; }
  .mission-card { padding: 18px; }
  .pw-nav-inner { width: calc(100% - 32px); }
}
</style>
