<template>
  <div
    v-if="modelValue"
    class="drawer-overlay"
    :class="{ 'drawer-overlay--fullscreen': fullscreen }"
    @click.self="handleClose"
  >
    <div
      class="drawer"
      :class="{ 'drawer--open': modelValue, 'drawer--fullscreen': fullscreen }"
    >
      <!-- Header -->
      <div class="drawer__header">
        <button v-if="showBackButton" @click="handleClose" class="drawer__back">
          <span class="drawer__back-icon"
            ><OPIcon name="leftChevron" class="w-[15px] h-[15px]"
          /></span>
          <span class="drawer__back-text">Back</span>
        </button>
        <div v-else class="drawer__back-placeholder"></div>

        <h3 class="drawer__title">{{ title }}</h3>

        <button @click="handleClose" class="drawer__close">
          <span class="drawer__close-icon">✕</span>
        </button>
      </div>

      <!-- Illustration Section (now optional via slot) -->
      <!-- <div v-if="$slots.illustration" class="drawer__illustration">
        <div class="drawer__illustration-icon">
          <slot name="illustration"></slot>
        </div>
        <h4 v-if="title" class="drawer__illustration-title">{{ title }}</h4>
        <p v-if="subtitle" class="drawer__subtitle">{{ subtitle }}</p>
      </div> -->

      <!-- Content -->
      <div class="drawer__content" :class="{ 'drawer__content--large': large }">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="drawer__footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import OPIcon from './OPIcon.vue'
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  large: {
    type: Boolean,
    default: false,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const lockScroll = (lock) => {
  const container = document.querySelector('.mobile-container')
  if (container) {
    container.style.overflow = lock ? 'hidden' : ''
  }
  // Fall back to locking the body on full-page (desktop) layouts
  if (document.body) {
    document.body.style.overflow = lock ? 'hidden' : ''
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document !== 'undefined') {
      lockScroll(isOpen)
    }
  },
)

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    lockScroll(false)
  }
})
</script>

<style scoped>
/* Drawer Overlay — centered modal on desktop, bottom-sheet on mobile */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  animation: drawer-overlay-in 0.22s ease-out;
  /* Keep the fallback overlay scrollbar slim and unobtrusive */
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.28) transparent;
}
.drawer-overlay::-webkit-scrollbar {
  width: 10px;
}
.drawer-overlay::-webkit-scrollbar-track {
  background: transparent;
}
.drawer-overlay::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.22);
  border-radius: 100px;
  border: 3px solid transparent;
  background-clip: padding-box;
}

@keyframes drawer-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.drawer-overlay--fullscreen {
  align-items: stretch;
  justify-content: stretch;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 100%;
  width: 100%;
  transform: none;
}

/* Drawer Container */
.drawer {
  background-color: #fff;
  position: relative;
  width: 100%;
  max-width: 480px;
  /* Subtract the overlay's 24px top+bottom padding so the drawer fits and
     scrolling stays inside .drawer__content (not the overlay). */
  max-height: min(760px, calc(100dvh - 48px));
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(15, 44, 76, 0.28);
  animation: drawer-pop-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes drawer-pop-in {
  from { transform: translateY(14px) scale(0.97); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.drawer--fullscreen {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  border-radius: 0;
  animation: none;
}

/* Header */
.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.5rem;
  background-color: #fff;
  border-bottom: 1px solid #eef1f5;
  min-height: 3.5rem; /* Ensure consistent height */
}

.drawer__back {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #00a19a;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.drawer__back:hover {
  color: rgba(0, 161, 154, 0.8);
}

.drawer__back-placeholder {
  width: 80px; /* Same approximate width as the back button */
  visibility: hidden;
}

.drawer__back-icon {
  font-size: 1.25rem;
  margin-right: 0.5rem;
}

.drawer__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  flex: 1;
  margin: 0;
  padding: 0 1rem; /* Add padding for better spacing */
}

.drawer__close {
  background: rgba(127, 127, 127, 0.15);
  border: none;
  color: rgba(61, 61, 61, 0.5);
  cursor: pointer;
  padding: 0.25rem;
  transition: color 0.2s;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-style: normal;
  font-weight: 590;
  line-height: 21px;
}

.drawer__close:hover {
  color: #374151;
  background-color: rgba(0, 0, 0, 0.05);
}

/* Illustration Section */
.drawer__illustration {
  padding: 1.5rem 1.5rem 1rem;
  text-align: center;
  background-color: #f3f4f6;
}

.drawer__illustration-icon {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.drawer__illustration-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.drawer__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

/* Content */
.drawer__content {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  padding: 1.25rem 1.5rem;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.25) transparent;
}

.drawer__content--large {
  min-height: 300px;
}

/* Footer */
.drawer__footer {
  background-color: #fff;
  border-top: 1px solid #eef1f5;
  padding: 1rem 1.5rem 1.25rem;
}

/* Scrollbar Styling */
.drawer__content::-webkit-scrollbar {
  width: 10px;
}

.drawer__content::-webkit-scrollbar-track {
  background: transparent;
}

.drawer__content::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.2);
  border-radius: 100px;
  border: 3px solid transparent;
  background-clip: padding-box;
}

.drawer__content::-webkit-scrollbar-thumb:hover {
  background: rgba(15, 23, 42, 0.35);
  background-clip: padding-box;
}

/* Responsive — collapse to a bottom-sheet on phones */
@media (max-width: 560px) {
  .drawer-overlay:not(.drawer-overlay--fullscreen) {
    align-items: flex-end;
    padding: 0;
  }

  .drawer:not(.drawer--fullscreen) {
    max-width: 100%;
    margin: 0;
    max-height: 90vh;
    border-radius: 1.25rem 1.25rem 0 0;
    box-shadow: 0 -10px 40px rgba(15, 44, 76, 0.18);
    /* Slide up from the bottom on mobile */
    animation: drawer-slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes drawer-slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .drawer__header {
    padding: 0.875rem 1.125rem;
  }

  .drawer__illustration {
    padding: 1rem 1rem 0.75rem;
  }

  .drawer__content {
    padding: 1.125rem;
  }

  .drawer__footer {
    padding: 0.875rem 1.125rem 1.125rem;
  }

  .drawer__back-placeholder {
    width: 60px; /* Smaller placeholder on mobile */
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-overlay,
  .drawer { animation: none; }
}
</style>
