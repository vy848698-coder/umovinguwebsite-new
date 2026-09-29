<template>
  <!-- The public-site navbar: same links, look and layout as the homepage
       (pages/index.vue .lp-nav). Shared by /homescore and /explore so the
       pages a visitor moves between all carry one identical bar. -->
  <header class="site-nav">
    <div class="site-nav-shell site-nav-inner">
      <button class="site-brand" type="button" @click="navigateTo('/')">
        <img src="/op-icons/logo.png" alt="umovingu" class="site-brand-logo" />
        <span class="site-brand-name">umovingu</span>
        <span class="site-brand-beta">BETA</span>
      </button>

      <!-- The Story/Market/Reviews links are sections of the landing page,
           and `/` carries the guest middleware: a signed-in visitor hitting
           it is redirected to /dashboard, so those anchors would silently
           dump them on the dashboard. Signed in, the menu points at the
           real app pages instead. -->
      <nav class="site-links" aria-label="Primary navigation">
        <button type="button" :class="{ active: navIsActive('/homescore') }" @click="navigateTo('/homescore')">HomeScore</button>
        <template v-if="signedIn">
          <button v-if="!hideExploreSignedIn" type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/explore')">Explore</button>
          <button type="button" :class="{ active: navIsActive('/passport') }" @click="navigateTo('/passport')">Passport</button>
          <button type="button" :class="{ active: navIsActive('/marketplace') }" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" :class="{ active: navIsActive('/profile/learn') }" @click="navigateTo('/profile/learn')">Learn</button>
        </template>
        <template v-else>
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="navigateTo('/#explore')">Explore</button>
          <button type="button" @click="navigateTo('/#passport')">Passport</button>
          <button type="button" @click="navigateTo('/#story')">Story</button>
          <button type="button" @click="navigateTo('/#market')">Market</button>
          <button type="button" @click="navigateTo('/#reviews')">Reviews</button>
        </template>
      </nav>

      <div class="site-actions">
        <template v-if="signedIn">
          <button class="site-btn ghost" type="button" @click="navigateTo('/profile')">Profile</button>
          <button class="site-btn solid" type="button" @click="navigateTo('/dashboard')">Dashboard</button>
        </template>
        <template v-else>
          <button class="site-btn ghost" type="button" @click="navigateTo('/onboarding/signin')">Sign in</button>
          <button class="site-btn solid" type="button" @click="navigateTo('/onboarding/signup')">Get started</button>
        </template>
      </div>

      <button
        class="site-toggle"
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

    <div class="site-nav-shell">
      <div class="site-backdrop" :class="{ open: mobileOpen }" @click="mobileOpen = false" />
      <div class="site-panel" :class="{ open: mobileOpen }">
        <button type="button" :class="{ active: navIsActive('/homescore') }" @click="goMobile('/homescore')">HomeScore</button>
        <template v-if="signedIn">
          <button v-if="!hideExploreSignedIn" type="button" :class="{ active: navIsActive('/explore') }" @click="goMobile('/explore')">Explore</button>
          <button type="button" @click="goMobile('/passport')">Passport</button>
          <button type="button" @click="goMobile('/marketplace')">Marketplace</button>
          <button type="button" @click="goMobile('/profile/learn')">Learn</button>
          <button type="button" @click="goMobile('/profile')">Profile</button>
          <button type="button" class="claim" @click="goMobile('/dashboard')">Dashboard</button>
        </template>
        <template v-else>
          <button type="button" :class="{ active: navIsActive('/explore') }" @click="goMobile('/#explore')">Explore</button>
          <button type="button" @click="goMobile('/#passport')">Passport</button>
          <button type="button" @click="goMobile('/#story')">Story</button>
          <button type="button" @click="goMobile('/#market')">Market</button>
          <button type="button" @click="goMobile('/#reviews')">Reviews</button>
          <button type="button" @click="goMobile('/onboarding/signin')">Sign in</button>
          <button type="button" class="claim" @click="goMobile('/onboarding/signup')">Get started</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// hideExploreSignedIn: drop the Explore link for signed-in users only
// (the /homescore menu). Guests always keep it.
defineProps<{ hideExploreSignedIn?: boolean }>()

const route = useRoute()
const mobileOpen = ref(false)

// Resolved after mount because localStorage doesn't exist during SSR, so the
// first paint shows the guest menu and the two swap on hydration.
const signedIn = ref(false)
onMounted(() => {
  try {
    signedIn.value = !!localStorage.getItem('token')
  } catch {
    /* private mode / blocked storage: stays signed out */
  }
})

const navIsActive = (basePath: string) =>
  route.path === basePath || route.path.startsWith(`${basePath}/`)

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
/* Values mirror the homepage navbar (.lp-nav*) exactly. */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(243, 242, 239, 0.86);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
  backdrop-filter: blur(12px);
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.site-nav-shell {
  position: relative;
  z-index: 2;
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}

.site-nav-inner {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-brand,
.site-links button,
.site-btn,
.site-panel button {
  font-family: inherit;
}

.site-brand {
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 0;
  color: #231d45;
  cursor: pointer;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  flex-shrink: 0;
}

.site-brand-logo {
  width: auto;
  height: 34px;
  display: block;
  object-fit: contain;
}

.site-brand-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: #231d45;
}

.site-brand-beta {
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #00857f;
  background: rgba(0, 161, 154, 0.1);
  border: 1px solid rgba(0, 161, 154, 0.3);
  border-radius: 6px;
  padding: 2px 7px;
  margin-left: 2px;
}

.site-links {
  display: flex;
  gap: 4px;
}

.site-links button {
  border: 0;
  background: transparent;
  color: #5a5570;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 9px;
  white-space: nowrap;
  transition: color 0.15s, background 0.15s;
}

.site-links button:hover {
  color: #231d45;
  background: rgba(35, 29, 69, 0.05);
}

/* Current page: navy text only, no pill (the homepage has none either). */
.site-links button.active {
  color: #231d45;
}

.site-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.site-btn {
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 11px 18px;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
  white-space: nowrap;
}

.site-btn.solid {
  color: #fff;
  background: #00a19a;
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.26);
}

.site-btn.solid:hover {
  transform: translateY(-1px);
  background: #00857f;
}

.site-btn.ghost {
  color: #231d45;
  background: #fff;
  border-color: #ececf2;
}

.site-btn.ghost:hover {
  border-color: #00a19a;
}

.site-toggle,
.site-panel,
.site-backdrop {
  display: none;
}

.site-toggle {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid #ececf2;
  background: #fff;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.site-toggle span {
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: #231d45;
}

/* Collapses at the homepage's breakpoint: links and Sign in move into the
   menu, Get started stays in the bar beside the menu button. */
@media (max-width: 960px) {
  .site-nav-inner {
    gap: 12px;
  }

  .site-actions {
    margin-left: auto;
  }

  .site-links,
  .site-btn.ghost {
    display: none;
  }

  .site-toggle {
    display: inline-flex;
  }

  .site-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1;
    background: rgba(8, 16, 47, 0.24);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .site-backdrop.open {
    opacity: 1;
    pointer-events: auto;
  }

  .site-panel {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    position: relative;
    z-index: 2;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-8px);
    transition: max-height 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
  }

  .site-panel.open {
    max-height: 520px;
    margin: 0 0 12px;
    padding: 10px;
    border: 1px solid #dbe7f3;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 16px 30px rgba(21, 58, 95, 0.12);
    opacity: 1;
    transform: translateY(0);
  }

  .site-panel button {
    border: 1px solid #dde8f3;
    border-radius: 10px;
    background: #fff;
    color: #22405f;
    cursor: pointer;
    font-size: 14px;
    font-weight: 800;
    padding: 12px;
    text-align: left;
  }

  .site-panel button.active {
    background: rgba(0, 161, 154, 0.1);
    color: #08294b;
  }

  .site-panel button.claim {
    border: 0;
    color: #fff;
    background: linear-gradient(120deg, #00a19a, #2f9bdf 48%, #5a4cf0);
  }
}

@media (max-width: 640px) {
  .site-nav-inner {
    min-height: 60px;
  }
}

@media (max-width: 600px) {
  .site-nav-shell {
    width: calc(100% - 32px);
  }

  .site-actions {
    gap: 8px;
  }
}

@media (max-width: 400px) {
  .site-nav-shell {
    width: calc(100% - 24px);
  }
}

@media (max-width: 380px) {
  .site-nav-inner {
    gap: 8px;
  }

  .site-brand {
    gap: 6px;
    min-width: 0;
    overflow: hidden;
  }

  .site-brand-logo {
    height: 30px;
    flex-shrink: 0;
  }

  .site-brand-name {
    font-size: 16px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .site-actions {
    gap: 6px;
  }

  .site-btn.solid {
    padding: 9px 12px;
    font-size: 13px;
  }
}

/* Same as the homepage: drop the BETA tag on the smallest phones. */
@media (max-width: 340px) {
  .site-brand-beta {
    display: none;
  }
}

@media (max-width: 300px) {
  .site-nav-inner {
    gap: 6px;
  }

  .site-brand {
    gap: 4px;
  }

  .site-brand-logo {
    height: 26px;
  }

  .site-brand-name {
    font-size: 15px;
  }

  .site-actions {
    gap: 4px;
  }

  .site-btn.solid {
    padding: 8px 9px;
    font-size: 12.5px;
  }

  .site-toggle {
    width: 36px;
    height: 36px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-btn,
  .site-panel,
  .site-backdrop {
    transition: none;
  }
}

/* Big screens: the bar's content scales with the page (--wide-zoom =
   width / 1366, set in nuxt.config.ts); the bar itself stays full width. */
@media (min-width: 1367px) {
  .site-nav-shell {
    zoom: var(--wide-zoom, 1);
  }
}
</style>
