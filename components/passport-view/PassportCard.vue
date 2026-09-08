<template>
  <div class="passport-card">
    <div class="passport-container">
      <!-- .passport-frame is always exactly the cover art's own aspect ratio,
           centred inside whatever box the page gives .passport-container (a
           92px auto-height dashboard slot, a fixed hero box, a square grid
           cell). That is what keeps the address overlay landing on the same
           spot of the artwork everywhere — anchored to the book itself, never
           to a differently-shaped wrapper. -->
      <div ref="frameEl" class="passport-frame">
        <img
          :src="passportImage"
          alt="Passport Background"
          class="passport-image"
        />
        <div ref="plateEl" class="passport-address">
          <div ref="line1El" class="address-line" :style="line1Style">{{ line1 }}</div>
          <div ref="line2El" class="address-line-small" :style="line2Style">{{ line2 }}</div>
        </div>
      </div>
    </div>

    <!-- <div class="passport-visual">
      <div class="passport-book">
        <div class="passport-cover">
          <div class="passport-text">Property Passport</div>
          <div class="house-icon">
            <OPIcon name="logo" class="w-[50px] h-[50px]" />
          </div>
          <div class="passport-address">
            <div class="address-line">{{ line1 }}</div>
            <div class="address-line-small">{{ line2 }}</div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import OPIcon from '../ui/OPIcon.vue'

const props = defineProps({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
    required: true,
  },
  // Passport type drives which cover art shows. Each type has its own
  // labelled book so a buyer's passport is distinguishable from a seller's
  // at a glance rather than every role sharing one generic cover. Existing
  // callers that pass no type keep the seller book, which is what the
  // single shared cover used to be.
  type: {
    type: String,
    default: 'SELLER',
  },
})

const PASSPORT_COVERS = {
  BUYER: '/dashboard/passportBuyer.png',
  SELLER: '/dashboard/passportSeller.png',
  LANDLORD: '/dashboard/passportLandlord.png',
  TENANT: '/dashboard/passportTenant.png',
}

const passportImage = computed(
  () => PASSPORT_COVERS[String(props.type || '').toUpperCase()] || PASSPORT_COVERS.SELLER,
)

// Measured from the PNGs themselves — the four covers are not the same shape,
// so a single ratio would letterbox or crop three of them. Used by
// .passport-frame to render each book at its true proportions.
const ASPECT_RATIOS = {
  SELLER: 515 / 485,
  BUYER: 413 / 409,
  LANDLORD: 415 / 402,
  TENANT: 423 / 425,
}

const aspectRatio = computed(
  () => ASPECT_RATIOS[String(props.type || '').toUpperCase()] ?? ASPECT_RATIOS.SELLER,
)

// Measured by scanning each cover PNG for (a) the horizontal span of the
// coloured book within the image and (b) the tallest glyph-free band below the
// umu mark. Percentages are of the frame's own width / height.
//
//            book spans     blank band (from image bottom)
//   SELLER     21.7-78.4%      27.8% -> 44.3%
//   LANDLORD   20.7-79.3%      28.6% -> 45.0%
//   BUYER      19.6-79.9%      28.1% -> 45.0%
//   TENANT     17.5-80.9%      28.0% -> 45.2%
//
// `width` is inset from the book's true span so the text has margin inside the
// cover edges; `maxHeight` keeps the block inside the blank band so it can
// never climb into the umu mark above or the corner glyph below.
//
// Re-measured against the cover PNGs (scanning each row inside the book for
// near-white glyph pixels to find the tallest clear band, and a mid-row scan
// for the book's own horizontal span):
//
//            book spans      clear band    old width -> new
//   SELLER     21.7-78.4%      16.7%          50  ->  52
//   BUYER      19.6-79.9%      16.9%          53  ->  55
//   LANDLORD   20.5-79.5%      16.4%          51  ->  54
//   TENANT     17.5-81.1%      17.2%          56  ->  58
//
// The old widths left 6-8% of the cover unused either side, which mattered:
// a plate too narrow for the street line pushes it onto two rows, two rows
// blow the height budget, and the fitter then shrinks the whole address to
// compensate. Widening it lets a typical street line hold one row and stay
// large - "100 Dulverton Avenue" goes from 11px to 15px on the collections
// hero book.
//
// The new widths are where the fit stops being width-bound and becomes
// height-bound: past this, extra plate width changes nothing, so these stop
// short of the book's printed edge (~2.3% inset each side) rather than
// running right up to it. maxHeight takes the ~1.5% of vertical headroom the
// measurement showed, keeping a margin under the umu mark.
const PLATE = {
  SELLER: { width: 52, bottom: 28.5, maxHeight: 16 },
  LANDLORD: { width: 54, bottom: 29, maxHeight: 16 },
  BUYER: { width: 55, bottom: 28.5, maxHeight: 16.4 },
  TENANT: { width: 58, bottom: 28.5, maxHeight: 16.6 },
}

const plate = computed(
  () => PLATE[String(props.type || '').toUpperCase()] ?? PLATE.SELLER,
)
const plateWidth = computed(() => `${plate.value.width}%`)
const plateBottom = computed(() => `${plate.value.bottom}%`)
const plateMaxHeight = computed(() => `${plate.value.maxHeight}%`)

// ── Address auto-fit ────────────────────────────────────────────────────
// This used to guess a font size from the address's CHARACTER COUNT, which
// has no reliable relationship to how wide the text actually renders — so
// short addresses looked right while long ones (or wide glyphs) spilled off
// the cover or got clipped. It now measures the real rendered text and binary
// searches the largest size that genuinely fits, so any address of any length
// lands inside the plate.
//
// Bounds are proportional to the book's own width, so a 58px grid thumbnail
// and a 232px hero book stay visually consistent; the search only ever moves
// DOWN from the proportional maximum.
// Sizes are ratios of the PLATE's width (not the frame's), since the plate is
// the box the text actually has to live in. Both lines scale together so the
// hierarchy between street and postcode holds at every size.
const L1_MAX_RATIO = 0.17
const L2_MAX_RATIO = 0.108
const MIN_SCALE = 0.22
const L1_MAX_LINES = 2

const frameEl = ref(null)
const plateEl = ref(null)
const line1El = ref(null)
const line2El = ref(null)

// Rendered sizes in px; null until measured. The pre-measure fallback is the
// proportional maximum, which is right for short addresses and only ever too
// large, so correcting after measurement is a shrink rather than a jump.
const fitted1 = ref(null)
const fitted2 = ref(null)

const line1Style = computed(() =>
  fitted1.value != null ? { fontSize: `${fitted1.value}px` } : {},
)
const line2Style = computed(() =>
  fitted2.value != null ? { fontSize: `${fitted2.value}px` } : {},
)

// A card can mount before its box has been laid out (a role toggle swapping
// the hero, a grid reflow). Without this the fitter bailed once and never ran
// again, leaving the address at its unfitted size.
let retryHandle = 0
let retries = 0
let verifyHandle = 0
let verifyPasses = 0
function scheduleRetry() {
  if (typeof requestAnimationFrame === 'undefined') return
  if (retries >= 20 || retryHandle) return
  retries += 1
  retryHandle = requestAnimationFrame(() => {
    retryHandle = 0
    refit()
  })
}

function refit() {
  const frame = frameEl.value
  const pl = plateEl.value
  const l1 = line1El.value
  const l2 = line2El.value
  if (!frame || !pl || !l1 || !l2) return

  const plateW = pl.clientWidth
  const frameH = frame.clientHeight
  // Derive the height budget from the frame and the plate ratio directly.
  // Reading it back off getComputedStyle().maxHeight is unreliable: a
  // percentage max-height comes back as the literal string "15%" (so
  // parseFloat yields 15 PIXELS, a wildly wrong budget) or as "none" while
  // the containing block's height is still indeterminate.
  const availH = (frameH * plate.value.maxHeight) / 100
  if (!plateW || !frameH) {
    // Not laid out yet — try again on the next frame rather than leaving the
    // address stuck at its unfitted fallback size.
    scheduleRetry()
    return
  }

  const base1 = plateW * L1_MAX_RATIO
  const base2 = plateW * L2_MAX_RATIO

  // Every check reads the element exactly as it renders. An earlier version
  // measured with the clamp and max-height temporarily lifted, but -webkit-box
  // and block wrap text to slightly different heights, so a size that fit while
  // measuring overflowed by a pixel or two once the real styles came back.
  // Measuring the rendered state removes that mismatch entirely.
  //
  // None of these relies on the plate reporting its own (hidden) overflow:
  //   - scrollWidth vs clientWidth still exposes horizontal overflow per line
  //   - l1.scrollHeight still reports the FULL text height when
  //     -webkit-line-clamp has visually capped it, which is what catches a
  //     third line
  //   - the block height is summed from the two lines rather than read off the
  //     clipped plate
  const blockHeight = () => {
    const gap = parseFloat(getComputedStyle(pl).rowGap) || 0
    const summed =
      l1.getBoundingClientRect().height +
      l2.getBoundingClientRect().height +
      gap
    return Math.max(pl.getBoundingClientRect().height, summed)
  }

  const fits = (k) => {
    l1.style.fontSize = `${base1 * k}px`
    l2.style.fontSize = `${base2 * k}px`
    // +0.5 absorbs sub-pixel rounding, which would otherwise reject a line
    // that visually fits perfectly by a hundredth of a pixel.
    if (l1.scrollWidth > l1.clientWidth + 0.5) return false
    if (l2.scrollWidth > l2.clientWidth + 0.5) return false
    const lh = parseFloat(getComputedStyle(l1).lineHeight) || base1 * k * 1.12
    if (l1.scrollHeight > lh * L1_MAX_LINES + 0.5) return false
    if (blockHeight() > availH) return false
    return true
  }

  let scale
  if (fits(1)) {
    scale = 1
  } else {
    let best = null
    let lo = MIN_SCALE
    let hi = 1
    for (let i = 0; i < 18 && hi - lo > 0.002; i += 1) {
      const mid = (lo + hi) / 2
      if (fits(mid)) {
        best = mid
        lo = mid
      } else {
        hi = mid
      }
    }
    // Nothing fits (an unbreakable word wider than the plate) — sit at the
    // floor and let the clamp/ellipsis contain what is left.
    scale = best ?? MIN_SCALE
  }

  // Closed-loop check. The binary search above reasons about the state it
  // creates as it goes; this confirms the committed result against what the
  // browser actually laid out, and steps down until it agrees. It exists
  // because sub-pixel differences (fractional frame heights, an em row-gap
  // resolving against the plate's own font-size) left the odd case a fraction
  // of a pixel over budget — small, but it is exactly that kind of overhang
  // that shows up as a clipped descender on the cover.
  for (let i = 0; i < 10 && scale > MIN_SCALE; i += 1) {
    l1.style.fontSize = `${base1 * scale}px`
    l2.style.fontSize = `${base2 * scale}px`
    if (
      blockHeight() <= availH &&
      l1.scrollWidth <= l1.clientWidth + 0.5 &&
      l2.scrollWidth <= l2.clientWidth + 0.5
    ) {
      break
    }
    scale *= 0.94
  }

  // One more check on a later frame. Everything above is measured inside a
  // single synchronous pass, so it reasons about metrics that can still change
  // afterwards — most often when the webfont finishes swapping in slightly
  // taller than the fallback it was measured against. Re-checking post-layout
  // catches the leftover fraction of a pixel and nudges the size down.
  function scheduleVerify() {
    if (typeof requestAnimationFrame === 'undefined') return
    cancelAnimationFrame(verifyHandle)
    verifyHandle = requestAnimationFrame(() => {
      verifyHandle = 0
      if (verifyPasses >= 12) return
      if (!plateEl.value || !line1El.value) return
      if (blockHeight() <= availH) return
      verifyPasses += 1
      const next = Math.max(MIN_SCALE, scale * 0.94)
      if (next === scale) return
      scale = next
      commit()
      // Deliberately NOT refit(): that re-runs the search from scratch, which
      // lands on the same too-large size again and undoes this correction.
      // Commit the smaller size and check again on the next frame instead.
      scheduleVerify()
    })
  }
  scheduleVerify()

  const round = (v) => Math.round(v * 100) / 100
  function commit() {
    fitted1.value = round(base1 * scale)
    fitted2.value = round(base2 * scale)
    l1.style.fontSize = `${fitted1.value}px`
    l2.style.fontSize = `${fitted2.value}px`
  }
  fitted1.value = round(base1 * scale)
  fitted2.value = round(base2 * scale)
  // Leave the measured size ON the element rather than clearing it and relying
  // on the :style binding to re-apply. Vue patches asynchronously, so when a
  // refit landed on the SAME size as the previous one the binding had nothing
  // to re-apply — the clear won, and the address snapped back to its unfitted
  // fallback size. Writing the final value here is idempotent with the binding.
  l1.style.fontSize = `${fitted1.value}px`
  l2.style.fontSize = `${fitted2.value}px`
}

function refitWhenReady() {
  refit()
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => refit()).catch(() => {})
  }
}

let ro = null
onMounted(() => {
  refitWhenReady()
  if (typeof ResizeObserver !== 'undefined' && frameEl.value) {
    // The book resizes with the page (responsive heroes, grid reflow), and the
    // fitted size is only valid for the width it was measured at.
    ro = new ResizeObserver(() => refit())
    ro.observe(frameEl.value)
  }
})
onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  if (retryHandle) cancelAnimationFrame(retryHandle)
  if (verifyHandle) cancelAnimationFrame(verifyHandle)
  retryHandle = 0
  verifyHandle = 0
})

// A new address needs re-measuring from the top of the range, not from the
// previous address's fitted size.
watch(
  () => [props.line1, props.line2, props.type],
  async () => {
    fitted1.value = null
    fitted2.value = null
    retries = 0
    verifyPasses = 0
    await nextTick()
    refitWhenReady()
  },
)
</script>

<style scoped>
/* Extracted CSS for passport-card only. You can move/adjust as needed */
.passport-card {
  display: flex;
  justify-content: center;
  margin: 32px 0;
  perspective: 1000px;
}

.passport-container {
  position: relative;
  width: 100%;
  max-width: 360px;
  /* Only takes effect where a page constrains width alone — aspect-ratio is
     what gives the container a height in that case. Pages that set both a
     fixed width and height make each dimension already-definite, so this is
     ignored there and .passport-frame's own ratio is what governs. */
  aspect-ratio: v-bind(aspectRatio);
}

.passport-frame {
  /* The standard "letterboxed content" recipe: absolutely positioned, inset
     0, auto margins, its own aspect-ratio capped by max-width/max-height. */
  position: absolute;
  inset: 0;
  margin: auto;
  aspect-ratio: v-bind(aspectRatio);
  max-width: 100%;
  max-height: 100%;
  /* The size container is the BOOK, not the wrapper, so cqi units below
     scale the address with the artwork's real rendered width. */
  container-type: inline-size;
}

.passport-image {
  width: 100%;
  height: 100%;
  display: block;
  /* contain, never cover — cover crops the book's stand and edges off. */
  object-fit: contain;
}
/* .passport-visual {
  transform: rotateY(-15deg);
  transition: transform 0.3s;
}

.passport-visual:hover {
  transform: rotateY(0deg);
}

.passport-book {
  width: 200px;
  height: 260px;
  position: relative;
}

.passport-cover {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #00a19a 0%, #00a89a 100%);
  border-radius: 8px;
  box-shadow:
    8px 8px 20px rgba(0, 0, 0, 0.3),
    inset 2px 2px 8px rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  color: white;
  position: relative;
}

.passport-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 8px 0 0 8px;
} */

/* .passport-text {
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.house-icon {
  width: 40%;
  margin: 20px 0;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
} */

.passport-address {
  /* Sits in the cover art's blank zone, below the umu house mark and above
     the corner glyph. Verified against all four covers, which share one
     layout and differ only in colour. Meaningful only because
     .passport-frame guarantees this overlays the undistorted book at its
     true ratio — the old 13% was tuned against a letterboxed render and
     drifted off the artwork anywhere it drew at natural proportions. */
  position: absolute;
  bottom: v-bind(plateBottom);
  left: 50%;
  transform: translateX(-50%);
  width: v-bind(plateWidth);
  max-width: v-bind(plateWidth);
  /* Hard ceiling: the glyph-free band on the cover. Keeps a long two-line
     address from climbing into the umu mark above it. */
  max-height: v-bind(plateMaxHeight);
  overflow: hidden;
  justify-content: flex-end;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* No gap here. On this element em resolves against the plate's INHERITED
     font-size (the page's ~16px), not the address text — so any em gap was a
     fixed ~2px that swallowed a tenth of the height budget whether the address
     rendered at 14px or at 2px. The spacing lives on .address-line-small
     instead, where em resolves against the postcode's own size and scales
     with it. */
  gap: 0;
  /* Match the app's primary typeface so the card label reads consistently */
  font-family:
    'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  /* Soft shadow keeps the label legible on the textured teal cover */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
}

/* Address typography scales with the card's container width via cqi so a
   tiny 58 px grid thumbnail and a larger tile both stay proportional.
   Kept small and clamped to 2 clean lines (whole words only) so the block
   sits neatly in the lower cover and never climbs into the umu logo. */
.address-line {
  /* Pre-measurement size; the fitter overrides this inline once it has
     measured, and only ever downward. */
  font-size: 8.5cqi;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  font-weight: 800;
  margin: 0;
  line-height: 1.12;
  letter-spacing: -0.02em;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: none;
  /* Prefer two balanced lines over one edge-to-edge line */
  text-wrap: balance;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-line-small {
  /* Pre-measurement size — see .address-line. */
  font-size: 5.4cqi;
  margin-top: 0.2em;
  flex-shrink: 0;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  font-weight: 700;
  line-height: 1.1;
  opacity: 0.95;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Browsers without container-query support fall back to a small fixed
   size — not perfect, but never broken. */
@supports not (container-type: inline-size) {
  .address-line {
    font-size: 8px;
  }
  .address-line-small {
    font-size: 6.5px;
  }
}
</style>
