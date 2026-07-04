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

const evidenceRows = [
  { label: 'Assessments', value: '4 / 4', note: 'Completed', tone: 'green', icon: 'document' },
  { label: 'Interviews', value: '3', note: 'Completed', tone: 'green', icon: 'users' },
  { label: 'Interview Scorecards', value: '8 / 9', note: 'Submitted', tone: 'orange', icon: 'clipboard-check' },
  { label: 'Feedback Notes', value: '5', note: 'Submitted', tone: 'green', icon: 'message' },
  { label: 'Work Samples', value: '1', note: 'Reviewed', tone: 'green', icon: 'document' },
]

const riskSummaryItems = [
  { title: 'Technical evaluation appears fair', copy: 'Strong evidence across all scorecards.', tone: 'green' },
  { title: 'Leadership ratings contain conflicting evidence', copy: 'High variation and unsupported low ratings detected.', tone: 'orange' },
  { title: 'One reviewer used subjective language', copy: 'Personal judgments found in comments.', tone: 'orange' },
  { title: 'No demographic or protected attribute bias detected', copy: 'Good use of job-related criteria.', tone: 'green' },
]

const flaggedRows = [
  {
    reviewer: 'Daniel Kim',
    role: 'Staff Engineer',
    competency: 'Leadership',
    badge: 'Unsupported Rating',
    badgeTone: 'red',
    score: '2 / 5',
    comment: '"Not leadership material."',
    why: 'Low rating with no behavioral examples or evidence from the interview.',
  },
  {
    reviewer: 'Priya Shah',
    role: 'Senior Engineer',
    competency: 'Communication',
    badge: 'Subjective Language',
    badgeTone: 'orange',
    score: '3 / 5',
    comment: '"Communication could maybe be better."',
    why: 'Vague and subjective phrasing. Lacks specific observable behavior.',
  },
  {
    reviewer: 'Emma Johnson',
    role: 'Tech Lead',
    competency: 'Culture Add',
    badge: 'Non-Job Related',
    badgeTone: 'violet',
    score: '2 / 5',
    comment: '"Too quiet, did not speak up enough in group."',
    why: 'Comment relates to personality trait, not job-related behavior.',
  },
]

const explanationItems = [
  'The flagged scorecards may introduce unfairness or inconsistencies if not addressed.',
  'Unsupported ratings and subjective language make it harder to accurately assess the candidate’s true fit and potential.',
  'Clarifying or updating these scorecards will improve fairness and increase the reliability of the hiring decision.',
]

const actions = [
  { title: 'Request Clarification', note: 'Ask reviewers for examples or evidence.', tone: 'violet', icon: 'message' },
  { title: 'Ignore Unsupported Rating', note: 'Exclude from scoring if appropriate.', tone: 'orange', icon: 'edit' },
  { title: 'Mark as Reviewed', note: 'I have reviewed the issues and want to proceed.', tone: 'green', icon: 'checkCircle' },
  { title: 'Re-run AI Analysis', note: 'Run analysis again after updates are made.', tone: 'blue', icon: 'refresh' },
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
    <div v-if="open" class="bias-detection-overlay" @click.self="closeOverlay">
      <section class="bias-detection-modal">
        <header class="bias-detection-modal__header">
          <div class="bias-detection-modal__title">
            <span class="bias-detection-modal__title-icon">
              <AppIcon name="sparkles" :size="18" />
            </span>
            <div>
              <div class="bias-detection-modal__title-row">
                <h2>AI Scorecard Bias Detection</h2>
                <em>Beta</em>
              </div>
              <p>AI reviews interview scorecards to detect unsupported ratings, biased language, and fairness risks.</p>
            </div>
          </div>

          <div class="bias-detection-modal__header-actions">
            <button type="button">
              <AppIcon name="info" :size="14" />
              <span>How does this work?</span>
            </button>
            <button class="bias-detection-modal__close" type="button" aria-label="Close AI Scorecard Bias Detection" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="bias-detection-modal__body">
          <div class="bias-detection-top">
            <aside class="bias-candidate-panel">
              <div class="bias-candidate-panel__identity">
                <span class="bias-candidate-panel__avatar">{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                  <span class="bias-candidate-panel__badge">Interview Complete</span>
                </div>
              </div>

              <div class="bias-candidate-panel__evidence">
                <div class="panel-label">Evidence Reviewed By AI</div>
                <article v-for="item in evidenceRows" :key="item.label">
                  <span><AppIcon :name="item.icon" :size="14" /></span>
                  <div>
                    <strong>{{ item.label }}</strong>
                    <small>{{ item.value }}</small>
                  </div>
                  <em :class="`is-${item.tone}`">{{ item.note }}</em>
                </article>
              </div>

              <div class="bias-confidence-card">
                <div class="panel-label">Fairness Confidence</div>
                <strong>93%</strong>
                <span>High</span>
                <p>AI found sufficient objective evidence to support 91% of competency ratings. 9% of ratings require clarification.</p>
              </div>
            </aside>

            <div class="bias-main">
              <div class="bias-main__row">
                <section class="bias-panel">
                  <div class="panel-label">Overall Fairness Assessment</div>

                  <div class="fairness-summary">
                    <span class="fairness-summary__icon">
                      <AppIcon name="shield" :size="24" />
                    </span>
                    <div>
                      <strong>Review Before Decision</strong>
                      <p>AI detected 3 scorecards that contain unsupported ratings or potentially biased language.</p>
                    </div>
                    <div class="fairness-summary__confidence">
                      <small>Decision Confidence</small>
                      <strong>Medium</strong>
                    </div>
                  </div>

                  <div class="fairness-review-note">
                    <span><AppIcon name="spark" :size="16" /></span>
                    <div>
                      <strong>Why review is recommended</strong>
                      <p>Some feedback lacks supporting evidence or uses subjective language that may impact fairness and accuracy of the hiring decision.</p>
                    </div>
                  </div>
                </section>

                <section class="bias-panel">
                  <div class="panel-label">Hiring Risk Summary</div>
                  <div class="risk-summary-list">
                    <article v-for="item in riskSummaryItems" :key="item.title">
                      <span :class="`is-${item.tone}`"></span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p>{{ item.copy }}</p>
                      </div>
                    </article>
                  </div>

                  <div class="overall-risk">
                    <span>Overall Risk</span>
                    <strong>Medium</strong>
                  </div>
                </section>
              </div>

              <div class="bias-main__row bias-main__row--bottom">
                <section class="bias-panel">
                  <div class="panel-label">Flagged Scorecards (3)</div>

                  <div class="flagged-list">
                    <article v-for="item in flaggedRows" :key="`${item.reviewer}-${item.competency}`">
                      <div class="flagged-list__reviewer">
                        <span>{{ item.reviewer.split(' ').map((part) => part[0]).join('') }}</span>
                        <div>
                          <strong>{{ item.reviewer }}</strong>
                          <small>{{ item.role }}</small>
                          <em>{{ item.competency }}</em>
                        </div>
                      </div>

                      <div class="flagged-list__score">
                        <span :class="`is-${item.badgeTone}`">{{ item.badge }}</span>
                        <strong>{{ item.score }}</strong>
                      </div>

                      <div class="flagged-list__copy">
                        <div>
                          <label>Comment</label>
                          <p>{{ item.comment }}</p>
                        </div>
                        <div>
                          <label>Why Flagged</label>
                          <p>{{ item.why }}</p>
                        </div>
                      </div>

                      <AppIcon name="chevronRight" :size="16" />
                    </article>
                  </div>

                  <button type="button">View all flagged issues</button>
                </section>

                <section class="bias-panel">
                  <div class="panel-label">AI Explanation</div>
                  <div class="explanation-card">
                    <article v-for="item in explanationItems" :key="item">
                      <span><AppIcon name="spark" :size="15" /></span>
                      <p>{{ item }}</p>
                    </article>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div class="bias-bottom">
            <section class="bias-panel">
              <div class="panel-label">Decision Impact</div>
              <div class="decision-impact">
                <div>
                  <strong>Yes, this can affect the hiring decision.</strong>
                  <p>If unresolved, leadership competency may be unfairly represented and could impact overall evaluation.</p>
                </div>
                <div class="decision-impact__stats">
                  <article>
                    <span>Estimated Impact</span>
                    <strong>Medium</strong>
                  </article>
                  <article>
                    <span>Competency Most Affected</span>
                    <strong>Leadership</strong>
                  </article>
                </div>
              </div>
            </section>

            <section class="bias-panel">
              <div class="panel-label">Actions You Can Take</div>
              <div class="actions-grid">
                <article v-for="item in actions" :key="item.title">
                  <span class="actions-grid__icon" :class="`is-${item.tone}`">
                    <AppIcon :name="item.icon" :size="16" />
                  </span>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.note }}</p>
                </article>
              </div>
            </section>
          </div>
        </div>

        <footer class="bias-detection-modal__footer">
          <p>
            <AppIcon name="shield" :size="13" />
            <span>AI helps you build a fairer, more consistent hiring process with transparent evidence for the final decision.</span>
          </p>

          <div class="bias-detection-modal__footer-actions">
            <button type="button">
              <AppIcon name="share" :size="15" />
              <span>Share Analysis</span>
            </button>
            <button class="is-primary" type="button">
              <AppIcon name="document" :size="15" />
              <span>Download Bias Detection Report</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.bias-detection-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.bias-detection-modal {
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

.bias-detection-modal__header,
.bias-detection-modal__title,
.bias-detection-modal__title-row,
.bias-detection-modal__header-actions,
.bias-candidate-panel__identity,
.fairness-summary,
.risk-summary-list article,
.flagged-list__reviewer,
.explanation-card article,
.overall-risk,
.decision-impact,
.bias-detection-modal__footer,
.bias-detection-modal__footer p,
.bias-detection-modal__footer-actions,
.bias-detection-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.bias-detection-modal__header,
.bias-detection-modal__footer {
  justify-content: space-between;
}

.bias-detection-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.bias-detection-modal__title {
  gap: 10px;
}

.bias-detection-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.bias-detection-modal__title h2,
.bias-candidate-panel__identity strong,
.fairness-summary strong,
.decision-impact strong {
  margin: 0;
  color: #1f2940;
}

.bias-detection-modal__title-row {
  gap: 8px;
}

.bias-detection-modal__title-row em {
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

.bias-detection-modal__title p,
.bias-candidate-panel__identity p,
.fairness-summary p,
.risk-summary-list p,
.flagged-list__copy p,
.explanation-card p,
.decision-impact p,
.bias-detection-modal__footer p {
  margin: 0;
  color: #748197;
}

.bias-detection-modal__title h2 {
  font-size: 1rem;
}

.bias-detection-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.bias-detection-modal__header-actions {
  gap: 10px;
}

.bias-detection-modal__header-actions button,
.bias-detection-modal__footer-actions button,
.bias-panel button {
  font: inherit;
  cursor: pointer;
}

.bias-detection-modal__header-actions button,
.bias-detection-modal__footer-actions button {
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
}

.bias-detection-modal__header-actions button {
  gap: 6px;
  padding: 0 12px;
}

.bias-detection-modal__close {
  width: 34px;
  padding: 0;
  justify-content: center;
}

.bias-detection-modal__body {
  overflow: auto;
  padding: 22px;
}

.bias-detection-top {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
}

.bias-candidate-panel {
  display: grid;
  gap: 18px;
}

.bias-candidate-panel__identity,
.bias-candidate-panel__evidence,
.bias-confidence-card,
.bias-panel {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.bias-candidate-panel__identity {
  align-items: flex-start;
  gap: 12px;
}

.bias-candidate-panel__avatar {
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

.bias-candidate-panel__identity p {
  margin-top: 4px;
}

.bias-candidate-panel__badge {
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

.panel-label {
  color: #5562f1;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.bias-candidate-panel__evidence {
  display: grid;
  gap: 12px;
}

.bias-candidate-panel__evidence article {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.bias-candidate-panel__evidence article span {
  color: #5662f1;
}

.bias-candidate-panel__evidence article strong {
  display: block;
  color: #1f2940;
  font-size: 0.78rem;
}

.bias-candidate-panel__evidence article small {
  display: block;
  margin-top: 2px;
  color: #8a95a8;
  font-size: 0.72rem;
}

.bias-candidate-panel__evidence article em {
  font-style: normal;
  font-size: 0.7rem;
  font-weight: 700;
}

.bias-candidate-panel__evidence article em.is-green {
  color: #18b96a;
}

.bias-candidate-panel__evidence article em.is-orange {
  color: #f3921f;
}

.bias-confidence-card strong {
  display: block;
  margin-top: 14px;
  color: #18b96a;
  font-size: 2.2rem;
  line-height: 1;
}

.bias-confidence-card span {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  margin-top: 8px;
  padding: 0 8px;
  border-radius: 999px;
  background: #ecfbf3;
  color: #18b96a;
  font-size: 0.72rem;
  font-weight: 800;
}

.bias-confidence-card p {
  margin-top: 12px;
  color: #748197;
  font-size: 0.8rem;
  line-height: 1.55;
}

.bias-main {
  display: grid;
  gap: 18px;
}

.bias-main__row {
  display: grid;
  grid-template-columns: 1.2fr 0.95fr;
  gap: 18px;
}

.bias-main__row--bottom {
  grid-template-columns: 1.2fr 0.8fr;
}

.fairness-summary {
  align-items: flex-start;
  gap: 14px;
  margin-top: 16px;
}

.fairness-summary__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: #fff3e5;
  color: #f3921f;
  flex: 0 0 46px;
}

.fairness-summary strong {
  color: #f3921f;
  font-size: 1.8rem;
  line-height: 1.1;
}

.fairness-summary p {
  margin-top: 8px;
  line-height: 1.6;
}

.fairness-summary__confidence {
  margin-left: auto;
  min-width: 132px;
  padding: 14px;
  border-radius: 14px;
  background: #fff8ef;
}

.fairness-summary__confidence small {
  display: block;
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.fairness-summary__confidence strong {
  display: block;
  margin-top: 8px;
  color: #f3921f;
  font-size: 1.2rem;
}

.fairness-review-note {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 10px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #ffe6c8;
  border-radius: 12px;
  background: #fffaf3;
}

.fairness-review-note span {
  color: #f3921f;
}

.fairness-review-note strong,
.risk-summary-list strong,
.flagged-list__copy label,
.explanation-card strong,
.overall-risk strong,
.actions-grid strong {
  color: #1f2940;
}

.fairness-review-note p {
  margin-top: 6px;
  color: #748197;
  line-height: 1.55;
}

.risk-summary-list {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.risk-summary-list article {
  align-items: flex-start;
  gap: 10px;
}

.risk-summary-list article span {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 50%;
  flex: 0 0 12px;
}

.risk-summary-list article span.is-green {
  background: #18b96a;
}

.risk-summary-list article span.is-orange {
  background: #f3921f;
}

.risk-summary-list p {
  margin-top: 4px;
  line-height: 1.5;
}

.overall-risk {
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #edf2f8;
}

.overall-risk span {
  color: #748197;
}

.overall-risk strong {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 14px;
  border-radius: 10px;
  background: #fff3e5;
  color: #f3921f;
  font-size: 0.92rem;
}

.flagged-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.flagged-list article {
  display: grid;
  grid-template-columns: 180px 120px minmax(0, 1fr) 18px;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
}

.flagged-list__reviewer {
  gap: 10px;
}

.flagged-list__reviewer span {
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

.flagged-list__reviewer small,
.flagged-list__reviewer em {
  display: block;
  margin-top: 3px;
  color: #8a95a8;
  font-size: 0.72rem;
  font-style: normal;
}

.flagged-list__score span {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  font-size: 0.64rem;
  font-weight: 800;
}

.flagged-list__score span.is-red {
  background: #ffe9e9;
  color: #ef5350;
}

.flagged-list__score span.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.flagged-list__score span.is-violet {
  background: #eef1ff;
  color: #5662f1;
}

.flagged-list__score strong {
  display: block;
  margin-top: 8px;
  color: #ef5350;
  font-size: 1.4rem;
}

.flagged-list__copy {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.flagged-list__copy label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.flagged-list__copy p {
  line-height: 1.5;
}

.flagged-list article > :deep(svg:last-child) {
  color: #a0abbe;
  margin-top: 6px;
}

.bias-panel button {
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5662f1;
  font-weight: 700;
}

.explanation-card {
  display: grid;
  gap: 14px;
  margin-top: 16px;
  padding: 16px;
  border-radius: 14px;
  background: #faf8ff;
}

.explanation-card article {
  align-items: flex-start;
  gap: 10px;
}

.explanation-card article span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f1f3ff;
  color: #5662f1;
  flex: 0 0 28px;
}

.explanation-card p {
  line-height: 1.55;
}

.bias-bottom {
  display: grid;
  grid-template-columns: 1.05fr 1.1fr;
  gap: 18px;
  margin-top: 18px;
}

.decision-impact {
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-top: 16px;
}

.decision-impact p {
  margin-top: 8px;
  line-height: 1.6;
}

.decision-impact__stats {
  display: grid;
  gap: 14px;
  min-width: 180px;
}

.decision-impact__stats article {
  padding: 12px;
  border-radius: 12px;
  background: #fbfcff;
}

.decision-impact__stats span {
  display: block;
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.decision-impact__stats strong {
  display: block;
  margin-top: 8px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.actions-grid article {
  padding: 14px 12px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
}

.actions-grid__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.actions-grid__icon.is-violet {
  background: #eef1ff;
  color: #5662f1;
}

.actions-grid__icon.is-orange {
  background: #fff3e5;
  color: #f3921f;
}

.actions-grid__icon.is-green {
  background: #ecfbf3;
  color: #18b96a;
}

.actions-grid__icon.is-blue {
  background: #eef4ff;
  color: #4b7bff;
}

.actions-grid strong {
  display: block;
  margin-top: 12px;
}

.actions-grid p {
  margin-top: 8px;
  color: #748197;
  font-size: 0.76rem;
  line-height: 1.5;
}

.bias-detection-modal__footer {
  padding: 14px 22px;
  border-top: 1px solid #e7edf6;
}

.bias-detection-modal__footer p {
  gap: 8px;
  font-size: 0.8rem;
}

.bias-detection-modal__footer p :deep(svg) {
  color: #94a0b4;
}

.bias-detection-modal__footer-actions {
  display: flex;
  gap: 10px;
}

.bias-detection-modal__footer-actions button {
  gap: 8px;
  padding: 0 16px;
}

.bias-detection-modal__footer-actions button.is-primary {
  border: 0;
  background: linear-gradient(90deg, #5c57ef 0%, #4b46d7 100%);
  color: #fff;
}

@media (max-width: 1360px) {
  .bias-main__row,
  .bias-main__row--bottom,
  .bias-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1120px) {
  .bias-detection-top {
    grid-template-columns: 1fr;
  }

  .flagged-list {
    overflow-x: auto;
  }

  .flagged-list article {
    min-width: 860px;
  }

  .actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .bias-detection-overlay {
    padding: 10px;
  }

  .bias-detection-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .bias-detection-modal__header,
  .bias-detection-modal__body,
  .bias-detection-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .bias-detection-modal__header,
  .bias-detection-modal__footer {
    display: grid;
    gap: 12px;
  }

  .bias-detection-modal__header-actions,
  .bias-detection-modal__footer-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .fairness-summary,
  .decision-impact {
    display: grid;
  }

  .fairness-summary__confidence,
  .decision-impact__stats {
    min-width: 0;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
