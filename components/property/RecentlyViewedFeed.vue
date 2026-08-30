<template>
  <section v-if="loading || properties.length" class="rvf">
    <div class="rvf-head">
      <h2 class="rvf-title">Recently viewed</h2>
      <button type="button" class="rvf-all" @click="navigateTo('/profile/saved-properties')">
        Saved properties
        <Icon name="i-lucide-chevron-right" />
      </button>
    </div>

    <div v-if="loading" class="rvf-row">
      <div v-for="n in 4" :key="n" class="rvf-skeleton" />
    </div>

    <div v-else class="rvf-row">
      <NuxtLink
        v-for="(prop, i) in properties"
        :key="prop.id"
        :to="`/property/${prop.id}`"
        class="rvf-card"
      >
        <div class="rvf-media">
          <PropertyImage
            :src="prop.imageUrl || prop.image"
            :alt="prop.addressLine1 || prop.address"
            :seed="prop.id"
            :variant-index="i"
            :show-caption="false"
            class="rvf-img"
          />
        </div>
        <div class="rvf-body">
          <div class="rvf-addr">{{ prop.addressLine1 || prop.address }}</div>
          <div class="rvf-area">
            {{ prop.city ? prop.city + ', ' + prop.postcode : prop.postcode || '' }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import PropertyImage from '~/components/property/PropertyImage.vue'

defineProps<{
  properties: any[]
  loading: boolean
}>()
</script>

<style scoped>
.rvf {
  margin-top: 30px;
}
.rvf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}
.rvf-title {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #231d45;
}
.rvf-all {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #00a19a;
  cursor: pointer;
}
.rvf-all:hover {
  color: #00756f;
}

/* Horizontal rail: recently-viewed is a short, glanceable history, so it
   scrolls sideways rather than taking a full grid row away from the main
   For You feed below. */
.rvf-row {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 6px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: #cbd2dc transparent;
}
.rvf-row::-webkit-scrollbar { height: 8px; }
.rvf-row::-webkit-scrollbar-track { background: transparent; }
.rvf-row::-webkit-scrollbar-thumb {
  background: #cbd2dc;
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.rvf-skeleton {
  flex: 0 0 190px;
  height: 168px;
  border-radius: 16px;
  background: linear-gradient(100deg, #f1f3f7 30%, #e7eaf1 50%, #f1f3f7 70%);
  background-size: 250% 100%;
  animation: rvf-shimmer 1.4s ease-in-out infinite;
}
@keyframes rvf-shimmer {
  from { background-position: 140% 0; }
  to { background-position: -40% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .rvf-skeleton { animation: none; }
}

.rvf-card {
  flex: 0 0 190px;
  text-decoration: none;
  color: inherit;
  scroll-snap-align: start;
  background: #fff;
  border: 1px solid #e9ecf2;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.rvf-card:hover {
  transform: translateY(-2px);
  border-color: #d8e4e2;
  box-shadow: 0 12px 26px rgba(31, 61, 98, 0.1);
}
.rvf-card:focus-visible {
  outline: 2px solid #00a19a;
  outline-offset: 2px;
}
.rvf-media {
  aspect-ratio: 16 / 10;
  background: #eef4f2;
}
.rvf-img {
  width: 100%;
  height: 100%;
}
.rvf-body {
  padding: 10px 12px 12px;
}
.rvf-addr {
  font-size: 13.5px;
  font-weight: 800;
  color: #231d45;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rvf-area {
  margin-top: 1px;
  font-size: 11.5px;
  font-weight: 600;
  color: #8a90a6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
