<template>
  <div v-if="!showThankYou" class="tk-root">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
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
          <button class="hsw-back" type="button" @click="navigateTo(backToStepsUrl)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to section
          </button>
        </div>
      </div>
    </header>

    <div class="tk-split">

      <!-- ── Left dark sidebar ─────────────────────────────────────── -->
      <aside class="tk-side">
        <span class="side-badge">
          <span class="dot"></span>
          {{ currentStep?.title || '' }}
        </span>

        <div class="side-icon">
          <OPIcon
            v-if="currentStep?.icon"
            :name="currentStep.icon"
            class="w-[48px] h-[48px]"
          />
        </div>

        <h1 class="side-title">{{ currentStep?.title || '' }}</h1>
        <p class="side-sub">{{ currentTask?.title || '' }}</p>

        <div class="side-divider"></div>

        <div class="side-progress">
          <div class="side-ring" :style="{ '--p': taskProgress }">
            <span>{{ totalQuestions - remainingQuestions }}/{{ totalQuestions }}</span>
          </div>
          <div class="side-progress-text">
            <small>Task Progress</small>
            <strong>
              {{ remainingQuestions }}
              {{ remainingQuestions === 1 ? 'question' : 'questions' }} remaining
            </strong>
            <span>~{{ estimatedMinutesLeft }} min left</span>
          </div>
        </div>

        <div class="side-actions">
          <button class="side-btn ghost" @click="openHelp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Help
          </button>
          <button class="side-btn teal" @click="openVideo">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
            Play Video
          </button>
        </div>

        <div class="side-points">
          <div class="pts-head">
            <span class="pts-lock">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <strong class="pts-value">{{ currentQuestion?.points || 0 }} pts</strong>
            <span class="pts-locked">Locked</span>
          </div>
          <strong class="pts-title">Next: Available for completing this question.</strong>
          <p class="pts-desc">
            A total of {{ currentQuestion?.points || 0 }} points are available in this
            section. Complete tasks to unlock rewards and move to the next section.
          </p>
        </div>

        <!-- Property photos upload — only for "What we love about our home?" task -->
        <div
          v-if="currentTask?.key === 'give_your_home_a_story'"
          class="property-photos-section"
        >
          <h3 class="property-photos-title">Property Photos</h3>
          <p class="property-photos-sub">
            Upload photos of your property. These will appear in your listing and
            buyer passport.
          </p>

          <div v-if="propertyImages.length > 0" class="property-photos-grid">
            <div
              v-for="(img, index) in propertyImages"
              :key="index"
              class="property-photo-item"
            >
              <img
                :src="img"
                :alt="`Photo ${index + 1}`"
                class="property-photo-thumb"
              />
              <button
                class="property-photo-delete"
                @click="removePropertyImage(index)"
                title="Remove photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2.5" stroke-linecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div class="property-photos-actions">
            <label class="add-photos-btn" :class="{ disabled: uploadingImages }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
              {{ uploadingImages ? 'Uploading...' : 'Add Photos' }}
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden-file-input"
                :disabled="uploadingImages"
                @change="handlePropertyImageUpload"
              />
            </label>
          </div>
        </div>
      </aside>

      <!-- ── Right content ─────────────────────────────────────────── -->
      <main class="tk-main">
        <div class="tk-content">
          <span class="eyebrow">This section</span>

          <div class="q-head">
            <div class="q-head-left">
              <h2 class="q-head-title">Question {{ currentQuestionIndex + 1 }}</h2>
              <div class="q-head-sub">
                {{ currentQuestionIndex + 1 }} of {{ totalQuestions }} in this section
              </div>
            </div>
            <div class="q-nav">
              <button
                v-if="currentQuestionIndex !== 0"
                class="q-nav-btn ghost-muted"
                @click="goToPreviousQuestion"
              >
                ← Previous
              </button>
              <button
                v-if="currentQuestionIndex < totalQuestions - 1"
                class="q-nav-btn"
                @click="skipQuestion"
              >
                Skip →
              </button>
            </div>
          </div>

          <div v-if="totalQuestions > 0" class="q-segments" aria-hidden="true">
            <span
              v-for="i in totalQuestions"
              :key="i"
              class="q-seg"
              :class="{
                done: i - 1 < currentQuestionIndex,
                current: i - 1 === currentQuestionIndex,
              }"
            />
          </div>
          <div v-if="totalQuestions > 0" class="q-seg-labels">
            <span>Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}</span>
            <span>{{ remainingQuestions }} remaining</span>
          </div>

          <div class="question-section">
            <div v-if="currentQuestion" class="question-content">
              <div
                v-if="showOptions"
                class="answer-section answer-section--visible"
              >
                <div
                  v-if="
                    currentQuestionType !== 'multipart' ||
                    currentQuestion?.repeatable
                  "
                  class="question-card"
                >
                  <component
                    :key="currentQuestion?.id"
                    :is="getQuestionComponent"
                    :question="currentQuestion"
                    :answer="currentQuestion.answer"
                    :display="
                      currentQuestion.display || currentQuestion.type?.toLowerCase()
                    "
                    :passport-id="route.query.propertyId || ''"
                    :displayed-question="displayedQuestion"
                    :show-question-cursor="showQuestionCursor"
                    :displayed-description="displayedDescription"
                    :show-description-cursor="showDescriptionCursor"
                    :displayed-help="displayedHelp"
                    :show-help-cursor="showHelpCursor"
                    @update="updateAnswer"
                  />
                </div>
                <component
                  v-else
                  :key="currentQuestion?.id"
                  :is="getQuestionComponent"
                  :question="currentQuestion"
                  :answer="currentQuestion.answer"
                  :display="
                    currentQuestion.display || currentQuestion.type?.toLowerCase()
                  "
                  :passport-id="route.query.propertyId || ''"
                  :displayed-question="displayedQuestion"
                  :show-question-cursor="showQuestionCursor"
                  :displayed-description="displayedDescription"
                  :show-description-cursor="showDescriptionCursor"
                  :displayed-help="displayedHelp"
                  :show-help-cursor="showHelpCursor"
                  @update="updateAnswer"
                />

                <div v-if="hasAdditionalInfo" class="question-card">
                  <TextUploadQuestion
                    :question="{
                      description:
                        'Please provide additional supporting information',
                      uploadInstruction: currentQuestion.uploadInstruction,
                      instructionText: currentQuestion.instructionText,
                      placeholder: currentQuestion.placeholder,
                    }"
                    :answer="additionalInfoAnswer"
                    :display="additionalInfoDisplay"
                    @update="updateAdditionalInfo"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            class="submit-btn"
            @click="saveAnswer"
            :disabled="!isAnswerValid"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
            Save and go to next question
          </button>
          <p v-if="!isAnswerValid" class="submit-hint">
            Select an answer to continue
          </p>
        </div>
      </main>

    </div>

    <SiteFooter />

  </div>

  <div v-if="showThankYou">
    <ThankYouModal
      v-model="showThankYou"
      :points="earnedPoints"
      :step-name="currentStep?.title || 'this'"
      @continue="handleContinue"
    />
  </div>

  <HelpDrawer
    :show="showHelp"
    :content="activeHelpContent"
    mode="seller"
    @close="showHelp = false"
  />

  <VideoModal
    :show="showVideo"
    :video-url="activeVideoUrl"
    @close="showVideo = false"
  />
</template>

<script setup>
import { usePassportRuntime } from '~/composables/usePassportRuntime'
import ThankYouModal from '~/components/passport-view/ThankYouModal.vue'
import RadioQuestion from '~/components/passport-view/questions/RadioQuestion.vue'
import TextUploadQuestion from '~/components/passport-view/questions/TextUploadQuestion.vue'
import CheckboxQuestion from '~/components/passport-view/questions/CheckboxQuestion.vue'
import ChipsQuestion from '~/components/passport-view/questions/ChipsQuestion.vue'
import NoteQuestion from '~/components/passport-view/questions/NoteQuestion.vue'
import DateQuestion from '~/components/passport-view/questions/DateQuestion.vue'
import ScaleQuestion from '~/components/passport-view/questions/ScaleQuestion.vue'
import MultipartQuestion from '~/components/passport-view/questions/MultipartQuestion.vue'
import RepeatableItemQuestion from '~/components/passport-view/questions/RepeatableItemQuestion.vue'
import MultiTextInputQuestion from '@/components/passport-view/questions/MultiTextInputQuestion.vue'
import MultiFieldFormQuestion from '@/components/passport-view/questions/MultiFieldFormQuestion.vue'
import BoundaryResponsibilityQuestion from '~/components/passport-view/questions/BoundaryResponsibilityQuestion.vue'
import OPIcon from '~/components/ui/OPIcon.vue'
import HelpDrawer from '~/components/passport-view/HelpDrawer.vue'
import VideoModal from '~/components/passport-view/VideoModal.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

const route = useRoute()
const router = useRouter()

const {
  currentStep,
  currentTask,
  currentQuestions,
  currentQuestionIndex,
  currentQuestion,
  setCurrentStep,
  setCurrentTask,
  loadPassport,
  loadQuestions,
  loadSectionQuestions,
  saveAnswer: apiSaveAnswer,
  completeTask,
  moveToNextQuestion,
  moveToPreviousQuestion,
} = usePassportRuntime()

const showThankYou = ref(false)
const earnedPoints = ref(0)
const isSaving = ref(false)
const additionalInfoAnswer = ref(null)

const showHelp = ref(false)
const showVideo = ref(false)

// Use question-level content if available, fall back to step (section) level
const activeHelpContent = computed(
  () =>
    currentQuestion.value?.helpContent ??
    currentStep.value?.helpContent ??
    null,
)
const activeVideoUrl = computed(
  () =>
    currentQuestion.value?.helpVideoUrl ??
    currentStep.value?.helpVideoUrl ??
    null,
)
const hasHelp = computed(() => !!activeHelpContent.value)
const hasVideo = computed(() => !!activeVideoUrl.value)

function openHelp() {
  showHelp.value = true
}
function openVideo() {
  showVideo.value = true
}

const stepId = route.query.stepId
const taskId = route.params.id

const backToStepsUrl = computed(() => {
  return `/passportview/steps/${stepId}?propertyId=${route.query.propertyId}`
})

const displayedQuestion = ref('')
const displayedDescription = ref('')
const displayedHelp = ref('')

const showQuestionCursor = ref(false)
const showDescriptionCursor = ref(false)
const showHelpCursor = ref(false)

const showOptions = ref(false)

// ── Property image upload (give_your_home_a_story task) ────────────────────
const { getPropertyImages, updatePropertyImages, uploadPropertyImage } =
  usePassportApi()
const propertyImages = ref([])
const uploadingImages = ref(false)

async function loadPropertyImages() {
  const passportId = route.query.propertyId
  if (!passportId) return
  try {
    const res = await getPropertyImages(passportId)
    propertyImages.value = res.images ?? []
  } catch {
    // ignore — not critical
  }
}

async function handlePropertyImageUpload(event) {
  const files = Array.from(event.target.files ?? [])
  if (!files.length) return
  const passportId = route.query.propertyId
  if (!passportId) return

  uploadingImages.value = true
  try {
    const uploaded = await Promise.all(
      files.map((file) => uploadPropertyImage(passportId, file)),
    )
    const newImages = [...propertyImages.value, ...uploaded.map((r) => r.url)]
    propertyImages.value = newImages
    await updatePropertyImages(passportId, newImages)
  } catch (err) {
    console.error('Failed to upload property images:', err)
  } finally {
    uploadingImages.value = false
    event.target.value = ''
  }
}

async function removePropertyImage(index) {
  const passportId = route.query.propertyId
  if (!passportId) return
  const updated = propertyImages.value.filter((_, i) => i !== index)
  propertyImages.value = updated
  try {
    await updatePropertyImages(passportId, updated)
  } catch (err) {
    console.error('Failed to update property images:', err)
  }
}
// ──────────────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!currentStep.value) {
    await loadPassport(route.query.propertyId)
  }

  setCurrentStep(stepId)
  setCurrentTask(taskId)
  // Load all questions from the entire section, starting at the clicked task
  await loadSectionQuestions(stepId, taskId)

  // Load property images for the home story task
  await loadPropertyImages()

  // Track this task as the user's last visited so the "Pick up where you
  // left off" CTA on the passport view routes them straight back here.
  recordLastVisited()
})

async function recordLastVisited() {
  const passportId = route.query.propertyId
  if (!passportId || !taskId) return
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (!token) return
  const cfg = useRuntimeConfig()
  try {
    await $fetch(`${cfg.public.apiBase}/passport/${passportId}/last-visited`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { taskId },
    })
  } catch {
    /* non-critical — silent */
  }
}

const runQuestionAnimation = (q) => {
  if (!q) return

  // Display all text immediately without animation
  displayedQuestion.value = q.question
  displayedDescription.value = q.description || ''
  displayedHelp.value = q.help || ''

  // Show options immediately
  showOptions.value = true
}

watch(
  () => currentQuestion.value,
  (q) => {
    if (!q) {
      additionalInfoAnswer.value = null
      return
    }

    // Multipart questions store their answer as an object keyed by partKey — skip additionalInfo extraction
    if (q.type === 'multipart') {
      additionalInfoAnswer.value = null
      runQuestionAnimation(q)
      return
    }

    // Hydrate additional info from saved combined answers before animation
    if (q.answer && typeof q.answer === 'object' && !Array.isArray(q.answer)) {
      if (q.answer.additionalInfo !== undefined) {
        additionalInfoAnswer.value = q.answer.additionalInfo
        q.answer = q.answer.mainAnswer
      } else if (q.answer.radioAnswer !== undefined) {
        additionalInfoAnswer.value = q.answer.uploadedFiles || null
        q.answer = q.answer.radioAnswer
      } else {
        additionalInfoAnswer.value = null
      }
    } else {
      additionalInfoAnswer.value = null
    }

    runQuestionAnimation(q)
  },
  { immediate: true },
)

const calculateEarnedPoints = () => {
  if (!currentStep.value) return 0
  return currentStep.value.tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + (t.pointsReward || 0), 0)
}

const totalQuestions = computed(() => currentQuestions.value.length || 0)

const taskProgress = computed(() => {
  if (!currentTask.value || totalQuestions.value === 0) return 0
  const completed = currentQuestions.value.filter((q) => q.completed).length
  return Math.round((completed / totalQuestions.value) * 100)
})

const taskAnsweredCount = computed(
  () =>
    currentQuestions.value.filter((q) => q.answer != null && q.answer !== '')
      .length,
)
const estimatedMinutesLeft = computed(() => {
  const r = remainingQuestions.value || 0
  return Math.max(1, Math.round(r * 1.2))
})

// Pick a short body string out of whatever shape `helpContent` arrives in.
function extractTipBody(content) {
  if (!content) return ''
  if (typeof content === 'string') return content
  return (
    content.body ||
    content.description ||
    content.text ||
    content.summary ||
    (Array.isArray(content.sections) ? content.sections[0]?.body : '') ||
    ''
  )
}

// Resolve the tip body with fallbacks so "What is this?" always shows when
// any contextual help is available — question helpContent → step helpContent
// → question hint / description / placeholder.
const tipBody = computed(() => {
  const q = currentQuestion.value
  const s = currentStep.value
  return (
    extractTipBody(q?.helpContent) ||
    extractTipBody(s?.helpContent) ||
    q?.hint ||
    q?.description ||
    q?.subtitle ||
    q?.placeholder ||
    ''
  )
})

const remainingQuestions = computed(() => {
  return currentQuestions.value.filter((q) => !q.completed).length
})

const normalizeQuestionType = (question) => {
  return (question?.type || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/-/g, '_')
}

const currentQuestionType = computed(() =>
  normalizeQuestionType(currentQuestion.value),
)

const isAnswerValid = computed(() => {
  if (!currentQuestion.value) return false

  const answer = currentQuestion.value.answer
  const type = currentQuestionType.value
  const isRadioType = type === 'radio' || type === 'single_choice'
  const isCheckboxType = type === 'checkbox' || type === 'multiple_choice'

  if (type === 'text') {
    return answer && answer.trim().length > 0
  }

  if (isRadioType) {
    return answer !== '' && answer !== undefined && answer !== null
  }

  // Check if this is a boundary responsibility question
  if (type === 'boundary') {
    return answer && answer.left && answer.right && answer.rear && answer.front
  }

  if (isCheckboxType) {
    // When otherPlaceholder is set, CheckboxQuestion emits {values, otherText}
    if (
      answer &&
      typeof answer === 'object' &&
      !Array.isArray(answer) &&
      Array.isArray(answer.values)
    ) {
      return answer.values.length > 0
    }
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'chips') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'upload') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'note') {
    const note = answer || {}
    const buyers = note.buyers || ''
    const sellers = note.sellers || ''
    return (
      (buyers && buyers.trim().length > 0) ||
      (sellers && sellers.trim().length > 0)
    )
  }

  if (type === 'date') {
    if (!answer) return false
    if (typeof answer === 'string') {
      return answer.trim().length > 0
    }
    if (typeof answer === 'object') {
      if (answer.date) return ('' + answer.date).trim().length > 0
      if (answer.value) return ('' + (answer.value || '')).trim().length > 0
      return Object.values(answer).some(
        (val) =>
          val !== undefined && val !== null && ('' + val).trim().length > 0,
      )
    }
    return false
  }

  if (type === 'scale') {
    return answer !== undefined && answer !== null && answer !== ''
  }

  if (type === 'multitextinput') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'multifieldform') {
    // For repeatable: answer is array of objects
    if (currentQuestion.value.repeatable && Array.isArray(answer)) {
      return (
        answer.length > 0 &&
        answer.every((form) => {
          return Object.values(form).some((val) => val && val.trim().length > 0)
        })
      )
    }
    // For non-repeatable: answer is single object
    if (
      !currentQuestion.value.repeatable &&
      typeof answer === 'object' &&
      !Array.isArray(answer)
    ) {
      return Object.values(answer).some((val) => val && val.trim().length > 0)
    }
    return false
  }

  if (type === 'multipart') {
    // Repeatable multipart (custom item list): answer is an array — always valid (0 items is OK)
    if (currentQuestion.value?.repeatable) {
      return Array.isArray(answer) || answer === null || answer === undefined
    }
    if (!answer || typeof answer !== 'object' || Array.isArray(answer))
      return false
    const parts = currentQuestion.value.parts
    if (!parts || !Array.isArray(parts)) return false

    // Helper function to check if a part is visible (not hidden by conditional logic)
    const isPartVisible = (part) => {
      if (!part.conditionalOn) return true
      const dependentPartAnswer = answer[part.conditionalOn]
      if (dependentPartAnswer === undefined || dependentPartAnswer === null)
        return false
      if (!part.showOnValues || !Array.isArray(part.showOnValues)) return false
      return part.showOnValues.includes(dependentPartAnswer)
    }

    return parts.every((part) => {
      // Skip validation for hidden parts
      if (!isPartVisible(part)) return true

      // For visible parts, validate based on whether they are required
      const partAnswer = answer[part.partKey]

      // If part is not required and has no answer, that's OK
      if (
        !part.required &&
        (partAnswer === undefined || partAnswer === null || partAnswer === '')
      ) {
        return true
      }

      // If part is required or has an answer, validate it
      if (partAnswer === undefined || partAnswer === null || partAnswer === '')
        return false

      const partType = part.type?.toLowerCase?.()

      // Counter is always valid (0 is a valid numeric answer)
      if (partType === 'counter') return true

      if (partType === 'checkbox')
        return Array.isArray(partAnswer) && partAnswer.length > 0
      if (partType === 'upload')
        return Array.isArray(partAnswer) && partAnswer.length > 0
      if (partType === 'multitextinput')
        return Array.isArray(partAnswer) && partAnswer.length > 0
      if (partType === 'multifieldform') {
        // For repeatable: partAnswer is array of objects
        if (part.repeatable && Array.isArray(partAnswer)) {
          return (
            partAnswer.length > 0 &&
            partAnswer.every((form) => {
              return Object.values(form).some(
                (val) => val && ('' + val).trim().length > 0,
              )
            })
          )
        }
        // For non-repeatable: partAnswer is single object
        if (
          !part.repeatable &&
          typeof partAnswer === 'object' &&
          !Array.isArray(partAnswer)
        ) {
          return Object.values(partAnswer).some(
            (val) => val && ('' + val).trim().length > 0,
          )
        }
        return false
      }
      if (partType === 'date') {
        if (typeof partAnswer === 'object' && partAnswer !== null) {
          return (
            (partAnswer.date && ('' + partAnswer.date).trim().length > 0) ||
            ('' + (partAnswer.value || '')).trim().length > 0 ||
            Object.values(partAnswer).some(
              (val) =>
                val !== undefined &&
                val !== null &&
                ('' + val).trim().length > 0,
            )
          )
        }
        return ('' + partAnswer).trim().length > 0
      }
      if (partType === 'text') {
        return typeof partAnswer === 'string'
          ? partAnswer.trim().length > 0
          : !!partAnswer
      }
      if (partType === 'radio') {
        return (
          partAnswer !== '' && partAnswer !== undefined && partAnswer !== null
        )
      }

      return !!partAnswer
    })
  }

  return true
})

const getQuestionComponent = computed(() => {
  const type = currentQuestionType.value

  // Repeatable multipart → custom item list UI
  if (type === 'multipart' && currentQuestion.value?.repeatable) {
    return RepeatableItemQuestion
  }

  const components = {
    radio: RadioQuestion,
    single_choice: RadioQuestion,
    text: TextUploadQuestion,
    checkbox: CheckboxQuestion,
    multiple_choice: CheckboxQuestion,
    chips: ChipsQuestion,
    upload: TextUploadQuestion,
    note: NoteQuestion,
    date: DateQuestion,
    scale: ScaleQuestion,
    multipart: MultipartQuestion,
    boundary: BoundaryResponsibilityQuestion,
    multitextinput: MultiTextInputQuestion,
    multifieldform: MultiFieldFormQuestion,
  }
  return components[type] || TextUploadQuestion
})

const hasAdditionalInfo = computed(() => {
  if (!currentQuestion.value?.additionalInfoType) return false

  // Only show additional info section after the user has answered the main question
  const answer = currentQuestion.value.answer
  return answer !== null && answer !== undefined && answer !== ''
})

const additionalInfoDisplay = computed(() => {
  const type = currentQuestion.value?.additionalInfoType
  if (type) {
    const lowerType = type.toLowerCase()
    if (lowerType.includes('upload') && lowerType.includes('write'))
      return 'both'
    if (lowerType.includes('upload')) return 'upload'
    if (lowerType.includes('write')) return 'text'
  }
  return null
})

const updateAnswer = async (answer) => {
  if (!currentQuestion.value) return
  currentQuestion.value.answer = answer

  // Check if this is a NOTE question being completed
  if (currentQuestion.value.type?.toLowerCase() === 'note' && answer === true) {
    isSaving.value = true
    try {
      // Save the note as completed
      await apiSaveAnswer(currentQuestion.value.id, answer)

      // Check if this was the last incomplete question (before advancing)
      const currentId = currentQuestion.value.id
      const allCompleted = currentQuestions.value.every(
        (q) => q.completed || q.id === currentId,
      )

      if (allCompleted) {
        // All questions in section done — show thank-you
        earnedPoints.value = calculateEarnedPoints()
        showThankYou.value = true
      } else {
        // More questions remain — move to next
        const hasMoreQuestions = moveToNextQuestion()
        if (!hasMoreQuestions) {
          router.push(
            `/passportview/steps/${stepId}?propertyId=${route.query.propertyId}`,
          )
        }
      }
    } catch (error) {
      console.error('Error completing NOTE question:', error)
    } finally {
      isSaving.value = false
    }
    return
  }

  // Auto-save plain RADIO questions immediately on selection
  if (currentQuestion.value.type?.toLowerCase() === 'radio') {
    isSaving.value = true
    try {
      await apiSaveAnswer(currentQuestion.value.id, answer)

      const currentId = currentQuestion.value.id
      const allCompleted = currentQuestions.value.every(
        (q) => q.completed || q.id === currentId,
      )

      if (allCompleted) {
        earnedPoints.value = calculateEarnedPoints()
        showThankYou.value = true
      } else {
        const hasMoreQuestions = moveToNextQuestion()
        if (!hasMoreQuestions) {
          router.push(
            `/passportview/steps/${stepId}?propertyId=${route.query.propertyId}`,
          )
        }
      }
    } catch (error) {
      console.error('Error auto-saving RADIO answer:', error)
    } finally {
      isSaving.value = false
    }
    return
  }

  // Check if this is a multipart question with auto-save
  if (
    currentQuestion.value.type?.toLowerCase() === 'multipart' &&
    currentQuestion.value.autoSaveOn
  ) {
    const { partKey, value } = currentQuestion.value.autoSaveOn
    const rawTrigger = answer[partKey]
    // DATE parts emit { value, date } — extract scalar for comparison
    let triggerPartAnswer =
      rawTrigger !== null &&
      typeof rawTrigger === 'object' &&
      'value' in rawTrigger
        ? rawTrigger.value
        : rawTrigger

    // If the partKey doesn't exist, try to find the first radio part as fallback
    if (triggerPartAnswer === undefined) {
      const firstRadioPart = currentQuestion.value.parts?.find(
        (p) => p.type?.toLowerCase() === 'radio',
      )
      if (firstRadioPart) {
        triggerPartAnswer = answer[firstRadioPart.partKey]
      }
    }

    // If trigger part is answered with the auto-save value, save immediately
    if (triggerPartAnswer === value) {
      isSaving.value = true
      try {
        await apiSaveAnswer(currentQuestion.value.id, answer)

        const currentId = currentQuestion.value.id
        const allCompleted = currentQuestions.value.every(
          (q) => q.completed || q.id === currentId,
        )

        if (allCompleted) {
          // All questions in section done — show thank-you
          earnedPoints.value = calculateEarnedPoints()
          showThankYou.value = true
        } else {
          // More questions remain — move to next
          const hasMoreQuestions = moveToNextQuestion()
          if (!hasMoreQuestions) {
            router.push(
              `/passportview/steps/${stepId}?propertyId=${route.query.propertyId}`,
            )
          }
        }
      } catch (error) {
        console.error('Error auto-saving answer:', error)
      } finally {
        isSaving.value = false
      }
    }
  }
}

const updateAdditionalInfo = (data) => {
  additionalInfoAnswer.value = data
}

const saveAnswer = async () => {
  if (!isAnswerValid.value || !currentQuestion.value) return

  isSaving.value = true
  try {
    let answerValue = currentQuestion.value.answer

    // If this question has additional info, combine both into a single object
    if (
      currentQuestion.value.additionalInfoType &&
      additionalInfoAnswer.value
    ) {
      answerValue = {
        mainAnswer: currentQuestion.value.answer,
        additionalInfo: additionalInfoAnswer.value,
      }
    }

    // Save answer to backend
    await apiSaveAnswer(currentQuestion.value.id, answerValue)

    // Check if this was the last incomplete question (before advancing)
    const currentId = currentQuestion.value.id
    const allCompleted = currentQuestions.value.every(
      (q) => q.completed || q.id === currentId,
    )

    if (allCompleted) {
      // All questions in section done — show thank-you
      earnedPoints.value = calculateEarnedPoints()
      showThankYou.value = true
    } else {
      // More questions remain — move to next
      const hasMoreQuestions = moveToNextQuestion()
      if (!hasMoreQuestions) {
        router.push(
          `/passportview/steps/${stepId}?propertyId=${route.query.propertyId}`,
        )
      }
    }
  } catch (error) {
    console.error('Error saving answer:', error)
  } finally {
    isSaving.value = false
  }
}

const skipQuestion = () => {
  moveToNextQuestion()
}

const goToPreviousQuestion = () => {
  moveToPreviousQuestion()
}

const handleNextQuestion = () => {
  if (isAnswerValid.value) {
    saveAnswer()
  }
}

const handleContinue = () => {
  router.push(`/passportview/${route.query.propertyId}`)
}
</script>

<style scoped>
/* ── Canvas ────────────────────────────────────────────────────────── */
.tk-root {
  min-height: 100dvh;
  color: #231d45;
  background: #f7f6f3;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.tk-split {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  align-items: stretch;
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
  background: rgba(247, 246, 243, 0.9);
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

/* ── Left dark sidebar ─────────────────────────────────────────────── */
.tk-side {
  align-self: stretch;
  min-height: calc(100dvh - 66px);
  padding: 40px 34px;
  color: #fff;
  background:
    radial-gradient(120% 80% at 8% 4%, rgba(0, 161, 154, 0.26), transparent 46%),
    linear-gradient(165deg, #2b2456 0%, #221d45 46%, #1a1636 100%);
}

.side-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 161, 154, 0.14);
  border: 1px solid rgba(47, 208, 198, 0.3);
  color: #7fe6dd;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 13px;
  border-radius: 999px;
}
.side-badge .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2fd0c6;
}

.side-icon {
  width: 84px;
  height: 84px;
  border-radius: 22px;
  margin: 28px 0 24px;
  display: grid;
  place-items: center;
  background: linear-gradient(150deg, #12b3a6, #05867f);
  box-shadow: 0 18px 34px -12px rgba(0, 161, 154, 0.6);
}
.side-icon :deep(img) {
  filter: brightness(0) invert(1);
}

.side-title {
  font-size: 34px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}
.side-sub {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.side-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 26px 0;
}

.side-progress {
  display: flex;
  align-items: center;
  gap: 18px;
}
.side-ring {
  --p: 0;
  width: 68px;
  height: 68px;
  flex-shrink: 0;
  border-radius: 50%;
  background: conic-gradient(
    from -90deg,
    #2fd0c6 calc(var(--p) * 1%),
    rgba(255, 255, 255, 0.12) 0
  );
  display: grid;
  place-items: center;
}
.side-ring span {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #221d44;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.side-progress-text small {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
}
.side-progress-text strong {
  display: block;
  font-size: 15.5px;
  font-weight: 800;
  line-height: 1.2;
}
.side-progress-text span {
  display: block;
  margin-top: 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.side-actions {
  display: flex;
  gap: 12px;
  margin: 26px 0;
}
.side-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.16s, transform 0.12s;
}
.side-btn:active {
  transform: scale(0.98);
}
.side-btn svg {
  width: 16px;
  height: 16px;
}
.side-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.16);
  color: #fff;
}
.side-btn.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
}
.side-btn.teal {
  background: #00a19a;
  color: #fff;
  box-shadow: 0 12px 24px -10px rgba(0, 161, 154, 0.7);
}
.side-btn.teal:hover {
  background: #00b3ab;
}

.side-points {
  border-radius: 18px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.pts-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.pts-lock {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 11px;
  background: rgba(0, 161, 154, 0.16);
  border: 1px solid rgba(47, 208, 198, 0.28);
  color: #7fe6dd;
  display: grid;
  place-items: center;
}
.pts-lock svg {
  width: 17px;
  height: 17px;
}
.pts-value {
  flex: 1;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.pts-locked {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7fe6dd;
  border: 1px solid rgba(47, 208, 198, 0.3);
  border-radius: 999px;
  padding: 4px 9px;
}
.pts-title {
  display: block;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.35;
  margin-bottom: 7px;
}
.pts-desc {
  margin: 0;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Right content ─────────────────────────────────────────────────── */
.tk-main {
  min-width: 0;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.tk-content {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
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

.q-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin: 14px 0 22px;
}
.q-head-title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #231d45;
  margin: 0 0 5px;
}
.q-head-sub {
  font-size: 14px;
  font-weight: 600;
  color: #8b8799;
}
.q-nav {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  margin-top: 6px;
}
.q-nav-btn {
  background: #fff;
  border: 1px solid #ececf2;
  color: #00857f;
  padding: 11px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 700;
  font-family: inherit;
  transition: border-color 0.16s, transform 0.12s;
}
.q-nav-btn:hover {
  border-color: #00a19a;
}
.q-nav-btn:active {
  transform: scale(0.97);
}
.q-nav-btn.ghost-muted {
  color: #8b8799;
}

.q-segments {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}
.q-seg {
  flex: 1;
  height: 7px;
  border-radius: 999px;
  background: #e4e2db;
  overflow: hidden;
  position: relative;
}
.q-seg.done {
  background: linear-gradient(90deg, #00a19a, #2fd0c6);
}
.q-seg.current {
  background: #b6ede8;
}
.q-seg.current::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 55%;
  background: linear-gradient(90deg, #00a19a, #2fd0c6);
  border-radius: 999px;
}
.q-seg-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
  font-size: 12.5px;
  font-weight: 700;
  color: #8b8799;
}

/* ── Question card ─────────────────────────────────────────────────── */
.question-section {
  margin-top: 0;
}
.answer-section {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.35s ease;
}
.answer-section--visible {
  opacity: 1;
  transform: translateY(0);
}

.question-card {
  background: #fff;
  border-radius: 22px;
  padding: 34px 36px;
  border: 1px solid #ecebf1;
  box-shadow: 0 14px 40px rgba(35, 29, 69, 0.06);
}
.question-card + .question-card {
  margin-top: 18px;
}

.submit-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 20px;
  background: linear-gradient(135deg, #00a19a, #00857f);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 15.5px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.16s ease, opacity 0.16s;
  margin-top: 28px;
  box-shadow: 0 16px 30px -10px rgba(0, 161, 154, 0.55);
}
.submit-btn svg {
  width: 18px;
  height: 18px;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 20px 34px -10px rgba(0, 161, 154, 0.6);
}
.submit-btn:active:not(:disabled) {
  transform: scale(0.99);
}
.submit-btn:disabled {
  color: #9a97a8;
  background: #eceef3;
  box-shadow: none;
  cursor: not-allowed;
}
.submit-hint {
  text-align: center;
  margin: 14px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #a5a1b4;
}

/* ── Property Photos Upload ────────────────────────────────────────── */
.property-photos-section {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 18px;
}
.property-photos-title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
  margin: 0 0 5px;
}
.property-photos-sub {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 16px;
  line-height: 1.5;
}
.property-photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.property-photo-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
}
.property-photo-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.property-photo-delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.property-photos-actions {
  display: flex;
  justify-content: flex-start;
}
.add-photos-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #00a19a;
  color: #fff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
}
.add-photos-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.hidden-file-input {
  display: none;
}

/* ── Responsive ────────────────────────────────────────────────────── */
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
}

@media (max-width: 900px) {
  .tk-split {
    grid-template-columns: 1fr;
  }
  .tk-side {
    min-height: 0;
    padding: 26px 22px 30px;
  }
  .side-title {
    font-size: 28px;
  }
  .tk-main {
    padding: 28px 20px 90px;
    justify-content: flex-start;
  }
  .q-head-title {
    font-size: 27px;
  }
  .question-card {
    padding: 24px 20px;
  }
}

@media (max-width: 520px) {
  .q-head {
    flex-direction: column;
  }
  .q-nav {
    margin-top: 0;
  }
}
</style>
