<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['close', 'send-reminder', 'withdraw-offer', 'view-offer'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const timelineRows = [
  ['Offer sent', 'Jun 2, 2026, 10:42 AM', 'Sent by Bethany', 'pink'],
  ['Offer delivered', 'Jun 2, 2026, 10:48 AM', 'Email delivered to marvin@email.com', 'pink'],
  ['Offer viewed', 'Jun 2, 2026, 11:18 AM', 'From San Francisco, CA, US', 'pink'],
  ['Waiting for acceptance', 'Since Jun 2, 2026, 11:18 AM', '—', 'amber'],
  ['Offer accepted', '—', '', 'slate'],
  ['Completed', '—', '', 'slate'],
]

const messageRows = [
  ['B', 'Offer sent', `Hi ${props.candidateName.split(' ')[0] || 'Marvin'}, we're excited to offer you the Senior Frontend Developer position. Please review...`, 'Jun 2, 2026, 10:42 AM'],
  ['M', 'This is a fantastic opportunity. Thank you!', 'Replied via Email', 'Jun 2, 2026, 11:25 AM'],
]

const engagementInsightRows = [
  ['eye', 'violet', 'Views', '2', 'Last viewed', 'Jun 2, 2026, 11:18 AM'],
  ['clock', 'blue', 'Total time spent', '1m 28s', 'Avg. time spent', '44s per session'],
  ['building', 'green', 'Device', 'Desktop', 'Browser', 'Chrome'],
  ['mapPin', 'orange', 'Location', 'San Francisco, CA', 'Last activity', '2 min ago'],
]

const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

watch(() => props.open, (isOpen) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOverflow
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="track-offer-overlay" @click.self="emit('close')">
      <section class="track-offer-modal" @click.stop>
        <header class="track-offer-header">
          <div>
            <button type="button" class="track-offer-back" @click="emit('close')">
              <AppIcon name="chevronLeft" :size="13" />
              <span>Back to candidate</span>
            </button>
            <h2>Track Offer Acceptance</h2>
            <p>Real-time view of offer status and acceptance progress.</p>
          </div>

          <div class="track-offer-header__actions">
            <button type="button">
              <AppIcon name="document" :size="13" />
              <span>Download PDF</span>
            </button>
            <button type="button">
              <span>More actions</span>
              <AppIcon name="chevronDown" :size="13" />
            </button>
            <button type="button" class="track-offer-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="15" />
            </button>
          </div>
        </header>

        <section class="track-offer-summary">
          <article class="track-offer-candidate">
            <span class="track-offer-candidate__avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateRole }}</small>
              <button type="button" @click="emit('view-offer')">View candidate profile</button>
            </div>
          </article>

          <article><span>Job</span><strong>{{ candidateRole }}</strong></article>
          <article><span>Department</span><strong>Engineering</strong></article>
          <article><span>Location</span><strong>San Francisco, CA</strong></article>
          <article><span>Employment Type</span><strong>Full-time</strong></article>
          <article><span>Offer ID</span><strong>OFF-2026-1287</strong></article>
          <article><span>Sent On</span><strong>Jun 2, 2026, 10:42 AM</strong></article>
        </section>

        <div class="track-offer-layout">
          <article class="track-offer-card">
            <h3>Offer Timeline</h3>
            <div class="track-offer-timeline">
              <article v-for="item in timelineRows" :key="item[0]">
                <span :class="`is-${item[3]}`" />
                <div>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                  <em v-if="item[2]">{{ item[2] }}</em>
                </div>
              </article>
            </div>
            <button type="button" class="track-offer-link">View full activity log</button>
          </article>

          <section class="track-offer-main">
            <article class="track-offer-card">
              <h3>Offer Status</h3>
              <div class="track-offer-status">
                <strong>Waiting for Acceptance</strong>
                <p>The candidate has viewed the offer.</p>
              </div>

              <div class="track-offer-progress">
                <div class="track-offer-progress__line">
                  <i class="is-active" />
                  <i class="is-active" />
                  <i />
                  <i />
                </div>
                <div class="track-offer-progress__labels">
                  <span>Sent</span>
                  <span>Viewed</span>
                  <span>Accepted</span>
                  <span>Completed</span>
                </div>
              </div>

              <div class="track-offer-reminder">
                <div>
                  <strong>Set reminder</strong>
                  <small>In 2 days • at 9:00 AM</small>
                </div>
                <button type="button" @click="emit('send-reminder')">Send reminder</button>
              </div>
            </article>

            <article class="track-offer-card">
              <h3>Engagement Insights</h3>
              <div class="track-offer-insights">
                <article v-for="item in engagementInsightRows" :key="item[2]">
                  <span class="track-offer-insights__icon" :class="`is-${item[1]}`">
                    <AppIcon :name="item[0]" :size="13" />
                  </span>
                  <small class="track-offer-insights__label">{{ item[2] }}</small>
                  <strong>{{ item[3] }}</strong>
                  <small>{{ item[4] }}</small>
                  <p>{{ item[5] }}</p>
                </article>
              </div>
            </article>

            <article class="track-offer-card">
              <h3>Messages to Candidate</h3>
              <div class="track-offer-messages">
                <article v-for="item in messageRows" :key="`${item[0]}-${item[1]}`">
                  <span>{{ item[0] }}</span>
                  <div>
                    <strong>{{ item[1] }}</strong>
                    <p>{{ item[2] }}</p>
                  </div>
                  <small>{{ item[3] }}</small>
                </article>
              </div>
              <button type="button" class="track-offer-link">View all messages</button>
            </article>
          </section>

          <aside class="track-offer-side">
            <article class="track-offer-card">
              <h3>Offer Document</h3>
              <div class="track-offer-document">
                <div class="track-offer-document__file">
                  <span><AppIcon name="document" :size="14" /></span>
                  <div>
                    <strong>Offer Letter</strong>
                    <small>PDF • 4 pages</small>
                  </div>
                </div>
                <button type="button" @click="emit('view-offer')">
                  <AppIcon name="eye" :size="13" />
                </button>
              </div>

              <div class="track-offer-document__meta">
                <article><span>Offer ID</span><strong>OFF-2026-1287</strong></article>
                <article><span>Compensation</span><strong>$142,000 / year</strong></article>
              </div>
            </article>

            <article class="track-offer-card">
              <div class="track-offer-actions">
                <button type="button" @click="emit('send-reminder')">
                  <AppIcon name="bell" :size="13" />
                  <span>Send reminder</span>
                </button>
                <button type="button">
                  <AppIcon name="document" :size="13" />
                  <span>Download PDF</span>
                </button>
                <button type="button" class="is-danger" @click="emit('withdraw-offer')">
                  <AppIcon name="close" :size="13" />
                  <span>Withdraw offer</span>
                </button>
                <button type="button">
                  <AppIcon name="edit" :size="13" />
                  <span>Create amendment</span>
                </button>
              </div>
            </article>

            <article class="track-offer-card track-offer-tip">
              <strong>Increase acceptance rate</strong>
              <p>Send a follow-up reminder and share benefits highlights after 48 hours of inactivity.</p>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.track-offer-overlay {
  position: fixed;
  inset: 0;
  z-index: 96;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(10px);
}

.track-offer-modal {
  width: min(1360px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.track-offer-header,
.track-offer-header__actions,
.track-offer-summary,
.track-offer-candidate,
.track-offer-progress__line,
.track-offer-progress__labels,
.track-offer-reminder,
.track-offer-document,
.track-offer-document__file,
.track-offer-actions button {
  display: flex;
  align-items: center;
}

.track-offer-header,
.track-offer-summary,
.track-offer-layout {
  padding: 18px 22px;
}

.track-offer-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.track-offer-back {
  margin-bottom: 8px;
  padding: 0;
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7d8cab;
  background: transparent;
  font-size: 0.7rem;
  font-weight: 700;
}

.track-offer-header h2,
.track-offer-card h3,
.track-offer-candidate strong,
.track-offer-timeline strong,
.track-offer-status strong,
.track-offer-insights strong,
.track-offer-document strong,
.track-offer-document__meta strong,
.track-offer-messages strong,
.track-offer-tip strong {
  margin: 0;
  color: #1f2c4f;
}

.track-offer-header p,
.track-offer-summary span,
.track-offer-summary small,
.track-offer-timeline small,
.track-offer-timeline em,
.track-offer-status p,
.track-offer-reminder small,
.track-offer-insights span,
.track-offer-insights small,
.track-offer-document small,
.track-offer-messages p,
.track-offer-messages small,
.track-offer-tip p {
  margin: 0;
  color: #7d8cab;
}

.track-offer-header__actions {
  gap: 10px;
}

.track-offer-header__actions button,
.track-offer-reminder button,
.track-offer-document button {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font-size: 0.72rem;
  font-weight: 800;
}

.track-offer-close {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.track-offer-summary {
  gap: 12px;
  border-bottom: 1px solid #edf1f8;
}

.track-offer-summary > article {
  min-height: 72px;
  padding: 12px 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  flex: 1 1 0;
  display: grid;
  gap: 4px;
}

.track-offer-candidate {
  flex: 1.4 1 0;
  gap: 12px;
}

.track-offer-candidate__avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.92rem;
  font-weight: 800;
}

.track-offer-candidate button,
.track-offer-link {
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 800;
}

.track-offer-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 260px;
  gap: 16px;
  align-items: start;
}

.track-offer-main,
.track-offer-side,
.track-offer-insights,
.track-offer-actions {
  display: grid;
  gap: 14px;
}

.track-offer-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.track-offer-card h3 {
  margin-bottom: 14px;
}

.track-offer-timeline {
  display: grid;
  gap: 14px;
}

.track-offer-timeline article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.track-offer-timeline span {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 999px;
  display: inline-block;
}

.track-offer-timeline span.is-pink {
  background: #ff2d87;
}

.track-offer-timeline span.is-amber {
  background: #f59e0b;
}

.track-offer-timeline span.is-slate {
  background: #cbd5e1;
}

.track-offer-timeline strong,
.track-offer-timeline small,
.track-offer-timeline em {
  display: block;
}

.track-offer-timeline em {
  margin-top: 4px;
  font-style: normal;
  font-size: 0.68rem;
}

.track-offer-status {
  padding: 14px;
  border: 1px solid #ffdce9;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff4f9 0%, #fff 100%);
}

.track-offer-status strong {
  display: block;
  font-size: 0.94rem;
  font-weight: 800;
}

.track-offer-status p {
  margin-top: 6px;
  font-size: 0.72rem;
}

.track-offer-progress {
  margin-top: 16px;
}

.track-offer-progress__line {
  justify-content: space-between;
  position: relative;
}

.track-offer-progress__line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;
  height: 2px;
  background: #e4eaf5;
  transform: translateY(-50%);
}

.track-offer-progress__line i {
  width: 12px;
  height: 12px;
  border: 2px solid #d5dceb;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  background: #fff;
}

.track-offer-progress__line i.is-active {
  border-color: #ff2d87;
  background: #ff2d87;
}

.track-offer-progress__labels {
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  color: #7d8cab;
  font-size: 0.66rem;
  font-weight: 700;
}

.track-offer-reminder {
  justify-content: space-between;
  gap: 14px;
  margin-top: 14px;
  padding: 14px;
  border-radius: 14px;
  background: #fff8fb;
}

.track-offer-reminder strong,
.track-offer-reminder small {
  display: block;
}

.track-offer-insights {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.track-offer-insights article {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  gap: 5px;
}

.track-offer-insights__icon {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.track-offer-insights__icon.is-violet {
  color: #6d5cff;
  background: #f1efff;
}

.track-offer-insights__icon.is-blue {
  color: #2563eb;
  background: #eef5ff;
}

.track-offer-insights__icon.is-green {
  color: #16a34a;
  background: #effcf4;
}

.track-offer-insights__icon.is-orange {
  color: #f59e0b;
  background: #fff6e8;
}

.track-offer-insights__label {
  margin-top: 2px;
}

.track-offer-messages {
  display: grid;
  gap: 12px;
}

.track-offer-messages article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f8;
}

.track-offer-messages article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.track-offer-messages span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
  font-size: 0.72rem;
  font-weight: 800;
}

.track-offer-messages p {
  margin-top: 4px;
  font-size: 0.72rem;
  line-height: 1.45;
}

.track-offer-document {
  justify-content: space-between;
  gap: 12px;
}

.track-offer-document__file {
  gap: 10px;
}

.track-offer-document__file > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.track-offer-document__meta {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.track-offer-document__meta article {
  display: grid;
  gap: 4px;
}

.track-offer-actions button {
  justify-content: space-between;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #edf1f8;
  border-radius: 12px;
  color: #223251;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}

.track-offer-actions button.is-danger {
  color: #ff2d87;
}

.track-offer-tip {
  background: linear-gradient(180deg, #f6f1ff 0%, #fff 100%);
}

.track-offer-tip p {
  margin-top: 8px;
  font-size: 0.72rem;
  line-height: 1.5;
}

@media (max-width: 1180px) {
  .track-offer-layout {
    grid-template-columns: 1fr;
  }

  .track-offer-insights {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .track-offer-overlay {
    padding: 12px;
  }

  .track-offer-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .track-offer-header,
  .track-offer-summary,
  .track-offer-insights,
  .track-offer-messages article {
    display: grid;
    grid-template-columns: 1fr;
  }
}
</style>
