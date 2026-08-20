<template>
  <div class="sp-root">
    <!-- ── Public web nav ──────────────────────────────────────────── -->
    <header class="spn-nav">
      <div class="sp-shell spn-nav-inner">
        <button class="spn-brand" type="button" @click="navigateTo('/')" aria-label="umovingu home">
          <img src="/op-icons/logo.png" alt="" class="spn-brand-logo" />
          <span class="spn-brand-name">umovingu</span>
          <span class="spn-brand-beta">BETA</span>
        </button>
        <nav class="spn-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport/sample')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="spn-actions">
          <button class="spn-signin" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button class="spn-cta" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
        </div>
      </div>
    </header>

    <!-- ── Sample banner ───────────────────────────────────────────── -->
    <div class="sp-banner">
      <div class="sp-shell sp-banner-inner">
        <span class="sp-banner-pill">SAMPLE</span>
        <p class="sp-banner-text">
          A demo passport for an illustrative property —
          <strong>not a real listing.</strong>
        </p>
      </div>
    </div>

    <main class="sp-main">
      <div class="sp-shell">
        <!-- ── Title + role toggle ─────────────────────────────────── -->
        <div class="sp-head">
          <div class="sp-head-copy">
            <h1>Property Passport</h1>
            <p>Explore the sample record from every side of the sale.</p>
          </div>
          <div class="sp-roles" role="tablist" aria-label="Choose a perspective">
            <button
              v-for="r in roles"
              :key="r.key"
              type="button"
              role="tab"
              class="sp-role"
              :class="{ active: role === r.key }"
              :aria-selected="role === r.key"
              @click="role = r.key"
            >
              {{ r.label }}
            </button>
          </div>
        </div>

        <!-- ══ SELLER perspective ══════════════════════════════════ -->
        <template v-if="role === 'seller'">
        <!-- ── Hero card ───────────────────────────────────────────── -->
        <section class="sp-hero">
          <!-- passport card -->
          <div class="sp-hero-book">
            <PassportCard line1="55, Woodfield Road" line2="Coventry, CV5 6AJ" />
          </div>

          <!-- middle info -->
          <div class="sp-hero-info">
            <span class="sp-hero-kicker">Property Passport</span>
            <h2 class="sp-hero-addr">55, Woodfield Road</h2>
            <p class="sp-hero-place">Coventry, CV5 6AJ</p>

            <div class="sp-hero-stats">
              <div class="sp-stat">
                <span class="sp-stat-num">{{ animA }}</span>
                <span class="sp-stat-label">HS</span>
              </div>
              <div class="sp-stat">
                <span class="sp-stat-num">{{ animB }}</span>
                <span class="sp-stat-label">Docs</span>
              </div>
              <div class="sp-stat">
                <span class="sp-stat-num">{{ animC }}<em>/17</em></span>
                <span class="sp-stat-label">Sections</span>
              </div>
            </div>

            <div class="sp-hero-actions">
              <span class="sp-hero-btn sp-hero-btn--pub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Published
              </span>
              <span class="sp-hero-btn sp-hero-btn--match">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                {{ activeRole.action }}
                <span class="sp-hero-badge">3</span>
              </span>
            </div>
          </div>

          <!-- right progress -->
          <div class="sp-hero-progress">
            <span class="sp-ring">
              <svg viewBox="0 0 96 96">
                <circle class="sp-ring-bg" cx="48" cy="48" r="40" />
                <circle
                  class="sp-ring-meter"
                  cx="48"
                  cy="48"
                  r="40"
                  :stroke-dasharray="ringCirc"
                  :stroke-dashoffset="ringOffset"
                />
              </svg>
              <span class="sp-ring-val">{{ ringPct }}%</span>
            </span>
            <span class="sp-progress-label">Passport progress</span>
            <span class="sp-progress-chip"><i />Passport issued</span>
          </div>
        </section>

        <!-- ── Collaborators ───────────────────────────────────────── -->
        <div class="sp-collab">
          <span class="sp-collab-add">+</span>
          <span class="sp-collab-avatars">
            <span class="sp-collab-av sp-collab-av--navy">SH</span>
            <span class="sp-collab-av sp-collab-av--teal">MR</span>
          </span>
          <span class="sp-collab-text">2 Collaborators</span>
          <span class="sp-collab-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
        </div>

        <!-- ── Tabs ────────────────────────────────────────────────── -->
        <div class="sp-tabs">
          <div class="sp-tab-group">
            <button type="button" class="sp-tab active">
              <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/sections.png" alt="" loading="lazy" />
              Sections
            </button>
            <button type="button" class="sp-tab">
              <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/street.png" alt="" loading="lazy" />
              Street
            </button>
            <button type="button" class="sp-tab">
              <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/buyer.png" alt="" loading="lazy" />
              Buyers
              <span class="sp-tab-badge">3</span>
            </button>
          </div>
          <div class="sp-tab-group">
            <button type="button" class="sp-tab active">
              <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/list.png" alt="" loading="lazy" />
              List
            </button>
            <button type="button" class="sp-tab">
              <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/map.png" alt="" loading="lazy" />
              Map
            </button>
          </div>
        </div>

        <!-- ── Section cards ───────────────────────────────────────── -->
        <div class="sp-sections">
          <article v-for="s in sections" :key="s.title" class="sp-card" data-reveal-card>
            <div class="sp-card-head">
              <span class="sp-card-ic sp-card-ic--img" v-html="s.icon" />
              <div class="sp-card-titles">
                <h3>{{ s.title }}</h3>
                <p>{{ s.points }} points earned so far</p>
              </div>
              <span class="sp-card-go">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </span>
            </div>
            <div class="sp-card-pills">
              <span class="sp-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.4 11.05 12.25 20.2a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.67 3.67 0 1 1 5.18 5.18l-9.2 9.2a1.83 1.83 0 1 1-2.59-2.6l8.49-8.48" /></svg>
                {{ s.docs }} docs
              </span>
              <span class="sp-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.3" /><circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" /></svg>
                {{ s.questions }} questions
              </span>
            </div>
            <div class="sp-card-track">
              <div class="sp-card-fill" :style="{ width: s.pct + '%' }" />
              <span class="sp-card-pct">{{ s.pct }}%</span>
            </div>
          </article>
        </div>

        <!-- ── More sections ───────────────────────────────────────── -->
        <div class="sp-more">
          <p class="sp-more-title">+ 13 more sections</p>
          <p class="sp-more-list">
            Occupiers · Services · Disputes · Insurance · Environmental · Parking · …
          </p>
        </div>

        <!-- ── Want one CTA ────────────────────────────────────────── -->
        <section class="sp-final">
          <h2>Want one for your home?</h2>
          <p>Solicitor-grade documentation, ready before your first viewing.</p>
          <button type="button" class="sp-final-btn" @click="startPassport">
            Start a Property Passport →
          </button>
        </section>
        </template>

        <!-- ══ LANDLORD perspective ════════════════════════════════ -->
        <template v-else-if="role === 'landlord'">
          <!-- ── Hero card ─────────────────────────────────────────── -->
          <section class="lp-hero">
            <div class="lp-hero-book">
              <img
                src="/landlordPassport.png"
                alt="umovingu Landlord Passport"
                class="lp-hero-book-img"
              />
              <div class="lp-hero-book-plate">
                <span class="lp-hero-book-line1">14 Hazel Grove</span>
                <span class="lp-hero-book-line2">Stockport, SK7 4BL</span>
              </div>
            </div>

            <div class="lp-hero-info">
              <span class="lp-hero-kicker">Landlord Passport</span>
              <h2 class="lp-hero-addr">14 Hazel Grove</h2>
              <p class="lp-hero-place">Stockport, SK7 4BL</p>

              <div class="lp-hero-stats">
                <div class="lp-stat">
                  <span class="lp-stat-num">{{ animA }}<em>%</em></span>
                  <span class="lp-stat-label">Compliant</span>
                </div>
                <div class="lp-stat">
                  <span class="lp-stat-num">{{ animB }}</span>
                  <span class="lp-stat-label">Docs</span>
                </div>
                <div class="lp-stat">
                  <span class="lp-stat-num">{{ animC }}<em>/12</em></span>
                  <span class="lp-stat-label">Sections</span>
                </div>
              </div>

              <p class="lp-hero-warn">
                <i />1 doc expiring in the next 30 days
              </p>
            </div>

            <!-- compliance progress ring -->
            <div class="lp-hero-progress">
              <span class="sp-ring">
                <svg viewBox="0 0 96 96">
                  <circle class="sp-ring-bg" cx="48" cy="48" r="40" />
                  <circle
                    class="sp-ring-meter"
                    cx="48"
                    cy="48"
                    r="40"
                    :stroke-dasharray="ringCirc"
                    :stroke-dashoffset="ringOffset"
                  />
                </svg>
                <span class="sp-ring-val">{{ ringPct }}%</span>
              </span>
              <span class="sp-progress-label">Compliance progress</span>
              <span class="sp-progress-chip"><i />Passport issued</span>
            </div>
          </section>

          <!-- ── Convert banner ────────────────────────────────────── -->
          <button type="button" class="lp-convert" @click="startPassport">
            <span class="lp-convert-ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>
            </span>
            <span class="lp-convert-copy">
              <strong>Convert to selling passport</strong>
              <small>Transfer 6 docs · keep tenant or serve notice</small>
            </span>
            <span class="lp-convert-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </span>
          </button>

          <!-- ── Tabs ──────────────────────────────────────────────── -->
          <div class="sp-tabs lp-tabs">
            <div class="sp-tab-group">
              <button type="button" class="sp-tab sp-tab--navy active">
                <img class="sp-tab-ic" src="/homescore-icon/shield.png" alt="" loading="lazy" />
                Compliance
                <span class="sp-tab-badge">12</span>
              </button>
              <button type="button" class="sp-tab">
                <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/vault.png" alt="" loading="lazy" />
                Vault
                <span class="sp-tab-badge">11</span>
              </button>
              <button type="button" class="sp-tab">
                <img class="sp-tab-ic" src="/passport-seller-and-buyer-icon/tenancyAgreement.png" alt="" loading="lazy" />
                Tenancy
              </button>
            </div>
          </div>

          <!-- ── Grouped section cards ─────────────────────────────── -->
          <div v-for="group in landlordGroups" :key="group.label" class="lp-group">
            <p class="lp-group-label">{{ group.label }}</p>
            <div class="sp-sections">
              <article v-for="s in group.items" :key="s.title" class="sp-card" data-reveal-card>
                <div class="sp-card-head">
                  <span class="sp-card-ic" :class="s.iconClass" v-html="s.icon" />
                  <div class="sp-card-titles">
                    <h3>{{ s.title }}</h3>
                    <p>{{ s.sub }}</p>
                  </div>
                  <span class="lp-card-go">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </span>
                </div>
                <div class="sp-card-pills">
                  <span class="lp-doc-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
                    {{ s.docs }}
                  </span>
                  <span class="lp-status-pill" :class="`lp-status-pill--${s.status.tone}`">
                    <svg v-if="s.status.tone === 'warn'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {{ s.status.label }}
                  </span>
                </div>
                <div class="sp-card-track">
                  <div
                    class="sp-card-fill"
                    :class="{ 'sp-card-fill--amber': s.tone === 'amber' }"
                    :style="{ width: s.pct + '%' }"
                  />
                  <span
                    class="sp-card-pct"
                    :class="{ 'sp-card-pct--amber': s.tone === 'amber' }"
                    >{{ s.foot || s.pct + '%' }}</span
                  >
                </div>
              </article>
            </div>
          </div>

          <!-- ── More sections ─────────────────────────────────────── -->
          <div class="sp-more">
            <p class="sp-more-title">+ 8 more sections</p>
            <p class="sp-more-list">
              EPC · Smoke &amp; CO · Legionella · Deposit · Right to Rent · Inventory · …
            </p>
          </div>

          <!-- ── Want one CTA ──────────────────────────────────────── -->
          <section class="sp-final sp-final--teal">
            <h2>Want one for your home?</h2>
            <p>Stay compliant. Share with your tenant in one tap.</p>
            <button type="button" class="sp-final-btn sp-final-btn--navy" @click="startPassport">
              Start a Landlord Passport →
            </button>
          </section>
        </template>

        <!-- ══ BUYER perspective ═══════════════════════════════════ -->
        <template v-else>
          <!-- ── Unlocked banner ───────────────────────────────────── -->
          <div class="by-unlock">
            <img
              class="by-unlock-ic"
              src="/passport-seller-and-buyer-icon/padlock.png"
              alt=""
              loading="lazy"
            />
            <span class="by-unlock-copy">
              <strong>You unlocked this passport</strong>
              <small>Read-only access · expires in 30 days · paid £49</small>
            </span>
          </div>

          <!-- ── Verified hero ─────────────────────────────────────── -->
          <section class="by-hero">
            <div class="by-hero-book">
              <PassportCard line1="55, Woodfield Road" line2="Coventry, CV5 6AJ" />
            </div>
            <div class="by-hero-info">
              <span class="by-hero-kicker">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
                Verified Property Passport
              </span>
              <h2 class="by-hero-addr">55, Woodfield Road</h2>
              <p class="by-hero-place">Coventry, CV5 6AJ</p>
              <div class="by-hero-stats">
                <div class="by-hstat"><span class="by-hstat-num">{{ animA }}</span><span class="by-hstat-label">HS</span></div>
                <div class="by-hstat"><span class="by-hstat-num">{{ animB }}</span><span class="by-hstat-label">Docs</span></div>
                <div class="by-hstat"><span class="by-hstat-num">{{ animC }}%</span><span class="by-hstat-label">Answered</span></div>
              </div>
            </div>

            <!-- questions-answered ring -->
            <div class="sp-hero-progress">
              <span class="sp-ring">
                <svg viewBox="0 0 96 96">
                  <circle class="sp-ring-bg" cx="48" cy="48" r="40" />
                  <circle
                    class="sp-ring-meter"
                    cx="48"
                    cy="48"
                    r="40"
                    :stroke-dasharray="ringCirc"
                    :stroke-dashoffset="ringOffset"
                  />
                </svg>
                <span class="sp-ring-val">{{ ringPct }}%</span>
              </span>
              <span class="sp-progress-label">Questions answered</span>
              <span class="sp-progress-chip"><i />Verified passport</span>
            </div>
          </section>

          <!-- ── Headline address / value ──────────────────────────── -->
          <div class="by-lead">
            <h2 class="by-lead-addr">55, Woodfield Road</h2>
            <p class="by-lead-place">Coventry, CV5 6AJ</p>
            <div class="by-lead-value">
              <strong>£420,000</strong>
              <span class="by-lead-value-label">Estimated value</span>
              <span class="by-lead-flag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                100% complete · 0 red flags
              </span>
            </div>
            <div class="by-lead-chips">
              <span class="by-chip"><b>4</b> beds</span>
              <span class="by-chip"><b>2</b> baths</span>
              <span class="by-chip">House</span>
              <span class="by-chip">1,406 sqft</span>
            </div>
          </div>

          <!-- ── Property details ──────────────────────────────────── -->
          <div class="by-section-head">
            <h3>Property Details</h3>
            <p>Key characteristics that define this property.</p>
          </div>
          <div class="by-details-card">
            <div v-for="d in buyerDetails" :key="d.label" class="by-detail">
              <span class="by-detail-ic" v-html="d.icon" />
              <div class="by-detail-text">
                <span class="by-detail-label">{{ d.label }}</span>
                <span class="by-detail-value">{{ d.value }}</span>
              </div>
            </div>
          </div>

          <!-- ── Download cards ────────────────────────────────────── -->
          <div class="by-downloads">
            <article
              v-for="dl in buyerDownloads"
              :key="dl.title"
              class="by-dl"
              :class="`by-dl--${dl.tone}`"
            >
              <div class="by-dl-copy">
                <img class="by-dl-ic" :src="dl.icon" alt="" loading="lazy" />
                <h4>{{ dl.title }}</h4>
                <p>{{ dl.sub }}</p>
              </div>
              <button type="button" class="by-dl-btn" :class="`by-dl-btn--${dl.tone}`">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                {{ dl.cta }}
              </button>
            </article>
          </div>

          <!-- ── Seller completion ─────────────────────────────────── -->
          <div class="by-completion">
            <div class="by-completion-top">
              <span class="by-completion-label">Seller Completion</span>
              <span class="by-completion-pct">100%</span>
            </div>
            <div class="by-completion-track"><div class="by-completion-fill" style="width: 100%" /></div>
            <p class="by-completion-sub">All sections completed by the seller.</p>
          </div>

          <!-- ── Official records ──────────────────────────────────── -->
          <div class="by-section-head">
            <h3>Official Records</h3>
            <p>Verified documents that define the legal and structural status of the property.</p>
          </div>

          <div class="by-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
            <input class="by-search-input" placeholder="Search Records…" />
            <span class="by-search-filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="17" x2="14" y2="17" /></svg>
            </span>
          </div>

          <div class="by-recstats">
            <div class="by-recstat">
              <span class="by-recstat-num by-recstat-num--teal">17</span>
              <span class="by-recstat-label">Fully answered</span>
            </div>
            <div class="by-recstat">
              <span class="by-recstat-num by-recstat-num--amber">0</span>
              <span class="by-recstat-label">Partially</span>
            </div>
            <div class="by-recstat">
              <span class="by-recstat-num by-recstat-num--muted">0</span>
              <span class="by-recstat-label">Not yet shared</span>
            </div>
            <p class="by-recstats-note">
              Sellers earn the most from completing every section. Tap any below to see
              what's been shared so far.
            </p>
          </div>

          <div class="sp-sections">
            <article v-for="r in buyerRecords" :key="r.title" class="by-record" data-reveal-card>
              <span class="by-record-thumb" :class="r.thumb" v-html="r.icon" />
              <div class="by-record-body">
                <h4>{{ r.title }}</h4>
                <p>{{ r.sub }}</p>
                <span class="by-record-pill">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Fully answered
                </span>
                <div class="by-record-track">
                  <div class="by-record-fill" style="width: 100%" />
                  <span class="by-record-pct">100%</span>
                </div>
              </div>
              <span class="by-record-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </span>
            </article>
          </div>

          <div class="sp-more">
            <p class="sp-more-title">+ 13 more sections</p>
            <p class="sp-more-list">
              Occupiers · Services · Disputes · Insurance · Environmental · Parking · …
            </p>
          </div>

          <!-- ── Buyer CTA ─────────────────────────────────────────── -->
          <section class="sp-final by-final">
            <h2>Like what you see?</h2>
            <p>Save this property, message the owner, or download the full report to share with your solicitor.</p>
            <div class="by-final-actions">
              <button type="button" class="by-ghost" @click="startPassport">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
                Save
              </button>
              <button type="button" class="by-ghost" @click="startPassport">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6a8.4 8.4 0 0 1-.9-3.9A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" /></svg>
                Message
              </button>
              <button type="button" class="by-ghost" @click="startPassport">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Report
              </button>
            </div>
            <button type="button" class="sp-final-btn sp-final-btn--navy by-offer" @click="startPassport">
              Make an offer →
            </button>
          </section>
        </template>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

// Public page — no auth middleware. This is what people who haven't signed
// up land on when they tap "See a sample Passport".
const roles = [
  { key: 'seller', label: 'Seller', action: 'Match to Buyers' },
  { key: 'landlord', label: 'Landlord', action: 'Share with Tenants' },
  { key: 'buyer', label: 'Buyer', action: 'Unlock full report' },
]
const route = useRoute()
const router = useRouter()
const role = ref('seller')

// Deep-link support: /passport/sample?sample=landlord mirrors the app's
// /?sample=<role> links, so those URLs open on the right perspective.
const requestedRole = String(route.query.sample ?? route.query.role ?? '')
if (roles.some((r) => r.key === requestedRole)) role.value = requestedRole
const activeRole = computed(
  () => roles.find((r) => r.key === role.value) || roles[0],
)

// Circumference for the progress ring (r = 40)
const ringCirc = 2 * Math.PI * 40

// ── Hero count-up animation ─────────────────────────────────────────
// The three hero stat figures and the progress ring animate from 0 to
// their target whenever the view mounts or the role toggle changes, so the
// header feels alive rather than static. Shared refs work because only one
// role's hero is in the DOM at a time (v-if per role).
const animA = ref(0)
const animB = ref(0)
const animC = ref(0)
const ringPct = ref(0)
const ringOffset = computed(() => ringCirc * (1 - ringPct.value / 100))

const heroTargets = {
  seller: { a: 74, b: 38, c: 17, ring: 100 },
  landlord: { a: 83, b: 11, c: 10, ring: 83 },
  buyer: { a: 74, b: 38, c: 100, ring: 100 },
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function animateValue(target, to, duration = 1200) {
  if (prefersReduced()) {
    target.value = to
    return
  }
  target.value = 0
  const start = performance.now()
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
    target.value = Math.round(to * eased)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function runHeroAnim() {
  const t = heroTargets[role.value] || heroTargets.seller
  animateValue(animA, t.a)
  animateValue(animB, t.b)
  animateValue(animC, t.c)
  animateValue(ringPct, t.ring, 1400)
}

// ── Scroll reveal for section / record cards ────────────────────────
// Cards are only hidden once JS has run (we add `reveal-el` ourselves), so
// with JS disabled everything stays visible. The observer then fades each
// card up as it scrolls into view.
let revealObserver = null
function setupReveal() {
  if (typeof window === 'undefined' || prefersReduced()) return
  revealObserver?.disconnect()
  const els = document.querySelectorAll('[data-reveal-card]')
  els.forEach((el) => el.classList.add('reveal-el'))
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          revealObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )
  els.forEach((el) => revealObserver.observe(el))
}

onMounted(() => {
  runHeroAnim()
  setupReveal()
})

// Re-run both when the perspective changes (a fresh hero + card set render).
// Also mirror the choice into the URL so the view stays shareable.
watch(role, async (r) => {
  router.replace({ query: { ...route.query, sample: r } }).catch(() => {})
  runHeroAnim()
  await nextTick()
  setupReveal()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  revealObserver = null
})

// "Start a Property Passport" — logged-in users go to Explore to claim a
// property; visitors without an account are sent to sign up first.
function startPassport() {
  const loggedIn =
    typeof window !== 'undefined' && !!localStorage.getItem('token')
  navigateTo(loggedIn ? '/explore' : '/onboarding/signup')
}

const sections = [
  {
    title: 'Title Deeds and Plan',
    points: 100,
    docs: '2/2',
    questions: '3/3',
    pct: 100,
    icon: '<img src="/sample-passport-icon/titleDeedsAndPlan.png" alt="" />',
  },
  {
    title: 'Searches',
    points: 90,
    docs: '3/3',
    questions: '4/4',
    pct: 100,
    icon: '<img src="/sample-passport-icon/searches.png" alt="" />',
  },
  {
    title: 'Fixtures and Fittings',
    points: 100,
    docs: '24/24',
    questions: '6/6',
    pct: 100,
    icon: '<img src="/sample-passport-icon/fixturesAndFittings.png" alt="" />',
  },
  {
    title: 'Boundaries',
    points: 80,
    docs: '1/1',
    questions: '3/3',
    pct: 100,
    icon: '<img src="/sample-passport-icon/boundaries.png" alt="" />',
  },
]

// Landlord perspective — grouped compliance record for 14 Hazel Grove.
const landlordGroups = [
  {
    label: 'Statutory — Annual / 5-yearly',
    items: [
      {
        title: 'Gas Safety Certificate (CP12)',
        sub: 'Annual · renewing in 30 days',
        docs: '1/1 doc',
        status: { label: 'Renew soon', tone: 'warn' },
        pct: 68,
        tone: 'amber',
        foot: 'Action by 30 May',
        iconClass: 'sp-card-ic--img',
        icon: '<img src="/passport-seller-and-buyer-icon/gasSafetyCertificate.png" alt="" />',
      },
      {
        title: 'Electrical Safety (EICR)',
        sub: '5-yearly · valid to Apr 2028',
        docs: '1/1 doc',
        status: { label: 'Satisfactory', tone: 'ok' },
        pct: 100,
        tone: 'teal',
        iconClass: 'sp-card-ic--img',
        icon: '<img src="/passport-seller-and-buyer-icon/electricalSafety.png" alt="" />',
      },
    ],
  },
  {
    label: 'Tenancy & Deposit',
    items: [
      {
        title: 'Tenancy Agreement (AST)',
        sub: 'Signed · J. Smith · 12-month term',
        docs: '1/1 doc',
        status: { label: 'Active', tone: 'ok' },
        pct: 100,
        tone: 'teal',
        iconClass: 'sp-card-ic--img',
        icon: '<img src="/passport-seller-and-buyer-icon/tenancyAgreement.png" alt="" />',
      },
    ],
  },
  {
    label: 'Insurance & HMO',
    items: [
      {
        title: 'Landlord Insurance',
        sub: 'Direct Line · cover £350k · valid 2026',
        docs: '1/1 doc',
        status: { label: 'Active', tone: 'ok' },
        pct: 100,
        tone: 'teal',
        iconClass: 'sp-card-ic--img',
        icon: '<img src="/passport-seller-and-buyer-icon/landlordInsurance.png" alt="" />',
      },
    ],
  },
]

// Buyer perspective — read-only view of the unlocked passport for 55 Woodfield Road.
const buyerDetails = [
  {
    label: 'Property type',
    value: 'House',
    icon: '<img src="/passport-seller-and-buyer-icon/propertyType.png" alt="" />',
  },
  {
    label: 'Title number',
    value: 'WM854712',
    icon: '<img src="/passport-seller-and-buyer-icon/titleNumber.png" alt="" />',
  },
  {
    label: 'Area sqft',
    value: '1,406 sqft',
    icon: '<img src="/passport-seller-and-buyer-icon/areaSqft.png" alt="" />',
  },
  {
    label: 'EPC rating',
    value: 'C',
    icon: '<img src="/passport-seller-and-buyer-icon/epcRating.png" alt="" />',
  },
  {
    label: 'Tenure',
    value: 'Freehold',
    icon: '<img src="/passport-seller-and-buyer-icon/tenure.png" alt="" />',
  },
  {
    label: 'Year built',
    value: '1968',
    icon: '<img src="/passport-seller-and-buyer-icon/yearBuilt.png" alt="" />',
  },
]

const buyerDownloads = [
  {
    title: 'Full Property Report',
    sub: 'All questions & answers — share with solicitors',
    cta: 'Download PDF',
    tone: 'teal',
    icon: '/passport-seller-and-buyer-icon/clipboard.png',
  },
  {
    title: 'TA6 Property Information Form',
    sub: 'Law Society 6th edition — pre-filled with passport data',
    cta: 'Download TA6',
    tone: 'purple',
    icon: '/passport-seller-and-buyer-icon/transactionInformation.png',
  },
  {
    title: 'TA10 Fixtures & Fittings Form',
    sub: "What stays, what goes — pre-filled from seller's passport",
    cta: 'Download TA10',
    tone: 'blue',
    icon: '/passport-seller-and-buyer-icon/fixturesAndFittings.png',
  },
]

const buyerRecords = [
  {
    title: 'Title Deeds and Plan',
    sub: 'Official copies and title plan.',
    thumb: 'by-record-thumb--img',
    icon: '<img src="/sample-passport-icon/titleDeedsAndPlan.png" alt="" />',
  },
  {
    title: 'Searches',
    sub: 'Local authority, water and environmental searches.',
    thumb: 'by-record-thumb--img',
    icon: '<img src="/sample-passport-icon/searches.png" alt="" />',
  },
  {
    title: 'Fixtures and Fittings',
    sub: 'What stays and what goes (TA10).',
    thumb: 'by-record-thumb--img',
    icon: '<img src="/sample-passport-icon/fixturesAndFittings.png" alt="" />',
  },
  {
    title: 'Boundaries',
    sub: 'Fences, walls and boundary responsibilities.',
    thumb: 'by-record-thumb--img',
    icon: '<img src="/sample-passport-icon/boundaries.png" alt="" />',
  },
]
</script>

<style scoped>
.sp-root {
  --navy: #231d45;
  --navy-2: #2c2456;
  --teal: #00a19a;
  --teal-dark: #00857f;
  --teal-bright: #2fd0c6;
  --ink: #231d45;
  --ink-soft: #5a5570;
  --ink-faint: #8b8799;
  --line: #e7e2d6;
  --bg: #f4f2ed;
  --card: #ffffff;

  min-height: 100dvh;
  color: var(--ink);
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}

.sp-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
}

/* ── Nav ─────────────────────────────────────────────────────────── */
.spn-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(244, 242, 237, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.spn-nav-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.spn-brand {
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

.spn-brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.spn-brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.spn-brand-beta {
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

.spn-links {
  display: flex;
  gap: 4px;
}

.spn-links button {
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

.spn-links button:hover {
  color: var(--navy);
  background: rgba(35, 29, 69, 0.05);
}

.spn-links button.active {
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.spn-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.spn-signin {
  height: 42px;
  padding: 0 16px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--navy);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.spn-signin:hover {
  border-color: rgba(0, 161, 154, 0.4);
}

.spn-cta {
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

.spn-cta:hover {
  transform: translateY(-1px);
  background: var(--teal-dark);
}

/* ── Sample banner ───────────────────────────────────────────────── */
.sp-banner {
  background: #fbeed3;
  border-bottom: 1px solid #f0dcae;
}

.sp-banner-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 10px 0;
}

.sp-banner-pill {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #fff;
  background: #d99a2b;
  border-radius: 999px;
  padding: 7px 16px;
}

.sp-banner-text {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #8a6d34;
}

.sp-banner-text strong {
  font-weight: 800;
  color: #b8791b;
}

/* ── Main ────────────────────────────────────────────────────────── */
.sp-main {
  padding: 40px 0 64px;
}

/* ── Head + roles ────────────────────────────────────────────────── */
.sp-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.sp-head-copy h1 {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 38px);
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.03em;
}

.sp-head-copy p {
  margin: 8px 0 0;
  font-size: 15.5px;
  font-weight: 500;
  color: var(--ink-faint);
}

.sp-roles {
  display: inline-flex;
  gap: 4px;
  padding: 5px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.05);
  flex-shrink: 0;
}

.sp-role {
  border: 0;
  background: transparent;
  color: var(--ink-soft);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 9px 22px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.sp-role:hover {
  color: var(--navy);
}

.sp-role.active {
  color: #fff;
  background: var(--navy);
  box-shadow: 0 6px 16px rgba(35, 29, 69, 0.22);
}

/* ── Hero card ───────────────────────────────────────────────────── */
.sp-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 26px;
  padding: 22px 28px;
  border-radius: 24px;
  background:
    radial-gradient(120% 140% at 100% 0%, #2f2760 0%, transparent 55%),
    linear-gradient(135deg, #241e47 0%, #1c1738 100%);
  box-shadow: 0 24px 50px rgba(35, 29, 69, 0.22);
}

.sp-hero-book {
  width: 150px;
  flex-shrink: 0;
}

.sp-hero-book :deep(.passport-card) {
  margin: 0;
}

/* middle info */
.sp-hero-info {
  min-width: 0;
}

.sp-hero-kicker {
  display: block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--teal-bright);
}

.sp-hero-addr {
  margin: 6px 0 0;
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.sp-hero-place {
  margin: 5px 0 0;
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
}

.sp-hero-stats {
  display: flex;
  gap: 24px;
  margin: 14px 0 16px;
}

.sp-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sp-stat-num {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  font-feature-settings: 'tnum';
}

.sp-stat-num em {
  font-style: normal;
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}

.sp-stat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.sp-hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.sp-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}

.sp-hero-btn svg {
  width: 18px;
  height: 18px;
}

.sp-hero-btn--pub {
  background: var(--teal);
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.32);
}

.sp-hero-btn--match {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.92);
}

.sp-hero-badge {
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--teal);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

/* right progress */
.sp-hero-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 18px 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  flex-shrink: 0;
}

.sp-ring {
  position: relative;
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
}

.sp-ring svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.sp-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.12);
  stroke-width: 8;
}

.sp-ring-meter {
  fill: none;
  stroke: var(--teal-bright);
  stroke-width: 8;
  stroke-linecap: round;
}

.sp-ring-val {
  position: relative;
  font-size: 23px;
  font-weight: 800;
  color: #fff;
}

.sp-progress-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.sp-progress-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 161, 154, 0.16);
  border: 1px solid rgba(47, 208, 198, 0.32);
  border-radius: 999px;
  padding: 6px 14px;
}

.sp-progress-chip i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--teal-bright);
}

/* ── Collaborators ───────────────────────────────────────────────── */
.sp-collab {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding: 16px 22px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.04);
}

.sp-collab-add {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.6px dashed rgba(0, 161, 154, 0.5);
  color: var(--teal);
  font-size: 20px;
  font-weight: 400;
  flex-shrink: 0;
}

.sp-collab-avatars {
  display: inline-flex;
}

.sp-collab-av {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  border: 2px solid #fff;
}

.sp-collab-av--navy {
  background: var(--navy);
}

.sp-collab-av--teal {
  background: var(--teal);
  margin-left: -10px;
}

.sp-collab-text {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
}

.sp-collab-arrow {
  margin-left: auto;
  color: var(--ink-faint);
}

.sp-collab-arrow svg {
  width: 18px;
  height: 18px;
}

/* ── Tabs ────────────────────────────────────────────────────────── */
.sp-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin: 26px 0 20px;
}

.sp-tab-group {
  display: inline-flex;
  gap: 4px;
  padding: 5px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.05);
}

.sp-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: var(--ink-soft);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.sp-tab svg {
  width: 16px;
  height: 16px;
}
.sp-tab-ic {
  width: 19px;
  height: 19px;
  object-fit: contain;
  flex-shrink: 0;
}

.sp-tab:hover {
  color: var(--navy);
}

.sp-tab.active {
  color: #fff;
  background: var(--teal);
  box-shadow: 0 8px 18px rgba(0, 161, 154, 0.28);
}

.sp-tab-badge {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(0, 161, 154, 0.16);
  color: var(--teal-dark);
  font-size: 11px;
  font-weight: 800;
}

.sp-tab.active .sp-tab-badge {
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
}

/* ── Section cards ───────────────────────────────────────────────── */
.sp-sections {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

.sp-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.05);
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
}

.sp-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 38px rgba(35, 29, 69, 0.1);
  border-color: rgba(0, 161, 154, 0.3);
}

.sp-card-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.sp-card-ic {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--teal);
  color: #fff;
  flex-shrink: 0;
}

/* Illustrated PNG icons (seller sections) — let the artwork fill the tile */
.sp-card-ic--img {
  background: transparent;
  border-radius: 12px;
}

.sp-card-ic--img :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Emoji icons (landlord cards) sit on the tinted tile */
.sp-card-ic--emoji {
  font-size: 24px;
  line-height: 1;
}

.sp-card-titles {
  flex: 1;
  min-width: 0;
}

.sp-card-titles h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.01em;
}

.sp-card-titles p {
  margin: 4px 0 0;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-faint);
}

.sp-card-go {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--teal);
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 8px 18px rgba(0, 161, 154, 0.28);
}

.sp-card-go svg {
  width: 18px;
  height: 18px;
}

.sp-card-pills {
  display: flex;
  gap: 10px;
  margin: 20px 0 22px;
}

.sp-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.09);
  border-radius: 999px;
  padding: 7px 14px;
}

.sp-pill svg {
  width: 13px;
  height: 13px;
}

.sp-card-track {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: #eceae2;
}

.sp-card-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal-bright) 100%);
}

.sp-card-pct {
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 14px;
  font-weight: 800;
  color: var(--navy);
}

/* ── More sections ───────────────────────────────────────────────── */
.sp-more {
  margin-top: 22px;
  padding: 26px 24px;
  border-radius: 20px;
  background: #e5f3f1;
  border: 1px solid rgba(0, 161, 154, 0.16);
  text-align: center;
}

.sp-more-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: var(--teal-dark);
}

.sp-more-list {
  margin: 8px 0 0;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-soft);
}

/* ── Want one CTA ────────────────────────────────────────────────── */
.sp-final {
  margin-top: 40px;
  padding: 64px 32px;
  border-radius: 28px;
  text-align: center;
  background:
    radial-gradient(120% 160% at 50% 0%, #2f2760 0%, transparent 60%),
    linear-gradient(135deg, #241e47 0%, #1a1533 100%);
  box-shadow: 0 30px 60px rgba(35, 29, 69, 0.24);
}

.sp-final h2 {
  margin: 0;
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
}

.sp-final p {
  margin: 16px 0 0;
  font-size: 17px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
}

.sp-final-btn {
  margin-top: 32px;
  height: 56px;
  padding: 0 34px;
  border-radius: 999px;
  border: 0;
  background: var(--teal);
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 34px rgba(0, 161, 154, 0.36);
  transition: transform 0.18s, background 0.18s;
}

.sp-final-btn:hover {
  transform: translateY(-2px);
  background: var(--teal-dark);
}

/* ══ LANDLORD perspective ════════════════════════════════════════ */
/* ── Landlord hero (light card) ──────────────────────────────────── */
.lp-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 26px;
  padding: 22px 28px;
  border-radius: 24px;
  background:
    radial-gradient(120% 150% at 100% 0%, rgba(0, 161, 154, 0.12) 0%, transparent 55%),
    linear-gradient(135deg, #eef4f0 0%, #e6efe9 100%);
  border: 1px solid rgba(0, 161, 154, 0.14);
  box-shadow: 0 18px 40px rgba(35, 29, 69, 0.08);
}

/* Compliance-progress ring card. Sits on the light landlord hero, so instead
   of the seller's dark panel it uses a soft teal-tinted glass surface that
   harmonises with the mint hero — dark text + teal ring for contrast. */
.lp-hero-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 18px 24px;
  border-radius: 18px;
  background:
    radial-gradient(130% 120% at 50% 0%, rgba(0, 161, 154, 0.1) 0%, transparent 62%),
    linear-gradient(160deg, #ffffff 0%, #f1faf8 100%);
  border: 1px solid rgba(0, 161, 154, 0.18);
  box-shadow:
    0 18px 40px rgba(0, 133, 127, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

/* Recolour the shared ring / label / chip for the light card (the seller
   copies of these stay white-on-navy). */
.lp-hero-progress .sp-ring-bg {
  stroke: rgba(0, 161, 154, 0.16);
}

.lp-hero-progress .sp-ring-val {
  color: var(--navy);
}

.lp-hero-progress .sp-progress-label {
  color: var(--ink-faint);
}

.lp-hero-progress .sp-progress-chip {
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  border-color: rgba(0, 161, 154, 0.3);
}

.lp-hero-book {
  position: relative;
  width: 148px;
  flex-shrink: 0;
  filter: drop-shadow(0 14px 28px rgba(20, 20, 32, 0.3));
}

.lp-hero-book-img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
  user-select: none;
  -webkit-user-drag: none;
}

.lp-hero-book-plate {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-align: center;
  pointer-events: none;
}

.lp-hero-book-line1 {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
}

.lp-hero-book-line2 {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.8);
}

.lp-hero-info {
  min-width: 0;
}

.lp-hero-kicker {
  display: block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--teal-dark);
}

.lp-hero-addr {
  margin: 6px 0 0;
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.lp-hero-place {
  margin: 5px 0 0;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-faint);
}

.lp-hero-stats {
  display: flex;
  gap: 24px;
  margin: 14px 0 14px;
}

.lp-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lp-stat-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--navy);
  line-height: 1;
  font-feature-settings: 'tnum';
}

.lp-stat-num em {
  font-style: normal;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-faint);
}

.lp-stat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.lp-hero-warn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #d97706;
}

.lp-hero-warn i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
}

/* ── Convert banner ──────────────────────────────────────────────── */
.lp-convert {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-top: 18px;
  padding: 20px 24px;
  border: 0;
  border-radius: 20px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  color: #fff;
  background: linear-gradient(135deg, var(--teal) 0%, #0b8f89 100%);
  box-shadow: 0 18px 40px rgba(0, 133, 127, 0.32);
  transition: transform 0.18s, box-shadow 0.18s;
}

.lp-convert:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px rgba(0, 133, 127, 0.4);
}

.lp-convert-ic {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.16);
  flex-shrink: 0;
}

.lp-convert-ic svg {
  width: 22px;
  height: 22px;
}

.lp-convert-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.lp-convert-copy strong {
  font-size: 17px;
  font-weight: 800;
}

.lp-convert-copy small {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.82);
}

.lp-convert-arrow {
  margin-left: auto;
  color: rgba(255, 255, 255, 0.85);
  flex-shrink: 0;
}

.lp-convert-arrow svg {
  width: 20px;
  height: 20px;
}

/* ── Landlord tabs — navy active ─────────────────────────────────── */
.lp-tabs {
  justify-content: flex-start;
}

.sp-tab--navy.active {
  background: var(--navy);
  box-shadow: 0 8px 18px rgba(35, 29, 69, 0.28);
}

.sp-tab--navy.active .sp-tab-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* ── Grouped sections ────────────────────────────────────────────── */
.lp-group + .lp-group {
  margin-top: 28px;
}

.lp-group-label {
  margin: 0 0 14px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* Softer, tinted section icons for the landlord view */
.sp-card-ic--amber {
  background: rgba(245, 158, 11, 0.14);
  color: #e08a00;
}

.sp-card-ic--green {
  background: rgba(0, 161, 154, 0.14);
  color: var(--teal);
}

.sp-card-ic--cream {
  background: rgba(180, 150, 90, 0.16);
  color: #9c7b3a;
}

.sp-card-ic--red {
  background: rgba(225, 84, 84, 0.14);
  color: #d64545;
}

.lp-card-go {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(35, 29, 69, 0.06);
  color: var(--ink-faint);
  flex-shrink: 0;
}

.lp-card-go svg {
  width: 16px;
  height: 16px;
}

.lp-doc-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink-soft);
  background: rgba(35, 29, 69, 0.05);
  border-radius: 999px;
  padding: 7px 13px;
}

.lp-doc-pill svg {
  width: 13px;
  height: 13px;
}

.lp-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 800;
  border-radius: 999px;
  padding: 7px 13px;
}

.lp-status-pill svg {
  width: 13px;
  height: 13px;
}

.lp-status-pill--ok {
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
}

.lp-status-pill--warn {
  color: #b45309;
  background: rgba(245, 158, 11, 0.16);
}

.sp-card-fill--amber {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.sp-card-pct--amber {
  color: #b45309;
}

/* ── CTA colour variants ─────────────────────────────────────────── */
.sp-final--teal {
  background:
    radial-gradient(120% 160% at 50% 0%, rgba(47, 208, 198, 0.28) 0%, transparent 60%),
    linear-gradient(135deg, var(--teal) 0%, #007a75 100%);
  box-shadow: 0 30px 60px rgba(0, 133, 127, 0.3);
}

.sp-final-btn--navy {
  background: #fff;
  color: var(--navy);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
}

.sp-final-btn--navy:hover {
  background: #f4f2ed;
}

/* ══ BUYER perspective ═══════════════════════════════════════════ */
/* ── Unlocked banner ─────────────────────────────────────────────── */
.by-unlock {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  margin-bottom: 18px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f1edfb 0%, #eef4fb 100%);
  border: 1px solid rgba(109, 92, 224, 0.18);
}

.by-unlock-ic {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: rgba(109, 92, 224, 0.14);
  color: #6d5ce0;
  flex-shrink: 0;
}

.by-unlock-ic {
  box-sizing: border-box;
  padding: 8px;
  object-fit: contain;
}
.by-unlock-ic svg {
  width: 22px;
  height: 22px;
}

.by-unlock-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.by-unlock-copy strong {
  font-size: 15.5px;
  font-weight: 800;
  color: var(--navy);
}

.by-unlock-copy small {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-faint);
}

/* ── Verified hero (mirrors the seller navy hero) ────────────────── */
.by-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 26px;
  padding: 22px 28px;
  border-radius: 24px;
  background:
    radial-gradient(120% 140% at 100% 0%, #2f2760 0%, transparent 55%),
    linear-gradient(135deg, #241e47 0%, #1c1738 100%);
  box-shadow: 0 24px 50px rgba(35, 29, 69, 0.22);
}

.by-hero-book {
  width: 132px;
  flex-shrink: 0;
}

.by-hero-book :deep(.passport-card) {
  margin: 0;
}

.by-hero-info {
  min-width: 0;
}

.by-hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--teal-bright);
}

.by-hero-kicker svg {
  width: 15px;
  height: 15px;
}

.by-hero-addr {
  margin: 6px 0 0;
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

.by-hero-place {
  margin: 5px 0 0;
  font-size: 14.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.62);
}

.by-hero-stats {
  display: flex;
  gap: 30px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.by-hstat {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.by-hstat-num {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.by-hstat-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Headline address / value ────────────────────────────────────── */
.by-lead {
  margin-top: 28px;
}

.by-lead-addr {
  margin: 0;
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.02em;
}

.by-lead-place {
  margin: 6px 0 0;
  font-size: 15.5px;
  font-weight: 600;
  color: var(--teal-dark);
}

.by-lead-value {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.by-lead-value strong {
  font-size: 28px;
  font-weight: 800;
  color: var(--teal-dark);
  letter-spacing: -0.01em;
}

.by-lead-value-label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.by-lead-flag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  border-radius: 999px;
  padding: 7px 14px;
}

.by-lead-flag svg {
  width: 14px;
  height: 14px;
}

.by-lead-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.by-chip {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ink-soft);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 16px;
}

.by-chip b {
  color: var(--navy);
  font-weight: 800;
}

/* ── Section head ────────────────────────────────────────────────── */
.by-section-head {
  margin: 34px 0 16px;
}

.by-section-head h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.02em;
}

.by-section-head p {
  margin: 6px 0 0;
  font-size: 14.5px;
  font-weight: 500;
  color: var(--ink-faint);
}

/* ── Property details ────────────────────────────────────────────── */
.by-details-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px 28px;
  padding: 26px 28px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.05);
}

.by-detail {
  display: flex;
  align-items: center;
  gap: 13px;
}

.by-detail-ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.1);
  color: var(--teal);
  flex-shrink: 0;
}

.by-detail-ic :deep(svg) {
  width: 19px;
  height: 19px;
}
/* Illustrated variant — the artwork brings its own colour, so it fills the
   tile rather than sitting on the teal tint. */
.by-detail-ic :deep(img) {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.by-detail-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.by-detail-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.by-detail-value {
  font-size: 15.5px;
  font-weight: 800;
  color: var(--navy);
}

/* ── Download cards ──────────────────────────────────────────────── */
.by-downloads {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 20px;
}

.by-dl {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: space-between;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid transparent;
}

.by-dl--teal {
  background: #e5f4f2;
  border-color: rgba(0, 161, 154, 0.18);
}

.by-dl--purple {
  background: #efecfb;
  border-color: rgba(109, 92, 224, 0.18);
}

.by-dl--blue {
  background: #e7f0fc;
  border-color: rgba(45, 108, 223, 0.18);
}

.by-dl-ic {
  display: block;
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 12px;
}
.by-dl-copy h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: var(--navy);
}

.by-dl-copy p {
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
  line-height: 1.45;
}

.by-dl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 46px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.16s, filter 0.16s;
}

.by-dl-btn svg {
  width: 16px;
  height: 16px;
}

.by-dl-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.by-dl-btn--teal {
  background: var(--teal);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.28);
}

.by-dl-btn--purple {
  background: #00a19a;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.28);
}

.by-dl-btn--blue {
  background: #00a19a;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.28);
}

/* ── Seller completion ───────────────────────────────────────────── */
.by-completion {
  margin-top: 20px;
  padding: 22px 24px;
  border-radius: 18px;
  background: #e5f4f2;
  border: 1px solid rgba(0, 161, 154, 0.16);
}

.by-completion-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.by-completion-label {
  font-size: 15px;
  font-weight: 800;
  color: var(--navy);
}

.by-completion-pct {
  font-size: 16px;
  font-weight: 800;
  color: var(--teal-dark);
}

.by-completion-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(0, 161, 154, 0.16);
  overflow: hidden;
}

.by-completion-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal-bright) 100%);
}

.by-completion-sub {
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
}

/* ── Records search ──────────────────────────────────────────────── */
.by-search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 52px;
  padding: 0 16px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 14px;
  color: #a39e8e;
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.04);
}

.by-search:focus-within {
  border-color: var(--teal);
  color: var(--teal);
}

.by-search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
}

.by-search-input::placeholder {
  color: #a8a395;
  font-weight: 500;
}

.by-search-filter {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(0, 161, 154, 0.09);
  color: var(--teal);
  flex-shrink: 0;
}

.by-search-filter svg {
  width: 17px;
  height: 17px;
}

/* ── Record stats ────────────────────────────────────────────────── */
.by-recstats {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: 40px;
  margin: 16px 0 22px;
  padding: 22px 26px;
  border-radius: 18px;
  background: #eaf5f1;
  border: 1px solid rgba(0, 161, 154, 0.14);
}

.by-recstat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.by-recstat-num {
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
}

.by-recstat-num--teal {
  color: var(--teal-dark);
}

.by-recstat-num--amber {
  color: #d97706;
}

.by-recstat-num--muted {
  color: var(--ink-faint);
}

.by-recstat-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.by-recstats-note {
  grid-column: 1 / -1;
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
  line-height: 1.5;
}

/* ── Record cards ────────────────────────────────────────────────── */
.by-record {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.04);
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
}

.by-record:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 34px rgba(35, 29, 69, 0.1);
  border-color: rgba(0, 161, 154, 0.3);
}

.by-record-thumb {
  display: grid;
  place-items: center;
  width: 62px;
  height: 62px;
  border-radius: 14px;
  flex-shrink: 0;
}

/* Illustrated PNG record icons */
.by-record-thumb--img {
  background: transparent;
}

.by-record-thumb--img :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.by-record-body {
  flex: 1;
  min-width: 0;
}

.by-record-body h4 {
  margin: 0;
  font-size: 16.5px;
  font-weight: 800;
  color: var(--navy);
}

.by-record-body p {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-faint);
  line-height: 1.45;
}

.by-record-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--teal-dark);
  background: rgba(0, 161, 154, 0.1);
  border-radius: 999px;
  padding: 6px 12px;
}

.by-record-pill svg {
  width: 13px;
  height: 13px;
}

.by-record-track {
  position: relative;
  height: 7px;
  border-radius: 999px;
  background: #eceae2;
  margin-top: 14px;
}

.by-record-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--teal) 0%, var(--teal-bright) 100%);
}

.by-record-pct {
  position: absolute;
  right: 0;
  top: -22px;
  font-size: 13px;
  font-weight: 800;
  color: var(--navy);
}

.by-record-arrow {
  display: grid;
  place-items: center;
  align-self: center;
  color: var(--ink-faint);
  flex-shrink: 0;
}

.by-record-arrow svg {
  width: 18px;
  height: 18px;
}

/* ── Buyer CTA ───────────────────────────────────────────────────── */
.by-final {
  background:
    radial-gradient(120% 160% at 50% 0%, #2f2760 0%, transparent 60%),
    linear-gradient(135deg, #241e47 0%, #1a1533 100%);
}

.by-final-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 28px;
}

.by-ghost {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 48px;
  padding: 0 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.16s, border-color 0.16s;
}

.by-ghost svg {
  width: 17px;
  height: 17px;
}

.by-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.by-offer {
  margin-top: 16px;
  width: min(420px, 100%);
}

/* ── Responsive ──────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .sp-hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    padding: 30px 24px;
  }
  .sp-hero-info {
    text-align: center;
  }
  .sp-hero-stats {
    justify-content: center;
  }
  .sp-hero-actions {
    justify-content: center;
  }
  .sp-hero-progress {
    width: 100%;
  }
  .lp-hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    padding: 30px 24px;
  }
  .lp-hero-info {
    text-align: center;
  }
  .lp-hero-stats {
    justify-content: center;
  }
  .lp-hero-warn {
    justify-content: center;
  }
  .lp-hero-progress {
    width: 100%;
  }
  .by-hero {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    padding: 30px 24px;
  }
  .by-hero-info {
    text-align: center;
  }
  .by-hero-stats {
    justify-content: center;
  }
  .by-downloads {
    grid-template-columns: 1fr;
  }
  .by-details-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 720px) {
  .spn-links {
    display: none;
  }
  .sp-sections {
    grid-template-columns: 1fr;
  }
  .sp-head {
    flex-direction: column;
  }
  .sp-tabs {
    flex-direction: column;
    align-items: stretch;
  }
  .sp-tab-group {
    justify-content: center;
  }
}

@media (max-width: 560px) {
  .by-details-card {
    grid-template-columns: 1fr;
  }
  .by-recstats {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .sp-shell {
    width: calc(100% - 32px);
  }
  .spn-signin {
    display: none;
  }
  .sp-hero-stats {
    gap: 22px;
  }
}

/* ══ Engagement motion ═══════════════════════════════════════════
   Scroll-reveal for cards, progress-bar fills, and a living passport
   visual. Entrance uses the individual `translate` property so the
   card hover (which uses `transform`) keeps working independently. */
.reveal-el {
  opacity: 0;
  translate: 0 20px;
  transition: opacity 0.6s ease, translate 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal-el.is-in {
  opacity: 1;
  translate: 0 0;
}

/* Small in-row stagger so a grid row doesn't pop in all at once. */
.sp-sections .reveal-el:nth-child(2) {
  transition-delay: 0.07s;
}
.sp-sections .reveal-el:nth-child(3) {
  transition-delay: 0.12s;
}
.sp-sections .reveal-el:nth-child(4) {
  transition-delay: 0.18s;
}

/* Progress bars sit full at rest and replay the fill sweep only while their
   card is hovered. Applies to all three perspectives (shared fill classes). */
.sp-card-fill,
.by-record-fill,
.by-completion-fill {
  transform-origin: left;
}

.sp-card:hover .sp-card-fill,
.by-record:hover .by-record-fill,
.by-completion:hover .by-completion-fill {
  animation: sp-bar-fill 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes sp-bar-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Living passport visual — gentle float + tilt, straightens & lifts on hover. */
.sp-hero-book,
.by-hero-book {
  animation: sp-book-float 6.5s ease-in-out infinite;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

@keyframes sp-book-float {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-9px) rotate(1.5deg); }
}

.sp-hero:hover .sp-hero-book,
.by-hero:hover .by-hero-book {
  animation-play-state: paused;
  transform: translateY(-10px) rotate(0deg) scale(1.03);
}

/* A touch more life on the section-card hover + its arrow. */
.sp-card:hover {
  transform: translateY(-5px);
}
.sp-card:hover .sp-card-go {
  transform: scale(1.12);
  transition: transform 0.2s ease;
}
.by-record:hover {
  transform: translateY(-5px);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-el {
    opacity: 1;
    translate: none;
    transition: none;
  }
  .sp-card:hover .sp-card-fill,
  .by-record:hover .by-record-fill,
  .by-completion:hover .by-completion-fill,
  .sp-hero-book,
  .by-hero-book {
    animation: none;
  }
}
</style>
