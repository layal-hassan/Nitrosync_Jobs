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

const disagreementCards = [
  {
    name: 'Alex Rivera',
    score: '5 / 5',
    note: 'Alex perceived strong problem solving strengths and dependable cross-functional collaboration.',
    tone: 'green',
  },
  {
    name: 'Priya Shah',
    score: '2 / 5',
    note: 'Priya perceived limited leadership during ambiguous situations and weaker influence evidence.',
    tone: 'red',
  },
]

const confidenceRows = [
  { label: 'Problem Solving', filled: 5, confidence: 'High', tone: 'green', why: 'Consistent across all evaluations' },
  { label: 'Communication', filled: 4, confidence: 'High', tone: 'green', why: 'Strong evidence in interviews' },
  { label: 'Leadership', filled: 2, confidence: 'Low', tone: 'orange', why: 'Limited and conflicting evidence' },
  { label: 'Collaboration', filled: 3, confidence: 'Medium', tone: 'amber', why: 'Some evidence, varied interpretation' },
]

const discussionCards = [
  {
    title: 'Leadership',
    priority: 'High Priority',
    tone: 'red',
    copy: 'Significant disagreement between reviewers on leadership potential and examples.',
    action: 'View discussion guide',
  },
  {
    title: 'Problem Solving',
    priority: 'Medium Priority',
    tone: 'amber',
    copy: 'Different contexts led to varied ratings. Clarify expectations by system design vs. coding.',
    action: 'View discussion guide',
  },
  {
    title: 'Communication',
    priority: 'Low Priority',
    tone: 'blue',
    copy: 'One reviewer provided limited specific examples. No major alignment concerns.',
    action: 'View discussion guide',
  },
]

const reviewerRows = [
  { name: 'Alex Rivera', role: 'Engineering Manager', score: '4.6 / 5', alignment: 'Aligned', alignmentTone: 'green', dots: 4, calibration: 'Well Calibrated', calibrationTone: 'green' },
  { name: 'Priya Shah', role: 'Senior Engineer', score: '4.5 / 5', alignment: 'Aligned', alignmentTone: 'green', dots: 4, calibration: 'Well Calibrated', calibrationTone: 'green' },
  { name: 'Daniel Kim', role: 'Staff Engineer', score: '2.8 / 5', alignment: 'Outlier', alignmentTone: 'red', dots: 1, calibration: 'Too Harsh', calibrationTone: 'red' },
  { name: 'Emma Johnson', role: 'Tech Lead', score: '4.7 / 5', alignment: 'Aligned', alignmentTone: 'green', dots: 4, calibration: 'Well Calibrated', calibrationTone: 'green' },
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
    <div v-if="open" class="score-calibration-overlay" @click.self="closeOverlay">
      <section class="score-calibration-modal">
        <header class="score-calibration-modal__header">
          <div class="score-calibration-modal__title">
            <span class="score-calibration-modal__title-icon">
              <AppIcon name="target" :size="18" />
            </span>
            <div>
              <div class="score-calibration-modal__title-row">
                <h2>AI Score Calibration</h2>
                <em>Beta</em>
              </div>
              <p>Are we aligned enough to make a confident decision?</p>
            </div>
          </div>

          <div class="score-calibration-modal__header-actions">
            <button type="button">
              <AppIcon name="info" :size="14" />
              <span>How does this work?</span>
            </button>
            <button class="score-calibration-modal__close" type="button" aria-label="Close AI Score Calibration" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="score-calibration-modal__body">
          <div class="score-calibration-top">
            <aside class="candidate-panel">
              <div class="candidate-panel__identity">
                <span class="candidate-panel__avatar">{{ candidateInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                  <span class="candidate-panel__badge">1 Interview Complete</span>
                </div>
              </div>

              <div class="candidate-panel__meta">
                <article><span>Stage</span><strong>Interview</strong></article>
                <article><span>Round</span><strong>Technical + Behavioral</strong></article>
                <article><span>Completed On</span><strong>Apr 24, 2025</strong></article>
                <article><span>Reviewers</span><strong>4</strong></article>
              </div>

              <button type="button">View Candidate Profile</button>

              <div class="candidate-panel__note">
                <AppIcon name="spark" :size="15" />
                <p>AI analyzes scores, feedback and evidence across all reviewers to identify alignment, disagreement and areas that need discussion.</p>
              </div>
            </aside>

            <div class="score-calibration-main">
              <div class="top-metrics-grid">
                <section class="panel">
                  <div class="panel__label is-violet">AI Executive Summary</div>
                  <div class="summary-panel">
                    <span><AppIcon name="sparkles" :size="20" /></span>
                    <p>
                      The hiring team is largely aligned on the candidate’s technical abilities and communication skills.
                      However, there is <strong>significant disagreement on leadership potential</strong>. A short calibration
                      discussion focused on leadership is recommended before making the final decision.
                    </p>
                  </div>
                </section>

                <section class="panel panel--alignment">
                  <div class="panel__head">
                    <div class="panel__label">Team Alignment</div>
                    <AppIcon name="info" :size="13" />
                  </div>
                  <div class="alignment-panel">
                    <div>
                      <strong>68%</strong>
                      <span>Moderate Alignment</span>
                      <p>Reviewers disagree on 2 critical competencies.</p>
                    </div>
                    <div class="alignment-gauge">
                      <div class="alignment-gauge__arc">
                        <div class="alignment-gauge__needle"></div>
                      </div>
                      <div class="alignment-gauge__scale">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>
                  <button type="button">Read full AI summary</button>
                </section>
              </div>

              <div class="top-details-grid">
                <section class="panel">
                  <div class="panel__label">Biggest Disagreement</div>
                  <div class="disagreement-card">
                    <div class="disagreement-card__head">
                      <strong>Leadership</strong>
                      <span>High Impact</span>
                    </div>

                    <div class="disagreement-card__versus">
                      <article v-for="item in disagreementCards" :key="item.name">
                        <div class="disagreement-card__reviewer">
                          <span>{{ item.name.split(' ').map((part) => part[0]).join('') }}</span>
                          <div>
                            <strong>{{ item.name }}</strong>
                            <small>{{ item.score }}</small>
                          </div>
                        </div>
                        <p>{{ item.note }}</p>
                      </article>
                    </div>

                    <div class="disagreement-card__footer">
                      <AppIcon name="spark" :size="14" />
                      <span>AI Recommendation</span>
                      <small>Review leadership examples together to reach alignment.</small>
                    </div>
                  </div>
                </section>

                <section class="panel">
                  <div class="panel__head">
                    <div class="panel__label">Evidence Confidence</div>
                    <AppIcon name="info" :size="13" />
                  </div>
                  <div class="confidence-list">
                    <article v-for="item in confidenceRows" :key="item.label">
                      <strong>{{ item.label }}</strong>
                      <div class="confidence-list__bars">
                        <i
                          v-for="bar in 5"
                          :key="`${item.label}-${bar}`"
                          :class="{ 'is-filled': bar <= item.filled, [`is-${item.tone}`]: true }"
                        />
                      </div>
                      <span :class="`is-${item.tone}`">{{ item.confidence }}</span>
                      <small>{{ item.why }}</small>
                    </article>
                  </div>
                  <button type="button">View all competency details</button>
                </section>

                <section class="panel panel--recommendation">
                  <div class="panel__head">
                    <span class="panel__head-icon">
                      <AppIcon name="checkCircle" :size="14" />
                    </span>
                    <div class="panel__label">Recommended Action</div>
                  </div>
                  <div class="recommended-action-card">
                    <small>AI Recommendation</small>
                    <strong>Proceed with a short calibration discussion.</strong>
                    <p>Additional interviews are not recommended before the team aligns on leadership interpretation.</p>
                    <div class="recommended-action-card__meta">
                      <article><span>Estimated duration</span><strong>10 minutes</strong></article>
                      <article><span>Focus</span><strong>Leadership only</strong></article>
                      <article><span>Additional interviews</span><strong>Not recommended</strong></article>
                    </div>
                    <button type="button">Start Calibration Discussion</button>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div class="score-calibration-bottom">
            <section class="panel">
              <div class="panel__head">
                <div class="panel__label">What Should The Team Discuss?</div>
                <AppIcon name="info" :size="13" />
              </div>
              <div class="discussion-grid">
                <article v-for="item in discussionCards" :key="item.title">
                  <div class="discussion-grid__head">
                    <strong>{{ item.title }}</strong>
                    <span :class="`is-${item.tone}`">{{ item.priority }}</span>
                  </div>
                  <p>{{ item.copy }}</p>
                  <button type="button">{{ item.action }}</button>
                </article>
              </div>
              <div class="discussion-footer">
                <AppIcon name="spark" :size="14" />
                <span>Focus on high priority topics first to save time.</span>
              </div>
            </section>

            <section class="panel">
              <div class="panel__head">
                <div class="panel__label">Reviewer Overview</div>
                <AppIcon name="info" :size="13" />
              </div>

              <div class="reviewer-table">
                <div class="reviewer-table__head">
                  <span>Reviewer</span>
                  <span>Overall Score (Avg)</span>
                  <span>Alignment</span>
                  <span>Consistency</span>
                  <span>Calibration</span>
                </div>

                <article v-for="item in reviewerRows" :key="item.name" class="reviewer-table__row">
                  <div class="reviewer-table__identity">
                    <span>{{ item.name.split(' ').map((part) => part[0]).join('') }}</span>
                    <div>
                      <strong>{{ item.name }}</strong>
                      <small>{{ item.role }}</small>
                    </div>
                  </div>
                  <strong class="reviewer-table__score">{{ item.score }}</strong>
                  <strong :class="`is-${item.alignmentTone}`">{{ item.alignment }}</strong>
                  <div class="reviewer-table__dots">
                    <i v-for="dot in 4" :key="`${item.name}-${dot}`" :class="{ 'is-filled': dot <= item.dots, [`is-${item.alignmentTone}`]: true }" />
                  </div>
                  <strong :class="`is-${item.calibrationTone}`">{{ item.calibration }}</strong>
                </article>
              </div>

              <button class="reviewer-table__footer-link" type="button">View reviewer details</button>
            </section>
          </div>
        </div>

        <footer class="score-calibration-modal__footer">
          <p>
            <AppIcon name="info" :size="13" />
            <span>AI insights are based on available data and reviewer feedback. Use your judgment and context before making decisions.</span>
          </p>

          <div class="score-calibration-modal__footer-actions">
            <button type="button">
              <AppIcon name="share" :size="15" />
              <span>Share Analysis</span>
            </button>
            <button class="is-primary" type="button">
              <AppIcon name="document" :size="15" />
              <span>Download Calibration Report</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.score-calibration-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(226, 232, 240, 0.72);
  backdrop-filter: blur(8px);
}

.score-calibration-modal {
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

.score-calibration-modal__header,
.score-calibration-modal__title,
.score-calibration-modal__title-row,
.score-calibration-modal__header-actions,
.candidate-panel__identity,
.content-section__title,
.summary-panel,
.panel__head,
.disagreement-card__reviewer,
.disagreement-card__footer,
.recommended-action-card__meta,
.discussion-grid__head,
.discussion-footer,
.reviewer-table__identity,
.score-calibration-modal__footer,
.score-calibration-modal__footer p,
.score-calibration-modal__footer-actions,
.score-calibration-modal__footer-actions button {
  display: flex;
  align-items: center;
}

.score-calibration-modal__header,
.score-calibration-modal__footer {
  justify-content: space-between;
}

.score-calibration-modal__header {
  padding: 16px 22px;
  border-bottom: 1px solid #e7edf6;
}

.score-calibration-modal__title {
  gap: 10px;
}

.score-calibration-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #eef1ff;
  color: #5a54f3;
}

.score-calibration-modal__title h2,
.candidate-panel__identity strong {
  margin: 0;
  color: #1f2940;
}

.score-calibration-modal__title-row {
  gap: 8px;
}

.score-calibration-modal__title-row em {
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

.score-calibration-modal__title p,
.candidate-panel__identity p,
.candidate-panel__note p,
.summary-panel p,
.alignment-panel p,
.disagreement-card__versus p,
.confidence-list small,
.recommended-action-card p,
.discussion-grid p,
.reviewer-table small,
.score-calibration-modal__footer p {
  margin: 0;
  color: #748197;
}

.score-calibration-modal__title h2 {
  font-size: 1rem;
}

.score-calibration-modal__title p {
  margin-top: 2px;
  font-size: 0.84rem;
}

.score-calibration-modal__header-actions {
  gap: 10px;
}

.score-calibration-modal__header-actions button,
.score-calibration-modal__footer-actions button,
.candidate-panel button,
.panel button,
.discussion-grid button {
  font: inherit;
  cursor: pointer;
}

.score-calibration-modal__header-actions button,
.score-calibration-modal__footer-actions button {
  height: 34px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #445066;
}

.score-calibration-modal__header-actions button {
  gap: 6px;
  padding: 0 12px;
}

.score-calibration-modal__close {
  width: 34px;
  padding: 0;
  justify-content: center;
}

.score-calibration-modal__body {
  overflow: auto;
  padding: 22px;
}

.score-calibration-top {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 18px;
}

.candidate-panel {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.candidate-panel__identity {
  align-items: flex-start;
  gap: 12px;
}

.candidate-panel__avatar {
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

.candidate-panel__identity p {
  margin-top: 4px;
}

.candidate-panel__badge {
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

.candidate-panel__meta {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.candidate-panel__meta article {
  display: grid;
  gap: 3px;
}

.candidate-panel__meta span,
.panel__label,
.reviewer-table__head {
  color: #9aa5b7;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.candidate-panel__meta strong {
  color: #1f2940;
  font-size: 0.83rem;
}

.candidate-panel button {
  width: 100%;
  height: 38px;
  margin-top: 18px;
  border: 1px solid #dbe4f1;
  border-radius: 10px;
  background: #fff;
  color: #3f4c67;
  font-weight: 700;
}

.candidate-panel__note {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 10px;
  margin-top: 18px;
  padding: 14px;
  border-radius: 12px;
  background: #f7f9ff;
}

.candidate-panel__note :deep(svg) {
  color: #5a54f3;
  margin-top: 2px;
}

.candidate-panel__note p {
  font-size: 0.78rem;
  line-height: 1.55;
}

.score-calibration-main {
  display: grid;
  gap: 18px;
}

.top-metrics-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
}

.top-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 0.92fr;
  gap: 18px;
}

.panel {
  padding: 16px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: #fff;
}

.panel__label {
  color: #5562f1;
}

.panel__label.is-violet {
  color: #5562f1;
}

.panel__head {
  justify-content: space-between;
  gap: 10px;
}

.panel__head-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ebfbf3;
  color: #16a668;
}

.panel__head :deep(svg:last-child) {
  color: #a0abbe;
}

.summary-panel {
  align-items: flex-start;
  gap: 14px;
  margin-top: 16px;
}

.summary-panel span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4ff;
  color: #5a54f3;
  flex: 0 0 40px;
}

.summary-panel p {
  line-height: 1.7;
}

.summary-panel strong {
  color: #d5436a;
}

.alignment-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 140px;
  gap: 14px;
  margin-top: 14px;
}

.alignment-panel strong {
  display: block;
  color: #f3921f;
  font-size: 3rem;
  line-height: 1;
}

.alignment-panel span {
  display: block;
  margin-top: 4px;
  color: #f3921f;
  font-weight: 700;
}

.alignment-panel p {
  margin-top: 12px;
  line-height: 1.5;
}

.alignment-gauge__arc {
  position: relative;
  width: 120px;
  height: 60px;
  overflow: hidden;
}

.alignment-gauge__arc::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 120px 120px 0 0;
  background: conic-gradient(from 180deg, #d9dde7 0 54deg, #f39b22 54deg 122deg, #d9dde7 122deg 180deg);
}

.alignment-gauge__arc::after {
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 0;
  height: 42px;
  border-radius: 90px 90px 0 0;
  background: #fff;
}

.alignment-gauge__needle {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 3px;
  height: 48px;
  background: #1f2940;
  transform-origin: bottom center;
  transform: translateX(-50%) rotate(28deg);
  border-radius: 999px;
  z-index: 1;
}

.alignment-gauge__needle::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1f2940;
  transform: translateX(-50%);
}

.alignment-gauge__scale {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  color: #9aa4b7;
  font-size: 0.66rem;
}

.panel--alignment button,
.confidence-list + button,
.reviewer-table__footer-link {
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5662f1;
  font-weight: 700;
}

.disagreement-card {
  margin-top: 14px;
}

.disagreement-card__head,
.discussion-grid__head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.disagreement-card__head span,
.discussion-grid__head span {
  display: inline-flex;
  align-items: center;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  background: #fff1e3;
  color: #f3921f;
  font-size: 0.66rem;
  font-weight: 800;
}

.disagreement-card__versus {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  margin-top: 14px;
}

.disagreement-card__versus article {
  padding: 12px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
}

.disagreement-card__reviewer {
  gap: 10px;
}

.disagreement-card__reviewer span,
.reviewer-table__identity span {
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

.disagreement-card__reviewer small {
  display: block;
  margin-top: 2px;
  color: #5662f1;
  font-size: 0.7rem;
  font-weight: 700;
}

.disagreement-card__versus p {
  margin-top: 10px;
  font-size: 0.79rem;
  line-height: 1.5;
}

.disagreement-card__footer {
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf2f8;
  flex-wrap: wrap;
}

.disagreement-card__footer span {
  color: #5662f1;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.disagreement-card__footer small {
  color: #7a879a;
}

.confidence-list {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.confidence-list article {
  display: grid;
  grid-template-columns: 112px 64px 54px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.confidence-list article strong:first-child {
  color: #1f2940;
  font-size: 0.8rem;
}

.confidence-list__bars {
  display: flex;
  gap: 4px;
}

.confidence-list__bars i {
  width: 9px;
  height: 4px;
  border-radius: 999px;
  background: #dde4ee;
}

.confidence-list__bars i.is-filled.is-green {
  background: #19b66b;
}

.confidence-list__bars i.is-filled.is-orange {
  background: #f3921f;
}

.confidence-list__bars i.is-filled.is-amber {
  background: #ffb145;
}

.confidence-list span {
  font-size: 0.77rem;
  font-weight: 700;
}

.confidence-list span.is-green {
  color: #19b66b;
}

.confidence-list span.is-orange {
  color: #f3921f;
}

.confidence-list span.is-amber {
  color: #ff9f2d;
}

.confidence-list small {
  font-size: 0.76rem;
  line-height: 1.45;
}

.recommended-action-card {
  margin-top: 14px;
}

.recommended-action-card small {
  display: block;
  color: #19b66b;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.recommended-action-card strong {
  display: block;
  margin-top: 8px;
  color: #178a54;
  font-size: 1.2rem;
  line-height: 1.35;
}

.recommended-action-card p {
  margin-top: 10px;
  line-height: 1.55;
}

.recommended-action-card__meta {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.recommended-action-card__meta article {
  display: grid;
  gap: 4px;
}

.recommended-action-card__meta span {
  color: #9aa4b7;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.recommended-action-card__meta strong {
  margin-top: 0;
  color: #1f2940;
  font-size: 0.82rem;
}

.recommended-action-card button {
  width: 100%;
  height: 40px;
  margin-top: 16px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #17a75f 0%, #138f53 100%);
  color: #fff;
  font-weight: 700;
}

.score-calibration-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 18px;
}

.discussion-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.discussion-grid article {
  padding: 14px;
  border: 1px solid #edf2f8;
  border-radius: 12px;
  background: #fbfcff;
}

.discussion-grid__head strong {
  color: #1f2940;
}

.discussion-grid__head span.is-red {
  background: #ffe9e9;
  color: #ef5350;
}

.discussion-grid__head span.is-amber {
  background: #fff1e3;
  color: #f3921f;
}

.discussion-grid__head span.is-blue {
  background: #edf1ff;
  color: #5662f1;
}

.discussion-grid p {
  margin-top: 10px;
  font-size: 0.8rem;
  line-height: 1.55;
}

.discussion-grid button {
  margin-top: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5662f1;
  font-weight: 700;
}

.discussion-footer {
  gap: 8px;
  margin-top: 16px;
  color: #7a879a;
  font-size: 0.78rem;
}

.reviewer-table {
  margin-top: 14px;
}

.reviewer-table__head,
.reviewer-table__row {
  display: grid;
  grid-template-columns: 1.25fr 0.62fr 0.5fr 0.55fr 0.7fr;
  gap: 12px;
  align-items: center;
}

.reviewer-table__head {
  padding-bottom: 10px;
}

.reviewer-table__row {
  padding: 14px 0;
  border-top: 1px solid #edf2f8;
}

.reviewer-table__identity {
  gap: 10px;
}

.reviewer-table__identity strong,
.reviewer-table__score {
  color: #1f2940;
}

.reviewer-table__identity small {
  display: block;
  margin-top: 3px;
  font-size: 0.74rem;
}

.reviewer-table strong.is-green {
  color: #18b96a;
}

.reviewer-table strong.is-red {
  color: #ef5350;
}

.reviewer-table__dots {
  display: flex;
  gap: 4px;
}

.reviewer-table__dots i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dde4ee;
}

.reviewer-table__dots i.is-filled.is-green {
  background: #18b96a;
}

.reviewer-table__dots i.is-filled.is-red {
  background: #ef5350;
}

.score-calibration-modal__footer {
  padding: 14px 22px;
  border-top: 1px solid #e7edf6;
}

.score-calibration-modal__footer p {
  gap: 8px;
  font-size: 0.8rem;
}

.score-calibration-modal__footer p :deep(svg) {
  color: #94a0b4;
}

.score-calibration-modal__footer-actions {
  display: flex;
  gap: 10px;
}

.score-calibration-modal__footer-actions button {
  gap: 8px;
  padding: 0 16px;
}

.score-calibration-modal__footer-actions button.is-primary {
  border: 0;
  background: linear-gradient(90deg, #5c57ef 0%, #4b46d7 100%);
  color: #fff;
}

@media (max-width: 1360px) {
  .top-details-grid,
  .score-calibration-bottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1180px) {
  .score-calibration-top,
  .top-metrics-grid {
    grid-template-columns: 1fr;
  }

  .discussion-grid {
    grid-template-columns: 1fr;
  }

  .reviewer-table {
    overflow-x: auto;
  }

  .reviewer-table__head,
  .reviewer-table__row {
    min-width: 760px;
  }
}

@media (max-width: 720px) {
  .score-calibration-overlay {
    padding: 10px;
  }

  .score-calibration-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .score-calibration-modal__header,
  .score-calibration-modal__body,
  .score-calibration-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .score-calibration-modal__header,
  .score-calibration-modal__footer {
    display: grid;
    gap: 12px;
  }

  .score-calibration-modal__header-actions,
  .score-calibration-modal__footer-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .alignment-panel,
  .disagreement-card__versus {
    grid-template-columns: 1fr;
  }

  .confidence-list article {
    grid-template-columns: 1fr;
  }
}
</style>
