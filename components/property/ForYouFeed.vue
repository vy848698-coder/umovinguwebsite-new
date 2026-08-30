<template>
  <section class="fyf">
    <div class="fyf-head" data-tour="foryou-feed">
      <div class="fyf-head-text">
        <p class="fyf-eyebrow">Matched to you</p>
        <h2 class="fyf-title">For you</h2>
        <p class="fyf-lede">
          Properties near your postcode, ranked against the budget, types and
          must-haves saved in your preferences.
        </p>
      </div>
      <div class="fyf-head-actions">
        <button
          type="button"
          class="fyf-filters"
          :class="{ active: hasFilters }"
          @click="emit('open-filters')"
        >
          <Icon name="i-lucide-sliders-horizontal" />
          Filters
          <span v-if="hasFilters" class="fyf-filters-dot" aria-hidden="true" />
        </button>
        <button type="button" class="fyf-all" @click="navigateTo('/marketplace')">
          Browse all
          <Icon name="i-lucide-arrow-right" />
        </button>
      </div>
    </div>

    <div v-if="loading" class="fyf-grid">
      <div v-for="n in 6" :key="n" class="fyf-skeleton" />
    </div>

    <div v-else-if="properties.length" class="fyf-grid">
      <!-- A real <a>, not a @click handler. Nuxt prefetches a NuxtLink's
           route chunk once the card scrolls into view, so /property/[id]
           (a very large page) is already downloaded by the time it's
           clicked instead of starting to download on the click. Also gives
           back middle-click, open-in-new-tab and proper link semantics. -->
      <NuxtLink
        v-for="(prop, i) in properties.slice(0, 9)"
        :key="prop.id"
        :to="`/property/${prop.id}`"
        class="fyf-card"
      >
        <div class="fyf-media">
          <PropertyImage
            :src="prop.imageUrl || prop.image"
            :alt="prop.addressLine1 || prop.address"
            :seed="prop.id"
            :variant-index="i"
            :show-caption="false"
            class="fyf-img"
          />
          <span
            v-if="prop.hasPassport"
            class="fyf-badge"
            :class="prop.passportPublished ? 'is-published' : 'is-progress'"
          >
            <img src="/dashboard/passportBadge.png" alt="" class="fyf-badge-ic" loading="lazy" />
            {{ prop.passportPublished ? 'Published' : 'In progress' }}
          </span>
          <span class="fyf-price">{{ priceLabel(prop) }}</span>
        </div>

        <div class="fyf-body">
          <h3 class="fyf-addr">{{ prop.addressLine1 || prop.address }}</h3>
          <p class="fyf-area">{{ areaLabel(prop) }}</p>

          <div v-if="prop.propertyType || prop.type || prop.tenure" class="fyf-pills">
            <span v-if="prop.propertyType || prop.type" class="fyf-pill">
              {{ prop.propertyType || prop.type }}
            </span>
            <span v-if="prop.tenure" class="fyf-pill">{{ prop.tenure }}</span>
          </div>

          <div class="fyf-foot">
            <div v-if="prop.epcScore" class="fyf-epc">
              <span class="fyf-epc-lbl">EPC</span>
              <span class="fyf-epc-bar">
                <span class="fyf-epc-fill" :style="{ width: prop.epcScore + '%' }" />
              </span>
              <span class="fyf-epc-num">{{ prop.epcScore }}</span>
            </div>
            <span v-else class="fyf-epc-none">EPC not published</span>
            <span class="fyf-view">View</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- The matcher keys off the profile postcode, so with none saved the
         feed has nothing to rank against — ask for it here rather than
         showing an empty grid. -->
    <div v-else-if="needsPostcode" class="fyf-empty">
      <img src="/dashboard/emptyPostcode.png" alt="" class="fyf-empty-ic" loading="lazy" />
      <h3 class="fyf-empty-title">Add a postcode to see matches</h3>
      <p class="fyf-empty-sub">
        We'll tailor properties to your budget, preferred types and must-have
        features.
      </p>
      <button class="fyf-empty-btn" type="button" @click="openPostcodeSheet">
        Set postcode
      </button>
    </div>

    <div v-else class="fyf-empty">
      <img src="/dashboard/emptySearch.png" alt="" class="fyf-empty-ic" loading="lazy" />
      <h3 class="fyf-empty-title">No matches yet</h3>
      <p class="fyf-empty-sub">
        Nothing in your area matches your saved preferences. Try broadening
        your filters or refreshing your postcode.
      </p>
      <button class="fyf-empty-btn" type="button" @click="emit('open-filters')">
        Adjust filters
      </button>
    </div>

    <!-- Postcode dialog — inline so "Set postcode" actually does something.
         Routing to /profile wouldn't help: that page has no postcode field
         at all (it lists labelled addresses, a separate model the For You
         matcher never reads). -->
    <Teleport to="body">
      <Transition name="pcs">
        <div v-if="postcodeSheetOpen" class="pcs-overlay" @click.self="closePostcodeSheet">
          <div class="pcs-sheet" role="dialog" aria-modal="true" aria-label="Set your postcode">
            <button class="pcs-close" type="button" aria-label="Close" @click="closePostcodeSheet">
              <Icon name="i-lucide-x" />
            </button>
            <img src="/dashboard/emptyPostcode.png" alt="" class="pcs-ic" loading="lazy" />
            <h3 class="pcs-title">Set your postcode</h3>
            <p class="pcs-sub">We'll use this to find properties near you.</p>
            <input
              ref="postcodeInputEl"
              v-model="postcodeDraft"
              type="text"
              class="pcs-input"
              placeholder="e.g. CV5 6AJ"
              autocapitalize="characters"
              @keyup.enter="savePostcode"
            />
            <p v-if="postcodeError" class="pcs-error">{{ postcodeError }}</p>
            <button
              type="button"
              class="pcs-save"
              :disabled="postcodeSaving"
              @click="savePostcode"
            >
              {{ postcodeSaving ? 'Saving…' : 'Save postcode' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import PropertyImage from '~/components/property/PropertyImage.vue'
import { useProfile } from '~/composables/useProfile'

defineProps<{
  properties: any[]
  loading: boolean
  needsPostcode: boolean
  hasFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'open-filters'): void
  // The parent owns the feed's data fetch; this component only owns the
  // postcode dialog, so it reports the save rather than re-fetching itself.
  (e: 'postcode-saved'): void
}>()

const { updateProfile } = useProfile()

function priceLabel(prop: any): string {
  if (typeof prop.estimatedPrice === 'number') {
    return '£' + Math.round(prop.estimatedPrice).toLocaleString('en-GB')
  }
  return prop.priceDisplay || 'Price on request'
}

function areaLabel(prop: any): string {
  if (prop.city) return `${prop.city}, ${prop.postcode ?? ''}`.replace(/,\s*$/, '')
  return prop.area || prop.postcode || ''
}

const postcodeSheetOpen = ref(false)
const postcodeDraft = ref('')
const postcodeSaving = ref(false)
const postcodeError = ref('')
const postcodeInputEl = ref<HTMLInputElement | null>(null)

function openPostcodeSheet() {
  postcodeDraft.value = ''
  postcodeError.value = ''
  postcodeSheetOpen.value = true
  nextTick(() => postcodeInputEl.value?.focus())
}
function closePostcodeSheet() {
  postcodeSheetOpen.value = false
}

// Loose check only — the backend re-searches on whatever's typed anyway, so
// this just catches an empty/obviously-wrong submit before a wasted round
// trip, not full postcode validation.
const POSTCODE_RE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/

async function savePostcode() {
  const value = postcodeDraft.value.trim()
  if (!POSTCODE_RE.test(value)) {
    postcodeError.value = "That doesn't look like a UK postcode."
    return
  }
  postcodeSaving.value = true
  postcodeError.value = ''
  try {
    await updateProfile({ postcode: value })
    postcodeSheetOpen.value = false
    emit('postcode-saved')
  } catch {
    postcodeError.value = 'Could not save your postcode — try again.'
  } finally {
    postcodeSaving.value = false
  }
}
</script>

<style scoped>
.fyf {
  margin-top: 34px;
}

.fyf-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.fyf-eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #00a19a;
}
.fyf-title {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #231d45;
}
.fyf-lede {
  margin: 0;
  max-width: 52ch;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.55;
  color: #6b7089;
}
.fyf-head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.fyf-filters,
.fyf-all {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border-radius: 999px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.fyf-filters {
  position: relative;
  background: #fff;
  border: 1px solid #e4e5ed;
  color: #4a5876;
}
.fyf-filters:hover {
  border-color: #cfd3e0;
}
.fyf-filters.active {
  border-color: #9fe0d8;
  background: #f2faf8;
  color: #00756f;
}
.fyf-filters-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a19a;
}
.fyf-all {
  background: #231d45;
  border: 1px solid #231d45;
  color: #fff;
}
.fyf-all:hover {
  background: #16112f;
}

.fyf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.fyf-skeleton {
  height: 290px;
  border-radius: 18px;
  background: linear-gradient(100deg, #f1f3f7 30%, #e7eaf1 50%, #f1f3f7 70%);
  background-size: 250% 100%;
  animation: fyf-shimmer 1.4s ease-in-out infinite;
}
@keyframes fyf-shimmer {
  from { background-position: 140% 0; }
  to { background-position: -40% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .fyf-skeleton { animation: none; }
}

.fyf-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.fyf-card:hover {
  transform: translateY(-3px);
  border-color: #d8e4e2;
  box-shadow: 0 16px 34px rgba(31, 61, 98, 0.12);
}
.fyf-card:focus-visible {
  outline: 2px solid #00a19a;
  outline-offset: 2px;
}

.fyf-media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #eef4f2;
}
.fyf-img {
  width: 100%;
  height: 100%;
}
.fyf-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px 5px 6px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.01em;
  backdrop-filter: blur(6px);
}
.fyf-badge.is-published {
  background: rgba(0, 161, 154, 0.92);
  color: #fff;
}
.fyf-badge.is-progress {
  background: rgba(255, 255, 255, 0.94);
  color: #92400e;
}
.fyf-badge-ic {
  width: 15px;
  height: 15px;
  object-fit: contain;
}
.fyf-price {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(35, 29, 69, 0.88);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.fyf-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 14px 16px 16px;
}
.fyf-addr {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #231d45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fyf-area {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #8a90a6;
}
.fyf-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.fyf-pill {
  padding: 3px 9px;
  border-radius: 999px;
  background: #f3f5f9;
  border: 1px solid #e9ecf2;
  font-size: 10.5px;
  font-weight: 700;
  color: #4a5876;
  text-transform: capitalize;
}
.fyf-foot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 14px;
}
.fyf-epc {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
}
.fyf-epc-lbl {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #8a90a6;
}
.fyf-epc-bar {
  flex: 1;
  min-width: 26px;
  height: 5px;
  border-radius: 999px;
  background: #edf0f5;
  overflow: hidden;
}
.fyf-epc-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #2fd0c6, #00a19a);
}
.fyf-epc-num {
  font-size: 12.5px;
  font-weight: 800;
  color: #231d45;
}
.fyf-epc-none {
  flex: 1;
  font-size: 11px;
  font-weight: 600;
  color: #a8a9ad;
}
.fyf-view {
  flex-shrink: 0;
  padding: 7px 15px;
  border-radius: 999px;
  background: #231d45;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}
.fyf-card:hover .fyf-view {
  background: #00a19a;
}

.fyf-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 44px 24px;
  border: 1px dashed #d9dee8;
  border-radius: 20px;
  background: #fbfcfe;
}
.fyf-empty-ic {
  width: 78px;
  height: 78px;
  object-fit: contain;
  margin-bottom: 14px;
}
.fyf-empty-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
}
.fyf-empty-sub {
  margin: 0 0 18px;
  max-width: 44ch;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.55;
  color: #6b7089;
}
.fyf-empty-btn {
  padding: 11px 22px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 161, 154, 0.28);
}
.fyf-empty-btn:hover {
  filter: brightness(1.06);
}

/* ── Postcode dialog ─────────────────────────────────────────────── */
.pcs-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(35, 29, 69, 0.55);
  backdrop-filter: blur(4px);
}
.pcs-sheet {
  position: relative;
  width: 100%;
  max-width: 28rem;
  padding: 30px 26px calc(26px + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 22px 22px 0 0;
  text-align: center;
  font-family: inherit;
}
.pcs-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid #e4e5ed;
  background: #fff;
  color: #6b7089;
  cursor: pointer;
}
.pcs-close:hover {
  color: #231d45;
}
.pcs-ic {
  width: 66px;
  height: 66px;
  object-fit: contain;
  margin: 0 auto 12px;
  display: block;
}
.pcs-title {
  margin: 0 0 4px;
  font-size: 19px;
  font-weight: 800;
  color: #231d45;
}
.pcs-sub {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7089;
}
.pcs-input {
  width: 100%;
  padding: 13px 16px;
  border: 1.5px solid #e4e5ed;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: #231d45;
  text-transform: uppercase;
  outline: none;
}
.pcs-input:focus {
  border-color: #00a19a;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.12);
}
.pcs-error {
  margin: 8px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #d14343;
}
.pcs-save {
  width: 100%;
  margin-top: 14px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #00a19a, #008a84);
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.pcs-save:disabled {
  opacity: 0.6;
  cursor: default;
}

.pcs-enter-active,
.pcs-leave-active { transition: opacity 0.22s ease; }
.pcs-enter-active .pcs-sheet,
.pcs-leave-active .pcs-sheet { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.pcs-enter-from,
.pcs-leave-to { opacity: 0; }
.pcs-enter-from .pcs-sheet,
.pcs-leave-to .pcs-sheet { transform: translateY(100%); }

@media (min-width: 768px) {
  .pcs-overlay { align-items: center; padding: 24px; }
  .pcs-sheet { border-radius: 22px; padding-bottom: 26px; }
  .pcs-enter-from .pcs-sheet,
  .pcs-leave-to .pcs-sheet { transform: translateY(16px) scale(0.98); }
}

@media (max-width: 640px) {
  .fyf-head { align-items: flex-start; }
  .fyf-title { font-size: 22px; }
  .fyf-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
}
</style>
