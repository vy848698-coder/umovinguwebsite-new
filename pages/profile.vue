<template>
  <NuxtPage v-if="!isProfileRoot" />

  <div v-else class="w-full min-h-screen bg-umu-gradient pb-8">
    <header class="pm-wide flex items-center justify-between gap-2 px-4 pt-5 max-w-7xl mx-auto">
      <button
        type="button"
        class="w-10 h-10 shrink-0 flex items-center justify-center"
        @click="goBack"
      >
        <Icon name="i-heroicons-chevron-left" class="w-6 h-6 text-black" />
      </button>

      <h1 class="min-w-0 truncate text-[24px] leading-[30px] sm:text-[32px] sm:leading-[38px] font-semibold text-black">
        My Profile
      </h1>

      <button
        type="button"
        class="w-8 h-8 shrink-0 rounded-full bg-[#403d91] flex items-center justify-center"
        aria-label="More"
      >
        <Icon
          name="i-heroicons-ellipsis-horizontal"
          class="w-5 h-5 text-white"
        />
      </button>
    </header>

    <main class="pm-wide px-4 sm:px-5 pb-8 max-w-7xl mx-auto">
      <section class="pt-6 text-center">
        <div class="relative w-fit mx-auto">
          <UserAvatar
            :src="profile?.avatarUrl"
            :firstName="profile?.firstName"
            :lastName="profile?.lastName"
            :size="112"
          />
        </div>

        <h2
          class="mt-8 text-[32px] leading-[40px] sm:text-[44px] sm:leading-[52px] font-semibold text-[#101319] break-words"
        >
          {{ fullName || 'Your Profile' }}
        </h2>
        <p class="text-[16px] leading-[22px] sm:text-[20px] sm:leading-[24px] text-[#7f8084] mt-1 break-all">
          {{ profile?.email || '' }}
        </p>

        <button
          v-if="memberSince"
          type="button"
          class="mt-6 h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-brand-aqua text-brand-aqua text-lg sm:text-xl leading-6 font-medium"
        >
          Member since {{ memberSince }}
        </button>
      </section>

      <div class="mt-8 flex gap-3 items-center md:max-w-xl md:mx-auto">
        <div class="flex-1 min-w-0 bg-white rounded-2xl h-14 px-4 flex items-center">
          <Icon
            name="i-heroicons-magnifying-glass"
            class="w-6 h-6 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Preferences"
            class="ml-2 w-full bg-transparent outline-none text-lg placeholder:text-[#8f9094]"
          />
        </div>

        <button
          type="button"
          class="w-14 h-14 shrink-0 rounded-2xl bg-brand-aqua text-white flex items-center justify-center"
          aria-label="Search filters"
        >
          <Icon name="i-heroicons-adjustments-horizontal" class="w-6 h-6" />
        </button>
      </div>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          v-for="item in filteredItems"
          :key="item.title"
          type="button"
          class="w-full bg-[#f6f6f7] rounded-3xl px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 text-left"
          @click="onPreferenceClick(item)"
        >
          <div class="w-7 h-7 shrink-0 flex items-center justify-center text-[#1f2024]">
            <Icon :name="item.icon" class="w-6 h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-[22px] leading-[28px] sm:text-[32px] sm:leading-[38px] font-medium text-[#1f2024]">
              {{ item.title }}
            </p>
            <p class="text-[15px] leading-[20px] sm:text-[20px] sm:leading-[24px] text-[#7f8084] mt-1">
              {{ item.description }}
            </p>
          </div>

          <Icon
            name="i-heroicons-chevron-right"
            class="w-6 h-6 shrink-0 text-[#b4b5b8]"
          />
        </button>
      </div>

      <button
        type="button"
        class="mt-8 w-full md:max-w-md md:mx-auto md:block h-[56px] sm:h-[60px] rounded-2xl bg-brand-aqua text-white text-[24px] leading-[30px] sm:text-[32px] sm:leading-[38px] font-medium"
        @click="logout"
      >
        Log Out
      </button>
    </main>
  </div>
</template>

<script setup>
import UserAvatar from '~/components/ui/UserAvatar.vue'
import { clearSessionFlag } from '~/composables/useSessionFlag'

definePageMeta({
  title: "My Profile - UmovingU",
  alias: "/profile-main",
  middleware: 'auth',
});

const { profile, fullName, memberSince, fetchProfile } = useProfile()
onMounted(() => { if (!profile.value) fetchProfile().catch(() => null) })

const searchQuery = ref("");
const route = useRoute();
const isProfileRoot = computed(
  () => route.path === "/profile-main" || route.path === "/profile-main/",
);

const profileItems = [
  {
    title: "Your Personal Information",
    description: "Manage how we know and communicate with you.",
    icon: "i-heroicons-user",
    route: "/profile/personal-information",
  },
  {
    title: "Collaborators",
    description:
      "Invite, manage, and control who you work with across your property journey.",
    icon: "i-heroicons-users",
    route: "/profile/collaborator-information",
  },
  {
    title: "Your Documents",
    description: "View and manage your essential property documents.",
    icon: "i-heroicons-document-text",
  },
  {
    title: "Downloaded Snapshots",
    description:
      "Easily export all your downloaded snapshots into formats such as PDF.",
    icon: "i-heroicons-arrow-down-tray",
  },
  {
    title: "Saved Properties",
    description: "All your saved and recently viewed properties, organized.",
    icon: "i-heroicons-heart",
  },
  {
    title: "Billing & Payment History",
    description: "Manage your subscription, invoices, and payment methods.",
    icon: "i-heroicons-credit-card",
  },
  {
    title: "Settings",
    description: "Customize your experience, privacy, and account security.",
    icon: "i-heroicons-cog-6-tooth",
  },
  {
    title: "Help & Support",
    description: "Need help? Browse FAQs or speak to support.",
    icon: "i-heroicons-question-mark-circle",
  },
  {
    title: "Calendar",
    description: "Stay on top of viewings, deadlines, and reminders.",
    icon: "i-heroicons-calendar-days",
  },
  {
    title: "Learn & Ask AI",
    description: "Get expert guidance and answers at any step.",
    icon: "i-heroicons-sparkles",
  },
];

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return profileItems;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return profileItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
});

const goBack = useGoBack('/dashboard');

const onPreferenceClick = async (item) => {
  if (item.route) {
    await navigateTo(item.route);
  }
};

const logout = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    // Clear the routing-hint cookie too, or middleware/guest.ts keeps
    // bouncing this browser to /dashboard after sign-out.
    clearSessionFlag();
  }
  await navigateTo("/onboarding/signin");
};
</script>

<style scoped>
/* Big screens (--wide-zoom = width / 1366, set in nuxt.config.ts): the
   header and content scale so a monitor shows the 1366px laptop layout,
   only bigger. The full-height gradient root is left alone. */
@media (min-width: 1367px) {
  .pm-wide {
    zoom: var(--wide-zoom, 1);
  }
}
</style>
