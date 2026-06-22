<template>
  <div class="signup-split">
    <!-- ── Left brand panel (dark) ── -->
    <aside class="signup-aside">
      <div class="signup-aside-top">
        <div class="signup-logo">
          <span class="signup-logo-mark"><img src="/op-icons/logo.svg" alt="umu" /></span>
          <strong>umovingu</strong>
        </div>
        <button class="signup-website-btn" type="button" @click="navigateTo('/')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to website
        </button>
      </div>

      <div class="signup-aside-body">
        <p class="signup-eyebrow">Create your account</p>
        <h1 class="signup-welcome">Start with<br />your home<span class="signup-q">.</span></h1>
        <p class="signup-welcome-sub">A few details and you're in. Your details stay with you — we never share them with third parties.</p>

        <ol class="signup-steps">
          <li><span class="signup-step-n">1</span><p>Create your account — about 30 seconds.</p></li>
          <li><span class="signup-step-n">2</span><p>Add your home's postcode.</p></li>
          <li><span class="signup-step-n">3</span><p>See your HomeScore and start your Passport.</p></li>
        </ol>
      </div>

      <p class="signup-aside-foot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        End-to-end encrypted. Your data stays yours.
      </p>
    </aside>

    <!-- ── Right form panel (light) ── -->
    <main class="signup-main">
      <div class="signup-main-inner">
        <div class="signup-form-head">
          <h2 class="signup-form-title">Create your account</h2>
          <p class="signup-form-sub">Start with your home — it takes about a minute.</p>
        </div>

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
              :postcode-fallback="true"
              @select="onAddressSelect"
            />
            <div class="postcode-prompt">
              <div class="postcode-prompt-h">See your HomeScore the moment you're in</div>
              <div class="postcode-prompt-text">Add your postcode and we'll show what your home tells us — bills, value, comparisons. You can skip this and add it later.</div>
            </div>
          </div>

          <!-- Marketing opt-in -->
          <label class="checkbox-row">
            <span class="checkbox-box" :class="{ checked: form.marketingOptIn }">
              <input v-model="form.marketingOptIn" type="checkbox" hidden />
            </span>
            <span class="checkbox-text">Email me occasional product updates and tips. No spam, and you can unsubscribe in one tap.</span>
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

        <div class="signup-divider"><span>already with us?</span></div>

        <div class="auth-footer signup-footer">
          Already have an account? <NuxtLink to="/onboarding/signin">Sign in</NuxtLink>
        </div>
      </div>
    </main>

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
  const pc = property.postcode?.toUpperCase()
  // Postcode-only pick (postcodes.io fallback — no property in our dataset).
  if (property.postcodeOnly || !property.addressLine1) {
    selectedAddress.value = {
      id: 1,
      line1: pc ?? '',
      line2: 'Postcode',
      postcode: pc,
    }
    form.postcode = pc ?? ''
    return
  }
  selectedAddress.value = {
    id: 1,
    line1: toTitleCase(property.addressLine1 ?? ''),
    line2: [property.city ? toTitleCase(property.city) : null, pc]
      .filter(Boolean)
      .join(', '),
    postcode: pc,
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
/* ── Split-screen layout ── */
.signup-split {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #231d45;
}

/* ── Left brand panel ── */
.signup-aside {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px 48px;
  color: #fff;
  background:
    radial-gradient(circle at 90% 95%, rgba(0, 161, 154, 0.22) 0%, rgba(0, 161, 154, 0) 42%),
    linear-gradient(165deg, #2c2456 0%, #231d45 55%, #1a1535 100%);
  overflow: hidden;
}
.signup-aside-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 56px;
}
.signup-logo { display: inline-flex; align-items: center; gap: 12px; }
.signup-logo-mark {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #2fd0c6;
  background: rgba(0, 161, 154, 0.12);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
  display: grid;
  place-items: center;
}
.signup-logo-mark img { width: 23px; height: auto; display: block; }
.signup-logo strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
}
.signup-website-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}
.signup-website-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
}
.signup-website-btn svg { width: 15px; height: 15px; }

.signup-aside-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 440px;
}
.signup-eyebrow {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #2fd0c6;
}
.signup-welcome {
  margin: 0;
  font-size: clamp(44px, 4.4vw, 58px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing:-.03em;
  color: #fff;
}
.signup-q { color: #2fd0c6; }
.signup-welcome-sub {
  margin: 20px 0 0;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.62);
  max-width: 36ch;
}

/* Numbered steps */
.signup-steps {
  list-style: none;
  margin: 36px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.signup-steps li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.signup-step-n {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: rgba(0, 161, 154, 0.18);
  border: 1px solid rgba(0, 161, 154, 0.4);
  color: #2fd0c6;
  font-size: 13px;
  font-weight: 800;
  display: grid;
  place-items: center;
}
.signup-steps p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.85);
  padding-top: 3px;
}

.signup-aside-foot {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 48px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}
.signup-aside-foot svg { width: 15px; height: 15px; flex-shrink: 0; }

/* ── Right form panel ── */
.signup-main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 40px;
  background: #f3f2ef;
  overflow-y: auto;
}
.signup-main-inner { width: 100%; max-width: 420px; }

.signup-form-head { margin-bottom: 24px; }
.signup-form-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #231d45;
}
.signup-form-sub {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #6b6783;
}

/* Plain form (strip the futuristic card chrome) */
.signup-panel {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  backdrop-filter: none;
}

/* Form fields */
.auth-form { padding: 0; }
.form-field { margin-bottom: 18px; }
.form-field.optional .form-label { color: #231d45; }
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #231d45;
  margin-bottom: 8px;
}
.form-label .opt {
  font-size: 12px;
  font-weight: 600;
  color: #a39fb2;
  margin-left: 6px;
}
.form-input-wrap { position: relative; }
.form-input {
  width: 100%;
  background: #fcfcfb;
  border: 1.5px solid #e3e1ea;
  border-radius: 12px;
  padding: 15px 14px;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: #231d45;
  transition: all 0.15s;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  background: #fff;
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
}
.form-input::placeholder { color: #a39fb2; font-weight: 500; }
.form-input.with-icon { padding-left: 42px; }
.form-input.with-action { padding-right: 44px; }
.form-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #a39fb2;
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
  color: #a39fb2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-input-action:hover { color: #00857f; }
.form-input-action svg { width: 16px; height: 16px; }

.form-help {
  font-size: 12px;
  font-weight: 600;
  color: #6b6783;
  margin-top: 7px;
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.form-help svg { width: 13px; height: 13px; color: #00a19a; flex-shrink: 0; margin-top: 2px; }
.form-help strong { color: #231d45; font-weight: 800; }

/* PhoneInput */
:deep(.phone-field) {
  background: #fcfcfb;
  border: 1.5px solid #e3e1ea;
  border-radius: 12px;
  height: 52px;
}
:deep(.phone-field--focused) {
  background: #fff;
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
}
:deep(.number-input) { font-size: 14.5px; color: #231d45; font-weight: 600; }
:deep(.number-input::placeholder) { color: #a39fb2; }
:deep(.country-dial) { color: #231d45; }

/* Postcode prompt callout — teal box */
.postcode-prompt {
  background: #e9f7f5;
  border: 1px solid #c3e7e2;
  border-radius: 14px;
  padding: 14px 16px;
  margin-top: 10px;
}
.postcode-prompt-h {
  font-size: 14px;
  font-weight: 800;
  color: #00857f;
  margin-bottom: 5px;
}
.postcode-prompt-text {
  font-size: 13px;
  font-weight: 500;
  color: #5a7470;
  line-height: 1.5;
}

/* Selected address pill */
.address-selected-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #e9f7f5;
  border: 1.5px solid #c3e7e2;
  border-radius: 12px;
  padding: 13px 14px;
}
.address-selected-body { flex: 1; min-width: 0; }
.address-selected-line1 {
  font-size: 14px;
  font-weight: 700;
  color: #231d45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.address-selected-line2 { font-size: 12px; color: #5a7470; margin-top: 2px; }
.address-edit-btn {
  background: transparent;
  border: none;
  font-size: 12.5px;
  font-weight: 800;
  color: #00857f;
  cursor: pointer;
  padding: 4px 8px;
  flex-shrink: 0;
}

/* Marketing checkbox */
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  cursor: pointer;
}
.checkbox-box {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cfccd8;
  border-radius: 5px;
  flex-shrink: 0;
  margin-top: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: all 0.15s;
}
.checkbox-box.checked { background: #00a19a; border-color: #00a19a; }
.checkbox-box.checked::after {
  content: '';
  width: 9px;
  height: 5px;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(-45deg) translate(1px, -1px);
}
.checkbox-text {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.5;
}

/* Primary button — solid teal */
.btn-primary {
  width: 100%;
  background: #00a19a;
  color: #fff;
  border: none;
  font-family: inherit;
  font-size: 15.5px;
  font-weight: 800;
  padding: 17px 18px;
  border-radius: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s;
  margin-top: 22px;
}
.btn-primary--futuristic {
  background: #00a19a;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.22);
}
.btn-primary:hover,
.btn-primary--futuristic:hover { background: #00857f; }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.terms-text {
  font-size: 12.5px;
  font-weight: 500;
  color: #a39fb2;
  text-align: center;
  line-height: 1.55;
  margin-top: 16px;
}
.terms-text a { color: #6b6783; font-weight: 800; cursor: pointer; }
.terms-text a:hover { color: #231d45; }

/* Divider */
.signup-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0 6px;
  color: #a39fb2;
  font-size: 12px;
}
.signup-divider::before,
.signup-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #dddbe4;
}
.signup-divider span { padding: 0 14px; }

.signup-footer,
.auth-footer {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #6b6783;
  padding: 8px 0 0;
}
.signup-footer a,
.auth-footer a {
  color: #00a19a;
  font-weight: 800;
  text-decoration: none;
}
.signup-footer a:hover,
.auth-footer a:hover { color: #00857f; }

.error-banner {
  margin-bottom: 16px;
  padding: 12px 14px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  color: #be123c;
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

/* ── Responsive: stack to single column ── */
@media (max-width: 880px) {
  .signup-split { grid-template-columns: 1fr; }
  .signup-aside { padding: 28px 28px 36px; }
  .signup-aside-top { margin-bottom: 32px; }
  .signup-aside-body { justify-content: flex-start; }
  .signup-welcome { font-size: clamp(38px, 11vw, 52px); }
  .signup-steps { margin-top: 28px; }
  .signup-aside-foot { margin-top: 28px; }
  .signup-main { padding: 32px 24px 48px; }
}
</style>
