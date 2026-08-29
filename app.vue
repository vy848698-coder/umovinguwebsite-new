<template>
  <div class="app">
    <NuxtPage />

    <!-- Passport achievement celebration. Every reward-award call site on
         the backend is fire-and-forget from its HTTP response's point of
         view, so the frontend never learns about a new stamp from a
         response body — it asks (checkForCelebrations). Mounted here
         rather than per-page because a stamp can be minted while the user
         is on any screen. -->
    <PassportAchievement
      v-if="currentAchievement"
      :visible="achievementVisible"
      :achievement-id="currentAchievement.achievementId"
      :stamp-asset="currentAchievement.stampAsset"
      :achievement-title="currentAchievement.achievementTitle"
      :achievement-subtitle="currentAchievement.achievementSubtitle"
      :achievement-description="currentAchievement.achievementDescription"
      :achievement-checks="currentAchievement.achievementChecks"
      :points-awarded="currentAchievement.pointsAwarded"
      :completed-at="currentAchievement.completedAt"
      :balance-after="achievementBalanceAfter"
      @done="acknowledgeAchievement"
    />
  </div>
</template>

<script setup>
// SplashScreen disabled across the app per request.
// Component file kept at ~/components/core/SplashScreen.vue if it needs to
// be re-enabled later — just re-add the import and <SplashScreen /> tag.
import PassportAchievement from '~/components/rewards/PassportAchievement.vue'

// Global app configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const {
  current: currentStamp,
  visible: achievementVisible,
  balanceAfter: achievementBalanceAfter,
  checkForCelebrations,
  acknowledge: acknowledgeAchievement,
} = usePassportAchievement()

const currentAchievement = computed(() => {
  const s = currentStamp.value
  if (!s) return null
  return {
    achievementId: s.stampDefinitionId,
    stampAsset: s.stampDefinition?.iconAsset ?? null,
    achievementTitle: s.stampDefinition?.title ?? '',
    achievementSubtitle: s.stampDefinition?.subtitle ?? null,
    achievementDescription: s.stampDefinition?.description ?? null,
    achievementChecks: s.stampDefinition?.checklistItems ?? [],
    pointsAwarded: s.pointsAwarded ?? 0,
    completedAt: s.awardedAt,
  }
})

if (import.meta.client) {
  onMounted(() => {
    void checkForCelebrations()
    // Foreground-return check — covers stamps minted while the tab was
    // backgrounded (a KYC webhook landing, or a step finished in another
    // tab) rather than only on cold start.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void checkForCelebrations()
    })
  })
}
</script>
<style scoped>
.app {
  @apply min-h-dvh flex flex-col;
  /* `clip` blocks horizontal overflow without creating a scroll container,
     which `overflow-x: hidden` does — that would break the sticky navbars
     on the pages inside this wrapper. */
  overflow-x: clip;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
</style>
