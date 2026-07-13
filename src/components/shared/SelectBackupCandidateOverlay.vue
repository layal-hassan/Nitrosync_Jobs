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

const emit = defineEmits(['close', 'save'])

const selectedPlan = ref('backup')
const selectedBackupId = ref('emily')
const note = ref('')

const backupCandidates = [
  {
    id: 'emily',
    name: 'Emily Rodriguez',
    role: 'Senior Software Engineer',
    readiness: 91,
    confidence: 'Very High',
    tags: ['Validation Complete', 'Available', 'Offer Ready'],
    reasons: [
      'Highest overall readiness',
      'Completed all validation checks',
      'Strong interview consensus',
      'Lowest hiring risk',
      'Available to start immediately',
    ],
  },
  {
    id: 'david',
    name: 'David Kim',
    role: 'Senior Engineer',
    readiness: 88,
    confidence: 'High',
    tags: ['Candidate', '3 weeks'],
    reasons: [
      'Very good technical depth',
      'Reliable leadership signal',
      'Slightly lower communication score',
    ],
  },
]

const compareColumns = [
  {
    id: 'primary',
    label: 'Primary',
    name: computed(() => props.candidateName || 'Michael Chen'),
    role: computed(() => props.candidateRole || 'Senior Software Engineer'),
    tone: 'green',
    values: {
      technical: ['95%', 'Excellent', 95],
      leadership: ['90%', 'Excellent', 90],
      communication: ['89%', 'Very Good', 89],
      culture: ['92%', 'Excellent', 92],
      availability: ['2 weeks', '', 0],
      risk: ['Low', 'Low Risk', 0],
      readiness: ['93%', '', 93],
    },
  },
  {
    id: 'backup',
    label: 'Backup',
    name: 'Emily Rodriguez',
    role: 'Senior Software Engineer',
    tone: 'violet',
    values: {
      technical: ['92%', 'Excellent', 92],
      leadership: ['90%', 'Excellent', 90],
      communication: ['94%', 'Excellent', 94],
      culture: ['91%', 'Excellent', 91],
      availability: ['Immediate', '', 0],
      risk: ['Low', 'Low Risk', 0],
      readiness: ['91%', '', 91],
    },
  },
  {
    id: 'candidate',
    label: 'Candidate',
    name: 'David Kim',
    role: 'Senior Engineer',
    tone: 'blue',
    values: {
      technical: ['88%', 'Very Good', 88],
      leadership: ['85%', 'Very Good', 85],
      communication: ['86%', 'Very Good', 86],
      culture: ['91%', 'Excellent', 91],
      availability: ['3 weeks', '', 0],
      risk: ['Low', 'Low Risk', 0],
      readiness: ['88%', '', 88],
    },
  },
]

const criteriaRows = [
  ['technical', 'Technical Skills', 'document'],
  ['leadership', 'Leadership', 'users'],
  ['communication', 'Communication', 'message'],
  ['culture', 'Culture Fit', 'heart'],
  ['availability', 'Availability', 'calendar'],
  ['risk', 'Hiring Risk', 'alert'],
]

const selectedBackup = computed(() => (
  backupCandidates.find((candidate) => candidate.id === selectedBackupId.value)
  ?? backupCandidates[0]
))

const primaryInitials = computed(() => (
  (props.candidateName || 'Michael Chen')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function initialsFor(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function resetForm() {
  selectedPlan.value = 'backup'
  selectedBackupId.value = 'emily'
  note.value = ''
}

function closeOverlay() {
  emit('close')
}

function savePlan() {
  emit('save', {
    plan: selectedPlan.value,
    backupId: selectedBackupId.value,
    note: note.value,
  })
  emit('close')
}

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : ''
}

watch(
  () => props.open,
  (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      resetForm()
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="backup-candidate-overlay" @click.self="closeOverlay">
      <section class="backup-candidate-modal">
        <header class="backup-candidate-modal__head">
          <div class="backup-candidate-modal__title">
            <span class="backup-candidate-modal__title-icon">
              <AppIcon name="users" :size="20" />
            </span>
            <div>
              <h2>Select Backup Candidate</h2>
              <p>Choose a contingency plan if the primary candidate does not accept the offer.</p>
            </div>
          </div>

          <button type="button" aria-label="Close select backup candidate" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="backup-candidate-modal__body">
          <aside class="backup-candidate-sidebar">
            <section class="backup-candidate-card">
              <small>1. Primary Candidate</small>

              <div class="backup-candidate-card__person">
                <span class="backup-avatar tone-primary">{{ primaryInitials }}</span>
                <div>
                  <strong>{{ candidateName }}</strong>
                  <p>{{ candidateRole }}</p>
                </div>
              </div>

              <em>Proceed to Offer</em>

              <div class="backup-candidate-card__meta">
                <div><span>Decision Confidence</span><strong>93%</strong></div>
                <div><span>Approved on</span><strong>Apr 24, 11:15 AM</strong></div>
                <div><span>Approved by</span><strong>Hiring Committee</strong></div>
              </div>
            </section>

            <section class="backup-candidate-card">
              <small>2. Contingency Plan</small>
              <p class="backup-candidate-card__copy">What should happen if the primary candidate does not accept the offer?</p>

              <button
                type="button"
                class="backup-plan-option"
                :class="{ 'is-active': selectedPlan === 'backup' }"
                @click="selectedPlan = 'backup'"
              >
                <span class="backup-plan-option__radio" />
                <div>
                  <strong>Assign a backup candidate</strong>
                  <small>Designate a strong alternative as backup.</small>
                </div>
              </button>

              <button
                type="button"
                class="backup-plan-option"
                :class="{ 'is-active': selectedPlan === 'continue' }"
                @click="selectedPlan = 'continue'"
              >
                <span class="backup-plan-option__radio" />
                <div>
                  <strong>Continue interviewing</strong>
                  <small>Keep evaluating other candidates.</small>
                </div>
              </button>

              <button
                type="button"
                class="backup-plan-option"
                :class="{ 'is-active': selectedPlan === 'none' }"
                @click="selectedPlan = 'none'"
              >
                <span class="backup-plan-option__radio" />
                <div>
                  <strong>No contingency</strong>
                  <small>Close the requisition if offer is declined.</small>
                </div>
              </button>
            </section>

            <section class="backup-guidance-card">
              <div class="backup-guidance-card__icon">
                <AppIcon name="spark" :size="18" />
              </div>
              <div>
                <strong>AI Guidance</strong>
                <p>Having a contingency plan reduces time-to-hire by 23% on average.</p>
              </div>
            </section>
          </aside>

          <main class="backup-candidate-main">
            <section class="backup-recommendation-card">
              <header class="backup-panel-title accent-blue">
                <span><AppIcon name="spark" :size="16" /></span>
                <h3>AI Recommendation</h3>
              </header>

              <div class="backup-recommendation-card__content">
                <div class="backup-recommendation-card__profile">
                  <span class="backup-avatar tone-backup">{{ initialsFor(selectedBackup.name) }}</span>

                  <div>
                    <strong>{{ selectedBackup.name }}</strong>
                    <p>{{ selectedBackup.role }}</p>

                    <div class="backup-chip-row">
                      <span v-for="tag in selectedBackup.tags" :key="tag">{{ tag }}</span>
                    </div>
                  </div>
                </div>

                <div class="backup-readiness">
                  <small>Overall Readiness</small>
                  <div class="backup-readiness__ring">
                    <span>{{ selectedBackup.readiness }}%</span>
                  </div>
                  <strong>{{ selectedBackup.confidence }}</strong>
                </div>

                <div class="backup-reasons">
                  <small>Why {{ selectedBackup.name.split(' ')[0] }} is recommended</small>
                  <ul>
                    <li v-for="reason in selectedBackup.reasons" :key="reason">{{ reason }}</li>
                  </ul>
                </div>
              </div>

              <footer class="backup-recommendation-card__actions">
                <button type="button" class="backup-primary-action">
                  <AppIcon name="checkCircle" :size="16" />
                  <span>Assign as Backup</span>
                </button>

                <button type="button" class="backup-link-action">
                  <span>See full AI rationale</span>
                  <AppIcon name="chevronRight" :size="15" />
                </button>
              </footer>
            </section>

            <section class="backup-compare-header">
              <div>
                <strong>Want to explore other options?</strong>
              </div>

              <button type="button">
                <AppIcon name="plus" :size="16" />
                <span>Compare another candidate</span>
              </button>
            </section>

            <section class="backup-compare-card">
              <header class="backup-compare-card__head">
                <div>
                  <h3>Compare Candidates</h3>
                  <p>Add up to 4 candidates to compare side by side.</p>
                </div>

                <div class="backup-compare-card__tools">
                  <span>2 of 4</span>
                  <button type="button"><AppIcon name="refresh" :size="15" /> <span>Swap</span></button>
                  <button type="button" class="danger"><AppIcon name="trash" :size="15" /> <span>Remove All</span></button>
                </div>
              </header>

              <div class="backup-compare-table">
                <div class="backup-compare-table__head">
                  <span>Evaluation Criteria</span>

                  <article
                    v-for="column in compareColumns"
                    :key="column.id"
                    class="backup-compare-table__candidate"
                  >
                    <span class="backup-avatar" :class="`tone-${column.tone}`">{{ initialsFor(typeof column.name === 'string' ? column.name : column.name.value) }}</span>
                    <div>
                      <strong>{{ typeof column.name === 'string' ? column.name : column.name.value }}</strong>
                      <small>{{ typeof column.role === 'string' ? column.role : column.role.value }}</small>
                      <em :class="`tone-${column.tone}`">{{ column.label }}</em>
                    </div>
                  </article>
                </div>

                <div
                  v-for="row in criteriaRows"
                  :key="row[0]"
                  class="backup-compare-table__row"
                >
                  <div class="backup-compare-table__criteria">
                    <span><AppIcon :name="row[2]" :size="15" /></span>
                    <strong>{{ row[1] }}</strong>
                  </div>

                  <div
                    v-for="column in compareColumns"
                    :key="`${column.id}-${row[0]}`"
                    class="backup-compare-table__value"
                  >
                    <template v-if="['technical', 'leadership', 'communication', 'culture'].includes(row[0])">
                      <div class="backup-score-row">
                        <strong>{{ column.values[row[0]][0] }}</strong>
                        <div class="backup-score-bar">
                          <i :style="{ width: `${column.values[row[0]][2]}%` }" :class="`tone-${column.tone}`" />
                        </div>
                        <small>{{ column.values[row[0]][1] }}</small>
                      </div>
                    </template>

                    <template v-else-if="row[0] === 'availability'">
                      <strong class="backup-text-value">{{ column.values[row[0]][0] }}</strong>
                    </template>

                    <template v-else-if="row[0] === 'risk'">
                      <div class="backup-risk-value">
                        <strong>{{ column.values[row[0]][0] }}</strong>
                        <small>{{ column.values[row[0]][1] }}</small>
                      </div>
                    </template>
                  </div>
                </div>

                <div class="backup-compare-table__row overall">
                  <div class="backup-compare-table__criteria">
                    <strong>Overall Readiness</strong>
                  </div>

                  <div
                    v-for="column in compareColumns"
                    :key="`${column.id}-readiness`"
                    class="backup-compare-table__overall"
                    :class="`tone-${column.tone}`"
                  >
                    {{ column.values.readiness[0] }}
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside class="backup-candidate-rail">
            <section class="backup-rail-card">
              <header class="backup-panel-title">
                <span><AppIcon name="users" :size="16" /></span>
                <h3>Backup Summary</h3>
              </header>

              <small>Designated Backup</small>

              <article class="backup-summary-candidate">
                <span class="backup-avatar tone-backup">{{ initialsFor(selectedBackup.name) }}</span>
                <div>
                  <strong>{{ selectedBackup.name }}</strong>
                  <p>{{ selectedBackup.role }}</p>
                </div>
                <div class="backup-summary-candidate__score">
                  <strong>{{ selectedBackup.readiness }}%</strong>
                  <span>{{ selectedBackup.confidence }}</span>
                </div>
              </article>

              <p class="backup-rail-copy">
                This candidate will be considered if the primary candidate does not accept the offer.
              </p>

              <div class="backup-next-steps">
                <strong>What happens next?</strong>
                <ol>
                  <li>Backup candidate is assigned and notified.</li>
                  <li>They remain in "Backup Candidate" status until needed.</li>
                  <li>If the primary candidate declines, you'll be prompted to promote the backup to offer.</li>
                  <li>All stakeholders will be notified.</li>
                </ol>
              </div>
            </section>

            <section class="backup-rail-card">
              <strong>Approval History</strong>
              <div class="backup-history">
                <article>
                  <span class="tone-green"><AppIcon name="checkCircle" :size="14" /></span>
                  <p>Committee approved primary decision</p>
                  <small>Apr 24, 11:15 AM</small>
                </article>
                <article>
                  <span class="tone-blue"><AppIcon name="info" :size="14" /></span>
                  <p>Decision submitted</p>
                  <small>Apr 24, 10:30 AM</small>
                </article>
              </div>
            </section>

            <section class="backup-rail-card">
              <strong>Add a note <small>(optional)</small></strong>
              <div class="backup-note-box">
                <textarea v-model="note" rows="6" maxlength="500" placeholder="Add notes for your team..." />
                <small>{{ note.length }}/500</small>
              </div>
            </section>
          </aside>
        </div>

        <footer class="backup-candidate-modal__foot">
          <div class="backup-candidate-modal__footnote">
            <AppIcon name="lock" :size="14" />
            <span>This contingency plan will be added to the hiring decision record and visible to authorized stakeholders.</span>
          </div>

          <div class="backup-candidate-modal__actions">
            <button type="button" class="secondary" @click="closeOverlay">Cancel</button>
            <button type="button" class="primary" @click="savePlan">
              <AppIcon name="checkCircle" :size="16" />
              <span>Save Backup Plan</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.backup-candidate-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(7px);
}

.backup-candidate-modal {
  width: min(1490px, 100%);
  max-height: calc(100vh - 36px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
}

.backup-candidate-modal__head,
.backup-candidate-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #e8eef7;
}

.backup-candidate-modal__foot {
  border-top: 1px solid #e8eef7;
  border-bottom: none;
  background: #fbfcff;
}

.backup-candidate-modal__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.backup-candidate-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fde9f3;
  color: #ef5da8;
  flex-shrink: 0;
}

.backup-candidate-modal__title h2 {
  margin: 0;
  font-size: 1.95rem;
  font-weight: 800;
  color: #1f2a44;
}

.backup-candidate-modal__title p {
  margin: 4px 0 0;
  color: #7183a6;
  font-size: 1.02rem;
}

.backup-candidate-modal__head > button {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #8fa0bd;
  cursor: pointer;
}

.backup-candidate-modal__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: 326px minmax(0, 1fr) 324px;
  gap: 22px;
  padding: 24px;
}

.backup-candidate-sidebar,
.backup-candidate-main,
.backup-candidate-rail {
  min-width: 0;
}

.backup-candidate-card,
.backup-guidance-card,
.backup-recommendation-card,
.backup-compare-card,
.backup-rail-card {
  border: 1px solid #dfe7f5;
  border-radius: 20px;
  background: #ffffff;
}

.backup-candidate-card + .backup-candidate-card,
.backup-rail-card + .backup-rail-card {
  margin-top: 18px;
}

.backup-candidate-card {
  padding: 18px;
}

.backup-candidate-card > small,
.backup-panel-title h3,
.backup-next-steps strong,
.backup-rail-card > strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.backup-candidate-card > small {
  font-size: 0.84rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #98a7c2;
}

.backup-candidate-card__person {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.backup-avatar {
  width: 58px;
  height: 58px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  flex-shrink: 0;
}

.backup-avatar.tone-primary {
  background: linear-gradient(135deg, #2c3648 0%, #111827 100%);
}

.backup-avatar.tone-backup {
  background: linear-gradient(135deg, #0f5132 0%, #94d3ac 100%);
}

.backup-avatar.tone-green {
  background: linear-gradient(135deg, #0f5132 0%, #16a34a 100%);
}

.backup-avatar.tone-violet {
  background: linear-gradient(135deg, #5b4bff 0%, #7c3aed 100%);
}

.backup-avatar.tone-blue {
  background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
}

.backup-candidate-card__person strong,
.backup-recommendation-card__profile strong,
.backup-summary-candidate strong,
.backup-compare-card__head h3 {
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  color: #1f2a44;
}

.backup-candidate-card__person p,
.backup-recommendation-card__profile p,
.backup-summary-candidate p,
.backup-candidate-card__copy,
.backup-rail-copy,
.backup-compare-card__head p,
.backup-guidance-card p,
.backup-note-box small {
  color: #7183a6;
}

.backup-candidate-card em {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-style: normal;
  color: #16a34a;
  font-weight: 700;
}

.backup-candidate-card__meta {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #edf2f9;
  display: grid;
  gap: 12px;
}

.backup-candidate-card__meta div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.backup-candidate-card__meta span {
  color: #94a3bd;
}

.backup-candidate-card__meta strong {
  color: #1f2a44;
}

.backup-plan-option {
  width: 100%;
  margin-top: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.backup-plan-option.is-active {
  border-color: #ef5da8;
  box-shadow: 0 0 0 3px rgba(239, 93, 168, 0.1);
}

.backup-plan-option__radio {
  width: 18px;
  height: 18px;
  margin-top: 3px;
  border: 1.5px solid #cbd5e1;
  border-radius: 50%;
  flex-shrink: 0;
}

.backup-plan-option.is-active .backup-plan-option__radio {
  border-width: 5px;
  border-color: #ef5da8;
}

.backup-plan-option strong {
  display: block;
  font-size: 1rem;
  color: #1f2a44;
}

.backup-plan-option small {
  display: block;
  margin-top: 4px;
  color: #7183a6;
}

.backup-guidance-card {
  margin-top: 22px;
  padding: 20px 18px;
  display: flex;
  gap: 14px;
  background: #edf4ff;
}

.backup-guidance-card__icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #dfe9ff;
  color: #4f46e5;
  flex-shrink: 0;
}

.backup-guidance-card strong {
  display: block;
  color: #21407e;
}

.backup-guidance-card p {
  margin: 8px 0 0;
  line-height: 1.65;
}

.backup-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.backup-panel-title span {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: #eff3ff;
  color: #5a67f2;
  flex-shrink: 0;
}

.backup-panel-title.accent-blue h3 {
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.backup-recommendation-card {
  padding: 20px 24px;
}

.backup-recommendation-card__content {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) 170px minmax(240px, 1fr);
  gap: 24px;
  align-items: center;
}

.backup-recommendation-card__profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.backup-chip-row {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.backup-chip-row span {
  padding: 8px 12px;
  border-radius: 10px;
  background: #eaf9ef;
  color: #16a34a;
  font-size: 0.82rem;
  font-weight: 700;
}

.backup-readiness {
  padding-inline: 18px;
  border-left: 1px solid #edf2f9;
  border-right: 1px solid #edf2f9;
  text-align: center;
}

.backup-readiness small,
.backup-reasons small,
.backup-rail-card small {
  display: block;
  color: #98a7c2;
  text-transform: uppercase;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.backup-readiness__ring {
  width: 92px;
  aspect-ratio: 1;
  margin: 14px auto 12px;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #ffffff 60%, transparent 61%),
    conic-gradient(#ef5da8 0 328deg, #e8eef8 328deg 360deg);
  display: grid;
  place-items: center;
}

.backup-readiness__ring span {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1f2a44;
}

.backup-readiness strong {
  color: #16a34a;
}

.backup-reasons ul {
  margin: 14px 0 0;
  padding-left: 18px;
  color: #42526d;
  line-height: 1.6;
}

.backup-reasons li + li {
  margin-top: 8px;
}

.backup-recommendation-card__actions {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #edf2f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.backup-primary-action,
.backup-link-action,
.backup-compare-header button,
.backup-compare-card__tools button,
.backup-candidate-modal__actions button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.backup-primary-action {
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #5b4bff 0%, #4f46e5 100%);
  color: #ffffff;
  font-weight: 800;
}

.backup-link-action {
  border: none;
  background: transparent;
  color: #4f46e5;
  font-weight: 700;
}

.backup-compare-header {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.backup-compare-header strong {
  color: #1f2a44;
  font-size: 1.05rem;
  font-weight: 800;
}

.backup-compare-header button {
  height: 40px;
  padding: 0 14px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #ffffff;
  color: #4f46e5;
  font-weight: 700;
}

.backup-compare-card {
  margin-top: 14px;
  overflow: hidden;
}

.backup-compare-card__head {
  padding: 18px 18px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #edf2f9;
}

.backup-compare-card__head p {
  margin: 4px 0 0;
}

.backup-compare-card__tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.backup-compare-card__tools span {
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3f6ff;
  color: #7c8cab;
  font-size: 0.78rem;
  font-weight: 700;
}

.backup-compare-card__tools button {
  height: 32px;
  padding: 0 10px;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  background: #ffffff;
  color: #44526d;
  font-size: 0.84rem;
  font-weight: 700;
}

.backup-compare-card__tools button.danger {
  color: #ef4444;
}

.backup-compare-table__head,
.backup-compare-table__row {
  display: grid;
  grid-template-columns: 180px repeat(3, minmax(0, 1fr));
}

.backup-compare-table__head {
  background: #fbfcff;
  border-bottom: 1px solid #edf2f9;
}

.backup-compare-table__head > span {
  padding: 18px 16px;
  color: #9aa8c2;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.backup-compare-table__candidate {
  min-width: 0;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 1px solid #edf2f9;
}

.backup-compare-table__candidate strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.backup-compare-table__candidate small {
  display: block;
  margin-top: 3px;
  color: #7183a6;
}

.backup-compare-table__candidate em {
  display: inline-flex;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef4ff;
  font-style: normal;
  font-size: 0.74rem;
  font-weight: 700;
}

.backup-compare-table__candidate em.tone-green {
  color: #16a34a;
  background: #eaf9ef;
}

.backup-compare-table__candidate em.tone-violet {
  color: #4f46e5;
  background: #eef1ff;
}

.backup-compare-table__candidate em.tone-blue {
  color: #2563eb;
  background: #eef5ff;
}

.backup-compare-table__row + .backup-compare-table__row {
  border-top: 1px solid #edf2f9;
}

.backup-compare-table__criteria,
.backup-compare-table__value,
.backup-compare-table__overall {
  padding: 16px;
}

.backup-compare-table__value,
.backup-compare-table__overall {
  border-left: 1px solid #edf2f9;
}

.backup-compare-table__criteria {
  display: flex;
  align-items: center;
  gap: 10px;
}

.backup-compare-table__criteria span {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #eff3ff;
  color: #5a67f2;
  flex-shrink: 0;
}

.backup-compare-table__criteria strong {
  color: #1f2a44;
  font-size: 0.98rem;
}

.backup-score-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.backup-score-row strong,
.backup-text-value,
.backup-risk-value strong,
.backup-compare-table__overall {
  color: #1f2a44;
  font-weight: 800;
}

.backup-score-bar {
  height: 8px;
  border-radius: 999px;
  background: #edf2f9;
  overflow: hidden;
}

.backup-score-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.backup-score-bar i.tone-green {
  background: #22c55e;
}

.backup-score-bar i.tone-violet {
  background: #5b4bff;
}

.backup-score-bar i.tone-blue {
  background: #60a5fa;
}

.backup-score-row small,
.backup-risk-value small {
  color: #94a3bd;
}

.backup-risk-value {
  display: grid;
  gap: 4px;
}

.backup-compare-table__row.overall {
  background: #fbfcff;
}

.backup-compare-table__overall {
  font-size: 1.1rem;
  text-align: center;
}

.backup-compare-table__overall.tone-green {
  color: #16a34a;
}

.backup-compare-table__overall.tone-violet {
  color: #4f46e5;
}

.backup-compare-table__overall.tone-blue {
  color: #94a3bd;
}

.backup-rail-card {
  padding: 18px;
}

.backup-summary-candidate {
  margin-top: 14px;
  padding: 14px;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  border: 1px solid #edf2f9;
  border-radius: 16px;
  background: #ffffff;
}

.backup-summary-candidate__score {
  text-align: right;
}

.backup-summary-candidate__score strong {
  display: block;
  color: #ef5da8;
}

.backup-summary-candidate__score span {
  display: block;
  margin-top: 3px;
  color: #16a34a;
  font-size: 0.84rem;
  font-weight: 700;
}

.backup-rail-copy {
  margin: 16px 0 0;
  line-height: 1.65;
}

.backup-next-steps {
  margin-top: 18px;
}

.backup-next-steps ol {
  margin: 12px 0 0;
  padding-left: 20px;
  color: #5f708f;
  line-height: 1.7;
}

.backup-next-steps li + li {
  margin-top: 10px;
}

.backup-history {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.backup-history article {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: start;
}

.backup-history p {
  margin: 0;
  color: #42526d;
}

.backup-history small {
  color: #94a3bd;
}

.backup-note-box {
  margin-top: 14px;
  position: relative;
}

.backup-note-box textarea {
  width: 100%;
  min-height: 116px;
  padding: 14px 16px 34px;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  resize: vertical;
  outline: none;
  font: inherit;
  color: #1f2a44;
}

.backup-note-box textarea:focus {
  border-color: #ef5da8;
  box-shadow: 0 0 0 4px rgba(239, 93, 168, 0.12);
}

.backup-note-box small {
  position: absolute;
  right: 14px;
  bottom: 12px;
}

.backup-candidate-modal__footnote {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #7183a6;
}

.backup-candidate-modal__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.backup-candidate-modal__actions button {
  height: 46px;
  padding: 0 18px;
  border-radius: 14px;
  font-weight: 800;
}

.backup-candidate-modal__actions button.secondary {
  border: 1px solid #dbe4f0;
  background: #ffffff;
  color: #44526d;
}

.backup-candidate-modal__actions button.primary {
  border: none;
  background: linear-gradient(135deg, #f65aa7 0%, #ef5da8 100%);
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(239, 93, 168, 0.2);
}

.tone-green {
  color: #16a34a;
}

.tone-blue {
  color: #2563eb;
}

@media (max-width: 1320px) {
  .backup-candidate-modal__body {
    grid-template-columns: 326px minmax(0, 1fr);
  }

  .backup-candidate-rail {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .backup-rail-card + .backup-rail-card {
    margin-top: 0;
  }
}

@media (max-width: 1080px) {
  .backup-candidate-modal__body {
    grid-template-columns: 1fr;
  }

  .backup-recommendation-card__content,
  .backup-candidate-rail,
  .backup-compare-table__head,
  .backup-compare-table__row {
    grid-template-columns: 1fr;
  }

  .backup-summary-candidate,
  .backup-history article,
  .backup-candidate-modal__foot {
    grid-template-columns: 1fr;
  }

  .backup-candidate-modal__foot {
    align-items: stretch;
  }
}

@media (max-width: 760px) {
  .backup-candidate-overlay {
    padding: 8px;
  }

  .backup-candidate-modal {
    max-height: calc(100vh - 16px);
    border-radius: 18px;
  }

  .backup-candidate-modal__head,
  .backup-candidate-modal__body,
  .backup-candidate-modal__foot {
    padding: 14px;
  }

  .backup-candidate-modal__head,
  .backup-recommendation-card__actions,
  .backup-compare-header,
  .backup-compare-card__head,
  .backup-candidate-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .backup-candidate-modal__actions {
    flex-direction: column;
  }
}
</style>
