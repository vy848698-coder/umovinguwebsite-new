<template>
  <div class="otp-form">
    <!-- Back -->
    <button class="otp-back" type="button" @click="goBack">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back
    </button>

    <h1 class="otp-title">Check your email</h1>
    <p class="otp-subtitle">
      We sent a 6-digit verification code to
      <template v-if="email"><br /><strong class="otp-email">{{ email }}</strong></template>
      <template v-else>your email</template>
    </p>

    <!-- Code Input -->
    <div class="otp-fields">
      <CodeInput
        v-model="verificationCode"
        @complete="handleCodeComplete"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="otp-error">{{ error }}</p>

    <!-- Continue -->
    <button
      class="otp-continue"
      :disabled="!isCodeComplete || isLoading"
      @click="verifyCode"
    >
      {{ isLoading ? 'Verifying…' : 'Continue' }}
      <svg v-if="!isLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>

    <!-- Resend -->
    <div class="otp-resend">
      <button
        v-if="canResend"
        type="button"
        class="otp-resend-btn"
        @click="resendCode"
      >
        Resend code
      </button>
      <span v-else class="otp-resend-timer">{{ resendText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVerificationCode } from '../composables/useVerificationCode'
import CodeInput from './verification/CodeInput.vue'

const {
  email,
  verificationCode,
  isLoading,
  error,
  isCodeComplete,
  canResend,
  resendText,
  handleCodeComplete,
  verifyCode,
  resendCode,
  goBack,
} = useVerificationCode()
</script>

<style scoped>
.otp-form {
  width: 100%;
  max-width: 520px;
  font-family:
    'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Inter, sans-serif;
}

/* Back */
.otp-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  color: #00a19a;
  padding: 0;
  margin-bottom: 40px;
}
.otp-back svg {
  width: 17px;
  height: 17px;
}
.otp-back:hover {
  color: #00857f;
}

/* Heading */
.otp-title {
  font-size: clamp(34px, 4vw, 46px);
  font-weight: 800;
  letter-spacing: -1.4px;
  line-height: 1.05;
  color: #231d45;
  margin: 0 0 14px;
}
.otp-subtitle {
  font-size: 17px;
  font-weight: 500;
  color: #6b6783;
  line-height: 1.6;
  margin: 0 0 40px;
}
.otp-email {
  font-weight: 700;
  color: #231d45;
}

/* Fields */
.otp-fields {
  margin-bottom: 28px;
}

.otp-error {
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  margin: -14px 0 20px;
}

/* Continue */
.otp-continue {
  width: 100%;
  height: 62px;
  border: none;
  border-radius: 16px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #00a19a;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.16s;
  box-shadow: 0 12px 26px rgba(0, 161, 154, 0.26);
}
.otp-continue svg {
  width: 18px;
  height: 18px;
}
.otp-continue:hover:not(:disabled) {
  background: #00b6ae;
  transform: translateY(-1px);
}
.otp-continue:disabled {
  background: #e7e6ef;
  color: #a7a4b8;
  box-shadow: none;
  cursor: not-allowed;
}

/* Resend */
.otp-resend {
  text-align: center;
  margin-top: 22px;
}
.otp-resend-timer {
  font-size: 15px;
  font-weight: 500;
  color: #9c98ad;
}
.otp-resend-btn {
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  color: #00a19a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.otp-resend-btn:hover {
  color: #00857f;
}
</style>
