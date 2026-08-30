<template>
  <div class="prop-img" :class="{ 'prop-img--placeholder': !shown }">
    <img
      v-if="shown"
      :src="resolvedSrc!"
      :alt="alt"
      class="prop-img-photo"
      @error="failed = true"
    />
    <template v-else-if="!logoFallback">
      <img :src="stockImage" alt="" class="prop-img-photo" loading="lazy" />
      <!-- Labelled, so a generic house photo is never mistaken for this
           property's own. Hidden by container query on thumbnails too small
           to carry it (see .prop-img-nophoto). -->
      <span class="prop-img-nophoto">No photo yet</span>
    </template>
    <template v-else>
      <div class="prop-img-logo">
        <svg viewBox="0 0 43 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M33.0496 22.7447V24.4998H29.6886L29.6698 22.8687C29.6698 20.1202 28.4599 18.9834 26.4158 18.9834C24.3716 18.9834 23.1617 20.1202 23.1617 22.8687V26.1985H19.8239V22.7447C19.8239 18.4875 22.2856 16.1318 26.4372 16.1318C30.5888 16.1318 33.0496 18.4875 33.0496 22.7447Z" fill="currentColor" />
          <path d="M16.4704 16.1548C20.622 16.1548 23.0837 18.5104 23.0837 22.7677V26.2214H19.7458V22.8917C19.7458 20.1431 18.5564 19.0064 16.4918 19.0064C14.4476 19.0064 13.2377 20.1431 13.2377 22.8917L13.2249 24.5227H9.86732L9.85876 22.7677C9.85876 18.5104 12.3205 16.1548 16.4721 16.1548H16.4704Z" fill="currentColor" />
          <path d="M24.4625 26.1176C24.4625 24.4712 23.1157 23.1372 21.454 23.1372C19.7923 23.1372 18.4456 24.472 18.4456 26.1176C18.4456 27.0764 18.9042 27.9266 19.6135 28.4716L18.9119 32.8005H23.997L23.2954 28.4716C24.0047 27.9266 24.4625 27.0756 24.4625 26.1176Z" fill="currentColor" />
          <path d="M42.9371 18.066C42.9345 17.1434 42.179 16.3955 41.2463 16.3955C40.3137 16.3955 39.5556 17.1458 39.5556 18.0709H39.559V25.5082C39.559 28.2567 38.3491 29.3934 36.305 29.3934C34.2608 29.3934 33.0509 28.2567 33.0509 25.5082V24.4986H29.6865V25.6321C29.6865 29.8894 32.1739 32.245 36.3255 32.245C40.4771 32.245 42.938 29.8894 42.938 25.6321L42.9371 18.066Z" fill="currentColor" />
          <path d="M0.00171036 18.066C0.0042773 17.1434 0.759816 16.3955 1.69247 16.3955C2.62599 16.3955 3.38323 17.1458 3.38323 18.0709H3.37981V25.5082C3.37981 28.2567 4.5897 29.3934 6.63384 29.3934C8.69938 29.3934 9.86734 28.2567 9.86734 25.5082V24.4986H13.2258V25.6321C13.2258 29.8894 10.7641 32.245 6.61245 32.245C2.46084 32.245 0 29.8894 0 25.6321V18.066H0.00171036Z" fill="currentColor" />
          <path d="M41.9458 11.0794L22.5842 0.234276C22.3189 0.0885573 22.0118 0.00724567 21.6995 0H21.6507V0.119151L21.6173 0H21.5711C21.2562 0.00805074 20.9499 0.0893627 20.6829 0.235886L7.20648 7.78426V6.46394C7.20648 5.59929 6.41072 4.89566 5.43357 4.89566C4.45642 4.89566 3.66067 5.59929 3.66067 6.46394V9.77119L1.32218 11.081C0.4922 11.5375 0.237216 12.5068 0.754028 13.2411C1.26998 13.9753 2.36607 14.2007 3.19691 13.7434L21.6344 3.41593L40.0728 13.7442C40.3577 13.9012 40.6786 13.9817 41.0063 13.9817C41.1415 13.9817 41.2776 13.968 41.4119 13.9407C41.8731 13.8457 42.265 13.5977 42.5157 13.2419C43.0316 12.5076 42.7767 11.5391 41.9475 11.0827L41.9458 11.0794Z" fill="currentColor" />
        </svg>
      </div>
      <div v-if="showCaption" class="prop-img-caption">No image available</div>
    </template>
    <slot name="overlay" />
  </div>
</template>

<script setup lang="ts">
// Real house photos rather than a logo mark, so a grid of properties reads as
// properties. Deliberately generic and labelled "No photo yet" (see template)
// so one never passes as the actual property's photograph.
//
// A set rather than a single image: with one shared fallback, a feed of
// unphotographed properties renders the identical picture down the whole
// grid, which reads as a rendering bug rather than as missing data.
const STOCK_IMAGES = [
  '/dashboard/home-1.jpg',
  '/dashboard/home-2.jpg',
  '/dashboard/home-3.jpg',
  '/dashboard/home-4.jpg',
  '/dashboard/home-5.jpg',
  '/dashboard/home-6.jpg',
  '/dashboard/home-7.jpg',
  '/dashboard/home-8.jpg',
  '/dashboard/home-9.jpg',
]

// Deterministic, never Math.random(): this renders on the server and then
// hydrates on the client, so a random pick would differ between the two and
// trip a hydration mismatch.
//
// Hashing an id alone isn't enough for a grid. Nine ids hashed into nine
// slots collide by the pigeonhole principle — measured ~6 distinct images
// across 9 cards, so neighbouring cards still visibly repeat. Where the
// caller knows the row's position in its own list it passes that instead,
// which walks the set and guarantees no repeat until it is exhausted.
function pickStock(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0
  }
  return STOCK_IMAGES[Math.abs(h) % STOCK_IMAGES.length]
}

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    showCaption?: boolean
    // Opt back into the bare umu logo mark — for surfaces where a stock
    // house photo would be misleading rather than helpful (a map pin
    // thumbnail, a document row), not for property cards.
    logoFallback?: boolean
    // Anything stable and unique per property (its id) — used to choose the
    // stand-in photo when the caller has no list position to offer.
    seed?: string | null
    // The row's index in its own list. Preferred over `seed` because it
    // cycles the set, so no two cards on screen share a photo.
    variantIndex?: number | null
  }>(),
  {
    src: null,
    alt: 'Property',
    showCaption: true,
    logoFallback: false,
    seed: null,
    variantIndex: null,
  },
)

const stockImage = computed(() => {
  if (typeof props.variantIndex === 'number' && props.variantIndex >= 0) {
    return STOCK_IMAGES[props.variantIndex % STOCK_IMAGES.length]
  }
  return pickStock(props.seed || props.alt || '')
})

const failed = ref(false)
const resolvedSrc = computed(() => (props.src && props.src.trim() ? props.src : null))
const shown = computed(() => !!resolvedSrc.value && !failed.value)

watch(() => props.src, () => { failed.value = false })
</script>

<style scoped>
.prop-img {
  position: relative;
  container-type: inline-size;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #e6efe9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
}
.prop-img--placeholder {
  background:
    radial-gradient(ellipse 70% 80% at 50% 30%, rgba(61, 189, 163, 0.10), transparent 70%),
    linear-gradient(135deg, #f1f9f4 0%, #e2f1ea 100%);
}
.prop-img-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.prop-img-logo {
  width: 36%;
  max-width: 60px;
  color: #00a19a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.prop-img-logo svg { width: 100%; height: auto; }
/* Too small to read on a 56px watch-row thumbnail, and it would cover most
   of the image — so it only appears once there's room for it. */
@container (max-width: 150px) {
  .prop-img-nophoto { display: none; }
}
.prop-img-nophoto {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(35, 29, 69, 0.62);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.prop-img-caption {
  font-size: 11px;
  font-weight: 700;
  color: #1f7a66;
  letter-spacing: -0.1px;
  padding: 0 12px;
  text-align: center;
  line-height: 1.3;
}
</style>