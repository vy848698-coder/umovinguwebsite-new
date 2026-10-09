<template>
  <div>
    <div class="spc">
      <div class="spc-row">
        <img src="/profile%20new%20icon/passportPoints.png" alt="" class="spc-icon" />
        <div class="spc-balance">{{ balance }} <em>pts</em></div>
      </div>
      <h3 class="spc-h3">{{ sectionTitle }}</h3>
      <p class="spc-sub">{{ completedCount }} of {{ totalCount }} complete</p>

      <template v-if="!sectionComplete && sectionBonusPoints > 0">
        <div class="spc-divider" />
        <button class="spc-bonus-row" @click="$emit('finish-section')">
          <span class="spc-bonus-icon">
            <img src="/op-icons/misc/trophy.png" alt="" class="spc-bonus-icon-img" />
          </span>
          <span class="spc-bonus-text">
            <strong>Finish this section</strong>
            <em>+{{ sectionBonusPoints }} bonus</em>
          </span>
          <svg class="spc-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </template>

      <div class="spc-level">
        <div class="spc-level-track">
          <div class="spc-level-bar">
            <div class="spc-level-fill" :style="{ width: level.progressPercent + '%' }" />
          </div>
          <span class="spc-level-marker" :style="{ left: level.progressPercent + '%' }">★</span>
        </div>
        <p class="spc-level-text">
          <template v-if="level.next">
            {{ level.progressPercent }}% to Level {{ level.next.level }} · {{ level.next.name }}
          </template>
          <template v-else>
            Max level reached · {{ level.name }}
          </template>
        </p>
      </div>
    </div>

    <div v-if="streak.current > 0" class="spc-streak">
      <span class="spc-streak-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
          <path d="M12 12V2" />
          <path d="M8 6l4-4 4 4" />
        </svg>
      </span>
      <div class="spc-streak-text">
        <strong>Nice work! You're on a {{ streak.current }} day streak</strong>
        <span>Keep it up to earn bonus points!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  balance: { type: Number, required: true },
  sectionTitle: { type: String, default: '' },
  completedCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  sectionComplete: { type: Boolean, default: false },
  sectionBonusPoints: { type: Number, default: 30 },
  level: {
    type: Object,
    default: () => ({ level: 1, name: 'Property Novice', progressPercent: 0, next: null }),
  },
  streak: {
    type: Object,
    default: () => ({ current: 0, longest: 0 }),
  },
})

defineEmits(['finish-section'])
</script>

<style scoped>
.spc {
  margin-bottom: 12px;
  border-radius: 20px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  color: #231d45;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.spc::after {
  content: '';
  position: absolute;
  right: -30px;
  top: -30px;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(0, 161, 154, 0.12), transparent 60%);
  pointer-events: none;
}

.spc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
  margin-bottom: 8px;
}
.spc-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  flex-shrink: 0;
}
.spc-balance {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  color: #231d45;
}
.spc-balance em {
  font-style: normal;
  color: #00817c;
  font-weight: 600;
  font-size: 16px;
  margin-left: 4px;
}

.spc-h3 {
  margin: 4px 0 2px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: #231d45;
  position: relative;
  z-index: 1;
}
.spc-sub {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  color: #6b7089;
  position: relative;
  z-index: 1;
}

.spc-divider {
  height: 1px;
  background: #f0f2f5;
  margin: 14px 0;
  position: relative;
  z-index: 1;
}

.spc-bonus-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  position: relative;
  z-index: 1;
}
/* Sized up from the old 28px flat glyph - glossy 3D renders lose their
   shine/detail below ~32-36px. */
.spc-bonus-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.spc-bonus-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.spc-bonus-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.spc-bonus-text strong {
  font-size: 14px;
  font-weight: 700;
  color: #231d45;
}
.spc-bonus-text em {
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  color: #00817c;
}
.spc-chevron {
  color: #c4c1d4;
  flex-shrink: 0;
}

.spc-level {
  margin-top: 18px;
  position: relative;
  z-index: 1;
}
.spc-level-track {
  position: relative;
}
.spc-level-bar {
  height: 6px;
  border-radius: 999px;
  background: #f0f2f5;
  overflow: hidden;
}
.spc-level-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #14b8a6, #5eead4);
  transition: width 0.4s ease;
}
.spc-level-marker {
  position: absolute;
  top: 50%;
  font-size: 13px;
  line-height: 1;
  color: #fbbf24;
  text-shadow: none;
  filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.7));
  transform: translate(-50%, -50%);
  transition: left 0.4s ease;
  pointer-events: none;
}
.spc-level-text {
  margin: 8px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: #00817c;
}

.spc-streak {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e6f9f7;
  border: 1px solid #e2f1ea;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 24px;
}
.spc-streak-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #fef3c7;
  color: #d97706;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}
.spc-streak-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.spc-streak-text strong {
  font-size: 13px;
  font-weight: 700;
  color: #00756f;
  line-height: 1.3;
}
.spc-streak-text span {
  font-size: 12px;
  font-weight: 400;
  color: #115e59;
}
</style>
