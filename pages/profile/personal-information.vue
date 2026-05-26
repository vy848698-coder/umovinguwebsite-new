
<template>
  <div class="pi-page mobile-container">
    <!-- Nav bar -->
    <div class="pi-nav-bar">
      <button class="pi-nav-icon-btn" aria-label="Back" @click="goBack">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="pi-nav-title">Personal Information</div>
      <div style="width: 38px" />
    </div>

    <main class="pi-body">
      <div class="atm-bg atm-bg-warm" />

      <!-- Hero -->
      <div class="pi-hero">
        <button
          type="button"
          class="pi-avatar"
          aria-label="Edit profile picture"
          @click="isAvatarDrawerOpen = true"
        >
          <img
            v-if="avatarPreview"
            :src="avatarPreview"
            alt="Profile avatar"
            class="pi-avatar-img"
          />
          <span v-else>{{ initials }}</span>
          <div class="avatar-camera-mini">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </button>
        <div class="pi-name">{{ fullName || 'Your Profile' }}</div>
        <div class="pi-meta">{{ profile?.email || '' }}</div>
        <div class="pi-completion">
          <span>Profile</span>
          <div class="pic-track">
            <div class="pic-fill" :style="{ width: profileCompletion + '%' }" />
          </div>
          <span class="pic-pct">{{ profileCompletion }}%</span>
        </div>
      </div>

      <!-- Name & contact -->
      <div class="section-heading">Name &amp; contact</div>
      <div class="pi-section">
        <div class="pi-group">
          <button
            v-for="(item, index) in contactDetails"
            :key="item.key"
            class="pi-row"
            type="button"
            @click="openContactEditor(index)"
          >
            <div class="pir-content">
              <div class="pir-label">{{ item.label }}</div>
              <div class="pir-value" :class="{ empty: !item.value }">
                {{ item.value || `Add ${item.label.toLowerCase()}` }}
              </div>
            </div>
            <div class="pir-edit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </div>
          </button>

          <div class="pi-row">
            <div class="pir-content">
              <div class="pir-label">Contact visibility</div>
              <div class="pir-hint">
                Sellers see your details only when you message them
              </div>
            </div>
            <button
              type="button"
              class="pir-toggle"
              :class="{ on: contactVisible }"
              @click="toggleContactVisible"
              :aria-label="
                contactVisible
                  ? 'Disable contact visibility'
                  : 'Enable contact visibility'
              "
            />
          </div>
        </div>
      </div>

      <!-- Address -->
      <div class="section-heading">
        Address
        <span class="sh-action" @click="openAddressEditor(null)">+ Add</span>
      </div>
      <div class="pi-section">
        <div v-if="(profile?.addresses ?? []).length === 0" class="pi-group">
          <button class="pi-row" type="button" @click="openAddressEditor(null)">
            <div class="pir-content">
              <div class="pir-label">Current address</div>
              <div class="pir-value empty">Add your address</div>
            </div>
            <div class="pir-edit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </button>
        </div>

        <div v-else class="pi-group">
          <div
            v-for="addr in profile?.addresses ?? []"
            :key="addr.id"
            class="pi-row"
          >
            <div class="pir-content">
              <div class="pir-label">{{ addr.label || 'Address' }}</div>
              <div class="pir-value">{{ formatAddress(addr) }}</div>
            </div>
            <button
              class="pir-edit"
              type="button"
              aria-label="Edit address"
              @click="openAddressEditor(addr)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <button
              class="pir-edit pir-delete"
              type="button"
              aria-label="Delete address"
              @click="handleDeleteAddress(addr.id)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Company -->
      <div class="section-heading">
        Company
        <span class="sh-action" @click="openCompanyEditor(null)">+ Add</span>
      </div>
      <div class="pi-section">
        <div v-if="(profile?.companies ?? []).length === 0" class="pi-group">
          <button class="pi-row" type="button" @click="openCompanyEditor(null)">
            <div class="pir-content">
              <div class="pir-label">Registered company</div>
              <div class="pir-value empty">Add company details</div>
            </div>
            <div class="pir-edit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </button>
        </div>

        <div v-else class="pi-group">
          <div
            v-for="company in profile?.companies ?? []"
            :key="company.id"
            class="pi-row"
          >
            <div class="pir-content">
              <div class="pir-label">{{ company.name }}</div>
              <div v-if="company.address" class="pir-value">
                {{ company.address }}
              </div>
              <div
                v-if="company.companyNumber || company.director"
                class="pir-hint"
              >
                <span v-if="company.companyNumber"
                  >No. {{ company.companyNumber }}</span
                >
                <span v-if="company.companyNumber && company.director">
                  ·
                </span>
                <span v-if="company.director">{{ company.director }}</span>
              </div>
            </div>
            <button
              class="pir-edit"
              type="button"
              aria-label="Edit company"
              @click="openCompanyEditor(company)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <button
              class="pir-edit pir-delete"
              type="button"
              aria-label="Delete company"
              @click="handleDeleteCompany(company.id)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Solicitor -->
      <div class="section-heading">
        Solicitor
        <span class="sh-action" @click="openSolicitorEditor(null)">+ Add</span>
      </div>
      <div class="pi-section">
        <div v-if="(profile?.solicitors ?? []).length === 0" class="pi-group">
          <button
            class="pi-row"
            type="button"
            @click="openSolicitorEditor(null)"
          >
            <div class="pir-content">
              <div class="pir-label">Solicitor</div>
              <div class="pir-value empty">Add your solicitor</div>
            </div>
            <div class="pir-edit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </button>
        </div>

        <div v-else class="pi-group">
          <div
            v-for="sol in profile?.solicitors ?? []"
            :key="sol.id"
            class="pi-row"
          >
            <div class="pir-content">
              <div class="pir-label">{{ sol.name }}</div>
              <div v-if="sol.contactName || sol.email" class="pir-value">
                <span v-if="sol.contactName">{{ sol.contactName }}</span>
                <span v-if="sol.contactName && sol.email"> · </span>
                <span v-if="sol.email">{{ sol.email }}</span>
              </div>
              <div v-if="sol.phone || sol.reference" class="pir-hint">
                <span v-if="sol.phone">{{ sol.phone }}</span>
                <span v-if="sol.phone && sol.reference"> · </span>
                <span v-if="sol.reference">Ref {{ sol.reference }}</span>
              </div>
            </div>
            <button
              class="pir-edit"
              type="button"
              aria-label="Edit solicitor"
              @click="openSolicitorEditor(sol)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <button
              class="pir-edit pir-delete"
              type="button"
              aria-label="Delete solicitor"
              @click="handleDeleteSolicitor(sol.id)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Communication preferences -->
      <div class="section-heading">Communication preferences</div>
      <div class="pi-section">
        <div class="pi-group">
          <div
            v-for="item in communicationPreferences"
            :key="item.key"
            class="pi-row"
          >
            <div class="pir-content">
              <div class="pir-label">{{ item.label }}</div>
              <div class="pir-hint">{{ item.hint }}</div>
            </div>
            <button
              type="button"
              class="pir-toggle"
              :class="{ on: item.value }"
              :aria-label="item.label"
              @click="toggleCommsPreference(item.key)"
            />
          </div>
        </div>
      </div>

      <!-- Identity verification -->
      <div class="section-heading">Identity verification</div>
      <div class="pi-section">
        <div class="pi-group">
          <div class="pi-row" :class="{ 'verified-row': profile?.isVerified }">
            <div v-if="profile?.isVerified" class="pir-verified-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div class="pir-content">
              <div
                class="pir-label"
                :class="{ 'verified-label': profile?.isVerified }"
              >
                {{ profile?.isVerified ? 'Verified' : 'Not verified yet' }}
              </div>
              <div class="pir-value" :class="{ empty: !profile?.isVerified }">
                {{
                  profile?.isVerified
                    ? 'By Onfido · verified profile'
                    : 'Complete ID verification to be trusted'
                }}
              </div>
            </div>
            <div class="pir-edit">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Contact Edit Drawer -->
    <BaseDrawer
      v-model="isContactDrawerOpen"
      :title="`Change ${contactEditLabel}`"
      :show-back-button="false"
    >
      <div class="pt-1 pb-2">
        <p class="text-[15px] leading-[24px] text-[#7f8084]">
          The changes will reflect immediately.
        </p>
        <div
          v-if="contactDetails[activeContactIndex]?.key === 'phone'"
          class="mt-6"
        >
          <PhoneInput v-model="contactEditValue" />
          <p class="mt-2 text-[13px] text-[#8e8e93]">
            Select your country code, then enter your number without the leading
            0.
          </p>
        </div>
        <label v-else class="mt-6 block">
          <div
            class="h-16 rounded-[20px] border border-[#e2e2e7] bg-[#f4f4f5] flex items-center gap-3 px-5"
          >
            <Icon
              name="i-heroicons-pencil-square"
              class="w-5 h-5 text-[#b3b3b7]"
            />
            <input
              v-model="contactEditValue"
              :type="contactEditInputType"
              :placeholder="`Enter new ${contactEditLabel}`"
              class="w-full bg-transparent outline-none text-[16px] leading-[22px] text-[#1f2024] placeholder:text-[#8e8e93]"
            />
          </div>
        </label>
      </div>
      <template #footer>
        <button
          type="button"
          class="drawer-cta"
          :disabled="saving"
          @click="saveContactEdit"
        >
          <Icon name="i-heroicons-check" class="w-5 h-5" />
          <span>{{ saving ? 'Saving…' : 'Save Changes' }}</span>
        </button>
      </template>
    </BaseDrawer>

    <!-- Address Edit Drawer -->
    <BaseDrawer
      v-model="isAddressDrawerOpen"
      :title="editingAddress?.id ? 'Edit address' : 'Add address'"
      :show-back-button="false"
    >
      <div class="pt-1 pb-2 space-y-3">
        <div
          v-for="field in addressFields"
          :key="field.key"
          class="h-14 rounded-[16px] border border-[#e8eceb] bg-white flex items-center gap-3 px-4"
        >
          <input
            v-model="editingAddress[field.key]"
            :placeholder="field.label"
            class="w-full bg-transparent outline-none text-[15px] leading-[22px] text-[#0e2840] placeholder:text-[#8a95a0] font-semibold"
          />
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="drawer-cta"
          :disabled="saving"
          @click="saveAddress"
        >
          <Icon name="i-heroicons-check" class="w-5 h-5" />
          <span>{{ saving ? 'Saving…' : 'Save address' }}</span>
        </button>
      </template>
    </BaseDrawer>

    <!-- Company Edit Drawer -->
    <BaseDrawer
      v-model="isCompanyDrawerOpen"
      :title="editingCompany?.id ? 'Edit company' : 'Add company'"
      :show-back-button="false"
    >
      <div class="pt-1 pb-2 space-y-3">
        <div
          v-for="field in companyFields"
          :key="field.key"
          class="h-14 rounded-[16px] border border-[#e8eceb] bg-white flex items-center gap-3 px-4"
        >
          <input
            v-model="editingCompany[field.key]"
            :placeholder="field.label"
            class="w-full bg-transparent outline-none text-[15px] leading-[22px] text-[#0e2840] placeholder:text-[#8a95a0] font-semibold"
          />
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="drawer-cta"
          :disabled="saving"
          @click="saveCompany"
        >
          <Icon name="i-heroicons-check" class="w-5 h-5" />
          <span>{{ saving ? 'Saving…' : 'Save company' }}</span>
        </button>
      </template>
    </BaseDrawer>

    <!-- Avatar Edit Drawer -->
    <BaseDrawer
      v-model="isAvatarDrawerOpen"
      title="Edit profile picture"
      :show-back-button="false"
    >
      <p class="text-[15px] leading-[24px] text-[#7f8084] mb-6">
        The changes will reflect immediately.
      </p>
      <div v-if="avatarPreview" class="mb-6 flex justify-center">
        <img
          :src="avatarPreview"
          alt="Preview"
          class="w-24 h-24 rounded-full object-cover border-4 border-[#3dbda3]"
        />
      </div>
      <div class="space-y-3">
        <label class="avatar-pick-row">
          <div class="apr-content">
            <Icon name="i-heroicons-camera" class="w-5 h-5 text-[#0e2840]" />
            <span>Take picture</span>
          </div>
          <Icon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-[#8a95a0]"
          />
          <input
            ref="cameraInputRef"
            type="file"
            accept="image/*"
            capture="camera"
            class="sr-only"
            @change="onFileSelected"
          />
        </label>
        <label class="avatar-pick-row">
          <div class="apr-content">
            <Icon name="i-heroicons-photo" class="w-5 h-5 text-[#0e2840]" />
            <span>Upload from gallery</span>
          </div>
          <Icon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-[#8a95a0]"
          />
          <input
            type="file"
            accept="image/*"
            class="sr-only"
            @change="onFileSelected"
          />
        </label>
        <label class="avatar-pick-row">
          <div class="apr-content">
            <Icon
              name="i-heroicons-folder-open"
              class="w-5 h-5 text-[#0e2840]"
            />
            <span>Browse files</span>
          </div>
          <Icon
            name="i-heroicons-chevron-right"
            class="w-4 h-4 text-[#8a95a0]"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="sr-only"
            @change="onFileSelected"
          />
        </label>
      </div>
      <p v-if="avatarError" class="mt-4 text-center text-red-500 text-[13px]">
        {{ avatarError }}
      </p>
      <template #footer>
        <button
          v-if="avatarFile"
          type="button"
          class="drawer-cta"
          :disabled="avatarUploading"
          @click="saveAvatar"
        >
          <Icon name="i-heroicons-check" class="w-5 h-5" />
          <span>{{ avatarUploading ? 'Uploading…' : 'Save picture' }}</span>
        </button>
      </template>
    </BaseDrawer>

    <!-- Solicitor Edit Drawer -->
    <BaseDrawer
      v-model="isSolicitorDrawerOpen"
      :title="editingSolicitor?.id ? 'Edit solicitor' : 'Add solicitor'"
      :show-back-button="false"
    >
      <div class="pt-1 pb-2 space-y-3">
        <div
          v-for="field in solicitorFields"
          :key="field.key"
          class="h-14 rounded-[16px] border border-[#e8eceb] bg-white flex items-center gap-3 px-4"
        >
          <input
            v-model="editingSolicitor[field.key]"
            :placeholder="field.label"
            class="w-full bg-transparent outline-none text-[15px] leading-[22px] text-[#0e2840] placeholder:text-[#8a95a0] font-semibold"
          />
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="drawer-cta"
          :disabled="saving"
          @click="saveSolicitor"
        >
          <Icon name="i-heroicons-check" class="w-5 h-5" />
          <span>{{ saving ? 'Saving…' : 'Save solicitor' }}</span>
        </button>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup>
import BaseDrawer from '@/components/ui/BaseDrawer.vue'
import PhoneInput from '@/components/form/PhoneInput.vue'

definePageMeta({ title: 'Personal Information - UmovingU', middleware: 'auth' })

const {
  profile,
  fullName,
  uploadAvatar,
  fetchProfile,
  updateProfile,
  createAddress,
  updateAddress,
  deleteAddress,
  createCompany,
  updateCompany,
  deleteCompany,
  createSolicitor,
  updateSolicitor,
  deleteSolicitor,
} = useProfile()

onMounted(fetchProfile)

const saving = ref(false)

// ── Avatar ─────────────────────────────────────────────────────
const isAvatarDrawerOpen = ref(false)
const avatarFile = ref(null)
const avatarPreview = ref('')
const avatarUploading = ref(false)
const avatarError = ref('')

const onFileSelected = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarError.value = ''
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatarPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

const saveAvatar = async () => {
  if (!avatarFile.value) return
  avatarUploading.value = true
  avatarError.value = ''
  try {
    await uploadAvatar(avatarFile.value)
    isAvatarDrawerOpen.value = false
    avatarFile.value = null
    avatarPreview.value = ''
  } catch (err) {
    avatarError.value = err?.data?.message || 'Upload failed. Please try again.'
  } finally {
    avatarUploading.value = false
  }
}

// ── Contact ─────────────────────────────────────────────────────
const contactDetails = computed(() => [
  { label: 'Full name', value: fullName.value, key: 'name' },
  { label: 'Email', value: profile.value?.email ?? '', key: 'email' },
  { label: 'Phone', value: profile.value?.phone ?? '', key: 'phone' },
])

const contactVisible = computed(() => profile.value?.contactVisible ?? true)
const toggleContactVisible = async () => {
  if (!profile.value) return
  await updateProfile({ contactVisible: !profile.value.contactVisible })
}

const isContactDrawerOpen = ref(false)
const activeContactIndex = ref(null)
const contactEditValue = ref('')

const contactEditLabel = computed(() => {
  if (activeContactIndex.value === null) return 'Value'
  return contactDetails.value[activeContactIndex.value]?.label ?? 'Value'
})
const contactEditInputType = computed(() => {
  const k = contactDetails.value[activeContactIndex.value ?? -1]?.key
  if (k === 'email') return 'email'
  if (k === 'phone') return 'tel'
  return 'text'
})

const openContactEditor = (index) => {
  activeContactIndex.value = index
  contactEditValue.value = contactDetails.value[index]?.value ?? ''
  isContactDrawerOpen.value = true
}

const saveContactEdit = async () => {
  if (activeContactIndex.value === null) return
  saving.value = true
  try {
    const key = contactDetails.value[activeContactIndex.value]?.key
    if (key === 'name') {
      const parts = contactEditValue.value.trim().split(/\s+/)
      await updateProfile({
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') || undefined,
      })
    } else if (key === 'phone') {
      await updateProfile({ phone: contactEditValue.value })
    }
    isContactDrawerOpen.value = false
  } finally {
    saving.value = false
  }
}

// ── Comms preferences ───────────────────────────────────────────
const communicationPreferences = computed(() => [
  {
    key: 'pushNotifications',
    label: 'In-app push',
    hint: 'Viewing reminders & messages',
    value: profile.value?.pushNotifications ?? true,
  },
  {
    key: 'emailNewsletter',
    label: 'Email newsletter',
    hint: 'Weekly market & saved property updates',
    value: profile.value?.emailNewsletter ?? true,
  },
  {
    key: 'smsNotifications',
    label: 'SMS',
    hint: 'Time-sensitive alerts only',
    value: profile.value?.smsNotifications ?? false,
  },
])
const toggleCommsPreference = async (key) => {
  if (!profile.value) return
  await updateProfile({ [key]: !profile.value[key] })
}

// ── Address ─────────────────────────────────────────────────────
const isAddressDrawerOpen = ref(false)
const editingAddress = ref({})
const addressFields = [
  { key: 'label', label: 'Label (e.g. Current address)' },
  { key: 'line1', label: 'Address line 1' },
  { key: 'line2', label: 'Address line 2 (optional)' },
  { key: 'city', label: 'City' },
  { key: 'county', label: 'County' },
  { key: 'postcode', label: 'Postcode' },
]

const formatAddress = (a) =>
  [a.line1, a.line2, a.city, a.county, a.postcode].filter(Boolean).join(', ')

const openAddressEditor = (addr) => {
  editingAddress.value = addr
    ? { ...addr }
    : { label: '', line1: '', postcode: '' }
  isAddressDrawerOpen.value = true
}

const saveAddress = async () => {
  saving.value = true
  try {
    if (editingAddress.value.id)
      await updateAddress(editingAddress.value.id, editingAddress.value)
    else await createAddress(editingAddress.value)
    isAddressDrawerOpen.value = false
  } finally {
    saving.value = false
  }
}
const handleDeleteAddress = async (id) => {
  await deleteAddress(id)
}

// ── Company ─────────────────────────────────────────────────────
const isCompanyDrawerOpen = ref(false)
const editingCompany = ref({})
const companyFields = [
  { key: 'name', label: 'Company name' },
  { key: 'address', label: 'Address' },
  { key: 'companyNumber', label: 'Company number' },
  { key: 'director', label: 'Director' },
]

const openCompanyEditor = (c) => {
  editingCompany.value = c ? { ...c } : { name: '' }
  isCompanyDrawerOpen.value = true
}
const saveCompany = async () => {
  saving.value = true
  try {
    if (editingCompany.value.id)
      await updateCompany(editingCompany.value.id, editingCompany.value)
    else await createCompany(editingCompany.value)
    isCompanyDrawerOpen.value = false
  } finally {
    saving.value = false
  }
}
const handleDeleteCompany = async (id) => {
  await deleteCompany(id)
}

// ── Solicitor ───────────────────────────────────────────────────
const isSolicitorDrawerOpen = ref(false)
const editingSolicitor = ref({})
const solicitorFields = [
  { key: 'name', label: 'Firm name' },
  { key: 'address', label: 'Address' },
  { key: 'contactName', label: 'Contact name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'reference', label: 'Reference' },
]

const openSolicitorEditor = (s) => {
  editingSolicitor.value = s ? { ...s } : { name: '' }
  isSolicitorDrawerOpen.value = true
}
const saveSolicitor = async () => {
  saving.value = true
  try {
    if (editingSolicitor.value.id)
      await updateSolicitor(editingSolicitor.value.id, editingSolicitor.value)
    else await createSolicitor(editingSolicitor.value)
    isSolicitorDrawerOpen.value = false
  } finally {
    saving.value = false
  }
}
const handleDeleteSolicitor = async (id) => {
  await deleteSolicitor(id)
}

// ── Hero ────────────────────────────────────────────────────────
const initials = computed(() => {
  const f = profile.value?.firstName?.[0] ?? ''
  const l = profile.value?.lastName?.[0] ?? ''
  return (
    (f + l).toUpperCase() || (profile.value?.email?.[0] ?? '?').toUpperCase()
  )
})
const profileCompletion = computed(() => {
  const checks = [
    profile.value?.firstName,
    profile.value?.lastName,
    profile.value?.email,
    profile.value?.phone,
    profile.value?.addresses?.length,
    profile.value?.companies?.length,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
})

const goBack = useGoBack('/profile')
</script>

<style scoped>
.pi-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-muted: #6f8199;
  --fx-panel-border: rgba(193, 215, 237, 0.72);
  min-height: 100dvh;
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 34px;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pi-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.pi-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  box-shadow:
    0 8px 22px rgba(19, 48, 71, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow:
    0 12px 24px rgba(19, 48, 71, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.pi-nav-icon-btn svg {
  width: 18px;
  height: 18px;
}
.pi-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.pi-body {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 14px;
}
.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-warm {
  background:
    radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

/* Hero */
.pi-hero {
  margin-top: 8px;
  border-radius: 28px;
  padding: 24px 18px 20px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
  text-align: center;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-hero::before {
  content: '';
  position: absolute;
  inset: -145% auto auto -40%;
  width: 54%;
  height: 320%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 46%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-130%) rotate(16deg);
  transition: transform 0.78s ease;
  pointer-events: none;
}
.pi-hero:hover {
  transform: translateY(-4px);
  border-color: rgba(172, 203, 233, 0.7);
  box-shadow:
    0 20px 44px rgba(18, 55, 88, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.pi-hero:hover::before {
  transform: translateX(220%) rotate(16deg);
}
.pi-avatar {
  width: 94px;
  height: 94px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 750;
  letter-spacing: 1px;
  box-shadow:
    0 10px 22px rgba(48, 98, 214, 0.24),
    inset 0 0 0 3px rgba(255, 255, 255, 0.08);
  margin-bottom: 14px;
  position: relative;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-avatar:hover {
  transform: translateY(-2px);
  box-shadow:
    0 14px 26px rgba(48, 98, 214, 0.3),
    inset 0 0 0 3px rgba(255, 255, 255, 0.1);
}
.pi-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.avatar-camera-mini {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  border: 2.5px solid #f4fbff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-camera-mini svg {
  width: 12px;
  height: 12px;
}
.pi-name {
  margin-top: 2px;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 31px;
  line-height: 1.08;
  letter-spacing: -0.85px;
  font-weight: 750;
  color: #10263d;
  margin-bottom: 4px;
}
.pi-meta {
  font-size: 14px;
  color: #50637a;
  font-weight: 600;
  margin-bottom: 14px;
}
.pi-completion {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
  border-radius: 100px;
  padding: 8px 14px 8px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #047b75;
}
.pic-track {
  width: 76px;
  height: 6px;
  background: rgba(131, 228, 213, 0.35);
  border-radius: 100px;
  overflow: hidden;
  flex-shrink: 0;
}
.pic-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--fx-aqua), var(--fx-blue));
  border-radius: 100px;
  transition: width 0.3s ease;
}
.pic-pct {
  color: #067a74;
  font-weight: 800;
}

/* Section heading */
.section-heading {
  margin-top: 16px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  padding: 0 4px 10px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sh-action {
  margin-left: auto;
  font-size: 12px;
  font-weight: 800;
  color: #067a74;
  cursor: pointer;
  letter-spacing: 0;
  text-transform: none;
}

/* Section / group / row */
.pi-section {
  padding: 0;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}
.pi-group {
  border-radius: 22px;
  border: 1px solid var(--fx-panel-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.94) 100%);
  box-shadow: 0 10px 26px rgba(15, 44, 76, 0.08);
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.pi-group:hover {
  transform: translateY(-2px);
  border-color: #bdd6ea;
  box-shadow: 0 16px 32px rgba(15, 44, 76, 0.11);
}
.pi-row {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(216, 230, 244, 0.72);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  color: inherit;
}
.pi-row:last-child {
  border-bottom: none;
}
.pi-row:hover {
  background: rgba(245, 250, 255, 0.78);
}
.pi-row.verified-row {
  background: linear-gradient(90deg, rgba(234, 254, 249, 0.96), rgba(245, 251, 255, 0.2));
  cursor: default;
}
.pi-row.verified-row:hover {
  background: linear-gradient(90deg, rgba(234, 254, 249, 0.96), rgba(245, 251, 255, 0.2));
}

.pir-content {
  flex: 1;
  min-width: 0;
}
.pir-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
  text-transform: uppercase;
  color: #7f91a8;
  margin-bottom: 2px;
}
.pir-label.verified-label {
  color: #067a74;
}
.pir-value {
  font-size: 14px;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.2px;
  line-height: 1.35;
  word-break: break-word;
}
.pir-value.empty {
  color: #067a74;
  font-weight: 700;
}
.pir-hint {
  font-size: 12.5px;
  color: #627891;
  font-weight: 600;
  margin-top: 2px;
  line-height: 1.35;
}

.pir-edit {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: none;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  font-family: inherit;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}
.pir-edit:hover {
  transform: translateY(-1px);
  background: rgba(205, 240, 232, 0.96);
}
.pir-edit svg {
  width: 15px;
  height: 15px;
}
.pir-delete {
  background: #fff1ef;
  color: #c35a47;
}
.pir-delete:hover {
  background: #ffe2dc;
}

.pir-toggle {
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: #dce8f2;
  border: none;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.pir-toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s;
}
.pir-toggle.on {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
}
.pir-toggle.on::after {
  transform: translateX(20px);
}

.pir-verified-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pir-verified-icon svg {
  width: 17px;
  height: 17px;
}

/* Drawer CTA */
.drawer-cta {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.2px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}
.drawer-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-pick-row {
  width: 100%;
  height: 64px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-radius: 16px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.avatar-pick-row:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.apr-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 700;
  color: #17314a;
  letter-spacing: -0.2px;
}

@media (min-width: 768px) {
  .pi-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .pi-body {
    padding: 0 18px;
  }

  .pi-hero {
    padding: 28px 24px 24px;
  }

  .pi-name {
    font-size: 34px;
  }

  .pi-section {
    margin-bottom: 8px;
  }

  .pi-row {
    padding: 15px 18px;
  }

  .pir-value {
    font-size: 14.5px;
  }
}

@media (max-width: 430px) {
  .pi-nav-title {
    font-size: 18px;
  }

  .pi-name {
    font-size: 28px;
  }

  .pi-meta {
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pi-nav-icon-btn,
  .pi-hero,
  .pi-avatar,
  .pi-group,
  .pir-edit,
  .drawer-cta,
  .avatar-pick-row {
    transition: none;
    animation: none;
  }

  .pi-hero::before {
    display: none;
  }
}
</style>
