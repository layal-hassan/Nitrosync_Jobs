<script setup>
import AppIcon from '../shared/AppIcon.vue'
import NitroSyncLogo from '../shared/NitroSyncLogo.vue'

const emit = defineEmits(['close'])

const promptChips = [
  'Why is hiring slowing down?',
  'Show payroll issues',
  'What needs my attention today?',
  'Find candidates for HR Manager',
  'Generate hiring report',
]

const summaryCards = [
  { title: 'My Tasks', value: '11', meta: 'Pending', icon: 'clipboard-check', tone: 'red' },
  { title: 'Team Issues', value: '4', meta: 'Need Review', icon: 'users', tone: 'orange' },
  { title: 'Nitro Completed Today', value: '26', meta: 'Actions', icon: 'checkCircle', tone: 'green' },
  { title: 'Estimated Time', value: '18', meta: 'Minutes', icon: 'clock', tone: 'blue' },
]

const actionRequired = [
  { title: '6 candidates awaiting feedback', note: 'Across 4 jobs', cta: 'Review', tone: 'red' },
  { title: 'Payroll approval pending', note: 'For 23 employees', cta: 'Approve', tone: 'red' },
  { title: '3 onboarding tasks overdue', note: 'New hires', cta: 'Complete', tone: 'orange' },
  { title: '12 time reports waiting approval', note: 'Across 2 departments', cta: 'Approve', tone: 'yellow' },
]

const recommendations = [
  {
    title: 'HR Manager role at risk',
    note: 'Applications are 42% below target and the role may be delayed.',
    pill: 'High Impact',
    icon: 'trend-up',
    actions: ['Find Candidates', 'Boost Job', 'Extend Deadline'],
    tone: 'pink',
  },
  {
    title: 'Payroll anomaly detected',
    note: 'Two salaries differ significantly from last month.',
    pill: 'Medium Impact',
    icon: 'wallet',
    actions: ['Review', 'Export Report', 'View Details'],
    tone: 'orange',
  },
  {
    title: 'Interview scheduling optimization',
    note: '18 interviews can be rescheduled to reduce overlap and save time.',
    pill: 'Insight',
    icon: 'calendar',
    actions: ['Optimize Schedule', 'View Calendar'],
    tone: 'blue',
  },
]

const quickActions = [
  { title: 'Hire Someone', icon: 'userPlus', tone: 'violet' },
  { title: 'Run Payroll', icon: 'wallet', tone: 'green' },
  { title: 'Approve Time Reports', icon: 'clipboard-check', tone: 'blue' },
  { title: 'Create Survey', icon: 'clipboard-check', tone: 'violet' },
  { title: 'Generate Report', icon: 'chart-bars', tone: 'orange' },
  { title: 'Manage Employees', icon: 'users', tone: 'blue' },
  { title: 'Schedule Interview', icon: 'calendar', tone: 'red' },
  { title: 'Create Offer', icon: 'document', tone: 'green' },
  { title: 'Publish Job', icon: 'megaphone', tone: 'violet' },
]

const activityItems = [
  { title: 'Scheduled interviews', meta: '6 interviews', age: '1h ago', icon: 'calendar', tone: 'violet' },
  { title: 'Sent', meta: '14 reminders', age: '2h ago', icon: 'share', tone: 'green' },
  { title: 'Generated weekly report', meta: '', age: '3h ago', icon: 'document', tone: 'blue' },
  { title: 'Flagged payroll issue', meta: '', age: '4h ago', icon: 'alert', tone: 'orange' },
]
</script>

<template>
  <main class="nitro-page">
    <section class="nitro-shell">
      <header class="nitro-topbar">
        <div class="nitro-brand">
          <NitroSyncLogo size="sm" />
          <div class="nitro-brand__copy">
            <div class="nitro-brand__title-row">
              <span>AI Assistant</span>
            </div>
            <p>Workforce Intelligence &amp; Automation Center</p>
          </div>
        </div>

        <div class="nitro-topbar__actions">
          <button class="nitro-icon-button" type="button" aria-label="Notifications">
            <span class="nitro-icon-button__badge">3</span>
            <AppIcon name="bell" :size="19" />
          </button>
          <button class="nitro-settings" type="button">
            <AppIcon name="settings" :size="18" />
            <span>Settings</span>
          </button>
          <button class="nitro-close" type="button" aria-label="Close Nitro" @click="emit('close')">
            <AppIcon name="close" :size="20" />
          </button>
        </div>
      </header>

      <div class="nitro-search">
        <label class="nitro-search__field">
          <AppIcon name="search" :size="18" />
          <input type="text" placeholder="Ask Nitro anything or run an action..." />
        </label>
        <button class="nitro-search__send" type="button" aria-label="Send">
          <AppIcon name="share" :size="18" />
        </button>
      </div>

      <div class="nitro-chip-row">
        <button v-for="chip in promptChips" :key="chip" class="nitro-chip" type="button">{{ chip }}</button>
      </div>

      <section class="nitro-summary-grid">
        <article v-for="item in summaryCards" :key="item.title" class="nitro-summary-card">
          <div class="nitro-summary-card__icon" :class="`is-${item.tone}`">
            <AppIcon :name="item.icon" :size="20" />
          </div>
          <div class="nitro-summary-card__copy">
            <span>{{ item.title }}</span>
            <div class="nitro-summary-card__metric">
              <strong>{{ item.value }}</strong>
              <small :class="`is-${item.tone}`">{{ item.meta }}</small>
            </div>
          </div>
          <AppIcon name="chevronRight" :size="16" class="nitro-summary-card__arrow" />
        </article>
      </section>

      <section class="nitro-dashboard">
        <section class="nitro-panel nitro-panel--tasks">
          <header class="nitro-panel__head">
            <h2>Action Required</h2>
          </header>

          <div class="nitro-task-list">
            <article v-for="item in actionRequired" :key="item.title" class="nitro-task-row">
              <div class="nitro-task-row__icon" :class="`is-${item.tone}`">
                <AppIcon :name="item.tone === 'orange' ? 'alert' : item.tone === 'yellow' ? 'info' : 'alert'" :size="16" />
              </div>
              <div class="nitro-task-row__copy">
                <strong>{{ item.title }}</strong>
                <span>{{ item.note }}</span>
              </div>
              <button class="nitro-task-row__cta" :class="`is-${item.tone}`" type="button">{{ item.cta }}</button>
            </article>
          </div>

          <button class="nitro-link" type="button">
            <span>View all tasks (11)</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </section>

        <section class="nitro-panel nitro-panel--recommendations">
          <header class="nitro-panel__head">
            <h2>Nitro Recommendations</h2>
          </header>

          <div class="nitro-recommendation-list">
            <article v-for="item in recommendations" :key="item.title" class="nitro-recommendation-card">
              <div class="nitro-recommendation-card__top">
                <div class="nitro-recommendation-card__icon" :class="`is-${item.tone}`">
                  <AppIcon :name="item.icon" :size="18" />
                </div>
                <span class="nitro-recommendation-card__pill" :class="`is-${item.tone}`">{{ item.pill }}</span>
              </div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.note }}</p>
              <div class="nitro-recommendation-card__actions">
                <button
                  v-for="(action, actionIndex) in item.actions"
                  :key="action"
                  class="nitro-recommendation-card__button"
                  :class="{ 'is-primary': actionIndex === 0, [`is-${item.tone}`]: actionIndex === 0 }"
                  type="button"
                >
                  {{ action }}
                </button>
              </div>
            </article>
          </div>

          <button class="nitro-link" type="button">
            <span>View all recommendations</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </section>

        <section class="nitro-panel nitro-panel--quick">
          <header class="nitro-panel__head">
            <h2>Quick Actions</h2>
          </header>

          <div class="nitro-quick-grid">
            <button v-for="item in quickActions" :key="item.title" class="nitro-quick-card" type="button">
              <span class="nitro-quick-card__icon" :class="`is-${item.tone}`">
                <AppIcon :name="item.icon" :size="20" />
              </span>
              <span>{{ item.title }}</span>
            </button>
          </div>

          <button class="nitro-link" type="button">
            <span>View all actions</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </section>

        <section class="nitro-panel nitro-panel--activity">
          <header class="nitro-panel__head">
            <h2>Nitro Activity</h2>
          </header>

          <div class="nitro-activity-row">
            <article v-for="item in activityItems" :key="item.title" class="nitro-activity-item">
              <div class="nitro-activity-item__icon" :class="`is-${item.tone}`">
                <AppIcon :name="item.icon" :size="18" />
              </div>
              <div class="nitro-activity-item__copy">
                <strong>{{ item.title }}</strong>
                <span v-if="item.meta">{{ item.meta }}</span>
                <small>{{ item.age }}</small>
              </div>
            </article>

            <button class="nitro-link nitro-link--activity" type="button">
              <span>View all activity</span>
              <AppIcon name="chevronRight" :size="15" />
            </button>
          </div>
        </section>

        <section class="nitro-automation-card">
          <div class="nitro-automation-card__head">
            <AppIcon name="sparkles" :size="16" />
            <span>Automation Center</span>
          </div>
          <strong>25 automation rules are active</strong>
          <p>Saving ~3.2 hours per day</p>
          <button class="nitro-link nitro-link--center" type="button">
            <span>Explore automations</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
          <div class="nitro-automation-card__bot">
            <div class="nitro-automation-card__bot-core">
              <div class="nitro-automation-card__bot-eye" />
              <div class="nitro-automation-card__bot-eye" />
            </div>
          </div>
        </section>
      </section>
    </section>
  </main>
</template>

<style scoped>
.nitro-page {
  min-height: 100vh;
  padding: 56px 64px;
  background: linear-gradient(180deg, #232834 0%, #1f2731 100%);
}

.nitro-shell {
  min-height: calc(100vh - 112px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at top center, rgba(255, 147, 211, 0.1), transparent 38%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.985) 0%, #ffffff 100%);
  box-shadow:
    0 32px 80px rgba(6, 11, 22, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  overflow: hidden;
}

.nitro-topbar,
.nitro-brand,
.nitro-brand__title-row,
.nitro-topbar__actions,
.nitro-search,
.nitro-panel__head,
.nitro-task-row,
.nitro-recommendation-card__top,
.nitro-recommendation-card__actions,
.nitro-link,
.nitro-summary-card,
.nitro-activity-row,
.nitro-automation-card__head {
  display: flex;
  align-items: center;
}

.nitro-topbar,
.nitro-search,
.nitro-panel__head,
.nitro-task-row,
.nitro-recommendation-card__top,
.nitro-summary-card,
.nitro-activity-row {
  justify-content: space-between;
}

.nitro-topbar {
  padding: 22px 24px 18px;
  border-bottom: 1px solid #edf1f8;
}

.nitro-brand {
  gap: 14px;
  align-items: flex-start;
}

.nitro-brand__copy {
  display: grid;
  gap: 6px;
}

.nitro-brand__title-row {
  gap: 0;
}

.nitro-brand__title-row span {
  padding: 4px 10px;
  border-radius: 999px;
  color: #8b6cf5;
  background: #f4efff;
  font-size: 11px;
  font-weight: 700;
}

.nitro-brand__copy p {
  margin: 0;
  color: #627189;
  font-size: 12px;
}

.nitro-topbar__actions {
  gap: 14px;
}

.nitro-icon-button,
.nitro-settings,
.nitro-close,
.nitro-search__send,
.nitro-chip,
.nitro-task-row__cta,
.nitro-recommendation-card__button,
.nitro-quick-card {
  border: 1px solid #e4ebf5;
  background: #fff;
}

.nitro-icon-button,
.nitro-close {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8a97ac;
  position: relative;
}

.nitro-icon-button__badge {
  position: absolute;
  top: -4px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #f15daa;
  box-shadow: 0 0 0 3px #fff;
  font-size: 9px;
  font-weight: 800;
}

.nitro-settings {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #43516a;
  font-size: 14px;
  font-weight: 600;
}

.nitro-search {
  gap: 16px;
  padding: 12px 16px 14px;
}

.nitro-search__field {
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #99a6bc;
  background: #fff;
}

.nitro-search__field input {
  width: 100%;
  border: 0;
  outline: 0;
  color: #23314f;
  background: transparent;
  font-size: 13px;
}

.nitro-search__send {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(180deg, #7d6bff 0%, #6e5ef4 100%);
  box-shadow: 0 12px 22px rgba(110, 94, 244, 0.24);
}

.nitro-chip-row {
  padding: 0 16px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nitro-chip {
  min-height: 30px;
  padding: 0 14px;
  border-radius: 999px;
  color: #7b65f5;
  background: #f6f2ff;
  font-size: 12px;
}

.nitro-summary-grid {
  padding: 0 16px 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.nitro-summary-card {
  min-height: 82px;
  padding: 14px 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  gap: 14px;
}

.nitro-summary-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nitro-summary-card__icon.is-red {
  color: #ff5a66;
  background: #ffecef;
}

.nitro-summary-card__icon.is-orange {
  color: #ff8a34;
  background: #fff1e6;
}

.nitro-summary-card__icon.is-green {
  color: #26a85c;
  background: #edf9f1;
}

.nitro-summary-card__icon.is-blue {
  color: #4d72ff;
  background: #edf3ff;
}

.nitro-summary-card__copy {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 6px;
}

.nitro-summary-card__copy > span {
  color: #32415f;
  font-size: 13px;
  font-weight: 700;
}

.nitro-summary-card__metric {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.nitro-summary-card__metric strong {
  color: #1d2849;
  font-size: 18px;
  font-weight: 800;
}

.nitro-summary-card__metric small {
  font-size: 12px;
  font-weight: 700;
}

.nitro-summary-card__metric small.is-red {
  color: #ff5a66;
}

.nitro-summary-card__metric small.is-orange {
  color: #ff8a34;
}

.nitro-summary-card__metric small.is-green {
  color: #26a85c;
}

.nitro-summary-card__metric small.is-blue {
  color: #4d72ff;
}

.nitro-summary-card__arrow {
  color: #7c8aa3;
}

.nitro-dashboard {
  padding: 0 16px 18px;
  display: grid;
  grid-template-columns: 1.02fr 1.26fr 1fr;
  gap: 18px;
  grid-template-areas:
    'tasks recommendations quick'
    'activity activity automation';
  align-items: stretch;
}

.nitro-panel {
  padding: 14px 14px 12px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
}

.nitro-panel--tasks {
  grid-area: tasks;
}

.nitro-panel--recommendations {
  grid-area: recommendations;
}

.nitro-panel--quick {
  grid-area: quick;
}

.nitro-panel--activity {
  grid-area: activity;
}

.nitro-panel__head {
  margin-bottom: 14px;
}

.nitro-panel__head h2 {
  margin: 0;
  color: #717f98;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.nitro-task-list,
.nitro-recommendation-list {
  display: grid;
  gap: 14px;
}

.nitro-task-list,
.nitro-recommendation-list,
.nitro-quick-grid {
  flex: 1 1 auto;
}

.nitro-task-row {
  gap: 12px;
}

.nitro-task-row__icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nitro-task-row__icon.is-red {
  color: #ff5a66;
  background: #ffe8eb;
}

.nitro-task-row__icon.is-orange {
  color: #ff8a34;
  background: #fff2e5;
}

.nitro-task-row__icon.is-yellow {
  color: #f6b114;
  background: #fff7dd;
}

.nitro-task-row__copy {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 2px;
}

.nitro-task-row__copy strong,
.nitro-recommendation-card strong,
.nitro-activity-item__copy strong,
.nitro-automation-card strong {
  color: #25304f;
  font-size: 13px;
  font-weight: 800;
}

.nitro-task-row__copy span,
.nitro-recommendation-card p,
.nitro-activity-item__copy span,
.nitro-activity-item__copy small,
.nitro-automation-card p,
.nitro-quick-card > span {
  color: #7d8aa1;
  font-size: 12px;
  line-height: 1.45;
}

.nitro-task-row__cta {
  min-width: 74px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.nitro-task-row__cta.is-red {
  color: #ff5a66;
}

.nitro-task-row__cta.is-orange {
  color: #ff7a1b;
}

.nitro-task-row__cta.is-yellow {
  color: #d28c08;
}

.nitro-link {
  margin-top: 14px;
  gap: 8px;
  border: 0;
  color: #7b65f5;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.nitro-recommendation-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.nitro-recommendation-card__top {
  margin-bottom: 12px;
}

.nitro-recommendation-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nitro-recommendation-card__icon.is-pink {
  color: #ff5c7b;
  background: #fff0f3;
}

.nitro-recommendation-card__icon.is-orange {
  color: #ff7a1b;
  background: #fff0e5;
}

.nitro-recommendation-card__icon.is-blue {
  color: #5f67f8;
  background: #eef1ff;
}

.nitro-recommendation-card__pill {
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.nitro-recommendation-card__pill.is-pink {
  color: #ff5a66;
  background: #fff0f3;
}

.nitro-recommendation-card__pill.is-orange {
  color: #ff7a1b;
  background: #fff0e5;
}

.nitro-recommendation-card__pill.is-blue {
  color: #5f67f8;
  background: #eef1ff;
}

.nitro-recommendation-card p {
  margin: 6px 0 14px;
}

.nitro-recommendation-card__actions {
  flex-wrap: wrap;
  gap: 10px;
}

.nitro-recommendation-card__button {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  color: #7b65f5;
  font-size: 11px;
  font-weight: 700;
}

.nitro-recommendation-card__button.is-primary.is-pink,
.nitro-recommendation-card__button.is-primary.is-orange,
.nitro-recommendation-card__button.is-primary.is-blue {
  color: #fff;
}

.nitro-recommendation-card__button.is-primary.is-pink {
  background: linear-gradient(180deg, #7d6bff 0%, #6e5ef4 100%);
}

.nitro-recommendation-card__button.is-primary.is-orange {
  background: linear-gradient(180deg, #7d6bff 0%, #6e5ef4 100%);
}

.nitro-recommendation-card__button.is-primary.is-blue {
  background: linear-gradient(180deg, #7d6bff 0%, #6e5ef4 100%);
}

.nitro-quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.nitro-quick-card {
  min-height: 98px;
  padding: 12px 8px;
  border-radius: 14px;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 10px;
}

.nitro-quick-card__icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.nitro-quick-card__icon.is-violet {
  color: #665cf4;
  background: #eff0ff;
}

.nitro-quick-card__icon.is-green {
  color: #2fa55d;
  background: #e9f8ef;
}

.nitro-quick-card__icon.is-blue {
  color: #4f70ff;
  background: #eef4ff;
}

.nitro-quick-card__icon.is-orange {
  color: #ff7a1b;
  background: #fff4ea;
}

.nitro-quick-card__icon.is-red {
  color: #ff5a66;
  background: #fff0f3;
}

.nitro-quick-card > span {
  color: #3a4763;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.nitro-activity-row {
  gap: 18px;
}

.nitro-activity-item {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.nitro-activity-item__icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nitro-activity-item__icon.is-violet {
  color: #7b65f5;
  background: #f1edff;
}

.nitro-activity-item__icon.is-green {
  color: #2fa55d;
  background: #edf9f1;
}

.nitro-activity-item__icon.is-blue {
  color: #4f70ff;
  background: #eef4ff;
}

.nitro-activity-item__icon.is-orange {
  color: #ff8a34;
  background: #fff4ea;
}

.nitro-activity-item__copy {
  display: grid;
  gap: 2px;
}

.nitro-link--activity {
  margin-top: 0;
  white-space: nowrap;
}

.nitro-automation-card {
  grid-area: automation;
  min-height: 148px;
  padding: 18px 20px;
  border: 1px solid #efe6fb;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px 16px;
  background:
    radial-gradient(circle at 18% 20%, rgba(123, 101, 245, 0.08), transparent 34%),
    linear-gradient(180deg, #fcf9ff 0%, #f7f2ff 100%);
}

.nitro-automation-card__head {
  gap: 8px;
  color: #6e5ef4;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nitro-automation-card strong {
  font-size: 18px;
}

.nitro-automation-card p {
  margin: 0;
  color: #6b7790;
}

.nitro-automation-card__bot {
  grid-column: 2;
  grid-row: 1 / span 3;
  width: 96px;
  height: 96px;
  border-radius: 28px;
  position: relative;
  background:
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), transparent 28%),
    radial-gradient(circle at 70% 25%, rgba(255, 255, 255, 0.7), transparent 18%),
    linear-gradient(180deg, #6e5ef4 0%, #3c346b 100%);
  box-shadow: 0 20px 30px rgba(60, 52, 107, 0.22);
}

.nitro-automation-card__bot::before,
.nitro-automation-card__bot::after {
  content: '';
  position: absolute;
  top: 18px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8d80ff;
}

.nitro-automation-card__bot::before {
  left: -8px;
}

.nitro-automation-card__bot::after {
  right: -8px;
}

.nitro-automation-card__bot-core {
  position: absolute;
  right: 12px;
  bottom: 12px;
  left: 12px;
  height: 48px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #fff;
}

.nitro-automation-card__bot-eye {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3c346b;
}

.nitro-link--center {
  margin-top: 0;
}

@media (max-width: 1380px) {
  .nitro-page {
    padding: 32px;
  }

  .nitro-summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .nitro-dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'tasks recommendations'
      'quick quick'
      'activity automation';
  }
}

@media (max-width: 980px) {
  .nitro-page {
    padding: 18px;
  }

  .nitro-topbar,
  .nitro-search,
  .nitro-chip-row,
  .nitro-summary-grid,
  .nitro-dashboard {
    padding-left: 18px;
    padding-right: 18px;
  }

  .nitro-topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .nitro-dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      'tasks'
      'recommendations'
      'quick'
      'activity'
      'automation';
  }

  .nitro-activity-row {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 720px) {
  .nitro-summary-grid,
  .nitro-quick-grid {
    grid-template-columns: 1fr;
  }

  .nitro-search {
    flex-direction: column;
  }

  .nitro-search__send {
    align-self: flex-end;
  }

  .nitro-automation-card {
    grid-template-columns: 1fr;
  }

  .nitro-automation-card__bot {
    grid-column: 1;
    grid-row: auto;
    justify-self: end;
  }
}
</style>
