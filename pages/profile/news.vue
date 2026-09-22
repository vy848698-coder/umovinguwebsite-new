<template>
  <div class="nw-page">
    <WebTopNav>
      <template #actions>
        <button class="nw-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="nw-btn solid" type="button" @click="navigateTo('/profile/learn')">Ask AI</button>
      </template>
      <template #mobile-extra="{ closeMenu }">
        <button type="button" class="nw-mobile-extra" @click="closeMenu(); navigateTo('/profile/learn')">Ask AI</button>
      </template>
    </WebTopNav>

    <main class="nw-shell nw-main">
      <!-- ── Hero ─────────────────────────────────────────── -->
      <section class="nw-hero">
        <div class="nw-hero-copy">
          <span class="nw-pill">
            <Icon name="i-lucide-newspaper" />
            Legislation &amp; news
          </span>
          <h1>Property law updates that <span>affect your Passport</span></h1>
          <p class="nw-intro">
            Property law and compliance updates that affect your Passport - curated, not automated.
            New items are added as the law actually changes.
          </p>

          <div class="nw-stats">
            <div class="nw-stat">
              <span class="nw-stat-ic"><Icon name="i-lucide-files" /></span>
              <span class="nw-stat-bd">
                <strong>{{ newsItems.length }}</strong>
                <small>Curated updates</small>
              </span>
            </div>
            <div class="nw-stat">
              <span class="nw-stat-ic nw-stat-ic--law"><Icon name="i-lucide-scale" /></span>
              <span class="nw-stat-bd">
                <strong>{{ countFor('law') }}</strong>
                <small>Law changes</small>
              </span>
            </div>
            <div class="nw-stat">
              <span class="nw-stat-ic nw-stat-ic--news"><Icon name="i-lucide-link-2" /></span>
              <span class="nw-stat-bd">
                <strong>{{ sourceCount }}</strong>
                <small>Linked sources</small>
              </span>
            </div>
          </div>
        </div>

        <aside class="nw-hero-art" aria-hidden="true">
          <div class="nw-art-plate">
            <span class="nw-art-ring" />
            <img src="/op-icons/profile/news.png" alt="" class="nw-art-img" />
          </div>
          <div v-if="nextDate" class="nw-art-card">
            <span class="nw-art-card-ic"><Icon name="i-lucide-calendar-clock" /></span>
            <span class="nw-art-card-bd">
              <small>Next key date</small>
              <strong>{{ formatDate(nextDate.date) }}</strong>
              <em>{{ nextDate.tagLabel }}</em>
            </span>
          </div>
          <div class="nw-art-chip">
            <Icon name="i-lucide-badge-check" />
            Every item links to its source
          </div>
        </aside>
      </section>

      <!-- ── Toolbar: heading + topic filter ─────────────── -->
      <div class="nw-toolbar">
        <div class="nw-toolbar-copy">
          <h2>Latest updates</h2>
          <p>Filter by topic to see what applies to you.</p>
        </div>
        <div class="nw-filters" role="tablist" aria-label="Filter updates by topic">
          <button
            v-for="f in filters"
            :key="f.key"
            type="button"
            role="tab"
            class="nw-filter"
            :class="{ active: activeFilter === f.key }"
            :aria-selected="activeFilter === f.key"
            @click="activeFilter = f.key"
          >
            <Icon :name="f.icon" />
            {{ f.label }}
            <span class="nw-filter-count">{{ f.key === 'all' ? newsItems.length : countFor(f.key) }}</span>
          </button>
        </div>
      </div>

      <div class="nw-layout">
        <div class="nw-col-main">
          <!-- Featured — the single most significant item, shown big -->
          <Transition name="nw-fade" mode="out-in">
            <a
              v-if="featured"
              :key="featured.id"
              class="nw-feature"
              :href="featured.url"
              target="_blank"
              rel="noopener"
            >
              <div class="nw-feature-copy">
                <div class="nw-feature-top">
                  <span class="nw-feature-badge"><Icon name="i-lucide-sparkles" />Featured</span>
                  <span class="nw-tag nw-tag--dark" :class="`nw-tag--${featured.tag}`">{{ featured.tagLabel }}</span>
                  <span v-if="isUpcoming(featured)" class="nw-upcoming nw-upcoming--dark">
                    <Icon name="i-lucide-clock" />Upcoming
                  </span>
                </div>
                <h2 class="nw-feature-t">{{ featured.title }}</h2>
                <p class="nw-feature-s">{{ featured.summary }}</p>
                <div class="nw-feature-foot">
                  <span class="nw-meta">
                    <Icon name="i-lucide-building-2" />{{ featured.source }}
                  </span>
                  <span class="nw-meta">
                    <Icon name="i-lucide-calendar" />{{ formatDate(featured.date) }}
                  </span>
                  <span class="nw-feature-go">
                    Read the update <Icon name="i-lucide-arrow-up-right" />
                  </span>
                </div>
              </div>
              <div class="nw-feature-art">
                <img :src="iconFor(featured)" alt="" loading="lazy" />
              </div>
            </a>
          </Transition>

          <div class="nw-block-head">
            <h2>More updates</h2>
            <span class="nw-block-count">{{ rest.length }} {{ rest.length === 1 ? 'update' : 'updates' }}</span>
          </div>

          <TransitionGroup v-if="rest.length" name="nw-fade" tag="div" class="nw-grid">
            <a
              v-for="(n, i) in rest"
              :key="n.id"
              class="nw-card"
              :class="[`nw-card--${n.tag}`, { wide: i === 0 && rest.length % 2 === 1 }]"
              :href="n.url"
              target="_blank"
              rel="noopener"
            >
              <div class="nw-card-top">
                <span class="nw-card-ic" :class="`nw-ic--${n.tag}`">
                  <img :src="iconFor(n)" alt="" loading="lazy" />
                </span>
                <div class="nw-card-badges">
                  <span class="nw-tag" :class="`nw-tag--${n.tag}`">{{ n.tagLabel }}</span>
                  <span v-if="isUpcoming(n)" class="nw-upcoming">
                    <Icon name="i-lucide-clock" />Upcoming
                  </span>
                </div>
              </div>
              <h3 class="nw-card-t">{{ n.title }}</h3>
              <p class="nw-card-s">{{ n.summary }}</p>
              <div class="nw-card-foot">
                <span class="nw-card-meta">
                  <strong>{{ n.source }}</strong>
                  <span class="nw-dot" aria-hidden="true" />
                  {{ formatDate(n.date) }}
                </span>
                <span class="nw-card-go">
                  <span class="nw-card-go-label">Read</span>
                  <Icon name="i-lucide-arrow-up-right" />
                </span>
              </div>
            </a>
          </TransitionGroup>
          <div v-else class="nw-empty" role="status">
            <span class="nw-empty-ic"><Icon name="i-lucide-inbox" /></span>
            <strong>No other updates in this topic yet</strong>
            <p>New items are added as the law actually changes.</p>
          </div>
        </div>

        <!-- ── Sidebar ────────────────────────────────────── -->
        <aside class="nw-side">
          <section class="nw-side-card">
            <div class="nw-side-head">
              <span class="nw-side-ic"><Icon name="i-lucide-calendar-range" /></span>
              <div>
                <h3>Key dates</h3>
                <p>Every update, in date order</p>
              </div>
            </div>
            <ol class="nw-timeline">
              <template v-for="(n, i) in timeline" :key="n.id">
                <li v-if="i === todayIndex" class="nw-tl-today">
                  <span class="nw-tl-today-dot" />
                  <span class="nw-tl-today-label">Today</span>
                  <span class="nw-tl-today-line" />
                </li>
                <li class="nw-tl-item" :class="{ upcoming: isUpcoming(n) }">
                  <span class="nw-tl-dot" :class="`nw-tl-dot--${n.tag}`" />
                  <div class="nw-tl-bd">
                    <span class="nw-tl-date">
                      {{ formatDate(n.date) }}
                      <em v-if="isUpcoming(n)">Upcoming</em>
                    </span>
                    <a :href="n.url" target="_blank" rel="noopener" class="nw-tl-t">{{ n.title }}</a>
                  </div>
                </li>
              </template>
            </ol>
          </section>

          <section class="nw-side-card">
            <div class="nw-side-head">
              <span class="nw-side-ic nw-side-ic--violet"><Icon name="i-lucide-shield-check" /></span>
              <div>
                <h3>How we curate</h3>
                <p>An editorial feed, not a scraper</p>
              </div>
            </div>
            <ul class="nw-principles">
              <li>
                <span class="nw-principle-ic"><Icon name="i-lucide-link-2" /></span>
                <span><strong>Sourced.</strong> Every item links to the original publication.</span>
              </li>
              <li>
                <span class="nw-principle-ic"><Icon name="i-lucide-scale" /></span>
                <span><strong>Relevant.</strong> Only changes that affect a landlord or owner's Passport.</span>
              </li>
              <li>
                <span class="nw-principle-ic"><Icon name="i-lucide-refresh-cw" /></span>
                <span><strong>Current.</strong> New items are added as the law actually changes.</span>
              </li>
            </ul>
          </section>

          <section class="nw-side-cta">
            <span class="nw-side-cta-ic"><Icon name="i-lucide-message-circle-question" /></span>
            <h3>Not sure what a change means for you?</h3>
            <p>Ask in plain English and get guidance for your situation.</p>
            <button type="button" class="nw-side-cta-btn" @click="navigateTo('/profile/learn')">
              Ask AI <Icon name="i-lucide-arrow-right" />
            </button>
          </section>
        </aside>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import { NEWS_ITEMS, type NewsItem } from '~/utils/landlordNews'
import { SELLER_NEWS_ITEMS } from '~/utils/sellerNews'

definePageMeta({ title: 'News - UmovingU', middleware: 'auth' })

type FilterKey = 'all' | NewsItem['tag']
const filters: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'all', label: 'All updates', icon: 'i-lucide-layout-grid' },
  { key: 'law', label: 'Law changes', icon: 'i-lucide-scale' },
  { key: 'update', label: 'Compliance updates', icon: 'i-lucide-clipboard-check' },
  { key: 'news', label: 'Sector news', icon: 'i-lucide-newspaper' },
]
const activeFilter = ref<FilterKey>('all')

// Sellers get the sales-side dataset, everyone else the rental one — the
// same split the dashboard's teaser rail makes, keyed off the role it
// caches. Read on the client only: localStorage doesn't exist during SSR,
// and resolving it there would render the wrong list and mismatch.
const isSeller = ref(false)
onMounted(() => {
  try {
    isSeller.value = localStorage.getItem('umu_role') === 'sell'
  } catch {
    /* storage blocked - keep the default list */
  }
})
const newsItems = computed<NewsItem[]>(() => (isSeller.value ? SELLER_NEWS_ITEMS : NEWS_ITEMS))

const filtered = computed(() =>
  activeFilter.value === 'all' ? newsItems.value : newsItems.value.filter((n) => n.tag === activeFilter.value),
)
const featured = computed(() => filtered.value.find((n) => n.featured) ?? filtered.value[0])
const rest = computed(() => filtered.value.filter((n) => n.id !== featured.value?.id))

const countFor = (tag: NewsItem['tag']) => newsItems.value.filter((n) => n.tag === tag).length
const sourceCount = computed(() => new Set(newsItems.value.map((n) => n.source)).size)
const timeline = computed(() => [...newsItems.value].sort((a, b) => a.date.localeCompare(b.date)))

// "Upcoming" depends on the viewer's clock, so it's only resolved on the
// client — rendering it during SSR would risk a hydration mismatch.
const today = ref<string | null>(null)
onMounted(() => {
  today.value = new Date().toISOString().slice(0, 10)
})
const isUpcoming = (n: NewsItem) => !!today.value && n.date > today.value
const nextDate = computed(() => timeline.value.find((n) => isUpcoming(n)))
// Where the "Today" marker sits in the key-dates list (-1 hides it).
const todayIndex = computed(() => timeline.value.findIndex((n) => isUpcoming(n)))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Story-specific 3D illustration, falling back to the per-tag icon
// (public/op-icons/news/{law,news,update}.png) so every item resolves.
function iconFor(n: NewsItem) {
  return n.icon ?? `/op-icons/news/${n.tag}.png`
}
</script>

<style scoped>
.nw-page {
  --nw-ink: #16283f;
  --nw-muted: #5f6f84;
  --nw-soft: #8a97a8;
  --nw-line: #e6e9ee;
  --nw-teal: #00a19a;
  --nw-navy: #231d45;
  --nw-law: #c0492f;
  --nw-update: #00a19a;
  --nw-news: #3d63c9;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  color: var(--nw-ink);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f3f2ef;
}
.nw-shell {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}
.nw-main { flex: 1 0 auto; padding: 32px 0 72px; }

/* Shared iconify sizing — Icon renders either an svg or a span.iconify */
.nw-page :deep(.iconify) { flex-shrink: 0; }

/* ── Nav actions ─────────────────────────────────────────── */
.nw-btn {
  border-radius: 12px;
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.nw-btn.ghost { background: #fff; color: var(--nw-ink); border: 1px solid #d8e0ea; }
.nw-btn.ghost:hover { border-color: #b9c6d6; }
.nw-btn.solid { background: var(--nw-teal); color: #fff; border: 1px solid var(--nw-teal); }
.nw-btn.solid:hover { background: #008c86; }
.nw-mobile-extra {
  width: 100%;
  border: 0;
  border-radius: 12px;
  background: var(--nw-teal);
  color: #fff;
  font: inherit;
  font-weight: 700;
  padding: 12px;
  cursor: pointer;
}

/* ── Hero ────────────────────────────────────────────────── */
.nw-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 40px;
  align-items: center;
  padding: 52px 56px;
  border-radius: 32px;
  background: #fff;
  border: 1px solid var(--nw-line);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 24px 60px rgba(18, 40, 70, 0.07);
}
.nw-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #e6f6f5;
  color: #007f79;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.nw-pill .iconify, .nw-pill :deep(svg) { width: 15px; height: 15px; }
.nw-hero h1 {
  margin: 20px 0 0;
  font-size: clamp(32px, 3.7vw, 50px);
  line-height: 1.06;
  font-weight: 800;
  letter-spacing: -1.6px;
  color: var(--nw-ink);
}
.nw-hero h1 span { color: var(--nw-teal); }
.nw-intro {
  margin: 18px 0 0;
  max-width: 520px;
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--nw-muted);
  font-weight: 500;
}

.nw-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 540px;
  margin-top: 32px;
  border-radius: 20px;
  background: #f8f9fb;
  border: 1px solid #edf0f4;
}
.nw-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  min-width: 0;
}
.nw-stat + .nw-stat { border-left: 1px solid #e8ecf1; }
.nw-stat-ic {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #e3f5f3;
  color: #007a74;
  display: grid;
  place-items: center;
}
.nw-stat-ic .iconify, .nw-stat-ic :deep(svg) { width: 18px; height: 18px; }
.nw-stat-ic--law { background: #fbeae5; color: #a53a22; }
.nw-stat-ic--news { background: #e8edfb; color: var(--nw-news); }
.nw-stat-bd { display: flex; flex-direction: column; min-width: 0; line-height: 1.15; }
.nw-stat-bd strong { font-size: 24px; font-weight: 800; letter-spacing: -0.6px; color: var(--nw-ink); }
.nw-stat-bd small { font-size: 12.5px; font-weight: 600; color: var(--nw-soft); white-space: nowrap; }

.nw-hero-art {
  position: relative;
  min-height: 320px;
  display: grid;
  place-items: center;
}
.nw-art-plate {
  position: relative;
  width: min(310px, 100%);
  aspect-ratio: 1;
  border-radius: 40px;
  background: linear-gradient(160deg, #eef7f6 0%, #eff1f8 100%);
  border: 1px solid #e3ebf0;
  display: grid;
  place-items: center;
}
.nw-art-ring {
  position: absolute;
  inset: 14px;
  border-radius: 30px;
  border: 1px dashed rgba(0, 161, 154, 0.22);
}
.nw-art-img {
  position: relative;
  width: 74%;
  height: 74%;
  object-fit: contain;
  filter: drop-shadow(0 20px 26px rgba(20, 40, 70, 0.16));
  animation: nw-float 6s ease-in-out infinite;
}
@keyframes nw-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.nw-art-card {
  position: absolute;
  left: 0;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 12px 12px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid var(--nw-line);
  box-shadow: 0 16px 34px rgba(18, 40, 70, 0.12);
}
.nw-art-card-ic {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff4e0;
  color: #b86a00;
  display: grid;
  place-items: center;
}
.nw-art-card-ic .iconify, .nw-art-card-ic :deep(svg) { width: 20px; height: 20px; }
.nw-art-card-bd { display: flex; flex-direction: column; line-height: 1.25; }
.nw-art-card-bd small { font-size: 10.5px; font-weight: 800; color: var(--nw-soft); text-transform: uppercase; letter-spacing: 0.7px; }
.nw-art-card-bd strong { font-size: 15.5px; font-weight: 800; color: var(--nw-ink); }
.nw-art-card-bd em { font-style: normal; font-size: 12px; font-weight: 600; color: var(--nw-muted); }
.nw-art-chip {
  position: absolute;
  right: 0;
  top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border-radius: 999px;
  background: var(--nw-navy);
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  box-shadow: 0 14px 28px rgba(35, 29, 69, 0.25);
}
.nw-art-chip .iconify, .nw-art-chip :deep(svg) { width: 15px; height: 15px; color: #5eead4; }

/* ── Toolbar ─────────────────────────────────────────────── */
.nw-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin: 48px 0 22px;
}
.nw-toolbar-copy h2 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.7px; color: var(--nw-ink); }
.nw-toolbar-copy p { margin: 4px 0 0; font-size: 14px; font-weight: 500; color: var(--nw-muted); }
.nw-filters {
  display: flex;
  gap: 4px;
  padding: 5px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--nw-line);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}
.nw-filters::-webkit-scrollbar { display: none; }
.nw-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 9px 12px 9px 14px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: #4a5a6e;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.nw-filter .iconify, .nw-filter :deep(svg) { width: 16px; height: 16px; }
.nw-filter:hover { background: #f3f5f8; color: var(--nw-ink); }
.nw-filter-count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 999px;
  background: #eef1f5;
  color: #5f6f84;
  font-size: 11.5px;
  font-weight: 800;
  text-align: center;
}
.nw-filter.active { background: var(--nw-navy); color: #fff; box-shadow: 0 6px 16px rgba(35, 29, 69, 0.22); }
.nw-filter.active .nw-filter-count { background: rgba(255, 255, 255, 0.16); color: #fff; }

/* ── Layout ──────────────────────────────────────────────── */
.nw-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: start;
}
.nw-col-main { min-width: 0; }

/* ── Featured ────────────────────────────────────────────── */
.nw-feature {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 32px;
  align-items: center;
  padding: 38px 40px;
  border-radius: 28px;
  background: linear-gradient(140deg, #2d2466 0%, #231d45 58%, #15102e 100%);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 24px 48px rgba(35, 29, 69, 0.22);
  transition: transform 0.25s, box-shadow 0.25s;
}
.nw-feature:hover { transform: translateY(-3px); box-shadow: 0 30px 58px rgba(35, 29, 69, 0.3); }
.nw-feature-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.nw-feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(94, 234, 212, 0.14);
  color: #5eead4;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
.nw-feature-badge .iconify, .nw-feature-badge :deep(svg) { width: 13px; height: 13px; }
.nw-feature-t {
  margin: 18px 0 0;
  font-size: clamp(24px, 2.4vw, 31px);
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #fff;
}
.nw-feature-s {
  margin: 12px 0 0;
  font-size: 15.5px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.76);
  font-weight: 500;
}
.nw-feature-foot {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.nw-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.64);
}
.nw-meta .iconify, .nw-meta :deep(svg) { width: 15px; height: 15px; }
.nw-feature-go {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 12px;
  background: #5eead4;
  color: #10233a;
  font-size: 13.5px;
  font-weight: 800;
  transition: background 0.2s;
}
.nw-feature:hover .nw-feature-go { background: #7ff3e0; }
.nw-feature-go .iconify, .nw-feature-go :deep(svg) { width: 16px; height: 16px; }
.nw-feature-art {
  aspect-ratio: 1;
  border-radius: 30px;
  background: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25), inset 0 -6px 0 rgba(35, 29, 69, 0.06);
  transform: rotate(-3deg);
  transition: transform 0.35s;
}
.nw-feature:hover .nw-feature-art { transform: rotate(0deg) scale(1.02); }
.nw-feature-art img { width: 74%; height: 74%; object-fit: contain; }

/* ── Tags ────────────────────────────────────────────────── */
.nw-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
.nw-tag--law { background: #fbeae5; color: #992e1a; }
.nw-tag--update { background: #e3f5f3; color: #007a74; }
.nw-tag--news { background: #e8edfb; color: #3d63c9; }
.nw-tag--dark.nw-tag--law { background: rgba(192, 73, 47, 0.25); color: #ffb3a0; }
.nw-tag--dark.nw-tag--update { background: rgba(0, 196, 188, 0.2); color: #5eead4; }
.nw-tag--dark.nw-tag--news { background: rgba(61, 99, 201, 0.28); color: #a8c0ff; }
.nw-upcoming {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #fff4e0;
  color: #9a5a00;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.nw-upcoming .iconify, .nw-upcoming :deep(svg) { width: 12px; height: 12px; }
.nw-upcoming--dark { background: rgba(255, 193, 94, 0.18); color: #ffcf82; }

/* ── Grid ────────────────────────────────────────────────── */
.nw-block-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 40px 0 16px;
}
.nw-block-head h2 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.4px; color: var(--nw-ink); }
.nw-block-head::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e6ec;
  order: 1;
}
.nw-block-count {
  order: 2;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--nw-line);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--nw-muted);
}
.nw-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.nw-card {
  --accent: var(--nw-teal);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid var(--nw-line);
  text-decoration: none;
  color: inherit;
  box-shadow: 0 8px 22px rgba(18, 40, 70, 0.04);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.nw-card--law { --accent: var(--nw-law); }
.nw-card--update { --accent: var(--nw-update); }
.nw-card--news { --accent: var(--nw-news); }
.nw-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s ease;
}
.nw-card:hover {
  transform: translateY(-4px);
  border-color: #d6dde6;
  box-shadow: 0 22px 40px rgba(18, 40, 70, 0.1);
}
.nw-card:hover::before { transform: scaleX(1); }
.nw-card-top { display: flex; align-items: flex-start; gap: 14px; }
.nw-card-ic {
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 20px;
  display: grid;
  place-items: center;
  transition: transform 0.3s;
}
.nw-card:hover .nw-card-ic { transform: scale(1.05) rotate(-3deg); }
.nw-card-ic img { width: 50px; height: 50px; object-fit: contain; }
.nw-ic--law { background: #fdf1ed; }
.nw-ic--update { background: #eef8f7; }
.nw-ic--news { background: #eef2fc; }
.nw-card-badges { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.nw-card-t {
  margin: 18px 0 0;
  font-size: 18px;
  line-height: 1.32;
  font-weight: 800;
  letter-spacing: -0.35px;
  color: var(--nw-ink);
}
.nw-card-s {
  margin: 8px 0 0;
  flex: 1;
  font-size: 14px;
  line-height: 1.65;
  color: var(--nw-muted);
  font-weight: 500;
}
.nw-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eef1f5;
}
.nw-card-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--nw-soft);
}
.nw-card-meta strong { color: #4a5a6e; font-weight: 700; }
.nw-dot { width: 3px; height: 3px; border-radius: 50%; background: #c4ccd6; }
.nw-card-go {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 34px;
  padding: 0 9px;
  flex-shrink: 0;
  border-radius: 999px;
  background: #f2f4f7;
  color: var(--nw-ink);
  font-size: 12.5px;
  font-weight: 800;
  transition: background 0.25s, color 0.25s;
}
.nw-card-go-label {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-width 0.3s, opacity 0.25s, margin 0.3s;
}
.nw-card-go .iconify, .nw-card-go :deep(svg) { width: 16px; height: 16px; }
.nw-card:hover .nw-card-go { background: var(--accent); color: #fff; padding: 0 12px; }
.nw-card:hover .nw-card-go-label { max-width: 40px; opacity: 1; margin-left: 2px; }

/* Wide card — fills the orphan slot when the grid has an odd count */
.nw-card.wide {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  grid-template-rows: auto auto 1fr auto;
  column-gap: 26px;
  padding: 28px;
}
.nw-card.wide .nw-card-top { display: contents; }
.nw-card.wide .nw-card-ic {
  grid-column: 1;
  grid-row: 1 / span 4;
  width: 120px;
  height: 120px;
  border-radius: 28px;
  align-self: start;
}
.nw-card.wide .nw-card-ic img { width: 88px; height: 88px; }
.nw-card.wide .nw-card-badges { grid-column: 2; padding-top: 0; }
.nw-card.wide .nw-card-t { grid-column: 2; margin-top: 12px; font-size: 21px; }
.nw-card.wide .nw-card-s { grid-column: 2; font-size: 14.5px; }
.nw-card.wide .nw-card-foot { grid-column: 2; }

.nw-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 44px 20px;
  border-radius: 24px;
  border: 1px dashed #d3dbe5;
  background: #fff;
  text-align: center;
}
.nw-empty-ic {
  width: 52px;
  height: 52px;
  margin-bottom: 6px;
  border-radius: 16px;
  background: #f2f4f7;
  color: var(--nw-soft);
  display: grid;
  place-items: center;
}
.nw-empty-ic .iconify, .nw-empty-ic :deep(svg) { width: 24px; height: 24px; }
.nw-empty strong { font-size: 15px; color: var(--nw-ink); }
.nw-empty p { margin: 0; font-size: 13.5px; color: var(--nw-muted); }

/* Filter change — enter fades up, leave is instant so the grid doesn't jump */
.nw-fade-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.nw-fade-enter-from { opacity: 0; transform: translateY(10px); }
.nw-fade-leave-active { transition: opacity 0.12s ease; }
.nw-fade-leave-to { opacity: 0; }
.nw-grid > .nw-fade-leave-active { display: none; }

/* ── Sidebar ─────────────────────────────────────────────── */
.nw-side {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.nw-side-card {
  padding: 24px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid var(--nw-line);
  box-shadow: 0 8px 22px rgba(18, 40, 70, 0.04);
}
.nw-side-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef1f5;
}
.nw-side-head h3 { margin: 0; font-size: 16px; font-weight: 800; color: var(--nw-ink); }
.nw-side-head p { margin: 2px 0 0; font-size: 12.5px; font-weight: 600; color: var(--nw-soft); }
.nw-side-ic {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #e6f6f5;
  color: #007f79;
  display: grid;
  place-items: center;
}
.nw-side-ic .iconify, .nw-side-ic :deep(svg) { width: 20px; height: 20px; }
.nw-side-ic--violet { background: #eeecfd; color: #5a4cf0; }

.nw-timeline { list-style: none; margin: 0; padding: 0; }
.nw-tl-item {
  position: relative;
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
}
.nw-tl-item:last-child { padding-bottom: 0; }
.nw-tl-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 16px;
  bottom: 2px;
  width: 2px;
  background: #edf0f4;
}
.nw-tl-dot {
  width: 12px;
  height: 12px;
  margin-top: 3px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 1px #d6dde6;
}
.nw-tl-dot--law { background: var(--nw-law); }
.nw-tl-dot--update { background: var(--nw-update); }
.nw-tl-dot--news { background: var(--nw-news); }
.nw-tl-bd { min-width: 0; }
.nw-tl-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: var(--nw-soft);
  text-transform: uppercase;
}
.nw-tl-date em {
  font-style: normal;
  padding: 1px 7px;
  border-radius: 999px;
  background: #fff4e0;
  color: #9a5a00;
  font-size: 10px;
}
.nw-tl-t {
  display: block;
  margin-top: 3px;
  font-size: 13.5px;
  line-height: 1.4;
  font-weight: 700;
  color: #4a5a6e;
  text-decoration: none;
  transition: color 0.2s;
}
.nw-tl-t:hover { color: var(--nw-teal); }
.nw-tl-item.upcoming .nw-tl-t { color: var(--nw-ink); }

.nw-tl-today {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 18px;
}
.nw-tl-today-dot {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.18);
}
.nw-tl-today-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #b45309;
}
.nw-tl-today-line { flex: 1; height: 0; border-top: 1px dashed #f3c98a; }

.nw-principles { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
.nw-principles li { display: flex; gap: 12px; font-size: 13.5px; line-height: 1.5; color: var(--nw-muted); }
.nw-principle-ic {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f2f4f7;
  color: var(--nw-teal);
  display: grid;
  place-items: center;
}
.nw-principle-ic .iconify, .nw-principle-ic :deep(svg) { width: 16px; height: 16px; }
.nw-principles strong { color: var(--nw-ink); }

.nw-side-cta {
  padding: 26px;
  border-radius: 24px;
  background: linear-gradient(150deg, #00a19a 0%, #007f79 100%);
  color: #fff;
  box-shadow: 0 18px 36px rgba(0, 127, 121, 0.22);
}
.nw-side-cta-ic {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.16);
  display: grid;
  place-items: center;
}
.nw-side-cta-ic .iconify, .nw-side-cta-ic :deep(svg) { width: 22px; height: 22px; }
.nw-side-cta h3 { margin: 14px 0 0; font-size: 18px; line-height: 1.3; font-weight: 800; letter-spacing: -0.3px; }
.nw-side-cta p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: rgba(255, 255, 255, 0.84); }
.nw-side-cta-btn {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 0;
  background: #fff;
  color: #006d68;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s;
}
.nw-side-cta-btn:hover { transform: translateX(3px); }
.nw-side-cta-btn .iconify, .nw-side-cta-btn :deep(svg) { width: 16px; height: 16px; }

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1080px) {
  .nw-layout { grid-template-columns: minmax(0, 1fr); }
  .nw-side { position: static; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nw-side-cta { grid-column: 1 / -1; }
  /* Hero copy column gets narrow here — drop the stat icons so labels fit */
  .nw-stat-ic { display: none; }
  .nw-stat { padding: 14px 16px; }
}
@media (max-width: 860px) {
  .nw-hero { grid-template-columns: minmax(0, 1fr); padding: 36px 28px; }
  .nw-hero-art { min-height: 280px; }
  .nw-feature { grid-template-columns: minmax(0, 1fr); padding: 30px 26px; }
  .nw-feature-art { width: 120px; order: -1; border-radius: 24px; }
}
@media (max-width: 720px) {
  .nw-shell { width: calc(100% - 28px); }
  .nw-grid { grid-template-columns: minmax(0, 1fr); }
  .nw-card.wide { display: flex; padding: 24px; }
  .nw-card.wide .nw-card-top { display: flex; }
  .nw-card.wide .nw-card-ic { width: 68px; height: 68px; border-radius: 20px; }
  .nw-card.wide .nw-card-ic img { width: 50px; height: 50px; }
  .nw-card.wide .nw-card-t { font-size: 18px; margin-top: 18px; }
  .nw-side { grid-template-columns: minmax(0, 1fr); }
  .nw-stats { grid-template-columns: minmax(0, 1fr); }
  .nw-stat + .nw-stat { border-left: 0; border-top: 1px solid #e8ecf1; }
  .nw-feature-go { margin-left: 0; }
  .nw-art-card { bottom: 8px; }
  .nw-art-chip { top: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .nw-art-img { animation: none; }
  .nw-card, .nw-card-ic, .nw-feature, .nw-feature-art { transition: none; }
}
</style>
