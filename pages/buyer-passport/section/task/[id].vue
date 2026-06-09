<template>
  <div class="bt-root">
    <div class="bt-ambient bt-ambient-a" />
    <div class="bt-ambient bt-ambient-b" />
    <div class="bt-mesh" />

    <!-- ── Web nav ──────────────────────────────────────────────────── -->
    <header class="hsw-nav">
      <div class="hsw-shell hsw-nav-inner">
        <button class="hsw-brand" type="button" @click="navigateTo('/')">
          <img src="/logo.png" alt="" class="hsw-brand-logo" />
          <span>umovingu</span>
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
          <!-- Hero card -->
          <section class="qhero">
            <span class="qhero-badge">
              <span class="qhero-dot" />
              {{ section?.title || '' }}
            </span>
            <div class="qhero-illustration" aria-hidden="true">
              <OPIcon :name="section?.imageKey || 'fittingsContents'" class="w-[120px] h-[120px]" />
            </div>
            <h1 class="qhero-title">{{ task.title || firstQuestionLabel }}</h1>
            <p class="qhero-sub">{{ task.description || section?.description || 'Official property record' }}</p>
            <div class="qhero-meta">
              <div class="qring" :style="{ '--p': taskProgressPct }">
                <span>{{ taskAnsweredCount }}/{{ taskTotalQuestions }}</span>
              </div>
              <div class="qmeta-text">
                <small>Task answered</small>
                <strong>
                  {{ taskRemainingQuestions }}
                  {{ taskRemainingQuestions === 1 ? 'question' : 'questions' }}
                  remaining
                </strong>
              </div>
            </div>
          </section>

          <!-- Section-level Help + Video -->
          <div class="task-help-strip">
            <button class="task-help-btn task-help-btn--help" @click="openSectionHelp">
              <OPIcon name="helpIcon" class="w-[15px] h-[15px]" />Help
            </button>
            <button class="task-help-btn task-help-btn--video" @click="openSectionVideo">
              <span class="task-play-icon"><OPIcon name="playIcon" class="w-[15px] h-[15px]" /></span>
              Play Video
            </button>
          </div>
        </aside>

        <!-- ── Main content ──────────────────────────────────────────── -->
        <div class="btw-content">
          <!-- Question navigation header -->
          <div class="question-nav">
            <div class="question-nav-counter">
              <h2 class="question-nav-num">Question {{ activeIndex + 1 }}</h2>
              <div class="question-nav-sub">{{ activeIndex + 1 }} of {{ visibleQuestions.length }} in this section</div>
            </div>
            <div class="question-nav-actions">
              <button class="nav-btn nav-btn--prev" :disabled="activeIndex === 0" @click="activeIndex--">Previous</button>
              <button class="nav-btn nav-btn--next" :disabled="activeIndex >= visibleQuestions.length - 1" @click="activeIndex++">Next</button>
            </div>
          </div>

          <!-- Single active question card -->
          <div class="task-items">
            <div v-for="q in [activeQuestion].filter(Boolean)" :key="q.id" class="task-item">
              <div class="task-item-header">
                <div class="task-item-left">
                  <h3 class="task-item-title">{{ getCardTitle(q) }}</h3>
                  <span class="task-item-status" :class="getStatusClass(q)">{{ getStatusLabel(q) }}</span>
                </div>
              </div>

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

            <div v-if="visibleQuestions.length === 0" class="task-empty">
              <p>No questions in this task.</p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <BottomNav active="passport" />
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
import BottomNav from '~/components/core/BottomNav.vue'

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
  background:
    radial-gradient(circle at 78% 8%, rgba(0, 161, 154, 0.1), transparent 34%),
    radial-gradient(circle at 8% 14%, rgba(90, 76, 240, 0.08), transparent 30%),
    linear-gradient(180deg, #ffffff 0%, #f8fdfb 46%, #ffffff 100%);
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
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(28, 43, 65, 0.08);
}
.hsw-nav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.hsw-brand { border: 0; background: transparent; display: inline-flex; align-items: center; gap: 10px; color: #0d1835; cursor: pointer; font-size: 20px; font-weight: 800; flex-shrink: 0; font-family: inherit; }
.hsw-brand-logo { width: 28px; height: 28px; object-fit: contain; }
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

/* ── Hero card ────────────────────────────────────────────────────────── */
.qhero {
  border-radius: 20px;
  background: linear-gradient(160deg, #ffffff 0%, #def7f1 60%, #d1e8e3 100%);
  padding: 22px 22px 24px;
  position: relative; overflow: hidden;
  border: 1px solid rgba(0, 161, 154, 0.12);
}
.qhero::before {
  content: ''; position: absolute; inset: -40% -20% auto auto;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 65%);
  pointer-events: none;
}
.qhero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(6px);
  border: 1px solid rgba(15, 118, 110, 0.15); color: #0f766e;
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase; padding: 6px 10px; border-radius: 999px;
  position: relative; z-index: 1;
}
.qhero-dot { width: 6px; height: 6px; border-radius: 50%; background: #00a19a; }
.qhero-illustration { display: flex; justify-content: center; margin: 4px 0 8px; position: relative; z-index: 1; }
.qhero-title { font-size: 24px; font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; color: #0a0f2c; margin: 4px 0 4px; position: relative; z-index: 1; }
.qhero-sub { color: #115e59; font-size: 14px; font-weight: 500; line-height: 1.4; margin: 0 0 16px; position: relative; z-index: 1; }
.qhero-meta { display: flex; align-items: center; gap: 14px; margin-top: 8px; position: relative; z-index: 1; }
.qring {
  --p: 0; --size: 56px;
  width: var(--size); height: var(--size); border-radius: 50%;
  background: conic-gradient(#1f7a66 calc(var(--p) * 1%), rgba(15, 118, 110, 0.15) 0);
  display: grid; place-items: center; flex-shrink: 0;
}
.qring::after { content: ''; width: 44px; height: 44px; background: #fff; border-radius: 50%; grid-area: 1 / 1; }
.qring span { grid-area: 1 / 1; z-index: 1; font-size: 13px; font-weight: 700; color: #0a0f2c; line-height: 1; }
.qmeta-text small { display: block; text-transform: uppercase; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: #115e59; margin-bottom: 4px; }
.qmeta-text strong { font-size: 14px; font-weight: 700; line-height: 1.2; color: #0a0f2c; }

/* ── Help strip ───────────────────────────────────────────────────────── */
.task-help-strip { display: flex; gap: 6px; flex-wrap: wrap; }
.task-help-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.task-help-btn--help { background: white; color: #00a19a; border: 2px solid #e0e0e0; }
.task-help-btn--video { background: #00a19a; color: white; border: 2px solid #00a19a; }
.task-play-icon { font-size: 12px; }

/* ── Question navigation ──────────────────────────────────────────────── */
.question-nav { display: flex; align-items: center; justify-content: space-between; }
.question-nav-num { font-size: 18px; font-weight: 700; color: #0c1f3d; margin: 0; }
.question-nav-sub { font-size: 13px; color: #9ca3af; font-weight: 500; margin-top: 2px; }
.question-nav-actions { display: flex; gap: 8px; }
.nav-btn { background: white; border: 1px solid #d8e3ee; border-radius: 40px; color: #00a19a; font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 16px; font-family: inherit; transition: background 0.15s; }
.nav-btn:hover:not(:disabled) { background: #f0faf9; }
.nav-btn:disabled { color: #d1d5db; border-color: #e9ecf0; cursor: not-allowed; }

/* ── Question card ────────────────────────────────────────────────────── */
.task-items { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e7ecf2; box-shadow: 0 2px 12px rgba(23, 52, 92, 0.06); }
.task-item { border-bottom: 1px solid #f0f0f0; }
.task-item:last-child { border-bottom: none; }
.task-item-header { display: flex; align-items: flex-start; gap: 10px; padding: 16px 20px 10px; }
.task-item-left { flex: 1; min-width: 0; }
.task-item-title { font-size: 15px; font-weight: 600; color: #0c1f3d; margin: 0 0 6px; line-height: 1.4; }
.task-item-status { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; padding: 2px 8px; border-radius: 20px; }
.status--included { background: #e6f9f7; color: #00a19a; }
.status--excluded { background: #fef2f2; color: #e53e3e; }
.status--offered { background: #fff7ed; color: #c2780a; }
.status--answered { background: #eef2ff; color: #4f46e5; }
.status--unanswered { background: #f9fafb; color: #d1d5db; }
.task-item-detail { padding: 0 20px 20px; }

/* ── Answer components ────────────────────────────────────────────────── */
.detail-answer-pill { display: inline-block; font-size: 14px; font-weight: 600; color: #1a1a1a; background: #f0faf9; border: 1.5px solid #b2e4e1; border-radius: 20px; padding: 6px 16px; margin-top: 2px; }
.detail-currency { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding: 8px 12px; background: #fffbeb; border-radius: 8px; border: 1px solid #fef3c7; }
.detail-currency-label { font-size: 12px; color: #92400e; }
.detail-currency-value { font-size: 15px; font-weight: 700; color: #92400e; }
.detail-answer-block { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #f9fafb; border-radius: 8px; margin-top: 4px; }
.detail-answer-label { font-size: 12px; color: #9ca3af; }
.detail-answer-value { font-size: 14px; font-weight: 500; color: #1a1a1a; }
.detail-text-answer { font-size: 14px; color: #1a1a1a; background: #f9fafb; border-radius: 8px; padding: 10px 12px; line-height: 1.5; white-space: pre-line; margin-top: 4px; }
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
@media (max-width: 640px) {
  .hsw-shell { width: calc(100% - 24px); }
  .hsw-back { display: none; }
  .btw-layout { padding: 24px 0 60px; gap: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .btw-spinner { animation: none; }
}
</style>
