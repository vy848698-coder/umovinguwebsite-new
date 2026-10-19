// The Seller Passport sections the UMU AI assistant can take a seller
// through, in passport order. The passport page, each section page and the
// assistant all read this list, so a section added here shows up as a
// "Talk to UMU" choice everywhere at once.
//
// Keys are the backend section keys (QuestionTemplate seed). Sections can be
// answered in any order: the seller picks one on the passport card, on the
// section page or from the section rail inside the assistant. The rail
// (components/agent/UmuSectionRail) shows a few at a time, so all 18 of the
// passport's sections fit without crowding the page.

export const UMU_SECTION_KEYS = [
  'ownershipProfile',
  'boundaries',
  'disputesAndComplaints',
  'noticesAndProposals',
  'alterationsAndPlanning',
  'guaranteesAndWarranties',
  'insurance',
  'environmental',
  'rightsAndInformalArrangements',
  'parking',
  'otherCharges',
  'occupiers',
  'services',
  'transactionInformation',
  'fixturesAndFittings',
  'leasehold',
  'titleDeedsAndPlan',
  'searches',
] as const

export type UmuSectionKey = (typeof UMU_SECTION_KEYS)[number]

// Older passports can carry a section without its key, so the title is
// checked too.
const TITLE_MATCH: Record<UmuSectionKey, RegExp> = {
  ownershipProfile: /ownership/i,
  boundaries: /^boundar/i,
  disputesAndComplaints: /dispute/i,
  noticesAndProposals: /notices/i,
  alterationsAndPlanning: /alteration/i,
  guaranteesAndWarranties: /guarantee|warrant/i,
  insurance: /^insurance/i,
  environmental: /^environment/i,
  rightsAndInformalArrangements: /^rights|informal arrangement/i,
  parking: /^parking/i,
  otherCharges: /^other charges/i,
  occupiers: /^occupier/i,
  services: /^services/i,
  transactionInformation: /^transaction/i,
  fixturesAndFittings: /^fixtures/i,
  leasehold: /^leasehold/i,
  // Renamed "Title Register and Plan" on the live backend
  titleDeedsAndPlan: /^title (deeds|register)/i,
  searches: /^searches/i,
}

export function umuSectionKeyOf(section: { key?: string; title?: string } | null | undefined): UmuSectionKey | null {
  if (!section) return null
  const byKey = UMU_SECTION_KEYS.find((k) => k === section.key)
  if (byKey) return byKey
  return UMU_SECTION_KEYS.find((k) => TITLE_MATCH[k].test(section.title || '')) || null
}

export const isUmuSection = (section: { key?: string; title?: string } | null | undefined) =>
  !!umuSectionKeyOf(section)

// The assistant, opened on one section (or on the seller's next one when no
// section is given).
export function umuAssistantPath(passportId: string, sectionKey?: string | null) {
  const base = `/passportview/assistant/${passportId}`
  return sectionKey ? `${base}?section=${encodeURIComponent(sectionKey)}` : base
}

// The section the seller last had open in the assistant, per passport, so
// the passport card and "Talk to UMU" pick up where they left off. Only a
// convenience for this browser: storage can be missing or blocked.
const lastKey = (passportId: string) => `umu:lastSection:${passportId}`

export function rememberUmuSection(passportId: string, sectionKey: string) {
  try {
    localStorage.setItem(lastKey(passportId), sectionKey)
  } catch {
    // nothing to remember it in
  }
}

export function lastUmuSection(passportId: string): string | null {
  try {
    return localStorage.getItem(lastKey(passportId))
  } catch {
    return null
  }
}
