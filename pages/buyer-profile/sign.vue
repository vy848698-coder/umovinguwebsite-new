<template>
  <div class="sd-page">

    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="sd-shell">
      <!-- Page head -->
      <div class="sd-head">
        <div class="sd-kicker"><span class="sd-kicker-dot" />SIGN YOUR PROFILE</div>
        <h1 class="sd-h1">Add your digital signature</h1>
        <p class="sd-sub">
          Sign to confirm this profile is accurate and authorise its sharing.
          Your signature is embedded in the certified PDF.
        </p>
      </div>

      <div class="sd-grid">
        <!-- LEFT: signature pad -->
        <div class="sd-card sd-card--pad">
          <div class="sd-card-head">
            <span class="sd-card-eyebrow">DRAW YOUR SIGNATURE</span>
            <button
              class="sd-clear"
              :class="{ disabled: !canClear }"
              :disabled="!canClear"
              @click="onClear"
            >
              <Icon name="heroicons:arrow-path" class="sd-clear-ic" />Clear
            </button>
          </div>

          <div class="sig-pad" :class="{ signed: hasDrawn }">
            <canvas
              ref="canvasEl"
              class="sig-canvas"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointerleave="onPointerUp"
              @pointercancel="onPointerUp"
            />
            <div v-if="!hasDrawn" class="sig-placeholder">
              <Icon name="heroicons:pencil" class="sig-placeholder-ic" />
              <span class="sig-placeholder-text">Draw your signature here</span>
            </div>
          </div>

          <!-- Or type name -->
          <div class="sd-type-wrap">
            <div class="sd-type-divider"><span>or type your name instead</span></div>
            <input
              v-model="typedName"
              type="text"
              class="sd-type-input"
              :placeholder="displayName"
              @input="onTypeNameInput"
            />
          </div>

          <!-- Apply CTA -->
          <button
            class="cta-btn"
            :disabled="!canApply || applying"
            @click="onApply"
          >
            <span class="cta-btn-inner">
              {{ applying ? 'Applying…' : 'Apply signature' }}
              <Icon v-if="!applying" name="heroicons:arrow-right" class="cta-arrow" />
            </span>
          </button>
          <div v-if="errorMsg" class="sd-err">
            <Icon name="heroicons:exclamation-circle" class="sd-err-ic" />{{ errorMsg }}
          </div>
        </div>

        <!-- RIGHT: document summary + legal -->
        <div class="sd-side">
          <div class="sd-card sd-doc-summary">
            <div class="sd-doc-label">
              <Icon name="heroicons:document-text" class="sd-doc-label-ic" />SIGNING
            </div>
            <div class="sd-doc-title">UMU Buyer Profile</div>
            <div class="sd-doc-name">{{ displayName }}</div>
            <div class="sd-doc-rows">
              <div class="sd-doc-row"><span>Reference</span><strong>{{ publicRef }}</strong></div>
              <div class="sd-doc-row"><span>Date</span><strong>{{ todayLabel }}</strong></div>
              <div class="sd-doc-row"><span>Scope</span><strong>Profile + Financials</strong></div>
            </div>
          </div>

          <div class="sd-legal">
            <Icon name="heroicons:shield-check" class="sd-legal-ic" />
            <span>
              Your digital signature is timestamp-verified by UMU and embedded in
              the PDF as a legally recognised electronic signature under
              <strong>eIDAS</strong> regulation.
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  useBuyerProfile,
  type BuyerProfile,
} from '~/composables/useBuyerProfile'
import { useProfile } from '~/composables/useProfile'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'

definePageMeta({ title: 'Sign Profile — UmovingU', middleware: 'auth' })

const router = useRouter()
const { getBuyerProfile, signProfile } = useBuyerProfile()
const { fetchProfile, profile } = useProfile()

const passport = ref<BuyerProfile | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const hasDrawn = ref(false)
const typedName = ref('')
const applying = ref(false)
const errorMsg = ref('')

let ctx: CanvasRenderingContext2D | null = null
let drawing = false
let lastX = 0
let lastY = 0
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  fetchProfile?.().catch(() => {})
  try {
    const p = await getBuyerProfile()
    passport.value = p
    if (!p) { router.replace('/buyer-profile'); return }
  } catch {
    router.replace('/buyer-profile')
    return
  }
  await nextTick()
  initCanvas()
  // React to size changes (e.g. orientation, font load) by resizing the canvas
  // while preserving the strokes drawn so far.
  if (canvasEl.value && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => initCanvas())
    resizeObserver.observe(canvasEl.value.parentElement!)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function initCanvas() {
  const canvas = canvasEl.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.parentElement!.getBoundingClientRect()
  // Backup current pixels before resizing (avoid wiping when re-init runs).
  const backup = canvas.toDataURL?.('image/png')
  canvas.width = Math.floor(rect.width * dpr)
  canvas.height = Math.floor(rect.height * dpr)
  canvas.style.width = rect.width + 'px'
  canvas.style.height = rect.height + 'px'
  ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
  ctx.strokeStyle = '#231d45'
  ctx.lineWidth = 2.4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (backup && hasDrawn.value) {
    const img = new Image()
    img.onload = () => { ctx?.drawImage(img, 0, 0, rect.width, rect.height) }
    img.src = backup
  }
}

function getXY(ev: PointerEvent): [number, number] {
  const rect = canvasEl.value!.getBoundingClientRect()
  return [ev.clientX - rect.left, ev.clientY - rect.top]
}

function onPointerDown(ev: PointerEvent) {
  if (!ctx) return
  drawing = true
  ;[lastX, lastY] = getXY(ev)
  // dot start for taps
  ctx.beginPath()
  ctx.arc(lastX, lastY, 1.2, 0, Math.PI * 2)
  ctx.fillStyle = '#231d45'
  ctx.fill()
  hasDrawn.value = true
  // Typing and drawing are mutually exclusive — clearing typed input keeps
  // the "what gets persisted" decision unambiguous.
  if (typedName.value) typedName.value = ''
  ;(ev.target as Element).setPointerCapture?.(ev.pointerId)
}
function onPointerMove(ev: PointerEvent) {
  if (!drawing || !ctx) return
  const [x, y] = getXY(ev)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  ;[lastX, lastY] = [x, y]
}
function onPointerUp() { drawing = false }

function onTypeNameInput() {
  // If user starts typing, wipe any drawn strokes (mutually exclusive paths)
  if (hasDrawn.value && typedName.value.trim()) {
    clearCanvas()
  }
}

function clearCanvas() {
  if (!ctx || !canvasEl.value) return
  const w = canvasEl.value.parentElement!.getBoundingClientRect().width
  const h = canvasEl.value.parentElement!.getBoundingClientRect().height
  ctx.clearRect(0, 0, w, h)
  hasDrawn.value = false
}

function onClear() {
  if (!canClear.value) return
  clearCanvas()
  typedName.value = ''
}

const canClear = computed(() => hasDrawn.value || !!typedName.value)
const canApply = computed(() => hasDrawn.value || !!typedName.value.trim())

// ── Display ───────────────────────────────────────────────
const displayName = computed(() => {
  const first = profile.value?.firstName?.trim()
  const last = profile.value?.lastName?.trim()
  if (first || last) return [first, last].filter(Boolean).join(' ')
  return profile.value?.email?.split('@')[0] || 'Buyer'
})
const publicRef = computed(
  () => (passport.value as any)?.publicRef || '—',
)
const todayLabel = computed(() =>
  new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }),
)

// ── Apply signature ───────────────────────────────────────
async function onApply() {
  errorMsg.value = ''
  applying.value = true
  try {
    let payload: { signatureData?: string; signedName?: string } = {}
    if (hasDrawn.value && canvasEl.value) {
      payload.signatureData = canvasEl.value.toDataURL('image/png')
    } else if (typedName.value.trim()) {
      payload.signedName = typedName.value.trim()
    } else {
      errorMsg.value = 'Sign or type your name first'
      return
    }
    await signProfile(payload)
    router.push('/buyer-profile/signed')
  } catch (e: any) {
    errorMsg.value = e?.data?.message ?? 'Could not save signature'
  } finally {
    applying.value = false
  }
}

const goBack = useGoBack('/buyer-profile/pdf')
</script>


<style scoped>
.sd-page {
  min-height: 100dvh;
  background: #f3f2ef;
  color: #231d45;
  width: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative; overflow-x: hidden;
}
.sd-ambient { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.sd-ambient-a { width: 540px; height: 540px; top: -160px; left: -140px; background: radial-gradient(circle, rgba(0,161,154,0.12) 0%, transparent 70%); }
.sd-ambient-b { width: 480px; height: 480px; bottom: 6%; right: -120px; background: radial-gradient(circle, rgba(90,76,240,0.1) 0%, transparent 70%); }

.sd-shell { width: min(1100px, calc(100% - 64px)); margin: 0 auto; position: relative; z-index: 2; padding: 40px 0 90px; }

/* Head */
.sd-head { margin-bottom: 28px; max-width: 640px; }
.sd-kicker {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
  color: #067a74; background: rgba(229,255,248,0.92); border: 1px solid rgba(0,161,154,0.28);
  padding: 6px 12px; border-radius: 100px; margin-bottom: 14px;
}
.sd-kicker-dot { width: 5px; height: 5px; border-radius: 50%; background: #00a19a; }
.sd-h1 { font-size: 38px; font-weight: 800; color: #10263d; letter-spacing: -1px; line-height: 1.08; margin-bottom: 10px; }
.sd-sub { font-size: 15px; color: #627891; line-height: 1.6; font-weight: 500; }

/* Grid */
.sd-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 24px; align-items: start; }

/* Cards */
.sd-card { background: #fff; border: 1px solid #e8eef5; border-radius: 22px; box-shadow: 0 14px 34px rgba(15,44,76,0.07); padding: 24px; }
.sd-card--pad { display: flex; flex-direction: column; }
.sd-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sd-card-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #8a97a8; }
.sd-clear { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: #00a19a; background: #f2faf8; border: 1px solid #d8efeb; border-radius: 9px; padding: 6px 11px; cursor: pointer; font-family: inherit; transition: all 0.16s; }
.sd-clear:hover:not(.disabled) { background: #e6f6f3; }
.sd-clear.disabled { opacity: 0.4; cursor: not-allowed; }
.sd-clear-ic { width: 13px; height: 13px; }

/* Signature pad */
.sig-pad {
  position: relative;
  height: 220px;
  border: 2px dashed #cdd9e6;
  border-radius: 16px;
  background: #fbfdff;
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}
.sig-pad.signed { border-style: solid; border-color: #00a19a; background: #fff; }
.sig-canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: crosshair; }
.sig-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; pointer-events: none; }
.sig-placeholder-ic { width: 30px; height: 30px; color: #9aa9bd; }
.sig-placeholder-text { font-size: 13px; font-weight: 600; color: #9aa9bd; }

/* Type name */
.sd-type-wrap { margin-top: 18px; }
.sd-type-divider { display: flex; align-items: center; text-align: center; font-size: 11px; font-weight: 600; color: #9aa9bd; margin-bottom: 12px; }
.sd-type-divider::before, .sd-type-divider::after { content: ''; flex: 1; height: 1px; background: #e8eef5; }
.sd-type-divider span { padding: 0 12px; }
.sd-type-input { width: 100%; border: 1.5px solid #e2e8f1; border-radius: 12px; padding: 14px 16px; font-size: 15px; font-family: inherit; color: #231d45; background: #fbfdff; transition: border-color 0.18s, box-shadow 0.18s; }
.sd-type-input:focus { outline: none; border-color: #00a19a; box-shadow: 0 0 0 3px rgba(0,161,154,0.12); }
.sd-type-input::placeholder { color: #b5bdc9; }

/* CTA */
.cta-btn {
  width: 100%; margin-top: 20px;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 48%, #4f4ff2 100%);
  color: #fff; border: none; border-radius: 14px; padding: 17px;
  font-size: 15px; font-weight: 800; font-family: inherit;
  box-shadow: 0 14px 26px rgba(58,87,206,0.26); cursor: pointer;
  transition: transform 0.2s cubic-bezier(.22,1,.36,1), box-shadow 0.2s, filter 0.2s;
}
.cta-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 32px rgba(58,87,206,0.32); }
.cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.cta-btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
.cta-arrow { width: 17px; height: 17px; }
.sd-err { display: flex; align-items: center; gap: 6px; margin-top: 12px; font-size: 12.5px; font-weight: 700; color: #d4541e; }
.sd-err-ic { width: 16px; height: 16px; }

/* Side */
.sd-side { display: flex; flex-direction: column; gap: 16px; }
.sd-doc-summary {
  background: linear-gradient(150deg, #00b6ae 0%, #009a93 48%, #00514d 100%);
  border: none; color: #fff;
  box-shadow: 0 16px 36px -12px rgba(0,161,154,0.45);
}
.sd-doc-label { display: inline-flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: rgba(255,255,255,0.7); margin-bottom: 12px; }
.sd-doc-label-ic { width: 15px; height: 15px; }
.sd-doc-title { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.sd-doc-name { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); margin-bottom: 18px; }
.sd-doc-rows { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid rgba(255,255,255,0.18); padding-top: 16px; }
.sd-doc-row { display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
.sd-doc-row span { color: rgba(255,255,255,0.7); }
.sd-doc-row strong { color: #fff; font-weight: 700; }
.sd-legal { display: flex; align-items: flex-start; gap: 12px; background: #f6f5fb; border: 1px solid #ebe8f6; border-radius: 16px; padding: 16px; font-size: 12px; color: #6b6783; line-height: 1.55; }
.sd-legal-ic { width: 22px; height: 22px; color: #6a5af0; flex-shrink: 0; }
.sd-legal strong { color: #4a4566; }

@media (max-width: 940px) {
  .sd-grid { grid-template-columns: 1fr; gap: 20px; }
  .sd-side { flex-direction: column; }
  .sd-h1 { font-size: 30px; }
}
@media (max-width: 760px) {
  .sd-shell { width: calc(100% - 32px); padding: 32px 0 64px; }
  .sd-h1 { font-size: 26px; }
  .sd-sub { font-size: 14px; }
  .sd-card { padding: 20px; border-radius: 18px; }
  .sig-pad { height: 190px; }
}
@media (max-width: 480px) {
  .sd-shell { width: calc(100% - 24px); }
  .sd-h1 { font-size: 23px; }
}
</style>
