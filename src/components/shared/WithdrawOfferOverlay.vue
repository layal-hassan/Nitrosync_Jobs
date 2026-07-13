<script setup>
import { computed, ref, watch } from 'vue'
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
  offerAmount: {
    type: String,
    default: '$165,000 / year',
  },
  sentOn: {
    type: String,
    default: 'May 30, 2026',
  },
  sentAt: {
    type: String,
    default: '10:42 AM',
  },
})

const emit = defineEmits(['close', 'confirm'])

const selectedReason = ref('Compensation changed')
const message = ref('')
const notifyCandidate = ref(true)
const notifyHiringTeam = ref(true)
const notifyFinance = ref(true)
const notifyRecruiter = ref(true)
const notifyHr = ref(false)
const acknowledged = ref(false)
const submitted = ref(false)

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => (
  (props.candidateName || 'Marvin McKinney').split(' ')[0] || 'Marvin'
))

const reasonOptions = [
  'Compensation changed',
  'Hiring freeze',
  'Candidate requested',
  'Role cancelled',
  'Wrong offer',
  'Other',
]

const timelineRows = [
  ['Sent', 'May 30, 10:42 AM', 'mail', 'done'],
  ['Delivered', 'May 30, 10:45 AM', 'clock', 'done'],
  ['Viewed', 'Not yet', 'eye', 'idle'],
  ['Signed', 'Not yet', 'edit', 'idle'],
  ['Accepted', 'Not yet', 'user-check', 'idle'],
]

const impactRows = [
  ['Withdraw the offer', 'mail'],
  ['Cancel the DocuSign envelope', 'document'],
  ['Stop all reminder emails', 'bell'],
  ['Record this action in the audit log', 'document'],
  ['Notify selected recipients', 'users'],
]

const withdrawnTimelineRows = computed(() => ([
  ['Draft', 'May 30, 08:15 AM', 'checkCircle', 'green'],
  ['Approved', 'May 30, 09:15 AM', 'checkCircle', 'green'],
  ['Sent', `${props.sentOn} ${props.sentAt}`, 'mail', 'green'],
  ['Viewed', 'May 30, 10:45 AM', 'eye', 'green'],
  ['Withdrawn', 'Just now', 'alert', 'pink'],
]))

const nextActionRows = [
  ['Create New Offer', 'Start a new offer flow with the updated package.', 'plus', 'pink'],
  ['View Audit Trail', 'Review the full activity and approval history.', 'clock', 'violet'],
  ['Download Documents', 'Keep a local copy of the withdrawn package.', 'document', 'blue'],
  ['View Full Profile', 'Open the candidate profile and related notes.', 'external-link', 'green'],
]

const documentRows = [
  ['Offer Letter', 'PDF'],
  ['Employment Agreement', 'PDF'],
  ['NDA', 'PDF'],
  ['Benefits Guide', 'PDF'],
]

watch(() => props.open, (open) => {
  if (!open) {
    return
  }

  selectedReason.value = 'Compensation changed'
  message.value = ''
  notifyCandidate.value = true
  notifyHiringTeam.value = true
  notifyFinance.value = true
  notifyRecruiter.value = true
  notifyHr.value = false
  acknowledged.value = false
  submitted.value = false
})

function closeOverlay() {
  emit('close')
}

function confirmWithdrawOffer() {
  submitted.value = true
  emit('confirm', {
    reason: selectedReason.value,
    message: message.value,
    notify: {
      candidate: notifyCandidate.value,
      hiringTeam: notifyHiringTeam.value,
      finance: notifyFinance.value,
      recruiter: notifyRecruiter.value,
      hr: notifyHr.value,
    },
  })
}

function resetToEditor() {
  submitted.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="withdraw-offer-overlay" @click.self="closeOverlay">
      <section v-if="!submitted" class="withdraw-offer-modal">
        <header class="withdraw-offer-modal__header">
          <div class="withdraw-offer-modal__title">
            <span class="withdraw-offer-modal__icon">
              <AppIcon name="alert" :size="16" />
            </span>
            <div>
              <h2>Withdraw Offer</h2>
              <p>You are about to withdraw this offer. <strong>This action cannot be undone.</strong></p>
            </div>
          </div>

          <button class="withdraw-offer-modal__close" type="button" aria-label="Close withdraw offer" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <section class="withdraw-offer-summary">
          <article class="withdraw-offer-summary__candidate">
            <span class="withdraw-offer-summary__avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateRole }}</small>
            </div>
          </article>

          <article>
            <span>Offer status</span>
            <strong>Sent</strong>
            <small>Waiting for signature</small>
          </article>

          <article>
            <span>Sent on</span>
            <strong>{{ sentOn }}</strong>
            <small>{{ sentAt }}</small>
          </article>

          <article>
            <span>Offer amount</span>
            <strong>{{ offerAmount }}</strong>
            <small>Total compensation</small>
          </article>
        </section>

        <section class="withdraw-offer-timeline">
          <article
            v-for="(item, index) in timelineRows"
            :key="item[0]"
            class="withdraw-offer-timeline__item"
            :class="`is-${item[3]}`"
          >
            <span class="withdraw-offer-timeline__mark">
              <AppIcon :name="item[2]" :size="14" />
            </span>
            <i v-if="index < timelineRows.length - 1" class="withdraw-offer-timeline__line" />
            <strong>{{ item[0] }}</strong>
            <small>{{ item[1] }}</small>
          </article>
        </section>

        <div class="withdraw-offer-warning">
          <AppIcon name="alert" :size="14" />
          <span>{{ candidateFirstName }} has not signed the offer yet. Withdrawing it will stop the signing process and cancel reminders.</span>
        </div>

        <section class="withdraw-offer-body">
          <div class="withdraw-offer-section">
            <h3>What this will do</h3>
            <div class="withdraw-offer-impact">
              <article v-for="item in impactRows" :key="item[0]">
                <span><AppIcon :name="item[1]" :size="14" /></span>
                <small>{{ item[0] }}</small>
              </article>
            </div>
          </div>

          <div class="withdraw-offer-section">
            <label class="withdraw-offer-field">
              <span>Reason for withdrawal <em>*</em></span>
              <div class="withdraw-offer-reasons">
                <button
                  v-for="item in reasonOptions"
                  :key="item"
                  type="button"
                  :class="{ 'is-active': selectedReason === item }"
                  @click="selectedReason = item"
                >
                  {{ item }}
                </button>
              </div>
            </label>

            <label class="withdraw-offer-field">
              <span>Message to candidate <small>(optional)</small></span>
              <div class="withdraw-offer-message-row">
                <div class="withdraw-offer-template">Use company template: Offer Withdrawal Email</div>
                <button type="button" class="withdraw-offer-preview">Preview email</button>
              </div>
              <textarea
                v-model="message"
                rows="3"
                placeholder="Add an optional note that will be included in the withdrawal email."
              />
            </label>
          </div>

          <div class="withdraw-offer-section">
            <span class="withdraw-offer-section__label">Who should be notified?</span>
            <div class="withdraw-offer-notify">
              <label>
                <input v-model="notifyCandidate" type="checkbox">
                <div>
                  <strong>Notify candidate</strong>
                  <small>Candidate will receive the withdrawal email</small>
                </div>
              </label>
              <label>
                <input v-model="notifyHiringTeam" type="checkbox">
                <div>
                  <strong>Notify hiring team</strong>
                  <small>Hiring team members will be notified</small>
                </div>
              </label>
              <label>
                <input v-model="notifyFinance" type="checkbox">
                <div>
                  <strong>Notify finance</strong>
                  <small>Finance team will be notified</small>
                </div>
              </label>
              <label>
                <input v-model="notifyRecruiter" type="checkbox">
                <div>
                  <strong>Notify recruiter</strong>
                  <small>The assigned recruiter will be notified</small>
                </div>
              </label>
              <label>
                <input v-model="notifyHr" type="checkbox">
                <div>
                  <strong>Notify HR</strong>
                  <small>HR team will be notified</small>
                </div>
              </label>
            </div>
          </div>
        </section>

        <footer class="withdraw-offer-footer">
          <label class="withdraw-offer-acknowledge">
            <input v-model="acknowledged" type="checkbox">
            <span>I understand this action will withdraw the offer and cannot be undone.</span>
          </label>

          <div class="withdraw-offer-footer__actions">
            <button type="button" class="withdraw-offer-cancel" @click="closeOverlay">Cancel</button>
            <button type="button" class="withdraw-offer-confirm" @click="confirmWithdrawOffer">
              Withdraw Offer
            </button>
          </div>

          <small class="withdraw-offer-footer__note">
            <AppIcon name="lock" :size="12" />
            <span>This action will be logged</span>
          </small>
        </footer>
      </section>

      <section v-else class="withdraw-offer-modal withdraw-offer-modal--success">
        <header class="withdraw-offer-success__topbar">
          <button type="button" class="withdraw-offer-success__back" @click="closeOverlay">
            <AppIcon name="chevronLeft" :size="14" />
            <span>Back to candidates</span>
          </button>

          <div class="withdraw-offer-success__actions">
            <button type="button" class="withdraw-offer-success__ghost">Preview offer</button>
            <button type="button" class="withdraw-offer-success__ghost">More actions</button>
          </div>
        </header>

        <div class="withdraw-offer-success__banner">
          <div>
            <strong>Offer withdrawn successfully</strong>
            <span>Signature request canceled. Candidate notified.</span>
          </div>
          <button type="button" aria-label="Close withdrawal success" @click="closeOverlay">
            <AppIcon name="close" :size="14" />
          </button>
        </div>

        <section class="withdraw-offer-success__hero">
          <div>
            <div class="withdraw-offer-success__eyebrow">
              <strong>Offer</strong>
              <span class="withdraw-offer-success__tag">Withdrawn</span>
            </div>
            <h2>{{ candidateRole }}</h2>
            <p>Offer ID: OFF-2026-1267 &bull; Created by Magda R. on {{ sentOn }}</p>
          </div>

          <article class="withdraw-offer-success__candidate">
            <span class="withdraw-offer-summary__avatar">{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateRole }}</small>
            </div>
          </article>
        </section>

        <section class="withdraw-offer-success__journey">
          <article
            v-for="(item, index) in withdrawnTimelineRows"
            :key="item[0]"
            class="withdraw-offer-success__journey-item"
            :class="`is-${item[3]}`"
          >
            <span class="withdraw-offer-success__journey-mark">
              <AppIcon :name="item[2]" :size="14" />
            </span>
            <i v-if="index < withdrawnTimelineRows.length - 1" />
            <strong>{{ item[0] }}</strong>
            <small>{{ item[1] }}</small>
          </article>
        </section>

        <div class="withdraw-offer-success__layout">
          <section class="withdraw-offer-success__main">
            <div class="withdraw-offer-success__grid">
              <article class="withdraw-offer-success__card">
                <h3>Offer Status</h3>
                <div class="withdraw-offer-success__status">
                  <span class="withdraw-offer-success__status-icon">
                    <AppIcon name="alert" :size="14" />
                  </span>
                  <div>
                    <strong>Withdrawn</strong>
                    <small>The offer is no longer active.</small>
                  </div>
                </div>

                <div class="withdraw-offer-success__list">
                  <article>
                    <AppIcon name="checkCircle" :size="13" />
                    <span>Candidate email revoked</span>
                  </article>
                  <article>
                    <AppIcon name="checkCircle" :size="13" />
                    <span>Signature request canceled</span>
                  </article>
                  <article>
                    <AppIcon name="checkCircle" :size="13" />
                    <span>Reminders stopped</span>
                  </article>
                  <article>
                    <AppIcon name="checkCircle" :size="13" />
                    <span>Audit log updated</span>
                  </article>
                </div>
              </article>

              <article class="withdraw-offer-success__card">
                <h3>Activity Timeline</h3>
                <div class="withdraw-offer-success__timeline">
                  <article>
                    <span class="is-green" />
                    <div>
                      <strong>Draft created</strong>
                      <small>May 30, 2026 at 8:15 AM by Maggie R.</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-green" />
                    <div>
                      <strong>Offer approved</strong>
                      <small>May 30, 2026 at 9:15 AM by Eric L.</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-green" />
                    <div>
                      <strong>Offer sent to candidate</strong>
                      <small>{{ sentOn }} at {{ sentAt }}</small>
                    </div>
                  </article>
                  <article>
                    <span class="is-pink" />
                    <div>
                      <strong>Offer withdrawn</strong>
                      <small>Reason: {{ selectedReason }}</small>
                    </div>
                  </article>
                </div>
              </article>
            </div>

            <article class="withdraw-offer-success__card">
              <h3>What would you like to do next?</h3>
              <div class="withdraw-offer-success__next-actions">
                <button v-for="item in nextActionRows" :key="item[0]" type="button">
                  <span :class="`is-${item[3]}`">
                    <AppIcon :name="item[2]" :size="14" />
                  </span>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </button>
              </div>
            </article>

            <div class="withdraw-offer-success__ai">
              <div>
                <strong>AI Recommendation</strong>
                <span>The offer was withdrawn due to a compensation change. Based on the approval history, AI can prepare a revised offer draft.</span>
              </div>
              <button type="button" @click="resetToEditor">Generate New Offer</button>
            </div>
          </section>

          <aside class="withdraw-offer-success__side">
            <article class="withdraw-offer-success__card">
              <h3>Withdrawn By</h3>
              <div class="withdraw-offer-success__person">
                <span class="withdraw-offer-summary__avatar">MR</span>
                <div>
                  <strong>Magda R.</strong>
                  <small>Talent Lead</small>
                </div>
              </div>

              <div class="withdraw-offer-success__meta-block">
                <span>Withdrawn on</span>
                <strong>May 30, 2026 at 10:52 AM</strong>
              </div>
              <div class="withdraw-offer-success__meta-block">
                <span>Reason</span>
                <strong>{{ selectedReason }}</strong>
              </div>
              <div class="withdraw-offer-success__meta-block">
                <span>Message to candidate</span>
                <button type="button">View message</button>
              </div>
            </article>

            <article class="withdraw-offer-success__card">
              <h3>Offer Outcome</h3>
              <div class="withdraw-offer-success__outcome">
                <article>
                  <span>Status</span>
                  <strong class="withdraw-offer-success__badge">Withdrawn</strong>
                </article>
                <article>
                  <span>Signature status</span>
                  <strong>Canceled</strong>
                </article>
                <article>
                  <span>Candidate</span>
                  <strong>Not signed</strong>
                </article>
                <article>
                  <span>Provider</span>
                  <strong class="withdraw-offer-success__provider">
                    <em>DS</em>
                    <span>DocuSign</span>
                  </strong>
                </article>
                <article>
                  <span>Provider status</span>
                  <strong class="withdraw-offer-success__provider-status">
                    <AppIcon name="checkCircle" :size="13" />
                    <span>Cancelled successfully</span>
                  </strong>
                </article>
              </div>
              <button type="button" class="withdraw-offer-success__provider-link">
                <span>View provider details</span>
                <AppIcon name="external-link" :size="12" />
              </button>
            </article>

            <article class="withdraw-offer-success__card">
              <div class="withdraw-offer-success__card-head">
                <h3>Documents</h3>
                <button type="button">Preview all</button>
              </div>
              <div class="withdraw-offer-success__documents">
                <article v-for="item in documentRows" :key="item[0]">
                  <div>
                    <span><AppIcon name="document" :size="12" /></span>
                    <strong>{{ item[0] }}</strong>
                  </div>
                  <small>{{ item[1] }}</small>
                  <em />
                </article>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.withdraw-offer-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  padding: 24px;
  overflow-y: auto;
  background: rgba(17, 24, 39, 0.42);
  backdrop-filter: blur(8px);
}

.withdraw-offer-modal {
  width: min(1120px, calc(100vw - 48px));
  margin: 0 auto;
  border: 1px solid rgba(231, 237, 245, 0.96);
  border-radius: 24px;
  background:
    radial-gradient(circle at top, rgba(255, 92, 162, 0.08), transparent 36%),
    linear-gradient(180deg, #fff 0%, #fffdfd 100%);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.withdraw-offer-modal--success {
  width: min(1260px, calc(100vw - 48px));
}

.withdraw-offer-modal__header,
.withdraw-offer-modal__title,
.withdraw-offer-summary__candidate,
.withdraw-offer-message-row,
.withdraw-offer-footer__actions,
.withdraw-offer-footer__note,
.withdraw-offer-success__topbar,
.withdraw-offer-success__actions,
.withdraw-offer-success__banner,
.withdraw-offer-success__hero,
.withdraw-offer-success__candidate,
.withdraw-offer-success__status,
.withdraw-offer-success__person,
.withdraw-offer-success__card-head {
  display: flex;
  align-items: center;
}

.withdraw-offer-modal__header,
.withdraw-offer-body,
.withdraw-offer-footer,
.withdraw-offer-success__topbar,
.withdraw-offer-success__hero,
.withdraw-offer-success__layout {
  padding: 20px 22px;
}

.withdraw-offer-modal__header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.withdraw-offer-modal__title {
  align-items: flex-start;
  gap: 12px;
}

.withdraw-offer-modal__icon,
.withdraw-offer-success__status-icon {
  width: 32px;
  height: 32px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b7d;
  background: #fff1f6;
}

.withdraw-offer-success__status-icon {
  color: #10a86b;
  background: #effcf4;
}

.withdraw-offer-modal__title h2,
.withdraw-offer-section h3,
.withdraw-offer-summary strong,
.withdraw-offer-success__hero h2,
.withdraw-offer-success__card h3 {
  margin: 0;
  color: #1d2b49;
}

.withdraw-offer-modal__title h2,
.withdraw-offer-success__hero h2 {
  font-size: 1.2rem;
  font-weight: 800;
}

.withdraw-offer-success__hero h2 {
  font-size: 1.5rem;
}

.withdraw-offer-modal__title p,
.withdraw-offer-summary span,
.withdraw-offer-summary small,
.withdraw-offer-timeline small,
.withdraw-offer-field span,
.withdraw-offer-field small,
.withdraw-offer-notify small,
.withdraw-offer-footer__note,
.withdraw-offer-section__label,
.withdraw-offer-success__banner span,
.withdraw-offer-success__hero p,
.withdraw-offer-success__candidate small,
.withdraw-offer-success__journey-item small,
.withdraw-offer-success__card small,
.withdraw-offer-success__ai span,
.withdraw-offer-success__meta-block span,
.withdraw-offer-success__outcome span {
  color: #8694ab;
}

.withdraw-offer-modal__title p {
  margin: 4px 0 0;
  font-size: 0.86rem;
}

.withdraw-offer-modal__title p strong {
  color: #ff4b7d;
}

.withdraw-offer-modal__close,
.withdraw-offer-success__banner button {
  width: 38px;
  height: 38px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  color: #223251;
  background: #fff;
}

.withdraw-offer-summary {
  margin: 0 22px;
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1.35fr repeat(3, minmax(0, 1fr));
  gap: 16px;
  background: rgba(255, 255, 255, 0.94);
}

.withdraw-offer-summary__candidate,
.withdraw-offer-success__candidate,
.withdraw-offer-success__person {
  gap: 12px;
}

.withdraw-offer-summary__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #ffe9f4;
  font-size: 0.78rem;
  font-weight: 800;
}

.withdraw-offer-summary strong,
.withdraw-offer-success__candidate strong,
.withdraw-offer-success__person strong {
  display: block;
  margin-top: 4px;
  font-size: 0.88rem;
  font-weight: 800;
}

.withdraw-offer-summary small,
.withdraw-offer-summary span {
  display: block;
  font-size: 0.72rem;
}

.withdraw-offer-timeline {
  margin: 18px 22px 0;
  padding: 0 18px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.withdraw-offer-timeline__item,
.withdraw-offer-success__journey-item {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  text-align: center;
}

.withdraw-offer-timeline__mark,
.withdraw-offer-success__journey-mark {
  width: 38px;
  height: 38px;
  border: 1px solid #dfe6f2;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #9aa6bb;
  background: #fff;
}

.withdraw-offer-timeline__item.is-done .withdraw-offer-timeline__mark,
.withdraw-offer-success__journey-item.is-green .withdraw-offer-success__journey-mark {
  color: #10a86b;
  border-color: #b8ecd0;
  background: #effcf4;
}

.withdraw-offer-success__journey-item.is-pink .withdraw-offer-success__journey-mark {
  color: #ff2d87;
  border-color: #ffc5df;
  background: #fff1f7;
}

.withdraw-offer-timeline__line,
.withdraw-offer-success__journey-item i {
  position: absolute;
  top: 18px;
  right: -26px;
  width: 52px;
  border-top: 1px dashed #dbe3ef;
}

.withdraw-offer-timeline strong,
.withdraw-offer-success__journey-item strong {
  font-size: 0.78rem;
  font-weight: 800;
  color: #223251;
}

.withdraw-offer-timeline small,
.withdraw-offer-success__journey-item small {
  font-size: 0.68rem;
}

.withdraw-offer-warning {
  margin: 18px 22px 0;
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9a6218;
  background: #fff5e7;
}

.withdraw-offer-body {
  display: grid;
  gap: 22px;
}

.withdraw-offer-section {
  display: grid;
  gap: 12px;
}

.withdraw-offer-section h3,
.withdraw-offer-success__card h3 {
  font-size: 0.92rem;
  font-weight: 800;
}

.withdraw-offer-impact {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.withdraw-offer-impact article,
.withdraw-offer-success__next-actions button {
  padding: 14px 10px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  justify-items: center;
  gap: 10px;
  text-align: center;
  background: #fff;
}

.withdraw-offer-impact span,
.withdraw-offer-success__next-actions span {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff4b7d;
  background: #fff1f6;
}

.withdraw-offer-success__next-actions span.is-violet {
  color: #6f57ff;
  background: #f2efff;
}

.withdraw-offer-success__next-actions span.is-blue {
  color: #4d77ff;
  background: #eef4ff;
}

.withdraw-offer-success__next-actions span.is-green {
  color: #10a86b;
  background: #effcf4;
}

.withdraw-offer-impact small,
.withdraw-offer-success__next-actions small {
  color: #485776;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.4;
}

.withdraw-offer-success__next-actions strong {
  color: #223251;
  font-size: 0.78rem;
  font-weight: 800;
}

.withdraw-offer-field {
  display: grid;
  gap: 10px;
}

.withdraw-offer-field > span,
.withdraw-offer-section__label {
  font-size: 0.74rem;
  font-weight: 700;
}

.withdraw-offer-field em {
  color: #ff2d87;
  font-style: normal;
}

.withdraw-offer-reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.withdraw-offer-reasons button,
.withdraw-offer-preview,
.withdraw-offer-cancel,
.withdraw-offer-confirm,
.withdraw-offer-success__ghost,
.withdraw-offer-success__back,
.withdraw-offer-success__meta-block button,
.withdraw-offer-success__card-head button,
.withdraw-offer-success__ai button {
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  background: #fff;
}

.withdraw-offer-reasons button {
  min-height: 34px;
  padding: 0 12px;
  color: #51607d;
  font-size: 0.72rem;
  font-weight: 700;
}

.withdraw-offer-reasons button.is-active {
  border-color: #ffb4d3;
  color: #ff2d87;
  background: #fff2f8;
}

.withdraw-offer-message-row {
  justify-content: space-between;
  gap: 12px;
}

.withdraw-offer-template {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  color: #51607d;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 700;
}

.withdraw-offer-preview,
.withdraw-offer-success__ghost,
.withdraw-offer-success__back,
.withdraw-offer-success__meta-block button,
.withdraw-offer-success__card-head button {
  min-height: 40px;
  padding: 0 14px;
  color: #223251;
  font-size: 0.72rem;
  font-weight: 800;
}

.withdraw-offer-field textarea {
  min-height: 92px;
  padding: 12px 14px;
  border: 1px solid #e4eaf5;
  border-radius: 14px;
  color: #223251;
  resize: vertical;
  font: inherit;
}

.withdraw-offer-notify {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.withdraw-offer-notify label {
  padding: 14px 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  background: #fff;
}

.withdraw-offer-notify input,
.withdraw-offer-acknowledge input {
  margin-top: 2px;
  accent-color: #ff2d87;
}

.withdraw-offer-notify strong {
  display: block;
  color: #223251;
  font-size: 0.76rem;
  font-weight: 800;
}

.withdraw-offer-notify small {
  display: block;
  margin-top: 4px;
  font-size: 0.68rem;
  line-height: 1.45;
}

.withdraw-offer-footer {
  border-top: 1px solid #edf1f8;
  display: grid;
  gap: 14px;
}

.withdraw-offer-acknowledge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #485776;
  font-size: 0.76rem;
  font-weight: 700;
}

.withdraw-offer-footer__actions {
  justify-content: space-between;
}

.withdraw-offer-cancel,
.withdraw-offer-confirm {
  min-height: 42px;
  padding: 0 18px;
  font-size: 0.76rem;
  font-weight: 800;
}

.withdraw-offer-cancel {
  color: #243351;
}

.withdraw-offer-confirm,
.withdraw-offer-success__ai button {
  color: #fff;
  border-color: #ff2d87;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.2);
}

.withdraw-offer-confirm:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.withdraw-offer-footer__note {
  gap: 6px;
  font-size: 0.72rem;
}

.withdraw-offer-success__topbar {
  justify-content: space-between;
  gap: 16px;
}

.withdraw-offer-success__actions {
  gap: 10px;
}

.withdraw-offer-success__banner {
  margin: 0 22px;
  padding: 12px 14px;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid #d8efe1;
  border-radius: 14px;
  background: #effcf4;
}

.withdraw-offer-success__banner strong {
  display: block;
  color: #10a86b;
  font-size: 0.8rem;
  font-weight: 800;
}

.withdraw-offer-success__banner span {
  display: block;
  margin-top: 2px;
  font-size: 0.72rem;
}

.withdraw-offer-success__hero {
  justify-content: space-between;
  gap: 16px;
}

.withdraw-offer-success__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.withdraw-offer-success__eyebrow strong {
  color: #223251;
  font-size: 0.9rem;
  font-weight: 800;
}

.withdraw-offer-success__tag {
  padding: 4px 8px;
  border-radius: 999px;
  color: #ff2d87;
  background: #fff1f7;
  font-size: 0.64rem;
  font-weight: 800;
}

.withdraw-offer-success__hero p {
  margin: 6px 0 0;
  font-size: 0.76rem;
}

.withdraw-offer-success__journey {
  padding: 0 22px 20px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.withdraw-offer-success__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 320px;
  gap: 18px;
  align-items: start;
}

.withdraw-offer-success__main,
.withdraw-offer-success__side,
.withdraw-offer-success__grid,
.withdraw-offer-success__timeline,
.withdraw-offer-success__next-actions,
.withdraw-offer-success__outcome,
.withdraw-offer-success__documents {
  display: grid;
  gap: 14px;
}

.withdraw-offer-success__grid {
  grid-template-columns: 1fr 1fr;
}

.withdraw-offer-success__card {
  padding: 18px;
  border: 1px solid #edf1f8;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
}

.withdraw-offer-success__card-head {
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin-bottom: 14px;
}

.withdraw-offer-success__card-head h3 {
  flex: 1 1 120px;
  min-width: 0;
}

.withdraw-offer-success__status {
  gap: 10px;
}

.withdraw-offer-success__status strong,
.withdraw-offer-success__timeline strong,
.withdraw-offer-success__meta-block strong,
.withdraw-offer-success__outcome strong,
.withdraw-offer-success__documents strong {
  color: #223251;
  font-size: 0.78rem;
  font-weight: 800;
}

.withdraw-offer-success__list,
.withdraw-offer-success__timeline,
.withdraw-offer-success__outcome {
  margin-top: 14px;
}

.withdraw-offer-success__outcome {
  gap: 0;
}

.withdraw-offer-success__list article,
.withdraw-offer-success__timeline article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.withdraw-offer-success__list article :deep(svg) {
  color: #10a86b;
  margin-top: 2px;
}

.withdraw-offer-success__timeline article span {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  display: inline-block;
}

.withdraw-offer-success__timeline article span.is-green {
  background: #10a86b;
}

.withdraw-offer-success__timeline article span.is-pink {
  background: #ff2d87;
}

.withdraw-offer-success__next-actions {
  margin-top: 14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.withdraw-offer-success__ai {
  padding: 16px 18px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(180deg, #f4f2ff 0%, #fff 100%);
  box-shadow: inset 0 0 0 1px #ece7ff;
}

.withdraw-offer-success__ai strong {
  display: block;
  color: #5b49ff;
  font-size: 0.8rem;
  font-weight: 800;
}

.withdraw-offer-success__ai span {
  display: block;
  margin-top: 4px;
  max-width: 620px;
  font-size: 0.72rem;
  line-height: 1.45;
}

.withdraw-offer-success__meta-block {
  margin-top: 12px;
  display: grid;
  gap: 4px;
}

.withdraw-offer-success__outcome article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f8;
}

.withdraw-offer-success__outcome article:last-child {
  border-bottom: 0;
}

.withdraw-offer-success__badge {
  padding: 6px 10px;
  border-radius: 10px;
  color: #ff2d87;
  background: #fff1f7;
  font-size: 0.72rem;
  line-height: 1;
}

.withdraw-offer-success__provider,
.withdraw-offer-success__provider-status {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.withdraw-offer-success__provider em {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #111827;
  font-style: normal;
  font-size: 0.55rem;
  font-weight: 800;
}

.withdraw-offer-success__provider-status {
  color: #16a34a;
}

.withdraw-offer-success__provider-status :deep(svg) {
  flex: 0 0 auto;
}

.withdraw-offer-success__provider-link {
  width: 100%;
  min-height: 40px;
  margin-top: 16px;
  padding: 0 14px;
  border: 1px solid #dbe5ff;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #5b49ff;
  background: #fff;
  font-size: 0.74rem;
  font-weight: 800;
}

.withdraw-offer-success__documents article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
}

.withdraw-offer-success__documents article > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.withdraw-offer-success__documents article > div span {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.withdraw-offer-success__documents em {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10a86b;
}

@media (max-width: 1180px) {
  .withdraw-offer-success__layout,
  .withdraw-offer-success__grid,
  .withdraw-offer-summary,
  .withdraw-offer-impact,
  .withdraw-offer-notify,
  .withdraw-offer-timeline,
  .withdraw-offer-success__journey,
  .withdraw-offer-success__next-actions {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .withdraw-offer-overlay {
    padding: 12px;
  }

  .withdraw-offer-modal,
  .withdraw-offer-modal--success {
    width: min(100%, calc(100vw - 24px));
  }

  .withdraw-offer-summary,
  .withdraw-offer-impact,
  .withdraw-offer-notify,
  .withdraw-offer-timeline,
  .withdraw-offer-footer__actions,
  .withdraw-offer-message-row,
  .withdraw-offer-success__topbar,
  .withdraw-offer-success__actions,
  .withdraw-offer-success__hero,
  .withdraw-offer-success__layout,
  .withdraw-offer-success__grid,
  .withdraw-offer-success__journey,
  .withdraw-offer-success__next-actions,
  .withdraw-offer-success__ai {
    grid-template-columns: 1fr;
    display: grid;
  }

  .withdraw-offer-timeline__line,
  .withdraw-offer-success__journey-item i {
    display: none;
  }

  .withdraw-offer-preview,
  .withdraw-offer-cancel,
  .withdraw-offer-confirm,
  .withdraw-offer-success__ghost,
  .withdraw-offer-success__back,
  .withdraw-offer-success__ai button,
  .withdraw-offer-success__card-head button {
    width: 100%;
  }

  .withdraw-offer-success__card-head {
    align-items: stretch;
  }
}
</style>
