<template>
  <header class="bpnav">
    <div class="bpnav-shell bpnav-inner">
      <button class="bpnav-brand" type="button" @click="navigateTo('/')">
        <img src="/logo-new.png" alt="" class="bpnav-logo" />
        <span>umovingu</span><span class="bpnav-beta">BETA</span>
      </button>
      <nav class="bpnav-links" aria-label="Primary navigation">
        <button type="button" class="active" @click="navigateTo('/explore')">Explore</button>
        <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
        <button type="button" @click="navigateTo('/passport')">Passport</button>
        <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
        <button type="button" @click="navigateTo('/profile/learn')">Learn</button>
      </nav>
      <div class="bpnav-actions">
        <button class="bpnav-help" type="button" @click="navigateTo('/profile/support')">
          <Icon name="heroicons:question-mark-circle" class="bpnav-help-ic" />
          Need Help?
        </button>
        <button class="bpnav-back" type="button" @click="$emit('back')">
          <Icon name="heroicons:chevron-left" class="bpnav-back-ic" />
          {{ backLabel }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ backLabel?: string }>(),
  { backLabel: 'Back' },
)
defineEmits<{ (e: 'back'): void }>()
</script>

<style scoped>
.bpnav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}
.bpnav-shell { width: min(1280px, calc(100% - 64px)); margin: 0 auto; }
.bpnav-inner { min-height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.bpnav-brand { display: flex; align-items: center; gap: 9px; font-size: 16px; font-weight: 800; color: #231d45; background: none; border: none; cursor: pointer; flex-shrink: 0; }
.bpnav-logo { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.bpnav-beta { font-size: 9.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #00857f; background: rgba(0, 161, 154, 0.1); border: 1px solid rgba(0, 161, 154, 0.3); border-radius: 6px; padding: 2px 7px; margin-left: 2px; }
.bpnav-links { display: flex; align-items: center; gap: 4px; }
.bpnav-links button { background: none; border: none; font-size: 13.5px; font-weight: 600; color: #516070; padding: 7px 13px; border-radius: 10px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.bpnav-links button:hover { color: #231d45; background: rgba(0, 0, 0, 0.05); }
.bpnav-links button.active { color: #00a19a; font-weight: 700; background: rgba(0, 161, 154, 0.08); }
.bpnav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.bpnav-help { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #231d45; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(173, 201, 231, 0.5); border-radius: 10px; padding: 7px 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.bpnav-help:hover { background: #fff; border-color: #b9d5ea; }
.bpnav-help-ic { width: 15px; height: 15px; }
.bpnav-back { display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 700; color: #516070; background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(173, 201, 231, 0.5); border-radius: 10px; padding: 7px 13px; cursor: pointer; transition: all 0.18s; font-family: inherit; }
.bpnav-back:hover { color: #231d45; border-color: #b9d5ea; }
.bpnav-back-ic { width: 16px; height: 16px; flex-shrink: 0; }

@media (max-width: 760px) {
  .bpnav-shell { width: calc(100% - 32px); }
  .bpnav-links { display: none; }
  .bpnav-help span, .bpnav-help { font-size: 12px; }
}
</style>
