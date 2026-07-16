<template>
  <div class="pp-root">
    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="ppn-nav">
      <div class="pp-shell ppn-nav-inner">
        <button class="ppn-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="ppn-brand-logo" />
          <span class="ppn-brand-name">umovingu</span>
          <span class="ppn-brand-beta">BETA</span>
        </button>
        <nav class="ppn-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="ppn-actions">
          <button
            class="ppn-tour"
            type="button"
            title="Take a quick tour"
            aria-label="Take a quick tour"
            data-tour="tour-btn"
            @click="collectionsTourRef?.start?.()"
          >
            ?
          </button>
          <button class="ppn-avatar" type="button" aria-label="Profile" @click="navigateTo('/profile')">
            <UserAvatar
              :src="profile?.avatarUrl"
              :firstName="profile?.firstName"
              :lastName="profile?.lastName"
              :size="40"
            />
          </button>
          <button class="ppn-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
        </div>
      </div>
    </header>

    <main class="ppw-main">
      <!-- ── Hero ─────────────────────────────────────────────────────── -->
      <section class="ppw-hero">
        <div class="pp-shell ppw-hero-grid">
          <div class="ppw-head" data-tour="hero">
            <p class="ppw-kicker">Your property journey</p>
            <h1>
              Passports —<br />welcome back,<br /><span class="ppw-head-name">{{ profile?.firstName || 'there' }}</span>
            </h1>
            <p class="ppw-lede">
              Every Property Passport you own, in one place. Pick up where you
              left off, manage collections and keep documents secured.
            </p>
            <div class="ppw-stats" data-tour="stats">
              <div class="ppw-stat">
                <div class="ppw-stat-top">
                  <span class="ppw-stat-num">{{ totalPassports }}</span>
                  <span class="ppw-stat-ic ppw-stat-ic--teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>
                  </span>
                </div>
                <span class="ppw-stat-label">{{ totalPassports === 1 ? 'Property' : 'Properties' }}</span>
              </div>
              <div class="ppw-stat">
                <div class="ppw-stat-top">
                  <span class="ppw-stat-num">{{ documentsSecured }}</span>
                  <span class="ppw-stat-ic ppw-stat-ic--rose">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
                  </span>
                </div>
                <span class="ppw-stat-label">Documents secured</span>
              </div>
              <div class="ppw-stat">
                <div class="ppw-stat-top">
                  <span class="ppw-stat-num">{{ pointsEarned }}</span>
                  <span class="ppw-stat-ic ppw-stat-ic--gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" /></svg>
                  </span>
                </div>
                <span class="ppw-stat-label">Points earned</span>
              </div>
            </div>
          </div>

          <!-- Passport visual -->
          <div class="ppw-visual" aria-hidden="true">
            <span class="ppw-dots" />
            <div class="ppw-visual-glow" />
            <article class="ppw-book">
              <img
                src="/umu-passport.png"
                alt="umovingu Property Passport"
                class="ppw-book-img"
              />
              <div class="ppw-book-plate">
                <span class="ppw-book-line1">{{ heroBook.line1 }}</span>
                <span class="ppw-book-line2">{{ heroBook.line2 }}</span>
              </div>
            </article>

            <div class="ppw-chip ppw-chip--docs">
              <span class="ppw-chip-eyebrow">Documents</span>
              <div class="ppw-chip-row">
                <span class="ppw-chip-ic ppw-chip-ic--docs">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
                </span>
                <strong>{{ documentsSecured }} <em>secured</em></strong>
              </div>
              <span class="ppw-chip-sub">Keep your important documents safe</span>
            </div>

            <div class="ppw-chip ppw-chip--score">
              <span class="ppw-chip-eyebrow">HomeScore</span>
              <span class="ppw-score-ring">
                <svg viewBox="0 0 64 64">
                  <circle class="ppw-ring-bg" cx="32" cy="32" r="27" />
                  <circle
                    class="ppw-ring-meter"
                    cx="32"
                    cy="32"
                    r="27"
                    :stroke-dasharray="ringCirc"
                    :stroke-dashoffset="ringOffset"
                  />
                </svg>
                <span class="ppw-score-val"><strong>{{ heroScore }}</strong><small>/100</small></span>
              </span>
              <span class="ppw-chip-sub">Good, nearly HomeScore ready</span>
            </div>

            <div class="ppw-chip ppw-chip--compliance">
              <span class="ppw-chip-eyebrow">Compliance</span>
              <div class="ppw-chip-row">
                <span class="ppw-chip-ic ppw-chip-ic--compliance">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
                </span>
                <strong class="ppw-chip-ok">On track</strong>
              </div>
              <span class="ppw-chip-sub">Everything looks good</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Library ──────────────────────────────────────────────────── -->
      <section class="ppw-body">
        <div class="pp-shell">
          <div class="ppw-layout">
            <aside class="ppw-aside">
              <!-- Pick up where you left off -->
              <button
                v-if="resumeCard"
                class="coll-resume"
                data-tour="resume"
                @click="goToResume"
              >
                <div class="coll-resume-book">
                  <PassportCard
                    :line1="resumeCard.addressLine1"
                    :line2="resumeCard.postcode"
                  />
                </div>
                <div class="coll-resume-content">
                  <div class="coll-resume-eyebrow">Pick up where you left off</div>
                  <div class="coll-resume-name">{{ resumeCard.addressLine1 }}</div>
                  <div class="coll-resume-meta">
                    <b
                      >{{ resumeCard.sectionsToGo }} section{{
                        resumeCard.sectionsToGo === 1 ? '' : 's'
                      }}
                      to go</b
                    >
                    <template v-if="resumeCard.lastEdit">
                      · last edit {{ resumeCard.lastEdit }}</template
                    >
                  </div>
                  <div class="coll-resume-progress">
                    <div class="coll-resume-track">
                      <div
                        class="coll-resume-fill"
                        :style="{ width: resumeCard.pct + '%' }"
                      />
                    </div>
                    <span class="coll-resume-pct">{{ resumeCard.pct }}%</span>
                  </div>
                </div>
                <div class="coll-resume-cta">→</div>
              </button>

              <!-- Location chips -->
              <div v-if="cityChips.length > 1" class="coll-cities">
                <button
                  v-for="chip in cityChips"
                  :key="chip.value"
                  class="coll-city-chip"
                  :class="{ active: cityFilter === chip.value }"
                  @click="cityFilter = chip.value"
                >
                  <svg
                    v-if="chip.value !== 'all'"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {{ chip.label }}
                  <span class="coll-city-num">{{ chip.count }}</span>
                </button>
              </div>

              <!-- Watching list -->
              <div v-if="watchingList.length > 0" class="watching-section">
                <div class="watching-header">
                  <span class="watching-title">Watching</span>
                  <span class="watching-count">{{ watchingList.length }}</span>
                </div>
                <div class="watching-list">
                  <div
                    v-for="w in watchingList"
                    :key="w.id"
                    class="watching-card"
                    @click="router.push(`/buyer-passport/${w.passportId}`)"
                  >
                    <div class="watching-card-ic">📘</div>
                    <div class="watching-card-body">
                      <div class="watching-card-addr">{{ w.addressLine1 }}</div>
                      <div class="watching-card-sub">
                        {{ w.postcode
                        }}<template v-if="w.property?.epcRating">
                          · EPC {{ w.property.epcRating }}</template
                        >
                      </div>
                      <div class="watching-card-meta">
                        <span class="watching-pill watching-pill-published"
                          >📘 Published</span
                        >
                        <span class="watching-purchased">
                          Unlocked {{ formatPurchasedAt(w.purchasedAt) }}
                        </span>
                      </div>
                    </div>
                    <div class="watching-card-arrow">→</div>
                  </div>
                </div>
              </div>
            </aside>

            <section class="ppw-content">
              <!-- Controls row — search + sort -->
              <div class="ppw-controls">
                <div class="ppw-search" :class="{ active: !!query }">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M16.5 16.5L21 21" />
                  </svg>
                  <input
                    v-model="query"
                    class="ppw-search-input"
                    data-tour="search-btn"
                    placeholder="Search passports by address or postcode…"
                  />
                  <button
                    v-if="query"
                    class="ppw-search-clear"
                    aria-label="Clear search"
                    @click="query = ''"
                  >
                    ×
                  </button>
                </div>
                <div class="ppw-sort">
                  <span class="ppw-sort-label">Sort:</span>
                  <select v-model="sortMode" class="ppw-sort-select">
                    <option value="recent">Recently updated</option>
                    <option value="az">A–Z</option>
                    <option value="progress">Progress</option>
                  </select>
                  <svg class="ppw-sort-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="loading" class="flex justify-center py-10">
                <div
                  class="w-8 h-8 border-2 border-brand-aqua border-t-transparent rounded-full animate-spin"
                />
              </div>

              <!-- Error state -->
              <div v-else-if="loadError" class="coll-state-wrap">
                <div class="coll-state-card coll-state-card--error">
                  <div class="coll-state-ic">⚠️</div>
                  <div class="coll-state-title">We couldn't load your Passports</div>
                  <div class="coll-state-sub">{{ loadError }}</div>
                  <button class="coll-state-btn" @click="load">Try again</button>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else-if="!hasAnyItems" class="coll-state-wrap">
                <div class="coll-state-card">
                  <div class="coll-state-ic">📘</div>
                  <div class="coll-state-title">No Passports yet</div>
                  <div class="coll-state-sub">
                    Start by claiming a property from Explore, then your Passports will appear here.
                  </div>
                  <button class="coll-state-btn" @click="router.push('/explore')">
                    Go to Explore
                  </button>
                </div>
              </div>

              <!-- Grid -->
              <div v-else class="passport-grid">
                <!-- Collections first -->
                <div
                  v-for="collection in filteredCollections"
                  :key="collection.id"
                  class="prop-card prop-card--collection"
                  @click="openCollection(collection)"
                >
                  <div class="prop-card-top">
                    <div class="prop-book prop-book--stack">
                      <div
                        v-for="(item, bi) in collection.items.slice(0, 3)"
                        :key="item.id"
                        class="prop-book-layer"
                        :style="stackStyle(bi)"
                      >
                        <PassportCard
                          :line1="item.passport.addressLine1"
                          :line2="item.passport.postcode"
                        />
                      </div>
                      <div v-if="collection.items.length === 0" class="prop-book-layer">
                        <PassportCard line1="Empty" line2="Add a passport" />
                      </div>
                    </div>
                    <div class="prop-card-info">
                      <p class="prop-card-name">{{ collection.name }}</p>
                      <p class="prop-card-sub">
                        {{ collection.items.length }}
                        {{ collection.items.length === 1 ? 'Passport' : 'Passports' }}
                      </p>
                      <span class="prop-pill prop-pill--collection">Collection</span>
                    </div>
                  </div>
                  <div class="prop-card-foot">
                    <span class="prop-meta-num">{{ collection.items.length }}</span>
                    <span class="prop-meta-label">in collection</span>
                  </div>
                </div>

                <!-- Individual uncollected passports -->
                <div
                  v-for="passport in filteredPassports"
                  :key="passport.id"
                  class="prop-card"
                  @click="openPassport(passport.id)"
                >
                  <button
                    class="prop-trash"
                    title="Delete passport"
                    @click.stop="confirmDelete(passport)"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>

                  <div class="prop-card-top">
                    <div class="prop-book">
                      <PassportCard
                        :line1="passport.addressLine1"
                        :line2="passport.postcode"
                      />
                    </div>
                    <div class="prop-card-info">
                      <p class="prop-card-name">{{ shortAddress(passport.addressLine1) }}</p>
                      <p class="prop-card-sub">{{ passport.postcode }}</p>
                    </div>
                  </div>

                  <div class="prop-card-foot">
                    <span class="prop-pct">{{ passportPct(passport) }}%</span>
                    <span class="prop-status">{{ passportStatusLabel(passport) }}</span>
                    <div class="prop-icons">
                      <span class="prop-ic prop-ic--docs" title="Documents">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
                      </span>
                      <span class="prop-ic prop-ic--energy" title="HomeScore">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" /></svg>
                      </span>
                      <span class="prop-ic prop-ic--compliance" title="Compliance">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z" /></svg>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Add New -->
                <button class="prop-card prop-card--add" @click="router.push('/explore')">
                  <span class="prop-add-plus">+</span>
                  <span class="prop-add-name">Add New</span>
                  <span class="prop-add-sub">Create a new Property Passport</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>

    <SiteFooter />

    <!-- Create collection modal -->
    <CreateCollectionModal
      :show="showCreateModal"
      :available-passports="uncollectedPassports"
      @close="showCreateModal = false"
      @created="onCollectionCreated"
    />

    <!-- Collection detail / manage passports -->
    <CollectionDetailModal
      :show="showDetailModal"
      :collection="activeCollection"
      :uncollected-passports="uncollectedPassports"
      @close="showDetailModal = false"
      @navigate="openPassport"
      @updated="load"
    />

    <!-- Delete confirmation modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="delete-overlay"
        @click.self="showDeleteModal = false"
      >
        <div class="delete-modal">
          <div class="delete-modal-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <polyline
                points="3,6 5,6 21,6"
                stroke="#e53e3e"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                stroke="#e53e3e"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11v6M14 11v6"
                stroke="#e53e3e"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                stroke="#e53e3e"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 class="delete-modal-title">Delete Passport?</h3>
          <p class="delete-modal-body">
            Are you sure you want to delete
            <strong>{{ passportToDelete?.addressLine1 }}</strong
            >? This action cannot be undone and all passport data will be
            permanently removed.
          </p>
          <div class="delete-modal-actions">
            <button
              class="delete-btn-cancel"
              @click="showDeleteModal = false"
              :disabled="deleting"
            >
              Cancel
            </button>
            <button
              class="delete-btn-confirm"
              @click="executeDelete"
              :disabled="deleting"
            >
              <span v-if="deleting" class="delete-spinner" />
              <span v-else>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Guided tour -->
    <OnboardingTour
      ref="collectionsTourRef"
      :steps="collectionsTourSteps"
      storage-key="umu_tour_collections_v1"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CreateCollectionModal from '@/components/modals/CreateCollectionModal.vue'
import CollectionDetailModal from '@/components/modals/CollectionDetailModal.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import OnboardingTour from '~/components/ui/OnboardingTour.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const { profile } = useProfile()

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const config = useRuntimeConfig()

const loading = ref(true)
const loadError = ref('')
const collections = ref([])
const uncollectedPassports = ref([])
const watchingList = ref([])
const query = ref('')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const activeCollection = ref(null)
const sortMode = ref('recent')
const cityFilter = ref('all')

// Pull a sensible "place" label from any passport — prefers city, falls
// back to the postcode area (the letters before the first digit, e.g. "CV5"
// → "CV", "SK7" → "SK").
function passportCity(p) {
  if (!p) return null
  const city = (p.city || p.property?.city || '').trim()
  if (city) return city
  const pc = (p.postcode || '').trim().toUpperCase()
  if (!pc) return null
  const area = pc.match(/^[A-Z]+/)?.[0]
  return area || null
}

// Per-passport completion percentage, derived from whatever fields exist.
function passportPct(p) {
  const total = Number(p?.totalSections ?? p?.sectionsCount ?? 18)
  const done = Number(p?.completedSections ?? p?.sectionsComplete ?? 0)
  const pct = Number(
    p?.completionPct ??
      p?.progress ??
      (total ? Math.round((done / total) * 100) : 0),
  )
  return Math.max(0, Math.min(100, pct || 0))
}

function passportStatusLabel(p) {
  return p?.status === 'PUBLISHED' ? 'Published' : 'Ready'
}

// Delete state
const showDeleteModal = ref(false)
const passportToDelete = ref(null)
const deleting = ref(false)

function passportMatchesCity(p) {
  if (cityFilter.value === 'all') return true
  return passportCity(p) === cityFilter.value
}

const activityTime = (p) =>
  +new Date(p?.lastVisitedAt || p?.updatedAt || p?.createdAt || 0)

function applySort(list) {
  const arr = [...list]
  if (sortMode.value === 'az') {
    return arr.sort((a, b) =>
      (a?.addressLine1 || a?.name || '').localeCompare(
        b?.addressLine1 || b?.name || '',
      ),
    )
  }
  if (sortMode.value === 'progress') {
    return arr.sort((a, b) => passportPct(b) - passportPct(a))
  }
  // recent (default)
  return arr.sort((a, b) => activityTime(b) - activityTime(a))
}

const filteredCollections = computed(() => {
  let list = Array.isArray(collections.value) ? [...collections.value] : []
  const q = query.value.trim().toLowerCase()
  if (q) list = list.filter((c) => (c?.name || '').toLowerCase().includes(q))
  if (cityFilter.value !== 'all') {
    list = list.filter((c) =>
      (c.items ?? []).some((it) => passportMatchesCity(it.passport)),
    )
  }
  return list
})

const filteredPassports = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = uncollectedPassports.value ?? []
  if (q) {
    list = list.filter(
      (p) =>
        (p?.addressLine1 || '').toLowerCase().includes(q) ||
        (p?.postcode || '').toLowerCase().includes(q),
    )
  }
  if (cityFilter.value !== 'all') {
    list = list.filter(passportMatchesCity)
  }
  return applySort(list)
})

const hasAnyItems = computed(() => {
  const inCollections = Array.isArray(collections.value)
    ? collections.value.some((c) => Array.isArray(c?.items) && c.items.length > 0)
    : false
  const hasUncollected = Array.isArray(uncollectedPassports.value)
    ? uncollectedPassports.value.length > 0
    : false
  const hasWatching = Array.isArray(watchingList.value)
    ? watchingList.value.length > 0
    : false
  return inCollections || hasUncollected || hasWatching
})

const cityChips = computed(() => {
  const counts = new Map()
  for (const p of allPassports.value) {
    const c = passportCity(p)
    if (!c) continue
    counts.set(c, (counts.get(c) || 0) + 1)
  }
  const places = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, label: value, count }))
  return [
    { value: 'all', label: 'All locations', count: allPassports.value.length },
    ...places,
  ]
})

// ── Hero stats ──────────────────────────────────────────────────────
const allPassports = computed(() => {
  const inCols =
    collections.value?.flatMap((c) => c.items?.map((i) => i.passport) ?? []) ??
    []
  return [...inCols, ...(uncollectedPassports.value ?? [])]
})
const totalPassports = computed(() => allPassports.value.length)

const documentsSecured = computed(() => {
  return allPassports.value.reduce((sum, p) => {
    const direct = Number(p?.documentsCount ?? p?.docsCount ?? 0)
    if (direct > 0) return sum + direct
    const completed = Number(p?.completedTasks ?? p?.completedTaskCount ?? 0)
    return sum + completed
  }, 0)
})

const pointsEarned = computed(() => {
  return allPassports.value.reduce(
    (sum, p) => sum + Number(p?.pointsEarned ?? p?.points ?? 0),
    0,
  )
})

// Hero passport book + score mirror the most recent passport when available.
const heroBook = computed(() => {
  const p = resumeCard.value
  return {
    line1: p?.addressLine1 || '13 Delius Street',
    line2: p?.postcode || 'CV4 9PF',
  }
})
const heroScore = computed(() => {
  const p = allPassports.value.find((x) => Number(x?.homeScore ?? x?.score) > 0)
  return Number(p?.homeScore ?? p?.score ?? 74)
})
// Stroke geometry for the HomeScore ring (r = 27).
const ringCirc = 2 * Math.PI * 27
const ringOffset = computed(
  () => ringCirc * (1 - Math.max(0, Math.min(100, heroScore.value)) / 100),
)

// "Pick up where you left off" card
const resumeCard = computed(() => {
  const list = allPassports.value
  if (!list.length) return null
  const sorted = [...list].sort((a, b) => activityTime(b) - activityTime(a))
  const p = sorted[0]
  if (!p) return null
  const total = Number(p?.totalSections ?? p?.sectionsCount ?? 18)
  const done = Number(p?.completedSections ?? p?.sectionsComplete ?? 0)
  return {
    id: p.id,
    addressLine1: p.addressLine1,
    postcode: p.postcode,
    sectionsToGo: Math.max(0, total - done),
    pct: passportPct(p),
    lastEdit: relativeTime(p?.lastVisitedAt || p?.updatedAt),
  }
})

function relativeTime(iso) {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  if (!Number.isFinite(ms) || ms < 0) return ''
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `${Math.max(1, mins)} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.round(hrs / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function goToResume() {
  if (resumeCard.value?.id) {
    router.push(`/passportview/${resumeCard.value.id}`)
  }
}

// ── Guided tour ───────────────────────────────────────────────────
const collectionsTourRef = ref(null)
const collectionsTourSteps = [
  {
    selector: '[data-tour="hero"]',
    title: 'Your portfolio',
    body: 'Every Property Passport you own lives here. The greeting changes when you come back tomorrow.',
  },
  {
    selector: '[data-tour="stats"]',
    title: 'Snapshot',
    body: 'Number of properties, total documents secured across all passports, and points earned for completing tasks.',
  },
  {
    selector: '[data-tour="resume"]',
    title: 'Pick up where you left off',
    body: 'Tap this card to jump straight back to your most recently edited passport — exactly where you stopped.',
  },
  {
    selector: '[data-tour="tour-btn"]',
    title: 'Replay this tour',
    body: 'Tap "?" any time to walk through this again. Welcome to umovingu!',
  },
]

const load = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    const [data, watching] = await Promise.all([
      $fetch(`${config.public.apiBase}/collection/my`, { headers }),
      $fetch(`${config.public.apiBase}/passport/buyer-access`, {
        headers,
      }).catch(() => []),
    ])
    collections.value = Array.isArray(data?.collections) ? data.collections : []
    uncollectedPassports.value = Array.isArray(data?.uncollectedPassports)
      ? data.uncollectedPassports
      : []
    watchingList.value = Array.isArray(watching) ? watching : []
  } catch (e) {
    console.error('Failed to load collections', e)
    loadError.value = 'Please check your connection and try again.'
    collections.value = []
    uncollectedPassports.value = []
    watchingList.value = []
  } finally {
    loading.value = false
  }
}

const formatPurchasedAt = (iso) => {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

onMounted(load)

const onCollectionCreated = () => {
  load()
}

const openPassport = (id) => {
  showDetailModal.value = false
  router.push(`/passportview/${id}`)
}

const openCollection = (collection) => {
  activeCollection.value = collection
  showDetailModal.value = true
}

const shortAddress = (addr) => {
  const parts = (addr || '').split(',')
  return parts.length > 1 ? `${parts[0]},${parts[1]}` : addr
}

const stackStyle = (index) => {
  const clampedIndex = Math.min(index, 2)
  const rotations = [-7, -3, 0]
  const offsets = [-10, -5, 0]
  return {
    transform: `rotate(${rotations[clampedIndex]}deg) translateX(${offsets[clampedIndex]}px)`,
    zIndex: clampedIndex + 1,
    position: 'absolute',
    inset: 0,
  }
}

const confirmDelete = (passport) => {
  passportToDelete.value = passport
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!passportToDelete.value) return
  deleting.value = true
  try {
    const token = localStorage.getItem('token')
    await $fetch(
      `${config.public.apiBase}/passport/${passportToDelete.value.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    showDeleteModal.value = false
    passportToDelete.value = null
    await load()
  } catch (e) {
    console.error('Failed to delete passport', e)
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
/* ── Tokens (shared with landing/explore) ─────────────────────────── */
.pp-root {
  --navy: #231d45;
  --navy-2: #2c2456;
  --teal: #00a19a;
  --teal-dark: #00857f;
  --teal-bright: #2fd0c6;
  --ink: #231d45;
  --ink-soft: #5a5570;
  --ink-faint: #8b8799;
  --line: #e7e2d6;
  --bg: #f2efe6;
  --card: #ffffff;

  min-height: 100dvh;
  color: var(--ink);
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
  position: relative;
}

.pp-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
}

/* ── Navbar ───────────────────────────────────────────────────────── */
.ppn-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(242, 239, 230, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.ppn-nav-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.ppn-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--navy);
  cursor: pointer;
  flex-shrink: 0;
  font-family: inherit;
}

.ppn-brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.ppn-brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.ppn-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
}

.ppn-links {
  display: flex;
  gap: 4px;
}

.ppn-links button {
  border: 0;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 13px;
  border-radius: 10px;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.18s, color 0.18s;
}

.ppn-links button:hover {
  color: var(--navy);
  background: rgba(35, 29, 69, 0.05);
}

.ppn-links button.active {
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.ppn-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.ppn-tour {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  border: 1px solid rgba(0, 161, 154, 0.2);
  background: rgba(0, 161, 154, 0.06);
  color: var(--teal);
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.18s, border-color 0.18s;
}

.ppn-tour:hover {
  background: rgba(0, 161, 154, 0.12);
  border-color: rgba(0, 161, 154, 0.4);
}

.ppn-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: #fff;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  transition: box-shadow 0.18s, transform 0.18s;
}

.ppn-avatar:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(35, 29, 69, 0.12);
}

.ppn-cta {
  height: 42px;
  padding: 0 18px;
  border-radius: 11px;
  border: 0;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  background: var(--teal);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
  transition: transform 0.18s, background 0.18s;
}

.ppn-cta:hover {
  transform: translateY(-1px);
  background: var(--teal-dark);
}

/* ── Hero ─────────────────────────────────────────────────────────── */
.ppw-main {
  position: relative;
}

.ppw-hero {
  padding: 56px 0 50px;
}

.ppw-hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}

.ppw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px;
  color: var(--teal-dark);
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.ppw-kicker-dash {
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
}

.ppw-head h1 {
  margin: 0;
  color: var(--navy);
  font-size: clamp(38px, 4.4vw, 58px);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.03em;
}

.ppw-head-name {
  color: var(--teal);
}

.ppw-lede {
  margin: 22px 0 0;
  max-width: 460px;
  color: var(--ink-soft);
  font-size: 16.5px;
  font-weight: 500;
  line-height: 1.6;
}

.ppw-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 30px;
}

.ppw-stat {
  flex: 1;
  min-width: 132px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.05);
}

.ppw-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ppw-stat-num {
  font-size: 28px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.02em;
  font-feature-settings: 'tnum';
  line-height: 1;
}

.ppw-stat-ic {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.ppw-stat-ic svg {
  width: 18px;
  height: 18px;
}

.ppw-stat-ic--teal {
  background: rgba(0, 161, 154, 0.12);
  color: var(--teal);
}

.ppw-stat-ic--rose {
  background: rgba(234, 84, 120, 0.12);
  color: #e25471;
}

.ppw-stat-ic--gold {
  background: rgba(214, 158, 46, 0.14);
  color: #cf9b2c;
}

.ppw-stat-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-faint);
}

/* ── Hero visual ──────────────────────────────────────────────────── */
.ppw-visual {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ppw-visual-glow {
  position: absolute;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.12), transparent 66%);
  z-index: 0;
}

/* Decorative dot grid (top-left of the visual) */
.ppw-dots {
  position: absolute;
  top: 8px;
  left: 4px;
  width: 64px;
  height: 36px;
  z-index: 0;
  background-image: radial-gradient(rgba(35, 29, 69, 0.16) 2px, transparent 2px);
  background-size: 13px 13px;
  opacity: 0.7;
}

.ppw-book {
  position: relative;
  z-index: 1;
  width: 232px;
  transform: rotate(-6deg);
  animation: ppw-sway 7s ease-in-out infinite;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Real passport artwork — the PNG carries its own cover + soft shadow */
.ppw-book-img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

/* Sample address + reference embossed into the empty lower cover */
.ppw-book-plate {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 13%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-align: center;
  pointer-events: none;
}

.ppw-book-line1 {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
}

.ppw-book-line2 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.82);
}

@keyframes ppw-sway {
  0%, 100% { transform: rotate(-6deg); }
  50% { transform: rotate(-2.5deg); }
}

/* Book straightens and lifts on hover; the chips drift outward for depth. */
.ppw-visual:hover .ppw-book {
  animation-play-state: paused;
  transform: rotate(0deg) translateY(-6px) scale(1.025);
}

.ppw-book-kicker {
  position: relative;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.5;
  color: #d8c79a;
}

.ppw-book-mark {
  position: relative;
  width: 78px;
  height: 78px;
  border: 2.5px solid #c9b685;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #d8c79a;
}

.ppw-book-mark svg {
  width: 46px;
  height: 46px;
}

.ppw-book-addr {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  line-height: 1.3;
}

.ppw-book-addr b {
  font-size: 16px;
  font-weight: 700;
  color: #ece0bb;
  letter-spacing: 0.01em;
}

.ppw-book-addr span {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #cbb98c;
}

.ppw-chip {
  position: absolute;
  z-index: 2;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.06);
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: 0 18px 40px rgba(35, 29, 69, 0.12);
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 150px;
}

.ppw-chip-eyebrow {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--navy);
}

.ppw-chip-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 4px 0 2px;
}

.ppw-chip-ic {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.ppw-chip-ic svg {
  width: 16px;
  height: 16px;
}

.ppw-chip-ic--docs {
  background: rgba(120, 99, 240, 0.12);
  color: #6d5ce0;
}

.ppw-chip-ic--compliance {
  background: rgba(0, 161, 154, 0.12);
  color: var(--teal);
}

.ppw-chip strong {
  font-size: 16px;
  font-weight: 800;
  color: var(--navy);
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.ppw-chip strong em {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-faint);
}

.ppw-chip-sub {
  font-size: 11px;
  color: var(--ink-faint);
  line-height: 1.4;
}

.ppw-chip-ok {
  color: var(--teal-dark) !important;
}

.ppw-chip {
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.ppw-chip--docs {
  top: 96px;
  left: -22px;
  animation: ppw-float-a 5.4s ease-in-out infinite;
}
.ppw-visual:hover .ppw-chip--docs {
  animation-play-state: paused;
  transform: translate(-10px, -4px);
}

.ppw-chip--score {
  top: 4px;
  right: -12px;
  align-items: center;
  text-align: center;
  width: 134px;
  padding: 14px 14px 16px;
  animation: ppw-float-b 6s ease-in-out infinite;
}
.ppw-visual:hover .ppw-chip--score {
  animation-play-state: paused;
  transform: translate(10px, -6px);
}

.ppw-score-ring {
  position: relative;
  width: 68px;
  height: 68px;
  margin: 6px 0 4px;
  display: grid;
  place-items: center;
}

.ppw-score-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ppw-ring-bg {
  fill: none;
  stroke: rgba(0, 161, 154, 0.14);
  stroke-width: 6;
}

.ppw-ring-meter {
  fill: none;
  stroke: var(--teal);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease;
}

.ppw-score-val {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1;
}

.ppw-score-val strong {
  font-size: 22px;
  font-weight: 800;
  color: var(--navy);
}

.ppw-score-val small {
  font-size: 9px;
  font-weight: 700;
  color: var(--ink-faint);
  margin-top: 1px;
}

.ppw-chip--compliance {
  bottom: 28px;
  right: -20px;
  width: 158px;
  animation: ppw-float-c 5.7s ease-in-out infinite;
}
.ppw-visual:hover .ppw-chip--compliance {
  animation-play-state: paused;
  transform: translate(10px, 6px);
}

@keyframes ppw-float-a {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes ppw-float-b {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(7px); }
}
@keyframes ppw-float-c {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* ── Library body ─────────────────────────────────────────────────── */
.ppw-body {
  background: #ece8dd;
  border-top: 1px solid var(--line);
  padding: 40px 0 56px;
}

.ppw-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.ppw-aside {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ppw-content {
  min-width: 0;
}

/* ── Controls ─────────────────────────────────────────────────────── */
.ppw-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.ppw-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  padding: 0 14px;
  height: 50px;
  color: #a39e8e;
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.ppw-search:focus-within,
.ppw-search.active {
  border-color: var(--teal);
  color: var(--teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}

.ppw-search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.ppw-search-input::placeholder {
  color: #a8a395;
  font-weight: 500;
}

.ppw-search-clear {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: #f1efe7;
  color: #8a8576;
  font-size: 15px;
  font-weight: 700;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}

.ppw-sort {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 50px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1.5px solid var(--line);
  background: #fff;
  color: var(--ink-soft);
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.04);
  flex-shrink: 0;
}

.ppw-sort-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-faint);
}

.ppw-sort-select {
  appearance: none;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--navy);
  cursor: pointer;
  outline: none;
  padding-right: 16px;
}

.ppw-sort-caret {
  position: absolute;
  right: 12px;
  color: var(--ink-faint);
  pointer-events: none;
}

.pp-mobile-nav {
  display: none;
}

/* ── Property card grid ───────────────────────────────────────────── */
.passport-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(248px, 1fr));
  gap: 18px;
}

.prop-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.04);
}

.prop-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 34px rgba(35, 29, 69, 0.1);
  border-color: rgba(0, 161, 154, 0.3);
}

.prop-card-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.prop-book {
  position: relative;
  width: 58px;
  height: 78px;
  flex-shrink: 0;
  filter: drop-shadow(0 6px 12px rgba(0, 140, 134, 0.22));
}

.prop-book :deep(.passport-card) {
  margin: 0;
  padding: 0;
}

.prop-book :deep(.passport-container) {
  width: 100%;
  height: 100%;
}

.prop-book :deep(.passport-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
}

.prop-book--stack {
  width: 64px;
}

.prop-book--stack .prop-book-layer {
  width: 58px;
  height: 78px;
}

.prop-card-info {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
}

.prop-card-name {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.prop-card-sub {
  margin: 3px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-faint);
}

.prop-pill {
  display: inline-block;
  margin-top: 8px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 999px;
}

.prop-pill--collection {
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
}

.prop-card-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1efe7;
}

.prop-pct {
  font-size: 15px;
  font-weight: 800;
  color: var(--teal);
  font-feature-settings: 'tnum';
}

.prop-status {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--navy);
}

.prop-meta-num {
  font-size: 15px;
  font-weight: 800;
  color: var(--teal);
}

.prop-meta-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-faint);
}

.prop-icons {
  display: inline-flex;
  gap: 6px;
  margin-left: auto;
}

.prop-ic {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
}

.prop-ic svg {
  width: 15px;
  height: 15px;
}

.prop-ic--docs {
  background: rgba(120, 99, 240, 0.12);
  color: #6d5ce0;
}

.prop-ic--energy {
  background: rgba(214, 158, 46, 0.14);
  color: #cf9b2c;
}

.prop-ic--compliance {
  background: rgba(0, 161, 154, 0.12);
  color: var(--teal);
}

.prop-trash {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border: none;
  background: rgba(229, 62, 62, 0.1);
  color: #e53e3e;
  display: grid;
  place-items: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.18s ease, background 0.18s;
}

.prop-card:hover .prop-trash {
  opacity: 1;
}

.prop-trash:hover {
  background: rgba(229, 62, 62, 0.18);
}

/* Add-new card */
.prop-card--add {
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 6px;
  border: 2px dashed rgba(0, 161, 154, 0.4);
  background: rgba(0, 161, 154, 0.03);
  box-shadow: none;
  min-height: 168px;
}

.prop-card--add:hover {
  border-color: var(--teal);
  background: rgba(0, 161, 154, 0.06);
}

.prop-add-plus {
  font-size: 34px;
  line-height: 1;
  color: var(--teal);
  font-weight: 300;
}

.prop-add-name {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--teal-dark);
}

.prop-add-sub {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-faint);
  max-width: 160px;
}

/* ── States ───────────────────────────────────────────────────────── */
.coll-state-wrap {
  width: 100%;
}

.coll-state-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.06);
  padding: 28px 20px;
  text-align: center;
}

.coll-state-card--error {
  border-color: rgba(199, 62, 54, 0.32);
  background: linear-gradient(180deg, #fff8f7 0%, #ffffff 100%);
}

.coll-state-ic {
  font-size: 30px;
  margin-bottom: 8px;
}

.coll-state-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.2px;
}

.coll-state-sub {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ink-soft);
}

.coll-state-btn {
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background: var(--teal);
  color: white;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
}

/* ── Resume card ──────────────────────────────────────────────────── */
.coll-resume {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin: 0;
  padding: 16px;
  background: linear-gradient(135deg, #f3fbfa, #eef9f3);
  border: 1px solid #d9efe7;
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 16px rgba(31, 122, 102, 0.08);
  font-family: inherit;
}
.coll-resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(31, 122, 102, 0.16);
}
.coll-resume-book {
  width: 70px;
  flex-shrink: 0;
  filter: drop-shadow(0 6px 12px rgba(0, 140, 134, 0.22));
}
.coll-resume-book :deep(.passport-card) {
  margin: 0;
  padding: 0;
}
.coll-resume-book :deep(.passport-container) {
  width: 100%;
  height: 92px;
}
.coll-resume-content {
  flex: 1;
  min-width: 0;
}
.coll-resume-eyebrow {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--teal);
  margin-bottom: 4px;
}
.coll-resume-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.coll-resume-meta {
  font-size: 12px;
  color: var(--ink-soft);
  margin-bottom: 8px;
  line-height: 1.4;
}
.coll-resume-meta b {
  color: var(--teal);
  font-weight: 700;
}
.coll-resume-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}
.coll-resume-track {
  flex: 1;
  height: 5px;
  background: #d5ece8;
  border-radius: 999px;
  overflow: hidden;
}
.coll-resume-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a19a, #00b5ad);
  border-radius: 999px;
  transition: width 0.5s ease;
}
.coll-resume-pct {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--teal);
  flex-shrink: 0;
}
.coll-resume-cta {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.36);
  transition: transform 0.15s ease;
}
.coll-resume:hover .coll-resume-cta {
  transform: translateX(2px);
}

/* Location chips */
.coll-cities {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.coll-city-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ink-soft);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  font-family: inherit;
}
.coll-city-chip:hover {
  border-color: #cde8e1;
  color: var(--teal);
}
.coll-city-chip.active {
  background: var(--teal);
  border-color: var(--teal);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 161, 154, 0.28);
}
.coll-city-num {
  font-size: 10.5px;
  font-weight: 800;
  background: rgba(0, 161, 154, 0.12);
  color: var(--teal);
  padding: 1px 7px;
  border-radius: 999px;
}
.coll-city-chip.active .coll-city-num {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

/* Watching */
.watching-section {
  padding: 4px 0 0;
  margin-top: 4px;
}
.watching-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}
.watching-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.01em;
}
.watching-count {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: var(--navy);
  padding: 2px 8px;
  border-radius: 999px;
}
.watching-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.watching-card {
  background: #fff;
  border: 1.5px solid #cdeee7;
  border-radius: 14px;
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.watching-card:active {
  transform: scale(0.985);
}
.watching-card-ic {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #f0fdfa;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
}
.watching-card-body {
  flex: 1;
  min-width: 0;
}
.watching-card-addr {
  font-size: 13px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1.25;
}
.watching-card-sub {
  font-size: 11px;
  color: var(--ink-faint);
  margin-top: 1px;
}
.watching-card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.watching-pill {
  font-size: 9.5px;
  font-weight: 700;
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}
.watching-pill-published {
  background: var(--navy);
  color: #fff;
}
.watching-purchased {
  font-size: 10px;
  color: var(--ink-faint);
  font-weight: 600;
}
.watching-card-arrow {
  font-size: 18px;
  color: var(--teal);
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Delete modal ─────────────────────────────────────────────────── */
.delete-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.delete-modal {
  background: white;
  border-radius: 20px;
  padding: 28px 24px 24px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  animation: pop-in 0.2s ease;
}
@keyframes pop-in {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.delete-modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.delete-modal-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--navy);
  margin: 0 0 10px;
}
.delete-modal-body {
  font-size: 14px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin: 0 0 24px;
}
.delete-modal-body strong {
  color: var(--navy);
}
.delete-modal-actions {
  display: flex;
  gap: 12px;
}
.delete-btn-cancel {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: 1.5px solid #e0ddd2;
  background: white;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-soft);
  cursor: pointer;
  transition: background 0.15s;
}
.delete-btn-cancel:hover:not(:disabled) {
  background: #f5f3ec;
}
.delete-btn-confirm {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: #e53e3e;
  font-size: 15px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s;
}
.delete-btn-confirm:disabled,
.delete-btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.delete-spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .ppw-hero-grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }
  .ppw-visual {
    min-height: 320px;
  }
  .ppw-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .ppw-aside {
    position: static;
    top: auto;
  }
}

@media (max-width: 899px) {
  .ppn-links,
  .ppn-cta {
    display: none;
  }
  .pp-shell {
    width: calc(100% - 32px);
  }
  .ppn-nav-inner {
    min-height: 60px;
  }
  .ppw-hero {
    padding-top: 36px;
  }
  .ppw-body {
    padding-bottom: 96px;
  }
  .pp-mobile-nav {
    display: block;
  }
}

@media (max-width: 640px) {
  .pp-shell {
    width: calc(100% - 24px);
  }
  .ppw-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .ppw-sort {
    justify-content: space-between;
  }
  .passport-grid {
    grid-template-columns: 1fr;
  }
  .ppw-stat {
    min-width: calc(50% - 7px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ppw-book,
  .ppw-chip {
    animation: none;
  }
}
</style>
