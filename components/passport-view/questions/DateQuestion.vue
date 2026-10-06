<template>
  <div>
    <!-- Question Display (skip if hideQuestionDisplay is true) -->
    <template v-if="!hideQuestionDisplay">
      <p v-if="displayedQuestion" class="question-text">
        {{ displayedQuestion }}
        <span v-if="showQuestionCursor" class="typing-cursor">|</span>
      </p>

      <!-- Description Display -->
      <div v-if="displayedDescription" class="question-description">
        {{ displayedDescription }}
        <span
          v-if="showDescriptionCursor"
          class="typing-cursor typing-cursor--small"
          >|</span
        >
      </div>

      <!-- Help Display -->
      <div v-if="displayedHelp" class="help-section">
        <div class="help-content">
          <h4 class="help-title">
            <img src="/op-icons/homescore/lightbulb.png" alt="" class="help-icon-img" />What is this?
          </h4>
          <p class="help-text">
            {{ displayedHelp }}
            <span
              v-if="showHelpCursor"
              class="typing-cursor typing-cursor--small"
              >|</span
            >
          </p>
        </div>
      </div>
    </template>

    <div class="date-options">
      <!-- ① Inline percentage / year layout (only when question has a percentage + year option) -->
      <div v-if="isPercentageYearInline" class="date-option multi-input-row">
        <div class="multi-inputs">
          <template
            v-for="(option, index) in question.options"
            :key="option.value"
          >
            <!-- Label before badge for all options except the last -->
            <span
              v-if="index < question.options.length - 1"
              class="mi-label"
            >{{ option.label }}</span>

            <!-- Badge / input -->
            <div
              v-if="option.hasDate && isTypedFormat(option)"
              class="date-badge date-badge--text"
            >
              <span v-if="getDateValue(option) && affix(option).pre" class="date-affix">{{
                affix(option).pre
              }}</span>
              <input
                :ref="(el) => setDateInputRef(el, index)"
                type="text"
                class="date-text-input"
                :inputmode="getInputMode(option)"
                :value="getInputValue(option)"
                :placeholder="option.datePlaceholder || ''"
                :size="textInputSize(option)"
                :aria-label="option.label"
                @input="(e) => updateDate(e, option)"
                @click.stop
                @keydown.stop
              />
              <span v-if="getDateValue(option) && affix(option).post" class="date-affix">{{
                affix(option).post
              }}</span>
            </div>
            <div v-else-if="option.hasDate" class="date-badge">
              <span v-if="getDateValue(option)" class="date-text">
                {{ formatValue(getDateValue(option), option) }}
              </span>
              <span v-else class="date-placeholder">
                {{ option.datePlaceholder || 'Select a date' }}
              </span>
              <input
                :ref="(el) => setDateInputRef(el, index)"
                :type="getInputType(option)"
                :inputmode="getInputMode(option)"
                :value="getInputValue(option)"
                @input="(e) => updateDate(e, option)"
                @click.stop="openPicker"
                class="date-input-overlay"
              />
            </div>

            <!-- Separator between options -->
            <span
              v-if="index < question.options.length - 1"
              class="mi-sep"
            >/</span>

            <!-- Label after badge for the last option -->
            <span
              v-if="index === question.options.length - 1"
              class="mi-label"
            >{{ option.label }}</span>
          </template>
        </div>

        <!-- Your Selection summary -->
        <div v-if="selectionSummary" class="selection-row">
          <span class="selection-label">Your Selection</span>
          <span class="selection-value">{{ selectionSummary }}</span>
        </div>
      </div>

      <!-- ② Original multi-input / single-select mode (all other questions unchanged) -->
      <div
        v-else
        v-for="(option, index) in question.options"
        :key="option.value"
        class="date-option"
        :class="{
          selected: !isMultiInputMode && getSelectedValue() === option.value,
          'single-option': question.options.length === 1,
          'multi-input-option': isMultiInputMode,
        }"
        @click="handleOptionClick(option.value)"
       role="button" tabindex="0" @keydown.enter="handleOptionClick(option.value)" @keydown.space.prevent="handleOptionClick(option.value)">
        <div
          v-if="question.options.length > 1 && !isMultiInputMode"
          class="radio-btn"
          :class="{ checked: getSelectedValue() === option.value }"
        >
          <span v-if="getSelectedValue() === option.value" class="check-icon"
            >✓</span
          >
        </div>

        <span class="option-label">{{ option.label }}</span>

        <!-- Typed answers (amounts, percentages, years, units, free text): a
             real, visible input in the badge, so the user sees the caret and
             what they type. keydown.stop keeps the row's space/enter handlers
             from eating the keystrokes. -->
        <div
          v-if="option.hasDate && isTypedFormat(option)"
          class="date-badge date-badge--text"
        >
          <span v-if="getDateValue(option) && affix(option).pre" class="date-affix">{{
            affix(option).pre
          }}</span>
          <input
            :ref="(el) => setDateInputRef(el, index)"
            type="text"
            class="date-text-input"
            :inputmode="getInputMode(option)"
            :value="getInputValue(option)"
            :placeholder="option.datePlaceholder || ''"
            :size="textInputSize(option)"
            :aria-label="option.label"
            @input="(e) => updateDate(e, option)"
            @click.stop
            @keydown.stop
          />
          <span v-if="getDateValue(option) && affix(option).post" class="date-affix">{{
            affix(option).post
          }}</span>
        </div>
        <div v-else-if="option.hasDate" class="date-badge">
          <span v-if="getDateValue(option)" class="date-text">
            {{ formatValue(getDateValue(option), option) }}
          </span>
          <span v-else class="date-placeholder">
            {{ option.datePlaceholder || 'Select date' }}
          </span>
          <input
            :ref="(el) => setDateInputRef(el, index)"
            :type="getInputType(option)"
            :inputmode="getInputMode(option)"
            :value="getInputValue(option)"
            @input="(e) => updateDate(e, option)"
            @click.stop="openPicker"
            class="date-input-overlay"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  answer: {
    type: [String, Object],
    default: '',
  },
  displayedQuestion: {
    type: String,
    default: '',
  },
  showQuestionCursor: {
    type: Boolean,
    default: false,
  },
  displayedDescription: {
    type: String,
    default: '',
  },
  showDescriptionCursor: {
    type: Boolean,
    default: false,
  },
  displayedHelp: {
    type: String,
    default: '',
  },
  showHelpCursor: {
    type: Boolean,
    default: false,
  },
  hideQuestionDisplay: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update'])

const dateInputRefs = ref({})

const setDateInputRef = (el, index) => {
  if (el) {
    dateInputRefs.value[index] = el
  }
}

const isMultiInputMode = computed(() => {
  if (!props.question?.options || props.question.options.length < 2)
    return false
  return (
    props.question.options.every((opt) => opt.hasDate) &&
    props.question.options.some((opt) => isTypedFormat(opt))
  )
})

// Only true for the specific percentage + year inline layout question
const isPercentageYearInline = computed(() => {
  if (!isMultiInputMode.value) return false
  const opts = props.question?.options || []
  return (
    opts.some((o) => o.inputType === 'percentage') &&
    opts.some((o) => o.value === 'years' || o.inputType === 'number')
  )
})

// "Your Selection" summary shown below the inline multi-input row
const selectionSummary = computed(() => {
  if (!isMultiInputMode.value) return ''
  if (typeof props.answer !== 'object' || props.answer === null) return ''

  const opts = props.question?.options || []
  const pctOpt = opts.find((o) => o.inputType === 'percentage')
  const yrOpt = opts.find((o) => o.value === 'years' || o.inputType === 'number')

  if (pctOpt && yrOpt) {
    const pct = props.answer[pctOpt.value]
    const yr = props.answer[yrOpt.value]
    if (!pct && !yr) return ''
    const parts = []
    if (pct) parts.push(`${pct}%`)
    if (yr) parts.push(`every ${yr} ${yr === '1' ? 'year' : 'years'}`)
    return parts.join(' ')
  }

  // Generic fallback: join all non-empty formatted values
  const values = opts
    .map((o) => {
      const v = props.answer[o.value]
      return v ? formatValue(v, o) : null
    })
    .filter(Boolean)
  return values.join(' / ')
})

onMounted(() => {
  if (
    !isMultiInputMode.value &&
    props.question.options.length === 1 &&
    !getSelectedValue()
  ) {
    selectOption(props.question.options[0].value)
  }
})

const getSelectedValue = () => {
  if (typeof props.answer === 'object' && props.answer !== null) {
    return props.answer.value
  }
  return props.answer
}

const getDateValue = (option) => {
  if (isMultiInputMode.value) {
    if (typeof props.answer === 'object' && props.answer !== null) {
      return props.answer[option.value] || ''
    }
    return ''
  }
  if (typeof props.answer === 'object' && props.answer !== null) {
    return props.answer.date || ''
  }
  return ''
}

const selectOption = (value) => {
  const selectedOption = props.question.options.find(
    (opt) => opt.value === value,
  )

  if (selectedOption?.hasDate) {
    emit('update', { value, date: getDateValue() })
  } else {
    emit('update', value)
  }
}

const handleOptionClick = (value) => {
  if (isMultiInputMode.value) return
  selectOption(value)
}

// An option that sets neither inputType nor dateFormat but whose placeholder
// is an example answer ("e.g. Early Tuesdays") asks for free text. Real date
// options set a dateFormat or say "Select date"; defaulting these to a month
// picker left the user nothing they could type into.
const isTextExample = (option) =>
  !option?.inputType &&
  !option?.dateFormat &&
  /^\s*e\.?\s?g\.?\s/i.test(option?.datePlaceholder || '')

// Many options arrive with neither inputType nor dateFormat, and used to
// fall back to a month picker - "£ 1500", "00%", "Years" or "Units" badges
// that could not be typed into. Their placeholder says what they want.
const inferFormat = (option) => {
  const ph = String(option?.datePlaceholder || '').trim()
  if (isTextExample(option)) return 'text'
  if (ph.includes('%')) return 'percentage'
  if (ph.startsWith('£')) return 'currency'
  if (/^years?$/i.test(ph)) return 'years'
  if (/^units?$/i.test(ph)) return 'units'
  if (/^\d+$/.test(ph)) return 'number'
  if (/\bdate\b/i.test(ph)) return 'fullDate'
  if (/\byear\b/i.test(ph)) return 'year'
  return 'monthYear'
}

const getOptionFormat = (option) => {
  return option.inputType || option.dateFormat || inferFormat(option)
}

const TYPED_FORMATS = ['text', 'percentage', 'currency', 'number', 'years', 'units']
const isTypedFormat = (option) => TYPED_FORMATS.includes(getOptionFormat(option))

// What the typed badge shows around the number once there is one.
const affix = (option) => {
  const format = getOptionFormat(option)
  if (format === 'currency') return { pre: '£', post: '' }
  if (format === 'percentage') return { pre: '', post: '%' }
  if (format === 'years') return { pre: '', post: 'years' }
  if (format === 'units') return { pre: '', post: 'units' }
  return { pre: '', post: '' }
}

// Date/month pickers sit invisibly over their badge; open the picker on
// click rather than relying on the browser to do so.
const openPicker = (event) => {
  try {
    event.target.showPicker?.()
  } catch {
    /* focus alone still works */
  }
}

// Width, in characters, of a typed badge: fits the placeholder, and grows
// with the answer up to a cap.
const textInputSize = (option) => {
  const value = String(getDateValue(option) || '')
  // Empty: as wide as the placeholder. Filled: hug the answer, so the £ / %
  // sits right against it.
  const len = value ? value.length + 1 : (option.datePlaceholder || '').length
  return Math.min(Math.max(len, 2), 34)
}

const isNumericInput = (option) => {
  const format = getOptionFormat(option)
  return [
    'percentage',
    'currency',
    'number',
    'years',
    'units',
    'text',
  ].includes(format)
}

const getInputType = (option) => {
  const format = getOptionFormat(option)

  if (isNumericInput(option)) return 'text'
  if (format === 'year') return 'date'
  if (format === 'monthYear' || format === 'month') return 'month'
  if (format === 'fullDate') return 'date'

  return 'month'
}

const getInputValue = (option) => {
  const dateValue = getDateValue(option)
  if (!dateValue) return ''

  const format = getOptionFormat(option)
  if (isNumericInput(option)) return dateValue

  if (format === 'year') {
    return `${dateValue}-01-01`
  }

  return dateValue
}

const updateDate = (event, option) => {
  let newValue = event.target.value
  const format = getOptionFormat(option)

  // Numbers: keep digits, plus a decimal point for money and percentages.
  if (isTypedFormat(option) && format !== 'text') {
    const notAllowed =
      format === 'currency' || format === 'percentage' ? /[^\d.]/g : /\D/g
    const clean = newValue.replace(notAllowed, '')
    if (clean !== newValue) event.target.value = clean
    newValue = clean
  }

  if (format === 'year') {
    const year = newValue.split('-')[0]
    newValue = year
  }

  if (isMultiInputMode.value) {
    const current =
      typeof props.answer === 'object' && props.answer !== null
        ? { ...props.answer }
        : {}
    current[option.value] = newValue
    emit('update', current)
    return
  }

  if (isNumericInput(option)) {
    emit('update', {
      value: option.value,
      date: newValue,
    })
    return
  }

  emit('update', {
    value: option.value,
    date: newValue,
  })
}

const getInputMode = (option) => {
  const format = getOptionFormat(option)
  if (format === 'percentage' || format === 'currency') return 'decimal'
  if (format === 'number' || format === 'years' || format === 'units')
    return 'numeric'
  if (format === 'text') return 'text'
  return undefined
}

const formatValue = (rawValue, option) => {
  if (!rawValue) return ''

  const format = getOptionFormat(option)

  if (format === 'percentage') {
    return `${rawValue}%`
  }

  if (format === 'currency') {
    return `£ ${rawValue}`
  }

  if (format === 'years') {
    return `${rawValue} years`
  }

  if (format === 'units') {
    return `${rawValue} units`
  }

  if (format === 'number') {
    return `${rawValue}`
  }

  if (format === 'text') {
    return rawValue
  }

  if (format === 'year') {
    return rawValue
  }

  if (format === 'month' || format === 'monthYear') {
    const [year, month] = rawValue.split('-')
    const date = new Date(year, month - 1)
    if (format === 'month') {
      return date.toLocaleDateString('en-US', { month: 'long' })
    }
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  if (format === 'fullDate') {
    const date = new Date(rawValue)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return rawValue
}
</script>

<style scoped>
.question-text {
  color: #231d45;
  margin: 0 0 10px 0;
  font-weight: 800;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.question-description {
  font-weight: 500;
  font-size: 15px;
  line-height: 1.55;
  color: #8b8799;
  margin-bottom: 20px;
}

.help-section {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(0, 161, 154, 0.07);
  border-radius: 16px;
  border-left: 4px solid #00a19a;
  margin-bottom: 22px;
}

.help-icon {
  font-size: 13px;
  flex-shrink: 0;
}

.help-content {
  flex: 1;
  min-width: 0;
}

.help-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
  color: #00857f;
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.help-text {
  color: #5a5570;
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.6;
}

.typing-cursor {
  margin-left: 2px;
  color: #00a19a;
  animation: blink 1s infinite;
}

.typing-cursor--small {
  margin-left: 2px;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.date-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.date-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fbfbfa;
  border: 1.5px solid #ececf2;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s,
    transform 0.12s;
  position: relative;
}

.date-option:hover {
  border-color: #bfe9e5;
  background: #fbfefe;
}

.date-option:active {
  transform: scale(0.99);
}

.date-option.selected {
  border-color: #00a19a;
  background: rgba(0, 161, 154, 0.06);
  box-shadow: 0 6px 18px -8px rgba(0, 161, 154, 0.4);
}

.date-option.single-option {
  padding: 8px 12px;
}

.radio-btn {
  width: 24px;
  height: 24px;
  border: 2px solid #d3d0dd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.16s, border-color 0.16s;
  background: #fff;
}

.radio-btn.checked {
  background: #00a19a;
  border-color: #00a19a;
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
}

.option-label {
  font-size: 14.5px;
  font-weight: 600;
  color: #231d45;
  flex: 1;
}

.date-badge {
  padding: 9px 16px;
  background: rgba(0, 161, 154, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.16s;
  position: relative;
  overflow: hidden;
}

.date-badge:hover {
  background: rgba(0, 161, 154, 0.16);
}

.date-text {
  font-size: 14.5px;
  font-weight: 700;
  color: #00857f;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.date-placeholder {
  font-size: 14px;
  color: #a5a1b4;
  position: relative;
  z-index: 1;
  pointer-events: none;
}

/* Free-text badge: same pill, holding a real input styled like the badge
   text, so at rest it looks identical to the other badges. */
.date-badge--text {
  cursor: text;
  max-width: 60%;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.date-affix {
  font-size: 14.5px;
  font-weight: 700;
  color: #00857f;
  white-space: nowrap;
}
.date-badge--text:focus-within {
  background: rgba(0, 161, 154, 0.16);
  box-shadow: 0 0 0 2px rgba(0, 161, 154, 0.35);
}
.date-text-input {
  display: block;
  max-width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 700;
  color: #00857f;
  text-align: right;
  /* Width follows the text (placeholder or answer), so the £ / % sits right
     against the number; the size attribute is the fallback elsewhere. */
  field-sizing: content;
  min-width: 1ch;
}
.date-text-input::placeholder {
  font-size: 14px;
  font-weight: 400;
  color: #a5a1b4;
}

.date-input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.date-input-overlay::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  cursor: pointer;
  opacity: 0;
}

/* ── Inline multi-input row (percentage / year) ───────────────── */
.multi-input-row {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  padding: 12px 16px;
  cursor: default;
}
.multi-input-row:active { transform: none; }

.multi-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mi-label {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
}

.mi-sep {
  font-size: 18px;
  font-weight: 400;
  color: #3c3c4399;
}

/* Selection summary row */
.selection-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}
.selection-label {
  font-size: 14px;
  color: #3c3c4399;
}
.selection-value {
  font-size: 14px;
  font-weight: 600;
  color: #00a19a;
}

/* "What is this?" lightbulb - the same illustrated icon the app uses. */
.help-icon-img {
  width: 15px;
  height: 15px;
  object-fit: contain;
  flex-shrink: 0;
  vertical-align: -2px;
  margin-right: 5px;
}
</style>


