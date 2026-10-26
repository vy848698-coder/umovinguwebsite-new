<template>
  <div class="expert">
    <div class="expert-top">
      <div class="expert-avatar" aria-hidden="true">
        <OPIcon name="underReviewDesk" class="expert-avatar-img" />
      </div>
      <span class="ribbon"><span class="pulse"></span> Under Review</span>
    </div>
    <div class="expert-content">
      <h3 class="expert-h3">{{ title }}</h3>
      <p class="qcount">{{ description }}</p>
      <span class="meta">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          width="12"
          height="12"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Minimum time: {{ minimumTime }}
      </span>
    </div>
    <button class="expert-cta" @click="$emit('viewProfile')">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        width="14"
        height="14"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      View Expert Profile
    </button>
  </div>
</template>

<script setup>
import OPIcon from '~/components/ui/OPIcon.vue'

defineProps({
  title: {
    type: String,
    default: 'Your Expert Guidance',
  },
  description: {
    type: String,
    default: 'You have 3 questions under review by an expert.',
  },
  minimumTime: {
    type: String,
    default: '3 Days',
  },
})

defineEmits(['viewProfile'])
</script>

<style scoped>
.expert {
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
/* Illustration leads the card, big and on plain white; the status badge
   sits opposite it, like the arrow on the section cards. */
.expert-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.ribbon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdfa;
  color: #0f766e;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #14b8a6;
  box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.6);
  animation: pulse 1.6s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.6); }
  70% { box-shadow: 0 0 0 8px rgba(20, 184, 166, 0); }
  100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
}
.expert-content {
  min-width: 0;
}
.expert-h3 {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 700;
  color: #0a0f2c;
  letter-spacing: -0.01em;
  line-height: 1.25;
}
.qcount {
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.45;
  color: #0f766e;
  margin: 0 0 10px;
}
.meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: #64748b;
  background: #f1f5f9;
  padding: 5px 10px;
  border-radius: 999px;
}
.expert-avatar {
  width: 84px;
  flex-shrink: 0;
}
.expert-avatar-img {
  display: block;
  width: 84px;
  height: auto;
}
.expert-cta {
  margin-top: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  background: #1f7a66;
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  transition: transform 0.12s ease;
}
.expert-cta:active {
  transform: scale(0.98);
}
@media (max-width: 420px) {
  .expert {
    padding: 16px;
  }
  .expert-avatar,
  .expert-avatar-img {
    width: 72px;
  }
}
</style>
