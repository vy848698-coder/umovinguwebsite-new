<template>
  <div
    class="psi-wrap"
    :class="[
      `psi-wrap--${variant}`,
      { 'psi-wrap--open': showDropdown && (results.length > 0 || postcodeResults.length > 0) },
    ]"
  >
    <div class="psi-input-wrap">
      <svg
        class="psi-icon"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        :value="query"
        type="text"
        :placeholder="placeholder"
        class="psi-input"
        @input="handleInput(($event.target as HTMLInputElement).value)"
        @focus="onFocus"
        @keyup.enter="onEnter"
      />
      <div v-if="loading" class="psi-spinner" />
      <button
        v-else-if="query"
        class="psi-clear"
        @click="clearQuery"
        aria-label="Clear"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Dropdown -->
    <Transition name="psi-drop">
      <div
        v-if="showDropdown && (results.length > 0 || postcodeResults.length > 0)"
        ref="dropdownEl"
        class="psi-drop"
        @scroll="onDropdownScroll"
      >
        <!-- Postcode-only suggestions (postcodes.io fallback) -->
        <template v-if="results.length === 0 && postcodeResults.length > 0">
          <div class="psi-drop-header">Postcodes</div>
          <div
            v-for="pc in postcodeResults"
            :key="pc"
            class="psi-drop-item"
            @mousedown.prevent="selectPostcode(pc)"
          >
            <div class="psi-drop-ic">
              <img src="/dashboard-art/searchHouse.png" alt="" loading="lazy" />
            </div>
            <div class="psi-drop-body">
              <div class="psi-drop-line1">{{ pc }}</div>
              <div class="psi-drop-line2">Search this postcode</div>
            </div>
          </div>
        </template>

        <!-- Property results -->
        <template v-else>
          <div class="psi-drop-header">Select an address</div>
          <div
            v-for="r in results"
            :key="r.id"
            class="psi-drop-item"
            @mousedown.prevent="select(r)"
          >
            <div class="psi-drop-ic">
              <img src="/dashboard-art/searchHouse.png" alt="" loading="lazy" />
            </div>

            <div class="psi-drop-body">
              <div class="psi-drop-line1">
                {{ r.addressLine1 || r.address || '—' }}
              </div>
              <div class="psi-drop-line2">
                <span v-if="r.city">{{ r.city }} · </span>{{ r.postcode || '' }}
              </div>
              <!-- A coloured line rather than a pill: "Property Passport
                   claimed · Partially Public" is far too long for a chip, and
                   a line wraps gracefully instead of fighting fixed padding.
                   One consistent colour across all four states so a dense
                   list doesn't read as a wall of different colours. The
                   padlock is only locked for 'private' — nothing is withheld
                   in any other state. EPC is deliberately absent here:
                   HomeScore already folds it in as a fallback, so showing
                   both was duplicate information on one row. -->
              <div class="psi-drop-passport">
                <img
                  :src="passportStateOf(r) !== 'private'
                    ? '/dashboard-art/passportUnlocked.png'
                    : '/dashboard-art/passportLocked.png'"
                  alt=""
                  class="psi-drop-passport-ic"
                  loading="lazy"
                />
                {{ passportStateFullLabel(r) }}
              </div>
            </div>

            <div
              v-if="(r.homeScore ?? r.epcScore) != null"
              class="psi-drop-hs"
            >
              <span class="psi-drop-hs-cap">HomeScore</span>
              <div class="psi-drop-hs-gauge">
                <svg viewBox="0 0 40 40">
                  <circle class="psi-drop-hs-bg" cx="20" cy="20" r="16" />
                  <circle
                    class="psi-drop-hs-fill"
                    cx="20"
                    cy="20"
                    r="16"
                    :stroke="hsColor(r.homeScore ?? r.epcScore)"
                    stroke-dasharray="100.5"
                    :stroke-dashoffset="100.5 - (Math.min(r.homeScore ?? r.epcScore, 100) / 100) * 100.5"
                  />
                </svg>
                <span
                  class="psi-drop-hs-num"
                  :style="{ color: hsColor(r.homeScore ?? r.epcScore) }"
                >{{ r.homeScore ?? r.epcScore }}</span>
              </div>
            </div>
          </div>

          <!-- Loading more indicator -->
          <div v-if="loadingMore" class="psi-drop-loading">
            <div class="psi-drop-spinner" />
          </div>
          <!-- End-of-results footer -->
          <div v-else-if="!hasMore && results.length > 0" class="psi-drop-end">
            {{ results.length }} of {{ total }} · all results shown
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  placeholder?: string
  variant?: 'light' | 'dark'
  /** Sort properties with published passports to the top of the dropdown */
  preferPassport?: boolean
  /** Show a labelled "Published" / "In progress" pill instead of the tiny circular icon */
  showPassportStatus?: boolean
  /**
   * When the property database has no match, fall back to live UK postcode
   * suggestions (postcodes.io — free, no key). Lets users pick a valid
   * postcode even if their home isn't in our dataset yet (e.g. signup).
   */
  postcodeFallback?: boolean
  /**
   * Seed text for the field, for hosts that arrive with a query already in
   * hand (e.g. /explore?q=CV1 handed over from the landing page's hero
   * search). Applied once on mount only - it is a starting value, not a
   * v-model, so it never fights the user's own typing afterwards.
   */
  initialQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter postcode or address',
  variant: 'light',
  preferPassport: false,
  showPassportStatus: false,
  postcodeFallback: false,
  initialQuery: '',
})

const emit = defineEmits<{
  (e: 'select', property: any): void
  (e: 'enter', query: string): void
}>()

const config = useRuntimeConfig()

const PAGE_SIZE = 10

const query = ref(props.initialQuery ?? '')
const results = ref<any[]>([])
const postcodeResults = ref<string[]>([])
const showDropdown = ref(false)
// Set by closeDropdown() so a suggestion fetch that is already in flight can't
// pop the list back open a moment after the host page committed a search.
// Cleared the instant the user types again or refocuses the field, since both
// are a deliberate request to see suggestions.
const suppressDropdown = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const total = ref(0)
const dropdownEl = ref<HTMLElement | null>(null)
const hasMore = computed(() => results.value.length < total.value)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

async function fetchPage(q: string, offset: number) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await $fetch<any>(
    `${config.public.apiBase}/property/search?q=${encodeURIComponent(q)}&offset=${offset}&limit=${PAGE_SIZE}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},
  )
  let items = res?.items ?? []
  if (props.preferPassport) {
    items = [...items].sort((a: any, b: any) => {
      const ap = a.hasPassport && a.passportPublished ? 1 : 0
      const bp = b.hasPassport && b.passportPublished ? 1 : 0
      return bp - ap
    })
  }
  return { items, total: res?.total ?? items.length }
}

// Loose check for "this looks like (the start of) a UK postcode" so we only
// hit the postcode service for plausible queries.
function looksLikePostcode(q: string): boolean {
  return /^[a-z]{1,2}\d/i.test(q.replace(/\s+/g, ''))
}

async function fetchPostcodes(q: string): Promise<string[]> {
  try {
    const clean = q.replace(/\s+/g, '')
    const res = await $fetch<any>(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}/autocomplete`,
    )
    return Array.isArray(res?.result) ? res.result : []
  } catch {
    return []
  }
}

function handleInput(val: string) {
  query.value = val
  suppressDropdown.value = false
  if (debounceTimer) clearTimeout(debounceTimer)
  if (val.trim().length < 2) {
    results.value = []
    postcodeResults.value = []
    total.value = 0
    showDropdown.value = false
    loading.value = false
    return
  }
  loading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      // Property DB search. If the backend is unreachable this throws — we
      // still want the postcode fallback below to run, so catch it locally
      // and treat it as "no property results" instead of aborting.
      let items: any[] = []
      let t = 0
      try {
        const page = await fetchPage(val, 0)
        items = page.items
        t = page.total
      } catch {
        items = []
        t = 0
      }
      results.value = items
      total.value = t
      // Fall back to live UK postcode suggestions when no property matched
      // (or when the property search failed entirely).
      if (
        items.length === 0 &&
        props.postcodeFallback &&
        looksLikePostcode(val)
      ) {
        postcodeResults.value = await fetchPostcodes(val)
      } else {
        postcodeResults.value = []
      }
      showDropdown.value =
        !suppressDropdown.value &&
        (items.length > 0 || postcodeResults.value.length > 0)
    } catch {
      results.value = []
      postcodeResults.value = []
      total.value = 0
      showDropdown.value = false
    } finally {
      loading.value = false
    }
  }, 300)
}

function selectPostcode(pc: string) {
  query.value = pc
  showDropdown.value = false
  postcodeResults.value = []
  // Emit a postcode-only "property" — no id, since it isn't in our dataset.
  emit('select', { id: null, addressLine1: '', postcode: pc, postcodeOnly: true })
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value || !query.value.trim()) return
  loadingMore.value = true
  try {
    const { items, total: t } = await fetchPage(
      query.value,
      results.value.length,
    )
    const existing = new Set(results.value.map((r) => r.id))
    for (const item of items) {
      if (!existing.has(item.id)) results.value.push(item)
    }
    total.value = t
  } catch {
    /* non-critical */
  } finally {
    loadingMore.value = false
  }
}

function onDropdownScroll() {
  const el = dropdownEl.value
  if (!el) return
  const threshold = 80
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
    loadMore()
  }
}

function onFocus() {
  suppressDropdown.value = false
  if (results.value.length > 0 || postcodeResults.value.length > 0)
    showDropdown.value = true
}

function onEnter() {
  if (results.value.length > 0) {
    select(results.value[0])
  } else {
    emit('enter', query.value.trim())
  }
}

function select(property: any) {
  query.value = property.addressLine1 || property.address || ''
  showDropdown.value = false
  emit('select', property)
}

function clearQuery() {
  query.value = ''
  results.value = []
  postcodeResults.value = []
  total.value = 0
  showDropdown.value = false
}

// Four real states, not three: a published passport whose required
// milestones aren't all met yet is only partially public, and collapsing
// that into "Published" overstates what a buyer can actually see.
function passportStateOf(
  addr: any,
): 'unclaimed' | 'private' | 'partiallyPublic' | 'public' {
  if (!addr.hasPassport) return 'unclaimed'
  if (!addr.passportPublished) return 'private'
  return (addr.milestonePct ?? 0) >= 100 ? 'public' : 'partiallyPublic'
}

// Full "Property Passport claimed · X" phrasing. This line has its own row
// under the address, so it's where a first-time viewer actually learns what
// the state means — a bare word like "Private" reads as though the property
// itself is private.
function passportStateFullLabel(addr: any): string {
  const state = passportStateOf(addr)
  if (state === 'unclaimed') return 'Property Passport unclaimed'
  if (state === 'partiallyPublic') return 'Property Passport claimed · Partially Public'
  if (state === 'public') return 'Property Passport claimed · Public'
  return 'Property Passport claimed · Private'
}

function epcColor(rating: string): string {
  const map: Record<string, string> = {
    A: '#00b050',
    B: '#33b800',
    C: '#92d050',
    D: '#a39200',
    E: '#e08a00',
    F: '#ff6600',
    G: '#ff0000',
  }
  return map[(rating ?? '').toUpperCase()] ?? '#8e8e93'
}

function hsColor(score: number | null | undefined): string {
  if (score == null) return '#8e8e93'
  if (score >= 75) return '#008a84'
  if (score >= 60) return '#65a30d'
  if (score >= 45) return '#ca8a04'
  if (score >= 30) return '#92400e'
  return '#dc2626'
}

// closeDropdown, unlike clearQuery, leaves the typed text in place - it only
// dismisses the suggestion list. Host pages that render their own results
// below the bar (e.g. pages/explore.vue) need this: after committing a
// search the dropdown would otherwise stay open on top of those results and
// swallow clicks on the first row.
function closeDropdown() {
  if (debounceTimer) clearTimeout(debounceTimer)
  loading.value = false
  showDropdown.value = false
  suppressDropdown.value = true
}

defineExpose({ clearQuery, closeDropdown })
</script>

<style scoped>
.psi-wrap {
  position: relative;
  width: 100%;
}

.psi-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.psi-icon {
  position: absolute;
  left: 14px;
  pointer-events: none;
}

.psi-input {
  width: 100%;
  padding: 12px 40px 12px 38px;
  border-radius: 12px;
  border: 1.5px solid transparent;
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.psi-wrap--light .psi-input {
  background: #f8f7fc;
  border-color: #e5e7eb;
  color: #1f2024;
}
.psi-wrap--light .psi-icon {
  stroke: #94a3b8;
}
.psi-wrap--light .psi-input:focus {
  border-color: #00a19a;
  background: #fff;
}
.psi-wrap--light .psi-input::placeholder {
  color: #94a3b8;
}

.psi-wrap--dark .psi-input {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.psi-wrap--dark .psi-icon {
  stroke: rgba(255, 255, 255, 0.5);
}
.psi-wrap--dark .psi-input:focus {
  border-color: #3dbda3;
  background: rgba(255, 255, 255, 0.12);
}
.psi-wrap--dark .psi-input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}
.psi-wrap--dark .psi-clear {
  color: rgba(255, 255, 255, 0.6);
}

.psi-spinner {
  position: absolute;
  right: 14px;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(148, 163, 184, 0.3);
  border-top-color: #00a19a;
  border-radius: 50%;
  animation: psi-spin 0.7s linear infinite;
}
@keyframes psi-spin {
  to {
    transform: rotate(360deg);
  }
}

.psi-clear {
  position: absolute;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(148, 163, 184, 0.15);
  color: #64748b;
  display: grid;
  place-items: center;
  cursor: pointer;
}

/* ── Dropdown ── */
.psi-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 40;
  max-height: 320px;
  overflow-y: auto;
  /* Slim, on-brand scrollbar instead of the OS default (which renders as a
     wide dark bar on Windows). */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.psi-drop::-webkit-scrollbar {
  width: 10px;
}
.psi-drop::-webkit-scrollbar-track {
  background: transparent;
}
.psi-drop::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
  /* Transparent border carves the thumb in from the edge so it reads as a thin
     pill floating inside the dropdown rather than a chunky bar. */
  border: 3px solid #fff;
  background-clip: padding-box;
}
.psi-drop::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
  background-clip: padding-box;
}

.psi-drop-header {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 10px 14px 4px;
}

.psi-drop-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.12s;
}
.psi-drop-item:last-child {
  border-bottom: none;
}
.psi-drop-item:hover,
.psi-drop-item:active {
  background: #f0fdfa;
}

.psi-drop-ic {
  width: 28px;
  height: 28px;
  color: #00a19a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}
.psi-drop-ic img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.psi-drop-body {
  flex: 1;
  min-width: 0;
}
.psi-drop-line1 {
  font-size: 15px;
  font-weight: 700;
  color: #231d45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.psi-drop-line2 {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 1px;
}

.psi-drop-passport {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #00817c;
}
.psi-drop-passport-ic {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

.psi-drop-hs {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.psi-drop-hs-cap {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #9c98ad;
}
.psi-drop-hs-gauge {
  position: relative;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}
.psi-drop-hs-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.psi-drop-hs-bg {
  fill: none;
  stroke: #ededf3;
  stroke-width: 4;
}
.psi-drop-hs-fill {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s;
}
.psi-drop-hs-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  font-feature-settings: 'tnum';
}

.psi-drop-loading {
  display: flex;
  justify-content: center;
  padding: 12px;
}
.psi-drop-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  border-top-color: #00a19a;
  animation: psi-spin 0.7s linear infinite;
}
.psi-drop-end {
  text-align: center;
  font-size: 10.5px;
  font-weight: 600;
  color: #94a3b8;
  padding: 10px 12px;
  background: #f8f7fc;
  border-top: 1px solid #f1f5f9;
}

/* Transitions */
.psi-drop-enter-active,
.psi-drop-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.psi-drop-enter-from,
.psi-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
