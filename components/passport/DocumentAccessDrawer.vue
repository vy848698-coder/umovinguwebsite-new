<template>
  <BaseDrawer v-model="isOpen" title="Document access">
    <div v-if="doc" class="doc-access">
      <div class="doc-access-head">
        <div class="doc-access-title">{{ doc.title }}</div>
        <div class="doc-access-sub">Stored in Your Vault</div>
      </div>

      <div class="doc-access-label">Who can see this?</div>
      <div class="doc-access-options">
        <label
          class="doc-access-opt"
          :class="{ selected: radioLevel === 'PRIVATE' }"
        >
          <input type="radio" name="doc-access" value="PRIVATE" v-model="radioLevel" />
          <span class="doc-access-opt-body">
            <span class="doc-access-opt-t">Only me</span>
            <span class="doc-access-opt-s">Keep this document private in your Vault.</span>
          </span>
        </label>

        <label
          class="doc-access-opt"
          :class="{ selected: radioLevel === 'SELECTED' }"
        >
          <input type="radio" name="doc-access" value="SELECTED" v-model="radioLevel" />
          <span class="doc-access-opt-body">
            <span class="doc-access-opt-t">Selected people</span>
            <span class="doc-access-opt-s">Choose specific collaborators, such as your solicitor or agent, to access this document.</span>
          </span>
        </label>

        <label
          class="doc-access-opt"
          :class="{ selected: radioLevel === 'ELIGIBLE' }"
        >
          <input type="radio" name="doc-access" value="ELIGIBLE" v-model="radioLevel" />
          <span class="doc-access-opt-body">
            <span class="doc-access-opt-t">Include when I share my Passport</span>
            <span class="doc-access-opt-s">You'll confirm this document is included each time you share, on the review screen.</span>
          </span>
        </label>
      </div>

      <!-- Selected-people picker - only when that tier is chosen -->
      <div v-if="radioLevel === 'SELECTED'" class="doc-access-people">
        <p v-if="!collaborators.length" class="doc-access-people-empty">
          No collaborators on this Passport yet — add one first from the
          Collaborators row before granting document access.
        </p>
        <label
          v-for="c in collaborators"
          :key="c.id"
          class="doc-access-person"
        >
          <input
            type="checkbox"
            :checked="grantedIds.has(c.id)"
            :disabled="grantBusy"
            @change="toggleGrant(c)"
          />
          <span class="doc-access-person-avatar">{{ initials(c) }}</span>
          <span class="doc-access-person-name">{{ c.firstName }} {{ c.lastName }}</span>
        </label>
      </div>

      <div class="doc-access-divider" />

      <label class="doc-access-publish-row">
        <input type="checkbox" v-model="published" />
        <span class="doc-access-publish-body">
          <span class="doc-access-opt-t">Show on published Passport</span>
          <span class="doc-access-opt-s">
            Anyone viewing your published Passport could see this document.
          </span>
        </span>
      </label>

      <p v-if="error" class="doc-access-error">{{ error }}</p>
    </div>

    <template #footer>
      <button class="doc-access-save" :disabled="saving" @click="save">
        {{ saving ? 'Saving…' : 'Save access' }}
      </button>
    </template>
  </BaseDrawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import { useVaultDocuments } from '~/composables/useVaultDocuments'

const props = defineProps({
  show: { type: Boolean, default: false },
  doc: { type: Object, default: null },
  collaborators: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:show', 'changed'])

const { setDocumentAccess, addDocumentGrant, removeDocumentGrant } = useVaultDocuments()

const isOpen = ref(props.show)
watch(() => props.show, (v) => { isOpen.value = v })
watch(isOpen, (v) => emit('update:show', v))

// The stored accessLevel is a single tier, but the UI splits "publish" out
// as its own explicit toggle (per the client's brief: publish needs its
// own confirmation, never bundled into the private/selected/eligible
// choice). radioLevel holds the non-publish tier; `published` overrides it
// to PUBLISHED when checked, and reverts to radioLevel when unchecked.
const radioLevel = ref('PRIVATE')
const published = ref(false)
const grantedIds = ref(new Set())
const saving = ref(false)
const grantBusy = ref(false)
const error = ref('')

watch(
  () => props.doc,
  (doc) => {
    error.value = ''
    if (!doc) return
    published.value = doc.accessLevel === 'PUBLISHED'
    radioLevel.value = doc.accessLevel === 'PUBLISHED' ? 'PRIVATE' : doc.accessLevel
    grantedIds.value = new Set((doc.sharedWith ?? []).map((p) => p.id))
  },
  { immediate: true },
)

function initials(c) {
  return `${(c.firstName || '')[0] ?? ''}${(c.lastName || '')[0] ?? ''}`.toUpperCase() || '?'
}

async function toggleGrant(c) {
  if (!props.doc) return
  grantBusy.value = true
  try {
    if (grantedIds.value.has(c.id)) {
      await removeDocumentGrant(props.doc.kind, props.doc.id, c.id)
      grantedIds.value.delete(c.id)
    } else {
      await addDocumentGrant(props.doc.kind, props.doc.id, c.id)
      grantedIds.value.add(c.id)
    }
    grantedIds.value = new Set(grantedIds.value)
  } catch (e) {
    error.value = e?.data?.message || 'Could not update access. Please try again.'
  } finally {
    grantBusy.value = false
  }
}

async function save() {
  if (!props.doc) return
  saving.value = true
  error.value = ''
  try {
    const finalLevel = published.value ? 'PUBLISHED' : radioLevel.value
    await setDocumentAccess(props.doc.kind, props.doc.id, finalLevel)
    emit('changed')
    isOpen.value = false
  } catch (e) {
    error.value = e?.data?.message || 'Could not save access. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.doc-access { padding: 4px; }
.doc-access-head { margin-bottom: 20px; }
.doc-access-title { font-size: 17px; font-weight: 800; color: #231d45; }
.doc-access-sub { font-size: 12.5px; color: #6b6783; margin-top: 3px; }

.doc-access-label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #6b6783;
  margin-bottom: 10px;
}
.doc-access-options { display: flex; flex-direction: column; gap: 10px; }
.doc-access-opt {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  border: 1.5px solid #e3e1ea;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.doc-access-opt.selected {
  border-color: #00a19a;
  background: #f4fbfa;
}
.doc-access-opt input[type='radio'] { margin-top: 3px; accent-color: #00a19a; }
.doc-access-opt-body { display: flex; flex-direction: column; gap: 3px; }
.doc-access-opt-t { font-size: 14px; font-weight: 700; color: #231d45; }
.doc-access-opt-s { font-size: 12.5px; color: #6b6783; line-height: 1.4; }

.doc-access-people {
  margin-top: 10px;
  padding: 10px 12px;
  background: #fafafa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.doc-access-people-empty { font-size: 12.5px; color: #6b6783; margin: 4px 0; }
.doc-access-person { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.doc-access-person input { accent-color: #00a19a; }
.doc-access-person-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: #00a19a; color: #fff; font-size: 11px; font-weight: 800;
  display: grid; place-items: center; flex-shrink: 0;
}
.doc-access-person-name { font-size: 13.5px; font-weight: 600; color: #231d45; }

.doc-access-divider { height: 1px; background: #eceaf3; margin: 18px 0; }

.doc-access-publish-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}
.doc-access-publish-row input { margin-top: 3px; accent-color: #00a19a; }

.doc-access-error {
  margin-top: 14px;
  font-size: 13px;
  color: #dc2626;
}

.doc-access-save {
  width: 100%;
  background: #00a19a;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 15px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}
.doc-access-save:disabled { opacity: 0.6; cursor: not-allowed; }
.doc-access-save:hover:not(:disabled) { background: #00857f; }
</style>
