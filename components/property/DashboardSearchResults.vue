<template>
  <section class="dsr">
    <!-- ── Header: back, live count, list/map ───────────────────────── -->
    <div class="dsr-head">
      <button class="dsr-back" type="button" @click="emit('close')">
        <Icon name="i-lucide-arrow-left" class="dsr-back-ic" />
        Back to dashboard
      </button>

      <div class="dsr-head-text">
        <h2 class="dsr-title">
          <template v-if="loading">Searching…</template>
          <template v-else>{{ total.toLocaleString('en-GB') }} {{ total === 1 ? 'home' : 'homes' }} found</template>
        </h2>
        <p class="dsr-sub">
          for “{{ query }}”
          <template v-if="!loading && passportFiltered">
            · {{ displayed.length }} of {{ items.length }} loaded match your passport filter
          </template>
        </p>
      </div>

      <div class="dsr-toggle" role="group" aria-label="Result view">
        <button
          type="button"
          class="dsr-toggle-btn"
          :class="{ on: viewMode === 'list' }"
          @click="viewMode = 'list'"
        >
          <Icon name="i-lucide-layout-grid" />
          List
        </button>
        <button
          type="button"
          class="dsr-toggle-btn"
          :class="{ on: viewMode === 'map' }"
          @click="viewMode = 'map'"
        >
          <Icon name="i-lucide-map" />
          Map
        </button>
      </div>
    </div>

    <!-- ── Quick filters ─────────────────────────────────────────────
         Sort and the 4-way passport split are client-side: the backend has
         no sort, and its passport filter only knows coarse buckets, not the
         milestonePct threshold behind Partially Public vs Public. HomeScore,
         property type, bedrooms and EPC are real server-side query params,
         so applying them re-runs the search and totals stay correct. -->
    <div ref="chipRowEl" class="dsr-chips">
      <div class="dsr-chip-wrap">
        <button
          type="button"
          class="dsr-chip"
          :class="{ on: sortBy !== 'relevance', open: openPopover === 'sort' }"
          @click="togglePopover('sort')"
        >
          <Icon name="i-lucide-arrow-up-down" class="dsr-chip-ic" />
          {{ sortBy === 'relevance' ? 'Sort' : sortLabel }}
          <Icon name="i-lucide-chevron-down" class="dsr-chip-caret" />
        </button>
        <div v-if="openPopover === 'sort'" class="dsr-pop">
          <p class="dsr-pop-title">Sort by</p>
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            type="button"
            class="dsr-opt"
            :class="{ on: sortBy === opt.value }"
            @click="sortBy = opt.value; openPopover = null"
          >
            <span class="dsr-radio" />
            {{ opt.label }}
          </button>
          <p class="dsr-pop-note">Sorts the {{ items.length }} results loaded so far.</p>
        </div>
      </div>

      <div class="dsr-chip-wrap">
        <button
          type="button"
          class="dsr-chip"
          :class="{ on: passportFiltered, open: openPopover === 'passport' }"
          @click="togglePopover('passport')"
        >
          Passport
          <span v-if="passportFiltered" class="dsr-chip-count">{{ passportStates.size }}</span>
          <Icon name="i-lucide-chevron-down" class="dsr-chip-caret" />
        </button>
        <div v-if="openPopover === 'passport'" class="dsr-pop">
          <p class="dsr-pop-title">Passport status</p>
          <button
            v-for="opt in passportStateOptions"
            :key="opt.value"
            type="button"
            class="dsr-opt"
            @click="togglePassportState(opt.value)"
          >
            <span class="dsr-check" :class="{ on: passportStates.has(opt.value) }">
              <Icon v-if="passportStates.has(opt.value)" name="i-lucide-check" />
            </span>
            {{ opt.label }}
          </button>
          <div class="dsr-pop-foot">
            <button type="button" class="dsr-btn-ghost" @click="passportStates = new Set(ALL_STATES)">
              Select all
            </button>
            <button type="button" class="dsr-btn" @click="openPopover = null">Done</button>
          </div>
        </div>
      </div>

      <div class="dsr-chip-wrap">
        <button
          type="button"
          class="dsr-chip"
          :class="{ on: minHomeScore > 0, open: openPopover === 'homescore' }"
          @click="togglePopover('homescore')"
        >
          HomeScore{{ minHomeScore > 0 ? ` ${minHomeScore}+` : '' }}
          <Icon name="i-lucide-chevron-down" class="dsr-chip-caret" />
        </button>
        <div v-if="openPopover === 'homescore'" class="dsr-pop dsr-pop--wide">
          <p class="dsr-pop-title">
            Minimum HomeScore
            <span class="dsr-pop-value">{{ hsDraft > 0 ? `${hsDraft}+` : 'Any' }}</span>
          </p>
          <input
            v-model.number="hsDraft"
            type="range"
            class="dsr-slider"
            min="0"
            max="90"
            step="5"
            :style="{ '--fill': (hsDraft / 90) * 100 + '%' }"
          />
          <div class="dsr-slider-scale">
            <span>Any</span><span>30</span><span>50</span><span>70</span><span>90</span>
          </div>
          <div class="dsr-pop-foot">
            <button type="button" class="dsr-btn-ghost" @click="hsDraft = 0">Reset</button>
            <button type="button" class="dsr-btn" @click="applyHomeScore">Apply</button>
          </div>
        </div>
      </div>

      <div class="dsr-chip-wrap">
        <button
          type="button"
          class="dsr-chip"
          :class="{ on: propertyTypes[0] !== 'any', open: openPopover === 'ptype' }"
          @click="togglePopover('ptype')"
        >
          Property type
          <Icon name="i-lucide-chevron-down" class="dsr-chip-caret" />
        </button>
        <div v-if="openPopover === 'ptype'" class="dsr-pop dsr-pop--wide">
          <p class="dsr-pop-title">Property type</p>
          <div class="dsr-pills">
            <button
              v-for="opt in propertyTypeOptions"
              :key="opt.value"
              type="button"
              class="dsr-pill"
              :class="{ on: typeDraft.includes(opt.value) }"
              @click="toggleTypeDraft(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
          <div class="dsr-pop-foot">
            <button type="button" class="dsr-btn dsr-btn--full" @click="applyServerFilters">Apply</button>
          </div>
        </div>
      </div>

      <div class="dsr-chip-wrap">
        <button
          type="button"
          class="dsr-chip"
          :class="{ on: minBeds != null || minEpc != null, open: openPopover === 'more' }"
          @click="togglePopover('more')"
        >
          <Icon name="i-lucide-sliders-horizontal" class="dsr-chip-ic" />
          More
          <Icon name="i-lucide-chevron-down" class="dsr-chip-caret" />
        </button>
        <div v-if="openPopover === 'more'" class="dsr-pop dsr-pop--wide">
          <p class="dsr-pop-title">Bedrooms (min)</p>
          <div class="dsr-pills">
            <button
              v-for="opt in bedsOptions"
              :key="opt.value ?? 'any'"
              type="button"
              class="dsr-pill"
              :class="{ on: bedsDraft === opt.value }"
              @click="bedsDraft = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <p class="dsr-pop-title dsr-pop-title--gap">EPC rating (min)</p>
          <div class="dsr-pills">
            <button
              v-for="opt in epcOptions"
              :key="opt.value ?? 'any'"
              type="button"
              class="dsr-pill"
              :class="{ on: epcDraft === opt.value }"
              @click="epcDraft = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
          <div class="dsr-pop-foot">
            <button type="button" class="dsr-btn dsr-btn--full" @click="applyServerFilters">Apply</button>
          </div>
        </div>
      </div>

      <button v-if="anyFilterActive" type="button" class="dsr-clear" @click="clearFilters">
        <Icon name="i-lucide-x" />
        Clear filters
      </button>
    </div>

    <!-- ── Results ──────────────────────────────────────────────────── -->
    <div v-if="loading" class="dsr-grid">
      <div v-for="n in 8" :key="`sk-${n}`" class="dsr-skeleton" />
    </div>

    <template v-else-if="displayed.length">
      <template v-if="viewMode === 'list'">
        <div class="dsr-grid">
          <article
            v-for="p in displayed"
            :key="p.id"
            class="dsr-card"
            role="link"
            tabindex="0"
            @click="openProperty(p.id)"
            @keydown.enter="openProperty(p.id)"
          >
            <div class="dsr-photo">
              <PropertyImage :src="p.imageUrl" :alt="p.addressLine1" :show-caption="false" />
              <span class="dsr-badge">
                <img
                  :src="stateOf(p) === 'private' ? '/dashboard-art/passportLocked.png' : '/dashboard-art/passportUnlocked.png'"
                  alt=""
                  class="dsr-badge-ic"
                  loading="lazy"
                />
                <small>Passport</small>
                <b>{{ badgeLabel(p) }}</b>
              </span>
              <span v-if="p.images?.length" class="dsr-photo-count">
                <Icon name="i-lucide-camera" />
                {{ p.images.length }}
              </span>
              <button
                type="button"
                class="dsr-save"
                :class="{ on: savedSet.has(p.id) }"
                :aria-pressed="savedSet.has(p.id)"
                :disabled="savingId === p.id"
                @click.stop="onSaveClick(p)"
                @keydown.enter.stop
              >
                <Icon :name="savedSet.has(p.id) ? 'i-lucide-bookmark-check' : 'i-lucide-bookmark'" />
                {{ savedSet.has(p.id) ? 'Saved' : 'Save' }}
              </button>
            </div>

            <div class="dsr-body">
              <div class="dsr-price-row">
                <p class="dsr-price">
                  <template v-if="p.estimatedPrice">
                    £{{ Math.round(p.estimatedPrice).toLocaleString('en-GB') }}
                    <small>estimate</small>
                  </template>
                  <template v-else>Price on request</template>
                </p>
                <span v-if="watchedSet.has(p.id)" class="dsr-watching">
                  <Icon name="i-lucide-eye" />
                  Watching
                </span>
              </div>
              <h3 class="dsr-addr">{{ p.addressLine1 }}</h3>
              <p class="dsr-meta">
                <template v-if="p.city">{{ p.city }} · </template>{{ p.postcode }}
              </p>

              <div v-if="p.propertyType || p.tenure || p.epcRating || p.bedrooms" class="dsr-tags">
                <span v-if="p.propertyType" class="dsr-tag">{{ p.propertyType }}</span>
                <span v-if="p.tenure" class="dsr-tag">{{ p.tenure }}</span>
                <span v-if="p.bedrooms" class="dsr-tag">{{ p.bedrooms }} bed</span>
                <span
                  v-if="p.epcRating"
                  class="dsr-tag dsr-tag--epc"
                  :style="{ background: epcColor(p.epcRating) }"
                >EPC {{ p.epcRating }}</span>
              </div>

              <div class="dsr-foot">
                <div v-if="homeScoreOf(p) != null" class="dsr-hs">
                  <div class="dsr-ring">
                    <svg viewBox="0 0 40 40">
                      <circle class="dsr-ring-bg" cx="20" cy="20" r="16" />
                      <circle
                        class="dsr-ring-fill"
                        cx="20"
                        cy="20"
                        r="16"
                        :stroke="hsColor(homeScoreOf(p)!)"
                        stroke-dasharray="100.5"
                        :stroke-dashoffset="100.5 - (Math.min(homeScoreOf(p)!, 100) / 100) * 100.5"
                      />
                    </svg>
                    <span class="dsr-ring-num">{{ homeScoreOf(p) }}</span>
                  </div>
                  <span class="dsr-hs-label">
                    HomeScore
                    <b :style="{ color: hsColor(homeScoreOf(p)!) }">{{ hsLabel(homeScoreOf(p)!) }}</b>
                  </span>
                </div>
                <div class="dsr-pp">
                  <Icon :name="stateIcon(p)" class="dsr-pp-ic" :class="`dsr-pp-ic--${stateOf(p)}`" />
                  <span class="dsr-pp-text">
                    <strong>{{ stateTitle(p) }}</strong>
                    <small>{{ stateSub(p) }}</small>
                  </span>
                </div>
              </div>

              <p v-if="insightFor(p)" class="dsr-insight" :class="`dsr-insight--${insightFor(p)!.tone}`">
                <Icon
                  :name="insightFor(p)!.tone === 'good'
                    ? 'i-lucide-circle-check'
                    : insightFor(p)!.tone === 'warn'
                      ? 'i-lucide-triangle-alert'
                      : 'i-lucide-info'"
                />
                {{ insightFor(p)!.text }}
              </p>
            </div>
          </article>
        </div>

        <div v-if="hasMore" ref="loadMoreSentinel" class="dsr-more">
          <span v-if="loadingMore" class="dsr-spinner" />
          <button v-else type="button" class="dsr-more-btn" @click="loadMore">
            Load {{ Math.min(PAGE_SIZE, total - items.length) }} more
          </button>
        </div>
        <p v-else class="dsr-end">
          {{ displayed.length === 1 ? '1 result shown' : `${displayed.length} results shown` }}
        </p>
      </template>

      <div v-else class="dsr-map">
        <div ref="mapEl" class="dsr-map-canvas" />
        <div v-if="!mapReady" class="dsr-map-loading">Loading map…</div>
        <div v-else-if="!withCoords.length" class="dsr-map-loading">
          None of these results have a map location yet.
        </div>
        <div class="dsr-map-legend">
          <span v-for="opt in passportStateOptions" :key="opt.value">
            <i :style="{ background: STATE_COLOR[opt.value] }" />
            {{ opt.label }}
          </span>
        </div>
      </div>
    </template>

    <div v-else class="dsr-empty">
      <span class="dsr-empty-ring"><Icon name="i-lucide-map-pin-off" class="dsr-empty-ic" /></span>
      <template v-if="items.length">
        <p class="dsr-empty-title">No loaded results match your passport filter</p>
        <p class="dsr-empty-sub">Tick more passport states to see the other {{ items.length }}.</p>
        <button type="button" class="dsr-btn" @click="passportStates = new Set(ALL_STATES)">
          Show all passport states
        </button>
      </template>
      <template v-else-if="searchFailed">
        <p class="dsr-empty-title">Search is unavailable right now</p>
        <p class="dsr-empty-sub">We couldn't reach the property service. Try again in a moment.</p>
        <button type="button" class="dsr-btn" @click="runSearch">Try again</button>
      </template>
      <template v-else>
        <p class="dsr-empty-title">No properties matched “{{ query }}”</p>
        <p class="dsr-empty-sub">
          <template v-if="anyFilterActive">Your filters may be too narrow.</template>
          <template v-else>Try a full postcode, or a house number with the street name.</template>
        </p>
        <button v-if="anyFilterActive" type="button" class="dsr-btn" @click="clearFilters">
          Clear filters
        </button>
      </template>
    </div>

    <AuthGateModal
      v-model="authGateOpen"
      title="Sign in to save properties"
      body="Create a free account to save properties, watch homes and get alerted the moment something changes."
    />
  </section>
</template>

<script setup lang="ts">
// The dashboard's in-place search mode — a desktop port of the reference
// clone's PropertySearchExperienceClassic results view. The hero search bar
// stays where it is; committing a query swaps the dashboard sections below
// it for this panel, and Back hands the page back.
//
// Every figure on a card comes straight off /property/search: the 4 passport
// states use the same milestonePct model as property/[id].vue's
// floatClaimState, HomeScore is the backend's own score, and the insight
// line is derived only from this batch of results — nothing invented.
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
import AuthGateModal from '~/components/ui/AuthGateModal.vue'

const props = withDefaults(
  defineProps<{
    query: string
    // Seeds the Save toggle so a card reflects what the user already saved.
    savedIds?: string[]
    // Properties on the user's watch list (GET /property/watches). Shown as a
    // read-only tag: creating a watch needs the property page's alert form.
    watchedIds?: string[]
  }>(),
  { savedIds: () => [], watchedIds: () => [] },
)

const emit = defineEmits<{ (e: 'close'): void }>()

const config = useRuntimeConfig()
const PAGE_SIZE = 24

const items = ref<any[]>([])
const total = ref(0)
const loading = ref(true)
const loadingMore = ref(false)
const searchFailed = ref(false)
const viewMode = ref<'list' | 'map'>('list')
const hasMore = computed(() => total.value > items.value.length)

function authHeaders(): Record<string, string> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ── Server-side filters ──────────────────────────────────────────────────
const minHomeScore = ref(0)
const propertyTypes = ref<string[]>(['any'])
const minBeds = ref<number | null>(null)
const minEpc = ref<string | null>(null)

function buildQuery(offset: number): Record<string, string | number> {
  const q: Record<string, string | number> = {
    q: props.query.trim(),
    offset,
    limit: PAGE_SIZE,
  }
  if (minHomeScore.value > 0) q.minHomeScore = minHomeScore.value
  if (propertyTypes.value[0] !== 'any') q.propertyType = propertyTypes.value.join(',')
  if (minBeds.value != null) q.minBedrooms = minBeds.value
  if (minEpc.value != null) q.minEpc = minEpc.value
  return q
}

// A newer search can overtake an older one (typing a second query, or a
// filter applied mid-flight); only the latest request is allowed to land.
let searchSeq = 0

async function runSearch() {
  if (!props.query.trim()) return
  const seq = ++searchSeq
  loading.value = true
  searchFailed.value = false
  items.value = []
  total.value = 0
  try {
    const res = await $fetch<{ items: any[]; total: number }>(
      `${config.public.apiBase}/property/search`,
      { query: buildQuery(0), headers: authHeaders() },
    )
    if (seq !== searchSeq) return
    items.value = res?.items ?? []
    total.value = res?.total ?? items.value.length
  } catch {
    if (seq !== searchSeq) return
    searchFailed.value = true
  } finally {
    if (seq === searchSeq) loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || loading.value || !hasMore.value) return
  const seq = searchSeq
  loadingMore.value = true
  try {
    const res = await $fetch<{ items: any[]; total: number }>(
      `${config.public.apiBase}/property/search`,
      { query: buildQuery(items.value.length), headers: authHeaders() },
    )
    if (seq !== searchSeq) return
    const seen = new Set(items.value.map((p) => p.id))
    const fresh = (res?.items ?? []).filter((p) => !seen.has(p.id))
    items.value = [...items.value, ...fresh]
    total.value = res?.total ?? total.value
    // A page that adds nothing new would otherwise leave the sentinel in view
    // and re-fire forever; trust what we actually hold instead.
    if (!fresh.length) total.value = items.value.length
  } catch {
    /* non-critical — the Load more button stays for a manual retry */
  } finally {
    loadingMore.value = false
  }
}

onMounted(runSearch)
watch(() => props.query, runSearch)

// ── Infinite scroll ──────────────────────────────────────────────────────
const loadMoreSentinel = ref<HTMLElement | null>(null)
let loadMoreObserver: IntersectionObserver | null = null

watch(loadMoreSentinel, (el) => {
  loadMoreObserver?.disconnect()
  loadMoreObserver = null
  if (!el || typeof IntersectionObserver === 'undefined') return
  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore()
    },
    { rootMargin: '300px' },
  )
  loadMoreObserver.observe(el)
})

// ── Popovers ─────────────────────────────────────────────────────────────
type PopoverKey = 'sort' | 'passport' | 'homescore' | 'ptype' | 'more'
const openPopover = ref<PopoverKey | null>(null)
const chipRowEl = ref<HTMLElement | null>(null)

// Drafts let a popover be dismissed without committing, and stop the slider
// from firing a backend search on every step it's dragged through.
const hsDraft = ref(0)
const typeDraft = ref<string[]>(['any'])
const bedsDraft = ref<number | null>(null)
const epcDraft = ref<string | null>(null)

function togglePopover(key: PopoverKey) {
  if (openPopover.value === key) {
    openPopover.value = null
    return
  }
  hsDraft.value = minHomeScore.value
  typeDraft.value = [...propertyTypes.value]
  bedsDraft.value = minBeds.value
  epcDraft.value = minEpc.value
  openPopover.value = key
}

function onDocPointerDown(e: PointerEvent) {
  if (!openPopover.value) return
  if (chipRowEl.value && !chipRowEl.value.contains(e.target as Node)) openPopover.value = null
}
function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') openPopover.value = null
}
onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('keydown', onDocKeydown)
})

function applyHomeScore() {
  openPopover.value = null
  if (hsDraft.value === minHomeScore.value) return
  minHomeScore.value = hsDraft.value
  runSearch()
}

function applyServerFilters() {
  openPopover.value = null
  const changed =
    typeDraft.value.join(',') !== propertyTypes.value.join(',') ||
    bedsDraft.value !== minBeds.value ||
    epcDraft.value !== minEpc.value
  if (!changed) return
  propertyTypes.value = [...typeDraft.value]
  minBeds.value = bedsDraft.value
  minEpc.value = epcDraft.value
  runSearch()
}

const propertyTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'detached', label: 'Detached' },
  { value: 'semi', label: 'Semi-detached' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'flat', label: 'Flat' },
  { value: 'bungalow', label: 'Bungalow' },
]
function toggleTypeDraft(v: string) {
  if (v === 'any') {
    typeDraft.value = ['any']
    return
  }
  const cur = typeDraft.value.filter((x) => x !== 'any')
  const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]
  typeDraft.value = next.length ? next : ['any']
}

const bedsOptions: { value: number | null; label: string }[] = [
  { value: null, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]
const epcOptions: { value: string | null; label: string }[] = [
  { value: null, label: 'Any' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B+' },
  { value: 'C', label: 'C+' },
  { value: 'D', label: 'D+' },
]

// ── Client-side: sort + passport state ───────────────────────────────────
type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'homescore_desc'
const sortBy = ref<SortKey>('relevance')
const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Best match' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'homescore_desc', label: 'HomeScore: high to low' },
]
const sortLabel = computed(() => sortOptions.find((o) => o.value === sortBy.value)?.label ?? 'Sort')

type ResultState = 'unclaimed' | 'private' | 'partiallyPublic' | 'public'
const ALL_STATES: ResultState[] = ['unclaimed', 'private', 'partiallyPublic', 'public']
const passportStates = ref<Set<ResultState>>(new Set(ALL_STATES))
const passportStateOptions: { value: ResultState; label: string }[] = [
  { value: 'unclaimed', label: 'Unclaimed' },
  { value: 'private', label: 'Private' },
  { value: 'partiallyPublic', label: 'Partially public' },
  { value: 'public', label: 'Public' },
]
const passportFiltered = computed(() => passportStates.value.size < ALL_STATES.length)

function togglePassportState(v: ResultState) {
  const next = new Set(passportStates.value)
  if (next.has(v)) next.delete(v)
  else next.add(v)
  // An empty selection would hide every result with no obvious way back.
  passportStates.value = next.size ? next : new Set(ALL_STATES)
}

const anyFilterActive = computed(
  () =>
    passportFiltered.value ||
    minHomeScore.value > 0 ||
    propertyTypes.value[0] !== 'any' ||
    minBeds.value != null ||
    minEpc.value != null,
)

function clearFilters() {
  const serverChanged =
    minHomeScore.value > 0 ||
    propertyTypes.value[0] !== 'any' ||
    minBeds.value != null ||
    minEpc.value != null
  passportStates.value = new Set(ALL_STATES)
  minHomeScore.value = 0
  propertyTypes.value = ['any']
  minBeds.value = null
  minEpc.value = null
  openPopover.value = null
  if (serverChanged) runSearch()
}

const displayed = computed(() => {
  const list = items.value.filter((p) => passportStates.value.has(stateOf(p)))
  if (sortBy.value === 'price_asc') {
    list.sort((a, b) => (a.estimatedPrice ?? Infinity) - (b.estimatedPrice ?? Infinity))
  } else if (sortBy.value === 'price_desc') {
    list.sort((a, b) => (b.estimatedPrice ?? -Infinity) - (a.estimatedPrice ?? -Infinity))
  } else if (sortBy.value === 'homescore_desc') {
    list.sort((a, b) => (homeScoreOf(b) ?? -1) - (homeScoreOf(a) ?? -1))
  }
  return list
})

// ── Card derivations ─────────────────────────────────────────────────────
function stateOf(p: any): ResultState {
  if (!p.hasPassport) return 'unclaimed'
  if (!p.passportPublished) return 'private'
  return (p.milestonePct ?? 0) >= 100 ? 'public' : 'partiallyPublic'
}
function badgeLabel(p: any): string {
  return { unclaimed: 'Unclaimed', private: 'Private', partiallyPublic: 'Partially Public', public: 'Public' }[stateOf(p)]
}
function stateTitle(p: any): string {
  const s = stateOf(p)
  if (s === 'unclaimed') return 'Property Passport unclaimed'
  return `Property Passport claimed · ${badgeLabel(p)}`
}
function stateSub(p: any): string {
  return {
    unclaimed: 'No owner has claimed it yet',
    private: 'Watch for updates',
    partiallyPublic: 'Some verified information available',
    public: 'Verified information',
  }[stateOf(p)]
}
function stateIcon(p: any): string {
  return {
    unclaimed: 'i-lucide-lock-open',
    private: 'i-lucide-lock',
    partiallyPublic: 'i-lucide-shield-half',
    public: 'i-lucide-shield-check',
  }[stateOf(p)]
}

function homeScoreOf(p: any): number | null {
  return p.homeScore ?? p.epcScore ?? null
}
function hsLabel(score: number): string {
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Average'
  return 'Needs work'
}
function hsColor(score: number): string {
  if (score >= 70) return '#00a19a'
  if (score >= 50) return '#d4922a'
  return '#dc4f3f'
}
function epcColor(rating: string): string {
  const map: Record<string, string> = {
    A: '#00b050', B: '#33b800', C: '#7cb342', D: '#a39200', E: '#e08a00', F: '#ff6600', G: '#e53935',
  }
  return map[(rating ?? '').toUpperCase()] ?? '#8e8e93'
}

// Only claims this page can back from the results in hand — there is no
// schools or crime data here, so no line pretends otherwise.
interface Insight { text: string; tone: 'good' | 'warn' | 'info' }
const homeScoreAverage = computed(() => {
  const scores = displayed.value.map(homeScoreOf).filter((n): n is number => n != null)
  return scores.length > 1 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
})
const claimedCount = computed(() => displayed.value.filter((p) => p.hasPassport).length)

function insightFor(p: any): Insight | null {
  if (stateOf(p) === 'unclaimed') {
    if (displayed.value.length < 2) return null
    if (claimedCount.value === 0) return { text: 'No home in these results is claimed yet', tone: 'info' }
    return { text: `${claimedCount.value} of ${displayed.value.length} homes here claimed`, tone: 'info' }
  }
  const hs = homeScoreOf(p)
  if (hs == null) return null
  if (hs < 50) return { text: 'Consider energy improvements', tone: 'warn' }
  if (homeScoreAverage.value != null && hs >= homeScoreAverage.value + 5) {
    return { text: 'Above the average HomeScore here', tone: 'good' }
  }
  return null
}

function openProperty(id: string) {
  navigateTo(`/property/${id}`)
}

// ── Save / watching ──────────────────────────────────────────────────────
const savedSet = ref(new Set<string>(props.savedIds))
watch(
  () => props.savedIds,
  (ids) => {
    savedSet.value = new Set(ids)
  },
)
const watchedSet = computed(() => new Set(props.watchedIds))
const savingId = ref<string | null>(null)
const authGateOpen = ref(false)

async function onSaveClick(p: any) {
  const headers = authHeaders()
  if (!headers.Authorization) {
    authGateOpen.value = true
    return
  }
  savingId.value = p.id
  try {
    const res = await $fetch<{ saved: boolean }>(
      `${config.public.apiBase}/property/${p.id}/save`,
      { method: 'POST', headers },
    )
    const next = new Set(savedSet.value)
    if (res.saved) next.add(p.id)
    else next.delete(p.id)
    savedSet.value = next
  } catch {
    /* the toggle simply doesn't change */
  } finally {
    savingId.value = null
  }
}

// ── Map view ─────────────────────────────────────────────────────────────
const STATE_COLOR: Record<ResultState, string> = {
  unclaimed: '#00a19a',
  private: '#f5510b',
  partiallyPublic: '#9185d6',
  public: '#231d45',
}
const mapEl = ref<HTMLElement | null>(null)
const mapReady = ref(false)
const withCoords = computed(() =>
  displayed.value.filter((p) => p.latitude != null && p.longitude != null),
)
let mapInstance: any = null
let mapboxLib: any = null
let mapMarkers: any[] = []

async function initMap() {
  if (!mapEl.value || mapInstance) return
  try {
    mapboxLib = (await import('mapbox-gl')).default
  } catch {
    return
  }
  if (!mapEl.value) return
  if (!document.querySelector('link[href*="mapbox-gl"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
    document.head.appendChild(link)
  }
  mapboxLib.accessToken = (config.public.mapboxToken as string) || ''
  const first = withCoords.value[0]
  mapInstance = new mapboxLib.Map({
    container: mapEl.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: first ? [first.longitude, first.latitude] : [-1.5491, 52.4068],
    zoom: first ? 14 : 6,
    attributionControl: false,
  })
  mapInstance.addControl(new mapboxLib.NavigationControl({ showCompass: false }), 'top-right')
  mapInstance.on('load', () => {
    mapReady.value = true
  })
  renderMarkers()
}

function renderMarkers() {
  if (!mapInstance || !mapboxLib) return
  mapMarkers.forEach((m) => m.remove())
  mapMarkers = []
  const bounds = new mapboxLib.LngLatBounds()
  for (const p of withCoords.value) {
    const el = document.createElement('button')
    el.type = 'button'
    el.title = `${p.addressLine1}${p.postcode ? ', ' + p.postcode : ''}`
    el.style.cssText = `width:18px;height:18px;border-radius:50%;padding:0;background:${
      STATE_COLOR[stateOf(p)]
    };border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);cursor:pointer;`
    el.addEventListener('click', () => openProperty(p.id))
    mapMarkers.push(new mapboxLib.Marker({ element: el }).setLngLat([p.longitude, p.latitude]).addTo(mapInstance))
    bounds.extend([p.longitude, p.latitude])
  }
  if (withCoords.value.length > 1) {
    mapInstance.fitBounds(bounds, { padding: 70, maxZoom: 16, duration: 0 })
  } else if (withCoords.value.length === 1) {
    mapInstance.jumpTo({ center: [withCoords.value[0].longitude, withCoords.value[0].latitude], zoom: 15 })
  }
}

function teardownMap() {
  mapMarkers.forEach((m) => m.remove())
  mapMarkers = []
  mapInstance?.remove?.()
  mapInstance = null
  mapReady.value = false
}

// The map container is v-if'd with the results, so it comes and goes with
// view switches, loading states and empty searches — build and tear down
// the Mapbox instance alongside it rather than leaking one per search.
watch(mapEl, async (el) => {
  if (!el) {
    teardownMap()
    return
  }
  await nextTick()
  initMap()
})
watch(withCoords, () => renderMarkers())

onBeforeUnmount(() => {
  loadMoreObserver?.disconnect()
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('keydown', onDocKeydown)
  teardownMap()
})
</script>

<style scoped>
.dsr {
  --ink: #1a1535;
  --ink-2: #4a5268;
  --ink-3: #8a90a6;
  --brand: #00a19a;
  --brand-deep: #00756f;
  --line: #e7eaf1;
  color: var(--ink);
  margin-top: 8px;
}

/* ── Header ──────────────────────────────────────────────────────── */
.dsr-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.dsr-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 16px 10px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsr-back:hover { border-color: rgba(0, 161, 154, 0.45); box-shadow: 0 6px 16px rgba(26, 21, 53, 0.08); }
.dsr-back-ic { width: 17px; height: 17px; }
.dsr-head-text { flex: 1; min-width: 0; }
.dsr-title {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
}
.dsr-sub {
  margin: 2px 0 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsr-toggle {
  display: inline-flex;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--line);
}
.dsr-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--ink-2);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.dsr-toggle-btn svg { width: 15px; height: 15px; }
.dsr-toggle-btn.on { background: var(--ink); color: #fff; }

/* ── Chips + popovers ────────────────────────────────────────────── */
.dsr-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
}
.dsr-chip-wrap { position: relative; }
.dsr-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px 9px 15px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.dsr-chip:hover, .dsr-chip.open { border-color: rgba(0, 161, 154, 0.5); }
.dsr-chip.on { background: var(--brand); border-color: var(--brand); color: #fff; }
.dsr-chip-ic { width: 14px; height: 14px; }
.dsr-chip-caret { width: 14px; height: 14px; opacity: 0.6; }
.dsr-chip-count {
  min-width: 18px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
}
.dsr-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 10px;
  border: none;
  background: transparent;
  color: var(--brand-deep);
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.dsr-clear svg { width: 14px; height: 14px; }

.dsr-pop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 50;
  min-width: 240px;
  padding: 16px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 2px 4px rgba(26, 21, 53, 0.04), 0 20px 44px rgba(26, 21, 53, 0.14);
}
.dsr-pop--wide { min-width: 340px; }
.dsr-pop-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.dsr-pop-title--gap { margin-top: 16px; }
.dsr-pop-value { font-size: 14px; letter-spacing: 0; text-transform: none; color: var(--brand-deep); }
.dsr-pop-note { margin: 10px 0 0; font-size: 12px; font-weight: 500; color: var(--ink-3); }
.dsr-opt {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 9px 8px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--ink);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.dsr-opt:hover { background: #f5f4f8; }
.dsr-radio {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid #b9b6c8;
}
.dsr-opt.on .dsr-radio {
  border-color: var(--brand);
  background: radial-gradient(circle, var(--brand) 42%, transparent 46%);
}
.dsr-check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 2px solid #b9b6c8;
  color: #fff;
}
.dsr-check svg { width: 12px; height: 12px; }
.dsr-check.on { background: var(--brand); border-color: var(--brand); }
.dsr-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.dsr-pill {
  padding: 8px 13px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #f7f6fa;
  color: var(--ink);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.dsr-pill.on { background: var(--brand); border-color: var(--brand); color: #fff; }
.dsr-pop-foot { display: flex; gap: 8px; margin-top: 14px; }
.dsr-btn,
.dsr-btn-ghost {
  flex: 1;
  padding: 11px 16px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
}
.dsr-btn { border: none; background: var(--brand); color: #fff; }
.dsr-btn:hover { background: var(--brand-deep); }
.dsr-btn-ghost { border: 1px solid var(--line); background: #fff; color: var(--ink); }
.dsr-btn--full { flex: 1; }
.dsr-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  margin: 8px 0 6px;
  border-radius: 999px;
  background: linear-gradient(to right, var(--brand) 0%, var(--brand) var(--fill, 0%), #e5e7eb var(--fill, 0%), #e5e7eb 100%);
  outline: none;
}
.dsr-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--brand);
  box-shadow: 0 2px 6px rgba(0, 161, 154, 0.25);
  cursor: pointer;
}
.dsr-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid var(--brand);
  cursor: pointer;
}
.dsr-slider-scale {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-3);
}

/* ── Grid + cards ────────────────────────────────────────────────── */
.dsr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 22px;
}
.dsr-skeleton {
  height: 380px;
  border-radius: 20px;
  background: linear-gradient(100deg, #eceaf3 30%, #f6f5fa 50%, #eceaf3 70%);
  background-size: 220% 100%;
  animation: dsr-shimmer 1.4s ease-in-out infinite;
}
@keyframes dsr-shimmer {
  from { background-position: 180% 0; }
  to { background-position: -40% 0; }
}
.dsr-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dsr-card:hover,
.dsr-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 161, 154, 0.4);
  box-shadow: 0 20px 40px rgba(31, 61, 98, 0.13);
  outline: none;
}
.dsr-photo {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #eceaf3;
  overflow: hidden;
}
.dsr-photo :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.dsr-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px 6px 8px;
  border-radius: 999px;
  background: rgba(35, 29, 69, 0.92);
  color: #fff;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(26, 21, 53, 0.25);
}
.dsr-photo .dsr-badge-ic { width: 16px; height: 16px; object-fit: contain; }
.dsr-badge small { font-size: 9.5px; font-weight: 700; opacity: 0.72; }
.dsr-badge b { font-size: 11px; font-weight: 800; }
.dsr-photo-count {
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.58);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}
.dsr-photo-count svg { width: 12px; height: 12px; }
.dsr-save {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px 7px 10px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: var(--ink);
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(26, 21, 53, 0.18);
  transition: transform 0.15s ease;
}
.dsr-save:hover { transform: scale(1.04); }
.dsr-save svg { width: 15px; height: 15px; }
.dsr-save.on { background: var(--brand); color: #fff; }
.dsr-save:disabled { opacity: 0.7; cursor: progress; }

.dsr-body { display: flex; flex-direction: column; flex: 1; padding: 16px 18px 18px; }
.dsr-price-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.dsr-price {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--brand-deep);
}
.dsr-price small { font-size: 11.5px; font-weight: 700; color: var(--ink-3); letter-spacing: 0; }
.dsr-watching {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 999px;
  background: #eafaf8;
  color: var(--brand-deep);
  font-size: 11px;
  font-weight: 800;
}
.dsr-watching svg { width: 13px; height: 13px; }
.dsr-addr {
  margin: 6px 0 2px;
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.015em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsr-meta { margin: 0; font-size: 12.5px; font-weight: 600; color: var(--ink-3); }
.dsr-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.dsr-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #f5f4f8;
  border: 1px solid rgba(35, 29, 69, 0.05);
  font-size: 11px;
  font-weight: 700;
  color: #545a72;
  text-transform: capitalize;
}
.dsr-tag--epc { color: #fff; border-color: transparent; }

.dsr-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(35, 29, 69, 0.06);
}
.dsr-tags + .dsr-foot,
.dsr-meta + .dsr-foot { margin-top: 14px; }
.dsr-hs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding-right: 12px;
  border-right: 1px solid rgba(35, 29, 69, 0.08);
}
.dsr-ring { position: relative; width: 38px; height: 38px; }
.dsr-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.dsr-ring-bg { fill: none; stroke: #ededf3; stroke-width: 4; }
.dsr-ring-fill { fill: none; stroke-width: 4; stroke-linecap: round; }
.dsr-ring-num {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--ink);
}
.dsr-hs-label {
  display: flex;
  flex-direction: column;
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ink-3);
}
.dsr-hs-label b { font-size: 12px; font-weight: 800; }
.dsr-pp { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dsr-pp-ic { width: 20px; height: 20px; flex-shrink: 0; }
.dsr-pp-ic--unclaimed { color: var(--brand); }
.dsr-pp-ic--private { color: #f5510b; }
.dsr-pp-ic--partiallyPublic { color: #9185d6; }
.dsr-pp-ic--public { color: #231d45; }
.dsr-pp-text { display: flex; flex-direction: column; min-width: 0; }
.dsr-pp-text strong { font-size: 12px; font-weight: 800; line-height: 1.3; }
.dsr-pp-text small { font-size: 11.5px; font-weight: 600; color: var(--ink-3); }

.dsr-insight {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 0;
  font-size: 12px;
  font-weight: 700;
}
.dsr-insight svg { width: 14px; height: 14px; flex-shrink: 0; }
.dsr-insight--good { color: var(--brand-deep); }
.dsr-insight--warn { color: #b45309; }
.dsr-insight--info { color: var(--ink-2); }

/* ── Load more ───────────────────────────────────────────────────── */
.dsr-more { display: flex; justify-content: center; padding: 28px 0 6px; }
.dsr-more-btn {
  padding: 12px 26px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--brand-deep);
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.dsr-more-btn:hover { border-color: rgba(0, 161, 154, 0.45); }
.dsr-spinner {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  border-top-color: var(--brand);
  animation: dsr-spin 0.8s linear infinite;
}
@keyframes dsr-spin { to { transform: rotate(360deg); } }
.dsr-end {
  margin: 0;
  padding: 26px 0 4px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-3);
}

/* ── Map ─────────────────────────────────────────────────────────── */
.dsr-map {
  position: relative;
  height: min(68vh, 640px);
  min-height: 420px;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(35, 29, 69, 0.08);
  background: #eceaf3;
}
.dsr-map-canvas { width: 100%; height: 100%; }
/* A pill rather than a full overlay: pins are planted before the style
   finishes loading, so they stay readable and clickable even if tiles are
   slow or never arrive. */
.dsr-map-loading {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 18px rgba(26, 21, 53, 0.14);
  color: var(--ink-2);
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
}
.dsr-map-legend {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 18px rgba(26, 21, 53, 0.14);
  font-size: 12px;
  font-weight: 700;
}
.dsr-map-legend span { display: inline-flex; align-items: center; gap: 6px; }
.dsr-map-legend i { width: 10px; height: 10px; border-radius: 50%; }

/* ── Empty ───────────────────────────────────────────────────────── */
.dsr-empty {
  padding: 64px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 22px;
}
.dsr-empty .dsr-btn { flex: none; margin-top: 18px; padding: 11px 22px; }
.dsr-empty-ring {
  display: inline-grid;
  place-items: center;
  width: 62px;
  height: 62px;
  margin-bottom: 16px;
  border-radius: 50%;
  background: #f3f2f7;
}
.dsr-empty-ic { width: 26px; height: 26px; color: #a8acbd; }
.dsr-empty-title { margin: 0 0 6px; font-size: 17px; font-weight: 800; }
.dsr-empty-sub { margin: 0; font-size: 14px; font-weight: 500; color: var(--ink-3); }

@media (max-width: 760px) {
  .dsr-head { flex-wrap: wrap; gap: 12px; }
  .dsr-head-text { order: 3; flex-basis: 100%; }
  .dsr-toggle { margin-left: auto; }
  .dsr-title { font-size: 20px; }
  .dsr-pop, .dsr-pop--wide { min-width: 260px; }
  .dsr-chip-wrap:nth-last-child(-n + 3) .dsr-pop { left: auto; right: 0; }
}
</style>
