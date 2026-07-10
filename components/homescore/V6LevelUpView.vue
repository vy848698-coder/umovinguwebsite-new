<template>
  <div class="hs-v6-levelup" :class="{ 'lu-has-nav': hideBack }">
    <!-- Minimal back-only mini-header (no title strip, no bell).
         Hidden when the page provides its own top nav (hideBack). -->
    <div v-if="!hideBack" class="lu-mini-header">
      <button
        class="lu-back"
        type="button"
        @click="$emit('back')"
        aria-label="Back"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>

    <div class="lu-shell">
      <!-- Top row: level-up hero (left) + what-happens-next (right) -->
      <div class="lu-top-grid">
        <!-- Level up hero -->
        <div class="levelup-hero anim-1 level-up">
          <div class="levelup-eyebrow"><Icon name="i-lucide-party-popper" /> Level up · Quiz complete</div>
          <div class="levelup-title">You levelled up your home.</div>
          <div class="levelup-sub">
            Your refined HomeScore reflects what's been done since the EPC. More
            accurate. Higher confidence.
          </div>
          <div class="levelup-row">
            <div class="levelup-from">
              <div class="levelup-from-num">{{ fromScore }}</div>
              <div class="levelup-from-label">Was · Level {{ fromLevel }}</div>
            </div>
            <div class="levelup-arrow">
              <Icon name="i-lucide-arrow-right" />
            </div>
            <div class="levelup-to">
              <div class="levelup-to-num">{{ animatedToScore }}</div>
              <div class="levelup-to-label">Now · Level {{ toLevel }}</div>
            </div>
          </div>
          <div class="levelup-delta">
            <Icon name="i-lucide-trending-up" /> {{ deltaLabel }}
          </div>
        </div>

        <!-- "What happens next" explainer — two paths (v6-3) -->
        <div class="boost-explain anim-2">
          <div class="boost-explain-steps">
            <div class="boost-explain-step">
              <div class="boost-explain-num">1</div>
              <div class="boost-explain-icon path"><Icon name="i-lucide-route" /></div>
              <div class="boost-explain-text">
                <b>Follow the pathway</b> — take recommended steps to keep
                climbing your HomeScore.
              </div>
            </div>
            <div class="boost-explain-hr" />
            <div class="boost-explain-step">
              <div class="boost-explain-num">2</div>
              <div class="boost-explain-icon boost"><Icon name="i-lucide-zap" /></div>
              <div class="boost-explain-text">
                <b>Boost your score</b> — add docs and book pros to grow your
                Passport.
              </div>
            </div>
          </div>
          <div class="boost-explain-foot">
            Pathway lifts your <b>HomeScore</b> · Boost lifts your
            <b>Move Ready</b> &amp; <b>Passport</b>.
          </div>
        </div>
      </div>

      <!-- Refined stats -->
      <div class="section-h-row">
        <div class="section-h">Your refined stats</div>
        <div class="section-h-sub">{{ toScore }}/100 points</div>
      </div>
      <div class="refined-stats-card">
        <div v-for="s in refinedStats" :key="s.id" class="stat-row gained">
          <div class="stat-icon" :class="s.tone"><Icon :name="s.icon" /></div>
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-bar-wrap">
            <div
              class="stat-bar-fill"
              :class="s.tone"
              :style="{ width: barsAnimated ? s.pct + '%' : '0%' }"
            />
          </div>
          <div class="stat-value">{{ s.value }}/{{ s.max }}</div>
        </div>
      </div>

      <!-- Bottom CTAs (v6-2: primary filled pathway + outlined boost) -->
      <div class="bottom-cta">
        <button
          class="bottom-cta-btn"
          type="button"
          @click="$emit('open-pathway')"
        >
          <Icon name="i-lucide-target" /> See the EPC's pathway
        </button>
        <button
          class="bottom-cta-secondary outlined"
          type="button"
          @click="$emit('open-boost')"
        >
          <Icon name="i-lucide-zap" /> Boost your score
        </button>
      </div>

      <div style="height: 32px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useConfetti } from '~/composables/useConfetti'

interface Props {
  fromScore: number
  toScore: number
  delta: number
  estSavings?: number
  /** Hide the internal back arrow when the host page renders its own nav. */
  hideBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  estSavings: 309,
  hideBack: false,
})

defineEmits<{
  (e: 'back'): void
  (e: 'open-pathway'): void
  (e: 'open-boost'): void
}>()

const { runConfetti } = useConfetti()

function gradeFor(score: number): string {
  if (score >= 92) return 'A'
  if (score >= 81) return 'B'
  if (score >= 69) return 'C'
  if (score >= 55) return 'D'
  if (score >= 39) return 'E'
  if (score >= 21) return 'F'
  return 'G'
}

const fromLevel = computed(() => gradeFor(props.fromScore))
const toLevel = computed(() => gradeFor(props.toScore))

const deltaLabel = computed(() => {
  const sign = props.delta >= 0 ? '+' : ''
  return `${sign}${props.delta} points gained · est. bills ↓ £${props.estSavings}/yr`
})

const animatedToScore = ref(props.fromScore)
const barsAnimated = ref(false)

onMounted(() => {
  // Fire the same confetti burst the onboarding "preferences saved"
  // screen uses — one-shot, tears down its own canvas, respects
  // prefers-reduced-motion. Fires slightly after mount so the level-
  // up hero has finished its own fade-in first.
  setTimeout(() => runConfetti(), 200)

  // Count-up animation for the score
  const start = props.fromScore
  const end = props.toScore
  const duration = 1200
  const startTime = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1)
    const ease = 1 - Math.pow(1 - t, 3)
    animatedToScore.value = Math.round(start + (end - start) * ease)
    if (t < 1) requestAnimationFrame(tick)
    else animatedToScore.value = end
  }
  requestAnimationFrame(tick)

  // Stagger bar fill
  setTimeout(() => {
    barsAnimated.value = true
  }, 250)
})

const refinedStats = [
  {
    id: 'heating',
    icon: 'i-lucide-flame',
    label: 'Heating',
    value: 16,
    max: 20,
    pct: 80,
    tone: 'high',
  },
  {
    id: 'structure',
    icon: 'i-lucide-brick-wall',
    label: 'Structure',
    value: 17,
    max: 25,
    pct: 68,
    tone: 'high',
  },
  {
    id: 'efficiency',
    icon: 'i-lucide-lightbulb',
    label: 'Efficiency',
    value: 6,
    max: 15,
    pct: 40,
    tone: 'mid',
  },
  {
    id: 'electrics',
    icon: 'i-lucide-zap',
    label: 'Electrics',
    value: 10,
    max: 20,
    pct: 50,
    tone: 'mid',
  },
  {
    id: 'plumbing',
    icon: 'i-lucide-droplet',
    label: 'Plumbing',
    value: 13,
    max: 20,
    pct: 65,
    tone: 'mid',
  },
] as const

</script>

<style scoped>
/* Centered desktop shell — matches the page's 1140px nav shell so the
   hero/explainer/stats align under the top nav. */
.lu-shell {
  width: min(1140px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
/* Top row: hero + "what happens next" side-by-side on desktop,
   stacked on mobile. */
.lu-top-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 4px;
}
@media (min-width: 900px) {
  .lu-top-grid {
    grid-template-columns: 1.05fr 0.95fr;
    gap: 20px;
    align-items: stretch;
    margin-top: 8px;
  }
}
.hs-v6-levelup {
  --primary: #231d45;
  --accent: #00a19a;
  --accent-dark: #008a84;
  --accent-light: #00b8b0;
  --accent-pale: #e5f4f2;
  --accent-paler: #f2faf8;
  --bg: #f5f6fa;
  --page: #f3f2ef;
  --card: #ffffff;
  --text: #231d45;
  --text-secondary: #6b7089;
  --text-faint: #a8a9ad;
  --border: #e4e5ed;
  --border-soft: #f0f1f5;
  --error: #e74c5e;
  --error-light: #f08594;
  --warning: #f5a623;
  --gold: #f0b933;
  --shadow-card: 0 2px 8px rgba(35, 29, 69, 0.05);

  position: relative;
  background: var(--page);
  color: var(--text);
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

/* Soften prototype's 800-weights to match SF Pro app scale */
.hs-v6-levelup
  :is(.levelup-title, .levelup-to-num, .levelup-from-num, .stat-value) {
  font-weight: 700;
}
.hs-v6-levelup :is(.levelup-sub, .levelup-from-label, .levelup-to-label) {
  font-weight: 500;
}

/* App header */
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  padding-top: calc(14px + env(safe-area-inset-top));
  background: var(--card);
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 2;
}
.back-btn,
.app-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  transition: all 0.15s;
  flex-shrink: 0;
}
.back-btn:hover,
.app-icon-btn:hover {
  background: var(--accent-paler);
  border-color: var(--accent-pale);
  color: var(--accent-dark);
}
.back-btn svg,
.app-icon-btn svg {
  width: 16px;
  height: 16px;
}
.app-header-info {
  flex: 1;
  min-width: 0;
}
.app-header-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
  line-height: 1.15;
}
.app-header-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 1px;
}

/* Animations */
@keyframes hs-v6-fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes levelGlow {
  0%,
  100% {
    box-shadow: 0 12px 32px -8px rgba(0, 161, 154, 0.3);
  }
  50% {
    box-shadow:
      0 12px 32px -8px rgba(0, 161, 154, 0.3),
      0 0 0 8px rgba(0, 161, 154, 0.15);
  }
}
.anim-1 {
  animation: hs-v6-fadeUp 0.35s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Hero */
.levelup-hero {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 28px 28px 24px;
  background:
    radial-gradient(120% 130% at 100% 0%, rgba(0, 161, 154, 0.14), transparent 55%),
    linear-gradient(160deg, #e6f6f3 0%, #f4fcfa 46%, #ffffff 100%);
  border: 2px solid var(--accent);
  border-radius: 20px;
  box-shadow: 0 12px 32px -8px rgba(0, 161, 154, 0.3);
  overflow: hidden;
}
.levelup-hero.level-up {
  animation:
    hs-v6-fadeUp 0.35s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both,
    levelGlow 1.5s ease-out 3;
}
.levelup-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: var(--accent-dark);
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 100px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  border: 1px solid var(--accent-pale);
  box-shadow: 0 1px 2px rgba(0, 138, 132, 0.06);
  margin-bottom: 12px;
}
.levelup-eyebrow :deep(svg) { width: 13px; height: 13px; }
.levelup-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.8px;
  line-height: 1.1;
  margin-bottom: 6px;
}
.levelup-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 16px;
}
.levelup-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--border-soft);
}
.levelup-from,
.levelup-to {
  text-align: center;
  flex: 1;
}
.levelup-from-num {
  font-size: 42px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: -1.6px;
  line-height: 1;
}
.levelup-from-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-top: 4px;
}
.levelup-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
.levelup-arrow :deep(svg) {
  width: 26px;
  height: 26px;
  stroke-width: 2.4;
}
.levelup-to-num {
  font-size: 52px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: -2px;
  line-height: 1;
}
.levelup-to-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-top: 4px;
}
.levelup-delta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 14px;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid var(--accent-pale);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 800;
  color: var(--accent-dark);
  box-shadow: 0 1px 2px rgba(0, 138, 132, 0.06);
}
.levelup-delta :deep(svg) {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* Section heading */
.section-h-row {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 24px 4px 12px;
}
.section-h {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.section-h-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-dark);
}

/* Refined stat bars */
.refined-stats-card {
  position: relative;
  z-index: 2;
  margin: 0;
  padding: 20px 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 0;
}
.stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg);
  flex-shrink: 0;
}
.stat-icon :deep(svg) { width: 17px; height: 17px; }
/* Tone-tinted icon chips echo the bar colour */
.stat-icon.high {
  color: var(--accent-dark);
  background: var(--accent-paler);
}
.stat-icon.mid {
  color: var(--warning);
  background: #fff6e8;
}
.stat-icon.low {
  color: var(--error);
  background: #fdeef0;
}
.stat-label {
  width: 96px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}
.stat-bar-wrap {
  flex: 1;
  height: 10px;
  background: var(--bg);
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
}
.stat-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.stat-bar-fill.high {
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
}
.stat-bar-fill.mid {
  background: linear-gradient(90deg, var(--warning), var(--gold));
}
.stat-bar-fill.low {
  background: linear-gradient(90deg, var(--error), var(--error-light));
}
.stat-value {
  width: 58px;
  text-align: right;
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  flex-shrink: 0;
}
.stat-row.gained .stat-value {
  color: var(--accent-dark);
}

/* Bottom CTA */
.bottom-cta {
  position: relative;
  z-index: 2;
  padding: 20px 0 4px;
}
.bottom-cta-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: filter 0.15s;
}
.bottom-cta-btn:hover {
  filter: brightness(1.06);
}
.bottom-cta-btn :deep(svg),
.bottom-cta-secondary :deep(svg) { width: 17px; height: 17px; }
.bottom-cta-secondary {
  width: 100%;
  margin-top: 10px;
  padding: 14px;
  background: var(--card);
  color: var(--text);
  border: 1.5px solid var(--border);
  border-radius: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.bottom-cta-secondary:hover {
  border-color: var(--accent-pale);
  background: var(--accent-paler);
  color: var(--accent-dark);
}
/* Outlined variant — transparent background, accent border (v6-2) */
.bottom-cta-secondary.outlined {
  background: transparent;
  border: 1.5px solid var(--accent);
  color: var(--accent-dark);
}
.bottom-cta-secondary.outlined:hover {
  background: var(--accent-paler);
}

/* Mini header (back-only, no title strip, no bell) */
.lu-mini-header {
  position: relative;
  z-index: 2;
  padding: 12px 20px;
  padding-top: calc(12px + env(safe-area-inset-top));
}
/* When the host page supplies its own top nav (hideBack), the mini-header
   is gone — add top breathing room so the hero clears the sticky nav. */
.hs-v6-levelup.lu-has-nav {
  padding-top: 22px;
}
.lu-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.lu-back svg {
  width: 16px;
  height: 16px;
}

/* "What happens next" explainer — stacked two-path layout with icon
   chips + a summary footer (v6-3) */
.boost-explain {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 22px 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: var(--shadow-card);
}
.boost-explain-steps {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
}
.boost-explain-step {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}
.boost-explain-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 161, 154, 0.3);
}
.boost-explain-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--accent-paler);
  color: var(--accent-dark);
}
.boost-explain-icon.boost {
  background: #fff6e8;
  color: var(--warning);
}
.boost-explain-icon :deep(svg) { width: 21px; height: 21px; }
.boost-explain-hr {
  height: 1px;
  background: var(--border-soft);
  margin: 16px 0;
}
.boost-explain-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.45;
}
.boost-explain-text :deep(b) {
  color: var(--text);
  font-weight: 700;
}
.boost-explain-foot {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-dark);
  margin-top: 18px;
  padding: 12px 16px;
  background: var(--accent-paler);
  border: 1px solid var(--accent-pale);
  border-radius: 12px;
  text-align: center;
  line-height: 1.5;
}
.boost-explain-foot :deep(b) {
  color: var(--accent-dark);
  font-weight: 800;
}

@keyframes hs-v6-fadeUp-anim2 {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.anim-2 {
  animation: hs-v6-fadeUp-anim2 0.35s 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>
