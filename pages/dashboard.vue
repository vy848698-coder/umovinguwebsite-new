<template>
  <div class="dsh">
    <!-- Navbar actions. Both are signed-in essentials this dashboard has no
         other route to: notifications had no entry point anywhere in the app
         despite the backend serving them, and the profile was only reachable
         from the mobile menu. Neither duplicates anything already on the
         page (Claim a property lives in the page head). -->
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
      <!-- ── Hero ─────────────────────────────────────────────────────
           The first thing a signed-in user sees, so it carries the weight:
           who they are, where their record stands, and the one search that
           starts everything. Navy card on the flat shell, matching the
           property page's hero so the two read as one product. -->
      <section class="dsh-hero">
        <div class="dsh-hero-top">
          <div class="dsh-hero-text">
            <p class="dsh-greeting">
              <span class="dsh-greeting-dot" />
              {{ greeting }}
            </p>
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
            <!-- Goes to /claim, so it is labelled for what it does: this is
                 the claim flow, not a generic "add a listing". -->
            <button class="dsh-add" type="button" @click="startClaimFlow">
              <img src="/dashboard-art/addProperty.png" alt="" class="dsh-add-ic" loading="lazy" />
              Claim a property
            </button>
          </div>
        </div>

        <div class="dsh-search">
          <div class="dsh-search-field">
            <PropertySearchInput
              ref="searchInputEl"
              placeholder="Search any UK address or postcode"
              variant="dark"
              :initial-query="initialSearchQuery"
              enter-commits
              @select="onSearchSelect"
              @enter="onSearchEnter"
            />
          </div>
          <button class="dsh-search-btn" type="button" @click="runSearch">
            <Icon name="i-lucide-search" />
            Search
          </button>
        </div>

        <!-- Only figures we actually hold — see heroStats. Nothing renders
             until the fetch behind it has landed, so no flash of zeroes. -->
        <div v-if="heroStats.length && !searchMode" class="dsh-stats">
          <component
            :is="stat.to ? 'button' : 'div'"
            v-for="stat in heroStats"
            :key="stat.key"
            :type="stat.to ? 'button' : undefined"
            class="dsh-stat"
            :class="{ 'dsh-stat--link': stat.to }"
            @click="stat.to ? navigateTo(stat.to) : undefined"
          >
            <span class="dsh-stat-label">{{ stat.label }}</span>
            <span class="dsh-stat-value">{{ stat.value }}</span>
            <span class="dsh-stat-sub">{{ stat.sub }}</span>
          </component>
        </div>
      </section>

      <!-- ── Loading skeleton until the role is known, so the page never
              flashes the wrong role's content ─────────────────────────── -->
      <!-- ── In-place search mode ─────────────────────────────────────
           Committing a search (Enter / Search) swaps every dashboard
           section below the hero for the results, the way the reference
           app does; picking a suggestion still opens that property. -->
      <DashboardSearchResults
        v-if="searchMode"
        :query="activeSearchQuery"
        :saved-ids="savedPropertyIds"
        :watched-ids="watchedPropertyIds"
        @close="exitSearch"
      />

      <div v-else-if="!roleResolved" class="dsh-boot">
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
                <img src="/dashboard-art/sectionPassport.png" alt="" class="dsh-sec-ic" loading="lazy" />
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

            <!-- ── Legislation & news (landlord + seller) ──────────
                 Ported from the reference app. Landlords get the rental
                 dataset (utils/landlordNews.ts), sellers the sales one
                 (utils/sellerNews.ts) — the same files /profile/news reads,
                 so the teaser and the full list never drift apart. -->
            <section v-if="showNewsRail && dashNewsItems.length" class="dsh-section">
              <div class="dsh-sec-head">
                <img src="/dashboard-art/nextDocuments.png" alt="" class="dsh-sec-ic" loading="lazy" />
                <div>
                  <p class="dsh-eyebrow">Legislation &amp; news</p>
                  <h2 class="dsh-sec-title">{{ isLandlord ? "What's changing for landlords" : "What's changing for sellers" }}</h2>
                </div>
              </div>

              <div class="dsh-news-wrap">
                <div class="dsh-news">
                <a
                  v-for="n in dashNewsItems"
                  :key="n.url"
                  class="dsh-news-card"
                  :href="n.url"
                  target="_blank"
                  rel="noopener"
                >
                  <span class="dsh-news-band" :class="`dsh-news-band--${n.tag}`" />
                  <span class="dsh-news-bd">
                    <span class="dsh-news-tag" :class="`dsh-news-tag--${n.tag}`">{{ n.tagLabel }}</span>
                    <strong class="dsh-news-t">{{ n.title }}</strong>
                    <small class="dsh-news-s">{{ n.summary }}</small>
                    <small class="dsh-news-src">
                      {{ n.source }}
                      <Icon name="i-lucide-external-link" />
                    </small>
                  </span>
                  </a>
                </div>
              </div>

              <NuxtLink to="/profile/news" class="dsh-news-all">
                See all updates
                <Icon name="i-lucide-arrow-right" />
              </NuxtLink>
            </section>

            <!-- ── Next for you ── -->
            <section v-if="nextActions.length" class="dsh-section">
              <div class="dsh-sec-head">
                <img src="/dashboard-art/nextDocuments.png" alt="" class="dsh-sec-ic" loading="lazy" />
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
            <!-- Owner HomeScore. Shown for every owner with a passport, scored
                 or not: an owner without a score yet is exactly who needs the
                 route into HomeScore, so the ring reads "–" and says so rather
                 than the whole card vanishing. -->
            <section v-if="!isBuyerView && passports.length" class="hsc">
              <div class="hsc-head">
                <div class="hsc-info">
                  <h3 class="hsc-title">Your home today</h3>
                  <p class="hsc-sub">
                    How your home performs on energy, running costs and value.
                  </p>
                </div>
                <img src="/dashboard-art/homeScoreCard.png" alt="" class="hsc-house-img" loading="lazy" />
              </div>
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
                    <span class="hsc-ring-num">{{ primaryPassport.homeScore ?? '–' }}</span>
                    <span class="hsc-ring-den">/100</span>
                  </div>
                </div>
                <div class="hsc-status">
                  <template v-if="primaryPassport.homeScore == null">
                    <strong>No score yet</strong>
                    <small>Open HomeScore to see how your home performs.</small>
                  </template>
                  <template v-else-if="primaryPassport.homeScorePotential != null">
                    <small>Potential score</small>
                    <strong class="hsc-status-accent">{{ primaryPassport.homeScorePotential }}/100</strong>
                  </template>
                  <template v-else>
                    <small>Current score</small>
                    <strong>{{ primaryPassport.homeScore }}/100</strong>
                  </template>
                </div>
              </div>
              <button class="hsc-cta" type="button" @click="navigateTo(homeScoreHref)">
                See my HomeScore
                <Icon name="i-lucide-arrow-right" />
              </button>
            </section>

            <!-- Watching -->
            <section class="dsh-card">
              <div class="dsh-card-head">
                <img src="/dashboard-art/sectionWatching.png" alt="" class="dsh-card-ic" loading="lazy" />
                <div class="dsh-card-head-text">
                  <h3>
                    Watching
                    <span v-if="watchedProperties.length" class="dsh-count">
                      {{ watchedProperties.length }}
                    </span>
                  </h3>
                  <small>Homes you asked to be kept posted about</small>
                </div>
              </div>

              <div v-if="loadingWatched" class="dsh-skel dsh-skel--row" />

              <template v-else-if="watchedProperties.length">
                <NuxtLink
                  v-for="(prop, i) in watchedProperties.slice(0, 3)"
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
                  <!-- The reference app's "Updates" affordance. It opens the
                       same property page as the row itself, so it is a pill
                       inside the link rather than a nested (invalid) button. -->
                  <span class="watch-updates">
                    <Icon name="i-lucide-bell" />
                    Updates
                  </span>
                </NuxtLink>
                <button
                  type="button"
                  class="dsh-card-more"
                  @click="navigateTo('/profile/watched-properties')"
                >
                  <template v-if="watchedProperties.length > 3">
                    {{ watchedProperties.length - 3 }} more
                    {{ watchedProperties.length - 3 === 1 ? 'property' : 'properties' }} watching
                  </template>
                  <template v-else>View all watched properties</template>
                </button>
              </template>

              <button
                v-else
                type="button"
                class="dsh-emptyrow"
                @click="navigateTo('/marketplace')"
              >
                <span class="dsh-emptyrow-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <span class="dsh-emptyrow-bd">
                  <strong>Nothing watched yet</strong>
                  <small>Explore properties and watch the ones you like.</small>
                </span>
                <Icon name="i-lucide-chevron-right" class="dsh-emptyrow-chev" />
              </button>

              <!-- Saved is a separate list from Watching (heart/save toggle vs
                   the "Watch this" notify flow), so it gets its own honest row
                   rather than being counted as watching. -->
              <NuxtLink
                v-if="!loadingSaved && savedProperties.length"
                to="/profile/saved-properties"
                class="dsh-card-more dsh-card-more--link"
              >
                {{ savedProperties.length }} saved
                {{ savedProperties.length === 1 ? 'property' : 'properties' }}
              </NuxtLink>
            </section>

            <!-- Run a HomeScore on any property -->
            <button class="hec" type="button" @click="navigateTo('/homescore')">
              <!-- Sample gauge, matching the reference app: the 82 and its
                   arc are a fixed illustrative figure, not a live score —
                   this card is about running a HomeScore on any home, so
                   there is no real value to bind here. -->
              <span class="hec-gauge" aria-hidden="true">
                <svg viewBox="0 0 100 100" class="hec-gauge-svg">
                  <defs>
                    <linearGradient id="dshHecGrad" x1="1" y1="0" x2="0" y2="0">
                      <stop offset="0%" stop-color="#00bb93" />
                      <stop offset="100%" stop-color="#016f84" />
                    </linearGradient>
                  </defs>
                  <circle class="hec-gauge-bg" cx="50" cy="50" r="44" />
                  <circle class="hec-gauge-fill" cx="50" cy="50" r="44" />
                </svg>
                <span class="hec-gauge-num">82</span>
              </span>
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
              <img
                src="/dashboard-art/searchHouse.png"
                alt=""
                class="hec-house"
                loading="lazy"
              />
            </button>

            <!-- 'both' role: compact buyer-side summary alongside the owner view -->
            <section v-if="role === 'both'" class="dsh-card">
              <div class="dsh-card-head">
                <img src="/dashboard-art/passportBuyer.png" alt="" class="dsh-card-ic" loading="lazy" />
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
                <!-- Second row, matching the reference app: a 'both' user's
                     buyer side is their Passport AND what they are watching. -->
                <button
                  type="button"
                  class="watch-row watch-row--plain"
                  @click="navigateTo('/profile/watched-properties')"
                >
                  <span class="watch-body">
                    <strong>Watching</strong>
                    <small>
                      {{
                        watchedProperties.length
                          ? `${watchedProperties.length} propert${watchedProperties.length === 1 ? 'y' : 'ies'} watched`
                          : 'Nothing watched yet'
                      }}
                    </small>
                  </span>
                  <Icon name="i-lucide-chevron-right" class="watch-chev" />
                </button>
              </template>
            </section>

            <!-- Add another property -->
            <button v-if="!isBuyerView" class="apr" type="button" @click="startClaimFlow">
              <img src="/dashboard-art/addProperty.png" alt="" class="apr-ic" loading="lazy" />
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
import DashboardSearchResults from '~/components/property/DashboardSearchResults.vue'
import PropertySearchFiltersModal from '~/components/property/PropertySearchFiltersModal.vue'
import ForYouFeed from '~/components/property/ForYouFeed.vue'
import RecentlyViewedFeed from '~/components/property/RecentlyViewedFeed.vue'
import { usePropertyForYou } from '~/composables/usePropertyForYou'
import { NEWS_ITEMS } from '~/utils/landlordNews'
import { SELLER_NEWS_ITEMS } from '~/utils/sellerNews'

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
// The real watch list — PropertyWatch rows from GET /property/watches, which
// is what the property page's "Watch this" flow creates. Distinct from
// savedProperties (the heart/save toggle, GET /property/saved): this page
// used to render the saved list under a "Watching" heading, so a watched
// property never appeared here at all and the count was the wrong one.
const watchedProperties = ref<any[]>([])
const loadingWatched = ref(true)
// The 'both' role shows a buyer summary beside the owner view. It reuses
// buyerProfile/savedProperties, which the owner branch never populates
// otherwise, so it needs its own flag — loadingBuyerProfile/loadingSaved
// default to true and are only flipped by the pure-buyer branch.
const loadingBuyerSummary = ref(true)

const recentlyViewed = ref<any[]>([])
const loadingRecentlyViewed = ref(true)

const route = useRoute()
const searchInputEl = ref<{
  clearQuery: () => void
  closeDropdown: () => void
  focus: () => void
  getQuery: () => string
} | null>(null)
const initialSearchQuery = typeof route.query.q === 'string' ? route.query.q.trim() : ''
const activeSearchQuery = ref(initialSearchQuery)
const searchMode = computed(() => activeSearchQuery.value !== '')
const savedPropertyIds = computed(() => savedProperties.value.map((p: any) => p.id))
const watchedPropertyIds = computed(() =>
  watchedProperties.value.map((p: any) => p.propertyId ?? p.id),
)

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
  if (role.value === 'landlord') return '/dashboard-art/passportLandlord.png'
  if (role.value === 'buy') return '/dashboard-art/passportBuyer.png'
  return '/dashboard-art/passportSeller.png'
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

const emptyPassportTitle = computed(() => {
  if (isBuyerView.value) return 'Start your Buyer Passport'
  if (isLandlord.value) return 'Start your Rental Passport'
  return 'Start your Property Passport'
})
const emptyPassportSub = computed(() => {
  if (isBuyerView.value) return 'Verify your identity and buying position.'
  if (isLandlord.value)
    return 'Verify ownership, then add compliance documents your tenants can see.'
  return 'Verify ownership and build your record.'
})

// The primary card is what the page is "about" for this role, so the
// section skeleton keys off whichever fetch actually feeds it.
const loadingPrimary = computed(() =>
  isBuyerView.value ? loadingBuyerProfile.value : loadingPassport.value,
)

// ── Greeting ───────────────────────────────────────────────────────────
// Deterministic, never Math.random(): this page server-renders then
// hydrates, and a random pick would differ between the two and trip a
// hydration mismatch.
// Five dayparts, matching the reference app — it had an "early morning"
// band and light rotation on the daytime lines, where this page only
// rotated late-night and used one fixed phrase for the rest.
//
// No emoji, deliberately: the reference appends 👋/🌙/☀️ here, but this
// project's standard is Lucide icons over emoji.
type Daypart = 'lateNight' | 'earlyMorning' | 'morning' | 'afternoon' | 'evening'

function daypartOf(hour: number): Daypart {
  if (hour >= 23 || hour < 5) return 'lateNight'
  if (hour < 8) return 'earlyMorning'
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

const GREETING_LINES: Record<Daypart, string[]> = {
  lateNight: ['Having a late one', 'Burning the midnight oil', 'Still up'],
  earlyMorning: ['Up bright and early', 'Early start', 'Rise and shine'],
  morning: ['Good morning', 'Morning'],
  afternoon: ['Good afternoon', 'Afternoon'],
  evening: ['Good evening', 'Evening'],
}
// The two off-hours bands read as a warm question ("Still up, Alex?"); the
// three daytime ones stay a plain statement.
const GREETING_IS_QUESTION: Record<Daypart, boolean> = {
  lateNight: true,
  earlyMorning: true,
  morning: false,
  afternoon: false,
  evening: false,
}

const greeting = computed(() => {
  const now = new Date()
  const daypart = daypartOf(now.getHours())
  const lines = GREETING_LINES[daypart]
  // Date-indexed, not random — see the note above about hydration.
  const line = lines[now.getDate() % lines.length]
  const first = profile.value?.firstName?.trim()
  const emailLocal = profile.value?.email?.split('@')[0]?.trim()
  const name = first || emailLocal || ''

  if (GREETING_IS_QUESTION[daypart]) {
    return name ? `${line}, ${name}?` : `${line}?`
  }
  return name ? `${line}, ${name}` : line
})

// Legislation & news rail — landlords and sellers, matching the reference
// app. 'both' users are buyers too, so they keep the buyer-side card instead.
const showNewsRail = computed(() => isLandlord.value || role.value === 'sell')
const dashNewsItems = computed(() =>
  (role.value === 'sell' ? SELLER_NEWS_ITEMS : NEWS_ITEMS).slice(0, 5),
)

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

// ── Hero stat tiles ────────────────────────────────────────────────────
// Only figures that come from a real fetch, and only once that fetch has
// landed — an unloaded stat renders nothing rather than a placeholder 0,
// which would be a fabricated number on the first screen after login.
const heroStats = computed(() => {
  const out: {
    key: string
    label: string
    value: string
    sub: string
    to?: string
  }[] = []

  if (isBuyerView.value) {
    if (!loadingBuyerProfile.value && buyerProfile.value) {
      out.push({
        key: 'finance',
        label: 'Buying position',
        value: `${financePercent.value}%`,
        sub: 'confirmed',
        to: '/buyer-profile/build',
      })
      if (buyerIncompleteCount.value > 0) {
        out.push({
          key: 'items',
          label: 'To complete',
          value: String(buyerIncompleteCount.value),
          sub: buyerIncompleteCount.value === 1 ? 'item left' : 'items left',
          to: '/buyer-profile/build',
        })
      }
    }
  } else if (!loadingPassport.value && passports.value.length) {
    out.push({
      key: 'passport',
      label: 'Passport',
      value: `${primaryPassport.value.completionPercentage ?? 0}%`,
      sub: 'complete',
      to: `/passportview/${primaryPassport.value.id}`,
    })
    if (primaryPassport.value.homeScore != null) {
      out.push({
        key: 'score',
        label: 'HomeScore',
        value: String(primaryPassport.value.homeScore),
        sub: 'out of 100',
        to: homeScoreHref.value,
      })
    }
    if (incompleteItemCount.value > 0) {
      out.push({
        key: 'items',
        label: 'To complete',
        value: String(incompleteItemCount.value),
        sub: incompleteItemCount.value === 1 ? 'item left' : 'items left',
        to: `/passportview/${primaryPassport.value.id}`,
      })
    }
  }

  if (!loadingWatched.value && watchedProperties.value.length) {
    out.push({
      key: 'watching',
      label: 'Watching',
      value: String(watchedProperties.value.length),
      sub: watchedProperties.value.length === 1 ? 'property' : 'properties',
      to: '/profile/watched-properties',
    })
  }

  return out
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
        icon: '/dashboard-art/nextDocuments.png',
        to: '/buyer-profile/build',
      })
    }
    if (!buyerIdVerified.value) {
      rows.push({
        title: 'Verify your identity',
        sub: 'A verified ID is what sellers and agents check first.',
        icon: '/dashboard-art/nextIdentity.png',
        to: '/buyer-profile/build',
      })
    }
    if (financePercent.value < 100) {
      rows.push({
        title: 'Upload proof of funds or AIP',
        sub: 'Strengthen your position and unlock more.',
        icon: '/dashboard-art/nextFunds.png',
        to: '/buyer-profile/build',
      })
    }
    rows.push({
      title: 'Confirm your buying position',
      sub: 'Let agents and sellers know where you are in the chain.',
      icon: '/dashboard-art/nextPosition.png',
      to: '/buyer-profile/build',
    })
    return rows
  }

  if (!passports.value.length) return rows

  if (incompleteItemCount.value > 0) {
    rows.push({
      title: `Complete ${incompleteItemCount.value} ${incompleteItemCount.value === 1 ? 'item' : 'items'} in your Passport`,
      sub: 'Add documents and details to build your record.',
      icon: '/dashboard-art/nextDocuments.png',
      to: `/passportview/${primaryPassport.value.id}`,
    })
  }

  if (isLandlord.value) {
    rows.push({
      title: 'Keep your compliance documents current',
      sub: 'Gas, electrical and EPC certificates your tenants can see.',
      icon: '/dashboard-art/nextDocuments.png',
      to: `/passportview/landlord/${primaryPassport.value.id}`,
    })
  }

  rows.push({
    title: 'Improve your EPC',
    sub: 'See how you could raise your score and cut running costs.',
    icon: '/dashboard-art/nextEpc.png',
    to: homeScoreHref.value,
  })

  return rows
})

// ── Search ─────────────────────────────────────────────────────────────
// Picking a suggestion opens that property; Enter or the Search button
// commits the query and the page switches into search mode in place.
// ?q= mirrors the active query so a refresh or a shared link comes back to
// the same results, and ?focusSearch=1 lands with the cursor in the field.
function onSearchSelect(property: { id: string | null; postcode?: string }) {
  if (property?.id) navigateTo(`/property/${property.id}`)
  else if (property?.postcode) commitSearch(property.postcode)
}
function onSearchEnter(q: string) {
  commitSearch(q)
}
function runSearch() {
  const q = searchInputEl.value?.getQuery() ?? ''
  if (q) commitSearch(q)
  else searchInputEl.value?.focus()
}
function commitSearch(raw: string) {
  const q = raw.trim()
  if (!q) return
  searchInputEl.value?.closeDropdown()
  activeSearchQuery.value = q
  navigateTo({ path: route.path, query: { ...route.query, q, focusSearch: undefined } }, { replace: true })
}
function exitSearch() {
  activeSearchQuery.value = ''
  searchInputEl.value?.clearQuery()
  navigateTo({ path: route.path, query: { ...route.query, q: undefined } }, { replace: true })
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
  const [buyerResult, savedResult, watchedResult] = await Promise.allSettled([
    $fetch<any>(`${config.public.apiBase}/buyer-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<any[]>(`${config.public.apiBase}/property/saved`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    $fetch<any[]>(`${config.public.apiBase}/property/watches`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])
  if (buyerResult.status === 'fulfilled') buyerProfile.value = buyerResult.value ?? null
  if (savedResult.status === 'fulfilled') savedProperties.value = savedResult.value ?? []
  if (watchedResult.status === 'fulfilled') watchedProperties.value = watchedResult.value ?? []
  loadingWatched.value = false
}

onMounted(async () => {
  if (route.query.focusSearch && !searchMode.value) searchInputEl.value?.focus()
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
/* ── Tokens ────────────────────────────────────────────────────────────
   One scale for the whole page. Before this, every card invented its own
   radius, border and shadow, so nothing read as part of the same system. */
.dsh {
  --ink: #1a1535;
  --ink-2: #4a5268;
  --ink-3: #8a90a6;
  --brand: #00a19a;
  --brand-deep: #00756f;
  --brand-wash: #eafaf8;
  --line: #e7eaf1;
  --surface: #fff;
  --shell: #f3f2ef;

  --r-sm: 14px;
  --r-md: 18px;
  --r-lg: 24px;
  --r-xl: 30px;

  /* Layered and low-spread: depth without the page looking heavy. */
  --sh-sm: 0 1px 2px rgba(26, 21, 53, 0.04), 0 2px 6px rgba(26, 21, 53, 0.04);
  --sh-md: 0 1px 2px rgba(26, 21, 53, 0.04), 0 10px 24px rgba(26, 21, 53, 0.07);
  --sh-lg: 0 2px 4px rgba(26, 21, 53, 0.04), 0 20px 44px rgba(26, 21, 53, 0.1);

  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--shell);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  color: var(--ink);
}

.dsh-shell {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 26px 24px 72px;
}

/* ── Navbar actions ────────────────────────────────────────────────── */
/* The bell ships as a bare transparent circle; against the cream navbar it
   needs the same bordered-chip treatment as the profile pill beside it, or
   the two read as unrelated. :deep() because .nb-btn is scoped to the
   NotificationBell component. */
.dsh :deep(.nb-btn) {
  width: 40px;
  height: 40px;
  /* Rounded square, not a circle: WebTopNav's own controls (nav links 10px,
     the menu toggle 40x40 at 12px) set this radius for the whole bar. */
  border-radius: 12px;
  border: 1px solid #00a19a;
  background: #00a19a;
  color: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsh :deep(.nb-btn svg) { color: #fff; }
.dsh :deep(.nb-btn:hover) {
  background: #018e88;
  border-color: #018e88;
  box-shadow: 0 6px 16px rgba(0, 161, 154, 0.3);
}
/* The unread dot is red on teal; a ring in the button colour keeps the two
   from bleeding into each other. */
.dsh :deep(.nb-badge) {
  box-shadow: 0 0 0 2px #00a19a;
}
.dsh :deep(.nb-btn:hover .nb-badge) {
  box-shadow: 0 0 0 2px #018e88;
}

/* Same 40px height and 12px radius as the bell beside it and WebTopNav's own
   controls, so the actions read as one set rather than a pill next to a
   square. */
.dsh-nav-profile {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 40px;
  padding: 0 13px 0 5px;
  border-radius: 12px;
  border: 1px solid #00a19a;
  background: #00a19a;
  text-decoration: none;
  color: #fff;
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.dsh-nav-profile:hover {
  background: #018e88;
  border-color: #018e88;
  box-shadow: 0 6px 16px rgba(0, 161, 154, 0.3);
}
/* UserAvatar sets its colours inline: a teal gradient with white initials,
   which would sink into the teal button. Flipped to a white tile with teal
   initials so it reads as a badge on the button. !important because those
   inline styles win over a plain rule. The 8px radius follows the
   container's curve (12px outer minus the 5px inset) rather than the
   component's default circle. */
.dsh-nav-profile > :first-child {
  border-radius: 8px !important;
  background: #fff !important;
  color: #00857f !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
}
.dsh-nav-profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.dsh-nav-profile-text strong {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
}
.dsh-nav-profile-text small {
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.88);
}

/* ── Hero ──────────────────────────────────────────────────────────────
   Navy card, matching the property page's hero, so the two pages read as
   one product. Greeting, identity, the search that starts everything, and
   the live figures — all above the fold. */
.dsh-hero {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-xl);
  padding: 34px 36px 30px;
  margin-bottom: 34px;
  color: #fff;
  background:
    radial-gradient(120% 150% at 92% 0%, rgba(0, 182, 174, 0.3) 0%, rgba(0, 182, 174, 0) 48%),
    linear-gradient(135deg, #241d4d 0%, #1c1a3e 48%, #141a37 100%);
  box-shadow: var(--sh-lg);
}
.dsh-hero-top {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}
.dsh-hero-text { min-width: 0; flex: 1 1 420px; }
.dsh-greeting {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #7ef0e4;
}
.dsh-greeting-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2fd0c6;
  box-shadow: 0 0 0 3px rgba(47, 208, 198, 0.18);
}
.dsh-title {
  margin: 0 0 10px;
  font-size: clamp(28px, 2.9vw, 40px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.06;
  color: #fff;
}
.dsh-lede {
  margin: 0;
  max-width: 54ch;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.62);
}
.dsh-head-side {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.dsh-role-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px 7px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
}
.dsh-role-art { width: 30px; height: 30px; object-fit: contain; }
.dsh-role-chip span { display: flex; flex-direction: column; line-height: 1.2; }
.dsh-role-chip small {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.dsh-role-chip strong { font-size: 13px; font-weight: 800; color: #fff; }
.dsh-add {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px 12px 12px;
  border: none;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.34);
  transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
}
.dsh-add:hover {
  transform: translateY(-1px);
  background: #00b3ab;
  box-shadow: 0 14px 30px rgba(0, 161, 154, 0.44);
}
.dsh-add-ic { width: 28px; height: 28px; object-fit: contain; }

/* Search — the widest affordance in the hero, because it is the one
   action every role starts with. */
.dsh-search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(6px);
}
.dsh-search-field { flex: 1; min-width: 0; }
/* The dark variant already colours the field for a navy surface; it only
   needs its pill flattened so the wrapper above is the visible chrome. */
.dsh-search :deep(.psi-input) {
  background: transparent;
  border-color: transparent;
  font-size: 15px;
  height: 46px;
}
.dsh-search :deep(.psi-input:focus) {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.dsh-search-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 13px 26px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #141a37;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.dsh-search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.22);
}
.dsh-search-btn svg { width: 17px; height: 17px; }

/* Stat row — real figures only, so this is often 1-3 tiles, never a grid
   of placeholder zeroes. */
.dsh-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.dsh-stat {
  flex: 1 1 150px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 15px 18px;
  text-align: left;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.11);
  font-family: inherit;
  color: inherit;
}
.dsh-stat--link { cursor: pointer; transition: background 0.16s ease, border-color 0.16s ease, transform 0.16s ease; }
.dsh-stat--link:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(127, 240, 228, 0.4);
}
.dsh-stat-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.dsh-stat-value {
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #fff;
  font-feature-settings: 'tnum';
}
.dsh-stat-sub {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
}

/* ── Layout ───────────────────────────────────────────────────────── */
.dsh-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 30px;
  align-items: start;
}
.dsh-main { min-width: 0; }
.dsh-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: sticky;
  top: 20px;
}

.dsh-section { margin-bottom: 38px; }
.dsh-section:last-child { margin-bottom: 0; }

/* Section header: art, accent-dashed eyebrow, then the title. The dash
   ties these back to the property page's section headers. */
.dsh-sec-head {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 18px;
}
.dsh-sec-ic {
  width: 50px;
  height: 50px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 6px 12px rgba(26, 21, 53, 0.12));
}
.dsh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 5px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand);
}
.dsh-eyebrow::before {
  content: '';
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: var(--brand);
}
.dsh-sec-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

/* ── Active passport card ──────────────────────────────────────────────
   The anchor of the page. Given a tinted panel behind the book so the
   passport art reads as an object on a shelf rather than a clipart pasted
   on white, and the book itself is half again as large. */
.apc {
  position: relative;
  display: flex;
  gap: 30px;
  padding: 0;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  cursor: pointer;
  box-shadow: var(--sh-md);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.apc:hover {
  transform: translateY(-3px);
  border-color: #c8e3df;
  box-shadow: var(--sh-lg);
}
.apc:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }
.apc-book {
  flex-shrink: 0;
  width: 196px;
  display: grid;
  /* align only — NOT place-items. PassportCard sizes itself from its
     parent's width (.passport-container is width:100% + aspect-ratio), so
     justify-items:center collapsed it to max-content and the book vanished.
     The default justify-items:stretch is what gives it a width to measure. */
  align-items: center;
  padding: 28px 22px;
  background:
    radial-gradient(120% 120% at 30% 20%, rgba(0, 182, 174, 0.16) 0%, rgba(0, 182, 174, 0) 62%),
    linear-gradient(160deg, #f4f8fb 0%, #eef4f3 100%);
  border-right: 1px solid var(--line);
}
/* The component ships a 32px vertical margin for its standalone uses; the
   panel here supplies its own padding. */
.apc-book :deep(.passport-card) { margin: 0; width: 100%; }
.apc-book :deep(img),
.apc-book :deep(svg) {
  filter: drop-shadow(0 14px 26px rgba(26, 21, 53, 0.22));
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.apc:hover .apc-book :deep(img),
.apc:hover .apc-book :deep(svg) { transform: translateY(-4px) scale(1.03); }
.apc-info {
  flex: 1;
  min-width: 0;
  padding: 26px 28px 26px 0;
}
.apc-pill {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--brand-wash);
  color: var(--brand-deep);
  border: 1px solid #d3f0ec;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.apc-name {
  margin: 12px 0 2px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
}
.apc-postcode {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-3);
}
.apc-verified, .apc-unverified {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
}
.apc-verified {
  color: var(--brand-deep);
  background: var(--brand-wash);
  border: 1px solid #d3f0ec;
}
.apc-unverified {
  color: #a4711a;
  background: #fdf4e3;
  border: 1px solid #f3ddb0;
}
.apc-verified svg, .apc-unverified svg { width: 15px; height: 15px; }
.apc-prog-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 20px 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
}
.apc-prog-row strong {
  color: var(--ink);
  font-weight: 800;
  font-size: 15px;
  font-feature-settings: 'tnum';
}
.apc-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 999px;
  background: var(--brand-wash);
  font-size: 11.5px;
  font-weight: 800;
  color: var(--brand-deep);
}
.apc-live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.16);
}
.apc-track {
  height: 9px;
  border-radius: 999px;
  background: #edf0f5;
  overflow: hidden;
}
.apc-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2fd0c6, #00a19a);
  box-shadow: 0 0 10px rgba(0, 161, 154, 0.4);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.apc-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.apc-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(135deg, #00a19a, #007d77);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.3);
  transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
}
.apc-cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
  box-shadow: 0 14px 28px rgba(0, 161, 154, 0.4);
}
.apc-cta svg { width: 16px; height: 16px; }
.apc-link {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--brand);
  cursor: pointer;
}
.apc-link:hover { color: var(--brand-deep); }

/* ── Empty CTA ─────────────────────────────────────────────────────── */
/* A first-run user sees this instead of a passport, so it has to look
   like an invitation, not a gap where a card failed to load. */
.dsh-empty-cta {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 30px 28px;
  overflow: hidden;
  text-align: left;
  background:
    radial-gradient(110% 150% at 0% 0%, rgba(0, 182, 174, 0.08) 0%, rgba(0, 182, 174, 0) 58%),
    var(--surface);
  border: 1.5px dashed #c6d4e0;
  border-radius: var(--r-lg);
  font-family: inherit;
  cursor: pointer;
  box-shadow: var(--sh-sm);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.dsh-empty-cta:hover {
  transform: translateY(-2px);
  border-color: var(--brand);
  box-shadow: var(--sh-md);
}
.dsh-empty-plus {
  width: 58px; height: 58px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(135deg, #00a19a, #007d77);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.3);
}
.dsh-empty-body { flex: 1; min-width: 0; }
.dsh-empty-body strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.dsh-empty-body small {
  display: block;
  margin-top: 4px;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.55;
  color: var(--ink-2);
}
.dsh-empty-chev { width: 22px; height: 22px; color: #b3b7c6; flex-shrink: 0; }
.dsh-empty-cta:hover .dsh-empty-chev { color: var(--brand); }

/* ── Next for you ───────────────────────────────────────────────────────
   A checklist, so it reads as progress rather than a list of links: each
   row gets a numbered marker and the art sits on a tinted tile. */
.nfy {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--sh-md);
}
.nfy-stale {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  padding: 13px 22px;
  background: linear-gradient(90deg, #fff8ed, #fffdf8);
  border-bottom: 1px solid #fbe4bd;
  font-size: 12.5px;
  font-weight: 700;
  color: #92400e;
}
.nfy-stale svg { width: 15px; height: 15px; flex-shrink: 0; }
.nfy-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px 22px;
  text-align: left;
  background: none;
  border: none;
  border-top: 1px solid #f0f2f6;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.16s ease, padding-left 0.16s ease;
}
.nfy-row:first-of-type { border-top: none; }
.nfy-row:hover { background: #fbfdfd; padding-left: 26px; }
/* Teal rail that grows in on hover — a cheap, quiet affordance. */
.nfy-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--brand);
  transform: scaleY(0);
  transition: transform 0.18s ease;
}
.nfy-row:hover::before { transform: scaleY(1); }
.nfy-ic {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
  padding: 5px;
  border-radius: 13px;
  background: linear-gradient(160deg, #f4f8fb, #eef4f3);
}
.nfy-body { flex: 1; min-width: 0; }
.nfy-body strong {
  display: block;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.012em;
}
.nfy-body small {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink-2);
}
.nfy-chev {
  width: 20px;
  height: 20px;
  color: #c3c6d2;
  flex-shrink: 0;
  transition: color 0.16s ease, transform 0.16s ease;
}
.nfy-row:hover .nfy-chev { color: var(--brand); transform: translateX(3px); }

/* ── Side cards ────────────────────────────────────────────────────── */
.dsh-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--sh-md);
}
.dsh-card-head {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f2f6;
  background: linear-gradient(180deg, #fcfdfe, #fff);
}
.dsh-card-ic {
  width: 40px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 5px 10px rgba(26, 21, 53, 0.12));
}
.dsh-card-head-text h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.015em;
}
.dsh-card-head-text small {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink-3);
}
.dsh-count {
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--brand-wash);
  color: var(--brand-deep);
  border: 1px solid #d3f0ec;
  font-size: 11px;
  font-weight: 800;
  font-feature-settings: 'tnum';
}
.dsh-card-more {
  display: block;
  width: 100%;
  padding: 14px;
  background: #fafbfd;
  border: none;
  border-top: 1px solid #f0f2f6;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--brand);
  cursor: pointer;
  transition: background 0.15s ease;
}
.dsh-card-more:hover { background: #f0faf8; }
/* Same strip rendered as an anchor for the Saved row. */
.dsh-card-more--link {
  text-align: center;
  text-decoration: none;
  color: var(--ink-2);
}
.dsh-card-more--link:hover { color: var(--brand); }

/* ── Legislation & news rail (landlord) ───────────────────────────────
   Horizontal scroller: five teaser cards, each a real outbound link to
   its source. */
/* Wrapper exists only to carry the right-hand fade; the scroller itself
   has to keep its own overflow. */
.dsh-news-wrap { position: relative; }
.dsh-news-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 10px;
  width: 56px;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(243, 242, 239, 0), var(--shell));
}
.dsh-news {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(252px, 1fr);
  gap: 14px;
  overflow-x: auto;
  padding: 2px 2px 10px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cfd6e0 transparent;
}
.dsh-news::-webkit-scrollbar { height: 7px; }
.dsh-news::-webkit-scrollbar-track { background: transparent; }
.dsh-news::-webkit-scrollbar-thumb {
  background: #d7dde6;
  border-radius: 999px;
}
.dsh-news::-webkit-scrollbar-thumb:hover { background: #c2cad6; }
.dsh-news-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #eceff5;
  box-shadow: 0 1px 2px rgba(15, 36, 62, 0.04), 0 8px 20px rgba(15, 36, 62, 0.05);
  text-decoration: none;
  scroll-snap-align: start;
  transition: transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
}
.dsh-news-card:hover {
  transform: translateY(-2px);
  border-color: #d6e4f0;
  box-shadow: 0 14px 30px rgba(15, 36, 62, 0.1);
}
.dsh-news-band { height: 4px; width: 100%; background: #cbd5e1; }
.dsh-news-band--law { background: linear-gradient(90deg, #c73e36, #e0796f); }
.dsh-news-band--update { background: linear-gradient(90deg, #00a19a, #4fd1c5); }
.dsh-news-band--news { background: linear-gradient(90deg, #3f7fd0, #7aa9e8); }
.dsh-news-bd {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 15px 16px 16px;
}
.dsh-news-tag {
  align-self: flex-start;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 999px;
}
.dsh-news-tag--law { background: #fbe9ea; color: #a8332b; }
.dsh-news-tag--update { background: #e2f3ec; color: #14735f; }
.dsh-news-tag--news { background: #e9f2fb; color: #2c5f9e; }
.dsh-news-t {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: #231d45;
}
.dsh-news-s {
  font-size: 12.5px;
  line-height: 1.55;
  color: #6b7089;
  /* Summaries vary a lot in length; clamp so the row stays even. */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dsh-news-src {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: auto;
  font-size: 11.5px;
  font-weight: 700;
  color: #9aa7b8;
}
.dsh-news-src svg { width: 12px; height: 12px; }
.dsh-news-all {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 4px;
  font-size: 13.5px;
  font-weight: 700;
  color: #00a19a;
  text-decoration: none;
}
.dsh-news-all:hover { text-decoration: underline; }
.dsh-news-all svg { width: 15px; height: 15px; }
/* Empty state as an actionable row — icon, copy, chevron — rather than a
   centred block with a button, matching the reference app. */
.dsh-emptyrow {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 16px 18px;
  text-align: left;
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}
.dsh-emptyrow:hover { background: #fbfdfd; }
.dsh-emptyrow-ic {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(160deg, #e6f7f4, #d8f0ea);
  color: var(--brand);
}
.dsh-emptyrow-ic svg { width: 19px; height: 19px; }
.dsh-emptyrow-bd { flex: 1; min-width: 0; }
.dsh-emptyrow-bd strong {
  display: block;
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: -0.012em;
  color: var(--ink);
}
.dsh-emptyrow-bd small {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink-2);
}
.dsh-emptyrow-chev {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  color: #c3c6d2;
  transition: color 0.15s ease, transform 0.15s ease;
}
.dsh-emptyrow:hover .dsh-emptyrow-chev {
  color: var(--brand);
  transform: translateX(3px);
}

.watch-row {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  text-decoration: none;
  color: inherit;
  padding: 14px 18px;
  text-align: left;
  background: none;
  border: none;
  border-top: 1px solid #f5f6f9;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}
.watch-row:first-of-type { border-top: none; }
.watch-row:hover { background: #fbfdfd; }
.watch-row--plain { padding: 15px 18px; }
.watch-media {
  width: 62px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #eef4f2;
  box-shadow: 0 3px 10px rgba(26, 21, 53, 0.1);
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
.watch-updates {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  padding: 6px 11px 6px 9px;
  border-radius: 999px;
  background: var(--brand-wash);
  color: var(--brand-deep);
  font-size: 11.5px;
  font-weight: 800;
  transition: background 0.15s ease;
}
.watch-updates svg { width: 13px; height: 13px; }
.watch-row:hover .watch-updates { background: #d6f3ef; }

/* ── HomeScore (owner) ─────────────────────────────────────────────── */
.hsc {
  position: relative;
  overflow: hidden;
  padding: 24px;
  background:
    radial-gradient(110% 130% at 85% 0%, rgba(0, 182, 174, 0.26) 0%, rgba(0, 182, 174, 0) 52%),
    linear-gradient(160deg, #241d4d 0%, #141a37 100%);
  border-radius: var(--r-lg);
  color: #fff;
  box-shadow: var(--sh-lg);
}
.hsc-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.hsc-house-img {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
}
.hsc-top { display: flex; align-items: center; gap: 18px; }
.hsc-status { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.hsc-status small {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.62);
}
.hsc-status strong { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
.hsc-status-accent { color: #5eead4; }
.hsc-ring { position: relative; width: 104px; height: 104px; flex-shrink: 0; }
/* Soft bloom behind the ring so the score reads as lit, not printed. */
.hsc-ring::before {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 182, 174, 0.22), transparent 70%);
}
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
  filter: drop-shadow(0 0 5px rgba(47, 208, 198, 0.5));
  transition: stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.hsc-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  /* wrap makes align-content apply, which centres the baseline-aligned
     number + "/100" pair vertically; without it the pair sat at the top. */
  flex-wrap: wrap;
  align-content: center;
  gap: 1px;
}
.hsc-ring-num {
  font-size: 31px;
  font-weight: 800;
  letter-spacing: -0.03em;
  font-feature-settings: 'tnum';
}
.hsc-ring-den { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.5); }
.hsc-info { flex: 1; min-width: 0; }
.hsc-title {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.hsc-sub {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
}
.hsc-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
  padding: 13px;
  border: none;
  border-radius: 13px;
  background: #fff;
  color: #141a37;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.hsc-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
}

/* ── HomeScore explore entry ───────────────────────────────────────── */
.hec {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 16px 14px;
  text-align: left;
  background:
    radial-gradient(120% 140% at 100% 0%, rgba(0, 182, 174, 0.16) 0%, rgba(0, 182, 174, 0) 58%),
    linear-gradient(160deg, #f2fcf9, #e2f4f0);
  border: 1px solid #cfe9e3;
  border-radius: var(--r-lg);
  font-family: inherit;
  cursor: pointer;
  box-shadow: var(--sh-sm);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.hec:hover {
  transform: translateY(-2px);
  border-color: var(--brand);
  box-shadow: 0 14px 30px rgba(0, 161, 154, 0.18);
}
/* Gauge ring, sized and coloured to the reference app. */
.hec-gauge {
  position: relative;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.hec-gauge-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.hec-gauge-bg {
  fill: none;
  stroke: #d5efe8;
  stroke-width: 10;
}
.hec-gauge-fill {
  fill: none;
  stroke: url(#dshHecGrad);
  stroke-width: 10;
  stroke-linecap: round;
  /* r=44 -> circumference 276.5; 82% leaves 49.8 */
  stroke-dasharray: 276.5;
  stroke-dashoffset: 49.8;
}
.hec-gauge-num {
  position: relative;
  font-size: 13px;
  font-weight: 800;
  color: #016f84;
  font-feature-settings: 'tnum';
}
/* House sits at the right edge, cropped by the card's radius the way the
   reference app's does. */
.hec-house {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  object-fit: contain;
  align-self: center;
  filter: drop-shadow(0 6px 14px rgba(0, 117, 111, 0.2));
}
.hec-body { flex: 1; min-width: 0; }
.hec-body strong {
  display: block;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.012em;
}
.hec-body small {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  color: #6b7089;
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
  gap: 15px;
  padding: 18px 20px;
  text-align: left;
  background: var(--surface);
  border: 1.5px dashed #cfd8e3;
  border-radius: var(--r-lg);
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.apr:hover {
  transform: translateY(-2px);
  border-color: var(--brand);
  box-shadow: var(--sh-md);
}
.apr-ic {
  width: 46px;
  height: 46px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 5px 10px rgba(26, 21, 53, 0.12));
}
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

/* ── Loading skeletons ──────────────────────────────────────────────
   Shown until the role resolves, so the page never flashes the wrong
   role's content. Shimmer rather than a flat block, so a slow API reads
   as loading rather than broken. */
.dsh-skel,
.dsh-boot-card,
.dsh-boot-row {
  position: relative;
  overflow: hidden;
  border-radius: var(--r-lg);
  background: linear-gradient(100deg, #eef1f6 30%, #f7f9fc 48%, #eef1f6 66%);
  background-size: 300% 100%;
  animation: dsh-shimmer 1.5s ease-in-out infinite;
}
@keyframes dsh-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-skel,
  .dsh-boot-card,
  .dsh-boot-row { animation: none; }
}
.dsh-skel--hero { height: 208px; }
.dsh-skel--row { height: 104px; border-radius: 0; }
.dsh-boot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 30px;
  align-items: start;
}
.dsh-boot-card { height: 268px; }
.dsh-boot-rows { display: flex; flex-direction: column; gap: 18px; }
.dsh-boot-row { height: 112px; }
@media (max-width: 1080px) {
  .dsh-boot { grid-template-columns: minmax(0, 1fr); }
}

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .dsh-grid { grid-template-columns: minmax(0, 1fr); }
  .dsh-side { position: static; }
}
@media (max-width: 860px) {
  .dsh-hero { padding: 26px 22px 24px; border-radius: var(--r-lg); }
  .dsh-hero-top { flex-direction: column; gap: 20px; }
  .dsh-head-side { width: 100%; }
  .dsh-add { flex: 1; justify-content: center; }
  /* The book panel becomes a full-width band above the copy. */
  .apc { flex-direction: column; gap: 0; }
  .apc-book {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--line);
    padding: 24px;
  }
  .apc-info { padding: 22px; }
}
@media (max-width: 720px) {
  .dsh-shell { padding: 20px 16px 48px; }
  .dsh-search { flex-direction: column; align-items: stretch; padding: 12px; border-radius: var(--r-lg); }
  .dsh-search-btn { justify-content: center; }
  .dsh-stats { gap: 10px; }
  .dsh-stat { flex: 1 1 100%; }
  .dsh-sec-ic { width: 42px; height: 42px; }
  .dsh-sec-title { font-size: 19px; }
}
</style>
