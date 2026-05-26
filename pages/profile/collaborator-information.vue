<template>
  <div class="cl-page mobile-container">
    <!-- Nav bar — matches prototype -->
    <div class="cl-nav-bar">
      <button class="cl-nav-icon-btn" aria-label="Back" @click="goBack">
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
      <div class="cl-nav-title">Collaborators</div>
      <button class="cl-nav-icon-btn" aria-label="Search" @click="openSearch">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>
    </div>

    <main class="cl-body">
      <div class="atm-bg atm-bg-teal" />

      <!-- Hero -->
      <div class="cl-hero">
        <div class="hero-greeting">Your team</div>
        <div class="cl-h1">
          People you work with<span class="cl-h1-count">{{
            collaborators.length
          }}</span>
        </div>
        <div class="hero-stats">
          <span
            ><span class="stat-num">{{ collaborators.length }}</span
            >collaborators</span
          >
          <span class="stat-sep" />
          <span
            ><span class="stat-num">{{ propertyCount }}</span
            >properties</span
          >
          <span class="stat-sep" />
          <span
            ><span class="stat-num teal">{{ partnerCount }}</span
            >partners</span
          >
        </div>
      </div>

      <!-- Filter chips -->
      <div class="cl-filter-row">
        <button
          v-for="chip in filterChips"
          :key="chip.value"
          class="cl-chip"
          :class="{ active: activeFilter === chip.value }"
          @click="activeFilter = chip.value"
        >
          {{ chip.label }}
          <span class="cl-chip-num">{{ chip.count }}</span>
        </button>
      </div>

      <!-- Collaborator cards -->
      <div
        v-for="person in filteredCollaborators"
        :key="person.id"
        class="collaborator-card"
        @click="navigateTo(`/profile/collaborator-detail?id=${person.id}`)"
      >
        <div
          class="collab-avatar"
          :class="`collab-avatar--${avatarTone(person)}`"
        >
          {{ collabInitials(person) }}
        </div>
        <div class="collab-content">
          <div class="collab-name">{{ person.name }}</div>
          <div class="collab-role">{{ person.roleLabel }}</div>
          <div v-if="person.organization || person.email" class="collab-org">
            {{ person.organization || person.email }}
          </div>
          <div class="collab-properties">
            <span
              class="collab-prop-tag global"
              v-if="person.accessLevel === 'Owner' || person.propertyCount > 1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {{
                person.propertyCount > 1
                  ? `${person.propertyCount} properties`
                  : 'All properties'
              }}
            </span>
            <span v-else class="collab-prop-tag">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              {{ person.propertyCount }}
              {{ person.propertyCount === 1 ? 'property' : 'properties' }}
            </span>
          </div>
        </div>
        <div class="collab-actions">
          <button class="collab-action-btn" @click.stop>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty-state suggestion -->
      <div v-if="!filteredCollaborators.length" class="empty-state">
        <div class="empty-state-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="empty-state-title">No collaborators yet</div>
        <div class="empty-state-sub">
          Invite an agent, broker or partner to share your property journey.
        </div>
        <button class="btn-secondary" @click="openCollaboratorTypeModal">
          + Add collaborator
        </button>
      </div>
    </main>

    <!-- Floating add button -->
    <button
      class="fab"
      aria-label="Add collaborator"
      @click="openCollaboratorTypeModal"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.4"
        stroke-linecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <BaseDrawer
      v-model="showCollaboratorTypeModal"
      title="Collaborator Type"
      :show-back-button="false"
      @close="closeCollaboratorTypeModal"
    >
      <p class="cl-drawer-copy">
        Assign type of partnership to this account...
      </p>

      <div class="cl-drawer-grid">
        <button
          v-for="option in collaboratorTypeOptions"
          :key="option.key"
          type="button"
          class="cl-type-card"
          :class="{ 'cl-type-card--active': selectedCollaboratorType === option.key }"
          @click="selectedCollaboratorType = option.key"
        >
          <Icon name="i-heroicons-user-group" class="cl-type-icon" />
          <p class="cl-type-title">
            {{ option.title }}
          </p>
          <p class="cl-type-desc">
            {{ option.description }}
          </p>
        </button>
      </div>

      <template #footer>
        <button
          type="button"
          class="cl-drawer-cta"
          @click="continueCollaboratorType"
        >
          Continue
        </button>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup>
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import ProfilePageTitle from '~/components/profile/ProfilePageTitle.vue'

definePageMeta({
  title: 'Collaborators - UmovingU',
  middleware: 'auth',
})

const { fetchCollaborators, removeCollaborator } = useProfile()

const searchText = ref('')
const collaborators = ref([])

const roleLabels = {
  partner: 'Partner',
  solicitor: 'Solicitor',
  'estate-agent': 'Estate Agent',
  'mortgage-broker': 'Mortgage Broker',
}

const clientAccessLabels = {
  shared: 'Shared Clients',
  all: 'All Clients',
  none: 'No Clients',
}

const loadCollaborators = async () => {
  try {
    const data = await fetchCollaborators()
    collaborators.value = data.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      role: c.role || 'partner',
      roleLabel: roleLabels[c.role] || c.role || 'Collaborator',
      type: c.role || 'partner',
      propertyCount: c.propertyCount ?? 0,
      clientAccessLabel: clientAccessLabels[c.clientAccess] || 'Shared Clients',
      accessLevel:
        c.permission === 'all'
          ? 'All Properties'
          : c.permission === 'specific'
            ? 'Specific Properties'
            : 'Assign Later',
      status: 'active',
      avatar: c.avatarUrl || null,
    }))
  } catch {
    // list stays empty
  }
}

onMounted(loadCollaborators)

const ownerName = computed(() => 'You')

const partnerCount = computed(
  () => collaborators.value.filter((p) => p.type === 'partner').length,
)

const clientCount = computed(
  () => collaborators.value.filter((p) => p.type === 'client').length,
)

const pendingCount = computed(
  () => collaborators.value.filter((p) => p.status === 'pending').length,
)

const activeFilter = ref('all')

const filterChips = computed(() => [
  { value: 'all', label: 'Everyone', count: collaborators.value.length },
  {
    value: 'solicitor',
    label: 'Solicitors',
    count: collaborators.value.filter((p) =>
      /solicitor/i.test(p.role || p.roleLabel || ''),
    ).length,
  },
  {
    value: 'agent',
    label: 'Agents',
    count: collaborators.value.filter((p) =>
      /agent|estate agent/i.test(p.role || p.roleLabel || ''),
    ).length,
  },
  {
    value: 'partner',
    label: 'Partners',
    count: collaborators.value.filter((p) =>
      /partner|owner|co-owner/i.test(p.role || p.roleLabel || ''),
    ).length,
  },
])

const propertyCount = computed(() => {
  const ids = new Set()
  for (const p of collaborators.value) {
    for (const pid of p.propertyIds || []) ids.add(pid)
  }
  return ids.size || collaborators.value.length
})

const filteredCollaborators = computed(() => {
  let list = collaborators.value
  if (activeFilter.value === 'solicitor') {
    list = list.filter((p) => /solicitor/i.test(p.role || p.roleLabel || ''))
  } else if (activeFilter.value === 'agent') {
    list = list.filter((p) =>
      /agent|estate agent/i.test(p.role || p.roleLabel || ''),
    )
  } else if (activeFilter.value === 'partner') {
    list = list.filter((p) =>
      /partner|owner|co-owner/i.test(p.role || p.roleLabel || ''),
    )
  }
  if (!searchText.value.trim()) return list
  const query = searchText.value.toLowerCase()
  return list.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      (p.role || '').toLowerCase().includes(query),
  )
})

function avatarTone(person) {
  const r = (person.role || person.roleLabel || '').toLowerCase()
  if (r.includes('solicitor')) return 'solicitor'
  if (r.includes('agent')) return 'agent'
  if (r.includes('partner') || r.includes('owner')) return 'partner'
  if (r.includes('broker')) return 'broker'
  return 'solicitor'
}
function collabInitials(person) {
  const parts = (person.name || '').trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}
function openSearch() {
  // Lightweight inline search prompt. The chips above already filter the
  // list; this just exposes the text filter.
  const q = window.prompt('Search collaborators', searchText.value || '')
  if (q !== null) searchText.value = q.trim()
}

const summaryCollaborators = computed(() => collaborators.value.slice(0, 4))

const showCollaboratorTypeModal = ref(false)
const selectedCollaboratorType = ref('referrals')

const collaboratorTypeOptions = [
  {
    key: 'solicitor',
    title: 'Solicitor',
    description:
      'Share with your solicitor so they can access the property information needed for the legal process.',
  },
  {
    key: 'partner',
    title: 'Partner',
    description:
      'Share with your partner so they can view and manage your property details with you.',
  },
  {
    key: 'estate-agent',
    title: 'Estate Agent',
    description:
      'Give your estate agent access to the property details they need to help move the sale forward.',
  },
  {
    key: 'mortgage-broker',
    title: 'Mortgage Broker',
    description:
      'Share with your mortgage broker so they can view your property details and support your mortgage application.',
  },
]

const openCollaboratorTypeModal = () => {
  showCollaboratorTypeModal.value = true
}

const closeCollaboratorTypeModal = () => {
  showCollaboratorTypeModal.value = false
}

const continueCollaboratorType = () => {
  showCollaboratorTypeModal.value = false
  navigateTo(`/profile/add-collaborator?type=${selectedCollaboratorType.value}`)
}

const goBack = useGoBack('/profile')
</script>

<style scoped>
.cl-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-muted: #6f8199;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 96px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.cl-nav-bar {
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
.cl-nav-icon-btn {
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
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.cl-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow:
    0 12px 24px rgba(19, 48, 71, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.cl-nav-icon-btn svg {
  width: 18px;
  height: 18px;
}
.cl-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.cl-body {
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

.cl-hero {
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
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.cl-hero::before {
  content: '';
  position: absolute;
  inset: -145% auto auto -40%;
  width: 54%;
  height: 320%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 46%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-130%) rotate(16deg);
  transition: transform 0.78s ease;
  pointer-events: none;
}
.cl-hero:hover {
  transform: translateY(-4px);
  border-color: rgba(172, 203, 233, 0.7);
  box-shadow:
    0 20px 44px rgba(18, 55, 88, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.cl-hero:hover::before {
  transform: translateX(220%) rotate(16deg);
}
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #70839c;
  font-weight: 700;
  margin-bottom: 4px;
}
.cl-h1 {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 34px;
  font-weight: 750;
  color: #10263d;
  letter-spacing: -0.9px;
  line-height: 1.06;
  margin-bottom: 12px;
}
.cl-h1-count {
  display: inline-block;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #067a74;
  vertical-align: 6px;
  margin-left: 6px;
  letter-spacing: -0.2px;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #50637a;
  letter-spacing: -0.2px;
  flex-wrap: nowrap;
}
.hero-stats .stat-num {
  color: #17314a;
  font-weight: 800;
  margin-right: 4px;
}
.hero-stats .stat-num.teal {
  color: #067a74;
}
.hero-stats .stat-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #9ab0c9;
  display: inline-block;
}

.cl-filter-row {
  display: flex;
  gap: 8px;
  padding: 14px 2px 16px;
  overflow-x: auto;
  scrollbar-width: none;
  position: relative;
  z-index: 1;
}
.cl-filter-row::-webkit-scrollbar {
  display: none;
}
.cl-chip {
  background: rgba(255, 255, 255, 0.85);
  color: #4c627b;
  border: 1px solid #d6e3f0;
  border-radius: 100px;
  padding: 8px 13px;
  font-size: 12.5px;
  font-weight: 700;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  transition: all 0.2s;
  letter-spacing: -0.1px;
}
.cl-chip.active {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.cl-chip-num {
  font-size: 10px;
  font-weight: 800;
  color: #8aa0b8;
}
.cl-chip.active .cl-chip-num {
  color: rgba(255, 255, 255, 0.7);
}

.collaborator-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 20px;
  padding: 16px;
  margin: 0 0 12px;
  cursor: pointer;
  transition: all 0.24s;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  box-shadow:
    0 12px 24px rgba(19, 51, 82, 0.08),
    0 2px 8px rgba(19, 51, 82, 0.04);
  position: relative;
  overflow: hidden;
}
.collaborator-card::before {
  content: '';
  position: absolute;
  inset: -150% auto auto -45%;
  width: 50%;
  height: 320%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.38) 45%, rgba(255, 255, 255, 0) 100%);
  transform: rotate(16deg);
  transition: transform 0.72s ease;
  pointer-events: none;
}
.collaborator-card:hover {
  border-color: #b9d5ea;
  transform: translateY(-3px);
  box-shadow:
    0 18px 32px rgba(21, 58, 95, 0.14),
    0 4px 12px rgba(21, 58, 95, 0.06);
}
.collaborator-card:hover::before {
  transform: translateX(220%) rotate(16deg);
}
.collab-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.08),
    0 8px 16px rgba(48, 98, 214, 0.2);
}
.collab-avatar--solicitor {
  background: linear-gradient(145deg, #1b8e87, #1f6fa2);
}
.collab-avatar--agent {
  background: linear-gradient(145deg, #3b9bd8, #2a6ac6);
}
.collab-avatar--partner {
  background: linear-gradient(145deg, #00a19a, #3f7be0);
}
.collab-avatar--broker {
  background: linear-gradient(145deg, #4f4ff2, #2f9bdf);
}

.collab-content {
  flex: 1;
  min-width: 0;
}
.collab-name {
  font-size: 16px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.collab-role {
  font-size: 11px;
  font-weight: 700;
  color: #067a74;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 2px;
}
.collab-org {
  font-size: 12.5px;
  font-weight: 600;
  color: #627891;
  margin-top: 4px;
  line-height: 1.35;
}
.collab-properties {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.collab-prop-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 9px 4px 7px;
  border-radius: 100px;
}
.collab-prop-tag svg {
  width: 10px;
  height: 10px;
  opacity: 0.7;
}
.collab-prop-tag.global {
  background: #eff5fb;
  color: #57708b;
}
.collab-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.collab-action-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.collab-action-btn:hover {
  transform: translateY(-1px);
  background: rgba(205, 240, 232, 0.96);
}
.collab-action-btn svg {
  width: 14px;
  height: 14px;
}

.empty-state {
  margin: 16px 0;
  padding: 26px 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  border: 1px dashed #c7d8ea;
  border-radius: 20px;
  text-align: center;
}
.empty-state-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(228, 247, 243, 0.96);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #067a74;
  margin-bottom: 10px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.08);
}
.empty-state-icon svg {
  width: 24px;
  height: 24px;
}
.empty-state-title {
  font-size: 16px;
  font-weight: 800;
  color: #17314a;
  margin-bottom: 4px;
  letter-spacing: -0.2px;
}
.empty-state-sub {
  font-size: 13px;
  font-weight: 600;
  color: #627891;
  margin-bottom: 14px;
  line-height: 1.4;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #d6e3f0;
  color: #17314a;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 15px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-secondary:hover {
  border-color: #7fb7de;
  transform: translateY(-1px);
  color: #067a74;
}

.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 20;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition: all 0.24s;
}
.fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}
.fab svg {
  width: 22px;
  height: 22px;
}

.avatar-stack {
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-avatar {
  width: 118px;
  height: 118px;
  flex: 0 0 auto;
  border-radius: 9999px;
  border: 8px solid #ffffff;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
}

.summary-avatar + .summary-avatar {
  margin-left: -18px;
}

.cl-drawer-copy {
  margin-bottom: 18px;
  font-size: 14px;
  line-height: 1.45;
  color: #627891;
  font-weight: 600;
}

.cl-drawer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cl-type-card {
  min-height: 170px;
  border-radius: 20px;
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  text-align: center;
  padding: 18px 14px;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.cl-type-card:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}

.cl-type-card--active {
  border-color: transparent;
  background: linear-gradient(130deg, rgba(0, 161, 154, 0.1) 0%, rgba(47, 155, 223, 0.14) 100%);
  box-shadow:
    0 12px 22px rgba(48, 98, 214, 0.18),
    inset 0 0 0 2px rgba(0, 161, 154, 0.48);
}

.cl-type-icon {
  width: 18px;
  height: 22px;
  margin: 0 auto;
  color: #57708b;
}

.cl-type-title {
  margin-top: 12px;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.2px;
}

.cl-type-desc {
  margin-top: 8px;
  font-size: 12.5px;
  line-height: 1.35;
  color: #627891;
  font-weight: 600;
}

.cl-drawer-cta {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
  border: none;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.cl-drawer-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}

@media (min-width: 768px) {
  .cl-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .cl-body {
    padding: 0 18px;
  }

  .cl-hero {
    padding: 28px 24px 24px;
  }

  .cl-filter-row {
    padding: 16px 0 18px;
  }

  .cl-h1 {
    font-size: 36px;
  }

  .collaborator-card {
    padding: 18px;
  }
}

@media (max-width: 430px) {
  .cl-nav-title {
    font-size: 18px;
  }

  .cl-h1 {
    font-size: 30px;
  }

  .hero-stats {
    gap: 8px;
    padding: 7px 12px;
    font-size: 11.5px;
  }

  .cl-drawer-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cl-nav-icon-btn,
  .cl-hero,
  .cl-chip,
  .collaborator-card,
  .collab-action-btn,
  .btn-secondary,
  .fab,
  .cl-type-card,
  .cl-drawer-cta {
    transition: none;
    animation: none;
  }

  .cl-hero::before,
  .collaborator-card::before {
    display: none;
  }
}
</style>
