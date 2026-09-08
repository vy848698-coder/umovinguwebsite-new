// Composable for property passport claim & status check
export const usePassportClaim = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  const token = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers = () => ({
    Authorization: `Bearer ${token()}`,
    'Content-Type': 'application/json',
  })

  interface PassportStatus {
    hasPassport: boolean
    passportId: string | null
    passportStatus?: string
    isOwner: boolean
    isCollaborator: boolean
    isBuyer?: boolean
    canAccess?: boolean
    isPublished?: boolean
  }

  const getPassportStatus = async (
    propertyId: string,
  ): Promise<PassportStatus> => {
    try {
      return await $fetch<PassportStatus>(
        `${base}/property/${propertyId}/passport-status`,
        { headers: headers() },
      )
    } catch {
      return {
        hasPassport: false,
        passportId: null,
        isOwner: false,
        isCollaborator: false,
      }
    }
  }

  // Seeds the passport's sections. `/passport/create` records the passport but
  // does NOT populate its section list - that is this endpoint's job, and
  // without it a passport opens with an all-but-empty section list (one stray
  // section), which renders as an empty map and a one-card list on every
  // passport type. Idempotent: the backend no-ops once a passport is active.
  const activatePassport = async (passportId: string): Promise<{ passportId: string }> => {
    return $fetch<{ passportId: string }>(`${base}/passport/${passportId}/activate`, {
      method: 'POST',
      headers: headers(),
    })
  }

  // Sets the seller/landlord choice on a passport after creation. We pass
  // `type` to /passport/create already, so the claim flow below doesn't need
  // this - it exists for callers that create first and choose later.
  const setPassportType = async (
    passportId: string,
    type: 'seller' | 'landlord',
    isHmo = false,
  ): Promise<{ passportId: string; status: string }> => {
    return $fetch<{ passportId: string; status: string }>(
      `${base}/passport/${passportId}/set-type`,
      {
        method: 'POST',
        headers: headers(),
        body: { type, ...(isHmo ? { isHmo: true } : {}) },
      },
    )
  }

  const claimPassport = async (
    propertyId: string,
    addressLine1: string,
    postcode: string,
    opts: { type?: 'seller' | 'landlord'; isHmo?: boolean } = {},
  ): Promise<{ passportId: string }> => {
    const res = await $fetch<{ passportId: string }>(`${base}/passport/create`, {
      method: 'POST',
      headers: headers(),
      body: {
        propertyId,
        addressLine1,
        postcode,
        type: opts.type ?? 'seller',
        ...(opts.isHmo ? { isHmo: true } : {}),
      },
    })

    // Create + activate is one step for us: unlike the payment-gated flow this
    // was lifted from, nothing happens between choosing a type and opening the
    // passport, so there is no point at which an un-seeded passport is useful.
    // Non-fatal on failure - the passport does exist at this point, and
    // failing the whole claim would be worse than opening it unseeded - but
    // never silent, because an unseeded passport is exactly the bug that made
    // every passport look broken.
    if (res?.passportId) {
      try {
        await activatePassport(res.passportId)
      } catch (err) {
        console.error(
          '[passport] activate failed - sections may be missing for',
          res.passportId,
          err,
        )
      }
    }

    return res
  }

  const unlockPassport = async (passportId: string): Promise<{ passportId: string }> => {
    return $fetch<{ passportId: string }>(`${base}/passport/${passportId}/buyer-unlock`, {
      method: 'POST',
      headers: headers(),
    })
  }

  const convertLandlordToSeller = async (
    landlordPassportId: string,
  ): Promise<{ passportId: string; transferredSectionKeys: string[] }> => {
    return $fetch(`${base}/passport/${landlordPassportId}/convert-to-seller`, {
      method: 'POST',
      headers: headers(),
      body: { acknowledged: true },
    })
  }

  return {
    getPassportStatus,
    claimPassport,
    setPassportType,
    activatePassport,
    unlockPassport,
    convertLandlordToSeller,
  }
}


