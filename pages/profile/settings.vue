<template>
  <div class="st-page">

    <WebTopNav>
      <template #actions>
        <button class="st-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="st-quick-btn solid" type="button" @click="navigateTo('/profile/support')">Support</button>
      </template>
    </WebTopNav>

    <main class="st-body">
      <!-- Header: title + security card -->
      <header class="st-header">
        <div class="st-header-intro">
          <div class="st-header-icon">
            <img src="/profile new icon/settings.jpeg" alt="" />
          </div>
          <div>
            <h1 class="st-h1">Settings</h1>
            <p class="st-subtitle">Manage your account, preferences and privacy settings all in one place.</p>
          </div>
        </div>

        <div class="st-strength-card">
          <div class="st-strength-shield">
            <img src="/homescore-icon/shield.png" alt="" />
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
              <img src="/buyer-profile-icon/idCard.png" alt="" />
            </span>
            <h2 class="st-card-title">Account &amp; Security</h2>
          </div>
          <div class="st-group">
            <button class="st-row" @click="navigateTo('/profile/personal-information')">
              <span class="st-row-icon">
                <img src="/buyer-profile-icon/buyers.png" alt="" />
              </span>
              <div class="st-row-content">
                <div class="st-row-label">Personal information</div>
                <div class="st-row-meta">Name, email, phone, address</div>
              </div>
              <span class="st-row-chev">›</span>
            </button>
            <button class="st-row" @click="openChangePassword">
              <span class="st-row-icon">
                <img src="/op-icons/investment/key.png" alt="" />
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
              <img src="/op-icons/misc/bell.png" alt="" />
            </span>
            <h2 class="st-card-title">Notifications</h2>
          </div>
          <div class="st-group">
            <div class="st-row">
              <span class="st-row-icon">
                <img src="/op-icons/profile/phone.png" alt="" />
              </span>
              <div class="st-row-content">
                <div class="st-row-label">In-app push</div>
                <div class="st-row-meta">Viewing reminders &amp; messages</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.pushNotifications }" @click="setPref('pushNotifications', !prefs.pushNotifications)" />
            </div>
            <div class="st-row">
              <span class="st-row-icon">
                <img src="/op-icons/profile/email.jpeg" alt="" />
              </span>
              <div class="st-row-content">
                <div class="st-row-label">Email newsletter</div>
                <div class="st-row-meta">Weekly market &amp; saved property updates</div>
              </div>
              <div class="st-toggle" :class="{ on: prefs.emailNewsletter }" @click="setPref('emailNewsletter', !prefs.emailNewsletter)" />
            </div>
            <div class="st-row">
              <span class="st-row-icon">
                <img src="/op-icons/matched-buyers/chat-multi.png" alt="" />
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
              <img src="/homescore-icon/lightbulb.png" alt="" />
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
              <img src="/homescore-icon/padlock.png" alt="" />
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

        <!-- Legal -->
        <section class="st-card st-legal-card">
          <div class="st-card-head">
            <span class="st-card-chip blue">
              <img src="/buyer-profile-icon/scales.png" alt="" />
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
            <img src="/buyer-profile-icon/verifiedDoc.png" alt="" />
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
            <img src="/homescore-icon/padlock.png" alt="" />
          </span>
          <div>
            <div class="st-trust-title">Data Protected</div>
            <div class="st-trust-text">Bank-grade encryption keeps your data safe and secure.</div>
          </div>
        </div>
        <div class="st-trust-card">
          <span class="st-trust-icon violet">
            <img src="/op-icons/investment/refreshArrows.png" alt="" />
          </span>
          <div>
            <div class="st-trust-title">Always Up to Date</div>
            <div class="st-trust-text">Manage your preferences and stay in control.</div>
          </div>
        </div>
        <div class="st-trust-card st-trust-card--link" role="button" tabindex="0" @click="navigateTo('/profile/support')" @keydown.enter="navigateTo('/profile/support')">
          <span class="st-trust-icon blue">
            <img src="/buyer-profile-icon/agent.png" alt="" />
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

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="st-footer">
      <div class="st-footer-grid">
        <div class="st-footer-intro">
          <div class="st-footer-brand">
            <img src="/logo-new.png" alt="" class="st-footer-logo" />
            <strong>umovingu</strong>
            <span style="font-size:9.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:#2fd0c6;background:rgba(0,161,154,.16);border:1px solid rgba(47,208,198,.35);border-radius:6px;padding:2px 7px;margin-left:2px;">BETA</span>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="st-footer-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="st-footer-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/dashboard')">Dashboard</button>
        </div>

        <div class="st-footer-col">
          <h5>Account</h5>
          <button type="button" @click="navigateTo('/profile')">Profile</button>
          <button type="button" @click="navigateTo('/profile/personal-information')">Personal info</button>
          <button type="button" @click="navigateTo('/profile/support')">Support</button>
        </div>

        <div class="st-footer-col">
          <h5>Legal</h5>
          <button type="button" @click="navigateTo('/legal/terms')">Terms of Service</button>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy Policy</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookie preferences</button>
        </div>
      </div>
      <div class="st-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>

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
  background: #f3f2ef;
  color: var(--fx-text);
  position: relative;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.st-page :deep(.webtop-nav) {
  background: rgba(243, 242, 239, 0.86);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
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
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.1;
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
  background: #00a19a;
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
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 40px;
  font-weight: 750;
  color: #231d45;
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
  border: 1px solid rgba(46, 40, 92, 0.5);
  background: linear-gradient(155deg, #211d44 0%, #1a1838 55%, #15132e 100%);
  box-shadow:
    0 18px 44px rgba(18, 22, 60, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
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
  background: linear-gradient(150deg, #16b8a6 0%, #0e9c92 100%);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 14px 26px rgba(0, 150, 160, 0.35);
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
  border: 2px solid #1a1838;
}
.st-strength-body { flex: 1; min-width: 0; }
.st-strength-title {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}
.st-strength-sub {
  font-size: 13px;
  color: rgba(214, 221, 245, 0.72);
  font-weight: 600;
  margin-top: 3px;
}
.st-strength-meter {
  display: flex;
  align-items: baseline;
  gap: 7px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(214, 221, 245, 0.72);
  margin-top: 12px;
}
.st-strength-pct { color: #2fe0bd; font-weight: 800; font-size: 14px; }
.st-strength-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.12);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-bottom: 22px;
  align-items: stretch;
}
.st-card {
  border-radius: 22px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 252, 255, 0.95) 100%);
  box-shadow: 0 12px 30px rgba(15, 44, 76, 0.07);
  padding: 22px;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  display: flex;
  flex-direction: column;
}
.st-row {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 16px;
  flex: 1 1 auto;
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

/* ── Privacy promo card (dark) ──────────────────────────── */
.st-legal-card { margin: 0; }
.st-promo {
  border-radius: 22px;
  padding: 28px 26px;
  background: linear-gradient(155deg, #211d44 0%, #1a1838 55%, #15132e 100%);
  border: 1px solid rgba(46, 40, 92, 0.6);
  box-shadow: 0 18px 44px rgba(18, 22, 60, 0.28);
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
  background: linear-gradient(150deg, #16b8a6 0%, #0e9c92 100%);
  color: #fff;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
  box-shadow: 0 14px 26px rgba(0, 150, 160, 0.32);
}
.st-promo-shield svg { width: 30px; height: 30px; }
.st-promo-title {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
}
.st-promo-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(214, 221, 245, 0.7);
  line-height: 1.5;
  margin: 8px 0 18px;
}
.st-promo-btn {
  border: none;
  border-radius: 12px;
  background: linear-gradient(120deg, #16b8a6 0%, #0e9c92 100%);
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 18px;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0, 150, 160, 0.3);
}

/* ── Trust strip ────────────────────────────────────────── */
.st-trust {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 48px;
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
.st-trust-card--link {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.st-trust-card--link:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(15, 44, 76, 0.1);
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

/* 3D illustrated icons: every icon slot is a white tile with a hairline
   border and the artwork filling most of it. Overrides the flat-glyph
   tints and teal gradients above. */
.st-header-icon,
.st-strength-shield,
.st-card-chip,
.st-row-icon,
.st-promo-shield,
.st-trust-icon {
  background: #fff;
  border: 1px solid #ebe8e2;
  box-sizing: border-box;
}
.st-header-icon img,
.st-strength-shield img,
.st-card-chip img,
.st-row-icon img,
.st-promo-shield img,
.st-trust-icon img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}
.st-header-icon { width: 60px; height: 60px; overflow: hidden; }
.st-header-icon img { width: 100%; height: 100%; }
.st-strength-shield,
.st-promo-shield {
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.28);
}
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
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
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
  background: #00a19a;
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

/* ── Footer ─────────────────────────────────────────────── */
.st-footer {
  position: relative;
  z-index: 1;
  background: linear-gradient(155deg, #1a1838 0%, #15132e 100%);
  color: #fff;
  padding: 56px 0 28px;
}
.st-footer-grid,
.st-footer-bottom {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 22px;
  padding-right: 22px;
}
.st-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.st-footer-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.st-footer-logo {
  height: 32px; width: auto; display: block; object-fit: contain; flex-shrink: 0;
}
.st-footer-brand strong { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.st-footer-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.st-footer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.st-footer-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.st-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.st-footer-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.st-footer-col button:hover { color: #2fe0bd; }
.st-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 1024px) {
  .st-grid { grid-template-columns: repeat(2, 1fr); }
  .st-footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 920px) {
  .st-header { grid-template-columns: 1fr; }
  .st-trust { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .st-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .st-body { padding: 16px 14px 0; }
  .st-h1 { font-size: 32px; }
  .st-card, .st-strength-card { padding: 18px; }
  .st-footer-grid { grid-template-columns: 1fr; gap: 22px; }
  .st-footer-grid, .st-footer-bottom { padding-left: 16px; padding-right: 16px; }
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
