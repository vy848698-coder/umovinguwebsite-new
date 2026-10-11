<template>
  <div class="address-question">
    <h3 v-if="question.description" class="section-title">
      {{ question.description }}
    </h3>

    <!-- The property was claimed, so the address / UPRN / title number are
         already known and won't change - shown read-only for confirmation
         rather than as an editable field. -->
    <div
      v-if="(knownAddress || answer?.trim()) && !editing"
      class="addr-confirm"
      :class="{ 'is-confirmed': confirmed }"
    >
      <div class="addr-confirm-line">{{ displayAddress || 'Address on file' }}</div>
      <!-- The seller says whether this is their property, so nobody is left
           wondering if the address we found is right -->
      <div class="addr-actions">
        <button
          type="button"
          class="addr-yes"
          :class="{ 'is-on': confirmed }"
          :aria-pressed="confirmed"
          @click="confirmAddress"
        >
          <Icon name="i-lucide-check" class="addr-btn-ic" />
          {{ confirmed ? 'Address confirmed' : 'Yes, this is my address' }}
        </button>
        <button type="button" class="addr-change" @click="changeAddress">
          <Icon name="i-lucide-pencil" class="addr-btn-ic" />
          No, change it
        </button>
      </div>
      <div class="uprn-panel">
        <div class="uprn-panel-h">From HM Land Registry &amp; Ordnance Survey</div>
        <template v-if="hasKnownRefs">
          <div v-if="facts.uprn" class="uprn-row">
            <span class="uprn-label">UPRN</span>
            <span class="uprn-val">{{ facts.uprn }}</span>
          </div>
          <div v-if="facts.titleNumber" class="uprn-row">
            <span class="uprn-label">Title number</span>
            <span class="uprn-val">{{ facts.titleNumber }}</span>
          </div>
          <div v-if="facts.propertyType" class="uprn-row">
            <span class="uprn-label">Type</span>
            <span class="uprn-val">{{ facts.propertyType }}</span>
          </div>
        </template>
        <div v-else class="uprn-empty">
          UPRN and title number are still being confirmed. We'll add them
          once the property has been through Land Registry lookup.
        </div>
      </div>
      <p class="addr-confirm-note">
        Something not right? Your solicitor can correct the record during the
        transaction.
      </p>
    </div>

    <!-- No address on file for this passport yet (property-facts lookup
         failed or came back empty) - let the owner type it. -->
    <div v-else class="address-input-wrap">
      <div class="address-input">
        <input
          :placeholder="question.placeholder || 'Start typing address...'"
          v-model="text"
          aria-label="Property address, including the postcode"
          @input="emit('update', text)"
          class="text-field"
        />
        <button class="btn" @click="emit('update', text)">Find URN</button>
      </div>
      <button v-if="editing && knownAddress" type="button" class="addr-back" @click="useKnownAddress">
        Use the address we found: {{ knownAddress }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
const props = defineProps({
  question: { type: Object, required: true },
  answer: { type: String, default: '' },
  propertyFacts: { type: Object, default: null },
})
const emit = defineEmits(['update'])

const facts = computed(() => props.propertyFacts || {})

const text = ref(props.answer || '')
watch(
  () => props.answer,
  (v) => (text.value = v || ''),
)

const knownAddress = computed(() => {
  const f = facts.value
  return [f.addressLine1, f.city, f.postcode].filter(Boolean).join(', ')
})

// Prefer what's already saved as the answer; fall back to the known
// property address.
const displayAddress = computed(() => props.answer?.trim() || knownAddress.value)

const hasKnownRefs = computed(
  () => !!(facts.value.uprn || facts.value.titleNumber || facts.value.propertyType),
)

// Record the confirmed address as the answer so the question counts as
// answered (there's nothing for the user to type). Never clobber an
// existing answer.
// "Yes, this is my address" / "No, change it"
const confirmed = ref(false)
const editing = ref(false)

function confirmAddress() {
  confirmed.value = true
  emit('update', displayAddress.value)
}

function changeAddress() {
  confirmed.value = false
  editing.value = true
  text.value = ''
  emit('update', '')
}

function useKnownAddress() {
  editing.value = false
  confirmed.value = true
  emit('update', knownAddress.value)
}

function syncAnswer() {
  if (editing.value) return
  if (!props.answer?.trim() && knownAddress.value) {
    emit('update', knownAddress.value)
  }
}
onMounted(syncAnswer)
watch(knownAddress, syncAnswer)
</script>

<style scoped>
.section-title {
  font-size: 0.9375rem;
  margin-bottom: 8px;
  color: #111;
}
.addr-confirm-line {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #0e2840;
  margin-bottom: 10px;
}
.uprn-panel {
  padding: 12px 14px;
  background: #f2faf8;
  border: 1px solid #d5efe8;
  border-radius: 10px;
}
.uprn-panel-h {
  font-size: 0.6563rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7089;
  margin-bottom: 8px;
}
.uprn-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding: 4px 0;
  font-size: 0.8125rem;
}
.uprn-label {
  font-weight: 600;
  color: #4a5568;
}
.uprn-val {
  font-weight: 800;
  color: #0e2840;
  font-variant-numeric: tabular-nums;
}
.uprn-empty {
  font-size: 0.75rem;
  color: #6b7089;
  line-height: 1.5;
}
.addr-confirm-note {
  font-size: 0.7188rem;
  color: #9c98ad;
  line-height: 1.5;
  margin: 10px 0 0;
}
.addr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.addr-yes,
.addr-change {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;
}
.addr-yes {
  border: 1.5px solid #00a19a;
  background: #fff;
  color: #00796f;
}
.addr-yes:hover,
.addr-yes.is-on {
  background: #00a19a;
  color: #fff;
}
.addr-change {
  border: 1.5px solid #e2e5ec;
  background: #fff;
  color: #4a5568;
}
.addr-change:hover {
  border-color: #c7ccd8;
  color: #0e2840;
}
.addr-btn-ic {
  width: 16px;
  height: 16px;
}
.addr-back {
  margin-top: 10px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  color: #00796f;
  text-align: left;
  cursor: pointer;
}
.addr-back:hover {
  text-decoration: underline;
}
.address-input {
  display: flex;
  gap: 8px;
  align-items: center;
}
.text-field {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}
.btn {
  padding: 8px 12px;
  border-radius: 8px;
  background: #00a19a;
  color: white;
  border: none;
}
</style>
