<template>
  <div class="pref-page">
    <div class="pf-body">
      <!-- ── Left context sidebar ── -->
      <aside class="pf-side">
        <div class="pf-side-inner">
          <span class="pf-welcome">
            <span class="pf-welcome-dot" />{{ phase === 'role' ? 'WELCOME TO UMOVINGU' : eyebrowLabel.toUpperCase() }}
          </span>

          <h2 class="pf-side-title">
            {{ phase === 'role' ? "We'll set up the right journey for you — takes 30 seconds." : headerSub }}
          </h2>

          <!-- Step tracker -->
          <ol class="pf-steps">
            <li class="pf-step" :class="{ active: phase === 'role', done: phase === 'detail' }">
              <span class="pf-step-num">
                <svg v-if="phase === 'detail'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                <template v-else>1</template>
              </span>
              <span class="pf-step-info">
                <span class="pf-step-title">What do you want to do?</span>
                <span class="pf-step-sub">{{ phase === 'detail' && selectedRoleLabel ? selectedRoleLabel : 'Choose your journey' }}</span>
              </span>
            </li>
            <li class="pf-step" :class="{ active: phase === 'detail' }">
              <span class="pf-step-num">2</span>
              <span class="pf-step-info">
                <span class="pf-step-title">Your move</span>
                <span class="pf-step-sub">{{ phase === 'detail' ? moveSubLabel : 'Tell us about both sides' }}</span>
              </span>
            </li>
          </ol>

          <!-- ── Role phase: info + trust cards ── -->
          <template v-if="phase === 'role'">
            <div class="pf-info">
              <span class="pf-info-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <p>
                UK consumers lose <strong>£900m a year</strong> on aborted property
                transactions. A Passport-verified sale is <strong>12× faster</strong>
                and far less likely to fall through.
              </p>
            </div>

            <div class="pf-stats">
              <div v-for="t in trust" :key="t.title" class="pf-stat">
                <span class="pf-stat-ic"><span v-html="t.svg" /></span>
                <span class="pf-stat-info">
                  <span class="pf-stat-title">{{ t.title }}</span>
                  <span class="pf-stat-sub">{{ t.sub }}</span>
                </span>
              </div>
            </div>
          </template>

          <!-- ── Detail phase: on-this-page nav + answered count ── -->
          <template v-else>
            <div v-if="pageSections.length" class="pf-onpage">
              <span class="pf-onpage-label">On this page</span>
              <button
                v-for="sec in pageSections"
                :key="sec.anchor"
                type="button"
                class="pf-onpage-item"
                :class="`tint-${sec.tint}`"
                @click="scrollToSection(sec.anchor)"
              >
                <span class="pf-onpage-ic"><span v-html="sec.icon" /></span>
                {{ sec.title }}
              </button>
            </div>

            <div class="pf-answered">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 16v-4" /><path d="M12 8h.01" />
              </svg>
              <span><strong>{{ answeredCount }} of {{ totalQuestions }}</strong> answered · all optional</span>
            </div>
          </template>
        </div>
      </aside>

      <!-- ── Right main panel ── -->
      <main class="pf-main">
        <div class="pf-main-inner" :class="{ 'is-detail': phase === 'detail' }">
          <!-- Top bar -->
          <div class="pf-top">
            <button
              class="pf-back"
              aria-label="Back"
              @click="phase === 'detail' ? (phase = 'role') : $router.back()"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span class="pf-top-step">{{ phase === 'role' ? 'STEP 1 OF 2' : 'STEP 2 OF 2 · YOUR MOVE' }}</span>
            <div class="pf-top-progress">
              <div class="pf-top-progress-bar" :style="{ width: phase === 'detail' ? '100%' : '50%' }" />
            </div>
            <button class="pf-skip" @click="navigateTo('/')">Skip</button>
          </div>

          <h1 class="pf-title">{{ headerTitle }}</h1>
          <p class="pf-sub">{{ headerSub }}</p>

          <!-- ── ROLE SELECTION ── -->
          <template v-if="phase === 'role'">
            <div class="pf-roles">
              <button
                v-for="r in roles"
                :key="r.key"
                type="button"
                class="pf-role"
                :class="[`tint-${r.key}`, { selected: selectedRole === r.key }]"
                @click="selectRole(r.key)"
              >
                <span class="pf-role-ic"><span v-html="r.svg" /></span>
                <span class="pf-role-info">
                  <span class="pf-role-title">{{ r.label }}</span>
                  <span class="pf-role-desc">{{ r.desc }}</span>
                </span>
                <span class="pf-radio" :class="{ on: selectedRole === r.key }">
                  <span class="pf-radio-dot" />
                </span>
              </button>
            </div>
          </template>

          <!-- ── DETAIL SCREEN ── -->
          <template v-else>
            <div class="pf-detail" ref="scrollRef">
              <section
                v-for="sec in sections"
                :key="sec.anchor"
                :id="sec.anchor"
                class="pf-card"
              >
                <div v-if="sec.title" class="pf-card-head">
                  <span class="pf-card-ic" :class="`tint-${sec.tint}`"><span v-html="sec.icon" /></span>
                  <h3>{{ sec.title }}</h3>
                </div>

                <div class="pf-card-body">
                  <template v-for="q in sec.questions" :key="q.id">
                    <!-- Text input -->
                    <div v-if="q.type === 'text'" class="pref-section">
                      <div class="pref-label">{{ q.label }}</div>
                      <div class="pref-input">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="7" />
                          <path d="m20 20-3.5-3.5" />
                        </svg>
                        <input
                          :value="(a as any)[q.id] || ''"
                          type="text"
                          :placeholder="q.placeholder"
                          @input="(e: any) => ((a as any)[q.id] = e.target.value)"
                        />
                      </div>
                    </div>

                    <!-- Locations: chip-autocomplete -->
                    <div v-else-if="q.type === 'locations'" class="pref-section">
                      <div class="pref-label">{{ q.label }}</div>
                      <div v-if="q.hint" class="pref-help">{{ q.hint }}</div>
                      <div class="pref-input">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <input
                          :value="locInputs[q.id] || ''"
                          type="text"
                          :placeholder="q.placeholder"
                          autocomplete="off"
                          @input="(e: any) => onLocInput(q.id, e.target.value)"
                          @keydown.enter.prevent="commitLocFreeText(q.id)"
                          @keydown.backspace="onLocBackspace(q.id, $event)"
                        />
                      </div>
                      <div
                        v-if="locOpen[q.id] && locSuggestions[q.id]?.length"
                        class="loc-drop"
                      >
                        <div
                          v-for="(s, idx) in locSuggestions[q.id]"
                          :key="`${s.kind}-${s.value}-${idx}`"
                          class="loc-drop-item"
                          @mousedown.prevent="addLocation(q.id, s.value)"
                        >
                          <span class="loc-drop-ic">{{
                            s.kind === 'postcode' ? '📮' : '🏙️'
                          }}</span>
                          <span class="loc-drop-text">
                            <strong>{{ s.value }}</strong>
                            <span v-if="s.sub" class="loc-drop-sub">{{ s.sub }}</span>
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="((a as any)[q.id] as string[]).length"
                        class="chip-row"
                        style="margin-top: 10px"
                      >
                        <button
                          v-for="(loc, i) in (a as any)[q.id] as string[]"
                          :key="`${q.id}-${loc}-${i}`"
                          type="button"
                          class="chip selected"
                          @click="removeLocation(q.id, i)"
                        >
                          {{ loc }}<span style="margin-left: 4px; opacity: 0.8">×</span>
                        </button>
                      </div>
                    </div>

                    <!-- Chips -->
                    <div v-else-if="q.type === 'chips'" class="pref-section">
                      <div class="pref-label">
                        {{ q.label
                        }}<span v-if="q.multiSelect" class="multi-hint">
                          · pick all that apply</span
                        >
                      </div>
                      <div v-if="q.hint" class="pref-help">{{ q.hint }}</div>
                      <div class="chip-row">
                        <button
                          v-for="opt in q.opts"
                          :key="opt.v"
                          type="button"
                          class="chip"
                          :class="{
                            selected: isSelected(q.id, opt.v, !!q.multiSelect),
                            dashed: !!opt.isExpand,
                          }"
                          @click="
                            pick(
                              q.id,
                              opt.v,
                              !!q.multiSelect,
                              opt.expandKey,
                              !!opt.isExpand,
                            )
                          "
                        >
                          <span v-if="opt.icon" class="chip-emoji">{{ opt.icon }}</span
                          >{{ opt.v }}
                        </button>
                        <template v-if="expanded[q.id] && q.expandOpts">
                          <button
                            v-for="opt in q.expandOpts"
                            :key="opt.v"
                            type="button"
                            class="chip"
                            :class="{ selected: isSelected(q.id, opt.v, !!q.multiSelect) }"
                            @click="pick(q.id, opt.v, !!q.multiSelect)"
                          >
                            <span v-if="opt.icon" class="chip-emoji">{{ opt.icon }}</span
                            >{{ opt.v }}
                          </button>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </section>
            </div>
          </template>

          <div class="pf-divider" />

          <!-- ── Actions bar ── -->
          <div class="pf-actions">
            <div class="pf-actions-meta">
              <span v-if="phase === 'role'">
                <strong>{{ selectedRole ? '1' : '0' }} of 4</strong> options chosen
              </span>
              <span v-else>
                <strong>{{ answeredCount }} of {{ totalQuestions }}</strong>
                answered · all optional
              </span>
            </div>
            <div class="pf-actions-right">
              <span class="pf-actions-step">{{ phase === 'role' ? 'Step 1 / 2' : 'Step 2 / 2' }}</span>
              <button
                v-if="phase === 'role'"
                class="pf-cta"
                :class="{ disabled: !selectedRole }"
                :disabled="!selectedRole"
                @click="advanceToDetail"
              >
                Continue
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button
                v-else
                class="pf-cta"
                :disabled="isLoading"
                @click="save"
              >
                <span v-if="isLoading" class="spinner" />
                {{ detailCtaLabel }}
                <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({ title: 'Preferences - UmovingU', middleware: 'auth' })

const config = useRuntimeConfig()
const route = useRoute()
const scrollRef = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const phase = ref<'role' | 'detail'>('role')
const selectedRole = ref('')

// Preview / deep-link shortcut so the flow can be reviewed without clicking
// through step 1. e.g. /onboarding/preferences?step=2&role=both jumps straight
// to step 2 of the buying+selling journey. Harmless in normal use (only
// activates when these query params are present).
{
  const qRole = route.query.role
  const qStep = route.query.step
  if (typeof qRole === 'string' && ['buy', 'sell', 'landlord', 'both'].includes(qRole)) {
    selectedRole.value = qRole
  }
  if (qStep === '2' && selectedRole.value) {
    phase.value = 'detail'
  }
}

// ── Location chip autocomplete ───────────────────────────────────────────
type LocSuggestion = { kind: 'postcode' | 'place'; value: string; sub?: string }
const locInputs = reactive<Record<string, string>>({})
const locSuggestions = reactive<Record<string, LocSuggestion[]>>({})
const locOpen = reactive<Record<string, boolean>>({})
const locTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function onLocInput(qid: string, val: string) {
  locInputs[qid] = val
  if (locTimers[qid]) clearTimeout(locTimers[qid] as ReturnType<typeof setTimeout>)
  const trimmed = val.trim()
  if (trimmed.length < 2) {
    locSuggestions[qid] = []
    locOpen[qid] = false
    return
  }
  locTimers[qid] = setTimeout(() => fetchLocSuggestions(qid, trimmed), 250)
}

async function fetchLocSuggestions(qid: string, q: string) {
  // Hit postcodes.io for postcode prefix completions and place lookups.
  // Postcodes.io is free, no auth, supports CORS.
  const looksLikePostcode = /^[A-Za-z]{1,2}\d/.test(q)
  const out: LocSuggestion[] = []
  try {
    if (looksLikePostcode) {
      const r: any = await $fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(q)}/autocomplete`,
      )
      const list: string[] = r?.result ?? []
      for (const pc of list.slice(0, 6)) {
        out.push({ kind: 'postcode', value: pc.toUpperCase() })
      }
    }
    // Always also try place suggestions (cities / towns / areas)
    const places: any = await $fetch(
      `https://api.postcodes.io/places?q=${encodeURIComponent(q)}&limit=6`,
    )
    const placeList: any[] = places?.result ?? []
    for (const p of placeList) {
      const name = p?.name_1 || p?.name
      if (!name) continue
      const sub = p?.county_unitary || p?.region || p?.country || ''
      out.push({ kind: 'place', value: name, sub: sub || undefined })
    }
  } catch {
    // Network errors → just leave whatever we collected.
  }
  // Dedup by value
  const seen = new Set<string>()
  locSuggestions[qid] = out.filter((s) => {
    const k = s.value.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  }).slice(0, 8)
  locOpen[qid] = (locSuggestions[qid]?.length ?? 0) > 0
}

function addLocation(qid: string, value: string) {
  const arr = (a as any)[qid] as string[]
  const v = value.trim()
  if (!v) return
  if (!arr.some((x) => x.toLowerCase() === v.toLowerCase())) arr.push(v)
  locInputs[qid] = ''
  locSuggestions[qid] = []
  locOpen[qid] = false
}

function removeLocation(qid: string, idx: number) {
  const arr = (a as any)[qid] as string[]
  arr.splice(idx, 1)
}

function commitLocFreeText(qid: string) {
  const v = (locInputs[qid] || '').trim()
  if (!v) return
  // Prefer the first suggestion if the user pressed Enter while the dropdown
  // is open — feels more responsive than committing the raw text.
  const first = locSuggestions[qid]?.[0]?.value
  addLocation(qid, first || v)
}

function onLocBackspace(qid: string, e: KeyboardEvent) {
  // If the input is empty and the user backspaces, drop the last chip.
  if ((locInputs[qid] || '').length > 0) return
  const arr = (a as any)[qid] as string[]
  if (arr.length === 0) return
  e.preventDefault()
  arr.pop()
}

// ── Answers ───────────────────────────────────────────────────────────────

const a = reactive<Record<string, any>>({
  // Buy
  buyLocation: [] as string[],
  buyBudget: '',
  buyBedrooms: '',
  buyPropertyType: '',
  buyTenure: '',
  buyMustHaves: [],
  buyerType: '',
  energyImportance: '',
  passportRequired: '',
  // Sell
  sellLocation: [] as string[],
  sellPropertyType: '',
  sellBedrooms: '',
  sellTenure: '',
  sellChain: '',
  sellValue: '',
  sellTimeline: '',
  // Landlord
  portfolio: '',
  management: '',
  strategy: [],
  landlordBudget: '',
  financing: '',
  targetYield: '',
  workAppetite: '',
  letType: '',
  llocation: '',
  landlordMustHaves: [],
})

const expanded = reactive<Record<string, boolean>>({})

// ── Static data ───────────────────────────────────────────────────────────

// Inline SVGs render through v-html. Stored as one-liners so the template
// stays readable.
const roles = [
  {
    key: 'buy',
    iconClass: '', // default teal
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    label: "I'm looking to buy",
    desc: 'Search properties, check risks, find your home',
  },
  {
    key: 'sell',
    iconClass: 'gold',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    label: "I'm selling my home",
    desc: 'Build your Passport, get verified, move faster',
  },
  {
    key: 'landlord',
    iconClass: 'navy',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 8.4-8.4"/><path d="m17 5 3 3"/><path d="m14 8 3 3"/></svg>',
    label: "I'm a landlord",
    desc: 'Manage compliance, certs & tenant safety in one place',
  },
  {
    key: 'both',
    iconClass: '',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
    label: 'Selling and buying',
    desc: "We'll set up both sides of your move",
  },
]
const trust = [
  {
    title: 'Your data is yours',
    sub: 'Never sold or shared',
    gold: false,
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  },
  {
    title: 'Takes 2 mins',
    sub: 'Save & continue any time',
    gold: true,
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>',
  },
  {
    title: '12× faster',
    sub: 'to exchange than average',
    gold: true,
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M17 4H7v6a5 5 0 1 0 10 0V4z"/><path d="M17 4h3v2a3 3 0 0 1-3 3"/><path d="M7 4H4v2a3 3 0 0 0 3 3"/></svg>',
  },
]

// ── Question definitions ──────────────────────────────────────────────────

interface Opt {
  v: string
  icon?: string
  expandKey?: string
  isExpand?: boolean
}
interface Question {
  id: string
  type: 'heading' | 'text' | 'chips' | 'locations'
  label?: string
  hint?: string
  multiSelect?: boolean
  opts?: Opt[]
  expandOpts?: Opt[]
  placeholder?: string
}

const H = (label: string): Question => ({
  id: `_h_${label}`,
  type: 'heading',
  label,
})

const buyQuestions: Question[] = [
  {
    id: 'buyLocation',
    type: 'locations',
    label: 'WHERE ARE YOU LOOKING?',
    placeholder: 'Add a city, area or postcode…',
    hint: 'Add as many as you like — we\'ll search all of them.',
  },
  {
    id: 'buyBudget',
    type: 'chips',
    label: 'BUDGET',
    opts: [
      { v: 'Under £200k' },
      { v: '£200k–£350k' },
      { v: '£350k–£500k' },
      { v: '£500k–£750k' },
      { v: '£750k–£1m' },
      { v: '£1m+', expandKey: 'buyBudget' },
    ],
    expandOpts: [
      { v: '£1m–£2m' },
      { v: '£2m–£5m' },
      { v: '£5m–£10m' },
      { v: '£10m–£20m' },
      { v: '£20m–£30m' },
      { v: '£30m+' },
    ],
  },
  {
    id: 'buyBedrooms',
    type: 'chips',
    label: 'MINIMUM BEDROOMS',
    opts: [
      { v: 'Studio', icon: '🛏' },
      { v: '1 bed', icon: '🛏' },
      { v: '2 bed', icon: '🛏' },
      { v: '3 bed', icon: '🛏' },
      { v: '4 bed', icon: '🛏' },
      { v: '5 bed+', icon: '🛏', expandKey: 'buyBedrooms' },
    ],
    expandOpts: [
      { v: '5 bed', icon: '🛏' },
      { v: '6 bed', icon: '🛏' },
      { v: '7 bed', icon: '🛏' },
      { v: '8 bed', icon: '🛏' },
      { v: '9 bed', icon: '🛏' },
      { v: '10 bed+', icon: '🛏' },
    ],
  },
  {
    id: 'buyPropertyType',
    type: 'chips',
    label: 'PROPERTY TYPE',
    opts: [
      { v: 'House', icon: '🏠' },
      { v: 'Flat', icon: '🏢' },
      { v: 'Bungalow', icon: '🏡' },
      { v: 'Any' },
      { v: 'Other…', isExpand: true, expandKey: 'buyPropertyType' },
    ],
    expandOpts: [
      { v: 'Land/plot', icon: '🌳' },
      { v: 'Commercial', icon: '🏪' },
      { v: 'Mixed use', icon: '🏬' },
      { v: 'Park home', icon: '🚐' },
    ],
  },
  {
    id: 'buyTenure',
    type: 'chips',
    label: 'TENURE PREFERENCE',
    hint: 'Leasehold properties carry extra risk — we surface this in every listing',
    opts: [{ v: 'Freehold' }, { v: 'Leasehold' }, { v: 'Either' }],
  },
  {
    id: 'buyMustHaves',
    type: 'chips',
    label: 'MUST-HAVES',
    multiSelect: true,
    opts: [
      { v: 'Garden', icon: '🌿' },
      { v: 'Parking', icon: '🚗' },
      { v: 'Chain-free', icon: '⛓️' },
      { v: 'New build', icon: '🏗️' },
      { v: 'EPC A–C', icon: '⚡' },
      { v: 'More…', isExpand: true, expandKey: 'buyMustHaves' },
    ],
    expandOpts: [
      { v: 'Annexe', icon: '🏡' },
      { v: 'Rural/countryside', icon: '🌾' },
      { v: 'Sea view', icon: '🌊' },
      { v: 'Listed building', icon: '🏛' },
      { v: 'Swimming pool', icon: '🏊' },
    ],
  },
  {
    id: 'buyerType',
    type: 'chips',
    label: 'YOU ARE A…',
    opts: [
      { v: 'First-time buyer' },
      { v: 'Moving up' },
      { v: 'Cash buyer' },
      { v: 'Investor' },
    ],
  },
  {
    id: 'energyImportance',
    type: 'chips',
    label: 'HOW IMPORTANT IS ENERGY EFFICIENCY?',
    hint: 'Affects HomeScore weighting and running cost estimates',
    opts: [
      { v: 'Very — low bills matter' },
      { v: 'Somewhat' },
      { v: 'Not a priority' },
    ],
  },
]

const passportQuestion: Question = {
  id: 'passportRequired',
  type: 'chips',
  label: 'WOULD YOU BUY WITHOUT A PROPERTY PASSPORT?',
  hint: 'Helps us calibrate how much we flag unverified listings',
  opts: [
    { v: 'No — I need one' },
    { v: 'Depends on price' },
    { v: 'Yes, if the deal is right' },
  ],
}

const sellQuestions: Question[] = [
  {
    id: 'sellLocation',
    type: 'locations',
    label: 'WHERE IS IT?',
    placeholder: 'Add the town, city or postcode…',
    hint: 'You can add a postcode and the town it sits in.',
  },
  {
    id: 'sellPropertyType',
    type: 'chips',
    label: 'PROPERTY TYPE',
    opts: [
      { v: 'Detached', icon: '🏠' },
      { v: 'Semi-detached', icon: '🏘' },
      { v: 'Terraced', icon: '🏚' },
      { v: 'Flat', icon: '🏢' },
      { v: 'Bungalow', icon: '🏡' },
      { v: 'Other…', isExpand: true, expandKey: 'sellPropertyType' },
    ],
    expandOpts: [
      { v: 'Land/plot', icon: '🌳' },
      { v: 'Commercial', icon: '🏪' },
      { v: 'Mixed use', icon: '🏬' },
      { v: 'Park home', icon: '🚐' },
    ],
  },
  {
    id: 'sellBedrooms',
    type: 'chips',
    label: 'BEDROOMS',
    opts: [
      { v: '1', icon: '🛏' },
      { v: '2', icon: '🛏' },
      { v: '3', icon: '🛏' },
      { v: '4', icon: '🛏' },
      { v: '5+', icon: '🛏', expandKey: 'sellBedrooms' },
    ],
    expandOpts: [
      { v: '5', icon: '🛏' },
      { v: '6', icon: '🛏' },
      { v: '7', icon: '🛏' },
      { v: '8+', icon: '🛏' },
    ],
  },
  {
    id: 'sellTenure',
    type: 'chips',
    label: 'TENURE',
    opts: [{ v: 'Freehold' }, { v: 'Leasehold' }],
  },
  {
    id: 'sellChain',
    type: 'chips',
    label: 'CHAIN POSITION',
    hint: 'Buyers pay more for chain-free — this appears on your Passport',
    opts: [
      { v: 'Chain-free', icon: '⛓️' },
      { v: 'Buying onward' },
      { v: 'Part-exchange' },
      { v: 'Not sure yet' },
    ],
  },
  {
    id: 'sellValue',
    type: 'chips',
    label: 'ESTIMATED VALUE',
    opts: [
      { v: 'Under £200k' },
      { v: '£200k–£350k' },
      { v: '£350k–£500k' },
      { v: '£500k–£750k' },
      { v: '£750k–£1m' },
      { v: '£1m+', expandKey: 'sellValue' },
    ],
    expandOpts: [
      { v: '£1m–£2m' },
      { v: '£2m–£5m' },
      { v: '£5m–£10m' },
      { v: '£10m+' },
    ],
  },
  {
    id: 'sellTimeline',
    type: 'chips',
    label: 'HOW SOON DO YOU WANT TO SELL?',
    opts: [
      { v: 'ASAP' },
      { v: '1–3 months' },
      { v: '3–6 months' },
      { v: '6–12 months' },
      { v: 'Just preparing' },
    ],
  },
]

const landlordQuestions: Question[] = [
  H('💼 Your existing portfolio'),
  {
    id: 'portfolio',
    type: 'chips',
    label: 'HOW MANY PROPERTIES DO YOU CURRENTLY OWN?',
    opts: [
      { v: 'None — first purchase', icon: '🏠' },
      { v: '1–2', icon: '🏘' },
      { v: '3–5', icon: '🏢' },
      { v: '6–10', icon: '🏗' },
      { v: '10+', icon: '🏙', expandKey: 'portfolio' },
    ],
    expandOpts: [
      { v: '11–25', icon: '🏘' },
      { v: '26–50', icon: '🏢' },
      { v: '51–100', icon: '🏗' },
      { v: '100+', icon: '🏙' },
    ],
  },
  {
    id: 'management',
    type: 'chips',
    label: 'HOW DO YOU CURRENTLY MANAGE?',
    opts: [
      { v: 'Self-managed', icon: '🔑' },
      { v: 'Letting agent', icon: '🏢' },
      { v: 'Mix of both' },
      { v: 'First purchase' },
    ],
  },
  H("🎯 What you're looking to buy"),
  {
    id: 'strategy',
    type: 'chips',
    label: 'INVESTMENT STRATEGY',
    multiSelect: true,
    opts: [
      { v: 'Buy-to-let yield', icon: '💰' },
      { v: 'Capital growth', icon: '📈' },
      { v: 'Yield + growth', icon: '🎯' },
      { v: 'Below market value', icon: '🏷' },
      { v: 'Refurb & hold', icon: '🔨' },
      { v: 'Refurb & flip', icon: '🔄' },
      { v: 'HMO conversion', icon: '🏘' },
      { v: 'Short-term / Airbnb', icon: '🏖' },
    ],
  },
  {
    id: 'landlordBudget',
    type: 'chips',
    label: 'PURCHASE BUDGET',
    opts: [
      { v: 'Under £100k' },
      { v: '£100k–£200k' },
      { v: '£200k–£350k' },
      { v: '£350k–£500k' },
      { v: '£500k–£1m' },
      { v: '£1m+', expandKey: 'landlordBudget' },
    ],
    expandOpts: [
      { v: '£1m–£2m' },
      { v: '£2m–£5m' },
      { v: '£5m–£10m' },
      { v: '£10m–£20m' },
      { v: '£20m–£30m' },
      { v: '£30m+' },
    ],
  },
  {
    id: 'financing',
    type: 'chips',
    label: 'HOW ARE YOU BUYING?',
    opts: [
      { v: 'Cash buyer', icon: '💵' },
      { v: 'BTL mortgage', icon: '🏦' },
      { v: 'Bridging finance', icon: '⚡' },
      { v: 'Limited company', icon: '🏢' },
      { v: 'Not sure yet' },
    ],
  },
  {
    id: 'targetYield',
    type: 'chips',
    label: 'TARGET GROSS YIELD',
    opts: [
      { v: '4–5%' },
      { v: '6–7%' },
      { v: '8–10%' },
      { v: '10%+' },
      { v: 'Capital growth over yield' },
      { v: 'Not sure yet' },
    ],
  },
  {
    id: 'workAppetite',
    type: 'chips',
    label: 'WORK APPETITE',
    opts: [
      { v: 'Turnkey — ready to let', icon: '✅' },
      { v: 'Light cosmetic work', icon: '🎨' },
      { v: 'Full refurb', icon: '🔨' },
      { v: 'Structural / development', icon: '🏗' },
    ],
  },
  {
    id: 'letType',
    type: 'chips',
    label: 'PREFERRED LET TYPE',
    opts: [
      { v: 'Single let', icon: '🏠' },
      { v: 'HMO / multi-room', icon: '🏘' },
      { v: 'Student let', icon: '🎓' },
      { v: 'Short-term / holiday', icon: '🏖' },
      { v: 'Commercial', icon: '🏪' },
    ],
  },
  {
    id: 'llocation',
    type: 'chips',
    label: 'LOCATION STRATEGY',
    opts: [
      { v: 'Local to me', icon: '📍' },
      { v: 'High-yield North', icon: '🏙' },
      { v: 'London & SE', icon: '🌆' },
      { v: 'University towns', icon: '🎓' },
      { v: 'Coastal', icon: '🌊' },
      { v: 'Flexible', icon: '🗺' },
    ],
  },
  {
    id: 'landlordMustHaves',
    type: 'chips',
    label: 'MUST-HAVES',
    multiSelect: true,
    opts: [
      { v: 'Vacant possession', icon: '🔓' },
      { v: 'Sitting tenant', icon: '🤝' },
      { v: 'No chain', icon: '⛓️' },
      { v: 'EPC D or above', icon: '🌿' },
      { v: 'Planning potential', icon: '📋' },
      { v: 'BMV — below market value', icon: '🏷' },
      { v: 'Off-market deals', icon: '🤫' },
    ],
  },
]

// ── Active question list ──────────────────────────────────────────────────

const activeQuestions = computed((): Question[] => {
  const r = selectedRole.value
  if (r === 'buy') return [...buyQuestions, passportQuestion]
  if (r === 'sell') return sellQuestions
  if (r === 'landlord') return landlordQuestions
  if (r === 'both') {
    return [
      H("🏠 The property you're selling"),
      ...sellQuestions,
      H("🔍 What you're buying next"),
      ...buyQuestions,
      H('📋 A couple more things'),
      passportQuestion,
    ]
  }
  return []
})

// ── Header ────────────────────────────────────────────────────────────────

const headerLabel = computed(() => {
  if (phase.value === 'role') return 'One quick question'
  const map: Record<string, string> = {
    buy: 'Step 2 of 2 — Your preferences',
    sell: 'Step 2 of 2 — Your property',
    landlord: 'Step 2 of 2 — Investment criteria',
    both: 'Step 2 of 2 — Your move',
  }
  return map[selectedRole.value] ?? ''
})

// Compact "Step X of Y · subtitle" used in the new light header.
const stepIndicator = computed(() => {
  if (phase.value === 'role') return 'Step 1 of 2'
  const subtitleMap: Record<string, string> = {
    buy: '',
    sell: '· Your property',
    landlord: '· Investment criteria',
    both: '· Your move',
  }
  const sub = subtitleMap[selectedRole.value] ?? ''
  return `Step 2 of 2${sub ? ' ' + sub : ''}`
})

// Eyebrow pill text in the intro block.
const eyebrowLabel = computed(() => {
  if (phase.value === 'role') return 'Welcome to umovingu'
  const map: Record<string, string> = {
    buy: 'Your preferences',
    sell: 'Build your Passport',
    landlord: 'Tailored deal flow',
    both: 'Coordinated move',
  }
  return map[selectedRole.value] ?? 'Your preferences'
})

// Footer CTA label varies by flow (matches prototype copy).
const detailCtaLabel = computed(() => {
  const map: Record<string, string> = {
    buy: "I'm ready to explore",
    sell: 'Build my Passport',
    landlord: 'Show me deals',
    both: 'Coordinate my move',
  }
  return map[selectedRole.value] ?? "I'm ready to explore"
})

// "N of M answered" — counts only real question rows, not section headings.
const totalQuestions = computed(
  () => activeQuestions.value.filter((q) => q.type !== 'heading').length,
)

// Section-group headings in the question data are stored as
// "🏠 The property you're selling" — the prototype splits emoji + text into
// two spans for layout. These helpers do the same split.
function headingEmoji(label: string): string {
  // Take everything up to the first space (works for single emoji headers).
  const idx = label.indexOf(' ')
  return idx === -1 ? label : label.slice(0, idx)
}
function headingText(label: string): string {
  const idx = label.indexOf(' ')
  return idx === -1 ? '' : label.slice(idx + 1)
}

function advanceToDetail() {
  if (!selectedRole.value) return
  phase.value = 'detail'
  scrollRef.value?.scrollTo({ top: 0 })
}

// ── Detail-phase section cards ────────────────────────────────────────────
// Group the flat question list into cards, one per section heading. Icons +
// tints are keyed off the heading emoji so the cards match the design.
const sectionMeta: Record<string, { icon: string; tint: string }> = {
  '🏠': {
    tint: 'amber',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  },
  '🔍': {
    tint: 'teal',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  },
  '📋': {
    tint: 'purple',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>',
  },
}
const defaultSectionIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>'

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

interface Section {
  title: string
  icon: string
  tint: string
  anchor: string
  questions: Question[]
}

const sections = computed<Section[]>(() => {
  const secs: Section[] = []
  let cur: Section | null = null
  for (const q of activeQuestions.value) {
    if (q.type === 'heading') {
      const emoji = headingEmoji(q.label || '')
      const title = headingText(q.label || '')
      const meta = sectionMeta[emoji] ?? { icon: defaultSectionIcon, tint: 'teal' }
      cur = {
        title,
        icon: meta.icon,
        tint: meta.tint,
        anchor: 'sec-' + slugify(title || String(secs.length)),
        questions: [],
      }
      secs.push(cur)
    } else {
      if (!cur) {
        cur = { title: '', icon: '', tint: '', anchor: 'sec-top', questions: [] }
        secs.push(cur)
      }
      cur.questions.push(q)
    }
  }
  return secs
})

// Only titled sections appear in the sidebar "On this page" nav.
const pageSections = computed(() => sections.value.filter((s) => s.title))

function scrollToSection(anchor: string) {
  if (typeof document === 'undefined') return
  document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Sidebar step-tracker sub-labels for the detail phase.
const selectedRoleLabel = computed(
  () => roles.find((r) => r.key === selectedRole.value)?.label ?? '',
)
const moveSubLabel = computed(() => {
  const map: Record<string, string> = {
    both: 'Buying & selling',
    buy: 'Your search',
    sell: 'Your property',
    landlord: 'Investment criteria',
  }
  return map[selectedRole.value] ?? 'Tell us about both sides'
})
const headerTitle = computed(() => {
  if (phase.value === 'role') return 'What do you want to do?'
  const map: Record<string, string> = {
    buy: 'Tell us about your search',
    sell: 'About your property',
    landlord: 'Your investment profile',
    both: 'Your move — buying & selling',
  }
  return map[selectedRole.value] ?? ''
})
const headerSub = computed(() => {
  if (phase.value === 'role')
    return "We'll set up the right journey for you — takes 30 seconds."
  const map: Record<string, string> = {
    buy: "We'll match you with properties and flag risk before you offer.",
    sell: "We'll get your Passport started and connect you with the right people.",
    landlord:
      "Tell us what you're after — we'll surface the right deals and data.",
    both: 'Tell us about both sides so we can coordinate everything.',
  }
  return map[selectedRole.value] ?? ''
})

// ── Selection helpers ─────────────────────────────────────────────────────

function isSelected(id: string, val: string, multi: boolean): boolean {
  if (multi) return Array.isArray(a[id]) && a[id].includes(val)
  return a[id] === val
}

function pick(
  id: string,
  val: string,
  multi: boolean,
  expandKey?: string,
  isExpander?: boolean,
) {
  if (expandKey) expanded[id] = true
  if (isExpander) return // pure expand trigger, don't select
  if (multi) {
    if (!Array.isArray(a[id])) a[id] = []
    const idx = a[id].indexOf(val)
    if (idx >= 0) a[id].splice(idx, 1)
    else a[id].push(val)
  } else {
    a[id] = val
  }
}

// ── Role selection ────────────────────────────────────────────────────────

function selectRole(key: string) {
  // Just toggle the selection — the user explicitly taps "Continue" in the
  // footer to advance (matches prototype's two-step click pattern).
  selectedRole.value = selectedRole.value === key ? '' : key
}

// ── Answered count ────────────────────────────────────────────────────────

const answeredCount = computed(() => {
  let n = 0
  for (const key of Object.keys(a)) {
    const v = a[key]
    if (Array.isArray(v) ? v.length > 0 : v && v.toString().trim() !== '') n++
  }
  return n
})

// ── Save ──────────────────────────────────────────────────────────────────

const budgetToRange: Record<string, [number, number]> = {
  'Under £200k': [0, 200000],
  '£200k–£350k': [200000, 350000],
  '£350k–£500k': [350000, 500000],
  '£500k–£750k': [500000, 750000],
  '£750k–£1m': [750000, 1000000],
  '£1m+': [1000000, 2000000],
  '£1m–£2m': [1000000, 2000000],
  '£2m–£5m': [2000000, 5000000],
  '£5m–£10m': [5000000, 10000000],
}
const valueToNum: Record<string, number> = {
  'Under £200k': 150000,
  '£200k–£350k': 275000,
  '£350k–£500k': 425000,
  '£500k–£750k': 625000,
  '£750k–£1m': 875000,
  '£1m+': 1250000,
  '£1m–£2m': 1500000,
  '£2m–£5m': 3500000,
  '£5m–£10m': 7500000,
  '£10m+': 12000000,
}

async function save() {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const isBuyer =
      selectedRole.value === 'buy' || selectedRole.value === 'both'
    const isSeller =
      selectedRole.value === 'sell' || selectedRole.value === 'both'
    const isLandlord = selectedRole.value === 'landlord'

    const budgetRange =
      isBuyer && a.buyBudget ? budgetToRange[a.buyBudget] : null
    const propValue =
      isSeller && a.sellValue ? valueToNum[a.sellValue] : undefined

    await $fetch(`${config.public.apiBase}/profile/preferences`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        purpose: [selectedRole.value],
        ...(isBuyer
          ? {
              budgetMin: budgetRange?.[0],
              budgetMax: budgetRange?.[1],
              propertyTypes: a.buyPropertyType
                ? [a.buyPropertyType]
                : undefined,
              importantFeatures: a.buyMustHaves.length
                ? a.buyMustHaves
                : undefined,
              buyingTimeline: a.buyBedrooms || undefined,
              targetAreas: a.buyLocation?.length ? a.buyLocation : undefined,
            }
          : {}),
        ...(isSeller
          ? {
              sellingTimeline: a.sellTimeline || undefined,
              propertyValue: propValue,
              propertyStyles: a.sellPropertyType
                ? [a.sellPropertyType]
                : undefined,
              targetAreas: a.sellLocation?.length ? a.sellLocation : undefined,
            }
          : {}),
        ...(isLandlord
          ? {
              importantFeatures: [
                ...(a.strategy ?? []),
                ...(a.landlordMustHaves ?? []),
              ].filter(Boolean),
            }
          : {}),
      },
    })
  } catch {
    /* proceed regardless */
  } finally {
    isLoading.value = false
    const isBuyerRole =
      selectedRole.value === 'buy' || selectedRole.value === 'both'
    // Honor a pending redirect (e.g. user was sent to signup from a
    // HomeScore property page via "I'm interested" / "I'm the owner")
    // Welcome screen consumes any pending redirectAfterLogin when the user
    // taps "Let's start exploring", so leave it in storage here.
    await navigateTo('/onboarding/welcome')
  }
}

// ── Confetti ──────────────────────────────────────────────────────────────

function runConfetti() {
  if (typeof window === 'undefined') return
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
    '#00a19a',
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
      document.body.removeChild(canvas)
    }
  }
  requestAnimationFrame(draw)
}

onMounted(() => {
  if (route.query.new === 'true') {
    setTimeout(runConfetti, 350)
  }
})
</script>

<style scoped>
/* Palette — defined on the page root so the detail-phase question styles
   below (which use var(--teal) etc.) still resolve. */
.pref-page {
  --navy: #231d45;
  --navy-soft: #4a4566;
  --navy-faint: #6e6985;
  --teal: #00a19a;
  --teal-bright: #00b6ae;
  --teal-dark: #007e78;
  --teal-deep: #00514d;
  --teal-pale: #e5f4f2;
  --teal-paler: #f2faf8;
  --text: #231d45;
  --text-soft: #6b6783;
  --text-faint: #9c98ad;
  --line: #e6edec;
  --line-soft: #f1f6f5;
  --bg: #f9fbfa;
  --gold-deep: #8a5f1f;
  --gold-paler: #fcf6e9;

  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #faf9f5;
  color: var(--text);
  font-family:
    'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Inter, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Body: dark context sidebar + light main ── */
.pf-body {
  flex: 1;
  display: flex;
  align-items: stretch;
}

/* Left sidebar */
.pf-side {
  flex: 0 0 clamp(340px, 30%, 460px);
  padding: 44px 40px;
  background:
    radial-gradient(circle at 80% 6%, rgba(47, 191, 182, 0.10) 0%, transparent 44%),
    linear-gradient(158deg, #241d47 0%, #2c2658 55%, #201b46 100%);
}
.pf-side-inner {
  max-width: 400px;
  margin-left: auto;
}
.pf-welcome {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: #6fe6dc;
  border: 1px solid rgba(47, 191, 182, 0.4);
  background: rgba(47, 191, 182, 0.1);
  border-radius: 100px;
  padding: 7px 14px;
}
.pf-welcome-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #17b3a6;
}
.pf-side-title {
  font-size: 29px;
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.8px;
  color: #fff;
  margin: 24px 0 34px;
}

/* Step tracker */
.pf-steps {
  list-style: none;
  margin: 0 0 36px;
  padding: 0;
}
.pf-step {
  display: flex;
  gap: 14px;
  position: relative;
  padding-bottom: 22px;
}
.pf-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 34px;
  bottom: 4px;
  width: 2px;
  background: rgba(255, 255, 255, 0.12);
}
.pf-step-num {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: transparent;
}
.pf-step-num svg {
  width: 15px;
  height: 15px;
}
.pf-step.active .pf-step-num {
  background: #fff;
  color: #231d45;
  border-color: #fff;
}
.pf-step.done .pf-step-num {
  background: #17b3a6;
  color: #fff;
  border-color: #17b3a6;
}
.pf-step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 4px;
}
.pf-step-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}
.pf-step:not(.active):not(.done) .pf-step-title {
  color: rgba(255, 255, 255, 0.62);
}
.pf-step-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.44);
}

/* Info card */
.pf-info {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
}
.pf-info-ic {
  flex-shrink: 0;
  color: #6fe6dc;
}
.pf-info-ic svg {
  width: 22px;
  height: 22px;
}
.pf-info p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.72);
}
.pf-info strong {
  color: #fff;
  font-weight: 800;
}

/* Trust stat cards */
.pf-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pf-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 16px;
}
.pf-stat-ic {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0a43a;
  background: rgba(224, 164, 58, 0.14);
  border: 1px solid rgba(224, 164, 58, 0.28);
}
.pf-stat-ic :deep(svg) {
  width: 19px;
  height: 19px;
}
.pf-stat-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.pf-stat-title {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}
.pf-stat-sub {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Right main panel ── */
.pf-main {
  flex: 1;
  min-width: 0;
  background: #faf9f5;
  padding: 40px 48px 64px;
}
.pf-main-inner {
  max-width: 1080px;
}

/* Top bar */
.pf-top {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 40px;
}
.pf-back {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #e7e2d6;
  background: #fff;
  color: #231d45;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.pf-back svg {
  width: 17px;
  height: 17px;
}
.pf-back:hover {
  border-color: #cfc9ba;
}
.pf-top-step {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #9c98ad;
  text-transform: uppercase;
  flex-shrink: 0;
}
.pf-top-progress {
  flex: 1;
  height: 6px;
  border-radius: 100px;
  background: #ece8e0;
  overflow: hidden;
  max-width: 360px;
}
.pf-top-progress-bar {
  height: 100%;
  border-radius: 100px;
  background: #00a19a;
  transition: width 0.3s;
}
.pf-skip {
  margin-left: auto;
  font-size: 14px;
  font-weight: 700;
  color: #6b6783;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
}
.pf-skip:hover {
  color: #231d45;
}

.pf-title {
  font-size: clamp(32px, 3.4vw, 44px);
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.04;
  color: #231d45;
  margin: 0 0 12px;
}
.pf-sub {
  font-size: 16.5px;
  color: #6b6783;
  margin: 0 0 32px;
}

/* Role grid */
.pf-roles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.pf-role {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  background: #fff;
  border: 1.5px solid #ece7dc;
  border-radius: 18px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.16s;
  box-shadow: 0 8px 22px rgba(35, 29, 69, 0.05);
}
.pf-role:hover {
  border-color: #d9d3c5;
  transform: translateY(-1px);
}
.pf-role.selected {
  border-color: #00a19a;
  background: #f4fbfa;
  box-shadow: 0 10px 26px rgba(0, 161, 154, 0.14);
}
.pf-role-ic {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-role-ic :deep(svg) {
  width: 24px;
  height: 24px;
}
.pf-role.tint-buy .pf-role-ic {
  color: #00a19a;
  background: rgba(0, 161, 154, 0.12);
}
.pf-role.tint-sell .pf-role-ic {
  color: #c98a1e;
  background: rgba(224, 164, 58, 0.16);
}
.pf-role.tint-landlord .pf-role-ic {
  color: #7a6fb0;
  background: rgba(122, 111, 176, 0.16);
}
.pf-role.tint-both .pf-role-ic {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.13);
}
.pf-role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.pf-role-title {
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
}
.pf-role-desc {
  font-size: 14px;
  line-height: 1.45;
  color: #6b6783;
}
.pf-radio {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid #d8d2c6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.pf-radio.on {
  border-color: #00a19a;
  background: #00a19a;
}
.pf-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.pf-radio.on .pf-radio-dot {
  opacity: 1;
}

/* ── Detail phase (step 2) ── */
.pf-main-inner.is-detail {
  max-width: 840px;
}
.pf-detail {
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin-top: 6px;
}

/* Section card */
.pf-card {
  background: #fff;
  border: 1px solid #efece3;
  border-radius: 22px;
  padding: 30px 32px 34px;
  box-shadow: 0 10px 30px rgba(35, 29, 69, 0.05);
  scroll-margin-top: 90px;
}
.pf-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 8px;
}
.pf-card-head h3 {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
  margin: 0;
}
.pf-card-ic {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-card-ic :deep(svg) {
  width: 21px;
  height: 21px;
}
.tint-amber {
  color: #c98a1e;
  background: rgba(224, 164, 58, 0.16);
}
.tint-teal {
  color: #00a19a;
  background: rgba(0, 161, 154, 0.12);
}
.tint-purple {
  color: #7a6fb0;
  background: rgba(122, 111, 176, 0.16);
}

/* Question rows inside a card (override the old narrow-card padding) */
.pf-card-body .pref-section {
  padding: 20px 0 0;
}
.pf-card-body .loc-drop {
  left: 0;
  right: 0;
}

/* ── Sidebar: On this page nav (detail phase) ── */
.pf-onpage {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
}
.pf-onpage-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2px;
}
.pf-onpage-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 13px 15px;
  cursor: pointer;
  transition: all 0.15s;
}
.pf-onpage-item:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.16);
}
.pf-onpage-ic {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-onpage-ic :deep(svg) {
  width: 17px;
  height: 17px;
}

/* Answered count card */
.pf-answered {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 13px;
  padding: 14px 16px;
}
.pf-answered svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #6fe6dc;
}
.pf-answered strong {
  color: #fff;
  font-weight: 800;
}

/* Divider + actions */
.pf-divider {
  height: 1px;
  background: #ece7dc;
  margin: 34px 0 22px;
}
.pf-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.pf-actions-meta {
  font-size: 14px;
  color: #6b6783;
}
.pf-actions-meta strong {
  color: #231d45;
  font-weight: 800;
}
.pf-actions-right {
  display: flex;
  align-items: center;
  gap: 22px;
}
.pf-actions-step {
  font-size: 13px;
  font-weight: 700;
  color: #9c98ad;
}
.pf-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #00a19a;
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  padding: 16px 34px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.16s;
  box-shadow: 0 12px 28px rgba(0, 161, 154, 0.28);
}
.pf-cta svg {
  width: 17px;
  height: 17px;
}
.pf-cta:hover:not(:disabled) {
  background: #00b6ae;
  transform: translateY(-1px);
}
.pf-cta:disabled,
.pf-cta.disabled {
  background: #e2ddd0;
  color: #a7a08c;
  box-shadow: none;
  cursor: not-allowed;
}

/* ── Responsive ── */
@media (max-width: 980px) {
  .pf-body {
    flex-direction: column;
  }
  .pf-side {
    flex: none;
    width: 100%;
    padding: 32px 24px;
  }
  .pf-side-inner {
    max-width: none;
    margin: 0;
  }
  .pf-main {
    padding: 32px 24px 56px;
  }
  .pf-roles {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .pf-top {
    flex-wrap: wrap;
    gap: 12px;
  }
  .pf-top-progress {
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }
  .pf-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .pf-actions-right {
    justify-content: space-between;
  }
  .pf-cta {
    flex: 1;
    justify-content: center;
  }
}

/* ── Light header (replaces the old purple block) ────────────────── */
.ob-header {
  padding: 14px 22px 4px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.ob-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--line);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-soft);
  transition: all 0.15s;
  flex-shrink: 0;
}
.ob-back:hover {
  color: var(--navy);
  border-color: var(--text-faint);
}
.ob-back svg {
  width: 14px;
  height: 14px;
}
.ob-step {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-top: 8px;
  text-align: center;
  flex: 1;
}
.ob-skip {
  font-size: 12px;
  font-weight: 800;
  color: var(--text-soft);
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: -0.05px;
  padding: 10px 4px;
  font-family: inherit;
}
.ob-skip:hover {
  color: var(--navy);
}

.ob-progress {
  height: 3px;
  background: var(--line-soft);
  margin: 8px 22px 0;
  border-radius: 100px;
  overflow: hidden;
}
.ob-progress-bar {
  height: 100%;
  background: var(--teal);
  border-radius: 100px;
  transition: width 0.3s;
}

/* ── Intro block (eyebrow + title + sub) ─────────────────────────── */
.ob-intro {
  padding: 26px 22px 6px;
}
.ob-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 800;
  color: var(--teal-dark);
  background: var(--teal-paler);
  border: 1px solid var(--teal-pale);
  padding: 5px 11px;
  border-radius: 100px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.ob-eyebrow .pulse {
  width: 6px;
  height: 6px;
  background: var(--teal);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.18);
}
.ob-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.9px;
  line-height: 1.05;
  margin-bottom: 8px;
}
.ob-sub {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-soft);
  letter-spacing: -0.1px;
  line-height: 1.5;
}

/* ── Journey cards (role picker, screen 1) ───────────────────────── */
.journey-list {
  padding: 22px 22px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.journey-card {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
}
.journey-card:hover {
  border-color: var(--teal);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 161, 154, 0.1);
}
.journey-card.selected {
  border-color: var(--teal);
  background: var(--teal-paler);
  box-shadow: 0 6px 18px rgba(0, 161, 154, 0.14);
}
.j-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--teal-paler);
  color: var(--teal-dark);
}
.j-icon.gold {
  background: var(--gold-paler);
  color: var(--gold-deep);
}
.j-icon.navy {
  background: rgba(35, 29, 69, 0.06);
  color: var(--navy);
}
.j-icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.j-body {
  flex: 1;
  min-width: 0;
}
.j-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.3px;
  line-height: 1.2;
  margin-bottom: 3px;
}
.j-sub {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-soft);
  letter-spacing: -0.05px;
  line-height: 1.4;
}
.j-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--line);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.15s;
}
.journey-card.selected .j-radio {
  border-color: var(--teal);
  background: var(--teal);
}
.j-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.journey-card.selected .j-radio-dot {
  opacity: 1;
}

/* ── Info stripe (replaces the £900m green block) ───────────────── */
.info-stripe {
  margin: 8px 22px 16px;
  padding: 14px 16px;
  background: var(--teal-paler);
  border: 1px solid var(--teal-pale);
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 11px;
}
.info-stripe-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--teal-pale);
  color: var(--teal);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info-stripe-icon svg {
  width: 13px;
  height: 13px;
}
.info-stripe-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--navy-soft);
  letter-spacing: -0.05px;
  line-height: 1.5;
}
.info-stripe-text strong {
  color: var(--navy);
  font-weight: 800;
}

/* ── Trust tiles (3-up grid) ─────────────────────────────────────── */
.trust-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 0 22px 26px;
}
.trust-tile {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
}
.trust-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--teal);
}
.trust-icon.gold {
  color: var(--gold-deep);
  background: var(--gold-paler);
}
.trust-icon :deep(svg) {
  width: 14px;
  height: 14px;
}
.trust-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.15px;
  line-height: 1.2;
  margin-bottom: 3px;
}
.trust-sub {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-soft);
  letter-spacing: -0.05px;
  line-height: 1.35;
}

/* ── Section group header (landlord & combined flows) ────────────── */
.section-group {
  margin: 18px 22px 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-group-emoji {
  font-size: 17px;
  line-height: 1;
}
.section-group-h {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.3px;
}
.section-group + .pref-section {
  padding-top: 12px;
}

/* ── Pref section ───────────────────────────────────────────────── */
.pref-section {
  padding: 16px 22px 4px;
}
.pref-label {
  font-size: 10.5px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 1.6px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.pref-label .multi-hint {
  font-weight: 600;
  color: var(--text-faint);
  text-transform: none;
  letter-spacing: -0.05px;
  font-size: 11px;
  margin-left: 4px;
}
.pref-help {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-soft);
  letter-spacing: -0.05px;
  line-height: 1.4;
  margin-bottom: 10px;
}

/* Pill-shaped input (used by location + text questions) */
.pref-input {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 100px;
  padding: 4px 6px 4px 14px;
  gap: 8px;
  transition: all 0.15s;
}
.pref-input:focus-within {
  border-color: var(--teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}
.pref-input svg {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  flex-shrink: 0;
}
.pref-input input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 4px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--navy);
  letter-spacing: -0.1px;
  min-width: 0;
}
.pref-input input:focus {
  outline: none;
}
.pref-input input::placeholder {
  color: var(--text-faint);
  font-weight: 500;
}

/* Location autocomplete dropdown — sits below the input. Anchored to
   .pref-section so we don't need a wrapper. */
.pref-section {
  position: relative;
}
.loc-drop {
  position: absolute;
  top: calc(100% - 4px);
  left: 22px;
  right: 22px;
  background: #fff;
  border: 1.5px solid var(--teal-pale);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(35, 29, 69, 0.12);
  z-index: 30;
  overflow: hidden;
  max-height: 280px;
  overflow-y: auto;
}
.loc-drop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--line-soft);
  transition: background 0.12s;
}
.loc-drop-item:last-child {
  border-bottom: none;
}
.loc-drop-item:hover {
  background: var(--teal-paler);
}
.loc-drop-ic {
  font-size: 14px;
  flex-shrink: 0;
}
.loc-drop-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.loc-drop-text strong {
  font-size: 13px;
  font-weight: 700;
  color: var(--navy);
}
.loc-drop-sub {
  font-size: 11px;
  color: var(--text-faint);
  margin-top: 1px;
}

/* ── Chips ───────────────────────────────────────────────────────── */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.chip {
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: var(--navy);
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 100px;
  padding: 8px 13px;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.chip:hover {
  border-color: var(--teal-pale);
  background: var(--teal-paler);
}
.chip.selected {
  background: var(--teal);
  color: #fff;
  border-color: var(--teal);
  box-shadow: 0 4px 10px rgba(0, 161, 154, 0.25);
}
.chip.dashed {
  border-style: dashed;
  color: var(--text-faint);
}
.chip-emoji {
  font-size: 13px;
  line-height: 1;
}

/* ── Sticky footer ───────────────────────────────────────────────── */
.ob-footer {
  position: sticky;
  bottom: 0;
  background: linear-gradient(to top, #fff 75%, rgba(255, 255, 255, 0));
  padding: 14px 22px calc(22px + env(safe-area-inset-bottom));
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}
.ob-footer-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-soft);
  letter-spacing: -0.05px;
  padding: 0 4px 2px;
}
.ob-footer-meta strong {
  color: var(--navy);
  font-weight: 800;
}

.cta-primary {
  width: 100%;
  background: var(--teal);
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  padding: 16px 18px;
  border-radius: 100px;
  cursor: pointer;
  letter-spacing: -0.15px;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.28);
}
.cta-primary:hover {
  background: var(--teal-bright);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.34);
}
.cta-primary svg {
  width: 14px;
  height: 14px;
}
.cta-primary.disabled,
.cta-primary:disabled {
  background: var(--line);
  color: var(--text-faint);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
