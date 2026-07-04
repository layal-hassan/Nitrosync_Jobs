<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Ava Martinez',
  },
  candidateRole: {
    type: String,
    default: 'Product Designer',
  },
  candidateMatch: {
    type: String,
    default: '92% Match',
  },
  candidateAppliedOn: {
    type: String,
    default: '23 May 2025',
  },
})

const emit = defineEmits(['close'])

const flowState = ref('review')
const selectedDecision = ref('request-missing-info')
const sendMissingInfoRequest = ref(true)
const updateTimeline = ref(true)
const notifyAfterAction = ref(true)

const knockoutCriteria = [
  {
    title: 'Work Authorization',
    note: 'Must be authorized to work in Sweden',
    source: 'Application Form',
    evidence: 'Answer: Authorized to work in Sweden',
    confidence: '99%',
    status: 'passed',
    icon: 'check',
  },
  {
    title: 'Required Location',
    note: 'Stockholm, Sweden or Remote in Sweden',
    source: 'Candidate Profile',
    evidence: 'Stockholm, Sweden',
    confidence: '100%',
    status: 'passed',
    icon: 'check',
  },
  {
    title: 'Portfolio Submitted',
    note: 'Portfolio is mandatory',
    source: 'Candidate Uploads',
    evidence: 'Portfolio.pdf uploaded',
    confidence: '100%',
    status: 'passed',
    icon: 'check',
  },
  {
    title: 'Minimum Experience',
    note: 'Minimum 5+ years of experience in Product Design',
    source: 'AI Resume Analysis',
    evidence: '8 years of Product Design experience',
    confidence: '98%',
    status: 'passed',
    icon: 'check',
  },
  {
    title: 'Required Skills',
    note: 'Figma, Design Systems, UX Research',
    source: 'AI Skill Extraction',
    evidence: 'Figma, Design Systems, UX Research',
    confidence: '97%',
    status: 'passed',
    icon: 'check',
  },
  {
    title: 'Salary Expectation',
    note: 'Within budget range (50,000 - 62,000 SEK/month)',
    source: 'Not Collected Yet',
    evidence: 'No salary information available',
    confidence: '--',
    status: 'needs-info',
    icon: 'alert',
  },
]

const decisionOptions = [
  {
    id: 'keep-applied',
    title: 'Keep in Applied',
    copy: 'Keep candidate in current stage',
    icon: 'pause',
  },
  {
    id: 'request-missing-info',
    title: 'Request Missing Info',
    copy: 'Ask candidate for missing information',
    icon: 'document',
  },
  {
    id: 'move-qualified',
    title: 'Move to Qualified',
    copy: 'Candidate passes all knockout criteria',
    icon: 'chevrons-right',
  },
  {
    id: 'disqualify',
    title: 'Disqualify Candidate',
    copy: 'Does not meet mandatory requirements',
    icon: 'close',
    tone: 'danger',
  },
]

const evidenceSources = [
  { title: 'Application Form', note: 'Answers from candidate application', icon: 'document' },
  { title: 'AI Resume Analysis', note: 'Extracted from resume using AI', icon: 'sparkles' },
  { title: 'Candidate Profile', note: 'Information from candidate profile', icon: 'user' },
  { title: 'Candidate Uploads', note: 'Files uploaded by candidate', icon: 'cloud-upload' },
]

const passedCount = computed(() => knockoutCriteria.filter((item) => item.status === 'passed').length)
const totalCriteria = computed(() => knockoutCriteria.length)
const missingCount = computed(() => knockoutCriteria.filter((item) => item.status === 'needs-info').length)
const overallStatus = computed(() => (missingCount.value ? 'Needs Information' : 'Eligible'))
const statusTone = computed(() => (missingCount.value ? 'orange' : 'green'))
const successCopy = computed(() => `The candidate ${props.candidateName} has been updated in the pipeline based on your decision.`)
const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetState() {
  flowState.value = 'review'
  selectedDecision.value = 'request-missing-info'
  sendMissingInfoRequest.value = true
  updateTimeline.value = true
  notifyAfterAction.value = true
}

function closeOverlay() {
  emit('close')
}

function applyDecision() {
  flowState.value = 'success'
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="knockout-overlay"
      :class="{ 'is-success': flowState === 'success' }"
      @click.self="closeOverlay"
    >
      <section v-if="flowState === 'review'" class="knockout-modal">
        <header class="knockout-modal__head">
          <div class="knockout-modal__title">
            <span class="knockout-modal__title-icon">
              <AppIcon name="spark" :size="18" />
            </span>
            <div>
              <h2>Auto DQ / Knockout Check</h2>
              <p>AI-powered eligibility check based on knockout criteria for this role</p>
            </div>
          </div>

          <button class="knockout-modal__close" type="button" aria-label="Close knockout check" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="knockout-modal__body">
          <div class="knockout-layout">
            <section class="knockout-main">
              <article class="knockout-profile">
                <span class="knockout-profile__avatar">{{ candidateInitials }}</span>
                <div class="knockout-profile__copy">
                  <strong>{{ candidateName }}</strong>
                  <span>{{ candidateRole }}</span>
                  <div class="knockout-profile__meta">
                    <em>APPLIED</em>
                    <i></i>
                    <small>Applied on {{ candidateAppliedOn }}</small>
                    <i></i>
                    <b>{{ candidateMatch }}</b>
                  </div>
                </div>
              </article>

              <section class="knockout-results">
                <div class="knockout-section-head">
                  <h3>Knockout Check Results</h3>
                </div>

                <div class="knockout-results__table">
                  <div class="knockout-results__head">
                    <span>Criteria</span>
                    <span>Result</span>
                    <span>Source</span>
                    <span>Evidence</span>
                    <span>Confidence</span>
                  </div>

                  <article v-for="item in knockoutCriteria" :key="item.title" class="knockout-results__row">
                    <div class="knockout-results__criteria">
                      <strong>{{ item.title }}</strong>
                      <small>{{ item.note }}</small>
                    </div>

                    <div class="knockout-results__result" :class="`is-${item.status}`">
                      <AppIcon :name="item.icon" :size="12" />
                      <span>{{ item.status === 'passed' ? 'Passed' : 'Missing' }}</span>
                    </div>

                    <div class="knockout-results__source">{{ item.source }}</div>
                    <div class="knockout-results__evidence">{{ item.evidence }}</div>

                    <div class="knockout-results__confidence">
                      <span>{{ item.confidence }}</span>
                      <div class="knockout-results__bar">
                        <span :style="{ width: item.confidence === '--' ? '0%' : item.confidence }" />
                      </div>
                    </div>
                  </article>
                </div>

                <p class="knockout-results__footnote">Results are based on the job knockout criteria set for the Product Designer role.</p>
              </section>

              <section class="knockout-actions">
                <div class="knockout-section-head">
                  <h3>Choose your next action</h3>
                </div>

                <div class="knockout-actions__grid">
                  <button
                    v-for="option in decisionOptions"
                    :key="option.id"
                    class="knockout-action-card"
                    :class="[{ 'is-active': selectedDecision === option.id }, option.tone ? `is-${option.tone}` : '']"
                    type="button"
                    @click="selectedDecision = option.id"
                  >
                    <span class="knockout-action-card__icon">
                      <AppIcon :name="option.icon" :size="15" />
                    </span>
                    <strong>{{ option.title }}</strong>
                    <small>{{ option.copy }}</small>
                  </button>
                </div>
              </section>
            </section>

            <aside class="knockout-side">
              <section class="knockout-side__panel">
                <div class="knockout-section-head">
                  <h3>Overall Eligibility</h3>
                </div>

                <div class="knockout-eligibility">
                  <div class="knockout-eligibility__ring">
                    <strong>{{ passedCount }} / {{ totalCriteria }}</strong>
                    <span>Checks Passed</span>
                  </div>

                  <div class="knockout-eligibility__status">
                    <span>Status:</span>
                    <strong :class="`is-${statusTone}`">{{ overallStatus }}</strong>
                  </div>
                  <div class="knockout-eligibility__status">
                    <span>Missing:</span>
                    <strong class="is-orange">{{ missingCount }}</strong>
                  </div>
                </div>
              </section>

              <section class="knockout-side__panel is-recommendation">
                <div class="knockout-section-head">
                  <h3>Nitro Recommendation</h3>
                </div>

                <article class="knockout-recommendation">
                  <strong>Request Salary Expectation</strong>
                  <small>Confidence: 93%</small>
                </article>

                <p>Candidate meets all mandatory requirements except salary information. Request salary expectation to proceed.</p>

                <div class="knockout-recommendation__footer">
                  <span>Suggested next action</span>
                  <button type="button">Request Salary Expectation</button>
                </div>
              </section>

              <section class="knockout-side__panel">
                <div class="knockout-section-head">
                  <h3>Automation <small>(optional)</small></h3>
                </div>

                <label class="knockout-check">
                  <input v-model="sendMissingInfoRequest" type="checkbox">
                  <span class="knockout-check__box"><AppIcon name="check" :size="12" /></span>
                  <span>Send missing info request if needed</span>
                </label>

                <label class="knockout-check">
                  <input v-model="updateTimeline" type="checkbox">
                  <span class="knockout-check__box"><AppIcon name="check" :size="12" /></span>
                  <span>Update candidate timeline</span>
                </label>

                <label class="knockout-check">
                  <input v-model="notifyAfterAction" type="checkbox">
                  <span class="knockout-check__box"><AppIcon name="check" :size="12" /></span>
                  <span>Notify me after action is completed</span>
                </label>
              </section>

              <section class="knockout-side__panel">
                <div class="knockout-section-head">
                  <h3>Where do results come from?</h3>
                </div>

                <div class="knockout-sources">
                  <article v-for="item in evidenceSources" :key="item.title" class="knockout-sources__item">
                    <span class="knockout-sources__icon">
                      <AppIcon :name="item.icon" :size="14" />
                    </span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <small>{{ item.note }}</small>
                    </div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="knockout-modal__footer">
          <button class="knockout-button knockout-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="knockout-button knockout-button--primary" type="button" @click="applyDecision">
            Apply Decision
          </button>
        </footer>
      </section>

      <section v-else class="knockout-success">
        <div class="knockout-success__icon">
          <AppIcon name="checkCircle" :size="34" />
        </div>

        <h2>Decision Applied</h2>
        <p>{{ successCopy }}</p>

        <button class="knockout-button knockout-button--primary knockout-success__button" type="button" @click="closeOverlay">
          <AppIcon name="chevronLeft" :size="14" />
          <span>Back to Pipeline</span>
        </button>

        <div class="knockout-success__hint">
          <AppIcon name="sparkles" :size="13" />
          <span>NitroSync AI has synced this change with your HRIS.</span>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.knockout-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(18, 24, 38, 0.5);
  backdrop-filter: blur(4px);
}

.knockout-overlay.is-success {
  background: rgba(193, 200, 210, 0.66);
  backdrop-filter: blur(7px);
}

.knockout-modal,
.knockout-success {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.28);
}

.knockout-modal {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.knockout-modal__head,
.knockout-modal__title,
.knockout-profile,
.knockout-results__result,
.knockout-results__confidence,
.knockout-action-card,
.knockout-eligibility__status,
.knockout-check,
.knockout-sources__item,
.knockout-modal__footer,
.knockout-button,
.knockout-success,
.knockout-success__hint {
  display: flex;
  align-items: center;
}

.knockout-modal__head,
.knockout-modal__footer {
  justify-content: space-between;
}

.knockout-modal__head {
  padding: 18px 24px;
  border-bottom: 1px solid #edf2fb;
}

.knockout-modal__title {
  gap: 12px;
}

.knockout-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #eef4ff;
  color: #6b76ff;
}

.knockout-modal__title h2,
.knockout-success h2 {
  margin: 0;
  color: #1f2940;
}

.knockout-modal__title p,
.knockout-results__criteria small,
.knockout-results__footnote,
.knockout-recommendation small,
.knockout-recommendation + p,
.knockout-sources__item small,
.knockout-success p,
.knockout-success__hint span {
  color: #738199;
}

.knockout-modal__close {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.knockout-modal__body {
  overflow: auto;
  padding: 20px 24px;
}

.knockout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
}

.knockout-main {
  min-width: 0;
}

.knockout-profile {
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
}

.knockout-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 48px;
}

.knockout-profile__copy strong,
.knockout-section-head h3,
.knockout-results__criteria strong,
.knockout-eligibility__ring strong,
.knockout-recommendation strong,
.knockout-sources__item strong {
  color: #1f2940;
}

.knockout-profile__copy strong {
  display: block;
  font-size: 1rem;
}

.knockout-profile__copy span {
  display: block;
  margin-top: 2px;
  color: #738199;
}

.knockout-profile__meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.knockout-profile__meta em,
.knockout-profile__meta b {
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 800;
}

.knockout-profile__meta em {
  color: #5f84ff;
}

.knockout-profile__meta small {
  color: #8b97ab;
}

.knockout-profile__meta i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cdd6e2;
}

.knockout-profile__meta b {
  color: #21a45f;
}

.knockout-results,
.knockout-actions {
  margin-top: 16px;
}

.knockout-section-head h3 {
  margin: 0;
  font-size: 0.94rem;
}

.knockout-section-head small {
  color: #9aa6bb;
  font-size: 0.78rem;
}

.knockout-results__table {
  margin-top: 12px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  overflow: hidden;
}

.knockout-results__head,
.knockout-results__row {
  display: grid;
  grid-template-columns: 1.35fr 0.7fr 0.8fr 1fr 0.85fr;
  gap: 12px;
  align-items: center;
}

.knockout-results__head {
  padding: 12px 14px;
  background: #fbfcff;
  color: #8d99ae;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.knockout-results__row {
  padding: 14px;
  border-top: 1px solid #eef2f8;
}

.knockout-results__criteria strong {
  display: block;
  font-size: 0.86rem;
}

.knockout-results__criteria small {
  display: block;
  margin-top: 3px;
  line-height: 1.45;
}

.knockout-results__result {
  gap: 6px;
  font-weight: 700;
}

.knockout-results__result.is-passed {
  color: #20a55f;
}

.knockout-results__result.is-needs-info {
  color: #ff8a1f;
}

.knockout-results__source,
.knockout-results__evidence {
  color: #56647f;
  font-size: 0.82rem;
  line-height: 1.45;
}

.knockout-results__confidence {
  gap: 10px;
}

.knockout-results__confidence span {
  min-width: 34px;
  color: #25324e;
  font-size: 0.82rem;
  font-weight: 700;
}

.knockout-results__bar {
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: #e6ebf3;
  overflow: hidden;
}

.knockout-results__bar > span {
  display: block;
  min-width: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #21c15c 0%, #1aa354 100%);
}

.knockout-results__footnote {
  margin: 10px 2px 0;
  font-size: 0.8rem;
}

.knockout-actions__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.knockout-action-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-height: 112px;
  padding: 14px;
  border: 1px solid #e6ebf4;
  border-radius: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
}

.knockout-action-card.is-active {
  border-color: #ff73bb;
  box-shadow: inset 0 0 0 1px #ff73bb;
}

.knockout-action-card.is-danger strong,
.knockout-action-card.is-danger small,
.knockout-action-card.is-danger .knockout-action-card__icon {
  color: #e54242;
}

.knockout-action-card__icon {
  color: #77849a;
}

.knockout-action-card strong {
  font-size: 0.84rem;
}

.knockout-action-card small {
  color: #7f8ba1;
  line-height: 1.4;
}

.knockout-side {
  display: grid;
  align-content: start;
  gap: 16px;
}

.knockout-side__panel {
  padding: 16px;
  border: 1px solid #e8edf6;
  border-radius: 16px;
  background: #fff;
}

.knockout-side__panel.is-recommendation {
  background: #fffafd;
}

.knockout-eligibility {
  display: grid;
  gap: 14px;
  margin-top: 12px;
}

.knockout-eligibility__ring {
  display: grid;
  place-items: center;
  width: 124px;
  height: 124px;
  margin: 0 auto;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #fff 56%, transparent 57%),
    conic-gradient(from -90deg, #ff71ba 0deg, #f05fab 300deg, #f2e7ee 300deg, #f2e7ee 360deg);
  box-shadow: inset 0 0 0 1px rgba(240, 95, 171, 0.08);
  text-align: center;
}

.knockout-eligibility__ring strong {
  display: block;
  font-size: 1.8rem;
}

.knockout-eligibility__ring span {
  display: block;
  color: #8996ab;
  font-size: 0.68rem;
}

.knockout-eligibility__status {
  justify-content: space-between;
}

.knockout-eligibility__status span {
  color: #8895aa;
}

.knockout-eligibility__status strong.is-green {
  color: #1ea55d;
}

.knockout-eligibility__status strong.is-orange {
  color: #ff8a1f;
}

.knockout-recommendation {
  display: grid;
  gap: 4px;
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #f5dce8;
  border-radius: 14px;
  background: #fff3f9;
}

.knockout-recommendation small {
  font-size: 0.74rem;
}

.knockout-recommendation + p {
  margin: 12px 0 0;
  line-height: 1.5;
}

.knockout-recommendation__footer {
  margin-top: 14px;
}

.knockout-recommendation__footer span {
  display: block;
  color: #98a4b8;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.knockout-recommendation__footer button {
  width: 100%;
  min-height: 36px;
  margin-top: 8px;
  border: 1px solid #ff82c0;
  border-radius: 10px;
  background: #fff;
  color: #ff67b5;
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
}

.knockout-check {
  gap: 10px;
  margin-top: 12px;
  color: #42506b;
  cursor: pointer;
}

.knockout-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.knockout-check__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid #f1a7cf;
  border-radius: 6px;
  background: #fff;
  color: transparent;
  flex: 0 0 20px;
}

.knockout-check input:checked + .knockout-check__box {
  border-color: #ff69b6;
  background: #ff69b6;
  color: #fff;
}

.knockout-sources {
  display: grid;
  gap: 14px;
  margin-top: 12px;
}

.knockout-sources__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #f7f9fc;
  color: #7c89a0;
  flex: 0 0 24px;
}

.knockout-sources__item {
  gap: 10px;
  align-items: flex-start;
}

.knockout-sources__item strong {
  display: block;
  font-size: 0.82rem;
}

.knockout-sources__item small {
  display: block;
  margin-top: 3px;
  line-height: 1.45;
}

.knockout-modal__footer {
  padding: 18px 24px 24px;
  border-top: 1px solid #edf2fb;
}

.knockout-button {
  justify-content: center;
  gap: 8px;
  min-width: 132px;
  height: 42px;
  padding: 0 20px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.knockout-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.knockout-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

.knockout-success {
  width: min(100%, 400px);
  max-height: none;
  padding: 28px 30px 20px;
  display: grid;
  gap: 16px;
  justify-items: center;
  text-align: center;
}

.knockout-success__icon {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #fff1f8;
  color: #f066b2;
}

.knockout-success h2 {
  font-size: 1rem;
}

.knockout-success p {
  max-width: 270px;
  line-height: 1.5;
}

.knockout-success__button {
  width: 100%;
}

.knockout-success__hint {
  width: 100%;
  justify-content: center;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid #edf1f6;
}

.knockout-success__hint :deep(svg) {
  color: #f066b2;
}

@media (max-width: 1080px) {
  .knockout-layout,
  .knockout-actions__grid {
    grid-template-columns: 1fr;
  }

  .knockout-results__head,
  .knockout-results__row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .knockout-overlay {
    padding: 12px;
  }

  .knockout-modal,
  .knockout-success {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .knockout-modal__body,
  .knockout-modal__head,
  .knockout-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .knockout-modal__head,
  .knockout-modal__footer,
  .knockout-profile {
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .knockout-button {
    width: 100%;
  }
}
</style>
