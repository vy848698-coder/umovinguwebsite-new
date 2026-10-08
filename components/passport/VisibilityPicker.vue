<template>
  <div class="vp" :class="{ 'vp--compact': compact }">
    <button
      v-for="opt in OPTIONS"
      :key="opt.value"
      type="button"
      class="vp-opt"
      :class="[`vp-opt--${opt.value.toLowerCase()}`, { selected: modelValue === opt.value }]"
      :disabled="disabled"
      @click="$emit('update:modelValue', opt.value)"
    >
      <span class="vp-opt-ic" aria-hidden="true">{{ opt.icon }}</span>
      <span class="vp-opt-body">
        <span class="vp-opt-t">{{ opt.label }}</span>
        <span v-if="!compact" class="vp-opt-s">{{ opt.desc }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VisibilityLevel } from '~/composables/useManageVisibility'

defineProps<{
  modelValue: VisibilityLevel
  disabled?: boolean
  compact?: boolean
}>()
defineEmits<{ (e: 'update:modelValue', value: VisibilityLevel): void }>()

const OPTIONS: Array<{ value: VisibilityLevel; label: string; desc: string; icon: string }> = [
  {
    value: 'PRIVATE',
    label: 'Private',
    desc: 'Only you and your authorised collaborators can see this.',
    icon: '🔒',
  },
  {
    value: 'SHARED',
    label: 'Shared',
    desc: 'Visible only to people you have specifically shared with.',
    icon: '👥',
  },
  {
    value: 'PUBLIC',
    label: 'Public',
    desc: 'Visible to anyone with access to the public property passport.',
    icon: '🌐',
  },
]
</script>

<style scoped>
.vp { display: flex; flex-direction: column; gap: 8px; }
.vp--compact { flex-direction: row; gap: 4px; }

.vp-opt {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1.5px solid #e3e1ea;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s;
}
.vp-opt:disabled { opacity: 0.6; cursor: not-allowed; }
.vp-opt.selected { border-color: #00a19a; background: #f4fbfa; }

.vp-opt-ic { font-size: 16px; flex-shrink: 0; line-height: 1.3; }
.vp-opt-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.vp-opt-t { font-size: 13.5px; font-weight: 700; color: #231d45; }
.vp-opt-s { font-size: 12px; color: #6b6783; line-height: 1.4; }

/* Compact (inline, per-task/field row): icon-only pill, label on tap-target
   via title attribute would be nicer, but a short label fits fine here. */
.vp--compact .vp-opt {
  padding: 7px 9px;
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.vp--compact .vp-opt-s { display: none; }
.vp--compact .vp-opt-t { font-size: 10px; font-weight: 800; }
.vp--compact .vp-opt-ic { font-size: 13px; }
</style>
