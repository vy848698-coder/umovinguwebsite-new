<template>
  <!-- The sections UMU covers, as a route: the section the seller is on in
       the middle, two stops either side (one on a phone), joined by a line
       that fills in as sections are finished. Ahead of the seller the stops
       say Next and Then, so they can see where finishing this one leads.
       Sections outside the window collapse into "+3" stubs at the ends;
       those, or "See all", show every section in the same row (scrolling
       sideways when there are many), so nothing ever covers the page.
       Any stop can be tapped, in any order. -->
  <nav class="usr" :class="{ 'is-all': showAll }" :aria-label="ariaLabel">
    <div class="usr-head">
      <p class="usr-label">{{ heading }}</p>
      <div class="usr-head-end">
        <p class="usr-count">
          Section {{ curIndex + 1 }} of {{ sections.length }}
          <span class="usr-count-sep" aria-hidden="true">·</span>
          {{ doneCount }} complete
        </p>
        <button
          v-if="hasHidden || showAll"
          type="button"
          class="usr-all"
          :aria-pressed="showAll"
          @click="setAll(!showAll)"
        >
          <Icon :name="showAll ? 'i-lucide-chevrons-right-left' : 'i-lucide-chevrons-left-right'" class="usr-all-ic" />
          {{ showAll ? 'Show fewer' : `See all ${sections.length}` }}
        </button>
      </div>
    </div>

    <div ref="trackEl" class="usr-track">
      <ol class="usr-stops">
        <li v-if="!showAll && hiddenBefore" class="usr-stub is-before">
          <button
            type="button"
            class="usr-stub-btn"
            :aria-label="`Show ${hiddenBefore} earlier ${hiddenBefore === 1 ? 'section' : 'sections'}`"
            @click="setAll(true)"
          >
            <span class="usr-stub-node">+{{ hiddenBefore }}</span>
            <span class="usr-stub-text">earlier</span>
          </button>
        </li>

        <li
          v-for="st in stops"
          :key="st.s.id"
          class="usr-stop"
          :class="[
            `is-${st.role}`,
            { 'is-done': st.s.done, 'line-in-done': st.prevDone, 'is-first': st.first, 'is-last': st.last },
          ]"
        >
          <button
            type="button"
            class="usr-btn"
            :disabled="disabled"
            :aria-current="st.role === 'current' ? 'step' : undefined"
            :aria-label="`${kickerText(st)}: ${st.s.title}, ${metaFor(st)}`"
            @click="pick(st.s.id)"
          >
            <span class="usr-node">
              <svg class="usr-ring" viewBox="0 0 44 44" aria-hidden="true">
                <circle class="usr-ring-bg" cx="22" cy="22" r="20" />
                <circle
                  v-if="pctOf(st.s) > 0"
                  class="usr-ring-fg"
                  cx="22"
                  cy="22"
                  r="20"
                  :stroke-dasharray="`${(RING * pctOf(st.s)) / 100} ${RING}`"
                />
              </svg>
              <OPIcon :name="st.s.key" class="usr-node-ic" />
              <span v-if="st.s.done" class="usr-node-tick" aria-hidden="true">
                <Icon name="i-lucide-check" />
              </span>
            </span>
            <span class="usr-kicker">
              <Icon v-if="KICKER_ICON[st.role]" :name="KICKER_ICON[st.role]" class="usr-kicker-ic" />
              {{ kickerText(st) }}
            </span>
            <span class="usr-title">{{ st.s.title }}</span>
            <span class="usr-meta">{{ metaFor(st) }}</span>
          </button>
        </li>

        <li v-if="!showAll && hiddenAfter" class="usr-stub is-after">
          <button
            type="button"
            class="usr-stub-btn"
            :aria-label="`Show ${hiddenAfter} more ${hiddenAfter === 1 ? 'section' : 'sections'}`"
            @click="setAll(true)"
          >
            <span class="usr-stub-node">+{{ hiddenAfter }}</span>
            <span class="usr-stub-text">more</span>
          </button>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
import OPIcon from '~/components/ui/OPIcon.vue'

export interface RailSection {
  id: string
  key: string
  title: string
  // "4 of 7 answered", "57% done", "Complete"
  meta: string
  done: boolean
  // Has at least one answer
  started?: boolean
  // Questions still to answer, when known
  left?: number | null
  // How far through the section is, 0 to 100, for the ring round its icon
  pct?: number
}

// current: the section open now. next / then: the first two unfinished
// sections after it, in passport order. todo: an earlier section with
// questions still left. step: any other stop (finished, or further ahead).
type Role = 'current' | 'next' | 'then' | 'todo' | 'step'

const props = withDefaults(
  defineProps<{
    sections: RailSection[]
    currentId: string
    heading?: string
    ariaLabel?: string
    // "You're here" in the assistant, "Pick up here" on the passport page
    currentKicker?: string
    disabled?: boolean
  }>(),
  {
    heading: 'Sections',
    ariaLabel: 'Sections UMU can help with',
    currentKicker: "You're here",
    disabled: false,
  },
)

const emit = defineEmits<{ pick: [id: string] }>()

const RING = 2 * Math.PI * 20

const curIndex = computed(() => {
  const i = props.sections.findIndex((s) => s.id === props.currentId)
  return i < 0 ? 0 : i
})
const doneCount = computed(() => props.sections.filter((s) => s.done).length)

// Two stops either side of the current one, one on a phone. At either end
// of the list the window slides so it still shows five (or three).
const narrow = ref(false)
let mq: MediaQueryList | null = null
const onMq = () => (narrow.value = !!mq?.matches)
onMounted(() => {
  mq = window.matchMedia('(max-width: 640px)')
  onMq()
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => mq?.removeEventListener('change', onMq))

const showAll = ref(false)

const range = computed(() => {
  const n = props.sections.length
  if (showAll.value) return [0, n - 1] as const
  const radius = narrow.value ? 1 : 2
  const size = Math.min(n, radius * 2 + 1)
  const start = Math.max(0, Math.min(curIndex.value - radius, n - size))
  return [start, start + size - 1] as const
})
const hiddenBefore = computed(() => range.value[0])
const hiddenAfter = computed(() => props.sections.length - 1 - range.value[1])
const hasHidden = computed(() => hiddenBefore.value + hiddenAfter.value > 0)

const roles = computed(() => {
  const list = props.sections
  const i = curIndex.value
  const out: Role[] = list.map((s, j) => (j < i && !s.done ? 'todo' : 'step'))
  out[i] = 'current'
  const ahead = list.map((s, j) => j).filter((j) => j > i && !list[j].done)
  if (ahead[0] !== undefined) out[ahead[0]] = 'next'
  if (ahead[1] !== undefined) out[ahead[1]] = 'then'
  return out
})

const stops = computed(() => {
  const [a, b] = range.value
  return props.sections.slice(a, b + 1).map((s, k) => {
    const j = a + k
    return {
      s,
      n: j + 1,
      role: roles.value[j],
      prevDone: j > 0 && props.sections[j - 1].done,
      // The line runs off the edge only when more sections sit beyond it
      first: j === 0,
      last: j === props.sections.length - 1,
    }
  })
})
type Stop = (typeof stops.value)[number]

const KICKER_ICON: Partial<Record<Role, string>> = {
  current: 'i-lucide-map-pin',
  next: 'i-lucide-arrow-right',
  todo: 'i-lucide-history',
}

function kickerText(st: Stop) {
  if (st.role === 'current') return props.currentKicker
  if (st.role === 'next') return 'Next'
  if (st.role === 'then') return 'Then'
  if (st.role === 'todo') return 'Left to do'
  return `Step ${st.n}`
}

function metaFor(st: Stop) {
  const { s, role } = st
  if (role === 'todo' && s.left) return `${s.left} ${s.left === 1 ? 'question' : 'questions'} left`
  return s.meta || (s.done ? 'Complete' : 'Not started')
}

function pctOf(s: RailSection) {
  if (s.done) return 100
  return Math.max(0, Math.min(100, Math.round(s.pct || 0)))
}

// Opening every section scrolls the row so the current one sits in the
// middle; picking a section goes back to the short route around it.
const trackEl = ref<HTMLElement | null>(null)
async function setAll(on: boolean) {
  showAll.value = on
  if (!on) return
  await nextTick()
  const track = trackEl.value
  const cur = track?.querySelector<HTMLElement>('.usr-stop.is-current')
  if (!track || !cur) return
  track.scrollLeft = Math.max(0, cur.offsetLeft - (track.clientWidth - cur.offsetWidth) / 2)
}

function pick(id: string) {
  showAll.value = false
  emit('pick', id)
}
</script>

<style scoped>
/* Sits on a dark card (the passport's #231d45 card, the assistant's navy
   stage), so it is drawn in white at different strengths. The accent
   follows the page: --usr-accent. */
.usr {
  --usr-a: var(--usr-accent, #2fd0c6);
  --usr-ink: #0e2840;
  --usr-line: rgba(255, 255, 255, 0.16);
  /* Node size, and where its centre sits from the top of a stop */
  --usr-node: 46px;
  --usr-node-y: calc(10px + var(--usr-node) / 2);
  min-width: 0;
}

.usr-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.usr-label {
  margin: 0;
  min-width: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.78);
}
.usr-head-end {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.usr-count {
  margin: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
}
.usr-count-sep { margin: 0 4px; }

.usr-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.usr-all:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.4); }
.usr-all[aria-pressed='true'] { border-color: var(--usr-a); }
.usr-all-ic { width: 15px; height: 15px; }

/* ── The route ── */
.usr-track {
  min-width: 0;
  /* Every section can be wider than the card: it scrolls sideways */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
.usr-stops {
  display: flex;
  margin: 0;
  padding: 0 0 2px;
  list-style: none;
}

.usr-stop,
.usr-stub {
  position: relative;
  display: flex;
}
.usr-stop { flex: 1 1 0; min-width: 0; }
.usr.is-all .usr-stop { min-width: 118px; }
.usr-stub { flex: 0 0 58px; }

/* The line: each stop draws the half towards its neighbours, stopping
   short of its own node, so it needs no background to hide behind */
.usr-stop::before,
.usr-stop::after,
.usr-stub::before,
.usr-stub::after {
  content: '';
  position: absolute;
  top: calc(var(--usr-node-y) - 1px);
  height: 2px;
  border-radius: 2px;
  background: var(--usr-line);
}
.usr-stop::before { left: 0; right: calc(50% + var(--usr-node) / 2 + 6px); }
.usr-stop::after { left: calc(50% + var(--usr-node) / 2 + 6px); right: 0; }
.usr-stop.is-first::before,
.usr-stop.is-last::after,
.usr-stub.is-before::before,
.usr-stub.is-after::after { display: none; }
.usr-stub::before { left: 0; right: calc(50% + 16px); }
.usr-stub::after { left: calc(50% + 16px); right: 0; }
/* Into the stubs the line is dashed: there is more route beyond */
.usr-stub.is-before::after,
.usr-stub.is-after::before {
  background: repeating-linear-gradient(90deg, var(--usr-line) 0 5px, transparent 5px 9px);
}
/* Finished stretches of the route fill with the accent */
.usr-stop.is-done::after,
.usr-stop.line-in-done::before { background: var(--usr-a); }

.usr-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px 10px;
  border: 0;
  border-radius: 18px;
  background: transparent;
  color: #fff;
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  transition: background 0.18s ease;
}
.usr-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.06); }
.usr-btn:disabled { cursor: default; }
.usr-btn:focus-visible,
.usr-stub-btn:focus-visible,
.usr-all:focus-visible {
  outline: 3px solid #fde68a;
  outline-offset: 2px;
}
/* Where the seller is: a white tile the line runs into */
.usr-stop.is-current .usr-btn,
.usr-stop.is-current .usr-btn:hover:not(:disabled) {
  background: #fff;
  color: var(--usr-ink);
  box-shadow: 0 10px 26px rgba(5, 10, 30, 0.28);
}

/* The node: the section's icon inside a ring that fills as it is answered */
.usr-node {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--usr-node);
  height: var(--usr-node);
  flex-shrink: 0;
}
.usr-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.usr-ring circle { fill: none; stroke-width: 3; }
.usr-ring-bg { stroke: rgba(255, 255, 255, 0.18); }
.usr-ring-fg {
  stroke: var(--usr-a);
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}
.usr-stop.is-current .usr-ring-bg { stroke: #e2e8f0; }
.usr-stop.is-current .usr-ring-fg { stroke: #00a39b; }
.usr-node-ic { width: 28px; height: 28px; }
.usr-node-tick {
  position: absolute;
  right: -3px;
  bottom: -3px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--usr-a);
  color: var(--usr-ink);
  font-size: 12px;
  box-shadow: 0 0 0 2px var(--usr-tick-gap, #1a1640);
}
.usr-stop.is-current .usr-node-tick { box-shadow: 0 0 0 2px #fff; }

.usr-kicker {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.5);
}
.usr-kicker-ic { width: 12px; height: 12px; }
.usr-stop.is-current .usr-kicker { color: #00857f; }
.usr-stop.is-next .usr-kicker { color: var(--usr-a); }
.usr-stop.is-then .usr-kicker { color: rgba(255, 255, 255, 0.78); }
.usr-stop.is-todo .usr-kicker { color: #fde68a; }

.usr-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 100%;
  margin-top: 3px;
  font-size: 13.5px;
  font-weight: 800;
  line-height: 1.25;
  overflow-wrap: anywhere;
}
.usr-meta {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}
.usr-stop.is-current .usr-meta { color: #475569; }
.usr-stop.is-done:not(.is-current) .usr-meta { color: var(--usr-a); }

/* "+3 more": the sections outside the window */
.usr-stub-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: calc(var(--usr-node-y) - 16px) 0 10px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-family: inherit;
  cursor: pointer;
}
.usr-stub-node {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1.5px dashed rgba(255, 255, 255, 0.35);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.usr-stub-text { font-size: 11px; font-weight: 700; }
.usr-stub-btn:hover .usr-stub-node { border-color: var(--usr-a); background: rgba(255, 255, 255, 0.06); }

@media (prefers-reduced-motion: reduce) {
  .usr-btn,
  .usr-ring-fg,
  .usr-stub-node { transition: none; }
}

/* Phone: one stop either side, smaller nodes, the heading above the count */
@media (max-width: 640px) {
  .usr { --usr-node: 40px; }
  .usr-head { flex-direction: column; align-items: flex-start; gap: 6px; }
  .usr-head-end { width: 100%; justify-content: space-between; }
  .usr-stub { flex-basis: 44px; }
  .usr-btn { padding: 10px 4px; }
  .usr-node-ic { width: 24px; height: 24px; }
  .usr-title { font-size: 12.5px; }
  .usr-meta { font-size: 11px; }
  .usr-kicker { font-size: 9.5px; letter-spacing: 0.05em; }
  .usr.is-all .usr-stop { min-width: 104px; }
}
</style>
