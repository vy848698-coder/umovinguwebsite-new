<template>
  <div class="passport-page mobile-container bg-umu-gradient">
    <AppHeader title="Passport" :showBack="true" right="profile" />

    <div class="content">
      <h1 class="title">Property Passport Available</h1>
      <p class="subtitle">{{ subtitleLine }}</p>

      <PassportCard :line1="cardLine1" :line2="cardLine2" />

      <div class="completion-status">
        <p>
          This passport is <span class="percentage">37% complete</span>. Get
          property information and contact the owner directly.
        </p>
      </div>

      <div class="key-visual">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Cellipse cx='30' cy='25' rx='20' ry='15' fill='%23d4af37' opacity='0.8'/%3E%3Cellipse cx='35' cy='25' rx='20' ry='15' fill='%23f0d98a'/%3E%3Crect x='50' y='20' width='40' height='10' fill='%23d4af37' rx='2'/%3E%3Ccircle cx='85' cy='25' r='3' fill='%23654321'/%3E%3C/svg%3E"
          alt="Key"
          class="key-img"
        />
      </div>

      <h2 class="section-title">Why Unlock This Passport?</h2>

      <div class="benefits-list">
        <div class="benefit-item">
          <span class="benefit-icon">📞</span>
          <span class="benefit-text">Easily reach out to the owner</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">📄</span>
          <span class="benefit-text">Access complete property documentation</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">🛡️</span>
          <span class="benefit-text">See all warranties, certificates & repairs</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">💬</span>
          <span class="benefit-text">Get answers to specific property questions</span>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">⏱️</span>
          <span class="benefit-text">Save time with verified information</span>
        </div>
      </div>

      <div v-if="claimError" class="claim-error">
        <p>{{ claimError }}</p>
        <NuxtLink
          v-if="claimError.toLowerCase().includes('phone')"
          to="/profile/personal-information"
          class="claim-error-link"
        >
          Add phone number ->
        </NuxtLink>
      </div>

      <button class="unlock-btn" :disabled="claiming" @click="navigateToPayment">
        {{ claiming ? 'Creating Passport...' : 'Unlock Now' }}
      </button>

      <div class="pricing-section">
        <h3 class="pricing-title">One-time access fee: £6</h3>
        <div class="pricing-features">
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span class="feature-text">Full property documentation</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span class="feature-text">Direct owner contact</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span class="feature-text">30-day access guarantee</span>
          </div>
          <div class="feature-item">
            <span class="check-icon">✓</span>
            <span class="feature-text">Money-back if unsatisfied</span>
          </div>
        </div>
      </div>

      <div class="comparison-table">
        <div class="comparison-header">
          <div class="header-col">Information</div>
          <div class="header-col">
            Snapshot<br />
            <span class="header-subtitle">What you get for free*</span>
          </div>
          <div class="header-col highlight">
            Passport<br />
            <span class="header-subtitle-highlight">Full Passport Access</span>
          </div>
        </div>

        <div class="comparison-row section-row">
          <div class="row-label">Property overview</div>
          <div class="row-value"></div>
          <div class="row-value"></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Professional photos</div>
          <div class="row-value"><span class="check">✓</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Contact owner directly</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">All warranties & certs</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Property history</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Recent surveys</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Energy performance</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Council tax information</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Neighborhood data</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>

        <div class="comparison-row">
          <div class="row-label">Condition report</div>
          <div class="row-value"><span class="cross">✕</span></div>
          <div class="row-value"><span class="check">✓</span></div>
        </div>
      </div>

      <button class="bottom-unlock-btn" :disabled="claiming" @click="navigateToPayment">
        {{ claiming ? 'Creating Passport...' : 'Unlock Complete Passport - £6' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppHeader from '@/components/core/AppHeader.vue'
import PassportCard from '@/components/passport-view/PassportCard.vue'
import { usePassportClaim } from '~/composables/usePassportClaim'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const propertyId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id

const { claimPassport } = usePassportClaim()
const property = ref<any | null>(null)
const claiming = ref(false)
const claimError = ref('')

const cardLine1 = computed(() => property.value?.addressLine1 ?? '')
const cardLine2 = computed(() =>
  [property.value?.city, property.value?.postcode].filter(Boolean).join(', '),
)
const subtitleLine = computed(() => {
  if (!property.value) return 'Loading property details...'
  return [property.value.addressLine1, property.value.postcode]
    .filter(Boolean)
    .join(', ')
})

onMounted(async () => {
  try {
    property.value = await $fetch(
      `${config.public.apiBase}/property/${route.params.id}`,
    )
  } catch (e) {
    console.error('Failed to load property', e)
  }
})

const navigateToPayment = async () => {
  if (!property.value || claiming.value) return
  claiming.value = true
  claimError.value = ''
  try {
    const result = await claimPassport(
      propertyId,
      property.value.addressLine1,
      property.value.postcode,
    )
    router.push(`/passportview/${result.passportId}`)
  } catch (err: any) {
    claimError.value =
      err?.data?.message ||
      err?.message ||
      'Failed to claim passport. Please try again.'
  } finally {
    claiming.value = false
  }
}
</script>

<style scoped>
.passport-page {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 86% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  color: #231d45;
  -webkit-font-smoothing: antialiased;
  padding: 8px 12px 24px;
}

.content {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 12px 8px 36px;
}

.title {
  font-size: 27px;
  font-weight: 800;
  text-align: center;
  margin: 18px 0 8px;
  color: #231d45;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 14px;
  color: #6b6783;
  text-align: center;
  margin-bottom: 24px;
}

.completion-status {
  text-align: center;
  margin: 20px 0 24px;
  padding: 14px 16px;
  border: 1px solid #e5f4f2;
  background: #f2faf8;
  border-radius: 14px;
}

.completion-status p {
  font-size: 14px;
  color: #4a4566;
  line-height: 1.5;
  margin: 0;
}

.percentage {
  color: #00a19a;
  font-weight: 800;
  font-size: 15px;
}

.key-visual {
  display: flex;
  justify-content: center;
  margin: 24px 0 16px;
}

.key-img {
  width: 124px;
  height: 62px;
  filter: drop-shadow(0 8px 12px rgba(17, 52, 88, 0.15));
}

.section-title {
  font-size: 21px;
  font-weight: 800;
  text-align: center;
  margin: 26px 0 18px;
  color: #231d45;
  letter-spacing: -0.01em;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0 24px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: linear-gradient(170deg, #fbfdff 0%, #f6f9ff 100%);
  border: 1px solid rgba(174, 201, 231, 0.38);
  border-radius: 14px;
  box-shadow:
    0 8px 18px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}

.benefit-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.benefit-text {
  font-size: 14px;
  color: #231d45;
  font-weight: 700;
}

.claim-error {
  font-size: 13px;
  color: #c73e36;
  text-align: center;
  margin: 6px 0 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid rgba(199, 62, 54, 0.25);
}

.claim-error p {
  margin: 0;
}

.claim-error-link {
  display: inline-block;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
  text-decoration: none;
  border-bottom: 1.5px solid #e2f1ea;
  padding-bottom: 1px;
}

.claim-error-link:hover {
  color: #00a19a;
  border-bottom-color: #00a19a;
}

.unlock-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #00a19a 0%, #00b6ae 60%, #0f8f88 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin: 22px 0;
  box-shadow: 0 8px 22px rgba(0, 161, 154, 0.3);
  transition: transform 0.15s ease, filter 0.15s ease;
}

.unlock-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.unlock-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.pricing-section {
  background: rgba(255, 255, 255, 0.94);
  border-radius: 18px;
  border: 1px solid rgba(174, 201, 231, 0.44);
  padding: 20px;
  margin: 20px 0;
  box-shadow:
    0 10px 24px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.pricing-title {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 16px;
  color: #231d45;
}

.pricing-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.check-icon {
  width: 22px;
  height: 22px;
  background: #00a19a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.feature-text {
  font-size: 13px;
  color: #4a4566;
  font-weight: 600;
}

.comparison-table {
  background: rgba(255, 255, 255, 0.94);
  border-radius: 18px;
  border: 1px solid rgba(174, 201, 231, 0.44);
  overflow: hidden;
  margin: 20px 0;
  box-shadow:
    0 10px 24px rgba(17, 52, 88, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.comparison-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  gap: 8px;
  padding: 16px;
  background: #f6f9ff;
  font-weight: 800;
  font-size: 13px;
}

.header-col {
  text-align: center;
  color: #1f1a3c;
}

.header-col.highlight {
  color: #00a19a;
}

.header-subtitle {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #7a7594;
  margin-top: 4px;
}

.header-subtitle-highlight {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #00a19a;
  margin-top: 4px;
}

.comparison-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #edf1f8;
  align-items: center;
}

.comparison-row:last-child {
  border-bottom: none;
}

.section-row {
  background: #f6f9ff;
  font-weight: 800;
}

.row-label {
  font-size: 13px;
  color: #2f2a4f;
}

.row-value {
  text-align: center;
  font-size: 16px;
}

.check {
  color: #00a19a;
  font-weight: 700;
}

.cross {
  color: #c0bdcc;
  font-weight: 700;
}

.bottom-unlock-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #231d45 0%, #2f285c 60%, #191436 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  margin: 18px 0 24px;
  box-shadow: 0 8px 20px rgba(35, 29, 69, 0.3);
  transition: transform 0.15s ease, filter 0.15s ease;
}

.bottom-unlock-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.04);
}

.bottom-unlock-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .passport-page {
    padding: 0 10px 22px;
  }

  .content {
    width: 100%;
    padding: 10px 0 30px;
  }

  .title {
    font-size: 23px;
  }

  .comparison-header,
  .comparison-row {
    grid-template-columns: 1.8fr 1fr 1fr;
    gap: 6px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .row-label {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .unlock-btn,
  .bottom-unlock-btn,
  .claim-error-link {
    transition: none !important;
  }
}
</style>
