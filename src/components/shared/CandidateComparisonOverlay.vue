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

const selectedAssessmentId = ref('hackerrank')
const selectedCandidateId = ref('primary')

const candidates = computed(() => [
  {
    id: 'primary',
    name: props.candidateName || 'John Doe',
    status: 'completed',
    statusLabel: 'Completed',
    note: 'Apr 30, 2025',
    score: '92%',
    percentile: '98th',
    rank: '#1 of 4',
    completedOn: 'Apr 30, 2025 10:07 AM',
    statusTone: 'green',
    avatarTone: 'bronze',
    avatar: candidateInitials.value,
    action: 'View Results',
    overdueCopy: '',
  },
  {
    id: 'sarah',
    name: 'Sarah Lee',
    status: 'completed',
    statusLabel: 'Completed',
    note: 'Apr 30, 2025',
    score: '89%',
    percentile: '93rd',
    rank: '2',
    completedOn: 'Apr 30, 2025 03:45 PM',
    statusTone: 'blue',
    avatarTone: 'teal',
    avatar: 'SL',
    action: 'View Results',
    overdueCopy: '',
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    status: 'progress',
    statusLabel: 'In Progress',
    note: 'Started May 2, 2025',
    score: '—',
    percentile: '—',
    rank: '—',
    completedOn: 'Started May 2, 2025',
    statusTone: 'orange',
    avatarTone: 'sand',
    avatar: 'AC',
    action: 'View Progress',
    overdueCopy: '',
  },
  {
    id: 'maya',
    name: 'Maya Ali',
    status: 'overdue',
    statusLabel: 'Overdue',
    note: 'Due Apr 30, 2025',
    score: '—',
    percentile: '—',
    rank: '—',
    completedOn: 'Due Apr 30, 2025',
    statusTone: 'rose',
    avatarTone: 'gold',
    avatar: 'MA',
    action: 'Send Reminder',
    overdueCopy: 'Overdue by 1 day',
  },
])

const assessments = [
  {
    id: 'hackerrank',
    title: 'HackerRank Coding Test',
    subtitle: 'Coding Assessment',
    completedBy: 'Completed by: 2 / 4',
    status: 'Completed',
    tone: 'green',
    icon: 'document',
  },
  {
    id: 'testgorilla',
    title: 'TestGorilla Cognitive',
    subtitle: 'Cognitive Ability Test',
    completedBy: 'Completed by: 3 / 4',
    status: 'Completed',
    tone: 'green',
    icon: 'target',
  },
  {
    id: 'shl',
    title: 'SHL Numerical Reasoning',
    subtitle: 'Numerical Reasoning Test',
    completedBy: 'Completed by: 1 / 4',
    status: 'In Progress',
    tone: 'orange',
    icon: 'chart-bars',
  },
  {
    id: 'alva',
    title: 'Alva Personality',
    subtitle: 'Personality Assessment',
    completedBy: 'Completed by: 0 / 4',
    status: 'Overdue',
    tone: 'rose',
    icon: 'calendar',
  },
]

const sectionBreakdown = [
  { label: 'Algorithms', primary: 95, secondary: 90, top: '95%' },
  { label: 'Data Structures', primary: 91, secondary: 88, top: '91%' },
  { label: 'System Design', primary: 94, secondary: 89, top: '94%' },
  { label: 'SQL', primary: 93, secondary: 92, top: '93%' },
  { label: 'Code Quality', primary: 92, secondary: 87, top: '92%' },
]

const summaryItems = [
  {
    id: 'top',
    icon: 'chart-bars',
    tone: 'green',
    text: `${props.candidateName || 'John Doe'} is the top performer with a 92% score and 98th percentile.`,
  },
  {
    id: 'done',
    icon: 'briefcase',
    tone: 'blue',
    text: 'Both John Doe and Sarah Lee have cleared the assessment.',
  },
  {
    id: 'pending',
    icon: 'clock',
    tone: 'amber',
    text: '2 candidates have not completed the assessment yet.',
  },
  {
    id: 'overdue',
    icon: 'alert',
    tone: 'rose',
    text: '1 assessment is overdue. Consider sending a reminder.',
  },
]

const selectedCandidate = computed(() => (
  candidates.value.find((candidate) => candidate.id === selectedCandidateId.value)
  ?? candidates.value[0]
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
    selectedAssessmentId.value = 'hackerrank'
    selectedCandidateId.value = 'primary'
  }
})

function closeOverlay() {
  emit('close')
}

function scoreWidth(value) {
  return `${value}%`
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="candidate-comparison-overlay" @click.self="closeOverlay">
      <section class="candidate-comparison-modal">
        <header class="candidate-comparison__head">
          <div class="candidate-comparison__head-copy">
            <button type="button" class="candidate-comparison__back" @click="closeOverlay">
              <AppIcon name="chevronLeft" :size="16" />
              <span>Back to Assessments</span>
            </button>
            <h2>Candidate Comparison</h2>
            <p>Compare candidate performance for a selected assessment.</p>
          </div>

          <div class="candidate-comparison__head-actions">
            <button type="button">
              <AppIcon name="share" :size="15" />
              <span>Share</span>
            </button>
            <button type="button">
              <AppIcon name="document" :size="15" />
              <span>Export</span>
            </button>
            <button class="candidate-comparison__icon-button" type="button">
              <AppIcon name="more" :size="17" />
            </button>
          </div>
        </header>

        <div class="candidate-comparison__body">
          <section class="candidate-comparison__selected-row">
            <article class="candidate-comparison__selected-card candidate-comparison__selected-card--summary">
              <strong>4 Candidates Selected</strong>
              <span>Backend Engineer Role</span>
              <button type="button">Manage Candidates</button>
            </article>

            <article
              v-for="candidate in candidates"
              :key="candidate.id"
              class="candidate-comparison__selected-card"
              :class="{ 'is-active': selectedCandidateId === candidate.id }"
              @click="selectedCandidateId = candidate.id"
            >
              <span class="candidate-comparison__avatar" :class="`tone-${candidate.avatarTone}`">{{ candidate.avatar }}</span>
              <div class="candidate-comparison__selected-copy">
                <div class="candidate-comparison__selected-name">
                  <span class="candidate-comparison__status-dot" :class="`tone-${candidate.statusTone}`" />
                  <strong>{{ candidate.name }}</strong>
                </div>
                <small>{{ candidate.statusLabel }}</small>
                <small>{{ candidate.note }}</small>
              </div>
              <button class="candidate-comparison__dismiss" type="button">
                <AppIcon name="close" :size="14" />
              </button>
            </article>

            <button class="candidate-comparison__add-card" type="button">
              <AppIcon name="plus" :size="18" />
              <strong>Add Candidate</strong>
              <span>Add up to 6 candidates</span>
            </button>
          </section>

          <section class="candidate-comparison__section">
            <div class="candidate-comparison__section-head">
              <h3>1. Select Assessment to Compare</h3>
              <button type="button">
                <AppIcon name="list" :size="15" />
                <span>View All Assessments</span>
              </button>
            </div>

            <div class="candidate-comparison__assessment-grid">
              <article
                v-for="assessment in assessments"
                :key="assessment.id"
                class="candidate-comparison__assessment-card"
                :class="{ 'is-active': selectedAssessmentId === assessment.id }"
                @click="selectedAssessmentId = assessment.id"
              >
                <span class="candidate-comparison__assessment-icon" :class="`tone-${assessment.tone}`">
                  <AppIcon :name="assessment.icon" :size="18" />
                </span>
                <div class="candidate-comparison__assessment-copy">
                  <div class="candidate-comparison__assessment-title">
                    <strong>{{ assessment.title }}</strong>
                    <em :class="`tone-${assessment.tone}`">{{ assessment.status }}</em>
                  </div>
                  <small>{{ assessment.subtitle }}</small>
                  <span>{{ assessment.completedBy }}</span>
                </div>
              </article>
            </div>
          </section>

          <section class="candidate-comparison__section">
            <div class="candidate-comparison__comparison-head">
              <div>
                <h3>2. Comparison: HackerRank Coding Test</h3>
                <div class="candidate-comparison__comparison-meta">
                  <em>Completed</em>
                  <span>Completed by 2 of 4 candidates</span>
                </div>
              </div>
              <h3>3. Pending / Delayed (2)</h3>
            </div>

            <div class="candidate-comparison__comparison-grid">
              <article class="candidate-comparison__top-match">
                <div class="candidate-comparison__top-match-head">
                  <AppIcon name="spark" :size="18" />
                  <strong>Top Match</strong>
                </div>
                <span class="candidate-comparison__top-match-avatar tone-bronze">{{ selectedCandidate.avatar }}</span>
                <h4>{{ selectedCandidate.name }}</h4>

                <div class="candidate-comparison__top-match-stats">
                  <div><span>Score:</span><strong>92%</strong></div>
                  <div><span>Percentile:</span><strong>98th</strong></div>
                  <div><span>Rank:</span><strong>#1 of 4</strong></div>
                </div>

                <p>Highest overall score with strongest performance in key sections.</p>
                <button type="button">View Full Profile</button>
              </article>

              <div class="candidate-comparison__table-wrap">
                <table class="candidate-comparison__table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Status</th>
                      <th>Overall Score</th>
                      <th>Percentile</th>
                      <th>Rank</th>
                      <th>Time Taken</th>
                      <th>Completed On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="candidate in candidates" :key="`${candidate.id}-row`">
                      <td>
                        <div class="candidate-comparison__candidate-cell">
                          <span class="candidate-comparison__avatar candidate-comparison__avatar--small" :class="`tone-${candidate.avatarTone}`">{{ candidate.avatar }}</span>
                          <strong>{{ candidate.name }}</strong>
                        </div>
                      </td>
                      <td>
                        <span class="candidate-comparison__pill" :class="`tone-${candidate.statusTone}`">{{ candidate.statusLabel }}</span>
                      </td>
                      <td>
                        <div v-if="candidate.status === 'completed'" class="candidate-comparison__metric">
                          <strong :class="candidate.id === 'primary' ? 'is-green' : 'is-blue'">{{ candidate.score }}</strong>
                          <span><i :style="{ width: scoreWidth(candidate.id === 'primary' ? 92 : 89) }" :class="candidate.id === 'primary' ? 'is-green' : 'is-blue'" /></span>
                        </div>
                        <span v-else>—</span>
                      </td>
                      <td>{{ candidate.percentile }}</td>
                      <td>
                        <span v-if="candidate.status === 'completed'" class="candidate-comparison__rank">
                          <AppIcon name="tag" :size="13" />
                          <strong>{{ candidate.rank }}</strong>
                        </span>
                        <span v-else>—</span>
                      </td>
                      <td>
                        <template v-if="candidate.id === 'primary'">47 min</template>
                        <template v-else-if="candidate.id === 'sarah'">53 min</template>
                        <template v-else-if="candidate.id === 'alex'">Started<br>May 2, 2025</template>
                        <template v-else>Due<br>Apr 30, 2025</template>
                      </td>
                      <td>{{ candidate.completedOn }}</td>
                      <td class="candidate-comparison__action-cell">
                        <button type="button" :class="{ 'is-warning': candidate.status === 'overdue', 'is-soft': candidate.status === 'progress' }">
                          {{ candidate.action }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <aside class="candidate-comparison__pending-stack">
                <article class="candidate-comparison__pending-card">
                  <div class="candidate-comparison__pending-head">
                    <div class="candidate-comparison__pending-candidate">
                      <span class="candidate-comparison__avatar candidate-comparison__avatar--small tone-sand">AC</span>
                      <div>
                        <strong>Alex Chen</strong>
                        <small>Started 2 days ago</small>
                      </div>
                    </div>
                    <span class="candidate-comparison__pill tone-orange">In Progress</span>
                  </div>
                  <p>May 2, 2025 09:15 AM</p>
                  <button type="button"><AppIcon name="bell" :size="14" /> <span>Send Reminder</span></button>
                </article>

                <article class="candidate-comparison__pending-card">
                  <div class="candidate-comparison__pending-head">
                    <div class="candidate-comparison__pending-candidate">
                      <span class="candidate-comparison__avatar candidate-comparison__avatar--small tone-gold">MA</span>
                      <div>
                        <strong>Maya Ali</strong>
                        <small class="is-danger">Overdue by 1 day</small>
                      </div>
                    </div>
                    <span class="candidate-comparison__pill tone-rose">Overdue</span>
                  </div>
                  <p>Due Apr 30, 2025</p>
                  <button type="button"><AppIcon name="bell" :size="14" /> <span>Send Reminder</span></button>
                </article>

                <button class="candidate-comparison__view-all" type="button">
                  <AppIcon name="users" :size="15" />
                  <span>View All Candidates</span>
                </button>
              </aside>
            </div>
          </section>

          <section class="candidate-comparison__footer-grid">
            <article class="candidate-comparison__breakdown-card">
              <h3>4. Section Breakdown <small>(Completed Candidates Only)</small></h3>
              <div class="candidate-comparison__breakdown-head">
                <span>Section</span>
                <span><i class="tone-green" /> John Doe (92%)</span>
                <span><i class="tone-blue" /> Sarah Lee (89%)</span>
                <span>Highest Score</span>
              </div>

              <div class="candidate-comparison__breakdown-list">
                <article v-for="row in sectionBreakdown" :key="row.label">
                  <strong>{{ row.label }}</strong>
                  <div class="candidate-comparison__breakdown-bar">
                    <span>{{ row.primary }}%</span>
                    <em><i class="is-green" :style="{ width: scoreWidth(row.primary) }" /></em>
                  </div>
                  <div class="candidate-comparison__breakdown-bar">
                    <span>{{ row.secondary }}%</span>
                    <em><i class="is-blue" :style="{ width: scoreWidth(row.secondary) }" /></em>
                  </div>
                  <b>{{ row.top }}</b>
                </article>
              </div>

              <p>* Section breakdown is shown only for candidates who completed the assessment.</p>
            </article>

            <article class="candidate-comparison__summary-card">
              <h3>5. Assessment Summary</h3>
              <div class="candidate-comparison__summary-list">
                <article v-for="item in summaryItems" :key="item.id">
                  <span :class="`tone-${item.tone}`"><AppIcon :name="item.icon" :size="15" /></span>
                  <p>{{ item.text }}</p>
                </article>
              </div>
            </article>

            <article class="candidate-comparison__actions-card">
              <h3>6. Quick Actions</h3>
              <button class="candidate-comparison__action-card is-primary" type="button">
                <span class="candidate-comparison__action-icon"><AppIcon name="bell" :size="17" /></span>
                <div>
                  <strong>Move Top Performer</strong>
                  <small>Move {{ props.candidateName || 'John Doe' }} to Technical Interview</small>
                </div>
                <AppIcon name="chevronRight" :size="18" />
              </button>
              <button class="candidate-comparison__action-card" type="button">
                <span class="candidate-comparison__action-icon"><AppIcon name="bell" :size="17" /></span>
                <div>
                  <strong>Send Reminder to All Pending</strong>
                  <small>Send reminders to 2 candidates</small>
                </div>
                <AppIcon name="chevronRight" :size="18" />
              </button>
              <button class="candidate-comparison__action-card" type="button">
                <span class="candidate-comparison__action-icon"><AppIcon name="document" :size="17" /></span>
                <div>
                  <strong>Export Comparison Report</strong>
                  <small>Download detailed comparison</small>
                </div>
                <AppIcon name="chevronRight" :size="18" />
              </button>
            </article>
          </section>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.candidate-comparison-overlay {
  position: fixed;
  inset: 0;
  z-index: 1470;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(229, 236, 246, 0.76);
  backdrop-filter: blur(4px);
}

.candidate-comparison-modal {
  width: min(100%, 1580px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  border: 1px solid #dfe6f0;
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(19, 31, 54, 0.18);
  background: #f7f9fd;
}

.candidate-comparison__head,
.candidate-comparison__head-actions,
.candidate-comparison__selected-row,
.candidate-comparison__selected-card,
.candidate-comparison__selected-name,
.candidate-comparison__section-head,
.candidate-comparison__comparison-head,
.candidate-comparison__head-actions button,
.candidate-comparison__assessment-title,
.candidate-comparison__candidate-cell,
.candidate-comparison__metric,
.candidate-comparison__rank,
.candidate-comparison__pending-head,
.candidate-comparison__pending-candidate,
.candidate-comparison__pending-card button,
.candidate-comparison__view-all,
.candidate-comparison__breakdown-head,
.candidate-comparison__breakdown-list article,
.candidate-comparison__breakdown-bar,
.candidate-comparison__summary-list article,
.candidate-comparison__action-card,
.candidate-comparison__back {
  display: flex;
  align-items: center;
}

.candidate-comparison__head,
.candidate-comparison__section-head,
.candidate-comparison__comparison-head {
  justify-content: space-between;
}

.candidate-comparison__head {
  padding: 32px 32px 16px;
  border-bottom: 1px solid #e1e8f2;
  background: #f7f9fd;
}

.candidate-comparison__head-copy h2,
.candidate-comparison__section h3,
.candidate-comparison__top-match h4,
.candidate-comparison__summary-card h3,
.candidate-comparison__actions-card h3,
.candidate-comparison__breakdown-card h3 {
  margin: 0;
  color: #202a3f;
}

.candidate-comparison__head-copy h2 {
  margin-top: 6px;
  font-size: 1.3rem;
  font-weight: 800;
}

.candidate-comparison__head-copy p {
  margin: 4px 0 0;
  color: #6f7b90;
  font-size: 0.98rem;
}

.candidate-comparison__back {
  gap: 6px;
  border: 0;
  background: transparent;
  color: #4972ff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-comparison__head-actions {
  gap: 12px;
}

.candidate-comparison__head-actions button,
.candidate-comparison__section-head button,
.candidate-comparison__action-cell button {
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #d9e2ef;
  border-radius: 10px;
  background: #fff;
  color: #36445e;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-comparison__icon-button {
  width: 38px;
  padding: 0;
  justify-content: center;
}

.candidate-comparison__body {
  overflow: auto;
  padding: 18px 32px 32px;
}

.candidate-comparison__selected-row {
  gap: 16px;
  align-items: stretch;
}

.candidate-comparison__selected-card,
.candidate-comparison__add-card,
.candidate-comparison__assessment-card,
.candidate-comparison__top-match,
.candidate-comparison__table-wrap,
.candidate-comparison__pending-card,
.candidate-comparison__breakdown-card,
.candidate-comparison__summary-card,
.candidate-comparison__actions-card {
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #fff;
}

.candidate-comparison__selected-card {
  position: relative;
  gap: 14px;
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  align-items: flex-start;
  cursor: pointer;
}

.candidate-comparison__selected-card--summary {
  width: 244px;
  flex: 0 0 244px;
  display: grid;
  align-content: center;
  gap: 6px;
  cursor: default;
}

.candidate-comparison__selected-card--summary button {
  width: fit-content;
  padding: 0;
  border: 0;
  background: transparent;
  color: #3f6cff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-comparison__selected-card.is-active {
  border-color: #4072ff;
  box-shadow: 0 0 0 1px rgba(64, 114, 255, 0.18);
}

.candidate-comparison__selected-copy {
  display: grid;
  gap: 2px;
}

.candidate-comparison__selected-copy small,
.candidate-comparison__assessment-copy small,
.candidate-comparison__assessment-copy span,
.candidate-comparison__pending-card p,
.candidate-comparison__top-match p,
.candidate-comparison__action-card small,
.candidate-comparison__summary-list p,
.candidate-comparison__breakdown-card p {
  color: #95a1b5;
}

.candidate-comparison__selected-name {
  gap: 8px;
}

.candidate-comparison__status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.candidate-comparison__status-dot.tone-green {
  background: #2dc05f;
}

.candidate-comparison__status-dot.tone-blue {
  background: #4a7aff;
}

.candidate-comparison__status-dot.tone-orange {
  background: #f59a4c;
}

.candidate-comparison__status-dot.tone-rose {
  background: #ef6d84;
}

.candidate-comparison__dismiss {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #a3aec0;
  cursor: pointer;
}

.candidate-comparison__avatar {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 46px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.96rem;
  font-weight: 800;
}

.candidate-comparison__avatar--small {
  width: 34px;
  height: 34px;
  flex-basis: 34px;
  font-size: 0.8rem;
}

.candidate-comparison__avatar.tone-bronze {
  background: linear-gradient(135deg, #f7a33f 0%, #7f4211 100%);
}

.candidate-comparison__avatar.tone-teal {
  background: linear-gradient(135deg, #d8c16b 0%, #5ac0a8 100%);
}

.candidate-comparison__avatar.tone-sand {
  background: linear-gradient(135deg, #ffd892 0%, #73c1c6 100%);
}

.candidate-comparison__avatar.tone-gold {
  background: linear-gradient(135deg, #ffd99c 0%, #8f7a4f 100%);
}

.candidate-comparison__add-card {
  width: 244px;
  flex: 0 0 244px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  border-style: dashed;
  color: #596987;
  cursor: pointer;
}

.candidate-comparison__section {
  margin-top: 28px;
}

.candidate-comparison__section-head {
  margin-bottom: 16px;
}

.candidate-comparison__section-head button,
.candidate-comparison__view-all {
  border: 0;
  background: transparent;
  color: #3768ff;
}

.candidate-comparison__assessment-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.candidate-comparison__assessment-card {
  display: flex;
  gap: 14px;
  min-width: 0;
  padding: 16px;
  cursor: pointer;
}

.candidate-comparison__assessment-card.is-active {
  border-color: #3f72ff;
  box-shadow: 0 0 0 1px rgba(63, 114, 255, 0.16);
}

.candidate-comparison__assessment-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.candidate-comparison__assessment-icon.tone-green {
  background: #eaf9f0;
  color: #2dc05f;
}

.candidate-comparison__assessment-icon.tone-orange {
  background: #fff3e8;
  color: #f59a4c;
}

.candidate-comparison__assessment-icon.tone-rose {
  background: #fff0f2;
  color: #ef6d84;
}

.candidate-comparison__assessment-copy {
  min-width: 0;
}

.candidate-comparison__assessment-title {
  gap: 10px;
  margin-bottom: 4px;
}

.candidate-comparison__assessment-title em,
.candidate-comparison__comparison-meta em,
.candidate-comparison__pill {
  padding: 4px 9px;
  border-radius: 8px;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.candidate-comparison__assessment-title em.tone-green,
.candidate-comparison__comparison-meta em,
.candidate-comparison__pill.tone-green {
  background: #eaf9f0;
  color: #2dc05f;
}

.candidate-comparison__assessment-title em.tone-orange,
.candidate-comparison__pill.tone-orange {
  background: #fff3e8;
  color: #f59a4c;
}

.candidate-comparison__assessment-title em.tone-rose,
.candidate-comparison__pill.tone-rose {
  background: #fff0f2;
  color: #ef6d84;
}

.candidate-comparison__comparison-head {
  margin-bottom: 18px;
  align-items: flex-start;
}

.candidate-comparison__comparison-meta {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  color: #7d899e;
}

.candidate-comparison__comparison-grid {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr) 348px;
  gap: 22px;
  align-items: start;
}

.candidate-comparison__top-match {
  padding: 24px 22px;
  background: linear-gradient(180deg, #f0fbf4 0%, #f7fcf9 100%);
}

.candidate-comparison__top-match-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #27c05d;
  font-weight: 800;
}

.candidate-comparison__top-match-avatar {
  margin: 22px auto 0;
  width: 76px;
  height: 76px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
}

.candidate-comparison__top-match h4 {
  margin-top: 18px;
  text-align: center;
  font-size: 1.05rem;
}

.candidate-comparison__top-match-stats {
  display: grid;
  gap: 10px;
  margin-top: 26px;
}

.candidate-comparison__top-match-stats div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.candidate-comparison__top-match p {
  margin-top: 22px;
  line-height: 1.6;
  text-align: center;
}

.candidate-comparison__top-match button {
  width: 100%;
  height: 42px;
  margin-top: 28px;
  border: 1px solid #bfe9cb;
  border-radius: 12px;
  background: #fff;
  color: #25bc5b;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.candidate-comparison__table-wrap {
  overflow: hidden;
}

.candidate-comparison__table {
  width: 100%;
  border-collapse: collapse;
}

.candidate-comparison__table th,
.candidate-comparison__table td {
  padding: 16px 18px;
  border-bottom: 1px solid #edf2f8;
  text-align: left;
  vertical-align: middle;
}

.candidate-comparison__table th {
  color: #9aa5b7;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.candidate-comparison__candidate-cell {
  gap: 10px;
}

.candidate-comparison__metric {
  gap: 10px;
}

.candidate-comparison__metric span {
  width: 62px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf2f8;
}

.candidate-comparison__metric i {
  display: block;
  height: 100%;
}

.candidate-comparison__metric i.is-green {
  background: #2dc05f;
}

.candidate-comparison__metric i.is-blue {
  background: #4679ff;
}

.candidate-comparison__metric strong.is-green {
  color: #2dc05f;
}

.candidate-comparison__metric strong.is-blue {
  color: #4679ff;
}

.candidate-comparison__rank {
  gap: 6px;
  color: #f29a18;
}

.candidate-comparison__action-cell button.is-warning {
  border-color: #ffd7d7;
  background: #fff6f6;
  color: #ef6d84;
}

.candidate-comparison__action-cell button.is-soft {
  color: #3f72ff;
}

.candidate-comparison__pending-stack {
  display: grid;
  gap: 16px;
}

.candidate-comparison__pending-card {
  display: grid;
  gap: 14px;
  padding: 18px;
}

.candidate-comparison__pending-head {
  justify-content: space-between;
  align-items: flex-start;
}

.candidate-comparison__pending-candidate {
  gap: 10px;
}

.candidate-comparison__pending-card p {
  margin: 0;
}

.candidate-comparison__pending-card button {
  justify-content: center;
  height: 36px;
  border: 1px solid #cfe0ff;
  border-radius: 10px;
  background: #fff;
  color: #3f72ff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.candidate-comparison__view-all {
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.candidate-comparison__footer-grid {
  display: grid;
  grid-template-columns: 1.08fr 1.08fr 0.92fr;
  gap: 22px;
  margin-top: 34px;
}

.candidate-comparison__breakdown-card,
.candidate-comparison__summary-card,
.candidate-comparison__actions-card {
  padding: 22px;
}

.candidate-comparison__breakdown-card h3 small {
  color: #a0abbd;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.candidate-comparison__breakdown-head {
  justify-content: space-between;
  gap: 14px;
  margin-top: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid #edf2f8;
  color: #9aa5b7;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.candidate-comparison__breakdown-head i {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 50%;
  margin-right: 6px;
}

.candidate-comparison__breakdown-head i.tone-green {
  background: #2dc05f;
}

.candidate-comparison__breakdown-head i.tone-blue {
  background: #4679ff;
}

.candidate-comparison__breakdown-list {
  margin-top: 8px;
}

.candidate-comparison__breakdown-list article {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1.2fr auto;
  gap: 14px;
  padding: 14px 0;
}

.candidate-comparison__breakdown-bar {
  gap: 10px;
}

.candidate-comparison__breakdown-bar em {
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf2f8;
}

.candidate-comparison__breakdown-bar i {
  display: block;
  height: 100%;
}

.candidate-comparison__breakdown-bar i.is-green {
  background: #2dc05f;
}

.candidate-comparison__breakdown-bar i.is-blue {
  background: #4679ff;
}

.candidate-comparison__breakdown-card p {
  margin: 18px 0 0;
  font-size: 0.78rem;
  font-style: italic;
}

.candidate-comparison__summary-list {
  display: grid;
  gap: 20px;
  margin-top: 28px;
}

.candidate-comparison__summary-list article {
  align-items: flex-start;
  gap: 14px;
}

.candidate-comparison__summary-list span {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 38px;
  border-radius: 50%;
}

.candidate-comparison__summary-list span.tone-green {
  background: #edf9f1;
  color: #2dc05f;
}

.candidate-comparison__summary-list span.tone-blue {
  background: #edf2ff;
  color: #4679ff;
}

.candidate-comparison__summary-list span.tone-amber {
  background: #fff6e7;
  color: #f3a128;
}

.candidate-comparison__summary-list span.tone-rose {
  background: #fff0f2;
  color: #ef6d84;
}

.candidate-comparison__action-card {
  gap: 14px;
  width: 100%;
  margin-top: 18px;
  padding: 18px 16px;
  justify-content: space-between;
  text-align: left;
  border-radius: 14px;
  cursor: pointer;
}

.candidate-comparison__action-card:first-of-type {
  margin-top: 26px;
}

.candidate-comparison__action-card.is-primary {
  border-color: transparent;
  background: linear-gradient(90deg, #f46fb8 0%, #ea63ad 100%);
  color: #fff;
  box-shadow: 0 18px 36px rgba(234, 99, 173, 0.2);
}

.candidate-comparison__action-card.is-primary small,
.candidate-comparison__action-card.is-primary strong {
  color: #fff;
}

.candidate-comparison__action-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  border-radius: 12px;
  background: #f4f7fc;
  color: #4679ff;
}

.candidate-comparison__action-card.is-primary .candidate-comparison__action-icon {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.candidate-comparison__action-card > div {
  flex: 1;
}

.candidate-comparison__action-card strong {
  display: block;
  color: #253149;
}

.candidate-comparison__action-card small {
  display: block;
  margin-top: 4px;
}

.is-danger {
  color: #ef6d84;
}

@media (max-width: 1380px) {
  .candidate-comparison__assessment-grid,
  .candidate-comparison__footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .candidate-comparison__actions-card {
    grid-column: 1 / -1;
  }

  .candidate-comparison__comparison-grid {
    grid-template-columns: 260px minmax(0, 1fr);
  }

  .candidate-comparison__pending-stack {
    grid-column: 1 / -1;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1120px) {
  .candidate-comparison__selected-row,
  .candidate-comparison__assessment-grid,
  .candidate-comparison__comparison-grid,
  .candidate-comparison__footer-grid {
    grid-template-columns: 1fr;
    display: grid;
  }

  .candidate-comparison__selected-card--summary,
  .candidate-comparison__add-card {
    width: auto;
    flex-basis: auto;
  }

  .candidate-comparison__head,
  .candidate-comparison__comparison-head,
  .candidate-comparison__section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .candidate-comparison__table-wrap {
    overflow-x: auto;
  }

  .candidate-comparison__table {
    min-width: 860px;
  }
}

@media (max-width: 720px) {
  .candidate-comparison-overlay {
    padding: 10px;
  }

  .candidate-comparison-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 18px;
  }

  .candidate-comparison__head,
  .candidate-comparison__body {
    padding-left: 16px;
    padding-right: 16px;
  }

  .candidate-comparison__head-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .candidate-comparison__head-actions button {
    flex: 1;
  }

  .candidate-comparison__breakdown-list article {
    grid-template-columns: 1fr;
  }

  .candidate-comparison__pending-stack {
    grid-template-columns: 1fr;
  }
}
</style>
