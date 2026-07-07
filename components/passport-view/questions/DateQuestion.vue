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
            <span class="help-icon">💡</span>What is this?
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
            <div v-if="option.hasDate" class="date-badge">
              <span v-if="getDateValue(option)" class="date-text">
                {{ formatValue(getDateValue(option), option) }}
              </span>
              <span v-else class="date-placeholder">
                {{ option.datePlaceholder || '—' }}
              </span>
              <input
                :ref="(el) => setDateInputRef(el, index)"
                :type="getInputType(option)"
                :inputmode="getInputMode(option)"
                :value="getInputValue(option)"
                @input="(e) => updateDate(e, option)"
                @click.stop
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
      >
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

        <div v-if="option.hasDate" class="date-badge">
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
            @click.stop
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
    props.question.options.some((opt) => opt.inputType)
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

const getOptionFormat = (option) => {
  return option.inputType || option.dateFormat || 'monthYear'
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
  gap: 11px;
  padding: 13px 15px;
  background: rgba(0, 161, 154, 0.06);
  border-radius: 14px;
  border: 1px solid rgba(0, 161, 154, 0.18);
  margin-bottom: 18px;
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
  font-size: 12.5px;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.help-text {
  color: #5a5570;
  margin: 0;
  font-weight: 500;
  font-size: 12.5px;
  line-height: 1.5;
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
</style>


