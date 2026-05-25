<template>
  <div class="mobile-container auth-screen signup-futuristic">

    <div class="signup-bg">
      <div class="signup-orb signup-orb-a" />
      <div class="signup-orb signup-orb-b" />
      <div class="signup-grid" />
      <div class="signup-vignette" />
    </div>

    <!-- Topbar — back button + brand mini -->
    <div class="auth-topbar signup-topbar">
      <button class="auth-back-btn signup-back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="signup-topbar-copy">
        <span class="signup-topbar-kicker">Neural onboarding</span>
        <strong>Build your access in seconds</strong>
      </div>
      <div class="auth-brand-mini signup-brand-mini">
        <OPIcon name="logo" class="w-[26px] h-[26px]" />
      </div>
    </div>

    <div class="signup-shell">
      <section class="signup-visual">
        <div class="signup-badge-row">
          <span class="signup-chip">Secure</span>
          <span class="signup-chip signup-chip--alt">Property-first account creation</span>
        </div>

        <div class="auth-hero signup-hero">
          <div class="auth-hero-eyebrow">Create your account</div>
          <div class="auth-hero-title">Start with your home.</div>
          <div class="auth-hero-sub">A few details and you're in. Your details stay with us — we never share them with third parties.</div>
        </div>

        <div class="signup-image-stack">
          <article class="signup-image-card signup-image-card--large">
            <img src="/images/onboarding_background.jpg" alt="UK house exterior" />
            <div class="signup-image-overlay">
              <span>Instant onboarding</span>
              <strong>Property context before first login</strong>
            </div>
          </article>
          <article class="signup-image-card signup-image-card--small signup-float-a">
            <img src="/welcome-house.png" alt="Sample house" />
          </article>
          <article class="signup-image-card signup-image-card--small signup-float-b">
            <img src="/images/findPropertyBackground.png" alt="Residential property" />
          </article>
        </div>

        <div class="signup-metrics">
          <div>
            <strong>2 min</strong>
            <span>Typical account setup</span>
          </div>
          <div>
            <strong>74</strong>
            <span>Sample HomeScore</span>
          </div>
          <div>
            <strong>1 flow</strong>
            <span>Property + access + passport</span>
          </div>
        </div>
      </section>

      <section class="signup-panel-wrap">
        <form class="auth-form signup-panel" @submit.prevent="handleSubmit">

          <div v-if="formError" class="error-banner">{{ formError }}</div>

          <!-- Email -->
          <div class="form-field">
            <label class="form-label">Email address</label>
            <div class="form-input-wrap">
              <span class="form-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input v-model="form.email" type="email" placeholder="you@example.com" class="form-input with-icon" autocomplete="email" />
            </div>
          </div>

          <!-- Password -->
          <div class="form-field">
            <label class="form-label">Password</label>
            <div class="form-input-wrap">
              <span class="form-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="At least 8 characters" class="form-input with-icon with-action" autocomplete="new-password" />
              <button type="button" class="form-input-action" @click="showPassword = !showPassword">
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Full name -->
          <div class="form-field">
            <label class="form-label">Full name</label>
            <div class="form-input-wrap">
              <span class="form-input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input v-model="form.fullName" type="text" placeholder="Jane Smith" class="form-input with-icon" autocomplete="name" />
            </div>
          </div>

          <!-- Mobile (optional) -->
          <div class="form-field optional">
            <label class="form-label">Mobile number <span class="opt">optional</span></label>
            <PhoneInput v-model="form.mobile" />
            <div class="form-help">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>We only text you about <strong>your Passport</strong> — never marketing.</span>
            </div>
          </div>

          <!-- Postcode (optional) -->
          <div class="form-field optional">
            <label class="form-label">Postcode <span class="opt">optional</span></label>
            <div v-if="selectedAddress" class="address-selected-row">
              <div class="address-selected-body">
                <div class="address-selected-line1">{{ selectedAddress.line1 }}</div>
                <div class="address-selected-line2">{{ selectedAddress.line2 }}</div>
              </div>
              <button type="button" class="address-edit-btn" @click="editAddress">Edit</button>
            </div>
            <PropertySearchInput
              v-else
              placeholder="CV5 6AJ"
              variant="light"
              @select="onAddressSelect"
            />
            <div class="postcode-prompt">
              <div class="postcode-prompt-h">See your home's HomeScore the moment you sign in</div>
              <div class="postcode-prompt-text">Add your postcode and we'll show you what your home tells us — bills, value, comparisons. You can skip this and add it later.</div>
            </div>
          </div>

          <!-- Marketing opt-in -->
          <label class="checkbox-row">
            <span class="checkbox-box" :class="{ checked: form.marketingOptIn }">
              <input v-model="form.marketingOptIn" type="checkbox" hidden />
            </span>
            <span class="checkbox-text">Email me occasional product updates and tips. We won't spam you — and you can unsubscribe in one tap.</span>
          </label>

          <button type="submit" class="btn-primary btn-primary--futuristic" :disabled="isLoading">
            <span v-if="isLoading" class="spinner" />
            {{ isLoading ? 'Creating account…' : 'Create account' }}
          </button>

          <div class="terms-text">
            By continuing you agree to our
            <NuxtLink to="/legal/terms" target="_blank">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/legal/privacy" target="_blank">Privacy Policy</NuxtLink>.
          </div>
        </form>

        <div class="auth-footer signup-footer">
          Already have an account? <NuxtLink to="/onboarding/signin">Sign in</NuxtLink>
        </div>
      </section>
    </div>

    <TermsModal
      :show="showTermsModal"
      @update:show="showTermsModal = $event"
      @accept="showTermsModal = false"
      @close="showTermsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSession } from '~/composables/useSession'
import { toTitleCase } from '~/utils/form-helpres'
import PhoneInput from '~/components/form/PhoneInput.vue'
import PropertySearchInput from '~/components/property/PropertySearchInput.vue'
import TermsModal from '~/components/modals/TermsModal.vue'
import OPIcon from '~/components/ui/OPIcon.vue'

definePageMeta({
  title: 'Create Account - UmovingU',
  middleware: 'guest',
})

const config = useRuntimeConfig()
const { requestOtp } = useAuth()
const { email, pendingSignup } = useSession()

const form = reactive({
  fullName: '',
  email: '',
  mobile: '',
  postcode: '',
  password: '',
  marketingOptIn: false,
})

const showPassword = ref(false)
const formError = ref('')
const isLoading = ref(false)
const showTermsModal = ref(false)

const selectedAddress = ref<{ id: number; line1: string; line2: string; postcode?: string } | null>(null)

const onAddressSelect = (property: any) => {
  selectedAddress.value = {
    id: 1,
    line1: toTitleCase(property.addressLine1 ?? ''),
    line2: [property.city ? toTitleCase(property.city) : null, property.postcode?.toUpperCase()]
      .filter(Boolean)
      .join(', '),
    postcode: property.postcode?.toUpperCase(),
  }
  form.postcode = selectedAddress.value.postcode ?? selectedAddress.value.line1
}

const editAddress = () => {
  selectedAddress.value = null
  form.postcode = ''
}

const parseApiError = (err: any): string => {
  const msg = err?.data?.message
  if (Array.isArray(msg)) return msg.join('. ')
  return msg || 'Something went wrong. Please try again.'
}

const handleSubmit = async () => {
  formError.value = ''

  const cleanEmail = form.email.trim().toLowerCase()

  if (!form.fullName.trim()) {
    formError.value = 'Please enter your full name.'
    return
  }
  if (!cleanEmail) {
    formError.value = 'Please enter your email address.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    formError.value = 'Please enter a valid email address.'
    return
  }
  if (form.password.length < 8) {
    formError.value = 'Password must be at least 8 characters.'
    return
  }

  const parts = form.fullName.trim().split(/\s+/)
  const firstName = parts[0] ?? ''
  const lastName = parts.slice(1).join(' ')

  isLoading.value = true
  try {
    const { exists } = await $fetch<{ exists: boolean }>(
      `${config.public.apiBase}/auth/check-email`,
      { method: 'POST', body: { email: cleanEmail } },
    )

    if (exists) {
      formError.value = 'An account with this email already exists.'
      return
    }

    pendingSignup.value = {
      firstName,
      lastName,
      phone: form.mobile,
      postcode: form.postcode,
      password: form.password,
    }

    email.value = cleanEmail
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('umu-pending-email', cleanEmail)
    }

    await requestOtp(cleanEmail)
    await navigateTo('/onboarding/verification')
  } catch (err: any) {
    formError.value = parseApiError(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-screen {
  background: #fff;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* Topbar */
.auth-topbar {
  display: flex;
  align-items: center;
  padding: 16px 22px 4px;
  gap: 10px;
}
.auth-back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fafafa;
  color: #231d45;
  border: 1px solid #ececef;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.auth-back-btn svg { width: 14px; height: 14px; }
.auth-spacer { flex: 1; }
.auth-brand-mini {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero */
.auth-hero {
  padding: 18px 24px 4px;
}
.auth-hero-eyebrow {
  font-size: 10px;
  font-weight: 800;
  color: #007e78;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.auth-hero-title {
  font-size: 30px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -1px;
  line-height: 1.05;
  margin-bottom: 10px;
}
.auth-hero-sub {
  font-size: 13.5px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.55;
  letter-spacing: -0.05px;
}

/* Form */
.auth-form { padding: 22px 24px 18px; }
.form-field { margin-bottom: 14px; }
.form-field.optional .form-label { color: #6b6783; }

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.1px;
  margin-bottom: 6px;
}
.form-label .opt {
  font-size: 11px;
  font-weight: 600;
  color: #9c98ad;
  margin-left: 4px;
  letter-spacing: 0;
}

.form-input-wrap { position: relative; }
.form-input {
  width: 100%;
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  padding: 13px 14px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #231d45;
  letter-spacing: -0.1px;
  transition: all 0.15s;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.10);
}
.form-input::placeholder { color: #9c98ad; font-weight: 500; }
.form-input.with-icon { padding-left: 40px; }
.form-input.with-action { padding-right: 44px; }

.form-input-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #9c98ad;
  pointer-events: none;
}
.form-input-icon svg { width: 16px; height: 16px; display: block; }

.form-input-action {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: #9c98ad;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-input-action:hover { color: #007e78; }
.form-input-action svg { width: 16px; height: 16px; }

.form-help {
  font-size: 11px;
  font-weight: 600;
  color: #9c98ad;
  margin-top: 6px;
  line-height: 1.45;
  letter-spacing: -0.05px;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.form-help svg {
  width: 12px;
  height: 12px;
  color: #00a19a;
  flex-shrink: 0;
  margin-top: 2px;
}
.form-help strong { color: #6b6783; font-weight: 800; }

/* PhoneInput visual alignment */
:deep(.phone-field) {
  background: #fff;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  height: 50px;
}
:deep(.phone-field--focused) {
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.10);
}
:deep(.number-input) { font-size: 14px; color: #231d45; font-weight: 600; }
:deep(.country-dial) { color: #231d45; }

/* Postcode prompt callout */
.postcode-prompt {
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  border-radius: 12px;
  padding: 12px 14px;
  margin-top: 8px;
}
.postcode-prompt-h {
  font-size: 11px;
  font-weight: 800;
  color: #007e78;
  margin-bottom: 4px;
  letter-spacing: -0.05px;
}
.postcode-prompt-text {
  font-size: 11.5px;
  font-weight: 500;
  color: #231d45;
  line-height: 1.45;
  letter-spacing: -0.05px;
}

/* Selected address pill */
.address-selected-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f1f9f4;
  border: 1.5px solid #e2f1ea;
  border-radius: 12px;
  padding: 12px 14px;
}
.address-selected-body { flex: 1; min-width: 0; }
.address-selected-line1 {
  font-size: 13.5px;
  font-weight: 700;
  color: #231d45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.address-selected-line2 {
  font-size: 11.5px;
  color: #4a5568;
  margin-top: 2px;
}
.address-edit-btn {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 700;
  color: #00a19a;
  cursor: pointer;
  padding: 4px 8px;
  flex-shrink: 0;
}

/* Marketing checkbox */
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
  padding: 0 4px;
  cursor: pointer;
}
.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid #ececef;
  border-radius: 5px;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
  transition: all 0.15s;
}
.checkbox-box.checked {
  background: #00a19a;
  border-color: #00a19a;
}
.checkbox-box.checked::after {
  content: '';
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translate(1px, -1px);
}
.checkbox-text {
  font-size: 12px;
  font-weight: 600;
  color: #6b6783;
  line-height: 1.45;
  letter-spacing: -0.05px;
}

/* Primary button — teal pill */
.btn-primary {
  width: 100%;
  background: #00a19a;
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  padding: 14px 18px;
  border-radius: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: -0.2px;
  transition: all 0.18s;
  margin-top: 14px;
}
.btn-primary:hover { background: #00b6ae; }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.terms-text {
  font-size: 11px;
  font-weight: 500;
  color: #9c98ad;
  text-align: center;
  line-height: 1.5;
  margin-top: 14px;
  padding: 0 8px;
  letter-spacing: -0.05px;
}
.terms-text a {
  color: #007e78;
  font-weight: 700;
  cursor: pointer;
}

.auth-footer {
  font-size: 13px;
  font-weight: 600;
  color: #6b6783;
  text-align: center;
  padding: 16px 24px 24px;
  letter-spacing: -0.05px;
}
.auth-footer a {
  color: #00a19a;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
}
.auth-footer a:hover { color: #0d928b; }

.error-banner {
  margin-bottom: 14px;
  padding: 12px 14px;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.25);
  border-radius: 12px;
  color: #dc2626;
  font-size: 13px;
  line-height: 1.5;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.auth-screen.signup-futuristic {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-panel-border: #d8e3ef;
  background:
    radial-gradient(circle at 8% 11%, rgba(13, 191, 181, 0.2) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.18) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: #1f2b3f;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;
}

.signup-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.signup-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.04;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 92%);
}

.signup-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(248, 251, 255, 0.66) 64%, rgba(238, 244, 249, 0.88) 100%);
}

.signup-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(36px);
  animation: drift 16s ease-in-out infinite;
}

.signup-orb-a {
  top: 8%;
  left: 2%;
  width: 280px;
  height: 280px;
  background: rgba(0, 161, 154, 0.3);
}

.signup-orb-b {
  right: -3%;
  top: 18%;
  width: 340px;
  height: 340px;
  background: rgba(95, 139, 255, 0.26);
  animation-duration: 21s;
}

.signup-topbar,
.signup-shell,
.signup-panel-wrap,
.signup-footer {
  position: relative;
  z-index: 1;
}

.signup-topbar {
  padding: 16px 20px 6px;
}

.signup-back-btn {
  background: rgba(255, 255, 255, 0.88);
  color: #1f2b3f;
  border-color: #d4dfeb;
  backdrop-filter: blur(12px);
}

.signup-topbar-copy {
  flex: 1;
  text-align: center;
  color: #50637f;
}

.signup-topbar-kicker {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00857f;
  margin-bottom: 2px;
}

.signup-topbar-copy strong {
  display: block;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.signup-brand-mini {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #d4dfeb;
  border-radius: 999px;
  width: 38px;
  height: 38px;
  backdrop-filter: blur(12px);
}

.signup-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 18px 0 30px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 28px;
  align-items: start;
}

.signup-visual {
  padding: 14px 0 0;
}

.signup-panel-wrap {
  position: relative;
  padding-top: 8px;
}

.signup-badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.signup-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 11px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #1f2b3f;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 1px solid #d8e3ef;
}

.signup-chip--alt {
  background: #eafaf7;
  color: #00857f;
}

.signup-hero { padding: 0; }

.signup-hero .auth-hero-eyebrow,
.signup-hero .auth-hero-sub {
  color: #586a83;
}

.signup-hero .auth-hero-title {
  color: #18263b;
  font-size: clamp(34px, 4.8vw, 56px);
  line-height: 1;
  letter-spacing: -1.3px;
  font-weight: 650;
}

.signup-image-stack {
  margin-top: 18px;
  position: relative;
  min-height: 312px;
}

.signup-image-card {
  position: absolute;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #d8e3ee;
  box-shadow: 0 18px 32px rgba(33, 61, 98, 0.08);
  backdrop-filter: blur(8px);
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

.signup-image-card::before {
  content: '';
  position: absolute;
  inset: -150% auto auto -42%;
  width: 54%;
  height: 320%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.38) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(16deg);
  transition: transform 0.78s ease;
  pointer-events: none;
}

.signup-image-card:hover {
  transform: translateY(-8px) scale(1.012);
  border-color: #b9d5ea;
  box-shadow: 0 26px 40px rgba(31, 64, 102, 0.18);
}

.signup-image-card:hover::before {
  transform: translateX(220%) rotate(16deg);
}

.signup-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

.signup-image-card:hover img {
  transform: scale(1.05);
}

.signup-image-card--large {
  left: 0;
  top: 0;
  width: min(100%, 460px);
  height: 296px;
}

.signup-image-card--small {
  width: 160px;
  height: 160px;
}

.signup-image-card--small:nth-of-type(2) {
  left: auto;
  right: 8px;
  top: auto;
  bottom: -4px;
}

.signup-image-card--small:nth-of-type(3) {
  display: none;
}

.signup-image-overlay {
  position: absolute;
  inset: auto 16px 16px 16px;
  padding: 12px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(24, 38, 59, 0.16), rgba(24, 38, 59, 0.72));
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.signup-image-overlay span {
  display: block;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9beee9;
  font-weight: 800;
}

.signup-image-overlay strong {
  display: block;
  margin-top: 6px;
  font-size: 18px;
  line-height: 1.15;
  letter-spacing: -0.4px;
  font-weight: 700;
}

.signup-float-a {
  animation: float 8s ease-in-out infinite;
}

.signup-float-b {
  animation: float 11s ease-in-out infinite reverse;
}

.signup-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.signup-metrics > div {
  padding: 13px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid #d9e4ee;
  backdrop-filter: blur(12px);
  transition:
    transform 0.26s ease,
    border-color 0.26s ease,
    box-shadow 0.26s ease;
}

.signup-metrics > div:hover {
  transform: translateY(-3px);
  border-color: #c4dbef;
  box-shadow: 0 14px 24px rgba(35, 64, 102, 0.14);
}

.signup-metrics strong {
  display: block;
  font-size: 23px;
  line-height: 1;
  letter-spacing: -0.7px;
  color: #18293f;
}

.signup-metrics span {
  display: block;
  margin-top: 6px;
  color: #60728c;
  font-size: 11px;
}

.signup-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--fx-panel-border);
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 20px 34px rgba(32, 60, 96, 0.08);
  backdrop-filter: blur(18px);
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.signup-panel:hover {
  transform: translateY(-4px);
  border-color: #bdd6ea;
  box-shadow: 0 24px 38px rgba(32, 60, 96, 0.14);
}

.signup-panel .btn-primary {
  margin-top: 8px;
}

.signup-panel .form-label,
.signup-panel .terms-text,
.signup-panel .auth-footer,
.signup-panel .form-help,
.signup-panel .postcode-prompt-text,
.signup-panel .postcode-prompt-h,
.signup-panel .checkbox-text,
.signup-panel .address-selected-line2,
.signup-panel .opt {
  color: #586a83;
}

.signup-panel .form-label,
.signup-panel .postcode-prompt-h {
  color: #18263b;
}

.signup-panel .form-input,
.signup-panel :deep(.phone-field) {
  background: #ffffff;
  border-color: #d2dcea;
  color: #1f2b3f;
}

.signup-panel .form-input::placeholder,
.signup-panel :deep(.number-input::placeholder) {
  color: #8ea3bc;
}

.signup-panel .form-input:focus,
.signup-panel :deep(.phone-field--focused) {
  border-color: #8ab4db;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
}

.signup-panel .form-input-icon,
.signup-panel .form-input-action,
.signup-panel :deep(.country-dial) {
  color: #60728c;
}

.signup-panel .address-selected-row,
.signup-panel .postcode-prompt {
  background: #f8fbff;
  border-color: #d2dcea;
}

.signup-panel .address-selected-line1,
.signup-panel .postcode-prompt-text,
.signup-panel .form-help strong,
.signup-panel .terms-text a,
.signup-panel .auth-footer a {
  color: #1e2b41;
}

.signup-panel .checkbox-box {
  background: #ffffff;
  border-color: #d2dcea;
}

.signup-panel .checkbox-box.checked {
  background: linear-gradient(135deg, #00a19a, #1a79c8);
  border-color: transparent;
}

.btn-primary--futuristic {
  position: relative;
  overflow: hidden;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.btn-primary--futuristic::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.16) 50%, transparent 100%);
  transform: translateX(-120%);
  animation: sheen 4.8s ease-in-out infinite;
}

.btn-primary--futuristic:hover {
  background: linear-gradient(135deg, #00aba4, #2384d8);
}

.signup-panel .error-banner {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #be123c;
}

.signup-footer {
  color: #586a83;
  padding-top: 14px;
}

.signup-footer a {
  color: #00a19a;
}

@keyframes sheen {
  0%,
  55% { transform: translateX(-120%); }
  80%,
  100% { transform: translateX(120%); }
}

@keyframes drift {
  0%,
  100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(18px, -20px, 0) scale(1.08); }
}

@keyframes float {
  0%,
  100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 1040px) {
  .signup-shell {
    grid-template-columns: 1fr;
    width: calc(100% - 28px);
  }

  .signup-image-stack {
    min-height: 320px;
  }

  .signup-image-card--large {
    width: min(100%, 520px);
  }
}

@media (max-width: 760px) {
  .signup-topbar {
    padding: 14px 16px 6px;
  }

  .signup-shell {
    width: calc(100% - 24px);
    padding-bottom: 18px;
  }

  .signup-visual {
    padding-top: 10px;
  }

  .signup-hero .auth-hero-title {
    font-size: 38px;
  }

  .signup-image-stack {
    min-height: 230px;
  }

  .signup-image-card--large {
    width: 100%;
    height: 220px;
  }

  .signup-image-card--small {
    width: 102px;
    height: 102px;
  }

  .signup-image-card--small:nth-of-type(2) {
    right: 0;
    bottom: -4px;
  }

  .signup-metrics {
    grid-template-columns: 1fr;
  }

  .signup-panel {
    padding: 18px;
    border-radius: 24px;
  }
}
</style>
