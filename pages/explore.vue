<template>
  <div class="mobile-container explore-root">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <header class="explore-web-nav">
      <div class="explore-web-shell nav-inner">
        <button class="brand" type="button" @click="navigateTo('/')">
          <img src="/logo.png" alt="" class="brand-logo" />
          <span>umovingu</span>
        </button>

        <nav class="web-links" aria-label="Explore navigation">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Properties</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">Insights</button>
        </nav>

        <div class="web-actions">
          <button class="web-icon-btn" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .53-.21 1.04-.59 1.41L4 17h5" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
          </button>
          <button class="web-profile-chip" :class="{ active: navIsActive('/profile') }" type="button" @click="navigateTo('/profile')">
            <span class="web-profile-avatar">{{ (profile?.firstName?.[0] || 'V') + (profile?.lastName?.[0] || 'K') }}</span>
            <span class="web-profile-meta">
              <strong>{{ profile?.firstName || 'Vivek Kumar' }}</strong>
              <small>Seller Mode</small>
            </span>
          </button>
          <button class="web-btn solid add-property" type="button" @click="startClaimFlow">
            <span>+</span>
            <span>Add Property</span>
          </button>
        </div>

        <button
          class="web-mobile-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          :aria-expanded="mobileNavOpen ? 'true' : 'false'"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div class="explore-web-shell">
        <div
          class="web-mobile-backdrop"
          :class="{ open: mobileNavOpen }"
          @click="mobileNavOpen = false"
        />
        <div class="web-mobile-panel" :class="{ open: mobileNavOpen }">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="goMobile('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="goMobile('/passport')">Properties</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="goMobile('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="goMobile('/profile/learn')">Learn</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="goMobile('/homescore')">Insights</button>
          <button type="button" :class="{ active: navIsActive('/profile') }" @click="goMobile('/profile')">Profile</button>
          <button type="button" class="claim" @click="goMobileClaim">Add Property</button>
        </div>
      </div>
    </header>

    <div class="explore-web-shell explore-stage" :class="{ 'is-ready': pageReady }">
      <section class="web-dashboard-top" aria-label="Explore dashboard overview">
        <div class="web-dashboard-main">
          <article class="web-property-spotlight">
            <div class="web-spotlight-media">
              <PropertyImage
                :src="passports[0]?.imageUrl || properties[0]?.imageUrl || properties[0]?.image || '/images/uk-houses/house-1.jpg'"
                :alt="passports[0]?.address || passports[0]?.addressLine1 || 'Property image'"
                :show-caption="false"
                class="web-spotlight-img"
              />
              <button class="web-media-btn" type="button" @click="passports.length ? navigateTo('/passportview/' + passports[0].id) : navigateTo('/explore')">
                View Property Details
              </button>
            </div>

            <div class="web-spotlight-body">
              <p class="web-tag">Property Passport</p>
              <h1>{{ passports[0]?.address || passports[0]?.addressLine1 || 'Your Property Hub' }}</h1>
              <p class="web-address-sub">{{ passports[0]?.postcode || userPostcode || 'Set your postcode to personalize results' }}</p>
              <p class="web-spotlight-copy">
                Complete your Property Passport to unlock insights, boost trust, and showcase your property with confidence.
              </p>

              <div class="web-progress-row">
                <span>{{ passports[0]?.completionPercentage ?? 0 }}% complete</span>
                <span>{{ passports.length ? 'Passport active' : 'No passport yet' }}</span>
              </div>
              <div class="web-progress-track">
                <div class="web-progress-fill" :style="{ width: `${passports[0]?.completionPercentage ?? 0}%` }" />
              </div>

              <div class="web-spotlight-actions">
                <button class="web-primary" type="button" @click="startClaimFlow">Continue Passport</button>
                <button class="web-secondary" type="button" @click="navigateTo('/homescore')">Run HomeScore</button>
              </div>
            </div>
          </article>

          <div class="web-kpi-row" aria-label="Portfolio summary">
            <article>
              <div class="web-kpi-top"><i>📁</i><strong>{{ activePassportCount }}</strong></div>
              <span>Active Passports</span>
            </article>
            <article>
              <div class="web-kpi-top"><i>🏘️</i><strong>{{ availableFeedCount }}</strong></div>
              <span>Properties in Feed</span>
            </article>
            <article>
              <div class="web-kpi-top"><i>🟢</i><strong>{{ passportScore }}</strong></div>
              <span>Avg. HomeScore</span>
            </article>
            <article>
              <div class="web-kpi-top"><i>💷</i><strong>£425,000</strong></div>
              <span>Est. Property Value</span>
            </article>
          </div>

          <div class="web-feature-grid" aria-label="Service cards">
            <article class="web-feature-card homescore">
              <div class="web-feature-head">
                <h3><img src="/op-icons/search.svg" alt="" class="web-feature-icon" />HomeScore</h3>
                <span>Free</span>
              </div>
              <p>Get a comprehensive score for your property.</p>
              <div class="web-feature-body homescore-layout">
                <div class="web-score-ring" :style="{ '--score': `${dashboardHomeScore}` }">
                  <div class="web-score-ring-inner">
                    <strong>{{ dashboardHomeScore }}</strong>
                    <span>/100</span>
                  </div>
                </div>
                <ul class="web-feature-points hs">
                  <li>Energy & running costs</li>
                  <li>Sold history & estimate</li>
                  <li>Area comparison</li>
                </ul>
              </div>
              <button type="button" @click="navigateTo('/homescore')">Run a HomeScore <span>→</span></button>
            </article>

            <article class="web-feature-card passport">
              <div class="web-feature-head">
                <h3><img src="/op-icons/passportview/umu-passport.png" alt="" class="web-feature-icon" />Property Passport</h3>
                <span>Solicitor-grade</span>
              </div>
              <p>Build trust with verified, organised property data.</p>
              <div class="web-feature-body passport-layout">
                <div class="web-passport-book">
                  <img src="/op-icons/passportview/umu-passport.png" alt="Property passport" />
                </div>
                <ul class="web-feature-points pp">
                  <li>Sells 12 weeks faster on average</li>
                  <li>No survey shocks</li>
                  <li>No title surprises</li>
                  <li>No 12-week wait</li>
                </ul>
              </div>
              <button type="button" @click="startClaimFlow">See a sample Passport <span>→</span></button>
            </article>
          </div>

          <div class="web-recommended" aria-label="Recommended services">
            <div class="web-reco-head">
              <h4>Recommended for you</h4>
            </div>
            <div class="web-reco-grid">
              <button type="button" @click="navigateTo('/marketplace')">
                <span class="web-reco-icon"><img src="/op-icons/goodEnergy.svg" alt="" /></span>
                <span class="web-reco-copy">
                  <strong>Book a Gas Safety Check</strong>
                  <small>From £79</small>
                  <em>Cert lands in your Passport</em>
                </span>
                <span class="web-reco-arrow">›</span>
              </button>
              <button type="button" @click="navigateTo('/marketplace')">
                <span class="web-reco-icon"><img src="/op-icons/house.svg" alt="" /></span>
                <span class="web-reco-copy">
                  <strong>Property Survey</strong>
                  <small>From £299</small>
                  <em>RICS certified surveyors</em>
                </span>
                <span class="web-reco-arrow">›</span>
              </button>
              <button type="button" @click="navigateTo('/marketplace')">
                <span class="web-reco-icon"><img src="/op-icons/User-Code.svg" alt="" /></span>
                <span class="web-reco-copy">
                  <strong>Solicitor Quote</strong>
                  <small>From £250</small>
                  <em>Fixed-fee conveyancing</em>
                </span>
                <span class="web-reco-arrow">›</span>
              </button>
              <button type="button" @click="navigateTo('/marketplace')">
                <span class="web-reco-icon"><img src="/op-icons/Home-Search.svg" alt="" /></span>
                <span class="web-reco-copy">
                  <strong>Mortgage Advice</strong>
                  <small>Free</small>
                  <em>Compare trusted advisors</em>
                </span>
                <span class="web-reco-plus">+</span>
              </button>
            </div>
          </div>
        </div>

        <aside class="web-dashboard-side">
          <article class="web-quick-actions">
            <h3>Quick actions</h3>
            <button type="button" @click="navigateTo('/homescore')"><span><img src="/op-icons/search.svg" alt="" /><span><strong>Run HomeScore</strong><small>Get instant property score</small></span></span><span>→</span></button>
            <button type="button" @click="navigateTo('/passport/collections')"><span><img src="/op-icons/passportview/umu-passport.png" alt="" /><span><strong>Upload Documents</strong><small>Add or manage property docs</small></span></span><span>→</span></button>
            <button type="button" @click="navigateTo('/explore')"><span><img src="/op-icons/Home-Search.svg" alt="" /><span><strong>Compare Area</strong><small>Explore local insights</small></span></span><span>→</span></button>
            <button type="button" @click="navigateTo('/marketplace')"><span><img src="/op-icons/Building-Community.svg" alt="" /><span><strong>Book a Service</strong><small>Find trusted professionals</small></span></span><span>→</span></button>
          </article>

          <article class="web-progress-panel">
            <p>Your progress</p>
            <div class="web-progress-score">
              <strong>{{ passports[0]?.completionPercentage ?? 0 }}%</strong>
              <span>Complete</span>
            </div>
            <button type="button" @click="startClaimFlow">Continue Passport</button>
          </article>

          <article class="web-activity-panel">
            <div class="web-activity-head">
              <h4>Activity</h4>
              <button type="button" @click="navigateTo('/passport/collections')">View all</button>
            </div>
            <div class="web-activity-list">
              <div>
                <strong>Property added</strong>
                <span>{{ passports[0]?.addressLine1 || passports[0]?.address || 'No property yet' }}</span>
                <em>2 days ago</em>
              </div>
              <div>
                <strong>HomeScore pending</strong>
                <span>Run your first score to unlock insights</span>
                <em>Pending</em>
              </div>
              <div>
                <strong>Passport incomplete</strong>
                <span>{{ passports[0]?.completionPercentage ?? 0 }}% completed</span>
                <em>{{ passports[0]?.completionPercentage ?? 0 }}%</em>
              </div>
              <div>
                <strong>Documents</strong>
                <span>Add docs to strengthen trust</span>
                <em>Pending</em>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <footer class="web-dashboard-footer">
        <div class="web-footer-grid">
          <div class="web-footer-intro">
            <div class="web-footer-brand">
              <img src="/logo.png" alt="" />
              <strong>umovingu</strong>
            </div>
            <span class="web-footer-chip">Built for UK property journeys</span>
            <p>
              Professional property intelligence for sellers, buyers, and landlords.
              Start with HomeScore and progress with confidence.
            </p>
            <button type="button" class="web-footer-cta" @click="navigateTo('/homescore')">Run a HomeScore check</button>
          </div>

          <div class="web-footer-col">
            <h5><span class="footer-hicon footer-hicon--product" aria-hidden="true" />Product</h5>
            <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport/collections')">Property Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          </div>

          <div class="web-footer-col">
            <h5><span class="footer-hicon footer-hicon--legal" aria-hidden="true" />Legal</h5>
            <button type="button" @click="navigateTo('/legal/privacy')">Privacy</button>
            <button type="button" @click="navigateTo('/legal/terms')">Terms</button>
            <button type="button" @click="navigateTo('/legal/cookies')">Cookies</button>
          </div>

          <div class="web-footer-col">
            <h5><span class="footer-hicon footer-hicon--account" aria-hidden="true" />Account</h5>
            <button type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
            <button type="button" @click="navigateTo('/onboarding/signup')">Create account</button>
          </div>
        </div>
        <div class="web-footer-bottom">© 2026 UMU. All rights reserved.</div>
      </footer>

      <div v-if="showLegacyExploreLayout" class="explore-hero">
      <div class="hero-row1">
        <div class="hero-copy-stack">
          <div class="explore-greeting-sub">{{ greeting }}</div>
          <div class="explore-title">Explore</div>
          <p class="explore-lede">
            A web-first property workspace to search, compare, and move from interest to verified Passport.
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px">
          <button
            class="explore-tour-btn"
            aria-label="Take a quick tour"
            data-tour="tour-btn"
            @click="exploreTourRef?.start?.()"
          >
            ?
          </button>
          <div class="hero-avatar" data-tour="avatar" @click="navigateTo('/profile')">
            <UserAvatar
              :src="profile?.avatarUrl"
              :firstName="profile?.firstName"
              :lastName="profile?.lastName"
              :size="36"
            />
          </div>
        </div>
      </div>

      <div class="search-wrap" style="margin-bottom: 6px">
        <svg
          class="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          stroke-width="2.2"
          stroke-linecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search by postcode, address or area"
          class="search-input"
          @input="handleSearchInput(($event.target as HTMLInputElement).value)"
          @keyup.enter="doSearch"
          @blur="showDropdown = false"
        />
        <button
          class="exp-dist-btn"
          :class="{ 'has-filters': hasAnyFilters }"
          data-tour="filter-pill"
          @click="openFilterSheet"
        >
          <span>{{ distLabelShort(activeRadius) }}</span>
          <span class="filter-dot" />
          <span class="arrow">▾</span>
        </button>
        <button class="search-btn" @click="doSearch">Search</button>
      </div>

      <div v-if="showDropdown && searchResults.length > 0" class="addr-drop">
        <div class="addr-drop-header">Select an address</div>
        <div
          v-for="(addr, i) in searchResults"
          :key="i"
          class="addr-item"
          @mousedown.prevent="selectAddress(addr)"
        >
          <div class="addr-ic">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div class="addr-body">
            <div class="addr-line1">
              {{ addr.addressLine1 || addr.line1 || addr.address }}
            </div>
            <div class="addr-line2">
              <span v-if="addr.city">{{ addr.city }} · </span>{{ addr.postcode || addr.addressLine2 || addr.line2 || '' }}
            </div>
            <div class="addr-badges">
              <span
                v-if="addr.epcRating"
                class="addr-badge"
                :style="{ background: epcDropColor(addr.epcRating) }"
              >
                ⚡ EPC {{ addr.epcRating }}
              </span>
              <span
                v-if="addr.hasPassport && addr.passportPublished"
                class="addr-badge addr-badge--pub"
              >
                <img src="/op-icons/passportview/umu-passport.png" alt="" class="addr-badge-ic" />
                Passport Published
              </span>
              <span
                v-else-if="addr.hasPassport"
                class="addr-badge addr-badge--prog"
              >
                <img src="/op-icons/passportview/umu-passport.png" alt="" class="addr-badge-ic" />
                Passport In Progress
              </span>
              <span
                v-else
                class="addr-badge addr-badge--unclaimed"
              >
                <img src="/op-icons/passportview/umu-passport.png" alt="" class="addr-badge-ic" />
                Unclaimed · Claim yours? →
              </span>
            </div>
          </div>
          <div
            v-if="(addr.homeScore ?? addr.epcScore) != null"
            class="addr-hs"
            :style="{ color: hsDropColor(addr.homeScore ?? addr.epcScore) }"
          >
            <span class="addr-hs-num">{{ addr.homeScore ?? addr.epcScore }}</span>
            <span class="addr-hs-lbl">HS</span>
          </div>
        </div>
      </div>

      <div v-if="selectedAddress" class="selected-addr-pill">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00A19A"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <div style="flex: 1; font-size: 13px; font-weight: 700; color: #231d45">
          {{ selectedAddressText }}
        </div>
        <div class="search-clear-btn" @click="clearSearch">x</div>
      </div>

      <!-- Active-filter summary chips. Each chip dismisses the matching
           committed filter; "Clear all" zeroes everything. Hidden when no
           filters are active. -->
      <div v-if="committedChips.length" class="filter-summary visible">
        <span
          v-for="c in committedChips"
          :key="c.key"
          class="fs-chip"
        >
          <span>{{ c.label }}</span>
          <span
            class="x"
            role="button"
            tabindex="0"
            @click="removeCommittedFilter(c.key)"
          >×</span>
        </span>
        <button class="fs-clear" @click="clearAllFilters">Clear all</button>
      </div>

      <div class="hero-meta-grid">
        <article class="hero-meta-card">
          <p class="hero-meta-eyebrow">Explore Workspace</p>
          <h2>Built for desktop decision-making</h2>
          <p>
            Move from search to readiness with side-by-side cards, clearer market context,
            and quick paths into HomeScore, Passport, and matched properties.
          </p>
          <div class="hero-quick-links">
            <button type="button" @click="navigateTo('/homescore')">Run HomeScore</button>
            <button type="button" @click="navigateTo('/passport/collections')">Open Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Browse Marketplace</button>
          </div>
        </article>

        <aside class="hero-kpi-grid" aria-label="Explore highlights">
          <article class="hero-kpi">
            <strong>{{ activePassportCount }}</strong>
            <span>Active Passports</span>
          </article>
          <article class="hero-kpi">
            <strong>{{ availableFeedCount }}</strong>
            <span>Properties In Feed</span>
          </article>
          <article class="hero-kpi">
            <strong>{{ roleLabel }}</strong>
            <span>Your Journey Mode</span>
          </article>
        </aside>
      </div>
    </div>

      <div v-if="showLegacyExploreLayout" class="explore-scroll" :class="{ 'search-mode': searchMode }">
      <!-- ── Search Results Mode ── -->
      <template v-if="searchMode">
        <div class="search-back-row">
          <button class="search-back-btn" @click="exitSearch">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div class="search-result-label">
            <span v-if="!searchLoading && searchTotal > 0">
              {{ searchTotal }}
              {{ searchTotal === 1 ? 'result' : 'results' }} for "{{
                searchQuery
              }}"
            </span>
            <span v-else>Results for "{{ searchQuery }}"</span>
          </div>
        </div>
        <div v-if="searchLoading" class="skeletons">
          <div v-for="n in 4" :key="n" class="skeleton-card" />
        </div>
        <template v-else-if="searchProperties.length > 0">
          <div
            v-for="prop in searchProperties"
            :key="prop.id"
            class="prop-card"
            @click="navigateTo('/property/' + prop.id)"
          >
            <div
              class="prop-img-wrap"
              :style="{
                background:
                  prop.imgGradient || 'linear-gradient(135deg,#dff4f0,#c8ebe6)',
              }"
            >
              <PropertyImage
                :src="prop.imageUrl || prop.image"
                :alt="prop.addressLine1 || prop.address"
                :show-caption="false"
                class="prop-img"
              />
              <div v-if="prop.hasPassport" class="prop-badge-pp">
                <img
                  src="/op-icons/passportview/umu-passport.png"
                  alt=""
                  class="pp-emoji-ic"
                />
                Passport
              </div>
              <div class="prop-price-tag">
                {{
                  prop.estimatedPrice
                    ? '£' + Math.round(prop.estimatedPrice).toLocaleString()
                    : prop.priceDisplay || 'POA'
                }}
              </div>
            </div>
            <div class="prop-body">
              <div class="prop-row-top">
                <div class="prop-title-col">
                  <div class="prop-address">
                    {{ prop.addressLine1 || prop.address }}
                  </div>
                  <div class="prop-area">
                    {{
                      prop.city
                        ? prop.city + ', ' + prop.postcode
                        : prop.area || prop.postcode || ''
                    }}
                  </div>
                </div>
                <div
                  v-if="prop.epcRating"
                  class="epc-badge"
                  :style="{ background: epcColor(prop.epcRating) }"
                >
                  <div class="epc-badge-label">EPC</div>
                  <div class="epc-badge-rating">{{ prop.epcRating }}</div>
                </div>
              </div>
              <div class="prop-pills">
                <span v-if="prop.propertyType || prop.type" class="pill-grey">{{
                  prop.propertyType || prop.type
                }}</span>
                <span v-if="prop.tenure" class="pill-grey">{{
                  prop.tenure
                }}</span>
              </div>
              <div class="prop-footer">
                <div class="prop-score-row" v-if="prop.HomeScore">
                  <span class="prop-score-lbl">HomeScore</span>
                  <div class="prop-score-bar">
                    <div
                      class="prop-score-fill"
                      :style="{ width: prop.HomeScore + '%' }"
                    ></div>
                  </div>
                  <span class="prop-score-num">{{ prop.HomeScore }}</span>
                </div>
                <span class="prop-passport-btn">View →</span>
              </div>
            </div>
          </div>
          <!-- Load-more sentinel + status -->
          <div
            v-if="hasMoreResults"
            ref="loadMoreSentinel"
            class="load-more-sentinel"
          >
            <div v-if="searchLoadingMore" class="load-more-spinner" />
            <button v-else class="load-more-btn" @click="loadMoreResults">
              Load
              {{
                Math.min(
                  SEARCH_PAGE_SIZE,
                  searchTotal - searchProperties.length,
                )
              }}
              more
            </button>
          </div>
          <div v-else class="load-more-end">
            {{
              searchProperties.length === 1
                ? '1 result shown'
                : searchProperties.length + ' results shown'
            }}
          </div>
        </template>
        <div v-else class="no-results-msg">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">No properties found</div>
          <div class="no-results-sub">Try a different postcode or area</div>
        </div>
      </template>

      <template v-else-if="view === 'new'">
        <template
          v-if="role === 'sell' || role === 'landlord' || role === 'both'"
        >
          <div class="claim-banner" data-tour="claim-banner">
            <div class="claim-glow"></div>
            <div style="position: relative; z-index: 1">
              <div class="claim-eyebrow">Your first step</div>
              <div class="claim-title">Start your Property Passport</div>
              <div class="claim-sub">
                Verify your ownership. Build your record. Buyers trust verified
                sellers - sell up to 12x faster.
              </div>
              <div class="claim-stats-row">
                <div class="claim-stat-box">
                  <div class="claim-stat-val">12x</div>
                  <div class="claim-stat-lbl">faster to exchange</div>
                </div>
                <div class="claim-stat-box">
                  <div class="claim-stat-val">3x</div>
                  <div class="claim-stat-lbl">fewer fall-throughs</div>
                </div>
                <div class="claim-stat-box">
                  <div class="claim-stat-val">£0</div>
                  <div class="claim-stat-lbl">to get started</div>
                </div>
              </div>
              <button class="btn-claim" @click="startClaimFlow">
                Claim your Property Passport
              </button>
            </div>
          </div>

          <div style="margin-bottom: 16px">
            <div
              style="
                font-size: 15px;
                font-weight: 700;
                color: #1f2024;
                margin-bottom: 10px;
              "
            >
              What happens after you claim
            </div>
            <div class="step-row">
              <div class="step-num">1</div>
              <div
                style="
                  font-size: 14px;
                  color: #4a5568;
                  line-height: 1.5;
                  padding-top: 2px;
                "
              >
                Verify your identity and ownership - takes 5 mins
              </div>
            </div>
            <div class="step-row">
              <div class="step-num">2</div>
              <div
                style="
                  font-size: 14px;
                  color: #4a5568;
                  line-height: 1.5;
                  padding-top: 2px;
                "
              >
                Upload or auto-fetch your documents (title deed, EPC, certs)
              </div>
            </div>
            <div class="step-row">
              <div class="step-num">3</div>
              <div
                style="
                  font-size: 14px;
                  color: #4a5568;
                  line-height: 1.5;
                  padding-top: 2px;
                "
              >
                Once your Passport is complete, publish and share it with your
                agent, solicitor or buyers directly
              </div>
            </div>
          </div>

          <div
            class="pro-dark-card"
            data-tour="pro-card"
            style="margin-bottom: 16px"
            @click="navigateTo('/explore')"
          >
            <div class="pro-dark-icon">🔧</div>
            <div class="pro-dark-body">
              <div class="pro-dark-title">Need certs? Find a Pro</div>
              <div class="pro-dark-sub">
                Gas, EICR, EPC - certs auto-land in your Passport
              </div>
            </div>
            <div class="pro-dark-badge">Book</div>
          </div>

          <HealthPassportCards />

          <div class="feed-header" data-tour="verified-feed">
            <div class="feed-title">Verified passport properties</div>
            <div
              v-if="verifiedPassportDisplay.length"
              class="feed-see-all"
              @click="navigateTo('/explore')"
            >
              See all
            </div>
          </div>
          <div class="feed-sub">
            See how other sellers have prepared their Property Passport.
          </div>

          <div v-if="loadingVerifiedPassports" class="skeletons">
            <div v-for="n in 3" :key="n" class="skeleton-card" />
          </div>
          <div v-else-if="verifiedPassportDisplay.length" class="horiz-feed">
            <div
              v-for="prop in verifiedPassportDisplay"
              :key="prop.id"
              class="prop-card prop-card-horiz"
              @click="navigateTo('/property/' + prop.id)"
            >
              <div
                class="prop-img-wrap"
                :style="{
                  background:
                    prop.imgGradient ||
                    'linear-gradient(135deg,#dff4f0,#c8ebe6)',
                }"
              >
                <PropertyImage
                  :src="prop.imageUrl"
                  :alt="prop.addressLine1"
                  :show-caption="false"
                  class="prop-img"
                />
                <div class="prop-badge-pp">
                  <img
                    src="/op-icons/passportview/umu-passport.png"
                    alt=""
                    class="pp-emoji-ic"
                  />
                  Passport · {{ prop.passportCompletion ?? 0 }}%
                </div>
                <div class="prop-price-tag">
                  {{
                    prop.estimatedPrice
                      ? '£' + Math.round(prop.estimatedPrice).toLocaleString()
                      : 'POA'
                  }}
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-address">{{ prop.addressLine1 }}</div>
                <div class="prop-area">
                  {{
                    prop.city ? prop.city + ', ' + prop.postcode : prop.postcode
                  }}
                </div>
                <div class="prop-pills">
                  <span v-if="prop.propertyType" class="pill-grey">{{
                    prop.propertyType
                  }}</span>
                  <span v-if="prop.tenure" class="pill-grey">{{
                    prop.tenure
                  }}</span>
                </div>
                <div class="prop-footer">
                  <div v-if="prop.epcScore" class="prop-score-row">
                    <span class="prop-score-lbl">EPC</span>
                    <div class="prop-score-bar">
                      <div
                        class="prop-score-fill"
                        :style="{ width: prop.epcScore + '%' }"
                      ></div>
                    </div>
                    <span class="prop-score-num">{{ prop.epcScore }}</span>
                  </div>
                  <span class="prop-passport-btn">View Passport</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="verified-empty">
            <div class="verified-empty-ic">
              <img
                src="/op-icons/passportview/umu-passport.png"
                alt=""
                class="pp-emoji-big"
              />
            </div>
            <div class="verified-empty-title">Be among the first</div>
            <div class="verified-empty-sub">
              No verified passports nearby yet — claim yours and help shape a
              more transparent market.
            </div>
            <button class="verified-empty-btn" @click="navigateTo('/explore')">
              Start your Passport
            </button>
          </div>
        </template>

        <template v-else>
          <HealthPassportCards />

          <div class="feed-header" data-tour="verified-feed">
            <div class="feed-title">Verified passport properties</div>
            <div
              v-if="verifiedPassportDisplay.length"
              class="feed-see-all"
              @click="navigateTo('/explore')"
            >
              See all
            </div>
          </div>
          <div class="feed-sub">
            These sellers have already verified their home. Full records, fewer
            surprises.
          </div>

          <div v-if="loadingVerifiedPassports" class="skeletons">
            <div v-for="n in 3" :key="n" class="skeleton-card" />
          </div>
          <div v-else-if="verifiedPassportDisplay.length" class="horiz-feed">
            <div
              v-for="prop in verifiedPassportDisplay"
              :key="prop.id"
              class="prop-card prop-card-horiz"
              @click="navigateTo('/property/' + prop.id)"
            >
              <div
                class="prop-img-wrap"
                :style="{
                  background: 'linear-gradient(135deg,#dff4f0,#c8ebe6)',
                }"
              >
                <PropertyImage
                  :src="prop.imageUrl"
                  :alt="prop.addressLine1"
                  :show-caption="false"
                  class="prop-img"
                />
                <div class="prop-badge-pp">
                  <img
                    src="/op-icons/passportview/umu-passport.png"
                    alt=""
                    class="pp-emoji-ic"
                  />
                  Passport · {{ prop.passportCompletion ?? 0 }}%
                </div>
                <div class="prop-price-tag">
                  {{
                    prop.estimatedPrice
                      ? '£' + Math.round(prop.estimatedPrice).toLocaleString()
                      : 'POA'
                  }}
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-address">{{ prop.addressLine1 }}</div>
                <div class="prop-area">
                  {{
                    prop.city ? prop.city + ', ' + prop.postcode : prop.postcode
                  }}
                </div>
                <div class="prop-pills">
                  <span v-if="prop.propertyType" class="pill-grey">{{
                    prop.propertyType
                  }}</span>
                  <span v-if="prop.tenure" class="pill-grey">{{
                    prop.tenure
                  }}</span>
                </div>
                <div class="prop-footer">
                  <div v-if="prop.epcScore" class="prop-score-row">
                    <span class="prop-score-lbl">EPC</span>
                    <div class="prop-score-bar">
                      <div
                        class="prop-score-fill"
                        :style="{ width: prop.epcScore + '%' }"
                      ></div>
                    </div>
                    <span class="prop-score-num">{{ prop.epcScore }}</span>
                  </div>
                  <span class="prop-passport-btn">View Passport</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="verified-empty">
            <div class="verified-empty-ic">
              <img
                src="/op-icons/passportview/umu-passport.png"
                alt=""
                class="pp-emoji-big"
              />
            </div>
            <div class="verified-empty-title">Be among the first</div>
            <div class="verified-empty-sub">
              No verified passports nearby yet — claim yours and help shape a
              more transparent market.
            </div>
            <button class="verified-empty-btn" @click="navigateTo('/explore')">
              Start your Passport
            </button>
          </div>
        </template>
      </template>

      <template v-else>
        <template v-if="role === 'sell'">
          <div
            v-if="loadingPassport"
            class="skeleton-card"
            style="height: 110px; margin-bottom: 14px"
          />
          <div
            v-else-if="passports.length"
            class="passport-status-card"
            data-tour="passport-status"
            @click="navigateTo('/passportview/' + passports[0].id)"
          >
            <div class="psc-glow"></div>
            <div class="psc-main" style="position: relative; z-index: 1">
              <div class="psc-left">
                <div class="psc-icon-box">
                  <svg width="26" height="26" viewBox="0 0 877.69 877.69">
                    <circle
                      fill="rgba(255,255,255,0.1)"
                      cx="438.85"
                      cy="438.85"
                      r="438.85"
                    />
                    <path
                      fill="#fff"
                      d="m573.6,497.11v21.8h-39.28l-.22-20.26c0-34.14-14.14-48.26-38.03-48.26s-38.03,14.12-38.03,48.26v41.36h-39.01v-42.9c0-52.88,28.77-82.14,77.29-82.14s77.29,29.26,77.29,82.14Z"
                    />
                    <path
                      fill="#fff"
                      d="m379.84,415.26c48.52,0,77.29,29.26,77.29,82.14v42.9s-39.01,0-39.01,0v-41.36c0-34.14-13.9-48.26-38.03-48.26-23.89,0-38.03,14.12-38.03,48.26l-.15,20.26h-39.24s-.1-21.8-.1-21.8c0-52.88,28.77-82.14,77.29-82.14Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m689.16,439c-.03-11.46-8.86-20.75-19.76-20.75s-19.76,9.32-19.76,20.81h.04v92.38c0,34.14-14.14,48.26-38.03,48.26s-38.03-14.12-38.03-48.26v-12.54h-39.32v14.08c0,52.88,29.07,82.14,77.59,82.14s77.28-29.26,77.28-82.14v-93.98h-.02Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m187.37,439c.03-11.46,8.86-20.75,19.76-20.75,10.91,0,19.76,9.32,19.76,20.81h-.04v92.38c0,34.14,14.14,48.26,38.03,48.26,24.14,0,37.79-14.12,37.79-48.26v-12.54s39.25,0,39.25,0v14.08c0,52.88-28.77,82.14-77.29,82.14-48.52,0-77.28-29.26-77.28-82.14v-93.98s.02,0,.02,0Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m677.57,352.22l-226.28-134.71c-3.1-1.81-6.69-2.82-10.34-2.91h-.57l-.39-1.48h-.54c-3.68.1-7.26,1.11-10.38,2.93l-157.5,93.76v-16.4c0-10.74-9.3-19.48-20.72-19.48s-20.72,8.74-20.72,19.48v41.08l-27.33,16.27c-9.7,5.67-12.68,17.71-6.64,26.83,6.03,9.12,18.84,11.92,28.55,6.24l215.48-128.28,215.49,128.29c3.33,1.95,7.08,2.95,10.91,2.95,1.58,0,3.17-.17,4.74-.51,5.39-1.18,9.97-4.26,12.9-8.68,6.03-9.12,3.05-21.15-6.64-26.82Z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="psc-label-small">Property Passport</div>
                  <div class="psc-address">
                    {{ passports[0].address || passports[0].addressLine1 }}
                  </div>
                  <div class="psc-postcode">{{ passports[0].postcode }}</div>
                </div>
              </div>
              <div class="psc-gauge">
                <svg width="54" height="34" viewBox="0 0 58 36">
                  <path
                    d="M 7 34 A 24 24 0 0 1 51 34"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M 7 34 A 24 24 0 0 1 51 34"
                    fill="none"
                    stroke="#3dbda3"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-dasharray="75.4"
                    :stroke-dashoffset="passportDashoffset"
                  />
                </svg>
                <div class="psc-gauge-num">{{ passportScore }}</div>
                <div class="psc-gauge-lbl">Score</div>
              </div>
            </div>
            <div class="psc-footer" style="position: relative; z-index: 1">
              <div class="psc-footer-stats">
                <span class="psc-stat"
                  >Complete
                  <strong
                    >{{ passports[0].completionPercentage ?? 0 }}%</strong
                  ></span
                >
                <span v-if="passportDaysActive" class="psc-stat"
                  >Day <strong>{{ passportDaysActive }}</strong></span
                >
              </div>
              <div class="psc-view-cta">View Passport</div>
            </div>
          </div>
          <div
            v-else
            class="no-passport-card"
            data-tour="passport-status"
            @click="startClaimFlow"
          >
            <div class="no-pp-icon">📋</div>
            <div class="no-pp-body">
              <div class="no-pp-title">No passport yet</div>
              <div class="no-pp-sub">
                Search for your property to claim your first Passport
              </div>
            </div>
            <div class="no-pp-cta">Claim</div>
          </div>

          <div
            class="next-action-card"
            data-tour="next-action"
            @click="
              navigateTo(
                passports.length
                  ? '/passportview/' + passports[0].id
                  : '/explore',
              )
            "
          >
            <div class="na-icon">⚡</div>
            <div class="na-body">
              <div class="na-title">{{ nextActionLabel }}</div>
              <div class="na-sub">{{ nextActionSub }}</div>
            </div>
            <div class="na-cta">Add</div>
          </div>

          <HealthPassportCards />

          <div class="pro-dark-card" data-tour="pro-card" @click="navigateTo('/explore')">
            <div class="pro-dark-icon">🔧</div>
            <div class="pro-dark-body">
              <div class="pro-dark-title">Book a gas safety check</div>
              <div class="pro-dark-sub">
                Cert lands in your Passport automatically
              </div>
            </div>
            <div class="pro-dark-badge">Book</div>
          </div>
        </template>

        <template v-else-if="role === 'buy'">
          <div v-if="hasSavedSearch" class="saved-search-card" data-tour="saved-search">
            <div class="saved-search-top">
              <div style="font-size: 15px; font-weight: 700; color: #231d45">
                Your saved search
              </div>
              <div
                style="
                  font-size: 12px;
                  font-weight: 700;
                  color: #00a19a;
                  cursor: pointer;
                "
                @click="navigateTo('/profile')"
              >
                Edit
              </div>
            </div>
            <div class="saved-search-pills">
              <span
                v-for="pill in savedSearchPills"
                :key="pill"
                class="pill-brand"
                >{{ pill }}</span
              >
            </div>
            <div
              v-if="properties.length"
              style="margin-top: 10px; font-size: 13px; color: #4a5568"
            >
              <strong style="color: #231d45"
                >{{ properties.length }}
                {{ properties.length === 1 ? 'match' : 'matches' }}</strong
              >
              for your preferences
            </div>
          </div>
          <div
            v-else
            class="saved-search-card saved-search-card--empty"
            data-tour="saved-search"
            @click="navigateTo('/profile')"
          >
            <div class="saved-search-top">
              <div style="font-size: 15px; font-weight: 700; color: #231d45">
                Set up your search
              </div>
              <div
                style="
                  font-size: 12px;
                  font-weight: 700;
                  color: #00a19a;
                  cursor: pointer;
                "
              >
                Add →
              </div>
            </div>
            <div style="font-size: 13px; color: #4a5568; line-height: 1.5">
              Tell us your area, budget and must-haves. We'll match you to homes
              that fit.
            </div>
          </div>

          <HealthPassportCards />

          <!-- Published Buyer Profile quick-access card -->
          <div
            v-if="buyerProfilePublished"
            class="my-passport-card my-passport-card--published"
            data-tour="buyer-profile"
            @click="navigateTo('/buyer-profile/view')"
          >
            <div class="my-passport-ic">✓</div>
            <div class="my-passport-body">
              <div class="my-passport-title">Buyer Profile · Published</div>
              <div class="my-passport-sub">Tap to view or share with sellers</div>
            </div>
            <div class="my-passport-arrow">→</div>
          </div>

          <!-- My Buyer Profile entry card (build) -->
          <div
            v-else
            class="my-passport-card"
            data-tour="buyer-profile"
            @click="navigateTo('/buyer-profile')"
          >
            <div class="my-passport-ic">👤</div>
            <div class="my-passport-body">
              <div class="my-passport-title">My Buyer Profile</div>
              <div class="my-passport-sub">
                Prove you're a verified buyer — share with any agent or seller
              </div>
            </div>
            <div class="my-passport-arrow">→</div>
          </div>

          <div v-if="pulseHasAny || marketPulseLoading" class="market-pulse-card" data-tour="market-pulse">
            <div
              style="
                font-size: 15px;
                font-weight: 700;
                color: #1f2024;
                margin-bottom: 8px;
              "
            >
              Market pulse<template v-if="pulseArea"> · {{ pulseArea }}</template>
            </div>
            <div v-if="marketPulseLoading && !pulseHasAny" class="pulse-grid">
              <div class="pulse-cell">
                <div class="pulse-val">—</div>
                <div class="pulse-lbl">loading</div>
              </div>
            </div>
            <div v-else class="pulse-grid">
              <div v-if="pulseDays !== null" class="pulse-cell">
                <div class="pulse-val">{{ pulseDays }}</div>
                <div class="pulse-lbl">avg days to sell</div>
              </div>
              <div v-if="pulseYoY !== null" class="pulse-cell">
                <div class="pulse-val" :style="{ color: pulseYoYColor }">{{ pulseYoY }}</div>
                <div class="pulse-lbl">price change YoY</div>
              </div>
              <div v-if="pulseListings !== null" class="pulse-cell">
                <div class="pulse-val">{{ pulseListings }}</div>
                <div class="pulse-lbl">passport listings</div>
              </div>
            </div>
          </div>

          <div class="feed-header" data-tour="foryou-feed" style="margin-top: 4px">
            <div class="feed-title">For You</div>
            <div class="feed-see-all" @click="navigateTo('/explore')">All</div>
          </div>
          <div v-if="loadingProperties" class="skeletons">
            <div v-for="n in 3" :key="n" class="skeleton-card" />
          </div>
          <div v-else-if="displayProperties.length" class="horiz-feed">
            <div
              v-for="prop in displayProperties"
              :key="prop.id"
              class="prop-card prop-card-horiz"
              @click="navigateTo('/property/' + prop.id)"
            >
              <div
                class="prop-img-wrap"
                :style="{
                  background: 'linear-gradient(135deg,#dff4f0,#c8ebe6)',
                }"
              >
                <PropertyImage
                  :src="prop.imageUrl || prop.image"
                  :alt="prop.addressLine1 || prop.address"
                  :show-caption="false"
                  class="prop-img"
                />
                <div v-if="prop.hasPassport" class="prop-badge-pp">
                  <img
                    src="/op-icons/passportview/umu-passport.png"
                    alt=""
                    class="pp-emoji-ic"
                  />
                  Passport
                </div>
                <div class="prop-price-tag">
                  {{
                    prop.estimatedPrice
                      ? '£' + Math.round(prop.estimatedPrice).toLocaleString()
                      : prop.priceDisplay || 'POA'
                  }}
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-address">
                  {{ prop.addressLine1 || prop.address }}
                </div>
                <div class="prop-area">
                  {{
                    prop.city
                      ? prop.city + ', ' + prop.postcode
                      : prop.area || prop.postcode || ''
                  }}
                </div>
                <div class="prop-pills">
                  <span
                    v-if="prop.propertyType || prop.type"
                    class="pill-grey"
                    >{{ prop.propertyType || prop.type }}</span
                  >
                  <span v-if="prop.tenure" class="pill-grey">{{
                    prop.tenure
                  }}</span>
                </div>
                <div class="prop-footer">
                  <div v-if="prop.epcScore" class="prop-score-row">
                    <span class="prop-score-lbl">EPC</span>
                    <div class="prop-score-bar">
                      <div
                        class="prop-score-fill"
                        :style="{ width: prop.epcScore + '%' }"
                      ></div>
                    </div>
                    <span class="prop-score-num">{{ prop.epcScore }}</span>
                  </div>
                  <span class="prop-passport-btn">View</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="needsPostcode" class="foryou-empty">
            <div class="foryou-empty-ic">📍</div>
            <div class="foryou-empty-title">Add a postcode to see matches</div>
            <div class="foryou-empty-sub">
              We'll tailor properties to your budget, preferred types and
              must-have features.
            </div>
            <button class="foryou-empty-btn" @click="navigateTo('/profile')">
              Set postcode
            </button>
          </div>
          <div v-else class="foryou-empty">
            <div class="foryou-empty-ic">🔍</div>
            <div class="foryou-empty-title">No matches yet</div>
            <div class="foryou-empty-sub">
              Nothing in your area matches your saved preferences. Try
              broadening your filters or refreshing your postcode.
            </div>
            <button class="foryou-empty-btn" @click="navigateTo('/profile')">
              Update preferences
            </button>
          </div>
        </template>

        <template v-else-if="role === 'both'">
          <div
            v-if="loadingPassport"
            class="skeleton-card"
            style="height: 110px; margin-bottom: 14px"
          />
          <div
            v-else-if="passports.length"
            class="passport-status-card"
            data-tour="passport-status"
            @click="navigateTo('/passportview/' + passports[0].id)"
          >
            <div class="psc-glow"></div>
            <div class="psc-main" style="position: relative; z-index: 1">
              <div class="psc-left">
                <div class="psc-icon-box">
                  <svg width="26" height="26" viewBox="0 0 877.69 877.69">
                    <circle
                      fill="rgba(255,255,255,0.1)"
                      cx="438.85"
                      cy="438.85"
                      r="438.85"
                    />
                    <path
                      fill="#fff"
                      d="m573.6,497.11v21.8h-39.28l-.22-20.26c0-34.14-14.14-48.26-38.03-48.26s-38.03,14.12-38.03,48.26v41.36h-39.01v-42.9c0-52.88,28.77-82.14,77.29-82.14s77.29,29.26,77.29,82.14Z"
                    />
                    <path
                      fill="#fff"
                      d="m379.84,415.26c48.52,0,77.29,29.26,77.29,82.14v42.9s-39.01,0-39.01,0v-41.36c0-34.14-13.9-48.26-38.03-48.26-23.89,0-38.03,14.12-38.03,48.26l-.15,20.26h-39.24s-.1-21.8-.1-21.8c0-52.88,28.77-82.14,77.29-82.14Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m689.16,439c-.03-11.46-8.86-20.75-19.76-20.75s-19.76,9.32-19.76,20.81h.04v92.38c0,34.14-14.14,48.26-38.03,48.26s-38.03-14.12-38.03-48.26v-12.54h-39.32v14.08c0,52.88,29.07,82.14,77.59,82.14s77.28-29.26,77.28-82.14v-93.98h-.02Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m187.37,439c.03-11.46,8.86-20.75,19.76-20.75,10.91,0,19.76,9.32,19.76,20.81h-.04v92.38c0,34.14,14.14,48.26,38.03,48.26,24.14,0,37.79-14.12,37.79-48.26v-12.54s39.25,0,39.25,0v14.08c0,52.88-28.77,82.14-77.29,82.14-48.52,0-77.28-29.26-77.28-82.14v-93.98s.02,0,.02,0Z"
                    />
                    <path
                      fill="#3dbda3"
                      d="m677.57,352.22l-226.28-134.71c-3.1-1.81-6.69-2.82-10.34-2.91h-.57l-.39-1.48h-.54c-3.68.1-7.26,1.11-10.38,2.93l-157.5,93.76v-16.4c0-10.74-9.3-19.48-20.72-19.48s-20.72,8.74-20.72,19.48v41.08l-27.33,16.27c-9.7,5.67-12.68,17.71-6.64,26.83,6.03,9.12,18.84,11.92,28.55,6.24l215.48-128.28,215.49,128.29c3.33,1.95,7.08,2.95,10.91,2.95,1.58,0,3.17-.17,4.74-.51,5.39-1.18,9.97-4.26,12.9-8.68,6.03-9.12,3.05-21.15-6.64-26.82Z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="psc-label-small">Property Passport</div>
                  <div class="psc-address">
                    {{ passports[0].address || passports[0].addressLine1 }}
                  </div>
                  <div class="psc-postcode">{{ passports[0].postcode }}</div>
                </div>
              </div>
              <div class="psc-gauge">
                <svg width="54" height="34" viewBox="0 0 58 36">
                  <path
                    d="M 7 34 A 24 24 0 0 1 51 34"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M 7 34 A 24 24 0 0 1 51 34"
                    fill="none"
                    stroke="#3dbda3"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-dasharray="75.4"
                    :stroke-dashoffset="passportDashoffset"
                  />
                </svg>
                <div class="psc-gauge-num">{{ passportScore }}</div>
                <div class="psc-gauge-lbl">Score</div>
              </div>
            </div>
            <div class="psc-footer" style="position: relative; z-index: 1">
              <div class="psc-footer-stats">
                <span class="psc-stat"
                  >Complete
                  <strong
                    >{{ passports[0].completionPercentage ?? 0 }}%</strong
                  ></span
                >
                <span v-if="passportDaysActive" class="psc-stat"
                  >Day <strong>{{ passportDaysActive }}</strong></span
                >
              </div>
              <div class="psc-view-cta">View Passport</div>
            </div>
          </div>
          <div
            v-else
            class="no-passport-card"
            data-tour="passport-status"
            @click="startClaimFlow"
          >
            <div class="no-pp-icon">📋</div>
            <div class="no-pp-body">
              <div class="no-pp-title">No passport yet</div>
              <div class="no-pp-sub">
                Search for your property to claim your first Passport
              </div>
            </div>
            <div class="no-pp-cta">Claim</div>
          </div>

          <div
            v-if="hasSavedSearch"
            class="saved-search-compact"
            @click="navigateTo('/profile')"
          >
            <div style="font-size: 22px; flex-shrink: 0">🔍</div>
            <div style="flex: 1; min-width: 0">
              <div
                style="
                  font-size: 14px;
                  font-weight: 700;
                  color: #231d45;
                  margin-bottom: 2px;
                "
              >
                {{
                  properties.length
                    ? properties.length + ' matches on your buy search'
                    : 'Your buy search'
                }}
              </div>
              <div
                style="
                  font-size: 13px;
                  color: #4a5568;
                  line-height: 1.4;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                {{ savedSearchSummary }}
              </div>
            </div>
            <div
              style="
                font-size: 13px;
                font-weight: 700;
                color: #00a19a;
                flex-shrink: 0;
              "
            >
              Edit
            </div>
          </div>
          <div
            v-else
            class="saved-search-compact"
            @click="navigateTo('/profile')"
          >
            <div style="font-size: 22px; flex-shrink: 0">📍</div>
            <div style="flex: 1; min-width: 0">
              <div
                style="
                  font-size: 14px;
                  font-weight: 700;
                  color: #231d45;
                  margin-bottom: 2px;
                "
              >
                Set your buy preferences
              </div>
              <div style="font-size: 13px; color: #4a5568; line-height: 1.4">
                Area, budget, property type — we'll find matches.
              </div>
            </div>
            <div
              style="
                font-size: 13px;
                font-weight: 700;
                color: #00a19a;
                flex-shrink: 0;
              "
            >
              Set up
            </div>
          </div>

          <HealthPassportCards />

          <div class="feed-header" data-tour="foryou-feed" style="margin-top: 4px">
            <div class="feed-title">For You</div>
            <div class="feed-see-all" @click="navigateTo('/explore')">All</div>
          </div>
          <div v-if="loadingProperties" class="skeletons">
            <div v-for="n in 3" :key="n" class="skeleton-card" />
          </div>
          <div v-else-if="displayProperties.length" class="horiz-feed">
            <div
              v-for="prop in displayProperties"
              :key="prop.id"
              class="prop-card prop-card-horiz"
              @click="navigateTo('/property/' + prop.id)"
            >
              <div
                class="prop-img-wrap"
                :style="{
                  background: 'linear-gradient(135deg,#dff4f0,#c8ebe6)',
                }"
              >
                <PropertyImage
                  :src="prop.imageUrl || prop.image"
                  :alt="prop.addressLine1 || prop.address"
                  :show-caption="false"
                  class="prop-img"
                />
                <div v-if="prop.hasPassport" class="prop-badge-pp">
                  <img
                    src="/op-icons/passportview/umu-passport.png"
                    alt=""
                    class="pp-emoji-ic"
                  />
                  Passport
                </div>
                <div class="prop-price-tag">
                  {{
                    prop.estimatedPrice
                      ? '£' + Math.round(prop.estimatedPrice).toLocaleString()
                      : prop.priceDisplay || 'POA'
                  }}
                </div>
              </div>
              <div class="prop-body">
                <div class="prop-address">
                  {{ prop.addressLine1 || prop.address }}
                </div>
                <div class="prop-area">
                  {{
                    prop.city
                      ? prop.city + ', ' + prop.postcode
                      : prop.area || prop.postcode || ''
                  }}
                </div>
                <div class="prop-pills">
                  <span
                    v-if="prop.propertyType || prop.type"
                    class="pill-grey"
                    >{{ prop.propertyType || prop.type }}</span
                  >
                  <span v-if="prop.tenure" class="pill-grey">{{
                    prop.tenure
                  }}</span>
                </div>
                <div class="prop-footer">
                  <div v-if="prop.epcScore" class="prop-score-row">
                    <span class="prop-score-lbl">EPC</span>
                    <div class="prop-score-bar">
                      <div
                        class="prop-score-fill"
                        :style="{ width: prop.epcScore + '%' }"
                      ></div>
                    </div>
                    <span class="prop-score-num">{{ prop.epcScore }}</span>
                  </div>
                  <span class="prop-passport-btn">View</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="needsPostcode" class="foryou-empty">
            <div class="foryou-empty-ic">📍</div>
            <div class="foryou-empty-title">Add a postcode to see matches</div>
            <div class="foryou-empty-sub">
              We'll tailor properties to your budget, preferred types and
              must-have features.
            </div>
            <button class="foryou-empty-btn" @click="navigateTo('/profile')">
              Set postcode
            </button>
          </div>
          <div v-else class="foryou-empty">
            <div class="foryou-empty-ic">🔍</div>
            <div class="foryou-empty-title">No matches yet</div>
            <div class="foryou-empty-sub">
              Nothing in your area matches your saved preferences. Try
              broadening your filters or refreshing your postcode.
            </div>
            <button class="foryou-empty-btn" @click="navigateTo('/profile')">
              Update preferences
            </button>
          </div>
        </template>

        <template v-else-if="role === 'landlord'">
          <div class="portfolio-card">
            <div class="portfolio-glow"></div>
            <div style="position: relative; z-index: 1">
              <div class="portfolio-eyebrow">Your portfolio</div>
              <div class="portfolio-stats-row">
                <div style="text-align: center">
                  <div style="font-size: 20px; font-weight: 800; color: #fff">
                    {{ passports.length || 3 }}
                  </div>
                  <div
                    style="
                      font-size: 11px;
                      color: rgba(255, 255, 255, 0.4);
                      margin-top: 2px;
                    "
                  >
                    Properties
                  </div>
                </div>
                <div style="text-align: center">
                  <div
                    style="font-size: 20px; font-weight: 800; color: #4ade80"
                  >
                    {{ portfolioCompliant }}
                  </div>
                  <div
                    style="
                      font-size: 11px;
                      color: rgba(255, 255, 255, 0.4);
                      margin-top: 2px;
                    "
                  >
                    Compliant
                  </div>
                </div>
                <div style="text-align: center">
                  <div
                    style="font-size: 20px; font-weight: 800; color: #f87171"
                  >
                    {{ portfolioActionNeeded }}
                  </div>
                  <div
                    style="
                      font-size: 11px;
                      color: rgba(255, 255, 255, 0.4);
                      margin-top: 2px;
                    "
                  >
                    Action needed
                  </div>
                </div>
              </div>

              <div
                v-if="portfolioActionNeeded > 0 && portfolioAlertAddress"
                class="portfolio-alert"
              >
                <div style="font-size: 16px">⚠️</div>
                <div style="flex: 1">
                  <div
                    style="
                      font-size: 13px;
                      font-weight: 700;
                      color: #fca5a5;
                      margin-bottom: 1px;
                    "
                  >
                    Action needed on {{ portfolioAlertAddress }}
                  </div>
                  <div
                    style="font-size: 12px; color: rgba(255, 255, 255, 0.45)"
                  >
                    Rental Passport
                  </div>
                </div>
                <div
                  style="
                    font-size: 12px;
                    font-weight: 700;
                    color: #f5c44c;
                    flex-shrink: 0;
                    cursor: pointer;
                  "
                  @click.stop="navigateTo('/explore')"
                >
                  Book
                </div>
              </div>

              <template v-if="passports.length">
                <div
                  v-for="p in passports"
                  :key="p.id"
                  class="portfolio-prop-row"
                  @click="navigateTo('/passportview/' + p.id)"
                >
                  <div style="flex: 1; min-width: 0">
                    <div
                      style="
                        font-size: 14px;
                        font-weight: 700;
                        color: #fff;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                    >
                      {{ p.address || p.addressLine1 }}
                    </div>
                    <div
                      style="font-size: 12px; color: rgba(255, 255, 255, 0.4)"
                    >
                      Rental Passport
                    </div>
                  </div>
                  <div
                    :style="{
                      fontSize: '10px',
                      fontWeight: '700',
                      color:
                        (p.completionPercentage ?? 0) >= 80
                          ? '#4ade80'
                          : '#f87171',
                      flexShrink: '0',
                      marginRight: '6px',
                    }"
                  >
                    {{
                      (p.completionPercentage ?? 0) >= 80
                        ? 'Compliant'
                        : 'Action needed'
                    }}
                  </div>
                  <div
                    style="
                      font-size: 15px;
                      font-weight: 800;
                      color: #fff;
                      flex-shrink: 0;
                      width: 28px;
                      text-align: right;
                    "
                  >
                    {{ Math.round((p.completionPercentage ?? 0) * 0.9) }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div
                  class="portfolio-prop-row"
                  style="justify-content: center; padding: 16px 0"
                  @click="startClaimFlow"
                >
                  <div style="text-align: center">
                    <div
                      style="
                        font-size: 14px;
                        font-weight: 700;
                        color: #fff;
                        margin-bottom: 4px;
                      "
                    >
                      No rental passports yet
                    </div>
                    <div
                      style="font-size: 12px; color: rgba(255, 255, 255, 0.5)"
                    >
                      Claim your first property Passport to see compliance
                      tracking here.
                    </div>
                  </div>
                </div>
              </template>

              <div
                style="
                  margin-top: 10px;
                  font-size: 12px;
                  font-weight: 700;
                  color: rgba(255, 255, 255, 0.5);
                  text-align: center;
                  cursor: pointer;
                "
                @click="navigateTo('/passport')"
              >
                View all in Passport tab
              </div>
            </div>
          </div>

          <HealthPassportCards />

          <div class="pro-dark-card" @click="navigateTo('/explore')">
            <div class="pro-dark-icon">🔧</div>
            <div class="pro-dark-body">
              <div class="pro-dark-title">Book a gas safety engineer</div>
              <div class="pro-dark-sub">Cert auto-lands in your Passport</div>
            </div>
            <div class="pro-dark-badge">Book</div>
          </div>

          <div class="add-property-card" @click="startClaimFlow">
            <div style="font-size: 22px; flex-shrink: 0">➕</div>
            <div style="flex: 1">
              <div
                style="
                  font-size: 14px;
                  font-weight: 700;
                  color: #231d45;
                  margin-bottom: 2px;
                "
              >
                Add another property
              </div>
              <div style="font-size: 13px; color: #4a5568">
                Verify ownership, then choose Rental or Seller Passport
              </div>
            </div>
            <div
              style="
                font-size: 13px;
                font-weight: 700;
                color: #00a19a;
                flex-shrink: 0;
              "
            >
              Add
            </div>
          </div>
        </template>
      </template>
      </div>
    </div>

    <footer v-if="showLegacyExploreLayout" class="explore-footer">
      <div class="explore-web-shell explore-footer-grid">
        <div class="footer-intro">
          <div class="footer-brand">
            <span class="brand-dot" />
            <strong>umovingu</strong>
          </div>
          <span class="footer-chip">Built for UK property journeys</span>
          <p>
            Professional property intelligence for sellers, buyers, and landlords.
            Start with HomeScore and progress with confidence.
          </p>
          <button type="button" class="footer-cta" @click="navigateTo('/homescore')">Run a HomeScore check</button>
        </div>

        <div>
          <h3><span class="footer-hicon footer-hicon--product" aria-hidden="true" />Product</h3>
          <ul>
            <li><button type="button" @click="navigateTo('/homescore')">HomeScore</button></li>
            <li><button type="button" @click="navigateTo('/passport/collections')">Property Passport</button></li>
            <li><button type="button" @click="navigateTo('/marketplace')">Marketplace</button></li>
          </ul>
        </div>

        <div>
          <h3><span class="footer-hicon footer-hicon--legal" aria-hidden="true" />Legal</h3>
          <ul>
            <li><button type="button" @click="navigateTo('/legal/privacy')">Privacy</button></li>
            <li><button type="button" @click="navigateTo('/legal/terms')">Terms</button></li>
            <li><button type="button" @click="navigateTo('/legal/cookies')">Cookies</button></li>
          </ul>
        </div>

        <div>
          <h3><span class="footer-hicon footer-hicon--account" aria-hidden="true" />Account</h3>
          <ul>
            <li><button type="button" @click="navigateTo('/profile')">Profile</button></li>
            <li><button type="button" @click="navigateTo('/onboarding/signin')">Sign in</button></li>
          </ul>
        </div>
      </div>
      <div class="explore-web-shell explore-footer-bottom">© 2026 UMU. All rights reserved.</div>
    </footer>

    <!-- First-visit guided tour — replays from the "?" button in the hero -->
    <OnboardingTour
      ref="exploreTourRef"
      :steps="exploreTourSteps"
      storage-key="umu_tour_explore_v1"
    />

    <!-- Unified Distance + Filters Bottom Sheet (prototype-exact).
         Single source of truth for radius AND all other filters. Uses a
         draft/committed pattern: edits inside the sheet only affect the
         page after the user taps Apply. -->
    <Teleport to="body">
      <div
        class="sheet-backdrop"
        :class="{ open: showFilters }"
        @click="closeFilterSheet"
      />
      <div class="sheet" :class="{ open: showFilters }" role="dialog" aria-modal="true">
        <div class="sheet-grabber-wrap" @click="closeFilterSheet">
          <div class="sheet-grabber" />
        </div>
        <div class="sheet-head">
          <div class="sheet-title">Distance &amp; filters</div>
          <button
            class="sheet-reset"
            :disabled="isDraftDefault"
            @click="resetDraft"
          >
            Reset
          </button>
        </div>
        <div class="sheet-body">
          <!-- DISTANCE -->
          <div class="sheet-section">
            <div class="sheet-section-h">
              <div class="sheet-section-title">Search radius</div>
              <div class="sheet-section-value">
                {{ distLabelLong(draft.distance) }}
              </div>
            </div>
            <div class="dist-list">
              <div
                v-for="opt in distanceOptions"
                :key="opt.value === null ? 'exact' : opt.value"
                class="dist-row"
                :class="{ active: draft.distance === opt.value }"
                @click="draft.distance = opt.value"
              >
                <span class="dist-radio" />
                <span class="dist-label-wrap">
                  <span class="dist-label">{{ opt.label }}</span>
                  <span class="dist-hint">{{ opt.hint }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- PROPERTY TYPE -->
          <div class="sheet-section">
            <div class="sheet-section-h">
              <div class="sheet-section-title">Property type</div>
            </div>
            <div class="chip-group">
              <button
                v-for="opt in propertyTypeOptions"
                :key="opt.value"
                class="chip"
                :class="{ active: isPtypeActive(opt.value) }"
                @click="togglePtype(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- BEDROOMS -->
          <div class="sheet-section">
            <div class="sheet-section-h">
              <div class="sheet-section-title">Bedrooms (min)</div>
            </div>
            <div class="chip-group">
              <button
                v-for="opt in bedsOptions"
                :key="opt.value === null ? 'any' : opt.value"
                class="chip"
                :class="{ active: draft.beds === opt.value }"
                @click="draft.beds = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- EPC -->
          <div class="sheet-section">
            <div class="sheet-section-h">
              <div class="sheet-section-title">EPC rating (min)</div>
            </div>
            <div class="chip-group">
              <button
                class="chip"
                :class="{ active: draft.epc === null }"
                @click="draft.epc = null"
              >
                Any
              </button>
              <button
                v-for="opt in epcOptions"
                :key="opt.value"
                class="chip epc-chip"
                :class="{ active: draft.epc === opt.value }"
                @click="draft.epc = opt.value"
              >
                <span
                  class="epc-tile"
                  :style="{ background: opt.color }"
                >{{ opt.value }}</span>
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- HEALTHSCORE SLIDER -->
          <div class="sheet-section">
            <div class="sheet-section-h">
              <div class="sheet-section-title">HomeScore (min)</div>
              <div class="sheet-section-value">
                {{ draft.hs === 0 ? 'Any' : draft.hs + '+' }}
              </div>
            </div>
            <div class="slider-row">
              <input
                type="range"
                class="slider"
                min="0"
                max="90"
                step="5"
                :value="draft.hs"
                :style="{ '--fill': (draft.hs / 90 * 100) + '%' }"
                @input="onHsInput(($event.target as HTMLInputElement).value)"
              />
              <div class="slider-scale">
                <span>Any</span><span>30</span><span>50</span><span>70</span><span>90</span>
              </div>
            </div>
          </div>

          <!-- PASSPORT TOGGLE -->
          <div class="sheet-section">
            <div class="toggle-row" @click="draft.passport = !draft.passport">
              <div class="tr-text">
                <div class="tr-title">Verified Passport only</div>
                <div class="tr-sub">
                  Show only properties with a full solicitor-grade Passport.
                </div>
              </div>
              <div class="toggle" :class="{ on: draft.passport }" />
            </div>
          </div>

          <div style="height: 8px" />
        </div>
        <div class="sheet-foot">
          <button class="sheet-cancel" @click="closeFilterSheet">Cancel</button>
          <button class="sheet-apply" @click="applyDraft">
            <span>Apply</span>
            <span v-if="draftFilterCount > 0" class="count">{{ draftFilterCount }}</span>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import OnboardingTour from '~/components/ui/OnboardingTour.vue'

// Guided tour wiring — replays via the "?" button in the hero, auto-runs
// once per browser via storageKey on the OnboardingTour component.
const exploreTourRef = ref<any>(null)
// Full Explore tour. Steps whose target isn't on screen (e.g. seller-only
// banner when the user signed up as a buyer) are auto-skipped by
// OnboardingTour — so one list covers every variant of this page.
const exploreTourSteps = [
  {
    selector: '.search-wrap',
    title: 'Search any UK property',
    body: 'Type a postcode, address or area. Properties with a verified Passport surface to the top.',
  },
  {
    selector: '[data-tour="filter-pill"]',
    title: 'Distance & filters',
    body: 'Tap the pill next to Search to set radius (Exact → 10 miles) and narrow by property type, bedrooms, EPC, HomeScore or Passport status — all in one place.',
  },
  {
    selector: '[data-tour="avatar"]',
    title: 'Your account',
    body: 'Tap your avatar to manage your profile, preferences, saved properties and account.',
  },
  {
    selector: '[data-tour="claim-banner"]',
    title: 'Claim your Property Passport',
    body: 'Verify your ownership, build your record, sell faster. £0 to get started — sellers see up to 12× faster exchanges.',
  },
  {
    selector: '[data-tour="passport-status"]',
    title: 'Your Property Passport',
    body: 'Track completion, jump back into the next missing section, and share with your agent or solicitor.',
  },
  {
    selector: '[data-tour="next-action"]',
    title: 'Your next step',
    body: 'The single most useful thing you can do right now to push your Passport forward.',
  },
  {
    selector: '[data-tour="saved-search"]',
    title: 'Saved search',
    body: 'Set your area, budget and must-haves once — we match new listings to you automatically.',
  },
  {
    selector: '[data-tour="buyer-profile"]',
    title: 'Your Buyer Profile',
    body: 'Prove you\'re a verified buyer (ID, funds, chain position). Share it with any seller or agent to stand out.',
  },
  {
    selector: '[data-tour="market-pulse"]',
    title: 'Market pulse',
    body: 'Days-on-market, year-on-year price movement and live Passport listings for your area — pulled from Land Registry.',
  },
  {
    selector: '.feat-card.homescore',
    title: 'HomeScore — free, 60 seconds',
    body: 'Bills, value, energy efficiency and street comparisons for any address — scored 0–100 from public records.',
  },
  {
    selector: '.feat-card.passport',
    title: 'See a sample Passport',
    body: 'Tap to see exactly what buyers, agents and solicitors get on a verified Property Passport.',
  },
  {
    selector: '[data-tour="pro-card"]',
    title: 'Book a Pro',
    body: 'Gas, EICR, EPC and other certs — book a vetted tradesperson; the certificate lands in your Passport automatically.',
  },
  {
    selector: '[data-tour="verified-feed"]',
    title: 'Verified Passport properties',
    body: 'Real homes with a published Passport — full records, EPC, planning history, fewer surprises.',
  },
  {
    selector: '[data-tour="foryou-feed"]',
    title: 'For You',
    body: 'Properties matched to your saved search — tap any card to see EPC, HomeScore and the full Passport (if published).',
  },
  {
    selector: '.prop-card',
    title: 'Tap any property',
    body: 'You\'ll see EPC, HomeScore and — for verified ones — the full Property Passport.',
  },
  {
    selector: '[data-tour="tour-btn"]',
    title: 'Replay this tour anytime',
    body: 'Tap the "?" button up here to walk through this again.',
  },
]
import HealthPassportCards from '~/components/explore/HealthPassportCards.vue'
import PropertyImage from '~/components/property/PropertyImage.vue'

definePageMeta({ title: 'Explore - UmovingU', middleware: 'auth' })

const config = useRuntimeConfig()
const { profile, fetchProfile } = useProfile()
const route = useRoute()
const pageReady = ref(false)
const mobileNavOpen = ref(false)
const showLegacyExploreLayout = ref(false)

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

watch(
  () => route.path,
  () => {
    mobileNavOpen.value = false
  },
)

// First-visit detection: the "New" view is shown ONLY on the user's first
// ever arrival at /explore (right after sign-up). Subsequent visits — even
// from the same session, after a refresh — always land on "Returning".
// We pre-set the flag synchronously here so a refresh during the same
// browser session promotes the user to Returning without flicker.
const EXPLORE_VISITED_KEY = 'umu_explore_visited_v1'
const view = ref<'new' | 'returning'>(
  (() => {
    if (typeof window === 'undefined') return 'returning'
    try {
      if (localStorage.getItem(EXPLORE_VISITED_KEY)) return 'returning'
      localStorage.setItem(EXPLORE_VISITED_KEY, String(Date.now()))
      return 'new'
    } catch {
      // localStorage unavailable (private mode etc.) — degrade to Returning
      // so we never lock the user into the onboarding "new" view forever.
      return 'returning'
    }
  })(),
)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showDropdown = ref(false)
const selectedAddress = ref<any>(null)
// `activeRadius` remains the canonical "committed" radius so existing
// downstream call-sites (buildSearchUrl, etc.) keep working untouched.
// The new sheet edits a `draft` object and copies it into the committed
// refs below only when the user taps Apply.
const activeRadius = ref<number | null>(null)

const loadingPrefs = ref(true)
const loadingPassport = ref(true)
const loadingProperties = ref(true)

// Search mode
const searchMode = ref(false)
const searchProperties = ref<any[]>([])
const searchLoading = ref(false)
const searchTotal = ref(0)
const searchLoadingMore = ref(false)
const SEARCH_PAGE_SIZE = 20
const loadMoreSentinel = ref<HTMLElement | null>(null)
let loadMoreObserver: IntersectionObserver | null = null

// ── Unified filter sheet (prototype-exact) ──────────────────────
// Two-layer state:
//   * committed* — what the page actually filters by (drives the URL).
//   * draft.*    — what's being edited inside the open sheet.
// Cancel = throw away draft. Apply = copy draft → committed and refresh.
const showFilters = ref(false)

const committedPtype = ref<string[]>(['any'])
const committedBeds = ref<number | null>(null)
const committedEpc = ref<string | null>(null)
const committedHs = ref<number>(0)
const committedPassport = ref<boolean>(false)

interface FilterDraft {
  distance: number | null
  ptype: string[]
  beds: number | null
  epc: string | null
  hs: number
  passport: boolean
}
const draft = ref<FilterDraft>({
  distance: null,
  ptype: ['any'],
  beds: null,
  epc: null,
  hs: 0,
  passport: false,
})

const distanceOptions: { value: number | null; label: string; hint: string }[] = [
  { value: null, label: 'Exact address only', hint: 'Score just this property' },
  { value: 0.5, label: 'Within 0.5 miles', hint: 'Same street & immediate neighbours' },
  { value: 1, label: 'Within 1 mile', hint: 'Roughly the same neighbourhood' },
  { value: 2, label: 'Within 2 miles', hint: 'Whole side of town' },
  { value: 5, label: 'Within 5 miles', hint: 'Across the city' },
  { value: 10, label: 'Within 10 miles', hint: 'Wider catchment' },
]
const propertyTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'detached', label: 'Detached' },
  { value: 'semi', label: 'Semi' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'flat', label: 'Flat' },
  { value: 'bungalow', label: 'Bungalow' },
]
const bedsOptions: { value: number | null; label: string }[] = [
  { value: null, label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]
const epcOptions = [
  { value: 'A', label: 'A',  color: '#008060' },
  { value: 'B', label: 'B+', color: '#2EAB55' },
  { value: 'C', label: 'C+', color: '#93C949' },
  { value: 'D', label: 'D+', color: '#F4D63A' },
]
const PTYPE_LABELS: Record<string, string> = Object.fromEntries(
  propertyTypeOptions.map((o) => [o.value, o.label]),
)

function distLabelShort(v: number | null): string {
  if (v == null) return 'Exact'
  return `${v} mi`
}
function distLabelLong(v: number | null): string {
  if (v == null) return 'Just this address'
  return `Within ${v} ${v === 1 ? 'mile' : 'miles'}`
}

function isPtypeActive(value: string): boolean {
  return draft.value.ptype.includes(value)
}
function togglePtype(value: string) {
  if (value === 'any') {
    draft.value.ptype = ['any']
    return
  }
  const cur = draft.value.ptype.filter((v) => v !== 'any')
  if (cur.includes(value)) {
    const next = cur.filter((v) => v !== value)
    draft.value.ptype = next.length === 0 ? ['any'] : next
  } else {
    draft.value.ptype = [...cur, value]
  }
}
function onHsInput(raw: string) {
  draft.value.hs = parseInt(raw, 10) || 0
}

function isDraftDefaultObj(d: FilterDraft): boolean {
  return (
    d.distance == null &&
    d.ptype.length === 1 &&
    d.ptype[0] === 'any' &&
    d.beds == null &&
    d.epc == null &&
    d.hs === 0 &&
    !d.passport
  )
}
function countDraftFilters(d: FilterDraft): number {
  let n = 0
  if (d.distance != null) n++
  if (!(d.ptype.length === 1 && d.ptype[0] === 'any')) n += d.ptype.length
  if (d.beds != null) n++
  if (d.epc != null) n++
  if (d.hs !== 0) n++
  if (d.passport) n++
  return n
}
const isDraftDefault = computed(() => isDraftDefaultObj(draft.value))
const draftFilterCount = computed(() => countDraftFilters(draft.value))

const committedDraft = computed<FilterDraft>(() => ({
  distance: activeRadius.value,
  ptype: committedPtype.value,
  beds: committedBeds.value,
  epc: committedEpc.value,
  hs: committedHs.value,
  passport: committedPassport.value,
}))
const hasAnyFilters = computed(() => !isDraftDefaultObj(committedDraft.value))

const committedChips = computed<{ key: string; label: string }[]>(() => {
  const chips: { key: string; label: string }[] = []
  if (activeRadius.value != null) {
    chips.push({ key: 'distance', label: distLabelShort(activeRadius.value) })
  }
  if (!(committedPtype.value.length === 1 && committedPtype.value[0] === 'any')) {
    committedPtype.value.forEach((v) =>
      chips.push({ key: `ptype:${v}`, label: PTYPE_LABELS[v] ?? v }),
    )
  }
  if (committedBeds.value != null) {
    chips.push({ key: 'beds', label: `${committedBeds.value}+ beds` })
  }
  if (committedEpc.value != null) {
    chips.push({ key: 'epc', label: `EPC ${committedEpc.value}+` })
  }
  if (committedHs.value !== 0) {
    chips.push({ key: 'hs', label: `HS ${committedHs.value}+` })
  }
  if (committedPassport.value) {
    chips.push({ key: 'passport', label: 'Passport only' })
  }
  return chips
})

function openFilterSheet() {
  draft.value = {
    distance: activeRadius.value,
    ptype: [...committedPtype.value],
    beds: committedBeds.value,
    epc: committedEpc.value,
    hs: committedHs.value,
    passport: committedPassport.value,
  }
  showFilters.value = true
}
function closeFilterSheet() {
  showFilters.value = false
}
function resetDraft() {
  draft.value = {
    distance: null,
    ptype: ['any'],
    beds: null,
    epc: null,
    hs: 0,
    passport: false,
  }
}
function applyDraft() {
  activeRadius.value = draft.value.distance
  committedPtype.value = [...draft.value.ptype]
  committedBeds.value = draft.value.beds
  committedEpc.value = draft.value.epc
  committedHs.value = draft.value.hs
  committedPassport.value = draft.value.passport
  showFilters.value = false
  if (searchMode.value && searchQuery.value.trim()) doSearch()
}

function removeCommittedFilter(key: string) {
  if (key === 'distance') activeRadius.value = null
  else if (key.startsWith('ptype:')) {
    const v = key.slice(6)
    const next = committedPtype.value.filter((p) => p !== v)
    committedPtype.value = next.length === 0 ? ['any'] : next
  } else if (key === 'beds') committedBeds.value = null
  else if (key === 'epc') committedEpc.value = null
  else if (key === 'hs') committedHs.value = 0
  else if (key === 'passport') committedPassport.value = false
  if (searchMode.value && searchQuery.value.trim()) doSearch()
}
function clearAllFilters() {
  activeRadius.value = null
  committedPtype.value = ['any']
  committedBeds.value = null
  committedEpc.value = null
  committedHs.value = 0
  committedPassport.value = false
  if (searchMode.value && searchQuery.value.trim()) doSearch()
}

// Legacy refs kept as no-op shims so any remaining script references
// below still type-check. New code reads `committed*` directly.
const filterBeds = computed({
  get: () => committedBeds.value,
  set: (v: number | null) => (committedBeds.value = v),
})
const filterMaxPrice = ref<number | null>(null)
const filterType = computed({
  get: () =>
    committedPtype.value.length === 1 && committedPtype.value[0] === 'any'
      ? ''
      : committedPtype.value.join(','),
  set: () => {
    /* no-op — chip group is the source of truth now */
  },
})
const filterHasPassport = computed({
  get: () => committedPassport.value,
  set: (v: boolean) => (committedPassport.value = v),
})

const pricePills = [
  { label: '£200k', value: 200000 },
  { label: '£300k', value: 300000 },
  { label: '£400k', value: 400000 },
  { label: '£500k', value: 500000 },
  { label: '£750k+', value: 750000 },
]

const preferences = ref<any>(null)
const passports = ref<any[]>([])
const properties = ref<any[]>([])
const verifiedPassportProperties = ref<any[]>([])
const loadingVerifiedPassports = ref(true)
const needsPostcode = ref(false)

// Whether the current user has a published Buyer Profile — drives the
// "✓ Buyer Profile · Published" quick-access card in the buy view.
const buyerProfilePublished = ref(false)

// Always initialize to 'buy' so SSR and client match — updated in onMounted
const role = ref<string>('buy')

const roleLabel = computed(() => {
  if (role.value === 'sell') return 'Seller'
  if (role.value === 'landlord') return 'Landlord'
  if (role.value === 'both') return 'Buyer + Seller'
  return 'Buyer'
})

const activePassportCount = computed(() => passports.value.length)

const availableFeedCount = computed(() => {
  if (searchMode.value) return searchTotal.value
  if (verifiedPassportProperties.value.length) return verifiedPassportProperties.value.length
  return properties.value.length
})

const greeting = computed(() => {
  const h = new Date().getHours()
  const timeOfDay =
    h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  // First name is the friendliest greeting — fall back to the local part of
  // the email if no first name is set, and drop the suffix entirely when we
  // have nothing user-facing (so we never render "Good afternoon , 👋").
  const first = profile.value?.firstName?.trim()
  const emailLocal = profile.value?.email?.split('@')[0]?.trim()
  const name = first || emailLocal || ''
  return name ? `${timeOfDay}, ${name} 👋` : `${timeOfDay} 👋`
})

const passportScore = computed(() => {
  const pct = passports.value[0]?.completionPercentage
  return typeof pct === 'number' ? pct : 0
})

const dashboardHomeScore = computed(() => {
  const primary = properties.value[0] as any
  const score =
    primary?.HomeScore ??
    primary?.homeScore ??
    primary?.epcScore ??
    passports.value[0]?.homeScore
  if (typeof score === 'number') return Math.max(0, Math.min(100, Math.round(score)))
  return 74
})

const passportDashoffset = computed(() =>
  (75.4 * (1 - passportScore.value / 100)).toFixed(1),
)

const portfolioCompliant = computed(
  () =>
    passports.value.filter((p) => (p.completionPercentage ?? 0) >= 80).length,
)

const portfolioActionNeeded = computed(
  () =>
    passports.value.filter((p) => (p.completionPercentage ?? 0) < 80).length,
)

const portfolioAlertAddress = computed(() => {
  const p = passports.value.find((p) => (p.completionPercentage ?? 0) < 80)
  return p?.address ?? p?.addressLine1 ?? ''
})

const passportDaysActive = computed(() => {
  const createdAt = passports.value[0]?.createdAt
  if (!createdAt) return null
  const days = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  )
  return days > 0 ? days : 1
})

const nextActionLabel = computed(() => {
  const pct = passports.value[0]?.completionPercentage ?? 0
  if (pct >= 100) return 'Publish your passport'
  if (pct >= 80) return 'Almost there — finish your passport'
  if (pct >= 40) return 'Continue your passport'
  return 'Start your passport sections'
})

const nextActionSub = computed(() => {
  const p = passports.value[0]
  if (!p) return ''
  const pct = p.completionPercentage ?? 0
  return `Passport ${pct}% complete`
})

// ── Saved search (buyer) pills ────────────────────────────────────────────
function formatBudget(n?: number | null): string {
  if (!n) return ''
  if (n >= 1_000_000)
    return '£' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  if (n >= 1_000) return '£' + Math.round(n / 1000) + 'k'
  return '£' + n
}

const userPostcode = computed(() => (profile.value as any)?.postcode?.trim() || '')

// Market pulse — aggregate stats for the user's postcode sector. Backend
// returns null for any figure it can't derive; the template hides those cells.
interface MarketPulse {
  area: string | null
  priceChangeYoY: number | null
  avgDaysToSell: number | null
  passportListings: number
  sampleSize: { recent: number; prior: number }
}
const marketPulse = ref<MarketPulse | null>(null)
const marketPulseLoading = ref(false)

async function fetchMarketPulse() {
  const pc = userPostcode.value
  if (!pc) {
    marketPulse.value = null
    return
  }
  marketPulseLoading.value = true
  try {
    marketPulse.value = await $fetch<MarketPulse>(
      `${config.public.apiBase}/property/market-pulse?postcode=${encodeURIComponent(pc)}`,
    )
  } catch {
    marketPulse.value = null
  } finally {
    marketPulseLoading.value = false
  }
}

watch(userPostcode, (pc) => { if (pc) fetchMarketPulse() }, { immediate: false })

// Derived display strings — null/no-data states collapse cleanly.
const pulseArea = computed(() => marketPulse.value?.area || userPostcode.value || '')
const pulseYoY = computed<string | null>(() => {
  const v = marketPulse.value?.priceChangeYoY
  if (typeof v !== 'number') return null
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(1)}%`
})
const pulseYoYColor = computed(() => {
  const v = marketPulse.value?.priceChangeYoY ?? 0
  return v >= 0 ? '#1f7a66' : '#c73e36'
})
const pulseListings = computed<number | null>(() => {
  const n = marketPulse.value?.passportListings
  return typeof n === 'number' ? n : null
})
const pulseDays = computed<number | null>(() => marketPulse.value?.avgDaysToSell ?? null)
const pulseHasAny = computed(
  () => pulseYoY.value !== null || pulseListings.value !== null || pulseDays.value !== null,
)

const savedSearchPills = computed(() => {
  const p = preferences.value
  if (!p) return []
  const pills: string[] = []
  const pc = userPostcode.value
  if (pc) pills.push(`${pc} area`)
  const types: string[] = Array.isArray(p.propertyTypes) ? p.propertyTypes : []
  if (types.length) pills.push(types.slice(0, 2).join(' / '))
  if (p.budgetMin && p.budgetMax) {
    pills.push(`${formatBudget(p.budgetMin)} – ${formatBudget(p.budgetMax)}`)
  } else if (p.budgetMax) {
    pills.push(`Up to ${formatBudget(p.budgetMax)}`)
  } else if (p.budgetMin) {
    pills.push(`From ${formatBudget(p.budgetMin)}`)
  }
  const features: string[] = Array.isArray(p.importantFeatures)
    ? p.importantFeatures
    : []
  if (features.some((f) => /passport/i.test(f))) pills.push('📘 Has Passport')
  return pills
})

const hasSavedSearch = computed(() => savedSearchPills.value.length > 0)

const savedSearchSummary = computed(() => {
  const parts = savedSearchPills.value
  return parts.join(' · ')
})

const selectedAddressText = computed(() => {
  if (!selectedAddress.value) return ''
  const a = selectedAddress.value
  const line1 = a.addressLine1 || a.line1 || a.address || ''
  const line2 = a.addressLine2 || a.line2 || a.postcode || ''
  return line2 ? `${line1} · ${line2}` : line1
})

const displayProperties = computed(() => properties.value.slice(0, 6))

const verifiedPassportDisplay = computed(() =>
  verifiedPassportProperties.value.slice(0, 6),
)

let searchTimer: ReturnType<typeof setTimeout> | null = null

async function handleSearchInput(val: string) {
  searchQuery.value = val
  if (searchTimer) clearTimeout(searchTimer)
  if (val.trim().length < 2) {
    searchResults.value = []
    showDropdown.value = false
    return
  }
  searchTimer = setTimeout(async () => {
    try {
      const token = localStorage.getItem('token')
      const results = await $fetch<any>(
        `${config.public.apiBase}/property/search?q=${encodeURIComponent(val)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      searchResults.value = results?.items ?? []
      showDropdown.value = searchResults.value.length > 0
    } catch {
      searchResults.value = []
      showDropdown.value = false
    }
  }, 300)
}

async function selectAddress(addr: any) {
  // Explore search shows a LIST of nearby properties — picking from the
  // dropdown sets the address and runs the list search. (The HomeScore
  // page's own search dropdown navigates straight to /homescore/[id]
  // — that's a separate surface with a different purpose.)
  selectedAddress.value = addr
  searchQuery.value = addr.addressLine1 || addr.address || addr.line1 || ''
  showDropdown.value = false
  searchResults.value = []
  await doSearch()
}

function clearSearch() {
  selectedAddress.value = null
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
  searchMode.value = false
  searchProperties.value = []
}

function epcColor(rating: string): string {
  const map: Record<string, string> = {
    A: '#00b050',
    B: '#33b800',
    C: '#92d050',
    D: '#a39200',
    E: '#e08a00',
    F: '#ff6600',
    G: '#ff0000',
  }
  return map[(rating ?? '').toUpperCase()] ?? '#8e8e93'
}

function epcDropColor(rating: string): string {
  return epcColor(rating)
}

function hsDropColor(score: number | null | undefined): string {
  if (score == null) return '#8e8e93'
  if (score >= 75) return '#1f7a66'
  if (score >= 60) return '#65a30d'
  if (score >= 45) return '#ca8a04'
  if (score >= 30) return '#92400e'
  return '#dc2626'
}

function buildSearchUrl(offset: number): string {
  const params = new URLSearchParams({
    q: searchQuery.value.trim(),
    offset: String(offset),
    limit: String(SEARCH_PAGE_SIZE),
  })
  if (activeRadius.value != null) {
    params.set('radius', String(activeRadius.value))
  }
  // Filter params — only sent when the user has actually picked something
  // (so an unset filter is indistinguishable from a fresh first page).
  if (
    committedPtype.value.length &&
    !(committedPtype.value.length === 1 && committedPtype.value[0] === 'any')
  ) {
    params.set('propertyType', committedPtype.value.join(','))
  }
  if (committedBeds.value != null) {
    params.set('minBedrooms', String(committedBeds.value))
  }
  if (committedEpc.value != null) {
    params.set('minEpc', committedEpc.value)
  }
  if (committedHs.value > 0) {
    params.set('minHomeScore', String(committedHs.value))
  }
  if (committedPassport.value) {
    params.set('passportOnly', '1')
  }
  return `${config.public.apiBase}/property/search?${params.toString()}`
}

async function doSearch() {
  if (!searchQuery.value.trim()) {
    searchMode.value = false
    return
  }
  showDropdown.value = false
  searchMode.value = true
  searchLoading.value = true
  searchProperties.value = []
  searchTotal.value = 0
  try {
    const token = localStorage.getItem('token')
    const results = await $fetch<any>(buildSearchUrl(0), {
      headers: { Authorization: `Bearer ${token}` },
    })
    searchProperties.value = results?.items ?? []
    searchTotal.value = results?.total ?? searchProperties.value.length
  } catch {
    searchProperties.value = []
    searchTotal.value = 0
  } finally {
    searchLoading.value = false
    nextTick(() => attachLoadMoreObserver())
  }
}

async function loadMoreResults() {
  if (searchLoadingMore.value) return
  if (searchProperties.value.length >= searchTotal.value) return
  searchLoadingMore.value = true
  try {
    const token = localStorage.getItem('token')
    const results = await $fetch<any>(
      buildSearchUrl(searchProperties.value.length),
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const newItems = results?.items ?? []
    // De-dupe by id in case of overlap
    const existingIds = new Set(searchProperties.value.map((p) => p.id))
    for (const item of newItems) {
      if (!existingIds.has(item.id)) searchProperties.value.push(item)
    }
    searchTotal.value = results?.total ?? searchTotal.value
  } catch {
    /* non-critical */
  } finally {
    searchLoadingMore.value = false
  }
}

function attachLoadMoreObserver() {
  if (loadMoreObserver) {
    loadMoreObserver.disconnect()
    loadMoreObserver = null
  }
  if (!loadMoreSentinel.value) return
  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMoreResults()
    },
    { rootMargin: '200px' },
  )
  loadMoreObserver.observe(loadMoreSentinel.value)
}

const hasMoreResults = computed(
  () => searchTotal.value > searchProperties.value.length,
)

function exitSearch() {
  searchMode.value = false
  searchProperties.value = []
  searchTotal.value = 0
  if (loadMoreObserver) {
    loadMoreObserver.disconnect()
    loadMoreObserver = null
  }
  clearSearch()
}

// Take the user into the Claim flow (search → confirm → KYC → issue passport).
function startClaimFlow() {
  navigateTo('/claim')
}

onBeforeUnmount(() => {
  if (loadMoreObserver) {
    loadMoreObserver.disconnect()
    loadMoreObserver = null
  }
})

onMounted(async () => {
  requestAnimationFrame(() => {
    pageReady.value = true
  })

  if (!profile.value) await fetchProfile()
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return

  // Apply cached role immediately after hydration (before API responds)
  const cachedRole = localStorage.getItem('umu_role')
  if (cachedRole) role.value = cachedRole

  const [prefResult, passportResult, propResult, verifiedResult, buyerProfileResult] =
    await Promise.allSettled([
      $fetch<any>(`${config.public.apiBase}/profile/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      $fetch<any[]>(`${config.public.apiBase}/profile/passports`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      $fetch<{ items: any[] }>(`${config.public.apiBase}/property/for-you`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      $fetch<{ items: any[] }>(
        `${config.public.apiBase}/property/verified-passports?limit=12`,
      ),
      $fetch<any>(`${config.public.apiBase}/buyer-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])

  if (buyerProfileResult.status === 'fulfilled') {
    buyerProfilePublished.value = !!buyerProfileResult.value?.published
  }

  if (prefResult.status === 'fulfilled') {
    preferences.value = prefResult.value
    const r = (prefResult.value?.purpose as string[])?.[0] ?? 'buy'
    role.value = r
    if (typeof window !== 'undefined') localStorage.setItem('umu_role', r)
  }
  loadingPrefs.value = false

  if (passportResult.status === 'fulfilled') {
    passports.value = passportResult.value ?? []
    // No longer auto-switch to "returning" when passports exist — the view
    // is now driven entirely by EXPLORE_VISITED_KEY (first visit vs. not).
  }
  loadingPassport.value = false

  if (propResult.status === 'fulfilled') {
    properties.value = propResult.value?.items ?? []
    needsPostcode.value = (propResult.value as any)?.needsPostcode === true
  }
  loadingProperties.value = false

  if (verifiedResult.status === 'fulfilled') {
    verifiedPassportProperties.value = verifiedResult.value?.items ?? []
  }
  loadingVerifiedPassports.value = false

  // Profile is now hydrated — fetch market pulse for the user's postcode.
  // The watcher above also covers any later postcode changes from settings.
  if (userPostcode.value) fetchMarketPulse()
})
</script>

<style scoped>
/* ── CSS variables (matching prototype) ── */
:root {
  --navy: #231d45;
  --brand: #00a19a;
  --brand-dark: #00a19a;
  --brand-pale: #f1f9f4;
  --brand-soft: #e2f1ea;
  --ink: #1f2024;
  --ink-soft: #4a5568;
  --ink-faint: #94a3b8;
  --line: #e5e7eb;
  --good: #166534;
}

.explore-root {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background: #f8f7fc;
}

/* ── Hero header ── */
.explore-hero {
  background: #fff;
  padding: 16px 20px 0;
  flex-shrink: 0;
  border-bottom: 1px solid #e5e7eb;
}

.hero-row1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.hero-copy-stack {
  min-width: 0;
}

.greeting-text {
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.02em;
}

.hero-avatar {
  cursor: pointer;
  flex-shrink: 0;
}

.explore-tour-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  color: #00a19a;
  font-size: 14px;
  font-weight: 800;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}
.explore-tour-btn:hover,
.explore-tour-btn:active {
  background: #ccfbf1;
}

/* ── Search bar ── */
.search-row {
  position: relative;
}

.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  /* right padding holds the absolutely-positioned dist-btn (~78 px wide)
     + search-btn (~62 px) + 18 px gap. Tweak together if either changes. */
  padding: 13px 158px 13px 40px;
  border-radius: 14px;
  border: 1.5px solid #e5e7eb;
  background: #f8f7fc;
  font-size: 14px;
  color: #1f2024;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #00a19a;
}

.search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: #00a19a;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

/* ── Scrollable area ── */
.explore-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 100px;
  background: #f8f7fc;
}

/* ── HomeScore free card ── */
.hs-free-card {
  background: #f1f9f4;
  border: 1.5px solid #e2f1ea;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 12px;
}

.hs-free-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.eyebrow-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.eyebrow-label.teal {
  color: #00a19a;
}

.badge-free {
  font-size: 11px;
  font-weight: 700;
  background: #00a19a;
  color: #fff;
  border-radius: 999px;
  padding: 3px 10px;
}

.badge-pp-price {
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.12);
  color: #3dbda3;
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 999px;
  padding: 3px 10px;
}

.card-title {
  font-size: 20px;
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.card-title.navy {
  color: #231d45;
}

.card-body-text {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.55;
  margin-bottom: 14px;
}

/* ── Property Passport navy card ── */
.pp-navy-card {
  background: linear-gradient(135deg, #231d45 0%, #2d2560 100%);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.pp-navy-glow {
  position: absolute;
  right: -24px;
  top: -24px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.25), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* ── Inner search ── */
.inner-search-wrap {
  position: relative;
}

.inner-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}

.inner-search-input {
  width: 100%;
  padding: 12px 12px 12px 36px;
  border-radius: 12px;
  border: 1.5px solid #e2f1ea;
  background: #fff;
  font-size: 15px;
  color: #1f2024;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.inner-search-input.dark {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.inner-search-input.dark::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* ── Buttons ── */
.btn-brand-full {
  width: 100%;
  border: none;
  padding: 13px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #00a19a;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.3);
  font-family: inherit;
}

.btn-brand-full:active {
  transform: scale(0.98);
}

.btn-teal-dark {
  width: 100%;
  border: none;
  padding: 13px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #3dbda3;
  color: #231d45;
  letter-spacing: -0.01em;
  font-family: inherit;
}

.btn-teal-dark:active {
  transform: scale(0.98);
}

/* ── Property feed header ── */
.feed-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.feed-title {
  font-size: 14px;
  font-weight: 800;
  color: #1f2024;
}

.feed-see-all {
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
  cursor: pointer;
}

.feed-sub {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 14px;
  line-height: 1.5;
}

/* ── Property card ── */
.skeletons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 180px;
  background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f0 50%, #f0f0f8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 18px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.prop-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 12px;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.15s;
}

.prop-card:active {
  transform: scale(0.99);
}

.prop-img-wrap {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.prop-emoji {
  font-size: 46px;
}

.prop-badge-pp {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #231d45;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pp-emoji-ic {
  width: 11px;
  height: 11px;
  object-fit: contain;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: -1px;
}
.pp-emoji-big {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.prop-badge-risk {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid #d1fae5;
}

.risk-low {
  color: #166534;
}
.risk-med {
  color: #92400e;
  border-color: #fef3c7;
}

.prop-price-tag {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
}

.prop-body {
  padding: 12px 14px;
}

.prop-address {
  font-size: 15px;
  font-weight: 700;
  color: #1f2024;
  margin-bottom: 1px;
}

.prop-area {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.prop-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.pill-grey {
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.prop-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.prop-score-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.prop-score-lbl {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.prop-score-bar {
  width: 54px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.prop-score-fill {
  height: 100%;
  background: #00a19a;
  border-radius: 4px;
}

.prop-score-num {
  font-size: 15px;
  font-weight: 700;
  color: #1f2024;
}

.prop-passport-btn {
  background: #231d45;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
}

/* ── Returning user: Passport status card ── */
.passport-status-card {
  background: linear-gradient(135deg, #00a19a, #00a19a);
  border-radius: 18px;
  padding: 16px 18px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.passport-status-card:active {
  transform: scale(0.99);
}

.psc-glow {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15),
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
}

.psc-main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.psc-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.psc-icon-box {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.psc-label-small {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 2px;
}

.psc-address {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.psc-postcode {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.psc-gauge {
  flex-shrink: 0;
  text-align: center;
}

.psc-gauge-num {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  margin-top: -8px;
}

.psc-gauge-lbl {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.psc-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.psc-footer-stats {
  display: flex;
  gap: 12px;
}

.psc-stat {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.psc-stat strong {
  color: #fff;
}

.psc-view-cta {
  font-size: 12px;
  font-weight: 700;
  color: #3dbda3;
}

/* No passport state */
.no-passport-card {
  background: #fff;
  border: 2px dashed #e0e0e8;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 14px;
}

.no-pp-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.no-pp-body {
  flex: 1;
}
.no-pp-title {
  font-size: 14px;
  font-weight: 700;
  color: #1f2024;
  margin-bottom: 2px;
}
.no-pp-sub {
  font-size: 13px;
  color: #94a3b8;
}
.no-pp-cta {
  font-size: 15px;
  font-weight: 700;
  color: #00a19a;
  flex-shrink: 0;
}

/* ── Next action nudge ── */
.next-action-card {
  background: #fffbeb;
  border: 1.5px solid #fef3c7;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.next-action-card:active {
  transform: scale(0.99);
}

.na-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.na-body {
  flex: 1;
}
.na-title {
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 2px;
}
.na-sub {
  font-size: 13px;
  color: #92400e;
  line-height: 1.4;
}
.na-cta {
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  flex-shrink: 0;
}

/* ── HomeScore quick card ── */
.hs-quick-card {
  background: #f1f9f4;
  border: 1.5px solid #e2f1ea;
  border-radius: 14px;
  padding: 13px 16px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.hs-quick-card:active {
  transform: scale(0.99);
}

.hs-quick-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.hs-quick-body {
  flex: 1;
}
.hs-quick-title {
  font-size: 14px;
  font-weight: 700;
  color: #231d45;
  margin-bottom: 2px;
}
.hs-quick-sub {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.4;
}
.hs-quick-cta {
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
  flex-shrink: 0;
}

/* ── Find a Pro dark card ── */
.pro-dark-card {
  background: #1e1842;
  border-radius: 16px;
  padding: 14px 18px;
  margin-bottom: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
}

.pro-dark-card:active {
  transform: scale(0.99);
}

.pro-dark-icon {
  font-size: 26px;
  flex-shrink: 0;
}
.pro-dark-body {
  flex: 1;
}
.pro-dark-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}
.pro-dark-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.4;
}

.pro-dark-badge {
  background: rgba(94, 234, 212, 0.15);
  border: 1px solid rgba(94, 234, 212, 0.3);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #3dbda3;
  flex-shrink: 0;
  white-space: nowrap;
}

.explore-greeting-sub {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.explore-title {
  font-size: 20px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.02em;
}

.explore-lede {
  margin: 7px 0 0;
  max-width: 62ch;
  font-size: 13px;
  line-height: 1.55;
  color: #667b98;
  font-weight: 500;
}

.hero-meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px 0 2px;
}

.hero-meta-card {
  border: 1px solid #dce8f4;
  background: linear-gradient(145deg, rgba(251, 254, 255, 0.96), rgba(239, 248, 255, 0.92));
  border-radius: 16px;
  padding: 14px;
}

.hero-meta-eyebrow {
  margin: 0 0 7px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.25px;
  color: #0d7f79;
  font-weight: 800;
}

.hero-meta-card h2 {
  margin: 0;
  font-size: 19px;
  color: #153457;
  letter-spacing: -0.35px;
  line-height: 1.2;
}

.hero-meta-card > p {
  margin: 9px 0 0;
  color: #5a6f8e;
  font-size: 13px;
  line-height: 1.55;
}

.hero-quick-links {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-quick-links button {
  border: 1px solid #cfe0f1;
  background: #fff;
  color: #1e486f;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s ease;
}

.hero-quick-links button:hover {
  transform: translateY(-1px);
  border-color: #b7d0e8;
  box-shadow: 0 8px 14px rgba(30, 81, 130, 0.12);
}

.hero-kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.hero-kpi {
  border: 1px solid #dbe7f3;
  border-radius: 14px;
  padding: 11px 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 18px rgba(25, 64, 104, 0.09);
  text-align: left;
}

.hero-kpi strong {
  display: block;
  font-size: 18px;
  line-height: 1.1;
  letter-spacing: -0.4px;
  color: #17385d;
}

.hero-kpi span {
  display: block;
  margin-top: 5px;
  font-size: 11px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  color: #5f7594;
  font-weight: 700;
}

/* ── New unified Distance + Filters pill (prototype .exp-dist-btn) ──
   Absolute-positioned inside .search-wrap, sitting just to the left of
   the Search button. The Search button's right:10px + ~62 px width put
   it at roughly right:80px; we leave a 6 px gap. */
.exp-dist-btn {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  color: #231d45;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 6px 10px;
  cursor: pointer;
  letter-spacing: -0.05px;
  transition: all 0.15s;
  flex-shrink: 0;
}
.exp-dist-btn:hover {
  background: #f2faf8;
  border-color: #c8eae6;
  color: #00514d;
}
.exp-dist-btn .arrow {
  font-size: 8px;
  color: #9c98ad;
  transition: transform 0.2s;
}
.exp-dist-btn.has-filters {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
}
.exp-dist-btn.has-filters .arrow {
  color: rgba(255, 255, 255, 0.7);
}
.exp-dist-btn .filter-dot {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  border-radius: 50%;
  margin-left: 2px;
  display: none;
}
.exp-dist-btn.has-filters .filter-dot {
  display: block;
}

/* ── Active-filter summary chip row (prototype .filter-summary) ── */
.filter-summary {
  display: none;
  padding-top: 10px;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}
.filter-summary.visible {
  display: flex;
}
.fs-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  color: #00514d;
  background: #e0f4f1;
  border: 1px solid #c2e6df;
  border-radius: 999px;
  padding: 5px 10px;
  letter-spacing: -0.05px;
}
.fs-chip .x {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #00a19a;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  cursor: pointer;
  margin-left: 2px;
  line-height: 1;
}
.fs-clear {
  font-size: 11px;
  font-weight: 800;
  color: #6b6783;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  letter-spacing: -0.05px;
  font-family: inherit;
  margin-left: 4px;
}

.addr-drop {
  background: #fff;
  border: 1.5px solid #e2f1ea;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(35, 29, 69, 0.12);
  overflow: hidden;
  margin-bottom: 10px;
}

.addr-drop-header {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 14px 4px;
}

.addr-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.12s;
}

.addr-item:last-child {
  border-bottom: none;
}

.addr-item:hover,
.addr-item:active {
  background: #f0fdfa;
}

.addr-ic {
  color: #00a19a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.addr-body {
  flex: 1;
  min-width: 0;
}

.addr-line1 {
  font-size: 15px;
  font-weight: 700;
  color: #231d45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.addr-line2 {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 1px;
}

.addr-hs {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  letter-spacing: -0.4px;
  text-align: center;
  min-width: 40px;
}
.addr-hs-num {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  font-feature-settings: 'tnum';
}
.addr-hs-lbl {
  font-size: 9px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 2px;
}

.addr-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 5px;
}

.addr-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  white-space: nowrap;
  line-height: 1.4;
  color: #fff;
  letter-spacing: 0.01em;
}

.addr-badge-ic {
  width: 10px;
  height: 10px;
  object-fit: contain;
  flex-shrink: 0;
}

.addr-badge--pub {
  background: #231d45;
  color: #fff;
}

.addr-badge--prog {
  background: #fef3c7;
  color: #92400e;
}

.addr-badge--unclaimed {
  background: #f0fdfa;
  color: #00a19a;
  border: 1px solid #e2f1ea;
}

.selected-addr-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 10px;
}

.search-clear-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e5e7eb;
  display: grid;
  place-items: center;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
}

.claim-banner {
  background: linear-gradient(135deg, #231d45, #2d2560);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.claim-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 110px;
  height: 110px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.3), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.claim-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
}

.claim-title {
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.claim-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.55;
  margin-bottom: 16px;
}

.claim-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.claim-stat-box {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 12px;
  text-align: center;
}

.claim-stat-val {
  font-size: 15px;
  font-weight: 800;
  color: #3dbda3;
}

.claim-stat-lbl {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 1.3;
}

.btn-claim {
  width: 100%;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  background: #3dbda3;
  color: #231d45;
  font-family: inherit;
}

.btn-claim:active {
  transform: scale(0.98);
}

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #00a19a;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.saved-search-card {
  background: #f1f9f4;
  border: 1.5px solid #e2f1ea;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.saved-search-card--empty {
  background: #fff;
  border-style: dashed;
  cursor: pointer;
}

.saved-search-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.saved-search-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill-brand {
  background: #f1f9f4;
  color: #00a19a;
  border: 1px solid #e2f1ea;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}

.saved-search-compact {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.saved-search-compact:active {
  transform: scale(0.99);
}

.market-pulse-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
}

/* My Buyer Profile entry card (buy role) */
.my-passport-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: background 0.12s;
}
.my-passport-card:active {
  background: #f0fdfa;
}
.my-passport-card--published {
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  border-color: #3dbda3;
}
.my-passport-card--published .my-passport-ic {
  background: #00a19a;
  color: #fff;
  border-color: #00a19a;
  font-weight: 800;
}
.my-passport-ic {
  width: 40px;
  height: 40px;
  background: #f0fdfa;
  border: 1.5px solid #99f6e4;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
}
.my-passport-body {
  flex: 1;
  min-width: 0;
}
.my-passport-title {
  font-size: 15px;
  font-weight: 700;
  color: #231d45;
}
.my-passport-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.4;
}
.my-passport-arrow {
  font-size: 16px;
  color: #00a19a;
  font-weight: 700;
  flex-shrink: 0;
}

.pulse-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.pulse-cell {
  background: #fff;
  padding: 10px 8px;
  text-align: center;
}

.pulse-val {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
}

.pulse-lbl {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  line-height: 1.3;
}

.portfolio-card {
  background: linear-gradient(135deg, #1c1917, #292524);
  border-radius: 18px;
  padding: 16px 18px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}

.portfolio-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle,
    rgba(251, 191, 36, 0.15),
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
}

.portfolio-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.5);
  margin-bottom: 12px;
}

.portfolio-stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  margin-bottom: 14px;
}

.portfolio-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(248, 113, 113, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
}

.portfolio-prop-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.add-property-card {
  background: #f1f9f4;
  border: 1.5px solid #e2f1ea;
  border-radius: 14px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 14px;
}

.add-property-card:active {
  transform: scale(0.99);
}

.horiz-feed {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
}

.horiz-feed::-webkit-scrollbar {
  display: none;
}

.prop-card-horiz {
  min-width: 270px;
  flex-shrink: 0;
  margin-bottom: 0;
}

/* ── Search mode ── */
.search-back-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.search-back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f0f0f8;
  border: none;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 15px;
  font-weight: 700;
  color: #231d45;
  cursor: pointer;
  font-family: inherit;
}

.search-back-btn:active {
  transform: scale(0.97);
}

.search-result-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-results-msg {
  text-align: center;
  padding: 48px 20px;
}

.no-results-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.no-results-text {
  font-size: 16px;
  font-weight: 700;
  color: #231d45;
  margin-bottom: 4px;
}

.no-results-sub {
  font-size: 15px;
  color: #94a3b8;
}

/* ── For You empty state ── */
.foryou-empty {
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  margin-bottom: 12px;
}
.foryou-empty-ic {
  font-size: 32px;
  margin-bottom: 8px;
}
.foryou-empty-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 4px;
}
.foryou-empty-sub {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin-bottom: 12px;
}
.foryou-empty-btn {
  background: var(--brand);
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
}

/* ── Verified passports empty state ── */
.verified-empty {
  background: #fff;
  border: 1.5px dashed var(--brand-soft);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  margin-bottom: 12px;
}
.verified-empty-ic {
  font-size: 32px;
  margin-bottom: 8px;
}
.verified-empty-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--navy);
  margin-bottom: 4px;
}
.verified-empty-sub {
  font-size: 13px;
  color: var(--ink-soft);
  line-height: 1.5;
  margin-bottom: 12px;
}
.verified-empty-btn {
  background: var(--brand);
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-family: inherit;
}

/* ── EPC badge on search result card ── */
.prop-row-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}
.prop-title-col {
  flex: 1;
  min-width: 0;
}
.epc-badge {
  min-width: 44px;
  padding: 5px 8px;
  border-radius: 8px;
  color: #fff;
  text-align: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.epc-badge-label {
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.85;
  line-height: 1;
}
.epc-badge-rating {
  font-size: 16px;
  font-weight: 900;
  line-height: 1.1;
  margin-top: 1px;
}

/* ── Load more (infinite scroll) ── */
.load-more-sentinel {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
}
.load-more-btn {
  background: #fff;
  border: 1.5px solid var(--line);
  color: var(--brand);
  font-size: 15px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
}
.load-more-btn:active {
  background: var(--brand-pale);
}
.load-more-spinner {
  width: 24px;
  height: 24px;
  border: 2.5px solid #e5e7eb;
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.load-more-end {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  padding: 12px 0 8px;
  font-weight: 600;
}

/* ── Unified Distance + Filters bottom sheet (prototype-exact) ── */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 13, 40, 0);
  z-index: 200;
  pointer-events: none;
  transition: background 0.25s ease;
}
.sheet-backdrop.open {
  background: rgba(17, 13, 40, 0.55);
  pointer-events: auto;
}
.sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border-radius: 24px 24px 0 0;
  z-index: 201;
  transform: translateY(100%);
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  flex-direction: column;
  max-height: 92dvh;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.18);
}
.sheet.open {
  transform: translateY(0);
}
.sheet-grabber-wrap {
  display: flex;
  justify-content: center;
  padding: 10px 0 4px;
  cursor: pointer;
}
.sheet-grabber {
  width: 36px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 999px;
}
.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 22px 12px;
  border-bottom: 1px solid #f3f4f6;
}
.sheet-title {
  font-size: 16px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.3px;
}
.sheet-reset {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  color: #6b6783;
  cursor: pointer;
  letter-spacing: -0.05px;
  padding: 4px 0;
}
.sheet-reset:hover {
  color: #231d45;
}
.sheet-reset:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.sheet-body {
  overflow-y: auto;
  flex: 1;
}
.sheet-section {
  padding: 16px 22px 4px;
}
.sheet-section-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.sheet-section-title {
  font-size: 11px;
  font-weight: 800;
  color: #6b6783;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.sheet-section-value {
  font-size: 12px;
  font-weight: 800;
  color: #00514d;
  letter-spacing: -0.05px;
  font-feature-settings: 'tnum';
}

/* Distance radio list */
.dist-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 4px;
}
.dist-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.dist-row:hover {
  background: #fff;
}
.dist-row.active {
  background: #fff;
  box-shadow: 0 1px 4px rgba(35, 29, 69, 0.06);
}
.dist-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #9c98ad;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.dist-row.active .dist-radio {
  border-color: #00a19a;
  background: #00a19a;
}
.dist-radio::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}
.dist-row.active .dist-radio::after {
  opacity: 1;
}
.dist-label-wrap {
  flex: 1;
  min-width: 0;
}
.dist-label {
  display: block;
  font-size: 13.5px;
  font-weight: 700;
  color: #231d45;
  letter-spacing: -0.15px;
  line-height: 1.2;
}
.dist-hint {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #6b6783;
  margin-top: 1px;
  letter-spacing: -0.05px;
}
.dist-row.active .dist-label {
  color: #00514d;
}

/* Filter chip groups */
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chip {
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #231d45;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 8px 13px;
  cursor: pointer;
  letter-spacing: -0.05px;
  transition: all 0.15s;
}
.chip:hover {
  background: #f2faf8;
  border-color: #c8eae6;
}
.chip.active {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 161, 154, 0.25);
}
.chip.epc-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-left: 8px;
}
.chip .epc-tile {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.chip.active .epc-tile {
  background: rgba(255, 255, 255, 0.25) !important;
}

/* HomeScore slider */
.slider-row {
  padding: 4px 4px 0;
}
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
  outline: none;
  margin: 12px 0 6px;
}
.slider::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    #00a19a 0%,
    #00a19a var(--fill, 0%),
    #e5e7eb var(--fill, 0%),
    #e5e7eb 100%
  );
}
.slider::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: #e5e7eb;
}
.slider::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: #00a19a;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #00a19a;
  cursor: pointer;
  margin-top: -8px;
  box-shadow: 0 2px 6px rgba(0, 161, 154, 0.25);
}
.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #00a19a;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 161, 154, 0.25);
}
.slider-scale {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #9c98ad;
  margin-top: 2px;
  letter-spacing: 0.4px;
}

/* Passport toggle row */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
}
.toggle-row .tr-text {
  flex: 1;
  min-width: 0;
}
.toggle-row .tr-title {
  font-size: 13px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.15px;
  margin-bottom: 2px;
}
.toggle-row .tr-sub {
  font-size: 11px;
  font-weight: 500;
  color: #6b6783;
  letter-spacing: -0.05px;
  line-height: 1.3;
}
.toggle {
  width: 38px;
  height: 22px;
  border-radius: 999px;
  background: #e5e7eb;
  position: relative;
  transition: background 0.18s;
  flex-shrink: 0;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
}
.toggle.on {
  background: #00a19a;
}
.toggle.on::after {
  transform: translateX(16px);
}

/* Cancel + Apply footer */
.sheet-foot {
  padding: 14px 22px calc(24px + env(safe-area-inset-bottom));
  border-top: 1px solid #f3f4f6;
  background: #fff;
  display: flex;
  gap: 10px;
  align-items: center;
}
.sheet-cancel {
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: #231d45;
  background: #f4f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 12px 18px;
  cursor: pointer;
  letter-spacing: -0.05px;
  transition: all 0.15s;
}
.sheet-cancel:hover {
  background: #fff;
  border-color: #9c98ad;
}
.sheet-apply {
  flex: 1;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  background: #00a19a;
  border: none;
  border-radius: 999px;
  padding: 13px 18px;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.sheet-apply:hover {
  background: #00b6ae;
}
.sheet-apply .count {
  background: rgba(255, 255, 255, 0.22);
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
  font-weight: 800;
  font-feature-settings: 'tnum';
}

/* Landing-style web shell overrides */
.explore-root {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-card-border: #d7e2ee;
  --fx-card-shadow: 0 14px 26px rgba(36, 66, 102, 0.08);
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 8% 11%, rgba(13, 191, 181, 0.14) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.13) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f8fbff 0%, #f0f5ff 48%, #effaf8 100%);
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
  filter: blur(44px);
  pointer-events: none;
  opacity: 0.24;
  animation: drift 20s ease-in-out infinite;
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
  animation-duration: 30s;
}

@keyframes drift {
  0%,
  100% { transform: translate3d(0, 0, 0); }
  50% { transform: translate3d(0, -14px, 0); }
}

.explore-web-shell {
  width: min(1280px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.explore-web-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
}

.nav-inner {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #1e2b41;
  cursor: pointer;
}

.brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.web-links {
  display: flex;
  gap: 8px;
}

.web-links button {
  border: 0;
  background: transparent;
  color: #52627e;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.web-links button:hover {
  background: rgba(20, 53, 98, 0.06);
  color: #1e2b41;
}

.web-links button.active {
  background: rgba(0, 161, 154, 0.1);
  color: #00857f;
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.web-dashboard-top {
  margin-top: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 338px;
  gap: 12px;
}

.web-dashboard-main {
  display: grid;
  gap: 14px;
}

.web-property-spotlight {
  border: 1px solid #d8e3ee;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(19, 45, 78, 0.08);
  display: grid;
  grid-template-columns: 308px minmax(0, 1fr);
  overflow: hidden;
}

.web-spotlight-media {
    background: #f4f8fc;
    position: relative;
    min-height: 240px;
  }

  .web-spotlight-img {
    width: 100%;
    height: 100%;
    min-height: 100%;
    min-width: 100%;
  }

.web-media-btn {
  position: absolute;
  left: 12px;
  bottom: 12px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(3, 13, 33, 0.62);
  color: #fff;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.web-spotlight-body {
  padding: 18px 20px;
}

.web-tag {
  margin: 0;
  display: inline-flex;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dff6f2;
  color: #0f756f;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.web-spotlight-body h1 {
  margin: 8px 0 0;
  font-size: 46px;
  line-height: 1.05;
  letter-spacing: -0.6px;
  color: #152942;
}

.web-address-sub {
  margin: 6px 0 0;
  color: #526784;
  font-size: 14px;
  font-weight: 600;
}

.web-spotlight-copy {
  margin: 12px 0;
  color: #5f7391;
  font-size: 14px;
  line-height: 1.55;
  max-width: 62ch;
}

.web-progress-row {
  display: flex;
  justify-content: space-between;
  color: #41506b;
  font-size: 13px;
  font-weight: 700;
}

.web-progress-track {
  margin-top: 8px;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e8f2fb;
  overflow: hidden;
}

.web-progress-fill {
  height: 100%;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 100%);
  transition: width 0.24s ease;
  margin-top: 14px;
  display: flex;
  gap: 10px;
}

.web-primary,
.web-secondary {
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.web-primary {
  border: 0;
  color: #fff;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 100%);
}

.web-secondary {
  border: 1px solid #d3deea;
  color: #1f2b3f;
  background: #fff;
}

.web-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.web-kpi-row article {
  border: 1px solid #d8e3ee;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.web-kpi-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.web-kpi-top i {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eef5ff;
  font-style: normal;
  font-size: 15px;
}

.web-kpi-row strong {
  display: block;
  font-size: 34px;
  line-height: 1;
  color: #172f4c;
}

.web-kpi-row span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #627791;
  font-weight: 700;
}

.web-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.web-feature-card {
  border: 1.5px solid #e8f0f8;
  border-radius: 20px;
  background: #fff;
  padding: 36px 32px;
  box-shadow: 0 8px 24px rgba(15, 36, 62, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.web-feature-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  border-radius: 50%;
  transition: all 0.6s ease;
}

.web-feature-card:hover {
  box-shadow: 0 16px 40px rgba(15, 36, 62, 0.15);
  border-color: #d0e2f0;
  transform: translateY(-4px);
}

.web-feature-card:hover::before {
  top: -30%;
  right: -30%;
}

.web-feature-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.web-feature-head h3 {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f2440;
  letter-spacing: -0.3px;
}

.web-feature-icon {
  width: 28px;
  height: 28px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 8px;
}

.web-feature-card.homescore .web-feature-head span {
  color: #0d9488;
  background: linear-gradient(135deg, #e8fcfb 0%, #dff9f7 100%);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.15);
}

.web-feature-card.passport .web-feature-head span {
  color: #7c3aed;
  background: linear-gradient(135deg, #f8f4ff 0%, #f3e8ff 100%);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.15);
}

.web-feature-card p {
  margin: 0 0 20px 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.7;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.web-feature-body {
  margin: 18px 0 24px;
  position: relative;
  z-index: 1;
}

.homescore-layout {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.web-score-ring {
  --score: 74;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(#16a34a calc(var(--score) * 1%), #f0fdf4 0);
  display: grid;
  place-items: center;
  box-shadow: 0 12px 32px rgba(22, 163, 74, 0.2);
  transition: all 0.4s ease;
}

.web-score-ring-inner {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: #fff;
  display: grid;
  place-items: center;
  text-align: center;
  box-shadow: inset 0 0 0 2px #dcfce7;
}

.web-score-ring-inner strong {
  font-size: 48px;
  line-height: 0.9;
  color: #16a34a;
  letter-spacing: -1.5px;
  font-weight: 800;
  display: block;
}

.web-score-ring-inner span {
  margin-top: 6px;
  font-size: 16px;
  line-height: 1;
  color: #64748b;
  font-weight: 700;
  display: block;
}

.passport-layout {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.web-passport-book {
  width: 110px;
  height: 145px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3f2c70 100%);
  border: 2.5px solid #6d28d9;
  display: grid;
  place-items: center;
  transform: perspective(800px) rotateY(-12deg) rotateX(4deg) rotateZ(-2deg);
  box-shadow: 
    0 20px 40px rgba(79, 70, 229, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.15),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
}

.web-passport-book:hover {
  transform: perspective(800px) rotateY(-8deg) rotateX(2deg) rotateZ(-1deg);
  box-shadow: 
    0 24px 48px rgba(79, 70, 229, 0.35),
    inset 0 1px 2px rgba(255, 255, 255, 0.15),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
}

.web-passport-book img {
  width: 68px;
  height: 68px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  transition: transform 0.4s ease;
}

.web-passport-book:hover img {
  transform: scale(1.08);
}

.web-feature-points {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.web-feature-points li {
  font-size: 15px;
  color: #1f2937;
  font-weight: 700;
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 12px;
  line-height: 1.6;
  letter-spacing: -0.2px;
}

.web-feature-points li::before {
  content: '✓';
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.web-feature-points li:hover::before {
  transform: scale(1.15);
}

.web-feature-points.hs li::before {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: #fff;
}

.web-feature-points.pp li::before {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
}

.web-feature-card button {
  width: 100%;
  border: 0;
  border-radius: 14px;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: -0.2px;
  z-index: 1;
}

.web-feature-card button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.4s ease;
  z-index: -1;
}

.web-feature-card button:hover::before {
  left: 100%;
}

.web-feature-card button span {
  line-height: 1;
}

.web-feature-card button:hover {
  transform: translateY(-3px);
}

.web-feature-card.homescore button {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35);
}

.web-feature-card.homescore button:hover {
  box-shadow: 0 12px 28px rgba(22, 163, 74, 0.45);
}

.web-feature-card.passport button {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35);
}

.web-feature-card.passport button:hover {
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.45);
}

.web-recommended {
  border: 1.5px solid #e8f0f8;
  border-radius: 20px;
  background: #fff;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(15, 36, 62, 0.08);
  margin-top: 8px;
}

.web-reco-head h4 {
  margin: 0;
  font-size: 16px;
  color: #172f4c;
}

.web-reco-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.web-reco-grid button {
  border: 1px solid #dbe7f3;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  color: #233a5a;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 72px;
}

.web-reco-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b37a3, #159a99);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 12px rgba(28, 53, 96, 0.16);
}

.web-reco-grid button:nth-child(1) .web-reco-icon {
  background: linear-gradient(135deg, #4c46b6, #2f53cc);
}

.web-reco-grid button:nth-child(2) .web-reco-icon {
  background: linear-gradient(135deg, #5a4dd8, #2f55cc);
}

.web-reco-grid button:nth-child(3) .web-reco-icon,
.web-reco-grid button:nth-child(4) .web-reco-icon {
  background: linear-gradient(135deg, #3aa5a3, #0f8887);
}

.web-reco-icon img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.web-reco-copy {
  display: grid;
  gap: 2px;
}

.web-reco-copy strong {
  font-size: 13px;
  color: #132745;
  line-height: 1.25;
}

.web-reco-copy small {
  color: #4f6482;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
}

.web-reco-copy em {
  color: #60748f;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 1.25;
}

.web-reco-arrow,
.web-reco-plus {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #d9e4ef;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2e4666;
  margin-top: 0;
  font-size: 14px;
  line-height: 1;
  align-self: center;
}

.web-quick-actions,
.web-progress-panel {
  border: 1px solid #d8e3ee;
  border-radius: 14px;
  background: #fff;
  padding: 12px;
}

.web-quick-actions h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #172f4c;
}

.web-quick-actions button {
  width: 100%;
  border: 1px solid #e1e9f2;
  background: #fbfdff;
  color: #1f2b3f;
  border-radius: 10px;
  padding: 10px 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}

.web-quick-actions button > span:first-child {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 8px;
  gap: 2px;
  text-align: left;
}

.web-quick-actions button > span:first-child > span {
  display: grid;
  gap: 2px;
}

.web-quick-actions button img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.web-quick-actions button strong {
  font-size: 13px;
  color: #1c3251;
}

.web-quick-actions button small {
  font-size: 11px;
  color: #6c7f98;
  font-weight: 600;
}

.web-progress-panel {
  background: linear-gradient(135deg, #051733 0%, #083260 100%);
  color: #e9f5ff;
}

.web-progress-panel p {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 11px;
  font-weight: 800;
  opacity: 0.85;
}

.web-progress-score {
  margin: 10px 0 12px;
}

.web-progress-score strong {
  display: block;
  font-size: 38px;
  line-height: 1;
}

.web-progress-score span {
  font-size: 12px;
  opacity: 0.86;
}

.web-progress-panel button {
  width: 100%;
  border: 1px solid rgba(198, 220, 244, 0.24);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.web-activity-panel {
  border: 1px solid #d8e3ee;
  border-radius: 14px;
  background: #fff;
  padding: 12px;
}

.web-activity-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.web-activity-head h4 {
  margin: 0;
  font-size: 16px;
  color: #172f4c;
}

.web-activity-head button {
  border: 0;
  background: transparent;
  color: #0d7f79;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.web-activity-list {
  margin-top: 8px;
  display: grid;
  gap: 10px;
}

.web-activity-list div {
  border: 1px solid #e2ebf4;
  border-radius: 10px;
  padding: 9px 10px;
  position: relative;
}

.web-activity-list strong {
  display: block;
  font-size: 13px;
  color: #1f2b3f;
}

.web-activity-list span {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  color: #617690;
}

.web-activity-list em {
  position: absolute;
  top: 10px;
  right: 10px;
  font-style: normal;
  font-size: 10px;
  color: #8ea0b8;
  font-weight: 700;
}

.web-actions {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.web-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #3c516e;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.web-icon-btn svg {
  width: 16px;
  height: 16px;
}

.web-profile-chip {
  border: 1px solid #d4dfeb;
  background: #fff;
  border-radius: 999px;
  height: 38px;
  padding: 0 12px 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1e2b41;
  cursor: pointer;
}

.web-profile-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(138, 169, 216, 0.24);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #2c496a;
}

.web-profile-meta {
  display: grid;
  text-align: left;
  line-height: 1.05;
}

.web-profile-meta strong {
  font-size: 12px;
  font-weight: 700;
}

.web-profile-meta small {
  font-size: 10px;
  color: #6e8099;
  font-weight: 600;
}

.web-btn.add-property {
  height: 38px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.web-dashboard-footer {
  margin-top: 20px;
  padding: 40px 0 0;
  border-top: 1px solid rgba(30, 47, 71, 0.12);
  background:
    radial-gradient(circle at 86% 18%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 46%),
    linear-gradient(180deg, rgba(247, 252, 255, 0.96), rgba(236, 246, 252, 0.98));
  backdrop-filter: blur(10px);
}

.web-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.web-footer-brand img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.web-footer-brand strong {
  font-size: 20px;
  color: #1c2d44;
  letter-spacing: -0.4px;
}

.web-footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(182, 203, 228, 0.55);
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 20px 36px rgba(30, 58, 92, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.web-footer-intro {
  display: grid;
  gap: 10px;
}

.web-footer-chip {
  justify-self: start;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #0f756f;
  border: 1px solid rgba(0, 161, 154, 0.3);
  background: rgba(230, 252, 249, 0.95);
  border-radius: 999px;
  padding: 5px 10px;
  font-weight: 800;
}

.web-footer-intro p {
  margin: 0;
  color: #5b7192;
  font-size: 13px;
  line-height: 1.55;
}

.web-footer-col {
  display: grid;
  align-content: start;
}

.web-footer-col h5 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.web-footer-grid h5 {
  margin: 0 0 8px;
  font-size: 12px;
  color: #1f3450;
  text-transform: uppercase;
  letter-spacing: 1.1px;
}

.web-footer-grid button {
  appearance: none;
  border: 0;
  display: block;
  background: transparent;
  color: #50637f;
  padding: 0;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.18s ease, transform 0.18s ease;
}

.web-footer-grid button:hover {
  color: #113352;
}

.web-footer-cta {
  display: inline-flex;
  justify-self: start;
  align-items: center;
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 100%);
  box-shadow: 0 10px 18px rgba(30, 128, 196, 0.24);
  cursor: pointer;
}

.web-footer-bottom {
  margin-top: 14px;
  padding: 12px 0 20px;
  border-top: 1px solid rgba(30, 47, 71, 0.11);
  color: #60748f;
  font-size: 12px;
}

@media (hover: hover) and (pointer: fine) {
  .web-footer-grid button:hover {
    transform: translateX(1px);
  }

  .web-footer-cta:hover {
    box-shadow: 0 10px 18px rgba(30, 128, 196, 0.22);
    transform: translateY(-1px);
  }
}

.web-footer-cta:focus-visible {
  outline: 2px solid rgba(29, 137, 197, 0.5);
  outline-offset: 2px;
}

.web-profile-chip.active {
  border-color: rgba(0, 161, 154, 0.34);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.12);
}

.web-icon-btn:hover,
.web-profile-chip:hover {
  border-color: #bfd1e4;
  background: #f8fbff;
}

.web-icon-btn:focus-visible,
.web-profile-chip:focus-visible,
.web-links button:focus-visible {
  outline: 2px solid rgba(29, 137, 197, 0.5);
  outline-offset: 2px;
}

.web-icon-btn,
.web-profile-chip,
.web-links button {
  transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.web-footer-cta,
.web-footer-grid button,
.web-icon-btn,
.web-profile-chip,
.web-links button {
  font-family: inherit;
}

.web-footer-bottom,
.web-footer-intro p,
.web-footer-grid button {
  color: #586a83;
}

.web-footer-grid h5,
.web-footer-brand strong,
.brand,
.web-profile-chip {
  color: #1e2b41;
}

.web-links button.active {
  color: #00857f;
}

.web-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.web-mobile-toggle span {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #2b3c56;
}

.web-mobile-panel {
  display: none;
}

.web-mobile-backdrop {
  display: none;
}

.web-btn {
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.web-btn:hover {
  transform: translateY(-1px);
}

.web-btn.solid {
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.web-btn.ghost {
  background: #fff;
  color: #1f2b3f;
  border-color: #d4dfeb;
}

.web-btn.ghost.active {
  border-color: rgba(44, 125, 203, 0.34);
  background: linear-gradient(120deg, rgba(0, 161, 154, 0.08) 0%, rgba(47, 155, 223, 0.08) 100%);
  color: #163252;
}

.explore-stage > .explore-hero,
.explore-stage > .explore-scroll {
  opacity: 0;
  transform: translateY(12px);
}

.explore-stage.is-ready > .explore-hero,
.explore-stage.is-ready > .explore-scroll {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.explore-stage.is-ready > .explore-scroll {
  transition-delay: 0.08s;
}

@media (prefers-reduced-motion: reduce) {
  .explore-stage > .explore-hero,
  .explore-stage > .explore-scroll,
  .explore-stage.is-ready > .explore-hero,
  .explore-stage.is-ready > .explore-scroll {
    transition: none;
    transform: none;
    opacity: 1;
  }
}

.explore-hero {
  background: linear-gradient(152deg, rgba(255, 255, 255, 0.96), rgba(239, 247, 255, 0.92));
  border: 1px solid var(--fx-card-border);
  box-shadow: var(--fx-card-shadow);
  border-radius: 24px;
  margin-top: 20px;
  padding: 22px 24px 14px;
}

.explore-scroll {
  overflow: visible;
  padding: 24px 0 50px;
  background: transparent;
}

.explore-scroll.search-mode {
  display: block;
}

.explore-footer {
  margin-top: 20px;
  padding: 40px 0 0;
  border-top: 1px solid rgba(30, 47, 71, 0.12);
  background:
    radial-gradient(circle at 86% 18%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 46%),
    linear-gradient(180deg, rgba(247, 252, 255, 0.96), rgba(236, 246, 252, 0.98));
  backdrop-filter: blur(10px);
}

.explore-footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(182, 203, 228, 0.55);
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 20px 36px rgba(30, 58, 92, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.footer-intro {
  display: grid;
  gap: 10px;
}

.explore-footer-grid .footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.explore-footer-grid .footer-brand strong {
  font-size: 20px;
  color: #1c2d44;
  letter-spacing: -0.4px;
}

.footer-chip {
  justify-self: start;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #0f756f;
  border: 1px solid rgba(0, 161, 154, 0.3);
  background: rgba(230, 252, 249, 0.95);
  border-radius: 999px;
  padding: 5px 10px;
  font-weight: 800;
}

.explore-footer-grid p {
  margin: 0;
  color: #5b7192;
  font-size: 13px;
  line-height: 1.55;
}

.explore-footer-grid h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  color: #1f3450;
}

.footer-hicon {
  width: 18px;
  height: 18px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  background: rgba(227, 240, 255, 0.9);
  color: #2a4a70;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
}

.footer-hicon::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: currentColor;
}

.footer-hicon--product {
  background: rgba(223, 241, 255, 0.95);
  border-color: rgba(87, 156, 217, 0.35);
  color: #2f5f89;
}

.footer-hicon--product::before {
  width: 4px;
  height: 4px;
  border-radius: 1px;
  box-shadow:
    5px 0 0 currentColor,
    0 5px 0 currentColor,
    5px 5px 0 currentColor;
  transform: translate(-2px, -2px);
}

.footer-hicon--legal {
  background: rgba(229, 248, 241, 0.95);
  border-color: rgba(45, 154, 120, 0.35);
  color: #1f7f5b;
}

.footer-hicon--legal::before {
  width: 9px;
  height: 10px;
  border-radius: 2px 2px 5px 5px;
  clip-path: polygon(50% 0%, 95% 18%, 82% 100%, 18% 100%, 5% 18%);
}

.footer-hicon--account {
  background: rgba(248, 238, 255, 0.95);
  border-color: rgba(145, 111, 203, 0.35);
  color: #6c4fb0;
}

.footer-hicon--account::before {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  transform: translateY(-3px);
}

.footer-hicon--account::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 6px;
  border-radius: 6px 6px 4px 4px;
  background: currentColor;
  transform: translateY(4px);
}

.explore-footer-grid ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.explore-footer-grid button {
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  color: #50637f;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
}

.explore-footer-grid button:hover {
  color: #113352;
}

.footer-cta {
  display: inline-flex;
  justify-self: start;
  align-items: center;
  border-radius: 999px;
  padding: 10px 14px !important;
  font-size: 13px;
  font-weight: 700 !important;
  color: #fff !important;
  background: linear-gradient(120deg, #00a19a 0%, #2f9bdf 100%) !important;
  box-shadow: 0 10px 18px rgba(30, 128, 196, 0.24);
}

.explore-footer-bottom {
  margin-top: 14px;
  padding: 12px 0 20px;
  border-top: 1px solid rgba(30, 47, 71, 0.11);
  color: #60748f;
  font-size: 12px;
}

.search-input {
  background: rgba(245, 250, 255, 0.9);
  border-color: #d8e3ee;
  min-height: 48px;
  border-radius: 15px;
}

.search-btn {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  box-shadow: 0 10px 18px rgba(30, 128, 196, 0.24);
  min-height: 34px;
  padding: 7px 13px;
}

.web-btn,
.search-btn,
.btn-claim,
.hero-quick-links button,
.search-back-btn,
.load-more-btn,
.foryou-empty-btn,
.verified-empty-btn,
.footer-cta,
.prop-passport-btn,
.feed-see-all {
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .search-btn:hover,
  .btn-claim:hover,
  .hero-quick-links button:hover,
  .search-back-btn:hover,
  .load-more-btn:hover,
  .foryou-empty-btn:hover,
  .verified-empty-btn:hover,
  .footer-cta:hover,
  .prop-passport-btn:hover,
  .feed-see-all:hover {
    transform: translateY(-1px);
  }

  .search-btn:hover,
  .btn-claim:hover,
  .foryou-empty-btn:hover,
  .verified-empty-btn:hover,
  .footer-cta:hover,
  .prop-passport-btn:hover,
  .feed-see-all:hover {
    box-shadow: 0 10px 18px rgba(30, 128, 196, 0.22);
  }

  .search-back-btn:hover,
  .load-more-btn:hover {
    box-shadow: 0 8px 14px rgba(30, 58, 96, 0.14);
  }
}

.search-input:focus-visible,
.web-btn:focus-visible,
.search-btn:focus-visible,
.btn-claim:focus-visible,
.hero-quick-links button:focus-visible,
.search-back-btn:focus-visible,
.load-more-btn:focus-visible,
.foryou-empty-btn:focus-visible,
.verified-empty-btn:focus-visible,
.footer-cta:focus-visible,
.exp-dist-btn:focus-visible {
  outline: 2px solid rgba(29, 137, 197, 0.5);
  outline-offset: 2px;
}

.prop-card,
.saved-search-card,
.saved-search-compact,
.market-pulse-card,
.my-passport-card,
.foryou-empty,
.verified-empty,
.no-passport-card,
.next-action-card,
.add-property-card {
  border: 1px solid var(--fx-card-border);
  box-shadow: var(--fx-card-shadow);
}

.prop-card {
  border-radius: 20px;
}

.prop-card:hover {
  box-shadow: 0 18px 30px rgba(26, 60, 102, 0.13);
}

.prop-body {
  padding: 13px 15px 12px;
}

.prop-footer {
  padding-top: 10px;
}

.prop-passport-btn,
.feed-see-all,
.my-passport-arrow {
  background-image: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  border: 0;
}

.feed-see-all {
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.prop-passport-btn {
  padding: 6px 12px;
}

.feed-header {
  margin-bottom: 11px;
}

.feed-sub {
  margin-bottom: 18px;
}

.explore-footer-grid {
  gap: 20px;
  padding: 20px;
}

.explore-footer-grid button {
  transition: color 0.18s ease, transform 0.18s ease;
}

@media (hover: hover) and (pointer: fine) {
  .explore-footer-grid button:hover {
    transform: translateX(1px);
  }
}

.explore-greeting-sub {
  color: #5b7192;
  font-weight: 600;
}

.explore-title {
  font-size: 30px;
  line-height: 1.05;
  letter-spacing: -0.8px;
  color: #152942;
}

.claim-banner,
.passport-status-card,
.portfolio-card,
.pro-dark-card {
  border: 1px solid rgba(120, 160, 205, 0.28);
  box-shadow: 0 16px 28px rgba(26, 54, 93, 0.15);
}

@media (min-width: 981px) and (max-width: 1099px) {
  .hero-row1 {
    align-items: flex-start;
  }

  .hero-meta-grid {
    grid-template-columns: 1fr;
  }

  .hero-kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .explore-scroll:not(.search-mode) {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }

  .explore-scroll:not(.search-mode) > * {
    grid-column: span 4;
    margin-bottom: 0;
  }

  .explore-scroll:not(.search-mode) > .claim-banner,
  .explore-scroll:not(.search-mode) > .passport-status-card,
  .explore-scroll:not(.search-mode) > .portfolio-card,
  .explore-scroll:not(.search-mode) > .feed-header,
  .explore-scroll:not(.search-mode) > .feed-sub,
  .explore-scroll:not(.search-mode) > .horiz-feed,
  .explore-scroll:not(.search-mode) > .skeletons,
  .explore-scroll:not(.search-mode) > .verified-empty,
  .explore-scroll:not(.search-mode) > .foryou-empty,
  .explore-scroll:not(.search-mode) > .market-pulse-card {
    grid-column: 1 / -1;
  }

  .explore-scroll:not(.search-mode) > .horiz-feed {
    overflow: visible;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .explore-scroll:not(.search-mode) .prop-card-horiz {
    min-width: 0;
  }

  .explore-scroll.search-mode {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 16px;
  }

  .explore-scroll.search-mode > .search-back-row,
  .explore-scroll.search-mode > .skeletons,
  .explore-scroll.search-mode > .no-results-msg,
  .explore-scroll.search-mode > .load-more-sentinel,
  .explore-scroll.search-mode > .load-more-end {
    grid-column: 1 / -1;
  }

  .explore-scroll.search-mode > .prop-card {
    grid-column: span 4;
    margin-bottom: 0;
  }

  .explore-scroll.search-mode > .skeletons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .explore-scroll.search-mode > .skeletons .skeleton-card {
    height: 228px;
  }
}

@media (min-width: 1100px) {
  .hero-row1 {
    align-items: flex-start;
  }

  .search-wrap {
    max-width: 920px;
  }

  .hero-meta-grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
    align-items: stretch;
    gap: 12px;
    padding-top: 12px;
  }

  .hero-meta-card {
    padding: 18px;
    border-radius: 18px;
  }

  .hero-kpi-grid {
    grid-template-columns: 1fr;
  }

  .hero-kpi {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    border-radius: 16px;
  }

  .hero-kpi strong {
    font-size: 22px;
    margin-top: -1px;
  }

  .hero-kpi span {
    margin-top: 0;
  }

  .explore-scroll:not(.search-mode) {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 18px;
    align-items: start;
  }

  .explore-scroll:not(.search-mode) > * {
    margin-bottom: 0;
    grid-column: span 6;
  }

  .explore-scroll:not(.search-mode) > .claim-banner,
  .explore-scroll:not(.search-mode) > .passport-status-card,
  .explore-scroll:not(.search-mode) > .portfolio-card,
  .explore-scroll:not(.search-mode) > .search-back-row,
  .explore-scroll:not(.search-mode) > .feed-header,
  .explore-scroll:not(.search-mode) > .feed-sub,
  .explore-scroll:not(.search-mode) > .horiz-feed,
  .explore-scroll:not(.search-mode) > .skeletons,
  .explore-scroll:not(.search-mode) > .verified-empty,
  .explore-scroll:not(.search-mode) > .foryou-empty,
  .explore-scroll:not(.search-mode) > .no-results-msg,
  .explore-scroll:not(.search-mode) > .market-pulse-card {
    grid-column: 1 / -1;
  }

  .explore-scroll:not(.search-mode) > .horiz-feed {
    overflow: visible;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .prop-card {
    border-radius: 22px;
  }

  .prop-img-wrap {
    height: 164px;
  }

  .explore-scroll:not(.search-mode) .prop-card-horiz {
    min-width: 0;
  }

  .explore-scroll.search-mode {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 18px;
    align-items: start;
  }

  .explore-scroll.search-mode > .search-back-row,
  .explore-scroll.search-mode > .skeletons,
  .explore-scroll.search-mode > .no-results-msg,
  .explore-scroll.search-mode > .load-more-sentinel,
  .explore-scroll.search-mode > .load-more-end {
    grid-column: 1 / -1;
  }

  .explore-scroll.search-mode > .prop-card {
    grid-column: span 4;
    margin-bottom: 0;
  }

  .explore-scroll.search-mode > .skeletons {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .explore-scroll.search-mode > .skeletons .skeleton-card {
    height: 240px;
  }
}

@media (max-width: 980px) {
  .explore-web-shell {
    width: calc(100% - 18px);
  }

  .mesh {
    display: none;
  }

  .ambient {
    opacity: 0.15;
  }

  .web-links,
  .web-actions {
    display: none;
  }

  .web-dashboard-top {
    grid-template-columns: 1fr;
  }

  .web-dashboard-footer {
    margin-top: 12px;
    padding-top: 24px;
  }

  .web-footer-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 14px;
    border-radius: 16px;
  }

  .web-footer-brand strong {
    font-size: 18px;
  }

  .web-footer-cta {
    width: 100%;
    justify-content: center;
  }

  .web-footer-bottom {
    margin-top: 14px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  .web-property-spotlight {
    grid-template-columns: 1fr;
  }

  .web-spotlight-media {
    min-height: 190px;
  }

  .web-kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .web-feature-grid,
  .web-reco-grid {
    grid-template-columns: 1fr;
  }

  .homescore-layout,
  .passport-layout {
    grid-template-columns: 1fr;
  }

  .web-score-ring,
  .web-passport-book {
    margin-left: 0;
    justify-self: center;
  }

  .web-mobile-toggle {
    display: inline-flex;
  }

  .web-mobile-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    padding: 0;
    border-radius: 14px;
    border: 0;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: none;
    transform-origin: top;
    transform: scaleY(0.92);
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease;
    position: relative;
    z-index: 2;
  }

  .web-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(16, 27, 43, 0.26);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1;
  }

  .web-mobile-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }

  .web-mobile-panel.open {
    transform: scaleY(1);
    opacity: 1;
    pointer-events: auto;
    max-height: 420px;
    margin: 8px 0 12px;
    padding: 10px;
    border: 1px solid #dbe7f3;
    box-shadow: 0 14px 24px rgba(21, 58, 95, 0.1);
  }

  .web-mobile-panel button {
    border: 1px solid #dde8f3;
    background: #fff;
    color: #22405f;
    border-radius: 10px;
    padding: 10px 12px;
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .web-mobile-panel button.active {
    border-color: rgba(44, 125, 203, 0.34);
    background: linear-gradient(120deg, rgba(0, 161, 154, 0.1) 0%, rgba(47, 155, 223, 0.1) 100%);
    color: #17365a;
  }

  .web-mobile-panel button.claim {
    border: 0;
    color: #fff;
    background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  }

  .explore-hero {
    margin-top: 10px;
    border-radius: 18px;
    padding: 14px 14px 10px;
  }

  .nav-inner {
    min-height: 56px;
    gap: 12px;
  }

  .brand {
    font-size: 14px;
    gap: 8px;
    color: #fff;
  }

  .brand-logo {
    width: 24px;
    height: 24px;
  }

  .explore-title {
    font-size: 22px;
  }

  .explore-lede {
    font-size: 12px;
  }

  .hero-kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero-kpi {
    padding: 10px 9px;
  }

  .hero-kpi strong {
    font-size: 16px;
  }

  .hero-kpi span {
    font-size: 10px;
    letter-spacing: 0.25px;
  }

  .explore-footer {
    margin-top: 12px;
    padding-top: 24px;
  }

  .explore-footer-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 14px;
    border-radius: 16px;
  }

  .explore-footer-grid .footer-brand strong {
    font-size: 18px;
  }

  .footer-cta {
    width: 100%;
    justify-content: center;
  }

  .explore-footer-bottom {
    margin-top: 14px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }
}

@media (max-width: 640px) {
  .web-kpi-row {
    grid-template-columns: 1fr;
  }

  .web-spotlight-body h1 {
    font-size: 30px;
  }

  .web-spotlight-actions {
    flex-direction: column;
  }

  .web-primary,
  .web-secondary {
    width: 100%;
  }

  .hero-row1 {
    align-items: flex-start;
  }

  .hero-copy-stack {
    max-width: calc(100% - 56px);
  }

  .explore-title {
    font-size: 24px;
  }

  .hero-meta-card h2 {
    font-size: 17px;
    line-height: 1.25;
  }

  .hero-meta-card {
    padding: 13px;
  }

  .hero-kpi-grid {
    grid-template-columns: 1fr;
  }

  .hero-kpi {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 10px;
    align-items: center;
  }

  .hero-kpi span {
    margin-top: 0;
  }

  .hero-quick-links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .hero-quick-links button:last-child {
    grid-column: 1 / -1;
  }

  .search-wrap {
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-template-areas:
      'input input input'
      'filter search search';
    gap: 8px;
    align-items: center;
  }

  .search-icon {
    top: 24px;
  }

  .search-input {
    grid-area: input;
    padding: 12px 14px 12px 40px;
    min-height: 46px;
  }

  .exp-dist-btn {
    grid-area: filter;
    position: static;
    transform: none;
    right: auto;
    top: auto;
    justify-content: center;
    padding: 8px 12px;
  }

  .search-btn {
    grid-area: search;
    position: static;
    transform: none;
    right: auto;
    top: auto;
    min-height: 36px;
  }

  .explore-scroll {
    padding-top: 16px;
  }

  .prop-body {
    padding: 12px 13px 11px;
  }

  .prop-price-tag {
    font-size: 14px;
  }
}
</style>
