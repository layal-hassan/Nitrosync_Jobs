<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import ReviewBackgroundOverlay from '../shared/ReviewBackgroundOverlay.vue'

const props = defineProps({
  jobId: {
    type: String,
    default: 'ac-1187',
  },
  candidateId: {
    type: String,
    default: '',
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

const totalChecks = 6
const assignedReviewersCount = 11
const totalDocuments = 5
const submittedDocuments = 2
const completionPercent = 42

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateEmail = computed(() => {
  const normalized = (props.candidateName || 'marvin mckinney')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .join('.')

  return `${normalized || 'marvin.mckinney'}@email.com`
})

const invitationLink = computed(() => (
  `https://nitrosync.app/manual-verification/${props.jobId}/${props.candidateId || 'candidate'}`
))

const activeWorkflowStep = ref(4)
const reviewResultsOpen = ref(false)

const workflowSteps = computed(() => ([
  { label: 'Setup', number: '1', state: 'complete' },
  { label: 'Assign Reviewers', number: '2', state: 'complete' },
  { label: 'Review & Send', number: '3', state: 'complete' },
  { label: 'In Progress', number: '4', state: activeWorkflowStep.value >= 5 ? 'complete' : 'active' },
  { label: 'Results', number: '5', state: activeWorkflowStep.value >= 5 ? 'active' : 'pending' },
]))

const requestOverview = [
  ['Verification Type', 'Manual'],
  ['Requested by', 'Sarah Johnson'],
  ['Request date', 'May 12, 2025 - 10:24 AM'],
  ['Due date', 'Jun 12, 2025'],
  ['Priority', 'Medium'],
  ['Estimated duration', '2 - 5 business days'],
]

const heroMetrics = computed(() => ([
  ['Verification Checks', `${totalChecks}`, 'checkCircle'],
  ['Reviewers Assigned', `${assignedReviewersCount}`, 'users'],
  ['Required Documents', `${totalDocuments}`, 'document'],
  ['Documents Received', `${submittedDocuments} / ${totalDocuments}`, 'mail'],
  ['Overall Progress', `${completionPercent}%`, 'refresh'],
]))

const verificationChecks = [
  {
    label: 'Identity Verification',
    detail: 'Waiting for Documents',
    progress: 0,
    tone: 'waiting',
    icon: 'shield',
  },
  {
    label: 'Employment Verification',
    detail: 'In Progress',
    progress: 50,
    tone: 'progress',
    icon: 'briefcase',
  },
  {
    label: 'Education Verification',
    detail: 'In Progress',
    progress: 30,
    tone: 'progress',
    icon: 'document',
  },
  {
    label: 'Reference Verification',
    detail: 'Completed',
    progress: 100,
    tone: 'completed',
    icon: 'users',
  },
  {
    label: 'Right to Work Verification',
    detail: 'Waiting for Documents',
    progress: 0,
    tone: 'waiting',
    icon: 'document',
  },
  {
    label: 'Custom Check',
    meta: 'Professional License',
    detail: 'In Progress',
    progress: 40,
    tone: 'progress',
    icon: 'document',
  },
]

const assignedReviewers = [
  { name: 'Sarah Johnson', role: 'Primary', checks: 3 },
  { name: 'John Smith', role: 'Primary', checks: 2 },
  { name: 'Lisa Brown', role: 'Reviewer', checks: 2 },
  { name: 'Emily Davis', role: 'Primary', checks: 1 },
  { name: 'David Miller', role: 'Primary', checks: 1 },
]

const requiredDocuments = [
  { label: 'Passport', status: 'Uploaded', tone: 'uploaded' },
  { label: 'Government ID', status: 'Uploaded', tone: 'uploaded' },
  { label: 'Employment Certificate', status: 'Pending', tone: 'pending' },
  { label: 'Diploma / Degree Certificate', status: 'Uploaded', tone: 'uploaded' },
  { label: 'Employment Contract', status: 'Pending', tone: 'pending' },
]

const overallProgressBreakdown = [
  { label: 'Completed', count: 2, color: '#22c55e' },
  { label: 'In Progress', count: 3, color: '#3b82f6' },
  { label: 'Waiting', count: 1, color: '#f59e0b' },
  { label: 'Not Started', count: 0, color: '#d6dcea' },
]

const overallProgressRingStyle = computed(() => {
  const total = overallProgressBreakdown.reduce((sum, item) => sum + item.count, 0) || 1
  let current = 0

  const stops = overallProgressBreakdown.map((item) => {
    const start = (current / total) * 360
    current += item.count
    const end = (current / total) * 360
    return `${item.color} ${start}deg ${end}deg`
  }).join(', ')

  return {
    background: `conic-gradient(${stops})`,
  }
})

const activityFeed = ref([
  { time: '10:24 AM', title: 'Invitation email sent', detail: 'to candidate', tone: 'green', icon: 'mail' },
  { time: '10:42 AM', title: 'Candidate opened', detail: 'the invitation', tone: 'blue', icon: 'eye' },
  { time: '11:03 AM', title: 'Passport uploaded', detail: 'by candidate', tone: 'green', icon: 'document' },
  { time: '11:10 AM', title: 'Identity verification', detail: 'started by Sarah Johnson', tone: 'purple', icon: 'shield' },
  { time: '11:45 AM', title: 'Identity verification', detail: 'approved by Sarah Johnson', tone: 'green', icon: 'checkCircle' },
])

const invitationStats = [
  { label: 'Invitation Status', value: 'Delivered', meta: 'Opened', note: 'May 12, 2025 - 10:42 AM' },
  { label: 'Reminders', value: '0 sent', meta: 'No reminders sent yet' },
  { label: 'Documents Submitted', value: `${submittedDocuments} / ${totalDocuments}`, meta: '2 uploaded · 3 pending' },
]

const resendConsentModalOpen = ref(false)
const copyConsentLinkModalOpen = ref(false)
const cancelRequestModalOpen = ref(false)
const resendReminderMessage = ref('Hi Marvin,\n\nJust a reminder to complete your manual verification upload request.')
const reminderSent = ref(false)
const invitationLinkCopied = ref(false)
const cancelRequestReason = ref('Select a reason')
const cancelRequestNote = ref('')
let copyResetTimer = null

const resendReminderCount = computed(() => resendReminderMessage.value.length)
const cancelRequestNoteCount = computed(() => cancelRequestNote.value.length)

function goBackToPipeline() {
  emit('back')
}

function closePage() {
  emit('back')
}

function openResultsStep() {
  activeWorkflowStep.value = 5
  reviewResultsOpen.value = true
}

function closeResultsStep() {
  reviewResultsOpen.value = false
  activeWorkflowStep.value = 4
}

function handleWorkflowStepClick(stepNumber) {
  if (stepNumber === '5') {
    openResultsStep()
    return
  }

  if (stepNumber === '4') {
    closeResultsStep()
  }
}

function openCandidateProfile() {
  if (typeof window === 'undefined') {
    return
  }

  window.location.hash = `#job/${props.jobId}/pipeline`
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function progressClass(value) {
  if (value >= 100) {
    return 'is-completed'
  }

  if (value > 0) {
    return 'is-progress'
  }

  return 'is-waiting'
}

function handleInvitationAction(actionId) {
  if (actionId === 'open') {
    copyConsentLinkModalOpen.value = true
    return
  }

  if (actionId === 'remind') {
    resendConsentModalOpen.value = true
    return
  }

  cancelRequestModalOpen.value = true
}

function closeResendConsentModal() {
  resendConsentModalOpen.value = false
}

function closeCopyConsentLinkModal() {
  copyConsentLinkModalOpen.value = false
}

function closeCancelRequestModal() {
  cancelRequestModalOpen.value = false
}

function sendReminder() {
  const reminderItem = {
    time: '12:08 PM',
    title: 'Reminder sent',
    detail: 'candidate notified again',
    tone: 'purple',
    icon: 'mail',
  }

  const existingIndex = activityFeed.value.findIndex((item) => item.title === reminderItem.title)

  if (existingIndex >= 0) {
    activityFeed.value.splice(existingIndex, 1)
  }

  activityFeed.value.unshift(reminderItem)
  reminderSent.value = true
  resendConsentModalOpen.value = false
}

async function copyInvitationLink() {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(invitationLink.value)
    }

    invitationLinkCopied.value = true

    if (copyResetTimer) {
      clearTimeout(copyResetTimer)
    }

    copyResetTimer = setTimeout(() => {
      invitationLinkCopied.value = false
      copyResetTimer = null
    }, 1800)
  } catch {
    invitationLinkCopied.value = false
  }
}

function confirmCancelRequest() {
  activityFeed.value.unshift({
    time: '12:16 PM',
    title: 'Manual verification canceled',
    detail: 'request was closed before completion',
    tone: 'purple',
    icon: 'close',
  })

  cancelRequestModalOpen.value = false
}

onBeforeUnmount(() => {
  if (copyResetTimer) {
    clearTimeout(copyResetTimer)
    copyResetTimer = null
  }
})
</script>

<template>
  <div class="background-check-progress-page">
    <section class="background-check-progress-shell">
      <header class="background-check-progress-shell__head">
        <div class="background-check-progress-shell__title">
          <span>
            <AppIcon name="shield" :size="16" />
          </span>
          <div>
            <h1>Background Check Progress</h1>
            <p>Manual Verification Setup</p>
          </div>
        </div>

        <div class="background-check-progress-shell__steps">
          <button
            v-for="step in workflowSteps"
            :key="step.label"
            type="button"
            class="background-check-progress-shell__step"
            :class="`is-${step.state}`"
            :disabled="step.number !== '4' && step.number !== '5'"
            @click="handleWorkflowStepClick(step.number)"
          >
            <span>
              <AppIcon v-if="step.state === 'complete'" name="check" :size="13" />
              <template v-else>{{ step.number }}</template>
            </span>
          </button>
        </div>

        <button type="button" class="background-check-progress-shell__close" @click="closePage">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <div class="background-check-progress-shell__body">
        <aside class="background-check-progress-sidebar">
          <article class="background-check-progress-card background-check-progress-sidebar__candidate">
            <div class="background-check-progress-person">
              <span class="background-check-progress-person__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <span class="background-check-progress-person__chip">Software Engineer (US)</span>
              </div>
            </div>

            <button type="button" class="background-check-progress-sidebar__button" @click="openCandidateProfile">
              View Candidate Profile
              <AppIcon name="external-link" :size="14" />
            </button>
          </article>

          <article class="background-check-progress-card background-check-progress-sidebar__overview">
            <h3>Request Overview</h3>

            <dl>
              <div v-for="[label, value] in requestOverview" :key="label">
                <dt>{{ label }}</dt>
                <dd :class="{ 'is-priority': label === 'Priority', 'is-type': label === 'Verification Type' }">
                  {{ value }}
                </dd>
              </div>
            </dl>
          </article>

          <article class="background-check-progress-card background-check-progress-sidebar__help">
            <span>
              <AppIcon name="sparkles" :size="16" />
            </span>
            <div>
              <strong>Need Help?</strong>
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <button type="button">Contact Support</button>
          </article>
        </aside>

        <main class="background-check-progress-main">
          <article class="background-check-progress-card background-check-progress-hero">
            <div class="background-check-progress-hero__copy">
              <span>
                <AppIcon name="checkCircle" :size="18" />
              </span>
              <div>
                <strong>Manual Verification In Progress</strong>
                <p>Reviewers are working on their tasks. You will be notified of important updates.</p>
              </div>
            </div>

            <div class="background-check-progress-hero__metrics">
              <article v-for="[label, value, icon] in heroMetrics" :key="label">
                <span>
                  <AppIcon :name="icon" :size="13" />
                </span>
                <div>
                  <strong>{{ value }}</strong>
                  <small>{{ label }}</small>
                </div>
              </article>
            </div>
          </article>

          <div class="background-check-progress-main__grid">
            <article class="background-check-progress-card">
              <div class="background-check-progress-card__head">
                <h2>Verification Progress ({{ totalChecks }})</h2>
              </div>

              <div class="background-check-progress-checks">
                <article
                  v-for="item in verificationChecks"
                  :key="item.label"
                  class="background-check-progress-checks__item"
                >
                  <div class="background-check-progress-checks__title">
                    <span>
                      <AppIcon :name="item.icon" :size="13" />
                    </span>
                    <div>
                      <strong>{{ item.label }}</strong>
                      <small v-if="item.meta">({{ item.meta }})</small>
                    </div>
                  </div>

                  <div class="background-check-progress-checks__track">
                    <div class="background-check-progress-checks__meta">
                      <em :class="`is-${item.tone}`">{{ item.detail }}</em>
                      <strong>{{ item.progress }}%</strong>
                    </div>
                    <div class="background-check-progress-checks__bar" :class="progressClass(item.progress)">
                      <span :style="{ width: `${item.progress}%` }" />
                    </div>
                  </div>
                </article>
              </div>

              <button type="button" class="background-check-progress-card__link">
                View all verification details
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>

            <article class="background-check-progress-card">
              <div class="background-check-progress-card__head">
                <h2>Assigned Reviewers ({{ assignedReviewersCount }})</h2>
              </div>

              <div class="background-check-progress-reviewers">
                <article v-for="item in assignedReviewers" :key="item.name">
                  <span class="background-check-progress-reviewers__avatar">{{ getInitials(item.name) }}</span>
                  <div>
                    <strong>{{ item.name }}</strong>
                    <small>{{ item.role }}</small>
                  </div>
                  <em>{{ item.checks }} checks</em>
                </article>
              </div>

              <button type="button" class="background-check-progress-card__link">
                View all reviewers
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>

            <article class="background-check-progress-card">
              <div class="background-check-progress-card__head">
                <h2>Required Documents ({{ totalDocuments }})</h2>
              </div>

              <div class="background-check-progress-documents">
                <article v-for="item in requiredDocuments" :key="item.label">
                  <div class="background-check-progress-documents__label">
                    <span>
                      <AppIcon name="document" :size="13" />
                    </span>
                    <strong>{{ item.label }}</strong>
                  </div>
                  <em :class="`is-${item.tone}`">{{ item.status }}</em>
                </article>
              </div>

              <button type="button" class="background-check-progress-card__link">
                View all documents
                <AppIcon name="chevronRight" :size="13" />
              </button>
            </article>
          </div>

          <article class="background-check-progress-card background-check-progress-invitation">
            <div class="background-check-progress-card__head">
              <div>
                <h2>Candidate Invitation</h2>
                <p>Invitation has been delivered to the candidate.</p>
              </div>
            </div>

            <div class="background-check-progress-invitation__body">
              <div class="background-check-progress-invitation__stats">
                <article v-for="item in invitationStats" :key="item.label">
                  <small>{{ item.label }}</small>
                  <strong>{{ item.value }}</strong>
                  <em>{{ item.meta }}</em>
                  <span v-if="item.note">{{ item.note }}</span>
                </article>
              </div>

              <div class="background-check-progress-invitation__actions">
                <button type="button" @click="handleInvitationAction('open')">
                  <AppIcon name="eye" :size="13" />
                  Open Invitation
                </button>
                <button type="button" @click="handleInvitationAction('remind')">
                  <AppIcon name="mail" :size="13" />
                  Resend Reminder
                </button>
                <button type="button" @click="handleInvitationAction('more')">
                  <AppIcon name="more" :size="13" />
                  More Actions
                </button>
              </div>
            </div>
          </article>
        </main>

        <aside class="background-check-progress-side">
          <article class="background-check-progress-card background-check-progress-side__status">
            <h3>Overall Progress</h3>

            <div class="background-check-progress-side__ring" :style="overallProgressRingStyle">
              <div>
                <strong>{{ completionPercent }}%</strong>
                <small>Overall Progress</small>
              </div>
            </div>

            <div class="background-check-progress-side__legend">
              <article v-for="item in overallProgressBreakdown" :key="item.label">
                <span :style="{ background: item.color }" />
                <strong>{{ item.label }}</strong>
                <em>{{ item.count }}</em>
              </article>
            </div>
          </article>

          <article class="background-check-progress-card background-check-progress-side__activity">
            <div class="background-check-progress-card__head">
              <h2>Recent Activity</h2>
              <button type="button" class="background-check-progress-card__text-button">View all</button>
            </div>

            <div class="background-check-progress-activity">
              <article v-for="item in activityFeed" :key="`${item.time}-${item.title}`">
                <span :class="`is-${item.tone}`">
                  <AppIcon :name="item.icon" :size="12" />
                </span>
                <div>
                  <small>{{ item.time }}</small>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.detail }}</p>
                </div>
              </article>
            </div>
          </article>
        </aside>
      </div>

      <footer class="background-check-progress-shell__foot">
        <button type="button" class="background-check-progress-shell__back" @click="goBackToPipeline">
          <AppIcon name="chevronLeft" :size="14" />
          Back
        </button>

        <button type="button" class="background-check-progress-shell__primary" @click="openResultsStep">
          View Detailed Progress
          <AppIcon name="chevronRight" :size="14" />
        </button>
      </footer>
    </section>

    <ReviewBackgroundOverlay
      :open="reviewResultsOpen"
      :candidate-name="candidateName"
      :candidate-role="candidateRole"
      review-mode="manual"
      @close="closeResultsStep"
    />

    <div v-if="resendConsentModalOpen" class="background-check-progress-modal-backdrop" @click.self="closeResendConsentModal">
      <section class="background-check-progress-modal">
        <header class="background-check-progress-modal__head">
          <span class="background-check-progress-modal__icon">
            <AppIcon name="mail" :size="15" />
          </span>
          <button type="button" aria-label="Close reminder modal" @click="closeResendConsentModal">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div class="background-check-progress-modal__body">
          <h2>Resend Reminder</h2>
          <p>The candidate has not completed all requested document uploads yet.</p>

          <dl class="background-check-progress-modal__facts">
            <div>
              <dt>Current Status</dt>
              <dd>2 / 5 documents submitted</dd>
            </div>
            <div>
              <dt>Last activity</dt>
              <dd>May 12, 2025 - 10:42 AM</dd>
            </div>
            <div>
              <dt>Recipient</dt>
              <dd>{{ candidateEmail }}</dd>
            </div>
          </dl>

          <section class="background-check-progress-modal__what-next">
            <h3>What will happen?</h3>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>A new reminder email will be sent to the candidate.</span>
            </article>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>The existing upload link will remain valid.</span>
            </article>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>Reviewers will keep their current assignments.</span>
            </article>
          </section>

          <label class="background-check-progress-modal__field">
            <span>Reminder message (optional)</span>
            <textarea
              v-model="resendReminderMessage"
              rows="5"
              maxlength="200"
            />
            <small>{{ resendReminderCount }}/200</small>
          </label>
        </div>

        <footer class="background-check-progress-modal__foot">
          <button type="button" class="background-check-progress-modal__ghost" @click="closeResendConsentModal">
            Cancel
          </button>
          <button type="button" class="background-check-progress-modal__primary" @click="sendReminder">
            Send Reminder
            <AppIcon name="chevronRight" :size="13" />
          </button>
        </footer>
      </section>
    </div>

    <div v-if="copyConsentLinkModalOpen" class="background-check-progress-modal-backdrop" @click.self="closeCopyConsentLinkModal">
      <section class="background-check-progress-modal background-check-progress-modal--copy">
        <header class="background-check-progress-modal__head">
          <span class="background-check-progress-modal__icon">
            <AppIcon name="link" :size="15" />
          </span>
          <button type="button" aria-label="Close invitation link modal" @click="closeCopyConsentLinkModal">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div class="background-check-progress-modal__body">
          <h2>Open Invitation</h2>
          <p>Share or copy the invitation link to help the candidate complete uploads.</p>

          <div class="background-check-progress-modal__notice-card">
            <strong>This link is unique to {{ candidateName }}</strong>
            <span>Anyone with this link can upload the requested verification documents.</span>
          </div>

          <label class="background-check-progress-modal__field">
            <span>Invitation link</span>
            <div class="background-check-progress-modal__copy-row">
              <input :value="invitationLink" readonly type="text">
              <button type="button" class="background-check-progress-modal__copy-button" @click="copyInvitationLink">
                <AppIcon :name="invitationLinkCopied ? 'checkCircle' : 'copy'" :size="13" />
                {{ invitationLinkCopied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </label>

          <section class="background-check-progress-modal__what-next">
            <h3>How to use this link</h3>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>Send it to the candidate via email or chat.</span>
            </article>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>The link stays active until the request is completed or canceled.</span>
            </article>
          </section>
        </div>

        <footer class="background-check-progress-modal__foot">
          <button type="button" class="background-check-progress-modal__ghost" @click="closeCopyConsentLinkModal">
            Close
          </button>
        </footer>
      </section>
    </div>

    <div v-if="cancelRequestModalOpen" class="background-check-progress-modal-backdrop" @click.self="closeCancelRequestModal">
      <section class="background-check-progress-modal background-check-progress-modal--cancel">
        <header class="background-check-progress-modal__head">
          <span class="background-check-progress-modal__icon is-danger">
            <AppIcon name="trash" :size="15" />
          </span>
          <button type="button" aria-label="Close cancel request modal" @click="closeCancelRequestModal">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div class="background-check-progress-modal__body">
          <h2>Cancel Manual Verification?</h2>
          <p>Are you sure you want to cancel this manual verification request?</p>

          <div class="background-check-progress-modal__notice-card is-danger">
            <strong>This action cannot be undone.</strong>
            <span>All open reviewer tasks and upload links will be stopped immediately.</span>
          </div>

          <label class="background-check-progress-modal__field">
            <span>Cancellation reason (optional)</span>
            <select v-model="cancelRequestReason" class="background-check-progress-modal__select">
              <option>Select a reason</option>
              <option>Candidate withdrew</option>
              <option>Role closed</option>
              <option>Started in error</option>
              <option>Duplicate request</option>
            </select>
          </label>

          <label class="background-check-progress-modal__field">
            <span>Add a note (optional)</span>
            <textarea
              v-model="cancelRequestNote"
              rows="4"
              maxlength="150"
            />
            <small>{{ cancelRequestNoteCount }}/150</small>
          </label>

          <section class="background-check-progress-modal__what-next">
            <h3>What happens next?</h3>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>The request will be marked as canceled.</span>
            </article>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>The candidate will no longer be able to upload documents.</span>
            </article>
            <article>
              <AppIcon name="checkCircle" :size="12" />
              <span>Assigned reviewers will be notified that the request is closed.</span>
            </article>
          </section>
        </div>

        <footer class="background-check-progress-modal__foot">
          <button type="button" class="background-check-progress-modal__ghost" @click="closeCancelRequestModal">
            Keep Request
          </button>
          <button type="button" class="background-check-progress-modal__primary is-danger" @click="confirmCancelRequest">
            Cancel Request
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.background-check-progress-page {
  min-height: 100%;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 92, 168, 0.08), transparent 20%),
    radial-gradient(circle at top right, rgba(98, 122, 255, 0.06), transparent 18%),
    linear-gradient(180deg, #f7f9ff 0%, #f4f7fe 100%);
}

.background-check-progress-shell {
  min-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto 1fr auto;
  border: 1px solid #e3eafb;
  border-radius: 30px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(18, 29, 53, 0.12);
  overflow: hidden;
}

.background-check-progress-shell__head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.background-check-progress-shell__title {
  display: flex !important;
  align-items: center !important;
  gap: 14px;
}

.background-check-progress-shell__steps {
  display: grid !important;
  grid-template-columns: repeat(5, minmax(110px, 1fr)) !important;
  align-items: center !important;
}

.background-check-progress-shell__step {
  display: flex !important;
  align-items: center !important;
}

.background-check-progress-shell__body {
  display: grid !important;
  grid-template-columns: 310px minmax(0, 1fr) 300px !important;
}

.background-check-progress-sidebar,
.background-check-progress-main,
.background-check-progress-side,
.background-check-progress-main__grid,
.background-check-progress-hero__metrics,
.background-check-progress-checks,
.background-check-progress-reviewers,
.background-check-progress-documents,
.background-check-progress-invitation__stats,
.background-check-progress-invitation__actions,
.background-check-progress-side__legend,
.background-check-progress-activity {
  display: grid !important;
}

.background-check-progress-shell__head,
.background-check-progress-shell__foot,
.background-check-progress-shell__title,
.background-check-progress-shell__step,
.background-check-progress-shell__close,
.background-check-progress-shell__back,
.background-check-progress-shell__primary,
.background-check-progress-sidebar__button,
.background-check-progress-sidebar__help button,
.background-check-progress-card__link,
.background-check-progress-card__text-button,
.background-check-progress-invitation__actions button,
.background-check-progress-modal__head,
.background-check-progress-modal__copy-row,
.background-check-progress-modal__foot,
.background-check-progress-modal__ghost,
.background-check-progress-modal__primary,
.background-check-progress-modal__copy-button {
  display: flex;
  align-items: center;
}

.background-check-progress-shell__head,
.background-check-progress-shell__foot {
  justify-content: space-between;
  gap: 18px;
  padding: 18px 24px;
}

.background-check-progress-shell__head {
  border-bottom: 1px solid #ebeff9;
}

.background-check-progress-shell__foot {
  border-top: 1px solid #ebeff9;
}

.background-check-progress-shell__title {
  gap: 14px;
}

.background-check-progress-shell__title > span {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff2f8 0%, #fff 100%);
  color: #ff4fa2;
}

.background-check-progress-shell__title h1 {
  margin: 0;
  color: #243454;
  font-size: 2.1rem;
  line-height: 1.08;
}

.background-check-progress-shell__title p {
  margin: 4px 0 0;
  color: #8b9ab7;
  font-size: 0.88rem;
}

.background-check-progress-shell__steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(110px, 1fr));
  gap: 14px;
  flex: 1;
  max-width: 880px;
}

.background-check-progress-shell__step {
  position: relative;
  border: 0;
  padding: 0;
  background: transparent;
  justify-content: center;
  gap: 10px;
  min-width: 0;
  color: #95a3bf;
  cursor: pointer;
  font: inherit;
}

.background-check-progress-shell__step:disabled {
  cursor: default;
}

.background-check-progress-shell__step::after {
  content: '';
  position: absolute;
  top: 18px;
  left: calc(100% - 4px);
  width: 18px;
  height: 1px;
  background: #dbe3f4;
}

.background-check-progress-shell__step:last-child::after {
  display: none;
}

.background-check-progress-shell__step span {
  width: 36px;
  height: 36px;
  border: 1px solid #dbe3f4;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  font-size: 0.76rem;
  font-weight: 800;
}

.background-check-progress-shell__step strong {
  font-size: 0.74rem;
  font-weight: 700;
  white-space: nowrap;
}

.background-check-progress-shell__step.is-complete span {
  border-color: #cfead8;
  background: #fff;
  color: #6c59ff;
}

.background-check-progress-shell__step.is-complete strong {
  color: #243454;
}

.background-check-progress-shell__step.is-active span {
  border-color: #ff9cca;
  color: #ff4fa2;
  box-shadow: inset 0 0 0 2px rgba(255, 79, 162, 0.12);
}

.background-check-progress-shell__step.is-active strong {
  color: #ff4fa2;
}

.background-check-progress-shell__close,
.background-check-progress-shell__back,
.background-check-progress-shell__primary,
.background-check-progress-sidebar__button,
.background-check-progress-sidebar__help button,
.background-check-progress-invitation__actions button,
.background-check-progress-modal__ghost,
.background-check-progress-modal__primary,
.background-check-progress-modal__copy-button {
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-progress-shell__close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #8fa0be;
}

.background-check-progress-shell__body {
  min-height: 0;
  display: grid;
  grid-template-columns: 310px minmax(0, 1fr) 300px;
  gap: 20px;
  padding: 20px 24px;
}

.background-check-progress-shell__body > * {
  min-width: 0;
}

.background-check-progress-sidebar,
.background-check-progress-main,
.background-check-progress-side,
.background-check-progress-main__grid,
.background-check-progress-hero__metrics,
.background-check-progress-checks,
.background-check-progress-reviewers,
.background-check-progress-documents,
.background-check-progress-invitation__stats,
.background-check-progress-invitation__actions,
.background-check-progress-side__legend,
.background-check-progress-activity,
.background-check-progress-modal,
.background-check-progress-modal__body,
.background-check-progress-modal__facts,
.background-check-progress-modal__what-next,
.background-check-progress-modal__field {
  display: grid;
  gap: 16px;
}

.background-check-progress-main,
.background-check-progress-side,
.background-check-progress-sidebar {
  align-content: start;
}

.background-check-progress-main__grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.background-check-progress-main__grid > * {
  min-width: 0;
}

.background-check-progress-card {
  padding: 18px;
  border: 1px solid #e5ebf8;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 18px 44px rgba(21, 33, 58, 0.04);
}

.background-check-progress-person {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  align-items: center;
}

.background-check-progress-person__avatar {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd9ec 0%, #f1f4ff 100%);
  color: #ef4fa0;
  font-size: 1rem;
  font-weight: 800;
}

.background-check-progress-person strong,
.background-check-progress-sidebar__overview h3,
.background-check-progress-sidebar__help strong,
.background-check-progress-hero__copy strong,
.background-check-progress-card__head h2,
.background-check-progress-side__status h3,
.background-check-progress-side__legend strong,
.background-check-progress-activity strong,
.background-check-progress-modal__body h2 {
  color: #243454;
}

.background-check-progress-person strong {
  display: block;
  font-size: 0.98rem;
}

.background-check-progress-person p,
.background-check-progress-sidebar__help p,
.background-check-progress-hero__copy p,
.background-check-progress-card__head p,
.background-check-progress-activity p,
.background-check-progress-modal__body > p {
  margin: 4px 0 0;
  color: #6f82a3;
  font-size: 0.74rem;
  line-height: 1.55;
}

.background-check-progress-person__chip {
  display: inline-flex;
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f1edff;
  color: #6a5cff;
  font-size: 0.68rem;
  font-weight: 800;
}

.background-check-progress-sidebar__button,
.background-check-progress-sidebar__help button,
.background-check-progress-shell__back {
  min-height: 46px;
  padding: 0 16px;
  border: 1px solid #dce4f6;
  border-radius: 14px;
  background: #fff;
  color: #344462;
}

.background-check-progress-sidebar__overview h3,
.background-check-progress-side__status h3 {
  margin: 0;
  font-size: 0.94rem;
}

.background-check-progress-sidebar__overview dl {
  display: grid;
  gap: 14px;
  margin: 0;
}

.background-check-progress-sidebar__overview dt,
.background-check-progress-card__head p,
.background-check-progress-invitation__stats small,
.background-check-progress-side__legend article em,
.background-check-progress-activity small,
.background-check-progress-modal__facts dt,
.background-check-progress-modal__field span,
.background-check-progress-modal__what-next h3 {
  color: #95a3bf;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.background-check-progress-sidebar__overview dd {
  margin: 6px 0 0;
  color: #243454;
  font-size: 0.77rem;
  font-weight: 700;
}

.background-check-progress-sidebar__overview dd.is-type {
  display: inline-flex;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff2da;
  color: #ee9d1a;
}

.background-check-progress-sidebar__overview dd.is-priority::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 999px;
  background: #f4b223;
}

.background-check-progress-sidebar__help {
  gap: 14px;
  background: linear-gradient(180deg, #fcf7ff 0%, #fff 100%);
}

.background-check-progress-sidebar__help > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4fa2;
}

.background-check-progress-sidebar__help button {
  width: fit-content;
  color: #6a35ff;
}

.background-check-progress-hero {
  gap: 18px;
  border-color: #dceee2;
  background: linear-gradient(180deg, #f8fff9 0%, #fff 100%);
}

.background-check-progress-hero__copy {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
}

.background-check-progress-hero__copy > span {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e8f8ee;
  color: #22ab5e;
}

.background-check-progress-hero__copy strong {
  display: block;
  font-size: 0.94rem;
}

.background-check-progress-hero__metrics {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding-top: 14px;
  border-top: 1px solid #e4f2e7;
}

.background-check-progress-hero__metrics article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.background-check-progress-hero__metrics article > span {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eefaf2;
  color: #21aa5d;
}

.background-check-progress-hero__metrics strong,
.background-check-progress-checks__title strong,
.background-check-progress-reviewers strong,
.background-check-progress-documents strong,
.background-check-progress-invitation__stats strong,
.background-check-progress-side__ring strong {
  display: block;
  color: #243454;
}

.background-check-progress-hero__metrics strong {
  font-size: 0.78rem;
}

.background-check-progress-hero__metrics small,
.background-check-progress-checks__title small,
.background-check-progress-reviewers small,
.background-check-progress-invitation__stats em,
.background-check-progress-invitation__stats span,
.background-check-progress-side__ring small {
  display: block;
  margin-top: 3px;
  color: #94a3bf;
  font-size: 0.67rem;
}

.background-check-progress-card__head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.background-check-progress-card__head h2 {
  margin: 0;
  font-size: 0.94rem;
}

.background-check-progress-card__head p {
  font-size: 0.72rem;
}

.background-check-progress-checks__item,
.background-check-progress-reviewers article,
.background-check-progress-documents article,
.background-check-progress-side__legend article,
.background-check-progress-activity article {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.background-check-progress-checks__item {
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2fb;
}

.background-check-progress-checks__item:last-child,
.background-check-progress-reviewers article:last-child,
.background-check-progress-documents article:last-child,
.background-check-progress-activity article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.background-check-progress-checks__title {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.background-check-progress-checks__title > span,
.background-check-progress-documents__label > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f1ff;
  color: #6a5cff;
}

.background-check-progress-checks__title strong,
.background-check-progress-documents strong {
  font-size: 0.77rem;
}

.background-check-progress-checks__track {
  display: grid;
  gap: 8px;
}

.background-check-progress-checks__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.background-check-progress-checks__meta em,
.background-check-progress-documents em,
.background-check-progress-reviewers em {
  font-style: normal;
  font-weight: 800;
}

.background-check-progress-checks__meta em {
  font-size: 0.67rem;
}

.background-check-progress-checks__meta em.is-waiting {
  color: #f39c12;
}

.background-check-progress-checks__meta em.is-progress {
  color: #4c6fff;
}

.background-check-progress-checks__meta em.is-completed {
  color: #1fa859;
}

.background-check-progress-checks__meta strong {
  font-size: 0.74rem;
}

.background-check-progress-checks__bar {
  height: 4px;
  border-radius: 999px;
  overflow: hidden;
  background: #edf1fb;
}

.background-check-progress-checks__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.background-check-progress-checks__bar.is-completed span {
  background: #22c55e;
}

.background-check-progress-checks__bar.is-progress span {
  background: linear-gradient(90deg, #3b82f6 0%, #22c55e 100%);
}

.background-check-progress-checks__bar.is-waiting span {
  background: #ff4fa2;
}

.background-check-progress-card__link,
.background-check-progress-card__text-button {
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6a35ff;
  font: inherit;
  font-size: 0.73rem;
  font-weight: 800;
  cursor: pointer;
}

.background-check-progress-reviewers article {
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2fb;
  column-gap: 10px;
}

.background-check-progress-reviewers__avatar {
  width: 30px;
  height: 30px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffd8ec 0%, #f4f6ff 100%);
  color: #ef4fa0;
  font-size: 0.69rem;
  font-weight: 800;
}

.background-check-progress-reviewers strong {
  font-size: 0.77rem;
  overflow-wrap: anywhere;
}

.background-check-progress-reviewers em {
  padding: 4px 8px;
  border-radius: 999px;
  background: #f3f6ff;
  color: #6278a2;
  font-size: 0.63rem;
}

.background-check-progress-documents article {
  grid-template-columns: 1fr auto;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2fb;
  column-gap: 12px;
}

.background-check-progress-documents__label {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.background-check-progress-documents em {
  position: relative;
  padding-left: 14px;
  font-size: 0.67rem;
  white-space: nowrap;
}

.background-check-progress-documents em::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transform: translateY(-50%);
}

.background-check-progress-documents em.is-uploaded {
  color: #20a95a;
}

.background-check-progress-documents em.is-uploaded::before {
  background: #22c55e;
}

.background-check-progress-documents em.is-pending {
  color: #d98808;
}

.background-check-progress-documents em.is-pending::before {
  background: #f4b223;
}

.background-check-progress-invitation__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 16px;
}

.background-check-progress-invitation__stats {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.background-check-progress-invitation__stats article {
  padding: 14px;
  border: 1px solid #eef2fb;
  border-radius: 16px;
  background: #fcfdff;
}

.background-check-progress-invitation__stats strong {
  margin-top: 8px;
  font-size: 0.88rem;
}

.background-check-progress-invitation__stats em,
.background-check-progress-invitation__stats span {
  font-style: normal;
  line-height: 1.5;
}

.background-check-progress-invitation__actions {
  align-content: start;
}

.background-check-progress-invitation__actions button,
.background-check-progress-shell__primary {
  min-height: 46px;
  padding: 0 16px;
  border-radius: 14px;
}

.background-check-progress-invitation__actions button {
  justify-content: flex-start;
  border: 1px solid #dce4f6;
  background: #fff;
  color: #344462;
}

.background-check-progress-shell__primary {
  border: 0;
  background: linear-gradient(90deg, #ff0b7c 0%, #ff4fa2 100%);
  color: #fff;
}

.background-check-progress-side__status {
  gap: 18px;
}

.background-check-progress-side__ring {
  width: 168px;
  height: 168px;
  margin: 0 auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.background-check-progress-side__ring > div {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  text-align: center;
  box-shadow: inset 0 0 0 1px #eff3fb;
}

.background-check-progress-side__ring strong {
  font-size: 1.7rem;
}

.background-check-progress-side__legend article {
  grid-template-columns: auto 1fr auto;
  align-items: center;
}

.background-check-progress-side__legend article span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.background-check-progress-side__legend strong {
  font-size: 0.74rem;
}

.background-check-progress-side__legend em {
  font-style: normal;
}

.background-check-progress-activity article {
  grid-template-columns: auto 1fr;
  align-items: start;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2fb;
}

.background-check-progress-activity article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.background-check-progress-activity article > span.is-green {
  background: #eaf9ef;
  color: #21aa5d;
}

.background-check-progress-activity article > span.is-blue {
  background: #edf2ff;
  color: #4c6fff;
}

.background-check-progress-activity article > span.is-purple {
  background: #fff0f7;
  color: #ef4fa0;
}

.background-check-progress-activity strong {
  display: block;
  margin-top: 4px;
  font-size: 0.76rem;
}

.background-check-progress-shell__primary:hover,
.background-check-progress-invitation__actions button:hover,
.background-check-progress-sidebar__button:hover,
.background-check-progress-sidebar__help button:hover,
.background-check-progress-shell__back:hover {
  box-shadow: 0 12px 28px rgba(36, 52, 84, 0.1);
}

.background-check-progress-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(18, 26, 46, 0.28);
  backdrop-filter: blur(8px);
}

.background-check-progress-modal {
  width: min(420px, calc(100vw - 32px));
  padding: 18px;
  border: 1px solid #e4eafb;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(20, 31, 54, 0.18);
}

.background-check-progress-modal__head {
  justify-content: space-between;
}

.background-check-progress-modal__icon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ef4fa0;
}

.background-check-progress-modal__icon.is-danger {
  background: #fff4f7;
  color: #ff2f8b;
}

.background-check-progress-modal__head button {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #97a5bf;
  cursor: pointer;
}

.background-check-progress-modal__body h2 {
  margin: 0;
  font-size: 1.02rem;
  text-align: center;
}

.background-check-progress-modal__body > p {
  text-align: center;
}

.background-check-progress-modal__notice-card {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid #ffe8bf;
  border-radius: 14px;
  background: linear-gradient(180deg, #fff9ef 0%, #fffdf8 100%);
}

.background-check-progress-modal__notice-card strong {
  color: #f29c00;
  font-size: 0.76rem;
}

.background-check-progress-modal__notice-card span {
  color: #8a7352;
  font-size: 0.72rem;
  line-height: 1.5;
}

.background-check-progress-modal__notice-card.is-danger {
  border-color: #ffd9df;
  background: linear-gradient(180deg, #fff7f8 0%, #fffdfd 100%);
}

.background-check-progress-modal__notice-card.is-danger strong {
  color: #ff7a21;
}

.background-check-progress-modal__notice-card.is-danger span {
  color: #8e6a62;
}

.background-check-progress-modal__facts {
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid #eef2fb;
}

.background-check-progress-modal__facts div {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
}

.background-check-progress-modal__facts dd {
  margin: 0;
  color: #243454;
  font-size: 0.75rem;
  font-weight: 700;
}

.background-check-progress-modal__what-next {
  padding-top: 12px;
  border-top: 1px solid #eef2fb;
}

.background-check-progress-modal__what-next h3 {
  margin: 0;
}

.background-check-progress-modal__what-next article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: start;
  color: #5d7190;
  font-size: 0.74rem;
}

.background-check-progress-modal__what-next article :deep(svg) {
  color: #22ab5e;
}

.background-check-progress-modal__field {
  gap: 8px;
}

.background-check-progress-modal__copy-row {
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.background-check-progress-modal__field input,
.background-check-progress-modal__field select,
.background-check-progress-modal__field textarea {
  width: 100%;
  padding: 12px 13px;
  border: 1px solid #dbe4fb;
  border-radius: 14px;
  outline: none;
  background: #fff;
  color: #263655;
  font: inherit;
  font-size: 0.75rem;
  line-height: 1.55;
}

.background-check-progress-modal__field textarea {
  min-height: 110px;
  resize: none;
}

.background-check-progress-modal__field small {
  justify-self: end;
  color: #98a6c1;
  font-size: 0.69rem;
}

.background-check-progress-modal__foot {
  justify-content: flex-end;
  gap: 10px;
}

.background-check-progress-modal__ghost,
.background-check-progress-modal__primary {
  min-height: 40px;
  padding: 10px 14px;
  border-radius: 12px;
}

.background-check-progress-modal__ghost {
  border: 1px solid #dbe4fb;
  background: #fff;
  color: #33425f;
}

.background-check-progress-modal__primary {
  border: 0;
  background: linear-gradient(90deg, #ff0b7c 0%, #ff4fa2 100%);
  color: #fff;
}

.background-check-progress-modal__primary.is-danger {
  background: linear-gradient(90deg, #ff2b79 0%, #ff4fa2 100%);
}

.background-check-progress-modal__copy-button {
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid #ffd8e9;
  border-radius: 12px;
  background: #fff7fb;
  color: #ef4fa0;
}

@media (max-width: 1500px) {
  .background-check-progress-shell__body {
    grid-template-columns: 280px minmax(0, 1fr) 280px;
  }

  .background-check-progress-main__grid,
  .background-check-progress-invitation__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-progress-main__grid > :last-child {
    grid-column: 1 / -1;
  }

  .background-check-progress-hero__metrics {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1380px) {
  .background-check-progress-shell__body {
    grid-template-columns: 290px minmax(0, 1fr) !important;
    align-items: start;
  }

  .background-check-progress-sidebar {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .background-check-progress-main {
    grid-column: 2;
    grid-row: 1;
  }

  .background-check-progress-side {
    grid-column: 2;
    grid-row: 2;
    grid-template-columns: minmax(260px, 0.95fr) minmax(320px, 1.05fr);
  }

  .background-check-progress-main__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-progress-main__grid > :last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1420px) {
  .background-check-progress-hero__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .background-check-progress-invitation__body {
    grid-template-columns: 1fr;
  }

  .background-check-progress-invitation__actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .background-check-progress-invitation__actions button {
    justify-content: center;
  }
}

@media (max-width: 1260px) {
  .background-check-progress-shell__steps {
    grid-template-columns: repeat(5, minmax(90px, 1fr));
  }

  .background-check-progress-shell__body {
    grid-template-columns: 1fr;
  }

  .background-check-progress-main__grid {
    grid-template-columns: 1fr;
  }

  .background-check-progress-side {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .background-check-progress-main__grid > :last-child {
    grid-column: auto;
  }
}

@media (max-width: 960px) {
  .background-check-progress-page {
    padding: 12px;
  }

  .background-check-progress-shell {
    min-height: calc(100vh - 24px);
    border-radius: 24px;
  }

  .background-check-progress-shell__head,
  .background-check-progress-shell__foot {
    padding: 16px;
  }

  .background-check-progress-shell__head,
  .background-check-progress-shell__foot,
  .background-check-progress-invitation__body,
  .background-check-progress-side {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .background-check-progress-shell__steps,
  .background-check-progress-hero__metrics,
  .background-check-progress-invitation__stats,
  .background-check-progress-invitation__actions {
    grid-template-columns: 1fr;
  }

  .background-check-progress-shell__step::after {
    display: none;
  }

  .background-check-progress-shell__step {
    justify-content: flex-start;
  }

  .background-check-progress-shell__body {
    padding: 16px;
  }

  .background-check-progress-modal-backdrop {
    padding: 12px;
  }

  .background-check-progress-modal {
    width: 100%;
  }

  .background-check-progress-modal__facts div,
  .background-check-progress-modal__copy-row,
  .background-check-progress-modal__foot {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
