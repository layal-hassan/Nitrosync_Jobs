<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')

const evidenceItems = [
  {
    title: 'Assessment Insights',
    copy: 'Strong analytical reasoning and problem solving demonstrated.',
    status: 'Strong',
    tone: 'green',
    icon: 'document',
  },
  {
    title: 'Strengths & Gaps',
    copy: 'Technical competency validated. Leadership evidence still missing.',
    status: 'Medium',
    tone: 'orange',
    icon: 'alert',
  },
  {
    title: 'Feedback Quality',
    copy: 'High quality feedback from scorecards.',
    status: 'High',
    tone: 'green',
    icon: 'message',
  },
  {
    title: 'Score Calibration',
    copy: 'Reviewers are highly aligned.',
    status: '92%',
    tone: 'green',
    icon: 'target',
  },
  {
    title: 'Bias Detection',
    copy: 'No significant fairness concerns detected.',
    status: 'Clear',
    tone: 'green',
    icon: 'shield',
  },
]

const decisionReasons = [
  { text: 'Assessment results exceeded the progression threshold.', tone: 'green' },
  { text: 'No additional assessments are expected to produce meaningful new evidence.', tone: 'green' },
  { text: 'Reviewer feedback strongly supports technical competency.', tone: 'green' },
  { text: 'Reviewers are highly aligned with minimal score variance.', tone: 'green' },
  { text: 'No material bias or fairness concerns detected in the evaluations.', tone: 'green' },
  { text: 'Leadership has not yet been evaluated.', tone: 'orange' },
  { text: 'Collaboration and communication evidence is limited.', tone: 'orange' },
]

const focusAreas = ['Leadership', 'Communication', 'Collaboration']

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
    <div v-if="open" class="stage-recommendation-overlay" @click.self="closeOverlay">
      <section class="stage-recommendation-modal">
        <header class="stage-recommendation-modal__header">
          <div class="stage-recommendation-modal__title">
            <span class="stage-recommendation-modal__title-icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <h2>AI Stage Recommendation</h2>
              <p>Assessment Stage -> Recommend next action</p>
            </div>
          </div>

          <div class="stage-recommendation-modal__header-actions">
            <button type="button">
              <AppIcon name="info" :size="14" />
              <span>How did AI decide?</span>
            </button>
            <button class="stage-recommendation-modal__close" type="button" aria-label="Close AI Stage Recommendation" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="stage-recommendation-modal__body">
          <div class="stage-recommendation-layout">
            <div class="stage-recommendation-main">
              <section class="hero-card">
                <div class="hero-card__content">
                  <span class="hero-card__icon"><AppIcon name="checkCircle" :size="26" /></span>
                  <div class="hero-card__copy">
                    <em>Recommended Action</em>
                    <h3>Move Candidate to Validation</h3>
                    <p>The candidate has successfully met the Assessment stage objectives. AI analysis shows they are ready for Validation to evaluate interpersonal and leadership competencies.</p>
                  </div>
                </div>

                <div class="hero-card__confidence">
                  <small>Confidence</small>
                  <strong>94%</strong>
                  <span>High Confidence</span>
                  <div class="hero-card__bars">
                    <i></i><i></i><i></i><i></i><i></i>
                  </div>
                </div>
              </section>

              <section class="content-card">
                <div class="content-card__title">
                  <AppIcon name="spark" :size="15" />
                  <span>Why AI Reached This Decision</span>
                </div>

                <div class="decision-grid">
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
                    <p>The candidate has the required technical competency and is ready for Validation. The next stage will help evaluate leadership, communication, and collaboration.</p>
                  </aside>
                </div>
              </section>

              <section class="content-card why-not-card">
                <div class="content-card__title">
                  <AppIcon name="info" :size="15" />
                  <span>Why Not Another Assessment?</span>
                </div>

                <div class="why-not-card__row">
                  <p>AI predicts that another assessment is unlikely to add meaningful new evidence. It would increase time and candidate drop-off risk without improving decision confidence.</p>
                  <div class="gain-card">
                    <small>Confidence Gain</small>
                    <strong>+2%</strong>
                  </div>
                </div>
              </section>
            </div>

            <aside class="stage-recommendation-side">
              <section class="side-card">
                <h4>Evidence Considered By AI</h4>
                <div class="evidence-list">
                  <article v-for="item in evidenceItems" :key="item.title">
                    <span class="evidence-list__icon" :class="`is-${item.tone}`">
                      <AppIcon :name="item.icon" :size="15" />
                    </span>
                    <div>
                      <strong>{{ item.title }}</strong>
                      <p>{{ item.copy }}</p>
                    </div>
                    <em :class="`is-${item.tone}`">{{ item.status }}</em>
                  </article>
                </div>

                <div class="side-card__summary">
                  <span>Overall AI Confidence</span>
                  <strong>94%</strong>
                </div>
              </section>

              <section class="side-card">
                <h4>Validation Plan (Next Stage)</h4>
                <div class="plan-block">
                  <small>Focus Areas</small>
                  <div class="focus-list">
                    <article v-for="item in focusAreas" :key="item">
                      <AppIcon name="user" :size="14" />
                      <span>{{ item }}</span>
                    </article>
                  </div>
                </div>

                <div class="plan-block">
                  <small>Recommended Evaluation</small>
                  <div class="evaluation-pill">
                    <AppIcon name="document" :size="15" />
                    <span>Behavioral Interview</span>
                  </div>
                </div>

                <div class="plan-metrics">
                  <article>
                    <small>Estimated Duration</small>
                    <strong>45 min</strong>
                  </article>
                  <article>
                    <small>Expected Evidence Gain</small>
                    <strong>High</strong>
                    <div class="plan-metrics__bars"><i></i><i></i><i></i><i></i></div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="stage-recommendation-modal__footer">
          <div class="stage-recommendation-actions">
            <button class="is-primary" type="button">
              <AppIcon name="checkCircle" :size="16" />
              <span>Move to Validation</span>
              <small>Proceed to next stage</small>
            </button>
            <button type="button">
              <AppIcon name="userPlus" :size="16" />
              <span>Assign Assessment</span>
              <small>Add another assessment</small>
            </button>
            <button type="button">
              <AppIcon name="pause" :size="16" />
              <span>Hold Candidate</span>
              <small>Pause progression</small>
            </button>
            <button type="button">
              <AppIcon name="close" :size="16" />
              <span>Reject Candidate</span>
              <small>End process</small>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.stage-recommendation-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.stage-recommendation-modal {
  width: min(1480px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #dde6f3;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.stage-recommendation-modal__header,
.stage-recommendation-modal__title,
.stage-recommendation-modal__header-actions,
.hero-card,
.hero-card__content,
.content-card__title,
.decision-list article,
.evidence-list article,
.focus-list article,
.evaluation-pill,
.stage-recommendation-actions,
.stage-recommendation-actions button,
.stage-recommendation-modal__footer {
  display: flex;
  align-items: center;
}

.stage-recommendation-modal__header,
.stage-recommendation-modal__footer {
  justify-content: space-between;
}

.stage-recommendation-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.stage-recommendation-modal__title {
  gap: 10px;
}

.stage-recommendation-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.stage-recommendation-modal__title h2,
.hero-card__copy h3,
.conclusion-card strong,
.side-card h4 {
  margin: 0;
  color: #1f2940;
}

.stage-recommendation-modal__title p,
.hero-card__copy p,
.decision-list p,
.conclusion-card p,
.why-not-card__row p,
.evidence-list p,
.stage-recommendation-actions button small {
  margin: 0;
  color: #748197;
}

.stage-recommendation-modal__title h2 {
  font-size: 1rem;
}

.stage-recommendation-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.stage-recommendation-modal__header-actions {
  gap: 10px;
}

.stage-recommendation-modal__header-actions button {
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
  font: inherit;
  cursor: pointer;
}

.stage-recommendation-modal__header-actions button:first-child {
  gap: 6px;
  padding: 0 12px;
}

.stage-recommendation-modal__close {
  width: 34px;
  padding: 0;
}

.stage-recommendation-modal__body {
  overflow: auto;
  padding: 22px;
}

.stage-recommendation-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 18px;
}

.stage-recommendation-main,
.stage-recommendation-side {
  display: grid;
  gap: 18px;
}

.hero-card,
.content-card,
.side-card {
  padding: 18px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.hero-card {
  justify-content: space-between;
  gap: 16px;
}

.hero-card__content {
  align-items: flex-start;
  gap: 16px;
}

.hero-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1aae58 0%, #138744 100%);
  color: #fff;
  flex: 0 0 48px;
}

.hero-card__copy em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 12px;
  border-radius: 999px;
  background: #e9fbef;
  color: #158948;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 800;
  text-transform: uppercase;
}

.hero-card__copy h3 {
  margin-top: 14px;
  font-size: 2rem;
  line-height: 1.15;
}

.hero-card__copy p {
  max-width: 560px;
  margin-top: 14px;
  line-height: 1.7;
}

.hero-card__confidence {
  min-width: 160px;
  padding-left: 18px;
  border-left: 1px solid #edf2f8;
}

.hero-card__confidence small,
.side-card small,
.plan-metrics small {
  display: block;
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-card__confidence strong,
.side-card__summary strong {
  display: block;
  margin-top: 10px;
  color: #15904a;
  font-size: 3rem;
  line-height: 1;
}

.hero-card__confidence span {
  display: block;
  margin-top: 8px;
  color: #4f5c76;
  font-weight: 700;
}

.hero-card__bars,
.plan-metrics__bars {
  display: flex;
  gap: 4px;
  margin-top: 12px;
}

.hero-card__bars i,
.plan-metrics__bars i {
  width: 12px;
  height: 10px;
  border-radius: 3px;
  background: #dce3ed;
}

.hero-card__bars i:nth-child(1),
.hero-card__bars i:nth-child(2),
.plan-metrics__bars i:nth-child(1),
.plan-metrics__bars i:nth-child(2) {
  background: #d8f2df;
}

.hero-card__bars i:nth-child(3),
.hero-card__bars i:nth-child(4),
.hero-card__bars i:nth-child(5),
.plan-metrics__bars i:nth-child(3),
.plan-metrics__bars i:nth-child(4) {
  background: #4fb56a;
}

.content-card__title {
  gap: 8px;
  color: #3745d7;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.decision-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.75fr;
  gap: 18px;
  margin-top: 16px;
}

.decision-list {
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

.decision-list p {
  line-height: 1.55;
}

.conclusion-card {
  padding: 18px;
  border-radius: 14px;
  background: #f5f2ff;
}

.conclusion-card strong {
  color: #5a54f3;
}

.conclusion-card p {
  margin-top: 12px;
  line-height: 1.75;
}

.why-not-card__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 16px;
  margin-top: 16px;
  align-items: center;
}

.why-not-card__row p {
  line-height: 1.7;
}

.gain-card {
  padding: 14px;
  border-radius: 12px;
  background: #f5f2ff;
  text-align: center;
}

.gain-card small {
  color: #5a54f3;
}

.gain-card strong {
  display: block;
  margin-top: 8px;
  color: #5a54f3;
  font-size: 2rem;
}

.side-card h4 {
  font-size: 0.86rem;
  text-transform: uppercase;
}

.evidence-list,
.focus-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.evidence-list article {
  align-items: flex-start;
  gap: 10px;
}

.evidence-list__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex: 0 0 28px;
}

.evidence-list__icon.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.evidence-list__icon.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.evidence-list strong {
  display: block;
  color: #1f2940;
  font-size: 0.8rem;
}

.evidence-list p {
  margin-top: 4px;
  font-size: 0.76rem;
  line-height: 1.45;
}

.evidence-list em {
  margin-left: auto;
  font-style: normal;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
}

.evidence-list em.is-green {
  color: #18b96a;
}

.evidence-list em.is-orange {
  color: #f3921f;
}

.side-card__summary {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf2f8;
}

.side-card__summary span {
  color: #748197;
}

.plan-block + .plan-block,
.plan-metrics {
  margin-top: 18px;
}

.focus-list article {
  gap: 8px;
  color: #1f2940;
}

.focus-list article :deep(svg) {
  color: #5a54f3;
}

.evaluation-pill {
  gap: 8px;
  min-height: 42px;
  margin-top: 10px;
  padding: 0 12px;
  border-radius: 10px;
  background: #f4f2ff;
  color: #1f2940;
  font-weight: 700;
}

.evaluation-pill :deep(svg) {
  color: #5a54f3;
}

.plan-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.plan-metrics strong {
  display: block;
  margin-top: 8px;
  color: #1f2940;
}

.stage-recommendation-modal__footer {
  padding: 14px 22px;
  border-top: 1px solid #e7edf6;
}

.stage-recommendation-actions {
  width: 100%;
  gap: 12px;
}

.stage-recommendation-actions button {
  flex: 1;
  min-height: 62px;
  padding: 0 16px;
  border: 1px solid #e2e8f3;
  border-radius: 12px;
  background: #fff;
  color: #1f2940;
  cursor: pointer;
  gap: 10px;
}

.stage-recommendation-actions button.is-primary {
  border: 0;
  background: linear-gradient(90deg, #168c45 0%, #116f37 100%);
  color: #fff;
}

.stage-recommendation-actions button :deep(svg) {
  flex: 0 0 auto;
}

.stage-recommendation-actions button span {
  display: block;
  font-weight: 700;
}

@media (max-width: 1280px) {
  .stage-recommendation-layout,
  .decision-grid,
  .plan-metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .hero-card,
  .why-not-card__row,
  .stage-recommendation-actions {
    display: grid;
  }
}

@media (max-width: 720px) {
  .stage-recommendation-overlay {
    padding: 10px;
  }

  .stage-recommendation-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .stage-recommendation-modal__header,
  .stage-recommendation-modal__body,
  .stage-recommendation-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .stage-recommendation-modal__header,
  .stage-recommendation-modal__footer {
    display: grid;
    gap: 12px;
  }

  .stage-recommendation-modal__header-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
