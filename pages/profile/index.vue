<template>
  <div class="pf-page">
    <WebTopNav>
      <template #actions>
        <button class="pf-quick-btn" type="button" @click="navigateTo('/profile/settings')">Settings</button>
        <button class="pf-quick-btn solid" type="button" @click="navigateTo('/profile/support')">Support</button>
      </template>
    </WebTopNav>

    <div class="pf-aurora" aria-hidden="true" />

    <main class="pf-body">
      <!-- ── Hero ─────────────────────────────────────────────── -->
      <header class="pf-hero">
        <div class="pf-hero-copy">
          <p class="pf-kicker"><span class="pf-kicker-dot" />My Profile</p>
          <h1 class="pf-h1">Manage your account<br />and preferences</h1>
          <p class="pf-sub">
            Update your information, manage settings,<br />
            and customize your experience.
          </p>
        </div>
        <img src="/house.png" alt="" class="pf-hero-house" />
      </header>

      <!-- ── Account overview ─────────────────────────────────── -->
      <section class="pf-overview">
        <div class="pf-identity">
          <div class="relative shrink-0">
            <div class="pf-avatar-ring" />
            <UserAvatar
              :src="profile?.avatarUrl"
              :firstName="profile?.firstName"
              :lastName="profile?.lastName"
              :size="84"
            />
          </div>
          <div class="pf-identity-copy">
            <p class="pf-overline">Account Overview</p>
            <h2 class="pf-name">{{ fullName || 'Your Profile' }}</h2>
            <p class="pf-email">{{ profile?.email || '' }}</p>
            <span class="pf-member-pill">Member since {{ memberSince }}</span>
          </div>
        </div>

        <div class="pf-overview-divider" aria-hidden="true" />

        <div class="pf-role-area">
          <div class="pf-role-head">
            <p class="pf-overline">Your Role</p>
            <span class="pf-role-hint">Choose your active mode</span>
          </div>
          <div class="pf-role-grid">
            <button
              v-for="r in roleOptions"
              :key="r.key"
              type="button"
              class="pf-role-chip"
              :class="{ 'pf-role-chip--active': currentRole === r.key }"
              :disabled="savingRole"
              @click="setRole(r.key)"
            >
              <span class="pf-role-emoji">{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
            </button>
          </div>
          <p v-if="roleSaved" class="pf-role-feedback pf-role-feedback--ok">Role updated</p>
          <p v-if="roleError" class="pf-role-feedback pf-role-feedback--error">
            {{ roleError }}
          </p>
        </div>
      </section>

      <!-- ── Modules ──────────────────────────────────────────── -->
      <section class="pf-panel">
        <div class="pf-search">
          <Icon
            name="i-heroicons-magnifying-glass"
            class="w-[18px] h-[18px] text-[#7f8fa5]"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Find a setting"
            class="pf-search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="pf-clear-search"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="pf-meta">
          <span>{{ filteredItems.length }} modules</span>
          <span class="pf-meta-dot" aria-hidden="true" />
          <Icon name="i-heroicons-shield-check" class="w-[14px] h-[14px]" />
          <span>Secure workspace</span>
        </div>

        <div v-if="filteredItems.length" class="pf-row-list">
          <ProfileRow
            v-for="item in filteredItems"
            :key="item.title"
            :title="item.title"
            :meta="item.description"
            :iconTone="rowToneFor(item.title)"
            @click="onPreferenceClick(item)"
          >
            <template #icon>
              <OPIcon :name="item.icon" class="w-[20px] h-[20px]" />
            </template>
          </ProfileRow>
        </div>
        <div v-else class="pf-no-results" role="status" aria-live="polite">
          <Icon name="i-heroicons-face-frown" class="w-6 h-6 text-[#8aa0b9]" />
          <p class="pf-no-results-title">No settings found</p>
          <p class="pf-no-results-text">
            Try another keyword like profile, document, or support.
          </p>
        </div>

        <div class="pf-actions">
          <button
            type="button"
            class="pf-danger-btn"
            @click="showDeleteModal = true"
          >
            <Icon name="i-heroicons-trash" class="w-4 h-4" />
            Delete my Account
          </button>

          <button
            type="button"
            class="pf-logout-btn"
            @click="showLogoutModal = true"
          >
            <Icon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
            Log Out
          </button>
        </div>
      </section>
    </main>

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="pf-footer">
      <div class="pf-footer-grid">
        <div class="pf-footer-intro">
          <div class="pf-footer-brand">
            <img src="/logo-new.png" alt="" class="pf-footer-logo" />
            <strong>umovingu</strong>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="pf-footer-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="pf-footer-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/explore')">Explore</button>
        </div>

        <div class="pf-footer-col">
          <h5>Account</h5>
          <button type="button" @click="navigateTo('/profile/personal-information')">Personal info</button>
          <button type="button" @click="navigateTo('/profile/settings')">Settings</button>
          <button type="button" @click="navigateTo('/profile/support')">Support</button>
        </div>

        <div class="pf-footer-col">
          <h5>Legal</h5>
          <button type="button" @click="navigateTo('/legal/terms')">Terms of Service</button>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy Policy</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookie preferences</button>
        </div>
      </div>
      <div class="pf-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>

    <!-- Logout confirmation modal -->
    <Teleport to="body">
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 z-[70] flex items-center justify-center px-6"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="showLogoutModal = false"
        />
        <div
          class="relative bg-white rounded-3xl px-6 py-8 w-full max-w-[340px] text-center shadow-2xl"
        >
          <div
            class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"
          >
            <Icon
              name="i-heroicons-arrow-right-on-rectangle"
              class="w-8 h-8 text-red-400"
            />
          </div>
          <h3 class="font-sf-pro text-[19px] font-semibold text-[#1f2024] mb-2">
            Log Out?
          </h3>
          <p class="font-sf-pro text-[14px] text-[#8f9094] mb-6">
            Are you sure you want to log out of your account?
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 h-[48px] rounded-2xl border border-[#e5e5ea] bg-[#f6f6f7] font-sf-pro text-[16px] font-medium text-[#1f2024]"
              @click="showLogoutModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="flex-1 h-[48px] rounded-2xl bg-red-500 font-sf-pro text-[16px] font-medium text-white disabled:opacity-60"
              :disabled="isLoggingOut"
              @click="logout"
            >
              {{ isLoggingOut ? 'Logging out…' : 'Log Out' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete account confirmation modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[70] flex items-center justify-center px-6"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="showDeleteModal = false"
        />
        <div
          class="relative bg-white rounded-3xl px-6 py-8 w-full max-w-[340px] text-center shadow-2xl"
        >
          <div
            class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"
          >
            <Icon name="i-heroicons-trash" class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="font-sf-pro text-[19px] font-semibold text-[#1f2024] mb-2">
            Delete Account?
          </h3>
          <p
            class="font-sf-pro text-[14px] text-[#8f9094] mb-6 leading-relaxed"
          >
            This will permanently delete your account, all your passports,
            documents, and data.
            <strong class="text-red-500">This cannot be undone.</strong>
          </p>
          <div class="flex gap-3">
            <button
              type="button"
              class="flex-1 h-[48px] rounded-2xl border border-[#e5e5ea] bg-[#f6f6f7] font-sf-pro text-[16px] font-medium text-[#1f2024]"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="flex-1 h-[48px] rounded-2xl bg-red-500 font-sf-pro text-[16px] font-medium text-white disabled:opacity-60"
              :disabled="isDeletingAccount"
              @click="deleteAccount"
            >
              {{ isDeletingAccount ? 'Deleting…' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import OPIcon from '~/components/ui/OPIcon.vue'
import UserAvatar from '~/components/ui/UserAvatar.vue'
import ProfileRow from '~/components/profile/ProfileRow.vue'
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({
  title: 'My Profile - UmovingU',
  middleware: 'auth',
})

const { profile, fullName, memberSince, fetchProfile } = useProfile()
const config = useRuntimeConfig()

const searchQuery = ref('')

const roleOptions = [
  { key: 'buy', label: 'Buying', emoji: '🏠' },
  { key: 'sell', label: 'Selling', emoji: '🏷️' },
  { key: 'landlord', label: 'Landlord', emoji: '🔑' },
  { key: 'both', label: 'Both', emoji: '↔️' },
]
const currentRole = ref('buy')
const savingRole = ref(false)
const roleSaved = ref(false)
const roleError = ref('')

onMounted(async () => {
  fetchProfile()
  // Read cached role immediately so the correct pill shows without waiting for API
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('umu_role')
    if (cached) currentRole.value = cached
  }
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      const prefs = await $fetch(
        `${config.public.apiBase}/profile/preferences`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const role = prefs?.purpose?.[0] ?? 'buy'
      currentRole.value = role
      if (typeof window !== 'undefined') localStorage.setItem('umu_role', role)
    }
  } catch {}
})

async function setRole(key) {
  if (savingRole.value || currentRole.value === key) return
  savingRole.value = true
  roleSaved.value = false
  roleError.value = ''
  const prevRole = currentRole.value
  currentRole.value = key // optimistic update
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const result = await $fetch(
      `${config.public.apiBase}/profile/preferences`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { purpose: [key] },
      },
    )
    console.log('[setRole] saved:', result)
    if (typeof window !== 'undefined') localStorage.setItem('umu_role', key)
    roleSaved.value = true
    setTimeout(() => {
      roleSaved.value = false
    }, 2500)
  } catch (err) {
    console.error('[setRole] failed:', err)
    roleError.value =
      'Failed to save — ' +
      (err?.data?.message || err?.message || 'unknown error')
    currentRole.value = prevRole // revert on error
  } finally {
    savingRole.value = false
  }
}

const profileItems = [
  {
    title: 'Your Personal Information',
    description: 'Manage how we know and communicate with you.',
    icon: 'personalInformation',
    route: '/profile/personal-information',
  },
  {
    title: 'Your Buyer Profile',
    description:
      'Verified ID, proof of funds and chain position — share with sellers, agents and solicitors.',
    icon: 'personalInformation',
    route: '/buyer-profile',
  },
  {
    title: 'Collaborators',
    description:
      'Invite, manage, and control who you work with across your property journey.',
    icon: 'collaborators',
    route: '/profile/collaborator-information',
  },
  {
    title: 'Your Documents',
    description: 'View and manage your essential property documents.',
    icon: 'yourDocuments',
    route: '/profile/document',
  },
  // Downloaded Snapshots — hidden for now; route still exists at
  // /profile/snapshot if we re-introduce it later.
  // {
  //   title: 'Downloaded Snapshots',
  //   description:
  //     'Easily export all your downloaded snapshots into formats such as PDF.',
  //   icon: 'snapshots',
  //   route: '/profile/snapshot',
  // },
  {
    title: 'Saved Properties',
    description: 'All your saved and recently viewed properties, organized.',
    icon: 'savedProperties',
    route: '/profile/saved-properties',
  },
  // Billing & Payment History — hidden for now; route still exists at
  // /profile/subscription-plan if we re-introduce it later.
  // {
  //   title: 'Billing & Payment History',
  //   description: 'Manage your subscription, invoices, and payment methods.',
  //   icon: 'billingPaymentHistory',
  //   route: '/profile/subscription-plan',
  // },
  {
    title: 'Settings',
    description: 'Customize your experience, privacy, and account security.',
    icon: 'settings',
    route: '/profile/settings',
  },
  {
    title: 'Help & Support',
    description: 'Need help? Browse FAQs or speak to support.',
    icon: 'helpSupport',
    route: '/profile/support',
  },
  {
    title: 'Calendar',
    description: 'Stay on top of viewings, deadlines, and reminders.',
    icon: 'calendar',
    route: '/profile/calendar',
  },
  {
    title: 'Learn & Ask AI',
    description: 'Get expert guidance and answers at any step.',
    icon: 'learnAskAI',
    route: '/profile/learn',
  },
]

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return profileItems
  }

  const query = searchQuery.value.toLowerCase().trim()
  return profileItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  )
})

const onPreferenceClick = async (item) => {
  if (item.route) {
    await navigateTo(item.route)
  }
}

const rowToneFor = (title) => {
  if (title === 'Settings') return 'neutral'
  if (title === 'Help & Support') return 'warn'
  if (title === 'Saved Properties') return 'good'
  return 'brand'
}

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)
const showDeleteModal = ref(false)
const isDeletingAccount = ref(false)

const logout = async () => {
  isLoggingOut.value = true
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      await $fetch(`${config.public.apiBase}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {}) // ignore network errors — still log out locally
    }
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('redirectAfterLogin')
    }
    showLogoutModal.value = false
    isLoggingOut.value = false
    await navigateTo('/onboarding/signin?reason=logout', { replace: true })
  }
}

const deleteAccount = async () => {
  isDeletingAccount.value = true
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      await $fetch(`${config.public.apiBase}/profile/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    }
  } catch {
    // Proceed with local cleanup regardless
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('redirectAfterLogin')
      sessionStorage.clear()
    }
    showDeleteModal.value = false
    isDeletingAccount.value = false
    await navigateTo('/onboarding/signup', { replace: true })
  }
}
</script>

<style scoped>
.pf-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.7);
  position: relative;
  min-height: 100dvh;
  background: #f3f2ef;
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pf-aurora {
  display: none;
}

.pf-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 34px 22px 64px;
}

.pf-quick-btn {
  border: 1px solid rgba(35, 29, 69, 0.14);
  background: rgba(255, 255, 255, 0.72);
  color: #231d45;
  font-size: 13.5px;
  font-weight: 700;
  padding: 9px 16px;
  border-radius: 11px;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, transform 0.18s;
}

.pf-quick-btn:hover {
  background: #fff;
  transform: translateY(-1px);
}

.pf-quick-btn.solid {
  border-color: transparent;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
}

/* ── Hero ─────────────────────────────────────────────────── */
.pf-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
}

.pf-kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: #00857f;
}

.pf-kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--fx-aqua);
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.14);
}

.pf-h1 {
  margin-top: 14px;
  font-size: 44px;
  line-height: 1.08;
  letter-spacing: -1.4px;
  font-weight: 800;
  color: #231d45;
}

.pf-sub {
  margin-top: 14px;
  font-size: 15.5px;
  line-height: 1.6;
  color: #5b6e86;
}

.pf-hero-house {
  width: 300px;
  max-width: 38vw;
  height: auto;
  filter: drop-shadow(0 24px 34px rgba(18, 55, 88, 0.18));
  animation: house-float 6s ease-in-out infinite;
}

@keyframes house-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ── Account overview ─────────────────────────────────────── */
.pf-overview {
  margin-top: 30px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 26px;
  border-radius: 26px;
  padding: 26px 28px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 250, 255, 0.92) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: pf-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.pf-identity {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}

.pf-avatar-ring {
  position: absolute;
  inset: -7px;
  border-radius: 9999px;
  background: rgba(0, 161, 154, 0.45);
  filter: blur(5px);
  opacity: 0.6;
  z-index: -1;
}

/* solid brand circle for the initials avatar (overrides inline gradient) */
.pf-identity .relative :deep(> div:not(.pf-avatar-ring)) {
  background: #00a19a !important;
}

.pf-overline {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 800;
}

.pf-name {
  margin-top: 6px;
  font-size: 24px;
  line-height: 1.15;
  letter-spacing: -0.6px;
  font-weight: 800;
  color: #231d45;
}

.pf-email {
  margin-top: 4px;
  color: #50637a;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.pf-member-pill {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12px;
  font-weight: 700;
  color: #047b75;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
}

.pf-overview-divider {
  width: 1px;
  align-self: stretch;
  background: linear-gradient(180deg, rgba(173, 201, 231, 0), rgba(173, 201, 231, 0.7), rgba(173, 201, 231, 0));
}

.pf-role-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.pf-role-hint {
  color: #8da0b6;
  font-size: 12px;
  font-weight: 600;
}

.pf-role-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.pf-role-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 13px;
  border: 1px solid #d5e1ee;
  background: rgba(255, 255, 255, 0.85);
  padding: 10px 8px;
  font-size: 13.5px;
  color: #203248;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.pf-role-chip:hover {
  border-color: #b5d9ea;
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(30, 63, 103, 0.12);
}

.pf-role-chip:disabled {
  opacity: 0.68;
}

.pf-role-chip--active {
  border-color: transparent;
  color: #fff;
  background: #00a19a;
  box-shadow: 0 10px 20px rgba(0, 161, 154, 0.28);
}

.pf-role-emoji {
  font-size: 15px;
}

.pf-role-feedback {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
}

.pf-role-feedback--ok {
  color: #067a74;
}

.pf-role-feedback--error {
  color: #dc2626;
}

/* ── Modules panel ────────────────────────────────────────── */
.pf-panel {
  margin-top: 22px;
  border-radius: 26px;
  padding: 22px 20px 20px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.07);
  animation: pf-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both;
}

.pf-search {
  height: 50px;
  border-radius: 14px;
  border: 1px solid #d9e4f0;
  background: #f8fbff;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.pf-search:focus-within {
  border-color: #7da7cf;
  box-shadow: 0 0 0 4px rgba(47, 155, 223, 0.1);
}

.pf-search-input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #15273d;
}

.pf-search-input::placeholder {
  color: #8c9cb2;
}

.pf-clear-search {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #e8edf3;
  color: #4d5d72;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pf-meta {
  margin-top: 12px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #8296ae;
  font-size: 12px;
  font-weight: 600;
}

.pf-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #a8bad0;
}

.pf-row-list {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.pf-no-results {
  margin-top: 14px;
  border: 1px dashed #c7d8ea;
  border-radius: 16px;
  background: rgba(248, 252, 255, 0.9);
  min-height: 128px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-align: center;
  padding: 16px;
}

.pf-no-results-title {
  color: #1d344c;
  font-size: 15px;
  font-weight: 700;
}

.pf-no-results-text {
  color: #7388a1;
  font-size: 13px;
  max-width: 270px;
}

/* ── Module cards (ProfileRow overrides) ──────────────────── */
:deep(.prow) {
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 20px;
  min-height: 108px;
  padding: 20px;
  gap: 16px;
  box-shadow:
    0 12px 24px rgba(19, 51, 82, 0.07),
    0 2px 8px rgba(19, 51, 82, 0.04);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  animation: pf-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* left accent bar that lights up on hover */
:deep(.prow::after) {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: #231d45;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* shine sweep */
:deep(.prow::before) {
  content: '';
  position: absolute;
  inset: -150% auto auto -45%;
  width: 50%;
  height: 320%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(16deg);
  transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.pf-row-list :deep(.prow:hover) {
  transform: translateY(-4px);
  border-color: #231d45 !important;
  box-shadow:
    0 20px 36px rgba(35, 29, 69, 0.2),
    0 0 0 1px rgba(35, 29, 69, 0.55),
    0 4px 12px rgba(35, 29, 69, 0.12);
}

:deep(.prow:hover::before) {
  transform: translateX(220%) rotate(16deg);
}

:deep(.prow:hover::after) {
  opacity: 1;
}

:deep(.prow-icon) {
  width: 52px;
  height: 52px;
  border-radius: 15px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 8px 16px rgba(0, 161, 154, 0.1);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    color 0.3s ease;
}

:deep(.prow:hover .prow-icon) {
  transform: scale(1.08) rotate(-3deg);
  background: #231d45 !important;
  border-color: #231d45 !important;
  color: #fff !important;
  box-shadow: 0 10px 20px rgba(35, 29, 69, 0.28) !important;
}

/* icons are <img> SVGs — invert to white on the navy tile */
:deep(.prow-icon img) {
  transition: filter 0.3s ease;
}

:deep(.prow:hover .prow-icon img) {
  filter: brightness(0) invert(1);
}

:deep(.prow-body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.prow-title) {
  font-size: 16px;
  line-height: 1.3;
}

:deep(.prow-meta) {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.5;
}

:deep(.prow-chev) {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #eef4fa;
  color: #5e7190;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

:deep(.prow:hover .prow-chev) {
  background: #231d45;
  color: #fff;
  transform: translateX(3px);
}

.pf-row-list :deep(.prow:nth-child(2)) { animation-delay: 40ms; }
.pf-row-list :deep(.prow:nth-child(3)) { animation-delay: 80ms; }
.pf-row-list :deep(.prow:nth-child(4)) { animation-delay: 120ms; }
.pf-row-list :deep(.prow:nth-child(5)) { animation-delay: 160ms; }
.pf-row-list :deep(.prow:nth-child(6)) { animation-delay: 200ms; }

/* ── Danger / logout ──────────────────────────────────────── */
.pf-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.pf-danger-btn {
  flex: 1;
  height: 52px;
  border-radius: 13px;
  border: 1px solid #fecaca;
  color: #ef4444;
  background: #fff5f5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.pf-danger-btn:hover {
  transform: translateY(-2px);
  border-color: #fca5a5;
  box-shadow: 0 10px 18px rgba(239, 68, 68, 0.16);
}

.pf-logout-btn {
  flex: 1;
  height: 52px;
  border-radius: 13px;
  border: 0;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.pf-logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}

/* ── Footer ───────────────────────────────────────────────── */
.pf-footer {
  position: relative;
  z-index: 1;
  background: linear-gradient(155deg, #1a1838 0%, #15132e 100%);
  color: #fff;
  padding: 56px 0 28px;
}

.pf-footer-grid,
.pf-footer-bottom {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-left: 22px;
  padding-right: 22px;
}

.pf-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pf-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 14px;
}

.pf-footer-logo {
  height: 32px;
  width: auto;
  display: block;
  object-fit: contain;
  flex-shrink: 0;
}

.pf-footer-brand strong {
  font-size: 19px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
}

.pf-footer-intro p {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px;
  max-width: 34ch;
}

.pf-footer-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pf-footer-chips span {
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 7px;
  padding: 5px 9px;
}

.pf-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.pf-footer-col button {
  display: block;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0;
  margin-bottom: 11px;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}

.pf-footer-col button:hover {
  color: #2fe0bd;
}

.pf-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

@keyframes pf-rise {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* ── Responsive ───────────────────────────────────────────── */
@media (max-width: 1024px) {
  .pf-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 920px) {
  .pf-h1 {
    font-size: 36px;
  }

  .pf-overview {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .pf-overview-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, rgba(173, 201, 231, 0), rgba(173, 201, 231, 0.7), rgba(173, 201, 231, 0));
  }
}

@media (max-width: 720px) {
  .pf-row-list {
    grid-template-columns: 1fr;
  }

  .pf-hero-house {
    display: none;
  }
}

@media (max-width: 560px) {
  .pf-body {
    padding: 24px 14px 48px;
  }

  .pf-h1 {
    font-size: 30px;
  }

  .pf-overview {
    padding: 20px 18px;
  }

  .pf-identity {
    flex-direction: column;
    align-items: flex-start;
  }

  .pf-role-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pf-role-hint {
    display: none;
  }

  .pf-actions {
    flex-direction: column;
  }

  .pf-footer-grid {
    grid-template-columns: 1fr;
    gap: 22px;
  }

  .pf-footer-grid,
  .pf-footer-bottom {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pf-overview,
  .pf-panel,
  .pf-role-chip,
  .pf-danger-btn,
  .pf-logout-btn,
  .pf-hero-house,
  :deep(.prow) {
    transition: none;
    animation: none;
  }

  :deep(.prow::before) {
    display: none;
  }
}
</style>
