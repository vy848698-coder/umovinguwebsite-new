<template>
  <div class="multi-field-form-wrapper">
    <!-- Question Display Section (skip if hideQuestionDisplay is true) -->
    <template v-if="!hideQuestionDisplay">
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

    <!-- Forms Container -->
    <div class="forms-container">
      <!-- Form title (shown inside container for multifieldform in multipart) -->
      <p v-if="question.title && hideQuestionDisplay" class="form-title">
        {{ question.title }}
      </p>

      <!-- Each form instance -->
      <div
        v-for="(formInstance, formIndex) in formInstances"
        :key="formIndex"
        class="form-instance"
        :class="{ 'has-remove': repeatable && formInstances.length > 1 }"
      >
        <!-- Remove button for repeatable forms -->
        <button
          v-if="repeatable && formInstances.length > 1"
          class="remove-form-btn"
          @click="removeForm(formIndex)"
          title="Remove this form"
        >
          ✕
        </button>

        <!-- Form fields -->
        <div class="form-fields">
          <div
            v-for="field in question.fields"
            :key="field.key"
            class="form-field"
          >
            <label class="field-label" :for="`mff-${formIndex}-${field.key}`">{{ field.label }}</label>
            <input
              :value="getFieldValue(formIndex, field.key)"
              type="text"
              class="field-input"
              :placeholder="field.placeholder || ''"
              @input="
                updateFieldValue(formIndex, field.key, $event.target.value)
              "
            :id="`mff-${formIndex}-${field.key}`"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add More Button (if repeatable) -->
    <button v-if="repeatable" class="add-form-btn" @click="addForm">
      <span class="add-icon"
        ><OPIcon name="addMoreButton" class="w-[15px] h-[15px]"
      /></span>
      {{ question.buttonText || 'Add More' }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import OPIcon from '~/components/ui/OPIcon.vue'
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

const repeatable = computed(() => props.question.repeatable === true)

const formInstances = ref([])

const createEmptyForm = () => {
  const form = {}
  if (props.question.fields) {
    props.question.fields.forEach((field) => {
      form[field.key] = ''
    })
  }
  return form
}

// Initialize forms from saved answers
watch(
  () => props.answer,
  (val) => {
    if (repeatable.value) {
      // For repeatable: answer is array of objects
      if (Array.isArray(val) && val.length > 0) {
        formInstances.value = JSON.parse(JSON.stringify(val))
      } else {
        formInstances.value = [createEmptyForm()]
      }
    } else {
      // For non-repeatable: answer is single object
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        formInstances.value = [JSON.parse(JSON.stringify(val))]
      } else {
        formInstances.value = [createEmptyForm()]
      }
    }
  },
  { immediate: true },
)

const getFieldValue = (formIndex, fieldKey) => {
  if (formInstances.value[formIndex]) {
    return formInstances.value[formIndex][fieldKey] || ''
  }
  return ''
}

const updateFieldValue = (formIndex, fieldKey, value) => {
  if (formInstances.value[formIndex]) {
    formInstances.value[formIndex][fieldKey] = value
    emitUpdate()
  }
}

const addForm = () => {
  formInstances.value.push(createEmptyForm())
  emitUpdate()
}

const removeForm = (formIndex) => {
  formInstances.value.splice(formIndex, 1)
  emitUpdate()
}

const emitUpdate = () => {
  if (repeatable.value) {
    // Return array for repeatable forms
    emit('update', formInstances.value)
  } else {
    // Return single object for non-repeatable form
    emit('update', formInstances.value[0] || createEmptyForm())
  }
}
</script>

<style scoped>
.multi-field-form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-text {
  font-size: 24px;
  font-weight: 800;
  color: #231d45;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.question-description {
  font-size: 15px;
  font-weight: 500;
  color: #8b8799;
  margin: 0 0 20px 0;
  line-height: 1.55;
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
  margin: 0;
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

.forms-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* padding: 16px; */
  /* background: #f9f9f9; */
  /* border: 1px solid #e0e0e0; */
  /* border-radius: 12px; */
  transition: border-color 0.2s;
}

.forms-container:hover {
  border-color: #00a19a;
}

.form-title {
  font-size: 15px;
  font-weight: 800;
  color: #231d45;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.form-instance {
  position: relative;
}

.form-instance.has-remove {
  padding: 18px 18px 18px;
  border: 1.5px solid #ececf2;
  border-radius: 16px;
  background: #fbfbfa;
}

.remove-form-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f0f4;
  border: none;
  border-radius: 50%;
  color: #8b8799;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.16s, color 0.16s;
}

.remove-form-btn:hover {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: #5a5570;
  margin: 0;
  letter-spacing: -0.01em;
}

.field-input {
  padding: 13px 15px;
  border: 1.5px solid #ececf2;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  background: #fbfbfa;
  color: #2a2540;
  color-scheme: light;
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #00a19a;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}

.field-input::placeholder {
  color: #a5a1b4;
}

.add-form-btn {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  padding: 15px 12px;
  background: rgba(0, 161, 154, 0.08);
  border: 1.5px dashed rgba(0, 161, 154, 0.4);
  border-radius: 14px;
  color: #00857f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.16s, border-color 0.16s;
  align-self: center;
  white-space: nowrap;
  width: 100%;
}

.add-form-btn:hover {
  background: rgba(0, 161, 154, 0.14);
  border-color: #00a19a;
}

.add-icon {
  font-size: 18px;
  font-weight: 700;
  display: inline-flex;
}
</style>


