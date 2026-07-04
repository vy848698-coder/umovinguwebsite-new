
<template>
  <div class="ss-page">
    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="ss-body">
      <!-- Hero banner -->
      <section class="ss-hero">
        <div class="ss-hero-left">
          <div class="ss-hero-kicker">
            <Icon name="heroicons:camera" class="ss-kicker-ic" />
            Property Snapshots
          </div>
          <h1 class="ss-hero-title">Your Saved Snapshots</h1>
          <p class="ss-hero-sub">Organize and browse your wishlisted properties in one place.</p>

          <div class="ss-stats">
            <div class="ss-stat">
              <span class="ss-stat-num">{{ snapshots.length }}</span>
              <span class="ss-stat-label">Total saved</span>
            </div>
            <div class="ss-stat-div" />
            <div class="ss-stat">
              <span class="ss-stat-num">{{ recentCount }}</span>
              <span class="ss-stat-label">Added this month</span>
            </div>
          </div>
        </div>

        <div class="ss-hero-right">
          <div class="ss-search-wrap">
            <Icon name="heroicons:magnifying-glass" class="ss-search-ic" />
            <input
              v-model="search"
              type="text"
              class="ss-search-input"
              placeholder="Search by address, city or postcode…"
            />
            <button v-if="search" class="ss-search-clear" aria-label="Clear" @click="search = ''">
              <Icon name="heroicons:x-mark" />
            </button>
          </div>

          <div class="ss-filters">
            <button
              v-for="f in filters"
              :key="f.key"
              class="ss-filter-pill"
              :class="{ active: activeFilter === f.key }"
              @click="activeFilter = f.key"
            >
              {{ f.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- List / grid -->
      <section class="ss-content">
        <div class="ss-content-head">
          <h2 class="ss-section-title">
            {{ filteredSnapshots.length }} Snapshot{{ filteredSnapshots.length !== 1 ? 's' : '' }}
          </h2>
          <div class="ss-view-toggle">
            <button
              class="ss-view-btn"
              :class="{ active: viewMode === 'grid' }"
              aria-label="Grid view"
              @click="viewMode = 'grid'"
            >
              <Icon name="heroicons:squares-2x2" />
            </button>
            <button
              class="ss-view-btn"
              :class="{ active: viewMode === 'list' }"
              aria-label="List view"
              @click="viewMode = 'list'"
            >
              <Icon name="heroicons:bars-3" />
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="ss-state">
          <div class="ss-spinner" />
          <p>Loading your snapshots…</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredSnapshots.length === 0" class="ss-empty">
          <div class="ss-empty-icon">
            <Icon name="heroicons:camera" class="ss-empty-ic" />
          </div>
          <h3 class="ss-empty-title">{{ search ? 'No results found' : 'No snapshots yet' }}</h3>
          <p class="ss-empty-sub">
            {{ search
              ? 'Try a different search term.'
              : 'Tap the heart icon on any property to save it here.' }}
          </p>
          <button v-if="!search" type="button" class="ss-empty-cta" @click="navigateTo('/explore')">
            Explore properties <Icon name="heroicons:arrow-right" class="ss-empty-cta-ic" />
          </button>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="ss-grid">
          <button
            v-for="item in filteredSnapshots"
            :key="item.id"
            class="ss-card"
            type="button"
            @click="navigateTo(`/property/${item.id}`)"
          >
            <div class="ss-card-img-wrap">
              <div class="ss-card-img-placeholder">
                <Icon name="heroicons:home-modern" class="ss-card-img-ic" />
              </div>
              <div class="ss-card-date-badge">
                <Icon name="heroicons:heart-solid" class="ss-card-heart" />
                {{ formatDate(item.wishlistedAt) }}
              </div>
            </div>
            <div class="ss-card-body">
              <div class="ss-card-address">{{ item.addressLine1 }}</div>
              <div class="ss-card-location">
                <Icon name="heroicons:map-pin" class="ss-card-loc-ic" />
                {{ [item.city || item.county, item.postcode].filter(Boolean).join(' · ') }}
              </div>
            </div>
            <div class="ss-card-footer">
              <span class="ss-card-view">View property</span>
              <Icon name="heroicons:arrow-right" class="ss-card-arrow" />
            </div>
          </button>
        </div>

        <!-- List view -->
        <div v-else class="ss-list">
          <button
            v-for="item in filteredSnapshots"
            :key="item.id"
            class="ss-row"
            type="button"
            @click="navigateTo(`/property/${item.id}`)"
          >
            <div class="ss-row-icon">
              <Icon name="heroicons:home-modern" />
            </div>
            <div class="ss-row-body">
              <div class="ss-row-address">{{ item.addressLine1 }}</div>
              <div class="ss-row-meta">
                {{ [item.city || item.county, item.postcode].filter(Boolean).join(' · ') }}
                <span class="ss-row-dot">·</span>
                Added {{ formatDate(item.wishlistedAt) }}
              </div>
            </div>
            <Icon name="heroicons:chevron-right" class="ss-row-chev" />
          </button>
        </div>
      </section>

      <div class="ss-footnote">
        <Icon name="heroicons:lock-closed" class="ss-footnote-ic" />
        Your data is encrypted and never shared with third parties.
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'
import { usePropertyActions } from '~/composables/usePropertyActions'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const search = ref('')
const loading = ref(true)
const snapshots = ref<any[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const activeFilter = ref('all')

const filters = [
  { key: 'all', label: 'All' },
  { key: 'recent', label: 'Recent' },
  { key: 'oldest', label: 'Oldest first' },
]

const { fetchWishlist } = usePropertyActions()

onMounted(async () => {
  try {
    snapshots.value = await fetchWishlist()
  } finally {
    loading.value = false
  }
})

const recentCount = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return snapshots.value.filter((s) => {
    if (!s.wishlistedAt) return false
    return new Date(s.wishlistedAt) >= startOfMonth
  }).length
})

const filteredSnapshots = computed(() => {
  let list = [...snapshots.value]

  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((item) =>
      [item.addressLine1, item.city, item.county, item.postcode]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }

  if (activeFilter.value === 'recent') {
    list = list.sort((a, b) => new Date(b.wishlistedAt ?? 0).getTime() - new Date(a.wishlistedAt ?? 0).getTime())
  } else if (activeFilter.value === 'oldest') {
    list = list.sort((a, b) => new Date(a.wishlistedAt ?? 0).getTime() - new Date(b.wishlistedAt ?? 0).getTime())
  }

  return list
})

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const goBack = () => router.back()
</script>

<style scoped>
.ss-page {
  min-height: 100dvh;
  background: linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #1f2b3f;
}

/* ── Body ── */
.ss-body {
  width: min(1280px, calc(100% - 64px));
  margin: 0 auto;
  padding: 36px 0 72px;
}

/* ── Hero ── */
.ss-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
  background: linear-gradient(120deg, #e8f7f2 0%, #eef3ff 55%, #f1ecfe 100%);
  border: 1px solid #e6eef8;
  border-radius: 24px;
  padding: 32px 36px;
  margin-bottom: 28px;
  box-shadow: 0 14px 38px rgba(15, 44, 76, 0.06);
}

.ss-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00a19a;
  background: rgba(0, 161, 154, 0.1);
  border-radius: 100px;
  padding: 5px 12px;
  margin-bottom: 14px;
}
.ss-kicker-ic { width: 14px; height: 14px; }

.ss-hero-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1.2px;
  color: #231d45;
  line-height: 1.1;
  margin: 0 0 8px;
}

.ss-hero-sub {
  font-size: 15px;
  color: #5f7488;
  line-height: 1.55;
  margin: 0 0 24px;
  max-width: 400px;
}

.ss-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}
.ss-stat { display: flex; flex-direction: column; gap: 2px; }
.ss-stat-num { font-size: 28px; font-weight: 800; color: #00a19a; letter-spacing: -0.5px; line-height: 1; }
.ss-stat-label { font-size: 12px; font-weight: 600; color: #6f8398; }
.ss-stat-div { width: 1px; height: 36px; background: rgba(0,0,0,0.1); }

/* Search + filters */
.ss-hero-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  height: 100%;
}

.ss-search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid #e2eaf5;
  border-radius: 14px;
  padding: 0 14px;
  height: 50px;
  box-shadow: 0 4px 12px rgba(15, 44, 76, 0.05);
  transition: border-color 0.18s;
}
.ss-search-wrap:focus-within { border-color: #00a19a; }
.ss-search-ic { width: 18px; height: 18px; color: #9fb0c2; flex-shrink: 0; }
.ss-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #1f2b3f;
}
.ss-search-input::placeholder { color: #aab8c8; }
.ss-search-clear {
  border: none;
  background: none;
  cursor: pointer;
  color: #9fb0c2;
  display: flex;
  padding: 0;
}
.ss-search-clear :deep(svg) { width: 18px; height: 18px; }

.ss-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.ss-filter-pill {
  border: 1.5px solid #e2eaf5;
  background: #fff;
  border-radius: 100px;
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #5f7488;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.16s;
}
.ss-filter-pill:hover { border-color: #b9d5ea; color: #231d45; }
.ss-filter-pill.active { background: #00a19a; border-color: #00a19a; color: #fff; box-shadow: 0 6px 16px rgba(0,161,154,0.24); }

/* ── Content area ── */
.ss-content-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.ss-section-title {
  font-size: 18px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.3px;
}
.ss-view-toggle {
  display: flex;
  gap: 4px;
  background: #fff;
  border: 1px solid #e2eaf5;
  border-radius: 10px;
  padding: 4px;
}
.ss-view-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #8fa5bc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.16s;
}
.ss-view-btn :deep(svg) { width: 18px; height: 18px; }
.ss-view-btn.active { background: #00a19a; color: #fff; }

/* ── Grid view ── */
.ss-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ss-card {
  border-radius: 20px;
  background: #fff;
  border: 1px solid #e8eef5;
  box-shadow: 0 8px 24px rgba(15, 44, 76, 0.06);
  overflow: hidden;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  display: flex;
  flex-direction: column;
  transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s;
}
.ss-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(15, 44, 76, 0.12); }

.ss-card-img-wrap {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #e3f5f1 0%, #eef3ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ss-card-img-ic { width: 52px; height: 52px; color: #00a19a; opacity: 0.4; }
.ss-card-date-badge {
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.9);
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #231d45;
  backdrop-filter: blur(8px);
}
.ss-card-heart { width: 12px; height: 12px; color: #ef5350; }

.ss-card-body { padding: 14px 16px 10px; flex: 1; }
.ss-card-address { font-size: 15px; font-weight: 800; color: #231d45; letter-spacing: -0.2px; margin-bottom: 5px; }
.ss-card-location { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #6f8398; font-weight: 600; }
.ss-card-loc-ic { width: 13px; height: 13px; flex-shrink: 0; }

.ss-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 14px;
  border-top: 1px solid #f0f4f9;
}
.ss-card-view { font-size: 13px; font-weight: 700; color: #00a19a; }
.ss-card-arrow { width: 16px; height: 16px; color: #00a19a; }

/* ── List view ── */
.ss-list { display: flex; flex-direction: column; gap: 8px; }

.ss-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1px solid #e8eef5;
  border-radius: 16px;
  padding: 14px 18px;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 12px rgba(15,44,76,0.04);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.ss-row:hover { border-color: #c8e0f5; box-shadow: 0 8px 22px rgba(15,44,76,0.09); }

.ss-row-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #e3f5f1;
  color: #00a19a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ss-row-icon :deep(svg) { width: 20px; height: 20px; }
.ss-row-body { flex: 1; min-width: 0; }
.ss-row-address { font-size: 15px; font-weight: 800; color: #231d45; letter-spacing: -0.2px; }
.ss-row-meta { font-size: 13px; color: #6f8398; font-weight: 600; margin-top: 2px; }
.ss-row-dot { margin: 0 4px; }
.ss-row-chev { width: 18px; height: 18px; color: #c0cfe0; flex-shrink: 0; }

/* ── States ── */
.ss-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  color: #8fa5bc;
  font-size: 15px;
}
.ss-spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid #e3f5f1;
  border-top-color: #00a19a;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.ss-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 24px;
}
.ss-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: linear-gradient(135deg, #e3f5f1, #eef3ff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.ss-empty-ic { width: 38px; height: 38px; color: #00a19a; }
.ss-empty-title { font-size: 20px; font-weight: 800; color: #231d45; margin: 0 0 8px; }
.ss-empty-sub { font-size: 15px; color: #6f8398; line-height: 1.55; max-width: 340px; margin: 0 0 24px; }
.ss-empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  background: linear-gradient(120deg, #00a99a, #0c8f74);
  color: #fff;
  box-shadow: 0 10px 22px rgba(0,161,154,0.26);
  transition: transform 0.2s, box-shadow 0.2s;
}
.ss-empty-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(0,161,154,0.32); }
.ss-empty-cta-ic { width: 15px; height: 15px; }

/* ── Footnote ── */
.ss-footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 600;
  color: #8195aa;
  padding: 24px 0 0;
}
.ss-footnote-ic { width: 14px; height: 14px; }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .ss-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .ss-hero { grid-template-columns: 1fr; gap: 24px; }
}
@media (max-width: 760px) {
  .ss-body { width: calc(100% - 32px); padding: 24px 0 56px; }
  .ss-hero { padding: 24px; }
  .ss-hero-title { font-size: 28px; }
  .ss-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .ss-hero-title { font-size: 24px; }
  .ss-stats { flex-wrap: wrap; gap: 14px; }
}
</style>
