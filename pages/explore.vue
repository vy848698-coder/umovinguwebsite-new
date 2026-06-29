<template>
  <div class="ex">
    <!-- ─────────────────────────── NAVBAR ─────────────────────────── -->
    <header class="ex-nav">
      <div class="ex-shell ex-nav-inner">
        <button class="ex-brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="ex-brand-img" />
          <span class="ex-brand-name">umovingu</span><span class="ex-brand-beta">BETA</span>
        </button>

        <nav class="ex-nav-links" aria-label="Explore navigation">
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Properties</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
          <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">Insights</button>
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
            <button type="button" @click="goMobile('/homescore')">Insights</button>
            <button type="button" @click="goMobile('/profile')">Profile</button>
            <button type="button" class="ex-mobile-claim" @click="goMobileClaim">Add Property</button>
          </div>
        </nav>
      </transition>
    </header>

    <main class="ex-shell ex-stage">
      <!-- ─────────────────────────── HERO ─────────────────────────── -->
      <section class="ex-hero">
        <!-- Left column -->
        <div class="ex-hero-copy">
          <p class="ex-greeting">Good evening, <span>{{ profile?.firstName || 'Vivek' }}</span> 👋</p>
          <h1 class="ex-hero-title">
            Discover smarter.<br />
            Move with <span class="ex-accent">confidence.</span>
          </h1>
          <p class="ex-hero-sub">
            Search, analyse and act on properties with HomeScore,
            Property Passport and real market intelligence.
          </p>

          <form class="ex-search" @submit.prevent="runSearch">
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

          <div class="ex-quick-cards">
            <button class="ex-quick-card" type="button" @click="navigateTo('/homescore')">
              <div class="ex-quick-ring">
                <svg viewBox="0 0 44 44">
                  <circle class="qr-bg" cx="22" cy="22" r="18" />
                  <circle
                    class="qr-meter"
                    cx="22"
                    cy="22"
                    r="18"
                    :stroke-dasharray="ringCirc"
                    :stroke-dashoffset="ringOffset"
                  />
                </svg>
                <div class="ex-quick-ring-val"><strong>{{ dashboardHomeScore }}</strong><span>HS</span></div>
              </div>
              <div class="ex-quick-body">
                <strong>HomeScore</strong>
                <span>Instant signal, clear next action.</span>
              </div>
              <span class="ex-quick-arrow" aria-hidden="true">→</span>
            </button>

            <button class="ex-quick-card" type="button" @click="navigateTo('/passport/collections')">
              <div class="ex-quick-pp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" />
                  <path d="M9 4v16M13 9h2" />
                </svg>
              </div>
              <div class="ex-quick-body">
                <strong>Property Passport</strong>
                <span>Every property has a verified history.</span>
              </div>
              <span class="ex-quick-arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div class="ex-saved-hint">
            <span class="ex-saved-hint-left">
              <i class="ex-tick" />{{ savedMatchTotal }} matches for your saved searches
            </span>
            <button type="button" class="ex-link" @click="navigateTo('/profile')">View all saved →</button>
          </div>
        </div>

        <!-- Right column · spotlight property -->
        <article class="ex-spotlight">
          <div class="ex-spotlight-media">
            <PropertyImage
              :src="spotlight.image"
              :alt="spotlight.address"
              :show-caption="false"
              class="ex-spotlight-img"
            />
            <span class="ex-spotlight-badge">BEST MATCH</span>
            <div class="ex-spotlight-overlay">
              <strong class="ex-spotlight-price">{{ spotlight.price }}</strong>
              <p class="ex-spotlight-addr">{{ spotlight.address }}</p>
              <div class="ex-spotlight-pills">
                <span>{{ spotlight.type }}</span>
                <span>{{ spotlight.tenure }}</span>
              </div>
              <div class="ex-spotlight-foot">
                <span class="ex-spotlight-meta">EPC {{ spotlight.epc }} &nbsp;•&nbsp; HomeScore {{ spotlight.homeScore }}</span>
                <button class="ex-spotlight-btn" type="button" @click="openSpotlight">View property →</button>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- ───────────────────── KPI OVERVIEW ───────────────────── -->
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

      <!-- ───────────────────── SAVED SEARCHES ───────────────────── -->
      <section class="ex-block ex-saved">
        <div class="ex-block-head">
          <h2>Your saved searches</h2>
          <button type="button" class="ex-link" @click="navigateTo('/profile')">Edit saved searches</button>
        </div>
        <div class="ex-saved-row">
          <button
            v-for="(s, i) in savedSearches"
            :key="`saved-${i}`"
            type="button"
            class="ex-saved-chip"
            @click="runSavedSearch(s)"
          >
            <span class="ex-saved-chip-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <span class="ex-saved-chip-body">
              <strong>{{ s.label }}</strong>
              <small>{{ s.matches }} matches</small>
            </span>
          </button>
        </div>
      </section>

      <!-- ───────────────────── PROPERTIES FEED ───────────────────── -->
      <section class="ex-block">
        <div class="ex-block-head">
          <h2>Properties you might like</h2>
          <button type="button" class="ex-link" @click="navigateTo('/marketplace')">View all properties →</button>
        </div>
        <div class="ex-feed">
          <article
            v-for="(p, i) in feedProperties"
            :key="`feed-${i}`"
            class="ex-prop"
            @click="openProperty(p)"
          >
            <div class="ex-prop-media">
              <PropertyImage :src="p.image" :alt="p.address" :show-caption="false" class="ex-prop-img" />
              <button class="ex-prop-fav" type="button" aria-label="Save property" @click.stop="toggleFav(i)">
                <svg viewBox="0 0 24 24" :fill="p.fav ? '#00a19a' : 'none'" stroke="#00a19a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </button>
            </div>
            <div class="ex-prop-body">
              <strong class="ex-prop-price">{{ p.price }}</strong>
              <p class="ex-prop-addr">{{ p.address }}</p>
              <div class="ex-prop-pills">
                <span>{{ p.type }}</span>
                <span>{{ p.tenure }}</span>
              </div>
              <div class="ex-prop-foot">
                <span class="ex-prop-epc">EPC {{ p.epc }}</span>
                <span class="ex-prop-bar"><i :style="{ width: p.epc + '%' }" /></span>
                <span class="ex-prop-hs">HomeScore {{ p.homeScore }}</span>
                <span class="ex-prop-link">View details →</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- ───────────────────── QUICK ACTIONS ───────────────────── -->
      <section class="ex-block ex-qa-block">
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
      </section>

      <!-- ───────────────────── FEATURE PROMOS ───────────────────── -->
      <section class="ex-promos">
        <article class="ex-promo ex-promo--dark">
          <div class="ex-promo-main">
            <p class="ex-promo-kicker">HOMESCORE</p>
            <h3>Every property.<br />Instant clarity.</h3>
            <p class="ex-promo-copy">
              Our AI-powered HomeScore analyses 100+ data points to give you a
              clear signal and recommended next action.
            </p>
            <button class="ex-btn solid" type="button" @click="navigateTo('/homescore')">Run a HomeScore →</button>
          </div>

          <div class="ex-promo-aside">
            <div class="ex-promo-ring">
              <svg viewBox="0 0 120 120">
                <circle class="pr-bg" cx="60" cy="60" r="50" />
                <circle class="pr-meter" cx="60" cy="60" r="50" stroke-dasharray="314" :stroke-dashoffset="promoRingOffset" />
              </svg>
              <div class="ex-promo-ring-val"><strong>{{ dashboardHomeScore }}</strong><span>HS</span></div>
            </div>
            <ul class="ex-promo-list">
              <li><i class="ex-tick ex-tick--bright" />Energy &amp; running costs</li>
              <li><i class="ex-tick ex-tick--bright" />Sold history &amp; estimate</li>
              <li><i class="ex-tick ex-tick--bright" />Area comparison</li>
            </ul>
          </div>
        </article>

        <article class="ex-promo ex-promo--light">
          <div class="ex-promo-main">
            <p class="ex-promo-kicker ex-promo-kicker--teal">PROPERTY PASSPORT</p>
            <h3>Every property.<br />Verified history.</h3>
            <p class="ex-promo-copy">
              Title, planning, surveys, fittings and more — organised, verified
              and ready before you make an offer.
            </p>
            <button class="ex-btn navy" type="button" @click="navigateTo('/passport/collections')">See a sample Passport →</button>
          </div>

          <div class="ex-promo-aside">
            <img src="/Exp.png" alt="Property Passport" class="ex-passport-img" />
            <ul class="ex-promo-list">
              <li><i class="ex-tick" />Title &amp; ownership</li>
              <li><i class="ex-tick" />Planning &amp; permits</li>
              <li><i class="ex-tick" />Surveys &amp; reports</li>
              <li><i class="ex-tick" />Fittings &amp; contents</li>
              <li><i class="ex-tick" />Risks &amp; restrictions</li>
            </ul>
          </div>
        </article>
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

      <!-- ───────────────────── MARKET PULSE ───────────────────── -->
      <section class="ex-block">
        <div class="ex-block-head">
          <h2>Market pulse <span class="ex-dot-sep">•</span> {{ pulseArea || 'CV56' }} area</h2>
          <button type="button" class="ex-link" @click="navigateTo('/homescore')">View full market report →</button>
        </div>
        <div class="ex-pulse">
          <article v-for="(m, i) in marketStats" :key="`pulse-${i}`" class="ex-pulse-card">
            <div class="ex-pulse-top">
              <span class="ex-pulse-ic" v-html="m.icon" />
              <span class="ex-pulse-label">{{ m.label }}</span>
            </div>
            <strong class="ex-pulse-val">{{ m.value }}</strong>
            <span class="ex-pulse-delta" :class="m.deltaDir">{{ m.delta }}</span>
            <svg v-if="m.spark" class="ex-pulse-spark" viewBox="0 0 120 36" preserveAspectRatio="none">
              <polyline :points="m.spark" fill="none" stroke="#00a19a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <circle :cx="m.sparkDot[0]" :cy="m.sparkDot[1]" r="2.6" fill="#00a19a" />
            </svg>
            <div v-else class="ex-pulse-people">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></svg>
              <svg class="big" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7z" /></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></svg>
            </div>
          </article>
        </div>
      </section>

      <!-- ───────────────────── TESTIMONIALS ───────────────────── -->
      <section class="ex-block ex-trust">
        <div class="ex-block-head">
          <h2>Trusted by property professionals and buyers</h2>
        </div>
        <div class="ex-trust-row">
          <button class="ex-trust-arrow" type="button" aria-label="Previous" @click="prevTestimonial">‹</button>
          <div class="ex-trust-cards">
            <article v-for="(t, i) in visibleTestimonials" :key="`t-${i}`" class="ex-trust-card">
              <div class="ex-trust-stars">
                <span v-for="n in 5" :key="n">★</span>
              </div>
              <p class="ex-trust-quote">"{{ t.quote }}"</p>
              <div class="ex-trust-author">
                <span class="ex-trust-av" :style="{ background: t.color }">{{ t.initials }}</span>
                <span class="ex-trust-meta">
                  <strong>{{ t.name }}</strong>
                  <small>{{ t.role }}</small>
                </span>
              </div>
            </article>
          </div>
          <button class="ex-trust-arrow" type="button" aria-label="Next" @click="nextTestimonial">›</button>
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
          <button type="button" @click="navigateTo('/passport/collections')">Sample Passport</button>
        </div>
      </div>
      <div class="ex-shell ex-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
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
  () => verifiedPassportProperties.value.length || properties.value.length || feedProperties.value.length,
)
const estPropertyValue = computed(() => {
  const v = (properties.value[0] as any)?.estimatedPrice ?? (properties.value[0] as any)?.price
  return formatPrice(v) || '£425,000'
})

// HomeScore ring geometry (small quick-card ring, r=18)
const ringCirc = 2 * Math.PI * 18
const ringOffset = computed(() => (ringCirc * (1 - dashboardHomeScore.value / 100)).toFixed(1))
// Promo ring (r=50, circumference ≈ 314)
const promoRingOffset = computed(() => (314 * (1 - dashboardHomeScore.value / 100)).toFixed(1))

function formatPrice(n?: number | null): string {
  if (!n || typeof n !== 'number') return ''
  return '£' + Math.round(n).toLocaleString('en-GB')
}

// ── Spotlight (best match) ───────────────────────────────────────────
const spotlight = computed(() => {
  const p = (properties.value[0] || verifiedPassportProperties.value[0]) as any
  if (p) {
    return {
      id: p.id,
      image: p.imageUrl || p.image || '/images/uk-houses/house-1.jpg',
      price: formatPrice(p.estimatedPrice ?? p.price) || p.priceDisplay || '£314,000',
      address: `${p.addressLine1 || p.address || '49 Woodfield Road'}, ${p.city || 'Coventry'}, ${p.postcode || userPostcode.value || 'CV5 6AJ'}`,
      type: p.propertyType || p.type || 'House',
      tenure: p.tenure || 'Owner-occupied',
      epc: p.epcScore ?? p.epc ?? 79,
      homeScore: p.HomeScore ?? p.homeScore ?? 74,
    }
  }
  return {
    id: null,
    image: '/images/uk-houses/house-1.jpg',
    price: '£314,000',
    address: '49 Woodfield Road, Coventry, CV5 6AJ',
    type: 'House',
    tenure: 'Owner-occupied',
    epc: 79,
    homeScore: 74,
  }
})

function openSpotlight() {
  if (spotlight.value.id) navigateTo(`/passportview/${spotlight.value.id}`)
  else navigateTo('/marketplace')
}

// ── Properties feed ──────────────────────────────────────────────────
const demoFeed = [
  { image: '/images/uk-houses/house-2.jpg', price: '£289,500', address: '61 Woodfield Road, Coventry, CV5 6AJ', type: 'House', tenure: 'Owner-occupied', epc: 68, homeScore: 72, fav: false },
  { image: '/images/uk-houses/house-3.jpg', price: '£325,000', address: '17 Green Lane, Coventry, CV5 6AJ', type: 'House', tenure: 'Freehold', epc: 72, homeScore: 76, fav: false },
  { image: '/images/uk-houses/house-4.jpg', price: '£275,000', address: '23 Meadow Way, Coventry, CV5 6AJ', type: 'House', tenure: 'Owner-occupied', epc: 66, homeScore: 69, fav: false },
]
const feedProperties = ref(demoFeed.map((p) => ({ ...p })))

function syncFeed() {
  const real = properties.value.slice(0, 3)
  if (!real.length) return
  feedProperties.value = real.map((p: any, i) => ({
    id: p.id,
    image: p.imageUrl || p.image || demoFeed[i % 3].image,
    price: formatPrice(p.estimatedPrice ?? p.price) || p.priceDisplay || demoFeed[i % 3].price,
    address: `${p.addressLine1 || p.address || ''}${p.city ? ', ' + p.city : ''}${p.postcode ? ', ' + p.postcode : ''}`.replace(/^, /, '') || demoFeed[i % 3].address,
    type: p.propertyType || p.type || 'House',
    tenure: p.tenure || 'Owner-occupied',
    epc: p.epcScore ?? p.epc ?? demoFeed[i % 3].epc,
    homeScore: p.HomeScore ?? p.homeScore ?? demoFeed[i % 3].homeScore,
    fav: false,
  }))
}

function toggleFav(i: number) {
  const item = feedProperties.value[i]
  if (item) item.fav = !item.fav
}

function openProperty(p: any) {
  if (p?.id) navigateTo(`/passportview/${p.id}`)
  else navigateTo('/marketplace')
}

// ── Saved searches ───────────────────────────────────────────────────
const savedSearches = computed(() => {
  const area = userPostcode.value || 'CV5 6AJ'
  return [
    { label: `${area} area`, matches: 5, query: area },
    { label: '£200k – £350k', matches: 12, query: '' },
    { label: '3+ bedrooms', matches: 8, query: '' },
    { label: 'Freehold only', matches: 9, query: '' },
    { label: 'Near schools', matches: 6, query: '' },
  ]
})
const savedMatchTotal = computed(() => savedSearches.value[0]?.matches ?? 5)

function runSavedSearch(s: { query: string }) {
  if (s.query) navigateTo(`/marketplace?q=${encodeURIComponent(s.query)}`)
  else navigateTo('/marketplace')
}

// ── Market pulse ─────────────────────────────────────────────────────
interface MarketPulse {
  area: string | null
  priceChangeYoY: number | null
  avgDaysToSell: number | null
  passportListings: number
}
const marketPulse = ref<MarketPulse | null>(null)
const pulseArea = computed(() => marketPulse.value?.area || (userPostcode.value ? userPostcode.value.split(' ')[0] : ''))

async function fetchMarketPulse() {
  const pc = userPostcode.value
  if (!pc) return
  try {
    marketPulse.value = await $fetch<MarketPulse>(
      `${config.public.apiBase}/property/market-pulse?postcode=${encodeURIComponent(pc)}`,
    )
  } catch {
    marketPulse.value = null
  }
}
watch(userPostcode, (pc) => { if (pc) fetchMarketPulse() })

const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
const ICON_TAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6l8 8 8-8-8-8H5a2 2 0 0 0-2 2z"/><circle cx="8" cy="10" r="1.4"/></svg>'
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.4 7.8-8 9-4.6-1.2-8-4-8-9V7z"/><path d="m9 12 2 2 4-4"/></svg>'
const ICON_STOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-6h6v6"/></svg>'

const marketStats = computed(() => {
  const days = marketPulse.value?.avgDaysToSell ?? 179
  return [
    {
      icon: ICON_CLOCK, label: 'Average sale time', value: `${days} days`,
      delta: '↓ 8 days vs last month', deltaDir: 'down',
      spark: '0,28 12,24 24,26 36,20 48,22 60,16 72,18 84,12 96,14 108,8 120,6', sparkDot: [120, 6],
    },
    {
      icon: ICON_TAG, label: 'Average price', value: '£253,400',
      delta: '↑ 3.2% vs last month', deltaDir: 'up',
      spark: '0,30 12,28 24,24 36,26 48,20 60,22 72,16 84,18 96,12 108,10 120,5', sparkDot: [120, 5],
    },
    {
      icon: ICON_CHECK, label: 'Sales agreed', value: '1 in 3',
      delta: 'Properties going SSTC', deltaDir: 'flat',
      spark: '', sparkDot: [0, 0],
    },
    {
      icon: ICON_STOCK, label: 'Stock levels', value: '+12%',
      delta: 'More properties listed', deltaDir: 'up',
      spark: '0,26 12,28 24,22 36,24 48,18 60,20 72,22 84,14 96,16 108,10 120,8', sparkDot: [120, 8],
    },
  ]
})

// ── Testimonials ─────────────────────────────────────────────────────
const testimonials = [
  { quote: 'HomeScore has transformed how we find and assess deals. It\'s a game changer.', name: 'James T.', role: 'Property Investor', initials: 'JT', color: '#231d45' },
  { quote: 'Property Passport saves us hours of chasing documents. Everything in one place.', name: 'Sarah L.', role: 'Solicitor', initials: 'SL', color: '#00a19a' },
  { quote: 'The insights are spot on. We move faster and with total confidence.', name: 'Daniel M.', role: 'Buy-to-Let Investor', initials: 'DM', color: '#2c2456' },
  { quote: 'A verified history before the offer means no nasty surprises down the line.', name: 'Priya R.', role: 'First-time Buyer', initials: 'PR', color: '#00857f' },
]
const testimonialStart = ref(0)
const visibleTestimonials = computed(() => {
  const out = []
  for (let i = 0; i < 3; i++) out.push(testimonials[(testimonialStart.value + i) % testimonials.length])
  return out
})
function nextTestimonial() { testimonialStart.value = (testimonialStart.value + 1) % testimonials.length }
function prevTestimonial() { testimonialStart.value = (testimonialStart.value - 1 + testimonials.length) % testimonials.length }

// ── Search ───────────────────────────────────────────────────────────
function onSearchSelect(property: { id: string }) {
  navigateTo(`/homescore/${property.id}`)
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
  if (propResult.status === 'fulfilled') {
    properties.value = propResult.value?.items ?? []
    syncFeed()
  }
  if (verifiedResult.status === 'fulfilled') verifiedPassportProperties.value = verifiedResult.value?.items ?? []

  if (userPostcode.value) fetchMarketPulse()
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
  border: 1px solid transparent;
  border-radius: 11px;
  padding: 11px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
  white-space: nowrap;
}
.ex-btn.solid {
  background: var(--teal);
  color: #fff;
}
.ex-btn.solid:hover { background: var(--teal-dark); transform: translateY(-1px); }
.ex-btn.navy {
  background: var(--navy);
  color: #fff;
}
.ex-btn.navy:hover { background: var(--navy-2); transform: translateY(-1px); }
.ex-plus { font-weight: 800; margin-right: 4px; }

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
.ex-tick--bright { background: var(--teal-bright); }
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
.ex-stage { padding: 32px 0 80px; }

/* ── Hero ─────────────────────────────────────────────────────────── */
.ex-hero {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 40px;
  align-items: stretch;
  margin-bottom: 36px;
}
.ex-greeting { margin: 0 0 14px; font-size: 15px; font-weight: 600; color: var(--ink-soft); }
.ex-greeting span { color: var(--teal-dark); font-weight: 700; }
.ex-hero-title {
  margin: 0 0 16px;
  font-size: clamp(32px, 4vw, 46px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1.4px;
  color: var(--navy);
}
.ex-accent { color: var(--teal); }
.ex-hero-sub {
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink-soft);
  max-width: 46ch;
}

.ex-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 7px;
  box-shadow: 0 10px 28px rgba(35, 29, 69, 0.06);
  margin-bottom: 18px;
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
.ex-search-radius {
  position: relative;
  flex-shrink: 0;
}
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

.ex-quick-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}
.ex-quick-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  padding: 14px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.ex-quick-card:hover { border-color: var(--teal); transform: translateY(-2px); }
.ex-quick-ring { position: relative; width: 44px; height: 44px; flex-shrink: 0; }
.ex-quick-ring svg { width: 44px; height: 44px; transform: rotate(-90deg); }
.qr-bg { fill: none; stroke: var(--line); stroke-width: 4; }
.qr-meter { fill: none; stroke: var(--teal); stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
.ex-quick-ring-val {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.ex-quick-ring-val strong { font-size: 13px; font-weight: 800; color: var(--navy); }
.ex-quick-ring-val span { font-size: 7px; font-weight: 700; color: var(--ink-faint); letter-spacing: 0.5px; }
.ex-quick-pp {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  flex-shrink: 0;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
  display: grid;
  place-items: center;
}
.ex-quick-pp svg { width: 22px; height: 22px; }
.ex-quick-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ex-quick-body strong { font-size: 13.5px; font-weight: 700; color: var(--teal-dark); }
.ex-quick-body span { font-size: 12px; color: var(--ink-soft); line-height: 1.35; }
.ex-quick-arrow { color: var(--teal-dark); font-size: 16px; font-weight: 700; flex-shrink: 0; }

.ex-saved-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.ex-saved-hint-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
}

/* ── Spotlight ────────────────────────────────────────────────────── */
.ex-spotlight {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(35, 29, 69, 0.18);
  min-height: 420px;
}
.ex-spotlight-media {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
}
.ex-spotlight-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.ex-spotlight-img :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.ex-spotlight-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28, 24, 56, 0.86) 0%, rgba(28, 24, 56, 0.25) 42%, rgba(28, 24, 56, 0) 70%);
}
.ex-spotlight-badge {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
  background: var(--teal);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  padding: 7px 12px;
  border-radius: 9px;
}
.ex-spotlight-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 26px;
  color: #fff;
}
.ex-spotlight-price { display: block; font-size: 34px; font-weight: 800; letter-spacing: -0.8px; }
.ex-spotlight-addr { margin: 4px 0 12px; font-size: 15px; color: rgba(255, 255, 255, 0.88); }
.ex-spotlight-pills { display: flex; gap: 8px; margin-bottom: 14px; }
.ex-spotlight-pills span {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;
  padding: 5px 11px;
}
.ex-spotlight-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.ex-spotlight-meta { font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
.ex-spotlight-btn {
  border: 0;
  background: #fff;
  color: var(--navy);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
}
.ex-spotlight-btn:hover { background: var(--teal); color: #fff; }

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
.ex-dot-sep { color: var(--teal); }

/* ── Saved searches ───────────────────────────────────────────────── */
.ex-saved-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.ex-saved-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: #fff;
  padding: 13px 14px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.16s ease, transform 0.16s ease;
}
.ex-saved-chip:hover { border-color: var(--teal); transform: translateY(-2px); }
.ex-saved-chip-ic {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-saved-chip-ic svg { width: 15px; height: 15px; }
.ex-saved-chip-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.ex-saved-chip-body strong { font-size: 13px; font-weight: 700; color: var(--navy); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ex-saved-chip-body small { font-size: 11.5px; color: var(--ink-faint); font-weight: 600; }

/* ── Property feed ────────────────────────────────────────────────── */
.ex-feed {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.ex-prop {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.ex-prop:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(35, 29, 69, 0.1); }
.ex-prop-media { position: relative; height: 188px; }
.ex-prop-img { width: 100%; height: 100%; }
.ex-prop-img :deep(img) { width: 100%; height: 100%; object-fit: cover; }
.ex-prop-fav {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.92);
  display: grid;
  place-items: center;
  cursor: pointer;
}
.ex-prop-fav svg { width: 17px; height: 17px; }
.ex-prop-body { padding: 16px; }
.ex-prop-price { display: block; font-size: 21px; font-weight: 800; letter-spacing: -0.4px; color: var(--navy); }
.ex-prop-addr { margin: 3px 0 11px; font-size: 13.5px; color: var(--ink-soft); }
.ex-prop-pills { display: flex; gap: 7px; margin-bottom: 13px; }
.ex-prop-pills span {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink-soft);
  background: #f3f2ef;
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 4px 9px;
}
.ex-prop-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}
.ex-prop-epc { font-size: 11.5px; font-weight: 700; color: var(--ink-soft); white-space: nowrap; }
.ex-prop-bar {
  flex: 0 0 36px;
  height: 5px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}
.ex-prop-bar i { display: block; height: 100%; background: var(--teal); border-radius: 999px; }
.ex-prop-hs { font-size: 11.5px; font-weight: 700; color: var(--navy); white-space: nowrap; }
.ex-prop-link { margin-left: auto; font-size: 12.5px; font-weight: 700; color: var(--teal-dark); white-space: nowrap; }

/* ── Promos ───────────────────────────────────────────────────────── */
.ex-promos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 36px;
}
.ex-promo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 28px;
  border-radius: 20px;
  padding: 30px;
  overflow: hidden;
}
.ex-promo--dark { background: var(--navy); color: #fff; }
.ex-promo--light { background: #fff; border: 1px solid var(--line); color: var(--ink); }
.ex-promo-main { flex: 1 1 0; min-width: 0; }
.ex-promo-kicker {
  margin: 0 0 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: var(--teal-bright);
}
.ex-promo-kicker--teal { color: var(--teal-dark); }
.ex-promo h3 {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.6px;
}
.ex-promo-copy {
  margin: 0 0 22px;
  font-size: 14px;
  line-height: 1.6;
}
.ex-promo--dark .ex-promo-copy { color: rgba(255, 255, 255, 0.72); }
.ex-promo--light .ex-promo-copy { color: var(--ink-soft); }

/* Right visual column: ring/book + checklist side by side */
.ex-promo-aside {
  display: grid;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}
.ex-promo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ex-promo-list li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
}
.ex-promo--light .ex-promo-list li { color: var(--ink); }

.ex-promo-ring {
  position: relative;
  width: 104px;
  height: 104px;
  flex-shrink: 0;
}
.ex-promo-ring svg { width: 104px; height: 104px; transform: rotate(-90deg); }
.pr-bg { fill: none; stroke: rgba(255, 255, 255, 0.14); stroke-width: 8; }
.pr-meter { fill: none; stroke: var(--teal-bright); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.7s ease; }
.ex-promo-ring-val {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
.ex-promo-ring-val strong { font-size: 28px; font-weight: 800; color: #fff; }
.ex-promo-ring-val span { font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.6); letter-spacing: 1px; margin-top: 3px; }

.ex-passport-img {
  width: 132px;
  height: auto;
  flex-shrink: 0;
  display: block;
  filter: drop-shadow(0 18px 30px rgba(0, 161, 154, 0.28));
}

/* ── Market pulse ─────────────────────────────────────────────────── */
.ex-pulse {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.ex-pulse-card {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 18px;
}
.ex-pulse-top { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
.ex-pulse-ic {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal-dark);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-pulse-ic :deep(svg) { width: 16px; height: 16px; }
.ex-pulse-label { font-size: 12.5px; font-weight: 600; color: var(--ink-soft); }
.ex-pulse-val { display: block; font-size: 26px; font-weight: 800; letter-spacing: -0.6px; color: var(--navy); }
.ex-pulse-delta { display: block; margin: 3px 0 10px; font-size: 11.5px; font-weight: 600; }
.ex-pulse-delta.up { color: #1f7a66; }
.ex-pulse-delta.down { color: #1f7a66; }
.ex-pulse-delta.flat { color: var(--ink-faint); }
.ex-pulse-spark { width: 100%; height: 36px; display: block; }
.ex-pulse-people {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 10px;
  height: 36px;
  color: var(--ink-faint);
}
.ex-pulse-people svg { width: 22px; height: 22px; }
.ex-pulse-people .big { width: 30px; height: 30px; color: var(--navy); }

/* ── Testimonials ─────────────────────────────────────────────────── */
.ex-trust-row { display: flex; align-items: stretch; gap: 12px; }
.ex-trust-cards {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.ex-trust-card {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  padding: 22px;
  display: flex;
  flex-direction: column;
}
.ex-trust-stars { color: var(--teal); font-size: 14px; letter-spacing: 2px; margin-bottom: 12px; }
.ex-trust-quote { margin: 0 0 18px; font-size: 14.5px; line-height: 1.6; color: var(--ink); flex: 1; }
.ex-trust-author { display: flex; align-items: center; gap: 11px; }
.ex-trust-av {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ex-trust-meta { display: flex; flex-direction: column; line-height: 1.2; }
.ex-trust-meta strong { font-size: 14px; font-weight: 700; color: var(--navy); }
.ex-trust-meta small { font-size: 12px; color: var(--ink-faint); font-weight: 600; }
.ex-trust-arrow {
  width: 40px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  color: var(--navy);
  font-size: 22px;
  cursor: pointer;
  align-self: center;
  height: 40px;
}
.ex-trust-arrow:hover { border-color: var(--teal); color: var(--teal-dark); }

.ex-block-head--stack { flex-direction: column; align-items: flex-start; gap: 4px; }
.ex-block-sub { margin: 0; font-size: 14px; color: var(--ink-soft); }

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
}
@media (max-width: 980px) {
  .ex-hero { grid-template-columns: 1fr; }
  .ex-spotlight { min-height: 360px; }
  .ex-kpis { grid-template-columns: repeat(2, 1fr); }
  .ex-saved-row { grid-template-columns: repeat(3, 1fr); }
  .ex-feed { grid-template-columns: repeat(2, 1fr); }
  .ex-promos { grid-template-columns: 1fr; }
  .ex-reco-grid { grid-template-columns: repeat(2, 1fr); }
  .ex-pulse { grid-template-columns: repeat(2, 1fr); }
  .ex-trust-cards { grid-template-columns: 1fr 1fr; }
  .ex-trust-cards .ex-trust-card:nth-child(3) { display: none; }
  .ex-footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 760px) {
  .ex-profile-meta { display: none; }
  .ex-burger { display: flex; }
  .ex-btn.solid span:last-child { display: none; }
  .ex-search { flex-wrap: wrap; }
  .ex-search-field { flex: 1 1 100%; order: -1; }
  .ex-quick-cards { grid-template-columns: 1fr; }
  .ex-saved-row { grid-template-columns: 1fr 1fr; }
  .ex-feed { grid-template-columns: 1fr; }
  .ex-qa-grid { grid-template-columns: 1fr; }
  .ex-promo { flex-direction: column; align-items: flex-start; gap: 22px; }
  .ex-promo-aside { width: 100%; justify-content: flex-start; }
  .ex-pulse { grid-template-columns: 1fr 1fr; }
  .ex-trust-cards { grid-template-columns: 1fr; }
  .ex-trust-cards .ex-trust-card:nth-child(2),
  .ex-trust-cards .ex-trust-card:nth-child(3) { display: none; }
}
@media (max-width: 520px) {
  .ex-shell { width: calc(100% - 32px); }
  .ex-kpis { grid-template-columns: 1fr 1fr; }
  .ex-saved-row { grid-template-columns: 1fr; }
  .ex-reco-grid { grid-template-columns: 1fr; }
  .ex-pulse { grid-template-columns: 1fr; }
  .ex-footer-grid { grid-template-columns: 1fr; }
}
</style>
