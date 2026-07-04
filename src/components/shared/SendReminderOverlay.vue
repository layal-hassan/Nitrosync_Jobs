<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
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
    default: 'Senior Product Designer',
  },
})

const emit = defineEmits(['close', 'send-reminder'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const selectedReminderType = ref('gentle')
const selectedChannels = ref(['Email', 'In-App', 'Slack', 'Teams'])

const pendingActions = [
  {
    id: 'emma',
    name: 'Emma Wilson',
    role: 'Hiring Manager',
    pending: 'Feedback Submission',
    due: 'Today',
    tone: 'pink',
    initials: 'EW',
  },
  {
    id: 'david',
    name: 'David Park',
    role: 'Portfolio Reviewer',
    pending: 'Review Request',
    due: 'Tomorrow',
    tone: 'slate',
    initials: 'DP',
  },
  {
    id: 'michael',
    name: 'Michael Chen',
    role: 'Technical Reviewer',
    pending: 'Feedback Submission',
    due: 'OVERDUE BY 2 DAYS',
    tone: 'slate',
    initials: 'MC',
  },
]

const reminderTypes = [
  { value: 'gentle', title: 'Gentle Reminder', note: 'Friendly reminder', icon: 'mail' },
  { value: 'today', title: 'Due Today', note: 'Action due today', icon: 'clock' },
  { value: 'overdue', title: 'Overdue', note: 'Action is overdue', icon: 'alert' },
  { value: 'custom', title: 'Custom Message', note: 'Write your own', icon: 'edit' },
]

const deliveryChannels = [
  { label: 'Email', icon: 'mail' },
  { label: 'In-App', icon: 'bell' },
  { label: 'Slack', icon: 'message' },
  { label: 'Teams', icon: 'users' },
]

const selectedReviewers = ref(pendingActions.map((item) => item.id))

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const allReviewersSelected = computed(() => (
  selectedReviewers.value.length === pendingActions.length
))

const selectedReminderCount = computed(() => selectedReviewers.value.length)

const messagePreview = computed(() => {
  if (selectedReminderType.value === 'today') {
    return `Hi {{name}},\n\nYour feedback for ${props.candidateName} is due today.\n\nDue Date: 22 May 2024\n\nThank you for your time!`
  }

  if (selectedReminderType.value === 'overdue') {
    return `Hi {{name}},\n\nYour feedback for ${props.candidateName} is overdue and still pending.\n\nDue Date: 22 May 2024\n\nPlease submit it when possible.`
  }

  if (selectedReminderType.value === 'custom') {
    return `Hi {{name}},\n\nA custom reminder will be sent to selected reviewers for ${props.candidateName}.\n\nPlease complete the pending action as soon as possible.`
  }

  return `Hi {{name}},\n\nThis is a friendly reminder that your feedback for ${props.candidateName} is still pending.\n\nDue Date: 22 May 2024\n\nThank you for your time!`
})

function toggleReviewer(reviewerId) {
  if (selectedReviewers.value.includes(reviewerId)) {
    selectedReviewers.value = selectedReviewers.value.filter((id) => id !== reviewerId)
    return
  }

  selectedReviewers.value = [...selectedReviewers.value, reviewerId]
}

function toggleAllReviewers() {
  selectedReviewers.value = allReviewersSelected.value
    ? []
    : pendingActions.map((item) => item.id)
}

function toggleChannel(channelLabel) {
  if (selectedChannels.value.includes(channelLabel)) {
    selectedChannels.value = selectedChannels.value.filter((label) => label !== channelLabel)
    return
  }

  selectedChannels.value = [...selectedChannels.value, channelLabel]
}

function closeOverlay() {
  emit('close')
}

function sendReminder() {
  emit('send-reminder')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="send-reminder-overlay" @click.self="closeOverlay">
      <section class="send-reminder-modal">
        <header class="send-reminder-modal__header">
          <div class="send-reminder-modal__title">
            <span class="send-reminder-modal__icon">
              <AppIcon name="alert" :size="19" />
            </span>
            <div>
              <h2>Send Reminder</h2>
              <p>Notify reviewers with pending actions</p>
            </div>
          </div>

          <button class="send-reminder-modal__close" type="button" aria-label="Close send reminder" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="send-reminder-modal__body">
          <section class="send-reminder-main">
            <section class="send-reminder-candidate">
              <div class="send-reminder-candidate__identity">
                <span class="send-reminder-candidate__avatar">{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                </div>
              </div>

              <div class="send-reminder-candidate__meta">
                <span><AppIcon name="user" :size="14" /> Round 1 - Technical Interview</span>
                <span><AppIcon name="calendar" :size="14" /> 22 May 2024</span>
              </div>
            </section>

            <section class="send-reminder-section">
              <div class="send-reminder-section__head">
                <h3>Pending Actions ({{ pendingActions.length }})</h3>
                <div class="send-reminder-section__tools">
                  <button type="button">+ Add Interviewer</button>
                  <button
                    type="button"
                    class="send-reminder-section__toggle"
                    :class="{ 'is-active': allReviewersSelected }"
                    @click="toggleAllReviewers"
                  >
                    <span class="send-reminder-checkbox" :class="{ 'is-active': allReviewersSelected }">
                      <AppIcon name="check" :size="11" />
                    </span>
                    <span>Select all</span>
                  </button>
                </div>
              </div>

              <div class="send-reminder-pending-list">
                <article v-for="item in pendingActions" :key="item.id" class="send-reminder-pending-card">
                  <button
                    type="button"
                    class="send-reminder-pending-card__check"
                    :aria-pressed="selectedReviewers.includes(item.id)"
                    @click="toggleReviewer(item.id)"
                  >
                    <span class="send-reminder-checkbox" :class="{ 'is-active': selectedReviewers.includes(item.id) }">
                      <AppIcon name="check" :size="11" />
                    </span>
                  </button>
                  <span class="send-reminder-pending-card__avatar" :class="`is-${item.tone}`">{{ item.initials }}</span>
                  <div class="send-reminder-pending-card__person">
                    <strong>{{ item.name }}</strong>
                    <p>{{ item.role }}</p>
                  </div>
                  <div class="send-reminder-pending-card__meta">
                    <span>Pending</span>
                    <strong>{{ item.pending }}</strong>
                  </div>
                  <div class="send-reminder-pending-card__meta">
                    <span>Due</span>
                    <strong :class="{ 'is-overdue': item.due.includes('OVERDUE') || item.due === 'Today' || item.due === 'Tomorrow' }">{{ item.due }}</strong>
                  </div>
                  <button type="button" class="send-reminder-pending-card__delete" aria-label="Remove reminder target">
                    <AppIcon name="trash" :size="15" />
                  </button>
                </article>
              </div>
            </section>

            <section class="send-reminder-section">
              <h3>Reminder Type</h3>
              <div class="send-reminder-types">
                <button
                  v-for="type in reminderTypes"
                  :key="type.value"
                  type="button"
                  class="send-reminder-type"
                  :class="{ 'is-active': selectedReminderType === type.value }"
                  @click="selectedReminderType = type.value"
                >
                  <AppIcon :name="type.icon" :size="17" />
                  <strong>{{ type.title }}</strong>
                  <small>{{ type.note }}</small>
                </button>
              </div>
            </section>

            <section class="send-reminder-section">
              <div class="send-reminder-section__head is-collapsible">
                <h3>Message Preview</h3>
                <AppIcon name="chevronDown" :size="16" />
              </div>

              <div class="send-reminder-message">
                <p>{{ messagePreview }}</p>
              </div>
            </section>

            <section class="send-reminder-section">
              <h3>Delivery Channels</h3>
              <div class="send-reminder-channels">
                <label v-for="channel in deliveryChannels" :key="channel.label" class="send-reminder-channel">
                  <input
                    :checked="selectedChannels.includes(channel.label)"
                    type="checkbox"
                    @change="toggleChannel(channel.label)"
                  >
                  <span class="send-reminder-channel__box" :class="{ 'is-active': selectedChannels.includes(channel.label) }">
                    <span class="send-reminder-checkbox" :class="{ 'is-active': selectedChannels.includes(channel.label) }">
                      <AppIcon name="check" :size="11" />
                    </span>
                    <AppIcon class="send-reminder-channel__icon" :name="channel.icon" :size="17" />
                    <span>{{ channel.label }}</span>
                  </span>
                </label>
              </div>
            </section>
          </section>

          <aside class="send-reminder-side">
            <section class="send-reminder-side__card is-highlight">
              <small>Hiring Intelligence</small>
              <p>David Park's review is the only remaining feedback blocking candidate progression.</p>
              <button type="button">Learn more</button>
            </section>

            <section class="send-reminder-side__card">
              <h3>What happens next?</h3>
              <div class="send-reminder-timeline">
                <article>
                  <span class="is-pink"><AppIcon name="alert" :size="12" /></span>
                  <div>
                    <strong>Reminder sent</strong>
                    <p>Reviewers will receive your reminder via selected channels.</p>
                  </div>
                </article>
                <article>
                  <span><AppIcon name="clock" :size="12" /></span>
                  <div>
                    <strong>Awaiting action</strong>
                    <p>They can complete their action directly from the notification.</p>
                  </div>
                </article>
                <article>
                  <span><AppIcon name="checkCircle" :size="12" /></span>
                  <div>
                    <strong>Progress updated</strong>
                    <p>You'll be notified once all pending actions are completed.</p>
                  </div>
                </article>
              </div>
            </section>

            <section class="send-reminder-side__card">
              <h3>Delivery Summary</h3>
              <ul>
                <li><AppIcon name="mail" :size="14" /> {{ selectedReminderCount }} email notifications</li>
                <li><AppIcon name="bell" :size="14" /> {{ selectedReminderCount }} in-app notifications</li>
                <li><AppIcon name="message" :size="14" /> {{ selectedReminderCount }} Slack notifications</li>
                <li><AppIcon name="users" :size="14" /> {{ selectedReminderCount }} Teams notifications</li>
              </ul>
              <p>Only selected reviewers will be notified.</p>
            </section>
          </aside>
        </div>

        <footer class="send-reminder-modal__footer">
          <button class="send-reminder-modal__secondary" type="button" @click="closeOverlay">Cancel</button>
          <button class="send-reminder-modal__primary" type="button" @click="sendReminder">
            <AppIcon name="alert" :size="15" />
            <span>Send Reminder</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.send-reminder-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(10px);
}

.send-reminder-modal {
  width: min(1180px, calc(100vw - 36px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  border: 1px solid #e7edf6;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
}

.send-reminder-modal__header,
.send-reminder-modal__title,
.send-reminder-modal__body,
.send-reminder-candidate,
.send-reminder-candidate__identity,
.send-reminder-candidate__meta,
.send-reminder-section__head,
.send-reminder-section__tools,
.send-reminder-section__toggle,
.send-reminder-pending-card,
.send-reminder-pending-card__check,
.send-reminder-types,
.send-reminder-type,
.send-reminder-channels,
.send-reminder-channel__box,
.send-reminder-timeline article,
.send-reminder-modal__footer {
  display: flex;
}

.send-reminder-modal__header,
.send-reminder-modal__footer {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 28px;
}

.send-reminder-modal__header {
  border-bottom: 1px solid #edf1f7;
}

.send-reminder-modal__title {
  align-items: center;
  gap: 14px;
}

.send-reminder-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #ff59a7;
  background: #fff0f7;
}

.send-reminder-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.08rem;
  font-weight: 800;
}

.send-reminder-modal__title p {
  margin: 5px 0 0;
  color: #7b869b;
}

.send-reminder-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.send-reminder-modal__body {
  align-items: flex-start;
  gap: 24px;
  padding: 20px 28px 24px;
}

.send-reminder-main {
  flex: 1;
  min-width: 0;
}

.send-reminder-side {
  flex: 0 0 270px;
  display: grid;
  gap: 18px;
  padding-left: 24px;
  border-left: 1px solid #edf1f7;
}

.send-reminder-candidate {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
}

.send-reminder-candidate__identity {
  align-items: center;
  gap: 14px;
}

.send-reminder-candidate__avatar,
.send-reminder-pending-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2a44 0%, #f373b7 100%);
}

.send-reminder-candidate__avatar {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  font-size: 0.95rem;
}

.send-reminder-candidate__identity strong,
.send-reminder-section h3,
.send-reminder-side__card h3 {
  color: #1f2a44;
  font-weight: 800;
}

.send-reminder-candidate__identity p {
  margin: 4px 0 0;
  color: #6c7891;
}

.send-reminder-candidate__meta {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  color: #6c7891;
}

.send-reminder-candidate__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.send-reminder-section {
  margin-top: 26px;
}

.send-reminder-section__head {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.send-reminder-section__head.is-collapsible {
  margin-bottom: 12px;
}

.send-reminder-section h3 {
  margin: 0;
  font-size: 0.98rem;
}

.send-reminder-section__tools {
  align-items: center;
  gap: 18px;
}

.send-reminder-section__tools > button {
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid #ffc5df;
  border-radius: 10px;
  background: #fff4f9;
  color: #ff59a7;
  font-weight: 700;
  cursor: pointer;
}

.send-reminder-section__toggle {
  align-items: center;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7b869b;
  cursor: pointer;
}

.send-reminder-section__tools input,
.send-reminder-channel input {
  display: none;
}

.send-reminder-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 1px solid #d7deeb;
  border-radius: 6px;
  background: #ffffff;
  color: transparent;
}

.send-reminder-checkbox.is-active {
  border-color: #ef77bd;
  background: #ef77bd;
  color: #ffffff;
}

.send-reminder-pending-list {
  display: grid;
  gap: 12px;
}

.send-reminder-pending-card {
  align-items: center;
  gap: 14px;
  padding: 14px 12px;
  border: 1px solid #edf1f7;
  border-radius: 14px;
}

.send-reminder-pending-card__check {
  padding: 0;
  border: 0;
  background: transparent;
  justify-content: center;
  cursor: pointer;
}

.send-reminder-pending-card__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 0.82rem;
}

.send-reminder-pending-card__avatar.is-slate {
  background: linear-gradient(135deg, #1f2a44 0%, #5f708f 100%);
}

.send-reminder-pending-card__person {
  flex: 1;
  min-width: 0;
}

.send-reminder-pending-card__person strong {
  color: #1f2a44;
}

.send-reminder-pending-card__person p,
.send-reminder-pending-card__meta span,
.send-reminder-side__card p {
  margin: 4px 0 0;
  color: #7b869b;
}

.send-reminder-pending-card__meta {
  min-width: 150px;
}

.send-reminder-pending-card__meta strong {
  display: block;
  margin-top: 3px;
  color: #1f2a44;
}

.send-reminder-pending-card__meta strong.is-overdue {
  color: #f97316;
}

.send-reminder-pending-card__delete {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.send-reminder-types {
  gap: 12px;
}

.send-reminder-type {
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: 7px;
  padding: 16px;
  border: 1px solid #e0e7f3;
  border-radius: 14px;
  background: #fff;
  color: #7b869b;
  text-align: left;
  cursor: pointer;
}

.send-reminder-type strong {
  color: #334155;
}

.send-reminder-type small {
  color: #9aa4b8;
}

.send-reminder-type.is-active {
  border-color: #ff59a7;
  background: #fff4f9;
  color: #ff59a7;
}

.send-reminder-message {
  padding: 18px 20px;
  border: 1px solid #dce3ee;
  border-radius: 14px;
  background: #f8fbff;
}

.send-reminder-message p {
  margin: 0;
  color: #46536a;
  line-height: 1.8;
  white-space: pre-wrap;
}

.send-reminder-channels {
  gap: 12px;
  flex-wrap: nowrap;
}

.send-reminder-channel {
  flex: 1 1 0;
  cursor: pointer;
}

.send-reminder-channel__box {
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 54px;
  padding: 0 18px;
  border: 1px solid #e0e7f3;
  border-radius: 14px;
  color: #334155;
}

.send-reminder-channel__box.is-active {
  border-color: #ef77bd;
  background: #fff4f9;
}

.send-reminder-channel__icon {
  color: #475569;
}

.send-reminder-side__card {
  padding: 18px;
  border: 1px solid #edf1f7;
  border-radius: 16px;
  background: #fff;
}

.send-reminder-side__card.is-highlight {
  border-color: #dce3fb;
  background: linear-gradient(180deg, #f7f8ff 0%, #fbfcff 100%);
}

.send-reminder-side__card small {
  color: #ff59a7;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.send-reminder-side__card.is-highlight p {
  margin-top: 14px;
  color: #4f46e5;
  line-height: 1.45;
}

.send-reminder-side__card.is-highlight button {
  margin-top: 18px;
  border: 0;
  background: transparent;
  color: #ff59a7;
  font-weight: 700;
  cursor: pointer;
}

.send-reminder-timeline {
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.send-reminder-timeline article {
  align-items: flex-start;
  gap: 12px;
}

.send-reminder-timeline span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 1px solid #dce3ee;
  border-radius: 50%;
  color: #9aa4b8;
}

.send-reminder-timeline span.is-pink {
  color: #ff59a7;
  border-color: #ffc5df;
}

.send-reminder-timeline strong {
  display: block;
  color: #334155;
}

.send-reminder-timeline p {
  margin: 4px 0 0;
  line-height: 1.45;
}

.send-reminder-side__card ul {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  color: #475569;
}

.send-reminder-side__card li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.send-reminder-side__card > p:last-child {
  margin-top: 18px;
  font-size: 0.84rem;
}

.send-reminder-modal__footer {
  padding: 20px 28px 26px;
}

.send-reminder-modal__secondary,
.send-reminder-modal__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
}

.send-reminder-modal__secondary {
  border: 1px solid #dce3ee;
  background: #fff;
  color: #4b5565;
  cursor: pointer;
}

.send-reminder-modal__primary {
  border: 0;
  color: #fff;
  background: linear-gradient(135deg, #f15da9 0%, #ef77bd 100%);
  cursor: pointer;
}

@media (max-width: 1080px) {
  .send-reminder-modal__body {
    flex-direction: column;
  }

  .send-reminder-side {
    width: 100%;
    flex-basis: auto;
    padding-left: 0;
    padding-top: 24px;
    border-left: 0;
    border-top: 1px solid #edf1f7;
  }

  .send-reminder-types,
  .send-reminder-section__head,
  .send-reminder-section__tools {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 760px) {
  .send-reminder-overlay {
    padding: 12px;
  }

  .send-reminder-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
  }

  .send-reminder-modal__header,
  .send-reminder-modal__body,
  .send-reminder-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .send-reminder-candidate,
  .send-reminder-pending-card,
  .send-reminder-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
