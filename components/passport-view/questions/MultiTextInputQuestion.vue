<template>
  <div class="multi-text-input-wrapper">
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
        <span class="help-icon">ℹ</span>
        <span class="help-text">
          {{ displayedHelp }}
          <span v-if="showHelpCursor" class="typing-cursor">|</span>
        </span>
      </div>
    </template>

    <!-- Existing Items List -->
    <div v-if="itemsList.length > 0" class="items-list">
      <div v-for="(item, index) in itemsList" :key="index" class="item-card">
        <div class="item-content">
          <span class="item-text">{{ item }}</span>
        </div>
        <button class="edit-btn" @click="startEdit(index)">Edit</button>
      </div>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <input
        v-model="newItem"
        type="text"
        class="text-input"
        :placeholder="question?.placeholder || 'Enter Name'"
        @keyup.enter="addItem"
      />
      <button class="add-btn" @click="addItem">
        <span class="add-icon">+</span>
        {{ question?.buttonText || 'Add More Sellers' }}
      </button>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="editingIndex !== null"
      class="modal-overlay"
      @click.self="cancelEdit"
    >
      <div class="modal">
        <div class="modal-header">
          <h3>Edit Entry</h3>
          <button class="close-btn" @click="cancelEdit">×</button>
        </div>
        <input
          v-model="editingValue"
          type="text"
          class="modal-input"
          autofocus
          @keyup.enter="saveEdit"
        />
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelEdit">Cancel</button>
          <button class="save-btn" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  answer: {
    type: Array,
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

const newItem = ref('')
const editingIndex = ref(null)
const editingValue = ref('')

const itemsList = computed(() => {
  return Array.isArray(props.answer) ? props.answer : []
})

const addItem = () => {
  if (newItem.value.trim()) {
    const updated = [...itemsList.value, newItem.value.trim()]
    emit('update', updated)
    newItem.value = ''
  }
}

const startEdit = (index) => {
  editingIndex.value = index
  editingValue.value = itemsList.value[index]
}

const saveEdit = () => {
  if (editingValue.value.trim()) {
    const updated = [...itemsList.value]
    updated[editingIndex.value] = editingValue.value.trim()
    emit('update', updated)
    cancelEdit()
  }
}

const cancelEdit = () => {
  editingIndex.value = null
  editingValue.value = ''
}
</script>

<style scoped>
.multi-text-input-wrapper {
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
  gap: 11px;
  padding: 13px 15px;
  background: rgba(0, 161, 154, 0.06);
  border: 1px solid rgba(0, 161, 154, 0.18);
  border-radius: 14px;
  margin: 0 0 18px 0;
  font-size: 12.5px;
  font-weight: 500;
  color: #5a5570;
  line-height: 1.5;
}

.help-icon {
  flex-shrink: 0;
  font-size: 15px;
  color: #00857f;
}

.help-text {
  line-height: 1.5;
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

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #fff;
  border: 1.5px solid #ececf2;
  border-radius: 12px;
  transition: border-color 0.16s, box-shadow 0.16s;
}

.item-card:hover {
  border-color: #00a19a;
  box-shadow: 0 6px 18px -8px rgba(0, 161, 154, 0.35);
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.item-text {
  font-size: 14.5px;
  font-weight: 600;
  color: #231d45;
}

.edit-btn {
  padding: 7px 16px;
  background: rgba(0, 161, 154, 0.1);
  border: none;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  color: #00857f;
  cursor: pointer;
  transition: background-color 0.16s;
  flex-shrink: 0;
  margin-left: 12px;
}

.edit-btn:hover {
  background: rgba(0, 161, 154, 0.18);
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.text-input {
  flex: 1;
  padding: 14px 15px;
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

.text-input:focus {
  outline: none;
  border-color: #00a19a;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0, 161, 154, 0.1);
}

.text-input::placeholder {
  color: #a5a1b4;
}

.add-btn {
  padding: 14px 24px;
  background: rgba(0, 161, 154, 0.08);
  border: 1.5px dashed rgba(0, 161, 154, 0.4);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  color: #00857f;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.16s, border-color 0.16s;
  white-space: nowrap;
  flex-shrink: 0;
  justify-content: center;
}

.add-btn:hover {
  background: rgba(0, 161, 154, 0.14);
  border-color: #00a19a;
}

.add-icon {
  font-size: 18px;
  font-weight: 700;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #1a1a1a;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.modal-input:focus {
  outline: none;
}

.modal-footer {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.cancel-btn,
.save-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn {
  background: #f0f0f0;
  color: #1a1a1a;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.save-btn {
  background: #00a19a;
  color: white;
}

.save-btn:hover {
  background: #008b82;
}
</style>


