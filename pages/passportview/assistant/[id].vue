<template>
  <div class="ua-page">

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/op-icons/logo.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span><span class="hsw-brand-beta">BETA</span>
        </button>
        <nav class="hsw-links" aria-label="Primary navigation">
          <button type="button" @click="navigateTo('/dashboard')">Dashboard</button>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" class="active" @click="navigateTo('/passport')">Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
        </nav>
        <div class="hsw-actions">
          <button class="hsw-back" type="button" :aria-label="ppBack.label" @click="ppBack.go">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {{ ppBack.label }}
          </button>
        </div>
      </div>
    </header>

    <main class="ua-main">
      <section class="ua-stage" aria-label="UMU AI assistant">
        <!-- Top bar -->
        <header class="ua-top">
          <button
            type="button"
            class="ua-round"
            aria-label="Close and go back to your passport"
            @click="closeAssistant"
          >
            <Icon name="i-lucide-x" />
          </button>
          <div class="ua-top-mid">
            <h1 class="ua-title">Building your Seller Passport</h1>
            <p class="ua-top-sub">
              {{ sectionTitle || 'Your passport' }}<template v-if="questions.length">
                · {{ answeredCount }} of {{ questions.length }} answered</template>
            </p>
          </div>
          <div class="ua-top-end">
            <span class="ua-points" :class="{ 'is-pop': pointsPop }" title="Your passport points">
              <Icon name="i-lucide-star" class="ua-points-ic" />
              {{ shownBalance.toLocaleString('en-GB') }}
              <Transition name="ua-pop">
                <span v-if="pointsPop" class="ua-points-plus">+{{ pointsPop }}</span>
              </Transition>
            </span>
          </div>
        </header>

        <!-- Question tracker: one segment per question, tap to jump -->
        <div class="ua-track" aria-label="Questions in this section">
          <button
            v-for="(q, i) in questions"
            :key="q.id"
            type="button"
            class="ua-seg"
            :class="segClass(q, i)"
            :title="segTitle(q, i)"
            :aria-label="segTitle(q, i)"
            :aria-current="isCurrentSeg(i) ? 'step' : undefined"
            @click="jumpTo(i)"
          />
          <span v-if="!questions.length" class="ua-seg ua-seg--ghost" />
        </div>

        <div class="ua-body">
          <!-- UMU: live captions, the robot and its voice controls -->
          <aside class="ua-left" aria-label="UMU">
            <div class="ua-duo">
              <div class="ua-caption" :class="{ 'is-you': voice.listening.value }" aria-live="polite">
                <div class="ua-caption-head">
                  <span class="ua-caption-who">
                    <Icon :name="voice.listening.value ? 'i-lucide-user-round' : 'i-lucide-bot'" />
                    {{ voice.listening.value ? 'You' : 'UMU' }}
                  </span>
                  <span class="ua-caption-status">
                    <span class="ua-status-dot" :class="`is-${statusTone}`" />
                    {{ statusText }}
                    <button
                      v-if="ready && voice.canSpeak && voice.voices.value.length"
                      type="button"
                      class="ua-voice-btn"
                      aria-label="UMU's voice settings"
                      title="Voice settings"
                      :aria-expanded="showVoicePanel"
                      @click="showVoicePanel = !showVoicePanel"
                    >
                      <Icon name="i-lucide-sliders-horizontal" />
                    </button>
                  </span>
                </div>
                <p v-if="voice.listening.value" class="ua-caption-text">
                  <span v-if="heardText">{{ heardText }}</span>
                  <span v-else class="ua-caption-wait">Listening, go ahead</span>
                  <span class="ua-bars" :class="{ 'is-live': voice.level.value > 0.02 }" aria-hidden="true">
                    <i v-for="n in 5" :key="n" :style="{ '--i': n, height: barHeight(n) }" />
                  </span>
                </p>
                <p v-else class="ua-caption-text">
                  <span
                    v-for="(w, i) in captionLine.words"
                    :key="`${captionLine.text}:${i}`"
                    class="ua-w"
                    :class="{ 'is-said': i < captionLine.said }"
                  >{{ `${w} ` }}</span>
                </p>
                <button
                  v-if="voice.blocked.value && phase === 'question'"
                  type="button"
                  class="ua-hear"
                  @click="repeatQuestion"
                >
                  <Icon name="i-lucide-volume-2" />
                  Tap to hear UMU
                </button>
              </div>
              <div class="ua-bot">
                <UmuBotMascot :state="botState" :wave="waveHello" />
              </div>
            </div>

            <!-- UMU's voice: pick the clearest one on this device, and the speed -->
            <Transition name="ua-pop">
              <div v-if="showVoicePanel" class="ua-voice-panel" role="dialog" aria-label="UMU's voice">
                <div class="ua-vp-head">
                  <p class="ua-vp-title">UMU's voice</p>
                  <button type="button" class="ua-vp-close" aria-label="Close voice settings" @click="showVoicePanel = false">
                    <Icon name="i-lucide-x" />
                  </button>
                </div>
                <div class="ua-vp-list" role="radiogroup" aria-label="Voice">
                  <button
                    v-for="v in voiceChoices"
                    :key="v.name"
                    type="button"
                    role="radio"
                    class="ua-vp-voice"
                    :class="{ 'is-on': v.name === activeVoiceName }"
                    :aria-checked="v.name === activeVoiceName"
                    @click="chooseVoice(v.name)"
                  >
                    <span class="ua-vp-name">{{ prettyVoice(v.name) }}</span>
                    <span v-if="v.recommended" class="ua-vp-tag">Clearest</span>
                    <span v-else class="ua-vp-lang">{{ v.lang }}</span>
                  </button>
                </div>
                <label class="ua-vp-rate">
                  <span>Speed</span>
                  <input
                    type="range"
                    min="0.85"
                    max="1.15"
                    step="0.05"
                    :value="voice.rate.value"
                    aria-label="Speaking speed"
                    @input="(e) => voice.setRate(Number((e.target as HTMLInputElement).value))"
                    @change="voice.preview()"
                  />
                </label>
                <button type="button" class="ua-vp-play" @click="voice.preview()">
                  <Icon name="i-lucide-play" />
                  Play a sample
                </button>
              </div>
            </Transition>

            <div v-if="ready" class="ua-console">
              <button
                type="button"
                class="ua-cbtn"
                aria-label="Repeat the question"
                title="Repeat the question"
                :disabled="phase !== 'question'"
                @click="repeatQuestion"
              >
                <Icon name="i-lucide-rotate-ccw" />
              </button>
              <div class="ua-mic-wrap">
                <button
                  v-if="voice.canListen"
                  type="button"
                  class="ua-mic"
                  :class="{ 'is-on': voiceMode, 'is-hearing': voice.listening.value }"
                  :aria-pressed="voiceMode"
                  :aria-label="voiceMode ? 'Stop answering by voice' : 'Answer by voice'"
                  :disabled="phase !== 'question'"
                  @click="toggleVoice"
                >
                  <Icon :name="voiceMode ? 'i-lucide-square' : 'i-lucide-mic'" />
                </button>
              </div>
              <button
                type="button"
                class="ua-cbtn"
                :aria-pressed="!voice.muted.value"
                :aria-label="voice.muted.value ? 'Turn UMU voice on' : 'Turn UMU voice off'"
                :title="voice.muted.value ? 'Voice off' : 'Voice on'"
                @click="toggleMute"
              >
                <Icon :name="voice.muted.value ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" />
              </button>
            </div>
          </aside>

          <!-- The question sheet -->
          <section class="ua-sheet" aria-label="Question">
            <header class="ua-sheet-head">
              <div class="ua-sheet-meta">
                <span v-if="sheetKicker" class="ua-kicker">{{ sheetKicker }}</span>
                <span v-if="phase === 'question' && current" class="ua-qnum">
                  Question {{ position }} of {{ questions.length }}
                </span>
              </div>
              <Transition name="ua-say" mode="out-in">
                <h2 :key="sayKey" class="ua-q">{{ sayText }}</h2>
              </Transition>
              <p v-if="sayHint" class="ua-hint">{{ sayHint }}</p>
              <p v-if="tipText" class="ua-tip">
                <Icon name="i-lucide-lightbulb" class="ua-tip-ic" />
                <span>{{ tipText }}</span>
              </p>
            </header>

            <div ref="talkEl" class="ua-sheet-body">
              <!-- Answer: the same question component the manual page uses,
                   so the saved answer is identical either way. -->
              <div
                v-if="phase === 'question' && current"
                ref="answerEl"
                class="ua-answer"
                @focusin="onFieldFocus"
                @pointerdown="onAnswerPointer"
              >
                <!-- Notes are shown right here to read, rather than in a
                     pop-up; "I've read this" saves them -->
                <div v-if="noteBlocks.length" class="ua-notes">
                  <template v-for="(b, i) in noteBlocks" :key="i">
                    <h3 v-if="b.type === 'heading'" class="ua-notes-h">{{ b.text }}</h3>
                    <p v-else-if="b.type === 'callout'" class="ua-notes-callout">
                      <Icon name="i-lucide-info" class="ua-notes-callout-ic" />
                      <span>{{ b.text }}</span>
                    </p>
                    <ul v-else-if="b.type === 'bullets'" class="ua-notes-list">
                      <li v-for="(item, j) in b.items" :key="j">
                        <strong v-if="item.bold">{{ item.bold }}</strong>{{ item.text }}
                      </li>
                    </ul>
                    <p v-else class="ua-notes-p" :class="{ 'is-bold': b.type === 'bold' }">{{ b.text }}</p>
                  </template>
                </div>
                <component
                  :is="questionComponent"
                  v-else
                  :key="`${current.id}:${componentRev}`"
                  :question="current"
                  :answer="current.answer"
                  :display="current.display || current.type"
                  :passport-id="passportId"
                  :property-facts="propertyFacts"
                  displayed-question=""
                  displayed-description=""
                  displayed-help=""
                  :hide-question-display="hideOwnTitle"
                  :auto-open="false"
                  @update="onUpdate"
                />

                <!-- Extra details or a document, when the question asks -->
                <div v-if="hasAdditionalInfo" class="ua-extra">
                  <p class="ua-extra-label">Anything else to add?</p>
                  <TextUploadQuestion
                    :question="{
                      description: 'Please provide additional supporting information',
                      uploadInstruction: current.uploadInstruction,
                      instructionText: current.instructionText,
                      placeholder: current.placeholder,
                    }"
                    :answer="additionalInfoAnswer"
                    :display="additionalInfoDisplay"
                    @update="(v) => (additionalInfoAnswer = v)"
                  />
                </div>

                <p v-if="voiceNote" class="ua-note" role="status">{{ voiceNote }}</p>
                <p v-if="saveError" class="ua-error" role="alert">{{ saveError }}</p>
              </div>

              <!-- Follow-up steps the answer opened, as on the manual page -->
              <div v-else-if="phase === 'pathway' && activePathway" class="ua-pathway">
                <TransitionGroup name="ua-msg" tag="div" class="ua-pathway-flow">
                  <PathwayStepCard
                    v-for="(step, i) in pathwayVisibleSteps"
                    :key="`${step.stepId}:${pathwayAttempt}`"
                    :passport-id="passportId"
                    :pathway="activePathway.pathway"
                    :current-step-id="step.stepId"
                    :step-position="i"
                    :total-steps="pathwayVisibleSteps.length"
                    :selected-label="step.answerLabel"
                    :answered-evidence-file-urls="step.evidenceFileUrls"
                    @answer="onPathwayAnswer"
                    @defer="onPathwayDefer"
                  />
                  <PathwayOutcomeCard
                    v-if="activePathway.journey.status !== 'IN_PROGRESS'"
                    key="outcome"
                    :pathway="activePathway.pathway"
                    :status="activePathway.journey.status"
                    @continue="continueAfterPathway"
                  />
                </TransitionGroup>
              </div>

              <div v-else-if="phase === 'done'" class="ua-done">
                <Icon name="i-lucide-circle-check-big" class="ua-done-ic" />
                <p class="ua-done-title">
                  {{ answeredCount === questions.length ? `${sectionTitle} complete` : `End of ${sectionTitle}` }}
                </p>
                <p class="ua-done-text">
                  <template v-if="answeredCount === questions.length">
                    All {{ questions.length }} questions are answered and saved in your passport.
                  </template>
                  <template v-else>
                    {{ answeredCount }} of {{ questions.length }} answered. Tap a segment in the bar above to go back to any question.
                  </template>
                </p>
                <button type="button" class="ua-save" @click="closeAssistant">
                  Back to your passport
                  <Icon name="i-lucide-arrow-right" />
                </button>
              </div>

              <div v-else-if="phase === 'error'" class="ua-done">
                <Icon name="i-lucide-wifi-off" class="ua-done-ic ua-done-ic--muted" />
                <p class="ua-done-text">Check your connection, then try again.</p>
                <button type="button" class="ua-save" @click="start">Try again</button>
              </div>

              <div v-else class="ua-skeleton" aria-hidden="true">
                <span /><span /><span />
              </div>
            </div>

            <footer v-if="phase === 'question' && current" class="ua-sheet-foot">
              <p class="ua-foot-status" :class="{ 'is-asking': askingLabel }">
                <Icon
                  :name="askingLabel ? 'i-lucide-message-circle-question' : 'i-lucide-keyboard'"
                  class="ua-foot-ic"
                />
                <span>{{ askingLabel || footHint }}</span>
              </p>
              <div class="ua-foot-actions">
                <button type="button" class="ua-skip" :disabled="saving" @click="skipQuestion">
                  Skip for now
                </button>
                <button
                  v-if="needsSaveButton"
                  type="button"
                  class="ua-save"
                  :disabled="(!answerValid && !noteBlocks.length) || saving"
                  @click="noteBlocks.length ? saveCurrent(true) : saveCurrent()"
                >
                  <Icon v-if="saving" name="i-lucide-loader-circle" class="ua-spin" />
                  {{ saving ? 'Saving' : noteBlocks.length ? "I've read this" : 'Save and continue' }}
                  <Icon v-if="!saving" name="i-lucide-arrow-right" />
                </button>
              </div>
            </footer>
          </section>
        </div>
      </section>
    </main>

    <SiteFooter wide />

    <SectionCompleteCelebration
      v-if="showSectionComplete"
      v-model="showSectionComplete"
      :section-bonus-points="sectionBonusPoints"
      :total-points-before="totalPointsBefore"
      :total-points-after="totalPointsAfter"
      @continue="afterCelebration"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, provide, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import UmuBotMascot from '~/components/agent/UmuBotMascot.vue'
import RadioQuestion from '~/components/passport-view/questions/RadioQuestion.vue'
import TextUploadQuestion from '~/components/passport-view/questions/TextUploadQuestion.vue'
import CheckboxQuestion from '~/components/passport-view/questions/CheckboxQuestion.vue'
import ChipsQuestion from '~/components/passport-view/questions/ChipsQuestion.vue'
import NoteQuestion from '~/components/passport-view/questions/NoteQuestion.vue'
import DateQuestion from '~/components/passport-view/questions/DateQuestion.vue'
import ScaleQuestion from '~/components/passport-view/questions/ScaleQuestion.vue'
import MultipartQuestion from '~/components/passport-view/questions/MultipartQuestion.vue'
import BoundaryResponsibilityQuestion from '~/components/passport-view/questions/BoundaryResponsibilityQuestion.vue'
import MultiTextInputQuestion from '~/components/passport-view/questions/MultiTextInputQuestion.vue'
import MultiFieldFormQuestion from '~/components/passport-view/questions/MultiFieldFormQuestion.vue'
import RepeatableItemQuestion from '~/components/passport-view/questions/RepeatableItemQuestion.vue'
import PathwayStepCard from '~/components/passport-view/PathwayStepCard.vue'
import PathwayOutcomeCard from '~/components/passport-view/PathwayOutcomeCard.vue'
import SectionCompleteCelebration from '~/components/passport-view/SectionCompleteCelebration.vue'
import { usePassportRuntime } from '~/composables/usePassportRuntime'
import { usePassportBack, usePassportTrail } from '~/composables/usePassportTrail'
import { usePathways } from '~/composables/usePathways'
import { usePassportAchievement } from '~/composables/usePassportAchievement'
import { useCountUp } from '~/composables/useCountUp'
import { useUmuVoice } from '~/composables/useUmuVoice'
import { normalizeQuestionType, isQuestionAnswerValid } from '~/utils/questionAnswer'
import {
  guideFor,
  voiceCommand,
  matchOption,
  spokenNumber,
  spokenDate,
  spokenEmail,
  spokenLetter,
  spokenPhone,
  spokenPostcode,
  spokenAddress,
  spokenCode,
} from '~/utils/umuGuide'
import { toSmartTitleCase } from '~/utils/titleCase'

definePageMeta({ middleware: 'auth' })

// Lets question components switch to their assistant look (labelled form
// fields with numbered steps). The manual pages never provide it.
provide('umuAssistant', true)

const route = useRoute()
const passportId = computed(() => String(route.params.id))
const passportPath = computed(() => `/passportview/${passportId.value}`)

const ppBack = usePassportBack(() => passportPath.value, 'Back to passport')
const ppTrail = usePassportTrail()

function closeAssistant() {
  cancelFlow()
  ppTrail.returnTo(passportPath.value, passportPath.value)
}

// Voice controls only render on the client, where speech is available.
const ready = ref(false)

// ── Questions ────────────────────────────────────────────────────────
// Same section loader as the manual question page: questions that don't
// apply are left out, and it starts at the first unanswered one, like
// "Pick up where you left off". For now it covers the Ownership Profile.
const rt = usePassportRuntime()
const questions = rt.currentQuestions
const current = rt.currentQuestion

type Phase = 'loading' | 'question' | 'pathway' | 'done' | 'error'
const phase = ref<Phase>('loading')
const sectionTitle = ref('')
const resumed = ref(false)
const greetFor = ref<string | null>(null)
const propertyFacts = ref<any>(null)
const saving = ref(false)
const saveError = ref('')
const voiceNote = ref('')
const heardText = ref('')
const askingLabel = ref('')
const additionalInfoAnswer = ref<any>(null)
const componentRev = ref(0)

// Review mode (temporary, user request 2026-10-08): start at question 1
// and step through every question in order, answered or not, so the whole
// section can be checked. Set to false to go back to skipping answered
// questions and resuming at the first unanswered one.
const REVIEW_ALL = true

const isOwnershipSection = (s: any) =>
  s?.key === 'ownershipProfile' || /ownership/i.test(s?.title || '')

async function start() {
  phase.value = 'loading'
  try {
    await rt.loadPassport(passportId.value)
    const section = (rt.steps.value as any[]).find(isOwnershipSection)
    if (!section) throw new Error('Ownership Profile not found')
    sectionTitle.value = toSmartTitleCase(section.title)
    rt.setCurrentStep(section.id)
    await rt.loadSectionQuestions(section.id)
    resumed.value = questions.value.some((q: any) => q.completed)
    if (REVIEW_ALL && questions.value.length) {
      rt.currentQuestionIndex.value = 0
      greetFor.value = current.value?.id ?? null
      phase.value = 'question'
    } else if (questions.value.every((q: any) => q.completed)) {
      phase.value = 'done'
    } else {
      greetFor.value = current.value?.id ?? null
      phase.value = 'question'
    }
  } catch {
    phase.value = 'error'
  }
}

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` })

async function loadPropertyFacts() {
  try {
    propertyFacts.value = await $fetch(
      `${useRuntimeConfig().public.apiBase}/passport/${passportId.value}/property-facts`,
      { headers: authHeaders() },
    )
  } catch {
    // non-critical, the address question just won't pre-fill
  }
}

// ── Points ───────────────────────────────────────────────────────────
const balance = ref(0)
const { value: shownBalance, start: countUp } = useCountUp(0)
const pointsPop = ref(0)
let pointsTimer: ReturnType<typeof setTimeout> | null = null

async function loadBalance() {
  try {
    const res: any = await $fetch(`${useRuntimeConfig().public.apiBase}/rewards/balance`, {
      headers: authHeaders(),
    })
    balance.value = res?.balance ?? 0
    countUp(0, balance.value, 900)
  } catch {
    // the chip just starts at 0
  }
}

function addPoints(points: number) {
  if (!points) return
  const from = balance.value
  balance.value += points
  countUp(from, balance.value, 1200)
  pointsPop.value = points
  if (pointsTimer) clearTimeout(pointsTimer)
  pointsTimer = setTimeout(() => (pointsPop.value = 0), 2200)
}

onMounted(() => {
  ready.value = true
  start()
  loadPropertyFacts()
  loadBalance()
})

const answeredCount = computed(() => questions.value.filter((q: any) => q.completed).length)
const progressPct = computed(() =>
  questions.value.length ? Math.round((answeredCount.value / questions.value.length) * 100) : 0,
)

const qType = computed(() => normalizeQuestionType(current.value))

const COMPONENTS: Record<string, any> = {
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
// UMU asks the question in its bubble, so the component shows only the
// answer. A form prints its own title when hide-question-display is on, and
// with no question text passed nothing shows above the answer anyway, so it
// stays off for forms.
const questionComponent = computed(() => {
  if (qType.value === 'multipart' && current.value?.repeatable) return RepeatableItemQuestion
  return COMPONENTS[qType.value] || TextUploadQuestion
})

// Same "is this answer complete" rules as the manual page.
const answerValid = computed(() => isQuestionAnswerValid(current.value))

// Radio answers save the moment one is picked, and a Notes question saves
// when its notes are closed, so neither needs a Save button.
const needsSaveButton = computed(() => qType.value !== 'radio')

// Only these components print the question themselves when no question
// text is passed, so only they need their title block switched off. The
// others keep it on, because it also holds things like the asking price
// box and the "find your council tax band" link.
const hideOwnTitle = computed(
  () => qType.value === 'chips' || questionComponent.value === TextUploadQuestion,
)

// The notes, shown in the sheet to read: typed blocks ({ type, text }) as
// the passport uses now, or older plain sellers / buyers text.
const noteBlocks = computed<any[]>(() => {
  if (qType.value !== 'note') return []
  const pre: any = current.value?.prewritten || current.value?.prewrittenTemplates || {}
  const content = pre.content || pre.text || pre.body
  if (Array.isArray(content) && content.length && typeof content[0] === 'object') return content
  const blocks: any[] = []
  const add = (heading: string, v: unknown) => {
    const items = Array.isArray(v) ? v : v ? [v] : []
    if (!items.length) return
    if (heading) blocks.push({ type: 'heading', text: heading })
    items.forEach((t) => blocks.push({ type: 'paragraph', text: String(t) }))
  }
  add('', content)
  add(pre.sellers && pre.buyers ? 'For sellers' : '', pre.sellers)
  add('For buyers', pre.buyers)
  return blocks
})

// Extra details box, shown once the main answer is given (manual page rule)
const hasAdditionalInfo = computed(() => {
  const q: any = current.value
  if (!q?.additionalInfoType) return false
  return q.answer !== null && q.answer !== undefined && q.answer !== ''
})
const additionalInfoDisplay = computed(() => {
  const t = String(current.value?.additionalInfoType || '').toLowerCase()
  if (t.includes('upload') && t.includes('write')) return 'both'
  if (t.includes('upload')) return 'upload'
  if (t.includes('write')) return 'text'
  return null
})

// ── What UMU says ────────────────────────────────────────────────────
const sayKey = computed(() => `${phase.value}:${current.value?.id ?? ''}`)

const greeting = computed(() => {
  if (phase.value !== 'question' || !current.value || current.value.id !== greetFor.value) return ''
  return resumed.value
    ? `Welcome back. Let's carry on with your ${sectionTitle.value}.`
    : `Hi, I'm UMU. I'll read each question to you and help you answer it.`
})

const sayText = computed(() => {
  if (phase.value === 'loading') return 'Getting your questions ready.'
  if (phase.value === 'error') return "Sorry, I couldn't load your questions just now. Please try again."
  if (phase.value === 'done') {
    const left = questions.value.length - answeredCount.value
    return left > 0
      ? `That's every question in your ${sectionTitle.value || 'section'}. ${left} still ${left === 1 ? 'needs' : 'need'} an answer.`
      : `Your ${sectionTitle.value || 'section'} is complete. Brilliant work.`
  }
  if (phase.value === 'pathway') return 'Thanks. This answer has a few quick follow-up steps.'
  const q: any = current.value
  if (!q) return ''
  const firstPartTitle = Array.isArray(q.parts) ? q.parts.find((p: any) => p?.title)?.title : ''
  return q.question || q.title || firstPartTitle || 'Please answer this one.'
})

// True when UMU's question is the first part's own title, so the form
// doesn't print it a second time.
const askedFromFirstPart = computed(() => {
  const q: any = current.value
  return !!q && !q.question && !q.title && Array.isArray(q.parts) && !!q.parts[0]?.title
})

// The task name, unless it just repeats the question
const sayKicker = computed(() => {
  if (phase.value !== 'question') return ''
  const task = (current.value?._taskTitle || '').trim()
  return task && task.toLowerCase() !== sayText.value.trim().toLowerCase() ? task : ''
})

const sayHint = computed(() => {
  if (phase.value === 'pathway') return 'Tap your answers below. They help us guide you to the right next step.'
  if (phase.value !== 'question' || !current.value) return ''
  const q: any = current.value
  const hint = (q.description || q.subtitle || '').trim()
  return hint && hint !== sayText.value && hint.length < 260 ? hint : ''
})

const guide = computed(() => guideFor(current.value || {}, qType.value))

// ── Sheet and tracker ────────────────────────────────────────────────
const position = computed(() => rt.currentQuestionIndex.value + 1)

const sheetKicker = computed(() => {
  if (phase.value === 'pathway') return 'Follow-up'
  if (phase.value === 'done') return 'Section complete'
  return sayKicker.value
})

// Voice settings
const showVoicePanel = ref(false)
const voiceChoices = computed(() => voice.voices.value.slice(0, 6))
const activeVoiceName = computed(() => voice.voiceName.value || voice.voices.value[0]?.name || '')
const prettyVoice = (name: string) =>
  name.replace(/^Microsoft\s+/i, '').replace(/\s*-\s*English.*$/i, '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/Online/i, '').trim()
function chooseVoice(name: string) {
  voice.setVoice(name)
  voice.preview()
}
// A tap anywhere else closes the voice panel
function closeVoicePanelOutside(e: MouseEvent) {
  if (!showVoicePanel.value) return
  if ((e.target as HTMLElement)?.closest?.('.ua-voice-panel, .ua-voice-btn')) return
  showVoicePanel.value = false
}
onMounted(() => document.addEventListener('click', closeVoicePanelOutside))
onBeforeUnmount(() => document.removeEventListener('click', closeVoicePanelOutside))

const footHint = computed(() =>
  voice.canListen ? 'Type, or tap the mic and tell UMU' : 'Type or tap your answer',
)

const isCurrentSeg = (i: number) => phase.value === 'question' && i === rt.currentQuestionIndex.value

function segClass(q: any, i: number) {
  if (isCurrentSeg(i)) return 'ua-seg--current'
  if (q.completed) return 'ua-seg--done'
  if (skipped.has(q.id)) return 'ua-seg--skipped'
  return ''
}

function segTitle(q: any, i: number) {
  const firstPart = Array.isArray(q.parts) ? q.parts.find((p: any) => p?.title)?.title : ''
  const title = q.question || q.title || firstPart || 'Question'
  const state = q.completed ? 'answered' : skipped.has(q.id) ? 'skipped' : 'not answered yet'
  return `Question ${i + 1}: ${title} (${state})`
}

// Jump straight to any question, answered or not, to fill it or change it.
function jumpTo(i: number) {
  if (saving.value || phase.value === 'loading' || phase.value === 'error') return
  activePathway.value = null
  phase.value = 'question'
  if (rt.currentQuestionIndex.value === i) presentQuestion()
  else rt.currentQuestionIndex.value = i
  talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// Sound bars follow the seller's real voice level when the mic allows it
const BAR_SHAPE = [0.55, 0.85, 1, 0.8, 0.5]
const barHeight = (n: number) =>
  voice.level.value > 0.02 ? `${5 + Math.round(voice.level.value * BAR_SHAPE[n - 1] * 13)}px` : undefined

// What the caption bubble shows: the sentence UMU is saying, word by word,
// or, before UMU has spoken, the greeting.
const captionLine = computed(() => {
  const spoken = voice.caption.value
  const text = spoken || greeting.value || sayText.value
  const words = text.split(/\s+/).filter(Boolean)
  return { text, words, said: spoken ? voice.captionWords.value : words.length }
})
const tipText = computed(() => (phase.value === 'question' ? guide.value.tip : ''))

// ── Robot ────────────────────────────────────────────────────────────
const waveHello = ref(true)
const pose = ref<'' | 'pointing' | 'celebrate'>('')
let poseTimer: ReturnType<typeof setTimeout> | null = null

function setPose(p: 'pointing' | 'celebrate', ms: number) {
  pose.value = p
  if (poseTimer) clearTimeout(poseTimer)
  poseTimer = setTimeout(() => (pose.value = ''), ms)
}

const voice = useUmuVoice()
const voiceMode = ref(false)

const botState = computed(() => {
  if (pose.value === 'celebrate') return 'celebrate'
  if (voice.listening.value) return 'listening'
  if (voice.speaking.value) return 'speaking'
  if (phase.value === 'loading' || saving.value) return 'thinking'
  if (pose.value === 'pointing') return 'pointing'
  return 'idle'
})

const statusTone = computed(() => {
  if (voice.listening.value) return 'listen'
  if (voice.speaking.value) return 'speak'
  return voiceMode.value ? 'on' : 'idle'
})

// Microphone problems, in plain words
const MIC_STATUS: Record<string, string> = {
  denied: 'Microphone blocked',
  'no-mic': 'No microphone found',
  network: 'Needs internet to listen',
  unsupported: 'Voice needs Chrome, Edge or Safari',
}
const MIC_HELP: Record<string, string> = {
  denied: 'Your microphone is blocked. Allow it from the icon in the address bar, then tap the mic again.',
  'no-mic': "I can't find a microphone. Plug one in, or type your answers instead.",
  network: 'Listening needs an internet connection. You can keep typing your answers.',
  unsupported: 'Answering by voice works in Chrome, Edge and Safari. You can type your answers here.',
}
watch(
  () => voice.micError.value,
  (err) => {
    if (err) voiceNote.value = MIC_HELP[err] || ''
  },
)

const statusText = computed(() => {
  if (voice.listening.value) return 'Listening, take your time'
  if (voice.micError.value) return MIC_STATUS[voice.micError.value] || 'Microphone unavailable'
  if (voice.speaking.value) return 'UMU is speaking'
  if (saving.value) return 'Saving your answer'
  if (phase.value === 'loading') return 'Getting ready'
  if (phase.value !== 'question') return 'UMU is here to help'
  if (voiceMode.value) return 'Tap to stop'
  return voice.canListen ? 'Tap to speak' : 'Tap or type your answer'
})

// ── Conversation flow ────────────────────────────────────────────────
// Every spoken step checks it is still the live one, so moving on, typing
// or tapping Stop cancels whatever UMU was saying or listening for.
let flow = 0
const alive = (id: number) => id === flow

function cancelFlow() {
  flow++
  ack = ''
  voice.stopAll()
  askingLabel.value = ''
  heardText.value = ''
  clearTarget()
}

function joinSay(...parts: string[]) {
  return parts
    .map((p) => (p || '').trim())
    .filter(Boolean)
    .map((p) => (/[.?!]$/.test(p) ? p : p + '.'))
    .join(' ')
}

async function say(text: string, id: number) {
  if (!alive(id)) return false
  return voice.speak(text)
}

// Said before the next question, so UMU keeps moving: "Saved, plus 100 points."
let savedPrefix = ''

async function presentQuestion() {
  cancelFlow()
  const id = flow
  await nextTick()
  if (!alive(id) || phase.value !== 'question' || !current.value) return
  const prefix = savedPrefix
  savedPrefix = ''
  await say(joinSay(prefix, greeting.value, sayText.value, guide.value.say), id)
  if (!alive(id)) return
  setPose('pointing', 2400)
  if (voiceMode.value) runVoiceAnswer(id)
}

function repeatQuestion() {
  presentQuestion()
}

watch(sayKey, async () => {
  voiceNote.value = ''
  saveError.value = ''
  if (phase.value === 'question') return presentQuestion()
  cancelFlow()
  const id = flow
  if (phase.value === 'done') {
    setPose('celebrate', 3200)
    await say(joinSay(savedPrefix, sayText.value, 'You can go back to your passport now.'), id)
    savedPrefix = ''
  } else if (phase.value === 'pathway') {
    setPose('pointing', 2400)
    await say(joinSay(savedPrefix, sayText.value, sayHint.value), id)
    savedPrefix = ''
  }
})

onMounted(() => setTimeout(() => (waveHello.value = false), 3200))

// Saved answers can arrive wrapped with their additional info; the
// components expect the plain answer, as on the manual page.
watch(
  current,
  (q: any) => {
    additionalInfoAnswer.value = null
    if (!q || q.type === 'multipart') return
    const a = q.answer
    if (a && typeof a === 'object' && !Array.isArray(a)) {
      if (a.additionalInfo !== undefined) {
        additionalInfoAnswer.value = a.additionalInfo
        q.answer = a.mainAnswer
      } else if (a.radioAnswer !== undefined) {
        additionalInfoAnswer.value = a.uploadedFiles || null
        q.answer = a.radioAnswer
      }
    }
  },
  { immediate: true },
)

// UMU already asked the first part's title, so hide its copy in the form
watch(
  () => [current.value?.id, componentRev.value, phase.value],
  async () => {
    await nextTick()
    const first = answerEl.value?.querySelector('.part-text')
    if (!first) return
    const same = cleanLabel(first.textContent || '').toLowerCase() === cleanLabel(sayText.value).toLowerCase()
    if (askedFromFirstPart.value || same) first.classList.add('ua-dup-title')
  },
)

// ── Voice answering ──────────────────────────────────────────────────
const answerEl = ref<HTMLElement | null>(null)
const talkEl = ref<HTMLElement | null>(null)
let lastFocused: HTMLInputElement | HTMLTextAreaElement | null = null
let lastFocusAt = 0

function toggleMute() {
  voice.setMuted(!voice.muted.value)
}

function stopVoiceMode() {
  voiceMode.value = false
  cancelFlow()
}

async function toggleVoice() {
  if (voiceMode.value) return stopVoiceMode()
  voiceMode.value = true
  cancelFlow()
  const id = flow
  // Ask for the microphone now, while this tap allows the prompt
  if (!(await voice.prepareMic())) {
    voiceMode.value = false
    return
  }
  if (!alive(id)) return
  // Pressing the mic takes focus, so use the box tapped just before it
  const focused =
    lastFocused && answerEl.value?.contains(lastFocused) && Date.now() - lastFocusAt < 20000
      ? lastFocused
      : null
  if (focused) {
    const t = toTarget(focused)
    if (t) {
      dictate(t, id, true).then(() => alive(id) && runVoiceAnswer(id))
      return
    }
  }
  runVoiceAnswer(id)
}

// Typing or tapping by hand takes over from voice.
function onFieldFocus(e: FocusEvent) {
  const el = e.target as HTMLElement
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    lastFocused = el
    lastFocusAt = Date.now()
  }
  if (voiceMode.value) stopVoiceMode()
}
function onAnswerPointer() {
  if (voiceMode.value && voice.listening.value) stopVoiceMode()
}

interface InputTarget {
  kind: 'input'
  el: HTMLInputElement | HTMLTextAreaElement
  label: string
  addOnEnter: boolean
}
interface ChoiceTarget {
  kind: 'choice'
  el: HTMLElement
  label: string
  options: { el: HTMLElement; label: string }[]
}
type Target = InputTarget | ChoiceTarget

const SKIP_TYPES = new Set(['hidden', 'file', 'checkbox', 'radio', 'button', 'submit', 'reset'])

function visible(el: Element) {
  return (el as HTMLElement).getClientRects().length > 0
}

function cleanLabel(s: string) {
  return s
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(please\s+)?(enter|select|provide|type|add)\s+/i, '')
    .replace(/\(s\)/gi, 's')
    .replace(/\bemail id\b/i, 'email address')
    .replace(/[.:…]+$/, '')
    .replace(/\?$/, '')
    .trim()
}

function partTitle(el: Element) {
  return cleanLabel(el.closest('.part-section')?.querySelector('.part-text')?.textContent || '')
}

function inputLabel(el: HTMLInputElement | HTMLTextAreaElement) {
  const junk = /^(start typing|\W*\d|£|\$|0+%?$|search)/i
  const nearby = el
    .closest('.date-badge, .currency-box, .form-field, .input-section, .date-option')
    ?.querySelector('.currency-box__label, .date-placeholder, .field-label, .mi-label')?.textContent
  const candidates = [
    (el as HTMLInputElement).labels?.[0]?.textContent,
    el.getAttribute('aria-label'),
    el.getAttribute('placeholder'),
    nearby,
  ]
  let label = ''
  for (const c of candidates) {
    const t = cleanLabel(c || '')
    if (t.length > 1 && !junk.test(t)) {
      label = t
      break
    }
  }
  const part = partTitle(el)
  // A one word label like "Name" says less than the part it belongs to
  if (part && (!label || !/\s/.test(label))) label = part
  return label || 'answer'
}

function toTarget(el: Element): Target | null {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el instanceof HTMLInputElement && SKIP_TYPES.has(el.type)) return null
    if (el.disabled || el.readOnly || !visible(el)) return null
    if (el.closest('.radio-options, .chips-wrap, .modal')) return null
    // A chips part's own "type your own" box is used by its chips target
    if (el.classList.contains('voice-input-field')) return null
    if (el instanceof HTMLInputElement && el.type === 'range') {
      return { kind: 'input', el, label: partTitle(el) || 'answer', addOnEnter: false }
    }
    return {
      kind: 'input',
      el,
      label: inputLabel(el),
      addOnEnter: !!el.closest('.input-section')?.querySelector('.add-btn'),
    }
  }
  const opts = Array.from(el.querySelectorAll<HTMLElement>('.radio-option, .chip'))
    .filter(visible)
    .map((o) => ({ el: o, label: (o.querySelector('.option-label')?.textContent || o.textContent || '').trim() }))
    .filter((o) => o.label)
  if (!opts.length || !visible(el)) return null
  return { kind: 'choice', el: el as HTMLElement, label: partTitle(el), options: opts }
}

function collectTargets(): Target[] {
  const root = answerEl.value
  if (!root) return []
  return Array.from(root.querySelectorAll('input, textarea, .radio-options, .chips-wrap'))
    .map(toTarget)
    .filter(Boolean) as Target[]
}

function isFilled(t: Target) {
  if (t.kind === 'choice') return t.options.some((o) => o.el.classList.contains('selected'))
  if (t.addOnEnter) return !!t.el.closest('.multi-text-input, .input-section')?.parentElement?.querySelector('.edit-btn')
  // A slider always holds a value, so UMU always asks for it
  if (t.el instanceof HTMLInputElement && t.el.type === 'range') return false
  return t.el.value.trim().length > 0
}

let activeEl: HTMLElement | null = null
function setTarget(t: Target) {
  clearTarget()
  activeEl = t.el
  activeEl.classList.add('ua-voice-target')
  reveal(activeEl)
}

// Brings the box UMU is asking about into view. On desktop the sheet
// scrolls by itself, so only the sheet moves and the page stays put; on
// phones the page itself scrolls.
function reveal(el: HTMLElement) {
  const box = talkEl.value
  if (box && getComputedStyle(box).overflowY !== 'visible' && box.scrollHeight > box.clientHeight + 1) {
    const zoom = (box as any).currentCSSZoom || 1
    const r = el.getBoundingClientRect()
    const b = box.getBoundingClientRect()
    const delta = (r.top - b.top - (b.height - r.height) / 2) / zoom
    box.scrollTo({ top: box.scrollTop + delta, behavior: 'smooth' })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
function clearTarget() {
  activeEl?.classList.remove('ua-voice-target')
  activeEl = null
}

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

function pressEnter(el: HTMLElement) {
  el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
}

// Turns speech into what the field expects.
function shapeFor(t: InputTarget, said: string): string | null {
  const el = t.el
  const hint = `${t.label} ${el.getAttribute('placeholder') || ''} ${el.getAttribute('inputmode') || ''}`.toLowerCase()
  if (el instanceof HTMLInputElement && el.type === 'date') return spokenDate(said)
  if (el instanceof HTMLInputElement && el.type === 'range') {
    const n = spokenNumber(said)
    if (n === null) return null
    return String(Math.min(Math.max(n, Number(el.min || 0)), Number(el.max || 10)))
  }
  if ((el instanceof HTMLInputElement && el.type === 'email') || /email/.test(hint)) return spokenEmail(said)
  if (/phone|mobile|telephone/.test(hint)) return spokenPhone(said)
  if (/postcode|post code/.test(hint)) return spokenPostcode(said)
  if (/address/.test(hint)) return spokenAddress(said.charAt(0).toUpperCase() + said.slice(1))
  if (/reference|ref\b|number|code|registration/.test(hint)) {
    const code = spokenCode(said)
    if (code !== said) return code
  }
  if (/numeric|decimal|£|%|amount|price|percentage|rent|years|number of|units/.test(hint)) {
    const n = spokenNumber(said)
    return n !== null ? String(n) : said
  }
  return said.charAt(0).toUpperCase() + said.slice(1)
}

// Listens and types into the field as the seller talks. Returns what was said.
async function dictate(t: Target, id: number, append = false): Promise<string> {
  heardText.value = ''
  const base = t.kind === 'input' ? t.el.value : ''
  const write = (said: string, final: boolean) => {
    if (t.kind !== 'input') return
    const isWhole = t.el instanceof HTMLInputElement && (t.el.type === 'date' || t.el.type === 'range')
    if (!final && isWhole) return
    if (!said || voiceCommand(said)) return setNativeValue(t.el, base)
    const shaped = shapeFor(t, said)
    if (shaped === null) return final ? setNativeValue(t.el, base) : undefined
    setNativeValue(t.el, append && base ? `${base} ${shaped}` : shaped)
  }
  const said = await voice.listen({
    endSilenceMs: t.kind === 'choice' ? 1200 : 1700,
    onInterim: (text) => {
      if (!alive(id)) return
      heardText.value = text
      if (t.kind === 'input' && !t.addOnEnter) write(text, false)
    },
  })
  if (!alive(id)) return ''
  heardText.value = said
  if (t.kind === 'input') {
    if (t.addOnEnter && said && !voiceCommand(said)) {
      // A list of names: "John Smith and Jane Smith" adds both
      const names = said.split(/\s+and\s+/i).filter((n) => n.trim().split(/\s+/).length >= 2)
      // One at a time, so each add sees the list the last one left
      for (const name of names.length > 1 ? names : [said]) {
        setNativeValue(t.el, name.trim().replace(/\b\w/g, (c) => c.toUpperCase()))
        pressEnter(t.el)
        await nextTick()
        await new Promise((r) => setTimeout(r, 60))
      }
    } else {
      write(said, true)
    }
  }
  return said
}

const orList = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`

type Outcome = 'next' | 'skip' | 'back' | 'stop' | 'save'

// A short acknowledgement UMU says before its next prompt, so each answer
// feels heard: "Got it, Freehold." or "Thanks."
let ack = ''
const ACKS = ['Got it.', 'Thanks.', 'Lovely.', 'Great.']
let ackIndex = 0
const nextAck = () => ACKS[ackIndex++ % ACKS.length]
function takeAck() {
  const a = ack
  ack = ''
  return a
}

async function askTarget(t: Target, id: number, first: boolean): Promise<Outcome> {
  setTarget(t)
  const optionLabels = t.kind === 'choice' ? t.options.slice(0, 7).map((o) => o.label) : []
  askingLabel.value =
    t.kind === 'choice'
      ? t.label ? `${t.label}?` : `You can say ${orList(optionLabels)}`
      : `Tell me the ${t.label}`
  // UMU has just asked the question, so a box that is the question itself
  // only needs a nudge rather than the same words again
  const sameAsQuestion = t.label.toLowerCase() === cleanLabel(sayText.value).toLowerCase()
  const spokenLabel = t.label.charAt(0).toLowerCase() + t.label.slice(1)
  const prompt =
    t.kind === 'choice'
      ? joinSay(t.label && !sameAsQuestion ? `${t.label}?` : '', `You can say ${orList(optionLabels)}`)
      : t.el instanceof HTMLInputElement && t.el.type === 'range'
        ? `${t.label}? Say a number from ${t.el.min || 0} to ${t.el.max || 10}.`
        : first && sameAsQuestion
          ? 'Go ahead, I am listening.'
          : `${first ? 'Tell' : 'Next, tell'} me the ${spokenLabel}.`
  await say(joinSay(takeAck(), prompt), id)

  for (let attempt = 0; attempt < 3; attempt++) {
    if (!alive(id)) return 'stop'
    const said = await dictate(t, id)
    if (!alive(id)) return 'stop'
    const cmd = voiceCommand(said)
    if (cmd === 'back') return 'back'
    if (cmd === 'skipQuestion') return 'skip'
    if (cmd === 'skip') return 'next'
    if (cmd === 'stop') return 'stop'
    if (cmd === 'save') return 'save'
    if (cmd === 'repeat') {
      await say(prompt, id)
      continue
    }
    if (!said) {
      if (attempt === 0) {
        await say("Take your time. Just tell me when you're ready, or type it in.", id)
        continue
      }
      return 'next'
    }
    if (t.kind === 'choice') {
      const opt = matchOption([said, ...voice.alternatives.value], t.options)
      if (opt) {
        opt.el.click()
        ack = `Got it, ${opt.label.trim()}.`
        return 'next'
      }
      // Chips that take your own words: add what was said as a new chip
      const own = t.el.closest('.part-section')?.querySelector<HTMLInputElement>('.voice-input-field')
      if (own) {
        setNativeValue(own, said.charAt(0).toUpperCase() + said.slice(1))
        own.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        ack = 'Added.'
        return 'next'
      }
      await say(`Sorry, I didn't catch that. You can say ${orList(optionLabels)}.`, id)
      continue
    }
    if (t.el instanceof HTMLInputElement && t.el.type === 'date' && !t.el.value) {
      await say('Sorry, I need a date, like the thirty first of March twenty twenty five.', id)
      continue
    }
    ack = nextAck()
    return 'next'
  }
  return 'next'
}

async function runVoiceAnswer(id: number) {
  const q: any = current.value
  if (!q || !alive(id)) return
  voiceNote.value = ''
  const type = qType.value

  // Notes: UMU reads them out, then waits for "done"
  if (noteBlocks.value.length) {
    askingLabel.value = 'Reading the notes to you'
    const text = noteBlocks.value
      .map((b: any) => (b.type === 'bullets' ? (b.items || []).map((x: any) => `${x.bold || ''}${x.text || ''}`).join('. ') : b.text))
      .join('. ')
    await say(text, id)
    if (!alive(id)) return
    askingLabel.value = "Say done, or tap I've read this"
    await say("That's everything. Say done, or tap I've read this.", id)
    const said = await dictate({ kind: 'choice', el: answerEl.value!, label: '', options: [] }, id)
    if (!alive(id)) return
    const cmd = voiceCommand(said)
    if (cmd === 'save') return saveCurrent(true)
    if (cmd === 'skip' || cmd === 'skipQuestion') return skipQuestion()
    if (cmd === 'stop') return stopVoiceMode()
    return
  }

  if (type === 'note' || type === 'upload' || type === 'boundary') {
    askingLabel.value = 'This step needs a tap on the screen'
    await say('This step needs a tap on the screen. ' + guide.value.tip, id)
    return
  }

  // Council tax band and other letter scales have no box to type into
  if (type === 'scale' && String(q.scaleType || '').toLowerCase() === 'alphabet') {
    askingLabel.value = 'Say the letter, like band C'
    for (let attempt = 0; attempt < 2 && alive(id); attempt++) {
      const said = await dictate({ kind: 'choice', el: answerEl.value!, label: '', options: [] }, id)
      if (!alive(id)) return
      const cmd = voiceCommand(said)
      if (cmd === 'skip' || cmd === 'skipQuestion') return skipQuestion()
      if (cmd === 'stop') return stopVoiceMode()
      if (cmd === 'back') return goBack()
      if (cmd === 'repeat') return presentQuestion()
      if (cmd === 'save' && q.answer) return saveCurrent()
      const letter = [said, ...voice.alternatives.value].map(spokenLetter).find(Boolean) || null
      if (letter) {
        q.answer = letter
        componentRev.value++
        ack = `Got it, band ${letter}.`
        break
      }
      await say("Sorry, I didn't catch the letter. Please say it again, like band C.", id)
    }
    return finishByVoice(q.id, id)
  }

  await nextTick()
  const targets = collectTargets().filter((t) => !isFilled(t))
  // Everything here is answered already: say what's set and let the seller
  // change a choice, or keep it
  if (!targets.length) {
    const choices = collectTargets().filter((t) => t.kind === 'choice') as ChoiceTarget[]
    for (const t of choices) {
      if (!alive(id) || current.value?.id !== q.id) return
      const picked = t.options.filter((o) => o.el.classList.contains('selected')).map((o) => o.label)
      setTarget(t)
      askingLabel.value = 'Say a different answer to change it, or say save'
      await say(
        joinSay(
          t.label && t.label.toLowerCase() !== cleanLabel(sayText.value).toLowerCase() ? `${t.label}?` : '',
          `This is set to ${orList(picked)}`,
          'Say a different answer to change it, or say save to keep it',
        ),
        id,
      )
      const said = await dictate(t, id)
      if (!alive(id) || current.value?.id !== q.id) return
      const cmd = voiceCommand(said)
      if (cmd === 'save') return saveCurrent()
      if (cmd === 'back') return goBack()
      if (cmd === 'skip' || cmd === 'skipQuestion') return skipQuestion()
      if (cmd === 'stop') return stopVoiceMode()
      const opt = matchOption([said, ...voice.alternatives.value], t.options)
      if (opt && !opt.el.classList.contains('selected')) {
        // A chips list keeps several, so swap the old choice for the new one
        // (one tap at a time, so each sees the answer the last one left)
        if (t.el.classList.contains('chips-wrap')) {
          for (const o of t.options.filter((x) => x.el.classList.contains('selected'))) {
            o.el.click()
            await nextTick()
            await new Promise((r) => setTimeout(r, 60))
          }
        }
        opt.el.click()
        ack = `Changed to ${opt.label.trim()}.`
      }
      if (current.value?.id !== q.id) return
    }
    return finishByVoice(q.id, id)
  }
  let first = true
  for (const t of targets) {
    if (!alive(id) || current.value?.id !== q.id) return
    if (isFilled(t) || !document.contains(t.el)) continue
    const outcome = await askTarget(t, id, first)
    first = false
    if (!alive(id)) return
    if (outcome === 'stop') return stopVoiceMode()
    if (outcome === 'back') return goBack()
    if (outcome === 'skip') return skipQuestion()
    if (outcome === 'save') break
    // A radio answer saves straight away and moves on
    if (current.value?.id !== q.id) return
    await nextTick()
  }
  // Answers can reveal more boxes (a "Yes" opens a follow-up); ask those too
  const more = collectTargets().filter((t) => !isFilled(t) && !targets.some((x) => x.el === t.el))
  if (more.length && alive(id) && current.value?.id === q.id) {
    for (const t of more) {
      const outcome = await askTarget(t, id, false)
      if (!alive(id) || current.value?.id !== q.id) return
      if (outcome === 'stop') return stopVoiceMode()
      if (outcome === 'back') return goBack()
      if (outcome === 'skip') return skipQuestion()
      if (outcome === 'save') break
    }
  }
  if (!alive(id) || current.value?.id !== q.id) return
  finishByVoice(q.id, id)
}

async function finishByVoice(qid: string, id: number) {
  clearTarget()
  askingLabel.value = ''
  if (!alive(id) || current.value?.id !== qid) return
  if (!needsSaveButton.value) return
  if (answerValid.value) {
    askingLabel.value = 'Say save, or tap Save and continue'
    await say(joinSay(takeAck(), 'Check your answer, then say save, or tap Save and continue.'), id)
  } else {
    askingLabel.value = 'Some boxes still need an answer'
    await say(joinSay(takeAck(), 'Some boxes still need an answer. Tap them to fill them in, or say skip question.'), id)
  }
  for (let attempt = 0; attempt < 2 && alive(id); attempt++) {
    const said = await dictate({ kind: 'choice', el: answerEl.value!, label: '', options: [] }, id)
    if (!alive(id) || current.value?.id !== qid) return
    const cmd = voiceCommand(said)
    if (cmd === 'save') {
      if (answerValid.value) return saveCurrent()
      await say('Not quite yet. A box still needs an answer.', id)
    } else if (cmd === 'skip' || cmd === 'skipQuestion') {
      return skipQuestion()
    } else if (cmd === 'back') {
      return goBack()
    } else if (cmd === 'repeat') {
      return presentQuestion()
    } else if (cmd === 'stop') {
      return stopVoiceMode()
    } else if (!said) {
      break
    }
  }
  heardText.value = ''
}

// ── Answering ────────────────────────────────────────────────────────
const skipped = reactive(new Set<string>())
const { getGuidanceAndPathway, advanceJourney, deferJourney } = usePathways()
const { checkForCelebrations } = usePassportAchievement()

async function onUpdate(answer: any) {
  const q: any = current.value
  if (!q) return
  q.answer = answer

  // Notes complete when they are opened and closed
  if (qType.value === 'note' && answer === true) return saveCurrent(true)

  // Radio saves on selection
  if (qType.value === 'radio') return saveCurrent(answer)

  // Some multipart questions save as soon as a trigger part is answered
  if (qType.value === 'multipart' && q.autoSaveOn && answer && typeof answer === 'object') {
    const { partKey, value } = q.autoSaveOn
    const raw = answer[partKey]
    let trigger = raw !== null && typeof raw === 'object' && 'value' in raw ? raw.value : raw
    if (trigger === undefined) {
      const firstRadio = q.parts?.find((p: any) => p.type?.toLowerCase() === 'radio')
      if (firstRadio) trigger = answer[firstRadio.partKey]
    }
    if (value === '*' || trigger === value) return saveCurrent(answer)
  }
}

async function saveCurrent(value?: any) {
  const q: any = current.value
  if (!q || saving.value) return
  let answer = value !== undefined ? value : q.answer
  if (q.additionalInfoType && additionalInfoAnswer.value) {
    answer = { mainAnswer: answer, additionalInfo: additionalInfoAnswer.value }
  }
  saving.value = true
  saveError.value = ''
  voice.stopAll()
  clearTarget()
  try {
    const { pointsAwarded } = await rt.saveAnswer(q.id, answer)
    skipped.delete(q.id)
    addPoints(pointsAwarded)
    savedPrefix = pointsAwarded ? `Saved, plus ${pointsAwarded} points.` : 'Saved.'
    await checkPathwayThenFinish(q, value !== undefined ? value : q.answer)
  } catch {
    saveError.value = "That didn't save. Please try again."
  } finally {
    saving.value = false
  }
}

// After a save, an answer can open a guided follow-up (manual page rule).
let pendingAfterPathway: any = null
const activePathway = ref<any>(null)
const pathwayAttempt = ref(0)

async function checkPathwayThenFinish(q: any, answerForGuidance: any) {
  try {
    const value = typeof answerForGuidance === 'string' ? answerForGuidance : JSON.stringify(answerForGuidance)
    const { journey, pathway } = await getGuidanceAndPathway(q.id, value)
    if (journey && pathway) {
      activePathway.value = { pathway, journey }
      pendingAfterPathway = q
      phase.value = 'pathway'
      return
    }
  } catch {
    // pathway lookup is non-blocking
  }
  await finishAfterSave(q)
}

const pathwayVisibleSteps = computed(() => {
  if (!activePathway.value) return []
  const { journey } = activePathway.value
  const steps = journey.stepAnswers.map((a: any) => ({
    stepId: a.stepId,
    answerLabel: a.answerLabel,
    evidenceFileUrls: a.evidenceFileUrls,
  }))
  if (journey.status === 'IN_PROGRESS') {
    steps.push({ stepId: journey.currentStepId, answerLabel: '', evidenceFileUrls: [] })
  }
  return steps
})

async function onPathwayAnswer(payload: any) {
  if (!activePathway.value) return
  try {
    const journey = await advanceJourney(
      passportId.value,
      activePathway.value.journey.id,
      payload.stepId,
      payload.answerLabel,
      payload.evidenceFileUrls,
    )
    activePathway.value = { pathway: activePathway.value.pathway, journey }
  } catch {
    pathwayAttempt.value++
  }
}

async function onPathwayDefer() {
  if (!activePathway.value) return
  try {
    await deferJourney(passportId.value, activePathway.value.journey.id)
  } catch {
    // carry on regardless
  } finally {
    await continueAfterPathway()
  }
}

async function continueAfterPathway() {
  activePathway.value = null
  const q = pendingAfterPathway
  pendingAfterPathway = null
  phase.value = 'question'
  if (q) await finishAfterSave(q)
}

// Section celebration, with the real bonus points from the backend
const showSectionComplete = ref(false)
const sectionBonusPoints = ref(0)
const totalPointsBefore = ref(0)
const totalPointsAfter = ref(0)

async function finishAfterSave(q: any) {
  const result = await completeTaskIfDone(q._taskId)
  if (result?.sectionCompleted) {
    sectionBonusPoints.value = result.sectionBonusPoints ?? 0
    const after = result.balanceAfterBonus ?? balance.value + sectionBonusPoints.value
    totalPointsAfter.value = after
    totalPointsBefore.value = Math.max(0, after - sectionBonusPoints.value)
    countUp(balance.value, after, 1200)
    balance.value = after
    setPose('celebrate', 4000)
    voice.speak(`Brilliant! Your ${sectionTitle.value} is complete.`)
    showSectionComplete.value = true
    return
  }
  goToNextQuestion(q.id)
}

function afterCelebration() {
  showSectionComplete.value = false
  savedPrefix = ''
  phase.value = 'done'
}

// Marks the task complete once all its questions are answered, as the
// manual page does, so section progress, points and stamps stay in step.
async function completeTaskIfDone(taskId: string): Promise<any> {
  if (!taskId) return null
  const taskQs = questions.value.filter((x: any) => x._taskId === taskId)
  if (!taskQs.length || !taskQs.every((x: any) => x.completed)) return null
  try {
    const result = await rt.completeTask(taskId)
    if (!result?.sectionCompleted) setTimeout(() => checkForCelebrations(), 800)
    return result
  } catch {
    return null
  }
}

// "Go back": the question before this one
function goBack() {
  const i = rt.currentQuestionIndex.value
  if (i <= 0) return presentQuestion()
  activePathway.value = null
  phase.value = 'question'
  rt.currentQuestionIndex.value = i - 1
  talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

function skipQuestion() {
  const q: any = current.value
  if (!q) return
  skipped.add(q.id)
  savedPrefix = ''
  goToNextQuestion(q.id)
}

// Next unanswered question after this one, wrapping round. Skipped ones
// come back once everything else is done.
function goToNextQuestion(fromId: string) {
  const list = questions.value as any[]
  const from = list.findIndex((x) => x.id === fromId)
  // Review mode: simply the next question in order; done after the last
  if (REVIEW_ALL) {
    if (from < 0 || from >= list.length - 1) {
      phase.value = 'done'
      return
    }
    phase.value = 'question'
    rt.currentQuestionIndex.value = from + 1
    talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const order = [...list.slice(from + 1), ...list.slice(0, from + 1)]
  const open = order.filter((x) => !x.completed)
  if (!open.length) {
    phase.value = 'done'
    return
  }
  let next = open.find((x) => !skipped.has(x.id))
  if (!next) {
    skipped.clear()
    next = open.find((x) => x.id !== fromId) || open[0]
  }
  phase.value = 'question'
  const index = list.indexOf(next)
  if (rt.currentQuestionIndex.value === index) presentQuestion()
  else rt.currentQuestionIndex.value = index
  talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeUnmount(() => {
  cancelFlow()
  if (poseTimer) clearTimeout(poseTimer)
  if (pointsTimer) clearTimeout(pointsTimer)
})
</script>

<style scoped>
/* ── Web canvas ───────────────────────────────────────────────────── */
.ua-page {
  --ua-navy: #0e2840;
  --ua-cyan: #3ee6e0;
  --ua-teal: #00a19a;
  --ua-teal-dark: #00857f;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  color: #231d45;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ── Web nav (shared passport pattern) ────────────────────────────── */
.hsw-shell { width: min(1180px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 2; }
.hsw-nav {
  position: sticky; top: 0; z-index: 40;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 10px; color: #0d1835; cursor: pointer; font-size: 20px; font-weight: 800; flex-shrink: 0; font-family: inherit; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
.hsw-brand-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.hsw-links { display: flex; gap: 6px; }
.hsw-links button { border: 0; background: transparent; color: #475a7b; cursor: pointer; font-size: 14px; font-weight: 700; padding: 10px 14px; border-radius: 10px; white-space: nowrap; font-family: inherit; transition: background 0.18s, color 0.18s; }
.hsw-links button:hover { color: #0c2342; background: rgba(0, 161, 154, 0.08); }
.hsw-links button.active { color: #00857f; background: rgba(0, 161, 154, 0.1); box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24); }
.hsw-actions { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.hsw-back { display: inline-flex; align-items: center; gap: 6px; height: 42px; padding: 0 14px; border-radius: 10px; border: 1px solid #d8e3ee; background: #fff; color: #0c2342; font-family: inherit; font-size: 14px; font-weight: 700; cursor: pointer; transition: border-color 0.18s, background 0.18s; }
.hsw-back:hover { border-color: #bfd1e4; background: #f8fbff; }
.hsw-back svg { width: 15px; height: 15px; }

/* ── Stage ────────────────────────────────────────────────────────── */
.ua-main {
  flex: 1 0 auto;
  width: min(1180px, calc(100% - 48px));
  margin: 20px auto 40px;
}
.ua-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 66px - 40px);
  min-height: 680px;
  max-height: 960px;
  padding: 20px 24px 24px;
  border-radius: 28px;
  color: #fff;
  background: linear-gradient(180deg, #0f2c4a 0%, #0a1f38 100%);
  box-shadow: 0 18px 44px rgba(14, 40, 64, 0.22);
  overflow: hidden;
}

/* Top bar */
.ua-top {
  display: grid;
  grid-template-columns: 130px 1fr 130px;
  align-items: center;
  gap: 12px;
}
.ua-top-mid { text-align: center; min-width: 0; }
.ua-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.ua-top-sub {
  margin: 2px 0 0;
  font-size: 12.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.62);
}
.ua-round {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.ua-round:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.4); }
.ua-top-end { display: flex; justify-content: flex-end; }
.ua-points {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 14px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  transition: border-color 0.2s ease;
}
.ua-points.is-pop { border-color: #fde68a; }
.ua-points-ic { width: 16px; height: 16px; color: #fde68a; }
.ua-points-plus {
  position: absolute;
  right: 6px;
  top: -24px;
  padding: 2px 9px;
  border-radius: 999px;
  background: #fde68a;
  color: #78350f;
  font-size: 12px;
  font-weight: 800;
}
.ua-pop-enter-active { transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.34, 1.6, 0.64, 1); }
.ua-pop-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.ua-pop-enter-from { opacity: 0; transform: translateY(8px) scale(0.8); }
.ua-pop-leave-to { opacity: 0; transform: translateY(-10px); }

/* Question tracker */
.ua-track {
  display: flex;
  gap: 5px;
  margin-top: 16px;
}
.ua-seg {
  flex: 1 1 0;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  cursor: pointer;
  transition: background 0.3s ease, transform 0.15s ease;
}
.ua-seg:hover { transform: scaleY(1.5); }
.ua-seg--done { background: var(--ua-teal); }
.ua-seg--skipped { background: #f5c26b; }
.ua-seg--current {
  background: var(--ua-cyan);
  animation: ua-seg-pulse 1.6s ease-in-out infinite;
}
.ua-seg--ghost { cursor: default; }
.ua-seg:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

/* Two full-height panels, no empty space */
.ua-body {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
  gap: 18px;
  margin-top: 16px;
}

/* ── UMU panel ── */
.ua-left {
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 14px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.ua-duo {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* Live captions in a speech bubble above the robot */
.ua-caption {
  position: relative;
  flex-shrink: 0;
  min-height: 92px;
  padding: 12px 16px 14px;
  border-radius: 20px;
  background: #fff;
  color: var(--ua-navy);
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}
.ua-caption::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -9px;
  width: 18px;
  height: 18px;
  margin-left: -9px;
  background: #fff;
  border-radius: 3px;
  transform: rotate(45deg);
}
.ua-caption.is-you { border-color: var(--ua-teal); }
.ua-caption-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}
.ua-caption-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap;
}
.ua-caption-status .ua-status-dot { background: #cbd5e1; }
.ua-voice-btn {
  width: 26px;
  height: 26px;
  margin-left: 2px;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  cursor: pointer;
}
.ua-voice-btn:hover { border-color: #94a3b8; color: var(--ua-navy); }
.ua-voice-btn :deep(svg),
.ua-voice-btn > span { width: 14px; height: 14px; }

/* Voice settings panel */
.ua-left { position: relative; }
.ua-voice-panel {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  z-index: 10;
  padding: 16px;
  border-radius: 18px;
  background: #fff;
  color: var(--ua-navy);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
}
.ua-vp-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.ua-vp-title { margin: 0; font-size: 14px; font-weight: 800; }
.ua-vp-close {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}
.ua-vp-close:hover { background: #f1f5f9; }
.ua-vp-list { display: flex; flex-direction: column; gap: 6px; max-height: 210px; overflow-y: auto; }
.ua-vp-voice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 42px;
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  text-align: left;
  cursor: pointer;
}
.ua-vp-voice:hover { border-color: #94a3b8; }
.ua-vp-voice.is-on { border-color: var(--ua-teal); background: #f0fdfa; }
.ua-vp-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ua-vp-tag {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--ua-teal);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}
.ua-vp-lang { flex-shrink: 0; font-size: 11.5px; font-weight: 700; color: #94a3b8; }
.ua-vp-rate {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}
.ua-vp-rate input { flex: 1; accent-color: var(--ua-teal); }
.ua-vp-play {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
  height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 10px;
  background: var(--ua-navy);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.ua-caption-status .ua-status-dot.is-speak,
.ua-caption-status .ua-status-dot.is-on { background: var(--ua-teal); }
.ua-caption-who {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ua-teal-dark);
}
.ua-caption-who :deep(svg),
.ua-caption-who > span { width: 15px; height: 15px; }
.ua-caption-text {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  font-weight: 650;
}
.ua-w { color: #a3afbf; transition: color 0.18s ease; }
.ua-w.is-said { color: var(--ua-navy); }
.ua-caption-wait { color: #64748b; }
.ua-bars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 16px;
  margin-left: 8px;
  vertical-align: middle;
}
.ua-bars.is-live i {
  animation: none;
  transition: height 0.08s linear;
}
.ua-bars i {
  display: block;
  width: 3px;
  height: 5px;
  border-radius: 3px;
  background: var(--ua-teal);
  animation: ua-bar 0.8s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.13s);
}
.ua-hear {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: var(--ua-navy);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

/* The robot takes every pixel left between captions and controls */
.ua-bot {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 16px;
}
.ua-bot :deep(.umb) {
  width: auto;
  height: 100%;
  max-width: 100%;
  max-height: 480px;
}

/* Voice console */
.ua-console {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding-top: 8px;
}
.ua-cbtn {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 19px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}
.ua-cbtn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.36); }
.ua-cbtn:disabled { opacity: 0.4; cursor: default; }
.ua-mic-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.ua-mic {
  position: relative;
  width: 70px;
  height: 70px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 3px solid var(--ua-cyan);
  background: #0c2544;
  color: var(--ua-cyan);
  font-size: 28px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}
.ua-mic:hover:not(:disabled) { transform: scale(1.05); }
.ua-mic:disabled { opacity: 0.4; cursor: default; }
.ua-mic.is-on { background: var(--ua-cyan); color: var(--ua-navy); }
.ua-mic.is-hearing::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 3px solid var(--ua-cyan);
  animation: ua-ping 1.3s ease-out infinite;
}
.ua-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
}
.ua-status-dot.is-speak { background: var(--ua-cyan); animation: ua-blink 0.9s ease-in-out infinite; }
.ua-status-dot.is-listen { background: #fb7185; animation: ua-blink 0.7s ease-in-out infinite; }
.ua-status-dot.is-on { background: var(--ua-cyan); }

/* ── Question sheet ── */
.ua-sheet {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #fff;
  color: #231d45;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.24);
  overflow: hidden;
}
.ua-sheet-head {
  flex-shrink: 0;
  padding: 22px 26px 18px;
  border-bottom: 1px solid #eef2f6;
}
.ua-sheet-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 24px;
  margin-bottom: 8px;
}
.ua-kicker {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ua-teal-dark);
}
.ua-qnum {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f1f5f9;
  font-size: 12px;
  font-weight: 800;
  color: #475569;
  white-space: nowrap;
}
.ua-q {
  margin: 0;
  font-size: 23px;
  line-height: 1.32;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ua-navy);
}
.ua-hint {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: #475569;
}
.ua-tip {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 10px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: #334155;
}
.ua-tip-ic { width: 17px; height: 17px; flex-shrink: 0; margin-top: 1px; color: #d97706; }
.ua-say-enter-active,
.ua-say-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.ua-say-enter-from { opacity: 0; transform: translateY(8px); }
.ua-say-leave-to { opacity: 0; transform: translateY(-4px); }

.ua-sheet-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 26px 22px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

/* Inside the answer: roomier boxes and a clear focus */
.ua-answer :deep(.text-input),
.ua-answer :deep(.text-field),
.ua-answer :deep(textarea) {
  min-height: 52px;
  border-radius: 14px;
  font-size: 15.5px;
}
.ua-answer :deep(input:focus),
.ua-answer :deep(textarea:focus) {
  border-color: var(--ua-teal) !important;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.16) !important;
  outline: none;
}
/* The box or choice UMU is asking about right now */
.ua-answer :deep(.ua-voice-target) {
  border-color: var(--ua-teal) !important;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.22) !important;
  background-color: #fff !important;
}
.ua-answer :deep(.radio-options.ua-voice-target),
.ua-answer :deep(.chips-wrap.ua-voice-target) {
  border-radius: 16px;
  outline: 3px solid rgba(0, 161, 154, 0.35);
  outline-offset: 6px;
  box-shadow: none !important;
}
.ua-answer :deep(.ua-dup-title) { display: none; }
/* Sub-questions inside a multipart answer sit under the sheet's title */
.ua-answer :deep(.part-text) {
  font-size: 17px;
  line-height: 1.35;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--ua-navy);
}
/* Notes to read, laid out like a short article */
.ua-notes { max-width: 640px; }
.ua-notes-h {
  margin: 18px 0 6px;
  font-size: 15.5px;
  font-weight: 800;
  color: var(--ua-navy);
}
.ua-notes-h:first-child { margin-top: 0; }
.ua-notes-p {
  margin: 0 0 10px;
  font-size: 15px;
  line-height: 1.65;
  color: #334155;
}
.ua-notes-p.is-bold { font-weight: 700; color: var(--ua-navy); }
.ua-notes-list {
  margin: 0 0 10px;
  padding-left: 20px;
  font-size: 15px;
  line-height: 1.65;
  color: #334155;
}
.ua-notes-callout {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 14px 0 0;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #cdeeea;
  font-size: 14px;
  font-weight: 700;
  color: #035e59;
}
.ua-notes-callout-ic { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; }
.ua-extra {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px dashed #dbe3ec;
}
.ua-extra-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}
.ua-note {
  margin: 14px 0 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f1f5f9;
  font-size: 13.5px;
  color: #334155;
}
.ua-error { margin: 12px 0 0; font-size: 13.5px; font-weight: 700; color: #b42318; }

.ua-pathway-flow { display: flex; flex-direction: column; gap: 12px; }
.ua-msg-enter-active { transition: opacity 0.22s ease-out, transform 0.22s ease-out; }
.ua-msg-enter-from { opacity: 0; transform: translateY(8px); }

.ua-done {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 0;
  text-align: center;
}
.ua-done-ic { width: 64px; height: 64px; color: var(--ua-teal); }
.ua-done-ic--muted { color: #94a3b8; }
.ua-done-title { margin: 4px 0 0; font-size: 22px; font-weight: 800; color: var(--ua-navy); }
.ua-done-text { margin: 0 0 8px; max-width: 360px; font-size: 14.5px; line-height: 1.55; color: #475569; }

.ua-skeleton { display: flex; flex-direction: column; gap: 14px; }
.ua-skeleton span {
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
  background-size: 200% 100%;
  animation: ua-shimmer 1.4s linear infinite;
}
.ua-skeleton span:first-child { width: 60%; height: 20px; }

.ua-sheet-foot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 18px 14px 26px;
  border-top: 1px solid #eef2f6;
  background: #fbfcfd;
}
.ua-foot-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}
.ua-foot-status span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ua-foot-status.is-asking { color: #035e59; }
.ua-foot-ic { width: 17px; height: 17px; flex-shrink: 0; }
.ua-foot-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.ua-skip {
  height: 46px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #475569;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.ua-skip:hover { background: #f1f5f9; color: var(--ua-navy); }
.ua-save {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  border: 0;
  border-radius: 12px;
  background: var(--ua-teal);
  color: #fff;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;
}
.ua-save:hover:not(:disabled) { background: var(--ua-teal-dark); }
.ua-save:disabled { opacity: 0.45; cursor: default; }
.ua-spin { animation: ua-spin 0.9s linear infinite; }

.ua-round:focus-visible,
.ua-cbtn:focus-visible,
.ua-mic:focus-visible,
.ua-skip:focus-visible,
.ua-save:focus-visible,
.ua-hear:focus-visible {
  outline: 3px solid var(--ua-cyan);
  outline-offset: 3px;
}

@keyframes ua-ping { from { transform: scale(1); opacity: 0.9; } to { transform: scale(1.4); opacity: 0; } }
@keyframes ua-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@keyframes ua-spin { to { transform: rotate(360deg); } }
@keyframes ua-bar { 0%, 100% { height: 5px; } 50% { height: 16px; } }
@keyframes ua-seg-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@keyframes ua-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

@media (prefers-reduced-motion: reduce) {
  .ua-mic.is-hearing::after,
  .ua-status-dot,
  .ua-spin,
  .ua-bars i,
  .ua-seg--current,
  .ua-skeleton span { animation: none; }
  .ua-say-enter-active,
  .ua-say-leave-active { transition: opacity 0.15s linear; }
  .ua-say-enter-from,
  .ua-say-leave-to { transform: none; }
}

/* ── Tablet and phone ─────────────────────────────────────────────── */
@media (max-width: 899px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 58px; }
  .ua-main { width: calc(100% - 32px); margin: 16px auto 32px; }
  .ua-stage {
    height: auto;
    max-height: none;
    min-height: 0;
    padding: 18px 20px 0;
    overflow: visible;
  }
  .ua-top { grid-template-columns: 44px 1fr auto; }
  .ua-body { display: flex; flex-direction: column; gap: 14px; }
  .ua-left { display: contents; }
  /* Robot and captions side by side */
  .ua-duo {
    flex-direction: row-reverse;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
  }
  .ua-caption { flex: 1; min-height: 0; }
  .ua-caption::after { left: -8px; bottom: auto; top: 50%; margin: -9px 0 0; }
  .ua-bot { flex: 0 0 auto; width: 132px; height: auto; padding: 0; }
  .ua-bot :deep(.umb) { width: 100%; height: auto; }
  .ua-sheet { overflow: visible; }
  .ua-sheet-body { overflow: visible; }
  .ua-sheet-foot { border-radius: 0 0 24px 24px; }
  /* The voice console stays at hand at the bottom of the screen */
  .ua-console {
    position: sticky;
    bottom: 0;
    z-index: 5;
    order: 3;
    margin: 0 -20px;
    padding: 10px 20px calc(10px + env(safe-area-inset-bottom));
    background: #0a1f38;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0 0 28px 28px;
  }
}

/* Phone: the stage is the whole screen under the nav, like the app */
@media (max-width: 640px) {
  .hsw-shell { width: calc(100% - 24px); }
  .ua-main { width: 100%; margin: 0; }
  .ua-stage {
    min-height: 0;
    padding: 14px 12px 0;
    border-radius: 0;
    box-shadow: none;
  }
  .ua-top { gap: 8px; }
  .ua-round { width: 40px; height: 40px; font-size: 18px; }
  .ua-title { font-size: 15px; }
  .ua-top-sub { font-size: 12px; }
  .ua-points { height: 32px; padding: 0 10px; font-size: 13px; }
  .ua-bot { width: 104px; }
  .ua-caption { padding: 12px 13px; }
  .ua-caption-text { font-size: 14.5px; }
  .ua-sheet { border-radius: 20px; }
  .ua-sheet-foot { border-radius: 0 0 20px 20px; }
  .ua-sheet-head { padding: 18px 16px 14px; }
  .ua-q { font-size: 19px; }
  .ua-sheet-body { padding: 16px; }
  .ua-sheet-foot { flex-direction: column; align-items: stretch; padding: 12px 16px 16px; }
  .ua-foot-status span { white-space: normal; }
  .ua-foot-actions > * { flex: 1; }
  .ua-console { margin: 0 -12px; gap: 18px; border-radius: 0; }
  .ua-mic { width: 64px; height: 64px; font-size: 26px; }
  .ua-cbtn { width: 44px; height: 44px; }
}

/* Phones: Back shrinks to its arrow, as on the other passport pages */
@media (max-width: 520px) {
  .hsw-back { width: 42px; padding: 0; gap: 0; justify-content: center; font-size: 0; }
}
@media (max-width: 380px) {
  .hsw-brand-beta { display: none; }
  .hsw-nav-inner { gap: 10px; }
  .ua-title { font-size: 14px; }
  .ua-bot { width: 88px; }
}

/* ── Big screens ──────────────────────────────────────────────────────
   Scale with the window width (--wide-zoom = width / 1366, set in
   nuxt.config.ts) so a desktop monitor shows this exactly as a 1366px
   laptop does, only bigger. Zoom multiplies vh/dvh too, so the stage
   height divides the zoom back out. Nothing changes at 1366px or below. */
@media (min-width: 1367px) {
  .hsw-shell,
  .ua-main { zoom: var(--wide-zoom, 1); }
  .ua-stage { height: calc(100dvh / var(--wide-zoom, 1) - 66px - 40px); }
}
</style>
