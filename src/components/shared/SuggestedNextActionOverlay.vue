<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
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
  candidateStage: {
    type: String,
    default: 'Assessment',
  },
})

const emit = defineEmits([
  'close',
  'schedule-screening',
  'request-hm-review',
  'move-shortlisted',
  'move-validation',
  'assign-assessment',
  'hold-candidate',
  'reject-candidate',
  'add-note',
])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')

const decisionTitle = 'Move Candidate to Validation'
const decisionSummary = 'The candidate has successfully met the objectives of the Assessment stage. Technical competency is sufficiently validated, and the remaining competencies are intended to be evaluated during Validation.'
const decisionConfidence = '94%'

const evidenceItems = [
  { title: 'Assessment Insights', copy: 'Strong analytical reasoning and problem solving demonstrated.', status: 'Strong', tone: 'green', icon: 'document' },
  { title: 'Strengths & Gaps', copy: 'Technical competency validated. Leadership evidence still missing.', status: 'Medium', tone: 'orange', icon: 'alert' },
  { title: 'Feedback Quality', copy: 'High quality feedback from scorecards.', status: 'High', tone: 'green', icon: 'message' },
  { title: 'Score Calibration', copy: 'Reviewers are highly aligned.', status: '92%', tone: 'green', icon: 'target' },
  { title: 'Bias Detection', copy: 'No significant fairness concerns detected.', status: 'Clear', tone: 'green', icon: 'shield' },
]

const decisionReasons = [
  { text: 'Assessment results exceeded the progression threshold.', tone: 'green' },
  { text: 'No additional assessments are expected to produce meaningful new evidence.', tone: 'green' },
  { text: 'Reviewer feedback strongly supports technical competency.', tone: 'green' },
  { text: 'Reviewers are highly aligned with minimal score variance.', tone: 'green' },
  { text: 'No material bias or fairness concerns detected in the evaluations.', tone: 'green' },
  { text: 'Communication is not yet evaluated.', tone: 'orange' },
  { text: 'Leadership & collaboration not yet validated.', tone: 'orange' },
]

const alternativeDecisions = [
  { title: 'Assign another assessment', confidence: '35%', tone: 'violet', note: 'Current assessments already provide sufficient technical evidence.' },
  { title: 'Keep candidate in Assessment', confidence: '25%', tone: 'orange', note: 'No additional assessment is expected to change the decision.' },
  { title: 'Reject candidate', confidence: '9%', tone: 'red', note: 'Assessment evidence appears to support progression to the next stage.' },
]

const nextStageItems = ['Communication', 'Collaboration', 'Leadership', 'Stakeholder Management']

const riskItems = [
  'Communication has not yet been validated.',
  'Leadership evidence is currently unavailable.',
]

const recommendationChangeItems = [
  'Poor communication or collaboration during Validation',
  'Significant concerns raised in the behavioral interview',
  'Evidence contradicting assessment findings',
  'New critical information about the candidate',
]

const actionCards = [
  { title: 'Move Candidate to Validation', subtitle: 'Proceed to next stage', tone: 'primary', emit: 'move-validation', icon: 'checkCircle' },
  { title: 'Schedule Validation Interview', subtitle: 'Set up next interview', tone: 'neutral', emit: 'request-hm-review', icon: 'calendar' },
  { title: 'Assign Assessment', subtitle: 'Add another assessment', tone: 'neutral', emit: 'assign-assessment', icon: 'userPlus' },
  { title: 'Hold Candidate', subtitle: 'Pause progression', tone: 'neutral', emit: 'hold-candidate', icon: 'pause' },
  { title: 'Reject Candidate', subtitle: 'End process', tone: 'neutral', emit: 'reject-candidate', icon: 'close' },
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

function runAction(actionEmit) {
  emit(actionEmit)
  if (actionEmit !== 'add-note') {
    emit('close')
  }
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
    <div v-if="open" class="hiring-decision-overlay" @click.self="closeOverlay">
      <section class="hiring-decision-modal">
        <header class="hiring-decision-modal__header">
          <div class="hiring-decision-modal__title">
            <span class="hiring-decision-modal__title-icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="hiring-decision-modal__title-row">
                <h2>AI Hiring Decision</h2>
                <em>Beta</em>
              </div>
              <p>AI recommendation for the current stage</p>
            </div>
          </div>

          <div class="hiring-decision-modal__header-actions">
            <button type="button">
              <AppIcon name="info" :size="14" />
              <span>How AI makes this decision</span>
            </button>
            <button class="hiring-decision-modal__close" type="button" aria-label="Close AI Hiring Decision" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="hiring-decision-modal__body">
          <div class="hiring-decision-layout">
            <aside class="hiring-decision-side">
              <section class="candidate-card">
                <span class="candidate-card__avatar">
                  {{ candidateName.split(' ').map((part) => part[0]).join('').slice(0, 2) }}
                </span>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <span class="candidate-card__badge">Assessment Completed</span>
              </section>

              <section class="metrics-card">
                <div class="metrics-card__item">
                  <small>Current Stage</small>
                  <strong>Assessment</strong>
                </div>
                <div class="metrics-card__item">
                  <small>Completed On</small>
                  <strong>Apr 24, 2025</strong>
                </div>
                <div class="metrics-card__item">
                  <small>Assessments Done</small>
                  <strong>4 / 4</strong>
                </div>
                <div class="metrics-card__item">
                  <small>AI Confidence (This Stage)</small>
                  <strong class="is-green">94%</strong>
                  <span>High</span>
                </div>
                <button type="button">View Assessment Insights</button>
              </section>

              <section class="sidebar-note">
                <AppIcon name="info" :size="14" />
                <p>AI uses assessment data only for this decision. Next stage will provide additional evidence.</p>
              </section>
            </aside>

            <div class="hiring-decision-main">
              <section class="hero-card">
                <div class="hero-card__main">
                  <span class="hero-card__icon"><AppIcon name="checkCircle" :size="24" /></span>
                  <div>
                    <em>Recommended Decision</em>
                    <h3>{{ decisionTitle }}</h3>
                    <p>{{ decisionSummary }}</p>
                    <div class="hero-card__actions">
                      <button
                        class="hero-card__action hero-card__action--primary"
                        type="button"
                        @click="runAction('move-validation')"
                      >
                        <span>Move Candidate to Validation</span>
                        <AppIcon name="chevronRight" :size="16" />
                      </button>

                      <button
                        class="hero-card__action"
                        type="button"
                        @click="runAction('request-hm-review')"
                      >
                        <AppIcon name="calendar" :size="15" />
                        <span>Schedule Validation Interview</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="hero-card__confidence">
                  <small>Confidence</small>
                  <strong>{{ decisionConfidence }}</strong>
                  <span>High Confidence</span>
                  <div class="hero-card__confidence-bars" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i class="is-filled" />
                    <i class="is-filled" />
                    <i class="is-filled" />
                    <i class="is-filled" />
                    <i class="is-filled" />
                  </div>
                </div>
              </section>

              <div class="decision-row">
                <section class="content-card">
                  <div class="content-card__title">
                    <AppIcon name="spark" :size="15" />
                    <span>Why This Decision?</span>
                  </div>

                  <div class="decision-card-layout">
                    <div class="decision-list">
                      <article v-for="item in decisionReasons" :key="item.text">
                        <span :class="`is-${item.tone}`">
                          <AppIcon :name="item.tone === 'green' ? 'checkCircle' : 'alert'" :size="14" />
                        </span>
                        <p>{{ item.text }}</p>
                      </article>
                    </div>

                    <aside class="conclusion-card">
                      <strong>AI Conclusion</strong>
                      <p>The candidate is ready for the next recommended step based on current stage evidence, score quality, and reviewer alignment.</p>
                    </aside>
                  </div>
                </section>

                <section class="content-card alternatives-card">
                  <div class="content-card__title">
                    <AppIcon name="list" :size="15" />
                    <span>Alternative Decisions</span>
                  </div>
                  <div class="alternatives-list">
                    <article v-for="item in alternativeDecisions" :key="item.title">
                      <div>
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.note }}</small>
                      </div>
                      <em :class="`is-${item.tone}`">{{ item.confidence }} confidence</em>
                    </article>
                  </div>
                </section>

                <section class="content-card preview-card">
                  <div class="content-card__title">
                    <AppIcon name="target" :size="15" />
                    <span>Next Stage Preview</span>
                  </div>
                  <p>AI predicts the next stage should focus on:</p>
                  <div class="preview-list">
                    <article v-for="item in nextStageItems" :key="item">
                      <AppIcon name="checkCircle" :size="14" />
                      <span>{{ item }}</span>
                    </article>
                  </div>
                </section>
              </div>

              <div class="bottom-row">
                <section class="content-card risk-card">
                  <div class="content-card__title">
                    <AppIcon name="alert" :size="15" />
                    <span>Decision Risks</span>
                    <em>Medium</em>
                  </div>
                  <div class="risk-card__list">
                    <p v-for="item in riskItems" :key="item">{{ item }}</p>
                  </div>
                  <small>These risks are expected to be addressed during the next stage.</small>
                </section>

                <section class="content-card change-card">
                  <div class="content-card__title">
                    <AppIcon name="sparkles" :size="15" />
                    <span>What Could Change This Recommendation?</span>
                  </div>
                  <div class="change-card__list">
                    <p v-for="item in recommendationChangeItems" :key="item">{{ item }}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <footer class="hiring-decision-modal__footer">
          <div class="footer-actions">
            <button
              v-for="action in actionCards"
              :key="action.title"
              type="button"
              :class="{ 'is-primary': action.tone === 'primary' }"
              @click="runAction(action.emit)"
            >
              <AppIcon :name="action.icon" :size="16" />
              <div>
                <span>{{ action.title }}</span>
                <small>{{ action.subtitle }}</small>
              </div>
            </button>
          </div>
          <button class="footer-download" type="button">
            <AppIcon name="document" :size="14" />
            <span>Download Decision Summary</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.hiring-decision-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.hiring-decision-modal {
  width: min(1500px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #dde6f3;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.hiring-decision-modal__header,
.hiring-decision-modal__title,
.hiring-decision-modal__title-row,
.hiring-decision-modal__header-actions,
.hero-card,
.hero-card__main,
.content-card__title,
.decision-list article,
.evidence-list article,
.preview-list article,
.footer-actions,
.footer-actions button,
.hiring-decision-modal__footer {
  display: flex;
  align-items: center;
}

.hiring-decision-modal__header,
.hiring-decision-modal__footer {
  justify-content: space-between;
}

.hiring-decision-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.hiring-decision-modal__title {
  gap: 10px;
}

.hiring-decision-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.hiring-decision-modal__title h2,
.candidate-card strong,
.hero-card__main h3 {
  margin: 0;
  color: #1f2940;
}

.hiring-decision-modal__title-row {
  gap: 8px;
}

.hiring-decision-modal__title-row em {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  padding: 0 6px;
  border-radius: 6px;
  background: #eef1ff;
  color: #5a54f3;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.hiring-decision-modal__title p,
.candidate-card p,
.hero-card__main p,
.decision-list p,
.conclusion-card p,
.alternatives-list small,
.preview-card p,
.risk-card small,
.footer-actions button small,
.sidebar-note p,
.change-card__list p {
  margin: 0;
  color: #748197;
}

.hiring-decision-modal__title h2 {
  font-size: 1rem;
}

.hiring-decision-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.hiring-decision-modal__header-actions {
  gap: 10px;
}

.hiring-decision-modal__header-actions button,
.footer-download,
.metrics-card button {
  font: inherit;
  cursor: pointer;
}

.hiring-decision-modal__header-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
}

.hiring-decision-modal__header-actions button:first-child {
  gap: 6px;
  padding: 0 12px;
}

.hiring-decision-modal__close {
  width: 34px;
  padding: 0;
}

.hiring-decision-modal__body {
  overflow: auto;
  padding: 18px;
}

.hiring-decision-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 14px;
}

.hiring-decision-side,
.hiring-decision-main {
  display: grid;
  gap: 14px;
}

.candidate-card,
.metrics-card,
.sidebar-note,
.hero-card,
.content-card {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.candidate-card {
  display: grid;
  justify-items: center;
  text-align: center;
}

.candidate-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eff1ff 0%, #d9ddff 100%);
  color: #5a54f3;
  font-weight: 800;
}

.candidate-card p {
  margin-top: 4px;
}

.candidate-card__badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 999px;
  background: #dff8ec;
  color: #0d9a62;
  font-size: 0.69rem;
  font-weight: 800;
}

.metrics-card {
  display: grid;
  gap: 14px;
}

.metrics-card__item {
  display: grid;
  gap: 4px;
}

.metrics-card__item small {
  color: #9aa5b7;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.metrics-card__item strong {
  color: #1f2940;
}

.metrics-card__item strong.is-green {
  color: #18b96a;
  font-size: 2rem;
  line-height: 1;
}

.metrics-card__item span {
  color: #18b96a;
  font-size: 0.74rem;
  font-weight: 700;
}

.metrics-card button {
  height: 38px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #5662f1;
  font-weight: 700;
}

.sidebar-note {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  gap: 10px;
  background: #f7f8ff;
}

.sidebar-note :deep(svg) {
  color: #5a54f3;
}

.hero-card {
  justify-content: space-between;
  gap: 16px;
}

.hero-card__main {
  align-items: flex-start;
  gap: 16px;
}

.hero-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1aae58 0%, #138744 100%);
  color: #fff;
  flex: 0 0 50px;
}

.hero-card__main em {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e9fbef;
  color: #158948;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.hero-card__main h3 {
  margin-top: 12px;
  font-size: 1.85rem;
}

.hero-card__main p {
  max-width: 620px;
  margin-top: 12px;
  line-height: 1.7;
}

.hero-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.hero-card__action {
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  background: #fff;
  color: #1f2940;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.hero-card__action--primary {
  min-width: 248px;
  border-color: transparent;
  background: linear-gradient(90deg, #f062ae 0%, #ea5aa5 100%);
  box-shadow: 0 14px 24px rgba(240, 98, 174, 0.2);
  color: #fff;
}

.hero-card__confidence {
  min-width: 140px;
  padding-left: 16px;
  border-left: 1px solid #edf2f8;
}

.hero-card__confidence small,
.content-card__title,
.side-card small {
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hero-card__confidence strong {
  display: block;
  margin-top: 8px;
  color: #eb65b0;
  font-size: 3rem;
  line-height: 1;
}

.hero-card__confidence span {
  display: block;
  margin-top: 6px;
  color: #4f5c76;
  font-weight: 700;
}

.hero-card__confidence-bars {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 4px;
  margin-top: 16px;
}

.hero-card__confidence-bars i {
  display: block;
  height: 10px;
  border-radius: 999px;
  background: #e3e8f1;
}

.hero-card__confidence-bars i.is-filled {
  background: linear-gradient(180deg, #91d79c 0%, #5bbb70 100%);
}

.decision-row {
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.72fr;
  gap: 14px;
}

.content-card__title {
  gap: 8px;
  color: #3745d7;
  letter-spacing: 0.06em;
}

.decision-card-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.82fr;
  gap: 16px;
  margin-top: 14px;
}

.decision-list,
.alternatives-list,
.preview-list,
.risk-card__list,
.change-card__list {
  display: grid;
  gap: 12px;
}

.decision-list article {
  align-items: flex-start;
  gap: 10px;
}

.decision-list article span {
  display: inline-flex;
  margin-top: 2px;
}

.decision-list article span.is-green {
  color: #18b96a;
}

.decision-list article span.is-orange {
  color: #f3921f;
}

.decision-list p,
.change-card__list p {
  line-height: 1.55;
}

.conclusion-card {
  padding: 16px;
  border-radius: 14px;
  background: #f5f2ff;
}

.conclusion-card strong {
  color: #5a54f3;
}

.conclusion-card p {
  margin-top: 10px;
  line-height: 1.7;
}

.alternatives-card .alternatives-list,
.preview-card .preview-list {
  margin-top: 14px;
}

.alternatives-list article {
  display: grid;
  gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f8;
}

.alternatives-list article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.alternatives-list strong,
.preview-list span {
  color: #1f2940;
}

.alternatives-list em {
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 700;
}

.alternatives-list em.is-violet {
  color: #5a54f3;
}

.alternatives-list em.is-orange {
  color: #f3921f;
}

.alternatives-list em.is-red {
  color: #ef5350;
}

.preview-card p {
  margin-top: 14px;
}

.preview-list article {
  gap: 8px;
}

.preview-list article :deep(svg) {
  color: #5a54f3;
}

.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.risk-card .content-card__title em {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #fff3e5;
  color: #f3921f;
  font-size: 0.64rem;
  font-style: normal;
  font-weight: 800;
}

.risk-card__list,
.change-card__list {
  margin-top: 14px;
}

.risk-card__list p,
.change-card__list p {
  position: relative;
  padding-left: 14px;
}

.risk-card__list p::before,
.change-card__list p::before {
  content: '';
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.risk-card__list p::before {
  background: #f3921f;
}

.change-card__list p::before {
  background: #5a54f3;
}

.hiring-decision-modal__footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding: 14px 18px;
  border-top: 1px solid #e7edf6;
  gap: 14px;
}

.footer-actions {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.footer-actions button {
  min-width: 0;
  min-height: 66px;
  padding: 10px 14px;
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  color: #1f2940;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.footer-actions button > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.footer-actions button.is-primary {
  border: 0;
  background: linear-gradient(90deg, #168c45 0%, #116f37 100%);
  color: #fff;
}

.footer-actions button span {
  display: block;
  line-height: 1.2;
  font-weight: 700;
  font-size: 0.86rem;
}

.footer-actions button small {
  display: block;
  line-height: 1.2;
  font-size: 0.74rem;
}

.footer-actions button :deep(svg) {
  flex: 0 0 16px;
}

.footer-download {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 232px;
  height: 44px;
  padding: 0 18px;
  border: 1px solid #dde6f2;
  border-radius: 12px;
  background: #fff;
  color: #445066;
  font-weight: 700;
}

@media (max-width: 1320px) {
  .hiring-decision-layout,
  .decision-row,
  .bottom-row,
  .decision-card-layout {
    grid-template-columns: 1fr;
  }

  .hiring-decision-modal__footer {
    grid-template-columns: 1fr;
  }

  .footer-download {
    justify-self: end;
  }
}

@media (max-width: 980px) {
  .hero-card,
  .hiring-decision-modal__footer {
    display: grid;
  }

  .hero-card__confidence {
    min-width: 0;
    padding-left: 0;
    border-left: 0;
    border-top: 1px solid #edf2f8;
    padding-top: 16px;
  }

  .hero-card__action {
    width: 100%;
  }

  .footer-actions {
    grid-template-columns: 1fr 1fr;
  }

  .footer-download {
    width: 100%;
    justify-self: stretch;
  }
}

@media (max-width: 720px) {
  .hiring-decision-overlay {
    padding: 10px;
  }

  .hiring-decision-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .hiring-decision-modal__header,
  .hiring-decision-modal__body,
  .hiring-decision-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .hiring-decision-modal__header,
  .hiring-decision-modal__footer {
    display: grid;
    gap: 12px;
  }

  .hiring-decision-modal__header-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .hero-card__actions,
  .footer-actions {
    grid-template-columns: 1fr;
  }

  .footer-actions button {
    min-height: 60px;
  }
}
</style>
