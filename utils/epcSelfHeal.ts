// EPC self-heal for the HomeScore flow.
//
// When a previous enrichment pass partially failed, a property comes back with
// `epcRecommendations` empty. Everything downstream that depends on
// recommendations — the Boost view, the pathway missions, the quiz quests —
// then renders as if the home simply has no improvements available. That's
// wrong, and it's sticky: nothing re-triggers the pull on its own, so the
// property stays broken on every subsequent visit.
//
// POST /property/:id/epc-refresh unconditionally re-pulls the certificate from
// the EPC Register. We only swap in the refreshed payload when it actually came
// back with recommendations, so a failed self-heal can never leave the page
// worse off than not calling it at all.

/**
 * Returns the property to use: the refreshed one when the self-heal produced
 * recommendations, otherwise the original untouched.
 *
 * Takes the property as an argument rather than owning a ref, because each
 * HomeScore page loads a different shape around it — the detail page pulls far
 * more than the property row — and they all keep their own state.
 */
export async function refreshEpcIfMissing(
  apiBase: string,
  propertyId: string,
  property: any,
): Promise<any> {
  const recs = property?.epcRecommendations
  if (Array.isArray(recs) && recs.length > 0) return property

  try {
    const res = await fetch(`${apiBase}/property/${propertyId}/epc-refresh`, {
      method: 'POST',
    })
    if (!res.ok) return property
    const refreshed = await res.json()
    const newRecs = refreshed?.epcRecommendations ?? []
    return Array.isArray(newRecs) && newRecs.length > 0 ? refreshed : property
  } catch {
    /* self-heal is best-effort — keep the un-refreshed property */
    return property
  }
}
