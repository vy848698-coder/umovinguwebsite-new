// Display formatting for addresses printed onto artwork — currently the
// Property Passport cover (components/passport-view/PassportCard.vue).
//
// Backend records arrive exactly as they were captured, which is rarely how an
// address is written: the house number carries a trailing comma ("104,
// Dulverton Avenue"), text can be shouted ("DULVERTON AVENUE"), and postcodes
// can come back unspaced ("CV58HE"). On a cover that matters more than it
// looks: the comma adds width AND an early wrap point, so "104, Dulverton
// Avenue" breaks onto two lines where "104 Dulverton Avenue" holds one. Two
// lines plus the postcode is three rows in a fixed-height band, which forces
// the auto-fitter to shrink the whole block and pushes it up into the umu mark.
//
// These are the same rules server/utils/address.ts applies to the Founding
// Homeowner certificate. They are duplicated rather than shared because that
// module is server-only (Nitro auto-import) while this one runs in the browser;
// if you change the behaviour here, change it there too.

// Joining words in UK place names: Stoke-on-Trent, Weston-super-Mare.
// Lowercase unless they start the name.
const PLACE_JOINERS = new Set([
  'on', 'upon', 'under', 'in', 'by', 'the', 'super', 'le', 'en', 'cum', 'next',
  'with', 'de', 'sur', 'and',
])

const squash = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim()

// Title-cases text only when it is all capitals or all lowercase; anything
// already mixed case carries someone's intended spelling and is left alone.
function titleCase(raw: unknown): string {
  const text = squash(raw)
  const letters = text.replace(/[^\p{L}]/gu, '')
  if (!letters) return text
  if (letters !== letters.toUpperCase() && letters !== letters.toLowerCase()) {
    return text
  }

  let index = 0
  return text.toLowerCase().replace(/[\p{L}\d]+(?:['’]\p{L}+)*/gu, (word) => {
    const first = index++ === 0
    if (!first && PLACE_JOINERS.has(word)) return word
    // House numbers with a letter suffix: "2a" -> "2A".
    if (/^\d+\p{L}$/u.test(word)) return word.toUpperCase()
    return word.replace(/^\p{L}/u, (ch) => ch.toUpperCase())
  })
}

/**
 * The street line as it would be written on an envelope:
 * "104, DULVERTON AVENUE" -> "104 Dulverton Avenue".
 * Also handles a flat or building name in front of the number
 * ("Flat 3, 10, Mellowship Road" -> "Flat 3, 10 Mellowship Road").
 */
export function formatAddressLine(raw: unknown): string {
  return titleCase(raw).replace(
    /(^|,\s*)(\d+\p{L}?(?:-\d+\p{L}?)?),\s*/gu,
    '$1$2 ',
  )
}

/** "cv58he" -> "CV5 8HE". The inward code is always the last three characters. */
export function formatPostcodeDisplay(raw: unknown): string {
  const compact = String(raw ?? '').replace(/\s+/g, '').toUpperCase()
  return compact.length > 3
    ? `${compact.slice(0, -3)} ${compact.slice(-3)}`
    : compact
}
