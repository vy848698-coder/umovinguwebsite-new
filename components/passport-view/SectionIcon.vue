<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <!-- Gas Safety (CP12) — flame -->
    <path
      v-if="name === 'flame'"
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2 2.5Z"
    />

    <!-- Electrical Safety (EICR) — lightning bolt -->
    <path
      v-else-if="name === 'zap'"
      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14Z"
    />

    <!-- Energy Performance (EPC) — leaf -->
    <template v-else-if="name === 'leaf'">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </template>

    <!-- Smoke & CO Alarms — bell -->
    <template v-else-if="name === 'bell'">
      <path d="M10.27 21a1.94 1.94 0 0 0 3.46 0" />
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    </template>

    <!-- Legionella — droplet -->
    <path
      v-else-if="name === 'droplet'"
      d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"
    />

    <!-- Landlord Insurance — shield -->
    <path
      v-else-if="name === 'shield'"
      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"
    />

    <!-- Tenancy Agreement (AST) — signed document -->
    <template v-else-if="name === 'contract'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h5" />
      <path d="M8 17h3" />
    </template>

    <!-- Deposit Protection — pound sterling -->
    <template v-else-if="name === 'pound'">
      <path d="M18 7c0-2.21-1.79-4-4-4a4 4 0 0 0-4 4v11" />
      <path d="M7 12h7" />
      <path d="M6 20h12" />
    </template>

    <!-- Right to Rent — ID card -->
    <template v-else-if="name === 'id'">
      <rect width="18" height="16" x="3" y="4" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M15 8h3" />
      <path d="M15 12h3" />
      <path d="M6.5 16a3 3 0 0 1 5 0" />
    </template>

    <!-- How to Rent Guide — open book -->
    <path
      v-else-if="name === 'book'"
      d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3Z"
    />

    <!-- Inventory & Schedule — clipboard list -->
    <template v-else-if="name === 'clipboard'">
      <rect width="8" height="4" x="8" y="2" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M8 11h.01" />
      <path d="M11 11h5" />
      <path d="M8 16h.01" />
      <path d="M11 16h5" />
    </template>

    <!-- PAT testing — plug -->
    <path
      v-else-if="name === 'plug'"
      d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"
    />

    <!-- HMO — building -->
    <template v-else-if="name === 'building'">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M9.5 20v-5h5v5" />
    </template>

    <!-- Fallback — document -->
    <template v-else>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M9 15h6" />
    </template>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>
