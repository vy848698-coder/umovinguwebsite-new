<template>
  <div class="rd-page">
   <div class="rd-shell">
    <div class="rd-col rd-col-main">
    <!-- ── Teal address card ───────────────────────────────────── -->
    <div class="rd-addr-card" data-tour="addr">
      <div class="rd-addr-top">
        <div class="rd-addr-pin" />
        <div class="rd-addr-block">
          <div class="rd-addr-line">
            {{ addressTyped }}<span
              v-if="!addressTypingDone"
              class="rd-typewriter-caret"
              aria-hidden="true"
            >|</span>
          </div>
          <div class="rd-addr-meta">
            {{ property?.postcode || '' }}
            <template v-if="property?.propertyType">
              · {{ property.propertyType }}</template
            >
          </div>
        </div>
      </div>

      <!-- EPC + State pills -->
      <div class="rd-addr-pills">
        <span v-if="epcRating" class="rd-addr-pill epc">
          <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
            <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" />
          </svg>
          <span class="rd-epc-letter" :style="{ background: epcColor }">{{
            epcRating
          }}</span>
          EPC
        </span>
        <button
          v-if="state === 'unclaimed'"
          class="rd-addr-pill rd-state-unclaimed"
          type="button"
          @click="$emit('claim')"
        >
          Unclaimed · Claim yours
          <span class="rd-arrow">→</span>
        </button>
        <span
          v-else-if="state === 'inProgress'"
          class="rd-addr-pill rd-state-progress"
          >In progress</span
        >
        <span
          v-else-if="state === 'published'"
          class="rd-addr-pill rd-state-published"
          >✓ Published</span
        >
      </div>

      <!-- FOMO stats row — counts pulled live from PropertySearchLog -->
      <div v-if="todaySearches > 0 || monthSearches > 0" class="rd-addr-stats">
        <div v-if="state === 'unclaimed'" class="rd-stat-row">
          <span class="rd-pulse-dot" />
          <span class="rd-stat-count"
            >{{ todaySearches }} {{ todaySearches === 1 ? 'search' : 'searches' }} today</span
          >
          <span class="rd-sep">·</span>
          <span>No verified Passport on this address yet</span>
          <span class="rd-sep">·</span>
          <span>Public EPC data only</span>
        </div>
        <div v-else-if="state === 'inProgress'" class="rd-stat-row">
          <span class="rd-pulse-dot" />
          <span class="rd-stat-count"
            >{{ todaySearches }} {{ todaySearches === 1 ? 'search' : 'searches' }} today</span
          >
          <span class="rd-sep">·</span>
          <span>Owner is building a Passport</span>
          <span class="rd-sep">·</span>
          <span>Public EPC data only for now</span>
        </div>
        <div v-else class="rd-stat-row">
          <span class="rd-pulse-dot rd-pulse-green" />
          <span class="rd-stat-count"
            >{{ monthSearches }} {{ monthSearches === 1 ? 'search' : 'searches' }} this month</span
          >
          <span class="rd-sep">·</span>
          <span>Verified Passport live</span>
          <span class="rd-sep">·</span>
          <span>Owner's real data</span>
        </div>
      </div>
    </div>

    <!-- ── HomeScore card (moved ABOVE running cost — it's the page's focus) ── -->
    <div class="rd-score-card" :class="scoreTone" data-tour="score">
      <div class="rd-score-eyebrow">
        <div class="left">HomeScore</div>
        <div
          class="right"
          :class="{ 'right--verified': state === 'published' }"
        >
          <template v-if="state === 'published'">✓ Verified data</template>
          <template v-else-if="state === 'inProgress'">Public EPC</template>
          <template v-else>EPC data · {{ displayEpcYear }}</template>
        </div>
      </div>
      <div class="rd-score-gauge-wrap">
        <div class="rd-gauge">
          <svg viewBox="0 0 120 120">
            <circle
              class="g-bg"
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke-width="9"
            />
            <circle
              class="g-fill"
              cx="60"
              cy="60"
              r="50"
              fill="none"
              :stroke="gaugeColor"
              stroke-width="9"
              stroke-linecap="round"
              stroke-dasharray="314.16"
              :stroke-dashoffset="314.16 - (scoreDisplay / 100) * 314.16"
              style="transition: stroke-dashoffset 0.6s cubic-bezier(.22,1,.36,1)"
            />
          </svg>
          <div class="rd-g-num">
            <div class="gn-big">{{ scoreDisplay }}</div>
            <div class="gn-small">/ 100</div>
          </div>
        </div>
        <div class="rd-score-summary">
          <div class="rd-score-band">{{ scoreBand }}</div>
          <div class="rd-score-explainer" v-html="scoreExplainer" />
        </div>
      </div>
      <div v-if="dataNote" class="rd-data-note">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
        </svg>
        <div v-html="dataNote" />
      </div>
    </div>

    <!-- ── Overpay / running cost hero ───────────────────────── -->
    <div class="rd-overpay" data-tour="overpay">
      <div class="rd-overpay-eyebrow">
        <span class="rd-dot" />Estimated annual running cost · EPC data
      </div>
      <div class="rd-overpay-num">
        £{{ formatNum(annualCostDisplay)
        }}<span class="rd-unit"> / year</span>
      </div>
      <div class="rd-overpay-sub">
        <template v-if="overpayDiff > 0"
          >£{{ formatNum(overpayDisplay) }} above the street average. Tap below to
          see the full breakdown.</template
        >
        <template v-else
          >About the same as the street average. Open the breakdown to see where
          the money goes.</template
        >
      </div>
      <!-- Primary: See full running costs (white pill, teal-dark text) — navigates to the dedicated page -->
      <button
        class="rd-cta-btn rd-cta-btn--primary"
        type="button"
        @click="$emit('see-running-costs')"
      >
        <span class="rd-cta-emoji">📊</span>
        <span class="rd-cta-text">
          <span class="rd-cta-label">See full running costs</span>
          <span class="rd-cta-sub"
            >Heating, hot water &amp; lighting — monthly and annual
            breakdowns</span
          >
        </span>
        <svg
          class="rd-cta-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
      <!-- Secondary: See your street comparison (translucent-on-teal) -->
      <button
        class="rd-cta-btn rd-cta-btn--ghost"
        type="button"
        @click="$emit('see-street')"
      >
        <span class="rd-cta-emoji">🏘️</span>
        <span class="rd-cta-text">
          <span class="rd-cta-label">See your street comparison</span>
          <span class="rd-cta-sub"
            >How this home's costs and score stack up against nearby
            properties</span
          >
        </span>
        <svg
          class="rd-cta-arrow"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>

    </div>
    <div class="rd-col rd-col-side">
    <!-- ── EPC & breakdown card ───────────────────────────────── -->
    <div class="rd-breakdown" data-tour="breakdown">
      <!-- EPC rating row -->
      <div class="rd-epc-row">
        <div class="rd-epc-col">
          <div class="rd-epc-label">EPC Rating</div>
          <div class="rd-epc-lines">
            <div class="rd-epc-line">
              <span
                class="rd-epc-letter-big"
                :style="{ background: epcColor }"
                >{{ epcRating || '—' }}</span
              >
              <span class="rd-epc-text">Current · {{ epcCurrentSap }} SAP</span>
            </div>
            <div class="rd-epc-line">
              <span
                class="rd-epc-letter-big"
                :style="{ background: '#7AB040' }"
                >{{ epcPotentialLetter }}</span
              >
              <span class="rd-epc-text rd-epc-text--potential"
                >Potential · {{ epcPotentialSap }} SAP</span
              >
            </div>
          </div>
        </div>
        <div class="rd-epc-saving">
          <div class="rd-epc-label">Potential saving</div>
          <div class="rd-epc-saving-num">£{{ formatNum(potentialSaving) }}</div>
          <div class="rd-epc-saving-meta">per year</div>
        </div>
      </div>

      <!-- Energy cells — three £ breakdowns that sum to the hero figure. -->
      <div class="rd-energy-row">
        <div class="rd-energy-cell">
          <div class="rd-energy-eyebrow">Heating</div>
          <div class="rd-energy-num navy">£{{ formatNum(heatingCost) }}</div>
          <div class="rd-energy-meta">per year</div>
        </div>
        <div class="rd-energy-cell">
          <div class="rd-energy-eyebrow">Hot water</div>
          <div class="rd-energy-num navy">£{{ formatNum(hotWaterCost) }}</div>
          <div class="rd-energy-meta">per year</div>
        </div>
        <div class="rd-energy-cell">
          <div class="rd-energy-eyebrow">Lighting</div>
          <div class="rd-energy-num navy">£{{ formatNum(lightingCost) }}</div>
          <div class="rd-energy-meta">per year</div>
        </div>
      </div>

      <!-- Environmental impact -->
      <div class="rd-env">
        <div class="rd-env-eyebrow">🌍 Environmental impact</div>
        <div class="rd-env-row">
          <div>
            <div class="rd-env-num">{{ co2Now.toFixed(1) }}t</div>
            <div class="rd-env-meta">CO₂ per year · currently</div>
          </div>
          <div class="rd-env-arrow">▸</div>
          <div style="text-align: right">
            <div class="rd-env-num rd-env-num--teal">
              {{ co2Potential.toFixed(1) }}t
            </div>
            <div class="rd-env-meta rd-env-meta--teal">
              potential with improvements
            </div>
          </div>
        </div>
        <div class="rd-env-bar">
          <div class="rd-env-fill" :style="{ width: `${co2ReductionPct}%` }" />
        </div>
        <div class="rd-env-foot">
          {{ co2ReductionPct.toFixed(1) }}% reduction possible
        </div>
      </div>
    </div>

    <!-- ── Score pillar breakdown (Heating / Structure / …) ───── -->
    <div v-if="pillars.length" class="rd-pillars-card" data-tour="pillars">
      <div class="rd-pillars-head">
        <div class="rd-pillars-title">Score breakdown</div>
        <div class="rd-pillars-sub">Across five pillars · EPC stats</div>
      </div>
      <div class="rd-pillars-list">
        <div v-for="p in pillars" :key="p.id" class="rd-pillar-row">
          <span class="rd-pillar-dot" :style="{ background: p.color }" />
          <span class="rd-pillar-name">{{ p.label }}</span>
          <div class="rd-pillar-track">
            <div
              class="rd-pillar-bar"
              :style="{ width: `${(p.value / p.max) * 100}%`, background: p.color }"
            />
          </div>
          <span class="rd-pillar-score">
            {{ p.value }}<span class="rd-pillar-max"> / {{ p.max }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- ── Full EPC breakdown (collapsible) ───────────────────── -->
    <div class="rd-epcfull-card" data-tour="epcfull">
      <button
        type="button"
        class="rd-epcfull-head"
        :aria-expanded="epcOpen ? 'true' : 'false'"
        @click="epcOpen = !epcOpen"
      >
        <span class="rd-epcfull-ic">⚡</span>
        <span class="rd-epcfull-head-text">
          <span class="rd-epcfull-title">Full EPC breakdown</span>
          <span class="rd-epcfull-sub">
            Every line behind your score · {{ epcLines.length }} items
          </span>
        </span>
        <svg
          class="rd-epcfull-chev"
          :class="{ open: epcOpen }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div v-if="epcOpen" class="rd-epcfull-body">
        <!-- Current → potential summary -->
        <div class="rd-epcfull-summary">
          <div class="rd-epcfull-grade">
            <span class="rd-epc-letter-big" :style="{ background: epcColor }">{{ epcRating || '—' }}</span>
            <span class="rd-epcfull-grade-meta">Current · {{ epcCurrentSap }}</span>
          </div>
          <span class="rd-epcfull-arrow">→</span>
          <div class="rd-epcfull-grade">
            <span class="rd-epc-letter-big" :style="{ background: '#7AB040' }">{{ epcPotentialLetter }}</span>
            <span class="rd-epcfull-grade-meta">Potential · {{ epcPotentialSap }}</span>
          </div>
          <div class="rd-epcfull-saving">
            <div class="rd-epcfull-saving-num">£{{ formatNum(potentialSaving) }}<span>/yr</span></div>
            <div class="rd-epcfull-saving-meta">potential saving</div>
          </div>
        </div>

        <!-- Line items -->
        <div class="rd-epcfull-lines">
          <div v-for="l in epcLines" :key="l.label" class="rd-epcfull-line">
            <span class="rd-epcfull-line-ic">{{ l.icon }}</span>
            <span class="rd-epcfull-line-body">
              <span class="rd-epcfull-line-label">{{ l.label }}</span>
              <span class="rd-epcfull-line-sub">{{ l.sub }}</span>
            </span>
            <span class="rd-epcfull-line-rating" :style="{ color: l.color, borderColor: l.color }">
              {{ l.rating }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Your street (rank + inline map) ────────────────────── -->
    <div class="rd-street-card" data-tour="street">
      <div class="rd-street-eyebrow">🏘️ Your street · {{ streetName }}</div>
      <div class="rd-street-rankrow">
        <div class="rd-street-rank">#{{ streetRank }}</div>
        <div class="rd-street-rank-text">
          <div class="rd-street-of">of {{ streetHomes.length }} homes</div>
          <div class="rd-street-delta" :class="streetSaving >= 0 ? 'good' : 'bad'">
            {{ streetSavingAbs }} {{ streetSaving >= 0 ? 'cheaper than' : 'more than' }} the street average
          </div>
        </div>
      </div>

      <!-- House row -->
      <div class="rd-street-houses">
        <div
          v-for="(h, i) in streetHomes"
          :key="i"
          class="rd-street-house"
          :class="[h.tone, { you: h.you }]"
          :title="h.you ? 'This property' : `£${formatNum(h.cost)}/yr`"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3 L21 10 L19 10 L19 20 L14 20 L14 14 L10 14 L10 20 L5 20 L5 10 L3 10 Z" />
          </svg>
        </div>
      </div>

      <button type="button" class="rd-street-toggle" @click="streetOpen = !streetOpen">
        {{ streetOpen ? 'Hide street map' : 'Explore your street map' }}
        <span class="rd-street-toggle-arrow" :class="{ open: streetOpen }">›</span>
      </button>

      <!-- Expanded detail -->
      <div v-if="streetOpen" class="rd-street-detail">
        <div class="rd-street-list">
          <div
            v-for="h in rankedHomes"
            :key="h.addr"
            class="rd-street-li"
            :class="{ you: h.you }"
          >
            <span class="rd-street-li-rank">{{ h.rank }}</span>
            <span class="rd-street-li-body">
              <span class="rd-street-li-addr">{{ h.addr }}<template v-if="h.you"> — you</template></span>
              <span class="rd-street-li-meta">{{ h.meta }}</span>
            </span>
            <span class="rd-street-li-cost" :style="{ color: toneColor(h.tone) }">
              £{{ formatNum(h.cost) }}
            </span>
          </div>
        </div>

        <div class="rd-street-legend">
          <span><i style="background:#00a19a" />Under £1,500</span>
          <span><i style="background:#d99a2b" />£1,500–2,000</span>
          <span><i style="background:#dc2626" />Over £2,000</span>
        </div>

        <!-- EPC pathway projection -->
        <div class="rd-street-pathway">
          <div class="rd-street-pathway-label">If you complete the EPC pathway</div>
          <div class="rd-street-pathway-row">
            <div class="rd-street-pathway-cost">£{{ formatNum(pathwayCost) }}<span>/yr</span></div>
            <div class="rd-street-pathway-meta">
              #{{ pathwayRank }} of {{ streetHomes.length }} · up from #{{ streetRank }}
            </div>
            <div class="rd-street-pathway-save">−£{{ formatNum(pathwaySaving) }}/yr</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Intent picker ─────────────────────────────────────── -->
    <div class="rd-intent" data-tour="intent">
      <div class="rd-intent-eyebrow">
        <template v-if="state === 'unclaimed'"
          >What's your connection to this property?</template
        >
        <template v-else>What brings you here?</template>
      </div>
      <div class="rd-intent-opts">
        <button
          v-if="state === 'unclaimed'"
          class="rd-intent-opt primary"
          type="button"
          @click="$emit('claim')"
        >
          <span class="rd-intent-icon">🏠</span>
          <span class="rd-intent-body">
            <span class="rd-intent-title">I own this property</span>
            <span class="rd-intent-sub"
              >Tell us what's been done since the EPC — we'll update the score
              and cut your estimated bills.</span
            >
          </span>
          <span class="rd-intent-chev">›</span>
        </button>
        <button
          v-else
          class="rd-intent-opt primary"
          type="button"
          @click="$emit('owner-dashboard')"
        >
          <span class="rd-intent-icon">📄</span>
          <span class="rd-intent-body">
            <span class="rd-intent-title">Go to my dashboard</span>
            <span class="rd-intent-sub">
              <template v-if="state === 'published'"
                >Your Passport is published — manage your record.</template
              >
              <template v-else
                >Your Passport is in progress — pick up where you left
                off.</template
              >
            </span>
          </span>
          <span class="rd-intent-chev">›</span>
        </button>

        <button
          v-if="state !== 'unclaimed'"
          class="rd-intent-opt outline"
          type="button"
          @click="$emit('refine-score')"
        >
          <span class="rd-intent-icon">📝</span>
          <span class="rd-intent-body">
            <span class="rd-intent-title">Refine my HomeScore</span>
            <span class="rd-intent-sub">
              Retake the {{ '2-min' }} quiz — tell us what's been done since the
              EPC to update your saved score.
            </span>
          </span>
          <span class="rd-intent-chev">›</span>
        </button>

        <button
          class="rd-intent-opt outline"
          type="button"
          @click="$emit('interested')"
        >
          <span class="rd-intent-icon">🔍</span>
          <span class="rd-intent-body">
            <span class="rd-intent-title">I'm interested in this property</span>
            <span class="rd-intent-sub">
              <template v-if="state === 'published'"
                >The verified Passport is live — purchase access to see
                everything.</template
              >
              <template v-else-if="state === 'inProgress'"
                >Save it — we'll notify you when the Passport is
                published.</template
              >
              <template v-else
                >See full running costs, risks and what to ask before buying or
                renting.</template
              >
            </span>
          </span>
          <span class="rd-intent-chev">›</span>
        </button>
      </div>

      <div v-if="state !== 'unclaimed'" class="rd-watchers">
        <span
          class="rd-pulse-dot"
          :class="state === 'published' ? 'rd-pulse-green' : 'rd-pulse-amber'"
        />
        <template v-if="state === 'published'"
          >26 people viewed this Passport this month</template
        >
        <template v-else>3 buyers are watching this property</template>
      </div>
    </div>

    </div>
   </div>

    <div style="height: 28px" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { Pillar } from '~/types/homescore'
import { calculateScore, getPrefillFromProperty, getPillarMax } from '~/utils/homescoreScoring'

// ── Tween helper: counts up from 0 → target with ease-out cubic on mount,
// and re-tweens when the source changes (e.g. once real EPC data resolves).
// Honours prefers-reduced-motion (returns instant value).
function useTween(source: () => number, durationMs = 900) {
  // Start at 0 so the count-up is visible even when the value is already
  // available synchronously at mount.
  const out = ref<number>(0)
  let raf = 0
  let cancelled = false
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

  function animateTo(to: number) {
    if (cancelled) return
    if (prefersReduced) { out.value = to; return }
    cancelAnimationFrame(raf)
    const from = out.value
    if (from === to) return
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(1, elapsed / durationMs)
      out.value = from + (to - from) * easeOutCubic(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }

  watch(source, (v) => animateTo(Number(v) || 0))
  onMounted(() => animateTo(Number(source()) || 0))
  onBeforeUnmount(() => { cancelled = true; cancelAnimationFrame(raf) })
  return out
}

// Typewriter: reveals `source()` character by character. Re-runs when source
// changes (e.g. property loads async). Honours prefers-reduced-motion.
function useTypewriter(source: () => string, msPerChar = 32) {
  const out = ref<string>('')
  let timer: ReturnType<typeof setInterval> | null = null
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function start(text: string) {
    if (timer) { clearInterval(timer); timer = null }
    const full = text || ''
    if (prefersReduced || !full) { out.value = full; return }
    out.value = ''
    let i = 0
    timer = setInterval(() => {
      i += 1
      out.value = full.slice(0, i)
      if (i >= full.length && timer) { clearInterval(timer); timer = null }
    }, msPerChar)
  }

  watch(source, (v) => start(v || ''))
  onMounted(() => start(source() || ''))
  onBeforeUnmount(() => { if (timer) clearInterval(timer) })
  return out
}

type PassportState = 'unclaimed' | 'inProgress' | 'published'

const props = defineProps<{
  property: any | null
  score: number
  epcRating: string | null
  state: PassportState
  /** EPC-derived annual running cost estimate (£/year). */
  estimatedAnnualCost: number
  /** Street average annual cost (£/year). Used for overpay sub-line. */
  streetAvgCost?: number
  /** Year the EPC was lodged (shown in score eyebrow). */
  epcYear?: number | null
  /** Real `today` / `thisMonth` counts from /property/:id/search-stats. */
  searchStats?: {
    today?: number
    thisMonth?: number
    distinctVisitors?: number
  } | null
}>()

defineEmits<{
  (e: 'claim'): void
  (e: 'owner-dashboard'): void
  (e: 'interested'): void
  (e: 'see-street'): void
  (e: 'see-running-costs'): void
  (e: 'refine-score'): void
}>()

// ── Score pillar breakdown (Heating / Structure / Efficiency / Electrics / Plumbing)
// Derived from public EPC data via the shared V1 scoring model (same one the
// owner quiz refines), so it stays consistent across the app.
const PILLAR_META: { id: Pillar; label: string; color: string }[] = [
  { id: 'heating', label: 'Heating', color: '#ef4444' },
  { id: 'structure', label: 'Structure', color: '#f59e0b' },
  { id: 'efficiency', label: 'Efficiency', color: '#22c55e' },
  { id: 'electrics', label: 'Electrics', color: '#3b82f6' },
  { id: 'plumbing', label: 'Plumbing', color: '#8b5cf6' },
]
const pillars = computed(() => {
  if (!props.property) return []
  const breakdown = calculateScore(getPrefillFromProperty(props.property)).breakdown
  return PILLAR_META.map((m) => ({
    ...m,
    value: breakdown[m.id],
    max: getPillarMax(m.id),
  }))
})

// ── Full EPC breakdown accordion ─────────────────────────────────────
const epcOpen = ref(false)

// Map an EPC efficiency label ("Good", "Very Poor", …) to a display colour.
function effColor(label: string): string {
  const l = label.toLowerCase()
  if (l.includes('very good')) return '#16a34a'
  if (l.includes('good')) return '#65a30d'
  if (l.includes('average')) return '#d99a2b'
  if (l.includes('very poor')) return '#dc2626'
  if (l.includes('poor')) return '#e0684b'
  return '#9c98ad' // N/A / unknown
}

const EPC_LINE_META: { key: string; label: string; sub: string; icon: string }[] = [
  { key: 'mainheatEnergyEff', label: 'Main heating', sub: 'Heating system', icon: '🔥' },
  { key: 'mainheatcEnergyEff', label: 'Heating controls', sub: 'Controls', icon: '🎛️' },
  { key: 'hotWaterEnergyEff', label: 'Hot water', sub: 'Hot water system', icon: '💧' },
  { key: 'wallsEnergyEff', label: 'Walls', sub: 'Walls', icon: '🧱' },
  { key: 'roofEnergyEff', label: 'Roof · loft insulation', sub: 'Roof', icon: '🏠' },
  { key: 'floorEnergyEff', label: 'Floor', sub: 'Floor', icon: '🟫' },
  { key: 'windowsEnergyEff', label: 'Windows', sub: 'Windows', icon: '🪟' },
  { key: 'lightingEnergyEff', label: 'Lighting', sub: 'Lighting', icon: '💡' },
]
const epcLines = computed(() =>
  EPC_LINE_META.map((m) => {
    const raw = props.property?.[m.key]
    const rating = raw ? String(raw) : 'N/A'
    return { ...m, rating, color: raw ? effColor(rating) : '#9c98ad' }
  }),
)

// ── Your street: rank card + inline map ──────────────────────────────
// Neighbour costs are derived illustratively from the subject property + street
// average (same approach as pages/homescore/street/[id].vue) — public EPC data
// doesn't expose per-neighbour bills, so this is a modelled comparison.
const streetOpen = ref(false)
const streetAvg = computed(() => Number(props.streetAvgCost) || 1673)
const youCost = computed(() => Number(props.estimatedAnnualCost) || streetAvg.value)
const streetName = computed(() => {
  const a: string = props.property?.addressLine1 || ''
  const m = a.match(/^\d+[a-z]?,?\s*(.+)$/i)
  return m ? m[1] : a || 'this street'
})
function toneOf(cost: number): 'low' | 'mid' | 'high' {
  return cost < 1500 ? 'low' : cost < 2000 ? 'mid' : 'high'
}
function toneColor(t: string): string {
  return t === 'low' ? '#00a19a' : t === 'mid' ? '#d99a2b' : '#dc2626'
}
function metaFor(cost: number): string {
  if (cost < 1400) return 'Filled cavity · modern glazing · EPC C'
  if (cost < 1700) return 'Part-insulated · EPC D'
  if (cost < 2100) return 'Older glazing · EPC D/E'
  return 'No insulation · single glazing · EPC F'
}
const streetHomes = computed(() => {
  const avg = streetAvg.value
  const rel = [0.76, 0.82, 0.86, 0.92, 0.97, 1.03, 1.09, 1.18, 1.31, 1.46]
  const homes = rel.map((r, i) => {
    const cost = Math.round((avg * r) / 10) * 10
    return {
      cost,
      tone: toneOf(cost),
      you: false,
      addr: `${i * 2 + 1} ${streetName.value}`,
      meta: metaFor(cost),
    }
  })
  homes.push({
    cost: youCost.value,
    tone: toneOf(youCost.value),
    you: true,
    addr: props.property?.addressLine1 || 'This property',
    meta: 'Your property · public EPC estimate',
  })
  return homes.sort((a, b) => a.cost - b.cost)
})
const rankedHomes = computed(() =>
  streetHomes.value.map((h, i) => ({ ...h, rank: i + 1 })),
)
const streetRank = computed(
  () => rankedHomes.value.find((h) => h.you)?.rank ?? 0,
)
// Positive = cheaper than the street average.
const streetSaving = computed(() => streetAvg.value - youCost.value)
const streetSavingAbs = computed(() => `£${formatNum(Math.abs(streetSaving.value))}`)
const pathwaySaving = computed(() => Math.round(youCost.value * 0.28))
const pathwayCost = computed(() => youCost.value - pathwaySaving.value)
const pathwayRank = computed(() => {
  const c = pathwayCost.value
  let r = 1
  for (const h of streetHomes.value) if (!h.you && h.cost < c) r++
  return r
})

// ── Derived numbers ──
const overpayDiff = computed(() =>
  props.streetAvgCost
    ? Math.max(0, props.estimatedAnnualCost - props.streetAvgCost)
    : 0,
)

// EPC year shown in the score-card eyebrow. Prototype hard-codes "2014" when
// data is missing — we mirror that fallback so the chip never shows just
// "EPC data" with nothing after.
const displayEpcYear = computed<number>(() => props.epcYear ?? 2014)

// ── Animated display values (count up on initial render + when source changes)
const animatedScore = useTween(() => Number(props.score) || 0, 1100)
const animatedAnnualCost = useTween(() => Number(props.estimatedAnnualCost) || 0, 900)
const animatedOverpay = useTween(() => Math.max(0, Number(props.estimatedAnnualCost) - (Number(props.streetAvgCost) || 0)), 900)
const scoreDisplay = computed(() => Math.round(animatedScore.value))
const annualCostDisplay = computed(() => Math.round(animatedAnnualCost.value))
const overpayDisplay = computed(() => Math.round(animatedOverpay.value))

// Typewriter address line — reveals the address one character at a time on
// first render (and again when the property loads async).
const addressFull = computed(
  () => props.property?.addressLine1 || 'This property',
)
const addressTyped = useTypewriter(() => addressFull.value, 32)
const addressTypingDone = computed(
  () => addressTyped.value.length >= addressFull.value.length,
)

// ── EPC numbers — prefer real fields enriched onto the property row from the
// EPC Register; fall back to per-rating heuristics only when those fields
// are still null (property hasn't been enriched yet).

const realEpcScore = computed<number | null>(
  () => numOrNull(props.property?.epcScore),
)
const realEpcScorePotential = computed<number | null>(
  () => numOrNull(props.property?.epcScorePotential),
)
const realEpcRatingPotential = computed<string | null>(() => {
  const v = props.property?.epcRatingPotential
  return v ? String(v).toUpperCase() : null
})
const realCo2Current = computed<number | null>(
  () => numOrNull(props.property?.co2Emissions),
)
const realCo2Potential = computed<number | null>(
  () => numOrNull(props.property?.co2EmissionsPotential),
)
const realHeatingCost = computed<number | null>(
  () => numOrNull(props.property?.heatingCostCurrent),
)
const realHotWaterCost = computed<number | null>(
  () => numOrNull(props.property?.hotWaterCostCurrent),
)
const realLightingCost = computed<number | null>(
  () => numOrNull(props.property?.lightingCostCurrent),
)
const realEnergyTotalPotential = computed<number | null>(() => {
  const h = numOrNull(props.property?.heatingCostPotential)
  const w = numOrNull(props.property?.hotWaterCostPotential)
  const l = numOrNull(props.property?.lightingCostPotential)
  if (h == null && w == null && l == null) return null
  return (h ?? 0) + (w ?? 0) + (l ?? 0)
})

const epcCurrentSap = computed(() => realEpcScore.value ?? props.score)
const epcPotentialSap = computed(
  () =>
    realEpcScorePotential.value ??
    Math.min(100, Math.max(props.score + 18, 75)),
)
const epcPotentialLetter = computed(() => {
  if (realEpcRatingPotential.value) return realEpcRatingPotential.value
  const s = epcPotentialSap.value
  if (s >= 92) return 'A'
  if (s >= 81) return 'B'
  if (s >= 69) return 'C'
  if (s >= 55) return 'D'
  if (s >= 39) return 'E'
  if (s >= 21) return 'F'
  return 'G'
})

// Real annual saving = current total - EPC potential total when available.
const potentialSaving = computed(() => {
  if (realEnergyTotalPotential.value != null) {
    return Math.max(
      0,
      Math.round(props.estimatedAnnualCost - realEnergyTotalPotential.value),
    )
  }
  const factor = (epcPotentialSap.value - epcCurrentSap.value) * 0.014
  return Math.max(100, Math.round(props.estimatedAnnualCost * factor))
})

// Cost breakdown in £/year. Prefer the real EPC fields, otherwise split the
// hero total using a typical UK domestic energy mix (BEIS ECUK 2023):
// ~63% heating, ~22% hot water, ~15% lighting. The three cells therefore
// sum to the hero "Estimated annual running cost" — no duplication.
const HEATING_SHARE = 0.63
const HOT_WATER_SHARE = 0.22
const LIGHTING_SHARE = 0.15

const heatingCost = computed(() => {
  if (realHeatingCost.value != null && realHeatingCost.value > 0) {
    return Math.round(realHeatingCost.value)
  }
  return Math.round(props.estimatedAnnualCost * HEATING_SHARE)
})
const hotWaterCost = computed(() => {
  if (realHotWaterCost.value != null && realHotWaterCost.value > 0) {
    return Math.round(realHotWaterCost.value)
  }
  return Math.round(props.estimatedAnnualCost * HOT_WATER_SHARE)
})
const lightingCost = computed(() => {
  if (realLightingCost.value != null && realLightingCost.value > 0) {
    return Math.round(realLightingCost.value)
  }
  return Math.round(props.estimatedAnnualCost * LIGHTING_SHARE)
})

const co2Now = computed(() => {
  if (realCo2Current.value != null && realCo2Current.value > 0) {
    return Math.round(realCo2Current.value * 10) / 10
  }
  if (props.epcRating === 'A') return 1.8
  if (props.epcRating === 'B') return 2.6
  if (props.epcRating === 'C') return 3.4
  if (props.epcRating === 'D') return 4.6
  if (props.epcRating === 'E') return 6.4
  if (props.epcRating === 'F') return 8.2
  return 10.5
})
const co2Potential = computed(() => {
  if (realCo2Potential.value != null && realCo2Potential.value > 0) {
    return Math.round(realCo2Potential.value * 10) / 10
  }
  return Math.max(1.4, +(co2Now.value * 0.53).toFixed(1))
})
const co2ReductionPct = computed(() =>
  co2Now.value > 0
    ? +(((co2Now.value - co2Potential.value) / co2Now.value) * 100).toFixed(1)
    : 0,
)

/** Coerce any numeric-looking field to number, else null. Prisma decimal /
 *  string columns serialise as strings over JSON in some setups. */
function numOrNull(v: any): number | null {
  if (v == null || v === '') return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

const epcColor = computed(() => {
  const map: Record<string, string> = {
    A: '#00B050',
    B: '#33B800',
    C: '#92D050',
    D: '#FFD700',
    E: '#FF9933',
    F: '#FF6600',
    G: '#E64A19',
  }
  return map[(props.epcRating || '').toUpperCase()] || '#9c98ad'
})

const gaugeColor = computed(() => {
  if (props.score >= 75) return '#00514d'
  if (props.score >= 60) return '#2EAB55'
  if (props.score >= 40) return '#E6A23C'
  return '#C73E36'
})
const scoreTone = computed(() => {
  if (props.score >= 75) return 'high'
  if (props.score >= 50) return 'mid'
  return 'low'
})
const scoreBand = computed(() => {
  if (props.state === 'published') return 'Room to improve'
  if (props.score >= 80) return 'Highly efficient'
  if (props.score >= 65) return 'Above average'
  if (props.score >= 50) return 'Average'
  if (props.score >= 35) return 'Below average'
  return 'Plenty of opportunities'
})
const scoreExplainer = computed(() => {
  if (props.state === 'published')
    return 'Verified by the owner. Scores above 70 unlock the full Property Passport.'
  if (props.score >= 80)
    return 'In the <b>top 20% of UK homes</b>. Strong insulation and modern systems keep running costs well below average.'
  if (props.score >= 60)
    return 'Better than most UK homes. A few targeted upgrades could push this into the top tier.'
  if (props.score >= 40)
    return 'Plenty of room to improve. Targeted upgrades could meaningfully cut your bills.'
  return 'This puts the property in the <b>bottom 15%</b> for energy efficiency. Significant room to improve — and to save.'
})
const dataNote = computed(() => {
  if (props.state === 'published') return null
  if (props.state === 'inProgress')
    return 'Verified Passport not yet published — refining as the owner adds data.'
  if (props.epcYear)
    return `Based on a <b>${props.epcYear} EPC</b>. The real score may be higher if improvements have been made since.`
  return 'Based on public EPC data. The real score may be higher if improvements have been made since the EPC was lodged.'
})

// Real "today" search count from PropertySearchLog (via /search-stats).
// Falls back to a per-property pseudo-random when stats haven't loaded yet.
const todaySearches = computed<number>(() => {
  const t = props.searchStats?.today
  if (typeof t === 'number' && t > 0) return t
  return 0
})
const monthSearches = computed<number>(() => {
  const m = props.searchStats?.thisMonth
  if (typeof m === 'number' && m > 0) return m
  return 0
})

function formatNum(n: number): string {
  return new Intl.NumberFormat('en-GB').format(Math.round(n))
}
</script>

<style scoped>
.rd-page {
  background: #fafafa;
  /* No horizontal padding here — each card sets its own 22px side margin
     to match the prototype's per-card spacing rhythm. */
  padding: 4px 0 0;
}

/* On mobile the shell/columns are transparent passthroughs, so the cards keep
   their original 22px side margins and single-column stacking — no visual
   change. On wider screens the shell becomes a centered two-column dashboard. */
@media (min-width: 900px) {
  .rd-page {
    background: transparent;
    padding: 14px 0 0;
  }
  .rd-shell {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 24px;
    display: grid;
    grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
    grid-auto-rows: min-content;
    gap: 20px 24px;
    align-items: start;
    /* Balanced premium dashboard — tall cards paired with tall, the EPC drawer
       and street/intent run full-width as bands so no column trails long. */
    grid-template-areas:
      'addr    score'
      'cost    brk'
      'pillars street'
      'epc     epc'
      'intent  intent';
  }
  /* Promote each column wrapper's children into the shell grid so every card
     can be placed individually via grid-area (no template restructuring). */
  .rd-shell .rd-col {
    display: contents;
  }
  .rd-shell .rd-addr-card {
    grid-area: addr;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .rd-shell .rd-score-card {
    grid-area: score;
  }
  .rd-shell .rd-overpay {
    grid-area: cost;
  }
  .rd-shell .rd-breakdown {
    grid-area: brk;
  }
  .rd-shell .rd-pillars-card {
    grid-area: pillars;
  }
  .rd-shell .rd-epcfull-card {
    grid-area: epc;
  }
  .rd-shell .rd-street-card {
    grid-area: street;
  }
  .rd-shell .rd-intent {
    grid-area: intent;
  }
  /* Grid gap handles all spacing now — drop the per-card side/bottom margins. */
  .rd-shell .rd-addr-card,
  .rd-shell .rd-score-card,
  .rd-shell .rd-overpay,
  .rd-shell .rd-breakdown,
  .rd-shell .rd-pillars-card,
  .rd-shell .rd-epcfull-card,
  .rd-shell .rd-street-card,
  .rd-shell .rd-intent {
    margin: 0;
  }
  /* Intent options fan out across the full-width band on desktop. */
  .rd-shell .rd-intent-opts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 12px;
    align-items: stretch;
  }
  .rd-shell .rd-intent-opt {
    height: 100%;
  }
}

@media (min-width: 1280px) {
  .rd-shell {
    max-width: 1200px;
    gap: 22px 28px;
  }
}

/* ── Amber address card (prototype-exact: margins, pin size, spacing) ── */
.rd-addr-card {
  margin: 16px 22px 12px;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #f0a030 0%, #c67c18 50%, #8b4e0a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -8px rgba(180, 100, 20, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  animation: rd-fadeSlideDown 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rd-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
  z-index: 0;
}
.rd-addr-card > * {
  position: relative;
  z-index: 1;
}
.rd-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.rd-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 6px;
}
.rd-addr-block {
  flex: 1;
  min-width: 0;
}
.rd-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
  min-height: 1.2em;
}
.rd-typewriter-caret {
  display: inline-block;
  margin-left: 1px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  animation: rd-caretBlink 0.85s steps(2, end) infinite;
}
@keyframes rd-caretBlink {
  to {
    opacity: 0;
  }
}
.rd-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}
.rd-addr-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.rd-addr-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.05px;
}
.rd-addr-pill.epc {
  padding-left: 6px;
}
.rd-epc-letter {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.rd-state-unclaimed {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: #7a3a05;
  cursor: pointer;
  font-family: inherit;
}
.rd-state-unclaimed:hover {
  filter: brightness(0.97);
}
.rd-state-progress {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: #7a3a05;
}
.rd-state-published {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: #00514d;
}
.rd-arrow {
  font-size: 13px;
}

.rd-addr-stats {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.rd-stat-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}
.rd-stat-count {
  font-weight: 800;
}
.rd-sep {
  opacity: 0.5;
}
.rd-pulse-dot {
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}
.rd-pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  animation: rd-pulse 1.6s ease-out infinite;
}
.rd-pulse-green {
  background: #6bd4cd;
}
.rd-pulse-green::after {
  border-color: rgba(94, 234, 212, 0.5);
}
.rd-pulse-amber {
  background: #e6a23c;
}
.rd-pulse-amber::after {
  border-color: rgba(251, 191, 36, 0.5);
}
@keyframes rd-pulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* ── Overpay hero ──────────────────────────────────────────── */
/* Overpay hero — prototype-exact vibrant 3-stop teal gradient. */
.rd-overpay {
  background: linear-gradient(140deg, #00b6ae 0%, #00a19a 50%, #00514d 100%);
  color: #fff;
  border-radius: 20px;
  padding: 22px 22px 20px;
  margin: 0 22px 12px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -10px rgba(0, 161, 154, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition:
    transform 0.18s,
    box-shadow 0.18s;
  animation:
    rd-fadeSlideUp 0.45s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both,
    rd-overpayPulse 2.2s 1.2s ease-in-out 2;
}
.rd-overpay:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 40px -10px rgba(0, 161, 154, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
/* Decorative blob in top-right (prototype-exact) */
.rd-overpay::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.16) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.rd-overpay > * {
  position: relative;
  z-index: 1;
}
.rd-overpay-eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.rd-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6bd4cd;
  box-shadow: 0 0 0 3px rgba(107, 212, 205, 0.25);
}
.rd-overpay-num {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -1.6px;
  line-height: 1;
  margin-bottom: 4px;
  font-feature-settings: 'tnum';
}
.rd-overpay-num .rd-unit {
  font-size: 22px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: -0.5px;
  margin-left: 2px;
}
.rd-overpay-sub {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin-top: 8px;
}
/* CTA buttons (prototype-exact): white "running costs" + translucent
   "street comparison". Both: emoji left, 2-line text center-grows, arrow right. */
.rd-cta-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 14px;
  padding: 16px 18px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.12s,
    box-shadow 0.15s,
    background 0.15s;
}
.rd-cta-btn--primary {
  background: #fff;
  border: none;
  color: #007e78;
  margin-top: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.rd-cta-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.18);
}
.rd-cta-btn--ghost {
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  margin-top: 10px;
}
.rd-cta-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.22);
}
.rd-cta-btn:active {
  transform: scale(0.99);
}
.rd-cta-emoji {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}
.rd-cta-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.rd-cta-label {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.1px;
  line-height: 1.2;
}
.rd-cta-sub {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}
.rd-cta-btn--primary .rd-cta-sub {
  color: #7a9e9b;
}
.rd-cta-btn--ghost .rd-cta-sub {
  color: rgba(255, 255, 255, 0.65);
}
.rd-cta-arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.5;
  transition: transform 0.2s;
}
.rd-cta-btn--ghost .rd-cta-arrow {
  opacity: 0.6;
}
.rd-cta-btn:hover .rd-cta-arrow {
  transform: translateX(2px);
}

/* ── HomeScore card (prototype-exact: 2px teal border, soft teal gradient) ── */
.rd-score-card {
  background: #fff;
  border: 2px solid #00a19a;
  border-radius: 18px;
  padding: 22px 18px 18px;
  margin: 0 22px 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.1);
  transition: all 0.18s;
  animation:
    rd-fadeSlideUp 0.45s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both,
    rd-borderGlow 1.8s 1s ease-in-out 1;
}
.rd-score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 161, 154, 0.16);
}
/* All score tones share the teal border + soft teal-paler gradient. */
.rd-score-card.high,
.rd-score-card.mid,
.rd-score-card.low {
  background: linear-gradient(180deg, #f2faf8 0%, #fff 60%);
  border-color: #00a19a;
}
.rd-score-card .gn-big {
  color: #007e78;
}

.rd-score-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
/* "HOMESCORE" eyebrow — uppercase, teal-dark, with a green rounded
   gradient square to the left of the text (prototype-exact). */
.rd-score-eyebrow .left {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #007e78;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.rd-score-eyebrow .left::before {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: linear-gradient(135deg, #00b6ae, #007e78);
  display: inline-block;
  flex-shrink: 0;
}
.rd-score-eyebrow .right {
  font-size: 11px;
  font-weight: 700;
  color: #6b6783;
  background: #fafafa;
  border: 1px solid #ececef;
  padding: 3px 8px;
  border-radius: 999px;
}
.rd-score-eyebrow .right--verified {
  color: #007e78;
  background: #f2faf8;
  border-color: #e5f4f2;
}
.rd-score-gauge-wrap {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 14px;
}
.rd-gauge {
  width: 140px;
  height: 140px;
  position: relative;
  flex-shrink: 0;
}
.rd-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.rd-gauge .g-bg {
  stroke: #ececef;
}
.rd-g-num {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.rd-g-num .gn-big {
  font-size: 50px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -1.6px;
  line-height: 1;
  font-feature-settings: 'tnum';
}
.rd-g-num .gn-small {
  font-size: 9px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-top: 4px;
}
.rd-score-summary {
  flex: 1;
  min-width: 0;
}
.rd-score-band {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}
/* Score-band tone — mirrors prototype's `.score-card.low/.mid/.high .score-band`. */
.rd-score-card.low .rd-score-band {
  color: #c73e36;
}
.rd-score-card.mid .rd-score-band {
  color: #e6a23c;
}
.rd-score-card.high .rd-score-band {
  color: #007e78;
}
.rd-score-explainer {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  margin-top: 5px;
  line-height: 1.45;
}
.rd-score-explainer :deep(b) {
  color: #231d45;
  font-weight: 800;
}
.rd-data-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.45;
}
.rd-data-note svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #9c98ad;
  margin-top: 1px;
}
.rd-data-note :deep(b) {
  color: #231d45;
  font-weight: 800;
}

/* ── EPC / breakdown card (prototype-exact: 2px amber border + gradient) ── */
.rd-breakdown {
  background: linear-gradient(180deg, rgba(251, 239, 217, 0.6) 0%, #fff 50%);
  border: 2px solid #e6a23c;
  border-radius: 16px;
  padding: 18px;
  margin: 0 22px 12px;
  box-shadow: 0 4px 16px rgba(230, 162, 60, 0.1);
  transition: all 0.18s;
  animation: rd-fadeSlideUp 0.45s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Score pillar breakdown ─────────────────────────────────────────── */
.rd-pillars-card {
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  padding: 18px;
  margin: 0 22px 12px;
  box-shadow: 0 4px 16px rgba(24, 52, 88, 0.06);
  animation: rd-fadeSlideUp 0.45s 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rd-pillars-head {
  margin-bottom: 14px;
}
.rd-pillars-title {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.01em;
}
.rd-pillars-sub {
  font-size: 11px;
  font-weight: 700;
  color: #9c98ad;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-top: 3px;
}
.rd-pillars-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}
.rd-pillar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rd-pillar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.rd-pillar-name {
  width: 74px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: #231d45;
}
.rd-pillar-track {
  flex: 1;
  height: 8px;
  background: #f2f2f7;
  border-radius: 100px;
  overflow: hidden;
}
.rd-pillar-bar {
  height: 100%;
  border-radius: 100px;
  min-width: 4px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}
.rd-pillar-score {
  flex-shrink: 0;
  min-width: 46px;
  text-align: right;
  font-size: 13px;
  font-weight: 800;
  color: #231d45;
  font-feature-settings: 'tnum';
}
.rd-pillar-max {
  font-weight: 500;
  color: #aeaeb2;
}

/* ── Full EPC breakdown accordion ───────────────────────────────────── */
.rd-epcfull-card {
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  margin: 0 22px 12px;
  box-shadow: 0 4px 16px rgba(24, 52, 88, 0.06);
  overflow: hidden;
  animation: rd-fadeSlideUp 0.45s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rd-epcfull-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}
.rd-epcfull-ic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #eafaf6;
  font-size: 16px;
  flex-shrink: 0;
}
.rd-epcfull-head-text {
  flex: 1;
  min-width: 0;
}
.rd-epcfull-title {
  display: block;
  font-size: 14.5px;
  font-weight: 800;
  color: #231d45;
}
.rd-epcfull-sub {
  display: block;
  font-size: 12px;
  color: #9c98ad;
  font-weight: 500;
  margin-top: 2px;
}
.rd-epcfull-chev {
  width: 18px;
  height: 18px;
  color: #9c98ad;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.rd-epcfull-chev.open {
  transform: rotate(180deg);
}
.rd-epcfull-body {
  padding: 0 18px 16px;
  border-top: 1px solid #f3f4f7;
}
.rd-epcfull-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f7;
  margin-bottom: 8px;
}
.rd-epcfull-grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.rd-epcfull-grade-meta {
  font-size: 10.5px;
  font-weight: 600;
  color: #6b6783;
}
.rd-epcfull-arrow {
  color: #c4c2d0;
  font-weight: 800;
}
.rd-epcfull-saving {
  margin-left: auto;
  text-align: right;
}
.rd-epcfull-saving-num {
  font-size: 18px;
  font-weight: 900;
  color: #00857f;
  letter-spacing: -0.02em;
}
.rd-epcfull-saving-num span {
  font-size: 12px;
  font-weight: 700;
}
.rd-epcfull-saving-meta {
  font-size: 10.5px;
  font-weight: 600;
  color: #9c98ad;
}
.rd-epcfull-lines {
  display: flex;
  flex-direction: column;
}
.rd-epcfull-line {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 0;
  border-bottom: 1px solid #f5f5f7;
}
.rd-epcfull-line:last-child {
  border-bottom: none;
}
.rd-epcfull-line-ic {
  width: 26px;
  text-align: center;
  font-size: 15px;
  flex-shrink: 0;
}
.rd-epcfull-line-body {
  flex: 1;
  min-width: 0;
}
.rd-epcfull-line-label {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: #231d45;
}
.rd-epcfull-line-sub {
  display: block;
  font-size: 11px;
  color: #9c98ad;
  margin-top: 1px;
}
.rd-epcfull-line-rating {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1.5px solid;
  background: #fff;
  white-space: nowrap;
}

/* ── Your street card ───────────────────────────────────────────────── */
.rd-street-card {
  margin: 0 22px 12px;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, #231d45 0%, #2f2769 100%);
  color: #fff;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.24);
  animation: rd-fadeSlideUp 0.45s 0.46s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rd-street-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a9a3d6;
  margin-bottom: 12px;
}
.rd-street-rankrow {
  display: flex;
  align-items: center;
  gap: 14px;
}
.rd-street-rank {
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  color: #fff;
}
.rd-street-of {
  font-size: 14px;
  font-weight: 700;
  color: #efeefb;
}
.rd-street-delta {
  font-size: 12.5px;
  font-weight: 600;
  margin-top: 2px;
}
.rd-street-delta.good {
  color: #6ee7c8;
}
.rd-street-delta.bad {
  color: #ff9d8a;
}
.rd-street-houses {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin: 16px 0 6px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.16);
  overflow-x: auto;
  scrollbar-width: none;
}
.rd-street-houses::-webkit-scrollbar {
  display: none;
}
.rd-street-house {
  flex: 1 0 auto;
  min-width: 22px;
  display: grid;
  place-items: center;
  opacity: 0.9;
}
.rd-street-house svg {
  width: 22px;
  height: 22px;
}
.rd-street-house.low {
  color: #4fd1b0;
}
.rd-street-house.mid {
  color: #e6b45a;
}
.rd-street-house.high {
  color: #f2846f;
}
.rd-street-house.you {
  transform: translateY(-4px) scale(1.18);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
  opacity: 1;
}
.rd-street-toggle {
  width: 100%;
  margin-top: 12px;
  padding: 13px;
  border: 0;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.rd-street-toggle:hover {
  background: rgba(255, 255, 255, 0.18);
}
.rd-street-toggle-arrow {
  transition: transform 0.2s ease;
  font-size: 18px;
}
.rd-street-toggle-arrow.open {
  transform: rotate(90deg);
}
.rd-street-detail {
  margin-top: 14px;
}
.rd-street-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rd-street-li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}
.rd-street-li.you {
  background: rgba(0, 161, 154, 0.22);
  box-shadow: inset 0 0 0 1px rgba(110, 231, 200, 0.5);
}
.rd-street-li-rank {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  font-size: 11px;
  font-weight: 800;
}
.rd-street-li-body {
  flex: 1;
  min-width: 0;
}
.rd-street-li-addr {
  display: block;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rd-street-li-meta {
  display: block;
  font-size: 11px;
  color: #b7b2dd;
  margin-top: 1px;
}
.rd-street-li-cost {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 900;
  font-feature-settings: 'tnum';
}
.rd-street-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 2px 0;
  font-size: 11px;
  color: #cfcbe9;
  font-weight: 600;
}
.rd-street-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.rd-street-legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.rd-street-pathway {
  margin-top: 14px;
  padding: 14px;
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.16);
  border: 1px solid rgba(110, 231, 200, 0.3);
}
.rd-street-pathway-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6ee7c8;
  margin-bottom: 8px;
}
.rd-street-pathway-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rd-street-pathway-cost {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.02em;
}
.rd-street-pathway-cost span {
  font-size: 12px;
  font-weight: 700;
  color: #cfcbe9;
}
.rd-street-pathway-meta {
  flex: 1;
  font-size: 11.5px;
  font-weight: 600;
  color: #cfcbe9;
  line-height: 1.3;
}
.rd-street-pathway-save {
  font-size: 14px;
  font-weight: 900;
  color: #6ee7c8;
  white-space: nowrap;
}
.rd-breakdown:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(230, 162, 60, 0.16);
}
.rd-epc-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f5f5f7;
  margin-bottom: 14px;
}
.rd-epc-col {
  flex: 1;
}
.rd-epc-label {
  font-size: 9px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.rd-epc-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rd-epc-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rd-epc-letter-big {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  padding: 3px 10px;
  line-height: 1;
}
.rd-epc-text {
  font-size: 13px;
  font-weight: 600;
  color: #6b6783;
}
.rd-epc-text--potential {
  color: #007e78;
  font-weight: 700;
}
.rd-epc-saving {
  text-align: right;
  flex-shrink: 0;
}
.rd-epc-saving-num {
  font-size: 22px;
  font-weight: 800;
  color: #007e78;
  letter-spacing: -0.5px;
}
.rd-epc-saving-meta {
  font-size: 11px;
  color: #6b6783;
}

.rd-energy-row {
  display: flex;
  border: 1.5px solid #f5f5f7;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 14px;
}
.rd-energy-cell {
  flex: 1;
  padding: 11px 12px;
}
.rd-energy-cell + .rd-energy-cell {
  border-left: 1px solid #f5f5f7;
}
.rd-energy-eyebrow {
  font-size: 9px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.rd-energy-num {
  font-size: 17px;
  font-weight: 800;
}
.rd-energy-num.red {
  color: #c73e36;
}
.rd-energy-num.navy {
  color: #231d45;
}
.rd-energy-meta {
  font-size: 9px;
  color: #6b6783;
  margin-top: 1px;
}

.rd-env {
  background: #f2faf8;
  border: 1.5px solid #e5f4f2;
  border-radius: 12px;
  padding: 13px 14px;
}
.rd-env-eyebrow {
  font-size: 9px;
  font-weight: 800;
  color: #007e78;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.rd-env-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}
.rd-env-num {
  font-size: 24px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.5px;
  line-height: 1;
}
.rd-env-num--teal {
  color: #007e78;
}
.rd-env-meta {
  font-size: 11px;
  color: #6b6783;
  margin-top: 2px;
}
.rd-env-meta--teal {
  color: #007e78;
  font-weight: 700;
}
.rd-env-arrow {
  font-size: 14px;
  color: #9c98ad;
  align-self: center;
}
.rd-env-bar {
  margin-top: 10px;
  height: 6px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 100px;
  overflow: hidden;
}
.rd-env-fill {
  height: 100%;
  background: #00a19a;
  border-radius: 100px;
  transition: width 0.5s ease;
}
.rd-env-foot {
  font-size: 11px;
  color: #007e78;
  margin-top: 5px;
  font-weight: 700;
}

/* ── Intent picker ─────────────────────────────────────────── */
/* Intent card — 2px navy border, soft navy-tinted gradient (prototype-exact). */
.rd-intent {
  background:
    radial-gradient(
      circle at bottom right,
      rgba(35, 29, 69, 0.06) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, rgba(35, 29, 69, 0.05) 0%, #fff 70%);
  border: 2px solid #231d45;
  border-radius: 16px;
  padding: 18px;
  margin: 0 22px 12px;
  box-shadow: 0 4px 16px rgba(35, 29, 69, 0.1);
  transition: all 0.18s;
  animation: rd-fadeSlideUp 0.45s 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.rd-intent:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.16);
}

/* ── Prototype-exact cascade animations ──────────────────────── */
@keyframes rd-fadeSlideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes rd-fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes rd-overpayPulse {
  0% {
    box-shadow:
      0 12px 32px -10px rgba(0, 161, 154, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
  50% {
    box-shadow:
      0 16px 48px -8px rgba(0, 161, 154, 0.65),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
  100% {
    box-shadow:
      0 12px 32px -10px rgba(0, 161, 154, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }
}
@keyframes rd-borderGlow {
  0% {
    box-shadow: 0 4px 12px rgba(35, 29, 69, 0.04);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(0, 161, 154, 0.25),
      0 8px 24px rgba(0, 161, 154, 0.15);
  }
  100% {
    box-shadow: 0 4px 12px rgba(35, 29, 69, 0.04);
  }
}
/* Eyebrow: centered, uppercase, letter-spaced (prototype-exact). */
.rd-intent-eyebrow {
  font-size: 12px;
  font-weight: 800;
  color: #6b6783;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 14px;
}
.rd-intent-opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rd-intent-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  width: 100%;
}
.rd-intent-opt:hover {
  transform: translateY(-1px);
}
.rd-intent-opt.primary {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
  box-shadow: 0 3px 10px rgba(0, 161, 154, 0.3);
}
.rd-intent-opt.primary:hover {
  background: #00b6ae;
  border-color: #00b6ae;
}
.rd-intent-opt.outline {
  border-color: #ececef;
  color: #231d45;
}
.rd-intent-opt.outline:hover {
  border-color: #6e6985;
}
/* Icon now sits in a rounded 36x36 tile, prototype-exact. */
.rd-intent-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1;
}
.rd-intent-opt.outline .rd-intent-icon {
  background: #f2faf8;
  color: #007e78;
}
.rd-intent-body {
  flex: 1;
  min-width: 0;
}
.rd-intent-title {
  display: block;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  margin-bottom: 1px;
}
.rd-intent-sub {
  display: block;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.05px;
  line-height: 1.35;
  opacity: 0.85;
}
.rd-intent-opt.primary .rd-intent-title {
  color: #fff;
}
.rd-intent-opt.primary .rd-intent-sub {
  color: rgba(255, 255, 255, 0.82);
}
.rd-intent-opt.outline .rd-intent-title {
  color: #231d45;
}
.rd-intent-opt.outline .rd-intent-sub {
  color: #6b6783;
}
.rd-intent-chev {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.6;
  flex-shrink: 0;
}
.rd-watchers {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #6b6783;
}
.rd-watchers .rd-pulse-dot {
  width: 6px;
  height: 6px;
}
</style>
