<template>
  <div class="cal-page mobile-container">
    <WebTopNav>
      <template #actions>
        <button class="cal-quick-btn" type="button" @click="navigateTo('/profile')">Profile</button>
        <button class="cal-quick-btn solid" type="button" @click="navigateTo('/profile/support')">Support</button>
      </template>
    </WebTopNav>

    <main class="cal-body">
      <div class="atm-bg atm-bg-violet" />

      <!-- Toolbar: month title + controls -->
      <div class="cal-toolbar">
        <div class="cal-toolbar-left">
          <h1 class="cal-month-title">{{ monthLabel }}</h1>
          <div class="cal-stats">
            <span class="cal-stat">
              <span class="stat-num">{{ countThisWeek }}</span>this week
            </span>
            <span class="cal-stat">
              <span class="stat-num teal">{{ countViewings }}</span>viewings
            </span>
            <span class="cal-stat">
              <span class="stat-num coral">{{ countDeadlines }}</span>deadlines
            </span>
          </div>
        </div>

        <div class="cal-controls">
          <button class="cal-ctrl-icon" @click="prevMonth" aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button class="cal-ctrl-today" @click="goToday" type="button">Today</button>
          <button class="cal-ctrl-icon" @click="nextMonth" aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button class="cal-ctrl-view" type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Month
            <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Full month grid -->
      <div class="cal-month">
        <div class="cal-week-head">
          <div v-for="d in DAY_HEADERS" :key="d" class="cal-week-head-cell">{{ d }}</div>
        </div>
        <div class="cal-month-grid">
          <button
            v-for="(cell, i) in calendarCells"
            :key="i"
            type="button"
            class="cal-cell"
            :class="cellClasses(cell)"
            @click="selectDate(cell)"
          >
            <span class="cal-cell-num">{{ cell.day }}</span>
            <span
              v-if="isSelectedCell(cell)"
              class="cal-cell-add"
              role="button"
              aria-label="Add event"
              @click.stop="openAddDrawer(cell.dateStr)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            <div v-if="cellReminders(cell.dateStr).length" class="cal-cell-events">
              <span
                v-for="r in cellReminders(cell.dateStr).slice(0, 3)"
                :key="r.id"
                class="cal-cell-chip"
                :class="eventTone(r)"
              >
                <span v-if="r.time" class="cal-cell-chip-time">{{ r.time }}</span>{{ r.title }}
              </span>
              <span v-if="cellReminders(cell.dateStr).length > 3" class="cal-cell-more">
                +{{ cellReminders(cell.dateStr).length - 3 }} more
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="cal-empty">Loading…</div>

      <!-- Agenda groups -->
      <template v-else-if="groupedDates.length > 0">
        <div v-for="group in groupedDates" :key="group.dateStr">
          <div class="cal-agenda-heading">
            {{ group.isToday ? 'Today' : group.label }}
            <span v-if="!group.isToday" class="agenda-day">
              · {{ group.label }}
            </span>
          </div>

          <div
            v-for="r in group.reminders"
            :key="r.id"
            class="cal-event"
            :class="eventTone(r)"
          >
            <div class="cal-event-time">
              {{ r.time || 'All day' }}
              <div class="cal-event-time-small">{{ eventDuration(r) }}</div>
            </div>
            <div class="cal-event-content">
              <div class="cal-event-title">{{ r.title }}</div>
              <div v-if="r.notes" class="cal-event-meta">{{ r.notes }}</div>
              <span class="cal-event-tag" :class="eventTone(r)">
                {{ eventTagLabel(r) }}
              </span>
            </div>
            <button
              type="button"
              class="cal-event-delete"
              aria-label="Delete"
              @click="confirmDelete(r.id)"
            >
              ×
            </button>
          </div>
        </div>
      </template>

      <div v-else class="cal-empty cal-empty--state">
        <div class="cal-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div class="cal-empty-title">Nothing scheduled</div>
        <div class="cal-empty-sub">Your schedule is clear. Add a new event to get started.</div>
      </div>
    </main>

    <!-- Floating add button -->
    <button class="fab" aria-label="Add event" @click="openAddDrawer()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>

    <!-- New Event Modal -->
    <Teleport to="body">
      <div v-if="showDrawer" class="modal-overlay" @click.self="closeDrawer">
        <div class="modal">
          <div class="modal-handle" />
          <div class="modal-header">
            <div class="modal-title">New event</div>
            <button class="modal-close" type="button" aria-label="Close" @click="closeDrawer">×</button>
          </div>

          <div class="modal-body">
            <div class="mform-section">
              <div class="mform-label">Title</div>
              <input
                v-model="form.title"
                class="mform-input"
                type="text"
                placeholder="What's happening?"
              />
            </div>

            <div class="mform-section">
              <div class="mform-label">Type</div>
              <div class="mform-radio-group">
                <button
                  v-for="t in eventTypes"
                  :key="t.value"
                  type="button"
                  class="mform-radio"
                  :class="[t.value, { active: form.eventType === t.value }]"
                  @click="form.eventType = t.value"
                >
                  <div class="mfr-icon" v-html="t.icon" />
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div class="mform-section">
              <div class="mform-label">When</div>
              <div class="mform-when-row">
                <input
                  v-model="form.date"
                  class="mform-input"
                  type="date"
                />
                <input
                  v-model="form.time"
                  class="mform-input"
                  type="time"
                  placeholder="Time"
                />
              </div>
              <div class="mform-when-row mform-when-row--bottom">
                <select v-model="form.duration" class="mform-input">
                  <option value="">No duration</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
                <button
                  type="button"
                  class="mform-radio"
                  :class="{ active: form.repeats === 'annually' }"
                  style="justify-content: center;"
                  @click="form.repeats = form.repeats === 'annually' ? 'never' : 'annually'"
                >
                  {{ form.repeats === 'annually' ? '✓ Repeats yearly' : '+ Repeat yearly' }}
                </button>
              </div>
            </div>

            <div class="mform-section">
              <div class="mform-label">Notes (optional)</div>
              <input
                v-model="form.notes"
                class="mform-input"
                type="text"
                placeholder="Any reminders or details…"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-secondary" type="button" @click="closeDrawer">Cancel</button>
            <button
              class="btn-primary"
              type="button"
              :disabled="!form.title.trim() || !form.date || isSaving"
              @click="saveReminder"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ isSaving ? 'Saving…' : 'Save event' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ───────────────────────────── FOOTER ───────────────────────────── -->
    <footer class="cal-footer">
      <div class="cal-footer-grid">
        <div class="cal-footer-intro">
          <div class="cal-footer-brand">
            <img src="/logo-new.png" alt="" class="cal-footer-logo" />
            <strong>umovingu</strong>
          </div>
          <p>The consumer-side property passport. Free HomeScore, solicitor-grade Passport, ready before your first viewing.</p>
          <div class="cal-footer-chips">
            <span>OPDA standard</span>
            <span>Property Redress Scheme</span>
            <span>HM Land Registry</span>
          </div>
        </div>

        <div class="cal-footer-col">
          <h5>Product</h5>
          <button type="button" @click="navigateTo('/homescore')">HomeScore</button>
          <button type="button" @click="navigateTo('/passport')">Property Passport</button>
          <button type="button" @click="navigateTo('/marketplace')">Marketplace</button>
          <button type="button" @click="navigateTo('/explore')">Explore</button>
        </div>

        <div class="cal-footer-col">
          <h5>Account</h5>
          <button type="button" @click="navigateTo('/profile')">Profile</button>
          <button type="button" @click="navigateTo('/profile/personal-information')">Personal info</button>
          <button type="button" @click="navigateTo('/profile/support')">Support</button>
        </div>

        <div class="cal-footer-col">
          <h5>Legal</h5>
          <button type="button" @click="navigateTo('/legal/terms')">Terms of Service</button>
          <button type="button" @click="navigateTo('/legal/privacy')">Privacy Policy</button>
          <button type="button" @click="navigateTo('/legal/cookies')">Cookie preferences</button>
        </div>
      </div>
      <div class="cal-footer-bottom">© 2026 umovingu. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import WebTopNav from '~/components/core/WebTopNav.vue'

definePageMeta({ title: 'Calendar - UmovingU', middleware: 'auth' })

const {
  reminders,
  isLoading,
  reminderDateSet,
  remindersByDate,
  fetchReminders,
  createReminder,
  deleteReminder,
} = useCalendar()

const {
  permissionGranted,
  requestPermission,
  scheduleReminder,
  cancelReminder,
} = useLocalNotifications()

// ─── Calendar state ────────────────────────────────────────────────────────
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth() + 1) // 1-based
const selectedDateStr = ref<string | null>(null)

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dayHeaders = DAY_HEADERS

const monthLabel = computed(
  () => `${MONTH_NAMES[viewMonth.value - 1]} ${viewYear.value}`,
)

const todayStr = computed(
  () =>
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
)

interface CalCell {
  day: number
  dateStr: string
  outside: boolean
}

const pad = (n: number) => String(n).padStart(2, '0')

const calendarCells = computed<CalCell[]>(() => {
  const firstDay = new Date(Date.UTC(viewYear.value, viewMonth.value - 1, 1))
  const startOffset = (firstDay.getUTCDay() + 6) % 7
  const daysInMonth = new Date(
    Date.UTC(viewYear.value, viewMonth.value, 0),
  ).getUTCDate()

  const cells: CalCell[] = []

  // Leading days from the previous month
  if (startOffset > 0) {
    const prevDays = new Date(
      Date.UTC(viewYear.value, viewMonth.value - 1, 0),
    ).getUTCDate()
    let pm = viewMonth.value - 1
    let py = viewYear.value
    if (pm === 0) {
      pm = 12
      py--
    }
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevDays - i
      cells.push({ day: d, dateStr: `${py}-${pad(pm)}-${pad(d)}`, outside: true })
    }
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      dateStr: `${viewYear.value}-${pad(viewMonth.value)}-${pad(d)}`,
      outside: false,
    })
  }

  // Trailing days from the next month to complete the final week
  let nm = viewMonth.value + 1
  let ny = viewYear.value
  if (nm === 13) {
    nm = 1
    ny++
  }
  let nd = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: nd, dateStr: `${ny}-${pad(nm)}-${pad(nd)}`, outside: true })
    nd++
  }

  return cells
})

const isSelectedCell = (cell: CalCell) => cell.dateStr === selectedDateStr.value

const cellReminders = (dateStr: string) => remindersByDate.value[dateStr] ?? []

const selectDate = (cell: CalCell) => {
  selectedDateStr.value = selectedDateStr.value === cell.dateStr ? null : cell.dateStr
}

const goToday = async () => {
  const changed =
    viewYear.value !== today.getFullYear() ||
    viewMonth.value !== today.getMonth() + 1
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth() + 1
  selectedDateStr.value = todayStr.value
  if (changed) await fetchReminders(viewYear.value, viewMonth.value)
}

const prevMonth = async () => {
  if (viewMonth.value === 1) {
    viewMonth.value = 12
    viewYear.value--
  } else viewMonth.value--
  await fetchReminders(viewYear.value, viewMonth.value)
}

const nextMonth = async () => {
  if (viewMonth.value === 12) {
    viewMonth.value = 1
    viewYear.value++
  } else viewMonth.value++
  await fetchReminders(viewYear.value, viewMonth.value)
}

// ─── Filters ───────────────────────────────────────────────────────────────
const filters = [
  { key: 'manual', label: 'Manually by you' },
  { key: 'tradesperson', label: 'Tradesperson appointments' },
  { key: 'business', label: 'Important business dates' },
]
const activeFilter = ref<string>('all')

// ─── Event list ────────────────────────────────────────────────────────────
const filteredReminders = computed(() => {
  if (activeFilter.value === 'all') return reminders.value
  return reminders.value.filter((r) => r.type === activeFilter.value)
})

const groupedDates = computed(() => {
  const map: Record<string, typeof reminders.value> = {}

  for (const r of filteredReminders.value) {
    // If a date is selected, only show that date
    const key = r.date.slice(0, 10)
    if (selectedDateStr.value && key !== selectedDateStr.value) continue
    if (!map[key]) map[key] = []
    map[key].push(r)
  }

  return Object.keys(map)
    .sort()
    .map((dateStr) => {
      const d = new Date(dateStr + 'T00:00:00Z')
      const day = d.getUTCDate()
      const month = MONTH_NAMES[d.getUTCMonth()]
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        d.getUTCDay()
      ]
      return {
        dateStr,
        label: `${month} ${day} · ${dayName}`,
        isToday: dateStr === todayStr.value,
        reminders: map[dateStr],
      }
    })
})

// ─── Card colours ──────────────────────────────────────────────────────────
const getCardClass = (type: string) => {
  if (type === 'manual') return 'bg-[#00A19A]'
  if (type === 'tradesperson') return 'bg-brand-aqua'
  return 'bg-[#f6f6f7] border border-[#e5e5ea]'
}

const getCardTitle = (type: string) =>
  type === 'business' ? 'text-[#1f2024]' : 'text-white'

const getCardTextMuted = (type: string) =>
  type === 'business' ? 'text-[#8f9094]' : 'text-white/70'

// ─── Prototype hero stats + event tones ───────────────────────────────────
const eventTone = (r: any): string => {
  const t = (r.type || '').toLowerCase()
  if (t.includes('viewing')) return 'viewing'
  if (t.includes('compliance') || t.includes('expiry') || t.includes('expir'))
    return 'compliance'
  if (t.includes('deadline') || t.includes('mortgage') || t.includes('aip'))
    return 'deadline'
  return 'personal'
}
const eventTagLabel = (r: any): string => {
  const tone = eventTone(r)
  if (tone === 'viewing') return 'Viewing'
  if (tone === 'compliance') return 'Compliance'
  if (tone === 'deadline') return 'Deadline'
  return 'Personal'
}
const eventDuration = (r: any): string =>
  r.durationMinutes ? `${r.durationMinutes} min` : ''

const dayDotTone = (dateStr: string) => {
  const r = reminders.value.find((x: any) => x.date.slice(0, 10) === dateStr)
  if (!r) return ''
  const tone = eventTone(r)
  return tone === 'compliance' || tone === 'deadline' ? 'warn' : 'ok'
}

const cellClasses = (cell: CalCell) => {
  const classes: string[] = []
  if (cell.outside) classes.push('outside')
  if (cell.dateStr === todayStr.value) classes.push('today')
  if (isSelectedCell(cell)) classes.push('selected')
  if (reminderDateSet.value.has(cell.dateStr)) classes.push('has-event')
  if (dayDotTone(cell.dateStr) === 'warn') classes.push('has-event-warn')
  return classes.join(' ')
}

const startOfWeek = computed(() => {
  const d = new Date()
  const dow = (d.getDay() + 6) % 7 // Mon-first
  d.setDate(d.getDate() - dow)
  d.setHours(0, 0, 0, 0)
  return d
})
const endOfWeek = computed(() => {
  const d = new Date(startOfWeek.value)
  d.setDate(d.getDate() + 7)
  return d
})
const inThisWeek = (r: any) => {
  const t = new Date(r.date).getTime()
  return t >= startOfWeek.value.getTime() && t < endOfWeek.value.getTime()
}
const countThisWeek = computed(() => reminders.value.filter(inThisWeek).length)
const countViewings = computed(
  () => reminders.value.filter((r: any) => eventTone(r) === 'viewing').length,
)
const countDeadlines = computed(
  () =>
    reminders.value.filter((r: any) =>
      ['deadline', 'compliance'].includes(eventTone(r)),
    ).length,
)

// ─── Delete ────────────────────────────────────────────────────────────────
const confirmDelete = async (id: string) => {
  if (confirm('Delete this reminder?')) {
    // Cancel the scheduled notification before removing from DB
    await cancelReminder(id)
    await deleteReminder(id)
  }
}

// ─── Add drawer ────────────────────────────────────────────────────────────
const showDrawer = ref(false)
const isSaving = ref(false)

const defaultForm = () => ({
  title: '',
  date: selectedDateStr.value ?? todayStr.value,
  time: '',
  repeats: 'never',
  notes: '',
  eventType: 'personal',
  duration: '',
})

const form = ref(defaultForm())

const eventTypes = [
  {
    value: 'viewing',
    label: 'Viewing',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  },
  {
    value: 'personal',
    label: 'Personal',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  },
  {
    value: 'deadline',
    label: 'Deadline',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  },
  {
    value: 'compliance',
    label: 'Compliance',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/></svg>',
  },
]

const openAddDrawer = (prefilledDate?: string) => {
  form.value = defaultForm()
  if (prefilledDate) form.value.date = prefilledDate
  showDrawer.value = true
}

const closeDrawer = () => {
  showDrawer.value = false
}

const saveReminder = async () => {
  if (!form.value.title.trim() || !form.value.date) return
  isSaving.value = true
  try {
    const created = await createReminder({
      title: form.value.title.trim(),
      date: form.value.date,
      time: form.value.time || undefined,
      repeats: form.value.repeats,
      notes: form.value.notes || undefined,
      type: form.value.eventType || 'personal',
    })
    // Schedule a local device notification for the saved reminder
    if (created) {
      await scheduleReminder({
        id: created.id,
        title: created.title,
        date: created.date.slice(0, 10),
        time: created.time ?? undefined,
        notes: created.notes ?? undefined,
      })
    }
    closeDrawer()
  } finally {
    isSaving.value = false
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  // Request notification permission on first open (iOS/Android only — no-op on web)
  await requestPermission()
  selectedDateStr.value = todayStr.value
  await fetchReminders(viewYear.value, viewMonth.value)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.cal-page {
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  --fx-text: #1f2b3f;
  min-height: 100dvh;
  background: #f3f2ef;
  color: var(--fx-text);
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.cal-body {
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 22px 28px 96px;
}
.atm-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  pointer-events: none;
  z-index: 0;
}
.atm-bg.atm-bg-violet {
  background: radial-gradient(circle at 92% 8%, rgba(208, 236, 255, 0.32) 0%, rgba(208, 236, 255, 0) 48%);
}

/* ── Toolbar ─────────────────────────────────────────────── */
.cal-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 18px;
  position: relative;
  z-index: 1;
}
.cal-toolbar-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cal-month-title {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 34px;
  line-height: 1;
  letter-spacing: -0.9px;
  font-weight: 800;
  color: #10263d;
}
.cal-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.cal-stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #dfe8f3;
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12.5px;
  font-weight: 700;
  color: #50637a;
  letter-spacing: -0.2px;
}
.cal-stat .stat-num {
  color: #17314a;
  font-weight: 800;
  font-feature-settings: 'tnum';
}
.cal-stat .stat-num.teal { color: #067a74; }
.cal-stat .stat-num.coral { color: #b85b36; }

.cal-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.cal-ctrl-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #dde7f2;
  background: #fff;
  color: #17314a;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.cal-ctrl-icon:hover { border-color: #b9d5ea; box-shadow: 0 8px 16px rgba(19, 48, 71, 0.08); }
.cal-ctrl-icon svg { width: 16px; height: 16px; }
.cal-ctrl-today {
  height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid #dde7f2;
  background: #fff;
  color: #1a6cc4;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.cal-ctrl-today:hover { border-color: #b9d5ea; box-shadow: 0 8px 16px rgba(19, 48, 71, 0.08); }
.cal-ctrl-view {
  height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid #dde7f2;
  background: #fff;
  color: #17314a;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.cal-ctrl-view:hover { border-color: #b9d5ea; box-shadow: 0 8px 16px rgba(19, 48, 71, 0.08); }
.cal-ctrl-view svg { width: 16px; height: 16px; }
.cal-ctrl-view .chev { width: 14px; height: 14px; color: #7f91a8; }

/* ── Month grid ──────────────────────────────────────────── */
.cal-month {
  border-radius: 20px;
  border: 1px solid #dfe8f3;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 14px 40px rgba(18, 55, 88, 0.08);
  position: relative;
  z-index: 1;
}
.cal-week-head {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: #141a38;
}
.cal-week-head-cell {
  padding: 16px 18px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}
.cal-month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.cal-cell {
  position: relative;
  min-height: 116px;
  border: none;
  border-right: 1px solid #eef3f9;
  border-bottom: 1px solid #eef3f9;
  background: #fff;
  text-align: left;
  cursor: pointer;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: inherit;
  transition: background 0.15s;
}
.cal-cell:nth-child(7n) { border-right: none; }
.cal-cell:hover { background: #f6faff; }
.cal-cell-num {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #17314a;
  line-height: 1;
}
.cal-cell.outside { background: #fafbfd; }
.cal-cell.outside .cal-cell-num { color: #b6c2d2; }
.cal-cell.outside:hover { background: #f3f6fb; }
.cal-cell.today .cal-cell-num { color: #067a74; }
.cal-cell.selected {
  background: #00a19a;
}
.cal-cell.selected:hover {
  background: #00a19a;
}
.cal-cell.selected .cal-cell-num { color: #fff; }
.cal-cell-add {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #fff;
  color: #0a8b84;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  box-shadow: 0 6px 14px rgba(8, 50, 80, 0.18);
  transition: transform 0.16s;
}
.cal-cell-add:hover { transform: scale(1.06); }
.cal-cell-add svg { width: 16px; height: 16px; }
.cal-cell-events {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}
.cal-cell-chip {
  font-size: 11px;
  font-weight: 700;
  color: #1f7a66;
  background: #e2f1ea;
  border-radius: 6px;
  padding: 3px 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
}
.cal-cell-chip-time { font-weight: 800; margin-right: 4px; opacity: 0.8; }
.cal-cell-chip.viewing { background: #e2f1ea; color: #1f7a66; }
.cal-cell-chip.compliance { background: #ffe9dd; color: #b85b36; }
.cal-cell-chip.deadline { background: #fef3c7; color: #92400e; }
.cal-cell-chip.personal { background: #ede5ff; color: #6b4e9f; }
.cal-cell.selected .cal-cell-chip {
  background: rgba(255, 255, 255, 0.92);
  color: #17314a;
}
.cal-cell-more {
  font-size: 10px;
  font-weight: 700;
  color: #7f91a8;
}
.cal-cell.selected .cal-cell-more { color: rgba(255, 255, 255, 0.85); }

.cal-agenda-heading {
  margin-top: 24px;
  padding: 3px 2px 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #71849b;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}
.cal-agenda-heading .agenda-day { color: #067a74; }

.cal-event {
  margin: 0 0 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f3;
  border-left: 4px solid #3dbda3;
  border-radius: 16px;
  padding: 10px 12px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;
  align-items: center;
  z-index: 1;
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
}
.cal-event.viewing { border-left-color: #3dbda3; }
.cal-event.compliance { border-left-color: #ff8b5a; }
.cal-event.deadline { border-left-color: #f5c44c; }
.cal-event.personal { border-left-color: #9d7bff; }
.cal-event:hover {
  transform: translateY(-2px);
  border-color: #b9d5ea;
  box-shadow: 0 14px 24px rgba(21, 58, 95, 0.12);
}
.cal-event-time {
  font-size: 11px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.1px;
  font-feature-settings: 'tnum';
  flex-shrink: 0;
  text-align: right;
  width: 56px;
}
.cal-event-time-small {
  font-size: 9px;
  font-weight: 700;
  color: #7f91a8;
  margin-top: 1px;
}
.cal-event-content { flex: 1; min-width: 0; }
.cal-event-title {
  font-size: 13px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.2px;
  line-height: 1.2;
}
.cal-event-meta {
  font-size: 11px;
  font-weight: 600;
  color: #627891;
  margin-top: 2px;
  line-height: 1.35;
}
.cal-event-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 100px;
  margin-top: 5px;
  display: inline-block;
}
.cal-event-tag.viewing { background: #e2f1ea; color: #1f7a66; }
.cal-event-tag.compliance { background: #ffe9dd; color: #b85b36; }
.cal-event-tag.deadline { background: #fef3c7; color: #92400e; }
.cal-event-tag.personal { background: #ede5ff; color: #6b4e9f; }

.cal-event-delete {
  background: transparent;
  border: none;
  color: #9cb0c8;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  flex-shrink: 0;
}
.cal-event-delete:hover { color: #ff8b5a; }

.cal-empty {
  text-align: center;
  padding: 30px 4px;
  color: #7388a1;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}
.cal-empty--state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 56px 4px 40px;
}
.cal-empty-icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #18a99c;
  margin-bottom: 4px;
}
.cal-empty-icon svg { width: 32px; height: 32px; }
.cal-empty-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.3px;
}
.cal-empty-sub {
  font-size: 13px;
  font-weight: 600;
  color: #8294aa;
}

.fab {
  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  bottom: calc(18px + env(safe-area-inset-bottom));
  z-index: 20;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(150deg, #16b3a6 0%, #0a8f9a 100%);
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 30px rgba(58, 87, 206, 0.34);
  filter: saturate(1.04);
}
.fab svg { width: 22px; height: 22px; }

.modal-overlay {
  /* The modal is teleported to <body>, outside .cal-page — redeclare the
     brand variables here so the gradient buttons render correctly. */
  --fx-aqua: #00a19a;
  --fx-blue: #2f9bdf;
  --fx-indigo: #4f4ff2;
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 70;
}
.modal {
  width: 100%;
  max-width: 28rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  max-height: min(92vh, 760px);
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(14, 40, 64, 0.28);
  animation: modal-pop 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes modal-pop {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes modal-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.modal-handle {
  display: none;
  width: 36px;
  height: 4px;
  background: #ccd7e6;
  border-radius: 100px;
  margin: 8px auto 0;
}
.modal-header {
  display: flex;
  align-items: center;
  padding: 12px 18px 10px;
}
.modal-title {
  flex: 1;
  font-size: 18px;
  font-weight: 800;
  color: #17314a;
  letter-spacing: -0.4px;
}
.modal-close {
  width: 30px;
  height: 30px;
  border-radius: 12px;
  border: none;
  background: rgba(228, 247, 243, 0.96);
  color: #067a74;
  font-size: 20px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 18px 14px;
}
.modal-footer {
  padding: 12px 18px calc(14px + env(safe-area-inset-bottom));
  border-top: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  display: flex;
  gap: 8px;
}

.mform-section { margin-bottom: 14px; }
.mform-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: #71849b;
  margin-bottom: 8px;
}
.mform-input {
  width: 100%;
  background: #fff;
  border: 1px solid #d9e4f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #17314a;
  outline: none;
}
.mform-input:focus { border-color: #7da7cf; }
.mform-input::placeholder { color: #8a95a0; font-weight: 500; }

.mform-when-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mform-when-row--bottom {
  grid-template-columns: 1fr 1fr;
  margin-top: 8px;
}
.mform-when-row > .mform-input,
.mform-when-row > select.mform-input {
  min-width: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  text-align: left;
}
.mform-when-row > .mform-radio {
  min-width: 0;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mform-radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.mform-radio {
  background: #fff;
  border: 1px solid #d9e4f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #17314a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  text-align: left;
}
.mform-radio:hover {
  border-color: #b9d5ea;
  transform: translateY(-1px);
}
.mform-radio.active {
  border-color: #3dbda3;
  background: #f1f9f4;
  color: #1f7a66;
}
.mform-radio.viewing.active { border-color: #3dbda3; background: #f1f9f4; color: #1f7a66; }
.mform-radio.viewing.active .mfr-icon { background: #3dbda3; color: #fff; }
.mform-radio.personal.active { border-color: #9d7bff; background: #ede5ff; color: #6b4e9f; }
.mform-radio.personal.active .mfr-icon { background: #9d7bff; color: #fff; }
.mform-radio.deadline.active { border-color: #f5c44c; background: #fef3c7; color: #92400e; }
.mform-radio.deadline.active .mfr-icon { background: #f5c44c; color: #6f4d14; }
.mform-radio.compliance.active { border-color: #ff8b5a; background: #ffe9dd; color: #b85b36; }
.mform-radio.compliance.active .mfr-icon { background: #ff8b5a; color: #fff; }

.mfr-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #eaf6f2;
  color: #067a74;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mfr-icon svg { width: 13px; height: 13px; }

.btn-secondary {
  flex: 1;
  background: #fff;
  color: #17314a;
  border: 1px solid #d6e3f0;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
}
.btn-primary {
  flex: 2;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 14px 24px rgba(58, 87, 206, 0.28);
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
.btn-primary svg { width: 14px; height: 14px; }

/* match the explore page's cream background on the navbar */
.cal-page :deep(.webtop-nav) {
  background: rgba(243, 242, 239, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(35, 29, 69, 0.07);
}

.cal-quick-btn {
  border-radius: 12px;
  border: 1px solid #d4dfeb;
  background: #fff;
  color: #1f2b3f;
  font-family: inherit;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 14px;
  font-size: 14px;
}
.cal-quick-btn.solid {
  border: 1px solid transparent;
  color: #fff;
  background: #00a19a;
  box-shadow: 0 12px 24px rgba(0, 161, 154, 0.2);
}

/* ── Footer ─────────────────────────────────────────────── */
.cal-footer {
  position: relative;
  z-index: 1;
  flex: 1 0 auto;
  background: linear-gradient(155deg, #1a1838 0%, #15132e 100%);
  color: #fff;
  padding: 56px 0 28px;
}
.cal-footer-grid,
.cal-footer-bottom {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-left: 22px;
  padding-right: 22px;
}
.cal-footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 28px;
  padding-bottom: 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.cal-footer-brand { display: inline-flex; align-items: center; gap: 9px; margin-bottom: 14px; }
.cal-footer-logo {
  height: 32px; width: auto; display: block; object-fit: contain; flex-shrink: 0;
}
.cal-footer-brand strong { font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.cal-footer-intro p { font-size: 13px; line-height: 1.65; color: rgba(255, 255, 255, 0.6); margin: 0 0 16px; max-width: 34ch; }
.cal-footer-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cal-footer-chips span {
  font-size: 10.5px; font-weight: 700; color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 7px; padding: 5px 9px;
}
.cal-footer-col h5 {
  margin: 2px 0 14px;
  font-size: 12px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}
.cal-footer-col button {
  display: block;
  border: 0; background: transparent;
  font-family: inherit; font-size: 13.5px; font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
  padding: 0; margin-bottom: 11px; cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}
.cal-footer-col button:hover { color: #2fe0bd; }
.cal-footer-bottom {
  padding-top: 22px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 1024px) {
  .cal-footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .cal-footer-grid { grid-template-columns: 1fr; gap: 22px; }
  .cal-footer-grid, .cal-footer-bottom { padding-left: 16px; padding-right: 16px; }
}

@media (max-width: 720px) {
  .cal-body {
    padding: 16px 14px 96px;
  }
  .cal-toolbar {
    flex-direction: column;
    gap: 14px;
  }
  .cal-controls {
    align-self: stretch;
  }
  .cal-ctrl-today { flex: 1; }
  .cal-ctrl-view { margin-left: auto; }
  .cal-month-title { font-size: 26px; }

  .cal-week-head-cell {
    padding: 10px 6px;
    font-size: 9px;
    letter-spacing: 0.6px;
    text-align: center;
  }
  .cal-cell {
    min-height: 64px;
    padding: 6px 6px;
    gap: 3px;
    align-items: center;
  }
  .cal-cell-num { font-size: 12px; }
  .cal-cell-add {
    width: 26px;
    height: 26px;
    border-radius: 8px;
  }
  .cal-cell-add svg { width: 13px; height: 13px; }
  /* Event chips get noisy at phone widths — collapse to dots */
  .cal-cell-events {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
  }
  .cal-cell-chip {
    width: 5px;
    height: 5px;
    padding: 0;
    border-radius: 50%;
    font-size: 0;
    overflow: hidden;
  }
  .cal-cell-chip-time { display: none; }
  .cal-cell-more { display: none; }

  .cal-event {
    padding: 13px 13px;
    gap: 11px;
    border-radius: 17px;
  }
  .cal-event-time { width: 52px; }

  .mform-when-row--bottom {
    grid-template-columns: 1fr;
  }

  /* Bottom-sheet treatment on phones */
  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .modal {
    max-width: none;
    border-radius: 24px 24px 0 0;
    max-height: 92vh;
    animation: modal-up 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .modal-handle {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cal-ctrl-icon,
  .cal-cell,
  .cal-cell-add,
  .cal-event,
  .fab,
  .mform-radio,
  .modal {
    transition: none;
    animation: none;
  }
}
</style>
