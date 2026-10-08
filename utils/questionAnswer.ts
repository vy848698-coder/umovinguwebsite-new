// Shared answer rules for passport questions, used by the manual question
// page (pages/passportview/steps/tasks/[id].vue) and the UMU AI assistant
// (pages/passportview/assistant/[id].vue) so both accept exactly the same
// answers before saving.

type AnyQuestion = Record<string, any> | null | undefined

export const normalizeQuestionType = (question: AnyQuestion): string =>
  (question?.type || '').toString().trim().toLowerCase().replace(/-/g, '_')

const filled = (v: unknown) =>
  v !== undefined && v !== null && ('' + v).trim().length > 0

// Whether the question's current answer is complete enough to save.
export function isQuestionAnswerValid(question: AnyQuestion): boolean {
  if (!question) return false

  const answer = question.answer
  const type = normalizeQuestionType(question)
  const isRadioType = type === 'radio' || type === 'single_choice'
  const isCheckboxType = type === 'checkbox' || type === 'multiple_choice'

  if (type === 'text') {
    return !!answer && answer.trim().length > 0
  }

  if (isRadioType) {
    return answer !== '' && answer !== undefined && answer !== null
  }

  if (type === 'boundary') {
    return !!(answer && answer.left && answer.right && answer.rear && answer.front)
  }

  if (isCheckboxType) {
    // When otherPlaceholder is set, CheckboxQuestion emits {values, otherText}
    if (
      answer &&
      typeof answer === 'object' &&
      !Array.isArray(answer) &&
      Array.isArray(answer.values)
    ) {
      return answer.values.length > 0
    }
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'chips' || type === 'upload' || type === 'multitextinput') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (type === 'note') {
    const note = answer || {}
    const buyers = note.buyers || ''
    const sellers = note.sellers || ''
    return (
      (buyers && buyers.trim().length > 0) ||
      (sellers && sellers.trim().length > 0)
    )
  }

  if (type === 'date') {
    if (!answer) return false
    if (typeof answer === 'string') return answer.trim().length > 0
    if (typeof answer === 'object') {
      if (answer.date) return ('' + answer.date).trim().length > 0
      if (answer.value) return ('' + (answer.value || '')).trim().length > 0
      return Object.values(answer).some(filled)
    }
    return false
  }

  if (type === 'scale') {
    return answer !== undefined && answer !== null && answer !== ''
  }

  if (type === 'multifieldform') {
    // For repeatable: answer is array of objects
    if (question.repeatable && Array.isArray(answer)) {
      return (
        answer.length > 0 &&
        answer.every(
          (form) =>
            !!form &&
            Object.values(form).some((val) => val && String(val).trim().length > 0),
        )
      )
    }
    // For non-repeatable: answer is single object
    // An unanswered form can arrive as null (typeof null === 'object').
    if (
      !question.repeatable &&
      answer &&
      typeof answer === 'object' &&
      !Array.isArray(answer)
    ) {
      return Object.values(answer).some(
        (val) => val && String(val).trim().length > 0,
      )
    }
    return false
  }

  if (type === 'multipart') {
    // Repeatable multipart (custom item list): answer is an array, always valid (0 items is OK)
    if (question.repeatable) {
      return Array.isArray(answer) || answer === null || answer === undefined
    }
    if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return false
    const parts = question.parts
    if (!parts || !Array.isArray(parts)) return false

    // A part is visible unless conditional logic hides it
    const isPartVisible = (part: any) => {
      if (!part.conditionalOn) return true
      const dependentPartAnswer = answer[part.conditionalOn]
      if (dependentPartAnswer === undefined || dependentPartAnswer === null) return false
      if (!part.showOnValues || !Array.isArray(part.showOnValues)) return false
      return part.showOnValues.includes(dependentPartAnswer)
    }

    return parts.every((part: any) => {
      // Skip validation for hidden parts
      if (!isPartVisible(part)) return true

      const partAnswer = answer[part.partKey]

      // If part is not required and has no answer, that's OK
      if (
        !part.required &&
        (partAnswer === undefined || partAnswer === null || partAnswer === '')
      ) {
        return true
      }

      // If part is required or has an answer, validate it
      if (partAnswer === undefined || partAnswer === null || partAnswer === '') return false

      const partType = part.type?.toLowerCase?.()

      // Counter is always valid (0 is a valid numeric answer)
      if (partType === 'counter') return true

      if (partType === 'checkbox') return Array.isArray(partAnswer) && partAnswer.length > 0
      if (partType === 'upload') {
        // display:'both' parts emit { text, files } rather than an array -
        // checking Array.isArray alone kept Save disabled with a real answer.
        if (partAnswer && typeof partAnswer === 'object' && !Array.isArray(partAnswer)) {
          const hasText =
            typeof partAnswer.text === 'string' && partAnswer.text.trim().length > 0
          const hasFiles = Array.isArray(partAnswer.files) && partAnswer.files.length > 0
          return hasText || hasFiles
        }
        return Array.isArray(partAnswer) && partAnswer.length > 0
      }
      if (partType === 'multitextinput') {
        return Array.isArray(partAnswer) && partAnswer.length > 0
      }
      if (partType === 'multifieldform') {
        // For repeatable: partAnswer is array of objects
        if (part.repeatable && Array.isArray(partAnswer)) {
          return (
            partAnswer.length > 0 &&
            partAnswer.every((form: any) =>
              Object.values(form).some((val) => val && ('' + val).trim().length > 0),
            )
          )
        }
        // For non-repeatable: partAnswer is single object
        if (!part.repeatable && typeof partAnswer === 'object' && !Array.isArray(partAnswer)) {
          return Object.values(partAnswer).some(
            (val) => val && ('' + val).trim().length > 0,
          )
        }
        return false
      }
      if (partType === 'date') {
        if (typeof partAnswer === 'object' && partAnswer !== null) {
          return (
            (partAnswer.date && ('' + partAnswer.date).trim().length > 0) ||
            ('' + (partAnswer.value || '')).trim().length > 0 ||
            Object.values(partAnswer).some(filled)
          )
        }
        return ('' + partAnswer).trim().length > 0
      }
      if (partType === 'text') {
        return typeof partAnswer === 'string' ? partAnswer.trim().length > 0 : !!partAnswer
      }
      if (partType === 'radio') {
        return partAnswer !== '' && partAnswer !== undefined && partAnswer !== null
      }

      return !!partAnswer
    })
  }

  return true
}
