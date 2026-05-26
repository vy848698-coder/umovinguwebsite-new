<template>
  <div class="profile-shell min-h-screen pb-10">
    <div class="profile-aurora" aria-hidden="true" />

    <main class="profile-content mx-auto px-4 sm:px-5 lg:px-6">
      <header class="profile-header">
        <button
          type="button"
          class="action-orb"
          aria-label="Go back"
          @click="goBack"
        >
          <Icon
            name="i-heroicons-chevron-left"
            class="w-[18px] h-[18px] text-[#143047]"
          />
        </button>
        <h1 class="profile-title">My Profile</h1>
        <div class="w-11 h-11" aria-hidden="true" />
      </header>

      <section class="hero-panel">
        <div class="hero-top-row">
          <div class="relative">
            <div class="avatar-ring" />
            <UserAvatar
              :src="profile?.avatarUrl"
              :firstName="profile?.firstName"
              :lastName="profile?.lastName"
              :size="112"
            />
          </div>

          <div class="hero-copy">
            <p class="hero-kicker">Account Overview</p>
            <h2 class="hero-name">{{ fullName || 'Your Profile' }}</h2>
            <p class="hero-email">{{ profile?.email || '' }}</p>
            <span class="member-pill">Member since {{ memberSince }}</span>
          </div>
        </div>

        <div class="mt-7">
          <div class="role-label-wrap">
            <p class="role-label">Your Role</p>
            <span class="role-subtle">Choose your active mode</span>
          </div>
          <div class="role-grid">
            <button
              v-for="r in roleOptions"
              :key="r.key"
              type="button"
              class="role-chip"
              :class="{ 'role-chip--active': currentRole === r.key }"
              :disabled="savingRole"
              @click="setRole(r.key)"
            >
              <span class="role-chip-icon">{{ r.emoji }}</span>
              <span>{{ r.label }}</span>
            </button>
          </div>
          <p v-if="roleSaved" class="role-feedback role-feedback--ok">Role updated</p>
          <p v-if="roleError" class="role-feedback role-feedback--error">
            {{ roleError }}
          </p>
        </div>
      </section>

      <section class="surface-panel mt-5">
        <div class="search-panel">
          <Icon
            name="i-heroicons-magnifying-glass"
            class="w-[18px] h-[18px] text-[#7f8fa5]"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Find a setting"
            class="search-input"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
          </button>
        </div>

        <div class="account-meta">
          <span>{{ filteredItems.length }} modules</span>
          <span class="account-meta-dot" aria-hidden="true" />
          <span>Secure workspace</span>
        </div>

        <ProfileSectionHead label="Account" />
        <div v-if="filteredItems.length" class="profile-row-list">
          <ProfileRow
            v-for="item in filteredItems"
            :key="item.title"
            :title="item.title"
            :meta="item.description"
            :iconTone="rowToneFor(item.title)"
            @click="onPreferenceClick(item)"
          >
            <template #icon>
              <OPIcon :name="item.icon" class="w-[18px] h-[18px]" />
            </template>
          </ProfileRow>
        </div>
        <div v-else class="no-results-card" role="status" aria-live="polite">
          <Icon name="i-heroicons-face-frown" class="w-6 h-6 text-[#8aa0b9]" />
          <p class="no-results-title">No settings found</p>
          <p class="no-results-text">
            Try another keyword like profile, document, or support.
          </p>
        </div>

        <div class="action-stack">
          <button
            type="button"
            class="danger-ghost"
            @click="showDeleteModal = true"
          >
            <Icon name="i-heroicons-trash" class="w-4 h-4" />
            Delete my Account
          </button>

          <button
            type="button"
            class="logout-button"
            @click="showLogoutModal = true"
          >
            <Icon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
            Log Out
          </button>
        </div>
      </section>
    </main>

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
import ProfileSectionHead from '~/components/profile/ProfileSectionHead.vue'

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

const goBack = () => {
  // if (typeof window !== 'undefined' && window.history.length > 1) {
  //   window.history.back()
  //   return
  // }

  navigateTo('/explore')
}

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
.profile-shell {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-panel-border: rgba(193, 215, 237, 0.7);
  position: relative;
  background:
    radial-gradient(circle at 8% 12%, rgba(13, 191, 181, 0.2) 0%, rgba(13, 191, 181, 0) 32%),
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.18) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.profile-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 16% 24%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 36%),
    radial-gradient(circle at 84% 74%, rgba(208, 236, 255, 0.55) 0%, rgba(208, 236, 255, 0) 48%);
}

.profile-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  padding-top: 18px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-title {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.action-orb {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.85);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  box-shadow:
    0 8px 22px rgba(19, 48, 71, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.action-orb:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow:
    0 12px 24px rgba(19, 48, 71, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.hero-panel {
  margin-top: 16px;
  border-radius: 28px;
  padding: 24px 18px 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-panel::before {
  content: '';
  position: absolute;
  inset: -145% auto auto -40%;
  width: 54%;
  height: 320%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.42) 46%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(16deg);
  transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.hero-panel:hover {
  transform: translateY(-4px);
  border-color: rgba(172, 203, 233, 0.7);
  box-shadow:
    0 20px 44px rgba(18, 55, 88, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.hero-panel:hover::before {
  transform: translateX(220%) rotate(16deg);
}

.hero-top-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: 9999px;
  background: linear-gradient(145deg, rgba(0, 161, 154, 0.4), rgba(74, 106, 255, 0.45));
  filter: blur(5px);
  opacity: 0.65;
  z-index: -1;
}

.hero-copy {
  text-align: center;
}

.hero-kicker {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
}

.hero-name {
  margin-top: 8px;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -0.85px;
  font-weight: 750;
  color: #10263d;
}

.hero-email {
  margin-top: 6px;
  color: #50637a;
  font-size: 14px;
}

.member-pill {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #047b75;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
}

.role-label-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.role-label {
  color: #71849b;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 11px;
  font-weight: 800;
}

.role-subtle {
  color: #8da0b6;
  font-size: 12px;
  font-weight: 600;
}

.role-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.role-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid #d5e1ee;
  background: rgba(255, 255, 255, 0.84);
  padding: 10px 12px;
  font-size: 14px;
  color: #203248;
  font-weight: 700;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.role-chip:hover {
  border-color: #b5d9ea;
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(30, 63, 103, 0.12);
}

.role-chip:disabled {
  opacity: 0.68;
}

.role-chip--active {
  border-color: transparent;
  color: #ffffff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.26);
}

.role-chip-icon {
  font-size: 15px;
}

.role-feedback {
  margin-top: 10px;
  font-size: 13px;
  font-weight: 600;
}

.role-feedback--ok {
  color: #067a74;
}

.role-feedback--error {
  color: #dc2626;
}

.surface-panel {
  border-radius: 24px;
  padding: 16px 12px 14px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.08);
  animation: panel-rise 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.surface-panel:hover {
  transform: translateY(-3px);
  border-color: #bdd6ea;
  box-shadow: 0 18px 34px rgba(15, 44, 76, 0.12);
}

.account-meta {
  margin-top: 10px;
  padding: 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #8296ae;
  font-size: 12px;
  font-weight: 600;
}

.account-meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #a8bad0;
}

.search-panel {
  height: 48px;
  border-radius: 14px;
  border: 1px solid #d9e4f0;
  background: #f8fbff;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color 0.15s ease;
}

.search-panel:focus-within {
  border-color: #7da7cf;
}

.search-input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #15273d;
}

.search-input::placeholder {
  color: #8c9cb2;
}

.clear-search {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #e8edf3;
  color: #4d5d72;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-row-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 0 4px 4px;
}

.no-results-card {
  margin: 4px 4px 2px;
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

.no-results-title {
  color: #1d344c;
  font-size: 15px;
  font-weight: 700;
}

.no-results-text {
  color: #7388a1;
  font-size: 13px;
  max-width: 270px;
}

.action-stack {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.danger-ghost {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  color: #ef4444;
  background: #fff5f5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.danger-ghost:hover {
  transform: translateY(-2px);
  border-color: #fca5a5;
  box-shadow: 0 10px 18px rgba(239, 68, 68, 0.16);
}

.logout-button {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}

:deep(.psh) {
  padding: 18px 8px 10px;
  color: #7d8ea5;
}

:deep(.prow) {
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 20px;
  min-height: 104px;
  padding: 18px 18px;
  box-shadow:
    0 12px 24px rgba(19, 51, 82, 0.08),
    0 2px 8px rgba(19, 51, 82, 0.04);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

:deep(.prow-icon) {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 8px 16px rgba(0, 161, 154, 0.08);
}

:deep(.prow-body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

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

:deep(.prow:hover) {
  transform: translateY(-3px);
  border-color: #afcfe8;
  box-shadow:
    0 18px 32px rgba(21, 58, 95, 0.14),
    0 4px 12px rgba(21, 58, 95, 0.06);
}

:deep(.prow:hover::before) {
  transform: translateX(220%) rotate(16deg);
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

:deep(.prow-right) {
  color: #5e7190;
}

:deep(.prow-chev) {
  color: #8fa2bc;
  font-size: 20px;
}

.profile-row-list :deep(.prow) {
  animation: row-rise 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.profile-row-list :deep(.prow:nth-child(2)) {
  animation-delay: 40ms;
}

.profile-row-list :deep(.prow:nth-child(3)) {
  animation-delay: 80ms;
}

.profile-row-list :deep(.prow:nth-child(4)) {
  animation-delay: 120ms;
}

@keyframes panel-rise {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes row-rise {
  from {
    transform: translateY(6px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-panel,
  .surface-panel,
  .action-orb,
  .role-chip,
  .danger-ghost,
  .logout-button,
  :deep(.prow) {
    transition: none;
    animation: none;
  }

  .hero-panel::before,
  :deep(.prow::before) {
    display: none;
  }
}

@media (min-width: 768px) {
  .profile-content {
    padding-top: 26px;
  }

  .hero-panel {
    padding: 28px 24px 22px;
  }

  .hero-top-row {
    flex-direction: row;
    justify-content: flex-start;
    gap: 20px;
  }

  .hero-copy {
    text-align: left;
  }

  .role-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .surface-panel {
    padding: 20px 18px 18px;
  }

  .profile-row-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  :deep(.prow) {
    min-height: 112px;
    padding: 20px 20px;
  }

  .action-stack {
    flex-direction: row;
  }

  .danger-ghost,
  .logout-button {
    flex: 1;
  }
}

@media (max-width: 430px) {
  .hero-name {
    font-size: 26px;
  }

  .role-subtle {
    display: none;
  }
}
</style>
