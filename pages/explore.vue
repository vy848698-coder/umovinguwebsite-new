<template>
  <div class="dsh">
    <!-- Navbar actions. Both are signed-in essentials this dashboard has no
         other route to: notifications had no entry point anywhere in the app
         despite the backend serving them, and the profile was only reachable
         from the mobile menu. Neither duplicates anything already on the
         page (Add a property lives in the page head). -->
    <WebTopNav>
      <template #actions>
        <NotificationBell />

        <NuxtLink to="/profile" class="dsh-nav-profile" aria-label="Your profile">
          <UserAvatar
            :src="profile?.avatarUrl"
            :first-name="profile?.firstName"
            :last-name="profile?.lastName"
            :size="30"
          />
          <span class="dsh-nav-profile-text">
            <strong>{{ profile?.firstName || 'Profile' }}</strong>
            <small>{{ roleLabel }}</small>
          </span>
        </NuxtLink>
      </template>
    </WebTopNav>

    <main class="dsh-shell">
      <!-- ── Greeting + search ───────────────────────────────────────── -->
      <section class="dsh-head">
        <div class="dsh-head-text">
          <p class="dsh-greeting">{{ greeting }}</p>
          <h1 class="dsh-title">{{ headline }}</h1>
          <p class="dsh-lede">{{ lede }}</p>
        </div>

        <div class="dsh-head-side">
          <span class="dsh-role-chip">
            <img :src="roleArt" alt="" class="dsh-role-art" loading="lazy" />
            <span>
              <small>Signed in as</small>
              <strong>{{ roleLabel }}</strong>
            </span>
          </span>
          <button class="dsh-add" type="button" @click="startClaimFlow">
            <img src="/dashboard/addProperty.png" alt="" class="dsh-add-ic" loading="lazy" />
            Add a property
          </button>
        </div>
      </section>

      <div class="dsh-search">
        <div class="dsh-search-field">
          <PropertySearchInput
            placeholder="Search by postcode, address or area"
            variant="light"
            @select="onSearchSelect"
            @enter="onSearchEnter"
          />
        </div>
        <button class="dsh-search-btn" type="button" @click="runSearch">
          <Icon name="i-lucide-search" />
          Search
        </button>
      </div>

      <!-- ── Loading skeleton until the role is known, so the page never
              flashes the wrong role's content ─────────────────────────── -->
      <div v-if="!roleResolved" class="dsh-boot">
        <div class="dsh-boot-card" />
        <div class="dsh-boot-rows">
          <div class="dsh-boot-row" />
          <div class="dsh-boot-row" />
          <div class="dsh-boot-row" />
        </div>
      </div>

      <template v-else>
        <div class="dsh-grid">
          <!-- ═══ Main column ═══════════════════════════════════════ -->
          <div class="dsh-main">
            <!-- ── Active passport ── -->
            <section class="dsh-section">
              <div class="dsh-sec-head">
                <img src="/dashboard/sectionPassport.png" alt="" class="dsh-sec-ic" loading="lazy" />
                <div>
                  <p class="dsh-eyebrow">Your active passport</p>
                  <h2 class="dsh-sec-title">{{ passportSectionTitle }}</h2>
                </div>
              </div>

              <div v-if="loadingPrimary" class="dsh-skel dsh-skel--hero" />

              <!-- Buyer passport -->
              <article
                v-else-if="isBuyerView && buyerProfile"
                class="apc"
                role="button"
                tabindex="0"
                @click="navigateTo('/buyer-profile/view')"
                @keydown.enter="navigateTo('/buyer-profile/view')"
              >
                <div class="apc-book">
                  <PassportCard line1="" line2="" type="BUYER" />
                </div>
                <div class="apc-info">
                  <span class="apc-pill">Buyer passport</span>
                  <h3 class="apc-name">Buyer Passport</h3>
                  <p v-if="buyerIdVerified" class="apc-verified">
                    <Icon name="i-lucide-badge-check" />
                    Identity verified
                  </p>
                  <p v-else class="apc-unverified">
                    <Icon name="i-lucide-shield-alert" />
                    Identity not yet verified
                  </p>
                  <div class="apc-prog-row">
                    <span>Finance <strong>{{ financePercent }}%</strong> complete</span>
                  </div>
                  <div class="apc-track">
                    <div class="apc-fill" :style="{ width: financePercent + '%' }" />
                  </div>
                  <div class="apc-actions">
                    <button
                      class="apc-cta"
                      type="button"
                      @click.stop="navigateTo('/buyer-profile/build')"
                    >
                      Continue my Buyer Passport
                      <Icon name="i-lucide-arrow-right" />
                    </button>
                    <button
                      class="apc-link"
                      type="button"
                      @click.stop="navigateTo('/passport/collections')"
                    >
                      View all passports
                      <Icon name="i-lucide-chevron-right" />
                    </button>
                  </div>
                </div>
              </article>

              <!-- Owner (seller / landlord / both) passport -->
              <article
                v-else-if="!isBuyerView && passports.length"
                class="apc"
                role="button"
                tabindex="0"
                @click="navigateTo('/passportview/' + primaryPassport.id)"
                @keydown.enter="navigateTo('/passportview/' + primaryPassport.id)"
              >
                <div class="apc-book">
                  <PassportCard
                    :line1="primaryPassport.addressLine1 || primaryPassport.address || ''"
                    :line2="primaryPassport.postcode || ''"
                    :type="primaryPassport.type || defaultPassportType"
                  />
                </div>
                <div class="apc-info">
                  <span class="apc-pill">
                    {{ (primaryPassport.type || defaultPassportType).toLowerCase() }} passport
                  </span>
                  <h3 class="apc-name">
                    {{ primaryPassport.address || primaryPassport.addressLine1 }}
                  </h3>
                  <p class="apc-postcode">{{ primaryPassport.postcode }}</p>
                  <div class="apc-prog-row">
                    <span>
                      Passport
                      <strong>{{ primaryPassport.completionPercentage ?? 0 }}%</strong>
                      complete
                    </span>
                    <span v-if="primaryPassport.status === 'PUBLISHED'" class="apc-live">
                      <span class="apc-live-dot" />Published
                    </span>
                  </div>
                  <div class="apc-track">
                    <div
                      class="apc-fill"
                      :style="{ width: (primaryPassport.completionPercentage ?? 0) + '%' }"
                    />
                  </div>
                  <div class="apc-actions">
                    <button
                      class="apc-cta"
                      type="button"
                      @click.stop="navigateTo('/passportview/' + primaryPassport.id)"
                    >
                      Continue my Passport
                      <Icon name="i-lucide-arrow-right" />
                    </button>
                    <button
                      class="apc-link"
                      type="button"
                      @click.stop="navigateTo('/passport/collections')"
                    >
                      View all passports
                      <Icon name="i-lucide-chevron-right" />
                    </button>
                  </div>
                </div>
              </article>

              <!-- Nothing started yet -->
              <button
                v-else
                type="button"
                class="dsh-empty-cta"
                @click="isBuyerView ? navigateTo('/buyer-profile/build') : startClaimFlow()"
              >
                <span class="dsh-empty-plus">+</span>
                <span class="dsh-empty-body">
                  <strong>{{ emptyPassportTitle }}</strong>
                  <small>{{ emptyPassportSub }}</small>
                </span>
                <Icon name="i-lucide-chevron-right" class="dsh-empty-chev" />
              </button>
            </section>

            <!-- ── Next for you ── -->
            <section v-if="nextActions.length" class="dsh-section">
              <div class="dsh-sec-head">
                <img src="/dashboard/nextDocuments.png" alt="" class="dsh-sec-ic" loading="lazy" />
                <div>
                  <p class="dsh-eyebrow">Next for you</p>
                  <h2 class="dsh-sec-title">Pick up where you left off</h2>
                </div>
              </div>

              <div class="nfy">
                <p v-if="stalenessLine" class="nfy-stale">
                  <Icon name="i-lucide-clock" />
                  {{ stalenessLine }}
                </p>
                <button
                  v-for="action in nextActions"
                  :key="action.title"
                  type="button"
                  class="nfy-row"
                  @click="navigateTo(action.to)"
                >
                  <img :src="action.icon" alt="" class="nfy-ic" loading="lazy" />
                  <span class="nfy-body">
                    <strong>{{ action.title }}</strong>
                    <small>{{ action.sub }}</small>
                  </span>
                  <Icon name="i-lucide-chevron-right" class="nfy-chev" />
                </button>
              </div>
            </section>

            <RecentlyViewedFeed
              v-if="isBuyerView"
              :properties="recentlyViewed"
              :loading="loadingRecentlyViewed"
            />

            <ForYouFeed
              :properties="properties"
              :loading="loadingProperties"
              :needs-postcode="needsPostcode"
              :has-filters="hasAnyForYouFilters"
              @open-filters="openForYouFilters"
              @postcode-saved="refetchForYou"
            />
          </div>

          <!-- ═══ Side column ═══════════════════════════════════════ -->
          <aside class="dsh-side">
            <!-- Owner HomeScore — only once we have a real score to show -->
            <section
              v-if="!isBuyerView && passports.length && primaryPassport.homeScore != null"
              class="hsc"
            >
              <div class="hsc-top">
                <div class="hsc-ring">
                  <svg viewBox="0 0 100 100" class="hsc-ring-svg">
                    <defs>
                      <linearGradient id="dshHsGrad" x1="1" y1="0" x2="0" y2="0">
                        <stop offset="0%" stop-color="#2fd0c6" />
                        <stop offset="100%" stop-color="#00756f" />
                      </linearGradient>
                    </defs>
                    <circle class="hsc-ring-bg" cx="50" cy="50" r="42" />
                    <circle
                      class="hsc-ring-fill"
                      cx="50"
                      cy="50"
                      r="42"
                      stroke-dasharray="263.9"
                      :stroke-dashoffset="homeScoreDashoffset"
                    />
                  </svg>
                  <div class="hsc-ring-label">
                    <span class="hsc-ring-num">{{ primaryPassport.homeScore }}</span>
                    <span class="hsc-ring-den">/100</span>
                  </div>
                </div>
                <div class="hsc-info">
                  <h3 class="hsc-title">Your home today</h3>
                  <p class="hsc-sub">
                    How your home performs on energy, running costs and value.
                  </p>
                </div>
              </div>
              <div v-if="primaryPassport.homeScorePotential != null" class="hsc-potential">
                <span>Potential score</span>
                <strong>{{ primaryPassport.homeScorePotential }}/100</strong>
              </div>
              <button class="hsc-cta" type="button" @click="navigateTo(homeScoreHref)">
                See my HomeScore
                <Icon name="i-lucide-arrow-right" />
              </button>
            </section>

            <!-- Watching -->
            <section class="dsh-card">
              <div class="dsh-card-head">
                <img src="/dashboard/sectionWatching.png" alt="" class="dsh-card-ic" loading="lazy" />
                <div class="dsh-card-head-text">
                  <h3>
                    Watching
                    <span v-if="savedProperties.length" class="dsh-count">
                      {{ savedProperties.length }}
                    </span>
                  </h3>
                  <small>Properties you're keeping an eye on</small>
                </div>
              </div>

              <div v-if="loadingSaved" class="dsh-skel dsh-skel--row" />

              <template v-else-if="savedProperties.length">
                <NuxtLink
                  v-for="(prop, i) in savedProperties.slice(0, 3)"
                  :key="prop.id"
                  :to="`/property/${prop.id}`"
                  class="watch-row"
                >
                  <span class="watch-media">
                    <PropertyImage
                      :src="prop.imageUrl"
                      :alt="prop.addressLine1"
                      :seed="prop.id"
                      :variant-index="i"
                      :show-caption="false"
                      class="watch-img"
                    />
                  </span>
                  <span class="watch-body">
                    <strong>{{ prop.addressLine1 }}</strong>
                    <small>{{ prop.postcode }}</small>
                    <small v-if="prop.homeScore != null" class="watch-hs">
                      HomeScore <b>{{ prop.homeScore }}/100</b>
                    </small>
                  </span>
                  <Icon name="i-lucide-chevron-right" class="watch-chev" />
                </NuxtLink>
                <button
                  v-if="savedProperties.length > 3"
                  type="button"
                  class="dsh-card-more"
                  @click="navigateTo('/profile/saved-properties')"
                >
                  {{ savedProperties.length - 3 }} more
                  {{ savedProperties.length - 3 === 1 ? 'property' : 'properties' }} watching
                </button>
                <button
                  v-else
                  type="button"
                  class="dsh-card-more"
                  @click="navigateTo('/profile/saved-properties')"
                >
                  View all saved properties
                </button>
              </template>

              <div v-else class="dsh-card-empty">
                <p>Nothing saved yet.</p>
                <button type="button" @click="navigateTo('/marketplace')">
                  Browse properties
                </button>
              </div>
            </section>

            <!-- Run a HomeScore on any property -->
            <button class="hec" type="button" @click="navigateTo('/homescore')">
              <img src="/dashboard/sectionHomescore.png" alt="" class="hec-art" loading="lazy" />
              <span class="hec-body">
                <strong>Check any home's HomeScore</strong>
                <small>
                  Instant insight on energy, running costs and value — for any UK
                  property, not just your own.
                </small>
                <span class="hec-cta">
                  Run a free HomeScore
                  <Icon name="i-lucide-arrow-right" />
                </span>
              </span>
            </button>

            <!-- 'both' role: compact buyer-side summary alongside the owner view -->
            <section v-if="role === 'both'" class="dsh-card">
              <div class="dsh-card-head">
                <img src="/dashboard/passportBuyer.png" alt="" class="dsh-card-ic" loading="lazy" />
                <div class="dsh-card-head-text">
                  <h3>Also buying?</h3>
                  <small>Your buyer side, at a glance</small>
                </div>
              </div>
              <div v-if="loadingBuyerSummary" class="dsh-skel dsh-skel--row" />
              <template v-else>
                <button
                  type="button"
                  class="watch-row watch-row--plain"
                  @click="navigateTo(buyerProfile ? '/buyer-profile/view' : '/buyer-profile/build')"
                >
                  <span class="watch-body">
                    <strong>
                      {{ buyerProfile ? 'Your Buyer Passport' : 'Start your Buyer Passport' }}
                    </strong>
                    <small>
                      {{
                        buyerProfile
                          ? `Finance ${financePercent}% complete`
                          : 'Verify your identity and buying position.'
                      }}
                    </small>
                  </span>
                  <Icon name="i-lucide-chevron-right" class="watch-chev" />
                </button>
              </template>
            </section>

            <!-- Add another property -->
            <button v-if="!isBuyerView" class="apr" type="button" @click="startClaimFlow">
              <img src="/dashboard/addProperty.png" alt="" class="apr-ic" loading="lazy" />
              <span class="apr-body">
                <strong>Add another property</strong>
                <small>Verify ownership, then choose a Rental or Seller Passport.</small>
              </span>
              <Icon name="i-lucide-chevron-right" class="apr-chev" />
            </button>
          </aside>
        </div>
      </template>
    </main>

    <PropertySearchFiltersModal
      v-model="forYouFiltersModalOpen"
      :initial-filters="forYouPendingFilters"
      @search="onForYouFiltersSearch"
    />

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
// The post-login landing page. Built around the signed-in user's role —
// buyer, seller, landlord or both — since each one arrives wanting a
// different first screen: a buyer wants matches and their buying position,
// an owner wants their passport's completeness and their home's score.
//
// This lives at /explore (rather than a separate /dashboard route) because
// Explore is where every in-app link, the bottom nav and the post-login
// redirect already point. That also means landlord can't be bounced to
// /explore the way a standalone dashboard could — it would redirect to
// itself — so the landlord role gets real content here.
definePageMeta({ title: 'Your dashboard - UmovingU', middleware: 'auth' })

import { ref, computed, onMounted } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import NotificationBell from '~/components/ui/NotificationBell.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import PropertySearchFiltersModal from '~/components/property/PropertySearchFiltersModal.vue'
import ForYouFeed from '~/components/property/ForYouFeed.vue'
import RecentlyViewedFeed from '~/components/property/RecentlyViewedFeed.vue'
import { usePropertyForYou } from '~/composables/usePropertyForYou'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    },
  ],
})

const config = useRuntimeConfig()
const { profile, fetchProfile } = useProfile()

const role = ref<string>('buy')
const roleResolved = ref(false)

const passports = ref<any[]>([])
const passportSections = ref<any[]>([])
const loadingPassport = ref(true)

const buyerProfile = ref<any>(null)
const loadingBuyerProfile = ref(true)
const savedProperties = ref<any[]>([])
const loadingSaved = ref(true)
// The 'both' role shows a buyer summary beside the owner view. It reuses
// buyerProfile/savedProperties, which the owner branch never populates
// otherwise, so it needs its own flag — loadingBuyerProfile/loadingSaved
// default to true and are only flipped by the pure-buyer branch.
const loadingBuyerSummary = ref(true)

const recentlyViewed = ref<any[]>([])
const loadingRecentlyViewed = ref(true)

const searchQuery = ref('')

const {
  properties,
  loadingProperties,
  needsPostcode,
  forYouFiltersModalOpen,
  forYouPendingFilters,
  hasAnyForYouFilters,
  openForYouFilters,
  onForYouFiltersSearch,
} = usePropertyForYou()

// ── Role shape ─────────────────────────────────────────────────────────
const isBuyerView = computed(() => role.value === 'buy')
const isLandlord = computed(() => role.value === 'landlord')

const defaultPassportType = computed(() => (isLandlord.value ? 'LANDLORD' : 'SELLER'))

const primaryPassport = computed<any>(() => passports.value[0] ?? {})

const roleLabel = computed(() => {
  if (role.value === 'sell') return 'Seller'
  if (role.value === 'landlord') return 'Landlord'
  if (role.value === 'both') return 'Buyer + Seller'
  return 'Buyer'
})

const roleArt = computed(() => {
  if (role.value === 'landlord') return '/dashboard/passportLandlord.png'
  if (role.value === 'buy') return '/dashboard/passportBuyer.png'
  return '/dashboard/passportSeller.png'
})

const headline = computed(() =>
  isBuyerView.value ? 'Your move at a glance' : 'Your property at a glance',
)

const lede = computed(() => {
  if (isBuyerView.value) {
    return 'Your buying position, the homes you are watching, and fresh matches near you.'
  }
  if (isLandlord.value) {
    return 'Your rental record, compliance documents and how your property is performing.'
  }
  if (role.value === 'both') {
    return 'Your property record and your buying position, side by side.'
  }
  return 'Your passport progress, your home’s score, and who is looking.'
})

const passportSectionTitle = computed(() => {
  if (isBuyerView.value) return 'Buyer Passport'
  if (isLandlord.value) return 'Rental Passport'
  return 'Property Passport'
})

const emptyPassportTitle = computed(() =>
  isBuyerView.value ? 'Start your Buyer Passport' : 'Start your Property Passport',
)
const emptyPassportSub = computed(() =>
  isBuyerView.value
    ? 'Verify your identity and buying position.'
    : 'Verify ownership and build your record.',
)

// The primary card is what the page is "about" for this role, so the
// section skeleton keys off whichever fetch actually feeds it.
const loadingPrimary = computed(() =>
  isBuyerView.value ? loadingBuyerProfile.value : loadingPassport.value,
)

// ── Greeting ───────────────────────────────────────────────────────────
// Deterministic, never Math.random(): this page server-renders then
// hydrates, and a random pick would differ between the two and trip a
// hydration mismatch.
const LATE_NIGHT_LINES = ['Having a late one', 'Burning the midnight oil', 'Still up']

const greeting = computed(() => {
  const now = new Date()
  const h = now.getHours()
  const first = profile.value?.firstName?.trim()
  const emailLocal = profile.value?.email?.split('@')[0]?.trim()
  const name = first || emailLocal || ''

  if (h >= 23 || h < 5) {
    const line = LATE_NIGHT_LINES[now.getDate() % LATE_NIGHT_LINES.length]
    return name ? `${line}, ${name}?` : `${line}?`
  }
  const timeOfDay = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return name ? `${timeOfDay}, ${name}` : timeOfDay
})

// ── Derived numbers ────────────────────────────────────────────────────
const homeScoreDashoffset = computed(() => {
  const s = primaryPassport.value?.homeScore
  if (typeof s !== 'number') return '263.9'
  return (263.9 * (1 - Math.min(Math.max(s, 0), 100) / 100)).toFixed(1)
})

const homeScoreHref = computed(() => {
  const propertyId = primaryPassport.value?.propertyId
  return propertyId ? `/homescore/${propertyId}` : '/homescore'
})

// Real KYC signal — buyer-profile.service.ts's getMine() overrides the
// always-false stored column with the actual User.kycStatus check before
// this reaches the frontend.
const buyerIdVerified = computed(() => buyerProfile.value?.idVerified === true)

// No isolated "finance %" field exists on BuyerProfile, so this is derived
// from the underlying funds fields rather than invented: nothing set (0),
// funds declared but not reviewed (55), reviewed and verified (100).
const financePercent = computed(() => {
  const p = buyerProfile.value
  if (!p) return 0
  if (p.fundsVerified) return 100
  if (p.fundsType && p.fundsAmount != null) return 55
  return 0
})

// BuyerProfile has 5 flat completion steps (identity / funds / chain /
// solicitor / statement) rather than a sections→tasks→questions tree.
const buyerIncompleteCount = computed(() => {
  const steps = buyerProfile.value?.completedSteps ?? 0
  return Math.max(0, 5 - steps)
})

// Unanswered questions across every task in every section. Nothing derives
// this server-side yet, so it's summed here from GET /passport/:id/sections,
// which already returns per-task totalQuestions/answeredQuestions.
const incompleteItemCount = computed(() => {
  let total = 0
  for (const section of passportSections.value) {
    for (const task of section?.tasks ?? []) {
      total += Math.max(0, (task.totalQuestions ?? 0) - (task.answeredQuestions ?? 0))
    }
  }
  return total
})

// A real "last touched N days ago" nudge rather than a fabricated deadline
// — there isn't one anywhere in the data. Only once something has actually
// gone stale (3+ days), and only while the record is genuinely incomplete.
function stalenessCopy(createdAt?: string | null, lastTouchedAt?: string | null): string | null {
  const source = lastTouchedAt || createdAt
  if (!source) return null
  const days = Math.floor((Date.now() - new Date(source).getTime()) / 86_400_000)
  if (days < 3) return null
  const verb = lastTouchedAt ? 'Last touched' : 'Started'
  const when = days === 1 ? 'yesterday' : `${days} days ago`
  return `${verb} ${when} — pick up where you left off.`
}

const stalenessLine = computed(() => {
  if (isBuyerView.value) {
    if (!buyerProfile.value || buyerIncompleteCount.value === 0) return null
    return stalenessCopy(buyerProfile.value.createdAt, buyerProfile.value.updatedAt)
  }
  if (!passports.value.length || incompleteItemCount.value === 0) return null
  return stalenessCopy(primaryPassport.value.createdAt, primaryPassport.value.lastVisitedAt)
})

// ── "Next for you" rows, per role ──────────────────────────────────────
const nextActions = computed(() => {
  const rows: { title: string; sub: string; icon: string; to: string }[] = []

  if (isBuyerView.value) {
    if (!buyerProfile.value) return rows
    if (buyerIncompleteCount.value > 0) {
      rows.push({
        title: `Complete ${buyerIncompleteCount.value} ${buyerIncompleteCount.value === 1 ? 'item' : 'items'} in your Passport`,
        sub: 'Add documents and details to build your record.',
        icon: '/dashboard/nextDocuments.png',
        to: '/buyer-profile/build',
      })
    }
    if (!buyerIdVerified.value) {
      rows.push({
        title: 'Verify your identity',
        sub: 'A verified ID is what sellers and agents check first.',
        icon: '/dashboard/nextIdentity.png',
        to: '/buyer-profile/build',
      })
    }
    if (financePercent.value < 100) {
      rows.push({
        title: 'Upload proof of funds or AIP',
        sub: 'Strengthen your position and unlock more.',
        icon: '/dashboard/nextFunds.png',
        to: '/buyer-profile/build',
      })
    }
    rows.push({
      title: 'Confirm your buying position',
      sub: 'Let agents and sellers know where you are in the chain.',
      icon: '/dashboard/nextPosition.png',
      to: '/buyer-profile/build',
    })
    return rows
  }

  if (!passports.value.length) return rows

  if (incompleteItemCount.value > 0) {
    rows.push({
      title: `Complete ${incompleteItemCount.value} ${incompleteItemCount.value === 1 ? 'item' : 'items'} in your Passport`,
      sub: 'Add documents and details to build your record.',
      icon: '/dashboard/nextDocuments.png',
      to: `/passportview/${primaryPassport.value.id}`,
    })
  }

  if (isLandlord.value) {
    rows.push({
      title: 'Keep your compliance documents current',
      sub: 'Gas, electrical and EPC certificates your tenants can see.',
      icon: '/dashboard/nextDocuments.png',
      to: `/passportview/landlord/${primaryPassport.value.id}`,
    })
  }

  rows.push({
    title: 'Improve your EPC',
    sub: 'See how you could raise your score and cut running costs.',
    icon: '/dashboard/nextEpc.png',
    to: homeScoreHref.value,
  })

  return rows
})

// ── Search ─────────────────────────────────────────────────────────────
function onSearchSelect(property: { id: string }) {
  if (property?.id) navigateTo(`/property/${property.id}`)
  else navigateTo('/marketplace')
}
function onSearchEnter(q: string) {
  searchQuery.value = q
  runSearch()
}
function runSearch() {
  const q = searchQuery.value.trim()
  navigateTo(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace')
}

function startClaimFlow() {
  navigateTo('/claim')
}

// ── Fetching ───────────────────────────────────────────────────────────
function normalizeRole(r: unknown): string {
  const allowed = ['sell', 'buy', 'both', 'landlord']
  return typeof r === 'string' && allowed.includes(r) ? r : 'buy'
}

// Fired independently rather than awaited with the rest: /property/for-you
// does live EPC/OS enrichment per candidate and can take seconds. Bundling
// it in would hold the whole page on its skeleton until the slowest call
// finished, when ForYouFeed has its own :loading state.
async function fetchForYou(token: string) {
  const result = await $fetch<{ items: any[]; needsPostcode?: boolean }>(
    `${config.public.apiBase}/property/for-you`,
    { headers: { Authorization: `Bearer ${token}` } },
  ).catch(() => null)
  properties.value = result?.items ?? []
  needsPostcode.value = result?.needsPostcode === true
  loadingProperties.value = false
}

// Fired by ForYouFeed once a postcode is saved. Re-reads the token rather
// than closing over onMounted's copy, since this can fire much later.
function refetchForYou() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (token) fetchForYou(token)
}

async function fetchRecentlyViewed(token: string) {
  const result = await $fetch<any[]>(`${config.public.apiBase}/property/recently-viewed`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null)
  recentlyViewed.value = result ?? []
  loadingRecentlyViewed.value = false
}

async function fetchBuyerSide(token: string) {
  const [buyerResult, savedResult] = await Promise.allSettled([
    $fetch<any>(`${config.public.apiBase}/buyer-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<any[]>(`${config.public.apiBase}/property/saved`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])
  if (buyerResult.status === 'fulfilled') buyerProfile.value = buyerResult.value ?? null
  if (savedResult.status === 'fulfilled') savedProperties.value = savedResult.value ?? []
}

onMounted(async () => {
  if (!profile.value) await fetchProfile()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return

  // A cached role renders the right shell immediately; the preferences call
  // below then confirms or corrects it.
  const cachedRole =
    typeof window !== 'undefined' ? localStorage.getItem('umu_role') : null
  if (cachedRole) role.value = normalizeRole(cachedRole)

  const prefResult = await $fetch<any>(`${config.public.apiBase}/profile/preferences`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null)

  role.value = normalizeRole((prefResult?.purpose as string[])?.[0] ?? cachedRole)
  if (typeof window !== 'undefined') localStorage.setItem('umu_role', role.value)
  roleResolved.value = true

  fetchForYou(token) // not awaited — see its own comment

  if (isBuyerView.value) {
    fetchRecentlyViewed(token) // not awaited — has its own loading state
    await fetchBuyerSide(token)
    loadingBuyerProfile.value = false
    loadingSaved.value = false
    return
  }

  // Owner roles (sell / landlord / both) also get the saved-properties list,
  // which feeds the Watching card shown for every role.
  fetchBuyerSide(token).then(() => {
    loadingSaved.value = false
    loadingBuyerSummary.value = false
  })

  const passportResult = await $fetch<any[]>(`${config.public.apiBase}/profile/passports`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null)

  if (passportResult) {
    const all = passportResult ?? []
    // /profile/passports returns every passport the user owns, any type,
    // most-recently-visited first. Prefer the one matching their role so a
    // landlord doesn't land on a seller book, falling back to whatever is
    // first rather than showing nothing.
    const wanted = isLandlord.value ? 'LANDLORD' : 'SELLER'
    const matching = all.filter((p: any) => p.type === wanted)
    passports.value = matching.length ? matching : all
  }
  loadingPassport.value = false

  if (passports.value.length) {
    const sections = await $fetch<any[]>(
      `${config.public.apiBase}/passport/${passports.value[0].id}/sections`,
      { headers: { Authorization: `Bearer ${token}` } },
    ).catch(() => [])
    passportSections.value = sections ?? []
  }
})
</script>

<style scoped>
.dsh {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #231d45;
}

.dsh-shell {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 24px 64px;
}

/* ── Navbar actions ────────────────────────────────────────────────── */
/* The bell ships as a bare transparent circle; against the cream navbar it
   needs the same bordered-chip treatment as the profile pill beside it, or
   the two read as unrelated. :deep() because .nb-btn is scoped to the
   NotificationBell component. */
.dsh :deep(.nb-btn) {
  width: 40px;
  height: 40px;
  border: 1px solid #e4e5ed;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsh :deep(.nb-btn:hover) {
  border-color: #9fe0d8;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.12);
}

.dsh-nav-profile {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 5px 14px 5px 5px;
  border-radius: 999px;
  border: 1px solid #e4e5ed;
  background: #fff;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsh-nav-profile:hover {
  border-color: #9fe0d8;
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.12);
}
.dsh-nav-profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.dsh-nav-profile-text strong {
  font-size: 13px;
  font-weight: 800;
  color: #231d45;
}
.dsh-nav-profile-text small {
  font-size: 10.5px;
  font-weight: 700;
  color: #8a90a6;
}
/* Below this the name would crowd the bar; the avatar alone still reads. */
@media (max-width: 1120px) {
  .dsh-nav-profile-text { display: none; }
  .dsh-nav-profile { padding: 5px; }
}

/* ── Head ──────────────────────────────────────────────────────────── */
.dsh-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.dsh-greeting {
  margin: 0 0 4px;
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
}
.dsh-title {
  margin: 0 0 6px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.dsh-lede {
  margin: 0;
  max-width: 58ch;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  color: #6b7089;
}
.dsh-head-side {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dsh-role-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 10px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e4e5ed;
}
.dsh-role-art {
  width: 26px;
  height: 34px;
  object-fit: contain;
}
.dsh-role-chip small {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a8a9ad;
}
.dsh-role-chip strong {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  color: #231d45;
}
.dsh-add {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px 12px 14px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.28);
}
.dsh-add:hover { filter: brightness(1.06); }
.dsh-add-ic { width: 22px; height: 22px; object-fit: contain; }

/* ── Search ────────────────────────────────────────────────────────── */
.dsh-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 10px 6px;
  background: #fff;
  border: 1px solid #e4e5ed;
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(31, 61, 98, 0.06);
  margin-bottom: 26px;
}
.dsh-search-field { flex: 1; min-width: 0; }
.dsh-search-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  background: #00a19a;
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
}
.dsh-search-btn:hover { background: #008a84; }

/* ── Boot skeleton ─────────────────────────────────────────────────── */
.dsh-boot { display: grid; gap: 16px; }
.dsh-boot-card, .dsh-boot-row, .dsh-skel {
  border-radius: 18px;
  background: linear-gradient(100deg, #eceff4 30%, #e2e6ee 50%, #eceff4 70%);
  background-size: 250% 100%;
  animation: dsh-shimmer 1.4s ease-in-out infinite;
}
.dsh-boot-card { height: 210px; }
.dsh-boot-rows { display: grid; gap: 10px; }
.dsh-boot-row { height: 66px; }
.dsh-skel--hero { height: 210px; }
.dsh-skel--row { height: 72px; }
@keyframes dsh-shimmer {
  from { background-position: 140% 0; }
  to { background-position: -40% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-boot-card, .dsh-boot-row, .dsh-skel { animation: none; }
}

/* ── Layout ────────────────────────────────────────────────────────── */
.dsh-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 348px;
  gap: 26px;
  align-items: start;
}
.dsh-main { min-width: 0; }
.dsh-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}

.dsh-section { margin-bottom: 30px; }
.dsh-sec-head {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 14px;
}
.dsh-sec-ic { width: 42px; height: 42px; object-fit: contain; flex-shrink: 0; }
.dsh-eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00a19a;
}
.dsh-sec-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* ── Active passport card ──────────────────────────────────────────── */
.apc {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 22px;
  cursor: pointer;
  transition: box-shadow 0.18s ease, border-color 0.18s ease;
}
.apc:hover {
  border-color: #d8e4e2;
  box-shadow: 0 16px 36px rgba(31, 61, 98, 0.1);
}
.apc:focus-visible { outline: 2px solid #00a19a; outline-offset: 2px; }
.apc-book { flex-shrink: 0; width: 116px; }
.apc-info { flex: 1; min-width: 0; }
.apc-pill {
  display: inline-block;
  padding: 4px 11px;
  border-radius: 999px;
  background: #e9f6f5;
  color: #00756f;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.apc-name {
  margin: 9px 0 1px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.apc-postcode {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #8a90a6;
}
.apc-verified, .apc-unverified {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 6px 0 0;
  font-size: 12.5px;
  font-weight: 700;
}
.apc-verified { color: #00756f; }
.apc-unverified { color: #b45309; }
.apc-prog-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 14px 0 6px;
  font-size: 13px;
  font-weight: 600;
  color: #4a5876;
}
.apc-prog-row strong { color: #231d45; font-weight: 800; }
.apc-live {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 800;
  color: #00756f;
}
.apc-live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #00a19a;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.16);
}
.apc-track {
  height: 7px;
  border-radius: 999px;
  background: #edf0f5;
  overflow: hidden;
}
.apc-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2fd0c6, #00a19a);
  transition: width 0.4s ease;
}
.apc-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.apc-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.26);
}
.apc-cta:hover { filter: brightness(1.06); }
.apc-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
  cursor: pointer;
}
.apc-link:hover { color: #00756f; }

/* ── Empty CTA ─────────────────────────────────────────────────────── */
.dsh-empty-cta {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 22px 24px;
  text-align: left;
  background: #fff;
  border: 1px dashed #cfd8e3;
  border-radius: 20px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.dsh-empty-cta:hover { border-color: #9fe0d8; background: #fbfffe; }
.dsh-empty-plus {
  width: 46px; height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #e9f6f5;
  color: #00a19a;
  font-size: 24px;
  font-weight: 700;
}
.dsh-empty-body { flex: 1; min-width: 0; }
.dsh-empty-body strong { display: block; font-size: 15.5px; font-weight: 800; }
.dsh-empty-body small {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b7089;
}
.dsh-empty-chev { color: #a8a9ad; font-size: 18px; }

/* ── Next for you ──────────────────────────────────────────────────── */
.nfy {
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 20px;
  overflow: hidden;
}
.nfy-stale {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 12px 20px;
  background: #fff8ed;
  border-bottom: 1px solid #fbe4bd;
  font-size: 12.5px;
  font-weight: 700;
  color: #92400e;
}
.nfy-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 20px;
  text-align: left;
  background: none;
  border: none;
  border-top: 1px solid #f0f2f6;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.14s ease;
}
.nfy-row:first-of-type { border-top: none; }
.nfy-row:hover { background: #fafbfd; }
.nfy-ic { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
.nfy-body { flex: 1; min-width: 0; }
.nfy-body strong { display: block; font-size: 14.5px; font-weight: 800; }
.nfy-body small {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: #6b7089;
}
.nfy-chev { color: #c3c6d2; font-size: 18px; flex-shrink: 0; }

/* ── Side cards ────────────────────────────────────────────────────── */
.dsh-card {
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 20px;
  overflow: hidden;
}
.dsh-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid #f0f2f6;
}
.dsh-card-ic { width: 34px; height: 38px; object-fit: contain; flex-shrink: 0; }
.dsh-card-head-text h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 15px;
  font-weight: 800;
}
.dsh-card-head-text small {
  display: block;
  margin-top: 1px;
  font-size: 11.5px;
  font-weight: 500;
  color: #8a90a6;
}
.dsh-count {
  padding: 1px 8px;
  border-radius: 999px;
  background: #e9f6f5;
  color: #00756f;
  font-size: 11px;
  font-weight: 800;
}
.dsh-card-more {
  display: block;
  width: 100%;
  padding: 13px;
  background: #fafbfd;
  border: none;
  border-top: 1px solid #f0f2f6;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: #00a19a;
  cursor: pointer;
}
.dsh-card-more:hover { background: #f2faf8; }
.dsh-card-empty { padding: 22px 18px; text-align: center; }
.dsh-card-empty p {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: #8a90a6;
}
.dsh-card-empty button {
  padding: 9px 18px;
  border: 1px solid #e4e5ed;
  border-radius: 10px;
  background: #fff;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: #231d45;
  cursor: pointer;
}
.dsh-card-empty button:hover { border-color: #9fe0d8; color: #00756f; }

.watch-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-decoration: none;
  color: inherit;
  padding: 12px 16px;
  text-align: left;
  background: none;
  border: none;
  border-top: 1px solid #f5f6f9;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.14s ease;
}
.watch-row:first-of-type { border-top: none; }
.watch-row:hover { background: #fafbfd; }
.watch-row--plain { padding: 14px 16px; }
.watch-media {
  width: 56px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #eef4f2;
}
.watch-img { width: 100%; height: 100%; }
.watch-body { flex: 1; min-width: 0; }
.watch-body strong {
  display: block;
  font-size: 13.5px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.watch-body small {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: #8a90a6;
}
.watch-hs { color: #00756f !important; }
.watch-hs b { font-weight: 800; }
.watch-chev { color: #c3c6d2; font-size: 17px; flex-shrink: 0; }

/* ── HomeScore (owner) ─────────────────────────────────────────────── */
.hsc {
  padding: 20px;
  background: linear-gradient(160deg, #0a0f2c, #131a3a);
  border-radius: 20px;
  color: #fff;
}
.hsc-top { display: flex; align-items: center; gap: 16px; }
.hsc-ring { position: relative; width: 92px; height: 92px; flex-shrink: 0; }
.hsc-ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.hsc-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 8;
}
.hsc-ring-fill {
  fill: none;
  stroke: url(#dshHsGrad);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
}
.hsc-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
}
.hsc-ring-num { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
.hsc-ring-den { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.5); }
.hsc-info { flex: 1; min-width: 0; }
.hsc-title { margin: 0 0 3px; font-size: 15.5px; font-weight: 800; }
.hsc-sub {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
}
.hsc-potential {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}
.hsc-potential strong { color: #5eead4; font-weight: 800; }
.hsc-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 14px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
}
.hsc-cta:hover { filter: brightness(1.08); }

/* ── HomeScore explore entry ───────────────────────────────────────── */
.hec {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  text-align: left;
  background: linear-gradient(160deg, #f0fbf8, #e4f5f1);
  border: 1px solid #d3ece6;
  border-radius: 20px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.hec:hover {
  border-color: #9fe0d8;
  box-shadow: 0 12px 28px rgba(0, 161, 154, 0.14);
}
.hec-art { width: 52px; height: 52px; object-fit: contain; flex-shrink: 0; }
.hec-body { flex: 1; min-width: 0; }
.hec-body strong { display: block; font-size: 15px; font-weight: 800; }
.hec-body small {
  display: block;
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: #4a5876;
}
.hec-cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 13px;
  font-weight: 800;
  color: #00756f;
}

/* ── Add another property ──────────────────────────────────────────── */
.apr {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  text-align: left;
  background: #fff;
  border: 1px dashed #cfd8e3;
  border-radius: 20px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.apr:hover { border-color: #9fe0d8; background: #fbfffe; }
.apr-ic { width: 38px; height: 38px; object-fit: contain; flex-shrink: 0; }
.apr-body { flex: 1; min-width: 0; }
.apr-body strong { display: block; font-size: 14.5px; font-weight: 800; }
.apr-body small {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  color: #6b7089;
}
.apr-chev { color: #c3c6d2; font-size: 17px; flex-shrink: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .dsh-grid { grid-template-columns: minmax(0, 1fr); }
  .dsh-side { position: static; }
}
@media (max-width: 720px) {
  .dsh-shell { padding: 22px 16px 48px; }
  .dsh-title { font-size: 25px; }
  .dsh-head { align-items: flex-start; }
  .dsh-head-side { width: 100%; flex-wrap: wrap; }
  .dsh-search { flex-direction: column; align-items: stretch; padding: 12px; }
  .dsh-search-btn { justify-content: center; }
  .apc { flex-direction: column; gap: 18px; }
  .apc-book { width: 96px; }
}
</style>
