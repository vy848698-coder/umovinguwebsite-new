<template>
  <div class="hs-page" :class="{ 'hs-page--web': screen === 'landing' || screen === 'loading' || screen === 'results' || screen === 'publish' || screen === 'kyc' || screen === 'kyc-pending' || screen === 'published' || screen === 'quick-wins' || screen === 'move-ready' || screen === 'buyer-results' || screen === 'passport' || screen === 'questions' || screen === 'no-epc-estimator' || screen === 'boost' || screen === 'level-up' }">
    <!-- Global header — hidden during quiz + post-quiz funnel screens, which
         each render their own top nav and amber address card. -->
    <!-- Global mobile header removed — every screen now renders its own web
         nav (or, for `loading`, just the spinner on the web canvas). -->

    <!-- Tour overlay (renders only when active) -->
    <TourCoach :tour="resultTour" />

    <!-- Property strip -->
    <!-- <div v-if="property" class="hs-prop-strip">
      <div class="hs-prop-dot" />
      <p class="hs-prop-address">
        {{ property.addressLine1 }}, {{ property.postcode }}
      </p>
      <span
        v-if="property.epcRating"
        class="hs-epc-chip"
        :style="{ background: epcColor(property.epcRating) }"
      >
        EPC {{ property.epcRating }}
      </span>
    </div> -->

    <!-- ── LOADING ──────────────────────────────────────────────── -->
    <template v-if="screen === 'loading'">
      <div class="hs-loading-wrap">
        <div class="hs-loading-ring" />
        <p class="hs-loading-label">Analysing property...</p>
      </div>
    </template>

    <!-- ── LANDING / AUTO SCORE — prototype-aligned (3a/3b/3c) ──── -->
    <template v-else-if="screen === 'landing'">
      <header class="hsw-nav">
        <div class="hsw-shell hsw-nav-inner">
          <button class="hsw-brand" type="button" @click="navigateTo('/')">
            <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
            <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
          </button>
          <nav class="hsw-links" aria-label="Primary navigation">
            <button type="button" @click="navigateTo('/explore')">Explore</button>
            <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </nav>
          <div class="hsw-actions">
            <button
              class="hsw-tour"
              type="button"
              title="How does this work?"
              aria-label="How does this work?"
              data-tour="tour-btn"
              @click="resultTour.restart()"
            >
              ?
            </button>
            <button class="hsw-back" type="button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              New search
            </button>
            <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
          </div>
        </div>
      </header>

      <V6ScoreView
        :property="property"
        :score="autoScoreVal"
        :epc-rating="property?.epcRating ?? null"
        :epc-year="resolvedEpcYear"
        :annual-cost="resolvedAnnualCost"
        :potential-saving="resolvedPotentialSaving"
        :co2-now="resolvedCo2Now"
        :co2-potential="resolvedCo2Potential"
        :bills-split="resolvedBillsSplit"
        :street-rank="streetEnergyRank?.rank ?? null"
        :street-total="streetEnergyRank?.total ?? null"
        :searches-today="searchStats?.today ?? 0"
        :watchers-count="(searchStats as any)?.watchers ?? 0"
        :passport-state="resolvedPassportState"
        :passport-progress-pct="passportProgressPct"
        :passport-sections-done="passportSectionsDone"
        :passport-sections-total="passportSectionsTotal"
        :auto-open-claim="autoOpenClaim"
        :is-logged-in="!isGuest"
        :is-property-owner="isPropertyOwner"
        @back="goBack"
        @claim="startQuestions"
        @refine="onRefineScore"
        @interested="goToBuyerView"
        @open-pathway="goToPathway"
        @open-dashboard="claimOrAccessPassport"
        @open-boost="goToBoost"
        @see-running-costs="goToRunningCosts"
        @see-street="goToStreetCompare"
        @view-passport="goToPassport"
        @buy-passport="goToBuyerView"
        @claim-passport="goToClaimPassport"
        @claim-modal-closed="autoOpenClaim = false"
      />
    </template>

    <!-- ── QUESTIONS — prototype-style: teal address card + live gauge ── -->
    <!-- ── OWNER QUIZ — exact clone V6QuizView ──────────────────── -->
    <template v-else-if="screen === 'questions'">
      <header class="hsw-nav">
        <div class="hsw-shell hsw-nav-inner">
          <button class="hsw-brand" type="button" @click="navigateTo('/')">
            <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
            <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
          </button>
          <nav class="hsw-links" aria-label="Primary navigation">
            <button type="button" @click="navigateTo('/explore')">Explore</button>
            <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </nav>
          <div class="hsw-actions">
            <button class="hsw-back" type="button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to score
            </button>
            <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
          </div>
        </div>
      </header>

      <V6QuizView
        :property="property"
        :initial-score="autoScoreVal"
        :epc-rating="property?.epcRating ?? null"
        :epc-year="resolvedEpcYear"
        :searches-today="searchStats?.today ?? 0"
        :watchers-count="(searchStats as any)?.watchers ?? 0"
        :passport-state="resolvedPassportState"
        :passport-progress-pct="passportProgressPct"
        :passport-sections-done="passportSectionsDone"
        :passport-sections-total="passportSectionsTotal"
        @back="goBack"
        @finish="onQuizFinish"
        @upload-bill="onUploadBill"
        @claim-passport="claimOrAccessPassport"
        @watch-property="goToBuyerView"
        @buy-passport="goToBuyerView"
      />
    </template>

    <!-- ── BOOST YOUR SCORE — exact clone V6BoostView ───────────── -->
    <template v-else-if="screen === 'boost'">
      <header class="hsw-nav">
        <div class="hsw-shell hsw-nav-inner">
          <button class="hsw-brand" type="button" @click="navigateTo('/')">
            <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
            <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
          </button>
          <nav class="hsw-links" aria-label="Primary navigation">
            <button type="button" @click="navigateTo('/explore')">Explore</button>
            <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </nav>
          <div class="hsw-actions">
            <button class="hsw-back" type="button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to score
            </button>
            <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
          </div>
        </div>
      </header>

      <V6BoostView
        :home-score="autoScoreVal"
        :public-epc-rating="property?.epcRating ?? null"
        :public-epc-score="(property as any)?.epcScore ?? null"
        :public-epc-year="resolvedEpcYear"
        :hide-back="true"
        @back="goBack"
        @open-marketplace="goToRunningCosts"
        @view-report="goToBuyerView"
        @start-passport="onBoostStartPassport"
      />
    </template>

    <!-- ── LEVEL UP — exact clone V6LevelUpView ─────────────────── -->
    <template v-else-if="screen === 'level-up'">
      <header class="hsw-nav">
        <div class="hsw-shell hsw-nav-inner">
          <button class="hsw-brand" type="button" @click="navigateTo('/')">
            <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
            <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
          </button>
          <nav class="hsw-links" aria-label="Primary navigation">
            <button type="button" @click="navigateTo('/explore')">Explore</button>
            <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </nav>
          <div class="hsw-actions">
            <button class="hsw-back" type="button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to score
            </button>
            <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
          </div>
        </div>
      </header>

      <V6LevelUpView
        :from-score="autoScoreVal"
        :to-score="v6QuizFinal?.finalScore ?? autoScoreVal"
        :delta="v6QuizFinal?.delta ?? 0"
        :hide-back="true"
        @back="goBack"
        @open-pathway="goToPathway"
        @open-boost="goToBoost"
      />
    </template>

    <!-- ── NO-EPC ESTIMATOR — exact clone V6NoEpcEstimator ──────── -->
    <template v-else-if="screen === 'no-epc-estimator'">
      <header class="hsw-nav">
        <div class="hsw-shell hsw-nav-inner">
          <button class="hsw-brand" type="button" @click="navigateTo('/')">
            <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
            <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
          </button>
          <nav class="hsw-links" aria-label="Primary navigation">
            <button type="button" @click="navigateTo('/explore')">Explore</button>
            <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
            <button type="button" @click="navigateTo('/passport')">Passport</button>
            <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
            <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
          </nav>
          <div class="hsw-actions">
            <button class="hsw-back" type="button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to score
            </button>
            <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
          </div>
        </div>
      </header>

      <V6NoEpcEstimator
        :property="property"
        @close="goBack"
        @book-assessment="onBookAssessment"
      />
    </template>

    <!-- ── legacy sim quiz (disabled — replaced by V6QuizView) ──── -->
    <template v-else-if="false">
      <div class="sim-root sim-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'landing'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell simw-main">
          <div class="simw-head">
            <p class="simw-kicker"><span class="simw-kicker-dot" />Accuracy check</p>
            <h1>Refine your HomeScore</h1>
            <p class="simw-lede">
              Tell us what's been done since the EPC — we'll score your home on reality, not old assumptions.
            </p>
          </div>

          <div class="simw-layout">
            <aside class="simw-aside">
        <!-- Amber address card — consistent with ResultDetail -->
        <div v-if="property" class="sim-addr-card">
          <div class="sim-addr-top">
            <div class="sim-addr-pin" />
            <div class="sim-addr-block">
              <div class="sim-addr-line">
                {{ property.addressLine1 || 'Your property' }}
              </div>
              <div class="sim-addr-meta">
                {{ property.postcode || '' }}
                <template v-if="property.propertyType">
                  · {{ property.propertyType }}</template
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Hero -->
        <div class="sim-hero">
          <div class="sim-hero-eyebrow">
            <span class="sim-live-dot" />HomeScore™ · Live
            <span class="sim-pts-badge">+{{ Math.max(0, Math.round(simScoreDeltaTotal)) }} pts</span>
          </div>
          <div class="sim-hero-body">
            Your EPC is from <b>{{ simEpcYear }}</b
            >. A lot may have changed. Tell us what's been done — we'll give you
            a score based on reality, not old assumptions. This also makes your
            street comparison more accurate.
          </div>
          <div class="sim-score-row">
            <div class="sim-score-dial">
              <svg viewBox="0 0 80 80">
                <circle
                  class="dial-bg"
                  cx="40"
                  cy="40"
                  r="32"
                  stroke-width="7"
                />
                <circle
                  class="dial-fill"
                  cx="40"
                  cy="40"
                  r="32"
                  stroke-width="7"
                  :stroke="simScoreColor"
                  stroke-dasharray="201.06"
                  :stroke-dashoffset="201.06 - (simScoreDisplay / 100) * 201.06"
                  style="
                    transition: stroke-dashoffset 0.5s
                      cubic-bezier(0.22, 1, 0.36, 1);
                  "
                />
              </svg>
              <div class="sim-score-label">
                <div class="sim-score-num">{{ simScoreDisplay }}</div>
                <div class="sim-score-denom">/ 100</div>
              </div>
            </div>
            <div class="sim-score-info">
              <div class="sim-score-band">{{ simScoreBand }}</div>
              <div v-if="simScore < 55" class="sim-score-aim">
                Aim for Level C (55+) to unlock the upgrade marketplace
              </div>
              <div v-else class="sim-score-aim sim-score-aim--hit">
                ✓ Level C reached — upgrade marketplace unlocked
              </div>
              <div class="sim-score-grade">
                {{
                  simAnsweredCount === 0
                    ? 'Answer below to update · earn XP for every question'
                    : `${simAnsweredCount} of ${simSteps.length} answered · earn XP`
                }}
              </div>
            </div>
          </div>
          <div class="sim-stats-row">
            <div class="sim-stat">
              <div class="sim-stat-label">Est. bills</div>
              <div
                class="sim-stat-val"
                :class="{ improved: simBillsDelta > 0 }"
              >
                £{{ simBillsDisplay.toLocaleString() }}
              </div>
              <div class="sim-stat-delta">
                <template v-if="simBillsDelta > 0"
                  >−£{{ simBillsDelta.toLocaleString() }}/yr</template
                >
              </div>
            </div>
            <div class="sim-stat">
              <div class="sim-stat-label">CO₂/yr</div>
              <div class="sim-stat-val" :class="{ improved: simCo2Delta > 0 }">
                {{ simCo2Display.toFixed(1) }}t
              </div>
              <div class="sim-stat-delta">
                <template v-if="simCo2Delta > 0"
                  >−{{ simCo2Delta.toFixed(1) }}t</template
                >
              </div>
            </div>
            <div class="sim-stat">
              <div class="sim-stat-label">vs neighbours</div>
              <div
                class="sim-stat-val"
                :style="{
                  fontSize: '12px',
                  color: simVsNeighbours > 0 ? '#C73E36' : '#00a19a',
                }"
              >
                <template v-if="simVsNeighbours > 0"
                  >£{{ simVsNeighboursDisplay }} more</template
                >
                <template v-else-if="simVsNeighbours < 0"
                  >£{{ Math.abs(simVsNeighboursDisplay) }} less</template
                >
                <template v-else>At average</template>
              </div>
              <div class="sim-stat-delta">vs street avg</div>
            </div>
          </div>
        </div>

            </aside>

            <div class="simw-content">
        <!-- Two paths — quiz vs bill upload -->
        <div class="sim-paths">
          <div class="sim-paths-eyebrow">Two ways to update your score</div>
          <div class="sim-paths-row">
            <div
              class="sim-path"
              :class="{ active: simPath === 'quiz' }"
              @click="simSelectPath('quiz')"
            >
              <div class="sim-path-icon">📋</div>
              <div class="sim-path-title">Answer questions</div>
              <div class="sim-path-sub">Work through the list below</div>
            </div>
            <div class="sim-paths-or">or</div>
            <div
              class="sim-path bill"
              :class="{ active: simPath === 'bill' }"
              @click="simSelectPath('bill')"
            >
              <div class="sim-path-icon">💡</div>
              <div class="sim-path-title">Upload a bill</div>
              <div class="sim-path-sub">Skip the questions</div>
            </div>
          </div>
        </div>

        <!-- Progress + step cards (collapsed when bill path is selected) -->
        <div v-show="simPath !== 'bill'" class="sim-questions-block">
          <div class="sim-progress-row">
            <div class="sim-progress-label">
              Has your home had these improvements?
            </div>
            <div class="sim-progress-count">
              {{ simAnsweredCount }} of {{ simSteps.length }} answered
            </div>
          </div>
          <div class="sim-progress-track">
            <div
              class="sim-progress-fill"
              :style="{ width: `${simProgressPct}%` }"
            />
          </div>

          <div class="sim-steps">
            <div
              v-for="(s, idx) in simSteps"
              :key="s.id"
              class="sim-step"
              :class="[s.status, { open: openStepId === s.id }]"
              @click="simToggleStep(s.id)"
            >
              <div class="sim-step-top">
                <div class="sim-step-num">{{ idx + 1 }}</div>
                <div class="sim-step-body">
                  <div class="sim-step-title">{{ s.title }}</div>
                  <div class="sim-step-meta">{{ s.meta }}</div>
                </div>
                <div class="sim-step-badge">{{ simBadge(s.status) }}</div>
              </div>
              <div class="sim-step-expand">
                <div class="sim-step-desc">{{ s.desc }}</div>
                <div class="sim-step-impact">✦ {{ s.impact }}</div>
                <div class="sim-step-question">{{ s.question }}</div>
                <div class="sim-step-btns">
                  <button
                    type="button"
                    class="sim-step-btn done"
                    @click.stop="simAnswer(s.id, 'done')"
                  >
                    ✅ {{ s.doneLabel || 'Yes — done' }}
                  </button>
                  <button
                    type="button"
                    class="sim-step-btn diff"
                    @click.stop="simOpenDiff(s.id)"
                  >
                    🔄 Done something different
                  </button>
                  <button
                    type="button"
                    class="sim-step-btn todo"
                    @click.stop="simAnswer(s.id, 'todo')"
                  >
                    📋 Not yet
                  </button>
                  <button
                    type="button"
                    class="sim-step-btn skip"
                    @click.stop="simAnswer(s.id, 'skip')"
                  >
                    ⊘ Not applicable
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill-upload confirmation — visible after bill path picked -->
        <div
          v-if="simPath === 'bill' && simBillUploaded"
          class="sim-bill-confirm"
        >
          <div class="sim-bill-emoji">✅</div>
          <div>
            <div class="sim-bill-title">
              <template
                v-if="
                  simParsedBill?.annualSpend && simParsedBill.annualSpend > 0
                "
              >
                Bill read — £{{ simParsedBill.annualSpend.toLocaleString() }}/yr
              </template>
              <template v-else>Bill uploaded — score updated</template>
            </div>
            <div class="sim-bill-sub">
              <template v-if="simParsedBill?.supplier">
                Supplier: <b>{{ simParsedBill.supplier }}</b
                ><template v-if="simParsedBill.annualSpend">
                  · your actual spend is now feeding your HomeScore.</template
                >
              </template>
              <template v-else>
                Your actual energy spend is now feeding your HomeScore. Tap
                below to see your result.
              </template>
            </div>
          </div>
        </div>
        <!-- Bill-upload picker — opens the bottom drawer when tapped -->
        <!-- <div
          v-else-if="simPath === 'bill'"
          class="sim-bill-picker"
          @click="openSimBillDrawer"
        >
          <div class="sim-bill-emoji">📄</div>
          <div>
            <div class="sim-bill-title">Tap to upload a recent energy bill</div>
            <div class="sim-bill-sub">
              We'll read the total spend and update your HomeScore — no manual
              entry needed.
            </div>
          </div>
        </div> -->

        <!-- Publish prompt — shown after enough answers -->
        <div v-if="simShowPublishPrompt" class="sim-publish">
          <div class="sim-publish-title">🏠 Ready to publish this data?</div>
          <div class="sim-publish-sub">
            Publishing updates your property's data and makes energy cost
            estimates more accurate for everyone nearby. You'll need to verify
            ownership first.
          </div>
          <div class="sim-publish-btns">
            <button type="button" class="sim-publish-go" @click="simSubmit">
              🏠 Claim &amp; publish →
            </button>
            <button
              type="button"
              class="sim-publish-skip"
              @click="simShowPublishPrompt = false"
            >
              Not now
            </button>
          </div>
        </div>

        <!-- EPC nudge — dynamic copy based on state -->
        <div
          class="sim-epc-nudge"
          :class="`sim-epc-nudge--${simEpcNudge.variant}`"
        >
          <div class="sim-epc-nudge-icon">{{ simEpcNudge.icon }}</div>
          <div style="flex: 1">
            <div class="sim-epc-nudge-title">{{ simEpcNudge.title }}</div>
            <div class="sim-epc-nudge-body">{{ simEpcNudge.body }}</div>
            <div v-if="simEpcNudge.ctaLabel" style="margin-top: 10px">
              <button type="button" class="sim-epc-nudge-cta">
                {{ simEpcNudge.ctaLabel }}
              </button>
            </div>
          </div>
        </div>

        <!-- CTA + reset -->
        <div class="sim-cta">
          <button type="button" class="sim-cta-btn" @click="simSubmit">
            🏠 Get my real HomeScore
          </button>
          <button type="button" class="sim-reset-btn" @click="simReset">
            ↺ Start again
          </button>
        </div>

            </div>
            <!-- /simw-content -->
          </div>
          <!-- /simw-layout -->
        </main>

        <div style="height: 24px" />
      </div>

      <!-- "Done something different" modal -->
      <Transition name="sim-modal">
        <div v-if="simDiffOpen" class="sim-diff-modal" @click="simCloseDiff">
          <div class="sim-diff-card" @click.stop>
            <div class="sim-diff-handle" />
            <div class="sim-diff-title">What did you do instead?</div>
            <div class="sim-diff-body">
              Tell us what improvement you made — even if it's not on the EPC
              list. This updates your score and helps your neighbours compare
              their options.
            </div>
            <textarea
              v-model="simDiffText"
              class="sim-diff-textarea"
              placeholder="e.g. Replaced hot water cylinder completely, installed underfloor heating, added a heat pump..."
            />
            <div class="sim-diff-tip">
              <span class="sim-diff-tip-icon">💡</span>
              <div class="sim-diff-tip-text">
                <b>This won't show on your EPC</b> until it's reassessed. A new
                EPC costs around <b>£50</b> and could move your rating from F to
                C — improving your score, your property's value, and your
                street's data for everyone.
              </div>
            </div>
            <div class="sim-diff-actions">
              <button
                type="button"
                class="sim-diff-save"
                @click="simConfirmDiff"
              >
                Save my answer
              </button>
              <button
                type="button"
                class="sim-diff-cancel"
                @click="simCloseDiff"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </template>

    <!-- ── POST-QUIZ (refined results) ───────────────────────────── -->
    <template v-else-if="screen === 'results'">
      <div class="pq-root pq-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button
                class="hsw-tour"
                type="button"
                title="How does this work?"
                aria-label="How does this work?"
                @click="resultTour.restart()"
              >
                ?
              </button>
              <button class="hsw-back" type="button" @click="screen = 'landing'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                HomeScore
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell pqw-main">
          <div class="pqw-head">
            <p class="pqw-kicker"><span class="pqw-kicker-dot" />Refined HomeScore</p>
            <h1>Your refined HomeScore</h1>
            <p class="pqw-lede">
              {{ property?.addressLine1 || 'Your property' }}<template v-if="property?.postcode"> · {{ property.postcode }}</template>
            </p>
          </div>

          <div class="pqw-layout">
            <aside class="pqw-aside">
        <!-- Amber address card with ✓ Quiz complete pill + 1 stat row -->
        <div v-if="property" class="pq-addr-card">
          <div class="pq-addr-top">
            <div class="pq-addr-pin" />
            <div class="pq-addr-block">
              <div class="pq-addr-line">
                {{ property.addressLine1 || 'Your property' }}
              </div>
              <div class="pq-addr-meta">
                {{ property.postcode || '' }}
                <template v-if="property.propertyType">
                  · {{ property.propertyType }}</template
                >
              </div>
            </div>
          </div>
          <div class="pq-addr-pills">
            <span v-if="property.epcRating" class="pq-addr-pill epc">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="11"
                height="11"
              >
                <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" />
              </svg>
              <span
                class="pq-epc-letter"
                :style="{ background: epcColor(property.epcRating) }"
                >{{ property.epcRating }}</span
              >
              EPC
            </span>
            <span class="pq-addr-pill pq-state-done">✓ Quiz complete</span>
          </div>
          <div v-if="pqSearches > 0" class="pq-addr-stats">
            <div class="pq-stat-row">
              <span class="pq-pulse-dot pq-pulse-green" />
              <span class="pq-stat-count"
                >{{ pqSearches }}
                {{ pqSearches === 1 ? 'search' : 'searches' }} today</span
              >
              <span class="pq-sep">·</span>
              <span>Score refined with your answers</span>
            </div>
          </div>
        </div>

        <!-- Refined savings hero (teal gradient) -->
        <div class="pq-overpay-hero">
          <div class="pq-overpay-eyebrow">
            <span class="dot" />Your refined savings potential
          </div>
          <div class="pq-overpay-num">
            £{{ pqRefinedBills.toLocaleString()
            }}<span class="unit"> / year</span>
          </div>
          <div class="pq-overpay-sub">
            Based on your quiz answers — a more accurate picture than public EPC
            data alone.
          </div>
          <button
            type="button"
            class="pq-hero-btn pq-hero-btn--primary"
            @click="goToRunningCosts"
          >
            <span class="pq-hero-btn-emoji"><Icon name="i-lucide-chart-column" /></span>
            <span class="pq-hero-btn-label">See full running costs</span>
            <svg
              class="pq-hero-btn-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
          <button
            type="button"
            class="pq-hero-btn pq-hero-btn--ghost"
            @click="goToPublish"
          >
            <span class="pq-hero-btn-emoji"><Icon name="i-lucide-house" /></span>
            <span class="pq-hero-btn-label">Publish to your street</span>
            <svg
              class="pq-hero-btn-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

            </aside>

            <div class="pqw-content">
        <!-- Refined score card -->
        <div class="pq-score-card" :class="`tone-${pqScoreTone}`">
          <div class="pq-score-eyebrow">
            <div class="left">HomeScore</div>
            <div class="right">✓ Refined with your answers</div>
          </div>
          <div class="pq-score-gauge-wrap">
            <div class="pq-gauge">
              <svg viewBox="0 0 120 120">
                <circle
                  class="g-bg"
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke-width="9"
                />
                <circle
                  class="g-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  :stroke="pqScoreColor"
                  stroke-width="9"
                  stroke-linecap="round"
                  stroke-dasharray="314.16"
                  :stroke-dashoffset="314.16 - (simScore / 100) * 314.16"
                />
              </svg>
              <div class="pq-g-num">
                <div class="gn-big">{{ simScore }}</div>
                <div class="gn-small">/ 100</div>
              </div>
            </div>
            <div class="pq-score-summary">
              <div class="pq-score-band">{{ pqScoreBandLabel }}</div>
              <div class="pq-score-explainer">{{ pqScoreExplainer }}</div>
            </div>
          </div>
          <div class="pq-score-data-note">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
            </svg>
            <div>
              Refined using your quiz answers. Upload certificates to increase
              this further.
            </div>
          </div>
        </div>

        <!-- Refined breakdown -->
        <div class="pq-breakdown-card">
          <div class="pq-breakdown-title">Your refined breakdown</div>
          <div class="pq-breakdown-sub">
            Based on your quiz answers. Upload certificates to verify and
            improve each category.
          </div>
          <div class="pq-breakdown-rows">
            <div
              v-for="bar in refinedBreakdownBars"
              :key="bar.key"
              class="pq-breakdown-row"
            >
              <div class="pq-breakdown-label">{{ bar.label }}</div>
              <div class="pq-breakdown-bar-wrap">
                <div
                  class="pq-breakdown-bar"
                  :style="{
                    width: `${(bar.value / bar.max) * 100}%`,
                    background: pillarBarColor(bar.value, bar.max),
                  }"
                />
              </div>
              <div
                class="pq-breakdown-value"
                :style="{ color: pillarBarColor(bar.value, bar.max) }"
              >
                {{ bar.value }}/{{ bar.max }}
              </div>
            </div>
          </div>
        </div>

        <!-- Next step card -->
        <div class="pq-interest-card">
          <div class="pq-interest-eyebrow">Your next step</div>
          <div class="pq-interest-opts">
            <button
              class="pq-interest-opt primary"
              type="button"
              @click="onBoostScore"
            >
              <span class="pq-interest-opt-icon"><Icon name="i-lucide-paperclip" /></span>
              <span class="pq-interest-opt-body">
                <span class="pq-interest-opt-title">Boost your score</span>
                <span class="pq-interest-opt-sub"
                  >Upload documents to verify your home and increase your Move
                  Ready score</span
                >
              </span>
              <span class="pq-interest-opt-chev">›</span>
            </button>
            <button
              class="pq-interest-opt outline"
              type="button"
              @click="screen = 'landing'"
            >
              <span class="pq-interest-opt-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </span>
              <span class="pq-interest-opt-body">
                <span class="pq-interest-opt-title">Back to HomeScore</span>
                <span class="pq-interest-opt-sub"
                  >View your full score, running costs and street data</span
                >
              </span>
              <span class="pq-interest-opt-chev">›</span>
            </button>
          </div>
        </div>

            </div>
            <!-- /pqw-content -->
          </div>
          <!-- /pqw-layout -->
        </main>
      </div>
    </template>

    <!-- ── PUBLISH (publish HomeScore to street) ─────────────────── -->
    <template v-else-if="screen === 'publish'">
      <div class="pub-root pub-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'results'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to results
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell pubw-main">
          <div class="pubw-head">
            <p class="pubw-kicker"><span class="pubw-kicker-dot" />Publish to your street</p>
            <h1>Make energy costs more accurate for everyone nearby</h1>
            <p class="pubw-lede">
              {{ property?.addressLine1 || 'Your property' }}<template v-if="property?.postcode"> · {{ property.postcode }}</template>
            </p>
          </div>

          <div class="pubw-layout">
            <aside class="pubw-aside">
        <!-- Address card -->
        <div v-if="property" class="pub-addr-card">
          <div class="pub-addr-top">
            <div class="pub-addr-pin" />
            <div class="pub-addr-block">
              <div class="pub-addr-line">
                {{ property.addressLine1 || 'Your property' }}
              </div>
              <div class="pub-addr-meta">
                {{ property.postcode || '' }}
                <template v-if="property.propertyType">
                  · {{ property.propertyType }}</template
                >
              </div>
            </div>
          </div>
          <div class="pub-addr-pills">
            <span v-if="property.epcRating" class="pub-addr-pill epc">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="11"
                height="11"
              >
                <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" />
              </svg>
              <span
                class="pub-epc-letter"
                :style="{ background: epcColor(property.epcRating) }"
                >{{ property.epcRating }}</span
              >
              EPC
            </span>
            <span class="pub-addr-pill pub-state-done"
              >✓ Accuracy checker complete</span
            >
          </div>
        </div>

        <!-- Hero (teal gradient) -->
        <div class="pub-hero">
          <div class="pub-hero-eyebrow">
            <span class="dot" />Improve your street's data
          </div>
          <div class="pub-hero-title">
            Make energy costs more accurate for everyone nearby
          </div>
          <div class="pub-hero-sub">
            Publishing updates your property's data anonymously. The more owners
            on a street do this, the more accurate the energy cost estimates
            become for everyone in the area.
          </div>
        </div>

            </aside>

            <div class="pubw-content">
        <!-- What you're contributing -->
        <div class="pub-contrib-card">
          <div class="pub-contrib-eyebrow">What you're adding to the data</div>
          <div class="pub-contrib-list">
            <div class="pub-contrib-row">
              <div class="pub-contrib-head">
                <div class="pub-contrib-label">
                  <span class="pub-contrib-icon">💷</span>
                  <span>Annual energy saving</span>
                </div>
                <span class="pub-contrib-val">~£{{ pubSavingAmount }}/yr</span>
              </div>
              <div class="pub-contrib-bar">
                <div
                  class="pub-contrib-bar-fill teal"
                  :style="{ width: pubSavingPct + '%' }"
                />
              </div>
              <div class="pub-contrib-note">
                Better than {{ pubSavingPct }}% of similar homes on your street
              </div>
            </div>
            <div class="pub-contrib-row">
              <div class="pub-contrib-head">
                <div class="pub-contrib-label">
                  <span class="pub-contrib-icon">🌱</span>
                  <span>Carbon saved</span>
                </div>
                <span class="pub-contrib-val"
                  >{{ pubCarbonSaved }}t CO₂/yr</span
                >
              </div>
              <div class="pub-contrib-bar">
                <div
                  class="pub-contrib-bar-fill success"
                  :style="{ width: pubCarbonPct + '%' }"
                />
              </div>
              <div class="pub-contrib-note">
                Lower than average for a similar home in {{ pubOutcode }}
              </div>
            </div>
            <div class="pub-contrib-row">
              <div class="pub-contrib-head">
                <div class="pub-contrib-label">
                  <span class="pub-contrib-icon">🏠</span>
                  <span>HomeScore accuracy</span>
                </div>
                <span class="pub-contrib-val">{{ simScore }} / 100</span>
              </div>
              <div class="pub-contrib-bar">
                <div
                  class="pub-contrib-bar-fill gold"
                  :style="{ width: simScore + '%' }"
                />
              </div>
              <div class="pub-contrib-note">
                Up from {{ pubScoreBefore }} before you answered these questions
              </div>
            </div>
          </div>
        </div>

        <!-- Anonymous notice -->
        <div class="pub-anon">
          <div class="pub-anon-icon">🔒</div>
          <div>
            <b>Published anonymously</b> — only the data above is shared, never
            your name or personal details.
          </div>
        </div>

        <!-- Street impact — gamified progress -->
        <div class="pub-street-card">
          <div class="pub-street-head">
            <div class="pub-street-eyebrow">Street data accuracy</div>
            <div class="pub-street-count">
              {{ pubStreetPublished }} of {{ pubStreetTotal }} homes
            </div>
          </div>
          <div class="pub-street-bar">
            <div
              class="pub-street-bar-fill"
              :style="{ width: pubStreetPct + '%' }"
            />
          </div>
          <div class="pub-street-note">
            <template v-if="pubStreetPublished === 1">
              You're the first to publish. Each home that follows makes
              everyone's bill estimates sharper.
            </template>
            <template v-else>
              {{ pubStreetPublished }} owners on this street have published.
              Each extra home sharpens everyone's bill estimates.
            </template>
          </div>
          <div class="pub-milestones">
            <div
              v-for="m in pubMilestones"
              :key="m.target"
              class="pub-milestone"
              :class="{ active: pubStreetPublished >= m.target }"
            >
              <div class="pub-milestone-num">
                {{ m.target === 1 ? '1st' : m.target }}
              </div>
              <div class="pub-milestone-label">{{ m.label }}</div>
            </div>
          </div>
        </div>

        <!-- Publish CTA -->
        <div class="pub-cta">
          <button type="button" class="pub-cta-btn" @click="onPublishToStreet">
            🏘️ Publish to {{ pubStreetName }}
          </button>
          <button
            type="button"
            class="pub-cta-skip"
            @click="screen = 'results'"
          >
            Not now — maybe later
          </button>
        </div>

            </div>
            <!-- /pubw-content -->
          </div>
          <!-- /pubw-layout -->
        </main>
      </div>
    </template>

    <!-- ── KYC (verify ownership: choose method) ─────────────────── -->
    <template v-else-if="screen === 'kyc'">
      <div class="kyc-root kyc-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'publish'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell kycw-main">
          <div class="kycw-head">
            <p class="kycw-kicker"><span class="kycw-kicker-dot" />Verify ownership</p>
            <h1>Prove you own this property</h1>
            <p class="kycw-lede">
              {{ property?.addressLine1 || 'Your property' }}<template v-if="property?.postcode"> · {{ property.postcode }}</template>
            </p>
          </div>

          <div class="kycw-layout">
            <aside class="kycw-aside">
        <!-- 3-step progress -->
        <div class="kyc-steps">
          <div class="kyc-step active">
            <div class="kyc-step-num">1</div>
            <div class="kyc-step-label">Verify</div>
          </div>
          <div class="kyc-step-line" />
          <div class="kyc-step">
            <div class="kyc-step-num">2</div>
            <div class="kyc-step-label">Publish</div>
          </div>
          <div class="kyc-step-line" />
          <div class="kyc-step">
            <div class="kyc-step-num">3</div>
            <div class="kyc-step-label">Passport</div>
          </div>
        </div>

        <!-- Navy gradient hero -->
        <div class="kyc-hero">
          <div class="kyc-hero-emoji">🔐</div>
          <div class="kyc-hero-title">Prove you own this property</div>
          <div class="kyc-hero-sub">
            We use a quick identity check so only the real owner can publish and
            manage data for this address.
          </div>
        </div>

            </aside>

            <div class="kycw-content">
        <!-- 3 verification method choices -->
        <div class="kyc-methods">
          <div class="kyc-method" @click="verifyWith('photo-id')">
            <div
              class="kyc-method-icon"
              :style="{ background: 'var(--kyc-teal-paler)' }"
            >
              🪪
            </div>
            <div class="kyc-method-body">
              <div class="kyc-method-title">Photo ID</div>
              <div class="kyc-method-sub">
                Passport or driving licence · 2 min
              </div>
            </div>
            <div class="kyc-method-chev">›</div>
          </div>
          <div class="kyc-method" @click="verifyWith('mortgage')">
            <div class="kyc-method-icon" :style="{ background: '#FFFBEB' }">
              📄
            </div>
            <div class="kyc-method-body">
              <div class="kyc-method-title">Mortgage or title document</div>
              <div class="kyc-method-sub">Confirms legal ownership · 3 min</div>
            </div>
            <div class="kyc-method-chev">›</div>
          </div>
          <div class="kyc-method" @click="verifyWith('open-banking')">
            <div class="kyc-method-icon" :style="{ background: '#F0F9FF' }">
              🏦
            </div>
            <div class="kyc-method-body">
              <div class="kyc-method-title">Open Banking</div>
              <div class="kyc-method-sub">
                Matches your address on file · instant
              </div>
            </div>
            <div class="kyc-method-chev">›</div>
          </div>
        </div>

        <!-- Privacy note -->
        <div class="kyc-privacy">
          🔒 Your documents are verified by our KYC partner and never stored by
          UMU HomeScore.
        </div>

            </div>
            <!-- /kycw-content -->
          </div>
          <!-- /kycw-layout -->
        </main>
      </div>
    </template>

    <!-- ── KYC PENDING (verified, ready to publish) ──────────────── -->
    <template v-else-if="screen === 'kyc-pending'">
      <div class="kyc-root kyc-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'kyc'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell kycw-main">
          <div class="kycw-head">
            <p class="kycw-kicker"><span class="kycw-kicker-dot" />Verifying ownership</p>
            <h1>Ownership verified</h1>
            <p class="kycw-lede">
              {{ property?.addressLine1 || 'Your property' }}<template v-if="property?.postcode"> · {{ property.postcode }}</template>
            </p>
          </div>

          <div class="kycw-layout">
            <aside class="kycw-aside">
        <!-- 3-step progress — step 1 done, step 2 active -->
        <div class="kyc-steps">
          <div class="kyc-step verified">
            <div class="kyc-step-num">✓</div>
            <div class="kyc-step-label">Verified</div>
          </div>
          <div class="kyc-step-line filled" />
          <div class="kyc-step active">
            <div class="kyc-step-num">2</div>
            <div class="kyc-step-label">Publish</div>
          </div>
          <div class="kyc-step-line" />
          <div class="kyc-step">
            <div class="kyc-step-num">3</div>
            <div class="kyc-step-label">Passport</div>
          </div>
        </div>

        <!-- Success hero (green gradient) -->
        <div class="kyc-hero kyc-hero--success">
          <div class="kyc-hero-emoji" style="font-size: 44px">✅</div>
          <div class="kyc-hero-title">Ownership verified</div>
          <div class="kyc-hero-sub">
            {{ property?.addressLine1 || 'Your property' }} is now linked to
            your account. You can publish your data and start building your
            Property Passport.
          </div>
        </div>

            </aside>

            <div class="kycw-content">
        <!-- Now unlocked -->
        <div class="kyc-unlocked">
          <div class="kyc-unlocked-eyebrow">Now unlocked for you</div>
          <div class="kyc-unlocked-list">
            <div class="kyc-unlocked-row">
              <span class="kyc-unlocked-icon">📡</span>
              <div>Publish your score to {{ pubStreetName }}</div>
            </div>
            <div class="kyc-unlocked-row">
              <span class="kyc-unlocked-icon">📎</span>
              <div>Upload documents to improve accuracy</div>
            </div>
            <div class="kyc-unlocked-row">
              <span class="kyc-unlocked-icon">🏠</span>
              <div>Start your Property Passport</div>
            </div>
          </div>
        </div>

        <!-- CTAs -->
        <div class="kyc-ctas">
          <button type="button" class="kyc-cta-primary" @click="confirmPublish">
            📡 Publish to {{ pubStreetName }}
          </button>
          <button
            type="button"
            class="kyc-cta-outline"
            @click="claimOrAccessPassport"
          >
            🏠 Start my Property Passport
          </button>
        </div>

            </div>
            <!-- /kycw-content -->
          </div>
          <!-- /kycw-layout -->
        </main>
      </div>
    </template>

    <!-- ── PUBLISHED (success confirmation) ──────────────────────── -->
    <template v-else-if="screen === 'published'">
      <div class="kyc-root kyc-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'results'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                My HomeScore
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell kycw-main">
          <div class="kycw-head">
            <p class="kycw-kicker"><span class="kycw-kicker-dot" />Published</p>
            <h1>Published to {{ pubStreetName }}</h1>
            <p class="kycw-lede">
              {{ property?.addressLine1 || 'Your property' }}<template v-if="property?.postcode"> · {{ property.postcode }}</template>
            </p>
          </div>

          <div class="kycw-layout">
            <aside class="kycw-aside">
        <!-- Amber address card -->
        <div v-if="property" class="pub-addr-card">
          <div class="pub-addr-top">
            <div class="pub-addr-pin" />
            <div class="pub-addr-block">
              <div class="pub-addr-line">
                {{ property.addressLine1 || 'Your property' }}
              </div>
              <div class="pub-addr-meta">
                {{ property.postcode || '' }}
                <template v-if="property.propertyType">
                  · {{ property.propertyType }}</template
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Big success hero (teal gradient) -->
        <div class="kyc-success-hero">
          <div class="kyc-success-emoji">✅</div>
          <div class="kyc-success-title">Published to {{ pubStreetName }}</div>
          <div class="kyc-success-sub">
            Your property data is now more accurate. Anyone on
            {{ pubStreetName }} will get better energy cost estimates because of
            it.
          </div>
        </div>

            </aside>

            <div class="kycw-content">
        <!-- What's now updated for your street -->
        <div class="kyc-updates-card">
          <div class="kyc-updates-eyebrow">
            What's now updated for your street
          </div>
          <div class="kyc-updates-list">
            <div class="kyc-updates-row">
              <span class="kyc-updates-icon">📊</span>
              <div>
                <b>Your HomeScore</b> — reflects actual property data, not EPC
                estimates
              </div>
            </div>
            <div class="kyc-updates-row">
              <span class="kyc-updates-icon">💡</span>
              <div>
                <b>Energy cost benchmarks</b> — more accurate for similar homes
                nearby
              </div>
            </div>
            <div class="kyc-updates-row">
              <span class="kyc-updates-icon">🏘️</span>
              <div>
                <b>Street-level data pool</b> — every owner who publishes
                improves it further
              </div>
            </div>
          </div>
        </div>

        <!-- Street impact pill -->
        <div class="kyc-street-impact">
          <div class="kyc-street-impact-icon">🏘️</div>
          <div>
            <template v-if="pubStreetPublished <= 1">
              You're the first owner to publish on {{ pubStreetName }}. The more
              people do this, the more accurate everyone's energy costs become.
            </template>
            <template v-else>
              {{ pubStreetPublished }} owners on {{ pubStreetName }} have now
              published. The more people do this, the more accurate everyone's
              energy costs become.
            </template>
          </div>
        </div>

        <!-- Next step -->
        <div class="kyc-next-step">
          <div class="kyc-next-step-eyebrow">Your next step</div>
          <button type="button" class="kyc-cta-primary" @click="onBoostScore">
            📎 Boost your score with documents
          </button>
          <button
            type="button"
            class="kyc-cta-skip"
            @click="screen = 'results'"
          >
            ← Back to my HomeScore
          </button>
        </div>

            </div>
            <!-- /kycw-content -->
          </div>
          <!-- /kycw-layout -->
        </main>
      </div>
    </template>

    <!-- ── PASSPORT ──────────────────────────────────────────────── -->
    <template v-else-if="screen === 'passport'">
      <div class="hs-scroll hs-scroll--web pp-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'results'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="ppw-main">
          <div class="ppw-head">
            <p class="ppw-kicker"><span class="ppw-kicker-dot" />Property Passport</p>
            <h1>Your Property Passport</h1>
          </div>
        <!-- Tab bar -->
        <div class="hs-vault-tabs">
          <button
            :class="[
              'hs-vault-tab',
              passportTab === 'sections' ? 'active' : '',
            ]"
            @click="setPassportTab('sections')"
          >
            📋 Sections
          </button>
          <button
            :class="['hs-vault-tab', passportTab === 'street' ? 'active' : '']"
            @click="setPassportTab('street')"
          >
            🗺 Street
          </button>
          <button
            :class="['hs-vault-tab', passportTab === 'buyers' ? 'active' : '']"
            @click="setPassportTab('buyers')"
          >
            👥 Buyers<span v-if="matchedBuyers.length" class="hs-tab-badge">{{
              matchedBuyers.length
            }}</span>
          </button>
        </div>

        <!-- ── SECTIONS TAB ─────────────────────────────────────── -->
        <div v-if="passportTab === 'sections'" class="hs-tab-content">
          <!-- Action row -->
          <div class="hs-passport-actions">
            <button class="hs-pa-btn outline" @click="setPassportTab('buyers')">
              ⇄ Match to Buyers
            </button>
            <button
              class="hs-pa-btn solid"
              @click="claimOrAccessPassport"
              :disabled="passportClaimLoading"
            >
              {{ passportClaimLoading ? '…' : '↑ Claim Passport' }}
            </button>
          </div>

          <div class="hs-pp-card">
            <div class="hs-pp-badge">
              You're {{ result.confidenceScore }}% there
            </div>
            <h3 class="hs-pp-title">
              You've started something real.<br />Let's take it to 100%.
            </h3>
            <p class="hs-pp-body">
              You've just built the foundation of a Property Passport for
              <b>{{ property?.addressLine1 || 'your property' }}</b
              >. Three documents would take your score from <b>estimated</b> to
              <b>verified</b>.
            </p>
            <div class="hs-pp-progress">
              <div class="hs-pp-progress-labels">
                <span>HomeScore confidence</span>
                <span>{{ result.confidenceScore }}% → 100%</span>
              </div>
              <div class="hs-pp-progress-track">
                <div
                  class="hs-pp-progress-fill"
                  :style="{ width: `${result.confidenceScore}%` }"
                />
              </div>
            </div>
            <div class="hs-pp-docs">
              <div class="hs-pp-doc-row">
                <div class="hs-pp-doc-ic">🔥</div>
                <div class="hs-pp-doc-name">
                  Last boiler service certificate
                </div>
                <div class="hs-pp-doc-gain">+15% conf</div>
              </div>
              <div class="hs-pp-doc-row">
                <div class="hs-pp-doc-ic">⚡</div>
                <div class="hs-pp-doc-name">Last 12 months energy bills</div>
                <div class="hs-pp-doc-gain">+20% conf</div>
              </div>
              <div class="hs-pp-doc-row">
                <div class="hs-pp-doc-ic">👤</div>
                <div class="hs-pp-doc-name">EICR (electrical report)</div>
                <div class="hs-pp-doc-gain">+10% conf</div>
              </div>
            </div>
            <button
              class="hs-pp-cta"
              @click="claimOrAccessPassport"
              :disabled="passportClaimLoading"
            >
              {{
                passportClaimLoading
                  ? 'Loading…'
                  : 'Claim your Property Passport'
              }}
            </button>
            <div class="hs-pp-cta-sub">
              Free to start · Your data stays yours
            </div>
          </div>
          <div class="hs-pp-unlocks-card">
            <p class="hs-pp-unlocks-title">What a Passport unlocks</p>
            <div class="hs-pp-unlocks-list">
              <div class="hs-pp-unlock-row">
                <span class="hs-pp-unlock-icon">📄</span>
                <div>
                  <div class="hs-pp-unlock-name">Document vault</div>
                  <div class="hs-pp-unlock-sub">
                    EPC, gas safety, EICR, warranties — all in one place.
                  </div>
                </div>
              </div>
              <div class="hs-pp-unlock-row">
                <span class="hs-pp-unlock-icon">⚡</span>
                <div>
                  <div class="hs-pp-unlock-name">14-day completion</div>
                  <div class="hs-pp-unlock-sub">
                    vs the UK average of 179 days — verified sellers close
                    faster.
                  </div>
                </div>
              </div>
              <div class="hs-pp-unlock-row">
                <span class="hs-pp-unlock-icon">📊</span>
                <div>
                  <div class="hs-pp-unlock-name">
                    Live running cost tracking
                  </div>
                  <div class="hs-pp-unlock-sub">
                    Connect bills for actual usage vs modelled estimates.
                  </div>
                </div>
              </div>
              <div class="hs-pp-unlock-row">
                <span class="hs-pp-unlock-icon">🛡</span>
                <div>
                  <div class="hs-pp-unlock-name">TA6-ready when you sell</div>
                  <div class="hs-pp-unlock-sub">
                    Share verified info with buyers &amp; conveyancers in a
                    click.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="hs-btn-ghost" @click="screen = 'results'">
            Maybe later — keep my score
          </button>
          <div style="height: 40px" />
        </div>

        <!-- ── STREET TAB ──────────────────────────────────────────── -->
        <div v-if="passportTab === 'street'" class="hs-tab-content">
          <p class="hs-vm-header">
            See who else on your street has started a Property Passport. Tap any
            house to see details.
          </p>

          <!-- Property list -->
          <div v-if="streetProperties.length" class="hs-street-list">
            <div
              v-for="sp in streetProperties"
              :key="sp.id"
              class="hs-street-row"
              @click="router.push(`/property/${sp.id}`)"
            >
              <div
                class="hs-street-house-icon"
                :style="{
                  color: sp.isPublished
                    ? '#1f7a66'
                    : sp.hasPassport
                      ? '#f59e0b'
                      : '#94a3b8',
                }"
              >
                🏠
              </div>
              <div style="flex: 1; min-width: 0">
                <div class="hs-street-addr">{{ sp.addressLine1 }}</div>
                <div class="hs-street-meta">
                  <span v-if="sp.propertyType" style="margin-right: 6px">{{
                    sp.propertyType
                  }}</span>
                  <span
                    v-if="sp.epcRating"
                    class="hs-street-epc"
                    :style="{ background: epcColor(sp.epcRating) }"
                    >EPC {{ sp.epcRating }}</span
                  >
                </div>
              </div>
              <div class="hs-street-status">
                <span v-if="sp.isPublished" class="hs-street-badge published"
                  >✓ Published</span
                >
                <span v-else-if="sp.hasPassport" class="hs-street-badge started"
                  >In progress</span
                >
                <span v-else class="hs-street-badge none">Not started</span>
              </div>
            </div>
          </div>
          <div v-else class="hs-street-empty">
            <div style="font-size: 32px; margin-bottom: 8px">🏘</div>
            <p style="font-size: 15px; color: #64748b; text-align: center">
              No other properties found on this street yet. Be the first to
              start your Passport!
            </p>
          </div>

          <!-- Street stats -->
          <div v-if="streetStats" class="hs-street-stats">
            <div class="hs-street-stats-title">
              {{ property?.postcode }} — Street Overview
            </div>
            <div class="hs-street-stats-grid">
              <div class="hs-stat-box brand">
                <div class="hs-stat-val">{{ streetStats.published }}</div>
                <div class="hs-stat-lbl">Passports published</div>
              </div>
              <div class="hs-stat-box green">
                <div class="hs-stat-val">{{ streetStats.notStarted }}</div>
                <div class="hs-stat-lbl">Not yet started</div>
              </div>
              <div v-if="streetStats.avgEpc" class="hs-stat-box amber">
                <div class="hs-stat-val">{{ streetStats.avgEpc }}</div>
                <div class="hs-stat-lbl">Average EPC rating</div>
              </div>
              <div v-if="streetStats.avgPrice" class="hs-stat-box grey">
                <div class="hs-stat-val">
                  £{{ Math.round(streetStats.avgPrice / 1000) }}k
                </div>
                <div class="hs-stat-lbl">Avg. estimated value</div>
              </div>
            </div>
            <div class="hs-street-tip">
              💡 <strong>You're ahead of your street.</strong> Most neighbours
              haven't started their passport. Sellers with a passport typically
              accept offers <strong>18 days faster</strong>.
            </div>
          </div>
          <div style="height: 80px" />
        </div>

        <!-- ── BUYERS TAB ──────────────────────────────────────────── -->
        <div v-if="passportTab === 'buyers'" class="hs-tab-content">
          <div class="hs-buyers-intro">
            <div
              style="
                font-size: 15px;
                color: #0f172a;
                font-weight: 600;
                margin-bottom: 2px;
              "
            >
              {{ buyersTotal || matchedBuyers.length }} buyers searching in your
              area
            </div>
            <div style="font-size: 13px; color: #64748b">
              Tap any buyer to see how well they match your property.
            </div>
          </div>

          <div v-if="matchedBuyers.length" class="hs-buyer-list">
            <div
              v-for="buyer in matchedBuyers"
              :key="buyer.name"
              class="hs-buyer-card"
            >
              <div
                class="hs-buyer-avatar"
                :style="{
                  background:
                    buyer.matchScore >= 75
                      ? '#dcfce7'
                      : buyer.matchScore >= 55
                        ? '#fef3c7'
                        : '#f1f5f9',
                  color:
                    buyer.matchScore >= 75
                      ? '#16a34a'
                      : buyer.matchScore >= 55
                        ? '#92400e'
                        : '#64748b',
                }"
              >
                {{ buyer.name[0] }}
              </div>
              <div class="hs-buyer-info">
                <div class="hs-buyer-name">{{ buyer.name }}</div>
                <div class="hs-buyer-criteria">
                  {{ buyer.area }} · {{ buyer.budget }} · {{ buyer.timeline }}
                </div>
                <div class="hs-buyer-tags">
                  <span
                    v-for="tag in buyer.tags"
                    :key="tag"
                    class="hs-buyer-tag"
                    :class="
                      tag === 'Strong match'
                        ? 'match'
                        : tag === 'Good match'
                          ? 'partial'
                          : 'other'
                    "
                    >{{ tag }}</span
                  >
                </div>
              </div>
              <div
                class="hs-buyer-match-score"
                :style="{
                  color:
                    buyer.matchScore >= 75
                      ? '#16a34a'
                      : buyer.matchScore >= 55
                        ? '#92400e'
                        : '#94a3b8',
                }"
              >
                {{ buyer.matchScore }}%
              </div>
            </div>
          </div>
          <div v-else class="hs-buyers-loading">
            <div style="font-size: 32px; margin-bottom: 8px">👥</div>
            <p style="font-size: 15px; color: #64748b; text-align: center">
              Loading matched buyers…
            </p>
          </div>

          <!-- Notify CTA -->
          <button
            class="hs-pp-cta"
            style="margin: 16px 0 8px"
            @click="claimOrAccessPassport"
          >
            Claim Passport to notify buyers
          </button>
          <div class="hs-pp-cta-sub">
            Your passport will become visible to matched buyers
          </div>
          <div style="height: 80px" />
        </div>
        </main>
      </div>
    </template>

    <!-- ── BUYER RESULTS ─────────────────────────────────────────── -->
    <template v-else-if="screen === 'buyer-results'">
      <div class="hs-scroll hs-scroll--web bv-root bv-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button
                class="hsw-tour"
                type="button"
                title="How does this work?"
                aria-label="How does this work?"
                @click="resultTour.restart()"
              >
                ?
              </button>
              <button class="hsw-back" type="button" @click="screen = 'landing'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                HomeScore
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell bvw-main">
          <div class="bvw-head">
            <p class="bvw-kicker"><span class="bvw-kicker-dot" />Property report</p>
            <h1>Buyer report</h1>
            <p class="bvw-lede">Everything public EPC data can tell you before you view or make an offer.</p>
          </div>

          <div class="bvw-layout">
            <aside class="bvw-aside">
        <!-- ── Address card (consistent with ResultDetail) ─────── -->
        <div v-if="property" class="bv-addr-card">
          <div class="bv-addr-top">
            <div class="bv-addr-pin" />
            <div class="bv-addr-block">
              <div class="bv-addr-line">
                {{ bvAddressTyped
                }}<span
                  v-if="!bvAddressTypingDone"
                  class="bv-typewriter-caret"
                  aria-hidden="true"
                  >|</span
                >
              </div>
              <div class="bv-addr-meta">
                {{ property.postcode || '' }}
                <template v-if="property.propertyType">
                  · {{ property.propertyType }}</template
                >
              </div>
            </div>
          </div>
          <div class="bv-addr-pills">
            <span v-if="property.epcRating" class="bv-addr-pill epc">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="11"
                height="11"
              >
                <path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" />
              </svg>
              <span class="bv-epc-letter" :style="{ background: bvEpcColor }">{{
                property.epcRating
              }}</span>
              EPC
            </span>
            <span
              v-if="bvPassportState === 'unclaimed'"
              class="bv-addr-pill bv-state-unclaimed"
              >Unclaimed</span
            >
            <span
              v-else-if="bvPassportState === 'inProgress'"
              class="bv-addr-pill bv-state-progress"
              >In progress</span
            >
            <span v-else class="bv-addr-pill bv-state-published"
              >✓ Published</span
            >
          </div>
          <div
            v-if="bvSearches > 0 || bvMonthSearches > 0"
            class="bv-addr-stats"
          >
            <div v-if="bvPassportState === 'unclaimed'" class="bv-stat-row">
              <span class="bv-pulse-dot" />
              <span class="bv-stat-count"
                >{{ bvSearches }}
                {{ bvSearches === 1 ? 'search' : 'searches' }} today</span
              >
              <span class="bv-sep">·</span>
              <span>No verified Passport yet</span>
            </div>
            <div
              v-else-if="bvPassportState === 'inProgress'"
              class="bv-stat-row"
            >
              <span class="bv-pulse-dot" />
              <span class="bv-stat-count"
                >{{ bvSearches }}
                {{ bvSearches === 1 ? 'search' : 'searches' }} today</span
              >
              <span class="bv-sep">·</span>
              <span>Passport in progress</span>
            </div>
            <div v-else class="bv-stat-row">
              <span class="bv-pulse-dot bv-pulse-green" />
              <span class="bv-stat-count"
                >{{ bvMonthSearches }}
                {{ bvMonthSearches === 1 ? 'search' : 'searches' }} this
                month</span
              >
              <span class="bv-sep">·</span>
              <span>Verified Passport live</span>
            </div>
          </div>
          <!-- Live checked / watching counts (real /search-stats data) -->
          <div class="bv-addr-live">
            <div class="bv-addr-live-row">
              <span class="bv-addr-live-ic">🔎</span>
              <span
                ><b>{{ bvSearches }}</b>
                {{ bvSearches === 1 ? 'person' : 'people' }} checked this
                HomeScore today</span
              >
            </div>
            <div class="bv-addr-live-row">
              <span class="bv-addr-live-ic">👁️</span>
              <span
                ><b>{{ bvWatchers }}</b>
                {{ bvWatchers === 1 ? 'person is' : 'people are' }} watching this
                property</span
              >
            </div>
          </div>
        </div>

        <!-- ── This property is unclaimed (navy CTA) ───────────── -->
        <div
          v-if="bvPassportState === 'unclaimed'"
          class="bv-claim-banner"
          @click="goToClaimPassport"
        >
          <div class="bv-claim-body">
            <div class="bv-claim-title">This property is unclaimed</div>
            <div class="bv-claim-sub">
              Is it yours? Build your verified Passport in minutes.
            </div>
          </div>
          <div class="bv-claim-arrow" aria-hidden="true">→</div>
        </div>

        <!-- ── Running cost hero (only when the EPC publishes real costs) ── -->
        <div v-if="bvAnnualCostDisplay != null" class="bv-cost-hero">
          <div class="bv-cost-eyebrow">Estimated annual running cost</div>
          <div class="bv-cost-num">
            ~£{{ bvAnnualCostDisplay.toLocaleString()
            }}<span class="bv-cost-unit"> / year</span>
          </div>
          <div class="bv-cost-sub">
            From the property's EPC (heating, hot water &amp; lighting).
            <template v-if="bvStreetBest != null">
              The best homes on this street cost
              <b>£{{ bvStreetBest.toLocaleString() }}/yr</b> — there's
              potential to negotiate or factor in upgrade costs.
            </template>
          </div>
          <div class="bv-cost-stats">
            <div class="bv-cost-stat">
              <div class="bv-cost-stat-num">{{ result.total }}</div>
              <div class="bv-cost-stat-label">HomeScore</div>
            </div>
            <div class="bv-cost-stat-div" />
            <div class="bv-cost-stat">
              <div class="bv-cost-stat-num">{{ buyerEpcGrade }}</div>
              <div class="bv-cost-stat-label">EPC Grade</div>
            </div>
            <div v-if="bvStreetRankLabel" class="bv-cost-stat-div" />
            <div v-if="bvStreetRankLabel" class="bv-cost-stat">
              <div class="bv-cost-stat-num">{{ bvStreetRankLabel }}</div>
              <div class="bv-cost-stat-label">
                of {{ streetEnergyRank?.total }} on street
              </div>
            </div>
          </div>
        </div>

        <!-- ── Buyer confidence gauge ──────────────────────────── -->
        <div class="bv-confidence-card">
          <div class="bv-confidence-head">
            <div class="bv-confidence-shield" :style="{ color: buyerConfidence.color }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div class="bv-confidence-text">
              <div class="bv-confidence-eyebrow">Buyer confidence</div>
              <div class="bv-confidence-title">{{ buyerConfidence.label }}</div>
            </div>
            <div class="bv-confidence-dial">
              <svg viewBox="0 0 80 80">
                <circle class="bv-dial-bg" cx="40" cy="40" r="32" stroke-width="7" />
                <circle
                  class="bv-dial-fill"
                  cx="40"
                  cy="40"
                  r="32"
                  stroke-width="7"
                  :stroke="buyerConfidence.color"
                  :stroke-dasharray="buyerConfidence.ringLen"
                  :stroke-dashoffset="buyerConfidence.ringOffset"
                />
              </svg>
              <div class="bv-dial-num">{{ buyerConfidence.score }}</div>
            </div>
          </div>
          <div class="bv-confidence-note">{{ buyerConfidence.note }}</div>
        </div>

            </aside>

            <div class="bvw-content">
        <!-- ── Tab bar (Energy / Costs / Sold / Risks / Area) ───── -->
        <div class="bv-tabs" role="tablist">
          <button
            v-for="t in buyerTabs"
            :key="t.id"
            type="button"
            class="bv-tab"
            :class="{ active: buyerTab === t.id }"
            role="tab"
            :aria-selected="buyerTab === t.id"
            @click="buyerTab = t.id"
          >
            <span class="bv-tab-ic">{{ t.icon }}</span>{{ t.label }}
          </button>
        </div>

        <!-- ═══ RISKS tab ═══ -->
        <div v-show="buyerTab === 'risks'" class="bv-tabpanel">
        <!-- ── Buyer risk summary ──────────────────────────────── -->
        <div class="bv-section-h">
          <div class="bv-section-h-icon warn">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="8" x2="12" y2="13" />
              <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
            </svg>
          </div>
          <div class="bv-section-h-text">
            <div class="bv-section-h-title">Buyer risk summary</div>
            <div class="bv-section-h-sub">
              What the EPC data suggests you look into
            </div>
          </div>
        </div>
        <div class="bv-risks-card">
          <div
            v-for="r in buyerRisks"
            :key="r.key"
            class="bv-risk-row"
            :class="r.tone === 'ok' ? 'green' : 'amber'"
          >
            <span class="bv-risk-icon">{{ r.icon }}</span>
            <div class="bv-risk-body">
              <div class="bv-risk-title">{{ r.title }}</div>
              <div class="bv-risk-sub">{{ r.body }}</div>
            </div>
          </div>
          <!-- Public-record risks from the backend (flood / mining / planning) -->
          <template v-if="buyerPublicRisks.length">
            <div
              v-for="r in buyerPublicRisks"
              :key="r.key"
              class="bv-risk-row"
              :class="r.tone === 'ok' ? 'green' : 'amber'"
            >
              <span class="bv-risk-icon">{{ r.icon }}</span>
              <div class="bv-risk-body">
                <div class="bv-risk-title">{{ r.title }}</div>
                <div class="bv-risk-sub">{{ r.body }}</div>
              </div>
            </div>
          </template>
          <!-- Fallback flood row from the property record if running-costs unavailable -->
          <div v-else-if="buyerFlood" class="bv-risk-row" :class="/low|very low/i.test(buyerFlood) ? 'green' : 'amber'">
            <span class="bv-risk-icon">🌊</span>
            <div class="bv-risk-body">
              <div class="bv-risk-title">Flood risk — {{ buyerFlood }}</div>
              <div class="bv-risk-sub">Environment Agency surface & river data for this postcode.</div>
            </div>
          </div>
        </div>
        </div><!-- /risks tab -->

        <!-- ═══ ENERGY tab ═══ -->
        <div v-show="buyerTab === 'energy'" class="bv-tabpanel">
        <!-- ── Score breakdown ─────────────────────────────────── -->
        <div class="bv-section-h">
          <div class="bv-section-h-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M12 2l2 6 6 1-4.5 4 1.5 7-5-3-5 3 1.5-7L4 9l6-1z" />
            </svg>
          </div>
          <div class="bv-section-h-text">
            <div class="bv-section-h-title">Score breakdown</div>
            <div class="bv-section-h-sub">Based on public EPC data only</div>
          </div>
        </div>
        <div class="bv-breakdown-card">
          <div class="bv-breakdown-sub">
            The owner could improve this with a full HomeScore.
          </div>
          <div class="bv-breakdown-rows">
            <div
              v-for="bar in pillarBars(autoBreakdown)"
              :key="bar.key"
              class="bv-breakdown-row"
            >
              <div class="bv-bd-label">{{ bar.label }}</div>
              <div class="bv-bd-bar-wrap">
                <div
                  class="bv-bd-bar"
                  :style="{
                    width: `${(bar.value / bar.max) * 100}%`,
                    background: pillarBarColor(bar.value, bar.max),
                  }"
                />
              </div>
              <div
                class="bv-bd-val"
                :style="{ color: pillarBarColor(bar.value, bar.max) }"
              >
                {{ bar.value }}/{{ bar.max }}
              </div>
            </div>
          </div>
          <div class="bv-bd-note">
            This is based on public EPC data only. Ask the owner to run a full
            HomeScore to get a verified picture.
          </div>
        </div>
        </div><!-- /energy tab -->

        <!-- ═══ COSTS tab ═══ -->
        <div v-show="buyerTab === 'costs'" class="bv-tabpanel">
          <template v-if="buyerCosts.hasAny">
            <div class="bv-costs-hero">
              <div class="bv-costs-eyebrow">Estimated total per year</div>
              <div class="bv-costs-num">
                £{{ buyerCosts.total.toLocaleString() }}<span>/yr</span>
              </div>
              <div class="bv-costs-sub">
                Energy from EPC data, plus water and council tax for this address.
              </div>
            </div>
            <div class="bv-costs-rows">
              <div class="bv-costs-row">
                <span class="bv-costs-row-label">⚡ Energy <small>· heating, hot water & lighting</small></span>
                <b>{{ buyerCosts.energy != null ? '£' + buyerCosts.energy.toLocaleString() + '/yr' : '—' }}</b>
              </div>
              <div v-if="buyerCosts.water != null" class="bv-costs-row">
                <span class="bv-costs-row-label">💧 Water &amp; sewerage<template v-if="buyerCosts.waterLabel"> <small>· {{ buyerCosts.waterLabel }}</small></template></span>
                <b>£{{ buyerCosts.water.toLocaleString() }}/yr</b>
              </div>
              <div class="bv-costs-row">
                <span class="bv-costs-row-label">🏛️ Council tax<template v-if="buyerCosts.councilTaxBand"> <small>· Band {{ buyerCosts.councilTaxBand }}<template v-if="buyerCosts.council"> · {{ buyerCosts.council }}</template></small></template></span>
                <b>{{ buyerCosts.councilTax != null ? '£' + buyerCosts.councilTax.toLocaleString() + '/yr' : '—' }}</b>
              </div>
            </div>
            <div class="bv-bd-note">
              Energy is modelled from the EPC; water is the region's published
              average and council tax is the VOA band. Upload a bill to replace
              these with your real figures.
            </div>
          </template>
          <div v-else class="bv-area-note">
            <div class="bv-area-note-title">💰 No published costs yet</div>
            <div class="bv-area-note-body">
              This property has no EPC energy cost or council tax band on the public
              record yet. They'll show here once the data is available.
            </div>
          </div>
        </div>

        <!-- ═══ SOLD tab ═══ -->
        <div v-show="buyerTab === 'sold'" class="bv-tabpanel">
          <div class="bv-costs-hero sold">
            <div class="bv-costs-eyebrow">Estimated value</div>
            <div class="bv-costs-num">
              {{ buyerSold.estimated != null ? '£' + buyerSold.estimated.toLocaleString() : '—' }}
            </div>
            <div class="bv-costs-sub">Modelled from local sold prices (HPI-adjusted).</div>
          </div>
          <div class="bv-costs-rows">
            <div v-if="buyerSold.lastPrice" class="bv-costs-row">
              <span class="bv-costs-row-label">🏷️ Last sold<template v-if="buyerSold.lastDate"> <small>· {{ formatSoldDate(buyerSold.lastDate) }}</small></template></span>
              <b>£{{ buyerSold.lastPrice.toLocaleString() }}</b>
            </div>
            <div v-else class="bv-bd-note" style="margin:0">
              No Land Registry sale on record for this address yet.
            </div>
          </div>

          <!-- ── Sale history for this exact address ─────────────── -->
          <div class="bv-section-h" style="margin-top:16px">
            <div class="bv-section-h-icon"><Icon name="i-lucide-history" /></div>
            <div class="bv-section-h-text">
              <div class="bv-section-h-title">Sale history</div>
              <div class="bv-section-h-sub">
                <template v-if="buyerSold.history.length">
                  {{ buyerSold.history.length }} recorded
                  {{ buyerSold.history.length === 1 ? 'sale' : 'sales' }} · HM Land Registry
                </template>
                <template v-else>No recorded sales of this property</template>
              </div>
            </div>
          </div>
          <div v-if="buyerSold.history.length" class="bv-costs-rows">
            <div
              v-for="(s, i) in buyerSold.history"
              :key="'own' + i"
              class="bv-costs-row"
            >
              <span class="bv-costs-row-label">{{ formatSoldDate(s.date) }}<template v-if="s.tenure"> <small>· {{ s.tenure }}</small></template></span>
              <b>£{{ Number(s.price).toLocaleString() }}</b>
            </div>
          </div>
          <div v-else class="bv-bd-note" style="margin:0">
            No Land Registry Price Paid record exists for this exact address —
            it may be new-build, last sold before 1995, or transferred without a
            recorded price.
          </div>

          <!-- ── Comparable sales nearby ─────────────────────────── -->
          <template v-if="buyerSold.comparables.length">
            <div class="bv-section-h" style="margin-top:16px">
              <div class="bv-section-h-icon"><Icon name="i-lucide-house" /></div>
              <div class="bv-section-h-text">
                <div class="bv-section-h-title">Comparable sales nearby</div>
                <div class="bv-section-h-sub">
                  {{ buyerSold.comparables.length }} similar
                  {{ buyerSold.comparables.length === 1 ? 'home' : 'homes' }} ·
                  {{ property?.postcode || 'this postcode' }} · HM Land Registry
                </div>
              </div>
            </div>
            <div class="bv-costs-rows">
              <div
                v-for="(c, i) in buyerSold.comparables"
                :key="'cmp' + i"
                class="bv-costs-row"
              >
                <span class="bv-costs-row-label">{{ titleCaseAddress(c.address) }}<br /><small>{{ formatSoldDate(c.date) }}<template v-if="c.propertyType"> · {{ c.propertyType }}</template><template v-if="c.tenure"> · {{ c.tenure }}</template></small></span>
                <b>£{{ Number(c.price).toLocaleString() }}</b>
              </div>
            </div>
          </template>
        </div>

        <!-- ═══ AREA tab — real data.police.uk crime data ═══ -->
        <div v-show="buyerTab === 'area'" class="bv-tabpanel">
          <div
            v-if="!areaCrime || areaCrime.status === 'loading'"
            class="bv-area-note"
          >
            <div class="bv-area-note-title">📍 Loading area crime…</div>
            <div class="bv-area-note-body">
              Fetching street-level crime within 1 mile from data.police.uk.
            </div>
          </div>

          <div v-else-if="areaCrime.status === 'error'" class="bv-area-note">
            <div class="bv-area-note-title">📍 Area data unavailable</div>
            <div class="bv-area-note-body">
              Couldn't reach data.police.uk right now. Try again shortly.
            </div>
          </div>

          <div v-else-if="areaCrime.status === 'empty'" class="bv-area-note">
            <div class="bv-area-note-title">📍 No crime recorded</div>
            <div class="bv-area-note-body">
              data.police.uk has no street-level crime within 1 mile of this
              property for the latest published month.
            </div>
          </div>

          <template v-else>
            <div class="bv-costs-hero sold">
              <div class="bv-costs-eyebrow">Crimes within 1 mile</div>
              <div class="bv-costs-num">
                {{ areaCrime.total.toLocaleString() }}<span>/mo</span>
              </div>
              <div class="bv-costs-sub">
                Street-level crime for {{ formatCrimeMonth(areaCrime.month || '') }} ·
                data.police.uk
              </div>
            </div>
            <div class="bv-crime-card">
              <div class="bv-crime-head">Crime breakdown</div>
              <div
                v-for="c in areaCrime.categories"
                :key="c.key"
                class="bv-crime-row"
              >
                <div class="bv-crime-label">{{ c.label }}</div>
                <div class="bv-crime-bar-wrap">
                  <div
                    class="bv-crime-bar"
                    :style="{
                      width: `${Math.max(4, (c.count / areaCrime.categories[0].count) * 100)}%`,
                    }"
                  />
                </div>
                <div class="bv-crime-val">{{ c.count.toLocaleString() }}</div>
              </div>
            </div>
            <div class="bv-bd-note">
              Counts are street-level crimes reported within a 1-mile radius for
              the latest month published by police forces (data lags ~2 months).
            </div>
          </template>
        </div>

        <!-- ── Questions to ask the owner (real EPC recommendations) ── -->
        <template v-if="bvQuestions.length">
          <div class="bv-section-h">
            <div class="bv-section-h-icon save">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <circle cx="12" cy="12" r="9" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <circle cx="12" cy="7.5" r="0.9" fill="currentColor" />
              </svg>
            </div>
            <div class="bv-section-h-text">
              <div class="bv-section-h-title">Questions to ask the owner</div>
              <div class="bv-section-h-sub">
                {{
                  property?.epcRecommendations?.length
                    ? "Based on this property's EPC recommendations"
                    : 'Key documents to request before you offer'
                }}
              </div>
            </div>
          </div>
          <div class="bv-questions-card">
            <div v-for="q in bvQuestions" :key="q.title" class="bv-q-row">
              <span class="bv-q-icon">{{ q.icon }}</span>
              <div class="bv-q-body">
                <div class="bv-q-title">{{ q.title }}</div>
                <div class="bv-q-sub">{{ q.sub }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ── Watch this property (notification triggers) ─────── -->
        <div class="bv-watch-card">
          <div class="bv-watch-eyebrow">👁 Watch this property</div>
          <div class="bv-watch-title">Be the first to know if anything changes here.</div>
          <div class="bv-watch-lede">
            No Passport exists yet. Adding this to your profile turns on
            notifications for every meaningful change at
            <b>{{ property?.addressLine1 || 'this property' }}</b>.
          </div>
          <div class="bv-watch-rows">
            <div v-for="t in bvWatchTriggers" :key="t.title" class="bv-watch-row">
              <span class="bv-watch-ic">{{ t.icon }}</span>
              <div class="bv-watch-body">
                <div class="bv-watch-row-title">{{ t.title }}</div>
                <div class="bv-watch-row-sub">{{ t.sub }}</div>
              </div>
            </div>
          </div>
          <button
            class="bv-watch-btn"
            type="button"
            @click="openWatchDrawer"
          >
            {{ notifiedOfPublish ? '✓ Watching — edit alerts' : 'Watch this property →' }}
          </button>
        </div>

        <!-- ── Verified buyer upsell (£35 one-off) ─────────────── -->
        <div class="bv-verified-card">
          <div class="bv-verified-eyebrow">🛡 Verified buyer · £35 one-off</div>
          <div class="bv-verified-title">Be viewing-ready before anyone else.</div>
          <div class="bv-verified-lede">
            Owners building a Passport are choosing who to sell to. Get verified
            and here's what you unlock.
          </div>
          <div class="bv-verified-rows">
            <div v-for="p in bvVerifiedPerks" :key="p.title" class="bv-verified-row">
              <span class="bv-verified-ic">{{ p.icon }}</span>
              <div class="bv-verified-body">
                <div class="bv-verified-row-title">{{ p.title }}</div>
                <div class="bv-verified-row-sub">{{ p.sub }}</div>
              </div>
            </div>
          </div>
          <button class="bv-verified-btn" type="button" @click="saveToBuyerProfile">
            ✓ See what verification gets you →
          </button>
        </div>

        <!-- ── Save to Buyer Profile CTA ───────────────────────── -->
        <div class="bv-save-card" @click="saveToBuyerProfile">
          <div class="bv-save-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div class="bv-save-body">
            <div class="bv-save-title">Save to your Buyer Profile</div>
            <div class="bv-save-sub">
              Track this property, compare with others, share with your
              solicitor.
            </div>
          </div>
          <div class="bv-save-cta">Save →</div>
        </div>

        <button class="bv-back" @click="screen = 'landing'">
          ← Back to HomeScore
        </button>

            </div>
            <!-- /bvw-content -->
          </div>
          <!-- /bvw-layout -->
        </main>
      </div>
    </template>

    <!-- ── BOOST YOUR SCORE — matches prototype `boost` screen ───── -->
    <template v-else-if="screen === 'quick-wins'">
      <div class="boost-root boost-root--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'results'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to score
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell boostw-main">
          <div class="boostw-head">
            <p class="boostw-kicker"><span class="boostw-kicker-dot" />Boost your score</p>
            <h1>Every document adds real value</h1>
            <p class="boostw-lede">
              Add certificates and book trusted pros to verify your home and grow your Move Ready score.
            </p>
          </div>

          <div class="boostw-layout">
            <aside class="boostw-aside">
        <!-- Property Journey card -->
        <div class="boost-journey-card">
          <div class="boost-journey-header">
            <div class="boost-journey-eyebrow">YOUR PROPERTY JOURNEY</div>
            <div class="boost-journey-right">Updates as you add docs</div>
          </div>
          <div class="boost-journey-stats">
            <div class="boost-stat">
              <div
                class="boost-stat-num"
                :class="{ amber: qwScore < 40 }"
                :style="{ color: scoreColor(qwScore) }"
              >
                {{ qwScore }}
              </div>
              <div class="boost-stat-label">HOMESCORE</div>
              <div class="boost-stat-sub">Energy score</div>
            </div>
            <div class="boost-stat-div" />
            <div class="boost-stat">
              <div class="boost-stat-num" :class="{ muted: qwMoveReady === 0 }">
                {{ qwMoveReady }}%
              </div>
              <div class="boost-stat-label">MOVE READY</div>
              <div class="boost-stat-sub">Docs &amp; certs</div>
            </div>
            <div class="boost-stat-div" />
            <div class="boost-stat">
              <div class="boost-stat-num muted">0%</div>
              <div class="boost-stat-label">PASSPORT</div>
              <div class="boost-stat-sub">Ownership verified</div>
            </div>
          </div>
          <div class="boost-progress-bar">
            <div
              class="boost-progress-fill"
              :style="{ width: `${qwProgress}%` }"
            />
          </div>
        </div>

            </aside>

            <div class="boostw-content">
        <!-- Upload a document section -->
        <div class="boost-section-label">📎 UPLOAD A DOCUMENT</div>
        <div class="boost-cards">
          <div
            v-for="(doc, idx) in qwDocs"
            v-show="idx === 0 || boostUnlocked >= idx"
            :key="doc.key"
            class="boost-doc-card"
            :class="{
              uploaded: !!uploadedDocs[doc.key],
              'boost-doc-card--unlocking':
                idx === boostUnlocked && !uploadedDocs[doc.key],
            }"
            @click="triggerDocUpload(doc.key)"
          >
            <div class="boost-doc-icon" :style="{ background: doc.bg }">
              <img
                v-if="doc.img"
                :src="doc.img"
                :alt="doc.label"
                class="boost-doc-icon-img"
              />
              <template v-else>{{ doc.icon }}</template>
            </div>
            <div class="boost-doc-body">
              <div class="boost-doc-title">{{ doc.label }}</div>
              <div class="boost-doc-sub">{{ doc.sub }}</div>
            </div>
            <div v-if="!!uploadedDocs[doc.key]" class="boost-pts">
              ✓ +{{ doc.pts }} pts
            </div>
            <button
              v-else
              class="boost-add-btn"
              type="button"
              aria-label="Upload"
              @click.stop="triggerDocUpload(doc.key)"
            >
              +
            </button>
          </div>
        </div>

        <!-- Book a professional section -->
        <div class="boost-section-label">🔧 BOOK A PROFESSIONAL</div>
        <div class="boost-cards">
          <div
            v-for="pro in qwPros"
            :key="pro.key"
            class="boost-doc-card"
            @click="openMarketplace"
          >
            <div class="boost-doc-icon" :style="{ background: pro.bg }">
              <img
                v-if="pro.img"
                :src="pro.img"
                :alt="pro.label"
                class="boost-doc-icon-img"
              />
              <template v-else>{{ pro.icon }}</template>
            </div>
            <div class="boost-doc-body">
              <div class="boost-doc-title">{{ pro.label }}</div>
              <div class="boost-doc-sub">{{ pro.sub }}</div>
            </div>
            <div class="boost-chev">›</div>
          </div>
        </div>

        <!-- Now make it count CTA -->
        <div class="pj-cta-card">
          <div class="pj-cta-eyebrow">Next step on your journey</div>
          <div class="pj-cta-title">
            Score: <span>{{ qwScore }}</span
            >. Your Passport is taking shape.
          </div>
          <div class="pj-cta-sub">
            Each document you add is a verified layer of your Property Passport.
            Keep uploading to reach Move Ready status and lock in everything
            you've built.
          </div>
          <button
            class="pj-cta-btn"
            type="button"
            @click="claimOrAccessPassport"
          >
            Start my Property Passport →
          </button>
        </div>

        <button
          class="boost-back-link"
          type="button"
          @click="screen = 'results'"
        >
          ← Back to my score
        </button>

            </div>
            <!-- /boostw-content -->
          </div>
          <!-- /boostw-layout -->
        </main>
      </div>
    </template>

    <!-- ── MOVE READY ────────────────────────────────────────────── -->
    <template v-else-if="screen === 'move-ready'">
      <div class="hs-scroll hs-scroll--web">
        <!-- ── Web nav ──────────────────────────────────────────── -->
        <header class="hsw-nav">
          <div class="hsw-shell hsw-nav-inner">
            <button class="hsw-brand" type="button" @click="navigateTo('/')">
              <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
              <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
            </button>
            <nav class="hsw-links" aria-label="Primary navigation">
              <button type="button" @click="navigateTo('/explore')">Explore</button>
              <button type="button" class="active" @click="navigateTo('/homescore')">HomeScore</button>
              <button type="button" @click="navigateTo('/passport')">Passport</button>
              <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
              <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
            </nav>
            <div class="hsw-actions">
              <button class="hsw-back" type="button" @click="screen = 'quick-wins'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <button class="hsw-cta" type="button" @click="navigateTo('/claim')">Claim Passport</button>
            </div>
          </div>
        </header>

        <main class="hsw-shell mrw-main">
          <div class="mrw-headline">
            <p class="mrw-kicker"><span class="mrw-kicker-dot" />Move-ready status</p>
          </div>
        <!-- Hero -->
        <div class="hs-mr-hero">
          <div class="hs-mr-hero-glow" />
          <div class="hs-mr-hero-inner">
            <div class="hs-mr-hero-eyebrow">Move-ready status</div>
            <div class="hs-mr-hero-title">
              90% of sales fall through<br />because of missing paperwork.
            </div>
            <div class="hs-mr-hero-body">
              Move-ready means your ownership is verified, your documents are in
              order, and a buyer's solicitor can start work the same day they
              make an offer.
            </div>
            <div class="hs-mr-compare-grid">
              <div class="hs-mr-compare-col red">
                <div class="hs-mr-compare-head red">Not verified</div>
                <div class="hs-mr-compare-list">
                  <div>❌ Score is estimated</div>
                  <div>❌ Buyers can't verify</div>
                  <div>❌ Delays at exchange</div>
                  <div>❌ 179 day average</div>
                </div>
              </div>
              <div class="hs-mr-compare-col teal">
                <div class="hs-mr-compare-head teal">Move ready ✓</div>
                <div class="hs-mr-compare-list ok">
                  <div>✓ Score is verified</div>
                  <div>✓ Buyers can trust it</div>
                  <div>✓ No nasty surprises</div>
                  <div>✓ 14 day completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div class="mrw-grid">
            <div class="mrw-col">
        <!-- Steps -->
        <div class="hs-qw-section-label">What happens next — 3 steps</div>
        <div class="hs-mr-steps">
          <div class="hs-mr-step">
            <div class="hs-mr-step-ic">1</div>
            <div>
              <div class="hs-mr-step-title">Verify your property</div>
              <div class="hs-mr-step-body">
                Enter your address and we confirm it against HM Land Registry.
                Takes 60 seconds.
              </div>
            </div>
          </div>
          <div class="hs-mr-step">
            <div class="hs-mr-step-ic">2</div>
            <div>
              <div class="hs-mr-step-title">Confirm your identity</div>
              <div class="hs-mr-step-body">
                Quick ID check — photo of your passport or driving licence plus
                a selfie. Powered by Onfido.
              </div>
            </div>
          </div>
          <div class="hs-mr-step">
            <div class="hs-mr-step-ic teal">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                stroke-width="2.5"
                stroke-linecap="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div class="hs-mr-step-title">Your score becomes verified</div>
              <div class="hs-mr-step-body">
                Your HomeScore is upgraded from estimated to verified — and your
                Property Passport is live.
              </div>
            </div>
          </div>
        </div>

            </div>
            <div class="mrw-col">
        <!-- Stats grid -->
        <div class="hs-mr-stats">
          <div class="hs-mr-stat">
            <div class="hs-mr-stat-num">12x</div>
            <div class="hs-mr-stat-lbl">faster to exchange</div>
          </div>
          <div class="hs-mr-stat">
            <div class="hs-mr-stat-num">3x</div>
            <div class="hs-mr-stat-lbl">fewer fall-throughs</div>
          </div>
          <div class="hs-mr-stat">
            <div class="hs-mr-stat-num">£0</div>
            <div class="hs-mr-stat-lbl">to get started</div>
          </div>
        </div>

        <!-- Claim CTA -->
        <button class="hs-mr-claim-btn" @click="claimFromMoveReady">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Claim your Property Passport →
        </button>
        <div class="hs-mr-claim-sub">
          Free to start · Takes 5 mins · Your data stays yours
        </div>
        <button class="hs-btn-ghost" @click="screen = 'quick-wins'">
          ← Back
        </button>
            </div>
            <!-- /mrw-col -->
          </div>
          <!-- /mrw-grid -->
        </main>
      </div>
    </template>

    <!-- Shared site footer (all web screens; hidden during the brief loader) -->
    <SiteFooter v-if="screen !== 'loading'" />

    <!-- Watch this property drawer (buyer notification preferences) -->
    <WatchPropertyDrawer
      :open="watchDrawerOpen"
      :address-label="property?.addressLine1 || ''"
      @close="watchDrawerOpen = false"
      @submit="onWatchSubmit"
    />

    <!-- Auth gate modal — shown when a guest taps "I'm interested in buying"
         or "Save to Buyer Profile". Returns user to this property after login. -->
    <div
      v-if="showAuthGate"
      class="hs-authgate-overlay"
      @click.self="showAuthGate = false"
    >
      <div class="hs-authgate-card">
        <div class="hs-authgate-ic">🔒</div>
        <div class="hs-authgate-title">Log in to continue</div>
        <div class="hs-authgate-sub">
          Save this property, see your full Buyer Report and build your Buyer
          Profile to share with sellers.
        </div>
        <button class="hs-authgate-primary" @click="goToSignIn">
          Log in or Create account
        </button>
        <button class="hs-authgate-ghost" @click="showAuthGate = false">
          Not now
        </button>
      </div>
    </div>

    <!-- ── Global document-upload drawer ──────────────────────────
         Bottom-sheet upload used by Boost Score and (eventually) any
         doc-upload entry point on this page. Teleported to <body> so
         it's positioned correctly regardless of which screen template
         is rendering. Driven by `qwDrawerOpen` / `qwDrawerDocKey`.       -->
    <Teleport to="body">
      <div v-if="qwDrawerOpen" class="qw-overlay" @click.self="closeDrawer">
        <div class="qw-modal">
          <div class="qw-modal-handle" />
          <div class="qw-modal-header">
            <div class="qw-modal-title">
              {{ qwDrawerDoc?.label || 'Upload document' }}
            </div>
            <button
              type="button"
              class="qw-modal-close"
              aria-label="Close"
              @click="closeDrawer"
            >
              ×
            </button>
          </div>

          <div class="qw-modal-body">
            <p class="qw-modal-intro">{{ qwDrawerDoc?.sub }}</p>

            <!-- Already-saved file preview -->
            <div v-if="qwDrawerExistingEntry" class="qw-doc-preview">
              <div class="qw-doc-preview-icon">📄</div>
              <div class="qw-doc-preview-info">
                <div class="qw-doc-preview-name">
                  {{ qwDrawerExistingEntry.fileName }}
                </div>
                <div class="qw-doc-preview-meta">
                  {{ formatFileSize(qwDrawerExistingEntry.fileSize) }} · saved
                </div>
              </div>
              <button
                type="button"
                class="qw-doc-preview-btn"
                @click="removeDrawerDoc"
              >
                Remove
              </button>
            </div>

            <!-- Newly picked file (pending save) -->
            <div
              v-if="qwDrawerFile"
              class="qw-doc-preview qw-doc-preview--pending"
            >
              <div class="qw-doc-preview-icon">📄</div>
              <div class="qw-doc-preview-info">
                <div class="qw-doc-preview-name">{{ qwDrawerFile.name }}</div>
                <div class="qw-doc-preview-meta">
                  {{ formatFileSize(qwDrawerFile.size) }} · ready to save
                </div>
              </div>
              <button
                type="button"
                class="qw-doc-preview-btn"
                @click="qwDrawerFile = null"
              >
                Change
              </button>
            </div>

            <!-- File picker (only shown when nothing pending) -->
            <label v-if="!qwDrawerFile" class="qw-upload-row">
              <input
                type="file"
                accept=".pdf,image/*"
                class="qw-upload-input"
                @change="onDrawerFilePicked"
              />
              <span class="qw-upload-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="qw-upload-text">
                {{
                  qwDrawerExistingEntry ? 'Replace document' : 'Upload document'
                }}
                <small>PDF, JPG, PNG up to 20MB</small>
              </span>
            </label>

            <p v-if="qwDrawerError" class="qw-modal-error">
              {{ qwDrawerError }}
            </p>
          </div>

          <div class="qw-modal-footer">
            <button type="button" class="qw-btn-secondary" @click="closeDrawer">
              Cancel
            </button>
            <button
              type="button"
              class="qw-btn-primary"
              :disabled="!qwDrawerFile"
              @click="saveDrawerDoc"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Simulator: Upload-a-bill drawer ─────────────────────────
         Bottom-sheet for the "Upload a bill" path on the simulator
         screen. Reuses the qw-* drawer skin so both drawers feel the
         same. Opening this drawer marks `simBillUploaded = true` once
         the user confirms — feeding the EPC nudge into the `bill` state.   -->
    <Teleport to="body">
      <div
        v-if="simBillDrawerOpen"
        class="qw-overlay"
        @click.self="closeSimBillDrawer"
      >
        <div class="qw-modal">
          <div class="qw-modal-handle" />
          <div class="qw-modal-header">
            <div class="qw-modal-title">Upload an energy bill</div>
            <button
              type="button"
              class="qw-modal-close"
              aria-label="Close"
              @click="closeSimBillDrawer"
            >
              ×
            </button>
          </div>

          <div class="qw-modal-body">
            <p class="qw-modal-intro">
              We'll read the total spend from your bill and refine your
              HomeScore — more accurate than EPC estimates alone.
            </p>

            <!-- Pending file preview -->
            <div
              v-if="simBillFile"
              class="qw-doc-preview qw-doc-preview--pending"
            >
              <div class="qw-doc-preview-icon">📄</div>
              <div class="qw-doc-preview-info">
                <div class="qw-doc-preview-name">{{ simBillFile.name }}</div>
                <div class="qw-doc-preview-meta">
                  {{ formatFileSize(simBillFile.size) }} · ready to save
                </div>
              </div>
              <button
                type="button"
                class="qw-doc-preview-btn"
                @click="simBillFile = null"
              >
                Change
              </button>
            </div>

            <!-- File picker -->
            <label v-if="!simBillFile" class="qw-upload-row">
              <input
                type="file"
                accept=".pdf,image/*"
                class="qw-upload-input"
                @change="onSimBillFilePicked"
              />
              <span class="qw-upload-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="qw-upload-text">
                Upload your energy bill
                <small>PDF, JPG, PNG up to 20MB</small>
              </span>
            </label>

            <p v-if="simBillError" class="qw-modal-error">
              {{ simBillError }}
            </p>
          </div>

          <div class="qw-modal-footer">
            <button
              type="button"
              class="qw-btn-secondary"
              @click="closeSimBillDrawer"
            >
              Cancel
            </button>
            <button
              type="button"
              class="qw-btn-primary"
              :disabled="!simBillFile"
              @click="saveSimBill"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHomeScore } from '~/composables/useHomeScore'
import { usePassportClaim } from '~/composables/usePassportClaim'
import { usePropertyActions } from '~/composables/usePropertyActions'
import { useAppToast } from '~/composables/useCustomToast'
import ResultDetail from '~/components/homescore/ResultDetail.vue'
import V6ScoreView from '~/components/homescore/V6ScoreView.vue'
import V6QuizView from '~/components/homescore/V6QuizView.vue'
import V6BoostView from '~/components/homescore/V6BoostView.vue'
import V6LevelUpView from '~/components/homescore/V6LevelUpView.vue'
import V6NoEpcEstimator from '~/components/homescore/V6NoEpcEstimator.vue'
import TourCoach from '~/components/homescore/TourCoach.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import WatchPropertyDrawer from '~/components/property/WatchPropertyDrawer.vue'
import { useHomescoreTour } from '~/composables/useHomescoreTour'
import type { TopWin, Opportunity } from '~/types/homescore'
import { QUESTIONS } from '~/utils/homescoreScoring'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const propertyId = route.params.id as string

const property = ref<any>(null)
// Full running-costs breakdown from the backend (energy + water + council tax
// + flood/mining/planning risks + environmental). The buyer report Costs and
// Risks tabs read from this so they match the deployed app. Fetched in
// onMounted alongside the property record; stays null until it resolves.
const runningCosts = ref<any>(null)
// Land Registry sold history from the backend: { thisProperty: [...],
// nearbySales: [...] }. Powers the buyer report Sold tab (sale history +
// comparable sales nearby). Fetched in onMounted; stays null until it lands.
const soldHistory = ref<{
  thisProperty: any[]
  nearbySales: any[]
} | null>(null)

// ── Coach-mark tour for the detail screens (auto-starts on first visit) ──
const resultTour = useHomescoreTour({
  storageKey: `umu-tour-result-${propertyId}`,
  autoStart: true,
  steps: [
    {
      sel: '[data-tour="addr"]',
      title: 'Your property',
      body: 'This shows the address, EPC rating and current Passport status. The live signal shows how many people have searched this property recently.',
    },
    {
      sel: '[data-tour="overpay"]',
      title: 'You could be overpaying',
      body: 'This compares your estimated running costs against similar homes on your street, based on public EPC data which may be out of date.',
    },
    {
      sel: '[data-tour="score"]',
      title: 'Your HomeScore',
      body: 'A score from 0–100 showing how energy efficient this property is. The higher the score, the lower the likely running costs.',
    },
    {
      sel: '[data-tour="breakdown"]',
      title: 'Score breakdown',
      body: 'Each category contributes to the overall score. Shorter bars mean more room to improve — and more potential savings.',
    },
    {
      sel: '[data-tour="intent"]',
      title: 'What brings you here?',
      body: 'Own this property? Take a quick quiz to get your real score. Just interested? Save it and view running costs.',
    },
  ],
})

type Screen =
  | 'loading'
  | 'landing'
  | 'questions'
  | 'no-epc-estimator'
  | 'level-up'
  | 'boost'
  | 'results'
  | 'publish'
  | 'kyc'
  | 'kyc-pending'
  | 'published'
  | 'passport'
  | 'buyer-results'
  | 'quick-wins'
  | 'move-ready'
const screen = ref<Screen>('loading')

type PassportTab = 'sections' | 'street' | 'buyers'
const passportTab = ref<PassportTab>('sections')

const streetProperties = ref<any[]>([])
const streetStats = ref<any>(null)
const matchedBuyers = ref<any[]>([])
const buyersTotal = ref(0)
const passportClaimLoading = ref(false)
const isPropertyOwner = ref(false)

// Read-only mode: property has a passport claimed by someone else.
// The current user can't run the quiz or modify the score — they see
// the owner's published HomeScore (if available).
const hasOtherOwnerPassport = ref(false)
const isPassportCollaborator = ref(false)
const isOtherPassportPublished = ref(false)
const publicOwnerScore = ref<any>(null)
const notifiedOfPublish = ref(false)

// Auth gate (shown when guest taps "I'm interested in buying" or "Save")
const showAuthGate = ref(false)

// Search-stats card ("People searched this address this month")
const searchStats = ref<{
  today: number
  thisMonth: number
  allTime: number
  distinctVisitors: number
} | null>(null)

// Deterministic fallback so the card still renders for properties with no
// logged searches yet — mirrors the prototype's hsGetViewCount: 8–26 base,
// with a small boost for poor EPC. The real count is preferred whenever it's
// non-zero, so as searches accrue the displayed number transitions smoothly.
const derivedMonthCount = computed(() => {
  const p: any = property.value
  const seedSrc = (p?.id || p?.addressLine1 || propertyId || '') as string
  let h = 0
  for (let i = 0; i < seedSrc.length; i++)
    h = (h * 31 + seedSrc.charCodeAt(i)) >>> 0
  const epc = typeof p?.epcScore === 'number' ? p.epcScore : 55
  let count = 8 + (h % 19)
  if (epc < 50) count += 6
  return count
})
const searchedMonthCount = computed(() => {
  const real = searchStats.value?.thisMonth ?? 0
  return real > 0 ? real : derivedMonthCount.value
})
const searchedTodayCount = computed(() => {
  const real = searchStats.value?.today ?? 0
  if (real > 0) return real
  // ~quarter of monthly when falling back, mirroring prototype
  return Math.max(1, Math.floor(derivedMonthCount.value / 4))
})

const readOnlyMode = computed(
  () =>
    hasOtherOwnerPassport.value &&
    !isPropertyOwner.value &&
    !isPassportCollaborator.value,
)

// True when no token in localStorage — used to gate "I'm interested" CTAs and
// to hide owner-only options (the "This is my home" button) for guest viewers.
const isGuest = computed(() => {
  if (typeof localStorage === 'undefined') return true
  return !localStorage.getItem('token')
})

// Three mutually exclusive states for the banner on the landing screen:
// - 'published': owner has published their passport → show navy "View →" banner
// - 'inProgress': owner has claimed but not published yet → show amber "Notify me" banner
// - null: no third-party passport → no banner
const passportState = computed<'published' | 'inProgress' | null>(() => {
  if (!readOnlyMode.value) return null
  return isOtherPassportPublished.value ? 'published' : 'inProgress'
})

// ── ResultDetail (prototype-aligned 3a/3b/3c view) props ──
// Reflect the property's TRUE Passport state — independent of who is viewing.
// `passportState` (above) gates on `readOnlyMode` and is `null` for the owner;
// for the result UI we want the real status (published / in-progress / unclaimed)
// no matter whether the viewer is the owner, a buyer, or a guest.
const resolvedPassportState = computed<
  'unclaimed' | 'inProgress' | 'published'
>(() => {
  const p: any = property.value
  // Server payload may expose these directly OR via the loaded score-state.
  if (p?.passportPublished) return 'published'
  if (isOtherPassportPublished.value) return 'published'
  if (p?.hasPassport) return 'inProgress'
  if (hasOtherOwnerPassport.value) return 'inProgress'
  return 'unclaimed'
})

// Read an EPC field from BOTH the top-level Property row and the nested
// `epcCert` sub-object (the backend exposes both shapes). Ported from the
// Updated Application so running-cost / CO₂ figures use real EPC data
// wherever it lives instead of falling back to the rating map.
function epcField(name: string): any {
  const p: any = property.value
  if (!p) return null
  const top = p[name]
  if (top != null && top !== '') return top
  const cert = p.epcCert
  if (cert && cert[name] != null && cert[name] !== '') return cert[name]
  return null
}

const resolvedAnnualCost = computed<number>(() => {
  // Try the summed cost first (real EPC), then individual cost fields,
  // then a rating-based map. Anything > 0 is preferred over the map.
  const summed =
    Number(epcField('energyCostCurrent') ?? 0) ||
    (Number(epcField('heatingCostCurrent') ?? 0) +
      Number(epcField('hotWaterCostCurrent') ?? 0) +
      Number(epcField('lightingCostCurrent') ?? 0))
  if (summed > 0) return Math.round(summed)
  const map: Record<string, number> = {
    A: 980,
    B: 1100,
    C: 1300,
    D: 1592,
    E: 1823,
    F: 2200,
    G: 2600,
  }
  const r = (property.value?.epcRating || '').toUpperCase()
  if (map[r]) return map[r]
  return 1592
})

const resolvedEpcYear = computed<number | null>(() => {
  const lodged = epcField('lodgementDate') || epcField('epcLodgementDate')
  if (!lodged) return null
  const y = new Date(lodged).getFullYear()
  return Number.isFinite(y) ? y : null
})

// ── Real-data computeds for V6ScoreView (ported from Updated Application) ──
const autoOpenClaim = ref(false)
const passportProgressPct = computed(() => 0)
const passportSectionsDone = computed(() => 0)
const passportSectionsTotal = computed(() => 0)

const resolvedCo2Now = computed<number | null>(() => {
  const v = epcField('co2Emissions') ?? epcField('co2EmissionsCurrent')
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
})
const resolvedCo2Potential = computed<number | null>(() => {
  const v = epcField('co2EmissionsPotential')
  if (v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
})
const resolvedBillsSplit = computed<
  { heating: number; hotWater: number; lighting: number } | null
>(() => {
  const h = Number(epcField('heatingCostCurrent') ?? 0)
  const w = Number(epcField('hotWaterCostCurrent') ?? 0)
  const l = Number(epcField('lightingCostCurrent') ?? 0)
  const total = h + w + l
  if (total <= 0) return null
  return {
    heating: Math.round((h / total) * 100),
    hotWater: Math.round((w / total) * 100),
    lighting: Math.round((l / total) * 100),
  }
})
const resolvedPotentialSaving = computed<number>(() => {
  const p: any = property.value
  const recs: any = p?.epcRecommendations
  if (Array.isArray(recs) && recs.length) {
    const sum = recs.reduce((acc: number, r: any) => {
      const v = Number(r?.typicalSaving ?? r?.indicativeCost ?? 0)
      return acc + (Number.isFinite(v) ? v : 0)
    }, 0)
    if (sum > 0) return Math.round(sum)
  }
  const cert: any = p?.epcCert
  const curr = Number(cert?.energyCostCurrent ?? resolvedAnnualCost.value)
  const pot = Number(cert?.energyCostPotential ?? 0)
  if (curr > 0 && pot > 0 && pot < curr) return Math.round(curr - pot)
  return 445
})

// ── V6 flow handlers (quiz → level-up → boost) ──────────────────────
const v6QuizFinal = ref<{
  finalScore: number
  delta: number
  answers: Record<string, string>
} | null>(null)
function onQuizFinish(payload: {
  finalScore: number
  delta: number
  answers: Record<string, string>
}) {
  v6QuizFinal.value = payload
  screen.value = 'level-up'
}
function onUploadBill(_file: File) {
  // Bill-parsing endpoint not wired server-side yet (matches clone behaviour).
}
function onBookAssessment() {
  window.open(
    'https://www.gov.uk/find-energy-certificate/find-an-assessor',
    '_blank',
    'noopener,noreferrer',
  )
}
function goToBoost() {
  screen.value = 'boost'
}
function goToPathway() {
  const from = screen.value
  router.push(
    `/homescore/pathway/${propertyId}?from=${encodeURIComponent(from)}`,
  )
}
function onBoostStartPassport() {
  claimOrAccessPassport()
}

function goToBuyerView() {
  // "I'm interested in buying" — let guests through to the buyer view so
  // they can browse the running costs, comparison, etc. The auth gate
  // only fires when they later tap "Boost your score" (which is gated in
  // `onBoostScore`). Owners and signed-in users also land on the same
  // in-page screen.
  screen.value = 'buyer-results'
}

function goToStreetCompare() {
  router.push(`/homescore/street/${propertyId}`)
}

function goToRunningCosts() {
  router.push(`/homescore/costs/${propertyId}`)
}

function notifyWhenPublished() {
  // Guests need to sign in before we can notify them — gate it.
  if (isGuest.value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', `/homescore/${propertyId}`)
    }
    showAuthGate.value = true
    return
  }
  // Record locally so the button shows "already notified" across reloads.
  if (typeof localStorage !== 'undefined') {
    const key = `hs_notify_publish_${propertyId}`
    localStorage.setItem(key, String(Date.now()))
  }
  notifiedOfPublish.value = true
}

// (Legacy `onInterestedInBuying` removed — the "I'm interested" button now
// fires via ResultDetail's `interested` event → `goToBuyerView()`, which
// lets guests through to the buyer view without an immediate auth gate.)

// Tap handler for "Boost your score" CTA — gate guests up-front before they
// invest time in the quick-wins flow.
function onBoostScore() {
  gateOwnerAction('quick-wins')
}

/**
 * HomeScore claim card / the "Claim it →" button inside the passport
 * explainer drawer → the dedicated claim flow at /claim/<id>, which opens
 * the "Choose your passport" (Seller / Landlord) type drawer on mount.
 * Guests are auth-gated first and bounced back to /claim/<id> after login.
 */
function goToClaimPassport() {
  if (isGuest.value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', `/claim/${propertyId}`)
    }
    showAuthGate.value = true
    return
  }
  router.push(`/claim/${propertyId}`)
}

/**
 * Funnel any "owner-only" action through the right chain:
 *
 *   guest        → save redirect, show auth gate (signin → bounces back)
 *   not-owner    → /claim/<id>?next=<homescore screen=…>  — runs the standard
 *                  claim flow (login → KYC → Land Registry → Passport claim)
 *                  and on completion lands the user back here on the
 *                  originally requested screen
 *   verified owner → set screen directly
 *
 * Used by "Publish to your street" (gates → `publish`) and "Boost your score"
 * (gates → `quick-wins`). After the claim flow finishes the user lands on
 * the publish screen / boost-score screen with full ownership unlocked.
 */
function gateOwnerAction(target: 'publish' | 'quick-wins') {
  const targetPath = `/homescore/${propertyId}?screen=${target}`

  // Property claimed by someone else — never let the current user act on it.
  if (readOnlyMode.value) {
    router.push(`/property/${propertyId}`)
    return
  }

  if (isGuest.value) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', targetPath)
    }
    showAuthGate.value = true
    return
  }

  // Logged in but hasn't claimed this property yet — route through the
  // standard claim chain (KYC + Land Registry + passport issue). The claim
  // page honours `?next=` and replaces its default `/passportview/<id>`
  // redirect with our deep-link back here.
  if (!isPropertyOwner.value) {
    router.push(`/claim/${propertyId}?next=${encodeURIComponent(targetPath)}`)
    return
  }

  // Verified owner — proceed straight to the requested screen.
  screen.value = target
}

function goToSignIn() {
  // redirectAfterLogin is set by callers; the auth middleware respects it.
  if (typeof localStorage !== 'undefined') {
    if (!localStorage.getItem('redirectAfterLogin')) {
      localStorage.setItem('redirectAfterLogin', `/homescore/${propertyId}`)
    }
  }
  router.push('/onboarding/signin')
}

// Primary CTA above "I'm interested in buying" — adapts to passport state.
const primaryCta = computed(() => {
  if (passportState.value === 'published') {
    return {
      title: 'Sign in to manage your Passport',
      sub: 'Already own this property? Manage your record',
    }
  }
  if (passportState.value === 'inProgress') {
    return {
      title: 'Sign in to continue your Passport',
      sub: "Building this property's Passport? Pick up where you left off",
    }
  }
  return {
    title: 'I own this property',
    sub: `Get my real score in 2 mins · ${QUESTIONS.length} quick questions`,
  }
})

function onPrimaryCtaClick() {
  if (
    passportState.value === 'published' ||
    passportState.value === 'inProgress'
  ) {
    goToSignIn()
    return
  }
  startQuestions()
}

// Triggered when an existing-passport owner taps "Refine my HomeScore".
// Clear any prior answers so the quiz is a genuine retake, then jump in.
// startQuestions() handles the guest auth-gate (redirects to sign-in with
// ?screen=questions) and the read-only-mode bail-out internally.
function onRefineScore() {
  retakeHS()
  startQuestions()
}

// Stable per-browser session id used for guest dedup on /property/:id/log-search.
function getOrCreateSessionId(): string | null {
  if (typeof localStorage === 'undefined') return null
  const KEY = 'umu_session_id'
  let sid = localStorage.getItem(KEY)
  if (!sid) {
    sid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(KEY, sid)
  }
  return sid
}

const {
  step,
  answers,
  showResult,
  currentQuestion,
  currentAnswer,
  canNext,
  isLastStep,
  progress,
  result,
  topWins,
  opportunities,
  liveScore,
  confidence,
  carbonKg,
  autoScore,
  answer,
  next,
  prev,
  retake: retakeHS,
  prefill,
} = useHomeScore(propertyId)

// ── Delta animation ───────────────────────────────────────────

const deltaInfo = ref({ val: 0, show: false })
let deltaTimer: ReturnType<typeof setTimeout> | null = null

function handleAnswer(qId: string, val: string) {
  const oldScore = liveScore.value
  answer(qId, val, true)
  nextTick(() => {
    const delta = liveScore.value - oldScore
    if (delta !== 0) {
      if (deltaTimer) clearTimeout(deltaTimer)
      deltaInfo.value = { val: delta, show: true }
      deltaTimer = setTimeout(() => {
        deltaInfo.value = { val: 0, show: false }
      }, 1200)
    }
  })
}

// ── Computed ──────────────────────────────────────────────────

// The heuristic scoring engine was seeded from a handful of EPC rating
// buckets and produces a score close to BASE_SCORE (≈50) for most
// properties even when the real SAP was much higher. When we have a real
// `epcScore` on the property row (the actual gov SAP number), use that as
// the headline instead of the heuristic — mirrors the deployed app so the
// card shows the true score (e.g. 69 · C) rather than an under-scored ~36.
const autoScoreVal = computed(() => {
  const real = Number((property.value as any)?.epcScore)
  if (Number.isFinite(real) && real > 0) return real
  return autoScore.value?.total ?? result.value.total
})
const autoBreakdown = computed(
  () => autoScore.value?.breakdown ?? result.value.breakdown,
)
const autoRating = computed(
  () => autoScore.value?.rating ?? result.value.rating,
)

const epcRangeLow = computed(() => Math.max(0, autoScoreVal.value - 7))
const epcRangeHigh = computed(() => Math.min(100, autoScoreVal.value + 25))

// EPC-based positive-framing explainer for the Starter Score card.
// Mirrors the prototype's hsRenderEpcCard(): score band → label, body copy,
// and adaptive confidence pill tone (good / ok / warn).
const epcExplain = computed(() => {
  const s = autoScoreVal.value ?? 55
  let label: string
  let body: string
  let confTone: 'good' | 'ok' | 'warn'
  if (s >= 92) {
    label = 'Exceptional'
    body =
      'Among the <b>most efficient homes</b> in the UK — less than 3% of properties achieve this rating. Modern construction, low running costs.'
    confTone = 'good'
  } else if (s >= 81) {
    label = 'Highly efficient'
    body =
      'In the <b>top 20% of UK homes</b>. Strong insulation and modern systems keep running costs well below average.'
    confTone = 'good'
  } else if (s >= 69) {
    label = 'Above average'
    body =
      'Better than most UK homes — the UK average is around <b>60–65</b>. Small upgrades could lift this to a B.'
    confTone = 'ok'
  } else if (s >= 55) {
    label = 'Typical UK home'
    body =
      'In line with the <b>average British home</b>. Real upside available — cavity wall, glazing or boiler upgrades can lift this to a C or B.'
    confTone = 'ok'
  } else if (s >= 39) {
    label = 'Period property'
    body =
      'Often older or solid-wall homes. Targeted improvements can transform efficiency <b>without losing character</b>.'
    confTone = 'warn'
  } else if (s >= 21) {
    label = 'Upgrade potential'
    body =
      'These homes have the <b>most savings potential</b>. Typical upgrades cut running costs by £200–600 a year.'
    confTone = 'warn'
  } else {
    label = 'Renovation potential'
    body =
      'Less than <b>1% of UK homes</b> rate this low. Strong negotiating position for buyers; biggest improvement journey for owners.'
    confTone = 'warn'
  }
  const confText =
    confTone === 'good'
      ? '✓ Public EPC · recently assessed'
      : confTone === 'ok'
        ? 'Modelled from public EPC data'
        : 'Public EPC · improvements not yet reflected'
  const confIcon = confTone === 'good' ? '✓' : 'ⓘ'
  return { label, body, confTone, confText, confIcon }
})

const epcDataAge = computed(() => {
  const date = property.value?.lodgementDate
  if (!date) return '5-year-old'
  const year = parseInt(String(date).slice(0, 4), 10)
  if (!year) return '5-year-old'
  const age = new Date().getFullYear() - year
  if (age <= 0) return 'recent'
  if (age === 1) return '1-year-old'
  return `${age}-year-old (${year})`
})

// Score-driven saving estimate: (100 - score) * ~21 ≈ prototype's £1,347 for score 37
const potentialSaving = computed(() =>
  Math.max(150, Math.round((100 - autoScoreVal.value) * 21)),
)

const moveReadyScore = 20
const completeScore = computed(() =>
  Math.round((result.value.total + moveReadyScore) / 2),
)

// Fallback wins/opps so these sections always show something useful
const DEFAULT_WINS: TopWin[] = [
  {
    title: 'Install solar PV panels',
    sub: 'Generates ~3,500 kWh/yr and earns export payments',
    savingPerYear: 450,
    points: 7,
  },
  {
    title: 'Top up loft insulation to 270mm',
    sub: 'Up to 25% of heat escapes through the roof',
    savingPerYear: 320,
    points: 5,
  },
  {
    title: 'Fit a smart thermostat',
    sub: 'Smart controls save ~£130/yr on average',
    savingPerYear: 130,
    points: 4,
  },
]
const DEFAULT_OPPS: Opportunity[] = [
  {
    icon: '🏠',
    title: 'Improve loft insulation',
    sub: 'Topping up to 270mm is one of the most cost-effective fixes.',
  },
  {
    icon: '🔥',
    title: 'Book a boiler service',
    sub: 'An annual service keeps your boiler running at peak efficiency.',
  },
  {
    icon: '🌡️',
    title: 'Fit a smart thermostat',
    sub: 'Could save ~£130/yr — low cost, high impact.',
  },
]

const displayWins = computed(() =>
  topWins.value.length > 0 ? topWins.value : DEFAULT_WINS,
)
const displayOpps = computed(() =>
  opportunities.value.length > 0 ? opportunities.value : DEFAULT_OPPS,
)

const totalSaving = computed(() =>
  displayWins.value.reduce((s, w) => s + w.savingPerYear, 0),
)

// Yearly potential — sum of top wins (what the savings hero shows)
const yearlyPotential = computed(() =>
  topWins.value.reduce((s, w) => s + w.savingPerYear, 0),
)

const allAnswered = computed(
  () => Object.keys(answers.value).length >= QUESTIONS.length,
)

// Carbon drivers based on the two worst-scoring pillars
const pillarCarbonDrivers = computed(() => {
  const rows = PILLAR_DEFS.map((d) => {
    const value = (result.value.breakdown as any)?.[d.key] ?? 0
    const pct = Math.round(100 - (value / d.max) * 100)
    const iconMap: Record<string, string> = {
      heating: '🔥',
      structure: '🧱',
      efficiency: '💡',
      electrics: '⚡',
      plumbing: '🚰',
    }
    return {
      key: d.key,
      label: d.label,
      icon: iconMap[d.key] ?? '▫',
      value,
      max: d.max,
      pct: Math.max(0, pct),
      gap: d.max - value,
    }
  })
  rows.sort((a, b) => b.gap - a.gap)
  return rows.slice(0, 2)
})

function pillarBarColor(value: number, max: number): string {
  const pct = (value / max) * 100
  if (pct >= 60) return '#16a34a'
  if (pct >= 40) return '#f59e0b'
  return '#dc2626'
}

const headerSub = computed(() => {
  if (screen.value === 'questions')
    return `Question ${step.value + 1} of ${QUESTIONS.length}`
  if (screen.value === 'landing') return 'Based on public records'
  if (screen.value === 'results') return 'Refined with your answers'
  if (screen.value === 'passport') return 'Continue your journey'
  if (screen.value === 'buyer-results') return 'Based on public EPC data'
  if (screen.value === 'quick-wins') return 'Every document adds real value'
  if (screen.value === 'move-ready') return 'What it means for you'
  return ''
})

const selectedNarr = computed(() => {
  if (!currentQuestion.value || !currentAnswer.value) return ''
  return (
    currentQuestion.value.options.find((o) => o.value === currentAnswer.value)
      ?.narr ?? ''
  )
})

const liveHint = computed(() => {
  if (deltaInfo.value.show) {
    if (deltaInfo.value.val > 0) return "You're boosting your energy score!"
    if (deltaInfo.value.val < 0)
      return 'Your score dipped — try another option.'
  }
  if (selectedNarr.value) return selectedNarr.value
  if (!currentAnswer.value)
    return 'Each answer refines your real score in real time.'
  const answered = Object.keys(answers.value).length
  return `${answered} of ${QUESTIONS.length} answered`
})

const scoreBand = computed(() => {
  const s = liveScore.value
  if (s >= 80) return 'Excellent — top of the market'
  if (s >= 65) return 'Strong — better than most'
  if (s >= 50) return 'Average — room to improve'
  if (s >= 35) return 'Below average — fixable'
  return 'Plenty of opportunities'
})

// ── Score helpers ─────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return '#1f7a66'
  if (score >= 60) return '#16a34a'
  if (score >= 40) return '#f59e0b'
  return '#dc2626'
}

function epcColor(rating: string): string {
  const map: Record<string, string> = {
    A: '#00b050',
    B: '#33b800',
    C: '#92d050',
    D: '#d4e800',
    E: '#ffbf00',
    F: '#ff6600',
    G: '#ff0000',
  }
  return map[rating?.toUpperCase()] ?? '#8e8e93'
}

// ── Pillar bars ───────────────────────────────────────────────

const PILLAR_DEFS = [
  { key: 'heating', label: 'Heating', max: 20, color: '#ef4444' },
  { key: 'structure', label: 'Structure', max: 25, color: '#231d45' },
  { key: 'efficiency', label: 'Efficiency', max: 20, color: '#00a19a' },
  { key: 'electrics', label: 'Electrics', max: 15, color: '#f59e0b' },
  { key: 'plumbing', label: 'Plumbing', max: 20, color: '#3b82f6' },
]

function pillarBars(breakdown: any) {
  return PILLAR_DEFS.map((d) => ({
    ...d,
    value: (breakdown as any)?.[d.key] ?? 0,
  }))
}

// ── Carbon ────────────────────────────────────────────────────

const CARBON_BASELINE = 2900

const carbonGradeInfo = computed(() => {
  const kg = carbonKg.value
  if (kg < 800) return { grade: 'A', label: 'Excellent', col: '#16a34a' }
  if (kg < 1400) return { grade: 'B', label: 'Good', col: '#65a30d' }
  if (kg < 2000) return { grade: 'C', label: 'Average', col: '#ca8a04' }
  if (kg < 2800) return { grade: 'D', label: 'Below avg', col: '#92400e' }
  if (kg < 3800) return { grade: 'E', label: 'Poor', col: '#ea580c' }
  if (kg < 4800) return { grade: 'F', label: 'Very poor', col: '#dc2626' }
  return { grade: 'G', label: 'Critical', col: '#7f1d1d' }
})

const carbonGradient = computed(() => {
  const g = carbonGradeInfo.value.grade
  const map: Record<string, string> = {
    A: 'linear-gradient(135deg,#14532d,#166534)',
    B: 'linear-gradient(135deg,#365314,#3f6212)',
    C: 'linear-gradient(135deg,#713f12,#854d0e)',
    D: 'linear-gradient(135deg,#78350f,#92400e)',
    E: 'linear-gradient(135deg,#7c2d12,#92400e)',
    F: 'linear-gradient(135deg,#7f1d1d,#991b1b)',
    G: 'linear-gradient(135deg,#450a0a,#7f1d1d)',
  }
  return map[g] ?? map.D
})

const carbonVsAvg = computed(() => {
  const diff = carbonKg.value - CARBON_BASELINE
  if (Math.abs(diff) < 100) return 'Roughly the same as the UK average'
  if (diff < 0)
    return `${Math.abs(diff).toLocaleString()} kg below the UK average — great work`
  return `${diff.toLocaleString()} kg above the UK average of ${CARBON_BASELINE.toLocaleString()} kg`
})

const carbonBarChart = computed(() => {
  const grade = carbonGradeInfo.value.grade
  return [
    { letter: 'A', color: '#16a34a', h: 8 },
    { letter: 'B', color: '#65a30d', h: 12 },
    { letter: 'C', color: '#ca8a04', h: 16 },
    { letter: 'D', color: '#92400e', h: 20 },
    { letter: 'E', color: '#ea580c', h: 16 },
    { letter: 'F', color: '#dc2626', h: 12 },
    { letter: 'G', color: '#7f1d1d', h: 8 },
  ].map((b) => ({ ...b, active: b.letter === grade }))
})

const carbonDrivers = computed(() => {
  const drivers: Array<{
    bad: boolean
    icon: string
    label: string
    delta: number
  }> = []
  for (const q of QUESTIONS) {
    const val = (answers.value as Record<string, string>)[q.id]
    if (!val) continue
    const opt = q.options.find((o) => o.value === val)
    if (!opt) continue
    if (opt.carbonDelta > 400)
      drivers.push({
        bad: true,
        icon: '⬆',
        label: `${q.cat}: ${opt.label}`,
        delta: opt.carbonDelta,
      })
    else if (opt.carbonDelta < -400)
      drivers.push({
        bad: false,
        icon: '⬇',
        label: `${q.cat}: ${opt.label}`,
        delta: opt.carbonDelta,
      })
  }
  drivers.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
  return drivers.slice(0, 4)
})

const carbonSaving = computed(() =>
  Math.max(0, carbonKg.value - Math.max(400, carbonKg.value - 2500)),
)
const carbonPct = computed(() =>
  Math.round((carbonSaving.value / carbonKg.value) * 100),
)

// ── Neighbourhood ─────────────────────────────────────────────

function scoreToCost(s: number): number {
  if (s >= 80) return 680
  if (s >= 70) return 890
  if (s >= 60) return 1040
  if (s >= 50) return 1200
  if (s >= 40) return 1347
  return 1490
}

const neighbourhood = computed(() => {
  const s = result.value.total
  const addr = property.value?.addressLine1 ?? 'Your road'
  const parts = addr.split(' ')
  const streetName = parts.slice(1).join(' ')
  const yourNum = parseInt(parts[0] ?? '61', 10)

  return [
    {
      label: `${yourNum + 2} ${streetName}`,
      score: Math.min(100, s + 18),
      isYou: false,
      detail: 'Heat pump · solar · EPC A',
    },
    {
      label: `${yourNum - 4} ${streetName}`,
      score: Math.min(100, s + 9),
      isYou: false,
      detail: 'New boiler (2022) · loft insulation',
    },
    {
      label: `${yourNum - 6} ${streetName}`,
      score: Math.min(100, s + 3),
      isYou: false,
      detail: 'Double glazed · EPC C',
    },
    {
      label: `${addr} — you`,
      score: s,
      isYou: true,
      detail: 'Your current status',
    },
    {
      label: `${yourNum - 2} ${streetName}`,
      score: Math.max(0, s - 9),
      isYou: false,
      detail: 'Single glazed · no upgrades',
    },
  ]
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({
      ...r,
      rank: i + 1,
      cost: scoreToCost(r.score),
      costColor:
        r.score >= 70 ? '#16a34a' : r.score >= 55 ? '#92400e' : '#dc2626',
    }))
})

const nbRank = computed(
  () => neighbourhood.value.find((n) => n.isYou)?.rank ?? 4,
)
const nbGap = computed(() => {
  const me = neighbourhood.value.find((n) => n.isYou)
  const best = neighbourhood.value[0]
  return me && best && !best.isYou ? Math.max(0, me.cost - best.cost) : 0
})
const nbGapReasons = computed(() => {
  const a = answers.value as Record<string, string>
  const reasons = []
  if (
    !a.heatingType ||
    ['old_gas', 'oil', 'electric', 'none_heat'].includes(a.heatingType)
  )
    reasons.push({
      icon: '🔥',
      title: 'Older heating system',
      body: 'running at lower efficiency vs modern heat pumps or A-rated boilers. Costs extra ~£210/yr.',
    })
  if (!a.loftInsulation || ['minimal', 'partial'].includes(a.loftInsulation))
    reasons.push({
      icon: '🏠',
      title: 'No or partial loft insulation',
      body: '25% of heat escapes through the roof. Topping up to 270mm saves ~£320/yr extra.',
    })
  if (!a.windows || ['single', 'mix'].includes(a.windows))
    reasons.push({
      icon: '🪟',
      title: 'Single or mixed glazing',
      body: 'Replacing remaining single-glazed windows saves ~£140/yr and lifts your EPC rating.',
    })
  if (reasons.length === 0)
    reasons.push({
      icon: '⚡',
      title: 'Energy efficiency gap',
      body: 'Completing further upgrades would bring you closer to the top of your street.',
    })
  return reasons.slice(0, 3)
})

// ── Actions ───────────────────────────────────────────────────

function startQuestions() {
  // No-EPC path: run the self-contained visitor estimator (exact clone).
  // Without an EPC there's no anchor score for the owner quiz to refine.
  if (!property.value?.epcRating) {
    screen.value = 'no-epc-estimator'
    return
  }
  // Read-only mode: don't let non-owners run the quiz
  if (readOnlyMode.value) {
    router.push(`/property/${propertyId}`)
    return
  }
  // Guests are allowed into the simulator — auth is gated later in the
  // funnel (at "Publish to <address>" / KYC), matching the prototype flow.
  const firstUnanswered = QUESTIONS.findIndex(
    (q) => !(answers.value as Record<string, string>)[q.id],
  )
  step.value = firstUnanswered >= 0 ? firstUnanswered : 0
  screen.value = 'questions'
}

// ── HomeScore Accuracy Simulator (replaces the old quiz UI) ────
// Mirrors `homescore-v2_13.html` simulator: 6 improvement steps with
// per-step score / £ / CO₂ deltas. We keep our existing useHomeScore
// composable available, but the simulator manages its own state and
// posts the final score via `saveSimulatorResult()`.

type SimStatus = 'idle' | 'done' | 'diff' | 'todo' | 'skip'
interface SimStep {
  id: string
  title: string
  meta: string
  desc: string
  impact: string
  question: string
  doneLabel?: string
  scoreDelta: number // pts added to starting score when status === 'done' (or 'diff')
  costSaving: number // £/yr knocked off bills
  co2Delta: number // tonnes/yr knocked off CO₂
  status: SimStatus
  diffNote?: string
}

const SIM_STEP_DEFS: Omit<SimStep, 'status'>[] = [
  {
    id: 'loft',
    title: 'Increase loft insulation to 270mm',
    meta: 'Currently 75mm · EPC: Average',
    desc: 'Your EPC records 75mm of loft insulation — the recommended level is 270mm. Topping this up is one of the cheapest and most effective improvements available.',
    impact: 'Score +2 pts · saves ~£40/yr · cost £100–£350',
    question: 'Has this been done since the last EPC?',
    scoreDelta: 2,
    costSaving: 40,
    co2Delta: 0.2,
  },
  {
    id: 'cavity',
    title: 'Cavity wall insulation',
    meta: 'Uninsulated cavity · EPC: Poor',
    desc: 'The biggest single saving available. Part of the cavity wall is uninsulated — filling it stops heat escaping through the walls. ECO4 or Warm Homes grants may cover the full cost.',
    impact:
      'Score +7 pts · saves ~£224/yr · cost £500–£1,500 · ECO4 grant may apply',
    question: 'Has cavity wall insulation been filled since the last EPC?',
    scoreDelta: 7,
    costSaving: 224,
    co2Delta: 1.0,
  },
  {
    id: 'floor',
    title: 'Floor insulation',
    meta: 'Suspended floor, no insulation · EPC: N/A',
    desc: 'The suspended timber floor has no insulation — cold air from below makes rooms harder to heat. Insulating this improves both comfort and efficiency.',
    impact: 'Score +3 pts · saves ~£97/yr · cost £800–£1,200',
    question: 'Has floor insulation been added since the last EPC?',
    scoreDelta: 3,
    costSaving: 97,
    co2Delta: 0.4,
  },
  {
    id: 'led',
    title: 'Low energy lighting throughout',
    meta: '15% low energy lighting · EPC: Poor',
    desc: 'Only 15% of fixed lighting outlets use low energy bulbs. Switching all to LED is quick, cheap and immediate — no installer required.',
    impact: 'Score +2 pts · saves ~£45/yr · cost just £110',
    question: 'Have you switched to LED lighting since the last EPC?',
    doneLabel: 'Yes — mostly LED now',
    scoreDelta: 2,
    costSaving: 45,
    co2Delta: 0.1,
  },
  {
    id: 'solar-thermal',
    title: 'Solar water heating',
    meta: 'No solar thermal on EPC',
    desc: 'Solar thermal panels use the sun to heat your water, reducing how hard your boiler works.',
    impact: 'Score +1 pt · saves ~£40/yr · cost £4,000–£6,000',
    question: 'Has solar water heating been installed since the last EPC?',
    doneLabel: 'Yes — fitted',
    scoreDelta: 1,
    costSaving: 40,
    co2Delta: 0.1,
  },
  {
    id: 'solar-pv',
    title: 'Solar photovoltaic panels',
    meta: 'No solar PV on EPC · recommended',
    desc: 'Solar PV generates electricity from sunlight — cutting your electricity bill and earning Smart Export Guarantee payments for surplus energy.',
    impact:
      'Score +8 pts · saves ~£248/yr · Smart Export Guarantee payments too',
    question: 'Have solar panels been installed since the last EPC?',
    doneLabel: 'Yes — panels fitted',
    scoreDelta: 8,
    costSaving: 248,
    co2Delta: 1.0,
  },
]

/**
 * Build the "meta" line shown under each simulator step's title using REAL
 * EPC fields from the property when available. Falls back to the static
 * hardcoded string only when no relevant EPC data is on file.
 *
 * The lookup keys on the title/id of the step:
 *   - loft / roof         → roofEnergyEff (+ roof-description if rich text)
 *   - cavity / wall       → wallsEnergyEff
 *   - floor               → floorEnergyEff (+ floorDescription)
 *   - glazing / windows   → windowsEnergyEff
 *   - lighting / LED      → lowEnergyLighting % + lightingEnergyEff
 *   - boiler / main heat  → mainheatEnergyEff
 *   - solar water / thermal → solarWaterHeatingFlag (Y/N)
 *   - solar PV / panel    → photoSupply (kW)
 */
function buildStepMeta(hint: string, property: any, fallback?: string): string {
  const p = property || {}
  const h = (hint || '').toLowerCase()
  const eff = (s: string | null | undefined) =>
    s && String(s).trim() ? `EPC: ${s}` : 'EPC: N/A'

  // Solar PV first (more specific than just "solar")
  if (/solar.*(pv|panel|photovolt)|photovoltaic/.test(h)) {
    const kw = Number(p.photoSupply) || 0
    return kw > 0
      ? `${kw} kW solar PV installed`
      : 'No solar PV on EPC · recommended'
  }
  if (/solar.*(water|hot|thermal)|thermal\s+panel/.test(h)) {
    const has = p.solarWaterHeatingFlag === 'Y'
    return has ? 'Solar thermal: Yes' : 'No solar thermal on EPC'
  }
  // Loft / roof — prefer the EPC free-text description (often contains the
  // current insulation depth, e.g. "Pitched, 100 mm loft insulation"),
  // then append the rating.
  if (/loft|roof/.test(h)) {
    return joinDescAndEff(p.roofDescription, p.roofEnergyEff)
  }
  // Cavity / external walls — EPC description usually says "Cavity wall, as
  // built, no insulation (assumed)" or "Cavity wall, filled, …".
  if (/cavity|external\s+wall|\bwall/.test(h)) {
    return joinDescAndEff(p.wallsDescription, p.wallsEnergyEff)
  }
  // Floor — already had description, now use the same join helper.
  if (/floor/.test(h)) {
    return joinDescAndEff(p.floorDescription, p.floorEnergyEff)
  }
  // Glazing / windows — description is typically "Single glazed",
  // "Fully double glazed", etc.
  if (/glaz|window/.test(h)) {
    return joinDescAndEff(p.windowsDescription, p.windowsEnergyEff)
  }
  if (/light|led|lamp|bulb/.test(h)) {
    if (typeof p.lowEnergyLighting === 'number') {
      const pct = Math.round(p.lowEnergyLighting)
      const tail = p.lightingEnergyEff ? ` · ${eff(p.lightingEnergyEff)}` : ''
      return `${pct}% low energy lighting${tail}`
    }
    return eff(p.lightingEnergyEff)
  }
  // Boiler / main heating — description is typically
  // "Boiler and radiators, mains gas" or "Heat pump, …".
  if (/boiler|main\s+heat|heating\s+system/.test(h) && !/water/.test(h)) {
    return joinDescAndEff(p.mainheatDescription, p.mainheatEnergyEff)
  }
  // Nothing matched — return the caller's fallback if provided.
  return fallback ?? 'EPC recommendation'
}

/**
 * Format "<EPC description> · EPC: <rating>" where both halves are
 * present, falling back gracefully if either is missing.
 *   - both:   "100 mm loft insulation · EPC: Average"
 *   - desc only: "Cavity wall, as built, no insulation"
 *   - rating only: "EPC: Poor"
 *   - neither: "EPC: N/A"
 */
function joinDescAndEff(
  desc: string | null | undefined,
  eff: string | null | undefined,
): string {
  const d = (desc || '').trim()
  const e = (eff || '').trim()
  if (d && e) return `${d} · EPC: ${e}`
  if (d) return d
  if (e) return `EPC: ${e}`
  return 'EPC: N/A'
}

/**
 * The simulator card list. When the property has real EPC recommendations
 * (from `/api/v1/domestic/recommendations`) we render those instead of the
 * hardcoded `SIM_STEP_DEFS` fallback. Each user answer is kept in
 * `simStepStatuses` (keyed by step id) so a re-derivation of the list (e.g.
 * when EPC data lazily lands) doesn't wipe their progress.
 */
const simStepStatuses = ref<Record<string, SimStatus>>({})
const simStepDiffNotes = ref<Record<string, string>>({})

const simSteps = computed<SimStep[]>(() => {
  const recs = (property.value as any)?.epcRecommendations
  const p = property.value
  const base: Omit<SimStep, 'status' | 'diffNote'>[] =
    Array.isArray(recs) && recs.length > 0
      ? recs.slice(0, 6).map((r: any) => epcRecToSimStepBase(r, p))
      : SIM_STEP_DEFS.map((d) => ({
          ...d,
          // Rebuild the meta from real EPC fields on the property — falls
          // back to the static SIM_STEP_DEFS string when no relevant field
          // is on file (e.g. property hasn't been EPC-enriched yet).
          meta: buildStepMeta(d.id, p, d.meta),
        }))
  return base.map((b) => ({
    ...b,
    status: simStepStatuses.value[b.id] ?? ('idle' as SimStatus),
    diffNote: simStepDiffNotes.value[b.id],
  }))
})

/**
 * Convert one EPC recommendation row → the static fields a SimStep needs.
 * The `typicalSaving` is real £/yr from EPC; cost ranges are real strings.
 * The `scoreDelta` is heuristically derived from the saving (anchored so a
 * £40/yr save ≈ +2pts, £200 ≈ +5pts, £400+ ≈ +8pts) — the EPC
 * "resulting SAP" isn't a per-recommendation delta, so this is the cleanest
 * way to feed the gauge without misleading numbers.
 */
function epcRecToSimStepBase(
  r: any,
  property: any,
): Omit<SimStep, 'status' | 'diffNote'> {
  const saving = Number(r?.typicalSaving) || 0
  const scoreDelta =
    saving >= 400 ? 8 : saving >= 200 ? 5 : saving >= 80 ? 3 : 2
  // Rough kg-CO₂ proxy: heating-dominant improvements emit ~0.18 kg CO₂ per £
  // of typical-saving (UK gas grid factor). Caps at 1.2t to stay realistic.
  const co2Delta = Math.min(1.2, (Math.round(saving * 0.18) / 1000) * 1000) || 0
  const cost = String(r?.costRange ?? '').trim()
  const impactParts = [
    `Score +${scoreDelta} pts`,
    saving > 0 ? `saves ~£${saving}/yr` : null,
    cost ? `cost ${cost}` : null,
  ].filter(Boolean)
  // Build the meta from real property EPC fields where we can match the
  // recommendation title to an efficiency field. Falls back to the EPC's
  // cost range if no field matched.
  const recTitle = String(r?.title ?? '').trim() || 'Energy improvement'
  const fallbackMeta = cost
    ? `EPC recommendation · ${cost}`
    : 'EPC recommendation'
  return {
    id: String(r?.id ?? ''),
    title: recTitle,
    meta: buildStepMeta(recTitle, property, fallbackMeta),
    desc: String(r?.description ?? '').trim() || 'Recommended on your EPC.',
    impact: impactParts.join(' · '),
    question: 'Has this been done since the last EPC?',
    scoreDelta,
    costSaving: saving,
    co2Delta: Math.round(co2Delta * 10) / 10,
  }
}
const openStepId = ref<string | null>(null)
const simPath = ref<'quiz' | 'bill' | null>('quiz')
const simBillUploaded = ref(false)
const simDiffOpen = ref(false)
const simDiffStepId = ref<string | null>(null)
const simDiffText = ref('')

// ── Bill-upload drawer state ─────────────────────────────────
// When the user picks the "Upload a bill" path, we open a bottom-sheet
// drawer with a file picker + preview, similar to the Boost Score drawer.
const simBillDrawerOpen = ref(false)
const simBillFile = ref<File | null>(null)
const simBillError = ref('')
const simBillSavedFileName = ref<string | null>(null)

function openSimBillDrawer() {
  simBillError.value = ''
  simBillFile.value = null
  simBillDrawerOpen.value = true
}
function closeSimBillDrawer() {
  simBillDrawerOpen.value = false
  simBillError.value = ''
  simBillFile.value = null
}
function onSimBillFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    simBillError.value = 'File too large. Max 20MB.'
    if (input) input.value = ''
    return
  }
  simBillError.value = ''
  simBillFile.value = file
  if (input) input.value = ''
}
// Parsed-bill result (from POST /property/:id/bill-parse). Surfaces the OCR'd
// figures back into the EPC-nudge copy + the cost summary line. Available only
// to verified owners (the endpoint is JWT-gated).
const simParsedBill = ref<{
  annualSpend: number | null
  gasSpend: number | null
  electricitySpend: number | null
  supplier: string | null
  period: 'annual' | 'quarterly' | 'monthly' | 'unknown'
} | null>(null)
const simBillUploading = ref(false)

async function saveSimBill() {
  if (!simBillFile.value) {
    simBillError.value = 'Pick a file first.'
    return
  }
  if (simBillUploading.value) return
  simBillUploading.value = true
  simBillError.value = ''
  try {
    const token =
      typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    // Guests / non-owners: keep the local-only UX (just flip the flag so the
    // EPC nudge advances). The OCR endpoint is JWT-gated.
    if (!token) {
      simBillSavedFileName.value = simBillFile.value.name
      simBillUploaded.value = true
      showToast({ message: 'Bill uploaded', iconEmoji: '✓' })
      closeSimBillDrawer()
      return
    }
    const form = new FormData()
    form.append('file', simBillFile.value)
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId}/bill-parse`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      },
    )
    if (!res.ok) {
      simBillError.value =
        'Could not read the bill. Try a clearer photo or PDF.'
      return
    }
    const parsed = await res.json()
    simParsedBill.value = parsed
    simBillSavedFileName.value = simBillFile.value.name
    simBillUploaded.value = true
    // Toast adapts to what we extracted: if we parsed an annual figure,
    // surface it; otherwise generic success.
    const msg =
      typeof parsed?.annualSpend === 'number' && parsed.annualSpend > 0
        ? `Bill read · £${parsed.annualSpend.toLocaleString()}/yr`
        : 'Bill uploaded'
    showToast({ message: msg, iconEmoji: '✓' })
    closeSimBillDrawer()
  } catch (e) {
    simBillError.value = 'Upload failed — please try again.'
  } finally {
    simBillUploading.value = false
  }
}

// EPC year for the hero copy ("Your EPC is from <year>").
const simEpcYear = computed<string>(() => {
  const y =
    (property.value as any)?.epcYear ??
    (property.value as any)?.lodgementDate?.toString().slice(0, 4) ??
    new Date().getFullYear() - 8
  return String(y)
})

// Starting figures — use the EPC-only auto score as the baseline.
const simStartingScore = computed(() => autoScoreVal.value || 52)
const simBaseBills = computed(() => {
  const cert = (property.value as any)?.epcCert
  const total =
    Number(cert?.heatingCostCurrent ?? 0) +
    Number(cert?.hotWaterCostCurrent ?? 0) +
    Number(cert?.lightingCostCurrent ?? 0)
  return total > 0 ? Math.round(total) : 1823
})
const simBaseCo2 = computed(() => {
  // Carbon kg returned by useHomeScore; convert to tonnes.
  const t = (carbonKg.value || 6400) / 1000
  return Math.round(t * 10) / 10
})

// Accumulated improvements from steps with status 'done' or 'diff'.
const simAcceptedSteps = computed(() =>
  simSteps.value.filter((s) => s.status === 'done' || s.status === 'diff'),
)
const simScoreDeltaTotal = computed(() =>
  simAcceptedSteps.value.reduce((sum, s) => sum + s.scoreDelta, 0),
)
const simBillsDelta = computed(() =>
  simAcceptedSteps.value.reduce((sum, s) => sum + s.costSaving, 0),
)
const simCo2Delta = computed(
  () =>
    Math.round(
      simAcceptedSteps.value.reduce((sum, s) => sum + s.co2Delta, 0) * 10,
    ) / 10,
)

const simScore = computed(() =>
  Math.min(100, simStartingScore.value + simScoreDeltaTotal.value),
)
const simBills = computed(() =>
  Math.max(0, simBaseBills.value - simBillsDelta.value),
)
const simCo2 = computed(() =>
  Math.max(0, +(simBaseCo2.value - simCo2Delta.value).toFixed(1)),
)
const simVsNeighbours = computed(() => simBills.value - 1673)

const simAnsweredCount = computed(
  () => simSteps.value.filter((s) => s.status !== 'idle').length,
)
const simProgressPct = computed(
  () => (simAnsweredCount.value / simSteps.value.length) * 100,
)

// ── Animated stats: smooth count-up on first render + when the user
// changes an answer. Honours prefers-reduced-motion.
function makeAnimRef(source: () => number, durMs = 700, decimals = 0) {
  const out = ref(0)
  let raf = 0
  function animateTo(to: number) {
    // On the server (SSR) there is no rAF — just set the final value so the
    // initial render is correct and we don't throw during setup.
    const reduce =
      typeof window === 'undefined' ||
      typeof requestAnimationFrame === 'undefined' ||
      (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    if (reduce) {
      out.value = to
      return
    }
    cancelAnimationFrame(raf)
    const from = out.value
    if (from === to) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (to - from) * eased
      out.value =
        decimals === 0
          ? v
          : Math.round(v * Math.pow(10, decimals)) / Math.pow(10, decimals)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }
  watch(source, (v) => animateTo(Number(v) || 0), { immediate: true })
  return out
}
const simScoreAnimated = makeAnimRef(() => simScore.value, 700)
const simBillsAnimated = makeAnimRef(() => simBills.value, 700)
const simCo2Animated = makeAnimRef(() => simCo2.value, 700, 1)
const simVsNeighboursAnimated = makeAnimRef(() => simVsNeighbours.value, 600)
const simScoreDisplay = computed(() => Math.round(simScoreAnimated.value))
const simBillsDisplay = computed(() => Math.round(simBillsAnimated.value))
const simCo2Display = computed(() => simCo2Animated.value)
const simVsNeighboursDisplay = computed(() =>
  Math.round(simVsNeighboursAnimated.value),
)

// Typewriter helper (mirrors the per-character reveal used on street/[id].vue
// and ResultDetail.vue). Honours prefers-reduced-motion.
function makeTypewriterRef(source: () => string, msPerChar = 32) {
  const out = ref('')
  let timer: ReturnType<typeof setInterval> | null = null
  function start(text: string) {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    // On the server (SSR) there is no timer loop — render the full text so the
    // initial markup is complete and we don't call setInterval during setup.
    const reduce =
      typeof window === 'undefined' ||
      (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const full = text || ''
    if (reduce || !full) {
      out.value = full
      return
    }
    out.value = ''
    let i = 0
    timer = setInterval(() => {
      i += 1
      out.value = full.slice(0, i)
      if (i >= full.length && timer) {
        clearInterval(timer)
        timer = null
      }
    }, msPerChar)
  }
  watch(source, (v) => start(v || ''), { immediate: true })
  return out
}

const simScoreColor = computed(() => {
  const s = simScore.value
  if (s >= 75) return '#00514d'
  if (s >= 60) return '#2EAB55'
  if (s >= 40) return '#E6A23C'
  return '#C73E36'
})

const simScoreBand = computed(() => {
  const s = simScore.value
  const grade =
    s >= 92
      ? 'A · Exceptional'
      : s >= 81
        ? 'B · Highly efficient'
        : s >= 69
          ? 'C · Above average'
          : s >= 55
            ? 'D · Average'
            : s >= 39
              ? 'E · Poor'
              : s >= 21
                ? 'F · Very poor'
                : 'G · Critical'
  return `EPC ${grade}`
})

const simShowPublishPrompt = ref(false)
watch(simAnsweredCount, (n) => {
  if (n >= 3 && simPath.value === 'quiz') simShowPublishPrompt.value = true
})

// Mirrors the prototype's 4-state `simUpdateEpcNudge()`. State priority:
//   1. bill      — the user uploaded an actual energy bill
//   2. good      — refined score ≥ 69 (EPC A–C equivalent)
//   3. improved  — 3+ answers AND a meaningful £ saving (≥ £60/yr)
//   4. neutral   — early / few answers
const simEpcNudge = computed<{
  icon: string
  title: string
  body: string
  variant: 'bill' | 'good' | 'improved' | 'neutral'
  ctaLabel?: string
}>(() => {
  if (simBillUploaded.value) {
    return {
      variant: 'bill',
      icon: '💡',
      title: 'Your actual spend is feeding your score',
      body: `Your utility bill is more accurate than any EPC estimate. Your HomeScore, bills figure and carbon footprint now reflect what you're really paying — not what a ${simEpcYear.value} survey guessed.`,
    }
  }
  if (simScore.value >= 69) {
    return {
      variant: 'good',
      icon: '✅',
      title: 'Your home is already performing well',
      body: "Your updated score reflects the improvements you've made. You're in a strong position — no urgent action needed on your EPC right now.",
    }
  }
  if (simAnsweredCount.value >= 3 && simBillsDelta.value >= 60) {
    return {
      variant: 'improved',
      icon: '📋',
      title: "Your HomeScore is updated — your official EPC isn't",
      body: "The changes you've added are now reflected in your HomeScore, bills estimate and carbon footprint. Your official EPC won't change until you commission a new assessment — worth considering if you're thinking of selling.",
      ctaLabel: 'Get a new EPC — from £50 →',
    }
  }
  return {
    variant: 'neutral',
    icon: '🏷️',
    title: 'Every improvement counts',
    body: `As you answer the questions above, your bills estimate, carbon footprint and HomeScore update in real time — based on what's actually been done, not just your ${simEpcYear.value} EPC.`,
  }
})

function simBadge(status: SimStatus): string {
  if (status === 'done') return '✅'
  if (status === 'diff') return '🔄'
  if (status === 'todo') return '📋'
  if (status === 'skip') return '⊘'
  return ''
}

function simToggleStep(id: string) {
  openStepId.value = openStepId.value === id ? null : id
}

function simAnswer(id: string, status: SimStatus) {
  if (!simSteps.value.some((s) => s.id === id)) return
  simStepStatuses.value = { ...simStepStatuses.value, [id]: status }
  // Collapse the step after a choice.
  openStepId.value = null
}

function simOpenDiff(id: string) {
  simDiffStepId.value = id
  simDiffText.value = simStepDiffNotes.value[id] || ''
  simDiffOpen.value = true
}

function simCloseDiff() {
  simDiffOpen.value = false
  simDiffStepId.value = null
  simDiffText.value = ''
}

function simConfirmDiff() {
  const id = simDiffStepId.value
  if (id && simSteps.value.some((s) => s.id === id)) {
    simStepStatuses.value = { ...simStepStatuses.value, [id]: 'diff' }
    const trimmed = simDiffText.value.trim()
    if (trimmed) {
      simStepDiffNotes.value = { ...simStepDiffNotes.value, [id]: trimmed }
    }
    openStepId.value = null
  }
  simCloseDiff()
}

function simSelectPath(p: 'quiz' | 'bill') {
  simPath.value = p
  if (p === 'bill') {
    openStepId.value = null
    // Prototype behaviour: tapping "Upload a bill" opens the upload drawer
    // immediately. The picker tile below the path cards is only shown as a
    // fallback if the bill drawer is closed without uploading.
    if (!simBillUploaded.value) openSimBillDrawer()
  }
}

function simReset() {
  // simSteps is a computed (derived from property.epcRecommendations or
  // SIM_STEP_DEFS); resetting means clearing all per-step status/diff state.
  simStepStatuses.value = {}
  simStepDiffNotes.value = {}
  openStepId.value = null
  simPath.value = 'quiz'
  simBillUploaded.value = false
  simShowPublishPrompt.value = false
  simDiffText.value = ''
}

async function saveSimulatorResult() {
  if (!isPropertyOwner.value) return
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  const answersMap: Record<string, string> = {}
  for (const s of simSteps.value) {
    answersMap[`sim_${s.id}`] = s.status
    if (s.diffNote) answersMap[`sim_${s.id}_note`] = s.diffNote
  }
  try {
    await fetch(`${config.public.apiBase}/property/${propertyId}/homescore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        total: simScore.value,
        rating: simScoreBand.value,
        answers: answersMap,
      }),
    })
  } catch {}
}

function simSubmit() {
  saveSimulatorResult()
  screen.value = 'results'
  showResult.value = true
}

// ── Post-Quiz screen helpers (refined results) ───────────────
// Refined bills figure shown in the hero — already computed from sim deltas.
const pqRefinedBills = computed(() => simBills.value)
// Live "today" search count from PropertySearchLog (via /search-stats).
// Returns 0 when stats haven't loaded yet — the row hides via v-if.
const pqSearches = computed<number>(() => searchStats.value?.today ?? 0)

const pqScoreColor = computed(() => simScoreColor.value)
const pqScoreTone = computed<'low' | 'mid' | 'high'>(() => {
  const s = simScore.value
  if (s >= 75) return 'high'
  if (s >= 50) return 'mid'
  return 'low'
})
const pqScoreBandLabel = computed<string>(() => {
  const s = simScore.value
  if (s >= 80) return 'Highly efficient'
  if (s >= 65) return 'Above average'
  if (s >= 50) return 'Average'
  if (s >= 35) return 'Below average'
  return 'Plenty of opportunities'
})
const pqScoreExplainer = computed<string>(() => {
  const s = simScore.value
  if (s >= 80)
    return 'In the top 20% of UK homes. Strong insulation and modern systems keep running costs well below average.'
  if (s >= 60)
    return 'Better than most UK homes. A few targeted upgrades could push this into the top tier.'
  if (s >= 40)
    return 'Plenty of room to improve. Targeted upgrades could meaningfully cut your bills.'
  return 'Your answers refined this from the public EPC estimate. Upload documents to push it further.'
})

// Refined per-pillar breakdown: take the EPC-derived baseline and credit
// each accepted simulator improvement to the pillar it belongs to.
const refinedBreakdownBars = computed(() => {
  const base = (autoBreakdown.value ?? {}) as unknown as Record<string, number>
  const pillar: Record<string, number> = {
    heating: base.heating ?? 0,
    structure: base.structure ?? 0,
    efficiency: base.efficiency ?? 0,
    electrics: base.electrics ?? 0,
    plumbing: base.plumbing ?? 0,
  }
  for (const step of simAcceptedSteps.value) {
    switch (step.id) {
      case 'loft':
      case 'cavity':
      case 'floor':
        pillar.structure += step.scoreDelta
        break
      case 'led':
      case 'solar-thermal':
        pillar.efficiency += step.scoreDelta
        break
      case 'solar-pv':
        pillar.electrics += step.scoreDelta
        break
    }
  }
  return [
    {
      key: 'heating',
      label: 'Heating',
      max: 20,
      value: Math.min(20, pillar.heating),
    },
    {
      key: 'structure',
      label: 'Structure',
      max: 25,
      value: Math.min(25, pillar.structure),
    },
    {
      key: 'efficiency',
      label: 'Efficiency',
      max: 20,
      value: Math.min(20, pillar.efficiency),
    },
    {
      key: 'electrics',
      label: 'Electrics',
      max: 15,
      value: Math.min(15, pillar.electrics),
    },
    {
      key: 'plumbing',
      label: 'Plumbing',
      max: 20,
      value: Math.min(20, pillar.plumbing),
    },
  ]
})

// Move to the publish funnel — gated so only verified owners reach the
// publish preview. See `gateOwnerAction()` for the chain.
function goToPublish() {
  gateOwnerAction('publish')
}

// ── Publish screen helpers ───────────────────────────────────
// Annual energy saving the owner is contributing.
const pubSavingAmount = computed(() => simBillsDelta.value || 0)
// Carbon saved (tonnes/yr) the owner is contributing.
const pubCarbonSaved = computed(() =>
  simCo2Delta.value > 0 ? simCo2Delta.value.toFixed(1) : '0.0',
)
// Score before the quiz (EPC-derived starting score).
const pubScoreBefore = computed(() => simStartingScore.value)
// % bar widths for the contribution rows. Saving and carbon are normalised
// against generous caps so even modest gains look meaningful on the bar.
const pubSavingPct = computed(() => {
  const v = pubSavingAmount.value
  // Cap at 500/yr — anything above maxes the bar.
  return Math.max(8, Math.min(95, Math.round((v / 500) * 100)))
})
const pubCarbonPct = computed(() => {
  const v = simCo2Delta.value
  // Cap at 2 tonnes/yr.
  return Math.max(8, Math.min(95, Math.round((v / 2) * 100)))
})

// Street name = address line minus the leading house number.
const pubStreetName = computed<string>(() => {
  const line = ((property.value as any)?.addressLine1 || '').trim()
  if (!line) return 'your street'
  const match = line.match(/^\d+\s*[a-zA-Z]?\s*[,.]?\s*(.+)$/)
  return match?.[1] || line
})
const pubOutcode = computed<string>(() => {
  const pc = ((property.value as any)?.postcode || '').trim()
  return pc.split(' ')[0] || 'this area'
})

// Street accuracy progress — fetched from GET /property/:id/street-publish-stats.
// Falls back to a sensible default while loading or if the endpoint errors.
const pubStreetTotal = ref(38)
const pubStreetPublished = ref(1)
const pubStreetPct = computed(() => {
  if (pubStreetTotal.value <= 0) return 0
  return Math.round((pubStreetPublished.value / pubStreetTotal.value) * 100)
})

async function loadStreetPublishStats() {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId}/street-publish-stats`,
    )
    if (!res.ok) return
    const data = await res.json()
    if (typeof data?.totalHomes === 'number' && data.totalHomes > 0) {
      pubStreetTotal.value = data.totalHomes
    }
    if (typeof data?.publishedHomes === 'number') {
      pubStreetPublished.value = data.publishedHomes
    }
  } catch {
    /* keep defaults */
  }
}

// Refresh stats whenever we land on publish/published so the UI is fresh
// (e.g. after the user just published — the count should now include them).
watch(screen, (s) => {
  if (s === 'publish' || s === 'published') void loadStreetPublishStats()
  if (s === 'buyer-results') void loadStreetEnergyRank()
})
const pubMilestones = [
  { target: 1, label: 'Pioneer 🏅' },
  { target: 5, label: 'Homes' },
  { target: 10, label: 'Homes' },
  { target: 25, label: 'Homes' },
]

/**
 * "Publish to <street>" CTA on the publish-preview screen.
 *
 * By the time the user is on this screen we've already routed them through
 * `gateOwnerAction('publish')`, so in the happy path they're a verified
 * owner with a claimed passport. We can publish directly — no KYC sub-flow,
 * just call `confirmPublish()` and land on the published screen.
 *
 * Defensive: if the user somehow arrived here without going through the gate
 * (deep-linked URL, browser back-button shenanigans), re-run the gate which
 * will send them through login + /claim before bouncing back here.
 */
async function onPublishToStreet() {
  if (readOnlyMode.value) {
    router.push(`/property/${propertyId}`)
    return
  }
  if (isGuest.value || !isPropertyOwner.value) {
    gateOwnerAction('publish')
    return
  }
  // Verified owner — step through the ownership-verification screen first
  // (Verify → Publish → Passport), which then confirms the publish.
  screen.value = 'kyc'
}

// User picked a KYC verification method. Records the intent via
// POST /property/:id/kyc/submit (server upserts an OwnershipVerification
// in SUBMITTED state); a worker will eventually flip it to VERIFIED via
// the real partner round-trip (Onfido / mortgage parser / Open Banking).
// We optimistically advance to kyc-pending — the kyc-pending screen could
// later poll /kyc/status if we want a strict gate before publishing.
type VerifyMethod = 'photo-id' | 'mortgage' | 'open-banking'
const kycMethod = ref<VerifyMethod | null>(null)
const kycSubmitting = ref(false)
async function verifyWith(method: VerifyMethod) {
  if (kycSubmitting.value) return
  kycMethod.value = method
  kycSubmitting.value = true
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  try {
    if (token) {
      await fetch(
        `${config.public.apiBase}/property/${propertyId}/kyc/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ method }),
        },
      )
    }
  } catch {
    // Non-fatal — proceed to the verified-state UI even if the network
    // hiccupped. A retry happens implicitly the next time the user re-enters
    // this screen.
  } finally {
    kycSubmitting.value = false
    screen.value = 'kyc-pending'
  }
}

// "Publish to <street>" — saves the latest simulator result if not yet
// saved, then calls POST /property/:id/homescore/publish to mark it
// published. Lands on the success screen on completion.
const publishLoading = ref(false)
async function confirmPublish() {
  if (publishLoading.value) return
  publishLoading.value = true
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  try {
    // Ensure the user's HomeScoreResult exists server-side first.
    await saveSimulatorResult()
    if (token) {
      await fetch(
        `${config.public.apiBase}/property/${propertyId}/homescore/publish`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
    }
  } catch {
    // swallow — the UI still advances, retry handled on next publish click
  } finally {
    publishLoading.value = false
    screen.value = 'published'
  }
}

function nextQuestion() {
  if (isLastStep.value) {
    screen.value = 'results'
    showResult.value = true
    saveToBackend()
  } else {
    next()
  }
}

function doRetake() {
  retakeHS()
  screen.value = 'landing'
}

async function claimOrAccessPassport() {
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    router.push(`/property/${propertyId}`)
    return
  }

  passportClaimLoading.value = true
  try {
    const { getPassportStatus } = usePassportClaim()
    const status = await getPassportStatus(propertyId)

    if (status.hasPassport && status.passportId) {
      if (
        status.isOwner ||
        status.isBuyer ||
        status.isCollaborator ||
        status.canAccess
      ) {
        router.push(`/passportview/${status.passportId}`)
      } else {
        // Passport claimed by someone else — go to property page for buy-access flow
        router.push(`/property/${propertyId}`)
      }
    } else {
      // No passport yet — send through the new claim + KYC flow
      router.push(`/claim/${propertyId}`)
    }
  } catch {
    router.push(`/property/${propertyId}`)
  } finally {
    passportClaimLoading.value = false
  }
}

async function setPassportTab(tab: PassportTab) {
  passportTab.value = tab
  if (tab === 'street' && streetProperties.value.length === 0)
    await fetchStreetData()
  if (tab === 'buyers' && matchedBuyers.value.length === 0)
    await fetchBuyerData()
}

async function fetchStreetData() {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId}/street`,
    )
    if (res.ok) {
      const data = await res.json()
      streetProperties.value = data.properties ?? []
      streetStats.value = data.stats ?? null
    }
  } catch {}
}

async function fetchBuyerData() {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId}/matched-buyers`,
    )
    if (res.ok) {
      const data = await res.json()
      matchedBuyers.value = data.buyers ?? []
      buyersTotal.value = data.total ?? 0
    }
  } catch {}
}

function goToPassport() {
  router.push(`/property/${propertyId}`)
}

// ── Buyer results helpers ─────────────────────────────────────

// Real per-property EPC running cost. The backend exposes these three
// figures directly on the property row (heating / hot water / lighting
// current cost). If none are on file yet we return null so the UI can show
// an honest "no verified figure" state rather than an invented number.
const buyerAnnualCost = computed<number | null>(() => {
  const p: any = property.value
  const heating = Number(p?.heatingCostCurrent ?? 0)
  const hotWater = Number(p?.hotWaterCostCurrent ?? 0)
  const lighting = Number(p?.lightingCostCurrent ?? 0)
  const sum = Math.round(heating + hotWater + lighting)
  return sum > 0 ? sum : null
})

// Buyer-results screen: address typewriter + £ count-up. Same pattern as
// ResultDetail so both flows feel consistent.
const bvAddressFull = computed(
  () => property.value?.addressLine1 || 'This property',
)
const bvAddressTyped = makeTypewriterRef(() => bvAddressFull.value, 32)
const bvAddressTypingDone = computed(
  () => bvAddressTyped.value.length >= bvAddressFull.value.length,
)
const bvAnnualCostAnimated = makeAnimRef(() => buyerAnnualCost.value ?? 0, 900)
// null when the backend has no verified running-cost figure on file.
const bvAnnualCostDisplay = computed<number | null>(() =>
  buyerAnnualCost.value == null ? null : Math.round(bvAnnualCostAnimated.value),
)

// ── Buyer-results (watch screen) helpers ─────────────────────

// Live street-energy rank from /property/:id/street-energy-rank. Hydrated
// once per page load and lazily refreshed when entering buyer-results.
const streetEnergyRank = ref<{
  rank: number | null
  total: number
  bestCost: number | null
  averageCost: number | null
  yourCost: number | null
} | null>(null)

async function loadStreetEnergyRank() {
  try {
    const res = await fetch(
      `${config.public.apiBase}/property/${propertyId}/street-energy-rank`,
    )
    if (!res.ok) return
    const data = await res.json()
    streetEnergyRank.value = data
  } catch {
    /* keep null — UI falls back gracefully */
  }
}

// Real cheapest-on-street figure from the backend street-energy-rank
// endpoint. null when fewer than 3 neighbours are enriched — the template
// hides the comparison line rather than showing an invented number.
const bvStreetBest = computed<number | null>(() => {
  const real = streetEnergyRank.value?.bestCost
  return typeof real === 'number' && real > 0 ? real : null
})

// "Nth" label (1st, 2nd, 3rd, 4th, …) for the cost-hero stats row.
// Returns null when we don't have enough comparable data for a rank yet,
// so the template can hide the slot entirely (see v-if on the stat).
const bvStreetRankLabel = computed<string | null>(() => {
  const r = streetEnergyRank.value?.rank
  if (typeof r !== 'number' || r < 1) return null
  const lastTwo = r % 100
  if (lastTwo >= 11 && lastTwo <= 13) return `${r}th`
  switch (r % 10) {
    case 1:
      return `${r}st`
    case 2:
      return `${r}nd`
    case 3:
      return `${r}rd`
    default:
      return `${r}th`
  }
})

const bvEpcColor = computed(() => {
  const map: Record<string, string> = {
    A: '#00B050',
    B: '#33B800',
    C: '#92D050',
    D: '#FFD700',
    E: '#FF9933',
    F: '#FF6600',
    G: '#E64A19',
  }
  return map[(property.value?.epcRating || '').toUpperCase()] || '#9c98ad'
})

const bvPassportState = computed<'unclaimed' | 'inProgress' | 'published'>(
  () => {
    const p: any = property.value
    if (!p) return 'unclaimed'
    if (p.passportPublished) return 'published'
    if (p.hasPassport) return 'inProgress'
    return 'unclaimed'
  },
)

// Live "today" search count from PropertySearchLog (via /search-stats).
const bvSearches = computed<number>(() => searchStats.value?.today ?? 0)
const bvMonthSearches = computed<number>(
  () => searchStats.value?.thisMonth ?? 0,
)
// Live "watching" count from the same /search-stats payload.
const bvWatchers = computed<number>(
  () => (searchStats.value as any)?.watchers ?? 0,
)

// Questions to ask the owner — built from the property's real EPC
// recommendations (title, cost range and typical £/yr saving all come
// straight from the backend). Empty when the EPC has no recommendations on
// file, in which case the whole section is hidden.
const bvQuestions = computed(() => {
  const out: { icon: string; title: string; sub: string }[] = []
  const recs = (property.value as any)?.epcRecommendations
  if (Array.isArray(recs)) {
    for (const r of recs.slice(0, 3)) {
      const saving = Number(r?.typicalSaving) || 0
      const cost = String(r?.costRange ?? '').trim()
      const bits = [
        "On this home's EPC as a recommended improvement.",
        saving > 0 ? `Saves ~£${saving}/yr` : null,
        cost ? `cost ${cost}` : null,
      ].filter(Boolean)
      out.push({
        icon: '🔧',
        title: `Ask about: ${String(r?.title ?? 'an EPC improvement').trim()}`,
        sub: bits.join(' · '),
      })
    }
  }
  // Always-relevant safety-document questions (general buyer due diligence,
  // not property-specific figures) — mirrors the deployed report.
  out.push({
    icon: '🔥',
    title: 'Do you have a Gas Safety certificate?',
    sub: 'A CP12 from a Gas Safe registered engineer confirms the boiler and gas appliances are safe — ask for the latest one.',
  })
  out.push({
    icon: '⚡',
    title: 'Do you have an EICR certificate?',
    sub: 'Electrical Installation Condition Report — not legally required, but worth asking.',
  })
  return out
})

// ── Buyer report tabs (Energy / Costs / Sold / Risks / Area) ──────────
type BuyerTab = 'energy' | 'costs' | 'sold' | 'risks' | 'area'
const buyerTab = ref<BuyerTab>('energy')
const buyerTabs: { id: BuyerTab; label: string; icon: string }[] = [
  { id: 'energy', label: 'Energy', icon: '⚡' },
  { id: 'costs', label: 'Costs', icon: '💰' },
  { id: 'sold', label: 'Sold', icon: '🏷️' },
  { id: 'risks', label: 'Risks', icon: '⚠️' },
  { id: 'area', label: 'Area', icon: '📍' },
]

// ── Area tab — real crime data from data.police.uk ────────────
// Public, keyless API. `crimes-street/all-crime?lat=&lng=&date=YYYY-MM`
// returns every street-level crime within a 1-mile radius of the point for
// that month. We load the latest available month lazily when the Area tab is
// first opened, then aggregate by category for the breakdown bars.
const CRIME_LABELS: Record<string, string> = {
  'anti-social-behaviour': 'Anti-social behaviour',
  'bicycle-theft': 'Bicycle theft',
  burglary: 'Burglary',
  'criminal-damage-arson': 'Criminal damage & arson',
  drugs: 'Drugs',
  'other-crime': 'Other crime',
  'other-theft': 'Other theft',
  'possession-of-weapons': 'Possession of weapons',
  'public-order': 'Public order',
  robbery: 'Robbery',
  shoplifting: 'Shoplifting',
  'theft-from-the-person': 'Theft from the person',
  'vehicle-crime': 'Vehicle crime',
  'violent-crime': 'Violence & sexual offences',
}
type AreaCrime = {
  status: 'loading' | 'ready' | 'empty' | 'error'
  month: string | null
  total: number
  categories: { key: string; label: string; count: number }[]
}
const areaCrime = ref<AreaCrime | null>(null)

function formatCrimeMonth(m: string): string {
  const [y, mo] = m.split('-').map(Number)
  const d = new Date(y, (mo || 1) - 1, 1)
  return isNaN(d.getTime())
    ? m
    : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

async function loadAreaCrime() {
  if (areaCrime.value) return // already attempted
  const p: any = property.value
  const lat = Number(p?.latitude)
  const lng = Number(p?.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    areaCrime.value = { status: 'empty', month: null, total: 0, categories: [] }
    return
  }
  areaCrime.value = { status: 'loading', month: null, total: 0, categories: [] }
  try {
    // Newest available month (police data lags ~2 months).
    let month = ''
    try {
      const dRes = await fetch('https://data.police.uk/api/crimes-street-dates')
      if (dRes.ok) {
        const dates = await dRes.json()
        month = Array.isArray(dates) && dates[0]?.date ? dates[0].date : ''
      }
    } catch {}
    if (!month) {
      const now = new Date()
      now.setMonth(now.getMonth() - 2)
      month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    }
    const res = await fetch(
      `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${month}`,
    )
    if (!res.ok) throw new Error(String(res.status))
    const crimes = await res.json()
    if (!Array.isArray(crimes) || crimes.length === 0) {
      areaCrime.value = { status: 'empty', month, total: 0, categories: [] }
      return
    }
    const counts: Record<string, number> = {}
    for (const c of crimes) {
      const key = String(c?.category ?? 'other-crime')
      counts[key] = (counts[key] ?? 0) + 1
    }
    const categories = Object.entries(counts)
      .map(([key, count]) => ({
        key,
        label: CRIME_LABELS[key] ?? key,
        count,
      }))
      .sort((a, b) => b.count - a.count)
    areaCrime.value = {
      status: 'ready',
      month,
      total: crimes.length,
      categories,
    }
  } catch {
    areaCrime.value = { status: 'error', month: null, total: 0, categories: [] }
  }
}

// Lazy-load the crime data the first time the Area tab is opened.
watch(buyerTab, (t) => {
  if (t === 'area') loadAreaCrime()
})

// Costs tab — real backend figures. Prefers the /running-costs breakdown
// (energy from the EPC tariff model + water regional avg + council tax band),
// which is what the deployed app and the standalone costs page show. Falls
// back to the bare property fields until running-costs resolves. All numbers
// come from the backend — the water figure is the region's published average
// (labelled as such), not an invented per-property estimate.
const buyerCosts = computed(() => {
  const p: any = property.value
  const rc: any = runningCosts.value

  const energy: number | null =
    rc?.energy?.total ?? buyerAnnualCost.value ?? null
  const water: number | null = rc?.water?.cost ?? null
  const waterLabel: string | null = rc?.water?.label ?? null
  const councilTax: number | null =
    rc?.councilTax?.cost ?? p?.councilTaxAnnual ?? null
  const councilTaxBand: string | null =
    rc?.councilTax?.band ?? p?.councilTaxBand ?? null
  const council: string | null =
    rc?.councilTax?.council ?? p?.councilTaxCouncilName ?? null

  const total = (energy ?? 0) + (water ?? 0) + (councilTax ?? 0)
  return {
    energy,
    water,
    waterLabel,
    councilTax,
    councilTaxBand,
    council,
    hasAny: energy != null || water != null || councilTax != null,
    total,
  }
})

// Sold tab — estimated value + last Land Registry sale (real fields).
const buyerSold = computed(() => {
  const p: any = property.value
  const sh = soldHistory.value
  // Sale history for this exact address — prefer the Land Registry list,
  // fall back to the single lastSold* fields on the property record.
  const own: any[] = (sh?.thisProperty ?? []).slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const lastFromHistory = own[0] ?? null
  const nearby: any[] = (sh?.nearbySales ?? [])
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
  return {
    estimated: p?.estimatedPrice ?? null,
    lastPrice: lastFromHistory?.price ?? p?.lastSoldPrice ?? null,
    lastDate: lastFromHistory?.date ?? p?.lastSoldDate ?? null,
    history: own,
    comparables: nearby,
  }
})
function formatSoldDate(d: string): string {
  const date = new Date(d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
// Title-cases a Land Registry address ("78, MANTILLA DRIVE" → "78, Mantilla Drive").
function titleCaseAddress(s: string): string {
  return String(s || '')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
const buyerFlood = computed<string | null>(() => property.value?.floodRisk ?? null)

// Public-record risk rows from the backend running-costs endpoint (flood,
// mining subsidence, planning). Same source the deployed app / costs page use.
// tone: 'warn' for low/medium/high flags, 'ok' for a clear result.
const buyerPublicRisks = computed(() => {
  const risks: any = runningCosts.value?.risks
  if (!risks) return [] as { key: string; icon: string; title: string; body: string; pill: string; tone: 'warn' | 'ok' }[]
  const rows: { key: string; icon: string; title: string; body: string; pill: string; tone: 'warn' | 'ok' }[] = []
  const map: { key: string; icon: string; title: string }[] = [
    { key: 'flood', icon: '🌊', title: 'Flood risk' },
    { key: 'mining', icon: '⛏️', title: 'Mining subsidence' },
    { key: 'planning', icon: '📋', title: 'Planning history' },
  ]
  for (const m of map) {
    const r = risks[m.key]
    if (!r) continue
    rows.push({
      key: m.key,
      icon: m.icon,
      title: `${m.title} — ${r.pill}`,
      body: r.label,
      pill: r.pill,
      tone: r.level === 'clear' ? 'ok' : 'warn',
    })
  }
  return rows
})

const buyerEpcGrade = computed(() => {
  const rating = property.value?.epcRating
  if (rating) return String(rating).toUpperCase()
  const score = autoScoreVal.value
  if (score >= 92) return 'A'
  if (score >= 81) return 'B'
  if (score >= 69) return 'C'
  if (score >= 55) return 'D'
  if (score >= 39) return 'E'
  if (score >= 21) return 'F'
  return 'G'
})

const buyerRisks = computed(() => {
  type Row = {
    key: string
    icon: string
    title: string
    body: string
    tone: 'warn' | 'ok'
  }
  const bd = autoBreakdown.value as any
  const pct = (v: number, m: number) => (m > 0 ? (v / m) * 100 : 0)

  const heatingPct = pct(bd?.heating ?? 0, 20)
  const structurePct = pct(bd?.structure ?? 0, 25)
  const electricsPct = pct(bd?.electrics ?? 0, 15)
  const plumbingPct = pct(bd?.plumbing ?? 0, 20)
  const efficiencyPct = pct(bd?.efficiency ?? 0, 20)

  const all: Row[] = []

  // Heating
  if (heatingPct < 60) {
    all.push({
      key: 'heating',
      icon: '🔥',
      title: 'Heating — needs attention',
      body: 'EPC flags old heating system. Boiler replacement could cost £2,500–£4,000.',
      tone: 'warn',
    })
  } else {
    all.push({
      key: 'heating',
      icon: '🔥',
      title: 'Heating — looks reasonable',
      body: 'Heating efficiency is in line with similar homes. Worth asking for the latest service record.',
      tone: 'ok',
    })
  }

  // Structure / insulation
  if (structurePct < 60) {
    all.push({
      key: 'structure',
      icon: '🧱',
      title: 'Insulation — below average',
      body: 'Likely no cavity wall insulation. Adds ~£400/yr vs best-in-street.',
      tone: 'warn',
    })
  } else {
    all.push({
      key: 'structure',
      icon: '🧱',
      title: 'Insulation — looks reasonable',
      body: 'Insulation appears adequate for the property age. Confirm any guarantees with the seller.',
      tone: 'ok',
    })
  }

  // Electrics
  if (electricsPct >= 60) {
    all.push({
      key: 'electrics',
      icon: '⚡',
      title: 'Electrics — looks reasonable',
      body: 'Average for a property of this age. Worth confirming EICR.',
      tone: 'ok',
    })
  } else {
    all.push({
      key: 'electrics',
      icon: '⚡',
      title: 'Electrics — worth checking',
      body: 'Ask for a recent EICR certificate to rule out rewiring costs.',
      tone: 'warn',
    })
  }

  // Ensure at least one green row if any pillar > 60%
  const anyOk =
    heatingPct >= 60 ||
    structurePct >= 60 ||
    electricsPct >= 60 ||
    plumbingPct >= 60 ||
    efficiencyPct >= 60
  if (anyOk && !all.some((r) => r.tone === 'ok')) {
    all.push({
      key: 'other',
      icon: '✓',
      title: 'Other systems — look reasonable',
      body: 'Several EPC pillars are average-or-better. Confirm documentation with the seller.',
      tone: 'ok',
    })
  }

  return all.slice(0, 3)
})

// ── Buyer confidence gauge ────────────────────────────────────
// Headline confidence read for buyers, driven by the real EPC-derived
// HomeScore + a count of pillars that fall below 60% of their max (the
// "flags" a buyer should look into). No invented data — all from the EPC.
const buyerConfidence = computed(() => {
  const s = Number(result.value.total) || 0
  const bd = autoBreakdown.value as any
  const maxes: Record<string, number> = {
    heating: 20,
    structure: 25,
    efficiency: 20,
    electrics: 15,
    plumbing: 20,
  }
  let flags = 0
  for (const k of Object.keys(maxes)) {
    const v = Number(bd?.[k] ?? 0)
    if (maxes[k] > 0 && v / maxes[k] < 0.6) flags++
  }
  let label: string
  let tone: 'good' | 'ok' | 'warn'
  if (s >= 80) {
    label = 'Strong — well documented'
    tone = 'good'
  } else if (s >= 65) {
    label = 'Solid — a few things to check'
    tone = 'ok'
  } else if (s >= 45) {
    label = 'Worth investigating'
    tone = 'ok'
  } else {
    label = 'Proceed with caution'
    tone = 'warn'
  }
  const note =
    flags > 0
      ? `${flags} ${flags === 1 ? 'flag' : 'flags'} from the public EPC — see the Risks tab`
      : 'No major flags on the public EPC'
  const color =
    tone === 'good' ? '#16a34a' : tone === 'ok' ? '#00a19a' : '#e6a23c'
  // dasharray for the r=32 ring used elsewhere on this page (2πr ≈ 201.06)
  const RING = 201.06
  return {
    score: s,
    label,
    tone,
    note,
    color,
    ringLen: RING,
    ringOffset: RING - (s / 100) * RING,
  }
})

// ── Watch this property — notification triggers (reference §6) ─
const bvWatchTriggers = computed(() => [
  {
    icon: '🏠',
    title: 'Owner claims this property',
    sub: "You'll get pinged the moment they verify ownership.",
  },
  {
    icon: '📋',
    title: 'Passport started or progress milestones hit',
    sub: "Get a ping at 25% / 50% / 75% so you can register interest before it's published.",
  },
  {
    icon: '🎉',
    title: 'Passport published · property goes live',
    sub: "Buy access for £15 — or free if you're a verified buyer.",
  },
  {
    icon: '🏘️',
    title: 'Comparable sales nearby',
    sub: `New Land Registry data on ${property.value?.postcode || 'this postcode'} — keeps your estimated value fresh.`,
  },
])

// ── Verified buyer upsell perks (reference §6) ────────────────
const bvVerifiedPerks = [
  {
    icon: '↑',
    title: 'Go to the front of the queue',
    sub: 'Owners see verified buyers first when choosing who to sell to.',
  },
  {
    icon: '✓',
    title: 'Get your Passport free on day one',
    sub: "Skip the £35 charge once you're verified and registered.",
  },
  {
    icon: '★',
    title: '3× more likely to have an offer accepted',
    sub: 'Owners favour verified buyers, so your offers land more often.',
  },
]

const { toggleSave } = usePropertyActions()
const { showToast } = useAppToast()

async function saveToBuyerProfile() {
  // The "Save to Buyer Profile" CTAs now direct the user to the new
  // Buyer Profile flow (/buyer-profile) where they build/share their own
  // verified buyer profile. Keeping `toggleSave` available elsewhere for
  // the wishlist feature — this button is the funnel into the profile build.
  // Auth-gate: if guest, send to sign-in with redirect-back.
  const tk =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (!tk) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', '/buyer-profile')
    }
    showAuthGate.value = true
    return
  }
  router.push('/buyer-profile')
}

// ── Watch this property drawer (mirrors deployed app) ─────────
// The buyer-report "Watch this property" button opens a bottom-sheet where
// the buyer picks which notifications to receive. On submit we persist the
// choice locally, then redirect to the property page (which registers the
// watch on their profile) — guests sign in first, exactly like the app.
const watchDrawerOpen = ref(false)
function openWatchDrawer() {
  watchDrawerOpen.value = true
}
function onWatchSubmit(prefs: Record<string, boolean>) {
  watchDrawerOpen.value = false
  // Remember the prefs + mark this property as watched so the button reflects
  // the state if the buyer returns here.
  try {
    localStorage.setItem(
      `hs_watch_${propertyId}`,
      JSON.stringify({ prefs, at: Date.now() }),
    )
    localStorage.setItem(`hs_notify_publish_${propertyId}`, String(Date.now()))
  } catch {}
  notifiedOfPublish.value = true
  showToast({ message: 'Watching this property', iconEmoji: '✓' })
  // Redirect to the property page, resuming after sign-in for guests.
  const target = `/property/${propertyId}?watched=1`
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) {
    try {
      localStorage.setItem('redirectAfterLogin', target)
    } catch {}
    router.push('/onboarding/signin')
    return
  }
  router.push(target)
}

// ── Quick wins / boost score ──────────────────────────────────

// Order mirrors the prototype's progressive unlock: utility bills first (the
// "hook"), then heating cert, then gas safety, then EPC/EICR/Planning. Each
// upload unlocks the next card so the user always has one new "next step".
const qwDocs = [
  {
    key: 'utility-bills',
    label: 'Utility Bills',
    sub: 'See your actual spend vs your EPC estimate — most impactful first step',
    pts: 12,
    icon: '💡',
    img: '/Boost/utilityBills.png',
    bg: '#FFFBEB',
  },
  {
    key: 'heating-cert',
    label: 'Heating System Certificate',
    sub: 'Upgraded boiler or system not yet reflected on your EPC',
    pts: 9,
    icon: '🔥',
    bg: '#FEF2F2',
  },
  {
    key: 'gas',
    label: 'Gas Safety Certificate',
    sub: 'Annual boiler service — Gas Safe registered engineer',
    pts: 10,
    icon: '🔧',
    bg: '#FFF7ED',
  },
  {
    key: 'epc',
    label: 'EPC Certificate',
    sub: 'Energy rating — required for any sale or rental',
    pts: 8,
    icon: '⚡',
    bg: '#FFFBEB',
  },
  {
    key: 'eicr',
    label: 'EICR Report',
    sub: 'Electrical check — removes a major buyer concern',
    pts: 7,
    icon: '🔌',
    bg: '#EEF2FF',
  },
  {
    key: 'planning',
    label: 'Planning Permission',
    sub: 'Extensions, conversions or permitted development',
    pts: 5,
    icon: '📋',
    bg: '#F0FDF4',
  },
]

// Sequential-unlock index: how many cards past the first are visible.
// Each successful upload bumps this so the next card slides into view.
const boostUnlocked = ref(0)

const qwPros = [
  {
    key: 'gassafe',
    label: 'Book a Gas Safe engineer',
    sub: 'Service your boiler · cert auto-lands in your score',
    icon: '🛠️',
    img: '/Boost/gasSafety.png',
    bg: '#fef3c7',
  },
  {
    key: 'electrician',
    label: 'Book an electrician (EICR)',
    sub: 'Electrical check · from £150',
    icon: '⚡',
    img: '/Boost/electrician.png',
    bg: '#eff6ff',
  },
  {
    key: 'epcassess',
    label: 'New EPC assessment',
    sub: 'From £60 · required if yours is 10+ years old',
    icon: '🏡',
    img: '/Boost/epcAssessment.png',
    bg: '#f0fdf4',
  },
]

// Tracks the saved file for each doc key (after the drawer is confirmed).
// Stores name + size so the row can show "View" / file meta afterwards.
interface UploadedDocEntry {
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: number
}
const uploadedDocs = reactive<Record<string, UploadedDocEntry | true>>({})

// Drawer state — opened by tapping a Boost Score row. Lets the user pick a
// file, preview the pending file, then Save to commit. Mirrors the landlord
// passport drawer (`lp-overlay` / `lp-modal`) for consistency.
const qwDrawerOpen = ref(false)
const qwDrawerDocKey = ref<string | null>(null)
const qwDrawerFile = ref<File | null>(null)
const qwDrawerError = ref('')

const qwDrawerDoc = computed(() =>
  qwDocs.find((d) => d.key === qwDrawerDocKey.value),
)
const qwDrawerExistingEntry = computed<UploadedDocEntry | null>(() => {
  const v = qwDrawerDocKey.value
    ? uploadedDocs[qwDrawerDocKey.value]
    : undefined
  return v && typeof v === 'object' ? (v as UploadedDocEntry) : null
})

function triggerDocUpload(docKey: string) {
  qwDrawerDocKey.value = docKey
  qwDrawerFile.value = null
  qwDrawerError.value = ''
  qwDrawerOpen.value = true
}

function onDrawerFilePicked(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) {
    qwDrawerError.value = 'File too large. Max 20MB.'
    if (input) input.value = ''
    return
  }
  qwDrawerError.value = ''
  qwDrawerFile.value = file
  if (input) input.value = ''
}

function saveDrawerDoc() {
  const key = qwDrawerDocKey.value
  const file = qwDrawerFile.value
  if (!key || !file) {
    qwDrawerError.value = 'Pick a file first.'
    return
  }
  uploadedDocs[key] = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'application/octet-stream',
    uploadedAt: Date.now(),
  }
  // Advance the sequential unlock so the next card slides in.
  const idx = qwDocs.findIndex((d) => d.key === key)
  if (idx >= 0 && idx >= boostUnlocked.value) {
    boostUnlocked.value = Math.min(qwDocs.length - 1, idx + 1)
  }
  const doc = qwDocs.find((d) => d.key === key)
  showToast({
    message: `${doc?.label ?? 'Document'} saved`,
    iconEmoji: '✓',
  })
  qwDrawerOpen.value = false
  qwDrawerDocKey.value = null
  qwDrawerFile.value = null
}

function removeDrawerDoc() {
  const key = qwDrawerDocKey.value
  if (!key) return
  delete uploadedDocs[key]
  qwDrawerFile.value = null
  qwDrawerError.value = ''
  showToast({ message: 'Document removed', iconEmoji: '🗑️' })
}

function closeDrawer() {
  qwDrawerOpen.value = false
  qwDrawerDocKey.value = null
  qwDrawerFile.value = null
  qwDrawerError.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openMarketplace() {
  router.push('/marketplace')
}

const qwUploadedCount = computed(
  () => Object.values(uploadedDocs).filter(Boolean).length,
)
const qwUploadedPoints = computed(() =>
  qwDocs.reduce((sum, d) => (uploadedDocs[d.key] ? sum + d.pts : sum), 0),
)
const qwScore = computed(() =>
  Math.min(100, result.value.total + qwUploadedPoints.value),
)
const qwMoveReady = computed(() =>
  Math.min(100, Math.round((qwUploadedCount.value / qwDocs.length) * 100)),
)
const qwProgress = computed(() =>
  Math.min(100, Math.round((qwScore.value + qwMoveReady.value) / 2)),
)

async function claimFromMoveReady() {
  router.push(`/claim/${propertyId}`)
}

function goToClaim() {
  router.push(`/claim/${propertyId}`)
}

function goBack() {
  if (screen.value === 'passport') {
    screen.value = 'results'
    return
  }
  if (screen.value === 'buyer-results') {
    screen.value = 'landing'
    return
  }
  if (screen.value === 'quick-wins') {
    screen.value = 'results'
    return
  }
  if (screen.value === 'move-ready') {
    screen.value = 'quick-wins'
    return
  }
  if (screen.value === 'results') {
    screen.value = 'landing'
    return
  }
  if (screen.value === 'questions') {
    screen.value = 'landing'
    return
  }
  // Landing screen — step back in history so we return to wherever we came
  // from (property page, explore, etc.) without pushing a new entry. Falls
  // back to the property page if the user landed here directly.
  const hasInAppPrev =
    typeof window !== 'undefined' &&
    typeof (router.options.history as any)?.state?.back === 'string'
  if (hasInAppPrev) router.back()
  else router.replace(`/property/${propertyId}`)
}

async function saveToBackend() {
  // Only save to DB if this user is the verified property owner
  if (!isPropertyOwner.value) return
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  try {
    await fetch(`${config.public.apiBase}/property/${propertyId}/homescore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        total: result.value.total,
        rating: result.value.rating,
        heating: result.value.breakdown.heating,
        structure: result.value.breakdown.structure,
        efficiency: result.value.breakdown.efficiency,
        electrics: result.value.breakdown.electrics,
        plumbing: result.value.breakdown.plumbing,
        answers: answers.value,
      }),
    })
  } catch {}
}

// ── Lifecycle ─────────────────────────────────────────────────

onMounted(async () => {
  // Load property data — also returns hasPassport / passportPublished for guests.
  try {
    const res = await fetch(`${config.public.apiBase}/property/${propertyId}`)
    if (res.ok) {
      property.value = await res.json()
      prefill(property.value)
      // Seed passport state from public endpoint (used for guests).
      const p: any = property.value
      if (p?.hasPassport) {
        hasOtherOwnerPassport.value = true
        isOtherPassportPublished.value = !!p.passportPublished
      }
    }
  } catch {}

  // Full running-costs breakdown (energy + water + council tax + risks). This
  // is what powers the buyer report Costs & Risks tabs — the same backend
  // endpoint the standalone /homescore/costs page and the deployed app use.
  // Fire-and-forget: the tabs fall back to bare property fields until it lands.
  fetch(`${config.public.apiBase}/property/${propertyId}/running-costs`)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (j) runningCosts.value = j
    })
    .catch(() => {})

  // Land Registry sold history — powers the buyer report Sold tab (this
  // property's sale history + comparable sales nearby). Fire-and-forget.
  fetch(`${config.public.apiBase}/property/${propertyId}/sold-history`)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (j) {
        soldHistory.value = {
          thisProperty: Array.isArray(j.thisProperty) ? j.thisProperty : [],
          nearbySales: Array.isArray(j.nearbySales) ? j.nearbySales : [],
        }
      }
    })
    .catch(() => {})

  // Fire-and-forget: log this view + fetch search stats so we can render
  // the "People searched this address this month" card.
  try {
    const sid = getOrCreateSessionId()
    fetch(`${config.public.apiBase}/property/${propertyId}/log-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('token')
          ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
          : {}),
      },
      body: JSON.stringify({ sessionId: sid }),
    }).catch(() => {})
    fetch(`${config.public.apiBase}/property/${propertyId}/search-stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j) searchStats.value = j
      })
      .catch(() => {})
  } catch {}

  // Check ownership and load saved score from backend if owner
  const token =
    typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null

  // Passport status check — also drives read-only mode for non-owners.
  // For guests (no token) we use the public passport state seeded from /property/:id above.
  try {
    if (token) {
      const { getPassportStatus } = usePassportClaim()
      const status = await getPassportStatus(propertyId)
      isPropertyOwner.value = status.isOwner ?? false
      isPassportCollaborator.value = status.isCollaborator ?? false
      hasOtherOwnerPassport.value =
        !!status.hasPassport && !status.isOwner && !status.isCollaborator
      isOtherPassportPublished.value = !!(
        status.hasPassport && status.isPublished
      )
    }

    // Restore "already notified" state from localStorage
    if (typeof localStorage !== 'undefined') {
      notifiedOfPublish.value = !!localStorage.getItem(
        `hs_notify_publish_${propertyId}`,
      )
    }

    // Read-only mode: fetch the owner's published HomeScore from the public endpoint
    if (readOnlyMode.value) {
      try {
        const scoreRes = await fetch(
          `${config.public.apiBase}/property/${propertyId}/homescore/public`,
        )
        if (scoreRes.ok) {
          publicOwnerScore.value = await scoreRes.json()
          if (publicOwnerScore.value?.answers) {
            answers.value = publicOwnerScore.value.answers
          }
        }
      } catch {}
      screen.value = 'landing'
      return
    }
  } catch {}

  if (token) {
    try {
      if (isPropertyOwner.value) {
        const scoreRes = await fetch(
          `${config.public.apiBase}/property/${propertyId}/homescore`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (scoreRes.ok) {
          const existing = await scoreRes.json()
          if (existing?.answers && Object.keys(existing.answers).length > 0) {
            // Owner has a saved score — load it (backend is source of truth)
            answers.value = existing.answers
            if (Object.keys(existing.answers).length >= QUESTIONS.length) {
              screen.value = 'results'
              return
            }
          }
        }
      }
    } catch {}
  }

  const answeredCount = Object.keys(answers.value).length
  screen.value = answeredCount >= QUESTIONS.length ? 'results' : 'landing'

  // Honour ?screen=… so users returning here after sign-in / signup land on
  // the page they were trying to reach (e.g. buyer-results, questions,
  // quick-wins) rather than the landing screen.
  const requested = (route.query?.screen as string | undefined)?.trim()
  const allowed: Screen[] = [
    'buyer-results',
    'questions',
    'quick-wins',
    'move-ready',
    'results',
    'passport',
    'publish',
    'kyc',
    'kyc-pending',
    'published',
    'boost',
    'level-up',
  ]
  if (token && requested && (allowed as string[]).includes(requested)) {
    if (requested === 'questions') {
      const firstUnanswered = QUESTIONS.findIndex(
        (q) => !(answers.value as Record<string, string>)[q.id],
      )
      step.value = firstUnanswered >= 0 ? firstUnanswered : 0
    }
    // Strip the query so back-nav / refresh doesn't re-trigger.
    router.replace({ path: route.path }).catch(() => {})

    // Owner-only screens (publish + boost-your-score) re-run the gate so
    // a freshly-signed-in user who hasn't claimed the property yet is sent
    // through /claim instead of dropped onto a screen they shouldn't see.
    if (requested === 'publish' || requested === 'quick-wins') {
      gateOwnerAction(requested)
    } else {
      screen.value = requested as Screen
    }
  }
})

watch(showResult, (shown) => {
  if (shown && screen.value === 'questions') {
    screen.value = 'results'
    saveToBackend()
  }
})

watch(screen, (s) => {
  if (s === 'passport') {
    passportTab.value = 'sections'
    // Pre-fetch data in background
    fetchStreetData()
    fetchBuyerData()
  }
})
</script>

<style scoped>
/* ── Page ────────────────────────────────────────────────── */
.hs-page {
  min-height: 100dvh;
  background: #f0f4f4;
  color: #0f172a;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
  /* `clip` (not `hidden`) prevents horizontal scroll WITHOUT turning this into
     a scroll container — so the sticky web nav and sidebars keep working. */
  overflow-x: clip;
}

/* ── Web result layout (landing screen only) ─────────────────────────
   On the landing screen we widen the page to a full web canvas and let
   ResultDetail's internal shell lay its cards out in a two-column grid. */
.hs-page--web {
  max-width: none;
  background: #f3f2ef;
}

.hsw-shell {
  width: min(1140px, calc(100% - 48px));
  margin: 0 auto;
}

.hsw-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.hsw-nav-inner {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hsw-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0d1835;
  cursor: pointer;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
  font-family: inherit;
}

.hsw-brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.hsw-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}

.hsw-links {
  display: flex;
  gap: 6px;
}

.hsw-links button {
  border: 0;
  background: transparent;
  color: #475a7b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 14px;
  border-radius: 10px;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.18s, color 0.18s;
}

.hsw-links button:hover {
  color: #0c2342;
  background: rgba(0, 161, 154, 0.08);
}

.hsw-links button.active {
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.hsw-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.hsw-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d8e3ee;
  background: #fff;
  color: #0c2342;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.hsw-back:hover {
  border-color: #bfd1e4;
  background: #f8fbff;
}

.hsw-back svg {
  width: 15px;
  height: 15px;
}

.hsw-tour {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid #e2f1ea;
  background: #f1f9f4;
  color: #00a19a;
  font-family: inherit;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}

.hsw-tour:hover {
  background: #f2faf8;
  border-color: #b2e4e1;
  color: #007e78;
}

.hsw-cta {
  height: 42px;
  padding: 0 18px;
  border-radius: 10px;
  border: 0;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  background: #00857f;
  box-shadow: 0 10px 20px rgba(47, 93, 223, 0.18);
  transition: transform 0.18s;
}

.hsw-cta:hover {
  transform: translateY(-1px);
}

@media (max-width: 899px) {
  /* Below the two-column breakpoint, hide the desktop nav links/CTA so the
     landing reverts to a clean mobile presentation. */
  .hsw-links,
  .hsw-cta {
    display: none;
  }
  .hsw-shell {
    width: calc(100% - 32px);
  }
  .hsw-nav-inner {
    min-height: 56px;
  }
}

/* ── Header ───────────────────────────────────────────── */
.hs-header {
  background: #f0f4f4;
  display: flex;
  align-items: center;
  padding: 14px 18px 10px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.hs-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e2e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}
.hs-back-btn:active {
  background: #f0f4f4;
}
.hs-header-center {
  flex: 1;
  text-align: center;
}
.hs-header-title {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.hs-header-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 1px 0 0;
}
.hs-header-spacer {
  width: 32px;
  flex-shrink: 0;
}
.hs-tour-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  color: #00a19a;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}
.hs-tour-btn:hover {
  background: #f2faf8;
  border-color: #b2e4e1;
  color: #007e78;
}

/* ── Property strip ───────────────────────────────────── */
.hs-prop-strip {
  background: white;
  padding: 9px 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #e2e8e8;
}
.hs-prop-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1f7a66;
  box-shadow: 0 0 0 4px #ccfbf1;
  flex-shrink: 0;
}
.hs-prop-address {
  flex: 1;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.hs-epc-chip {
  font-size: 11px;
  font-weight: 800;
  color: white;
  padding: 2px 7px;
  border-radius: 5px;
  flex-shrink: 0;
}

/* ── Scroll container ─────────────────────────────────── */
.hs-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 6px 18px 0;
  scroll-behavior: smooth;
}

/* ── Web layout (move-ready screen on desktop) ────────────────────── */
.hs-scroll--web {
  flex: none;
  overflow-y: visible;
  padding: 0;
}
.mrw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.mrw-headline {
  margin-bottom: 14px;
}
.mrw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.mrw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.mrw-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.82fr);
  align-items: start;
  gap: 28px;
  margin-top: 4px;
}
.mrw-col {
  min-width: 0;
}

@media (max-width: 980px) {
  .mrw-grid {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}

/* ── Loading ──────────────────────────────────────────── */
.hs-loading-wrap {
  flex: 1;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.hs-loading-ring {
  width: 52px;
  height: 52px;
  border: 4px solid #d6efed;
  border-top-color: #00a19a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.hs-loading-label {
  font-size: 15px;
  color: #5b6d89;
  font-weight: 600;
  letter-spacing: -0.1px;
}

/* ── Money hook ───────────────────────────────────────── */
.hs-money-hook {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #fff;
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.hs-money-hook::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 160px;
  height: 160px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2),
    transparent 70%
  );
}
.hs-money-hook-label {
  font-size: 13px;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.hs-money-hook-amount {
  font-size: 36px;
  font-weight: 700;
  margin: 6px 0 4px;
  letter-spacing: -0.02em;
}
.hs-money-hook-sub {
  font-size: 15px;
  opacity: 0.9;
  line-height: 1.4;
}

/* ── Gauge card ───────────────────────────────────────── */
.hs-gauge-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0f172a;
}
.hs-gauge-card-eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1f7a66;
  font-weight: 600;
  margin-bottom: 6px;
  align-self: flex-start;
}
.hs-gauge-wrap {
  display: flex;
  justify-content: center;
}
.hs-gauge-svg {
  display: block;
}
/* EPC-based positive-framing block — sits above the confidence pill */
.hs-epc-explain {
  margin-top: 14px;
  background: #f8fafc;
  border: 1px solid #eef0f6;
  border-radius: 12px;
  padding: 12px 14px;
  text-align: left;
}
.hs-epc-explain-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #00a19a;
  margin-bottom: 6px;
}
.hs-epc-explain-body {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.55;
}
.hs-epc-explain-body :deep(b) {
  color: #231d45;
  font-weight: 700;
}

.hs-conf-pill {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  padding: 5px 12px;
}
.hs-conf-pill-ic {
  font-size: 12px;
  line-height: 1;
}
.hs-conf-pill--good {
  background: #d1fae5;
  color: #1f7a66;
}
.hs-conf-pill--ok {
  background: #f1f9f4;
  color: #00a19a;
}
.hs-conf-pill--warn {
  background: #fef3c7;
  color: #92400e;
}
.hs-epc-note {
  font-size: 13px;
  color: #475569;
  text-align: center;
  margin: 10px 0 0;
  line-height: 1.5;
  font-style: italic;
}

/* ── CTA ──────────────────────────────────────────────── */
.hs-cta-primary {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #fff;
  border: none;
  width: 100%;
  padding: 16px 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.25);
  margin-bottom: 8px;
}
.hs-cta-primary:hover {
  filter: brightness(1.05);
}
.hs-cta-chev {
  font-size: 18px;
}
.hs-cta-sub {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 14px;
}
.hs-owner-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef3c7;
  border: 1px solid #fef3c7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.45;
  margin-top: 4px;
}

/* ── Breakdown ────────────────────────────────────────── */
.hs-breakdown-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-breakdown-title {
  font-size: 17px;
  font-weight: 650;
  color: #0f172a;
  margin: 0 0 6px;
}
.hs-breakdown-note {
  font-size: 12px;
  color: #94a3b8;
  margin: 10px 0 0;
  text-align: center;
}
.hs-pillar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}
.hs-pillar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
.hs-pillar-name {
  width: 75px;
  color: #475569;
  font-weight: 500;
}
.hs-pillar-track {
  flex: 1;
  height: 7px;
  background: #e2e8e8;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.hs-pillar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  transition: width 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.hs-pillar-val {
  width: 38px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #0f172a;
  font-weight: 600;
}

/* ── Question flow ────────────────────────────────────── */
.hs-progress-wrap {
  background: #f0f4f4;
  padding: 0 18px 8px;
}
.hs-progress-track {
  height: 4px;
  background: #e2e8e8;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}
.hs-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1f7a66, #2dd4bf);
  border-radius: 4px;
  transition: width 0.45s ease;
}
.hs-progress-label {
  font-size: 12px;
  color: #94a3b8;
  text-align: right;
  margin: 0;
}

.hs-q-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding: 6px 18px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #0f172a;
}

/* ── Live score card ──────────────────────────────────── */
.hs-live-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #e2e8e8;
  position: relative;
}
.hs-live-mini-wrap {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  flex-shrink: 0;
}
.hs-live-num {
  font-size: 14px;
  font-weight: 700;
  z-index: 2;
  position: relative;
}
.hs-live-info {
  flex: 1;
}
.hs-live-lbl {
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
}
.hs-live-hint {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-top: 1px;
}
.hs-live-conf {
  font-size: 12px;
  padding: 4px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}
.hs-live-conf.mid {
  background: #dbeafe;
  color: #1e40af;
}
.hs-live-conf.high {
  background: #dcfce7;
  color: #166534;
}

/* ── Delta flying animation ───────────────────────────── */
.hs-delta-float {
  position: absolute;
  right: 14px;
  top: 50%;
  font-size: 15px;
  font-weight: 700;
  animation: floatUp 1.2s ease forwards;
  pointer-events: none;
  z-index: 10;
}
.hs-delta-float.pos {
  color: #16a34a;
}
.hs-delta-float.neg {
  color: #dc2626;
}
@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-32px);
  }
}
.hs-float-enter-active {
  animation: floatUp 1.2s ease forwards;
}

/* ── Question card ────────────────────────────────────── */
.hs-question-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-cat-chip {
  font-size: 12px;
  font-weight: 600;
  color: #1f7a66;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
  display: block;
}
.hs-q-title {
  font-size: 19px;
  font-weight: 650;
  line-height: 1.3;
  margin: 0 0 18px;
  color: #0f172a;
}
.hs-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hs-option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1.5px solid #e2e8e8;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  color: #0f172a;
  text-align: left;
}
.hs-option-btn:hover {
  border-color: #94a3b8;
}
.hs-option-btn.selected {
  border-color: #1f7a66;
  background: #f0fdfa;
  color: #0f766e;
  font-weight: 600;
}
.hs-option-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #94a3b8;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  transition: border-color 0.15s ease;
}
.hs-option-btn.selected .hs-option-radio {
  border-color: #1f7a66;
  background: #1f7a66;
}
.hs-option-radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}
.hs-option-label {
  flex: 1;
  color: #0f172a;
  word-break: break-word;
}
.hs-option-btn.selected .hs-option-label {
  color: #0f766e;
}
.hs-narr-hint {
  font-size: 13px;
  color: #475569;
  font-style: italic;
  margin: 12px 0 0;
  line-height: 1.45;
  border-left: 3px solid #1f7a66;
  padding-left: 10px;
}

/* ── Navigation ───────────────────────────────────────── */
.hs-nav {
  display: flex;
  gap: 10px;
}
.hs-btn-secondary {
  background: #fff;
  color: #0f172a;
  border: 1px solid #e2e8e8;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.hs-btn-primary {
  flex: 1;
  background: #1f7a66;
  color: #fff;
  border: none;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.hs-btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.hs-btn-ghost {
  width: 100%;
  background: transparent;
  color: #475569;
  border: none;
  padding: 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* ── Slide transition ─────────────────────────────────── */
.hs-slide-enter-active,
.hs-slide-leave-active {
  transition: all 0.22s ease;
}
.hs-slide-enter-from {
  opacity: 0;
  transform: translateX(22px);
}
.hs-slide-leave-to {
  opacity: 0;
  transform: translateX(-22px);
}

/* ── Read-only banner (non-owner viewing verified owner's score) ── */
/* ── Published passport banner (navy) ─────────────────────── */
.hs-pp-banner--published {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #1a1640, #231d45);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.hs-pp-banner-ic {
  font-size: 22px;
  line-height: 1;
  flex-shrink: 0;
}
.hs-pp-banner-body {
  flex: 1;
  min-width: 0;
}
.hs-pp-banner-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}
.hs-pp-banner-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.45;
}
.hs-pp-banner-cta--mint {
  flex-shrink: 0;
  border: none;
  background: #3dbda3;
  color: #042f2e;
  font-size: 12px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 9px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: transform 0.15s ease;
}
.hs-pp-banner-cta--mint:active {
  transform: scale(0.96);
}

/* ── Published Passport banner (rich, prototype-matching) ── */
.hs-pp-pub {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1640, #231d45);
  border: 1.5px solid #231d45;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.hs-pp-pub-glow {
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.28), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.hs-pp-pub-inner {
  position: relative;
  z-index: 1;
}
.hs-pp-pub-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3dbda3;
  margin-bottom: 6px;
}
.hs-pp-eyebrow-ic {
  width: 12px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
}
.hs-searched-sub-ic {
  display: inline-block;
  width: 11px;
  height: 11px;
  object-fit: contain;
  vertical-align: -2px;
  margin-left: 2px;
}
.hs-buyer-save-ic-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.hs-pp-owner-cta-ic {
  width: 12px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
}
.hs-pp-pub-title {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
  line-height: 1.3;
  margin-bottom: 8px;
}
.hs-pp-pub-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.55;
  margin-bottom: 10px;
}
.hs-pp-pub-body strong {
  color: #fff;
  font-weight: 700;
}
.hs-pp-pub-explainer {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hs-pp-pub-explainer-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3dbda3;
  margin-bottom: 6px;
}
.hs-pp-pub-explainer-row {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
  display: flex;
  gap: 6px;
}
.hs-pp-pub-check {
  color: #3dbda3;
  font-weight: 800;
  flex-shrink: 0;
}
.hs-pp-pub-unlock {
  width: 100%;
  border: none;
  background: #3dbda3;
  color: #042f2e;
  font-size: 15px;
  font-weight: 800;
  padding: 11px;
  border-radius: 11px;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 8px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.hs-pp-pub-unlock:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(94, 234, 212, 0.28);
}

/* ── In-progress passport banner (warm amber, prototype-matching) ── */
.hs-pp-claimed {
  background: #fffbeb;
  border: 1.5px solid #fef3c7;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.hs-pp-claimed-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #92400e;
  margin-bottom: 6px;
}
.hs-pp-claimed-title {
  font-size: 14px;
  font-weight: 800;
  color: #78350f;
  letter-spacing: -0.01em;
  line-height: 1.3;
  margin-bottom: 8px;
}
.hs-pp-claimed-body {
  font-size: 13px;
  color: #78350f;
  line-height: 1.55;
  margin-bottom: 10px;
}
.hs-pp-claimed-body strong {
  color: #92400e;
  font-weight: 700;
}
.hs-pp-claimed-explainer {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hs-pp-claimed-explainer-amber {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #fef3c7;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hs-pp-claimed-explainer-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #00a19a;
  margin-bottom: 6px;
}
.hs-pp-claimed-explainer-title-amber {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #92400e;
  margin-bottom: 6px;
}
.hs-pp-claimed-explainer-row {
  font-size: 12px;
  color: #4a5568;
  line-height: 1.45;
  display: flex;
  gap: 6px;
}
.hs-pp-claimed-check {
  color: #00a19a;
  font-weight: 800;
  flex-shrink: 0;
}
.hs-pp-claimed-cta {
  width: 100%;
  border: none;
  background: #f59e0b;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  padding: 11px;
  border-radius: 11px;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 8px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.hs-pp-claimed-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.28);
}
.hs-pp-claimed-done {
  text-align: center;
  font-size: 13px;
  color: #15803d;
  font-weight: 600;
  padding: 8px 0;
  margin-bottom: 4px;
}

/* ── No-passport banner (neutral grey, prototype-matching) ── */
.hs-pp-none {
  background: #f8f7fc;
  border: 1.5px solid #eef0f6;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.hs-pp-none-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}
.hs-pp-none-title {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.01em;
  line-height: 1.3;
  margin-bottom: 8px;
}
.hs-pp-none-body {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.55;
  margin-bottom: 10px;
}
.hs-pp-none-body strong {
  color: #231d45;
  font-weight: 700;
}
.hs-pp-none-explainer {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hs-pp-none-explainer-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #00a19a;
  margin-bottom: 6px;
}
.hs-pp-none-explainer-row {
  font-size: 12px;
  color: #4a5568;
  line-height: 1.45;
  display: flex;
  gap: 6px;
}
.hs-pp-none-check {
  color: #00a19a;
  font-weight: 800;
  flex-shrink: 0;
}

/* Owner sign-in CTA — sits below the published / in-progress banner */
.hs-pp-owner-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  font-size: 14px;
  font-weight: 800;
  padding: 10px;
  border-radius: 11px;
  cursor: pointer;
  font-family: inherit;
  margin: -6px 0 14px;
  transition: background 0.15s ease;
}
.hs-pp-owner-cta--published {
  border: 1.5px solid rgba(94, 234, 212, 0.5);
  background: rgba(94, 234, 212, 0.08);
  color: #3dbda3;
  margin: 0;
  padding: 10px;
}
.hs-pp-owner-cta--published:hover,
.hs-pp-owner-cta--published:active {
  background: rgba(94, 234, 212, 0.16);
}
.hs-pp-owner-cta--inprogress {
  border: 1.5px solid #92400e;
  background: #fff;
  color: #92400e;
  margin-top: 8px;
  margin-bottom: 0;
}
.hs-pp-owner-cta--inprogress:hover,
.hs-pp-owner-cta--inprogress:active {
  background: #fef3c7;
}

/* ── In-progress passport banner (amber) ─────────────────── */
.hs-pp-inprogress {
  background: #fffbeb;
  border: 1.5px solid #fef3c7;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.hs-pp-inprogress-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}
.hs-pp-inprogress-ic {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 1px;
}
.hs-pp-inprogress-title {
  font-size: 15px;
  font-weight: 700;
  color: #92400e;
}
.hs-pp-inprogress-sub {
  font-size: 13px;
  color: #78350f;
  margin-top: 2px;
  line-height: 1.5;
}
.hs-pp-inprogress-box {
  background: #fff;
  border: 1px solid #fef3c7;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
.hs-pp-inprogress-box:last-of-type {
  margin-bottom: 10px;
}
.hs-pp-inprogress-box-title {
  font-size: 13px;
  color: #92400e;
  font-weight: 600;
  margin-bottom: 2px;
}
.hs-pp-inprogress-box-body {
  font-size: 12px;
  color: #78350f;
  line-height: 1.4;
}
.hs-pp-inprogress-cta {
  width: 100%;
  border: none;
  padding: 11px;
  border-radius: 11px;
  background: #f59e0b;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
}
.hs-pp-inprogress-cta:active {
  background: #92400e;
}
.hs-pp-inprogress-done {
  text-align: center;
  font-size: 13px;
  color: #15803d;
  font-weight: 600;
  padding: 10px 0 2px;
}
.hs-readonly-cta {
  width: 100%;
  margin-top: 14px;
  border: none;
  background: #231d45;
  color: #fff;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.hs-readonly-cta:active {
  background: #1a163a;
}
.hs-readonly-cta-arrow {
  font-size: 16px;
  font-weight: 700;
}
.hs-readonly-subnote {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  line-height: 1.5;
}

/* ── Results ──────────────────────────────────────────── */
.hs-addr-strip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
}
.hs-addr-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1f7a66;
  box-shadow: 0 0 0 4px #ccfbf1;
  flex-shrink: 0;
  margin-top: 6px;
}
.hs-addr-body {
  flex: 1;
  min-width: 0;
}
.hs-addr-text {
  font-weight: 700;
  font-size: 14px;
  color: #231d45;
  line-height: 1.25;
}
.hs-addr-tiny {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 2px;
  line-height: 1.35;
}
.hs-addr-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
  flex-shrink: 0;
}
.hs-addr-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  padding: 3px 9px;
  border-radius: 999px;
  letter-spacing: 0.02em;
  white-space: nowrap;
  line-height: 1.4;
}
.hs-addr-badge-ic {
  width: 12px;
  height: 12px;
  object-fit: contain;
  flex-shrink: 0;
}
.hs-addr-badge--pub {
  background: #231d45;
  color: #fff;
}
.hs-addr-badge--prog {
  background: #fef3c7;
  color: #92400e;
}
.hs-addr-badge--unclaimed {
  background: #f0fdfa;
  color: #00a19a;
  border: 1px solid #e2f1ea;
  cursor: pointer;
  transition: background 0.15s;
}
.hs-addr-badge--unclaimed:hover,
.hs-addr-badge--unclaimed:active {
  background: #ccfbf1;
}

.hs-savings-hero {
  background: linear-gradient(135deg, #1f7a66, #00a19a);
  color: #fff;
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 14px;
}
.hs-savings-eyebrow {
  font-size: 12px;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.hs-savings-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
}
.hs-savings-amount {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.hs-savings-pill {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}
.hs-savings-sub {
  font-size: 15px;
  opacity: 0.9;
  margin-top: 4px;
  line-height: 1.4;
}

.hs-journey-card {
  background: white;
  border-radius: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-journey-inner {
  padding: 16px 16px 12px;
}
.hs-journey-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 12px;
}
.hs-journey-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 14px;
}
.hs-journey-col {
  text-align: center;
  padding: 0 8px;
}
.hs-journey-num {
  font-size: 24px;
  font-weight: 800;
}
.hs-journey-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  margin-top: 1px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hs-journey-sub {
  font-size: 11px;
  color: #475569;
  margin-top: 3px;
}
.hs-journey-bar-track {
  height: 8px;
  background: #e2e8e8;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}
.hs-journey-bar-fill {
  height: 8px;
  background: linear-gradient(90deg, #1f7a66, #16a34a);
  border-radius: 4px;
  transition: width 0.8s ease;
}
.hs-journey-bar-label {
  font-size: 13px;
  color: #475569;
}
.hs-street {
  background: #f8fafc;
}

.hs-carbon-card {
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 14px;
  color: #fff;
}
.hs-carbon-top {
  padding: 16px 16px 12px;
}
.hs-carbon-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 8px;
}
.hs-carbon-main-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 12px;
}
.hs-carbon-kg {
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}
.hs-carbon-kg-label {
  font-size: 12px;
  opacity: 0.75;
  margin-top: 2px;
}
.hs-carbon-grade-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 5px 12px 5px 8px;
  margin-bottom: 6px;
}
.hs-carbon-grade-letter {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
}
.hs-carbon-grade-label {
  font-size: 13px;
  font-weight: 600;
}
.hs-carbon-vs-avg {
  font-size: 13px;
  opacity: 0.8;
}
.hs-carbon-bars {
  display: flex;
  gap: 3px;
  margin-bottom: 12px;
  align-items: flex-end;
}
.hs-carbon-bar-col {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}
.hs-carbon-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  opacity: 0.55;
  margin-bottom: 14px;
  letter-spacing: 0.04em;
}
.hs-carbon-drivers {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.hs-carbon-driver-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.9;
}
.hs-carbon-driver-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}
.hs-carbon-driver-label {
  flex: 1;
}
.hs-carbon-driver-val {
  font-weight: 700;
  white-space: nowrap;
}
.hs-carbon-upgrade-bar {
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.hs-carbon-upgrade-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}
.hs-carbon-upgrade-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hs-carbon-upgrade-text {
  font-size: 12px;
  opacity: 0.8;
}
.hs-carbon-save-pill {
  margin-left: auto;
  background: #00a19a;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}

.hs-trust-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-trust-inner {
  margin-bottom: 14px;
}
.hs-trust-title {
  font-size: 17px;
  font-weight: 650;
  margin: 0 0 10px;
  color: #0f172a;
}
.hs-trust-steps {
  display: flex;
  align-items: flex-start;
}
.hs-trust-col {
  flex: 1;
  text-align: center;
}
.hs-trust-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 5px;
}
.hs-trust-dot.done {
  background: #16a34a;
  color: #fff;
}
.hs-trust-dot.pending {
  background: #e2e8e8;
  color: #94a3b8;
}
.hs-trust-step-label {
  font-size: 11px;
  font-weight: 700;
}
.hs-trust-step-label.done {
  color: #16a34a;
}
.hs-trust-step-label.pending {
  color: #94a3b8;
}
.hs-trust-step-sub {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  line-height: 1.3;
}
.hs-trust-connector {
  flex: 0 0 24px;
  height: 2px;
  background: #e2e8e8;
  margin-top: 13px;
}
.hs-trust-connector.done {
  background: #16a34a;
}
.hs-trust-explain {
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #0f172a;
  line-height: 1.5;
}
.hs-trust-nudge {
  background: #f0fdfa;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #99f6e4;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 14px;
}
.hs-trust-nudge-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f766e;
}
.hs-trust-nudge-sub {
  font-size: 13px;
  color: #475569;
  margin-top: 1px;
}

.hs-wins-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-wins-title {
  font-size: 17px;
  font-weight: 650;
  color: #0f172a;
  margin: 0 0 2px;
}
.hs-wins-sub {
  font-size: 14px;
  color: #475569;
  margin: 0 0 14px;
}
.hs-win-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border-radius: 14px;
  margin-bottom: 10px;
  border: 1px solid #e2e8e8;
  align-items: center;
}
.hs-win-item:last-child {
  margin-bottom: 0;
}
.hs-win-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f0fdfa;
  color: #0f766e;
  font-weight: 700;
  font-size: 15px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.hs-win-body {
  flex: 1;
}
.hs-win-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 2px;
}
.hs-win-sub {
  font-size: 13px;
  color: #475569;
  margin: 0;
}
.hs-win-right {
  text-align: right;
  flex-shrink: 0;
}
.hs-win-saving {
  color: #16a34a;
  font-weight: 700;
  font-size: 15px;
  margin: 0;
}
.hs-win-pts {
  color: #1f7a66;
  font-weight: 700;
  font-size: 13px;
  margin: 0;
}

.hs-opps-card {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  color: #0f172a;
}
.hs-opps-title {
  font-size: 17px;
  font-weight: 650;
  color: #78350f;
  margin: 0 0 10px;
}
.hs-opp-item {
  display: flex;
  gap: 12px;
  padding: 12px 14px;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 12px;
  margin-bottom: 8px;
  align-items: flex-start;
}
.hs-opp-item:last-child {
  margin-bottom: 0;
}
.hs-opp-icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}
.hs-opp-name {
  font-size: 15px;
  font-weight: 600;
  color: #78350f;
  margin: 0 0 2px;
}
.hs-opp-sub {
  font-size: 13px;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

.hs-nb-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-nb-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 4px;
}
.hs-nb-title {
  font-size: 17px;
  font-weight: 650;
  color: #0f172a;
}
.hs-nb-rank {
  background: #f0fdfa;
  color: #0f766e;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.hs-nb-body {
  font-size: 14px;
  color: #475569;
  margin-bottom: 12px;
  line-height: 1.4;
}
.hs-nb-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;
}
.hs-nb-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
}
.hs-nb-row.mine {
  background: #f0fdfa;
  border: 1px solid #99f6e4;
}
.hs-nb-pos {
  width: 22px;
  font-size: 15px;
  font-weight: 700;
  color: #94a3b8;
  flex-shrink: 0;
}
.hs-nb-pos.mine {
  color: #0f766e;
}
.hs-nb-addr {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}
.hs-nb-addr.mine {
  color: #0f766e;
  font-weight: 700;
}
.hs-nb-detail {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 1px;
}
.hs-nb-cost {
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}
.hs-nb-gap-card {
  background: linear-gradient(135deg, #fef3c7, #fff7ed);
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #fed7aa;
  margin-bottom: 12px;
}
.hs-nb-gap-title {
  font-size: 15px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
}
.hs-nb-gap-reasons {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.hs-nb-gap-reason {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #78350f;
}
.hs-nb-gap-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #fed7aa;
  font-size: 13px;
  color: #92400e;
}
.hs-nb-nudge {
  background: #f0fdfa;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.hs-nb-nudge-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f766e;
}
.hs-nb-nudge-sub {
  font-size: 13px;
  color: #475569;
  opacity: 0.8;
}

.hs-retake-btn {
  width: 100%;
  background: #fff;
  border: 1px solid #e2e8e8;
  border-radius: 14px;
  padding: 14px 20px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 14px;
}

/* ── Passport bridge ──────────────────────────────────── */
.hs-pp-card {
  background: linear-gradient(135deg, #131129, #1e1842);
  color: #fff;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.hs-pp-card::before {
  content: '';
  position: absolute;
  right: -60px;
  top: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(20, 184, 166, 0.35),
    transparent 70%
  );
}
.hs-pp-card > * {
  position: relative;
  z-index: 1;
}
.hs-pp-badge {
  display: inline-block;
  background: rgba(20, 184, 166, 0.2);
  color: #3dbda3;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.hs-pp-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
  line-height: 1.25;
}
.hs-pp-body {
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.5;
  margin: 0 0 16px;
}
.hs-pp-progress {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.hs-pp-progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 8px;
  opacity: 0.85;
}
.hs-pp-progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  overflow: hidden;
}
.hs-pp-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #14b8a6, #3dbda3);
  border-radius: 999px;
  transition: width 0.6s ease;
}
.hs-pp-docs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.hs-pp-doc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
}
.hs-pp-doc-ic {
  font-size: 14px;
}
.hs-pp-doc-name {
  flex: 1;
}
.hs-pp-doc-gain {
  color: #3dbda3;
  font-weight: 600;
  font-size: 13px;
}
.hs-pp-cta {
  background: #14b8a6;
  color: #042f2e;
  border: none;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hs-pp-cta:hover {
  filter: brightness(1.05);
}
.hs-pp-cta-sub {
  text-align: center;
  font-size: 12px;
  opacity: 0.7;
  margin-top: 10px;
}

.hs-pp-unlocks-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.04);
  color: #0f172a;
}
.hs-pp-unlocks-title {
  font-size: 17px;
  font-weight: 650;
  color: #0f172a;
  margin: 0 0 12px;
}
.hs-pp-unlocks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hs-pp-unlock-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.hs-pp-unlock-icon {
  font-size: 20px;
}
.hs-pp-unlock-name {
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
}
.hs-pp-unlock-sub {
  font-size: 15px;
  color: #475569;
  margin-top: 2px;
}

/* ── Vault tabs ──────────────────────────────────────── */
/* ── Web layout (passport screen on desktop) ──────────────────────── */
.ppw-main {
  position: relative;
  z-index: 2;
  width: min(960px, calc(100% - 48px));
  margin: 0 auto;
  padding: 30px 0 60px;
}
.ppw-head {
  margin-bottom: 18px;
}
.ppw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.ppw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.ppw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
/* Turn the tab strip into a rounded web card. */
.ppw-main .hs-vault-tabs {
  border: 1px solid #e7ecf2;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(19, 45, 78, 0.05);
  overflow: hidden;
}

.hs-vault-tabs {
  display: flex;
  background: white;
  border-bottom: 1px solid #e2e8e8;
  padding: 0 6px;
}
.hs-vault-tab {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  padding: 13px 6px 11px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.hs-vault-tab.active {
  color: #1f7a66;
  border-bottom-color: #1f7a66;
}
.hs-tab-badge {
  background: #1f7a66;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 999px;
  line-height: 1.4;
}
.hs-tab-content {
  padding: 14px 16px 0;
}

/* ── Passport action row ──────────────────────────────── */
.hs-passport-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.hs-pa-btn {
  flex: 1;
  padding: 11px 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}
.hs-pa-btn.outline {
  background: #f0fdfa;
  color: #1f7a66;
  border: 1.5px solid #99f6e4;
}
.hs-pa-btn.solid {
  background: #1f7a66;
  color: #fff;
}
.hs-pa-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Street tab ──────────────────────────────────────── */
.hs-vm-header {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 12px;
}
.hs-street-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 14px;
  border: 1px solid #e2e8e8;
}
.hs-street-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}
.hs-street-row:last-child {
  border-bottom: none;
}
.hs-street-row:active {
  background: #f0fdfa;
}
.hs-street-house-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.hs-street-addr {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}
.hs-street-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.hs-street-epc {
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  padding: 1px 5px;
  border-radius: 4px;
}
.hs-street-status {
  flex-shrink: 0;
}
.hs-street-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
}
.hs-street-badge.published {
  background: #dcfce7;
  color: #166534;
}
.hs-street-badge.started {
  background: #fef3c7;
  color: #92400e;
}
.hs-street-badge.none {
  background: #f1f5f9;
  color: #64748b;
}
.hs-street-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}
.hs-street-stats {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e2e8e8;
}
.hs-street-stats-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}
.hs-street-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}
.hs-stat-box {
  border-radius: 10px;
  padding: 10px 12px;
}
.hs-stat-box.brand {
  background: #f0fdfa;
}
.hs-stat-box.green {
  background: #f0fdf4;
}
.hs-stat-box.amber {
  background: #fef3c7;
}
.hs-stat-box.grey {
  background: #f8fafc;
}
.hs-stat-val {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
}
.hs-stat-box.brand .hs-stat-val {
  color: #1f7a66;
}
.hs-stat-box.green .hs-stat-val {
  color: #16a34a;
}
.hs-stat-box.amber .hs-stat-val {
  color: #92400e;
}
.hs-stat-lbl {
  font-size: 12px;
  color: #64748b;
  margin-top: 1px;
}
.hs-street-tip {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
}

/* ── Buyers tab ──────────────────────────────────────── */
.hs-buyers-intro {
  background: #f0fdfa;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
}
.hs-buyer-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8e8;
  margin-bottom: 14px;
}
.hs-buyer-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
}
.hs-buyer-card:last-child {
  border-bottom: none;
}
.hs-buyer-card:active {
  background: #f0fdfa;
}
.hs-buyer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
  flex-shrink: 0;
}
.hs-buyer-info {
  flex: 1;
  min-width: 0;
}
.hs-buyer-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
.hs-buyer-criteria {
  font-size: 13px;
  color: #475569;
  margin-top: 2px;
  line-height: 1.4;
}
.hs-buyer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.hs-buyer-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
}
.hs-buyer-tag.match {
  background: #dcfce7;
  color: #166534;
}
.hs-buyer-tag.partial {
  background: #fef3c7;
  color: #92400e;
}
.hs-buyer-match-score {
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
  min-width: 38px;
  text-align: right;
}
.hs-buyers-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

/* ── Question screen (hsq-*) ───────────────────────────────── */
/* ── Prototype-style quiz UI (hsq2) ─────────────────────────── */
.hs-q-shell {
  padding: 0;
  background: #fff;
}
.hsq2-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.hsq2-back {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  display: grid;
  place-items: center;
  color: #00a19a;
  cursor: pointer;
}
.hsq2-back svg {
  width: 14px;
  height: 14px;
}
.hs-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #00a19a;
  text-transform: uppercase;
}
.hs-pulse {
  width: 6px;
  height: 6px;
  background: #00a19a;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #e2f1ea;
}

/* Teal address card with progress + Q counter */
.hsq2-addr-card {
  margin: 10px 16px 0;
  border-radius: 18px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #00a19a 0%, #007e78 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 161, 154, 0.25);
}
.hsq2-addr-card::after {
  content: '';
  position: absolute;
  inset: -40% -20% auto auto;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.18),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}
.hsq2-addr-card > * {
  position: relative;
  z-index: 1;
}
.hsq2-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.hsq2-addr-pin {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 4px;
}
.hsq2-addr-block {
  flex: 1;
  min-width: 0;
}
.hsq2-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.hsq2-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}
.hsq2-progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.hsq2-cat-pill {
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.hsq2-progress-track {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  overflow: hidden;
}
.hsq2-progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 100px;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.hsq2-q-label {
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  white-space: nowrap;
}

/* Live score card */
.hsq2-score-card {
  margin: 12px 16px 0;
  padding: 16px;
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(35, 29, 69, 0.06);
}
.hsq2-score-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.hsq2-score-eyebrow .left {
  font-size: 12px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hsq2-score-eyebrow .right {
  font-size: 11px;
  font-weight: 700;
  color: #007e78;
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  padding: 3px 8px;
  border-radius: 999px;
}
.hsq2-score-gauge-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}
.hsq2-gauge {
  width: 88px;
  height: 88px;
  position: relative;
  flex-shrink: 0;
}
.hsq2-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.hsq2-gauge .g-bg {
  stroke: #eef0f6;
}
.hsq2-g-num {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.hsq2-g-num .gn-big {
  font-size: 26px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.8px;
  line-height: 1;
}
.hsq2-g-num .gn-small {
  font-size: 9px;
  font-weight: 800;
  color: #9c98ad;
  letter-spacing: 0.06em;
  margin-top: 2px;
}
.hsq2-score-summary {
  flex: 1;
  min-width: 0;
}
.hsq2-band {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.2px;
  line-height: 1.2;
}
.hsq2-explainer {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  margin-top: 4px;
  line-height: 1.4;
  letter-spacing: -0.05px;
}

/* Question block */
.hsq2-q-block {
  padding: 16px 22px 0;
}
.hsq2-q-text {
  font-size: 19px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.4px;
  line-height: 1.25;
  margin-bottom: 10px;
}
.hsq2-context {
  font-size: 14px;
  font-weight: 600;
  color: #6b6783;
  background: #f8f9fb;
  border: 1px solid #ececef;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 12px;
  line-height: 1.45;
}
.hsq2-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hsq2-option {
  display: block;
  width: 100%;
  text-align: left;
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #231d45;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: all 0.15s;
}
.hsq2-option:hover {
  border-color: #b2e4e1;
  background: #f2faf8;
}
.hsq2-option.selected {
  border-color: #00a19a;
  background: #f2faf8;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.12);
  color: #007e78;
}

/* Back / Next nav */
.hsq2-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 22px 0;
}
.hsq2-nav-back {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ececef;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.hsq2-nav-back:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.hsq2-nav-next {
  flex: 1;
  background: #00a19a;
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  padding: 13px 18px;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: background 0.15s;
}
.hsq2-nav-next:hover:not(:disabled) {
  background: #00b6ae;
}
.hsq2-nav-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hsq-header {
  background: linear-gradient(150deg, #1a1640 0%, #231d45 60%, #2a2158 100%);
  padding: 16px 20px 20px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.hsq-header-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.2), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.hsq-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}
.hsq-back {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.hsq-back:active {
  background: rgba(255, 255, 255, 0.15);
}
.hsq-count {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}
.hsq-spacer {
  width: 36px;
}
.hsq-progress-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.hsq-progress-fill {
  height: 4px;
  background: linear-gradient(90deg, #1f7a66, #3dbda3);
  border-radius: 999px;
  transition: width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.hsq-cat-wrap {
  position: relative;
  z-index: 1;
}
.hsq-cat-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 161, 154, 0.2);
  border: 1px solid rgba(0, 161, 154, 0.35);
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 11px;
  font-weight: 700;
  color: #3dbda3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hsq-body {
  padding: 12px 16px 24px;
  gap: 14px;
}

/* Live score widget */
.hsq-live {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(35, 29, 69, 0.08);
  border: 1.5px solid #e2e8e8;
  position: relative;
  flex-shrink: 0;
  transition:
    background 0.3s,
    border-color 0.3s;
}
.hsq-live-gauge {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}
.hsq-live-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 900;
  color: #231d45;
  line-height: 1;
  transition:
    transform 0.2s,
    color 0.2s;
}
.hsq-live-info {
  flex: 1;
  min-width: 0;
}
.hsq-live-lbl {
  font-size: 9px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}
.hsq-live-hint {
  font-size: 13px;
  font-weight: 700;
  color: #231d45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hsq-delta {
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
}
.hsq-delta.pos {
  color: #16a34a;
}
.hsq-delta.neg {
  color: #dc2626;
}
.hsq-delta-enter-active,
.hsq-delta-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.hsq-delta-enter-from,
.hsq-delta-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Question card */
.hsq-card {
  margin-bottom: 4px;
}
.hsq-title {
  font-size: 19px;
  font-weight: 800;
  color: #231d45;
  line-height: 1.3;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}
.hsq-hint {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  padding: 12px 14px;
  background: #f1f9f4;
  border-radius: 12px;
  border: 1.5px solid #e2f1ea;
  margin-bottom: 14px;
}
.hsq-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hsq-opt {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e2e8e8;
  background: #fff;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 14px;
  color: #0f172a;
  text-align: left;
  font-family: inherit;
}
.hsq-opt:hover {
  background: #f1f9f4;
  border-color: #e2f1ea;
}
.hsq-opt.selected {
  background: #1f7a66;
  border-color: #1f7a66;
  color: #fff;
  font-weight: 600;
}
.hsq-opt-label {
  flex: 1;
  word-break: break-word;
}

/* Navigation */
.hsq-nav {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.hsq-nav-back {
  flex: 0 0 48px;
  height: 48px;
  border: 1.5px solid #e2e8e8;
  background: #fff;
  border-radius: 14px;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.hsq-nav-back:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.hsq-nav-next {
  flex: 1;
  height: 48px;
  border: none;
  background: #1f7a66;
  color: #fff;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}
.hsq-nav-next:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Results: updated journey card / breakdown explain / sticky CTA ── */
.hs-journey-card {
  cursor: pointer;
  transition: transform 0.15s ease;
}
.hs-journey-card:active {
  transform: scale(0.995);
}
.hs-journey-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.hs-journey-link {
  font-size: 12px;
  font-weight: 600;
  color: #1f7a66;
}
.hs-journey-num-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}
.hs-journey-num-small {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}
.hs-journey-num-muted {
  color: #94a3b8;
}
.hs-breakdown-explain {
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  line-height: 1.5;
  margin-top: 10px;
}
.hs-sticky-cta {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 28rem;
  padding: 12px 18px calc(18px + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1px solid #e2e8e8;
  box-shadow: 0 -4px 16px rgba(35, 29, 69, 0.06);
  z-index: 20;
}
.hs-sticky-cta-btn {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 14px;
  background: #1f7a66;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
  font-family: inherit;
}
.hs-sticky-cta-btn:active {
  transform: scale(0.99);
}
.hs-sticky-cta-sub {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

/* ── Landing interest selector ─────────────────────────── */
.hs-interest-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-align: center;
  margin: 16px 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.hs-interest-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
}
.hs-interest-btn {
  width: 100%;
  border: none;
  border-radius: 13px;
  padding: 13px 16px;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: inherit;
}
.hs-interest-btn.primary {
  background: #1f7a66;
  color: #fff;
}
.hs-interest-btn.outline {
  background: #fff;
  border: 1.5px solid #e2e8e8;
  color: #0f172a;
}
.hs-interest-ic {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 17px;
}
.hs-interest-ic.primary {
  background: rgba(255, 255, 255, 0.2);
}
.hs-interest-ic.soft {
  background: #ccfbf1;
}
.hs-interest-ic-img {
  width: 17px;
  height: 17px;
  object-fit: contain;
}
.hs-interest-body {
  flex: 1;
}
.hs-interest-title {
  font-size: 15px;
  font-weight: 700;
}
.hs-interest-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 1px;
}
.hs-interest-sub.primary-sub {
  color: rgba(255, 255, 255, 0.85);
}
.hs-interest-chev {
  font-size: 18px;
  color: #cbd5e1;
}
.hs-interest-chev.primary {
  color: rgba(255, 255, 255, 0.7);
}

/* ── Buyer results ─────────────────────────────────────── */
.hs-buyer-hero {
  background: linear-gradient(135deg, #1e3a5f, #1e4976);
  color: #fff;
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.hs-buyer-hero::after {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 140px;
  height: 140px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.12),
    transparent 70%
  );
  border-radius: 50%;
}
.hs-buyer-hero-eyebrow {
  font-size: 12px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.hs-buyer-hero-amount {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 6px 0 4px;
}
.hs-buyer-hero-sub {
  font-size: 15px;
  opacity: 0.9;
  line-height: 1.4;
}
.hs-buyer-hero-stats {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  position: relative;
  z-index: 1;
}
.hs-buyer-hero-stat {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 8px 10px;
  text-align: center;
  flex: 1;
}
.hs-buyer-hero-stat-num {
  font-size: 18px;
  font-weight: 800;
}
.hs-buyer-hero-stat-lbl {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 1px;
}

.hs-buyer-risk-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e5e7eb;
}
.hs-buyer-risk-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}
.hs-buyer-risk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hs-buyer-risk-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 11px;
}
.hs-buyer-risk-row.warn {
  background: #fef3c7;
  border: 1px solid #fef3c7;
}
.hs-buyer-risk-row.ok {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}
.hs-buyer-risk-ic {
  font-size: 18px;
  flex-shrink: 0;
}
.hs-buyer-risk-row.warn .hs-buyer-risk-head {
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
}
.hs-buyer-risk-row.warn .hs-buyer-risk-body {
  font-size: 13px;
  color: #78350f;
  margin-top: 1px;
}
.hs-buyer-risk-row.ok .hs-buyer-risk-head {
  font-size: 14px;
  font-weight: 700;
  color: #14532d;
}
.hs-buyer-risk-row.ok .hs-buyer-risk-body {
  font-size: 13px;
  color: #166534;
  margin-top: 1px;
}
.hs-buyer-bd-sub {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
}
.hs-buyer-bd-note {
  background: #fef3c7;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  color: #78350f;
  line-height: 1.5;
  margin-top: 12px;
}
.hs-buyer-carbon-note {
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  opacity: 0.85;
  line-height: 1.5;
  color: #fff;
}
.hs-buyer-qa-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e5e7eb;
}
.hs-buyer-qa-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.hs-buyer-qa-sub {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px;
}
.hs-buyer-qa-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hs-buyer-qa-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 11px;
}
.hs-buyer-qa-ic {
  font-size: 17px;
  flex-shrink: 0;
}
.hs-buyer-qa-head {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}
.hs-buyer-qa-body {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.hs-buyer-save-cta {
  background: #ccfbf1;
  border: 1.5px solid #99f6e4;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.hs-buyer-save-ic {
  font-size: 26px;
  flex-shrink: 0;
}
.hs-buyer-save-body {
  flex: 1;
}
.hs-buyer-save-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
.hs-buyer-save-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.hs-buyer-save-arrow {
  font-size: 15px;
  font-weight: 700;
  color: #1f7a66;
  white-space: nowrap;
}

/* ── Neighbourhood re-use (buyer) ──────────────────────── */
.hs-nb-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e5e7eb;
}
.hs-nb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.hs-nb-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.hs-nb-rank {
  font-size: 12px;
  font-weight: 600;
  background: #fef3c7;
  color: #92400e;
  padding: 3px 9px;
  border-radius: 999px;
}
.hs-nb-body {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px;
}
.hs-nb-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.hs-nb-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  padding: 5px 4px;
  border-radius: 8px;
}
.hs-nb-row.mine {
  background: #ccfbf1;
  border: 1.5px solid #99f6e4;
  padding: 7px 8px;
}
.hs-nb-pos {
  width: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 12px;
  color: #94a3b8;
}
.hs-nb-pos.mine {
  color: #1f7a66;
}
.hs-nb-addr {
  font-size: 15px;
  color: #0f172a;
  font-weight: 500;
}
.hs-nb-addr.mine {
  color: #1f7a66;
  font-weight: 700;
}
.hs-nb-detail {
  font-size: 12px;
  color: #94a3b8;
}
.hs-nb-cost {
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
}

/* ── Quick wins ────────────────────────────────────────── */
.hs-qw-section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 20px 0 10px;
}
.hs-qw-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hs-qw-doc-row,
.hs-qw-pro-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: #fff;
  border: 1.5px solid #e2e8e8;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.hs-qw-doc-row:active,
.hs-qw-pro-row:active {
  transform: scale(0.99);
}
.hs-qw-doc-row.uploaded {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.hs-qw-doc-ic {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  font-size: 18px;
}
.hs-qw-doc-body {
  flex: 1;
  min-width: 0;
}
.hs-qw-doc-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
.hs-qw-doc-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 1px;
}
.hs-qw-doc-right {
  flex-shrink: 0;
}
.hs-qw-doc-pts {
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  background: #dcfce7;
  padding: 2px 7px;
  border-radius: 999px;
}
.hs-qw-doc-done {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #16a34a;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: grid;
  place-items: center;
}

/* Get move ready CTA */
.hs-qw-mr-cta {
  background: linear-gradient(135deg, #131129, #1e1842);
  border-radius: 18px;
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}
.hs-qw-mr-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(20, 184, 166, 0.25),
    transparent 70%
  );
  border-radius: 50%;
  pointer-events: none;
}
.hs-qw-mr-inner {
  position: relative;
  z-index: 1;
}
.hs-qw-mr-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
}
.hs-qw-mr-title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}
.hs-qw-mr-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.55;
  margin-bottom: 16px;
}
.hs-qw-mr-btn {
  width: 100%;
  border: none;
  padding: 15px;
  border-radius: 13px;
  background: #14b8a6;
  color: #042f2e;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* ── Move Ready ────────────────────────────────────────── */
.hs-mr-hero {
  background: linear-gradient(150deg, #1a1640 0%, #231d45 60%, #2a2158 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}
.hs-mr-hero-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 130px;
  height: 130px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.2), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.hs-mr-hero-inner {
  position: relative;
  z-index: 1;
}
.hs-mr-hero-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 10px;
}
.hs-mr-hero-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.hs-mr-hero-body {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 16px;
}
.hs-mr-compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.hs-mr-compare-col {
  border-radius: 12px;
  padding: 12px;
}
.hs-mr-compare-col.red {
  background: rgba(220, 38, 38, 0.15);
  border: 1px solid rgba(220, 38, 38, 0.3);
}
.hs-mr-compare-col.teal {
  background: rgba(20, 184, 166, 0.15);
  border: 1px solid rgba(20, 184, 166, 0.3);
}
.hs-mr-compare-head {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.hs-mr-compare-head.red {
  color: #fca5a5;
}
.hs-mr-compare-head.teal {
  color: #3dbda3;
}
.hs-mr-compare-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}
.hs-mr-compare-list.ok {
  color: rgba(255, 255, 255, 0.75);
}

.hs-mr-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.hs-mr-step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px;
  background: #fff;
  border: 1.5px solid #e2e8e8;
  border-radius: 14px;
}
.hs-mr-step-ic {
  width: 32px;
  height: 32px;
  background: #231d45;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}
.hs-mr-step-ic.teal {
  background: #1f7a66;
}
.hs-mr-step-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 3px;
}
.hs-mr-step-body {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}
.hs-mr-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}
.hs-mr-stat {
  background: #ccfbf1;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}
.hs-mr-stat-num {
  font-size: 20px;
  font-weight: 800;
  color: #1f7a66;
}
.hs-mr-stat-lbl {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.3;
}
.hs-mr-claim-btn {
  width: 100%;
  border: none;
  padding: 16px;
  border-radius: 14px;
  background: #231d45;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}
.hs-mr-claim-sub {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
}

/* "People searched this address this month" card — matches prototype */
.hs-searched-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.hs-searched-card--published {
  background: linear-gradient(135deg, #1f7a66, #0f766e);
  color: #fff;
}
.hs-searched-card--inprogress,
.hs-searched-card--unclaimed {
  background: linear-gradient(135deg, #1a1640, #231d45);
  color: #fff;
}
.hs-searched-glow {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  pointer-events: none;
}
.hs-searched-card--published .hs-searched-glow {
  background: rgba(255, 255, 255, 0.08);
}
.hs-searched-card--inprogress .hs-searched-glow,
.hs-searched-card--unclaimed .hs-searched-glow {
  background: rgba(94, 234, 212, 0.08);
}
.hs-searched-numwrap {
  text-align: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.hs-searched-num {
  font-size: 38px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -2px;
}
.hs-searched-card--published .hs-searched-num {
  color: #fff;
}
.hs-searched-card--inprogress .hs-searched-num,
.hs-searched-card--unclaimed .hs-searched-num {
  color: #3dbda3;
}
.hs-searched-numlbl {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 1px;
}
.hs-searched-card--published .hs-searched-numlbl {
  color: rgba(255, 255, 255, 0.6);
}
.hs-searched-card--inprogress .hs-searched-numlbl,
.hs-searched-card--unclaimed .hs-searched-numlbl {
  color: rgba(255, 255, 255, 0.45);
}
.hs-searched-divider {
  width: 1px;
  height: 44px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.hs-searched-card--published .hs-searched-divider {
  background: rgba(255, 255, 255, 0.2);
}
.hs-searched-card--inprogress .hs-searched-divider,
.hs-searched-card--unclaimed .hs-searched-divider {
  background: rgba(255, 255, 255, 0.1);
}
.hs-searched-body {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.hs-searched-live {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #3dbda3;
  margin-bottom: 4px;
}
.hs-searched-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3dbda3;
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.25);
  animation: hs-pulse-mint 1.5s infinite;
  flex-shrink: 0;
}
@keyframes hs-pulse-mint {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(94, 234, 212, 0.4);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(94, 234, 212, 0);
  }
}
.hs-searched-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}
.hs-searched-card--published .hs-searched-title,
.hs-searched-card--inprogress .hs-searched-title,
.hs-searched-card--unclaimed .hs-searched-title {
  color: #fff;
}
.hs-searched-sub {
  font-size: 13px;
  margin-top: 4px;
  line-height: 1.4;
}
.hs-searched-card--published .hs-searched-sub {
  color: rgba(255, 255, 255, 0.75);
}
.hs-searched-card--inprogress .hs-searched-sub,
.hs-searched-card--unclaimed .hs-searched-sub {
  color: rgba(255, 255, 255, 0.6);
}
.hs-searched-card--inprogress .hs-searched-title,
.hs-searched-card--unclaimed .hs-searched-title {
  font-size: 14px;
  line-height: 1.35;
}

/* Auth-gate modal */
.hs-authgate-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  padding: 20px;
}
.hs-authgate-card {
  width: 100%;
  max-width: 24rem;
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}
.hs-authgate-ic {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f0fdfa;
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
  font-size: 26px;
}
.hs-authgate-title {
  font-size: 18px;
  font-weight: 800;
  color: #1f2024;
  margin-bottom: 6px;
}
.hs-authgate-sub {
  font-size: 15px;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 18px;
}
.hs-authgate-primary {
  width: 100%;
  border: none;
  padding: 14px;
  border-radius: 12px;
  background: #00a19a;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 8px;
}
.hs-authgate-ghost {
  width: 100%;
  border: none;
  padding: 12px;
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

/* ──────────────────────────────────────────────────────────────
   BUYER-RESULTS (watch) — matches homescore-v2_13.html prototype
   ────────────────────────────────────────────────────────────── */
.bv-root {
  --bv-navy: #231d45;
  --bv-navy-soft: #4a4566;
  --bv-teal: #00a19a;
  --bv-teal-bright: #00b6ae;
  --bv-teal-dark: #007e78;
  --bv-teal-deep: #00514d;
  --bv-teal-pale: #e5f4f2;
  --bv-teal-paler: #f2faf8;
  --bv-amber: #e6a23c;
  --bv-amber-pale: #fbefd9;
  --bv-red: #c73e36;
  --bv-bg: #fafafa;
  --bv-text-soft: #6b6783;
  --bv-text-faint: #9c98ad;
  --bv-line: #ececef;
  --bv-line-soft: #f5f5f7;
  --bv-success: #2eab55;
  background: var(--bv-bg);
}

/* ── Web layout (buyer-results screen on desktop) ─────────────────── */
.bv-root--web {
  background: transparent;
}
.bvw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.bvw-head {
  max-width: 680px;
  margin-bottom: 24px;
}
.bvw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--bv-teal-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.bvw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--bv-teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.bvw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.bvw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.bvw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.bvw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
/* Sidebar cards fill the column (reset their 28rem-era margins). */
.bvw-layout .bvw-aside > * {
  margin: 0;
}
.bvw-content {
  min-width: 0;
}
/* The report sections keep their native side gutters so headers and cards
   stay aligned; just trim the first one's top padding. */
.bvw-content > .bv-section-h:first-child {
  padding-top: 0;
}

@media (max-width: 980px) {
  .bvw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .bvw-aside {
    position: static;
  }
}

/* ── Address card (consistent with ResultDetail) ────────────── */
.bv-addr-card {
  margin: 16px 22px 0;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, var(--bv-teal-bright) 0%, var(--bv-teal) 50%, #007e78 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -8px rgba(0, 130, 125, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.bv-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.bv-addr-card > * {
  position: relative;
  z-index: 1;
}
.bv-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.bv-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 6px;
}
.bv-addr-block {
  flex: 1;
  min-width: 0;
}
.bv-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
  min-height: 1.2em;
}
.bv-typewriter-caret {
  display: inline-block;
  margin-left: 1px;
  font-weight: 400;
  color: rgba(35, 29, 69, 0.55);
  animation: bv-caretBlink 0.85s steps(2, end) infinite;
}
@keyframes bv-caretBlink {
  to {
    opacity: 0;
  }
}
.bv-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}
.bv-addr-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.bv-addr-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.05px;
}
.bv-addr-pill.epc {
  padding-left: 6px;
}
.bv-epc-letter {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.bv-state-unclaimed,
.bv-state-progress {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: var(--bv-teal-deep);
}
.bv-state-published {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: var(--bv-teal-deep);
}
.bv-addr-stats {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.bv-stat-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}
.bv-stat-count {
  font-weight: 800;
}
.bv-sep {
  opacity: 0.5;
}
.bv-pulse-dot {
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}
.bv-pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  animation: bv-pulse 1.6s ease-out infinite;
}
.bv-pulse-green {
  background: #6bd4cd;
}
.bv-pulse-green::after {
  border-color: rgba(94, 234, 212, 0.5);
}
@keyframes bv-pulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* ── Running cost hero (navy gradient) ─────────────────────── */
.bv-cost-hero {
  margin: 12px 22px 0;
  padding: 22px 20px 20px;
  background: linear-gradient(
    135deg,
    var(--bv-navy-soft) 0%,
    var(--bv-navy) 60%,
    #0d1a3a 100%
  );
  border-radius: 20px;
  color: #fff;
  box-shadow: 0 12px 32px -8px rgba(35, 29, 69, 0.45);
}
.bv-cost-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.bv-cost-num {
  font-size: 38px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1.2px;
  line-height: 1;
  margin-bottom: 10px;
}
.bv-cost-unit {
  font-size: 20px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
}
.bv-cost-sub {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 16px;
}
.bv-cost-sub b {
  color: #6bd4cd;
  font-weight: 800;
}
.bv-cost-stats {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}
.bv-cost-stat {
  flex: 1;
  padding: 10px 8px;
  text-align: center;
}
.bv-cost-stat-num {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}
.bv-cost-stat-label {
  font-size: 9px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 2px;
}
.bv-cost-stat-div {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}
/* ── Live checked / watching rows (inside amber address card) ── */
.bv-addr-live {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bv-addr-live-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.3;
}
.bv-addr-live-row b {
  font-weight: 800;
  color: #fff;
}
.bv-addr-live-ic {
  font-size: 13px;
  flex-shrink: 0;
}

/* ── "This property is unclaimed" navy banner ────────────────── */
.bv-claim-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: 18px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--bv-navy-soft) 0%, var(--bv-navy) 70%, #0d1a3a 100%);
  color: #fff;
  box-shadow: 0 12px 30px -10px rgba(35, 29, 69, 0.5);
  transition: transform 0.15s, box-shadow 0.15s;
}
.bv-claim-banner:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px -10px rgba(35, 29, 69, 0.55);
}
.bv-claim-body {
  flex: 1;
  min-width: 0;
}
.bv-claim-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
}
.bv-claim-sub {
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.4;
}
.bv-claim-arrow {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.14);
  font-size: 17px;
  font-weight: 700;
}

/* ── Buyer confidence gauge card ─────────────────────────────── */
.bv-confidence-card {
  padding: 18px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #eef0f4;
  box-shadow: 0 6px 20px rgba(24, 52, 88, 0.07);
}
.bv-confidence-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bv-confidence-shield {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #f5f7fb;
}
.bv-confidence-shield svg {
  width: 22px;
  height: 22px;
}
.bv-confidence-text {
  flex: 1;
  min-width: 0;
}
.bv-confidence-eyebrow {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9c98ad;
}
.bv-confidence-title {
  margin-top: 2px;
  font-size: 16px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.2px;
  line-height: 1.2;
}
.bv-confidence-dial {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.bv-confidence-dial svg {
  width: 56px;
  height: 56px;
  transform: rotate(-90deg);
}
.bv-dial-bg {
  fill: none;
  stroke: #eef0f4;
}
.bv-dial-fill {
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.bv-dial-num {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 800;
  color: var(--bv-navy);
}
.bv-confidence-note {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f1f5;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.4;
}

/* ── Watch this property card ────────────────────────────────── */
.bv-watch-card {
  margin: 0 22px;
  padding: 20px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #eef0f4;
  box-shadow: 0 6px 20px rgba(24, 52, 88, 0.07);
}
.bv-watch-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9c98ad;
}
.bv-watch-title {
  margin-top: 6px;
  font-size: 19px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.3px;
}
.bv-watch-lede {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.5;
}
.bv-watch-lede b {
  color: var(--bv-navy);
  font-weight: 700;
}
.bv-watch-rows {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
}
.bv-watch-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #f2f3f7;
}
.bv-watch-row:last-child {
  border-bottom: none;
}
.bv-watch-ic {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: #f5f7fb;
  font-size: 15px;
}
.bv-watch-body {
  flex: 1;
  min-width: 0;
}
.bv-watch-row-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.1px;
}
.bv-watch-row-sub {
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.4;
}
.bv-watch-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 14px;
  background: var(--bv-teal);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px -6px rgba(0, 161, 154, 0.5);
  transition: transform 0.15s, filter 0.15s;
}
.bv-watch-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}
.bv-watch-btn:disabled {
  background: #eaf6f5;
  color: #017a72;
  box-shadow: none;
  cursor: default;
}

/* ── Verified buyer upsell (navy) ────────────────────────────── */
.bv-verified-card {
  margin: 14px 22px 0;
  padding: 20px;
  border-radius: 18px;
  background: linear-gradient(150deg, var(--bv-navy) 0%, #2f2760 55%, #0d1a3a 100%);
  color: #fff;
  box-shadow: 0 14px 32px -10px rgba(35, 29, 69, 0.5);
}
.bv-verified-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}
.bv-verified-title {
  margin-top: 6px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
}
.bv-verified-lede {
  margin-top: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
}
.bv-verified-rows {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bv-verified-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.09);
}
.bv-verified-ic {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  background: rgba(107, 212, 205, 0.18);
  color: #6bd4cd;
  font-size: 14px;
  font-weight: 800;
}
.bv-verified-body {
  flex: 1;
  min-width: 0;
}
.bv-verified-row-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.1px;
}
.bv-verified-row-sub {
  margin-top: 2px;
  font-size: 12.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.4;
}
.bv-verified-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 14px;
  background: var(--bv-teal);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px -6px rgba(0, 161, 154, 0.55);
  transition: transform 0.15s, filter 0.15s;
}
.bv-verified-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

/* ── Section header (mirrors costs page) ───────────────────── */
.bv-section-h {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 22px 10px;
}
.bv-section-h-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    var(--bv-teal-bright),
    var(--bv-teal-dark)
  );
  box-shadow: 0 3px 10px rgba(0, 161, 154, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bv-section-h-icon svg {
  width: 16px;
  height: 16px;
}
.bv-section-h-icon.warn {
  background: linear-gradient(135deg, #f0b656, #c18a38);
  box-shadow: 0 3px 10px rgba(230, 162, 60, 0.3);
}
.bv-section-h-icon.save {
  background: linear-gradient(135deg, var(--bv-navy-soft), var(--bv-navy));
  box-shadow: 0 3px 10px rgba(35, 29, 69, 0.3);
}
.bv-section-h-text {
  flex: 1;
  min-width: 0;
}
.bv-section-h-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.2px;
  line-height: 1.1;
}
.bv-section-h-sub {
  font-size: 13px;
  font-weight: 600;
  color: var(--bv-text-soft);
  letter-spacing: -0.05px;
  margin-top: 2px;
}

/* ── Buyer risk summary card (amber outer + pastel inner rows) ── */
/* ── Buyer report tabs ────────────────────────────────────────────── */
.bv-tabs {
  display: flex;
  gap: 6px;
  margin: 0 22px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}
.bv-tabs::-webkit-scrollbar {
  display: none;
}
.bv-tab {
  flex: 1 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  border: 1px solid #e7ecf2;
  background: #fff;
  color: #6b6783;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 15px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s;
}
.bv-tab:hover {
  color: #231d45;
}
.bv-tab.active {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
  box-shadow: 0 6px 14px rgba(0, 161, 154, 0.24);
}
.bv-tab-ic {
  font-size: 13px;
}
.bv-tabpanel {
  animation: bv-tabfade 0.28s ease;
}
@keyframes bv-tabfade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Costs / Sold hero + rows */
.bv-costs-hero {
  margin: 0 22px 12px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(150deg, #00a19a 0%, #00b6ad 100%);
  color: #fff;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.22);
}
.bv-costs-hero.sold {
  background: linear-gradient(150deg, #231d45 0%, #3a2f78 100%);
  box-shadow: 0 10px 24px rgba(35, 29, 69, 0.22);
}
.bv-costs-eyebrow {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-bottom: 6px;
}
.bv-costs-num {
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
}
.bv-costs-num span {
  font-size: 15px;
  font-weight: 700;
  opacity: 0.8;
}
.bv-costs-sub {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.4;
}
.bv-costs-rows {
  margin: 0 22px 10px;
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(24, 52, 88, 0.06);
}
.bv-costs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f7;
}
.bv-costs-row:last-child {
  border-bottom: none;
}
.bv-costs-row-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #231d45;
}
.bv-costs-row-label small {
  font-weight: 500;
  color: #9c98ad;
}
.bv-costs-row b {
  font-size: 14px;
  font-weight: 900;
  color: #231d45;
  white-space: nowrap;
}
.bv-arealinks {
  margin: 0 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bv-arealink {
  display: flex;
  flex-direction: column;
  padding: 13px 16px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #eef0f4;
  font-size: 13.5px;
  font-weight: 700;
  color: #231d45;
  box-shadow: 0 4px 14px rgba(24, 52, 88, 0.05);
}
.bv-arealink small {
  font-weight: 500;
  color: #9c98ad;
  margin-top: 2px;
  font-size: 11.5px;
}
.bv-area-note {
  margin: 0 22px 12px;
  padding: 16px;
  border-radius: 14px;
  background: #f4faf8;
  border: 1px solid #d7efea;
}
.bv-area-note-title {
  font-size: 14px;
  font-weight: 800;
  color: #017a72;
  margin-bottom: 6px;
}
.bv-area-note-body {
  font-size: 12.5px;
  color: #4a5570;
  line-height: 1.5;
}

/* ── Crime breakdown (Area tab · data.police.uk) ─────────────── */
.bv-crime-card {
  margin: 0 22px 10px;
  padding: 16px;
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(24, 52, 88, 0.06);
}
.bv-crime-head {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9c98ad;
  margin-bottom: 12px;
}
.bv-crime-row {
  display: grid;
  grid-template-columns: 148px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
}
.bv-crime-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--bv-navy);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bv-crime-bar-wrap {
  height: 8px;
  border-radius: 6px;
  background: #f0f1f5;
  overflow: hidden;
}
.bv-crime-bar {
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #00a19a, #33b1aa);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.bv-crime-val {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--bv-navy);
  text-align: right;
}
@media (max-width: 460px) {
  .bv-crime-row {
    grid-template-columns: 110px 1fr 36px;
  }
}

.bv-risks-card {
  margin: 0 22px;
  background: #fff;
  border: 2px solid var(--bv-amber);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(230, 162, 60, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bv-risk-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 2px solid;
}
.bv-risk-row.green {
  background: #f0fbf4;
  border-color: #b8e8c8;
}
.bv-risk-row.amber {
  background: #fffbf0;
  border-color: rgba(230, 162, 60, 0.4);
}
.bv-risk-row.red {
  background: #fef0ef;
  border-color: rgba(199, 62, 54, 0.3);
}
.bv-risk-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}
.bv-risk-body {
  flex: 1;
  min-width: 0;
}
.bv-risk-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.15px;
  margin-bottom: 2px;
}
.bv-risk-row.green .bv-risk-title {
  color: #2e7d4f;
}
.bv-risk-row.amber .bv-risk-title {
  color: var(--bv-amber);
}
.bv-risk-row.red .bv-risk-title {
  color: var(--bv-red);
}
.bv-risk-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.4;
}

/* ── Score breakdown card (teal border) ────────────────────── */
.bv-breakdown-card {
  margin: 0 22px;
  background: #fff;
  border: 2px solid var(--bv-teal);
  border-radius: 16px;
  padding: 16px 16px 14px;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.08);
}
.bv-breakdown-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.5;
  margin-bottom: 14px;
}
.bv-breakdown-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}
.bv-breakdown-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bv-bd-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--bv-navy);
  width: 62px;
  flex-shrink: 0;
}
.bv-bd-bar-wrap {
  flex: 1;
  height: 7px;
  background: var(--bv-line-soft);
  border-radius: 100px;
  overflow: hidden;
}
.bv-bd-bar {
  height: 100%;
  border-radius: 100px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.bv-bd-val {
  font-size: 13px;
  font-weight: 800;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}
.bv-bd-note {
  font-size: 13px;
  font-weight: 500;
  color: #8b6b00;
  background: #fffbe6;
  border: 1px solid #f0dc80;
  border-radius: 8px;
  padding: 9px 11px;
  line-height: 1.5;
}

/* ── Questions to ask (navy outer + teal-pale inner rows) ──── */
.bv-questions-card {
  margin: 0 22px;
  background: #fff;
  border: 2px solid var(--bv-navy);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(35, 29, 69, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bv-q-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #fff;
  border: 2px solid var(--bv-teal-pale);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.bv-q-row:hover {
  border-color: var(--bv-teal);
  background: var(--bv-teal-paler);
}
.bv-q-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}
.bv-q-body {
  flex: 1;
  min-width: 0;
}
.bv-q-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.15px;
  margin-bottom: 3px;
}
.bv-q-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.4;
}

/* ── Save to Buyer Profile card ────────────────────────────── */
.bv-save-card {
  margin: 16px 22px 0;
  padding: 16px 18px;
  background: var(--bv-teal-paler);
  border: 2px solid var(--bv-teal-pale);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.bv-save-card:hover {
  border-color: var(--bv-teal);
  transform: translateY(-1px);
}
.bv-save-icon {
  width: 38px;
  height: 38px;
  background: var(--bv-teal);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.bv-save-icon svg {
  width: 16px;
  height: 16px;
}
.bv-save-body {
  flex: 1;
  min-width: 0;
}
.bv-save-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--bv-navy);
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}
.bv-save-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--bv-text-soft);
  line-height: 1.4;
}
.bv-save-cta {
  font-size: 15px;
  font-weight: 800;
  color: var(--bv-teal-dark);
  flex-shrink: 0;
}

/* ── Back link ─────────────────────────────────────────────── */
.bv-back {
  display: block;
  margin: 14px auto 0;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: var(--bv-text-soft);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 14px;
}
.bv-back:hover {
  color: var(--bv-navy);
}

/* ──────────────────────────────────────────────────────────────
   SIMULATOR — replaces the old quiz; matches homescore-v2_13.html
   ────────────────────────────────────────────────────────────── */
/* ── Web layout (questions / accuracy-check screen on desktop) ────── */
.sim-root--web {
  max-width: none !important;
  min-height: auto;
  background: transparent;
  overflow: visible;
}
.simw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.simw-head {
  max-width: 680px;
  margin-bottom: 24px;
}
.simw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.simw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.simw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.simw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.simw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.simw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
/* Sidebar cards fill the column (reset their 28rem-era margins/padding). */
.simw-layout .simw-aside > * {
  margin: 0;
}
.simw-content {
  min-width: 0;
}
/* The content keeps the sections' native spacing; just trim the first one's
   top margin so it aligns with the sidebar. */
.simw-content > .sim-paths {
  margin-top: 0;
}

@media (max-width: 980px) {
  .simw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .simw-aside {
    position: static;
  }
}

.sim-root {
  --sim-navy: #231d45;
  --sim-navy-soft: #4a4566;
  --sim-teal: #00a19a;
  --sim-teal-bright: #00b6ae;
  --sim-teal-dark: #007e78;
  --sim-teal-deep: #00514d;
  --sim-teal-pale: #e5f4f2;
  --sim-teal-paler: #f2faf8;
  --sim-amber: #e6a23c;
  --sim-amber-pale: #fbefd9;
  --sim-red: #c73e36;
  --sim-bg: #fafafa;
  --sim-text-soft: #6b6783;
  --sim-text-faint: #9c98ad;
  --sim-line: #ececef;
  --sim-line-soft: #f5f5f7;

  background: var(--sim-bg);
  min-height: 100dvh;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
  color: var(--sim-navy);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Top nav */
.sim-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.sim-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--sim-teal-paler);
  border: 1px solid var(--sim-teal-pale);
  color: var(--sim-teal);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: inherit;
}
.sim-back-btn svg {
  width: 14px;
  height: 14px;
}
.sim-eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--sim-teal-paler);
  border: 1px solid var(--sim-teal-pale);
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--sim-teal);
  text-transform: uppercase;
}
.sim-eyebrow-pill .dot {
  width: 6px;
  height: 6px;
  background: var(--sim-teal);
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--sim-teal-pale);
}

/* Address card — amber, ResultDetail-consistent */
.sim-addr-card {
  margin: 8px 16px 0;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #f0a030 0%, #c67c18 50%, #8b4e0a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -8px rgba(180, 100, 20, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.sim-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.sim-addr-card > * {
  position: relative;
  z-index: 1;
}
.sim-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.sim-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 6px;
}
.sim-addr-block {
  flex: 1;
  min-width: 0;
}
.sim-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.sim-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}

/* Hero */
.sim-hero {
  margin: 12px 16px 0;
  background: #fff;
  border: 2px solid var(--sim-teal-pale);
  box-shadow: 0 4px 20px rgba(0, 161, 154, 0.08);
  border-radius: 20px;
  padding: 18px 20px;
  position: relative;
  overflow: hidden;
}
.sim-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 161, 154, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
}
.sim-hero > * {
  position: relative;
  z-index: 1;
}
.sim-hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 9px;
  font-weight: 800;
  color: var(--sim-teal-dark);
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.sim-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00a19a;
  box-shadow: 0 0 0 0 rgba(0, 161, 154, 0.5);
  animation: sim-live-pulse 1.6s ease-out infinite;
}
@keyframes sim-live-pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 161, 154, 0.5); }
  100% { box-shadow: 0 0 0 7px rgba(0, 161, 154, 0); }
}
.sim-pts-badge {
  margin-left: auto;
  letter-spacing: 0.02em;
  font-size: 11px;
  font-weight: 900;
  color: #00857f;
  background: rgba(0, 161, 154, 0.12);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 999px;
  padding: 3px 10px;
  text-transform: none;
}
.sim-score-aim {
  font-size: 11.5px;
  font-weight: 700;
  color: #b06a00;
  line-height: 1.35;
  margin: 2px 0 4px;
}
.sim-score-aim--hit {
  color: #00857f;
}
.sim-hero-body {
  font-size: 13px;
  font-weight: 600;
  color: var(--sim-text-soft);
  line-height: 1.55;
  margin-bottom: 14px;
}
.sim-hero-body b {
  color: var(--sim-navy);
}
.sim-score-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.sim-score-dial {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.sim-score-dial svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.sim-score-dial .dial-bg {
  stroke: var(--sim-line-soft);
  fill: none;
}
.sim-score-dial .dial-fill {
  fill: none;
  stroke-linecap: round;
  transition:
    stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    stroke 0.4s;
}
.sim-score-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.sim-score-num {
  font-size: 22px;
  font-weight: 800;
  color: var(--sim-navy);
  line-height: 1;
}
.sim-score-denom {
  font-size: 11px;
  color: var(--sim-text-faint);
}
.sim-score-info {
  flex: 1;
}
.sim-score-band {
  font-size: 14px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 3px;
}
.sim-score-grade {
  font-size: 13px;
  color: var(--sim-text-soft);
}
.sim-stats-row {
  display: flex;
  gap: 0;
  background: var(--sim-teal-paler);
  border: 1.5px solid var(--sim-teal-pale);
  border-radius: 12px;
  overflow: hidden;
}
.sim-stat {
  flex: 1;
  padding: 10px 12px;
  border-right: 1px solid var(--sim-teal-pale);
}
.sim-stat:last-child {
  border-right: none;
}
.sim-stat-label {
  font-size: 9px;
  font-weight: 800;
  color: var(--sim-teal-dark);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.sim-stat-val {
  font-size: 15px;
  font-weight: 800;
  color: var(--sim-navy);
  letter-spacing: -0.3px;
  transition: color 0.3s;
}
.sim-stat-val.improved {
  color: var(--sim-teal);
}
.sim-stat-delta {
  font-size: 11px;
  font-weight: 700;
  color: var(--sim-teal);
  margin-top: 1px;
  min-height: 14px;
}

/* Two paths */
.sim-paths {
  margin: 14px 16px 0;
  background: var(--sim-teal-paler);
  border: 1.5px solid var(--sim-teal-pale);
  border-radius: 16px;
  padding: 14px 16px;
}
.sim-paths-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--sim-teal-dark);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.sim-paths-row {
  display: flex;
  gap: 8px;
}
.sim-path {
  flex: 1;
  background: #fff;
  border: 1.5px solid var(--sim-teal-pale);
  border-radius: 12px;
  padding: 10px 12px;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.15s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.15s,
    border-color 0.15s,
    background 0.15s;
}
.sim-path:hover {
  border-color: var(--sim-teal);
  transform: translateY(-1px);
}
.sim-path.active {
  border-color: var(--sim-teal);
  background: var(--sim-teal-paler);
  box-shadow: 0 4px 12px rgba(0, 161, 154, 0.18);
}
.sim-path.bill {
  border-width: 2px;
}
.sim-path-icon {
  font-size: 16px;
  margin-bottom: 4px;
}
.sim-path-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 3px;
}
.sim-path.bill .sim-path-title {
  color: var(--sim-teal-dark);
}
.sim-path-sub {
  font-size: 11px;
  font-weight: 500;
  color: var(--sim-text-soft);
  line-height: 1.4;
}
.sim-paths-or {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--sim-text-faint);
}

/* Progress + steps block */
.sim-questions-block {
  transition:
    opacity 0.5s ease,
    max-height 0.6s ease;
}
.sim-progress-row {
  margin: 12px 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sim-progress-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--sim-text-soft);
}
.sim-progress-count {
  font-size: 12px;
  font-weight: 800;
  color: var(--sim-teal);
}
.sim-progress-track {
  margin: 6px 16px 0;
  height: 4px;
  background: var(--sim-line-soft);
  border-radius: 100px;
  overflow: hidden;
}
.sim-progress-fill {
  height: 100%;
  background: var(--sim-teal);
  border-radius: 100px;
  transition: width 0.4s;
}

/* Step cards */
.sim-steps {
  margin: 12px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sim-step {
  background: #fff;
  border: 2px solid var(--sim-line-soft);
  border-radius: 14px;
  overflow: hidden;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
  cursor: pointer;
}
.sim-step.idle:hover {
  border-color: var(--sim-teal);
  box-shadow: 0 6px 20px rgba(0, 161, 154, 0.15);
  transform: translateY(-2px);
}
.sim-step.done {
  border-color: var(--sim-teal);
  background: linear-gradient(135deg, var(--sim-teal-paler) 0%, white 60%);
}
.sim-step.todo {
  border-color: var(--sim-navy);
  background: linear-gradient(135deg, #eeedf6 0%, white 60%);
}
.sim-step.skip {
  opacity: 0.55;
}
.sim-step.diff {
  border-color: #3b4fcc;
  background: linear-gradient(135deg, #f0f4ff 0%, white 60%);
}
.sim-step-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}
.sim-step-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--sim-line-soft);
  color: var(--sim-text-faint);
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.2s,
    color 0.2s;
}
.sim-step.done .sim-step-num {
  background: var(--sim-teal);
  color: #fff;
}
.sim-step.todo .sim-step-num {
  background: var(--sim-navy);
  color: #fff;
}
.sim-step.skip .sim-step-num {
  background: var(--sim-text-faint);
  color: #fff;
}
.sim-step.diff .sim-step-num {
  background: #3b4fcc;
  color: #fff;
}
.sim-step-body {
  flex: 1;
  min-width: 0;
}
.sim-step-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 1px;
}
.sim-step-meta {
  font-size: 11px;
  color: var(--sim-text-soft);
}
.sim-step-badge {
  font-size: 16px;
  flex-shrink: 0;
  min-width: 20px;
  text-align: center;
}
.sim-step-expand {
  display: none;
  padding: 0 14px 14px;
  border-top: 1px solid var(--sim-line-soft);
}
.sim-step.open .sim-step-expand {
  display: block;
}
.sim-step-desc {
  font-size: 12px;
  color: var(--sim-text-soft);
  line-height: 1.5;
  margin: 10px 0 8px;
}
.sim-step-impact {
  font-size: 12px;
  font-weight: 700;
  color: var(--sim-teal-dark);
  background: var(--sim-teal-paler);
  padding: 6px 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.sim-step-question {
  font-size: 13px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 8px;
}
.sim-step-btns {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sim-step-btn {
  width: 100%;
  padding: 10px 12px;
  border-radius: 9px;
  border: 1.5px solid;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}
.sim-step-btn.done {
  background: var(--sim-teal-paler);
  color: var(--sim-teal-dark);
  border-color: var(--sim-teal-pale);
}
.sim-step-btn.done:hover {
  background: var(--sim-teal-pale);
}
.sim-step-btn.diff {
  background: #f0f4ff;
  color: #3b4fcc;
  border-color: #c5ceff;
}
.sim-step-btn.diff:hover {
  background: #e0e7ff;
  border-color: #3b4fcc;
  transform: translateX(3px);
}
.sim-step-btn.todo {
  background: #eeedf6;
  color: var(--sim-navy);
  border-color: #c8c5e0;
}
.sim-step-btn.todo:hover {
  background: #dddbe8;
}
.sim-step-btn.skip {
  background: var(--sim-bg);
  color: var(--sim-text-faint);
  border-color: var(--sim-line-soft);
}

/* Bill-path placeholder/confirm cards */
.sim-bill-picker,
.sim-bill-confirm {
  margin: 10px 16px 0;
  background: linear-gradient(135deg, var(--sim-teal-paler), #d4f0ed);
  border: 2px solid var(--sim-teal-pale);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.sim-bill-picker:hover {
  border-color: var(--sim-teal);
}
.sim-bill-emoji {
  font-size: 28px;
  flex-shrink: 0;
}
.sim-bill-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 3px;
}
.sim-bill-sub {
  font-size: 12px;
  font-weight: 500;
  color: var(--sim-text-soft);
  line-height: 1.5;
}

/* Publish prompt */
.sim-publish {
  margin: 14px 16px 0;
  background: linear-gradient(135deg, var(--sim-teal-paler), #d4f0ed);
  border: 2px solid var(--sim-teal-pale);
  border-radius: 16px;
  padding: 16px 18px;
}
.sim-publish-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 4px;
}
.sim-publish-sub {
  font-size: 12px;
  color: var(--sim-text-soft);
  line-height: 1.5;
  margin-bottom: 12px;
}
.sim-publish-btns {
  display: flex;
  gap: 8px;
}
.sim-publish-go {
  flex: 1;
  padding: 10px;
  background: var(--sim-teal);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}
.sim-publish-skip {
  padding: 10px 14px;
  background: #fff;
  border: 1.5px solid var(--sim-teal-pale);
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--sim-text-soft);
  cursor: pointer;
}

/* EPC nudge — variant-driven, matches prototype simUpdateEpcNudge() */
.sim-epc-nudge {
  margin: 10px 16px 0;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}
.sim-epc-nudge--neutral {
  background: #fff;
  border: 2px solid var(--sim-line-soft);
}
.sim-epc-nudge--improved {
  background: #fff;
  border: 2px solid var(--sim-amber-pale);
}
.sim-epc-nudge--good,
.sim-epc-nudge--bill {
  background: var(--sim-teal-paler);
  border: 2px solid var(--sim-teal-pale);
}
.sim-epc-nudge-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.sim-epc-nudge-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--sim-navy);
  margin-bottom: 3px;
}
.sim-epc-nudge-body {
  font-size: 12px;
  color: var(--sim-text-soft);
  line-height: 1.5;
}
.sim-epc-nudge-cta {
  padding: 8px 14px;
  background: var(--sim-amber);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

/* Bottom CTA */
.sim-cta {
  margin: 14px 16px 0;
}
.sim-cta-btn {
  width: 100%;
  padding: 16px;
  background: var(--sim-teal);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.sim-cta-btn:hover {
  background: var(--sim-teal-bright);
}
.sim-reset-btn {
  width: 100%;
  margin-top: 8px;
  padding: 10px;
  background: none;
  border: 1.5px solid var(--sim-line-soft);
  border-radius: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--sim-text-soft);
  cursor: pointer;
}

/* "Done something different" modal */
.sim-diff-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sim-diff-card {
  background: #fff;
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 36px;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.18);
}
/* Modal lives outside .sim-root (it's a sibling of the sim screen), so the
   sim-* CSS variables don't cascade — use literal palette here. */
.sim-diff-handle {
  width: 40px;
  height: 4px;
  background: #f5f5f7;
  border-radius: 100px;
  margin: 0 auto 20px;
}
.sim-diff-title {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  margin-bottom: 6px;
}
.sim-diff-body {
  font-size: 13px;
  color: #6b6783;
  margin-bottom: 16px;
  line-height: 1.5;
}
.sim-diff-textarea {
  width: 100%;
  border: 2px solid #e5f4f2;
  border-radius: 12px;
  padding: 12px;
  font-family: inherit;
  font-size: 15px;
  color: #231d45;
  resize: none;
  height: 90px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}
.sim-diff-textarea:focus {
  border-color: #00a19a;
}
.sim-diff-tip {
  margin-top: 10px;
  padding: 12px 14px;
  background: #fff8ec;
  border: 1.5px solid #fbefd9;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.sim-diff-tip-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.sim-diff-tip-text {
  font-size: 12px;
  color: #231d45;
  line-height: 1.5;
}
.sim-diff-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}
.sim-diff-save {
  flex: 1;
  padding: 13px;
  background: #00a19a;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.3);
}
.sim-diff-save:hover {
  background: #00b6ae;
}
.sim-diff-cancel {
  padding: 13px 16px;
  background: #fafafa;
  border: 1.5px solid #f5f5f7;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: #6b6783;
  cursor: pointer;
}
.sim-diff-cancel:hover {
  color: #231d45;
  border-color: #c8c5e0;
}

/* Sheet-up transition */
.sim-modal-enter-active,
.sim-modal-leave-active {
  transition: opacity 0.25s ease;
}
.sim-modal-enter-active .sim-diff-card,
.sim-modal-leave-active .sim-diff-card {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.sim-modal-enter-from,
.sim-modal-leave-to {
  opacity: 0;
}
.sim-modal-enter-from .sim-diff-card,
.sim-modal-leave-to .sim-diff-card {
  transform: translateY(20px);
}

/* ──────────────────────────────────────────────────────────────
   POST-QUIZ (refined results) — matches homescore-v2_13.html postquiz
   ────────────────────────────────────────────────────────────── */
.pq-root {
  --pq-navy: #231d45;
  --pq-teal: #00a19a;
  --pq-teal-bright: #00b6ae;
  --pq-teal-dark: #007e78;
  --pq-teal-deep: #00514d;
  --pq-teal-pale: #e5f4f2;
  --pq-teal-paler: #f2faf8;
  --pq-text-soft: #6b6783;
  --pq-text-faint: #9c98ad;
  --pq-line: #ececef;
  --pq-line-soft: #f5f5f7;
  --pq-success: #2eab55;
  --pq-bg: #fafafa;

  background: var(--pq-bg);
  min-height: 100dvh;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
  color: var(--pq-navy);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── Web layout (results screen on desktop) ───────────────────────── */
.pq-root--web {
  max-width: none;
  min-height: auto;
  background: transparent;
  padding-bottom: 0;
  overflow: visible;
}
.pqw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.pqw-head {
  max-width: 680px;
  margin-bottom: 24px;
}
.pqw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--pq-teal-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.pqw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--pq-teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.pqw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.pqw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.pqw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.pqw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.pqw-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}
/* Neutralise the cards' original 28rem-era side margins — spacing is now the
   flex gaps. Specificity (0,3,0) wins over each card's own margin rule. */
.pqw-layout .pqw-aside > *,
.pqw-layout .pqw-content > * {
  margin: 0;
}

@media (max-width: 980px) {
  .pqw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .pqw-aside {
    position: static;
  }
}

/* Top nav */
.pq-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.pq-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--pq-teal-paler);
  border: 1px solid var(--pq-teal-pale);
  color: var(--pq-teal);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: inherit;
}
.pq-back-btn svg {
  width: 14px;
  height: 14px;
}
.pq-topnav-centre {
  text-align: center;
}
.pq-topnav-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--pq-navy);
  letter-spacing: -0.2px;
}
.pq-topnav-sub {
  font-size: 12px;
  font-weight: 600;
  color: var(--pq-text-soft);
  margin-top: 1px;
}

/* Amber address card — consistent with ResultDetail */
.pq-addr-card {
  margin: 8px 22px 0;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #f0a030 0%, #c67c18 50%, #8b4e0a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -8px rgba(180, 100, 20, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.pq-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.pq-addr-card > * {
  position: relative;
  z-index: 1;
}
.pq-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.pq-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 6px;
}
.pq-addr-block {
  flex: 1;
  min-width: 0;
}
.pq-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.pq-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}
.pq-addr-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.pq-addr-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.05px;
}
.pq-addr-pill.epc {
  padding-left: 6px;
}
.pq-epc-letter {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.pq-state-done {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: var(--pq-success);
}
.pq-addr-stats {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.pq-stat-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}
.pq-stat-count {
  font-weight: 800;
}
.pq-sep {
  opacity: 0.5;
}
.pq-pulse-dot {
  width: 7px;
  height: 7px;
  background: #fff;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
}
.pq-pulse-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  animation: pq-pulse 1.6s ease-out infinite;
}
.pq-pulse-green {
  background: #6bd4cd;
}
.pq-pulse-green::after {
  border-color: rgba(94, 234, 212, 0.5);
}
@keyframes pq-pulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Overpay hero (teal gradient) */
.pq-overpay-hero {
  margin: 12px 22px 0;
  padding: 22px 22px 20px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(
    140deg,
    var(--pq-teal-bright) 0%,
    var(--pq-teal) 50%,
    var(--pq-teal-deep) 100%
  );
  box-shadow:
    0 12px 32px -10px rgba(0, 161, 154, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.pq-overpay-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.16) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.pq-overpay-hero > * {
  position: relative;
  z-index: 1;
}
.pq-overpay-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 1.6px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.pq-overpay-eyebrow .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}
.pq-overpay-num {
  font-size: 44px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1.6px;
  line-height: 1;
  margin-bottom: 4px;
  font-feature-settings: 'tnum';
}
.pq-overpay-num .unit {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.78);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-left: 2px;
}
.pq-overpay-sub {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin-top: 6px;
}

/* Hero buttons (white primary, translucent ghost) */
.pq-hero-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  padding: 14px 18px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.1px;
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.15s,
    background 0.15s;
}
.pq-hero-btn--primary {
  background: #fff;
  border: none;
  color: var(--pq-teal-dark);
  margin-top: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
.pq-hero-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.18);
}
.pq-hero-btn--ghost {
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 13px 18px;
  margin-top: 10px;
}
.pq-hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.22);
}
.pq-hero-btn-emoji {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}
.pq-hero-btn-label {
  flex: 1;
  text-align: center;
}
.pq-hero-btn-arrow {
  width: 16px;
  height: 16px;
  opacity: 0.6;
  flex-shrink: 0;
  transition: transform 0.2s;
}
.pq-hero-btn--ghost .pq-hero-btn-arrow {
  opacity: 0.7;
}
.pq-hero-btn:hover .pq-hero-btn-arrow {
  transform: translateX(2px);
}

/* Refined score card */
.pq-score-card {
  margin: 14px 22px 0;
  background: #fff;
  border: 2px solid var(--pq-teal);
  border-radius: 20px;
  padding: 18px 20px 16px;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.08);
}
.pq-score-card.tone-high {
  background: linear-gradient(180deg, #f0fbf5 0%, white 60%);
  border-color: var(--pq-success);
}
.pq-score-card.tone-mid {
  background: linear-gradient(180deg, var(--pq-teal-paler) 0%, white 60%);
}
.pq-score-card.tone-low {
  background: linear-gradient(180deg, var(--pq-teal-paler) 0%, white 60%);
}
.pq-score-eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.pq-score-eyebrow .left {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
  color: var(--pq-teal-dark);
  text-transform: uppercase;
}
.pq-score-eyebrow .right {
  background: #e8f5ea;
  border: 1px solid #b8e8c8;
  color: var(--pq-success);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 999px;
  letter-spacing: -0.05px;
}
.pq-score-gauge-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}
.pq-gauge {
  position: relative;
  width: 110px;
  height: 110px;
  flex-shrink: 0;
}
.pq-gauge svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.pq-gauge .g-bg {
  stroke: var(--pq-line-soft);
}
.pq-gauge .g-fill {
  transition:
    stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    stroke 0.4s;
}
.pq-g-num {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.pq-g-num .gn-big {
  font-size: 32px;
  font-weight: 800;
  color: var(--pq-navy);
  line-height: 1;
  letter-spacing: -1px;
}
.pq-g-num .gn-small {
  font-size: 12px;
  color: var(--pq-text-faint);
  font-weight: 700;
}
.pq-score-summary {
  flex: 1;
  min-width: 0;
}
.pq-score-band {
  font-size: 16px;
  font-weight: 800;
  color: var(--pq-navy);
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}
.pq-score-explainer {
  font-size: 13px;
  color: var(--pq-text-soft);
  line-height: 1.5;
}
.pq-score-data-note {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-top: 12px;
  padding: 8px 10px;
  background: var(--pq-teal-paler);
  border: 1px solid var(--pq-teal-pale);
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  color: var(--pq-teal-dark);
  line-height: 1.45;
}
.pq-score-data-note svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Refined breakdown — amber-tinted cream card per prototype */
.pq-breakdown-card {
  margin: 12px 22px 0;
  padding: 18px;
  background: linear-gradient(180deg, rgba(251, 239, 217, 0.6) 0%, white 50%);
  border: 2px solid #e6a23c;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(230, 162, 60, 0.1);
  transition: all 0.18s;
}
.pq-breakdown-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(230, 162, 60, 0.16);
}
.pq-breakdown-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--pq-navy);
  letter-spacing: -0.2px;
  margin-bottom: 3px;
}
.pq-breakdown-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--pq-text-soft);
  line-height: 1.5;
  margin-bottom: 14px;
}
.pq-breakdown-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pq-breakdown-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pq-breakdown-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--pq-navy);
  width: 72px;
  flex-shrink: 0;
}
.pq-breakdown-bar-wrap {
  flex: 1;
  height: 7px;
  background: var(--pq-line-soft);
  border-radius: 100px;
  overflow: hidden;
}
.pq-breakdown-bar {
  height: 100%;
  border-radius: 100px;
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.pq-breakdown-value {
  font-size: 13px;
  font-weight: 800;
  width: 42px;
  text-align: right;
  flex-shrink: 0;
}

/* Next step / interest card — navy bordered with subtle gradient */
.pq-interest-card {
  margin: 12px 22px 0;
  padding: 18px;
  background:
    radial-gradient(
      circle at bottom right,
      rgba(35, 29, 69, 0.06) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, rgba(35, 29, 69, 0.05) 0%, white 70%);
  border: 2px solid var(--pq-navy);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(35, 29, 69, 0.1);
  transition: all 0.18s;
}
.pq-interest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(35, 29, 69, 0.16);
}
.pq-interest-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--pq-text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.pq-interest-opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pq-interest-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s;
}
.pq-interest-opt.primary {
  background: var(--pq-teal);
  border: none;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.3);
}
.pq-interest-opt.primary:hover {
  background: var(--pq-teal-bright);
  transform: translateY(-1px);
}
.pq-interest-opt.outline {
  background: #fff;
  border: 1.5px solid var(--pq-line);
  color: var(--pq-navy);
}
.pq-interest-opt.outline:hover {
  border-color: var(--pq-teal-pale);
  background: var(--pq-teal-paler);
}
.pq-interest-opt-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
}
.pq-interest-opt-icon svg {
  width: 14px;
  height: 14px;
}
.pq-interest-opt.outline .pq-interest-opt-icon {
  color: var(--pq-teal-dark);
}
.pq-interest-opt-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pq-interest-opt-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.1px;
}
.pq-interest-opt-sub {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  opacity: 0.85;
}
.pq-interest-opt.outline .pq-interest-opt-sub {
  color: var(--pq-text-soft);
  opacity: 1;
}
.pq-interest-opt-chev {
  font-size: 18px;
  flex-shrink: 0;
  opacity: 0.7;
}

/* Publish placeholder */
.pq-placeholder {
  margin: 22px 22px 0;
  background: #fff;
  border: 2px dashed var(--pq-teal-pale);
  border-radius: 16px;
  padding: 28px 22px;
  text-align: center;
}
.pq-placeholder-emoji {
  font-size: 40px;
  margin-bottom: 10px;
}
.pq-placeholder-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--pq-navy);
  margin-bottom: 8px;
}
.pq-placeholder-sub {
  font-size: 13px;
  color: var(--pq-text-soft);
  line-height: 1.5;
  margin-bottom: 16px;
}
.pq-placeholder-back {
  background: none;
  border: 1.5px solid var(--pq-line);
  border-radius: 10px;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: var(--pq-text-soft);
  cursor: pointer;
}
.pq-placeholder-back:hover {
  color: var(--pq-navy);
  border-color: var(--pq-teal-pale);
  background: var(--pq-teal-paler);
}

/* ──────────────────────────────────────────────────────────────
   PUBLISH — matches homescore-v2_13.html publish screen
   ────────────────────────────────────────────────────────────── */
.pub-root {
  --pub-navy: #231d45;
  --pub-teal: #00a19a;
  --pub-teal-bright: #00b6ae;
  --pub-teal-dark: #007e78;
  --pub-teal-deep: #00514d;
  --pub-teal-pale: #e5f4f2;
  --pub-teal-paler: #f2faf8;
  --pub-success: #2eab55;
  --pub-gold: #e6b41d;
  --pub-text-soft: #6b6783;
  --pub-text-faint: #9c98ad;
  --pub-line: #ececef;
  --pub-line-soft: #f5f5f7;
  --pub-bg: #fafafa;

  background: var(--pub-bg);
  min-height: 100dvh;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
  color: var(--pub-navy);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── Web layout (publish screen on desktop) ───────────────────────── */
.pub-root--web {
  max-width: none;
  min-height: auto;
  background: transparent;
  padding-bottom: 0;
  overflow: visible;
}
.pubw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.pubw-head {
  max-width: 720px;
  margin-bottom: 24px;
}
.pubw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--pub-teal-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.pubw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--pub-teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.pubw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(26px, 3.2vw, 38px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.02em;
}
.pubw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.pubw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.pubw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.pubw-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
/* Neutralise the cards' original 28rem-era side margins — spacing is now the
   flex gaps. Specificity (0,3,0) wins over each card's own margin rule. */
.pubw-layout .pubw-aside > *,
.pubw-layout .pubw-content > * {
  margin: 0;
}

@media (max-width: 980px) {
  .pubw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .pubw-aside {
    position: static;
  }
}

/* Amber address card */
.pub-addr-card {
  margin: 16px 22px 0;
  border-radius: 22px;
  padding: 22px 22px 18px;
  background: linear-gradient(135deg, #f0a030 0%, #c67c18 50%, #8b4e0a 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 32px -8px rgba(180, 100, 20, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.pub-addr-card::after {
  content: '';
  position: absolute;
  top: -45%;
  right: -15%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.pub-addr-card > * {
  position: relative;
  z-index: 1;
}
.pub-addr-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
}
.pub-addr-pin {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin-top: 6px;
}
.pub-addr-block {
  flex: 1;
  min-width: 0;
}
.pub-addr-line {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}
.pub-addr-meta {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}
.pub-addr-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.pub-addr-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}
/* Publish-specific: EPC pill uses white bg (not the translucent-on-amber
   variant used on the other screens) — matches the prototype behaviour. */
.pub-addr-pill.epc {
  padding-left: 6px;
  background: #fff;
  border-color: #fff;
  color: var(--pub-navy);
}
.pub-epc-letter {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.pub-state-done {
  background: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.94);
  color: var(--pub-success);
}

/* Top nav (back button + title) */
.pub-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.pub-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--pub-teal-paler);
  border: 1px solid var(--pub-teal-pale);
  color: var(--pub-teal);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: inherit;
}
.pub-back-btn svg {
  width: 14px;
  height: 14px;
}
.pub-topnav-centre {
  text-align: center;
}
.pub-topnav-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--pub-navy);
  letter-spacing: -0.2px;
}
.pub-topnav-sub {
  font-size: 12px;
  font-weight: 600;
  color: var(--pub-text-soft);
  margin-top: 1px;
}

/* Hero (teal gradient) */
.pub-hero {
  margin: 12px 22px 0;
  padding: 22px 22px 20px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(
    140deg,
    var(--pub-teal-bright) 0%,
    var(--pub-teal) 50%,
    var(--pub-teal-deep) 100%
  );
  box-shadow:
    0 12px 32px -10px rgba(0, 161, 154, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.pub-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.16) 0%,
    transparent 65%
  );
  pointer-events: none;
}
.pub-hero > * {
  position: relative;
  z-index: 1;
}
.pub-hero-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 1.6px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.pub-hero-eyebrow .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}
.pub-hero-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.4px;
  line-height: 1.2;
  margin: 6px 0 10px;
}
.pub-hero-sub {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* Contribution card */
.pub-contrib-card {
  margin: 12px 22px 0;
  background: #fff;
  border: 1.5px solid var(--pub-line);
  border-radius: 16px;
  padding: 16px 18px;
}
.pub-contrib-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--pub-text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.pub-contrib-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pub-contrib-row {
  display: flex;
  flex-direction: column;
}
.pub-contrib-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.pub-contrib-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: var(--pub-navy);
}
.pub-contrib-icon {
  font-size: 15px;
}
.pub-contrib-val {
  font-size: 15px;
  font-weight: 800;
  color: var(--pub-teal-dark);
  font-feature-settings: 'tnum';
}
.pub-contrib-bar {
  height: 6px;
  background: var(--pub-line-soft);
  border-radius: 100px;
  overflow: hidden;
}
.pub-contrib-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.pub-contrib-bar-fill.teal {
  background: var(--pub-teal);
}
.pub-contrib-bar-fill.success {
  background: var(--pub-success);
}
.pub-contrib-bar-fill.gold {
  background: var(--pub-gold);
}
.pub-contrib-note {
  font-size: 11px;
  color: var(--pub-text-faint);
  margin-top: 3px;
}

/* Anonymous notice */
.pub-anon {
  margin: 10px 22px 0;
  padding: 12px 14px;
  background: var(--pub-teal-paler);
  border: 1px solid var(--pub-teal-pale);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--pub-teal-dark);
  line-height: 1.5;
}
.pub-anon-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.pub-anon b {
  font-weight: 800;
}

/* Street impact card */
.pub-street-card {
  margin: 12px 22px 0;
  background: #fff;
  border: 1.5px solid var(--pub-line);
  border-radius: 16px;
  padding: 16px 18px;
}
.pub-street-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.pub-street-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--pub-text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.pub-street-count {
  font-size: 11px;
  font-weight: 800;
  color: var(--pub-teal-dark);
}
.pub-street-bar {
  height: 8px;
  background: var(--pub-line-soft);
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 8px;
}
.pub-street-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--pub-teal), var(--pub-teal-bright));
  border-radius: 100px;
  transition: width 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.pub-street-note {
  font-size: 12px;
  font-weight: 600;
  color: var(--pub-text-soft);
  margin-bottom: 12px;
  line-height: 1.5;
}
.pub-milestones {
  display: flex;
  gap: 6px;
}
.pub-milestone {
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  background: var(--pub-line-soft);
  border: 1.5px solid var(--pub-line);
  border-radius: 9px;
  opacity: 0.5;
  transition: all 0.3s;
}
.pub-milestone.active {
  background: var(--pub-teal-paler);
  border-color: var(--pub-teal);
  opacity: 1;
}
.pub-milestone-num {
  font-size: 15px;
  font-weight: 800;
  color: var(--pub-text-soft);
}
.pub-milestone.active .pub-milestone-num {
  color: var(--pub-teal-dark);
}
.pub-milestone-label {
  font-size: 8px;
  font-weight: 700;
  color: var(--pub-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.pub-milestone.active .pub-milestone-label {
  color: var(--pub-teal-dark);
}

/* Publish CTA */
.pub-cta {
  margin: 14px 22px 0;
}
.pub-cta-btn {
  width: 100%;
  padding: 16px;
  background: var(--pub-teal);
  color: #fff;
  border: none;
  border-radius: 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(0, 161, 154, 0.35);
  transition: background 0.15s;
}
.pub-cta-btn:hover {
  background: var(--pub-teal-bright);
}
.pub-cta-skip {
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--pub-text-soft);
  cursor: pointer;
  margin-top: 6px;
}
.pub-cta-skip:hover {
  color: var(--pub-navy);
}

/* KYC placeholder */
.pub-placeholder {
  margin: 22px 22px 0;
  background: #fff;
  border: 2px dashed var(--pub-teal-pale);
  border-radius: 16px;
  padding: 28px 22px;
  text-align: center;
}
.pub-placeholder-emoji {
  font-size: 40px;
  margin-bottom: 10px;
}
.pub-placeholder-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--pub-navy);
  margin-bottom: 8px;
}
.pub-placeholder-sub {
  font-size: 13px;
  color: var(--pub-text-soft);
  line-height: 1.5;
  margin-bottom: 16px;
}
.pub-placeholder-back {
  background: none;
  border: 1.5px solid var(--pub-line);
  border-radius: 10px;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: var(--pub-text-soft);
  cursor: pointer;
}
.pub-placeholder-back:hover {
  color: var(--pub-navy);
  border-color: var(--pub-teal-pale);
  background: var(--pub-teal-paler);
}

/* ──────────────────────────────────────────────────────────────
   KYC + KYC-PENDING + PUBLISHED — matches homescore-v2_13.html
   ────────────────────────────────────────────────────────────── */
.kyc-root {
  --kyc-navy: #231d45;
  --kyc-navy-soft: #4a4566;
  --kyc-teal: #00a19a;
  --kyc-teal-bright: #00b6ae;
  --kyc-teal-dark: #007e78;
  --kyc-teal-pale: #e5f4f2;
  --kyc-teal-paler: #f2faf8;
  --kyc-success: #2eab55;
  --kyc-text-soft: #6b6783;
  --kyc-text-faint: #9c98ad;
  --kyc-line: #ececef;
  --kyc-line-soft: #f5f5f7;
  --kyc-bg: #fafafa;

  background: var(--kyc-bg);
  min-height: 100dvh;
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
  color: var(--kyc-navy);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── Web layout (kyc screen on desktop) ───────────────────────────── */
.kyc-root--web {
  max-width: none;
  min-height: auto;
  background: transparent;
  padding-bottom: 0;
  overflow: visible;
}
.kycw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.kycw-head {
  max-width: 680px;
  margin-bottom: 24px;
}
.kycw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--kyc-teal-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.kycw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--kyc-teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.kycw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.kycw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.kycw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.kycw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.kycw-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
/* Neutralise the cards' original 28rem-era side margins — spacing is now the
   flex gaps. Specificity (0,3,0) wins over each card's own margin rule. */
.kycw-layout .kycw-aside > *,
.kycw-layout .kycw-content > * {
  margin: 0;
}

@media (max-width: 980px) {
  .kycw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .kycw-aside {
    position: static;
  }
}

/* Top nav */
.kyc-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.kyc-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--kyc-teal-paler);
  border: 1px solid var(--kyc-teal-pale);
  color: var(--kyc-teal);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: inherit;
}
.kyc-back-btn svg {
  width: 14px;
  height: 14px;
}
.kyc-topnav-centre {
  text-align: center;
}
.kyc-topnav-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--kyc-navy);
  letter-spacing: -0.2px;
}
.kyc-topnav-sub {
  font-size: 12px;
  font-weight: 600;
  color: var(--kyc-text-soft);
  margin-top: 1px;
}

/* 3-step progress */
.kyc-steps {
  margin: 16px 22px 0;
  display: flex;
  align-items: center;
}
.kyc-step {
  flex: 1;
  text-align: center;
}
.kyc-step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--kyc-line);
  color: var(--kyc-text-faint);
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 4px;
  transition:
    background 0.3s,
    color 0.3s;
}
.kyc-step.active .kyc-step-num {
  background: var(--kyc-teal);
  color: #fff;
}
.kyc-step.verified .kyc-step-num {
  background: var(--kyc-success);
  color: #fff;
  font-size: 14px;
}
.kyc-step-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--kyc-text-faint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.kyc-step.active .kyc-step-label {
  color: var(--kyc-teal-dark);
}
.kyc-step.verified .kyc-step-label {
  color: var(--kyc-success);
}
.kyc-step-line {
  flex: 1;
  height: 2px;
  background: var(--kyc-line);
  margin-bottom: 16px;
  transition: background 0.3s;
}
.kyc-step-line.filled {
  background: var(--kyc-teal);
}

/* Hero (navy gradient by default; success variant uses green) */
.kyc-hero {
  margin: 16px 22px 0;
  background: linear-gradient(135deg, var(--kyc-navy) 0%, #0d1a3a 100%);
  border-radius: 20px;
  padding: 24px 20px;
  text-align: center;
  color: #fff;
}
.kyc-hero--success {
  background: linear-gradient(135deg, var(--kyc-success) 0%, #1e8c40 100%);
  padding: 28px 20px;
}
.kyc-hero-emoji {
  font-size: 40px;
  margin-bottom: 12px;
}
.kyc-hero-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.4px;
  line-height: 1.2;
  margin-bottom: 8px;
}
.kyc-hero--success .kyc-hero-title {
  font-size: 20px;
}
.kyc-hero-sub {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.55;
}
.kyc-hero--success .kyc-hero-sub {
  color: rgba(255, 255, 255, 0.8);
}

/* Verification method choices */
.kyc-methods {
  margin: 14px 22px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kyc-method {
  background: #fff;
  border: 1.5px solid var(--kyc-line-soft);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.kyc-method:hover {
  border-color: var(--kyc-teal-pale);
  background: var(--kyc-teal-paler);
  transform: translateY(-1px);
}
.kyc-method-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.kyc-method-body {
  flex: 1;
}
.kyc-method-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--kyc-navy);
}
.kyc-method-sub {
  font-size: 12px;
  color: var(--kyc-text-soft);
  margin-top: 1px;
}
.kyc-method-chev {
  font-size: 18px;
  color: var(--kyc-line);
}

.kyc-privacy {
  margin: 14px 22px 0;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--kyc-text-faint);
  line-height: 1.5;
}

/* "Now unlocked for you" card (kyc-pending) */
.kyc-unlocked {
  margin: 12px 22px 0;
  background: #fff;
  border: 1.5px solid var(--kyc-line-soft);
  border-radius: 16px;
  padding: 16px 18px;
}
.kyc-unlocked-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--kyc-text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.kyc-unlocked-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kyc-unlocked-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--kyc-navy);
}
.kyc-unlocked-icon {
  font-size: 15px;
  flex-shrink: 0;
}

/* Bottom CTAs */
.kyc-ctas {
  margin: 14px 22px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kyc-cta-primary {
  width: 100%;
  padding: 15px;
  background: var(--kyc-teal);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 161, 154, 0.3);
  transition: background 0.15s;
}
.kyc-cta-primary:hover {
  background: var(--kyc-teal-bright);
}
.kyc-cta-outline {
  width: 100%;
  padding: 15px;
  background: #fff;
  border: 2px solid var(--kyc-teal);
  color: var(--kyc-teal-dark);
  border-radius: 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s;
}
.kyc-cta-outline:hover {
  background: var(--kyc-teal-paler);
}
.kyc-cta-skip {
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--kyc-text-soft);
  cursor: pointer;
  margin-top: 6px;
}
.kyc-cta-skip:hover {
  color: var(--kyc-navy);
}

/* Published success hero (big teal gradient) */
.kyc-success-hero {
  margin: 12px 22px 0;
  background: linear-gradient(
    135deg,
    var(--kyc-teal-bright) 0%,
    var(--kyc-teal) 60%,
    var(--kyc-teal-dark) 100%
  );
  border-radius: 20px;
  padding: 32px 22px;
  text-align: center;
  color: #fff;
  box-shadow: 0 12px 32px -10px rgba(0, 161, 154, 0.45);
}
.kyc-success-emoji {
  font-size: 52px;
  margin-bottom: 16px;
}
.kyc-success-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1.2;
  margin-bottom: 10px;
}
.kyc-success-sub {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* "What's now updated" card */
.kyc-updates-card {
  margin: 12px 22px 0;
  background: #fff;
  border: 1.5px solid var(--kyc-line-soft);
  border-radius: 16px;
  padding: 16px 18px;
}
.kyc-updates-eyebrow {
  font-size: 11px;
  font-weight: 800;
  color: var(--kyc-text-faint);
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.kyc-updates-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.kyc-updates-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--kyc-navy);
  line-height: 1.45;
}
.kyc-updates-row b {
  font-weight: 800;
}
.kyc-updates-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Street impact pill */
.kyc-street-impact {
  margin: 10px 22px 0;
  padding: 12px 14px;
  background: var(--kyc-teal-paler);
  border: 1px solid var(--kyc-teal-pale);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--kyc-teal-dark);
  line-height: 1.5;
}
.kyc-street-impact-icon {
  font-size: 20px;
  flex-shrink: 0;
}

/* Next step */
.kyc-next-step {
  margin: 14px 22px 0;
}
.kyc-next-step-eyebrow {
  font-size: 12px;
  font-weight: 800;
  color: var(--kyc-text-faint);
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 10px;
}

/* ──────────────────────────────────────────────────────────────
   QUICK-WINS BOOST-SCORE UPLOAD DRAWER — bottom sheet, matches the
   landlord passport upload UX (Teleport target = <body>).
   ────────────────────────────────────────────────────────────── */
.qw-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(20, 16, 45, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: qw-fade 0.2s ease;
}
@keyframes qw-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.qw-modal {
  width: 100%;
  max-width: 27rem;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 30px 70px rgba(20, 16, 45, 0.4);
  padding: 22px 24px 24px;
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  animation: qw-pop 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes qw-pop {
  from {
    transform: translateY(12px) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
/* Drag handle only makes sense as a bottom-sheet affordance — hidden on the
   centered modal. */
.qw-modal-handle {
  display: none;
}
.qw-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}
.qw-modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

/* On phones, drop to a bottom-sheet — nicer reach on touch. */
@media (max-width: 560px) {
  .qw-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .qw-modal {
    max-width: none;
    border-radius: 22px 22px 0 0;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
    animation: qw-slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .qw-modal-handle {
    display: block;
    width: 40px;
    height: 4px;
    background: #e7e5ee;
    border-radius: 100px;
    margin: 0 auto 14px;
  }
}
@keyframes qw-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.qw-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #f5f5f7;
  color: #6b6783;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-family: inherit;
}
.qw-modal-close:hover {
  background: #ececef;
}
.qw-modal-body {
  overflow-y: auto;
  margin-bottom: 14px;
}
.qw-modal-intro {
  font-size: 13.5px;
  color: #6b6783;
  line-height: 1.55;
  margin-bottom: 18px;
}

/* Doc preview row (existing saved file OR pending new file) */
.qw-doc-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #fafafa;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  margin-bottom: 12px;
}
.qw-doc-preview--pending {
  background: #f2faf8;
  border-color: #e5f4f2;
}
.qw-doc-preview-icon {
  font-size: 22px;
  flex-shrink: 0;
}
.qw-doc-preview-info {
  flex: 1;
  min-width: 0;
}
.qw-doc-preview-name {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qw-doc-preview-meta {
  font-size: 12px;
  color: #6b6783;
  margin-top: 2px;
}
.qw-doc-preview-btn {
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 8px;
  padding: 7px 11px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #6b6783;
  cursor: pointer;
  flex-shrink: 0;
}
.qw-doc-preview-btn:hover {
  color: #231d45;
  border-color: #c8c5e0;
}

/* File picker — centered dropzone */
.qw-upload-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 26px 20px;
  border: 2px dashed #bfe6e2;
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.16s, background 0.16s;
  background: rgba(0, 161, 154, 0.05);
}
.qw-upload-row:hover {
  border-color: #00a19a;
  background: rgba(0, 161, 154, 0.09);
}
.qw-upload-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.qw-upload-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  color: #00a19a;
  border: 1px solid #d3ede9;
  box-shadow: 0 6px 16px rgba(0, 161, 154, 0.14);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.qw-upload-icon svg {
  width: 20px;
  height: 20px;
}
.qw-upload-text {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.01em;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.qw-upload-text small {
  font-size: 12px;
  font-weight: 500;
  color: #8b8799;
}

.qw-modal-error {
  font-size: 13px;
  color: #c73e36;
  background: #fef2f2;
  border: 1px solid rgba(199, 62, 54, 0.2);
  border-radius: 9px;
  padding: 8px 11px;
  margin-top: 10px;
  font-weight: 600;
}

/* Footer with Cancel + Save */
.qw-modal-footer {
  display: flex;
  gap: 8px;
  padding-top: 6px;
}
.qw-btn-secondary,
.qw-btn-primary {
  flex: 1;
  padding: 14px;
  border-radius: 13px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: transform 0.14s, box-shadow 0.16s, background 0.16s, border-color 0.16s;
}
.qw-btn-secondary {
  background: #fff;
  border: 1.5px solid #ececf2;
  color: #5a5570;
}
.qw-btn-secondary:hover {
  color: #231d45;
  border-color: #c8c5e0;
}
.qw-btn-primary {
  background: linear-gradient(135deg, #00a19a, #00857f);
  border: none;
  color: #fff;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.32);
}
.qw-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 26px rgba(0, 161, 154, 0.42);
}
.qw-btn-primary:disabled {
  background: #eceef3;
  color: #a8a5b8;
  box-shadow: none;
  cursor: not-allowed;
}

/* ──────────────────────────────────────────────────────────────
   BOOST YOUR SCORE — matches homescore-v2_13.html `boost` screen
   ────────────────────────────────────────────────────────────── */
.boost-root {
  --b-navy: #231d45;
  --b-teal: #00a19a;
  --b-teal-bright: #00b6ae;
  --b-teal-dark: #007e78;
  --b-teal-pale: #e5f4f2;
  --b-teal-paler: #f2faf8;
  --b-amber: #e6a23c;
  --b-success: #2eab55;
  --b-text-soft: #6b6783;
  --b-text-faint: #9c98ad;
  --b-line: #ececef;
  --b-line-soft: #f5f5f7;
  --b-bg: #f2f4f7;

  min-height: 100dvh;
  background: var(--b-bg);
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 24px;
  color: var(--b-navy);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ── Web layout (boost / quick-wins screen on desktop) ────────────── */
.boost-root--web {
  max-width: none;
  min-height: auto;
  background: transparent;
  padding-bottom: 0;
  overflow: visible;
}
.boostw-main {
  position: relative;
  z-index: 2;
  padding: 30px 0 60px;
}
.boostw-head {
  max-width: 680px;
  margin-bottom: 24px;
}
.boostw-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: var(--b-teal-dark);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.boostw-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--b-teal);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}
.boostw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.boostw-lede {
  margin: 14px 0 0;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 600;
}
.boostw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  align-items: start;
  gap: 28px;
}
.boostw-aside {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.boostw-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.boostw-layout .boostw-aside > *,
.boostw-layout .boostw-content > * {
  margin: 0;
}

@media (max-width: 980px) {
  .boostw-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .boostw-aside {
    position: static;
  }
}

/* Top nav */
.boost-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px;
  padding-top: calc(14px + env(safe-area-inset-top));
}
.boost-back-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--b-teal-paler);
  border: 1px solid var(--b-teal-pale);
  color: var(--b-teal);
  display: grid;
  place-items: center;
  cursor: pointer;
  font-family: inherit;
}
.boost-back-btn svg {
  width: 14px;
  height: 14px;
}
.boost-topnav-centre {
  text-align: center;
}
.boost-topnav-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--b-navy);
  letter-spacing: -0.2px;
}
.boost-topnav-sub {
  font-size: 12px;
  font-weight: 600;
  color: var(--b-text-soft);
  margin-top: 1px;
}

/* Property Journey card */
.boost-journey-card {
  margin: 12px 16px 0;
  background: #fff;
  border-radius: 18px;
  padding: 18px 18px 16px;
  border: 2px solid var(--b-teal-pale);
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.08);
}
.boost-journey-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.boost-journey-eyebrow {
  font-size: 11px;
  font-weight: 700;
  color: var(--b-text-faint);
  letter-spacing: 1px;
}
.boost-journey-right {
  font-size: 12px;
  font-weight: 700;
  color: var(--b-teal-dark);
}
.boost-journey-stats {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}
.boost-stat {
  flex: 1;
  text-align: center;
}
.boost-stat-num {
  font-size: 30px;
  font-weight: 800;
  color: var(--b-text-soft);
  letter-spacing: -0.8px;
  line-height: 1;
  margin-bottom: 4px;
  font-feature-settings: 'tnum';
}
.boost-stat-num.amber {
  color: var(--b-amber);
}
.boost-stat-num.muted {
  color: var(--b-text-faint);
}
.boost-stat-label {
  font-size: 8px;
  font-weight: 800;
  color: var(--b-text-faint);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.boost-stat-sub {
  font-size: 11px;
  font-weight: 500;
  color: var(--b-text-soft);
}
.boost-stat-div {
  width: 1px;
  height: 48px;
  background: var(--b-line);
  flex-shrink: 0;
}
.boost-progress-bar {
  height: 6px;
  background: var(--b-line);
  border-radius: 100px;
  overflow: hidden;
}
.boost-progress-fill {
  height: 100%;
  background: var(--b-teal);
  border-radius: 100px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Section labels */
.boost-section-label {
  padding: 18px 16px 8px;
  font-size: 11px;
  font-weight: 800;
  color: var(--b-text-soft);
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

/* Card rows */
.boost-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}
.boost-doc-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 14px 16px;
  border: 2px solid var(--b-teal-pale);
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(0, 161, 154, 0.06);
}
.boost-doc-card:hover {
  border-color: var(--b-teal);
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.12);
}
.boost-doc-card.uploaded {
  background: linear-gradient(135deg, #f0fbf4 0%, #fff 60%);
  border-color: #b8e8c8;
}
.boost-doc-card--unlocking {
  animation: boost-unlock 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes boost-unlock {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.boost-doc-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  overflow: hidden;
}
.boost-doc-icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.boost-doc-body {
  flex: 1;
  min-width: 0;
}
.boost-doc-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--b-navy);
  letter-spacing: -0.1px;
  margin-bottom: 3px;
}
.boost-doc-sub {
  font-size: 13px;
  font-weight: 500;
  color: var(--b-text-soft);
  line-height: 1.4;
}
.boost-pts {
  font-size: 12px;
  font-weight: 800;
  color: var(--b-success);
  background: #f0fbf4;
  border: 1.5px solid #b8e8c8;
  padding: 5px 10px;
  border-radius: 100px;
  flex-shrink: 0;
  white-space: nowrap;
}
.boost-add-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--b-teal);
  color: #fff;
  border: none;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0, 161, 154, 0.3);
  line-height: 1;
  transition: all 0.15s;
  font-family: inherit;
}
.boost-add-btn:hover {
  background: var(--b-teal-bright);
  transform: scale(1.1);
}
.boost-chev {
  font-size: 18px;
  color: var(--b-line);
  flex-shrink: 0;
}

/* "Now make it count" CTA */
.pj-cta-card {
  margin: 16px 16px 0;
  background: linear-gradient(135deg, var(--b-navy) 0%, #1a1640 100%);
  border-radius: 20px;
  padding: 22px 20px 20px;
  box-shadow: 0 8px 28px rgba(35, 29, 69, 0.3);
}
.pj-cta-eyebrow {
  font-size: 9px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.pj-cta-title {
  font-size: 20px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.4px;
  line-height: 1.2;
  margin-bottom: 10px;
}
.pj-cta-sub {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 16px;
}
.pj-cta-btn {
  width: 100%;
  padding: 15px;
  background: var(--b-teal);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  letter-spacing: -0.1px;
  transition: background 0.15s;
}
.pj-cta-btn:hover {
  background: var(--b-teal-bright);
}

/* Back link at the bottom */
.boost-back-link {
  display: block;
  margin: 14px auto 0;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: var(--b-text-soft);
  padding: 8px 14px;
  cursor: pointer;
}
.boost-back-link:hover {
  color: var(--b-navy);
}
</style>
