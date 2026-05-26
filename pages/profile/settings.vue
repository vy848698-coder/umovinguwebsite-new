<template>
  <div class="st-page mobile-container">
    <!-- Nav bar -->
    <div class="st-nav-bar">
      <button class="st-nav-icon-btn" aria-label="Back" @click="$router.back()">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="st-nav-title">Settings</div>
      <div style="width: 38px" />
    </div>

    <main class="st-body">
      <div class="atm-bg atm-bg-teal" />

      <!-- Hero h1 -->
      <div class="st-hero">
        <div class="hero-greeting">Make UMU yours</div>
        <div class="st-h1">Settings</div>
      </div>

      <!-- Security strength card -->
      <div class="st-section">
        <div class="st-strength-card">
          <div class="st-strength-row">
            <div class="st-strength-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div class="st-strength-body">
              <div class="st-strength-title">Account secured</div>
              <div class="st-strength-sub">
                Strong password · keep email up to date
              </div>
            </div>
          </div>
          <div class="st-strength-bar">
            <div
              class="st-strength-fill"
              :style="{ width: securityScore + '%' }"
            />
          </div>
          <div class="st-strength-meter">
            <span class="st-strength-pct">{{ securityScore }}%</span>
            <span>· {{ securityLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Account & security -->
      <div class="st-section-heading">Account &amp; security</div>
      <div class="st-section">
        <div class="st-group">
          <button
            class="st-row"
            @click="navigateTo('/profile/personal-information')"
          >
            <div class="st-row-content">
              <div class="st-row-label">Personal information</div>
              <div class="st-row-meta">Name, email, phone, address</div>
            </div>
            <span class="st-row-chev">›</span>
          </button>
          <button class="st-row" @click="openChangePassword">
            <div class="st-row-content">
              <div class="st-row-label">Change password</div>
              <div class="st-row-meta">Update the password on your account</div>
            </div>
            <span class="st-row-chev">›</span>
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="st-section-heading">Notifications</div>
      <div class="st-section">
        <div class="st-group">
          <div class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">In-app push</div>
              <div class="st-row-meta">Viewing reminders &amp; messages</div>
            </div>
            <div
              class="st-toggle"
              :class="{ on: prefs.pushNotifications }"
              @click="setPref('pushNotifications', !prefs.pushNotifications)"
            />
          </div>
          <div class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">Email newsletter</div>
              <div class="st-row-meta">
                Weekly market &amp; saved property updates
              </div>
            </div>
            <div
              class="st-toggle"
              :class="{ on: prefs.emailNewsletter }"
              @click="setPref('emailNewsletter', !prefs.emailNewsletter)"
            />
          </div>
          <div class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">SMS</div>
              <div class="st-row-meta">Time-sensitive alerts only</div>
            </div>
            <div
              class="st-toggle"
              :class="{ on: prefs.smsNotifications }"
              @click="setPref('smsNotifications', !prefs.smsNotifications)"
            />
          </div>
        </div>
      </div>

      <!-- Appearance & language -->
      <div class="st-section-heading">Appearance &amp; language</div>
      <div class="st-section">
        <div class="st-group">
          <div class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">Theme</div>
              <div class="st-row-meta">Choose how the app looks</div>
            </div>
            <div class="st-segment">
              <button
                v-for="opt in themeOptions"
                :key="opt.value"
                class="st-segment-btn"
                :class="{ active: theme === opt.value }"
                @click="setTheme(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
          <button class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">Language</div>
              <div class="st-row-meta">English (UK)</div>
            </div>
            <span class="st-row-chev">›</span>
          </button>
        </div>
      </div>

      <!-- Privacy & data -->
      <div class="st-section-heading">Privacy &amp; data</div>
      <div class="st-section">
        <div class="st-group">
          <div class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">Contact visibility</div>
              <div class="st-row-meta">
                Sellers see your details only when you message them
              </div>
            </div>
            <div
              class="st-toggle"
              :class="{ on: prefs.contactVisible }"
              @click="setPref('contactVisible', !prefs.contactVisible)"
            />
          </div>
          <button class="st-row">
            <div class="st-row-content">
              <div class="st-row-label">Download your data</div>
              <div class="st-row-meta">Export everything as JSON</div>
            </div>
            <span class="st-row-chev">›</span>
          </button>
          <button class="st-row danger">
            <div class="st-row-content">
              <div class="st-row-label">Delete account</div>
              <div class="st-row-meta">Permanent. We'll wipe everything.</div>
            </div>
            <span class="st-row-chev">›</span>
          </button>
        </div>
      </div>

      <!-- Legal -->
      <div class="st-section-heading">Legal</div>
      <div class="st-section">
        <div class="st-group">
          <a class="st-row" href="/legal/terms">
            <div class="st-row-content">
              <div class="st-row-label">Terms of Service</div>
            </div>
            <span class="st-row-chev">›</span>
          </a>
          <a class="st-row" href="/legal/privacy">
            <div class="st-row-content">
              <div class="st-row-label">Privacy Policy</div>
            </div>
            <span class="st-row-chev">›</span>
          </a>
          <a class="st-row" href="/legal/cookies">
            <div class="st-row-content">
              <div class="st-row-label">Cookie preferences</div>
            </div>
            <span class="st-row-chev">›</span>
          </a>
          <div class="st-row" style="cursor: default">
            <div class="st-row-content">
              <div class="st-row-label">App version</div>
              <div class="st-row-meta">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save toast -->
      <Transition name="st-toast">
        <div v-if="toast" class="st-toast">{{ toast }}</div>
      </Transition>
    </main>

    <!-- Change password drawer -->
    <Teleport to="body">
      <div v-if="showChangePassword" class="st-overlay" @click.self="closeChangePassword">
        <div class="st-modal">
          <div class="st-modal-handle" />
          <div class="st-modal-header">
            <div class="st-modal-title">Change password</div>
            <button class="st-modal-close" type="button" aria-label="Close" @click="closeChangePassword">×</button>
          </div>
          <div class="st-modal-body">
            <p class="st-modal-intro">
              For your security, enter your current password before choosing a new one.
            </p>
            <div class="st-field">
              <label class="st-field-label">Current password</label>
              <input
                v-model="cpForm.current"
                type="password"
                class="st-field-input"
                autocomplete="current-password"
              />
            </div>
            <div class="st-field">
              <label class="st-field-label">New password</label>
              <input
                v-model="cpForm.next"
                type="password"
                class="st-field-input"
                autocomplete="new-password"
                placeholder="At least 8 characters"
              />
            </div>
            <div class="st-field">
              <label class="st-field-label">Confirm new password</label>
              <input
                v-model="cpForm.confirm"
                type="password"
                class="st-field-input"
                autocomplete="new-password"
              />
            </div>
            <p v-if="cpError" class="st-modal-error">{{ cpError }}</p>
          </div>
          <div class="st-modal-footer">
            <button class="st-btn-secondary" type="button" :disabled="cpSaving" @click="closeChangePassword">Cancel</button>
            <button class="st-btn-primary" type="button" :disabled="cpSaving || !cpReady" @click="submitChangePassword">
              {{ cpSaving ? 'Saving…' : 'Update password' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useProfile } from '~/composables/useProfile'

definePageMeta({ title: 'Settings - UmovingU', middleware: 'auth' })

const config = useRuntimeConfig()
const { profile, fetchProfile } = useProfile()
const { theme, setTheme: applyTheme } = useTheme()

const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
] as const

const prefs = reactive({
  pushNotifications: true,
  emailNewsletter: true,
  smsNotifications: false,
  contactVisible: true,
})
const toast = ref('')

// ── Change password ───────────────────────────────────────────
const showChangePassword = ref(false)
const cpForm = reactive({ current: '', next: '', confirm: '' })
const cpError = ref('')
const cpSaving = ref(false)

const cpReady = computed(
  () =>
    cpForm.current.length > 0 &&
    cpForm.next.length >= 8 &&
    cpForm.next === cpForm.confirm,
)

function openChangePassword() {
  cpForm.current = ''
  cpForm.next = ''
  cpForm.confirm = ''
  cpError.value = ''
  showChangePassword.value = true
}
function closeChangePassword() {
  if (cpSaving.value) return
  showChangePassword.value = false
}

async function submitChangePassword() {
  cpError.value = ''
  if (cpForm.next.length < 8) {
    cpError.value = 'New password must be at least 8 characters.'
    return
  }
  if (cpForm.next !== cpForm.confirm) {
    cpError.value = 'New password and confirmation do not match.'
    return
  }
  cpSaving.value = true
  try {
    const tok = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (!tok) throw new Error('Not signed in')
    await $fetch(`${config.public.apiBase}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tok}` },
      body: { currentPassword: cpForm.current, newPassword: cpForm.next },
    })
    showChangePassword.value = false
    showToast('Password updated')
  } catch (err: any) {
    cpError.value = err?.data?.message ?? err?.message ?? 'Could not change password'
  } finally {
    cpSaving.value = false
  }
}

onMounted(async () => {
  await fetchProfile()
  prefs.pushNotifications = profile.value?.pushNotifications ?? true
  prefs.emailNewsletter = profile.value?.emailNewsletter ?? true
  prefs.smsNotifications = profile.value?.smsNotifications ?? false
  prefs.contactVisible = profile.value?.contactVisible ?? true
})

async function setPref(key: keyof typeof prefs, value: boolean) {
  prefs[key] = value
  try {
    const tok =
      typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
    if (!tok) return
    await $fetch(`${config.public.apiBase}/profile/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tok}` },
      body: { [key]: value },
    })
    showToast('Saved')
  } catch {
    showToast('Could not save')
  }
}

function setTheme(next: 'light' | 'dark' | 'auto') {
  applyTheme(next)
  showToast(`Theme: ${next.charAt(0).toUpperCase() + next.slice(1)}`)
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => (toast.value = ''), 1800)
}

// ── Security score (heuristic) ──────────────────────────────────
const securityScore = computed(() => {
  let score = 60 // baseline for having an account
  if (profile.value?.phone) score += 15
  if ((profile.value as any)?.isVerified) score += 25
  return Math.min(100, score)
})
const securityLabel = computed(() => {
  const s = securityScore.value
  if (s >= 90) return 'Excellent'
  if (s >= 75) return 'Strong'
  if (s >= 60) return 'Good'
  return 'Needs attention'
})
</script>

<style scoped>
.st-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 34px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.st-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.st-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  box-shadow:
    0 8px 22px rgba(19, 48, 71, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.st-nav-icon-btn:hover {
  transform: translateY(-2px);
}
.st-nav-icon-btn svg {
  width: 18px;
  height: 18px;
}
.st-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.st-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 14px;
}
.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-teal {
  background: radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

.st-hero {
  margin-top: 8px;
  border-radius: 28px;
  padding: 24px 18px 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
}
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
  margin-bottom: 4px;
}
.st-h1 {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -0.9px;
  line-height: 1.06;
}

.st-section-heading {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 18px 4px 10px;
  position: relative;
  z-index: 1;
}

.st-section {
  padding: 0;
  position: relative;
  z-index: 1;
}
.st-group {
  border-radius: 20px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.08);
  overflow: hidden;
  margin-bottom: 14px;
}
.st-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: transparent;
  border-bottom: 1px solid rgba(216, 230, 244, 0.72);
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: inherit;
  text-decoration: none;
  color: inherit;
}
.st-row:last-child {
  border-bottom: none;
}
.st-row:hover {
  background: rgba(245, 250, 255, 0.78);
}
.st-row.danger .st-row-label {
  color: #c35a47;
}
.st-row-content {
  flex: 1;
  min-width: 0;
}
.st-row-label {
  font-size: 14px;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.2px;
}
.st-row-meta {
  font-size: 12.5px;
  font-weight: 600;
  color: #627891;
  margin-top: 2px;
}
.st-row-chev {
  color: #8fa2bc;
  font-size: 18px;
  font-weight: 600;
}

.st-toggle {
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: #dce8f2;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}
.st-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.st-toggle.on {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
}
.st-toggle.on::after {
  transform: translateX(20px);
}

.st-segment {
  display: inline-flex;
  background: #edf2f8;
  border-radius: 100px;
  padding: 3px;
}
.st-segment-btn {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  color: #57708b;
  padding: 5px 10px;
  border-radius: 100px;
  cursor: pointer;
}
.st-segment-btn.active {
  background: #fff;
  color: #17314a;
}

.st-strength-card {
  border-radius: 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 32px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  padding: 16px;
}
.st-strength-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.st-strength-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  display: grid;
  place-items: center;
}
.st-strength-icon svg {
  width: 18px;
  height: 18px;
}
.st-strength-title {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
}
.st-strength-sub {
  font-size: 12px;
  color: #627891;
  font-weight: 600;
  margin-top: 2px;
}
.st-strength-bar {
  height: 6px;
  background: rgba(131, 228, 213, 0.35);
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 6px;
}
.st-strength-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--fx-aqua), var(--fx-blue));
  border-radius: 100px;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.st-strength-meter {
  font-size: 11px;
  font-weight: 700;
  color: #627891;
  display: flex;
  gap: 6px;
}
.st-strength-pct {
  color: #067a74;
  font-weight: 800;
}

.st-toast {
  position: fixed;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  z-index: 40;
  background: #17314a;
  color: #fff;
  font-size: 12.5px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 999px;
  box-shadow: 0 8px 22px rgba(35, 29, 69, 0.32);
}
.st-toast-enter-active,
.st-toast-leave-active {
  transition:
    opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.st-toast-enter-from,
.st-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.st-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.42);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 70;
}
.st-modal {
  width: 100%;
  max-width: 28rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  overflow: hidden;
  animation: st-up 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes st-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
.st-modal-handle { width: 36px; height: 4px; background: #ccd7e6; border-radius: 100px; margin: 8px auto 0; }
.st-modal-header { display: flex; align-items: center; padding: 12px 18px 10px; }
.st-modal-title { flex: 1; font-size: 18px; font-weight: 800; color: #17314a; letter-spacing: -0.4px; }
.st-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 12px;
  border: none;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  font-size: 20px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.st-modal-body { flex: 1; overflow-y: auto; padding: 6px 18px 14px; }
.st-modal-footer {
  padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  display: flex;
  gap: 8px;
}
.st-modal-intro {
  font-size: 12.5px;
  font-weight: 600;
  color: #627891;
  line-height: 1.5;
  margin-bottom: 14px;
}
.st-modal-error {
  color: #c35a47;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  margin-top: 4px;
}
.st-field { margin-bottom: 12px; }
.st-field-label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  margin-bottom: 6px;
}
.st-field-input {
  width: 100%;
  background: #fff;
  border: 1px solid #d9e4f0;
  border-radius: 12px;
  padding: 11px 12px;
  font-family: inherit;
  font-size: 14px;
  color: #17314a;
  outline: none;
}
.st-field-input:focus {
  border-color: #7da7cf;
}
.st-btn-secondary {
  flex: 1;
  background: #fff;
  color: #17314a;
  border: 1px solid #d6e3f0;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
}
.st-btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
.st-btn-primary {
  flex: 2;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
}
.st-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

@media (min-width: 768px) {
  .st-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .st-body {
    padding: 0 18px;
  }

  .st-hero {
    padding: 28px 24px 24px;
  }

  .st-h1 {
    font-size: 36px;
  }
}

@media (max-width: 430px) {
  .st-nav-title {
    font-size: 18px;
  }

  .st-h1 {
    font-size: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .st-nav-icon-btn,
  .st-row,
  .st-toggle::after,
  .st-segment-btn,
  .st-strength-fill,
  .st-modal {
    transition: none;
    animation: none;
  }
}
</style>
