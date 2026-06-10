<template>
  <div class="st-page">
    <div class="ambient ambient-a" />
    <div class="ambient ambient-b" />
    <div class="mesh" />

    <WebTopNav>
      <template #actions>
        <button class="st-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="st-quick-btn solid" type="button" @click="navigateTo('/profile/support')">Support</button>
      </template>
    </WebTopNav>

    <main class="st-body">
      <button class="st-back-btn" type="button" @click="goBack">
        <span aria-hidden="true">&larr;</span>
        Back
      </button>

      <!-- Header: title + security card -->
      <header class="st-header">
        <div class="st-header-intro">
          <div class="st-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h1 class="st-h1">Settings</h1>
            <p class="st-subtitle">Manage your account, preferences and privacy settings all in one place.</p>
          </div>
        </div>

        <div class="st-strength-card">
          <div class="st-strength-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" />
              <rect x="9" y="11" width="6" height="5" rx="1" />
              <path d="M10 11V9.5a2 2 0 0 1 4 0V11" />
            </svg>
            <span class="st-strength-check">✓</span>
          </div>
          <div class="st-strength-body">
            <div class="st-strength-title">Account secured</div>
            <div class="st-strength-sub">Strong password · Keep email up to date</div>
            <div class="st-strength-meter">
              <span class="st-strength-pct">{{ securityScore }}%</span>
              <span>{{ securityLabel }}</span>
            </div>
            <div class="st-strength-bar">
              <div class="st-strength-fill" :style="{ width: securityScore + '%' }" />
            </div>
          </div>
        </div>
      </header>

      <!-- Card grid -->
      <div class="st-grid">
        <!-- Account & security -->
        <section class="st-card">
          <div class="st-card-head">
            <span class="st-card-chip teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
              </svg>
            </span>
            <h2 class="st-card-title">Account &amp; Security</h2>
          </div>
          <div class="st-group">
            <button class="st-row" @click="navigateTo('/profile/personal-information')">
              <span class="st-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                </svg>
              </span>
              <div class="st-row-content">
                <div class="st-row-label">Personal information</div>
                <div class="st-row-meta">Name, email, phone, address</div>
              </div>
              <span class="st-row-chev">›</span>
            </button>
            <button class="st-row" @click="openChangePassword">
              <span class="st-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 14a4 4 0 1 1 4-4" /><path d="m11 10 9 9" /><path d="m17 13 2 2" /><path d="m14 16 2 2" />
                </svg>
              </span>
              <div class="st-row-content">
                <div class="st-row-label">Change password</div>
                <div class="st-row-meta">Update the password on your account</div>
              </div>
              <span class="st-row-chev">›</span>
            </button>
          </div>
        </section>

        <!-- Notifications -->
        <section class="st-card">
          <div class="st-card-head">
            <span class="st-card-chip violet">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            <h2 class="st-card-title">Notifications</h2>
          </div>
          <div class="st-group">
            <div class="st-row">
              <span class="st-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
                </svg>
              </span>
              <div class="st-row-content">
                <div class="st-row-label">In-app push</div>
                <div class="st-row-meta">Viewing reminders &amp; messages</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.pushNotifications }" @click="setPref('pushNotifications', !prefs.pushNotifications)" />
            </div>
            <div class="st-row">
              <span class="st-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <div class="st-row-content">
                <div class="st-row-label">Email newsletter</div>
                <div class="st-row-meta">Weekly market &amp; saved property updates</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.emailNewsletter }" @click="setPref('emailNewsletter', !prefs.emailNewsletter)" />
            </div>
            <div class="st-row">
              <span class="st-row-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div class="st-row-content">
                <div class="st-row-label">SMS</div>
                <div class="st-row-meta">Time-sensitive alerts only</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.smsNotifications }" @click="setPref('smsNotifications', !prefs.smsNotifications)" />
            </div>
          </div>
        </section>

        <!-- Appearance & language -->
        <section class="st-card">
          <div class="st-card-head">
            <span class="st-card-chip teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </span>
            <h2 class="st-card-title">Appearance &amp; Language</h2>
          </div>
          <div class="st-group">
            <div class="st-row st-row--block">
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
        </section>

        <!-- Privacy & data -->
        <section class="st-card">
          <div class="st-card-head">
            <span class="st-card-chip indigo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <h2 class="st-card-title">Privacy &amp; Data</h2>
          </div>
          <div class="st-group">
            <div class="st-row">
              <div class="st-row-content">
                <div class="st-row-label">Contact visibility</div>
                <div class="st-row-meta">Sellers see your details only when you message them</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.contactVisible }" @click="setPref('contactVisible', !prefs.contactVisible)" />
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
        </section>
      </div>

      <!-- Legal + promo -->
      <div class="st-legal-row">
        <section class="st-card st-legal-card">
          <div class="st-card-head">
            <span class="st-card-chip blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3 8 4-3 7H7L4 7l8-4z" /><path d="M4 7 2 11m18-4 2 4M12 3v18" /><path d="M8 21h8" />
              </svg>
            </span>
            <h2 class="st-card-title">Legal</h2>
          </div>
          <div class="st-group">
            <a class="st-row" href="/legal/terms">
              <div class="st-row-content"><div class="st-row-label">Terms of Service</div></div>
              <span class="st-row-chev">›</span>
            </a>
            <a class="st-row" href="/legal/privacy">
              <div class="st-row-content"><div class="st-row-label">Privacy Policy</div></div>
              <span class="st-row-chev">›</span>
            </a>
            <a class="st-row" href="/legal/cookies">
              <div class="st-row-content"><div class="st-row-label">Cookie preferences</div></div>
              <span class="st-row-chev">›</span>
            </a>
            <div class="st-row" style="cursor: default">
              <div class="st-row-content">
                <div class="st-row-label">App version</div>
                <div class="st-row-meta">v1.0.0</div>
              </div>
            </div>
          </div>
        </section>

        <aside class="st-promo">
          <div class="st-promo-shield">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div class="st-promo-title">Your privacy is our priority</div>
          <div class="st-promo-text">We use bank-grade encryption to protect your data and privacy.</div>
          <button class="st-promo-btn" type="button" @click="navigateTo('/legal/privacy')">Learn more →</button>
        </aside>
      </div>

      <!-- Trust strip -->
      <div class="st-trust">
        <div class="st-trust-card">
          <span class="st-trust-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z" /><path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div>
            <div class="st-trust-title">Data Protected</div>
            <div class="st-trust-text">Bank-grade encryption keeps your data safe and secure.</div>
          </div>
        </div>
        <div class="st-trust-card">
          <span class="st-trust-icon violet">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
            </svg>
          </span>
          <div>
            <div class="st-trust-title">Always Up to Date</div>
            <div class="st-trust-text">Manage your preferences and stay in control.</div>
          </div>
        </div>
        <div class="st-trust-card">
          <span class="st-trust-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <div>
            <div class="st-trust-title">Need Help?</div>
            <div class="st-trust-text">Our support team is here to assist you.</div>
          </div>
          <span class="st-row-chev">→</span>
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
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Settings - UmovingU', middleware: 'auth' })

const config = useRuntimeConfig()
const { profile, fetchProfile } = useProfile()
const { theme, setTheme: applyTheme } = useTheme()
const goBack = useGoBack('/profile')

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
  padding-bottom: 48px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.mesh {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.025;
  background-image:
    linear-gradient(rgba(90, 126, 170, 0.7) 1px, transparent 1px),
    linear-gradient(90deg, rgba(90, 126, 170, 0.7) 1px, transparent 1px);
  background-size: 38px 38px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.72), transparent 92%);
}

.ambient {
  position: fixed;
  border-radius: 999px;
  filter: blur(44px);
  pointer-events: none;
  opacity: 0.24;
}
.ambient-a {
  width: 260px;
  height: 260px;
  top: 120px;
  left: -60px;
  background: rgba(0, 161, 154, 0.3);
}
.ambient-b {
  width: 280px;
  height: 280px;
  top: 160px;
  right: -80px;
  background: rgba(95, 139, 255, 0.26);
}

.st-quick-btn {
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}
.st-quick-btn.solid {
  border: 1px solid transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 12px 24px rgba(26, 121, 200, 0.2);
}

.st-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 22px 0;
}

.st-back-btn {
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  padding: 9px 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 18px;
}

/* ── Header ─────────────────────────────────────────────── */
.st-header {
  display: grid;
  grid-template-columns: 1fr minmax(320px, 460px);
  gap: 22px;
  align-items: stretch;
  margin-bottom: 26px;
}
.st-header-intro {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding-top: 6px;
}
.st-header-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  flex-shrink: 0;
  background: linear-gradient(150deg, rgba(0, 161, 154, 0.16), rgba(47, 155, 223, 0.12));
  color: var(--fx-aqua);
  display: grid;
  place-items: center;
}
.st-header-icon svg { width: 26px; height: 26px; }
.st-h1 {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 40px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -1px;
  line-height: 1.04;
}
.st-subtitle {
  font-size: 14px;
  font-weight: 600;
  color: #6a7d96;
  margin-top: 8px;
  max-width: 340px;
  line-height: 1.5;
}

.st-strength-card {
  border-radius: 22px;
  border: 1px solid rgba(173, 201, 231, 0.5);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.96) 0%, rgba(241, 250, 255, 0.92) 52%, rgba(236, 255, 249, 0.96) 100%);
  box-shadow:
    0 16px 40px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  padding: 22px 24px;
  display: flex;
  gap: 18px;
  align-items: center;
}
.st-strength-shield {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  flex-shrink: 0;
  background: linear-gradient(150deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 26px rgba(0, 150, 160, 0.32);
}
.st-strength-shield svg { width: 32px; height: 32px; }
.st-strength-check {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #14c08a;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
}
.st-strength-body { flex: 1; min-width: 0; }
.st-strength-title {
  font-size: 17px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
}
.st-strength-sub {
  font-size: 13px;
  color: #627891;
  font-weight: 600;
  margin-top: 3px;
}
.st-strength-meter {
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: #4a8f6a;
  margin-top: 12px;
}
.st-strength-pct { color: #14a36e; font-weight: 800; font-size: 14px; }
.st-strength-bar {
  height: 6px;
  background: rgba(131, 228, 213, 0.35);
  border-radius: 100px;
  overflow: hidden;
  margin-top: 8px;
}
.st-strength-fill {
  height: 100%;
  background: linear-gradient(90deg, #14c08a, var(--fx-aqua));
  border-radius: 100px;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── Card grid ──────────────────────────────────────────── */
.st-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 22px;
}
.st-card {
  border-radius: 22px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 252, 255, 0.95) 100%);
  box-shadow: 0 12px 30px rgba(15, 44, 76, 0.07);
  padding: 22px;
}
.st-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.st-card-chip {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.st-card-chip svg { width: 19px; height: 19px; }
.st-card-chip.teal { background: rgba(0, 161, 154, 0.12); color: var(--fx-aqua); }
.st-card-chip.violet { background: rgba(112, 92, 240, 0.12); color: #6c5ce7; }
.st-card-chip.indigo { background: rgba(79, 79, 242, 0.12); color: var(--fx-indigo); }
.st-card-chip.blue { background: rgba(47, 155, 223, 0.12); color: var(--fx-blue); }
.st-card-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #16314a;
}

.st-group {
  border-radius: 16px;
  border: 1px solid rgba(216, 230, 244, 0.8);
  background: #fff;
  overflow: hidden;
}
.st-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 16px;
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
.st-row:last-child { border-bottom: none; }
.st-row:hover { background: rgba(245, 250, 255, 0.78); }
.st-row.danger .st-row-label { color: #e0584a; }
.st-row.danger .st-row-chev { color: #e0584a; }
.st-row--block { cursor: default; }
.st-row--block:hover { background: transparent; }
.st-row-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: #f0f5fb;
  color: #51698a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.st-row-icon svg { width: 18px; height: 18px; }
.st-row-content { flex: 1; min-width: 0; }
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
  flex-shrink: 0;
}

.st-toggle {
  width: 46px;
  height: 26px;
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
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.st-toggle.on { background: linear-gradient(120deg, #14c08a 0%, var(--fx-aqua) 100%); }
.st-toggle.on::after { transform: translateX(20px); }

.st-segment {
  display: inline-flex;
  background: #edf2f8;
  border-radius: 100px;
  padding: 3px;
  flex-shrink: 0;
}
.st-segment-btn {
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #57708b;
  padding: 6px 13px;
  border-radius: 100px;
  cursor: pointer;
}
.st-segment-btn.active {
  background: #fff;
  color: #17314a;
  box-shadow: 0 2px 6px rgba(15, 44, 76, 0.12);
}

/* ── Legal + promo ──────────────────────────────────────── */
.st-legal-row {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 360px);
  gap: 22px;
  margin-bottom: 22px;
}
.st-legal-card { margin: 0; }
.st-promo {
  border-radius: 22px;
  padding: 28px 26px;
  background: linear-gradient(160deg, rgba(0, 161, 154, 0.1) 0%, rgba(47, 155, 223, 0.1) 55%, rgba(79, 79, 242, 0.1) 100%);
  border: 1px solid rgba(173, 201, 231, 0.5);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
}
.st-promo-shield {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: linear-gradient(150deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  box-shadow: 0 14px 26px rgba(0, 150, 160, 0.28);
}
.st-promo-shield svg { width: 30px; height: 30px; }
.st-promo-title {
  font-size: 18px;
  font-weight: 800;
  color: #10263d;
  letter-spacing: -0.3px;
}
.st-promo-text {
  font-size: 13px;
  font-weight: 600;
  color: #5e7186;
  line-height: 1.5;
  margin: 8px 0 18px;
}
.st-promo-btn {
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #16314a;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 18px;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 44, 76, 0.1);
}

/* ── Trust strip ────────────────────────────────────────── */
.st-trust {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
.st-trust-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 18px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 24px rgba(15, 44, 76, 0.06);
  padding: 18px 20px;
}
.st-trust-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.st-trust-icon svg { width: 21px; height: 21px; }
.st-trust-icon.teal { background: rgba(0, 161, 154, 0.12); color: var(--fx-aqua); }
.st-trust-icon.violet { background: rgba(112, 92, 240, 0.12); color: #6c5ce7; }
.st-trust-icon.blue { background: rgba(47, 155, 223, 0.12); color: var(--fx-blue); }
.st-trust-title {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
}
.st-trust-text {
  font-size: 12.5px;
  font-weight: 600;
  color: #627891;
  margin-top: 2px;
  line-height: 1.45;
}

/* ── Toast ──────────────────────────────────────────────── */
.st-toast {
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  z-index: 40;
  background: #17314a;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 11px 20px;
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

/* ── Change password modal ──────────────────────────────── */
.st-overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 70;
  padding: 20px;
}
.st-modal {
  width: 100%;
  max-width: 28rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(14, 40, 64, 0.3);
  animation: st-pop 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes st-pop { from { transform: translateY(14px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
.st-modal-handle { display: none; }
.st-modal-header { display: flex; align-items: center; padding: 18px 20px 10px; }
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
.st-modal-body { flex: 1; overflow-y: auto; padding: 6px 20px 14px; }
.st-modal-footer {
  padding: 12px 20px 18px;
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
.st-field-input:focus { border-color: #7da7cf; }
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

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 920px) {
  .st-header { grid-template-columns: 1fr; }
  .st-grid { grid-template-columns: 1fr; }
  .st-legal-row { grid-template-columns: 1fr; }
  .st-trust { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .st-body { padding: 16px 14px 0; }
  .st-h1 { font-size: 32px; }
  .st-card, .st-strength-card { padding: 18px; }
}

@media (prefers-reduced-motion: reduce) {
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
