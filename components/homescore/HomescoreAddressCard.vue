<template>
  <!-- Compact navy hero: pin + address, EPC chip line, and the illustrated
       house anchored on the right. The HomeScore tile the amber version
       carried was dropped — the gauge directly below this card already
       shows the score. Used on V6ScoreView for both the EPC-present and
       no-EPC states. -->
  <div class="hsc-card">
    <img
      class="hsc-house"
      src="/homescore-icon/homeScoreCard.png"
      alt=""
      loading="lazy"
    />

    <div class="hsc-head">
      <span class="hsc-ring" />
      <div>
        <div class="hsc-addr">{{ address || 'Your property' }}</div>
        <div class="hsc-meta">{{ metaLine }}</div>
      </div>
    </div>

    <!-- EPC chip line — badge, band, then the plain-English hook. -->
    <div class="hsc-epc-row">
      <span
        class="hsc-epc-badge"
        :class="{ 'hsc-epc-badge--none': isNoEpc }"
        :style="!isNoEpc ? { background: epcColor(epcRating) } : {}"
      >{{ isNoEpc ? 'None' : (epcRating || '—') }}</span>
      <span class="hsc-epc-txt">
        <template v-if="!isNoEpc">
          EPC rating {{ epcRating }}
          <span class="hsc-epc-sep">|</span>
        </template>
        {{ epcHook }}
      </span>
    </div>

    <!-- Social proof: searches today -->
    <div class="hsc-viewers">
      <span class="hsc-idstack" aria-hidden="true">
        <span class="hsc-idc" style="background: #9fe1cb">
          <span
            style="
              width: 8px;
              height: 8px;
              background: #0f6e56;
              border-radius: 2px;
              transform: rotate(45deg);
            "
          />
        </span>
        <span class="hsc-idc" style="background: #fac775">
          <span
            style="
              width: 9px;
              height: 9px;
              border: 2.5px solid #633806;
              border-radius: 50%;
            "
          />
        </span>
      </span>
      <div class="hsc-vtxt">
        <b>{{ searchesTodayDisplay }}</b>
        <span>&nbsp;checked this HomeScore today</span>
      </div>
    </div>

    <!-- Social proof: live interest (published) or watchers (others) -->
    <div
      v-if="passportState === 'published'"
      class="hsc-viewers hsc-viewers--live"
    >
      <span class="hsc-live-bars" aria-hidden="true">
        <span class="hsc-live-bar" />
        <span class="hsc-live-bar" />
        <span class="hsc-live-bar" />
      </span>
      <div class="hsc-vtxt">
        <b>Live interest.</b>
        <span>&nbsp;People are tracking this passport.</span>
      </div>
    </div>
    <div v-else class="hsc-viewers">
      <!-- Binoculars-style watching glyph. The earlier eye-with-pupil
           icon was too close to the "show password" eye used in form
           fields; this one reads as "spotting / monitoring" — much
           closer to the actual meaning of "watching this property". -->
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,.92)"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        style="flex: none"
      >
        <circle cx="6" cy="15" r="4" />
        <circle cx="18" cy="15" r="4" />
        <path d="M10 15h4" />
        <path d="M4.5 11l1.5 -5h2l1 5" />
        <path d="M19.5 11l-1.5 -5h-2l-1 5" />
      </svg>
      <div class="hsc-vtxt">
        <b>{{ watchersDisplay }}</b>
        <span>&nbsp;{{ watchersCount === 1 ? 'is' : 'are' }} watching this property</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    address?: string | null
    postcode?: string | null
    propertyType?: string | null
    sqm?: number | null
    epcRating?: string | null
    homeScore?: number | null
    searchesToday?: number
    watchersCount?: number
    passportState?: 'unclaimed' | 'inProgress' | 'published'
  }>(),
  {
    address: null,
    postcode: null,
    propertyType: null,
    sqm: null,
    epcRating: null,
    homeScore: 0,
    searchesToday: 0,
    watchersCount: 0,
    passportState: 'unclaimed',
  },
)

const metaLine = computed(() => {
  const parts: string[] = []
  if (props.postcode) parts.push(props.postcode)
  if (props.propertyType) parts.push(props.propertyType)
  if (props.sqm) parts.push(`${props.sqm}m²`)
  return parts.join(' · ')
})

function epcColor(rating?: string | null): string {
  switch ((rating || '').toUpperCase()) {
    case 'A': return '#1F7A34'
    case 'B': return '#4D7C1F'
    case 'C': return '#7DA82C'
    case 'D': return '#E0B61D'
    case 'E': return '#E2902A'
    case 'F': return '#D85A28'
    case 'G': return '#B6271E'
    default:  return '#7DA82C'
  }
}
// No-EPC state — when the property has no certificate on file the badge
// reads "None" and the hook says so, rather than implying a band. Both
// flags must be null/zero because a real value in either would mean we
// DO have a HomeScore to display.
const isNoEpc = computed(
  () => !props.epcRating && (props.homeScore == null || props.homeScore === 0),
)

// Hook copy — the plain-English half of the EPC chip line. Adapts to
// the actual band.
const epcHook = computed(() => {
  if (isNoEpc.value) return 'No EPC on record'
  const r = (props.epcRating || '').toUpperCase()
  if (r === 'A' || r === 'B') return 'Top-band efficiency'
  if (r === 'C') return 'Lower running costs'
  if (r === 'D') return 'Room to improve'
  if (r) return 'High running costs'
  return 'Energy rating'
})
const searchesTodayDisplay = computed(() => {
  const n = props.searchesToday ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})
const watchersDisplay = computed(() => {
  const n = props.watchersCount ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})
</script>

<style scoped>
/* Navy hero with the illustrated house anchored right. Text keeps clear
   of the artwork via the padding-right on the card's content. */
.hsc-card {
  position: relative;
  width: auto;
  max-width: 100%;
  background:
    radial-gradient(circle at 88% 40%, rgba(0, 200, 185, 0.22), transparent 55%),
    linear-gradient(135deg, #2b2450, #221c41);
  border-radius: 16px;
  padding: 16px 18px;
  color: #fff;
  overflow: hidden;
  box-shadow: 0 10px 26px rgba(23, 18, 48, 0.22);
  font-family:
    'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
}
.hsc-house {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 96px;
  height: 96px;
  object-fit: contain;
  pointer-events: none;
}

.hsc-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  /* Room for the house illustration. */
  padding-right: 96px;
}

/* EPC chip line — badge + "EPC rating C | Lower running costs". */
.hsc-epc-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 14px;
  padding: 8px 11px;
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.22);
  border-radius: 12px;
}
.hsc-epc-txt {
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
}
.hsc-epc-sep {
  color: rgba(255, 255, 255, 0.45);
  margin: 0 3px;
}
.hsc-ring {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2.5px solid rgba(255, 255, 255, 0.85);
  margin-top: 7px;
  flex: none;
}
.hsc-addr {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.15;
  color: #fff;
  letter-spacing: -0.2px;
}
.hsc-meta {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
  margin-top: 3px;
}

.hsc-epc-badge {
  background: #4d7c1f;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* No-EPC variant — reads as "empty state" rather than a low band. */
.hsc-epc-badge--none {
  background: rgba(255, 255, 255, 0.28);
  color: #fff;
  width: auto;
  padding: 2px 10px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 8px;
}
/* Viewer rows (checked / watching / live interest) */
.hsc-viewers {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 10px 12px;
  margin-top: 10px;
}
.hsc-idstack {
  display: inline-flex;
  flex: none;
}
.hsc-idc {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #262046;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: none;
}
.hsc-idc:nth-child(n + 2) { margin-left: -8px; }
.hsc-vtxt {
  font-size: 12.5px;
  line-height: 1.35;
}
.hsc-vtxt b { font-weight: 700; }
.hsc-vtxt span { color: rgba(255, 255, 255, 0.85); }

/* Animated signal-bars variant — shown for published passports. */
.hsc-viewers--live { gap: 10px; }
.hsc-live-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
  flex: none;
}
.hsc-live-bar {
  width: 3px;
  background: #fff;
  border-radius: 1.5px;
  animation: hscLiveBars 1.2s ease-in-out infinite;
  transform-origin: bottom;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
}
.hsc-live-bar:nth-child(1) { height: 5px;  animation-delay: 0s; }
.hsc-live-bar:nth-child(2) { height: 9px;  animation-delay: 0.15s; }
.hsc-live-bar:nth-child(3) { height: 13px; animation-delay: 0.3s; }
@keyframes hscLiveBars {
  0%, 100% { transform: scaleY(0.55); opacity: 0.6; }
  50%      { transform: scaleY(1);    opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .hsc-live-bar { animation: none; transform: scaleY(1); opacity: 0.95; }
}
</style>
