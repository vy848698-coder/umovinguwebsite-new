<template>
  <div class="sb-shell">
    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="sb-body">
      <!-- Page head -->
      <header class="sb-head">
        <div class="sb-head-copy">
          <h1 class="sb-title">Billing &amp; Payment</h1>
          <p class="sb-lede">Manage your subscription, payment methods and billing preferences.</p>
        </div>
        <div class="sb-secure">
          <Icon name="heroicons:lock-closed" class="sb-secure-ic" />
          <div class="sb-secure-text">
            <span class="sb-secure-top">Secure checkout</span>
            <span class="sb-secure-sub">Powered by <strong>stripe</strong></span>
          </div>
        </div>
      </header>

      <!-- Current plan -->
      <section class="sb-plan-card">
        <div class="sb-plan-text">
          <p class="sb-plan-label">Your plan</p>
          <h2 class="sb-plan-name">UMU Pro Subscription</h2>
          <p class="sb-plan-price">£29.99 <span>/ month</span></p>
          <ul class="sb-plan-meta">
            <li><Icon name="heroicons:calendar-days" class="sb-pm-ic" /> Renews on Sep 15, 2026</li>
            <li><Icon name="heroicons:user" class="sb-pm-ic" /> Member since March 2024</li>
          </ul>
          <div class="sb-plan-actions">
            <button type="button" class="sb-plan-btn">
              <Icon name="heroicons:map-pin" class="sb-pb-ic" /> View Benefits
            </button>
            <button type="button" class="sb-plan-btn">
              <Icon name="heroicons:cog-6-tooth" class="sb-pb-ic" /> Manage Subscription
            </button>
          </div>
        </div>
        <div class="sb-plan-art" aria-hidden="true">
          <div class="sb-plan-card-back">
            <span class="sb-pcb-label">Premium Access</span>
          </div>
          <div class="sb-plan-card-front">
            <span class="sb-pcf-label">Premium Access</span>
            <Icon name="heroicons:trophy-solid" class="sb-pcf-crown" />
          </div>
        </div>
      </section>

      <!-- Stripe portal banner -->
      <section class="sb-stripe">
        <div class="sb-stripe-icon">
          <Icon name="heroicons:credit-card" class="sb-stripe-svg" />
        </div>
        <div class="sb-stripe-body">
          <p class="sb-stripe-kicker">Payment method</p>
          <p class="sb-stripe-title">Manage payment method</p>
          <p class="sb-stripe-sub">Securely update or add payment methods via our Stripe portal.</p>
        </div>
        <button type="button" class="sb-stripe-btn" @click="openStripePortal">
          Manage in Stripe <Icon name="heroicons:arrow-top-right-on-square" class="sb-stripe-btn-ic" />
        </button>
      </section>

      <!-- Stored payment methods -->
      <section class="sb-section">
        <h3 class="sb-section-title">Stored payment methods</h3>
        <div class="sb-methods-grid">
          <article v-for="method in paymentMethods" :key="method.name" class="sb-method-card">
            <div class="sb-method-top">
              <span class="sb-badge" :class="method.primary ? 'sb-badge--primary' : 'sb-badge--muted'">
                {{ method.primary ? 'Primary' : 'Secondary' }}
              </span>
              <button type="button" class="sb-method-more" aria-label="More options">
                <Icon name="heroicons:ellipsis-vertical" class="sb-method-more-ic" />
              </button>
            </div>
            <div class="sb-method-row">
              <div class="sb-method-info">
                <p class="sb-method-name">{{ method.name }}</p>
                <p class="sb-method-pan">•••• •••• •••• {{ method.last4 }}</p>
                <p class="sb-method-meta">{{ method.brand }} · Expires {{ method.expiry }}</p>
              </div>
              <img :src="brandLogo(method.brand)" :alt="method.brand" class="sb-method-logo" />
            </div>
          </article>
        </div>

        <h4 class="sb-subtitle">Add new payment method</h4>
        <p class="sb-sub-meta">Choose one of the supported payment methods to get started.</p>
        <div class="sb-brands-row">
          <button
            v-for="brand in paymentBrands"
            :key="brand"
            type="button"
            class="sb-brand-cell"
            :class="brand === 'Klarna' ? 'sb-brand-cell--klarna' : ''"
          >
            <img :src="brandFile[brand]" :alt="brand" class="sb-brand-img" />
            <span class="sb-brand-label">{{ brand }}</span>
          </button>
        </div>
      </section>

      <!-- Invoices + Transactions -->
      <div class="sb-two-col">
        <div class="sb-col">
          <section class="sb-panel">
            <div class="sb-panel-head">
              <h3 class="sb-panel-title">Invoices &amp; Receipts</h3>
              <button type="button" class="sb-panel-link" @click="openStripePortal">View all</button>
            </div>
            <button type="button" class="sb-invoice-empty" @click="openStripePortal">
              <span class="sb-ie-icon">
                <Icon name="heroicons:document-text" class="sb-ie-svg" />
              </span>
              <span class="sb-ie-text">
                <span class="sb-ie-title">View past invoices</span>
                <span class="sb-ie-meta">All receipts live on the Stripe portal — tap to open.</span>
              </span>
              <Icon name="heroicons:chevron-right" class="sb-ie-chev" />
            </button>
          </section>

          <section class="sb-panel">
            <div class="sb-panel-head">
              <h3 class="sb-panel-title">Billing address</h3>
            </div>
            <article class="sb-addr-card">
              <span class="sb-addr-pin">
                <Icon name="heroicons:map-pin" class="sb-addr-pin-ic" />
              </span>
              <div class="sb-addr-body">
                <p class="sb-addr-line1">12, London Road</p>
                <p class="sb-addr-line2">Kingston-upon-Thames</p>
                <p class="sb-addr-line2">Surrey KT1 1AE</p>
                <p class="sb-addr-since">Added: August 3, 2023</p>
              </div>
              <button type="button" class="sb-addr-edit">
                <Icon name="heroicons:pencil-square" class="sb-addr-edit-ic" /> Edit Address
              </button>
            </article>
            <button type="button" class="sb-add-addr-btn">
              <Icon name="heroicons:plus" class="sb-add-addr-ic" /> Add New Billing Address
            </button>
          </section>
        </div>

        <div class="sb-col">
          <section class="sb-panel sb-panel--fill">
            <div class="sb-panel-head">
              <h3 class="sb-panel-title">Transaction history</h3>
              <button type="button" class="sb-panel-link" @click="openStripePortal">View all</button>
            </div>
            <div class="sb-tx-list">
              <button v-for="tx in transactions" :key="tx.invoice" type="button" class="sb-tx-row">
                <span class="sb-tx-icon">
                  <Icon name="heroicons:document-text" class="sb-tx-icon-svg" />
                </span>
                <div class="sb-tx-body">
                  <div class="sb-tx-top">
                    <span class="sb-badge" :class="tx.badge === 'Renewal' ? 'sb-badge--primary' : 'sb-badge--paid'">
                      {{ tx.badge || 'Paid' }}
                    </span>
                    <span class="sb-tx-inv">Invoice #{{ tx.invoice }}</span>
                  </div>
                  <p v-if="tx.description" class="sb-tx-desc">{{ tx.description }}</p>
                  <p class="sb-tx-amount">£{{ tx.amount }} · {{ tx.date }}</p>
                </div>
                <Icon name="heroicons:chevron-right" class="sb-tx-chev" />
              </button>
            </div>
          </section>
        </div>
      </div>

      <!-- Billing preferences -->
      <section class="sb-panel sb-panel--wide">
        <h3 class="sb-panel-title">Billing preferences</h3>
        <div class="sb-prefs-grid">
          <div class="sb-prefs-col">
            <div v-for="item in billingSwitches" :key="item.label" class="sb-pref-row">
              <span class="sb-pref-ic">
                <Icon name="heroicons:envelope" class="sb-pref-ic-svg" />
              </span>
              <div class="sb-pref-text">
                <p class="sb-pref-label">{{ item.label }}</p>
                <p class="sb-pref-meta">{{ item.meta }}</p>
              </div>
              <button
                type="button"
                class="sb-toggle"
                :class="item.enabled ? 'sb-toggle--on' : ''"
                @click="item.enabled = !item.enabled"
              >
                <span class="sb-toggle-thumb" />
              </button>
            </div>
          </div>
          <div class="sb-prefs-col">
            <div v-for="item in billingActions" :key="item.label" class="sb-action-row">
              <span class="sb-pref-ic">
                <Icon name="heroicons:arrow-path" class="sb-pref-ic-svg" />
              </span>
              <div class="sb-pref-text">
                <p class="sb-pref-label">{{ item.label }}</p>
                <p class="sb-pref-meta">{{ item.value }}</p>
              </div>
              <button type="button" class="sb-change-btn">Change</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Download + Security -->
      <div class="sb-two-col">
        <section class="sb-panel">
          <h3 class="sb-panel-title">Download preferences</h3>
          <div class="sb-action-row sb-action-row--plain">
            <span class="sb-pref-ic">
              <Icon name="heroicons:document-arrow-down" class="sb-pref-ic-svg" />
            </span>
            <div class="sb-pref-text">
              <p class="sb-pref-label">Format: PDF</p>
              <p class="sb-pref-meta">Include: All transaction details</p>
            </div>
            <button type="button" class="sb-change-btn">Change</button>
          </div>
        </section>

        <section class="sb-panel">
          <h3 class="sb-panel-title">Security</h3>
          <div v-for="item in securitySwitches" :key="item.label" class="sb-pref-row sb-pref-row--plain">
            <span class="sb-pref-ic">
              <Icon :name="item.icon" class="sb-pref-ic-svg" />
            </span>
            <div class="sb-pref-text">
              <p class="sb-pref-label">{{ item.label }}</p>
              <p class="sb-pref-meta">{{ item.meta }}</p>
            </div>
            <button
              type="button"
              class="sb-toggle"
              :class="item.enabled ? 'sb-toggle--on' : ''"
              @click="item.enabled = !item.enabled"
            >
              <span class="sb-toggle-thumb" />
            </button>
          </div>
        </section>
      </div>

      <!-- Trust strip -->
      <section class="sb-trust">
        <Icon name="heroicons:shield-check" class="sb-trust-ic" />
        <div class="sb-trust-text">
          <p class="sb-trust-title">Your payment information is securely processed by Stripe.</p>
          <p class="sb-trust-sub">We do not store your card details.</p>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({
  title: "Subscription Plan - UmovingU",
  middleware: 'auth',
})

const { profile, fetchProfile } = useProfile()
onMounted(fetchProfile)

const brandFile = {
  Mastercard: '/op-icons/temp/mastercard.svg',
  VISA: '/op-icons/temp/visa.svg',
  'Apple Pay': '/op-icons/temp/apple.svg',
  'G Pay': '/op-icons/temp/gpay.svg',
  PayPal: '/op-icons/temp/paypal.svg',
  Klarna: '/op-icons/temp/klarna.svg',
}

function brandLogo(brand) {
  if (brand === 'Visa') return brandFile.VISA
  if (brand === 'Mastercard') return brandFile.Mastercard
  return brandFile.VISA
}

const paymentMethods = [
  { name: "Lloyds Bank Card", last4: "4829", brand: "Visa",       expiry: "12/26", primary: true  },
  { name: "Monzo Bank Card",  last4: "3398", brand: "Mastercard", expiry: "11/28", primary: false },
]

const paymentBrands = ["Mastercard", "VISA", "Apple Pay", "G Pay", "PayPal", "Klarna"]

const transactions = [
  { invoice: "UMU-2024-0087", description: "",                                        amount: "29.99",  date: "Aug 04, 2024", badge: "Renewal" },
  { invoice: "UMU-2024-0086", description: "Towards BS Plumbing – Woking",            amount: "47.98",  date: "Aug 10, 2024", badge: "" },
  { invoice: "UMU-2024-0085", description: "Towards Apex Engineering Works – Surrey", amount: "210.00", date: "Aug 10, 2024", badge: "" },
]

const billingSwitches = ref([
  { label: "Billing Email Alerts",  meta: "Receive updates about your billing activity", enabled: false },
  { label: "Invoice Notifications", meta: "Get notified when new invoices are created",  enabled: true  },
  { label: "Promotional Offers",    meta: "Receive offers and product updates",          enabled: true  },
])

const billingActions = [
  { label: "Billing Cycle", value: "Monthly billing (15th of each month)" },
  { label: "Auto-renewal",  value: "Auto-renew subscription" },
]

const securitySwitches = ref([
  { label: "Two-factor authentication for payments", meta: "Add an extra layer of security",  icon: "heroicons:shield-check",         enabled: true },
  { label: "Payment notifications via SMS",          meta: "Get real-time payment updates",    icon: "heroicons:chat-bubble-left-right", enabled: true },
])

const goBack = useGoBack('/profile')

function openStripePortal() {
  window.open('https://billing.stripe.com/p/login/test', '_blank', 'noopener')
}
</script>

<style scoped>
/* ── Shell ──────────────────────────────────────────────────────── */
.sb-shell {
  --fx-aqua: #00a19a;
  --fx-text: #1f2b3f;
  --fx-muted: #6f8199;
  min-height: 100dvh;
  background: linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.sb-body { width: min(1280px, calc(100% - 64px)); margin: 0 auto; padding: 32px 0 64px; }

/* ── Head ───────────────────────────────────────────────────────── */
.sb-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
.sb-title { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #10263d; line-height: 1.1; }
.sb-lede { font-size: 14px; color: #5f7488; margin-top: 6px; }
.sb-secure {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  background: rgba(255, 255, 255, 0.9); border: 1px solid #e6eef8;
  border-radius: 12px; padding: 10px 14px; box-shadow: 0 6px 18px rgba(15, 44, 76, 0.05);
}
.sb-secure-ic { width: 18px; height: 18px; color: #00a19a; }
.sb-secure-text { display: flex; flex-direction: column; line-height: 1.25; }
.sb-secure-top { font-size: 12.5px; font-weight: 700; color: #10263d; }
.sb-secure-sub { font-size: 11px; color: #6f8398; }
.sb-secure-sub strong { color: #635bff; }

/* ── Plan card ──────────────────────────────────────────────────── */
.sb-plan-card {
  display: flex; align-items: center; justify-content: space-between; gap: 32px;
  border-radius: 24px; padding: 32px 40px; margin-bottom: 28px;
  background: #fff; border: 1px solid #e6eef8; box-shadow: 0 14px 38px rgba(15, 44, 76, 0.06);
  overflow: hidden;
}
.sb-plan-text { flex: 1; min-width: 0; }
.sb-plan-label { font-size: 11px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase; color: #8a95a0; margin-bottom: 12px; }
.sb-plan-name { font-size: 28px; font-weight: 800; color: #10263d; letter-spacing: -0.5px; }
.sb-plan-price { font-size: 24px; font-weight: 800; color: #00a19a; margin-top: 8px; }
.sb-plan-price span { font-size: 15px; font-weight: 600; color: #6f8398; }
.sb-plan-meta { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.sb-plan-meta li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #4a5868; font-weight: 500; }
.sb-pm-ic { width: 16px; height: 16px; color: #00a19a; flex-shrink: 0; }
.sb-plan-actions { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
.sb-plan-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 48px; padding: 0 24px; border-radius: 14px;
  border: 1.5px solid #d8e2ed; background: #fff; color: #00857f;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.18s;
}
.sb-plan-btn:hover { border-color: #00a19a; background: #f3fbfa; transform: translateY(-1px); }
.sb-pb-ic { width: 16px; height: 16px; }

.sb-plan-art { position: relative; width: 240px; height: 160px; flex-shrink: 0; }
.sb-plan-card-back {
  position: absolute; right: 0; top: 14px; width: 150px; height: 132px;
  border-radius: 18px; background: linear-gradient(150deg, #5fc4bc, #9adcd5);
  transform: rotate(8deg); padding: 16px; box-sizing: border-box;
  box-shadow: 0 10px 24px rgba(0, 161, 154, 0.18);
}
.sb-pcb-label { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.85); }
.sb-plan-card-front {
  position: absolute; left: 0; top: 0; width: 168px; height: 148px;
  border-radius: 18px; background: linear-gradient(150deg, #00a19a, #018a83);
  box-shadow: 0 14px 30px rgba(0, 161, 154, 0.3);
  display: flex; flex-direction: column; justify-content: space-between; padding: 18px;
  box-sizing: border-box;
}
.sb-pcf-label { font-size: 13px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.sb-pcf-crown { width: 48px; height: 48px; color: rgba(255, 255, 255, 0.95); align-self: flex-end; }

/* ── Stripe banner ──────────────────────────────────────────────── */
.sb-stripe {
  display: flex; align-items: center; gap: 16px;
  border-radius: 20px; padding: 22px 26px; margin-bottom: 26px;
  background: linear-gradient(135deg, #221b52, #161335); color: #fff;
  box-shadow: 0 16px 36px rgba(22, 19, 53, 0.28);
}
.sb-stripe-icon { width: 46px; height: 46px; border-radius: 14px; background: rgba(255, 255, 255, 0.14); display: grid; place-items: center; flex-shrink: 0; }
.sb-stripe-svg { width: 22px; height: 22px; }
.sb-stripe-body { flex: 1; min-width: 0; }
.sb-stripe-kicker { font-size: 10.5px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase; color: rgba(255, 255, 255, 0.55); }
.sb-stripe-title { font-size: 17px; font-weight: 800; margin-top: 2px; }
.sb-stripe-sub { font-size: 13px; color: rgba(255, 255, 255, 0.7); margin-top: 2px; }
.sb-stripe-btn {
  display: inline-flex; align-items: center; gap: 7px; flex-shrink: 0;
  height: 44px; padding: 0 20px; border-radius: 12px; border: none; cursor: pointer;
  background: #fff; color: #1a1640; font-size: 14px; font-weight: 800; font-family: inherit;
  transition: transform 0.18s;
}
.sb-stripe-btn:hover { transform: translateY(-2px); }
.sb-stripe-btn-ic { width: 15px; height: 15px; }

/* ── Sections / panels ──────────────────────────────────────────── */
.sb-section { margin-bottom: 26px; }
.sb-section-title { font-size: 17px; font-weight: 800; color: #10263d; letter-spacing: -0.3px; margin-bottom: 14px; }

.sb-panel {
  border-radius: 20px; background: #fff; border: 1px solid #e8eef5;
  box-shadow: 0 10px 30px rgba(15, 44, 76, 0.05); padding: 22px 24px;
}
.sb-panel--wide { margin-bottom: 26px; }
.sb-panel--fill { height: 100%; }
.sb-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sb-panel-title { font-size: 16px; font-weight: 800; color: #10263d; letter-spacing: -0.2px; }
.sb-panel-link { background: none; border: none; font-size: 13px; font-weight: 700; color: #00a19a; cursor: pointer; font-family: inherit; }

/* ── Stored methods ─────────────────────────────────────────────── */
.sb-methods-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 26px; }
.sb-method-card {
  border-radius: 18px; background: #fff; border: 1px solid #e8eef5;
  box-shadow: 0 8px 22px rgba(15, 44, 76, 0.04); padding: 18px 20px;
}
.sb-method-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sb-method-more { background: none; border: none; cursor: pointer; color: #9aa7b6; padding: 2px; }
.sb-method-more-ic { width: 18px; height: 18px; }
.sb-method-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.sb-method-info { min-width: 0; }
.sb-method-name { font-size: 15px; font-weight: 700; color: #10263d; }
.sb-method-pan { font-size: 14px; font-weight: 600; color: #2a3a4d; margin-top: 4px; letter-spacing: 1px; }
.sb-method-meta { font-size: 12.5px; color: #6f8398; margin-top: 4px; }
.sb-method-logo { width: 52px; height: 36px; object-fit: contain; flex-shrink: 0; }

.sb-badge {
  display: inline-flex; align-items: center; height: 22px; padding: 0 10px;
  border-radius: 99px; font-size: 11px; font-weight: 700;
}
.sb-badge--primary { background: rgba(0, 161, 154, 0.12); color: #00857f; }
.sb-badge--muted   { background: rgba(0, 161, 154, 0.12); color: #00857f; }
.sb-badge--paid    { background: rgba(0, 161, 154, 0.1);  color: #00857f; }

.sb-subtitle { font-size: 15px; font-weight: 800; color: #10263d; }
.sb-sub-meta { font-size: 13px; color: #6f8398; margin-top: 3px; margin-bottom: 14px; }
.sb-brands-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.sb-brand-cell {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  height: 78px; border-radius: 16px; border: 1px solid #e6eef8; background: #fff; cursor: pointer;
  font-family: inherit; transition: all 0.18s;
}
.sb-brand-cell:hover { border-color: #00a19a; box-shadow: 0 8px 18px rgba(0, 161, 154, 0.12); }
.sb-brand-cell--klarna { background: #feb4c7; border-color: #feb4c7; }
.sb-brand-img { height: 24px; max-width: 60px; object-fit: contain; }
.sb-brand-label { font-size: 11px; font-weight: 600; color: #4a5868; }
.sb-brand-cell--klarna .sb-brand-label { color: #1a1340; }

/* ── Two-column layouts ─────────────────────────────────────────── */
.sb-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-bottom: 26px; align-items: start; }
.sb-col { display: flex; flex-direction: column; gap: 22px; }

/* Invoices empty */
.sb-invoice-empty {
  display: flex; align-items: center; gap: 14px; width: 100%;
  border-radius: 16px; border: 1px dashed #c2d2e2; background: #f8fbff; padding: 16px 18px;
  cursor: pointer; text-align: left; font-family: inherit; transition: all 0.18s;
}
.sb-invoice-empty:hover { border-color: #00a19a; background: #f3fbfa; }
.sb-ie-icon { width: 40px; height: 40px; border-radius: 12px; background: #eef4fb; color: #5f7488; display: grid; place-items: center; flex-shrink: 0; }
.sb-ie-svg { width: 18px; height: 18px; }
.sb-ie-text { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.sb-ie-title { font-size: 14px; font-weight: 700; color: #10263d; }
.sb-ie-meta { font-size: 12.5px; color: #6f8398; margin-top: 2px; }
.sb-ie-chev { width: 18px; height: 18px; color: #b4c0cd; flex-shrink: 0; }

/* Billing address */
.sb-addr-card {
  display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: start;
  border-radius: 16px; border: 1px solid #e8eef5; background: #fff; padding: 18px;
}
.sb-addr-pin { width: 40px; height: 40px; border-radius: 12px; background: rgba(0, 161, 154, 0.1); color: #00a19a; display: grid; place-items: center; flex-shrink: 0; }
.sb-addr-pin-ic { width: 20px; height: 20px; }
.sb-addr-body { min-width: 0; }
.sb-addr-line1 { font-size: 15px; font-weight: 700; color: #10263d; }
.sb-addr-line2 { font-size: 13px; color: #4a5868; margin-top: 2px; }
.sb-addr-since { font-size: 12px; color: #00857f; margin-top: 6px; }
.sb-addr-edit {
  grid-column: 1 / -1; justify-self: end; display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 14px; border-radius: 10px; border: 1px solid #e3eaf3; background: #fff;
  font-size: 13px; font-weight: 700; color: #4a5868; cursor: pointer; font-family: inherit; transition: all 0.18s;
}
.sb-addr-edit:hover { border-color: #00a19a; color: #00857f; }
.sb-addr-edit-ic { width: 14px; height: 14px; }
.sb-add-addr-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px; width: 100%;
  height: 50px; margin-top: 14px; border-radius: 14px; border: 1.5px dashed #00a19a;
  background: rgba(0, 161, 154, 0.05); color: #00857f; font-size: 14px; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: background 0.18s;
}
.sb-add-addr-btn:hover { background: rgba(0, 161, 154, 0.1); }
.sb-add-addr-ic { width: 18px; height: 18px; }

/* Transactions */
.sb-tx-list { display: flex; flex-direction: column; }
.sb-tx-row {
  display: flex; align-items: center; gap: 14px; width: 100%;
  padding: 16px 4px; border: none; border-bottom: 1px solid #eef2f7;
  background: none; cursor: pointer; text-align: left; font-family: inherit; transition: background 0.15s;
}
.sb-tx-row:last-child { border-bottom: none; }
.sb-tx-row:hover { background: #f8fbff; }
.sb-tx-icon { width: 38px; height: 38px; border-radius: 11px; border: 1px solid #e3eaf3; color: #5f7488; display: grid; place-items: center; flex-shrink: 0; }
.sb-tx-icon-svg { width: 18px; height: 18px; }
.sb-tx-body { flex: 1; min-width: 0; }
.sb-tx-top { display: flex; align-items: center; gap: 10px; }
.sb-tx-inv { font-size: 14px; font-weight: 700; color: #10263d; }
.sb-tx-desc { font-size: 13px; color: #4a5868; margin-top: 4px; }
.sb-tx-amount { font-size: 12.5px; color: #00857f; font-weight: 600; margin-top: 4px; }
.sb-tx-chev { width: 18px; height: 18px; color: #b4c0cd; flex-shrink: 0; }

/* ── Preferences ────────────────────────────────────────────────── */
.sb-prefs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
.sb-prefs-col { display: flex; flex-direction: column; gap: 6px; }
.sb-pref-row, .sb-action-row {
  display: flex; align-items: center; gap: 14px; padding: 14px 4px; border-bottom: 1px solid #eef2f7;
}
.sb-prefs-col .sb-pref-row:last-child, .sb-prefs-col .sb-action-row:last-child { border-bottom: none; }
.sb-pref-row--plain, .sb-action-row--plain { border-bottom: none; padding: 14px 0; }
.sb-pref-ic { width: 38px; height: 38px; border-radius: 11px; background: rgba(0, 161, 154, 0.1); color: #00a19a; display: grid; place-items: center; flex-shrink: 0; }
.sb-pref-ic-svg { width: 18px; height: 18px; }
.sb-pref-text { flex: 1; min-width: 0; }
.sb-pref-label { font-size: 14px; font-weight: 700; color: #10263d; }
.sb-pref-meta { font-size: 12.5px; color: #6f8398; margin-top: 2px; }
.sb-change-btn {
  height: 38px; padding: 0 18px; border-radius: 11px; border: 1px solid #e3eaf3; background: #fff;
  font-size: 13.5px; font-weight: 700; color: #00857f; cursor: pointer; font-family: inherit;
  flex-shrink: 0; transition: all 0.18s;
}
.sb-change-btn:hover { border-color: #00a19a; background: #f3fbfa; }

/* ── Toggle ─────────────────────────────────────────────────────── */
.sb-toggle {
  position: relative; width: 46px; height: 27px; border-radius: 99px; border: none;
  background: #d9dfe7; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.sb-toggle--on { background: #00a19a; }
.sb-toggle-thumb {
  position: absolute; top: 3px; left: 3px; width: 21px; height: 21px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); transition: transform 0.2s;
}
.sb-toggle--on .sb-toggle-thumb { transform: translateX(19px); }

/* ── Trust strip ────────────────────────────────────────────────── */
.sb-trust {
  display: flex; align-items: center; gap: 14px;
  border-radius: 18px; background: #f1f6fb; border: 1px solid #e3ebf4; padding: 18px 22px;
}
.sb-trust-ic { width: 30px; height: 30px; color: #00a19a; flex-shrink: 0; }
.sb-trust-title { font-size: 13.5px; font-weight: 700; color: #10263d; }
.sb-trust-sub { font-size: 12.5px; color: #6f8398; margin-top: 2px; }

/* ── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 1000px) {
  .sb-body { padding: 28px 0 56px; }
  .sb-brands-row { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 860px) {
  .sb-two-col, .sb-prefs-grid, .sb-methods-grid { grid-template-columns: 1fr; }
  .sb-plan-art { display: none; }
}
@media (max-width: 760px) {
  .sb-body { width: calc(100% - 32px); padding: 24px 0 48px; }
  .sb-head { flex-direction: column; }
  .sb-title { font-size: 26px; }
  .sb-plan-card, .sb-stripe { flex-direction: column; align-items: flex-start; gap: 18px; padding: 22px; }
  .sb-stripe-btn { width: 100%; justify-content: center; }
}
@media (max-width: 480px) {
  .sb-brands-row { grid-template-columns: repeat(2, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .sb-plan-btn, .sb-stripe-btn, .sb-brand-cell, .sb-toggle, .sb-toggle-thumb { transition: none; }
}
</style>
