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
    default: 'Michael Chen',
  },
  candidateRole: {
    type: String,
    default: 'Senior Software Engineer',
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

const evidenceCards = [
  { title: 'Assessments', value: '4 / 4', note: 'Completed', tone: 'green', icon: 'document' },
  { title: 'Interviews', value: '3', note: 'Completed', tone: 'green', icon: 'users' },
  { title: 'Interview Scorecards', value: '8 / 9', note: 'Submitted', tone: 'orange', icon: 'clipboard-check' },
  { title: 'Feedback Notes', value: '5', note: 'Submitted', tone: 'green', icon: 'message' },
  { title: 'Work Samples', value: '1', note: 'Reviewed', tone: 'green', icon: 'document' },
]

const trustedFeedbackRows = [
  { name: 'Alex Rivera', role: 'Engineering Manager', level: 'High', tone: 'green', note: 'Specific behavioral examples and strong competency evidence.' },
  { name: 'Priya Shah', role: 'Senior Engineer', level: 'High', tone: 'green', note: 'Balanced feedback with clear strengths and areas to grow.' },
  { name: 'Emma Johnson', role: 'Tech Lead', level: 'High', tone: 'green', note: 'Detailed observations from live collaboration exercises.' },
  { name: 'Daniel Kim', role: 'Staff Engineer', level: 'Medium', tone: 'orange', note: 'Several ratings lack supporting examples and context.' },
]

const missingFeedbackRows = [
  { title: 'Leadership', note: 'One reviewer rated low but did not provide specific supporting examples.', tone: 'red', tag: 'No Examples' },
  { title: 'Collaboration', note: 'Mentioned by reviewers but not backed by specific examples.', tone: 'orange', tag: 'Not Explained' },
  { title: 'Stakeholder Management', note: 'This competency was not discussed by any interviewer.', tone: 'amber', tag: 'Not Discussed' },
]

const analysisRows = [
  { tone: 'green', text: 'Three reviewers consistently highlighted strong analytical thinking and problem-solving ability.' },
  { tone: 'orange', text: 'Communication is rated positively, but two reviewers did not provide examples.' },
  { tone: 'red', text: 'Leadership ratings vary significantly due to lack of supporting examples from Daniel.' },
  { tone: 'blue', text: 'Overall tone is professional and constructive.' },
]

const competencyCards = [
  { title: 'Analytical Thinking', state: 'Strong', tone: 'green', icon: 'spark', copy: 'Consistent feedback with clear examples.', reviewers: '4 of 4 reviewers', dots: 4 },
  { title: 'Problem Solving', state: 'Strong', tone: 'green', icon: 'grid', copy: 'Well supported with specific examples.', reviewers: '4 of 4 reviewers', dots: 4 },
  { title: 'Communication', state: 'Partial', tone: 'orange', icon: 'message', copy: 'Some examples provided, more depth needed.', reviewers: '2 of 4 reviewers', dots: 2 },
  { title: 'Leadership', state: 'Limited', tone: 'red', icon: 'user', copy: 'Lacks examples from one reviewer.', reviewers: '1 of 4 reviewers', dots: 1 },
  { title: 'Collaboration', state: 'Limited', tone: 'orange', icon: 'users', copy: 'Mentioned but not explained.', reviewers: '1 of 4 reviewers', dots: 1 },
  { title: 'Stakeholder Management', state: 'Missing', tone: 'red', icon: 'briefcase', copy: 'Not discussed.', reviewers: '0 of 4 reviewers', dots: 0 },
]

const missingByReviewer = [
  { name: 'Alex Rivera', missing: 'None', tone: 'green' },
  { name: 'Priya Shah', missing: 'Add leadership examples', tone: 'orange' },
  { name: 'Daniel Kim', missing: 'Provide examples for leadership and clarify low communication rating', tone: 'red' },
  { name: 'Emma Johnson', missing: 'Add collaboration observations', tone: 'orange' },
]

const nextSteps = [
  'Ask Daniel for 1-2 examples supporting his leadership rating.',
  'Request additional feedback on collaboration from Priya.',
  'Clarify why communication was rated lower in the behavioral interview.',
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
    <div v-if="open" class="feedback-quality-overlay" @click.self="closeOverlay">
      <section class="feedback-quality-modal">
        <header class="feedback-quality-modal__header">
          <div class="feedback-quality-modal__title">
            <span class="feedback-quality-modal__title-icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="feedback-quality-modal__title-row">
                <h2>AI Feedback Quality</h2>
                <em>Beta</em>
              </div>
              <p>Is the interview feedback complete and trustworthy enough to support a confident hiring decision?</p>
            </div>
          </div>

          <div class="feedback-quality-modal__header-actions">
            <button type="button">
              <AppIcon name="info" :size="14" />
              <span>How does this work?</span>
            </button>
            <button class="feedback-quality-modal__close" type="button" aria-label="Close AI Feedback Quality" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="feedback-quality-modal__body">
          <div class="feedback-quality-top">
            <aside class="feedback-quality-candidate">
              <div class="feedback-quality-candidate__identity">
                <span class="feedback-quality-candidate__avatar">{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                  <span class="feedback-quality-candidate__badge">1 Interview Complete</span>
                </div>
              </div>

              <div class="feedback-quality-candidate__meta">
                <article><span>Stage</span><strong>Interview</strong></article>
                <article><span>Round</span><strong>Technical + Behavioral</strong></article>
                <article><span>Completed on</span><strong>Apr 24, 2025</strong></article>
                <article><span>Interviewers</span><strong>4</strong></article>
              </div>

              <button type="button">View Candidate Profile</button>
            </aside>

            <div class="feedback-quality-main">
              <div class="feedback-quality-row feedback-quality-row--top">
                <section class="quality-panel">
                  <div class="quality-panel__head">
                    <div class="quality-panel__label">Evidence Used By AI</div>
                    <AppIcon name="info" :size="13" />
                  </div>

                  <div class="evidence-grid">
                    <article v-for="item in evidenceCards" :key="item.title">
                      <span class="evidence-grid__icon" :class="`is-${item.tone}`">
                        <AppIcon :name="item.icon" :size="16" />
                      </span>
                      <strong>{{ item.title }}</strong>
                      <em>{{ item.value }}</em>
                      <small :class="`is-${item.tone}`">{{ item.note }}</small>
                    </article>
                  </div>

                  <div class="evidence-summary">
                    <span><AppIcon name="shield" :size="14" /> Overall Evidence Coverage</span>
                    <strong>89%</strong>
                    <em>Strong</em>
                    <small>Sufficient evidence to assess most competencies.</small>
                  </div>
                </section>

                <section class="quality-panel">
                  <div class="quality-panel__head">
                    <div class="quality-panel__label">Decision Readiness</div>
                    <AppIcon name="info" :size="13" />
                  </div>

                  <div class="decision-readiness">
                    <div class="decision-readiness__title">
                      <span><AppIcon name="alert" :size="16" /></span>
                      <div>
                        <strong>Additional Evidence Recommended</strong>
                        <small>Ready with Minor Gaps</small>
                      </div>
                    </div>
                    <p>The feedback is sufficient to assess technical competency, but leadership and collaboration still lack supporting examples. AI recommends collecting additional evidence before the final hiring decision.</p>

                    <div class="decision-readiness__scores">
                      <article>
                        <span>Overall Confidence</span>
                        <strong>81%</strong>
                        <em>Good</em>
                      </article>
                      <article>
                        <span>With additional evidence</span>
                        <strong>94%</strong>
                        <em>Expected confidence increase</em>
                      </article>
                    </div>
                  </div>
                </section>
              </div>

              <div class="feedback-quality-row feedback-quality-row--middle">
                <section class="quality-panel">
                  <div class="quality-panel__head">
                    <div class="quality-panel__label">Trusted Feedback By Reviewer</div>
                    <AppIcon name="info" :size="13" />
                  </div>

                  <div class="reviewer-trust-list">
                    <article v-for="item in trustedFeedbackRows" :key="item.name">
                      <div class="reviewer-trust-list__identity">
                        <span>{{ item.name.split(' ').map((part) => part[0]).join('') }}</span>
                        <div>
                          <strong>{{ item.name }}</strong>
                          <small>{{ item.role }}</small>
                        </div>
                      </div>
                      <em :class="`is-${item.tone}`">{{ item.level }}</em>
                      <p>{{ item.note }}</p>
                    </article>
                  </div>

                  <button type="button">View all reviewer feedback</button>
                </section>

                <section class="quality-panel">
                  <div class="quality-panel__head">
                    <div class="quality-panel__label">Missing Or Weak Feedback</div>
                    <AppIcon name="info" :size="13" />
                  </div>

                  <div class="missing-feedback-list">
                    <article v-for="item in missingFeedbackRows" :key="item.title">
                      <div class="missing-feedback-list__head">
                        <strong>{{ item.title }}</strong>
                        <span :class="`is-${item.tone}`">{{ item.tag }}</span>
                      </div>
                      <p>{{ item.note }}</p>
                    </article>
                  </div>

                  <button type="button">View all missing feedback</button>
                </section>

                <section class="quality-panel">
                  <div class="quality-panel__head">
                    <div class="quality-panel__label">AI Feedback Analysis</div>
                    <AppIcon name="info" :size="13" />
                  </div>

                  <div class="analysis-list">
                    <article v-for="item in analysisRows" :key="item.text">
                      <span :class="`is-${item.tone}`"></span>
                      <p>{{ item.text }}</p>
                    </article>
                  </div>

                  <button type="button">Read full AI analysis</button>
                </section>
              </div>
            </div>
          </div>

          <div class="feedback-quality-row feedback-quality-row--bottom">
            <section class="quality-panel quality-panel--wide">
              <div class="quality-panel__head">
                <div class="quality-panel__label">Competency Feedback Coverage</div>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="competency-grid">
                <article v-for="item in competencyCards" :key="item.title">
                  <div class="competency-grid__head">
                    <div class="competency-grid__title-row">
                      <span class="competency-grid__icon" :class="`is-${item.tone}`">
                        <AppIcon :name="item.icon" :size="15" />
                      </span>
                      <strong>{{ item.title }}</strong>
                    </div>
                    <span :class="`is-${item.tone}`">{{ item.state }}</span>
                  </div>
                  <p>{{ item.copy }}</p>
                  <div class="competency-grid__dots">
                    <i v-for="dot in 4" :key="`${item.title}-${dot}`" :class="{ 'is-filled': dot <= item.dots, [`is-${item.tone}`]: true }" />
                  </div>
                  <small>{{ item.reviewers }}</small>
                </article>
              </div>
            </section>

            <section class="quality-panel">
              <div class="quality-panel__head">
                <div class="quality-panel__label">Missing Feedback By Reviewer</div>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="missing-by-reviewer">
                <article v-for="item in missingByReviewer" :key="item.name">
                  <strong>{{ item.name }}</strong>
                  <p :class="`is-${item.tone}`">{{ item.missing }}</p>
                </article>
              </div>

              <button type="button">View all missing by reviewer</button>
            </section>

            <section class="quality-panel">
              <div class="quality-panel__head">
                <div class="quality-panel__label">Next Best Steps</div>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="next-steps-list">
                <article v-for="item in nextSteps" :key="item">
                  <span><AppIcon name="spark" :size="14" /></span>
                  <p>{{ item }}</p>
                </article>
              </div>

              <button type="button">View all suggested actions</button>
            </section>
          </div>
        </div>

        <footer class="feedback-quality-modal__footer">
          <p>
            <AppIcon name="shield" :size="13" />
            <span>AI insights are based on feedback content, structure, and historical quality patterns.</span>
          </p>

          <div class="feedback-quality-modal__footer-actions">
            <button type="button">
              <AppIcon name="share" :size="15" />
              <span>Share Analysis</span>
            </button>
            <button class="is-primary" type="button">
              <AppIcon name="document" :size="15" />
              <span>Download Feedback Quality Report</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.feedback-quality-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.feedback-quality-modal {
  width: min(1520px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #dde6f3;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.feedback-quality-modal__header,
.feedback-quality-modal__title,
.feedback-quality-modal__title-row,
.feedback-quality-modal__header-actions,
.feedback-quality-candidate__identity,
.quality-panel__head,
.evidence-summary,
.decision-readiness__title,
.decision-readiness__scores,
.reviewer-trust-list__identity,
.missing-feedback-list__head,
.analysis-list article,
.competency-grid__head,
.next-steps-list article,
.feedback-quality-modal__footer,
.feedback-quality-modal__footer p,
.feedback-quality-modal__footer-actions,
.feedback-quality-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.feedback-quality-modal__header,
.feedback-quality-modal__footer {
  justify-content: space-between;
}

.feedback-quality-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.feedback-quality-modal__title {
  gap: 10px;
}

.feedback-quality-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.feedback-quality-modal__title h2,
.feedback-quality-candidate__identity strong {
  margin: 0;
  color: #1f2940;
}

.feedback-quality-modal__title-row {
  gap: 8px;
}

.feedback-quality-modal__title-row em {
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

.feedback-quality-modal__title p,
.feedback-quality-candidate__identity p,
.decision-readiness p,
.reviewer-trust-list p,
.missing-feedback-list p,
.analysis-list p,
.competency-grid p,
.next-steps-list p,
.feedback-quality-modal__footer p {
  margin: 0;
  color: #748197;
}

.feedback-quality-modal__title h2 {
  font-size: 1rem;
}

.feedback-quality-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.feedback-quality-modal__header-actions {
  gap: 10px;
}

.feedback-quality-modal__header-actions button,
.feedback-quality-modal__footer-actions button,
.feedback-quality-candidate button,
.quality-panel button {
  font: inherit;
  cursor: pointer;
}

.feedback-quality-modal__header-actions button,
.feedback-quality-modal__footer-actions button {
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
}

.feedback-quality-modal__header-actions button {
  gap: 6px;
  padding: 0 12px;
}

.feedback-quality-modal__close {
  width: 34px;
  padding: 0;
  justify-content: center;
}

.feedback-quality-modal__body {
  overflow: auto;
  padding: 22px;
}

.feedback-quality-top {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
}

.feedback-quality-candidate {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.feedback-quality-candidate__identity {
  align-items: flex-start;
  gap: 12px;
}

.feedback-quality-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffcc82 0%, #3d6f6f 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 46px;
}

.feedback-quality-candidate__identity p {
  margin-top: 4px;
}

.feedback-quality-candidate__badge {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  margin-top: 8px;
  padding: 0 8px;
  border-radius: 999px;
  background: #dff8ec;
  color: #0d9a62;
  font-size: 0.69rem;
  font-weight: 800;
}

.feedback-quality-candidate__meta {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.feedback-quality-candidate__meta article {
  display: grid;
  gap: 3px;
}

.feedback-quality-candidate__meta span,
.quality-panel__label {
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.feedback-quality-candidate__meta strong {
  color: #1f2940;
  font-size: 0.83rem;
}

.feedback-quality-candidate button {
  width: 100%;
  height: 38px;
  margin-top: 18px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #3f4c67;
  font-weight: 700;
}

.feedback-quality-main,
.feedback-quality-row {
  display: grid;
  gap: 18px;
}

.feedback-quality-row--top {
  grid-template-columns: 1.3fr 0.9fr;
}

.feedback-quality-row--middle,
.feedback-quality-row--bottom {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 18px;
}

.feedback-quality-row--bottom {
  grid-template-columns: minmax(0, 2.35fr) minmax(220px, 0.72fr) minmax(220px, 0.78fr);
  align-items: start;
}

.quality-panel {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.quality-panel--wide {
  min-width: 0;
}

.quality-panel__head {
  justify-content: space-between;
  gap: 10px;
}

.quality-panel__head :deep(svg:last-child) {
  color: #a0abbe;
}

.evidence-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.evidence-grid article {
  padding: 14px 10px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  text-align: center;
}

.evidence-grid__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.evidence-grid__icon.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.evidence-grid__icon.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.evidence-grid article strong,
.decision-readiness__title strong,
.competency-grid__head strong,
.missing-by-reviewer strong {
  display: block;
  color: #1f2940;
}

.evidence-grid article em {
  display: block;
  margin-top: 8px;
  color: #1f2940;
  font-size: 1.4rem;
  font-style: normal;
  font-weight: 800;
}

.evidence-grid article small {
  display: block;
  margin-top: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.evidence-grid article small.is-green {
  color: #18b96a;
}

.evidence-grid article small.is-orange {
  color: #f3921f;
}

.evidence-summary {
  gap: 14px;
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f9fbff;
  flex-wrap: wrap;
}

.evidence-summary span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #1f2940;
  font-size: 0.8rem;
  font-weight: 700;
}

.evidence-summary strong {
  color: #18b96a;
  font-size: 1.15rem;
}

.evidence-summary em {
  color: #18b96a;
  font-style: normal;
  font-weight: 700;
}

.evidence-summary small {
  color: #748197;
}

.decision-readiness__title {
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
}

.decision-readiness__title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff3e5;
  color: #f3921f;
  flex: 0 0 32px;
}

.decision-readiness__title small {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  margin-top: 6px;
  padding: 0 8px;
  border-radius: 999px;
  background: #fff3e5;
  color: #f3921f;
  font-size: 0.68rem;
  font-weight: 800;
}

.decision-readiness p {
  margin-top: 12px;
  line-height: 1.6;
}

.decision-readiness__scores {
  gap: 14px;
  margin-top: 16px;
}

.decision-readiness__scores article {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
}

.decision-readiness__scores span {
  display: block;
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.decision-readiness__scores strong {
  display: block;
  margin-top: 8px;
  color: #f3921f;
  font-size: 1.6rem;
}

.decision-readiness__scores article:last-child strong {
  color: #18b96a;
}

.decision-readiness__scores em {
  display: block;
  margin-top: 6px;
  color: #748197;
  font-style: normal;
  font-size: 0.74rem;
}

.reviewer-trust-list,
.missing-feedback-list,
.analysis-list,
.missing-by-reviewer,
.next-steps-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.reviewer-trust-list article {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.reviewer-trust-list__identity {
  gap: 10px;
}

.reviewer-trust-list__identity span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffcc82 0%, #3d6f6f 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  flex: 0 0 30px;
}

.reviewer-trust-list__identity small {
  display: block;
  margin-top: 3px;
  color: #8a95a8;
  font-size: 0.73rem;
}

.reviewer-trust-list em {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 8px;
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
}

.reviewer-trust-list em.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.reviewer-trust-list em.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.reviewer-trust-list p {
  grid-column: 1 / -1;
  font-size: 0.78rem;
  line-height: 1.5;
}

.missing-feedback-list__head,
.competency-grid__head {
  justify-content: space-between;
  gap: 8px;
}

.competency-grid__head {
  display: grid;
  justify-items: start;
}

.missing-feedback-list__head span,
.competency-grid__head span {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 0.66rem;
  font-weight: 800;
}

.missing-feedback-list__head span.is-red,
.competency-grid__head span.is-red {
  background: #ffe9e9;
  color: #ef5350;
}

.missing-feedback-list__head span.is-orange,
.competency-grid__head span.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.missing-feedback-list__head span.is-amber {
  background: #fff7e7;
  color: #d28a15;
}

.missing-feedback-list p,
.analysis-list p,
.next-steps-list p,
.missing-by-reviewer p {
  font-size: 0.79rem;
  line-height: 1.55;
}

.analysis-list article,
.next-steps-list article {
  align-items: flex-start;
  gap: 10px;
}

.analysis-list article span {
  width: 9px;
  height: 9px;
  margin-top: 4px;
  border-radius: 50%;
  flex: 0 0 9px;
}

.analysis-list article span.is-green {
  background: #18b96a;
}

.analysis-list article span.is-orange {
  background: #f3921f;
}

.analysis-list article span.is-red {
  background: #ef5350;
}

.analysis-list article span.is-blue {
  background: #5662f1;
}

.quality-panel button {
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5662f1;
  font-weight: 700;
}

.competency-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
  margin-top: 14px;
  align-items: start;
}

.competency-grid article {
  display: grid;
  align-content: start;
  gap: 7px;
  padding: 10px 8px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
  min-width: 0;
}

.competency-grid__title-row {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  align-items: start;
  gap: 6px;
  width: 100%;
  min-width: 0;
}

.competency-grid__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 6px;
}

.competency-grid__icon.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.competency-grid__icon.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.competency-grid__icon.is-red {
  background: #ffe9e9;
  color: #ef5350;
}

.competency-grid__head span.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.competency-grid__head strong {
  display: block;
  min-width: 0;
  max-width: 100%;
  line-height: 1.2;
  word-break: normal;
  overflow-wrap: normal;
  white-space: normal;
  font-size: 0.72rem;
  letter-spacing: -0.01em;
}

.competency-grid__head span {
  margin-top: 0;
  min-height: 18px;
  padding: 0 6px;
  font-size: 0.58rem;
}

.competency-grid p {
  margin-top: 0;
  font-size: 0.64rem;
  line-height: 1.4;
}

.competency-grid__dots {
  display: flex;
  gap: 4px;
  margin-top: 2px;
}

.competency-grid__dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dde4ee;
}

.competency-grid__dots i.is-filled.is-green {
  background: #18b96a;
}

.competency-grid__dots i.is-filled.is-orange,
.competency-grid__dots i.is-filled.is-amber {
  background: #f3921f;
}

.competency-grid__dots i.is-filled.is-red {
  background: #ef5350;
}

.competency-grid small {
  display: block;
  margin-top: 0;
  color: #8a95a8;
  font-size: 0.62rem;
}

.missing-by-reviewer article {
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2f8;
}

.missing-by-reviewer article:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.missing-by-reviewer p.is-green {
  color: #18b96a;
}

.missing-by-reviewer p.is-orange {
  color: #f3921f;
}

.missing-by-reviewer p.is-red {
  color: #ef5350;
}

.next-steps-list article span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #f1f3ff;
  color: #5662f1;
  flex: 0 0 24px;
}

.feedback-quality-modal__footer {
  padding: 14px 22px;
  border-top: 1px solid #e7edf6;
}

.feedback-quality-modal__footer p {
  gap: 8px;
  font-size: 0.8rem;
}

.feedback-quality-modal__footer p :deep(svg) {
  color: #94a0b4;
}

.feedback-quality-modal__footer-actions {
  display: flex;
  gap: 10px;
}

.feedback-quality-modal__footer-actions button {
  gap: 8px;
  padding: 0 16px;
}

.feedback-quality-modal__footer-actions button.is-primary {
  border: 0;
  background: linear-gradient(90deg, #5c57ef 0%, #4b46d7 100%);
  color: #fff;
}

@media (max-width: 1380px) {
  .feedback-quality-row--middle {
    grid-template-columns: 1fr;
  }

  .feedback-quality-row--bottom {
    grid-template-columns: 1fr;
  }

  .competency-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1180px) {
  .feedback-quality-top,
  .feedback-quality-row--top {
    grid-template-columns: 1fr;
  }

  .evidence-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .competency-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .feedback-quality-overlay {
    padding: 10px;
  }

  .feedback-quality-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .feedback-quality-modal__header,
  .feedback-quality-modal__body,
  .feedback-quality-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .feedback-quality-modal__header,
  .feedback-quality-modal__footer {
    display: grid;
    gap: 12px;
  }

  .feedback-quality-modal__header-actions,
  .feedback-quality-modal__footer-actions,
  .decision-readiness__scores {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .evidence-grid,
  .competency-grid {
    grid-template-columns: 1fr;
  }
}
</style>
