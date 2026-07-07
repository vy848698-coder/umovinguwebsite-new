<template>
  <div class="chips-question">
    <template v-if="!hideQuestionDisplay">
      <p v-if="titleText" class="question-title">
        {{ titleText }}
        <span v-if="showQuestionCursor" class="typing-cursor">|</span>
      </p>
      <p v-if="descriptionText" class="question-description">
        {{ descriptionText }}
        <span v-if="showDescriptionCursor" class="typing-cursor">|</span>
      </p>
    </template>

    <div class="chips-wrap">
      <button
        v-for="opt in question.options"
        :key="opt.value"
        :class="['chip', { selected: isSelected(opt.value) }]"
        @click="toggle(opt.value)"
        type="button"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: { type: Object, required: true },
  answer: { type: Array, default: () => [] },
  displayedQuestion: { type: String, default: '' },
  showQuestionCursor: { type: Boolean, default: false },
  displayedDescription: { type: String, default: '' },
  showDescriptionCursor: { type: Boolean, default: false },
  hideQuestionDisplay: { type: Boolean, default: false },
})
const emit = defineEmits(['update'])

const titleText = computed(
  () =>
    props.displayedQuestion ||
    props.question.title ||
    props.question.question ||
    '',
)

const descriptionText = computed(
  () => props.displayedDescription || props.question.description || '',
)

const isSelected = (value) =>
  Array.isArray(props.answer) ? props.answer.includes(value) : false

const toggle = (value) => {
  if (props.question.singleSelect) {
    const already = Array.isArray(props.answer) && props.answer.includes(value)
    emit('update', already ? [] : [value])
    return
  }
  const arr = Array.isArray(props.answer) ? [...props.answer] : []
  const idx = arr.indexOf(value)
  if (idx > -1) arr.splice(idx, 1)
  else arr.push(value)
  emit('update', arr)
}
</script>

<style scoped>
.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}
.chip {
  padding: 9px 15px;
  border-radius: 999px;
  border: 1px solid rgba(0, 161, 154, 0.2);
  background: rgba(0, 161, 154, 0.08);
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  color: #00857f;
  transition: background 0.16s, border-color 0.16s, color 0.16s,
    transform 0.12s;
}

.chip:hover {
  background: rgba(0, 161, 154, 0.14);
  border-color: rgba(0, 161, 154, 0.34);
}

.chip:active {
  transform: scale(0.97);
}

.chip.selected {
  background: #00a19a;
  color: white;
  border-color: #00a19a;
  box-shadow: 0 8px 18px -8px rgba(0, 161, 154, 0.5);
}
.question-title {
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
</style>


