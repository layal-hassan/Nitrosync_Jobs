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
    default: 'Michael Chen',
  },
  candidateRole: {
    type: String,
    default: 'Senior Software Engineer',
  },
})

const emit = defineEmits(['close'])

const summaryMeta = [
  ['Role', 'Senior Software Engineer', 'briefcase'],
  ['Department', 'Engineering', 'building'],
  ['Location', 'San Francisco, CA', 'mapPin'],
  ['Compensation', '$165,000 + Equity', 'wallet'],
]

const evidenceRows = [
  ['Assessments (4)', 'Technical, Coding, System Design, Behavioral', '92%', 'Strong'],
  ['Final Feedback (4)', 'All interviews completed', '96%', 'Strong'],
  ['Committee Consensus', 'Committee discussion summary', '94%', 'Strong'],
  ['AI Recommendation', 'Overall AI recommendation', '93%', 'Strong'],
  ['References', '2 of 2 completed', 'Completed', 'No Concerns'],
]

const timelineItems = [
  ['Apr 24, 10:30 AM', 'James Lee submitted the decision for committee approval', 'neutral'],
  ['Apr 24, 11:15 AM', 'Sarah Johnson approved', 'approved'],
  ['Apr 24, 11:20 AM', 'David Kim approved', 'approved'],
  ['Apr 24, 12:05 PM', 'Alex Turner requested changes', 'changes'],
  ['Pending', 'Priya Patel', 'pending'],
  ['Pending', 'Jennifer Park', 'pending'],
]

const voteRows = [
  ['Sarah Johnson', 'Engineering Manager', 'Required', 'Approved', 'The evidence is sufficient. Strong alignment with our needs.', 'Apr 24, 11:15 AM', 'approved'],
  ['David Kim', 'Senior Engineer', 'Required', 'Approved', 'Agree. Excellent technical depth and problem solving.', 'Apr 24, 11:20 AM', 'approved'],
  ['Priya Patel', 'Product Manager', 'Required', 'Pending', '—', '—', 'pending'],
  ['Jennifer Park', 'HR Business Partner', 'Required', 'Pending', '—', '—', 'pending'],
  ['Alex Turner', 'VP Engineering', 'Required (Final)', 'Requested Changes', 'Please complete reference checks before extending an offer.', 'Apr 24, 12:05 PM', 'changes'],
]

const comments = [
  ['Alex Turner', '12:05 PM', 'Please complete reference checks before extending an offer.'],
  ['Sarah Johnson', '11:15 AM', 'The evidence is sufficient. Strong alignment with our needs.'],
  ['David Kim', '11:20 AM', 'Agree. Excellent technical depth and problem solving.'],
]

const initials = computed(() => (
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

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
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
    <div v-if="open" class="committee-approval-overlay" @click.self="closeOverlay">
      <section class="committee-approval-modal">
        <header class="committee-approval-modal__head">
          <div class="committee-approval-modal__title">
            <button type="button" aria-label="Back" @click="closeOverlay">
              <AppIcon name="chevronLeft" :size="18" />
            </button>

            <span class="committee-approval-modal__title-icon">
              <AppIcon name="users" :size="19" />
            </span>

            <div>
              <div class="committee-approval-modal__title-row">
                <h2>Hiring Committee Approval</h2>
                <em>Validation Stage</em>
              </div>
              <p>Review the proposed hiring decision and provide your approval.</p>
            </div>
          </div>

          <button class="committee-approval-modal__close" type="button" aria-label="Close" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="committee-approval-modal__body">
          <aside class="committee-approval-sidebar">
            <article class="committee-candidate-card">
              <span class="committee-candidate-card__avatar">{{ initials }}</span>
              <strong>{{ candidateName }}</strong>
              <p>{{ candidateRole }}</p>
              <em>Validation Stage</em>
            </article>

            <article class="committee-card">
              <small>Decision Requested</small>
              <h3>Proceed to Offer</h3>

              <div class="committee-requested-by">
                <div class="committee-requested-by__avatar">JL</div>
                <div>
                  <strong>James Lee</strong>
                  <span>Recruiter</span>
                </div>
                <time>Apr 24, 2025<br>10:30 AM</time>
              </div>
            </article>

            <article class="committee-card">
              <small>Approval Progress</small>

              <div class="committee-progress-ring">
                <div class="committee-progress-ring__inner">
                  <strong>3 / 5</strong>
                  <span>Approved</span>
                </div>
              </div>

              <ul class="committee-progress-list">
                <li class="tone-green">3 Approved</li>
                <li class="tone-orange">1 Requested Changes</li>
                <li class="tone-muted">1 Pending</li>
              </ul>
            </article>

            <article class="committee-card">
              <small>Approval Settings</small>

              <dl class="committee-settings">
                <div><dt>Required Approvals</dt><dd>5</dd></div>
                <div><dt>Minimum Required</dt><dd>5 (100%)</dd></div>
                <div><dt>Decision Type</dt><dd>Majority</dd></div>
                <div><dt>Due Date</dt><dd>Apr 28, 2025</dd></div>
              </dl>
            </article>
          </aside>

          <main class="committee-approval-main">
            <section class="committee-panel">
              <div class="committee-panel__title">
                <span><AppIcon name="clipboard-check" :size="17" /></span>
                <h3>Decision Summary</h3>
              </div>

              <p>
                Michael has demonstrated strong technical expertise, problem-solving ability, and leadership potential.
                The committee agrees the evidence supports extending an offer. Reference checks are the only remaining
                outstanding item.
              </p>

              <div class="committee-summary-meta">
                <div v-for="item in summaryMeta" :key="item[0]" class="committee-summary-meta__item">
                  <span><AppIcon :name="item[2]" :size="18" /></span>
                  <div>
                    <small>{{ item[0] }}</small>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section class="committee-panel">
              <div class="committee-panel__title">
                <span><AppIcon name="trend-up" :size="17" /></span>
                <h3>Supporting Evidence</h3>
              </div>

              <div class="committee-evidence-list">
                <article v-for="row in evidenceRows" :key="row[0]" class="committee-evidence-row">
                  <div class="committee-evidence-row__identity">
                    <span><AppIcon :name="row[0].includes('AI') ? 'spark' : row[0].includes('Reference') ? 'document' : 'message'" :size="16" /></span>
                    <div>
                      <strong>{{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                    </div>
                  </div>

                  <div class="committee-evidence-row__score">
                    <strong>{{ row[2] }}</strong>
                    <small>{{ row[3] }}</small>
                  </div>

                  <button type="button">View Details</button>
                </article>
              </div>
            </section>

            <section class="committee-panel">
              <h3>Committee Votes</h3>

              <div class="committee-votes-table">
                <div class="committee-votes-table__head">
                  <span>Member</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Vote</span>
                  <span>Comment</span>
                  <span>Voted At</span>
                </div>

                <article v-for="row in voteRows" :key="row[0]" class="committee-votes-row">
                  <div class="committee-votes-row__member">
                    <span>{{ row[0].split(' ').map((part) => part[0]).slice(0, 2).join('') }}</span>
                    <div>
                      <strong>{{ row[0] }}</strong>
                      <small>{{ row[1] }}</small>
                    </div>
                  </div>
                  <span class="committee-votes-row__role">{{ row[2] }}</span>
                  <span class="committee-votes-row__status" :class="`tone-${row[6]}`">{{ row[3] }}</span>
                  <span class="committee-votes-row__vote">
                    <AppIcon :name="row[6] === 'approved' ? 'checkCircle' : row[6] === 'changes' ? 'alert' : 'clock'" :size="16" />
                  </span>
                  <p class="committee-votes-row__comment">{{ row[4] }}</p>
                  <span class="committee-votes-row__time">{{ row[5] }}</span>
                </article>
              </div>

              <div class="committee-alert">
                <AppIcon name="alert" :size="16" />
                <div>
                  <strong>Your vote is required</strong>
                  <p>Please review the decision summary and supporting evidence before casting your vote.</p>
                </div>
              </div>
            </section>

            <footer class="committee-actions">
              <button type="button" class="committee-actions__button tone-green">
                <AppIcon name="checkCircle" :size="18" />
                <div><strong>Approve</strong><span>I approve this decision</span></div>
              </button>
              <button type="button" class="committee-actions__button tone-orange">
                <AppIcon name="refresh" :size="18" />
                <div><strong>Request Changes</strong><span>Request committee to revisit</span></div>
              </button>
              <button type="button" class="committee-actions__button tone-red">
                <AppIcon name="close" :size="18" />
                <div><strong>Reject</strong><span>I do not approve this decision</span></div>
              </button>
              <article class="committee-actions__note">
                <AppIcon name="spark" :size="18" />
                <p>All required approvals must be received before moving the candidate to Offer.</p>
              </article>
            </footer>
          </main>

          <aside class="committee-approval-rail">
            <section class="committee-rail-card">
              <h3>Approval Timeline</h3>
              <div class="committee-timeline">
                <article v-for="item in timelineItems" :key="`${item[0]}-${item[1]}`" class="committee-timeline__item">
                  <i :class="`tone-${item[2]}`" />
                  <div>
                    <small>{{ item[0] }}</small>
                    <strong>{{ item[1] }}</strong>
                  </div>
                </article>
              </div>
            </section>

            <section class="committee-rail-card committee-rail-card--comments">
              <h3>Comments</h3>
              <div class="committee-comments">
                <article v-for="item in comments" :key="`${item[0]}-${item[1]}`" class="committee-comment">
                  <header>
                    <span>{{ item[0].split(' ').map((part) => part[0]).slice(0, 2).join('') }}</span>
                    <div>
                      <strong>{{ item[0] }}</strong>
                      <small>{{ item[1] }}</small>
                    </div>
                  </header>
                  <p>{{ item[2] }}</p>
                </article>
              </div>

              <div class="committee-comment-input">
                <input type="text" placeholder="Add a private comment..." />
                <button type="button" aria-label="Send comment">
                  <AppIcon name="spark" :size="15" />
                </button>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.committee-approval-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(71, 85, 105, 0.32);
  backdrop-filter: blur(7px);
}

.committee-approval-modal {
  width: min(1270px, 100%);
  max-height: calc(100vh - 32px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.committee-approval-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 22px;
  border-bottom: 1px solid #e8eef7;
}

.committee-approval-modal__title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.committee-approval-modal__title > button,
.committee-approval-modal__close {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #8ea0be;
  cursor: pointer;
}

.committee-approval-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eff3ff;
  color: #5a67f2;
}

.committee-approval-modal__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.committee-approval-modal__title-row h2,
.committee-panel h3,
.committee-rail-card h3 {
  margin: 0;
  font-size: 1.22rem;
  font-weight: 800;
  color: #1f2a44;
}

.committee-approval-modal__title-row em {
  padding: 5px 10px;
  border-radius: 999px;
  background: #eef1ff;
  color: #5a67f2;
  font-style: normal;
  font-size: 0.73rem;
  font-weight: 800;
  text-transform: uppercase;
}

.committee-approval-modal__title p {
  margin: 2px 0 0;
  color: #7183a6;
}

.committee-approval-modal__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: 252px minmax(0, 1fr) 290px;
}

.committee-approval-sidebar,
.committee-approval-rail {
  background: #fbfcff;
}

.committee-approval-sidebar {
  padding: 18px;
  border-right: 1px solid #e8eef7;
}

.committee-approval-rail {
  padding: 18px;
  border-left: 1px solid #e8eef7;
}

.committee-approval-main {
  padding: 18px;
}

.committee-candidate-card,
.committee-card,
.committee-panel,
.committee-rail-card {
  border: 1px solid #dfe7f5;
  border-radius: 18px;
  background: #ffffff;
}

.committee-candidate-card {
  padding: 22px 18px;
  text-align: center;
}

.committee-candidate-card__avatar {
  width: 68px;
  height: 68px;
  margin: 0 auto 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1c27d 0%, #c77d36 100%);
  color: #ffffff;
  font-size: 1.65rem;
  font-weight: 800;
}

.committee-candidate-card strong {
  display: block;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1f2a44;
}

.committee-candidate-card p {
  margin: 6px 0 10px;
  color: #7183a6;
}

.committee-candidate-card em {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: #d7f7e8;
  color: #16a34a;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.committee-card {
  margin-top: 14px;
  padding: 18px;
}

.committee-card > small,
.committee-summary-meta__item small,
.committee-settings dt,
.committee-votes-table__head,
.committee-timeline__item small {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #9aa8c2;
  text-transform: uppercase;
}

.committee-card h3 {
  margin: 10px 0 0;
  font-size: 1.8rem;
  line-height: 1.15;
  color: #16a34a;
}

.committee-requested-by {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.committee-requested-by__avatar {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eff3ff;
  color: #5a67f2;
  font-weight: 800;
}

.committee-requested-by strong,
.committee-settings dd,
.committee-evidence-row__identity strong,
.committee-votes-row__member strong,
.committee-timeline__item strong,
.committee-comment strong {
  display: block;
  font-weight: 800;
  color: #1f2a44;
}

.committee-requested-by span,
.committee-evidence-row__identity small,
.committee-votes-row__member small,
.committee-comment small,
.committee-comment p,
.committee-card p,
.committee-evidence-row__score small,
.committee-votes-row__role,
.committee-votes-row__time,
.committee-panel p {
  color: #7183a6;
}

.committee-requested-by time {
  grid-column: 2;
  font-style: normal;
  text-align: left;
  color: #94a3bd;
  line-height: 1.45;
  font-size: 0.9rem;
}

.committee-progress-ring {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.committee-progress-ring__inner {
  width: 132px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #ffffff 58%, transparent 59%),
    conic-gradient(#ef5da8 0 216deg, #f59e0b 216deg 288deg, #e5ecf7 288deg 360deg);
  display: grid;
  place-items: center;
  text-align: center;
}

.committee-progress-ring__inner strong {
  display: block;
  font-size: 1.9rem;
  font-weight: 800;
  color: #1f2a44;
}

.committee-progress-ring__inner span {
  display: block;
  margin-top: 4px;
  color: #7183a6;
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 800;
}

.committee-progress-list {
  margin: 16px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.committee-settings {
  margin: 14px 0 0;
}

.committee-settings > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
}

.committee-settings > div + div {
  margin-top: 10px;
}

.committee-settings dt {
  line-height: 1.35;
}

.committee-settings dd {
  margin: 0;
  text-align: right;
  line-height: 1.35;
  white-space: nowrap;
}

.committee-panel + .committee-panel {
  margin-top: 16px;
}

.committee-panel {
  padding: 18px;
}

.committee-panel__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.committee-panel__title span,
.committee-summary-meta__item span,
.committee-evidence-row__identity span {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f3f6ff;
  color: #5a67f2;
  flex-shrink: 0;
}

.committee-summary-meta {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 12px;
  border: 1px solid #edf2f9;
  border-radius: 16px;
  background: #fbfcff;
}

.committee-summary-meta__item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.committee-summary-meta__item strong {
  display: block;
  margin-top: 2px;
  color: #1f2a44;
}

.committee-evidence-list {
  margin-top: 14px;
}

.committee-evidence-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px 118px;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
}

.committee-evidence-row + .committee-evidence-row {
  border-top: 1px solid #edf2f9;
}

.committee-evidence-row__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.committee-evidence-row__score {
  text-align: center;
}

.committee-evidence-row__score strong {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2a44;
}

.committee-evidence-row__score small {
  display: block;
  margin-top: 3px;
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 800;
  color: #16a34a;
}

.committee-evidence-row button {
  width: 118px;
  height: 34px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #ffffff;
  color: #5a67f2;
  font-size: 0.88rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.committee-votes-table {
  margin-top: 14px;
  border: 1px solid #edf2f9;
  border-radius: 16px;
  overflow: hidden;
}

.committee-votes-table__head,
.committee-votes-row {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) 90px 120px 52px minmax(150px, 1.1fr) 110px;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
}

.committee-votes-table__head {
  background: #fbfcff;
  border-bottom: 1px solid #edf2f9;
}

.committee-votes-row + .committee-votes-row {
  border-top: 1px solid #edf2f9;
}

.committee-votes-row__member {
  display: flex;
  align-items: center;
  gap: 10px;
}

.committee-votes-row__member > span {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f6d598 0%, #b7782e 100%);
  color: #ffffff;
  font-weight: 800;
  flex-shrink: 0;
}

.committee-votes-row__status {
  font-weight: 800;
}

.committee-votes-row__vote {
  color: #5a67f2;
}

.committee-votes-row__comment {
  margin: 0;
  line-height: 1.55;
}

.committee-alert {
  margin-top: 16px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid rgba(249, 115, 22, 0.22);
  background: #fff8f2;
  color: #f97316;
}

.committee-alert strong {
  display: block;
}

.committee-alert p {
  margin: 4px 0 0;
}

.committee-actions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.committee-actions__button,
.committee-actions__note {
  min-height: 112px;
  border-radius: 18px;
}

.committee-actions__button {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.committee-actions__button strong {
  display: block;
  font-size: 1.05rem;
  font-weight: 800;
}

.committee-actions__button span,
.committee-actions__note p {
  display: block;
  margin-top: 4px;
  color: inherit;
  opacity: 0.92;
}

.committee-actions__button.tone-green {
  background: #effcf4;
  color: #16a34a;
}

.committee-actions__button.tone-orange {
  background: #fff8f2;
  color: #f97316;
}

.committee-actions__button.tone-red {
  background: #fff7f8;
  color: #ef4444;
}

.committee-actions__note {
  padding: 18px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #dfe4fb;
  background: #f5f7ff;
  color: #5a67f2;
}

.committee-rail-card {
  padding: 18px;
}

.committee-rail-card + .committee-rail-card {
  margin-top: 16px;
}

.committee-timeline {
  margin-top: 14px;
  display: grid;
  gap: 14px;
}

.committee-timeline__item {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.committee-timeline__item i {
  width: 10px;
  height: 10px;
  margin-top: 5px;
  border-radius: 50%;
  background: #cfd8e6;
}

.committee-comments {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.committee-comment {
  padding: 14px;
  border-radius: 14px;
  background: #f7f9ff;
}

.committee-comment header {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
}

.committee-comment header > span {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1c27d 0%, #c77d36 100%);
  color: #ffffff;
  font-weight: 800;
}

.committee-comment p {
  margin: 10px 0 0;
  line-height: 1.6;
}

.committee-comment-input {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 10px;
}

.committee-comment-input input {
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  outline: none;
}

.committee-comment-input button {
  border: none;
  border-radius: 12px;
  background: #f6e5f0;
  color: #ef5da8;
  cursor: pointer;
}

.tone-approved,
.tone-green {
  color: #16a34a;
}

.tone-changes,
.tone-orange {
  color: #f97316;
}

.tone-pending,
.tone-muted {
  color: #94a3bd;
}

.tone-neutral {
  color: #cbd5e1;
}

@media (max-width: 1280px) {
  .committee-approval-modal__body {
    grid-template-columns: 252px minmax(0, 1fr);
  }

  .committee-approval-rail {
    grid-column: 1 / -1;
    border-left: none;
    border-top: 1px solid #e8eef7;
  }
}

@media (max-width: 1024px) {
  .committee-approval-modal__body {
    grid-template-columns: 1fr;
  }

  .committee-approval-sidebar {
    border-right: none;
    border-bottom: 1px solid #e8eef7;
  }

  .committee-summary-meta,
  .committee-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .committee-votes-table__head,
  .committee-votes-row {
    grid-template-columns: minmax(160px, 1.4fr) 90px 120px 52px minmax(140px, 1fr) 110px;
  }
}

@media (max-width: 720px) {
  .committee-approval-overlay {
    padding: 8px;
  }

  .committee-approval-modal {
    max-height: calc(100vh - 16px);
    border-radius: 18px;
  }

  .committee-approval-modal__head,
  .committee-approval-sidebar,
  .committee-approval-main,
  .committee-approval-rail {
    padding: 14px;
  }

  .committee-approval-modal__title {
    align-items: flex-start;
  }

  .committee-approval-modal__title-row {
    flex-wrap: wrap;
  }

  .committee-summary-meta,
  .committee-actions {
    grid-template-columns: 1fr;
  }

  .committee-evidence-row,
  .committee-votes-table__head,
  .committee-votes-row {
    grid-template-columns: 1fr;
  }

  .committee-votes-table__head {
    display: none;
  }
}
</style>
