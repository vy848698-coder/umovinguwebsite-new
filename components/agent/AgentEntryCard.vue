<template>
  <!-- Passport page: how the seller wants to build the passport. All three
       routes fill in the same sections listed below. Talk to UMU is the
       recommended route, so it leads; the other two sit beside it. -->
  <section class="aec" aria-labelledby="aec-title">
    <div class="aec-head">
      <h2 id="aec-title" class="aec-title">
        How would you like to create your Seller Passport?
      </h2>
      <p class="aec-sub">
        Choose the easiest way for you. You can always change this later.
      </p>
    </div>

    <div class="aec-grid">
      <!-- Recommended: Talk to UMU -->
      <button type="button" class="aec-hero" @click="emit('talk')">
        <span class="aec-hero-top">
          <span class="aec-rec">Recommended</span>
        </span>
        <span class="aec-hero-body">
          <span class="aec-hero-mic">
            <Icon name="i-lucide-mic" class="aec-hero-ic" />
            <span class="aec-wave" aria-hidden="true">
              <span v-for="i in 7" :key="i" :style="{ '--i': i }" />
            </span>
          </span>
          <span class="aec-hero-title">Talk to UMU</span>
          <span class="aec-hero-text">
            Answer a few questions by voice and we'll build your passport as we go.
          </span>
        </span>
        <span class="aec-go" aria-hidden="true">
          <Icon name="i-lucide-arrow-right" />
        </span>
        <span class="aec-hero-bot" aria-hidden="true">
          <UmuBotMascot />
        </span>
      </button>

      <!-- Other routes -->
      <button
        v-for="opt in others"
        :key="opt.id"
        type="button"
        class="aec-opt"
        @click="emit(opt.id)"
      >
        <Icon :name="opt.icon" class="aec-opt-ic" />
        <span class="aec-opt-body">
          <span class="aec-opt-title">{{ opt.title }}</span>
          <span class="aec-opt-text">{{ opt.text }}</span>
        </span>
        <span class="aec-opt-go" aria-hidden="true">
          <Icon name="i-lucide-arrow-right" />
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import UmuBotMascot from '~/components/agent/UmuBotMascot.vue'

const emit = defineEmits<{ talk: []; upload: []; manual: [] }>()

const others = [
  {
    id: 'upload' as const,
    icon: 'i-lucide-file-text',
    title: 'Upload what you have',
    text: "Add documents and we'll use them to complete as much as we can.",
  },
  {
    id: 'manual' as const,
    icon: 'i-lucide-pencil',
    title: 'Do it myself',
    text: 'Work through the passport step by step.',
  },
]
</script>

<style scoped>
.aec {
  width: 100%;
  margin-bottom: 16px;
  padding: 30px 32px 32px;
  border-radius: 24px;
  color: #fff;
  /* One flat colour, no glows, to match the passport hero above. */
  background: #231d45;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 18px 44px rgba(13, 9, 36, 0.22);
}

.aec-title {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.aec-sub {
  margin: 8px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.7);
}

/* Hero tile on the left, two routes stacked on the right */
.aec-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
}

/* ── Talk to UMU ── */
.aec-hero {
  grid-row: 1 / 3;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 250px;
  padding: 24px 26px;
  border: 0;
  border-radius: 22px;
  background: #00857f;
  color: #fff;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.aec-hero:hover {
  transform: translateY(-3px);
  background: #008f88;
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.28);
}
.aec-hero:focus-visible,
.aec-opt:focus-visible {
  outline: 3px solid #fde68a;
  outline-offset: 3px;
}
.aec-hero-top {
  position: relative;
  z-index: 1;
}
.aec-rec {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #fde68a;
  color: #78350f;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.aec-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-width: 56%;
  margin-top: auto;
  padding-top: 18px;
}
.aec-hero-mic {
  display: flex;
  align-items: center;
  gap: 12px;
}
.aec-hero-ic {
  width: 34px;
  height: 34px;
  color: #fff;
}
/* A small live sound wave beside the mic */
.aec-wave {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: 24px;
}
.aec-wave span {
  width: 3px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.85);
  animation: aec-bar 1.1s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.16s);
}
.aec-hero-title {
  margin-top: 14px;
  font-size: 26px;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.025em;
}
.aec-hero-text {
  margin-top: 8px;
  font-size: 14.5px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
}
.aec-go {
  position: relative;
  z-index: 1;
  width: 46px;
  height: 46px;
  margin-top: 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #fff;
  color: #00857f;
  font-size: 20px;
  transition: transform 0.18s ease;
}
.aec-hero:hover .aec-go {
  transform: translateX(4px);
}
/* The robot stands in the corner, cut off at the tile's edge */
.aec-hero-bot {
  position: absolute;
  right: 8px;
  bottom: -40px;
  width: 250px;
  transition: transform 0.25s ease;
}
.aec-hero:hover .aec-hero-bot {
  transform: translateY(-6px);
}

/* ── Upload / Do it myself ── */
.aec-opt {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px 20px 20px 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}
.aec-opt:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(47, 208, 198, 0.55);
  transform: translateY(-2px);
}
.aec-opt-ic {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  color: #2fd0c6;
}
.aec-opt-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.aec-opt-title {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.015em;
}
.aec-opt-text {
  margin-top: 4px;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
}
.aec-opt-go {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 17px;
  transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.aec-opt:hover .aec-opt-go {
  transform: translateX(3px);
  border-color: #2fd0c6;
  color: #2fd0c6;
}

@keyframes aec-bar {
  0%, 100% { height: 6px; }
  50% { height: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .aec-wave span { animation: none; height: 12px; }
  .aec-hero,
  .aec-opt,
  .aec-go,
  .aec-opt-go,
  .aec-hero-bot { transition: none; }
}

/* Laptop: the hero tile is narrower, so the robot steps down a little */
@media (max-width: 1180px) {
  .aec-hero-bot { width: 220px; bottom: -34px; }
  .aec-hero-body { max-width: 54%; }
}

/* Tablet: hero across the top, the other two side by side below */
@media (max-width: 980px) {
  .aec-hero-bot { width: 250px; bottom: -40px; right: 16px; }
  .aec-hero-body { max-width: 58%; }
  .aec-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
  .aec-hero {
    grid-row: auto;
    grid-column: 1 / -1;
    min-height: 230px;
  }
  .aec-opt {
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .aec-opt-go {
    display: none;
  }
}

/* Phone: everything stacks. The robot moves up beside the badge and mic
   so the title and text get the full width and never sit under it. */
@media (max-width: 640px) {
  .aec {
    padding: 22px 16px 18px;
    border-radius: 20px;
  }
  .aec-title {
    font-size: 21px;
    letter-spacing: -0.025em;
  }
  .aec-sub {
    font-size: 14px;
  }
  .aec-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 18px;
  }

  .aec-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'top   bot'
      'mic   bot'
      'title title'
      'text  text'
      'go    go';
    align-items: start;
    min-height: 0;
    padding: 18px 18px 20px;
  }
  .aec-hero-top { grid-area: top; }
  .aec-hero-body { display: contents; }
  .aec-hero-mic {
    grid-area: mic;
    align-self: end;
    padding-bottom: 4px;
  }
  .aec-hero-ic {
    width: 30px;
    height: 30px;
  }
  .aec-hero-title {
    grid-area: title;
    margin-top: 12px;
    font-size: 23px;
  }
  .aec-hero-text {
    grid-area: text;
    margin-top: 6px;
    font-size: 14px;
  }
  .aec-go {
    grid-area: go;
    width: 42px;
    height: 42px;
    margin-top: 16px;
  }
  .aec-hero-bot {
    grid-area: bot;
    position: static;
    width: 132px;
    margin: -6px -6px 0 0;
  }
  .aec-hero:hover .aec-hero-bot {
    transform: none;
  }

  .aec-opt {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'ic   title go'
      'text text  text';
    align-items: center;
    gap: 8px 12px;
    padding: 16px 16px 18px;
  }
  .aec-opt-body { display: contents; }
  .aec-opt-ic {
    grid-area: ic;
    width: 26px;
    height: 26px;
  }
  .aec-opt-title {
    grid-area: title;
    font-size: 16px;
    line-height: 1.3;
  }
  .aec-opt-text {
    grid-area: text;
    margin-top: 0;
    font-size: 13.5px;
  }
  .aec-opt-go {
    grid-area: go;
    display: grid;
    width: 34px;
    height: 34px;
    font-size: 16px;
  }
}

/* Small phones */
@media (max-width: 380px) {
  .aec {
    padding: 20px 12px 14px;
  }
  .aec-title {
    font-size: 19px;
  }
  .aec-hero {
    padding: 16px 14px 18px;
  }
  .aec-hero-bot {
    width: 112px;
  }
  .aec-hero-title {
    font-size: 21px;
  }
  .aec-opt {
    padding: 14px 14px 16px;
  }
}
</style>
