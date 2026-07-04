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
    default: 'Sarah Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Qualified',
  },
})

const emit = defineEmits(['close'])

const hiringManagers = [
  {
    id: 'james-carter',
    name: 'James Carter',
    role: 'Director of Product Design',
    department: 'Product Design',
    match: '92% Match',
    matchTone: 'green',
    workload: 'Medium',
    workloadTone: 'orange',
    bestMatch: true,
  },
  {
    id: 'olivia-bennett',
    name: 'Olivia Bennett',
    role: 'Lead Product Designer',
    department: 'Product Design',
    match: '88% Match',
    matchTone: 'green',
    workload: 'Low',
    workloadTone: 'green',
  },
  {
    id: 'daniel-kim',
    name: 'Daniel Kim',
    role: 'Principal Designer',
    department: 'Product Design',
    match: '79% Match',
    matchTone: 'orange',
    workload: 'High',
    workloadTone: 'red',
  },
  {
    id: 'michael-torres',
    name: 'Michael Torres',
    role: 'Design Manager',
    department: 'Product Design',
    match: '74% Match',
    matchTone: 'orange',
    workload: 'Medium',
    workloadTone: 'orange',
  },
]

const flowState = ref('form')
const selectedManagerId = ref(hiringManagers[0].id)
const contextNote = ref('')

const selectedManager = computed(() => (
  hiringManagers.find((manager) => manager.id === selectedManagerId.value) ?? hiringManagers[0]
))

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const selectedManagerInitials = computed(() => (
  selectedManager.value.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetFlow() {
  flowState.value = 'form'
  selectedManagerId.value = hiringManagers[0].id
  contextNote.value = ''
}

function closeOverlay() {
  emit('close')
}

function assignHiringManager() {
  flowState.value = 'success'
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetFlow()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="assign-manager-overlay" :class="{ 'is-success': flowState === 'success' }" @click.self="closeOverlay">
      <section v-if="flowState === 'form'" class="assign-manager-modal">
        <header class="assign-manager-modal__head">
          <div class="assign-manager-modal__title">
            <span class="assign-manager-modal__title-icon">
              <AppIcon name="user" :size="20" />
            </span>
            <div>
              <h2>Assign Hiring Manager</h2>
              <p>Choose the right hiring manager who will lead the evaluation and decision for this role.</p>
            </div>
          </div>

          <button class="assign-manager-modal__close" type="button" aria-label="Close assign hiring manager" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="assign-manager-modal__body">
          <aside class="assign-manager-sidebar">
            <article class="assign-manager-profile-card">
              <span class="assign-manager-profile-card__avatar">{{ candidateInitials }}</span>
              <strong>{{ candidateName }}</strong>
              <p>{{ candidateRole }}</p>

              <div class="assign-manager-profile-card__chips">
                <span>Strong Hire</span>
                <span>92% Match</span>
                <span>Low Risk</span>
              </div>

              <div class="assign-manager-profile-card__meta">
                <div>
                  <small>Current Stage</small>
                  <strong>{{ candidateStage }}</strong>
                </div>
                <div>
                  <small>Recommended Next Step</small>
                  <strong>HM Interview</strong>
                </div>
                <div>
                  <small>AI Summary</small>
                  <p>"Strong portfolio, leadership and design thinking. Salary slightly above target range."</p>
                </div>
              </div>
            </article>

            <article class="assign-manager-role-card">
              <h3>About This Role</h3>
              <dl>
                <div><dt>Job Title</dt><dd>{{ candidateRole }}</dd></div>
                <div><dt>Department</dt><dd>Product Design</dd></div>
                <div><dt>Location</dt><dd>San Francisco, CA (Hybrid)</dd></div>
                <div><dt>Employment Type</dt><dd>Full-time</dd></div>
              </dl>
            </article>
          </aside>

          <section class="assign-manager-main">
            <div class="assign-manager-section">
              <h3>1. Select Hiring Manager <span>*</span></h3>
              <p>This person will own the evaluation and final recommendation for this candidate.</p>

              <div class="assign-manager-toolbar">
                <label class="assign-manager-search">
                  <AppIcon name="search" :size="18" />
                  <input type="text" placeholder="Search by name, role or department">
                </label>
                <button class="assign-manager-filter" type="button">
                  <AppIcon name="filter" :size="16" />
                  <span>Filters</span>
                </button>
              </div>

              <div class="assign-manager-list">
                <button
                  v-for="manager in hiringManagers"
                  :key="manager.id"
                  class="assign-manager-row"
                  :class="{ 'is-selected': selectedManagerId === manager.id }"
                  type="button"
                  @click="selectedManagerId = manager.id"
                >
                  <span class="assign-manager-row__radio">
                    <i v-if="selectedManagerId === manager.id"></i>
                  </span>
                  <span class="assign-manager-row__avatar">{{ manager.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }}</span>
                  <span class="assign-manager-row__identity">
                    <strong>{{ manager.name }}</strong>
                    <small>{{ manager.role }}</small>
                  </span>
                  <span v-if="manager.bestMatch" class="assign-manager-row__badge">BEST MATCH</span>
                  <span class="assign-manager-row__department">{{ manager.department }}</span>
                  <span class="assign-manager-row__match" :class="`is-${manager.matchTone}`">
                    <AppIcon name="spark" :size="14" />
                    <strong>{{ manager.match }}</strong>
                  </span>
                  <span class="assign-manager-row__workload">
                    <AppIcon name="team-gear" :size="15" />
                    <small>Workload</small>
                    <strong :class="`is-${manager.workloadTone}`">{{ manager.workload }}</strong>
                  </span>
                </button>
              </div>

              <button class="assign-manager-show-more" type="button">
                <span>Show more</span>
                <AppIcon name="chevronDown" :size="14" />
              </button>
            </div>

            <div class="assign-manager-section">
              <h3>2. Add Context <small>(Optional)</small></h3>
              <p>Share any context or expectations with the hiring manager.</p>
              <div class="assign-manager-textarea">
                <textarea v-model="contextNote" maxlength="300" rows="5" placeholder="E.g., key areas to evaluate, priorities, or specific feedback you're looking for..." />
                <small>{{ contextNote.length }} / 300</small>
              </div>
            </div>

            <article class="assign-manager-next-card">
              <span class="assign-manager-next-card__icon">
                <AppIcon name="users" :size="18" />
              </span>
              <div>
                <strong>What happens next?</strong>
                <p>The assigned hiring manager will be notified and will get access to the candidate profile and evaluation materials.</p>
              </div>
            </article>
          </section>
        </div>

        <footer class="assign-manager-modal__footer">
          <button class="assign-manager-button assign-manager-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="assign-manager-button assign-manager-button--primary" type="button" @click="assignHiringManager">
            <AppIcon name="user" :size="16" />
            <span>Assign Hiring Manager</span>
          </button>
        </footer>
      </section>

      <section v-else class="assign-manager-success">
        <div class="assign-manager-success__glow assign-manager-success__glow--pink" aria-hidden="true"></div>
        <div class="assign-manager-success__glow assign-manager-success__glow--blue" aria-hidden="true"></div>

        <article class="assign-manager-success__card">
          <div class="assign-manager-success__icon">
            <AppIcon name="checkCircle" :size="36" />
          </div>

          <h2>Hiring Manager Assigned</h2>
          <p>{{ selectedManager.name }} has been successfully assigned to oversee <span>{{ candidateName }}</span>'s recruitment process.</p>

          <div class="assign-manager-success__summary">
            <div class="assign-manager-success__summary-row">
              <small>Candidate</small>
              <div>
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
              </div>
              <span class="assign-manager-success__mini-avatar">{{ candidateInitials }}</span>
            </div>

            <div class="assign-manager-success__summary-row">
              <small>Assigned to</small>
              <div>
                <strong>{{ selectedManager.name }}</strong>
                <span>{{ selectedManager.role }}</span>
              </div>
              <span class="assign-manager-success__mini-avatar is-dark">{{ selectedManagerInitials }}</span>
            </div>

            <div class="assign-manager-success__summary-row">
              <small>Date</small>
              <div class="assign-manager-success__date-pill">June 24, 2025</div>
            </div>
          </div>

          <article class="assign-manager-success__next">
            <strong><AppIcon name="sparkles" :size="16" /> What happens next?</strong>
            <p>James will receive an automated notification and gain full editing access to the candidate profile and interview scheduling tools.</p>
          </article>

          <button class="assign-manager-success__primary" type="button" @click="closeOverlay">
            <span>Back to Candidate Profile</span>
            <AppIcon name="chevronRight" :size="16" />
          </button>
          <button class="assign-manager-success__secondary" type="button" @click="closeOverlay">Go to Pipeline</button>
        </article>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.assign-manager-overlay,
.assign-manager-overlay *,
.assign-manager-overlay *::before,
.assign-manager-overlay *::after {
  box-sizing: border-box;
}

.assign-manager-overlay button,
.assign-manager-overlay input,
.assign-manager-overlay textarea {
  font: inherit;
}

.assign-manager-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(20, 28, 48, 0.56);
  backdrop-filter: blur(7px);
}

.assign-manager-overlay.is-success {
  background: rgba(11, 18, 32, 0.82);
}

.assign-manager-modal {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.26);
}

.assign-manager-modal__head,
.assign-manager-modal__title,
.assign-manager-toolbar,
.assign-manager-search,
.assign-manager-filter,
.assign-manager-row,
.assign-manager-row__identity,
.assign-manager-row__match,
.assign-manager-row__workload,
.assign-manager-show-more,
.assign-manager-next-card,
.assign-manager-modal__footer,
.assign-manager-button,
.assign-manager-success,
.assign-manager-success__card,
.assign-manager-success__summary-row,
.assign-manager-success__next,
.assign-manager-success__primary,
.assign-manager-success__secondary {
  display: flex;
  align-items: center;
}

.assign-manager-modal__head,
.assign-manager-modal__footer,
.assign-manager-toolbar,
.assign-manager-row,
.assign-manager-success__summary-row,
.assign-manager-success__primary {
  justify-content: space-between;
}

.assign-manager-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.assign-manager-modal__title {
  gap: 14px;
}

.assign-manager-modal__title-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #fff1f8;
  color: #ff61af;
}

.assign-manager-modal__title h2,
.assign-manager-success h2 {
  margin: 0;
  color: #222657;
}

.assign-manager-modal__title h2 {
  font-size: 1rem;
}

.assign-manager-modal__title p {
  margin: 4px 0 0;
  color: #70809c;
}

.assign-manager-modal__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #9ba8bc;
  cursor: pointer;
}

.assign-manager-modal__body {
  min-height: 0;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  overflow: auto;
}

.assign-manager-sidebar {
  padding: 24px;
  border-right: 1px solid #edf2fb;
  background: #fff;
}

.assign-manager-profile-card,
.assign-manager-role-card {
  border: 1px solid #e9eef6;
  border-radius: 16px;
  background: #fff;
}

.assign-manager-profile-card {
  padding: 24px 22px;
  text-align: center;
}

.assign-manager-profile-card__avatar {
  width: 92px;
  height: 92px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd9ef 0%, #f8faff 100%);
  color: #ff5aac;
  font-size: 1.7rem;
  font-weight: 800;
}

.assign-manager-profile-card strong,
.assign-manager-role-card h3,
.assign-manager-section h3,
.assign-manager-next-card strong,
.assign-manager-success__summary-row strong,
.assign-manager-success__next strong {
  color: #222657;
}

.assign-manager-profile-card strong {
  display: block;
  margin-top: 18px;
  font-size: 1rem;
}

.assign-manager-profile-card p {
  margin: 6px 0 0;
  color: #70809c;
}

.assign-manager-profile-card__chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.assign-manager-profile-card__chips span {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.assign-manager-profile-card__chips span:nth-child(1),
.assign-manager-profile-card__chips span:nth-child(2) {
  background: #eefbf2;
  color: #1f9a55;
}

.assign-manager-profile-card__chips span:nth-child(3) {
  background: #eef4ff;
  color: #5680ff;
}

.assign-manager-profile-card__meta {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf2fb;
  text-align: left;
}

.assign-manager-profile-card__meta div + div {
  margin-top: 18px;
}

.assign-manager-profile-card__meta small,
.assign-manager-role-card dt,
.assign-manager-success__summary-row small {
  display: block;
  color: #98a2b3;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.assign-manager-profile-card__meta strong {
  margin-top: 8px;
  font-size: 0.96rem;
}

.assign-manager-profile-card__meta p {
  margin: 8px 0 0;
  color: #5d6982;
  font-style: italic;
  line-height: 1.55;
}

.assign-manager-role-card {
  margin-top: 22px;
  padding: 18px 20px;
  background: #fff8fb;
  border-color: #f8dbe8;
}

.assign-manager-role-card h3 {
  margin: 0 0 16px;
  font-size: 1rem;
}

.assign-manager-role-card dl {
  margin: 0;
  display: grid;
  gap: 12px;
}

.assign-manager-role-card div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
}

.assign-manager-role-card dd {
  margin: 0;
  color: #1f2a3d;
  font-weight: 600;
  text-align: right;
}

.assign-manager-main {
  padding: 28px 30px;
}

.assign-manager-section + .assign-manager-section {
  margin-top: 34px;
}

.assign-manager-section h3 {
  margin: 0;
  font-size: 1rem;
}

.assign-manager-section h3 span {
  color: #ff5aac;
}

.assign-manager-section h3 small {
  color: #98a2b3;
  font-size: 1em;
}

.assign-manager-section > p {
  margin: 8px 0 0;
  color: #70809c;
}

.assign-manager-toolbar {
  gap: 12px;
  margin-top: 16px;
}

.assign-manager-search {
  flex: 1 1 auto;
  gap: 10px;
  height: 42px;
  padding: 0 14px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  color: #8a97ad;
}

.assign-manager-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #1f2a3d;
}

.assign-manager-filter {
  gap: 8px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  color: #344054;
  cursor: pointer;
}

.assign-manager-list {
  display: grid;
  gap: 14px;
  margin-top: 18px;
}

.assign-manager-row {
  gap: 14px;
  width: 100%;
  min-height: 82px;
  padding: 0 16px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  text-align: left;
}

.assign-manager-row.is-selected {
  border-color: #ff73b6;
  box-shadow: inset 0 0 0 1px rgba(255, 115, 182, 0.18);
}

.assign-manager-row__radio {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7dfee;
  border-radius: 50%;
  flex: 0 0 22px;
}

.assign-manager-row.is-selected .assign-manager-row__radio {
  border-color: #ff5aac;
}

.assign-manager-row__radio i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5aac;
}

.assign-manager-row__avatar,
.assign-manager-success__mini-avatar {
  width: 52px;
  height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 52px;
}

.assign-manager-row__identity {
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
}

.assign-manager-row__identity strong {
  font-size: 0.96rem;
}

.assign-manager-row__identity small,
.assign-manager-row__department,
.assign-manager-row__workload small,
.assign-manager-success__summary-row span,
.assign-manager-success p {
  color: #70809c;
}

.assign-manager-row__badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff5aac;
  font-size: 0.76rem;
  font-weight: 800;
}

.assign-manager-row__department {
  margin-left: auto;
  font-weight: 500;
}

.assign-manager-row__match {
  gap: 6px;
}

.assign-manager-row__match strong {
  font-size: 0.92rem;
}

.assign-manager-row__match.is-green {
  color: #16a34a;
}

.assign-manager-row__match.is-orange {
  color: #f97316;
}

.assign-manager-row__workload {
  gap: 6px;
}

.assign-manager-row__workload small {
  text-transform: uppercase;
}

.assign-manager-row__workload strong.is-green {
  color: #16a34a;
}

.assign-manager-row__workload strong.is-orange {
  color: #f59e0b;
}

.assign-manager-row__workload strong.is-red {
  color: #ef4444;
}

.assign-manager-show-more {
  gap: 6px;
  margin: 18px auto 0;
  border: 0;
  background: transparent;
  color: #5c6a82;
  cursor: pointer;
}

.assign-manager-textarea {
  position: relative;
  margin-top: 14px;
}

.assign-manager-textarea textarea {
  width: 100%;
  min-height: 116px;
  padding: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  resize: vertical;
  color: #1f2a3d;
}

.assign-manager-textarea small {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: #98a2b3;
  font-size: 0.8rem;
}

.assign-manager-next-card {
  gap: 14px;
  margin-top: 24px;
  padding: 18px 20px;
  border: 1px solid #d6e6ff;
  border-radius: 12px;
  background: #f3f8ff;
  align-items: flex-start;
}

.assign-manager-next-card__icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #dceafe;
  color: #5b8dff;
  flex: 0 0 40px;
}

.assign-manager-next-card strong {
  display: block;
}

.assign-manager-next-card p {
  margin: 6px 0 0;
  color: #5c6a82;
  line-height: 1.55;
}

.assign-manager-modal__footer {
  gap: 14px;
  padding: 20px 24px;
  border-top: 1px solid #edf2fb;
  background: #fff;
}

.assign-manager-button {
  height: 46px;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 0.96rem;
  font-weight: 700;
  cursor: pointer;
}

.assign-manager-button--ghost {
  color: #222657;
  border-color: #d9e2ee;
  background: #fff;
}

.assign-manager-button--primary {
  color: #fff;
  background: linear-gradient(90deg, #ff67ad 0%, #f15ea8 100%);
  box-shadow: 0 12px 24px rgba(241, 94, 168, 0.22);
}

.assign-manager-success {
  position: relative;
  width: min(100%, 1280px);
  min-height: calc(100vh - 48px);
  justify-content: center;
  overflow: hidden;
  padding: 42px 24px;
}

.assign-manager-success__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.92;
  pointer-events: none;
}

.assign-manager-success__glow--pink {
  top: -36px;
  right: -26px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 82, 174, 0.92) 0%, rgba(255, 163, 214, 0.84) 46%, rgba(255, 163, 214, 0) 78%);
}

.assign-manager-success__glow--blue {
  left: -48px;
  bottom: -34px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(196, 224, 255, 0.96) 0%, rgba(220, 235, 255, 0.82) 48%, rgba(220, 235, 255, 0) 78%);
}

.assign-manager-success__card {
  position: relative;
  z-index: 1;
  width: min(100%, 500px);
  padding: 26px 26px 24px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 245, 250, 0.94) 100%);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.24);
  flex-direction: column;
  text-align: center;
}

.assign-manager-success__icon {
  width: 78px;
  height: 78px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #f47abf 0%, #e95aa7 100%);
  color: #fff;
  box-shadow: 0 14px 28px rgba(233, 90, 167, 0.34);
}

.assign-manager-success h2 {
  margin-top: 18px;
  font-size: 1.28rem;
  color: #a72f73;
}

.assign-manager-success p {
  margin: 10px 0 0;
  font-size: 0.92rem;
  line-height: 1.55;
}

.assign-manager-success p span {
  color: #d53f93;
  font-weight: 700;
}

.assign-manager-success__summary {
  width: 100%;
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid #f6dce8;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.assign-manager-success__summary-row + .assign-manager-success__summary-row {
  margin-top: 14px;
}

.assign-manager-success__summary-row {
  gap: 16px;
  align-items: center;
}

.assign-manager-success__summary-row small {
  min-width: 92px;
  text-align: left;
}

.assign-manager-success__summary-row > div {
  min-width: 0;
  flex: 1 1 auto;
  text-align: right;
}

.assign-manager-success__summary-row strong {
  display: block;
}

.assign-manager-success__summary-row span {
  display: block;
  margin-top: 2px;
}

.assign-manager-success__mini-avatar.is-dark {
  background: linear-gradient(135deg, #243b5d 0%, #0f172a 100%);
}

.assign-manager-success__date-pill {
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff1f8;
  color: #d53f93;
  font-weight: 700;
}

.assign-manager-success__next {
  gap: 8px;
  width: 100%;
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid #f7d7e7;
  border-radius: 16px;
  background: rgba(255, 244, 249, 0.86);
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.assign-manager-success__next strong {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #c13f89;
}

.assign-manager-success__next p {
  margin: 0;
  color: #615267;
}

.assign-manager-success__primary,
.assign-manager-success__secondary {
  width: 100%;
  justify-content: center;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.assign-manager-success__primary {
  margin-top: 18px;
  height: 52px;
  gap: 10px;
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #f06eb4 0%, #e35fa7 100%);
}

.assign-manager-success__secondary {
  margin-top: 12px;
  height: 48px;
  border: 1px solid #f4d7e5;
  background: rgba(255, 255, 255, 0.82);
  color: #e157a2;
}

@media (max-width: 1180px) {
  .assign-manager-modal__body {
    grid-template-columns: 1fr;
  }

  .assign-manager-sidebar {
    border-right: 0;
    border-bottom: 1px solid #edf2fb;
  }
}

@media (max-width: 860px) {
  .assign-manager-overlay {
    padding: 14px;
  }

  .assign-manager-modal {
    max-height: calc(100vh - 28px);
    border-radius: 22px;
  }

  .assign-manager-modal__head,
  .assign-manager-main,
  .assign-manager-sidebar,
  .assign-manager-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .assign-manager-toolbar,
  .assign-manager-row,
  .assign-manager-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .assign-manager-row {
    padding: 16px;
  }

  .assign-manager-row__department {
    margin-left: 0;
  }
}

@media (max-width: 620px) {
  .assign-manager-modal__title,
  .assign-manager-success__summary-row {
    align-items: flex-start;
  }

  .assign-manager-role-card div {
    grid-template-columns: 1fr;
  }

  .assign-manager-role-card dd,
  .assign-manager-success__summary-row > div {
    text-align: left;
  }

  .assign-manager-success__summary-row {
    flex-direction: column;
  }

  .assign-manager-success__date-pill,
  .assign-manager-button,
  .assign-manager-button--ghost,
  .assign-manager-button--primary {
    width: 100%;
    margin-left: 0;
  }
}
</style>
