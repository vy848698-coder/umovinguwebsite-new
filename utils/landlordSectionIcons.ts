/**
 * Landlord passport section icons.
 *
 * The list view (pages/passportview/landlord/[id].vue) and the map view
 * (components/passport-view/LandlordPassportMapView.vue) each used to carry
 * their own copy of this mapping, and they had already drifted: the page
 * learned about `landlord_white_goods` when that section was added, the map
 * never did, so the same section showed the insurance emblem in the list and
 * the tenancy-agreement emblem on the map. One source of truth instead.
 */

// Section key (substring match) -> icon slug.
export function landlordSectionIconSlug(key: string): string {
  const k = (key || '').toLowerCase()
  if (k.includes('gas')) return 'gas-safety'
  if (k.includes('eicr') || k.includes('electric') || k.includes('pat')) return 'electrical-safety'
  if (k.includes('epc') || k.includes('energy')) return 'energy-performance'
  if (k.includes('alarm') || k.includes('smoke') || k.includes('co_')) return 'smoke-co-alarms'
  if (k.includes('legionella')) return 'legionella'
  // No dedicated 3D icon generated yet for White Goods - reuses the Landlord
  // Insurance asset as a placeholder (same group, same visual weight) rather
  // than showing a broken image. Must sit above the generic `insurance` test.
  if (k.includes('white_goods')) return 'landlord-insurance'
  if (k.includes('insurance')) return 'landlord-insurance'
  if (k.includes('deposit')) return 'deposit-protection'
  if (k.includes('right_to_rent') || k.includes('rtr')) return 'right-to-rent'
  if (k.includes('how_to_rent')) return 'how-to-rent'
  if (k.includes('inventory')) return 'inventory'
  if (k.includes('ast') || k.includes('tenancy')) return 'tenancy-agreement'
  return 'tenancy-agreement'
}

// 3D isometric emblems, matching the buyer/seller passport section icons.
// Any slug without an entry here falls back to the flat SVG set.
const SECTION_ICON_URLS: Record<string, string> = {
  'gas-safety': '/op-icons/landlordPassport/gasSafetyCertificate.png',
  'electrical-safety': '/op-icons/landlordPassport/electricalSafety.png',
  'energy-performance': '/op-icons/landlordPassport/epc.png',
  'smoke-co-alarms': '/op-icons/landlordPassport/smokeCOAlarms.png',
  legionella: '/op-icons/landlordPassport/legionellaRiskAssessment.png',
  'landlord-insurance': '/op-icons/landlordPassport/landlordInsurance.png',
  'deposit-protection': '/op-icons/landlordPassport/depositProtection.png',
  'right-to-rent': '/op-icons/landlordPassport/rightToRent.png',
  'how-to-rent': '/op-icons/misc/book.png',
  inventory: '/op-icons/landlordPassport/inventory.png',
  'tenancy-agreement': '/op-icons/landlordPassport/tenancyAgreement.png',
}

export function landlordSectionIconUrl(
  key: string,
  variant: 'freestanding' | 'map' = 'freestanding',
): string {
  const slug = landlordSectionIconSlug(key)
  return SECTION_ICON_URLS[slug] ?? `/op-icons/rental-passport/${variant}/${slug}.svg`
}
