<template>
  <div class="wl-page">
    <main class="wl-hero">
      <!-- ── Left: copy ── -->
      <div class="wl-copy">
        <div class="wl-eyebrow">
          <span class="wl-dot" />Congratulations
          <span class="wl-dot" />You're in
        </div>

        <div class="wl-allset">You're all set</div>
        <h1 class="wl-title">Welcome,<br /><span class="wl-name">{{ firstName }}.</span></h1>
        <p class="wl-sub">
          Your home's already telling us things. Tap below to see what we found.
        </p>

        <button class="wl-cta" @click="continueToApp">
          Let's start exploring
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      <!-- ── Right: illustration card ── -->
      <div class="wl-visual">
        <span class="wl-fleck wl-fleck-a" />
        <span class="wl-fleck wl-fleck-b" />
        <span class="wl-fleck wl-fleck-c" />

        <div class="wl-card">
          <div class="wl-illus">
            <svg viewBox="0 0 420 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <!-- sun -->
              <circle cx="348" cy="66" r="34" fill="#FBE6AE" />
              <!-- ground -->
              <ellipse cx="210" cy="314" rx="172" ry="20" fill="#E3EDE7" />
              <!-- left navy block -->
              <rect x="70" y="196" width="96" height="106" rx="4" fill="#231d45" />
              <rect x="90" y="216" width="56" height="56" rx="3" fill="#F6C560" />
              <line x1="118" y1="216" x2="118" y2="272" stroke="#231d45" stroke-width="4" />
              <line x1="90" y1="244" x2="146" y2="244" stroke="#231d45" stroke-width="4" />
              <!-- main teal body -->
              <rect x="150" y="150" width="160" height="152" rx="4" fill="#18B0A4" />
              <!-- roof + chimney -->
              <rect x="286" y="92" width="24" height="48" fill="#2C2551" />
              <path d="M126 160 L219 72 L334 160 Z" fill="#231d45" />
              <!-- upper split window -->
              <rect x="196" y="170" width="54" height="62" rx="3" fill="#100D28" />
              <rect x="199" y="173" width="21" height="27" fill="#F6C560" />
              <!-- door -->
              <rect x="250" y="224" width="42" height="78" rx="3" fill="#2C2551" />
              <rect x="269" y="252" width="6" height="30" rx="3" fill="#F6C560" />
              <!-- fence -->
              <g fill="#231d45">
                <rect x="316" y="258" width="8" height="44" rx="2" />
                <rect x="330" y="258" width="8" height="44" rx="2" />
                <rect x="344" y="258" width="8" height="44" rx="2" />
              </g>
              <!-- bushes -->
              <ellipse cx="118" cy="300" rx="18" ry="12" fill="#3B8A50" />
              <ellipse cx="150" cy="298" rx="27" ry="16" fill="#2F7D46" />
              <ellipse cx="300" cy="300" rx="30" ry="16" fill="#37894F" />
            </svg>
          </div>

          <div class="wl-caption">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Your home on umovingu
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  title: 'Welcome - UmovingU',
})

// Best-effort first name from profile (falls back gracefully)
const profile = ref<any>(null)
const config = useRuntimeConfig()

const firstName = computed(() => {
  const raw = profile.value?.firstName || profile.value?.name || ''
  if (!raw) return 'friend'
  const first = String(raw).trim().split(/\s+/)[0]
  return first || 'friend'
})

onMounted(async () => {
  runConfetti()

  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return
    profile.value = await $fetch(`${config.public.apiBase}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // ignore — non-blocking decoration only
  }
})

const continueToApp = async () => {
  // Always finish onboarding in the app home. Clear any stashed return path
  // (e.g. a HomeScore property the user came from) so it can't drag them back
  // to an unrelated page.
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('redirectAfterLogin')
  }
  await navigateTo('/explore')
}

// Top-of-screen confetti shower — pieces start above the viewport and fall
// straight down. Honours prefers-reduced-motion.
function runConfetti() {
  if (typeof window === 'undefined') return
  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  const canvas = document.createElement('canvas')
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;pointer-events:none;'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = [
    '#00A19A',
    '#231d45',
    '#00b5ad',
    '#ffffff',
    '#e2f1ea',
    '#C18A38',
    '#6BD4CD',
  ]
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 120,
    w: 6 + Math.random() * 9,
    h: 5 + Math.random() * 7,
    color: colors[Math.floor(Math.random() * colors.length)],
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.18,
    vx: (Math.random() - 0.5) * 3,
    vy: 2.5 + Math.random() * 3,
    isCircle: Math.random() > 0.45,
    opacity: 1,
  }))

  let frame = 0
  const FRAMES = 160

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of pieces) {
      p.x += p.vx
      p.y += p.vy
      p.angle += p.spin
      if (frame > 90) p.opacity = Math.max(0, p.opacity - 0.015)
      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.fillStyle = p.color
      if (p.isCircle) {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      }
      ctx.restore()
    }
    frame++
    if (frame < FRAMES) {
      requestAnimationFrame(draw)
    } else {
      try { document.body.removeChild(canvas) } catch { /* already removed */ }
    }
  }
  requestAnimationFrame(draw)
}
</script>

<style scoped>
.wl-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: #faf9f5;
}

.wl-hero {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 76px 40px 100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  position: relative;
}
/* Soft mint glow behind the visual (top-right). */
.wl-hero::before {
  content: '';
  position: absolute;
  top: -40px;
  right: 4%;
  width: 480px;
  height: 380px;
  background: radial-gradient(ellipse, rgba(23, 179, 166, 0.12) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
}

/* ── Left copy ── */
.wl-copy {
  position: relative;
  z-index: 1;
}
.wl-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #00857f;
  margin-bottom: 22px;
}
.wl-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #17b3a6;
}
.wl-allset {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #a29fb2;
  margin-bottom: 14px;
}
.wl-title {
  font-size: clamp(46px, 5.6vw, 82px);
  font-weight: 800;
  letter-spacing: -2.4px;
  line-height: 0.98;
  color: #231d45;
  margin: 0 0 24px;
}
.wl-name {
  color: #00a19a;
}
.wl-sub {
  font-size: 19px;
  line-height: 1.5;
  color: #6b6783;
  max-width: 440px;
  margin: 0 0 38px;
}
.wl-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  background: #00a19a;
  border: none;
  padding: 20px 38px;
  border-radius: 100px;
  cursor: pointer;
  letter-spacing: -0.2px;
  box-shadow: 0 16px 36px rgba(0, 161, 154, 0.3), 0 2px 6px rgba(0, 161, 154, 0.16);
  transition: all 0.18s;
  animation: wl-cta-pulse 2.4s 1.2s ease-in-out infinite;
}
.wl-cta:hover {
  transform: translateY(-2px);
  background: #00b6ae;
}
.wl-cta svg {
  width: 18px;
  height: 18px;
}
@keyframes wl-cta-pulse {
  0%, 100% { box-shadow: 0 16px 36px rgba(0, 161, 154, 0.3), 0 2px 6px rgba(0, 161, 154, 0.16), 0 0 0 0 rgba(0, 161, 154, 0); }
  50% { box-shadow: 0 16px 36px rgba(0, 161, 154, 0.3), 0 2px 6px rgba(0, 161, 154, 0.16), 0 0 0 16px rgba(0, 161, 154, 0.07); }
}

/* ── Right visual ── */
.wl-visual {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wl-card {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 40px 90px rgba(35, 29, 69, 0.16);
  padding: 26px 26px 22px;
}
.wl-illus {
  border-radius: 20px;
  background: linear-gradient(168deg, #e7f5f0 0%, #eef3ee 100%);
  padding: 34px 30px 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wl-illus svg {
  width: 100%;
  max-width: 420px;
  height: auto;
}
.wl-caption {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #00a19a;
}
.wl-caption svg {
  width: 16px;
  height: 16px;
}

/* Decorative flecks */
.wl-fleck {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}
.wl-fleck-a { width: 12px; height: 12px; background: #17b3a6; top: 6%; left: 2%; }
.wl-fleck-b { width: 10px; height: 10px; background: #e0a43a; bottom: 4%; left: 12%; }
.wl-fleck-c { width: 12px; height: 12px; background: #17b3a6; top: 44%; right: -2%; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .wl-hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 24px 72px;
    text-align: left;
  }
  .wl-visual {
    order: -1;
  }
  .wl-hero::before {
    display: none;
  }
}
</style>
