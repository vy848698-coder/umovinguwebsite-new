function getAuthHeaders() {
  const token =
    typeof window !== 'undefined' ? getToken() : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Provenance/assurance status (client feedback, 2026-11-19) - mirrors
// computeProvenanceStatus in umu-backend/src/common/provenance-status.ts.
// Labels come straight from the backend response (provenanceStatusLabel);
// this map is just the per-status chip colour for display.
export const DOCUMENT_PROVENANCE_STYLE: Record<string, { className: string }> = {
  added_by_homeowner: { className: 'prov-default' },
  source_confirmed: { className: 'prov-confirmed' },
  checked: { className: 'prov-checked' },
  needs_checking: { className: 'prov-needs-checking' },
  expired: { className: 'prov-expired' },
}

export interface DocumentItem {
  id: string
  title: string
  fileUrl: string
  size: string
  mimeType: string
  tags: string[]
  passportId?: string
  passportAddress?: string
  expiresAt?: string | null
  uploadedAt: string
  source: 'passport' | 'user'
  provenanceStatus?: string
  provenanceStatusLabel?: string
}

export interface DocumentsResponse {
  passportDocuments: DocumentItem[]
  userDocuments: DocumentItem[]
  recentUploads: DocumentItem[]
}

export function useDocuments() {
  const config = useRuntimeConfig()
  const BASE_URL = config.public.apiBase
  const documents = ref<DocumentsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDocuments() {
    loading.value = true
    error.value = null
    try {
      documents.value = await $fetch<DocumentsResponse>(
        `${BASE_URL}/documents`,
        {
          headers: getAuthHeaders(),
        },
      )
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to load documents'
    } finally {
      loading.value = false
    }
  }

  async function uploadDocument(
    file: File,
    name: string,
    tags: string[],
    expiresAt?: string,
  ): Promise<DocumentItem> {
    const form = new FormData()
    form.append('file', file)
    form.append('name', name)
    if (tags.length) form.append('tags', tags.join(','))
    if (expiresAt) form.append('expiresAt', expiresAt)

    const doc = await $fetch<DocumentItem>(`${BASE_URL}/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: form,
    })

    // Prepend to local state
    if (documents.value) {
      documents.value.userDocuments.unshift(doc)
      documents.value.recentUploads.unshift(doc)
      if (documents.value.recentUploads.length > 5) {
        documents.value.recentUploads = documents.value.recentUploads.slice(
          0,
          5,
        )
      }
    }

    return doc
  }

  async function deleteDocument(id: string) {
    await $fetch(`${BASE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (documents.value) {
      documents.value.userDocuments = documents.value.userDocuments.filter(
        (d) => d.id !== id,
      )
      documents.value.recentUploads = documents.value.recentUploads.filter(
        (d) => d.id !== id,
      )
    }
  }

  // Owner self-check ("I've reviewed this and it's correct and up to
  // date" - client feedback, 2026-11-19), on either a vault document
  // ('user') or a passport-answer file ('answer' - passportDocuments
  // above, source: 'passport'). Updates local state in place so the chip
  // flips immediately without a full refetch.
  async function setDocumentChecked(
    id: string,
    checked: boolean,
    kind: 'answer' | 'user',
  ): Promise<{ id: string; verifiedAt: string | null; provenanceStatus: string; provenanceStatusLabel: string }> {
    const result = await $fetch<{ id: string; verifiedAt: string | null; provenanceStatus: string; provenanceStatusLabel: string }>(
      `${BASE_URL}/documents/${kind}/${id}/checked`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: { checked },
      },
    )

    if (documents.value) {
      const list = kind === 'answer' ? documents.value.passportDocuments : documents.value.userDocuments
      const doc = list.find((d) => d.id === id)
      if (doc) {
        doc.provenanceStatus = result.provenanceStatus
        doc.provenanceStatusLabel = result.provenanceStatusLabel
      }
      const recent = documents.value.recentUploads.find((d) => d.id === id)
      if (recent) {
        recent.provenanceStatus = result.provenanceStatus
        recent.provenanceStatusLabel = result.provenanceStatusLabel
      }
    }

    return result
  }

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    setDocumentChecked,
  }
}
