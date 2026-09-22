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

          <!-- Opens the same Distance & filters modal the dashboard uses. -->
          <button
            class="dsc-filters-btn"
            :class="{ on: hasAnyFilters }"
            type="button"
            aria-label="Distance and filters"
            @click="filtersOpen = true"
          >
            <Icon name="i-lucide-sliders-horizontal" class="dsc-filters-ic" />
            Filters
            <span v-if="hasAnyFilters" class="dsc-filters-dot" aria-hidden="true" />
          </button>

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
        <!-- ── Your space (signed in, role-aware) ─────────────────────────
             Ported from the reference app's Explore, which switched its whole
             body on the user's role. Here it is one block above the public
             browse content, so a guest's page is unchanged and a signed-in
             visitor gets their own starting point first:
               sell / landlord / both - passport status, next step, a Pro,
                                         add another property
               buy / both             - saved search, For You matches
               buy                    - Buyer Passport, market pulse
             Every figure is real (passport, preferences, /market-pulse);
             cells with no data are hidden rather than shown as 0. -->
        <section v-if="signedIn && roleResolved" class="dsc-block rx">
          <div class="dsc-block-head">
            <div>
              <h2 class="dsc-h2">{{ rxTitle }}</h2>
              <p class="dsc-h2-sub">{{ rxSub }}</p>
            </div>
            <NuxtLink to="/dashboard" class="dsc-textlink">
              Open dashboard
              <Icon name="i-lucide-arrow-right" class="dsc-textlink-ic" />
            </NuxtLink>
          </div>

          <!-- Owner, nothing claimed yet: the reference's first-step banner -->
          <div v-if="isOwnerRole && !loadingPassport && !passports.length" class="rx-claim">
            <div class="rx-claim-main">
              <span class="rx-eyebrow rx-eyebrow--light">Your first step</span>
              <h3 class="rx-claim-title">Start your {{ role === 'landlord' ? 'Rental' : 'Property' }} Passport</h3>
              <p class="rx-claim-sub">
                Verify your ownership and build your record, so buyers, tenants and
                solicitors see a verified home from day one.
              </p>
              <button class="rx-claim-btn" type="button" @click="startClaimFlow">
                Claim your Passport
                <Icon name="i-lucide-arrow-right" />
              </button>
            </div>
            <ol class="rx-steps">
              <li><span>1</span>Verify your identity and ownership — takes about 5 minutes</li>
              <li><span>2</span>Upload or auto-fetch your documents (title deed, EPC, certificates)</li>
              <li><span>3</span>Publish and share it with your agent, solicitor or buyers directly</li>
            </ol>
          </div>

          <div class="rx-grid">
            <!-- ── Owner side ── -->
            <template v-if="isOwnerRole">
              <div v-if="loadingPassport" class="rx-card rx-skel" />
              <button
                v-else-if="passports.length"
                type="button"
                class="rx-card rx-psc"
                @click="navigateTo('/passportview/' + primaryPassport.id)"
              >
                <span class="rx-psc-book">
                  <PassportCard
                    :line1="primaryPassport.addressLine1 || primaryPassport.address || ''"
                    :line2="primaryPassport.postcode || ''"
                    :type="primaryPassport.type || (role === 'landlord' ? 'LANDLORD' : 'SELLER')"
                  />
                </span>
                <span class="rx-psc-body">
                  <span class="rx-eyebrow">{{ role === 'landlord' ? 'Rental Passport' : 'Property Passport' }}</span>
                  <strong class="rx-psc-addr">{{ formatAddressLine(primaryPassport.addressLine1 || primaryPassport.address || '') }}</strong>
                  <small class="rx-psc-pc">{{ formatPostcodeDisplay(primaryPassport.postcode) }}</small>
                  <span class="rx-psc-stats">
                    <span>Complete <b>{{ primaryPassport.completionPercentage ?? 0 }}%</b></span>
                    <span v-if="passportDaysActive">Day <b>{{ passportDaysActive }}</b></span>
                  </span>
                </span>
                <span
                  class="rx-ring"
                  role="img"
                  :aria-label="passportScore != null ? `HomeScore ${passportScore} out of 100` : 'HomeScore not yet available'"
                >
                  <svg viewBox="0 0 58 58" aria-hidden="true">
                    <circle cx="29" cy="29" r="24" class="rx-ring-bg" />
                    <circle cx="29" cy="29" r="24" class="rx-ring-fill" :stroke-dashoffset="passportDashoffset" />
                  </svg>
                  <span class="rx-ring-num">{{ passportScore ?? '–' }}</span>
                  <span class="rx-ring-lbl">HomeScore</span>
                </span>
              </button>

              <button
                v-if="passports.length"
                type="button"
                class="rx-card rx-row"
                @click="navigateTo('/passportview/' + primaryPassport.id)"
              >
                <img src="/homescore-icon/lightning.png" alt="" class="rx-row-ic" loading="lazy" />
                <span class="rx-row-body">
                  <strong>{{ nextActionLabel }}</strong>
                  <small>{{ nextActionSub }}</small>
                </span>
                <span class="rx-row-cta">Continue</span>
              </button>

              <button
                v-if="role !== 'both'"
                type="button"
                class="rx-card rx-row rx-row--dark"
                @click="installerSheetOpen = true"
              >
                <img src="/homescore-icon/wrench.png" alt="" class="rx-row-ic" loading="lazy" />
                <span class="rx-row-body">
                  <strong>{{ proTitle }}</strong>
                  <small>{{ proSub }}</small>
                </span>
                <span class="rx-row-cta">Book</span>
              </button>

              <button v-if="passports.length" type="button" class="rx-card rx-row" @click="startClaimFlow">
                <img src="/dashboard-art/addProperty.png" alt="" class="rx-row-ic" loading="lazy" />
                <span class="rx-row-body">
                  <strong>Add another property</strong>
                  <small>Verify ownership, then choose a Rental or Seller Passport.</small>
                </span>
                <span class="rx-row-cta">Add</span>
              </button>
            </template>

            <!-- ── Buyer side ── -->
            <template v-if="isBuyerSide">
              <button type="button" class="rx-card rx-search" @click="navigateTo('/onboarding/preferences')">
                <span class="rx-search-top">
                  <img
                    :src="hasSavedSearch ? '/op-icons/homescore/magnifier.png' : '/op-icons/misc/addressPin.png'"
                    alt=""
                    class="rx-row-ic"
                    loading="lazy"
                  />
                  <strong>{{ hasSavedSearch ? 'Your saved search' : 'Set up your search' }}</strong>
                  <span class="rx-row-cta">{{ hasSavedSearch ? 'Edit' : 'Add' }}</span>
                </span>
                <span v-if="hasSavedSearch" class="rx-pills">
                  <span v-for="pill in savedSearchPills" :key="pill" class="rx-pill">{{ pill }}</span>
                </span>
                <small v-else class="rx-search-sub">
                  Tell us your area, budget and must-haves. We'll match you to homes that fit.
                </small>
                <small v-if="hasSavedSearch && !loadingProperties && properties.length" class="rx-search-sub">
                  <b>{{ properties.length }} {{ properties.length === 1 ? 'match' : 'matches' }}</b>
                  for your preferences
                </small>
              </button>

              <button
                v-if="role === 'buy'"
                type="button"
                class="rx-card rx-row"
                @click="navigateTo(buyerProfilePublished ? '/buyer-profile/view' : '/buyer-profile/build')"
              >
                <img
                  src="/op-icons/passport-covers/buyer_front_no_tile_no_tilt.png"
                  alt=""
                  class="rx-row-ic"
                  loading="lazy"
                />
                <span class="rx-row-body">
                  <strong>{{ buyerProfilePublished ? 'Buyer Passport · Published' : 'My Buyer Passport' }}</strong>
                  <small>
                    {{
                      buyerProfilePublished
                        ? 'View it or share it with sellers.'
                        : "Prove you're a verified buyer — share it with any agent or seller."
                    }}
                  </small>
                </span>
                <Icon name="i-lucide-chevron-right" class="rx-row-chev" />
              </button>

              <div v-if="role === 'buy' && (pulseHasAny || marketPulseLoading)" class="rx-card rx-pulse">
                <span class="rx-eyebrow">
                  Market pulse<template v-if="pulseArea"> · {{ pulseArea }}</template>
                </span>
                <div v-if="marketPulseLoading && !pulseHasAny" class="rx-skel rx-skel--thin" />
                <div v-else class="rx-pulse-grid">
                  <div v-if="pulseDays !== null">
                    <strong>{{ pulseDays }}</strong>
                    <small>avg days to sell</small>
                  </div>
                  <div v-if="pulseYoY !== null">
                    <strong :class="pulseYoYUp ? 'rx-up' : 'rx-down'">{{ pulseYoY }}</strong>
                    <small>price change YoY</small>
                  </div>
                  <div v-if="pulseListings !== null">
                    <strong>{{ pulseListings }}</strong>
                    <small>passport listings</small>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <ForYouFeed
            v-if="isBuyerSide"
            class="rx-foryou"
            :properties="properties"
            :loading="loadingProperties"
            :needs-postcode="needsPostcode"
            :has-filters="hasAnyForYouFilters"
            @open-filters="openForYouFilters"
            @postcode-saved="refreshForYou"
          />
        </section>

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

            <!-- Opens the passport ecosystem popup. The sample Passport it used
                 to link to straight away is one click further in, as that
                 popup's primary action. -->
            <button
              type="button"
              class="dsc-feature dsc-feature--amber"
              aria-haspopup="dialog"
              @click="openEco"
            >
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

              <!-- Same copy as the app's Property Passport card. -->
              <h3 class="dsc-feature-title">Build your home's<br />verified record</h3>
              <p class="dsc-feature-sub">
                Store, verify and share documents, answers and history in one place.
              </p>

              <span class="dsc-feature-roles" aria-hidden="true">
                <span v-for="c in passportCards" :key="c.key" class="dsc-feature-role">
                  <i :style="{ background: c.color }" />{{ c.title.replace(' Passport', '') }}
                </span>
              </span>

              <span class="dsc-feature-go dsc-feature-go--amber">
                Explore the passports
                <span class="dsc-feature-chev"><Icon name="i-lucide-arrow-right" /></span>
              </span>
            </button>
          </div>
        </section>

        <!-- ── Verified passport properties ─────────────────────────────
             The reference app's "see how other sellers prepared theirs" rail.
             Public endpoint, so guests get it too. Real passport completion and
             EPC per home; nothing is shown until the fetch lands. -->
        <section class="dsc-block">
          <div class="dsc-block-head">
            <div>
              <h2 class="dsc-h2">Verified passport properties</h2>
              <p class="dsc-h2-sub">
                Homes whose owners have already verified them — full records, fewer surprises.
              </p>
            </div>
          </div>

          <div v-if="loadingVerified" class="dsc-grid">
            <div v-for="n in 4" :key="`vsk-${n}`" class="dsc-skeleton" />
          </div>

          <div v-else-if="verifiedDisplay.length" class="dsc-grid">
            <article
              v-for="p in verifiedDisplay"
              :key="p.id"
              class="dsc-card"
              role="link"
              tabindex="0"
              @click="openProperty(p.id)"
              @keydown.enter="openProperty(p.id)"
            >
              <div class="dsc-card-photo">
                <PropertyImage :src="p.imageUrl" :alt="p.addressLine1" :show-caption="false" />
                <span class="dsc-card-flag">
                  <Icon name="i-lucide-badge-check" class="dsc-card-flag-ic" />
                  Passport · {{ p.passportCompletion ?? 0 }}%
                </span>
              </div>
              <div class="dsc-card-body">
                <h3 class="dsc-card-addr">{{ formatAddressLine(p.addressLine1) }}</h3>
                <p class="dsc-card-meta">
                  <template v-if="p.city">{{ p.city }} · </template>{{ p.postcode }}
                </p>
                <div class="dsc-card-foot">
                  <p class="dsc-card-price">{{ formatPrice(p.estimatedPrice) }}</p>
                  <div class="dsc-card-tags">
                    <span v-if="p.propertyType" class="dsc-tag">{{ p.propertyType }}</span>
                    <span v-if="p.tenure" class="dsc-tag">{{ p.tenure }}</span>
                    <span v-if="p.epcRating" class="dsc-tag">EPC {{ p.epcRating }}</span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div v-else class="dsc-empty">
            <span class="dsc-empty-ring"><Icon name="i-lucide-badge-check" class="dsc-empty-ic" /></span>
            <p class="dsc-empty-title">Be among the first</p>
            <p class="dsc-empty-sub">
              No verified passports yet — claim yours and help shape a more transparent market.
            </p>
          </div>
        </section>


        <!-- ── Recently explored ──────────────────────────────────────────
             One fixed-height rail rather than a row per home: however long the
             history gets, it costs the page a single card's height, and the
             rest is a sideways scroll (arrows, trackpad or swipe). Every field
             the old list showed is still on the card. -->
        <section v-if="recentlyExplored.length" class="dsc-block">
          <div class="dsc-block-head">
            <div>
              <h2 class="dsc-h2">
                Recently explored
                <span class="dsc-recent-count">{{ recentlyExplored.length }}</span>
              </h2>
              <p class="dsc-h2-sub">Saved in this browser — no account involved</p>
            </div>
            <div class="dsc-recent-tools">
              <button class="dsc-textlink" type="button" @click="clearHistory">
                <Icon name="i-lucide-trash-2" class="dsc-textlink-ic" />
                Clear
              </button>
              <button
                class="dsc-recent-arrow"
                type="button"
                aria-label="Scroll back"
                :disabled="!recentCanPrev"
                @click="scrollRecent(-1)"
              >
                <Icon name="i-lucide-chevron-left" />
              </button>
              <button
                class="dsc-recent-arrow"
                type="button"
                aria-label="Scroll forward"
                :disabled="!recentCanNext"
                @click="scrollRecent(1)"
              >
                <Icon name="i-lucide-chevron-right" />
              </button>
            </div>
          </div>

          <div class="dsc-recent-wrap" :class="{ 'is-start': !recentCanPrev, 'is-end': !recentCanNext }">
            <ul ref="recentRailEl" class="dsc-recent" @scroll.passive="updateRecentArrows">
              <li
                v-for="item in recentlyExplored"
                :key="item.id"
                class="dsc-recent-card"
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
                  <span class="dsc-recent-when">
                    <Icon name="i-lucide-clock-3" />
                    {{ relativeTimeLabel(item.viewedAt) }}
                  </span>
                </div>
                <div class="dsc-recent-body">
                  <p class="dsc-recent-addr">{{ item.addressLine1 }}</p>
                  <p class="dsc-recent-meta">
                    <template v-if="item.city">{{ item.city }}, </template>{{ item.postcode }}
                  </p>
                  <div class="dsc-recent-foot">
                    <div>
                      <p class="dsc-recent-price">{{ formatPrice(item.estimatedPrice) }}</p>
                      <p class="dsc-recent-sold">
                        {{ item.lastSoldDate ? `Last sold ${lastSoldLabel(item.lastSoldDate)}` : 'Estimated value' }}
                      </p>
                    </div>
                    <span class="dsc-recent-go"><Icon name="i-lucide-arrow-up-right" /></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
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

    <PropertySearchFiltersModal
      v-model="filtersOpen"
      :initial-filters="committedFilters"
      @search="onFiltersSearch"
    />

    <PropertySearchFiltersModal
      v-model="forYouFiltersModalOpen"
      :initial-filters="forYouPendingFilters"
      @search="onForYouFiltersSearch"
    />

    <!-- ── Passport ecosystem popup ─────────────────────────────────────
         Opened from the Property Passport card. Same content that used to
         sit on the page (hero, blurb, the four passports and the power rail,
         matching the app's PassportEcosystemDrawer) - moved into a dialog so
         the page stays short.
         Esc, the close button or a click on the backdrop dismisses it; the
         page behind stops scrolling while it is open. -->
    <Teleport to="body">
      <Transition name="dsc-eco-pop">
        <div
          v-if="ecoOpen"
          class="dsc-eco-overlay"
          @click.self="closeEco"
        >
          <section
            ref="ecoDialogEl"
            class="dsc-eco dsc-eco--dialog"
            :class="{ 'is-scrolled': ecoScrolled, 'is-end': ecoAtEnd }"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dsc-eco-heading"
            tabindex="-1"
          >
            <button
              ref="ecoCloseEl"
              type="button"
              class="dsc-eco-close"
              aria-label="Close"
              @click="closeEco"
            >
              <Icon name="i-lucide-x" />
            </button>

            <div ref="ecoScrollEl" class="dsc-eco-scroll" @scroll.passive="updateEcoScroll">
                <span class="dsc-eco-glow" aria-hidden="true" />

                <div class="dsc-eco-head">
                  <div class="dsc-eco-head-text">
                    <p class="dsc-eco-eyebrow">The passport ecosystem</p>
                    <h2 id="dsc-eco-heading" class="dsc-eco-title">One home.<br />Many passports<span class="dsc-dot">.</span></h2>
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

            </div>

            <!-- Sticky action bar: the sample Passport the card used to open
                 directly, plus the way in to starting one. -->
            <div class="dsc-eco-actions">
              <p class="dsc-eco-actions-note">
                <Icon name="i-lucide-sparkles" />
                See exactly what buyers, agents and solicitors get.
              </p>
              <div class="dsc-eco-actions-btns">
                <button type="button" class="dsc-eco-btn" @click="goToSamplePassport">
                  See a sample Passport
                  <Icon name="i-lucide-arrow-right" />
                </button>
                <button type="button" class="dsc-eco-btn dsc-eco-btn--ghost" @click="startPassportFromEco">
                  {{ signedIn ? 'Start my Passport' : 'Create a free account' }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>

    <InstallerFlowSheet
      v-model:open="installerSheetOpen"
      kind="gas"
      measure-title="Gas safety check (CP12)"
      :property-id="primaryPassport.propertyId || null"
      :postcode="primaryPassport.postcode || profile?.postcode || ''"
      :address="primaryPassport.addressLine1 || primaryPassport.address || ''"
      initial-state="routes"
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

import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import AuthGateModal from '~/components/ui/AuthGateModal.vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import PropertySearchFiltersModal, {
  type PropertySearchFilters,
} from '~/components/property/PropertySearchFiltersModal.vue'
import { usePropertySearch } from '~/composables/usePropertySearch'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import ForYouFeed from '~/components/property/ForYouFeed.vue'
import InstallerFlowSheet from '~/components/homescore/InstallerFlowSheet.vue'
import { usePropertyForYou } from '~/composables/usePropertyForYou'
import { formatAddressLine, formatPostcodeDisplay } from '~/utils/addressDisplay'
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
      { query: { q: effective, offset: 0, limit: 24, ...searchFilterParams() } },
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

// ── Distance & filters ────────────────────────────────────────────────────
// The same modal the dashboard's For You feed uses. Everything it sets is
// passed to /property/search, which filters on propertyType, bedrooms, EPC,
// price and passport status.
//
// Radius is the exception: the search endpoint ignores it, so rather than
// show a control that does nothing, it drives the Exact/Nearby scope this
// page already has - "exact address only" keeps the query as typed, any
// wider radius widens a full postcode to its outward code.
const filtersOpen = ref(false)
const committedFilters = ref<PropertySearchFilters>({
  radius: null,
  propertyType: ['any'],
  minBedrooms: null,
  maxBedrooms: null,
  minEpc: null,
  minPrice: null,
  maxPrice: null,
  passportStatus: [],
})

const hasAnyFilters = computed(() => {
  const f = committedFilters.value
  return (
    !(f.propertyType.length === 1 && f.propertyType[0] === 'any') ||
    f.minBedrooms != null ||
    f.maxBedrooms != null ||
    f.minEpc != null ||
    f.minPrice != null ||
    f.maxPrice != null ||
    f.passportStatus.length > 0
  )
})

function searchFilterParams(): Record<string, string> {
  const f = committedFilters.value
  const p: Record<string, string> = {}
  if (f.propertyType.length && !(f.propertyType.length === 1 && f.propertyType[0] === 'any')) {
    p.propertyType = f.propertyType.join(',')
  }
  if (f.minBedrooms != null) p.minBedrooms = String(f.minBedrooms)
  if (f.maxBedrooms != null) p.maxBedrooms = String(f.maxBedrooms)
  if (f.minEpc != null) p.minEpc = f.minEpc
  if (f.minPrice != null) p.minPrice = String(f.minPrice)
  if (f.maxPrice != null) p.maxPrice = String(f.maxPrice)
  if (f.passportStatus.length) p.passportStatus = f.passportStatus.join(',')
  return p
}

function onFiltersSearch(filters: PropertySearchFilters) {
  committedFilters.value = filters
  // radius null or 0 means "exact address only" in the modal.
  if (scopeAvailable.value) {
    searchScope.value = !filters.radius ? 'exact' : 'nearby'
  }
  const q = lastQuery.value || scopeQuery.value
  if (q) runQuery(q)
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

// ── Passport ecosystem popup ──────────────────────────────────────────────
const ecoOpen = ref(false)
const ecoCloseEl = ref<HTMLElement | null>(null)
// Scroll position of the popup body: drives the hairline shadows under the
// top edge and above the action bar, which only show while there is more
// content hidden on that side.
const ecoScrollEl = ref<HTMLElement | null>(null)
const ecoScrolled = ref(false)
const ecoAtEnd = ref(false)
function updateEcoScroll() {
  const el = ecoScrollEl.value
  if (!el) return
  ecoScrolled.value = el.scrollTop > 4
  ecoAtEnd.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 4
}
let ecoReturnFocus: HTMLElement | null = null

function openEco() {
  ecoReturnFocus = (document.activeElement as HTMLElement) ?? null
  ecoOpen.value = true
}
function closeEco() {
  ecoOpen.value = false
}
function onEcoKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && ecoOpen.value) closeEco()
}
watch(ecoOpen, (open) => {
  if (typeof document === 'undefined') return
  // Lock the page behind the dialog, and hand focus in and back out again.
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (open) {
    nextTick(() => {
      ecoCloseEl.value?.focus({ preventScroll: true })
      if (ecoScrollEl.value) ecoScrollEl.value.scrollTop = 0
      updateEcoScroll()
    })
  } else {
    ecoReturnFocus?.focus?.()
    ecoReturnFocus = null
  }
})

function goToSamplePassport() {
  closeEco()
  navigateTo('/passport/sample')
}

function startPassportFromEco() {
  if (hasToken()) {
    closeEco()
    navigateTo('/claim')
    return
  }
  closeEco()
  authGateCopy.value = {
    title: 'Create a free account to start your Passport',
    body: 'Verify your home once and reuse it as a seller, landlord or buyer.',
  }
  authGateRedirect.value = '/claim'
  authGateOpen.value = true
}

function onPassportCardClick(card: { key: string; status: string }) {
  if (card.status === 'soon') return
  // The cards now live inside the popup - close it before navigating or
  // handing over to the sign-in modal, so the two never stack.
  closeEco()
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


// ── Your space (signed in, role-aware) ───────────────────────────────────
// Ported from the reference app's Explore, which rendered a different body
// per role. Same sources as there and as /dashboard: role from
// /profile/preferences (cached as umu_role), passports from
// /profile/passports, buyer side from /buyer-profile and /property/for-you.
const role = ref<string>('buy')
const roleResolved = ref(false)
const preferences = ref<any>(null)
const passports = ref<any[]>([])
const loadingPassport = ref(true)
const buyerProfilePublished = ref(false)
const installerSheetOpen = ref(false)

const isOwnerRole = computed(() => ['sell', 'landlord', 'both'].includes(role.value))
const isBuyerSide = computed(() => role.value === 'buy' || role.value === 'both')

function normalizeRole(r: unknown): string {
  const allowed = ['sell', 'buy', 'both', 'landlord']
  return typeof r === 'string' && allowed.includes(r) ? r : 'buy'
}

const rxTitle = computed(() => {
  if (role.value === 'landlord') return 'Your rental at a glance'
  if (role.value === 'both') return 'Your move at a glance'
  if (role.value === 'sell') return 'Your home at a glance'
  return 'Your search at a glance'
})
const rxSub = computed(() => {
  if (role.value === 'landlord') return 'Your Rental Passport, what to do next and certified pros.'
  if (role.value === 'both') return 'The home you are selling and the one you are looking for.'
  if (role.value === 'sell') return 'Your Property Passport, what to do next and certified pros.'
  return 'Your saved search, your Buyer Passport and fresh matches.'
})

// Seller-first for sell/both and landlord-first for landlord, falling back to
// whatever is first - the same pick /dashboard makes.
const primaryPassport = computed<any>(() => passports.value[0] ?? {})

// null = nobody has run a HomeScore yet, so the ring reads "–".
const passportScore = computed(() => {
  const hs = primaryPassport.value?.homeScore
  return typeof hs === 'number' ? hs : null
})
// r=24 circle -> circumference 150.8
const passportDashoffset = computed(() => {
  const sc = passportScore.value
  if (sc == null) return '150.8'
  return (150.8 * (1 - Math.min(Math.max(sc, 0), 100) / 100)).toFixed(1)
})

const passportDaysActive = computed(() => {
  const createdAt = primaryPassport.value?.createdAt
  if (!createdAt) return null
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
  return days > 0 ? days : 1
})

const nextActionLabel = computed(() => {
  const pct = primaryPassport.value?.completionPercentage ?? 0
  if (pct >= 100) return 'Publish your passport'
  if (pct >= 80) return 'Almost there — finish your passport'
  if (pct >= 40) return 'Continue your passport'
  return 'Pick up where you left off'
})
const nextActionSub = computed(
  () => `Passport ${primaryPassport.value?.completionPercentage ?? 0}% complete`,
)

const proTitle = computed(() => {
  if (!passports.value.length) return 'Need certificates? Find a Pro'
  return role.value === 'landlord' ? 'Book a gas safety engineer' : 'Book a gas safety check'
})
const proSub = computed(() =>
  passports.value.length
    ? 'The certificate lands in your Passport automatically.'
    : 'Gas, EICR, EPC — certificates land in your Passport automatically.',
)

// ── Saved search (buyer) ──
function formatBudget(n?: number | null): string {
  if (!n) return ''
  if (n >= 1_000_000) return '£' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm'
  if (n >= 1_000) return '£' + Math.round(n / 1000) + 'k'
  return '£' + n
}

const userPostcode = computed(() => profile.value?.postcode?.trim() || '')

const savedSearchPills = computed(() => {
  const pr = preferences.value
  if (!pr) return []
  const pills: string[] = []
  if (userPostcode.value) pills.push(`${userPostcode.value} area`)
  const types: string[] = Array.isArray(pr.propertyTypes) ? pr.propertyTypes : []
  if (types.length) pills.push(types.slice(0, 2).join(' / '))
  if (pr.budgetMin && pr.budgetMax) {
    pills.push(`${formatBudget(pr.budgetMin)} – ${formatBudget(pr.budgetMax)}`)
  } else if (pr.budgetMax) {
    pills.push(`Up to ${formatBudget(pr.budgetMax)}`)
  } else if (pr.budgetMin) {
    pills.push(`From ${formatBudget(pr.budgetMin)}`)
  }
  const features: string[] = Array.isArray(pr.importantFeatures) ? pr.importantFeatures : []
  if (features.some((f) => /passport/i.test(f))) pills.push('Has Passport')
  return pills
})
const hasSavedSearch = computed(() => savedSearchPills.value.length > 0)

// ── Market pulse (buyer) ──
// Aggregate stats for the user's postcode sector. The backend returns null
// for any figure it can't derive, and the template hides those cells.
interface MarketPulse {
  area: string | null
  priceChangeYoY: number | null
  avgDaysToSell: number | null
  passportListings: number
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
    marketPulse.value = await $fetch<MarketPulse>(`${config.public.apiBase}/property/market-pulse`, {
      query: { postcode: pc },
    })
  } catch {
    marketPulse.value = null
  } finally {
    marketPulseLoading.value = false
  }
}
watch(userPostcode, (pc) => {
  if (pc && signedIn.value && role.value === 'buy') fetchMarketPulse()
})

const pulseArea = computed(() => marketPulse.value?.area || userPostcode.value || '')
const pulseYoY = computed<string | null>(() => {
  const v = marketPulse.value?.priceChangeYoY
  if (typeof v !== 'number') return null
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}%`
})
const pulseYoYUp = computed(() => (marketPulse.value?.priceChangeYoY ?? 0) >= 0)
// A zero-listing count on its own is not a market signal, just an empty
// sector, so it only counts once another figure is present too.
const pulseListings = computed<number | null>(() => {
  const n = marketPulse.value?.passportListings
  return typeof n === 'number' ? n : null
})
const pulseDays = computed<number | null>(() => marketPulse.value?.avgDaysToSell ?? null)
const pulseHasAny = computed(
  () =>
    pulseYoY.value !== null ||
    pulseDays.value !== null ||
    (pulseListings.value !== null && pulseListings.value > 0),
)

// ── For You (buyer side) ──
const {
  properties,
  loadingProperties,
  needsPostcode,
  forYouFiltersModalOpen,
  forYouPendingFilters,
  hasAnyForYouFilters,
  openForYouFilters,
  onForYouFiltersSearch,
  refreshForYou,
} = usePropertyForYou()

function startClaimFlow() {
  navigateTo('/claim')
}

async function loadYourSpace(token: string) {
  const auth = { headers: { Authorization: `Bearer ${token}` } }

  const cached = localStorage.getItem('umu_role')
  if (cached) role.value = normalizeRole(cached)

  const prefs = await $fetch<any>(`${config.public.apiBase}/profile/preferences`, auth).catch(
    () => null,
  )
  preferences.value = prefs
  role.value = normalizeRole((prefs?.purpose as string[])?.[0] ?? cached)
  localStorage.setItem('umu_role', role.value)
  roleResolved.value = true

  if (isBuyerSide.value) {
    refreshForYou().finally(() => {
      loadingProperties.value = false
    })
  }
  if (role.value === 'buy') {
    $fetch<any>(`${config.public.apiBase}/buyer-profile`, auth)
      .then((bp) => {
        buyerProfilePublished.value = !!bp?.published
      })
      .catch(() => {})
    if (userPostcode.value) fetchMarketPulse()
  }

  if (isOwnerRole.value) {
    const all = await $fetch<any[]>(`${config.public.apiBase}/profile/passports`, auth).catch(
      () => null,
    )
    if (all) {
      const wanted = role.value === 'landlord' ? 'LANDLORD' : 'SELLER'
      const matching = all.filter((x: any) => x.type === wanted)
      passports.value = matching.length ? matching : all
    }
  }
  loadingPassport.value = false
}

// ── Verified passport properties (public) ──
const verifiedProperties = ref<any[]>([])
const loadingVerified = ref(true)
const verifiedDisplay = computed(() => verifiedProperties.value.slice(0, 8))

async function loadVerified() {
  try {
    const res = await $fetch<{ items: any[] }>(
      `${config.public.apiBase}/property/verified-passports`,
      { query: { limit: 12 } },
    )
    verifiedProperties.value = res?.items ?? []
  } catch {
    verifiedProperties.value = []
  } finally {
    loadingVerified.value = false
  }
}

// ── Recently explored ─────────────────────────────────────────────────────
// The rail scrolls sideways; the arrows page it by roughly one screen of cards
// and grey out at either end.
const recentRailEl = ref<HTMLElement | null>(null)
const recentCanPrev = ref(false)
const recentCanNext = ref(false)

function updateRecentArrows() {
  const el = recentRailEl.value
  if (!el) return
  recentCanPrev.value = el.scrollLeft > 4
  recentCanNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

function scrollRecent(dir: 1 | -1) {
  const el = recentRailEl.value
  if (!el) return
  el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 260), behavior: 'smooth' })
}

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

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateRecentArrows)
  window.removeEventListener('keydown', onEcoKey)
  document.documentElement.style.overflow = ''
})

onMounted(() => {
  signedIn.value = hasToken()
  if (signedIn.value && !profile.value) fetchProfile()
  recentlyExplored.value = getRecentlyExplored()
  nextTick(updateRecentArrows)
  window.addEventListener('resize', updateRecentArrows, { passive: true })
  window.addEventListener('keydown', onEcoKey)

  loadVerified()
  if (signedIn.value) {
    const token = localStorage.getItem('token')
    if (token) loadYourSpace(token)
  }

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

/* Filters pill — sits between the scope toggle and Search */
.dsc-filters-btn {
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border: 1px solid #e2e6ec;
  border-radius: 15px;
  background: #fff;
  color: #3b4b60;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.16s ease, color 0.16s ease, background 0.16s ease;
}
.dsc-filters-btn:hover { border-color: #c3cdd9; color: #16283f; }
.dsc-filters-btn.on {
  border-color: rgba(0, 161, 154, 0.45);
  background: rgba(0, 161, 154, 0.08);
  color: #00857f;
}
.dsc-filters-ic { width: 16px; height: 16px; }
.dsc-filters-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00a19a;
}

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
/* The corner washes are gone here too, so these three cards match the two
   big ones below them: white card, no tint. */
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
/* The teal and amber washes that used to tint these two cards are gone -
   the cards sit flat on the page like the rest of the explore look. The
   element stays so the markup and any future accent hook are unchanged. */
.dsc-feature-glow {
  display: none;
}

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

/* ── Recently explored ────────────────────────────────────────────────── */
.dsc-recent-count {
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  margin-left: 8px;
  border-radius: 999px;
  background: #eafaf8;
  color: #00756f;
  font-size: 13px;
  font-weight: 800;
  vertical-align: 4px;
  letter-spacing: 0;
}
.dsc-recent-tools { display: flex; align-items: center; gap: 8px; }
.dsc-recent-arrow {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid #e3e1ea;
  background: #fff;
  color: #231d45;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}
.dsc-recent-arrow :deep(svg) { width: 18px; height: 18px; }
.dsc-recent-arrow:hover:not(:disabled) { background: #231d45; border-color: #231d45; color: #fff; }
.dsc-recent-arrow:disabled { opacity: 0.35; cursor: default; }

/* Soft fade at whichever edge still has cards beyond it. */
.dsc-recent-wrap { position: relative; }
.dsc-recent-wrap::before,
.dsc-recent-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 12px;
  width: 44px;
  z-index: 1;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.dsc-recent-wrap::before { left: 0; background: linear-gradient(90deg, #f3f2ef, rgba(243, 242, 239, 0)); }
.dsc-recent-wrap::after { right: 0; background: linear-gradient(270deg, #f3f2ef, rgba(243, 242, 239, 0)); }
.dsc-recent-wrap.is-start::before,
.dsc-recent-wrap.is-end::after { opacity: 0; }

.dsc-recent {
  list-style: none;
  margin: 0;
  padding: 4px 2px 12px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 262px;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 2px;
  scrollbar-width: none;
}
.dsc-recent::-webkit-scrollbar { display: none; }

.dsc-recent-card {
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 1px 2px rgba(26, 21, 53, 0.04), 0 8px 20px rgba(26, 21, 53, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.dsc-recent-card:hover,
.dsc-recent-card:focus-visible {
  outline: none;
  transform: translateY(-3px);
  border-color: rgba(0, 161, 154, 0.28);
  box-shadow: 0 2px 4px rgba(26, 21, 53, 0.05), 0 18px 36px rgba(26, 21, 53, 0.11);
}
.dsc-recent-photo {
  position: relative;
  height: 138px;
  background: #eceaf3;
  overflow: hidden;
}
.dsc-recent-photo :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.dsc-recent-card:hover .dsc-recent-photo :deep(img) { transform: scale(1.05); }
.dsc-recent-when {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(20, 16, 47, 0.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.dsc-recent-when :deep(svg) { width: 12px; height: 12px; }
.dsc-recent-body { padding: 14px 16px 16px; display: flex; flex-direction: column; flex: 1; }
.dsc-recent-addr {
  margin: 0 0 3px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: #231d45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsc-recent-meta { margin: 0; font-size: 12.5px; font-weight: 600; color: #8a90a6; }
.dsc-recent-foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(35, 29, 69, 0.06);
}
.dsc-recent-price { margin: 0; font-size: 17px; font-weight: 800; color: #00776f; letter-spacing: -0.02em; }
.dsc-recent-sold { margin: 2px 0 0; font-size: 11.5px; font-weight: 600; color: #a3a7b8; }
.dsc-recent-go {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f3f2f7;
  color: #231d45;
  transition: background 0.15s ease, color 0.15s ease;
}
.dsc-recent-go :deep(svg) { width: 16px; height: 16px; }
.dsc-recent-card:hover .dsc-recent-go { background: #00a19a; color: #fff; }

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
  .dsc-recent { grid-auto-columns: 78%; }
  .dsc-recent-arrow { display: none; }
  .dsc-eco-blurb { flex-direction: column; gap: 12px; }
  }

/* ── Your space (signed in, role-aware) ─────────────────────────────────── */
.rx .dsc-textlink { text-decoration: none; }
.rx-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #00a19a;
}
.rx-eyebrow--light { color: #5eead4; }

.rx-claim {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 28px;
  padding: 28px 30px;
  margin-bottom: 18px;
  border-radius: 24px;
  background: linear-gradient(135deg, #241e4c, #14102f 72%);
  color: #fff;
  box-shadow: 0 18px 40px rgba(20, 16, 47, 0.22);
}
.rx-claim-title { margin: 8px 0 8px; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
.rx-claim-sub { margin: 0 0 18px; font-size: 14px; line-height: 1.55; color: #c9c5e6; }
.rx-claim-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border: 0;
  border-radius: 12px;
  background: #00a19a;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s ease;
}
.rx-claim-btn:hover { background: #018e88; }
.rx-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; align-content: center; }
.rx-steps li { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; line-height: 1.5; color: #e4e1f5; }
.rx-steps li span {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(94, 234, 212, 0.16);
  color: #5eead4;
  font-size: 12px;
  font-weight: 800;
}

.rx-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.rx-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  border: 1px solid #e7e4dd;
  border-radius: 18px;
  background: #fff;
  font: inherit;
  text-align: left;
  color: #231d45;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(26, 21, 53, 0.04), 0 6px 16px rgba(26, 21, 53, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
button.rx-card:hover {
  transform: translateY(-2px);
  border-color: #cfe9e6;
  box-shadow: 0 2px 4px rgba(26, 21, 53, 0.05), 0 14px 30px rgba(26, 21, 53, 0.09);
}

/* Passport status spans the row: it is the owner's main object. */
.rx-psc { grid-column: 1 / -1; gap: 20px; padding: 18px 22px; }
.rx-psc-book { flex-shrink: 0; width: 132px; height: 132px; }
.rx-psc-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.rx-psc-addr { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; }
.rx-psc-pc { font-size: 13px; color: #6b7089; }
.rx-psc-stats { display: flex; gap: 16px; margin-top: 8px; font-size: 13px; color: #4a5268; }
.rx-psc-stats b { color: #231d45; }

.rx-ring { position: relative; flex-shrink: 0; width: 76px; height: 76px; display: grid; place-items: center; }
.rx-ring svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.rx-ring-bg { fill: none; stroke: #e5f4f2; stroke-width: 4; }
.rx-ring-fill {
  fill: none;
  stroke: #00a19a;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 150.8;
  transition: stroke-dashoffset 0.6s ease;
}
.rx-ring-num { position: relative; font-size: 20px; font-weight: 800; line-height: 1; margin-top: -8px; }
.rx-ring-lbl {
  position: absolute;
  bottom: 17px;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8a90a6;
}

.rx-row-ic { width: 40px; height: 40px; object-fit: contain; flex-shrink: 0; }
.rx-row-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.rx-row-body strong { font-size: 14.5px; font-weight: 800; }
.rx-row-body small { font-size: 12.5px; color: #6b7089; line-height: 1.45; }
.rx-row-cta {
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eafaf8;
  color: #00756f;
  font-size: 12px;
  font-weight: 800;
}
.rx-row-chev { flex-shrink: 0; width: 18px; height: 18px; color: #8a90a6; }
.rx-row--dark { background: linear-gradient(135deg, #241e4c, #14102f 72%); border-color: transparent; color: #fff; }
.rx-row--dark .rx-row-body small { color: #c9c5e6; }
.rx-row--dark .rx-row-cta { background: #00a19a; color: #fff; }

.rx-search { flex-direction: column; align-items: stretch; gap: 10px; }
.rx-search-top { display: flex; align-items: center; gap: 12px; }
.rx-search-top strong { flex: 1; font-size: 14.5px; font-weight: 800; }
.rx-search-top .rx-row-ic { width: 32px; height: 32px; }
.rx-search-sub { font-size: 12.5px; color: #6b7089; line-height: 1.5; }
.rx-search-sub b { color: #231d45; }
.rx-pills { display: flex; flex-wrap: wrap; gap: 6px; }
.rx-pill {
  padding: 5px 10px;
  border-radius: 999px;
  background: #eafaf8;
  border: 1px solid #cfe9e6;
  color: #00756f;
  font-size: 12px;
  font-weight: 700;
}

.rx-pulse { flex-direction: column; align-items: stretch; gap: 10px; cursor: default; }
.rx-pulse-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 10px; }
.rx-pulse-grid div { padding: 10px 12px; border-radius: 12px; background: #f7f6f2; }
.rx-pulse-grid strong { display: block; font-size: 20px; font-weight: 800; }
.rx-pulse-grid small { font-size: 11.5px; color: #6b7089; }
.rx-up { color: #008a84; }
.rx-down { color: #c73e36; }

.rx-foryou { margin-top: 22px; }

.rx-skel {
  min-height: 132px;
  background: linear-gradient(90deg, #efeee9 0%, #f7f6f2 50%, #efeee9 100%);
  background-size: 200% 100%;
  animation: rx-shimmer 1.3s ease-in-out infinite;
  cursor: default;
}
.rx-card.rx-skel { grid-column: 1 / -1; }
.rx-skel--thin { min-height: 54px; border-radius: 12px; }
@keyframes rx-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@media (max-width: 860px) {
  .rx-claim { grid-template-columns: 1fr; padding: 22px; }
  .rx-grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .rx-psc { flex-wrap: wrap; }
  .rx-psc-book { width: 104px; height: 104px; }
}

/* ── Property Passport card: the four roles it opens onto ───────────────── */
.dsc-feature-roles { display: flex; flex-wrap: wrap; gap: 6px; margin: -4px 0 18px; }
.dsc-feature-role {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.08);
  font-size: 11.5px;
  font-weight: 700;
  color: #4a5268;
}
.dsc-feature-role i { width: 7px; height: 7px; border-radius: 50%; }

/* ── Passport ecosystem popup ──────────────────────────────────────────── */
.dsc-eco-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 28px 20px;
  background: rgba(20, 16, 47, 0.46);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.dsc-eco--dialog {
  width: min(1040px, 100%);
  max-height: min(860px, calc(100dvh - 64px));
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 0 40px 90px rgba(20, 16, 47, 0.35);
  outline: none;
}
.dsc-eco-scroll {
  position: relative;
  flex: 1;
  min-height: 0;
  /* The decorative glow is wider than the panel; without clipping the x axis
     it made the whole body scroll sideways and cut the right edge off. */
  overflow-x: hidden;
  overflow-y: auto;
  padding: 40px 38px 28px;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  /* Slim, rounded scrollbar instead of the platform default. */
  scrollbar-width: thin;
  scrollbar-color: rgba(35, 29, 69, 0.22) transparent;
}
.dsc-eco-scroll::-webkit-scrollbar { width: 12px; }
.dsc-eco-scroll::-webkit-scrollbar-track { background: transparent; margin: 72px 0 12px; }
.dsc-eco-scroll::-webkit-scrollbar-thumb {
  background: rgba(35, 29, 69, 0.2);
  border-radius: 999px;
  border: 4px solid transparent;
  background-clip: padding-box;
}
.dsc-eco-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(35, 29, 69, 0.34); }

/* Edge shadows: a hairline under the top once scrolled, and above the
   action bar while there is still content below. */
.dsc-eco--dialog::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 18px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(26, 21, 53, 0.08), rgba(26, 21, 53, 0));
  opacity: 0;
  transition: opacity 0.2s ease;
}
.dsc-eco--dialog.is-scrolled::before { opacity: 1; }
.dsc-eco--dialog:not(.is-end) .dsc-eco-actions { box-shadow: 0 -12px 24px -14px rgba(26, 21, 53, 0.22); }
.dsc-eco-close {
  position: absolute;
  top: 18px;
  /* Clear of the scrollbar gutter on the right. */
  right: 26px;
  z-index: 3;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid rgba(35, 29, 69, 0.1);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(26, 21, 53, 0.08);
  color: #231d45;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, transform 0.2s ease;
}
.dsc-eco-close :deep(svg) { width: 18px; height: 18px; }
.dsc-eco-close:hover { background: #231d45; color: #fff; transform: rotate(90deg); }
/* Focus lands here when the popup opens; a soft brand ring rather than the
   browser's hard black outline. */
.dsc-eco-close:focus { outline: none; }
.dsc-eco-close:focus-visible { box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.35); border-color: #00a19a; }

.dsc-eco-actions {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  transition: box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 38px;
  border-top: 1px solid rgba(35, 29, 69, 0.07);
  background: #fbfaf7;
  border-radius: 0 0 28px 28px;
}
.dsc-eco-actions-note {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7089;
}
.dsc-eco-actions-note :deep(svg) { width: 15px; height: 15px; color: #c98a1a; }
.dsc-eco-actions-btns { display: flex; gap: 10px; }
.dsc-eco-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: 12px;
  border: 1px solid #00a19a;
  background: #00a19a;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.dsc-eco-btn :deep(svg) { width: 16px; height: 16px; }
.dsc-eco-btn:hover { background: #018e88; box-shadow: 0 8px 18px rgba(0, 161, 154, 0.28); }
.dsc-eco-btn--ghost { background: #fff; color: #231d45; border-color: #dcd9e4; }
.dsc-eco-btn--ghost:hover { background: #f3f2f7; box-shadow: none; }

.dsc-eco-pop-enter-active,
.dsc-eco-pop-leave-active { transition: opacity 0.22s ease; }
.dsc-eco-pop-enter-active .dsc-eco--dialog,
.dsc-eco-pop-leave-active .dsc-eco--dialog { transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.dsc-eco-pop-enter-from,
.dsc-eco-pop-leave-to { opacity: 0; }
.dsc-eco-pop-enter-from .dsc-eco--dialog,
.dsc-eco-pop-leave-to .dsc-eco--dialog { transform: translateY(18px) scale(0.98); }

@media (max-width: 760px) {
  .dsc-eco-overlay { padding: 0; place-items: end center; }
  .dsc-eco--dialog { max-height: 92dvh; border-radius: 24px 24px 0 0; }
  .dsc-eco-scroll { padding: 30px 20px 20px; }
  .dsc-eco-actions { flex-direction: column; align-items: stretch; padding: 14px 20px 18px; border-radius: 0; }
  .dsc-eco-close { right: 18px; top: 14px; }
  .dsc-eco-actions-note { display: none; }
  .dsc-eco-actions-btns { flex-direction: column; }
  .dsc-eco-btn { justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .dsc-eco-pop-enter-active,
  .dsc-eco-pop-leave-active,
  .dsc-eco-pop-enter-active .dsc-eco--dialog,
  .dsc-eco-pop-leave-active .dsc-eco--dialog { transition: none; }
}
</style>
