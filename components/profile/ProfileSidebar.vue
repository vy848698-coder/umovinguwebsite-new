<template>
  <aside class="psb" :class="{ open }">
    <div class="psb-brand">
      <div class="psb-brand-logo">
        <Icon name="heroicons:shield-check-solid" class="psb-brand-svg" />
      </div>
      <span class="psb-brand-text">BUYER PROFILE</span>
    </div>

    <nav class="psb-nav" aria-label="Profile navigation">
      <button
        v-for="item in items"
        :key="item.to"
        type="button"
        class="psb-item"
        :class="{ active: item.to === active }"
        @click="go(item.to)"
      >
        <Icon :name="item.icon" class="psb-item-ic" />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="psb-secure">
      <div class="psb-secure-ic"><Icon name="heroicons:shield-check" class="psb-secure-svg" /></div>
      <div class="psb-secure-t">Your information is</div>
      <div class="psb-secure-pct">100% Secure</div>
      <div class="psb-secure-s">We use bank-grade encryption to protect your data and privacy.</div>
      <button class="psb-secure-link" type="button" @click="go('/profile/support')">
        Learn more<Icon name="heroicons:arrow-right" class="psb-secure-link-ic" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ active?: string; open?: boolean }>()
const emit = defineEmits<{ (e: 'navigate'): void }>()

const items = [
  { label: 'Dashboard', to: '/profile', icon: 'heroicons:home' },
  { label: 'Buyer Profile', to: '/profile/personal-information', icon: 'heroicons:user-circle' },
  { label: 'Verified Credentials', to: '/buyer-profile/view', icon: 'heroicons:check-badge' },
  { label: 'Documents', to: '/profile/document', icon: 'heroicons:document-text' },
  { label: 'Offers', to: '/marketplace', icon: 'heroicons:tag' },
  { label: 'Messages', to: '/profile/chat', icon: 'heroicons:chat-bubble-left-right' },
  { label: 'Saved Searches', to: '/profile/saved-properties', icon: 'heroicons:magnifying-glass' },
  { label: 'Settings', to: '/profile/settings', icon: 'heroicons:cog-6-tooth' },
]

function go(to: string) {
  emit('navigate')
  navigateTo(to)
}
</script>

<style scoped>
.psb {
  width: 248px; flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #eef2f7;
  padding: 22px 16px;
  display: flex; flex-direction: column;
  min-height: 100dvh;
}
.psb-brand { display: flex; align-items: center; gap: 10px; padding: 4px 8px 24px; }
.psb-brand-logo { width: 30px; height: 30px; border-radius: 9px; background: linear-gradient(140deg, #00b6ae, #007e78); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.psb-brand-svg { width: 18px; height: 18px; color: #fff; }
.psb-brand-text { font-size: 14px; font-weight: 800; letter-spacing: 0.6px; color: #10263d; }

.psb-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
.psb-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 14px; border-radius: 12px;
  font-family: inherit; font-size: 14px; font-weight: 600; color: #5a6b7e;
  background: none; border: none; cursor: pointer; text-align: left; width: 100%;
  transition: all 0.16s;
}
.psb-item:hover { background: #f4f7fb; color: #10263d; }
.psb-item-ic { width: 20px; height: 20px; flex-shrink: 0; }
.psb-item.active {
  background: linear-gradient(120deg, #00a19a, #007e78); color: #fff;
  font-weight: 700; box-shadow: 0 8px 20px rgba(0,161,154,0.26);
}

.psb-secure { margin-top: 16px; background: #f7faff; border: 1px solid #e8eef5; border-radius: 16px; padding: 18px 16px; text-align: center; }
.psb-secure-ic { width: 40px; height: 40px; border-radius: 12px; background: #e3f4f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
.psb-secure-svg { width: 20px; height: 20px; color: #00a19a; }
.psb-secure-t { font-size: 12.5px; font-weight: 700; color: #10263d; }
.psb-secure-pct { font-size: 13px; font-weight: 800; color: #00a19a; margin-bottom: 8px; }
.psb-secure-s { font-size: 11px; color: #7e8a98; line-height: 1.5; margin-bottom: 12px; }
.psb-secure-link { display: inline-flex; align-items: center; gap: 5px; background: none; border: none; font-family: inherit; font-size: 12px; font-weight: 800; color: #007e78; cursor: pointer; }
.psb-secure-link-ic { width: 14px; height: 14px; }

/* Mobile: off-canvas drawer */
@media (max-width: 1000px) {
  .psb {
    position: fixed; top: 0; left: 0; z-index: 60;
    transform: translateX(-100%); transition: transform 0.26s cubic-bezier(.22,1,.36,1);
    box-shadow: 0 0 40px rgba(15,44,76,0.18);
  }
  .psb.open { transform: translateX(0); }
}
</style>
