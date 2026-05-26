<template>
  <div class="cal-page mobile-container">
    <!-- Nav bar -->
    <div class="cal-nav-bar">
      <button class="cal-nav-icon-btn" aria-label="Back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <div class="cal-nav-title">Calendar</div>
      <button class="cal-nav-icon-btn" aria-label="Filter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
      </button>
    </div>

    <main class="cal-body">
      <div class="atm-bg atm-bg-violet" />

      <!-- Hero -->
      <div class="cal-hero">
        <div class="cal-monthnav">
          <button class="cal-arrow" @click="prevMonth" aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2>{{ monthLabel }}</h2>
          <button class="cal-arrow" @click="nextMonth" aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div class="hero-stats hero-stats--compact">
          <span><span class="stat-num">{{ countThisWeek }}</span>this week</span>
          <span class="stat-sep" />
          <span><span class="stat-num teal">{{ countViewings }}</span>viewings</span>
          <span class="stat-sep" />
          <span><span class="stat-num coral">{{ countDeadlines }}</span>deadlines</span>
        </div>
      </div>

      <!-- Mini month grid -->
      <div class="cal-grid">
        <div v-for="d in DAY_HEADERS" :key="d" class="cal-dow">{{ d }}</div>
        <template v-for="(cell, i) in calendarCells" :key="i">
          <button
            v-if="cell"
            type="button"
            class="cal-day"
            :class="cellClasses(cell)"
            @click="selectDate(cell)"
          >
            <span class="cal-day-num">{{ cell.day }}</span>
            <span v-if="reminderDateSet.has(cell.dateStr)" class="cal-day-dot" :class="dayDotTone(cell.dateStr)" />
          </button>
          <div v-else class="cal-day muted" />
        </template>
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

      <div v-else class="cal-empty">Nothing scheduled</div>
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
  </div>
</template>

<script setup lang="ts">
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
}

const calendarCells = computed<(CalCell | null)[]>(() => {
  const firstDay = new Date(Date.UTC(viewYear.value, viewMonth.value - 1, 1))
  const startOffset = (firstDay.getUTCDay() + 6) % 7
  const daysInMonth = new Date(
    Date.UTC(viewYear.value, viewMonth.value, 0),
  ).getUTCDate()

  const cells: (CalCell | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${viewYear.value}-${String(viewMonth.value).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr: ds })
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
})

const isSelectedCell = (cell: CalCell) => cell.dateStr === selectedDateStr.value

const selectDate = (cell: CalCell) => {
  selectedDateStr.value = selectedDateStr.value === cell.dateStr ? null : cell.dateStr
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
const goBack = useGoBack('/profile')

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
  background:
    radial-gradient(circle at 90% 8%, rgba(72, 120, 255, 0.14) 0%, rgba(72, 120, 255, 0) 38%),
    linear-gradient(160deg, #f7fbff 0%, #eef4ff 48%, #edf9f7 100%);
  color: var(--fx-text);
  position: relative;
  padding-bottom: 96px;
  display: flex;
  flex-direction: column;
  font-family: 'Plus Jakarta Sans', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.cal-nav-bar {
  display: flex;
  align-items: center;
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 18px 10px;
  padding-top: calc(10px + env(safe-area-inset-top));
  gap: 8px;
  position: relative;
  z-index: 2;
}
.cal-nav-icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.86);
  background: linear-gradient(175deg, rgba(255, 255, 255, 0.96) 0%, rgba(235, 245, 255, 0.92) 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #143047;
  flex-shrink: 0;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}
.cal-nav-icon-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(183, 209, 236, 0.9);
  box-shadow: 0 12px 24px rgba(19, 48, 71, 0.12);
}
.cal-nav-icon-btn svg { width: 18px; height: 18px; }
.cal-nav-title {
  flex: 1;
  text-align: center;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.35px;
  color: #10263d;
}

.cal-body {
  position: relative;
  flex: 1;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 14px;
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

.cal-hero {
  margin-top: 6px;
  border-radius: 28px;
  padding: 14px 14px 12px;
  border: 1px solid rgba(173, 201, 231, 0.48);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 250, 255, 0.9) 52%, rgba(236, 255, 249, 0.95) 100%);
  box-shadow:
    0 14px 42px rgba(18, 55, 88, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  z-index: 1;
}
.cal-monthnav {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.cal-monthnav h2 {
  margin: 0;
  flex: 1;
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 22px;
  line-height: 1.06;
  letter-spacing: -0.55px;
  font-weight: 750;
  color: #10263d;
}
.cal-arrow {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(213, 225, 238, 0.86);
  background: rgba(255, 255, 255, 0.86);
  color: #17314a;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.cal-arrow svg { width: 14px; height: 14px; }

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(229, 255, 248, 0.92);
  border: 1px solid rgba(0, 161, 154, 0.35);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #50637a;
  letter-spacing: -0.2px;
  flex-wrap: wrap;
}
.hero-stats .stat-num {
  color: #17314a;
  font-weight: 800;
  font-feature-settings: 'tnum';
  margin-right: 4px;
}
.hero-stats .stat-num.teal { color: #067a74; }
.hero-stats .stat-num.coral { color: #b85b36; }
.hero-stats .stat-sep {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #9ab0c9;
  display: inline-block;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 3px;
  margin: 10px 0 12px;
  padding: 10px 8px 8px;
  border-radius: 18px;
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  position: relative;
  z-index: 1;
}
.cal-dow {
  font-size: 8px;
  font-weight: 800;
  color: #7f91a8;
  text-align: center;
  padding: 1px 0 4px;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.cal-day {
  aspect-ratio: 1;
  min-height: 38px;
  border-radius: 11px;
  border: 1px solid transparent;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  position: relative;
  transition: all 0.16s;
  padding: 3px 2px;
}
.cal-day:hover { background: #f3f8fd; border-color: #b9d5ea; }
.cal-day.muted {
  background: transparent;
  cursor: default;
}
.cal-day-num {
  font-family: 'SF Pro Display', 'Avenir Next', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #17314a;
  line-height: 1;
}
.cal-day-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3dbda3;
}
.cal-day-dot.warn { background: #ff8b5a; }
.cal-day.today {
  background: rgba(229, 255, 248, 0.88);
  border-color: rgba(0, 161, 154, 0.26);
}
.cal-day.today .cal-day-num {
  color: #067a74;
}
.cal-day.selected {
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 100%);
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(48, 98, 214, 0.24);
}
.cal-day.selected .cal-day-num,
.cal-day.selected .cal-day-dot {
  color: #fff;
  background: rgba(255, 255, 255, 0.9);
}
.cal-day.has-event {
  box-shadow: inset 0 0 0 1px rgba(61, 189, 163, 0.18);
}
.cal-day.has-event-warn {
  box-shadow: inset 0 0 0 1px rgba(255, 139, 90, 0.18);
}
.cal-strip {
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin: 0 0 14px;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid #dfe8f3;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 8px 16px rgba(19, 51, 82, 0.06);
  position: relative;
  z-index: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.cal-strip::-webkit-scrollbar { display: none; }

.cal-agenda-heading {
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

.fab {
  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  bottom: calc(18px + env(safe-area-inset-bottom));
  z-index: 20;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(120deg, var(--fx-aqua) 0%, var(--fx-blue) 48%, var(--fx-indigo) 100%);
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
  position: fixed;
  inset: 0;
  background: rgba(14, 40, 64, 0.42);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 70;
}
.modal {
  width: 100%;
  max-width: 28rem;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8ff 100%);
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  max-height: 92vh;
  overflow: hidden;
  animation: modal-up 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes modal-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.modal-handle {
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

@media (min-width: 768px) {
  .cal-nav-bar {
    padding: 14px 22px 12px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }

  .cal-body {
    padding: 0 18px;
  }

  .cal-hero {
    padding: 22px 24px 18px;
  }

  .cal-monthnav h2 {
    font-size: 28px;
  }

  .cal-grid {
    padding: 14px 12px;
    gap: 5px;
  }
}

@media (max-width: 430px) {
  .cal-body {
    padding: 0 16px;
  }

  .cal-nav-title {
    font-size: 18px;
  }

  .cal-monthnav h2 {
    font-size: 22px;
  }

  .cal-grid {
    gap: 3px;
    padding: 10px 8px;
    margin: 10px 0 12px;
  }

  .cal-day {
    min-height: 38px;
    border-radius: 10px;
  }

  .cal-day-num {
    font-size: 12px;
  }

  .cal-event {
    margin: 0 0 12px;
    padding: 13px 13px;
    gap: 11px;
    border-radius: 17px;
  }

  .cal-event-time {
    width: 52px;
  }

  .cal-event-title {
    line-height: 1.28;
  }

  .mform-when-row--bottom {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cal-nav-icon-btn,
  .cal-day,
  .cal-event,
  .fab,
  .mform-radio,
  .modal {
    transition: none;
    animation: none;
  }
}
</style>
