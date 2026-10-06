<template>
  <div class="text-input-wrapper">
    <!-- Question Display Section (skip if hideQuestionDisplay is true) -->
    <template v-if="!hideQuestionDisplay">
      <div v-if="!answer || answer.length === 0" class="pending-badge">
        <span class="pending-icon">⚠</span> Pending
      </div>
      <p v-if="displayedQuestion" class="question-text">
        {{ displayedQuestion }}
        <span v-if="showQuestionCursor" class="typing-cursor">|</span>
      </p>

      <!-- Description Display Section -->
      <p v-if="displayedDescription" class="question-description">
        {{ displayedDescription }}
        <span v-if="showDescriptionCursor" class="typing-cursor">|</span>
      </p>

      <!-- Help Display Section -->
      <div v-if="displayedHelp" class="help-section">
        <div class="help-content">
          <h4 class="help-title">
            <img src="/op-icons/homescore/lightbulb.png" alt="" class="help-icon-img" />What is this?
          </h4>
          <p class="help-text">
            {{ displayedHelp }}
            <span v-if="showHelpCursor" class="typing-cursor">|</span>
          </p>
        </div>
      </div>
    </template>

    <!-- <h3 v-if="question.description" class="section-title">
      {{ question.description }}
    </h3> -->
    <div class="input-container">
      <p v-if="!hideQuestionDisplay" class="input-instruction">
        {{
          question.instructionText ||
          'Please provide written instruction for your answer above:'
        }}
      </p>
      <textarea
        :value="answer"
        @input="updateAnswer"
        :placeholder="
          question.placeholder ||
          'E.g., Back fence in the garden has been moved back 2 yards...'
        "
        class="text-input"
        :rows="question.rows || 6"
       :aria-label="
          question.placeholder ||
          'E.g., Back fence in the garden has been moved back 2 yards...'
        "></textarea>
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

const updateAnswer = (event) => {
  const value = event.target.value
  if (value.length <= 500) {
    emit('update', value)
  }
}
</script>

<style scoped>
.text-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #00a19a;
  margin: 0;
}

.input-container {
  background: white;
  /* border: 2px solid #e0e0e0; */
  border-radius: 12px;
  /* padding: 16px; */
  position: relative;
}

.pending-badge {
  /* position: absolute; */
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff6b6b;
  font-weight: 600;
}

.pending-icon {
  font-size: 14px;
}

.input-instruction {
  font-size: 13.5px;
  color: #5a5570;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.text-input {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #ececf2;
  border-radius: 12px;
  font-size: 15px;
  line-height: 1.5;
  font-family: inherit;
  resize: vertical;
  background: #fbfbfa;
  transition: border-color 0.16s, background 0.16s;
  box-sizing: border-box;
  color: #2a2540;
  color-scheme: light;
}

.text-input:focus {
  outline: none;
  border-color: #00a19a;
  background: white;
}

.text-input::placeholder {
  color: #a5a1b4;
}

.question-text {
  color: #231d45;
  margin: 0;
  font-weight: 800;
  font-size: 24px;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.question-description {
  font-weight: 500;
  font-size: 15px;
  line-height: 1.55;
  letter-spacing: -0.01em;
  color: #8b8799;
}

.help-section {
  display: flex;
  gap: 14px;
  padding: 18px 20px;
  background: rgba(0, 161, 154, 0.07);
  border-radius: 16px;
  border-left: 4px solid #00a19a;
  margin: 0 0 22px 0;
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

/* "What is this?" lightbulb - the same illustrated icon the app uses. */
.help-icon-img {
  width: 15px;
  height: 15px;
  object-fit: contain;
  flex-shrink: 0;
  vertical-align: -2px;
  margin-right: 5px;
}

.help-text {
  color: #5a5570;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.6;
}

.typing-cursor {
  display: inline-block;
  animation: blink 1s infinite;
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
</style>


