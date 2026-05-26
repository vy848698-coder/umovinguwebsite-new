<template>
  <div class="sp-page mobile-container">
    <!-- Nav bar -->
    <div class="sp-nav-bar">
      <button class="sp-nav-icon-btn" aria-label="Back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="sp-nav-title">Saved Properties</div>
      <button
        class="sp-nav-icon-btn"
        aria-label="Search"
        @click="onToggleSearch"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>
    </div>

    <!-- Inline expanding search (navbar-style) -->
    <div v-if="searchOpen" class="sp-nav-search">
      <input
        ref="searchInputRef"
        v-model="search"
        type="text"
        class="sp-nav-search-input"
        placeholder="Search saved properties…"
        @keyup.escape="searchOpen = false"
      />
      <button
        v-if="search"
        class="sp-nav-search-clear"
        aria-label="Clear"
        @click="search = ''"
      >
        ×
      </button>
    </div>

    <main class="sp-body">
      <div class="atm-bg atm-bg-coral" />

      <!-- Hero -->
      <div class="sp-hero">
        <div class="hero-greeting">Properties you've hearted</div>
        <div class="sp-h1">
          Saved<span class="sp-h1-count">{{ properties.length }}</span>
        </div>
        <div class="hero-stats">
          <span><span class="stat-num teal">{{ countPassportReady }}</span>passport ready</span>
          <span class="stat-sep" />
          <span><span class="stat-num coral">{{ countPriceChanged }}</span>price changes</span>
          <span class="stat-sep" />
          <span><span class="stat-num">{{ countActiveOwners }}</span>owner active</span>
        </div>
      </div>

      <!-- Filter chips -->
      <div class="sp-filter-row">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          class="sp-chip"
          :class="{ active: activeFilter === chip.value }"
          @click="activeFilter = chip.value"
        >
          {{ chip.label }}
          <span class="sp-chip-num">{{ chip.count }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="sp-empty">Loading…</div>

      <!-- Empty state -->
      <div v-else-if="filteredProperties.length === 0" class="sp-empty">
        No saved properties yet
      </div>

      <!-- 2-up grid -->
      <div v-else class="sp-grid">
        <article
          v-for="item in filteredProperties"
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
  </div>
</template>

<script setup lang="ts">
import { usePropertyActions } from '~/composables/usePropertyActions'
import PropertyImage from '~/components/property/PropertyImage.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const search = ref('')
const loading = ref(true)
const properties = ref<any[]>([])
type FilterValue = 'all' | 'passport' | 'price' | 'recent'

const activeFilter = ref<FilterValue>('all')
const searchOpen = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)

const { fetchSavedProperties } = usePropertyActions()

onMounted(async () => {
  try {
    properties.value = await fetchSavedProperties()
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

async function onToggleSearch() {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInputRef.value?.focus?.()
  }
}

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

const filterChips = computed<{ value: FilterValue; label: string; count: number }[]>(() => [
  { value: 'all', label: 'All', count: properties.value.length },
  { value: 'passport', label: 'Passport ready', count: countPassportReady.value },
  { value: 'price', label: 'Price changed', count: countPriceChanged.value },
  { value: 'recent', label: 'Owner active', count: countActiveOwners.value },
])

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
</script>

<style scoped>
.sp-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 34px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.sp-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.sp-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  box-shadow:
    0 8px 22px rgba(19, 48, 71, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.sp-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow:
    0 12px 24px rgba(19, 48, 71, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.sp-nav-icon-btn svg { width: 18px; height: 18px; }
.sp-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.sp-nav-search {
  max-width: 1080px;
  margin: 0 auto 10px;
  padding: 0 14px;
  position: relative;
  z-index: 2;
}
.sp-nav-search-input {
  width: 100%;
  background: #f8fbff;
  border: 1px solid #d9e4f0;
  border-radius: 14px;
  padding: 11px 38px 11px 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #15273d;
  outline: none;
}
.sp-nav-search-input:focus {
  border-color: #7da7cf;
}
.sp-nav-search-clear {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 999px;
  background: #e8edf3;
  color: #4d5d72;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.sp-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 14px;
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
  padding: 24px 18px 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
  margin-bottom: 4px;
}
.sp-h1 {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -0.9px;
  line-height: 1.06;
  margin-bottom: 12px;
}
.sp-h1-count {
  display: inline-block;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #067a74;
  vertical-align: 6px;
  margin-left: 6px;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #50637a;
}
.hero-stats .stat-num { color: #17314a; font-weight: 800; margin-right: 4px; }
.hero-stats .stat-num.teal { color: #067a74; }
.hero-stats .stat-num.coral { color: #b85b36; }
.hero-stats .stat-sep { width: 4px; height: 4px; border-radius: 50%; background: #9ab0c9; display: inline-block; }

.sp-filter-row {
  display: flex;
  gap: 8px;
  padding: 14px 2px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  position: relative;
  z-index: 1;
}
.sp-filter-row::-webkit-scrollbar { display: none; }
.sp-chip {
  background: rgba(255, 255, 255, 0.85);
  color: #4c627b;
  border: 1px solid #d6e3f0;
  border-radius: 100px;
  padding: 8px 13px;
  font-size: 12.5px;
  font-weight: 700;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.sp-chip.active {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.sp-chip-num {
  font-size: 10px;
  font-weight: 800;
  color: #8aa0b8;
}
.sp-chip.active .sp-chip-num { color: rgba(255, 255, 255, 0.7); }

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
  color: #ff8b5a;
}
.sp-heart svg { width: 14px; height: 14px; fill: #ff8b5a; }

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
  background: rgba(255, 255, 255, 0.92);
  color: #4a5868;
  border-color: #d9e4f0;
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
  color: #4a5868;
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

@media (min-width: 768px) {
  .sp-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .sp-nav-search {
    padding: 0 18px;
  }

  .sp-body {
    padding: 0 18px;
  }

  .sp-hero {
    padding: 28px 24px 24px;
  }

  .sp-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 430px) {
  .sp-nav-title {
    font-size: 18px;
  }

  .sp-h1 {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sp-nav-icon-btn,
  .sp-tile,
  .sp-chip {
    transition: none;
    animation: none;
  }
}
</style>
