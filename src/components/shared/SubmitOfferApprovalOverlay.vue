<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  submitted: {
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
  department: {
    type: String,
    default: 'Engineering',
  },
  location: {
    type: String,
    default: 'San Francisco, CA',
  },
})

const emit = defineEmits(['close', 'submitted'])

const phase = ref('configure')
const approvalMode = ref('sequential')

const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const approvalRoute = [
  ['1', 'TL', 'Thomas Lee', 'Hiring Manager', 'Required', 'Usually responds in 6h'],
  ['2', 'SC', 'Sarah Chen', 'HR Director', 'Required', 'Usually responds in 12h'],
  ['3', 'MA', 'Michael Adams', 'Finance', 'Required', 'Usually responds in 8h'],
  ['4', 'LT', 'Legal Team', 'Legal', 'Optional', 'Not in approval chain'],
]

const summaryRows = [
  ['Base Salary', '$145,000', 'Annual'],
  ['Bonus', '12%', 'Annual'],
  ['Equity (RSUs)', '750', 'over 4 years'],
  ['Start Date', 'Jun 16, 2026', 'Full-time'],
  ['Offer Expires', 'May 23, 2026', '7 days'],
]

const documentRows = [
  ['Offer Letter', 'AI-generated', 'document', 'blue'],
  ['Employment Contract', 'AI-generated', 'document', 'green'],
  ['NDA', 'Attached', 'document', 'orange'],
  ['Benefits Guide', 'Attached', 'document', 'violet'],
  ['Employee Handbook', 'Attached', 'document', 'pink'],
  ['+1 more', '', 'plus', 'slate'],
]

const validationRows = [
  ['Salary within approved budget', 'Within salary band by $2,300'],
  ['All required fields are completed', 'No missing information'],
  ['Compensation matches pay bands', 'Compliant with internal policy'],
  ['Required documents attached', '6 documents ready'],
  ['Approval policy satisfied', '3 approvers required'],
  ['Country & compliance verified', 'US employment compliance'],
]

const nextRows = [
  'All approvers will be notified',
  'You will receive updates as approvals come in',
  'Once approved, you can generate documents and send the offer',
  'Offer will be locked until approved',
]

const approversSeeRows = [
  'AI Executive Summary',
  'Offer Summary',
  'Changes from AI Recommendation',
  'Compensation Breakdown',
  'Approval Buttons',
]

const quickActionRows = [
  ['Review offer summary', 'See the offer details'],
  ['Message approvers', 'Send a message to the approval team'],
  ['Download approval request', 'Save a copy of the approval request'],
]

const progressSections = [
  ['Compensation', 'Base pay, bonus, equity and benefits.', 'AI approved', '$145,000', 'green'],
  ['Employment', 'Job title, department, type and location.', 'Locked during approval', 'Senior Frontend Developer', 'slate'],
  ['Start Date & Timeline', 'Important dates and milestones.', 'Locked during approval', 'Start: Jun 16, 2026', 'slate'],
  ['Documents to be Generated', 'Offer letter, contracts and other documents.', '4 ready / 1 action required', '', 'orange'],
  ['Additional Terms', 'Notice period, probation, benefits and more.', 'Locked during approval', 'Notice: 2 weeks', 'slate'],
  ['Approval Requirements', 'Internal approvals needed before sending.', '2 pending', '', 'orange'],
  ['Internal Notes', 'Visible only to internal team.', '2 notes', '', 'violet'],
  ['Candidate Acceptance Conditions', 'What the candidate expects and what we\'re offering.', 'Aligned', '', 'green'],
  ['Offer Compliance', 'Compliance & policy checks.', 'No issues', '', 'green'],
]

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      return
    }

    phase.value = props.submitted ? 'progress' : 'configure'
    approvalMode.value = 'sequential'
  },
)

function closeOverlay() {
  emit('close')
}

function handleCloseAction() {
  if (phase.value === 'success') {
    phase.value = 'progress'
    return
  }

  closeOverlay()
}

function handleBackdropClick() {
  handleCloseAction()
}

function submitForApproval() {
  emit('submitted')
  phase.value = 'success'
}

function openProgressState() {
  phase.value = 'progress'
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="approval-submit-overlay" @click.self="handleBackdropClick">
      <section class="approval-submit-modal" :class="`is-${phase}`" @click.stop>
        <template v-if="phase === 'configure'">
          <header class="approval-submit-head">
            <div class="approval-submit-head__title">
              <span class="approval-submit-head__mark">
                <AppIcon name="share" :size="20" />
              </span>
              <div>
                <h2>Submit Offer for Approval</h2>
                <p>The offer will be locked and sent to the required approvers.</p>
              </div>
            </div>

            <button type="button" class="approval-submit-close" aria-label="Close approval submit" @click="closeOverlay">
              <AppIcon name="close" :size="20" />
            </button>
          </header>

          <div class="approval-submit-grid">
            <div class="approval-submit-column">
              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="document" :size="14" /> Offer Summary</span>
                  <small>Review the final offer details before sending for approval.</small>
                </div>

                <div class="approval-submit-profile">
                  <span class="approval-submit-avatar">{{ candidateInitials }}</span>
                  <div>
                    <strong>{{ candidateName }}</strong>
                    <span>{{ candidateRole }}</span>
                    <div class="approval-submit-profile__meta">
                      <small><AppIcon name="briefcase" :size="12" /> {{ department }}</small>
                      <small><AppIcon name="mapPin" :size="12" /> {{ location }}</small>
                      <small><AppIcon name="user-check" :size="12" /> Full-time</small>
                    </div>
                  </div>
                </div>

                <div class="approval-submit-summary-grid">
                  <article v-for="row in summaryRows" :key="row[0]">
                    <small>{{ row[0] }}</small>
                    <strong>{{ row[1] }}</strong>
                    <span>{{ row[2] }}</span>
                  </article>
                </div>

                <div class="approval-submit-docs">
                  <strong>Documents to be generated</strong>
                  <div class="approval-submit-docs__grid">
                    <article v-for="row in documentRows" :key="row[0]">
                      <span :class="`is-${row[3]}`"><AppIcon :name="row[2]" :size="14" /></span>
                      <div>
                        <strong>{{ row[0] }}</strong>
                        <small v-if="row[1]">{{ row[1] }}</small>
                      </div>
                    </article>
                  </div>
                </div>
              </article>

              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="sparkles" :size="14" /> AI Final Validation</span>
                  <small>NitroSync has reviewed this offer and found no issues.</small>
                </div>

                <div class="approval-submit-validation">
                  <div class="approval-submit-validation__list">
                    <article v-for="row in validationRows" :key="row[0]">
                      <AppIcon name="checkCircle" :size="14" />
                      <div>
                        <strong>{{ row[0] }}</strong>
                        <small>{{ row[1] }}</small>
                      </div>
                    </article>
                  </div>

                  <div class="approval-submit-readiness">
                    <div class="approval-submit-readiness__ring">
                      <div><strong>98%</strong></div>
                    </div>
                    <span>Approval readiness</span>
                    <strong>Very High</strong>
                  </div>
                </div>
              </article>

              <div class="approval-submit-bottom-grid">
                <article class="approval-submit-card">
                  <div class="approval-submit-card__title">
                    <span><AppIcon name="mail" :size="14" /> Message to Approvers (Optional)</span>
                    <small>This message will be visible to all approvers.</small>
                  </div>

                  <div class="approval-submit-message">
                    <p>Please review the offer for {{ candidateName.split(' ')[0] }}.</p>
                    <p>This offer has been reviewed by NitroSync.</p>
                    <p>All validation checks are complete.</p>
                    <small>131/500</small>
                  </div>
                </article>

                <article class="approval-submit-card">
                  <div class="approval-submit-card__title">
                    <span><AppIcon name="bell" :size="14" /> Notify Approvers Via</span>
                  </div>

                  <div class="approval-submit-notify">
                    <label><input checked type="checkbox"> <span>Email</span></label>
                    <label><input checked type="checkbox"> <span>In-app notification</span></label>
                    <label><input checked type="checkbox"> <span>Slack</span></label>
                    <label><input checked type="checkbox"> <span>Microsoft Teams</span></label>
                    <small>Approvers will be notified once the offer is submitted.</small>
                  </div>
                </article>
              </div>
            </div>

            <div class="approval-submit-column">
              <article class="approval-submit-card">
                <div class="approval-submit-route-head">
                  <div class="approval-submit-card__title">
                    <span><AppIcon name="compare" :size="14" /> Approval Route</span>
                    <small>Choose how the approval process should run.</small>
                  </div>
                  <em>3 approvers required</em>
                </div>

                <div class="approval-submit-route-switch">
                  <button
                    type="button"
                    :class="{ 'is-active': approvalMode === 'sequential' }"
                    @click="approvalMode = 'sequential'"
                  >
                    <strong>Sequential (Substantial)</strong>
                    <span>Approvers review one after another.</span>
                  </button>
                  <button
                    type="button"
                    :class="{ 'is-active': approvalMode === 'parallel' }"
                    @click="approvalMode = 'parallel'"
                  >
                    <strong>Parallel</strong>
                    <span>All approvers review at the same time.</span>
                  </button>
                </div>

                <div class="approval-submit-route-list">
                  <article v-for="row in approvalRoute" :key="row[0]">
                    <span class="order">{{ row[0] }}</span>
                    <span class="avatar">{{ row[1] }}</span>
                    <div class="copy">
                      <strong>{{ row[2] }}</strong>
                      <small>{{ row[3] }}</small>
                    </div>
                    <div class="status">
                      <em :class="{ 'is-optional': row[4] === 'Optional' }">{{ row[4] }}</em>
                      <small>{{ row[5] }}</small>
                    </div>
                  </article>
                </div>

                <div class="approval-submit-route-actions">
                  <button type="button">+ Add approver</button>
                  <button type="button"><AppIcon name="refresh" :size="13" /> Reset route</button>
                </div>
              </article>

              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="spark" :size="14" /> What Happens Next?</span>
                </div>
                <div class="approval-submit-list">
                  <article v-for="row in nextRows" :key="row">
                    <AppIcon name="checkCircle" :size="14" />
                    <span>{{ row }}</span>
                  </article>
                </div>
              </article>

              <article class="approval-submit-card is-highlight">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="sparkles" :size="14" /> Approvers Will See</span>
                </div>
                <div class="approval-submit-list compact">
                  <article v-for="row in approversSeeRows" :key="row">
                    <AppIcon name="check" :size="14" />
                    <span>{{ row }}</span>
                  </article>
                </div>

                <div class="approval-submit-mini-stat">
                  <span><AppIcon name="clock" :size="14" /> Estimated review time</span>
                  <strong>2 minutes</strong>
                </div>
              </article>
            </div>
          </div>

          <footer class="approval-submit-foot">
            <div class="approval-submit-secure">
              <AppIcon name="lock" :size="14" />
              <span>Your data is secure and encrypted</span>
            </div>

            <div class="approval-submit-foot__actions">
              <button type="button" class="is-ghost" @click="closeOverlay">Cancel</button>
              <button type="button" class="is-ghost">Save as draft</button>
              <button type="button" class="is-primary" @click="submitForApproval">
                <AppIcon name="share" :size="16" />
                <span>Submit for Approval</span>
              </button>
            </div>
          </footer>
        </template>

        <template v-else-if="phase === 'success'">
          <button type="button" class="approval-submit-close" aria-label="Close approval success" @click="openProgressState">
            <AppIcon name="close" :size="20" />
          </button>

          <div class="approval-success">
            <div class="approval-success__hero">
              <div class="approval-success__badge">
                <AppIcon name="checkCircle" :size="40" />
              </div>
              <h2>Offer sent for approval!</h2>
              <p>The offer has been sent to the approvers. You will be notified once all approvals are complete.</p>
            </div>

            <div class="approval-success__summary">
              <article>
                <span class="icon"><AppIcon name="share" :size="18" /></span>
                <div><small>Offer for</small><strong>{{ candidateName }}</strong><span>{{ candidateRole }}</span></div>
              </article>
              <article>
                <span class="icon"><AppIcon name="user" :size="18" /></span>
                <div><small>Submitted by</small><strong>You</strong><span>May 19, 2026 10:45 AM</span></div>
              </article>
              <article>
                <span class="icon"><AppIcon name="compare" :size="18" /></span>
                <div><small>Approval method</small><strong>Sequential (Substantial)</strong></div>
              </article>
              <article>
                <span class="icon"><AppIcon name="users" :size="18" /></span>
                <div><small>Total approvers</small><strong>3 required</strong><span>1 optional</span></div>
              </article>
              <article>
                <span class="icon is-green"><AppIcon name="clock" :size="18" /></span>
                <div><small>Estimated completion</small><strong>May 22, 2026</strong><span>Before 5:00 PM</span></div>
              </article>
            </div>

            <article class="approval-submit-card">
              <div class="approval-submit-card__title">
                <span><AppIcon name="compare" :size="14" /> Approval Route</span>
              </div>

              <div class="approval-success__route">
                <article v-for="row in approvalRoute" :key="`success-${row[0]}`">
                  <span class="order">{{ row[0] }}</span>
                  <span class="avatar">{{ row[1] }}</span>
                  <strong>{{ row[2] }}</strong>
                  <small>{{ row[3] }}</small>
                  <em :class="{ 'is-optional': row[4] === 'Optional' }">
                    {{ row[4] === 'Required' ? (row[0] === '1' ? 'Notified' : 'Pending') : 'Optional' }}
                  </em>
                  <span>{{ row[5] }}</span>
                </article>
              </div>
            </article>

            <div class="approval-success__grid">
              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="spark" :size="14" /> What Happens Next?</span>
                </div>
                <div class="approval-submit-list">
                  <article v-for="row in nextRows" :key="`success-${row}`">
                    <AppIcon name="checkCircle" :size="14" />
                    <span>{{ row }}</span>
                  </article>
                </div>
              </article>

              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="sparkles" :size="14" /> Quick Actions</span>
                </div>
                <div class="approval-success__actions">
                  <button v-for="row in quickActionRows" :key="row[0]" type="button">
                    <div>
                      <strong>{{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                    </div>
                    <AppIcon name="chevronRight" :size="16" />
                  </button>
                </div>
              </article>
            </div>

            <footer class="approval-submit-foot is-success">
              <div class="approval-submit-secure">
                <AppIcon name="lock" :size="14" />
                <span>Your data is secure and encrypted</span>
              </div>

              <div class="approval-submit-foot__actions">
                <button type="button" class="is-primary" @click="openProgressState">Close</button>
              </div>
            </footer>
          </div>
        </template>

        <template v-else>
          <header class="approval-progress-head">
            <div class="approval-submit-head__title">
              <span class="approval-submit-head__mark is-violet">
                <AppIcon name="share" :size="20" />
              </span>
              <div>
                <h2>Approval In Progress</h2>
                <p>This offer has been submitted for approval. Editing is locked until all required approvals are completed.</p>
              </div>
            </div>

            <div class="approval-progress-head__meta">
              <article><AppIcon name="calendar" :size="16" /> <div><small>Submitted</small><strong>Today, May 19, 2026</strong><span>10:31 AM</span></div></article>
              <article><AppIcon name="clock" :size="16" /> <div><small>Estimated completion</small><strong>Today before 5:00 PM</strong></div></article>
              <button type="button" class="approval-submit-close" aria-label="Close approval progress" @click="closeOverlay">
                <AppIcon name="close" :size="20" />
              </button>
            </div>
          </header>

          <div class="approval-progress-grid">
            <div class="approval-progress-main">
              <article class="approval-submit-card approval-progress-profile">
                <div class="approval-submit-profile">
                  <span class="approval-submit-avatar">{{ candidateInitials }}</span>
                  <div>
                    <div class="approval-progress-profile__row">
                      <strong>{{ candidateName }}</strong>
                      <em>Validated</em>
                    </div>
                    <span>{{ candidateRole }}</span>
                    <div class="approval-submit-profile__meta">
                      <small><AppIcon name="briefcase" :size="12" /> {{ department }}</small>
                      <small><AppIcon name="mapPin" :size="12" /> {{ location }}</small>
                      <small><AppIcon name="user-check" :size="12" /> Full-time</small>
                    </div>
                    <button type="button" class="approval-progress-link">View full profile <AppIcon name="chevronRight" :size="14" /></button>
                  </div>
                </div>

                <div class="approval-progress-status">
                  <span><AppIcon name="lock" :size="14" /> Approval Status</span>
                  <strong>Waiting for approvals</strong>
                  <div class="approval-progress-status__bar"><i /></div>
                  <small>1 / 3 Completed</small>
                </div>
              </article>

              <div class="approval-progress-sections">
                <article v-for="row in progressSections" :key="row[0]" class="approval-progress-section">
                  <div class="approval-progress-section__left">
                    <span class="icon"><AppIcon name="document" :size="15" /></span>
                    <div>
                      <strong>{{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                    </div>
                  </div>
                  <div class="approval-progress-section__right">
                    <em :class="`is-${row[4]}`">{{ row[2] }}</em>
                    <span v-if="row[3]">{{ row[3] }}</span>
                    <AppIcon name="chevronRight" :size="16" />
                  </div>
                </article>
              </div>
            </div>

            <aside class="approval-progress-side">
              <article class="approval-submit-card">
                <h3>Approval Progress</h3>
                <div class="approval-progress-ring">
                  <div class="approval-progress-ring__chart"><strong>33%</strong></div>
                  <div class="approval-progress-ring__legend">
                    <div><i class="is-green" /> <span>1 Approved</span></div>
                    <div><i class="is-orange" /> <span>2 Pending</span></div>
                    <div><i class="is-slate" /> <span>0 Not required</span></div>
                  </div>
                </div>
                <div class="approval-progress-estimate">
                  <span>Estimated completion</span>
                  <strong>Today before 5:00 PM</strong>
                </div>
              </article>

              <article class="approval-submit-card">
                <h3>Approval Route</h3>
                <div class="approval-progress-route">
                  <article v-for="row in approvalRoute" :key="`progress-${row[0]}`">
                    <i :class="row[0] === '1' ? 'is-green' : row[4] === 'Optional' ? 'is-slate' : 'is-orange'" />
                    <span class="avatar">{{ row[1] }}</span>
                    <div>
                      <strong>{{ row[2] }}</strong>
                      <small>{{ row[3] }}</small>
                    </div>
                    <div class="status">
                      <strong :class="row[0] === '1' ? 'is-green' : row[4] === 'Optional' ? 'is-slate' : 'is-orange'">
                        {{ row[0] === '1' ? 'Approved' : row[4] === 'Optional' ? 'Optional' : 'Pending' }}
                      </strong>
                      <small>{{ row[0] === '1' ? 'Today, 10:31 AM' : row[5] }}</small>
                    </div>
                  </article>
                </div>
                <button type="button" class="approval-progress-message">Message Approvers</button>
              </article>

              <article class="approval-submit-card">
                <div class="approval-submit-card__title">
                  <span><AppIcon name="sparkles" :size="14" /> AI Executive Summary</span>
                  <small>This offer has been reviewed by AI and is ready for approval.</small>
                </div>
                <div class="approval-progress-ai">
                  <div><span>Estimated acceptance</span><strong>88%</strong></div>
                  <div><span>Negotiation risk</span><strong>Low (22% chance)</strong></div>
                  <div><span>Approval required</span><strong>3 people</strong></div>
                  <div><span>Time to review</span><strong>~2 min</strong></div>
                </div>
              </article>
            </aside>
          </div>

          <footer class="approval-submit-foot">
            <div class="approval-submit-secure">
              <AppIcon name="lock" :size="14" />
              <span>Your data is secure and encrypted</span>
            </div>

            <div class="approval-submit-foot__actions">
              <button type="button" class="is-danger">Withdraw Approval</button>
              <button type="button" class="is-ghost">Message Approvers</button>
              <button type="button" class="is-ghost" @click="closeOverlay">Close</button>
            </div>
          </footer>
        </template>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.approval-submit-overlay {
  position: fixed;
  inset: 0;
  z-index: 2200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 14px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(12px);
}

.approval-submit-modal {
  position: relative;
  width: min(1420px, 100%);
  margin: auto 0;
  border: 1px solid #dae4f2;
  border-radius: 28px;
  background:
    radial-gradient(circle at top center, rgba(255, 86, 166, 0.06), transparent 32%),
    #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.3);
}

.approval-submit-modal.is-success,
.approval-submit-modal.is-progress {
  width: min(1560px, 100%);
}

.approval-submit-head,
.approval-progress-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px 20px 16px;
}

.approval-submit-head__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.approval-submit-head__mark {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff1f8 0%, #ffe8f3 100%);
}

.approval-submit-head__mark.is-violet {
  color: #5b49ff;
  background: linear-gradient(180deg, #f1efff 0%, #ece8ff 100%);
}

.approval-submit-head h2,
.approval-success h2,
.approval-submit-card h3,
.approval-progress-head h2 {
  margin: 0;
  color: #1b2948;
}

.approval-submit-head h2,
.approval-progress-head h2 {
  font-size: 1.18rem;
  font-weight: 800;
}

.approval-submit-head p,
.approval-success p,
.approval-submit-card__title small,
.approval-progress-head p {
  margin: 6px 0 0;
  color: #7383a3;
  line-height: 1.5;
}

.approval-submit-close {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  color: #7b88a1;
  background: transparent;
}

.approval-submit-grid,
.approval-progress-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.9fr);
  gap: 14px;
  padding: 0 20px 20px;
}

.approval-submit-column,
.approval-progress-main,
.approval-progress-side {
  display: grid;
  gap: 14px;
}

.approval-submit-card,
.approval-progress-section {
  border: 1px solid #e4eaf5;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 28px rgba(148, 163, 184, 0.08);
}

.approval-submit-card {
  padding: 16px;
}

.approval-submit-card.is-highlight {
  background: linear-gradient(180deg, #fff8fc 0%, #fff3f9 100%);
}

.approval-submit-card__title span,
.approval-submit-card h3 {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1d2b49;
  font-size: 0.98rem;
  font-weight: 800;
}

.approval-submit-profile {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin-top: 18px;
}

.approval-submit-avatar,
.approval-submit-route-list .avatar,
.approval-success__route .avatar,
.approval-progress-route .avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffdcbc 0%, #ffbf82 100%);
  color: #60360f;
  font-size: 0.96rem;
  font-weight: 800;
}

.approval-submit-profile strong,
.approval-submit-route-list .copy strong,
.approval-progress-profile__row strong {
  display: block;
  color: #1d2b49;
  font-size: 1.12rem;
  font-weight: 800;
}

.approval-submit-profile > div > span,
.approval-progress-profile__row + span {
  display: block;
  margin-top: 4px;
  color: #465676;
  font-weight: 600;
}

.approval-submit-profile__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 12px;
}

.approval-submit-profile__meta small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7a89a4;
}

.approval-submit-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  margin-top: 18px;
  border: 1px solid #e9eef8;
  border-radius: 16px;
  overflow: hidden;
}

.approval-submit-summary-grid article {
  min-height: 92px;
  padding: 14px;
  background: #fff;
}

.approval-submit-summary-grid article + article {
  border-left: 1px solid #e9eef8;
}

.approval-submit-summary-grid small,
.approval-submit-docs strong,
.approval-submit-message small,
.approval-submit-notify small,
.approval-progress-head__meta small,
.approval-progress-estimate span,
.approval-progress-ai span,
.approval-progress-route article small,
.approval-success__summary small {
  color: #7c8aa3;
}

.approval-submit-summary-grid strong,
.approval-submit-message p,
.approval-submit-notify label span,
.approval-progress-route article strong,
.approval-progress-estimate strong,
.approval-progress-ai strong,
.approval-success__summary strong {
  display: block;
  margin-top: 8px;
  color: #1d2b49;
  font-weight: 800;
}

.approval-submit-summary-grid span,
.approval-success__summary span {
  display: block;
  margin-top: 4px;
  color: #6d7c97;
}

.approval-submit-docs {
  margin-top: 18px;
}

.approval-submit-docs__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.approval-submit-docs__grid article {
  min-height: 64px;
  padding: 10px;
  border: 1px solid #e7ecf6;
  border-radius: 14px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.approval-submit-docs__grid article > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fd;
}

.approval-submit-docs__grid article > span.is-blue { color: #2563eb; background: #edf5ff; }
.approval-submit-docs__grid article > span.is-green { color: #16a34a; background: #ecfdf3; }
.approval-submit-docs__grid article > span.is-orange { color: #f59e0b; background: #fff5e8; }
.approval-submit-docs__grid article > span.is-violet { color: #5b49ff; background: #f1efff; }
.approval-submit-docs__grid article > span.is-pink { color: #ff2d87; background: #fff0f7; }

.approval-submit-docs__grid article strong,
.approval-submit-list article span,
.approval-success__actions strong,
.approval-progress-section__left strong {
  color: #1d2b49;
}

.approval-submit-validation {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 18px;
  align-items: center;
  margin-top: 16px;
}

.approval-submit-validation__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.approval-submit-validation__list article,
.approval-submit-list article {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.approval-submit-validation__list svg,
.approval-submit-list svg {
  margin-top: 2px;
  color: #10a86b;
}

.approval-submit-validation__list strong {
  display: block;
  color: #1d2b49;
  font-size: 0.88rem;
  font-weight: 800;
}

.approval-submit-readiness {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 8px;
}

.approval-submit-readiness__ring {
  width: 102px;
  height: 102px;
  padding: 8px;
  border-radius: 50%;
  background: conic-gradient(#16a34a 0 353deg, #eaf7ef 353deg 360deg);
}

.approval-submit-readiness__ring div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.approval-submit-readiness__ring strong,
.approval-progress-ring__chart strong {
  color: #1d2b49;
  font-size: 1.75rem;
  font-weight: 800;
}

.approval-submit-readiness span {
  color: #7c8aa3;
  font-size: 0.78rem;
  text-transform: uppercase;
  font-weight: 800;
}

.approval-submit-readiness > strong {
  color: #16a34a;
}

.approval-submit-bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 14px;
}

.approval-submit-message {
  min-height: 128px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #e8edf7;
  border-radius: 16px;
  background: #fff;
}

.approval-submit-message p {
  margin: 0;
}

.approval-submit-message p + p {
  margin-top: 10px;
}

.approval-submit-message small {
  display: block;
  margin-top: 12px;
  text-align: right;
}

.approval-submit-notify {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.approval-submit-notify label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.approval-submit-notify input {
  width: 16px;
  height: 16px;
  accent-color: #ff2d87;
}

.approval-submit-route-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.approval-submit-route-head em {
  padding: 7px 10px;
  border-radius: 999px;
  color: #ff2d87;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
  background: #fff0f7;
}

.approval-submit-route-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.approval-submit-route-switch button {
  min-height: 86px;
  padding: 14px;
  border: 1px solid #dbe4f3;
  border-radius: 16px;
  text-align: left;
  background: #fff;
}

.approval-submit-route-switch button.is-active {
  border-color: #ff7bb7;
  background: linear-gradient(180deg, #fff7fb 0%, #fff1f8 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 45, 135, 0.2);
}

.approval-submit-route-switch strong,
.approval-submit-route-switch span {
  display: block;
}

.approval-submit-route-switch span {
  margin-top: 6px;
  color: #6f7f99;
  font-size: 0.84rem;
}

.approval-submit-route-list {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.approval-submit-route-list article {
  display: grid;
  grid-template-columns: 34px 52px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.approval-submit-route-list .order,
.approval-success__route .order {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(180deg, #ff4ba0 0%, #ff1f7c 100%);
}

.approval-submit-route-list .copy small,
.approval-submit-route-list .status small,
.approval-submit-list article span,
.approval-success__actions small {
  display: block;
  margin-top: 4px;
  color: #7988a2;
}

.approval-submit-route-list .status {
  text-align: right;
}

.approval-submit-route-list .status em {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  color: #ff2d87;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
  background: #fff0f7;
}

.approval-submit-route-list .status em.is-optional {
  color: #7383a3;
  background: #f3f6fd;
}

.approval-submit-route-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.approval-submit-route-actions button,
.approval-success__actions button,
.approval-progress-message,
.approval-progress-link {
  border: 0;
  background: transparent;
  color: #5b49ff;
  font-weight: 800;
}

.approval-submit-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.approval-submit-list.compact {
  gap: 10px;
}

.approval-submit-mini-stat {
  margin-top: 18px;
  min-height: 70px;
  padding: 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 0 0 1px #fde1ee;
}

.approval-submit-mini-stat span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7f99;
}

.approval-submit-mini-stat strong {
  color: #1d2b49;
}

.approval-submit-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 0 20px 20px;
}

.approval-submit-foot.is-success {
  padding: 0;
  margin-top: 20px;
}

.approval-submit-secure {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7f99;
  font-weight: 700;
}

.approval-submit-foot__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.approval-submit-foot__actions button,
.approval-success__actions button,
.approval-progress-message {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 800;
}

.approval-submit-foot__actions .is-ghost,
.approval-progress-message,
.approval-success__actions button {
  border: 1px solid #d8e2f2;
  color: #233456;
  background: #fff;
}

.approval-submit-foot__actions .is-primary {
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  background: linear-gradient(180deg, #ff479d 0%, #ff1f7c 100%);
  box-shadow: 0 18px 30px rgba(255, 31, 124, 0.22);
}

.approval-submit-foot__actions .is-danger {
  border: 1px solid #ffd5e7;
  color: #ff2d87;
  background: #fff8fc;
}

.approval-success {
  padding: 20px;
}

.approval-success__hero {
  display: grid;
  justify-items: center;
  text-align: center;
  padding: 8px 0 16px;
}

.approval-success__badge {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  background: radial-gradient(circle at center, #ebfff3 0%, #d7f7e2 100%);
}

.approval-success h2 {
  margin-top: 16px;
  font-size: 1.5rem;
  font-weight: 800;
}

.approval-success__summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  border: 1px solid #e6ecf7;
  border-radius: 20px;
  overflow: hidden;
}

.approval-success__summary article {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  padding: 16px;
  align-items: center;
  background: #fff;
}

.approval-success__summary article + article {
  border-left: 1px solid #e6ecf7;
}

.approval-success__summary .icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff0f7;
}

.approval-success__summary .icon.is-green {
  color: #16a34a;
  background: #ebfff3;
}

.approval-success__route {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 18px;
}

.approval-success__route article {
  display: grid;
  justify-items: start;
  gap: 8px;
  align-content: start;
}

.approval-success__route em {
  padding: 6px 10px;
  border-radius: 999px;
  color: #ff2d87;
  font-style: normal;
  font-weight: 800;
  background: #fff0f7;
}

.approval-success__route em.is-optional {
  color: #7383a3;
  background: #f3f6fd;
}

.approval-success__route > article > span:last-child {
  color: #65748f;
}

.approval-success__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 0.92fr;
  gap: 14px;
  margin-top: 14px;
}

.approval-success__actions {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.approval-success__actions button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  text-align: left;
}

.approval-progress-head__meta {
  display: flex;
  align-items: stretch;
  gap: 18px;
}

.approval-progress-head__meta article {
  min-width: 230px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 0 16px;
  border-left: 1px solid #e7edf8;
}

.approval-progress-head__meta strong,
.approval-progress-route article strong {
  display: block;
  margin-top: 4px;
  color: #1d2b49;
  font-weight: 800;
}

.approval-progress-profile {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) 320px;
  gap: 18px;
  align-items: center;
}

.approval-progress-profile__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.approval-progress-profile__row em {
  padding: 4px 10px;
  border-radius: 999px;
  color: #12a86c;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
  background: #eafaf1;
}

.approval-progress-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
}

.approval-progress-status {
  padding: 16px;
  border: 1px solid #e6edf8;
  border-radius: 18px;
  background: #fff;
}

.approval-progress-status span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6f7f99;
  font-size: 0.82rem;
  font-weight: 800;
}

.approval-progress-status strong {
  display: block;
  margin-top: 8px;
  color: #f59e0b;
  font-size: 1.08rem;
  font-weight: 800;
}

.approval-progress-status__bar {
  height: 6px;
  margin-top: 14px;
  overflow: hidden;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffd36b 0%, #d8deea 100%);
}

.approval-progress-status__bar i {
  display: block;
  width: 33%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffd36b 0%, #f59e0b 100%);
}

.approval-progress-status small {
  display: block;
  margin-top: 10px;
  text-align: right;
  color: #6f7f99;
}

.approval-progress-sections {
  display: grid;
  gap: 12px;
}

.approval-progress-section {
  min-height: 68px;
  padding: 0 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
}

.approval-progress-section__left,
.approval-progress-section__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.approval-progress-section__left .icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5b49ff;
  background: #f2f0ff;
}

.approval-progress-section__left small,
.approval-progress-section__right span {
  color: #7b8aa4;
}

.approval-progress-section__right em {
  padding: 6px 10px;
  border-radius: 999px;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
  white-space: nowrap;
}

.approval-progress-section__right em.is-green {
  color: #12a86c;
  background: #ebfaf1;
}

.approval-progress-section__right em.is-orange {
  color: #f59e0b;
  background: #fff6e8;
}

.approval-progress-section__right em.is-violet {
  color: #5b49ff;
  background: #f3f1ff;
}

.approval-progress-section__right em.is-slate {
  color: #7383a3;
  background: #f3f6fd;
}

.approval-progress-ring {
  display: grid;
  grid-template-columns: 126px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}

.approval-progress-ring__chart {
  width: 118px;
  height: 118px;
  padding: 10px;
  border-radius: 50%;
  background: conic-gradient(#f59e0b 0 120deg, #5b49ff 120deg 150deg, #edf1f8 150deg 360deg);
}

.approval-progress-ring__chart::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fff;
}

.approval-progress-ring__chart strong {
  position: relative;
  display: block;
  margin-top: -68px;
  text-align: center;
}

.approval-progress-ring__legend {
  display: grid;
  gap: 12px;
}

.approval-progress-ring__legend div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.approval-progress-ring__legend i,
.approval-progress-route article > i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.approval-progress-ring__legend i.is-green,
.approval-progress-route article > i.is-green {
  background: #12a86c;
}

.approval-progress-ring__legend i.is-orange,
.approval-progress-route article > i.is-orange {
  background: #fff;
  box-shadow: inset 0 0 0 3px #f59e0b;
}

.approval-progress-ring__legend i.is-slate,
.approval-progress-route article > i.is-slate {
  background: #fff;
  box-shadow: inset 0 0 0 2px #c8d1e2;
}

.approval-progress-estimate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eef2f8;
}

.approval-progress-route {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.approval-progress-route article {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.approval-progress-route .status {
  text-align: right;
}

.approval-progress-route .status strong.is-green { color: #12a86c; }
.approval-progress-route .status strong.is-orange { color: #f59e0b; }
.approval-progress-route .status strong.is-slate { color: #94a1b7; }

.approval-progress-message {
  width: 100%;
  margin-top: 16px;
}

.approval-progress-ai {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.approval-progress-ai div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 1240px) {
  .approval-submit-grid,
  .approval-progress-grid,
  .approval-success__grid,
  .approval-submit-bottom-grid,
  .approval-progress-profile {
    grid-template-columns: 1fr;
  }

  .approval-success__summary,
  .approval-success__route,
  .approval-submit-summary-grid,
  .approval-submit-docs__grid,
  .approval-submit-validation__list {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 920px) {
  .approval-submit-overlay {
    padding: 8px;
  }

  .approval-submit-head,
  .approval-progress-head,
  .approval-submit-grid,
  .approval-progress-grid,
  .approval-success {
    padding-left: 12px;
    padding-right: 12px;
  }

  .approval-submit-grid,
  .approval-progress-grid,
  .approval-success__grid,
  .approval-submit-bottom-grid,
  .approval-success__summary,
  .approval-success__route,
  .approval-submit-summary-grid,
  .approval-submit-docs__grid,
  .approval-submit-validation,
  .approval-submit-validation__list,
  .approval-submit-route-switch,
  .approval-progress-profile,
  .approval-progress-ring {
    grid-template-columns: 1fr;
  }

  .approval-submit-route-list article,
  .approval-progress-route article {
    grid-template-columns: auto auto minmax(0, 1fr);
  }

  .approval-submit-route-list .status,
  .approval-progress-route .status {
    grid-column: 2 / -1;
    text-align: left;
  }

  .approval-submit-foot,
  .approval-progress-head,
  .approval-submit-head,
  .approval-progress-head__meta {
    display: grid;
  }

  .approval-submit-foot__actions {
    flex-wrap: wrap;
  }
}
</style>
