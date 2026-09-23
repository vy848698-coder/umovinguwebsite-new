<template>
  <div class="hs-v6-quiz">
    <div class="nq-report">
      <!-- ═══════════════ HERO ═══════════════ -->
      <section class="nq-hero anim-1">
        <div class="nq-hero-main">
          <div class="nd-eyebrow">HOMESCORE<sup>™</sup> · OWNER QUIZ</div>
          <h1 class="nq-hero-title">{{ addressLine }}</h1>

          <div class="nd-hero-chips">
            <span v-if="property?.postcode" class="nd-chip">
              <Icon name="i-lucide-map-pin" />
              {{ property.postcode }}
            </span>
            <span v-if="property?.propertyType" class="nd-chip">
              <Icon name="i-lucide-home" />
              {{ property.propertyType }}
            </span>
            <span class="nd-chip nd-chip--epc">
              <span class="nd-chip-grade" :style="{ background: epcColor }">{{ epcRating || '?' }}</span>
              EPC rating
            </span>
          </div>

          <div class="nd-hero-social">
            <span class="nd-social"><span class="nd-social-dot is-live" /><b>{{ searchesTodayDisplay }}</b>&nbsp;checked this HomeScore today</span>
            <span class="nd-social-sep">·</span>
            <span class="nd-social"><span class="nd-social-dot" /><b>{{ watchersDisplay }}</b>&nbsp;{{ (watchersCount || 0) === 1 ? 'is' : 'are' }} watching this property</span>
          </div>

          <!-- Claim / passport-state card (drawer driven by headless
               PassportClaimBox below, matching the score screen) -->
          <button
            v-if="passportState === 'unclaimed'"
            class="nd-claim"
            type="button"
            @click="openClaimSheet"
          >
            <div class="nd-claim-text">
              <div class="nd-claim-title">This property is unclaimed</div>
              <div class="nd-claim-sub">Is it yours? Build your verified Passport in minutes.</div>
              <div class="nd-claim-link">What does it mean to claim?</div>
            </div>
            <span class="nd-claim-arrow">
              <Icon name="i-lucide-arrow-right" />
            </span>
          </button>
          <button
            v-else
            class="nd-claim"
            type="button"
            @click="openClaimSheet"
          >
            <div class="nd-claim-text">
              <div class="nd-claim-title">{{ passportState === 'published' ? 'Passport published' : 'Passport in progress' }}</div>
              <div class="nd-claim-sub">View the verified Property Passport for this home.</div>
              <div class="nd-claim-link">Open the Passport</div>
            </div>
            <span class="nd-claim-arrow">
              <Icon name="i-lucide-arrow-right" />
            </span>
          </button>
        </div>

        <!-- ── Live HomeScore card (animates as user answers) ──────── -->
        <aside class="nq-scorecard">
          <div class="nq-scorecard-top">
            <div class="nq-scorecard-mark">
              <span class="nq-live-dot" /> HOMESCORE<sup>™</sup> · LIVE
            </div>
            <span class="nq-delta-pill" :class="{ flash: deltaFlash }">{{ deltaText }}</span>
          </div>

          <div class="nq-scorecard-body">
            <div class="nq-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient id="quizGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#d7fbf6" />
                  </linearGradient>
                </defs>
                <circle class="nq-ring-bg" cx="60" cy="60" r="52" stroke-width="8" />
                <circle
                  class="nq-ring-fill"
                  cx="60"
                  cy="60"
                  r="52"
                  stroke-width="8"
                  stroke-dasharray="326.73"
                  :stroke-dashoffset="ringOffset"
                  stroke="url(#quizGrad)"
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
              <div class="nq-ring-num">
                <span class="nq-ring-big">{{ liveScore }}</span>
                <span class="nq-ring-small">out of 100</span>
              </div>
            </div>
            <div class="nq-scorecard-info">
              <div class="nq-scorecard-band">Climbing as you answer</div>
              <div class="nq-scorecard-copy">
                Each question updates your live score in real time.
                <b>Aim for Level C (55+)</b> to unlock the upgrade marketplace.
              </div>
            </div>
          </div>

          <div class="nq-scorecard-foot">
            <div class="nq-progress-track">
              <div class="nq-progress-fill" :style="{ width: progressPct + '%' }" />
            </div>
            <div class="nq-progress-label">
              {{ answeredCount }} of {{ QUESTS.length }} answered · earn XP for every question
            </div>
          </div>
        </aside>
      </section>

      <!-- Headless claim/passport explainer — renders no visible box; the
           styled claim card above drives its drawer via v-model:open-sheet. -->
      <PassportClaimBox
        headless
        :state="passportState"
        :progress-pct="passportProgressPct"
        :sections-done="passportSectionsDone"
        :sections-total="passportSectionsTotal"
        v-model:open-sheet="claimSheet"
        @claim-passport="$emit('claim-passport')"
        @watch="$emit('watch-property')"
        @buy="$emit('buy-passport')"
      />

      <!-- ── Two ways to update your score ─────────────────────────── -->
      <!-- Bill upload is hidden for now (re-enable via SHOW_BILL_UPLOAD). -->
      <div v-if="SHOW_BILL_UPLOAD" class="nq-twoways anim-2">
        <button
          class="nq-twoways-opt"
          :class="{ active: mode === 'quiz' }"
          type="button"
          @click="mode = 'quiz'"
        >
          <span class="nq-twoways-ico"><Icon name="i-lucide-list-checks" /></span>
          <span class="nq-twoways-text">
            <span class="nq-twoways-title">Answer questions</span>
            <span class="nq-twoways-sub">Work through the list below</span>
          </span>
        </button>
        <button
          class="nq-twoways-opt"
          :class="{ active: mode === 'bill' }"
          type="button"
          @click="onUploadBill"
        >
          <span class="nq-twoways-ico"><Icon name="i-lucide-receipt" /></span>
          <span class="nq-twoways-text">
            <span class="nq-twoways-title">Upload a bill</span>
            <span class="nq-twoways-sub">Skip the questions</span>
          </span>
        </button>
      </div>

      <!-- ═══════════════ QUESTIONS ═══════════════ -->
      <section class="nq-quiz anim-2">
        <div class="nd-block-head">
          <div class="nq-quiz-head">
            <div class="nd-eyebrow">HAS YOUR HOME HAD THESE IMPROVEMENTS?</div>
            <h2 class="nq-quiz-title">Answer what you know</h2>
          </div>
          <span class="nq-quiz-count">{{ answeredCount }} / {{ QUESTS.length }} answered</span>
        </div>

        <div class="nq-quest-grid">
          <div
            v-for="q in QUESTS"
            :key="q.id"
            class="nq-quest"
            :class="{ open: openQuest === q.id, answered: !!questState[q.id] }"
          >
            <button class="nq-quest-summary" type="button" @click="toggleQuest(q.id)">
              <span class="nq-quest-num">
                <Icon v-if="questState[q.id]" name="i-lucide-check" class="nq-quest-num-check" />
                <template v-else>{{ q.n }}</template>
              </span>
              <span class="nq-quest-info">
                <span class="nq-quest-title">{{ q.title }}</span>
                <span class="nq-quest-sub">{{ q.summary }}</span>
              </span>
              <span class="nq-quest-chev"><Icon name="i-lucide-chevron-right" /></span>
            </button>

            <div v-if="openQuest === q.id" class="nq-quest-detail">
              <p class="nq-quest-desc">{{ q.desc }}</p>

              <div class="nq-quest-impact">
                <span class="nq-impact-chip">
                  <Icon name="i-lucide-sparkles" /> +{{ q.pts }} pts
                </span>
                <span class="nq-impact-chip">
                  <Icon name="i-lucide-piggy-bank" /> saves ~£{{ q.save }}/yr
                </span>
                <span class="nq-impact-chip">
                  <Icon name="i-lucide-tag" /> {{ q.cost }}
                </span>
                <span v-if="q.grant" class="nq-impact-chip is-grant">
                  <Icon name="i-lucide-gift" /> {{ q.grant }}
                </span>
              </div>

              <div v-if="q.resultingSap != null" class="nq-quest-resulting">
                Potential rating after step {{ q.n }}:
                <span
                  class="nq-resulting-pill"
                  :class="'grade-' + (q.resultingGrade ?? '').toLowerCase()"
                >
                  {{ q.resultingSap }} {{ q.resultingGrade }}
                </span>
              </div>

              <div class="nq-quest-question">Has this been done since the last EPC?</div>
              <div class="nq-quest-options">
                <button
                  v-for="(o, key) in OPT"
                  :key="key"
                  type="button"
                  class="nq-opt-btn"
                  :class="[o.cls, { selected: questState[q.id] === key }]"
                  @click.stop="answerQuest(q.id, key)"
                >
                  <span class="nq-opt-ico"><Icon :name="OPT_ICON[key]" /></span>
                  <span>{{ o.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Finish CTA ───────────────────────────────────────────── -->
        <div class="nq-finish">
          <button class="nq-finish-btn" type="button" @click="onFinish">
            Get my real HomeScore
            <Icon name="i-lucide-arrow-right" />
          </button>
          <div v-if="answeredCount < QUESTS.length" class="nq-finish-hint">
            Skipped questions count as "not done". Answer what you know and tap above to see your score.
          </div>
          <button class="nq-reset" type="button" @click="resetQuests">
            <Icon name="i-lucide-rotate-ccw" /> Start again
          </button>
        </div>
      </section>
    </div>

    <!-- ── "Answer at least one question" prompt ───────────────────── -->
    <Teleport to="body">
      <Transition name="bill-modal">
        <div
          v-if="needAnswerModalOpen"
          class="modal-overlay hs-v6-quiz-modal"
          @click.self="needAnswerModalOpen = false"
        >
          <div class="need-answer-sheet" @click.stop>
            <div class="need-answer-icon"><Icon name="i-lucide-list-checks" /></div>
            <div class="need-answer-title">Answer at least one question</div>
            <div class="need-answer-sub">
              To work out your updated EPC and real HomeScore, we need to know
              what's changed since the certificate. Answer <b>at least one</b>
              question below and we'll recalculate your score.
            </div>
            <button
              class="need-answer-btn"
              type="button"
              @click="needAnswerModalOpen = false"
            >
              Got it — let's answer
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Bill upload bottom-sheet drawer (Teleported so it lives at
         document.body level and can't be clipped by any parent's
         overflow/transform stacking context) ──────────────────────── -->
    <Teleport to="body">
      <Transition name="bill-modal">
        <div
          v-if="billModalOpen"
          class="modal-overlay hs-v6-quiz-modal"
          @click.self="closeBillModal"
        >
          <div class="modal-sheet" @click.stop>
            <div class="modal-grip" />
            <div class="modal-head">
              <div class="modal-eyebrow"><img src="/homescore-icon/boostBolt.png" alt="" loading="lazy" />Shortcut</div>
              <div class="modal-title">Upload a bill — skip the quiz</div>
              <div class="modal-sub">
                Your last gas or electricity bill tells us your real running
                cost in seconds. More accurate than the EPC estimate.
              </div>
            </div>

            <label class="drop-zone" :class="{ 'has-file': !!selectedFile }">
              <input
                ref="fileInputRef"
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                class="drop-zone-input"
                @change="onFileSelected"
              />
              <img class="drop-zone-icon" :src="selectedFile ? '/homescore-icon/clipboardChecklist.png' : '/homescore-icon/utilityBills.png'" alt="" loading="lazy" />
              <div class="drop-zone-title">
                {{ selectedFile ? selectedFile.name : 'Drop your bill here' }}
              </div>
              <div class="drop-zone-sub">
                <template v-if="!selectedFile">
                  or <span class="drop-zone-tap">tap to browse</span>
                </template>
                <template v-else>
                  {{ formatFileSize(selectedFile.size) }} · tap to change
                </template>
              </div>
              <div v-if="!selectedFile" class="drop-zone-formats">
                PDF · JPG · PNG · screenshots
              </div>
            </label>

            <div class="modal-read-row">
              <img class="modal-read-icon" src="/homescore-icon/magnifier.png" alt="" loading="lazy" />
              <div class="modal-read-text">
                We'll read your <b>kWh</b>, <b>tariff</b> and <b>supplier</b> —
                that's all. The bill itself isn't stored after extraction.
              </div>
            </div>

            <div class="modal-suppliers">
              <div class="modal-suppliers-label">Works with</div>
              <div class="modal-supplier-grid">
                <div class="modal-supplier-tile">Octopus</div>
                <div class="modal-supplier-tile">British Gas</div>
                <div class="modal-supplier-tile">EDF</div>
                <div class="modal-supplier-tile">OVO</div>
                <div class="modal-supplier-tile">E.ON Next</div>
                <div class="modal-supplier-tile">+ 12 more</div>
              </div>
            </div>

            <div class="modal-cta-row">
              <button
                type="button"
                class="modal-btn secondary"
                @click="closeBillModal"
              >
                Maybe later
              </button>
              <button
                type="button"
                class="modal-btn primary"
                :disabled="!selectedFile"
                @click="confirmBillUpload"
              >
                {{ selectedFile ? 'Use this bill' : 'Choose a file' }}
              </button>
            </div>

            <div class="modal-privacy">
              <img class="modal-privacy-icon" src="/homescore-icon/padlock.png" alt="" loading="lazy" />
              <span>
                Powered by Ofgem tariff data. We never sell your data and bills
                are deleted after extraction.
              </span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PassportClaimBox from '~/components/property/PassportClaimBox.vue'

interface Props {
  property: any | null
  initialScore: number
  epcRating: string | null
  epcYear?: number | null
  /** Real searches today from PropertySearchLog (for the views row). */
  searchesToday?: number
  /** Number of users watching this property (wishlist + saved). */
  watchersCount?: number
  /** Passport status — drives the claim box, same as the score screen. */
  passportState?: 'unclaimed' | 'inProgress' | 'published'
  passportProgressPct?: number
  passportSectionsDone?: number
  passportSectionsTotal?: number
}

const props = withDefaults(defineProps<Props>(), {
  epcYear: null,
  searchesToday: 0,
  watchersCount: 0,
  passportState: 'unclaimed',
  passportProgressPct: 0,
  passportSectionsDone: 0,
  passportSectionsTotal: 0,
})

const emit = defineEmits<{
  (e: 'back'): void
  (
    e: 'finish',
    payload: {
      finalScore: number
      delta: number
      answers: Record<string, string>
    },
  ): void
  (e: 'upload-bill', file: File): void
  (e: 'claim-passport'): void
  (e: 'watch-property'): void
  (e: 'buy-passport'): void
}>()

// Bill-upload shortcut is parked for now; flip to re-enable the whole
// "Two ways to update your score" block + its drawer.
const SHOW_BILL_UPLOAD = false

const searchesTodayDisplay = computed(() => {
  const n = props.searchesToday ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})
const watchersDisplay = computed(() => {
  const n = props.watchersCount ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})

interface Quest {
  id: string
  n: number
  title: string
  summary: string
  desc: string
  stat: string
  pts: number
  save: number
  cost: string
  grant: string | null
  /** Cumulative SAP rating after this step, mirrors the EPC website's
   *  "Potential rating after completing step N" line. */
  resultingSap?: number | null
  resultingGrade?: string | null
}

// Fallback when the property has no EPC recommendations on file.
// (Generic prototype quests, only used if the backend hasn't enriched
// epcRecommendations yet.)
const FALLBACK_QUESTS: Quest[] = [
  {
    id: 'loft',
    n: 1,
    title: 'Increase loft insulation to 270mm',
    summary: 'Recommended on EPC',
    desc: 'Top up loft insulation to the recommended 270 mm depth.',
    stat: 'structure',
    pts: 1,
    save: 40,
    cost: '£100–£350',
    grant: null,
  },
  {
    id: 'cavity',
    n: 2,
    title: 'Cavity wall insulation',
    summary: 'Recommended on EPC',
    desc: 'Fill cavity walls to cut heat loss — usually the biggest single annual saving.',
    stat: 'structure',
    pts: 8,
    save: 224,
    cost: '£500–£1,500',
    grant: null,
  },
  {
    id: 'floor',
    n: 3,
    title: 'Floor insulation',
    summary: 'Recommended on EPC',
    desc: 'Insulate uninsulated suspended or solid floors to stop heat escaping.',
    stat: 'structure',
    pts: 3,
    save: 97,
    cost: '£800–£1,200',
    grant: null,
  },
  {
    id: 'lights',
    n: 4,
    title: 'Low energy lighting',
    summary: 'Recommended on EPC',
    desc: 'Swap remaining fittings to LED — the cheapest single EPC step.',
    stat: 'efficiency',
    pts: 1,
    save: 45,
    cost: '£110',
    grant: null,
  },
  {
    id: 'solarh',
    n: 5,
    title: 'Solar water heating',
    summary: 'Recommended on EPC',
    desc: 'Solar thermal collector pre-heats hot water from sunlight.',
    stat: 'plumbing',
    pts: 1,
    save: 40,
    cost: '£4,000–£6,000',
    grant: null,
  },
  {
    id: 'solarp',
    n: 6,
    title: 'Solar photovoltaic panels',
    summary: 'Recommended on EPC',
    desc: 'Solar PV generates electricity; SEG income for surplus exported to grid.',
    stat: 'electrics',
    pts: 9,
    save: 248,
    cost: '£9,000–£14,000',
    grant: 'SEG',
  },
]

// Heuristic: classify a recommendation into one of the 5 stat pillars
// using its title/improvementType text. Matches the prototype's stat keys.
function classifyStat(title: string, improvementType: string | null): string {
  const t = `${title} ${improvementType ?? ''}`.toLowerCase()
  if (/(solar pv|photovoltaic|electric)/.test(t)) return 'electrics'
  if (/(solar (?:water|thermal)|hot water|cylinder|hot-water)/.test(t))
    return 'plumbing'
  if (/(boiler|heating|heat pump|radiator|thermostat|controls|trv)/.test(t))
    return 'heating'
  if (/(led|lighting|light)/.test(t)) return 'efficiency'
  return 'structure' // walls, roof, floor, windows, draught — default catch-all
}

// SAP score (0-100) → EPC grade letter (A–G)
function sapToGrade(sap: number): string {
  if (sap >= 92) return 'A'
  if (sap >= 81) return 'B'
  if (sap >= 69) return 'C'
  if (sap >= 55) return 'D'
  if (sap >= 39) return 'E'
  if (sap >= 21) return 'F'
  return 'G'
}

const QUESTS = computed<Quest[]>(() => {
  // Backend may surface recommendations either at the top of the
  // Property row OR nested inside `epcCert`. Try both before falling back.
  const p: any = props.property
  const recs: any[] = p?.epcRecommendations || p?.epcCert?.epcRecommendations
  if (!Array.isArray(recs) || recs.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      '[V6QuizView] No epcRecommendations on property — using fallback quests.',
      'Property id:',
      (props.property as any)?.id,
      'Postcode:',
      (props.property as any)?.postcode,
    )
    return FALLBACK_QUESTS
  }

  // The EPC API returns steps in execution order. Preserve that order by
  // sorting on the numeric `id` (improvement-id) when it parses cleanly,
  // falling back to the array index. This matches the "Step 1, 2, 3 …"
  // numbering on find-energy-certificate.service.gov.uk.
  const sorted = [...recs].sort((a, b) => {
    const aNum = Number(a?.id)
    const bNum = Number(b?.id)
    if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum
    return 0
  })

  let prevSap: number | null = props.initialScore || null

  return sorted.map((r: any, idx: number): Quest => {
    const title = r?.title || r?.improvementDescr || 'EPC recommendation'
    const stat = classifyStat(title, r?.improvementType ?? null)
    const resultingSap: number | null =
      typeof r?.resultingSap === 'number' && Number.isFinite(r.resultingSap)
        ? r.resultingSap
        : null

    // Real points gained on THIS step = resultingSap - prevSap (cumulative
    // EPC ratings). Falls back to a saving-based estimate when SAP isn't
    // provided.
    let pts = 2
    if (resultingSap != null && prevSap != null) {
      pts = Math.max(1, Math.round(resultingSap - prevSap))
    } else {
      const saving = Number(r?.typicalSaving ?? 0)
      if (saving > 0) pts = Math.max(1, Math.round(saving / 28))
    }
    if (resultingSap != null) prevSap = resultingSap

    const grant = /eco|warm homes/i.test(`${title} ${r?.improvementType ?? ''}`)
      ? 'ECO'
      : /solar pv|photovoltaic/i.test(title)
        ? 'SEG'
        : /boiler upgrade/i.test(title)
          ? 'BUS'
          : null

    return {
      id: String(r?.id ?? `rec-${idx}`),
      n: idx + 1,
      title,
      summary: r?.improvementType
        ? `EPC: ${r.improvementType}`
        : 'Recommended on EPC',
      desc:
        r?.description || `An EPC-recommended improvement for this property.`,
      stat,
      pts,
      save: Number(r?.typicalSaving ?? 0) || 0,
      cost: r?.costRange || '—',
      grant,
      resultingSap,
      resultingGrade: resultingSap != null ? sapToGrade(resultingSap) : null,
    }
  })
})

const OPT = {
  yes: { label: 'Yes — done', icon: '✓', cls: 'opt-yes', mult: 1.0 },
  different: {
    label: 'Done something different',
    icon: '↻',
    cls: 'opt-different',
    mult: 0.5,
  },
  notyet: { label: 'Not yet', icon: '•', cls: 'opt-not-yet', mult: 0 },
  na: { label: 'Not applicable', icon: '⊘', cls: 'opt-na', mult: 0 },
} as const

type OptKey = keyof typeof OPT

// Lucide icon per answer option (memory: use <Icon> not emoji).
const OPT_ICON: Record<OptKey, string> = {
  yes: 'i-lucide-check',
  different: 'i-lucide-rotate-ccw',
  notyet: 'i-lucide-minus',
  na: 'i-lucide-ban',
}

// ── Claim / passport drawer (headless PassportClaimBox, driven from the
//    styled claim card in the hero — mirrors V6ScoreView). ──────────────
const claimSheet = ref<'unclaimed' | 'progress' | 'published' | null>(null)
function openClaimSheet() {
  claimSheet.value =
    props.passportState === 'published'
      ? 'published'
      : props.passportState === 'inProgress'
        ? 'progress'
        : 'unclaimed'
}

const questState = ref<Record<string, OptKey>>({})
const openQuest = ref<string | null>(null)
const mode = ref<'quiz' | 'bill'>('quiz')
const liveScore = ref(props.initialScore)
const deltaText = ref('+0 pts')
const deltaFlash = ref(false)

const answeredCount = computed(() => Object.keys(questState.value).length)
const progressPct = computed(
  () => (answeredCount.value / QUESTS.value.length) * 100,
)
const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 52 // 326.73
  return circumference - (liveScore.value / 100) * circumference
})

const epcColor = computed(() => {
  const map: Record<string, string> = {
    A: '#008a84',
    B: '#00a19a',
    C: '#7ab040',
    D: '#e6a23c',
    E: '#d86f4a',
    F: '#c04a1a',
    G: '#a52a2a',
  }
  return map[props.epcRating || ''] || '#a8a9ad'
})

const addressLine = computed(() => {
  const p = props.property
  if (!p) return 'Your property'
  return p.addressLine1 || p.fullAddress || 'Your property'
})

const addressMeta = computed(() => {
  const p = props.property
  if (!p) return ''
  const parts: string[] = []
  if (p.postcode) parts.push(p.postcode)
  if (p.propertyType) parts.push(p.propertyType)
  if (p.floorArea) parts.push(`${p.floorArea}m²`)
  return parts.join(' · ')
})

function toggleQuest(id: string) {
  openQuest.value = openQuest.value === id ? null : id
}

function answerQuest(id: string, ans: OptKey) {
  const prev = questState.value[id]
  questState.value = { ...questState.value, [id]: ans }
  const q = QUESTS.value.find((x) => x.id === id)
  if (!q) return
  const prevPts = prev ? Math.round(q.pts * OPT[prev].mult) : 0
  const newPts = Math.round(q.pts * OPT[ans].mult)
  const diff = newPts - prevPts
  const next = Math.max(0, Math.min(100, liveScore.value + diff))
  animateScore(liveScore.value, next, diff)
  // Auto-collapse after short delay
  setTimeout(() => {
    if (openQuest.value === id) openQuest.value = null
  }, 450)
}

function animateScore(from: number, to: number, diff: number) {
  liveScore.value = to
  if (diff !== 0) {
    const sign = diff > 0 ? '+' : ''
    deltaText.value = `${sign}${diff} pts`
    deltaFlash.value = true
    setTimeout(() => {
      deltaFlash.value = false
    }, 600)
  }
}

function resetQuests() {
  questState.value = {}
  openQuest.value = null
  liveScore.value = props.initialScore
  deltaText.value = '+0 pts'
}

// Require at least one answer before we can compute an updated EPC/HomeScore.
const needAnswerModalOpen = ref(false)
function onFinish() {
  if (answeredCount.value === 0) {
    needAnswerModalOpen.value = true
    return
  }
  const delta = liveScore.value - props.initialScore
  emit('finish', {
    finalScore: liveScore.value,
    delta,
    answers: { ...questState.value },
  })
}

// ── Bill upload drawer ────────────────────────────────────────
const billModalOpen = ref(false)
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function onUploadBill() {
  mode.value = 'bill'
  billModalOpen.value = true
}

function closeBillModal() {
  billModalOpen.value = false
  selectedFile.value = null
  mode.value = 'quiz'
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  selectedFile.value = f
}

function confirmBillUpload() {
  if (!selectedFile.value) {
    fileInputRef.value?.click()
    return
  }
  // Parsing happens on the backend later. For now, surface the file to the
  // parent so it can POST to the upload endpoint when wired up.
  emit('upload-bill', selectedFile.value)
  billModalOpen.value = false
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

watch(
  () => props.initialScore,
  (v) => {
    liveScore.value = v
  },
)
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════
   V6QuizView — premium desktop redesign.
   Shares the nd-* design language and brand tokens with V6ScoreView so
   the owner-quiz surface reads as one system with the score report.
   ═══════════════════════════════════════════════════════════════════ */
.hs-v6-quiz {
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
  --border: #e4e5ed;
  --border-soft: #f0f1f5;
  --shadow-card: 0 2px 8px rgba(35, 29, 69, 0.05);

  background: #f3f2ef;
  color: var(--text);
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  /* Contain any full-bleed children so they can't add a horizontal
     scrollbar on the web canvas. */
  overflow-x: clip;
}
.hs-v6-quiz *,
.hs-v6-quiz *::before,
.hs-v6-quiz *::after { box-sizing: border-box; }

.nq-report {
  max-width: 1120px;
  margin: 0 auto;
  padding: 30px 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: #231d45;
}

/* ── Entrance animation ─────────────────────────────────────────── */
@keyframes nq-fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.anim-1 { animation: nq-fadeUp 0.4s 0.05s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-2 { animation: nq-fadeUp 0.4s 0.16s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* ── Shared eyebrow ─────────────────────────────────────────────── */
.nd-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--accent-dark);
}
.nd-eyebrow sup { font-size: 0.7em; }

/* ═══════════════ HERO ═══════════════ */
.nq-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
  gap: 34px;
  align-items: start;
}
.nq-hero-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  min-width: 0;
}
.nq-hero-title {
  margin: 0;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: #231d45;
}

.nd-hero-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.nd-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: 0 1px 2px rgba(35, 29, 69, 0.04);
}
.nd-chip svg { width: 14px; height: 14px; opacity: 0.7; }
.nd-chip--epc { padding-left: 6px; color: #231d45; }
.nd-chip-grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
}

.nd-hero-social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
.nd-social { display: inline-flex; align-items: center; gap: 7px; }
.nd-social b { font-weight: 700; color: #231d45; }
.nd-social-sep { color: var(--text-faint); }
.nd-social-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-faint); }
.nd-social-dot.is-live {
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.18);
}

/* Claim card */
.nd-claim {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  padding: 20px;
  border: none;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  color: #fff;
  font-family: inherit;
  background:
    radial-gradient(120% 160% at 100% 0%, rgba(0, 161, 154, 0.55), transparent 60%),
    linear-gradient(135deg, #2a2350, #1a1540);
  box-shadow: 0 14px 34px rgba(26, 21, 64, 0.28);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.nd-claim:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(26, 21, 64, 0.34); }
.nd-claim-text { flex: 1; min-width: 0; }
.nd-claim-title { font-size: 16px; font-weight: 700; }
.nd-claim-sub { margin-top: 3px; font-size: 13px; color: rgba(255, 255, 255, 0.7); }
.nd-claim-link { margin-top: 9px; font-size: 12.5px; font-weight: 600; color: #4fe0d3; }
.nd-claim-arrow {
  flex-shrink: 0;
  width: 44px; height: 44px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
}
.nd-claim-arrow svg { width: 20px; height: 20px; }

/* ── Live score card (teal gradient) ────────────────────────────── */
.nq-scorecard {
  position: sticky;
  top: 88px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  border: 1px solid var(--accent-dark);
  border-radius: 20px;
  padding: 22px;
  color: #fff;
  box-shadow: 0 18px 44px rgba(0, 138, 132, 0.28);
}
.nq-scorecard-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.nq-scorecard-mark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
}
.nq-scorecard-mark sup { font-size: 0.7em; }
.nq-live-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #d7fbf6;
  box-shadow: 0 0 0 0 rgba(215, 251, 246, 0.7);
  animation: nq-pulse 1.8s ease-out infinite;
}
@keyframes nq-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(215, 251, 246, 0.55); }
  70%  { box-shadow: 0 0 0 7px rgba(215, 251, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(215, 251, 246, 0); }
}
.nq-delta-pill {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  transition: transform 0.2s, background 0.2s;
}
.nq-delta-pill.flash {
  background: #fff;
  color: var(--accent-dark);
  transform: scale(1.1);
}

.nq-scorecard-body {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 18px;
}
.nq-ring { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
.nq-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.nq-ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.22); }
.nq-ring-fill { transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
.nq-ring-num {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}
.nq-ring-big { font-size: 40px; font-weight: 800; line-height: 1; color: #fff; }
.nq-ring-small {
  margin-top: 3px; font-size: 10px; font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.nq-scorecard-info { min-width: 0; }
.nq-scorecard-band { font-size: 18px; font-weight: 700; color: #fff; }
.nq-scorecard-copy {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}
.nq-scorecard-copy b { color: #fff; font-weight: 700; }

.nq-scorecard-foot {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.nq-progress-track {
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  overflow: hidden;
}
.nq-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #fff;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.nq-progress-label {
  margin-top: 9px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Two-ways (bill upload — hidden unless SHOW_BILL_UPLOAD) ─────── */
.nq-twoways {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.nq-twoways-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}
.nq-twoways-opt:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(35, 29, 69, 0.1); }
.nq-twoways-opt.active { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.12); }
.nq-twoways-ico {
  width: 42px; height: 42px; flex-shrink: 0;
  display: grid; place-items: center;
  border-radius: 12px;
  background: var(--accent-pale);
  color: var(--accent-dark);
}
.nq-twoways-ico svg { width: 20px; height: 20px; }
.nq-twoways-title { display: block; font-size: 15px; font-weight: 700; color: var(--text); }
.nq-twoways-sub { display: block; margin-top: 2px; font-size: 12.5px; color: var(--text-secondary); }

/* ═══════════════ QUESTIONS ═══════════════ */
.nq-quiz { display: flex; flex-direction: column; gap: 18px; }
.nd-block-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.nq-quiz-title {
  margin: 6px 0 0;
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #231d45;
}
.nq-quiz-count {
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent-dark);
  padding: 7px 13px;
  border-radius: 999px;
  background: var(--accent-pale);
  white-space: nowrap;
}

.nq-quest-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  align-items: start;
}
.nq-quest {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: border-color 0.16s, box-shadow 0.16s, transform 0.16s;
}
.nq-quest:hover { box-shadow: 0 10px 26px rgba(35, 29, 69, 0.08); transform: translateY(-1px); }
.nq-quest.answered { border-color: var(--accent-pale); background: linear-gradient(180deg, var(--accent-paler), #fff 60%); }
.nq-quest.open {
  grid-column: 1 / -1;
  border-color: var(--accent);
  box-shadow: 0 16px 40px rgba(0, 138, 132, 0.14);
  transform: none;
}

.nq-quest-summary {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 18px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}
.nq-quest-num {
  flex-shrink: 0;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  border-radius: 10px;
  background: #f4f5f9;
  border: 1px solid var(--border);
  font-size: 14px;
  font-weight: 800;
  color: var(--text-secondary);
  transition: background 0.16s, color 0.16s, border-color 0.16s;
}
.nq-quest.answered .nq-quest-num {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.nq-quest-num-check { width: 18px; height: 18px; }
.nq-quest-info { flex: 1; min-width: 0; }
.nq-quest-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.25;
}
.nq-quest-sub { display: block; margin-top: 2px; font-size: 12.5px; font-weight: 500; color: var(--text-secondary); }
.nq-quest-chev {
  flex-shrink: 0;
  width: 26px; height: 26px;
  display: grid; place-items: center;
  color: var(--text-faint);
  transition: transform 0.2s, color 0.16s;
}
.nq-quest-chev svg { width: 18px; height: 18px; }
.nq-quest.open .nq-quest-chev { transform: rotate(90deg); color: var(--accent-dark); }

.nq-quest-detail {
  padding: 4px 18px 18px;
  animation: nq-fadeUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.nq-quest-desc {
  margin: 0 0 12px;
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--text-secondary);
}
.nq-quest-impact {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.nq-impact-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 11px;
  border-radius: 999px;
  background: #f4f5f9;
  border: 1px solid var(--border-soft);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
}
.nq-impact-chip svg { width: 13px; height: 13px; color: var(--accent-dark); }
.nq-impact-chip.is-grant {
  background: #fff3db;
  border-color: #f2d79a;
  color: #8a5a00;
}
.nq-impact-chip.is-grant svg { color: #b07d16; }

.nq-quest-resulting {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-secondary);
}
.nq-resulting-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  background: var(--text-faint);
}
.nq-resulting-pill.grade-a { background: #008a84; }
.nq-resulting-pill.grade-b { background: #00a19a; }
.nq-resulting-pill.grade-c { background: #7ab040; }
.nq-resulting-pill.grade-d { background: #e6a23c; }
.nq-resulting-pill.grade-e { background: #d86f4a; }
.nq-resulting-pill.grade-f { background: #c04a1a; }
.nq-resulting-pill.grade-g { background: #a52a2a; }

.nq-quest-question {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}
.nq-quest-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.nq-opt-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  text-align: left;
  transition: border-color 0.14s, background 0.14s, box-shadow 0.14s, transform 0.14s;
}
.nq-opt-btn:hover { transform: translateY(-1px); border-color: #d4d6e2; box-shadow: 0 6px 16px rgba(35, 29, 69, 0.07); }
.nq-opt-ico {
  width: 26px; height: 26px; flex-shrink: 0;
  display: grid; place-items: center;
  border-radius: 8px;
  background: #f4f5f9;
  color: var(--text-secondary);
  transition: background 0.14s, color 0.14s;
}
.nq-opt-ico svg { width: 15px; height: 15px; }

/* Selected states — tinted per answer semantics */
.nq-opt-btn.selected { color: #fff; }
.nq-opt-btn.opt-yes.selected {
  background: var(--accent); border-color: var(--accent-dark);
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.32);
}
.nq-opt-btn.opt-different.selected {
  background: #7c6ff0; border-color: #6a5be0;
  box-shadow: 0 8px 20px rgba(124, 111, 240, 0.3);
}
.nq-opt-btn.opt-not-yet.selected {
  background: #6b7089; border-color: #565b74;
  box-shadow: 0 8px 20px rgba(107, 112, 137, 0.3);
}
.nq-opt-btn.opt-na.selected {
  background: #a8a9ad; border-color: #94959a;
  box-shadow: 0 8px 20px rgba(168, 169, 173, 0.3);
}
.nq-opt-btn.selected .nq-opt-ico {
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
}

/* ── Finish CTA ─────────────────────────────────────────────────── */
.nq-finish {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}
.nq-finish-btn {
  width: 100%;
  max-width: 460px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 17px 24px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  box-shadow: 0 12px 30px rgba(0, 161, 154, 0.34);
  transition: transform 0.16s, box-shadow 0.16s, filter 0.16s;
}
.nq-finish-btn:hover { transform: translateY(-2px); filter: brightness(1.04); box-shadow: 0 16px 38px rgba(0, 161, 154, 0.42); }
.nq-finish-btn svg { width: 18px; height: 18px; }
.nq-finish-hint {
  max-width: 460px;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text-secondary);
}
.nq-reset {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-faint);
  transition: color 0.14s;
}
.nq-reset:hover { color: var(--accent-dark); }
.nq-reset svg { width: 15px; height: 15px; }

/* ═══════════════ RESPONSIVE ═══════════════ */
@media (max-width: 920px) {
  .nq-report { padding: 20px 16px 44px; gap: 24px; }
  .nq-hero { grid-template-columns: 1fr; gap: 20px; }
  .nq-scorecard { position: static; order: -1; }
  .nq-quest-grid { grid-template-columns: 1fr; }
  .nq-quest.open { grid-column: auto; }
  .nq-twoways { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .nq-scorecard-body { flex-direction: column; align-items: flex-start; }
  .nq-quest-options { grid-template-columns: 1fr; }
  .nd-block-head { flex-direction: column; align-items: flex-start; gap: 8px; }
}

/* ═══════════════ MODALS (need-answer + bill upload) ═══════════════ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(20, 16, 46, 0.5);
  backdrop-filter: blur(4px);
}

/* These overlays are Teleported to <body>, so they render outside the
   .hs-v6-quiz root where the palette variables are defined. Re-declare the
   variables here so var(--accent) / var(--text) etc. resolve — otherwise the
   modal renders blank (transparent button gradient, invisible text). */
.hs-v6-quiz-modal {
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
  --border: #e4e5ed;
  font-family:
    'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter,
    system-ui, sans-serif;
}
.need-answer-sheet,
.modal-sheet {
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 22px;
  padding: 30px 26px 26px;
  box-shadow: 0 30px 70px rgba(20, 16, 46, 0.4);
  animation: nq-fadeUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.need-answer-sheet { text-align: center; }
.need-answer-icon {
  width: 60px; height: 60px;
  margin: 0 auto 16px;
  display: grid; place-items: center;
  border-radius: 16px;
  background: var(--accent-pale);
  color: var(--accent-dark);
}
.need-answer-icon svg { width: 28px; height: 28px; }
.need-answer-title { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
.need-answer-sub {
  margin: 10px 0 22px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
}
.need-answer-btn {
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  box-shadow: 0 10px 26px rgba(0, 161, 154, 0.32);
  transition: transform 0.15s, filter 0.15s;
}
.need-answer-btn:hover { transform: translateY(-1px); filter: brightness(1.04); }

.modal-grip { width: 40px; height: 4px; border-radius: 2px; background: var(--border); margin: 0 auto 16px; }
.modal-eyebrow { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-dark); }
.modal-eyebrow img { width: 18px; height: 18px; object-fit: contain; }
.modal-title { margin-top: 6px; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: var(--text); }
.modal-sub { margin-top: 8px; font-size: 14px; line-height: 1.55; color: var(--text-secondary); }
.drop-zone {
  display: block;
  margin: 18px 0;
  padding: 26px;
  border-radius: 16px;
  border: 2px dashed var(--border);
  background: #f9fafc;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.drop-zone:hover, .drop-zone.has-file { border-color: var(--accent); background: var(--accent-paler); }
.drop-zone-input { display: none; }
.drop-zone-icon { display: block; width: 42px; height: 42px; object-fit: contain; margin: 0 auto; }
.drop-zone-title { margin-top: 8px; font-size: 15px; font-weight: 700; color: var(--text); }
.drop-zone-sub { margin-top: 4px; font-size: 13px; color: var(--text-secondary); }
.drop-zone-tap { color: var(--accent-dark); font-weight: 700; }
.drop-zone-formats { margin-top: 8px; font-size: 11.5px; color: var(--text-faint); }
.modal-read-row { display: flex; gap: 10px; padding: 12px; border-radius: 12px; background: #f4f5f9; font-size: 12.5px; line-height: 1.5; color: var(--text-secondary); }
.modal-read-icon { width: 22px; height: 22px; object-fit: contain; flex-shrink: 0; }
.modal-privacy-icon { width: 16px; height: 16px; object-fit: contain; flex-shrink: 0; }
.modal-suppliers { margin-top: 16px; }
.modal-suppliers-label { font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-faint); }
.modal-supplier-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.modal-supplier-tile { padding: 6px 11px; border-radius: 999px; background: #f4f5f9; border: 1px solid var(--border-soft); font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.modal-cta-row { display: flex; gap: 10px; margin-top: 20px; }
.modal-btn { flex: 1; padding: 14px; border-radius: 12px; cursor: pointer; font-family: inherit; font-size: 14px; font-weight: 700; transition: filter 0.15s, transform 0.15s; }
.modal-btn.secondary { background: #f4f5f9; border: 1px solid var(--border); color: var(--text); }
.modal-btn.primary { border: none; color: #fff; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); box-shadow: 0 8px 20px rgba(0, 161, 154, 0.3); }
.modal-btn.primary:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-btn:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.03); }
.modal-privacy { display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 12px; color: var(--text-faint); }

/* Modal transitions */
.bill-modal-enter-active, .bill-modal-leave-active { transition: opacity 0.25s ease; }
.bill-modal-enter-from, .bill-modal-leave-to { opacity: 0; }
</style>
