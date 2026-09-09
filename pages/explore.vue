<template>
  <div class="dsc">
    <!-- Guest-first page, so the nav actions are Sign in / Get started rather
         than the bell + avatar the signed-in dashboard shows. A visitor who
         already has a session still gets their profile pill, since this page
         is reachable from the nav at any time.
         show-profile-mobile is off for guests: the burger panel's Profile row
         would otherwise bounce a signed-out visitor to the sign-in screen,
         which is exactly what this page exists to avoid. -->
    <WebTopNav :show-profile-mobile="signedIn">
      <template #actions>
        <template v-if="signedIn">
          <NuxtLink to="/profile" class="dsc-nav-profile" aria-label="Your profile">
            <UserAvatar
              :src="profile?.avatarUrl"
              :first-name="profile?.firstName"
              :last-name="profile?.lastName"
              :size="30"
            />
            <span class="dsc-nav-profile-text">
              <strong>{{ profile?.firstName || 'Profile' }}</strong>
              <small>Your account</small>
            </span>
          </NuxtLink>
        </template>
        <template v-else>
          <button class="dsc-nav-signin" type="button" @click="navigateTo('/onboarding/signin')">
            Sign in
          </button>
          <button class="dsc-nav-join" type="button" @click="navigateTo('/onboarding/signup')">
            Get started
          </button>
        </template>
      </template>

      <!-- The desktop actions above are hidden at mobile widths, so a guest on
           a phone would otherwise have no way in at all - the burger panel is
           the only nav there. -->
      <template #mobile-extra="{ closeMenu }">
        <template v-if="!signedIn">
          <button
            type="button"
            class="dsc-mobile-auth"
            @click="closeMenu(); navigateTo('/onboarding/signin')"
          >
            Sign in
          </button>
          <button
            type="button"
            class="dsc-mobile-auth dsc-mobile-auth--solid"
            @click="closeMenu(); navigateTo('/onboarding/signup')"
          >
            Get started
          </button>
        </template>
      </template>
    </WebTopNav>

    <!-- ── Hero ──────────────────────────────────────────────────────────
         Deliberately no background of its own. WebTopNav is translucent, so a
         tinted band here bled straight through the bar and made this page's
         navbar look like a different colour to every other page's. Same flat
         #f3f2ef ground as the landing page instead. -->
    <header class="dsc-band">
      <div class="dsc-band-inner">
        <span class="dsc-badge">
          <Icon name="i-lucide-shield-check" class="dsc-badge-ic" />
          No account needed to explore
        </span>
        <h1 class="dsc-title">Explore any UK property<span class="dsc-dot">.</span></h1>
        <p class="dsc-lede">
          Search any UK address to see what we already know — value, history, energy,
          planning, local area, available Property Passport information and more.
        </p>

        <ul class="dsc-sources">
          <li>HM Land Registry</li>
          <li>EPC register</li>
          <li>Sold prices</li>
          <li>Planning records</li>
        </ul>
      </div>
    </header>

    <main class="dsc-shell">
      <!-- ── Search panel ────────────────────────────────────────────────
           A raised console rather than a full-bleed strip: the input, the
           scope control and the action sit on one card with the example
           hint tucked underneath a hairline, so the whole thing reads as a
           single instrument instead of three widgets in a row. -->
      <section class="dsc-search-panel">
        <div class="dsc-search-row">
          <div class="dsc-search-field">
            <Icon name="i-lucide-search" class="dsc-search-lead" />
            <PropertySearchInput
              ref="searchInputEl"
              :initial-query="initialQuery"
              placeholder="Enter a postcode or address"
              variant="light"
              show-passport-status
              postcode-fallback
              @select="onSearchSelect"
              @enter="onSearchEnter"
            />
          </div>

          <!-- Search scope. Exact keeps the query as typed; Nearby widens a
               full postcode to its outward code, so "CV1 3PQ" also returns the
               rest of CV1. Anything that isn't a postcode has no sensible
               "nearby", so the control disables itself rather than silently
               doing nothing. -->
          <div class="dsc-scope" :class="{ 'dsc-scope--off': !scopeAvailable }" role="group" aria-label="Search area">
            <button
              type="button"
              class="dsc-scope-btn"
              :class="{ on: searchScope === 'exact' }"
              :disabled="!scopeAvailable"
              @click="setScope('exact')"
            >
              Exact
            </button>
            <button
              type="button"
              class="dsc-scope-btn"
              :class="{ on: searchScope === 'nearby' }"
              :disabled="!scopeAvailable"
              :title="scopeAvailable ? 'Widen to the whole outward postcode' : 'Enter a full postcode to search nearby'"
              @click="setScope('nearby')"
            >
              Nearby
            </button>
          </div>

          <button class="dsc-search-btn" type="button" @click="runSearch">
            Search
            <Icon name="i-lucide-arrow-right" class="dsc-search-btn-ic" />
          </button>
        </div>

        <p v-if="!hasSearched" class="dsc-search-hint">
          <Icon name="i-lucide-sparkles" class="dsc-hint-ic" />
          <span>Try a postcode like <b>CV1 3PQ</b>, or an address like <b>10 Downing Street, London</b></span>
        </p>
      </section>

      <!-- ── Search results ───────────────────────────────────────────── -->
      <section v-if="hasSearched" class="dsc-block">
        <div class="dsc-block-head">
          <div>
            <h2 class="dsc-h2">
              {{ searchLoading ? 'Searching…' : resultHeading }}
            </h2>
            <p v-if="lastQuery" class="dsc-h2-sub">
              for “{{ lastQuery }}”<template v-if="searchScope === 'nearby'"> · nearby</template>
            </p>
          </div>
          <button class="dsc-textlink" type="button" @click="clearSearch">
            <Icon name="i-lucide-x" class="dsc-textlink-ic" />
            Clear search
          </button>
        </div>

        <div v-if="searchLoading" class="dsc-grid">
          <div v-for="n in 8" :key="`sk-${n}`" class="dsc-skeleton" />
        </div>

        <div v-else-if="results.length" class="dsc-grid">
          <article
            v-for="p in results"
            :key="p.id"
            class="dsc-card"
            role="link"
            tabindex="0"
            @click="openProperty(p.id)"
            @keydown.enter="openProperty(p.id)"
          >
            <div class="dsc-card-photo">
              <PropertyImage :src="p.imageUrl" :alt="p.addressLine1" :show-caption="false" />
              <span v-if="p.hasPassport" class="dsc-card-flag">
                <Icon name="i-lucide-badge-check" class="dsc-card-flag-ic" />
                Passport
              </span>
            </div>
            <div class="dsc-card-body">
              <h3 class="dsc-card-addr">{{ p.addressLine1 }}</h3>
              <p class="dsc-card-meta">
                <template v-if="p.city">{{ p.city }} · </template>{{ p.postcode }}
              </p>
              <div class="dsc-card-foot">
                <p class="dsc-card-price">{{ formatPrice(p.estimatedPrice) }}</p>
                <div class="dsc-card-tags">
                  <span v-if="p.epcRating" class="dsc-tag">EPC {{ p.epcRating }}</span>
                  <span v-if="p.bedrooms" class="dsc-tag">{{ p.bedrooms }} bed</span>
                  <span v-if="p.floorAreaSqm" class="dsc-tag">{{ sqftLabel(p.floorAreaSqm) }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="dsc-empty">
          <span class="dsc-empty-ring"><Icon name="i-lucide-map-pin-off" class="dsc-empty-ic" /></span>
          <p class="dsc-empty-title">No properties matched “{{ lastQuery }}”</p>
          <p class="dsc-empty-sub">
            Try a full postcode, or a house number with the street name.
          </p>
        </div>
      </section>

      <!-- Everything below is the browse experience — hidden while results are
           on screen so the page reads as one thing at a time. -->
      <template v-if="!hasSearched">
        <!-- ── Three entry points ─────────────────────────────────────── -->
        <section class="dsc-block">
          <div class="dsc-entry-grid">
            <button type="button" class="dsc-entry dsc-entry--teal" @click="goToBuyerPassport">
              <span class="dsc-entry-plate">
                <img
                  src="/op-icons/passport-covers/buyer_tilted_right_on_tile.png"
                  alt=""
                  class="dsc-entry-art dsc-entry-art--book"
                  loading="lazy"
                />
              </span>
              <h3 class="dsc-entry-title">Buyer Passport</h3>
              <p class="dsc-entry-sub">
                Your verified buying position — identity, proof of funds and readiness,
                in one record sellers can trust.
              </p>
              <span class="dsc-entry-cta">
                Start yours
                <span class="dsc-entry-chev"><Icon name="i-lucide-arrow-right" /></span>
              </span>
            </button>

            <button type="button" class="dsc-entry dsc-entry--violet" @click="goToWatching">
              <span class="dsc-entry-plate">
                <img
                  src="/op-icons/misc/exploreWatching.png"
                  alt=""
                  class="dsc-entry-art"
                  loading="lazy"
                />
              </span>
              <h3 class="dsc-entry-title">Watched properties</h3>
              <p class="dsc-entry-sub">
                Keep the homes you like in one place and get told the moment
                something changes.
              </p>
              <span class="dsc-entry-cta">
                {{ signedIn ? 'View yours' : 'Sign in to watch' }}
                <span class="dsc-entry-chev"><Icon name="i-lucide-arrow-right" /></span>
              </span>
            </button>

            <div class="dsc-entry dsc-entry--soon">
              <span class="dsc-entry-plate">
                <img
                  src="/op-icons/passport-covers/tenant_passport_tilted_left_on_tile.png"
                  alt=""
                  class="dsc-entry-art dsc-entry-art--book"
                  loading="lazy"
                />
              </span>
              <div class="dsc-entry-titlerow">
                <h3 class="dsc-entry-title">Tenant Passport</h3>
                <span class="dsc-soon">COMING SOON</span>
              </div>
              <p class="dsc-entry-sub">
                A reusable rental profile you can share with any landlord or agent.
              </p>
              <span class="dsc-entry-cta dsc-entry-cta--muted">In development</span>
            </div>
          </div>
        </section>

        <!-- ── HomeScore + Property Passport ────────────────────────────
             Two big, quiet cards. The tick lists and full-width buttons that
             were here before crowded them into feature comparisons - what
             these actually need to do is name the thing, show it, and get out
             of the way. The whole card is the target, so the arrow is an
             affordance rather than a second control. -->
        <section class="dsc-block">
          <div class="dsc-feature-grid">
            <button type="button" class="dsc-feature dsc-feature--teal" @click="navigateTo('/homescore')">
              <span class="dsc-feature-glow" aria-hidden="true" />

              <div class="dsc-feature-top">
                <div class="dsc-feature-heading">
                  <p class="dsc-feature-eyebrow">HomeScore&trade;</p>
                  <span class="dsc-pill dsc-pill--free">FREE</span>
                </div>
                <!-- Illustrative score, matching the reference app's card. A
                     sample figure for a marketing card, not a reading for any
                     property - the real number only ever comes from /homescore
                     once an address is chosen. -->
                <span class="dsc-hs-ring" role="img" aria-label="Example HomeScore of 55 out of 100">
                  <svg viewBox="0 0 100 100">
                    <circle class="dsc-hs-ring-bg" cx="50" cy="50" r="42" />
                    <circle class="dsc-hs-ring-fill" cx="50" cy="50" r="42" stroke-dasharray="263.9" :stroke-dashoffset="263.9 - 0.55 * 263.9" />
                  </svg>
                  <span class="dsc-hs-ring-label">
                    <span class="dsc-hs-ring-num"><strong>55</strong><small>/100</small></span>
                    <span class="dsc-hs-ring-note">example</span>
                  </span>
                </span>
              </div>

              <h3 class="dsc-feature-title">Know what your home<br />could be costing you</h3>
              <p class="dsc-feature-sub">
                Check energy performance, running costs and where you could improve.
              </p>

              <span class="dsc-feature-go">
                Run a free HomeScore
                <span class="dsc-feature-chev"><Icon name="i-lucide-arrow-right" /></span>
              </span>
            </button>

            <button type="button" class="dsc-feature dsc-feature--amber" @click="navigateTo('/passport/sample')">
              <span class="dsc-feature-glow" aria-hidden="true" />

              <div class="dsc-feature-top">
                <div class="dsc-feature-heading">
                  <p class="dsc-feature-eyebrow">Property Passport</p>
                  <span class="dsc-pill dsc-pill--grade">SOLICITOR-GRADE</span>
                </div>
                <span class="dsc-feature-plate">
                  <img src="/op-icons/misc/passportFan.png" alt="" class="dsc-feature-art" loading="lazy" />
                </span>
              </div>

              <h3 class="dsc-feature-title">Build your home's<br />verified record</h3>
              <p class="dsc-feature-sub">
                Store, verify and share documents, answers and history in one place.
              </p>

              <span class="dsc-feature-go dsc-feature-go--amber">
                See a sample Passport
                <span class="dsc-feature-chev"><Icon name="i-lucide-arrow-right" /></span>
              </span>
            </button>
          </div>
        </section>

        <!-- ── Passport ecosystem ─────────────────────────────────────────
             The reference app hides all of this behind a bottom sheet on the
             Property Passport card. On a desktop page a drawer buries it, so
             it's a full section here - same hero copy, same blurb, same four
             passports, same "power of the ecosystem" rail and footer strip. -->
        <section class="dsc-block dsc-eco">
          <span class="dsc-eco-glow" aria-hidden="true" />

          <div class="dsc-eco-head">
            <div class="dsc-eco-head-text">
              <p class="dsc-eco-eyebrow">The passport ecosystem</p>
              <h2 class="dsc-eco-title">One home.<br />Many passports<span class="dsc-dot">.</span></h2>
              <p class="dsc-eco-sub">One permanent record.<br />Built for every journey.</p>
              <p class="dsc-eco-lede">
                Your Property Passport is the foundation. When life changes, unlock new
                roles with the right passport for the next chapter.
              </p>
            </div>
            <img
              src="/op-icons/misc/passportGroupOnTile.png"
              alt="Seller, Landlord, Buyer and Tenant Passport covers"
              class="dsc-eco-art"
              loading="lazy"
            />
          </div>

          <div class="dsc-eco-blurb">
            <img src="/homescore-icon/house.png" alt="" class="dsc-eco-blurb-ic" loading="lazy" />
            <div>
              <p class="dsc-eco-blurb-title">A passport ecosystem that moves with you</p>
              <p class="dsc-eco-blurb-desc">
                Built once. Reuse always. Your verified information flows seamlessly
                between passports, saving you time, effort and money on every step you
                buy, sell, live or rent.
              </p>
            </div>
          </div>

          <div class="dsc-eco-grid">
            <button
              v-for="c in passportCards"
              :key="c.key"
              type="button"
              class="dsc-eco-card"
              :class="{ 'dsc-eco-card--soon': c.status === 'soon' }"
              :disabled="c.status === 'soon'"
              @click="onPassportCardClick(c)"
            >
              <img :src="c.img" :alt="`${c.title} cover`" class="dsc-eco-book" loading="lazy" />
              <h3 class="dsc-eco-card-title" :style="{ color: c.color }">{{ c.title }}</h3>
              <p class="dsc-eco-card-desc">{{ c.desc }}</p>
              <span class="dsc-eco-pill" :class="`dsc-eco-pill--${c.status}`">{{ c.statusLabel }}</span>
            </button>
          </div>

          <!-- ── The power of the ecosystem ── -->
          <div class="dsc-power">
            <p class="dsc-power-title">The power of the ecosystem</p>
            <div class="dsc-power-list">
              <template v-for="(item, i) in powerItems" :key="item.title">
                <div class="dsc-power-col">
                  <span class="dsc-power-plate">
                    <img :src="item.img" alt="" class="dsc-power-ic" loading="lazy" />
                  </span>
                  <p class="dsc-power-item-title">{{ item.title }}</p>
                  <p class="dsc-power-item-desc">{{ item.desc }}</p>
                </div>
                <span v-if="i < powerItems.length - 1" class="dsc-power-connector" aria-hidden="true" />
              </template>
            </div>
          </div>

          <div class="dsc-eco-foot">
            <p class="dsc-eco-foot-tag">Your journey. <span>Our ecosystem.</span></p>
            <div class="dsc-eco-foot-links">
              <span><Icon name="i-lucide-shield-check" class="dsc-eco-foot-ic" />Secure by design</span>
              <span>umovingu.com</span>
              <span>legal@umu.com</span>
              <NuxtLink to="/legal/terms">Terms &amp; conditions</NuxtLink>
            </div>
          </div>
        </section>

        <!-- ── Recently explored ──────────────────────────────────────── -->
        <section v-if="recentlyExplored.length" class="dsc-block">
          <div class="dsc-block-head">
            <div>
              <h2 class="dsc-h2">Recently explored</h2>
              <p class="dsc-h2-sub">Saved in this browser — no account involved</p>
            </div>
            <button class="dsc-textlink" type="button" @click="clearHistory">
              <Icon name="i-lucide-trash-2" class="dsc-textlink-ic" />
              Clear
            </button>
          </div>
          <ul class="dsc-recent">
            <li
              v-for="item in recentlyExplored"
              :key="item.id"
              class="dsc-recent-row"
              role="link"
              tabindex="0"
              @click="openProperty(item.id)"
              @keydown.enter="openProperty(item.id)"
            >
              <div class="dsc-recent-photo">
                <PropertyImage
                  :src="item.image"
                  :alt="item.addressLine1"
                  :show-caption="false"
                />
              </div>
              <div class="dsc-recent-body">
                <p class="dsc-recent-addr">{{ item.addressLine1 }}</p>
                <p class="dsc-recent-meta">
                  <template v-if="item.city">{{ item.city }}, </template>{{ item.postcode }}
                </p>
              </div>
              <div class="dsc-recent-mid">
                <p class="dsc-recent-price">{{ formatPrice(item.estimatedPrice) }}</p>
                <p v-if="item.lastSoldDate" class="dsc-recent-sold">
                  Last sold {{ lastSoldLabel(item.lastSoldDate) }}
                </p>
              </div>
              <div class="dsc-recent-right">
                <span class="dsc-recent-when">{{ relativeTimeLabel(item.viewedAt) }}</span>
                <span class="dsc-recent-chev"><Icon name="i-lucide-chevron-right" /></span>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </main>

    <SiteFooter />

    <AuthGateModal
      v-model="authGateOpen"
      :title="authGateCopy.title"
      :body="authGateCopy.body"
      :redirect-target="authGateRedirect"
    />
  </div>
</template>

<script setup lang="ts">
// The public browse page: search and open any UK property with no account.
// Its signed-in counterpart is /dashboard, the role-aware home.
//
// Deliberately NO middleware — not `auth`, not `guest`. A signed-out visitor
// must be able to search and open a property without an account, which is the
// whole promise of the "no account needed" badge in the hero.
// pages/property/[id].vue is public for the same reason.
//
// Reached from the landing page's Explore buttons, from WebTopNav's Explore
// link (guests only — see that component: this is a pre-login entry point and
// is not advertised once you are signed in, matching the reference app's
// /discover), and from the property page's "Back to Explore" button. The
// route stays open to everyone regardless, so bookmarks and shared links
// keep working.
definePageMeta({ title: 'Explore homes - UmovingU' })

import { ref, computed, onMounted } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import AuthGateModal from '~/components/ui/AuthGateModal.vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import { usePropertySearch } from '~/composables/usePropertySearch'
import {
  useRecentlyExplored,
  type RecentlyExploredEntry,
} from '~/composables/useRecentlyExplored'

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    },
  ],
})

const route = useRoute()
// Read during setup, not in onMounted: the field has to render already filled
// on the first paint, or a visitor handed over from the landing page's search
// sees their own query vanish into an empty box.
const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''

const { profile, fetchProfile } = useProfile()
const { formatPrice } = usePropertySearch()
const { getRecentlyExplored, clearRecentlyExplored } = useRecentlyExplored()

const config = useRuntimeConfig()

// Resolved in onMounted rather than inline: localStorage doesn't exist during
// SSR, so reading it in a computed would make the server and client renders
// disagree (hydration mismatch) for every signed-in visitor.
const signedIn = ref(false)

const recentlyExplored = ref<RecentlyExploredEntry[]>([])

const searchInputEl = ref<{ closeDropdown?: () => void } | null>(null)
const results = ref<any[]>([])
const searchLoading = ref(false)
const hasSearched = ref(false)
const lastQuery = ref('')

// ── Auth gate ─────────────────────────────────────────────────────────────
// One modal, re-titled per entry point, so a guest is always told what they
// are signing in *for* rather than getting a generic prompt.
const authGateOpen = ref(false)
const authGateRedirect = ref('/profile/saved-properties')
const authGateCopy = ref({
  title: 'Sign in to see watched properties',
  body: 'Create a free account to save properties, watch homes and get alerted the moment something changes.',
})

// ── Search scope ──────────────────────────────────────────────────────────
// 'exact'  - send the query through as typed (the backend default)
// 'nearby' - widen a full postcode to its outward code, so CV1 3PQ also
//            returns the rest of CV1
type SearchScope = 'exact' | 'nearby'
const searchScope = ref<SearchScope>('exact')
const scopeQuery = ref('')

// A full UK postcode, e.g. CV1 3PQ / SW1A 1AA - the only shape where widening
// to an outward code means anything. Deliberately not matching a bare outward
// code ("CV1"), which is already as wide as this control could make it.
const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

const scopeAvailable = computed(() => FULL_POSTCODE.test(scopeQuery.value.trim()))

function outwardCode(q: string): string {
  const t = q.trim().toUpperCase().replace(/\s+/g, '')
  return t.slice(0, t.length - 3)
}

// Re-runs immediately when the scope changes on an already-committed search, so
// the toggle behaves like a filter rather than a setting you then have to
// re-submit.
function setScope(next: SearchScope) {
  if (!scopeAvailable.value || searchScope.value === next) return
  searchScope.value = next
  if (hasSearched.value && scopeQuery.value.trim()) runQuery(scopeQuery.value)
}

const resultHeading = computed(() => {
  const n = results.value.length
  return `${n} ${n === 1 ? 'result' : 'results'}`
})

function hasToken(): boolean {
  return typeof localStorage !== 'undefined' && !!localStorage.getItem('token')
}

function sqftLabel(floorAreaSqm: number): string {
  return `${Math.round(floorAreaSqm * 10.764).toLocaleString('en-GB')} sq ft`
}

// ── Search ────────────────────────────────────────────────────────────────
// Two modes, matching the dashboard's search contract: picking a real address
// from the dropdown goes straight to that property, while Enter or the Search
// button shows a result list on this page.
function onSearchSelect(property: any) {
  if (property?.id) {
    openProperty(property.id)
    return
  }
  // Postcode-only fallback selection — there's no property row to open, so
  // treat the postcode as a query instead.
  if (property?.postcode) runQuery(property.postcode)
}

function onSearchEnter(query: string) {
  runQuery(query)
}

function runSearch() {
  const el = document.querySelector<HTMLInputElement>('.dsc-search-field input')
  const q = (el?.value || '').trim()
  if (q) runQuery(q)
  else el?.focus()
}

async function runQuery(q: string) {
  const query = q.trim()
  if (!query) return
  scopeQuery.value = query
  // 'nearby' only ever applies to a full postcode; for anything else the
  // control is disabled and the scope stays on its 'exact' default.
  const effective =
    searchScope.value === 'nearby' && FULL_POSTCODE.test(query)
      ? outwardCode(query)
      : query
  lastQuery.value = query
  hasSearched.value = true
  searchLoading.value = true
  // The suggestion dropdown is absolutely positioned over the content below
  // the bar. Left open it sits on top of the result grid and swallows the
  // click on the first card, so dismiss it as soon as a search is committed.
  searchInputEl.value?.closeDropdown?.()
  // Keep the URL shareable and back-navigable, and let the landing page hand a
  // query straight over via /explore?q=…
  navigateTo({ path: '/explore', query: { q: query } }, { replace: true })
  try {
    const res = await $fetch<{ items: any[] }>(
      `${config.public.apiBase}/property/search`,
      { query: { q: effective, offset: 0, limit: 24 } },
    )
    results.value = res?.items ?? []
  } catch {
    // Backend unreachable — an empty result set reads as "nothing found",
    // which is the honest outcome either way.
    results.value = []
  } finally {
    searchLoading.value = false
  }
}

function clearSearch() {
  hasSearched.value = false
  results.value = []
  lastQuery.value = ''
  scopeQuery.value = ''
  searchScope.value = 'exact'
  navigateTo({ path: '/explore' }, { replace: true })
}

function openProperty(id: string) {
  navigateTo(`/property/${id}`)
}

// ── Entry-point cards ─────────────────────────────────────────────────────
// Two different gates on purpose. Buyer Passport is a considered, multi-step
// commitment, so a guest gets the full sign-up screen with a redirect back
// into the build flow. Watching a property is a one-tap action, so it gets the
// lighter in-page modal instead of a whole page transition.
function goToBuyerPassport() {
  if (!hasToken()) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', '/buyer-profile/build')
    }
    navigateTo('/onboarding/signup')
    return
  }
  navigateTo('/buyer-profile/build')
}

function goToWatching() {
  if (!hasToken()) {
    authGateCopy.value = {
      title: 'Sign in to see watched properties',
      body: 'Create a free account to save properties, watch homes and get alerted the moment something changes.',
    }
    authGateRedirect.value = '/profile/saved-properties'
    authGateOpen.value = true
    return
  }
  navigateTo('/profile/saved-properties')
}

// ── Passport ecosystem ────────────────────────────────────────────────────
// Cover-art note carried over from the reference app: seller/landlord use the
// *_tilted_right_on_tile.png asset, which is branded "Property Passport" on
// the cover rather than the role - role-specific art only exists for buyer and
// tenant. The title under each cover is correct either way.
const passportCards = [
  {
    key: 'seller',
    img: '/op-icons/passport-covers/seller_tilted_right_on_tile.png',
    title: 'Seller Passport',
    color: '#00858a',
    desc: 'Prove accuracy and promote. Gain buyer confidence. Streamline every step to settlement.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'landlord',
    img: '/op-icons/passport-covers/landlord_tilted_right_on_tile.png',
    title: 'Landlord Passport',
    color: '#4b2e83',
    desc: 'Proof of trust and care of your asset. Stronger tenants. Fewer surprises.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'buyer',
    img: '/op-icons/passport-covers/buyer_tilted_right_on_tile.png',
    title: 'Buyer Passport',
    color: '#c9601a',
    desc: 'A clear, confident purchase journey with less stress, more certainty.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'tenant',
    img: '/op-icons/passport-covers/tenant_tilted_right_on_tile.png',
    title: 'Tenant Passport',
    color: '#4a4a52',
    desc: 'Your trusted profile simplifies rental applications and makes life easier.',
    status: 'soon',
    statusLabel: 'AVAILABLE SOON',
  },
]

// "The power of the ecosystem" rail, carried over from the reference app's
// drawer along with its icon choices.
const powerItems = [
  {
    title: 'One verified foundation',
    desc: 'Maximise trust, reduce rework and eliminate lost information.',
    img: '/op-icons/onboarding/trustShield.png',
  },
  {
    title: 'Reuse across roles',
    desc: "Move your data wherever you're heading next.",
    img: '/op-icons/investment/refreshArrows.png',
  },
  {
    title: 'Save time & money',
    desc: 'Fewer forms. Faster decisions. More wins.',
    img: '/op-icons/calendar/clock.png',
  },
  {
    title: 'Secure for life',
    desc: 'Your data. Your control. Encrypted and always yours.',
    img: '/op-icons/matched-buyers/lock-big.png',
  },
  {
    title: 'More value for you',
    desc: 'Unlock stronger offers and a stronger property outcome.',
    img: '/op-icons/investment/growthChart.png',
  },
]

const ECO_COPY: Record<string, { title: string; body: string }> = {
  seller: {
    title: 'Sign in to start your Seller Passport',
    body: 'Create a free account to verify your home and build a Seller Passport buyers can trust.',
  },
  landlord: {
    title: 'Sign in to start your Landlord Passport',
    body: 'Create a free account to build a Landlord Passport — compliance, tenancy documents and more, all in one place.',
  },
  buyer: {
    title: 'Sign in to start your Buyer Passport',
    body: 'Create a free account to build a verified Buyer Passport and move with more confidence.',
  },
}

function onPassportCardClick(card: { key: string; status: string }) {
  if (card.status === 'soon') return
  if (hasToken()) {
    navigateTo('/dashboard')
    return
  }
  authGateCopy.value = ECO_COPY[card.key] ?? {
    title: 'Sign in to continue',
    body: 'Create a free account to get started.',
  }
  authGateRedirect.value = '/dashboard'
  authGateOpen.value = true
}

// ── Recently explored ─────────────────────────────────────────────────────
function clearHistory() {
  clearRecentlyExplored()
  recentlyExplored.value = []
}

function relativeTimeLabel(viewedAt: number): string {
  const minutes = Math.floor((Date.now() - viewedAt) / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(viewedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function lastSoldLabel(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

onMounted(() => {
  signedIn.value = hasToken()
  if (signedIn.value && !profile.value) fetchProfile()
  recentlyExplored.value = getRecentlyExplored()

  // ?q=… arrives from the landing page, so the visitor lands here with results
  // already loading rather than an empty second search box.
  const q = route.query.q
  if (typeof q === 'string' && q.trim()) {
    scopeQuery.value = q
    runQuery(q)
  }
})
</script>

<style scoped>
.dsc {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #231d45;
}

.dsc-shell {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 72px;
}

/* ── Nav actions ──────────────────────────────────────────────────────── */
.dsc-nav-signin,
.dsc-nav-join {
  padding: 11px 18px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, transform 0.16s ease;
}
.dsc-nav-signin {
  border: 1px solid #e4e5ed;
  background: #fff;
  color: #231d45;
}
.dsc-nav-signin:hover {
  border-color: #9fe0d8;
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.12);
}
.dsc-nav-join {
  border: none;
  background: #00a19a;
  color: #fff;
}
.dsc-nav-join:hover {
  background: #018e88;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 161, 154, 0.3);
}
.dsc-nav-profile {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 5px 14px 5px 5px;
  border-radius: 999px;
  border: 1px solid #e4e5ed;
  background: #fff;
  text-decoration: none;
  color: inherit;
}
.dsc-nav-profile:hover { border-color: #9fe0d8; }
.dsc-nav-profile-text { display: flex; flex-direction: column; line-height: 1.15; }
.dsc-nav-profile-text strong { font-size: 13px; font-weight: 800; color: #231d45; }
.dsc-nav-profile-text small { font-size: 10.5px; font-weight: 700; color: #8a90a6; }
@media (max-width: 1120px) {
  .dsc-nav-profile-text { display: none; }
  .dsc-nav-profile { padding: 5px; }
}
.dsc-mobile-auth {
  width: 100%;
  margin-top: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid #e4e5ed;
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
  cursor: pointer;
}
.dsc-mobile-auth--solid {
  border-color: #00a19a;
  background: #00a19a;
  color: #fff;
}

/* ── Hero band ────────────────────────────────────────────────────────── */
.dsc-band {
  position: relative;
  padding: 52px 0 34px;
}
.dsc-band-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.dsc-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 161, 154, 0.24);
  box-shadow: 0 6px 18px rgba(0, 161, 154, 0.1);
  font-size: 12.5px;
  font-weight: 800;
  color: #00776f;
  margin-bottom: 18px;
}
.dsc-badge-ic { width: 16px; height: 16px; }
.dsc-title {
  margin: 0 0 14px;
  font-size: 54px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.03;
}
.dsc-dot { color: #00a19a; }
.dsc-lede {
  margin: 0;
  max-width: 60ch;
  font-size: 16.5px;
  font-weight: 500;
  line-height: 1.65;
  color: #5c627c;
}
.dsc-sources {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin: 24px 0 0;
  padding: 0;
}
.dsc-sources li {
  display: inline-flex;
  align-items: center;
  padding: 7px 15px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(35, 29, 69, 0.07);
  font-size: 12px;
  font-weight: 700;
  color: #6b7089;
}

/* ── Search panel ─────────────────────────────────────────────────────── */
.dsc-search-panel {
  position: relative;
  z-index: 2;
  /* Rides up over the band's bottom edge so the two read as one unit */
  width: min(940px, 100%);
  margin: 0 auto 64px;
  padding: 14px 14px 0;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 22px;
  box-shadow: 0 26px 60px rgba(31, 61, 98, 0.12);
}
.dsc-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dsc-search-field {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 18px;
  border-radius: 15px;
  background: #f7f7fa;
  border: 1px solid transparent;
  transition: border-color 0.16s ease, background 0.16s ease;
}
.dsc-search-field:focus-within {
  background: #fff;
  border-color: #9fe0d8;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}
.dsc-search-lead {
  width: 19px; height: 19px;
  flex-shrink: 0;
  color: #8a90a6;
}
/* The shared input ships its own chrome; strip it back so the field above
   provides the surface instead of nesting two boxes. */
.dsc-search-field :deep(.psi-wrap) { position: static; width: 100%; }
.dsc-search-field :deep(.psi-icon) { display: none; }
.dsc-search-field :deep(.psi-input) {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding-left: 0 !important;
  height: 56px;
  font-size: 15.5px;
  font-weight: 600;
}
.dsc-search-field :deep(.psi-input:focus) { border: 0 !important; background: transparent !important; }
.dsc-search-field :deep(.psi-drop) { z-index: 40; }

.dsc-scope {
  flex-shrink: 0;
  display: inline-flex;
  padding: 4px;
  gap: 3px;
  border-radius: 999px;
  background: #f2f1f6;
  border: 1px solid rgba(35, 29, 69, 0.06);
  transition: opacity 0.16s ease;
}
.dsc-scope--off { opacity: 0.5; }
.dsc-scope-btn {
  padding: 9px 17px;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: #6b7089;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
}
.dsc-scope-btn.on {
  background: #fff;
  color: #231d45;
  box-shadow: 0 2px 8px rgba(31, 61, 98, 0.12);
}
.dsc-scope-btn:disabled { cursor: not-allowed; }

.dsc-search-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 17px 30px;
  border: none;
  border-radius: 15px;
  background: #00a19a;
  color: #fff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.26);
  transition: background 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
}
.dsc-search-btn:hover {
  background: #018e88;
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(0, 161, 154, 0.32);
}
.dsc-search-btn-ic { width: 17px; height: 17px; }

.dsc-search-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  padding: 13px 6px 15px;
  border-top: 1px solid rgba(35, 29, 69, 0.06);
  font-size: 13px;
  font-weight: 600;
  color: #8a90a6;
}
.dsc-hint-ic { width: 15px; height: 15px; color: #00a19a; flex-shrink: 0; }
.dsc-search-hint b { color: #545a72; font-weight: 800; }

/* ── Blocks ───────────────────────────────────────────────────────────── */
.dsc-block { margin-bottom: 64px; }
.dsc-block:last-child { margin-bottom: 0; }
.dsc-block-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}
.dsc-h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.025em;
}
.dsc-h2-sub {
  margin: 5px 0 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #8a90a6;
}
.dsc-textlink {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 9px 16px;
  border: 1px solid rgba(35, 29, 69, 0.09);
  border-radius: 999px;
  background: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: #6b7089;
  cursor: pointer;
  transition: border-color 0.16s ease, color 0.16s ease;
}
.dsc-textlink:hover { border-color: #c9ccd8; color: #231d45; }
.dsc-textlink-ic { width: 14px; height: 14px; }

/* ── Result grid ──────────────────────────────────────────────────────── */
.dsc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 22px;
}
.dsc-skeleton {
  height: 296px;
  border-radius: 20px;
  background: linear-gradient(100deg, #eceaf3 30%, #f6f5fa 50%, #eceaf3 70%);
  background-size: 220% 100%;
  animation: dsc-shimmer 1.4s ease-in-out infinite;
}
@keyframes dsc-shimmer {
  from { background-position: 180% 0; }
  to { background-position: -40% 0; }
}
.dsc-card {
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dsc-card:hover,
.dsc-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 161, 154, 0.4);
  box-shadow: 0 20px 40px rgba(31, 61, 98, 0.13);
  outline: none;
}
.dsc-card-photo {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #eceaf3;
  overflow: hidden;
}
.dsc-card-photo :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.dsc-card-flag {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 161, 154, 0.95);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 121, 115, 0.3);
}
.dsc-card-flag-ic { width: 13px; height: 13px; }
.dsc-card-body { padding: 16px 18px 18px; }
.dsc-card-addr {
  margin: 0 0 4px;
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.015em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsc-card-meta { margin: 0 0 12px; font-size: 12.5px; font-weight: 600; color: #8a90a6; }
.dsc-card-foot { border-top: 1px solid rgba(35, 29, 69, 0.06); padding-top: 12px; }
.dsc-card-price { margin: 0 0 10px; font-size: 19px; font-weight: 800; color: #00776f; letter-spacing: -0.02em; }
.dsc-card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.dsc-tag {
  padding: 5px 11px;
  border-radius: 999px;
  background: #f5f4f8;
  border: 1px solid rgba(35, 29, 69, 0.05);
  font-size: 11px;
  font-weight: 700;
  color: #545a72;
}

/* ── Empty ────────────────────────────────────────────────────────────── */
.dsc-empty {
  padding: 64px 24px;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 22px;
}
.dsc-empty-ring {
  display: inline-grid;
  place-items: center;
  width: 62px; height: 62px;
  border-radius: 50%;
  background: #f3f2f7;
  margin-bottom: 16px;
}
.dsc-empty-ic { width: 26px; height: 26px; color: #a8acbd; }
.dsc-empty-title { margin: 0 0 6px; font-size: 17px; font-weight: 800; }
.dsc-empty-sub { margin: 0; font-size: 14px; font-weight: 500; color: #8a90a6; }

/* ── Entry cards ──────────────────────────────────────────────────────── */
.dsc-entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
}
.dsc-entry {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 28px 28px;
  border-radius: 24px;
  border: 1px solid rgba(35, 29, 69, 0.07);
  background: #fff;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dsc-entry::before {
  content: '';
  position: absolute;
  top: -70px; right: -50px;
  width: 200px; height: 200px;
  border-radius: 50%;
  opacity: 0.85;
  pointer-events: none;
}
.dsc-entry--teal::before { background: radial-gradient(circle, rgba(0,161,154,.14) 0%, rgba(0,161,154,0) 70%); }
.dsc-entry--violet::before { background: radial-gradient(circle, rgba(107,79,216,.13) 0%, rgba(107,79,216,0) 70%); }
.dsc-entry--soon::before { background: radial-gradient(circle, rgba(35,29,69,.06) 0%, rgba(35,29,69,0) 70%); }
.dsc-entry:hover,
.dsc-entry:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 22px 44px rgba(31, 61, 98, 0.13);
  outline: none;
}
.dsc-entry--teal:hover { border-color: rgba(0, 161, 154, 0.4); }
.dsc-entry--violet:hover { border-color: rgba(107, 79, 216, 0.35); }
.dsc-entry--soon {
  cursor: default;
  background: #faf9f7;
}
.dsc-entry--soon:hover { transform: none; box-shadow: none; }

.dsc-entry-plate {
  position: relative;
  display: grid;
  place-items: center;
  width: 92px; height: 92px;
  border-radius: 22px;
  margin-bottom: 20px;
  background: linear-gradient(160deg, #f4f8f7 0%, #fbfbfa 100%);
  border: 1px solid rgba(35, 29, 69, 0.05);
}
.dsc-entry--violet .dsc-entry-plate { background: linear-gradient(160deg, #f4f1fc 0%, #fbfbfd 100%); }
.dsc-entry-art { width: 62px; height: 62px; object-fit: contain; }
.dsc-entry-art--book { width: 52px; height: 66px; }

.dsc-entry-titlerow { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.dsc-entry-title {
  position: relative;
  margin: 0 0 8px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.025em;
}
.dsc-entry-titlerow .dsc-entry-title { margin: 0; }
.dsc-entry-sub {
  position: relative;
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  color: #5c627c;
}
.dsc-entry-cta {
  position: relative;
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 800;
  color: #00a19a;
}
.dsc-entry--violet .dsc-entry-cta { color: #6b4fd8; }
.dsc-entry-cta--muted { color: #a3a7b8; }
.dsc-entry-chev {
  display: grid;
  place-items: center;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.12);
  transition: transform 0.18s ease, background 0.18s ease;
}
.dsc-entry-chev :deep(svg) { width: 14px; height: 14px; }
.dsc-entry--violet .dsc-entry-chev { background: rgba(107, 79, 216, 0.12); }
.dsc-entry:hover .dsc-entry-chev { transform: translateX(4px); }
.dsc-soon {
  padding: 5px 11px;
  border-radius: 999px;
  background: #efeef4;
  border: 1px solid rgba(35, 29, 69, 0.07);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.07em;
  color: #8a90a6;
}

/* ── Feature cards ────────────────────────────────────────────────────── */
.dsc-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}
.dsc-feature {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  padding: 34px 34px 30px;
  border-radius: 26px;
  border: 1px solid rgba(35, 29, 69, 0.07);
  background: linear-gradient(165deg, #ffffff 0%, #fafbfb 100%);
  overflow: hidden;
  box-shadow: 0 16px 38px rgba(31, 61, 98, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.dsc-feature:hover,
.dsc-feature:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 28px 56px rgba(31, 61, 98, 0.13);
  outline: none;
}
.dsc-feature--teal:hover { border-color: rgba(0, 161, 154, 0.4); }
.dsc-feature--amber:hover { border-color: rgba(224, 164, 58, 0.45); }
.dsc-feature-glow {
  position: absolute;
  top: -130px; right: -90px;
  width: 340px; height: 340px;
  border-radius: 50%;
  pointer-events: none;
}
.dsc-feature--teal .dsc-feature-glow { background: radial-gradient(circle, rgba(0,161,154,.17) 0%, rgba(0,161,154,0) 70%); }
.dsc-feature--amber .dsc-feature-glow { background: radial-gradient(circle, rgba(224,164,58,.18) 0%, rgba(224,164,58,0) 70%); }

.dsc-feature-top {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-bottom: 26px;
}
.dsc-feature-heading { min-width: 0; padding-top: 4px; }
.dsc-feature-eyebrow {
  margin: 0 0 11px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.dsc-pill {
  display: inline-block;
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.07em;
}
.dsc-pill--free { background: #e6f6f4; border: 1px solid rgba(0, 161, 154, 0.26); color: #00776f; }
.dsc-pill--grade { background: #fdf3e1; border: 1px solid rgba(224, 164, 58, 0.36); color: #9a6b12; }

/* The visual is the point of these cards, so it is allowed to be big. */
.dsc-feature-plate {
  display: grid;
  place-items: center;
  width: 132px; height: 132px;
  flex-shrink: 0;
  border-radius: 30px;
  background: linear-gradient(160deg, #fdf7ec 0%, #fdfcfa 100%);
  border: 1px solid rgba(35, 29, 69, 0.05);
}
.dsc-feature-art { width: 96px; height: 96px; object-fit: contain; }

.dsc-hs-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 132px; height: 132px;
  flex-shrink: 0;
}
.dsc-hs-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.dsc-hs-ring-bg { fill: none; stroke: rgba(0, 161, 154, 0.14); stroke-width: 9; }
.dsc-hs-ring-fill { fill: none; stroke: #00a19a; stroke-width: 9; stroke-linecap: round; }
.dsc-hs-ring-label {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #231d45;
}
.dsc-hs-ring-num { display: flex; align-items: baseline; gap: 1px; }
.dsc-hs-ring-label strong { font-size: 34px; font-weight: 800; letter-spacing: -0.03em; }
.dsc-hs-ring-label small { font-size: 13px; font-weight: 700; color: #8a90a6; }
.dsc-hs-ring-note {
  margin-top: 2px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b3b7c6;
}

.dsc-feature-title {
  position: relative;
  margin: 0 0 12px;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.22;
}
.dsc-feature-sub {
  position: relative;
  margin: 0 0 26px;
  max-width: 40ch;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.62;
  color: #5c627c;
}
.dsc-feature-go {
  position: relative;
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #00a19a;
}
.dsc-feature-go--amber { color: #b07f18; }
.dsc-feature-chev {
  display: grid;
  place-items: center;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: rgba(0, 161, 154, 0.12);
  transition: transform 0.2s ease, background 0.2s ease;
}
.dsc-feature-go--amber .dsc-feature-chev { background: rgba(224, 164, 58, 0.18); }
.dsc-feature-chev :deep(svg) { width: 17px; height: 17px; }
.dsc-feature:hover .dsc-feature-chev { transform: translateX(5px); }

/* ── Passport ecosystem ───────────────────────────────────────────────── */
.dsc-eco {
  position: relative;
  padding: 40px 38px 38px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 18px 44px rgba(31, 61, 98, 0.07);
  overflow: hidden;
}
.dsc-eco-glow {
  position: absolute;
  top: -160px; right: -60px;
  width: 460px; height: 460px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.09) 0%, rgba(0, 161, 154, 0) 70%);
}
.dsc-eco-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  margin-bottom: 32px;
}
.dsc-eco-head-text { min-width: 0; }
.dsc-eco-eyebrow {
  margin: 0 0 9px;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #00a19a;
}
.dsc-eco-title {
  margin: 0 0 12px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: #231d45;
}
.dsc-eco-title .dsc-dot { color: #00a19a; }
.dsc-eco-lede {
  margin: 0;
  max-width: 56ch;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.65;
  color: #5c627c;
}
.dsc-eco-art {
  width: min(230px, 34%);
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 18px 30px rgba(35, 29, 69, 0.18));
}
.dsc-eco-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(212px, 1fr));
  gap: 16px;
}
.dsc-eco-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px 20px 20px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.09);
  box-shadow: 0 8px 22px rgba(31, 61, 98, 0.05);
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}
.dsc-eco-card:hover:not(:disabled),
.dsc-eco-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 161, 154, 0.42);
  box-shadow: 0 18px 36px rgba(31, 61, 98, 0.12);
  outline: none;
}
.dsc-eco-card--soon { cursor: default; background: #faf9fb; box-shadow: none; }
.dsc-eco-card--soon .dsc-eco-card-title,
.dsc-eco-card--soon .dsc-eco-card-desc { opacity: 0.62; }
.dsc-eco-book {
  width: 56px;
  height: 70px;
  object-fit: contain;
  margin-bottom: 16px;
  filter: drop-shadow(0 8px 16px rgba(35, 29, 69, 0.18));
}
.dsc-eco-card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.02em;
  /* Per-passport brand colour is set inline; these are all light enough to
     hold up on the navy panel. */
}
.dsc-eco-card-desc {
  margin: 0 0 16px;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.55;
  color: #6b7089;
}
.dsc-eco-pill {
  margin-top: auto;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
}
.dsc-eco-pill--now { background: #e6f6f4; border: 1px solid rgba(0, 161, 154, 0.26); color: #00776f; }
.dsc-eco-pill--soon { background: #f2f1f6; border: 1px solid rgba(35, 29, 69, 0.08); color: #8a90a6; }

/* ── Ecosystem blurb ── */
.dsc-eco-sub {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  color: #00a19a;
}
.dsc-eco-blurb {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 22px 24px;
  margin-bottom: 26px;
  border-radius: 20px;
  background: #f4f6fc;
  border: 1px solid rgba(35, 29, 69, 0.06);
}
.dsc-eco-blurb-ic { width: 54px; height: 54px; flex-shrink: 0; object-fit: contain; }
.dsc-eco-blurb-title {
  margin: 0 0 7px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #00a19a;
}
.dsc-eco-blurb-desc {
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.6;
  color: #5c627c;
}

/* ── Power of the ecosystem ── */
.dsc-power {
  position: relative;
  margin-top: 32px;
  padding: 30px 26px 26px;
  border-radius: 22px;
  background: #f7f7fb;
  border: 1px solid rgba(35, 29, 69, 0.06);
}
.dsc-power-title {
  margin: 0 0 26px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #8a90a6;
}
.dsc-power-list {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}
.dsc-power-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.dsc-power-plate {
  display: grid;
  place-items: center;
  width: 66px; height: 66px;
  border-radius: 20px;
  margin-bottom: 14px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 6px 16px rgba(31, 61, 98, 0.06);
}
.dsc-power-ic { width: 40px; height: 40px; object-fit: contain; }
.dsc-power-item-title {
  margin: 0 0 6px;
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #231d45;
}
.dsc-power-item-desc {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #6b7089;
}
.dsc-power-connector {
  flex: 0 0 auto;
  align-self: center;
  width: 26px;
  height: 1px;
  margin-top: -46px;
  background: repeating-linear-gradient(90deg, rgba(35,29,69,.2) 0 4px, transparent 4px 8px);
}

/* ── Ecosystem footer strip ── */
.dsc-eco-foot {
  position: relative;
  margin-top: 30px;
  padding-top: 24px;
  border-top: 1px solid rgba(35, 29, 69, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.dsc-eco-foot-tag {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #231d45;
}
.dsc-eco-foot-tag span { color: #00a19a; }
.dsc-eco-foot-links {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  font-size: 12.5px;
  font-weight: 600;
  color: #8a90a6;
}
.dsc-eco-foot-links span,
.dsc-eco-foot-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: inherit;
  text-decoration: none;
}
.dsc-eco-foot-links a:hover { color: #00a19a; }
.dsc-eco-foot-ic { width: 14px; height: 14px; color: #00a19a; }

/* ── Recently explored ────────────────────────────────────────────────── */
.dsc-recent {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  border-radius: 22px;
  overflow: hidden;
}
.dsc-recent-row {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(35, 29, 69, 0.05);
  cursor: pointer;
  transition: background 0.16s ease;
}
.dsc-recent-row:last-child { border-bottom: none; }
.dsc-recent-row:hover,
.dsc-recent-row:focus-visible { background: #fafafd; outline: none; }
.dsc-recent-photo {
  width: 84px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 13px;
  overflow: hidden;
  background: #eceaf3;
}
.dsc-recent-photo :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.dsc-recent-body { flex: 1; min-width: 0; }
.dsc-recent-addr {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.015em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsc-recent-meta { margin: 0; font-size: 12.5px; font-weight: 600; color: #8a90a6; }
.dsc-recent-mid { flex-shrink: 0; text-align: right; }
.dsc-recent-price { margin: 0; font-size: 15px; font-weight: 800; color: #00776f; letter-spacing: -0.02em; }
.dsc-recent-sold { margin: 3px 0 0; font-size: 11.5px; font-weight: 600; color: #a3a7b8; }
.dsc-recent-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.dsc-recent-when {
  padding: 5px 12px;
  border-radius: 999px;
  background: #f3f2f7;
  font-size: 11.5px;
  font-weight: 700;
  color: #8a90a6;
  white-space: nowrap;
}
.dsc-recent-chev { display: grid; place-items: center; color: #b9bcca; }
.dsc-recent-chev :deep(svg) { width: 18px; height: 18px; }

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .dsc-band { padding: 40px 0 28px; }
  .dsc-title { font-size: 38px; }
  .dsc-eco-head { flex-direction: column; align-items: flex-start; gap: 22px; }
  .dsc-eco-art { width: min(210px, 56%); align-self: center; }
  .dsc-eco-title { font-size: 26px; }
  .dsc-power-list { flex-wrap: wrap; justify-content: center; gap: 22px 10px; }
  .dsc-power-col { flex: 0 0 calc(50% - 12px); }
  .dsc-power-connector { display: none; }
}
@media (max-width: 760px) {
  .dsc-shell { padding: 0 16px 72px; }
  .dsc-search-panel { padding: 12px 12px 0; margin-bottom: 48px; }
  .dsc-search-row { flex-wrap: wrap; }
  .dsc-search-field { flex: 1 1 100%; }
  .dsc-scope { flex: 0 0 auto; }
  .dsc-search-btn { flex: 1; justify-content: center; }
  .dsc-block { margin-bottom: 48px; }
  .dsc-title { font-size: 31px; }
  .dsc-lede { font-size: 15px; }
  .dsc-eco { padding: 30px 22px 26px; }
  .dsc-recent-row { flex-wrap: wrap; gap: 12px; }
  .dsc-recent-mid { text-align: left; }
  .dsc-eco-blurb { flex-direction: column; gap: 12px; }
  .dsc-eco-foot { flex-direction: column; align-items: flex-start; }
}
</style>
