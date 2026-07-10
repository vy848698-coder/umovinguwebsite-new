<template>
  <div class="bs-root">

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
          <button class="hsw-back" type="button" @click="router.push(`/buyer-passport/${passportId}`)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Passport
          </button>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="bsw-loading">
      <div class="bsw-spinner" />
    </div>

    <template v-else-if="section">
      <main class="hsw-shell bs-page">
        <!-- ── Hero card ──────────────────────────────────────────────── -->
        <section class="ov-hero">
          <div class="ov-hero-top">
            <div class="ov-hero-left">
              <span class="ov-badge">
                <span class="dot" />
                {{ section.title }}
              </span>
              <div class="ov-heading">
                <div class="ov-icon-tile" aria-hidden="true">
                  <OPIcon :name="section.imageKey || 'ownershipProfile'" class="w-[34px] h-[34px]" />
                </div>
                <div class="ov-heading-text">
                  <h1 class="ov-title">{{ section.title }}</h1>
                  <p class="ov-sub">
                    {{ section.subtitle || section.description || 'Official property record' }}
                  </p>
                </div>
              </div>
              <div class="ov-actions">
                <button class="ov-btn ov-btn--ai" :disabled="loadingAi" @click="fetchAiSummary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L13.9 8.26H20.5L15.3 12.14L17.18 18.4L12 14.52L6.82 18.4L8.7 12.14L3.5 8.26H10.1L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                  </svg>
                  {{ loadingAi ? 'Thinking…' : 'AI Summary' }}
                </button>
                <button class="ov-btn ov-btn--help" @click="showHelp = true">
                  <OPIcon name="helpIcon" class="w-[15px] h-[15px]" />Help
                </button>
                <button class="ov-btn ov-btn--video" @click="showVideo = true">
                  <span class="ov-btn-play"><OPIcon name="playIcon" class="w-[13px] h-[13px]" /></span>
                  Video
                </button>
              </div>
            </div>

            <div class="ov-progress-card">
              <div class="ov-ring" :style="{ '--p': sectionProgressPct }">
                <span>{{ sectionProgressPct }}%</span>
              </div>
              <small class="ov-ring-label">Section answered</small>
              <strong class="ov-ring-value">
                {{ sectionAnsweredCount }} of {{ sectionTotalQuestions }}
                {{ sectionTotalQuestions === 1 ? 'question' : 'questions' }}
                <em v-if="sectionTaskCount"> · {{ sectionTaskCount }} {{ sectionTaskCount === 1 ? 'task' : 'tasks' }}</em>
              </strong>
            </div>
          </div>

          <div class="ov-hero-divider" />

          <div class="ov-seller-row">
            <div class="ov-seller-avatar" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00857f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div class="ov-seller-info">
              <strong>Questions answered by seller</strong>
              <small v-if="progress.lastUpdated !== '—'">Last updated {{ progress.lastUpdated }}</small>
            </div>
            <div class="ov-seller-bar-bg">
              <div class="ov-seller-bar-fill" :style="{ width: progress.pct + '%' }" />
            </div>
            <span class="ov-seller-count">{{ progress.answered }} / {{ progress.total }}</span>
          </div>
        </section>

        <!-- ── Fixtures & Fittings extras ──────────────────────────────── -->
        <template v-if="section.key === 'fixturesAndFittings'">
          <div class="section-actions">
            <button class="section-btn section-btn--outline" :class="{ 'section-btn--disabled': sectionFiles.length === 0 }" :disabled="sectionFiles.length === 0" @click="showFilesSheet = true">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
              </svg>
              Preview
            </button>
            <button class="section-btn section-btn--filled" :class="{ 'section-btn--disabled': sectionFiles.length === 0 }" :disabled="sectionFiles.length === 0" @click="downloadAllFiles">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="white" stroke-width="2" stroke-linecap="round" />
                <polyline points="7,10 12,15 17,10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <line x1="12" y1="15" x2="12" y2="3" stroke="white" stroke-width="2" stroke-linecap="round" />
              </svg>
              Download
            </button>
          </div>

          <div class="section-stats">
            <div class="section-stat section-stat--included">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12" stroke="#00a19a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="section-stat-label">Included in sale</p>
                <p class="section-stat-value section-stat-value--green">{{ stats.included }} Items</p>
              </div>
            </div>
            <div class="section-stat section-stat--excluded">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" stroke="#e53e3e" stroke-width="2.5" stroke-linecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="#e53e3e" stroke-width="2.5" stroke-linecap="round" />
              </svg>
              <div>
                <p class="section-stat-label">Excluded / taken</p>
                <p class="section-stat-value section-stat-value--red">{{ stats.excluded }} items</p>
              </div>
            </div>
            <div class="section-stat section-stat--offered">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#e8941a" stroke-width="2" />
                <line x1="2" y1="10" x2="22" y2="10" stroke="#e8941a" stroke-width="2" />
              </svg>
              <div>
                <p class="section-stat-label">Offered for extra price</p>
                <p class="section-stat-value section-stat-value--amber">{{ stats.offered }} Items</p>
              </div>
            </div>
            <div class="section-stat">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#666" stroke-width="2" />
                <line x1="16" y1="2" x2="16" y2="6" stroke="#666" stroke-width="2" stroke-linecap="round" />
                <line x1="8" y1="2" x2="8" y2="6" stroke="#666" stroke-width="2" stroke-linecap="round" />
                <line x1="3" y1="10" x2="21" y2="10" stroke="#666" stroke-width="2" />
              </svg>
              <div>
                <p class="section-stat-label">Form last updated</p>
                <p class="section-stat-value">{{ stats.lastUpdated }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Non-fixtures optional file buttons -->
        <div v-else-if="sectionFiles.length > 0" class="section-actions">
          <button class="section-btn section-btn--outline" @click="showFilesSheet = true">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
            </svg>
            Preview Files
          </button>
          <button class="section-btn section-btn--filled" @click="downloadAllFiles">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="white" stroke-width="2" stroke-linecap="round" />
              <polyline points="7,10 12,15 17,10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="12" y1="15" x2="12" y2="3" stroke="white" stroke-width="2" stroke-linecap="round" />
            </svg>
            Download All
          </button>
        </div>

        <!-- ── Section heading ─────────────────────────────────────────── -->
        <div class="ov-sechead">
          <span class="ov-eyebrow">This Section</span>
          <div class="ov-sechead-row">
            <h2 class="ov-sechead-title">Tasks in this section</h2>
            <span class="ov-taskcount">{{ sectionTaskCount }} {{ sectionTaskCount === 1 ? 'task' : 'tasks' }}</span>
          </div>
        </div>

        <!-- ── Tasks timeline ──────────────────────────────────────────── -->
        <div class="ov-timeline">
          <div
            v-for="task in section.tasks"
            :key="task.id"
            class="ov-tl-item"
          >
            <div class="ov-tl-rail">
              <div class="ov-tl-marker" :class="`ov-tl-marker--${taskStatus(task)}`">
                <svg v-if="taskStatus(task) === 'complete'" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="20,6 9,17 4,12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-else-if="taskStatus(task) === 'partial'" class="ov-tl-dot" />
              </div>
            </div>
            <div class="ov-task-card" @click="goToTask(task.id)">
              <div class="ov-task-main">
                <h3 class="ov-task-title">
                  {{ task.title || firstVisibleQuestion(task) || 'Questions' }}
                </h3>
                <div class="ov-task-tags">
                  <span v-for="tag in getTaskTags(task)" :key="tag.label" class="ov-task-tag" :class="tag.class">
                    <svg v-if="tag.class === 'tag--complete'" width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ tag.label }}
                  </span>
                </div>
              </div>
              <button class="ov-task-arrow">
                <OPIcon name="caretRight" class="w-[13px] h-[13px]" />
              </button>
            </div>
          </div>
        </div>

        <!-- ── Expert guidance ─────────────────────────────────────────── -->
        <section class="ov-expert">
          <span class="ov-expert-badge">
            <span class="dot" />
            Under Review
          </span>
          <div class="ov-expert-row">
            <div class="ov-expert-icon" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7fe3d8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div class="ov-expert-body">
              <h3 class="ov-expert-title">Need Expert Guidance?</h3>
              <p class="ov-expert-desc">Get professional advice from a qualified property expert on this section.</p>
              <span class="ov-expert-meta">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Minimum time: 1 Day
              </span>
            </div>
            <button class="ov-expert-cta" @click="goToExpert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              View Expert Profile
            </button>
          </div>
        </section>

        <!-- ── AI Summary ──────────────────────────────────────────────── -->
        <div v-if="aiSummary" class="ai-summary-card">
          <div class="ai-summary-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.9 8.26H20.5L15.3 12.14L17.18 18.4L12 14.52L6.82 18.4L8.7 12.14L3.5 8.26H10.1L12 2Z" stroke="#00a19a" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
            <span>AI Plain-English Summary</span>
          </div>
          <p class="ai-summary-text">{{ aiSummary }}</p>
        </div>
      </main>

      <SiteFooter />
    </template>

    <!-- File preview bottom sheet -->
    <Teleport to="body">
      <!-- Lightbox -->
      <div v-if="lightboxFile" class="lightbox-overlay" @click.self="lightboxFile = null">
        <div class="lightbox-panel">
          <button class="lightbox-close" @click="lightboxFile = null">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <template v-if="isImage(lightboxFile.url)">
            <img :src="lightboxFile.url" :alt="lightboxFile.name" class="lightbox-img" />
          </template>
          <template v-else-if="isPdf(lightboxFile.url)">
            <iframe :src="lightboxFile.url" class="lightbox-iframe" />
          </template>
          <template v-else>
            <div class="lightbox-unsupported">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#bbb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <polyline points="14,2 14,8 20,8" stroke="#bbb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p>Preview not supported for this file type.</p>
              <button class="lightbox-download-btn" @click="downloadFile(lightboxFile.url, lightboxFile.name)">Download File</button>
            </div>
          </template>
          <div v-if="isImage(lightboxFile.url) || isPdf(lightboxFile.url)" class="lightbox-footer">
            <span class="lightbox-filename">{{ lightboxFile.name }}</span>
            <button class="lightbox-dl-btn" @click="downloadFile(lightboxFile.url, lightboxFile.name)">↓</button>
          </div>
        </div>
      </div>

      <Transition name="sheet">
        <div v-if="showFilesSheet" class="files-sheet-overlay" @click.self="showFilesSheet = false">
          <div class="files-sheet">
            <div class="files-sheet-handle" />
            <div class="files-sheet-header">
              <h2 class="files-sheet-title">Uploaded Documents</h2>
              <button class="files-sheet-close" @click="showFilesSheet = false">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#666" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <div class="files-sheet-body">
              <p v-if="sectionFiles.length === 0" class="files-empty">No files uploaded for this section.</p>
              <div v-for="(file, i) in sectionFiles" :key="i" class="file-row">
                <div class="file-icon">
                  <svg v-if="isImage(file.url)" width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00a19a" stroke-width="1.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#00a19a" />
                    <path d="M21 15l-5-5L5 21" stroke="#00a19a" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6366f1" stroke-width="1.5" />
                    <polyline points="14,2 14,8 20,8" stroke="#6366f1" stroke-width="1.5" />
                  </svg>
                </div>
                <div class="file-info">
                  <p class="file-name">{{ file.name }}</p>
                  <p class="file-from">{{ file.question }}</p>
                </div>
                <div class="file-actions">
                  <template v-if="file.url">
                    <button class="file-btn file-btn--preview" @click="lightboxFile = file">Preview</button>
                    <button class="file-btn file-btn--download" @click="downloadFile(file.url, file.name)">↓</button>
                  </template>
                  <span v-else class="file-pending-badge">Pending upload</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Help drawer -->
    <HelpDrawer :show="showHelp" :content="section?.helpContent as any" mode="buyer" @close="showHelp = false" />

    <!-- Video modal -->
    <VideoModal :show="showVideo" :videoUrl="section?.helpVideoUrl" @close="showVideo = false" />
  </div>
</template>

<script setup lang="ts">
import OPIcon from '~/components/ui/OPIcon.vue'
import HelpDrawer from '@/components/passport-view/HelpDrawer.vue'
import VideoModal from '@/components/passport-view/VideoModal.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const sectionId = route.params.id as string
const passportId = route.query.passportId as string

const allData = ref<any>(null)
const loading = ref(true)
const showFilesSheet = ref(false)
const showHelp = ref(false)
const showVideo = ref(false)

const lightboxFile = ref<{ url: string; name: string } | null>(null)

const aiSummary = ref('')
const loadingAi = ref(false)

onMounted(async () => {
  try {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null
    allData.value = await $fetch(
      `${config.public.apiBase}/passport/${passportId}/buyer-view`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
  } catch (e) {
    console.error('Failed to load buyer view', e)
  } finally {
    loading.value = false
  }
})

const section = computed(
  () => allData.value?.sections?.find((s: any) => s.id === sectionId) ?? null,
)

function visibleQuestions(task: any): any[] {
  return (task.questions ?? []).filter((q: any) => q.type !== 'NOTE')
}

const sectionTotalQuestions = computed(() => {
  let n = 0
  for (const t of section.value?.tasks ?? []) n += visibleQuestions(t).length
  return n
})
const sectionAnsweredCount = computed(() => {
  let n = 0
  for (const t of section.value?.tasks ?? []) {
    for (const q of visibleQuestions(t)) {
      if (q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl)) n++
    }
  }
  return n
})
const sectionProgressPct = computed(() =>
  sectionTotalQuestions.value
    ? Math.round((sectionAnsweredCount.value / sectionTotalQuestions.value) * 100)
    : 0,
)
const sectionTaskCount = computed(() => section.value?.tasks?.length ?? 0)

function firstVisibleQuestion(task: any): string {
  const q = visibleQuestions(task)[0]
  if (!q) return ''
  if (q.question) return q.question
  if (Array.isArray(q.parts) && q.parts[0]?.title) return q.parts[0].title
  return ''
}

function normaliseFileEntry(f: any, fallbackName = 'document'): { url: string; name: string } | null {
  if (!f) return null
  if (typeof f === 'string' && f.trim()) return { url: f, name: extractFilename(f) }
  if (typeof f === 'object') {
    const url = f.url || f.fileUrl || ''
    const name = f.name || f.filename || (url ? extractFilename(url) : fallbackName)
    if (name) return { url, name }
  }
  return null
}

const sectionFiles = computed((): Array<{ url: string; name: string; question: string }> => {
  if (!section.value) return []
  const files: Array<{ url: string; name: string; question: string }> = []

  const pushFile = (entry: any, label: string) => {
    const n = normaliseFileEntry(entry)
    if (n) files.push({ ...n, question: label })
  }

  for (const task of section.value.tasks) {
    for (const q of visibleQuestions(task)) {
      if (!q.answer) continue
      const label = q.question || (Array.isArray(q.parts) && q.parts[0]?.title) || 'Document'
      if (q.answer.fileUrl) pushFile(q.answer.fileUrl, label)
      const json = q.answer.answerJson
      if (json && typeof json === 'object') {
        if (Array.isArray(json)) {
          for (const f of json) pushFile(f, label)
        } else {
          const uploaded = (json as any).uploadedFiles
          if (Array.isArray(uploaded)) for (const f of uploaded) pushFile(f, label)
          for (const val of Object.values(json as object)) {
            if (val && typeof val === 'object' && !Array.isArray(val)) {
              const partFiles = (val as any).files
              if (Array.isArray(partFiles)) for (const f of partFiles) pushFile(f, label)
            }
          }
        }
      }
    }
  }
  return files
})

const stats = computed(() => {
  if (!section.value) return { included: 0, excluded: 0, offered: 0, lastUpdated: '—' }
  let included = 0, excluded = 0, offered = 0
  let latestDate: Date | null = null
  for (const task of section.value.tasks) {
    for (const q of visibleQuestions(task)) {
      if (!q.answer) continue
      const s = extractPrimaryStatus(q.answer.answerJson, q.answer.answerText)
      if (s) {
        const l = s.toLowerCase()
        if (l.includes('includ')) included++
        else if (l.includes('exclud') || l.includes('taken') || l.includes('remov')) {
          const json = q.answer.answerJson
          let hasPrice = false
          if (typeof json === 'object' && json !== null) {
            for (const [k, v] of Object.entries(json as object)) {
              if (k.endsWith('_amount') && v && String(v).trim()) { hasPrice = true; break }
              if (v && typeof v === 'object' && !Array.isArray(v)) {
                const d = (v as any).date
                if (d && String(d).trim()) { hasPrice = true; break }
              }
            }
          }
          if (hasPrice) offered++
          else excluded++
        } else if (l.includes('offer') || l.includes('extra')) offered++
        else included++
      } else if (q.answer.answerText || q.answer.answerJson) {
        included++
      }
      if (q.answer.createdAt) {
        const d = new Date(q.answer.createdAt)
        if (!latestDate || d > latestDate) latestDate = d
      }
    }
  }
  const lastUpdated = latestDate
    ? latestDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
  return { included, excluded, offered, lastUpdated }
})

const progress = computed(() => {
  if (!section.value) return { answered: 0, total: 0, pct: 0, lastUpdated: '—' }
  let total = 0, answered = 0
  let latestDate: Date | null = null
  for (const task of section.value.tasks) {
    const qs = visibleQuestions(task)
    total += qs.length
    for (const q of qs) {
      if (q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl)) {
        answered++
        if (q.answer.createdAt) {
          const d = new Date(q.answer.createdAt)
          if (!latestDate || d > latestDate) latestDate = d
        }
      }
    }
  }
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0
  const lastUpdated = latestDate
    ? latestDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
  return { answered, total, pct, lastUpdated }
})

function extractPrimaryStatus(answerJson: any, answerText: string | null): string | null {
  if (answerText) return answerText
  if (!answerJson) return null
  if (typeof answerJson === 'string') return answerJson
  if (typeof answerJson === 'object') {
    const main = (answerJson as any).mainAnswer
    if (typeof main === 'string') return main
    if (main && typeof main === 'object') {
      for (const v of Object.values(main)) if (typeof v === 'string') return v
    }
    const radio = (answerJson as any).radioAnswer
    if (typeof radio === 'string') return radio
    for (const v of Object.values(answerJson as object)) {
      if (typeof v === 'string' && v.trim()) return v
    }
  }
  return null
}

function getTaskTags(task: any): Array<{ label: string; class: string }> {
  const tags: Array<{ label: string; class: string }> = []
  const qs = visibleQuestions(task)
  const answered = qs.filter(
    (q: any) => q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl),
  )
  if (answered.length === 0) {
    tags.push({ label: 'No answers yet', class: 'tag--gray' })
    return tags
  }
  const total = qs.length
  const complete = answered.length >= total
  const countLabel =
    complete ? `All ${total} answered` : `${answered.length} of ${total} answered`
  tags.push({ label: countLabel, class: complete ? 'tag--complete' : 'tag--partial' })
  if (section.value?.key === 'fixturesAndFittings') {
    let hasIncluded = false, hasExcluded = false
    for (const q of answered) {
      const s = extractPrimaryStatus(q.answer.answerJson, q.answer.answerText)
      if (s) {
        const l = s.toLowerCase()
        if (l.includes('includ')) hasIncluded = true
        if (l.includes('exclud') || l.includes('taken') || l.includes('remov')) hasExcluded = true
      } else {
        hasIncluded = true
      }
    }
    if (hasIncluded) tags.push({ label: 'Included', class: 'tag--included' })
    if (hasExcluded) tags.push({ label: 'Excluded', class: 'tag--excluded' })
  }
  return tags.slice(0, 3)
}

function taskStatus(task: any): 'complete' | 'partial' | 'empty' {
  const qs = visibleQuestions(task)
  if (qs.length === 0) return 'empty'
  const answered = qs.filter(
    (q: any) => q.answer && (q.answer.answerText || q.answer.answerJson || q.answer.fileUrl),
  )
  if (answered.length === 0) return 'empty'
  if (answered.length >= qs.length) return 'complete'
  return 'partial'
}

function goToTask(taskId: string) {
  router.push(`/buyer-passport/section/task/${taskId}?passportId=${passportId}&sectionId=${sectionId}`)
}

function goToExpert() {
  router.push(`/passportview/expert?passportId=${passportId}&sectionId=${sectionId}`)
}

function extractFilename(url: string): string {
  try {
    const parts = url.split('/')
    const last = parts[parts.length - 1]
    return decodeURIComponent(last.split('?')[0]) || 'document'
  } catch {
    return 'document'
  }
}

function isImage(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|svg)(\?|$)/i.test(url)
}

function isPdf(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url)
}

async function fetchAiSummary() {
  if (loadingAi.value || !section.value) return
  loadingAi.value = true
  aiSummary.value = ''
  try {
    const tok = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    const res = await $fetch<{ summary: string }>(
      `${config.public.apiBase}/passport/${passportId}/ai-summary/${section.value.key}`,
      { method: 'POST', headers: { Authorization: `Bearer ${tok}` } },
    )
    aiSummary.value = res.summary
  } catch {
    aiSummary.value = 'Could not generate summary at this time. Please try again later.'
  } finally {
    loadingAi.value = false
  }
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

function downloadAllFiles() {
  for (const f of sectionFiles.value) downloadFile(f.url, f.name)
}
</script>

<style scoped>
/* ── Canvas ──────────────────────────────────────────────────────────── */
.bs-root {
  --color-border: #e7ecf2;
  min-height: 100dvh;
  color: #231d45;
  background: #f3f2ef;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: clip;
  position: relative;
}
.bs-ambient,
.bs-mesh { pointer-events: none; position: fixed; }
.bs-ambient { border-radius: 999px; filter: blur(48px); opacity: 0.16; }
.bs-ambient-a { width: 300px; height: 300px; left: -100px; top: 120px; background: #00a19a; }
.bs-ambient-b { width: 320px; height: 320px; right: -120px; top: 160px; background: #5a4cf0; }
.bs-mesh {
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
.bsw-loading {
  display: flex; justify-content: center; align-items: center;
  min-height: calc(100dvh - 66px);
}
.bsw-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e0e0e0;
  border-top-color: #00a19a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Page container ───────────────────────────────────────────────────── */
.bs-page {
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding: 40px 0 80px;
}

/* ── Hero card ────────────────────────────────────────────────────────── */
.ov-hero {
  border-radius: 24px;
  background: linear-gradient(150deg, #ffffff 0%, #f3fbf8 46%, #e5f5f0 100%);
  border: 1px solid rgba(0, 161, 154, 0.14);
  box-shadow: 0 18px 44px -28px rgba(15, 118, 110, 0.4);
  padding: 30px 32px 24px;
  position: relative;
  overflow: hidden;
}
.ov-hero::before {
  content: '';
  position: absolute;
  inset: -50% -10% auto auto;
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.75), transparent 66%);
  pointer-events: none;
}
.ov-hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 28px;
  position: relative;
  z-index: 1;
}
.ov-hero-left { flex: 1; min-width: 0; }
.ov-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 118, 110, 0.18); color: #0f766e;
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 6px 12px; border-radius: 999px;
}
.ov-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #00a19a; }
.ov-heading { display: flex; align-items: center; gap: 16px; margin: 18px 0 22px; }
.ov-icon-tile {
  width: 62px; height: 62px; border-radius: 18px; flex-shrink: 0;
  background: linear-gradient(150deg, #10b3a3, #0f766e);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 26px -10px rgba(15, 118, 110, 0.7);
}
.ov-icon-tile :deep(.op-icon) { filter: brightness(0) invert(1); }
.ov-heading-text { min-width: 0; }
.ov-title { font-size: 32px; font-weight: 800; line-height: 1.1; letter-spacing: -0.025em; color: #0a0f2c; margin: 0 0 6px; }
.ov-sub { color: #4b5f6b; font-size: 15px; font-weight: 500; line-height: 1.4; margin: 0; }
.ov-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.ov-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 999px; font-size: 13.5px;
  font-weight: 700; cursor: pointer; transition: transform 0.12s, box-shadow 0.15s; font-family: inherit;
}
.ov-btn:active { transform: scale(0.97); }
.ov-btn--ai { background: #fef6e0; color: #92400e; border: 1.5px solid #f2cb63; }
.ov-btn--ai:disabled { opacity: 0.6; cursor: not-allowed; }
.ov-btn--help { background: #fff; color: #334155; border: 1.5px solid #e2e8f0; }
.ov-btn--video { background: #00a19a; color: #fff; border: 1.5px solid #00a19a; box-shadow: 0 10px 20px -10px rgba(0, 161, 154, 0.8); }
.ov-btn-play { display: inline-flex; }
.ov-btn--video .ov-btn-play :deep(.op-icon) { filter: brightness(0) invert(1); }

/* Progress card (right) */
.ov-progress-card {
  flex-shrink: 0;
  width: 220px;
  background: #fff;
  border: 1px solid #eef1f4;
  border-radius: 20px;
  padding: 22px 20px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  box-shadow: 0 10px 30px -20px rgba(15, 42, 72, 0.5);
}
.ov-ring {
  --p: 0; --size: 108px;
  width: var(--size); height: var(--size); border-radius: 50%;
  background: conic-gradient(#00a19a calc(var(--p) * 1%), #e8ecef 0);
  display: grid; place-items: center; margin-bottom: 16px;
}
.ov-ring::after { content: ''; width: 84px; height: 84px; background: #fff; border-radius: 50%; grid-area: 1 / 1; }
.ov-ring span { grid-area: 1 / 1; z-index: 1; font-size: 26px; font-weight: 800; color: #0a0f2c; }
.ov-ring-label { text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #0f766e; margin-bottom: 6px; }
.ov-ring-value { font-size: 14px; font-weight: 700; color: #0a0f2c; line-height: 1.3; }
.ov-ring-value em { font-style: normal; color: #94a3b8; font-weight: 600; }

/* Hero divider + seller row */
.ov-hero-divider { height: 1px; background: rgba(15, 42, 72, 0.08); margin: 24px 0 18px; position: relative; z-index: 1; }
.ov-seller-row { display: flex; align-items: center; gap: 16px; position: relative; z-index: 1; }
.ov-seller-avatar {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  background: rgba(0, 161, 154, 0.12);
  display: flex; align-items: center; justify-content: center;
}
.ov-seller-info { flex-shrink: 0; }
.ov-seller-info strong { display: block; font-size: 14px; font-weight: 700; color: #0a0f2c; line-height: 1.3; }
.ov-seller-info small { display: block; font-size: 12px; color: #94a3b8; margin-top: 2px; }
.ov-seller-bar-bg { flex: 1; height: 8px; background: #e6ebe9; border-radius: 999px; overflow: hidden; min-width: 60px; }
.ov-seller-bar-fill { height: 100%; background: linear-gradient(90deg, #10b3a3, #0f766e); border-radius: 999px; transition: width 0.4s ease; }
.ov-seller-count { flex-shrink: 0; font-size: 16px; font-weight: 800; color: #0f766e; }

/* ── File action buttons ──────────────────────────────────────────────── */
.section-actions { display: flex; gap: 12px; }
.section-btn {
  flex: 1; display: flex; align-items: center; justify-content: center;
  gap: 8px; padding: 12px; border-radius: 14px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; font-family: inherit;
}
.section-btn--disabled { opacity: 0.4; cursor: not-allowed; }
.section-btn--outline { background: white; border: 1.5px solid #00a19a; color: #00a19a; }
.section-btn--filled { background: #00a19a; border: none; color: white; }

/* ── Fixtures stats grid ──────────────────────────────────────────────── */
.section-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.section-stat { background: white; border-radius: 14px; padding: 14px; display: flex; align-items: flex-start; gap: 10px; border: 1px solid #eef1f4; box-shadow: 0 8px 22px -18px rgba(15, 42, 72, 0.4); }
.section-stat-label { font-size: 11px; color: #3c3c4399; margin: 0 0 2px; line-height: 1.3; }
.section-stat-value { font-size: 14px; font-weight: 700; color: #333; margin: 0; }
.section-stat-value--green { color: #00a19a; }
.section-stat-value--red { color: #e53e3e; }
.section-stat-value--amber { color: #e8941a; }

/* ── Section heading ──────────────────────────────────────────────────── */
.ov-eyebrow { display: inline-flex; align-items: center; gap: 10px; text-transform: uppercase; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; color: #0f766e; }
.ov-eyebrow-line { width: 28px; height: 2px; border-radius: 2px; background: #00a19a; }
.ov-sechead-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 12px; }
.ov-sechead-title { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0a0f2c; margin: 0; }
.ov-taskcount { flex-shrink: 0; font-size: 13px; font-weight: 700; color: #0f766e; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.2); padding: 6px 14px; border-radius: 999px; }

/* ── Tasks timeline ───────────────────────────────────────────────────── */
.ov-timeline { display: flex; flex-direction: column; }
.ov-tl-item { display: flex; align-items: stretch; gap: 18px; }
.ov-tl-rail { position: relative; width: 24px; flex-shrink: 0; display: flex; justify-content: center; }
.ov-tl-rail::before {
  content: ''; position: absolute; top: 0; bottom: 0; left: 50%;
  width: 2px; transform: translateX(-50%); background: #e3e8ec;
}
.ov-tl-item:first-child .ov-tl-rail::before { top: 30px; }
.ov-tl-item:last-child .ov-tl-rail::before { bottom: calc(100% - 30px); }
.ov-tl-marker {
  position: relative; z-index: 1; margin-top: 22px;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: #fff;
}
.ov-tl-marker--empty { border: 2px solid #cfd8dd; }
.ov-tl-marker--complete { background: #00a19a; border: 2px solid #00a19a; box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.14); }
.ov-tl-marker--partial { border: 2px solid #e8941a; box-shadow: 0 0 0 4px rgba(232, 148, 26, 0.14); }
.ov-tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #e8941a; }

.ov-task-card {
  flex: 1; min-width: 0; margin-bottom: 14px;
  display: flex; align-items: center; gap: 14px;
  background: #fff; border: 1px solid #eef1f4; border-radius: 18px;
  padding: 20px 22px; cursor: pointer;
  box-shadow: 0 10px 26px -22px rgba(15, 42, 72, 0.6);
  transition: transform 0.15s, box-shadow 0.18s, border-color 0.18s;
}
.ov-task-card:hover { transform: translateY(-2px); border-color: rgba(0, 161, 154, 0.35); box-shadow: 0 16px 34px -22px rgba(15, 118, 110, 0.6); }
.ov-task-main { flex: 1; min-width: 0; }
.ov-task-title { font-size: 17px; font-weight: 700; color: #0a1f3d; margin: 0 0 10px; line-height: 1.3; }
.ov-task-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ov-task-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 999px; }
.tag--gray { color: #64748b; background: #f1f5f9; }
.tag--complete { color: #0f766e; background: rgba(0, 161, 154, 0.12); }
.tag--partial { color: #b45309; background: #fdf0d9; }
.tag--included { color: #0f766e; background: rgba(0, 161, 154, 0.12); }
.tag--excluded { color: #e53e3e; background: #fdecec; }
.ov-task-arrow { width: 40px; height: 40px; border-radius: 50%; background: #f6f8fa; border: 1px solid #e7ecf0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, border-color 0.15s; }
.ov-task-card:hover .ov-task-arrow { background: rgba(0, 161, 154, 0.1); border-color: rgba(0, 161, 154, 0.3); }

/* ── Expert guidance (dark) ───────────────────────────────────────────── */
.ov-expert {
  border-radius: 22px;
  background: linear-gradient(120deg, #1b1a4e 0%, #241f5c 46%, #16324a 100%);
  padding: 26px 30px;
  position: relative;
  overflow: hidden;
}
.ov-expert::after {
  content: ''; position: absolute; right: -60px; top: -60px;
  width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.35), transparent 68%);
  pointer-events: none;
}
.ov-expert-badge {
  display: inline-flex; align-items: center; gap: 7px;
  color: #7fe3d8; font-size: 11px; font-weight: 800;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 6px 12px; border-radius: 999px;
  background: rgba(127, 227, 216, 0.12); border: 1px solid rgba(127, 227, 216, 0.22);
  position: relative; z-index: 1;
}
.ov-expert-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #14b8a6; }
.ov-expert-row { display: flex; align-items: center; gap: 18px; margin-top: 18px; position: relative; z-index: 1; }
.ov-expert-icon {
  width: 54px; height: 54px; border-radius: 16px; flex-shrink: 0;
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14);
  display: flex; align-items: center; justify-content: center;
}
.ov-expert-body { flex: 1; min-width: 0; }
.ov-expert-title { font-size: 21px; font-weight: 800; color: #fff; margin: 0 0 6px; letter-spacing: -0.02em; }
.ov-expert-desc { font-size: 14px; color: rgba(226, 232, 240, 0.75); line-height: 1.5; margin: 0 0 12px; max-width: 520px; }
.ov-expert-meta {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12.5px; font-weight: 600; color: rgba(226, 232, 240, 0.85);
  background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 6px 12px; border-radius: 999px;
}
.ov-expert-cta {
  flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 9px;
  background: #00a19a; color: #fff; border: 0;
  border-radius: 999px; padding: 14px 24px;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
  box-shadow: 0 16px 34px -14px rgba(0, 161, 154, 0.9);
  transition: transform 0.12s, box-shadow 0.15s;
}
.ov-expert-cta:hover { transform: translateY(-1px); box-shadow: 0 20px 38px -14px rgba(0, 161, 154, 1); }
.ov-expert-cta:active { transform: scale(0.98); }

/* ── AI Summary card ──────────────────────────────────────────────────── */
.ai-summary-card { background: #fffbeb; border: 1.5px solid #f5c44c; border-radius: 16px; padding: 16px 18px; }
.ai-summary-header { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #92400e; margin-bottom: 8px; }
.ai-summary-text { font-size: 14px; color: #1a1a1a; line-height: 1.6; margin: 0; }

/* ── Files sheet ──────────────────────────────────────────────────────── */
.files-sheet-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); z-index: 1000; display: flex; align-items: flex-end; }
.files-sheet { width: 100%; max-width: 600px; margin: 0 auto; max-height: 78vh; background: #fff; border-radius: 20px 20px 0 0; display: flex; flex-direction: column; overflow: hidden; }
.files-sheet-handle { width: 36px; height: 4px; background: #e0e0e0; border-radius: 2px; margin: 12px auto 4px; flex-shrink: 0; }
.files-sheet-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid #f0f0f0; flex-shrink: 0; }
.files-sheet-title { font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0; }
.files-sheet-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: #f5f5f5; border: none; cursor: pointer; }
.files-sheet-body { flex: 1; overflow-y: auto; padding: 16px 20px; -webkit-overflow-scrolling: touch; }
.files-empty { color: #888; font-size: 14px; text-align: center; padding: 20px 0; }
.file-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.file-row:last-child { border-bottom: none; }
.file-icon { flex-shrink: 0; width: 40px; height: 40px; border-radius: 8px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
.file-info { flex: 1; min-width: 0; }
.file-name { font-size: 14px; font-weight: 500; color: #1a1a1a; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-from { font-size: 11px; color: #9ca3af; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-actions { display: flex; gap: 6px; flex-shrink: 0; }
.file-btn { padding: 6px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; }
.file-btn--preview { background: #f0faf9; color: #00a19a; border: 1px solid #b2e4e1; }
.file-btn--download { background: #00a19a; color: white; min-width: 32px; text-align: center; }
.file-pending-badge { font-size: 11px; color: #999; background: #f3f3f3; border: 1px solid #e0e0e0; border-radius: 6px; padding: 4px 10px; font-weight: 500; white-space: nowrap; }

/* ── Lightbox ─────────────────────────────────────────────────────────── */
.lightbox-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.lightbox-panel { position: relative; width: 100%; max-width: 560px; max-height: 90vh; display: flex; flex-direction: column; border-radius: 12px; overflow: hidden; }
.lightbox-close { position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 0, 0, 0.6); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
.lightbox-img { max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px; }
.lightbox-iframe { width: 100%; height: 75vh; border: none; border-radius: 8px; background: white; }
.lightbox-unsupported { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px; text-align: center; }
.lightbox-unsupported p { color: #ccc; font-size: 15px; margin: 0; }
.lightbox-download-btn { background: #00a19a; color: white; border: none; border-radius: 10px; padding: 12px 24px; font-size: 14px; font-weight: 600; cursor: pointer; }
.lightbox-footer { display: flex; align-items: center; gap: 10px; padding: 10px 0 0; }
.lightbox-filename { flex: 1; font-size: 13px; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lightbox-dl-btn { background: #00a19a; color: white; border: none; border-radius: 8px; width: 36px; height: 36px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* ── Sheet transition ─────────────────────────────────────────────────── */
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.25s ease; }
.sheet-enter-active .files-sheet, .sheet-leave-active .files-sheet { transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .files-sheet, .sheet-leave-to .files-sheet { transform: translateY(100%); }

/* ── Responsive ───────────────────────────────────────────────────────── */
@media (max-width: 980px) {
  .ov-hero-top { flex-direction: column; }
  .ov-progress-card { width: 100%; flex-direction: row; text-align: left; gap: 18px; align-items: center; }
  .ov-progress-card .ov-ring { margin-bottom: 0; }
  .section-stats { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 899px) {
  .hsw-links { display: none; }
  .hsw-shell { width: calc(100% - 32px); }
  .hsw-nav-inner { min-height: 58px; }
}
@media (max-width: 720px) {
  .ov-expert-row { flex-wrap: wrap; }
  .ov-expert-cta { width: 100%; justify-content: center; }
  .ov-seller-row { flex-wrap: wrap; }
  .ov-seller-bar-bg { order: 3; flex-basis: 100%; }
}
@media (max-width: 640px) {
  .hsw-shell { width: calc(100% - 24px); }
  .hsw-back { display: none; }
  .bs-page { padding: 24px 0 60px; gap: 20px; }
  .ov-hero { padding: 22px 20px; }
  .ov-title { font-size: 26px; }
  .ov-heading { gap: 12px; margin: 14px 0 18px; }
  .ov-icon-tile { width: 52px; height: 52px; border-radius: 15px; }
  .section-stats { grid-template-columns: 1fr; }
  .ov-tl-item { gap: 12px; }
  .ov-task-card { padding: 16px 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .bsw-spinner { animation: none; }
  .ov-seller-bar-fill, .ov-task-card, .ov-expert-cta { transition: none; }
}
</style>
