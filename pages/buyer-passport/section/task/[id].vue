<template>
  <div class="bt-root">

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
          <button class="hsw-back" type="button" @click="navigateTo(backUrl)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Section
          </button>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="btw-loading">
      <div class="btw-spinner" />
    </div>

    <template v-else-if="task">
      <main class="hsw-shell btw-layout">
        <!-- ── Sticky aside ──────────────────────────────────────────── -->
        <aside class="btw-aside">
          <section class="qpanel">
            <span class="qpanel-badge">
              <span class="dot" />
              {{ section?.title || '' }}
            </span>
            <div class="qpanel-icon" aria-hidden="true">
              <OPIcon :name="section?.imageKey || 'ownershipProfile'" class="w-[32px] h-[32px]" />
            </div>
            <h1 class="qpanel-title">{{ task.title || firstQuestionLabel }}</h1>
            <p class="qpanel-sub">{{ task.description || section?.description || 'Official property record' }}</p>

            <div class="qpanel-divider" />

            <div class="qpanel-progress">
              <div class="qring" :style="{ '--p': taskProgressPct }">
                <span>{{ taskAnsweredCount }}/{{ taskTotalQuestions }}</span>
              </div>
              <div class="qmeta-text">
                <small>Task answered</small>
                <strong>
                  {{ taskRemainingQuestions }}
                  {{ taskRemainingQuestions === 1 ? 'question' : 'questions' }} remaining
                </strong>
              </div>
            </div>

            <div class="qpanel-actions">
              <button class="qpanel-btn qpanel-btn--help" @click="openSectionHelp">
                <OPIcon name="helpIcon" class="w-[15px] h-[15px]" />Help
              </button>
              <button class="qpanel-btn qpanel-btn--video" @click="openSectionVideo">
                <span class="qpanel-play"><OPIcon name="playIcon" class="w-[13px] h-[13px]" /></span>
                Play Video
              </button>
            </div>
          </section>
        </aside>

        <!-- ── Main content ──────────────────────────────────────────── -->
        <div class="btw-content">
          <!-- Question navigation header -->
          <div class="qhead">
            <div class="qhead-left">
              <span class="qeyebrow">This Section</span>
              <h2 class="qhead-title">Question {{ activeIndex + 1 }}</h2>
              <p class="qhead-sub">{{ activeIndex + 1 }} of {{ visibleQuestions.length }} in this section</p>
            </div>
            <div class="qhead-nav">
              <button class="qnav qnav--prev" :disabled="activeIndex === 0" @click="activeIndex--">
                <span aria-hidden="true">←</span> Previous
              </button>
              <button class="qnav qnav--next" :disabled="activeIndex >= visibleQuestions.length - 1" @click="activeIndex++">
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <!-- Segmented progress -->
          <div class="qprogress">
            <div class="qprogress-track">
              <span
                v-for="(_, i) in visibleQuestions"
                :key="i"
                class="qseg"
                :class="{ 'qseg--done': i <= activeIndex }"
              />
            </div>
            <div class="qprogress-labels">
              <span>Question {{ activeIndex + 1 }} of {{ visibleQuestions.length }}</span>
              <span>{{ Math.max(0, visibleQuestions.length - activeIndex - 1) }} remaining</span>
            </div>
          </div>

          <!-- Single active question card -->
          <div class="task-items">
            <div v-for="q in [activeQuestion].filter(Boolean)" :key="q.id" class="task-item">
              <div class="task-item-header">
                <h3 class="task-item-title">{{ getCardTitle(q) }}</h3>
                <span class="task-item-status" :class="getStatusClass(q)">
                  <svg v-if="q.answer" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ getStatusLabel(q) }}
                </span>
              </div>

              <div class="task-item-answer" :class="{ 'task-item-answer--empty': !q.answer }">
                <span class="task-item-answer-label">Seller's Answer</span>
                <div class="task-item-detail">
                <!-- ── MULTIPART ── -->
                <template v-if="q.type === 'MULTIPART' && Array.isArray(q.parts) && q.parts.length">
                  <div v-for="part in answerParts(q)" :key="part.partKey">
                    <template v-if="isRadioPart(part)">
                      <div v-if="!isFixturesSection && getPartValue(q, part.partKey)" class="detail-answer-pill">
                        {{ getSelectedOptionLabel(part.options, getPartValue(q, part.partKey)) }}
                      </div>
                      <div v-if="getCurrencyValue(q, part)" class="detail-currency">
                        <span class="detail-currency-label">Asking price</span>
                        <span class="detail-currency-value">{{ getCurrencyValue(q, part) }}</span>
                      </div>
                    </template>
                    <template v-else-if="(part.type === 'text' || part.type === 'address' || isTextUploadPart(part)) && isObjectWithText(getPartValue(q, part.partKey))">
                      <div v-if="extractPartNote(getPartValue(q, part.partKey))" class="detail-note">
                        <div class="detail-note-bar" />
                        <div class="detail-note-body">
                          <span class="detail-note-label">Seller's note</span>
                          <p class="detail-note-text">{{ extractPartNote(getPartValue(q, part.partKey)) }}</p>
                        </div>
                      </div>
                      <div v-if="extractPartFiles(getPartValue(q, part.partKey)).length" class="detail-files">
                        <div v-for="(file, fi) in extractPartFiles(getPartValue(q, part.partKey))" :key="fi" class="detail-file-row">
                          <div class="detail-file-icon">
                            <svg v-if="isImage(file.url)" width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00a19a" stroke-width="1.5"/>
                              <circle cx="8.5" cy="8.5" r="1.5" fill="#00a19a"/>
                              <path d="M21 15l-5-5L5 21" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" stroke-width="1.5"/>
                              <polyline points="14,2 14,8 20,8" stroke="#6366f1" stroke-width="1.5"/>
                            </svg>
                          </div>
                          <span class="detail-file-name">{{ file.name }}</span>
                          <div class="detail-file-actions">
                            <button v-if="file.url" class="detail-file-btn detail-file-btn--download" @click.stop="downloadFile(file.url, file.name)">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                              </svg>
                              Download
                            </button>
                            <span v-else class="detail-file-pending">Pending upload</span>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="part.type === 'text' || part.type === 'address' || isTextUploadPart(part)">
                      <div v-if="getPartValue(q, part.partKey)" class="detail-text-answer">{{ getPartValue(q, part.partKey) }}</div>
                    </template>
                    <template v-else-if="part.type === 'date'">
                      <div v-if="getPartValue(q, part.partKey)" class="detail-answer-block">
                        <span class="detail-answer-label">{{ part.title || 'Date' }}</span>
                        <span class="detail-answer-value">{{ formatDate(getPartValue(q, part.partKey)) }}</span>
                      </div>
                    </template>
                    <template v-else-if="part.type === 'multitextinput'">
                      <div v-if="part.title" class="detail-part-label">{{ part.title }}</div>
                      <div class="detail-list">
                        <template v-if="Array.isArray(getPartValue(q, part.partKey))">
                          <div v-for="(item, i) in getPartValue(q, part.partKey)" :key="i" class="detail-list-item">{{ item }}</div>
                        </template>
                        <div v-else-if="getPartValue(q, part.partKey)" class="detail-list-item">{{ getPartValue(q, part.partKey) }}</div>
                      </div>
                    </template>
                    <template v-else-if="part.type === 'multifieldform'">
                      <div v-if="part.title" class="detail-part-label">{{ part.title }}</div>
                      <template v-if="getPartValue(q, part.partKey)">
                        <div class="detail-fields">
                          <template v-if="Array.isArray(getPartValue(q, part.partKey))">
                            <div v-for="(entry, ei) in getPartValue(q, part.partKey)" :key="ei" class="detail-field-entry">
                              <div v-for="(val, key) in entry" :key="key" class="detail-field-row">
                                <span class="detail-field-key">{{ fieldLabel(part, String(key)) }}</span>
                                <span class="detail-field-val">{{ val }}</span>
                              </div>
                            </div>
                          </template>
                          <template v-else>
                            <div class="detail-field-entry">
                              <div v-for="(val, key) in getPartValue(q, part.partKey)" :key="key" class="detail-field-row">
                                <span class="detail-field-key">{{ fieldLabel(part, String(key)) }}</span>
                                <span class="detail-field-val">{{ val }}</span>
                              </div>
                            </div>
                          </template>
                        </div>
                      </template>
                    </template>
                  </div>
                  <p v-if="!q.answer" class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── RADIO ── -->
                <template v-else-if="q.type === 'RADIO'">
                  <div v-if="getSimpleAnswer(q)" class="detail-answer-pill">
                    {{ getSelectedOptionLabel(q.options, getSimpleAnswer(q) ?? '') }}
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── CHECKBOX ── -->
                <template v-else-if="q.type === 'CHECKBOX'">
                  <div v-if="getCheckedLabels(q).length" class="detail-chips">
                    <span v-for="label in getCheckedLabels(q)" :key="label" class="detail-chip">{{ label }}</span>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── TEXT ── -->
                <template v-else-if="q.type === 'TEXT'">
                  <div v-if="getSimpleAnswer(q)" class="detail-text-answer">{{ getSimpleAnswer(q) }}</div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── DATE ── -->
                <template v-else-if="q.type === 'DATE'">
                  <div v-if="getSimpleAnswer(q)" class="detail-text-answer">{{ formatDate(getSimpleAnswer(q)) }}</div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── SCALE ── -->
                <template v-else-if="q.type === 'SCALE'">
                  <div v-if="getSimpleAnswer(q)" class="detail-scale">
                    <span class="detail-scale-value">{{ getSimpleAnswer(q) }}</span>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── CHIPS ── -->
                <template v-else-if="q.type === 'CHIPS'">
                  <div v-if="getChipAnswers(q).length" class="detail-chips">
                    <span v-for="chip in getChipAnswers(q)" :key="chip" class="detail-chip">{{ chip }}</span>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── MULTITEXTINPUT ── -->
                <template v-else-if="q.type === 'MULTITEXTINPUT'">
                  <div v-if="getListAnswers(q).length" class="detail-list">
                    <div v-for="(item, i) in getListAnswers(q)" :key="i" class="detail-list-item">{{ item }}</div>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── MULTIFIELDFORM ── -->
                <template v-else-if="q.type === 'MULTIFIELDFORM'">
                  <div v-if="getFieldFormAnswers(q).length" class="detail-fields">
                    <div v-for="(entry, ei) in getFieldFormAnswers(q)" :key="ei" class="detail-field-entry">
                      <div v-for="(val, key) in entry" :key="key" class="detail-field-row">
                        <span class="detail-field-key">{{ fieldLabelFromQuestion(q, key) }}</span>
                        <span class="detail-field-val">{{ val }}</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── BOUNDARY ── -->
                <template v-else-if="q.type === 'BOUNDARY'">
                  <div v-if="q.answer" class="detail-boundary">
                    <div v-for="(val, side) in getBoundaryAnswers(q)" :key="side" class="detail-field-row">
                      <span class="detail-field-key">{{ side }}</span>
                      <span class="detail-field-val">{{ val }}</span>
                    </div>
                  </div>
                  <p v-else class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- ── UPLOAD ── -->
                <template v-else-if="q.type === 'UPLOAD'">
                  <div v-if="getFiles(q).length" class="detail-files">
                    <div v-for="(file, fi) in getFiles(q)" :key="fi" class="detail-file-row">
                      <div class="detail-file-icon">
                        <svg v-if="isImage(file.url)" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00a19a" stroke-width="1.5"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="#00a19a"/>
                          <path d="M21 15l-5-5L5 21" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" stroke-width="1.5"/>
                          <polyline points="14,2 14,8 20,8" stroke="#6366f1" stroke-width="1.5"/>
                        </svg>
                      </div>
                      <span class="detail-file-name">{{ file.name }}</span>
                      <div class="detail-file-actions">
                        <button v-if="file.url" class="detail-file-btn detail-file-btn--download" @click.stop="downloadFile(file.url, file.name)">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          </svg>
                          Download
                        </button>
                        <span v-else class="detail-file-pending">Pending upload</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="detail-no-answer">No document uploaded by seller</p>
                </template>

                <!-- ── Fallback ── -->
                <template v-else>
                  <div v-if="getSimpleAnswer(q)" class="detail-text-answer">{{ getSimpleAnswer(q) }}</div>
                  <p v-else-if="!q.answer" class="detail-no-answer">Not yet answered by seller</p>
                </template>

                <!-- Seller's note (non-MULTIPART) -->
                <div v-if="q.type !== 'MULTIPART' && getNote(q)" class="detail-note">
                  <div class="detail-note-bar" />
                  <div class="detail-note-body">
                    <span class="detail-note-label">Seller's note</span>
                    <p class="detail-note-text">{{ getNote(q) }}</p>
                  </div>
                </div>

                <!-- File attachments (non-MULTIPART, non-UPLOAD) -->
                <div v-if="q.type !== 'MULTIPART' && q.type !== 'UPLOAD' && getFiles(q).length" class="detail-files">
                  <div v-for="(file, fi) in getFiles(q)" :key="fi" class="detail-file-row">
                    <div class="detail-file-icon">
                      <svg v-if="isImage(file.url)" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00a19a" stroke-width="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" fill="#00a19a"/>
                        <path d="M21 15l-5-5L5 21" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" stroke-width="1.5"/>
                        <polyline points="14,2 14,8 20,8" stroke="#6366f1" stroke-width="1.5"/>
                      </svg>
                    </div>
                    <span class="detail-file-name">{{ file.name }}</span>
                    <div class="detail-file-actions">
                      <button class="detail-file-btn detail-file-btn--download" @click.stop="downloadFile(file.url, file.name)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            <div v-if="visibleQuestions.length === 0" class="task-empty">
              <p>No questions in this task.</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </template>

    <HelpDrawer :show="showHelp" :content="activeHelpContent" mode="buyer" @close="showHelp = false" />
    <VideoModal :show="showVideo" :videoUrl="activeVideoUrl" @close="showVideo = false" />
  </div>
</template>

<script setup lang="ts">
import OPIcon from '~/components/ui/OPIcon.vue'
import HelpDrawer from '@/components/passport-view/HelpDrawer.vue'
import VideoModal from '@/components/passport-view/VideoModal.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const config = useRuntimeConfig()

const taskId = route.params.id as string
const passportId = route.query.passportId as string
const sectionId = route.query.sectionId as string

const allData = ref<any>(null)
const loading = ref(true)
const activeIndex = ref(0)
const showHelp = ref(false)
const showVideo = ref(false)
const activeHelpContent = ref<any>(null)
const activeVideoUrl = ref<string | null>(null)

onMounted(async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    allData.value = await $fetch(`${config.public.apiBase}/passport/${passportId}/buyer-view`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    activeIndex.value = taskStartIndex.value
  } catch (e) {
    console.error('Failed to load buyer view', e)
  } finally {
    loading.value = false
  }
})

const section = computed(() =>
  allData.value?.sections?.find((s: any) => s.id === sectionId) ?? null
)

const task = computed(() => {
  if (!allData.value?.sections) return null
  for (const s of allData.value.sections) {
    const t = s.tasks?.find((t: any) => t.id === taskId)
    if (t) return t
  }
  return null
})

const isFixturesSection = computed(() => section.value?.key === 'fixturesAndFittings')

const visibleQuestions = computed(() => {
  if (!section.value) return []
  const qs: any[] = []
  for (const t of section.value.tasks ?? []) {
    for (const q of (t.questions ?? []).filter((q: any) => q.type !== 'NOTE')) {
      qs.push(q)
    }
  }
  return qs
})

const taskStartIndex = computed(() => {
  if (!section.value) return 0
  let idx = 0
  for (const t of section.value.tasks ?? []) {
    const qs = (t.questions ?? []).filter((q: any) => q.type !== 'NOTE')
    if (t.id === taskId) return idx
    idx += qs.length
  }
  return 0
})

const firstQuestionLabel = computed(() => {
  const q = visibleQuestions.value[taskStartIndex.value] ?? visibleQuestions.value[0]
  if (!q) return ''
  if (q.question) return q.question
  if (Array.isArray(q.parts) && q.parts[0]?.title) return q.parts[0].title
  return ''
})

const currentTaskQuestions = computed(() =>
  (task.value?.questions ?? []).filter((q: any) => q.type !== 'NOTE'),
)
const taskTotalQuestions = computed(() => currentTaskQuestions.value.length)
const taskAnsweredCount = computed(() =>
  currentTaskQuestions.value.filter(
    (q: any) => q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl),
  ).length,
)
const taskRemainingQuestions = computed(
  () => Math.max(0, taskTotalQuestions.value - taskAnsweredCount.value),
)
const taskProgressPct = computed(() =>
  taskTotalQuestions.value
    ? Math.round((taskAnsweredCount.value / taskTotalQuestions.value) * 100)
    : 0,
)

const backUrl = computed(() =>
  `/buyer-passport/section/${sectionId}?passportId=${passportId}`
)

const activeQuestion = computed(() => visibleQuestions.value[activeIndex.value] ?? null)

function getCardTitle(q: any): string {
  if (q.question) return q.question
  if (Array.isArray(q.parts) && q.parts[0]?.title) return q.parts[0].title
  return 'Question'
}

function answerParts(q: any): any[] {
  if (!Array.isArray(q.parts)) return []
  return q.parts.filter((p: any) => {
    if (Array.isArray(p.options) && p.options.every((o: any) => o.inputType === 'currency')) return false
    if (p.type === 'date' && p.partKey?.includes('selling')) return false
    return true
  })
}

function isRadioPart(part: any): boolean {
  return (part.type || '').toLowerCase() === 'radio'
}

function isTextUploadPart(part: any): boolean {
  const t = (part.type || '').toLowerCase()
  return t === 'text-upload' || t === 'textupload' || t === 'upload'
}

function tryParseJson(val: any): any {
  if (typeof val !== 'string') return val
  const t = val.trim()
  if (t.startsWith('{') || t.startsWith('[')) {
    try { return JSON.parse(t) } catch {}
  }
  return val
}

function isObjectWithText(val: any): boolean {
  const v = tryParseJson(val)
  if (v === null || v === undefined || Array.isArray(v)) return false
  if (typeof v === 'object') return 'text' in v || 'files' in v || 'uploadedFiles' in v
  return false
}

function extractPartNote(val: any): string | null {
  const v = tryParseJson(val)
  if (!v) return null
  if (typeof v === 'string') return v.trim() || null
  if (typeof v === 'object') {
    if (typeof v.text === 'string' && v.text.trim()) return v.text.trim()
    for (const entry of Object.values(v)) {
      if (typeof entry === 'string' && entry.trim() && !entry.startsWith('http')) return entry.trim()
    }
  }
  return null
}

function normaliseFileEntry(f: any): { url: string; name: string } | null {
  if (!f) return null
  if (typeof f === 'string' && f.trim()) return { url: f, name: extractFilename(f) }
  if (typeof f === 'object') {
    const url = f.url || f.fileUrl || ''
    const name = f.name || f.filename || (url ? extractFilename(url) : 'document')
    if (name) return { url, name }
  }
  return null
}

function extractPartFiles(val: any): Array<{ url: string; name: string }> {
  const v = tryParseJson(val)
  if (!v) return []
  if (Array.isArray(v)) return v.map(normaliseFileEntry).filter(Boolean) as Array<{ url: string; name: string }>
  if (typeof v !== 'object') return []
  const candidates = v.files ?? v.uploadedFiles ?? []
  if (Array.isArray(candidates)) return candidates.map(normaliseFileEntry).filter(Boolean) as Array<{ url: string; name: string }>
  return []
}

function getSelectedOptionLabel(options: any[], value: string): string {
  if (!value) return ''
  if (!Array.isArray(options) || !options.length) return value
  const opt = options.find((o: any) => o.value === value || o.label === value)
  return opt?.label ?? value
}

function getCheckedLabels(q: any): string[] {
  if (!q.answer) return []
  const json = q.answer.answerJson
  let values: string[] = []
  if (Array.isArray(json)) values = json
  else if (json && typeof json === 'object') {
    const a = (json as any).answers || (json as any).mainAnswer || []
    if (Array.isArray(a)) values = a
  }
  if (!Array.isArray(q.options) || !q.options.length) return values
  return values.map((v: string) => {
    const opt = q.options.find((o: any) => o.value === v || o.label === v)
    return opt?.label ?? v
  })
}

function getStatusLabel(q: any): string {
  if (!q.answer) return 'Not answered'
  const s = extractPrimaryStatus(q)
  if (!s) return 'Answered'
  const l = s.toLowerCase()
  if (l === 'included' || l.includes('includ')) return 'Included'
  if (l === 'excluded' || l.includes('exclud') || l.includes('taken')) return 'Excluded'
  if (l === 'offered' || l.includes('offer') || l.includes('extra')) return 'Offered'
  return 'Answered'
}

function getStatusClass(q: any): string {
  if (!q.answer) return 'status--unanswered'
  const label = getStatusLabel(q).toLowerCase()
  if (label === 'included') return 'status--included'
  if (label === 'excluded') return 'status--excluded'
  if (label === 'offered') return 'status--offered'
  return 'status--answered'
}

function extractPrimaryStatus(q: any): string | null {
  if (!q.answer) return null
  const { answerText, answerJson } = q.answer
  if (answerText) return answerText
  if (!answerJson) return null
  if (typeof answerJson === 'string') return answerJson
  if (typeof answerJson === 'object') {
    const main = (answerJson as any).mainAnswer
    if (typeof main === 'string') return main
    if (main && typeof main === 'object') {
      for (const v of Object.values(main)) if (typeof v === 'string') return v as string
    }
    const radio = (answerJson as any).radioAnswer
    if (typeof radio === 'string') return radio
    for (const v of Object.values(answerJson as object)) {
      if (typeof v === 'string' && v.trim()) return v
    }
  }
  return null
}

function getSimpleAnswer(q: any): string | null {
  if (!q.answer) return null
  const { answerText, answerJson } = q.answer
  if (answerText) return answerText
  if (!answerJson) return null
  if (typeof answerJson === 'string') return answerJson
  if (typeof answerJson === 'object') {
    const main = (answerJson as any).mainAnswer
    if (typeof main === 'string') return main
    const radio = (answerJson as any).radioAnswer
    if (typeof radio === 'string') return radio
    for (const v of Object.values(answerJson as object)) {
      if (typeof v === 'string' && v.trim()) return v
    }
  }
  return null
}

function getPartValue(q: any, partKey: string): any {
  if (!q.answer?.answerJson || typeof q.answer.answerJson !== 'object') return null
  const json = q.answer.answerJson as Record<string, any>
  if (partKey in json) return json[partKey]
  const main = json.mainAnswer
  if (main && typeof main === 'object' && partKey in main) return main[partKey]
  return null
}

function getCurrencyValue(q: any, radioPart: any): string | null {
  if (!isFixturesSection.value) return null
  if (!q.answer?.answerJson || typeof q.answer.answerJson !== 'object') return null
  if (!Array.isArray(q.parts)) return null
  const json = q.answer.answerJson as Record<string, any>
  for (const p of q.parts) {
    if (p.partKey === radioPart.partKey) continue
    if (Array.isArray(p.options) && p.options.some((o: any) => o.inputType === 'currency')) {
      const raw = json[p.partKey]
      let amount: string | null = null
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        amount = String(raw.date ?? '').trim() || null
      } else if (raw != null && raw !== '') {
        amount = String(raw).trim() || null
      }
      if (!amount) {
        const fallback = json[p.partKey + '_amount']
        if (fallback != null && fallback !== '') amount = String(fallback).trim()
      }
      if (amount) {
        const num = Number(amount.replace(/[^0-9.]/g, ''))
        if (!isNaN(num) && num > 0) return `£${num.toLocaleString('en-GB')}`
      }
    }
  }
  return null
}

function getChipAnswers(q: any): string[] {
  if (!q.answer?.answerJson) return []
  const json = q.answer.answerJson
  if (Array.isArray(json)) return json
  if (typeof json === 'object') {
    const a = (json as any).answers || (json as any).mainAnswer
    if (Array.isArray(a)) return a
  }
  return []
}

function getListAnswers(q: any): string[] {
  if (!q.answer) return []
  const { answerJson, answerText } = q.answer
  if (Array.isArray(answerJson)) return answerJson
  if (answerText) return [answerText]
  if (answerJson && typeof answerJson === 'object') {
    const items = (answerJson as any).items || (answerJson as any).mainAnswer
    if (Array.isArray(items)) return items
  }
  return []
}

function getFieldFormAnswers(q: any): Record<string, any>[] {
  if (!q.answer?.answerJson) return []
  const json = q.answer.answerJson
  if (Array.isArray(json)) return json
  if (typeof json === 'object') {
    const items = (json as any).items
    if (Array.isArray(items)) return items
    return [json as Record<string, any>]
  }
  return []
}

function getBoundaryAnswers(q: any): Record<string, string> {
  if (!q.answer?.answerJson || typeof q.answer.answerJson !== 'object') return {}
  return q.answer.answerJson as Record<string, string>
}

function getNote(q: any): string | null {
  if (!q.answer?.answerJson || typeof q.answer.answerJson !== 'object') return null
  const json = q.answer.answerJson as any
  const ai = json.additionalInfo
  if (!ai) return null
  if (typeof ai === 'string' && ai.trim()) return ai.trim()
  if (typeof ai === 'object') {
    if (typeof ai.text === 'string' && ai.text.trim()) return ai.text.trim()
    const vals = Object.values(ai).filter((v): v is string => typeof v === 'string' && !!v.trim())
    if (vals.length) return vals[0]
  }
  return null
}

function getFiles(q: any): Array<{ url: string; name: string }> {
  if (!q.answer) return []
  const files: Array<{ url: string; name: string }> = []
  if (q.answer.fileUrl) files.push({ url: q.answer.fileUrl, name: extractFilename(q.answer.fileUrl) })
  const json = q.answer.answerJson
  if (json && typeof json === 'object') {
    if (Array.isArray(json)) {
      for (const f of json) {
        const n = normaliseFileEntry(f)
        if (n) files.push(n)
      }
    } else {
      if (typeof (json as any).url === 'string' && (json as any).url) {
        files.push({ url: (json as any).url, name: (json as any).name || extractFilename((json as any).url) })
      }
      const filesArr = (json as any).files
      if (Array.isArray(filesArr)) {
        for (const f of filesArr) { const n = normaliseFileEntry(f); if (n) files.push(n) }
      }
      const uploaded = (json as any).uploadedFiles
      if (Array.isArray(uploaded)) {
        for (const f of uploaded) { const n = normaliseFileEntry(f); if (n) files.push(n) }
      }
      const ai = (json as any).additionalInfo
      if (ai && typeof ai === 'object' && Array.isArray(ai.files)) {
        for (const f of ai.files) { const n = normaliseFileEntry(f); if (n) files.push(n) }
      }
    }
  }
  return files.filter(f => !!f.url)
}

function fieldLabel(part: any, key: string): string {
  if (!Array.isArray(part.fields)) return key
  const f = part.fields.find((f: any) => f.key === key)
  return f?.label || f?.placeholder || key
}

function fieldLabelFromQuestion(q: any, key: string): string {
  if (!Array.isArray(q.fields)) return key
  const f = q.fields.find((f: any) => f.key === key)
  return f?.label || f?.placeholder || key
}

function formatDate(val: any): string {
  if (!val) return ''
  try {
    const d = new Date(val)
    if (isNaN(d.getTime())) return String(val)
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return String(val) }
}

function openSectionHelp() {
  activeHelpContent.value = section.value?.helpContent ?? null
  showHelp.value = true
}
function openSectionVideo() {
  activeVideoUrl.value = section.value?.helpVideoUrl ?? null
  showVideo.value = true
}

function extractFilename(url: string): string {
  try {
    const parts = url.split('/')
    const last = parts[parts.length - 1]
    return decodeURIComponent(last.split('?')[0]) || 'document'
  } catch { return 'document' }
}

function isImage(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(url)
}

function downloadFile(url: string, name: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.target = '_blank'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<style scoped>
/* ── Canvas ──────────────────────────────────────────────────────────── */
.bt-root {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #231d45;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}
.bt-ambient,
.bt-mesh { pointer-events: none; position: fixed; }
.bt-ambient { border-radius: 999px; filter: blur(48px); opacity: 0.16; }
.bt-ambient-a { width: 300px; height: 300px; left: -100px; top: 120px; background: #00a19a; }
.bt-ambient-b { width: 320px; height: 320px; right: -120px; top: 160px; background: #5a4cf0; }
.bt-mesh {
  position: fixed; inset: 0; opacity: 0.02;
  background-image:
    linear-gradient(rgba(18, 42, 72, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(18, 42, 72, 0.8) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, #000, transparent 86%);
}

/* ── Web nav ──────────────────────────────────────────────────────────── */
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

/* ── Loading ──────────────────────────────────────────────────────────── */
.btw-loading { display: flex; justify-content: center; align-items: center; min-height: calc(100dvh - 66px); }
.btw-spinner { width: 36px; height: 36px; border: 3px solid #e0e0e0; border-top-color: #00a19a; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Two-column layout ────────────────────────────────────────────────── */
.btw-layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 32px;
  align-items: start;
  padding: 40px 0 80px;
}
.btw-aside { position: sticky; top: 86px; display: flex; flex-direction: column; gap: 16px; }
.btw-content { display: flex; flex-direction: column; gap: 20px; }

/* ── Left panel (unified card) ────────────────────────────────────────── */
.qpanel {
  border-radius: 24px;
  background: linear-gradient(158deg, #d8f0ec 0%, #c3e6ed 52%, #a9d7e6 100%);
  padding: 26px 26px 24px;
  position: relative; overflow: hidden;
  border: 1px solid rgba(0, 161, 154, 0.22);
  box-shadow: 0 18px 44px -28px rgba(15, 100, 130, 0.5);
}
.qpanel::before {
  content: ''; position: absolute; inset: -45% -25% auto auto;
  width: 260px; height: 260px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 66%);
  pointer-events: none;
}
.qpanel-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 118, 110, 0.18); color: #0f766e;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 6px 12px; border-radius: 999px;
  position: relative; z-index: 1;
}
.qpanel-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #00a19a; }
.qpanel-icon {
  width: 62px; height: 62px; border-radius: 18px; margin: 20px 0 18px;
  background: linear-gradient(150deg, #10b3a3, #0f766e);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 14px 28px -12px rgba(15, 118, 110, 0.7);
  position: relative; z-index: 1;
}
.qpanel-icon :deep(.op-icon) { filter: brightness(0) invert(1); }
.qpanel-title { font-size: 28px; font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; color: #0a0f2c; margin: 0 0 8px; position: relative; z-index: 1; }
.qpanel-sub { color: #52646d; font-size: 14.5px; font-weight: 500; line-height: 1.45; margin: 0; position: relative; z-index: 1; }
.qpanel-divider { height: 1px; background: rgba(15, 42, 72, 0.09); margin: 22px 0; position: relative; z-index: 1; }
.qpanel-progress { display: flex; align-items: center; gap: 16px; position: relative; z-index: 1; }
.qring {
  --p: 0; --size: 64px;
  width: var(--size); height: var(--size); border-radius: 50%;
  background: conic-gradient(#00a19a calc(var(--p) * 1%), #e2e8e6 0);
  display: grid; place-items: center; flex-shrink: 0;
}
.qring::after { content: ''; width: 50px; height: 50px; background: #fff; border-radius: 50%; grid-area: 1 / 1; }
.qring span { grid-area: 1 / 1; z-index: 1; font-size: 15px; font-weight: 800; color: #0a0f2c; line-height: 1; }
.qmeta-text small { display: block; text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #0f766e; margin-bottom: 5px; }
.qmeta-text strong { font-size: 15px; font-weight: 700; line-height: 1.25; color: #0a0f2c; }
.qpanel-actions { display: flex; gap: 10px; margin-top: 22px; position: relative; z-index: 1; }
.qpanel-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 14px; border-radius: 999px; font-size: 13.5px; font-weight: 700;
  cursor: pointer; font-family: inherit; transition: transform 0.12s;
}
.qpanel-btn:active { transform: scale(0.97); }
.qpanel-btn--help { background: #fff; color: #334155; border: 1.5px solid #e2e8f0; }
.qpanel-btn--video { background: #00a19a; color: #fff; border: 1.5px solid #00a19a; box-shadow: 0 10px 22px -10px rgba(0, 161, 154, 0.85); }
.qpanel-play { display: inline-flex; }
.qpanel-btn--video .qpanel-play :deep(.op-icon) { filter: brightness(0) invert(1); }

/* ── Question header ──────────────────────────────────────────────────── */
.qhead { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.qhead-left { min-width: 0; }
.qeyebrow { display: inline-flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; color: #0f766e; }
.qeyebrow-line { width: 28px; height: 2px; border-radius: 2px; background: #00a19a; }
.qhead-title { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; color: #0a0f2c; margin: 10px 0 4px; line-height: 1.05; }
.qhead-sub { font-size: 15px; color: #94a3b8; font-weight: 500; margin: 0; }
.qhead-nav { display: flex; gap: 10px; flex-shrink: 0; }
.qnav {
  display: inline-flex; align-items: center; gap: 6px;
  border-radius: 999px; font-size: 14px; font-weight: 700;
  cursor: pointer; padding: 11px 22px; font-family: inherit;
  transition: transform 0.12s, background 0.15s, box-shadow 0.15s;
}
.qnav:active:not(:disabled) { transform: scale(0.97); }
.qnav--prev { background: #eef1f4; border: 1px solid #e2e8f0; color: #475569; }
.qnav--prev:hover:not(:disabled) { background: #e6ebef; }
.qnav--next { background: #00a19a; border: 1px solid #00a19a; color: #fff; box-shadow: 0 12px 26px -12px rgba(0, 161, 154, 0.9); }
.qnav--next:hover:not(:disabled) { box-shadow: 0 16px 30px -12px rgba(0, 161, 154, 1); }
.qnav:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }

/* ── Segmented progress ───────────────────────────────────────────────── */
.qprogress { display: flex; flex-direction: column; gap: 10px; }
.qprogress-track { display: flex; gap: 6px; }
.qseg { flex: 1; height: 6px; border-radius: 999px; background: #e3e8ec; transition: background 0.25s; }
.qseg--done { background: linear-gradient(90deg, #10b3a3, #0f766e); }
.qprogress-labels { display: flex; align-items: center; justify-content: space-between; }
.qprogress-labels span { font-size: 13px; font-weight: 700; color: #64748b; }
.qprogress-labels span:last-child { color: #94a3b8; font-weight: 600; }

/* ── Question card ────────────────────────────────────────────────────── */
.task-items { display: flex; flex-direction: column; gap: 16px; }
.task-item { background: white; border-radius: 20px; border: 1px solid #eef1f4; padding: 28px 30px; box-shadow: 0 12px 30px -22px rgba(15, 42, 72, 0.55); }
.task-item-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.task-item-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0a1f3d; margin: 0; line-height: 1.2; }
.task-item-status { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; padding: 7px 14px; border-radius: 999px; }
.status--included { background: #e6f9f7; color: #0f766e; border: 1px solid #b2e4e1; }
.status--excluded { background: #fef2f2; color: #e53e3e; border: 1px solid #f6c9c9; }
.status--offered { background: #fff7ed; color: #c2780a; border: 1px solid #f5d9ad; }
.status--answered { background: #e6f9f7; color: #0f766e; border: 1px solid #b2e4e1; }
.status--unanswered { background: #f4f6f8; color: #94a3b8; border: 1px solid #e2e8f0; }

/* Seller's answer box */
.task-item-answer { position: relative; background: #f7fbfa; border: 1px solid #e7f0ee; border-left: 4px solid #00a19a; border-radius: 14px; padding: 18px 20px; }
.task-item-answer--empty { border-left-color: #d7dee2; background: #f8fafb; }
.task-item-answer-label { display: block; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: #0f766e; margin-bottom: 10px; }
.task-item-answer--empty .task-item-answer-label { color: #94a3b8; }
.task-item-detail { }

/* ── Answer components ────────────────────────────────────────────────── */
.detail-answer-pill { display: inline-block; font-size: 14px; font-weight: 600; color: #1a1a1a; background: #f0faf9; border: 1.5px solid #b2e4e1; border-radius: 20px; padding: 6px 16px; margin-top: 2px; }
.detail-currency { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding: 8px 12px; background: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7; }
.detail-currency-label { font-size: 12px; color: #92400e; }
.detail-currency-value { font-size: 15px; font-weight: 700; color: #92400e; }
.detail-answer-block { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; margin-top: 4px; }
.detail-answer-label { font-size: 12px; color: #9ca3af; }
.detail-answer-value { font-size: 14px; font-weight: 500; color: #1a1a1a; }
.detail-text-answer { font-size: 17px; font-weight: 600; color: #0a1f3d; line-height: 1.5; white-space: pre-line; }
.detail-part-label { font-size: 12px; font-weight: 600; color: #6b7280; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.4px; }
.detail-no-answer { font-size: 13px; color: #d1d5db; font-style: italic; margin: 6px 0; }
.detail-scale { display: inline-flex; padding: 8px 16px; background: #f0faf9; border-radius: 20px; border: 1px solid #b2e4e1; }
.detail-scale-value { font-size: 18px; font-weight: 700; color: #00a19a; }
.detail-chips { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.detail-chip { font-size: 13px; font-weight: 500; padding: 4px 12px; border-radius: 20px; background: #f0faf9; color: #00a19a; border: 1px solid #b2e4e1; }
.detail-list { display: flex; flex-direction: column; gap: 4px; }
.detail-list-item { font-size: 14px; color: #1a1a1a; padding: 6px 10px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #00a19a; }
.detail-fields { display: flex; flex-direction: column; gap: 8px; }
.detail-field-entry { background: #f9fafb; border-radius: 8px; padding: 10px 12px; }
.detail-field-row { display: flex; gap: 8px; padding: 3px 0; font-size: 13px; }
.detail-field-key { color: #9ca3af; min-width: 90px; flex-shrink: 0; }
.detail-field-val { color: #1a1a1a; font-weight: 500; flex: 1; }
.detail-boundary { background: #f9fafb; border-radius: 8px; padding: 10px 12px; }
.detail-note { display: flex; gap: 10px; margin-top: 12px; background: #e8faf9; border-radius: 10px; padding: 12px 14px; align-items: flex-start; }
.detail-note-bar { width: 3px; min-height: 20px; background: #00a19a; border-radius: 2px; flex-shrink: 0; align-self: stretch; }
.detail-note-body { flex: 1; }
.detail-note-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #00a19a; display: block; margin-bottom: 3px; }
.detail-note-text { font-size: 13px; color: #1a6b66; margin: 0; line-height: 1.5; }
.detail-files { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }
.detail-file-row { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: #f5f5f5; border-radius: 10px; }
.detail-file-icon { flex-shrink: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.detail-file-name { flex: 1; font-size: 13px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.detail-file-actions { flex-shrink: 0; }
.detail-file-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
.detail-file-btn--download { background: #00a19a; color: white; }
.detail-file-pending { font-size: 11px; color: #9ca3af; font-style: italic; padding: 5px 8px; }
.task-empty { padding: 40px; text-align: center; color: #999; font-size: 14px; }

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .btw-layout { grid-template-columns: 1fr; }
  .btw-aside { position: static; }
}
@media (max-width: 899px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 58px; }
}
@media (max-width: 720px) {
  .qhead { flex-direction: column; gap: 16px; }
  .qhead-nav { width: 100%; }
  .qnav { flex: 1; justify-content: center; }
}
@media (max-width: 640px) {
  .hsw-shell { width: calc(100% - 24px); }
  .hsw-back { display: none; }
  .btw-layout { padding: 24px 0 60px; gap: 20px; }
  .qhead-title { font-size: 30px; }
  .task-item { padding: 22px 20px; }
  .task-item-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .task-item-title { font-size: 20px; }
  .qpanel { padding: 22px; }
  .qpanel-title { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .btw-spinner { animation: none; }
  .qseg, .qnav, .qpanel-btn { transition: none; }
}
</style>
