<template>
  <div class="lp-page">
    <div class="lp-ambient lp-ambient-a" />
    <div class="lp-ambient lp-ambient-b" />
    <div class="lp-mesh" />

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
          <button class="hsw-back" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button class="hsw-cta" type="button" :disabled="!passport" @click="openTenantShare">Share</button>
        </div>
      </div>
    </header>

    <main class="lp-body">
      <div class="atm-bg teal" />

      <!-- Page head — title + lede + isometric house -->
      <div class="lpw-head">
        <div class="lpw-head-text">
          <p class="lpw-kicker"><span class="lpw-kicker-dot" />Landlord Passport</p>
          <h1>Your <span class="lpw-accent">Letting</span> Passport</h1>
          <p class="lpw-lede">
            Keep certificates current, stay compliant, and share everything with
            your tenant in one tap.
          </p>
        </div>
        <img
          src="/house.png"
          alt=""
          class="lpw-head-house"
          @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
        />
      </div>

      <div v-if="loading" class="lp-loading">Loading…</div>

      <template v-else-if="passport">
        <!-- Premium hero — live-record dashboard -->
        <div class="pp-hero">
          <div class="pp-hero-book">
            <PassportCard
              :line1="passport.addressLine1"
              :line2="passport.postcode"
            />
          </div>

          <div class="pp-hero-main">
            <div class="pp-hero-eyebrow">Landlord Passport · Live record</div>
            <h2 class="pp-hero-addr">{{ passport.addressLine1 }}</h2>
            <div class="pp-hero-loc">{{ heroLocation }}</div>

            <div class="pp-hero-stats">
              <div class="pp-hero-stat">
                <div class="pp-hero-stat-val">{{ progressPct }}<small>%</small></div>
                <div class="pp-hero-stat-lbl">Compliant</div>
              </div>
              <div class="pp-hero-stat">
                <div class="pp-hero-stat-val">{{ docCount }}</div>
                <div class="pp-hero-stat-lbl">Documents</div>
              </div>
              <div class="pp-hero-stat">
                <div class="pp-hero-stat-val">
                  {{ stats.complete }}<span class="pp-hero-stat-of">/{{ stats.total }}</span>
                </div>
                <div class="pp-hero-stat-lbl">Sections</div>
              </div>
            </div>

            <div class="pp-hero-actions">
              <button class="pp-hero-btn pp-hero-btn--primary" type="button" @click="openFirstUpload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload a certificate
              </button>
              <button class="pp-hero-btn pp-hero-btn--ghost" type="button" @click="openTenantShare">
                Share with tenant
              </button>
            </div>
          </div>

          <div class="pp-hero-side">
            <div class="pp-hero-ring">
              <svg viewBox="0 0 72 72" class="pp-hero-ring-svg">
                <circle cx="36" cy="36" r="30" class="pp-hero-ring-track" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  class="pp-hero-ring-fill"
                  stroke-dasharray="188.5"
                  :stroke-dashoffset="188.5 - (188.5 * progressPct) / 100"
                />
              </svg>
              <span class="pp-hero-ring-pct">{{ progressPct }}%</span>
            </div>
            <div class="pp-hero-side-label">Compliance</div>
            <div v-if="firstExpiring" class="pp-hero-badge pp-hero-badge--warn">
              <span class="pp-hero-badge-dot" />
              {{ firstExpiring }}
            </div>
            <div v-else class="pp-hero-badge">
              <span class="pp-hero-badge-dot" />
              Letting passport active
            </div>
          </div>
        </div>

        <!-- Convert / linked CTA -->
        <button v-if="!hasSellerSibling" class="lp-convert-card" @click="showConvertModal = true">
          <div class="lp-convert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <div class="lp-convert-body">
            <div class="lp-convert-title">Convert to selling passport</div>
            <div class="lp-convert-sub">Transfer 6 docs · keep tenant or serve notice</div>
          </div>
          <span class="lp-convert-link">Convert&nbsp;→</span>
        </button>

        <button v-else class="lp-convert-card lp-convert-card--linked" @click="navigateTo(`/passportview/${siblingSellerId}`)">
          <div class="lp-convert-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div class="lp-convert-body">
            <div class="lp-convert-title">Selling passport linked</div>
            <div class="lp-convert-sub">Open the seller Passport for this property — the two records stay in sync.</div>
          </div>
          <span class="lp-convert-link">Open&nbsp;→</span>
        </button>

        <!-- Tabs -->
        <div class="lp-tabs">
          <div class="lp-tabs-group">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              class="lp-tab"
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
              <span v-if="tab.count !== undefined" class="lp-tab-count">{{ tab.count }}</span>
            </button>
          </div>
          <div class="lp-tabs-complete">{{ stats.complete }} of {{ stats.total }} complete</div>
        </div>

        <!-- COMPLIANCE -->
        <div v-show="activeTab === 'compliance'">
          <template v-for="group in complianceGroups" :key="group.label">
            <div v-if="group.sections.length > 0" class="section-heading">
              <span class="section-heading-label">{{ group.label }}</span>
              <span class="section-heading-rule" />
              <span class="section-heading-count">
                {{ group.sections.length }} item{{ group.sections.length === 1 ? '' : 's' }}
              </span>
            </div>
            <div v-if="group.sections.length > 0" class="lp-sec-grid">
              <button
                v-for="section in group.sections"
                :key="section.id"
                type="button"
                class="lp-sec"
                :class="`lp-sec--${cardData(section).tone}`"
                @click="openSection(section)"
              >
                <div class="lp-sec-top">
                  <div class="lp-sec-icon" :class="iconClass(section.key)">
                    <SectionIcon :name="iconName(section.key)" />
                  </div>
                  <span class="lp-sec-arrow" aria-hidden="true">→</span>
                </div>
                <div class="lp-sec-name">{{ section.title }}</div>
                <div v-if="cardData(section).subtitleLine" class="lp-sec-sub">
                  {{ cardData(section).subtitleLine }}
                </div>
                <div class="lp-sec-pills">
                  <span class="lp-sec-pill lp-sec-pill--doc">
                    <span class="lp-sec-pill-ic">📄</span>
                    {{ cardData(section).docCount }}/{{ cardData(section).docTotal }} doc
                  </span>
                  <span class="lp-sec-pill" :class="`lp-sec-pill--${cardData(section).tone}`">
                    {{ cardData(section).statusLabel }}
                  </span>
                </div>
                <div class="lp-sec-barrow">
                  <div class="lp-sec-bar">
                    <div
                      class="lp-sec-bar-fill"
                      :class="`lp-sec-bar-fill--${cardData(section).tone}`"
                      :style="{ width: cardData(section).pct + '%' }"
                    />
                  </div>
                  <div class="lp-sec-pct" :class="{ 'lp-sec-pct--good': cardData(section).tone === 'good' }">
                    {{ cardData(section).pct }}%
                  </div>
                </div>
                <div v-if="cardData(section).actionByLabel" class="lp-sec-actionby">
                  {{ cardData(section).actionByLabel }}
                </div>
              </button>
            </div>
          </template>

          <!-- Fallback: any sections that didn't match a group bucket -->
          <template v-if="ungroupedSections.length > 0">
            <div class="section-heading">
              <span class="section-heading-label">Other</span>
              <span class="section-heading-rule" />
              <span class="section-heading-count">
                {{ ungroupedSections.length }} item{{ ungroupedSections.length === 1 ? '' : 's' }}
              </span>
            </div>
            <div class="lp-sec-grid">
              <button
                v-for="section in ungroupedSections"
                :key="section.id"
                type="button"
                class="lp-sec"
                :class="`lp-sec--${cardData(section).tone}`"
                @click="openSection(section)"
              >
                <div class="lp-sec-top">
                  <div class="lp-sec-icon" :class="iconClass(section.key)">
                    <SectionIcon :name="iconName(section.key)" />
                  </div>
                  <span class="lp-sec-arrow" aria-hidden="true">→</span>
                </div>
                <div class="lp-sec-name">{{ section.title }}</div>
                <div v-if="cardData(section).subtitleLine" class="lp-sec-sub">
                  {{ cardData(section).subtitleLine }}
                </div>
                <div class="lp-sec-pills">
                  <span class="lp-sec-pill lp-sec-pill--doc">
                    <span class="lp-sec-pill-ic">📄</span>
                    {{ cardData(section).docCount }}/{{ cardData(section).docTotal }} doc
                  </span>
                  <span class="lp-sec-pill" :class="`lp-sec-pill--${cardData(section).tone}`">
                    {{ cardData(section).statusLabel }}
                  </span>
                </div>
                <div class="lp-sec-barrow">
                  <div class="lp-sec-bar">
                    <div
                      class="lp-sec-bar-fill"
                      :class="`lp-sec-bar-fill--${cardData(section).tone}`"
                      :style="{ width: cardData(section).pct + '%' }"
                    />
                  </div>
                  <div class="lp-sec-pct" :class="{ 'lp-sec-pct--good': cardData(section).tone === 'good' }">
                    {{ cardData(section).pct }}%
                  </div>
                </div>
              </button>
            </div>
          </template>
        </div>

        <!-- VAULT -->
        <div v-show="activeTab === 'vault'">
          <div class="section-heading">
            <span class="section-heading-label">All uploaded documents</span>
            <span class="section-heading-rule" />
            <span class="section-heading-count">
              {{ uploadedDocs.length }} doc{{ uploadedDocs.length === 1 ? '' : 's' }}
            </span>
          </div>
          <div v-if="uploadedDocs.length === 0" class="lp-empty">
            No documents uploaded yet. Tap a section in the Compliance tab to upload one.
          </div>
          <div v-for="doc in uploadedDocs" :key="doc.id" class="lp-doc">
            <div class="lp-doc-icon">📄</div>
            <div class="lp-doc-info">
              <div class="lp-doc-name">{{ doc.title }}</div>
              <div class="lp-doc-meta">{{ doc.section }} · {{ doc.dateLabel }}</div>
            </div>
            <a :href="doc.url" target="_blank" rel="noopener" class="lp-doc-action">›</a>
          </div>
        </div>

        <!-- TENANCY -->
        <div v-show="activeTab === 'tenancy'">
          <div class="section-heading">
            <span class="section-heading-label">Current tenancy</span>
            <span class="section-heading-rule" />
          </div>
          <div class="lp-tenancy-card">
            <div class="lp-tenancy-row">
              <span class="lp-tenancy-lbl">Tenant</span>
              <span class="lp-tenancy-val">{{ tenancySummary.tenant || 'Add tenant from AST' }}</span>
            </div>
            <div class="lp-tenancy-row">
              <span class="lp-tenancy-lbl">Deposit</span>
              <span class="lp-tenancy-val" :class="{ ok: tenancySummary.depositOk }">{{ tenancySummary.depositLabel }}</span>
            </div>
            <div class="lp-tenancy-row">
              <span class="lp-tenancy-lbl">Right to Rent</span>
              <span class="lp-tenancy-val" :class="{ ok: tenancySummary.rtrOk }">{{ tenancySummary.rtrLabel }}</span>
            </div>
            <div class="lp-tenancy-row">
              <span class="lp-tenancy-lbl">AST</span>
              <span class="lp-tenancy-val" :class="{ ok: tenancySummary.astOk }">{{ tenancySummary.astLabel }}</span>
            </div>
          </div>

          <div v-if="tenancySections.length > 0" class="section-heading">
            <span class="section-heading-label">Documents to keep current</span>
            <span class="section-heading-rule" />
            <span class="section-heading-count">
              {{ tenancySections.length }} item{{ tenancySections.length === 1 ? '' : 's' }}
            </span>
          </div>
          <div v-if="tenancySections.length > 0" class="lp-sec-grid">
            <button
              v-for="section in tenancySections"
              :key="section.id"
              type="button"
              class="lp-sec"
              :class="`lp-sec--${cardData(section).tone}`"
              @click="openSection(section)"
            >
              <div class="lp-sec-top">
                <div class="lp-sec-icon" :class="iconClass(section.key)">
                  <SectionIcon :name="iconName(section.key)" />
                </div>
                <span class="lp-sec-arrow" aria-hidden="true">→</span>
              </div>
              <div class="lp-sec-name">{{ section.title }}</div>
              <div v-if="cardData(section).subtitleLine" class="lp-sec-sub">
                {{ cardData(section).subtitleLine }}
              </div>
              <div class="lp-sec-pills">
                <span class="lp-sec-pill lp-sec-pill--doc">
                  <span class="lp-sec-pill-ic">📄</span>
                  {{ cardData(section).docCount }}/{{ cardData(section).docTotal }} doc
                </span>
                <span class="lp-sec-pill" :class="`lp-sec-pill--${cardData(section).tone}`">
                  {{ cardData(section).statusLabel }}
                </span>
              </div>
              <div class="lp-sec-barrow">
                <div class="lp-sec-bar">
                  <div
                    class="lp-sec-bar-fill"
                    :class="`lp-sec-bar-fill--${cardData(section).tone}`"
                    :style="{ width: cardData(section).pct + '%' }"
                  />
                </div>
                <div class="lp-sec-pct" :class="{ 'lp-sec-pct--good': cardData(section).tone === 'good' }">
                  {{ cardData(section).pct }}%
                </div>
              </div>
            </button>
          </div>
        </div>
      </template>
    </main>

    <SiteFooter />


    <!-- Convert modal -->
    <Teleport to="body">
      <div v-if="showConvertModal" class="lp-overlay" @click.self="showConvertModal = false">
        <div class="lp-modal">
          <div class="lp-modal-handle" />
          <div class="lp-modal-header">
            <div class="lp-modal-title">Convert to seller passport</div>
            <button class="lp-modal-close" type="button" aria-label="Close" @click="showConvertModal = false">×</button>
          </div>
          <div class="lp-modal-body">
            <p class="lp-modal-intro">
              We'll create a separate seller passport on the same property and transfer the docs you already
              hold for letting. Both passports stay live — you can keep letting in parallel.
            </p>
            <div class="lp-modal-section">
              <div class="lp-modal-label">Will transfer</div>
              <div v-for="d in transferDocs" :key="d.label" class="lp-modal-doc">
                <div class="lp-modal-doc-tick">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div class="lp-modal-doc-name">{{ d.label }}</div>
                <div class="lp-modal-doc-meta">{{ d.meta }}</div>
              </div>
            </div>
            <div class="lp-modal-section">
              <div class="lp-modal-legal">
                Tenanted sales must disclose the tenancy to buyers under the Consumer Protection from Unfair Trading
                Regulations 2008. The AST transfers to the new owner unless vacant possession is obtained via
                Section 21 / Section 8.
              </div>
            </div>
            <p v-if="convertError" class="lp-modal-error">{{ convertError }}</p>
          </div>
          <div class="lp-modal-footer">
            <button class="btn-secondary" type="button" @click="showConvertModal = false">Cancel</button>
            <button class="btn-primary" type="button" :disabled="converting" @click="onConvertConfirm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              {{ converting ? 'Converting…' : 'Create seller passport' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Section certificate drawer -->
    <Teleport to="body">
      <div v-if="showSectionDrawer && drawerSection" class="lp-overlay" @click.self="showSectionDrawer = false">
        <div class="lp-modal">
          <div class="lp-modal-handle" />
          <div class="lp-modal-header">
            <div class="lp-modal-title">{{ drawerSection.title }}</div>
            <button class="lp-modal-close" type="button" aria-label="Close" @click="showSectionDrawer = false">×</button>
          </div>
          <div class="lp-modal-body">
            <p v-if="drawerSection.subtitle" class="lp-modal-intro">{{ drawerSection.subtitle }}</p>

            <!-- Existing document preview -->
            <div v-if="drawerFileUrl" class="lp-doc-preview">
              <div class="lp-doc-preview-icon">📄</div>
              <div class="lp-doc-preview-info">
                <div class="lp-doc-preview-name">{{ drawerDocName || 'Certificate on file' }}</div>
                <div class="lp-doc-preview-meta">
                  {{ drawerExpiryLabel ? 'Expires ' + drawerExpiryLabel : 'No expiry set' }}
                </div>
              </div>
              <button type="button" class="btn-secondary lp-doc-preview-btn" @click="downloadDrawerFile">
                View
              </button>
            </div>

            <!-- Expiring-soon banner -->
            <div v-if="drawerExpiringSoon" class="lp-warn-banner">
              <div class="lp-warn-icon">⚠</div>
              <div>
                <div class="lp-warn-title">Renewal due in {{ drawerDaysLeft }} day{{ drawerDaysLeft === 1 ? '' : 's' }}</div>
                <div class="lp-warn-meta">
                  Replace the certificate before {{ drawerExpiryLabel }} to stay compliant.
                </div>
              </div>
            </div>

            <!-- Pending file -->
            <div v-if="pendingFile" class="lp-doc-preview lp-doc-preview--pending">
              <div class="lp-doc-preview-icon">📄</div>
              <div class="lp-doc-preview-info">
                <div class="lp-doc-preview-name">{{ pendingFile.name }}</div>
                <div class="lp-doc-preview-meta">{{ pendingFileSizeLabel }} · ready to save</div>
              </div>
              <button type="button" class="btn-secondary lp-doc-preview-btn" @click="pendingFile = null">
                Change
              </button>
            </div>

            <!-- File picker -->
            <label v-else class="lp-upload-row">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                class="lp-upload-input"
                :disabled="drawerUploading"
                @change="onDrawerFilePicked"
              />
              <span class="lp-upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span class="lp-upload-text">
                {{ drawerFileUrl ? 'Replace certificate' : 'Upload certificate' }}
                <small>PDF, JPG, PNG, DOCX up to 20MB</small>
              </span>
            </label>

            <!-- Document name -->
            <div v-if="pendingFile" class="mform-section">
              <div class="mform-label">Document name</div>
              <input
                v-model="drawerDocName"
                type="text"
                class="mform-input"
                placeholder="e.g. Gas Safety 2026"
              />
            </div>

            <!-- Expiry -->
            <div v-if="drawerDateQuestion || pendingFile" class="mform-section">
              <div class="mform-label">Expiry / next renewal date</div>
              <input
                v-model="drawerExpiryDraft"
                type="date"
                class="mform-input"
                :min="todayDateStr"
              />
              <p class="lp-modal-hint">
                We'll remind you 30 days before this date so you can stay compliant.
              </p>
            </div>

            <p v-if="drawerError" class="lp-modal-error">{{ drawerError }}</p>
          </div>
          <div class="lp-modal-footer">
            <button
              v-if="pendingFile"
              class="btn-secondary"
              type="button"
              :disabled="drawerUploading"
              @click="pendingFile = null"
            >
              Cancel
            </button>
            <button
              v-if="pendingFile"
              class="btn-primary"
              type="button"
              :disabled="drawerUploading"
              @click="saveDrawerForm"
            >
              {{ drawerUploading ? 'Saving…' : 'Save certificate' }}
            </button>
            <button v-else class="btn-primary" type="button" style="flex: 1;" @click="showSectionDrawer = false">
              Done
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Tenant share modal -->
    <Teleport to="body">
      <div v-if="showTenantShare" class="lp-overlay" @click.self="showTenantShare = false">
        <div class="lp-modal">
          <div class="lp-modal-handle" />
          <div class="lp-modal-header">
            <div class="lp-modal-title">Share with your tenant</div>
            <button class="lp-modal-close" type="button" aria-label="Close" @click="showTenantShare = false">×</button>
          </div>
          <div class="lp-modal-body">
            <p class="lp-modal-intro">
              A 3-hour read-only link. The tenant sees only the documents they're entitled to —
              AST, deposit certificate, How-to-Rent, Right-to-Rent confirmation, gas / EICR / EPC.
            </p>
            <div v-if="!tenantShareUrl" class="lp-share-empty">Tap "Generate link" to create one.</div>
            <div v-else class="lp-share-link">
              <input :value="tenantShareUrl" readonly class="lp-share-input" />
              <button class="btn-secondary lp-share-copy" type="button" @click="copyTenantShare">
                {{ tenantShareCopied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p v-if="tenantShareError" class="lp-modal-error">{{ tenantShareError }}</p>
          </div>
          <div class="lp-modal-footer">
            <button class="btn-secondary" type="button" @click="showTenantShare = false">Close</button>
            <button
              class="btn-primary"
              type="button"
              :disabled="generatingTenantShare"
              @click="generateTenantShare"
            >
              {{ generatingTenantShare ? 'Generating…' : (tenantShareUrl ? 'Refresh link' : 'Generate link') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePassportClaim } from '~/composables/usePassportClaim'
import PassportCard from '~/components/passport-view/PassportCard.vue'
import SectionIcon from '~/components/passport-view/SectionIcon.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ title: 'Landlord Passport — UmovingU', middleware: 'auth' })

const route = useRoute()
const config = useRuntimeConfig()
const { convertLandlordToSeller } = usePassportClaim()

const passportId = computed(() => String(route.params.id))

const loading = ref(true)
const passport = ref<any>(null)
const sections = ref<any[]>([])
const siblingSellerId = ref<string | null>(null)

const activeTab = ref<'compliance' | 'vault' | 'tenancy'>('compliance')

const showConvertModal = ref(false)
const converting = ref(false)
const convertError = ref('')

const showTenantShare = ref(false)
const tenantShareUrl = ref('')
const tenantShareError = ref('')
const tenantShareCopied = ref(false)
const generatingTenantShare = ref(false)

async function loadPassport() {
  loading.value = true
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const data = await $fetch<any>(
      `${config.public.apiBase}/passport/${passportId.value}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    passport.value = data
    // Defensive filter — only render landlord-prefixed sections regardless
    // of what the backend sent. Older landlord passports created before the
    // server-side prefix filter was added still carry seller sections in
    // the DB; dropping them here keeps the UI clean for those legacy
    // passports without needing a destructive cleanup.
    const allSections = (data?.sections ?? [])
      .slice()
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    sections.value = allSections.filter((s: any) =>
      typeof s.key === 'string' && s.key.startsWith('landlord_'),
    )
    siblingSellerId.value = (data?.convertedTo?.[0]?.id as string) ?? null

    console.log('[landlord] all keys:', allSections.map((s: any) => s.key))
    console.log('[landlord] kept (landlord_*):', sections.value.map((s) => s.key))
    if (sections.value.length === 0 && allSections.length > 0) {
      console.warn(
        '[landlord] This passport has no landlord_* sections — it was likely created before the seed/service fix. Delete it and claim a fresh landlord passport.',
      )
    }
  } catch (err: any) {
    convertError.value = err?.data?.message ?? 'Could not load passport'
  } finally {
    loading.value = false
  }
}

// ── Section grouping (key-substring based, falls back gracefully) ────────
const SAFETY_HINTS = ['gas', 'eicr', 'electric', 'epc', 'energy', 'alarm', 'smoke', 'co_', 'legionella']
const TENANCY_HINTS = ['ast', 'tenancy', 'deposit', 'rent', 'right_to_rent', 'rtr', 'how_to_rent', 'inventory', 'occup']
const INSURANCE_HINTS = ['insurance', 'pat', 'hmo']

function isSafety(k: string)    { return SAFETY_HINTS.some((h) => k.toLowerCase().includes(h)) }
function isTenancy(k: string)   { return TENANCY_HINTS.some((h) => k.toLowerCase().includes(h)) }
function isInsurance(k: string) { return INSURANCE_HINTS.some((h) => k.toLowerCase().includes(h)) }

const safetySections    = computed(() => sections.value.filter((s) => isSafety(s.key)))
const tenancySections   = computed(() => sections.value.filter((s) => isTenancy(s.key)))
const insuranceSections = computed(() => sections.value.filter((s) => isInsurance(s.key) && !isTenancy(s.key) && !isSafety(s.key)))
const ungroupedSections = computed(() =>
  sections.value.filter((s) => !isSafety(s.key) && !isTenancy(s.key) && !isInsurance(s.key)),
)

const complianceGroups = computed(() => [
  { label: 'Statutory — annual / 5-yearly', sections: safetySections.value },
  { label: 'Tenancy & deposit', sections: tenancySections.value },
  { label: 'Insurance & HMO', sections: insuranceSections.value },
])

// ── Stats ─────────────────────────────────────────────────────────
const docCount = computed(() => uploadedDocs.value.length)

const stats = computed(() => {
  const total = sections.value.length
  let complete = 0
  let valid = 0
  let expiringSoon = 0
  const now = Date.now()
  const SOON = 30 * 24 * 60 * 60 * 1000
  for (const s of sections.value) {
    const cd = cardData(s)
    if (cd.tone === 'good') complete++
    if (cd.tone === 'good') valid++
    const tasks = (s.tasks ?? []) as any[]
    for (const t of tasks) {
      for (const q of t.passportQuestions ?? []) {
        const v = q.answer?.answerText ?? q.answer?.value
        if (typeof v === 'string' && /\d{4}-\d{2}-\d{2}/.test(v)) {
          const ts = new Date(v).getTime()
          if (ts > now && ts - now < SOON) expiringSoon++
        }
      }
    }
  }
  return { total, complete, valid, expiringSoon }
})

const progressPct = computed(() =>
  stats.value.total === 0 ? 0 : Math.round((stats.value.complete / stats.value.total) * 100),
)

const firstExpiring = computed(() => {
  if (stats.value.expiringSoon === 0) return ''
  return `${stats.value.expiringSoon} doc${stats.value.expiringSoon === 1 ? '' : 's'} expiring in the next 30 days`
})

const tabs = computed(() => [
  { label: 'Compliance', value: 'compliance', count: stats.value.total },
  { label: 'Vault', value: 'vault', count: docCount.value },
  { label: 'Tenancy', value: 'tenancy', count: undefined },
])

const uploadedDocs = computed(() => {
  const out: any[] = []
  for (const s of sections.value) {
    for (const t of s.tasks ?? []) {
      for (const q of t.passportQuestions ?? []) {
        const a = q.answer
        if (!a) continue
        const file = a.fileUrl ?? a.answerJson?.fileUrl ?? a.url ?? null
        if (!file) continue
        const fileName = a.answerJson?.fileName ?? q.questionTemplate?.title ?? 'Document'
        out.push({
          id: q.id,
          title: fileName,
          section: s.title ?? s.key,
          url: file.startsWith('/') ? `${config.public.apiBase}${file}` : file,
          dateLabel: a.updatedAt
            ? new Date(a.updatedAt).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric',
              })
            : '',
        })
      }
    }
  }
  return out.sort((a, b) => (a.dateLabel < b.dateLabel ? 1 : -1))
})

const tenancySummary = computed(() => {
  const findByHint = (hints: string[]) =>
    sections.value.find((s) => hints.some((h) => s.key.toLowerCase().includes(h)))
  const ast = findByHint(['ast', 'tenancy_agreement'])
  const deposit = findByHint(['deposit'])
  const rtr = findByHint(['right_to_rent', 'rtr'])

  return {
    tenant: '',
    depositOk: deposit?.status === 'COMPLETED',
    depositLabel: deposit?.status === 'COMPLETED' ? '✓ Protected' : 'Add certificate',
    rtrOk: rtr?.status === 'COMPLETED',
    rtrLabel: rtr?.status === 'COMPLETED' ? '✓ Verified' : 'Add evidence',
    astOk: ast?.status === 'COMPLETED',
    astLabel: ast?.status === 'COMPLETED' ? 'Signed' : 'Upload AST',
  }
})

const hasSellerSibling = computed(() => !!siblingSellerId.value)

const transferDocs = [
  { label: 'Gas Safety Certificate (CP12)', meta: 'transferring' },
  { label: 'EICR Report', meta: 'transferring' },
  { label: 'EPC Certificate', meta: 'transferring' },
  { label: 'Smoke & CO Alarm record', meta: 'transferring' },
  { label: 'Buildings insurance schedule', meta: 'transferring' },
  { label: 'Tenant disclosure data', meta: 'from AST' },
]

// Maps a section key to a real line-icon name (see SectionIcon.vue).
function iconName(key: string): string {
  const k = key.toLowerCase()
  if (k.includes('gas')) return 'flame'
  if (k.includes('eicr') || k.includes('electric')) return 'zap'
  if (k.includes('epc') || k.includes('energy')) return 'leaf'
  if (k.includes('alarm') || k.includes('smoke')) return 'bell'
  if (k.includes('legionella')) return 'droplet'
  if (k.includes('insurance')) return 'shield'
  if (k.includes('deposit')) return 'pound'
  if (k.includes('right_to_rent') || k.includes('rtr')) return 'id'
  if (k.includes('ast') || k.includes('tenancy')) return 'contract'
  if (k.includes('how_to_rent')) return 'book'
  if (k.includes('inventory')) return 'clipboard'
  if (k.includes('pat')) return 'plug'
  if (k.includes('hmo')) return 'building'
  return 'file'
}

// Soft category tint for the section-card icon tile (mirrors the design mock).
function iconClass(key: string): string {
  const k = key.toLowerCase()
  if (k.includes('gas')) return 'ic-amber'
  if (k.includes('eicr') || k.includes('electric')) return 'ic-blue'
  if (k.includes('epc') || k.includes('energy')) return 'ic-green'
  if (k.includes('alarm') || k.includes('smoke')) return 'ic-rose'
  if (k.includes('legionella')) return 'ic-sky'
  if (k.includes('insurance')) return 'ic-rose'
  if (k.includes('deposit')) return 'ic-teal'
  if (k.includes('right_to_rent') || k.includes('rtr')) return 'ic-indigo'
  if (k.includes('ast') || k.includes('tenancy')) return 'ic-violet'
  if (k.includes('how_to_rent')) return 'ic-amber'
  if (k.includes('inventory')) return 'ic-violet'
  if (k.includes('hmo')) return 'ic-teal'
  return 'ic-teal'
}

// Location line under the hero address (falls back to the postcode alone).
const heroLocation = computed(() => {
  const p = passport.value
  if (!p) return ''
  const town = p.town ?? p.city ?? p.addressLine2 ?? ''
  return town ? `${town} · ${p.postcode}` : (p.postcode ?? '')
})

// Hero "Upload a certificate" — jump to Compliance and open the first
// section that still needs a document.
function openFirstUpload() {
  activeTab.value = 'compliance'
  const target =
    sections.value.find((s) => cardData(s).tone !== 'good') ?? sections.value[0]
  if (target) openSection(target)
}

// ── Section drawer (upload / view / replace certificate) ───────
const drawerSection = ref<any>(null)
const showSectionDrawer = ref(false)
const drawerError = ref('')
const drawerUploading = ref(false)
const drawerSavingDate = ref(false)
const pendingFile = ref<File | null>(null)
const drawerDocName = ref('')
const drawerExpiryDraft = ref('')

const todayDateStr = computed(() => new Date().toISOString().slice(0, 10))

const pendingFileSizeLabel = computed(() => {
  const f = pendingFile.value
  if (!f) return ''
  if (f.size >= 1024 * 1024) return `${(f.size / 1024 / 1024).toFixed(1)}MB`
  if (f.size >= 1024) return `${Math.round(f.size / 1024)}KB`
  return `${f.size}B`
})

const drawerExpiringSoon = computed(() => {
  if (!drawerExpiry.value) return false
  const ts = new Date(drawerExpiry.value).getTime()
  const now = Date.now()
  return ts > now && ts - now < 30 * 24 * 60 * 60 * 1000
})

const drawerDaysLeft = computed(() => {
  if (!drawerExpiry.value) return 0
  const ts = new Date(drawerExpiry.value).getTime()
  return Math.max(0, Math.round((ts - Date.now()) / (24 * 60 * 60 * 1000)))
})

const drawerUploadQuestion = computed(() => {
  if (!drawerSection.value) return null
  for (const t of drawerSection.value.tasks ?? []) {
    for (const q of t.passportQuestions ?? []) {
      if (q.questionTemplate?.type === 'UPLOAD') return q
    }
  }
  return null
})
const drawerDateQuestion = computed(() => {
  if (!drawerSection.value) return null
  for (const t of drawerSection.value.tasks ?? []) {
    for (const q of t.passportQuestions ?? []) {
      if (q.questionTemplate?.type === 'DATE') return q
    }
  }
  return null
})
const drawerFileUrl = computed(() => {
  const q: any = drawerUploadQuestion.value
  const a = q?.answer
  const f = a?.fileUrl ?? a?.answerJson?.fileUrl ?? a?.url ?? null
  if (!f) return null
  return f.startsWith('/') ? `${config.public.apiBase}${f}` : f
})
const drawerExpiry = computed(() => {
  const q: any = drawerDateQuestion.value
  // Date answers are stored in answerText (the answerQuestion service
  // routes plain string values that aren't URLs into answerText).
  const v = q?.answer?.answerText ?? q?.answer?.value
  return typeof v === 'string' ? v.slice(0, 10) : ''
})
const drawerExpiryLabel = computed(() => {
  if (!drawerExpiry.value) return ''
  const d = new Date(drawerExpiry.value)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

function openSection(s: any) {
  if (!s) return
  drawerSection.value = s
  drawerError.value = ''
  pendingFile.value = null
  drawerDocName.value = ''
  drawerExpiryDraft.value = drawerExpiry.value || ''
  showSectionDrawer.value = true
}

function onDrawerFilePicked(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  pendingFile.value = file
  if (!drawerDocName.value) {
    drawerDocName.value = file.name.replace(/\.[^.]+$/, '')
  }
  ;(e.target as HTMLInputElement).value = ''
}

async function saveDrawerForm() {
  if (!pendingFile.value) return
  const q = drawerUploadQuestion.value
  if (!q) {
    drawerError.value =
      'No upload slot found for this section — this passport was created before the latest fix. Re-claim a fresh landlord passport.'
    return
  }
  drawerUploading.value = true
  drawerError.value = ''
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const fd = new FormData()
    fd.append('file', pendingFile.value)
    if (drawerDocName.value) fd.append('name', drawerDocName.value)
    await $fetch(`${config.public.apiBase}/questions/${q.id}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    })

    // Save expiry date (if provided and a DATE question exists on this section)
    if (drawerExpiryDraft.value && drawerDateQuestion.value) {
      await $fetch(`${config.public.apiBase}/questions/${drawerDateQuestion.value.id}/answer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { value: drawerExpiryDraft.value },
      })
    }

    pendingFile.value = null
    await loadPassport()
    if (drawerSection.value) {
      drawerSection.value =
        sections.value.find((s) => s.id === drawerSection.value.id) ?? drawerSection.value
    }
  } catch (err: any) {
    drawerError.value = err?.data?.message ?? 'Save failed'
  } finally {
    drawerUploading.value = false
  }
}

function downloadDrawerFile() {
  if (!drawerFileUrl.value) return
  window.open(drawerFileUrl.value, '_blank', 'noopener')
}

async function onConvertConfirm() {
  converting.value = true
  convertError.value = ''
  try {
    const result = await convertLandlordToSeller(passportId.value)
    showConvertModal.value = false
    siblingSellerId.value = result.passportId
    navigateTo(`/passportview/${result.passportId}`)
  } catch (err: any) {
    convertError.value = err?.data?.message ?? err?.message ?? 'Conversion failed'
  } finally {
    converting.value = false
  }
}

function openTenantShare() {
  showTenantShare.value = true
  tenantShareCopied.value = false
}

async function generateTenantShare() {
  generatingTenantShare.value = true
  tenantShareError.value = ''
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const result = await $fetch<{ url: string }>(
      `${config.public.apiBase}/passport/${passportId.value}/share`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { scope: 'tenant' },
      },
    )
    tenantShareUrl.value = result.url
  } catch (err: any) {
    tenantShareError.value = err?.data?.message ?? 'Could not generate link'
  } finally {
    generatingTenantShare.value = false
  }
}

async function copyTenantShare() {
  try {
    await navigator.clipboard.writeText(tenantShareUrl.value)
    tenantShareCopied.value = true
    setTimeout(() => (tenantShareCopied.value = false), 1800)
  } catch {
    /* ignore */
  }
}

const goBack = useGoBack('/profile')

onMounted(loadPassport)

// Per-section view-model used by the inline template card.
function cardData(section: any) {
  const tasks: any[] = section?.tasks ?? []
  let docCount = 0
  let docTotal = 0
  let earliestExpiry: Date | null = null
  const now = Date.now()

  for (const t of tasks) {
    const qs = (t.passportQuestions ?? []) as any[]
    for (const q of qs) {
      const isUpload =
        q.questionTemplate?.type === 'UPLOAD' ||
        !!(q.answer?.fileUrl ?? q.answer?.answerJson?.fileUrl ?? q.answer?.url)
      if (isUpload) {
        docTotal++
        const file = q.answer?.fileUrl ?? q.answer?.answerJson?.fileUrl ?? q.answer?.url
        if (file) docCount++
      }
      const v = q.answer?.answerText ?? q.answer?.value
      if (typeof v === 'string' && /\d{4}-\d{2}-\d{2}/.test(v)) {
        const ts = new Date(v)
        if (ts.getTime() > now && (!earliestExpiry || ts < earliestExpiry)) {
          earliestExpiry = ts
        }
      }
    }
  }
  if (docTotal === 0) docTotal = 1

  const SOON = 30 * 24 * 60 * 60 * 1000
  const isExpiringSoon =
    earliestExpiry !== null && earliestExpiry.getTime() - now < SOON

  let tone: 'good' | 'warn' | 'pending' = 'pending'
  let statusLabel = 'Pending'
  let actionByLabel = ''
  let subtitleLine = section?.subtitle ?? ''

  const allDocsUploaded = docTotal > 0 && docCount === docTotal
  if ((section?.status === 'COMPLETED' || allDocsUploaded) && !isExpiringSoon) {
    tone = 'good'
    statusLabel = '✓ Satisfactory'
    if (earliestExpiry) {
      subtitleLine = `Valid to ${earliestExpiry.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      })}`
    }
  } else if (isExpiringSoon) {
    tone = 'warn'
    const daysLeft = Math.max(
      0,
      Math.round((earliestExpiry!.getTime() - now) / (24 * 60 * 60 * 1000)),
    )
    statusLabel = '⚠ Renew soon'
    actionByLabel = `Action by ${earliestExpiry!.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })}`
    subtitleLine = `Renewal due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`
  } else if (docCount > 0) {
    tone = 'warn'
    statusLabel = 'In progress'
  }

  const pct = docTotal === 0 ? 0 : Math.round((docCount / docTotal) * 100)

  return { tone, statusLabel, actionByLabel, subtitleLine, docCount, docTotal, pct }
}

// Stub kept for backward compatibility with old refs to <SectionCard />.
const SectionCard = defineComponent({
  props: {
    section: { type: Object, required: true },
    icon: { type: String, default: '📄' },
  },
  emits: ['click'],
  setup(props: any, { emit }: any) {
    const data = computed(() => {
      const s = props.section
      const tasks: any[] = s?.tasks ?? []
      let docCount = 0
      let docTotal = 0
      let earliestExpiry: Date | null = null
      const now = Date.now()

      for (const t of tasks) {
        const qs = (t.passportQuestions ?? []) as any[]
        for (const q of qs) {
          const isUpload =
            q.questionTemplate?.type === 'UPLOAD' ||
            !!(q.answer?.fileUrl ?? q.answer?.value?.fileUrl ?? q.answer?.url)
          if (isUpload) {
            docTotal++
            const file = q.answer?.fileUrl ?? q.answer?.value?.fileUrl ?? q.answer?.url
            if (file) docCount++
          }
          // Date answers act as expiry signals for compliance sections.
          const v = q.answer?.value
          if (typeof v === 'string' && /\d{4}-\d{2}-\d{2}/.test(v)) {
            const ts = new Date(v)
            if (ts.getTime() > now && (!earliestExpiry || ts < earliestExpiry)) {
              earliestExpiry = ts
            }
          }
        }
      }
      // Always show at least 1 doc target so the "1/1 doc" pill renders even
      // before any UPLOAD answers exist on the section.
      if (docTotal === 0) docTotal = 1

      const SOON = 30 * 24 * 60 * 60 * 1000
      const isExpiringSoon =
        earliestExpiry !== null && earliestExpiry.getTime() - now < SOON

      let tone: 'good' | 'warn' | 'pending' = 'pending'
      let statusLabel = 'Pending'
      let actionByLabel = ''
      if (s?.status === 'COMPLETED' && !isExpiringSoon) {
        tone = 'good'
        statusLabel = '✓ Satisfactory'
      } else if (isExpiringSoon) {
        tone = 'warn'
        statusLabel = '⚠ Renew soon'
        actionByLabel = `Action by ${earliestExpiry!.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        })}`
      } else if (docCount > 0) {
        tone = 'warn'
        statusLabel = 'In progress'
      }

      const pct = docTotal === 0 ? 0 : Math.round((docCount / docTotal) * 100)

      return {
        tone,
        statusLabel,
        actionByLabel,
        docCount,
        docTotal,
        pct,
      }
    })

    return () =>
      h(
        'button',
        {
          class: ['lp-sec', `lp-sec--${data.value.tone}`],
          type: 'button',
          onClick: () => emit('click'),
        },
        [
          h('div', { class: ['lp-sec-icon', `lp-sec-icon--${data.value.tone}`] }, props.icon),
          h('div', { class: 'lp-sec-content' }, [
            h('div', { class: 'lp-sec-row-top' }, [
              h('div', [
                h('div', { class: 'lp-sec-name' }, props.section.title),
                h('div', { class: 'lp-sec-sub' }, props.section.subtitle ?? ''),
                h('div', { class: 'lp-sec-pills' }, [
                  h('span', { class: 'lp-sec-pill lp-sec-pill--doc' }, [
                    h('span', { class: 'lp-sec-pill-ic' }, '📄'),
                    `${data.value.docCount}/${data.value.docTotal} doc`,
                  ]),
                  h(
                    'span',
                    { class: ['lp-sec-pill', `lp-sec-pill--${data.value.tone}`] },
                    data.value.statusLabel,
                  ),
                ]),
              ]),
              h('span', { class: 'lp-sec-chev' }, '›'),
            ]),
            h('div', { class: 'lp-sec-bar' }, [
              h('div', {
                class: ['lp-sec-bar-fill', `lp-sec-bar-fill--${data.value.tone}`],
                style: { width: data.value.pct + '%' },
              }),
            ]),
            data.value.actionByLabel
              ? h('div', { class: 'lp-sec-actionby' }, data.value.actionByLabel)
              : data.value.tone === 'good'
                ? h('div', { class: 'lp-sec-pct lp-sec-pct--good' }, '100%')
                : data.value.docCount > 0
                  ? h('div', { class: 'lp-sec-pct' }, `${data.value.pct}%`)
                  : null,
          ]),
        ],
      )
  },
})
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.lp-page {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #0e2840;
  position: relative;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
}

.lp-ambient,
.lp-mesh {
  display: none;
  pointer-events: none;
  position: fixed;
}

.lp-ambient {
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.16;
}

.lp-ambient-a {
  width: 300px;
  height: 300px;
  left: -100px;
  top: 120px;
  background: #00a19a;
}

.lp-ambient-b {
  width: 320px;
  height: 320px;
  right: -120px;
  top: 160px;
  background: #5a4cf0;
}

.lp-mesh {
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

.hsw-cta:hover:not(:disabled) {
  transform: translateY(-1px);
}

.hsw-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Page head ────────────────────────────────────────────────────── */
.lpw-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 30px 0 6px;
}

.lpw-head-text {
  min-width: 0;
}

.lpw-kicker {
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

.lpw-kicker-dot {
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: #00a19a;
}

.lpw-accent {
  color: #00a19a;
}

.lpw-head h1 {
  margin: 0;
  color: #231d45;
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
}

.lpw-lede {
  margin: 14px 0 0;
  max-width: 460px;
  color: #5b6d89;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
}

.lpw-head-house {
  width: clamp(150px, 20vw, 220px);
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: -6px;
  filter: drop-shadow(0 24px 36px rgba(31, 61, 98, 0.16));
  pointer-events: none;
  user-select: none;
}

.lp-mobile-nav {
  display: none;
}

/* ── Content column ───────────────────────────────────────────────── */
.lp-body {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding-bottom: 48px;
}
.atm-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 320px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.teal {
  background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(31, 122, 102, 0.18), transparent 65%);
}

.lp-loading { padding: 60px 22px; text-align: center; color: #8a95a0; font-weight: 600; position: relative; z-index: 1; }

/* ── Premium hero — dark live-record dashboard ──────────────── */
.pp-hero {
  display: grid;
  grid-template-columns: 172px 1fr auto;
  gap: 32px;
  padding: 30px 34px;
  position: relative;
  z-index: 1;
  align-items: center;
  color: #fff;
  background:
    radial-gradient(ellipse 70% 120% at 88% -10%, rgba(0, 161, 154, 0.22), transparent 55%),
    radial-gradient(ellipse 60% 90% at 8% 110%, rgba(90, 76, 240, 0.18), transparent 55%),
    linear-gradient(150deg, #172654 0%, #111c40 52%, #0c1531 100%);
  border: 1px solid rgba(120, 140, 195, 0.2);
  border-radius: 26px;
  margin: 18px 0 18px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(11, 20, 48, 0.34);
}

/* Teal passport booklet — shared PassportCard image (matches seller passport) */
.pp-hero-book {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 172px;
  justify-self: center;
  flex-shrink: 0;
  filter: drop-shadow(0 20px 36px rgba(0, 140, 134, 0.42));
}
/* Render the book at its natural aspect ratio so the baked-in layout and the
   overlaid address stay aligned. */
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

/* Main info column */
.pp-hero-main {
  position: relative;
  z-index: 1;
  min-width: 0;
}
.pp-hero-eyebrow {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #4fd6bf;
}
.pp-hero-addr {
  margin: 8px 0 4px;
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.06;
  color: #fff;
}
.pp-hero-loc {
  font-size: 13px;
  font-weight: 700;
  color: #93a4c9;
}
.pp-hero-stats {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 20px 0 22px;
}
.pp-hero-stat {
  padding: 0 24px;
}
.pp-hero-stat:first-child { padding-left: 0; }
.pp-hero-stat + .pp-hero-stat { border-left: 1px solid rgba(255, 255, 255, 0.12); }
.pp-hero-stat-val {
  font-size: 27px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  font-feature-settings: 'tnum';
  line-height: 1;
}
.pp-hero-stat-val small { font-size: 14px; color: #93a4c9; font-weight: 800; }
.pp-hero-stat-of { font-size: 15px; color: #6f83aa; font-weight: 800; }
.pp-hero-stat-lbl {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7f93bb;
  margin-top: 8px;
}
.pp-hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.pp-hero-btn {
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.16s, background 0.16s, border-color 0.16s;
}
.pp-hero-btn svg { width: 16px; height: 16px; }
.pp-hero-btn--primary {
  border: 0;
  color: #fff;
  background: linear-gradient(180deg, #2fbfa4, #1f9e88);
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.36);
}
.pp-hero-btn--primary:hover { transform: translateY(-1px); }
.pp-hero-btn--ghost {
  background: rgba(255, 255, 255, 0.07);
  color: #dbe4f4;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.pp-hero-btn--ghost:hover { background: rgba(255, 255, 255, 0.13); border-color: rgba(255, 255, 255, 0.32); }

/* Ring + status column */
.pp-hero-side {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.pp-hero-ring {
  position: relative;
  width: 122px;
  height: 122px;
  flex-shrink: 0;
}
.pp-hero-ring-svg {
  width: 122px;
  height: 122px;
  display: block;
}
.pp-hero-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.13);
  stroke-width: 5.5;
}
.pp-hero-ring-fill {
  fill: none;
  stroke: #34d3b4;
  stroke-width: 5.5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  filter: drop-shadow(0 0 6px rgba(52, 211, 180, 0.5));
  transition: stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.pp-hero-ring-pct {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 26px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
}
.pp-hero-side-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7f93bb;
}
.pp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.1px;
  color: #4fd6bf;
  background: rgba(52, 211, 180, 0.12);
  border: 1px solid rgba(52, 211, 180, 0.3);
  padding: 5px 11px;
  border-radius: 100px;
}
.pp-hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #34d3b4; }
.pp-hero-badge--warn {
  color: #ffb27a;
  background: rgba(255, 139, 90, 0.14);
  border-color: rgba(255, 139, 90, 0.34);
}
.pp-hero-badge--warn .pp-hero-badge-dot { background: #ff8b5a; }

/* Convert / linked banner */
.lp-convert-card {
  width: calc(100% - 44px);
  margin: 4px 22px 18px;
  background:
    radial-gradient(ellipse 80% 120% at 12% 20%, rgba(255, 255, 255, 0.22), transparent 60%),
    linear-gradient(135deg, #00a19a, #1f7a66);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  position: relative;
  z-index: 1;
  color: #fff;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.28);
  transition: transform 0.16s, box-shadow 0.16s;
}
.lp-convert-card:hover { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(0, 161, 154, 0.34); }
.lp-convert-card--linked {
  background: linear-gradient(135deg, #eefaf3, #dff2ea);
  border: 1px solid rgba(31, 122, 102, 0.28);
  color: #0e2840;
  box-shadow: none;
}
.lp-convert-card--linked:hover { box-shadow: 0 8px 20px rgba(31, 122, 102, 0.14); }
.lp-convert-icon {
  width: 42px; height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-convert-card--linked .lp-convert-icon {
  background: linear-gradient(150deg, #2fb39a, #1f8f7d);
  color: #fff;
  box-shadow: 0 6px 14px rgba(31, 122, 102, 0.3);
}
.lp-convert-icon svg { width: 20px; height: 20px; }
.lp-convert-body { flex: 1; min-width: 0; }
.lp-convert-title { font-size: 15px; font-weight: 800; letter-spacing: -0.3px; }
.lp-convert-card--linked .lp-convert-title { color: #1f7a66; }
.lp-convert-sub { font-size: 12px; font-weight: 600; opacity: 0.9; margin-top: 3px; line-height: 1.4; }
.lp-convert-card--linked .lp-convert-sub { color: #4a5868; opacity: 1; }
.lp-convert-link {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  white-space: nowrap;
}
.lp-convert-card--linked .lp-convert-link { color: #1f7a66; }

/* Tabs */
.lp-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 22px 16px;
  position: relative;
  z-index: 1;
}
.lp-tabs-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #e5e9e8;
  border-radius: 100px;
  padding: 4px;
  box-shadow: 0 1px 2px rgba(14, 40, 64, 0.04);
}
.lp-tab {
  background: transparent;
  border: 0;
  border-radius: 100px;
  padding: 8px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: #4a5868;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.16s, color 0.16s;
}
.lp-tab:hover:not(.active) { color: #0e2840; }
.lp-tab.active {
  background: #14224a;
  color: #fff;
}
.lp-tab-count {
  font-size: 10.5px;
  font-weight: 800;
  min-width: 18px;
  padding: 1px 6px;
  border-radius: 100px;
  font-feature-settings: 'tnum';
  background: #eef0ef;
  color: #4a5868;
}
.lp-tab.active .lp-tab-count { background: #2fbfa4; color: #062b25; }
.lp-tabs-complete {
  font-size: 12px;
  font-weight: 800;
  color: #4a5868;
  letter-spacing: -0.2px;
  background: #fff;
  border: 1px solid #e5e9e8;
  border-radius: 100px;
  padding: 8px 14px;
  font-feature-settings: 'tnum';
  white-space: nowrap;
}

/* Section heading */
.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 22px 10px;
  position: relative;
  z-index: 1;
}
.section-heading-dash {
  width: 20px;
  height: 2px;
  border-radius: 2px;
  background: #2fb39a;
  flex-shrink: 0;
}
.section-heading-label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #56657c;
  white-space: nowrap;
}
.section-heading-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(14, 40, 64, 0.1), transparent);
}
.section-heading-count {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  color: #9aa6b6;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Grid wrapper — lays the compliance section cards out in columns so the
   landlord view scrolls far less on wide screens. */
.lp-sec-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0 22px;
  margin-bottom: 12px;
  align-items: start;
  position: relative;
  z-index: 1;
}
.lp-sec-grid .lp-sec {
  width: 100%;
  margin: 0;
}

/* Section card — vertical layout (icon + arrow row → title → pills → bar) */
.lp-sec {
  width: 100%;
  margin: 0;
  background: #fff;
  border: 1px solid #eceeed;
  border-radius: 20px;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  position: relative;
  z-index: 1;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  box-shadow: 0 1px 2px rgba(14, 40, 64, 0.04);
}
.lp-sec:hover {
  transform: translateY(-2px);
  border-color: #dfe3e2;
  box-shadow: 0 12px 26px rgba(14, 40, 64, 0.09);
}

.lp-sec-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}
.lp-sec-icon {
  width: 46px; height: 46px;
  border-radius: 13px;
  background: #f1f5f4;
  color: #56657c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-sec-icon svg { width: 23px; height: 23px; display: block; }
/* Category tint (tile) + accent (line-icon colour via currentColor) */
.lp-sec-icon.ic-amber  { background: #fdf1d8; color: #c07a10; }
.lp-sec-icon.ic-blue   { background: #e2edfb; color: #2563c9; }
.lp-sec-icon.ic-green  { background: #dcf3e7; color: #1f9a6b; }
.lp-sec-icon.ic-rose   { background: #fce4ea; color: #cf4d7d; }
.lp-sec-icon.ic-sky    { background: #e0f0fb; color: #1f8bd0; }
.lp-sec-icon.ic-violet { background: #ebe6fb; color: #6d4bd0; }
.lp-sec-icon.ic-indigo { background: #e5e8fc; color: #4f5bd5; }
.lp-sec-icon.ic-teal   { background: #d9f2eb; color: #1f8f7d; }

.lp-sec-arrow {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1px solid #e8eceb;
  color: #9aa6b6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.lp-sec:hover .lp-sec-arrow {
  background: #14224a;
  border-color: #14224a;
  color: #fff;
}

.lp-sec-name {
  font-size: 15px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -0.3px;
  line-height: 1.25;
}
.lp-sec-sub {
  font-size: 12px;
  font-weight: 600;
  color: #74839a;
  margin-top: 3px;
  line-height: 1.4;
}

.lp-sec-pills {
  display: flex;
  gap: 6px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.lp-sec-pill {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: -0.1px;
  padding: 4px 10px;
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.lp-sec-pill--doc { background: #f0f2f1; color: #56657c; }
.lp-sec-pill-ic { font-size: 10px; }
.lp-sec-pill--good { background: #d6efe2; color: #1f7a66; }
.lp-sec-pill--warn { background: #fdefc7; color: #92650e; }
.lp-sec-pill--pending { background: #fcefdc; color: #a9701f; }

.lp-sec-barrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.lp-sec-bar {
  flex: 1;
  height: 5px;
  background: #eef0ef;
  border-radius: 100px;
  overflow: hidden;
}
.lp-sec-bar-fill {
  height: 100%;
  border-radius: 100px;
  min-width: 5px;
  transition: width 0.3s ease;
}
.lp-sec-bar-fill--good { background: linear-gradient(90deg, #3dbda3, #1f7a66); }
.lp-sec-bar-fill--warn { background: linear-gradient(90deg, #f5c44c, #d4a659); }
.lp-sec-bar-fill--pending { background: #2fb39a; }

.lp-sec-pct {
  font-size: 11.5px;
  font-weight: 800;
  color: #74839a;
  letter-spacing: -0.1px;
  font-feature-settings: 'tnum';
  flex-shrink: 0;
  min-width: 30px;
  text-align: right;
}
.lp-sec-pct--good { color: #1f7a66; }

.lp-sec-actionby {
  font-size: 11px;
  font-weight: 800;
  color: #b85b36;
  margin-top: 8px;
  letter-spacing: -0.1px;
}

/* Vault */
.lp-doc {
  margin: 0 22px 6px;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.lp-doc-icon {
  width: 34px; height: 38px;
  border-radius: 6px;
  background: linear-gradient(135deg, #fdf4dc, #f8e6c2);
  color: #6f4d14;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-doc-info { flex: 1; min-width: 0; }
.lp-doc-name {
  font-size: 12.5px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lp-doc-meta { font-size: 10px; font-weight: 600; color: #8a95a0; margin-top: 1px; }
.lp-doc-action { color: #8a95a0; font-size: 16px; flex-shrink: 0; text-decoration: none; }

.lp-empty {
  margin: 0 22px;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #4a5868;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Tenancy */
.lp-tenancy-card {
  margin: 0 22px 8px;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 14px;
  padding: 12px 14px;
  position: relative;
  z-index: 1;
}
.lp-tenancy-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12.5px;
}
.lp-tenancy-row:not(:last-child) { border-bottom: 1px solid #f0f2f1; }
.lp-tenancy-lbl { color: #4a5868; font-weight: 600; }
.lp-tenancy-val { color: #0e2840; font-weight: 800; }
.lp-tenancy-val.ok { color: #1f7a66; }

/* Modal pattern */
.lp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 70;
  animation: lp-fade 0.2s ease;
}
@keyframes lp-fade { from { opacity: 0; } to { opacity: 1; } }
.lp-modal {
  width: 100%;
  max-width: 28rem;
  background: #fafaf8;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  max-height: min(88vh, 720px);
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(14, 40, 64, 0.34);
  animation: lp-pop 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes lp-pop {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
/* Drag handle only on the mobile bottom-sheet */
.lp-modal-handle { display: none; }

@media (max-width: 640px) {
  .lp-overlay { align-items: flex-end; padding: 0; }
  .lp-modal {
    max-width: none;
    border-radius: 24px 24px 0 0;
    max-height: 92vh;
    animation: lp-up 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .lp-modal-handle { display: block; width: 36px; height: 4px; background: #d9dae0; border-radius: 100px; margin: 8px auto 0; }
}
@keyframes lp-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
.lp-modal-header { display: flex; align-items: center; padding: 12px 18px 10px; }
.lp-modal-title { flex: 1; font-size: 16px; font-weight: 800; color: #0e2840; letter-spacing: -0.4px; }
.lp-modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: none;
  background: #f0f2f1;
  color: #4a5868;
  font-size: 20px;
  cursor: pointer;
  font-family: inherit;
  display: flex; align-items: center; justify-content: center;
}
.lp-modal-body {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px 12px 14px 18px;
  scrollbar-width: thin;
  scrollbar-color: #cbd3d1 transparent;
}
.lp-modal-body::-webkit-scrollbar { width: 8px; }
.lp-modal-body::-webkit-scrollbar-track { background: transparent; }
.lp-modal-body::-webkit-scrollbar-thumb {
  background: #cbd3d1;
  border-radius: 100px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.lp-modal-body::-webkit-scrollbar-thumb:hover { background: #aeb8b5; background-clip: padding-box; }
.lp-modal-footer {
  padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #e8eceb;
  background: #fafaf8;
  display: flex;
  gap: 8px;
}
.lp-modal-intro { font-size: 12.5px; font-weight: 600; color: #4a5868; line-height: 1.5; margin-bottom: 14px; }
.lp-modal-section { margin-bottom: 14px; }
.lp-modal-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #8a95a0;
  margin-bottom: 8px;
}
.lp-modal-doc {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 10px;
  margin-bottom: 5px;
}
.lp-modal-doc-tick {
  width: 22px; height: 22px;
  background: #1f7a66;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-modal-doc-tick svg { width: 12px; height: 12px; }
.lp-modal-doc-name { flex: 1; font-size: 12.5px; font-weight: 800; color: #0e2840; }
.lp-modal-doc-meta { font-size: 10.5px; font-weight: 700; color: #8a95a0; }
.lp-modal-legal {
  font-size: 11px;
  font-weight: 600;
  color: #4a5868;
  line-height: 1.55;
  background: #f1f9f4;
  border: 1px solid rgba(61, 189, 163, 0.25);
  border-radius: 10px;
  padding: 10px 12px;
}
.lp-modal-error { color: #b85b36; font-size: 12px; font-weight: 700; text-align: center; }

/* Tenant share */
.lp-share-link { display: flex; gap: 6px; align-items: center; }
.lp-share-input {
  flex: 1;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: #0e2840;
  outline: none;
}
.lp-share-copy { flex: 0 0 auto; }
.lp-share-empty {
  font-size: 12px;
  color: #4a5868;
  font-weight: 600;
  text-align: center;
  padding: 12px 0;
}

/* Buttons */
.btn-secondary {
  flex: 1;
  background: #f0f2f1;
  color: #0e2840;
  border: none;
  border-radius: 10px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
}
.btn-primary {
  flex: 2;
  background: #3dbda3;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(61, 189, 163, 0.32);
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.btn-primary svg { width: 14px; height: 14px; }

/* ── Section drawer (certificate view / upload) ─────────── */
.lp-doc-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f1f9f4, #ffffff);
  border: 1px solid rgba(31, 122, 102, 0.25);
  border-radius: 14px;
  margin-bottom: 14px;
}
.lp-doc-preview-icon {
  width: 44px; height: 50px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fdf4dc, #f8e6c2);
  color: #6f4d14;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.lp-doc-preview-info { flex: 1; min-width: 0; }
.lp-doc-preview-name {
  font-size: 13px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -0.2px;
}
.lp-doc-preview-meta {
  font-size: 11px;
  font-weight: 700;
  color: #1f7a66;
  margin-top: 2px;
}
.lp-doc-preview-btn {
  flex: 0 0 auto;
  padding: 8px 14px;
  font-size: 12px;
}
.lp-doc-empty {
  margin-bottom: 14px;
  padding: 14px;
  background: #f5f4f0;
  border: 1px dashed #d9dee2;
  border-radius: 14px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: #4a5868;
}

.lp-upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1.5px dashed #3dbda3;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.18s;
}
.lp-upload-row:hover { background: #f1f9f4; }
.lp-upload-input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }
.lp-upload-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  background: #3dbda3;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(31, 122, 102, 0.32);
}
.lp-upload-icon svg { width: 18px; height: 18px; }
.lp-upload-text {
  font-size: 13.5px;
  font-weight: 800;
  color: #0e2840;
  letter-spacing: -0.2px;
}
.lp-upload-text small {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #4a5868;
  margin-top: 2px;
}

.mform-section { margin-bottom: 14px; }
.mform-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #8a95a0;
  margin-bottom: 8px;
}
.mform-input {
  width: 100%;
  background: #fff;
  border: 1px solid #e8eceb;
  border-radius: 10px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #0e2840;
  outline: none;
  transition: all 0.18s;
}
.mform-input:focus { border-color: #3dbda3; box-shadow: 0 0 0 3px rgba(61, 189, 163, 0.18); }
.lp-modal-hint {
  font-size: 11px;
  font-weight: 600;
  color: #4a5868;
  margin-top: 6px;
  line-height: 1.4;
}

.lp-doc-preview--pending {
  background: linear-gradient(135deg, #fdf4dc, #ffffff);
  border-color: rgba(212, 166, 89, 0.4);
}

.lp-warn-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #fef3c7, #fde9a4);
  border: 1px solid rgba(212, 166, 89, 0.5);
  border-radius: 12px;
  margin-bottom: 14px;
}
.lp-warn-icon {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #d4a659;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lp-warn-title {
  font-size: 13px;
  font-weight: 800;
  color: #6f4d14;
  letter-spacing: -0.2px;
}
.lp-warn-meta {
  font-size: 11.5px;
  font-weight: 700;
  color: #92400e;
  margin-top: 2px;
  line-height: 1.4;
}

/* ── Web column overrides — fill the content column (drop mobile gutters) ── */
.lp-body .lp-convert-card {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}
.lp-body .lp-tabs {
  padding-left: 0;
  padding-right: 0;
}
.lp-body .section-heading {
  padding-left: 2px;
  padding-right: 2px;
}
.lp-body .lp-sec {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}
.lp-body .lp-sec-grid {
  padding-left: 0;
  padding-right: 0;
}
.lp-body .lp-doc,
.lp-body .lp-empty,
.lp-body .lp-tenancy-card {
  margin-left: 0;
  margin-right: 0;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 1040px) {
  .lp-sec-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .pp-hero {
    grid-template-columns: 150px 1fr;
    gap: 24px;
  }
  .pp-hero-side {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    padding-top: 20px;
    margin-top: 2px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .pp-hero-side-label { margin-right: auto; }
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
  .lp-body {
    width: calc(100% - 32px);
    padding-bottom: 96px;
  }
  .lpw-head-house {
    display: none;
  }
  .lp-mobile-nav {
    display: block;
  }
  .pp-hero {
    grid-template-columns: 140px 1fr;
    gap: 20px;
    padding: 22px;
  }
}

@media (max-width: 640px) {
  .hsw-shell,
  .lp-body {
    width: calc(100% - 24px);
  }
  .lp-sec-grid {
    grid-template-columns: 1fr;
  }
  .hsw-back {
    display: none;
  }
  .lpw-head {
    padding-top: 20px;
  }
  .pp-hero {
    grid-template-columns: 1fr;
    padding: 20px;
    text-align: center;
  }
  .pp-hero-book {
    justify-content: center;
  }
  .pp-hero-stats {
    justify-content: center;
  }
  .pp-hero-actions {
    justify-content: center;
  }
  .pp-hero-stat {
    padding: 0 16px;
  }
  .lp-tabs {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .lp-tabs-group { justify-content: center; }
  .lp-tabs-complete { text-align: center; }
  .lp-convert-card { flex-wrap: wrap; }
}
</style>
