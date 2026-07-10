<template>
  <div class="buyer-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-iconbtn" type="button" aria-label="Share" @click="openShareSheet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          <button class="hsw-back" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button v-if="data" class="hsw-ask" type="button" @click="askSeller">
            Ask the seller
          </button>
        </div>
      </div>
    </header>

    <main class="bpw-main">
    <!-- Loading -->
    <div v-if="loading" class="buyer-loading">
      <div class="buyer-spinner" />
      <p>Loading passport...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="buyer-loading">
      <p>{{ error }}</p>
    </div>

    <!-- Content -->
    <template v-else-if="data">
      <div class="bpw-shell">

        <!-- ── Passport hero ─────────────────────────────────────────── -->
        <section class="bp-hero" data-tour="hero">
          <div class="bp-hero-glow" />

          <div class="bp-hero-book">
            <PassportCard
              :line1="data.passport.addressLine1"
              :line2="data.passport.postcode"
            />
          </div>

          <div class="bp-hero-main">
            <div class="bp-hero-eyebrow">
              <span class="bp-hero-eyebrow-dot">✓</span>
              Verified Property Passport
            </div>
            <h1 class="bp-hero-title">{{ data.passport.addressLine1 }}</h1>
            <p class="bp-hero-loc">{{ cityLine }}</p>

            <div class="bp-hero-pricerow">
              <span v-if="data.property?.estimatedPrice" class="bp-hero-price">
                {{ formatPrice(data.property.estimatedPrice) }}
              </span>
              <span v-if="data.property?.propertyType" class="bp-hero-tag">
                {{ data.property.propertyType }}
              </span>
              <span v-if="data.property?.epcRating" class="bp-hero-tag">
                EPC {{ data.property.epcRating }}
              </span>
            </div>
            <p class="bp-hero-metaline">
              Estimated value · {{ overallProgressPct }}% complete ·
              {{ redFlags.length }} red flag{{ redFlags.length === 1 ? '' : 's' }}
            </p>

            <div class="bp-hero-stats">
              <div class="bp-hero-stat">
                <div class="bp-hero-stat-val bp-hero-stat-val--brand">
                  {{ heroHsScore }}
                </div>
                <div class="bp-hero-stat-lbl">HomeScore</div>
              </div>
              <div class="bp-hero-stat">
                <div class="bp-hero-stat-val">{{ heroDocsCount }}</div>
                <div class="bp-hero-stat-lbl">Documents</div>
              </div>
              <div class="bp-hero-stat">
                <div class="bp-hero-stat-val bp-hero-stat-val--ready">
                  {{ overallProgressPct }}%
                </div>
                <div class="bp-hero-stat-lbl">Answered</div>
              </div>
            </div>

            <div class="bp-hero-actions">
              <button class="bp-hero-ask" data-tour="ask" @click="askSeller">
                Ask the seller
              </button>
              <button
                class="bp-hero-save"
                :class="{ 'is-saved': isSavedToProfile }"
                @click="toggleSaveToProfile"
              >
                <span class="bp-hero-save-heart">{{ isSavedToProfile ? '♥' : '♡' }}</span>
                {{ isSavedToProfile ? 'Saved' : 'Save to profile' }}
              </button>
            </div>
          </div>

          <div class="bp-hero-ring-wrap">
            <div class="bp-hero-ring">
              <svg viewBox="0 0 120 120" class="bp-ring-svg">
                <circle class="bp-ring-bg" cx="60" cy="60" r="52" />
                <circle
                  class="bp-ring-fg"
                  cx="60"
                  cy="60"
                  r="52"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset"
                />
              </svg>
              <div class="bp-ring-center">
                <div class="bp-ring-pct">{{ overallProgressPct }}%</div>
                <div class="bp-ring-lbl">Answered</div>
              </div>
            </div>
            <div class="bp-hero-verified">
              <span class="bp-hero-verified-dot" />Verified record
            </div>
          </div>
        </section>

        <!-- ── Resume ────────────────────────────────────────────────── -->
        <button
          v-if="resumeSection"
          class="bp-resume"
          @click="goToResumeSection"
        >
          <div class="bp-resume-ic">↩</div>
          <div class="bp-resume-body">
            <div class="bp-resume-title">Pick up where you left off</div>
            <div class="bp-resume-sub">{{ resumeSection.title }}</div>
          </div>
          <span class="bp-resume-cta">Continue →</span>
        </button>

        <!-- ── Two-column body ───────────────────────────────────────── -->
        <div class="bp-grid">

          <!-- ── Main column ──────────────────────────────────────── -->
          <div class="bp-col-main">

            <!-- Documents & forms -->
            <section class="bp-block">
              <div class="buyer-eyebrow">Solicitor-grade</div>
              <h2 class="buyer-section-title">Documents &amp; forms</h2>
              <p class="buyer-section-sub">
                Ready-to-share packs — the paperwork a buyer's solicitor asks for
                on day one.
              </p>

              <!-- PDF Download -->
              <div class="buyer-pdf-row">
                <div class="buyer-pdf-ic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                    <line x1="8" y1="17" x2="13" y2="17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                  </svg>
                </div>
                <div class="buyer-pdf-info">
                  <p class="buyer-pdf-title">Full Property Report</p>
                  <p class="buyer-pdf-sub">
                    All questions &amp; answers — share with solicitors
                  </p>
                </div>
                <button
                  class="buyer-pdf-btn"
                  :disabled="generatingPdf"
                  @click="downloadPdf"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  {{ generatingPdf ? 'Opening…' : 'Download PDF' }}
                </button>
              </div>

              <!-- TA6 Form Download -->
              <div class="buyer-pdf-row buyer-ta6-row">
                <div class="buyer-pdf-ic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 10.5L12 3l9 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5 9.5V21h14V9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.5 21v-6h5v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="buyer-pdf-info">
                  <p class="buyer-pdf-title">TA6 Property Information Form</p>
                  <p class="buyer-pdf-sub">
                    Law Society 6th edition — pre-filled with passport data
                  </p>
                </div>
                <button
                  class="buyer-pdf-btn buyer-ta6-btn"
                  :disabled="generatingTA6"
                  @click="downloadTA6"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <polyline points="9,15 12,18 15,15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ generatingTA6 ? 'Opening…' : 'Download TA6' }}
                </button>
              </div>

              <!-- TA7 Form — leasehold only -->
              <div
                v-if="data?.property?.isLeasehold"
                class="buyer-pdf-row buyer-ta7-row"
              >
                <div class="buyer-pdf-ic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="8" cy="15" r="4" stroke="currentColor" stroke-width="1.8" />
                    <path d="M11 12L20 3M16 7l3 3M13.5 9.5l2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="buyer-pdf-info">
                  <p class="buyer-pdf-title">TA7 Leasehold Information Form</p>
                  <p class="buyer-pdf-sub">
                    Law Society 5th edition — lease, ground rent &amp; service charge
                    details
                  </p>
                </div>
                <button
                  class="buyer-pdf-btn buyer-ta7-btn"
                  :disabled="generatingTA7"
                  @click="downloadTA7"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <polyline points="9,15 12,18 15,15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ generatingTA7 ? 'Opening…' : 'Download TA7' }}
                </button>
              </div>

              <!-- TA10 Fixtures & Fittings Form -->
              <div class="buyer-pdf-row buyer-ta10-row">
                <div class="buyer-pdf-ic">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 18v-6a2 2 0 012-2h12a2 2 0 012 2v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 18h16M6 18v2M18 18v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 10V7a2 2 0 012-2h8a2 2 0 012 2v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="buyer-pdf-info">
                  <p class="buyer-pdf-title">TA10 Fixtures &amp; Fittings Form</p>
                  <p class="buyer-pdf-sub">
                    What stays, what goes — pre-filled from seller's passport
                  </p>
                </div>
                <button
                  class="buyer-pdf-btn buyer-ta10-btn"
                  :disabled="generatingTA10"
                  @click="downloadTA10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <polyline points="9,15 12,18 15,15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ generatingTA10 ? 'Opening…' : 'Download TA10' }}
                </button>
              </div>
            </section>

            <!-- Red Flags -->
            <div
              v-if="redFlags.length"
              class="buyer-redflags-card"
              data-tour="redflags"
            >
              <div class="buyer-redflags-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <line x1="12" y1="9" x2="12" y2="13" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
                </svg>
                <span
                  >{{ redFlags.length }} potential issue{{
                    redFlags.length > 1 ? 's' : ''
                  }}
                  flagged</span
                >
              </div>
              <ul class="buyer-redflags-list">
                <li v-for="flag in redFlags" :key="flag">{{ flag }}</li>
              </ul>
            </div>

            <!-- Official Records -->
            <section class="bp-block">
              <div class="buyer-eyebrow">Verified record</div>
              <h2 class="buyer-section-title">Official records</h2>
              <p class="buyer-section-sub">
                Verified documents that define the legal and structural status of
                the property.
              </p>

              <!-- Search -->
              <div class="buyer-search-row">
                <div class="buyer-search-input">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" class="buyer-search-icon">
                    <circle cx="11" cy="11" r="8" stroke="#999" stroke-width="2" />
                    <path d="M21 21l-4.35-4.35" stroke="#999" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search records..."
                  />
                </div>
                <button class="buyer-sort-btn">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M3 6h18M6 12h12M9 18h6" stroke="#00a19a" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </button>
              </div>

              <!-- Section completion summary -->
              <div
                v-if="data.sections?.length"
                class="bp-summary-row"
                data-tour="records"
              >
                <div class="bp-summary-card">
                  <div class="bp-summary-num bp-summary-num--done">
                    {{ summaryStats.done }}
                  </div>
                  <div class="bp-summary-lbl">Fully answered</div>
                </div>
                <div class="bp-summary-card">
                  <div class="bp-summary-num bp-summary-num--partial">
                    {{ summaryStats.partial }}
                  </div>
                  <div class="bp-summary-lbl">Partially answered</div>
                </div>
                <div class="bp-summary-card">
                  <div class="bp-summary-num bp-summary-num--empty">
                    {{ summaryStats.empty }}
                  </div>
                  <div class="bp-summary-lbl">Not yet shared</div>
                </div>
              </div>

              <!-- Records grid -->
              <div class="bp-records-grid">
                <div
                  v-for="section in filteredSections"
                  :key="section.id"
                  class="buyer-record-row"
                  :class="'state-' + sectionCompletion(section)"
                  @click="goToSection(section.id)"
                >
                  <div class="buyer-record-head">
                    <div class="buyer-record-icon">
                      <OPIcon
                        :name="section.imageKey || 'fittingsContents'"
                        class="w-[34px] h-[34px]"
                      />
                    </div>
                    <button class="buyer-record-arrow">
                      <OPIcon name="caretRight" class="w-[12px] h-[12px]" />
                    </button>
                  </div>
                  <div class="buyer-record-info">
                    <h3 class="buyer-record-title">{{ section.title }}</h3>
                    <p
                      v-if="section.subtitle || section.description"
                      class="buyer-record-sub"
                    >
                      {{ section.subtitle || section.description }}
                    </p>
                    <div class="buyer-record-meta">
                      <span
                        class="buyer-record-pill"
                        :class="'pill--' + sectionCompletion(section)"
                      >
                        <template v-if="sectionCompletion(section) === 'complete'">
                          ✓ Fully answered
                        </template>
                        <template
                          v-else-if="sectionCompletion(section) === 'partial'"
                        >
                          ⏳ Partially answered
                        </template>
                        <template v-else>○ Not started</template>
                      </span>
                    </div>
                    <div class="buyer-record-progress">
                      <div class="buyer-record-track">
                        <div
                          class="buyer-record-fill"
                          :class="'fill--' + sectionCompletion(section)"
                          :style="{ width: sectionPct(section) + '%' }"
                        />
                      </div>
                      <span class="buyer-record-pct">
                        {{ sectionPct(section) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Comparable Sales -->
            <section v-if="comparables.length" class="bp-block">
              <div class="buyer-eyebrow">Market context</div>
              <h2 class="buyer-section-title">Nearby sold prices</h2>
              <p class="buyer-section-sub">
                Recent Land Registry sales in the same postcode area.
              </p>
              <div class="buyer-comparables-list">
                <div
                  v-for="(comp, i) in comparables"
                  :key="i"
                  class="buyer-comp-row"
                >
                  <div class="buyer-comp-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <polyline points="9,22 9,12 15,12 15,22" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="buyer-comp-info">
                    <p class="buyer-comp-address">{{ comp.address }}</p>
                    <p class="buyer-comp-meta">
                      {{ comp.propertyType
                      }}<template v-if="comp.tenure"> · {{ comp.tenure }}</template>
                      · {{ formatSaleDate(comp.date) }}
                    </p>
                  </div>
                  <span class="buyer-comp-price">{{
                    formatSalePrice(comp.price)
                  }}</span>
                </div>
              </div>
            </section>
          </div>

          <!-- ── Sidebar ──────────────────────────────────────────── -->
          <aside class="bp-col-side">

            <!-- Property details -->
            <div class="bp-side-card" v-if="data.property">
              <h3 class="bp-side-title">Property details</h3>
              <p class="bp-side-sub">Key characteristics that define this property.</p>
              <div class="bp-pd-grid">
                <div class="bp-pd-item">
                  <div class="bp-pd-label">Property type</div>
                  <div class="bp-pd-value">{{ data.property.propertyType || '—' }}</div>
                </div>
                <div class="bp-pd-item">
                  <div class="bp-pd-label">Title number</div>
                  <div class="bp-pd-value">{{ data.property.titleNumber || '—' }}</div>
                </div>
                <div class="bp-pd-item">
                  <div class="bp-pd-label">Area sqft</div>
                  <div class="bp-pd-value">
                    {{
                      data.property.sqft
                        ? data.property.sqft.toLocaleString() + ' sqft'
                        : '—'
                    }}
                  </div>
                </div>
                <div class="bp-pd-item">
                  <div class="bp-pd-label">EPC rating</div>
                  <div class="bp-pd-value">
                    <template v-if="data.property.epcRating">
                      {{ data.property.epcRating }}
                      <span class="bp-pd-chip">To improve</span>
                    </template>
                    <template v-else>—</template>
                  </div>
                </div>
                <div class="bp-pd-item">
                  <div class="bp-pd-label">Tenure</div>
                  <div class="bp-pd-value">{{ displayTenure }}</div>
                </div>
                <div class="bp-pd-item">
                  <div class="bp-pd-label">Year built</div>
                  <div class="bp-pd-value">{{ data.property.yearBuilt || '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Expert Guidance -->
            <UnderReview
              title="Connect with a Property Expert"
              description="Our verified solicitors and surveyors are ready to review this passport with you."
              minimumTime="1 Day"
              @viewProfile="router.push('/passportview/expert')"
            />

            <!-- Seller completion -->
            <div class="bp-side-card">
              <h3 class="bp-side-title">Seller completion</h3>
              <div class="bp-sc-row">
                <span class="bp-sc-label">Sections answered</span>
                <span class="bp-sc-pct">{{ passportProgress }}%</span>
              </div>
              <div class="buyer-progress-track">
                <div
                  class="buyer-progress-fill"
                  :style="{ width: passportProgress + '%' }"
                />
              </div>
              <p class="bp-side-note">
                {{
                  passportProgress === 100
                    ? 'All sections completed by the seller.'
                    : "The seller is still completing some sections — you'll see updates here as they land."
                }}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </template>
    </main>

    <SiteFooter />

    <!-- Notes FAB -->
    <Teleport to="body">
      <button
        v-if="data"
        class="notes-fab"
        @click="showNotesSheet = true"
        :title="
          notes.length
            ? `${notes.length} note${notes.length > 1 ? 's' : ''}`
            : 'Add note'
        "
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-if="notes.length" class="notes-fab-badge">{{
          notes.length
        }}</span>
      </button>

      <!-- Notes Sheet -->
      <div
        v-if="showNotesSheet"
        class="sheet-backdrop"
        @click.self="showNotesSheet = false"
      >
        <div class="sheet-panel">
          <div class="sheet-handle" />
          <div class="sheet-header">
            <h3 class="sheet-title">My Notes</h3>
            <button class="sheet-close" @click="showNotesSheet = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#333" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <!-- Add note -->
          <div class="notes-compose">
            <textarea
              v-model="newNoteText"
              placeholder="Type a note about this property..."
              class="notes-textarea"
              rows="3"
            />
            <button
              class="notes-save-btn"
              :disabled="!newNoteText.trim() || savingNote"
              @click="saveNote"
            >
              {{ savingNote ? 'Saving…' : 'Save Note' }}
            </button>
          </div>

          <!-- Notes list -->
          <div class="notes-list">
            <div v-if="notes.length === 0" class="notes-empty">
              No notes yet. Add your first note above.
            </div>
            <div v-for="note in notes" :key="note.id" class="note-item">
              <p class="note-text">{{ note.text }}</p>
              <div class="note-footer">
                <span class="note-date">{{
                  new Date(note.createdAt).toLocaleDateString('en-GB')
                }}</span>
                <button class="note-delete" @click="deleteNote(note.id)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="3,6 5,6 21,6" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Sheet -->
      <div
        v-if="showShareSheet"
        class="sheet-backdrop"
        @click.self="showShareSheet = false"
      >
        <div class="sheet-panel">
          <div class="sheet-handle" />
          <div class="sheet-header">
            <h3 class="sheet-title">Share Passport</h3>
            <button class="sheet-close" @click="showShareSheet = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#333" stroke-width="2" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div v-if="!shareUrl" class="share-intro">
            <p class="share-hint">
              Generate a link that lets anyone view this passport for 3 hours —
              no login required.
            </p>
            <button
              class="share-generate-btn"
              :disabled="sharing"
              @click="createShareLink"
            >
              {{ sharing ? 'Generating…' : 'Generate Share Link' }}
            </button>
          </div>

          <div v-else class="share-result">
            <p class="share-expires">Expires at {{ shareExpiry }}</p>
            <div class="share-url-row">
              <span class="share-url-text">{{ shareUrl }}</span>
              <button class="share-copy-btn" @click="copyShareLink">
                {{ shareCopied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <button
              class="share-generate-btn share-regenerate"
              @click="createShareLink"
              :disabled="sharing"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Save toast -->
    <Transition name="buyer-toast">
      <div v-if="saveToast" class="buyer-save-toast">{{ saveToast }}</div>
    </Transition>

    <!-- Guided tour — auto-runs once per browser, replays from "?" in hero -->
    <OnboardingTour
      ref="buyerTourRef"
      :steps="buyerTourSteps"
      storage-key="umu_tour_buyer_passport_v1"
    />
  </div>
</template>

<script setup lang="ts">
import OPIcon from '~/components/ui/OPIcon.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import OnboardingTour from '~/components/ui/OnboardingTour.vue'
import PassportCard from '~/components/passport-view/PassportCard.vue'

// Guided tour for buyers — surfaces the things they care about most.
const buyerTourRef = ref<any>(null)
const buyerTourSteps = [
  {
    selector: '[data-tour="hero"]',
    title: 'Verified property record',
    body: 'Address, HomeScore, document count and how much of the seller\'s record has been completed.',
  },
  {
    selector: '.bp-col-main',
    title: 'Everything in one place',
    body: 'Documents, surveys, the seller\'s answers and the property history — no more chasing for paperwork.',
  },
  {
    selector: '[data-tour="records"]',
    title: 'Tap any section',
    body: 'See exactly what the seller has shared. Green means fully answered, amber is partial.',
  },
  {
    selector: '[data-tour="redflags"]',
    title: 'Red flags surface here',
    body: 'If anything needs attention you\'ll see it called out in amber so it doesn\'t catch you off guard.',
  },
  {
    selector: '[data-tour="ask"]',
    title: 'Ask the seller',
    body: 'Open a pre-filled chat with anything you want to clarify before you offer.',
  },
]
import UnderReview from '~/components/passport-view/UnderReview.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const passportId = route.params.id as string

const { generatePdf } = usePassportPdf()
const { generateTA6 } = useTA6Pdf()
const { generateTA7 } = useTA7Pdf()
const { generateFixturesFittings } = useFixturesFittingsPdf()

const data = ref<any>(null)
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const generatingPdf = ref(false)
const generatingTA6 = ref(false)
const generatingTA7 = ref(false)
const generatingTA10 = ref(false)

// Share sheet
const showShareSheet = ref(false)
const shareUrl = ref('')
const shareExpiry = ref('')
const sharing = ref(false)
const shareCopied = ref(false)

// Comparables
const comparables = ref<any[]>([])

// Notes
const showNotesSheet = ref(false)
const notes = ref<any[]>([])
const newNoteText = ref('')
const savingNote = ref(false)

onMounted(async () => {
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    data.value = await $fetch(
      `${config.public.apiBase}/passport/${passportId}/buyer-view`,
      { headers: { Authorization: `Bearer ${tok}` } },
    )
    await Promise.all([loadComparables(), loadNotes()])
    loadResumeSection()
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to load passport.'
  } finally {
    loading.value = false
  }
})

const cityLine = computed(() => {
  const p = data.value?.property
  if (!p) return data.value?.passport?.postcode || ''
  return [p.city || p.county, p.postcode].filter(Boolean).join(', ')
})

// Normalize tenure — EPC returns occupancy type, not legal tenure (freehold/leasehold)
const displayTenure = computed(() => {
  const raw = (data.value?.property?.tenure || '').trim()
  if (!raw) return '—'
  const lower = raw.toLowerCase()
  if (lower === 'f' || lower === 'freehold') return 'Freehold'
  if (lower === 'l' || lower === 'leasehold') return 'Leasehold'
  // EPC occupancy values are not legal tenure — suppress them
  if (
    lower.includes('owner-occupied') ||
    lower.includes('rented') ||
    lower.includes('unknown')
  )
    return '—'
  return raw
})

// Overall seller completion percentage
const passportProgress = computed(() => {
  if (!data.value?.sections) return 0
  let total = 0
  let answered = 0
  for (const section of data.value.sections) {
    for (const task of section.tasks || []) {
      for (const q of task.questions || []) {
        total++
        if (q.answer) answered++
      }
    }
  }
  return total === 0 ? 0 : Math.round((answered / total) * 100)
})

// ── Premium hero stat strip ──────────────────────────────────────
const overallProgressPct = computed(() => passportProgress.value)
const heroHsScore = computed(() => {
  const score =
    data.value?.property?.homeScore ?? data.value?.property?.epcScore
  return typeof score === 'number' ? score : '—'
})
const heroDocsCount = computed(() => {
  if (!data.value?.sections) return 0
  let n = 0
  for (const s of data.value.sections) {
    for (const t of s.tasks || []) {
      for (const q of t.questions || []) {
        if (q.answer?.fileUrl) n++
      }
    }
  }
  return n
})

// ── Progress ring geometry (r = 52) ──────────────────────────────
const ringCircumference = 2 * Math.PI * 52
const ringOffset = computed(
  () => ringCircumference - (overallProgressPct.value / 100) * ringCircumference,
)

// ── Section completion summary stats ─────────────────────────────
const summaryStats = computed(() => {
  const stats = { done: 0, partial: 0, empty: 0 }
  for (const s of data.value?.sections ?? []) {
    let total = 0
    let answered = 0
    for (const t of s.tasks || []) {
      for (const q of t.questions || []) {
        if (q.type === 'NOTE') continue
        total++
        if (q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl)) {
          answered++
        }
      }
    }
    if (total === 0 || answered === 0) stats.empty++
    else if (answered === total) stats.done++
    else stats.partial++
  }
  return stats
})

// ── Resume section — last viewed by this buyer (per-passport key) ──
const resumeSectionId = ref<string | null>(null)
const resumeSection = computed(() => {
  if (!resumeSectionId.value) return null
  return (
    data.value?.sections?.find((s: any) => s.id === resumeSectionId.value) ?? null
  )
})
function rememberSectionVisit(sectionId: string) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(`umu_buyer_resume_${passportId}`, sectionId)
  } catch {
    /* no-op */
  }
}
function loadResumeSection() {
  if (typeof localStorage === 'undefined') return
  try {
    resumeSectionId.value = localStorage.getItem(
      `umu_buyer_resume_${passportId}`,
    )
  } catch {
    resumeSectionId.value = null
  }
}
function goToResumeSection() {
  if (resumeSection.value?.id) {
    router.push(
      `/buyer-passport/section/${resumeSection.value.id}?passportId=${passportId}`,
    )
  }
}

// ── Save to profile ──────────────────────────────────────────────
const isSavedToProfile = ref(false)
const saveToast = ref('')
function toggleSaveToProfile() {
  // Optimistic UX — flips the heart and shows a quick toast.
  isSavedToProfile.value = !isSavedToProfile.value
  saveToast.value = isSavedToProfile.value
    ? 'Saved to your Buyer Profile'
    : 'Removed from your Buyer Profile'
  setTimeout(() => (saveToast.value = ''), 2200)
  // The real save endpoint can hook in here later.
}
function askSeller() {
  const url = `/contact/${data.value?.passport?.id ?? passportId}?prefill=I've reviewed the Passport — I'd like to ask about…`
  router.push(url)
}

// Red flag patterns scanned from all answer text
const RED_FLAG_PATTERNS = [
  {
    regex: /planning.*(notice|enforcement|objection)/i,
    label: 'Planning enforcement notice',
  },
  { regex: /asbestos/i, label: 'Asbestos reported' },
  { regex: /japanese knotweed/i, label: 'Japanese Knotweed present' },
  { regex: /subsidence/i, label: 'Subsidence mentioned' },
  { regex: /flood(ing)?/i, label: 'Flooding risk flagged' },
  { regex: /restrictive covenant/i, label: 'Restrictive covenant present' },
  { regex: /boundary dispute/i, label: 'Boundary dispute noted' },
]

const redFlags = computed(() => {
  if (!data.value?.sections) return []
  const flags: string[] = []
  for (const section of data.value.sections) {
    for (const task of section.tasks || []) {
      for (const q of task.questions || []) {
        const text = [
          q.answer?.answerText ?? '',
          JSON.stringify(q.answer?.answerJson ?? ''),
        ].join(' ')
        for (const pattern of RED_FLAG_PATTERNS) {
          if (pattern.regex.test(text) && !flags.includes(pattern.label)) {
            flags.push(pattern.label)
          }
        }
      }
    }
  }
  return flags
})

// Returns completion status for a section
function sectionCompletion(section: any): 'complete' | 'partial' | 'empty' {
  let total = 0
  let answered = 0
  for (const task of section.tasks || []) {
    for (const q of task.questions || []) {
      total++
      if (q.answer) answered++
    }
  }
  if (total === 0 || answered === 0) return 'empty'
  if (answered === total) return 'complete'
  return 'partial'
}

// Percentage answered, used by the section card's progress bar.
function sectionPct(section: any): number {
  let total = 0
  let answered = 0
  for (const task of section.tasks || []) {
    for (const q of task.questions || []) {
      total++
      if (q.answer) answered++
    }
  }
  if (!total) return 0
  return Math.round((answered / total) * 100)
}

const filteredSections = computed(() => {
  if (!data.value?.sections) return []
  const q = searchQuery.value.toLowerCase()
  if (!q) return data.value.sections
  return data.value.sections.filter(
    (s: any) =>
      s.title.toLowerCase().includes(q) ||
      (s.subtitle || '').toLowerCase().includes(q),
  )
})

function formatPrice(price: number) {
  return '£' + price.toLocaleString('en-GB')
}

function formatSalePrice(price: number) {
  return '£' + Math.round(price).toLocaleString('en-GB')
}

function formatSaleDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}

function downloadPdf() {
  if (!data.value) return
  generatingPdf.value = true
  try {
    generatePdf(data.value)
  } finally {
    setTimeout(() => {
      generatingPdf.value = false
    }, 800)
  }
}

function downloadTA6() {
  if (!data.value) return
  generatingTA6.value = true
  try {
    generateTA6(data.value)
  } finally {
    setTimeout(() => {
      generatingTA6.value = false
    }, 800)
  }
}

function downloadTA7() {
  if (!data.value) return
  generatingTA7.value = true
  try {
    generateTA7(data.value)
  } finally {
    setTimeout(() => {
      generatingTA7.value = false
    }, 800)
  }
}

function downloadTA10() {
  if (!data.value) return
  generatingTA10.value = true
  try {
    generateFixturesFittings(data.value)
  } finally {
    setTimeout(() => {
      generatingTA10.value = false
    }, 800)
  }
}

function goBack() {
  router.back()
}

function goToSection(sectionId: string) {
  rememberSectionVisit(sectionId)
  router.push(`/buyer-passport/section/${sectionId}?passportId=${passportId}`)
}

// ── Share ─────────────────────────────────────────────────────────────────
function openShareSheet() {
  shareUrl.value = ''
  shareExpiry.value = ''
  showShareSheet.value = true
}

async function createShareLink() {
  sharing.value = true
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await $fetch<{ url: string; expiresAt: string }>(
      `${config.public.apiBase}/passport/${passportId}/share`,
      { method: 'POST', headers: { Authorization: `Bearer ${tok}` } },
    )
    shareUrl.value = res.url
    shareExpiry.value = new Date(res.expiresAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } finally {
    sharing.value = false
  }
}

async function copyShareLink() {
  if (!shareUrl.value) return
  await navigator.clipboard.writeText(shareUrl.value)
  shareCopied.value = true
  setTimeout(() => {
    shareCopied.value = false
  }, 2000)
}

// ── Comparables ───────────────────────────────────────────────────────────
async function loadComparables() {
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await $fetch<any[]>(
      `${config.public.apiBase}/passport/${passportId}/comparables`,
      { headers: { Authorization: `Bearer ${tok}` } },
    )
    comparables.value = res
  } catch {
    // non-critical
  }
}

// ── Notes ─────────────────────────────────────────────────────────────────
async function loadNotes() {
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await $fetch<any[]>(
      `${config.public.apiBase}/passport/${passportId}/notes`,
      { headers: { Authorization: `Bearer ${tok}` } },
    )
    notes.value = res
  } catch {
    // non-critical
  }
}

async function saveNote() {
  if (!newNoteText.value.trim() || savingNote.value) return
  savingNote.value = true
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const note = await $fetch<any>(
      `${config.public.apiBase}/passport/${passportId}/notes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tok}`,
          'Content-Type': 'application/json',
        },
        body: { text: newNoteText.value.trim() },
      },
    )
    notes.value.unshift(note)
    newNoteText.value = ''
  } finally {
    savingNote.value = false
  }
}

async function deleteNote(noteId: string) {
  try {
    const tok =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    await $fetch(`${config.public.apiBase}/passport/notes/${noteId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tok}` },
    })
    notes.value = notes.value.filter((n) => n.id !== noteId)
  } catch {
    // non-critical
  }
}
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.buyer-page {
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
  --serif: 'Plus Jakarta Sans', sans-serif;
  --color-border: #ececf2;
  min-height: 100dvh;
  color: var(--ink);
  background: var(--bg);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}

/* ── Web nav ──────────────────────────────────────────────────────── */
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.hsw-nav-inner { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 9px; color: var(--navy); cursor: pointer; font-size: 19px; font-weight: 800; letter-spacing: -0.4px; flex-shrink: 0; font-family: inherit; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; gap: 4px; }
.hsw-links button { border: 0; background: transparent; color: var(--ink-soft); cursor: pointer; font-size: 14px; font-weight: 600; padding: 8px 12px; border-radius: 9px; white-space: nowrap; font-family: inherit; transition: background 0.15s, color 0.15s; }
.hsw-links button:hover { color: var(--navy); background: rgba(35, 29, 69, 0.05); }
.hsw-links button.active { color: var(--teal-dark); background: rgba(0, 161, 154, 0.1); box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24); }
.hsw-actions { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.hsw-iconbtn {
  width: 40px; height: 40px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink-soft);
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: border-color 0.16s, color 0.16s;
}
.hsw-iconbtn svg { width: 17px; height: 17px; }
.hsw-iconbtn:hover { border-color: var(--teal); color: var(--navy); }
.hsw-back { display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: var(--ink); font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: border-color 0.16s, transform 0.16s; }
.hsw-back:hover { border-color: var(--teal); transform: translateY(-1px); }
.hsw-back svg { width: 15px; height: 15px; }
.hsw-ask {
  height: 40px; padding: 0 18px; border-radius: 999px; border: none;
  background: linear-gradient(135deg, var(--teal), var(--teal-dark));
  color: #fff; font-family: inherit; font-size: 14px; font-weight: 800;
  letter-spacing: -0.01em; cursor: pointer; flex-shrink: 0;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
  transition: transform 0.14s, box-shadow 0.16s;
}
.hsw-ask:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(0, 161, 154, 0.34); }

/* ── Centered content shell ───────────────────────────────────────── */
.bpw-main { position: relative; z-index: 1; padding: 28px 0 72px; }
.bpw-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}
.bpw-main .buyer-loading { min-height: 50vh; }

.buyer-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: #666;
  font-size: 15px;
}
.buyer-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e0e0e0;
  border-top-color: #00a19a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Passport hero ────────────────────────────────────────────────── */
.bp-hero {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 30px;
  padding: 34px 38px;
  border-radius: 26px;
  background:
    radial-gradient(120% 140% at 85% 10%, #2c2456 0%, transparent 55%),
    linear-gradient(135deg, #1c1740 0%, #241d47 55%, #1a1638 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(28, 23, 64, 0.35);
}
.bp-hero-glow {
  position: absolute;
  right: 8%;
  top: -60px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(47, 208, 198, 0.18), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.bp-hero-book {
  width: 150px;
  flex-shrink: 0;
  filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.42));
  position: relative;
  z-index: 1;
}
.bp-hero-book :deep(.passport-card) { margin: 0; padding: 0; }
.bp-hero-book :deep(.passport-container) { width: 100%; height: 200px; }

.bp-hero-main { position: relative; z-index: 1; min-width: 0; }
.bp-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--teal-bright);
  margin-bottom: 10px;
}
.bp-hero-eyebrow-dot {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(47, 208, 198, 0.18);
  font-size: 10px;
}
.bp-hero-title {
  font-family: var(--serif);
  font-size: clamp(30px, 3.4vw, 40px);
  font-weight: 600;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.05;
  margin: 0 0 6px;
}
.bp-hero-loc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.62);
  margin: 0 0 16px;
  font-weight: 500;
}
.bp-hero-pricerow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
.bp-hero-price {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}
.bp-hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 5px 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.bp-hero-metaline {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 20px;
  font-weight: 500;
}
.bp-hero-stats {
  display: flex;
  gap: 34px;
  padding: 16px 0 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 22px;
}
.bp-hero-stat { min-width: 0; }
.bp-hero-stat-val {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.02em;
}
.bp-hero-stat-val--brand { color: var(--teal-bright); }
.bp-hero-stat-val--ready { color: var(--teal-bright); }
.bp-hero-stat-lbl {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 6px;
  font-weight: 700;
}
.bp-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.bp-hero-ask {
  padding: 12px 26px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--teal), var(--teal-dark));
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.3);
  transition: transform 0.14s, box-shadow 0.16s;
}
.bp-hero-ask:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(0, 161, 154, 0.4); }
.bp-hero-save {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.bp-hero-save:hover { border-color: rgba(255, 255, 255, 0.42); background: rgba(255, 255, 255, 0.08); }
.bp-hero-save.is-saved { border-color: #fecdd3; color: #ffe4e6; }
.bp-hero-save-heart { font-size: 15px; line-height: 1; }

/* Ring */
.bp-hero-ring-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.bp-hero-ring { position: relative; width: 150px; height: 150px; }
.bp-ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.bp-ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.1); stroke-width: 8; }
.bp-ring-fg {
  fill: none;
  stroke: var(--teal-bright);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease;
}
.bp-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.bp-ring-pct { font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1; }
.bp-ring-lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
.bp-hero-verified {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(47, 208, 198, 0.12);
  border: 1px solid rgba(47, 208, 198, 0.28);
  color: var(--teal-bright);
  font-size: 11.5px;
  font-weight: 700;
}
.bp-hero-verified-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--teal-bright); }

/* ── Resume ───────────────────────────────────────────────────────── */
.bp-resume {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin: 16px 0 0;
  padding: 16px 22px;
  background:
    radial-gradient(120% 200% at 100% 0%, #2c2456 0%, transparent 60%),
    linear-gradient(135deg, #201a3f, #191533);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: transform 0.15s ease;
}
.bp-resume:hover { transform: translateY(-1px); }
.bp-resume-ic {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.2);
  color: var(--teal-bright);
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 800;
  flex-shrink: 0;
}
.bp-resume-body { flex: 1; min-width: 0; }
.bp-resume-title { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
.bp-resume-sub { font-size: 12.5px; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }
.bp-resume-cta { color: var(--teal-bright); font-size: 13.5px; font-weight: 700; flex-shrink: 0; }

/* ── Two-column grid ──────────────────────────────────────────────── */
.bp-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  margin-top: 28px;
  align-items: start;
}
.bp-col-main { display: flex; flex-direction: column; gap: 34px; min-width: 0; }
.bp-col-side { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 92px; }
.bp-block { min-width: 0; }

/* Section heading — eyebrow + serif */
.buyer-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 6px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.75px;
  text-transform: uppercase;
  color: var(--teal);
}
.buyer-eyebrow-dash { width: 22px; height: 2px; border-radius: 2px; background: currentColor; }
.buyer-section-title {
  font-family: var(--serif);
  font-size: clamp(22px, 2.4vw, 27px);
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  line-height: 1.1;
}
.buyer-section-sub {
  font-size: 13.5px;
  color: var(--ink-faint);
  margin: 0 0 18px;
  line-height: 1.55;
  max-width: 62ch;
}

/* ── Document & form rows ──────────────────────────────────────────── */
.buyer-pdf-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px 18px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(35, 29, 69, 0.05);
  transition: border-color 0.16s, box-shadow 0.16s;
}
.buyer-pdf-row:hover { border-color: var(--teal); box-shadow: 0 10px 26px rgba(35, 29, 69, 0.08); }
.buyer-pdf-ic {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(0, 161, 154, 0.08);
  border: 1px solid rgba(0, 161, 154, 0.18);
  color: var(--teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.buyer-pdf-info { flex: 1; min-width: 0; }
.buyer-pdf-title { font-size: 14.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin: 0 0 2px; }
.buyer-pdf-sub { font-size: 12.5px; color: var(--ink-faint); margin: 0; line-height: 1.45; }
.buyer-pdf-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--teal);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 17px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.22);
  transition: transform 0.16s ease, background 0.16s ease, opacity 0.15s;
}
.buyer-pdf-btn:hover:not(:disabled) { transform: translateY(-1px); background: var(--teal-dark); }
.buyer-pdf-btn:disabled { opacity: 0.65; cursor: not-allowed; }
.buyer-pdf-btn:active:not(:disabled) { background: var(--teal-dark); }
.buyer-ta6-btn,
.buyer-ta7-btn,
.buyer-ta10-btn { background: #00a19a; box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26); }
.buyer-ta6-btn:hover:not(:disabled),
.buyer-ta7-btn:hover:not(:disabled),
.buyer-ta10-btn:hover:not(:disabled),
.buyer-ta6-btn:active:not(:disabled),
.buyer-ta7-btn:active:not(:disabled),
.buyer-ta10-btn:active:not(:disabled) { background: var(--teal-dark); }

/* ── Red Flags ────────────────────────────────────────────────────── */
.buyer-redflags-card {
  background: #fffbeb;
  border: 1px solid #f5e3ad;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(35, 29, 69, 0.05);
}
.buyer-redflags-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 800;
  color: #92400e;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.buyer-redflags-list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.buyer-redflags-list li { font-size: 12px; color: #78350f; line-height: 1.5; }

/* ── Search ───────────────────────────────────────────────────────── */
.buyer-search-row { display: flex; gap: 8px; margin-bottom: 14px; }
.buyer-search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 15px;
  box-shadow: 0 6px 18px rgba(35, 29, 69, 0.05);
  transition: border-color 0.16s;
}
.buyer-search-input:focus-within { border-color: var(--teal); }
.buyer-search-input input { flex: 1; border: none; outline: none; font-size: 14px; color: #333; background: transparent; font-family: inherit; }
.buyer-search-input input::placeholder { color: #999; }
.buyer-search-icon { flex-shrink: 0; }
.buyer-sort-btn {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.16s;
}
.buyer-sort-btn:hover { border-color: var(--teal); }

/* ── Summary stat cards ───────────────────────────────────────────── */
.bp-summary-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.bp-summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(35, 29, 69, 0.05);
}
.bp-summary-num { font-size: 22px; font-weight: 900; line-height: 1; letter-spacing: -0.02em; }
.bp-summary-num--done { color: #16a34a; }
.bp-summary-num--partial { color: #d97706; }
.bp-summary-num--empty { color: var(--ink-faint); }
.bp-summary-lbl {
  font-size: 10px;
  font-weight: 800;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.3;
}

/* ── Records grid ─────────────────────────────────────────────────── */
.bp-records-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.buyer-record-row {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.24s cubic-bezier(0.2, 0.7, 0.2, 1),
    border-color 0.2s ease, box-shadow 0.28s ease;
  box-shadow: 0 1px 3px rgba(35, 29, 69, 0.05);
}
/* Growing top accent bar */
.buyer-record-row::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--teal-bright));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.34s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.buyer-record-row:hover {
  transform: translateY(-4px);
  border-color: var(--teal);
  box-shadow: 0 20px 42px -14px rgba(0, 161, 154, 0.32),
    0 4px 14px rgba(35, 29, 69, 0.06);
}
.buyer-record-row:hover::before { transform: scaleX(1); }
.buyer-record-row:active {
  transform: translateY(-1px) scale(0.995);
  transition-duration: 0.08s;
}
.buyer-record-head { display: flex; align-items: flex-start; justify-content: space-between; }
.buyer-record-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  background: rgba(0, 161, 154, 0.08);
  border: 1px solid rgba(0, 161, 154, 0.18);
  color: var(--teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: transform 0.26s cubic-bezier(0.2, 0.7, 0.2, 1),
    background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.buyer-record-row:hover .buyer-record-icon {
  transform: scale(1.08) rotate(-3deg);
  background: rgba(0, 161, 154, 0.14);
  border-color: rgba(0, 161, 154, 0.32);
  box-shadow: 0 10px 20px -8px rgba(0, 161, 154, 0.35);
}
.buyer-record-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f8f7fc;
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--ink-faint);
  transition: transform 0.26s cubic-bezier(0.2, 0.7, 0.2, 1),
    background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.buyer-record-arrow :deep(img) { transition: filter 0.2s ease; }
.buyer-record-row:hover .buyer-record-arrow {
  background: var(--teal);
  border-color: var(--teal);
  color: #fff;
  transform: translateX(3px);
}
.buyer-record-row:hover .buyer-record-arrow :deep(img) {
  filter: brightness(0) invert(1);
}
.buyer-record-info { flex: 1; min-width: 0; }
.buyer-record-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.01em;
  line-height: 1.25;
  margin: 0 0 3px;
  transition: color 0.2s ease;
}
.buyer-record-row:hover .buyer-record-title { color: var(--teal-dark); }
.buyer-record-sub { font-size: 12px; color: var(--ink-faint); margin: 0 0 10px; line-height: 1.45; }
.buyer-record-meta { margin-bottom: 8px; }
.buyer-record-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  line-height: 1.4;
}
.pill--complete { background: #d1fae5; color: #1f7a66; border: 1px solid #a7f3d0; }
.pill--partial { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.pill--empty { background: #f1f5f9; color: var(--ink-soft); border: 1px solid #e2e8f0; }
.buyer-record-progress { display: flex; align-items: center; gap: 8px; }
.buyer-record-track { flex: 1; height: 5px; background: #eef0f6; border-radius: 999px; overflow: hidden; }
.buyer-record-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }
.fill--complete { background: linear-gradient(90deg, #16a34a, #34d399); }
.fill--partial { background: linear-gradient(90deg, #f59e0b, #f5c44c); }
.fill--empty { background: #e2e8f0; }
.buyer-record-pct { font-size: 11px; font-weight: 800; color: var(--ink-soft); min-width: 32px; text-align: right; letter-spacing: -0.01em; }

/* ── Comparables ──────────────────────────────────────────────────── */
.buyer-comparables-list {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: #fff;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.06);
}
.buyer-comp-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.12s;
}
.buyer-comp-row:hover { background: #f0fdfa; }
.buyer-comp-row:last-child { border-bottom: none; }
.buyer-comp-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(0, 161, 154, 0.08);
  border: 1px solid rgba(0, 161, 154, 0.18);
  color: var(--teal);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.buyer-comp-info { flex: 1; min-width: 0; }
.buyer-comp-address { font-size: 13.5px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.buyer-comp-meta { font-size: 11.5px; color: var(--ink-faint); margin: 0; }
.buyer-comp-price { font-size: 14px; font-weight: 800; color: #00a19a; letter-spacing: -0.01em; flex-shrink: 0; }

/* ── Sidebar cards ────────────────────────────────────────────────── */
.bp-side-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.06);
}
.bp-side-title { font-size: 16px; font-weight: 800; color: var(--ink); letter-spacing: -0.01em; margin: 0 0 4px; }
.bp-side-sub { font-size: 12.5px; color: var(--ink-faint); margin: 0 0 16px; line-height: 1.5; }
.bp-pd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.bp-pd-item {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: #fbfbfa;
}
.bp-pd-label {
  font-size: 9.5px;
  font-weight: 800;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 5px;
}
.bp-pd-value { font-size: 13.5px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.bp-pd-chip {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #b45309;
  background: #fef3c7;
  border: 1px solid #fde68a;
  padding: 2px 6px;
  border-radius: 6px;
}
.bp-sc-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.bp-sc-label { font-size: 12.5px; font-weight: 700; color: var(--ink-soft); }
.bp-sc-pct { font-size: 15px; font-weight: 800; color: #d97706; letter-spacing: -0.01em; }
.buyer-progress-track { height: 6px; background: #eef0f6; border-radius: 999px; overflow: hidden; margin-bottom: 10px; }
.buyer-progress-fill { height: 100%; background: linear-gradient(90deg, #00a19a, #00b5ad); border-radius: 999px; transition: width 0.6s ease; }
.bp-side-note { font-size: 11.5px; color: var(--ink-faint); margin: 0; line-height: 1.5; }

/* ── Notes FAB ────────────────────────────────────────────────────── */
.notes-fab {
  position: fixed;
  bottom: 28px;
  right: 24px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a19a, #00857f);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(0, 161, 154, 0.4);
  z-index: 50;
  transition: transform 0.15s;
}
.notes-fab:active { transform: scale(0.94); }
.notes-fab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Bottom Sheets ────────────────────────────────────────────────── */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fade-in 0.2s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.sheet-panel {
  width: 100%;
  max-width: 460px;
  max-height: 84vh;
  background: white;
  border-radius: 20px;
  overflow-y: auto;
  padding: 20px 22px 28px;
  animation: pop-in 0.22s ease;
  color-scheme: light;
}
@keyframes pop-in { from { transform: translateY(12px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
.sheet-handle { display: none; }
.sheet-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.sheet-title { font-size: 17px; font-weight: 800; color: #231d45; margin: 0; }
.sheet-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notes-compose { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.notes-textarea {
  width: 100%;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  background: #fff;
  resize: none;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  color-scheme: light;
}
.notes-textarea::placeholder { color: #9a9aa5; }
.notes-textarea:focus { border-color: #00a19a; }
.notes-save-btn {
  align-self: flex-end;
  background: #00a19a;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}
.notes-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.notes-list { display: flex; flex-direction: column; gap: 10px; }
.notes-empty { text-align: center; color: #999; font-size: 14px; padding: 24px 0; }
.note-item { background: #f8fffe; border: 1px solid #e0f5f4; border-radius: 10px; padding: 12px 14px; }
.note-text { font-size: 14px; color: #231d45; margin: 0 0 8px; line-height: 1.5; }
.note-footer { display: flex; justify-content: space-between; align-items: center; }
.note-date { font-size: 11px; color: #999; }
.note-delete { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; }
.share-intro,
.share-result { display: flex; flex-direction: column; gap: 12px; }
.share-hint { font-size: 14px; color: #555; margin: 0; line-height: 1.5; }
.share-generate-btn {
  background: #00a19a;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}
.share-generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.share-regenerate { background: #e6f9f7; color: #00a19a; border: 1.5px solid #b2e4e1; }
.share-expires { font-size: 12px; color: #999; margin: 0; }
.share-url-row { display: flex; align-items: center; gap: 8px; background: #f5f5f5; border-radius: 10px; padding: 10px 12px; }
.share-url-text { flex: 1; font-size: 12px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.share-copy-btn {
  background: #00a19a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
  font-family: inherit;
}
.share-copy-btn:active { background: #00877f; }

/* ── Save toast ───────────────────────────────────────────────────── */
.buyer-save-toast {
  position: fixed;
  left: 50%;
  top: 90px;
  transform: translateX(-50%);
  z-index: 60;
  background: #231d45;
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(35, 29, 69, 0.32);
  letter-spacing: -0.01em;
}
.buyer-toast-enter-active,
.buyer-toast-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.buyer-toast-enter-from,
.buyer-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-12px); }

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 1040px) {
  .bp-grid { grid-template-columns: 1fr; }
  .bp-col-side { position: static; }
  .bp-col-side .bp-side-card { max-width: none; }
}
@media (max-width: 900px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 60px; }
  .bpw-shell { width: calc(100% - 32px); }
  .bp-hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 28px 22px;
    gap: 22px;
  }
  .bp-hero-book { margin: 0 auto; }
  .bp-hero-eyebrow,
  .bp-hero-pricerow,
  .bp-hero-stats,
  .bp-hero-actions { justify-content: center; }
  .bp-hero-stats { justify-content: center; }
  .bp-hero-ring-wrap { margin: 0 auto; }
}
@media (max-width: 640px) {
  .hsw-ask { display: none; }
  .bp-summary-row { grid-template-columns: 1fr; }
  .bp-records-grid { grid-template-columns: 1fr; }
  .bp-hero-stats { gap: 22px; }
  .bpw-main { padding-top: 16px; }
}
</style>
