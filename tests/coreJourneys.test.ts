// Core user journeys the pen-test report flagged as untested (finding #8):
// sign-up, claim, viewing a Passport, and sharing one. These composables
// use Nuxt's auto-imports ($fetch, useRuntimeConfig, getToken/clearToken
// from useAuthToken.ts) with no local import statement, so outside Nuxt's
// build we stub them as plain globals the same way Nuxt's auto-import
// transform would provide them.

import { describe, it, expect, vi, beforeEach } from 'vitest'

const fetchMock = vi.fn()
const clearTokenMock = vi.fn()
;(globalThis as any).$fetch = fetchMock
;(globalThis as any).useRuntimeConfig = () => ({ public: { apiBase: 'https://api.test' } })
;(globalThis as any).getToken = () => 'test-access-token'
;(globalThis as any).clearToken = clearTokenMock
;(globalThis as any).clearSessionFlag = vi.fn()
;(globalThis as any).localStorage = { removeItem: vi.fn() }

import { useAuth } from '../composables/useAuth'
import { usePassportClaim } from '../composables/usePassportClaim'
import { usePassportApi } from '../composables/usePassportApi'
import { useBuyerProfile } from '../composables/useBuyerProfile'

beforeEach(() => {
  fetchMock.mockReset()
})

describe('useAuth - sign-up journey', () => {
  it('registers with the right endpoint, credentials and app header', async () => {
    fetchMock.mockResolvedValueOnce({ message: 'ok' })
    const { register } = useAuth()
    await register({ email: 'a@b.com', password: 'hunter2', firstName: 'Ann' })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/auth/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'X-Umu-App': 'website-new' },
        body: { email: 'a@b.com', password: 'hunter2', firstName: 'Ann' },
      }),
    )
  })

  it('verifyOtp identifies this app so the refresh cookie is scoped correctly', async () => {
    fetchMock.mockResolvedValueOnce({ token: 'jwt' })
    const { verifyOtp } = useAuth()
    await verifyOtp('a@b.com', '123456')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/auth/verify-otp',
      expect.objectContaining({
        headers: { 'X-Umu-App': 'website-new' },
        body: { email: 'a@b.com', code: '123456' },
      }),
    )
  })

  it('logout clears local token state even if the backend call fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network down'))
    const { logout } = useAuth()

    await logout()

    expect(clearTokenMock).toHaveBeenCalled()
  })
})

describe('usePassportClaim - claim journey', () => {
  it('claimPassport creates the passport then activates it so sections are seeded', async () => {
    fetchMock
      .mockResolvedValueOnce({ passportId: 'p1' }) // /passport/create
      .mockResolvedValueOnce({ passportId: 'p1' }) // /passport/p1/activate

    const { claimPassport } = usePassportClaim()
    const result = await claimPassport('prop1', '1 High St', 'AB1 2CD')

    expect(result).toEqual({ passportId: 'p1' })
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.test/passport/create',
      expect.objectContaining({
        method: 'POST',
        body: { propertyId: 'prop1', addressLine1: '1 High St', postcode: 'AB1 2CD', type: 'seller' },
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.test/passport/p1/activate',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('claimPassport still returns the passport if activation fails (non-fatal)', async () => {
    fetchMock
      .mockResolvedValueOnce({ passportId: 'p1' })
      .mockRejectedValueOnce(new Error('seed failed'))

    const { claimPassport } = usePassportClaim()
    const result = await claimPassport('prop1', '1 High St', 'AB1 2CD')

    expect(result).toEqual({ passportId: 'p1' })
  })

  it('getPassportStatus falls back to a safe "no passport" shape on error, rather than throwing', async () => {
    fetchMock.mockRejectedValueOnce(new Error('503'))
    const { getPassportStatus } = usePassportClaim()

    const status = await getPassportStatus('prop1')

    expect(status).toEqual({
      hasPassport: false,
      passportId: null,
      isOwner: false,
      isCollaborator: false,
    })
  })

  it('unlockPassport (buyer unlock) posts to the right passport-scoped endpoint', async () => {
    fetchMock.mockResolvedValueOnce({ passportId: 'p1' })
    const { unlockPassport } = usePassportClaim()
    await unlockPassport('p1')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/passport/p1/buyer-unlock',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('usePassportApi - viewing a Passport', () => {
  it('getSections and getAccess are both scoped to the requested passport id with an auth header', async () => {
    fetchMock.mockResolvedValueOnce([{ key: 'ownership' }])
    const { getSections } = usePassportApi()
    await getSections('p1')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/passport/p1/sections',
      expect.objectContaining({ headers: { Authorization: 'Bearer test-access-token' } }),
    )

    fetchMock.mockResolvedValueOnce({ isOwner: true, isCollaborator: false, permission: null })
    const { getAccess } = usePassportApi()
    const access = await getAccess('p1')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/passport/p1/access',
      expect.objectContaining({ headers: { Authorization: 'Bearer test-access-token' } }),
    )
    expect(access.isOwner).toBe(true)
  })
})

describe('useBuyerProfile - share journey', () => {
  it('createShare posts recipient/scope/expiry to the shares endpoint', async () => {
    const share = { id: 's1', profileId: 'b1', token: 'tok', recipientName: 'Agent', recipientEmail: null, scope: ['funds'], sentAt: '', expiresAt: '', revokedAt: null, lastViewedAt: null, viewCount: 0 }
    fetchMock.mockResolvedValueOnce(share)

    const { createShare } = useBuyerProfile()
    const result = await createShare({ recipientName: 'Agent', scope: ['funds'], expiresInDays: 7 })

    expect(result).toEqual(share)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/buyer-profile/shares',
      expect.objectContaining({
        method: 'POST',
        body: { recipientName: 'Agent', scope: ['funds'], expiresInDays: 7 },
      }),
    )
  })

  it('listShares returns an empty list rather than throwing when the backend errors', async () => {
    fetchMock.mockRejectedValueOnce(new Error('500'))
    const { listShares } = useBuyerProfile()

    expect(await listShares()).toEqual([])
  })

  it('revokeShare posts to the share-specific revoke endpoint', async () => {
    fetchMock.mockResolvedValueOnce({ id: 's1', revokedAt: '2026-11-16' })
    const { revokeShare } = useBuyerProfile()
    await revokeShare('s1')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/buyer-profile/shares/s1/revoke',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('getPublicShare reads a share by its token with no auth header (public route)', async () => {
    fetchMock.mockResolvedValueOnce({ token: 'tok' })
    const { getPublicShare } = useBuyerProfile()
    await getPublicShare('tok')

    expect(fetchMock).toHaveBeenCalledWith('https://api.test/buyer-profile/public/tok')
  })
})
