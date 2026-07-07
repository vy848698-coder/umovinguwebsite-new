<template>
  <div class="st-root">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/logo-new.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/explore')">Explore</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-back" type="button" @click="navigateTo(backToPassportUrl)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Passport
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell stw-main">
      <!-- Breadcrumb -->
      <nav class="stw-crumbs" aria-label="Breadcrumb">
        <button type="button" @click="navigateTo('/passport')">Passport</button>
        <span aria-hidden="true">/</span>
        <button type="button" @click="navigateTo(backToPassportUrl)">Sections</button>
        <span aria-hidden="true">/</span>
        <strong>{{ currentStep?.title || '' }}</strong>
      </nav>

      <!-- ── Hero (full-width dark card) ─────────────────────────────── -->
      <section class="hero">
        <span class="hero-num" aria-hidden="true">{{ sectionNumberPadded }}</span>

        <div class="hero-body">
          <span class="hero-badge">
            <span class="dot"></span>
            Official record · Section {{ sectionNumber }} of {{ totalSections }}
          </span>
          <h1 class="hero-title">{{ currentStep?.title || '' }}</h1>
          <p class="hero-sub">{{ currentStep?.subtitle || '' }}</p>

          <div class="hero-stats">
            <div class="hero-stat">
              <strong>{{ answeredQuestions }}<em>/{{ totalQuestions }}</em></strong>
              <small>Questions</small>
            </div>
            <span class="hero-divider"></span>
            <div class="hero-stat">
              <strong>{{ totalTaskCount }}</strong>
              <small>Tasks</small>
            </div>
            <span class="hero-divider"></span>
            <div class="hero-stat">
              <strong>{{ completedTaskCount }}</strong>
              <small>Complete</small>
            </div>
          </div>

          <div class="hero-actions">
            <button class="hbtn teal" @click="showVideo = true">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
              Watch video
            </button>
            <button class="hbtn ghost" @click="showHelp = true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Help
            </button>
          </div>
        </div>

        <div class="hero-ring-wrap">
          <div class="hero-ring" :style="{ '--p': questionsPercent }">
            <div class="hero-ring-inner">
              <span class="hero-ring-pct">{{ questionsPercent }}%</span>
              <span class="hero-ring-lbl">Section answered</span>
            </div>
          </div>
          <span class="hero-updated">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Last updated {{ lastUpdatedDisplay }}
          </span>
        </div>
      </section>

      <!-- ── Seller progress bar card ────────────────────────────────── -->
      <section class="prog-card">
        <div class="prog-avatar">
          <OPIcon name="seller" class="w-[18px] h-[18px]" />
        </div>
        <div class="prog-text">
          <strong>Questions answered by seller</strong>
          <small>You'll see updates here as the seller completes this section.</small>
        </div>
        <div class="prog-track">
          <span class="prog-fill" :style="{ width: questionsPercent + '%' }"></span>
        </div>
        <div class="prog-count">{{ answeredQuestions }} / {{ totalQuestions }}</div>
      </section>

      <!-- ── Two-column body ─────────────────────────────────────────── -->
      <div class="stw-layout">
        <section class="stw-content">
          <div class="section-head">
            <span class="eyebrow"><span class="eyebrow-line"></span> This section</span>
            <h2 class="section-title">Question groups</h2>
            <p class="section-desc">
              {{ totalTaskCount }} {{ totalTaskCount === 1 ? 'task makes' : 'tasks make' }} up the
              {{ currentStep?.title || 'section' }} — tap any group to review the answers.
            </p>
            <div class="legend">
              <span class="legend-item"><span class="ld done"></span> Complete</span>
              <span class="legend-item"><span class="ld progress"></span> In progress</span>
              <span class="legend-item"><span class="ld none"></span> Not started</span>
            </div>
          </div>

          <div class="tasks-list">
            <button
              v-for="(task, index) in currentStep?.tasks"
              :key="task.id"
              class="task-card"
              :class="getTaskStatus(task)"
              @click="navigateToTask(task.id)"
            >
              <span class="task-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="task-icon" :class="getTaskStatus(task)">
                <OPIcon :name="task.icon || 'instructions'" class="w-[20px] h-[20px]" />
              </div>

              <div class="task-info">
                <h3 class="task-title">{{ task.title }}</h3>
                <p v-if="task.description" class="task-description">{{ task.description }}</p>

                <div class="task-progress-row">
                  <span class="task-badge" :class="getTaskStatus(task)">
                    <svg v-if="task.completed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {{ getTaskBadge(task) }}
                  </span>
                  <template v-if="task.totalQuestions > 0">
                    <div class="task-track">
                      <span class="task-fill" :class="getTaskStatus(task)" :style="{ width: getTaskProgress(task) + '%' }"></span>
                    </div>
                    <span class="task-pct">{{ getTaskProgress(task) }}%</span>
                  </template>
                </div>
              </div>

              <span class="task-arrow" :class="getTaskStatus(task)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>
          </div>
        </section>

        <aside class="stw-aside">
          <!-- Expert guidance -->
          <section class="expert-card">
            <span class="expert-badge"><span class="dot"></span> Under review</span>
            <div class="expert-ic">
              <OPIcon name="expertIcon" class="w-[22px] h-[22px]" />
            </div>
            <h3 class="expert-title">Need expert guidance?</h3>
            <p class="expert-desc">
              Get professional advice from a qualified property expert on this section.
            </p>
            <span class="expert-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Minimum time: 1 day
            </span>
            <button class="expert-btn" @click="handleViewProfile">View expert profile</button>
          </section>

          <!-- Section summary -->
          <section class="summary-card">
            <h3 class="summary-title">Section summary</h3>
            <div class="summary-row">
              <span>Answered</span>
              <strong>{{ answeredQuestions }} of {{ totalQuestions }}</strong>
            </div>
            <div class="summary-row">
              <span>Tasks complete</span>
              <strong>{{ completedTaskCount }} of {{ totalTaskCount }}</strong>
            </div>
            <div class="summary-row">
              <span>Section</span>
              <strong>{{ sectionNumber }} of {{ totalSections }}</strong>
            </div>
            <div class="summary-row">
              <span>Last updated</span>
              <strong>{{ lastUpdatedDisplay }}</strong>
            </div>
          </section>

          <!-- Up next -->
          <button v-if="nextStep" class="upnext-card" @click="goToNextSection">
            <div class="upnext-ic">
              <OPIcon :name="nextStep.icon || 'instructions'" class="w-[20px] h-[20px]" />
            </div>
            <div class="upnext-text">
              <small>Up next · Section {{ sectionNumber + 1 }}</small>
              <strong>{{ nextStep.title }}</strong>
            </div>
            <svg class="upnext-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </aside>
      </div>
    </main>

    <HelpDrawer
      mode="seller"
      :show="showHelp"
      :content="currentStep?.helpContent ?? null"
      @close="showHelp = false"
    />
    <VideoModal
      :show="showVideo"
      :video-url="currentStep?.helpVideoUrl ?? null"
      @close="showVideo = false"
    />

    <SiteFooter />

  </div>
</template>

<script setup>
import { usePassportRuntime } from '~/composables/usePassportRuntime'
import OPIcon from '~/components/ui/OPIcon.vue'
import HelpDrawer from '@/components/passport-view/HelpDrawer.vue'
import VideoModal from '@/components/passport-view/VideoModal.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const route = useRoute()
const router = useRouter()

const showHelp = ref(false)
const showVideo = ref(false)

const { currentStep, steps, setCurrentStep, loadPassport } =
  usePassportRuntime()

const stepId = route.params.id

const backToPassportUrl = computed(() => {
  return `/passportview/${route.query.propertyId}`
})

onMounted(async () => {
  if (route.query.propertyId) {
    await loadPassport(route.query.propertyId)
  }
})

watchEffect(() => {
  if (route.params.id && steps.value.length > 0) {
    setCurrentStep(route.params.id)
  }
})

// ── Task / question tallies ────────────────────────────────────────────────
const completedTaskCount = computed(
  () => currentStep.value?.tasks?.filter((t) => t.completed).length ?? 0,
)
const totalTaskCount = computed(() => currentStep.value?.tasks?.length ?? 0)

const answeredQuestions = computed(
  () =>
    currentStep.value?.tasks?.reduce(
      (sum, t) => sum + (t.answeredQuestions ?? 0),
      0,
    ) ?? 0,
)
const totalQuestions = computed(
  () =>
    currentStep.value?.tasks?.reduce(
      (sum, t) => sum + (t.totalQuestions ?? 0),
      0,
    ) ?? 0,
)
const questionsPercent = computed(() =>
  totalQuestions.value > 0
    ? Math.round((answeredQuestions.value / totalQuestions.value) * 100)
    : 0,
)

// ── Section position within the passport ───────────────────────────────────
const orderedSteps = computed(() => {
  const list = [...steps.value]
  const hasOrder = list.some((step) => typeof step.order === 'number')
  return hasOrder
    ? list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : list
})
const currentIndex = computed(() =>
  orderedSteps.value.findIndex((s) => s.id === currentStep.value?.id),
)
const sectionNumber = computed(() =>
  currentIndex.value >= 0 ? currentIndex.value + 1 : 1,
)
const sectionNumberPadded = computed(() =>
  String(sectionNumber.value).padStart(2, '0'),
)
const totalSections = computed(() => steps.value.length || 0)
const nextStep = computed(() =>
  currentIndex.value >= 0
    ? orderedSteps.value[currentIndex.value + 1] || null
    : null,
)

// ── Last updated ───────────────────────────────────────────────────────────
const fmtDate = (d) =>
  `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en-GB', {
    month: 'short',
  })} ${d.getFullYear()}`

const lastUpdatedDisplay = computed(() => {
  const raw = currentStep.value?.updatedAt || currentStep.value?.lastUpdated
  if (raw) {
    const d = new Date(raw)
    if (!isNaN(d.getTime())) return fmtDate(d)
  }
  return fmtDate(new Date())
})

// ── Task helpers ───────────────────────────────────────────────────────────
const getTaskStatus = (task) => {
  if (task.completed) return 'done'
  if ((task.answeredQuestions ?? 0) > 0) return 'progress'
  return 'none'
}

const getTaskBadge = (task) => {
  if (task.completed) return `All ${task.totalQuestions ?? 0} answered`
  if ((task.answeredQuestions ?? 0) > 0)
    return `${task.answeredQuestions} of ${task.totalQuestions} answered`
  return 'No answers yet'
}

const getTaskProgress = (task) => {
  if (task.completed) return 100
  if ((task.totalQuestions ?? 0) > 0) {
    return Math.round((task.answeredQuestions / task.totalQuestions) * 100)
  }
  return 0
}

// ── Navigation ─────────────────────────────────────────────────────────────
const navigateToTask = (taskId) => {
  router.push(
    `/passportview/steps/tasks/${taskId}?stepId=${stepId}&propertyId=${route.query.propertyId}`,
  )
}

const goToNextSection = () => {
  if (nextStep.value) {
    router.push(
      `/passportview/steps/${nextStep.value.id}?propertyId=${route.query.propertyId}`,
    )
  }
}

const handleViewProfile = () => {
  router.push(
    `/passportview/expert?propertyId=${route.query.propertyId}&stepId=${route.params.id}`,
  )
}

</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.st-root {
  --color-border: #ececf2;
  min-height: 100dvh;
  color: #231d45;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}

/* ── Web nav (shared HomeScore pattern) ───────────────────────────── */
.hsw-shell {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hsw-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.hsw-nav-inner {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hsw-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0d1835;
  cursor: pointer;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
  font-family: inherit;
}

.hsw-brand-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.hsw-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}

.hsw-links {
  display: flex;
  gap: 6px;
}

.hsw-links button {
  border: 0;
  background: transparent;
  color: #475a7b;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 14px;
  border-radius: 10px;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.18s, color 0.18s;
}

.hsw-links button:hover {
  color: #0c2342;
  background: rgba(0, 161, 154, 0.08);
}

.hsw-links button.active {
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.hsw-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.hsw-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d8e3ee;
  background: #fff;
  color: #0c2342;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.18s, background 0.18s;
}

.hsw-back:hover {
  border-color: #bfd1e4;
  background: #f8fbff;
}

.hsw-back svg {
  width: 15px;
  height: 15px;
}

/* ── Layout ───────────────────────────────────────────────────────── */
.stw-main {
  padding: 26px 0 60px;
}

.stw-crumbs {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
  color: #9a97a8;
}
.stw-crumbs button {
  border: 0;
  background: transparent;
  color: #8b8799;
  font: inherit;
  cursor: pointer;
  padding: 0;
  transition: color 0.16s;
}
.stw-crumbs button:hover {
  color: #00857f;
}
.stw-crumbs strong {
  color: #00857f;
  font-weight: 800;
}

/* ── Hero (dark) ──────────────────────────────────────────────────── */
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  padding: 34px 36px;
  display: flex;
  align-items: center;
  gap: 28px;
  color: #fff;
  background:
    radial-gradient(120% 130% at 88% 8%, rgba(0, 161, 154, 0.28), transparent 46%),
    linear-gradient(135deg, #2c2559 0%, #221d45 52%, #1b1838 100%);
  box-shadow: 0 22px 50px rgba(29, 24, 56, 0.28);
}
.hero-num {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 240px;
  font-weight: 800;
  line-height: 1;
  color: rgba(255, 255, 255, 0.05);
  pointer-events: none;
  letter-spacing: -0.04em;
  z-index: 0;
}
.hero-body {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 161, 154, 0.16);
  border: 1px solid rgba(47, 208, 198, 0.32);
  color: #7fe6dd;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 13px;
  border-radius: 999px;
}
.hero-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2fd0c6;
}
.hero-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 16px 0 8px;
}
.hero-sub {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.66);
  margin: 0;
  max-width: 520px;
}
.hero-stats {
  display: flex;
  align-items: center;
  gap: 22px;
  margin: 24px 0 26px;
}
.hero-stat strong {
  display: block;
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}
.hero-stat strong em {
  font-style: normal;
  font-size: 17px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
}
.hero-stat small {
  display: block;
  margin-top: 7px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.hero-divider {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.12);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.hbtn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 46px;
  padding: 0 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.16s ease, background 0.16s ease;
}
.hbtn:active {
  transform: scale(0.98);
}
.hbtn svg {
  width: 17px;
  height: 17px;
}
.hbtn.teal {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 12px 24px -10px rgba(0, 161, 154, 0.7);
}
.hbtn.teal:hover {
  background: #00b3ab;
}
.hbtn.ghost {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.18);
  color: #fff;
}
.hbtn.ghost:hover {
  background: rgba(255, 255, 255, 0.14);
}

.hero-ring-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.hero-ring {
  --p: 0;
  width: 168px;
  height: 168px;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    #2fd0c6 calc(var(--p) * 1%),
    rgba(255, 255, 255, 0.12) 0
  );
  display: grid;
  place-items: center;
}
.hero-ring-inner {
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: #221d44;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
}
.hero-ring-pct {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}
.hero-ring-lbl {
  margin-top: 8px;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.hero-updated {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.78);
}
.hero-updated svg {
  width: 13px;
  height: 13px;
}

/* ── Seller progress card ─────────────────────────────────────────── */
.prog-card {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 16px;
  padding: 18px 24px;
  background: #fff;
  border: 1px solid #ececf2;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(35, 29, 69, 0.05);
}
.prog-avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 13px;
  background: rgba(0, 161, 154, 0.1);
  display: grid;
  place-items: center;
}
.prog-text {
  flex-shrink: 0;
  min-width: 0;
}
.prog-text strong {
  display: block;
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
}
.prog-text small {
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  font-weight: 500;
  color: #8b8799;
}
.prog-track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #ece9e2;
  overflow: hidden;
}
.prog-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #00a19a, #2fd0c6);
  transition: width 0.4s ease;
}
.prog-count {
  flex-shrink: 0;
  font-size: 17px;
  font-weight: 800;
  color: #00857f;
}

/* ── Two-column body ──────────────────────────────────────────────── */
.stw-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 28px;
  align-items: start;
  margin-top: 34px;
}
.stw-content {
  min-width: 0;
}

.section-head {
  margin-bottom: 18px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #00857f;
}
.eyebrow-line {
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: #00a19a;
}
.section-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #231d45;
  margin: 12px 0 6px;
}
.section-desc {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: #8b8799;
  margin: 0;
  max-width: 480px;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #ececf2;
  font-size: 12.5px;
  font-weight: 700;
  color: #5a5570;
}
.ld {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.ld.done {
  background: #00a19a;
}
.ld.progress {
  background: #e79a2b;
}
.ld.none {
  background: #cbcdd6;
}

/* ── Task cards ───────────────────────────────────────────────────── */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.task-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: left;
  padding: 20px 22px 20px 26px;
  background: #fff;
  border: 1px solid #ececf2;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(35, 29, 69, 0.04);
  transition: transform 0.14s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.task-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: #e2e0e8;
  transition: background 0.18s ease;
}
.task-card.done::before {
  background: #00a19a;
}
.task-card.progress::before {
  background: #e79a2b;
}
.task-card:hover {
  transform: translateY(-3px);
  border-color: #00a19a;
  box-shadow: 0 18px 36px rgba(0, 161, 154, 0.18);
}
.task-card:hover::before {
  background: #00a19a;
}
.task-card:hover .task-title {
  color: #00857f;
}
.task-card:active {
  transform: translateY(-1px);
}
.task-index {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
  color: #b8b5c4;
  letter-spacing: 0.02em;
  width: 22px;
}
.task-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  background: #f4f3f7;
}
.task-icon.done {
  background: linear-gradient(135deg, #00a19a, #05867f);
}
.task-icon.done :deep(img) {
  filter: brightness(0) invert(1);
}
.task-icon.progress {
  background: linear-gradient(135deg, #f6b63f, #e79a2b);
}
.task-icon.progress :deep(img) {
  filter: brightness(0) invert(1);
}
.task-info {
  flex: 1;
  min-width: 0;
}
.task-title {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #231d45;
  margin: 0 0 4px;
  transition: color 0.18s ease;
}
.task-description {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.5;
  color: #8b8799;
  margin: 0;
}
.task-progress-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}
.task-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding: 6px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  background: #f1f0f4;
  color: #8b8799;
}
.task-badge svg {
  width: 12px;
  height: 12px;
}
.task-badge.done {
  background: rgba(0, 161, 154, 0.1);
  color: #00857f;
}
.task-badge.progress {
  background: rgba(231, 154, 43, 0.12);
  color: #c97e18;
}
.task-track {
  flex: 1;
  max-width: 260px;
  height: 8px;
  border-radius: 999px;
  background: #ece9e2;
  overflow: hidden;
}
.task-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: #cbcdd6;
  transition: width 0.4s ease;
}
.task-fill.done {
  background: linear-gradient(90deg, #00a19a, #2fd0c6);
}
.task-fill.progress {
  background: linear-gradient(90deg, #f6b63f, #e79a2b);
}
.task-pct {
  flex-shrink: 0;
  font-size: 12.5px;
  font-weight: 800;
  color: #8b8799;
}
.task-arrow {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f4f3f7;
  border: 1px solid #ececf2;
  color: #8b8799;
  transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease;
}
.task-arrow svg {
  width: 16px;
  height: 16px;
}
.task-arrow.done {
  background: #00a19a;
  border-color: #00a19a;
  color: #fff;
}
.task-card:hover .task-arrow {
  background: rgba(0, 161, 154, 0.1);
  border-color: rgba(0, 161, 154, 0.24);
  color: #00a19a;
}
.task-card:hover .task-arrow.done {
  background: #00857f;
  color: #fff;
}

/* ── Aside ────────────────────────────────────────────────────────── */
.stw-aside {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.expert-card {
  border-radius: 22px;
  padding: 24px;
  color: #fff;
  background:
    radial-gradient(120% 120% at 90% 6%, rgba(0, 161, 154, 0.26), transparent 50%),
    linear-gradient(160deg, #2a2355 0%, #201c42 60%, #1a1736 100%);
  box-shadow: 0 18px 40px rgba(29, 24, 56, 0.2);
}
.expert-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7fe6dd;
}
.expert-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2fd0c6;
}
.expert-ic {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  margin: 18px 0 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
}
.expert-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 8px;
}
.expert-desc {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.66);
  margin: 0 0 16px;
}
.expert-time {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.82);
  margin-bottom: 18px;
}
.expert-time svg {
  width: 13px;
  height: 13px;
}
.expert-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 14px;
  background: #00a19a;
  color: #fff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 26px -10px rgba(0, 161, 154, 0.7);
  transition: background 0.16s ease, transform 0.12s ease;
}
.expert-btn:hover {
  background: #00b3ab;
}
.expert-btn:active {
  transform: scale(0.98);
}

.summary-card {
  border-radius: 22px;
  padding: 22px 24px;
  background: #fff;
  border: 1px solid #ececf2;
  box-shadow: 0 8px 24px rgba(35, 29, 69, 0.05);
}
.summary-title {
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
  margin: 0 0 6px;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 0;
  border-bottom: 1px solid #f1f0f4;
}
.summary-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.summary-row span {
  font-size: 13.5px;
  font-weight: 600;
  color: #8b8799;
}
.summary-row strong {
  font-size: 13.5px;
  font-weight: 800;
  color: #231d45;
}

.upnext-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 18px 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 161, 154, 0.2);
  background: linear-gradient(135deg, #e7f7f4, #edf9f6);
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.14s ease, box-shadow 0.16s ease;
}
.upnext-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 161, 154, 0.16);
}
.upnext-ic {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 13px;
  background: linear-gradient(135deg, #00a19a, #05867f);
  display: grid;
  place-items: center;
}
.upnext-ic :deep(img) {
  filter: brightness(0) invert(1);
}
.upnext-text {
  flex: 1;
  min-width: 0;
}
.upnext-text small {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #00857f;
  margin-bottom: 4px;
}
.upnext-text strong {
  font-size: 16px;
  font-weight: 800;
  color: #231d45;
}
.upnext-arrow {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #00857f;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 1040px) {
  .stw-layout {
    grid-template-columns: 1fr;
  }
  .stw-aside {
    position: static;
    top: auto;
  }
}

@media (max-width: 899px) {
  .hsw-links {
    display: none;
  }
  .hsw-shell {
    width: calc(100% - 32px);
  }
  .hsw-nav-inner {
    min-height: 58px;
  }
  .hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 26px 24px;
    gap: 24px;
  }
  .hero-ring-wrap {
    flex-direction: row;
    align-self: stretch;
    justify-content: space-between;
    align-items: center;
  }
  .hero-title {
    font-size: 32px;
  }
  .prog-card {
    flex-wrap: wrap;
  }
  .prog-track {
    order: 3;
    flex-basis: 100%;
  }
}

@media (max-width: 640px) {
  .hsw-shell {
    width: calc(100% - 24px);
  }
  .hsw-back {
    display: none;
  }
  .hero-num {
    font-size: 150px;
  }
  .task-track {
    display: none;
  }
  .task-pct {
    display: none;
  }
}
</style>
