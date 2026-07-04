<script setup>
import { computed, ref } from 'vue'
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
    default: 'Qualified',
  },
})

const emit = defineEmits(['close', 'add-note', 'share-prediction', 'move-shortlisted'])

const suppressForCandidate = ref(false)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const overallScore = 78
const confidenceScore = 92

const scoreRingStyle = computed(() => ({
  background: `conic-gradient(from 220deg, #6f7cf8 0deg ${overallScore * 3.6}deg, #dfe5fb ${overallScore * 3.6}deg 360deg)`,
}))

const predictionMetrics = [
  { label: 'Speed', value: 'Fast' },
  { label: 'Interviews', value: '4' },
  { label: 'Assessment', value: 'Pass' },
  { label: 'Retention', value: 'High' },
  { label: 'Market Value', value: 'Strong' },
]

const progressionSteps = [
  { label: 'Recruiter Screening (Current)', value: 82, tone: 'violet' },
  { label: 'Technical Interview', value: 88, tone: 'blue' },
  { label: 'Team Interview', value: 84, tone: 'blue' },
  { label: 'Hiring Manager Interview', value: 77, tone: 'blue' },
  { label: 'Offer', value: 72, tone: 'violet' },
  { label: 'Successful Hire (12+ Month Retention)', value: 68, tone: 'green' },
]

const strongestEvidence = [
  { label: 'Technical Interview Feedback', value: '+6%', detail: 'Interview', tone: 'green' },
  { label: 'Assessment Performance', value: '+12%', detail: 'Assessment', tone: 'green' },
  { label: 'Portfolio Quality', value: '+9%', detail: 'Portfolio', tone: 'green' },
  { label: 'Leadership Potential', value: '+7%', detail: 'Growth', tone: 'green' },
  { label: 'References (Completed)', value: '+5%', detail: 'Verified', tone: 'green' },
]

const riskFactors = [
  { label: 'Salary expectation near upper market', value: 'Medium', note: '-3% impact', tone: 'orange' },
  { label: 'Requirement stack leans heavily enterprise', value: 'Low', note: '-5% impact', tone: 'orange' },
  { label: 'Leadership experience partially validated', value: 'Medium', note: '-4% impact', tone: 'orange' },
  { label: 'Notice period is 8 weeks', value: 'Low', note: '-2% impact', tone: 'orange' },
]

const simulatorRows = [
  { scenario: 'Increase salary by 7%', impact: '+4%', score: '82%', tone: 'green' },
  { scenario: 'Show role vision earlier', impact: '+3%', score: '81%', tone: 'green' },
  { scenario: 'Only VP round remains', impact: '-6%', score: '72%', tone: 'red' },
  { scenario: 'Delay decision 1 week', impact: '-7%', score: '71%', tone: 'red' },
]

const recommendationReasons = [
  'Strong alignment with role requirements',
  'Above-benchmark interview and portfolio scores',
  'High conversion probability and low drop-off risk',
]

const recommendationImpact = [
  'Time-to-hire reduced by 4 days',
  'Hiring confidence increases from 78% to 84%',
  'Quality-of-hire prediction remains high',
]

function closeOverlay() {
  emit('close')
}

function addNote() {
  emit('add-note')
  emit('close')
}

function sharePrediction() {
  emit('share-prediction')
  emit('close')
}

function moveShortlisted() {
  emit('move-shortlisted')
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="hiring-success-overlay" @click.self="closeOverlay">
      <section class="hiring-success-modal">
        <header class="hiring-success-modal__head">
          <div class="hiring-success-modal__title">
            <span class="hiring-success-modal__title-icon">
              <AppIcon name="spark" :size="15" />
            </span>
            <div>
              <div class="hiring-success-modal__title-row">
                <h2>AI Hiring Success Prediction</h2>
                <span class="hiring-success-modal__badge">IMPROVED</span>
              </div>
              <p>Predicting the likelihood of this candidate becoming a successful hire.</p>
            </div>
          </div>

          <button
            class="hiring-success-modal__close"
            type="button"
            aria-label="Close AI hiring success prediction"
            @click="closeOverlay"
          >
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div class="hiring-success-modal__body">
          <section class="hiring-success-profile">
            <div class="hiring-success-profile__identity">
              <span class="hiring-success-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <div class="hiring-success-profile__meta">
                  <span class="hiring-success-pill hiring-success-pill--success">{{ candidateStage }}</span>
                  <small>New York, NY, Hybrid</small>
                  <small>6+ years experience</small>
                </div>
              </div>
            </div>

            <div class="hiring-success-profile__stage">
              <small>CURRENT STAGE</small>
              <strong>Round 1 Screening</strong>
              <span>Interviewed on May 20, 2025</span>
            </div>
          </section>

          <div class="hiring-success-grid hiring-success-grid--top">
            <section class="hiring-success-card hiring-success-card--score">
              <div class="hiring-success-card__head">
                <h3>Overall Hiring Success Prediction</h3>
                <AppIcon name="info" :size="12" />
              </div>

              <div class="hiring-success-score-layout">
                <div class="hiring-success-ring" :style="scoreRingStyle">
                  <div class="hiring-success-ring__inner">
                    <strong>{{ overallScore }}%</strong>
                    <span>Success Likelihood</span>
                  </div>
                </div>

                <div class="hiring-success-score-copy">
                  <p>
                    This candidate is highly likely to become a successful hire based on current
                    evaluation and historical data from similar hires.
                  </p>
                  <span class="hiring-success-pill hiring-success-pill--confidence">High Confidence</span>
                </div>
              </div>

              <div class="hiring-success-confidence">
                <div class="hiring-success-confidence__row">
                  <span>Prediction Confidence</span>
                  <strong>{{ confidenceScore }}%</strong>
                </div>
                <div class="hiring-success-confidence__track">
                  <i :style="{ width: `${confidenceScore}%` }" />
                </div>
              </div>

              <div class="hiring-success-metrics">
                <article v-for="item in predictionMetrics" :key="item.label">
                  <strong>{{ item.value }}</strong>
                  <span>{{ item.label }}</span>
                </article>
              </div>
            </section>

            <section class="hiring-success-card hiring-success-card--pipeline">
              <div class="hiring-success-card__head">
                <h3>Pipeline Progression Probability</h3>
                <AppIcon name="info" :size="12" />
              </div>

              <div class="hiring-success-pipeline">
                <article
                  v-for="step in progressionSteps"
                  :key="step.label"
                  class="hiring-success-pipeline__row"
                >
                  <div class="hiring-success-pipeline__label">
                    <span class="hiring-success-pipeline__dot" :class="`is-${step.tone}`" />
                    <strong>{{ step.label }}</strong>
                  </div>
                  <span>{{ step.value }}%</span>
                  <div class="hiring-success-pipeline__track">
                    <i :class="`is-${step.tone}`" :style="{ width: `${step.value}%` }" />
                  </div>
                </article>
              </div>

              <aside class="hiring-success-pipeline__insight">
                <small>Since job #249</small>
                <strong>Strong signal at this stage</strong>
                <p>Similar candidates with this profile reached 12+ month retention at a high rate.</p>
                <span>NitroSync</span>
              </aside>
            </section>
          </div>

          <div class="hiring-success-grid hiring-success-grid--middle">
            <section class="hiring-success-card">
              <div class="hiring-success-card__head">
                <h3>Strongest Evidence</h3>
                <AppIcon name="info" :size="12" />
              </div>

              <ul class="hiring-success-list">
                <li v-for="item in strongestEvidence" :key="item.label">
                  <div class="hiring-success-list__main">
                    <AppIcon name="checkCircle" :size="13" />
                    <span>{{ item.label }}</span>
                  </div>
                  <div class="hiring-success-list__meta">
                    <strong :class="`is-${item.tone}`">{{ item.value }}</strong>
                  </div>
                </li>
              </ul>

              <button class="hiring-success-card__link" type="button">View all evidence details</button>
            </section>

            <section class="hiring-success-card">
              <div class="hiring-success-card__head">
                <h3>Risk Factors</h3>
                <AppIcon name="info" :size="12" />
              </div>

              <ul class="hiring-success-list hiring-success-list--risk">
                <li v-for="item in riskFactors" :key="item.label">
                  <div class="hiring-success-list__main">
                    <AppIcon name="alert" :size="13" />
                    <span>{{ item.label }}</span>
                  </div>
                  <div class="hiring-success-list__stack">
                    <strong :class="`is-${item.tone}`">{{ item.value }}</strong>
                    <small>{{ item.note }}</small>
                  </div>
                </li>
              </ul>

              <button class="hiring-success-card__link" type="button">View all risks & actions</button>
            </section>

            <section class="hiring-success-card">
              <div class="hiring-success-card__head">
                <h3>What If Simulator</h3>
                <AppIcon name="info" :size="12" />
              </div>

              <div class="hiring-success-simulator">
                <div class="hiring-success-simulator__head">
                  <span>Scenario</span>
                  <span>Impact</span>
                  <span>New Score</span>
                </div>

                <article v-for="row in simulatorRows" :key="row.scenario" class="hiring-success-simulator__row">
                  <strong>{{ row.scenario }}</strong>
                  <span :class="`is-${row.tone}`">{{ row.impact }}</span>
                  <em>{{ row.score }}</em>
                </article>
              </div>

              <button class="hiring-success-card__link" type="button">Explore more scenarios</button>
            </section>
          </div>

          <section class="hiring-success-recommendation">
            <div class="hiring-success-recommendation__header">
              <small>AI RECOMMENDED NEXT ACTION</small>
              <h3>Move to Shortlisted</h3>
              <p>This candidate is a strong fit and ready to likely succeed in your requirements.</p>
              <div class="hiring-success-recommendation__score">
                <span class="hiring-success-pill hiring-success-pill--confidence">High Confidence</span>
                <strong>92%</strong>
                <button type="button">Why this action?</button>
              </div>
            </div>

            <div class="hiring-success-recommendation__grid">
              <article>
                <small>WHY RECOMMENDED</small>
                <ul>
                  <li v-for="item in recommendationReasons" :key="item">{{ item }}</li>
                </ul>
              </article>

              <article>
                <small>KEY WATCHOUTS</small>
                <ul>
                  <li>Salary band should stay calibrated</li>
                  <li>Keep process momentum over the next 72 hours</li>
                  <li>Confirm leadership depth in next panel</li>
                </ul>
              </article>

              <article>
                <small>EXPECTED IMPACT</small>
                <ul>
                  <li v-for="item in recommendationImpact" :key="item">{{ item }}</li>
                </ul>
              </article>
            </div>
          </section>
        </div>

        <footer class="hiring-success-modal__footer">
          <div class="hiring-success-modal__footer-meta">
            <div>
              <small>Prediction Model</small>
              <strong>v2.1 Historical + Live Hiring Signals</strong>
            </div>
            <div>
              <small>Last Updated</small>
              <strong>May 20, 2025</strong>
            </div>
          </div>

          <div class="hiring-success-modal__footer-actions">
            <label class="hiring-success-checkbox">
              <input v-model="suppressForCandidate" type="checkbox">
              <span>Don't show again for this candidate</span>
            </label>

            <div class="hiring-success-modal__buttons">
              <button class="hiring-success-button hiring-success-button--ghost" type="button" @click="addNote">
                <AppIcon name="edit" :size="13" />
                <span>Add Note</span>
              </button>
              <button class="hiring-success-button hiring-success-button--ghost" type="button" @click="sharePrediction">
                <AppIcon name="share" :size="13" />
                <span>Share Prediction</span>
              </button>
              <button class="hiring-success-button hiring-success-button--primary" type="button" @click="moveShortlisted">
                <span>Move to Shortlisted</span>
              </button>
            </div>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style>
.hiring-success-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 18px;
  background: rgba(20, 28, 42, 0.42);
  backdrop-filter: blur(4px);
}

.hiring-success-modal {
  width: min(100%, 1180px);
  max-height: calc(100vh - 36px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border: 1px solid #ebeef6;
  border-radius: 16px;
  overflow: hidden;
  background: #fbfcff;
  box-shadow: 0 28px 72px rgba(20, 28, 42, 0.18);
}

.hiring-success-modal__head,
.hiring-success-modal__title,
.hiring-success-modal__title-row,
.hiring-success-profile,
.hiring-success-profile__identity,
.hiring-success-profile__meta,
.hiring-success-profile__stage,
.hiring-success-card__head,
.hiring-success-score-layout,
.hiring-success-confidence__row,
.hiring-success-list li,
.hiring-success-list__main,
.hiring-success-list__meta,
.hiring-success-list__stack,
.hiring-success-modal__footer-actions,
.hiring-success-modal__buttons,
.hiring-success-button,
.hiring-success-checkbox,
.hiring-success-recommendation__score {
  display: flex;
  align-items: center;
}

.hiring-success-modal__head {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf1f7;
  background: #fff;
}

.hiring-success-modal__title {
  gap: 10px;
}

.hiring-success-modal__title-icon {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  display: inline-grid;
  place-items: center;
  background: linear-gradient(180deg, #ff82bf 0%, #f2519a 100%);
  color: #fff;
  flex: 0 0 24px;
}

.hiring-success-modal__title-row {
  gap: 8px;
  margin-bottom: 1px;
}

.hiring-success-modal__title-row h2,
.hiring-success-card__head h3,
.hiring-success-profile__identity strong,
.hiring-success-profile__stage strong,
.hiring-success-ring__inner strong,
.hiring-success-recommendation__header h3 {
  margin: 0;
  color: #17213f;
}

.hiring-success-modal__title-row h2 {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hiring-success-modal__title p,
.hiring-success-profile__identity span,
.hiring-success-profile__stage span,
.hiring-success-score-copy p,
.hiring-success-pipeline__insight p,
.hiring-success-recommendation__header p {
  margin: 0;
  color: #7c879b;
  font-size: 12px;
  line-height: 1.45;
}

.hiring-success-modal__badge,
.hiring-success-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
}

.hiring-success-modal__badge {
  padding: 3px 7px;
  background: #eef0ff;
  color: #7180f7;
}

.hiring-success-modal__close {
  width: 24px;
  height: 24px;
  border: 0;
  padding: 0;
  border-radius: 8px;
  display: inline-grid;
  place-items: center;
  background: transparent;
  color: #98a4b7;
}

.hiring-success-modal__body {
  overflow: auto;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.hiring-success-profile {
  justify-content: space-between;
  gap: 16px;
  padding: 4px 2px 10px;
}

.hiring-success-profile__identity {
  gap: 10px;
  min-width: 0;
}

.hiring-success-profile__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #f5d6ec 0%, #ebe7ff 100%);
  color: #7a54d8;
  font-size: 12px;
  font-weight: 800;
  flex: 0 0 32px;
}

.hiring-success-profile__identity strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
}

.hiring-success-profile__identity > div > span {
  display: block;
  margin-top: 1px;
}

.hiring-success-profile__meta {
  gap: 10px;
  margin-top: 5px;
  flex-wrap: wrap;
}

.hiring-success-profile__meta small {
  color: #98a3b6;
  font-size: 11px;
}

.hiring-success-pill {
  padding: 3px 8px;
}

.hiring-success-pill--success {
  background: #eafaf0;
  color: #18a05e;
}

.hiring-success-pill--confidence {
  background: #ecf9ee;
  color: #1b9a5c;
}

.hiring-success-profile__stage {
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 2px;
}

.hiring-success-profile__stage small,
.hiring-success-recommendation__header small,
.hiring-success-recommendation__grid article small,
.hiring-success-modal__footer-meta small {
  color: #ff6ea8;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hiring-success-profile__stage strong {
  font-size: 13px;
  font-weight: 800;
}

.hiring-success-grid {
  display: grid;
  gap: 12px;
}

.hiring-success-grid--top {
  grid-template-columns: 1.06fr 1fr;
}

.hiring-success-grid--middle {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hiring-success-card {
  position: relative;
  padding: 14px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(20, 28, 42, 0.03);
}

.hiring-success-card__head {
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  color: #9ea9bc;
}

.hiring-success-card__head h3 {
  font-size: 12px;
  font-weight: 800;
}

.hiring-success-score-layout {
  align-items: center;
  gap: 18px;
}

.hiring-success-ring {
  width: 116px;
  height: 116px;
  padding: 7px;
  border-radius: 50%;
  flex: 0 0 116px;
}

.hiring-success-ring__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  text-align: center;
  background: #fff;
}

.hiring-success-ring__inner strong {
  display: block;
  font-size: 31px;
  font-weight: 800;
  line-height: 1;
}

.hiring-success-ring__inner span {
  display: block;
  max-width: 70px;
  color: #8692a8;
  font-size: 10px;
  line-height: 1.3;
}

.hiring-success-score-copy {
  display: grid;
  gap: 8px;
}

.hiring-success-confidence {
  margin-top: 12px;
}

.hiring-success-confidence__row {
  justify-content: space-between;
  margin-bottom: 6px;
}

.hiring-success-confidence__row span,
.hiring-success-confidence__row strong {
  color: #56627a;
  font-size: 11px;
  font-weight: 700;
}

.hiring-success-confidence__track,
.hiring-success-pipeline__track {
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: #eef2f8;
}

.hiring-success-confidence__track i,
.hiring-success-pipeline__track i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.hiring-success-confidence__track i {
  background: linear-gradient(90deg, #54dd8e 0%, #24b36b 100%);
}

.hiring-success-metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f1f4f8;
}

.hiring-success-metrics article {
  text-align: center;
}

.hiring-success-metrics strong {
  display: block;
  color: #5e6b82;
  font-size: 11px;
  font-weight: 800;
}

.hiring-success-metrics span {
  display: block;
  margin-top: 3px;
  color: #9ca8bb;
  font-size: 9px;
  font-weight: 700;
}

.hiring-success-card--pipeline {
  padding-right: 112px;
}

.hiring-success-pipeline {
  display: grid;
  gap: 10px;
}

.hiring-success-pipeline__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px 10px;
  align-items: center;
}

.hiring-success-pipeline__label {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.hiring-success-pipeline__label strong,
.hiring-success-pipeline__row > span {
  color: #5e6b82;
  font-size: 10px;
  font-weight: 700;
}

.hiring-success-pipeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
  border: 1px solid #d8deee;
  background: #fff;
}

.hiring-success-pipeline__track {
  grid-column: 1 / -1;
}

.hiring-success-pipeline__dot.is-violet,
.hiring-success-pipeline__track i.is-violet {
  background: linear-gradient(90deg, #807bf6 0%, #6d6ff4 100%);
}

.hiring-success-pipeline__dot.is-blue,
.hiring-success-pipeline__track i.is-blue {
  background: linear-gradient(90deg, #79a5ff 0%, #5f87ff 100%);
}

.hiring-success-pipeline__dot.is-green,
.hiring-success-pipeline__track i.is-green {
  background: linear-gradient(90deg, #53db8d 0%, #24b56b 100%);
}

.hiring-success-pipeline__insight {
  position: absolute;
  top: 56px;
  right: 12px;
  width: 92px;
  padding: 9px 10px;
  border-radius: 10px;
  background: #eef2ff;
  box-shadow: inset 0 0 0 1px #dee5ff;
}

.hiring-success-pipeline__insight small {
  display: block;
  color: #8d97b1;
  font-size: 8px;
  margin-bottom: 4px;
}

.hiring-success-pipeline__insight strong {
  display: block;
  color: #4f5fc8;
  font-size: 9px;
  line-height: 1.35;
  margin-bottom: 4px;
}

.hiring-success-pipeline__insight p {
  font-size: 8px;
  line-height: 1.4;
}

.hiring-success-pipeline__insight span {
  display: inline-block;
  margin-top: 3px;
  color: #5c6bf0;
  font-size: 8px;
  font-weight: 800;
}

.hiring-success-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.hiring-success-list li {
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f4f8;
}

.hiring-success-list li:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.hiring-success-list__main {
  align-items: flex-start;
  gap: 7px;
  min-width: 0;
  color: #58657a;
  font-size: 10px;
  font-weight: 700;
}

.hiring-success-list__main span {
  line-height: 1.35;
}

.hiring-success-list__meta strong,
.hiring-success-list__stack strong,
.hiring-success-simulator__row span {
  font-size: 10px;
  font-weight: 800;
}

.hiring-success-list__stack {
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.hiring-success-list__stack small {
  color: #a0acc0;
  font-size: 8px;
  font-weight: 700;
}

.is-green {
  color: #1ea05f;
}

.is-orange {
  color: #f28a2f;
}

.is-red {
  color: #e05c74;
}

.hiring-success-card__link {
  margin-top: 10px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #5a6be6;
  font-size: 10px;
  font-weight: 800;
}

.hiring-success-simulator {
  display: grid;
  gap: 7px;
}

.hiring-success-simulator__head,
.hiring-success-simulator__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px 52px;
  gap: 8px;
  align-items: center;
}

.hiring-success-simulator__head {
  color: #a1adc0;
  font-size: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.hiring-success-simulator__row {
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f4f8;
}

.hiring-success-simulator__row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.hiring-success-simulator__row strong,
.hiring-success-simulator__row em {
  color: #5d6a82;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
}

.hiring-success-recommendation {
  padding: 14px 16px;
  border: 1px solid #f8d9e6;
  border-radius: 12px;
  background: linear-gradient(180deg, #fff8fb 0%, #fff3f8 100%);
}

.hiring-success-recommendation__header h3 {
  margin-top: 3px;
  font-size: 28px;
  line-height: 1;
  color: #de4d86;
}

.hiring-success-recommendation__header p {
  margin-top: 6px;
  max-width: 470px;
}

.hiring-success-recommendation__score {
  gap: 10px;
  margin-top: 10px;
}

.hiring-success-recommendation__score strong {
  color: #17213f;
  font-size: 20px;
  font-weight: 800;
}

.hiring-success-recommendation__score button {
  border: 0;
  padding: 0;
  background: transparent;
  color: #5667d8;
  font-size: 10px;
  font-weight: 800;
}

.hiring-success-recommendation__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 14px;
}

.hiring-success-recommendation__grid article ul {
  margin: 7px 0 0;
  padding-left: 16px;
}

.hiring-success-recommendation__grid article li {
  color: #657289;
  font-size: 10px;
  line-height: 1.55;
}

.hiring-success-modal__footer {
  padding: 12px 16px;
  border-top: 1px solid #edf1f7;
  background: #fff;
}

.hiring-success-modal__footer-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 10px;
}

.hiring-success-modal__footer-meta strong {
  display: block;
  margin-top: 2px;
  color: #6c7890;
  font-size: 10px;
  font-weight: 700;
}

.hiring-success-modal__footer-actions {
  justify-content: space-between;
  gap: 16px;
}

.hiring-success-checkbox {
  gap: 8px;
  color: #8f9bb0;
  font-size: 10px;
  font-weight: 700;
}

.hiring-success-checkbox input {
  margin: 0;
}

.hiring-success-modal__buttons {
  gap: 8px;
}

.hiring-success-button {
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 10px;
  font-weight: 800;
}

.hiring-success-button--ghost {
  border-color: #e0e6f1;
  background: #fff;
  color: #526179;
}

.hiring-success-button--primary {
  background: linear-gradient(180deg, #ff73b8 0%, #f2539a 100%);
  color: #fff;
  box-shadow: 0 10px 18px rgba(242, 83, 154, 0.2);
}

@media (max-width: 1024px) {
  .hiring-success-grid--top,
  .hiring-success-grid--middle,
  .hiring-success-recommendation__grid {
    grid-template-columns: 1fr;
  }

  .hiring-success-card--pipeline {
    padding-right: 14px;
  }

  .hiring-success-pipeline__insight {
    position: static;
    width: auto;
    margin-top: 12px;
  }
}

@media (max-width: 760px) {
  .hiring-success-overlay {
    padding: 10px;
  }

  .hiring-success-modal {
    max-height: calc(100vh - 20px);
  }

  .hiring-success-profile,
  .hiring-success-modal__footer-actions,
  .hiring-success-score-layout {
    align-items: flex-start;
    flex-direction: column;
  }

  .hiring-success-profile__stage {
    align-items: flex-start;
    text-align: left;
  }

  .hiring-success-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hiring-success-modal__footer-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .hiring-success-modal__buttons {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
  }

  .hiring-success-button {
    width: 100%;
    justify-content: center;
  }

  .hiring-success-recommendation__header h3 {
    font-size: 23px;
  }
}
</style>
