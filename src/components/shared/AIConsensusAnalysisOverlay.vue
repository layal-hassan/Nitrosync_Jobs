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

const emit = defineEmits(['close'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')
const overlayOpenedAt = ref(0)
const bodyRef = ref(null)

const consensusScore = 92
const evidenceAlignment = 95
const calibratedConsensus = 98

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

const summaryStats = [
  { value: '5', label: 'Total Reviewers' },
  { value: '4', label: 'Strong Hire', tone: 'green' },
  { value: '1', label: 'Concern', tone: 'orange' },
  { value: '0', label: 'No Hire', tone: 'slate' },
]

const reviewerDistribution = [
  { label: 'Strong Hire', count: 4, color: 'green' },
  { label: 'Hire', count: 1, color: 'orange' },
  { label: 'Concern', count: 0, color: 'pink' },
  { label: 'No Hire', count: 0, color: 'slate' },
]

const trendRows = [
  ['78%', 'After Recruiter'],
  ['86%', 'After Technical'],
  ['88%', 'After HM'],
  ['92%', 'Final Consensus'],
]

const agreementRows = [
  { label: 'Technical Skills', score: 98, tone: 'green', state: 'Strong' },
  { label: 'Problem Solving', score: 95, tone: 'green', state: 'Strong' },
  { label: 'Ownership', score: 94, tone: 'green', state: 'Strong' },
  { label: 'Culture Fit', score: 90, tone: 'green', state: 'Strong' },
  { label: 'Leadership', score: 82, tone: 'orange', state: 'Minor Disagreement' },
  { label: 'Communication', score: 74, tone: 'pink', state: 'Needs Discussion' },
]

const reviewerRows = [
  { interviewer: 'Recruiter', recommendation: 'Strong Hire', alignment: '96%', stars: 5, influence: 'Medium', tone: 'green' },
  { interviewer: 'Technical Lead', recommendation: 'Strong Hire', alignment: '98%', stars: 5, influence: 'High', tone: 'green' },
  { interviewer: 'Engineering Manager', recommendation: 'Hire', alignment: '90%', stars: 4, influence: 'High', tone: 'pink' },
  { interviewer: 'Peer Interviewer', recommendation: 'Hire', alignment: '85%', stars: 4, influence: 'Low', tone: 'green' },
  { interviewer: 'Hiring Manager', recommendation: 'Concern', alignment: '65%', stars: 3, influence: 'High', tone: 'orange' },
]

const disagreementRows = [
  {
    title: 'Communication',
    agreement: '74% Agreement',
    comments: [
      ['Recruiter', 'Expected stronger executive presence in team communication.'],
      ['Hiring Manager', 'Very clear and proactive.'],
    ],
    suggestion: 'Discuss communication examples.',
  },
  {
    title: 'Leadership',
    agreement: '82% Agreement',
    comments: [
      ['Peer Interviewer', 'Shows potential to lead but needs more ownership examples.'],
      ['Engineering Manager', 'Strong leadership mindset; needs more scale examples.'],
    ],
    suggestion: 'Request specific leadership samples.',
  },
]

const evidenceRows = [
  { label: 'Interview Feedback', score: '92%', tone: 'pink' },
  { label: 'Assessment Results', score: '94%', tone: 'green' },
  { label: 'References', score: '100%', tone: 'green' },
  { label: 'Background Check', score: '100%', tone: 'green' },
  { label: 'Work Authorization', score: '100%', tone: 'green' },
]

const recommendationChecklist = [
  'High agreement across all key areas',
  'Disagreements are minor and contextual',
  'Strong validation across evidence sources',
]

const calibrationActions = [
  {
    title: 'Discuss Communication Feedback',
    note: 'Resolve the slight disagreement between Technical Lead and Hiring Manager.',
    eta: '5 min',
    impact: '+5%',
    effect: 'Communication agreement',
  },
  {
    title: 'Discuss Leadership Feedback',
    note: 'Review leadership expectations between Peer and Engineering Manager.',
    eta: '7 min',
    impact: '+3%',
    effect: 'Leadership agreement',
  },
]

const consensusRingStyle = computed(() => ({
  background: `conic-gradient(#ff4f9c 0deg ${consensusScore * 3.6}deg, #eef2fb ${consensusScore * 3.6}deg 360deg)`,
}))

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
    <div v-if="open" class="ai-consensus-overlay" @click.self="handleBackdropClick">
      <section class="ai-consensus-modal">
        <header class="ai-consensus-head">
          <div>
            <div class="ai-consensus-head__title">
              <span class="ai-consensus-head__icon">
                <AppIcon name="users" :size="16" />
              </span>
              <h2>AI Consensus Analysis</h2>
              <em>AI</em>
            </div>
            <p>Understand how aligned your hiring team is on this candidate.</p>
          </div>

          <div class="ai-consensus-head__actions">
            <button type="button" class="ai-consensus-download">
              <AppIcon name="document" :size="14" />
              <span>Download report</span>
            </button>
            <button class="ai-consensus-close" type="button" aria-label="Close AI Consensus Analysis" @click="closeOverlay">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div ref="bodyRef" class="ai-consensus-body">
          <section class="ai-consensus-profile">
            <div class="ai-consensus-profile__identity">
              <span class="ai-consensus-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <button type="button" class="ai-consensus-link">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="12" />
                </button>
              </div>
            </div>

            <div class="ai-consensus-profile__facts">
              <article v-for="item in profileFacts" :key="item.label">
                <small>{{ item.label }}</small>
                <strong :class="{ 'is-stage': item.stage }">{{ item.value }}</strong>
                <span v-if="item.meta">{{ item.meta }}</span>
              </article>
            </div>
          </section>

          <div class="ai-consensus-top-grid">
            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>1.</span>
                <strong>Overall Consensus</strong>
              </div>

              <div class="ai-consensus-hero">
                <div class="ai-consensus-ring" :style="consensusRingStyle">
                  <div>
                    <strong>{{ consensusScore }}%</strong>
                    <span>Strong Agreement</span>
                    <small>★★★★★</small>
                  </div>
                </div>

                <div class="ai-consensus-hero__cta">
                  <button type="button">Proceed to Offer</button>
                </div>
              </div>

              <div class="ai-consensus-summary-stats">
                <article v-for="item in summaryStats" :key="item.label">
                  <strong :class="item.tone ? `is-${item.tone}` : ''">{{ item.value }}</strong>
                  <small>{{ item.label }}</small>
                </article>
              </div>

              <div class="ai-consensus-summary-footer">
                <article><small>AI Confidence</small><strong>96%</strong></article>
                <article><small>Evidence Coverage</small><strong>95%</strong></article>
              </div>
            </section>

            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <strong>Reviewer Decision Distribution</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-consensus-distribution">
                <div class="ai-consensus-distribution__donut">
                  <strong>5</strong>
                  <span>Reviewers</span>
                </div>

                <div class="ai-consensus-distribution__legend">
                  <article v-for="item in reviewerDistribution" :key="item.label">
                    <span :class="`is-${item.color}`" />
                    <strong>{{ item.label }}</strong>
                    <em>{{ item.count }} {{ item.count === 1 ? 'review' : 'reviews' }}</em>
                  </article>
                </div>
              </div>

              <div class="ai-consensus-trend">
                <header>
                  <strong>Consensus Trend</strong>
                  <small>{{ consensusScore }}%</small>
                </header>
                <div class="ai-consensus-trend__rows">
                  <article v-for="item in trendRows" :key="item[1]">
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </article>
                </div>
              </div>
            </section>

            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>2.</span>
                <strong>Agreement by Category</strong>
              </div>

              <div class="ai-consensus-agreement-list">
                <article v-for="item in agreementRows" :key="item.label">
                  <div class="ai-consensus-agreement-list__meta">
                    <strong>{{ item.label }}</strong>
                    <em :class="`is-${item.tone}`">{{ item.score }}%</em>
                  </div>
                  <div class="ai-consensus-agreement-list__bar">
                    <span :class="`is-${item.tone}`" :style="{ width: `${item.score}%` }" />
                  </div>
                  <small :class="`is-${item.tone}`">{{ item.state }}</small>
                </article>
              </div>
            </section>
          </div>

          <div class="ai-consensus-main-grid">
            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>3.</span>
                <strong>Interviewer Alignment</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-consensus-table">
                <div class="ai-consensus-table__head">
                  <span>Interviewer</span>
                  <span>Recommendation</span>
                  <span>Alignment</span>
                  <span>Influence</span>
                </div>

                <article v-for="item in reviewerRows" :key="item.interviewer" class="ai-consensus-table__row">
                  <div class="ai-consensus-table__person">
                    <span :class="`is-${item.tone}`">{{ item.interviewer.slice(0, 2).toUpperCase() }}</span>
                    <strong>{{ item.interviewer }}</strong>
                  </div>
                  <em :class="`is-${item.tone}`">{{ item.recommendation }}</em>
                  <div class="ai-consensus-table__alignment">
                    <strong>{{ item.alignment }}</strong>
                    <small>{{ '★'.repeat(item.stars) }}</small>
                  </div>
                  <p :class="`is-${item.tone}`">{{ item.influence }}</p>
                </article>
              </div>

              <button type="button" class="ai-consensus-link-button">
                <span>View full feedback</span>
                <AppIcon name="external-link" :size="12" />
              </button>
            </section>

            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>4.</span>
                <strong>AI-Detected Disagreements</strong>
                <small>2 areas need discussion</small>
              </div>

              <div class="ai-consensus-disagreements">
                <article v-for="item in disagreementRows" :key="item.title">
                  <div class="ai-consensus-disagreements__head">
                    <strong>{{ item.title }}</strong>
                    <em>{{ item.agreement }}</em>
                  </div>
                  <div class="ai-consensus-disagreements__comments">
                    <div v-for="comment in item.comments" :key="`${item.title}-${comment[0]}`">
                      <strong>{{ comment[0] }}</strong>
                      <p>{{ comment[1] }}</p>
                    </div>
                  </div>
                  <footer>
                    <span>Suggested Action</span>
                    <p>{{ item.suggestion }}</p>
                  </footer>
                </article>
              </div>

              <button type="button" class="ai-consensus-link-button ai-consensus-link-button--pink">
                <span>View full comparison</span>
                <AppIcon name="external-link" :size="12" />
              </button>
            </section>
          </div>

          <div class="ai-consensus-bottom-grid">
            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>5.</span>
                <strong>Evidence Alignment</strong>
              </div>

              <div class="ai-consensus-evidence-list">
                <article v-for="item in evidenceRows" :key="item.label">
                  <div>
                    <AppIcon name="document" :size="13" />
                    <strong>{{ item.label }}</strong>
                  </div>
                  <em :class="`is-${item.tone}`">{{ item.score }}</em>
                </article>
              </div>

              <div class="ai-consensus-evidence-footer">
                <small>Overall Evidence Alignment</small>
                <strong>{{ evidenceAlignment }}%</strong>
                <span>12 of 12 evidence sources reviewed</span>
              </div>
            </section>

            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <span>6.</span>
                <strong>AI Recommendation</strong>
              </div>

              <div class="ai-consensus-recommendation">
                <div class="ai-consensus-recommendation__badge">
                  <AppIcon name="shield" :size="26" />
                </div>
                <div>
                  <strong>Proceed to Offer</strong>
                  <p>Consensus is strong and evidence is well aligned, making a recommendation to advance this hire.</p>
                </div>
              </div>

              <div class="ai-consensus-recommendation__list">
                <small>Why we recommend this</small>
                <ul>
                  <li v-for="item in recommendationChecklist" :key="item">{{ item }}</li>
                </ul>
              </div>
            </section>

            <section class="ai-consensus-card">
              <div class="ai-consensus-card__head">
                <strong>Projected Consensus if Calibrated</strong>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="ai-consensus-projection">
                <article>
                  <strong>{{ consensusScore }}%</strong>
                  <small>Current Consensus</small>
                </article>
                <div class="ai-consensus-projection__arrow">
                  <AppIcon name="chevronRight" :size="18" />
                </div>
                <article>
                  <strong class="is-green">{{ calibratedConsensus }}%</strong>
                  <small>After Calibration</small>
                </article>
              </div>

              <div class="ai-consensus-projection__delta">
                <small>Estimated Improvement</small>
                <strong>+6%</strong>
              </div>

              <div class="ai-consensus-projection__chart">
                <p>Based on suggested calibration actions</p>
                <div class="ai-consensus-projection__graph">
                  <svg viewBox="0 0 220 84" preserveAspectRatio="none" aria-hidden="true">
                    <polyline
                      points="16,64 40,44 72,46 104,28 134,34 166,14 194,18 214,8"
                    />
                    <circle cx="16" cy="64" r="3" />
                    <circle cx="40" cy="44" r="3" />
                    <circle cx="72" cy="46" r="3" />
                    <circle cx="104" cy="28" r="3" />
                    <circle cx="134" cy="34" r="3" />
                    <circle cx="166" cy="14" r="3" />
                    <circle cx="194" cy="18" r="3" />
                    <circle cx="214" cy="8" r="3" />
                  </svg>
                </div>
              </div>
            </section>
          </div>

          <section class="ai-consensus-actions">
            <div class="ai-consensus-card__head">
              <span>7.</span>
              <strong>Suggested Calibration Actions</strong>
            </div>

            <div class="ai-consensus-actions__grid">
              <article v-for="item in calibrationActions" :key="item.title" class="ai-consensus-actions__card">
                <div>
                  <span class="ai-consensus-actions__icon">
                    <AppIcon name="message" :size="14" />
                  </span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.note }}</p>
                  </div>
                </div>
                <aside>
                  <small>Est. Time {{ item.eta }}</small>
                  <strong>{{ item.impact }}</strong>
                  <span>Affects {{ item.effect }}</span>
                </aside>
                <button type="button">Review now</button>
              </article>
            </div>
          </section>
        </div>

        <footer class="ai-consensus-foot">
          <article><small>Decision Readiness</small><strong class="is-green">High</strong></article>
          <article><small>Consensus</small><strong>{{ consensusScore }}%</strong></article>
          <article><small>Evidence Alignment</small><strong>{{ evidenceAlignment }}%</strong></article>
          <article><small>Risk Level</small><strong class="is-green">Low</strong></article>
          <article><small>Recommendation</small><strong class="is-green">Ready for Offer</strong></article>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-consensus-overlay {
  position: fixed;
  inset: 0;
  z-index: 2300;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(8px);
}

.ai-consensus-modal {
  width: min(1500px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e6edf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 72px rgba(15, 23, 42, 0.14);
}

.ai-consensus-head,
.ai-consensus-head__title,
.ai-consensus-head__actions,
.ai-consensus-profile__identity,
.ai-consensus-card__head,
.ai-consensus-distribution,
.ai-consensus-distribution__legend article,
.ai-consensus-table__person,
.ai-consensus-disagreements__head,
.ai-consensus-evidence-list article,
.ai-consensus-recommendation,
.ai-consensus-actions__card > div,
.ai-consensus-foot {
  display: flex;
  align-items: center;
}

.ai-consensus-head {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
}

.ai-consensus-head__title {
  gap: 8px;
}

.ai-consensus-head__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-consensus-head h2 {
  margin: 0;
  color: #243454;
  font-size: 1.05rem;
}

.ai-consensus-head em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-consensus-head p {
  margin: 2px 0 0;
  color: #8390aa;
  font-size: 0.7rem;
}

.ai-consensus-head__actions {
  gap: 8px;
}

.ai-consensus-download,
.ai-consensus-close,
.ai-consensus-hero__cta button,
.ai-consensus-link-button,
.ai-consensus-actions__card button {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.ai-consensus-download {
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

.ai-consensus-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #66758f;
}

.ai-consensus-body {
  overflow: auto;
  padding: 14px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 156, 0.05), transparent 18%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.ai-consensus-profile,
.ai-consensus-card,
.ai-consensus-actions {
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(27, 39, 76, 0.04);
}

.ai-consensus-profile {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 16px;
}

.ai-consensus-profile__identity {
  align-items: flex-start;
  gap: 12px;
}

.ai-consensus-profile__avatar {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #111827 0%, #f05d8f 100%);
  color: #fff;
  font-weight: 800;
}

.ai-consensus-profile__identity strong {
  display: block;
  color: #243454;
  font-size: 0.92rem;
}

.ai-consensus-profile__identity p {
  margin: 3px 0 0;
  color: #73829d;
  font-size: 0.72rem;
}

.ai-consensus-link {
  margin-top: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #ff4f9c;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-consensus-profile__facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.ai-consensus-profile__facts article {
  min-width: 0;
}

.ai-consensus-profile__facts small,
.ai-consensus-summary-footer small,
.ai-consensus-projection article small,
.ai-consensus-foot small,
.ai-consensus-evidence-footer small {
  display: block;
  color: #97a4ba;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
}

.ai-consensus-profile__facts strong,
.ai-consensus-summary-footer strong,
.ai-consensus-projection article strong,
.ai-consensus-foot strong,
.ai-consensus-evidence-footer strong {
  display: block;
  margin-top: 5px;
  color: #243454;
  font-size: 0.82rem;
}

.ai-consensus-profile__facts span,
.ai-consensus-evidence-footer span {
  display: block;
  margin-top: 4px;
  color: #9aa7bd;
  font-size: 0.66rem;
}

.ai-consensus-profile__facts strong.is-stage {
  color: #ff4f9c;
}

.ai-consensus-top-grid,
.ai-consensus-main-grid,
.ai-consensus-bottom-grid {
  display: grid;
  gap: 14px;
  margin-top: 14px;
}

.ai-consensus-top-grid {
  grid-template-columns: 1.16fr 1fr 1.08fr;
}

.ai-consensus-main-grid {
  grid-template-columns: 1.12fr 1fr;
}

.ai-consensus-bottom-grid {
  grid-template-columns: 0.92fr 1fr 0.8fr;
}

.ai-consensus-card,
.ai-consensus-actions {
  padding: 14px 16px;
}

.ai-consensus-card__head {
  gap: 8px;
  margin-bottom: 12px;
  color: #243454;
}

.ai-consensus-card__head span:first-child {
  color: #ff4f9c;
  font-weight: 800;
}

.ai-consensus-card__head strong {
  font-size: 0.78rem;
}

.ai-consensus-card__head small {
  margin-left: auto;
  color: #ff4f9c;
  font-size: 0.64rem;
  font-weight: 700;
}

.ai-consensus-hero {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.ai-consensus-ring {
  width: 140px;
  height: 140px;
  padding: 9px;
  border-radius: 50%;
}

.ai-consensus-ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 3px;
  background: #fff;
  text-align: center;
}

.ai-consensus-ring strong {
  color: #1f2f4d;
  font-size: 1.8rem;
  line-height: 1;
}

.ai-consensus-ring span {
  color: #ff4f9c;
  font-size: 0.68rem;
  font-weight: 800;
}

.ai-consensus-ring small {
  color: #ff7db7;
  font-size: 0.7rem;
  letter-spacing: 2px;
}

.ai-consensus-hero__cta button {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border-color: #cbe8d6;
  background: #effdf4;
  color: #21a766;
  font-size: 0.68rem;
  font-weight: 800;
}

.ai-consensus-summary-stats,
.ai-consensus-summary-footer,
.ai-consensus-projection {
  display: grid;
  gap: 10px;
}

.ai-consensus-summary-stats {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 12px;
}

.ai-consensus-summary-stats article {
  padding: 9px 10px;
  border-radius: 10px;
  background: #fbfcff;
  text-align: center;
}

.ai-consensus-summary-stats strong {
  display: block;
  color: #243454;
  font-size: 1rem;
}

.ai-consensus-summary-stats small {
  display: block;
  margin-top: 4px;
  color: #9aa7bd;
  font-size: 0.62rem;
}

.ai-consensus-summary-stats strong.is-green,
.ai-consensus-projection article strong.is-green,
.ai-consensus-foot strong.is-green,
.ai-consensus-evidence-list em.is-green,
.ai-consensus-agreement-list small.is-green,
.ai-consensus-agreement-list em.is-green {
  color: #1fb86a;
}

.ai-consensus-summary-stats strong.is-orange,
.ai-consensus-agreement-list small.is-orange,
.ai-consensus-agreement-list em.is-orange {
  color: #ff9824;
}

.ai-consensus-summary-stats strong.is-slate {
  color: #64748b;
}

.ai-consensus-summary-footer {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 10px;
}

.ai-consensus-distribution {
  gap: 16px;
}

.ai-consensus-distribution__donut {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  align-content: center;
  background:
    radial-gradient(circle at center, #fff 58%, transparent 59%),
    conic-gradient(#1fb86a 0deg 260deg, #ff9824 260deg 330deg, #ff5aa7 330deg 360deg);
  color: #243454;
  flex: 0 0 128px;
}

.ai-consensus-distribution__donut strong {
  font-size: 2rem;
  line-height: 1;
}

.ai-consensus-distribution__donut span {
  font-size: 0.64rem;
  color: #8190a7;
  font-weight: 700;
}

.ai-consensus-distribution__legend {
  display: grid;
  gap: 10px;
  flex: 1;
}

.ai-consensus-distribution__legend article {
  gap: 9px;
}

.ai-consensus-distribution__legend span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
}

.ai-consensus-distribution__legend span.is-green,
.ai-consensus-agreement-list__bar span.is-green {
  background: #1fb86a;
}

.ai-consensus-distribution__legend span.is-orange,
.ai-consensus-agreement-list__bar span.is-orange {
  background: #ff9824;
}

.ai-consensus-distribution__legend span.is-pink,
.ai-consensus-agreement-list__bar span.is-pink {
  background: #ff4f9c;
}

.ai-consensus-distribution__legend span.is-slate,
.ai-consensus-agreement-list__bar span.is-slate {
  background: #cdd6e4;
}

.ai-consensus-distribution__legend strong {
  color: #243454;
  font-size: 0.68rem;
}

.ai-consensus-distribution__legend em {
  margin-left: auto;
  color: #94a3b8;
  font-style: normal;
  font-size: 0.64rem;
}

.ai-consensus-trend {
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: #fff8fc;
}

.ai-consensus-trend header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.ai-consensus-trend header strong {
  color: #243454;
  font-size: 0.68rem;
}

.ai-consensus-trend header small {
  color: #ff4f9c;
  font-size: 0.72rem;
  font-weight: 800;
}

.ai-consensus-trend__rows {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.ai-consensus-trend__rows article {
  text-align: center;
}

.ai-consensus-trend__rows strong {
  display: block;
  color: #243454;
  font-size: 0.72rem;
}

.ai-consensus-trend__rows small {
  display: block;
  margin-top: 4px;
  color: #96a3b9;
  font-size: 0.6rem;
}

.ai-consensus-agreement-list {
  display: grid;
  gap: 12px;
}

.ai-consensus-agreement-list__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ai-consensus-agreement-list__meta strong {
  color: #243454;
  font-size: 0.7rem;
}

.ai-consensus-agreement-list__meta em {
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
}

.ai-consensus-agreement-list__bar {
  margin-top: 7px;
  height: 8px;
  border-radius: 999px;
  background: #edf2fb;
  overflow: hidden;
}

.ai-consensus-agreement-list__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.ai-consensus-agreement-list small {
  display: block;
  margin-top: 6px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-consensus-agreement-list small.is-pink,
.ai-consensus-agreement-list em.is-pink {
  color: #ff4f9c;
}

.ai-consensus-table {
  border: 1px solid #edf2fb;
  border-radius: 12px;
  overflow: hidden;
}

.ai-consensus-table__head,
.ai-consensus-table__row {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.8fr 0.6fr;
  gap: 10px;
  align-items: center;
}

.ai-consensus-table__head {
  padding: 10px 12px;
  background: #fafcff;
  color: #97a4ba;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-consensus-table__row {
  padding: 12px;
  border-top: 1px solid #edf2fb;
}

.ai-consensus-table__person {
  gap: 9px;
}

.ai-consensus-table__person span {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: 800;
  color: #fff;
}

.ai-consensus-table__person span.is-green {
  background: linear-gradient(135deg, #6b7cff 0%, #8a67ff 100%);
}

.ai-consensus-table__person span.is-pink {
  background: linear-gradient(135deg, #ff976c 0%, #ff4f9c 100%);
}

.ai-consensus-table__person span.is-orange {
  background: linear-gradient(135deg, #ffb347 0%, #ff7f50 100%);
}

.ai-consensus-table__person strong,
.ai-consensus-disagreements__comments strong {
  color: #243454;
  font-size: 0.68rem;
}

.ai-consensus-table__row em,
.ai-consensus-table__row p,
.ai-consensus-table__alignment strong {
  font-style: normal;
  font-size: 0.66rem;
  font-weight: 700;
}

.ai-consensus-table__row em.is-green,
.ai-consensus-table__row p.is-green {
  color: #21a766;
}

.ai-consensus-table__row em.is-pink,
.ai-consensus-table__row p.is-pink {
  color: #ff4f9c;
}

.ai-consensus-table__row em.is-orange,
.ai-consensus-table__row p.is-orange {
  color: #ff9824;
}

.ai-consensus-table__alignment small {
  display: block;
  margin-top: 4px;
  color: #31c56f;
  font-size: 0.58rem;
}

.ai-consensus-link-button {
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #9aa7bd;
  font-size: 0.68rem;
  font-weight: 700;
}

.ai-consensus-link-button--pink {
  color: #ff4f9c;
}

.ai-consensus-disagreements {
  display: grid;
  gap: 12px;
}

.ai-consensus-disagreements article {
  padding: 12px;
  border-radius: 12px;
  background: #fffafc;
  border: 1px solid #f9dbe9;
}

.ai-consensus-disagreements__head {
  justify-content: space-between;
  gap: 10px;
}

.ai-consensus-disagreements__head strong {
  color: #243454;
  font-size: 0.7rem;
}

.ai-consensus-disagreements__head em {
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.6rem;
  font-weight: 800;
}

.ai-consensus-disagreements__comments {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.ai-consensus-disagreements__comments div {
  padding: 10px;
  border-radius: 10px;
  background: #fff;
}

.ai-consensus-disagreements__comments p,
.ai-consensus-recommendation__list li,
.ai-consensus-actions__card p {
  margin: 4px 0 0;
  color: #7f8da6;
  font-size: 0.65rem;
  line-height: 1.55;
}

.ai-consensus-disagreements footer {
  margin-top: 10px;
}

.ai-consensus-disagreements footer span {
  color: #ff4f9c;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-consensus-disagreements footer p {
  margin: 4px 0 0;
  color: #243454;
  font-size: 0.66rem;
}

.ai-consensus-evidence-list {
  display: grid;
  gap: 10px;
}

.ai-consensus-evidence-list article {
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2fb;
}

.ai-consensus-evidence-list article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.ai-consensus-evidence-list article > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-consensus-evidence-list strong {
  color: #243454;
  font-size: 0.67rem;
}

.ai-consensus-evidence-list em {
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
}

.ai-consensus-evidence-footer {
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
}

.ai-consensus-recommendation {
  gap: 12px;
}

.ai-consensus-recommendation__badge {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f2fff7 0%, #e5fff0 100%);
  color: #21a766;
  box-shadow: inset 0 0 0 1px #cbe8d6;
}

.ai-consensus-recommendation strong {
  display: block;
  color: #21a766;
  font-size: 0.88rem;
}

.ai-consensus-recommendation p {
  margin: 6px 0 0;
  color: #7f8da6;
  font-size: 0.66rem;
  line-height: 1.55;
}

.ai-consensus-recommendation__list {
  margin-top: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
}

.ai-consensus-recommendation__list small {
  color: #97a4ba;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-consensus-recommendation__list ul {
  margin: 8px 0 0;
  padding: 0 0 0 16px;
}

.ai-consensus-projection {
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
}

.ai-consensus-projection article {
  text-align: center;
}

.ai-consensus-projection article strong {
  margin-top: 0;
  font-size: 2rem;
  line-height: 1;
}

.ai-consensus-projection article small {
  margin-top: 8px;
  font-size: 0.72rem;
  text-transform: none;
}

.ai-consensus-projection__arrow {
  color: #a8b4c7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ai-consensus-projection__delta {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #edf2fb;
  text-align: center;
}

.ai-consensus-projection__delta small {
  display: block;
  color: #97a4ba;
  font-size: 0.72rem;
  font-weight: 700;
}

.ai-consensus-projection__delta strong {
  display: block;
  margin-top: 8px;
  color: #ff4f9c;
  font-size: 1.8rem;
  line-height: 1;
  font-weight: 800;
}

.ai-consensus-projection__chart {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf2fb;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  gap: 14px;
  align-items: end;
}

.ai-consensus-projection__chart p {
  margin: 0;
  color: #7f8da6;
  font-size: 0.72rem;
  line-height: 1.5;
  font-weight: 600;
}

.ai-consensus-projection__graph {
  height: 88px;
  position: relative;
}

.ai-consensus-projection__graph svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ai-consensus-projection__graph polyline {
  fill: none;
  stroke: #ff4f9c;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ai-consensus-projection__graph circle {
  fill: #ff4f9c;
}

.ai-consensus-actions {
  margin-top: 14px;
}

.ai-consensus-actions__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ai-consensus-actions__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border: 1px solid #f3d8e5;
  border-radius: 12px;
  background: #fffafc;
}

.ai-consensus-actions__icon {
  width: 28px;
  height: 28px;
  margin-right: 10px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ffeaf4;
  color: #ff4f9c;
  flex: 0 0 28px;
}

.ai-consensus-actions__card strong {
  color: #243454;
  font-size: 0.7rem;
}

.ai-consensus-actions__card aside {
  text-align: right;
}

.ai-consensus-actions__card aside small,
.ai-consensus-actions__card aside span {
  display: block;
  color: #97a4ba;
  font-size: 0.58rem;
}

.ai-consensus-actions__card aside strong {
  display: block;
  margin: 5px 0;
  color: #243454;
  font-size: 0.78rem;
}

.ai-consensus-actions__card button {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  border-color: transparent;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 800;
}

.ai-consensus-foot {
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.03) 0%, #fff 100%);
}

.ai-consensus-foot article {
  min-width: 0;
}

@media (max-width: 1380px) {
  .ai-consensus-top-grid,
  .ai-consensus-main-grid,
  .ai-consensus-bottom-grid,
  .ai-consensus-actions__grid {
    grid-template-columns: 1fr;
  }

  .ai-consensus-profile__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1040px) {
  .ai-consensus-profile,
  .ai-consensus-hero,
  .ai-consensus-distribution,
  .ai-consensus-projection__chart,
  .ai-consensus-disagreements__comments,
  .ai-consensus-foot {
    grid-template-columns: 1fr;
  }

  .ai-consensus-head,
  .ai-consensus-head__actions,
  .ai-consensus-foot {
    flex-wrap: wrap;
  }

  .ai-consensus-table {
    overflow-x: auto;
  }

  .ai-consensus-table__head,
  .ai-consensus-table__row {
    min-width: 640px;
  }
}

@media (max-width: 720px) {
  .ai-consensus-overlay {
    padding: 10px;
  }

  .ai-consensus-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 16px;
  }

  .ai-consensus-head,
  .ai-consensus-body,
  .ai-consensus-foot {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ai-consensus-profile__facts,
  .ai-consensus-summary-stats,
  .ai-consensus-summary-footer,
  .ai-consensus-trend__rows,
  .ai-consensus-projection {
    grid-template-columns: 1fr;
  }

  .ai-consensus-projection__arrow {
    min-height: 18px;
  }

  .ai-consensus-actions__card {
    grid-template-columns: 1fr;
  }
}
</style>
