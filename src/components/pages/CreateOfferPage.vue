<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import GenerateOfferTemplateOverlay from '../shared/GenerateOfferTemplateOverlay.vue'
import ReviewAIOfferPage from './ReviewAIOfferPage.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    default: 'ac-1187',
  },
  candidateId: {
    type: String,
    default: '',
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'Senior Frontend Developer',
  },
  sourceStage: {
    type: String,
    default: 'Validation',
  },
})

const emit = defineEmits(['back', 'open-candidate-profile', 'open-review-ai-offer', 'open-scratch-offer'])

const job = computed(() => getJobById(props.jobId))
const candidateInitials = computed(() => (
  (props.candidateName || 'Marvin McKinney')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const offerBreakdown = [
  ['Base Salary', '$142,000'],
  ['Target Bonus (10%)', '$14,200'],
  ['Equity', '1,000 RSUs'],
  ['Benefits Package', 'Standard - US'],
  ['Start Date', 'June 16, 2026'],
  ['Reporting To', 'Thomas Lee'],
]

const whyOfferRows = [
  ['Salary recommendation', '$142,000', '+6%'],
  ['Market', '+6% above median', ''],
  ['Internal Equity', 'Balanced', ''],
  ['Candidate expectation', 'Matched', ''],
  ['Budget Status', 'Within range', ''],
]

const evidenceRows = [
  ['Interview scores', '4.6/5'],
  ['Technical assessment', 'Strong'],
  ['Reference feedback', 'Positive'],
  ['Market benchmark', 'P62'],
  ['Internal salary bands', 'Aligned'],
  ['Candidate expectations', 'Matched'],
]

const insightsRows = [
  ['Top strengths', ['Technical', 'Ownership']],
  ['Motivators', ['Growth', 'Impact']],
  ['Areas of interest', ['Frontend Architecture']],
  ['Notice period', ['2 weeks']],
]

const approvalRows = [
  ['Compensation', 'Pending', 'pending'],
  ['Hiring Manager', 'Approved', 'approved'],
  ['Finance', 'Pending', 'pending'],
  ['Legal', 'Not started', 'idle'],
]

const sourceCards = [
  {
    icon: 'document',
    title: 'Generate from Template',
    copy: 'Choose from your existing offer templates.',
    meta: '23 templates available',
    tone: 'violet',
  },
  {
    icon: 'edit',
    title: 'Start from Scratch',
    copy: 'Build a new offer from the ground up.',
    meta: 'Blank offer',
    tone: 'orange',
  },
  {
    icon: 'refresh',
    title: 'Import from External Tool',
    copy: 'Import offer from your connected tools.',
    meta: 'g   w   b',
    tone: 'blue',
  },
]

function readOfferStepFromHash() {
  if (typeof window === 'undefined') {
    return 'source'
  }

  const hash = window.location.hash
  const queryString = hash.includes('?') ? hash.split('?')[1] ?? '' : ''
  const query = new URLSearchParams(queryString)

  return query.get('step') === 'review-ai' ? 'review-ai' : 'source'
}

const activeStep = ref(readOfferStepFromHash())
const templateOverlayOpen = ref(false)

function syncStepFromHash() {
  activeStep.value = readOfferStepFromHash()
}

function openReviewAiOffer() {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'review-ai',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  emit('open-review-ai-offer')

  if (typeof window !== 'undefined') {
    window.location.hash = `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
  }
}

function openSourceStep() {
  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'source',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  if (typeof window !== 'undefined') {
    window.location.hash = `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
  }
}

function openTemplateOverlay() {
  templateOverlayOpen.value = true
}

function closeTemplateOverlay() {
  templateOverlayOpen.value = false
}

function useOfferTemplate() {
  templateOverlayOpen.value = false

  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'offer-details',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  if (typeof window !== 'undefined') {
    window.location.hash = `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
  }
}

function openScratchOffer() {
  templateOverlayOpen.value = false

  const query = new URLSearchParams({
    candidateName: props.candidateName,
    candidateRole: props.candidateRole,
    sourceStage: props.sourceStage,
    step: 'scratch',
  })
  const candidatePath = props.candidateId ? `/${props.candidateId}` : ''

  emit('open-scratch-offer')

  if (typeof window !== 'undefined') {
    window.location.hash = `#job/${props.jobId}/offer${candidatePath}?${query.toString()}`
  }
}

function handleSourceCardClick(cardTitle) {
  if (cardTitle === 'Generate from Template') {
    openTemplateOverlay()
    return
  }

  if (cardTitle === 'Start from Scratch') {
    openScratchOffer()
  }
}

onMounted(() => {
  syncStepFromHash()
  window.addEventListener('hashchange', syncStepFromHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncStepFromHash)
})
</script>

<template>
  <ReviewAIOfferPage
    v-if="activeStep === 'review-ai'"
    :job-id="jobId"
    :candidate-id="candidateId"
    :candidate-name="candidateName"
    :candidate-role="candidateRole"
    :source-stage="sourceStage"
    @back="emit('back')"
    @open-source="openSourceStep"
    @open-candidate-profile="emit('open-candidate-profile')"
  />
  <main v-else class="offer-page">
    <section class="offer-workspace">
      <header class="offer-card offer-header">
        <div class="offer-header__identity">
          <span class="offer-header__mark">
            <AppIcon name="sparkles" :size="16" />
          </span>
          <div>
            <h1>Create Offer</h1>
            <p>We've prepared the best offer for {{ candidateName.split(' ')[0] }}. Review, edit, and send.</p>
          </div>
        </div>

        <div class="offer-header__steps">
          <div class="offer-stepper">
            <div class="offer-step is-active">
              <span>1</span>
              <strong>Template</strong>
            </div>
            <div class="offer-step-line" />
            <div class="offer-step">
              <span>2</span>
              <strong>AI Mapping</strong>
            </div>
            <div class="offer-step-line" />
            <div class="offer-step">
              <span>3</span>
              <strong>Review &amp; Edit</strong>
            </div>
            <div class="offer-step-line" />
            <div class="offer-step">
              <span>4</span>
              <strong>Offer Details</strong>
            </div>
            <div class="offer-step-line" />
            <div class="offer-step">
              <span>5</span>
              <strong>Offer Package</strong>
            </div>
            <div class="offer-step-line" />
            <div class="offer-step">
              <span>6</span>
              <strong>Review &amp; Send</strong>
            </div>
          </div>

          <button class="offer-close-button" type="button" @click="emit('back')" aria-label="Close">
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </header>

      <section class="offer-card offer-candidate-strip">
        <div class="offer-candidate-strip__left">
          <div class="offer-avatar">
            <span>{{ candidateInitials }}</span>
            <i />
          </div>

          <div class="offer-candidate-copy">
            <div class="offer-candidate-copy__head">
              <strong>{{ candidateName }}</strong>
              <em>Validated</em>
            </div>
            <span>{{ candidateRole }}</span>
            <div class="offer-candidate-copy__meta">
              <small><AppIcon name="briefcase" :size="12" /> {{ job.department }}</small>
              <small><AppIcon name="mapPin" :size="12" /> {{ job.location }}</small>
              <small><AppIcon name="user-check" :size="12" /> Full-time</small>
            </div>
          </div>
        </div>

        <div class="offer-candidate-strip__center">
          <article>
            <span>Current stage</span>
            <strong>{{ sourceStage }}</strong>
          </article>
          <article class="is-green">
            <span>AI recommendation</span>
            <strong><AppIcon name="checkCircle" :size="14" /> Proceed to Offer</strong>
          </article>
        </div>

        <button class="offer-outline-button" type="button" @click="emit('open-candidate-profile')">
          <span>View candidate profile</span>
          <AppIcon name="external-link" :size="14" />
        </button>
      </section>

      <div class="offer-main-layout">
        <section class="offer-main-column">
          <article class="offer-card offer-hero-card">
            <small class="offer-kicker"><AppIcon name="sparkles" :size="12" /> AI OFFER INTELLIGENCE</small>

            <div class="offer-hero-grid">
              <div class="offer-hero-copy">
                <h2>NitroSync prepared an <span>AI Offer</span> for {{ candidateName.split(' ')[0] }}</h2>
                <p>Based on profile fit, interview feedback, benchmarks, and internal compensation data, we created a competitive offer tailored for this role.</p>

                <div class="offer-hero-actions">
                  <button class="offer-primary-button" type="button" @click="openReviewAiOffer">
                    <AppIcon name="sparkles" :size="15" />
                    <span>Continue to Review &amp; Edit</span>
                    <AppIcon name="chevronRight" :size="15" />
                  </button>

                  <button class="offer-secondary-button" type="button">
                    <AppIcon name="info" :size="14" />
                    <span>Explain this offer</span>
                  </button>
                </div>
              </div>

              <div class="offer-metric-panel">
                <article class="offer-mini-metric">
                  <span>Offer confidence</span>
                  <div class="offer-progress-ring">
                    <div class="offer-progress-ring__inner">
                      <strong>95%</strong>
                    </div>
                  </div>
                  <small>Very high</small>
                </article>

                <article class="offer-mini-metric">
                  <span>Market position</span>
                  <strong class="is-primary">P62</strong>
                  <small>Above market</small>
                </article>

                <article class="offer-mini-metric">
                  <span>Offer acceptance</span>
                  <strong class="is-primary">94%</strong>
                  <small>If sent today</small>
                  <div class="offer-mini-chart" aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><i />
                  </div>
                </article>
              </div>
            </div>
          </article>

          <div class="offer-subcards-grid">
            <article class="offer-card offer-info-card">
              <h3>Why This Offer</h3>
              <div class="offer-info-list">
                <div v-for="row in whyOfferRows" :key="row[0]">
                  <span>{{ row[0] }}</span>
                  <strong>{{ row[1] }}</strong>
                  <em v-if="row[2]">{{ row[2] }}</em>
                </div>
              </div>
            </article>

            <article class="offer-card offer-info-card">
              <h3>Acceptance Prediction</h3>
              <div class="offer-acceptance-head">
                <strong>94%</strong>
                <small>High chance of acceptance</small>
              </div>
              <div class="offer-acceptance-bar"><span /></div>
              <div class="offer-acceptance-rows">
                <div><span>If sent today</span><strong>94%</strong></div>
                <div><span>If delayed 7 days</span><strong>71%</strong></div>
              </div>
              <div class="offer-inline-alert">
                <AppIcon name="bell" :size="12" />
                <span>Recommendation</span>
                <strong>Send within 48h</strong>
              </div>
            </article>

            <article class="offer-card offer-info-card">
              <h3>Offer Risks</h3>
              <div class="offer-risk-list">
                <div><span>Counter-offer risk</span><strong class="is-medium">Medium</strong></div>
                <div><span>Relocation risk</span><strong class="is-low">Low</strong></div>
                <div><span>Salary gap risk</span><strong class="is-low">Low</strong></div>
                <div><span>Start date risk</span><strong class="is-low">Low</strong></div>
              </div>
              <div class="offer-inline-success">
                <AppIcon name="shield" :size="12" />
                <span>Overall risk</span>
                <strong>Low</strong>
              </div>
            </article>

            <article class="offer-card offer-info-card">
              <h3>Built from 6 Evidence Sources</h3>
              <div class="offer-evidence-list">
                <div v-for="row in evidenceRows" :key="row[0]">
                  <span><AppIcon name="spark" :size="11" /> {{ row[0] }}</span>
                  <strong>{{ row[1] }}</strong>
                </div>
              </div>
            </article>
          </div>

          <section class="offer-source-section">
            <small class="offer-section-label">OTHER WAYS TO CREATE YOUR OFFER</small>

            <div class="offer-source-grid">
              <article
                v-for="card in sourceCards"
                :key="card.title"
                class="offer-card offer-source-card"
                :class="{ 'is-clickable': card.title === 'Generate from Template' }"
                @click="handleSourceCardClick(card.title)"
              >
                <div class="offer-source-card__top">
                  <span class="offer-source-card__icon" :class="`is-${card.tone}`">
                    <AppIcon :name="card.icon" :size="15" />
                  </span>
                  <AppIcon name="chevronRight" :size="15" />
                </div>
                <strong>{{ card.title }}</strong>
                <p>{{ card.copy }}</p>
                <small :class="`is-${card.tone}`">{{ card.meta }}</small>
              </article>
            </div>
          </section>
        </section>

        <aside class="offer-side-column">
          <article class="offer-card offer-breakdown-card">
            <div class="offer-panel-head">
              <h3>Offer Breakdown (AI Draft)</h3>
              <button type="button">Edit preview</button>
            </div>

            <dl class="offer-breakdown-list">
              <div v-for="row in offerBreakdown" :key="row[0]">
                <dt>{{ row[0] }}</dt>
                <dd>{{ row[1] }}</dd>
              </div>
            </dl>

            <div class="offer-total-box">
              <span><AppIcon name="document" :size="13" /> Total Annual Cost</span>
              <strong>$156,200</strong>
            </div>
          </article>

          <article class="offer-card offer-side-card">
            <h3>Candidate Insights</h3>
            <div class="offer-side-list">
              <section v-for="row in insightsRows" :key="row[0]">
                <small>{{ row[0] }}</small>
                <div class="offer-chip-row">
                  <span v-for="item in row[1]" :key="item">{{ item }}</span>
                </div>
              </section>
            </div>
          </article>

          <article class="offer-card offer-side-card">
            <h3>Approval Status</h3>
            <div class="offer-approval-list">
              <div v-for="row in approvalRows" :key="row[0]">
                <span>{{ row[0] }}</span>
                <strong :class="`is-${row[2]}`">{{ row[1] }}</strong>
              </div>
            </div>
          </article>

          <article class="offer-card offer-control-card">
            <div class="offer-control-card__icon">
              <AppIcon name="sparkles" :size="14" />
            </div>
            <strong>You're in control</strong>
            <p>Review, adjust, and approve the offer. Nothing will be sent until you're ready.</p>
          </article>
        </aside>
      </div>

      <footer class="offer-footer">
        <article class="offer-card offer-learning-card">
          <div>
            <strong>NitroSync AI learns and improves</strong>
            <p>The more we hire, the smarter our recommendations become.</p>
          </div>
          <button type="button">
            <span>How AI recommendations work</span>
            <AppIcon name="chevronRight" :size="14" />
          </button>
        </article>

        <div class="offer-footer-actions">
          <button class="offer-footer-button" type="button" @click="emit('back')">Cancel</button>
          <button class="offer-footer-button" type="button">
            <AppIcon name="document" :size="13" />
            <span>Save as draft</span>
          </button>
          <button class="offer-primary-button is-footer" type="button" @click="openReviewAiOffer">
            <span>Continue to Review &amp; Edit</span>
            <AppIcon name="chevronRight" :size="15" />
          </button>
        </div>
      </footer>
    </section>
  </main>
  <GenerateOfferTemplateOverlay
    :open="templateOverlayOpen"
    :candidate-name="candidateName"
    @close="closeTemplateOverlay"
    @use-template="useOfferTemplate"
    @start-from-scratch="openScratchOffer"
  />
</template>

<style>
.offer-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top center, rgba(255, 58, 153, 0.1), transparent 26%),
    linear-gradient(180deg, #fff7fb 0%, #fff 100%);
}

.offer-workspace {
  width: min(100%, 1780px);
  margin: 0 auto;
  padding: 16px 20px 20px;
}

.offer-card {
  border: 1px solid #edf1f8;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 36px rgba(255, 76, 146, 0.06);
}

.offer-header {
  padding: 18px 22px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.offer-header__identity {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.offer-header__mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #ff4b9f 0%, #ff267f 100%);
  box-shadow: 0 14px 24px rgba(255, 38, 127, 0.18);
}

.offer-header h1,
.offer-panel-head h3,
.offer-breakdown-card h3,
.offer-side-card h3,
.offer-info-card h3,
.offer-source-card strong,
.offer-control-card strong,
.offer-learning-card strong {
  margin: 0;
  color: #1c2b4a;
}

.offer-header h1 {
  font-size: 1.28rem;
  font-weight: 800;
}

.offer-header p,
.offer-hero-copy p,
.offer-source-card p,
.offer-control-card p,
.offer-learning-card p {
  margin: 4px 0 0;
  color: #8490a7;
  font-size: 0.88rem;
  line-height: 1.55;
}

.offer-header__steps {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  gap: 16px;
}

.offer-stepper {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
}

.offer-step {
  position: relative;
  min-width: 126px;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  color: #8f9ab0;
  flex: 0 0 auto;
}

.offer-step span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8f9ab0;
  background: #f4f6fb;
  box-shadow: inset 0 0 0 1px #dfe4ef;
  font-size: 0.88rem;
  font-weight: 800;
}

.offer-step strong {
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-stepper::-webkit-scrollbar {
  display: none;
}

.offer-step.is-active {
  color: #1c2b4a;
}

.offer-step.is-active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -12px;
  width: 112px;
  height: 3px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #ff4098 0%, #ff1f7c 100%);
}

.offer-step.is-active span {
  color: #fff;
  background: linear-gradient(180deg, #ff4098 0%, #ff1f7c 100%);
  box-shadow: none;
}

.offer-step-line {
  width: 24px;
  height: 1px;
  background: #dfe4ef;
  flex: 0 0 auto;
}

.offer-close-button,
.offer-outline-button,
.offer-secondary-button,
.offer-footer-button,
.offer-learning-card button,
.offer-panel-head button {
  border: 0;
  background: transparent;
}

.offer-close-button {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #8391a9;
}

.offer-candidate-strip {
  margin-top: 16px;
  padding: 18px 22px;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.86fr) auto;
  gap: 18px;
  align-items: center;
}

.offer-candidate-strip__left,
.offer-candidate-strip__center {
  display: flex;
  align-items: center;
  gap: 16px;
}

.offer-avatar {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b3a11;
  background: linear-gradient(180deg, #ffdcbc 0%, #ffc68d 100%);
  font-size: 1.1rem;
  font-weight: 800;
}

.offer-avatar i {
  position: absolute;
  right: 1px;
  bottom: 1px;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #0db97f;
}

.offer-candidate-copy__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-candidate-copy__head strong {
  font-size: 1.18rem;
  font-weight: 800;
  color: #1c2b4a;
}

.offer-candidate-copy__head em {
  padding: 4px 9px;
  border-radius: 999px;
  color: #13a76c;
  background: #eaf9f1;
  font-style: normal;
  font-size: 0.78rem;
  font-weight: 800;
}

.offer-candidate-copy > span {
  display: block;
  margin-top: 4px;
  color: #3f4f70;
  font-size: 0.9rem;
  font-weight: 600;
}

.offer-candidate-copy__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.offer-candidate-copy__meta small,
.offer-kicker,
.offer-mini-metric span,
.offer-mini-metric small,
.offer-candidate-strip__center article span,
.offer-section-label,
.offer-side-list small,
.offer-panel-head button {
  color: #93a0b8;
  font-size: 0.74rem;
  font-weight: 700;
}

.offer-candidate-copy__meta small {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.offer-candidate-strip__center {
  justify-content: center;
  gap: 26px;
}

.offer-candidate-strip__center article {
  display: grid;
  gap: 6px;
}

.offer-candidate-strip__center article span {
  text-transform: uppercase;
}

.offer-candidate-strip__center article strong {
  color: #4d39e3;
  font-size: 1rem;
  font-weight: 800;
}

.offer-candidate-strip__center article.is-green strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #12a96d;
}

.offer-outline-button {
  min-height: 50px;
  padding: 0 18px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #203254;
  box-shadow: inset 0 0 0 1px #e8edf6;
  font-weight: 800;
  white-space: nowrap;
}

.offer-main-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.68fr) 30%;
  gap: 18px;
  align-items: start;
}

.offer-main-column,
.offer-side-column {
  display: grid;
  gap: 18px;
}

.offer-hero-card {
  padding: 22px 24px;
}

.offer-kicker {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #ff2d87;
  letter-spacing: 0.06em;
}

.offer-hero-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(390px, 0.95fr);
  gap: 18px;
  align-items: start;
}

.offer-hero-copy h2 {
  margin: 0;
  color: #1c2b4a;
  font-size: 2.1rem;
  line-height: 1.05;
  font-weight: 800;
}

.offer-hero-copy h2 span {
  color: #ff2d87;
}

.offer-hero-actions,
.offer-footer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.offer-hero-actions {
  margin-top: 22px;
}

.offer-primary-button,
.offer-secondary-button,
.offer-footer-button {
  min-height: 44px;
  padding: 0 18px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
}

.offer-primary-button {
  border: 0;
  color: #fff;
  background: linear-gradient(180deg, #ff4299 0%, #ff1f7c 100%);
  box-shadow: 0 18px 28px rgba(255, 31, 124, 0.22);
}

.offer-primary-button.is-footer {
  min-width: 220px;
}

.offer-secondary-button,
.offer-footer-button {
  color: #334663;
  background: #fff;
  box-shadow: inset 0 0 0 1px #e8edf6;
}

.offer-metric-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.offer-mini-metric {
  min-height: 252px;
  padding: 18px 12px 16px;
  border-radius: 22px;
  display: grid;
  align-content: start;
  justify-items: center;
  text-align: center;
  box-shadow: inset 0 0 0 1px #eef2f8;
}

.offer-progress-ring {
  width: 118px;
  height: 118px;
  margin-top: 16px;
  padding: 7px;
  border-radius: 50%;
  background: conic-gradient(#18b87b 0 342deg, #eef7f2 342deg 360deg);
}

.offer-progress-ring__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #1f2d49;
}

.offer-progress-ring__inner strong,
.offer-mini-metric strong.is-primary,
.offer-acceptance-head strong,
.offer-total-box strong {
  font-size: 1.9rem;
  font-weight: 800;
}

.offer-mini-metric strong.is-primary {
  margin-top: 42px;
  color: #302fcd;
}

.offer-mini-metric small {
  margin-top: 8px;
}

.offer-mini-metric:first-child small,
.offer-risk-list strong.is-low,
.offer-inline-success strong,
.offer-info-list em {
  color: #12a86c;
}

.offer-mini-chart {
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 7px;
  padding-top: 18px;
}

.offer-mini-chart i {
  width: 10px;
  border-radius: 999px 999px 3px 3px;
  background: linear-gradient(180deg, rgba(255, 66, 153, 0.2) 0%, #ff2d87 100%);
}

.offer-mini-chart i:nth-child(1) { height: 9px; }
.offer-mini-chart i:nth-child(2) { height: 12px; }
.offer-mini-chart i:nth-child(3) { height: 15px; }
.offer-mini-chart i:nth-child(4) { height: 18px; }
.offer-mini-chart i:nth-child(5) { height: 21px; }
.offer-mini-chart i:nth-child(6) { height: 24px; }
.offer-mini-chart i:nth-child(7) { height: 28px; }

.offer-subcards-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.offer-info-card,
.offer-breakdown-card,
.offer-side-card,
.offer-control-card,
.offer-source-card,
.offer-learning-card {
  padding: 20px 22px;
}

.offer-info-card h3,
.offer-breakdown-card h3,
.offer-side-card h3 {
  font-size: 1.05rem;
  font-weight: 800;
}

.offer-info-list,
.offer-risk-list,
.offer-evidence-list,
.offer-breakdown-list,
.offer-approval-list,
.offer-side-list {
  margin-top: 16px;
}

.offer-info-list,
.offer-risk-list,
.offer-evidence-list,
.offer-approval-list {
  display: grid;
  gap: 11px;
}

.offer-info-list div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
}

.offer-info-list span,
.offer-risk-list span,
.offer-evidence-list span,
.offer-breakdown-list dt,
.offer-approval-list span,
.offer-acceptance-rows span {
  color: #7e8aa2;
  font-size: 0.8rem;
}

.offer-info-list strong,
.offer-risk-list strong,
.offer-evidence-list strong,
.offer-breakdown-list dd,
.offer-acceptance-rows strong,
.offer-approval-list strong {
  margin: 0;
  color: #213250;
  font-size: 0.84rem;
  font-weight: 800;
}

.offer-info-list em,
.offer-risk-list strong.is-medium,
.offer-approval-list strong.is-pending {
  font-style: normal;
  color: #f59e0b;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-acceptance-head {
  display: grid;
  gap: 2px;
  margin-top: 16px;
}

.offer-acceptance-head small {
  color: #7e8aa2;
  font-size: 0.76rem;
}

.offer-acceptance-bar {
  height: 7px;
  margin-top: 16px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.offer-acceptance-bar span {
  display: block;
  width: 94%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff4299 0%, #ff1f7c 100%);
}

.offer-acceptance-rows {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.offer-acceptance-rows div,
.offer-risk-list div,
.offer-evidence-list div,
.offer-approval-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.offer-inline-alert,
.offer-inline-success,
.offer-total-box {
  margin-top: 16px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.offer-inline-alert {
  color: #ff2d87;
  background: linear-gradient(180deg, #fff6fb 0%, #fff1f8 100%);
}

.offer-inline-alert span,
.offer-inline-success span,
.offer-total-box span {
  color: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.offer-inline-alert strong,
.offer-inline-success strong {
  margin-left: auto;
  font-size: 0.78rem;
}

.offer-inline-success {
  color: #12a86c;
  background: linear-gradient(180deg, #f3fcf7 0%, #ebfaf2 100%);
}

.offer-evidence-list span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.offer-source-section {
  display: grid;
  gap: 12px;
}

.offer-section-label {
  letter-spacing: 0.06em;
}

.offer-source-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.offer-source-card.is-clickable {
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.offer-source-card.is-clickable:hover {
  transform: translateY(-2px);
  box-shadow:
    0 24px 60px rgba(24, 33, 68, 0.12),
    inset 0 0 0 1px rgba(255, 64, 152, 0.16);
}

.offer-source-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #99a4b9;
}

.offer-source-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.offer-source-card__icon.is-violet {
  color: #705df9;
  background: #f3f0ff;
}

.offer-source-card__icon.is-orange {
  color: #ff8b37;
  background: #fff3e8;
}

.offer-source-card__icon.is-blue {
  color: #0ea5e9;
  background: #ecf8ff;
}

.offer-source-card strong {
  display: block;
  margin-top: 16px;
  font-size: 0.98rem;
  font-weight: 800;
}

.offer-source-card small {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.74rem;
  font-weight: 800;
}

.offer-source-card small.is-violet {
  color: #705df9;
}

.offer-source-card small.is-orange {
  color: #ff8b37;
}

.offer-source-card small.is-blue {
  color: #0ea5e9;
}

.offer-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.offer-panel-head h3 {
  font-size: 1.04rem;
  font-weight: 800;
}

.offer-panel-head button {
  color: #ff2d87;
}

.offer-breakdown-list {
  display: grid;
  gap: 12px;
}

.offer-breakdown-list div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
}

.offer-breakdown-list dd {
  text-align: right;
}

.offer-total-box {
  justify-content: space-between;
  color: #ff2d87;
  background: linear-gradient(180deg, #fff5fa 0%, #fff0f8 100%);
}

.offer-side-list {
  display: grid;
  gap: 16px;
}

.offer-side-list section {
  display: grid;
  gap: 8px;
}

.offer-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.offer-chip-row span {
  padding: 5px 9px;
  border-radius: 999px;
  color: #13a96d;
  background: #ebfaf1;
  font-size: 0.72rem;
  font-weight: 800;
}

.offer-approval-list strong.is-approved {
  color: #12a86c;
}

.offer-approval-list strong.is-idle {
  color: #9aa5b7;
}

.offer-control-card {
  background: linear-gradient(180deg, #fff8fc 0%, #fff3f9 100%);
}

.offer-control-card__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff;
  box-shadow: 0 10px 18px rgba(255, 45, 135, 0.1);
}

.offer-control-card strong {
  display: block;
  margin-top: 14px;
  font-size: 1rem;
  font-weight: 800;
}

.offer-footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.offer-learning-card {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  background: linear-gradient(180deg, #f8f5ff 0%, #fcfbff 100%);
}

.offer-learning-card button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #6e5af9;
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 1480px) {
  .offer-main-layout {
    grid-template-columns: 1fr;
  }

  .offer-side-column {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1240px) {
  .offer-header,
  .offer-candidate-strip,
  .offer-footer {
    grid-template-columns: 1fr;
    display: grid;
  }

  .offer-header__steps,
  .offer-candidate-strip__center {
    justify-content: flex-start;
  }

  .offer-hero-grid,
  .offer-subcards-grid,
  .offer-source-grid,
  .offer-side-column {
    grid-template-columns: 1fr 1fr;
  }

  .offer-metric-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 920px) {
  .offer-workspace {
    padding: 12px;
  }

  .offer-hero-grid,
  .offer-subcards-grid,
  .offer-source-grid,
  .offer-side-column,
  .offer-candidate-strip {
    grid-template-columns: 1fr;
  }

  .offer-step {
    min-width: 126px;
    flex: 0 0 auto;
  }

  .offer-breakdown-list div,
  .offer-info-list div {
    grid-template-columns: 1fr;
  }

  .offer-breakdown-list dd {
    text-align: left;
  }
}

@media (max-width: 720px) {
  .offer-header,
  .offer-candidate-strip,
  .offer-hero-card,
  .offer-info-card,
  .offer-breakdown-card,
  .offer-side-card,
  .offer-control-card,
  .offer-source-card,
  .offer-learning-card {
    padding: 16px;
    border-radius: 22px;
  }

  .offer-hero-copy h2 {
    font-size: 1.6rem;
  }

  .offer-footer-actions,
  .offer-hero-actions {
    display: grid;
  }

  .offer-primary-button.is-footer,
  .offer-outline-button,
  .offer-primary-button,
  .offer-secondary-button,
  .offer-footer-button {
    width: 100%;
  }
}
</style>
