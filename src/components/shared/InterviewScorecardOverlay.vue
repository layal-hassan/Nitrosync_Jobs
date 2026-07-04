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
})

const emit = defineEmits(['close'])

const activeTab = ref('questions')

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const rounds = [
  { id: 1, title: 'Recruiter Screen', status: 'Completed', meta: '', tone: 'done' },
  { id: 2, title: 'Technical Interview', status: 'Completed', meta: '', tone: 'done' },
  { id: 3, title: 'Hiring Manager Interview', status: 'Scheduled', meta: 'May 16, 2:00 PM', tone: 'active' },
  { id: 4, title: 'Final Interview', status: 'Not Started', meta: '', tone: 'idle' },
]

const focusAreas = ['Leadership', 'Communication', 'Team Management']

const weightedCompetencies = [
  ['Leadership', '20%'],
  ['Communication', '20%'],
  ['People Management', '20%'],
  ['Problem Solving', '20%'],
  ['Strategic Thinking', '10%'],
  ['Cultural Alignment', '10%'],
]

const questions = []

const emptyScorecardBenefits = [
  {
    title: 'Build effective interviews',
    note: 'Add role-specific questions aligned to competencies and evaluation criteria.',
    icon: 'document',
    tone: 'green',
  },
  {
    title: 'Ensure consistency',
    note: 'Standardize evaluation criteria and weights for fair and objective assessments.',
    icon: 'spark',
    tone: 'violet',
  },
  {
    title: 'Save time with AI',
    note: 'Generate relevant questions and criteria in seconds using AI.',
    icon: 'sparkles',
    tone: 'blue',
  },
]

const rubricRows = [
  ['Leadership', '20%', '7 Questions', '1-5 scale'],
  ['Communication', '20%', '5 Questions', '1-5 scale'],
  ['People Management', '20%', '4 Questions', '1-5 scale'],
  ['Problem Solving', '20%', '3 Questions', '1-5 scale'],
  ['Strategic Thinking', '10%', '3 Questions', '1-5 scale'],
  ['Cultural Alignment', '10%', '2 Questions', '1-5 scale'],
]

const skillsSummary = [
  { label: 'Product Thinking', value: 92, tone: 'violet' },
  { label: 'UX Research', value: 86, tone: 'blue' },
  { label: 'Stakeholder Alignment', value: 78, tone: 'green' },
  { label: 'Design Systems', value: 88, tone: 'pink' },
]

const skillCards = [
  {
    title: 'Leadership Communication',
    tone: 'pink',
    coverage: 'Strong Signal',
    note: 'Questions Q1, Q2 and Q6 collectively validate communication under pressure.',
    chips: ['Q1', 'Q2', 'Q6'],
  },
  {
    title: 'Team Motivation',
    tone: 'green',
    coverage: 'Well Covered',
    note: 'Behavioral prompts cover coaching, conflict resolution and morale building.',
    chips: ['Q2', 'Q3', 'Q4'],
  },
  {
    title: 'Strategic Prioritization',
    tone: 'violet',
    coverage: 'Moderate',
    note: 'Current coverage is solid, but only one scenario is deeply strategy-oriented.',
    chips: ['Q4', 'Q5'],
  },
  {
    title: 'Culture Contribution',
    tone: 'amber',
    coverage: 'Needs More Depth',
    note: 'Only one question directly explores motivation and long-term environment fit.',
    chips: ['Q7'],
  },
]

const competencyCards = [
  {
    title: 'Leadership',
    score: '20%',
    status: 'Core Competency',
    tone: 'pink',
    points: ['Decision making', 'Conflict handling', 'Team influence'],
  },
  {
    title: 'Communication',
    score: '20%',
    status: 'Core Competency',
    tone: 'blue',
    points: ['Stakeholder clarity', 'Cross-team alignment', 'Escalation style'],
  },
  {
    title: 'People Management',
    score: '20%',
    status: 'Behavioral Focus',
    tone: 'green',
    points: ['Coaching mindset', 'Motivation style', 'Performance guidance'],
  },
  {
    title: 'Strategic Thinking',
    score: '10%',
    status: 'Support Competency',
    tone: 'violet',
    points: ['Tradeoffs', 'Prioritization', 'Long-term decisions'],
  },
]

const competencyCoverage = [
  { title: 'Well covered', value: '4', note: 'Leadership, Communication, People Management, Problem Solving', tone: 'green' },
  { title: 'Moderate', value: '2', note: 'Strategic Thinking, Cultural Alignment', tone: 'amber' },
  { title: 'Missing', value: '0', note: 'No uncovered required competencies.', tone: 'pink' },
]

const assistantInsights = [
  'Good competency coverage',
  'Interview length looks optimal',
]

const assistantSuggestions = [
  'Add a question on decision making',
  'Add a question on long-term vision',
]

const quickActions = [
  { icon: 'eye', label: 'Preview Interview Kit', tone: '' },
  { icon: 'userPlus', label: 'Assign Backup Interviewer', tone: '' },
  { icon: 'share', label: 'Share with Interviewer', tone: '' },
  { icon: 'copy', label: 'Duplicate Interview', tone: '' },
  { icon: 'trash', label: 'Delete Interview', tone: 'danger' },
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const hasScorecard = computed(() => questions.length > 0)

function closeOverlay() {
  emit('close')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow = document.body.style.overflow
    previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow
  document.documentElement.style.overflow = previousHtmlOverflow
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)
    if (isOpen) {
      activeTab.value = 'questions'
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="scorecard-overlay" @click.self="closeOverlay">
      <section class="scorecard-modal">
        <header class="scorecard-modal__header">
          <div class="scorecard-modal__title">
            <span class="scorecard-modal__title-icon">
              <AppIcon name="calendar" :size="20" />
            </span>
            <div>
              <h2>Interview Scorecard</h2>
              <p>Plan, conduct and evaluate interviews in one place</p>
            </div>
          </div>

          <div class="scorecard-modal__header-actions">
            <button class="scorecard-status-pill" type="button">
              <i />
              <span>Scheduled</span>
              <AppIcon name="chevronDown" :size="14" />
            </button>
            <button type="button">
              <AppIcon name="external-link" :size="15" />
              <span>Interview Kit</span>
            </button>
            <button class="scorecard-modal__icon-button" type="button" aria-label="More actions">
              <AppIcon name="more" :size="18" />
            </button>
            <button class="scorecard-modal__icon-button" type="button" aria-label="Close scorecard" @click="closeOverlay">
              <AppIcon name="close" :size="18" />
            </button>
          </div>
        </header>

        <div class="scorecard-journey">
          <article
            v-for="(round, index) in rounds"
            :key="round.id"
            class="scorecard-journey__step"
            :class="`is-${round.tone}`"
          >
            <div class="scorecard-journey__node">{{ round.id }}</div>
            <div class="scorecard-journey__copy">
              <strong>{{ round.title }}</strong>
              <small>
                {{ round.status }}
                <template v-if="round.meta">- {{ round.meta }}</template>
              </small>
            </div>
            <div v-if="index < rounds.length - 1" class="scorecard-journey__line" />
          </article>
        </div>

        <div class="scorecard-modal__body">
          <aside class="scorecard-sidebar">
            <section class="scorecard-panel">
              <h3>Round Overview</h3>

              <div class="scorecard-sidebar__section">
                <span>Interview Type</span>
                <strong>Hiring Manager Interview</strong>
              </div>

              <div class="scorecard-sidebar__section">
                <span>Interviewer</span>
                <div class="scorecard-interviewer">
                  <span>{{ candidateInitials }}</span>
                  <div>
                    <strong>Jessica Lee</strong>
                    <small>Hiring Manager</small>
                  </div>
                  <button type="button" aria-label="Edit interviewer">
                    <AppIcon name="edit" :size="14" />
                  </button>
                </div>
              </div>

              <div class="scorecard-sidebar__section">
                <span>Duration</span>
                <div class="scorecard-sidebar__inline">
                  <div>
                    <AppIcon name="clock" :size="15" />
                    <strong>60 min</strong>
                  </div>
                  <button type="button" aria-label="Edit duration">
                    <AppIcon name="edit" :size="14" />
                  </button>
                </div>
              </div>

              <div class="scorecard-sidebar__section">
                <span>Focus Areas</span>
                <div class="scorecard-chip-row">
                  <em v-for="item in focusAreas" :key="item">{{ item }}</em>
                </div>
              </div>

              <div class="scorecard-sidebar__section">
                <span>Interview Objectives</span>
                <p>
                  Assess leadership potential, people management skills, and alignment with
                  team culture for {{ props.candidateName }}.
                </p>
              </div>
            </section>

            <section class="scorecard-panel">
              <div class="scorecard-panel__title-row">
                <h3>Competencies &amp; Weights</h3>
                <button type="button">Edit</button>
              </div>

              <ul class="scorecard-weight-list">
                <li v-for="[label, value] in weightedCompetencies" :key="label">
                  <span>{{ label }}</span>
                  <strong>{{ value }}</strong>
                </li>
              </ul>

              <button class="scorecard-manage-button" type="button">
                <AppIcon name="settings" :size="14" />
                <span>Manage Competencies</span>
              </button>
            </section>
          </aside>

          <section class="scorecard-main">
            <div class="scorecard-main__tabs">
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'questions' }"
                @click="activeTab = 'questions'"
              >
                Questions
              </button>
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'rubric' }"
                @click="activeTab = 'rubric'"
              >
                Evaluation Criteria
              </button>
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'skills' }"
                @click="activeTab = 'skills'"
              >
                Skills &amp; Competencies
              </button>
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'guide' }"
                @click="activeTab = 'guide'"
              >
                Interview Guide
              </button>
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'notes' }"
                @click="activeTab = 'notes'"
              >
                Notes
              </button>
              <button
                type="button"
                :class="{ 'is-active': activeTab === 'attachments' }"
                @click="activeTab = 'attachments'"
              >
                Attachments
              </button>
            </div>

            <div v-if="hasScorecard" class="scorecard-main__toolbar">
              <div class="scorecard-main__toolbar-actions">
                <button class="is-primary" type="button">
                  <AppIcon name="plus" :size="15" />
                  <span>Add Question</span>
                </button>
                <button type="button">
                  <AppIcon name="spark" :size="15" />
                  <span>Regenerate with AI</span>
                </button>
              </div>

              <div class="scorecard-main__toolbar-meta">
                <span>Estimated Duration: 60 min</span>
                <button type="button">
                  <AppIcon name="list" :size="15" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>

            <div v-if="!hasScorecard" class="scorecard-empty">
              <div class="scorecard-empty__icon">
                <AppIcon name="clipboard-check" :size="34" />
                <span>
                  <AppIcon name="plus" :size="12" />
                </span>
              </div>

              <h4>No scorecard created yet</h4>
              <p>Create a scorecard to define questions, evaluation criteria, and competencies for this interview.</p>

              <div class="scorecard-empty__benefits">
                <article v-for="item in emptyScorecardBenefits" :key="item.title">
                  <span :class="`tone-${item.tone}`">
                    <AppIcon :name="item.icon" :size="14" />
                  </span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <small>{{ item.note }}</small>
                  </div>
                </article>
              </div>

              <div class="scorecard-empty__actions">
                <button class="is-primary" type="button">
                  <AppIcon name="plus" :size="15" />
                  <span>Create Scorecard</span>
                </button>
                <button type="button">
                  <AppIcon name="spark" :size="15" />
                  <span>Generate with AI</span>
                </button>
              </div>

              <button class="scorecard-empty__link" type="button">
                <AppIcon name="copy" :size="13" />
                <span>Copy from another round</span>
              </button>
            </div>

            <div v-else-if="activeTab === 'questions'" class="scorecard-question-list">
              <article v-for="item in questions" :key="item.id" class="scorecard-question-card">
                <div class="scorecard-question-card__order">
                  <span class="scorecard-question-card__grip">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <strong>{{ item.id }}</strong>
                </div>

                <div class="scorecard-question-card__content">
                  <h4>{{ item.title }}</h4>
                  <p>
                    Competencies: {{ item.competencies }}
                    <em>{{ item.badge }}</em>
                  </p>
                </div>

                <div class="scorecard-question-card__meta">
                  <span>Weight</span>
                  <strong>{{ item.weight }}</strong>
                </div>

                <div class="scorecard-question-card__actions">
                  <button type="button" aria-label="Edit question">
                    <AppIcon name="edit" :size="14" />
                  </button>
                  <button type="button" aria-label="More question actions">
                    <AppIcon name="more" :size="16" />
                  </button>
                </div>
              </article>
            </div>

            <div v-else-if="activeTab === 'rubric'" class="scorecard-rubric">
              <div class="scorecard-rubric__lead">
                <h4>Evaluation Criteria</h4>
                <p>Each question is mapped to scorecard criteria for structured interviewer scoring.</p>
              </div>

              <div class="scorecard-rubric__table">
                <header>
                  <span>Criterion</span>
                  <span>Weight</span>
                  <span>Mapped</span>
                  <span>Rating Scale</span>
                </header>

                <article v-for="[criterion, weight, mapped, scale] in rubricRows" :key="criterion">
                  <strong>{{ criterion }}</strong>
                  <span>{{ weight }}</span>
                  <span>{{ mapped }}</span>
                  <small>{{ scale }}</small>
                </article>
              </div>

              <div class="scorecard-rubric__note">
                <div>
                  <AppIcon name="bolt" :size="14" />
                  <span>Scorecard is aligned with the Review &amp; Evaluation Framework.</span>
                </div>
                <button type="button">
                  <span>View framework</span>
                  <AppIcon name="chevronRight" :size="14" />
                </button>
              </div>
            </div>

            <div v-else-if="activeTab === 'skills'" class="scorecard-skills">
              <div class="scorecard-skills__lead">
                <div>
                  <h4>Skills &amp; Competencies</h4>
                  <p>How this interview kit validates the most important practical and behavioral skills.</p>
                </div>
                <span>8 mapped skills</span>
              </div>

              <div class="scorecard-skills__summary">
                <article v-for="item in skillsSummary" :key="item.label">
                  <div>
                    <strong>{{ item.label }}</strong>
                    <span>{{ item.value }}%</span>
                  </div>
                  <div class="scorecard-skills__bar">
                    <i :class="`tone-${item.tone}`" :style="{ width: `${item.value}%` }" />
                  </div>
                </article>
              </div>

              <div class="scorecard-skills__grid">
                <article v-for="item in skillCards" :key="item.title" class="scorecard-skill-card">
                  <header>
                    <div>
                      <h5>{{ item.title }}</h5>
                      <small :class="`tone-${item.tone}`">{{ item.coverage }}</small>
                    </div>
                    <span :class="`tone-${item.tone}`" />
                  </header>
                  <p>{{ item.note }}</p>
                  <div class="scorecard-skill-card__chips">
                    <em v-for="chip in item.chips" :key="chip">{{ chip }}</em>
                  </div>
                </article>
              </div>
            </div>

            <div v-else-if="activeTab === 'guide'" class="scorecard-competencies">
              <div class="scorecard-competencies__hero">
                <div>
                  <h4>Interview Guide</h4>
                  <p>Structured areas the panel will score, weighted to match the hiring decision.</p>
                </div>
                <div class="scorecard-competencies__ring">
                  <div class="scorecard-competencies__ring-content">
                    <strong>6</strong>
                    <span>Tracked Competencies</span>
                  </div>
                </div>
              </div>

              <div class="scorecard-competencies__grid">
                <article v-for="item in competencyCards" :key="item.title" class="scorecard-competency-card">
                  <div class="scorecard-competency-card__head">
                    <div>
                      <h5>{{ item.title }}</h5>
                      <small>{{ item.status }}</small>
                    </div>
                    <strong :class="`tone-${item.tone}`">{{ item.score }}</strong>
                  </div>
                  <ul>
                    <li v-for="point in item.points" :key="point">{{ point }}</li>
                  </ul>
                </article>
              </div>

              <div class="scorecard-competencies__coverage">
                <article v-for="item in competencyCoverage" :key="item.title">
                  <span :class="`tone-${item.tone}`">{{ item.value }}</span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.note }}</p>
                  </div>
                </article>
              </div>
            </div>

            <div v-else class="scorecard-rubric">
              <div class="scorecard-rubric__lead">
                <h4>{{ activeTab === 'notes' ? 'Interview Notes' : 'Attachments' }}</h4>
                <p>{{ activeTab === 'notes' ? 'Capture context, reminders and follow-up notes for this round.' : 'Store supporting files, interview docs and related material for this round.' }}</p>
              </div>
            </div>
          </section>

          <aside class="scorecard-side">
            <section class="scorecard-panel scorecard-panel--assistant">
              <div class="scorecard-panel__title-row">
                <h3>AI Interview Assistant</h3>
                <button type="button" aria-label="Collapse assistant">
                  <AppIcon name="chevronUp" :size="14" />
                </button>
              </div>

              <div class="scorecard-side__group">
                <strong>Interview Preparation Insights</strong>
                <ul class="scorecard-check-list">
                  <li v-for="item in assistantInsights" :key="item">
                    <AppIcon name="checkCircle" :size="14" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div class="scorecard-side__group">
                <strong>Suggestions</strong>
                <ul class="scorecard-alert-list">
                  <li v-for="item in assistantSuggestions" :key="item">
                    <AppIcon name="alert" :size="14" />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <button class="scorecard-side__outline-button" type="button">
                <AppIcon name="spark" :size="14" />
                <span>Generate Suggested Questions</span>
              </button>
            </section>

            <section class="scorecard-panel">
              <h3>Competency Coverage</h3>

              <div class="scorecard-coverage">
                <div class="scorecard-coverage__ring">
                  <strong>6</strong>
                  <span>Competencies Covered</span>
                </div>

                <ul>
                  <li><i class="is-green" /> Well Covered (4)</li>
                  <li><i class="is-amber" /> Moderate (2)</li>
                  <li><i class="is-red" /> Missing (0)</li>
                </ul>
              </div>

              <small>Target: 6 competencies</small>
            </section>

            <section class="scorecard-panel">
              <h3>Quick Actions</h3>
              <ul class="scorecard-side__action-list">
                <li v-for="action in quickActions" :key="action.label" :class="{ 'is-danger': action.tone === 'danger' }">
                  <button type="button">
                    <AppIcon :name="action.icon" :size="15" />
                    <span>{{ action.label }}</span>
                  </button>
                </li>
              </ul>
            </section>
          </aside>
        </div>

        <footer class="scorecard-modal__footer">
          <button type="button" @click="closeOverlay">Close</button>

          <div class="scorecard-modal__footer-center">
            <span>All changes are saved automatically</span>
            <AppIcon name="checkCircle" :size="14" />
          </div>

          <div class="scorecard-modal__footer-actions">
            <button type="button">Save as Draft</button>
            <button class="is-primary" type="button">
              <span>Save &amp; Continue</span>
              <AppIcon name="chevronRight" :size="15" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.scorecard-overlay {
  position: fixed;
  inset: 0;
  z-index: 1760;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(18, 26, 41, 0.16);
  backdrop-filter: blur(10px);
}

.scorecard-modal {
  width: min(1280px, calc(100vw - 40px));
  max-height: calc(100vh - 40px);
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e7edf8;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);
}

.scorecard-modal__header,
.scorecard-journey,
.scorecard-modal__body,
.scorecard-modal__footer {
  padding-left: 22px;
  padding-right: 22px;
}

.scorecard-modal__header,
.scorecard-modal__title,
.scorecard-modal__header-actions,
.scorecard-journey__step,
.scorecard-sidebar__inline,
.scorecard-panel__title-row,
.scorecard-interviewer,
.scorecard-main__tabs,
.scorecard-main__toolbar,
.scorecard-main__toolbar-actions,
.scorecard-main__toolbar-meta,
.scorecard-question-card,
.scorecard-question-card__order,
.scorecard-question-card__actions,
.scorecard-rubric-card,
.scorecard-coverage,
.scorecard-modal__footer,
.scorecard-modal__footer-actions,
.scorecard-modal__footer-center,
.scorecard-side__outline-button,
.scorecard-side__action-list button {
  display: flex;
}

.scorecard-modal__header {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf1f8;
}

.scorecard-modal__title {
  align-items: center;
  gap: 14px;
}

.scorecard-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f5f7fc;
  color: #66748e;
}

.scorecard-modal__title h2,
.scorecard-panel h3,
.scorecard-question-card__content h4,
.scorecard-rubric-card h4 {
  margin: 0;
  color: #1f2940;
}

.scorecard-modal__title p,
.scorecard-sidebar__section span,
.scorecard-interviewer small,
.scorecard-sidebar__section p,
.scorecard-question-card__content p,
.scorecard-question-card__meta span,
.scorecard-rubric-card p,
.scorecard-panel small,
.scorecard-modal__footer-center span {
  color: #7f8ba3;
}

.scorecard-modal__title p {
  margin: 4px 0 0;
}

.scorecard-modal__header-actions {
  align-items: center;
  gap: 10px;
}

.scorecard-modal__header-actions > button,
.scorecard-main__tabs button,
.scorecard-main__toolbar button,
.scorecard-panel__title-row button,
.scorecard-side__outline-button,
.scorecard-modal__footer button,
.scorecard-question-card__actions button,
.scorecard-interviewer button {
  border: 1px solid #dbe3f1;
  border-radius: 12px;
  background: #fff;
  color: #324160;
  font: inherit;
  cursor: pointer;
}

.scorecard-modal__header-actions > button {
  min-height: 36px;
  padding: 0 14px;
}

.scorecard-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-color: #efcf6b !important;
  color: #a17200 !important;
  background: #fffaf0 !important;
}

.scorecard-status-pill i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f5b400;
}

.scorecard-modal__icon-button {
  justify-content: center;
  width: 36px;
  padding: 0 !important;
}

.scorecard-journey {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf1f8;
}

.scorecard-journey__step {
  position: relative;
  align-items: center;
  gap: 12px;
}

.scorecard-journey__node {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e8ecf4;
  color: #fff;
  font-weight: 700;
  flex: 0 0 32px;
}

.scorecard-journey__copy {
  min-width: 0;
}

.scorecard-journey__copy strong {
  display: block;
  color: #222d46;
}

.scorecard-journey__copy small {
  display: block;
  margin-top: 3px;
  color: #8a95ab;
}

.scorecard-journey__line {
  position: absolute;
  left: calc(100% - 18px);
  right: -8px;
  top: 15px;
  height: 2px;
  background: #e8ecf4;
}

.scorecard-journey__step.is-done .scorecard-journey__node {
  background: #69d694;
}

.scorecard-journey__step.is-done .scorecard-journey__copy small {
  color: #69c889;
}

.scorecard-journey__step.is-active .scorecard-journey__node {
  background: #3e6fe7;
}

.scorecard-journey__step.is-active .scorecard-journey__line {
  background: linear-gradient(90deg, #f46bb4 0%, #f46bb4 70%, #e8ecf4 70%);
}

.scorecard-journey__step.is-active .scorecard-journey__copy strong {
  color: #1f2940;
}

.scorecard-journey__step.is-active .scorecard-journey__copy small {
  color: #69738c;
}

.scorecard-modal__body {
  min-height: 0;
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr) 240px;
  gap: 24px;
  padding-top: 0;
  overflow: auto;
}

.scorecard-sidebar,
.scorecard-main,
.scorecard-side {
  min-width: 0;
}

.scorecard-sidebar,
.scorecard-side {
  padding-top: 24px;
}

.scorecard-main {
  padding-top: 18px;
  border-left: 1px solid #edf1f8;
  border-right: 1px solid #edf1f8;
}

.scorecard-panel {
  padding: 0 0 18px;
}

.scorecard-panel + .scorecard-panel {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #edf1f8;
}

.scorecard-panel h3 {
  margin-bottom: 18px;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.scorecard-sidebar__section + .scorecard-sidebar__section {
  margin-top: 24px;
}

.scorecard-sidebar__section span {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.scorecard-sidebar__section strong {
  color: #1f2940;
}

.scorecard-interviewer {
  align-items: center;
  gap: 12px;
}

.scorecard-interviewer > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f9d3c6 0%, #d9f0e5 100%);
  color: #1f2940;
  font-weight: 700;
  flex: 0 0 36px;
}

.scorecard-interviewer button,
.scorecard-sidebar__inline button {
  width: 28px;
  height: 28px;
  padding: 0;
  border-color: transparent;
  color: #9aa5b8;
  background: transparent;
}

.scorecard-sidebar__inline {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.scorecard-sidebar__inline > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.scorecard-chip-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scorecard-chip-row em {
  padding: 3px 10px;
  border-radius: 6px;
  background: #edf4ff;
  color: #4e71f2;
  font-size: 0.76rem;
  font-style: normal;
}

.scorecard-sidebar__section p {
  margin: 0;
  line-height: 1.55;
}

.scorecard-panel__title-row {
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.scorecard-panel__title-row h3 {
  margin: 0;
}

.scorecard-panel__title-row button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #4e71f2;
  font-size: 0.78rem;
  font-weight: 700;
}

.scorecard-weight-list,
.scorecard-coverage ul,
.scorecard-side__action-list,
.scorecard-check-list,
.scorecard-alert-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.scorecard-weight-list {
  display: grid;
  gap: 12px;
}

.scorecard-weight-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  color: #2d3851;
}

.scorecard-manage-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 44px;
  margin-top: 22px;
  border: 1px solid #d7dfec;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  color: #1f2940;
  font-weight: 700;
  box-shadow: 0 10px 22px rgba(148, 163, 184, 0.08);
}

.scorecard-manage-button:hover {
  border-color: #c8d3e6;
  background: #ffffff;
}

.scorecard-manage-button :deep(svg) {
  color: #596780;
}

.scorecard-manage-button span {
  margin: 0;
}

.scorecard-main__tabs {
  gap: 24px;
  padding: 0 24px;
  border-bottom: 1px solid #edf1f8;
}

.scorecard-main__tabs button {
  position: relative;
  padding: 0 0 16px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #6d788e;
  font-size: 0.98rem;
}

.scorecard-main__tabs button.is-active {
  color: #ff4f9b;
}

.scorecard-main__tabs button.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  border-radius: 999px;
  background: #ff5da8;
}

.scorecard-main__toolbar {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 16px;
}

.scorecard-main__toolbar-actions,
.scorecard-main__toolbar-meta {
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.scorecard-main__toolbar button {
  min-height: 38px;
  padding: 0 16px;
}

.scorecard-main__toolbar button.is-primary {
  border: 0;
  background: linear-gradient(135deg, #f970b6 0%, #ef4f9d 100%);
  color: #fff;
}

.scorecard-main__toolbar button span,
.scorecard-modal__header-actions > button span,
.scorecard-side__outline-button span,
.scorecard-side__action-list button span,
.scorecard-modal__footer-actions button span {
  margin-left: 8px;
}

.scorecard-main__toolbar-meta span {
  color: #7f8ba3;
}

.scorecard-question-list,
.scorecard-empty,
.scorecard-rubric,
.scorecard-skills,
.scorecard-competencies {
  display: grid;
  gap: 14px;
  padding: 10px 24px 24px;
}

.scorecard-empty {
  justify-items: center;
  padding-top: 42px;
  padding-bottom: 42px;
  text-align: center;
}

.scorecard-empty__icon,
.scorecard-empty__actions,
.scorecard-empty__link,
.scorecard-empty__benefits article {
  display: flex;
}

.scorecard-empty__icon {
  position: relative;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border: 1px dashed #d9e1ee;
  border-radius: 22px;
  background: linear-gradient(180deg, #fbfcff 0%, #ffffff 100%);
  color: #b7c2d6;
}

.scorecard-empty__icon span {
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 3px solid #fff;
  border-radius: 50%;
  background: #4d8dff;
  color: #fff;
}

.scorecard-empty h4 {
  margin: 10px 0 0;
  color: #1f2940;
  font-size: 1.5rem;
}

.scorecard-empty > p {
  max-width: 520px;
  margin: 0;
  color: #7f8ba3;
  line-height: 1.65;
}

.scorecard-empty__benefits {
  display: grid;
  gap: 16px;
  width: min(100%, 620px);
  margin-top: 14px;
  text-align: left;
}

.scorecard-empty__benefits article {
  align-items: flex-start;
  gap: 14px;
}

.scorecard-empty__benefits article > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  background: #f5f7fc;
  flex: 0 0 28px;
}

.scorecard-empty__benefits strong {
  display: block;
  color: #1f2940;
}

.scorecard-empty__benefits small {
  display: block;
  margin-top: 4px;
  color: #7f8ba3;
  line-height: 1.5;
}

.scorecard-empty__actions {
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.scorecard-empty__actions button {
  min-height: 42px;
  padding: 0 18px;
  border: 1px solid #dbe3f1;
  border-radius: 12px;
  background: #fff;
  color: #3d4b68;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.scorecard-empty__actions button.is-primary {
  border: 0;
  background: linear-gradient(135deg, #f970b6 0%, #ef4f9d 100%);
  color: #fff;
}

.scorecard-empty__actions button span {
  margin-left: 8px;
}

.scorecard-empty__link {
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6b63f6;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.scorecard-question-card,
.scorecard-rubric-card {
  align-items: flex-start;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e6ecf7;
  border-radius: 16px;
  background: #fff;
}

.scorecard-question-card__order {
  align-items: flex-start;
  gap: 14px;
  color: #a1abbd;
  flex: 0 0 62px;
}

.scorecard-question-card__grip {
  display: grid;
  grid-template-columns: repeat(2, 4px);
  gap: 4px;
  margin-top: 5px;
}

.scorecard-question-card__grip i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d4dae6;
}

.scorecard-question-card__content {
  flex: 1;
  min-width: 0;
}

.scorecard-question-card__content h4 {
  font-size: 1rem;
}

.scorecard-question-card__content p {
  margin: 10px 0 0;
  font-size: 0.82rem;
}

.scorecard-question-card__content em {
  display: inline-flex;
  align-items: center;
  min-height: 22px;
  margin-left: 10px;
  padding: 0 9px;
  border-radius: 6px;
  background: #e9fbef;
  color: #27975c;
  font-size: 0.72rem;
  font-style: normal;
  font-weight: 700;
}

.scorecard-question-card__meta {
  min-width: 64px;
  text-align: right;
}

.scorecard-question-card__meta strong {
  display: block;
  margin-top: 2px;
  color: #1f2940;
  font-size: 1.1rem;
}

.scorecard-question-card__actions {
  align-items: center;
  gap: 6px;
}

.scorecard-question-card__actions button {
  width: 30px;
  height: 30px;
  padding: 0;
  border-color: transparent;
  color: #9aa5b8;
}

.scorecard-rubric {
  gap: 18px;
}

.scorecard-rubric__lead h4 {
  margin: 0;
  color: #1f2940;
}

.scorecard-rubric__lead p {
  margin: 8px 0 0;
  color: #7f8ba3;
  line-height: 1.55;
}

.scorecard-rubric__table {
  display: grid;
  gap: 0;
}

.scorecard-rubric__table header,
.scorecard-rubric__table article {
  display: grid;
  grid-template-columns: 1.2fr 0.6fr 0.7fr 0.8fr;
  gap: 14px;
  align-items: center;
}

.scorecard-rubric__table header {
  color: #9aa5b8;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.scorecard-rubric__table article {
  padding: 14px 0;
  border-top: 1px solid #edf1f8;
}

.scorecard-rubric__table article strong {
  color: #1f2940;
  font-size: 0.92rem;
}

.scorecard-rubric__table article span,
.scorecard-rubric__table article small {
  color: #6f7c95;
  font-size: 0.82rem;
}

.scorecard-rubric__note,
.scorecard-rubric__note button,
.scorecard-rubric__note div {
  display: flex;
  align-items: center;
}

.scorecard-rubric__note {
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff6fb;
  color: #ef5da8;
}

.scorecard-rubric__note div {
  gap: 8px;
  font-weight: 700;
}

.scorecard-rubric__note button {
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ef5da8;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.scorecard-skills,
.scorecard-competencies {
  gap: 18px;
}

.scorecard-skills__lead,
.scorecard-competencies__hero,
.scorecard-competency-card__head,
.scorecard-competencies__coverage article,
.scorecard-skill-card header,
.scorecard-skills__summary article > div {
  display: flex;
}

.scorecard-skills__lead,
.scorecard-competencies__hero {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.scorecard-skills__lead h4,
.scorecard-competencies__hero h4,
.scorecard-skill-card h5,
.scorecard-competency-card h5 {
  margin: 0;
  color: #1f2940;
}

.scorecard-skills__lead p,
.scorecard-competencies__hero p,
.scorecard-skill-card p,
.scorecard-competencies__coverage p {
  margin: 8px 0 0;
  color: #7f8ba3;
  line-height: 1.55;
}

.scorecard-skills__lead > span {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #fff3fb;
  color: #ef5da8;
  font-weight: 700;
}

.scorecard-skills__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.scorecard-skills__summary article,
.scorecard-skill-card,
.scorecard-competency-card,
.scorecard-competencies__coverage article {
  padding: 16px 18px;
  border: 1px solid #e6ecf7;
  border-radius: 16px;
  background: #fff;
}

.scorecard-skills__summary article > div {
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.scorecard-skills__summary strong,
.scorecard-competencies__coverage strong {
  color: #1f2940;
}

.scorecard-skills__summary span {
  color: #6f7c95;
  font-weight: 700;
}

.scorecard-skills__bar {
  height: 8px;
  margin-top: 12px;
  border-radius: 999px;
  background: #edf1f8;
  overflow: hidden;
}

.scorecard-skills__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.scorecard-skills__bar i.tone-pink,
.scorecard-skill-card header > span.tone-pink {
  background: #ef68b4;
}

.scorecard-skills__bar i.tone-violet,
.scorecard-skill-card header > span.tone-violet {
  background: #6b63f6;
}

.scorecard-skills__bar i.tone-blue,
.scorecard-skill-card header > span.tone-blue {
  background: #4d8dff;
}

.scorecard-skills__bar i.tone-green,
.scorecard-skill-card header > span.tone-green {
  background: #31bf68;
}

.scorecard-skills__bar i.tone-amber,
.scorecard-skill-card header > span.tone-amber {
  background: #f0b112;
}

.scorecard-skills__grid,
.scorecard-competencies__grid,
.scorecard-competencies__coverage {
  display: grid;
  gap: 14px;
}

.scorecard-skills__grid,
.scorecard-competencies__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.scorecard-skill-card header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.scorecard-skill-card header small,
.scorecard-competency-card__head small {
  display: block;
  margin-top: 4px;
  font-size: 0.74rem;
  font-weight: 700;
}

.scorecard-skill-card header small.tone-pink,
.scorecard-competency-card__head strong.tone-pink,
.scorecard-competencies__coverage article > span.tone-pink {
  color: #ef68b4;
}

.scorecard-skill-card header small.tone-violet,
.scorecard-competency-card__head strong.tone-violet,
.scorecard-competencies__coverage article > span.tone-violet {
  color: #6b63f6;
}

.scorecard-skill-card header small.tone-blue,
.scorecard-competency-card__head strong.tone-blue,
.scorecard-competencies__coverage article > span.tone-blue {
  color: #4d8dff;
}

.scorecard-skill-card header small.tone-green,
.scorecard-competency-card__head strong.tone-green,
.scorecard-competencies__coverage article > span.tone-green {
  color: #31bf68;
}

.scorecard-skill-card header small.tone-amber,
.scorecard-competency-card__head strong.tone-amber,
.scorecard-competencies__coverage article > span.tone-amber {
  color: #f0b112;
}

.scorecard-skill-card header > span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex: 0 0 12px;
}

.scorecard-skill-card__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.scorecard-skill-card__chips em {
  padding: 4px 10px;
  border-radius: 999px;
  background: #f5f7fc;
  color: #53627d;
  font-size: 0.74rem;
  font-style: normal;
  font-weight: 700;
}

.scorecard-competencies__hero {
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  border: 1px solid #e6ecf7;
  border-radius: 18px;
  background:
    radial-gradient(circle at top right, rgba(255, 101, 175, 0.08), transparent 28%),
    linear-gradient(180deg, #fffafe 0%, #ffffff 100%);
}

.scorecard-competencies__hero > div:first-child {
  flex: 1;
  min-width: 0;
}

.scorecard-competencies__ring {
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, #fff 65%, transparent 66% 100%),
    conic-gradient(#ef68b4 0 82%, #f3d9e7 82% 100%);
  text-align: center;
  flex: 0 0 128px;
}

.scorecard-competencies__ring-content {
  display: grid;
  justify-items: center;
  gap: 6px;
  width: 74px;
}

.scorecard-competencies__ring strong {
  display: block;
  color: #1f2940;
  font-size: 1.9rem;
  line-height: 1;
}

.scorecard-competencies__ring span {
  display: block;
  color: #7f8ba3;
  font-size: 0.62rem;
  line-height: 1.15;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.scorecard-competency-card__head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.scorecard-competency-card__head strong {
  font-size: 1rem;
}

.scorecard-competency-card ul {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.scorecard-competency-card li {
  position: relative;
  padding-left: 14px;
  color: #55627d;
}

.scorecard-competency-card li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef68b4;
}

.scorecard-competencies__coverage article {
  align-items: flex-start;
  gap: 14px;
}

.scorecard-competencies__coverage article > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #f5f7fc;
  font-size: 1rem;
  font-weight: 800;
  flex: 0 0 42px;
}

.scorecard-competencies__coverage p {
  font-size: 0.82rem;
}

.scorecard-panel--assistant {
  padding-bottom: 16px;
  border: 1px solid #e6ecf7;
  border-radius: 16px;
}

.scorecard-panel--assistant .scorecard-panel__title-row {
  margin: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #edf1f8;
}

.scorecard-panel--assistant .scorecard-panel__title-row h3 {
  color: #f254a2;
}

.scorecard-panel--assistant .scorecard-panel__title-row button {
  color: #98a4ba;
}

.scorecard-side__group {
  padding: 14px 16px 0;
}

.scorecard-side__group strong {
  display: block;
  color: #1f2940;
  font-size: 0.88rem;
}

.scorecard-check-list,
.scorecard-alert-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.scorecard-check-list li,
.scorecard-alert-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #59667f;
  font-size: 0.8rem;
}

.scorecard-check-list li :deep(svg) {
  color: #32bf67;
}

.scorecard-alert-list li :deep(svg) {
  color: #f0b112;
}

.scorecard-side__outline-button {
  align-items: center;
  justify-content: center;
  width: calc(100% - 32px);
  min-height: 36px;
  margin: 14px 16px 0;
  color: #ff4f9b;
}

.scorecard-coverage {
  align-items: center;
  gap: 18px;
}

.scorecard-coverage__ring {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, #fff 68%, transparent 69% 100%),
    conic-gradient(#ef68b4 0 78%, #f3d9e7 78% 100%);
  text-align: center;
  flex: 0 0 92px;
}

.scorecard-coverage__ring strong {
  display: block;
  color: #1f2940;
  font-size: 1.2rem;
}

.scorecard-coverage__ring span {
  max-width: 52px;
  color: #7f8ba3;
  font-size: 0.54rem;
  line-height: 1.2;
  text-transform: uppercase;
}

.scorecard-coverage ul {
  display: grid;
  gap: 10px;
  color: #58657d;
  font-size: 0.8rem;
}

.scorecard-coverage li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scorecard-coverage li i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.scorecard-coverage li i.is-green {
  background: #36bf68;
}

.scorecard-coverage li i.is-amber {
  background: #f0b112;
}

.scorecard-coverage li i.is-red {
  background: #f05252;
}

.scorecard-side__action-list {
  display: grid;
  gap: 10px;
}

.scorecard-side__action-list button {
  align-items: center;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: #53627d;
  text-align: left;
}

.scorecard-side__action-list li.is-danger button,
.scorecard-side__action-list li.is-danger :deep(svg) {
  color: #ff4d4f;
}

.scorecard-modal__footer {
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  padding-bottom: 16px;
  border-top: 1px solid #edf1f8;
}

.scorecard-modal__footer > button,
.scorecard-modal__footer-actions button {
  min-height: 38px;
  padding: 0 24px;
}

.scorecard-modal__footer-center {
  align-items: center;
  gap: 8px;
  color: #32bf67;
  justify-content: center;
}

.scorecard-modal__footer-center :deep(svg) {
  color: #32bf67;
}

.scorecard-modal__footer-actions {
  align-items: center;
  gap: 12px;
}

.scorecard-modal__footer-actions button.is-primary {
  border: 0;
  background: linear-gradient(135deg, #f14898 0%, #d91f72 100%);
  color: #fff;
}

@media (max-width: 1180px) {
  .scorecard-modal__body {
    grid-template-columns: 1fr;
  }

  .scorecard-main {
    border-left: 0;
    border-right: 0;
    border-top: 1px solid #edf1f8;
    border-bottom: 1px solid #edf1f8;
  }

  .scorecard-journey {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .scorecard-skills__summary,
  .scorecard-skills__grid,
  .scorecard-competencies__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .scorecard-overlay {
    padding: 12px;
  }

  .scorecard-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
  }

  .scorecard-modal__header,
  .scorecard-journey,
  .scorecard-modal__body,
  .scorecard-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .scorecard-modal__header,
  .scorecard-modal__header-actions,
  .scorecard-main__toolbar,
  .scorecard-modal__footer,
  .scorecard-modal__footer-actions,
  .scorecard-question-card,
  .scorecard-rubric-card {
    flex-direction: column;
    align-items: stretch;
  }

  .scorecard-main__tabs {
    gap: 16px;
    overflow: auto;
  }

  .scorecard-main__tabs button {
    white-space: nowrap;
  }

  .scorecard-journey {
    grid-template-columns: 1fr;
  }

  .scorecard-rubric__table header,
  .scorecard-rubric__table article {
    grid-template-columns: 1fr;
  }

  .scorecard-rubric__note {
    flex-direction: column;
    align-items: flex-start;
  }

  .scorecard-journey__line {
    display: none;
  }
}
</style>
