<template>
  <div class="hs-v6-score">
    <!-- ── EPC NOT AVAILABLE — empty state ──────────────────────────
         When the property has no EPC certificate on the gov register,
         we don't fabricate scores from dummy data. Instead we surface
         a clear "EPC not available" card so the user knows what's
         missing and what to do next. -->
    <template v-if="!hasEpcData">
      <!-- No-EPC report — same nd-* desktop language as the EPC-present
           report: address hero on the left, premium navy estimate card
           on the right. Emits 'refine' to drive the estimator quiz. -->
      <div class="nd-report">
        <section class="nd-hero anim-1">
          <div class="nd-hero-main">
            <div class="nd-eyebrow">HOMESCORE<sup>™</sup> REPORT</div>
            <h1 class="nd-hero-title">{{ addrLineFull }}</h1>

            <div class="nd-hero-chips">
              <span v-if="property?.postcode" class="nd-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                {{ property.postcode }}
              </span>
              <span v-if="property?.propertyType" class="nd-chip">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
                {{ property.propertyType }}
              </span>
              <span class="nd-chip nd-chip--epc">
                <span class="nd-chip-grade" style="background:#a8a9ad">?</span>
                No EPC on file
              </span>
            </div>

            <div class="nd-hero-social">
              <span class="nd-social"><span class="nd-social-dot is-live" /><b>{{ searchesTodayDisplay }}</b>&nbsp;checked this HomeScore today</span>
              <span class="nd-social-sep">·</span>
              <span class="nd-social"><span class="nd-social-dot" /><b>{{ watchersDisplay }}</b>&nbsp;{{ (watchersCount || 0) === 1 ? 'is' : 'are' }} watching this property</span>
            </div>

            <div class="nd-noepc-info">
              <span class="nd-noepc-info-ico"><Icon name="i-lucide-info" /></span>
              <span>
                Where you're not sure, we assume what's <b>typical for the
                property's age</b> — exactly like the official RdSAP method.
                Every confident answer tightens your estimate.
              </span>
            </div>
          </div>

          <aside class="nd-noepc-card">
            <div class="nd-noepc-card-badge">
              <Icon name="i-lucide-file-question" />
              No certificate found
            </div>
            <h2 class="nd-noepc-card-title">This property has no EPC</h2>
            <p class="nd-noepc-card-body">
              No problem — answer 20 quick questions about the home and we'll
              build an <b>estimated HomeScore</b>, the same way an assessor
              fills gaps using the property's age.
            </p>
            <button class="nd-noepc-card-btn" type="button" @click="$emit('refine')">
              Estimate my score
              <Icon name="i-lucide-arrow-right" />
            </button>
            <div class="nd-noepc-card-note">
              <Icon name="i-lucide-clock" /> ~2 min · No documents · "Not sure" is always OK
            </div>
            <a
              class="nd-noepc-card-link"
              :href="`https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodeURIComponent(property?.postcode ?? '')}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check the EPC Register directly
              <Icon name="i-lucide-external-link" />
            </a>
          </aside>
        </section>
      </div>
    </template>

    <template v-if="hasEpcData">
    <div class="nd-report">

      <!-- ═══════════════ HERO ═══════════════ -->
      <section class="nd-hero anim-1">
        <div class="nd-hero-main">
          <div class="nd-eyebrow">HOMESCORE<sup>™</sup> REPORT</div>
          <h1 class="nd-hero-title">{{ addrLineFull }}</h1>

          <div class="nd-hero-chips">
            <span class="nd-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              {{ property?.postcode || '—' }}
            </span>
            <span v-if="property?.propertyType" class="nd-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
              {{ property.propertyType }}
            </span>
            <span class="nd-chip nd-chip--epc">
              <span class="nd-chip-grade" :style="{ background: epcColor }">{{ epcRating || '?' }}</span>
              EPC rating · {{ runningCostWord }}
            </span>
          </div>

          <div class="nd-hero-social">
            <span class="nd-social"><span class="nd-social-dot is-live" /><b>{{ searchesTodayDisplay }}</b>&nbsp;checked this HomeScore today</span>
            <span class="nd-social-sep">·</span>
            <span class="nd-social"><span class="nd-social-dot" /><b>{{ watchersDisplay }}</b>&nbsp;{{ (watchersCount || 0) === 1 ? 'is' : 'are' }} watching this property</span>
          </div>

          <button
            v-if="passportState === 'unclaimed'"
            class="nd-claim"
            type="button"
            @click="openClaimSheet"
          >
            <div class="nd-claim-text">
              <div class="nd-claim-title">This property is unclaimed</div>
              <div class="nd-claim-sub">Is it yours? Build your verified Passport in minutes.</div>
              <div class="nd-claim-link">What does it mean to claim?</div>
            </div>
            <span class="nd-claim-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </button>
          <button
            v-else
            class="nd-claim nd-claim--go"
            type="button"
            @click="openClaimSheet"
          >
            <div class="nd-claim-text">
              <div class="nd-claim-title">{{ passportState === 'published' ? 'Passport published' : 'Passport in progress' }}</div>
              <div class="nd-claim-sub">View the verified Property Passport for this home.</div>
              <div class="nd-claim-link">Open the Passport</div>
            </div>
            <span class="nd-claim-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </span>
          </button>
        </div>

        <aside class="nd-scorecard">
          <div class="nd-scorecard-top">
            <div class="nd-scorecard-mark">HOMESCORE<sup>™</sup></div>
            <span class="nd-scorecard-tag" :class="scoreTagClass">{{ scoreTagLabel }}</span>
          </div>
          <div class="nd-scorecard-body">
            <div class="nd-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#00B8B0" />
                    <stop offset="100%" stop-color="#008A84" />
                  </linearGradient>
                </defs>
                <circle class="nd-ring-bg" cx="60" cy="60" r="52" stroke-width="8" />
                <circle
                  class="nd-ring-fill"
                  cx="60"
                  cy="60"
                  r="52"
                  stroke-width="8"
                  :stroke="`url(#${gradientId})`"
                  stroke-dasharray="326.73"
                  :stroke-dashoffset="ndRingOffset"
                  stroke-linecap="round"
                  fill="none"
                />
              </svg>
              <div class="nd-ring-num">
                <span class="nd-ring-big">{{ displayScore }}</span>
                <span class="nd-ring-small">out of 100</span>
              </div>
            </div>
            <div class="nd-scorecard-info">
              <div class="nd-scorecard-band">
                {{ scoreBandTitle.split('·')[0].trim() }}
                <span class="nd-grade-flow">
                  <span class="nd-grade-pill" :style="{ background: epcColor }">{{ epcRating || '?' }}</span>
                  <span class="nd-grade-arrow">→</span>
                  <span class="nd-grade-pill" style="background:#7AB040">C</span>
                </span>
              </div>
              <div class="nd-scorecard-copy" v-html="scoreExplainer" />
            </div>
          </div>
          <div class="nd-scorecard-foot">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <span>Based on a <b>{{ epcYear || '—' }} EPC</b>. Your real score may be higher if improvements have been made.</span>
          </div>
        </aside>
      </section>

      <!-- Headless claim/passport explainer — renders no visible box; the
           styled claim card above drives its drawer via v-model:open-sheet. -->
      <PassportClaimBox
        headless
        :state="passportState"
        :progress-pct="passportProgressPct"
        :sections-done="passportSectionsDone"
        :sections-total="passportSectionsTotal"
        :property-id="property?.id ?? null"
        v-model:open-sheet="claimSheet"
        @claim-passport="$emit('claim-passport')"
        @watch="$emit('buy-passport')"
        @buy="$emit('buy-passport')"
      />

      <!-- ═══════════════ RUNNING COSTS ═══════════════ -->
      <section class="nd-block anim-2">
        <div class="nd-block-head">
          <div class="nd-eyebrow">RUNNING COSTS</div>
          <button class="nd-taplink" type="button" @click="$emit('see-running-costs')">Tap any row to explore ›</button>
        </div>
        <div class="nd-cost-grid">
          <button
            class="nd-cost"
            :class="{ active: expandedCost === 'bills' }"
            type="button"
            @click="toggleCost('bills')"
          >
            <span class="nd-cost-arrow" title="Open full running costs" @click.stop="$emit('see-running-costs')">↗</span>
            <div class="nd-cost-eyebrow">
              <span class="nd-cost-eyebrow-ico"><Icon name="i-lucide-banknote" /></span>
              EST. BILLS
            </div>
            <div class="nd-cost-num">£{{ formatNum(annualCost) }}<span>/yr</span></div>
            <div class="nd-cost-pill">↑ Save up to £{{ formatNum(potentialSaving) }}/yr</div>
            <span class="nd-cost-more">
              {{ expandedCost === 'bills' ? 'Hide breakdown' : 'Where it goes' }}
              <span class="nd-cost-more-chev" :class="{ open: expandedCost === 'bills' }">›</span>
            </span>
          </button>
          <button
            class="nd-cost"
            :class="{ active: expandedCost === 'co2' }"
            type="button"
            @click="toggleCost('co2')"
          >
            <span class="nd-cost-arrow" title="Open full running costs" @click.stop="$emit('see-running-costs')">↗</span>
            <div class="nd-cost-eyebrow">
              <span class="nd-cost-eyebrow-ico"><Icon name="i-lucide-leaf" /></span>
              CO₂ FOOTPRINT
            </div>
            <div class="nd-cost-num">{{ co2NowDisplay.toFixed(1) }}<span>t/yr</span></div>
            <div class="nd-cost-sub">UK average · 6.0t</div>
            <span class="nd-cost-more">
              {{ expandedCost === 'co2' ? 'Hide breakdown' : 'Now vs potential' }}
              <span class="nd-cost-more-chev" :class="{ open: expandedCost === 'co2' }">›</span>
            </span>
          </button>
        </div>

        <!-- BILLS breakdown -->
        <div v-if="expandedCost === 'bills'" class="nd-cost-panel">
          <div class="nd-cost-panel-head">
            <div class="nd-cost-panel-title">Annual running costs · £{{ formatNum(annualCost) }}/yr</div>
            <div class="nd-cost-panel-sub">EPC figure · heating, hot water &amp; lighting only</div>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-flame" /></span>
            <span class="nd-cost-bar-label">Heating</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill heat" :style="{ width: billsSplitDisplay.heating + '%' }" /></span>
            <span class="nd-cost-bar-amt">£{{ formatNum(annualCost * billsSplitDisplay.heating / 100) }}<i>{{ billsSplitDisplay.heating }}%</i></span>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-droplet" /></span>
            <span class="nd-cost-bar-label">Hot water</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill hw" :style="{ width: billsSplitDisplay.hotWater + '%' }" /></span>
            <span class="nd-cost-bar-amt">£{{ formatNum(annualCost * billsSplitDisplay.hotWater / 100) }}<i>{{ billsSplitDisplay.hotWater }}%</i></span>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-lightbulb" /></span>
            <span class="nd-cost-bar-label">Lighting</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill light" :style="{ width: billsSplitDisplay.lighting + '%' }" /></span>
            <span class="nd-cost-bar-amt">£{{ formatNum(annualCost * billsSplitDisplay.lighting / 100) }}<i>{{ billsSplitDisplay.lighting }}%</i></span>
          </div>
          <div class="nd-cost-total">
            <span>Total per year</span>
            <span class="nd-cost-total-num">£{{ formatNum(annualCost) }}</span>
          </div>
          <div class="nd-cost-note">Standing charges, cooking and appliances are <b>not included</b> in the EPC figure.</div>
          <button class="nd-cost-foot" type="button" @click="$emit('open-pathway')">
            <span>All 6 EPC steps cut bills by <b>£{{ formatNum(potentialSaving) }}/yr</b></span>
            <span class="nd-cost-foot-arrow">→</span>
          </button>
        </div>

        <!-- CO₂ breakdown -->
        <div v-if="expandedCost === 'co2'" class="nd-cost-panel">
          <div class="nd-cost-panel-head">
            <div class="nd-cost-panel-title">CO₂ emissions · {{ co2NowDisplay.toFixed(1) }}t/yr</div>
            <div class="nd-cost-panel-sub">UK average 6.0t · could drop to {{ co2Potential.toFixed(1) }}t after all 6 EPC steps</div>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-house" /></span>
            <span class="nd-cost-bar-label">Your home</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill heat" :style="{ width: co2NowPct + '%' }" /></span>
            <span class="nd-cost-bar-amt">{{ co2NowDisplay.toFixed(1) }}t<i>now</i></span>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-chart-column" /></span>
            <span class="nd-cost-bar-label">UK avg</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill uk" style="width:75%" /></span>
            <span class="nd-cost-bar-amt">6.0t<i>benchmark</i></span>
          </div>
          <div class="nd-cost-bar">
            <span class="nd-cost-bar-ico"><Icon name="i-lucide-target" /></span>
            <span class="nd-cost-bar-label">Potential</span>
            <span class="nd-cost-bar-track"><span class="nd-cost-bar-fill good" :style="{ width: co2PotentialPct + '%' }" /></span>
            <span class="nd-cost-bar-amt">{{ co2Potential.toFixed(1) }}t<i>after</i></span>
          </div>
          <div class="nd-cost-total">
            <span>Recoverable</span>
            <span class="nd-cost-total-num">–{{ (co2NowDisplay - co2Potential).toFixed(1) }}t CO₂/yr</span>
          </div>
          <div class="nd-cost-equiv">
            <span class="nd-cost-equiv-ico"><Icon name="i-lucide-car" /></span>
            <span>{{ (co2NowDisplay - co2Potential).toFixed(1) }} tonnes CO₂ ≈ <b>driving 12,000 miles in a petrol car</b>.</span>
          </div>
          <button class="nd-cost-foot" type="button" @click="$emit('open-pathway')">
            <span>All 6 EPC steps cut emissions by <b>{{ (co2NowDisplay - co2Potential).toFixed(1) }}t/yr</b></span>
            <span class="nd-cost-foot-arrow">→</span>
          </button>
        </div>
      </section>

      <!-- ═══════════════ STREET (navy) ═══════════════ -->
      <section class="nd-street anim-3">
        <div class="nd-street-inner">
          <div class="nd-street-top">
            <div class="nd-street-topL">
              <div class="nd-eyebrow nd-eyebrow--teal">YOUR STREET · {{ streetNameTitle }}</div>
              <h2 class="nd-street-title">Your street, ranked<br>by energy cost</h2>
              <div class="nd-street-meta">{{ property?.postcode || '—' }} · {{ streetTotal || 18 }} homes · estimated from EPC data</div>
            </div>
            <div class="nd-street-rank">
              <div class="nd-street-rank-big">#{{ streetRank ?? 8 }}</div>
              <div class="nd-street-rank-sub">of {{ streetTotal || 43 }} homes</div>
              <div class="nd-street-rank-note">£190 cheaper than the street average</div>
            </div>
          </div>

          <div class="nd-street-detail" :class="{ open: streetOpen }">
          <div class="nd-street-rankchip">
            <span class="nd-street-rankchip-num">#{{ streetRank ?? 8 }}</span>
            <div class="nd-street-rankchip-text">
              <b>{{ streetRankOrdinal }} cheapest of {{ streetTotal || 18 }} homes</b>
              <span>£190 below the postcode average of £1,651/yr</span>
            </div>
          </div>

          <div class="nd-street-legendrow">
            <div class="nd-street-legend">
              <span><i style="background:#37B27A" />Under £1,200/yr</span>
              <span><i style="background:#E8A33A" />£1,200–£1,800/yr</span>
              <span><i style="background:#E0584F" />Over £1,800/yr</span>
            </div>
            <button class="nd-street-projchip" type="button" @click="$emit('open-pathway')">↑ You could be 2nd · save £{{ formatNum(potentialSaving) }}/yr</button>
          </div>

          <div class="nd-street-scene">
            <div class="nd-street-scroll">
              <svg class="nd-street-svg" viewBox="0 0 460 200" preserveAspectRatio="xMidYMid meet" aria-label="Postcode street view">
                <defs>
                  <linearGradient id="ndSkyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2b2458" />
                    <stop offset="100%" stop-color="#1c1740" />
                  </linearGradient>
                </defs>
                <rect width="460" height="200" fill="url(#ndSkyGrad)" />
                <circle cx="40" cy="18" r="1" fill="rgba(255,255,255,0.5)" />
                <circle cx="120" cy="12" r="0.8" fill="rgba(255,255,255,0.4)" />
                <circle cx="230" cy="16" r="1.1" fill="rgba(255,255,255,0.5)" />
                <circle cx="330" cy="10" r="0.8" fill="rgba(255,255,255,0.4)" />
                <circle cx="420" cy="20" r="1" fill="rgba(255,255,255,0.5)" />

                <!-- Top row -->
                <g
                  v-for="h in topRowHouses"
                  :key="`t-${h.num}`"
                  class="nd-house"
                  :class="{ you: h.isYou }"
                  @click="pickHouse(h)"
                >
                  <template v-if="h.isYou">
                    <circle :cx="h.cx" cy="62" r="24" fill="#00A19A" opacity="0.16" />
                    <circle :cx="h.cx" cy="34" r="4" fill="#2ee6d6" />
                    <circle :cx="h.cx" cy="34" r="1.6" fill="#0c2b2a" />
                    <path :d="`M${h.cx} 38 L${h.cx - 2.6} 42 L${h.cx + 2.6} 42 Z`" fill="#2ee6d6" />
                    <polygon :points="`${h.cx - 13},58 ${h.cx},47 ${h.cx + 13},58`" fill="#00c2b8" />
                    <rect :x="h.cx - 10" y="58" width="20" height="20" fill="#0d3b39" stroke="#2ee6d6" stroke-width="1.3" />
                    <rect :x="h.cx - 6" y="62" width="4" height="4" fill="#6df0e6" />
                    <rect :x="h.cx + 2" y="62" width="4" height="4" fill="#6df0e6" />
                    <rect :x="h.cx - 2.5" y="70" width="5" height="8" fill="#2ee6d6" />
                    <text :x="h.cx" y="90" font-size="7" font-weight="800" fill="#2ee6d6" text-anchor="middle">{{ h.num }}</text>
                  </template>
                  <template v-else>
                    <polygon :points="`${h.cx - 11},60 ${h.cx},50 ${h.cx + 11},60`" :fill="h.roof" />
                    <rect :x="h.cx - 8" y="60" width="16" height="16" fill="#2c2657" stroke="rgba(255,255,255,0.12)" stroke-width="0.6" />
                    <rect :x="h.cx - 5" y="63" width="3" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect :x="h.cx + 2" y="63" width="3" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect :x="h.cx - 1.5" y="69" width="3" height="7" fill="rgba(0,0,0,0.35)" />
                    <text :x="h.cx" y="88" font-size="6.5" font-weight="700" fill="rgba(255,255,255,0.7)" text-anchor="middle">{{ h.num }}</text>
                  </template>
                </g>

                <!-- Road -->
                <rect x="0" y="98" width="460" height="24" fill="#15102e" />
                <line x1="0" y1="110" x2="460" y2="110" stroke="#E8A33A" stroke-width="1.4" stroke-dasharray="10,8" opacity="0.7" />
                <text x="230" y="113" font-size="6.5" font-weight="800" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2.5">{{ streetName }}</text>

                <!-- Walker — strolls along the road to the selected house -->
                <g class="nd-walker" :style="{ transform: `translateX(${selectedHouse.cx}px)` }">
                  <circle cx="0" cy="102.5" r="3.1" fill="#231d45" />
                  <rect x="-2" y="105.5" width="4" height="7" rx="1" fill="#00c2b8" />
                  <rect class="nd-walker-arm-l" x="-4.1" y="106.5" width="1.8" height="5.2" rx="0.9" fill="#231d45" />
                  <rect class="nd-walker-arm-r" x="2.3" y="106.5" width="1.8" height="5.2" rx="0.9" fill="#231d45" />
                  <rect class="nd-walker-leg-l" x="-1.7" y="112" width="1.7" height="6" rx="0.8" fill="#231d45" />
                  <rect class="nd-walker-leg-r" x="0.4" y="112" width="1.7" height="6" rx="0.8" fill="#231d45" />
                </g>

                <!-- Bottom row -->
                <g
                  v-for="h in bottomRowHouses"
                  :key="`b-${h.num}`"
                  class="nd-house"
                  :class="{ you: h.isYou }"
                  @click="pickHouse(h)"
                >
                  <template v-if="h.isYou">
                    <circle :cx="h.cx" cy="150" r="24" fill="#00A19A" opacity="0.16" />
                    <circle :cx="h.cx" cy="122" r="4" fill="#2ee6d6" />
                    <circle :cx="h.cx" cy="122" r="1.6" fill="#0c2b2a" />
                    <path :d="`M${h.cx} 126 L${h.cx - 2.6} 130 L${h.cx + 2.6} 130 Z`" fill="#2ee6d6" />
                    <polygon :points="`${h.cx - 13},142 ${h.cx},131 ${h.cx + 13},142`" fill="#00c2b8" />
                    <rect :x="h.cx - 10" y="142" width="20" height="20" fill="#0d3b39" stroke="#2ee6d6" stroke-width="1.3" />
                    <rect :x="h.cx - 6" y="146" width="4" height="4" fill="#6df0e6" />
                    <rect :x="h.cx + 2" y="146" width="4" height="4" fill="#6df0e6" />
                    <rect :x="h.cx - 2.5" y="154" width="5" height="8" fill="#2ee6d6" />
                    <text :x="h.cx" y="176" font-size="7" font-weight="800" fill="#2ee6d6" text-anchor="middle">{{ h.num }}</text>
                  </template>
                  <template v-else>
                    <polygon :points="`${h.cx - 11},142 ${h.cx},132 ${h.cx + 11},142`" :fill="h.roof" />
                    <rect :x="h.cx - 8" y="142" width="16" height="16" fill="#2c2657" stroke="rgba(255,255,255,0.12)" stroke-width="0.6" />
                    <rect :x="h.cx - 5" y="145" width="3" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect :x="h.cx + 2" y="145" width="3" height="3" fill="rgba(255,255,255,0.35)" />
                    <rect :x="h.cx - 1.5" y="151" width="3" height="7" fill="rgba(0,0,0,0.35)" />
                    <text :x="h.cx" y="170" font-size="6.5" font-weight="700" fill="rgba(255,255,255,0.7)" text-anchor="middle">{{ h.num }}</text>
                  </template>
                </g>
              </svg>
            </div>
            <div class="nd-street-hints">
              <span>‹‹ swipe to see the rest of your postcode</span>
              <span>Tap any house to see its EPC and cost ›</span>
            </div>
          </div>

          <div class="nd-street-bottom">
            <div class="nd-street-you" :class="{ isyou: selectedHouse.isYou }">
              <div class="nd-street-you-row">
                <span class="nd-street-you-label">No. {{ selectedHouse.num }}{{ selectedHouse.isYou ? ' — You' : '' }}</span>
                <span class="nd-street-you-grade" :style="{ background: selectedHouse.color }">{{ selectedHouse.grade }} · {{ selectedHouse.score }}</span>
              </div>
              <div class="nd-street-you-cost">{{ selectedHouse.cost }}<span>/yr</span></div>
            </div>
            <button class="nd-street-proj" type="button" @click="$emit('open-pathway')">
              <div class="nd-street-proj-left">
                <div class="nd-street-proj-eyebrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></svg>
                  IF YOU COMPLETE THE EPC PATHWAY
                </div>
                <div class="nd-street-proj-num">£{{ formatNum(annualCost - potentialSaving) }}<span>/yr</span></div>
                <div class="nd-street-proj-sub"><b>2nd of {{ streetTotal || 18 }}</b> on your street · up from {{ streetRankOrdinal.toLowerCase() }}</div>
              </div>
              <div class="nd-street-proj-save">
                <div class="nd-street-proj-save-num">−£{{ formatNum(potentialSaving) }}</div>
                <div class="nd-street-proj-save-sub">/yr saved</div>
              </div>
            </button>
          </div>

          </div>

          <div class="nd-street-foot">
            <span class="nd-street-foot-note"><Icon name="i-lucide-zap" class="nd-street-foot-ico" /> Higher EPCs sell faster and <b>command ~£15k more</b> on average for a 3-bed in {{ outwardPostcode }} (Land Reg data).</span>
            <button
              class="nd-street-foot-btn"
              type="button"
              :aria-expanded="streetOpen"
              @click="streetOpen = !streetOpen"
            >{{ streetOpen ? 'Hide street map ✕' : 'Explore your street map →' }}</button>
          </div>
        </div>
      </section>

      <!-- ═══════════════ EPC STATS ═══════════════ -->
      <section class="nd-block anim-4">
        <div class="nd-stats-grid">
          <div class="nd-stats-intro">
            <div class="nd-eyebrow">EPC STATS</div>
            <h2 class="nd-stats-title">How your<br>{{ displayScore }} splits</h2>
            <button class="nd-stats-link" type="button" @click="$emit('open-pathway')">Points breakdown →</button>
          </div>
          <div class="nd-stats-card">
            <template v-for="s in stats" :key="s.id">
              <div
                class="nd-stat-row"
                :class="{ open: expandedStat === s.id }"
                @click="toggleStat(s.id)"
              >
                <span class="nd-stat-icon"><Icon :name="s.icon" /></span>
                <span class="nd-stat-label">{{ s.label }}</span>
                <span class="nd-stat-track"><span class="nd-stat-fill" :class="s.tone" :style="{ width: s.pct + '%' }" /></span>
                <span class="nd-stat-val">{{ s.value }}<i>/{{ s.max }}</i></span>
                <span class="nd-stat-chev">›</span>
              </div>

              <!-- Inline expandable detail — mirrors the mobile app: tapping a
                   row opens EPC steps / potential saving / cost lines in place,
                   and only the footer redirects to the full pathway. -->
              <div v-if="expandedStat === s.id" class="nd-stat-expand">
                <div class="nd-stat-expand-meta">
                  <div class="nd-stat-expand-tile">
                    <div class="nd-stat-expand-eyebrow">EPC steps</div>
                    <div class="nd-stat-expand-num" :class="s.steps > 0 ? 'cost' : 'save'">{{ s.steps > 0 ? s.steps : '—' }}</div>
                    <div class="nd-stat-expand-sub">{{ s.steps > 0 ? 'recommended' : 'none recommended' }}</div>
                  </div>
                  <div class="nd-stat-expand-tile">
                    <div class="nd-stat-expand-eyebrow">Could save</div>
                    <div class="nd-stat-expand-num save">
                      <template v-if="s.saving > 0">£{{ s.saving }}<i>/yr</i></template>
                      <template v-else>—</template>
                    </div>
                    <div class="nd-stat-expand-sub">{{ s.saving > 0 ? s.savingSub : 'nothing to gain' }}</div>
                  </div>
                  <div class="nd-stat-expand-tile">
                    <div class="nd-stat-expand-eyebrow">{{ s.thirdTileLabel }}</div>
                    <div class="nd-stat-expand-num">{{ s.thirdTileNum || '—' }}</div>
                    <div class="nd-stat-expand-sub">{{ s.thirdTileSub }}</div>
                  </div>
                </div>

                <div v-for="(line, i) in s.lines" :key="i" class="nd-stat-line">
                  <span class="nd-stat-line-bullet"><Icon :name="line.icon" /></span>
                  <div class="nd-stat-line-info">
                    <div class="nd-stat-line-title">{{ line.title }}</div>
                    <div class="nd-stat-line-sub" v-html="line.sub" />
                  </div>
                  <div class="nd-stat-line-amt">
                    <div
                      class="nd-stat-line-amt-big"
                      :style="line.amtMuted ? { color: 'var(--text-faint)' } : line.amtGood ? { color: 'var(--accent-dark)' } : null"
                    >{{ line.amt }}</div>
                    <div v-if="line.amtSub" class="nd-stat-line-amt-sub">{{ line.amtSub }}</div>
                  </div>
                </div>

                <button class="nd-stat-expand-foot" type="button" @click.stop="$emit('open-pathway')">
                  <span class="nd-stat-expand-foot-text" v-html="s.footText" />
                  <span class="nd-stat-expand-foot-arrow">›</span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- ═══════════════ FULL EPC BREAKDOWN ═══════════════ -->
      <section class="nd-block anim-4">
        <div class="nd-epc">
          <div class="nd-epc-head">
            <span class="nd-epc-head-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 4 14 11 14 11 22 20 10 13 10" /></svg>
            </span>
            <div class="nd-epc-head-text">
              <div class="nd-epc-head-title">Full EPC breakdown</div>
              <div class="nd-epc-head-sub">Every line of energy detail behind your score · {{ epcItems.length }} items</div>
            </div>
            <div class="nd-epc-flow">
              <span class="nd-epc-flow-grade" :style="{ background: epcColor }">{{ epcRating || '?' }}</span>
              <span class="nd-epc-flow-lbl">CURRENT<b>{{ displayScore }}</b></span>
              <span class="nd-epc-flow-arrow">→</span>
              <span class="nd-epc-flow-grade" style="background:#7AB040">C</span>
              <span class="nd-epc-flow-lbl">POTENTIAL<b>75</b></span>
              <span class="nd-epc-flow-save">£{{ formatNum(potentialSaving) }}/yr<i>potential saving</i></span>
            </div>
          </div>
          <div class="nd-epc-grid">
            <template v-for="item in epcItems" :key="item.id">
              <button class="nd-epc-item" :class="{ open: expandedEpcItem === item.id }" type="button" @click="toggleEpcItem(item.id)">
                <span class="nd-epc-item-icon"><Icon :name="item.icon" /></span>
                <span class="nd-epc-item-body">
                  <span class="nd-epc-item-title">{{ item.title }}</span>
                  <span class="nd-epc-item-sub" v-html="item.sub" />
                </span>
                <span class="nd-epc-item-rating" :class="item.ratingClass">{{ item.rating }}</span>
                <span class="nd-epc-item-chev" :class="{ open: expandedEpcItem === item.id }">›</span>
              </button>
              <div v-if="expandedEpcItem === item.id" class="nd-epc-expand">
                <div class="nd-epc-flag" :class="{ ok: item.flagOk }">
                  <div class="nd-epc-flag-label">{{ item.flagOk ? '✓ Already strong' : '⚠ What\'s flagged' }}</div>
                  <div class="nd-epc-flag-text" v-html="item.flagText" />
                </div>
                <div v-if="item.fix" class="nd-epc-fix">
                  <div class="nd-epc-fix-label"><Icon name="i-lucide-sparkles" class="nd-epc-fix-ico" />{{ item.fix.label }}</div>
                  <div class="nd-epc-fix-text" v-html="item.fix.text" />
                  <a class="nd-epc-fix-action" @click.stop="$emit('open-pathway')">See suppliers →</a>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- ═══════════════ CONNECTION FORK ═══════════════ -->
      <section class="nd-block nd-fork anim-4">
        <template v-if="isPropertyOwner">
          <h2 class="nd-fork-title">Pick up where you left off</h2>
          <div class="nd-fork-grid">
            <button class="nd-fork-card primary" type="button" @click="$emit('open-dashboard')">
              <span class="nd-fork-icon"><Icon name="i-lucide-layout-dashboard" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">Go to your dashboard</span>
                <span class="nd-fork-p">Your home base — Passport, docs &amp; everything in one place.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
            <button class="nd-fork-card" type="button" @click="$emit('open-pathway')">
              <span class="nd-fork-icon"><Icon name="i-lucide-target" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">Your pathway</span>
                <span class="nd-fork-p">Keep climbing your HomeScore.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
            <button class="nd-fork-card" type="button" @click="$emit('open-boost')">
              <span class="nd-fork-icon"><Icon name="i-lucide-zap" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">Boost your score</span>
                <span class="nd-fork-p">Add docs to grow your Move Ready &amp; Passport.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
            <button class="nd-fork-card" type="button" @click="$emit('refine')">
              <span class="nd-fork-icon"><Icon name="i-lucide-circle-check-big" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">Get Real HomeScore</span>
                <span class="nd-fork-p">Answer the owner quiz to lock in your verified score.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
          </div>
        </template>

        <template v-else-if="isLoggedIn && passportState !== 'unclaimed'">
          <h2 class="nd-fork-title">What you can do here</h2>
          <div class="nd-fork-grid nd-fork-grid--one">
            <button class="nd-fork-card primary" type="button" @click="$emit('interested')">
              <span class="nd-fork-icon"><Icon name="i-lucide-search" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">I'm interested in this property</span>
                <span class="nd-fork-p">Full running costs, risks and questions to ask before you offer.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
          </div>
        </template>

        <template v-else>
          <h2 class="nd-fork-title">What's your connection to this property?</h2>
          <div class="nd-fork-grid nd-fork-grid--two">
            <button class="nd-fork-card primary" type="button" @click="$emit('claim')">
              <span class="nd-fork-icon"><Icon name="i-lucide-house" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">I own this property</span>
                <span class="nd-fork-p">Take the quiz to level up your stats and get your real score.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
            <button class="nd-fork-card" type="button" @click="$emit('interested')">
              <span class="nd-fork-icon"><Icon name="i-lucide-search" /></span>
              <span class="nd-fork-body">
                <span class="nd-fork-h">I'm interested in this property</span>
                <span class="nd-fork-p">Full running costs, risks and questions to ask before you offer.</span>
              </span>
              <span class="nd-fork-chev">→</span>
            </button>
          </div>
        </template>
      </section>

    </div>
    </template><!-- /hasEpcData -->

    <div style="height: 32px" />

    <!-- ── Claim-it-free explainer modal (teleported to body so it
         escapes any parent overflow/transform stacking context) ─── -->
    <Teleport to="body">
    <Transition name="claim-modal">
      <div v-if="claimModalOpen" class="claim-overlay" @click.self="claimModalOpen = false">
        <div class="claim-sheet" @click.stop>
          <div class="claim-grip" />
          <div class="claim-icon"><Icon name="i-lucide-id-card" /></div>
          <div class="claim-title">Claim this property</div>
          <div class="claim-sub">
            You'll verify you own <b>{{ addrLineFull }}</b> and unlock your
            HomeScore, Move Ready % and Property Passport.
          </div>
          <div class="claim-steps">
            <div class="claim-step">
              <div class="claim-step-num">1</div>
              <div class="claim-step-body">
                <div class="claim-step-title">Verify your ID</div>
                <div class="claim-step-sub">Onfido · photo + selfie · ~60 seconds</div>
              </div>
            </div>
            <div class="claim-step">
              <div class="claim-step-num">2</div>
              <div class="claim-step-body">
                <div class="claim-step-title">Confirm ownership</div>
                <div class="claim-step-sub">HM Land Registry cross-check · automatic</div>
              </div>
            </div>
            <div class="claim-step">
              <div class="claim-step-num">3</div>
              <div class="claim-step-body">
                <div class="claim-step-title">Take the owner quiz</div>
                <div class="claim-step-sub">6–8 EPC questions · earns your real HomeScore</div>
              </div>
            </div>
          </div>
          <div class="claim-cta-row">
            <button type="button" class="claim-btn ghost" @click="claimModalOpen = false">
              Not now
            </button>
            <button
              type="button"
              class="claim-btn primary"
              @click="claimModalOpen = false; $emit('claim')"
            >
              Start verification →
            </button>
          </div>
          <div class="claim-privacy">
            <span><Icon name="i-lucide-lock" /></span>
            <span>Free · no card needed · we'll never sell your data.</span>
          </div>
        </div>
      </div>
    </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PassportClaimBox from '~/components/property/PassportClaimBox.vue'

const props = withDefaults(
  defineProps<{
    property: any | null
    score: number
    epcRating: string | null
    epcYear?: number | null
    /** Estimated annual running cost in £ */
    annualCost: number
    /** Potential annual saving if all EPC steps done */
    potentialSaving?: number
    /** Current CO₂ in tonnes/yr (real EPC data; null if unavailable) */
    co2Now?: number | null
    /** Potential CO₂ if all improvements done (real EPC data; null if unavailable) */
    co2Potential?: number | null
    /** Real bills split from EPC heating/hotWater/lighting costs */
    billsSplit?: { heating: number; hotWater: number; lighting: number } | null
    /** Street rank (1 = cheapest, N = most expensive) */
    streetRank?: number | null
    streetTotal?: number | null
    /** Real searches today from PropertySearchLog */
    searchesToday?: number
    /** Number of users actively watching this property (wishlist + saved).
     *  Drives the "people watching" social-proof row under the address. */
    watchersCount?: number
    /** Passport status of the property — drives the claim box so we don't
     *  pitch "claim" on a home that's already claimed. */
    passportState?: 'unclaimed' | 'inProgress' | 'published'
    /** Passport build progress (drives the in-progress ring + drawer). */
    passportProgressPct?: number
    passportSectionsDone?: number
    passportSectionsTotal?: number
    /** Set by parent to auto-pop the claim drawer (e.g. when the user
     *  has just returned from sign-in with ?claim=1) */
    autoOpenClaim?: boolean
    /** Auth + ownership flags — drive the fork-section branching at the
     *  bottom of the score view (guest / owner / non-owner). */
    isLoggedIn?: boolean
    isPropertyOwner?: boolean
  }>(),
  {
    potentialSaving: 445,
    co2Now: null,
    co2Potential: null,
    billsSplit: null,
    streetRank: null,
    streetTotal: null,
    searchesToday: 0,
    watchersCount: 0,
    passportState: 'unclaimed',
    passportProgressPct: 0,
    passportSectionsDone: 0,
    passportSectionsTotal: 0,
    autoOpenClaim: false,
    isLoggedIn: false,
    isPropertyOwner: false,
  },
)

// Whether this property has enough EPC data to render the live score.
// We require at least the rating + an annual cost figure (or the EPC cert
// object) — if neither is present, the gov register has no certificate
// and we surface a proper "EPC not available" empty state rather than
// fabricating scores from dummy fallbacks.
const hasEpcData = computed(() => {
  // Trust ONLY positive evidence of a real EPC certificate. Don't trust
  // `annualCost` — `resolvedAnnualCost` in the parent falls back to a
  // rating-based map (or £1,592 if even that's missing), so it's always
  // > 0 and would mask a "no EPC on file" property as if it had one.
  const p = props.property as any
  if (!p) return false
  if (props.epcRating) return true
  // The lmk-key is positive proof the cert was actually fetched, not a
  // heuristic fallback. Check both the top-level row and the nested
  // cert sub-object (backend exposes both shapes).
  if (p.epcLmkKey) return true
  if (p.epcCert?.lmkKey) return true
  if (p.epcCert?.epcRating) return true
  return false
})

// Real or estimated splits/values, with safe fallbacks.
const billsSplitDisplay = computed(() => {
  if (props.billsSplit) return props.billsSplit
  return { heating: 72, hotWater: 18, lighting: 10 }
})
const streetRankLabel = computed(() => {
  const r = props.streetRank
  const t = props.streetTotal
  if (r == null || t == null || t <= 0) return '—'
  const ratio = r / t
  if (ratio <= 0.33) return 'top of street'
  if (ratio <= 0.5) return 'above avg'
  if (ratio <= 0.66) return 'around avg'
  return 'below avg'
})

const co2NowDisplay = computed(() => {
  const v = props.co2Now
  if (v != null && Number.isFinite(v)) return v
  // Estimate from EPC rating when no real value is present.
  const map: Record<string, number> = { A: 1.8, B: 2.6, C: 3.8, D: 5.2, E: 6.4, F: 8.1, G: 9.6 }
  const r = (props.epcRating || '').toUpperCase()
  return map[r] ?? 6.4
})

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'claim'): void
  (e: 'refine'): void
  (e: 'interested'): void
  (e: 'open-panel', panel: 'bills' | 'co2' | 'street'): void
  (e: 'open-pathway'): void
  (e: 'see-running-costs'): void
  (e: 'see-street'): void
  /** Property already claimed — parent navigates to the passport/property. */
  (e: 'view-passport'): void
  /** Open the £99 unlock drawer on the property page (in-progress/published). */
  (e: 'buy-passport'): void
  /** "This property is unclaimed" arrow / cxUnclaimed drawer CTA —
   *  login (if needed) → property page with the Choose Passport drawer. */
  (e: 'claim-passport'): void
  /** Fires when the user dismisses the claim modal so the parent can
   *  clear the ?claim=1 auto-open intent and not re-trigger on remount. */
  (e: 'claim-modal-closed'): void
  /** Owner fork: opens the user's passport / dashboard. */
  (e: 'open-dashboard'): void
  /** Owner fork: opens the boost-your-score flow. */
  (e: 'open-boost'): void
}>()

// Unique id for the SVG gradient so multiple instances on a page don't
// clash on the same <defs> id.
const gradientId = `hs-v6-grad-${Math.random().toString(36).slice(2, 8)}`

// ── Passport explainer drawer ────────────────────────────────────
// The redesigned claim card is our own styled trigger; the actual
// "What does it mean to claim?" popup lives in PassportClaimBox, which
// we mount in `headless` mode and drive via this v-model. Clicking the
// card opens the sheet that matches the property's passport state.
const claimSheet = ref<'unclaimed' | 'progress' | 'published' | null>(null)
function openClaimSheet() {
  claimSheet.value =
    props.passportState === 'published'
      ? 'published'
      : props.passportState === 'inProgress'
        ? 'progress'
        : 'unclaimed'
}

// ── Running-costs breakdown (expandable under the Est. bills / CO₂ cards) ──
const expandedCost = ref<'bills' | 'co2' | null>(null)
function toggleCost(p: 'bills' | 'co2') {
  expandedCost.value = expandedCost.value === p ? null : p
}

// ── Typewriter for the amber address line ────────────────────────
// The meta sub-line (postcode · type · bedrooms) reveals instantly,
// the headline address types out one character at a time for a "this
// is YOUR home" beat. Mirrors the prototype's #addrLine / #addrLineCaret.
const addrLineFull = computed(() => props.property?.addressLine1 || 'Your property')
const addrMetaFull = computed(() => {
  const p = props.property
  if (!p) return ''
  const parts: string[] = []
  if (p.postcode) parts.push(p.postcode)
  if (p.propertyType) parts.push(p.propertyType)
  // Show floor area (from EPC) instead of bedroom count — more meaningful
  // for energy / running-cost context. Falls back to bedrooms only when
  // we have no area on file.
  const area = p.floorAreaSqm ?? p.epcCert?.floorAreaSqm
  if (area && Number.isFinite(Number(area))) {
    parts.push(`${Math.round(Number(area))}m²`)
  } else if (p.bedrooms) {
    parts.push(`${p.bedrooms} bed`)
  }
  return parts.join(' · ')
})

const addrLineTyped = ref('')
const addrMetaTyped = computed(() => addrMetaFull.value)
let twTimer: ReturnType<typeof setInterval> | null = null

function startTypewriter(text: string) {
  if (twTimer) {
    clearInterval(twTimer)
    twTimer = null
  }
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !text) {
    addrLineTyped.value = text
    return
  }
  addrLineTyped.value = ''
  let i = 0
  twTimer = setInterval(() => {
    i += 1
    addrLineTyped.value = text.slice(0, i)
    if (i >= text.length && twTimer) {
      clearInterval(twTimer)
      twTimer = null
    }
  }, 32)
}
onMounted(() => startTypewriter(addrLineFull.value))
// Property data may arrive AFTER mount (async fetch from parent). When
// `addrLineFull` changes from the fallback "Your property" to the real
// address, restart the typewriter so the right text shows.
watch(addrLineFull, (next, prev) => {
  if (next && next !== prev) startTypewriter(next)
})
onBeforeUnmount(() => {
  if (twTimer) clearInterval(twTimer)
})

// ── Animated count-up score (gauge + headline number both tick up) ──
const animatedScore = ref(0)
let scoreRaf = 0
function animateScore(target: number) {
  cancelAnimationFrame(scoreRaf)
  const from = animatedScore.value
  const start = performance.now()
  const dur = 1100
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / dur)
    const eased = 1 - Math.pow(1 - t, 3)
    animatedScore.value = from + (target - from) * eased
    if (t < 1) scoreRaf = requestAnimationFrame(tick)
  }
  scoreRaf = requestAnimationFrame(tick)
}
onMounted(() => animateScore(Number(props.score) || 0))
onBeforeUnmount(() => cancelAnimationFrame(scoreRaf))
const displayScore = computed(() => Math.round(animatedScore.value))

// Gauge stroke-dashoffset: full circle is 2π·50 = 314.16. We start at
// 314.16 (empty), tick down to 314.16 · (1 - score/100).
const gaugeOffset = computed(() => 314.16 - (animatedScore.value / 100) * 314.16)

// ── Score band copy (drives the big headline next to the gauge) ──
const scoreBandTitle = computed(() => {
  const s = props.score
  if (s >= 92) return 'Top of the class · A'
  if (s >= 81) return 'Excellent · B'
  if (s >= 69) return 'Above average · C'
  if (s >= 55) return 'Average · D'
  if (s >= 39) return 'Room to climb · E → C'
  if (s >= 21) return 'Plenty to gain · F → C'
  return 'Critical · G → D'
})
const scoreExplainer = computed(() => {
  const saving = formatNum(props.potentialSaving ?? 0)
  return `The EPC lists <b>6 steps</b> to lift your score and cut bills by <b>~£${saving}/yr</b>. See the path below.`
})

// ── New-design score card helpers ────────────────────────────────
// Ring circumference for r=52 → 2π·52 = 326.73. Offset ticks down as
// the animated score rises (mirrors the gauge maths above).
const ndRingOffset = computed(() => 326.73 - (animatedScore.value / 100) * 326.73)
// Short "ABOVE / AVERAGE / BELOW AVERAGE" tag shown in the score-card
// header — a coarser band than scoreBandTitle so it reads at a glance.
const scoreTagLabel = computed(() => {
  const s = props.score
  if (s >= 69) return 'Above average'
  if (s >= 55) return 'Average'
  return 'Below average'
})
const scoreTagClass = computed(() => {
  const s = props.score
  if (s >= 69) return 'good'
  if (s >= 55) return 'mid'
  return 'low'
})
// Human "Lower / Average / Higher running costs" phrase for the EPC chip.
const runningCostWord = computed(() => {
  const r = (props.epcRating || '').toUpperCase()
  if (['A', 'B', 'C'].includes(r)) return 'Lower running costs'
  if (['D', 'E'].includes(r)) return 'Average running costs'
  if (r) return 'Higher running costs'
  return 'Running costs'
})

// ── EPC letter pill colour ───────────────────────────────────────
const epcColor = computed(() => {
  const map: Record<string, string> = {
    A: '#008060',
    B: '#2EAB55',
    C: '#7AB040',
    D: '#E6A23C',
    E: '#D86F4A',
    F: '#C73E36',
    G: '#7A2A20',
  }
  return map[(props.epcRating || '').toUpperCase()] || '#9c98ad'
})

// ── Quick stats strip — popout panel toggle ──────────────────────
const activePanel = ref<'bills' | 'co2' | 'street' | null>(null)
function togglePanel(p: 'bills' | 'co2' | 'street') {
  activePanel.value = activePanel.value === p ? null : p
}

// ── CO₂ panel maths ──────────────────────────────────────────────
// Potential = ~53% of current (matches prototype's 6.4 → 3.4 example).
// Use real co2Potential from EPC when available; otherwise estimate.
const co2Potential = computed(() => {
  const v = props.co2Potential
  if (v != null && Number.isFinite(v)) return v
  return Math.max(1.4, co2NowDisplay.value * 0.53)
})
// Bars are sized relative to a 10t maximum so they're comparable.
const co2NowPct = computed(() => Math.min(100, (co2NowDisplay.value / 10) * 125))
const co2PotentialPct = computed(() => Math.min(100, (co2Potential.value / 10) * 125))

// ── Street panel ────────────────────────────────────────────────
// House data lifted from the prototype's hand-drawn 18-house SVG. Each
// row is keyed off the same x-anchor positions the prototype uses so
// the walker animation lands cleanly on the clicked house. The two
// `cx` values per row mirror the prototype's x increments (50 px gap).
interface StreetHouse {
  num: string
  grade: string
  score: number
  cost: string
  tier: 'good' | 'warn' | 'high'
  color: string
  roof: string
  door: string
  window: string
  dot: string
  cx: number
  walkerX: number
  walkerY: number
  isYou: boolean
}

// Extract the leading house number from the property's first address line
// so the "YOU" marker on the street SVG lands on the user's actual house
// rather than the prototype's hardcoded "15".
const youHouseNum = computed<number>(() => {
  const line = (props.property as any)?.addressLine1 || ''
  const m = String(line).match(/(\d+)/)
  const n = m ? parseInt(m[1], 10) : 15
  return Number.isFinite(n) && n > 0 ? n : 15
})

// Build the 18 neighbouring houses centred on the user's real number.
// Houses on UK streets alternate odd/even between the two sides of the
// road, so the top row is the odd side and the bottom row is the even.
function buildStreetHouses(): { top: StreetHouse[]; bottom: StreetHouse[] } {
  const me = youHouseNum.value
  // Mock palette for the 17 neighbours — until backend exposes per-house
  // EPC data, we cycle through a plausible spread of grades/costs.
  const palette: Array<[string, number, string, 'good' | 'warn' | 'high']> = [
    ['A', 92, '£945',   'good'],
    ['B', 84, '£1,108', 'good'],
    ['C', 76, '£1,193', 'good'],
    ['C', 72, '£1,265', 'warn'],
    ['D', 64, '£1,310', 'warn'],
    ['D', 60, '£1,355', 'warn'],
    ['D', 56, '£1,418', 'warn'],
    ['E', 45, '£1,580', 'warn'],
    ['E', 42, '£1,635', 'warn'],
    ['F', 38, '£1,720', 'warn'],
    ['F', 35, '£1,820', 'high'],
    ['F', 32, '£1,900', 'high'],
    ['F', 30, '£1,950', 'high'],
    ['F', 25, '£2,050', 'high'],
    ['G', 20, '£2,140', 'high'],
    ['G', 18, '£2,340', 'high'],
    ['G', 15, '£2,520', 'high'],
  ]
  const isOdd = me % 2 === 1
  // Generate 9 numbers on each side, centred on the user's number.
  const myNums: number[] = []
  const otherNums: number[] = []
  const sideStart = me - 8
  for (let i = 0; i < 9; i++) {
    myNums.push(Math.max(1, sideStart + i * 2))
  }
  // Opposite side: neighbour numbers that interleave between the user's side.
  for (let i = 0; i < 9; i++) {
    otherNums.push(Math.max(1, sideStart + 1 + i * 2))
  }
  const topNums = isOdd ? myNums : otherNums
  const bottomNums = isOdd ? otherNums : myNums

  const buildRow = (nums: number[], y: number): StreetHouse[] =>
    nums.map((n, idx) => {
      const x = 30 + idx * 50
      if (n === me) {
        return mkHouse(
          String(n),
          props.epcRating || 'E',
          Math.round(props.score),
          `£${formatNum(props.annualCost)}`,
          'warn',
          x,
          y,
          true,
        )
      }
      // Deterministic palette pick so each address gets a stable grade.
      const [grade, score, cost, tier] = palette[(n * 7) % palette.length]
      return mkHouse(String(n), grade, score, cost, tier, x, y)
    })

  return {
    top: buildRow(topNums, 88),
    bottom: buildRow(bottomNums, 107),
  }
}

const topRowHouses = computed<StreetHouse[]>(() => buildStreetHouses().top)
const bottomRowHouses = computed<StreetHouse[]>(() => buildStreetHouses().bottom)

function mkHouse(
  num: string,
  grade: string,
  score: number,
  cost: string,
  tier: 'good' | 'warn' | 'high',
  cx: number,
  walkerY: number,
  isYou = false,
): StreetHouse {
  // Colour palette per grade — matches the prototype's hand-coded values
  // exactly so the SVG looks identical to the design.
  const palette: Record<
    string,
    { color: string; roof: string; door: string; window: string; dot: string }
  > = {
    A: { color: '#00A19A', roof: '#2EAB55', door: '#2EAB55', window: '#A8E6C4', dot: '#2EAB55' },
    B: { color: '#2EAB55', roof: '#2EAB55', door: '#2EAB55', window: '#A8E6C4', dot: '#2EAB55' },
    C: { color: '#7AB040', roof: '#7AB040', door: '#2EAB55', window: '#C7E8E4', dot: '#2EAB55' },
    D: { color: '#E6A23C', roof: '#E6A23C', door: '#A0683E', window: '#C7E8E4', dot: '#E6A23C' },
    E: { color: '#D86F4A', roof: '#D86F4A', door: '#7C8B9C', window: '#A4B4C2', dot: '#E6A23C' },
    F: { color: '#C73E36', roof: '#C73E36', door: '#7C8B9C', window: '#A4B4C2', dot: '#E74C5E' },
    G: { color: '#C73E36', roof: '#C73E36', door: '#7C8B9C', window: '#A4B4C2', dot: '#E74C5E' },
  }
  const p = palette[grade] ?? palette.E
  return {
    num,
    grade,
    score,
    cost,
    tier,
    color: p.color,
    roof: p.roof,
    door: p.door,
    window: p.window,
    dot: p.dot,
    cx,
    walkerX: cx,
    walkerY,
    isYou,
  }
}

// Selected house — defaults to YOU (15). Tooltip + walker overlay both
// drive off this state. Clicking any house re-points everything.
const selectedHouse = ref<StreetHouse>(
  mkHouse(
    '15',
    props.epcRating || 'E',
    Math.round(props.score),
    `£${formatNum(props.annualCost)}`,
    'warn',
    230,
    88,
    true,
  ),
)
const walkerX = computed(() => selectedHouse.value.walkerX)
const walkerY = computed(() => selectedHouse.value.walkerY)

function pickHouse(h: StreetHouse) {
  selectedHouse.value = h
}

// "Explore your street map" toggles the detailed inline map open/closed —
// mirrors the deployed mobile app, where the navy summary card expands the
// ranked house grid in place (screen 22) rather than navigating away.
const streetOpen = ref(false)

// Default the selected-house readout to the user's real home (not the
// prototype's hard-coded No.15) once the neighbour rows are built.
onMounted(() => {
  const you = [...topRowHouses.value, ...bottomRowHouses.value].find(
    (h) => h.isYou,
  )
  if (you) selectedHouse.value = you
})

// Street name displayed across the road in the SVG — pulled from the
// property's address line. Falls back to the prototype's example.
const streetName = computed(() => {
  const a = props.property?.addressLine1 || ''
  const cleaned = a.replace(/^\d+[a-z]?[,\s]+/i, '').trim()
  return (cleaned || 'WOODFIELD ROAD').toUpperCase()
})

// Title-cased version used in the eyebrow of the street hero card
// (the prototype shows "Woodfield Road", not all-caps).
const streetNameTitle = computed(() =>
  streetName.value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()),
)

// Static pin layout that mirrors the prototype's `.preview` mini-strip —
// 7 houses spread across the road, with the "you" pin highlighted with
// a teal halo. Colours mirror the band legend.
const streetHeroPins = [
  { left: 0,  isYou: false, dot: '#37B27A' },
  { left: 14, isYou: false, dot: '#E0584F' },
  { left: 28, isYou: false, dot: '#E8A33A' },
  { left: 43, isYou: true,  dot: '#E8A33A' },
  { left: 60, isYou: false, dot: '#37B27A' },
  { left: 74, isYou: false, dot: '#E0584F' },
  { left: 88, isYou: false, dot: '#E8A33A' },
]

// Outward postcode (first half) for the Land Registry comparison line.
const outwardPostcode = computed(() => {
  const pc = (props.property?.postcode || 'CV5 6AJ').trim()
  return pc.split(/\s+/)[0]
})

// Ordinal suffix for the street-rank label (8 → "8th", 1 → "1st", etc.)
const streetRankOrdinal = computed(() => {
  const r = props.streetRank ?? 8
  const v = r % 100
  if (v >= 11 && v <= 13) return `${r}th`
  switch (r % 10) {
    case 1: return `${r}st`
    case 2: return `${r}nd`
    case 3: return `${r}rd`
    default: return `${r}th`
  }
})

// ── Stat breakdown (5 expandable rows) ───────────────────────────
// Numbers lifted from the prototype so 16+8+5+10+13 = 52 (the example
// score). When we have a real per-stat breakdown from the backend we'll
// drive these off props; for now they're prototype-faithful constants.
interface StatRow {
  id: 'heating' | 'structure' | 'efficiency' | 'electrics' | 'plumbing'
  icon: string
  label: string
  value: number
  max: number
  pct: number
  tone: 'high' | 'mid' | 'low'
  steps: number
  saving: number
  savingSub: string
  thirdTileLabel: string
  thirdTileNum: string
  thirdTileSub: string
  lines: {
    icon: string
    title: string
    sub: string
    amt: string
    amtSub?: string
    amtGood?: boolean
    amtMuted?: boolean
  }[]
  footText: string
}
// ── Real-EPC stat builders ──────────────────────────────────────
// Convert an EPC efficiency string ("Very Good" / "Good" / "Average" /
// "Poor" / "Very Poor" / "N/A") to a 0–1 normalised score.
function effToScore(eff: string | null | undefined): number {
  const e = (eff || '').toLowerCase().trim()
  if (!e || e === 'n/a' || e === 'na') return 0.5
  if (e === 'very good') return 1.0
  if (e === 'good') return 0.8
  if (e === 'average') return 0.6
  if (e === 'poor') return 0.4
  if (e === 'very poor') return 0.2
  return 0.5
}
function effRating(eff: string | null | undefined): 'Good' | 'Average' | 'Poor' | 'N/A' {
  const e = (eff || '').toLowerCase().trim()
  if (!e || e === 'n/a' || e === 'na') return 'N/A'
  if (e.includes('very good') || e === 'good') return 'Good'
  if (e === 'average') return 'Average'
  if (e.includes('poor')) return 'Poor'
  return 'N/A'
}
function effTone(eff: string | null | undefined): 'high' | 'mid' | 'low' {
  const s = effToScore(eff)
  if (s >= 0.7) return 'high'
  if (s >= 0.5) return 'mid'
  return 'low'
}

// Pull EPC fields from BOTH the top-level Property row and the nested
// `epcCert` sub-object (the backend exposes both shapes — legacy rows
// have direct fields, newer rows have an embedded cert). For each
// field name, we prefer the top-level value if present, otherwise the
// cert's value. This proxy lets callers do `epc.value.mainheatEnergyEff`
// without caring where it lived.
const epc = computed<any>(() => {
  const p = (props.property as any) || {}
  const cert = p.epcCert || {}
  return new Proxy({}, {
    get(_t, key: string) {
      const top = p[key]
      if (top != null && top !== '') return top
      return cert[key]
    },
  })
})

function fmtSaving(rec: any | null): string {
  const v = Number(rec?.typicalSaving ?? 0)
  if (!v) return ''
  return `–£${Math.round(v)}/yr`
}

const stats = computed<StatRow[]>(() => {
  const e = epc.value
  const recs: any[] = (props.property as any)?.epcRecommendations ?? []

  // ── Heating: mainheat + controls ──
  const heatEff = e.mainheatEnergyEff
  const heatcEff = e.mainheatcEnergyEff
  const heatScore = (effToScore(heatEff) + effToScore(heatcEff)) / 2
  const heatVal = Math.round(heatScore * 20)
  const heatRecs = recs.filter((r) =>
    /(boiler|heating|heat pump|radiator|thermostat|controls)/i.test(
      `${r?.title ?? ''} ${r?.improvementType ?? ''}`,
    ),
  )
  const heatSaving = heatRecs.reduce(
    (s, r) => s + (Number(r?.typicalSaving) || 0),
    0,
  )

  // ── Structure: walls + roof + floor + windows ──
  const structScore =
    (effToScore(e.wallsEnergyEff) +
      effToScore(e.roofEnergyEff) +
      effToScore(e.floorEnergyEff) +
      effToScore(e.windowsEnergyEff)) /
    4
  const structVal = Math.round(structScore * 25)
  const structRecs = recs.filter((r) =>
    /(loft|cavity|wall|floor|window|glaz|roof|insulat)/i.test(
      `${r?.title ?? ''} ${r?.improvementType ?? ''}`,
    ),
  )
  const structSaving = structRecs.reduce(
    (s, r) => s + (Number(r?.typicalSaving) || 0),
    0,
  )

  // ── Efficiency: lighting (with low-energy %) ──
  const ledPct = Number(e.lowEnergyLighting ?? 0)
  const effLightScore = effToScore(e.lightingEnergyEff)
  // Blend the % into the lighting eff rating so a 100% LED home beats a 15%.
  const effScore = effLightScore * 0.6 + (ledPct / 100) * 0.4
  const effVal = Math.round(effScore * 15)
  const effRecs = recs.filter((r) => /(led|lighting|light)/i.test(`${r?.title ?? ''}`))
  const effSaving = effRecs.reduce((s, r) => s + (Number(r?.typicalSaving) || 0), 0)

  // ── Electrics: solar PV present? ──
  const elecRecs = recs.filter((r) =>
    /(solar pv|photovoltaic|electric)/i.test(`${r?.title ?? ''} ${r?.improvementType ?? ''}`),
  )
  // If solar PV is recommended, the property doesn't have it. Score 50%.
  const elecScore = elecRecs.length > 0 ? 0.5 : 0.8
  const elecVal = Math.round(elecScore * 20)
  const elecSaving = elecRecs.reduce((s, r) => s + (Number(r?.typicalSaving) || 0), 0)

  // ── Plumbing: hot water + ventilation ──
  const plumbScore = effToScore(e.hotWaterEnergyEff)
  const plumbVal = Math.round(plumbScore * 20)
  const plumbRecs = recs.filter((r) =>
    /(solar (?:water|thermal)|hot water|cylinder)/i.test(`${r?.title ?? ''}`),
  )
  const plumbSaving = plumbRecs.reduce((s, r) => s + (Number(r?.typicalSaving) || 0), 0)

  const heatRating = effRating(heatEff)
  const wallsRating = effRating(e.wallsEnergyEff)
  const lightRating = effRating(e.lightingEnergyEff)
  const hwRating = effRating(e.hotWaterEnergyEff)

  return [
    {
      id: 'heating',
      icon: 'i-lucide-flame',
      label: 'Heating',
      value: heatVal,
      max: 20,
      pct: Math.round(heatScore * 100),
      tone: effTone(heatEff),
      steps: heatRecs.length,
      saving: Math.round(heatSaving),
      savingSub: heatRecs.length ? `${heatRecs.length} step${heatRecs.length > 1 ? 's' : ''}` : 'nothing to fix',
      thirdTileLabel: 'EPC rating',
      thirdTileNum: heatRating,
      thirdTileSub: `mainheat ${effRating(heatEff)}`,
      lines: [
        {
          icon: 'i-lucide-flame',
          title: e.mainheatDescription || 'Main heating system',
          sub: `Rated <b>${effRating(heatEff)}</b> on the EPC.`,
          amt: effRating(heatEff),
          amtGood: effToScore(heatEff) >= 0.7,
        },
        {
          icon: 'i-lucide-thermometer',
          title: e.mainheatcontDescription || 'Heating controls',
          sub: `Rated <b>${effRating(heatcEff)}</b> on the EPC.`,
          amt: effRating(heatcEff),
          amtGood: effToScore(heatcEff) >= 0.7,
        },
      ],
      footText: heatRecs.length
        ? `<b>${heatRecs.length} EPC step${heatRecs.length > 1 ? 's' : ''}</b> can lift heating →`
        : '<b>Your strongest stat.</b> No EPC recommendations live here — heating is sorted.',
    },
    {
      id: 'structure',
      icon: 'i-lucide-brick-wall',
      label: 'Structure',
      value: structVal,
      max: 25,
      pct: Math.round(structScore * 100),
      tone:
        structScore >= 0.7 ? 'high' : structScore >= 0.5 ? 'mid' : 'low',
      steps: structRecs.length,
      saving: Math.round(structSaving),
      savingSub: structRecs.length ? `${structRecs.length} step${structRecs.length > 1 ? 's' : ''}` : 'all good',
      thirdTileLabel: 'Walls EPC',
      thirdTileNum: wallsRating,
      thirdTileSub: e.builtForm || '',
      lines: [
        {
          icon: 'i-lucide-brick-wall',
          title: e.wallsDescription || 'Walls',
          sub: `Walls rated <b>${effRating(e.wallsEnergyEff)}</b> on the EPC.`,
          amt: fmtSaving(structRecs.find((r) => /wall|cavity/i.test(r?.title ?? ''))) || effRating(e.wallsEnergyEff),
          amtSub: structRecs.find((r) => /wall|cavity/i.test(r?.title ?? ''))?.costRange || '',
          amtGood: !structRecs.find((r) => /wall|cavity/i.test(r?.title ?? '')),
        },
        {
          icon: 'i-lucide-house',
          title: e.roofDescription || 'Roof',
          sub: `Roof rated <b>${effRating(e.roofEnergyEff)}</b> on the EPC.`,
          amt: fmtSaving(structRecs.find((r) => /loft|roof/i.test(r?.title ?? ''))) || effRating(e.roofEnergyEff),
          amtSub: structRecs.find((r) => /loft|roof/i.test(r?.title ?? ''))?.costRange || '',
          amtGood: !structRecs.find((r) => /loft|roof/i.test(r?.title ?? '')),
        },
        {
          icon: 'i-lucide-layers',
          title: e.floorDescription || 'Floor',
          sub: `Floor rated <b>${effRating(e.floorEnergyEff)}</b> on the EPC.`,
          amt: fmtSaving(structRecs.find((r) => /floor/i.test(r?.title ?? ''))) || effRating(e.floorEnergyEff),
          amtSub: structRecs.find((r) => /floor/i.test(r?.title ?? ''))?.costRange || '',
          amtGood: !structRecs.find((r) => /floor/i.test(r?.title ?? '')),
        },
      ],
      footText: structRecs.length
        ? '<b>Biggest drag on your score.</b> See the full pathway →'
        : '<b>Structure is in good shape.</b>',
    },
    {
      id: 'efficiency',
      icon: 'i-lucide-lightbulb',
      label: 'Efficiency',
      value: effVal,
      max: 15,
      pct: Math.round(effScore * 100),
      tone: effScore >= 0.7 ? 'high' : effScore >= 0.5 ? 'mid' : 'low',
      steps: effRecs.length,
      saving: Math.round(effSaving),
      savingSub: effRecs.length ? 'LED swap' : 'all LED',
      thirdTileLabel: 'LED %',
      thirdTileNum: `${Math.round(ledPct)}%`,
      thirdTileSub: 'of fixed outlets',
      lines: [
        {
          icon: 'i-lucide-lightbulb',
          title: 'Low energy lighting',
          sub: `<b>${Math.round(ledPct)}%</b> of fixed outlets · rated <b>${effRating(e.lightingEnergyEff)}</b>.`,
          amt: fmtSaving(effRecs[0]) || effRating(e.lightingEnergyEff),
          amtSub: effRecs[0]?.costRange || '',
          amtGood: !effRecs[0],
        },
        {
          icon: 'i-lucide-grid-2x2',
          title: e.windowsDescription || 'Windows',
          sub: `Glazing rated <b>${effRating(e.windowsEnergyEff)}</b>.`,
          amt: effRating(e.windowsEnergyEff),
          amtMuted: true,
        },
      ],
      footText: effRecs.length
        ? '<b>LED swap is the cheapest EPC step</b> →'
        : '<b>Lighting is already efficient.</b>',
    },
    {
      id: 'electrics',
      icon: 'i-lucide-zap',
      label: 'Electrics',
      value: elecVal,
      max: 20,
      pct: Math.round(elecScore * 100),
      tone: elecScore >= 0.7 ? 'high' : elecScore >= 0.5 ? 'mid' : 'low',
      steps: elecRecs.length,
      saving: Math.round(elecSaving),
      savingSub: elecRecs.length ? 'biggest /yr' : 'none',
      thirdTileLabel: 'Solar PV',
      thirdTileNum: elecRecs.length ? 'Missing' : 'Present',
      thirdTileSub: elecRecs.length ? 'EPC step' : 'no upgrade',
      lines: elecRecs.length
        ? [
            {
              icon: 'i-lucide-sun',
              title: elecRecs[0]?.title || 'Solar PV panels',
              sub: elecRecs[0]?.description || "EPC's final step. Crosses you into Band C.",
              amt: fmtSaving(elecRecs[0]) || '—',
              amtSub: elecRecs[0]?.costRange || '',
            },
          ]
        : [
            {
              icon: 'i-lucide-zap',
              title: 'Standard electrical setup',
              sub: 'No EPC recommendations for electrics.',
              amt: 'OK',
              amtMuted: true,
            },
          ],
      footText: elecRecs.length
        ? '<b>Final step on the EPC pathway.</b> →'
        : '<b>Electrics OK on the EPC.</b>',
    },
    {
      id: 'plumbing',
      icon: 'i-lucide-droplet',
      label: 'Plumbing',
      value: plumbVal,
      max: 20,
      pct: Math.round(plumbScore * 100),
      tone: effTone(e.hotWaterEnergyEff),
      steps: plumbRecs.length,
      saving: Math.round(plumbSaving),
      savingSub: plumbRecs.length ? 'solar thermal' : 'all good',
      thirdTileLabel: 'Hot water',
      thirdTileNum: hwRating,
      thirdTileSub: 'EPC rating',
      lines: [
        {
          icon: 'i-lucide-droplet',
          title: e.hotwaterDescription || 'Hot water',
          sub: `Hot water rated <b>${effRating(e.hotWaterEnergyEff)}</b> on the EPC.`,
          amt: effRating(e.hotWaterEnergyEff),
          amtGood: effToScore(e.hotWaterEnergyEff) >= 0.7,
        },
        ...(plumbRecs.length
          ? [
              {
                icon: 'i-lucide-sun',
                title: plumbRecs[0]?.title || 'Solar water heating',
                sub: plumbRecs[0]?.description || 'Roof collector pre-heats water from the sun.',
                amt: fmtSaving(plumbRecs[0]) || '—',
                amtSub: plumbRecs[0]?.costRange || '',
              },
            ]
          : []),
      ],
      footText: plumbRecs.length
        ? 'Solar thermal · longer payback →'
        : '<b>Plumbing is in good shape.</b>',
    },
  ]
})
const expandedStat = ref<StatRow['id'] | null>(null)

// Claim-it-free explainer modal (opens KYC/quiz flow when confirmed)
const claimModalOpen = ref(false)

// When the parent sets `autoOpenClaim` (user just returned from sign-in
// via the claim flow), pop the drawer open. Notifies the parent on close
// so it can clear the auto-open flag and not re-trigger.
watch(
  () => props.autoOpenClaim,
  (open) => {
    if (open) claimModalOpen.value = true
  },
  { immediate: true },
)
watch(claimModalOpen, (open) => {
  if (!open) emit('claim-modal-closed')
})

// "Is this your property?" CTA. If the user is signed in, open the
// explainer modal immediately. If they're a guest, send them to sign-in
// with a redirect-back URL that includes `?claim=1` — the parent
// homescore page picks that up on mount and pops this same modal open
// so the journey resumes where it left off.
function toggleStat(id: StatRow['id']) {
  expandedStat.value = expandedStat.value === id ? null : id
}

// ── Full EPC drawer ──────────────────────────────────────────────
interface EpcItem {
  id: string
  icon: string
  title: string
  sub: string
  rating: string
  ratingClass: 'good' | 'poor' | 'average' | 'nodata'
  flagOk: boolean
  flagText: string
  fix?: { label: string; text: string }
}
function ratingClassFor(eff: string | null | undefined): 'good' | 'poor' | 'average' | 'nodata' {
  const e = (eff || '').toLowerCase().trim()
  if (!e || e === 'n/a' || e === 'na') return 'nodata'
  if (e.includes('very good') || e === 'good') return 'good'
  if (e === 'average') return 'average'
  return 'poor'
}

function findRec(pattern: RegExp): any | null {
  const recs: any[] = (props.property as any)?.epcRecommendations
  if (!Array.isArray(recs)) return null
  return recs.find((r) => pattern.test(`${r?.title ?? ''} ${r?.improvementType ?? ''}`)) ?? null
}

const epcItems = computed<EpcItem[]>(() => {
  const e = epc.value
  const items: EpcItem[] = []

  // 1. Main heating
  const mainHeatRec = findRec(/(boiler|heat pump|main heat)/i)
  items.push({
    id: 'main-heating',
    icon: 'i-lucide-flame',
    title: 'Main heating',
    sub: e.mainheatDescription || 'Heating system',
    rating: effRating(e.mainheatEnergyEff),
    ratingClass: ratingClassFor(e.mainheatEnergyEff),
    flagOk: !mainHeatRec,
    flagText: mainHeatRec
      ? `EPC flags: <b>${mainHeatRec.title}</b>`
      : `Heating rated <b>${effRating(e.mainheatEnergyEff)}</b>. No upgrade on this EPC.`,
    fix: mainHeatRec
      ? {
          label: 'EPC recommendation',
          text: `${mainHeatRec.description || mainHeatRec.title}. ${mainHeatRec.typicalSaving ? `Saves <b>£${mainHeatRec.typicalSaving}/yr</b>.` : ''} ${mainHeatRec.costRange ? `Cost <b>${mainHeatRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 2. Heating controls
  const controlsRec = findRec(/(controls|thermostat|programmer)/i)
  items.push({
    id: 'heating-controls',
    icon: 'i-lucide-thermometer',
    title: 'Heating controls',
    sub: e.mainheatcontDescription || 'Controls',
    rating: effRating(e.mainheatcEnergyEff),
    ratingClass: ratingClassFor(e.mainheatcEnergyEff),
    flagOk: !controlsRec,
    flagText: controlsRec
      ? `EPC flags: <b>${controlsRec.title}</b>`
      : `Heating controls rated <b>${effRating(e.mainheatcEnergyEff)}</b>.`,
    fix: controlsRec
      ? {
          label: 'EPC recommendation',
          text: `${controlsRec.title}. ${controlsRec.typicalSaving ? `Saves <b>£${controlsRec.typicalSaving}/yr</b>.` : ''} ${controlsRec.costRange ? `Cost <b>${controlsRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 3. Hot water
  const hwRec = findRec(/(hot water|cylinder|solar water|solar thermal)/i)
  items.push({
    id: 'hot-water',
    icon: 'i-lucide-droplet',
    title: 'Hot water',
    sub: e.hotwaterDescription || 'Hot water system',
    rating: effRating(e.hotWaterEnergyEff),
    ratingClass: ratingClassFor(e.hotWaterEnergyEff),
    flagOk: !hwRec,
    flagText: hwRec
      ? `EPC flags: <b>${hwRec.title}</b>`
      : `Hot water rated <b>${effRating(e.hotWaterEnergyEff)}</b>.`,
    fix: hwRec
      ? {
          label: 'EPC recommendation',
          text: `${hwRec.description || hwRec.title}. ${hwRec.typicalSaving ? `Saves <b>£${hwRec.typicalSaving}/yr</b>.` : ''} ${hwRec.costRange ? `Cost <b>${hwRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 4. Walls
  const wallsRec = findRec(/(cavity|wall insulation|external wall)/i)
  items.push({
    id: 'walls',
    icon: 'i-lucide-brick-wall',
    title: 'Walls',
    sub: e.wallsDescription || 'Walls',
    rating: effRating(e.wallsEnergyEff),
    ratingClass: ratingClassFor(e.wallsEnergyEff),
    flagOk: !wallsRec,
    flagText: wallsRec
      ? `EPC flags: <b>${wallsRec.title}</b>`
      : `Walls rated <b>${effRating(e.wallsEnergyEff)}</b>.`,
    fix: wallsRec
      ? {
          label: 'EPC recommendation',
          text: `${wallsRec.description || wallsRec.title}. ${wallsRec.typicalSaving ? `Saves <b>£${wallsRec.typicalSaving}/yr</b>.` : ''} ${wallsRec.costRange ? `Cost <b>${wallsRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 5. Roof / loft
  const roofRec = findRec(/(loft|roof insulation|increase loft)/i)
  items.push({
    id: 'roof',
    icon: 'i-lucide-house',
    title: 'Roof · loft insulation',
    sub: e.roofDescription || 'Roof',
    rating: effRating(e.roofEnergyEff),
    ratingClass: ratingClassFor(e.roofEnergyEff),
    flagOk: !roofRec,
    flagText: roofRec
      ? `EPC flags: <b>${roofRec.title}</b>`
      : `Roof rated <b>${effRating(e.roofEnergyEff)}</b>.`,
    fix: roofRec
      ? {
          label: 'EPC recommendation',
          text: `${roofRec.description || roofRec.title}. ${roofRec.typicalSaving ? `Saves <b>£${roofRec.typicalSaving}/yr</b>.` : ''} ${roofRec.costRange ? `Cost <b>${roofRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 6. Floor
  const floorRec = findRec(/floor insulation/i)
  items.push({
    id: 'floor',
    icon: 'i-lucide-layers',
    title: 'Floor',
    sub: e.floorDescription || 'Floor',
    rating: effRating(e.floorEnergyEff),
    ratingClass: ratingClassFor(e.floorEnergyEff),
    flagOk: !floorRec,
    flagText: floorRec
      ? `EPC flags: <b>${floorRec.title}</b>`
      : `Floor rated <b>${effRating(e.floorEnergyEff)}</b>.`,
    fix: floorRec
      ? {
          label: 'EPC recommendation',
          text: `${floorRec.description || floorRec.title}. ${floorRec.typicalSaving ? `Saves <b>£${floorRec.typicalSaving}/yr</b>.` : ''} ${floorRec.costRange ? `Cost <b>${floorRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 7. Windows
  const windowsRec = findRec(/(window|glaz)/i)
  items.push({
    id: 'windows',
    icon: 'i-lucide-grid-2x2',
    title: 'Windows',
    sub: e.windowsDescription || 'Windows',
    rating: effRating(e.windowsEnergyEff),
    ratingClass: ratingClassFor(e.windowsEnergyEff),
    flagOk: !windowsRec,
    flagText: windowsRec
      ? `EPC flags: <b>${windowsRec.title}</b>`
      : `Windows rated <b>${effRating(e.windowsEnergyEff)}</b>.`,
    fix: windowsRec
      ? {
          label: 'EPC recommendation',
          text: `${windowsRec.description || windowsRec.title}. ${windowsRec.typicalSaving ? `Saves <b>£${windowsRec.typicalSaving}/yr</b>.` : ''} ${windowsRec.costRange ? `Cost <b>${windowsRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 8. Lighting
  const ledPct = Number(e.lowEnergyLighting ?? 0)
  const lightingRec = findRec(/(led|lighting|light)/i)
  items.push({
    id: 'lighting',
    icon: 'i-lucide-lightbulb',
    title: 'Lighting',
    sub: `Low energy in <b>${Math.round(ledPct)}%</b> of fixed outlets`,
    rating: effRating(e.lightingEnergyEff),
    ratingClass: ratingClassFor(e.lightingEnergyEff),
    flagOk: !lightingRec,
    flagText: lightingRec
      ? `Only ${Math.round(ledPct)}% of outlets are low-energy. Rated <b>${effRating(e.lightingEnergyEff)}</b>.`
      : `Lighting rated <b>${effRating(e.lightingEnergyEff)}</b>.`,
    fix: lightingRec
      ? {
          label: 'EPC recommendation',
          text: `${lightingRec.title}. ${lightingRec.typicalSaving ? `Saves <b>£${lightingRec.typicalSaving}/yr</b>.` : ''} ${lightingRec.costRange ? `Cost <b>${lightingRec.costRange}</b>.` : ''}`,
        }
      : undefined,
  })

  // 9. Solar water heating
  const swhRec = findRec(/solar (?:water|thermal)/i)
  if (swhRec) {
    items.push({
      id: 'solar-water',
      icon: 'i-lucide-sun',
      title: 'Solar water heating',
      sub: 'Not present · recommended on EPC',
      rating: 'Not installed',
      ratingClass: 'nodata',
      flagOk: false,
      flagText: 'Listed as a recommended improvement on the EPC.',
      fix: {
        label: 'EPC recommendation',
        text: `${swhRec.description || swhRec.title}. ${swhRec.typicalSaving ? `Saves <b>£${swhRec.typicalSaving}/yr</b>.` : ''} ${swhRec.costRange ? `Cost <b>${swhRec.costRange}</b>.` : ''}`,
      },
    })
  }

  // 10. Solar PV
  const pvRec = findRec(/(solar pv|photovoltaic)/i)
  if (pvRec) {
    items.push({
      id: 'solar-pv',
      icon: 'i-lucide-zap',
      title: 'Solar PV panels',
      sub: 'Not present · recommended on EPC',
      rating: 'Not installed',
      ratingClass: 'nodata',
      flagOk: false,
      flagText: 'Listed as a recommended improvement — generates electricity from sunlight.',
      fix: {
        label: 'EPC recommendation',
        text: `${pvRec.description || pvRec.title}. ${pvRec.typicalSaving ? `Saves <b>£${pvRec.typicalSaving}/yr</b>.` : ''} ${pvRec.costRange ? `Cost <b>${pvRec.costRange}</b>.` : ''}`,
      },
    })
  }

  // 11. Secondary heating (if present)
  if (e.secondheatDescription && !/none/i.test(e.secondheatDescription)) {
    items.push({
      id: 'secondary-heating',
      icon: 'i-lucide-flame',
      title: 'Secondary heating',
      sub: e.secondheatDescription,
      rating: 'N/A',
      ratingClass: 'nodata',
      flagOk: true,
      flagText: `Secondary heating: ${e.secondheatDescription}`,
    })
  }

  // 12. Ventilation
  if (e.mechanicalVentilation) {
    items.push({
      id: 'ventilation',
      icon: 'i-lucide-wind',
      title: 'Ventilation',
      sub: e.mechanicalVentilation,
      rating: 'N/A',
      ratingClass: 'nodata',
      flagOk: true,
      flagText: `Ventilation: <b>${e.mechanicalVentilation}</b>`,
    })
  }

  return items
})

const expandedEpcItem = ref<string | null>(null)
function toggleEpcItem(id: string) {
  expandedEpcItem.value = expandedEpcItem.value === id ? null : id
}

// Full EPC drawer (the "Every line of energy detail behind your score"
// expandable card). This ref was missing — that's why clicking the head
// row appeared to do nothing.
const epcDrawerOpen = ref(false)
const epcDrawerEl = ref<HTMLElement | null>(null)
function toggleEpcDrawer() {
  epcDrawerOpen.value = !epcDrawerOpen.value
  if (epcDrawerOpen.value) {
    // Scroll the drawer body into view so the user immediately sees the
    // expansion. Without this, on small viewports the drawer can open
    // below the fold and feel like the click did nothing.
    requestAnimationFrame(() => {
      epcDrawerEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

// ── Display helpers ───────────────────────────────────────────────
function formatNum(n: number): string {
  return new Intl.NumberFormat('en-GB').format(Math.round(n))
}
const searchesTodayDisplay = computed(() => {
  const n = props.searchesToday ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})
// Watchers = wishlist + saved-property count. Phrased as "1 person" /
// "N people" with verb-agreement handled in the template.
const watchersDisplay = computed(() => {
  const n = props.watchersCount ?? 0
  return `${n} ${n === 1 ? 'person' : 'people'}`
})
</script>

<style scoped>
/* ── Design tokens (mirror prototype :root) ────────────────────── */
.hs-v6-score {
  --primary: #231d45;
  --accent: #00a19a;
  --accent-dark: #008a84;
  --accent-light: #00b8b0;
  --accent-pale: #e5f4f2;
  --accent-paler: #f2faf8;
  --bg: #f5f6fa;
  --page: #f3f2ef;
  --card: #ffffff;
  --text: #231d45;
  --text-secondary: #6b7089;
  --text-faint: #a8a9ad;
  --border: #e4e5ed;
  --border-soft: #f0f1f5;
  --warning: #f5a623;
  --warning-deep: #7a5500;
  --warning-pale: #fff5e0;
  --gold: #f0b933;
  --error: #e74c5e;
  --error-light: #f08594;
  --error-pale: #fcebea;
  --shadow-card: 0 2px 8px rgba(35, 29, 69, 0.05);

  background: var(--page);
  color: var(--text);
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
}

/* ── Column wrappers: transparent on mobile (single column, original order),
   real dashboard columns on desktop. ─────────────────────────────────── */
.hs-v6-a,
.hs-v6-b {
  display: contents;
}

@media (min-width: 920px) {
  .hs-v6-score {
    max-width: 1180px;
    margin: 0 auto;
    padding: 20px 24px 8px;
    display: grid;
    grid-template-columns: minmax(0, 0.97fr) minmax(0, 1.03fr);
    align-items: start;
    column-gap: 26px;
    background: transparent;
  }
  .hs-v6-a,
  .hs-v6-b {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }
  .hs-v6-a {
    grid-column: 1;
  }
  .hs-v6-b {
    grid-column: 2;
  }
  /* Fork (intent) + any trailing spacer run full width beneath both columns. */
  .hs-v6-score > .fork-section {
    grid-column: 1 / -1;
    margin-top: 6px;
  }
  .hs-v6-score > div:last-child:not([class]) {
    grid-column: 1 / -1;
  }
  /* Grid + flex gaps own the spacing now — neutralise the mobile per-card
     outer margins so columns align cleanly. */
  .hs-v6-a > *,
  .hs-v6-b > * {
    margin: 0 !important;
  }
  /* Fork options fan out across the full-width band. */
  .hs-v6-score .fork-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
  }
}

/* ── Typography rebalance ──────────────────────────────────────
   Soften the prototype's heavy 800-weights to match the rest of the
   app (max weight ~700 to match the SF Pro 600/700 scale used in the
   global header and other pages). */
.hs-v6-score :is(.app-header-title, .hs-addr-line, .score-band, .gn-big,
  .ssp-head-title, .ssp-bar-amt, .ssp-total-num, .ssp-cell-num,
  .stat-cost-title, .epc-grade-letter, .epc-saving-num,
  .fork-opt-title) {
  font-weight: 700;
}
.hs-v6-score :is(.app-header-sub, .hs-addr-meta, .score-explainer,
  .score-footer, .ssp-bar-label, .ssp-bar-amt-pct, .ssp-total-label,
  .stat-cost-sub, .epc-grade-sub, .epc-saving-sub, .epc-item-sub,
  .fork-opt-sub) {
  font-weight: 500;
}

/* ── App header (kept for backwards-compat; no longer rendered) ── */
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  padding-top: calc(14px + env(safe-area-inset-top));
  background: var(--card);
  border-bottom: 1px solid var(--border);
}
.back-btn,
.app-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  transition: all 0.15s;
  flex-shrink: 0;
}
.back-btn:hover,
.app-icon-btn:hover {
  background: var(--accent-paler);
  border-color: var(--accent-pale);
  color: var(--accent-dark);
}
.back-btn svg,
.app-icon-btn svg {
  width: 16px;
  height: 16px;
}
.app-icon-btn {
  color: var(--text-secondary);
}
.app-header-info {
  flex: 1;
  min-width: 0;
}
.app-header-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
  line-height: 1.15;
}
.app-header-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 1px;
}

/* ── Animations ───────────────────────────────────────────────── */
@keyframes hs-v6-pulse {
  0% { transform: scale(0.6); opacity: 0.5; }
  100% { transform: scale(1.6); opacity: 0; }
}
@keyframes hs-v6-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes hs-v6-caretBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes hs-v6-scoreRing {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.05); opacity: 0; }
  100% { transform: scale(1.06); opacity: 0; }
}
.anim-1 { animation: hs-v6-fadeUp 0.35s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-2 { animation: hs-v6-fadeUp 0.35s 0.18s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-3 { animation: hs-v6-fadeUp 0.35s 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
.anim-4 { animation: hs-v6-fadeUp 0.35s 0.38s cubic-bezier(0.22, 1, 0.36, 1) both; }

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.tw-caret {
  display: inline-block;
  width: 2px;
  height: 0.95em;
  background: currentColor;
  vertical-align: -0.12em;
  margin-left: 2px;
  animation: hs-v6-caretBlink 0.8s steps(1) infinite;
  opacity: 0.9;
  color: transparent;
  font-size: 0;
}
.tw-caret.done {
  animation: none;
  opacity: 0;
}

/* ── Amber address card ───────────────────────────────────────── */
.hs-addr-card-wrap {
  margin: 14px 20px 0;
}
.hs-addr-card {
  margin: 14px 20px 0;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #f0a030 0%, #c67c18 50%, #8b4e0a 100%);
  border: none;
  border-radius: 14px;
  box-shadow:
    0 12px 32px -8px rgba(180, 100, 20, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  color: white;
  position: relative;
  overflow: hidden;
}
.hs-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 65%);
  pointer-events: none;
}
.hs-addr-card > * {
  position: relative;
  z-index: 1;
}
.hs-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 6px;
}
.hs-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  margin-top: 8px;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}
.hs-addr-block {
  flex: 1;
  min-width: 0;
}
.hs-addr-line {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 2px;
}
.hs-addr-meta {
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}
.hs-addr-pills {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}
.hs-addr-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 800;
  padding: 5px 10px 5px 7px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
}
.hs-addr-pill svg {
  width: 10px;
  height: 10px;
}
.hs-addr-pill .epc-letter {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
}
.claim-cta-btn {
  display: flex;
  width: 100%;
  margin-top: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  border: none;
  color: white;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -0.1px;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.35);
  transition: filter 0.15s;
}
.claim-cta-btn:hover {
  filter: brightness(1.06);
}
/* Already-claimed variants — informational, not a "claim" pitch. */
.claim-cta-btn.published {
  background: white;
  color: #8b4e0a;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}
.claim-cta-btn.progress {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  box-shadow: none;
}
.hs-addr-stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 14px;
  flex-wrap: wrap;
}
/* Stack the two social-proof rows tighter so they read as a pair. */
.hs-addr-stat-row + .hs-addr-stat-row { margin-top: 6px; }
.hs-addr-stat-row .pulse-dot {
  background: var(--accent-light);
}
/* Watchers row uses an eye icon (more semantically tied to "watching"
   than a generic pulse dot). White stroke + a subtle dark shadow so
   it reads clearly on the amber / orange hero card. */
.hs-addr-stat-row .hs-addr-stat-eye {
  width: 15px;
  height: 15px;
  color: #ffffff;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.28));
}

/* Shared pill background for the social-proof rows ("checked today" +
   "watching" / "Live interest"). Mirrors V6QuizView so both surfaces
   look identical. */
.hs-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5eead4;
  box-shadow: 0 0 8px rgba(94, 234, 212, 0.7);
  flex-shrink: 0;
}
.hs-addr-stat-row .hs-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
}
.hs-live-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}
.hs-live-bar {
  width: 3px;
  background: #fff;
  border-radius: 1.5px;
  animation: hsLiveBars 1.2s ease-in-out infinite;
  transform-origin: bottom;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.55);
}
.hs-live-bar:nth-child(1) { height: 5px;  animation-delay: 0s; }
.hs-live-bar:nth-child(2) { height: 9px;  animation-delay: 0.15s; }
.hs-live-bar:nth-child(3) { height: 13px; animation-delay: 0.3s; }
@keyframes hsLiveBars {
  0%, 100% { transform: scaleY(0.55); opacity: 0.55; }
  50%      { transform: scaleY(1);    opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-live-bar { animation: none; transform: scaleY(1); opacity: 0.9; }
}
.hs-live-text {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: -0.05px;
  line-height: 1.25;
}
.hs-live-text b {
  font-weight: 800;
}
.hs-addr-stat-row .pulse-dot::after {
  background: var(--accent-light);
}
.hs-addr-stat-count {
  font-weight: 800;
  color: white;
}
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  position: relative;
  flex-shrink: 0;
  display: inline-block;
}
.pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.35;
  animation: hs-v6-pulse 1.8s ease-out infinite;
}

/* ── HomeScore card ─────────────────────────────────────────────── */
.score-card {
  margin: 14px 20px 0;
  padding: 20px 20px 18px;
  background: linear-gradient(180deg, var(--accent-paler) 0%, var(--card) 60%);
  border: 2px solid var(--accent);
  border-radius: 14px;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.12);
}
.score-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  border: 2px solid var(--accent);
  pointer-events: none;
  animation: hs-v6-scoreRing 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  opacity: 0;
}
.score-eyebrow-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.score-eyebrow-mark {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1.4px;
  text-transform: uppercase;
}
.score-eyebrow-mark sup {
  color: var(--accent);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0;
}
.score-top {
  display: flex;
  align-items: center;
  gap: 18px;
}
.score-gauge {
  position: relative;
  width: 104px;
  height: 104px;
  flex-shrink: 0;
}
.score-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.g-bg {
  stroke: var(--border-soft);
  fill: none;
}
.g-fill {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.g-num {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.gn-big {
  font-size: 34px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -1.2px;
  line-height: 1;
  font-feature-settings: 'tnum';
}
.gn-small {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-faint);
  margin-top: 2px;
}
.score-summary {
  flex: 1;
  min-width: 0;
}
.score-band {
  font-size: 19px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.4px;
  margin-bottom: 6px;
  line-height: 1.1;
}
.score-explainer {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.5;
}
.score-explainer :deep(b) {
  color: var(--accent-dark);
  font-weight: 800;
}
.score-footer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 14px;
  margin-top: 14px;
  border-top: 1px solid var(--border-soft);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.5;
}
.score-footer-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--text-faint);
  margin-top: 1px;
}
.score-footer b {
  color: var(--text);
  font-weight: 800;
}
.score-refine-link {
  color: var(--accent-dark);
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

/* ── Quick stats strip ────────────────────────────────────────── */
.score-strip-hint {
  margin: 12px 20px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  letter-spacing: 0.3px;
}
.score-strip-card {
  display: flex;
  gap: 8px;
  margin: 12px 20px 0;
  padding: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-card);
}
.score-strip-item {
  flex: 1;
  padding: 10px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  text-align: center;
}
.score-strip-eyebrow {
  font-size: 9px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.score-strip-num {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.3px;
  line-height: 1.1;
}
.score-strip-num.warn {
  color: var(--error);
}
.score-strip-num.good {
  color: var(--accent-dark);
}
.strip-unit {
  font-weight: 600;
  font-size: 11px;
  color: var(--text-secondary);
}
.score-strip-sub {
  font-size: 9.5px;
  color: var(--text-secondary);
  font-weight: 600;
  margin-top: 2px;
}
.score-strip-item.clickable {
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  /* Gentle teal halo cycles through the three cards so first-time users
     notice they're tappable. Stops the moment one becomes active (open
     panel) and on hover so it doesn't fight the interaction state. */
  animation: scoreStripPulse 2.8s ease-in-out infinite;
}
.score-strip-item.clickable:nth-child(2) { animation-delay: 0.45s; }
.score-strip-item.clickable:nth-child(3) { animation-delay: 0.9s; }
@keyframes scoreStripPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 161, 154, 0);
    border-color: var(--border-soft);
  }
  45% {
    box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.0), 0 0 14px 2px rgba(0, 161, 154, 0.18);
    border-color: rgba(0, 161, 154, 0.45);
  }
}
@media (prefers-reduced-motion: reduce) {
  .score-strip-item.clickable { animation: none; }
}
.score-strip-item.clickable:hover {
  border-color: var(--accent-pale);
  background: var(--card);
  transform: translateY(-1px);
  animation: none;
}
.score-strip-item.clickable.active { animation: none; }
.score-strip-item.clickable.active {
  border-color: var(--accent);
  background: var(--accent-paler);
  box-shadow: 0 0 0 2px rgba(0, 161, 154, 0.15);
}
.score-strip-item.clickable.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid var(--accent);
}

/* ── Popout panels (bills / CO₂ / street) ─────────────────────── */
.score-strip-panel {
  margin: 14px 20px 0;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--accent-pale);
  border-radius: 14px;
  box-shadow: var(--shadow-card);
  animation: hs-v6-fadeUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.ssp-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-soft);
}
.ssp-head-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--accent-paler);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.ssp-head-info { flex: 1; }
.ssp-head-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
}
.ssp-head-sub {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
}
.ssp-head-close {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  font-weight: 700;
  line-height: 1;
}
.ssp-head-close:hover {
  background: var(--error-pale, #fcebea);
  color: var(--error);
}
.ssp-divider {
  font-size: 9.5px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin: 14px 0 6px;
}

/* Bar row used by Bills + CO₂ panels */
.ssp-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 11.5px;
}
.ssp-bar-icon {
  font-size: 14px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.ssp-bar-label {
  width: 80px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}
.ssp-bar-track {
  flex: 1;
  height: 8px;
  background: var(--bg);
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
}
.ssp-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}
.ssp-bar-fill.gas {
  background: linear-gradient(90deg, #f5a623, #e69015);
}
.ssp-bar-fill.hw {
  background: linear-gradient(90deg, #4a9fcf, #2d7aae);
}
.ssp-bar-fill.elec {
  background: linear-gradient(90deg, #ffd700, #e6be00);
}
.ssp-bar-fill.co2-heat { background: #8b4e0a; }
.ssp-bar-fill.co2-hw   { background: #4a9fcf; }
.ssp-bar-fill.co2-elec { background: var(--warning); }
.ssp-bar-amt {
  font-size: 11px;
  font-weight: 800;
  color: var(--text);
  width: 62px;
  text-align: right;
  flex-shrink: 0;
}
.ssp-bar-amt-pct {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-faint);
  margin-top: 1px;
}
.ssp-total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-top: 8px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
}
.ssp-total-label {
  font-size: 10.5px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.ssp-total-num {
  font-size: 14px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
}
.ssp-note {
  padding: 8px 10px;
  margin-top: 8px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  font-size: 10.5px;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.4;
}
.ssp-note b { color: var(--text); font-weight: 800; }
.ssp-equiv {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 9px 12px;
  background: #f5f0e8;
  border: 1px solid #e8dec8;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 600;
  color: #7a5500;
}
.ssp-equiv-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.ssp-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--accent-paler), var(--card));
  border: 1px solid var(--accent-pale);
  border-radius: 10px;
  cursor: pointer;
  transition: filter 0.15s;
}
.ssp-foot:hover {
  filter: brightness(0.98);
  background: var(--accent-pale);
}
.ssp-foot-text {
  flex: 1;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-dark);
  line-height: 1.35;
}
.ssp-foot-text :deep(b) { font-weight: 800; }
.ssp-foot-arrow {
  color: var(--accent-dark);
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

/* ── Street panel ─────────────────────────────────────────────── */
.ssp-rank-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--accent-paler), var(--card));
  border: 1px solid var(--accent-pale);
  border-radius: 10px;
}
.ssp-rank-num {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: -1px;
  line-height: 1;
}
.ssp-rank-info { flex: 1; }
.ssp-rank-label {
  font-size: 11px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.1px;
  line-height: 1.1;
}
.ssp-rank-sub {
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
  line-height: 1.35;
}
.ssp-rank-sub :deep(b) { color: var(--text); font-weight: 800; }

.ssp-street-legend {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  padding: 8px 4px 0;
}
.ssp-street-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-secondary);
}
.ssp-street-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ssp-street-scene {
  margin: 10px -6px 8px;
  background: linear-gradient(180deg, #dceef0 0%, #bfe2e5 60%, #a8c3c6 100%);
  border-radius: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0 2px;
  border: 1px solid var(--border-soft);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.ssp-street-scene::-webkit-scrollbar { height: 5px; }
.ssp-street-scene::-webkit-scrollbar-track { background: transparent; }
.ssp-street-scene::-webkit-scrollbar-thumb {
  background: rgba(35, 29, 69, 0.18);
  border-radius: 100px;
}
.ssp-street-inner {
  position: relative;
  width: 460px;
  height: 180px;
  flex-shrink: 0;
}
.ssp-street-svg {
  width: 460px;
  height: 180px;
  display: block;
  position: absolute;
  inset: 0;
}
.ssp-street-house { cursor: pointer; }
.ssp-street-house:hover .ssp-house-body {
  stroke: var(--accent-dark);
  stroke-width: 1.2;
}
.ssp-street-scroll-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text-faint);
  margin-top: -2px;
  padding: 0 0 4px;
}
.ssp-street-tip {
  text-align: center;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-faint);
  margin-top: -2px;
  padding: 6px 0 4px;
  font-style: italic;
}

/* Walking figure overlay — animates between selected houses */
.ssp-street-walker {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  width: 18px;
  height: 26px;
  transform: translate(-50%, -50%);
  transition:
    left 0.85s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.85s cubic-bezier(0.4, 0, 0.2, 1);
}
.ssp-street-walker svg {
  width: 100%;
  height: 100%;
  display: block;
}
.ssp-street-walker .leg-l,
.ssp-street-walker .leg-r,
.ssp-street-walker .arm-l,
.ssp-street-walker .arm-r {
  transform-box: fill-box;
}
.ssp-street-walker.walking .leg-l {
  animation: hs-v6-wlk-leg-l 0.45s ease-in-out infinite;
  transform-origin: 50% 0%;
}
.ssp-street-walker.walking .leg-r {
  animation: hs-v6-wlk-leg-r 0.45s ease-in-out infinite;
  transform-origin: 50% 0%;
}
.ssp-street-walker.walking .arm-l {
  animation: hs-v6-wlk-arm-l 0.45s ease-in-out infinite;
  transform-origin: 50% 0%;
}
.ssp-street-walker.walking .arm-r {
  animation: hs-v6-wlk-arm-r 0.45s ease-in-out infinite;
  transform-origin: 50% 0%;
}
@keyframes hs-v6-wlk-leg-l {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(35deg); }
}
@keyframes hs-v6-wlk-leg-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-35deg); }
}
@keyframes hs-v6-wlk-arm-l {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-30deg); }
}
@keyframes hs-v6-wlk-arm-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(30deg); }
}

/* Selected house tooltip */
.ssp-street-tooltip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--card);
  border: 1.5px solid var(--accent-pale);
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 161, 154, 0.08);
  transition: border-color 0.2s;
}
.ssp-street-tooltip.you {
  border-color: var(--accent);
  background: var(--accent-paler);
}
.ssp-street-tooltip-num {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
}
.ssp-street-tooltip-rating {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  color: white;
  letter-spacing: 0.3px;
  min-width: 54px;
  text-align: center;
}
.ssp-street-tooltip-cost {
  margin-left: auto;
  font-size: 13.5px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.3px;
}
.ssp-street-tooltip-cost.good { color: var(--accent-dark); }
.ssp-street-tooltip-cost.warn { color: var(--warning-deep); }
.ssp-street-tooltip-cost.high { color: var(--error); }

/* Pathway projection card */
.ssp-street-projection {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: linear-gradient(135deg, var(--accent-paler) 0%, var(--card) 100%);
  border: 1.5px solid var(--accent);
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: filter 0.15s;
}
.ssp-street-projection:hover { filter: brightness(0.98); }
.ssp-street-projection-icon {
  font-size: 24px;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 161, 154, 0.18);
}
.ssp-street-projection-body {
  flex: 1;
  min-width: 0;
}
.ssp-street-projection-label {
  font-size: 9.5px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1.1;
}
.ssp-street-projection-num {
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.4px;
  line-height: 1.1;
  margin-top: 3px;
}
.ssp-street-projection-num span {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 1px;
}
.ssp-street-projection-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 2px;
  line-height: 1.3;
}
.ssp-street-projection-sub :deep(b) {
  color: var(--accent-dark);
  font-weight: 800;
}
.ssp-street-projection-saving {
  text-align: right;
  flex-shrink: 0;
  padding-left: 6px;
  border-left: 1px solid var(--accent-pale);
}
.ssp-street-projection-saving-num {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: -0.4px;
  line-height: 1;
}
.ssp-street-projection-saving-sub {
  font-size: 9.5px;
  font-weight: 700;
  color: var(--accent-dark);
  margin-top: 2px;
  letter-spacing: 0.3px;
}

/* ── Section heading row ───────────────────────────────────────── */
.section-h-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 18px 20px 10px;
}
.section-h {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.section-h-sub {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-dark);
}

/* ── Stat breakdown card (5 rows · expandable) ──────────────────── */
.stat-card {
  margin: 6px 20px 0;
  padding: 14px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-card);
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}
.stat-icon {
  font-size: 14px;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}
.stat-label {
  width: 70px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}
.stat-bar-wrap {
  flex: 1;
  height: 8px;
  background: var(--bg);
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  position: relative;
}
.stat-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.stat-bar-fill.low {
  background: linear-gradient(90deg, var(--error), var(--error-light));
}
.stat-bar-fill.mid {
  background: linear-gradient(90deg, var(--warning), var(--gold));
}
.stat-bar-fill.high {
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
}
.stat-value {
  width: 46px;
  text-align: right;
  font-size: 11px;
  font-weight: 800;
  color: var(--text);
  flex-shrink: 0;
}
.stat-row.clickable {
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 8px;
  padding: 6px 4px;
  margin: -1px -4px;
}
.stat-row.clickable:hover {
  background: var(--accent-paler);
}
.stat-row-chev {
  font-size: 14px;
  color: var(--text-faint);
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 2px;
  line-height: 1;
  width: 10px;
  text-align: right;
}
.stat-row.clickable.open .stat-row-chev {
  transform: rotate(90deg);
  color: var(--accent-dark);
}
.stat-expand {
  padding: 0 0 12px;
  animation: fadeSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.stat-expand-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 10px 0 12px;
}
.stat-expand-meta-tile {
  padding: 8px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  text-align: center;
}
.stat-expand-meta-eyebrow {
  font-size: 8.5px;
  font-weight: 800;
  color: var(--text-faint);
  letter-spacing: 0.7px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 3px;
}
.stat-expand-meta-num {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
  line-height: 1.1;
}
.stat-expand-meta-num.save {
  color: var(--accent-dark);
}
.stat-expand-meta-num.cost {
  color: var(--text);
}
.stat-expand-meta-sub {
  font-size: 9px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 2px;
  line-height: 1.15;
}
.stat-cost-line {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 0;
}
.stat-cost-line + .stat-cost-line {
  border-top: 1px solid var(--border-soft);
}
.stat-cost-bullet {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}
.stat-cost-info {
  flex: 1;
  min-width: 0;
}
.stat-cost-title {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 2px;
  letter-spacing: -0.1px;
}
.stat-cost-sub {
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
}
.stat-cost-sub :deep(b) {
  color: var(--text);
  font-weight: 800;
}
.stat-cost-amt {
  text-align: right;
  flex-shrink: 0;
}
.stat-cost-amt-big {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: -0.2px;
  line-height: 1.1;
  white-space: nowrap;
}
.stat-cost-amt-sub {
  font-size: 9.5px;
  font-weight: 600;
  color: var(--text-faint);
  margin-top: 2px;
  white-space: nowrap;
}
.stat-expand-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--accent-paler), var(--card));
  border: 1px solid var(--accent-pale);
  border-radius: 10px;
  cursor: pointer;
  transition: filter 0.15s;
}
.stat-expand-foot:hover {
  filter: brightness(0.98);
  background: var(--accent-pale);
}
.stat-expand-foot-text {
  flex: 1;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--accent-dark);
  line-height: 1.35;
}
.stat-expand-foot-text :deep(b) {
  font-weight: 800;
}
.stat-expand-foot-arrow {
  color: var(--accent-dark);
  font-size: 14px;
  font-weight: 800;
  flex-shrink: 0;
}

/* ── Full EPC drawer ───────────────────────────────────────────── */
.epc-drawer {
  margin: 14px 20px 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
.epc-drawer-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  user-select: none;
}
.epc-drawer-head:hover {
  background: var(--accent-paler);
}
.epc-drawer-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--accent-paler);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--accent-dark);
}
.epc-drawer-icon svg {
  width: 18px;
  height: 18px;
}
.epc-drawer-info {
  flex: 1;
  min-width: 0;
}
.epc-drawer-title {
  font-size: 13.5px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.2px;
}
.epc-drawer-sub {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
}
.epc-drawer-chev {
  font-size: 20px;
  color: var(--text-faint);
  transition: transform 0.2s;
  line-height: 1;
}
.epc-drawer-chev.open {
  transform: rotate(90deg);
  color: var(--accent-dark);
}
.epc-drawer-body {
  padding: 0 16px 14px;
  border-top: 1px solid var(--border-soft);
  animation: fadeSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.epc-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-soft);
}
.epc-grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.epc-grade-letter {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: white;
}
.epc-grade-sub {
  font-size: 9px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 0.6px;
  text-transform: uppercase;
}
.epc-arrow {
  color: var(--text-faint);
  font-size: 18px;
  font-weight: 600;
}
.epc-saving {
  margin-left: auto;
  text-align: right;
}
.epc-saving-num {
  font-size: 15px;
  font-weight: 800;
  color: var(--accent-dark);
  letter-spacing: -0.2px;
}
.epc-saving-sub {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-top: 1px;
}
.epc-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  transition: background 0.15s;
}
.epc-item:last-of-type {
  border-bottom: none;
}
.epc-item:hover {
  background: var(--accent-paler);
}
.epc-item-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  padding-top: 1px;
}
.epc-item-body {
  flex: 1;
  min-width: 0;
  padding-right: 6px;
}
.epc-item-title {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 2px;
}
.epc-item-sub {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 500;
  line-height: 1.4;
}
.epc-item-rating {
  font-size: 9.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 100px;
  letter-spacing: 0.3px;
  flex-shrink: 0;
  text-transform: uppercase;
}
.epc-item-rating.good {
  background: var(--accent-paler);
  color: var(--accent-dark);
  border: 1px solid var(--accent-pale);
}
.epc-item-rating.average {
  background: var(--warning-pale);
  color: #7a5500;
  border: 1px solid #e6a23c;
}
.epc-item-rating.poor {
  background: var(--error-pale);
  color: var(--error);
  border: 1px solid var(--error-light);
}
.epc-item-rating.nodata {
  background: var(--bg);
  color: var(--text-faint);
  border: 1px solid var(--border);
}
.epc-item-chev {
  font-size: 14px;
  color: var(--text-faint);
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 4px;
}
.epc-item-chev.open {
  transform: rotate(90deg);
  color: var(--accent-dark);
}
.epc-item-expand {
  padding: 0 0 14px 34px;
  animation: fadeSlideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.epc-flag,
.epc-fix {
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  font-size: 11.5px;
  line-height: 1.55;
}
.epc-flag {
  background: var(--error-pale);
  border: 1px solid var(--error-light);
  color: var(--error);
}
.epc-flag.ok {
  background: var(--accent-paler);
  border: 1px solid var(--accent-pale);
  color: var(--accent-dark);
}
.epc-fix {
  background: var(--accent-paler);
  border: 1px solid var(--accent-pale);
  color: var(--accent-dark);
}
.epc-flag-label,
.epc-fix-label {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.epc-flag-text,
.epc-fix-text {
  font-weight: 500;
  color: var(--text);
}
.epc-fix-text :deep(b) {
  color: var(--accent-dark);
  font-weight: 800;
}
.epc-flag-text :deep(b) {
  color: var(--error);
  font-weight: 800;
}
.epc-fix-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 11.5px;
  font-weight: 800;
  color: var(--accent-dark);
  cursor: pointer;
}
.epc-fix-action:hover {
  color: var(--accent);
}
.epc-drawer-cta {
  margin-top: 12px;
  padding: 12px 14px;
  background: var(--accent-paler);
  border: 1px solid var(--accent-pale);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
}
.epc-drawer-cta:hover {
  background: var(--accent-pale);
}
.epc-drawer-cta-text {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent-dark);
  line-height: 1.4;
}
.epc-drawer-cta-text :deep(b) {
  font-weight: 800;
}
.epc-drawer-cta-arrow {
  color: var(--accent-dark);
  font-size: 16px;
  font-weight: 800;
}

/* ── Fork section (owner / interested) ─────────────────────────── */
.fork-section {
  padding: 20px 20px 0;
}
.fork-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--text-secondary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 14px;
}
.fork-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.fork-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: var(--shadow-card);
  width: 100%;
  text-align: left;
  font-family: inherit;
}
.fork-opt:hover {
  border-color: var(--accent-pale);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.1);
}
.fork-opt.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  border-color: var(--accent-dark);
  color: white;
}
.fork-opt.primary:hover {
  filter: brightness(1.04);
}
.fork-opt-icon {
  font-size: 22px;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: var(--accent-paler);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fork-opt.primary .fork-opt-icon {
  background: rgba(255, 255, 255, 0.18);
}
.fork-opt-body {
  flex: 1;
  min-width: 0;
}
.fork-opt-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  margin-bottom: 3px;
  color: var(--text);
}
.fork-opt.primary .fork-opt-title {
  color: white;
}
.fork-opt-sub {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.4;
}
.fork-opt.primary .fork-opt-sub {
  color: rgba(255, 255, 255, 0.85);
}
.fork-opt-chev {
  font-size: 18px;
  color: var(--text-faint);
  flex-shrink: 0;
}
.fork-opt.primary .fork-opt-chev {
  color: rgba(255, 255, 255, 0.7);
}

/* ── EPC NOT AVAILABLE empty state ──────────────────────────── */
/* Compact property header shown above the no-EPC card so the user
   still knows which property they're looking at. */
.hs-noepc-prop {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 20px 0;
  padding: 14px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
}
.hs-noepc-prop-pin {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}
.hs-noepc-prop-block { flex: 1; min-width: 0; }
.hs-noepc-prop-line {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}
.hs-noepc-prop-meta {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
}

.hs-noepc-card {
  margin: 18px 20px 0;
  padding: 24px 22px 20px;
  background: var(--card);
  border: 1.5px dashed var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  text-align: center;
}
.hs-noepc-icon {
  font-size: 38px;
  line-height: 1;
  margin-bottom: 10px;
}
.hs-noepc-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.3px;
  margin-bottom: 8px;
  line-height: 1.25;
}
.hs-noepc-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.55;
  margin-bottom: 16px;
}
.hs-noepc-sub :deep(b) {
  color: var(--text);
  font-weight: 700;
}
.hs-noepc-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.hs-noepc-btn {
  width: 100%;
  padding: 13px 14px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  border: none;
  display: inline-block;
}
.hs-noepc-btn.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  box-shadow: 0 3px 12px rgba(0, 161, 154, 0.25);
}
.hs-noepc-btn.ghost {
  background: var(--card);
  border: 1.5px solid var(--border);
  color: var(--text);
}
.hs-noepc-btn.ghost:hover {
  border-color: var(--accent-pale);
  background: var(--accent-paler);
  color: var(--accent-dark);
}
.hs-noepc-help {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-faint);
  line-height: 1.5;
  padding-top: 12px;
  border-top: 1px solid var(--border-soft);
}

/* ── No-EPC — prototype UX (amber hero + navy CTA + quiz entry) ──
   Ported from prisma/homescore-no-epc-prototype.html so the empty
   state feels like a considered path, not an error. */
.hs-noepc-hero {
  margin: 18px 20px 0;
  padding: 22px 18px 18px;
  background: linear-gradient(160deg, #cd8038, #b96f26);
  border-radius: 26px;
  color: #fff;
}
.hs-noepc-hero-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.hs-noepc-hero-pin {
  font-size: 16px;
  opacity: 0.9;
}
.hs-noepc-hero-meta {
  font-size: 13.5px;
  opacity: 0.9;
  margin: 4px 0 14px;
}
.hs-noepc-hero-hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-bottom: 14px;
}
.hs-noepc-hero-tiles {
  display: flex;
  gap: 10px;
}
.hs-noepc-hero-tile {
  flex: 1;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  padding: 14px;
}
.hs-noepc-hero-tile-lbl {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 10px;
}
.hs-noepc-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 7px;
  font-weight: 800;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.hs-noepc-hero-tile-big {
  font-size: 24px;
  font-weight: 800;
}
.hs-noepc-hero-tile-big small {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.8;
}
.hs-noepc-hero-tile-cap {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 8px;
}

.hs-noepc-cta {
  margin: 14px 20px 0;
  padding: 22px 20px;
  background: #2e2a50;
  border-radius: 26px;
  color: #fff;
}
.hs-noepc-cta-title {
  font-size: 19px;
  font-weight: 800;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}
.hs-noepc-cta-body {
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.45;
}
.hs-noepc-cta-body :deep(b) {
  color: #fff;
  font-weight: 700;
}
.hs-noepc-cta-btn {
  display: block;
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  text-align: center;
  background: #fff;
  color: #2e2a50;
  margin-top: 16px;
}
.hs-noepc-cta-btn:active {
  transform: scale(0.99);
}
.hs-noepc-cta-note {
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
  margin-top: 10px;
}

.hs-noepc-info {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin: 14px 24px 0;
  padding: 12px 14px;
  background: var(--card);
  border-radius: 14px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
  box-shadow: var(--shadow-card);
}
.hs-noepc-info-i {
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1.5px solid var(--text-secondary);
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
  font-weight: 700;
}
.hs-noepc-info :deep(b) {
  color: var(--text);
  font-weight: 700;
}
.hs-noepc-secondary {
  display: block;
  margin: 14px 24px 24px;
  padding: 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-dark);
  text-decoration: none;
  background: transparent;
}

/* ── Claim-it-free modal ────────────────────────────────────── */
.claim-overlay {
  /* Re-declare design tokens locally — the modal is teleported to
     <body> so it loses access to the CSS custom properties defined on
     `.hs-v6-score`. Without these, the white sheet renders transparent. */
  --accent: #00a19a;
  --accent-dark: #008a84;
  --accent-pale: #e5f4f2;
  --accent-paler: #f2faf8;
  --bg: #f5f6fa;
  --card: #ffffff;
  --text: #231d45;
  --text-secondary: #6b7089;
  --text-faint: #a8a9ad;
  --border: #e4e5ed;
  --border-soft: #f0f1f5;
  --shadow-card: 0 2px 8px rgba(35, 29, 69, 0.05);

  position: fixed;
  inset: 0;
  background: rgba(35, 29, 69, 0.55);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  backdrop-filter: blur(2px);
  /* Match the app font (Plus Jakarta Sans). Teleported overlays break the
     inherit chain, so the full stack is re-declared here. */
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--text);
}
.claim-sheet {
  width: 100%;
  max-width: 28rem;
  background: var(--card);
  border-radius: 22px 22px 0 0;
  padding: 10px 20px calc(22px + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 32px rgba(35, 29, 69, 0.25);
  max-height: 90dvh;
  overflow-y: auto;
}
.claim-grip {
  width: 40px;
  height: 4px;
  border-radius: 100px;
  background: var(--border);
  margin: 0 auto 14px;
}
.claim-icon {
  font-size: 40px;
  line-height: 1;
  display: grid;
  place-items: center;
  color: var(--accent-dark);
  margin-bottom: 8px;
}
.claim-title {
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.4px;
  text-align: center;
  margin-bottom: 6px;
}
.claim-sub {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
  line-height: 1.55;
  text-align: center;
  margin-bottom: 16px;
}
.claim-sub :deep(b) {
  color: var(--text);
  font-weight: 700;
}
.claim-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.claim-step {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  background: var(--bg);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
}
.claim-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.claim-step-body { flex: 1; min-width: 0; }
.claim-step-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}
.claim-step-sub {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
}
.claim-cta-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.claim-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}
.claim-btn.ghost {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}
.claim-btn.primary {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  box-shadow: 0 3px 12px rgba(0, 161, 154, 0.25);
}
.claim-privacy {
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-faint);
}
.claim-modal-enter-active,
.claim-modal-leave-active {
  transition: opacity 0.2s ease;
}
.claim-modal-enter-active .claim-sheet,
.claim-modal-leave-active .claim-sheet {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.claim-modal-enter-from,
.claim-modal-leave-to {
  opacity: 0;
}
.claim-modal-enter-from .claim-sheet,
.claim-modal-leave-to .claim-sheet {
  transform: translateY(100%);
}

/* ── Desktop: present as a centred dialog, not a phone bottom-sheet ──
   On ≥768px the overlay centres its sheet, all corners round, the drag
   grip (a touch affordance) is hidden, and the entrance becomes a gentle
   scale-fade instead of a full slide-up from the bottom edge. */
@media (min-width: 768px) {
  .claim-overlay {
    align-items: center;
    padding: 32px;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  .claim-sheet {
    max-width: 460px;
    border-radius: 24px;
    padding: 28px 30px 30px;
    max-height: min(88dvh, 760px);
    box-shadow:
      0 32px 72px -20px rgba(35, 29, 69, 0.4),
      0 12px 28px -12px rgba(35, 29, 69, 0.22);
  }
  .claim-grip {
    display: none;
  }
  .claim-modal-enter-from .claim-sheet,
  .claim-modal-leave-to .claim-sheet {
    transform: translateY(14px) scale(0.97);
  }
}

/* ── Street hero card (1:1 with `.hero` in umu-owner-journey
   prototype, lines 63-78). Sits below the bills/CO₂ strip and opens
   the same street drill-down panel on tap. ─────────────────────── */
.hs-street-hero {
  position: relative;
  overflow: hidden;
  margin: 12px 20px 0;
  padding: 17px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 88% 12%, rgba(25, 199, 166, 0.22), transparent 42%),
    radial-gradient(circle at 10% 90%, rgba(193, 138, 56, 0.14), transparent 40%),
    linear-gradient(150deg, #231D45, #33285C);
  color: #fff;
  box-shadow: 0 14px 34px rgba(20, 14, 50, 0.45);
  cursor: pointer;
}
.hs-street-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 1px, transparent 1px, transparent 22px);
  pointer-events: none;
}
.hs-street-hero > * { position: relative; z-index: 1; }
.hs-street-hero.active {
  box-shadow: 0 0 0 2px rgba(0, 161, 154, 0.5), 0 14px 34px rgba(20, 14, 50, 0.45);
}

.hsh-eyebrow {
  font-size: 10px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  font-weight: 800;
  color: #9DEFDB;
}
.hsh-rankrow {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-top: 8px;
}
.hsh-big {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 0.9;
}
.hsh-rmeta b {
  font-size: 13px;
  font-weight: 700;
}
.hsh-rmeta p {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1px;
}

.hsh-preview {
  position: relative;
  margin: 14px 0 3px;
  height: 54px;
}
.hsh-road {
  position: absolute;
  left: 0;
  right: 0;
  top: 27px;
  height: 11px;
  background: #15102E;
  border-radius: 3px;
}
.hsh-road::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  border-top: 2px dashed rgba(232, 163, 58, 0.55);
}
.hsh-ph {
  position: absolute;
  width: 22px;
  height: 20px;
  border-radius: 4px 4px 2px 2px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.hsh-ph::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -1px;
  right: -1px;
  height: 8px;
  background: inherit;
  clip-path: polygon(0 100%, 50% 0, 100% 100%);
}
.hsh-cd {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}
.hsh-ph.you {
  width: 28px;
  height: 26px;
  background: #9DEFDB;
  box-shadow: 0 0 0 4px rgba(25, 199, 166, 0.3);
  animation: hshPulse 2.2s ease-out infinite;
}
.hsh-ph.you .hsh-pin {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
}
@keyframes hshPulse {
  0%   { box-shadow: 0 0 0 0 rgba(25, 199, 166, 0.4); }
  70%  { box-shadow: 0 0 0 11px rgba(25, 199, 166, 0); }
  100% { box-shadow: 0 0 0 0 rgba(25, 199, 166, 0); }
}

.hsh-projchip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  font-size: 11.5px;
  font-weight: 800;
  color: #0c1f1a;
  background: linear-gradient(135deg, #9DEFDB, #19C7A6);
  padding: 6px 12px;
  border-radius: 99px;
}

.hsh-cta {
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  margin-top: 13px;
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #231D45;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}
.hsh-cta::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  background: linear-gradient(100deg, transparent, rgba(25, 199, 166, 0.25), transparent);
  transform: translateX(-200%) skewX(-18deg);
  animation: hshSheen 4.4s ease-in-out 1.2s infinite;
}
.hsh-cta-ar {
  animation: hshNudge 1.5s ease-in-out infinite;
}
@keyframes hshSheen {
  0%        { transform: translateX(-200%) skewX(-18deg); }
  30%, 100% { transform: translateX(360%) skewX(-18deg); }
}
@keyframes hshNudge {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(4px); }
}
@media (prefers-reduced-motion: reduce) {
  .hsh-cta::after,
  .hsh-cta-ar,
  .hsh-ph.you { animation: none; }
}

/* ═══════════════════════════════════════════════════════════════════
   NEW DESIGN — HomeScore report (desktop-first, matches Figma spec)
   Scoped under .hs-v6-score; neutralises the legacy 2-col grid when the
   redesigned report (.nd-report) is present.
   ═══════════════════════════════════════════════════════════════════ */
.hs-v6-score:has(.nd-report) {
  display: block;
  max-width: none;
  margin: 0;
  padding: 0;
  background: #f3f2ef;
  /* Contain the full-bleed street band's 100vw so it can't add a
     horizontal scrollbar (100vw includes the vertical scrollbar width). */
  overflow-x: clip;
}
.nd-report {
  max-width: 1120px;
  margin: 0 auto;
  padding: 30px 24px 52px;
  display: flex;
  flex-direction: column;
  gap: 34px;
  color: #231d45;
  box-sizing: border-box;
}
.nd-report *,
.nd-report *::before,
.nd-report *::after { box-sizing: border-box; }

/* ── Shared eyebrow ─────────────────────────────────────────────── */
.nd-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--accent-dark);
}
.nd-eyebrow--teal { color: #4fe0d3; }

/* ═══════════ HERO ═══════════ */
.nd-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
  gap: 34px;
  align-items: start;
}
.nd-hero-main { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.nd-hero-title {
  margin: 0;
  font-size: clamp(30px, 4.4vw, 46px);
  font-weight: 800;
  line-height: 1.03;
  letter-spacing: -0.02em;
  color: #231d45;
}
.nd-hero-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.nd-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: 0 1px 2px rgba(35, 29, 69, 0.04);
}
.nd-chip svg { width: 14px; height: 14px; opacity: 0.7; }
.nd-chip--epc { padding-left: 6px; color: #231d45; }
.nd-chip-grade {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
}
.nd-hero-social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
}
.nd-social { display: inline-flex; align-items: center; gap: 7px; }
.nd-social b { font-weight: 700; color: #231d45; }
.nd-social-sep { color: var(--text-faint); }
.nd-social-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--text-faint);
}
.nd-social-dot.is-live {
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.18);
}

/* Claim card */
.nd-claim {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 4px;
  padding: 20px 20px;
  border: none;
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  color: #fff;
  background:
    radial-gradient(120% 160% at 100% 0%, rgba(0, 161, 154, 0.55), transparent 60%),
    linear-gradient(135deg, #2a2350, #1a1540);
  box-shadow: 0 14px 34px rgba(26, 21, 64, 0.28);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}
.nd-claim:hover { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(26, 21, 64, 0.34); }
.nd-claim-text { flex: 1; min-width: 0; }
.nd-claim-title { font-size: 16px; font-weight: 700; }
.nd-claim-sub { margin-top: 3px; font-size: 13px; color: rgba(255, 255, 255, 0.7); }
.nd-claim-link { margin-top: 9px; font-size: 12.5px; font-weight: 600; color: #4fe0d3; }
.nd-claim-arrow {
  flex-shrink: 0;
  width: 44px; height: 44px;
  display: grid; place-items: center;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
}
.nd-claim-arrow svg { width: 20px; height: 20px; }

/* Score card */
.nd-scorecard {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  border: 1px solid var(--accent-dark);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 18px 44px rgba(0, 138, 132, 0.28);
}
/* Teal card → flip contents to light so they stay legible on the gradient */
.nd-scorecard .nd-scorecard-mark { color: rgba(255, 255, 255, 0.82); }
.nd-scorecard .nd-ring-bg { stroke: rgba(255, 255, 255, 0.22); }
.nd-scorecard .nd-ring-fill { stroke: #fff; }
.nd-scorecard .nd-ring-big { color: #fff; }
.nd-scorecard .nd-ring-small { color: rgba(255, 255, 255, 0.78); }
.nd-scorecard .nd-scorecard-band { color: #fff; }
.nd-scorecard .nd-scorecard-copy { color: rgba(255, 255, 255, 0.9); }
.nd-scorecard .nd-scorecard-copy b { color: #fff; }
.nd-scorecard .nd-scorecard-foot { color: rgba(255, 255, 255, 0.78); border-top-color: rgba(255, 255, 255, 0.22); }
.nd-scorecard .nd-scorecard-foot b { color: #fff; }
.nd-scorecard-top { display: flex; align-items: center; justify-content: space-between; }
.nd-scorecard-mark {
  font-size: 11px; font-weight: 800; letter-spacing: 0.16em;
  color: var(--text-secondary); text-transform: uppercase;
}
.nd-scorecard-tag {
  font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em;
  text-transform: uppercase; padding: 5px 10px; border-radius: 999px;
}
.nd-scorecard-tag.good { background: #e2f5f0; color: #067a72; }
.nd-scorecard-tag.mid { background: #fff3db; color: #8a5a00; }
.nd-scorecard-tag.low { background: #fdefd6; color: #8a5a00; }
.nd-scorecard-body { display: flex; align-items: center; gap: 18px; margin-top: 16px; }
.nd-ring { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
.nd-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.nd-ring-bg { fill: none; stroke: #eceef3; }
.nd-ring-fill { transition: stroke-dashoffset 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
.nd-ring-num {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.nd-ring-big { font-size: 38px; font-weight: 800; line-height: 1; color: #231d45; }
.nd-ring-small { margin-top: 3px; font-size: 10px; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.04em; }
.nd-scorecard-info { min-width: 0; }
.nd-scorecard-band {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  font-size: 18px; font-weight: 700; color: #231d45;
}
.nd-grade-flow { display: inline-flex; align-items: center; gap: 4px; }
.nd-grade-arrow { font-size: 13px; font-weight: 800; line-height: 1; color: rgba(255, 255, 255, 0.85); }
.nd-grade-pill {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 5px;
  border-radius: 6px; font-size: 12px; font-weight: 800; color: #fff;
}
.nd-scorecard-copy { margin-top: 8px; font-size: 13px; line-height: 1.5; color: var(--text-secondary); }
.nd-scorecard-copy b { color: #231d45; font-weight: 700; }
.nd-scorecard-foot {
  display: flex; align-items: flex-start; gap: 8px;
  margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-soft);
  font-size: 11.5px; line-height: 1.45; color: var(--text-faint);
}
.nd-scorecard-foot svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
.nd-scorecard-foot b { color: var(--text-secondary); font-weight: 700; }

/* ═══════════ NO-EPC PATH ═══════════ */
.nd-noepc-info {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 4px;
  padding: 15px 17px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--text-secondary);
}
.nd-noepc-info-ico {
  flex-shrink: 0;
  width: 30px; height: 30px;
  display: grid; place-items: center;
  border-radius: 9px;
  background: var(--accent-pale);
  color: var(--accent-dark);
}
.nd-noepc-info-ico svg { width: 17px; height: 17px; }
.nd-noepc-info b { color: var(--text); font-weight: 700; }

.nd-noepc-card {
  position: sticky;
  top: 88px;
  padding: 26px;
  border-radius: 20px;
  color: #fff;
  background:
    radial-gradient(120% 150% at 100% 0%, rgba(0, 161, 154, 0.5), transparent 58%),
    linear-gradient(135deg, #2a2350, #1a1540);
  box-shadow: 0 18px 44px rgba(26, 21, 64, 0.3);
}
.nd-noepc-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}
.nd-noepc-card-badge svg { width: 14px; height: 14px; }
.nd-noepc-card-title {
  margin: 16px 0 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #fff;
}
.nd-noepc-card-body {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.78);
}
.nd-noepc-card-body b { color: #fff; font-weight: 700; }
.nd-noepc-card-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  padding: 16px 22px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-light), var(--accent-dark));
  box-shadow: 0 12px 28px rgba(0, 161, 154, 0.4);
  transition: transform 0.16s, filter 0.16s, box-shadow 0.16s;
}
.nd-noepc-card-btn:hover { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 16px 34px rgba(0, 161, 154, 0.5); }
.nd-noepc-card-btn svg { width: 18px; height: 18px; }
.nd-noepc-card-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}
.nd-noepc-card-note svg { width: 13px; height: 13px; }
.nd-noepc-card-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 13px;
  font-weight: 600;
  color: #4fe0d3;
  text-decoration: none;
  transition: color 0.14s;
}
.nd-noepc-card-link:hover { color: #7ff0e5; }
.nd-noepc-card-link svg { width: 15px; height: 15px; }

/* ═══════════ GENERIC BLOCK ═══════════ */
.nd-block { display: flex; flex-direction: column; gap: 16px; }
.nd-block-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.nd-taplink {
  border: none; background: none; cursor: pointer;
  font-size: 12.5px; font-weight: 600; color: var(--text-secondary);
}
.nd-taplink:hover { color: var(--accent-dark); }

/* ═══════════ RUNNING COSTS ═══════════ */
.nd-cost-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nd-cost {
  position: relative;
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
  padding: 22px 22px 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--shadow-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.nd-cost:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(35, 29, 69, 0.1); border-color: #d7d9e4; }
.nd-cost-arrow { position: absolute; top: 16px; right: 18px; font-size: 15px; color: var(--text-faint); }
.nd-cost-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-secondary);
}
.nd-cost-eyebrow svg { width: 15px; height: 15px; color: var(--accent-dark); }
.nd-cost-eyebrow-ico { font-size: 15px; line-height: 1; display: inline-grid; place-items: center; color: var(--accent-dark); }
.nd-cost-num { font-size: 34px; font-weight: 800; line-height: 1; color: #231d45; }
.nd-cost-num span { font-size: 15px; font-weight: 600; color: var(--text-faint); margin-left: 2px; }
.nd-cost-pill {
  padding: 5px 11px; border-radius: 999px;
  background: #e4f5ec; color: #1f8f57;
  font-size: 12px; font-weight: 700;
}
.nd-cost-sub { font-size: 12.5px; font-weight: 500; color: var(--text-secondary); }
.nd-cost.active { border-color: var(--accent); box-shadow: 0 12px 26px rgba(0, 161, 154, 0.14); }
.nd-cost-more {
  display: inline-flex; align-items: center; gap: 5px; margin-top: 2px;
  font-size: 12px; font-weight: 700; color: var(--accent-dark);
}
.nd-cost-more-chev { transition: transform 0.18s ease; font-size: 15px; }
.nd-cost-more-chev.open { transform: rotate(90deg); }

/* Breakdown panel */
.nd-cost-panel {
  margin-top: -4px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: var(--shadow-card);
  animation: nd-cost-open 0.24s ease;
}
@keyframes nd-cost-open { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
.nd-cost-panel-head { padding-bottom: 14px; margin-bottom: 12px; border-bottom: 1px solid var(--border-soft); }
.nd-cost-panel-title { font-size: 15px; font-weight: 700; color: #231d45; }
.nd-cost-panel-sub { margin-top: 3px; font-size: 12.5px; color: var(--text-secondary); }
.nd-cost-bar {
  display: grid;
  grid-template-columns: 24px minmax(66px, auto) 1fr auto;
  align-items: center; gap: 12px; padding: 8px 0;
}
.nd-cost-bar-ico { font-size: 16px; display: grid; place-items: center; color: var(--accent-dark); }
.nd-cost-bar-label { font-size: 13px; font-weight: 600; color: #231d45; }
.nd-cost-bar-track { height: 8px; border-radius: 999px; background: #eceef3; overflow: hidden; }
.nd-cost-bar-fill { display: block; height: 100%; border-radius: 999px; transition: width 0.5s ease; }
.nd-cost-bar-fill.heat { background: #e6a23c; }
.nd-cost-bar-fill.hw { background: #00a19a; }
.nd-cost-bar-fill.light { background: #7c6fe0; }
.nd-cost-bar-fill.uk { background: #b9bccb; }
.nd-cost-bar-fill.good { background: #2eab55; }
.nd-cost-bar-amt { text-align: right; font-size: 14px; font-weight: 800; color: #231d45; white-space: nowrap; }
.nd-cost-bar-amt i { display: block; font-style: normal; font-size: 10px; font-weight: 600; color: var(--text-faint); }
.nd-cost-total {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--border-soft);
  font-size: 13px; font-weight: 600; color: var(--text-secondary);
}
.nd-cost-total-num { font-size: 17px; font-weight: 800; color: #231d45; }
.nd-cost-note { margin-top: 12px; font-size: 11.5px; line-height: 1.5; color: var(--text-faint); }
.nd-cost-note b { color: var(--text-secondary); font-weight: 700; }
.nd-cost-equiv {
  display: flex; align-items: center; gap: 10px; margin-top: 12px;
  padding: 11px 14px; border-radius: 12px; background: var(--accent-paler);
  font-size: 12.5px; line-height: 1.4; color: var(--text-secondary);
}
.nd-cost-equiv b { color: #231d45; font-weight: 700; }
.nd-cost-equiv-ico { font-size: 18px; display: inline-grid; place-items: center; color: var(--accent-dark); }
.nd-cost-foot {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; margin-top: 14px; padding: 13px 16px;
  border: none; border-radius: 12px; cursor: pointer; text-align: left;
  background: var(--primary); color: #fff;
  font-size: 13px; font-weight: 600;
  transition: transform 0.15s ease;
}
.nd-cost-foot:hover { transform: translateY(-2px); }
.nd-cost-foot b { font-weight: 800; }
.nd-cost-foot-arrow { font-size: 16px; }

/* ═══════════ STREET (navy) ═══════════ */
.nd-street {
  /* Full-bleed band: break out of the centred 1120px container so the navy
     stretches edge to edge, while .nd-street-inner keeps content aligned
     with every other section. */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  border-radius: 0;
  background:
    radial-gradient(140% 120% at 85% 0%, rgba(0, 161, 154, 0.28), transparent 55%),
    linear-gradient(160deg, #2a2352, #1a1540 70%);
  color: #fff;
  overflow: hidden;
}
.nd-street-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 44px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
/* Collapsible detail — hidden until "Explore your street map" is tapped,
   then expands the ranked house grid inline (mobile-app screen 22). */
.nd-street-detail {
  display: flex;
  flex-direction: column;
  gap: 22px;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-6px);
  /* cancel the parent flex gap on both sides while collapsed so the summary
     and footer sit tight together */
  margin: -11px 0;
  transition:
    max-height 0.55s ease,
    opacity 0.4s ease,
    transform 0.4s ease,
    margin 0.4s ease;
}
.nd-street-detail.open {
  max-height: 3000px;
  opacity: 1;
  transform: none;
  margin: 0;
}
.nd-street-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
.nd-street-title { margin: 12px 0 8px; font-size: clamp(24px, 3vw, 34px); font-weight: 800; line-height: 1.06; letter-spacing: -0.02em; }
.nd-street-meta { font-size: 13px; color: rgba(255, 255, 255, 0.55); }
.nd-street-rank { text-align: right; flex-shrink: 0; }
.nd-street-rank-big { font-size: 56px; font-weight: 800; line-height: 0.9; color: #2ee6d6; }
.nd-street-rank-sub { margin-top: 6px; font-size: 14px; font-weight: 700; }
.nd-street-rank-note { margin-top: 3px; font-size: 12px; color: rgba(255, 255, 255, 0.5); }

.nd-street-rankchip {
  display: inline-flex; align-items: center; gap: 14px;
  align-self: flex-start;
  padding: 12px 18px; border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.nd-street-rankchip-num { font-size: 26px; font-weight: 800; color: #2ee6d6; }
.nd-street-rankchip-text { display: flex; flex-direction: column; gap: 2px; }
.nd-street-rankchip-text b { font-size: 13.5px; font-weight: 700; }
.nd-street-rankchip-text span { font-size: 12px; color: rgba(255, 255, 255, 0.55); }

.nd-street-legendrow { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.nd-street-legend { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: rgba(255, 255, 255, 0.7); }
.nd-street-legend span { display: inline-flex; align-items: center; gap: 6px; }
.nd-street-legend i { width: 9px; height: 9px; border-radius: 50%; }
.nd-street-projchip {
  border: none; cursor: pointer;
  padding: 8px 14px; border-radius: 999px;
  background: rgba(0, 161, 154, 0.22);
  border: 1px solid rgba(46, 230, 214, 0.4);
  color: #4fe0d3; font-size: 12.5px; font-weight: 700;
}
.nd-street-projchip:hover { background: rgba(0, 161, 154, 0.34); }

.nd-street-scene { background: rgba(0, 0, 0, 0.16); border-radius: 16px; padding: 6px; }
.nd-street-scroll { overflow-x: auto; border-radius: 12px; -webkit-overflow-scrolling: touch; }
.nd-street-svg { display: block; width: 100%; min-width: 560px; height: auto; }
.nd-house { cursor: pointer; }
.nd-house rect, .nd-house polygon { transition: opacity 0.15s ease; }
.nd-house:hover:not(.you) { opacity: 0.85; }
.nd-walker { transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1); }
.nd-walker rect { transform-box: fill-box; transform-origin: top center; }
@media (prefers-reduced-motion: no-preference) {
  .nd-walker-leg-l, .nd-walker-arm-r { animation: nd-step 0.5s ease-in-out infinite; }
  .nd-walker-leg-r, .nd-walker-arm-l { animation: nd-step 0.5s ease-in-out infinite reverse; }
}
@keyframes nd-step { 0%, 100% { transform: rotate(13deg); } 50% { transform: rotate(-13deg); } }
.nd-street-hints { display: flex; justify-content: space-between; gap: 10px; padding: 8px 6px 2px; font-size: 11px; color: rgba(255, 255, 255, 0.45); }

.nd-street-bottom { display: grid; grid-template-columns: minmax(200px, 0.8fr) minmax(0, 1.4fr); gap: 16px; }
.nd-street-you {
  padding: 16px 18px; border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; flex-direction: column; justify-content: center; gap: 8px;
}
.nd-street-you.isyou { border-color: rgba(46, 230, 214, 0.4); }
.nd-street-you-row { display: flex; align-items: center; gap: 10px; }
.nd-street-you-label { font-size: 14px; font-weight: 700; }
.nd-street-you-grade { padding: 3px 8px; border-radius: 6px; font-size: 11.5px; font-weight: 800; color: #fff; }
.nd-street-you-cost { font-size: 26px; font-weight: 800; }
.nd-street-you-cost span { font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.5); margin-left: 2px; }
.nd-street-proj {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 20px; border-radius: 14px; cursor: pointer; text-align: left;
  background: #fff; border: none; color: #231d45;
  transition: transform 0.15s ease;
}
.nd-street-proj:hover { transform: translateY(-2px); }
.nd-street-proj-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--accent-dark);
}
.nd-street-proj-eyebrow svg { width: 14px; height: 14px; }
.nd-street-proj-num { margin-top: 6px; font-size: 28px; font-weight: 800; line-height: 1; }
.nd-street-proj-num span { font-size: 13px; font-weight: 600; color: var(--text-faint); }
.nd-street-proj-sub { margin-top: 5px; font-size: 12px; color: var(--text-secondary); }
.nd-street-proj-sub b { color: #231d45; font-weight: 700; }
.nd-street-proj-save { text-align: right; flex-shrink: 0; padding-left: 16px; border-left: 1px solid var(--border); }
.nd-street-proj-save-num { font-size: 24px; font-weight: 800; color: #1f8f57; }
.nd-street-proj-save-sub { font-size: 11px; color: var(--text-secondary); }

.nd-street-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.nd-street-foot-note { font-size: 12px; color: rgba(255, 255, 255, 0.6); max-width: 62%; }
.nd-street-foot-ico { color: #2ee6d6; font-size: 13px; vertical-align: -2px; }
.nd-street-foot-note b { color: #fff; font-weight: 700; }
.nd-street-foot-btn {
  border: none; cursor: pointer; white-space: nowrap;
  padding: 11px 18px; border-radius: 999px;
  background: #fff; color: #231d45; font-size: 13px; font-weight: 700;
  transition: transform 0.15s ease;
}
.nd-street-foot-btn:hover { transform: translateY(-2px); }

/* ═══════════ EPC STATS ═══════════ */
.nd-stats-grid { display: grid; grid-template-columns: minmax(200px, 0.5fr) minmax(0, 1fr); gap: 30px; align-items: start; }
.nd-stats-intro { padding-top: 6px; }
.nd-stats-title { margin: 14px 0 12px; font-size: clamp(26px, 3.2vw, 38px); font-weight: 800; line-height: 1.04; letter-spacing: -0.02em; color: #231d45; }
.nd-stats-link { border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 700; color: var(--accent-dark); padding: 0; }
.nd-stats-card {
  background: #fff; border: 1px solid var(--border); border-radius: 18px;
  padding: 6px 8px; box-shadow: var(--shadow-card);
}
.nd-stat-row {
  display: grid;
  grid-template-columns: 34px minmax(78px, auto) 1fr auto 14px;
  align-items: center; gap: 14px;
  padding: 15px 14px; cursor: pointer; border-radius: 12px;
  transition: background 0.14s ease;
}
.nd-stat-row + .nd-stat-row { border-top: 1px solid var(--border-soft); }
.nd-stat-row:hover { background: var(--accent-paler); }
.nd-stat-icon {
  width: 34px; height: 34px; display: grid; place-items: center;
  border-radius: 10px; background: var(--accent-pale); font-size: 18px;
  color: var(--accent-dark);
}
.nd-stat-label { font-size: 14px; font-weight: 600; color: #231d45; }
.nd-stat-track { height: 7px; border-radius: 999px; background: #eceef3; overflow: hidden; }
.nd-stat-fill { display: block; height: 100%; border-radius: 999px; background: var(--accent); transition: width 0.6s ease; }
.nd-stat-fill.high { background: var(--accent); }
.nd-stat-fill.mid { background: var(--warning); }
.nd-stat-fill.low { background: var(--error); }
.nd-stat-val { font-size: 14px; font-weight: 800; color: #231d45; white-space: nowrap; }
.nd-stat-val i { font-style: normal; font-weight: 600; color: var(--text-faint); }
.nd-stat-chev { color: var(--text-faint); font-size: 18px; transition: transform 0.18s ease; }
.nd-stat-row.open { background: var(--accent-paler); }
.nd-stat-row.open .nd-stat-chev { transform: rotate(90deg); color: var(--accent-dark); }

/* Inline stat detail (EPC steps / saving / cost lines / pathway foot) */
.nd-stat-expand {
  margin: 2px 6px 10px;
  padding: 14px;
  background: var(--accent-paler);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  animation: ndStatExpand 0.22s ease;
}
@keyframes ndStatExpand {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: none; }
}
.nd-stat-expand-meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; }
.nd-stat-expand-tile {
  background: #fff; border: 1px solid var(--border-soft); border-radius: 10px;
  padding: 10px 12px; text-align: center;
}
.nd-stat-expand-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-faint); }
.nd-stat-expand-num { margin-top: 4px; font-size: 20px; font-weight: 800; color: #231d45; }
.nd-stat-expand-num i { font-style: normal; font-size: 11px; font-weight: 600; color: var(--text-secondary); }
.nd-stat-expand-num.save { color: var(--accent-dark); }
.nd-stat-expand-num.cost { color: var(--warning); }
.nd-stat-expand-sub { margin-top: 2px; font-size: 11px; color: var(--text-secondary); }
.nd-stat-line {
  display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 12px;
  padding: 10px 4px; border-top: 1px solid var(--border-soft);
}
.nd-stat-line-bullet {
  width: 28px; height: 28px; display: grid; place-items: center;
  border-radius: 8px; background: #fff; border: 1px solid var(--border-soft); font-size: 15px;
  color: var(--accent-dark);
}
.nd-stat-line-title { font-size: 13.5px; font-weight: 700; color: #231d45; }
.nd-stat-line-sub { font-size: 12px; color: var(--text-secondary); margin-top: 1px; }
.nd-stat-line-sub b { color: #231d45; font-weight: 700; }
.nd-stat-line-amt { text-align: right; white-space: nowrap; }
.nd-stat-line-amt-big { font-size: 14px; font-weight: 800; color: #231d45; }
.nd-stat-line-amt-sub { font-size: 10.5px; color: var(--text-faint); }
.nd-stat-expand-foot {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  margin-top: 10px; padding: 11px 14px; border: none; cursor: pointer;
  background: #231d45; color: #fff; border-radius: 10px; text-align: left;
  transition: transform 0.14s ease;
}
.nd-stat-expand-foot:hover { transform: translateY(-1px); }
.nd-stat-expand-foot-text { font-size: 12.5px; }
.nd-stat-expand-foot-text b { font-weight: 800; }
.nd-stat-expand-foot-arrow { font-size: 18px; flex-shrink: 0; }

/* ═══════════ FULL EPC BREAKDOWN ═══════════ */
.nd-epc { background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 8px; box-shadow: var(--shadow-card); }
.nd-epc-head {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 18px; border-bottom: 1px solid var(--border-soft); flex-wrap: wrap;
}
.nd-epc-head-icon {
  width: 40px; height: 40px; flex-shrink: 0; display: grid; place-items: center;
  border-radius: 12px; color: #fff;
  background: linear-gradient(135deg, #2a2350, #1a1540);
}
.nd-epc-head-icon svg { width: 20px; height: 20px; }
.nd-epc-head-text { flex: 1; min-width: 180px; }
.nd-epc-head-title { font-size: 16px; font-weight: 700; color: #231d45; }
.nd-epc-head-sub { margin-top: 2px; font-size: 12.5px; color: var(--text-secondary); }
.nd-epc-flow { display: flex; align-items: center; gap: 8px; }
.nd-epc-flow-grade {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 7px; color: #fff; font-size: 13px; font-weight: 800;
}
.nd-epc-flow-lbl { display: flex; flex-direction: column; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; color: var(--text-faint); text-transform: uppercase; line-height: 1.3; }
.nd-epc-flow-lbl b { font-size: 14px; color: #231d45; }
.nd-epc-flow-arrow { color: var(--text-faint); font-size: 15px; }
.nd-epc-flow-save { margin-left: 6px; padding-left: 12px; border-left: 1px solid var(--border); display: flex; flex-direction: column; font-size: 16px; font-weight: 800; color: #1f8f57; }
.nd-epc-flow-save i { font-style: normal; font-size: 10px; font-weight: 600; color: var(--text-secondary); }

.nd-epc-grid { display: grid; grid-template-columns: 1fr; gap: 0; padding: 8px; }
.nd-epc-item {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 14px 12px; border: none; background: none; cursor: pointer; text-align: left;
  border-radius: 10px; transition: background 0.14s ease;
  border-bottom: 1px solid var(--border-soft);
}
.nd-epc-item:last-of-type { border-bottom: none; }
.nd-epc-item:hover { background: var(--accent-paler); }
/* Open row connects visually to the full-width panel below it */
.nd-epc-item.open {
  background: var(--accent-paler); border-bottom-color: transparent;
  border-radius: 10px 10px 0 0;
}
.nd-epc-item-icon { width: 30px; height: 30px; flex-shrink: 0; display: grid; place-items: center; border-radius: 9px; background: #f4f5f8; font-size: 16px; color: var(--accent-dark); }
.nd-epc-item-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.nd-epc-item-title { font-size: 14px; font-weight: 700; color: #231d45; }
.nd-epc-item-sub { font-size: 11.5px; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nd-epc-item-rating { flex-shrink: 0; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; }
.nd-epc-item-rating.good { background: #e4f5ec; color: #1f8f57; }
.nd-epc-item-rating.average { background: #fff3db; color: #8a5a00; }
.nd-epc-item-rating.poor { background: #fcebea; color: #c73e36; }
.nd-epc-item-rating.nodata { background: #f1f2f6; color: var(--text-faint); }
.nd-epc-item-chev { flex-shrink: 0; color: var(--text-faint); font-size: 17px; transition: transform 0.18s ease; }
.nd-epc-item-chev.open { transform: rotate(90deg); }
.nd-epc-expand {
  grid-column: 1 / -1;
  margin: 0 0 10px; padding: 14px; border-radius: 0 0 12px 12px; background: var(--accent-paler);
}
.nd-epc-flag { padding: 12px 14px; border-radius: 10px; background: #fff5ec; border: 1px solid #ffe3cc; }
.nd-epc-flag.ok { background: #eef8f1; border-color: #d3ecdd; }
.nd-epc-flag-label { font-size: 11.5px; font-weight: 800; color: #b46a1e; }
.nd-epc-flag.ok .nd-epc-flag-label { color: #1f8f57; }
.nd-epc-flag-text { margin-top: 5px; font-size: 12.5px; line-height: 1.5; color: var(--text-secondary); }
.nd-epc-flag-text b { color: #231d45; font-weight: 700; }
.nd-epc-fix { margin-top: 10px; padding: 12px 14px; border-radius: 10px; background: #fff; border: 1px solid var(--border); }
.nd-epc-fix-label { font-size: 11.5px; font-weight: 800; color: var(--accent-dark); display: inline-flex; align-items: center; gap: 4px; }
.nd-epc-fix-ico { font-size: 13px; }
.nd-epc-fix-text { margin-top: 5px; font-size: 12.5px; line-height: 1.5; color: var(--text-secondary); }
.nd-epc-fix-text b { color: #231d45; font-weight: 700; }
.nd-epc-fix-action { display: inline-block; margin-top: 9px; font-size: 12.5px; font-weight: 700; color: var(--accent-dark); cursor: pointer; }

/* ═══════════ CONNECTION FORK ═══════════ */
.nd-fork { align-items: center; gap: 22px; margin-top: 6px; }
.nd-fork-title { margin: 0; text-align: center; font-size: clamp(22px, 2.8vw, 30px); font-weight: 800; letter-spacing: -0.02em; color: #231d45; }
.nd-fork-grid { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.nd-fork-grid--one { max-width: 520px; margin: 0 auto; grid-template-columns: 1fr; }
.nd-fork-grid--two { grid-template-columns: 1fr 1fr; }
.nd-fork-card {
  display: flex; align-items: center; gap: 14px;
  padding: 22px; border-radius: 16px; cursor: pointer; text-align: left;
  background: #fff; border: 1px solid var(--border); color: #231d45;
  box-shadow: var(--shadow-card);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.nd-fork-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(35, 29, 69, 0.12); }
.nd-fork-card.primary {
  color: #fff; border: none;
  background:
    radial-gradient(120% 160% at 100% 0%, rgba(46, 230, 214, 0.4), transparent 55%),
    linear-gradient(135deg, #00a19a, #007d77);
  box-shadow: 0 16px 34px rgba(0, 138, 132, 0.32);
}
.nd-fork-icon {
  width: 44px; height: 44px; flex-shrink: 0; display: grid; place-items: center;
  border-radius: 12px; font-size: 22px; background: var(--accent-pale);
  color: var(--accent-dark);
}
.nd-fork-card.primary .nd-fork-icon { background: rgba(255, 255, 255, 0.18); color: #fff; }
.nd-fork-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.nd-fork-h { font-size: 16px; font-weight: 700; }
.nd-fork-p { font-size: 12.5px; line-height: 1.4; color: var(--text-secondary); }
.nd-fork-card.primary .nd-fork-p { color: rgba(255, 255, 255, 0.82); }
.nd-fork-chev { flex-shrink: 0; font-size: 20px; color: var(--text-faint); }
.nd-fork-card.primary .nd-fork-chev { color: rgba(255, 255, 255, 0.9); }

/* ═══════════ RESPONSIVE ═══════════ */
@media (max-width: 900px) {
  .nd-report { padding: 20px 16px 40px; gap: 26px; }
  .nd-hero { grid-template-columns: 1fr; gap: 22px; }
  .nd-scorecard { order: -1; }
  .nd-noepc-card { position: static; }
  .nd-cost-grid { grid-template-columns: 1fr; }
  .nd-street-inner { padding: 24px 20px; }
  .nd-street-top { flex-direction: column; }
  .nd-street-rank { text-align: left; }
  .nd-street-bottom { grid-template-columns: 1fr; }
  .nd-street-foot-note { max-width: 100%; }
  .nd-stats-grid { grid-template-columns: 1fr; gap: 16px; }
  .nd-stats-title { font-size: 28px; }
  .nd-stats-title br { display: none; }
  .nd-epc-grid { grid-template-columns: 1fr; }
  .nd-epc-flow { width: 100%; }
  .nd-fork-grid, .nd-fork-grid--two { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .nd-hero-title { font-size: 28px; }
  .nd-scorecard-body { flex-direction: column; align-items: flex-start; }
  .nd-stat-row { grid-template-columns: 30px 1fr auto 12px; gap: 10px; }
  .nd-stat-track { grid-column: 1 / -1; order: 5; }
}
</style>
