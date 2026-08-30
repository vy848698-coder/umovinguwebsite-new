<template>
  <div class="ppv-root">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
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
          <button
            class="hsw-tour"
            type="button"
            title="Take a quick tour"
            aria-label="Take a quick tour"
            @click="passportTourRef?.start?.()"
          >
            ?
          </button>
          <button class="hsw-back" type="button" @click="navigateTo('/passport')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            All passports
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell ppv-main">
      <!-- Page head — kicker + title + lede, role switch on the right -->
      <div class="ppv-head">
        <div class="ppv-head-text">
          <p class="ppv-kicker">Property Passport</p>
          <h1>Your Passport</h1>
          <p class="ppv-lede">
            Manage, publish and share your property information —
            every answer ready before anyone asks.
          </p>
        </div>
        <div class="ppv-role-switch">
          <SegmentedSwitch
            v-model="selectedRole"
            :options="roleOptions"
            @update:modelValue="onRoleSwitch"
          />
        </div>
      </div>

    <div class="passport-content">
      <!-- ── Passport hero — book · details · progress ── -->
      <div class="pp-hero">
        <div class="pp-hero-book">
          <PassportCard
            :line1="passportAddress.line1"
            :line2="passportAddress.line2"
            :type="passportType"
          />
        </div>

        <div class="pp-hero-main">
          <div class="pp-hero-eyebrow">Property Passport · Live Record</div>
          <div class="pp-hero-addr-row">
            <div class="pp-hero-addr-text">
              <div class="pp-hero-addr-l1">{{ passportAddress.line1 }}</div>
              <div class="pp-hero-addr-l2">{{ heroSubline }}</div>
            </div>
            <button
              class="pp-hero-switch"
              aria-label="Switch property"
              title="Switch property"
              @click="showPropertiesModal = true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div class="pp-hero-stats">
            <div class="pp-hero-stat">
              <div class="pp-hero-stat-val">{{ heroHsScore }}</div>
              <div class="pp-hero-stat-lbl">Points</div>
            </div>
            <div class="pp-hero-stat">
              <div class="pp-hero-stat-val">{{ heroDocsCount }}</div>
              <div class="pp-hero-stat-lbl">Documents</div>
            </div>
            <div class="pp-hero-stat">
              <div class="pp-hero-stat-val">{{ heroSectionsLabel }}</div>
              <div class="pp-hero-stat-lbl">Sections</div>
            </div>
          </div>

          <div class="pp-hero-actions">
            <button
              class="pp-hero-btn pp-hero-btn--primary"
              :class="{ 'is-loading': publishLoading }"
              :disabled="publishLoading"
              @click="onPublishClick"
            >
              <OPIcon name="publishPassport" class="pp-hero-btn-ic" />
              {{ publishButtonLabel }}
            </button>
            <button
              class="pp-hero-btn pp-hero-btn--ghost"
              @click="setTab('buyers')"
            >
              <OPIcon name="matchToBuyers" class="pp-hero-btn-ic" />
              Match to buyers
              <span v-if="matchedBuyers.length" class="pp-hero-btn-badge">{{
                matchedBuyers.length
              }}</span>
            </button>
          </div>
        </div>

        <div class="pp-hero-side">
          <div class="pp-hero-ring">
            <svg viewBox="0 0 72 72" class="pp-hero-ring-svg">
              <defs>
                <linearGradient id="ppRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#2fd0c6" />
                  <stop offset="100%" stop-color="#00a19a" />
                </linearGradient>
              </defs>
              <circle cx="36" cy="36" r="30" class="pp-hero-ring-track" />
              <circle
                cx="36"
                cy="36"
                r="30"
                class="pp-hero-ring-fill"
                stroke-dasharray="188.5"
                :stroke-dashoffset="188.5 - (188.5 * safeProgress) / 100"
              />
            </svg>
            <div class="pp-hero-ring-center">
              <span class="pp-hero-ring-pct">{{ overallProgress }}%</span>
            </div>
          </div>
          <div class="pp-hero-side-label">Passport Progress</div>
          <div v-if="isPublished" class="pp-hero-issued">
            <span class="pp-hero-issued-dot" />
            Passport issued
          </div>
          <div v-else class="pp-hero-issued pp-hero-issued--draft">
            <span class="pp-hero-issued-dot" />
            Draft
          </div>
        </div>
      </div>

      <!-- ── Publish-readiness band ──────────────────────────────────
           Deliberately separate from the completion ring in the hero:
           that ring tracks the whole passport, this tracks only the
           disclosures a buyer pays to unlock, so it can reach 100% well
           before the passport itself is fully filled in. ── -->
      <button
        v-if="readiness && !readiness.canPublish"
        type="button"
        class="pp-ready"
        @click="openReadinessChecklist"
      >
        <span class="pp-ready-ic"><Icon name="i-lucide-rocket" /></span>
        <span class="pp-ready-body">
          <span class="pp-ready-head">
            <span class="pp-ready-label">Ready to publish</span>
            <span class="pp-ready-pct">{{ readiness.readinessPct }}%</span>
          </span>
          <span class="pp-ready-bar">
            <span
              class="pp-ready-fill"
              :style="{ width: readiness.readinessPct + '%' }"
            />
          </span>
          <span class="pp-ready-note">
            {{ readiness.missingBlockers.length }}
            required
            {{ readiness.missingBlockers.length === 1 ? 'question' : 'questions' }}
            left before you can publish — click to see them
          </span>
        </span>
        <span class="pp-ready-chev">
          <Icon name="i-lucide-chevron-right" />
        </span>
      </button>

      <!-- ── Collaborators row ── -->
      <div class="pp-collab-row" @click="openCollaboratorModal">
        <button class="pp-collab-add" type="button" aria-label="Add collaborator">
          +
        </button>
        <div v-if="displayCollaborators.length" class="pp-collab-stack">
          <div
            v-for="collaborator in displayCollaborators"
            :key="collaborator.id"
            class="pp-collab-avatar"
          >
            {{ getInitials(collaborator.firstName, collaborator.lastName) }}
          </div>
        </div>
        <div class="pp-collab-body">
          <div class="pp-collab-title">
            {{ collaborators.length }}
            {{ collaborators.length === 1 ? 'collaborator' : 'collaborators' }}
          </div>
          <div class="pp-collab-sub">
            Invite your solicitor, agent or co-owner — control exactly who sees
            what.
          </div>
        </div>
        <span class="pp-collab-arrow">→</span>
      </div>

      <!-- ── Tabs row: sections/street/buyers + list/map ── -->
      <div class="pp-tabs-row">
      <div class="pp-subtabs">
        <button
          :class="['pp-subtab', activeTab === 'sections' ? 'active' : '']"
          @click="setTab('sections')"
        >
          <OPIcon name="tabSections" class="pp-subtab-ic" />
          Sections
        </button>
        <button
          :class="['pp-subtab', activeTab === 'street' ? 'active' : '']"
          @click="setTab('street')"
        >
          <OPIcon name="tabStreet" class="pp-subtab-ic" />
          Street
        </button>
        <button
          :class="['pp-subtab', activeTab === 'buyers' ? 'active' : '']"
          @click="setTab('buyers')"
        >
          <OPIcon name="tabBuyers" class="pp-subtab-ic" />
          Buyers
          <span v-if="matchedBuyers.length" class="pp-subtab-badge">{{
            matchedBuyers.length
          }}</span>
        </button>
        <button
          :class="['pp-subtab', activeTab === 'vault' ? 'active' : '']"
          @click="setTab('vault')"
        >
          <OPIcon name="tabVault" class="pp-subtab-ic" />
          Vault
          <span v-if="vaultStoredCount" class="pp-subtab-badge">{{ vaultStoredCount }}</span>
        </button>
        <button
          :class="['pp-subtab', activeTab === 'timeline' ? 'active' : '']"
          @click="setTab('timeline')"
        >
          <OPIcon name="tabTimeline" class="pp-subtab-ic" />
          Timeline
          <span v-if="timelineCount" class="pp-subtab-badge">{{ timelineCount }}</span>
        </button>
      </div>

        <div v-if="activeTab === 'sections'" class="view-toggle">
          <SegmentedSwitch v-model="viewMode" :options="viewOptions" />
        </div>
      </div>

      <!-- Sections tab -->
      <div v-if="activeTab === 'sections'">
        <!-- Pick up where you left off — works for both list and map view -->
        <button
          v-if="resumeTarget"
          class="pp-resume-cta"
          @click="goToResume"
        >
          <span class="pp-resume-ic"
            ><OPIcon name="resumeLeftOff" class="pp-resume-ic-img"
          /></span>
          <span class="pp-resume-text">
            <span class="pp-resume-title">Pick up where you left off</span>
            <span class="pp-resume-sub">{{ resumeSubtitle }}</span>
          </span>
          <span class="pp-resume-continue">Continue →</span>
        </button>

        <!-- Section list header -->
        <div v-if="viewMode === 'list'" class="pp-sec-header">
          <div class="pp-sec-head-text">
            <div class="pp-sec-kicker">
              {{ steps.length }} Verified Sections
            </div>
            <h2 class="pp-sec-title">Build your record, section by section</h2>
          </div>
          <span class="pp-sec-complete">
            {{ completeSectionCount }} of {{ steps.length }} complete
          </span>
        </div>

        <div v-if="viewMode === 'list'" class="steps-list">
          <div
            v-for="step in steps"
            :key="step.id"
            class="step-card"
            :class="{ 'step-card--done': step.progress >= 100 }"
            @click="navigateToStep(step.id)"
          >
            <div class="step-card-top">
              <div class="step-icon-container">
                <div class="step-icon-bg">
                  <OPIcon :name="step.key" class="w-[38px] h-[38px]" />
                </div>
              </div>
              <button class="step-arrow">
                <OPIcon name="caretRight" class="w-[13px] h-[13px]" />
              </button>
            </div>
            <div class="step-info">
              <h3 class="step-title">{{ toSmartTitleCase(step.title) }}</h3>
              <p class="step-points">
                {{ getStepPoints(step) }} points earned so far
              </p>
              <div class="step-counts">
                <span class="step-count-pill step-count-docs">
                  <Icon name="i-lucide-paperclip" />
                  {{ getStepDocs(step).done }}/{{ getStepDocs(step).total }}
                  docs
                </span>
                <span class="step-count-pill step-count-q">
                  <Icon name="i-lucide-circle-help" />
                  {{ getStepQuestions(step).done }}/{{
                    getStepQuestions(step).total
                  }}
                  questions
                </span>
              </div>
              <div
                v-if="getStepExpiringDoc(step)"
                class="step-expiry"
                @click.stop="navigateToStep(step.id)"
              >
                <Icon name="i-lucide-triangle-alert" />
                {{ getStepExpiringDoc(step).label }}
              </div>
              <div class="step-progress">
                <div class="progress-bar small">
                  <div
                    class="progress-fill"
                    :style="{ width: step.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-percentage">{{ step.progress }}%</span>
              </div>
            </div>
          </div>
        </div>

        <PassportMapView v-else />
      </div>

      <!-- Street tab -->
      <div v-if="activeTab === 'street'" class="pp-tab-content">
        <p class="pp-vm-header">
          See who else on your street has started a Property Passport.
        </p>

        <div v-if="streetProperties.length" class="pp-street-list">
          <div
            v-for="sp in streetProperties"
            :key="sp.id"
            class="pp-street-row"
            :class="{
              'is-published': sp.isPublished,
              'is-started': !sp.isPublished && sp.hasPassport,
              'is-none': !sp.isPublished && !sp.hasPassport,
            }"
            @click="navigateToProperty(sp.id)"
          >
            <div class="pp-street-icon"><img src="/passport-seller-and-buyer-icon/house-person.png" alt="" loading="lazy" /></div>
            <div class="pp-street-body">
              <div class="pp-street-addr">{{ sp.addressLine1 }}</div>
              <div class="pp-street-meta">
                <span v-if="sp.propertyType" class="pp-street-type">{{
                  sp.propertyType
                }}</span>
                <span
                  v-if="sp.epcRating"
                  class="pp-street-epc"
                  :style="{ background: epcColor(sp.epcRating) }"
                  >EPC {{ sp.epcRating }}</span
                >
              </div>
            </div>
            <span v-if="sp.isPublished" class="pp-street-badge published"
              ><span class="pp-street-dot" />Published</span
            >
            <span v-else-if="sp.hasPassport" class="pp-street-badge started"
              ><span class="pp-street-dot" />In progress</span
            >
            <span v-else class="pp-street-badge none"
              ><span class="pp-street-dot" />Not started</span
            >
            <svg
              class="pp-street-chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
        <div v-else class="pp-empty">
          <div style="font-size: 32px; margin-bottom: 8px">🏘</div>
          <p>No other properties found on this street yet.</p>
        </div>

        <div v-if="streetStats" class="pp-street-stats">
          <div class="pp-stats-head">
            <span class="pp-stats-pin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s-7-5.686-7-11a7 7 0 0 1 14 0c0 5.314-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
            </span>
            <div>
              <div class="pp-stats-title">Street Overview</div>
              <div class="pp-stats-sub">{{ passportAddress.line2 }}</div>
            </div>
          </div>
          <div class="pp-stats-grid">
            <div class="pp-stat brand">
              <div class="pp-stat-val">{{ streetStats.published }}</div>
              <div class="pp-stat-lbl">Passports published</div>
            </div>
            <div class="pp-stat green">
              <div class="pp-stat-val">{{ streetStats.notStarted }}</div>
              <div class="pp-stat-lbl">Not yet started</div>
            </div>
            <div v-if="streetStats.avgEpc" class="pp-stat amber">
              <div class="pp-stat-val">{{ streetStats.avgEpc }}</div>
              <div class="pp-stat-lbl">Average EPC rating</div>
            </div>
            <div v-if="streetStats.avgPrice" class="pp-stat grey">
              <div class="pp-stat-val">
                £{{ Math.round(streetStats.avgPrice / 1000) }}k
              </div>
              <div class="pp-stat-lbl">Avg. estimated value</div>
            </div>
          </div>
          <div class="pp-street-tip">
            <span class="pp-street-tip-ic"><Icon name="i-lucide-lightbulb" /></span>
            <span
              ><strong>You're ahead of your street.</strong> Sellers with a
              passport typically accept offers
              <strong>18 days faster</strong>.</span
            >
          </div>
        </div>
        <div style="height: 80px" />
      </div>

      <!-- Buyers tab -->
      <div v-if="activeTab === 'buyers'" class="pp-tab-content">
        <!-- Hero -->
        <div class="pp-buyers-head">
          <div class="pp-buyers-head-text">
            <div class="pp-buyers-eyebrow">
              <span class="pp-buyers-eyebrow-ic">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.8 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z" /></svg>
              </span>
              MATCHED BUYERS
            </div>
            <h2 class="pp-buyers-title">Buyers are already waiting for this home.</h2>
            <p class="pp-buyers-lede">
              As your Passport fills out, we match it to verified buyers. Reach
              out privately and gauge interest first — then publish when you're
              ready to go public.
            </p>
          </div>
          <img
            src="/passport-seller-and-buyer-icon/house-person.png"
            alt=""
            class="pp-buyers-illustration"
            loading="lazy"
          />
        </div>

        <!-- Hint -->
        <div class="pp-buyers-hint">
          <span class="pp-buyers-hint-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
            </svg>
          </span>
          <span><b>Tap any buyer</b> to see how well they match your property.</span>
        </div>

        <div v-if="matchedBuyers.length" class="pp-buyer-list">
          <div
            v-for="buyer in matchedBuyers"
            :key="buyer.name"
            class="pp-buyer-card"
            role="button"
            tabindex="0"
            @click="onBuyerSelect(buyer)"
            @keydown.enter="onBuyerSelect(buyer)"
            @keydown.space.prevent="onBuyerSelect(buyer)"
          >
            <div class="pp-buyer-avatar">{{ buyerInitial(buyer.name) }}</div>
            <div class="pp-buyer-info">
              <div class="pp-buyer-name">{{ buyer.name }}</div>
              <div class="pp-buyer-criteria">
                {{ buyer.area }} · {{ buyer.budget }} · {{ buyer.timeline }}
              </div>
              <span class="pp-buyer-pill" :class="matchPillClass(buyer.matchScore)">
                {{ matchLabel(buyer.matchScore) }}
                <svg v-if="buyer.matchScore >= 55" viewBox="0 0 24 24" fill="currentColor" class="pp-buyer-star">
                  <path d="M12 2l2.9 6.6 7.1.6-5.4 4.8 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6z" />
                </svg>
              </span>
            </div>
            <div class="pp-buyer-gauge">
              <svg viewBox="0 0 80 80">
                <circle class="pp-mg-track" cx="40" cy="40" r="32" stroke-width="6" fill="none" />
                <circle
                  class="pp-mg-fill"
                  cx="40" cy="40" r="32"
                  :stroke="matchStrokeColor(buyer.matchScore)"
                  stroke-width="6" fill="none"
                  stroke-dasharray="201.06"
                  :stroke-dashoffset="201.06 - (buyer.matchScore / 100) * 201.06"
                  stroke-linecap="round" transform="rotate(-90 40 40)"
                />
              </svg>
              <div class="pp-buyer-gauge-num">{{ buyer.matchScore }}<small>%</small></div>
            </div>
            <svg class="pp-buyer-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
        <div v-else class="pp-empty">
          <div class="pp-empty-ic"><Icon name="i-lucide-users" /></div>
          <p>
            {{
              propertyId
                ? 'Loading matched buyers…'
                : 'Property not linked — no buyer data available.'
            }}
          </p>
        </div>
        <div style="height: 80px" />
      </div>

      <!-- Vault tab — verified documents + per-section visibility -->
      <div v-if="activeTab === 'vault'" class="pp-tab-content">
        <div v-if="vaultLoading" class="pp-empty">
          <div class="pp-empty-ic"><Icon name="i-lucide-archive" /></div>
          <p>Loading your vault…</p>
        </div>

        <template v-else-if="vaultSections.length === 0">
          <div class="pp-empty">
            <div class="pp-empty-ic"><Icon name="i-lucide-archive" /></div>
            <p>Your vault is empty</p>
            <p style="font-size: 11.5px; margin-top: 6px; color: #94a3b8">
              As you complete sections, the verified documents are stored here —
              and you choose which are private and which publish with your
              passport.
            </p>
          </div>
        </template>

        <template v-else>
          <div class="vault-legend">
            <div class="vault-legend-t">Private or public?</div>
            <div class="vault-legend-row">
              <span class="vault-legend-ico private"><img src="/passport-seller-and-buyer-icon/padlock.png" alt="" loading="lazy" /></span>
              <div>
                <b>Private</b> — only you. Kept out of the passport when you
                publish — for personal documents you're not required to
                disclose.
              </div>
            </div>
            <div class="vault-legend-row">
              <span class="vault-legend-ico public"><img src="/passport-seller-and-buyer-icon/globe.png" alt="" loading="lazy" /></span>
              <div>
                <b>Public</b> — published with your passport. Visible to
                everyone once you publish (it doesn't go to anyone before
                then).
              </div>
            </div>
          </div>

          <div class="vault-count">
            {{ vaultStoredCount }} section{{ vaultStoredCount === 1 ? '' : 's' }} stored
          </div>

          <div
            v-for="s in completedVaultSections"
            :key="s.id"
            class="vault-row"
            :class="(s.visibility || 'PUBLIC').toLowerCase()"
          >
            <div class="vault-ico">{{ sectionIcon(s.key, s.imageKey) }}</div>
            <div class="vault-info">
              <div class="vault-name">{{ s.title }}</div>
              <div class="vault-vis-meta">
                {{
                  s.visibility === 'PRIVATE'
                    ? 'Verified · Private — only you. Not included when you publish.'
                    : 'Verified · Public — published with your passport when you go live.'
                }}
              </div>
            </div>
            <div class="vis-seg">
              <span
                class="vis-opt private"
                :class="{ on: s.visibility === 'PRIVATE' }"
                @click="setVisibility(s, 'PRIVATE')"
              ><Icon name="i-lucide-lock" /> Private</span>
              <span
                class="vis-opt public"
                :class="{ on: s.visibility !== 'PRIVATE' }"
                @click="setVisibility(s, 'PUBLIC')"
              ><Icon name="i-lucide-globe" /> Public</span>
            </div>
          </div>
        </template>
        <div style="height: 80px" />
      </div>

      <!-- Timeline tab — immutable activity ledger -->
      <div v-if="activeTab === 'timeline'" class="pp-tab-content">
        <div class="tl-intro">
          <span class="lockico">🔐</span>
          <div>
            An <b>immutable, time-stamped record</b> of every step — so
            everyone in the chain can see exactly where the sale is, and trust
            nothing has been altered.
          </div>
        </div>

        <div v-if="timelineLoading" class="pp-empty">
          <div class="pp-empty-ic"><Icon name="i-lucide-link" /></div>
          <p>Loading timeline…</p>
        </div>

        <template v-else>
          <div class="tl-stage">
            <div class="tl-stage-h">Where this sale is</div>
            <div class="tl-steps">
              <div
                v-for="(stage, i) in timelineStages"
                :key="stage"
                class="tl-step"
                :class="i < timelineStageIdx ? 'done' : (i === timelineStageIdx ? 'now' : 'todo')"
              >
                <div class="tl-dot">{{ i < timelineStageIdx ? '✓' : '' }}</div>
                <div class="tl-step-lbl">{{ stage }}</div>
              </div>
            </div>
          </div>

          <div class="tl-list-h">Verified activity</div>
          <div v-if="timelineEvents.length === 0" class="pp-empty" style="margin: 0 18px">
            No activity yet — events will appear here as your Passport progresses.
          </div>
          <div v-for="e in timelineEvents" :key="e.id" class="tl-item">
            <div class="tl-rail">
              <div class="tl-rail-dot">{{ e.icon || '📕' }}</div>
              <div class="tl-rail-line" />
            </div>
            <div class="tl-card">
              <div class="tl-card-top">
                <div class="tl-title">{{ e.title }}</div>
                <div class="tl-time">{{ formatStamp(e.createdAt) }}</div>
              </div>
              <div class="tl-who">{{ e.actor }}</div>
              <div class="tl-stamp">
                <span class="tl-stamp-lock"><Icon name="i-lucide-lock" /></span>
                <span class="tl-stamp-txt">{{ e.hash }}</span>
                <span class="tl-stamp-verif">block-stamped</span>
              </div>
            </div>
          </div>
        </template>
        <div style="height: 80px" />
      </div>
    </div>
    </main>

    <SiteFooter />

    <!-- Add Collaborator Modal -->
    <AddCollaboratorModal
      v-model:show="showCollaboratorModal"
      :passport-id="route.params.id"
      @added="handleCollaboratorAdded"
      @removed="handleCollaboratorRemoved"
    />

    <!-- Your Properties Modal -->
    <YourPropertiesModal
      :show="showPropertiesModal"
      :current-id="route.params.id"
      @close="showPropertiesModal = false"
      @select="switchPassport"
    />

    <Toast
      v-if="toastState.isVisible"
      :message="toastState.message"
      :icon-emoji="toastState.iconEmoji"
      @close="hideToast"
    />

    <!-- Buyer detail → buyer action. Two-step by design: the detail drawer
         only emits `action`, we close it and open the action drawer for the
         chosen kind, so one sheet is on screen at a time. -->
    <BuyerDetailDrawer
      :buyer="selectedBuyer"
      @close="selectedBuyer = null"
      @action="onBuyerAction"
    />
    <BuyerActionDrawer
      :kind="buyerActionKind"
      :buyer="buyerActionTarget"
      :property-id="propertyId"
      :passport-id="route.params.id"
      @close="buyerActionKind = null"
      @done="onBuyerActionDone"
    />

    <!-- Publish confirmation + readiness checklist -->
    <PublishPassportDrawer
      :open="publishDrawerOpen"
      :submitting="publishLoading"
      :readiness="readiness"
      @close="publishDrawerOpen = false"
      @publish="onPublishConfirm"
      @go-to-question="onGoToChecklistItem"
    />

    <!-- Guided tour — auto-runs once, replays from the "?" in the nav -->
    <OnboardingTour
      ref="passportTourRef"
      :steps="passportTourSteps"
      storage-key="umu_tour_passportview_v1"
    />

  </div>
</template>

<script setup>
// import { usePassportSteps } from '~/composables/usePassportSteps'
import PassportMapView from '@/components/passport-view/PassportMapView.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import PassportCard from '@/components/passport-view/PassportCard.vue'
import OPIcon from '~/components/ui/OPIcon.vue'
import SegmentedSwitch from '@/components/core/SegmentedSwitch.vue'
import AddCollaboratorModal from '@/components/modals/AddCollaboratorModal.vue'
import YourPropertiesModal from '@/components/modals/YourPropertiesModal.vue'
import OnboardingTour from '~/components/ui/OnboardingTour.vue'
import PublishPassportDrawer from '~/components/passport/PublishPassportDrawer.vue'
import BuyerDetailDrawer from '~/components/passport/BuyerDetailDrawer.vue'
import BuyerActionDrawer from '~/components/passport/BuyerActionDrawer.vue'
import Toast from '~/components/ui/Toast.vue'
import { useAppToast } from '~/composables/useCustomToast'
import { toSmartTitleCase } from '~/utils/titleCase'

// Guided tour — auto-runs once per browser, replays from the "?" button.
const passportTourRef = ref(null)
const passportTourSteps = [
  {
    selector: '.pp-hero',
    title: 'Your Property Passport',
    body: 'This card shows your address, the live HomeScore, document count and overall progress at a glance.',
  },
  {
    selector: '.pp-resume-cta',
    title: 'Pick up where you left off',
    body: 'Tap here anytime to jump straight back to the next task waiting for you.',
  },
  {
    selector: '.pp-hero-actions',
    title: 'Match buyers or publish',
    body: 'When you\'re ready, match to verified buyers or publish so anyone can view your verified record.',
  },
  {
    selector: '.pp-subtabs',
    title: 'Sections, Street, Buyers',
    body: 'Three tabs: complete your sections, see how you compare to your street, and review matched buyers.',
  },
  {
    selector: '.view-toggle',
    title: 'List or Map view',
    body: 'Tap the map view for an isometric tour through every section of your Passport.',
  },
]
import { usePassportRuntime } from '~/composables/usePassportRuntime'
import { usePassportCollaborators } from '~/composables/usePassportCollaborators'
import { onMounted, ref, computed } from 'vue'

definePageMeta({
  middleware: 'auth',
})

const { steps, loadPassport } = usePassportRuntime()
const { getCollaborators } = usePassportCollaborators()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// Collaborator state
const collaborators = ref([])
const showCollaboratorModal = ref(false)
const showPropertiesModal = ref(false)

const passportAddress = ref({ line1: '', line2: '' })
const passportTown = ref('')
// Drives which cover art the hero book shows. This page is the seller view,
// but /profile/passports can hand it a LANDLORD record for a 'both' user, so
// the real type is carried through rather than assumed.
const passportType = ref('SELLER')
const isPublished = ref(false)
const publishLoading = ref(false)
// Publish-readiness — null until first loaded, so the drawer never flashes
// its "not ready" gate before we actually know. Separate from
// overallProgress: this tracks only the disclosures required before a buyer
// can be charged for this passport.
const readiness = ref(null)
const propertyHomeScore = ref(null)

// Resume state — populated by GET /passport/:id/resume on mount and after
// every save / publish toggle so the "Pick up where you left off" CTA stays
// in sync with backend completion state.
const resumeTarget = ref(null)
const resumeTaskTitle = ref('')

// Tab state
const activeTab = ref('sections')
const viewMode = ref('list')
const viewOptions = [
  { label: 'List', value: 'list', icon: 'listView' },
  { label: 'Map', value: 'map', icon: 'mapView' },
]
const propertyId = ref(null)

// Street data
const streetProperties = ref([])
const streetStats = ref(null)

// Buyer data
const matchedBuyers = ref([])
const buyersTotal = ref(0)

// Matched-buyer card helpers (ported from the reference MatchedBuyersDrawer):
// teal initial avatar, match label + star pill, and the ring gauge stroke.
function buyerInitial(name) {
  return (name || '?').trim().charAt(0).toUpperCase()
}
function matchLabel(score) {
  if (score >= 75) return 'Strong match'
  if (score >= 55) return 'Good match'
  return 'Possible match'
}
function matchPillClass(score) {
  if (score >= 75) return 'pp-buyer-pill--strong'
  if (score >= 55) return 'pp-buyer-pill--good'
  return 'pp-buyer-pill--possible'
}
function matchStrokeColor(score) {
  if (score >= 75) return '#00A19A'
  if (score >= 55) return '#4CBFB4'
  return '#7FD0CB'
}

onMounted(async () => {
  // Quickly probe the passport type so we can hand landlord passports off
  // to the dedicated landlord view before we kick off the heavy seller-side
  // data loaders below.
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const probe = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (probe?.type === 'LANDLORD') {
      navigateTo(`/passportview/landlord/${route.params.id}`, { replace: true })
      return
    }
  } catch {
    /* fall through to normal seller load */
  }

  loadPassport(route.params.id)
  await loadCollaborators()
  // Load readiness up front — the "Ready to publish" bar and the Publish
  // button's label both key off it, so waiting for a click would mean the
  // seller sees a plain "Publish Passport" they can't actually use yet.
  fetchReadiness()
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const passport = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    passportAddress.value = {
      line1: passport.addressLine1 ?? '',
      line2: passport.postcode ?? '',
    }
    passportTown.value = passport.town ?? passport.city ?? ''
    isPublished.value = passport.status === 'PUBLISHED'
    passportType.value = passport.type || 'SELLER'
    propertyId.value = passport.propertyId ?? null
    // Pre-fetch street + buyer data in background
    if (passport.propertyId) {
      fetchStreetData(passport.propertyId)
      fetchBuyerData(passport.propertyId)
      fetchPropertyHomeScore(passport.propertyId)
    }
    fetchResumeTarget()
  } catch (e) {
    console.error('Failed to load passport address', e)
  }
})

async function fetchResumeTarget() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  try {
    const r = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}/resume`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    resumeTarget.value = r?.target ?? null
    if (resumeTarget.value) {
      // Look up the task title from local steps so the subtitle is friendly.
      for (const s of steps.value) {
        const t = s.tasks?.find((x) => x.id === resumeTarget.value.taskId)
        if (t) {
          resumeTaskTitle.value = `${s.title} · ${t.title || 'Continue'}`
          break
        }
      }
    } else {
      resumeTaskTitle.value = ''
    }
  } catch {
    resumeTarget.value = null
  }
}

const resumeSubtitle = computed(() => {
  if (!resumeTarget.value) return ''
  if (resumeTaskTitle.value) return resumeTaskTitle.value
  if (resumeTarget.value.reason === 'last-visited') return 'Continue your last task'
  if (resumeTarget.value.reason === 'next-in-section') return 'Next task in this section'
  if (resumeTarget.value.reason === 'next-section') return 'Move on to the next section'
  return 'Start your first task'
})

function goToResume() {
  if (!resumeTarget.value) return
  router.push(
    `/passportview/steps/tasks/${resumeTarget.value.taskId}?stepId=${resumeTarget.value.sectionId}&propertyId=${route.params.id}`,
  )
}

async function fetchPropertyHomeScore(pid) {
  try {
    const r = await $fetch(`${config.public.apiBase}/property/${pid}`)
    const score = r?.homeScore ?? r?.epcScore ?? null
    if (typeof score === 'number') propertyHomeScore.value = score
  } catch {}
}

async function fetchStreetData(pid) {
  try {
    const data = await $fetch(`${config.public.apiBase}/property/${pid}/street`)
    streetProperties.value = data.properties ?? []
    streetStats.value = data.stats ?? null
  } catch {}
}

async function fetchBuyerData(pid) {
  try {
    const data = await $fetch(
      `${config.public.apiBase}/property/${pid}/matched-buyers`,
    )
    matchedBuyers.value = data.buyers ?? []
    buyersTotal.value = data.total ?? 0
  } catch {}
}

const { toastState, showToast, hideToast } = useAppToast()

// ── Buyer detail + actions (invite / share / message) ──────────────────
const selectedBuyer = ref(null)
const buyerActionKind = ref(null)
const buyerActionTarget = ref(null)

function onBuyerSelect(buyer) {
  selectedBuyer.value = buyer
}

function onBuyerAction(kind) {
  if (!selectedBuyer.value?.userId) {
    console.warn(
      '[buyer-action] Selected buyer has no userId — cannot invite/share/message. ' +
        'Backend /property/:id/matched-buyers must return { userId }.',
    )
    return
  }
  buyerActionTarget.value = { ...selectedBuyer.value }
  buyerActionKind.value = kind
  // Close the detail drawer so only one sheet is on screen at a time.
  selectedBuyer.value = null
}

function onBuyerActionDone(kind, _result) {
  buyerActionKind.value = null
  buyerActionTarget.value = null
  showToast({
    message:
      kind === 'invite'
        ? 'Invite sent — the buyer will be notified.'
        : kind === 'share'
          ? 'Passport shared — the buyer can preview and unlock it.'
          : 'Message sent — carry on in your inbox.',
    iconEmoji: '✓',
    duration: 3000,
  })
}

function setTab(tab) {
  activeTab.value = tab
  if (
    tab === 'street' &&
    propertyId.value &&
    streetProperties.value.length === 0
  ) {
    fetchStreetData(propertyId.value)
  }
  if (
    tab === 'buyers' &&
    propertyId.value &&
    matchedBuyers.value.length === 0
  ) {
    fetchBuyerData(propertyId.value)
  }
  if (tab === 'vault' && vaultSections.value.length === 0) {
    fetchVault()
  }
  if (tab === 'timeline' && timelineEvents.value.length === 0) {
    fetchTimeline()
  }
}

function navigateToProperty(pid) {
  router.push(`/property/${pid}`)
}

function epcColor(rating) {
  const map = {
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

// ── Publish confirmation drawer + readiness gate ───────────────────────
const publishDrawerOpen = ref(false)

async function fetchReadiness() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  try {
    readiness.value = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}/readiness`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
  } catch (e) {
    console.error('Failed to load publish readiness', e)
  }
}

function onGoToChecklistItem(item) {
  publishDrawerOpen.value = false
  // System-fact checks (title number / EPC) aren't tied to a section the
  // seller answers directly — the EPC one has an upload fallback in
  // Environmental, so send them there; title number has nothing to action.
  if (!item?.taskId || !item?.sectionId) {
    if (item?.question?.toLowerCase().includes('epc')) {
      const envStep = steps.value.find((s) => s.key === 'environmental')
      if (envStep) navigateToStep(envStep.id)
    }
    return
  }
  // Deep-links straight to the exact question (not just its section) —
  // steps/tasks/[id].vue reads ?questionId= and jumps to it directly.
  router.push({
    path: `/passportview/steps/tasks/${item.taskId}`,
    query: {
      stepId: item.sectionId,
      propertyId: route.params.id,
      ...(item.questionId ? { questionId: item.questionId } : {}),
    },
  })
}

function onPublishClick() {
  // Unpublishing stays a one-click action; publishing shows the explainer
  // (or the outstanding-disclosures checklist) first.
  if (isPublished.value) {
    togglePublish()
  } else {
    publishDrawerOpen.value = true
    fetchReadiness()
  }
}

// The readiness bar itself is clickable — lets a seller see exactly what's
// outstanding without first going through the Publish button.
function openReadinessChecklist() {
  publishDrawerOpen.value = true
  fetchReadiness()
}

// Reflects readiness state right on the button so a seller isn't surprised
// by the drawer — the plain "Publish Passport" label only shows once we know
// they're ready (or haven't checked yet, to avoid a loading flash).
const publishButtonLabel = computed(() => {
  if (publishLoading.value) return '…'
  if (isPublished.value) return 'Unpublish'
  if (readiness.value && !readiness.value.canPublish) {
    return `Publish — ${readiness.value.readinessPct}% ready`
  }
  return 'Publish Passport'
})

async function onPublishConfirm() {
  await togglePublish()
  publishDrawerOpen.value = false
  // Refresh the timeline so the freshly-logged "Published" entry shows up.
  if (activeTab.value === 'timeline') fetchTimeline()
  else timelineEvents.value = [] // force re-fetch next time
}

async function togglePublish() {
  if (publishLoading.value) return
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  publishLoading.value = true
  try {
    const endpoint = isPublished.value ? 'unpublish' : 'publish'
    await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}/${endpoint}`,
      { method: 'PUT', headers: { Authorization: `Bearer ${token}` } },
    )
    isPublished.value = !isPublished.value
    fetchReadiness()
  } catch (e) {
    console.error('Failed to toggle publish state', e)
    // The backend gates publish on readiness — a 403 for that carries the
    // full result, so surface the checklist instead of failing silently.
    const gate = e?.data?.readiness
    if (gate) {
      readiness.value = gate
      publishDrawerOpen.value = true
    }
  } finally {
    publishLoading.value = false
  }
}

const loadCollaborators = async () => {
  try {
    collaborators.value = await getCollaborators(route.params.id)
  } catch (err) {
    console.error('Failed to load collaborators:', err)
  }
}

const openCollaboratorModal = () => {
  showCollaboratorModal.value = true
}

const handleCollaboratorAdded = (collaborator) => {
  console.log('Collaborator added:', collaborator)
  // Collaborators list will be reloaded by the modal
  loadCollaborators()
}

const handleCollaboratorRemoved = (collaboratorId) => {
  console.log('Collaborator removed:', collaboratorId)
  // Collaborators list will be reloaded by the modal
  loadCollaborators()
}

const displayCollaborators = computed(() => {
  // Show max 3 collaborators in the avatars
  return collaborators.value.slice(0, 3)
})

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${first}${last}` || '?'
}

const safeProgress = computed(() =>
  Math.min(Math.max(overallProgress.value, 5), 95),
)

// Hero sub-line — "Town · Postcode" when a town is known, else just postcode.
const heroSubline = computed(() => {
  const parts = [passportTown.value, passportAddress.value?.line2].filter(
    Boolean,
  )
  return parts.join(' · ')
})

// Sections shown as "X of Y complete" in the list header.
const completeSectionCount = computed(
  () => (steps.value ?? []).filter((s) => (s?.progress ?? 0) >= 100).length,
)

// const { steps } = usePassportSteps()
const selectedRole = ref('seller')

const roleOptions = [
  { label: 'Buyer', value: 'buyer', icon: 'buyer' },
  { label: 'Seller', value: 'seller', icon: 'seller' },
]

const overallProgress = computed(() => {
  const totalTasks = steps.value.reduce(
    (sum, step) => sum + step.tasks.length,
    0,
  )
  const completedTasks = steps.value.reduce(
    (sum, step) => sum + step.tasks.filter((t) => t.completed).length,
    0,
  )
  return Math.round((completedTasks / totalTasks) * 100) || 0
})

// ── Hero stat strip (HS / Docs / Sections / Ready) ───────────────
const heroHsScore = computed(() =>
  typeof propertyHomeScore.value === 'number' ? propertyHomeScore.value : '—',
)
const heroDocsCount = computed(() =>
  steps.value.reduce(
    (sum, step) => sum + step.tasks.filter((t) => t.completed).length,
    0,
  ),
)
const heroSectionsLabel = computed(() => {
  const total = steps.value.length
  const started = steps.value.filter((s) => (s.progress ?? 0) > 0).length
  return `${started}/${total}`
})
const heroReadyPct = computed(() => `${overallProgress.value}%`)

// Identify whether a task is an upload (doc) or a regular question.
// Falls back to the task `type` field; treats UPLOAD/MULTIPART as docs.
function isUploadTask(t) {
  const type = String(t?.type || '').toUpperCase()
  return type === 'UPLOAD' || type === 'MULTIPART'
}

const getStepDocs = (step) => {
  const tasks = (step?.tasks ?? []).filter(isUploadTask)
  return {
    done: tasks.filter((t) => t.completed).length,
    total: tasks.length,
  }
}

const getStepQuestions = (step) => {
  const tasks = (step?.tasks ?? []).filter((t) => !isUploadTask(t))
  return {
    done: tasks.filter((t) => t.completed).length,
    total: tasks.length,
  }
}

// Detect any uploaded doc that's expiring within 30 days. The runtime task
// model exposes the upload metadata under `answer` / `attachments`; we look
// for any `expiresAt` / `expiryDate` / `validUntil` field on completed
// upload tasks.
const getStepExpiringDoc = (step) => {
  const now = Date.now()
  const SOON_MS = 30 * 24 * 60 * 60 * 1000
  for (const t of step?.tasks ?? []) {
    if (!t?.completed || !isUploadTask(t)) continue
    const candidates = [
      t.expiresAt,
      t.expiryDate,
      t.validUntil,
      t.answer?.expiresAt,
      t.answer?.expiryDate,
      t.answer?.validUntil,
      ...(t.attachments ?? []).map(
        (a) => a?.expiresAt ?? a?.expiryDate ?? a?.validUntil,
      ),
    ].filter(Boolean)
    for (const raw of candidates) {
      const ts = new Date(raw).getTime()
      if (!Number.isFinite(ts)) continue
      const diff = ts - now
      if (diff < 0) {
        return {
          expired: true,
          label: `${t.title || 'A document'} has expired — please re-upload`,
        }
      }
      if (diff <= SOON_MS) {
        const days = Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)))
        return {
          expired: false,
          label: `${t.title || 'A document'} expires in ${days} day${days === 1 ? '' : 's'}`,
        }
      }
    }
  }
  return null
}

const getStepPoints = (step) => {
  if (!step?.tasks || !Array.isArray(step.tasks)) {
    return 0
  }
  return step.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => {
      // Support multiple property names: pointsReward, points, pointsAward, reward
      const points =
        t.pointsReward || t.points || t.pointsAward || t.reward || 0
      return sum + (Number(points) || 0)
    }, 0)
}

const navigateToStep = (stepId) => {
  router.push(`/passportview/steps/${stepId}?propertyId=${route.params.id}`)
}

const switchPassport = (passportId) => {
  router.push(`/passportview/${passportId}`)
}

const onRoleSwitch = (role) => {
  if (role === 'buyer') {
    router.push(`/buyer-passport/${route.params.id}`)
  }
}

// ── Vault ──────────────────────────────────────────────────────
// Verified documents grouped by section, each with a private/public toggle
// that controls whether the section publishes with the passport.
const vaultSections = ref([])
const vaultLoading = ref(false)
const completedVaultSections = computed(() =>
  vaultSections.value.filter((s) => s.status === 'COMPLETED'),
)
const vaultStoredCount = computed(() => completedVaultSections.value.length)

async function fetchVault() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  vaultLoading.value = true
  try {
    const data = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}/vault`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    vaultSections.value = data.sections ?? []
  } catch (e) {
    console.error('Failed to load vault', e)
  } finally {
    vaultLoading.value = false
  }
}

async function setVisibility(section, visibility) {
  const current = section.visibility || 'PUBLIC'
  if (current === visibility) return
  // Optimistic update — rollback on error.
  const prev = current
  section.visibility = visibility
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  try {
    await $fetch(
      `${config.public.apiBase}/passport/section/${section.id}/visibility`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: { visibility },
      },
    )
    // Activity ledger picks up the change server-side; refresh if user is on
    // the timeline tab so the new row appears.
    if (activeTab.value === 'timeline') fetchTimeline()
  } catch (e) {
    console.error('Failed to set visibility', e)
    section.visibility = prev
  }
}

// ── Timeline ───────────────────────────────────────────────────
// Immutable, time-stamped activity ledger for the passport.
const timelineEvents = ref([])
const timelineStages = ref(['Issued', 'Matched', 'Published', 'Offer', 'Exchange', 'Complete'])
const timelineStageIdx = ref(0)
const timelineLoading = ref(false)
const timelineCount = computed(() => timelineEvents.value.length)

async function fetchTimeline() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  timelineLoading.value = true
  try {
    const data = await $fetch(
      `${config.public.apiBase}/passport/${route.params.id}/timeline`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    timelineEvents.value = data.events ?? []
    timelineStages.value = data.stages ?? timelineStages.value
    timelineStageIdx.value = data.stageIdx ?? 0
  } catch (e) {
    console.error('Failed to load timeline', e)
  } finally {
    timelineLoading.value = false
  }
}

function formatStamp(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const day = d.getDate()
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return `${day} ${month} · ${hh}:${mm}`
  } catch {
    return ''
  }
}
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.ppv-root {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #231d45;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  /* `clip` keeps the sticky nav working. */
  overflow: clip;
  position: relative;
}

.ppv-ambient,
.ppv-mesh {
  pointer-events: none;
  position: fixed;
}

.ppv-ambient {
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.16;
}

.ppv-ambient-a {
  width: 300px;
  height: 300px;
  left: -100px;
  top: 120px;
  background: #00a19a;
}

.ppv-ambient-b {
  width: 320px;
  height: 320px;
  right: -120px;
  top: 160px;
  background: #5a4cf0;
}

.ppv-mesh {
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
}

/* ── Web nav (shared HomeScore pattern) ───────────────────────────── */
.hsw-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
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

/* ── Page head ────────────────────────────────────────────────────── */
.ppv-main {
  padding: 36px 0 60px;
}

.ppv-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.ppv-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.ppv-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16);
}

.ppv-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.ppv-lede {
  margin: 14px 0 0;
  max-width: 460px;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
}

.ppv-head-house {
  width: clamp(160px, 22vw, 240px);
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: -8px;
  filter: drop-shadow(0 24px 36px rgba(31, 61, 98, 0.16));
  pointer-events: none;
  user-select: none;
}

.ppv-role-switch {
  margin-bottom: 18px;
}

.ppv-mobile-nav {
  display: none;
}

.passport-content {
  padding: 0 0 40px !important;
}

/* ── Hero bottom — stats + circular progress ring ─────────────────── */
.pp-hero-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.pp-hero-progress {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.pp-hero-ring {
  position: relative;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

.pp-hero-ring-svg {
  width: 72px;
  height: 72px;
  display: block;
}

.pp-hero-ring-track {
  fill: none;
  stroke: #e2f1ea;
  stroke-width: 6;
}

.pp-hero-ring-fill {
  fill: none;
  stroke: #00a19a;
  stroke-width: 6;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.pp-hero-ring-pct {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 900;
  color: #231d45;
  letter-spacing: -0.02em;
}

.pp-hero-progress-meta {
  min-width: 0;
}

.pp-hero-progress-label {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #1a1a1a;
}

.header-icons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f0f0;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.role-buttons {
  display: flex;
  gap: 12px;
}

.role-btn {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.role-btn.seller-btn.active {
  background: #00a19a;
  color: white;
  border-color: #00a19a;
}

.btn-icon {
  font-size: 16px;
}

.passport-content {
  padding: 20px;
}

.passport-cards-carousel {
  margin-bottom: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.passport-card {
  /* background: linear-gradient(135deg, #00a19a 0%, #00d4c3 100%); */
  /* border-radius: 20px; */
  padding: 24px 24px;
  color: white;
  min-width: 280px;
  /* box-shadow: 0 8px 24px rgba(0, 184, 169, 0.3); */
  position: relative;
}

.card-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.card-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
}

.house-logo {
  width: 100%;
  height: 100%;
}

.card-address {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4px;
}

.card-location {
  font-size: 13px;
  text-align: center;
  opacity: 0.9;
}

.property-info {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 0px;
}

.info-header {
  margin-bottom: 20px;
}

.address-row {
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 8px;
}

.pin-icon {
  font-size: 18px;
}

.property-address-small {
  flex: 1;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: -0.45px;
  font-weight: 590;
  color: #000000;
  text-align: center;
}
.property-address-small-sub {
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  letter-spacing: -0.23px;
  color: #3c3c4399;
}
.dropdown-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 4px;
}

.progress-label {
  font-size: 11px;
  color: #999;
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  position: relative;
  flex: 1;
  height: 16px;
  background: #00a19a33;
  border-radius: 8px;
  overflow: visible;
}

.progress-fill {
  position: relative;
  height: 100%;
  background: linear-gradient(90deg, #00a19a 0%, #00d4c3 100%);
  transition: width 0.3s ease;
  border-radius: 8px;
  z-index: 2;
}

/* Dotted remaining part */
.progress-dotted {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
  border-radius: 2px;
  background-image: repeating-linear-gradient(
    to right,
    #3c3c432e 0,
    #3c3c432e 6px,
    transparent 6px,
    transparent 12px
  );
  z-index: 1;
}

.progress-man {
  position: absolute;
  right: -5px;
  top: -35%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
}

.progress-percentage {
  font-size: 11px;
  color: #00a19a;
  font-weight: 700;
  min-width: 35px;
  text-align: right;
}
.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.collaborators {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 10px;
  border: 1px solid #3c3c432e;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 32px;
}

.collaborator-avatars {
  display: flex;
  align-items: center;
  gap: 4px;
}

.avatar {
  width: 32px;
  height: 32px;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #00a19a;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.add-collaborator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  margin-left: -8px;
}

.collaborators-label {
  flex: 1;
  font-size: 13px;
  color: #666;
}

.add-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: none;
  border: none;
  font-size: 24px;
  color: #00a19a;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 16px;
  margin: 20px auto;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  color: #666;
}

.toggle-btn.active {
  background: #00a19a;
  color: white;
  border-color: #00a19a;
}

.steps-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: start;
}

.step-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 18px 16px;
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 1px 2px rgba(15, 36, 62, 0.04),
    0 8px 22px rgba(15, 36, 62, 0.05);
  position: relative;
  overflow: hidden;
}

/* Top accent bar that intensifies on hover for a premium feel */
.step-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, #00a19a 0%, #00d4c3 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.step-card:hover {
  transform: translateY(-4px);
  border-color: #d8ece9;
  box-shadow: 0 1px 2px rgba(15, 36, 62, 0.04),
    0 18px 38px rgba(0, 161, 154, 0.14);
}

.step-card:hover::before {
  opacity: 1;
}

.step-card:active {
  transform: translateY(-1px) scale(0.995);
}

.step-card--done::before {
  opacity: 1;
}

.step-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
}

.step-icon-container {
  flex-shrink: 0;
}

.step-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f1f9f7 0%, #e9f6f4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: #0f2440;
}

.step-points {
  font-size: 12px;
  line-height: 16px;
  color: #00a19a;
  font-weight: 600;
  margin-top: 2px;
}

.step-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.step-count-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  line-height: 1.4;
}
.step-count-docs {
  background: #f1f9f4;
  color: #00a19a;
  border: 1px solid #e2f1ea;
}
.step-count-q {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.step-expiry {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fef3c7;
  padding: 3px 8px;
  border-radius: 999px;
  cursor: pointer;
}
.step-expiry:hover {
  background: #fef3c7;
}

.step-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
}

.progress-bar.small {
  height: 5px;
  flex: 1;
  background: #eef2f7;
  border-radius: 999px;
}

.progress-bar.small .progress-fill {
  border-radius: 999px;
}

.step-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f7f9fc;
  border: 1px solid #e6ebf2;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.step-card:hover .step-arrow {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
}

.match_publish_container {
  display: flex;
}

.match_publish_container button {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 10px 5px;
  padding: 12px;
  background: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #00a19a;
  cursor: pointer;
}

.match_publish_container button.active {
  background: #00a19a;
  color: #ffffff;
}

.pp-match-badge {
  background: #fff;
  color: #00a19a;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 999px;
  margin-left: 4px;
  vertical-align: middle;
}

/* ── Tab bar ─────────────────────────────────────────── */
.pp-tab-bar {
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 4px;
  margin: 4px 0 16px;
}
.pp-tab {
  flex: 1;
  background: none;
  border: none;
  border-radius: 10px;
  padding: 9px 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
  position: relative;
}
.pp-tab.active {
  background: white;
  color: #1f7a66;
  box-shadow:
    0 1px 4px rgba(15, 23, 42, 0.1),
    0 0 0 1px rgba(15, 23, 42, 0.04);
}
.pp-tab-icon {
  font-size: 14px;
  line-height: 1;
}
.pp-tab-label {
  font-size: 12px;
}
.pp-tab-badge {
  background: #1f7a66;
  color: white;
  font-size: 9px;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 999px;
  line-height: 1.5;
  position: absolute;
  top: 4px;
  right: 4px;
}
.pp-tab-content {
  padding-top: 0;
}

/* ── Street tab ──────────────────────────────────────── */
.pp-vm-header {
  font-size: 13px;
  color: #5b6d84;
  line-height: 1.5;
  margin: 0 0 14px;
}

/* ── Street list ─────────────────────────────────────── */
.pp-street-list {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 14px;
  border: 1px solid #eef2f7;
  box-shadow: 0 1px 2px rgba(15, 36, 62, 0.04),
    0 8px 22px rgba(15, 36, 62, 0.05);
}
.pp-street-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px 16px;
  border-bottom: 1px solid #f2f5f9;
  cursor: pointer;
  transition: background 0.18s ease;
}
.pp-street-row:last-child {
  border-bottom: none;
}
.pp-street-row:hover {
  background: #f7fbfa;
}
.pp-street-row:hover .pp-street-chev {
  color: #00a19a;
  transform: translateX(2px);
}
.pp-street-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
  background: #f1f5f9;
  box-shadow: inset 0 0 0 1px rgba(15, 36, 62, 0.05);
}
.pp-street-icon img { width: 34px; height: 34px; object-fit: contain; }
.pp-street-row.is-published .pp-street-icon {
  background: linear-gradient(135deg, #e8f7f2 0%, #d6f0ea 100%);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.18);
}
.pp-street-row.is-started .pp-street-icon {
  background: linear-gradient(135deg, #fef6e6 0%, #fdedcf 100%);
  box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.2);
}
.pp-street-body {
  flex: 1;
  min-width: 0;
}
.pp-street-addr {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f2440;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pp-street-meta {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 3px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}
.pp-street-type {
  font-weight: 500;
}
.pp-street-epc {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #fff;
  padding: 2px 6px;
  border-radius: 5px;
}
.pp-street-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}
.pp-street-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.pp-street-badge.published {
  background: #e7f6f1;
  color: #0f7a63;
}
.pp-street-badge.started {
  background: #fdf3e0;
  color: #a5680d;
}
.pp-street-badge.none {
  background: #f1f5f9;
  color: #64748b;
}
.pp-street-chev {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #cbd5e1;
  transition: color 0.18s ease, transform 0.18s ease;
}
.pp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 44px 20px;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 18px;
  margin-bottom: 14px;
}

/* ── Street overview stats ───────────────────────────── */
.pp-street-stats {
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 14px;
  border: 1px solid #eef2f7;
  box-shadow: 0 1px 2px rgba(15, 36, 62, 0.04),
    0 8px 22px rgba(15, 36, 62, 0.05);
}
.pp-stats-head {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 15px;
}
.pp-stats-pin {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #00a19a;
  background: linear-gradient(135deg, #f1f9f7 0%, #e4f4f1 100%);
}
.pp-stats-pin svg {
  width: 19px;
  height: 19px;
}
.pp-stats-title {
  font-size: 15.5px;
  font-weight: 800;
  color: #0f2440;
  letter-spacing: -0.01em;
  line-height: 1.2;
}
.pp-stats-sub {
  font-size: 12px;
  color: #7688a0;
  margin-top: 1px;
}
.pp-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}
.pp-stat {
  border-radius: 14px;
  padding: 13px 14px;
  border: 1px solid transparent;
}
.pp-stat.brand {
  background: #f0faf8;
  border-color: #dcefeb;
}
.pp-stat.green {
  background: #f1faf3;
  border-color: #dcefe0;
}
.pp-stat.amber {
  background: #fdf7ea;
  border-color: #f4e6c6;
}
.pp-stat.grey {
  background: #f7f9fc;
  border-color: #e9eef5;
}
.pp-stat-val {
  font-size: 26px;
  font-weight: 800;
  color: #0f2440;
  letter-spacing: -0.02em;
  line-height: 1.05;
}
.pp-stat.brand .pp-stat-val {
  color: #0f8a76;
}
.pp-stat.green .pp-stat-val {
  color: #17a34a;
}
.pp-stat.amber .pp-stat-val {
  color: #b5760f;
}
.pp-stat-lbl {
  font-size: 11.5px;
  font-weight: 500;
  color: #64748b;
  margin-top: 4px;
}
.pp-street-tip {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  font-size: 12.5px;
  color: #4a5b72;
  line-height: 1.5;
  padding: 12px 13px;
  background: #f0faf8;
  border: 1px solid #dcefeb;
  border-radius: 12px;
}
.pp-street-tip-ic {
  flex-shrink: 0;
  line-height: 1.4;
}
.pp-street-tip strong {
  color: #0f2440;
  font-weight: 700;
}

/* ── Buyers tab ──────────────────────────────────────── */
.pp-buyers-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 4px 2px 2px;
}
.pp-buyers-head-text { flex: 1; min-width: 0; }
.pp-buyers-illustration {
  width: 104px;
  height: 104px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 4px;
}
.pp-buyers-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #008a84;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.pp-buyers-eyebrow-ic {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #e9f6f5;
  color: #008a84;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pp-buyers-eyebrow-ic svg { width: 15px; height: 15px; }
.pp-buyers-title {
  font-size: 22px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.5px;
  line-height: 1.15;
  margin: 0 0 10px;
}
.pp-buyers-lede {
  font-size: 13px;
  color: #4a5876;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}
.pp-buyers-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 2px 12px;
  font-size: 13px;
  color: #4a5876;
  font-weight: 500;
}
.pp-buyers-hint b { color: #231d45; font-weight: 800; }
.pp-buyers-hint-ic {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: #e9f6f5;
  color: #008a84;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pp-buyers-hint-ic svg { width: 18px; height: 18px; }

.pp-buyer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}
.pp-buyer-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 14px 16px;
  background: #fff;
  border: 1px solid #e7eaee;
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(35, 29, 69, 0.05);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
.pp-buyer-card:hover { box-shadow: 0 6px 18px rgba(35, 29, 69, 0.08); }
.pp-buyer-card:active { transform: scale(0.99); }
.pp-buyer-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b8b0, #008a84);
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 14px rgba(0, 161, 154, 0.28);
}
.pp-buyer-info { flex: 1; min-width: 0; }
.pp-buyer-name {
  font-size: 16px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.3px;
  line-height: 1.15;
}
.pp-buyer-criteria {
  font-size: 12.5px;
  font-weight: 500;
  color: #4a5876;
  margin-top: 4px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pp-buyer-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 100px;
  margin-top: 8px;
  background: #e9f6f5;
  color: #008a84;
}
.pp-buyer-pill--possible { background: #f5f7f9; color: #4a5876; }
.pp-buyer-star { width: 12px; height: 12px; }
.pp-buyer-pill--possible .pp-buyer-star { color: #9aa3b8; }
.pp-buyer-gauge {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.pp-buyer-gauge svg { width: 100%; height: 100%; }
.pp-buyer-gauge .pp-mg-track { stroke: #e9f6f5; }
.pp-buyer-gauge .pp-mg-fill {
  transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-buyer-gauge-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 900;
  color: #008a84;
  letter-spacing: -0.3px;
}
.pp-buyer-gauge-num small { font-size: 8px; font-weight: 800; margin-left: 1px; }
.pp-buyer-chev {
  width: 18px;
  height: 18px;
  color: #c4cbd6;
  flex-shrink: 0;
}

/* ── Pick up where you left off — resume CTA ──────────────────────── */
.pp-resume-cta {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  background: linear-gradient(135deg, #00a19a, #00a19a);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 12px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.28);
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
.pp-resume-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(0, 161, 154, 0.34);
}
.pp-resume-ic {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 800;
  flex-shrink: 0;
}
.pp-resume-ic-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}
.pp-resume-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.pp-resume-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.pp-resume-sub {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pp-resume-chev {
  font-size: 20px;
  font-weight: 600;
  opacity: 0.7;
  flex-shrink: 0;
}

/* ── Premium Passport hero (prototype-matching) ───────────────────── */
.pp-hero {
  background:
    radial-gradient(
      circle at 18% 30%,
      rgba(0, 161, 154, 0.08),
      transparent 50%
    ),
    radial-gradient(circle at 90% 90%, rgba(35, 29, 69, 0.04), transparent 50%),
    linear-gradient(180deg, #f4fbfa 0%, #fff 100%);
  border: 1px solid #e2f1ea;
  border-radius: 22px;
  padding: 24px 26px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 26px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 18px 40px rgba(31, 61, 98, 0.08);
}
.pp-hero-glow {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.18), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.pp-hero-book {
  width: 132px;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  filter: drop-shadow(0 12px 26px rgba(0, 140, 134, 0.3));
}
.pp-hero-book :deep(.passport-card) {
  padding: 0;
  margin: 0;
  width: 100%;
  min-width: 0;
}
.pp-hero-book :deep(.passport-container) {
  width: 100%;
  height: 172px;
}
.pp-hero-book :deep(.passport-image) {
  width: 100%;
  height: 100%;
}
.pp-hero-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}
.pp-hero-eyebrow {
  font-size: 10.5px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00a19a;
  margin-bottom: 5px;
}
.pp-hero-addr-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pp-hero-addr-text {
  flex: 0 1 auto;
  min-width: 0;
}
.pp-hero-addr-l1 {
  font-size: 22px;
  font-weight: 900;
  color: #231d45;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.pp-hero-addr-l2 {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 3px;
}
.pp-hero-switch {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  color: #00a19a;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
}
.pp-hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
}
.pp-hero-stat {
  text-align: center;
  padding: 0 22px;
}
.pp-hero-stat:first-child {
  padding-left: 0;
}
.pp-hero-stat + .pp-hero-stat {
  border-left: 1px solid rgba(35, 29, 69, 0.1);
}
.pp-hero-stat-val {
  font-size: 24px;
  font-weight: 900;
  color: #231d45;
  line-height: 1;
  letter-spacing: -0.02em;
}
.pp-hero-stat-val--ready {
  color: #00a19a;
}
.pp-hero-stat-lbl {
  font-size: 10px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 5px;
  font-weight: 800;
}

.pp-hero-dash {
  margin-top: 10px;
}
.pp-hero-dash-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.pp-hero-dash-label {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4a5568;
}
.pp-hero-dash-pct {
  color: #00a19a;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: -0.01em;
}
.pp-hero-dash-bar {
  height: 6px;
  background: #eef0f6;
  border-radius: 999px;
  position: relative;
  overflow: visible;
}
.pp-hero-dash-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a19a, #00b5ad);
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}
.pp-hero-dash-man {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px !important;
  height: 22px !important;
  pointer-events: none;
}
.pp-hero-dash-issued {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9.5px;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 7px;
  letter-spacing: 0.02em;
}
.pp-hero-dash-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00a19a;
  box-shadow: 0 0 0 2.5px #f1f9f4;
}

/* ── Action row (Match to Buyers + Publish) ────────────────────── */
.pp-action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}
.pp-action-btn {
  border: none;
  border-radius: 12px;
  padding: 11px 12px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    transform 0.1s,
    box-shadow 0.15s;
}
.pp-action-btn:active {
  transform: scale(0.98);
}
.pp-action-outline {
  background: #fff;
  color: #231d45;
  border: 1.5px solid #eef0f6;
}
.pp-action-outline:hover {
  border-color: #e2f1ea;
}
.pp-action-primary {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 161, 154, 0.28);
}
.pp-action-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.pp-action-loading {
  opacity: 0.85;
}
.pp-action-badge {
  background: #00a19a;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 2px;
}

/* ── Collaborators row ─────────────────────────────────────────── */
.pp-collab-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #eef0f6;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.pp-collab-row:hover {
  border-color: #e2f1ea;
}
.pp-collab-add {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f9f4;
  border: 1px solid #e2f1ea;
  display: grid;
  place-items: center;
  color: #00a19a;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
  line-height: 1;
}
.pp-collab-stack {
  display: flex;
  margin-left: -4px;
}
.pp-collab-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b5ad, #00a19a);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  margin-left: -8px;
}
.pp-collab-text {
  font-size: 12.5px;
  color: #4a5568;
  font-weight: 600;
  flex: 1;
}
.pp-collab-chev {
  color: #94a3b8;
  font-size: 18px;
  font-weight: 600;
}

/* ── Sub-tabs ──────────────────────────────────────────────────── */
.pp-subtabs {
  display: flex;
  background: #fff;
  border: 1px solid #eef0f6;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 12px;
}
.pp-subtab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 9px 8px;
  border-radius: 9px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition:
    background 0.15s,
    color 0.15s;
}
.pp-subtab.active {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 161, 154, 0.28);
}
/* Illustrated tab icons. They're teal-on-white artwork, so on the active
   (teal) chip they get a white plate to keep the shape readable. */
.pp-subtab-ic {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
.pp-subtab.active .pp-subtab-ic {
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  box-sizing: border-box;
}
.pp-subtab-badge {
  background: #fff;
  color: #00a19a;
  font-size: 10px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 999px;
  margin-left: 2px;
}
.pp-subtab:not(.active) .pp-subtab-badge {
  background: #00a19a;
  color: #fff;
}

/* ── Vault tab ─────────────────────────────────────────────────── */
.vault-legend { margin: 8px 0 6px; padding: 12px 14px; background: #f5f6fa; border: 1px solid #e4e5ed; border-radius: 13px; }
.vault-legend-t { font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #a8a9ad; margin-bottom: 8px; }
.vault-legend-row { display: flex; align-items: flex-start; gap: 9px; font-size: 11px; font-weight: 600; color: #6b7089; line-height: 1.45; }
.vault-legend-row + .vault-legend-row { margin-top: 7px; }
.vault-legend-ico { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; flex-shrink: 0; }
.vault-legend-ico img { width: 26px; height: 26px; object-fit: contain; }
.vault-legend-ico.private { background: transparent; }
.vault-legend-ico.public { background: transparent; }
.vault-legend-row b { color: #231d45; font-weight: 800; }
.vault-count { padding: 6px 0 4px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #6b7089; }
.vault-row { display: flex; align-items: flex-start; gap: 12px; margin: 0 0 10px; padding: 14px; background: #fff; border: 1px solid #e4e5ed; border-radius: 14px; box-shadow: 0 2px 8px rgba(35, 29, 69, 0.05); }
.vault-ico { width: 40px; height: 40px; border-radius: 11px; background: #e5f4f2; color: #008a84; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.vault-info { flex: 1; min-width: 0; }
.vault-name { font-size: 14px; font-weight: 800; color: #231d45; }
.vault-vis-meta { font-size: 10.5px; font-weight: 700; margin-top: 3px; line-height: 1.35; }
.vault-row.public .vault-vis-meta { color: #008a84; }
.vault-row.private .vault-vis-meta { color: #6b7089; }
.vis-seg { display: flex; gap: 2px; background: #f5f6fa; border: 1px solid #e4e5ed; border-radius: 100px; padding: 3px; flex-shrink: 0; align-self: center; }
.vis-opt { display: flex; align-items: center; gap: 4px; padding: 6px 11px; border-radius: 100px; font-size: 11px; font-weight: 800; color: #6b7089; cursor: pointer; transition: all 0.12s; }
.vis-opt:hover { color: #231d45; }
.vis-opt.on { color: #fff; }
.vis-opt.on.private { background: #6b7089; }
.vis-opt.on.public { background: #00a19a; }

/* ── Timeline tab ──────────────────────────────────────────────── */
.tl-intro { margin: 8px 0 0; padding: 13px 15px; background: #f2faf8; border: 1px solid #e5f4f2; border-radius: 13px; font-size: 12px; font-weight: 600; color: #6b7089; line-height: 1.55; display: flex; gap: 9px; align-items: flex-start; }
.tl-intro .lockico { font-size: 16px; flex-shrink: 0; }
.tl-intro b { color: #008a84; font-weight: 800; }
.tl-stage { margin: 14px 0 0; padding: 16px 14px 12px; background: #fff; border: 1px solid #e4e5ed; border-radius: 16px; box-shadow: 0 2px 8px rgba(35, 29, 69, 0.05); }
.tl-stage-h { font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #a8a9ad; margin-bottom: 14px; }
.tl-steps { display: flex; align-items: flex-start; }
.tl-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.tl-step::before { content: ''; position: absolute; top: 9px; left: -50%; width: 100%; height: 2.5px; background: #e4e5ed; z-index: 0; }
.tl-step:first-child::before { display: none; }
.tl-step.done::before,
.tl-step.now::before { background: #00a19a; }
.tl-dot { width: 20px; height: 20px; border-radius: 50%; background: #fff; border: 2.5px solid #e4e5ed; z-index: 1; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #a8a9ad; }
.tl-step.done .tl-dot { background: #00a19a; border-color: #00a19a; color: #fff; }
.tl-step.now .tl-dot { border-color: #00a19a; color: #008a84; box-shadow: 0 0 0 4px #e5f4f2; }
.tl-step-lbl { font-size: 9px; font-weight: 800; color: #a8a9ad; margin-top: 7px; text-align: center; line-height: 1.2; letter-spacing: 0.2px; }
.tl-step.done .tl-step-lbl,
.tl-step.now .tl-step-lbl { color: #231d45; }
.tl-list-h { padding: 18px 0 6px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #a8a9ad; }
.tl-item { display: flex; gap: 12px; margin: 0; padding: 4px 0; position: relative; }
.tl-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.tl-rail-dot { width: 34px; height: 34px; border-radius: 11px; background: #e5f4f2; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; z-index: 1; }
.tl-rail-line { width: 2px; flex: 1; background: #e4e5ed; margin: 4px 0; min-height: 14px; }
.tl-item:last-child .tl-rail-line { display: none; }
.tl-card { flex: 1; min-width: 0; background: #fff; border: 1px solid #e4e5ed; border-radius: 14px; box-shadow: 0 2px 8px rgba(35, 29, 69, 0.05); padding: 12px 14px; margin-bottom: 12px; }
.tl-card-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.tl-title { font-size: 13.5px; font-weight: 800; color: #231d45; letter-spacing: -0.2px; line-height: 1.25; }
.tl-time { font-size: 10px; font-weight: 700; color: #a8a9ad; white-space: nowrap; flex-shrink: 0; }
.tl-who { font-size: 11px; font-weight: 600; color: #6b7089; margin-top: 2px; }
.tl-stamp { display: inline-flex; align-items: center; gap: 6px; margin-top: 9px; padding: 5px 9px; background: #f2faf8; border: 1px solid #e5f4f2; border-radius: 8px; }
.tl-stamp-lock { font-size: 11px; }
.tl-stamp-txt { font-family: 'SFMono-Regular', Menlo, Consolas, monospace; font-size: 10px; font-weight: 700; color: #008a84; letter-spacing: 0.3px; }
.tl-stamp-verif { font-size: 9px; font-weight: 800; color: #008a84; letter-spacing: 0.4px; text-transform: uppercase; margin-left: 2px; }

/* ── Section cards ─────────────────────────────────────────────── */
.pp-sections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pp-section-card {
  background: #fff;
  border: 1px solid #eef0f6;
  border-radius: 14px;
  padding: 0 14px;
  box-shadow:
    0 1px 3px rgba(35, 29, 69, 0.06),
    0 2px 8px rgba(35, 29, 69, 0.04);
  transition:
    border-color 0.15s,
    transform 0.1s;
  cursor: pointer;
}
.pp-section-card:hover {
  border-color: #e2f1ea;
}
.pp-section-card:active {
  transform: scale(0.99);
}
.pp-section-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
}
.pp-section-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(140deg, #f3fbfa 0%, #f1f9f4 100%);
  border: 1px solid #e2f1ea;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #00a19a;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
.pp-section-body {
  flex: 1;
  min-width: 0;
}
.pp-section-name {
  font-size: 14px;
  font-weight: 700;
  color: #231d45;
}
.pp-section-meta {
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
}
.pp-section-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}
.pp-section-pct {
  font-size: 11px;
  font-weight: 800;
  background: #f1f9f4;
  color: #00a19a;
  border: 1px solid #e2f1ea;
  padding: 3px 9px;
  border-radius: 999px;
}
.pp-section-pct.zero {
  background: #f1f5f9;
  color: #94a3b8;
  border-color: #eef0f6;
}
.pp-section-pct.full {
  background: #d1fae5;
  color: #1f7a66;
  border-color: #a7f3d0;
}
.pp-section-chev {
  color: #94a3b8;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .ppv-head-house {
    width: 150px;
  }

  .steps-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 899px) {
  .hsw-links {
    display: none;
  }

  .hsw-shell {
    width: calc(100% - 32px);
  }

  .hsw-nav-inner {
    min-height: 58px;
  }

  .ppv-main {
    padding-top: 26px;
    padding-bottom: 96px;
  }

  .ppv-mobile-nav {
    display: block;
  }

  .ppv-head-house {
    display: none;
  }

  .pp-hero {
    flex-direction: column;
    align-items: stretch;
    gap: 18px;
  }

  .pp-hero-book {
    width: 120px;
  }
}

@media (max-width: 640px) {
  .hsw-shell {
    width: calc(100% - 24px);
  }

  .steps-list {
    grid-template-columns: 1fr;
  }

  .hsw-back {
    display: none;
  }

  .pp-hero-bottom {
    gap: 14px;
  }

  .pp-hero-stat {
    padding: 0 14px;
  }
}

/* ══════════════════════════════════════════════════════════════════════
   REDESIGN — target look: dark hero, inline actions, combined tab row,
   verified-sections header, refined section cards. Overrides above.
   ══════════════════════════════════════════════════════════════════════ */

/* ── Page head — role switch sits at top-right ─────────────────────── */
.ppv-head {
  align-items: center;
  margin-bottom: 22px;
}
.ppv-lede {
  max-width: 520px;
}
.ppv-kicker-line {
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: #00a19a;
}

/* Compact, pill-style segmented switches (role + list/map) */
.ppv-role-switch {
  margin-bottom: 0;
  flex-shrink: 0;
  display: inline-flex;
}
.ppv-role-switch :deep(.switch-container),
.view-toggle :deep(.switch-container) {
  width: auto;
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid #e6e3dd;
  background: #fff;
}
.ppv-role-switch :deep(.switch-btn),
.view-toggle :deep(.switch-btn) {
  flex: 0 0 auto;
  border-radius: 999px !important;
  font-size: 14px;
  font-weight: 700;
  color: #6b6885;
  padding: 8px 22px;
}
.ppv-role-switch :deep(.btn-icon) {
  display: none;
}
.ppv-role-switch :deep(.switch-btn:not(.active)),
.view-toggle :deep(.switch-btn:not(.active)) {
  background: transparent;
}
.ppv-role-switch :deep(.switch-btn.active) {
  background: #231d45;
  color: #fff;
}
.view-toggle {
  margin: 0;
}
.view-toggle :deep(.switch-container) {
  background: #fff;
}
.view-toggle :deep(.switch-btn) {
  font-size: 13.5px;
  padding: 7px 18px;
  gap: 8px;
  color: #00a19a;
}
.view-toggle :deep(.btn-icon) {
  display: inline-flex;
  align-items: center;
}
.view-toggle :deep(.btn-icon img) {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.view-toggle :deep(.switch-btn:not(.active)) {
  background: #e6f8f7;
  color: #00a19a;
}
.view-toggle :deep(.switch-btn.active) {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 161, 154, 0.28);
}
/* Active button sits on teal. Inverting the PNG to a flat white silhouette
   erased the list glyph's detail, so the icon keeps its own colours and sits
   on the white plate the switch adds. */
.view-toggle :deep(.switch-btn.active .btn-icon img) {
  filter: none;
}

/* ── Dark hero ─────────────────────────────────────────────────────── */
.pp-hero {
  background:
    radial-gradient(circle at 88% 12%, rgba(0, 212, 195, 0.16), transparent 42%),
    radial-gradient(circle at 6% 92%, rgba(90, 76, 240, 0.16), transparent 46%),
    linear-gradient(135deg, #241e4c 0%, #14102f 60%, #0d0924 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 30px 34px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 34px;
  overflow: hidden;
  box-shadow: 0 26px 64px rgba(13, 9, 36, 0.3);
}
.pp-hero-book {
  width: 172px;
  flex-shrink: 0;
  filter: drop-shadow(0 20px 36px rgba(0, 140, 134, 0.42));
}
/* Let the book render at its natural 965×1362 aspect ratio so the baked-in
   layout and the overlaid address stay aligned (a forced fixed height was
   letterboxing the image and pushing the address text past its edges). */
.pp-hero-book :deep(.passport-card) {
  margin: 0;
}
.pp-hero-book :deep(.passport-container) {
  width: 100%;
  height: auto;
}
.pp-hero-book :deep(.passport-image) {
  width: 100%;
  height: auto;
}
.pp-hero-main {
  flex: 1;
  min-width: 0;
}
.pp-hero-eyebrow {
  color: #38dccc;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 9px;
}
.pp-hero-addr-l1 {
  color: #fff;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.pp-hero-addr-l2 {
  color: #b6b1d6;
  font-size: 13.5px;
  margin-top: 5px;
}
.pp-hero-switch {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #d7d3ee;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.16s, border-color 0.16s, color 0.16s, transform 0.16s;
}
.pp-hero-switch svg {
  width: 16px;
  height: 16px;
}
.pp-hero-switch:hover {
  background: rgba(47, 208, 198, 0.16);
  border-color: rgba(47, 208, 198, 0.5);
  color: #2fd0c6;
  transform: translateY(-1px);
}
.pp-hero-stats {
  margin-top: 20px;
}
.pp-hero-stat-val {
  color: #fff;
  font-size: 26px;
}
.pp-hero-stat-lbl {
  color: #8f8ab0;
}
.pp-hero-stat:first-child {
  padding-left: 0;
}
.pp-hero-stat + .pp-hero-stat {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.pp-hero-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}
.pp-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  padding: 11px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.pp-hero-btn:active {
  transform: scale(0.98);
}
.pp-hero-btn--primary {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.4);
}
.pp-hero-btn--primary:hover {
  background: #00b3ab;
}
.pp-hero-btn--primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.pp-hero-btn--ghost {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.pp-hero-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.13);
}
.pp-hero-btn-ic {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
.pp-hero-btn-badge {
  background: #00d4c3;
  color: #0d0924;
  font-size: 11px;
  font-weight: 900;
  padding: 1px 7px;
  border-radius: 999px;
}

.pp-hero-side {
  flex-shrink: 0;
  width: 176px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 22px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(6px);
}
.pp-hero-ring {
  position: relative;
  width: 116px;
  height: 116px;
  display: grid;
  place-items: center;
}
.pp-hero-ring::before {
  content: '';
  position: absolute;
  inset: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(47, 208, 198, 0.16), transparent 70%);
}
.pp-hero-ring-svg {
  width: 116px;
  height: 116px;
}
.pp-hero-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 7;
}
.pp-hero-ring-fill {
  fill: none;
  stroke: url(#ppRingGrad);
  stroke-width: 7;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease;
  filter: drop-shadow(0 0 5px rgba(47, 208, 198, 0.5));
}
.pp-hero-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
}
.pp-hero-ring-pct {
  color: #fff;
  font-size: 27px;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
}
.pp-hero-ring-sub {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8f8ab0;
}
.pp-hero-side-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #a5a0c4;
  text-align: center;
}
.pp-hero-issued {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(0, 212, 195, 0.14);
  border: 1px solid rgba(47, 208, 198, 0.3);
  color: #4fe3d5;
  font-size: 11.5px;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.pp-hero-issued--draft {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  color: #b6b1d6;
}
.pp-hero-issued-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00d4c3;
  box-shadow: 0 0 0 3px rgba(0, 212, 195, 0.18);
}
.pp-hero-issued--draft .pp-hero-issued-dot {
  background: #b6b1d6;
  box-shadow: 0 0 0 3px rgba(182, 177, 214, 0.16);
}

/* ── Publish-readiness band — amber on purpose, so it never reads as a
      second copy of the teal completion ring in the hero above it. ─── */
.pp-ready {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-bottom: 16px;
  padding: 16px 20px;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffaf1 0%, #fff7e8 100%);
  border: 1px solid #fbe4bd;
  box-shadow: 0 8px 22px rgba(180, 83, 9, 0.06);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.pp-ready:hover {
  border-color: #f5cf94;
  box-shadow: 0 10px 26px rgba(180, 83, 9, 0.11);
}
.pp-ready-ic {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  color: #b45309;
  background: #fff1d9;
  border: 1px solid #fbe4bd;
}
.pp-ready-body {
  flex: 1;
  min-width: 0;
  display: block;
}
.pp-ready-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 7px;
}
.pp-ready-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #92400e;
}
.pp-ready-pct {
  font-size: 15px;
  font-weight: 800;
  color: #b45309;
}
.pp-ready-bar {
  display: block;
  height: 6px;
  border-radius: 999px;
  background: #fdead0;
  overflow: hidden;
}
.pp-ready-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  transition: width 0.4s ease;
}
.pp-ready-note {
  display: block;
  margin-top: 8px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.45;
  color: #92400e;
}
.pp-ready-chev {
  flex-shrink: 0;
  font-size: 18px;
  color: #c98a3c;
}

.pp-empty-ic {
  font-size: 30px;
  line-height: 1;
  margin-bottom: 10px;
  color: #b6b1d6;
}

/* ── Collaborators row ─────────────────────────────────────────────── */
.pp-collab-row {
  gap: 14px;
  border: 1px solid #e6e3dd;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
.pp-collab-add {
  width: 40px;
  height: 40px;
  border-style: dashed;
  font-size: 20px;
}
.pp-collab-body {
  flex: 1;
  min-width: 0;
}
.pp-collab-title {
  font-size: 14.5px;
  font-weight: 800;
  color: #231d45;
}
.pp-collab-sub {
  font-size: 12.5px;
  color: #8b8aa3;
  margin-top: 2px;
  line-height: 1.4;
}
.pp-collab-arrow {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e6e3dd;
  color: #94a3b8;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Tabs row (sections/street/buyers · list/map) ──────────────────── */
.pp-tabs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 10px 0 20px;
}
.pp-subtabs {
  display: inline-flex;
  width: auto;
  border: 1px solid #e6e3dd;
  border-radius: 999px;
  margin-bottom: 0;
}
.pp-subtab {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 9px 18px;
}

/* ── Resume banner — dark ──────────────────────────────────────────── */
.pp-resume-cta {
  background: linear-gradient(135deg, #241e4c, #14102f 70%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 15px 18px;
  box-shadow: 0 12px 32px rgba(20, 16, 47, 0.26);
  margin-bottom: 4px;
}
.pp-resume-cta:hover {
  box-shadow: 0 16px 40px rgba(20, 16, 47, 0.32);
}
.pp-resume-ic {
  background: rgba(0, 212, 195, 0.16);
  color: #3fe0d2;
}
.pp-resume-sub {
  color: rgba(255, 255, 255, 0.6);
}
.pp-resume-continue {
  color: #3fe0d2;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ── Verified-sections header ──────────────────────────────────────── */
.pp-sec-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 22px 0 16px;
}
.pp-sec-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #00857f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.pp-sec-title {
  margin: 0;
  color: #1b2340;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.pp-sec-complete {
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #e6e3dd;
  color: #5b6d89;
  font-size: 12.5px;
  font-weight: 800;
  padding: 8px 15px;
  border-radius: 999px;
  white-space: nowrap;
}

/* ── Section cards — refined ───────────────────────────────────────── */
.step-icon-bg {
  width: 46px;
  height: 46px;
  border-radius: 13px;
}
.step-points {
  color: #8b93a7;
  font-weight: 600;
}
.step-count-docs,
.step-count-q {
  background: #f3f4f8;
  color: #5b6478;
  border: 1px solid #eceef3;
}

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 899px) {
  .pp-hero {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    padding: 22px;
  }
  .pp-hero-book {
    width: 144px;
    align-self: center;
  }
  .pp-hero-side {
    width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 16px;
  }
  .pp-tabs-row {
    flex-wrap: wrap;
  }
  .ppv-head {
    align-items: flex-start;
  }
}
</style>
