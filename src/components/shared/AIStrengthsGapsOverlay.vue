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

const strengthRows = [
  {
    title: 'Analytical Thinking',
    description: 'Breaks down complex information, identifies patterns, and draws sound conclusions.',
    evidence: ['Logical Reasoning', 'Numerical Reasoning', 'Coding Challenge'],
    sourceCount: '3 assessments',
    strengthLabel: 'Very Strong',
    strengthFilled: 4,
    confidence: 'High',
    confidenceTone: 'green',
    icon: 'spark',
  },
  {
    title: 'Problem Solving',
    description: 'Solves complex problems accurately with efficient and structured approach.',
    evidence: ['Coding Challenge', 'Logical Reasoning'],
    sourceCount: '2 assessments',
    strengthLabel: 'Very Strong',
    strengthFilled: 4,
    confidence: 'High',
    confidenceTone: 'green',
    icon: 'document',
  },
  {
    title: 'Numerical Ability',
    description: 'High accuracy with strong quantitative and methodical approach.',
    evidence: ['Numerical Reasoning'],
    sourceCount: '1 assessment',
    strengthLabel: 'Strong',
    strengthFilled: 3,
    confidence: 'Medium',
    confidenceTone: 'orange',
    icon: 'hash',
  },
  {
    title: 'Learning Agility',
    description: 'Performance improves as question complexity increases.',
    evidence: ['All Assessments'],
    sourceCount: '4 assessments',
    strengthLabel: 'Strong',
    strengthFilled: 3,
    confidence: 'Medium',
    confidenceTone: 'orange',
    icon: 'trend-up',
  },
]

const gapRows = [
  {
    title: 'Communication',
    why: 'Only partial evidence from written assessment.',
    recommendation: 'Behavioral Interview',
    followup: 'Ask communication-focused questions',
    priority: 'High',
    tone: 'red',
  },
  {
    title: 'Collaboration',
    why: 'No direct evidence available in assessments.',
    recommendation: 'Behavioral Interview',
    followup: 'Ask about teamwork and collaboration',
    priority: 'High',
    tone: 'red',
  },
  {
    title: 'Leadership',
    why: 'Not assessed in any completed evaluations.',
    recommendation: 'Leadership Interview',
    followup: 'Assess leadership behaviors and examples',
    priority: 'Medium',
    tone: 'amber',
  },
  {
    title: 'Stakeholder Management',
    why: 'No evidence available in assessments.',
    recommendation: 'Behavioral Interview',
    followup: 'Explore stakeholder management scenarios',
    priority: 'Medium',
    tone: 'amber',
  },
]

const decisionImpactItems = [
  {
    title: 'The available evidence strongly validates the candidate’s technical and analytical competencies.',
    tone: 'green',
  },
  {
    title: 'Interpersonal and leadership competencies remain unvalidated.',
    tone: 'orange',
  },
  {
    title: 'Focus the remaining evaluation on communication, collaboration, and stakeholder management.',
    tone: 'violet',
  },
]

const focusTags = ['Communication', 'Collaboration', 'Leadership']

const evidenceCoverage = [
  { label: 'Analytical Thinking', done: 3, total: 3, tone: 'green' },
  { label: 'Problem Solving', done: 2, total: 2, tone: 'green' },
  { label: 'Numerical Ability', done: 1, total: 1, tone: 'green' },
  { label: 'Learning Agility', done: 4, total: 4, tone: 'green' },
  { label: 'Communication', done: 1, total: 4, tone: 'orange' },
  { label: 'Collaboration', done: 0, total: 4, tone: 'slate' },
  { label: 'Leadership', done: 0, total: 3, tone: 'slate' },
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
    <div v-if="open" class="strengths-gaps-overlay" @click.self="closeOverlay">
      <section class="strengths-gaps-modal">
        <header class="strengths-gaps-modal__header">
          <div class="strengths-gaps-modal__title">
            <span class="strengths-gaps-modal__title-icon">
              <AppIcon name="compare" :size="18" />
            </span>
            <div>
              <h2>AI Strengths &amp; Gaps</h2>
              <p>Evidence-based view of demonstrated competencies and areas needing more validation.</p>
            </div>
          </div>

          <div class="strengths-gaps-modal__header-actions">
            <button type="button">
              <AppIcon name="share" :size="14" />
              <span>Share</span>
            </button>
            <button class="strengths-gaps-modal__close" type="button" aria-label="Close AI Strengths and Gaps" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="strengths-gaps-modal__body">
          <div class="strengths-gaps-layout">
            <div class="strengths-gaps-main">
              <section class="candidate-strip">
                <div class="candidate-strip__identity">
                  <span class="candidate-strip__avatar">{{ candidateInitials }}</span>
                  <div>
                    <h3>{{ candidateName }}</h3>
                    <p>{{ candidateRole }}</p>
                    <span class="candidate-strip__badge">Assessment Completed</span>
                  </div>
                </div>

                <div class="candidate-strip__stats">
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
                    <strong>Strong</strong>
                    <em>High quality, consistent evidence</em>
                  </article>
                </div>
              </section>

              <section class="content-section">
                <div class="content-section__title is-green">
                  <AppIcon name="checkCircle" :size="14" />
                  <span>Proven Strengths</span>
                </div>
                <p class="content-section__copy">Competencies with strong evidence from assessments.</p>

                <div class="strengths-table">
                  <div class="strengths-table__head">
                    <span>Competency</span>
                    <span>Evidence &amp; Sources</span>
                    <span>Evidence Strength</span>
                    <span>Confidence</span>
                  </div>

                  <article v-for="row in strengthRows" :key="row.title" class="strengths-table__row">
                    <div class="strengths-table__competency">
                      <span class="strengths-table__competency-icon">
                        <AppIcon :name="row.icon" :size="16" />
                      </span>
                      <div>
                        <strong>{{ row.title }}</strong>
                        <p>{{ row.description }}</p>
                      </div>
                    </div>

                    <div class="strengths-table__evidence">
                      <div class="tag-list">
                        <span v-for="tag in row.evidence" :key="tag">{{ tag }}</span>
                      </div>
                      <small>{{ row.sourceCount }}</small>
                    </div>

                    <div class="strengths-table__strength">
                      <div class="mini-bars">
                        <i
                          v-for="bar in 4"
                          :key="`${row.title}-${bar}`"
                          :class="{ 'is-filled': bar <= row.strengthFilled }"
                        />
                      </div>
                      <small>{{ row.strengthLabel }}</small>
                    </div>

                    <div class="strengths-table__confidence">
                      <strong :class="`is-${row.confidenceTone}`">{{ row.confidence }}</strong>
                    </div>
                  </article>
                </div>
              </section>

              <section class="content-section">
                <div class="content-section__title is-orange">
                  <AppIcon name="alert" :size="14" />
                  <span>Evidence Gaps (Needs Validation)</span>
                </div>
                <p class="content-section__copy">Competencies that require more evidence to make a confident decision.</p>

                <div class="gaps-table">
                  <div class="gaps-table__head">
                    <span>Competency</span>
                    <span>Why Evidence Is Limited / Missing</span>
                    <span>Recommended Validation</span>
                    <span>Priority</span>
                  </div>

                  <article v-for="row in gapRows" :key="row.title" class="gaps-table__row">
                    <strong class="gaps-table__competency">{{ row.title }}</strong>
                    <p class="gaps-table__why">{{ row.why }}</p>
                    <div class="gaps-table__recommendation">
                      <strong>{{ row.recommendation }}</strong>
                      <small>{{ row.followup }}</small>
                    </div>
                    <span class="priority-pill" :class="`is-${row.tone}`">{{ row.priority }}</span>
                  </article>
                </div>
              </section>
            </div>

            <aside class="strengths-gaps-side">
              <section class="side-card">
                <div class="side-card__title">
                  <AppIcon name="spark" :size="14" />
                  <span>Decision Impact</span>
                </div>

                <div class="decision-impact-list">
                  <article v-for="item in decisionImpactItems" :key="item.title">
                    <span :class="`is-${item.tone}`"></span>
                    <p>{{ item.title }}</p>
                  </article>
                </div>
              </section>

              <section class="side-card">
                <div class="side-card__title">
                  <AppIcon name="spark" :size="14" />
                  <span>AI Recommendation</span>
                </div>

                <div class="recommendation-card">
                  <small>Recommended Next</small>
                  <div class="recommendation-card__top">
                    <div>
                      <strong>Behavioral Interview</strong>
                      <span>Highest Impact</span>
                    </div>
                  </div>

                  <div class="recommendation-card__block">
                    <h4>Why?</h4>
                    <p>Technical and analytical skills are sufficiently validated across multiple assessments. A behavioral interview will provide the missing evidence needed for decision confidence.</p>
                  </div>

                  <div class="recommendation-card__block">
                    <h4>Interview Focus</h4>
                    <div class="tag-list">
                      <span v-for="tag in focusTags" :key="tag">{{ tag }}</span>
                    </div>
                  </div>

                  <div class="recommendation-card__gain">
                    <span>Estimated Evidence Gain</span>
                    <strong>★★★★★</strong>
                  </div>
                </div>

                <div class="recommendation-card__actions">
                  <button class="recommendation-card__primary-button" type="button">Schedule Interview</button>
                  <button class="recommendation-card__link-button" type="button">View reasoning</button>
                </div>
              </section>

              <section class="side-card">
                <div class="side-card__title">
                  <AppIcon name="target" :size="14" />
                  <span>Evidence Coverage</span>
                </div>

                <div class="coverage-list">
                  <article v-for="item in evidenceCoverage" :key="item.label">
                    <div class="coverage-list__label">
                      <span :class="`is-${item.tone}`"></span>
                      <small>{{ item.label }}</small>
                    </div>
                    <div class="coverage-list__bar">
                      <i :style="{ width: `${(item.done / item.total) * 100}%` }" :class="`is-${item.tone}`" />
                    </div>
                    <strong>{{ item.done }} / {{ item.total }}</strong>
                  </article>
                </div>

                <div class="coverage-summary">
                  <span>Overall Coverage</span>
                  <strong>7 / 11 competencies validated</strong>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="strengths-gaps-modal__footer">
          <p>
            <AppIcon name="info" :size="13" />
            <span>AI insights are generated from assessment data and recruiter feedback.</span>
          </p>

          <div class="strengths-gaps-modal__footer-actions">
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
.strengths-gaps-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.strengths-gaps-modal {
  width: min(1440px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #dde6f3;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.strengths-gaps-modal__header,
.strengths-gaps-modal__title,
.strengths-gaps-modal__header-actions,
.candidate-strip__identity,
.candidate-strip__stats,
.content-section__title,
.strengths-table__competency,
.decision-impact-list article,
.side-card__title,
.recommendation-card__gain,
.recommendation-card__actions,
.coverage-list__label,
.strengths-gaps-modal__footer,
.strengths-gaps-modal__footer p,
.strengths-gaps-modal__footer-actions,
.strengths-gaps-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.strengths-gaps-modal__header,
.strengths-gaps-modal__footer {
  justify-content: space-between;
}

.strengths-gaps-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.strengths-gaps-modal__title {
  gap: 10px;
}

.strengths-gaps-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.strengths-gaps-modal__title h2,
.candidate-strip__identity h3 {
  margin: 0;
  color: #1f2940;
}

.strengths-gaps-modal__title p,
.candidate-strip__identity p,
.content-section__copy,
.strengths-table__competency p,
.gaps-table__why,
.recommendation-card__block p,
.strengths-gaps-modal__footer p {
  margin: 0;
  color: #7a879a;
}

.strengths-gaps-modal__title h2 {
  font-size: 1rem;
}

.strengths-gaps-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.strengths-gaps-modal__header-actions {
  gap: 10px;
}

.strengths-gaps-modal__header-actions button,
.strengths-gaps-modal__footer-actions button {
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
  font: inherit;
  cursor: pointer;
}

.strengths-gaps-modal__header-actions button {
  gap: 6px;
  padding: 0 12px;
}

.strengths-gaps-modal__close {
  width: 34px;
  padding: 0;
  justify-content: center;
}

.strengths-gaps-modal__body {
  overflow: auto;
}

.strengths-gaps-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
}

.strengths-gaps-main {
  padding: 22px;
}

.strengths-gaps-side {
  padding: 22px;
  border-left: 1px solid #e7edf6;
}

.candidate-strip {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr);
  gap: 20px;
}

.candidate-strip__identity {
  gap: 14px;
}

.candidate-strip__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #eef2f8;
  background:
    radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.15) 38%),
    linear-gradient(135deg, #e5e7eb 0%, #cfd7e3 100%);
  color: #5c6981;
  font-weight: 800;
}

.candidate-strip__identity p {
  margin-top: 4px;
}

.candidate-strip__badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  margin-top: 8px;
  padding: 0 10px;
  border-radius: 999px;
  background: #dff8ec;
  color: #0d9a62;
  font-size: 0.7rem;
  font-weight: 800;
}

.candidate-strip__stats {
  justify-content: space-between;
}

.candidate-strip__stats article {
  min-width: 0;
  padding: 0 12px;
  border-left: 1px solid #e9eef7;
}

.candidate-strip__stats article:first-child {
  padding-left: 0;
  border-left: 0;
}

.candidate-strip__stats small,
.strengths-table__head,
.gaps-table__head,
.recommendation-card small {
  display: block;
  color: #98a3b6;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.candidate-strip__stats strong {
  display: block;
  margin-top: 6px;
  color: #1f2940;
}

.candidate-strip__stats em {
  display: block;
  margin-top: 3px;
  color: #0ea76e;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 700;
}

.candidate-strip__stats .is-confidence strong {
  color: #0ea76e;
  font-size: 1.8rem;
  line-height: 1;
}

.candidate-strip__stats .is-evidence em {
  max-width: 96px;
  line-height: 1.35;
  color: #7a879a;
  font-weight: 600;
}

.content-section {
  margin-top: 30px;
}

.content-section__title {
  gap: 8px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.content-section__title.is-green {
  color: #13a768;
}

.content-section__title.is-orange {
  color: #f38521;
}

.content-section__copy {
  margin-top: 10px;
  font-size: 0.86rem;
}

.strengths-table,
.gaps-table {
  margin-top: 16px;
}

.strengths-table__head,
.strengths-table__row {
  display: grid;
  grid-template-columns: 1.4fr 1.1fr 0.75fr 0.45fr;
  gap: 18px;
}

.gaps-table__head,
.gaps-table__row {
  display: grid;
  grid-template-columns: 0.8fr 1.45fr 1fr 0.4fr;
  gap: 18px;
}

.strengths-table__head,
.gaps-table__head {
  padding: 0 0 10px;
}

.strengths-table__row,
.gaps-table__row {
  align-items: start;
  padding: 18px 0;
  border-top: 1px solid #eef2f8;
}

.strengths-table__competency {
  align-items: flex-start;
  gap: 12px;
}

.strengths-table__competency-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: #effaf3;
  color: #13a768;
  flex: 0 0 30px;
}

.strengths-table__competency strong,
.gaps-table__competency,
.gaps-table__recommendation strong,
.recommendation-card__top strong,
.coverage-summary strong {
  color: #1f2940;
}

.strengths-table__competency p {
  margin-top: 6px;
  font-size: 0.82rem;
  line-height: 1.45;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-list span {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #f0f3ff;
  color: #6670f0;
  font-size: 0.68rem;
  font-weight: 700;
}

.strengths-table__evidence small,
.strengths-table__strength small,
.gaps-table__recommendation small {
  display: block;
  margin-top: 8px;
  color: #9aa4b7;
  font-size: 0.73rem;
}

.mini-bars {
  display: flex;
  gap: 4px;
}

.mini-bars i {
  width: 10px;
  height: 4px;
  border-radius: 999px;
  background: #dbe3ee;
}

.mini-bars i.is-filled {
  background: #20c170;
}

.strengths-table__strength small {
  color: #7c8799;
}

.strengths-table__confidence strong.is-green {
  color: #13a768;
}

.strengths-table__confidence strong.is-orange {
  color: #f38521;
}

.gaps-table__why,
.gaps-table__recommendation small,
.recommendation-card__block p {
  font-size: 0.82rem;
  line-height: 1.5;
}

.priority-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
}

.priority-pill.is-red {
  background: #ffe9e9;
  color: #ef5350;
}

.priority-pill.is-amber {
  background: #fff2e0;
  color: #f59d2a;
}

.side-card + .side-card {
  margin-top: 24px;
}

.side-card__title {
  gap: 8px;
  color: #3745d7;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.decision-impact-list,
.coverage-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.decision-impact-list article {
  align-items: flex-start;
  gap: 10px;
}

.decision-impact-list article span {
  display: inline-flex;
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 50%;
  flex: 0 0 10px;
}

.decision-impact-list article span.is-green {
  background: #17b26b;
}

.decision-impact-list article span.is-orange {
  background: #f38521;
}

.decision-impact-list article span.is-violet {
  background: #6a67f7;
}

.decision-impact-list article p {
  margin: 0;
  color: #5d6980;
  font-size: 0.82rem;
  line-height: 1.5;
}

.recommendation-card {
  margin-top: 14px;
  padding: 14px;
  border: 1px solid #e8edf7;
  border-radius: 14px;
  background: #fbfcff;
}

.recommendation-card__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.recommendation-card__top span {
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  margin-top: 4px;
  padding: 0 8px;
  border-radius: 6px;
  background: #eef1ff;
  color: #5360f1;
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
}

.recommendation-card__block {
  margin-top: 14px;
}

.recommendation-card__block h4 {
  margin: 0 0 8px;
  color: #1f2940;
  font-size: 0.76rem;
}

.recommendation-card__gain {
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  color: #7f8aa1;
  font-size: 0.74rem;
}

.recommendation-card__gain strong {
  color: #5c57ef;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
}

.recommendation-card__actions {
  gap: 10px;
  margin-top: 14px;
}

.recommendation-card__primary-button,
.recommendation-card__link-button {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.recommendation-card__primary-button {
  flex: 1 1 auto;
  border: 0;
  background: linear-gradient(90deg, #5d58f0 0%, #4b46d6 100%);
  color: #fff;
}

.recommendation-card__link-button {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: #5662f1;
}

.coverage-list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 76px 32px;
  align-items: center;
  gap: 10px;
}

.coverage-list__label {
  gap: 8px;
  min-width: 0;
}

.coverage-list__label span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: 0 0 8px;
}

.coverage-list__label span.is-green {
  background: #18b96a;
}

.coverage-list__label span.is-orange {
  background: #f38521;
}

.coverage-list__label span.is-slate {
  background: #d7dee9;
}

.coverage-list__label small {
  color: #5d6980;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coverage-list__bar {
  height: 4px;
  border-radius: 999px;
  background: #e5ebf4;
  overflow: hidden;
}

.coverage-list__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.coverage-list__bar i.is-green {
  background: #18b96a;
}

.coverage-list__bar i.is-orange {
  background: #f38521;
}

.coverage-list__bar i.is-slate {
  background: #d7dee9;
}

.coverage-list article strong {
  color: #7e899f;
  font-size: 0.72rem;
  text-align: right;
}

.coverage-summary {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #edf2f8;
  color: #7e899f;
  font-size: 0.74rem;
}

.coverage-summary strong {
  color: #5d58f0;
}

.strengths-gaps-modal__footer {
  padding: 14px 22px;
  border-top: 1px solid #e7edf6;
}

.strengths-gaps-modal__footer p {
  gap: 8px;
  font-size: 0.8rem;
}

.strengths-gaps-modal__footer p :deep(svg) {
  color: #94a0b4;
}

.strengths-gaps-modal__footer-actions {
  display: flex;
  gap: 10px;
}

.strengths-gaps-modal__footer-actions button {
  gap: 8px;
  padding: 0 16px;
}

.strengths-gaps-modal__footer-actions button.is-primary {
  min-width: 92px;
  border: 0;
  background: linear-gradient(90deg, #f362ab 0%, #ea5ba9 100%);
  color: #fff;
}

@media (max-width: 1240px) {
  .strengths-gaps-layout {
    grid-template-columns: 1fr;
  }

  .strengths-gaps-side {
    border-top: 1px solid #e7edf6;
    border-left: 0;
  }
}

@media (max-width: 1040px) {
  .candidate-strip {
    grid-template-columns: 1fr;
  }

  .candidate-strip__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .candidate-strip__stats article {
    padding: 0;
    border-left: 0;
  }

  .strengths-table,
  .gaps-table {
    overflow-x: auto;
  }

  .strengths-table__head,
  .strengths-table__row {
    min-width: 860px;
  }

  .gaps-table__head,
  .gaps-table__row {
    min-width: 860px;
  }
}

@media (max-width: 720px) {
  .strengths-gaps-overlay {
    padding: 10px;
  }

  .strengths-gaps-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .strengths-gaps-modal__header,
  .strengths-gaps-main,
  .strengths-gaps-side,
  .strengths-gaps-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .strengths-gaps-modal__header,
  .strengths-gaps-modal__footer {
    display: grid;
    gap: 12px;
  }

  .strengths-gaps-modal__header-actions,
  .strengths-gaps-modal__footer-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .candidate-strip__stats {
    grid-template-columns: 1fr;
  }
}
</style>
