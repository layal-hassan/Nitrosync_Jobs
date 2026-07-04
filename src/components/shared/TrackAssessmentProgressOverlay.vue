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
    default: 'John Doe',
  },
  candidateRole: {
    type: String,
    default: 'Backend Engineer',
  },
})

const emit = defineEmits(['close'])

const tabs = [
  { id: 'all', label: 'All Assessments', count: 3 },
  { id: 'completed', label: 'Completed', count: 2 },
  { id: 'progress', label: 'In Progress', count: 1 },
  { id: 'overdue', label: 'Overdue', count: 1 },
  { id: 'pending', label: 'Not Started', count: 0 },
]

const assessments = [
  {
    id: 'backend-test',
    name: 'Backend Engineering Test',
    subtitle: 'Coding Assessment',
    provider: 'HackerRank',
    providerMode: 'Online',
    status: 'completed',
    statusLabel: 'Completed',
    statusNote: 'Apr 30, 2025',
    sentOn: 'Apr 25, 2025',
    sentTime: '10:20 AM',
    deadline: 'May 05, 2025',
    deadlineNote: '11:59 PM',
    progress: 100,
    score: '92%',
    scoreNote: 'Passed',
    percentile: '91st',
    actionLabel: 'View Result',
    actionTone: 'default',
    iconLetter: 'H',
    iconTone: 'green',
    detailTag: 'Completed',
    journey: [
      { label: 'Invitation Sent', time: 'Apr 25, 2025 10:20 AM', done: true },
      { label: 'Opened', time: 'Apr 26, 2025 09:15 AM', done: true },
      { label: 'Started', time: 'Apr 28, 2025 03:40 PM', done: true },
      { label: 'Submitted', time: 'Apr 30, 2025 10:07 AM', done: true },
      { label: 'Reviewed', time: 'Pending', done: false },
      { label: 'Decision', time: 'Pending', done: false },
    ],
    scoreSummary: {
      score: '92%',
      scoreState: 'Passed',
      percentile: '91st',
      rank: '2',
      rankTotal: '14',
      timeTaken: '47 min',
    },
    details: [
      { label: 'Provider', value: 'HackerRank' },
      { label: 'Duration', value: '90 min' },
      { label: 'Passing Score', value: '70%' },
      { label: 'Total Questions', value: '60' },
      { label: 'Language', value: 'Python' },
      { label: 'Environment', value: 'Online Proctored' },
    ],
    sections: [
      { label: 'Algorithms', score: '95%', percentile: '95th', progress: 95 },
      { label: 'Data Structures', score: '91%', percentile: '88th', progress: 91 },
      { label: 'System Design', score: '94%', percentile: '93rd', progress: 94 },
      { label: 'SQL', score: '93%', percentile: '90th', progress: 93 },
      { label: 'Code Quality', score: '92%', percentile: '87th', progress: 92 },
    ],
    aiSummary: [
      { tone: 'green', text: 'Demonstrated excellent problem-solving skills and strong algorithmic thinking.' },
      { tone: 'green', text: 'High performance in algorithms, data structures and code quality.' },
      { tone: 'amber', text: 'SQL performance is good but can be improved with more complex queries.' },
    ],
    recommendation: 'Move to Technical Interview',
  },
  {
    id: 'system-design',
    name: 'System Design Assessment',
    subtitle: 'Scenario Based',
    provider: 'CodeSignal',
    providerMode: 'Online',
    status: 'progress',
    statusLabel: 'In Progress',
    statusNote: 'Started May 02, 2025',
    sentOn: 'Apr 28, 2025',
    sentTime: '02:15 PM',
    deadline: 'May 06, 2025',
    deadlineNote: '11:59 PM',
    progress: 65,
    score: '—',
    scoreNote: '',
    percentile: '—',
    actionLabel: 'View Progress',
    actionTone: 'default',
    iconLetter: '</>',
    iconTone: 'blue',
  },
  {
    id: 'sql-test',
    name: 'SQL & Data Test',
    subtitle: 'Query Assessment',
    provider: 'HackerRank',
    providerMode: 'Online',
    status: 'overdue',
    statusLabel: 'Overdue',
    statusNote: 'Due May 01, 2025',
    sentOn: 'Apr 24, 2025',
    sentTime: '09:45 AM',
    deadline: 'May 01, 2025',
    deadlineNote: '11:59 PM (Overdue)',
    progress: 0,
    score: '—',
    scoreNote: '',
    percentile: '—',
    actionLabel: 'Send Reminder',
    actionTone: 'accent',
    iconLetter: 'S',
    iconTone: 'orange',
  },
]

const stages = [
  { id: 1, label: 'Application', meta: 'Apr 10, 2025', state: 'complete' },
  { id: 2, label: 'Recruiter Screen', meta: 'Apr 15, 2025', state: 'complete' },
  { id: 3, label: 'Assessment', meta: 'In Progress', state: 'current' },
  { id: 4, label: 'Technical Interview', meta: 'Pending', state: 'pending' },
  { id: 5, label: 'Hiring Manager Interview', meta: 'Pending', state: 'pending' },
  { id: 6, label: 'Offer', meta: 'Pending', state: 'pending' },
]

const summaryCards = [
  { id: 'counts', icon: 'clipboard-check', tone: 'lavender', values: ['3', '2', '1', '0', '1'], labels: ['Total', 'Completed', 'In Progress', 'Not Started', 'Overdue'] },
  { id: 'avg', label: 'Average Score', sublabel: 'Across completed', ring: '88%', ringTone: 'green' },
  { id: 'completion', label: 'Completion Rate', sublabel: '2 of 3 completed', ring: '67%', ringTone: 'blue' },
  { id: 'top', label: 'Top Performance', sublabel: 'Backend Engineering Test', note: 'Completed on Apr 30, 2025', ring: '92%', ringTone: 'green' },
]

const activeTab = ref('all')
const selectedAssessmentId = ref(assessments[0].id)

const filteredAssessments = computed(() => {
  if (activeTab.value === 'all')
    return assessments
  if (activeTab.value === 'completed')
    return assessments.filter((item) => item.status === 'completed')
  if (activeTab.value === 'progress')
    return assessments.filter((item) => item.status === 'progress')
  if (activeTab.value === 'overdue')
    return assessments.filter((item) => item.status === 'overdue')
  if (activeTab.value === 'pending')
    return assessments.filter((item) => item.status === 'pending')
  return assessments
})

const selectedAssessment = computed(() => (
  assessments.find((item) => item.id === selectedAssessmentId.value)
  ?? assessments[0]
))

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    activeTab.value = 'all'
    selectedAssessmentId.value = assessments[0].id
  }
})

watch(filteredAssessments, (items) => {
  if (items.length && !items.some((item) => item.id === selectedAssessmentId.value)) {
    selectedAssessmentId.value = items[0].id
  }
})

function closeOverlay() {
  emit('close')
}

function selectAssessment(assessmentId) {
  selectedAssessmentId.value = assessmentId
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="track-progress-overlay" @click.self="closeOverlay">
      <section class="track-progress-modal">
        <header class="track-progress-modal__head">
          <div>
            <h2>Track Assessment Progress</h2>
            <p>Monitor interview progress, results, pending items and take action</p>
          </div>

          <div class="track-progress-modal__head-actions">
            <button type="button">
              <AppIcon name="share" :size="16" />
              <span>Share</span>
            </button>
            <button type="button">
              <AppIcon name="document" :size="16" />
              <span>Export</span>
            </button>
            <button class="track-progress-modal__icon-button" type="button">
              <AppIcon name="more" :size="18" />
            </button>
          </div>
        </header>

        <div class="track-progress-modal__body">
          <section class="track-progress-stage-card">
            <div class="track-progress-candidate">
              <span class="track-progress-candidate__avatar">{{ candidateInitials }}</span>
              <div class="track-progress-candidate__meta">
                <div class="track-progress-candidate__name-row">
                  <strong>{{ candidateName }}</strong>
                  <span class="track-progress-candidate__badge">Active</span>
                </div>
                <p>{{ candidateRole }} · Ref: ENG-2405</p>
                <small>New York, NY · Applied Apr 10, 2025</small>
              </div>
            </div>

            <div class="track-progress-stage-timeline">
              <article v-for="(stage, index) in stages" :key="stage.id" class="track-progress-stage" :class="`is-${stage.state}`">
                <div class="track-progress-stage__node">
                  <AppIcon v-if="stage.state === 'complete'" name="check" :size="14" />
                  <span v-else>{{ stage.id }}</span>
                </div>
                <strong>{{ stage.label }}</strong>
                <small>{{ stage.meta }}</small>
                <span v-if="index < stages.length - 1" class="track-progress-stage__line" />
              </article>
            </div>
          </section>

          <section class="track-progress-summary-grid">
            <article v-for="card in summaryCards" :key="card.id" class="track-progress-summary-card">
              <template v-if="card.id === 'counts'">
                <div class="track-progress-summary-card__counts">
                  <span class="track-progress-summary-card__icon is-lavender"><AppIcon :name="card.icon" :size="16" /></span>
                  <div class="track-progress-summary-card__metrics">
                    <article v-for="(value, index) in card.values" :key="`${card.id}-${card.labels[index]}`">
                      <strong :class="{ 'is-danger': card.labels[index] === 'Overdue' }">{{ value }}</strong>
                      <small>{{ card.labels[index] }}</small>
                    </article>
                  </div>
                </div>
              </template>

              <template v-else-if="card.id === 'top'">
                <div class="track-progress-summary-card__stack">
                  <div class="track-progress-summary-card__ring" :class="`tone-${card.ringTone}`" :style="{ '--progress': card.ring }">
                    <span>{{ card.ring }}</span>
                  </div>
                  <div>
                    <strong>{{ card.label }}</strong>
                    <p>{{ card.sublabel }}</p>
                    <small>{{ card.note }}</small>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="track-progress-summary-card__split">
                  <div>
                    <strong>{{ card.label }}</strong>
                    <p>{{ card.sublabel }}</p>
                  </div>
                  <div class="track-progress-summary-card__ring" :class="`tone-${card.ringTone}`" :style="{ '--progress': card.ring }">
                    <span>{{ card.ring }}</span>
                  </div>
                </div>
              </template>
            </article>
          </section>

          <section class="track-progress-table-section">
            <div class="track-progress-table-section__topbar">
              <div class="track-progress-table-section__tabs">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  type="button"
                  :class="{ 'is-active': activeTab === tab.id }"
                  @click="activeTab = tab.id"
                >
                  <span>{{ tab.label }}</span>
                  <em>({{ tab.count }})</em>
                </button>
              </div>

              <div class="track-progress-table-section__filters">
                <button type="button">
                  <AppIcon name="filter" :size="15" />
                  <span>Filters</span>
                </button>
                <button type="button">
                  <span>Sort by: Deadline (Earliest)</span>
                  <AppIcon name="chevronDown" :size="15" />
                </button>
              </div>
            </div>

            <div class="track-progress-table-wrap">
              <table class="track-progress-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th>Sent On</th>
                    <th>Deadline</th>
                    <th>Progress</th>
                    <th>Score</th>
                    <th>Percentile</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in filteredAssessments"
                    :key="item.id"
                    :class="{ 'is-selected': selectedAssessmentId === item.id }"
                    @click="selectAssessment(item.id)"
                  >
                    <td>
                      <div class="track-progress-table__assessment">
                        <span class="track-progress-table__assessment-icon" :class="`tone-${item.iconTone}`">{{ item.iconLetter }}</span>
                        <div>
                          <strong>{{ item.name }}</strong>
                          <small>{{ item.subtitle }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__cell-stack">
                        <strong>{{ item.provider }}</strong>
                        <small>{{ item.providerMode }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__cell-stack">
                        <span class="track-progress-status-badge" :class="`is-${item.status}`">{{ item.statusLabel }}</span>
                        <small>{{ item.statusNote }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__cell-stack">
                        <strong>{{ item.sentOn }}</strong>
                        <small>{{ item.sentTime }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__cell-stack">
                        <strong :class="{ 'is-danger': item.status === 'overdue' }">{{ item.deadline }}</strong>
                        <small :class="{ 'is-danger': item.status === 'overdue' }">{{ item.deadlineNote }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__progress">
                        <strong>{{ item.progress }}%</strong>
                        <span><i :style="{ width: `${item.progress}%` }" :class="`tone-${item.status}`" /></span>
                      </div>
                    </td>
                    <td>
                      <div class="track-progress-table__cell-stack">
                        <strong :class="{ 'is-success': item.status === 'completed' }">{{ item.score }}</strong>
                        <small v-if="item.scoreNote">{{ item.scoreNote }}</small>
                      </div>
                    </td>
                    <td><strong>{{ item.percentile }}</strong></td>
                    <td class="track-progress-table__action-cell">
                      <button type="button" :class="{ 'is-accent': item.actionTone === 'accent' }">{{ item.actionLabel }}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="track-progress-table-section__timezone">All times are in America/New_York time zone.</p>
          </section>

          <section class="track-progress-detail-card">
            <header class="track-progress-detail-card__head">
              <div class="track-progress-detail-card__title">
                <span class="track-progress-table__assessment-icon tone-green">{{ selectedAssessment.iconLetter }}</span>
                <div>
                  <div class="track-progress-detail-card__title-row">
                    <strong>{{ selectedAssessment.name }}</strong>
                    <span>{{ selectedAssessment.detailTag || selectedAssessment.statusLabel }}</span>
                  </div>
                  <small>{{ selectedAssessment.provider }} · {{ selectedAssessment.subtitle }}</small>
                </div>
              </div>

              <div class="track-progress-detail-card__head-actions">
                <button type="button">
                  <span>View Full Report</span>
                  <AppIcon name="external-link" :size="14" />
                </button>
                <button class="track-progress-modal__icon-button" type="button">
                  <AppIcon name="chevronUp" :size="16" />
                </button>
              </div>
            </header>

            <div class="track-progress-detail-card__grid">
              <div class="track-progress-detail-card__journey">
                <section>
                  <h4>Assessment Journey</h4>
                  <article v-for="step in selectedAssessment.journey" :key="step.label">
                    <span :class="{ 'is-done': step.done }">
                      <AppIcon v-if="step.done" name="check" :size="12" />
                      <i v-else />
                    </span>
                    <div>
                      <strong>{{ step.label }}</strong>
                      <small>{{ step.time }}</small>
                    </div>
                  </article>
                </section>

                <section class="track-progress-detail-card__section-breakdown">
                  <h4>Section Breakdown</h4>
                  <article v-for="section in selectedAssessment.sections" :key="section.label">
                    <strong>{{ section.label }}</strong>
                    <span class="track-progress-detail-card__bar"><i :style="{ width: `${section.progress}%` }" /></span>
                    <b>{{ section.score }}</b>
                    <small>{{ section.percentile }}</small>
                  </article>
                </section>
              </div>

              <div class="track-progress-detail-card__stats">
                <div class="track-progress-detail-card__score-grid">
                  <article>
                    <small>Score</small>
                    <strong class="is-pink">{{ selectedAssessment.scoreSummary.score }}</strong>
                    <em>{{ selectedAssessment.scoreSummary.scoreState }}</em>
                  </article>
                  <article>
                    <small>Percentile</small>
                    <strong>{{ selectedAssessment.scoreSummary.percentile }}</strong>
                  </article>
                  <article>
                    <small>Rank</small>
                    <strong>{{ selectedAssessment.scoreSummary.rank }}</strong>
                    <em>of {{ selectedAssessment.scoreSummary.rankTotal }}</em>
                  </article>
                  <article>
                    <small>Time Taken</small>
                    <strong>{{ selectedAssessment.scoreSummary.timeTaken }}</strong>
                  </article>
                </div>

                <section class="track-progress-detail-card__details">
                  <h4>Assessment Details</h4>
                  <article v-for="row in selectedAssessment.details" :key="row.label">
                    <span>{{ row.label }}</span>
                    <strong>{{ row.value }}</strong>
                  </article>
                </section>
              </div>

              <div class="track-progress-detail-card__insights">
                <section class="track-progress-detail-card__ai">
                  <h4>AI Summary</h4>
                  <article v-for="note in selectedAssessment.aiSummary" :key="note.text">
                    <span :class="`tone-${note.tone}`">
                      <AppIcon :name="note.tone === 'amber' ? 'alert' : 'sparkles'" :size="12" />
                    </span>
                    <p>{{ note.text }}</p>
                  </article>
                </section>

                <section class="track-progress-detail-card__recommendation">
                  <small>Recommendation</small>
                  <strong>{{ selectedAssessment.recommendation }}</strong>
                  <span><AppIcon name="checkCircle" :size="16" /></span>
                </section>
              </div>
            </div>
          </section>
        </div>

        <footer class="track-progress-modal__footer">
          <button class="track-progress-modal__primary" type="button">
            <span>Move to Technical Interview</span>
            <AppIcon name="chevrons-right" :size="15" />
          </button>

          <div class="track-progress-modal__footer-actions">
            <button type="button">
              <AppIcon name="edit" :size="15" />
              <span>Request Review</span>
            </button>
            <button type="button">
              <AppIcon name="message" :size="15" />
              <span>Send Feedback</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.track-progress-overlay {
  position: fixed;
  inset: 0;
  z-index: 1460;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(108, 116, 132, 0.66);
  backdrop-filter: blur(5px);
}

.track-progress-modal {
  width: min(100%, 1320px);
  max-height: calc(100vh - 44px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e5ebf4;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
}

.track-progress-modal__head,
.track-progress-modal__head-actions,
.track-progress-candidate,
.track-progress-candidate__name-row,
.track-progress-stage-timeline,
.track-progress-summary-card__counts,
.track-progress-summary-card__metrics,
.track-progress-summary-card__stack,
.track-progress-summary-card__split,
.track-progress-table-section__topbar,
.track-progress-table-section__tabs,
.track-progress-table-section__filters,
.track-progress-table__assessment,
.track-progress-table__cell-stack,
.track-progress-table__progress,
.track-progress-detail-card__head,
.track-progress-detail-card__title,
.track-progress-detail-card__title-row,
.track-progress-detail-card__head-actions,
.track-progress-detail-card__journey article,
.track-progress-detail-card__section-breakdown article,
.track-progress-detail-card__ai article,
.track-progress-detail-card__recommendation,
.track-progress-modal__footer,
.track-progress-modal__footer-actions {
  display: flex;
  align-items: center;
}

.track-progress-modal__head,
.track-progress-table-section__topbar,
.track-progress-detail-card__head,
.track-progress-modal__footer {
  justify-content: space-between;
}

.track-progress-modal__head {
  padding: 22px 28px 6px;
  border-bottom: 1px solid #eff3f8;
}

.track-progress-modal__head h2 {
  margin: 0;
  color: #243049;
  font-size: 1.1rem;
  font-weight: 800;
}

.track-progress-modal__head p {
  margin: 6px 0 0;
  color: #44516a;
  font-size: 0.94rem;
  font-weight: 600;
}

.track-progress-modal__head-actions {
  gap: 10px;
}

.track-progress-modal__head-actions button,
.track-progress-table-section__filters button,
.track-progress-detail-card__head-actions button,
.track-progress-table__action-cell button,
.track-progress-modal__footer-actions button {
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 14px;
  border: 1px solid #e0e7f1;
  border-radius: 10px;
  background: #fff;
  color: #4a556b;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.track-progress-modal__icon-button {
  width: 36px;
  padding: 0;
}

.track-progress-modal__body {
  overflow: auto;
  padding: 14px 28px 24px;
  background: #fbfcff;
}

.track-progress-stage-card,
.track-progress-summary-card,
.track-progress-table-wrap,
.track-progress-detail-card {
  border: 1px solid #e7edf5;
  border-radius: 16px;
  background: #fff;
}

.track-progress-stage-card {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  align-items: center;
  gap: 30px;
  padding: 18px 20px;
}

.track-progress-candidate {
  gap: 14px;
}

.track-progress-candidate__avatar {
  width: 58px;
  height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 58px;
  border: 2px solid #ff84c6;
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0 10px, transparent 11px),
    linear-gradient(135deg, #eef3fb 0%, #dfe8f4 100%);
  color: #33425d;
  font-size: 1rem;
  font-weight: 800;
}

.track-progress-candidate__meta {
  display: grid;
  gap: 4px;
}

.track-progress-candidate__name-row {
  gap: 10px;
}

.track-progress-candidate__name-row strong {
  color: #27334c;
  font-size: 0.98rem;
}

.track-progress-candidate__badge {
  padding: 3px 9px;
  border-radius: 999px;
  background: #ebfbf1;
  color: #2eb95f;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.track-progress-candidate__meta p,
.track-progress-candidate__meta small {
  margin: 0;
  color: #8491a9;
  font-size: 0.9rem;
}

.track-progress-stage-timeline {
  display: grid;
  grid-template-columns: repeat(6, minmax(108px, 1fr));
  gap: 0;
  margin-top: 0;
  padding-left: 0;
}

.track-progress-stage {
  position: relative;
  min-width: 0;
  display: grid;
  justify-items: start;
  gap: 4px;
  padding-right: 14px;
}

.track-progress-stage__node {
  position: relative;
  z-index: 1;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #dfe5ef;
  background: #fff;
  color: #9aa6ba;
  font-size: 0.84rem;
  font-weight: 800;
}

.track-progress-stage.is-complete .track-progress-stage__node {
  border-color: #29c15f;
  background: #29c15f;
  color: #fff;
}

.track-progress-stage.is-current .track-progress-stage__node {
  border-color: #f06db8;
  background: #f06db8;
  box-shadow: 0 0 0 4px rgba(240, 109, 184, 0.18);
  color: #fff;
}

.track-progress-stage strong {
  color: #303b54;
  font-size: 0.84rem;
}

.track-progress-stage small {
  color: #9aa5b6;
  font-size: 0.76rem;
}

.track-progress-stage.is-current strong,
.track-progress-stage.is-current small {
  color: #f06db8;
  font-weight: 800;
}

.track-progress-stage__line {
  position: absolute;
  top: 15px;
  left: 44px;
  right: 12px;
  height: 2px;
  background: #edf1f6;
}

.track-progress-summary-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.track-progress-summary-card {
  min-height: 96px;
  padding: 20px 22px;
}

.track-progress-summary-card__counts {
  gap: 16px;
}

.track-progress-summary-card__icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.track-progress-summary-card__icon.is-lavender {
  background: #f1f1ff;
  color: #6d66ff;
}

.track-progress-summary-card__metrics {
  flex: 1;
  justify-content: space-between;
  gap: 10px;
}

.track-progress-summary-card__metrics article {
  min-width: 0;
  text-align: center;
}

.track-progress-summary-card__metrics strong,
.track-progress-summary-card__split strong,
.track-progress-summary-card__stack strong {
  display: block;
  color: #2a3550;
  font-size: 0.98rem;
  font-weight: 800;
}

.track-progress-summary-card__metrics strong.is-danger {
  color: #ff5f64;
}

.track-progress-summary-card__metrics small,
.track-progress-summary-card__split p,
.track-progress-summary-card__stack p,
.track-progress-summary-card__stack small {
  display: block;
  margin-top: 4px;
  color: #a0a9b8;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.track-progress-summary-card__split,
.track-progress-summary-card__stack {
  justify-content: space-between;
  gap: 14px;
}

.track-progress-summary-card__split p,
.track-progress-summary-card__stack p {
  text-transform: none;
  font-size: 0.78rem;
}

.track-progress-summary-card__stack small {
  text-transform: none;
}

.track-progress-summary-card__ring {
  --ring-color: #30c164;
  position: relative;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--ring-color) var(--progress), #edf2f8 0);
}

.track-progress-summary-card__ring::before {
  content: '';
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #fff;
  box-shadow: inset 0 0 0 1px #eef2f6;
}

.track-progress-summary-card__ring span {
  position: absolute;
  color: #2d3a54;
  font-size: 0.9rem;
  font-weight: 800;
}

.track-progress-summary-card__ring.tone-green {
  --ring-color: #2cc15f;
}

.track-progress-summary-card__ring.tone-blue {
  --ring-color: #336cf5;
}

.track-progress-table-section {
  margin-top: 22px;
}

.track-progress-table-section__tabs {
  gap: 18px;
}

.track-progress-table-section__tabs button {
  position: relative;
  height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  color: #98a4b7;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.track-progress-table-section__tabs button.is-active {
  color: #f06db8;
}

.track-progress-table-section__tabs button.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -8px;
  height: 3px;
  border-radius: 999px;
  background: #f06db8;
}

.track-progress-table-section__tabs em {
  font-style: normal;
}

.track-progress-table-section__filters {
  gap: 10px;
}

.track-progress-table-wrap {
  margin-top: 18px;
  overflow: hidden;
}

.track-progress-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.track-progress-table thead {
  background: #fbfcfe;
}

.track-progress-table th,
.track-progress-table td {
  padding: 16px 14px;
  border-bottom: 1px solid #edf2f7;
  text-align: left;
}

.track-progress-table th {
  color: #a1abbb;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.track-progress-table th:nth-child(1),
.track-progress-table td:nth-child(1) {
  width: 24%;
}

.track-progress-table th:nth-child(2),
.track-progress-table td:nth-child(2) {
  width: 10%;
}

.track-progress-table th:nth-child(3),
.track-progress-table td:nth-child(3) {
  width: 11%;
}

.track-progress-table th:nth-child(4),
.track-progress-table td:nth-child(4) {
  width: 9%;
}

.track-progress-table th:nth-child(5),
.track-progress-table td:nth-child(5) {
  width: 9%;
}

.track-progress-table th:nth-child(6),
.track-progress-table td:nth-child(6) {
  width: 12%;
}

.track-progress-table th:nth-child(7),
.track-progress-table td:nth-child(7) {
  width: 7%;
}

.track-progress-table th:nth-child(8),
.track-progress-table td:nth-child(8) {
  width: 7%;
}

.track-progress-table th:nth-child(9),
.track-progress-table td:nth-child(9) {
  width: 11%;
}

.track-progress-table tbody tr {
  cursor: pointer;
}

.track-progress-table tbody tr.is-selected {
  background: #fffafc;
}

.track-progress-table__assessment {
  gap: 14px;
}

.track-progress-table__assessment > div {
  min-width: 0;
}

.track-progress-table__assessment-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  border-radius: 8px;
  font-size: 0.94rem;
  font-weight: 800;
}

.track-progress-table__assessment-icon.tone-green {
  background: #e9fbef;
  color: #2abf61;
}

.track-progress-table__assessment-icon.tone-blue {
  background: #ecf2ff;
  color: #3a6cf6;
}

.track-progress-table__assessment-icon.tone-orange {
  background: #fff1e8;
  color: #ff7b2f;
}

.track-progress-table__assessment strong,
.track-progress-table__cell-stack strong,
.track-progress-detail-card__details strong,
.track-progress-detail-card__journey strong,
.track-progress-detail-card__recommendation strong {
  color: #2a3550;
}

.track-progress-table__assessment small,
.track-progress-table__cell-stack small,
.track-progress-table-section__timezone,
.track-progress-detail-card__journey small,
.track-progress-detail-card__details span,
.track-progress-detail-card__ai p,
.track-progress-detail-card__recommendation small,
.track-progress-detail-card__score-grid small,
.track-progress-detail-card__score-grid em {
  color: #9ba7b8;
}

.track-progress-table__cell-stack {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.track-progress-table__assessment strong,
.track-progress-table__assessment small,
.track-progress-table__cell-stack strong,
.track-progress-table__cell-stack small {
  overflow-wrap: anywhere;
}

.track-progress-status-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.track-progress-status-badge.is-completed {
  background: #e8faf0;
  color: #2dbd61;
}

.track-progress-status-badge.is-progress {
  background: #eef2ff;
  color: #3a6cf6;
}

.track-progress-status-badge.is-overdue {
  background: #ffefef;
  color: #ff5f64;
}

.track-progress-table__cell-stack .is-danger {
  color: #ff5f64;
}

.track-progress-table__cell-stack .is-success {
  color: #25bb5c;
}

.track-progress-table__progress {
  gap: 10px;
  min-width: 0;
}

.track-progress-table__progress span,
.track-progress-detail-card__bar {
  width: 74px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #eef2f7;
}

.track-progress-table__progress i,
.track-progress-detail-card__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.track-progress-table__progress i.tone-completed,
.track-progress-detail-card__bar i {
  background: #2fc160;
}

.track-progress-table__progress i.tone-progress {
  background: #356cf7;
}

.track-progress-table__progress i.tone-overdue {
  background: #e6e9ef;
}

.track-progress-table__action-cell button.is-accent {
  border-color: #d8d9ff;
  background: #f5f4ff;
  color: #5d62ff;
}

.track-progress-table__action-cell {
  text-align: right;
}

.track-progress-table__action-cell button {
  min-width: 152px;
}

.track-progress-table-section__timezone {
  margin: 12px 0 0;
  font-size: 0.78rem;
  font-style: italic;
}

.track-progress-detail-card {
  margin-top: 26px;
  overflow: hidden;
}

.track-progress-detail-card__head {
  padding: 20px 18px;
  border-bottom: 1px solid #edf2f7;
}

.track-progress-detail-card__title {
  gap: 14px;
}

.track-progress-detail-card__title-row {
  gap: 10px;
}

.track-progress-detail-card__title-row span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff1f8;
  color: #f06db8;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.track-progress-detail-card__title small {
  color: #99a5b8;
}

.track-progress-detail-card__head-actions {
  gap: 10px;
}

.track-progress-detail-card__head-actions button:first-child {
  color: #f06db8;
  border-color: #ffcde4;
}

.track-progress-detail-card__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr 0.95fr;
  gap: 32px;
  padding: 26px 18px 22px;
}

.track-progress-detail-card__journey,
.track-progress-detail-card__stats,
.track-progress-detail-card__insights {
  display: grid;
  gap: 26px;
  align-content: start;
}

.track-progress-detail-card h4 {
  margin: 0 0 18px;
  color: #344057;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.track-progress-detail-card__journey article {
  gap: 12px;
  margin-bottom: 14px;
  align-items: flex-start;
}

.track-progress-detail-card__journey span {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  border-radius: 50%;
  background: #eef2f7;
  color: #b6c0ce;
}

.track-progress-detail-card__journey span.is-done {
  background: #2fc160;
  color: #fff;
}

.track-progress-detail-card__journey span i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.track-progress-detail-card__section-breakdown article {
  display: grid;
  grid-template-columns: 120px 1fr 46px 42px;
  gap: 12px;
  margin-bottom: 14px;
}

.track-progress-detail-card__section-breakdown b {
  color: #35415b;
}

.track-progress-detail-card__score-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
}

.track-progress-detail-card__score-grid article {
  display: grid;
  gap: 6px;
}

.track-progress-detail-card__score-grid strong {
  color: #222f48;
  font-size: 1.05rem;
  font-weight: 800;
}

.track-progress-detail-card__score-grid strong.is-pink {
  color: #f06db8;
  font-size: 1.55rem;
}

.track-progress-detail-card__score-grid em {
  font-style: normal;
  font-size: 0.88rem;
}

.track-progress-detail-card__score-grid article:first-child em {
  color: #2fc160;
  font-weight: 800;
}

.track-progress-detail-card__details article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  margin-bottom: 12px;
}

.track-progress-detail-card__ai {
  padding: 18px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  background: #fbfcfe;
}

.track-progress-detail-card__ai article {
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.track-progress-detail-card__ai article:last-child {
  margin-bottom: 0;
}

.track-progress-detail-card__ai span {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  border-radius: 50%;
}

.track-progress-detail-card__ai span.tone-green {
  background: #ecfbf2;
  color: #2fc160;
}

.track-progress-detail-card__ai span.tone-amber {
  background: #fff5e8;
  color: #f4a331;
}

.track-progress-detail-card__recommendation {
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  border: 1px solid #ffd9e9;
  border-radius: 14px;
  background: #fff;
}

.track-progress-detail-card__recommendation small,
.track-progress-detail-card__recommendation strong {
  display: block;
}

.track-progress-detail-card__recommendation span {
  color: #2fc160;
}

.track-progress-modal__footer {
  padding: 18px 28px 22px;
  border-top: 1px solid #edf2f7;
  background: #fff;
}

.track-progress-modal__primary {
  height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #f26db7 0%, #e95ea9 100%);
  color: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(233, 94, 169, 0.18);
}

.track-progress-modal__footer-actions {
  gap: 10px;
}

@media (max-width: 1280px) {
  .track-progress-stage-card {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .track-progress-stage-timeline {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 8px;
  }

  .track-progress-stage__line {
    display: none;
  }

  .track-progress-summary-grid,
  .track-progress-detail-card__grid {
    grid-template-columns: 1fr 1fr;
  }

  .track-progress-detail-card__insights {
    grid-column: 1 / -1;
  }
}

@media (max-width: 980px) {
  .track-progress-overlay {
    padding: 12px;
  }

  .track-progress-modal__head,
  .track-progress-modal__body,
  .track-progress-modal__footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .track-progress-modal__head,
  .track-progress-table-section__topbar,
  .track-progress-modal__footer {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .track-progress-summary-grid,
  .track-progress-detail-card__grid {
    grid-template-columns: 1fr;
  }

  .track-progress-table-wrap {
    overflow-x: auto;
  }

  .track-progress-table {
    min-width: 980px;
  }

  .track-progress-modal__footer-actions {
    justify-content: stretch;
  }

  .track-progress-modal__footer-actions button,
  .track-progress-modal__primary {
    width: 100%;
  }
}
</style>
