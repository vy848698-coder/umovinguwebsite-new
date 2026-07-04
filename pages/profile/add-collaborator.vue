<template>
  <div class="ac-page">
    <WebTopNav />

    <main class="ac-body">
      <button class="ac-back-link" type="button" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to collaborators
      </button>

      <!-- Hero -->
      <header class="ac-hero">
        <div class="ac-hero-copy">
          <div class="ac-kicker">Bring in your team</div>
          <h1 class="ac-title">Add a collaborator</h1>
          <p class="ac-sub">Invite someone to help with this property journey.</p>
        </div>

        <div class="ac-orbit" aria-hidden="true">
          <div class="ac-orbit-ring ac-orbit-ring-outer" />
          <div class="ac-orbit-ring ac-orbit-ring-inner" />
          <span class="ac-orbit-dot ac-orbit-dot-a" />
          <span class="ac-orbit-dot ac-orbit-dot-b" />
          <span class="ac-orbit-dot ac-orbit-dot-c" />
          <div class="ac-orbit-chip ac-orbit-chip-mail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </div>
          <div class="ac-orbit-chip ac-orbit-chip-case-a">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </div>
          <div class="ac-orbit-chip ac-orbit-chip-case-b">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          </div>
          <div class="ac-orbit-core">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
        </div>
      </header>

      <!-- Step 1: role -->
      <section class="ac-card">
        <div class="ac-card-head">
          <span class="ac-step">1</span>
          <h2 class="ac-card-title">Choose their role</h2>
        </div>
        <div class="ac-roles">
          <button
            v-for="role in roles"
            :key="role.value"
            type="button"
            class="ac-role"
            :class="{ active: collaboratorRole === role.value }"
            @click="collaboratorRole = role.value"
          >
            <div class="ac-role-icon" v-html="role.icon" />
            <div class="ac-role-label">{{ role.label }}</div>
            <div class="ac-role-sub">{{ role.sublabel }}</div>
          </button>
        </div>
      </section>

      <!-- Step 2: find or invite -->
      <section class="ac-card">
        <div class="ac-card-head">
          <span class="ac-step">2</span>
          <h2 class="ac-card-title">Find or invite collaborator</h2>
        </div>

        <div class="ac-seg">
          <button
            type="button"
            class="ac-seg-btn"
            :class="{ active: inviteMode === 'search' }"
            @click="inviteMode = 'search'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            Search existing
          </button>
          <button
            type="button"
            class="ac-seg-btn"
            :class="{ active: inviteMode === 'invite' }"
            @click="inviteMode = 'invite'"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
            Invite by email
          </button>
        </div>

        <!-- Search existing -->
        <div v-if="inviteMode === 'search'">
          <div class="ac-search">
            <input
              v-model="searchQuery"
              type="text"
              class="ac-search-input"
              placeholder="Search by name or email"
              @input="onSearchInput"
            />
            <span class="ac-search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
            </span>
            <span v-if="searching" class="ac-search-spin" />
          </div>

          <div v-if="searchResults.length > 0 && !selectedUser" class="ac-results">
            <button
              v-for="result in searchResults"
              :key="result.id"
              type="button"
              class="ac-result"
              @click="selectUser(result)"
            >
              <div class="ac-result-avatar" :style="avatarStyle(result.name)">
                <img v-if="result.avatarUrl" :src="result.avatarUrl" :alt="result.name" />
                <span v-else>{{ initials(result.name) }}</span>
              </div>
              <div class="ac-result-info">
                <div class="ac-result-name">{{ result.name }}</div>
                <div class="ac-result-email">{{ result.email }}</div>
              </div>
            </button>
          </div>

          <div v-if="selectedUser" class="ac-existing-row active">
            <div class="ac-result-avatar" :style="avatarStyle(selectedUser.name)">
              <img v-if="selectedUser.avatarUrl" :src="selectedUser.avatarUrl" :alt="selectedUser.name" />
              <span v-else>{{ initials(selectedUser.name) }}</span>
            </div>
            <div class="ac-result-info">
              <div class="ac-result-name">{{ selectedUser.name }}</div>
              <div class="ac-result-email">{{ selectedUser.email }}</div>
            </div>
            <button class="ac-result-clear" type="button" aria-label="Clear" @click="clearUser">×</button>
          </div>

          <p
            v-if="searchQuery.length >= 2 && !searching && searchResults.length === 0 && !selectedUser"
            class="ac-no-results"
          >
            No registered users found for "{{ searchQuery }}"
          </p>
        </div>

        <!-- Invite by email -->
        <div v-else>
          <input v-model="inviteName" type="text" class="ac-input" placeholder="Full name" />
          <div class="ac-spacer" />
          <input v-model="inviteOrg" type="text" class="ac-input" placeholder="Firm or company" />
          <div class="ac-spacer" />
          <input v-model="inviteEmail" type="email" class="ac-input" placeholder="Email address" />
          <p class="ac-hint">If you can't find them in UMU, we'll send an invite to join.</p>
        </div>
      </section>

      <!-- Step 3: properties -->
      <section class="ac-card">
        <div class="ac-card-head">
          <span class="ac-step">3</span>
          <div class="ac-card-head-text">
            <h2 class="ac-card-title">Attach to properties</h2>
            <p class="ac-card-desc">Select the properties this collaborator will have access to.</p>
          </div>
          <button type="button" class="ac-select-all" @click="setAllProperties(true)">Select all</button>
        </div>

        <div v-if="passportsLoading" class="ac-loading">Loading your properties…</div>
        <div v-else-if="properties.length === 0" class="ac-empty">
          You don't have any property passports yet. They'll have access to your account.
        </div>
        <div v-else class="ac-property-list">
          <button
            v-for="p in properties"
            :key="p.id"
            type="button"
            class="ac-property"
            :class="{ selected: p.selected }"
            @click="toggleProperty(p.id)"
          >
            <div class="ac-property-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" /></svg>
            </div>
            <div class="ac-property-text">
              <div class="ac-property-title">{{ p.title }}</div>
              <div v-if="p.postcode" class="ac-property-meta">{{ p.postcode }}</div>
            </div>
            <div class="ac-property-check">
              <svg v-if="p.selected" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
          </button>
        </div>
      </section>

      <!-- Step 4: communications -->
      <section class="ac-card">
        <div class="ac-card-head">
          <span class="ac-step">4</span>
          <h2 class="ac-card-title">Communication preferences</h2>
        </div>
        <div class="ac-toggle-row">
          <div class="ac-toggle-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div class="ac-toggle-text">
            <div class="ac-toggle-label">Allow direct messages</div>
            <div class="ac-toggle-desc">Let this collaborator message you directly in UMU.</div>
          </div>
          <button
            type="button"
            class="pir-toggle"
            :class="{ on: allowCommunications }"
            aria-label="Allow communications"
            @click="allowCommunications = !allowCommunications"
          />
        </div>
      </section>

      <p v-if="saveError" class="ac-error">{{ saveError }}</p>

      <div class="ac-actions">
        <button class="btn-secondary" type="button" @click="goBack">Cancel</button>
        <button
          class="btn-primary"
          type="button"
          :disabled="!canSave || saving"
          @click="save"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          {{ saving ? 'Adding…' : addLabel }}
        </button>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup>
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ title: 'Add Collaborator - UmovingU', middleware: 'auth' })

const route = useRoute()
const { fetchUserPassports, searchUsers, addCollaborator } = useProfile()

// Role
const roles = [
  {
    value: 'solicitor',
    label: 'Solicitor',
    sublabel: 'Legal representative',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 8h14"/><path d="M3 13l4-9 4 9c0 2-1.8 3.5-4 3.5S3 15 3 13z"/><path d="M13 13l4-9 4 9c0 2-1.8 3.5-4 3.5S13 15 13 13z"/></svg>',
  },
  {
    value: 'agent',
    label: 'Estate agent',
    sublabel: 'Property agent',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="3"/><path d="M11 13l5-5 4 4-5 5"/><path d="M16 8l1-1"/></svg>',
  },
  {
    value: 'broker',
    label: 'Mortgage broker',
    sublabel: 'Finance specialist',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7c0-2-1.6-3.5-4.5-3.5S9 5 9 7c0 4 9 4 9 8 0 2-1.6 3.5-4.5 3.5S9 17 9 15"/><line x1="13.5" y1="2" x2="13.5" y2="22"/></svg>',
  },
  {
    value: 'partner',
    label: 'Co-owner',
    sublabel: 'Property co-owner',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  },
]

// Segmented control: 'search' (existing user) | 'invite' (by email)
const inviteMode = ref('search')
const collaboratorRole = ref(
  typeof route.query.type === 'string' &&
    roles.find((r) => r.value === route.query.type)
    ? route.query.type
    : 'solicitor',
)

// User search
const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const selectedUser = ref(null)
let searchTimer = null

const onSearchInput = () => {
  if (selectedUser.value) return
  clearTimeout(searchTimer)
  if (searchQuery.value.trim().length < 2) {
    searchResults.value = []
    return
  }
  searching.value = true
  searchTimer = setTimeout(async () => {
    try {
      searchResults.value = await searchUsers(searchQuery.value)
    } catch {
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }, 350)
}

const selectUser = (user) => {
  selectedUser.value = user
  searchQuery.value = user.name
  searchResults.value = []
  inviteName.value = ''
  inviteOrg.value = ''
  inviteEmail.value = ''
}

const clearUser = () => {
  selectedUser.value = null
  searchQuery.value = ''
  searchResults.value = []
}

// Invite by email
const inviteName = ref('')
const inviteOrg = ref('')
const inviteEmail = ref('')

watch([inviteName, inviteEmail], () => {
  if ((inviteName.value || inviteEmail.value) && selectedUser.value) clearUser()
})

// Properties
const properties = ref([])
const passportsLoading = ref(false)

const loadPassports = async () => {
  passportsLoading.value = true
  try {
    const passports = await fetchUserPassports()
    properties.value = passports.map((p) => ({
      id: p.id,
      title: p.addressLine1 || p.address || 'Property',
      postcode: p.postcode || '',
      selected: false,
    }))
  } catch {
    properties.value = []
  } finally {
    passportsLoading.value = false
  }
}

const toggleProperty = (id) => {
  properties.value = properties.value.map((p) =>
    p.id === id ? { ...p, selected: !p.selected } : p,
  )
}
const setAllProperties = (val) => {
  properties.value = properties.value.map((p) => ({ ...p, selected: val }))
}
const selectedPropertyCount = computed(
  () => properties.value.filter((p) => p.selected).length,
)
const selectedPropertyIds = computed(() =>
  properties.value.filter((p) => p.selected).map((p) => p.id),
)

// Comms
const allowCommunications = ref(true)

// Save
const saving = ref(false)
const saveError = ref('')

const inviteValid = computed(
  () =>
    inviteName.value.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.value.trim()),
)
const canSave = computed(() => !!selectedUser.value || inviteValid.value)

const addLabel = computed(() => {
  if (selectedUser.value)
    return `Add ${selectedUser.value.name?.split(' ')[0] || 'collaborator'}`
  if (inviteValid.value)
    return `Invite ${inviteName.value.trim().split(/\s+/)[0]}`
  return 'Add collaborator'
})

const save = async () => {
  if (!canSave.value) return
  saving.value = true
  saveError.value = ''
  try {
    const ids = selectedPropertyIds.value
    const payload = {
      role: collaboratorRole.value,
      permission: ids.length > 0 ? 'specific' : 'all',
      accessDuration: 'permanent',
      clientAccess: 'shared',
      allowComms: allowCommunications.value,
    }
    if (ids.length > 0) payload.propertyIds = ids

    if (selectedUser.value) {
      payload.collaboratorId = selectedUser.value.id
    } else {
      payload.inviteName = inviteName.value.trim()
      payload.inviteOrg = inviteOrg.value.trim() || undefined
      payload.inviteEmail = inviteEmail.value.trim()
    }

    await addCollaborator(payload)
    navigateTo('/profile/collaborator-information')
  } catch (e) {
    saveError.value = e?.data?.message || 'Failed to add collaborator'
  } finally {
    saving.value = false
  }
}

const goBack = useGoBack('/profile/collaborator-information')

// Avatar helpers
const initials = (name) => {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
const avatarStyle = (name) => {
  const palettes = [
    'linear-gradient(155deg, #2C5F56, #143F38)',
    'linear-gradient(155deg, #D4A659, #6F4D14)',
    'linear-gradient(155deg, #FF8B5A, #B85B36)',
    'linear-gradient(155deg, #9D7BFF, #6B4E9F)',
  ]
  const i = (name?.charCodeAt(0) ?? 0) % palettes.length
  return { background: palettes[i] }
}

onMounted(loadPassports)
</script>


<style scoped>
.ac-page {
  --ac-teal: #00a19a;
  --ac-teal-strong: #00857f;
  --ac-navy: #231d45;
  --ac-text: #1f2b3f;
  --ac-muted: #627891;
  --ac-border: rgba(193, 215, 237, 0.7);
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  color: var(--ac-text);
  background:
    radial-gradient(circle at 88% 4%, rgba(0, 161, 154, 0.1) 0%, rgba(0, 161, 154, 0) 42%),
    linear-gradient(165deg, #f7fbff 0%, #eef3fb 52%, #edf9f7 100%);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Match shared top-nav to this page's light gradient */
.ac-page :deep(.webtop-nav) {
  background: rgba(247, 251, 255, 0.85);
  border-bottom: 1px solid rgba(173, 201, 231, 0.3);
}

.ac-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 24px 56px;
}

/* Back link */
.ac-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 26px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: var(--ac-muted);
  cursor: pointer;
  transition: color 0.18s;
}
.ac-back-link:hover {
  color: var(--ac-navy);
}
.ac-back-link svg {
  width: 15px;
  height: 15px;
}

/* Hero */
.ac-hero {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 26px;
}
.ac-hero-copy {
  min-width: 0;
}
.ac-kicker {
  font-family: 'Instrument Serif', 'Times New Roman', Georgia, serif;
  font-style: italic;
  font-size: 17px;
  color: var(--ac-teal);
  margin-bottom: 6px;
}
.ac-title {
  font-size: 42px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -1.4px;
  line-height: 1.04;
  margin: 0 0 8px;
}
.ac-sub {
  font-size: 15px;
  font-weight: 600;
  color: var(--ac-muted);
  margin: 0;
  letter-spacing: -0.1px;
}

/* Orbital illustration */
.ac-orbit {
  position: relative;
  width: 280px;
  height: 160px;
  flex-shrink: 0;
}
.ac-orbit-ring {
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1.4px dashed rgba(0, 161, 154, 0.22);
}
.ac-orbit-ring-outer {
  width: 240px;
  height: 240px;
}
.ac-orbit-ring-inner {
  width: 150px;
  height: 150px;
  border-color: rgba(0, 161, 154, 0.28);
}
.ac-orbit-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.ac-orbit-dot-a { top: 22%; left: 38%; background: #2dd4bf; }
.ac-orbit-dot-b { top: 72%; left: 48%; background: #00a19a; }
.ac-orbit-dot-c { top: 30%; left: 84%; background: #00857f; }
.ac-orbit-core {
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: linear-gradient(150deg, #19c2b3 0%, #00a19a 52%, #00857f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 14px 30px rgba(0, 161, 154, 0.34);
}
.ac-orbit-core svg { width: 30px; height: 30px; }
.ac-orbit-chip {
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: var(--ac-teal);
  box-shadow: 0 10px 22px rgba(15, 44, 76, 0.12);
}
.ac-orbit-chip svg { width: 19px; height: 19px; }
.ac-orbit-chip-mail { top: 26%; left: 8%; }
.ac-orbit-chip-case-a { top: 4px; right: 8%; }
.ac-orbit-chip-case-b { bottom: 22%; right: 2%; }

/* Step cards */
.ac-card {
  position: relative;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid var(--ac-border);
  border-radius: 22px;
  padding: 24px 26px;
  margin-bottom: 18px;
  box-shadow: 0 18px 40px -28px rgba(20, 40, 70, 0.4);
}
.ac-card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.ac-card-head-text {
  min-width: 0;
}
.ac-step {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 161, 154, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--ac-teal);
}
.ac-card-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -0.4px;
  margin: 0;
}
.ac-card-desc {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ac-muted);
  margin: 2px 0 0;
}
.ac-select-all {
  margin-left: auto;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: var(--ac-teal);
  cursor: pointer;
}
.ac-select-all:hover {
  color: var(--ac-teal-strong);
}

/* Roles */
.ac-roles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.ac-role {
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 16px;
  padding: 20px 14px;
  font-family: inherit;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.18s;
}
.ac-role:hover {
  border-color: #b9d5ea;
  transform: translateY(-1px);
}
.ac-role-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #ecf7f5;
  color: var(--ac-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  transition: all 0.18s;
}
.ac-role-icon svg {
  width: 20px;
  height: 20px;
}
.ac-role-label {
  font-size: 14px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -0.3px;
}
.ac-role-sub {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ac-muted);
}
.ac-role.active {
  background: var(--ac-navy);
  border-color: var(--ac-navy);
  box-shadow: 0 16px 30px -16px rgba(16, 38, 61, 0.7);
}
.ac-role.active .ac-role-icon {
  background: var(--ac-teal);
  color: #fff;
}
.ac-role.active .ac-role-label {
  color: #fff;
}
.ac-role.active .ac-role-sub {
  color: rgba(255, 255, 255, 0.6);
}

/* Segmented control */
.ac-seg {
  display: inline-flex;
  gap: 4px;
  background: #eef3f8;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 16px;
}
.ac-seg-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  border: none;
  border-radius: 9px;
  padding: 9px 16px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--ac-muted);
  cursor: pointer;
  transition: all 0.18s;
}
.ac-seg-btn svg {
  width: 15px;
  height: 15px;
}
.ac-seg-btn.active {
  background: #fff;
  color: var(--ac-navy);
  box-shadow: 0 4px 10px rgba(16, 38, 61, 0.08);
}

/* Search */
.ac-search {
  position: relative;
}
.ac-search-input,
.ac-input {
  width: 100%;
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 12px;
  padding: 13px 15px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: var(--ac-navy);
  outline: none;
  transition: all 0.18s;
}
.ac-search-input {
  padding-right: 44px;
}
.ac-search-input::placeholder,
.ac-input::placeholder {
  color: #9aabbd;
  font-weight: 500;
}
.ac-search-input:focus,
.ac-input:focus {
  border-color: var(--ac-teal);
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.16);
}
.ac-search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9aabbd;
  pointer-events: none;
}
.ac-search-icon svg {
  width: 16px;
  height: 16px;
}
.ac-search-spin {
  position: absolute;
  right: 40px;
  top: 50%;
  width: 15px;
  height: 15px;
  margin-top: -7.5px;
  border: 2px solid var(--ac-teal);
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.ac-results {
  margin-top: 8px;
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 14px;
  overflow: hidden;
}
.ac-result {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef3f8;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  color: inherit;
}
.ac-result:last-child {
  border-bottom: none;
}
.ac-result:hover {
  background: #f7fbff;
}
.ac-existing-row {
  margin-top: 8px;
  background: linear-gradient(135deg, #f1f9f4, #e2f1ea);
  border: 1.5px solid var(--ac-teal);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ac-result-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  overflow: hidden;
}
.ac-result-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ac-result-info {
  flex: 1;
  min-width: 0;
}
.ac-result-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -0.2px;
}
.ac-result-email {
  font-size: 12px;
  font-weight: 600;
  color: var(--ac-muted);
  margin-top: 1px;
}
.ac-result-clear {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  color: var(--ac-muted);
  font-size: 19px;
  cursor: pointer;
  font-family: inherit;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ac-no-results {
  margin-top: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ac-muted);
}
.ac-spacer {
  height: 8px;
}
.ac-hint {
  margin-top: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ac-muted);
}

/* Property list */
.ac-property-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ac-property {
  width: 100%;
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 13px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition: all 0.18s;
}
.ac-property:hover {
  border-color: #b9d5ea;
}
.ac-property.selected {
  border-color: var(--ac-teal);
  background: #f1f9f4;
}
.ac-property-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #ecf7f5;
  color: var(--ac-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ac-property.selected .ac-property-icon {
  background: var(--ac-teal);
  color: #fff;
}
.ac-property-icon svg {
  width: 16px;
  height: 16px;
}
.ac-property-text {
  flex: 1;
  min-width: 0;
}
.ac-property-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ac-property-meta {
  font-size: 12px;
  font-weight: 600;
  color: var(--ac-muted);
  margin-top: 1px;
}
.ac-property-check {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #cdd9e6;
  background: #fff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.ac-property.selected .ac-property-check {
  background: var(--ac-teal);
  border-color: var(--ac-teal);
}
.ac-property-check svg {
  width: 13px;
  height: 13px;
}

.ac-loading,
.ac-empty {
  background: #fff;
  border: 1px solid var(--ac-border);
  border-radius: 14px;
  padding: 16px 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ac-muted);
  text-align: center;
}

/* Toggle row */
.ac-toggle-row {
  display: flex;
  align-items: center;
  gap: 13px;
}
.ac-toggle-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #ecf7f5;
  color: var(--ac-teal);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ac-toggle-icon svg {
  width: 17px;
  height: 17px;
}
.ac-toggle-text {
  flex: 1;
  min-width: 0;
}
.ac-toggle-label {
  font-size: 14px;
  font-weight: 800;
  color: var(--ac-navy);
  letter-spacing: -0.2px;
}
.ac-toggle-desc {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ac-muted);
  margin-top: 1px;
}
.pir-toggle {
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: #d4dee8;
  border: none;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.pir-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s;
}
.pir-toggle.on {
  background: var(--ac-teal);
}
.pir-toggle.on::after {
  transform: translateX(20px);
}

.ac-error {
  text-align: center;
  color: #c2483a;
  font-size: 13px;
  font-weight: 700;
  margin: 4px 0 0;
}

/* Actions */
.ac-actions {
  display: flex;
  gap: 14px;
  margin-top: 22px;
}
.btn-secondary {
  flex: 1;
  background: #fff;
  color: var(--ac-navy);
  border: 1px solid var(--ac-border);
  border-radius: 14px;
  padding: 16px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-secondary:hover {
  border-color: #b9d5ea;
  background: #f7fbff;
}
.btn-primary {
  flex: 2.4;
  background: linear-gradient(120deg, #19c2b3 0%, #00a19a 52%, #00857f 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 14px 26px -10px rgba(0, 161, 154, 0.5);
  transition: filter 0.18s;
}
.btn-primary:hover {
  filter: saturate(1.08) brightness(1.02);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}
.btn-primary svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 860px) {
  .ac-orbit {
    display: none;
  }
  .ac-title {
    font-size: 34px;
  }
  .ac-roles {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 540px) {
  .ac-body {
    padding: 22px 16px 44px;
  }
  .ac-card {
    padding: 20px 18px;
    border-radius: 18px;
  }
  .ac-seg {
    display: flex;
    width: 100%;
  }
  .ac-seg-btn {
    flex: 1;
    justify-content: center;
  }
  .ac-actions {
    flex-direction: column-reverse;
  }
}
</style>
