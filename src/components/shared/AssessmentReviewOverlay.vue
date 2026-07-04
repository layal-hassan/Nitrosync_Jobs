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
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'In Assessment',
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

const summaryMetrics = [
  { label: 'Completed competencies', value: '3 of 3' },
  { label: 'Evidence count', value: '5 of 6' },
  { label: 'AI confidence', value: '89%' },
]

const recommendationStrengths = [
  'UX design vision',
  'Product thinking',
  'Communication',
]

const recommendationWatchAreas = [
  'Leadership',
  'Strategic influence',
]

const confidenceSignals = [
  { icon: 'document', label: 'Evidence Coverage', value: '5 of 6' },
  { icon: 'clipboard-check', label: 'Assessments Completed', value: '3 of 3' },
  { icon: 'alert', label: 'Missing Evidence', value: 'Leadership' },
]

const featuredAssessment = {
  title: 'Frontend Coding Assessment',
  vendor: 'HackerRank',
  score: '91%',
  percentile: 'Top 1%',
  action: 'Open in HackerRank',
  summary: [
    'Excellent React implementation and clean component structure.',
    'Strong JavaScript fundamentals and async reasoning.',
    'One lower-confidence edge case around input validation.',
  ],
  skills: [
    { label: 'JavaScript', value: 95, tone: 'green' },
    { label: 'React', value: 92, tone: 'violet' },
    { label: 'Problem Solving', value: 80, tone: 'pink' },
    { label: 'Code Quality', value: 85, tone: 'orange' },
    { label: 'Testing', value: 65, tone: 'amber' },
  ],
  details: [
    ['Questions', '4'],
    ['Max time', '45 min'],
    ['Time taken', '32 min'],
    ['Difficulty', 'Medium - Hard'],
    ['Language used', 'JavaScript'],
  ],
  questions: [
    {
      title: 'Build a Todo API',
      badge: 'Easy',
      score: '10/10',
      duration: '18 min',
      answer: [
        'Uses a clear REST shape for creating and listing todos.',
        'Validation is handled early and response objects are consistent.',
      ],
      evaluation: [
        'Correct approach',
        'Optimal time complexity',
        'Clean implementation',
      ],
    },
    {
      title: 'Optimize Search',
      badge: 'Medium',
      score: '8/10',
      duration: '22 min',
      answer: [
        'Good use of a map for lookup caching and repeated searches.',
        'One missing edge case when the query string is empty.',
      ],
      evaluation: [
        'Correct approach',
        'Good data structure choice',
        'Missing edge case handling',
      ],
    },
  ],
}

const compactAssessments = [
  {
    title: 'Portfolio Review',
    vendor: 'Internal',
    score: '88%',
    percentile: 'Top 15%',
    status: 'Completed',
    tone: 'green',
  },
  {
    title: 'Communication Assessment',
    vendor: 'SHL',
    score: '85%',
    percentile: 'Top 25%',
    status: 'Completed',
    tone: 'violet',
  },
]

const quickActions = [
  { icon: 'compare', label: 'Compare Candidate' },
  { icon: 'document', label: 'Download PDF Report' },
  { icon: 'share', label: 'Share Assessment Summary' },
  { icon: 'message', label: 'Request Feedback' },
  { icon: 'plus', label: 'Add Note' },
]

const activityItems = [
  {
    title: 'Coding assessment completed',
    meta: '95 score, 91%',
    time: '1:44 PM Jul 2026',
    tone: 'green',
  },
  {
    title: 'Portfolio review completed',
    meta: 'By Erin Vale',
    time: '11:47 AM Jul 2026',
    tone: 'violet',
  },
  {
    title: 'Communication assessment completed',
    meta: 'By SHL sync',
    time: '10:05 AM Jul 2026',
    tone: 'pink',
  },
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
    <div v-if="open" class="assessment-review-overlay" @click.self="closeOverlay">
      <section class="assessment-review-modal">
        <header class="assessment-review-modal__header">
          <div class="assessment-review-modal__title">
            <div>
              <h2>Assessment Review</h2>
              <p>Comprehensive view of all assessments and hiring evidence.</p>
            </div>
          </div>

          <div class="assessment-review-modal__header-actions">
            <button class="is-primary" type="button">Move to Validation</button>
            <button type="button">Assign Assessment +</button>
            <button class="assessment-review-modal__close" type="button" aria-label="Close assessment review" @click="closeOverlay">
              <AppIcon name="more" :size="18" />
            </button>
          </div>
        </header>

        <div class="assessment-review-modal__body">
          <section class="assessment-review-main">
            <section class="assessment-review-candidate">
              <div class="assessment-review-candidate__card">
                <span class="assessment-review-candidate__avatar">{{ candidateInitials }}</span>

                <div class="assessment-review-candidate__copy">
                  <div class="assessment-review-candidate__name">
                    <h3>{{ candidateName }}</h3>
                    <span>{{ candidateStage }}</span>
                  </div>

                  <p>{{ candidateRole }}</p>

                  <div class="assessment-review-candidate__meta">
                    <span><AppIcon name="mapPin" :size="14" /> New York, USA</span>
                    <span><AppIcon name="briefcase" :size="14" /> Applied on 10 May 2026</span>
                  </div>

                  <div class="assessment-review-candidate__stats">
                    <article v-for="metric in summaryMetrics" :key="metric.label">
                      <small>{{ metric.label }}</small>
                      <strong>{{ metric.value }}</strong>
                    </article>
                  </div>
                </div>
              </div>
            </section>

            <section class="assessment-review-grid">
              <article class="assessment-review-panel assessment-review-panel--highlight">
                <header class="assessment-review-panel__header">
                  <div class="assessment-review-recommendation__title">
                    <span class="assessment-review-recommendation__icon">
                      <AppIcon name="spark" :size="16" />
                    </span>
                    <div>
                      <div class="assessment-review-recommendation__heading">
                        <h4>AI Hiring Recommendation</h4>
                        <em>Proceed to Validation</em>
                      </div>
                      <p>
                        Sarah demonstrates strong technical and product thinking skills with good communication.
                        Leadership evidence is limited and should be validated in the final interview.
                      </p>
                    </div>
                  </div>

                </header>

                <div class="assessment-review-recommendation">
                  <div>
                    <small>Strengths</small>
                    <ul>
                      <li v-for="item in recommendationStrengths" :key="item"><i class="tone-green" />{{ item }}</li>
                    </ul>
                  </div>

                  <div>
                    <small>Watch areas</small>
                    <ul>
                      <li v-for="item in recommendationWatchAreas" :key="item"><i class="tone-orange" />{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </article>
            </section>

            <section class="assessment-review-panel assessment-review-panel--assessments">
              <header class="assessment-review-panel__header">
                <div>
                  <h4>Completed Assessments</h4>
                  <p>Review completion status and outcomes.</p>
                </div>

                <div class="assessment-review-panel__actions">
                  <button type="button">Export all</button>
                  <button type="button">Collapse all</button>
                </div>
              </header>

              <article class="assessment-review-featured">
                <header class="assessment-review-featured__header">
                  <div class="assessment-review-featured__title">
                    <span class="assessment-review-featured__logo">H</span>
                    <div>
                      <div class="assessment-review-featured__title-row">
                        <h5>{{ featuredAssessment.title }}</h5>
                        <em>{{ featuredAssessment.vendor }}</em>
                      </div>
                      <p>Completed today</p>
                    </div>
                  </div>

                  <div class="assessment-review-featured__score">
                    <div>
                      <strong>{{ featuredAssessment.score }}</strong>
                      <small>{{ featuredAssessment.percentile }}</small>
                    </div>
                    <button type="button">{{ featuredAssessment.action }}</button>
                  </div>
                </header>

                <div class="assessment-review-featured__grid">
                  <section class="assessment-review-block">
                    <h6>AI Summary</h6>
                    <ul class="assessment-review-bullet-list">
                      <li v-for="item in featuredAssessment.summary" :key="item">{{ item }}</li>
                    </ul>
                  </section>

                  <section class="assessment-review-block">
                    <h6>Skill Breakdown</h6>
                    <div class="assessment-review-skill-list">
                      <article v-for="skill in featuredAssessment.skills" :key="skill.label">
                        <div>
                          <strong>{{ skill.label }}</strong>
                          <span>{{ skill.value }}%</span>
                        </div>
                        <div class="assessment-review-skill-bar">
                          <span :class="`tone-${skill.tone}`" :style="{ width: `${skill.value}%` }" />
                        </div>
                      </article>
                    </div>
                  </section>

                  <section class="assessment-review-block">
                    <h6>Assessment Details</h6>
                    <dl class="assessment-review-definition-list">
                      <div v-for="[label, value] in featuredAssessment.details" :key="label">
                        <dt>{{ label }}</dt>
                        <dd>{{ value }}</dd>
                      </div>
                    </dl>
                  </section>
                </div>

                <section class="assessment-review-questions">
                  <h6>Questions</h6>

                  <article v-for="question in featuredAssessment.questions" :key="question.title" class="assessment-review-question">
                    <header class="assessment-review-question__header">
                      <div>
                        <div class="assessment-review-question__title-row">
                          <strong>{{ question.title }}</strong>
                          <span>{{ question.badge }}</span>
                        </div>
                        <small>{{ question.score }} - {{ question.duration }}</small>
                      </div>
                      <button type="button">View answer</button>
                    </header>

                    <div class="assessment-review-question__body">
                      <div class="assessment-review-question__answer">
                        <p v-for="line in question.answer" :key="line">{{ line }}</p>
                      </div>

                      <div class="assessment-review-question__evaluation">
                        <small>AI Evaluation</small>
                        <ul>
                          <li v-for="point in question.evaluation" :key="point">{{ point }}</li>
                        </ul>
                      </div>
                    </div>
                  </article>
                </section>
              </article>

              <div class="assessment-review-compact-list">
                <article v-for="assessment in compactAssessments" :key="assessment.title" class="assessment-review-compact-card">
                  <div class="assessment-review-compact-card__title">
                    <span :class="`tone-${assessment.tone}`" />
                    <div>
                      <strong>{{ assessment.title }}</strong>
                      <small>{{ assessment.vendor }}</small>
                    </div>
                  </div>

                  <div class="assessment-review-compact-card__meta">
                    <div>
                      <strong>{{ assessment.score }}</strong>
                      <small>{{ assessment.percentile }}</small>
                    </div>
                    <em>{{ assessment.status }}</em>
                  </div>
                </article>
              </div>
            </section>
          </section>

          <aside class="assessment-review-side">
            <section class="assessment-review-sidebar-card">
              <h4>Hiring Confidence Summary</h4>

              <div class="assessment-review-gauge" style="--progress: 89%">
                <strong>89%</strong>
                <span>1% above last update</span>
              </div>

              <ul>
                <li v-for="signal in confidenceSignals" :key="signal.label">
                  <span class="assessment-review-sidebar-card__signal-icon">
                    <AppIcon :name="signal.icon" :size="14" />
                  </span>
                  <div>
                    <small>{{ signal.label }}</small>
                    <strong>{{ signal.value }}</strong>
                  </div>
                </li>
              </ul>

              <button type="button">View missing evidence</button>
            </section>

            <section class="assessment-review-side__section">
              <h4>Quick Actions</h4>
              <ul class="assessment-review-side__actions">
                <li v-for="action in quickActions" :key="action.label">
                  <button type="button">
                    <AppIcon :name="action.icon" :size="15" />
                    <span>{{ action.label }}</span>
                  </button>
                </li>
              </ul>
            </section>

            <section class="assessment-review-side__section assessment-review-side__section--insight">
              <small>AI Insight</small>
              <p>Adding a leadership assessment or validating leadership in the final interview can increase confidence to 96%.</p>
              <button type="button">Improve Hiring Confidence</button>
            </section>

            <section class="assessment-review-side__section">
              <div class="assessment-review-side__section-title">
                <h4>Activity</h4>
                <button type="button">View all</button>
              </div>

              <ul class="assessment-review-activity">
                <li v-for="item in activityItems" :key="item.title">
                  <span class="assessment-review-activity__dot" :class="`tone-${item.tone}`" />
                  <div>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.meta }}</small>
                    <span>{{ item.time }}</span>
                  </div>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.assessment-review-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(18, 26, 41, 0.16);
  backdrop-filter: blur(10px);
}

.assessment-review-modal {
  width: min(1280px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  overflow: auto;
  border: 1px solid #e8edf8;
  border-radius: 28px;
  background: #fcfdff;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.14);
}

.assessment-review-modal__header,
.assessment-review-modal__body {
  padding-left: 28px;
  padding-right: 28px;
}

.assessment-review-modal__header,
.assessment-review-modal__header-actions,
.assessment-review-candidate__card,
.assessment-review-candidate__name,
.assessment-review-candidate__meta,
.assessment-review-candidate__stats,
.assessment-review-panel__header,
.assessment-review-panel__actions,
.assessment-review-recommendation,
.assessment-review-recommendation__title,
.assessment-review-featured__header,
.assessment-review-featured__title,
.assessment-review-featured__title-row,
.assessment-review-featured__score,
.assessment-review-skill-list article > div,
.assessment-review-compact-card,
.assessment-review-compact-card__title,
.assessment-review-compact-card__meta,
.assessment-review-side__section-title,
.assessment-review-side__actions button,
.assessment-review-question__header,
.assessment-review-question__title-row,
.assessment-review-question__body,
.assessment-review-activity li {
  display: flex;
}

.assessment-review-modal__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf1f8;
}

.assessment-review-modal__title h2,
.assessment-review-candidate__name h3,
.assessment-review-panel__header h4,
.assessment-review-sidebar-card h4,
.assessment-review-featured__title h5,
.assessment-review-side__section h4 {
  margin: 0;
  color: #1d2f5f;
  font-weight: 800;
}

.assessment-review-modal__title h2 {
  font-size: 1rem;
}

.assessment-review-modal__title p,
.assessment-review-candidate__copy > p,
.assessment-review-panel__header p,
.assessment-review-featured__title p,
.assessment-review-side__section p,
.assessment-review-sidebar-card > button + p {
  margin: 2px 0 0;
  color: #8b98b5;
}

.assessment-review-modal__header-actions {
  align-items: center;
  gap: 10px;
}

.assessment-review-modal__header-actions button,
.assessment-review-panel__header button,
.assessment-review-featured__score button,
.assessment-review-question__header button,
.assessment-review-sidebar-card > button,
.assessment-review-side__section button {
  border: 1px solid #dfe6f3;
  border-radius: 12px;
  background: #fff;
  color: #5a67d8;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.assessment-review-modal__header-actions > button:not(.assessment-review-modal__close) {
  min-height: 34px;
  padding: 0 14px;
  font-size: 0.78rem;
}

.assessment-review-modal__header-actions > button.is-primary {
  border: 0;
  background: linear-gradient(135deg, #ff7bc3 0%, #eb63af 100%);
  color: #fff;
}

.assessment-review-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #94a0b8;
}

.assessment-review-modal__body {
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) 300px;
  gap: 18px;
  padding-top: 18px;
  padding-bottom: 24px;
}

.assessment-review-main,
.assessment-review-side,
.assessment-review-candidate,
.assessment-review-compact-list,
.assessment-review-side__actions,
.assessment-review-activity,
.assessment-review-skill-list,
.assessment-review-questions {
  display: grid;
  gap: 16px;
}

.assessment-review-candidate__card,
.assessment-review-panel,
.assessment-review-sidebar-card,
.assessment-review-side__section,
.assessment-review-question,
.assessment-review-compact-card {
  border: 1px solid #e5ebf6;
  border-radius: 18px;
  background: #fff;
}

.assessment-review-candidate__card {
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

.assessment-review-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.85), transparent 38%),
    linear-gradient(135deg, #ffddd0 0%, #f0f4ff 42%, #d8f0e5 100%);
  color: #1d2f5f;
  font-size: 1rem;
  font-weight: 800;
  flex: 0 0 56px;
}

.assessment-review-candidate__copy {
  flex: 1;
  min-width: 0;
}

.assessment-review-candidate__name {
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.assessment-review-candidate__name span {
  padding: 3px 8px;
  border-radius: 999px;
  background: #e8f9ef;
  color: #24a35a;
  font-size: 0.66rem;
  font-weight: 700;
}

.assessment-review-candidate__copy > p {
  margin-top: 3px;
  font-size: 0.82rem;
}

.assessment-review-candidate__meta {
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
  color: #8b98b5;
  font-size: 0.74rem;
}

.assessment-review-candidate__meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.assessment-review-candidate__stats {
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.assessment-review-candidate__stats article small,
.assessment-review-recommendation small,
.assessment-review-block h6,
.assessment-review-sidebar-card li small,
.assessment-review-side__section small,
.assessment-review-question__evaluation small {
  display: block;
  color: #93a0ba;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.assessment-review-candidate__stats article strong {
  display: block;
  margin-top: 3px;
  color: #1d2f5f;
  font-size: 0.82rem;
}

.assessment-review-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.assessment-review-panel,
.assessment-review-sidebar-card,
.assessment-review-side__section {
  padding: 16px;
}

.assessment-review-panel--highlight {
  background:
    linear-gradient(180deg, #fff8fc 0%, #ffffff 38%);
}

.assessment-review-panel__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.assessment-review-panel__header p {
  margin-top: 4px;
  font-size: 0.82rem;
}

.assessment-review-panel__actions {
  gap: 8px;
}

.assessment-review-panel__actions button,
.assessment-review-featured__score button,
.assessment-review-question__header button,
.assessment-review-sidebar-card > button {
  min-height: 32px;
  padding: 0 12px;
  font-size: 0.76rem;
}

.assessment-review-recommendation__title {
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.assessment-review-recommendation__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff8fcf 0%, #f26db8 100%);
  color: #fff;
  flex: 0 0 28px;
}

.assessment-review-recommendation__heading {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.assessment-review-recommendation__heading em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #eaf8ef;
  color: #249c5b;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 700;
}

.assessment-review-gauge {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.assessment-review-gauge strong {
  display: block;
  color: #1d2f5f;
  line-height: 1;
}

.assessment-review-recommendation {
  gap: 24px;
  margin-top: 18px;
}

.assessment-review-recommendation > div {
  flex: 1;
}

.assessment-review-recommendation ul,
.assessment-review-bullet-list,
.assessment-review-question__evaluation ul,
.assessment-review-sidebar-card ul,
.assessment-review-activity,
.assessment-review-side__actions {
  margin: 0;
  padding: 0;
  list-style: none;
}

.assessment-review-recommendation li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  color: #435271;
  font-size: 0.82rem;
}

.assessment-review-recommendation i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: 0 0 7px;
}

.assessment-review-sidebar-card h4 {
  font-size: 0.92rem;
}

.assessment-review-gauge {
  width: 154px;
  height: 92px;
  margin: 10px auto 0;
  padding-top: 18px;
  border-radius: 154px 154px 0 0;
}

.assessment-review-gauge::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    conic-gradient(
      from 180deg at 50% 100%,
      #dfe8f4 0deg 16deg,
      #35c56d 16deg 48deg,
      #ffffff 48deg 56deg,
      #35c56d 56deg 88deg,
      #ffffff 88deg 96deg,
      #35c56d 96deg 128deg,
      #ffffff 128deg 136deg,
      #35c56d 136deg 158deg,
      #dfe8f4 158deg 180deg
    );
  -webkit-mask: radial-gradient(circle at 50% 100%, transparent 0 58%, #000 59% 72%, transparent 73%);
  mask: radial-gradient(circle at 50% 100%, transparent 0 58%, #000 59% 72%, transparent 73%);
}

.assessment-review-gauge::after {
  content: '';
  position: absolute;
  left: 22px;
  right: 22px;
  top: 30px;
  bottom: 0;
  border-radius: 100px 100px 0 0;
  background: #fff;
}

.assessment-review-gauge strong,
.assessment-review-gauge span {
  position: relative;
  z-index: 1;
}

.assessment-review-gauge strong {
  position: relative;
  z-index: 1;
  font-size: 1.04rem;
}

.assessment-review-gauge span {
  position: relative;
  z-index: 1;
  margin-top: 6px;
  color: #24a35a;
  font-size: 0.64rem;
  font-weight: 700;
}

.assessment-review-sidebar-card ul {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.assessment-review-sidebar-card li {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
}

.assessment-review-sidebar-card__signal-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #f5f7fc;
  color: #8090ad;
}

.assessment-review-sidebar-card li strong {
  display: block;
  margin-top: 3px;
  color: #1d2f5f;
}

.assessment-review-sidebar-card > button {
  width: 100%;
  margin-top: 14px;
}

.assessment-review-panel--assessments {
  gap: 16px;
}

.assessment-review-featured {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ebf0f8;
  border-radius: 18px;
  background: #fff;
}

.assessment-review-featured__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.assessment-review-featured__title {
  align-items: center;
  gap: 12px;
}

.assessment-review-featured__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #19233f;
  color: #fff;
  font-weight: 800;
  flex: 0 0 34px;
}

.assessment-review-featured__title-row {
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.assessment-review-featured__title em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #eef2ff;
  color: #5865f2;
  font-size: 0.62rem;
  font-style: normal;
  font-weight: 700;
}

.assessment-review-featured__title p {
  margin-top: 3px;
  font-size: 0.76rem;
}

.assessment-review-featured__score {
  align-items: center;
  gap: 12px;
}

.assessment-review-featured__score strong,
.assessment-review-compact-card__meta strong {
  display: block;
  color: #1d2f5f;
  font-size: 1rem;
}

.assessment-review-featured__score small,
.assessment-review-compact-card__meta small {
  display: block;
  margin-top: 3px;
  color: #5865f2;
  font-size: 0.68rem;
  font-weight: 700;
}

.assessment-review-featured__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.assessment-review-block {
  padding: 14px;
  border-radius: 14px;
  background: #fbfcff;
}

.assessment-review-block h6,
.assessment-review-questions h6 {
  margin: 0 0 12px;
  color: #1d2f5f;
  font-size: 0.76rem;
}

.assessment-review-bullet-list {
  display: grid;
  gap: 8px;
}

.assessment-review-bullet-list li {
  position: relative;
  padding-left: 14px;
  color: #4b5a76;
  font-size: 0.78rem;
  line-height: 1.5;
}

.assessment-review-bullet-list li::before,
.assessment-review-question__evaluation li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.48rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #31c36b;
}

.assessment-review-skill-list {
  gap: 10px;
}

.assessment-review-skill-list article > div {
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
}

.assessment-review-skill-list strong,
.assessment-review-question__header strong {
  color: #1d2f5f;
  font-size: 0.78rem;
}

.assessment-review-skill-list span {
  color: #7e8ca8;
  font-size: 0.74rem;
  font-weight: 700;
}

.assessment-review-skill-bar {
  height: 6px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.assessment-review-skill-bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.assessment-review-definition-list {
  display: grid;
  gap: 8px;
  margin: 0;
}

.assessment-review-definition-list div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.assessment-review-definition-list dt,
.assessment-review-definition-list dd {
  margin: 0;
  font-size: 0.76rem;
}

.assessment-review-definition-list dt {
  color: #8b98b5;
}

.assessment-review-definition-list dd {
  color: #1d2f5f;
  font-weight: 700;
}

.assessment-review-questions {
  margin-top: 16px;
}

.assessment-review-question {
  padding: 14px;
}

.assessment-review-question__header {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.assessment-review-question__title-row {
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.assessment-review-question__title-row span {
  padding: 2px 7px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #259859;
  font-size: 0.62rem;
  font-weight: 700;
}

.assessment-review-question__header small {
  display: block;
  margin-top: 4px;
  color: #8b98b5;
  font-size: 0.72rem;
}

.assessment-review-question__body {
  gap: 16px;
  margin-top: 14px;
}

.assessment-review-question__answer,
.assessment-review-question__evaluation {
  flex: 1;
}

.assessment-review-question__answer {
  padding: 12px;
  border-radius: 12px;
  background: #1f2940;
}

.assessment-review-question__answer p {
  margin: 0;
  color: #d7e0f0;
  font-size: 0.74rem;
  line-height: 1.6;
}

.assessment-review-question__answer p + p {
  margin-top: 8px;
}

.assessment-review-question__evaluation ul {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.assessment-review-question__evaluation li {
  position: relative;
  padding-left: 14px;
  color: #4b5a76;
  font-size: 0.76rem;
}

.assessment-review-compact-card {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}

.assessment-review-compact-card__title,
.assessment-review-compact-card__meta {
  align-items: center;
  gap: 10px;
}

.assessment-review-compact-card__title > span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: 0 0 10px;
}

.assessment-review-compact-card__title small {
  display: block;
  margin-top: 3px;
  color: #8b98b5;
  font-size: 0.72rem;
}

.assessment-review-compact-card__meta {
  gap: 16px;
}

.assessment-review-compact-card__meta em {
  color: #24a35a;
  font-size: 0.74rem;
  font-style: normal;
  font-weight: 700;
}

.assessment-review-side {
  align-content: start;
}

.assessment-review-side__section h4 {
  font-size: 0.92rem;
}

.assessment-review-side__actions {
  gap: 8px;
  margin-top: 12px;
}

.assessment-review-side__actions button {
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 36px;
  padding: 0 12px;
  color: #55627f;
  text-align: left;
}

.assessment-review-side__section--insight {
  background: linear-gradient(180deg, #faf8ff 0%, #ffffff 100%);
}

.assessment-review-side__section--insight p {
  margin-top: 10px;
  font-size: 0.78rem;
  line-height: 1.6;
}

.assessment-review-side__section--insight button {
  width: 100%;
  min-height: 34px;
  margin-top: 12px;
  color: #7a63f2;
}

.assessment-review-side__section-title {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.assessment-review-side__section-title button {
  min-height: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7a63f2;
  font-size: 0.74rem;
}

.assessment-review-activity {
  gap: 14px;
  margin-top: 14px;
}

.assessment-review-activity li {
  align-items: flex-start;
  gap: 10px;
}

.assessment-review-activity__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex: 0 0 10px;
}

.assessment-review-activity strong {
  display: block;
  color: #1d2f5f;
  font-size: 0.8rem;
}

.assessment-review-activity small {
  display: block;
  margin-top: 3px;
  color: #7a63f2;
  font-size: 0.72rem;
}

.assessment-review-activity span {
  display: block;
  margin-top: 3px;
  color: #93a0ba;
  font-size: 0.72rem;
}

.tone-green {
  background: #31c36b;
  color: #31c36b;
}

.tone-orange {
  background: #ff9c47;
  color: #ff9c47;
}

.tone-violet {
  background: #7a63f2;
  color: #7a63f2;
}

.tone-pink {
  background: #ef6bb2;
  color: #ef6bb2;
}

.tone-amber {
  background: #ffb057;
  color: #ffb057;
}

@media (max-width: 1180px) {
  .assessment-review-modal__body,
  .assessment-review-grid,
  .assessment-review-featured__grid {
    grid-template-columns: 1fr;
  }

  .assessment-review-side {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .assessment-review-side {
    grid-template-columns: 1fr;
  }

  .assessment-review-question__body,
  .assessment-review-featured__header,
  .assessment-review-featured__score,
  .assessment-review-compact-card {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 760px) {
  .assessment-review-overlay {
    padding: 12px;
  }

  .assessment-review-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
  }

  .assessment-review-modal__header,
  .assessment-review-modal__body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .assessment-review-modal__header,
  .assessment-review-modal__header-actions,
  .assessment-review-candidate__card,
  .assessment-review-recommendation,
  .assessment-review-panel__header,
  .assessment-review-panel__actions,
  .assessment-review-question__header {
    flex-direction: column;
    align-items: stretch;
  }

  .assessment-review-candidate__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
