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
            <!-- On a phone the title and the line under it stay one line each:
                 "Building your" and the section name (shown in the route just
                 below) step aside there -->
            <h1 class="ua-title"><span class="ua-title-lead">Building your </span>Seller Passport</h1>
            <p class="ua-top-sub" :class="{ 'has-count': questions.length }">
              <span class="ua-top-section">{{ sectionTitle || 'Your passport' }}</span><template v-if="questions.length"><span class="ua-top-sep"> · </span>{{ answeredCount }} of {{ questions.length }} answered</template>
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

        <!-- Sections UMU can help with, as a route: the one open now in the
             middle, Next and Then ahead of it, earlier ones behind. "See
             all" shows every section in the same row, so any section can be
             picked in any order. -->
        <UmuSectionRail
          v-if="sectionChoices.length > 1"
          class="ua-rail"
          :sections="sectionChoices"
          :current-id="sectionId"
          :disabled="saving || phase === 'loading'"
          @pick="switchSection"
        />

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
                    <span class="ua-who-name">{{ voice.listening.value ? 'You' : 'UMU' }}</span>
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
                <p v-else ref="captionTextEl" class="ua-caption-text" :class="{ 'is-scrolled': captionScrolled }">
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
                    <span class="ua-vp-name">{{ v.label }}</span>
                    <span v-if="v.recommended" class="ua-vp-tag">Recommended</span>
                    <span v-else class="ua-vp-lang">{{ v.note }}</span>
                  </button>
                </div>
                <label class="ua-vp-rate">
                  <span>Speed</span>
                  <input
                    type="range"
                    :min="MIN_UMU_RATE"
                    :max="MAX_UMU_RATE"
                    :step="UMU_RATE_STEP"
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
                  :aria-label="canCutIn ? 'Answer now' : voiceMode ? 'Stop answering by voice' : 'Answer by voice'"
                  :disabled="phase !== 'question'"
                  @click="toggleVoice"
                >
                  <Icon :name="voiceMode && !canCutIn ? 'i-lucide-square' : 'i-lucide-mic'" />
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
                <h2 :key="sayKey" class="ua-q" :class="{ 'is-long': sayText.length > 130 }">{{ sayText }}</h2>
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
                @input="onAnswerInput"
                @change="scheduleGuide"
                @click="scheduleGuide"
                @keyup.enter="scheduleGuide"
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

                <!-- What the question means, from the passport's own help
                     text (multipart questions show theirs in each part) -->
                <div v-if="helpBlock" class="ua-help">
                  <Icon name="i-lucide-lightbulb" class="ua-help-ic" />
                  <div>
                    <p class="ua-help-title">What is this?</p>
                    <p class="ua-help-text">{{ helpBlock }}</p>
                  </div>
                </div>

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
                <!-- What comes next: the seller's next unfinished section,
                     or any section from the bar above -->
                <div v-if="nextSection" class="ua-next">
                  <OPIcon :name="nextSection.key" class="ua-next-ic" />
                  <span class="ua-next-body">
                    <span class="ua-next-kicker">Up next</span>
                    <span class="ua-next-title">{{ nextSection.title }}</span>
                    <span v-if="nextSection.meta" class="ua-next-meta">{{ nextSection.meta }}</span>
                  </span>
                </div>
                <p v-else-if="sectionChoices.length > 1" class="ua-done-text">
                  You've answered every section UMU can help with so far.
                </p>
                <div class="ua-done-actions">
                  <button
                    v-if="nextSection"
                    type="button"
                    class="ua-save"
                    @click="switchSection(nextSection.id)"
                  >
                    Start {{ nextSection.title }}
                    <Icon name="i-lucide-arrow-right" />
                  </button>
                  <button
                    type="button"
                    :class="nextSection ? 'ua-back-btn' : 'ua-save'"
                    @click="closeAssistant"
                  >
                    Back to your passport
                    <Icon v-if="!nextSection" name="i-lucide-arrow-right" />
                  </button>
                </div>
                <p v-if="nextSection && sectionChoices.length > 2" class="ua-done-hint">
                  Or open All sections at the top to pick another one.
                </p>
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
              <p class="ua-foot-status" :class="{ 'is-asking': askingLabel }" role="status" aria-live="polite">
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
import { useRoute, useRouter } from 'vue-router'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
import OPIcon from '~/components/ui/OPIcon.vue'
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
import { usePassportApi } from '~/composables/usePassportApi'
import { hiddenQuestionIds } from '~/utils/questionBranching'
import { umuSectionKeyOf, rememberUmuSection, lastUmuSection } from '~/utils/umuSections'
import UmuSectionRail from '~/components/agent/UmuSectionRail.vue'
import { usePassportBack, usePassportTrail } from '~/composables/usePassportTrail'
import { usePathways } from '~/composables/usePathways'
import { usePassportAchievement } from '~/composables/usePassportAchievement'
import { useCountUp } from '~/composables/useCountUp'
import { useUmuVoice } from '~/composables/useUmuVoice'
import { MIN_UMU_RATE, MAX_UMU_RATE, UMU_RATE_STEP } from '~/utils/umuVoices'
import { understandAnswer, type Understanding } from '~/composables/useUmuUnderstand'
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
  sectionCommand,
  matchOptions,
  cleanHelpText,
  cleanDescription,
  optionSaid,
} from '~/utils/umuGuide'
import { toSmartTitleCase } from '~/utils/titleCase'

definePageMeta({ middleware: 'auth' })

// Lets question components switch to their assistant look (labelled form
// fields with numbered steps). The manual pages never provide it.
provide('umuAssistant', true)

const route = useRoute()
const router = useRouter()
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
// "Pick up where you left off". It covers the sections in
// utils/umuSections, one at a time, in any order.
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

// ── Sections ─────────────────────────────────────────────────────────
// The section open now, and the passport's sections UMU can help with
const sectionId = ref('')
const umuSteps = computed(() => (rt.steps.value as any[]).filter((s) => umuSectionKeyOf(s)))

// Answered and total for each of those sections, counted the way this page
// counts them (questions that don't apply are left out), so the switcher
// and the "Up next" card agree with the tracker.
const sectionCounts = reactive<Record<string, { answered: number; total: number }>>({})
const api = usePassportApi()

async function countSection(step: any) {
  const lists = await Promise.all((step.tasks || []).map((t: any) => api.getQuestions(t.id)))
  const all = (lists as any[][]).flat().map((q) => ({ ...q, type: q.type?.toLowerCase() }))
  const hidden = hiddenQuestionIds(all)
  const visible = all.filter((q) => !hidden.has(q.id))
  return { answered: visible.filter((q) => q.completed).length, total: visible.length }
}

async function loadSectionCounts(skipId = '') {
  await Promise.all(
    umuSteps.value
      .filter((s) => s.id !== skipId)
      .map(async (s) => {
        try {
          sectionCounts[s.id] = await countSection(s)
        } catch {
          // that section just shows no count
        }
      }),
  )
}

const sectionChoices = computed(() =>
  umuSteps.value.map((s) => {
    const c = sectionCounts[s.id]
    const done = !!c && c.total > 0 && c.answered >= c.total
    const meta = !c
      ? ''
      : done
        ? 'Complete'
        : c.answered
          ? `${c.answered} of ${c.total} answered`
          : `${c.total} ${c.total === 1 ? 'question' : 'questions'}`
    return {
      id: s.id,
      key: umuSectionKeyOf(s) as string,
      title: toSmartTitleCase(s.title),
      done,
      meta,
      started: !!c && c.answered > 0,
      left: c ? Math.max(0, c.total - c.answered) : null,
      pct: c && c.total ? Math.round((c.answered / c.total) * 100) : 0,
    }
  }),
)

// The next section still to finish, after this one, wrapping round
const nextSection = computed(() => {
  const list = sectionChoices.value
  const i = list.findIndex((s) => s.id === sectionId.value)
  const order = [...list.slice(i + 1), ...list.slice(0, Math.max(i, 0))]
  return order.find((s) => !s.done) || null
})

// 'hello' when the page opens, 'switch' when the seller moves to another
// section, so UMU's first words fit
const greetMode = ref<'hello' | 'switch'>('hello')

async function start() {
  phase.value = 'loading'
  try {
    await rt.loadPassport(passportId.value)
    if (!umuSteps.value.length) throw new Error('No sections UMU can help with')
    const asked = String(route.query.section || '')
    let section = umuSteps.value.find((s) => s.id === asked || umuSectionKeyOf(s) === asked)
    if (section) {
      // The other sections' counts can arrive while the seller answers
      loadSectionCounts(section.id)
    } else {
      // Opened from "Talk to UMU": the section the seller last had open, if
      // it still has questions left, otherwise the first section with
      // questions still to answer, so a seller who finished Ownership lands
      // on Boundaries
      await loadSectionCounts()
      const unfinished = (s: any) => {
        const c = sectionCounts[s.id]
        return !!c && c.answered < c.total
      }
      const last = lastUmuSection(passportId.value)
      const lastStep = last ? umuSteps.value.find((s) => umuSectionKeyOf(s) === last) : null
      section = (lastStep && unfinished(lastStep) ? lastStep : null) || umuSteps.value.find(unfinished) || umuSteps.value[0]
    }
    await openSection(section, 'hello')
  } catch {
    phase.value = 'error'
  }
}

async function openSection(section: any, greet: 'hello' | 'switch') {
  cancelFlow()
  activePathway.value = null
  pendingAfterPathway = null
  skipped.clear()
  savedPrefix = ''
  saveError.value = ''
  sectionId.value = section.id
  sectionTitle.value = toSmartTitleCase(section.title)
  phase.value = 'loading'
  rt.setCurrentStep(section.id)
  await rt.loadSectionQuestions(section.id)
  // Another section was picked while this one loaded
  if (sectionId.value !== section.id) return
  // Keep the section in the address, so a refresh or a shared link opens it
  const key = umuSectionKeyOf(section)
  if (key && route.query.section !== key) router.replace({ query: { ...route.query, section: key } })
  // The passport card and the next "Talk to UMU" pick up here
  if (key) rememberUmuSection(passportId.value, key)
  resumed.value = questions.value.some((q: any) => q.completed)
  greetMode.value = greet
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
}

// Tapping a section in the bar, the "Up next" button, or saying "go to
// boundaries". Answers already saved stay saved.
async function switchSection(id: string) {
  if (saving.value || phase.value === 'loading') return
  const section = umuSteps.value.find((s) => s.id === id)
  if (!section) return
  if (id === sectionId.value && phase.value === 'question') return
  voice.unlockAudio()
  showVoicePanel.value = false
  try {
    await openSection(section, 'switch')
  } catch {
    phase.value = 'error'
  }
  talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
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

// The open section's count in the section bar follows every answer live
watch(
  () => [sectionId.value, phase.value, questions.value.length, answeredCount.value] as const,
  ([id, p, total, answered]) => {
    if (id && p !== 'loading' && total) sectionCounts[id] = { answered, total }
  },
)
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
  if (greetMode.value === 'switch') {
    const n = questions.value.length
    return resumed.value
      ? `Back to your ${sectionTitle.value}.`
      : `Now for your ${sectionTitle.value}. ${n === 1 ? 'There is 1 question' : `There are ${n} questions`}.`
  }
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
  // "live at the property??" in the form is shown with one question mark
  return String(askedText(q) || 'Please answer this one.').replace(/\?{2,}/g, '?')
})

// The words a question asks. A Fixtures item is named by its first part
// ("Greenhouse"): the question title there is empty, the same, or copied
// from another item ("Bedroom 3" on the greenhouse and the rotary line).
function askedText(q: any): string {
  const parts: any[] = Array.isArray(q?.parts) ? q.parts.filter(Boolean) : []
  const first = [...parts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
  const labels = (first?.options || []).map((o: any) => String(o?.label || '').trim().toLowerCase())
  if (first?.title && labels.includes('included') && labels.includes('excluded')) return String(first.title)
  return undash(String(q?.question || q?.title || parts.find((p) => p?.title)?.title || ''))
}

// "Mains electricity - is this service connected?" reads as "Mains
// electricity: is this service connected?", with no dash on screen
const undash = (s: string) => s.replace(/\s+[-–—]+\s+/g, ': ')

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
  const hint = cleanDescription(q.description || q.subtitle || '', q.question || q.title || '')
  // "Please answer Yes or No." only repeats the buttons underneath
  if (/^please (answer|select) yes or no[.:]?$/i.test(hint)) return ''
  // "If Yes, have all the occupiers aged 17 or over:" leads into a later
  // question and says nothing on its own
  if (/^if yes\b.*:$/i.test(hint)) return ''
  return hint && hint !== sayText.value && hint.length < 260 ? hint : ''
})

const guide = computed(() => guideFor(current.value || {}, qType.value))

// The question's own "What is this?" text (the API sends it as `help`, as
// the manual page reads it). Multipart questions show it in each part
// already, and notes are all explanation.
const helpBlock = computed(() => {
  const q: any = current.value
  if (!q || qType.value === 'multipart' || qType.value === 'note') return ''
  return cleanHelpText(q.help || q.helpText, `${q.question || q.title || ''} ${q.description || ''}`)
})

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
const activeVoiceName = computed(() => voice.activeVoice.value || voice.voices.value[0]?.name || '')
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

// An upload with no box to type in (the Searches, the Leasehold documents)
// has nothing to say or type
const uploadOnly = computed(() => {
  const q: any = current.value
  if (qType.value === 'upload') return true
  const parts = qType.value === 'multipart' && Array.isArray(q?.parts) ? q.parts.filter(Boolean) : []
  return parts.length > 0 && parts.every((p: any) => String(p.type || '').toLowerCase() === 'upload' && String(p.display || '').toLowerCase() !== 'both')
})
const footHint = computed(() => {
  if (uploadOnly.value) return 'Upload a file, or tap Skip for now'
  return voice.canListen ? 'Type, or tap the mic and tell UMU' : 'Type or tap your answer'
})

const isCurrentSeg = (i: number) => phase.value === 'question' && i === rt.currentQuestionIndex.value

function segClass(q: any, i: number) {
  if (isCurrentSeg(i)) return 'ua-seg--current'
  if (q.completed) return 'ua-seg--done'
  if (skipped.has(q.id)) return 'ua-seg--skipped'
  return ''
}

function segTitle(q: any, i: number) {
  const title = askedText(q) || 'Question'
  const state = q.completed ? 'answered' : skipped.has(q.id) ? 'skipped' : 'not answered yet'
  return `Question ${i + 1}: ${title} (${state})`
}

// Jump straight to any question, answered or not, to fill it or change it.
// A tap while an answer is still saving used to be dropped, so going back
// to the question before seemed to do nothing; now it waits for the save.
let pendingJump: number | null = null
watch(saving, (now) => {
  if (now || pendingJump === null) return
  const i = pendingJump
  pendingJump = null
  // A follow-up or the section's celebration opened meanwhile: keep it
  if (phase.value === 'pathway' || showSectionComplete.value) return
  nextTick(() => jumpTo(i))
})
function jumpTo(i: number) {
  if (phase.value === 'loading' || phase.value === 'error') return
  if (saving.value) {
    pendingJump = i
    return
  }
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

// On a phone the bubble shows four lines at most (a long question filled
// it to eight and pushed the card off the screen; the card below has the
// whole question). It follows UMU as it speaks, keeping the word being
// said in view.
const captionTextEl = ref<HTMLElement | null>(null)
const captionScrolled = ref(false)
watch(
  () => [captionLine.value.text, captionLine.value.said],
  async ([, said], old) => {
    await nextTick()
    const box = captionTextEl.value
    if (!box) return
    if (!old || old[0] !== captionLine.value.text) box.scrollTop = 0
    if (box.scrollHeight <= box.clientHeight + 1) {
      captionScrolled.value = false
      return
    }
    const words = box.querySelectorAll<HTMLElement>('.ua-w')
    const word = words[Math.max(0, Math.min(words.length - 1, (said as number) - 1))]
    if (!word) return
    const lineH = word.offsetHeight || 20
    // Keep the spoken word on the last visible line but one
    const want = word.offsetTop - box.offsetTop + lineH * 2 - box.clientHeight
    if (want > box.scrollTop) box.scrollTo({ top: want, behavior: 'smooth' })
    captionScrolled.value = box.scrollTop > 0 || want > 0
  },
)
const voiceMode = ref(false)

const botState = computed(() => {
  if (pose.value === 'celebrate') return 'celebrate'
  if (voice.listening.value) return 'listening'
  if (voice.speaking.value) return 'speaking'
  if (phase.value === 'loading' || saving.value || understanding.value || voice.preparing.value) return 'thinking'
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
  if (voice.speaking.value) return voiceMode.value ? 'Tap the mic to answer now' : 'UMU is speaking'
  if (voice.preparing.value) return 'UMU is about to speak'
  if (saving.value) return 'Saving your answer'
  if (understanding.value) return 'Working out your answer'
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
  // "You selected No." finishes before the next question starts. Anything
  // else the seller does meanwhile (another answer, a jump) takes over.
  if (heardSpeech) {
    const waitId = ++flow
    const run = heardRun
    await afterHeard()
    if (!alive(waitId) || run !== heardRun) return
  }
  cancelFlow()
  const id = flow
  await nextTick()
  if (!alive(id) || phase.value !== 'question' || !current.value) return
  const prefix = savedPrefix
  savedPrefix = ''
  // Tapping and typing: UMU points at the first box and says what it needs
  const firstTarget = resetGuide()
  const firstAsk =
    !voiceMode.value &&
    firstTarget &&
    (firstTarget.kind === 'confirm' ||
      !isQuestionItself(firstTarget) ||
      (isRange(firstTarget.el) && !sliderInfo(firstTarget.el).letters))
      ? targetPrompt(firstTarget, true, 'tap')
      : boundaryFirstAsk()
  const speaking = say(joinSay(prefix, greeting.value, sayText.value, guide.value.say, firstAsk), id)
  prefetchNextQuestion()
  // The line that opens the next question once this one saves ("Saved,
  // plus 50 points."), so UMU replies the moment the save comes back
  const pts = Number(current.value.points) || 0
  if (pts && !current.value.completed) voice.prefetch(`Saved, plus ${pts} points.`)
  // The first thing UMU asks for once the mic is on
  if (firstTarget) voice.prefetch(targetPrompt(firstTarget, true))
  await speaking
  if (!alive(id)) return
  setPose('pointing', 2400)
  if (voiceMode.value) runVoiceAnswer(id)
}

// Tapping on the boundary plan: point at the first side still to do
function boundaryFirstAsk() {
  if (voiceMode.value || qType.value !== 'boundary') return ''
  const next = SIDES.find((s) => !boundaryAnswer(current.value)[s.key])
  if (!next) return ''
  markSide(next.key)
  askingLabel.value = `Tap the ${next.name} on the plan`
  return `Start by tapping the ${next.name} on the plan, then choose who looks after it.`
}

function repeatQuestion() {
  voice.unlockAudio()
  presentQuestion()
}

// Loads the next questions' voice while this one is answered, so UMU
// starts speaking the moment this answer is saved, or a skip lands.
function prefetchNextQuestion() {
  for (const step of [1, 2]) {
    const next: any = questions.value[rt.currentQuestionIndex.value + step]
    if (!next) return
    const text = askedText(next).replace(/\?{2,}/g, '?')
    if (text) voice.prefetch(joinSay(text, guideFor(next, normalizeQuestionType(next)).say))
  }
}

// UMU's short replies, loaded once so they never keep the seller waiting
const SHORT_LINES = [
  'Saved.',
  'Saved, plus 100 points.',
  'Got it.',
  'Thanks.',
  'Lovely.',
  'Great.',
  'Added.',
  "Go ahead, I'm listening.",
  "Take your time. Just tell me when you're ready, or type it in.",
  'Check your answer, then say save, or tap Save and continue.',
  "Sorry, I didn't catch that.",
]
onMounted(() => setTimeout(() => [...SHORT_LINES, NOT_SURE_LINE].forEach((l) => voice.prefetch(l)), 4000))

// Browsers only allow sound after a tap, so the first tap anywhere on the
// page lets UMU's voice play.
function unlockOnTap() {
  voice.unlockAudio()
}
onMounted(() => {
  document.addEventListener('pointerdown', unlockOnTap, { once: true, capture: true })
  document.addEventListener('keydown', unlockOnTap, { once: true, capture: true })
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', unlockOnTap, { capture: true })
  document.removeEventListener('keydown', unlockOnTap, { capture: true })
})

watch(sayKey, async () => {
  voiceNote.value = ''
  saveError.value = ''
  if (phase.value === 'question') return presentQuestion()
  // "You selected No." finishes before the section end or a follow-up
  if (heardSpeech) {
    const waitId = ++flow
    const run = heardRun
    await afterHeard()
    if (!alive(waitId) || run !== heardRun) return
  }
  cancelFlow()
  const id = flow
  if (phase.value === 'done') {
    setPose('celebrate', 3200)
    const next = nextSection.value
    const prefix = savedPrefix
    savedPrefix = ''
    if (!next) {
      await say(joinSay(prefix, sayText.value, 'You can go back to your passport now.'), id)
      return
    }
    await say(
      joinSay(
        prefix,
        sayText.value,
        `Next up is ${next.title}`,
        voiceMode.value ? 'Say next to start it' : `Tap Start ${next.title}, or pick any section at the top`,
      ),
      id,
    )
    // By voice: "next" or "yes" starts it; "go to notices" picks another
    if (!voiceMode.value || !alive(id)) return
    const said = await dictate({ kind: 'choice', el: talkEl.value!, label: '', options: [] }, id)
    if (!alive(id) || phase.value !== 'done') return
    const w = ` ${said.toLowerCase().replace(/[^a-z ]/g, '')} `
    if (voiceCommand(said) === 'save' || /\b(next|yes|yeah|ok|okay|go|start|sure|carry on|lets go)\b/.test(w)) {
      switchSection(next.id)
    } else if (voiceCommand(said) === 'stop') {
      stopVoiceMode()
    }
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
  voice.unlockAudio()
  voice.setMuted(!voice.muted.value)
}

function stopVoiceMode() {
  voiceMode.value = false
  cancelFlow()
  resetGuide()
}

// While UMU talks in voice mode, the mic cuts it short: the seller already
// knows the answer, so listening starts straight away
const canCutIn = computed(
  () => voiceMode.value && (voice.speaking.value || voice.preparing.value) && !voice.listening.value,
)

async function toggleVoice() {
  if (canCutIn.value) return voice.stopSpeaking()
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
// The address we found, for the seller to confirm or change
interface ConfirmTarget {
  kind: 'confirm'
  el: HTMLElement
  label: string
  address: string
}
// A number set with plus and minus buttons ("how many homes share it?")
interface CounterTarget {
  kind: 'counter'
  el: HTMLElement
  label: string
}
type Target = InputTarget | ChoiceTarget | ConfirmTarget | CounterTarget

const counterValue = (el: HTMLElement) => Number((el.querySelector('.counter-value')?.textContent || '0').trim()) || 0

// Presses plus or minus until the counter shows n
async function setCounter(t: CounterTarget, n: number) {
  for (let i = 0; i < 60 && counterValue(t.el) !== n; i++) {
    const [minus, plus] = Array.from(t.el.querySelectorAll<HTMLButtonElement>('.counter-btn'))
    ;(counterValue(t.el) < n ? plus : minus)?.click()
    await nextTick()
  }
}

const SKIP_TYPES = new Set(['hidden', 'file', 'checkbox', 'radio', 'button', 'submit', 'reset'])

const isRange = (el: Element): el is HTMLInputElement => el instanceof HTMLInputElement && el.type === 'range'

// A slider always holds a value, so it only counts as answered once the
// seller has moved it (or the question was answered before).
let movedSliders = new WeakSet<Element>()
watch(
  () => current.value?.id,
  () => (movedSliders = new WeakSet()),
)
// Only the seller's own drag counts; UMU's voice marks its own writes
function onAnswerInput(e: Event) {
  if (e.isTrusted && e.target instanceof Element && isRange(e.target)) movedSliders.add(e.target)
}

// What a slider shows: its value pill ("6", "B", "£250K") and the words at
// each end ("Quiet" and "Loud")
function sliderInfo(el: HTMLInputElement) {
  const box = el.closest('.budget-slider')
  const ends = Array.from(box?.querySelectorAll('.label-item') || []).map((e) => (e.textContent || '').trim())
  const shown = (box?.querySelector('.value-pill-text')?.textContent || el.value).trim()
  return {
    shown,
    low: ends[0] || el.min || '0',
    high: ends[ends.length - 1] || el.max || '10',
    letters: /^[A-Z]$/.test(shown),
  }
}

// The slider's answer as UMU says it: "6 out of 10", "band B", "£250,000"
function sliderAnswer(el: HTMLInputElement) {
  const { shown, letters } = sliderInfo(el)
  if (letters) return /council tax/i.test(`${sayText.value} ${partTitle(el)}`) ? `band ${shown}` : shown
  const k = shown.match(/^£([\d.]+)K$/i)
  if (k) return `£${Math.round(parseFloat(k[1]) * 1000).toLocaleString('en-GB')}`
  if (/^\d+$/.test(shown) && /^[01]$/.test(el.min || '0') && el.max) return `${shown} out of ${el.max}`
  return shown
}

function visible(el: Element) {
  return (el as HTMLElement).getClientRects().length > 0
}

function cleanLabel(s: string) {
  return undash(s)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(please\s+)?(enter|select|provide|type|add)\s+/i, '')
    .replace(/\(s\)/gi, 's')
    .replace(/\bemail id\b/i, 'email address')
    .replace(/^are completing\b/i, 'Are you completing')
    .replace(/[.:…]+$/, '')
    .replace(/\?$/, '')
    .trim()
    // The details box under a Yes (Boundaries, Disputes, Notices), in the
    // words UMU says: "Next, tell me the details"
    .replace(/^written (instruction|details) for (your|the) answer above.*$/i, 'details')
    .replace(/^(please )?indicate ownership by written instruction.*$/i, 'boundary details')
    // Alterations, Guarantees, Insurance and Environmental follow-up boxes,
    // so UMU says "Next, tell me the reason the property is not insured"
    // rather than reading the form's own long label
    .replace(/^(please )?supply copies of the planning permissions.*$/i, 'approvals, or why none were needed')
    // Rights and Occupiers follow-ups
    .replace(/^supply a copy of the agreement$/i, 'Is a copy of the agreement attached, or will it follow')
    .replace(/^if (no|not)\b.*other evidence that the property will be vacant.*$/i, 'evidence that the home will be empty on completion')
    .replace(/^occupier name$/i, 'full name of each other adult living there')
    .replace(/^(please )?(supply|scan or upload|upload) (a )?cop(y|ies) of\b.*$/i, 'details')
    .replace(/^why does the seller not provide insurance.*$/i, 'reason the property is not insured')
    .replace(/^written details for building insurance claims.*$/i, 'details of the claims')
    .replace(/^if yes, please state when the flooding occurred.*$/i, 'date of the flooding and the parts that flooded')
    .replace(/^what kind of flooding occurred.*$/i, 'What kind of flooding was it')
    .replace(/^if relevant, specify what .?other.? type of (\w+).*$/i, 'other type of $1')
    // Fixtures and Fittings: the price box under an Excluded item, and the
    // boxes of the "Other ..." items
    .replace(/^selling price$/i, SALE_PRICE)
    .replace(/^what is this (item|room) called$/i, 'name of the $1')
    .replace(/^inclusion status$/i, 'Will it stay with the home')
    // "Tap Fitted or Freestanding" says it all
    .replace(/^(inclusion|installation) type$/i, '')
    // Services follow-ups
    .replace(/^a cop(y|ies) of\b.*$/i, 'details')
    .replace(/^one of the following documents$/i, 'details, or upload one of the documents listed')
    .replace(/^if there is a boiler.*when was it installed$/i, 'date the boiler was installed')
    .replace(/^when was the septic tank last replaced or upgraded$/i, 'date the septic tank was last replaced or upgraded')
    .replace(/^(please )?specify the following provider details$/i, 'details')
    .replace(/^numbers? of properties sharing the system$/i, 'number of homes that share it')
    .replace(/^(item|room) (name|description)$/i, (_, what, box) => (box.toLowerCase() === 'name' ? `name of the ${what.toLowerCase()}` : `short description of the ${what.toLowerCase()}`))
    // Leasehold and Title Register follow-ups: a box to type in or upload
    // to, said as "Next, tell me the details, or upload the formal notice"
    .replace(/^rent amount due each year$/i, 'ground rent due each year')
    .replace(/^how often is the rent reviewed$/i, 'times the rent is reviewed')
    .replace(/^how is the increase calculated$/i, 'way the increase is worked out')
    .replace(/^frequency of rent payments.*$/i, 'how often you pay the ground rent')
    .replace(/^upload proof of landlords? consent.*$/i, "details of the landlord's consent, or upload their letter")
    .replace(/^upload details of the proposed or completed remediation works$/i, 'details of the works, or upload what you were sent')
    .replace(/^(please )?upload the response documentation$/i, "details of the landlord's reply, or upload it")
    .replace(/^(please )?upload the (.+?) documentation$/i, 'details, or upload the $2')
    .replace(/^(please )?upload (your |the )?(.+)$/i, (_, __, the, what) => `details, or upload ${the ? the.toLowerCase() : 'the '}${what.replace(/\s*\(official copy\)/i, '').replace(/\blandlords\b/i, "landlord's")}`)
}
const SALE_PRICE = 'price, if you would sell it to the buyer'

function partTitle(el: Element) {
  return cleanLabel(el.closest('.part-section')?.querySelector('.part-text')?.textContent || '')
}

function inputLabel(el: HTMLInputElement | HTMLTextAreaElement) {
  // Placeholders that are an example answer ("e.g. Back fence...") say
  // nothing about what the box is for
  const junk = /^(start typing|\W*\d|£|\$|0+%?$|search|e\.?g\b|for example|example)/i
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
  // The date box a "Yes, select year" opens ("Have solar panels been
  // installed?"): UMU has just asked the question, so it asks for the date
  if (dateChoiceOf(el)) return 'date'
  const part = partTitle(el)
  // A one word label like "Name" says less than the part it belongs to
  if (part && (!label || !/\s/.test(label))) label = part
  // The untitled box a Yes opens (Boundaries, Disputes, Notices): "Next,
  // tell me the details"
  if (!label && el instanceof HTMLTextAreaElement && el.closest('.part-section')) label = 'details'
  return label || 'answer'
}

function toTarget(el: Element): Target | null {
  if (el.classList.contains('counter-row')) {
    return visible(el) ? { kind: 'counter', el: el as HTMLElement, label: partTitle(el) || 'number' } : null
  }
  if (el.classList.contains('addr-confirm')) {
    if (!visible(el)) return null
    const address = (el.querySelector('.addr-confirm-line')?.textContent || '').trim()
    return { kind: 'confirm', el: el as HTMLElement, label: 'address', address }
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el instanceof HTMLInputElement && SKIP_TYPES.has(el.type)) return null
    if (el.disabled || el.readOnly || !visible(el)) return null
    if (el.closest('.radio-options, .chips-wrap, .modal')) return null
    // A date under a Yes the seller hasn't chosen: asked for once they do
    const dateOpt = dateChoiceOf(el)
    if (dateOpt && !dateOpt.classList.contains('selected')) return null
    // A chips part's own "type your own" box is used by its chips target
    if (el.classList.contains('voice-input-field')) return null
    if (isRange(el)) {
      // The asking price box above the slider is asked for instead
      if (el.closest('.budget-slider')?.querySelector('.currency-box__value')) return null
      return { kind: 'input', el, label: partTitle(el) || 'answer', addOnEnter: false }
    }
    return {
      kind: 'input',
      el,
      label: inputLabel(el),
      addOnEnter: !!el.closest('.input-section')?.querySelector('.add-btn'),
    }
  }
  // Yes or No on a date question ("Yes, select year" / "No"), and tick
  // boxes ("What kind of flooding was it?"), are choices too
  const isDates = el.classList.contains('date-options')
  const opts = Array.from(
    el.querySelectorAll<HTMLElement>(isDates ? ':scope > .date-option' : '.radio-option, .chip, .checkbox-option'),
  )
    .filter(visible)
    .map((o) => ({ el: o, label: (o.querySelector('.option-label')?.textContent || o.textContent || '').trim() }))
    .filter((o) => o.label)
  if (!opts.length || !visible(el)) return null
  // A date question with one option, or typed boxes side by side, has no
  // choice to make: its boxes are asked for instead
  if (isDates && (opts.length < 2 || opts.some((o) => o.el.classList.contains('multi-input-option')))) return null
  return { kind: 'choice', el: el as HTMLElement, label: partTitle(el), options: opts }
}

// The option row a date box sits in, when that row is one of several to
// choose between (so it needs choosing before its date is asked for)
function dateChoiceOf(el: Element): HTMLElement | null {
  const opt = el.closest<HTMLElement>('.date-option')
  if (!opt || opt.classList.contains('multi-input-option')) return null
  const group = opt.parentElement
  return group && group.querySelectorAll(':scope > .date-option').length > 1 ? opt : null
}

// Tick boxes, where the seller can choose several
const isMulti = (t: Target) => t.kind === 'choice' && t.el.classList.contains('checkbox-options')

function collectTargets(): Target[] {
  const root = answerEl.value
  if (!root) return []
  return Array.from(
    root.querySelectorAll('.addr-confirm, input, textarea, .radio-options, .chips-wrap, .date-options, .checkbox-options, .counter-row'),
  )
    .map(toTarget)
    .filter(Boolean) as Target[]
}

function isFilled(t: Target) {
  if (t.kind === 'confirm') return t.el.classList.contains('is-confirmed')
  if (t.kind === 'choice') return t.options.some((o) => o.el.classList.contains('selected'))
  if (t.kind === 'counter') return counterValue(t.el) > 0
  if (t.addOnEnter) return !!t.el.closest('.multi-text-input, .input-section')?.parentElement?.querySelector('.edit-btn')
  if (isRange(t.el)) return movedSliders.has(t.el) || !!current.value?.completed
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
// phones the page itself scrolls. Nothing moves when the box is already in
// full view, so the page doesn't jump under the seller while they read.
function reveal(el: HTMLElement) {
  const box = talkEl.value
  const r = el.getBoundingClientRect()
  if (box && getComputedStyle(box).overflowY !== 'visible' && box.scrollHeight > box.clientHeight + 1) {
    const b = box.getBoundingClientRect()
    if (r.top >= b.top && r.bottom <= b.bottom) return
    const zoom = (box as any).currentCSSZoom || 1
    const delta = (r.top - b.top - (b.height - r.height) / 2) / zoom
    box.scrollTo({ top: box.scrollTop + delta, behavior: 'smooth' })
  } else {
    // Below the sticky site bar, and above the bottom of the screen
    const navBottom = document.querySelector('.hsw-nav')?.getBoundingClientRect().bottom || 0
    if (r.top >= navBottom && r.bottom <= window.innerHeight) return
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
  // Some boxes only take a value on change (the number box next to chips)
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

function pressEnter(el: HTMLElement) {
  el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }))
}

// Turns speech into what the field expects.
function shapeFor(t: InputTarget, said: string): string | null {
  const el = t.el
  const hint = `${t.label} ${el.getAttribute('placeholder') || ''} ${el.getAttribute('inputmode') || ''}`.toLowerCase()
  if (el instanceof HTMLInputElement && el.type === 'date') return spokenDate(said)
  if (isRange(el)) {
    if (sliderInfo(el).letters) {
      const letter = spokenLetter(said)
      return letter ? String(letter.charCodeAt(0) - 65) : null
    }
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
    if (isRange(t.el)) movedSliders.add(t.el)
  }
  const said = await voice.listen({
    // Room to pause and think mid answer; a choice is usually a word or two
    endSilenceMs: t.kind === 'input' ? 1600 : 1100,
    // A clear choice or command ends the answer straight away
    isComplete: (text) => {
      if (voiceCommand(text) || sectionCommand(text)) return true
      if (t.kind === 'choice') return t.options.length > 0 && !!matchOption(text, t.options)
      if (t.kind === 'confirm') return !!matchOption(text, [{ label: 'Yes' }, { label: 'No' }])
      return false
    },
    onInterim: (text) => {
      if (!alive(id)) return
      heardText.value = text
      if (t.kind === 'input' && !t.addOnEnter) write(text, false)
    },
  })
  if (!alive(id)) return ''
  heardText.value = said
  // "Go to boundaries": not an answer, so the box goes back to how it was
  // and UMU opens that section (which ends this listening flow)
  const goTo = sectionCommand(said)
  if (goTo) {
    if (t.kind === 'input' && !t.addOnEnter) setNativeValue(t.el, base)
    const section = umuSteps.value.find((s) => umuSectionKeyOf(s) === goTo)
    if (!section) {
      await say("Sorry, I can't help with that section yet.", id)
    } else if (section.id === sectionId.value && phase.value === 'question') {
      await say(`We're already in your ${sectionTitle.value}.`, id)
    } else {
      switchSection(section.id)
    }
    return ''
  }
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
const andList = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

type Outcome = 'next' | 'skip' | 'back' | 'stop' | 'save'

// "I'm not sure" is a fair answer: UMU says so kindly and moves on
const NOT_SURE_LINE = 'No problem. You can come back to this one later.'
const isNotSure = (said: string) =>
  /\b(not sure|don'?t know|do not know|no idea|not certain|can'?t remember)\b/i.test(said)

// Waiting on a second opinion about what the seller said
const understanding = ref(false)

// When UMU's own matching can't place a spoken answer, Claude gets a look
// (see server/api/umu-understand.post.ts). Null when it can't help.
async function askUmu(t: Target, said: string): Promise<Understanding | null> {
  const readings = [...new Set([said, ...voice.alternatives.value])]
  const base = { question: cleanLabel(sayText.value), label: t.label === 'answer' ? '' : t.label }
  let field: Parameters<typeof understandAnswer>[0]
  if (t.kind === 'choice') {
    if (!t.options.length) return null
    field = { ...base, kind: 'choice', options: t.options.map((o) => o.label.trim()) }
  } else if (t.kind === 'input' && isRange(t.el)) {
    const info = sliderInfo(t.el)
    field = info.letters
      ? { ...base, kind: 'letter' }
      : { ...base, kind: 'number', min: Number(t.el.min || 0), max: Number(t.el.max || 10), lowLabel: info.low, highLabel: info.high }
  } else {
    return null
  }
  understanding.value = true
  try {
    return await understandAnswer(field, readings)
  } finally {
    understanding.value = false
  }
}

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

// A box that is the question itself (or has no name of its own): UMU has
// just asked it, so it only needs a nudge, not the same words again
const isQuestionItself = (t: Target) =>
  t.label === 'answer' || t.label.toLowerCase() === cleanLabel(sayText.value).toLowerCase()

// What UMU says to ask for one box or choice. "voice" when the seller
// answers by speaking, "tap" when they tap and type.
// What UMU asks for, after "fill in" or "tell me": "the sale price", but a
// label that is already a phrase goes in as it is, so UMU never says "fill
// in the your comments about this item here" or "tell me the this is about
// how parking works".
function theLabel(label: string) {
  // "MPAN number" keeps its capitals, so the voice still spells it out
  const l = (/^[A-Z]{2,}\b/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1))
    .replace(/^this (is|question is) about\s+/i, '')
    .replace(/\s+here\.?$/i, '')
    .replace(/\.$/, '')
  return /^(your|my|his|her|their|its|how|what|when|where|which|whether|who|why|if|any|all|each|every|a|an|the)\b/i.test(l) ? l : `the ${l}`
}

function targetPrompt(t: Target, first: boolean, mode: 'voice' | 'tap' = 'voice') {
  const sameAsQuestion = isQuestionItself(t)
  const spokenLabel = theLabel(t.label)
  if (t.kind === 'confirm') {
    return mode === 'voice'
      ? `I found this address for your property: ${t.address}. Is that right? Say yes, or say no to change it.`
      : `I found this address for your property: ${t.address}. If it's right, tap Yes, this is my address. If not, tap No, change it.`
  }
  if (t.kind === 'choice') {
    // "Yes, select year" is said as "Yes"
    const optionLabels = t.options.slice(0, 7).map((o) => optionSaid(o.label))
    const choose = isMulti(t)
      ? mode === 'voice'
        ? `You can say one or more: ${orList(optionLabels)}`
        : 'Tap all that apply'
      : mode === 'voice'
        ? `You can say ${orList(optionLabels)}`
        : optionLabels.length > 4 ? 'Tap the one that fits' : `Tap ${orList(optionLabels)}`
    return joinSay(t.label && !sameAsQuestion ? `${t.label}?` : '', choose)
  }
  if (isRange(t.el)) {
    const { low, high, letters } = sliderInfo(t.el)
    const min = t.el.min || '0'
    const max = t.el.max || '10'
    const ask = sameAsQuestion ? '' : `${t.label}?`
    if (mode === 'tap') return joinSay(ask, `Move the slider between ${low} and ${high}`)
    if (letters) return joinSay(ask, `Say the letter, from ${low} to ${high}`)
    // Word ends ("Quiet", "Loud") tell the seller which way round it goes
    const ends = low !== min || high !== max ? `, where ${min} is ${low} and ${max} is ${high}` : ''
    return joinSay(ask, `Say a number from ${min} to ${max}${ends}`)
  }
  if (t.kind === 'counter') {
    return mode === 'tap'
      ? `${first ? 'Tap' : 'Next, tap'} plus to set ${spokenLabel}.`
      : `${first ? 'Tell' : 'Next, tell'} me ${spokenLabel}.`
  }
  // An excluded Fixtures item: the price is optional
  if (t.label === SALE_PRICE) {
    return mode === 'tap'
      ? 'If you would sell it to the buyer, type your price. If not, tap Save and continue.'
      : 'If you would sell it to the buyer, tell me your price. If not, say save.'
  }
  if (mode === 'tap') {
    if (sameAsQuestion) return 'Type your answer in the box.'
    return t.addOnEnter
      ? `${first ? 'Please add' : 'Next, please add'} ${spokenLabel}. Press enter after each one.`
      : `${first ? 'Please fill in' : 'Next, please fill in'} ${spokenLabel}.`
  }
  return first && sameAsQuestion ? "Go ahead, I'm listening." : `${first ? 'Tell' : 'Next, tell'} me ${spokenLabel}.`
}

// The words on the footer while UMU waits on a box
function targetLabel(t: Target, mode: 'voice' | 'tap') {
  if (t.kind === 'confirm') return mode === 'voice' ? 'Is this your address? Say yes or no' : 'Is this your address?'
  // A choice that is the question itself needs no label of its own
  if (t.kind === 'choice') return t.label && !isQuestionItself(t) ? `${t.label}?` : 'Choose an answer'
  if (isRange(t.el) && mode === 'tap') return t.label === 'answer' ? 'Move the slider' : `${t.label}? Move the slider`
  if (t.label === 'answer') return mode === 'voice' ? 'Say your answer' : 'Type your answer'
  if (t.label === SALE_PRICE) return mode === 'voice' ? 'Your price, or say save' : 'Your price, if you would sell it'
  if (t.kind === 'counter') return mode === 'voice' ? `Say ${theLabel(t.label)}` : `Tap plus to set ${theLabel(t.label)}`
  const label = /^[A-Z][a-z]/.test(t.label) ? theLabel(t.label) : `the ${t.label}`
  return mode === 'voice' ? `Tell me ${label}` : `Fill in ${label}`
}

async function askTarget(t: Target, id: number, first: boolean): Promise<Outcome> {
  setTarget(t)
  const optionLabels = t.kind === 'choice' ? t.options.slice(0, 7).map((o) => optionSaid(o.label)) : []
  askingLabel.value = targetLabel(t, 'voice')
  const prompt = targetPrompt(t, first)
  prefetchGuide('voice')
  await say(joinSay(takeAck(), prompt), id)

  // The address we found: yes keeps it, no opens the box to type a new one
  if (t.kind === 'confirm') {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (!alive(id)) return 'stop'
      const said = await dictate(t, id)
      if (!alive(id)) return 'stop'
      const cmd = voiceCommand(said)
      if (cmd === 'back' || cmd === 'stop') return cmd
      if (cmd === 'skipQuestion') return 'skip'
      if (cmd === 'repeat') {
        await say(prompt, id)
        continue
      }
      const heard = ` ${[said, ...voice.alternatives.value].join(' ').toLowerCase()} `
      const change = /\b(change|wrong|different|edit|not (right|correct|mine|it|my address))\b/.test(heard)
      const answer = change ? null : matchOption([said, ...voice.alternatives.value], [{ label: 'Yes' }, { label: 'No' }])
      if (change || answer?.label === 'No') {
        t.el.querySelector<HTMLElement>('.addr-change')?.click()
        ack = "No problem. Let's put in the right address."
        return 'next'
      }
      if (answer?.label === 'Yes' || cmd === 'save') {
        t.el.querySelector<HTMLElement>('.addr-yes')?.click()
        ack = 'Great, address confirmed.'
        return 'next'
      }
      if (!said && attempt > 0) return 'next'
      await say(said ? "Sorry, I didn't catch that. Is this your address? Say yes or no." : prompt, id)
    }
    return 'next'
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    if (!alive(id)) return 'stop'
    const said = await dictate(t, id)
    if (!alive(id)) return 'stop'
    const cmd = voiceCommand(said)
    if (cmd === 'back') return 'back'
    if (cmd === 'skipQuestion') return 'skip'
    // "I don't know" picks the Not known answer, where the question has one
    const unknown = t.kind === 'choice' && isNotSure(said) ? matchOption(said, t.options) : null
    if (unknown) {
      ack = selectedLine([optionSaid(unknown.label)])
      unknown.el.click()
      return 'next'
    }
    if (cmd === 'skip') {
      if (isNotSure(said)) ack = NOT_SURE_LINE
      return 'next'
    }
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
      // Tick boxes take several at once: "river and surface water"
      if (isMulti(t)) {
        const picks = matchOptions([said, ...voice.alternatives.value], t.options)
        if (picks.length) {
          for (const o of picks) {
            if (o.el.classList.contains('selected')) continue
            o.el.click()
            await nextTick()
          }
          ack = selectedLine(picks.map((o) => optionSaid(o.label)))
          return 'next'
        }
      }
      const opt = matchOption([said, ...voice.alternatives.value], t.options)
      if (opt) {
        opt.el.click()
        ack = selectedLine([optionSaid(opt.label)])
        return 'next'
      }
      const meant = await askUmu(t, said)
      if (!alive(id)) return 'stop'
      const picked = meant?.option ? t.options.find((o) => o.label.trim() === meant.option) : null
      if (picked) {
        picked.el.click()
        ack = selectedLine([optionSaid(picked.label)])
        return 'next'
      }
      if (meant?.intent === 'not_sure' || meant?.intent === 'skip') {
        ack = NOT_SURE_LINE
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
    if (t.kind === 'counter') {
      const n = spokenNumber(said)
      if (n === null || n < 0 || n > 50) {
        await say('Sorry, I need a number, like two.', id)
        continue
      }
      await setCounter(t, Math.round(n))
      ack = `You selected ${counterValue(t.el)}.`
      return 'next'
    }
    if (t.el instanceof HTMLInputElement && t.el.type === 'date' && !t.el.value) {
      await say('Sorry, I need a date, like the thirty first of March twenty twenty five.', id)
      continue
    }
    // Doesn't look right (an email without an at sign, a short phone
    // number): say why and ask again
    const problem = t.addOnEnter ? '' : problemWith(t)
    if (problem && attempt < 2) {
      await say(joinSay(problem, 'Please say it again.'), id)
      continue
    }
    if (isRange(t.el)) {
      if (!movedSliders.has(t.el)) {
        const meant = await askUmu(t, said)
        if (!alive(id)) return 'stop'
        if (meant?.intent === 'answer' && meant.value) {
          const letter = sliderInfo(t.el).letters
          setNativeValue(t.el, letter ? String(meant.value.charCodeAt(0) - 65) : meant.value)
          movedSliders.add(t.el)
        } else if (meant?.intent === 'not_sure' || meant?.intent === 'skip') {
          ack = NOT_SURE_LINE
          return 'next'
        } else {
          await say(`Sorry, I didn't catch that. ${targetPrompt(t, false)}`, id)
          continue
        }
      }
      // Let the slider's value pill catch up before reading it out
      await nextTick()
      ack = `You selected ${sliderAnswer(t.el)}.`
      return 'next'
    }
    ack = nextAck()
    return 'next'
  }
  ack = "Let's leave that one for now. You can tap it in any time."
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

  // The boundary plan: UMU asks about each side in turn
  if (type === 'boundary') return boundaryByVoice(q, id)

  if (type === 'note' || type === 'upload') {
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
      let letter = [said, ...voice.alternatives.value].map(spokenLetter).find(Boolean) || null
      if (!letter && said) {
        if (isNotSure(said)) {
          ack = NOT_SURE_LINE
          break
        }
        understanding.value = true
        const meant = await understandAnswer(
          { kind: 'letter', question: cleanLabel(sayText.value), label: 'Council tax band' },
          [...new Set([said, ...voice.alternatives.value])],
        ).finally(() => (understanding.value = false))
        if (!alive(id)) return
        if (meant?.intent === 'answer' && meant.value) letter = spokenLetter(meant.value)
        else if (meant?.intent === 'not_sure' || meant?.intent === 'skip') {
          ack = NOT_SURE_LINE
          break
        }
      }
      if (letter) {
        q.answer = letter
        componentRev.value++
        ack = `You selected band ${letter}.`
        break
      }
      await say("Sorry, I didn't catch the letter. Please say it again, like band C.", id)
    }
    return finishByVoice(q.id, id)
  }

  await nextTick()
  const targets = collectTargets().filter(needsAnswer)
  // Everything here is answered already: say what's set and let the seller
  // change a choice, or keep it
  if (!targets.length) {
    const choices = collectTargets().filter((t) => t.kind === 'choice') as ChoiceTarget[]
    for (const t of choices) {
      if (!alive(id) || current.value?.id !== q.id) return
      const picked = t.options.filter((o) => o.el.classList.contains('selected')).map((o) => optionSaid(o.label))
      setTarget(t)
      askingLabel.value = 'Say another answer, or say save'
      await say(
        joinSay(
          t.label && t.label.toLowerCase() !== cleanLabel(sayText.value).toLowerCase() ? `${t.label}?` : '',
          `Your answer is ${andList(picked)}`,
          'Say another answer, or say save to keep it',
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
        ack = selectedLine([optionSaid(opt.label)])
      }
      if (current.value?.id !== q.id) return
    }
    return finishByVoice(q.id, id)
  }
  // Box by box until every one is answered. Answers can open more boxes
  // (a "No" to "Are you the owner?" asks how you are acting for the
  // seller), so the form is looked at again after every answer and any
  // new box is asked for too, after saying it has opened.
  const asked = new Set<Element>()
  const seen = new Set<Element>(collectTargets().map((t) => t.el))
  let first = true
  while (alive(id) && current.value?.id === q.id) {
    await nextTick()
    // Let the form open any follow-up the last answer revealed
    await new Promise((r) => setTimeout(r, 120))
    if (!alive(id) || current.value?.id !== q.id) return
    const all = collectTargets()
    const opened = all.filter((t) => !seen.has(t.el) && !isFilled(t))
    all.forEach((t) => seen.add(t.el))
    if (opened.length && !first) ack = joinSay(takeAck(), openedNote(opened.length))
    const t = all.find((x) => needsAnswer(x) && !asked.has(x.el))
    if (!t) break
    asked.add(t.el)
    const outcome = await askTarget(t, id, first)
    first = false
    if (!alive(id)) return
    if (outcome === 'stop') return stopVoiceMode()
    if (outcome === 'back') return goBack()
    if (outcome === 'skip') return skipQuestion()
    // "Save" means save, when the answer is complete enough
    if (outcome === 'save') {
      if (answerValid.value && !saving.value) return saveCurrent()
      break
    }
    // A radio answer, or a No that leaves nothing else to answer, saves
    // straight away and moves on
    if (current.value?.id !== q.id || saving.value) return
  }
  if (!alive(id) || current.value?.id !== q.id || saving.value) return
  finishByVoice(q.id, id)
}

// ── Boundary plan ──
// Left, right, rear and front, as seen from the road. Each side holds one
// option value (Neighbour, Seller, Shared or Unknown). By voice UMU asks
// for each side in turn; by tap it says which side to tap next.
const SIDES = [
  { key: 'left', name: 'left side' },
  { key: 'right', name: 'right side' },
  { key: 'rear', name: 'rear' },
  { key: 'front', name: 'front' },
] as const
type SideKey = (typeof SIDES)[number]['key']

const sideName = (key: SideKey) => SIDES.find((s) => s.key === key)!.name
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function boundaryOptions(q: any): { label: string; value: string }[] {
  return (q?.options || []).map((o: any) => ({ label: String(o.label ?? o.value), value: String(o.value ?? o.label) }))
}
const boundaryLabel = (q: any, value: string) => boundaryOptions(q).find((o) => o.value === value)?.label || value

function boundaryAnswer(q: any): Record<SideKey, string> {
  const a = q?.answer && typeof q.answer === 'object' ? q.answer : {}
  return { left: a.left || '', right: a.right || '', rear: a.rear || '', front: a.front || '' }
}

// Rings the side UMU is asking about on the plan
async function markSide(key: SideKey | null) {
  clearTarget()
  if (!key) return
  await nextTick()
  const el = answerEl.value?.querySelector<HTMLElement>(`.${key}-side`)
  if (!el) return
  activeEl = el
  el.classList.add('ua-voice-target')
  reveal(el)
}

// Everyday words for each answer, beyond the option labels themselves
const SIDE_WORDS: { value: string; re: RegExp }[] = [
  { value: 'you', re: /\b(me|mine|my|myself|i do|i own|us|we do|ours|our|the seller|seller)\b/ },
  { value: 'neighbour', re: /\b(neighbou?rs?|next door|them|theirs|their)\b/ },
  { value: 'shared', re: /\b(shared|share|both|joint|jointly|split|half each|together)\b/ },
  { value: 'unknown', re: /\b(unknown|not sure|don ?t know|no idea|not certain|can ?t remember)\b/ },
]

async function pickSide(q: any, said: string): Promise<string | null> {
  const opts = boundaryOptions(q)
  const heard = [said, ...voice.alternatives.value]
  const opt = matchOption(heard, opts)
  if (opt) return (opt as any).value
  const text = ` ${heard.join(' ').toLowerCase().replace(/[^a-z ]/g, ' ')} `
  for (const w of SIDE_WORDS) {
    if (w.re.test(text) && opts.some((o) => o.value === w.value)) return w.value
  }
  understanding.value = true
  try {
    const meant = await understandAnswer(
      { kind: 'choice', question: 'Who looks after this boundary?', label: '', options: opts.map((o) => o.label) },
      [...new Set(heard)],
    )
    if (meant?.option) return opts.find((o) => o.label === meant.option)?.value || null
    if (meant?.intent === 'not_sure') return opts.find((o) => o.value === 'unknown')?.value || null
  } catch {
    // fall through to asking again
  } finally {
    understanding.value = false
  }
  return null
}

function setSide(q: any, key: SideKey, value: string) {
  q.answer = { ...boundaryAnswer(q), [key]: value }
  componentRev.value++
}

async function boundaryByVoice(q: any, id: number) {
  const labels = boundaryOptions(q).map((o) => o.label)
  let first = true
  for (const side of SIDES) {
    if (!alive(id) || current.value?.id !== q.id) return
    if (boundaryAnswer(q)[side.key]) continue
    await markSide(side.key)
    askingLabel.value = `Who looks after the ${side.name}?`
    const prompt = `${first ? 'Starting with the' : 'Next, the'} ${side.name}. Who looks after it? You can say ${orList(labels)}.`
    first = false
    await say(joinSay(takeAck(), prompt), id)
    for (let attempt = 0; attempt < 3; attempt++) {
      if (!alive(id) || current.value?.id !== q.id) return
      const said = await dictate({ kind: 'choice', el: answerEl.value!, label: side.name, options: [] }, id)
      if (!alive(id) || current.value?.id !== q.id) return
      const cmd = voiceCommand(said)
      if (cmd === 'stop') return stopVoiceMode()
      if (cmd === 'back') return goBack()
      if (cmd === 'skipQuestion') return skipQuestion()
      if (cmd === 'save') return finishByVoice(q.id, id)
      if (cmd === 'repeat') {
        await say(prompt, id)
        continue
      }
      // "Skip" leaves this side for now; "not sure" is a fair answer
      if (cmd === 'skip' && !isNotSure(said)) break
      if (!said) {
        if (attempt === 0) {
          await say("Take your time. Just tell me when you're ready, or tap the side on the plan.", id)
          continue
        }
        break
      }
      const value = await pickSide(q, said)
      if (!alive(id) || current.value?.id !== q.id) return
      if (value) {
        setSide(q, side.key, value)
        ack = `${capFirst(side.name)}, ${boundaryLabel(q, value)}.`
        break
      }
      await say(`Sorry, I didn't catch that. You can say ${orList(labels)}.`, id)
    }
  }
  if (!alive(id) || current.value?.id !== q.id) return
  clearTarget()
  finishByVoice(q.id, id)
}

// Tapping a side and choosing: UMU repeats the choice and points at the
// next side still to do
function boundaryTapGuide(before: Record<SideKey, string>) {
  const q: any = current.value
  if (!q || voiceMode.value) return
  const id = flow
  const now = boundaryAnswer(q)
  const changed = SIDES.find((s) => now[s.key] && now[s.key] !== before[s.key])
  const next = SIDES.find((s) => !now[s.key])
  const words: string[] = []
  if (changed) words.push(`${capFirst(changed.name)}, ${boundaryLabel(q, now[changed.key])}.`)
  if (next) {
    askingLabel.value = `Tap the ${next.name} on the plan`
    words.push(`Now tap the ${next.name}.`)
    markSide(next.key)
  } else {
    clearTarget()
    askingLabel.value = 'All done, tap Save and continue'
    words.push("That's all four sides. Check them, then tap Save and continue.")
  }
  say(joinSay(...words), id)
}

// ── Tap guide ──
// When the seller taps and types rather than talking, UMU still walks
// them through the question. After each answer it says it's done (or that
// it was changed, or cleared), checks the answer makes sense (an email that
// looks like one, a postcode, a full name), says when the answer opened or
// closed more questions, then points at the next box and says what it
// needs, until the question is ready to save. Everything UMU might say next
// is loaded while the seller answers, so it replies straight away.
let guideValues = new Map<Element, string>()
let guideTimer: ReturnType<typeof setTimeout> | null = null
let guideAckIndex = 0

// What a box holds right now, as text, so a change can be spotted
function valueOf(t: Target): string {
  if (t.kind === 'confirm') return t.el.classList.contains('is-confirmed') ? 'confirmed' : ''
  if (t.kind === 'choice') {
    return t.options.filter((o) => o.el.classList.contains('selected')).map((o) => optionSaid(o.label)).join(' | ')
  }
  if (t.kind === 'counter') return counterValue(t.el) ? String(counterValue(t.el)) : ''
  if (t.addOnEnter) return listItems(t).join(' | ')
  return t.el.value.trim()
}

// The names already added to a list box ("Full names of the sellers")
function listItems(t: InputTarget) {
  const wrap = t.el.closest('.multi-text-input-wrapper, .multi-text-input')
  return Array.from(wrap?.querySelectorAll('.item-text') || []).map((e) => (e.textContent || '').trim()).filter(Boolean)
}

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

// What UMU says when something typed doesn't look right
const PROBLEMS = {
  email: "That email address doesn't look quite right. It should look like name@example.com.",
  phone: 'That phone number looks too short. Please check it, including the area code.',
  postcode: "That postcode doesn't look right. It should look like C V 5, 7 L Y.",
  addressPostcode: 'Please add the postcode at the end of the address.',
  registration: 'A company registration number is usually 8 characters, like 12345678. Please check it.',
  percentage: 'Please enter a percentage between 0 and 100.',
  amount: 'Please enter the amount in numbers, like 1500.',
  number: 'Please enter a number.',
  fullName: 'Please use the full name, first name and surname, exactly as on the title deeds. Tap Edit to change it.',
  occupierName: "Please use the person's full name, first name and surname. Tap Edit to change it.",
}

// A plain-words problem with what was typed, or '' when it looks right
function problemWith(t: Target): string {
  if (t.kind !== 'input') return ''
  const el = t.el
  const value = valueOf(t)
  if (!value) return ''
  const hint = `${t.label} ${el.getAttribute('placeholder') || ''} ${el.getAttribute('aria-label') || ''}`.toLowerCase()
  if (t.addOnEnter) {
    const last = listItems(t).pop() || ''
    if (/name/.test(hint) && last && last.split(/\s+/).length < 2) {
      return /occupier|adult/.test(hint) ? PROBLEMS.occupierName : PROBLEMS.fullName
    }
    return ''
  }
  if ((el instanceof HTMLInputElement && el.type === 'email') || /email/.test(hint)) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value) ? '' : PROBLEMS.email
  }
  if (/phone|mobile|telephone/.test(hint)) {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 10 && digits.length <= 13 ? '' : PROBLEMS.phone
  }
  if (el.closest('.address-input') || /property address/.test(hint)) {
    return /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\s*$/i.test(value) ? '' : PROBLEMS.addressPostcode
  }
  if (/postcode|post code/.test(hint)) return UK_POSTCODE.test(value) ? '' : PROBLEMS.postcode
  if (/registration number/.test(hint)) {
    return /^[A-Z0-9]{8}$/i.test(value.replace(/\s/g, ''))
      ? ''
      : PROBLEMS.registration
  }
  if (/percent|%/.test(hint)) {
    const n = parseFloat(value.replace(/[^\d.]/g, ''))
    return Number.isNaN(n) || n > 100 ? PROBLEMS.percentage : ''
  }
  if (/amount|price|£|rent|charge|fee/.test(hint) || el.getAttribute('inputmode') === 'decimal') {
    return /\d/.test(value) ? '' : PROBLEMS.amount
  }
  if (/years|units|number of/.test(hint)) return /\d/.test(value) ? '' : PROBLEMS.number
  return ''
}

// The short reply after an answer: just the answer the seller gave
// ("You selected Flat."), whether it is their first or a new one
function guideAck(t: Target, before: string | undefined) {
  const now = valueOf(t)
  if (t.kind === 'confirm') return 'Great, address confirmed.'
  if (t.kind === 'choice') {
    const was = before ? before.split(' | ') : []
    const picked = now ? now.split(' | ') : []
    const added = picked.filter((x) => !was.includes(x))
    const removed = was.filter((x) => !picked.includes(x))
    if (added.length) return selectedLine(added)
    if (removed.length) return `You removed ${andList(removed)}.`
    return ''
  }
  if (t.kind === 'counter') return `You selected ${now || 0}.`
  if (isRange(t.el)) return `You selected ${sliderAnswer(t.el)}.`
  if (t.el.classList.contains('currency-box__value')) return `You selected ${now}.`
  if (t.addOnEnter) return "Added. If there's anyone else, add them the same way."
  return ['Done.', 'Thanks.', 'Lovely.'][guideAckIndex++ % 3]
}

// Loads everything UMU might say next, so it replies without a pause
function prefetchGuide(mode: 'voice' | 'tap') {
  const all = collectTargets()
  const lines = new Set<string>()
  // The replies to the open boxes first: those are needed soonest
  for (const t of all) {
    if (t.kind === 'choice') for (const o of t.options) lines.add(selectedLine([optionSaid(o.label)]))
    if (!isFilled(t)) lines.add(targetPrompt(t, false, mode))
  }
  GUIDE_LINES.forEach((l) => lines.add(l))
  if (all.some((t) => t.kind === 'input')) Object.values(PROBLEMS).forEach((l) => lines.add(l))
  lines.forEach((l) => voice.prefetch(l))
}
const GUIDE_LINES = [
  'Done.',
  'Thanks.',
  'Lovely.',
  "Added. If there's anyone else, add them the same way.",
  'Great, address confirmed.',
  'No problem.',
  'That opens one more question.',
  'That opens a few more details to fill in.',
  "Those extra questions aren't needed now.",
  "That's everything for this question.",
  'Check your answers, then tap Save and continue.',
  'Some boxes still need an answer.',
]

// Starts from the form as it is now, highlights the first open box and
// returns it.
function resetGuide(): Target | null {
  if (guideTimer) clearTimeout(guideTimer)
  const all = collectTargets()
  guideValues = new Map(all.map((t) => [t.el, valueOf(t)]))
  const next = all.find(needsAnswer) || null
  if (next && !voiceMode.value) {
    setTarget(next)
    askingLabel.value = targetLabel(next, 'tap')
  }
  prefetchGuide(voiceMode.value ? 'voice' : 'tap')
  return next
}

// Waits a moment for the form to settle (a follow-up opening, a list
// adding a name), then replies
function scheduleGuide() {
  if (voiceMode.value || phase.value !== 'question') return
  if (guideTimer) clearTimeout(guideTimer)
  guideTimer = setTimeout(guideCheck, 200)
}

async function guideCheck() {
  if (voiceMode.value || saving.value || phase.value !== 'question' || !answerEl.value) return
  const id = flow
  const all = collectTargets()
  const before = guideValues
  const answered: Target[] = []
  const cleared: Target[] = []
  for (const t of all) {
    if (!before.has(t.el)) continue
    const was = before.get(t.el) || ''
    const now = valueOf(t)
    if (now && now !== was && isFilled(t)) answered.push(t)
    else if (was && !now) cleared.push(t)
  }
  // The address card can arrive a moment late; it isn't a new question
  const opened = all.filter((t) => !before.has(t.el) && !isFilled(t) && t.kind !== 'confirm')
  const closed = [...before.keys()].filter((el) => !all.some((t) => t.el === el) && !document.contains(el))
  guideValues = new Map(all.map((t) => [t.el, valueOf(t)]))
  if (!answered.length && !cleared.length && !opened.length && !closed.length) return

  const words: string[] = []
  const last = answered[answered.length - 1]
  if (last) words.push(guideAck(last, before.get(last.el) || undefined))

  // Something typed doesn't look right: say so and stay on that box
  const wrong = answered.find((t) => problemWith(t))
  if (wrong) {
    const problem = problemWith(wrong)
    setTarget(wrong)
    askingLabel.value = problem.replace(/ Tap Edit to change it\.$/, '')
    await say(problem, id)
    return
  }

  if (opened.some((t) => t.el.closest('.address-input'))) words.push('No problem.')
  else if (opened.length) words.push(openedNote(opened.length))
  else if (closed.length && last?.kind === 'choice') words.push("Those extra questions aren't needed now.")

  // A box that was emptied comes first, then the next open box after the
  // one just answered, else the first open one
  const from = last ? all.findIndex((t) => t.el === last.el) : -1
  const next =
    cleared.find((t) => !isFilled(t)) ||
    all.slice(from + 1).find(needsAnswer) ||
    all.find(needsAnswer)
  if (next) {
    setTarget(next)
    askingLabel.value = targetLabel(next, 'tap')
    if (cleared.includes(next)) words.push(`The ${next.label === 'answer' ? 'answer' : next.label.toLowerCase()} is empty now.`)
    words.push(targetPrompt(next, false, 'tap'))
  } else {
    clearTarget()
    // A radio answer saves by itself, so there is nothing more to say
    if (!needsSaveButton.value) return
    if (answerValid.value) {
      askingLabel.value = 'All done, tap Save and continue'
      words.push("That's everything for this question. Check your answers, then tap Save and continue.")
    } else {
      askingLabel.value = ''
      words.push('Some boxes still need an answer.')
    }
  }
  prefetchGuide('tap')
  await say(joinSay(...words), id)
}

const openedNote = (n: number) =>
  n === 1 ? 'That opens one more question.' : 'That opens a few more details to fill in.'

async function finishByVoice(qid: string, id: number) {
  // Already saving by itself: UMU has said the answer and moves on
  if (saving.value) return
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
  const sidesBefore = qType.value === 'boundary' ? boundaryAnswer(q) : null
  const mainKey = qType.value === 'multipart' ? mainChoicePart(q)?.partKey : null
  const mainBefore = mainKey && q.answer && typeof q.answer === 'object' ? q.answer[mainKey] : undefined
  // A Fixtures item can end on its second choice (Fitted or Freestanding)
  const choicesOf = (a: any) =>
    JSON.stringify((q.parts || []).filter((p: any) => p?.options?.length).map((p: any) => partValue(a?.[p.partKey]) ?? null))
  const choicesBefore = fixtureChoicePart(q) ? choicesOf(q.answer) : null
  q.answer = answer

  // A side of the boundary plan was chosen: say it, point at the next
  if (sidesBefore) return boundaryTapGuide(sidesBefore)

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

  // The rest save the same way once the main Yes or No leaves nothing else
  // to answer (a No closing the details box, say), as a plain Yes or No
  // question does. Some of them, like the newer Rights questions, have no
  // autoSaveOn of their own.
  if (qType.value === 'multipart' && !q.repeatable && answer && typeof answer === 'object') {
    const main = mainChoicePart(q)
    const changed = choicesBefore !== null
      ? choicesOf(answer) !== choicesBefore
      : !!main && partValue(answer[main.partKey]) !== partValue(mainBefore)
    if (!main || !changed) return
    // Tick boxes take several answers, so they wait for Save and continue
    if (String(main.type || '').toLowerCase() === 'checkbox') return
    await nextTick()
    await nextTick()
    if (current.value?.id !== q.id || saving.value || !answerValid.value) return
    if (awaitsUpload(q, answer, main)) return
    if (collectTargets().every((t) => !needsAnswer(t))) return saveCurrent(answer)
  }
}

// A Yes that shows an empty upload box (and no text box) waits for Save and
// continue, so the seller can add the document first: Leasehold's "notice
// that the landlord wants to sell". A No or Not applicable still saves.
function awaitsUpload(q: any, answer: any, main: any) {
  if (String(main?.type || '').toLowerCase() === 'date') return false
  const chosen = (main.options || []).find((o: any) => o?.value === partValue(answer[main.partKey]))
  if (/^no\b|not applicable|not known/i.test(String(chosen?.label || ''))) return false
  return (q.parts || []).some((p: any) => {
    if (!p || p === main || String(p.type || '').toLowerCase() !== 'upload' || String(p.display || '').toLowerCase() === 'both') return false
    const shown = !p.conditionalOn || (p.showOnValues || []).includes(partValue(answer[p.conditionalOn]))
    const files = answer[p.partKey]
    return shown && !(Array.isArray(files) ? files.length : files)
  })
}

// The Yes or No a multipart question opens with, when it opens with one
function mainChoicePart(q: any) {
  const first = [...(q?.parts || [])].sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))[0]
  return first && Array.isArray(first.options) && first.options.length ? first : null
}
const partValue = (v: any) => (v !== null && typeof v === 'object' && 'value' in v ? v.value : v)

// After a No to the main question, an optional box that shows whatever the
// answer (the names of other occupiers) isn't asked for
function waivedByNo(t: Target) {
  const q: any = current.value
  if (qType.value !== 'multipart') return false
  const main = mainChoicePart(q)
  if (!main || partValue(q.answer?.[main.partKey]) !== 'no') return false
  const key = t.el.closest<HTMLElement>('[data-part-key]')?.dataset.partKey
  const part = key ? q.parts.find((p: any) => p.partKey === key) : null
  return !!part && part !== main && !part.required && !part.conditionalOn
}

// Fixtures and Fittings: the part answered Included, Excluded or None
function fixtureChoicePart(q: any) {
  if (qType.value !== 'multipart') return null
  return (q?.parts || []).find((p: any) => {
    const labels = (p?.options || []).map((o: any) => String(o?.label || '').trim().toLowerCase())
    return labels.includes('included') && labels.includes('excluded')
  }) || null
}
const isExcluded = (part: any, value: any) =>
  (part?.options || []).find((o: any) => o?.value === partValue(value))?.label?.trim().toLowerCase() === 'excluded'

// On a Fixtures item the price box is only asked for after Excluded (the
// price for selling it to the buyer) and the comments box never is. Both
// are optional, so Included or None saves straight away.
function waivedForFixture(t: Target) {
  if (t.kind === 'choice') return false
  const q: any = current.value
  const main = fixtureChoicePart(q)
  if (!main) return false
  const key = t.el.closest<HTMLElement>('[data-part-key]')?.dataset.partKey
  const part = key ? q.parts.find((p: any) => p.partKey === key) : null
  if (!part || part.required || part.conditionalOn) return false
  // "Other ..." items: the seller names the item, so those boxes are asked
  if (/^(item|room) (name|description)$/i.test(String(part.title || '').trim())) return false
  const isPrice = /asking price|selling price/i.test(`${part.title || ''} ${JSON.stringify(part.options || [])}`)
  return !isPrice || !isExcluded(main, q.answer?.[main.partKey])
}

// Untitled boxes that aren't needed (Leasehold): a comments box under a
// choice is optional, and the box under a list that ends "Other, specify
// below" is only for Other
function waivedOptionalBox(t: Target) {
  if (t.kind === 'choice' || qType.value !== 'multipart') return false
  const q: any = current.value
  const key = t.el.closest<HTMLElement>('[data-part-key]')?.dataset.partKey
  const parts = [...(q.parts || [])].filter(Boolean).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
  const i = parts.findIndex((p: any) => p.partKey === key)
  const part = parts[i]
  if (!part || part.required || part.conditionalOn || String(part.title || '').trim()) return false
  if (/\bcomments?\b/i.test(part.placeholder || '')) return true
  const list = parts[i - 1]
  const other = (list?.options || []).find((o: any) => /^other\b/i.test(String(o?.label || '').trim()))
  if (!other) return false
  const chosen = q.answer?.[list.partKey]
  const picked = (Array.isArray(chosen) ? chosen : [chosen]).map(partValue)
  return !picked.includes(other.value) && !picked.includes(other.label)
}

// A box UMU still needs an answer for
const needsAnswer = (t: Target) => !isFilled(t) && !waivedByNo(t) && !waivedForFixture(t) && !waivedOptionalBox(t)

// What UMU says the moment an answer is given, before it has saved: the
// choice itself ("You selected No.") or a short thanks. Every line here is
// loaded ahead, so it plays straight away and the seller knows UMU heard.
function heardLine(q: any, value: any) {
  if (qType.value === 'note') return 'Thanks.'
  const labelOf = (options: any[], v: any) =>
    (options || []).find((o: any) => o?.value === v || o?.label === v)?.label
  let label = typeof value === 'string' ? labelOf(q.options, value) : ''
  if (!label && qType.value === 'multipart' && value && typeof value === 'object') {
    const first = (q.parts || []).find((p: any) => Array.isArray(p.options) && p.options.length)
    const v = first ? value[first.partKey] : undefined
    label = first ? labelOf(first.options, v && typeof v === 'object' ? v.value : v) : ''
  }
  return label ? selectedLine([optionSaid(label)]) : 'Got it.'
}

// "You selected No." for the seller's answer. A choice named like an
// instruction ("Select year", "Enter amount") is not an answer to say back
// ("You selected Select year."), so UMU just says "Got it." for it.
const INSTRUCTION_LABEL = /^(select|enter|choose|please|add|type)\b/i
function selectedLine(said: string[]) {
  const answers = said.map((x) => (x || '').trim()).filter((x) => x && !INSTRUCTION_LABEL.test(x))
  return answers.length ? `You selected ${andList(answers)}.` : 'Got it.'
}
// Playing while the answer saves; the next question waits for it to finish.
// heardRun counts answers, so a wait can tell a newer one has come in.
let heardSpeech: Promise<boolean> | null = null
let heardRun = 0

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
  askingLabel.value = ''
  // By voice the reply is already worked out ("You selected Yes."). A tap
  // on an answer says the answer; Save and continue (no value) says thanks.
  const heard = takeAck() || (value === undefined ? 'Got it.' : heardLine(q, value))
  heardRun++
  heardSpeech = voice.speak(heard)
  try {
    const { pointsAwarded } = await rt.saveAnswer(q.id, answer)
    skipped.delete(q.id)
    addPoints(pointsAwarded)
    savedPrefix = pointsAwarded ? `Saved, plus ${pointsAwarded} points.` : 'Saved.'
    await checkPathwayThenFinish(q, value !== undefined ? value : q.answer)
  } catch {
    heardSpeech = null
    voice.stopSpeaking()
    saveError.value = "That didn't save. Please try again."
  } finally {
    saving.value = false
  }
}

// Lets UMU finish "You selected No." before it reads the next question,
// but never holds the next question up for long
async function afterHeard() {
  const p = heardSpeech
  heardSpeech = null
  if (p) await Promise.race([p, new Promise((r) => setTimeout(r, 2500))])
}

// After a save, an answer can open a guided follow-up (manual page rule).
let pendingAfterPathway: any = null
const activePathway = ref<any>(null)
const pathwayAttempt = ref(0)

// The task-complete call for the answer just saved. It doesn't depend on
// the guidance lookup, so the two run at the same time.
let taskDone: { qid: string; result: Promise<any> } | null = null

async function checkPathwayThenFinish(q: any, answerForGuidance: any) {
  taskDone = { qid: q.id, result: completeTaskIfDone(q._taskId) }
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
  const pending = taskDone?.qid === q.id ? taskDone.result : null
  taskDone = null
  const result = await (pending || completeTaskIfDone(q._taskId))
  if (result?.sectionCompleted) {
    sectionBonusPoints.value = result.sectionBonusPoints ?? 0
    const after = result.balanceAfterBonus ?? balance.value + sectionBonusPoints.value
    totalPointsAfter.value = after
    totalPointsBefore.value = Math.max(0, after - sectionBonusPoints.value)
    countUp(balance.value, after, 1200)
    balance.value = after
    setPose('celebrate', 4000)
    const run = heardRun
    afterHeard().then(() => run === heardRun && voice.speak(`Brilliant! Your ${sectionTitle.value} is complete.`))
    showSectionComplete.value = true
    return
  }
  // Stamps earned by finishing the task show once any follow-up is done
  if (result) setTimeout(() => checkForCelebrations(), 800)
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
    return await rt.completeTask(taskId)
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
  toQuestionTop()
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
    toQuestionTop()
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
  toQuestionTop()
}

// The next question starts at its top. On phones the page scrolls rather
// than the sheet, so after Skip or Save at the foot of a long question the
// next one opened scrolled to its end, title out of sight; the page now
// brings the title back below the site bar (and never moves when it's in
// view already).
function toQuestionTop() {
  talkEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
  const box = talkEl.value
  if (!box || getComputedStyle(box).overflowY !== 'visible') return
  nextTick(() => {
    const head = document.querySelector<HTMLElement>('.ua-sheet-head')
    if (!head) return
    const navBottom = document.querySelector('.hsw-nav')?.getBoundingClientRect().bottom || 0
    const top = head.getBoundingClientRect().top
    if (top < navBottom) window.scrollBy({ top: top - navBottom - 12, behavior: 'smooth' })
  })
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

/* Sections UMU can help with */
.ua-rail {
  margin-top: 14px;
  --usr-accent: var(--ua-cyan);
  --usr-tick-gap: #0d2742;
}

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
.ua-caption-who > .ua-who-name { width: auto; height: auto; }
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
/* The longest questions (Rights, Other Charges) a size down, so the
   answers stay in view */
.ua-q.is-long { font-size: 20px; }
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
/* The side of the boundary plan UMU is asking about */
.ua-answer :deep(.side.ua-voice-target) {
  color: var(--ua-teal-dark);
  outline: 3px solid var(--ua-teal);
  outline-offset: 3px;
}
.ua-answer :deep(.ua-dup-title) { display: none; }
/* A part's "What is this?" sits under its answers, as the question's own
   does, so a long question never pushes Yes and No out of view */
.ua-answer :deep(.group-part) { display: flex; flex-direction: column; }
.ua-answer :deep(.group-part > .part-help-section) { order: 1; margin: 16px 0 0; }
/* The question's own "What is this?" */
.ua-help {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
}
.ua-help-ic { width: 18px; height: 18px; flex-shrink: 0; margin-top: 1px; color: #d97706; }
.ua-help-title { margin: 0 0 4px; font-size: 13.5px; font-weight: 800; color: var(--ua-navy); }
.ua-help-text { margin: 0; font-size: 14px; line-height: 1.6; color: #475569; }
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
/* Up next, after a section */
.ua-next {
  display: flex;
  align-items: center;
  gap: 12px;
  width: min(360px, 100%);
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #fff;
  text-align: left;
}
.ua-next-ic { width: 40px; height: 40px; flex-shrink: 0; }
.ua-next-body { display: flex; flex-direction: column; min-width: 0; }
.ua-next-kicker { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ua-teal-dark); }
.ua-next-title { font-size: 16px; font-weight: 800; color: var(--ua-navy); }
.ua-next-meta { font-size: 12.5px; font-weight: 600; color: #64748b; }
.ua-done-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
}
.ua-back-btn {
  height: 46px;
  padding: 0 18px;
  border: 1px solid #d8e3ee;
  border-radius: 12px;
  background: #fff;
  color: var(--ua-navy);
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}
.ua-back-btn:hover { background: #f8fbff; border-color: #bfd1e4; }
.ua-back-btn:focus-visible { outline: 3px solid var(--ua-cyan); outline-offset: 3px; }
.ua-done-hint { margin: 2px 0 0; font-size: 13px; color: #64748b; }

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
  .ua-q.is-long { font-size: 17px; }
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
  .ua-bot { width: 76px; }
}

/* ── Phone fit (2026-10-22): measured at 320, 360 and 390 ────────────
   The header used four lines, the speech bubble refused to shrink and
   pushed the robot off the left edge, Skip for now wrapped, and the
   section-complete card kept a tall empty gap. */
@media (max-width: 640px) {
  .ua-title,
  .ua-top-sub {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* The bubble shrinks to the space it has, so the robot keeps its own */
  .ua-caption { min-width: 0; }
  .ua-caption-head { flex-wrap: wrap; row-gap: 4px; }
  .ua-caption-status { min-width: 0; white-space: normal; }
  .ua-bot { flex-shrink: 0; }
  .ua-foot-actions { gap: 6px; }
  .ua-skip { flex: 0 0 auto !important; padding: 0 12px; white-space: nowrap; }
  .ua-done { min-height: 0; justify-content: flex-start; padding: 6px 0 4px; }
  /* Four lines at most; the watcher keeps the spoken word in view */
  .ua-caption-text { max-height: 6em; overflow: hidden; }
  .ua-caption-text.is-scrolled {
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 1.2em);
    mask-image: linear-gradient(to bottom, transparent 0, #000 1.2em);
  }
  /* A long section name ("MANAGEMENT AND RESPONSIBILITIES") pushed the
     "Question 43 of 52" pill out of the card; the pill now wraps under it */
  .ua-sheet-meta { flex-wrap: wrap; row-gap: 6px; }
  .ua-kicker { min-width: 0; }
  /* A long button label wraps rather than running off the card */
  .ua-save { min-width: 0; white-space: normal; text-align: center; line-height: 1.2; }
}
/* Smallest phones: "UMU is speaking" broke over two lines in the bubble */
@media (max-width: 360px) {
  .ua-caption-status { font-size: 11px; gap: 5px; }
  .ua-caption-head { gap: 6px; }
}
/* Narrow phones: "Save and continue" ran past the card beside Skip for now;
   the main action now takes the full width, with Skip under it */
@media (max-width: 420px) {
  .ua-foot-actions { flex-direction: column-reverse; align-items: stretch; gap: 4px; }
  /* flex: 0 0 auto, not the row's flex: 1: in a column a zero basis
     squashed Save and continue to a sliver */
  .ua-foot-actions > * { flex: 0 0 auto; width: 100%; }
  .ua-save { min-height: 46px; height: auto; padding-top: 10px; padding-bottom: 10px; }
  .ua-skip { height: 40px; }
}
@media (max-width: 440px) {
  /* "UMU is speaking" says who already; the name kept the bubble's top
     line from fitting, so only the robot icon stays in front of it */
  .ua-caption:not(.is-you) .ua-who-name { display: none; }
  .ua-caption-head { flex-wrap: nowrap; }
  .ua-title-lead,
  .ua-top-sub.has-count .ua-top-section,
  .ua-top-sep { display: none; }
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
