<template>
  <div class="sp-page">
    <!-- Back lives in the nav bar: this page is reached from the dashboard's
         Watching card, so "back" means the dashboard rather than a nav
         destination. -->
    <WebTopNav>
      <template #actions>
        <button class="sp-nav-back" type="button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </template>
      <template #mobile-extra="{ closeMenu }">
        <button type="button" class="sp-mobile-back" @click="closeMenu(); goBack()">
          Back
        </button>
      </template>
    </WebTopNav>

    <main class="sp-body">
      <div class="atm-bg teal" />

      <!-- Hero -->
      <div class="sp-hero">
        <div class="sp-hero-copy">
          <div class="hero-greeting">Homes you're getting alerts for</div>
          <div class="sp-h1">
            Watching<span class="sp-h1-count">{{ properties.length }}</span>
          </div>
          <div class="hero-stats">
            <span><span class="stat-num teal">{{ countPassportReady }}</span>passport ready</span>
            <span class="stat-sep" />
            <span><span class="stat-num">{{ countHomescoreAlerts }}</span>HomeScore alerts</span>
          </div>
        </div>

        <!-- Search moved out of the old header row; kept inline so it stays
             reachable now that the row is gone. -->
        <div v-if="properties.length" class="sp-search">
          <svg class="sp-search-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            v-model="search"
            type="text"
            class="sp-search-input"
            placeholder="Search watched properties…"
            @keyup.escape="search = ''"
          />
          <button
            v-if="search"
            class="sp-search-clear"
            aria-label="Clear search"
            @click="search = ''"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="sp-empty">Loading…</div>

      <!-- Empty state -->
      <div v-else-if="filteredProperties.length === 0" class="sp-empty">
        <template v-if="properties.length === 0">
          <div class="sp-empty-title">Nothing watched yet</div>
          <div class="sp-empty-sub">
            Open a property and tap "Watch this property" to get alerted about
            claims, price changes and HomeScore updates.
          </div>
          <button class="sp-empty-cta" @click="navigateTo('/marketplace')">
            Explore properties
          </button>
        </template>
        <template v-else>No watched properties match your search</template>
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

            <button
              type="button"
              class="sp-unwatch"
              aria-label="Stop watching"
              @click.stop="onUnwatch(item)"
            >
              <img src="/op-icons/misc/bell.png" alt="" class="sp-unwatch-ic" loading="lazy" />
            </button>

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
          </div>
          <div class="sp-info">
            <div class="sp-addr">{{ item.addressLine1 }}</div>
            <div class="sp-locality">
              {{ [item.city || item.county, item.postcode].filter(Boolean).join(', ') }}
            </div>
            <div v-if="item.homeScore != null" class="sp-hs">
              HomeScore <strong>{{ item.homeScore }}/100</strong>
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

const router = useRouter()
const search = ref('')
const loading = ref(true)
const properties = ref<any[]>([])

const { fetchWatchedProperties, unwatchProperty } = usePropertyActions()

onMounted(async () => {
  try {
    properties.value = await fetchWatchedProperties()
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}

async function onUnwatch(item: any) {
  // Optimistic remove, then persist via the delete endpoint. If it fails,
  // restore the item.
  const snapshot = properties.value
  properties.value = properties.value.filter((p) => p.id !== item.id)
  const ok = await unwatchProperty(item.id)
  if (!ok) properties.value = snapshot
}

const countPassportReady = computed(
  () => properties.value.filter((p) => p.hasPassport).length,
)
const countHomescoreAlerts = computed(
  () => properties.value.filter((p) => p.watchPrefs?.homescore).length,
)

const filteredProperties = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return properties.value
  return properties.value.filter((item) =>
    [item.addressLine1, item.city, item.county, item.postcode]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})
</script>

<style scoped>
/* Page surface.
   Flex column with the body growing: the footer then sits at the bottom of
   short pages instead of floating mid-screen. The old `padding-bottom` here
   painted a 32px band of page background *below* the full-bleed footer. */
.sp-page {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #f3f2ef;
  color: #0e2840;
  position: relative;
}

/* Centred column — without this the grid spans the full 1440px and a single
   card stretches to half the screen. */
.sp-shell,
.sp-hero,
.sp-grid,
.sp-empty {
  width: min(1180px, calc(100% - 48px));
  margin-left: auto;
  margin-right: auto;
}

/* Back button in the nav bar */
.sp-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border: 1px solid #00a19a;
  border-radius: 12px;
  background: #00a19a;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}
.sp-nav-back:hover {
  background: #008c86;
  border-color: #008c86;
  transform: translateX(-2px);
}
.sp-nav-back svg { width: 16px; height: 16px; }
.sp-mobile-back {
  width: 100%;
  border: 1px solid #dde8f3;
  border-radius: 10px;
  background: #fff;
  color: #22405f;
  font: inherit;
  font-weight: 700;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
}

/* Inline search, previously the magnifier toggle in the removed header row */
.sp-search {
  position: relative;
  flex: 0 1 300px;
  min-width: 220px;
}
.sp-search-ic {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #8a95a0;
  pointer-events: none;
}
.sp-search-input {
  width: 100%;
  background: #fff;
  border: 1px solid #e2e6ec;
  border-radius: 100px;
  padding: 11px 36px 11px 38px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: #0e2840;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.sp-search-input::placeholder { color: #9aa5b1; font-weight: 500; }
.sp-search-input:focus {
  border-color: #00a19a;
  box-shadow: 0 0 0 3px rgba(61, 189, 163, 0.18);
}
.sp-search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #4a5868;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.sp-body {
  position: relative;
  flex: 1 0 auto;
  padding-bottom: 56px;
}

/* The teal ambient wash is gone, in line with the flat explore look used
   across the app. */
.atm-bg { display: none; }

/* Hero */
.sp-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 34px 0 22px;
  margin-bottom: 4px;
  border-bottom: 1px solid #e6e4de;
  position: relative;
  z-index: 1;
}
.sp-hero-copy { min-width: 0; }
.hero-greeting {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  color: #94a3b8;
  margin-bottom: 4px;
}
.sp-h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -1.2px;
  line-height: 1;
  margin-bottom: 10px;
}
.sp-h1-count {
  display: inline-block;
  font-size: 22px;
  font-weight: 700;
  color: #00a19a;
  vertical-align: 8px;
  margin-left: 6px;
  letter-spacing: -0.5px;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #4a5868;
  letter-spacing: -0.2px;
  flex-wrap: wrap;
}
.hero-stats .stat-num { color: #0e2840; font-weight: 800; font-feature-settings: 'tnum'; margin-right: 4px; }
.hero-stats .stat-num.teal { color: #008a84; }
.hero-stats .stat-sep { width: 3px; height: 3px; border-radius: 50%; background: #b5bdc4; margin: 0 8px; display: inline-block; }

.sp-empty {
  text-align: center;
  margin-top: 22px;
  padding: 56px 24px;
  border-radius: 18px;
  background: #fff;
  border: 1px dashed #d9dee6;
  color: #8a95a0;
  font-size: 13.5px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}
.sp-empty-title {
  font-size: 16px;
  font-weight: 800;
  color: #0e2840;
  margin-bottom: 6px;
}
.sp-empty-sub {
  font-size: 12.5px;
  color: #8a95a0;
  font-weight: 500;
  line-height: 1.5;
  max-width: 260px;
  margin: 0 auto 18px;
}
.sp-empty-cta {
  background: #00a19a;
  color: #fff;
  border: none;
  border-radius: 100px;
  padding: 11px 22px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
}

/* Grid.
   A fixed two-column grid meant one watched property filled half the
   viewport. Card-sized tracks instead, so one card looks like a card and
   the row fills out as more are watched. */
.sp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 22px;
  padding: 22px 0 0;
  position: relative;
  z-index: 1;
}
.sp-tile {
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e6e9ee;
  box-shadow: 0 8px 22px rgba(18, 40, 70, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}
.sp-tile:hover {
  transform: translateY(-4px);
  border-color: #d6dde6;
  box-shadow: 0 20px 38px rgba(18, 40, 70, 0.1);
}
.sp-photo {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(180deg, #c5e4dd, #a8c8b5);
}

.sp-unwatch {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s;
  padding: 0;
}
.sp-unwatch:hover { transform: scale(1.1); }
.sp-unwatch-ic { width: 15px; height: 15px; object-fit: contain; }

.sp-status {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(15, 46, 41, 0.85);
  backdrop-filter: blur(6px);
  color: #f5c44c;
  font-size: 10.5px;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 100px;
  letter-spacing: 0.3px;
  border: 0.5px solid rgba(245, 196, 76, 0.3);
}
.sp-status.passport-ready { background: linear-gradient(135deg, #1f4b43, #0f2e29); }
.sp-status.no-passport {
  background: rgba(255, 255, 255, 0.9);
  color: #4a5868;
  border-color: #e8eceb;
}
.sp-status svg { width: 8px; height: 8px; }

.sp-info { padding: 15px 16px 17px; }
.sp-addr {
  font-size: 15.5px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin-bottom: 3px;
}
.sp-locality {
  font-size: 12.5px;
  font-weight: 600;
  color: #8a95a0;
  margin-bottom: 10px;
}
.sp-hs {
  font-size: 12.5px;
  font-weight: 700;
  color: #4a5868;
  padding-top: 10px;
  border-top: 1px solid #eef1f5;
}
.sp-hs strong { color: #008a84; font-feature-settings: 'tnum'; }
</style>
