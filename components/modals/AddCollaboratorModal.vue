<template>
  <BaseDrawer v-model="isOpen" :title="props.isOwner ? 'Add Collaborator' : 'Collaborators'">
    <div class="add-collaborator-modal">
      <!-- Only the owner can add/remove collaborators (backend-enforced); a
           collaborator with view access to this passport sees the same
           page and used to get a confusing rejection if they tried. Client
           bug report, 2026-10-06. -->
      <p v-if="!props.isOwner" class="owner-only-note">
        Only the passport owner can add or remove collaborators. You can see
        who already has access below.
      </p>

      <!-- Step 1: email lookup -->
      <template v-if="props.isOwner && step === 'search'">
        <div class="modal-info">
          <p class="info-text">
            Enter the email address of the person you'd like to give access to
            this passport. We'll check if they already have an Umovingu account.
          </p>
        </div>

        <div class="form-group">
          <label for="collaborator-email" class="form-label">Email Address</label>
          <input
            id="collaborator-email"
            v-model="email"
            type="email"
            placeholder="colleague@example.com"
            class="form-input"
            :disabled="isLoading"
            @keyup.enter="handleCheckEmail"
          />
        </div>

        <div v-if="checkMessage" class="check-message" :class="`check-message--${checkMessageTone}`">
          <p>{{ checkMessage }}</p>
          <button
            v-if="checkStatus === 'already-invited'"
            type="button"
            class="link-btn"
            :disabled="isLoading"
            @click="goToInviteStep"
          >
            Resend invite
          </button>
        </div>
      </template>

      <!-- Step 2a: found an existing account - collect role/access, then add -->
      <template v-else-if="props.isOwner && step === 'add'">
        <div class="modal-info">
          <p class="info-text">
            <strong>{{ foundFirstName || 'This person' }}</strong> already has an
            Umovingu account. Choose their role and access, then add them as a
            collaborator.
          </p>
        </div>
        <p class="found-email">{{ email }}</p>

        <div class="form-group">
          <label for="collaborator-role" class="form-label">Their role</label>
          <select id="collaborator-role" v-model="role" class="form-input" :disabled="isLoading">
            <option value="">Not specified</option>
            <option value="Solicitor">Solicitor</option>
            <option value="Estate agent">Estate agent</option>
            <option value="Co-owner">Co-owner</option>
            <option value="Buyer">Buyer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Choose access</label>
          <label class="checkbox-row">
            <input type="checkbox" v-model="grantHistoryAccess" :disabled="isLoading" />
            Passport history
          </label>
          <p class="checkbox-hint">
            Property information is always included. Choose which vault
            documents they can see from each document's own access settings.
          </p>
        </div>
      </template>

      <!-- Step 2b: no account yet - offer to invite -->
      <template v-else-if="props.isOwner && step === 'invite'">
        <div class="modal-info modal-info--invite">
          <p class="info-text">
            We couldn't find an Umovingu account for <strong>{{ email }}</strong>.
            You can invite them to join Umovingu - they'll be added as a
            collaborator on this passport automatically as soon as they sign up.
          </p>
        </div>

        <div class="form-group">
          <label for="invite-role" class="form-label">Their role</label>
          <select id="invite-role" v-model="role" class="form-input" :disabled="isLoading">
            <option value="">Not specified</option>
            <option value="Solicitor">Solicitor</option>
            <option value="Estate agent">Estate agent</option>
            <option value="Co-owner">Co-owner</option>
            <option value="Buyer">Buyer</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Choose access</label>
          <label class="checkbox-row">
            <input type="checkbox" v-model="grantHistoryAccess" :disabled="isLoading" />
            Passport history
          </label>
          <p class="checkbox-hint">
            This is what they'll be granted the moment they accept and sign up.
          </p>
        </div>
      </template>

      <!-- Error / Success -->
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <!-- Existing Collaborators -->
      <div v-if="collaborators.length > 0" class="collaborators-list">
        <h3 class="list-title">Current Collaborators</h3>
        <div v-for="collaborator in collaborators" :key="collaborator.id" class="collaborator-item">
          <div class="collaborator-info">
            <div class="collaborator-avatar">
              {{ getInitials(collaborator.firstName, collaborator.lastName) }}
            </div>
            <div class="collaborator-details">
              <p class="collaborator-name">
                {{ collaborator.firstName }} {{ collaborator.lastName }}
                <span v-if="collaborator.role" class="collaborator-role">· {{ collaborator.role }}</span>
              </p>
              <p class="collaborator-email">{{ collaborator.email }}</p>
              <label class="checkbox-row checkbox-row--small">
                <input
                  type="checkbox"
                  :checked="collaborator.historyAccess"
                  :disabled="isLoading || !props.isOwner"
                  @change="handleToggleHistoryAccess(collaborator)"
                />
                Passport history
              </label>
            </div>
          </div>
          <button v-if="props.isOwner" class="remove-btn" :disabled="isLoading" @click="handleRemove(collaborator.id)">
            Remove
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="props.isOwner" class="modal-actions">
        <button
          v-if="step !== 'search'"
          class="btn btn-secondary"
          :disabled="isLoading"
          @click="step = 'search'"
        >
          Back
        </button>
        <button v-else class="btn btn-secondary" :disabled="isLoading" @click="handleClose">
          Close
        </button>

        <button
          v-if="step === 'search'"
          class="btn btn-primary"
          :disabled="!email || isLoading"
          @click="handleCheckEmail"
        >
          {{ isLoading ? 'Checking...' : 'Check email' }}
        </button>
        <button v-else-if="step === 'add'" class="btn btn-primary" :disabled="isLoading" @click="handleAdd">
          {{ isLoading ? 'Adding...' : 'Add Collaborator' }}
        </button>
        <button v-else class="btn btn-primary" :disabled="isLoading" @click="handleInvite">
          {{ isLoading ? 'Sending...' : 'Invite to Umovingu' }}
        </button>
      </div>
      <div v-else class="modal-actions">
        <button class="btn btn-secondary" @click="handleClose">Close</button>
      </div>
    </div>
  </BaseDrawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import { usePassportCollaborators } from '~/composables/usePassportCollaborators'

const props = defineProps({
  show: { type: Boolean, default: false },
  passportId: { type: String, required: true },
  // Defaults to true (today's prior behaviour) for any caller that hasn't
  // been updated to pass the real value yet.
  isOwner: { type: Boolean, default: true },
})

const emit = defineEmits(['update:show', 'added', 'removed', 'invited'])

const {
  addCollaborator,
  checkCollaboratorEmail,
  inviteCollaborator,
  getCollaborators,
  removeCollaborator,
  updateCollaboratorScope,
} = usePassportCollaborators()

const isOpen = ref(props.show)
const step = ref('search') // 'search' | 'add' | 'invite'
const email = ref('')
const role = ref('')
const grantHistoryAccess = ref(true)
const foundFirstName = ref('')
const checkStatus = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref('')
const collaborators = ref([])

const CHECK_MESSAGES = {
  'already-collaborator': 'This person is already a collaborator on this passport.',
  'already-invited': "An invite is already pending for this email - they haven't signed up yet.",
  'is-owner': "That's your own email address - you already own this passport.",
}

const checkMessage = ref('')
const checkMessageTone = ref('info')

function resetForm() {
  step.value = 'search'
  email.value = ''
  role.value = ''
  grantHistoryAccess.value = true
  foundFirstName.value = ''
  checkStatus.value = ''
  checkMessage.value = ''
  error.value = ''
  success.value = ''
}

watch(
  () => props.show,
  (newVal) => {
    isOpen.value = newVal
    if (newVal) {
      loadCollaborators()
      resetForm()
    }
  },
)

watch(isOpen, (newVal) => {
  emit('update:show', newVal)
})

const loadCollaborators = async () => {
  try {
    collaborators.value = await getCollaborators(props.passportId)
  } catch (err) {
    console.error('Failed to load collaborators:', err)
  }
}

const handleCheckEmail = async () => {
  if (!email.value) return
  error.value = ''
  checkMessage.value = ''
  isLoading.value = true
  try {
    const result = await checkCollaboratorEmail(props.passportId, email.value)
    checkStatus.value = result.status
    if (result.status === 'found') {
      foundFirstName.value = result.firstName || ''
      step.value = 'add'
    } else if (result.status === 'not-found') {
      step.value = 'invite'
    } else {
      checkMessage.value = CHECK_MESSAGES[result.status] || "Couldn't check that email."
      checkMessageTone.value = result.status === 'already-invited' ? 'info' : 'warning'
    }
  } catch (err) {
    console.error('Failed to check email:', err)
    error.value = err?.data?.message || "Couldn't check that email. Please try again."
  } finally {
    isLoading.value = false
  }
}

function goToInviteStep() {
  checkMessage.value = ''
  step.value = 'invite'
}

const handleAdd = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    const response = await addCollaborator(props.passportId, email.value, {
      role: role.value || undefined,
      historyAccess: grantHistoryAccess.value,
    })
    success.value = response.message || 'Collaborator added successfully!'
    resetForm()
    await loadCollaborators()
    emit('added', response.collaborator)
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to add collaborator:', err)
    error.value = err?.data?.message || 'Failed to add collaborator'
  } finally {
    isLoading.value = false
  }
}

const handleInvite = async () => {
  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await inviteCollaborator(props.passportId, email.value, {
      role: role.value || undefined,
      historyAccess: grantHistoryAccess.value,
    })
    success.value = `Invitation sent to ${email.value}.`
    emit('invited', { email: email.value })
    resetForm()
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to send invite:', err)
    error.value = err?.data?.message || 'Failed to send invite'
  } finally {
    isLoading.value = false
  }
}

const handleRemove = async (collaboratorId) => {
  if (!confirm('Are you sure you want to remove this collaborator?')) return

  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    const response = await removeCollaborator(props.passportId, collaboratorId)
    success.value = response.message || 'Collaborator removed successfully!'
    await loadCollaborators()
    emit('removed', collaboratorId)
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to remove collaborator:', err)
    error.value = err?.data?.message || 'Failed to remove collaborator'
  } finally {
    isLoading.value = false
  }
}

const handleToggleHistoryAccess = async (collaborator) => {
  error.value = ''
  try {
    await updateCollaboratorScope(props.passportId, collaborator.id, {
      historyAccess: !collaborator.historyAccess,
    })
    await loadCollaborators()
  } catch (err) {
    console.error('Failed to update collaborator access:', err)
    error.value = err?.data?.message || 'Failed to update access'
  }
}

const handleClose = () => {
  isOpen.value = false
}

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${first}${last}` || '?'
}
</script>

<style scoped>
.add-collaborator-modal {
  padding: 20px;
}

.modal-info {
  margin-bottom: 24px;
}

.owner-only-note {
  padding: 14px 16px;
  background: #f8f7fc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.modal-info--invite {
  background: #f2fbfa;
  border: 1px solid rgba(0, 161, 154, 0.25);
  border-radius: 10px;
  padding: 14px 16px;
}

.info-text {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.found-email {
  font-size: 13px;
  color: #00857f;
  font-weight: 600;
  margin: -12px 0 20px;
}

.check-message {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.check-message p {
  margin: 0;
}
.check-message--info {
  background: #eef6ff;
  border: 1px solid #cfe3fb;
  color: #2a5b8c;
}
.check-message--warning {
  background: #fff7ea;
  border: 1px solid #f4e0b5;
  color: #8a6a1f;
}
.link-btn {
  background: none;
  border: none;
  color: #00857f;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  padding: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #00a19a;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

select.form-input {
  cursor: pointer;
  background-color: #fff;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}
.checkbox-row input {
  accent-color: #00a19a;
}
.checkbox-row--small {
  font-size: 11.5px;
  color: #666;
  margin-top: 6px;
}
.checkbox-hint {
  font-size: 11.5px;
  color: #999;
  margin: 6px 0 0;
  line-height: 1.4;
}
.collaborator-role {
  font-weight: 400;
  color: #666;
}

.error-message {
  padding: 12px 16px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c00;
  font-size: 14px;
  margin-bottom: 16px;
}

.success-message {
  padding: 12px 16px;
  background-color: #e6f7f6;
  border: 1px solid #00a19a;
  border-radius: 8px;
  color: #00a19a;
  font-size: 14px;
  margin-bottom: 16px;
}

.collaborators-list {
  margin: 24px 0;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.collaborator-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 8px;
}

.collaborator-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.collaborator-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #00a19a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.collaborator-details {
  flex: 1;
}

.collaborator-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.collaborator-email {
  font-size: 12px;
  color: #666;
}

.remove-btn {
  padding: 6px 12px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  color: #c00;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover:not(:disabled) {
  background-color: #fee;
  border-color: #fcc;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.btn-primary {
  background-color: #00a19a;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #00a599;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
