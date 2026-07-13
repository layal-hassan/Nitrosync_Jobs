<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
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
  candidateStage: {
    type: String,
    default: 'Validation',
  },
})

const emit = defineEmits(['close', 'add-risk-note', 'continue-next-stage'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')
const overlayOpenedAt = ref(0)
const bodyRef = ref(null)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const profileFacts = computed(() => ([
  { label: 'Department', value: 'Engineering' },
  { label: 'Location', value: 'San Francisco, CA' },
  { label: 'Employment Type', value: 'Full-time' },
  { label: 'Current Stage', value: props.candidateStage, stage: true },
  { label: 'Last Updated', value: 'May 25, 2026 - 10:24 AM', meta: 'By NitroSync AI' },
]))

const keyTakeawayBullets = [
  'The candidate presents a low overall risk.',
  'Address the medium risks to further increase confidence.',
]

const topRisks = [
  'Employment gap identified (2 months)',
  'Second reference pending',
  'Assessment score below top tier',
]

const riskBreakdownRows = [
  {
    area: 'Experience & Background',
    subtitle: 'Work history, gap analysis',
    level: 'Medium',
    tone: 'orange',
    score: '42%',
    progress: 42,
    finding: '2-month employment gap (Mar-Apr 2023). Relevant experience matches 85%.',
    impact: 'Medium\n40%',
    mitigation: 'Clarify gap in final interview.',
    action: 'Request Explanation',
    actionTone: 'pink',
    icon: 'briefcase',
  },
  {
    area: 'Skills & Competency',
    subtitle: 'Technical and soft skills',
    level: 'Low',
    tone: 'green',
    score: '15%',
    progress: 15,
    finding: 'Strong match across key skills. Assessment scores slightly below top tier.',
    impact: 'Low\n20%',
    mitigation: 'No action needed.',
    action: 'View Details',
    actionTone: 'ghost',
    icon: 'chart-bars',
  },
  {
    area: 'References & Reputation',
    subtitle: 'Feedback and reputation',
    level: 'Medium',
    tone: 'orange',
    score: '35%',
    progress: 35,
    finding: 'One reference responded late. Overall feedback is positive.',
    impact: 'Medium\n20%',
    mitigation: 'Request second reference (optional).',
    action: 'Request Reference',
    actionTone: 'pink',
    icon: 'users',
  },
  {
    area: 'Background & Compliance',
    subtitle: 'Background check details',
    level: 'None',
    tone: 'slate',
    score: '0%',
    progress: 0,
    finding: 'All background checks cleared. No issues identified.',
    impact: 'None\n10%',
    mitigation: 'No action needed.',
    action: 'View Details',
    actionTone: 'ghost',
    icon: 'shield',
  },
]

const recommendationRows = [
  {
    title: 'Clarify Employment Gap',
    description: 'Address the 2-month gap found in history.',
    reduction: '-12%',
    button: 'Request Explanation',
  },
  {
    title: 'Request Second Reference',
    description: 'Strengthen validation with additional input.',
    reduction: '-10%',
    button: 'Request Reference',
  },
  {
    title: 'Review Assessment Areas',
    description: 'Review areas scored below top tier.',
    reduction: '-5%',
    button: 'Review Assessment',
  },
]

const outstandingActions = [
  { label: 'Clarify employment gap', tone: 'orange', impact: 'High impact', eta: '2 days' },
  { label: 'Request second reference', tone: 'orange', impact: 'Medium impact', eta: '1 day' },
  { label: 'Review assessment areas', tone: 'yellow', impact: 'Low impact', eta: '4 hours' },
]

const timelineRows = [
  ['Application Received', 'May 10', 'document'],
  ['Interviews Completed', 'May 15', 'users'],
  ['Assessments Completed', 'May 18', 'chart-bars'],
  ['References In Progress', 'May 22', 'users'],
  ['Background Check Cleared', 'May 24', 'shield'],
  ['Current risk', '18%', 'alert'],
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

function handleBackdropClick() {
  if (!overlayOpenedAt.value || Date.now() - overlayOpenedAt.value < 180) {
    return
  }

  closeOverlay()
}

function addRiskNote() {
  emit('add-risk-note')
  emit('close')
}

function continueToNextStage() {
  emit('continue-next-stage')
  emit('close')
}

watch(
  () => props.open,
  async (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      overlayOpenedAt.value = Date.now()
      await nextTick()

      if (bodyRef.value) {
        bodyRef.value.scrollTop = 0
      }
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-risk-analysis-overlay" @click.self="handleBackdropClick">
      <section class="ai-risk-analysis-modal">
        <header class="ai-risk-analysis-head">
          <div>
            <div class="ai-risk-analysis-head__title">
              <span class="ai-risk-analysis-head__icon">
                <AppIcon name="shield" :size="16" />
              </span>
              <h2>AI Risk Analysis</h2>
              <em>AI</em>
            </div>
            <p>Identify potential risks that could impact this hire.</p>
          </div>

          <div class="ai-risk-analysis-head__actions">
            <button type="button" class="ai-risk-analysis-download">
              <AppIcon name="document" :size="14" />
              <span>Download report</span>
            </button>
            <button class="ai-risk-analysis-close" type="button" aria-label="Close AI Risk Analysis" @click="closeOverlay">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div ref="bodyRef" class="ai-risk-analysis-body">
          <section class="ai-risk-analysis-profile">
            <div class="ai-risk-analysis-profile__identity">
              <span class="ai-risk-analysis-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <button type="button" class="ai-risk-analysis-link">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="12" />
                </button>
              </div>
            </div>

            <div class="ai-risk-analysis-profile__facts">
              <article v-for="item in profileFacts" :key="item.label">
                <small>{{ item.label }}</small>
                <strong :class="{ 'is-stage': item.stage }">{{ item.value }}</strong>
                <span v-if="item.meta">{{ item.meta }}</span>
              </article>
            </div>
          </section>

          <div class="ai-risk-analysis-top-grid">
            <section class="ai-risk-analysis-card ai-risk-analysis-card--summary">
              <div class="ai-risk-analysis-score">
                <small>Overall Hiring Risk</small>
                <strong>18%</strong>
                <span>Low Risk</span>
              </div>

              <div class="ai-risk-analysis-summary-metrics">
                <article><small>AI Confidence</small><strong>96%</strong></article>
                <article><small>Evidence Coverage</small><strong>98%</strong></article>
              </div>
            </section>

            <section class="ai-risk-analysis-card">
              <div class="ai-risk-analysis-card__head">
                <strong>Risk Severity Distribution</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-risk-analysis-distribution">
                <article><strong>0</strong><span class="is-pink">High Risk</span></article>
                <article><strong>2</strong><span class="is-orange">Medium Risk</span></article>
                <article><strong>3</strong><span class="is-green">Low Risk</span></article>
                <article><strong>5</strong><span class="is-slate">No Risk</span></article>
              </div>

              <div class="ai-risk-analysis-bar">
                <span class="is-pink" />
                <span class="is-orange" />
                <span class="is-green" />
                <span class="is-slate" />
              </div>

              <p>10 Total Risk Areas Analyzed</p>
            </section>

            <section class="ai-risk-analysis-card">
              <div class="ai-risk-analysis-card__head ai-risk-analysis-card__head--star">
                <AppIcon name="sparkles" :size="14" />
                <strong>Key Takeaway</strong>
              </div>

              <div class="ai-risk-analysis-bullets">
                <p v-for="item in keyTakeawayBullets" :key="item">{{ item }}</p>
              </div>

              <div class="ai-risk-analysis-top-risks">
                <strong>Top Risks</strong>
                <ul>
                  <li v-for="item in topRisks" :key="item">{{ item }}</li>
                </ul>
              </div>
            </section>
          </div>

          <div class="ai-risk-analysis-main-grid">
            <section class="ai-risk-analysis-card">
              <div class="ai-risk-analysis-section-head">
                <strong>Risk Breakdown</strong>
                <small>Detailed analysis across key risk areas.</small>
              </div>

              <div class="ai-risk-analysis-table">
                <div class="ai-risk-analysis-table__head">
                  <span>Risk Area</span>
                  <span>Risk Level</span>
                  <span>Risk Score</span>
                  <span>What We Found</span>
                  <span>Impact</span>
                  <span>Mitigation</span>
                  <span>Action</span>
                </div>

                <article v-for="row in riskBreakdownRows" :key="row.area" class="ai-risk-analysis-table__row">
                  <div class="ai-risk-analysis-table__area">
                    <span class="ai-risk-analysis-table__icon" :class="`is-${row.tone}`">
                      <AppIcon :name="row.icon" :size="14" />
                    </span>
                    <div>
                      <strong>{{ row.area }}</strong>
                      <small>{{ row.subtitle }}</small>
                    </div>
                  </div>

                  <span class="ai-risk-analysis-pill" :class="`is-${row.tone}`">{{ row.level }}</span>

                  <div class="ai-risk-analysis-table__score">
                    <strong>{{ row.score }}</strong>
                    <div class="ai-risk-analysis-progress">
                      <span :class="`is-${row.tone}`" :style="{ width: `${row.progress}%` }" />
                    </div>
                  </div>

                  <p>{{ row.finding }}</p>
                  <p class="ai-risk-analysis-table__compact">{{ row.impact }}</p>
                  <p class="ai-risk-analysis-table__compact">{{ row.mitigation }}</p>

                  <button type="button" class="ai-risk-analysis-action" :class="`is-${row.actionTone}`">
                    <span>{{ row.action }}</span>
                    <AppIcon v-if="row.actionTone === 'pink'" name="external-link" :size="12" />
                    <AppIcon v-else name="chevronDown" :size="12" />
                  </button>
                </article>
              </div>
            </section>

            <aside class="ai-risk-analysis-side">
              <section class="ai-risk-analysis-card">
                <div class="ai-risk-analysis-section-head">
                  <strong>AI Recommendations</strong>
                  <small>Take these actions to reduce risk and increase confidence.</small>
                </div>

                <div class="ai-risk-analysis-recommendations">
                  <article v-for="(item, index) in recommendationRows" :key="item.title">
                    <div class="ai-risk-analysis-recommendations__head">
                      <span>{{ index + 1 }}</span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.description }}</p>
                      </div>
                      <em>{{ item.reduction }}</em>
                    </div>

                    <button type="button">
                      <span>{{ item.button }}</span>
                      <AppIcon name="external-link" :size="12" />
                    </button>
                  </article>
                </div>
              </section>

              <section class="ai-risk-analysis-card">
                <div class="ai-risk-analysis-section-head">
                  <strong>Projected Risk After Action</strong>
                </div>

                <div class="ai-risk-analysis-projection">
                  <article><small>Current Risk</small><strong>18%</strong></article>
                  <article><small>Projected Risk</small><strong class="is-green">6%</strong></article>
                  <article><small>Risk Reduction</small><strong class="is-green">-12%</strong></article>
                </div>

                <div class="ai-risk-analysis-projection__graph">
                  <span />
                </div>
              </section>
            </aside>
          </div>

          <div class="ai-risk-analysis-bottom-grid">
            <section class="ai-risk-analysis-card">
              <div class="ai-risk-analysis-section-head">
                <strong>Outstanding Actions</strong>
                <small>Complete these items to reduce risk.</small>
              </div>

              <div class="ai-risk-analysis-actions-list">
                <article v-for="item in outstandingActions" :key="item.label">
                  <span class="ai-risk-analysis-dot" :class="`is-${item.tone}`" />
                  <div>
                    <strong>{{ item.label }}</strong>
                    <small>{{ item.impact }}</small>
                  </div>
                  <em>{{ item.eta }}</em>
                </article>
              </div>
            </section>

            <section class="ai-risk-analysis-card">
              <div class="ai-risk-analysis-section-head">
                <strong>Risk Timeline</strong>
                <small>How risks were identified throughout the process.</small>
              </div>

              <div class="ai-risk-analysis-timeline">
                <div class="ai-risk-analysis-timeline__line" />
                <article v-for="item in timelineRows" :key="item[0]">
                  <span>
                    <AppIcon :name="item[2]" :size="12" />
                  </span>
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </article>
              </div>
            </section>
          </div>
        </div>

        <footer class="ai-risk-analysis-foot">
          <div class="ai-risk-analysis-foot__meta">
            <article>
              <AppIcon name="shield" :size="14" />
              <div><strong>Risk Model v3.4</strong><small>Last analyzed 2 minutes ago</small></div>
            </article>
            <article>
              <AppIcon name="document" :size="14" />
              <div><strong>Evidence coverage</strong><small>98%</small></div>
            </article>
            <article>
              <AppIcon name="chart-bars" :size="14" />
              <div><strong>Data points analyzed</strong><small>50+</small></div>
            </article>
          </div>

          <div class="ai-risk-analysis-foot__actions">
            <button type="button" class="ai-risk-analysis-secondary" @click="addRiskNote">Add Risk Note</button>
            <button type="button" class="ai-risk-analysis-primary" @click="continueToNextStage">Reduce Risk & Continue</button>
            <button type="button" class="ai-risk-analysis-close-button" @click="closeOverlay">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-risk-analysis-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
}

.ai-risk-analysis-modal {
  width: min(1460px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e7edf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
}

.ai-risk-analysis-head,
.ai-risk-analysis-head__title,
.ai-risk-analysis-head__actions,
.ai-risk-analysis-profile__identity,
.ai-risk-analysis-card__head,
.ai-risk-analysis-section-head,
.ai-risk-analysis-table__area,
.ai-risk-analysis-recommendations__head,
.ai-risk-analysis-actions-list article,
.ai-risk-analysis-foot,
.ai-risk-analysis-foot__meta,
.ai-risk-analysis-foot__meta article,
.ai-risk-analysis-foot__actions {
  display: flex;
  align-items: center;
}

.ai-risk-analysis-head {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
}

.ai-risk-analysis-head__title {
  gap: 8px;
}

.ai-risk-analysis-head__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-risk-analysis-head h2 {
  margin: 0;
  color: #243454;
  font-size: 1.05rem;
}

.ai-risk-analysis-head em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-risk-analysis-head p {
  margin: 2px 0 0;
  color: #8390aa;
  font-size: 0.7rem;
}

.ai-risk-analysis-head__actions {
  gap: 8px;
}

.ai-risk-analysis-download,
.ai-risk-analysis-close,
.ai-risk-analysis-action,
.ai-risk-analysis-recommendations button,
.ai-risk-analysis-secondary,
.ai-risk-analysis-primary,
.ai-risk-analysis-close-button {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.ai-risk-analysis-download {
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #334155;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-risk-analysis-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #66758f;
}

.ai-risk-analysis-body {
  overflow: auto;
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 156, 0.05), transparent 18%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.ai-risk-analysis-profile,
.ai-risk-analysis-card {
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(27, 39, 76, 0.04);
}

.ai-risk-analysis-profile {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 16px;
}

.ai-risk-analysis-profile__identity {
  align-items: flex-start;
  gap: 12px;
}

.ai-risk-analysis-profile__avatar {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d1d1d 0%, #db8a6d 100%);
  color: #fff;
  font-weight: 800;
}

.ai-risk-analysis-profile__identity strong {
  display: block;
  color: #243454;
  font-size: 0.92rem;
}

.ai-risk-analysis-profile__identity p {
  margin: 3px 0 0;
  color: #73829d;
  font-size: 0.72rem;
}

.ai-risk-analysis-link {
  margin-top: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #ff4f9c;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-risk-analysis-profile__facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.ai-risk-analysis-profile__facts small,
.ai-risk-analysis-score small,
.ai-risk-analysis-summary-metrics small,
.ai-risk-analysis-projection small {
  display: block;
  color: #95a1b6;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-risk-analysis-profile__facts strong {
  display: block;
  margin-top: 5px;
  color: #243454;
  font-size: 0.74rem;
}

.ai-risk-analysis-profile__facts span {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
  font-size: 0.63rem;
}

.ai-risk-analysis-profile__facts strong.is-stage {
  color: #ff4f9c;
}

.ai-risk-analysis-top-grid,
.ai-risk-analysis-main-grid,
.ai-risk-analysis-bottom-grid {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.ai-risk-analysis-top-grid {
  grid-template-columns: 0.92fr 1.05fr 0.95fr;
}

.ai-risk-analysis-main-grid {
  grid-template-columns: 1.35fr 0.95fr;
}

.ai-risk-analysis-bottom-grid {
  grid-template-columns: 0.92fr 1.08fr;
}

.ai-risk-analysis-card {
  padding: 14px;
}

.ai-risk-analysis-card--summary {
  background: linear-gradient(180deg, rgba(255, 90, 167, 0.05) 0%, #fff 100%);
}

.ai-risk-analysis-score strong {
  display: block;
  margin-top: 4px;
  color: #1f2940;
  font-size: 2.1rem;
  line-height: 1;
}

.ai-risk-analysis-score span {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 999px;
  background: #ecfbf3;
  color: #19b66b;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-risk-analysis-summary-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #eef2fb;
}

.ai-risk-analysis-summary-metrics strong,
.ai-risk-analysis-distribution strong,
.ai-risk-analysis-projection strong {
  display: block;
  margin-top: 6px;
  color: #243454;
  font-size: 0.88rem;
}

.ai-risk-analysis-card__head,
.ai-risk-analysis-section-head {
  justify-content: space-between;
  gap: 8px;
}

.ai-risk-analysis-card__head strong,
.ai-risk-analysis-section-head strong,
.ai-risk-analysis-table__area strong,
.ai-risk-analysis-recommendations strong,
.ai-risk-analysis-actions-list strong {
  color: #243454;
}

.ai-risk-analysis-card__head--star {
  justify-content: flex-start;
}

.ai-risk-analysis-card__head :deep(svg:last-child) {
  color: #a7b2c6;
}

.ai-risk-analysis-distribution {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.ai-risk-analysis-distribution article {
  text-align: center;
}

.ai-risk-analysis-distribution span {
  display: block;
  margin-top: 6px;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-risk-analysis-distribution .is-pink { color: #ff4f9c; }
.ai-risk-analysis-distribution .is-orange { color: #fb923c; }
.ai-risk-analysis-distribution .is-green { color: #19b66b; }
.ai-risk-analysis-distribution .is-slate { color: #94a3b8; }

.ai-risk-analysis-bar {
  display: grid;
  grid-template-columns: 0fr 2fr 3fr 5fr;
  gap: 2px;
  height: 6px;
  margin-top: 16px;
  border-radius: 999px;
  overflow: hidden;
  background: #eef2fb;
}

.ai-risk-analysis-bar span { display: block; }
.ai-risk-analysis-bar .is-pink { background: #ff4f9c; }
.ai-risk-analysis-bar .is-orange { background: #fb923c; }
.ai-risk-analysis-bar .is-green { background: #19b66b; }
.ai-risk-analysis-bar .is-slate { background: #cfd7e6; }

.ai-risk-analysis-top-grid p,
.ai-risk-analysis-bullets p,
.ai-risk-analysis-table p,
.ai-risk-analysis-recommendations p {
  margin: 0;
  color: #748197;
  line-height: 1.55;
}

.ai-risk-analysis-top-grid > .ai-risk-analysis-card:nth-child(2) > p {
  margin-top: 12px;
  text-align: center;
  font-size: 0.68rem;
}

.ai-risk-analysis-bullets {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.ai-risk-analysis-top-risks {
  margin-top: 16px;
}

.ai-risk-analysis-top-risks strong {
  display: block;
  color: #243454;
}

.ai-risk-analysis-top-risks ul {
  margin: 10px 0 0;
  padding: 0 0 0 18px;
  color: #748197;
  display: grid;
  gap: 8px;
}

.ai-risk-analysis-section-head {
  align-items: flex-start;
  flex-direction: column;
}

.ai-risk-analysis-section-head small {
  color: #96a2b6;
  font-size: 0.68rem;
}

.ai-risk-analysis-table {
  margin-top: 14px;
  border: 1px solid #edf2fb;
  border-radius: 12px;
  overflow: hidden;
}

.ai-risk-analysis-table__head,
.ai-risk-analysis-table__row {
  display: grid;
  grid-template-columns: 1.3fr 0.72fr 0.74fr 1.3fr 0.72fr 0.88fr 0.88fr;
  gap: 12px;
  align-items: start;
}

.ai-risk-analysis-table__head {
  padding: 12px 14px;
  background: #fbfcff;
  color: #95a1b6;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-risk-analysis-table__row {
  padding: 14px;
  border-top: 1px solid #eef2fb;
}

.ai-risk-analysis-table__icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
}

.ai-risk-analysis-table__icon.is-orange {
  background: #fff4e8;
  color: #fb923c;
}

.ai-risk-analysis-table__icon.is-green {
  background: #ecfbf3;
  color: #19b66b;
}

.ai-risk-analysis-table__icon.is-slate {
  background: #f3f6fb;
  color: #94a3b8;
}

.ai-risk-analysis-table__area {
  gap: 10px;
}

.ai-risk-analysis-table__area small {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
  font-size: 0.66rem;
}

.ai-risk-analysis-pill {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 0.64rem;
  font-weight: 800;
}

.ai-risk-analysis-pill.is-orange {
  background: #fff4e8;
  color: #fb923c;
}

.ai-risk-analysis-pill.is-green {
  background: #ecfbf3;
  color: #19b66b;
}

.ai-risk-analysis-pill.is-slate {
  background: #f3f6fb;
  color: #94a3b8;
}

.ai-risk-analysis-table__score strong {
  display: block;
  color: #243454;
  font-size: 0.76rem;
}

.ai-risk-analysis-progress {
  width: 74px;
  height: 4px;
  margin-top: 8px;
  border-radius: 999px;
  background: #eef2fb;
  overflow: hidden;
}

.ai-risk-analysis-progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.ai-risk-analysis-progress .is-orange { background: #fb923c; }
.ai-risk-analysis-progress .is-green { background: #19b66b; }
.ai-risk-analysis-progress .is-slate { background: #cfd7e6; }

.ai-risk-analysis-table__compact {
  white-space: pre-line;
}

.ai-risk-analysis-action {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.64rem;
  font-weight: 700;
}

.ai-risk-analysis-action.is-pink {
  border-color: #ffd4e7;
  color: #ff4f9c;
  background: #fff8fc;
}

.ai-risk-analysis-action.is-ghost {
  color: #54627c;
}

.ai-risk-analysis-side {
  display: grid;
  gap: 10px;
}

.ai-risk-analysis-recommendations {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.ai-risk-analysis-recommendations article {
  padding: 12px;
  border: 1px solid #edf2fb;
  border-radius: 12px;
  background: #fff;
}

.ai-risk-analysis-recommendations__head {
  align-items: flex-start;
  gap: 10px;
}

.ai-risk-analysis-recommendations__head > span {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0f7;
  color: #ff4f9c;
  font-size: 0.66rem;
  font-weight: 800;
  flex: 0 0 22px;
}

.ai-risk-analysis-recommendations__head em {
  color: #19b66b;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 800;
}

.ai-risk-analysis-recommendations button {
  width: 100%;
  min-height: 32px;
  margin-top: 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #ff4f9c;
  background: #fff8fc;
  border-color: #ffd4e7;
  font-size: 0.66rem;
  font-weight: 700;
}

.ai-risk-analysis-projection {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.ai-risk-analysis-projection strong.is-green {
  color: #19b66b;
}

.ai-risk-analysis-projection__graph {
  height: 76px;
  margin-top: 14px;
  border-radius: 10px;
  background:
    linear-gradient(180deg, rgba(25, 182, 107, 0.1) 0%, rgba(25, 182, 107, 0.02) 100%),
    #f8fcfa;
  position: relative;
  overflow: hidden;
}

.ai-risk-analysis-projection__graph span {
  position: absolute;
  inset: auto 0 14px 0;
  height: 2px;
  background: linear-gradient(90deg, #9ad9b4 0%, #19b66b 100%);
  transform: skewX(-36deg);
}

.ai-risk-analysis-actions-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.ai-risk-analysis-actions-list article {
  gap: 10px;
}

.ai-risk-analysis-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
}

.ai-risk-analysis-dot.is-orange { background: #fb923c; }
.ai-risk-analysis-dot.is-yellow { background: #fbbf24; }

.ai-risk-analysis-actions-list small {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
}

.ai-risk-analysis-actions-list em {
  margin-left: auto;
  color: #95a1b6;
  font-style: normal;
  font-size: 0.68rem;
}

.ai-risk-analysis-timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.ai-risk-analysis-timeline__line {
  position: absolute;
  top: 14px;
  left: 32px;
  right: 32px;
  height: 2px;
  background: linear-gradient(90deg, #ffd0e4 0%, #ff4f9c 60%, #cfe8d8 100%);
}

.ai-risk-analysis-timeline article {
  position: relative;
  z-index: 1;
  text-align: center;
}

.ai-risk-analysis-timeline article > span {
  width: 28px;
  height: 28px;
  margin: 0 auto 10px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #ff4f9c;
  box-shadow: 0 0 0 5px #fff;
  border: 1px solid #ffd4e7;
}

.ai-risk-analysis-timeline article:last-child > span {
  background: linear-gradient(135deg, #fff0f7 0%, #ffe4ef 100%);
}

.ai-risk-analysis-timeline strong {
  display: block;
  color: #243454;
  font-size: 0.69rem;
  line-height: 1.4;
}

.ai-risk-analysis-timeline small {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
  font-size: 0.62rem;
}

.ai-risk-analysis-foot {
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border-top: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.03) 0%, #fff 100%);
}

.ai-risk-analysis-foot__meta {
  gap: 20px;
  flex-wrap: wrap;
}

.ai-risk-analysis-foot__meta article {
  gap: 8px;
  color: #ff4f9c;
}

.ai-risk-analysis-foot__meta strong {
  display: block;
  color: #243454;
  font-size: 0.68rem;
}

.ai-risk-analysis-foot__meta small {
  display: block;
  margin-top: 2px;
  color: #8f9cb0;
  font-size: 0.62rem;
}

.ai-risk-analysis-foot__actions {
  gap: 8px;
  flex-wrap: wrap;
}

.ai-risk-analysis-secondary,
.ai-risk-analysis-primary,
.ai-risk-analysis-close-button {
  height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-risk-analysis-secondary {
  color: #ff4f9c;
  border-color: #ffd4e7;
  background: #fff8fc;
}

.ai-risk-analysis-primary {
  border-color: transparent;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-risk-analysis-close-button {
  color: #334155;
}

@media (max-width: 1320px) {
  .ai-risk-analysis-top-grid,
  .ai-risk-analysis-main-grid,
  .ai-risk-analysis-bottom-grid {
    grid-template-columns: 1fr;
  }

  .ai-risk-analysis-profile__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ai-risk-analysis-table {
    overflow-x: auto;
  }

  .ai-risk-analysis-table__head,
  .ai-risk-analysis-table__row {
    min-width: 1080px;
  }
}

@media (max-width: 1040px) {
  .ai-risk-analysis-profile,
  .ai-risk-analysis-foot,
  .ai-risk-analysis-projection,
  .ai-risk-analysis-distribution,
  .ai-risk-analysis-timeline {
    grid-template-columns: 1fr;
  }

  .ai-risk-analysis-head,
  .ai-risk-analysis-head__actions,
  .ai-risk-analysis-foot {
    flex-wrap: wrap;
  }

  .ai-risk-analysis-foot {
    flex-direction: column;
    align-items: flex-start;
  }

  .ai-risk-analysis-timeline__line {
    display: none;
  }

  .ai-risk-analysis-timeline article {
    text-align: left;
  }

  .ai-risk-analysis-timeline article > span {
    margin-left: 0;
  }
}

@media (max-width: 720px) {
  .ai-risk-analysis-overlay {
    padding: 10px;
  }

  .ai-risk-analysis-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 16px;
  }

  .ai-risk-analysis-head,
  .ai-risk-analysis-body,
  .ai-risk-analysis-foot {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ai-risk-analysis-profile__facts {
    grid-template-columns: 1fr;
  }
}
</style>
