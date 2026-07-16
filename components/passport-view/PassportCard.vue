<template>
  <div class="passport-card">
    <div class="passport-container">
      <img
        src="/op-icons/passportview/umu-passport.png"
        alt="Passport Background"
        class="passport-image h-full object-cover rounded-lg"
      />
      <div class="passport-address">
        <div class="address-line" :style="line1Style">{{ line1 }}</div>
        <div class="address-line-small" :style="line2Style">{{ line2 }}</div>
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
import { computed } from 'vue'
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
})

// Auto-fit the address to its own length. Size is expressed in cqi (1% of the
// card's rendered width) so it still scales from a 58 px grid thumbnail up to
// the large hero card — but the multiplier AND the px min/max shrink as the
// text gets longer, so a short "100 Lyons Drive" stays bold while a long
// "100 Dulverton Avenue" steps down to fit cleanly on two lines instead of
// overrunning into the umu logo. `min` also drops with length so tiny
// thumbnails don't force long text bigger than the cover can hold.
function fitClamp(text, steps) {
  const len = (text || '').trim().length
  const step = steps.find((s) => len <= s.max) || steps[steps.length - 1]
  return `clamp(${step.min}px, ${step.cqi}cqi, ${step.px}px)`
}

const line1Style = computed(() => ({
  // Tuned so anything ~16 chars or longer wraps to two balanced lines (like
  // "100 Dulverton Avenue") instead of cramming edge-to-edge on one line
  // (which looked wrong for "10 Mellowship Road" / "100 Mantilla Drive").
  // Short names (≤15 chars, e.g. "100 Lyons Drive") still sit on one line.
  fontSize: fitClamp(props.line1, [
    { max: 12, min: 7.2, cqi: 8.4, px: 14.5 }, // "5 Elm Road"
    { max: 15, min: 6.3, cqi: 7.2, px: 12.5 }, // "100 Lyons Drive" — one line
    { max: 20, min: 5.9, cqi: 6.4, px: 11 }, // "10 Mellowship Road" — two lines
    { max: 25, min: 5.2, cqi: 5.6, px: 9.5 }, // "10 Sutherland Avenue"
    { max: Infinity, min: 4.6, cqi: 4.9, px: 8.5 },
  ]),
}))

const line2Style = computed(() => ({
  fontSize: fitClamp(props.line2, [
    { max: 8, min: 5.5, cqi: 5, px: 9.5 }, // "CV5 6AJ"
    { max: Infinity, min: 4.6, cqi: 4.3, px: 8.5 },
  ]),
}))
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
  /* Become a size container so the address text below can scale with the
     rendered card width (cqi = 1% of container's inline size). This means
     a 76 px tile in the resume card and a 150 px tile in the grid both
     get proportionally legible address typography. */
  container-type: inline-size;
}

.passport-image {
  width: 100%;
  height: auto;
  display: block;
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
  position: absolute;
  bottom: 13%;
  left: 50%;
  transform: translateX(-50%);
  width: 84%;
  max-width: 84%;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5%;
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
  /* font-size is set inline (length-aware, see line1Style) */
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
  /* font-size is set inline (length-aware, see line2Style) */
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
