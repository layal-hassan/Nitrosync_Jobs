<script setup>
import { computed } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    default: 'ac-1187',
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
})

const emit = defineEmits(['back'])

const job = computed(() => getJobById(props.jobId))
const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))
const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const candidateEmail = computed(() => (
  `${(props.candidateName || 'marvin mckinney')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .join('.')}@email.com`
))
const launchedAt = 'May 15, 2025 at 10:24 AM PDT'

const timelineRows = [
  {
    time: '10:24 AM',
    date: 'May 15, 2025',
    title: 'Offer sent',
    description: `The offer email was sent to ${candidateEmail.value}.`,
    icon: 'share',
    tone: 'pink',
    actor: 'by Sarah Johnson',
    status: '',
  },
  {
    time: '10:24 AM',
    date: 'May 15, 2025',
    title: 'Email delivered',
    description: "The offer was delivered to the candidate's inbox.",
    icon: 'mail',
    tone: 'violet',
    actor: 'System',
    status: '',
  },
  {
    time: 'Waiting',
    date: '',
    title: 'Candidate opens the offer',
    description: `We'll let you know when ${candidateFirstName.value} opens the offer.`,
    icon: 'eye',
    tone: 'slate',
    actor: '',
    status: 'Waiting',
  },
  {
    time: 'Waiting',
    date: '',
    title: 'Documents signed',
    description: `We'll let you know when ${candidateFirstName.value} signs the documents.`,
    icon: 'document',
    tone: 'slate',
    actor: '',
    status: 'Waiting',
  },
  {
    time: 'Waiting',
    date: '',
    title: 'Offer accepted',
    description: `We'll let you know when ${candidateFirstName.value} accepts the offer.`,
    icon: 'thumbsUp',
    tone: 'slate',
    actor: '',
    status: 'Waiting',
  },
]

const stateRows = [
  { icon: 'bell', label: 'Reminder', value: 'May 18, 2025', note: 'in 3 days' },
  { icon: 'calendar', label: 'Offer expires', value: 'May 29, 2025', note: 'in 14 days' },
  { icon: 'clock', label: 'Candidate timezone', value: 'PDT', note: '(Los Angeles)' },
  { icon: 'sparkles', label: 'Communication health', value: 'Healthy', note: 'All emails delivered' },
]

const actionRows = [
  { icon: 'share', title: 'Send reminder', description: `Nudge ${candidateFirstName.value} to review` },
  { icon: 'message', title: 'Contact candidate', description: 'Send a message' },
  { icon: 'close', title: 'Withdraw offer', description: 'Cancel this offer' },
  { icon: 'calendar', title: 'Extend expiry', description: 'Give more time' },
]

const jobLocation = computed(() => job.value?.location || 'San Francisco, CA (Hybrid)')
</script>

<template>
  <main class="offer-activity-page" @click.self="emit('back')">
    <section class="offer-activity-shell" @click.stop>
      <header class="offer-activity-topbar">
        <div>
          <nav class="offer-activity-breadcrumbs" aria-label="Breadcrumb">
            <span>Offers</span>
            <i aria-hidden="true">></i>
            <span>{{ candidateName }}</span>
            <i aria-hidden="true">></i>
            <span>Offer #OFF-2025-1042</span>
            <i aria-hidden="true">></i>
            <strong>Offer Activity</strong>
          </nav>

          <div class="offer-activity-heading">
            <h1>Offer Activity <em>Live</em></h1>
            <p>Offer launched on {{ launchedAt }}</p>
          </div>
        </div>

        <div class="offer-activity-topbar__actions">
          <button class="offer-activity-icon-button" type="button" aria-label="More actions">
            <AppIcon name="more" :size="16" />
          </button>
          <button class="offer-activity-primary-button" type="button">
            <AppIcon name="share" :size="15" />
            <span>Send reminder</span>
          </button>
          <button class="offer-activity-icon-button" type="button" aria-label="Close" @click="emit('back')">
            <AppIcon name="close" :size="16" />
          </button>
        </div>
      </header>

      <div class="offer-activity-layout">
        <section class="offer-activity-main">
          <article class="offer-activity-hero-card">
            <div class="offer-activity-hero-card__icon">
              <AppIcon name="share" :size="26" />
            </div>

            <div class="offer-activity-hero-card__copy">
              <h2>Offer successfully launched!</h2>
              <div class="offer-activity-hero-card__meta">
                <span><AppIcon name="mail" :size="14" /> {{ candidateEmail }}</span>
                <span><AppIcon name="calendar" :size="14" /> May 15, 2025</span>
                <span><AppIcon name="clock" :size="14" /> 10:24 AM PDT</span>
              </div>
            </div>

            <p class="offer-activity-hero-card__note">
              We'll automatically notify you when {{ candidateFirstName }} opens, signs, or responds.
            </p>
          </article>

          <article class="offer-activity-panel">
            <div class="offer-activity-panel__head">
              <h3>Activity Timeline</h3>
              <button class="offer-activity-filter" type="button">
                <AppIcon name="filter" :size="13" />
                <span>All events</span>
                <AppIcon name="chevronDown" :size="13" />
              </button>
            </div>

            <div class="offer-activity-timeline">
              <article
                v-for="item in timelineRows"
                :key="item.title"
                class="offer-activity-timeline__item"
              >
                <div class="offer-activity-timeline__time">
                  <strong>{{ item.time }}</strong>
                  <small v-if="item.date">{{ item.date }}</small>
                </div>

                <div class="offer-activity-timeline__rail">
                  <span class="offer-activity-timeline__dot" :class="`is-${item.tone}`">
                    <AppIcon :name="item.icon" :size="15" />
                  </span>
                  <i aria-hidden="true" />
                </div>

                <div class="offer-activity-timeline__content">
                  <div class="offer-activity-timeline__row">
                    <strong>{{ item.title }}</strong>
                    <small v-if="item.actor">{{ item.actor }}</small>
                    <em v-if="item.status">{{ item.status }}</em>
                  </div>
                  <p>{{ item.description }}</p>
                </div>
              </article>
            </div>
          </article>
        </section>

        <aside class="offer-activity-sidebar">
          <article class="offer-activity-panel">
            <h3>Current State</h3>

            <div class="offer-activity-state">
              <div class="offer-activity-state__status">
                <span><AppIcon name="clock" :size="18" /></span>
                <div>
                  <strong>Waiting for candidate</strong>
                  <small>{{ candidateFirstName }} has not opened the offer yet.</small>
                </div>
              </div>

              <div class="offer-activity-state__list">
                <article v-for="item in stateRows" :key="item.label">
                  <span><AppIcon :name="item.icon" :size="14" /> {{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                  <small>{{ item.note }}</small>
                </article>
              </div>
            </div>
          </article>

          <article class="offer-activity-panel offer-activity-panel--tinted">
            <h3>Tip from NitroSync</h3>
            <p>
              Candidates who open the offer within 24 hours are 3x more likely to respond.
            </p>
            <button class="offer-activity-inline-link" type="button">
              <span>Learn more</span>
              <AppIcon name="chevronRight" :size="14" />
            </button>
          </article>

          <article class="offer-activity-panel offer-activity-panel--candidate">
            <div class="offer-activity-candidate-card">
              <div class="offer-activity-candidate-card__avatar">{{ candidateInitials }}</div>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
                <small>{{ jobLocation }}</small>
              </div>
            </div>
          </article>
        </aside>
      </div>

      <footer class="offer-activity-footer">
        <button
          v-for="item in actionRows"
          :key="item.title"
          class="offer-activity-footer__action"
          type="button"
        >
          <span class="offer-activity-footer__icon">
            <AppIcon :name="item.icon" :size="17" />
          </span>
          <div>
            <strong>{{ item.title }}</strong>
            <small>{{ item.description }}</small>
          </div>
        </button>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.offer-activity-page {
  position: fixed;
  inset: 0;
  z-index: 60;
  padding: 18px;
  overflow-y: auto;
  background: rgba(17, 24, 39, 0.38);
  backdrop-filter: blur(10px);
}

.offer-activity-shell {
  width: min(1480px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 24px;
  border: 1px solid rgba(231, 237, 245, 0.96);
  border-radius: 28px;
  background:
    radial-gradient(circle at top center, rgba(255, 92, 162, 0.08), transparent 38%),
    linear-gradient(180deg, #fff 0%, #fffdfd 100%);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.offer-activity-topbar,
.offer-activity-topbar__actions,
.offer-activity-primary-button,
.offer-activity-icon-button,
.offer-activity-panel__head,
.offer-activity-filter,
.offer-activity-hero-card__meta,
.offer-activity-state__status,
.offer-activity-inline-link,
.offer-activity-candidate-card,
.offer-activity-footer__action {
  display: flex;
  align-items: center;
}

.offer-activity-topbar {
  justify-content: space-between;
  gap: 18px;
}

.offer-activity-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: #8b97ad;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-activity-breadcrumbs i {
  font-style: normal;
  color: #c0c9d9;
}

.offer-activity-breadcrumbs strong {
  color: #1d2b49;
}

.offer-activity-heading {
  margin-top: 8px;
}

.offer-activity-heading h1,
.offer-activity-hero-card__copy h2,
.offer-activity-panel h3,
.offer-activity-footer__action strong,
.offer-activity-timeline__content strong,
.offer-activity-state__status strong,
.offer-activity-candidate-card strong {
  margin: 0;
  color: #1d2b49;
}

.offer-activity-heading h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 2.05rem;
  font-weight: 800;
}

.offer-activity-heading h1 em {
  padding: 4px 9px;
  border-radius: 999px;
  color: #1ca35d;
  background: #ebfff3;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-activity-heading p,
.offer-activity-hero-card__note,
.offer-activity-timeline__content p,
.offer-activity-state__status small,
.offer-activity-state__list span,
.offer-activity-state__list small,
.offer-activity-panel p,
.offer-activity-candidate-card small,
.offer-activity-footer__action small {
  color: #8090ab;
}

.offer-activity-heading p {
  margin: 7px 0 0;
  font-size: 0.92rem;
}

.offer-activity-topbar__actions {
  gap: 10px;
}

.offer-activity-primary-button,
.offer-activity-icon-button,
.offer-activity-filter,
.offer-activity-inline-link,
.offer-activity-footer__action {
  border: 1px solid #dfe6f2;
  background: #fff;
}

.offer-activity-primary-button,
.offer-activity-icon-button,
.offer-activity-filter,
.offer-activity-inline-link,
.offer-activity-footer__action,
.offer-activity-panel button {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.offer-activity-primary-button:hover,
.offer-activity-icon-button:hover,
.offer-activity-filter:hover,
.offer-activity-inline-link:hover,
.offer-activity-footer__action:hover,
.offer-activity-panel button:hover {
  transform: translateY(-1px);
}

.offer-activity-primary-button {
  min-height: 42px;
  padding: 0 16px;
  gap: 8px;
  border-radius: 12px;
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #ff4ca0 0%, #ff247e 100%);
  box-shadow: 0 16px 30px rgba(255, 45, 135, 0.24);
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-activity-icon-button {
  width: 42px;
  height: 42px;
  justify-content: center;
  border-radius: 12px;
  color: #223251;
}

.offer-activity-layout {
  margin-top: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 0.64fr);
  gap: 18px;
  align-items: start;
}

.offer-activity-main,
.offer-activity-sidebar {
  display: grid;
  gap: 18px;
}

.offer-activity-panel,
.offer-activity-hero-card {
  border: 1px solid #edf1f8;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
}

.offer-activity-hero-card {
  padding: 20px 22px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) minmax(180px, 0.7fr);
  gap: 18px;
  align-items: center;
  background: linear-gradient(135deg, #fff6fb 0%, #fff 100%);
}

.offer-activity-hero-card__icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #ff2d87;
  background: rgba(255, 45, 135, 0.08);
}

.offer-activity-hero-card__copy h2 {
  font-size: 1.55rem;
  font-weight: 800;
}

.offer-activity-hero-card__meta {
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 10px;
  color: #4d5e7b;
  font-size: 0.78rem;
  font-weight: 700;
}

.offer-activity-hero-card__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.offer-activity-hero-card__note {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.55;
}

.offer-activity-panel {
  padding: 20px;
}

.offer-activity-panel__head {
  justify-content: space-between;
  gap: 12px;
}

.offer-activity-panel h3 {
  font-size: 1rem;
  font-weight: 800;
}

.offer-activity-filter {
  min-height: 36px;
  padding: 0 12px;
  gap: 8px;
  border-radius: 12px;
  color: #425271;
  font-size: 0.74rem;
  font-weight: 700;
}

.offer-activity-timeline {
  margin-top: 10px;
}

.offer-activity-timeline__item {
  display: grid;
  grid-template-columns: 110px 48px minmax(0, 1fr);
  gap: 14px;
}

.offer-activity-timeline__item + .offer-activity-timeline__item {
  margin-top: 10px;
}

.offer-activity-timeline__time {
  padding-top: 6px;
}

.offer-activity-timeline__time strong,
.offer-activity-state__list strong {
  display: block;
  color: #1d2b49;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-activity-timeline__time small {
  display: block;
  margin-top: 4px;
  color: #8a97ae;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-activity-timeline__rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.offer-activity-timeline__dot {
  position: relative;
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-activity-timeline__dot.is-pink {
  color: #ff2d87;
  background: #fff0f7;
}

.offer-activity-timeline__dot.is-violet {
  color: #6f57ff;
  background: #f2efff;
}

.offer-activity-timeline__dot.is-slate {
  color: #94a0b6;
  background: #f3f6fb;
}

.offer-activity-timeline__rail i {
  position: absolute;
  top: 36px;
  bottom: -14px;
  left: 50%;
  width: 1px;
  background: #e4e9f2;
  transform: translateX(-50%);
}

.offer-activity-timeline__item:last-child .offer-activity-timeline__rail i {
  display: none;
}

.offer-activity-timeline__content {
  min-width: 0;
  padding: 4px 0 12px;
}

.offer-activity-timeline__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.offer-activity-timeline__row strong {
  font-size: 0.98rem;
  font-weight: 800;
}

.offer-activity-timeline__row small {
  color: #7f8ca5;
  font-size: 0.72rem;
  font-weight: 700;
}

.offer-activity-timeline__row em {
  margin-left: auto;
  padding: 5px 10px;
  border-radius: 999px;
  color: #7c879b;
  background: #f3f5fa;
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
}

.offer-activity-timeline__content p {
  margin: 8px 0 0;
  font-size: 0.8rem;
  line-height: 1.55;
}

.offer-activity-state {
  margin-top: 14px;
  display: grid;
  gap: 18px;
}

.offer-activity-state__status {
  gap: 14px;
  padding: 16px;
  border: 1px solid #f6e4c9;
  border-radius: 18px;
  background: linear-gradient(135deg, #fffaf0 0%, #fff 100%);
}

.offer-activity-state__status span {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #f59f0b;
  background: rgba(245, 159, 11, 0.12);
}

.offer-activity-state__status strong {
  font-size: 1.02rem;
  font-weight: 800;
}

.offer-activity-state__status small {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
}

.offer-activity-state__list {
  display: grid;
  gap: 14px;
}

.offer-activity-state__list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px 12px;
  align-items: start;
}

.offer-activity-state__list span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  font-weight: 700;
}

.offer-activity-state__list small {
  grid-column: 2;
  justify-self: end;
  font-size: 0.72rem;
}

.offer-activity-panel--tinted {
  background: linear-gradient(135deg, #fbf7ff 0%, #fff 100%);
}

.offer-activity-panel--tinted p {
  margin: 12px 0 0;
  font-size: 0.82rem;
  line-height: 1.6;
}

.offer-activity-inline-link {
  margin-top: 16px;
  padding: 0;
  border: 0;
  color: #6f57ff;
  background: transparent;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 800;
}

.offer-activity-panel--candidate {
  padding: 16px;
}

.offer-activity-candidate-card {
  gap: 14px;
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #fff 0%, #fffdfd 100%);
}

.offer-activity-candidate-card__avatar {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #4d2b21 0%, #df6c00 100%);
  font-size: 1.2rem;
  font-weight: 800;
}

.offer-activity-candidate-card strong {
  display: block;
  font-size: 0.98rem;
  font-weight: 800;
}

.offer-activity-candidate-card small {
  display: block;
  margin-top: 4px;
  font-size: 0.76rem;
}

.offer-activity-footer {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 16px 34px rgba(255, 70, 146, 0.06);
}

.offer-activity-footer__action {
  min-width: 0;
  justify-content: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  text-align: left;
}

.offer-activity-footer__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
  flex: 0 0 auto;
}

.offer-activity-footer__action strong {
  display: block;
  font-size: 0.86rem;
  font-weight: 800;
}

.offer-activity-footer__action small {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
  line-height: 1.45;
}

@media (max-width: 1180px) {
  .offer-activity-layout {
    grid-template-columns: 1fr;
  }

  .offer-activity-footer {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .offer-activity-shell {
    width: calc(100vw - 20px);
    padding: 18px;
  }

  .offer-activity-topbar,
  .offer-activity-hero-card {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-activity-topbar__actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .offer-activity-timeline__item {
    grid-template-columns: 1fr;
  }

  .offer-activity-timeline__rail {
    display: none;
  }

  .offer-activity-footer {
    grid-template-columns: 1fr;
  }
}
</style>
