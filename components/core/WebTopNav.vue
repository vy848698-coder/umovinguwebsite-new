<template>
  <header class="webtop-nav">
    <div class="webtop-shell webtop-inner">
      <button class="webtop-brand" type="button" @click="navigateTo('/')">
        <img src="/logo-new.png" alt="" class="webtop-brand-logo" />
        <span class="webtop-brand-name">umovingu</span>
        <span class="webtop-brand-beta">BETA</span>
      </button>

      <nav class="webtop-links" aria-label="Primary navigation">
        <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
        <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
        <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Passport</button>
        <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
        <button type="button" :class="{ active: learnIsActive }" @click="navigateTo('/profile/learn')">Learn</button>
      </nav>

      <div v-if="$slots.actions" class="webtop-actions">
        <slot name="actions" />
      </div>

      <button
        class="webtop-mobile-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        :aria-expanded="mobileOpen ? 'true' : 'false'"
        @click="mobileOpen = !mobileOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>

    <div class="webtop-shell">
      <div class="webtop-mobile-backdrop" :class="{ open: mobileOpen }" @click="mobileOpen = false" />
      <div class="webtop-mobile-panel" :class="{ open: mobileOpen }">
        <button type="button" :class="{ active: navIsActive('/explore') }" @click="goMobile('/explore')">Explore</button>
        <button type="button" :class="{ active: navIsActive('/homescore') }" @click="goMobile('/homescore')">HomeScore</button>
        <button type="button" :class="{ active: navIsActive('/passport') }" @click="goMobile('/passport')">Passport</button>
        <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="goMobile('/marketplace')">Marketplace</button>
        <button type="button" :class="{ active: learnIsActive }" @click="goMobile('/profile/learn')">Learn</button>
        <button v-if="showProfileMobile" type="button" :class="{ active: navIsActive('/profile') }" @click="goMobile('/profile')">Profile</button>
        <slot name="mobile-extra" :close-menu="closeMobile" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  includeChatInLearn?: boolean
  showProfileMobile?: boolean
}>(), {
  includeChatInLearn: false,
  showProfileMobile: true,
})

const route = useRoute()
const mobileOpen = ref(false)

const navIsActive = (basePath: string) =>
  route.path === basePath || route.path.startsWith(`${basePath}/`)

const learnIsActive = computed(() =>
  navIsActive('/profile/learn') || (props.includeChatInLearn && navIsActive('/profile/chat')),
)

const closeMobile = () => {
  mobileOpen.value = false
}

const goMobile = (path: string) => {
  mobileOpen.value = false
  navigateTo(path)
}

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
  },
)
</script>

<style scoped>
.webtop-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(247, 251, 255, 0.82);
  border-bottom: 1px solid rgba(40, 95, 150, 0.1);
  backdrop-filter: blur(14px);
}

.webtop-shell {
  width: min(1260px, calc(100% - 40px));
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.webtop-inner {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.webtop-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #231d45;
  cursor: pointer;
  flex-shrink: 0;
}

.webtop-brand-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.webtop-brand-name {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
}

.webtop-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
}

.webtop-links {
  display: flex;
  gap: 4px;
}

.webtop-links button {
  border: 0;
  background: transparent;
  color: #5a5570;
  font-size: 14px;
  font-weight: 600;
  padding: 9px 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.webtop-links button:hover {
  background: rgba(35, 29, 69, 0.05);
  color: #231d45;
}

.webtop-links button.active {
  background: rgba(0, 161, 154, 0.1);
  color: #00857f;
  box-shadow: inset 0 0 0 1px rgba(0, 161, 154, 0.24);
}

.webtop-actions {
  display: inline-flex;
  gap: 8px;
}

.webtop-mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.webtop-mobile-toggle span {
  width: 16px;
  height: 2px;
  border-radius: 999px;
  background: #2b3c56;
}

.webtop-mobile-panel,
.webtop-mobile-backdrop {
  display: none;
}

@media (max-width: 980px) {
  .webtop-shell {
    width: calc(100% - 18px);
  }

  .webtop-links,
  .webtop-actions {
    display: none;
  }

  .webtop-mobile-toggle {
    display: inline-flex;
  }

  .webtop-mobile-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 0;
    padding: 0;
    border-radius: 14px;
    border: 0;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: none;
    transform-origin: top;
    transform: scaleY(0.92);
    opacity: 0;
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease, max-height 0.2s ease;
    position: relative;
    z-index: 2;
  }

  .webtop-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(16, 27, 43, 0.26);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1;
  }

  .webtop-mobile-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }

  .webtop-mobile-panel.open {
    transform: scaleY(1);
    opacity: 1;
    pointer-events: auto;
    max-height: 440px;
    margin: 8px 0 12px;
    padding: 10px;
    border: 1px solid #dbe7f3;
    box-shadow: 0 14px 24px rgba(21, 58, 95, 0.1);
  }

  .webtop-mobile-panel button {
    border: 1px solid #dde8f3;
    background: #fff;
    color: #22405f;
    border-radius: 10px;
    padding: 10px 12px;
    text-align: left;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .webtop-mobile-panel button.active {
    border-color: rgba(0, 161, 154, 0.34);
    background: rgba(0, 161, 154, 0.1);
    color: #00857f;
  }
}

@media (max-width: 640px) {
  .webtop-inner {
    min-height: 58px;
  }

  .webtop-brand {
    font-size: 15px;
    gap: 8px;
  }

  .webtop-brand-logo {
    width: 24px;
    height: 24px;
  }
}
</style>
