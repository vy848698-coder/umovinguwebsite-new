<template>
  <!-- UMU AI mascot. One vector drawing with jointed arms, a tilting head,
       a face that changes with its mood and a chest screen, used large on
       the assistant page, on the passport card and as a head only avatar.
       Every moving part is CSS keyed off the state class, and all of it
       stops under prefers-reduced-motion. -->
  <svg
    class="umb"
    :class="[`umb--${state}`, { 'umb--head': head, 'umb--still': still, 'umb--wave': wave }]"
    :viewBox="head ? '30 0 260 220' : '0 0 320 400'"
    role="img"
    :aria-label="label"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient :id="`${uid}-shell`" cx="0.35" cy="0.25" r="0.9">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.5" stop-color="#f0f4f9" />
        <stop offset="1" stop-color="#b8c7d8" />
      </radialGradient>
      <linearGradient :id="`${uid}-visor`" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="#1f4470" />
        <stop offset="0.55" stop-color="#0b1e3d" />
        <stop offset="1" stop-color="#050f24" />
      </linearGradient>
      <linearGradient :id="`${uid}-metal`" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#c3cfdc" />
        <stop offset="1" stop-color="#7a8ca3" />
      </linearGradient>
      <filter :id="`${uid}-lit`" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.6" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Floor shadow -->
    <ellipse v-if="!head" class="umb-shadow" cx="160" cy="388" rx="64" ry="8" fill="#000" opacity="0.3" />

    <g class="umb-float">
      <!-- ── Body ── -->
      <g v-if="!head" class="umb-body">
        <!-- Hover base -->
        <ellipse cx="160" cy="350" rx="36" ry="9" :fill="`url(#${uid}-metal)`" />
        <ellipse class="umb-thruster" cx="160" cy="356" rx="24" ry="4.5" fill="#3ee6e0" opacity="0.75" :filter="`url(#${uid}-lit)`" />

        <!-- Torso -->
        <path
          d="M102 250 C102 222 128 212 160 212 C192 212 218 222 218 250 L212 306 C208 332 188 346 160 346 C132 346 112 332 108 306 Z"
          :fill="`url(#${uid}-shell)`"
          stroke="#b3c2d3"
          stroke-width="1.4"
        />
        <path d="M112 306 Q160 322 208 306" fill="none" stroke="#cbd6e2" stroke-width="2" />

        <!-- Chest screen: sound bars when speaking, a ring when listening,
             dots when thinking, a small heart light otherwise -->
        <rect x="126" y="236" width="68" height="42" rx="15" :fill="`url(#${uid}-visor)`" stroke="#9fb1c5" stroke-width="1.2" />
        <g class="umb-chest" :filter="`url(#${uid}-lit)`" fill="#3ee6e0">
          <circle class="umb-chest-dot" cx="160" cy="257" r="6" />
          <g class="umb-chest-bars">
            <rect class="umb-bar" x="140" y="249" width="4" height="16" rx="2" />
            <rect class="umb-bar" x="148" y="249" width="4" height="16" rx="2" />
            <rect class="umb-bar" x="156" y="249" width="4" height="16" rx="2" />
            <rect class="umb-bar" x="164" y="249" width="4" height="16" rx="2" />
            <rect class="umb-bar" x="172" y="249" width="4" height="16" rx="2" />
          </g>
          <circle class="umb-chest-ring" cx="160" cy="257" r="9" fill="none" stroke="#3ee6e0" stroke-width="3" />
          <g class="umb-chest-think">
            <circle cx="148" cy="257" r="3.5" />
            <circle cx="160" cy="257" r="3.5" />
            <circle cx="172" cy="257" r="3.5" />
          </g>
        </g>

        <!-- Neck -->
        <rect x="138" y="196" width="44" height="22" rx="9" :fill="`url(#${uid}-metal)`" />

        <!-- Left arm: shoulder, upper arm, elbow, forearm, hand -->
        <g class="umb-arm umb-arm--l">
          <rect x="84" y="230" width="26" height="54" rx="13" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          <g class="umb-fore umb-fore--l">
            <circle cx="97" cy="284" r="9" :fill="`url(#${uid}-metal)`" />
            <rect x="85" y="284" width="24" height="44" rx="12" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
            <circle cx="97" cy="334" r="14" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          </g>
          <circle cx="97" cy="234" r="13" :fill="`url(#${uid}-metal)`" />
        </g>

        <!-- Right arm -->
        <g class="umb-arm umb-arm--r">
          <rect x="210" y="230" width="26" height="54" rx="13" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          <g class="umb-fore umb-fore--r">
            <circle cx="223" cy="284" r="9" :fill="`url(#${uid}-metal)`" />
            <rect x="211" y="284" width="24" height="44" rx="12" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
            <circle cx="223" cy="334" r="14" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          </g>
          <circle cx="223" cy="234" r="13" :fill="`url(#${uid}-metal)`" />
        </g>
      </g>

      <!-- ── Head ── -->
      <g class="umb-head">
        <!-- Antenna -->
        <rect x="156" y="16" width="8" height="28" rx="4" :fill="`url(#${uid}-metal)`" />
        <circle class="umb-antenna" cx="160" cy="14" r="8" fill="#3ee6e0" :filter="`url(#${uid}-lit)`" />

        <!-- Ear pods -->
        <g class="umb-ear umb-ear--l">
          <rect x="44" y="90" width="38" height="66" rx="19" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          <circle class="umb-ear-ring" cx="63" cy="123" r="11" fill="none" stroke="#3ee6e0" stroke-width="3.5" :filter="`url(#${uid}-lit)`" />
        </g>
        <g class="umb-ear umb-ear--r">
          <rect x="238" y="90" width="38" height="66" rx="19" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
          <circle class="umb-ear-ring" cx="257" cy="123" r="11" fill="none" stroke="#3ee6e0" stroke-width="3.5" :filter="`url(#${uid}-lit)`" />
        </g>

        <!-- Helmet -->
        <rect x="68" y="38" width="184" height="164" rx="80" :fill="`url(#${uid}-shell)`" stroke="#b3c2d3" stroke-width="1.4" />
        <path d="M96 60 C120 46 156 42 186 48" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0.9" />

        <!-- Visor glass -->
        <rect x="86" y="68" width="148" height="112" rx="52" :fill="`url(#${uid}-visor)`" />
        <rect x="86" y="68" width="148" height="112" rx="52" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2" />
        <path d="M106 88 C120 78 142 74 164 76" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="6" stroke-linecap="round" />
        <circle cx="186" cy="80" r="3" fill="#ffffff" fill-opacity="0.25" />

        <!-- Face -->
        <g class="umb-face" :filter="`url(#${uid}-lit)`">
          <g class="umb-eyes">
            <!-- Happy eyes -->
            <g class="umb-eyes-happy" fill="none" stroke="#3ee6e0" stroke-width="8" stroke-linecap="round">
              <path class="umb-eye" d="M116 124 Q128 110 140 124" />
              <path class="umb-eye" d="M180 124 Q192 110 204 124" />
            </g>
            <!-- Open eyes -->
            <g class="umb-eyes-open" fill="#3ee6e0">
              <ellipse class="umb-eye" cx="128" cy="120" rx="11" ry="14" />
              <ellipse class="umb-eye" cx="192" cy="120" rx="11" ry="14" />
              <circle cx="132" cy="114" r="3.5" fill="#e9fffe" />
              <circle cx="196" cy="114" r="3.5" fill="#e9fffe" />
            </g>
          </g>
          <!-- Mouths -->
          <path class="umb-mouth umb-mouth-smile" d="M138 148 Q160 166 182 148" fill="none" stroke="#3ee6e0" stroke-width="7" stroke-linecap="round" />
          <ellipse class="umb-mouth umb-mouth-talk" cx="160" cy="154" rx="15" ry="8" fill="#3ee6e0" />
          <circle class="umb-mouth umb-mouth-o" cx="160" cy="154" r="6" fill="none" stroke="#3ee6e0" stroke-width="5" />
        </g>
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    // idle: floats, blinks, arms sway. speaking: talks and gestures.
    // listening: leans in, ears pulse. thinking: looks up, dots on chest.
    // pointing: points at the answer. celebrate: both arms up.
    state?: 'idle' | 'speaking' | 'listening' | 'thinking' | 'pointing' | 'celebrate'
    // Head only, for chat avatars and small spots.
    head?: boolean
    // No floating, for tight spaces.
    still?: boolean
    // Waves hello a few times when it first appears.
    wave?: boolean
    label?: string
  }>(),
  { state: 'idle', head: false, still: false, wave: false, label: 'UMU AI assistant' },
)

// Gradient ids must be unique per instance or a second mascot on the page
// would borrow the first one's fills.
const uid = `umb-${useId()}`
</script>

<style scoped>
.umb {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

/* Joints rotate around fixed points in the drawing */
.umb-arm,
.umb-fore,
.umb-head,
.umb-float {
  transform-box: view-box;
  transition: transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.umb-arm--l { transform-origin: 97px 234px; transform: rotate(10deg); }
.umb-arm--r { transform-origin: 223px 234px; transform: rotate(-10deg); }
.umb-fore--l { transform-origin: 97px 284px; }
.umb-fore--r { transform-origin: 223px 284px; }
.umb-head { transform-origin: 160px 200px; }

.umb-eye,
.umb-mouth,
.umb-bar,
.umb-ear-ring,
.umb-chest-ring,
.umb-antenna,
.umb-thruster,
.umb-shadow {
  transform-box: fill-box;
  transform-origin: center;
}

/* Which face and chest parts show in each state */
.umb-eyes-open,
.umb-mouth-talk,
.umb-mouth-o,
.umb-chest-bars,
.umb-chest-ring,
.umb-chest-think {
  opacity: 0;
}
.umb-eyes-happy,
.umb-eyes-open,
.umb-mouth,
.umb-chest > * {
  transition: opacity 0.2s ease;
}

.umb--speaking .umb-eyes-happy,
.umb--listening .umb-eyes-happy,
.umb--thinking .umb-eyes-happy { opacity: 0; }
.umb--speaking .umb-eyes-open,
.umb--listening .umb-eyes-open,
.umb--thinking .umb-eyes-open { opacity: 1; }

.umb--speaking .umb-mouth-smile,
.umb--listening .umb-mouth-smile,
.umb--thinking .umb-mouth-smile { opacity: 0; }
.umb--speaking .umb-mouth-talk { opacity: 1; }
.umb--listening .umb-mouth-o,
.umb--thinking .umb-mouth-o { opacity: 1; }

.umb--speaking .umb-chest-dot,
.umb--listening .umb-chest-dot,
.umb--thinking .umb-chest-dot { opacity: 0; }
.umb--speaking .umb-chest-bars { opacity: 1; }
.umb--listening .umb-chest-ring { opacity: 1; }
.umb--thinking .umb-chest-think { opacity: 1; }

/* ── Always ── */
.umb-float { animation: umb-float 3.6s ease-in-out infinite; }
.umb-shadow { animation: umb-shadow 3.6s ease-in-out infinite; }
.umb--still .umb-float,
.umb--still .umb-shadow { animation: none; }
.umb-eye { animation: umb-blink 4.6s infinite; }
.umb-antenna { animation: umb-glow 2.4s ease-in-out infinite; }
.umb-thruster { animation: umb-glow 1.8s ease-in-out infinite; }

/* ── Idle: arms sway a little ── */
.umb--idle .umb-arm--l { animation: umb-sway-l 4s ease-in-out infinite; }
.umb--idle .umb-arm--r { animation: umb-sway-r 4s ease-in-out infinite; }

/* ── Speaking: talks, nods and gestures with both hands ── */
.umb--speaking .umb-mouth-talk { animation: umb-talk 0.9s linear infinite; }
.umb--speaking .umb-bar { animation: umb-bar 0.7s ease-in-out infinite; }
.umb--speaking .umb-bar:nth-child(2) { animation-delay: -0.15s; }
.umb--speaking .umb-bar:nth-child(3) { animation-delay: -0.35s; }
.umb--speaking .umb-bar:nth-child(4) { animation-delay: -0.5s; }
.umb--speaking .umb-bar:nth-child(5) { animation-delay: -0.25s; }
.umb--speaking .umb-head { animation: umb-nod 1.6s ease-in-out infinite; }
.umb--speaking .umb-arm--r { animation: umb-explain-r 2.2s ease-in-out infinite; }
.umb--speaking .umb-fore--r { animation: umb-explain-fore 2.2s ease-in-out infinite; }
.umb--speaking .umb-arm--l { animation: umb-explain-l 2.8s ease-in-out infinite; }

/* ── Listening: leans in, ears pulse, hand up by the ear ── */
.umb--listening .umb-head { transform: rotate(-6deg); }
.umb--listening .umb-ear-ring { animation: umb-ring 1s ease-in-out infinite; }
.umb--listening .umb-ear--r .umb-ear-ring { animation-delay: 0.5s; }
.umb--listening .umb-chest-ring { animation: umb-ring 1.2s ease-in-out infinite; }
.umb--listening .umb-arm--l { transform: rotate(150deg); }
.umb--listening .umb-fore--l { transform: rotate(-115deg); }
.umb--listening .umb-antenna { animation-duration: 0.8s; }

/* ── Thinking: looks up, hand on chin ── */
.umb--thinking .umb-eyes { animation: umb-glance 1.8s ease-in-out infinite; }
.umb--thinking .umb-head { transform: rotate(5deg); }
.umb--thinking .umb-arm--r { transform: rotate(-30deg); }
.umb--thinking .umb-fore--r { transform: rotate(-120deg); }
.umb--thinking .umb-chest-think circle { animation: umb-dots 1.2s ease-in-out infinite; }
.umb--thinking .umb-chest-think circle:nth-child(2) { animation-delay: 0.2s; }
.umb--thinking .umb-chest-think circle:nth-child(3) { animation-delay: 0.4s; }

/* ── Pointing: arm out towards the answer, on its right ── */
.umb--pointing .umb-arm--r { transform: rotate(-95deg); }
.umb--pointing .umb-fore--r { transform: rotate(-8deg); }
.umb--pointing .umb-head { transform: rotate(4deg); }

/* ── Celebrate: both arms up, a little hop ── */
.umb--celebrate .umb-arm--l { transform: rotate(160deg); }
.umb--celebrate .umb-arm--r { transform: rotate(-160deg); }
.umb--celebrate .umb-float { animation: umb-hop 0.6s ease-in-out infinite; }

/* ── Wave hello ── */
.umb--wave.umb--idle .umb-arm--r { animation: umb-wave-arm 2.6s ease-in-out 0.2s 1 both; }
.umb--wave.umb--idle .umb-fore--r { animation: umb-wave-fore 2.6s ease-in-out 0.2s 1 both; }

@keyframes umb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes umb-shadow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(0.86); opacity: 0.2; } }
@keyframes umb-hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes umb-blink { 0%, 93%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.12); } }
@keyframes umb-glow { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
@keyframes umb-sway-l { 0%, 100% { transform: rotate(10deg); } 50% { transform: rotate(14deg); } }
@keyframes umb-sway-r { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(-14deg); } }
@keyframes umb-talk {
  0% { transform: scaleY(0.35); }
  15% { transform: scaleY(1.1); }
  30% { transform: scaleY(0.55); }
  45% { transform: scaleY(1.25); }
  60% { transform: scaleY(0.4); }
  75% { transform: scaleY(0.95); }
  90% { transform: scaleY(0.5); }
  100% { transform: scaleY(0.35); }
}
@keyframes umb-bar { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1.15); } }
@keyframes umb-nod { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(-3deg); } 70% { transform: rotate(2.5deg); } }
@keyframes umb-explain-r {
  0%, 100% { transform: rotate(-20deg); }
  35% { transform: rotate(-55deg); }
  65% { transform: rotate(-35deg); }
}
@keyframes umb-explain-fore {
  0%, 100% { transform: rotate(-40deg); }
  35% { transform: rotate(-75deg); }
  65% { transform: rotate(-55deg); }
}
@keyframes umb-explain-l {
  0%, 100% { transform: rotate(12deg); }
  50% { transform: rotate(28deg); }
}
@keyframes umb-ring { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.4; } }
@keyframes umb-glance { 0%, 100% { transform: translate(0, -4px); } 40% { transform: translate(-6px, -6px); } 70% { transform: translate(6px, -6px); } }
@keyframes umb-dots { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
@keyframes umb-wave-arm {
  0% { transform: rotate(-10deg); }
  15%, 85% { transform: rotate(-150deg); }
  100% { transform: rotate(-10deg); }
}
@keyframes umb-wave-fore {
  0%, 15% { transform: rotate(0deg); }
  25% { transform: rotate(-30deg); }
  35% { transform: rotate(15deg); }
  45% { transform: rotate(-30deg); }
  55% { transform: rotate(15deg); }
  65% { transform: rotate(-30deg); }
  75%, 100% { transform: rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .umb *,
  .umb-float,
  .umb-arm,
  .umb-fore,
  .umb-head {
    animation: none !important;
    transition: opacity 0.15s linear !important;
  }
}
</style>
