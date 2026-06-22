<template>
  <div class="signin-split">
    <!-- ── Left brand panel (dark) ── -->
    <aside class="signin-aside">
      <div class="signin-aside-top">
        <div class="signin-logo">
          <span class="signin-logo-mark"><img src="/op-icons/logo.svg" alt="umu" /></span>
          <strong>umovingu</strong>
        </div>
        <button class="signin-website-btn" type="button" @click="navigateTo('/')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to website
        </button>
      </div>

      <div class="signin-aside-body">
        <h1 class="signin-welcome">{{ heroTitle }}</h1>
        <p class="signin-welcome-sub">Good to see you again — your Property Passport is right where you left it.</p>

        <div class="signin-home-card">
          <div class="signin-home-thumb">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- roof -->
              <path d="M24 9 8 22h32L24 9Z" fill="#231d45" />
              <!-- house body -->
              <path d="M11 21h26v17a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1V21Z" fill="#00a19a" />
              <!-- door -->
              <rect x="17" y="28" width="7" height="11" rx="1" fill="#2f6df0" />
              <!-- window -->
              <rect x="27" y="27" width="6" height="6" rx="1" fill="#bfe6e1" />
            </svg>
          </div>
          <div class="signin-home-meta">
            <span class="signin-home-kicker">Your home</span>
            <strong class="signin-home-addr">55, Woodfield Road</strong>
            <div class="signin-home-tags">
              <span class="signin-home-tag signin-home-tag--score">HomeScore 74</span>
              <span class="signin-home-tag signin-home-tag--passport">Passport ready</span>
            </div>
          </div>
        </div>
      </div>

      <p class="signin-aside-foot">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        End-to-end encrypted. Your data stays yours.
      </p>
    </aside>

    <!-- ── Right form panel (light) ── -->
    <main class="signin-main">
      <div class="signin-main-inner">

    <!-- ── Sign-in / forgot-password (entry) / verify code / new password ── -->
    <template v-if="resetStep !== 'sent' && resetStep !== 'success'">
      <div class="signin-shell">
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

          <div class="signin-form-head">
            <h2 class="signin-form-title">{{ formTitle }}</h2>
            <p class="signin-form-sub">{{ formSub }}</p>
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

          <div v-if="resetStep === 'idle'" class="signin-divider"><span>new to UMU?</span></div>

          <div v-if="resetStep === 'idle'" class="auth-footer signin-footer">
            Don't have an account? <NuxtLink to="/onboarding/signup">Get started</NuxtLink>
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
    </main>
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

// Heading shown above the form (right panel)
const formTitle = computed(() => {
  if (resetStep.value === 'idle') return 'Sign in to UMU'
  if (resetStep.value === 'email') return 'Reset your password'
  if (resetStep.value === 'otp') return 'Verify the code'
  if (resetStep.value === 'newPassword') return 'Set a new password'
  return ''
})
const formSub = computed(() => {
  if (resetStep.value === 'idle') return 'Enter your details to pick up where you left off.'
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
/* ── Split-screen layout ── */
.signin-split {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #231d45;
}

/* ── Left brand panel ── */
.signin-aside {
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

.signin-aside-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 64px;
}

.signin-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.signin-logo-mark {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid #2fd0c6;
  background: rgba(0, 161, 154, 0.12);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
  display: grid;
  place-items: center;
}
.signin-logo-mark :deep(img),
.signin-logo-mark :deep(svg),
.signin-logo-mark img,
.signin-logo-mark svg { width: 23px; height: auto; display: block; }
.signin-logo strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #fff;
}

.signin-website-btn {
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
.signin-website-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.24);
}
.signin-website-btn svg { width: 15px; height: 15px; }

.signin-aside-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 440px;
}

.signin-welcome {
  margin: 0;
  font-size: clamp(44px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -2px;
  color: #fff;
}
.signin-welcome-sub {
  margin: 20px 0 0;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.62);
  max-width: 34ch;
}

/* Dark home card */
.signin-home-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.signin-home-thumb {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #fff;
  color: #231d45;
  display: grid;
  place-items: center;
}
.signin-home-thumb svg { width: 38px; height: 38px; }
.signin-home-meta { min-width: 0; }
.signin-home-kicker {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 4px;
}
.signin-home-addr {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}
.signin-home-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.signin-home-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 7px;
}
.signin-home-tag--score {
  background: rgba(0, 161, 154, 0.2);
  color: #2fd0c6;
  border: 1px solid rgba(0, 161, 154, 0.4);
}
.signin-home-tag--passport {
  background: rgba(217, 154, 43, 0.16);
  color: #e0a93f;
  border: 1px solid rgba(217, 154, 43, 0.4);
}

.signin-aside-foot {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 56px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}
.signin-aside-foot svg { width: 15px; height: 15px; flex-shrink: 0; }

/* ── Right form panel ── */
.signin-main {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f3f2ef;
}
.signin-main-inner {
  width: 100%;
  max-width: 400px;
}

.signin-shell { width: 100%; }
.signin-panel-wrap { width: 100%; }

/* Reuse the plain panel/form look — strip the card chrome */
.signin-panel {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  backdrop-filter: none;
}

.signin-form-head { margin-bottom: 24px; }
.signin-form-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #231d45;
}
.signin-form-sub {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: #6b6783;
}

/* Logout / session toast */
.logged-out-toast {
  margin: 0 0 24px;
  padding: 13px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
}
.signin-panel-wrap .logged-out-toast--teal {
  background: #e9f7f5;
  border: 1px solid #c3e7e2;
  color: #00857f;
}

/* Inputs */
.signin-panel-wrap .form-input {
  background: #fcfcfb;
  border: 1.5px solid #e3e1ea;
  border-radius: 12px;
  padding: 15px 14px;
  font-size: 14.5px;
  color: #231d45;
}
.signin-panel-wrap .form-input.with-icon { padding-left: 42px; }
.signin-panel-wrap .form-input::placeholder { color: #a39fb2; font-weight: 500; }
.signin-panel-wrap .form-input:focus {
  background: #fff;
  border-color: #00a19a;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.12);
}
.signin-panel-wrap .form-input-icon,
.signin-panel-wrap .form-input-action { color: #a39fb2; }
.signin-panel-wrap .form-label {
  color: #231d45;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 8px;
}
.signin-panel-wrap .form-field { margin-bottom: 18px; }

/* Solid teal primary button */
.signin-panel .btn-primary--futuristic {
  position: relative;
  overflow: hidden;
  background: #00a19a;
  border-radius: 14px;
  padding: 17px 18px;
  font-size: 15.5px;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.22);
  margin-top: 4px;
}
.signin-panel .btn-primary--futuristic::before { display: none; }
.signin-panel .btn-primary--futuristic:hover { background: #00857f; }

/* Forgot password link */
.signin-panel .btn-text {
  font-size: 14px;
  font-weight: 800;
  color: #231d45;
}
.signin-panel .btn-text:hover { color: #00857f; }

/* Divider */
.signin-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 22px 0 6px;
  color: #a39fb2;
  font-size: 12px;
}
.signin-divider::before,
.signin-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #dddbe4;
}
.signin-divider span { padding: 0 14px; }

.signin-footer {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #6b6783;
  padding: 8px 0 0;
}
.signin-footer a {
  color: #00a19a;
  font-weight: 800;
  text-decoration: none;
}
.signin-footer a:hover { color: #00857f; }

/* Confirm states reuse the right panel look */
.confirm-state--futuristic {
  min-height: auto;
  background: transparent;
}
.confirm-state--futuristic .confirm-icon {
  background: #e9f7f5;
  border-color: #bfe6e1;
  color: #00a19a;
}
.confirm-state--futuristic .confirm-h,
.confirm-state--futuristic .confirm-sub strong { color: #231d45; }
.confirm-state--futuristic .confirm-sub { color: #6b6783; }

/* ── Responsive: stack to single column ── */
@media (max-width: 880px) {
  .signin-split { grid-template-columns: 1fr; }
  .signin-aside { padding: 28px 28px 36px; }
  .signin-aside-top { margin-bottom: 36px; }
  .signin-aside-body { justify-content: flex-start; }
  .signin-welcome { font-size: clamp(38px, 11vw, 52px); }
  .signin-home-card { margin-top: 28px; }
  .signin-aside-foot { margin-top: 32px; }
  .signin-main { padding: 32px 24px 48px; }
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
  margin: 6px 24px 18px 3px;
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

</style>
