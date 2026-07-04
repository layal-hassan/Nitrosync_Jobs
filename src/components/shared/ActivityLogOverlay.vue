<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'UX Designer',
  },
})

const emit = defineEmits(['close'])

const summaryItems = [
  '3 interviews completed',
  '2 evaluations submitted',
  '4 stakeholders involved',
  'No bottlenecks detected',
]

const statCards = [
  { icon: 'archive', value: '47', label: 'Total Activities', tone: 'pink' },
  { icon: 'mail', value: '12', label: 'Emails', tone: 'blue' },
  { icon: 'document', value: '8', label: 'Notes', tone: 'yellow' },
  { icon: 'calendar', value: '4', label: 'Interviews', tone: 'violet' },
  { icon: 'share', value: '3', label: 'Shares', tone: 'pink' },
]

const quickFilters = ['Notes', 'Emails', 'Interviews', 'Stage Changes', 'AI Actions', 'Shares', 'Holds', 'Offers']

const timelineGroups = [
  {
    label: 'Today',
    items: [
      {
        tone: 'pink',
        icon: 'chevrons-right',
        title: 'Stage changed',
        badge: 'New',
        description: 'Moved from Interview to Final Review',
        actor: 'Emma Wilson',
        time: '12:24 PM',
        actorInitials: 'EW',
      },
      {
        tone: 'violet',
        icon: 'star',
        title: 'Scorecard submitted',
        description: 'Overall Score: 4.6/5 · View scorecard',
        actor: 'James Carter',
        time: '11:48 AM',
        actorInitials: 'JC',
      },
      {
        tone: 'green',
        icon: 'calendar',
        title: 'Interview completed',
        description: 'Technical Interview · 52 min',
        meta: 'Feedback submitted by 3/3 interviewers',
        actor: 'Priya Shah',
        time: 'Yesterday, 4:15 PM',
        actorInitials: 'PS',
      },
    ],
  },
  {
    label: 'June 15, 2024',
    items: [
      {
        tone: 'blue',
        icon: 'mail',
        title: 'Email sent',
        description: 'Interview invitation',
        meta: 'Opened · Jun 14, 10:21 AM    Clicked · Jun 14, 10:21 AM',
        actor: 'System',
        time: 'Yesterday, 10:20 AM',
        actorInitials: 'SY',
      },
      {
        tone: 'violet',
        icon: 'share',
        title: 'Candidate shared',
        description: 'Shared with Engineering Hiring Committee',
        actor: 'Emma Wilson',
        time: 'Yesterday, 9:15 AM',
        actorInitials: 'EW',
      },
      {
        tone: 'pink',
        icon: 'spark',
        title: 'AI match analysis generated',
        description: '94% match score for Senior Frontend Engineer',
        actor: 'Nitro AI',
        time: 'Jun 14, 9:00 AM',
        actorInitials: 'AI',
      },
    ],
  },
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="activity-log-overlay" @click.self="closeOverlay">
      <section class="activity-log-modal">
        <header class="activity-log-modal__head">
          <div class="activity-log-modal__title">
            <span class="activity-log-modal__title-icon">
              <AppIcon name="clock" :size="18" />
            </span>
            <div>
              <h2>Activity Log</h2>
              <p>Complete history of actions, interactions and events for this candidate.</p>
            </div>
          </div>

          <div class="activity-log-modal__head-actions">
            <button class="activity-log-export" type="button">
              <AppIcon name="document" :size="15" />
              <span>Export</span>
              <AppIcon name="chevronDown" :size="16" />
            </button>

            <button class="activity-log-modal__close" type="button" aria-label="Close activity log" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="activity-log-modal__body">
          <aside class="activity-log-sidebar">
            <section class="activity-log-summary">
              <div class="activity-log-summary__head">
                <span><AppIcon name="spark" :size="14" /></span>
                <strong>AI Summary</strong>
                <em>Beta</em>
              </div>

              <p>{{ candidateName }} has progressed through 6 stages over 18 days.</p>

              <ul>
                <li v-for="item in summaryItems" :key="item">
                  <AppIcon name="spark" :size="12" />
                  <span>{{ item }}</span>
                </li>
              </ul>

              <div class="activity-log-summary__recommendation">
                <small>Recommendation</small>
                <strong>Strong Hire</strong>
                <span>Ready for final decision.</span>
              </div>
            </section>

            <section class="activity-log-filters">
              <div class="activity-log-filters__head">
                <strong>Filters</strong>
                <button type="button">Clear all</button>
              </div>

              <button class="activity-log-filter-field" type="button">
                <span><AppIcon name="list" :size="14" /> All Activity Types</span>
                <AppIcon name="chevronDown" :size="16" />
              </button>

              <button class="activity-log-filter-field" type="button">
                <span><AppIcon name="user" :size="14" /> All Users</span>
                <AppIcon name="chevronDown" :size="16" />
              </button>

              <button class="activity-log-filter-field" type="button">
                <span><AppIcon name="calendar" :size="14" /> All Date Range</span>
                <AppIcon name="chevronDown" :size="16" />
              </button>

              <label class="activity-log-search">
                <AppIcon name="search" :size="15" />
                <input type="text" placeholder="Search activities...">
              </label>

              <div class="activity-log-filters__quick">
                <small>Quick Filters</small>
                <div class="activity-log-filter-tags">
                  <button v-for="tag in quickFilters" :key="tag" type="button">{{ tag }}</button>
                </div>
              </div>
            </section>
          </aside>

          <div class="activity-log-content">
            <section class="activity-log-stats">
              <article v-for="item in statCards" :key="item.label" class="activity-log-stat-card">
                <span class="activity-log-stat-card__icon" :class="`is-${item.tone}`">
                  <AppIcon :name="item.icon" :size="16" />
                </span>
                <div>
                  <strong>{{ item.value }}</strong>
                  <small>{{ item.label }}</small>
                </div>
              </article>
            </section>

            <div class="activity-log-content__head">
              <strong>Most recent first</strong>
              <button type="button">
                <AppIcon name="filter" :size="14" />
              </button>
            </div>

            <section class="activity-log-timeline">
              <div v-for="group in timelineGroups" :key="group.label" class="activity-log-group">
                <h3>{{ group.label }}</h3>

                <div class="activity-log-group__items">
                  <article v-for="item in group.items" :key="`${group.label}-${item.title}-${item.actor}`" class="activity-log-item">
                    <div class="activity-log-item__rail">
                      <span class="activity-log-item__dot" :class="`is-${item.tone}`"></span>
                    </div>

                    <div class="activity-log-item__card">
                      <span class="activity-log-item__icon" :class="`is-${item.tone}`">
                        <AppIcon :name="item.icon" :size="16" />
                      </span>

                      <div class="activity-log-item__copy">
                        <div class="activity-log-item__title-row">
                          <strong>{{ item.title }}</strong>
                          <em v-if="item.badge">{{ item.badge }}</em>
                        </div>
                        <p>{{ item.description }}</p>
                        <small v-if="item.meta">{{ item.meta }}</small>
                      </div>

                      <div class="activity-log-item__actor">
                        <span class="activity-log-item__avatar" :class="{ 'is-ai': item.actor === 'Nitro AI', 'is-system': item.actor === 'System' }">
                          {{ item.actorInitials }}
                        </span>
                        <div>
                          <strong>{{ item.actor }}</strong>
                          <small>{{ item.time }}</small>
                        </div>
                      </div>

                      <button class="activity-log-item__more" type="button" aria-label="More activity options">
                        <AppIcon name="more" :size="16" />
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer class="activity-log-modal__footer">
          <div class="activity-log-modal__hint">
            <AppIcon name="info" :size="14" />
            <span>All times are shown in your local time (GMT+2)</span>
          </div>

          <button class="activity-log-close-button" type="button" @click="closeOverlay">Close</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.activity-log-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding: 24px;
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(6px);
}

.activity-log-modal {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  margin: auto 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.26);
  overflow: hidden;
}

.activity-log-modal__head,
.activity-log-modal__title,
.activity-log-modal__head-actions,
.activity-log-export,
.activity-log-filters__head,
.activity-log-filter-field,
.activity-log-search,
.activity-log-stat-card,
.activity-log-content__head,
.activity-log-item__card,
.activity-log-item__title-row,
.activity-log-item__actor,
.activity-log-modal__footer,
.activity-log-modal__hint {
  display: flex;
  align-items: center;
}

.activity-log-modal__head,
.activity-log-filter-field,
.activity-log-content__head,
.activity-log-modal__footer {
  justify-content: space-between;
}

.activity-log-modal__head {
  padding: 22px 24px;
  border-bottom: 1px solid #edf2f8;
}

.activity-log-modal__title {
  gap: 14px;
}

.activity-log-modal__title-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff1f8;
  color: #ef5ea9;
}

.activity-log-modal__title h2,
.activity-log-summary__head strong,
.activity-log-filters__head strong,
.activity-log-content__head strong,
.activity-log-group h3,
.activity-log-item__title-row strong,
.activity-log-item__actor strong {
  margin: 0;
  color: #1f2940;
}

.activity-log-modal__title h2 {
  font-size: 1rem;
}

.activity-log-modal__title p,
.activity-log-summary p,
.activity-log-summary li span,
.activity-log-summary__recommendation span,
.activity-log-filters__head button,
.activity-log-search input,
.activity-log-content__head,
.activity-log-item__copy p,
.activity-log-item__copy small,
.activity-log-item__actor small,
.activity-log-modal__hint span {
  color: #738199;
}

.activity-log-modal__head-actions {
  gap: 10px;
}

.activity-log-export {
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #1f2940;
  font: inherit;
  cursor: pointer;
}

.activity-log-modal__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: #f7f9fc;
  color: #97a5bb;
  cursor: pointer;
}

.activity-log-modal__body {
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
}

.activity-log-sidebar {
  padding: 24px;
  border-right: 1px solid #edf2f8;
  background: #fff;
}

.activity-log-summary {
  padding: 16px;
  border-radius: 16px;
  background: #fff6fb;
  border: 1px solid #ffe1f0;
}

.activity-log-summary__head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef5ea9;
}

.activity-log-summary__head em {
  margin-left: auto;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #ef5ea9;
  color: #fff;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.activity-log-summary p {
  margin: 14px 0 0;
  line-height: 1.6;
}

.activity-log-summary ul {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.activity-log-summary li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef5ea9;
}

.activity-log-summary__recommendation {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ffd7ea;
}

.activity-log-summary__recommendation small {
  display: block;
  color: #a2aec0;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.activity-log-summary__recommendation strong {
  display: block;
  margin-top: 10px;
  font-size: 1rem;
  color: #1f2940;
}

.activity-log-summary__recommendation span {
  display: block;
  margin-top: 8px;
}

.activity-log-filters {
  margin-top: 24px;
}

.activity-log-filters__head button {
  border: 0;
  background: transparent;
  font: inherit;
  color: #ef5ea9;
  cursor: pointer;
}

.activity-log-filter-field {
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  padding: 0 12px;
  border: 1px solid #dce5f2;
  border-radius: 10px;
  background: #fff;
  color: #2d3550;
  font: inherit;
}

.activity-log-filter-field span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.activity-log-search {
  gap: 10px;
  margin-top: 12px;
  padding: 0 12px;
  min-height: 40px;
  border: 1px solid #dce5f2;
  border-radius: 10px;
}

.activity-log-search input {
  width: 100%;
  border: 0;
  outline: 0;
  font: inherit;
  background: transparent;
}

.activity-log-filters__quick {
  margin-top: 22px;
}

.activity-log-filters__quick small {
  display: block;
  color: #a2aec0;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.activity-log-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.activity-log-filter-tags button {
  min-height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: #f4f6fb;
  color: #5c687f;
  font: inherit;
  cursor: pointer;
}

.activity-log-content {
  padding: 24px;
  min-width: 0;
}

.activity-log-stats {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.activity-log-stat-card {
  gap: 12px;
  padding: 18px 16px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fff;
}

.activity-log-stat-card__icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex: 0 0 38px;
}

.activity-log-stat-card__icon.is-pink {
  background: #fff1f8;
  color: #ef5ea9;
}

.activity-log-stat-card__icon.is-blue {
  background: #eef5ff;
  color: #4f89ff;
}

.activity-log-stat-card__icon.is-yellow {
  background: #fff9e8;
  color: #e6a100;
}

.activity-log-stat-card__icon.is-violet {
  background: #f1efff;
  color: #7466ff;
}

.activity-log-stat-card strong {
  display: block;
  color: #1f2940;
  font-size: 1.1rem;
}

.activity-log-stat-card small {
  display: block;
  margin-top: 3px;
  color: #95a1b5;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.activity-log-content__head {
  margin-top: 24px;
}

.activity-log-content__head button {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.activity-log-timeline {
  margin-top: 18px;
}

.activity-log-group + .activity-log-group {
  margin-top: 28px;
}

.activity-log-group h3 {
  margin-bottom: 14px;
  font-size: 0.9rem;
}

.activity-log-group__items {
  position: relative;
  display: grid;
  gap: 22px;
}

.activity-log-group__items::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 18px;
  width: 1px;
  background: #ebf0f7;
}

.activity-log-item {
  position: relative;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 14px;
}

.activity-log-item__rail {
  position: relative;
}

.activity-log-item__dot {
  position: absolute;
  top: 18px;
  left: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 0 1px currentColor;
  background: currentColor;
}

.activity-log-item__dot.is-pink {
  color: #ef5ea9;
}

.activity-log-item__dot.is-violet {
  color: #7466ff;
}

.activity-log-item__dot.is-green {
  color: #22c55e;
}

.activity-log-item__dot.is-blue {
  color: #4f89ff;
}

.activity-log-item__card {
  gap: 14px;
  padding: 18px 18px 18px 16px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fff;
}

.activity-log-item__icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex: 0 0 38px;
}

.activity-log-item__icon.is-pink {
  background: #fff1f8;
  color: #ef5ea9;
}

.activity-log-item__icon.is-violet {
  background: #f1efff;
  color: #7466ff;
}

.activity-log-item__icon.is-green {
  background: #eafaf0;
  color: #22c55e;
}

.activity-log-item__icon.is-blue {
  background: #eef5ff;
  color: #4f89ff;
}

.activity-log-item__copy {
  min-width: 0;
  flex: 1;
}

.activity-log-item__title-row {
  gap: 10px;
}

.activity-log-item__title-row em {
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ef5ea9;
  font-size: 0.64rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.activity-log-item__copy p {
  margin: 6px 0 0;
  line-height: 1.5;
}

.activity-log-item__copy small {
  display: block;
  margin-top: 6px;
  line-height: 1.5;
}

.activity-log-item__actor {
  gap: 10px;
  margin-left: auto;
}

.activity-log-item__avatar {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  flex: 0 0 36px;
}

.activity-log-item__avatar.is-ai {
  background: #fff1f8;
  color: #ef5ea9;
}

.activity-log-item__avatar.is-system {
  background: #eef2f7;
  color: #627089;
}

.activity-log-item__actor div {
  text-align: right;
}

.activity-log-item__more {
  width: 26px;
  height: 26px;
  border: 0;
  background: transparent;
  color: #a2aec0;
  cursor: pointer;
}

.activity-log-modal__footer {
  padding: 16px 24px;
  border-top: 1px solid #edf2f8;
}

.activity-log-modal__hint {
  gap: 8px;
  color: #95a1b5;
  font-size: 0.8rem;
}

.activity-log-close-button {
  min-width: 106px;
  height: 42px;
  padding: 0 20px;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #3d4860;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1100px) {
  .activity-log-modal__body {
    grid-template-columns: 1fr;
  }

  .activity-log-sidebar {
    border-right: 0;
    border-bottom: 1px solid #edf2f8;
  }

  .activity-log-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .activity-log-overlay {
    padding: 12px;
  }

  .activity-log-modal {
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .activity-log-modal__head,
  .activity-log-content,
  .activity-log-sidebar,
  .activity-log-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .activity-log-modal__head,
  .activity-log-modal__footer,
  .activity-log-item__card {
    flex-direction: column;
    align-items: stretch;
  }

  .activity-log-modal__head-actions,
  .activity-log-item__actor {
    width: 100%;
    justify-content: space-between;
  }

  .activity-log-stats {
    grid-template-columns: 1fr;
  }

  .activity-log-item {
    grid-template-columns: 24px minmax(0, 1fr);
  }

  .activity-log-group__items::before {
    left: 12px;
  }

  .activity-log-item__dot {
    left: 4px;
  }

  .activity-log-modal__footer {
    gap: 12px;
  }

  .activity-log-close-button {
    width: 100%;
  }
}
</style>
