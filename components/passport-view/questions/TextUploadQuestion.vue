<template>
  <div class="combined-input-wrapper">
    <!-- For 'both' mode: show instruction text at top, then textarea, then upload options below with Or divider -->
    <template v-if="displayMode === 'both'">
      <div v-if="!textValue || textValue.length === 0" class="pending-badge">
        <span class="pending-icon"
          ><OPIcon name="pendingCircle" class="w-[11px] h-[11px]"
        /></span>
        Pending
      </div>

      <p v-if="question.uploadInstruction" class="instruction-text">
        {{ question.uploadInstruction }}
      </p>

      <textarea
        :value="textValue"
        @input="onTextInput"
        :placeholder="
          question.placeholder ||
          'E.g., The irregular boundary near the stream at the rear of the property is owned by...'
        "
        class="text-input"
        rows="6"
      ></textarea>

      <div class="or-divider"></div>

      <div class="upload-options">
        <button class="upload-btn" @click="triggerFileUpload">
          <span class="upload-icon"
            ><OPIcon name="upload" class="w-[20px] h-[20px]"
          /></span>
          <span>Upload from Files</span>
        </button>
        <button class="upload-btn camera">
          <span class="upload-icon"
            ><OPIcon name="scan" class="w-[20px] h-[20px]"
          /></span>
          <span>Scan Using Camera</span>
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        multiple
        @change="handleFileSelect"
        style="display: none"
      />

      <div v-if="uploadedFiles.length > 0" class="uploaded-files">
        <h4 class="files-title">Uploaded Files ({{ uploadedFiles.length }})</h4>
        <div
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="file-item"
        >
          <span class="file-icon">📄</span>
          <span class="file-name">{{ file.name }}</span>
          <button class="remove-btn" @click="removeFile(index)">✕</button>
        </div>
      </div>
    </template>

    <!-- Text area only mode -->
    <template v-else-if="displayMode === 'text'">
      <div class="input-container">
        <div v-if="!textValue || textValue.length === 0" class="pending-badge">
          <span class="pending-icon"
            ><OPIcon name="pendingCircle" class="w-[11px] h-[11px]"
          /></span>
          Pending
        </div>

        <!-- Question Display (skip if hideQuestionDisplay is true) -->
        <template v-if="!hideQuestionDisplay">
          <p v-if="question.question" class="question-text">
            {{ displayedQuestion || question.question }}
            <span v-if="showQuestionCursor" class="typing-cursor">|</span>
          </p>

          <p v-if="question.instructionText" class="question-text">
            {{ question.instructionText }}
            <span v-if="showQuestionCursor" class="typing-cursor">|</span>
          </p>

          <!-- Description Display -->
          <div v-if="question.description" class="question-description">
            {{ question.description }}
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

        <textarea
          :value="textValue"
          @input="onTextInput"
          :placeholder="
            question.placeholder ||
            'E.g., Back fence in the garden has been moved back 2 yards...'
          "
          class="text-input"
          rows="6"
        ></textarea>
      </div>
    </template>

    <!-- Upload only mode -->
    <template v-else-if="displayMode === 'upload'">
      <div class="upload-container">
        <div v-if="hasPending" class="pending-badge">
          <span class="pending-icon"
            ><OPIcon name="pendingCircle" class="w-[11px] h-[11px]"
          /></span>
          Pending
        </div>

        <template v-if="!hideQuestionDisplay">
          <p v-if="question.question" class="question-text">
            {{ displayedQuestion || question.question }}
            <span v-if="showQuestionCursor" class="typing-cursor">|</span>
          </p>

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

        <p v-if="question.uploadInstruction" class="instruction-text">
          {{ question.uploadInstruction }}
        </p>

        <div class="upload-options">
          <button class="upload-btn" @click="triggerFileUpload">
            <span class="upload-icon"
              ><OPIcon name="upload" class="w-[20px] h-[20px]"
            /></span>
            <span>Upload from Files</span>
          </button>
          <button class="upload-btn camera">
            <span class="upload-icon"
              ><OPIcon name="scan" class="w-[20px] h-[20px]"
            /></span>
            <span>Scan Using Camera</span>
          </button>
        </div>

        <input
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          style="display: none"
        />

        <div v-if="uploadedFiles.length > 0" class="uploaded-files">
          <h4 class="files-title">
            Uploaded Files ({{ uploadedFiles.length }})
          </h4>
          <div
            v-for="(file, index) in uploadedFiles"
            :key="index"
            class="file-item"
          >
            <span class="file-icon">📄</span>
            <span class="file-name">{{ file.name }}</span>
            <button class="remove-btn" @click="removeFile(index)">✕</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import OPIcon from '~/components/ui/OPIcon.vue'
const props = defineProps({
  question: { type: Object, default: 'Test Question' },
  answer: { type: [String, Array, Object], default: '' },
  display: { type: String, default: '' },
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

const config = useRuntimeConfig()
const fileInput = ref(null)
const uploading = ref(false)

const displayMode = computed(() => {
  // Build a raw candidate for the display mode from props or question metadata
  const raw =
    props.display ||
    (props.question &&
      (props.question.display ||
        (props.question.showBoth ? 'both' : undefined) ||
        (props.question.uploadInstruction ? 'both' : undefined) ||
        props.question.type)) ||
    'text'

  const mode = String(raw || '')
    .toLowerCase()
    .trim()
  if (['text', 'upload', 'both'].includes(mode)) return mode

  // Fallback to question.type if possible
  const t =
    props.question && props.question.type
      ? String(props.question.type).toLowerCase()
      : 'text'
  return ['text', 'upload', 'both'].includes(t) ? t : 'text'
})

// Internal state derived from props.answer
const textValue = ref('')
const uploadedFiles = ref([])

const syncFromAnswer = (val) => {
  if (displayMode.value === 'text') {
    textValue.value = typeof val === 'string' ? val : ''
    uploadedFiles.value = []
  } else if (displayMode.value === 'upload') {
    uploadedFiles.value = Array.isArray(val) ? val : []
    textValue.value = ''
  } else {
    // both
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      textValue.value = val.text || ''
      uploadedFiles.value = val.files || []
    } else if (typeof val === 'string') {
      textValue.value = val
      uploadedFiles.value = []
    } else if (Array.isArray(val)) {
      uploadedFiles.value = val
      textValue.value = ''
    } else {
      textValue.value = ''
      uploadedFiles.value = []
    }
  }
}

watch(
  () => props.answer,
  (val) => {
    syncFromAnswer(val)
  },
  { immediate: true },
)

const onTextInput = (event) => {
  const value = event.target.value
  if (value.length <= 500) {
    textValue.value = value
    emitUpdate()
  }
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event) => {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return

  const questionId = props.question?.id
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  uploading.value = true
  const results = []
  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await $fetch(`${config.public.apiBase}/questions/${questionId}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      results.push({ name: res.name || file.name, url: res.url, size: file.size, type: file.type })
    } catch {
      results.push({ name: file.name, size: file.size, type: file.type, url: '' })
    }
  }
  uploading.value = false

  uploadedFiles.value = [...(uploadedFiles.value || []), ...results]
  emitUpdate()
}

const removeFile = (index) => {
  uploadedFiles.value = uploadedFiles.value.filter((_, i) => i !== index)
  emitUpdate()
}

const hasPending = computed(() => uploadedFiles.value.length === 0)

const emitUpdate = () => {
  if (displayMode.value === 'text') {
    emit('update', textValue.value)
  } else if (displayMode.value === 'upload') {
    emit('update', uploadedFiles.value)
  } else {
    emit('update', { text: textValue.value, files: uploadedFiles.value })
  }
}

const isDev =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV

// Dev-only diagnostics
onMounted(() => {
  console.log('TextUploadQuestion debug:', {
    displayMode: displayMode.value,
    question: props.question,
    answerProp: props.answer,
    textValue: textValue.value,
    uploadedFiles: uploadedFiles.value,
  })
  try {
    if (isDev) {
      console.log('TextUploadQuestion debug:', {
        displayMode: displayMode.value,
        question: props.question,
        answerProp: props.answer,
        textValue: textValue.value,
        uploadedFiles: uploadedFiles.value,
      })
    }
  } catch (e) {
    // ignore in environments where import.meta is not defined
  }
})
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

.combined-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: #00857f;
  margin: 0;
}

.input-container {
  border-radius: 12px;
}

.or-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #a5a1b4;
  margin: 4px 0;
  height: 20px;
  position: relative;
}

.or-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #ececf2;
  z-index: 0;
}

.or-divider::after {
  content: 'Or';
  position: relative;
  z-index: 1;
  background: #fff;
  padding: 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pending-badge {
  background: #f1f0f4;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #8b8799;
  font-weight: 800;
  padding: 5px 11px;
  width: fit-content;
  margin-bottom: 14px;
}

.input-instruction {
  font-size: 13.5px;
  color: #5a5570;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.instruction-text {
  font-size: 13.5px;
  color: #5a5570;
  margin: 0 0 12px 0;
  font-weight: 600;
  line-height: 1.5;
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
  transition: border-color 0.16s, background 0.16s, box-shadow 0.16s;
  box-sizing: border-box;
  color: #2a2540;
  color-scheme: light;
}

.text-input::placeholder {
  color: #a5a1b4;
}

.text-input:focus {
  outline: none;
  border-color: #00a19a;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}

.upload-options {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 12px;
}

.upload-btn {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 26px 16px;
  border: 1.5px dashed #d8d5e2;
  border-radius: 14px;
  background: #fbfbfa;
  cursor: pointer;
  transition: border-color 0.16s, background 0.16s, transform 0.12s;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  color: #5a5570;
}

.upload-btn:hover {
  border-color: #00a19a;
  background: rgba(0, 161, 154, 0.05);
  color: #00857f;
}

.upload-btn:active {
  transform: scale(0.99);
}

.upload-icon {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  background: rgba(0, 161, 154, 0.1);
}

.uploaded-files {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #fbfbfa;
  border: 1px solid #ececf2;
  border-radius: 14px;
}

.files-title {
  font-size: 13px;
  font-weight: 800;
  margin: 0 0 6px;
  color: #231d45;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 13px;
  background: #fff;
  border: 1px solid #ececf2;
  border-radius: 10px;
}

.file-icon {
  font-size: 15px;
}

.file-name {
  font-size: 13px;
  font-weight: 600;
  color: #5a5570;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: #f1f0f4;
  border: none;
  color: #8b8799;
  font-size: 13px;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: background 0.16s, color 0.16s;
}

.remove-btn:hover {
  background: rgba(255, 59, 48, 0.1);
  color: #ff3b30;
}
</style>


