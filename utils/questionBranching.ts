// Branching inside a Passport section: some questions only apply to one
// type of ownership. The section's questions come from the backend in a
// fixed order and are numbered by position ("Question 9" = the 9th), so the
// rule below names the dependent questions by that number:
//
//   "What is the type of the ownership?"
//     Leasehold         -> questions 10 and 11
//     Shared Ownership  -> question 9
//     Commonhold        -> question 12
//     anything else     -> none of 9, 10, 11, 12
//
// Hidden questions are left out of the section entirely: navigation,
// "Question N of M", the progress bar, "remaining" and the completion check
// all run on the visible list (see usePassportRuntime).

type Option = { value?: unknown; label?: unknown }
type Question = { id: string; options?: Option[]; answer?: unknown }

const norm = (s: unknown) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')

const LEASEHOLD = 'leasehold'
const SHARED_OWNERSHIP = 'sharedownership'
const COMMONHOLD = 'commonhold'

// 1-based question numbers within the section, and the ownership type each
// one belongs to.
const DEPENDENT_QUESTIONS: { number: number; showFor: string }[] = [
  { number: 9, showFor: SHARED_OWNERSHIP },
  { number: 10, showFor: LEASEHOLD },
  { number: 11, showFor: LEASEHOLD },
  // "Provide a copy of the commonhold statement" - this had no entry here
  // at all, so it was never hidden for any other tenure (client bug
  // report, 2026-10-06: picking Freehold still landed on it).
  { number: 12, showFor: COMMONHOLD },
]

// The ownership-type question is recognised by its options rather than an
// id, which differs per passport: it offers Leasehold, Shared Ownership
// and Commonhold.
function isOwnershipTypeQuestion(q: Question) {
  if (!Array.isArray(q?.options)) return false
  const labels = new Set(q.options.map((o) => norm(o?.label ?? o?.value)))
  return labels.has(LEASEHOLD) && labels.has(SHARED_OWNERSHIP) && labels.has(COMMONHOLD)
}

// The picked option(s), as normalised labels and values. Answers arrive as a
// string (radio), an array (chips) or an object wrapping either.
function pickedOwnershipTypes(q: Question): Set<string> {
  let raw: unknown = q.answer
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>
    raw = o.mainAnswer ?? o.radioAnswer ?? o.value
  }
  const values = Array.isArray(raw) ? raw : raw == null ? [] : [raw]
  const picked = new Set<string>()
  for (const v of values) {
    picked.add(norm(v))
    const opt = q.options?.find((o) => norm(o?.value) === norm(v))
    if (opt) picked.add(norm(opt.label))
  }
  return picked
}

// Ids of the section's questions that don't apply to the chosen ownership
// type. Until the ownership question is answered, all three stay hidden.
export function hiddenQuestionIds(questions: Question[]): Set<string> {
  const hidden = new Set<string>()
  const ownershipIndex = questions.findIndex(isOwnershipTypeQuestion)
  if (ownershipIndex < 0) return hidden
  const picked = pickedOwnershipTypes(questions[ownershipIndex])
  for (const { number, showFor } of DEPENDENT_QUESTIONS) {
    const index = number - 1
    // Only questions after the ownership question can depend on it.
    if (index <= ownershipIndex || !questions[index]) continue
    if (!picked.has(showFor)) hidden.add(questions[index].id)
  }
  return hidden
}
