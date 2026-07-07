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

    <!-- Options -->
    <div class="checkbox-options">
      <div
        v-for="option in question.options"
        :key="option.value"
        class="checkbox-option"
        :class="{ selected: isSelected(option.value) }"
        @click="toggleOption(option.value)"
      >
        <div class="checkbox" :class="{ checked: isSelected(option.value) }">
          <span v-if="isSelected(option.value)" class="check-mark">✓</span>
        </div>
        <span class="option-label">{{ option.label }}</span>
      </div>
    </div>

    <!-- Other text input (only shown when otherPlaceholder is set and 'other' is selected) -->
    <textarea
      v-if="showOtherTextarea"
      :value="otherText"
      @input="onOtherTextInput"
      :placeholder="question.otherPlaceholder"
      class="other-text-input"
      rows="3"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  answer: {
    type: [Array, Object],
    default: () => [],
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

const otherText = ref('')

// Support both plain array answers and {values, otherText} object answers
const selectedValues = computed(() => {
  if (Array.isArray(props.answer)) return props.answer
  if (props.answer && typeof props.answer === 'object' && Array.isArray(props.answer.values)) {
    return props.answer.values
  }
  return []
})

watch(
  () => props.answer,
  (val) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      otherText.value = val.otherText || ''
    }
  },
  { immediate: true },
)

const isSelected = (value) => selectedValues.value.includes(value)

const emitAnswer = (values) => {
  if (props.question?.otherPlaceholder) {
    emit('update', { values, otherText: otherText.value })
  } else {
    emit('update', values)
  }
}

const toggleOption = (value) => {
  const newValues = [...selectedValues.value]
  const index = newValues.indexOf(value)

  if (index > -1) {
    newValues.splice(index, 1)
  } else {
    newValues.push(value)
  }

  emitAnswer(newValues)
}

const showOtherTextarea = computed(() => !!props.question?.otherPlaceholder)

const onOtherTextInput = (event) => {
  otherText.value = event.target.value
  emitAnswer(selectedValues.value)
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

.checkbox-options {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 17px;
  background: #fff;
  border: 1.5px solid #ececf2;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s,
    transform 0.12s;
}

.checkbox-option:hover {
  border-color: #bfe9e5;
  background: #fbfefe;
}

.checkbox-option:active {
  transform: scale(0.99);
}

.checkbox-option.selected {
  border-color: #00a19a;
  background: rgba(0, 161, 154, 0.06);
  box-shadow: 0 6px 18px -8px rgba(0, 161, 154, 0.4);
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #d3d0dd;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.16s, border-color 0.16s;
  background: #fff;
}

.checkbox-option.selected .checkbox {
  border-color: #00a19a;
  background: #00a19a;
}

.check-mark {
  color: white;
  font-size: 15px;
  font-weight: 800;
}

.option-label {
  font-size: 14.5px;
  font-weight: 600;
  color: #231d45;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.checkbox-option.selected .option-label {
  color: #0c5f5a;
  font-weight: 700;
}

.other-text-input {
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border: 1.5px solid #ececf2;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.5;
  font-family: inherit;
  resize: vertical;
  background: #fbfbfa;
  box-sizing: border-box;
  color: #2a2540;
  color-scheme: light;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s;
}

.other-text-input::placeholder {
  color: #a5a1b4;
}

.other-text-input:focus {
  outline: none;
  border-color: #00a19a;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}
</style>


