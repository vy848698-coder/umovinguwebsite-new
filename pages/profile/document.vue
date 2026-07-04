<template>
  <div class="dc-page mobile-container">
    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="dc-body">
      <!-- Hero -->
      <div class="dc-hero">
        <div class="dc-hero-text">
          <div class="hero-greeting">Everything you've stored</div>
          <div class="dc-h1">
            Documents<span class="dc-h1-count">{{ totalDocs }}</span>
          </div>
          <div class="hero-stats">
            <span><span class="stat-num">{{ totalDocs }}</span> total</span>
            <span class="stat-sep" />
            <span><span class="stat-num teal">{{ verifiedDocs }}</span> verified</span>
            <span class="stat-sep" />
            <span><span class="stat-num coral">{{ expiringDocs }}</span> expiring soon</span>
          </div>
        </div>
        <div class="dc-hero-art" aria-hidden="true">
          <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="92" cy="132" rx="78" ry="13" fill="#0c1a3a" />
            <g>
              <rect x="58" y="34" width="62" height="80" rx="5" fill="#fff" />
              <rect x="68" y="46" width="42" height="4" rx="2" fill="#cfe0f5" />
              <rect x="68" y="56" width="42" height="4" rx="2" fill="#cfe0f5" />
              <rect x="68" y="66" width="30" height="4" rx="2" fill="#cfe0f5" />
              <rect x="78" y="28" width="62" height="80" rx="5" fill="#f4f8ff" />
              <rect x="88" y="40" width="42" height="4" rx="2" fill="#bcd2ee" />
              <rect x="88" y="50" width="42" height="4" rx="2" fill="#bcd2ee" />
              <rect x="88" y="60" width="30" height="4" rx="2" fill="#bcd2ee" />
            </g>
            <path d="M44 60h44l10 12h52a8 8 0 0 1 8 8v44a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V68a8 8 0 0 1 8-8z" fill="#0f9b8e" />
            <path d="M44 76h112a8 8 0 0 1 8 8v40a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V84a8 8 0 0 1 8-8z" fill="#1fb6a6" />
            <circle cx="170" cy="58" r="20" fill="#16a394" />
            <path d="M162 58l5 5 11-11" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>

      <!-- Search + Filter -->
      <div class="dc-search-row">
        <div class="dc-search">
          <span class="dc-search-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            class="dc-search-input"
            placeholder="Search documents…"
          />
        </div>
        <button class="dc-filter-btn" type="button" aria-label="Filter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="17" x2="14" y2="17" />
          </svg>
          Filter
        </button>
      </div>

      <!-- Categories grid -->
      <div class="dc-cats">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="dc-cat"
          :class="[cat.tone, { active: activeCategory === cat.key }]"
          @click="activeCategory = activeCategory === cat.key ? '' : cat.key"
        >
          <div class="dc-cat-icon">
            <span v-html="cat.icon" />
          </div>
          <div class="dc-cat-body">
            <div class="dc-cat-name">{{ cat.name }}</div>
            <div class="dc-cat-count">
              {{ cat.count }} {{ cat.count === 1 ? 'document' : 'documents' }}
            </div>
          </div>
          <div class="dc-cat-chevron">›</div>
        </button>
      </div>

      <!-- Recently uploaded card -->
      <div class="dc-recent-card">
        <div class="dc-section-heading">
          Recently uploaded
          <span
            v-if="filteredAllDocs.length > 5"
            class="dc-sh-action"
            @click="showAllDocs = !showAllDocs"
          >
            {{ showAllDocs ? 'Show less' : 'See all' }}
          </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="dc-loading">Loading…</div>

        <template v-else>
          <!-- Empty state -->
          <div v-if="filteredAllDocs.length === 0" class="dc-empty">
            <div class="dc-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div class="dc-empty-title">No documents yet</div>
            <div class="dc-empty-sub">
              Upload your first document to keep everything organised and secure.
            </div>
            <button class="dc-empty-btn" type="button" @click="openUploadModal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload document
            </button>
          </div>

          <!-- Document list -->
          <div
            v-for="doc in (showAllDocs ? filteredAllDocs : filteredAllDocs.slice(0, 5))"
            :key="doc.id"
            class="dc-doc"
          >
            <div class="dc-doc-icon" :class="docIconClass(doc)">
              {{ docIconLabel(doc) }}
            </div>
            <div class="dc-doc-info">
              <div class="dc-doc-name">{{ doc.title }}</div>
              <div class="dc-doc-meta">
                {{ docMeta(doc) }}
              </div>
            </div>
            <div class="dc-doc-action">›</div>
          </div>
        </template>
      </div>
    </main>

    <!-- Floating upload button -->
    <button class="fab" aria-label="Upload document" @click="openUploadModal">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    </button>

    <SiteFooter />

    <!-- Upload Document Modal -->
    <Teleport to="body">
      <div v-show="showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
        <div class="modal">
          <div class="modal-handle" />
          <div class="modal-header">
            <div class="modal-title">Upload document</div>
            <button class="modal-close" type="button" aria-label="Close" @click="closeUploadModal">×</button>
          </div>

          <div class="modal-body">
            <!-- Drop zone -->
            <label v-if="!selectedFile" class="up-drop">
              <div class="up-drop-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div class="up-drop-title">Drop your file here</div>
              <div class="up-drop-sub">or tap to browse · PDF, JPG, DOCX up to 25MB</div>
              <div class="up-drop-actions">
                <span class="btn-secondary">📷 Camera</span>
                <span class="btn-secondary">📁 Files</span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                class="sr-only"
                @change="onFilePicked"
              />
            </label>

            <!-- File preview -->
            <div v-else class="up-file">
              <div class="up-file-thumb">
                <img v-if="selectedFilePreview && isImageFile" :src="selectedFilePreview" alt="Preview" />
                <template v-else>
                  <div class="up-file-thumb-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div class="up-file-ext">{{ fileExtension.toUpperCase() }}</div>
                </template>
              </div>
              <div class="up-file-info">
                <div class="up-file-name">{{ docName || selectedFile.name }}</div>
                <div class="up-file-meta">{{ fileSizeLabel }} · {{ fileExtension.toUpperCase() }}</div>
              </div>
              <button class="up-file-clear" type="button" aria-label="Choose different file" @click="clearSelectedFile">×</button>
            </div>

            <!-- Category -->
            <div class="mform-section">
              <div class="mform-label">Category</div>
              <div class="mform-radio-group">
                <button
                  v-for="cat in catOptions"
                  :key="cat.key"
                  type="button"
                  class="mform-radio"
                  :class="[cat.tone, { active: chosenCategory === cat.key }]"
                  @click="chosenCategory = cat.key"
                >
                  <div class="mfr-icon">{{ cat.icon }}</div>
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Document name -->
            <div class="mform-section">
              <div class="mform-label">Document name</div>
              <input
                v-model="docName"
                class="mform-input"
                type="text"
                placeholder="e.g. EPC Certificate"
              />
            </div>

            <!-- Tags -->
            <div class="mform-section">
              <div class="mform-label">Tags (optional)</div>
              <input
                v-model="docTagsInput"
                class="mform-input"
                type="text"
                placeholder="Comma separated, e.g. epc, energy"
              />
              <div v-if="parsedTags.length" class="up-tag-row">
                <span v-for="tag in parsedTags" :key="tag" class="up-tag">#{{ tag }}</span>
              </div>
            </div>

            <!-- Expiry -->
            <div class="mform-section">
              <div class="mform-label">Expires (optional)</div>
              <input
                type="date"
                class="mform-input"
                :min="minDate"
                :value="docExpiresAt"
                @change="onExpiryChange"
              />
            </div>

            <p v-if="uploadError" class="up-error">{{ uploadError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" type="button" @click="closeUploadModal">Cancel</button>
            <button
              class="btn-primary"
              type="button"
              :disabled="uploading"
              @click="submitDocument"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              {{ uploading ? 'Uploading…' : 'Upload' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'

definePageMeta({ title: 'Your Documents - UmovingU', middleware: 'auth' })

const { documents, loading, fetchDocuments, uploadDocument, deleteDocument } = useDocuments()

onMounted(fetchDocuments)

// ── Computed lists ──────────────────────────────────────────────────────────

const searchQuery = ref('')

const recentUploads = computed(() => documents.value?.recentUploads ?? [])

const filteredPassportDocs = computed(() => {
  const docs = documents.value?.passportDocuments ?? []
  if (!searchQuery.value.trim()) return docs
  const q = searchQuery.value.toLowerCase()
  return docs.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)) ||
      d.passportAddress?.toLowerCase().includes(q),
  )
})

const filteredUserDocs = computed(() => {
  const docs = documents.value?.userDocuments ?? []
  if (!searchQuery.value.trim()) return docs
  const q = searchQuery.value.toLowerCase()
  return docs.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.tags.some((t) => t.toLowerCase().includes(q)),
  )
})

const showAllPassport = ref(false)
const showAllUser = ref(false)
const showAllDocs = ref(false)
const activeCategory = ref('')

// ── Combined doc list ──────────────────────────────────────────
const allDocs = computed(() => {
  const passport = (documents.value?.passportDocuments ?? []).map((d) => ({
    ...d,
    source: 'passport',
  }))
  const user = (documents.value?.userDocuments ?? []).map((d) => ({
    ...d,
    source: 'user',
  }))
  return [...passport, ...user].sort((a, b) => {
    const ax = +new Date(a.createdAt ?? a.uploadedAt ?? 0)
    const bx = +new Date(b.createdAt ?? b.uploadedAt ?? 0)
    return bx - ax
  })
})
const totalDocs = computed(() => allDocs.value.length)
const verifiedDocs = computed(
  () => allDocs.value.filter((d) => d.source === 'passport').length,
)
const expiringDocs = computed(() => {
  const now = Date.now()
  const SOON = 30 * 24 * 60 * 60 * 1000
  return allDocs.value.filter((d) => {
    if (!d.expiresAt) return false
    const ts = new Date(d.expiresAt).getTime()
    return ts > now && ts - now < SOON
  }).length
})

// ── Categorisation (flat: Title / Energy / Legal / Surveys / Financial / Other) ──
function docCategory(doc) {
  const haystack = `${doc.title || ''} ${(doc.tags || []).join(' ')} ${doc.passportSectionKey || ''}`.toLowerCase()
  if (/title|deed|land registry|conveyance/.test(haystack)) return 'title'
  if (/epc|energy|gas|boiler|electric|heating/.test(haystack)) return 'energy'
  if (/solicitor|legal|contract|covenant|search|aml|kyc/.test(haystack)) return 'legal'
  if (/survey|valuation|inspection|home report/.test(haystack)) return 'surveys'
  if (/aip|mortgage|bank|statement|payslip|invoice|funds|payment/.test(haystack)) return 'financial'
  return 'other'
}

const categories = computed(() => {
  const counts = { title: 0, energy: 0, legal: 0, surveys: 0, financial: 0, other: 0 }
  for (const d of allDocs.value) counts[docCategory(d)]++
  return [
    { key: 'title', name: 'Title', tone: 'identity', count: counts.title, icon: '📘' },
    { key: 'energy', name: 'Energy', tone: 'property', count: counts.energy, icon: '⚡' },
    { key: 'legal', name: 'Legal', tone: 'identity', count: counts.legal, icon: '⚖️' },
    { key: 'surveys', name: 'Surveys', tone: 'property', count: counts.surveys, icon: '🏠' },
    { key: 'financial', name: 'Financial', tone: 'financial', count: counts.financial, icon: '£' },
    { key: 'other', name: 'Other', tone: 'other', count: counts.other, icon: '📁' },
  ]
})

const filteredAllDocs = computed(() => {
  let list = allDocs.value
  if (activeCategory.value) list = list.filter((d) => docCategory(d) === activeCategory.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (d) =>
      d.title?.toLowerCase().includes(q) ||
      (d.tags || []).some((t) => t.toLowerCase().includes(q)),
  )
})

function docIconClass(doc) {
  const m = (doc.mimeType || '').toLowerCase()
  if (m.includes('pdf')) return 'pdf'
  if (m.includes('image')) return 'img'
  return ''
}
function docIconLabel(doc) {
  return mimeLabel(doc.mimeType) || 'DOC'
}
function docMeta(doc) {
  const parts = []
  const cat = categories.value.find((c) => c.key === docCategory(doc))
  if (cat) parts.push(cat.name)
  if (doc.uploadedAt) parts.push(doc.uploadedAt)
  else if (doc.createdAt) parts.push(formatDate(doc.createdAt))
  if (doc.expiresAt) parts.push(`expires ${formatDate(doc.expiresAt)}`)
  return parts.join(' · ')
}

// ── Helpers ────────────────────────────────────────────────────────────────

function mimeLabel(mime) {
  if (!mime) return ''
  if (mime.includes('pdf')) return 'PDF'
  if (mime.includes('word') || mime.includes('docx')) return 'DOC'
  if (mime.includes('image')) return 'IMG'
  return mime.split('/')[1]?.toUpperCase() ?? ''
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ── Delete ─────────────────────────────────────────────────────────────────

const handleDelete = async (id) => {
  try {
    await deleteDocument(id)
  } catch {}
}

// ── Upload flow ─────────────────────────────────────────────────────────────

const showUploadModal = ref(false)
const selectedFile = ref(null)
const selectedFilePreview = ref('')
const docName = ref('')
const docExpiresAt = ref('')
const docTagsInput = ref('')
const uploading = ref(false)
const uploadError = ref('')
const chosenCategory = ref('property')

const catOptions = [
  { key: 'identity', name: 'Identity', tone: 'identity', icon: '🪪' },
  { key: 'property', name: 'Property', tone: 'property', icon: '🏠' },
  { key: 'financial', name: 'Financial', tone: 'financial', icon: '£' },
  { key: 'other', name: 'Other', tone: 'other', icon: '📁' },
]

const openUploadModal = () => {
  selectedFile.value = null
  selectedFilePreview.value = ''
  docName.value = ''
  docExpiresAt.value = ''
  docTagsInput.value = ''
  uploadError.value = ''
  chosenCategory.value = 'property'
  showUploadModal.value = true
}

const closeUploadModal = () => {
  if (uploading.value) return
  showUploadModal.value = false
}

const clearSelectedFile = () => {
  selectedFile.value = null
  selectedFilePreview.value = ''
}

const minDate = computed(() => new Date().toISOString().split('T')[0])

const isImageFile = computed(() =>
  selectedFile.value?.type?.startsWith('image/'),
)

const fileExtension = computed(() => {
  if (!selectedFile.value) return ''
  const name = selectedFile.value.name
  return name.split('.').pop()?.toLowerCase() ?? ''
})

const fileSizeLabel = computed(() => {
  const size = selectedFile.value?.size
  if (!size) return ''
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)}MB`
  if (size >= 1024) return `${(size / 1024).toFixed(0)}KB`
  return `${size}B`
})

const docExpiryLabel = computed(() => {
  if (!docExpiresAt.value) return 'Pick date'
  const d = new Date(docExpiresAt.value)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
})

const parsedTags = computed(() =>
  docTagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean),
)

const onFilePicked = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  selectedFile.value = file
  docName.value = file.name.replace(/\.[^.]+$/, '')
  uploadError.value = ''
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (ev) => { selectedFilePreview.value = ev.target.result }
    reader.readAsDataURL(file)
  } else {
    selectedFilePreview.value = ''
  }
  e.target.value = ''
}

const onExpiryChange = (e) => {
  docExpiresAt.value = e.target.value
}

const submitDocument = async () => {
  if (!selectedFile.value) {
    uploadError.value = 'Please attach a file before uploading.'
    return
  }
  uploading.value = true
  uploadError.value = ''
  try {
    const tags = [...parsedTags.value, `cat:${chosenCategory.value}`]
    await uploadDocument(
      selectedFile.value,
      docName.value,
      tags,
      docExpiresAt.value || undefined,
    )
    showUploadModal.value = false
  } catch (e) {
    uploadError.value = e?.data?.message || 'Upload failed. Please try again.'
  } finally {
    uploading.value = false
  }
}

const goBack = useGoBack('/profile')
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.dc-page {
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
  padding-bottom: 0;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.dc-page :deep(.bpnav) {
  background: rgba(243, 242, 239, 0.88);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
}

.dc-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.dc-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  box-shadow:
    0 8px 22px rgba(19, 48, 71, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.dc-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow:
    0 12px 24px rgba(19, 48, 71, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.dc-nav-icon-btn svg { width: 18px; height: 18px; }
.dc-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #231d45;
}

.dc-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 8px 14px 0;
}

.dc-hero {
  margin-top: 8px;
  border-radius: 28px;
  padding: 28px 32px;
  border: 1px solid rgba(28, 46, 92, 0.6);
  background:
    radial-gradient(circle at 88% 18%, rgba(31, 182, 166, 0.22) 0%, rgba(31, 182, 166, 0) 46%),
    linear-gradient(135deg, #1a1f4d 0%, #161a40 55%, #11173a 100%);
  box-shadow: 0 18px 44px rgba(12, 22, 52, 0.28);
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.dc-hero-text { position: relative; z-index: 1; }
.dc-hero-art {
  flex-shrink: 0;
  width: 240px;
  max-width: 38%;
}
.dc-hero-art svg { width: 100%; height: auto; display: block; }
.hero-greeting {
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #2fd2bf;
  font-weight: 800;
  margin-bottom: 6px;
}
.dc-h1 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 40px;
  font-weight: 750;
  color: #ffffff;
  letter-spacing: -1px;
  line-height: 1.04;
  margin-bottom: 16px;
}
.dc-h1-count {
  display: inline-block;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #2fd2bf;
  vertical-align: 8px;
  margin-left: 8px;
  letter-spacing: -0.2px;
}
.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 9px 16px;
  font-size: 12.5px;
  font-weight: 600;
  color: #c3cde6;
  letter-spacing: -0.2px;
  flex-wrap: nowrap;
}
.hero-stats .stat-num { color: #6fc8ff; font-weight: 800; margin-right: 4px; }
.hero-stats .stat-num.teal { color: #2fd2bf; }
.hero-stats .stat-num.coral { color: #f0a35a; }
.hero-stats .stat-sep { width: 4px; height: 4px; border-radius: 50%; background: rgba(255, 255, 255, 0.32); display: inline-block; }

.dc-search-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  position: relative;
  z-index: 1;
}
.dc-search { position: relative; flex: 1; }
.dc-filter-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e9f3;
  border-radius: 14px;
  padding: 12px 18px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  color: #2b3a52;
  cursor: pointer;
  box-shadow: 0 6px 14px rgba(19, 51, 82, 0.05);
  transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
}
.dc-filter-btn:hover {
  border-color: #b9d5ea;
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(19, 51, 82, 0.1);
}
.dc-filter-btn svg { width: 16px; height: 16px; color: #50637a; }
.dc-search-input {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e9f3;
  border-radius: 14px;
  padding: 13px 16px 13px 42px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #15273d;
  outline: none;
  box-shadow: 0 6px 14px rgba(19, 51, 82, 0.05);
  transition: border-color 0.15s ease;
}
.dc-search-input::placeholder { color: #8c9cb2; font-weight: 500; }
.dc-search-input:focus {
  border-color: #7da7cf;
}
.dc-search-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8fa5;
}
.dc-search-icon svg { width: 16px; height: 16px; }

.dc-cats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 0;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}
.dc-cat {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 18px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.24s;
  position: relative;
  overflow: hidden;
  font-family: inherit;
  text-align: left;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.05);
  display: flex;
  align-items: center;
  gap: 14px;
}
.dc-cat:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.dc-cat.active { border-width: 1.5px; }
.dc-cat.identity { background: linear-gradient(135deg, rgba(229, 255, 248, 0.95), rgba(220, 246, 240, 0.92)); border-color: rgba(61, 189, 163, 0.3); }
.dc-cat.property { background: linear-gradient(135deg, rgba(238, 248, 255, 0.96), rgba(220, 236, 255, 0.94)); border-color: rgba(78, 147, 227, 0.3); }
.dc-cat.financial { background: linear-gradient(135deg, rgba(255, 243, 237, 0.96), rgba(255, 226, 214, 0.94)); border-color: rgba(220, 129, 92, 0.3); }
.dc-cat.other { background: linear-gradient(135deg, rgba(240, 237, 255, 0.96), rgba(227, 219, 255, 0.94)); border-color: rgba(131, 111, 220, 0.3); }
.dc-cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(19, 51, 82, 0.06);
}
.dc-cat-body { flex: 1; min-width: 0; }
.dc-cat-name {
  font-size: 15px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}
.dc-cat-count {
  font-size: 12.5px;
  font-weight: 600;
  color: #627891;
}
.dc-cat-chevron {
  font-size: 22px;
  color: #9fb1c8;
  flex-shrink: 0;
  line-height: 1;
}

.dc-recent-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e2e9f3;
  border-radius: 22px;
  padding: 20px 22px 26px;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 28px rgba(19, 51, 82, 0.05);
}

.dc-section-heading {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.dc-sh-action {
  margin-left: auto;
  font-size: 12px;
  font-weight: 800;
  color: #067a74;
  cursor: pointer;
  letter-spacing: 0;
  text-transform: none;
}

.dc-doc {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  margin: 0 0 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.22s;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}
.dc-doc:hover {
  border-color: #b9d5ea;
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.dc-doc-icon {
  width: 36px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #edf4ff, #dce9ff);
  color: #476290;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.3px;
  position: relative;
}
.dc-doc-icon.pdf { background: linear-gradient(135deg, #ffe6e1, #ffd0c8); color: #b85b36; }
.dc-doc-icon.img { background: linear-gradient(135deg, #dcf7ef, #c8efe3); color: #067a74; }
.dc-doc-icon::after {
  content: '';
  position: absolute;
  top: 4px; right: 4px;
  width: 6px; height: 6px;
  border-style: solid;
  border-width: 0 0 4px 4px;
  border-color: transparent transparent rgba(27, 44, 66, 0.18) transparent;
}
.dc-doc-info { flex: 1; min-width: 0; }
.dc-doc-name {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dc-doc-meta {
  font-size: 11.5px;
  font-weight: 600;
  color: #7388a1;
  margin-top: 2px;
}
.dc-doc-action {
  color: #8fa2bc;
  font-size: 18px;
  flex-shrink: 0;
}

.dc-loading {
  text-align: center;
  padding: 28px 0;
  color: #7388a1;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.dc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 44px 20px 40px;
}
.dc-empty-icon {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(31, 182, 166, 0.16) 0%, rgba(31, 182, 166, 0.05) 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1fb6a6;
  margin-bottom: 18px;
}
.dc-empty-icon svg { width: 34px; height: 34px; }
.dc-empty-title {
  font-size: 19px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
}
.dc-empty-sub {
  font-size: 14px;
  font-weight: 500;
  color: #7388a1;
  max-width: 320px;
  line-height: 1.45;
  margin-bottom: 22px;
}
.dc-empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, #12b0a2 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 13px 22px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(0, 161, 154, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.dc-empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(0, 161, 154, 0.34);
  filter: saturate(1.05);
}
.dc-empty-btn svg { width: 17px; height: 17px; }

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
.fab svg { width: 22px; height: 22px; }

.modal-overlay {
  /* Teleported to <body>, so re-declare the theme vars it relies on */
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
}
.modal {
  width: 100%;
  max-width: 28rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  max-height: 88vh;
  overflow: hidden;
  animation: modal-up 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
/* Centered card on larger screens so it doesn't stretch top-to-bottom */
@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 24px;
  }
  .modal {
    border-radius: 24px;
    max-height: min(88vh, 680px);
    box-shadow: 0 30px 70px rgba(12, 22, 52, 0.32);
    animation: modal-pop 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .modal-handle { display: none; }
}
@keyframes modal-pop {
  from { transform: translateY(16px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes modal-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.modal-handle { width: 36px; height: 4px; background: #ccd7e6; border-radius: 100px; margin: 8px auto 0; }
.modal-header { display: flex; align-items: center; padding: 12px 18px 10px; }
.modal-title { flex: 1; font-size: 18px; font-weight: 800; color: #17314a; letter-spacing: -0.4px; }
.modal-close {
  width: 30px; height: 30px;
  border-radius: 12px;
  border: none;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  font-size: 20px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-close:hover { background: rgba(205, 240, 232, 0.96); }
.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px 18px 14px;
  scrollbar-width: thin;
  scrollbar-color: #c4d3e6 transparent;
}
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb {
  background: #c4d3e6;
  border-radius: 100px;
}
.modal-body::-webkit-scrollbar-thumb:hover { background: #a7bcd6; }
.modal-footer {
  padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  display: flex;
  gap: 8px;
}

.up-drop {
  display: block;
  background: linear-gradient(135deg, rgba(229, 255, 248, 0.92), rgba(220, 246, 240, 0.9));
  border: 1.5px dashed #58b7a8;
  border-radius: 16px;
  padding: 22px 16px;
  text-align: center;
  margin-bottom: 14px;
  cursor: pointer;
}
.up-drop-icon {
  width: 48px; height: 48px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 8px;
  box-shadow: 0 8px 16px rgba(31, 122, 102, 0.28);
}
.up-drop-icon svg { width: 22px; height: 22px; }
.up-drop-title {
  font-size: 15px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}
.up-drop-sub {
  font-size: 12px;
  font-weight: 600;
  color: #627891;
  margin-bottom: 10px;
}
.up-drop-actions { display: flex; gap: 6px; justify-content: center; }
.up-drop-actions .btn-secondary {
  padding: 7px 12px;
  font-size: 11.5px;
}

.up-file {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  position: relative;
}
.up-file-thumb {
  width: 56px; height: 64px;
  border-radius: 11px;
  background: linear-gradient(135deg, #edf4ff, #dce9ff);
  color: #476290;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.up-file-thumb img { width: 100%; height: 100%; object-fit: cover; }
.up-file-thumb-icon { color: #6f4d14; }
.up-file-thumb-icon svg { width: 22px; height: 22px; }
.up-file-ext {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #476290;
  margin-top: 2px;
}
.up-file-info { flex: 1; min-width: 0; }
.up-file-name {
  font-size: 14px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.up-file-meta { font-size: 11px; font-weight: 600; color: #7388a1; margin-top: 2px; }
.up-file-clear {
  width: 28px; height: 28px;
  border-radius: 10px;
  border: none;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  font-size: 16px;
  cursor: pointer;
  font-family: inherit;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mform-section { margin-bottom: 14px; }
.mform-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  margin-bottom: 8px;
}
.mform-input {
  width: 100%;
  background: #ffffff;
  border: 1px solid #d9e4f0;
  border-radius: 12px;
  padding: 11px 13px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #17314a;
  outline: none;
  transition: border-color 0.15s ease;
}
.mform-input:focus { border-color: #7da7cf; }
.mform-input::placeholder { color: #8c9cb2; font-weight: 500; }
.mform-radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.mform-radio {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 12px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  color: #17314a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  text-align: left;
}
.mform-radio:hover { border-color: #b9d5ea; }
.mform-radio.identity.active { border-color: #3dbda3; background: #f1f9f4; color: #1f7a66; }
.mform-radio.identity.active .mfr-icon { background: rgba(61, 189, 163, 0.4); }
.mform-radio.property.active { border-color: #d4a659; background: #fdf4dc; color: #6f4d14; }
.mform-radio.property.active .mfr-icon { background: #f5c44c; color: #6f4d14; }
.mform-radio.financial.active { border-color: #ff8b5a; background: #ffe9dd; color: #b85b36; }
.mform-radio.financial.active .mfr-icon { background: rgba(255, 139, 90, 0.4); }
.mform-radio.other.active { border-color: #9d7bff; background: #ede5ff; color: #6b4e9f; }
.mform-radio.other.active .mfr-icon { background: rgba(157, 123, 255, 0.4); }
.mfr-icon {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 13px;
}

.up-tag-row {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.up-tag {
  background: rgba(61, 189, 163, 0.14);
  color: #067a74;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.1px;
  padding: 3px 9px;
  border-radius: 100px;
}

.up-error {
  text-align: center;
  color: #c35a47;
  font-size: 12px;
  font-weight: 700;
}

.btn-secondary {
  flex: 1;
  background: #ffffff;
  color: #17314a;
  border: 1px solid #d6e3f0;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-secondary:hover {
  border-color: #7fb7de;
  color: #067a74;
}
.btn-primary {
  flex: 2;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
}
.btn-primary:hover {
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: progress;
  box-shadow: none;
  filter: none;
}
.btn-primary svg { width: 14px; height: 14px; }

.dc-doc,
.dc-cat,
.fab,
.btn-primary,
.btn-secondary,
.dc-nav-icon-btn,
.dc-sh-action {
  touch-action: manipulation;
}

.dc-cat:active,
.dc-doc:active,
.fab:active,
.btn-primary:active,
.btn-secondary:active,
.dc-nav-icon-btn:active,
.dc-sh-action:active {
  transform: scale(0.985);
}

@media (min-width: 768px) {
  .dc-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .dc-body {
    padding: 8px 18px 0;
  }

  .dc-cats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
}

@media (max-width: 640px) {
  .dc-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 22px;
  }
  .dc-hero-art {
    display: none;
  }
}

@media (max-width: 430px) {
  .dc-nav-title {
    font-size: 18px;
  }

  .dc-hero {
    padding: 22px 20px;
  }

  .dc-h1 {
    font-size: 32px;
  }
  .dc-h1-count {
    font-size: 22px;
    vertical-align: 6px;
  }

  .dc-search-row {
    gap: 8px;
  }
  .dc-filter-btn {
    padding: 12px 14px;
  }

  .hero-stats {
    gap: 8px;
    padding: 7px 12px;
    font-size: 11.5px;
  }

  /* Reduce visual workload on smaller devices for faster open interactions */
  .dc-hero,
  .dc-cat,
  .dc-doc,
  .fab,
  .btn-primary {
    box-shadow: 0 8px 16px rgba(21, 58, 95, 0.1);
  }

  .modal-overlay {
    backdrop-filter: none;
    background: rgba(14, 40, 64, 0.42);
  }

  .modal {
    animation-duration: 0.14s;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dc-nav-icon-btn,
  .dc-hero,
  .dc-cat,
  .dc-doc,
  .fab,
  .btn-primary,
  .btn-secondary,
  .modal {
    transition: none;
    animation: none;
  }

  .dc-hero::before {
    display: none;
  }
}
</style>
