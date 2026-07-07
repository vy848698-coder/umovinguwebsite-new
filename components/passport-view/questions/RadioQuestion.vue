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
        <span class="help-ic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6" /><path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v1.3h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
          </svg>
        </span>
        <div class="help-content">
          <h4 class="help-title">What is this?</h4>
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

      <!-- Instruction Text (only if explicit or if additional info will follow) -->
      <p
        v-if="question.instructionText || question.additionalInfoType"
        class="input-instruction"
      >
        {{
          question.instructionText ||
          'Please provide written instruction for your answer above:'
        }}
      </p>
    </template>

    <!-- Options -->
    <div class="radio-options">
      <div
        v-for="option in question.options"
        :key="option.value"
        class="radio-option"
        :class="{ selected: answer === option.value }"
        @click="selectOption(option.value)"
      >
        <div class="radio-btn" :class="{ checked: answer === option.value }">
          <span v-if="answer === option.value" class="check-icon">✓</span>
        </div>
        <span class="option-label">{{ option.label }}</span>
        <span class="option-key">{{ (option.label || '').charAt(0).toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  answer: {
    type: String,
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

const selectOption = (value) => {
  emit('update', value)
}
</script>

<style scoped>
.input-instruction {
  font-size: 13.5px;
  color: #5a5570;
  margin: 20px 0 12px 0;
  font-weight: 600;
}

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

.help-ic {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  color: #f5b544;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 10px rgba(35, 29, 69, 0.08);
}
.help-ic svg {
  width: 17px;
  height: 17px;
}

.help-content {
  flex: 1;
  min-width: 0;
}

.help-title {
  margin: 3px 0 5px;
  color: #00857f;
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.help-text {
  color: #4b4a5c;
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

.radio-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 560px) {
  .radio-options {
    grid-template-columns: 1fr;
  }
}

.radio-option {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  background: #fbfbfa;
  border: 1.5px solid #ececf2;
  cursor: pointer;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s,
    transform 0.12s;
  border-radius: 14px;
  gap: 13px;
}

.option-key {
  margin-left: auto;
  flex-shrink: 0;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ececf2;
  color: #a5a1b4;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.radio-option.selected .option-key {
  background: rgba(0, 161, 154, 0.12);
  border-color: rgba(0, 161, 154, 0.28);
  color: #00857f;
}

.radio-option:hover {
  border-color: #bfe9e5;
  background: #fbfefe;
}

.radio-option:active {
  transform: scale(0.99);
}

.radio-option.selected {
  border-color: #00a19a;
  background: rgba(0, 161, 154, 0.06);
  box-shadow: 0 6px 18px -8px rgba(0, 161, 154, 0.4);
}

.radio-btn {
  width: 22px;
  height: 22px;
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
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
}

.option-label {
  color: #231d45;
  font-weight: 600;
  font-size: 14.5px;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.radio-option.selected .option-label {
  color: #0c5f5a;
  font-weight: 700;
}
</style>


