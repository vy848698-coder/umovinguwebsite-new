
<template>
  <div class="pi-shell">
    <BuyerProfileNav back-label="Back" @back="goBack" />

    <main class="pi-body">
        <!-- Welcome hero banner -->
        <section class="pi-welcome">
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
              <Icon name="heroicons:camera-solid" class="avatar-camera-svg" />
            </div>
          </button>

          <div class="pi-welcome-text">
            <div class="pi-welcome-greet">Welcome back, {{ firstNameDisplay }}! <span class="pi-wave">👋</span></div>
            <h1 class="pi-welcome-title">Your Profile</h1>
            <p class="pi-welcome-sub">Manage your details, preferences and stay in control of your journey.</p>
          </div>

          <div class="pi-welcome-prog" aria-hidden="false">
            <div class="pi-wp-label">Profile completion</div>
            <div class="pi-wp-pct">{{ profileCompletion }}%</div>
            <div class="pic-track">
              <div class="pic-fill" :style="{ width: profileCompletion + '%' }" />
            </div>
            <p class="pi-wp-hint">Almost there! Complete a few more steps to get the most out of UmovingU.</p>
          </div>

          <div class="pi-welcome-cta">
            <div class="pi-wc-head">
              <Icon name="heroicons:sparkles-solid" class="pi-wc-gem" />
              <span>Complete your profile</span>
            </div>
            <p class="pi-wc-sub">Add a few more details to personalise your experience.</p>
            <button type="button" class="pi-wc-btn" @click="openContactEditor(0)">
              Continue setup <Icon name="heroicons:arrow-right" class="pi-wc-btn-ic" />
            </button>
          </div>
        </section>

        <!-- Top grid: Personal Info · Property Journey · Identity -->
        <div class="pi-grid">
          <!-- Personal Information card -->
          <section class="pi-card">
            <div class="pi-card-head">
              <div class="pi-card-titlewrap">
                <span class="pi-card-ic ic-blue"><Icon name="heroicons:user" /></span>
                <h2 class="pi-card-title">Personal Information</h2>
              </div>
            </div>

            <div class="pi-fieldlist">
              <button
                v-for="(item, index) in contactDetails"
                :key="item.key"
                class="pi-field"
                type="button"
                @click="openContactEditor(index)"
              >
                <span class="pi-field-ic"><Icon :name="contactIcons[item.key]" /></span>
                <span class="pi-field-body">
                  <span class="pi-field-label">{{ item.label }}</span>
                  <span class="pi-field-value" :class="{ empty: !item.value }">
                    {{ item.value || `Add ${item.label.toLowerCase()}` }}
                  </span>
                </span>
                <Icon name="heroicons:pencil-square" class="pi-field-edit" />
              </button>
            </div>

            <div class="pi-card-note">
              <Icon name="heroicons:lock-closed" class="pi-card-note-ic" />
              Your personal information is secure and private.
            </div>
          </section>

          <!-- Property Journey card -->
          <section class="pi-card">
            <div class="pi-card-head">
              <div class="pi-card-titlewrap">
                <span class="pi-card-ic ic-aqua"><Icon name="heroicons:home-modern" /></span>
                <h2 class="pi-card-title">Property Journey</h2>
              </div>
              <button type="button" class="pi-card-action" @click="openAddressEditor(null)">
                <Icon name="heroicons:pencil-square" class="pi-card-action-ic" />Edit
              </button>
            </div>

            <div class="pi-journeylist">
              <button class="pi-journey" type="button" @click="openAddressEditor((profile?.addresses ?? [])[0] ?? null)">
                <span class="pi-journey-ic ic-aqua"><Icon name="heroicons:map-pin" /></span>
                <span class="pi-journey-body">
                  <span class="pi-journey-label">Current address</span>
                  <span class="pi-journey-value" :class="{ empty: !(profile?.addresses ?? []).length }">
                    {{ (profile?.addresses ?? []).length ? formatAddress(profile.addresses[0]) : 'Not added yet' }}
                  </span>
                </span>
                <span class="pi-journey-pill" :class="(profile?.addresses ?? []).length ? 'added' : 'todo'">
                  {{ (profile?.addresses ?? []).length ? 'Added ✓' : 'Add' }}
                </span>
              </button>

              <button class="pi-journey" type="button" @click="openCompanyEditor((profile?.companies ?? [])[0] ?? null)">
                <span class="pi-journey-ic ic-indigo"><Icon name="heroicons:building-office-2" /></span>
                <span class="pi-journey-body">
                  <span class="pi-journey-label">Registered company</span>
                  <span class="pi-journey-value" :class="{ empty: !(profile?.companies ?? []).length }">
                    {{ (profile?.companies ?? []).length ? profile.companies[0].name : 'Not added yet' }}
                  </span>
                </span>
                <span class="pi-journey-pill" :class="(profile?.companies ?? []).length ? 'added' : 'todo'">
                  {{ (profile?.companies ?? []).length ? 'Added ✓' : 'Add' }}
                </span>
              </button>

              <button class="pi-journey" type="button" @click="openSolicitorEditor((profile?.solicitors ?? [])[0] ?? null)">
                <span class="pi-journey-ic ic-blue"><Icon name="heroicons:scale" /></span>
                <span class="pi-journey-body">
                  <span class="pi-journey-label">Solicitor</span>
                  <span class="pi-journey-value" :class="{ empty: !(profile?.solicitors ?? []).length }">
                    {{ (profile?.solicitors ?? []).length ? profile.solicitors[0].name : 'Not added yet' }}
                  </span>
                </span>
                <span class="pi-journey-pill" :class="(profile?.solicitors ?? []).length ? 'added' : 'todo'">
                  {{ (profile?.solicitors ?? []).length ? 'Added ✓' : 'Add' }}
                </span>
              </button>
            </div>

            <div class="pi-card-note tip">
              <Icon name="heroicons:light-bulb" class="pi-card-note-ic" />
              Add these details for a smoother experience.
            </div>
          </section>

          <!-- Identity Verification card -->
          <section class="pi-card pi-card-verify">
            <div class="pi-card-head">
              <div class="pi-card-titlewrap">
                <span class="pi-card-ic ic-green"><Icon name="heroicons:shield-check" /></span>
                <h2 class="pi-card-title">Identity Verification</h2>
              </div>
              <button type="button" class="pi-card-action" @click="navigateTo('/profile/support')">
                Learn more<Icon name="heroicons:arrow-top-right-on-square" class="pi-card-action-ic" />
              </button>
            </div>

            <div class="pi-verify-body">
              <div class="pi-verify-badge" :class="{ done: profile?.isVerified }">
                <Icon name="heroicons:shield-check-solid" class="pi-verify-badge-ic" />
              </div>
              <div class="pi-verify-title">
                {{ profile?.isVerified ? 'Verified' : 'Not verified yet' }}
              </div>
              <p class="pi-verify-sub">
                {{ profile?.isVerified
                  ? 'Your identity has been verified by Onfido.'
                  : 'Verify your identity to build trust and unlock all platform features.' }}
              </p>
              <button type="button" class="pi-verify-btn" :disabled="profile?.isVerified">
                {{ profile?.isVerified ? 'Verified' : 'Verify identity' }}
                <Icon v-if="!profile?.isVerified" name="heroicons:arrow-right" class="pi-verify-btn-ic" />
              </button>
            </div>
          </section>
        </div>

        <!-- Bottom row: Comms preferences · Profile completion -->
        <div class="pi-grid-2">
          <!-- Communication Preferences -->
          <section class="pi-card">
            <div class="pi-card-head col">
              <div class="pi-card-titlewrap">
                <span class="pi-card-ic ic-blue"><Icon name="heroicons:bell" /></span>
                <h2 class="pi-card-title">Communication Preferences</h2>
              </div>
              <button type="button" class="pi-card-action">
                <Icon name="heroicons:cog-6-tooth" class="pi-card-action-ic" />Edit preferences
              </button>
            </div>
            <p class="pi-card-desc">Choose how you want to receive updates and notifications.</p>

            <div class="pi-prefs">
              <div
                v-for="item in communicationPreferences"
                :key="item.key"
                class="pi-pref"
              >
                <span class="pi-pref-ic"><Icon :name="prefIcons[item.key]" /></span>
                <span class="pi-pref-body">
                  <span class="pi-pref-label">{{ item.label }}</span>
                  <span class="pi-pref-hint">{{ item.hint }}</span>
                </span>
                <button
                  type="button"
                  class="pir-toggle"
                  :class="{ on: item.value }"
                  :aria-label="item.label"
                  @click="toggleCommsPreference(item.key)"
                />
              </div>
            </div>
          </section>

          <!-- Profile Completion checklist -->
          <section class="pi-card">
            <div class="pi-card-head">
              <div class="pi-card-titlewrap">
                <span class="pi-card-ic ic-aqua"><Icon name="heroicons:check-circle" /></span>
                <div>
                  <h2 class="pi-card-title">Profile Completion</h2>
                  <p class="pi-card-desc tight">Complete these steps to finish your profile.</p>
                </div>
              </div>
            </div>

            <div class="pi-completion-row">
              <div class="pi-checklist">
                <div
                  v-for="step in completionSteps"
                  :key="step.label"
                  class="pi-check"
                  :class="{ done: step.done }"
                >
                  <Icon :name="step.icon" class="pi-check-ic" />
                  <span class="pi-check-label">{{ step.label }}</span>
                  <span class="pi-check-state" :class="step.done ? 'ok' : 'pending'">
                    <Icon v-if="step.done" name="heroicons:check-16-solid" />
                    <template v-else>Pending</template>
                  </span>
                </div>
              </div>

              <div class="pi-ring-wrap">
                <div class="pi-ring" :style="ringStyle">
                  <div class="pi-ring-inner">
                    <span class="pi-ring-pct">{{ profileCompletion }}%</span>
                    <span class="pi-ring-cap">Completed</span>
                  </div>
                </div>
                <div class="pi-ring-note">
                  <Icon name="heroicons:sparkles-solid" class="pi-ring-note-ic" />
                  Great progress! You're just a few steps away.
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="pi-footnote">
          <Icon name="heroicons:lock-closed" class="pi-footnote-ic" />
          Your data is encrypted and never shared with third parties.
        </div>
    </main>

    <SiteFooter />

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
import BuyerProfileNav from '~/components/buyer-profile/BuyerProfileNav.vue'
import SiteFooter from '~/components/homescore/SiteFooter.vue'
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

const contactIcons = {
  name: 'heroicons:user',
  email: 'heroicons:envelope',
  phone: 'heroicons:phone',
}
const prefIcons = {
  pushNotifications: 'heroicons:device-phone-mobile',
  emailNewsletter: 'heroicons:envelope',
  smsNotifications: 'heroicons:chat-bubble-oval-left',
}

const firstNameDisplay = computed(
  () => profile.value?.firstName || fullName.value?.split(' ')[0] || 'there',
)

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
    label: 'SMS alerts',
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

const completionSteps = computed(() => [
  { label: 'Add full name', icon: 'heroicons:pencil', done: !!profile.value?.firstName },
  { label: 'Add email address', icon: 'heroicons:envelope', done: !!profile.value?.email },
  { label: 'Add phone number', icon: 'heroicons:phone', done: !!profile.value?.phone },
  { label: 'Add current address', icon: 'heroicons:map-pin', done: !!profile.value?.addresses?.length },
  { label: 'Add company details', icon: 'heroicons:building-office-2', done: !!profile.value?.companies?.length },
  { label: 'Add solicitor', icon: 'heroicons:scale', done: !!profile.value?.solicitors?.length },
  { label: 'Verify your identity', icon: 'heroicons:shield-check', done: !!profile.value?.isVerified },
])

const ringStyle = computed(() => ({
  background: `conic-gradient(#00a19a ${profileCompletion.value * 3.6}deg, #e6eef2 0deg)`,
}))

const goBack = useGoBack('/profile')
</script>

<style scoped>
.pi-shell {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  --fx-muted: #6f8199;
  min-height: 100dvh;
  background: #f3f2ef;
  color: var(--fx-text);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* match landing-page cream navbar on this page */
.pi-shell :deep(.bpnav) {
  background: rgba(243, 242, 239, 0.88);
  border-bottom: 1px solid rgba(40, 95, 150, 0.08);
}

/* Body */
.pi-body { width: min(1280px, calc(100% - 64px)); margin: 0 auto; padding: 32px 0 70px; }

/* ── Welcome hero banner ───────────────────────────────────────── */
.pi-welcome {
  display: grid;
  grid-template-columns: auto 1.4fr 1fr 1fr;
  align-items: center;
  gap: 28px;
  border-radius: 24px;
  padding: 26px 30px;
  margin-bottom: 26px;
  background: linear-gradient(120deg, #e8f7f2 0%, #eef3ff 55%, #f1ecfe 100%);
  border: 1px solid #e6eef8;
  box-shadow: 0 14px 38px rgba(15, 44, 76, 0.06);
}
.pi-welcome-greet { font-size: 15px; font-weight: 700; color: #2a4055; margin-bottom: 2px; }
.pi-wave { display: inline-block; }
.pi-welcome-title { font-size: 32px; font-weight: 800; letter-spacing: -1px; color: #231d45; line-height: 1.1; margin-bottom: 6px; }
.pi-welcome-sub { font-size: 14px; color: #5f7488; line-height: 1.5; max-width: 320px; }
.pi-welcome-prog { min-width: 0; }
.pi-wp-label { font-size: 12.5px; font-weight: 700; color: #5f7488; margin-bottom: 4px; }
.pi-wp-pct { font-size: 30px; font-weight: 800; color: #00a19a; letter-spacing: -0.5px; line-height: 1; margin-bottom: 10px; }
.pi-wp-hint { font-size: 12px; color: #6f8398; line-height: 1.5; margin-top: 8px; }
.pi-welcome-cta {
  border-radius: 18px;
  background: linear-gradient(145deg, #1b1b4b 0%, #14143a 55%, #191641 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 18px 20px; box-shadow: 0 16px 34px rgba(17, 18, 56, 0.32);
}
.pi-wc-head { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; }
.pi-wc-gem { width: 18px; height: 18px; color: #a99bff; }
.pi-wc-sub { font-size: 12.5px; color: #c3c8e6; line-height: 1.45; margin-bottom: 14px; }
.pi-wc-btn {
  width: 100%; height: 44px; border-radius: 12px; border: none; cursor: pointer;
  background: linear-gradient(120deg, #00a99a 0%, #0c8f74 100%); color: #fff;
  font-family: inherit; font-size: 13.5px; font-weight: 800;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.32); transition: transform 0.2s, box-shadow 0.2s;
}
.pi-wc-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(0, 161, 154, 0.4); }
.pi-wc-btn-ic { width: 15px; height: 15px; }

/* ── Card grids ────────────────────────────────────────────────── */
.pi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-bottom: 22px; }
.pi-grid-2 { display: grid; grid-template-columns: 1fr 1.25fr; gap: 22px; margin-bottom: 24px; }

.pi-card {
  border-radius: 20px; background: #fff; border: 1px solid #e8eef5;
  box-shadow: 0 10px 30px rgba(15, 44, 76, 0.05); padding: 22px 22px 18px;
  display: flex; flex-direction: column;
}
.pi-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.pi-card-head.col { flex-wrap: wrap; }
.pi-card-titlewrap { display: flex; align-items: center; gap: 11px; min-width: 0; }
.pi-card-ic { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pi-card-ic :deep(svg) { width: 20px; height: 20px; }
.ic-blue { background: #eaf0ff; color: #5b6ef0; }
.ic-aqua { background: #e3f5f1; color: #00a19a; }
.ic-green { background: #e3f5ec; color: #18a558; }
.ic-indigo { background: #efeafe; color: #7c5cf0; }
.pi-card-title { font-size: 16px; font-weight: 800; color: #231d45; letter-spacing: -0.3px; }
.pi-card-action {
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
  font-family: inherit; font-size: 12.5px; font-weight: 700; color: #41566b;
  background: #fff; border: 1px solid #e2e8f1; border-radius: 9px; padding: 6px 11px; cursor: pointer;
  transition: border-color 0.16s, color 0.16s;
}
.pi-card-action:hover { border-color: #b9d5ea; color: #231d45; }
.pi-card-action-ic { width: 14px; height: 14px; }
.pi-card-desc { font-size: 13px; color: #6f8398; line-height: 1.45; margin-bottom: 14px; }
.pi-card-desc.tight { margin: 2px 0 0; }

/* Field list (personal info) */
.pi-fieldlist { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.pi-field {
  display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
  background: #f9fbfe; border: 1px solid #eef3f9; border-radius: 14px; padding: 11px 13px;
  cursor: pointer; font-family: inherit; transition: border-color 0.16s, background 0.16s;
}
.pi-field:hover { border-color: #cfe0f1; background: #f4f9ff; }
.pi-field-ic { width: 34px; height: 34px; border-radius: 10px; background: #eaf0ff; color: #5b6ef0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pi-field-ic :deep(svg) { width: 17px; height: 17px; }
.pi-field-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.pi-field-label { font-size: 11px; font-weight: 700; color: #8195aa; }
.pi-field-value { font-size: 14px; font-weight: 700; color: #16314a; word-break: break-word; }
.pi-field-value.empty { color: #00a19a; }
.pi-field-edit { width: 16px; height: 16px; color: #9fb0c2; flex-shrink: 0; }

.pi-card-note {
  display: flex; align-items: center; gap: 8px; margin-top: 14px;
  font-size: 12px; font-weight: 600; color: #2f7d6f; background: #e9f6f1;
  border-radius: 11px; padding: 9px 12px;
}
.pi-card-note.tip { color: #8a6d1f; background: #fdf6e3; }
.pi-card-note-ic { width: 15px; height: 15px; flex-shrink: 0; }

/* Property journey */
.pi-journeylist { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.pi-journey {
  display: flex; align-items: center; gap: 12px; width: 100%; text-align: left;
  background: #f9fbfe; border: 1px solid #eef3f9; border-radius: 14px; padding: 11px 13px;
  cursor: pointer; font-family: inherit; transition: border-color 0.16s, background 0.16s;
}
.pi-journey:hover { border-color: #cfe0f1; background: #f4f9ff; }
.pi-journey-ic { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pi-journey-ic :deep(svg) { width: 17px; height: 17px; }
.pi-journey-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.pi-journey-label { font-size: 13.5px; font-weight: 800; color: #16314a; }
.pi-journey-value { font-size: 12.5px; font-weight: 600; color: #5f7488; word-break: break-word; }
.pi-journey-value.empty { color: #93a3b5; }
.pi-journey-pill { flex-shrink: 0; font-size: 11px; font-weight: 800; border-radius: 100px; padding: 4px 10px; }
.pi-journey-pill.added { color: #18a558; background: #e3f5ec; }
.pi-journey-pill.todo { color: #b07d12; background: #fdf3da; }

/* Identity verification */
.pi-card-verify { text-align: center; }
.pi-verify-body { display: flex; flex-direction: column; align-items: center; flex: 1; justify-content: center; padding: 6px 0; }
.pi-verify-badge { width: 76px; height: 76px; border-radius: 50%; background: #e7f5ee; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
.pi-verify-badge-ic { width: 38px; height: 38px; color: #18a558; }
.pi-verify-badge.done { background: #d8f3e3; }
.pi-verify-title { font-size: 17px; font-weight: 800; color: #231d45; margin-bottom: 6px; }
.pi-verify-sub { font-size: 12.5px; color: #6f8398; line-height: 1.5; max-width: 240px; margin-bottom: 16px; }
.pi-verify-btn {
  width: 100%; height: 46px; border-radius: 12px; border: none; cursor: pointer;
  background: linear-gradient(120deg, #00a99a, #0c8f74); color: #fff;
  font-family: inherit; font-size: 14px; font-weight: 800;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26); transition: transform 0.2s, box-shadow 0.2s;
}
.pi-verify-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(0, 161, 154, 0.32); }
.pi-verify-btn:disabled { opacity: 0.6; cursor: default; }
.pi-verify-btn-ic { width: 15px; height: 15px; }

/* Comms preferences */
.pi-prefs { display: flex; flex-direction: column; gap: 10px; }
.pi-pref {
  display: flex; align-items: center; gap: 12px;
  background: #f9fbfe; border: 1px solid #eef3f9; border-radius: 14px; padding: 12px 14px;
}
.pi-pref-ic { width: 36px; height: 36px; border-radius: 10px; background: #e3f5f1; color: #00a19a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pi-pref-ic :deep(svg) { width: 18px; height: 18px; }
.pi-pref-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.pi-pref-label { font-size: 14px; font-weight: 800; color: #16314a; }
.pi-pref-hint { font-size: 12px; color: #6f8398; }

/* Profile completion checklist + ring */
.pi-completion-row { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.pi-checklist { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 2px; }
.pi-check { display: flex; align-items: center; gap: 10px; padding: 8px 4px; border-bottom: 1px solid #f0f4f8; }
.pi-check:last-child { border-bottom: none; }
.pi-check-ic { width: 16px; height: 16px; color: #9fb0c2; flex-shrink: 0; }
.pi-check.done .pi-check-ic { color: #00a19a; }
.pi-check-label { flex: 1; font-size: 13px; font-weight: 600; color: #3c5165; }
.pi-check.done .pi-check-label { color: #16314a; }
.pi-check-state { flex-shrink: 0; font-size: 11px; font-weight: 800; }
.pi-check-state.pending { color: #b07d12; background: #fdf3da; border-radius: 100px; padding: 3px 9px; }
.pi-check-state.ok { width: 20px; height: 20px; border-radius: 50%; background: #e3f5ec; color: #18a558; display: inline-flex; align-items: center; justify-content: center; }
.pi-check-state.ok :deep(svg) { width: 13px; height: 13px; }

.pi-ring-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
.pi-ring { width: 150px; height: 150px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.pi-ring-inner { width: 116px; height: 116px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 0 0 1px #eef3f9; }
.pi-ring-pct { font-size: 28px; font-weight: 800; color: #00a19a; letter-spacing: -0.5px; }
.pi-ring-cap { font-size: 12px; font-weight: 700; color: #6f8398; }
.pi-ring-note { display: flex; align-items: flex-start; gap: 7px; max-width: 180px; font-size: 11.5px; font-weight: 600; color: #6c5cf0; background: #f2eefe; border-radius: 11px; padding: 9px 11px; line-height: 1.4; }
.pi-ring-note-ic { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }

.pi-footnote { display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 12.5px; font-weight: 600; color: #8195aa; padding: 8px 0; }
.pi-footnote-ic { width: 15px; height: 15px; }

.pi-avatar {
  width: 96px; height: 96px; border-radius: 50%;
  background: linear-gradient(145deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff; display: inline-flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 800; letter-spacing: 1px;
  box-shadow: 0 10px 22px rgba(48, 98, 214, 0.24);
  position: relative; border: none; cursor: pointer; font-family: inherit; flex-shrink: 0;
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s;
}
.pi-avatar:hover { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(48, 98, 214, 0.3); }
.pi-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.avatar-camera-mini {
  position: absolute; bottom: -1px; right: -1px;
  width: 30px; height: 30px; border-radius: 50%;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  color: #fff; border: 3px solid #fff;
  display: flex; align-items: center; justify-content: center;
}
.avatar-camera-svg { width: 14px; height: 14px; }
.pir-toggle {
  width: 44px;
  height: 24px;
  border-radius: 100px;
  background: #dce8f2;
  border: none;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.22s cubic-bezier(0.22, 1, 0.36, 1);
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
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.pir-toggle.on {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
}
.pir-toggle.on::after {
  transform: translateX(20px);
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

@media (max-width: 1180px) {
  .pi-grid { grid-template-columns: 1fr 1fr; }
  .pi-card-verify { grid-column: 1 / -1; }
}
@media (max-width: 1000px) {
  .pi-body { padding: 28px 0 60px; }
  .pi-welcome { grid-template-columns: auto 1fr; row-gap: 22px; }
  .pi-welcome-prog, .pi-welcome-cta { grid-column: 1 / -1; }
}
@media (max-width: 860px) {
  .pi-grid, .pi-grid-2 { grid-template-columns: 1fr; }
  .pi-card-verify { grid-column: auto; }
}
@media (max-width: 760px) {
  .pi-body { width: calc(100% - 32px); padding: 24px 0 56px; }
  .pi-welcome { padding: 22px; gap: 18px; }
  .pi-welcome-title { font-size: 26px; }
  .pi-avatar { width: 80px; height: 80px; font-size: 27px; }
}
@media (max-width: 560px) {
  .pi-welcome { grid-template-columns: 1fr; text-align: center; justify-items: center; }
  .pi-welcome-sub { margin: 0 auto; }
  .pi-completion-row { justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  .pi-avatar,
  .pi-card,
  .pi-wc-btn,
  .pi-verify-btn,
  .drawer-cta,
  .avatar-pick-row {
    transition: none;
    animation: none;
  }
}
</style>
