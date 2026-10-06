import { ref, computed } from 'vue'
import { usePassportApi } from './usePassportApi'
import { hiddenQuestionIds } from '~/utils/questionBranching'

// ---------- GLOBAL SINGLETON STATE ----------
const steps = ref([])
const loading = ref(false)

// Whether the currently-loaded passport (per loadAccess below) is owned by
// the signed-in user, vs. a collaborator with view access to it. Owner-only
// actions (add/remove collaborator, publish) are gated on this so a
// collaborator never sees a control that's guaranteed to reject them.
const isOwner = ref(true)
const isCollaborator = ref(false)

const currentStep = ref(null)
const currentTask = ref(null)

const currentQuestions = ref([])
const currentQuestionIndex = ref(0)

// For section-wide question flow (all tasks' questions in one sequence)
const allSectionQuestions = ref([]) // Flattened array with task context
const questionTaskMap = ref({}) // Maps question ID to task info for auto-advance

// ---------- LAZY API ACCESSOR ----------
let _api: ReturnType<typeof usePassportApi> | null = null

const getApi = () => {
  if (!_api) {
    _api = usePassportApi()
  }
  return _api
}

// ---------- METHODS ----------

const loadPassport = async (passportId) => {
  loading.value = true
  try {
    const raw = await getApi().getSections(passportId)
    steps.value = raw.map((section) => {
      const tasks = section.tasks.map((task) => ({
        ...task,
        completed:
          task.totalQuestions > 0 &&
          task.answeredQuestions === task.totalQuestions,
      }))
      const completedTasks = tasks.filter((t) => t.completed).length
      const progress =
        tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
      return {
        ...section,
        // Section keys are the illustrated OPIcon names (see the backend seed).
        // imageKey is the old generic art - Ownership Profile's is
        // "instructions", the tan book - so the key wins when present.
        icon: section.key || section.imageKey,
        progress,
        tasks,
      }
    })
  } finally {
    loading.value = false
  }
}

const loadAccess = async (passportId) => {
  try {
    const res = await getApi().getAccess(passportId)
    isOwner.value = res.isOwner
    isCollaborator.value = res.isCollaborator
  } catch {
    // Non-critical - default to isOwner:true (today's prior behaviour)
    // rather than hiding owner-only actions on a transient failure.
    isOwner.value = true
    isCollaborator.value = false
  }
}

const setCurrentStep = (stepId) => {
  currentStep.value = steps.value.find((s) => s.id === stepId) || null
}

const setCurrentTask = (taskId) => {
  if (!currentStep.value) return
  currentTask.value =
    currentStep.value.tasks.find((t) => t.id === taskId) || null
}

const loadQuestions = async (taskId) => {
  const result = await getApi().getQuestions(taskId)
  currentQuestions.value = result.map((q) => ({
    ...q,
    type: q.type?.toLowerCase(),
  }))
  const firstUnanswered = currentQuestions.value.findIndex((q) => !q.completed)
  currentQuestionIndex.value = firstUnanswered >= 0 ? firstUnanswered : 0
}

const loadSectionQuestions = async (stepId, startAtTaskId = null) => {
  // Load all questions from all tasks in a section
  if (!currentStep.value) return

  // currentQuestions/currentTask are global singletons (see top of file), so
  // without this the PREVIOUS section's question stays on screen for the
  // entire fetch below - on a section with many tasks (e.g. Fixtures and
  // Fittings) that was a multi-second stale flash, not just a loading
  // delay. Clearing first means the page's own `v-if="currentQuestion"`
  // hides the question card immediately instead of showing the wrong one.
  currentQuestions.value = []
  allSectionQuestions.value = []
  currentTask.value = null

  const taskQuestionLists = await Promise.all(
    currentStep.value.tasks.map((task) => getApi().getQuestions(task.id)),
  )

  const flattened = []
  const taskMap = {}
  let questionIndex = 0

  currentStep.value.tasks.forEach((task, taskPos) => {
    const normalizedQuestions = taskQuestionLists[taskPos].map((q) => ({
      ...q,
      type: q.type?.toLowerCase(),
      _taskId: task.id,
      _taskTitle: task.title,
    }))

    normalizedQuestions.forEach((q) => {
      taskMap[q.id] = {
        taskId: task.id,
        taskTitle: task.title,
        questionIndex,
      }
      flattened.push(q)
      questionIndex++
    })
  })

  allSectionQuestions.value = flattened
  questionTaskMap.value = taskMap
  // Questions that don't apply (see utils/questionBranching) are left out;
  // everything below works on the visible list.
  applyQuestionVisibility()
  const visible = currentQuestions.value

  // If startAtTaskId is provided, start at the first question of that task
  if (startAtTaskId) {
    const taskQuestionIndex = visible.findIndex(
      (q) => q._taskId === startAtTaskId,
    )
    if (taskQuestionIndex >= 0) {
      // Find first unanswered in this task, or start at task's first question
      const taskQuestions = visible.filter((q) => q._taskId === startAtTaskId)
      const firstUnansweredInTask = taskQuestions.findIndex((q) => !q.completed)
      if (firstUnansweredInTask >= 0) {
        currentQuestionIndex.value = visible.indexOf(
          taskQuestions[firstUnansweredInTask],
        )
      } else {
        currentQuestionIndex.value = taskQuestionIndex
      }
    } else {
      // Fallback: first unanswered in entire section
      const firstUnanswered = visible.findIndex((q) => !q.completed)
      currentQuestionIndex.value = firstUnanswered >= 0 ? firstUnanswered : 0
    }
  } else {
    // Start at first unanswered question in entire section
    const firstUnanswered = visible.findIndex((q) => !q.completed)
    currentQuestionIndex.value = firstUnanswered >= 0 ? firstUnanswered : 0
  }

  // Set currentTask to the task of the current question
  if (visible.length > 0 && currentQuestionIndex.value < visible.length) {
    const currentQ = visible[currentQuestionIndex.value]
    currentTask.value =
      currentStep.value.tasks.find((t) => t.id === currentQ._taskId) || null
  }
}

// Rebuild currentQuestions as the section minus the questions that don't
// apply to the answers given so far, keeping the user on the question they
// are on. Called after loading and after every save, since an answer (the
// ownership type) can change which questions apply.
const applyQuestionVisibility = () => {
  const all = allSectionQuestions.value
  const onId = currentQuestions.value[currentQuestionIndex.value]?.id
  const hidden = hiddenQuestionIds(all)
  const visible = all.filter((q) => !hidden.has(q.id))
  currentQuestions.value = visible
  if (onId) {
    const i = visible.findIndex((q) => q.id === onId)
    if (i >= 0) currentQuestionIndex.value = i
    else currentQuestionIndex.value = Math.min(currentQuestionIndex.value, Math.max(0, visible.length - 1))
  }
}

// Jumps straight to a known question within whatever's already loaded into
// currentQuestions (via loadSectionQuestions) — used for deep-linking from
// the publish-readiness checklist. No-ops (returns false) if the question
// isn't part of the currently loaded set, so callers can fall back to
// whatever loadSectionQuestions already picked.
const goToQuestion = (questionId) => {
  const info = questionTaskMap.value[questionId]
  if (!info) return false
  // Positions are in the visible list. A question that doesn't apply lands
  // on the next one that does.
  const all = allSectionQuestions.value
  const from = all.findIndex((q) => q.id === questionId)
  const target = all
    .slice(from)
    .find((q) => currentQuestions.value.includes(q))
  if (!target) return false
  currentQuestionIndex.value = currentQuestions.value.indexOf(target)
  if (currentStep.value) {
    currentTask.value =
      currentStep.value.tasks.find((t) => t.id === target._taskId) || currentTask.value
  }
  return true
}

const saveAnswer = async (questionId, value) => {
  const res = await getApi().answerQuestion(questionId, value)

  const q = currentQuestions.value.find((q) => q.id === questionId)
  if (q) {
    q.completed = true
    q.answer = value
  }
  applyQuestionVisibility()

  // Real points just earned for this specific answer — 0 when the question
  // was already answered before (the backend's idempotency guard), so
  // callers accumulating a running total never double-count an edit.
  return { pointsAwarded: res?.pointsAwarded ?? 0 }
}

const moveToNextQuestion = () => {
  if (currentQuestionIndex.value < currentQuestions.value.length - 1) {
    currentQuestionIndex.value++

    // Auto-update currentTask if we moved to a different task
    const nextQuestion = currentQuestions.value[currentQuestionIndex.value]
    if (nextQuestion && nextQuestion._taskId && currentStep.value) {
      const newTask = currentStep.value.tasks.find(
        (t) => t.id === nextQuestion._taskId,
      )
      if (newTask) {
        currentTask.value = newTask
      }
    }

    return true
  }
  return false
}

const moveToPreviousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--

    // Auto-update currentTask if we moved to a different task
    const prevQuestion = currentQuestions.value[currentQuestionIndex.value]
    if (prevQuestion && prevQuestion._taskId && currentStep.value) {
      const newTask = currentStep.value.tasks.find(
        (t) => t.id === prevQuestion._taskId,
      )
      if (newTask) {
        currentTask.value = newTask
      }
    }

    return true
  }
  return false
}

const completeTask = async (taskId) => {
  const result = await getApi().completeTask(taskId)
  if (currentTask.value) {
    currentTask.value.completed = true
  }
  return result
}

const currentQuestion = computed(() => {
  return currentQuestions.value[currentQuestionIndex.value] || null
})

// ---------- SINGLE EXPORT ----------
export const usePassportRuntime = () => {
  return {
    steps,
    loading,
    isOwner,
    isCollaborator,

    currentStep,
    currentTask,
    currentQuestions,
    currentQuestionIndex,
    currentQuestion,
    allSectionQuestions,
    questionTaskMap,

    loadPassport,
    loadAccess,
    setCurrentStep,
    setCurrentTask,
    loadQuestions,
    loadSectionQuestions,
    goToQuestion,
    saveAnswer,
    moveToNextQuestion,
    moveToPreviousQuestion,
    completeTask,
  }
}


