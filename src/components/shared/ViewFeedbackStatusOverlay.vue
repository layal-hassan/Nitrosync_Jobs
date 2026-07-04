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
  candidateStage: {
    type: String,
    default: 'Shortlisted',
  },
  initialTab: {
    type: String,
    default: 'status',
  },
})

const emit = defineEmits(['close', 'request-feedback'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const activeTab = ref('status')

const statusCards = [
  { label: 'Total Reviewers', value: '4', detail: 'Invited', icon: 'users', tone: 'violet' },
  { label: 'Completed', value: '2', detail: '50%', icon: 'checkCircle', tone: 'green' },
  { label: 'Pending', value: '1', detail: '25%', icon: 'clock', tone: 'orange' },
  { label: 'Overdue', value: '1', detail: '25%', icon: 'close', tone: 'red' },
]

const feedbackRows = [
  {
    name: 'Emma Wilson',
    role: 'Hiring Manager',
    assessment: 'Strong',
    sentiment: 'Positive',
    status: 'Submitted',
    submitted: '2 hours ago',
    submittedDate: 'May 12, 2025 at 1:30 PM',
    expanded: true,
    notes: 'Discussed recent projects, design process, collaboration style, and approach to problem-solving. Showed strong ownership and thoughtful responses.',
  },
  {
    name: 'David Lee',
    role: 'Panel Interviewer',
    assessment: 'Pending',
    sentiment: '',
    status: 'Pending',
    submitted: '-',
    submittedDate: '',
    expanded: false,
  },
  {
    name: 'Priya Patel',
    role: 'Technical Evaluator',
    assessment: '-',
    sentiment: '',
    status: 'Overdue',
    submitted: '-',
    submittedDate: 'Due May 11, 2025',
    expanded: false,
  },
  {
    name: 'James Carter',
    role: 'Recruiter Review',
    assessment: '-',
    sentiment: '',
    status: 'Pending',
    submitted: '-',
    submittedDate: 'Due May 14, 2025',
    expanded: false,
  },
]

const strengths = [
  ['Product Thinking', '3 reviewers'],
  ['Stakeholder Management', '3 reviewers'],
  ['Communication', '2 reviewers'],
  ['Leadership Potential', '2 reviewers'],
]

const attentionAreas = [
  ['Technical Analytics Depth', 'Reviewers noted limited depth in analytics frameworks and measurement.', '2 reviewers'],
  ['Limited Enterprise Experience', 'More experience in large-scale enterprise environments would be beneficial.', '1 reviewer'],
]

const feedbackTimeline = [
  ['Emma Wilson', 'Hiring Manager', 'Strong', 'May 12, 1:30 PM', 'green'],
  ['Michael Chen', 'Panel Interviewer', 'Strong', 'May 12, 11:05 AM', 'green'],
  ['Sophia Carter', 'UX Lead', 'Meets Expectations', 'May 12, 9:20 AM', 'orange'],
  ['David Park', 'Technical Evaluator', 'Pending', 'Not submitted yet', 'slate'],
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

watch(
  () => props.initialTab,
  (tab) => {
    activeTab.value = tab === 'insights' ? 'insights' : 'status'
  },
  { immediate: true },
)

function closeOverlay() {
  emit('close')
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
    <div v-if="open" class="feedback-status-overlay" @click.self="closeOverlay">
      <section class="feedback-status-modal">
        <header class="feedback-status-modal__header">
          <div class="feedback-status-modal__title">
            <span class="feedback-status-modal__icon">
              <AppIcon name="message" :size="20" />
            </span>
            <div>
              <h2>View Feedback Status</h2>
              <p>Track interview feedback and insights in one place.</p>
            </div>
          </div>

          <button class="feedback-status-modal__close" type="button" aria-label="Close feedback status" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <section class="feedback-status-candidate">
          <div class="feedback-status-candidate__profile">
            <span class="feedback-status-candidate__avatar">{{ candidateInitials }}</span>

            <div class="feedback-status-candidate__copy">
              <div class="feedback-status-candidate__name">
                <h3>{{ candidateName }}</h3>
                <span>{{ candidateStage }}</span>
              </div>

              <p>{{ candidateRole }}</p>

              <div class="feedback-status-candidate__meta">
                <span><AppIcon name="mapPin" :size="14" /> New York, NY (Hybrid)</span>
                <span><AppIcon name="briefcase" :size="14" /> 6+ years experience</span>
                <span><AppIcon name="target" :size="14" /> Round 1 - Technical Interview</span>
                <span><AppIcon name="clock" :size="14" /> 60 Minutes</span>
              </div>
            </div>
          </div>

          <div class="feedback-status-candidate__stage">
            <small>Current Stage</small>
            <strong>Round 1 - Technical Interview</strong>
          </div>
        </section>

        <section v-if="activeTab === 'status'" class="feedback-status-overview">
          <article v-for="card in statusCards" :key="card.label" class="feedback-status-summary-card">
            <span class="feedback-status-summary-card__icon" :class="`is-${card.tone}`">
              <AppIcon :name="card.icon" :size="18" />
            </span>
            <div>
              <strong>{{ card.label }}</strong>
              <div class="feedback-status-summary-card__metric">
                <span>{{ card.value }}</span>
                <small>{{ card.detail }}</small>
              </div>
            </div>
          </article>

          <article class="feedback-status-assessment-card">
            <small>Overall Assessment</small>
            <strong>Strong</strong>
            <span>Positive</span>
            <p>Based on 2 of 4 submitted reviews</p>
            <div class="feedback-status-assessment-card__bar">
              <i />
            </div>
            <em>Confidence: High</em>
          </article>
        </section>

        <nav class="feedback-status-tabs">
          <button type="button" :class="{ 'is-active': activeTab === 'status' }" @click="activeTab = 'status'">Feedback Status</button>
          <button type="button" :class="{ 'is-active': activeTab === 'insights' }" @click="activeTab = 'insights'">
            <span>Feedback Insights</span>
            <em>New</em>
          </button>
        </nav>

        <section v-if="activeTab === 'status'" class="feedback-status-table-wrap">
          <div class="feedback-status-table-head">
            <span>Reviewer</span>
            <span>Role</span>
            <span>Assessment</span>
            <span>Status</span>
            <span>Submitted</span>
            <span>Actions</span>
          </div>

          <article v-for="row in feedbackRows" :key="row.name" class="feedback-status-row">
            <div class="feedback-status-row__main">
              <div class="feedback-status-row__reviewer">
                <span>{{ row.name.split(' ').map((part) => part[0]).join('') }}</span>
                <div>
                  <strong>{{ row.name }}</strong>
                  <small>{{ row.role }}</small>
                </div>
              </div>

              <strong class="feedback-status-row__role">{{ row.role }}</strong>

              <div class="feedback-status-row__assessment">
                <span v-if="row.assessment !== '-'">{{ row.assessment }}</span>
                <em v-if="row.sentiment">{{ row.sentiment }}</em>
                <small v-if="row.assessment === '-'">-</small>
              </div>

              <div class="feedback-status-row__status">
                <span :class="`is-${row.status.toLowerCase()}`">{{ row.status }}</span>
                <small v-if="row.status === 'Overdue'">{{ row.submittedDate }}</small>
              </div>

              <div class="feedback-status-row__submitted">
                <strong>{{ row.submitted }}</strong>
                <small>{{ row.submittedDate }}</small>
              </div>

              <div class="feedback-status-row__actions">
                <button v-if="row.status === 'Submitted'" type="button">View Feedback</button>
                <button v-else type="button" @click="emit('request-feedback')">Remind</button>
                <AppIcon name="chevronDown" :size="16" />
              </div>
            </div>

            <div v-if="row.expanded" class="feedback-status-row__details">
              <div>
                <small>Your Assessment</small>
                <strong>Strong</strong>
                <em>Positive</em>
              </div>

              <div>
                <small>Key Strengths</small>
                <ul>
                  <li>Strong product thinking</li>
                  <li>Excellent stakeholder management</li>
                  <li>Cross-functional collaboration</li>
                </ul>
              </div>

              <div>
                <small>Areas For Improvement</small>
                <p>Could explore more data-driven decision making in complex scenarios.</p>
              </div>

              <div>
                <small>Interview Notes Summary</small>
                <p>{{ row.notes }}</p>
              </div>

              <aside>
                <strong>AI Insight</strong>
                <p>This feedback aligns with 3 of 4 submitted reviews.</p>
                <button type="button">View Full Feedback</button>
              </aside>
            </div>
          </article>

          <footer class="feedback-status-table-footer">
            <div>
              <strong>AI Summary</strong>
              <p>Feedback from 2 of 4 reviewers is positive. Candidate is performing well overall.</p>
            </div>
            <div class="feedback-status-table-footer__actions">
              <button type="button">Download Report</button>
              <button type="button" class="is-primary">Share Feedback Summary</button>
            </div>
          </footer>
        </section>

        <section v-else class="feedback-insights-grid">
          <article class="feedback-insights-card">
            <header>
              <h4>Overall Feedback Signal</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <div class="feedback-insights-signal">
              <span><AppIcon name="smile" :size="28" /></span>
              <div class="feedback-insights-signal__metrics">
                <div><strong>3</strong><small>Positive Reviews</small></div>
                <div><strong>1</strong><small>Neutral Review</small></div>
                <div><strong>0</strong><small>Negative Reviews</small></div>
              </div>
            </div>
            <em>Positive</em>
            <p>Based on 4 of 4 submitted reviews</p>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Reviewer Alignment</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <strong class="feedback-insights-card__percent">85%</strong>
            <span>Agreement</span>
            <div class="feedback-insights-card__bars">
              <i v-for="bar in 9" :key="bar" :class="{ 'is-on': bar <= 7 }" />
            </div>
            <em class="is-green">High Consensus</em>
            <p>Reviewers are largely aligned in their assessment.</p>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Decision Readiness</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <div class="feedback-insights-card__decision">
              <div>
                <strong class="feedback-insights-card__percent">85%</strong>
                <span>Ready to Advance</span>
              </div>
              <div class="feedback-insights-card__ring">85%</div>
            </div>
            <button type="button" class="feedback-insights-card__notice">1 feedback still pending</button>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Top Strengths</h4>
              <span>Mentioned By</span>
            </header>
            <ul class="feedback-insights-list">
              <li v-for="[label, by] in strengths" :key="label"><span>{{ label }}</span><strong>{{ by }}</strong></li>
            </ul>
            <footer>AI identified from reviewer feedback</footer>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Areas for Attention</h4>
              <span>Mentioned By</span>
            </header>
            <ul class="feedback-insights-list is-warning">
              <li v-for="[label, text, by] in attentionAreas" :key="label">
                <div>
                  <strong>{{ label }}</strong>
                  <p>{{ text }}</p>
                </div>
                <em>{{ by }}</em>
              </li>
            </ul>
            <footer class="is-warning">AI identified from reviewer feedback</footer>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Overall Sentiment</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <div class="feedback-insights-sentiment">Positive</div>
            <div class="feedback-insights-rating">
              <span>Average Sentiment Score</span>
              <strong>4.2 / 5</strong>
            </div>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Feedback Timeline</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <div class="feedback-insights-timeline">
              <article v-for="[name, role, badge, date, tone] in feedbackTimeline" :key="name">
                <span :class="`is-${tone}`">{{ name.split(' ').map((part) => part[0]).join('') }}</span>
                <div>
                  <strong>{{ name }}</strong>
                  <small>{{ role }}</small>
                  <em :class="`is-${tone}`">{{ badge }}</em>
                </div>
                <time>{{ date }}</time>
              </article>
            </div>
            <button type="button" class="feedback-insights-card__outline">View All Feedback</button>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>AI Summary</h4>
              <button type="button" class="feedback-insights-card__ghost-action">
                <AppIcon name="refresh" :size="14" />
                <span>Regenerate</span>
              </button>
            </header>
            <div class="feedback-insights-summary">
              <p>The candidate demonstrates consistently strong product thinking and stakeholder management capabilities.</p>
              <p>Reviewers highlighted excellent communication and leadership potential.</p>
              <p>One reviewer noted opportunities for deeper analytics experience.</p>
              <p>Overall interview sentiment remains positive with high alignment among reviewers.</p>
            </div>
            <button type="button" class="feedback-insights-card__outline">Copy Summary</button>
          </article>

          <article class="feedback-insights-card">
            <header>
              <h4>Recommended Next Step</h4>
              <AppIcon name="info" :size="14" />
            </header>
            <div class="feedback-insights-next-step">
              <strong>Proceed to Validation Stage</strong>
              <p>Candidate is well-positioned to move forward based on current feedback.</p>
            </div>
            <button type="button" class="feedback-insights-card__primary">Move Forward</button>
            <button type="button" class="feedback-insights-card__outline" @click="emit('request-feedback')">Request Additional Review</button>
          </article>
        </section>

        <footer v-if="activeTab === 'insights'" class="feedback-insights-footer">
          <button type="button" @click="closeOverlay">Close</button>
          <div>
            <button type="button">Download Report</button>
            <button type="button" class="is-primary">Share Feedback Summary</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.feedback-status-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(12px);
}

.feedback-status-modal {
  width: min(1260px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  border: 1px solid #e7edf6;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
}

.feedback-status-modal__header,
.feedback-status-candidate,
.feedback-status-overview,
.feedback-status-tabs,
.feedback-status-table-wrap,
.feedback-insights-grid,
.feedback-insights-footer {
  padding-left: 26px;
  padding-right: 26px;
}

.feedback-status-modal__header,
.feedback-status-modal__title,
.feedback-status-candidate,
.feedback-status-candidate__profile,
.feedback-status-candidate__name,
.feedback-status-candidate__meta,
.feedback-status-overview,
.feedback-status-tabs,
.feedback-status-table-head,
.feedback-status-row__main,
.feedback-status-row__reviewer,
.feedback-status-row__assessment,
.feedback-status-row__status,
.feedback-status-row__actions,
.feedback-status-row__details,
.feedback-status-table-footer,
.feedback-status-table-footer__actions,
.feedback-insights-card header,
.feedback-insights-signal,
.feedback-insights-signal__metrics,
.feedback-insights-card__decision,
.feedback-insights-list li,
.feedback-insights-timeline article,
.feedback-insights-footer,
.feedback-insights-footer > div {
  display: flex;
}

.feedback-status-modal__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-top: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid #edf1f7;
}

.feedback-status-modal__title {
  gap: 14px;
}

.feedback-status-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #ff4fa0;
  background: #ffedf6;
}

.feedback-status-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.1rem;
  font-weight: 800;
}

.feedback-status-modal__title p {
  margin: 5px 0 0;
  color: #76839a;
}

.feedback-status-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.feedback-status-candidate {
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 24px;
  padding-bottom: 20px;
}

.feedback-status-candidate__profile {
  align-items: center;
  gap: 16px;
}

.feedback-status-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 74px;
  border-radius: 22px;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2b3248 0%, #ff78bb 100%);
}

.feedback-status-candidate__name {
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.feedback-status-candidate__name h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.1rem;
  font-weight: 800;
}

.feedback-status-candidate__name span {
  padding: 6px 10px;
  border-radius: 999px;
  color: #f05aa9;
  font-size: 0.72rem;
  font-weight: 800;
  background: #ffeaf4;
}

.feedback-status-candidate__copy > p {
  margin: 5px 0 0;
  color: #60708a;
}

.feedback-status-candidate__meta {
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 11px;
  color: #77839a;
  font-size: 0.92rem;
}

.feedback-status-candidate__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.feedback-status-candidate__stage {
  text-align: right;
}

.feedback-status-candidate__stage small {
  display: block;
  color: #a0a9bc;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.feedback-status-candidate__stage strong {
  display: block;
  margin-top: 9px;
  color: #4f46e5;
  font-size: 1rem;
  font-weight: 800;
}

.feedback-status-overview {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  padding-bottom: 18px;
}

.feedback-status-summary-card,
.feedback-status-assessment-card,
.feedback-insights-card {
  border: 1px solid #ebeff6;
  border-radius: 18px;
  background: #ffffff;
}

.feedback-status-summary-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 18px;
}

.feedback-status-summary-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.feedback-status-summary-card__icon.is-violet {
  color: #5b61f6;
  background: #eef1ff;
}

.feedback-status-summary-card__icon.is-green {
  color: #22c55e;
  background: #edfdf3;
}

.feedback-status-summary-card__icon.is-orange {
  color: #f97316;
  background: #fff4e7;
}

.feedback-status-summary-card__icon.is-red {
  color: #ef4444;
  background: #fff0f0;
}

.feedback-status-summary-card strong,
.feedback-status-assessment-card strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.feedback-status-summary-card__metric {
  margin-top: 24px;
}

.feedback-status-summary-card__metric span {
  color: #1f2a44;
  font-size: 2rem;
  font-weight: 800;
}

.feedback-status-summary-card__metric small {
  margin-left: 8px;
  color: #96a0b4;
}

.feedback-status-assessment-card {
  padding: 18px 16px;
}

.feedback-status-assessment-card small {
  display: block;
  color: #9ba5b8;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.feedback-status-assessment-card strong {
  margin-top: 16px;
  font-size: 1.9rem;
}

.feedback-status-assessment-card span {
  display: inline-flex;
  margin-top: 6px;
  padding: 5px 9px;
  border-radius: 999px;
  color: #16a34a;
  font-size: 0.72rem;
  font-weight: 700;
  background: #ecfdf3;
}

.feedback-status-assessment-card p,
.feedback-status-assessment-card em {
  display: block;
  margin: 12px 0 0;
  color: #95a0b4;
  font-style: normal;
}

.feedback-status-assessment-card__bar {
  height: 6px;
  margin-top: 14px;
  border-radius: 999px;
  background: #e1e7f0;
}

.feedback-status-assessment-card__bar i {
  display: block;
  width: 50%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #6967f6 0%, #7d7bff 100%);
}

.feedback-status-tabs {
  gap: 28px;
  border-bottom: 1px solid #edf1f7;
}

.feedback-status-tabs button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 4px 16px;
  border: 0;
  background: transparent;
  color: #7f8aa0;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.feedback-status-tabs button.is-active {
  color: #ff59a7;
}

.feedback-status-tabs button.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: #ff59a7;
}

.feedback-status-tabs em {
  padding: 5px 8px;
  border-radius: 10px;
  color: #9b7cfb;
  font-size: 0.67rem;
  font-style: normal;
  font-weight: 700;
  background: #f2edff;
}

.feedback-status-table-wrap {
  padding-top: 18px;
  padding-bottom: 24px;
}

.feedback-status-table-head,
.feedback-status-row__main {
  display: grid;
  grid-template-columns: 1.55fr 1.15fr 0.95fr 0.9fr 1.05fr 1.05fr;
  gap: 18px;
  align-items: center;
}

.feedback-status-table-head {
  padding: 10px 6px 16px;
  color: #9aa4b8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.feedback-status-row {
  border-top: 1px solid #edf1f7;
  padding: 18px 6px;
}

.feedback-status-row__reviewer {
  align-items: center;
  gap: 12px;
}

.feedback-status-row__reviewer > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: #6572ff;
  font-size: 0.9rem;
  font-weight: 800;
  background: #f2f4ff;
}

.feedback-status-row__reviewer strong,
.feedback-status-row__submitted strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.feedback-status-row__reviewer small,
.feedback-status-row__submitted small,
.feedback-status-row__assessment small,
.feedback-status-row__status small {
  display: block;
  margin-top: 4px;
  color: #96a0b4;
}

.feedback-status-row__role {
  color: #445067;
}

.feedback-status-row__assessment {
  align-items: center;
  gap: 8px;
}

.feedback-status-row__assessment span {
  color: #1f2a44;
  font-weight: 800;
}

.feedback-status-row__assessment em {
  padding: 4px 8px;
  border-radius: 8px;
  color: #16a34a;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
  background: #ecfdf3;
}

.feedback-status-row__status {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.feedback-status-row__status > span {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
}

.feedback-status-row__status > span.is-submitted {
  color: #16a34a;
  background: #ecfdf3;
}

.feedback-status-row__status > span.is-pending {
  color: #f97316;
  background: #fff1e8;
}

.feedback-status-row__status > span.is-overdue {
  color: #ef4444;
  background: #fff0f0;
}

.feedback-status-row__actions {
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
}

.feedback-status-row__actions button,
.feedback-status-table-footer__actions button,
.feedback-insights-card__outline,
.feedback-insights-card__primary,
.feedback-insights-footer button {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.feedback-status-row__actions button {
  min-width: 108px;
  text-align: center;
}

.feedback-status-row__actions button,
.feedback-status-table-footer__actions button,
.feedback-insights-card__outline,
.feedback-insights-footer button {
  border: 1px solid #d7deea;
  background: #ffffff;
  color: #ff59a7;
}

.feedback-status-row__details {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 0.9fr;
  gap: 16px;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #e4e9f6;
  border-radius: 14px;
  background: #fbfcff;
}

.feedback-status-row__details small {
  display: block;
  color: #97a1b6;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.feedback-status-row__details strong {
  display: block;
  margin-top: 10px;
  color: #1f2a44;
  font-weight: 800;
}

.feedback-status-row__details em {
  display: inline-flex;
  margin-top: 8px;
  padding: 5px 8px;
  border-radius: 8px;
  color: #16a34a;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
  background: #ecfdf3;
}

.feedback-status-row__details ul {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #46536a;
  line-height: 1.6;
}

.feedback-status-row__details p {
  margin: 10px 0 0;
  color: #46536a;
  line-height: 1.6;
}

.feedback-status-row__details aside {
  padding: 14px;
  border: 1px solid #d8e1fb;
  border-radius: 12px;
  background: #f8faff;
}

.feedback-status-row__details aside strong {
  margin-top: 0;
  color: #5b61f6;
}

.feedback-status-row__details aside button {
  width: 100%;
  margin-top: 16px;
  height: 38px;
  border: 1px solid #d7deea;
  border-radius: 10px;
  background: #ffffff;
  color: #ff59a7;
  font-weight: 700;
}

.feedback-status-table-footer {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 18px;
  padding: 16px 0 0;
  border-top: 1px solid #edf1f7;
}

.feedback-status-table-footer strong {
  display: block;
  color: #5b61f6;
  font-weight: 800;
}

.feedback-status-table-footer p {
  margin: 6px 0 0;
  color: #63718b;
}

.feedback-status-table-footer__actions {
  gap: 12px;
}

.feedback-status-table-footer__actions .is-primary,
.feedback-insights-card__primary,
.feedback-insights-footer .is-primary {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #f15da9 0%, #ef77bd 100%);
}

.feedback-insights-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  padding-top: 24px;
  padding-bottom: 24px;
}

.feedback-insights-card {
  padding: 22px;
}

.feedback-insights-card header {
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #9aa4b8;
}

.feedback-insights-card__ghost-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff59a7;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.feedback-insights-card h4 {
  margin: 0;
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.feedback-insights-signal {
  align-items: center;
  gap: 20px;
  margin-top: 24px;
}

.feedback-insights-signal > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #22c55e;
  background: #ebfcf1;
}

.feedback-insights-signal__metrics {
  gap: 28px;
}

.feedback-insights-signal__metrics strong {
  display: block;
  color: #1f2a44;
  font-size: 1.8rem;
  font-weight: 800;
}

.feedback-insights-signal__metrics small {
  display: block;
  margin-top: 4px;
  color: #9ba5b8;
  text-transform: uppercase;
  font-size: 0.68rem;
  line-height: 1.4;
}

.feedback-insights-card > em,
.feedback-insights-card > p,
.feedback-insights-card > span {
  display: block;
}

.feedback-insights-card > em {
  margin-top: 14px;
  color: #16a34a;
  font-style: normal;
  font-weight: 800;
}

.feedback-insights-card > p {
  margin: 20px 0 0;
  color: #93a0b7;
}

.feedback-insights-card__percent {
  display: block;
  margin-top: 24px;
  color: #ef65af;
  font-size: 2rem;
  font-weight: 800;
}

.feedback-insights-card__bars {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 6px;
  margin-top: 18px;
}

.feedback-insights-card__bars i {
  height: 16px;
  border-radius: 4px;
  background: #e1e5ee;
}

.feedback-insights-card__bars i.is-on {
  background: linear-gradient(180deg, #ef6ab4 0%, #db6cb0 100%);
}

.feedback-insights-card em.is-green {
  display: inline-flex;
  margin-top: 14px;
  padding: 6px 10px;
  border-radius: 10px;
  color: #16a34a;
  background: #ecfdf3;
}

.feedback-insights-card__decision {
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 22px;
}

.feedback-insights-card__ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 78px;
  border: 8px solid #ea62ae;
  border-left-color: #f6d7ea;
  border-radius: 50%;
  color: #1f2a44;
  font-weight: 800;
}

.feedback-insights-card__notice {
  width: 100%;
  margin-top: 20px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: #fff4ea;
  color: #ea580c;
  font-weight: 700;
}

.feedback-insights-list {
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
}

.feedback-insights-list li {
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  color: #425168;
}

.feedback-insights-list li + li {
  margin-top: 18px;
}

.feedback-insights-list strong,
.feedback-insights-list em {
  color: #1f2a44;
  font-style: normal;
  font-weight: 800;
}

.feedback-insights-list.is-warning li strong {
  display: block;
}

.feedback-insights-list.is-warning li p {
  margin: 8px 0 0;
  color: #6b7790;
  line-height: 1.55;
}

.feedback-insights-card footer {
  margin: 18px -22px -22px;
  padding: 14px 22px;
  border-top: 1px solid #e6f4eb;
  color: #15803d;
  font-weight: 700;
  background: #f5fff7;
}

.feedback-insights-card footer.is-warning {
  border-top-color: #fde7d6;
  color: #ea580c;
  background: #fff7ef;
}

.feedback-insights-sentiment {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 62px;
  margin-top: 24px;
  border-radius: 14px;
  color: #16a34a;
  font-size: 1.05rem;
  font-weight: 800;
  background: #eefcf1;
}

.feedback-insights-rating {
  margin-top: 26px;
}

.feedback-insights-rating span {
  display: block;
  color: #9aa4b8;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.feedback-insights-rating strong {
  display: block;
  margin-top: 12px;
  color: #1f2a44;
  font-size: 1.55rem;
  font-weight: 800;
}

.feedback-insights-timeline {
  margin-top: 20px;
}

.feedback-insights-timeline article {
  align-items: center;
  gap: 12px;
}

.feedback-insights-timeline article + article {
  margin-top: 16px;
}

.feedback-insights-timeline span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 800;
}

.feedback-insights-timeline span.is-green {
  background: #22c55e;
}

.feedback-insights-timeline span.is-orange {
  background: #f97316;
}

.feedback-insights-timeline span.is-slate {
  background: #94a3b8;
}

.feedback-insights-timeline strong,
.feedback-insights-next-step strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.feedback-insights-timeline small,
.feedback-insights-timeline time,
.feedback-insights-next-step p,
.feedback-insights-summary p {
  color: #69768e;
}

.feedback-insights-timeline em {
  display: inline-flex;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.feedback-insights-timeline em.is-green {
  color: #15803d;
  background: #ecfdf3;
}

.feedback-insights-timeline em.is-orange {
  color: #ea580c;
  background: #fff1e8;
}

.feedback-insights-timeline em.is-slate {
  color: #64748b;
  background: #f1f5f9;
}

.feedback-insights-card__outline,
.feedback-insights-card__primary {
  width: 100%;
  margin-top: 18px;
}

.feedback-insights-summary {
  margin-top: 18px;
}

.feedback-insights-summary p {
  margin: 0;
  line-height: 1.65;
}

.feedback-insights-summary p + p {
  margin-top: 18px;
}

.feedback-insights-next-step {
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  background: #f3fff6;
}

.feedback-insights-next-step p {
  margin: 12px 0 0;
  line-height: 1.65;
}

.feedback-insights-footer {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 0;
  padding-bottom: 24px;
}

.feedback-insights-footer > div {
  gap: 12px;
}

@media (max-width: 1120px) {
  .feedback-status-overview,
  .feedback-insights-grid,
  .feedback-status-row__details {
    grid-template-columns: 1fr 1fr;
  }

  .feedback-status-table-head,
  .feedback-status-row__main {
    grid-template-columns: 1fr;
  }

  .feedback-status-candidate,
  .feedback-status-table-footer,
  .feedback-insights-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .feedback-status-candidate__stage {
    text-align: left;
  }
}

@media (max-width: 760px) {
  .feedback-status-overlay {
    padding: 12px;
  }

  .feedback-status-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
  }

  .feedback-status-overview,
  .feedback-insights-grid,
  .feedback-status-row__details {
    grid-template-columns: 1fr;
  }

  .feedback-status-modal__header,
  .feedback-status-candidate,
  .feedback-status-overview,
  .feedback-status-tabs,
  .feedback-status-table-wrap,
  .feedback-insights-grid,
  .feedback-insights-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
