<template>
  <div class="ex">
    <!-- ─────────────────────────── NAVBAR ─────────────────────────── -->
    <header class="ex-nav">
      <div class="ex-shell ex-nav-inner">
        <button class="ex-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="ex-brand-img" />
          <span class="ex-brand-name">umovingu</span><span class="ex-brand-beta">BETA</span>
        </button>

        <nav class="ex-nav-links" aria-label="Explore navigation">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Properties</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
        </nav>

        <div class="ex-nav-actions">
          <button class="ex-icon-btn" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
          </button>
          <button class="ex-profile-chip" :class="{ active: navIsActive('/profile') }" type="button" @click="navigateTo('/profile')">
            <span class="ex-profile-avatar">{{ avatarInitials }}</span>
            <span class="ex-profile-meta">
              <strong>{{ profile?.firstName || 'Vivek' }}</strong>
              <small>{{ roleLabel }} Mode</small>
            </span>
          </button>
          <button class="ex-btn solid" type="button" @click="startClaimFlow">
            <span class="ex-plus">+</span>
            <span>Add Property</span>
          </button>
          <button
            class="ex-burger"
            type="button"
            aria-label="Toggle navigation menu"
            :aria-expanded="mobileNavOpen ? 'true' : 'false'"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <span :class="{ open: mobileNavOpen }" />
          </button>
        </div>
      </div>

      <transition name="ex-menu">
        <nav v-if="mobileNavOpen" class="ex-mobile-menu" aria-label="Mobile navigation">
          <div class="ex-shell">
            <button type="button" @click="goMobile('/explore')">Explore</button>
            <button type="button" @click="goMobile('/passport')">Properties</button>
            <button type="button" @click="goMobile('/marketplace')">Marketplace</button>
            <button type="button" @click="goMobile('/profile/learn')">Learn</button>
            <button type="button" @click="goMobile('/homescore')">HomeScore</button>
            <button type="button" @click="goMobile('/profile')">Profile</button>
            <button type="button" class="ex-mobile-claim" @click="goMobileClaim">Add Property</button>
          </div>
        </nav>
      </transition>
    </header>

    <main class="ex-shell ex-stage">
      <!-- ─────────────────── HERO · YOUR PROPERTY HUB ─────────────────── -->
      <section class="ex-hub">
        <div class="ex-hub-media">
          <img
            :src="heroImgSrc"
            :alt="spotlight.address"
            class="ex-hub-img"
            @error="onHeroImgError"
          />
          <button class="ex-hub-photo" type="button" @click="startClaimFlow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Change photo
          </button>
          <button class="ex-hub-view" type="button" @click="openSpotlight">View property details</button>
        </div>

        <div class="ex-hub-body">
          <p class="ex-hub-eyebrow">Welcome back, {{ profile?.firstName || 'there' }}</p>
          <h1 class="ex-hub-title">Your Property Hub</h1>
          <p class="ex-hub-meta">{{ userPostcode || 'CV5 6AJ' }} &middot; {{ roleLabel }} Mode</p>
          <p class="ex-hub-copy">
            Run your first HomeScore to unlock insights, then build your Property Passport —
            everything ready before you list.
          </p>

          <div class="ex-hub-progress">
            <div class="ex-hub-progress-head">
              <span>Passport progress</span>
              <span>{{ passportPct }}% &middot; {{ passportLabel }}</span>
            </div>
            <div class="ex-hub-progress-track"><i :style="{ width: Math.max(passportPct, 2) + '%' }" /></div>
          </div>

          <div class="ex-hub-actions">
            <button class="ex-btn solid" type="button" @click="navigateTo('/homescore')">Run your first HomeScore</button>
            <button class="ex-btn ghost" type="button" @click="navigateTo('/passport/collections')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" /><path d="M9 4v16M13 9h2" />
              </svg>
              Continue Passport
            </button>

            <!-- ─────────────── SEARCH BAR (right of buttons) ─────────────── -->
            <form class="ex-search ex-search--hub" @submit.prevent="runSearch">
              <div class="ex-search-field">
                <PropertySearchInput
                  placeholder="Search by postcode, address or area"
                  variant="light"
                  @select="onSearchSelect"
                  @enter="onSearchEnter"
                />
              </div>
              <div class="ex-search-radius">
                <select v-model="activeRadius" aria-label="Search radius">
                  <option :value="null">Exact</option>
                  <option :value="0.5">0.5 mi</option>
                  <option :value="1">1 mi</option>
                  <option :value="2">2 mi</option>
                  <option :value="5">5 mi</option>
                  <option :value="10">10 mi</option>
                </select>
              </div>
              <button class="ex-btn solid ex-search-btn" type="submit">Search</button>
            </form>
          </div>
        </div>
      </section>

      <!-- ───────────────────────── KPI OVERVIEW ───────────────────────── -->
      <section class="ex-kpis" aria-label="Portfolio summary">
        <article class="ex-kpi">
          <span class="ex-kpi-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" /><path d="M9 4v16M13 9h2" />
            </svg>
          </span>
          <strong>{{ activePassportCount }}</strong>
          <span class="ex-kpi-label">Active Passports</span>
        </article>
        <article class="ex-kpi">
          <span class="ex-kpi-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v9h14v-9" /><path d="M9 19v-5h6v5" />
            </svg>
          </span>
          <strong>{{ availableFeedCount }}</strong>
          <span class="ex-kpi-label">Properties in feed</span>
        </article>
        <article class="ex-kpi">
          <span class="ex-kpi-ic ex-kpi-ic--ring">
            <span class="ex-kpi-ring-val">{{ dashboardHomeScore }}</span>
          </span>
          <strong>{{ dashboardHomeScore }}</strong>
          <span class="ex-kpi-label">Avg. HomeScore</span>
        </article>
        <article class="ex-kpi">
          <span class="ex-kpi-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 7v6l8 8 8-8-8-8H5a2 2 0 0 0-2 2z" /><circle cx="8" cy="10" r="1.4" />
            </svg>
          </span>
          <strong>{{ estPropertyValue }}</strong>
          <span class="ex-kpi-label">Est. property value</span>
        </article>
      </section>

      <!-- ─────────────── ADD ANOTHER PROPERTY ─────────────── -->
      <button type="button" class="ex-addprop" @click="startClaimFlow">
        <span class="ex-addprop-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span class="ex-addprop-body">
          <strong>Add another property</strong>
          <small>Verify ownership, then choose Rental or Seller Passport</small>
        </span>
        <span class="ex-addprop-cta">
          Add
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </button>

      <!-- ─────────────── FEATURE CARDS · HOMESCORE + PASSPORT ─────────────── -->
      <section class="ex-block">
        <div class="ex-features">
          <!-- HomeScore -->
          <article class="ex-feature ex-feature--hs" @click="navigateTo('/homescore')">
            <div class="ex-feature-media">
              <img src="/profile new icon/passportHasAStory.png" alt="HomeScore" />
            </div>
            <div class="ex-feature-body">
              <div class="ex-feature-top">
                <span class="ex-feature-eyebrow">HomeScore</span>
                <span class="ex-feature-pill hs">Free</span>
              </div>
              <h3 class="ex-feature-headline">Every property has a story.</h3>
              <p class="ex-feature-sub">
                Bills, value, comparisons and energy rating — scored 0–100 from public records.
                <b>Done in 60 seconds.</b>
              </p>
              <ul class="ex-feature-list">
                <li><i class="ex-tick" />Energy &amp; running costs</li>
                <li><i class="ex-tick" />Sold history &amp; estimate</li>
                <li><i class="ex-tick" />Area comparison</li>
              </ul>
              <button class="ex-btn solid ex-feature-cta" type="button" @click.stop="navigateTo('/homescore')">
                Run a HomeScore →
              </button>
            </div>
          </article>

          <!-- Property Passport -->
          <article class="ex-feature ex-feature--pp" @click="navigateTo('/passport/sample')">
            <div class="ex-feature-media ex-feature-media--pp">
              <img src="/profile new icon/samplePassportImage.png" alt="Property Passport" />
            </div>
            <div class="ex-feature-body">
              <div class="ex-feature-top">
                <span class="ex-feature-eyebrow pp">Property Passport</span>
                <span class="ex-feature-pill pp">Solicitor-grade</span>
              </div>
              <h3 class="ex-feature-headline">Every property has a history.</h3>
              <p class="ex-feature-sub">
                Title, planning, surveys and fittings — verified, organised and ready before any offer.
              </p>
              <ul class="ex-feature-list">
                <li><i class="ex-tick" />Sells up to 12 weeks faster</li>
                <li><i class="ex-tick" />No title surprises</li>
                <li><i class="ex-tick" />No survey shocks</li>
              </ul>
              <button class="ex-btn navy ex-feature-cta" type="button" @click.stop="navigateTo('/passport/sample')">
                See a sample Passport →
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- ───────────────── QUICK ACTIONS + ACTIVITY ───────────────── -->
      <section class="ex-two">
        <div class="ex-panel">
          <div class="ex-block-head ex-block-head--stack">
            <h2>Quick actions</h2>
            <p class="ex-block-sub">Everything you need to get your home ready.</p>
          </div>
          <div class="ex-qa-grid">
            <button type="button" class="ex-qa" @click="navigateTo('/passport/collections')">
              <span class="ex-qa-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5" /><path d="m8 9 4-4 4 4" /><path d="M5 19h14" /></svg>
              </span>
              <span class="ex-qa-body"><strong>Upload documents</strong><small>Add or manage property docs</small></span>
              <span class="ex-qa-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="ex-qa" @click="navigateTo('/homescore')">
              <span class="ex-qa-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" /><path d="M9 3v16" /><path d="M15 5v16" /></svg>
              </span>
              <span class="ex-qa-body"><strong>Compare area</strong><small>Explore local insights</small></span>
              <span class="ex-qa-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="ex-qa" @click="navigateTo('/marketplace')">
              <span class="ex-qa-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></svg>
              </span>
              <span class="ex-qa-body"><strong>Book a service</strong><small>Find trusted professionals</small></span>
              <span class="ex-qa-arrow" aria-hidden="true">→</span>
            </button>
            <button type="button" class="ex-qa" @click="navigateTo('/marketplace')">
              <span class="ex-qa-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 4v5" /></svg>
              </span>
              <span class="ex-qa-body"><strong>Marketplace</strong><small>Trusted partner services</small></span>
              <span class="ex-qa-arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div class="ex-panel">
          <div class="ex-block-head ex-block-head--stack">
            <h2>Activity</h2>
            <p class="ex-block-sub">Recent updates on your home.</p>
          </div>
          <ul class="ex-activity">
            <li v-for="(a, i) in activityItems" :key="`act-${i}`" class="ex-activity-item">
              <span class="ex-activity-ic">
                <span v-html="a.icon" />
              </span>
              <span class="ex-activity-body">
                <strong>{{ a.title }}</strong>
                <small>{{ a.sub }}</small>
              </span>
              <span class="ex-activity-time">{{ a.time }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- ───────────────────── RECOMMENDED ───────────────────── -->
      <section class="ex-block">
        <div class="ex-block-head ex-block-head--stack">
          <h2>Recommended for you</h2>
          <p class="ex-block-sub">Trusted services to support your property journey.</p>
        </div>
        <div class="ex-reco-grid">
          <button type="button" class="ex-reco" @click="navigateTo('/marketplace')">
            <span class="ex-reco-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c1.5 3.5-1.5 5-1.5 7.5A3.5 3.5 0 0 0 14 13c0-2 1-3 1-3 1 1.5 2.5 3 2.5 5.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-5.5C6.5 11 9 9 9 6c0-1.5 1.5-3 3-4Z" /></svg>
            </span>
            <strong class="ex-reco-title">Gas safety check</strong>
            <span class="ex-reco-price">From £79</span>
            <small class="ex-reco-sub">Certificate lands in your Passport</small>
          </button>
          <button type="button" class="ex-reco" @click="navigateTo('/marketplace')">
            <span class="ex-reco-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="m9 8 2 2 4-4" /><path d="M9 14h6M9 17h4" /></svg>
            </span>
            <strong class="ex-reco-title">Property survey</strong>
            <span class="ex-reco-price">From £299</span>
            <small class="ex-reco-sub">RICS certified surveyors</small>
          </button>
          <button type="button" class="ex-reco" @click="navigateTo('/marketplace')">
            <span class="ex-reco-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /><path d="M6 7h12" /><path d="M7 7 4 14a3 3 0 0 0 6 0L7 7Z" /><path d="M17 7l-3 7a3 3 0 0 0 6 0l-3-7Z" /><path d="M8 21h8" /></svg>
            </span>
            <strong class="ex-reco-title">Solicitor quote</strong>
            <span class="ex-reco-price">From £250</span>
            <small class="ex-reco-sub">Fixed-fee conveyancing</small>
          </button>
          <button type="button" class="ex-reco" @click="navigateTo('/marketplace')">
            <span class="ex-reco-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M3 11h18" /><circle cx="7" cy="15" r="1" /></svg>
            </span>
            <strong class="ex-reco-title">Mortgage advice</strong>
            <span class="ex-reco-price">Free</span>
            <small class="ex-reco-sub">Compare trusted advisors</small>
          </button>
        </div>
      </section>
    </main>

    <!-- ─────────────────────────── FOOTER ─────────────────────────── -->
    <footer class="ex-footer">
      <div class="ex-shell ex-footer-grid">
        <div class="ex-footer-intro">
          <div class="ex-footer-brand">
            <img src="/logo-new.png" alt="" class="ex-footer-logo" />
            <strong>umovingu</strong>
            <span style="font-size:9.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#2fd0c6;background:rgba(0,161,154,.16);border:1px solid rgba(47,208,198,.35);border-radius:6px;padding:2px 7px;margin-left:2px;">BETA</span>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="ex-footer-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="ex-footer-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport/collections')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/explore')">Explore</button>
        </div>

        <div class="ex-footer-col">
          <h5>Company</h5>
          <button type="button" @click="navigateTo('/')">Our story</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          <button type="button" @click="navigateTo('/profile')">Account</button>
        </div>

        <div class="ex-footer-col">
          <h5>Get started</h5>
          <button type="button" @click="navigateTo('/homescore')">Free HomeScore</button>
          <button type="button" @click="startClaimFlow">Add a property</button>
          <button type="button" @click="navigateTo('/passport/sample')">Sample Passport</button>
        </div>
      </div>
      <div class="ex-shell ex-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'

definePageMeta({ title: 'Explore - UmovingU', middleware: 'auth' })

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
const route = useRoute()

const mobileNavOpen = ref(false)
const navIsActive = (basePath: string) =>
  route.path === basePath || route.path.startsWith(`${basePath}/`)
const goMobile = (path: string) => {
  mobileNavOpen.value = false
  navigateTo(path)
}
const goMobileClaim = () => {
  mobileNavOpen.value = false
  startClaimFlow()
}
watch(() => route.path, () => { mobileNavOpen.value = false })

// ── Data ────────────────────────────────────────────────────────────
const preferences = ref<any>(null)
const passports = ref<any[]>([])
const properties = ref<any[]>([])
const verifiedPassportProperties = ref<any[]>([])
const role = ref<string>('buy')
const activeRadius = ref<number | null>(null)
const searchQuery = ref('')

const roleLabel = computed(() => {
  if (role.value === 'sell') return 'Seller'
  if (role.value === 'landlord') return 'Landlord'
  if (role.value === 'both') return 'Buyer + Seller'
  return 'Buyer'
})

const avatarInitials = computed(() => {
  const f = profile.value?.firstName?.[0] || 'V'
  const l = profile.value?.lastName?.[0] || ''
  return (f + l).toUpperCase()
})

const userPostcode = computed(() => (profile.value as any)?.postcode?.trim() || '')

const dashboardHomeScore = computed(() => {
  const primary = properties.value[0] as any
  const score =
    primary?.HomeScore ?? primary?.homeScore ?? primary?.epcScore ?? passports.value[0]?.homeScore
  if (typeof score === 'number') return Math.max(0, Math.min(100, Math.round(score)))
  return 74
})

// KPI overview tiles
const activePassportCount = computed(() => passports.value.length)
const availableFeedCount = computed(
  () => verifiedPassportProperties.value.length || properties.value.length || 3,
)
const estPropertyValue = computed(() => {
  const v = (properties.value[0] as any)?.estimatedPrice ?? (properties.value[0] as any)?.price
  return formatPrice(v) || '£425,000'
})

// Passport progress (hero)
const passportPct = computed(() => {
  const p = passports.value[0] as any
  const v = p?.progress ?? p?.completion ?? p?.percentComplete ?? 0
  return Math.max(0, Math.min(100, Math.round(typeof v === 'number' ? v : 0)))
})
const passportLabel = computed(() => {
  if (passportPct.value >= 100) return 'complete'
  if (passportPct.value > 0) return 'in progress'
  return 'not started'
})

function formatPrice(n?: number | null): string {
  if (!n || typeof n !== 'number') return ''
  return '£' + Math.round(n).toLocaleString('en-GB')
}

// ── Hero property (best match / owned) ───────────────────────────────
const spotlight = computed(() => {
  const p = (properties.value[0] || verifiedPassportProperties.value[0]) as any
  if (p) {
    return {
      id: p.id,
      image: p.imageUrl || p.image || '/images/uk-houses/house-1.jpg',
      address: `${p.addressLine1 || p.address || '49 Woodfield Road'}, ${p.city || 'Coventry'}, ${p.postcode || userPostcode.value || 'CV5 6AJ'}`,
    }
  }
  return {
    id: null,
    image: '/images/uk-houses/house-1.jpg',
    address: '49 Woodfield Road, Coventry, CV5 6AJ',
  }
})

function openSpotlight() {
  if (spotlight.value.id) navigateTo(`/passportview/${spotlight.value.id}`)
  else navigateTo('/marketplace')
}

// Hero image with a resilient fallback: if the property's own photo is missing
// or fails to load, drop back to a local house image instead of a blank tile.
const HERO_FALLBACK = '/images/uk-houses/house-1.jpg'
const heroImgSrc = ref(HERO_FALLBACK)
watch(
  () => spotlight.value.image,
  (v) => { heroImgSrc.value = v && v.trim() ? v : HERO_FALLBACK },
  { immediate: true },
)
function onHeroImgError() {
  if (heroImgSrc.value !== HERO_FALLBACK) heroImgSrc.value = HERO_FALLBACK
}

// ── Activity ─────────────────────────────────────────────────────────
const ICON_HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9h14v-9"/></svg>'
const ICON_SCORE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 12l5-5"/></svg>'

const activityItems = computed(() => [
  { icon: ICON_HOME, title: 'Property added', sub: userPostcode.value || 'CV5 6AJ', time: '2 days ago' },
  { icon: ICON_SCORE, title: 'HomeScore pending', sub: 'Run your first score to unlock insights', time: 'now' },
])

// ── Search ───────────────────────────────────────────────────────────
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
  if (q) navigateTo(`/marketplace?q=${encodeURIComponent(q)}`)
  else navigateTo('/marketplace')
}

function startClaimFlow() {
  navigateTo('/claim')
}

onMounted(async () => {
  if (!profile.value) await fetchProfile()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return

  const cachedRole = localStorage.getItem('umu_role')
  if (cachedRole) role.value = cachedRole

  const [prefResult, passportResult, propResult, verifiedResult] = await Promise.allSettled([
    $fetch<any>(`${config.public.apiBase}/profile/preferences`, { headers: { Authorization: `Bearer ${token}` } }),
    $fetch<any[]>(`${config.public.apiBase}/profile/passports`, { headers: { Authorization: `Bearer ${token}` } }),
    $fetch<{ items: any[] }>(`${config.public.apiBase}/property/for-you`, { headers: { Authorization: `Bearer ${token}` } }),
    $fetch<{ items: any[] }>(`${config.public.apiBase}/property/verified-passports?limit=12`),
  ])

  if (prefResult.status === 'fulfilled') {
    preferences.value = prefResult.value
    const r = (prefResult.value?.purpose as string[])?.[0] ?? 'buy'
    role.value = r
    if (typeof window !== 'undefined') localStorage.setItem('umu_role', r)
  }
  if (passportResult.status === 'fulfilled') passports.value = passportResult.value ?? []
  if (propResult.status === 'fulfilled') properties.value = propResult.value?.items ?? []
  if (verifiedResult.status === 'fulfilled') verifiedPassportProperties.value = verifiedResult.value?.items ?? []
})
</script>

<style scoped>
.ex {
  --navy: #231d45;
  --navy-2: #2c2456;
  --teal: #00a19a;
  --teal-dark: #00857f;
  --teal-bright: #2fd0c6;
  --ink: #231d45;
  --ink-soft: #5a5570;
  --ink-faint: #8b8799;
  --line: #ececf2;
  --bg: #f3f2ef;
  --card: #ffffff;

  min-height: 100dvh;
  color: var(--ink);
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

.ex-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

/* ── Buttons ──────────────────────────────────────────────────────── */
.ex-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 11px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease;
  white-space: nowrap;
}
.ex-btn svg { width: 17px; height: 17px; flex-shrink: 0; }
.ex-btn.solid { background: var(--teal); color: #fff; }
.ex-btn.solid:hover { background: var(--teal-dark); transform: translateY(-1px); }
.ex-btn.navy { background: var(--navy); color: #fff; }
.ex-btn.navy:hover { background: var(--navy-2); transform: translateY(-1px); }
.ex-btn.ghost {
  background: #fff;
  color: var(--navy);
  border-color: var(--line);
}
.ex-btn.ghost:hover { border-color: var(--teal); color: var(--teal-dark); transform: translateY(-1px); }
.ex-plus { font-weight: 800; margin-right: 2px; }

.ex-link {
  border: 0;
  background: transparent;
  color: var(--teal-dark);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}
.ex-link:hover { color: var(--teal); }

.ex-tick {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--teal);
  position: relative;
  flex-shrink: 0;
}
.ex-tick::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 3px;
  width: 4px;
  height: 7px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ── Navbar ───────────────────────────────────────────────────────── */
.ex-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.ex-nav-inner {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.ex-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.ex-brand-img { height: 32px; width: auto; display: block; object-fit: contain; }
.ex-brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.4px; color: var(--navy); }
.ex-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: var(--teal-dark); background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }

.ex-nav-links { display: flex; gap: 4px; }
.ex-nav-links button {
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-soft);
  padding: 8px 12px;
  border-radius: 9px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.ex-nav-links button:hover { color: var(--navy); background: rgba(35, 29, 69, 0.05); }
.ex-nav-links button.active { color: var(--teal-dark); background: rgba(0, 161, 154, 0.1); }

.ex-nav-actions { display: inline-flex; align-items: center; gap: 10px; }
.ex-icon-btn {
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  color: var(--ink-soft);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.ex-icon-btn svg { width: 19px; height: 19px; }
.ex-icon-btn:hover { border-color: var(--teal); color: var(--teal-dark); }

.ex-profile-chip {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  padding: 5px 12px 5px 5px;
  cursor: pointer;
}
.ex-profile-chip:hover { border-color: var(--teal); }
.ex-profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--navy);
  color: #fff;
  font-size: 12.5px;
  font-weight: 800;
  display: grid;
  place-items: center;
}
.ex-profile-meta { display: flex; flex-direction: column; line-height: 1.15; text-align: left; }
.ex-profile-meta strong { font-size: 13px; font-weight: 700; color: var(--navy); }
.ex-profile-meta small { font-size: 10.5px; color: var(--ink-faint); font-weight: 600; }

.ex-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
}
.ex-burger span,
.ex-burger span::before,
.ex-burger span::after {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: var(--navy);
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.ex-burger span { position: relative; }
.ex-burger span::before { position: absolute; top: -6px; }
.ex-burger span::after { position: absolute; top: 6px; }
.ex-burger span.open { background: transparent; }
.ex-burger span.open::before { top: 0; transform: rotate(45deg); }
.ex-burger span.open::after { top: 0; transform: rotate(-45deg); }

.ex-mobile-menu {
  border-top: 1px solid rgba(35, 29, 69, 0.07);
  background: rgba(243, 242, 239, 0.98);
  backdrop-filter: blur(12px);
  padding: 8px 0 14px;
}
.ex-mobile-menu .ex-shell { display: flex; flex-direction: column; }
.ex-mobile-menu button {
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--navy);
  text-align: left;
  padding: 13px 4px;
  cursor: pointer;
  border-bottom: 1px solid rgba(35, 29, 69, 0.06);
}
.ex-mobile-claim { color: var(--teal-dark) !important; font-weight: 700 !important; }
.ex-menu-enter-active, .ex-menu-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.ex-menu-enter-from, .ex-menu-leave-to { opacity: 0; transform: translateY(-8px); }

/* ── Stage ────────────────────────────────────────────────────────── */
.ex-stage { padding: 28px 0 80px; }

/* ── Hero · Property Hub ──────────────────────────────────────────── */
.ex-hub {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px 32px;
  align-items: stretch;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 18px 44px rgba(35, 29, 69, 0.06);
  margin-bottom: 28px;
}
.ex-hub-media {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 280px;
}
.ex-hub-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.ex-hub-photo {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  color: var(--navy);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(35, 29, 69, 0.16);
}
.ex-hub-photo svg { width: 15px; height: 15px; }
.ex-hub-photo:hover { background: #fff; }
.ex-hub-view {
  position: absolute;
  left: 12px;
  bottom: 12px;
  z-index: 2;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  color: var(--navy);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 14px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(35, 29, 69, 0.16);
}
.ex-hub-view:hover { background: #fff; color: var(--teal-dark); }

.ex-hub-body { display: flex; flex-direction: column; padding: 6px 6px 6px 0; }
.ex-hub-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--teal-dark);
}
.ex-hub-title {
  margin: 0 0 6px;
  font-size: clamp(30px, 3.4vw, 40px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1.2px;
  color: var(--navy);
}
.ex-hub-meta { margin: 0 0 14px; font-size: 14.5px; font-weight: 600; color: var(--ink-soft); }
.ex-hub-copy { margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: var(--ink-soft); max-width: 52ch; }

.ex-hub-progress { margin-bottom: 22px; max-width: 480px; }
.ex-hub-progress-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-soft);
}
.ex-hub-progress-track {
  height: 8px;
  border-radius: 999px;
  background: #eceaf0;
  overflow: hidden;
}
.ex-hub-progress-track i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal-bright) 100%);
  transition: width 0.6s ease;
}
.ex-hub-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: auto; }

/* ── Search bar ───────────────────────────────────────────────────── */
.ex-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 7px;
  box-shadow: 0 10px 28px rgba(35, 29, 69, 0.05);
  margin-bottom: 28px;
}
.ex-search-field { flex: 1; min-width: 0; }
.ex-search-field :deep(.psi-wrap) { width: 100%; }
.ex-search-field :deep(.psi-input) {
  min-height: 42px;
  border: 0 !important;
  border-radius: 10px;
  background: transparent;
  font-size: 14.5px;
  box-shadow: none;
}
.ex-search-field :deep(.psi-input:focus) { border: 0 !important; background: transparent; }
.ex-search-radius { position: relative; flex-shrink: 0; }
.ex-search-radius select {
  appearance: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  padding: 9px 28px 9px 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}
.ex-search-radius::after {
  content: '▾';
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: var(--ink-faint);
  pointer-events: none;
}
.ex-search-btn { flex-shrink: 0; }

/* Search sitting inline, to the right of the hub action buttons */
.ex-search--hub {
  flex: 1 1 300px;
  min-width: 260px;
  margin-bottom: 0;
  box-shadow: none;
  background: #f8f8f6;
  border-color: var(--line);
}
/* The input field is narrow (it shares the row with the radius + Search button),
   so anchor the autocomplete dropdown to the whole search bar rather than the
   input alone: it then spans the full search-bar width and drops cleanly beneath
   it, instead of squashing into the input or sprawling under the buttons. */
.ex-search--hub { position: relative; }
.ex-search--hub :deep(.psi-wrap) { position: static; }
.ex-search--hub :deep(.psi-drop) {
  left: 0;
  right: 0;
  width: auto;
  max-width: none;
  top: calc(100% + 8px);
}

/* ── KPI overview ─────────────────────────────────────────────────── */
.ex-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}
.ex-kpi {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 18px;
}
.ex-kpi-ic {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
  display: grid;
  place-items: center;
  margin-bottom: 14px;
}
.ex-kpi-ic svg { width: 20px; height: 20px; }
.ex-kpi-ic--ring { position: relative; }
.ex-kpi-ic--ring::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 2px solid var(--teal);
}
.ex-kpi-ring-val { font-size: 12px; font-weight: 800; color: var(--teal-dark); }
.ex-kpi strong { display: block; font-size: 30px; font-weight: 800; letter-spacing: -0.8px; color: var(--navy); line-height: 1; }
.ex-kpi-label { display: block; margin-top: 6px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }

/* ── Add another property ─────────────────────────────────────────── */
.ex-addprop {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: left;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(135deg, #ffffff 0%, #f6faf9 100%);
  padding: 18px 20px;
  cursor: pointer;
  margin-bottom: 36px;
  font-family: inherit;
  transition: border-color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
}
.ex-addprop:hover {
  border-color: var(--teal);
  transform: translateY(-2px);
  box-shadow: 0 16px 36px rgba(35, 29, 69, 0.08);
}
.ex-addprop-ic {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--navy);
  color: var(--teal-bright);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-addprop-ic svg { width: 26px; height: 26px; }
.ex-addprop-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.ex-addprop-body strong { font-size: 16px; font-weight: 800; letter-spacing: -0.3px; color: var(--navy); }
.ex-addprop-body small { font-size: 13.5px; color: var(--ink-soft); }
.ex-addprop-cta {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--teal);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 11px;
  transition: background 0.16s ease;
}
.ex-addprop-cta svg { width: 15px; height: 15px; }
.ex-addprop:hover .ex-addprop-cta { background: var(--teal-dark); }

/* ── Blocks ───────────────────────────────────────────────────────── */
.ex-block { margin-bottom: 36px; }
.ex-block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.ex-block-head h2 {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--navy);
}
.ex-block-head--stack { flex-direction: column; align-items: flex-start; gap: 4px; }
.ex-block-sub { margin: 0; font-size: 14px; color: var(--ink-soft); }

/* ── Feature cards (story / history) ──────────────────────────────── */
.ex-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.ex-feature {
  display: flex;
  gap: 18px;
  border: 1.5px solid;
  border-radius: 20px;
  padding: 18px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.ex-feature--hs {
  background: linear-gradient(180deg, #f2faf8 0%, #ffffff 72%);
  border-color: rgba(0, 161, 154, 0.28);
}
.ex-feature--hs:hover {
  border-color: var(--teal);
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(0, 161, 154, 0.16);
}
.ex-feature--pp {
  background: linear-gradient(180deg, rgba(35, 29, 69, 0.04) 0%, #ffffff 72%);
  border-color: rgba(35, 29, 69, 0.18);
}
.ex-feature--pp:hover {
  border-color: var(--navy);
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(35, 29, 69, 0.16);
}
.ex-feature-media {
  flex-shrink: 0;
  width: 132px;
  height: 132px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  overflow: hidden;
  align-self: center;
}
.ex-feature-media img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }
.ex-feature-media--pp img { padding: 6px; }
.ex-feature-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.ex-feature-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.ex-feature-eyebrow {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--teal-dark);
}
.ex-feature-eyebrow.pp { color: var(--navy); }
.ex-feature-pill {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
  color: #fff;
}
.ex-feature-pill.hs { background: var(--teal); }
.ex-feature-pill.pp { background: var(--navy); }
.ex-feature-headline {
  margin: 0 0 5px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  line-height: 1.2;
  color: var(--navy);
}
.ex-feature-sub {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink-soft);
}
.ex-feature-sub b { color: var(--navy); font-weight: 800; }
.ex-feature-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ex-feature-list li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
}
.ex-feature-cta { width: 100%; margin-top: auto; }

/* ── Two-column · quick actions + activity ────────────────────────── */
.ex-two {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  margin-bottom: 36px;
}
.ex-panel {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  padding: 22px;
}

/* ── Quick actions ────────────────────────────────────────────────── */
.ex-qa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.ex-qa {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.ex-qa:hover { border-color: var(--teal); transform: translateY(-2px); }
.ex-qa-ic {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--navy);
  color: #fff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-qa-ic svg { width: 21px; height: 21px; color: var(--teal-bright); }
.ex-qa-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ex-qa-body strong { font-size: 15px; font-weight: 700; color: var(--navy); }
.ex-qa-body small { font-size: 13px; color: var(--ink-soft); }
.ex-qa-arrow { color: var(--ink-faint); font-size: 16px; font-weight: 700; flex-shrink: 0; }
.ex-qa:hover .ex-qa-arrow { color: var(--teal-dark); }

/* ── Activity ─────────────────────────────────────────────────────── */
.ex-activity { list-style: none; margin: 0; padding: 0; }
.ex-activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}
.ex-activity-item:last-child { border-bottom: 0; padding-bottom: 0; }
.ex-activity-item:first-child { padding-top: 4px; }
.ex-activity-ic {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-activity-ic :deep(svg) { width: 18px; height: 18px; }
.ex-activity-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ex-activity-body strong { font-size: 14px; font-weight: 700; color: var(--navy); }
.ex-activity-body small { font-size: 12.5px; color: var(--ink-soft); }
.ex-activity-time { font-size: 12px; font-weight: 600; color: var(--ink-faint); white-space: nowrap; flex-shrink: 0; }

/* ── Recommended ──────────────────────────────────────────────────── */
.ex-reco-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.ex-reco {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 20px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.ex-reco:hover { border-color: var(--teal); transform: translateY(-2px); }
.ex-reco-ic {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--navy);
  color: var(--teal-bright);
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}
.ex-reco-ic svg { width: 21px; height: 21px; }
.ex-reco-title { font-size: 15.5px; font-weight: 700; color: var(--navy); }
.ex-reco-price { margin: 4px 0 5px; font-size: 14px; font-weight: 700; color: var(--teal-dark); }
.ex-reco-sub { font-size: 12.5px; color: var(--ink-faint); line-height: 1.4; }

/* ── Footer (landing style) ───────────────────────────────────────── */
.ex-footer { background: var(--navy); color: #fff; padding: 56px 0 28px; }
.ex-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.ex-footer-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.ex-footer-logo { height: 26px; width: auto; display: block; object-fit: contain; }
.ex-footer-brand strong { font-size: 18px; font-weight: 800; color: #fff; }
.ex-footer-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.ex-footer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ex-footer-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.ex-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.ex-footer-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.ex-footer-col button:hover { color: var(--teal-bright); }
.ex-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 1080px) {
  .ex-nav-links { display: none; }
  .ex-burger { display: flex; }
  .ex-profile-meta { display: none; }
}
@media (max-width: 980px) {
  .ex-hub { grid-template-columns: 1fr; }
  .ex-hub-media { min-height: 220px; }
  .ex-kpis { grid-template-columns: repeat(2, 1fr); }
  .ex-features { grid-template-columns: 1fr; }
  .ex-two { grid-template-columns: 1fr; }
  .ex-reco-grid { grid-template-columns: repeat(2, 1fr); }
  .ex-footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .ex-nav-inner { gap: 12px; }
  .ex-profile-chip { display: none; }
  .ex-nav-actions .ex-btn.solid { display: none; }
  .ex-search { flex-wrap: wrap; }
  .ex-search-field { flex: 1 1 100%; order: -1; }
  .ex-hub-actions .ex-btn { flex: 1 1 auto; }
  .ex-search--hub { flex: 1 1 100%; }
  .ex-qa-grid { grid-template-columns: 1fr; }
  .ex-addprop { flex-wrap: wrap; }
  .ex-addprop-cta { width: 100%; justify-content: center; }
  .ex-feature { flex-direction: column; }
  .ex-feature-media { align-self: flex-start; }
}
@media (max-width: 520px) {
  .ex-shell { width: calc(100% - 32px); }
  .ex-kpis { grid-template-columns: 1fr 1fr; }
  .ex-reco-grid { grid-template-columns: 1fr; }
  .ex-footer-grid { grid-template-columns: 1fr; }
}
</style>
