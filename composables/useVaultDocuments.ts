// Per-document Vault access — replaces the old per-SECTION Private/Public
// toggle (setVisibility / PATCH /passport/section/:id/visibility, still
// used by the mobile app, untouched) with real per-document control:
// PRIVATE (owner only) / SELECTED (specific collaborators) / ELIGIBLE
// (candidate for the next share/publish, confirmed per-send on the review
// screen) / PUBLISHED (always on the published Passport).
export const useVaultDocuments = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  const token = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = () => ({
    Authorization: `Bearer ${token()}`,
    'Content-Type': 'application/json',
  })

  interface VaultDocument {
    id: string
    kind: 'answer' | 'user'
    title: string
    fileUrl: string
    accessLevel: 'PRIVATE' | 'SELECTED' | 'ELIGIBLE' | 'PUBLISHED'
    sharedWith: { id: string; name: string }[]
    uploadedAt: string
  }

  interface VaultResponse {
    homeRecords: VaultDocument[]
    personalDocuments: VaultDocument[]
  }

  const getPassportVault = (passportId: string): Promise<VaultResponse> =>
    $fetch(`${base}/documents/passport/${passportId}/vault`, { headers: headers() })

  const getSharePreview = (passportId: string): Promise<VaultResponse> =>
    $fetch(`${base}/documents/passport/${passportId}/share-preview`, { headers: headers() })

  const setDocumentAccess = (
    kind: 'answer' | 'user',
    id: string,
    accessLevel: 'PRIVATE' | 'SELECTED' | 'ELIGIBLE' | 'PUBLISHED',
  ) =>
    $fetch(`${base}/documents/${kind}/${id}/access`, {
      method: 'POST',
      headers: headers(),
      body: { accessLevel },
    })

  const addDocumentGrant = (kind: 'answer' | 'user', id: string, collaboratorUserId: string) =>
    $fetch(`${base}/documents/${kind}/${id}/grants`, {
      method: 'POST',
      headers: headers(),
      body: { collaboratorUserId },
    })

  const removeDocumentGrant = (kind: 'answer' | 'user', id: string, collaboratorUserId: string) =>
    $fetch(`${base}/documents/${kind}/${id}/grants/${collaboratorUserId}`, {
      method: 'DELETE',
      headers: headers(),
    })

  return {
    getPassportVault,
    getSharePreview,
    setDocumentAccess,
    addDocumentGrant,
    removeDocumentGrant,
  }
}
