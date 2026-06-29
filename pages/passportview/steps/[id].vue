<template>
  <div class="st-root">
    <div class="st-ambient st-ambient-a" />
    <div class="st-ambient st-ambient-b" />
    <div class="st-mesh" />

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
            Back to passport
          </button>
        </div>
      </div>
    </header>

    <main class="hsw-shell stw-main">
      <div class="stw-layout">
        <aside class="stw-aside">
      <!-- Hero — section header card (icon + title + ring meta) -->
      <section class="hero">
        <span class="hero-badge"
          ><span class="dot"></span> Low risk · Verified</span
        >
        <div class="hero-illustration" aria-hidden="true">
          <OPIcon
            v-if="currentStep?.icon"
            :name="currentStep.icon"
            class="w-[120px] h-[120px]"
          />
        </div>
        <h1 class="hero-title">{{ currentStep?.title || '' }}</h1>
        <p class="hero-sub">{{ currentStep?.subtitle || '' }}</p>
        <div class="hero-meta">
          <div class="ring" :style="{ '--p': stepProgress }">
            <span>{{ stepProgress }}%</span>
          </div>
          <div class="meta-text">
            <small>Overall Progress</small>
            <strong>
              {{ completedTaskCount }} of {{ totalTaskCount }}
              {{ totalTaskCount === 1 ? 'task' : 'tasks' }}
              <em>· {{ totalStepPoints }}pts earned</em>
            </strong>
          </div>
        </div>
      </section>

      <div class="action-buttons">
        <button class="help-btn" @click="showHelp = true">
          <OPIcon name="helpIcon" class="w-[15px] h-[15px]" />Help
        </button>
        <button class="video-btn" @click="showVideo = true">
          <span class="play-icon"
            ><OPIcon name="playIcon" class="w-[15px] h-[15px]"
          /></span>
          Play Video
        </button>
      </div>

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

      <PointsSection
        :points="totalStepPoints"
        :label="nextStepLabel"
        :description="`A total of ${totalStepPoints}points are available in this section.`"
        :show-rewards-link="true"
        :show-next-task="hasNextTask"
        @nextTask="goToNextTask"
      />

      <UnderReview
        title="Your Expert Guidance"
        :description="`You have 3 questions under review by an expert.`"
        :minimum-time="'3 Days'"
        @viewProfile="handleViewProfile"
      />
        </aside>

        <section class="stw-content">
      <div class="tasks-section">
        <div class="section-header">
          <h2 class="section-title">Your Tasks</h2>
          <button class="sort-btn">Sort</button>
        </div>

        <div class="tasks-list">
          <div
            v-for="task in currentStep?.tasks"
            :key="task.id"
            class="task-card"
            :class="{ completed: task.completed }"
            @click="navigateToTask(task.id)"
          >
            <div class="task-status">
              <div
                class="status-circle"
                :class="getTaskStatus(task)"
                :style="getTaskProgressStyle(task)"
              >
                <span v-if="task.completed" class="check-icon">✓</span>
                <span
                  v-else-if="getTaskStatus(task) === 'in-progress'"
                  class="progress-percentage"
                >
                  {{ getTaskProgress(task) }}%
                </span>
              </div>
            </div>

            <!-- <div class="task-icon">
              <span>{{ getTaskIcon(task) }}</span>
            </div> -->

            <div class="task-info">
              <div class="task-points">
                <span class="points-icon"
                  ><OPIcon name="giftIcon" class="w-[11px] h-[11px]"
                /></span>
                +0pts
              </div>
              <h3 class="task-title">{{ task.title }}</h3>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="11"
                    height="11"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  ~{{ getTaskMinutes(task) }} min
                </span>
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="11"
                    height="11"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {{ task.totalQuestions ?? 0 }}
                  {{
                    (task.totalQuestions ?? 0) === 1 ? 'question' : 'questions'
                  }}
                </span>
              </div>
              <div v-if="task.completed" class="task-completed-info">
                Completed • {{ getCompletedDate() }}
              </div>
            </div>

            <button class="task-arrow">
              <OPIcon name="caretRight" class="w-[13px] h-[13px]" />
            </button>
          </div>
        </div>
      </div>
        </section>
      </div>
    </main>

    <SiteFooter />

    <div class="st-mobile-nav">
      <BottomNav active="passport" />
    </div>
  </div>
</template>

<script setup>
import { usePassportRuntime } from '~/composables/usePassportRuntime'
import PointsSection from '@/components/passport-view/PointsSection.vue'
import UnderReview from '~/components/passport-view/UnderReview.vue'
import OPIcon from '~/components/ui/OPIcon.vue'
import HelpDrawer from '@/components/passport-view/HelpDrawer.vue'
import VideoModal from '@/components/passport-view/VideoModal.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import BottomNav from '~/components/core/BottomNav.vue'

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

// onMounted(() => {
//   setCurrentStep(stepId)
// })

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

const completedTaskCount = computed(() => {
  if (!currentStep.value) return 0
  return currentStep.value.tasks.filter((t) => t.completed).length
})
const totalTaskCount = computed(() => currentStep.value?.tasks?.length ?? 0)

const stepProgress = computed(() => {
  if (!currentStep.value) return 0
  const completedTasks = currentStep.value.tasks.filter(
    (t) => t.completed,
  ).length
  const totalTasks = currentStep.value.tasks.length
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
})

// const totalStepPoints = computed(() => {
//   return currentStep.value
//     ? currentStep.value.tasks.reduce((sum, task) => sum + task.pointsReward, 0)
//     : 0
// })

const totalStepPoints = computed(() => 0)

const orderedSteps = computed(() => {
  const list = [...steps.value]
  const hasOrder = list.some((step) => typeof step.order === 'number')
  if (hasOrder) {
    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
  return list
})

const nextStepLabel = computed(() => {
  if (!currentStep.value) return 'Next: '
  const currentIndex = orderedSteps.value.findIndex(
    (step) => step.id === currentStep.value.id,
  )
  const nextStep =
    currentIndex >= 0 ? orderedSteps.value[currentIndex + 1] : null
  return nextStep?.title ? `Next: ${nextStep.title}` : 'Next: '
})

const hasNextTask = computed(() => {
  if (!currentStep.value) return false
  const incompleteTasks = currentStep.value.tasks.filter((t) => !t.completed)
  return incompleteTasks.length > 0
})

const getTaskIcon = (task) => {
  return task.icon || '📋'
}

const getTaskStatus = (task) => {
  if (task.completed) return 'completed'
  if (task.answeredQuestions > 0) return 'in-progress'
  return 'pending'
}

const getTaskProgressStyle = (task) => {
  if (
    !task.completed &&
    task.answeredQuestions > 0 &&
    task.totalQuestions > 0
  ) {
    const progress = Math.round(
      (task.answeredQuestions / task.totalQuestions) * 100,
    )
    return { '--progress': `${progress}` }
  }
  return {}
}

const getTaskProgress = (task) => {
  if (task.totalQuestions > 0) {
    return Math.round((task.answeredQuestions / task.totalQuestions) * 100)
  }
  return 0
}

// Approx minutes to complete — ~1 min per question, minimum 2.
const getTaskMinutes = (task) => {
  const q = Number(task?.totalQuestions ?? 0)
  if (!q) return 2
  return Math.max(2, Math.round(q * 1))
}

const getCompletedDate = () => {
  return '10 February 2025'
}

const navigateToTask = (taskId) => {
  router.push(
    `/passportview/steps/tasks/${taskId}?stepId=${stepId}&propertyId=${route.query.propertyId}`,
  )
}

const goToNextTask = () => {
  if (currentStep.value) {
    const nextTask = currentStep.value.tasks.find((t) => !t.completed)
    if (nextTask) {
      navigateToTask(nextTask.id)
    }
  }
}

const handleViewProfile = () => {
  router.push(
    `/passportview/expert?propertyId=${route.query.propertyId}&stepId=${route.params.id}`,
  )
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.st-root {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #231d45;
  background:
    radial-gradient(circle at 78% 8%, rgba(0, 161, 154, 0.1), transparent 34%),
    radial-gradient(circle at 8% 14%, rgba(90, 76, 240, 0.08), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8fdfb 46%, #ffffff 100%);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}

.st-ambient,
.st-mesh {
  pointer-events: none;
  position: fixed;
}

.st-ambient {
  border-radius: 999px;
  filter: blur(48px);
  opacity: 0.16;
}

.st-ambient-a {
  width: 300px;
  height: 300px;
  left: -100px;
  top: 120px;
  background: #00a19a;
}

.st-ambient-b {
  width: 320px;
  height: 320px;
  right: -120px;
  top: 160px;
  background: #5a4cf0;
}

.st-mesh {
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
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
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
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
  padding: 34px 0 60px;
}

.stw-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
}

.stw-aside {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stw-content {
  min-width: 0;
}

.st-mobile-nav {
  display: none;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: transparent;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #00a19a;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  padding: 8px;
  cursor: pointer;
}

.back-arrow {
  font-size: 20px;
}

.menu-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #5a54d6;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
}

.step-content {
  padding: 0 16px 20px;
}

/* ── Hero (matches prototype disputes.html) ───────────── */
.hero {
  margin: 8px 0 16px;
  border-radius: 24px;
  background: linear-gradient(160deg, #ffffff 0%, #def7f1 60%, #d1e8e3 100%);
  padding: 22px 22px 24px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: -40% -20% auto auto;
  width: 220px;
  height: 220px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.7),
    transparent 65%
  );
  pointer-events: none;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(15, 118, 110, 0.15);
  color: #0f766e;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  position: relative;
  z-index: 1;
}
.hero-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00a19a;
}
.hero-illustration {
  display: flex;
  justify-content: center;
  margin: 4px 0 8px;
  position: relative;
  z-index: 1;
}
.hero-title {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #0a0f2c;
  margin: 4px 0 4px;
  position: relative;
  z-index: 1;
}
.hero-sub {
  color: #115e59;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 16px;
  position: relative;
  z-index: 1;
}
.hero-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
  position: relative;
  z-index: 1;
}
.ring {
  --p: 0;
  --size: 56px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: conic-gradient(
    #1f7a66 calc(var(--p) * 1%),
    rgba(15, 118, 110, 0.15) 0
  );
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.ring::after {
  content: '';
  width: 44px;
  height: 44px;
  background: #fff;
  border-radius: 50%;
  grid-area: 1 / 1;
}
.ring span {
  grid-area: 1 / 1;
  z-index: 1;
  font-size: 13px;
  font-weight: 700;
  color: #0a0f2c;
  line-height: 1;
}
.meta-text small {
  display: block;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #115e59;
  margin-bottom: 4px;
}
.meta-text strong {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: #0a0f2c;
}
.meta-text strong em {
  font-style: normal;
  color: #64748b;
  font-weight: 500;
}

.step-illustration {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.step-icon-large {
  font-size: 100px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.step-title {
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 8px;
  color: #1a1a1a;
}

.step-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-bar {
  height: 16px;
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a19a 0%, #00d4c3 100%);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 11px;
  color: #3c3c4399;
  font-weight: 400;
  letter-spacing: 0.06px;
  line-height: 13px;
}

.progress-value {
  font-size: 11px;
  color: #00a19a;
  font-weight: 590;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.help-btn,
.video-btn {
  flex: 1;
  padding: 13px 14px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
  color: #0f766e;
}

.help-btn:active,
.video-btn:active {
  transform: scale(0.98);
}

.video-btn {
  background: #1f7a66;
  color: white;
  border-color: #1f7a66;
  box-shadow: 0 8px 20px -8px rgba(13, 148, 136, 0.6);
}

.play-icon {
  font-size: 12px;
}

.tasks-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 590;
  margin: 0;
  color: #000000;
}

.sort-btn {
  background: white;
  border: 0.33px solid #3c3c432e;
  border-radius: 40px;
  color: #00a19a;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  padding: 4px 8px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 0.33px solid #3c3c432e;
}

.task-card:active {
  transform: scale(0.98);
}

.task-card.completed {
  opacity: 0.7;
}

.task-status {
  flex-shrink: 0;
}

.status-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 6px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
}

.status-circle.completed {
  background: #00a19a;
  border-color: #00a19a;
}

.status-circle.in-progress {
  border: none;
  background: conic-gradient(
    #00a19a 0% calc(var(--progress, 50) * 1%),
    #e0e0e0 calc(var(--progress, 50) * 1%) 100%
  );
}

.status-circle.in-progress::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: white;
}

.status-circle.pending {
  border-color: #e0e0e0;
}

.check-icon {
  color: white;
  font-size: 16px;
  font-weight: 700;
}

.progress-percentage {
  color: #00a19a;
  font-size: 9px;
  font-weight: 400;
  position: relative;
  z-index: 1;
}

.task-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0fffe 0%, #e6f9f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 15px;
  font-weight: 400;
  margin: 0 0 4px;
  color: #000000;
  line-height: 20px;
  letter-spacing: -0.23px;
}

.task-description {
  font-size: 13px;
  line-height: 18px;
  letter-spacing: -0.08px;
  color: #3c3c4399;
  margin: 0 0 6px;
}

.task-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}
.task-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.task-meta svg {
  width: 11px;
  height: 11px;
}

.task-completed-info {
  margin-top: 8px;
  font-size: 12px;
  color: #00a19a;
  font-weight: 600;
}

.task-points {
  background: #00a19a1a;
  font-size: 11px;
  line-height: 13px;
  color: #00a19a;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  width: fit-content;
  border-radius: 4px;
}

.points-icon {
  font-size: 14px;
}

.task-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f9f9fd;
  border: 0.5px solid #d2d1e4;
  font-size: 24px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ── Web layout overrides ─────────────────────────────────────────── */
.stw-aside .hero {
  margin: 0;
}
.stw-aside .action-buttons {
  margin-bottom: 0;
}
.stw-content .tasks-section {
  margin-top: 0;
}

/* ── Responsive ───────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .stw-layout {
    grid-template-columns: 1fr;
    gap: 24px;
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
  .stw-main {
    padding-top: 26px;
    padding-bottom: 96px;
  }
  .st-mobile-nav {
    display: block;
  }
}

@media (max-width: 640px) {
  .hsw-shell {
    width: calc(100% - 24px);
  }
  .hsw-back {
    display: none;
  }
}
</style>
