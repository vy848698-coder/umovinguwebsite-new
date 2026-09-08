<template>
  <Teleport to="body">
    <Transition name="pe-fade">
      <div v-if="open" class="pe-overlay" @click.self="$emit('close')">
        <Transition name="pe-rise" appear>
          <div
            v-if="open"
            class="pe-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pe-title"
            @click.stop
          >
            <button type="button" class="pe-close" aria-label="Close" @click="$emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div class="pe-scroll">
              <!-- ── Hero ── -->
              <div class="pe-hero">
                <div class="pe-hero-text">
                  <h2 id="pe-title" class="pe-hero-title">One home.<br />Many passports<span class="pe-dot">.</span></h2>
                  <p class="pe-hero-sub">One permanent record.<br />Built for every journey.</p>
                  <p class="pe-hero-desc">
                    Your Property Passport is the foundation. When life changes, unlock new
                    roles with the right passport for the next chapter.
                  </p>
                </div>
                <img
                  src="/op-icons/misc/passportGroupOnTile.png"
                  alt="Seller, Landlord, Buyer and Tenant Passport covers"
                  class="pe-hero-group"
                  loading="lazy"
                />
              </div>

              <!-- ── Ecosystem blurb ── -->
              <div class="pe-blurb">
                <img src="/homescore-icon/house.png" alt="" class="pe-blurb-ic" loading="lazy" />
                <div>
                  <p class="pe-blurb-eyebrow">A passport ecosystem that moves with you</p>
                  <p class="pe-blurb-desc">
                    Built once. Reuse always. Your verified information flows seamlessly
                    between passports, saving you time, effort and money on every step you
                    buy, sell, live or rent.
                  </p>
                </div>
              </div>

              <!-- ── The four passports ── -->
              <div class="pe-cards">
                <button
                  v-for="c in passportCards"
                  :key="c.key"
                  type="button"
                  class="pe-card"
                  :class="{ 'pe-card--disabled': c.status === 'soon' }"
                  :disabled="c.status === 'soon'"
                  @click="onCardClick(c)"
                >
                  <img :src="c.img" :alt="`${c.title} cover`" class="pe-card-book" loading="lazy" />
                  <span class="pe-card-title" :style="{ color: c.color }">{{ c.title }}</span>
                  <span class="pe-card-desc">{{ c.desc }}</span>
                  <span class="pe-card-pill" :class="`pe-card-pill--${c.status}`">{{ c.statusLabel }}</span>
                </button>
              </div>

              <!-- ── The power of the ecosystem ── -->
              <div class="pe-power">
                <p class="pe-power-title">The power of the ecosystem</p>
                <div class="pe-power-list">
                  <template v-for="(item, i) in powerItems" :key="item.title">
                    <div class="pe-power-col">
                      <span class="pe-power-plate">
                        <img :src="item.img" alt="" class="pe-power-ic" loading="lazy" />
                      </span>
                      <span class="pe-power-item-title">{{ item.title }}</span>
                      <span class="pe-power-item-desc">{{ item.desc }}</span>
                    </div>
                    <span v-if="i < powerItems.length - 1" class="pe-power-connector" aria-hidden="true" />
                  </template>
                </div>
              </div>

              <!-- ── Footer strip ── -->
              <div class="pe-footer">
                <p class="pe-footer-tag">Your journey. <span>Our ecosystem.</span></p>
                <div class="pe-footer-links">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
                    Secure by design
                  </span>
                  <span>umovingu.com</span>
                  <span>legal@umu.com</span>
                  <NuxtLink to="/legal/terms">Terms &amp; conditions</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <AuthGateModal
      v-model="authGateOpen"
      :title="authGateCopy.title"
      :body="authGateCopy.body"
      redirect-target="/dashboard"
    />
  </Teleport>
</template>

<script setup lang="ts">
// The passport ecosystem, as a modal. Ported from the reference app's bottom
// sheet, rebuilt as a centred desktop dialog. The same content also exists as
// a section on /explore - this component is the on-demand version for pages
// that only want to offer it, not lead with it.
import { ref } from 'vue'
import AuthGateModal from '~/components/ui/AuthGateModal.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const authGateOpen = ref(false)
const authGateCopy = ref({ title: '', body: '' })

// Cover-art note from the reference app: seller/landlord reuse the
// *_tilted_right_on_tile.png asset, which is branded "Property Passport" on
// the cover rather than the role - role-specific art only exists for buyer and
// tenant. The title under each cover is correct either way.
const passportCards = [
  {
    key: 'seller',
    img: '/op-icons/passport-covers/seller_tilted_right_on_tile.png',
    title: 'Seller Passport',
    color: '#00858a',
    desc: 'Prove accuracy and promote. Gain buyer confidence. Streamline every step to settlement.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'landlord',
    img: '/op-icons/passport-covers/landlord_tilted_right_on_tile.png',
    title: 'Landlord Passport',
    color: '#4b2e83',
    desc: 'Proof of trust and care of your asset. Stronger tenants. Fewer surprises.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'buyer',
    img: '/op-icons/passport-covers/buyer_tilted_right_on_tile.png',
    title: 'Buyer Passport',
    color: '#c9601a',
    desc: 'A clear, confident purchase journey with less stress, more certainty.',
    status: 'now',
    statusLabel: 'AVAILABLE NOW',
  },
  {
    key: 'tenant',
    img: '/op-icons/passport-covers/tenant_tilted_right_on_tile.png',
    title: 'Tenant Passport',
    color: '#4a4a52',
    desc: 'Your trusted profile simplifies rental applications and makes life easier.',
    status: 'soon',
    statusLabel: 'AVAILABLE SOON',
  },
]

const powerItems = [
  {
    title: 'One verified foundation',
    desc: 'Maximise trust, reduce rework and eliminate lost information.',
    img: '/op-icons/onboarding/trustShield.png',
  },
  {
    title: 'Reuse across roles',
    desc: "Move your data wherever you're heading next.",
    img: '/op-icons/investment/refreshArrows.png',
  },
  {
    title: 'Save time & money',
    desc: 'Fewer forms. Faster decisions. More wins.',
    img: '/op-icons/calendar/clock.png',
  },
  {
    title: 'Secure for life',
    desc: 'Your data. Your control. Encrypted and always yours.',
    img: '/op-icons/matched-buyers/lock-big.png',
  },
  {
    title: 'More value for you',
    desc: 'Unlock stronger offers and a stronger property outcome.',
    img: '/op-icons/investment/growthChart.png',
  },
]

const ROLE_COPY: Record<string, { title: string; body: string }> = {
  seller: {
    title: 'Sign in to start your Seller Passport',
    body: 'Create a free account to verify your home and build a Seller Passport buyers can trust.',
  },
  landlord: {
    title: 'Sign in to start your Landlord Passport',
    body: 'Create a free account to build a Landlord Passport — compliance, tenancy documents and more, all in one place.',
  },
  buyer: {
    title: 'Sign in to start your Buyer Passport',
    body: 'Create a free account to build a verified Buyer Passport and move with more confidence.',
  },
}

function hasToken(): boolean {
  return typeof localStorage !== 'undefined' && !!localStorage.getItem('token')
}

// A guest picking a role needs an account first, with copy naming the role
// they picked; someone already signed in goes straight to their dashboard.
function onCardClick(card: { key: string; status: string }) {
  if (card.status === 'soon') return
  emit('close')
  if (hasToken()) {
    navigateTo('/dashboard')
    return
  }
  authGateCopy.value = ROLE_COPY[card.key] ?? {
    title: 'Sign in to continue',
    body: 'Create a free account to get started.',
  }
  authGateOpen.value = true
}
</script>

<style scoped>
.pe-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(35, 29, 69, 0.42);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #231d45;
}

.pe-modal {
  position: relative;
  width: min(980px, 100%);
  max-height: min(88vh, 900px);
  border-radius: 28px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 40px 90px rgba(35, 29, 69, 0.28);
}
.pe-scroll {
  max-height: min(88vh, 900px);
  overflow-y: auto;
  padding: 38px 38px 34px;
}
.pe-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(35, 29, 69, 0.1);
  background: #fff;
  color: #6b7089;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;
}
.pe-close:hover { background: #f3f2f7; color: #231d45; }
.pe-close svg { width: 17px; height: 17px; }

/* Hero */
.pe-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  margin-bottom: 26px;
}
.pe-hero-text { min-width: 0; }
.pe-hero-title {
  margin: 0 0 12px;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.1;
  color: #231d45;
}
.pe-dot { color: #00a19a; }
.pe-hero-sub {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.42;
  color: #00a19a;
}
.pe-hero-desc {
  margin: 0;
  max-width: 54ch;
  font-size: 14.5px;
  font-weight: 500;
  line-height: 1.65;
  color: #5c627c;
}
.pe-hero-group {
  width: min(220px, 34%);
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
  filter: drop-shadow(0 18px 30px rgba(35, 29, 69, 0.18));
}

/* Blurb */
.pe-blurb {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 20px 22px;
  margin-bottom: 24px;
  border-radius: 20px;
  background: #f4f6fc;
  border: 1px solid rgba(35, 29, 69, 0.06);
}
.pe-blurb-ic { width: 54px; height: 54px; flex-shrink: 0; object-fit: contain; }
.pe-blurb-eyebrow {
  margin: 0 0 7px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #00a19a;
}
.pe-blurb-desc {
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.6;
  color: #5c627c;
}

/* Cards */
.pe-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}
.pe-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px 20px 20px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.09);
  box-shadow: 0 8px 22px rgba(31, 61, 98, 0.05);
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.pe-card:hover:not(:disabled),
.pe-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 161, 154, 0.42);
  box-shadow: 0 18px 36px rgba(31, 61, 98, 0.12);
  outline: none;
}
.pe-card--disabled { cursor: default; background: #faf9fb; box-shadow: none; }
.pe-card--disabled .pe-card-title,
.pe-card--disabled .pe-card-desc { opacity: 0.62; }
.pe-card-book {
  width: 58px;
  height: 72px;
  object-fit: contain;
  margin-bottom: 15px;
  filter: drop-shadow(0 8px 16px rgba(35, 29, 69, 0.18));
}
.pe-card-title {
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 7px;
}
.pe-card-desc {
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.55;
  color: #6b7089;
  margin-bottom: 15px;
}
.pe-card-pill {
  margin-top: auto;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
}
.pe-card-pill--now {
  background: #e6f6f4;
  border: 1px solid rgba(0, 161, 154, 0.26);
  color: #00776f;
}
.pe-card-pill--soon {
  background: #f2f1f6;
  border: 1px solid rgba(35, 29, 69, 0.08);
  color: #8a90a6;
}

/* Power rail */
.pe-power {
  margin-top: 26px;
  padding: 28px 24px 24px;
  border-radius: 22px;
  background: #f7f7fb;
  border: 1px solid rgba(35, 29, 69, 0.06);
}
.pe-power-title {
  margin: 0 0 26px;
  text-align: center;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #8a90a6;
}
.pe-power-list {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}
.pe-power-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.pe-power-plate {
  display: grid;
  place-items: center;
  width: 66px;
  height: 66px;
  border-radius: 20px;
  margin-bottom: 13px;
  background: #fff;
  border: 1px solid rgba(35, 29, 69, 0.07);
  box-shadow: 0 6px 16px rgba(31, 61, 98, 0.06);
}
.pe-power-ic { width: 40px; height: 40px; object-fit: contain; }
.pe-power-item-title {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #231d45;
  margin-bottom: 5px;
}
.pe-power-item-desc {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #6b7089;
}
.pe-power-connector {
  flex: 0 0 auto;
  align-self: center;
  width: 22px;
  height: 1px;
  margin-top: -46px;
  background: repeating-linear-gradient(90deg, rgba(35, 29, 69, 0.2) 0 4px, transparent 4px 8px);
}

/* Footer */
.pe-footer {
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid rgba(35, 29, 69, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
}
.pe-footer-tag {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #231d45;
}
.pe-footer-tag span { color: #00a19a; }
.pe-footer-links {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 12.5px;
  font-weight: 600;
  color: #8a90a6;
}
.pe-footer-links span,
.pe-footer-links a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: inherit;
  text-decoration: none;
}
.pe-footer-links a:hover { color: #00a19a; }
.pe-footer-links svg { width: 14px; height: 14px; color: #00a19a; }

/* Transitions */
.pe-fade-enter-active,
.pe-fade-leave-active { transition: opacity 0.2s ease; }
.pe-fade-enter-from,
.pe-fade-leave-to { opacity: 0; }
.pe-rise-enter-active { transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.26s ease; }
.pe-rise-enter-from { transform: translateY(18px) scale(0.98); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .pe-fade-enter-active,
  .pe-fade-leave-active,
  .pe-rise-enter-active { transition: none; }
}

@media (max-width: 900px) {
  .pe-overlay { padding: 12px; align-items: flex-end; }
  .pe-modal { max-height: 92vh; border-radius: 24px 24px 0 0; }
  .pe-scroll { max-height: 92vh; padding: 30px 22px 26px; }
  .pe-hero { flex-direction: column; align-items: flex-start; gap: 20px; }
  .pe-hero-title { font-size: 27px; }
  .pe-hero-group { width: min(200px, 58%); align-self: center; }
  .pe-blurb { flex-direction: column; gap: 12px; }
  .pe-power-list { flex-wrap: wrap; justify-content: center; gap: 22px 10px; }
  .pe-power-col { flex: 0 0 calc(50% - 12px); }
  .pe-power-connector { display: none; }
  .pe-footer { flex-direction: column; align-items: flex-start; }
}
</style>
