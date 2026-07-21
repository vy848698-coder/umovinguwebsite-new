<template>
  <div class="sp-page">

    <WebTopNav>
      <template #actions>
        <button class="sp-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="sp-quick-btn solid" type="button" @click="navigateTo('/explore')">Explore</button>
      </template>
    </WebTopNav>

    <main class="sp-shell sp-body">
      <div class="atm-bg atm-bg-coral" />

      <!-- Hero -->
      <div class="sp-hero">
        <div class="sp-hero-copy">
          <div class="hero-greeting">Properties you've hearted</div>
          <div class="sp-h1">
            Saved<span class="sp-h1-count">{{ properties.length }}</span>
          </div>
          <div class="hero-stats">
            <span><span class="stat-num teal">{{ countPassportReady }}</span>passport ready</span>
            <span class="stat-sep" />
            <span><span class="stat-num coral">{{ countPriceChanged }}</span>price changes</span>
            <span class="stat-sep" />
            <span><span class="stat-num teal">{{ countActiveOwners }}</span>owner active</span>
          </div>
        </div>
        <div class="sp-hero-art">
          <div class="sp-hero-frame">
            <img src="/welcome-house.png" alt="" />
            <span class="sp-hero-badge"><span class="dot" />Your saved homes</span>
          </div>
        </div>
      </div>

      <!-- Controls: filter chips + sort / view toggle -->
      <div class="sp-controls">
        <div class="sp-filter-row">
          <button
            v-for="chip in filterChips"
            :key="chip.value"
            class="sp-chip"
            :class="{ active: activeFilter === chip.value }"
            @click="activeFilter = chip.value"
          >
            <span v-if="chip.icon" class="sp-chip-ic" v-html="chip.icon" />
            {{ chip.label }}
            <span class="sp-chip-num">{{ chip.count }}</span>
          </button>
        </div>

        <div class="sp-controls-right">
          <div class="sp-sort">
            <div v-if="sortOpen" class="sp-sort-backdrop" @click="sortOpen = false" />
            <button class="sp-sort-btn" type="button" @click="sortOpen = !sortOpen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="4" y1="7" x2="14" y2="7" /><line x1="4" y1="12" x2="11" y2="12" /><line x1="4" y1="17" x2="8" y2="17" />
                <polyline points="16 9 19 6 22 9" /><line x1="19" y1="6" x2="19" y2="18" />
              </svg>
              {{ sortLabels[sortMode] }}
              <svg class="sp-sort-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-if="sortOpen" class="sp-sort-menu">
              <button
                v-for="opt in sortOptions"
                :key="opt.value"
                class="sp-sort-opt"
                :class="{ active: sortMode === opt.value }"
                @click="sortMode = opt.value; sortOpen = false"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="sp-view-toggle">
            <button
              class="sp-view-btn"
              :class="{ active: viewMode === 'grid' }"
              aria-label="Grid view"
              @click="viewMode = 'grid'"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </button>
            <button
              class="sp-view-btn"
              :class="{ active: viewMode === 'list' }"
              aria-label="List view"
              @click="viewMode = 'list'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="sp-empty">Loading…</div>

      <!-- Empty state -->
      <div v-else-if="filteredProperties.length === 0" class="sp-empty">
        No saved properties yet
      </div>

      <!-- 2-up grid / list -->
      <div v-else class="sp-grid" :class="`view-${viewMode}`">
        <article
          v-for="item in sortedProperties"
          :key="item.id"
          class="sp-tile"
          @click="navigateTo(`/property/${item.id}`)"
        >
          <div class="sp-photo">
            <PropertyImage
              :src="item.imageUrl"
              :alt="item.addressLine1"
              :show-caption="false"
              class="sp-photo-img-wrap"
            />

            <div class="sp-heart" @click.stop="onUnsave(item)">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            <div
              class="sp-status"
              :class="item.hasPassport ? 'passport-ready' : 'no-passport'"
            >
              <svg
                v-if="item.hasPassport"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ item.hasPassport ? 'Passport' : 'No passport' }}
            </div>

            <!-- Life signal flag (price-drop wins, then days-on-market, then owner-active) -->
            <div
              v-if="lifeSignal(item)"
              class="sp-priceflag"
              :class="lifeSignal(item)?.tone"
            >
              <span v-if="lifeSignal(item)?.icon" class="sp-flag-ic">{{ lifeSignal(item)?.icon }}</span>
              {{ lifeSignal(item)?.label }}
            </div>
          </div>
          <div class="sp-info">
            <div class="sp-addr">{{ item.addressLine1 }}</div>
            <div class="sp-locality">
              {{ [item.city || item.county, item.postcode].filter(Boolean).join(', ') }}
            </div>
            <div v-if="item.estimatedPrice" class="sp-price">
              £{{ Number(item.estimatedPrice).toLocaleString() }}
            </div>
          </div>
        </article>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { usePropertyActions } from '~/composables/usePropertyActions'
import PropertyImage from '~/components/property/PropertyImage.vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ middleware: 'auth' })

const search = ref('')
const loading = ref(true)
const properties = ref<any[]>([])
type FilterValue = 'all' | 'passport' | 'price' | 'recent'

const activeFilter = ref<FilterValue>('all')

type SortValue = 'newest' | 'oldest' | 'price-high' | 'price-low'
const sortMode = ref<SortValue>('newest')
const sortOpen = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const sortOptions: { value: SortValue; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'price-low', label: 'Price: low to high' },
]
const sortLabels = Object.fromEntries(sortOptions.map((o) => [o.value, o.label])) as Record<SortValue, string>

const { fetchSavedProperties } = usePropertyActions()

onMounted(async () => {
  try {
    properties.value = await fetchSavedProperties()
  } finally {
    loading.value = false
  }
})

function onUnsave(item: any) {
  // Optimistic remove from local list — wire to backend later
  properties.value = properties.value.filter((p) => p.id !== item.id)
}

// ── Life-signal helpers ─────────────────────────────────────────
const ACTIVE_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000 // owner-active = visited within 3 days
const STALE_DAYS_THRESHOLD = 30

function priceChangePct(item: any): number | null {
  const price = Number(item.estimatedPrice)
  const prev = Number(item.previousPrice ?? item.priorEstimatedPrice)
  if (!Number.isFinite(price) || !Number.isFinite(prev) || prev === 0) return null
  return Math.round(((price - prev) / prev) * 100)
}
function daysOnMarket(item: any): number | null {
  const created = item.listedAt ?? item.createdAt
  if (!created) return null
  const ms = Date.now() - new Date(created).getTime()
  if (!Number.isFinite(ms) || ms < 0) return null
  return Math.floor(ms / (24 * 60 * 60 * 1000))
}
function ownerActive(item: any): boolean {
  const last = item.lastVisitedAt
  if (!last) return false
  const ms = Date.now() - new Date(last).getTime()
  return Number.isFinite(ms) && ms >= 0 && ms <= ACTIVE_THRESHOLD_MS
}

function lifeSignal(item: any) {
  const pct = priceChangePct(item)
  if (pct !== null && pct !== 0) {
    if (pct < 0) {
      return { label: `${pct}%`, tone: 'priceflag--down', icon: '↓' }
    }
    return { label: `+${pct}%`, tone: 'priceflag--up', icon: '↑' }
  }
  if (ownerActive(item)) {
    return { label: 'Owner active', tone: 'priceflag--active', icon: '●' }
  }
  const dom = daysOnMarket(item)
  if (dom !== null && dom >= STALE_DAYS_THRESHOLD) {
    return { label: `${dom}d listed`, tone: 'priceflag--neutral', icon: '' }
  }
  return null
}

// ── Filter chips ────────────────────────────────────────────────
const countPassportReady = computed(
  () => properties.value.filter((p) => p.hasPassport).length,
)
const countPriceChanged = computed(
  () => properties.value.filter((p) => priceChangePct(p) !== null).length,
)
const countActiveOwners = computed(
  () => properties.value.filter(ownerActive).length,
)

const ICON_PASSPORT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="2.6"/><line x1="9" y1="16" x2="15" y2="16"/></svg>'
const ICON_PRICE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 6.5C16 5 14.7 4 13 4c-2 0-3.4 1.3-3.4 3 0 3.6 6.4 2.4 6.4 6 0 1.8-1.6 3-3.6 3-1.9 0-3.4-1-3.4-2.7"/><line x1="6" y1="11" x2="13" y2="11"/></svg>'
const ICON_OWNER =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 19c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/></svg>'

const filterChips = computed<{ value: FilterValue; label: string; count: number; icon?: string }[]>(() => [
  { value: 'all', label: 'All', count: properties.value.length },
  { value: 'passport', label: 'Passport ready', count: countPassportReady.value, icon: ICON_PASSPORT },
  { value: 'price', label: 'Price changed', count: countPriceChanged.value, icon: ICON_PRICE },
  { value: 'recent', label: 'Owner active', count: countActiveOwners.value, icon: ICON_OWNER },
])

function listedTime(item: any): number {
  const d = item.listedAt ?? item.createdAt ?? item.savedAt
  const t = d ? new Date(d).getTime() : NaN
  return Number.isFinite(t) ? t : 0
}

const filteredProperties = computed(() => {
  let list = properties.value
  if (activeFilter.value === 'passport') list = list.filter((p) => p.hasPassport)
  else if (activeFilter.value === 'price') list = list.filter((p) => priceChangePct(p) !== null)
  else if (activeFilter.value === 'recent') list = list.filter(ownerActive)
  const q = search.value.trim().toLowerCase()
  if (!q) return list
  return list.filter((item) =>
    [item.addressLine1, item.city, item.county, item.postcode]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})

const sortedProperties = computed(() => {
  const list = [...filteredProperties.value]
  switch (sortMode.value) {
    case 'oldest':
      return list.sort((a, b) => listedTime(a) - listedTime(b))
    case 'price-high':
      return list.sort((a, b) => Number(b.estimatedPrice || 0) - Number(a.estimatedPrice || 0))
    case 'price-low':
      return list.sort((a, b) => Number(a.estimatedPrice || 0) - Number(b.estimatedPrice || 0))
    case 'newest':
    default:
      return list.sort((a, b) => listedTime(b) - listedTime(a))
  }
})
</script>

<style scoped>
.sp-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background: #f3f2ef;
  color: var(--fx-text);
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.sp-page :deep(.webtop-nav) {
  background: rgba(243, 242, 239, 0.86);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
}

.mesh {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.025;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72), transparent 92%);
}

.ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.1;
}

.ambient-a {
  width: 260px;
  height: 260px;
  top: 120px;
  left: -60px;
  background: rgba(0, 161, 154, 0.3);
}

.ambient-b {
  width: 280px;
  height: 280px;
  top: 160px;
  right: -80px;
  background: rgba(95, 139, 255, 0.26);
}

.sp-shell {
  width: min(1260px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.sp-quick-btn {
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}

.sp-quick-btn.solid {
  border: 1px solid transparent;
  color: #fff;
  background: #00a19a;
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.sp-body {
  position: relative;
  z-index: 1;
  padding-top: 8px;
  flex: 1;
  padding-bottom: 28px;
}

.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-coral {
  background: radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

.sp-hero {
  margin-top: 8px;
  border-radius: 28px;
  padding: 30px 30px 28px;
  border: 1px solid rgba(40, 42, 96, 0.6);
  background: linear-gradient(145deg, #1b1b4b 0%, #15153c 55%, #191641 100%);
  box-shadow: 0 20px 48px rgba(18, 24, 64, 0.28);
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.sp-hero-copy {
  position: relative;
  z-index: 1;
}
.sp-hero-art {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}
.sp-hero-art::before {
  content: '';
  position: absolute;
  inset: -30% -20%;
  background: radial-gradient(circle at 60% 50%, rgba(46, 198, 182, 0.28) 0%, rgba(46, 198, 182, 0) 64%);
  pointer-events: none;
}
.sp-hero-frame {
  position: relative;
  z-index: 1;
  width: 248px;
  max-width: 42vw;
  aspect-ratio: 16 / 10;
  border-radius: 20px;
  overflow: hidden;
  padding: 1px;
  background: linear-gradient(150deg, rgba(46, 198, 182, 0.65), rgba(255, 255, 255, 0.08) 45%, rgba(95, 139, 255, 0.5));
  box-shadow:
    0 22px 44px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.sp-hero-frame img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 19px;
}
.sp-hero-frame::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 19px;
  background: linear-gradient(180deg, rgba(21, 21, 60, 0) 55%, rgba(21, 21, 60, 0.45) 100%);
  pointer-events: none;
}
.sp-hero-badge {
  position: absolute;
  left: 12px;
  bottom: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(10, 12, 38, 0.55);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.2px;
}
.sp-hero-badge .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2ec6b6;
  box-shadow: 0 0 0 3px rgba(46, 198, 182, 0.25);
}
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #4fd6c8;
  font-weight: 800;
  margin-bottom: 6px;
}
.sp-h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1.04;
  margin-bottom: 16px;
}
.sp-h1-count {
  display: inline-block;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #2ec6b6;
  vertical-align: 8px;
  margin-left: 8px;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 700;
  color: #aeb6d6;
}
.hero-stats .stat-num { color: #fff; font-weight: 800; margin-right: 4px; }
.hero-stats .stat-num.teal { color: #2ec6b6; }
.hero-stats .stat-num.coral { color: #ff8b5a; }
.hero-stats .stat-sep { width: 4px; height: 4px; border-radius: 50%; background: rgba(255, 255, 255, 0.28); display: inline-block; }

.sp-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 2px 18px;
  position: relative;
  z-index: 1;
}
.sp-filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;
  flex: 1;
}
.sp-filter-row::-webkit-scrollbar { display: none; }
.sp-chip {
  background: #fff;
  color: #4c627b;
  border: 1px solid #d6e3f0;
  border-radius: 100px;
  padding: 9px 15px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.sp-chip:hover { border-color: #b9d5ea; }
.sp-chip-ic { display: inline-flex; }
.sp-chip-ic :deep(svg) { width: 15px; height: 15px; display: block; }
.sp-chip.active {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.sp-chip-num {
  font-size: 11px;
  font-weight: 800;
  color: #2ec6b6;
}
.sp-chip.active .sp-chip-num { color: rgba(255, 255, 255, 0.85); }

.sp-controls-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.sp-sort {
  position: relative;
}
.sp-sort-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9;
}
.sp-sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #d6e3f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #2b3c56;
  cursor: pointer;
  white-space: nowrap;
}
.sp-sort-btn:hover { border-color: #b9d5ea; }
.sp-sort-btn svg { width: 16px; height: 16px; }
.sp-sort-caret { width: 14px !important; height: 14px !important; color: #7388a1; }
.sp-sort-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 10;
  min-width: 190px;
  background: #fff;
  border: 1px solid #e2ecf6;
  border-radius: 14px;
  box-shadow: 0 16px 32px rgba(21, 58, 95, 0.16);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sp-sort-opt {
  text-align: left;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #4c627b;
  padding: 9px 11px;
  border-radius: 9px;
  cursor: pointer;
}
.sp-sort-opt:hover { background: #f1f7fd; color: #17314a; }
.sp-sort-opt.active { background: rgba(0, 161, 154, 0.1); color: #067a74; }

.sp-view-toggle {
  display: inline-flex;
  gap: 2px;
  background: #fff;
  border: 1px solid #d6e3f0;
  border-radius: 12px;
  padding: 3px;
}
.sp-view-btn {
  width: 34px;
  height: 34px;
  border: 0;
  background: transparent;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8aa0b8;
}
.sp-view-btn svg { width: 17px; height: 17px; }
.sp-view-btn.active {
  background: rgba(0, 161, 154, 0.12);
  color: #067a74;
}

.sp-empty {
  text-align: center;
  padding: 40px 0;
  color: #7388a1;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.sp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 0;
  position: relative;
  z-index: 1;
}
.sp-tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  border-radius: 18px;
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  padding: 10px;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.sp-tile:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.sp-photo {
  position: relative;
  aspect-ratio: 152 / 130;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(180deg, #d6e8f5, #c1d8ea);
}
.sp-photo-img-wrap {
  width: 100%;
  height: 100%;
  display: block;
}
.sp-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff4d6d;
  box-shadow: 0 4px 10px rgba(16, 27, 43, 0.16);
}
.sp-heart svg { width: 15px; height: 15px; fill: #ff4d6d; }

.sp-status {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 46, 41, 0.85);
  color: #f5c44c;
  font-size: 9px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 100px;
  letter-spacing: 0.3px;
  border: 0.5px solid rgba(245, 196, 76, 0.3);
}
.sp-status.passport-ready { background: linear-gradient(135deg, #1f4b43, #0f2e29); }
.sp-status.no-passport {
  background: rgba(20, 27, 56, 0.82);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.18);
}
.sp-status svg { width: 8px; height: 8px; }

.sp-priceflag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #ff8b5a;
  color: #fff;
  font-size: 9.5px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 3px;
}
.sp-priceflag.priceflag--up {
  background: #f5c44c;
  color: #6f4d14;
}
.sp-priceflag.priceflag--active {
  background: #3dbda3;
}
.sp-priceflag.priceflag--neutral {
  background: rgba(255, 255, 255, 0.95);
  color: #067a74;
}
.sp-flag-ic { font-size: 10px; }

.sp-info { padding: 0 2px 2px; }
.sp-addr {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
  line-height: 1.2;
  margin-bottom: 2px;
}
.sp-locality {
  font-size: 11.5px;
  font-weight: 600;
  color: #7388a1;
  margin-bottom: 4px;
}
.sp-price {
  font-size: 13.5px;
  font-weight: 800;
  color: #067a74;
  letter-spacing: -0.3px;
}

/* List view: single-column horizontal tiles */
.sp-grid.view-list {
  grid-template-columns: 1fr;
  gap: 12px;
}
.sp-grid.view-list .sp-tile {
  flex-direction: row;
  align-items: center;
  gap: 14px;
  padding: 12px;
}
.sp-grid.view-list .sp-photo {
  width: 168px;
  flex-shrink: 0;
  aspect-ratio: 16 / 11;
}
.sp-grid.view-list .sp-info {
  flex: 1;
  padding: 0;
}

@media (min-width: 768px) {
  .sp-grid.view-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .sp-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 20px 20px;
  }
  .sp-hero-art {
    display: none;
  }
  .sp-h1 { font-size: 34px; }
  .sp-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .sp-controls-right {
    justify-content: space-between;
  }
  .sp-grid.view-list .sp-photo {
    width: 124px;
  }
}

@media (max-width: 430px) {
  .sp-h1 {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sp-tile,
  .sp-chip {
    transition: none;
    animation: none;
  }
}
</style>
