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
    default: 'Senior Data Analyst',
  },
  candidateMatch: {
    type: String,
    default: '94% Match',
  },
})

const emit = defineEmits(['close'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => props.candidateName.split(' ').filter(Boolean)[0] ?? props.candidateName)

const summaryChips = [
  { label: 'Strong analytical reasoning', tone: 'green', icon: 'check' },
  { label: 'High accuracy on complex problems', tone: 'green', icon: 'check' },
  { label: 'Prefers correctness over speed', tone: 'amber', icon: 'alert' },
]

const performanceRows = [
  {
    title: 'Logical Reasoning',
    score: '92/100',
    percentile: '95th',
    insight: 'Exceptional pattern recognition and analytical reasoning.',
    strength: 'Very Strong',
    bars: 5,
    filledBars: 5,
    tone: 'green',
    icon: 'spark',
  },
  {
    title: 'Coding Challenge',
    score: '88/100',
    percentile: '88th',
    insight: 'Strong software problem solving and clean, efficient solutions.',
    strength: 'Very Strong',
    bars: 5,
    filledBars: 5,
    tone: 'green',
    icon: 'document',
  },
  {
    title: 'Numerical Reasoning',
    score: '84/100',
    percentile: '82nd',
    insight: 'High quantitative accuracy and methodical approach.',
    strength: 'Strong',
    bars: 5,
    filledBars: 4,
    tone: 'pink',
    icon: 'document',
  },
  {
    title: 'Written Assessment',
    score: '79/100',
    percentile: '65th',
    insight: 'Clear communication and structure; limited stakeholder context.',
    strength: 'Moderate',
    bars: 5,
    filledBars: 3,
    tone: 'orange',
    icon: 'document',
  },
]

const findings = [
  { label: 'Consistent structured reasoning across all assessments', tone: 'green' },
  { label: 'Accuracy remained stable as difficulty increased', tone: 'green' },
  { label: 'No irregular behavior or random guessing detected', tone: 'green' },
  { label: 'Candidate prioritizes correctness over speed', tone: 'amber' },
]

const feedbackAlignment = [
  {
    name: 'Alex Thompson',
    role: 'Hiring Manager',
    quote: 'Excellent analytical skills and problem solving.',
    status: 'Strongly Supported',
    note: 'By Logical, Coding, Numerical',
    tone: 'green',
  },
  {
    name: 'Priya Shah',
    role: 'Team Lead',
    quote: 'Great communicator and clear in explaining ideas.',
    status: 'Limited Evidence',
    note: 'Communication was only partially assessed',
    tone: 'orange',
  },
  {
    name: 'Daniel Lee',
    role: 'Senior Analyst',
    quote: 'Weak problem solver under pressure.',
    status: 'Contradicted',
    note: 'Assessment scores strongly disagree',
    tone: 'red',
  },
]

const possibleActions = [
  {
    title: 'Assign Another Test',
    note: 'Add tests to evaluate missing competencies',
    tone: 'violet',
    icon: 'document',
  },
  {
    title: 'Move Candidate',
    note: 'Move to next stage (Screening -> Interview)',
    tone: 'green',
    icon: 'chevronRight',
  },
  {
    title: 'Reject Candidate',
    note: 'Not recommended based on current evidence',
    tone: 'red',
    icon: 'close',
  },
]

const missingEvidence = [
  'Communication',
  'Collaboration',
  'Stakeholder Management',
  'Conflict Resolution',
]

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow
    previousHtmlOverflow.value = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
  document.documentElement.style.overflow = previousHtmlOverflow.value
}

function closeOverlay() {
  emit('close')
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
    <div v-if="open" class="assessment-insights-overlay" @click.self="closeOverlay">
      <section class="assessment-insights-modal">
        <header class="assessment-insights-modal__header">
          <div class="assessment-insights-modal__title">
            <span class="assessment-insights-modal__title-icon">
              <AppIcon name="spark" :size="18" />
            </span>
            <div>
              <h2>AI Assessment Insights</h2>
              <p>AI-powered analysis of assessments in the Assessment stage</p>
            </div>
          </div>

          <div class="assessment-insights-modal__header-actions">
            <button type="button">
              <AppIcon name="refresh" :size="15" />
              <span>Re-generate</span>
            </button>
            <button
              class="assessment-insights-modal__close"
              type="button"
              aria-label="Close AI Assessment Insights"
              @click="closeOverlay"
            >
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="assessment-insights-modal__body">
          <div class="assessment-insights-layout">
            <div class="assessment-insights-main">
              <section class="candidate-overview-card">
                <div class="candidate-overview-card__identity">
                  <span class="candidate-overview-card__avatar">{{ candidateInitials }}</span>
                  <div>
                    <h3>{{ candidateName }}</h3>
                    <p>{{ candidateRole }}</p>
                    <span class="candidate-overview-card__badge">Assessment Completed</span>
                  </div>
                </div>

                <div class="candidate-overview-card__stats">
                  <article>
                    <small>Stage</small>
                    <strong>Assessment</strong>
                  </article>
                  <article>
                    <small>Completed On</small>
                    <strong>Apr 24, 2025</strong>
                  </article>
                  <article>
                    <small>Assessments Done</small>
                    <strong>4 / 4</strong>
                  </article>
                  <article class="is-confidence">
                    <small>AI Confidence</small>
                    <strong>94%</strong>
                    <em>High</em>
                  </article>
                  <article class="is-evidence">
                    <small>Evidence Quality</small>
                    <strong><AppIcon name="checkCircle" :size="14" /> Strong</strong>
                    <em>High quality, consistent evidence</em>
                  </article>
                </div>
              </section>

              <section class="insight-section">
                <div class="insight-section__title">
                  <AppIcon name="spark" :size="15" />
                  <span>AI Executive Summary</span>
                </div>
                <p class="insight-section__summary">
                  {{ candidateFirstName }} has demonstrated consistently strong analytical ability and problem-solving
                  skills across all assessments. The evidence strongly supports technical and analytical capabilities. Communication,
                  collaboration, and stakeholder management have not been assessed and should be explored in the next step.
                </p>

                <div class="insight-chip-list">
                  <span
                    v-for="chip in summaryChips"
                    :key="chip.label"
                    class="insight-chip"
                    :class="`is-${chip.tone}`"
                  >
                    <AppIcon :name="chip.icon" :size="14" />
                    <span>{{ chip.label }}</span>
                  </span>
                </div>
              </section>

              <section class="insight-section">
                <h4 class="insight-section__label">Assessment Performance</h4>

                <div class="performance-table">
                  <div class="performance-table__head">
                    <span>Assessment</span>
                    <span>Score</span>
                    <span>Percentile</span>
                    <span>AI Insight</span>
                    <span>Evidence Strength</span>
                  </div>

                  <article v-for="row in performanceRows" :key="row.title" class="performance-table__row">
                    <div class="performance-table__assessment">
                      <span class="performance-table__assessment-icon">
                        <AppIcon :name="row.icon" :size="16" />
                      </span>
                      <strong>{{ row.title }}</strong>
                    </div>

                    <div class="performance-table__score">
                      <AppIcon name="checkCircle" :size="14" />
                      <strong>{{ row.score }}</strong>
                    </div>

                    <strong class="performance-table__percentile">{{ row.percentile }}</strong>
                    <p class="performance-table__insight">{{ row.insight }}</p>

                    <div class="performance-table__strength">
                      <div class="strength-bars">
                        <i
                          v-for="bar in row.bars"
                          :key="`${row.title}-${bar}`"
                          :class="{ 'is-filled': bar <= row.filledBars, [`is-${row.tone}`]: true }"
                        />
                      </div>
                      <span :class="`is-${row.tone}`">{{ row.strength }}</span>
                    </div>
                  </article>
                </div>
              </section>

              <div class="insight-bottom-grid">
                <section class="insight-section">
                  <div class="insight-section__title">
                    <AppIcon name="checkCircle" :size="15" />
                    <span>Cross-Assessment Findings</span>
                  </div>

                  <div class="findings-list">
                    <article v-for="item in findings" :key="item.label">
                      <span :class="`is-${item.tone}`">
                        <AppIcon :name="item.tone === 'amber' ? 'alert' : 'check'" :size="14" />
                      </span>
                      <p>{{ item.label }}</p>
                    </article>
                  </div>
                </section>

                <section class="insight-section">
                  <div class="insight-section__title">
                    <AppIcon name="users" :size="15" />
                    <span>Recruiter Feedback Alignment</span>
                  </div>

                  <div class="feedback-alignment-list">
                    <article v-for="item in feedbackAlignment" :key="item.name">
                      <div class="feedback-alignment-list__identity">
                        <span>{{ item.name.split(' ').map((part) => part[0]).join('') }}</span>
                        <div>
                          <strong>{{ item.name }}</strong>
                          <small>{{ item.role }}</small>
                        </div>
                      </div>

                      <div class="feedback-alignment-list__copy">
                        <p>"{{ item.quote }}"</p>
                        <div class="feedback-alignment-list__meta">
                          <strong :class="`is-${item.tone}`">{{ item.status }}</strong>
                          <small>{{ item.note }}</small>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>
              </div>
            </div>

            <aside class="assessment-insights-side">
              <section class="side-panel">
                <div class="side-panel__title">
                  <AppIcon name="spark" :size="15" />
                  <span>AI Recommendation</span>
                </div>
                <p class="side-panel__subtitle">What should happen next?</p>

                <div class="side-panel__recommendation-card">
                  <small>Recommended Next Action</small>
                  <div class="side-panel__recommendation-head">
                    <span>
                      <AppIcon name="shield" :size="18" />
                    </span>
                    <div>
                      <strong>Schedule Behavioral Interview</strong>
                      <p>Analytical and technical skills are validated. Focus on communication, collaboration and stakeholder management.</p>
                    </div>
                  </div>

                  <div class="side-panel__recommendation-actions">
                    <button class="side-panel__primary-button" type="button">Create Interview</button>
                    <button class="side-panel__link-button" type="button">Why this?</button>
                  </div>
                </div>
              </section>

              <section class="side-panel">
                <h4 class="side-panel__section-label">Other Possible Actions</h4>

                <div class="possible-actions-list">
                  <article v-for="item in possibleActions" :key="item.title">
                    <span class="possible-actions-list__icon" :class="`is-${item.tone}`">
                      <AppIcon :name="item.icon" :size="16" />
                    </span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.note }}</p>
                    </div>
                    <AppIcon name="chevronRight" :size="15" />
                  </article>
                </div>
              </section>

              <section class="side-panel">
                <h4 class="side-panel__section-label">Missing Evidence (Focus for Next Step)</h4>

                <div class="missing-evidence-list">
                  <article v-for="item in missingEvidence" :key="item">
                    <AppIcon name="alert" :size="14" />
                    <span>{{ item }}</span>
                  </article>
                </div>
              </section>

              <section class="side-panel">
                <h4 class="side-panel__section-label">Next Evaluation Status</h4>

                <div class="next-evaluation-card">
                  <span><AppIcon name="calendar" :size="22" /></span>
                  <strong>No interviews scheduled yet</strong>
                  <p>AI recommends scheduling a Behavioral Interview to validate missing competencies.</p>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="assessment-insights-modal__footer">
          <p>
            <AppIcon name="info" :size="13" />
            <span>AI insights are based on assessment data and recruiter feedback.</span>
          </p>

          <div class="assessment-insights-modal__footer-actions">
            <button type="button">
              <AppIcon name="document" :size="15" />
              <span>Download PDF</span>
            </button>
            <button class="is-primary" type="button" @click="closeOverlay">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.assessment-insights-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.assessment-insights-modal {
  width: min(1420px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #dde6f3;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.assessment-insights-modal__header,
.assessment-insights-modal__title,
.assessment-insights-modal__header-actions,
.candidate-overview-card__identity,
.candidate-overview-card__stats,
.insight-section__title,
.insight-chip,
.performance-table__assessment,
.performance-table__score,
.findings-list article,
.feedback-alignment-list__identity,
.feedback-alignment-list__meta,
.side-panel__title,
.side-panel__recommendation-head,
.side-panel__recommendation-actions,
.possible-actions-list article,
.missing-evidence-list article,
.assessment-insights-modal__footer,
.assessment-insights-modal__footer p,
.assessment-insights-modal__footer-actions,
.assessment-insights-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.assessment-insights-modal__header,
.assessment-insights-modal__footer {
  justify-content: space-between;
}

.assessment-insights-modal__header {
  padding: 18px 24px;
  border-bottom: 1px solid #e7edf6;
}

.assessment-insights-modal__title {
  gap: 12px;
}

.assessment-insights-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(180deg, #5f55f3 0%, #4b44d4 100%);
  color: #fff;
  flex: 0 0 40px;
}

.assessment-insights-modal__title h2,
.candidate-overview-card__identity h3,
.side-panel__recommendation-head strong,
.next-evaluation-card strong {
  margin: 0;
  color: #20283a;
}

.assessment-insights-modal__title p,
.candidate-overview-card__identity p,
.insight-section__summary,
.performance-table__insight,
.feedback-alignment-list__copy p,
.side-panel__subtitle,
.side-panel__recommendation-head p,
.possible-actions-list p,
.next-evaluation-card p,
.assessment-insights-modal__footer p,
.candidate-overview-card__stats article em,
.feedback-alignment-list__identity small,
.feedback-alignment-list__meta small {
  margin: 0;
  color: #6f7b90;
}

.assessment-insights-modal__title h2 {
  font-size: 1rem;
}

.assessment-insights-modal__title p {
  margin-top: 4px;
  font-size: 0.92rem;
}

.assessment-insights-modal__header-actions {
  gap: 10px;
}

.assessment-insights-modal__header-actions button,
.assessment-insights-modal__footer-actions button {
  height: 40px;
  border: 1px solid #dbe4f1;
  border-radius: 12px;
  background: #fff;
  color: #42506a;
  font: inherit;
  cursor: pointer;
}

.assessment-insights-modal__header-actions button {
  gap: 8px;
  padding: 0 16px;
}

.assessment-insights-modal__close {
  width: 40px;
  padding: 0;
  justify-content: center;
}

.assessment-insights-modal__body {
  overflow: auto;
}

.assessment-insights-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 382px;
  min-height: 100%;
}

.assessment-insights-main {
  padding: 24px;
}

.assessment-insights-side {
  padding: 24px;
  border-left: 1px solid #e7edf6;
  background: #fff;
}

.candidate-overview-card {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  padding: 16px 18px;
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: #fff;
}

.candidate-overview-card__identity {
  gap: 14px;
}

.candidate-overview-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border: 2px solid #eef2f8;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.15) 38%),
    linear-gradient(135deg, #e5e7eb 0%, #cfd7e3 100%);
  color: #5c6981;
  font-weight: 800;
  flex: 0 0 54px;
}

.candidate-overview-card__identity h3 {
  font-size: 1rem;
}

.candidate-overview-card__identity p {
  margin-top: 4px;
}

.candidate-overview-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 999px;
  background: #dff8ec;
  color: #0d9a62;
  font-size: 0.74rem;
  font-weight: 700;
}

.candidate-overview-card__stats {
  justify-content: space-between;
  gap: 0;
}

.candidate-overview-card__stats article {
  min-width: 0;
  padding: 8px 16px;
  border-left: 1px solid #e9eef7;
}

.candidate-overview-card__stats article:first-child {
  border-left: 0;
}

.candidate-overview-card__stats article small,
.insight-section__label,
.performance-table__head,
.side-panel__section-label,
.side-panel__recommendation-card small {
  display: block;
  color: #9aa4b7;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.candidate-overview-card__stats article strong {
  display: block;
  margin-top: 6px;
  color: #20283a;
  font-size: 0.95rem;
}

.candidate-overview-card__stats article em {
  display: block;
  margin-top: 4px;
  font-size: 0.78rem;
  font-style: normal;
}

.candidate-overview-card__stats article.is-confidence strong {
  color: #0ea76e;
  font-size: 1.85rem;
  line-height: 1;
}

.candidate-overview-card__stats article.is-confidence em {
  color: #0ea76e;
  font-weight: 700;
}

.candidate-overview-card__stats article.is-evidence strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0e9f67;
}

.candidate-overview-card__stats article.is-evidence em {
  max-width: 110px;
  line-height: 1.35;
}

.insight-section {
  margin-top: 28px;
}

.insight-section__title {
  gap: 8px;
  color: #4657f0;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.insight-section__summary {
  margin-top: 12px;
  font-size: 0.98rem;
  line-height: 1.72;
}

.insight-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.insight-chip {
  gap: 8px;
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
}

.insight-chip.is-green {
  border-color: #bef0d6;
  background: #ecfbf3;
  color: #0d8f5d;
}

.insight-chip.is-amber {
  border-color: #ffd7b5;
  background: #fff5ea;
  color: #d96b12;
}

.insight-section__label {
  margin-bottom: 16px;
}

.performance-table {
  border-top: 1px solid #edf2f8;
}

.performance-table__head,
.performance-table__row {
  display: grid;
  grid-template-columns: 310px 112px 92px minmax(220px, 1fr) 150px;
  gap: 14px;
}

.performance-table__head {
  padding: 14px 16px;
  background: #f7f9fc;
  color: #7d8798;
}

.performance-table__row {
  align-items: center;
  padding: 18px 16px;
  border-bottom: 1px solid #edf2f8;
}

.performance-table__assessment {
  gap: 12px;
}

.performance-table__assessment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f3f5ff;
  color: #5b59f1;
  flex: 0 0 32px;
}

.performance-table__score {
  gap: 8px;
  color: #0fa66d;
}

.performance-table__score strong,
.performance-table__percentile {
  color: #20283a;
}

.performance-table__insight {
  line-height: 1.45;
}

.performance-table__strength {
  display: grid;
  gap: 6px;
  justify-items: start;
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bars i {
  width: 14px;
  height: 8px;
  border-radius: 3px;
  background: #e3e8f1;
}

.strength-bars i.is-filled.is-green {
  background: #10a66d;
}

.strength-bars i.is-filled.is-pink {
  background: #f26cb0;
}

.strength-bars i.is-filled.is-orange {
  background: #ff9a45;
}

.performance-table__strength span {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.performance-table__strength span.is-green {
  color: #0ea76e;
}

.performance-table__strength span.is-pink {
  color: #f26cb0;
}

.performance-table__strength span.is-orange {
  color: #ff8a21;
}

.insight-bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 28px;
}

.findings-list,
.feedback-alignment-list,
.possible-actions-list,
.missing-evidence-list {
  display: grid;
  gap: 12px;
}

.findings-list article {
  align-items: flex-start;
  gap: 10px;
}

.findings-list article span {
  display: inline-flex;
  margin-top: 2px;
}

.findings-list article span.is-green {
  color: #10a66d;
}

.findings-list article span.is-amber {
  color: #f5891f;
}

.findings-list article p {
  margin: 0;
  color: #445066;
}

.feedback-alignment-list__identity {
  gap: 12px;
}

.feedback-alignment-list__identity span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2d58f 0%, #507d58 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  flex: 0 0 34px;
}

.feedback-alignment-list__identity strong {
  display: block;
  color: #20283a;
}

.feedback-alignment-list__identity small {
  display: block;
  margin-top: 3px;
}

.feedback-alignment-list__copy {
  margin-top: 8px;
  padding-left: 46px;
}

.feedback-alignment-list__copy p {
  font-style: italic;
}

.feedback-alignment-list__meta {
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.feedback-alignment-list__meta strong {
  font-size: 0.72rem;
  text-transform: uppercase;
}

.feedback-alignment-list__meta strong.is-green {
  color: #0ea76e;
}

.feedback-alignment-list__meta strong.is-orange {
  color: #ff8a21;
}

.feedback-alignment-list__meta strong.is-red {
  color: #f45252;
}

.side-panel + .side-panel {
  margin-top: 24px;
}

.side-panel__title {
  gap: 8px;
  color: #4657f0;
  font-size: 0.83rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.side-panel__subtitle {
  margin-top: 12px;
}

.side-panel__recommendation-card {
  margin-top: 16px;
  padding: 18px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
}

.side-panel__recommendation-head {
  align-items: flex-start;
  gap: 14px;
  margin-top: 14px;
}

.side-panel__recommendation-head > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ecfbf4;
  color: #0ea76e;
  flex: 0 0 40px;
}

.side-panel__recommendation-head p {
  margin-top: 8px;
  line-height: 1.6;
}

.side-panel__recommendation-actions {
  justify-content: space-between;
  gap: 14px;
  margin-top: 20px;
}

.side-panel__primary-button,
.side-panel__link-button {
  min-height: 36px;
  padding: 0 20px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.side-panel__primary-button {
  flex: 1 1 auto;
  border: 0;
  background: linear-gradient(90deg, #f362ab 0%, #ea5ba9 100%);
  color: #fff;
}

.side-panel__link-button {
  flex: 0 0 auto;
  color: #4657f0;
  align-self: center;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

.side-panel__section-label {
  margin: 0 0 14px;
}

.possible-actions-list article {
  gap: 12px;
  padding: 14px;
  border: 1px solid #e7edf6;
  border-radius: 12px;
}

.possible-actions-list__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex: 0 0 32px;
}

.possible-actions-list__icon.is-violet {
  background: #f0efff;
  color: #6156f2;
}

.possible-actions-list__icon.is-green {
  background: #ebfbf3;
  color: #10a66d;
}

.possible-actions-list__icon.is-red {
  background: #fff0f0;
  color: #f15555;
}

.possible-actions-list article div {
  min-width: 0;
  flex: 1;
}

.possible-actions-list article strong {
  display: block;
  color: #20283a;
}

.possible-actions-list article p {
  margin-top: 5px;
  font-size: 0.84rem;
  line-height: 1.45;
}

.possible-actions-list article > :deep(svg:last-child) {
  color: #c0c8d6;
}

.missing-evidence-list article {
  gap: 10px;
  color: #445066;
}

.missing-evidence-list article :deep(svg) {
  color: #f5891f;
}

.next-evaluation-card {
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 28px 20px;
  border: 1px solid #d7def8;
  border-radius: 16px;
  background: #f6f8ff;
  text-align: center;
}

.next-evaluation-card > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  color: #5a54f3;
}

.next-evaluation-card p {
  line-height: 1.55;
}

.assessment-insights-modal__footer {
  padding: 16px 24px;
  border-top: 1px solid #e7edf6;
}

.assessment-insights-modal__footer p {
  gap: 8px;
  font-size: 0.82rem;
}

.assessment-insights-modal__footer p :deep(svg) {
  color: #94a0b4;
}

.assessment-insights-modal__footer-actions {
  display: flex;
  gap: 12px;
}

.assessment-insights-modal__footer-actions button {
  gap: 8px;
  padding: 0 18px;
}

.assessment-insights-modal__footer-actions button.is-primary {
  min-width: 104px;
  border: 0;
  background: linear-gradient(180deg, #5950ef 0%, #473fd8 100%);
  color: #fff;
}

@media (max-width: 1240px) {
  .assessment-insights-layout {
    grid-template-columns: 1fr;
  }

  .assessment-insights-side {
    border-top: 1px solid #e7edf6;
    border-left: 0;
  }
}

@media (max-width: 1080px) {
  .candidate-overview-card,
  .insight-bottom-grid {
    grid-template-columns: 1fr;
  }

  .candidate-overview-card__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .candidate-overview-card__stats article {
    padding: 0;
    border-left: 0;
  }

  .performance-table {
    overflow-x: auto;
  }

  .performance-table__head,
  .performance-table__row {
    min-width: 860px;
  }
}

@media (max-width: 720px) {
  .assessment-insights-overlay {
    padding: 10px;
  }

  .assessment-insights-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .assessment-insights-modal__header,
  .assessment-insights-main,
  .assessment-insights-side,
  .assessment-insights-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .assessment-insights-modal__header,
  .assessment-insights-modal__footer {
    display: grid;
    gap: 14px;
  }

  .assessment-insights-modal__header-actions,
  .assessment-insights-modal__footer-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .candidate-overview-card__stats {
    grid-template-columns: 1fr;
  }
}
</style>
