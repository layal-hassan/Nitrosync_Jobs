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
    default: 'Priya Mehta',
  },
  candidateRole: {
    type: String,
    default: 'Recruiter',
  },
  reviewerCount: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['close'])

const isMultiReviewer = computed(() => props.reviewerCount > 1)

const singleMetricCards = [
  {
    title: 'Calibration Status',
    value: 'In Progress',
    note: 'Waiting for more evaluations',
    tone: 'pink',
  },
  {
    title: 'Evaluations Completed',
    value: '1 / 3',
    note: '2 / 3 completed',
    tone: 'slate',
  },
  {
    title: 'Interviews Completed',
    value: '1 of 3',
    note: 'Recruiter Screen',
    tone: 'slate',
  },
  {
    title: 'Score Variance So Far',
    value: 'N/A',
    note: 'Need 2+ evaluations',
    tone: 'violet',
  },
]

const calibrationPoints = [
  'Available after 2+ evaluations',
  'Highlights score variance by competency',
  'AI explains why differences exist',
  'Helps you align before making a decision',
]

const readinessStages = [
  {
    title: 'Recruiter Screen',
    meta: 'Completed',
    submeta: 'May 3, 2025',
    state: 'done',
  },
  {
    title: 'Technical Interview',
    meta: 'Pending',
    submeta: 'Not completed yet',
    state: 'current',
  },
  {
    title: 'Hiring Manager Interview',
    meta: 'Pending',
    submeta: 'Not compared yet',
    state: 'pending',
  },
]

const strengths = ['Technical Skills', 'Problem Solving', 'Communication']

const nextSteps = [
  {
    icon: 'users',
    title: '1. More evaluations',
    copy: 'Once at least two evaluations are completed, we will analyze alignment across interviewers.',
    tone: 'violet',
  },
  {
    icon: 'chart-bars',
    title: '2. Detect variance',
    copy: 'We will highlight competencies with score differences and surface key areas to review.',
    tone: 'green',
  },
  {
    icon: 'document',
    title: '3. Take action',
    copy: 'Review insights, discuss as a team, and decide on next steps before moving forward.',
    tone: 'orange',
  },
]

const singleActionItems = [
  { label: 'Notify Interviewers', sublabel: 'Send reminder to pending interviewers', icon: 'mail' },
  { label: 'View Interview Plan', sublabel: 'See remaining interviews', icon: 'calendar' },
  { label: 'View Candidate Profile', sublabel: 'Open candidate details', icon: 'eye' },
  { label: 'Go to Scorecards', sublabel: 'View all submitted scorecards', icon: 'clipboard-check' },
]

const multiMetricCards = [
  {
    title: 'Calibration Status',
    value: 'Active',
    note: 'Decision pending',
    tone: 'green',
  },
  {
    title: 'Overall Hiring Signal',
    value: '84%',
    note: 'Strong with minor variance',
    tone: 'pink',
  },
  {
    title: 'Decision Status',
    value: 'Waiting for Calibration',
    note: '1 review pending',
    tone: 'amber',
  },
  {
    title: 'Last Updated',
    value: 'May 5, 2025',
    note: 'Auto-synced 10:05 AM',
    tone: 'slate',
  },
]

const reviewerProgress = [
  {
    name: 'Sarah Johnson',
    role: 'UX Designer',
    stage: 'Recruiter Screen',
    status: 'Completed',
    statusTone: 'green',
    summary: '4.8 / 5',
    summaryNote: 'Strong signal',
    confidence: 'High',
    confidenceTone: 'green',
    action: 'View Scorecard',
    actionTone: 'violet',
  },
  {
    name: 'Alex Nguyen',
    role: 'Engineering Lead',
    stage: 'Technical Interview',
    status: 'Completed',
    statusTone: 'green',
    summary: '3.4 / 5',
    summaryNote: 'Needs discussion',
    confidence: 'High',
    confidenceTone: 'green',
    action: 'View Scorecard',
    actionTone: 'violet',
  },
  {
    name: 'David Kim',
    role: 'VP',
    stage: 'Hiring Manager Interview',
    status: 'Pending',
    statusTone: 'amber',
    summary: 'May 5, 2025',
    summaryNote: 'Scheduled',
    confidence: '-',
    confidenceTone: 'slate',
    action: 'Send Reminder',
    actionTone: 'amber',
  },
  {
    name: 'Emma Brown',
    role: 'Product Director',
    stage: 'Final Interview',
    status: 'Not Started',
    statusTone: 'slate',
    summary: 'May 7, 2025',
    summaryNote: 'Awaiting kickoff',
    confidence: '-',
    confidenceTone: 'slate',
    action: 'Notify Reviewer',
    actionTone: 'pink',
  },
]

const actionRequired = [
  {
    label: 'Pending review',
    owner: 'David Kim',
    detail: 'Hiring Manager Interview',
    meta: 'Due today',
  },
  {
    label: 'Variance detected',
    owner: 'Sarah vs Alex',
    detail: 'Communication and leadership',
    meta: '42% mismatch',
  },
]

const recommendations = [
  {
    title: 'Request clarification from David Chen',
    copy: 'Ask for a final recommendation before calibration wraps.',
  },
  {
    title: 'Schedule calibration sync',
    copy: 'Communication and leadership need live discussion.',
  },
]

const quickActions = [
  'View all scorecards',
  'Schedule calibration meeting',
  'Add calibration note',
  'Move to decision',
]

const competencyAlignment = [
  {
    label: 'Technical Skills',
    score: 92,
    agreement: 'Strong',
    agreementTone: 'green',
    note: 'Minor variance',
  },
  {
    label: 'Problem Solving',
    score: 88,
    agreement: 'Strong',
    agreementTone: 'green',
    note: 'Aligned',
  },
  {
    label: 'Ownership',
    score: 71,
    agreement: 'Moderate',
    agreementTone: 'amber',
    note: 'Needs review',
  },
  {
    label: 'Communication',
    score: 43,
    agreement: 'High variance',
    agreementTone: 'red',
    note: 'Discuss live',
  },
]

const varianceBreakdown = [
  { label: 'Sarah Johnson', value: 5.0, tone: 'pink' },
  { label: 'Alex Nguyen', value: 4.2, tone: 'amber' },
  { label: 'David Kim', value: 3.0, tone: 'slate' },
]

const agreementAreas = [
  'Technical skills are consistently above bar.',
  'Problem solving shows strong signal across interviews.',
]

const disagreementAreas = [
  'Communication appears uneven between structured and live rounds.',
  'Leadership signal is incomplete until the hiring manager review lands.',
]

function closeOverlay() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="reviewer-calibration-overlay" @click.self="closeOverlay">
      <section class="reviewer-calibration-modal" :class="{ 'is-multi': isMultiReviewer }">
        <header class="reviewer-calibration__head">
          <div class="reviewer-calibration__title-block">
            <div class="reviewer-calibration__crumbs">
              <span>Assessment</span>
              <span>/</span>
              <strong>Reviewer Calibration</strong>
            </div>
            <div class="reviewer-calibration__title-row">
              <h2>Reviewer Calibration</h2>
              <AppIcon name="info" :size="15" />
            </div>
            <p v-if="isMultiReviewer">
              Compare interviewer signals, surface variance, and decide what needs follow-up before moving this candidate forward.
            </p>
            <p v-else>
              Monitor evaluation alignment as interviews are completed. Calibration becomes available after 2 or more evaluations.
            </p>
          </div>

          <div class="reviewer-calibration__head-actions">
            <button type="button">
              <AppIcon name="document" :size="14" />
              <span>Export Report</span>
            </button>
            <button type="button">
              <AppIcon name="share" :size="14" />
              <span>Share</span>
            </button>
            <button class="reviewer-calibration__icon-button" type="button">
              <AppIcon name="more" :size="16" />
            </button>
            <button class="reviewer-calibration__icon-button" type="button" aria-label="Close reviewer calibration" @click="closeOverlay">
              <AppIcon name="close" :size="17" />
            </button>
          </div>
        </header>

        <div class="reviewer-calibration__body">
          <section v-if="isMultiReviewer" class="reviewer-calibration__content-grid">
            <div class="reviewer-calibration__main-column">
              <div class="reviewer-calibration__metric-grid">
                <article
                  v-for="card in multiMetricCards"
                  :key="card.title"
                  class="reviewer-calibration__metric-card"
                  :class="`tone-${card.tone}`"
                >
                  <small>{{ card.title }}</small>
                  <strong>{{ card.value }}</strong>
                  <span>{{ card.note }}</span>
                </article>
              </div>

              <article class="reviewer-calibration__panel">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Reviewer Progress</h3>
                    <p>Track submitted reviews and take the next calibration action.</p>
                  </div>

                  <div class="reviewer-calibration__panel-controls">
                    <button type="button">All Interviews</button>
                    <button class="is-accent" type="button">Send Bulk Reminder</button>
                  </div>
                </div>

                <div class="reviewer-calibration__table">
                  <div class="reviewer-calibration__table-head">
                    <span>Reviewer</span>
                    <span>Stage</span>
                    <span>Status</span>
                    <span>Summary</span>
                    <span>Confidence</span>
                    <span>Action</span>
                  </div>

                  <article
                    v-for="review in reviewerProgress"
                    :key="`${review.name}-${review.stage}`"
                    class="reviewer-calibration__table-row"
                  >
                    <div class="reviewer-calibration__reviewer">
                      <span class="reviewer-calibration__avatar">{{ review.name.split(' ').map((part) => part[0]).join('').slice(0, 2) }}</span>
                      <div>
                        <strong>{{ review.name }}</strong>
                        <small>{{ review.role }}</small>
                      </div>
                    </div>

                    <div class="reviewer-calibration__cell-stack">
                      <strong>{{ review.stage }}</strong>
                    </div>

                    <div class="reviewer-calibration__cell-stack">
                      <span class="reviewer-calibration__pill" :class="`tone-${review.statusTone}`">{{ review.status }}</span>
                    </div>

                    <div class="reviewer-calibration__cell-stack">
                      <strong>{{ review.summary }}</strong>
                      <small>{{ review.summaryNote }}</small>
                    </div>

                    <div class="reviewer-calibration__cell-stack">
                      <span class="reviewer-calibration__confidence" :class="`tone-${review.confidenceTone}`">{{ review.confidence }}</span>
                    </div>

                    <div class="reviewer-calibration__cell-action">
                      <button type="button" :class="`tone-${review.actionTone}`">{{ review.action }}</button>
                    </div>
                  </article>
                </div>
              </article>

              <div class="reviewer-calibration__insights-grid">
                <article class="reviewer-calibration__panel">
                  <div class="reviewer-calibration__panel-head">
                    <div>
                      <h3>Alignment By Competency</h3>
                      <p>See where reviewers agree and where calibration is required.</p>
                    </div>
                  </div>

                  <div class="reviewer-calibration__competency-list">
                    <article
                      v-for="item in competencyAlignment"
                      :key="item.label"
                      class="reviewer-calibration__competency-row"
                    >
                      <div class="reviewer-calibration__competency-meta">
                        <strong>{{ item.label }}</strong>
                        <small>{{ item.note }}</small>
                      </div>

                      <div class="reviewer-calibration__competency-bar">
                        <span :style="{ width: `${item.score}%` }" :class="`tone-${item.agreementTone}`" />
                      </div>

                      <span class="reviewer-calibration__competency-score">{{ item.score }}%</span>
                      <span class="reviewer-calibration__confidence" :class="`tone-${item.agreementTone}`">{{ item.agreement }}</span>
                    </article>
                  </div>
                </article>

                <article class="reviewer-calibration__panel">
                  <div class="reviewer-calibration__panel-head">
                    <div>
                      <h3>Communication Variance</h3>
                      <p>Wide spread means the team saw different signals in the same competency.</p>
                    </div>
                  </div>

                  <div class="reviewer-calibration__variance-score">
                    <strong>42%</strong>
                    <span>High variance</span>
                  </div>

                  <div class="reviewer-calibration__variance-list">
                    <article
                      v-for="item in varianceBreakdown"
                      :key="item.label"
                      class="reviewer-calibration__variance-row"
                    >
                      <div>
                        <strong>{{ item.label }}</strong>
                        <small>Communication score</small>
                      </div>
                      <span class="reviewer-calibration__variance-value" :class="`tone-${item.tone}`">{{ item.value.toFixed(1) }}</span>
                    </article>
                  </div>

                  <div class="reviewer-calibration__ai-note">
                    <span class="reviewer-calibration__ai-note-icon">
                      <AppIcon name="sparkles" :size="15" />
                    </span>
                    <p>Live panel interviews rated communication lower than the recruiter screen. Review examples before deciding.</p>
                  </div>
                </article>
              </div>

              <article class="reviewer-calibration__panel">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Areas Of Agreement & Disagreement</h3>
                    <p>Quick summary of what is already aligned and what still needs calibration.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__agreement-grid">
                  <div class="reviewer-calibration__agreement-card tone-green">
                    <strong>What they agree on</strong>
                    <ul>
                      <li v-for="item in agreementAreas" :key="item">{{ item }}</li>
                    </ul>
                  </div>

                  <div class="reviewer-calibration__agreement-card tone-red">
                    <strong>What they disagree on</strong>
                    <ul>
                      <li v-for="item in disagreementAreas" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </article>
            </div>

            <aside class="reviewer-calibration__side-column">
              <article class="reviewer-calibration__panel reviewer-calibration__panel--compact">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Action Required</h3>
                    <p>Immediate blockers before a final decision.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__stack-list">
                  <article
                    v-for="item in actionRequired"
                    :key="`${item.label}-${item.owner}`"
                    class="reviewer-calibration__stack-item"
                  >
                    <span class="reviewer-calibration__stack-icon tone-amber">
                      <AppIcon name="info" :size="14" />
                    </span>
                    <div>
                      <strong>{{ item.label }}</strong>
                      <small>{{ item.owner }}</small>
                      <p>{{ item.detail }}</p>
                    </div>
                    <em>{{ item.meta }}</em>
                  </article>
                </div>
              </article>

              <article class="reviewer-calibration__panel reviewer-calibration__panel--compact">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>AI Recommendations</h3>
                    <p>Suggested follow-ups based on current signal spread.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__stack-list">
                  <article
                    v-for="item in recommendations"
                    :key="item.title"
                    class="reviewer-calibration__recommendation"
                  >
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.copy }}</p>
                    <button type="button">Take Action</button>
                  </article>
                </div>
              </article>

              <article class="reviewer-calibration__panel reviewer-calibration__panel--compact">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Quick Actions</h3>
                    <p>Move directly to the next task.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__quick-actions">
                  <button
                    v-for="item in quickActions"
                    :key="item"
                    type="button"
                    class="reviewer-calibration__quick-action"
                  >
                    <span>{{ item }}</span>
                    <AppIcon name="chevronRight" :size="15" />
                  </button>
                </div>
              </article>
            </aside>
          </section>

          <section v-else class="reviewer-calibration__single-grid">
            <div class="reviewer-calibration__main-column">
              <div class="reviewer-calibration__metric-grid">
                <article
                  v-for="card in singleMetricCards"
                  :key="card.title"
                  class="reviewer-calibration__metric-card"
                  :class="`tone-${card.tone}`"
                >
                  <small>{{ card.title }}</small>
                  <strong>{{ card.value }}</strong>
                  <span>{{ card.note }}</span>
                </article>
              </div>

              <article class="reviewer-calibration__panel">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Calibration Readiness</h3>
                    <p>Calibration insights will be generated once at least two evaluations are submitted.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__timeline">
                  <article
                    v-for="(stage, index) in readinessStages"
                    :key="stage.title"
                    class="reviewer-calibration__timeline-item"
                    :class="`is-${stage.state}`"
                  >
                    <span class="reviewer-calibration__timeline-node">
                      <AppIcon v-if="stage.state === 'done'" name="check" :size="12" />
                      <span v-else>{{ index + 1 }}</span>
                    </span>
                    <div>
                      <strong>{{ stage.title }}</strong>
                      <small>{{ stage.meta }}</small>
                      <em>{{ stage.submeta }}</em>
                    </div>
                  </article>
                </div>

                <div class="reviewer-calibration__subsection-label">Completed Evaluation</div>

                <article class="reviewer-calibration__evaluation-card">
                  <div class="reviewer-calibration__evaluation-person">
                    <span class="reviewer-calibration__avatar reviewer-calibration__avatar--candidate">PM</span>
                    <div>
                      <strong>{{ candidateName }}</strong>
                      <small>{{ candidateRole }}</small>
                      <em>Completed on May 3, 2025</em>
                    </div>
                  </div>

                  <div class="reviewer-calibration__evaluation-score">
                    <small>Overall Score</small>
                    <strong>4.7 / 5</strong>
                  </div>

                  <div class="reviewer-calibration__evaluation-tags">
                    <small>Top Strengths</small>
                    <div class="reviewer-calibration__evaluation-tags-body">
                      <ul>
                        <li v-for="item in strengths" :key="item">{{ item }}</li>
                      </ul>
                      <button type="button">View Scorecard</button>
                    </div>
                  </div>
                </article>
              </article>

              <article class="reviewer-calibration__panel">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>What Happens Next?</h3>
                    <p>Calibration activates after the second submitted evaluation.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__steps-grid">
                  <article
                    v-for="step in nextSteps"
                    :key="step.title"
                    class="reviewer-calibration__step-card"
                    :class="`tone-${step.tone}`"
                  >
                    <span class="reviewer-calibration__step-icon">
                      <AppIcon :name="step.icon" :size="16" />
                    </span>
                    <strong>{{ step.title }}</strong>
                    <p>{{ step.copy }}</p>
                  </article>
                </div>
              </article>
            </div>

            <aside class="reviewer-calibration__side-column">
              <article class="reviewer-calibration__panel reviewer-calibration__panel--compact">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>About Calibration</h3>
                    <p>Calibration helps ensure fair and consistent evaluations by identifying differences in scoring and feedback.</p>
                  </div>
                </div>

                <ul class="reviewer-calibration__about-list">
                  <li v-for="point in calibrationPoints" :key="point">{{ point }}</li>
                </ul>
              </article>

              <article class="reviewer-calibration__panel reviewer-calibration__single-ai-card">
                <span class="reviewer-calibration__ai-note-icon">
                  <AppIcon name="sparkles" :size="15" />
                </span>
                <strong>AI Insight (Preview)</strong>
                <p>Complete one more evaluation to get early alignment insights and variance analysis.</p>
                <button type="button">View Preview Example</button>
              </article>

              <article class="reviewer-calibration__panel reviewer-calibration__panel--compact">
                <div class="reviewer-calibration__panel-head">
                  <div>
                    <h3>Actions</h3>
                    <p>Move to the next assessment task.</p>
                  </div>
                </div>

                <div class="reviewer-calibration__single-actions">
                  <button
                    v-for="item in singleActionItems"
                    :key="item.label"
                    type="button"
                    class="reviewer-calibration__action-row"
                  >
                    <span class="reviewer-calibration__stack-icon tone-pink">
                      <AppIcon :name="item.icon" :size="15" />
                    </span>
                    <div>
                      <strong>{{ item.label }}</strong>
                      <small>{{ item.sublabel }}</small>
                    </div>
                    <AppIcon name="chevronRight" :size="15" />
                  </button>
                </div>
              </article>
            </aside>
          </section>
        </div>

        <footer class="reviewer-calibration__footer">
          <button class="reviewer-calibration__button reviewer-calibration__button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="reviewer-calibration__button reviewer-calibration__button--primary" type="button">Done</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.reviewer-calibration-overlay {
  position: fixed;
  inset: 0;
  z-index: 1470;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 28, 42, 0.44);
  backdrop-filter: blur(5px);
}

.reviewer-calibration-modal {
  width: min(100%, 1160px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e5ebf5;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
}

.reviewer-calibration-modal.is-multi {
  width: min(100%, 1320px);
}

.reviewer-calibration__head,
.reviewer-calibration__head-actions,
.reviewer-calibration__title-row,
.reviewer-calibration__panel-head,
.reviewer-calibration__footer,
.reviewer-calibration__reviewer,
.reviewer-calibration__table-row,
.reviewer-calibration__stack-item,
.reviewer-calibration__quick-action,
.reviewer-calibration__agreement-grid,
.reviewer-calibration__competency-row,
.reviewer-calibration__variance-row,
.reviewer-calibration__evaluation-person,
.reviewer-calibration__evaluation-tags,
.reviewer-calibration__action-row {
  display: flex;
}

.reviewer-calibration__head,
.reviewer-calibration__footer {
  justify-content: space-between;
  align-items: flex-start;
}

.reviewer-calibration__head {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #edf2f8;
}

.reviewer-calibration__crumbs {
  display: flex;
  gap: 6px;
  color: #9aa5b7;
  font-size: 0.72rem;
  font-weight: 700;
}

.reviewer-calibration__crumbs strong {
  color: #f06db8;
}

.reviewer-calibration__title-row {
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.reviewer-calibration__title-row h2,
.reviewer-calibration__panel-head h3,
.reviewer-calibration__reviewer strong,
.reviewer-calibration__cell-stack strong,
.reviewer-calibration__agreement-card strong,
.reviewer-calibration__stack-item strong,
.reviewer-calibration__recommendation strong,
.reviewer-calibration__quick-action span,
.reviewer-calibration__competency-meta strong,
.reviewer-calibration__variance-row strong,
.reviewer-calibration__timeline-item strong,
.reviewer-calibration__evaluation-person strong,
.reviewer-calibration__step-card strong,
.reviewer-calibration__action-row strong {
  margin: 0;
  color: #20283d;
}

.reviewer-calibration__title-row h2 {
  font-size: 1.35rem;
  font-weight: 800;
}

.reviewer-calibration__title-row :deep(svg) {
  color: #8a96ad;
}

.reviewer-calibration__title-block p,
.reviewer-calibration__panel-head p,
.reviewer-calibration__reviewer small,
.reviewer-calibration__cell-stack small,
.reviewer-calibration__stack-item small,
.reviewer-calibration__stack-item p,
.reviewer-calibration__recommendation p,
.reviewer-calibration__agreement-card li,
.reviewer-calibration__ai-note p,
.reviewer-calibration__competency-meta small,
.reviewer-calibration__variance-row small,
.reviewer-calibration__timeline-item small,
.reviewer-calibration__timeline-item em,
.reviewer-calibration__evaluation-person small,
.reviewer-calibration__evaluation-person em,
.reviewer-calibration__step-card p,
.reviewer-calibration__action-row small {
  margin: 0;
  color: #7b879e;
}

.reviewer-calibration__title-block p {
  margin-top: 4px;
  font-size: 0.9rem;
  max-width: 760px;
}

.reviewer-calibration__head-actions {
  gap: 10px;
  align-items: center;
}

.reviewer-calibration__head-actions button,
.reviewer-calibration__panel-controls button,
.reviewer-calibration__cell-action button,
.reviewer-calibration__recommendation button,
.reviewer-calibration__quick-action,
.reviewer-calibration__button,
.reviewer-calibration__evaluation-card button,
.reviewer-calibration__single-ai-card button,
.reviewer-calibration__action-row {
  font: inherit;
  cursor: pointer;
}

.reviewer-calibration__head-actions button,
.reviewer-calibration__panel-controls button {
  height: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid #dce5f1;
  border-radius: 10px;
  background: #fff;
  color: #42526d;
  white-space: nowrap;
  line-height: 1;
  font-size: 0.9rem;
  font-weight: 700;
}

.reviewer-calibration__icon-button {
  width: 32px;
  min-width: 32px;
  justify-content: center;
  padding: 0;
}

.reviewer-calibration__body {
  overflow: auto;
  padding: 18px 24px 22px;
  background: #fbfcfe;
}

.reviewer-calibration__content-grid,
.reviewer-calibration__single-grid {
  display: grid;
  gap: 18px;
  align-items: start;
}

.reviewer-calibration__content-grid {
  grid-template-columns: minmax(0, 1.72fr) minmax(340px, 360px);
}

.reviewer-calibration__single-grid {
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
}

.reviewer-calibration__main-column,
.reviewer-calibration__side-column,
.reviewer-calibration__table,
.reviewer-calibration__cell-stack,
.reviewer-calibration__recommendation,
.reviewer-calibration__quick-actions,
.reviewer-calibration__stack-list,
.reviewer-calibration__competency-list,
.reviewer-calibration__variance-list,
.reviewer-calibration__single-actions {
  display: grid;
  gap: 14px;
  min-width: 0;
}

.reviewer-calibration__metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.reviewer-calibration__metric-card,
.reviewer-calibration__panel {
  border: 1px solid #e6edf6;
  border-radius: 18px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
}

.reviewer-calibration__metric-card {
  padding: 16px;
  display: grid;
  gap: 6px;
  min-height: 112px;
}

.reviewer-calibration__metric-card small,
.reviewer-calibration__table-head,
.reviewer-calibration__cell-stack .reviewer-calibration__pill,
.reviewer-calibration__confidence,
.reviewer-calibration__evaluation-score small,
.reviewer-calibration__evaluation-tags small,
.reviewer-calibration__subsection-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.reviewer-calibration__metric-card small,
.reviewer-calibration__evaluation-score small,
.reviewer-calibration__evaluation-tags small,
.reviewer-calibration__subsection-label {
  color: #9ba6b8;
}

.reviewer-calibration__metric-card strong {
  font-size: 1.2rem;
  line-height: 1.3;
  color: #25314b;
}

.reviewer-calibration__metric-card span {
  color: #8b97ac;
  font-size: 0.8rem;
}

.reviewer-calibration__metric-card.tone-pink strong {
  color: #f06db8;
}

.reviewer-calibration__metric-card.tone-amber strong {
  color: #f4a338;
}

.reviewer-calibration__metric-card.tone-green strong {
  color: #2ec25f;
}

.reviewer-calibration__metric-card.tone-violet strong {
  color: #6a69ff;
}

.reviewer-calibration__metric-card.tone-slate strong {
  color: #25314b;
}

.reviewer-calibration__panel {
  padding: 18px;
}

.reviewer-calibration__panel--compact {
  padding: 16px;
}

.reviewer-calibration__panel-head {
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.reviewer-calibration__panel-head h3 {
  font-size: 1rem;
  font-weight: 800;
}

.reviewer-calibration__panel-head p {
  margin-top: 4px;
  font-size: 0.84rem;
}

.reviewer-calibration__panel-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.reviewer-calibration__panel-controls .is-accent {
  border-color: #ead8ff;
  background: #f8f2ff;
  color: #7a58ff;
}

.reviewer-calibration__table {
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-gutter: stable;
}

.reviewer-calibration__table-head,
.reviewer-calibration__table-row {
  display: grid;
  grid-template-columns: minmax(200px, 1.2fr) minmax(150px, 1fr) minmax(100px, 0.8fr) minmax(120px, 0.8fr) minmax(100px, 0.7fr) minmax(120px, 0.8fr);
  gap: 12px;
  align-items: center;
  min-width: 920px;
}

.reviewer-calibration__table-head {
  padding: 0 4px;
  color: #99a5b7;
}

.reviewer-calibration__table-row {
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
}

.reviewer-calibration__reviewer {
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.reviewer-calibration__avatar {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #21324f 0%, #9fb3d9 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  flex: 0 0 38px;
}

.reviewer-calibration__avatar--candidate {
  width: 42px;
  height: 42px;
  flex-basis: 42px;
  background: linear-gradient(135deg, #7f5948 0%, #dbb99f 100%);
}

.reviewer-calibration__reviewer div,
.reviewer-calibration__cell-stack {
  min-width: 0;
}

.reviewer-calibration__reviewer small,
.reviewer-calibration__cell-stack small {
  display: block;
  margin-top: 3px;
  font-size: 0.78rem;
}

.reviewer-calibration__pill,
.reviewer-calibration__confidence {
  width: fit-content;
  padding: 6px 10px;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.reviewer-calibration__pill.tone-green,
.reviewer-calibration__confidence.tone-green {
  background: #ebfbf1;
  color: #2ec25f;
}

.reviewer-calibration__pill.tone-amber,
.reviewer-calibration__confidence.tone-amber {
  background: #fff4e7;
  color: #f4a338;
}

.reviewer-calibration__pill.tone-slate,
.reviewer-calibration__confidence.tone-slate {
  background: #f3f6fb;
  color: #7e8aa1;
}

.reviewer-calibration__pill.tone-red,
.reviewer-calibration__confidence.tone-red {
  background: #fff0f1;
  color: #e4606d;
}

.reviewer-calibration__cell-action button,
.reviewer-calibration__recommendation button,
.reviewer-calibration__evaluation-card button,
.reviewer-calibration__single-ai-card button {
  height: 32px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #e4eaf3;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

.reviewer-calibration__cell-action {
  display: flex;
  justify-content: flex-start;
}

.reviewer-calibration__cell-action .tone-violet {
  color: #6a69ff;
  border-color: #deddff;
  background: #f7f6ff;
}

.reviewer-calibration__cell-action .tone-amber {
  color: #f4a338;
  border-color: #ffe2b9;
  background: #fff8ef;
}

.reviewer-calibration__cell-action .tone-pink {
  color: #f06db8;
  border-color: #ffd2e6;
  background: #fff7fb;
}

.reviewer-calibration__insights-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
}

.reviewer-calibration__competency-list,
.reviewer-calibration__variance-list {
  gap: 12px;
}

.reviewer-calibration__competency-row {
  align-items: center;
  gap: 12px;
}

.reviewer-calibration__competency-meta {
  width: min(170px, 100%);
  display: grid;
  gap: 4px;
  flex: 0 0 170px;
}

.reviewer-calibration__competency-bar {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: #eef2f8;
  overflow: hidden;
}

.reviewer-calibration__competency-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.reviewer-calibration__competency-bar .tone-green {
  background: linear-gradient(90deg, #30ca65 0%, #9ae5b5 100%);
}

.reviewer-calibration__competency-bar .tone-amber {
  background: linear-gradient(90deg, #f4a338 0%, #ffd58d 100%);
}

.reviewer-calibration__competency-bar .tone-red {
  background: linear-gradient(90deg, #e4606d 0%, #ffb1b7 100%);
}

.reviewer-calibration__competency-score {
  width: 42px;
  color: #34425c;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: right;
  flex: 0 0 42px;
}

.reviewer-calibration__variance-score {
  display: grid;
  gap: 2px;
  margin-bottom: 6px;
}

.reviewer-calibration__variance-score strong {
  font-size: 2rem;
  line-height: 1;
  color: #e4606d;
}

.reviewer-calibration__variance-score span {
  color: #7b879e;
  font-size: 0.84rem;
  font-weight: 700;
}

.reviewer-calibration__variance-row {
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f9fbff;
}

.reviewer-calibration__variance-row > div {
  min-width: 0;
}

.reviewer-calibration__variance-value {
  font-size: 1rem;
  font-weight: 800;
}

.reviewer-calibration__variance-value.tone-pink {
  color: #f06db8;
}

.reviewer-calibration__variance-value.tone-amber {
  color: #f4a338;
}

.reviewer-calibration__variance-value.tone-slate {
  color: #607089;
}

.reviewer-calibration__ai-note {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f7f6ff;
  border: 1px solid #ebe6ff;
}

.reviewer-calibration__ai-note-icon,
.reviewer-calibration__stack-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex: 0 0 28px;
}

.reviewer-calibration__ai-note-icon {
  background: #fff;
  color: #7a58ff;
}

.reviewer-calibration__stack-icon.tone-amber {
  background: #fff4e7;
  color: #f4a338;
}

.reviewer-calibration__stack-icon.tone-pink {
  background: #fff1f8;
  color: #f06db8;
}

.reviewer-calibration__agreement-grid {
  gap: 14px;
}

.reviewer-calibration__agreement-card {
  flex: 1;
  padding: 16px;
  border-radius: 16px;
}

.reviewer-calibration__agreement-card.tone-green {
  background: #f4fff8;
  border: 1px solid #d8f6e2;
}

.reviewer-calibration__agreement-card.tone-red {
  background: #fff7f8;
  border: 1px solid #ffd9de;
}

.reviewer-calibration__agreement-card ul {
  margin: 12px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 10px;
}

.reviewer-calibration__stack-list,
.reviewer-calibration__quick-actions,
.reviewer-calibration__single-actions {
  gap: 12px;
}

.reviewer-calibration__stack-item {
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 14px;
  background: #f9fbff;
}

.reviewer-calibration__stack-item div {
  flex: 1;
  display: grid;
  gap: 4px;
  min-width: 0;
}

.reviewer-calibration__stack-item small,
.reviewer-calibration__stack-item p {
  font-size: 0.78rem;
}

.reviewer-calibration__stack-item em {
  color: #a0abbc;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.reviewer-calibration__recommendation {
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #edf2f8;
}

.reviewer-calibration__recommendation p {
  font-size: 0.8rem;
  line-height: 1.5;
}

.reviewer-calibration__recommendation button {
  width: fit-content;
  color: #6a69ff;
  background: #f7f6ff;
  border-color: #dedcff;
}

.reviewer-calibration__quick-action,
.reviewer-calibration__action-row {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fff;
  text-align: left;
}

.reviewer-calibration__quick-action :deep(svg),
.reviewer-calibration__action-row :deep(svg:last-child) {
  color: #a1acbe;
}

.reviewer-calibration__timeline {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 6px;
}

.reviewer-calibration__timeline-item {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.reviewer-calibration__timeline-item > div {
  display: grid;
  gap: 4px;
}

.reviewer-calibration__timeline-item em {
  font-style: normal;
  font-size: 0.76rem;
}

.reviewer-calibration__timeline-node {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #dfe6f1;
  background: #fff;
  color: #9aa6ba;
  font-size: 0.75rem;
  font-weight: 800;
}

.reviewer-calibration__timeline-item.is-done .reviewer-calibration__timeline-node {
  border-color: #37c865;
  background: #37c865;
  color: #fff;
}

.reviewer-calibration__timeline-item.is-current .reviewer-calibration__timeline-node {
  border-color: #f06db8;
  background: #f06db8;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(240, 109, 184, 0.16);
}

.reviewer-calibration__timeline-item.is-current strong,
.reviewer-calibration__timeline-item.is-current small {
  color: #f06db8;
}

.reviewer-calibration__evaluation-card {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(120px, 0.55fr) minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 18px;
  border: 1px solid #edf2f7;
  border-radius: 14px;
  background: #fff;
}

.reviewer-calibration__evaluation-person {
  gap: 12px;
  min-width: 0;
}

.reviewer-calibration__evaluation-person div,
.reviewer-calibration__evaluation-score {
  display: grid;
  gap: 4px;
}

.reviewer-calibration__evaluation-tags {
  min-width: 0;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

.reviewer-calibration__evaluation-tags-body {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
}

.reviewer-calibration__evaluation-tags ul {
  margin: 0;
  padding-left: 16px;
  color: #56637d;
  font-size: 0.82rem;
}

.reviewer-calibration__evaluation-score strong {
  color: #2ec25f;
  font-size: 1.3rem;
}

.reviewer-calibration__evaluation-card button {
  color: #f06db8;
  border-color: #ffd2e6;
  background: #fff7fb;
}

.reviewer-calibration__steps-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.reviewer-calibration__step-card {
  display: grid;
  gap: 10px;
  min-height: 142px;
  padding: 16px;
  border: 1px solid #edf2f8;
  border-radius: 14px;
  background: #fff;
}

.reviewer-calibration__step-card p {
  font-size: 0.82rem;
  line-height: 1.55;
}

.reviewer-calibration__step-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.reviewer-calibration__step-card.tone-violet .reviewer-calibration__step-icon {
  background: #f0efff;
  color: #7469ff;
}

.reviewer-calibration__step-card.tone-green .reviewer-calibration__step-icon {
  background: #ebfbf1;
  color: #2ec25f;
}

.reviewer-calibration__step-card.tone-orange .reviewer-calibration__step-icon {
  background: #fff4e7;
  color: #f4a338;
}

.reviewer-calibration__about-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.reviewer-calibration__about-list li {
  position: relative;
  padding-left: 18px;
  color: #6d7a93;
  font-size: 0.84rem;
  line-height: 1.45;
}

.reviewer-calibration__about-list li::before {
  content: '';
  position: absolute;
  top: 0.45rem;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: #ff89c8;
}

.reviewer-calibration__single-ai-card {
  justify-items: center;
  text-align: center;
  gap: 12px;
  background: linear-gradient(180deg, #fafbff 0%, #f5f7ff 100%);
}

.reviewer-calibration__single-ai-card strong {
  color: #20283d;
}

.reviewer-calibration__single-ai-card p {
  margin: 0;
  color: #7b879e;
}

.reviewer-calibration__single-ai-card button {
  width: 100%;
  color: #5671ff;
}

.reviewer-calibration__action-row div {
  flex: 1;
  display: grid;
  gap: 2px;
  min-width: 0;
}

.reviewer-calibration__footer {
  align-items: center;
  padding: 16px 24px 20px;
  border-top: 1px solid #edf2f8;
  background: #fff;
}

.reviewer-calibration__button {
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 800;
}

.reviewer-calibration__button--ghost {
  border: 1px solid #dfe6f1;
  background: #fff;
  color: #4b5a73;
}

.reviewer-calibration__button--primary {
  border: 0;
  background: linear-gradient(90deg, #f36fb8 0%, #ea63ad 100%);
  color: #fff;
}

@media (max-width: 1180px) {
  .reviewer-calibration__content-grid,
  .reviewer-calibration__insights-grid,
  .reviewer-calibration__single-grid {
    grid-template-columns: 1fr;
  }

  .reviewer-calibration__metric-grid,
  .reviewer-calibration__steps-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .reviewer-calibration__table-head {
    display: none;
  }

  .reviewer-calibration__table-row {
    grid-template-columns: 1fr 1fr;
    min-width: 0;
  }

  .reviewer-calibration__agreement-grid {
    flex-direction: column;
  }
}

@media (max-width: 860px) {
  .reviewer-calibration-overlay {
    padding: 12px;
  }

  .reviewer-calibration-modal {
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .reviewer-calibration__head,
  .reviewer-calibration__footer,
  .reviewer-calibration__panel-head {
    flex-direction: column;
    gap: 14px;
    align-items: stretch;
  }

  .reviewer-calibration__head-actions,
  .reviewer-calibration__panel-controls {
    flex-wrap: wrap;
  }

  .reviewer-calibration__metric-grid,
  .reviewer-calibration__table-row,
  .reviewer-calibration__insights-grid,
  .reviewer-calibration__steps-grid,
  .reviewer-calibration__timeline,
  .reviewer-calibration__evaluation-card {
    grid-template-columns: 1fr;
  }

  .reviewer-calibration__competency-row {
    flex-wrap: wrap;
  }

  .reviewer-calibration__competency-meta,
  .reviewer-calibration__competency-score {
    flex: 1 1 100%;
    width: 100%;
    text-align: left;
  }

  .reviewer-calibration__head-actions button,
  .reviewer-calibration__panel-controls button,
  .reviewer-calibration__cell-action button,
  .reviewer-calibration__button,
  .reviewer-calibration__evaluation-card button,
  .reviewer-calibration__single-ai-card button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .reviewer-calibration__body,
  .reviewer-calibration__head,
  .reviewer-calibration__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .reviewer-calibration__metric-grid,
  .reviewer-calibration__table-row,
  .reviewer-calibration__steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
