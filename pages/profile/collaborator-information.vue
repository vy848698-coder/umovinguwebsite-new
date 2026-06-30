<template>
  <div class="cl-page">
    <WebTopNav>
      <template #actions>
        <button class="cl-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="cl-quick-btn solid" type="button" @click="openCollaboratorTypeModal">+ Add</button>
      </template>
    </WebTopNav>

    <main class="cl-body">
      <div class="atm-bg atm-bg-teal" />

      <!-- Page head -->
      <div class="cl-head">
        <div class="cl-head-copy">
          <h1 class="cl-title">Collaborators</h1>
          <p class="cl-subtitle">Invite and manage the people you work with.</p>
        </div>

        <!-- Orbital illustration -->
        <div class="cl-orbit" aria-hidden="true">
          <div class="cl-orbit-ring cl-orbit-ring-outer" />
          <div class="cl-orbit-ring cl-orbit-ring-inner" />
          <span class="cl-orbit-dot cl-orbit-dot-a" />
          <span class="cl-orbit-dot cl-orbit-dot-b" />
          <span class="cl-orbit-dot cl-orbit-dot-c" />
          <div class="cl-orbit-chip cl-orbit-chip-indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>
          </div>
          <div class="cl-orbit-chip cl-orbit-chip-amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>
          </div>
          <div class="cl-orbit-core">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
        </div>
      </div>

      <!-- Team banner -->
      <div class="cl-banner">
        <div class="cl-banner-glow" />
        <div class="cl-banner-copy">
          <div class="cl-banner-label">Your team</div>
          <div class="cl-banner-title">
            People you work with<span class="cl-banner-count">{{ collaborators.length }}</span>
          </div>
          <div class="cl-banner-stats">
            <span><span class="cl-stat-num">{{ collaborators.length }}</span> Collaborators</span>
            <span class="cl-stat-sep" />
            <span><span class="cl-stat-num">{{ propertyCount }}</span> Properties</span>
            <span class="cl-stat-sep" />
            <span><span class="cl-stat-num">{{ partnerCount }}</span> Partners</span>
          </div>
        </div>
        <button class="cl-banner-cta" type="button" @click="openCollaboratorTypeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add collaborator
        </button>
      </div>

      <!-- Toolbar: filter chips + search -->
      <div class="cl-toolbar">
        <div class="cl-filter-row">
          <button
            v-for="chip in filterChips"
            :key="chip.value"
            class="cl-chip"
            :class="{ active: activeFilter === chip.value }"
            @click="activeFilter = chip.value"
          >
            <svg v-if="chip.icon === 'scale'" class="cl-chip-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18" /><path d="M5 7h14" /><path d="m5 7-3 6a3 3 0 0 0 6 0z" /><path d="m19 7-3 6a3 3 0 0 0 6 0z" /><path d="M8 21h8" /></svg>
            <svg v-else-if="chip.icon === 'user'" class="cl-chip-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>
            <svg v-else-if="chip.icon === 'partner'" class="cl-chip-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 0 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 0 0 3-3l-3.9-3.9a2 2 0 0 0-1.7-.5l-3.2.5a2 2 0 0 1-1.6-.5L5 7" /><path d="m21 3-3 3" /><path d="m3 21 3-3" /></svg>
            {{ chip.label }}
            <span class="cl-chip-num">{{ chip.count }}</span>
          </button>
        </div>

        <label class="cl-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>
          <input v-model="searchText" type="text" placeholder="Search collaborators..." />
        </label>
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
          <span class="empty-spark empty-spark-1" />
          <span class="empty-spark empty-spark-2" />
          <span class="empty-spark empty-spark-3" />
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
        <button class="btn-primary" @click="openCollaboratorTypeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add collaborator
        </button>
      </div>
    </main>

    <!-- Floating add button — only when there are collaborators (avoids
         overlapping the empty-state card) -->
    <button
      v-if="filteredCollaborators.length"
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

    <SiteFooter />
  </div>
</template>

<script setup>
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import ProfilePageTitle from '~/components/profile/ProfilePageTitle.vue'
import WebTopNav from '~/components/core/WebTopNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

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
  { value: 'all', label: 'Everyone', icon: null, count: collaborators.value.length },
  {
    value: 'solicitor',
    label: 'Solicitors',
    icon: 'scale',
    count: collaborators.value.filter((p) =>
      /solicitor/i.test(p.role || p.roleLabel || ''),
    ).length,
  },
  {
    value: 'agent',
    label: 'Agents',
    icon: 'user',
    count: collaborators.value.filter((p) =>
      /agent|estate agent/i.test(p.role || p.roleLabel || ''),
    ).length,
  },
  {
    value: 'partner',
    label: 'Partners',
    icon: 'partner',
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
  background: #f3f2ef;
  color: var(--fx-text);
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.cl-page :deep(.webtop-nav) {
  background: rgba(243, 242, 239, 0.86);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
}

.cl-quick-btn {
  border: 1px solid #d6e3f0;
  background: rgba(255, 255, 255, 0.85);
  color: #2b3c56;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, filter 0.18s, background 0.18s;
}
.cl-quick-btn:hover {
  transform: translateY(-1px);
  border-color: #b9d5ea;
  color: #143047;
}
.cl-quick-btn.solid {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.cl-quick-btn.solid:hover {
  filter: saturate(1.06);
}

.cl-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 34px 24px 48px;
}

.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-teal {
  background: radial-gradient(circle at 88% 6%, rgba(0, 161, 154, 0.1) 0%, rgba(0, 161, 154, 0) 46%);
}

/* ── Page head ── */
.cl-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}
.cl-head-copy {
  min-width: 0;
}
.cl-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 44px;
  font-weight: 800;
  color: #10263d;
  letter-spacing: -1.4px;
  line-height: 1.04;
  margin: 0 0 8px;
}
.cl-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #627891;
  margin: 0;
  letter-spacing: -0.1px;
}

/* ── Orbital illustration ── */
.cl-orbit {
  position: relative;
  width: 300px;
  height: 150px;
  flex-shrink: 0;
}
.cl-orbit-ring {
  position: absolute;
  top: 50%;
  left: 58%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1.4px dashed rgba(0, 161, 154, 0.22);
}
.cl-orbit-ring-outer {
  width: 250px;
  height: 250px;
}
.cl-orbit-ring-inner {
  width: 150px;
  height: 150px;
  border-color: rgba(79, 79, 242, 0.2);
}
.cl-orbit-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}
.cl-orbit-dot-a { top: 24%; left: 38%; background: #4f4ff2; }
.cl-orbit-dot-b { top: 70%; left: 46%; background: #2dd4bf; }
.cl-orbit-dot-c { top: 30%; left: 82%; background: #00a19a; }
.cl-orbit-core {
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
.cl-orbit-core svg { width: 30px; height: 30px; }
.cl-orbit-chip {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 10px 22px rgba(15, 44, 76, 0.12);
}
.cl-orbit-chip svg { width: 20px; height: 20px; }
.cl-orbit-chip-indigo {
  top: 8px;
  left: 18%;
  color: #4f4ff2;
  background: linear-gradient(150deg, #eef0ff, #ffffff);
}
.cl-orbit-chip-amber {
  bottom: 10px;
  right: 4%;
  color: #e0992f;
  background: linear-gradient(150deg, #fff5e6, #ffffff);
}

/* ── Team banner ── */
.cl-banner {
  position: relative;
  z-index: 1;
  border-radius: 24px;
  background: linear-gradient(135deg, #211c4d 0%, #1c1a40 60%, #181734 100%);
  padding: 30px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  box-shadow: 0 24px 48px -18px rgba(20, 18, 56, 0.5);
}
.cl-banner-glow {
  position: absolute;
  top: -40%;
  right: -4%;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.22) 0%, transparent 64%);
  pointer-events: none;
}
.cl-banner-copy { position: relative; z-index: 2; min-width: 0; }
.cl-banner-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #2dd4bf;
  margin-bottom: 8px;
}
.cl-banner-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.8px;
  line-height: 1.1;
  margin-bottom: 14px;
}
.cl-banner-count {
  display: inline-block;
  margin-left: 12px;
  font-size: 26px;
  font-weight: 800;
  color: #2dd4bf;
  vertical-align: 2px;
}
.cl-banner-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
}
.cl-banner-stats .cl-stat-num {
  color: #2dd4bf;
  font-weight: 800;
  margin-right: 3px;
}
.cl-banner-stats .cl-stat-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
}
.cl-banner-cta {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #14b8a6 0%, #00a19a 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(0, 161, 154, 0.34);
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
}
.cl-banner-cta svg { width: 17px; height: 17px; }
.cl-banner-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(0, 161, 154, 0.42);
  filter: saturate(1.05);
}

/* ── Toolbar ── */
.cl-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 22px 2px 18px;
  position: relative;
  z-index: 1;
}
.cl-filter-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
.cl-filter-row::-webkit-scrollbar {
  display: none;
}
.cl-chip {
  background: rgba(255, 255, 255, 0.9);
  color: #4c627b;
  border: 1px solid #dbe6f1;
  border-radius: 100px;
  padding: 10px 16px;
  font-size: 13.5px;
  font-weight: 700;
  font-family: inherit;
  white-space: nowrap;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  letter-spacing: -0.1px;
}
.cl-chip:hover {
  border-color: #b9d5ea;
  transform: translateY(-1px);
}
.cl-chip-ic {
  width: 15px;
  height: 15px;
  color: #00a19a;
}
.cl-chip.active {
  background: linear-gradient(135deg, #14b8a6 0%, #00a19a 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(0, 161, 154, 0.26);
}
.cl-chip.active .cl-chip-ic { color: #fff; }
.cl-chip-num {
  font-size: 11px;
  font-weight: 800;
  color: #94a8bf;
}
.cl-chip.active .cl-chip-num {
  color: rgba(255, 255, 255, 0.78);
}
.cl-search {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #dbe6f1;
  border-radius: 100px;
  padding: 0 18px;
  height: 46px;
  min-width: 280px;
  flex: 0 1 320px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.cl-search:focus-within {
  border-color: #7fd0c9;
  box-shadow: 0 0 0 3px rgba(0, 161, 154, 0.12);
}
.cl-search svg {
  width: 17px;
  height: 17px;
  color: #94a8bf;
  flex-shrink: 0;
}
.cl-search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #17314a;
  width: 100%;
}
.cl-search input::placeholder {
  color: #94a8bf;
  font-weight: 600;
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
  transition: transform 0.52s cubic-bezier(0.22, 1, 0.36, 1);
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
  margin: 4px 0 24px;
  padding: 64px 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(248, 252, 255, 0.5) 100%);
  border: 1.5px dashed #cfdded;
  border-radius: 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-state-icon {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.18) 0%, rgba(45, 212, 191, 0.06) 70%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #00a19a;
  margin-bottom: 22px;
}
.empty-state-icon svg {
  width: 38px;
  height: 38px;
}
.empty-spark {
  position: absolute;
  width: 7px;
  height: 7px;
  background: #2dd4bf;
  border-radius: 1px;
  transform: rotate(45deg);
  opacity: 0.85;
}
.empty-spark-1 { top: 6px; left: 10px; }
.empty-spark-2 { top: 14px; right: 6px; width: 5px; height: 5px; background: #4f4ff2; }
.empty-spark-3 { bottom: 12px; left: 18px; width: 5px; height: 5px; }
.empty-state-title {
  font-size: 22px;
  font-weight: 800;
  color: #17314a;
  margin-bottom: 8px;
  letter-spacing: -0.4px;
}
.empty-state-sub {
  font-size: 15px;
  font-weight: 600;
  color: #627891;
  margin-bottom: 24px;
  line-height: 1.5;
  max-width: 340px;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #14b8a6 0%, #00a19a 100%);
  border: none;
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  padding: 14px 26px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(0, 161, 154, 0.3);
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
}
.btn-primary svg { width: 17px; height: 17px; }
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(0, 161, 154, 0.4);
  filter: saturate(1.05);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 184px;
  border-radius: 20px;
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  text-align: center;
  padding: 22px 18px;
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
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: #2f9bdf;
}

.cl-type-title {
  margin-top: 14px;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.2px;
}

.cl-type-desc {
  margin-top: 8px;
  max-width: 19ch;
  font-size: 12.5px;
  line-height: 1.5;
  color: #627891;
  font-weight: 500;
  letter-spacing: -0.1px;
  text-wrap: balance;
}

.cl-type-card--active .cl-type-icon {
  color: #00a19a;
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

@media (max-width: 860px) {
  .cl-body {
    padding: 24px 16px 0;
  }
  .cl-orbit {
    display: none;
  }
  .cl-title {
    font-size: 34px;
  }
  .cl-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 26px 24px;
    gap: 20px;
  }
  .cl-banner-cta {
    width: 100%;
    justify-content: center;
  }
  .cl-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .cl-search {
    flex: 1 1 auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .cl-title {
    font-size: 28px;
  }
  .cl-banner-title {
    font-size: 25px;
  }
  .empty-state {
    padding: 48px 18px;
  }
  .empty-state-title {
    font-size: 19px;
  }
  .cl-drawer-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cl-chip,
  .collaborator-card,
  .collab-action-btn,
  .cl-banner-cta,
  .btn-primary,
  .fab,
  .cl-type-card,
  .cl-drawer-cta {
    transition: none;
    animation: none;
  }

  .collaborator-card::before {
    display: none;
  }
}
</style>
