<script setup>
import { computed, ref } from 'vue'
import AppIcon from '../shared/AppIcon.vue'
import ScheduleScreeningOverlay from '../shared/ScheduleScreeningOverlay.vue'
import { getJobById } from '../../data/jobs'

const props = defineProps({
  jobId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['back'])

const job = computed(() => getJobById(props.jobId))
const jobTitle = computed(() => job.value?.title ?? 'Job comparison')
const activeCandidateId = ref('sj')
const confidenceScore = 92
const maxCompareCandidates = 5
const addCandidateModalOpen = ref(false)
const addCandidateSearch = ref('')
const scheduleScreeningOpen = ref(false)

const candidateDirectory = [
  { id: 'sj', name: 'Sarah Johnson', role: 'Senior Frontend Engineer', avatar: 'SJ', match: 92, experience: '7 years', interview: '9.2 / 10', skillsMatch: '95%', fit: '90%', availability: 'Available in 4 weeks', salary: 'Excellent', notice: '1 month', retention: 'High', ramp: 'Fast', location: 'Stockholm', skills: ['Vue', 'TypeScript', 'Design Systems', 'Accessibility'] },
  { id: 'mb', name: 'Michael Brown', role: 'Frontend Developer', avatar: 'MB', match: 90, experience: '6 years', interview: '9.0 / 10', skillsMatch: '93%', fit: '89%', availability: 'Available in 3 weeks', salary: 'Good', notice: '3 weeks', retention: 'High', ramp: 'Fast', location: 'London', skills: ['React', 'UI/UX', 'Illustration', 'Design QA'] },
  { id: 'db', name: 'Daniel Brown', role: 'UI Engineer', avatar: 'DB', match: 89, experience: '5 years', interview: '8.6 / 10', skillsMatch: '88%', fit: '85%', availability: 'Available immediately', salary: 'Good', notice: 'Immediate', retention: 'Good', ramp: 'Fast', location: 'Berlin', skills: ['Figma', 'CSS', 'Motion', 'Component Libraries'] },
  { id: 'es', name: 'Emily Smith', role: 'Product Designer', avatar: 'ES', match: 87, experience: '6 years', interview: '8.8 / 10', skillsMatch: '91%', fit: '87%', availability: 'Available in 2 weeks', salary: 'Fair', notice: '2 weeks', retention: 'High', ramp: 'Fast', location: 'Amsterdam', skills: ['Product Strategy', 'Research', 'UI', 'Workshops'] },
  { id: 'ew', name: 'Emma Wilson', role: 'Frontend Developer', avatar: 'EW', match: 85, experience: '4 years', interview: '8.1 / 10', skillsMatch: '82%', fit: '80%', availability: 'Available in 4 weeks', salary: 'Fair', notice: '1 month', retention: 'Medium', ramp: 'Steady', location: 'Copenhagen', skills: ['Branding', 'HTML', 'CSS', 'Figma'] },
  { id: 'oc', name: 'Olivia Chen', role: 'UI Designer', avatar: 'OC', match: 84, experience: '3 years', interview: '8.0 / 10', skillsMatch: '84%', fit: '81%', availability: 'Available immediately', salary: 'Good', notice: 'Immediate', retention: 'High', ramp: 'Steady', location: 'Singapore', skills: ['Illustrator', 'Branding', 'Figma', 'Prototyping'] },
  { id: 'ds', name: 'David Svensson', role: 'Art Director', avatar: 'DS', match: 79, experience: '7 years', interview: '7.9 / 10', skillsMatch: '78%', fit: '77%', availability: 'Available in 6 weeks', salary: 'Fair', notice: '6 weeks', retention: 'Medium', ramp: 'Steady', location: 'Stockholm', skills: ['Photoshop', 'Print Design', 'Branding', 'Leadership'] },
]

const candidates = ref(candidateDirectory.slice(0, maxCompareCandidates))
const selectedAddCandidateIds = ref(candidates.value.map((candidate) => candidate.id))

const selectedCandidate = computed(() => (
  candidates.value.find((candidate) => candidate.id === activeCandidateId.value) ?? candidates.value[0]
))

const simulatorWeights = [
  { label: 'Skills', value: '25%', tone: 'pink', icon: 'target' },
  { label: 'Interview', value: '30%', tone: 'violet', icon: 'checkCircle' },
  { label: 'Culture fit', value: '20%', tone: 'blue', icon: 'spark' },
  { label: 'Salary', value: '15%', tone: 'orange', icon: 'wallet' },
  { label: 'Availability', value: '10%', tone: 'green', icon: 'shield' },
]

const comparisonRows = computed(() => [
  { label: 'Experience', weight: '20%', values: candidates.value.map((candidate) => candidate.experience) },
  { label: 'Skills match', weight: '20%', values: candidates.value.map((candidate) => candidate.skillsMatch), metric: true },
  { label: 'Interview score', weight: '25%', values: candidates.value.map((candidate) => candidate.interview), metric: true },
  { label: 'Culture fit', weight: '15%', values: candidates.value.map((candidate) => candidate.fit), metric: true },
  { label: 'Availability', weight: '10%', values: candidates.value.map((candidate) => candidate.availability) },
  { label: 'Salary fit', weight: '5%', values: candidates.value.map((candidate) => candidate.salary) },
  { label: 'Notice period', weight: '5%', values: candidates.value.map((candidate) => candidate.notice) },
])

const filteredAddCandidates = computed(() => {
  const query = addCandidateSearch.value.trim().toLowerCase()

  if (!query) {
    return candidateDirectory
  }

  return candidateDirectory.filter((candidate) => (
    candidate.name.toLowerCase().includes(query)
    || candidate.role.toLowerCase().includes(query)
    || candidate.location.toLowerCase().includes(query)
    || candidate.skills.some((skill) => skill.toLowerCase().includes(query))
  ))
})

const selectedAddCandidates = computed(() => (
  selectedAddCandidateIds.value
    .map((id) => candidateDirectory.find((candidate) => candidate.id === id))
    .filter(Boolean)
))

function selectCandidate(id) {
  activeCandidateId.value = id
}

function openAddCandidateModal() {
  addCandidateModalOpen.value = true
}

function closeAddCandidateModal() {
  addCandidateModalOpen.value = false
}

function toggleAddCandidate(id) {
  if (selectedAddCandidateIds.value.includes(id)) {
    selectedAddCandidateIds.value = selectedAddCandidateIds.value.filter((candidateId) => candidateId !== id)
    return
  }

  if (selectedAddCandidateIds.value.length >= maxCompareCandidates) {
    return
  }

  selectedAddCandidateIds.value = [...selectedAddCandidateIds.value, id]
}

function removeAddCandidate(id) {
  selectedAddCandidateIds.value = selectedAddCandidateIds.value.filter((candidateId) => candidateId !== id)
}

function clearAddCandidateSelection() {
  selectedAddCandidateIds.value = []
}

function applySelectedCandidates() {
  const nextCandidates = selectedAddCandidates.value.slice(0, maxCompareCandidates)

  if (!nextCandidates.length) {
    return
  }

  candidates.value = nextCandidates

  if (!candidates.value.some((candidate) => candidate.id === activeCandidateId.value)) {
    activeCandidateId.value = candidates.value[0].id
  }

  closeAddCandidateModal()
}

function backToJob() {
  emit('back')
}

function openScheduleScreening() {
  scheduleScreeningOpen.value = true
}

function closeScheduleScreening() {
  scheduleScreeningOpen.value = false
}

function scoreWidth(value) {
  const numeric = Number.parseInt(String(value), 10)
  if (Number.isNaN(numeric)) {
    return '0%'
  }

  return `${numeric}%`
}

function toneClass(tone) {
  return tone ? `is-${tone}` : ''
}
</script>

<template>
  <main class="compare-page">
    <div class="compare-shell">
      <div class="compare-topbar">
        <button class="compare-back" type="button" @click="backToJob">
          <AppIcon name="chevronLeft" :size="18" />
          <span>Back to Job</span>
        </button>

        <button class="compare-close" type="button" aria-label="Close compare" @click="backToJob">
          <AppIcon name="close" :size="18" />
        </button>
      </div>

      <section class="compare-hero compare-panel">
        <div class="compare-hero-head">
          <div class="compare-hero-title">
            <span class="compare-hero-icon">
              <AppIcon name="compare" :size="24" />
            </span>
            <div>
              <h1>Compare Candidates</h1>
              <div class="compare-hero-meta">
                <span>{{ jobTitle }}</span>
                <span class="compare-dot" />
                <span class="compare-highlight">{{ candidates.length }} candidates selected</span>
              </div>
            </div>
          </div>

          <div class="compare-hero-actions">
            <button class="compare-outline" type="button" @click="openAddCandidateModal">
              <AppIcon name="plus" :size="16" />
              <span>Add candidate</span>
            </button>
            <button class="compare-outline" type="button">
              <AppIcon name="share" :size="16" />
              <span>Share comparison</span>
            </button>
          </div>
        </div>

        <div class="compare-selection-strip">
          <article class="compare-cap-card">
            <strong>Comparing ({{ candidates.length }})</strong>
            <span>You can compare up to {{ maxCompareCandidates }} candidates</span>
          </article>

          <button
            v-for="candidate in candidates"
            :key="candidate.id"
            class="compare-chip"
            :class="{ 'is-active': activeCandidateId === candidate.id }"
            type="button"
            @click="selectCandidate(candidate.id)"
          >
            <span class="compare-chip-avatar">{{ candidate.avatar }}</span>
            <span class="compare-chip-copy">
              <strong>{{ candidate.name }}</strong>
              <small>{{ candidate.match }}% match</small>
            </span>
            <span class="compare-chip-remove">
              <AppIcon name="close" :size="14" />
            </span>
          </button>

          <button class="compare-swap" type="button">
            <span class="compare-swap-copy">
              <span class="compare-swap-label">Swap candidate</span>
              <span class="compare-swap-note">Replace one profile in this comparison</span>
            </span>
            <span class="compare-swap-icon">
              <AppIcon name="refresh" :size="15" />
            </span>
          </button>
        </div>
      </section>

      <section class="compare-recommendation compare-panel">
        <div class="compare-recommendation-main">
          <div class="compare-panel-title">
            <span class="compare-panel-mark">
              <AppIcon name="spark" :size="16" />
            </span>
            <strong>AI Recommendation</strong>
          </div>

          <h2>{{ selectedCandidate.name }} is the strongest candidate for this role.</h2>

          <div class="compare-recommendation-grid">
            <article class="compare-rec-card">
              <span class="compare-rec-icon is-violet"><AppIcon name="star" :size="14" /></span>
              <div>
                <strong>Highest interview score</strong>
                <small>{{ selectedCandidate.interview }}</small>
              </div>
            </article>
            <article class="compare-rec-card">
              <span class="compare-rec-icon is-blue"><AppIcon name="target" :size="14" /></span>
              <div>
                <strong>Best skills match</strong>
                <small>95%</small>
              </div>
            </article>
            <article class="compare-rec-card">
              <span class="compare-rec-icon is-green"><AppIcon name="shield" :size="14" /></span>
              <div>
                <strong>Strong portfolio and case studies</strong>
                <small>Verified by interview panel</small>
              </div>
            </article>
            <article class="compare-rec-card is-warning">
              <span class="compare-rec-icon is-orange"><AppIcon name="alert" :size="14" /></span>
              <div>
                <strong>Highest salary expectations</strong>
                <small>45,000 - 50,000 SEK</small>
              </div>
            </article>
            <article class="compare-rec-card is-warning">
              <span class="compare-rec-icon is-orange"><AppIcon name="alert" :size="14" /></span>
              <div>
                <strong>Longest notice period</strong>
                <small>1 month</small>
              </div>
            </article>
          </div>
        </div>

        <div class="compare-confidence-card">
          <div class="compare-mini-head">
            <strong>Decision confidence</strong>
            <AppIcon name="info" :size="14" />
          </div>
          <div class="compare-confidence-meter">
            <div class="compare-confidence-ring" :style="{ '--confidence': confidenceScore }">
              <div>{{ confidenceScore }}%</div>
            </div>
            <div>
              <strong>High confidence</strong>
              <small>Based on 32 data points across 8 factors</small>
            </div>
          </div>
        </div>

        <div class="compare-impact-card">
          <div class="compare-mini-head">
            <strong>Hiring impact</strong>
            <AppIcon name="info" :size="14" />
          </div>
          <div class="compare-impact-list">
            <div><span>Time to productivity</span><strong>Fast (2-3 weeks)</strong></div>
            <div><span>Retention prediction</span><strong>High</strong></div>
            <div><span>Offer success likelihood</span><strong>85%</strong></div>
            <div><span>Team impact</span><strong>Positive</strong></div>
          </div>
          <button class="compare-full-button" type="button">View full analysis</button>
        </div>
      </section>

      <div class="compare-main-grid">
        <section class="compare-panel">
          <div class="compare-section-head">
            <h3>Ranking (AI)</h3>
          </div>

          <div class="compare-ranking-list">
            <article v-for="(candidate, index) in candidates" :key="candidate.id" class="compare-ranking-row">
              <span class="compare-ranking-index">{{ index + 1 }}</span>
              <div class="compare-ranking-copy">
                <strong>{{ candidate.name }}</strong>
                <small>{{ candidate.match }}%</small>
              </div>
              <div class="compare-ranking-bar">
                <span :style="{ width: scoreWidth(candidate.match) }" />
              </div>
            </article>
          </div>

          <button class="compare-full-button is-ghost" type="button">How ranking is calculated</button>
        </section>

        <section class="compare-panel">
          <div class="compare-section-head">
            <h3>Decision simulator</h3>
            <AppIcon name="info" :size="14" />
          </div>
          <p class="compare-section-copy">Adjust what matters most to see how rankings change.</p>

          <div class="compare-simulator-grid">
            <article v-for="item in simulatorWeights" :key="item.label" class="compare-simulator-card" :class="toneClass(item.tone)">
              <span class="compare-simulator-icon"><AppIcon :name="item.icon" :size="15" /></span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.value }}</small>
            </article>
          </div>

          <div class="compare-priority-bar">
            <strong>Your priority: Interview score</strong>
            <div class="compare-range">
              <span />
            </div>
            <button class="compare-reset" type="button">Reset</button>
          </div>
        </section>

        <section class="compare-panel">
          <div class="compare-section-head compare-section-head--split">
            <div>
              <h3>What happens if I choose this candidate?</h3>
            </div>
            <button class="compare-candidate-switch" type="button">
              <span class="compare-chip-avatar is-small">{{ selectedCandidate.avatar }}</span>
              <span>{{ selectedCandidate.name }}</span>
              <AppIcon name="chevronDown" :size="14" />
            </button>
          </div>

          <div class="compare-outcome-list">
            <div><span>Time to fill</span><strong>21 days</strong><em>Faster</em></div>
            <div><span>Offer acceptance probability</span><strong>85%</strong><em>High</em></div>
            <div><span>Predicted retention (1 year)</span><strong>{{ selectedCandidate.retention }}</strong><em>High</em></div>
            <div><span>Ramp-up speed</span><strong>{{ selectedCandidate.ramp }}</strong><em>High</em></div>
          </div>

          <button class="compare-full-button is-ghost" type="button">View detailed prediction</button>
        </section>
      </div>

      <div class="compare-detail-grid">
        <section class="compare-panel compare-table-panel">
          <div class="compare-tabs">
            <button class="is-active" type="button">Detailed comparison</button>
            <button type="button">Strengths and risks</button>
            <button type="button">Interview insights</button>
            <button type="button">Hiring impact</button>
          </div>

          <div class="compare-table-wrap">
            <table class="compare-table">
              <thead>
                <tr>
                  <th>Key criteria</th>
                  <th v-for="(candidate, index) in candidates" :key="candidate.id">
                    <div class="compare-table-head">
                      <span class="compare-ranking-index">{{ index + 1 }}</span>
                      <span class="compare-chip-avatar is-small">{{ candidate.avatar }}</span>
                      <div>
                        <strong>{{ candidate.name }}</strong>
                        <small>{{ candidate.role }}</small>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in comparisonRows" :key="row.label">
                  <td>
                    <strong>{{ row.label }}</strong>
                    <small>Weight {{ row.weight }}</small>
                  </td>
                  <td v-for="(value, valueIndex) in row.values" :key="`${row.label}-${valueIndex}`">
                    <div v-if="row.metric" class="compare-metric-cell">
                      <span>{{ value }}</span>
                      <div class="compare-ranking-bar">
                        <span :style="{ width: scoreWidth(value) }" />
                      </div>
                    </div>
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <aside class="compare-side-stack">
          <section class="compare-panel">
            <div class="compare-next-head">
              <span class="compare-next-head-icon">
                <AppIcon name="share" :size="14" />
              </span>
              <h3>What's next?</h3>
            </div>
            <div class="compare-next-list">
              <button class="compare-next-action" type="button" @click="openScheduleScreening">
                <span class="compare-next-icon">
                  <AppIcon name="calendar" :size="15" />
                </span>
                <div>
                  <strong>Schedule interview</strong>
                </div>
              </button>
              <button class="compare-next-action is-active" type="button">
                <span class="compare-next-icon">
                  <AppIcon name="chevronRight" :size="15" />
                </span>
                <div>
                  <strong>Move to next stage</strong>
                </div>
              </button>
              <button class="compare-next-action" type="button">
                <span class="compare-next-icon">
                  <AppIcon name="userPlus" :size="15" />
                </span>
                <div>
                  <strong>Add to talent pool</strong>
                </div>
              </button>
            </div>
          </section>
        </aside>
      </div>

      <div class="compare-footer compare-panel">
        <div class="compare-footer-copy">
          <span class="compare-hero-icon is-small">
            <AppIcon name="compare" :size="18" />
          </span>
          <div>
            <strong>{{ candidates.length }} candidates selected</strong>
            <span>You can compare up to {{ maxCompareCandidates }} candidates</span>
          </div>
        </div>

        <div class="compare-footer-actions">
          <button class="compare-outline" type="button">Clear selection</button>
          <button class="compare-primary" type="button">
            <AppIcon name="heart" :size="16" />
            <span>Save comparison</span>
          </button>
        </div>
      </div>

      <ScheduleScreeningOverlay
        :open="scheduleScreeningOpen"
        :candidate-name="selectedCandidate.name"
        :candidate-role="selectedCandidate.role"
        @close="closeScheduleScreening"
      />
    </div>

    <div v-if="addCandidateModalOpen" class="compare-modal-layer" @click.self="closeAddCandidateModal">
      <section class="compare-modal">
        <div class="compare-modal-head">
          <div class="compare-modal-title">
            <span class="compare-modal-title-icon">
              <AppIcon name="userPlus" :size="20" />
            </span>
            <div>
              <h2>Add Candidates to Compare</h2>
              <div class="compare-modal-role">
                <AppIcon name="briefcase" :size="12" />
                <span>{{ jobTitle }}</span>
              </div>
            </div>
          </div>

          <button class="compare-modal-close" type="button" aria-label="Close add candidate modal" @click="closeAddCandidateModal">
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <p class="compare-modal-copy">Select one or more candidates to add to your comparison.</p>

        <div class="compare-modal-toolbar">
          <label class="compare-modal-search">
            <AppIcon name="search" :size="18" />
            <input v-model="addCandidateSearch" type="text" placeholder="Search by name, email, skill, or keyword...">
          </label>

          <button class="compare-modal-filter" type="button">
            <AppIcon name="filter" :size="16" />
            <span>Filters</span>
          </button>
        </div>

        <div class="compare-modal-meta">
          <strong>{{ filteredAddCandidates.length }} RESULTS FOUND</strong>
          <button class="compare-modal-sort" type="button">
            <span>Sorted by match</span>
            <AppIcon name="chevronDown" :size="14" />
          </button>
        </div>

        <div class="compare-modal-list">
          <article
            v-for="candidate in filteredAddCandidates"
            :key="candidate.id"
            class="compare-modal-row"
            :class="{ 'is-selected': selectedAddCandidateIds.includes(candidate.id) }"
          >
            <button class="compare-modal-check-button" type="button" @click="toggleAddCandidate(candidate.id)">
              <span
                class="compare-modal-check"
                :class="{
                  'is-selected': selectedAddCandidateIds.includes(candidate.id),
                  'is-disabled': !selectedAddCandidateIds.includes(candidate.id) && selectedAddCandidateIds.length >= maxCompareCandidates,
                }"
              >
                <AppIcon v-if="selectedAddCandidateIds.includes(candidate.id)" name="check" :size="12" />
              </span>
            </button>

            <span class="compare-modal-avatar">{{ candidate.avatar }}</span>

            <div class="compare-modal-row-main">
              <div class="compare-modal-name">
                <strong>{{ candidate.name }}</strong>
                <div class="compare-modal-row-meta">
                  <span>{{ candidate.role }}</span>
                  <span class="compare-modal-dot" />
                  <span>{{ candidate.experience }} exp.</span>
                  <span class="compare-modal-dot" />
                  <span class="compare-modal-location">
                    <AppIcon name="mapPin" :size="11" />
                    <span>{{ candidate.location }}</span>
                  </span>
                </div>
              </div>
            </div>

            <strong class="compare-modal-match">{{ candidate.match }}% Match</strong>

            <div class="compare-modal-tags">
              <span v-for="skill in candidate.skills.slice(0, 3)" :key="`${candidate.id}-${skill}`">{{ skill }}</span>
              <small v-if="candidate.skills.length > 3">+{{ candidate.skills.length - 3 }}</small>
            </div>

            <button class="compare-modal-expand" type="button" aria-label="View candidate details">
              <AppIcon name="chevronDown" :size="16" />
            </button>
          </article>

          <button class="compare-modal-upload" type="button">
            <span class="compare-modal-upload-icon">
              <AppIcon name="cloud-upload" :size="18" />
            </span>
            <div class="compare-modal-upload-copy">
              <strong>Upload New Candidate</strong>
              <span>Upload a CV to add a new candidate to this job</span>
            </div>
            <small>Supported formats: PDF, DOCX (Max 10MB)</small>
          </button>
        </div>

        <div class="compare-modal-selected">
          <div class="compare-modal-selected-head">
            <strong>Selected Candidates ({{ selectedAddCandidates.length }})</strong>
            <button type="button" @click="clearAddCandidateSelection">Clear all</button>
          </div>

          <div class="compare-modal-selected-list">
            <article
              v-for="candidate in selectedAddCandidates"
              :key="`selected-${candidate.id}`"
              class="compare-modal-selected-chip"
            >
              <span class="compare-modal-avatar is-small">{{ candidate.avatar }}</span>
              <div>
                <strong>{{ candidate.name }}</strong>
                <span>{{ candidate.match }}% match</span>
              </div>
              <button type="button" aria-label="Remove selected candidate" @click="removeAddCandidate(candidate.id)">
                <AppIcon name="close" :size="14" />
              </button>
            </article>
          </div>
        </div>

        <div class="compare-modal-footer">
          <div class="compare-modal-footer-copy">
            <strong>Currently comparing: {{ selectedAddCandidates.length }} of {{ maxCompareCandidates }} candidates</strong>
            <span>You can compare up to {{ maxCompareCandidates }} candidates at a time.</span>
          </div>

          <div class="compare-modal-footer-actions">
            <button class="compare-modal-cancel" type="button" @click="closeAddCandidateModal">Cancel</button>
            <button class="compare-modal-apply" type="button" :disabled="!selectedAddCandidates.length" @click="applySelectedCandidates">
              Add {{ selectedAddCandidates.length }} Candidate{{ selectedAddCandidates.length === 1 ? '' : 's' }} to Comparison
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.compare-page {
  min-height: calc(100vh - 88px);
  background:
    radial-gradient(circle at top left, rgba(245, 91, 168, 0.08), transparent 28%),
    linear-gradient(180deg, #fcfdff 0%, #f7f9fc 100%);
}

.compare-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 22px 24px 36px;
}

.compare-panel {
  border: 1px solid #dde5f1;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 40px rgba(21, 32, 67, 0.06);
}

.compare-topbar,
.compare-hero-head,
.compare-hero-title,
.compare-hero-actions,
.compare-selection-strip,
.compare-recommendation,
.compare-main-grid,
.compare-detail-grid,
.compare-footer,
.compare-footer-copy,
.compare-footer-actions,
.compare-section-head,
.compare-section-head--split,
.compare-confidence-meter,
.compare-table-head {
  display: flex;
  align-items: center;
}

.compare-topbar,
.compare-hero-head,
.compare-footer,
.compare-section-head--split {
  justify-content: space-between;
}

.compare-back,
.compare-close,
.compare-outline,
.compare-primary,
.compare-swap,
.compare-chip,
.compare-candidate-switch,
.compare-next-list button,
.compare-full-button,
.compare-reset {
  border: 0;
  background: transparent;
  font: inherit;
}

.compare-back,
.compare-close,
.compare-outline,
.compare-primary,
.compare-swap,
.compare-candidate-switch,
.compare-full-button,
.compare-reset {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  cursor: pointer;
}

.compare-back,
.compare-close,
.compare-outline,
.compare-swap,
.compare-candidate-switch {
  border: 1px solid #d9e2ef;
  background: #fff;
  color: #172444;
}

.compare-primary {
  color: #fff;
  background: linear-gradient(90deg, #ff4f9c 0%, #f2388e 100%);
  box-shadow: 0 12px 28px rgba(242, 56, 142, 0.24);
}

.compare-close {
  width: 42px;
  justify-content: center;
  padding: 0;
}

.compare-hero {
  margin-top: 14px;
  padding: 20px;
}

.compare-hero-title {
  gap: 16px;
}

.compare-hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(245, 91, 168, 0.1);
  color: #f55ba8;
}

.compare-hero-icon.is-small {
  width: 38px;
  height: 38px;
  border-radius: 12px;
}

.compare-hero-title h1 {
  margin: 0;
  color: #162447;
  font-size: 2rem;
  line-height: 1.1;
}

.compare-hero-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  color: #6f7f99;
}

.compare-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c8d1df;
}

.compare-highlight {
  color: #f55ba8;
  font-weight: 700;
}

.compare-hero-actions {
  gap: 10px;
}

.compare-selection-strip {
  gap: 0;
  margin-top: 18px;
  border: 1px solid #e7edf7;
  border-radius: 18px;
  overflow: hidden;
  align-items: stretch;
}

.compare-cap-card,
.compare-chip,
.compare-swap {
  min-height: 128px;
  background: #fff;
}

.compare-cap-card {
  display: grid;
  align-content: center;
  gap: 6px;
  width: 200px;
  padding: 18px 22px;
}

.compare-cap-card strong {
  color: #162447;
}

.compare-cap-card span {
  color: #6f7f99;
  font-size: 0.82rem;
  line-height: 1.35;
}

.compare-chip {
  display: grid;
  grid-template-rows: auto 1fr auto;
  justify-items: start;
  align-content: start;
  flex: 1 1 0;
  gap: 12px;
  padding: 12px 18px 10px;
  border-left: 1px solid #edf1f8;
  border-radius: 0;
  min-width: 0;
}

.compare-chip.is-active {
  background: #fff8fc;
}

.compare-chip-copy {
  display: grid;
  gap: 4px;
  width: 100%;
  text-align: left;
  align-self: start;
}

.compare-chip-copy strong {
  color: #162447;
  font-size: 0.94rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.compare-chip-copy small {
  color: #1f9b53;
  font-size: 0.8rem;
  font-weight: 700;
}

.compare-chip-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  flex: 0 0 36px;
  justify-self: center;
}

.compare-chip-avatar.is-small {
  width: 28px;
  height: 28px;
  flex-basis: 28px;
  font-size: 0.72rem;
}

.compare-chip-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 24px;
  height: 24px;
  color: #162447;
  opacity: 0.9;
}

.compare-swap {
  margin-left: auto;
  min-width: 230px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  border-left: 1px solid #edf1f8;
  background:
    radial-gradient(circle at top right, rgba(245, 91, 168, 0.12), transparent 55%),
    linear-gradient(180deg, #fffafd 0%, #fff 100%);
  color: #f55ba8;
  font-weight: 700;
  text-align: left;
}

.compare-swap-copy {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.compare-swap-label {
  color: #ff4f9c;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.2;
}

.compare-swap-note {
  color: #8d7a94;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.45;
}

.compare-swap-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 79, 156, 0.1);
  color: #ff4f9c;
  box-shadow: inset 0 0 0 1px rgba(255, 79, 156, 0.14);
}

.compare-recommendation {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(220px, 0.7fr) minmax(240px, 0.85fr);
  gap: 16px;
  margin-top: 14px;
  padding: 18px;
  align-items: stretch;
}

.compare-recommendation-main {
  min-width: 0;
}

.compare-panel-title,
.compare-mini-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compare-panel-mark,
.compare-rec-icon,
.compare-simulator-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.compare-panel-mark {
  width: 28px;
  height: 28px;
  background: rgba(245, 91, 168, 0.1);
  color: #f55ba8;
}

.compare-recommendation-main h2,
.compare-section-head h3 {
  margin: 12px 0 0;
  color: #162447;
}

.compare-recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.compare-rec-card {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e8eef7;
  border-radius: 14px;
  background: #fff;
  min-width: 0;
}

.compare-rec-card.is-warning {
  background: #fffaf5;
}

.compare-rec-card > div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.compare-rec-icon {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
}

.compare-rec-icon.is-violet {
  background: rgba(123, 97, 255, 0.12);
  color: #7b61ff;
}

.compare-rec-icon.is-blue {
  background: rgba(107, 139, 255, 0.12);
  color: #6b8bff;
}

.compare-rec-icon.is-green {
  background: rgba(35, 193, 107, 0.12);
  color: #23c16b;
}

.compare-rec-icon.is-orange {
  background: rgba(242, 139, 45, 0.12);
  color: #f28b2d;
}

.compare-rec-card strong,
.compare-impact-list strong,
.compare-section-head h3,
.compare-ranking-copy strong,
.compare-table-head strong,
.compare-next-list strong {
  color: #162447;
}

.compare-rec-card small,
.compare-impact-list span,
.compare-impact-list strong,
.compare-section-copy,
.compare-ranking-copy small,
.compare-table-head small,
.compare-next-list span,
.compare-footer-copy span {
  color: #6f7f99;
}

.compare-confidence-card,
.compare-impact-card {
  min-width: 0;
  padding-left: 16px;
  border-left: 1px solid #edf1f8;
}

.compare-mini-head {
  justify-content: space-between;
}

.compare-confidence-meter {
  gap: 12px;
  margin-top: 18px;
  align-items: center;
}

.compare-confidence-meter > div:last-child {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.compare-confidence-ring {
  --confidence-angle: calc(var(--confidence, 92) * 3.6deg);
  position: relative;
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  flex: 0 0 96px;
  border-radius: 50%;
  background: conic-gradient(from -90deg, #7c4dff 0deg, #8b5cf6 var(--confidence-angle), #ece8ff var(--confidence-angle), #ece8ff 360deg);
  box-shadow: inset 0 0 0 1px rgba(124, 77, 255, 0.06);
}

.compare-confidence-ring::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(221, 229, 241, 0.7);
}

.compare-confidence-ring div {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #162447;
  font-weight: 800;
  font-size: 1.1rem;
}

.compare-confidence-meter strong {
  display: block;
  color: #162447;
  line-height: 1.3;
}

.compare-confidence-meter small {
  display: block;
  color: #6f7f99;
  line-height: 1.5;
}

.compare-impact-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.compare-impact-list div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.compare-impact-list strong {
  color: #1f9b53;
  font-size: 0.82rem;
  text-align: right;
}

.compare-main-grid {
  gap: 14px;
  margin-top: 14px;
  align-items: stretch;
}

.compare-main-grid > .compare-panel {
  flex: 1;
  min-width: 0;
  padding: 18px;
}

.compare-section-copy {
  margin: 8px 0 0;
}

.compare-ranking-list,
.compare-next-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.compare-ranking-row {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 140px;
  gap: 10px;
  align-items: center;
}

.compare-ranking-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 9px;
  background: #f4f6fb;
  color: #7b889f;
  font-size: 0.78rem;
  font-weight: 700;
}

.compare-ranking-copy {
  display: grid;
  gap: 4px;
}

.compare-ranking-copy small {
  color: #1f9b53;
  font-weight: 700;
}

.compare-ranking-bar {
  height: 5px;
  border-radius: 999px;
  background: #edf1f7;
  overflow: hidden;
}

.compare-ranking-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e 0%, #18a85d 100%);
}

.compare-full-button {
  justify-content: center;
  margin-top: 16px;
  border: 1px solid rgba(245, 91, 168, 0.24);
  color: #f55ba8;
}

.compare-full-button.is-ghost {
  background: #fff9fc;
}

.compare-simulator-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.compare-simulator-card {
  padding: 12px 10px;
  border: 1px solid #e7edf6;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #fbfcff 100%);
  text-align: center;
}

.compare-simulator-card strong,
.compare-outcome-list strong,
.compare-footer-copy strong {
  display: block;
  margin-top: 8px;
  color: #162447;
}

.compare-simulator-card small {
  display: block;
  margin-top: 6px;
  color: #6f7f99;
}

.compare-simulator-card.is-pink {
  background: #fff8fc;
}

.compare-simulator-card.is-violet {
  background: #faf8ff;
}

.compare-simulator-card.is-blue {
  background: #f8fbff;
}

.compare-simulator-card.is-orange {
  background: #fffaf5;
}

.compare-simulator-card.is-green {
  background: #f7fffb;
}

.compare-priority-bar {
  margin-top: 18px;
}

.compare-range {
  margin-top: 12px;
  height: 4px;
  border-radius: 999px;
  background: #edf1f7;
  position: relative;
}

.compare-range span {
  position: absolute;
  left: 0;
  width: 48%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff4f9c 0%, #f2388e 100%);
}

.compare-range span::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f2388e;
  transform: translateY(-50%);
}

.compare-reset {
  margin-top: 12px;
  color: #7b889f;
  padding: 0;
}

.compare-candidate-switch {
  height: 34px;
  padding: 0 10px;
  gap: 8px;
}

.compare-outcome-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.compare-outcome-list div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
}

.compare-outcome-list span {
  color: #6f7f99;
}

.compare-outcome-list em {
  color: #1f9b53;
  font-style: normal;
  font-size: 0.78rem;
  font-weight: 700;
}

.compare-rec-card strong,
.compare-rec-card small,
.compare-impact-list span,
.compare-impact-list strong,
.compare-outcome-list span,
.compare-outcome-list strong,
.compare-outcome-list em {
  overflow-wrap: anywhere;
}

.compare-detail-grid {
  gap: 14px;
  margin-top: 14px;
  align-items: flex-start;
}

.compare-table-panel {
  flex: 1;
  min-width: 0;
  padding: 18px;
}

.compare-side-stack {
  width: 300px;
  display: grid;
  gap: 12px;
}

.compare-side-stack > .compare-panel {
  padding: 18px;
}

.compare-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf1f7;
}

.compare-tabs button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #6f7f99;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.compare-tabs button.is-active {
  color: #f55ba8;
}

.compare-table-wrap {
  overflow-x: auto;
  margin-top: 14px;
}

.compare-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

.compare-table th,
.compare-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #edf1f7;
  text-align: left;
  vertical-align: top;
}

.compare-table th:first-child,
.compare-table td:first-child {
  width: 190px;
}

.compare-table th {
  color: #6f7f99;
  font-size: 0.82rem;
}

.compare-table td strong {
  display: block;
  color: #162447;
}

.compare-table td small,
.compare-table td span {
  color: #6f7f99;
}

.compare-table-head {
  gap: 8px;
  align-items: flex-start;
}

.compare-table-head > div {
  display: grid;
  gap: 3px;
}

.compare-metric-cell {
  display: grid;
  gap: 8px;
}

.compare-next-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.compare-next-head h3 {
  margin: 0;
  color: #162447;
  font-size: 1rem;
}

.compare-next-head-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 8px;
  color: #f55ba8;
  background: rgba(245, 91, 168, 0.12);
}

.compare-next-action {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #e7edf7;
  border-radius: 9px;
  background: #fff;
  text-align: left;
  box-shadow: none;
}

.compare-next-action > div {
  display: block;
  min-width: 0;
}

.compare-next-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #fff3fa;
  color: #f55ba8;
}

.compare-next-list strong {
  font-size: 0.84rem;
  line-height: 1.2;
}

.compare-next-action.is-active {
  border-color: #eb67ad;
  background: linear-gradient(90deg, #ef67b1 0%, #e65aa7 100%);
}

.compare-next-action.is-active .compare-next-icon {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.compare-next-action.is-active strong {
  color: #fff;
}

.compare-footer {
  margin-top: 14px;
  padding: 16px 18px;
}

.compare-footer-copy {
  gap: 12px;
}

.compare-footer-copy > div {
  display: grid;
  gap: 4px;
}

.compare-footer-actions {
  gap: 10px;
}

.compare-modal-layer {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 28, 48, 0.34);
  backdrop-filter: blur(6px);
}

.compare-modal {
  width: min(100%, 780px);
  max-height: calc(100vh - 48px);
  overflow: auto;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 32px 90px rgba(16, 24, 40, 0.22);
  padding: 22px 22px 16px;
}

.compare-modal-head,
.compare-modal-title,
.compare-modal-toolbar,
.compare-modal-meta,
.compare-modal-row,
.compare-modal-selected-head,
.compare-modal-selected-chip,
.compare-modal-footer,
.compare-modal-footer-actions,
.compare-modal-role,
.compare-modal-location {
  display: flex;
  align-items: center;
}

.compare-modal-head,
.compare-modal-meta,
.compare-modal-selected-head,
.compare-modal-footer {
  justify-content: space-between;
}

.compare-modal-title {
  gap: 14px;
}

.compare-modal-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #fff1f8;
  color: #f55ba8;
}

.compare-modal-title h2 {
  margin: 0;
  color: #162447;
  font-size: 1.15rem;
  line-height: 1.1;
}

.compare-modal-role {
  gap: 8px;
  margin-top: 6px;
  color: #f55ba8;
  font-size: 0.78rem;
}

.compare-modal-close,
.compare-modal-filter,
.compare-modal-sort,
.compare-modal-check-button,
.compare-modal-expand,
.compare-modal-selected-head button,
.compare-modal-selected-chip button,
.compare-modal-cancel,
.compare-modal-apply,
.compare-modal-upload {
  border: 0;
  background: transparent;
  font: inherit;
}

.compare-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: #97a4bb;
  cursor: pointer;
}

.compare-modal-copy {
  margin: 18px 0 14px;
  color: #6f7f99;
  font-size: 0.8rem;
}

.compare-modal-toolbar {
  gap: 10px;
}

.compare-modal-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 11px;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  color: #9aa6bb;
  font-size: 0.78rem;
}

.compare-modal-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #162447;
  font: inherit;
}

.compare-modal-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 13px;
  border: 1px solid #dfe6f2;
  border-radius: 10px;
  color: #4e5d78;
  cursor: pointer;
  font-size: 0.78rem;
}

.compare-modal-meta {
  margin-top: 16px;
  color: #6f7f99;
}

.compare-modal-meta strong {
  font-size: 0.74rem;
  letter-spacing: 0.04em;
}

.compare-modal-sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6f7f99;
  cursor: pointer;
  font-size: 0.76rem;
}

.compare-modal-list {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.compare-modal-row {
  gap: 12px;
  padding: 11px 12px;
  border: 1px solid #e8edf6;
  border-radius: 13px;
  background: #fff;
}

.compare-modal-row.is-selected {
  border-color: #e8edf6;
  box-shadow: none;
}

.compare-modal-check-button,
.compare-modal-expand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.compare-modal-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border: 1px solid #d9e2ef;
  border-radius: 5px;
  color: #fff;
  background: #fff;
}

.compare-modal-check.is-selected {
  border-color: #f55ba8;
  background: #f55ba8;
}

.compare-modal-check.is-disabled {
  opacity: 0.45;
}

.compare-modal-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  flex: 0 0 38px;
}

.compare-modal-avatar.is-small {
  width: 30px;
  height: 30px;
  flex-basis: 30px;
  font-size: 0.7rem;
}

.compare-modal-row-main {
  flex: 1;
  min-width: 0;
}

.compare-modal-name strong {
  display: block;
  color: #162447;
  font-size: 0.82rem;
  line-height: 1.2;
}

.compare-modal-name span,
.compare-modal-row-meta,
.compare-modal-selected-chip span,
.compare-modal-footer-copy span,
.compare-modal-upload-copy span,
.compare-modal-upload small {
  color: #6f7f99;
}

.compare-modal-row-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 3px;
  font-size: 0.72rem;
}

.compare-modal-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c6d0df;
}

.compare-modal-location {
  gap: 4px;
}

.compare-modal-match {
  color: #f55ba8;
  white-space: nowrap;
  font-size: 0.78rem;
  font-weight: 700;
}

.compare-modal-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 230px;
  justify-content: flex-start;
}

.compare-modal-tags span,
.compare-modal-tags small {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 7px;
  background: #f5f7fb;
  color: #5f6d87;
  font-size: 0.68rem;
}

.compare-modal-expand {
  width: 24px;
  height: 24px;
  color: #a4b0c3;
}

.compare-modal-upload {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px dashed #f1a7cf;
  border-radius: 14px;
  background: #fff8fc;
  text-align: left;
  cursor: pointer;
}

.compare-modal-upload-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #fff;
  color: #f55ba8;
  box-shadow: inset 0 0 0 1px rgba(245, 91, 168, 0.14);
}

.compare-modal-upload-copy strong {
  display: block;
  color: #162447;
  font-size: 0.82rem;
}

.compare-modal-upload-copy span {
  display: block;
  margin-top: 2px;
  font-size: 0.74rem;
}

.compare-modal-upload small {
  font-size: 0.72rem;
  text-align: right;
}

.compare-modal-selected {
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid #ebeff6;
  border-radius: 16px;
  background: #fff;
}

.compare-modal-selected-head strong {
  color: #162447;
  font-size: 0.78rem;
}

.compare-modal-selected-head button {
  color: #f55ba8;
  cursor: pointer;
  font-size: 0.75rem;
}

.compare-modal-selected-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.compare-modal-selected-chip {
  gap: 10px;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #edf1f7;
  border-radius: 12px;
}

.compare-modal-selected-chip > div {
  min-width: 0;
}

.compare-modal-selected-chip strong {
  display: block;
  color: #162447;
  overflow-wrap: anywhere;
  font-size: 0.74rem;
}

.compare-modal-selected-chip button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #9aa6bb;
  cursor: pointer;
}

.compare-modal-footer {
  gap: 18px;
  margin-top: 18px;
}

.compare-modal-footer-copy strong {
  display: block;
  color: #162447;
  font-size: 0.76rem;
}

.compare-modal-footer-copy span {
  display: block;
  margin-top: 4px;
  font-size: 0.72rem;
}

.compare-modal-footer-actions {
  gap: 12px;
  flex-shrink: 0;
}

.compare-modal-cancel,
.compare-modal-apply {
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.78rem;
}

.compare-modal-cancel {
  border: 1px solid #dfe6f2;
  background: #fff;
  color: #162447;
}

.compare-modal-apply {
  background: linear-gradient(90deg, #ff5aa7 0%, #f24796 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(242, 71, 150, 0.22);
}

.compare-modal-apply:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 1400px) {
  .compare-recommendation {
    grid-template-columns: 1fr;
  }

  .compare-main-grid,
  .compare-detail-grid {
    flex-direction: column;
  }

  .compare-confidence-card,
  .compare-impact-card,
  .compare-side-stack {
    width: 100%;
    border-left: 0;
    border-top: 1px solid #edf1f7;
    padding-left: 0;
    padding-top: 16px;
  }
}

@media (max-width: 980px) {
  .compare-shell {
    padding: 18px 16px 28px;
  }

  .compare-hero-head,
  .compare-topbar,
  .compare-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .compare-selection-strip {
    flex-direction: column;
  }

  .compare-cap-card,
  .compare-swap,
  .compare-chip {
    width: 100%;
  }

  .compare-chip {
    min-height: 112px;
  }

  .compare-swap {
    min-width: 0;
  }

  .compare-recommendation-grid,
  .compare-simulator-grid {
    grid-template-columns: 1fr;
  }

  .compare-modal {
    padding: 22px 18px 18px;
  }

  .compare-modal-toolbar,
  .compare-modal-footer,
  .compare-modal-row {
    flex-direction: column;
    align-items: stretch;
  }

  .compare-modal-selected-list {
    grid-template-columns: 1fr;
  }

  .compare-modal-upload {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .compare-modal-upload small {
    text-align: left;
  }
}
</style>
