<template>
  <div class="llc-card">
    <!-- Header — mirrors the .pps-ds-header treatment every other
         data-source sheet on the property page uses, so the LLC drawer
         doesn't read as a bolted-on card. -->
    <div class="llc-header">
      <span class="llc-header-ic">
        <img src="/property-cards/landCharges.png" alt="" loading="lazy" />
      </span>
      <div class="llc-header-body">
        <div class="llc-header-title">Local Land Charges</div>
        <div class="llc-header-sub">HM Land Registry · indicative search</div>
      </div>
      <button
        v-if="data && !loading"
        class="llc-refresh"
        type="button"
        :disabled="refreshing"
        aria-label="Refresh land charges"
        @click="onRefresh"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="{ 'llc-spin': refreshing }"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="llc-empty">
      <span class="llc-empty-ic llc-empty-ic--neutral">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="llc-spin">
          <path d="M21 12a9 9 0 1 1-6.22-8.56" />
        </svg>
      </span>
      <div class="llc-empty-title">Checking HM Land Registry…</div>
    </div>

    <!-- Signed-out / auth error -->
    <div v-else-if="!data" class="llc-empty">
      <span class="llc-empty-ic llc-empty-ic--neutral">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </span>
      <div class="llc-empty-title">Sign in to see Land Charges</div>
      <div class="llc-empty-sub">
        Local Land Charges are shown to signed-in users only.
      </div>
    </div>

    <!-- Empty (200 OK, no charges) — a positive signal -->
    <div v-else-if="data.status === 'OK_EMPTY'" class="llc-empty">
      <span class="llc-empty-ic llc-empty-ic--good">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
      </span>
      <div class="llc-empty-title">No active Local Land Charges</div>
      <div class="llc-empty-sub">
        HM Land Registry has no charges registered against this property or its
        boundary.
      </div>
    </div>

    <!-- Council not migrated (E435) -->
    <div v-else-if="data.status === 'NOT_MIGRATED'" class="llc-empty llc-empty--warn">
      <span class="llc-empty-ic llc-empty-ic--warn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18M4 21V10l8-5 8 5v11M9 21v-6h6v6" />
        </svg>
      </span>
      <div class="llc-empty-title">
        This council hasn&rsquo;t moved to HM Land Registry yet
      </div>
      <div class="llc-empty-sub">
        LLC data for this area is still held by the local authority. Your
        solicitor will run the official LLC1 search there during conveyancing.
      </div>
    </div>

    <!-- Ambiguous parcel (E425) -->
    <div v-else-if="data.status === 'MULTI_GEOMETRY'" class="llc-empty llc-empty--warn">
      <span class="llc-empty-ic llc-empty-ic--warn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" />
        </svg>
      </span>
      <div class="llc-empty-title">Parcel boundary is ambiguous</div>
      <div class="llc-empty-sub">
        HM Land Registry couldn&rsquo;t resolve a single parcel for this
        address. The official search on
        <a
          href="https://search-local-land-charges.service.gov.uk"
          target="_blank"
          rel="noopener"
          >gov.uk</a
        >
        can still be run manually.
      </div>
    </div>

    <!-- Generic error -->
    <div v-else-if="data.status === 'ERROR'" class="llc-empty llc-empty--warn">
      <span class="llc-empty-ic llc-empty-ic--warn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </span>
      <div class="llc-empty-title">Couldn&rsquo;t fetch LLC data right now</div>
      <div class="llc-empty-sub">
        {{ data.errorMessage || 'Try again in a moment.' }}
      </div>
    </div>

    <!-- Charges present -->
    <template v-else-if="data.status === 'OK_WITH_CHARGES'">
      <!-- Summary strip -->
      <div class="llc-summary">
        <div class="llc-summary-tile">
          <div class="llc-summary-num">{{ directCharges.length }}</div>
          <div class="llc-summary-lbl">
            Direct charge{{ directCharges.length === 1 ? '' : 's' }}
          </div>
        </div>
        <div class="llc-summary-tile">
          <div class="llc-summary-num">{{ boundaryCharges.length }}</div>
          <div class="llc-summary-lbl">
            On neighbour{{ boundaryCharges.length === 1 ? '' : 's' }}
          </div>
        </div>
      </div>

      <!-- Direct charges -->
      <template v-if="directCharges.length">
        <div class="llc-section-title">On this property</div>
        <div class="llc-charge-list">
          <div v-for="c in directCharges" :key="c.id" class="llc-charge">
            <div class="llc-charge-head">
              <span class="llc-charge-cat" :class="categoryClass(c.category)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="categoryIcon(c.category)" />
                {{ c.category }}
                <template v-if="c.subCategory"> · {{ c.subCategory }}</template>
              </span>
              <span v-if="c.registrationDate" class="llc-charge-date">
                {{ formatYear(c.registrationDate) }}
              </span>
            </div>
            <div
              v-if="c.description"
              class="llc-charge-desc"
              :class="{ 'llc-redacted': isRedacted(c.description) }"
            >
              <template v-if="isRedacted(c.description)">
                <svg class="llc-inline-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Full text available on the official search result only.
              </template>
              <template v-else>{{ c.description }}</template>
            </div>
            <div class="llc-charge-meta">
              <span v-if="c.legalDocument">{{ c.legalDocument }}</span>
              <span v-if="c.law" class="llc-charge-law">{{ c.law }}</span>
            </div>
            <div v-if="c.authorityReference" class="llc-charge-ref">
              Council ref: <b>{{ c.authorityReference }}</b>
            </div>
          </div>
        </div>
      </template>

      <!-- Boundary (neighbour) charges -->
      <template v-if="boundaryCharges.length">
        <div class="llc-section-title llc-section-title--muted">
          On neighbouring properties
        </div>
        <div class="llc-charge-list">
          <div
            v-for="c in boundaryCharges"
            :key="c.id"
            class="llc-charge llc-charge--boundary"
          >
            <div class="llc-charge-head">
              <span class="llc-charge-cat" :class="categoryClass(c.category)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="categoryIcon(c.category)" />
                {{ c.category }}
                <template v-if="c.subCategory"> · {{ c.subCategory }}</template>
              </span>
              <span v-if="c.registrationDate" class="llc-charge-date">
                {{ formatYear(c.registrationDate) }}
              </span>
            </div>
            <div v-if="c.location" class="llc-charge-loc">
              <svg class="llc-inline-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{ c.location }}
            </div>
            <div
              v-if="c.description"
              class="llc-charge-desc"
              :class="{ 'llc-redacted': isRedacted(c.description) }"
            >
              <template v-if="isRedacted(c.description)">
                <svg class="llc-inline-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Full text available on the official search result only.
              </template>
              <template v-else>{{ c.description }}</template>
            </div>
          </div>
        </div>
      </template>

      <!-- Warnings from HMLR (e.g. near a non-migrated border) -->
      <div v-if="data.warnings.length" class="llc-warnings">
        <div v-for="(w, i) in data.warnings" :key="i" class="llc-warning">
          <svg class="llc-inline-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          {{ w }}
        </div>
      </div>
    </template>

    <!-- Disclaimer + attribution — required for all non-error states, so it
         renders as long as we have any HMLR response. -->
    <div v-if="data" class="llc-footer">
      <div class="llc-disclaimer">
        <b>Indicative only.</b> This is not an official Local Land Charges
        search. Your solicitor will run the official LLC1 &amp; CON29 during
        conveyancing.
      </div>
      <div class="llc-attribution">
        Data © Crown copyright and database right, HM Land Registry
        <template v-if="data.searchedAt">
          · checked {{ formatWhen(data.searchedAt) }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLlc, type LlcSearch, type LlcCharge } from '~/composables/useLlc'

const props = defineProps<{ propertyId: string }>()

const { fetchLlc, refreshLlc } = useLlc()
const data = ref<LlcSearch | null>(null)
const loading = ref(false)
const refreshing = ref(false)

async function load() {
  loading.value = true
  data.value = await fetchLlc(props.propertyId)
  loading.value = false
}

async function onRefresh() {
  refreshing.value = true
  const next = await refreshLlc(props.propertyId)
  if (next) data.value = next
  refreshing.value = false
}

watch(
  () => props.propertyId,
  () => {
    if (props.propertyId) load()
  },
  { immediate: true },
)

const directCharges = computed<LlcCharge[]>(
  () => data.value?.charges.filter((c) => !c.boundary) ?? [],
)
const boundaryCharges = computed<LlcCharge[]>(
  () => data.value?.charges.filter((c) => c.boundary) ?? [],
)

// HMLR pre-redacts Housing Grant / LON / Pipeline descriptions with this
// literal string. Render it as a lock + explainer rather than pretending it's
// a real description (substituting text would breach the licence terms).
function isRedacted(description: string | null) {
  return (
    !!description && description.trim() === 'Viewable on official search result'
  )
}

// Inline SVG path bodies keyed by charge category — the project standard is
// drawn icons, not emoji.
function categoryIcon(cat: string): string {
  const c = (cat ?? '').toLowerCase()
  if (c.includes('planning'))
    return '<path d="M2 20h20M4 20V8l8-5 8 5v12M9 20v-5h6v5"/>'
  if (c.includes('housing') || c.includes('building'))
    return '<path d="M3 10.5 12 3l9 7.5V21H3zM9 21v-6h6v6"/>'
  if (c.includes('financial'))
    return '<path d="M15 6.5A3.5 3.5 0 0 0 8 7v5H6m0 0h6m-6 0v3a4 4 0 0 1-1.5 3H18"/>'
  if (c.includes('light'))
    return '<path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3.5 10.9V15h7v-2.1A6 6 0 0 0 12 2Z"/>'
  return '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4"/>'
}

function categoryClass(cat: string): string {
  const c = (cat ?? '').toLowerCase()
  if (c.includes('planning')) return 'llc-cat--planning'
  if (c.includes('financial')) return 'llc-cat--financial'
  if (c.includes('housing') || c.includes('building')) return 'llc-cat--housing'
  if (c.includes('light')) return 'llc-cat--light'
  return 'llc-cat--other'
}

function formatYear(iso: string): string {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? '' : String(d.getFullYear())
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const diffDays = Math.round((Date.now() - d.getTime()) / 86400000)
  if (diffDays < 1) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays} days ago`
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.llc-card {
  font-family: inherit;
  color: #231d45;
}

/* header — matches .pps-ds-header on the property page */
.llc-header {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 14px;
  /* Right padding leaves room for the sheet's floating close button. */
  padding: 14px 46px 14px 16px;
  margin-bottom: 18px;
  background: linear-gradient(
    135deg,
    rgba(0, 161, 154, 0.18) 0%,
    rgba(0, 161, 154, 0.05) 100%
  );
}
.llc-header-ic {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.llc-header-ic img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.llc-header-body {
  flex: 1;
  min-width: 0;
}
.llc-header-title {
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.3px;
}
.llc-header-sub {
  font-size: 12px;
  color: #6b6880;
  font-weight: 500;
  margin-top: 2px;
}
.llc-refresh {
  background: rgba(255, 255, 255, 0.7);
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  color: #4a4665;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s;
  flex-shrink: 0;
}
.llc-refresh:hover {
  background: #fff;
}
.llc-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.llc-refresh svg {
  width: 16px;
  height: 16px;
}
.llc-spin {
  animation: llc-spin 0.9s linear infinite;
}
@keyframes llc-spin {
  to {
    transform: rotate(360deg);
  }
}

/* empty / status states */
.llc-empty {
  text-align: center;
  padding: 10px 12px 6px;
}
.llc-empty-ic {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
.llc-empty-ic svg {
  width: 22px;
  height: 22px;
}
.llc-empty-ic--neutral {
  background: #f3f2f8;
  color: #6b6880;
}
.llc-empty-ic--good {
  background: #e4f4ec;
  color: #2e9e6b;
}
.llc-empty-ic--warn {
  background: #fff4dd;
  color: #a37416;
}
.llc-empty-title {
  font-size: 14.5px;
  font-weight: 800;
  margin-top: 10px;
  color: #231d45;
  line-height: 1.35;
}
.llc-empty-sub {
  font-size: 12.5px;
  color: #6b6880;
  font-weight: 500;
  margin-top: 6px;
  line-height: 1.5;
}
.llc-empty-sub a {
  color: #00857f;
  font-weight: 700;
}
.llc-empty--warn .llc-empty-title {
  color: #7a5b1a;
}

/* summary strip */
.llc-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.llc-summary-tile {
  background: #fafaff;
  border: 1px solid #eeecf5;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}
.llc-summary-num {
  font-size: 22px;
  font-weight: 800;
  color: #231d45;
}
.llc-summary-lbl {
  font-size: 11px;
  color: #6b6880;
  font-weight: 700;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* section titles */
.llc-section-title {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4a4665;
  margin: 18px 0 10px;
}
.llc-section-title--muted {
  color: #8a86a3;
}

/* charges */
.llc-charge-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.llc-charge {
  border: 1px solid #ecebf3;
  border-radius: 13px;
  padding: 13px 14px;
  background: #fff;
}
.llc-charge--boundary {
  background: #fafaff;
}
.llc-charge-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.llc-charge-cat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 800;
  padding: 4px 9px;
  border-radius: 8px;
  letter-spacing: 0.02em;
}
.llc-charge-cat svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}
.llc-cat--planning {
  background: #eef4ff;
  color: #3350a6;
}
.llc-cat--financial {
  background: #fff2e6;
  color: #a35a12;
}
.llc-cat--housing {
  background: #e4f4ec;
  color: #256b45;
}
.llc-cat--light {
  background: #fff8e0;
  color: #8a6a10;
}
.llc-cat--other {
  background: #f3effb;
  color: #5a4790;
}
.llc-charge-date {
  margin-left: auto;
  font-size: 11.5px;
  color: #6b6880;
  font-weight: 700;
}
.llc-inline-ic {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  vertical-align: -2px;
  margin-right: 4px;
}
.llc-charge-loc {
  font-size: 12px;
  color: #6b6880;
  font-weight: 600;
  margin-top: 8px;
}
.llc-charge-desc {
  font-size: 13px;
  color: #2f2a4a;
  line-height: 1.5;
  margin-top: 8px;
  font-weight: 500;
}
.llc-charge-desc.llc-redacted {
  color: #6b6880;
  font-style: italic;
  background: #faf8f2;
  border: 1px dashed #e8dfc4;
  border-radius: 8px;
  padding: 8px 10px;
}
.llc-charge-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 8px;
  font-size: 11.5px;
  color: #6b6880;
  font-weight: 600;
}
.llc-charge-law {
  color: #8a86a3;
  font-style: italic;
  font-weight: 500;
}
.llc-charge-ref {
  font-size: 11.5px;
  color: #6b6880;
  font-weight: 500;
  margin-top: 6px;
}
.llc-charge-ref b {
  color: #231d45;
  font-weight: 700;
}

/* warnings from HMLR */
.llc-warnings {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.llc-warning {
  background: #fff8e0;
  border: 1px solid #f0e2a8;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12.5px;
  color: #7a5b1a;
  font-weight: 600;
  line-height: 1.4;
}

/* footer — required for approved-user display terms */
.llc-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0eff5;
}
.llc-disclaimer {
  font-size: 11.5px;
  color: #6b6880;
  font-weight: 500;
  line-height: 1.5;
}
.llc-disclaimer b {
  color: #231d45;
}
.llc-attribution {
  font-size: 10.5px;
  color: #8a86a3;
  font-weight: 500;
  margin-top: 6px;
  letter-spacing: 0.02em;
}
</style>
