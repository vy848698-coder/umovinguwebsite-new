<template>
  <div class="pw-card" :class="{ 'pw-card--answered': !!selectedLabel }">
    <div class="pw-header">
      <span class="pw-step-count">Step {{ stepPosition + 1 }} of {{ totalSteps }}</span>
    </div>

    <h3 class="pw-title">{{ step.title }}</h3>
    <p class="pw-body">{{ step.body }}</p>

    <div v-if="step.time || step.cost" class="pw-chips">
      <span v-if="step.time" class="pw-chip">{{ step.time }}</span>
      <span v-if="step.cost" class="pw-chip">{{ step.cost }}</span>
    </div>

    <div v-if="step.warning" class="pw-warning">{{ step.warning }}</div>

    <!-- Evidence upload, shown whenever any option on this step requires it -->
    <div v-if="stepNeedsUpload" class="pw-upload">
      <label class="pw-upload-btn">
        {{ uploading ? 'Uploading…' : evidenceFiles.length ? `${evidenceFiles.length} file(s) added` : 'Upload from files' }}
        <input type="file" multiple class="pw-upload-input" :disabled="uploading" @change="onFilesSelected" />
      </label>
      <p v-if="uploadError" class="pw-upload-error">{{ uploadError }}</p>
    </div>

    <!-- Every option stays visible and clickable even after this step has
         been answered, like the source prototype's history - picking a
         different one here re-answers this step and supersedes whatever
         was answered after it (handled server-side by advanceJourney). -->
    <div class="pw-options">
      <button
        v-for="option in step.options"
        :key="option.label"
        type="button"
        class="pw-option-btn"
        :class="{ selected: option.label === selectedLabel }"
        :disabled="busy || (option.requiresUpload && evidenceFiles.length === 0 && option.label !== selectedLabel)"
        @click="choose(option)"
      >
        {{ option.label }}
      </button>
    </div>

    <button v-if="!selectedLabel" type="button" class="pw-defer-btn" :disabled="busy" @click="$emit('defer')">
      I'll do this later
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PathwayStep, PathwayStepOption, ResolutionPathway } from '~/composables/usePathways'
import { usePathways } from '~/composables/usePathways'

const props = defineProps<{
  passportId: string
  pathway: ResolutionPathway
  currentStepId: string
  stepPosition: number
  totalSteps: number
  selectedLabel?: string | null
  answeredEvidenceFileUrls?: string[]
}>()

const emit = defineEmits<{
  (e: 'answer', payload: { stepId: string; answerLabel: string; evidenceFileUrls: string[] }): void
  (e: 'defer'): void
}>()

const { uploadEvidence } = usePathways()

const step = computed<PathwayStep>(() => {
  const found = props.pathway.steps.find((s) => s.id === props.currentStepId)
  if (!found) throw new Error(`Pathway ${props.pathway.id} has no step "${props.currentStepId}"`)
  return found
})
const stepNeedsUpload = computed(() => step.value.options.some((o) => o.requiresUpload))

const evidenceFiles = ref<string[]>(props.answeredEvidenceFileUrls ?? [])
const uploading = ref(false)
const uploadError = ref('')
const busy = ref(false)

// One PathwayStepCard instance now renders one specific step in the flow
// (answered or live), keyed by step id in the parent so each gets its own
// instance - but the SAME instance is reused across re-answers of that one
// step (e.g. editing an earlier choice), so `busy`/evidence still need to
// reset whenever this step's recorded answer actually changes, or a second
// edit of the same step would find every button permanently disabled.
watch(
  () => props.selectedLabel,
  () => {
    busy.value = false
    evidenceFiles.value = props.answeredEvidenceFileUrls ?? []
    uploadError.value = ''
  },
)

async function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true
  uploadError.value = ''
  try {
    for (const file of Array.from(input.files)) {
      const result = await uploadEvidence(props.passportId, file)
      evidenceFiles.value.push(result.fileUrl)
    }
  } catch (err: any) {
    uploadError.value = err?.data?.message || 'Failed to upload — please try again.'
  } finally {
    uploading.value = false
  }
}

function choose(option: PathwayStepOption) {
  if (busy.value) return
  if (option.label === props.selectedLabel) return // no-op, nothing changed
  if (option.requiresUpload && evidenceFiles.value.length === 0) return
  busy.value = true
  emit('answer', { stepId: step.value.id, answerLabel: option.label, evidenceFileUrls: evidenceFiles.value })
}
</script>

<style scoped>
.pw-card {
  margin-top: 16px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e6e4de;
  border-radius: 16px;
}
.pw-card--answered {
  background: #fafaf8;
}
.pw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.pw-step-count {
  font-size: 12px;
  font-weight: 700;
  color: #6b7089;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.pw-title {
  font-size: 17px;
  font-weight: 800;
  color: #231d45;
  margin: 0 0 6px;
}
.pw-body {
  font-size: 14px;
  color: #4a4b52;
  line-height: 1.5;
  margin: 0 0 12px;
}
.pw-chips {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.pw-chip {
  font-size: 12px;
  font-weight: 700;
  color: #00857f;
  background: #e6f6f5;
  padding: 4px 10px;
  border-radius: 20px;
}
.pw-warning {
  padding: 10px 14px;
  background: #fff4e0;
  border: 1px solid #f4d9a0;
  border-radius: 10px;
  color: #7a5200;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 14px;
}
.pw-upload {
  margin-bottom: 14px;
}
.pw-upload-btn {
  display: inline-block;
  padding: 10px 16px;
  background: #f5f4f1;
  border: 1px dashed #c9c6bd;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #231d45;
  cursor: pointer;
}
.pw-upload-input {
  display: none;
}
.pw-upload-error {
  color: #b42318;
  font-size: 12px;
  margin: 6px 0 0;
}
.pw-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.pw-option-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1.5px solid #00a19a;
  background: #fff;
  color: #00857f;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pw-option-btn:hover:not(:disabled) {
  background: #00a19a;
  color: #fff;
}
.pw-option-btn.selected {
  background: #00a19a;
  color: #fff;
}
.pw-option-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pw-option-btn.selected:disabled {
  opacity: 1;
}
.pw-defer-btn {
  display: block;
  margin: 0 auto;
  background: none;
  border: none;
  color: #6b7089;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}
</style>
