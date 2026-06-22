<template>
  <div class="hs-ring-wrap">
    <svg viewBox="0 0 200 200" width="200" height="200">
      <!-- Track -->
      <circle cx="100" cy="100" r="82" fill="none" stroke="#e7e4dc" stroke-width="13" />
      <!-- Progress -->
      <circle
        cx="100" cy="100" r="82" fill="none"
        :stroke="ratingColor"
        stroke-width="13"
        :stroke-dasharray="`${progressArc} ${circumference}`"
        stroke-linecap="round"
        transform="rotate(-90 100 100)"
        style="transition: stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
      />
      <!-- Score -->
      <text x="100" y="96" text-anchor="middle" :font-size="score >= 100 ? 46 : 58" font-weight="800" :fill="scoreColor" font-family="sans-serif" letter-spacing="-2">
        {{ displayScore }}
      </text>
      <text x="100" y="126" text-anchor="middle" font-size="16" fill="#6b7280" font-family="sans-serif" font-weight="500">
        {{ rating }}
      </text>
    </svg>
    <p class="hs-ring-label">out of 100</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  score: number
  rating: string
  ratingColor: string
}>()

const circumference = 2 * Math.PI * 82 // ≈ 515.22

const displayScore = ref(0)
const progressArc = computed(() => (displayScore.value / 100) * circumference)

// Darker shade of the rating colour for the big number, to match the design.
const scoreColor = computed(() => {
  const c = props.ratingColor
  if (!/^#[0-9a-f]{6}$/i.test(c)) return c
  const f = 0.62 // mix toward black
  const r = Math.round(parseInt(c.slice(1, 3), 16) * f)
  const g = Math.round(parseInt(c.slice(3, 5), 16) * f)
  const b = Math.round(parseInt(c.slice(5, 7), 16) * f)
  return `rgb(${r}, ${g}, ${b})`
})

onMounted(() => {
  setTimeout(() => {
    const target = props.score
    const duration = 1200
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayScore.value = Math.round(eased * target)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, 100)
})
</script>

<style scoped>
.hs-ring-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hs-ring-label {
  font-size: 12px;
  color: #b0b0bc;
  font-weight: 500;
  margin-top: 2px;
  letter-spacing: 0.01em;
}
</style>
