<template>
  <div class="ag-page">
    <!-- Celebration hero -->
    <div class="ag-hero">
      <div class="ag-emoji">🔓</div>
      <h2 class="ag-title">Access granted</h2>
      <p class="ag-sub">
        <template v-if="request">
          <strong>{{ request.org.name }}</strong> can now read your selected
          financial data. Access expires
          {{ relativeExpiry(request.grant?.expiresAt) }}.
        </template>
        <template v-else>Loading…</template>
      </p>
    </div>

    <!-- Token card -->
    <div v-if="request?.grant" class="ag-token-card">
      <div class="ag-token-label">CONSENT TOKEN ISSUED</div>
      <div class="ag-token-value">{{ tokenSummary }}</div>
      <div class="ag-token-foot">
        This token allows {{ request.org.name }} to call the OpenProperty API
        on your behalf. It cannot be shared or escalated.
      </div>
    </div>

    <!-- What was shared -->
    <span class="sec-label">DATA SHARED WITH {{ orgUpper }}</span>
    <div v-if="request" class="ag-shared-card">
      <div
        v-for="row in sharedRows"
        :key="row.scope"
        class="doc-row"
      >
        <div class="doc-icon">{{ row.icon }}</div>
        <div class="doc-body">
          <div class="doc-title">{{ row.title }}</div>
          <div class="doc-meta">{{ row.meta }}</div>
        </div>
        <span class="risk-pill clear">✓ SHARED</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="ag-actions">
      <button class="cta-btn" @click="goView">Back to my profile</button>
      <button class="cta-btn outline" @click="goShare">
        Manage all access →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  useVerifierAccess,
  type AccessRequest,
} from '~/composables/useVerifierAccess'

definePageMeta({
  title: 'Access Granted — UmovingU',
  middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const { getRequest } = useVerifierAccess()

const request = ref<AccessRequest | null>(null)

onMounted(async () => {
  try {
    request.value = await getRequest(route.params.id as string)
  } catch {
    router.replace('/buyer-profile/view')
  }
})

const orgUpper = computed(() =>
  (request.value?.org.name || '').toUpperCase(),
)

const tokenSummary = computed(() => {
  if (!request.value?.grant) return ''
  const ref = request.value.id.slice(0, 8).toUpperCase()
  const orgSlug = (request.value.org.name.replace(/[^A-Z]/gi, '').slice(0, 3) || 'ORG').toUpperCase()
  const scopes = request.value.grant.scopes.join(',')
  const exp = formatShort(request.value.grant.expiresAt)
  return `umu_consent_${orgSlug}_${ref}_scope:${scopes} · exp:${exp}`
})

const sharedRows = computed(() => {
  if (!request.value?.grant) return []
  const map: Record<string, { icon: string; title: string; meta: string }> = {
    identity: {
      icon: '🪪',
      title: 'Identity',
      meta: 'DVS-certified · Onfido / Persona',
    },
    proof_of_deposit: {
      icon: '🏦',
      title: 'Proof of deposit',
      meta: 'Bank verified · Armalytix',
    },
    source_of_funds: {
      icon: '🛡️',
      title: 'Source of funds',
      meta: 'AML clear · Armalytix',
    },
    affordability: {
      icon: '📊',
      title: 'Affordability',
      meta: 'Score + stress test · Armalytix',
    },
    credit_file: {
      icon: '📋',
      title: 'Credit file',
      meta: 'Experian · soft search',
    },
    purchase_profile: {
      icon: '🔗',
      title: 'Purchase profile',
      meta: 'Chain, timeline, property type',
    },
    story: {
      icon: '✍️',
      title: 'Personal story',
      meta: 'Your optional note',
    },
  }
  return request.value.grant.scopes.map((s) => ({
    scope: s,
    ...map[s as keyof typeof map],
  })).filter((r) => r.title)
})

function relativeExpiry(iso: string | null | undefined) {
  if (!iso) return 'soon'
  const days = Math.max(
    1,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000),
  )
  if (days === 1) return 'tomorrow'
  return `in ${days} days`
}
function formatShort(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function goView() { router.push('/buyer-profile/view') }
function goShare() { router.push('/buyer-profile/share') }
</script>

<style scoped>
.ag-page {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 86% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: #231d45;
  max-width: none;
  width: 100%;
  margin: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding-top: calc(20px + env(safe-area-inset-top));
  padding-left: 14px;
  padding-right: 14px;
  padding-bottom: 32px;
}

.ag-hero {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 40px 0 0; text-align: center;
}
.ag-emoji {
  font-size: 56px; line-height: 1; margin-bottom: 14px;
  display: inline-block;
  animation: ag-pop 0.5s ease-out 0.05s both;
}
@keyframes ag-pop {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}
.ag-title {
  font-size: 22px; font-weight: 800; color: #231d45;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
  animation: ag-fadeUp 0.4s 0.15s both;
}
.ag-sub {
  font-size: 13px; color: #6b6783; line-height: 1.5;
  animation: ag-fadeUp 0.4s 0.2s both;
}
@keyframes ag-fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Navy token card */
.ag-token-card {
  width: min(100%, 980px);
  margin: 24px auto 0;
  background: #231d45;
  border-radius: 16px;
  padding: 16px;
  animation: ag-fadeUp 0.4s 0.25s both;
}
.ag-token-label {
  font-size: 9px; font-weight: 800; letter-spacing: 1.2px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  text-transform: uppercase;
}
.ag-token-value {
  font-family: 'SF Mono', Menlo, monospace;
  font-size: 10px;
  color: #5eead4;
  word-break: break-all;
  line-height: 1.6;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  padding: 10px;
}
.ag-token-foot {
  margin-top: 10px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.4;
}

/* Section label */
.sec-label {
  font-size: 11px; font-weight: 800;
  color: #6b6783; letter-spacing: 1px;
  text-transform: uppercase;
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 16px 0 8px;
  display: block;
  animation: ag-fadeDown 0.4s 0.3s both;
}
@keyframes ag-fadeDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Shared-data card */
.ag-shared-card {
  width: min(100%, 980px);
  margin: 0 auto;
  background: white;
  border: 1.5px solid #ececef;
  border-radius: 14px;
  overflow: hidden;
  animation: ag-fadeUp 0.4s 0.3s both;
}
.doc-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f7;
}
.doc-row:last-child { border-bottom: none; }
.doc-icon {
  width: 32px; height: 32px; border-radius: 10px;
  background: #f2faf8;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
}
.doc-body { flex: 1; min-width: 0; }
.doc-title {
  font-size: 13.5px; font-weight: 800; color: #231d45;
}
.doc-meta {
  font-size: 11px; color: #6b6783; margin-top: 1px;
}
.risk-pill {
  font-size: 10px; font-weight: 800;
  padding: 4px 8px; border-radius: 100px;
  white-space: nowrap; letter-spacing: 0.3px;
}
.risk-pill.clear {
  background: #f2faf8; color: #007e78; border: 1px solid #e5f4f2;
}

/* Actions */
.ag-actions {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 14px 0 0;
  display: flex; flex-direction: column; gap: 8px;
  animation: ag-fadeUp 0.4s 0.35s both;
}
.cta-btn {
  width: 100%;
  background: #00a19a; color: white; border: none;
  border-radius: 14px; padding: 16px;
  font-family: inherit; font-size: 14px; font-weight: 800;
  box-shadow: 0 4px 16px rgba(0, 161, 154, 0.35);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.cta-btn:hover {
  background: #00b6ae;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(0, 161, 154, 0.32);
}
.cta-btn.outline {
  background: white; color: #231d45;
  border: 1.5px solid #231d45;
  box-shadow: none;
  font-size: 13px; padding: 13px;
}

@media (min-width: 1024px) {
  .ag-page {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 34px;
  }

  .ag-hero,
  .ag-token-card,
  .sec-label,
  .ag-shared-card,
  .ag-actions {
    width: min(100%, 1080px);
  }

  .ag-token-card,
  .ag-shared-card {
    border-radius: 18px;
  }

  .ag-title {
    font-size: 28px;
  }
}

@media (max-width: 700px) {
  .ag-page {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 24px;
  }

  .ag-hero {
    padding-top: 32px;
  }
}
</style>
