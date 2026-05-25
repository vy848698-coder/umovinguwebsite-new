<template>
  <div class="mobile-container auth-screen signin-futuristic">
    <div class="signin-bg">
      <div class="signin-orb signin-orb-a" />
      <div class="signin-orb signin-orb-b" />
      <div class="signin-grid" />
      <div class="signin-vignette" />
    </div>

    <!-- Topbar -->
    <div class="auth-topbar signin-topbar">
      <button class="auth-back-btn signin-back-btn" @click="handleBack" aria-label="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="signin-topbar-copy">
        <span class="signin-topbar-kicker">Neural access</span>
        <strong>{{ heroEyebrow }}</strong>
      </div>
      <div class="auth-brand-mini signin-brand-mini">
        <OPIcon name="logo" class="w-[26px] h-[26px]" />
      </div>
    </div>

    <!-- ── Sign-in / forgot-password (entry) / verify code / new password ── -->
    <template v-if="resetStep !== 'sent' && resetStep !== 'success'">
      <div class="signin-shell">
        <section class="signin-visual">
          <div class="signin-badge-row">
            <span class="signin-chip">Encrypted</span>
            <span class="signin-chip signin-chip--alt">Property passport ready</span>
          </div>

          <h1 class="signin-title">{{ heroTitle }}</h1>
          <p class="signin-sub">{{ heroSub }}</p>

          <div class="signin-image-stack">
            <article class="signin-image-card signin-image-card--large">
              <img src="/images/onboarding_background.jpg" alt="UK property street" />
              <div class="signin-image-overlay">
                <span>HomeScore-ready flow</span>
                <strong>See the home before the login</strong>
              </div>
            </article>
            <article class="signin-image-card signin-image-card--small signin-float-a">
              <img src="/welcome-house.png" alt="Sample house" />
            </article>
          </div>

          <div class="signin-metrics">
            <div>
              <strong>74</strong>
              <span>Typical HomeScore preview</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Secure account access</span>
            </div>
            <div>
              <strong>1 min</strong>
              <span>Average sign-in flow</span>
            </div>
          </div>
        </section>

        <section class="signin-panel-wrap">
          <!-- Logout / session toast -->
          <div
            v-if="bannerMessage && resetStep === 'idle'"
            class="logged-out-toast"
            :class="bannerReason === 'logout' ? 'logged-out-toast--teal' : 'logged-out-toast--yellow'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ bannerMessage }}
          </div>

          <form class="auth-form signin-panel" @submit.prevent="onPrimary">

            <!-- ── Sign in ── -->
            <template v-if="resetStep === 'idle'">
              <div class="form-field">
                <label class="form-label">Email address</label>
                <div class="form-input-wrap">
                  <span class="form-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input v-model="emailInput" type="email" placeholder="you@example.com" class="form-input with-icon" autocomplete="email" />
                </div>
              </div>

              <div class="form-field">
                <label class="form-label">Password</label>
                <div class="form-input-wrap">
                  <span class="form-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    v-model="passwordInput"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Your password"
                    class="form-input with-icon with-action"
                    autocomplete="current-password"
                  />
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

              <div v-if="loginError" class="error-banner">{{ loginError }}</div>

              <button type="submit" class="btn-primary btn-primary--futuristic" :disabled="loginLoading">
                <span v-if="loginLoading" class="spinner" />
                {{ loginLoading ? 'Signing in…' : 'Sign in' }}
              </button>

              <button type="button" class="btn-text" @click="startForgotPassword">Forgot password?</button>
            </template>

            <!-- ── Forgot password: enter email ── -->
            <template v-else-if="resetStep === 'email'">
              <div class="form-field">
                <label class="form-label">Email address</label>
                <div class="form-input-wrap">
                  <span class="form-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input v-model="resetEmail" type="email" placeholder="you@example.com" class="form-input with-icon" autocomplete="email" />
                </div>
              </div>

              <div v-if="resetError" class="error-banner">{{ resetError }}</div>

              <button type="submit" class="btn-primary btn-primary--futuristic" :disabled="resetLoading">
                <span v-if="resetLoading" class="spinner" />
                {{ resetLoading ? 'Sending…' : 'Send reset code' }}
              </button>

              <button type="button" class="btn-text" @click="resetStep = 'idle'">Back to sign in</button>
            </template>

            <!-- ── Forgot password: verify code ── -->
            <template v-else-if="resetStep === 'otp'">
              <p class="reset-helper-text">
                We sent a 6-digit code to<br>
                <strong>{{ resetEmail }}</strong>
              </p>

              <div class="otp-boxes">
                <input
                  v-for="(_, i) in otpDigits"
                  :key="i"
                  :ref="el => { if (el) otpRefs[i] = el as HTMLInputElement }"
                  v-model="otpDigits[i]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="otp-box"
                  @input="onOtpInput(i)"
                  @keydown.backspace="onOtpBackspace(i)"
                  @paste.prevent="onOtpPaste($event)"
                />
              </div>

              <div v-if="resetError" class="error-banner">{{ resetError }}</div>

              <button type="submit" class="btn-primary btn-primary--futuristic" :disabled="resetLoading || otpValue.length < 6">
                <span v-if="resetLoading" class="spinner" />
                {{ resetLoading ? 'Verifying…' : 'Verify code' }}
              </button>

              <button v-if="resendCountdown > 0" type="button" class="btn-text" disabled>
                Resend code in {{ resendCountdown }}s
              </button>
              <button v-else type="button" class="btn-text" @click="handleForgotPassword">Resend code</button>
            </template>

            <!-- ── Forgot password: new password ── -->
            <template v-else-if="resetStep === 'newPassword'">
              <div class="form-field">
                <label class="form-label">New password</label>
                <div class="form-input-wrap">
                  <span class="form-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="New password"
                    class="form-input with-icon with-action"
                  />
                  <button type="button" class="form-input-action" @click="showNewPassword = !showNewPassword">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label class="form-label">Confirm new password</label>
                <div class="form-input-wrap">
                  <span class="form-input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm new password"
                    class="form-input with-icon with-action"
                  />
                  <button type="button" class="form-input-action" @click="showConfirmPassword = !showConfirmPassword">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="newPassword" class="password-strength">
                <div class="strength-bars">
                  <div v-for="n in 4" :key="n" class="strength-bar" :style="{ background: n <= passwordStrength ? strengthBg : '#eef0f6' }" />
                </div>
                <p :style="{ color: strengthColor }">{{ strengthLabel }}</p>
              </div>

              <div v-if="resetError" class="error-banner">{{ resetError }}</div>

              <button type="submit" class="btn-primary btn-primary--futuristic" :disabled="resetLoading || !passwordsMatch">
                <span v-if="resetLoading" class="spinner" />
                {{ resetLoading ? 'Updating…' : 'Update password' }}
              </button>
            </template>
          </form>

          <div v-if="resetStep === 'idle'" class="auth-footer signin-footer">
            Don't have an account? <NuxtLink to="/onboarding/signup">Create one</NuxtLink>
          </div>
        </section>
      </div>
    </template>

    <!-- ── Reset code sent — confirmation panel (prototype "forgot-sent") ── -->
    <template v-else-if="resetStep === 'sent'">
      <div class="confirm-state confirm-state--futuristic">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div class="confirm-h">Check your email</div>
        <div class="confirm-sub">
          We've sent a password reset code to<br><strong>{{ resetEmail }}</strong>.<br><br>
          It should arrive in a minute or two. Check your spam folder if you can't see it.
        </div>
        <button class="btn-primary" @click="resetStep = 'otp'">Enter the code</button>
        <button type="button" class="btn-text" @click="handleForgotPassword">Didn't get it? Resend</button>
      </div>
    </template>

    <!-- ── Reset success ── -->
    <template v-else-if="resetStep === 'success'">
      <div class="confirm-state confirm-state--futuristic">
        <div class="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div class="confirm-h">Password updated!</div>
        <div class="confirm-sub">
          Your password has been changed successfully.<br>
          You can now sign in with your new password.
        </div>
        <button class="btn-primary" @click="resetStep = 'idle'">Back to sign in</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import OPIcon from '~/components/ui/OPIcon.vue'

definePageMeta({
  title: 'Sign In - UmovingU',
  middleware: 'guest',
})

const config = useRuntimeConfig()
const { login } = useAuth()
const route = useRoute()

// ── Hero copy depending on step
type ResetStep = 'idle' | 'email' | 'sent' | 'otp' | 'newPassword' | 'success'
const resetStep = ref<ResetStep>('idle')

const heroEyebrow = computed(() => {
  if (resetStep.value === 'idle') return 'Sign in'
  if (resetStep.value === 'email') return 'Reset your password'
  if (resetStep.value === 'otp') return 'Verify the code'
  if (resetStep.value === 'newPassword') return 'Set a new password'
  return ''
})
const heroTitle = computed(() => {
  if (resetStep.value === 'idle') return 'Welcome back.'
  if (resetStep.value === 'email') return 'No worries.'
  if (resetStep.value === 'otp') return 'Check your email.'
  if (resetStep.value === 'newPassword') return 'Choose a strong one.'
  return ''
})
const heroSub = computed(() => {
  if (resetStep.value === 'idle') return 'Good to see you again.'
  if (resetStep.value === 'email') return "Enter your email and we'll send you a code to set a new password."
  if (resetStep.value === 'otp') return 'Enter the 6-digit code we just sent you.'
  if (resetStep.value === 'newPassword') return 'At least 8 characters. Mix in a number for extra strength.'
  return ''
})

// Banner from query
const bannerReason = computed(() => route.query.reason as string | undefined)
const bannerMessage = computed(() => {
  if (bannerReason.value === 'logout') return "You've been signed out."
  if (bannerReason.value === 'session') return 'Your session has expired. Please sign in again.'
  return ''
})

// Sign in
const emailInput = ref('')
const passwordInput = ref('')
const showPassword = ref(false)
const loginError = ref('')
const loginLoading = ref(false)

const redirectAfterAuth = async () => {
  const redirectPath = localStorage.getItem('redirectAfterLogin')
  if (redirectPath) {
    localStorage.removeItem('redirectAfterLogin')
    await navigateTo(redirectPath)
  } else {
    await navigateTo('/explore')
  }
}

const handleLogin = async () => {
  loginError.value = ''
  loginLoading.value = true
  try {
    const response: any = await login(emailInput.value, passwordInput.value)
    localStorage.setItem('token', response.token)
    await redirectAfterAuth()
  } catch {
    loginError.value = 'Incorrect email or password. Please try again.'
  } finally {
    loginLoading.value = false
  }
}

// Forgot password
const resetEmail = ref('')
const resetToken = ref('')
const resetError = ref('')
const resetLoading = ref(false)

const handleBack = () => {
  resetError.value = ''
  if (resetStep.value === 'idle') return navigateTo('/')
  if (resetStep.value === 'email') resetStep.value = 'idle'
  else if (resetStep.value === 'sent') resetStep.value = 'email'
  else if (resetStep.value === 'otp') resetStep.value = 'sent'
  else if (resetStep.value === 'newPassword') resetStep.value = 'otp'
  else resetStep.value = 'idle'
}

const startForgotPassword = () => {
  resetEmail.value = emailInput.value
  resetError.value = ''
  resetStep.value = 'email'
}

// OTP
const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const otpRefs = ref<HTMLInputElement[]>([])
const otpValue = computed(() => otpDigits.value.join(''))

const onOtpInput = (index: number) => {
  const val = otpDigits.value[index]
  if (val && index < 5) otpRefs.value[index + 1]?.focus()
}
const onOtpBackspace = (index: number) => {
  if (!otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = ''
    otpRefs.value[index - 1]?.focus()
  }
}
const onOtpPaste = (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? ''
  text.split('').forEach((ch, i) => { otpDigits.value[i] = ch })
  otpRefs.value[Math.min(text.length, 5)]?.focus()
}

const resendCountdown = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null
const startResendCountdown = () => {
  resendCountdown.value = 60
  resendTimer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0 && resendTimer) {
      clearInterval(resendTimer)
      resendTimer = null
    }
  }, 1000)
}

const handleForgotPassword = async () => {
  if (!resetEmail.value) return
  resetError.value = ''
  resetLoading.value = true
  try {
    await $fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: 'POST',
      body: { email: resetEmail.value },
    })
    otpDigits.value = ['', '', '', '', '', '']
    resetStep.value = 'sent'
    startResendCountdown()
  } catch {
    resetError.value = 'Something went wrong. Please try again.'
  } finally {
    resetLoading.value = false
  }
}

const handleVerifyResetOtp = async () => {
  if (otpValue.value.length < 6) return
  resetError.value = ''
  resetLoading.value = true
  try {
    const res: any = await $fetch(`${config.public.apiBase}/auth/verify-reset-otp`, {
      method: 'POST',
      body: { email: resetEmail.value, code: otpValue.value },
    })
    resetToken.value = res.resetToken
    newPassword.value = ''
    confirmPassword.value = ''
    resetStep.value = 'newPassword'
  } catch {
    resetError.value = 'Invalid or expired code. Please try again.'
  } finally {
    resetLoading.value = false
  }
}

// New password
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => newPassword.value.length >= 8 && newPassword.value === confirmPassword.value)

const passwordStrength = computed(() => {
  const p = newPassword.value
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const strengthBg = computed(() => {
  if (passwordStrength.value <= 1) return '#ef4444'
  if (passwordStrength.value === 2) return '#f59e0b'
  if (passwordStrength.value === 3) return '#3b82f6'
  return '#00a19a'
})
const strengthColor = strengthBg
const strengthLabel = computed(() => {
  if (passwordStrength.value <= 1) return 'Weak'
  if (passwordStrength.value === 2) return 'Fair'
  if (passwordStrength.value === 3) return 'Good'
  return 'Strong'
})

const handleResetPassword = async () => {
  if (!passwordsMatch.value) {
    resetError.value = 'Passwords do not match.'
    return
  }
  resetError.value = ''
  resetLoading.value = true
  try {
    await $fetch(`${config.public.apiBase}/auth/reset-password`, {
      method: 'POST',
      body: { resetToken: resetToken.value, newPassword: newPassword.value },
    })
    resetStep.value = 'success'
  } catch {
    resetError.value = 'Failed to update password. The reset link may have expired.'
  } finally {
    resetLoading.value = false
  }
}

// Single submit handler — dispatches based on step
const onPrimary = () => {
  if (resetStep.value === 'idle') return handleLogin()
  if (resetStep.value === 'email') return handleForgotPassword()
  if (resetStep.value === 'otp') return handleVerifyResetOtp()
  if (resetStep.value === 'newPassword') return handleResetPassword()
}
</script>

<style scoped>
.auth-screen {
  background:
    radial-gradient(circle at 0% 8%, rgba(0, 161, 154, 0.1), transparent 28%),
    radial-gradient(circle at 92% 6%, rgba(81, 129, 255, 0.12), transparent 25%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 35%, #eef4f9 100%);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  color: #1f2b3f;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.signin-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.signin-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.04;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.75), transparent 90%);
}

.signin-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, rgba(248, 251, 255, 0.66) 64%, rgba(238, 244, 249, 0.88) 100%);
}

.signin-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(36px);
  animation: drift 16s ease-in-out infinite;
}

.signin-orb-a {
  top: 8%;
  left: 2%;
  width: 280px;
  height: 280px;
  background: rgba(0, 161, 154, 0.3);
}

.signin-orb-b {
  right: -3%;
  top: 18%;
  width: 340px;
  height: 340px;
  background: rgba(95, 139, 255, 0.26);
  animation-duration: 21s;
}

.signin-topbar,
.signin-shell,
.confirm-state--futuristic {
  position: relative;
  z-index: 1;
}

.signin-topbar {
  padding: 16px 20px 6px;
}

.signin-back-btn {
  background: rgba(255, 255, 255, 0.88);
  color: #1f2b3f;
  border-color: #d4dfeb;
  backdrop-filter: blur(12px);
}

.signin-topbar-copy {
  flex: 1;
  text-align: center;
  color: #50637f;
}

.signin-topbar-kicker {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00857f;
  margin-bottom: 2px;
}

.signin-topbar-copy strong {
  display: block;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.signin-brand-mini {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #d4dfeb;
  border-radius: 999px;
  width: 38px;
  height: 38px;
  backdrop-filter: blur(12px);
}

.signin-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 18px 0 30px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 28px;
  align-items: start;
}

.signin-visual {
  padding: 14px 0 0;
}

.signin-badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.signin-chip {
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

.signin-chip--alt {
  background: #eafaf7;
  color: #00857f;
}

.signin-title {
  margin: 0;
  font-size: clamp(34px, 4.8vw, 56px);
  line-height: 1;
  letter-spacing: -1.3px;
  color: #18263b;
  font-weight: 650;
  max-width: 12ch;
  font-family: inherit;
}

.signin-sub {
  margin: 14px 0 0;
  max-width: 50ch;
  color: #586a83;
  font-size: 15px;
  line-height: 1.65;
}

.signin-image-stack {
  margin-top: 18px;
  position: relative;
  min-height: 312px;
}

.signin-image-card {
  position: absolute;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #d8e3ee;
  box-shadow: 0 18px 32px rgba(33, 61, 98, 0.08);
  backdrop-filter: blur(8px);
}

.signin-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.signin-image-card--large {
  left: 0;
  top: 0;
  width: min(100%, 460px);
  height: 296px;
}

.signin-image-card--small {
  width: 160px;
  height: 160px;
  right: 8px;
  bottom: -4px;
}

.signin-image-overlay {
  position: absolute;
  inset: auto 16px 16px 16px;
  padding: 12px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(24, 38, 59, 0.16), rgba(24, 38, 59, 0.72));
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.signin-image-overlay span {
  display: block;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #9beee9;
  font-weight: 800;
}

.signin-image-overlay strong {
  display: block;
  margin-top: 6px;
  font-size: 18px;
  line-height: 1.15;
  letter-spacing: -0.4px;
  font-weight: 700;
}

.signin-float-a {
  animation: float 8s ease-in-out infinite;
}

.signin-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.signin-metrics > div {
  padding: 13px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid #d9e4ee;
  backdrop-filter: blur(12px);
}

.signin-metrics strong {
  display: block;
  font-size: 23px;
  line-height: 1;
  letter-spacing: -0.7px;
  color: #18293f;
}

.signin-metrics span {
  display: block;
  margin-top: 6px;
  color: #60728c;
  font-size: 11px;
}

.signin-panel-wrap {
  position: relative;
  padding-top: 8px;
}

.signin-panel {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #d8e3ef;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 20px 34px rgba(32, 60, 96, 0.08);
  backdrop-filter: blur(18px);
}

.signin-panel .form-label,
.signin-panel .btn-text,
.signin-panel .reset-helper-text,
.signin-panel .password-strength p,
.signin-panel .terms-text,
.signin-panel .auth-footer {
  color: #586a83;
}

.signin-panel .form-label {
  color: #18263b;
}

.signin-panel .form-input {
  background: #ffffff;
  border-color: #d2dcea;
  color: #1f2b3f;
}

.signin-panel .form-input::placeholder {
  color: #8ea3bc;
}

.signin-panel .form-input:focus {
  border-color: #8ab4db;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
}

.signin-panel .form-input-icon,
.signin-panel .form-input-action {
  color: #60728c;
}

.signin-panel .btn-primary--futuristic {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #00a19a, #1a79c8);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.signin-panel .btn-primary--futuristic::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.16) 50%, transparent 100%);
  transform: translateX(-120%);
  animation: sheen 4.8s ease-in-out infinite;
}

.signin-panel .btn-primary--futuristic:hover {
  background: linear-gradient(135deg, #00aba4, #2384d8);
}

.signin-panel .btn-text:hover {
  color: #1e2b41;
}

.signin-panel .error-banner {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #be123c;
}

.signin-panel .logged-out-toast--teal {
  background: #eafaf7;
  color: #00857f;
}

.signin-footer {
  padding-top: 14px;
}

.signin-panel .auth-footer a {
  color: #00a19a;
}

.confirm-state--futuristic {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 0% 8%, rgba(0, 161, 154, 0.1), transparent 28%),
    radial-gradient(circle at 92% 6%, rgba(81, 129, 255, 0.12), transparent 25%),
    linear-gradient(180deg, #f8fbff 0%, #ffffff 35%, #eef4f9 100%);
}

.confirm-state--futuristic .confirm-icon {
  background: #ffffff;
  border-color: #d8e3ef;
  color: #00a19a;
}

.confirm-state--futuristic .confirm-h,
.confirm-state--futuristic .confirm-sub strong {
  color: #18263b;
}

.confirm-state--futuristic .confirm-sub {
  color: #586a83;
}

@keyframes sheen {
  0%,
  55% {
    transform: translateX(-120%);
  }
  80%,
  100% {
    transform: translateX(120%);
  }
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
.auth-hero { padding: 18px 24px 4px; }
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

/* Logged-out / session toast */
.logged-out-toast {
  margin: 6px 24px 0;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.logged-out-toast svg { width: 14px; height: 14px; flex-shrink: 0; }
.logged-out-toast--teal {
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  color: #007e78;
}
.logged-out-toast--yellow {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #92400e;
}

/* Form */
.auth-form { padding: 22px 24px 18px; }
.form-field { margin-bottom: 14px; }
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.1px;
  margin-bottom: 6px;
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
.form-input-action svg { width: 16px; height: 16px; }

/* Reset helper text above OTP */
.reset-helper-text {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  margin: 0 0 18px;
  line-height: 1.55;
  text-align: center;
}
.reset-helper-text strong { color: #231d45; font-weight: 800; }

/* OTP */
.otp-boxes {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 18px;
}
.otp-box {
  width: 46px;
  height: 54px;
  border: 1.5px solid #ececef;
  border-radius: 12px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #231d45;
  background: #fff;
  outline: none;
  font-family: inherit;
}
.otp-box:focus {
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.10);
}

/* Password strength */
.password-strength { margin-bottom: 14px; }
.strength-bars {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}
.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 999px;
  transition: background 0.2s;
}
.password-strength p {
  font-size: 12px;
  margin: 0;
  font-weight: 700;
}

/* Buttons */
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
  margin-top: 8px;
}
.btn-primary:hover { background: #00b6ae; }
.btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
.btn-text {
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #6b6783;
  cursor: pointer;
  padding: 10px;
  margin: 8px auto 0;
  display: block;
  letter-spacing: -0.05px;
}
.btn-text:hover { color: #231d45; }
.btn-text:disabled { opacity: 0.65; cursor: not-allowed; }

/* Confirm state — used for "sent" and "success" */
.confirm-state {
  padding: 28px 24px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.confirm-icon {
  width: 64px;
  height: 64px;
  background: #f2faf8;
  border: 1px solid #e5f4f2;
  border-radius: 50%;
  margin: 8px auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00a19a;
}
.confirm-icon svg { width: 28px; height: 28px; }
.confirm-h {
  font-size: 22px;
  font-weight: 800;
  color: #231d45;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.confirm-sub {
  font-size: 13px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.55;
  margin-bottom: 22px;
  letter-spacing: -0.05px;
}
.confirm-sub strong { color: #231d45; font-weight: 800; }
.confirm-state .btn-primary { max-width: 280px; }

/* Footer */
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
  .signin-shell {
    grid-template-columns: 1fr;
  }

  .signin-image-stack {
    min-height: 320px;
  }

  .signin-image-card--large {
    width: min(100%, 520px);
  }
}

@media (max-width: 760px) {
  .signin-topbar {
    padding: 14px 16px 6px;
  }

  .signin-shell {
    width: calc(100% - 24px);
    padding-bottom: 20px;
  }

  .signin-visual {
    padding-top: 10px;
  }

  .signin-title {
    font-size: 38px;
  }

  .signin-image-stack {
    min-height: 230px;
  }

  .signin-image-card--large {
    width: 100%;
    height: 220px;
  }

  .signin-image-card--small {
    width: 102px;
    height: 102px;
    right: 0;
    bottom: -4px;
  }

  .signin-metrics {
    grid-template-columns: 1fr;
  }

  .signin-panel {
    padding: 18px;
    border-radius: 24px;
  }
}
</style>
