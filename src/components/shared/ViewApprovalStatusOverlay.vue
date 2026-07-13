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
    default: 'US Software Engineer',
  },
})

const emit = defineEmits(['close', 'view-offer', 'send-reminder'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const approvalRows = [
  ['1', 'Thomas Lee', 'thomas.lee@sns.com', 'Engineering Director', 'Approved', 'May 28, 2026, 10:34 AM', 'View', 'approved'],
  ['2', 'Sarah Chen', 'sarah.chen@sns.com', 'HR Director', 'Pending', 'Waiting for approval', 'Send reminder', 'pending'],
  ['3', 'Michael Adams', 'michael.adams@sns.com', 'Finance Manager', 'Pending', 'Waiting for previous step', 'Send reminder', 'waiting'],
]

const timelineRows = [
  ['Offer submitted for approval', 'Submitted by Majda R.', 'May 28, 2026', '10:15 AM', 'green'],
  ['Thomas Lee approved', 'Engineering Director', 'May 28, 2026', '10:34 AM', 'green'],
  ['Reminder sent to Sarah Chen', 'HR Director', 'May 30, 2026', '09:00 AM', 'pink'],
  ['Waiting for Sarah Chen', 'HR Director', '—', '', 'slate'],
  ['Waiting for Michael Adams', 'Finance Manager', '—', '', 'slate'],
]

const commentRows = [
  ['Thomas Lee', 'Approved', 'Looks good!', 'May 28, 2026, 10:34 AM'],
  ['Sarah Chen', 'Pending', 'Will review and get back shortly.', 'May 30, 2026, 9:15 AM'],
]

const documentRows = [
  ['Offer Letter', 'PDF • 4 pages'],
  ['Agreement', 'PDF • 11 pages'],
  ['Benefits Guide', 'PDF • 7 pages'],
  ['+1 More', ''],
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
    <div v-if="open" class="approval-status-overlay" @click.self="emit('close')">
      <section class="approval-status-modal" @click.stop>
        <header class="approval-status-header">
          <div>
            <h2>View Approval Status</h2>
            <p>Track the approval progress for this offer in real-time.</p>
          </div>

          <div class="approval-status-header__actions">
            <button type="button">
              <AppIcon name="document" :size="13" />
              <span>Download approval summary</span>
            </button>
            <button type="button">
              <span>More actions</span>
              <AppIcon name="chevronDown" :size="13" />
            </button>
            <button type="button" class="approval-status-close" aria-label="Close" @click="emit('close')">
              <AppIcon name="close" :size="15" />
            </button>
          </div>
        </header>

        <section class="approval-status-summary">
          <article class="approval-status-offer approval-status-summary__section">
            <span class="approval-status-offer__icon"><AppIcon name="document" :size="16" /></span>
            <div>
              <strong>{{ candidateRole }} Offer</strong>
              <small>Offer ID: OFF-2026-1287</small>
              <button type="button" @click="emit('view-offer')">View offer details</button>
              <div class="approval-status-offer__meta">
                <article><span>Location</span><strong>San Francisco, CA</strong></article>
                <article><span>Sent On</span><strong>Jun 2, 2026, 10:42 AM</strong></article>
              </div>
            </div>
          </article>

          <article class="approval-status-meta approval-status-summary__section is-candidate">
            <span class="approval-status-meta__avatar">{{ candidateInitials }}</span>
            <div>
              <span>Candidate</span>
              <strong>{{ candidateName }}</strong>
            </div>
          </article>
          <article class="approval-status-meta approval-status-summary__section"><span>Department</span><strong>Engineering</strong></article>
          <article class="approval-status-meta approval-status-summary__section"><span>Employment Type</span><strong>Full-time</strong></article>

          <article class="approval-status-progress approval-status-summary__section">
            <div>
              <span>Approval Progress</span>
              <strong>2 / 3 <small>approvers completed</small></strong>
              <div class="approval-status-progress__bar"><i /></div>
              <small>Estimated completion: Today</small>
            </div>
            <div class="approval-status-progress__ring">
              <span>67%</span>
            </div>
          </article>
        </section>

        <div class="approval-status-layout">
          <section class="approval-status-main">
            <article class="approval-status-card">
              <div class="approval-status-card__head">
                <h3>Approval route</h3>
                <button type="button" @click="emit('send-reminder')">Notify all pending</button>
              </div>

              <div class="approval-status-table">
                <div class="approval-status-table__head">
                  <span>Order</span>
                  <span>Approver</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                <article v-for="item in approvalRows" :key="item[0]">
                  <strong class="approval-status-order">{{ item[0] }}</strong>
                  <div class="approval-status-approver">
                    <span>{{ item[1].split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                    <div>
                      <strong>{{ item[1] }}</strong>
                      <small>{{ item[2] }}</small>
                    </div>
                  </div>
                  <span>{{ item[3] }}</span>
                  <div class="approval-status-state" :class="`is-${item[7]}`">
                    <strong>{{ item[4] }}</strong>
                    <small>{{ item[5] }}</small>
                  </div>
                  <button
                    type="button"
                    :class="{ 'is-link': item[6] === 'Send reminder' }"
                    @click="item[6] === 'Send reminder' ? emit('send-reminder') : null"
                  >
                    {{ item[6] }}
                  </button>
                </article>
              </div>

              <div class="approval-status-note">Approvals will be final once all required approvers have approved.</div>
            </article>

            <div class="approval-status-bottom">
              <article class="approval-status-card">
                <h3>Comments &amp; updates</h3>
                <div class="approval-status-comments">
                  <article v-for="item in commentRows" :key="item[0]">
                    <span>{{ item[0].split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                    <div>
                      <div class="approval-status-comments__head">
                        <strong>{{ item[0] }}</strong>
                        <em :class="`is-${item[1].toLowerCase()}`">{{ item[1] }}</em>
                      </div>
                      <p>{{ item[2] }}</p>
                    </div>
                    <small>{{ item[3] }}</small>
                  </article>
                </div>
                <button type="button" class="approval-status-link">Add internal comment</button>
              </article>

              <article class="approval-status-card">
                <h3>Approval details</h3>
                <div class="approval-status-details">
                  <article><span>Requires</span><strong>2 of 3 approvals</strong></article>
                  <article><span>Approval owners</span><strong>Majda R.</strong></article>
                  <article><span>Approval type</span><strong>Sequential</strong></article>
                  <article><span>If rejected</span><strong>Returns to offer owner</strong></article>
                </div>
                <div class="approval-status-message">
                  <span>Approval message</span>
                  <p>Please review the attached offer for {{ candidateName }} for the {{ candidateRole }} position. Let us know if you have any questions.</p>
                </div>
              </article>
            </div>
          </section>

          <aside class="approval-status-side">
            <article class="approval-status-card">
              <h3>Approval timeline</h3>
              <div class="approval-status-timeline">
                <article v-for="item in timelineRows" :key="item[0]">
                  <span :class="`is-${item[4]}`" />
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                    <em v-if="item[2] !== '—'">{{ item[2] }} <b>{{ item[3] }}</b></em>
                  </div>
                </article>
              </div>
            </article>

            <article class="approval-status-card">
              <div class="approval-status-card__head">
                <h3>Attached documents</h3>
                <button type="button">Preview all</button>
              </div>
              <div class="approval-status-documents">
                <article v-for="item in documentRows" :key="item[0]">
                  <span><AppIcon name="document" :size="13" /></span>
                  <div :class="{ 'is-more': !item[1] }">
                    <strong>{{ item[0] }}</strong>
                    <small v-if="item[1]">{{ item[1] }}</small>
                  </div>
                </article>
              </div>
            </article>

            <article class="approval-status-card">
              <h3>Actions</h3>
              <div class="approval-status-actions">
                <button type="button" @click="emit('send-reminder')">
                  <AppIcon name="bell" :size="13" />
                  <span>Send reminder to pending approvers</span>
                </button>
                <button type="button">
                  <AppIcon name="document" :size="13" />
                  <span>Download approval summary</span>
                </button>
                <button type="button">
                  <AppIcon name="userPlus" :size="13" />
                  <span>Add approval owner</span>
                </button>
              </div>
            </article>
          </aside>
        </div>

        <footer class="approval-status-footer">
          <button type="button" class="approval-status-footer__ghost" @click="emit('close')">Close</button>
          <button type="button" class="approval-status-footer__danger">Cancel approval request</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.approval-status-overlay {
  position: fixed;
  inset: 0;
  z-index: 96;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(10px);
}

.approval-status-modal {
  width: min(1380px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.approval-status-header,
.approval-status-header__actions,
.approval-status-summary,
.approval-status-card__head,
.approval-status-offer,
.approval-status-actions button,
.approval-status-footer {
  display: flex;
  align-items: center;
}

.approval-status-header,
.approval-status-summary,
.approval-status-layout,
.approval-status-footer {
  padding: 18px 22px;
}

.approval-status-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.approval-status-header h2,
.approval-status-card h3,
.approval-status-offer strong,
.approval-status-meta strong,
.approval-status-progress strong,
.approval-status-table strong,
.approval-status-comments strong,
.approval-status-details strong,
.approval-status-timeline strong,
.approval-status-documents strong {
  margin: 0;
  color: #1f2c4f;
}

.approval-status-header p,
.approval-status-meta span,
.approval-status-offer small,
.approval-status-progress span,
.approval-status-progress small,
.approval-status-table span,
.approval-status-table small,
.approval-status-comments p,
.approval-status-comments small,
.approval-status-details span,
.approval-status-message span,
.approval-status-message p,
.approval-status-timeline small,
.approval-status-timeline em,
.approval-status-documents small {
  margin: 0;
  color: #7d8cab;
}

.approval-status-header__actions {
  gap: 10px;
}

.approval-status-header__actions button,
.approval-status-card__head button,
.approval-status-footer__ghost,
.approval-status-footer__danger {
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

.approval-status-close {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.approval-status-summary {
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.approval-status-summary__section {
  min-height: 112px;
  padding: 16px 18px;
  border-right: 1px solid #edf1f8;
}

.approval-status-summary__section:last-child {
  border-right: 0;
}

.approval-status-offer {
  flex: 1.55 1 0;
  gap: 12px;
}

.approval-status-offer__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.approval-status-offer button {
  margin-top: 8px;
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 800;
}

.approval-status-offer__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.approval-status-offer__meta article {
  display: grid;
  gap: 4px;
}

.approval-status-meta {
  flex: 0.9 1 0;
  display: grid;
  gap: 4px;
}

.approval-status-meta.is-candidate {
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.approval-status-meta__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.82rem;
  font-weight: 800;
}

.approval-status-progress {
  flex: 1.15 1 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.approval-status-progress strong {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
}

.approval-status-progress strong small {
  font-size: 0.76rem;
  font-weight: 700;
}

.approval-status-progress__bar {
  width: 100%;
  height: 8px;
  margin: 10px 0 12px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.approval-status-progress__bar i {
  width: 67%;
  height: 100%;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff2d87 0%, #ff6ab0 100%);
}

.approval-status-progress__ring {
  flex: 0 0 86px;
  width: 86px;
  height: 86px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(closest-side, #fff 78%, transparent 80% 100%),
    conic-gradient(#ff5ca2 67%, #edf1f8 0);
}

.approval-status-progress__ring span {
  color: #1f2c4f;
  font-size: 1.05rem;
  font-weight: 800;
}

.approval-status-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) 360px;
  gap: 16px;
  align-items: start;
}

.approval-status-main,
.approval-status-side,
.approval-status-bottom,
.approval-status-comments,
.approval-status-details,
.approval-status-actions,
.approval-status-documents {
  display: grid;
  gap: 14px;
}

.approval-status-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.approval-status-card__head {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.approval-status-table {
  border: 1px solid #edf1f8;
  border-radius: 14px;
  overflow: hidden;
}

.approval-status-table__head,
.approval-status-table article {
  display: grid;
  grid-template-columns: 70px 1.35fr 1fr 1.05fr 120px;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
}

.approval-status-table__head {
  background: #fbfcfe;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.approval-status-table article {
  border-top: 1px solid #edf1f8;
}

.approval-status-order {
  width: 28px;
  height: 28px;
  border: 2px solid #ffb4d3;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  font-size: 0.74rem;
}

.approval-status-approver {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.approval-status-approver > span,
.approval-status-comments > article > span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.72rem;
  font-weight: 800;
}

.approval-status-state {
  display: grid;
  gap: 3px;
}

.approval-status-state strong {
  font-size: 0.78rem;
  font-weight: 800;
}

.approval-status-state.is-approved strong {
  color: #16a34a;
}

.approval-status-state.is-pending strong {
  color: #f97316;
}

.approval-status-state.is-waiting strong {
  color: #94a3b8;
}

.approval-status-table button {
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 800;
}

.approval-status-table button.is-link {
  color: #ff2d87;
}

.approval-status-note {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  color: #ff4b7d;
  background: #fff6fa;
  font-size: 0.72rem;
  font-weight: 700;
}

.approval-status-bottom {
  grid-template-columns: 1fr 1fr;
}

.approval-status-comments > article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f8;
}

.approval-status-comments > article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.approval-status-comments__head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.approval-status-comments__head em {
  padding: 4px 8px;
  border-radius: 999px;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.approval-status-comments__head em.is-approved {
  color: #16a34a;
  background: #effcf4;
}

.approval-status-comments__head em.is-pending {
  color: #f97316;
  background: #fff6e8;
}

.approval-status-link {
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 800;
}

.approval-status-details {
  grid-template-columns: 1fr 1fr;
}

.approval-status-details article {
  display: grid;
  gap: 4px;
}

.approval-status-message {
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  background: #fbfcfe;
}

.approval-status-message p {
  margin-top: 6px;
  font-size: 0.72rem;
  line-height: 1.5;
}

.approval-status-timeline {
  display: grid;
  gap: 14px;
}

.approval-status-timeline article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.approval-status-timeline span {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 999px;
  display: inline-block;
}

.approval-status-timeline span.is-green {
  background: #16a34a;
}

.approval-status-timeline span.is-pink {
  background: #ff2d87;
}

.approval-status-timeline span.is-slate {
  background: #cbd5e1;
}

.approval-status-timeline strong,
.approval-status-timeline small,
.approval-status-timeline em {
  display: block;
}

.approval-status-timeline em {
  margin-top: 4px;
  font-style: normal;
  font-size: 0.68rem;
}

.approval-status-timeline em b {
  color: #1f2c4f;
  font-weight: 800;
}

.approval-status-documents {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.approval-status-documents article {
  min-height: 116px;
  padding: 14px 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  display: grid;
  align-content: start;
  gap: 10px;
}

.approval-status-documents article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.approval-status-documents article > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.approval-status-documents strong,
.approval-status-documents small {
  display: block;
}

.approval-status-documents strong {
  font-size: 0.76rem;
  line-height: 1.25;
  word-break: break-word;
}

.approval-status-documents small {
  font-size: 0.7rem;
  line-height: 1.35;
}

.approval-status-documents article > div.is-more {
  align-content: center;
  justify-items: start;
}

.approval-status-actions button {
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

.approval-status-footer {
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #edf1f8;
}

.approval-status-footer__danger {
  margin-left: auto;
  color: #ff2d87;
  border-color: #ffd1e3;
  background: #fff4f9;
}

@media (max-width: 1180px) {
  .approval-status-summary,
  .approval-status-layout,
  .approval-status-bottom,
  .approval-status-details,
  .approval-status-documents {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .approval-status-progress,
  .approval-status-offer {
    grid-column: 1 / -1;
  }

  .approval-status-summary__section {
    border-right: 0;
    border-bottom: 1px solid #edf1f8;
  }

  .approval-status-summary__section:last-child {
    border-bottom: 0;
  }
}

@media (max-width: 760px) {
  .approval-status-overlay {
    padding: 12px;
  }

  .approval-status-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .approval-status-header,
  .approval-status-summary,
  .approval-status-layout,
  .approval-status-bottom,
  .approval-status-details,
  .approval-status-documents,
  .approval-status-table__head,
  .approval-status-table article,
  .approval-status-comments > article,
  .approval-status-footer {
    grid-template-columns: 1fr;
    display: grid;
  }
}
</style>
