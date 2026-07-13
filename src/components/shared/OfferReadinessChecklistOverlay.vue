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

const emit = defineEmits(['close', 'move-to-offer'])

const showIncompleteOnly = ref(false)
const expandedSection = ref('verification')

const sidebarSteps = [
  ['Review Final Feedback', 'done'],
  ['Create Hiring Decision', 'done'],
  ['Decision Approval', 'done'],
  ['Hiring Committee Approval', 'done'],
  ['Select Backup Candidate', 'done'],
  ['Offer Readiness Checklist', 'active'],
  ['Move to Offer', 'locked'],
]

const checklistSections = [
  {
    id: 'decision',
    number: '1.',
    title: 'Hiring Decisions',
    subtitle: 'Hiring decision and committee approvals',
    progress: '2 / 2 completed',
    state: 'done',
    rows: [],
  },
  {
    id: 'verification',
    number: '2.',
    title: 'Candidate Verification',
    subtitle: 'References, background, and work authorization',
    progress: '2 / 3 completed',
    state: 'warning',
    rows: [
      ['References', 'Completed', '2 of 3 references received', 'View References', 'done'],
      ['Background Check', 'Completed', 'Completed on Apr 23, 2:30 PM', 'View Report', 'done'],
      ['Work Authorization Check', 'Pending', 'E-Verify in progress', 'View Status', 'pending'],
    ],
  },
  {
    id: 'compensation',
    number: '3.',
    title: 'Offer Details & Compensation',
    subtitle: 'Compensation approval and offer details',
    progress: '1 / 2 completed',
    state: 'warning',
    rows: [],
  },
  {
    id: 'onboarding',
    number: '4.',
    title: 'Pre-Employment & Onboarding',
    subtitle: 'Onboarding setup and pre-employment tasks',
    progress: '1 / 2 completed',
    state: 'warning',
    rows: [],
  },
  {
    id: 'compliance',
    number: '5.',
    title: 'Compliance & Legal',
    subtitle: 'Required compliance and legal confirmations',
    progress: '2 / 2 completed',
    state: 'done',
    rows: [],
  },
]

const pendingItems = [
  ['Work Authorization Check', 'E-Verify in progress'],
  ['Compensation Approval', 'Awaiting HR approval'],
  ['Equipment Setup', 'Laptop and access provisioning'],
]

const offerDetails = [
  ['Proposed Salary', '$125,000'],
  ['Bonus', '$15,000'],
  ['Start Date', 'May 12, 2025'],
  ['Reporting Manager', 'Sarah Johnson'],
  ['Work Location', 'San Francisco, CA'],
]

const candidateInitials = computed(() => (
  (props.candidateName || 'Michael Chen')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}

function toggleSection(sectionId) {
  expandedSection.value = expandedSection.value === sectionId ? '' : sectionId
}

function moveToOffer() {
  emit('move-to-offer')
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
      showIncompleteOnly.value = false
      expandedSection.value = 'verification'
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="offer-readiness-overlay" @click.self="closeOverlay">
      <section class="offer-readiness-modal">
        <header class="offer-readiness-modal__head">
          <div class="offer-readiness-modal__title">
            <span class="offer-readiness-modal__title-icon">
              <AppIcon name="clipboard-check" :size="20" />
            </span>
            <div>
              <h2>Offer Readiness Checklist</h2>
              <p>Ensure everything is complete before moving {{ candidateName }} to Offer.</p>
            </div>
          </div>

          <button type="button" aria-label="Close offer readiness checklist" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="offer-readiness-modal__body">
          <aside class="offer-readiness-sidebar">
            <section class="offer-readiness-candidate">
              <strong>Primary Candidate</strong>

              <div class="offer-readiness-candidate__status">Offer Approved</div>

              <div class="offer-readiness-candidate__person">
                <span>{{ candidateInitials }}</span>
                <div>
                  <h3>{{ candidateName }}</h3>
                  <p>{{ candidateRole }}</p>
                  <em>Proceeding to Offer</em>
                </div>
              </div>

              <dl class="offer-readiness-candidate__meta">
                <div><dt>Department</dt><dd>Engineering</dd></div>
                <div><dt>Location</dt><dd>San Francisco, CA</dd></div>
                <div><dt>Proposed Start Date</dt><dd>May 12, 2025</dd></div>
                <div><dt>Employment Type</dt><dd>Full-time</dd></div>
              </dl>
            </section>

            <nav class="offer-readiness-steps">
              <button
                v-for="step in sidebarSteps"
                :key="step[0]"
                type="button"
                class="offer-readiness-step"
                :class="`is-${step[1]}`"
              >
                <span class="offer-readiness-step__icon">
                  <AppIcon
                    :name="step[1] === 'done' ? 'checkCircle' : step[1] === 'active' ? 'clipboard-check' : 'lock'"
                    :size="16"
                  />
                </span>
                <div>
                  <strong>{{ step[0] }}</strong>
                  <small v-if="step[1] === 'active'">You are here</small>
                </div>
              </button>
            </nav>

            <article class="offer-readiness-sidebar-note">
              <AppIcon name="info" :size="15" />
              <p>All checks must be complete to move this candidate to Offer.</p>
            </article>
          </aside>

          <main class="offer-readiness-main">
            <div class="offer-readiness-toolbar">
              <button type="button"><AppIcon name="briefcase" :size="15" /> <span>All Categories</span> <AppIcon name="chevronDown" :size="15" /></button>

              <label class="offer-readiness-toggle">
                <input v-model="showIncompleteOnly" type="checkbox">
                <span>Show incomplete only</span>
              </label>

              <button type="button"><AppIcon name="document" :size="15" /> <span>Load from Template</span></button>
              <button type="button" class="accent"><AppIcon name="plus" :size="15" /> <span>Add Manual Checklist</span></button>
              <button type="button"><AppIcon name="refresh" :size="15" /> <span>Expand All</span></button>
            </div>

            <section class="offer-readiness-content">
              <header class="offer-readiness-content__head">
                <div>
                  <h3>Offer Readiness Checklist</h3>
                  <p>Review all requirement categories below. Expand each item to view details and take action if needed.</p>
                </div>

                <span class="offer-readiness-progress-pill">9 of 12 completed</span>
              </header>

              <div class="offer-readiness-sections">
                <article
                  v-for="section in checklistSections"
                  :key="section.id"
                  class="offer-readiness-section"
                  :class="[`is-${section.state}`, { 'is-expanded': expandedSection === section.id }]"
                >
                  <button
                    type="button"
                    class="offer-readiness-section__summary"
                    @click="toggleSection(section.id)"
                  >
                    <div class="offer-readiness-section__identity">
                      <span class="offer-readiness-section__icon">
                        <AppIcon
                          :name="section.id === 'decision'
                            ? 'clipboard-check'
                            : section.id === 'verification'
                              ? 'refresh'
                              : section.id === 'compensation'
                                ? 'edit'
                                : section.id === 'onboarding'
                                  ? 'building'
                                  : 'document'"
                          :size="18"
                        />
                      </span>
                      <div>
                        <strong>{{ section.number }} {{ section.title }}</strong>
                        <small>{{ section.subtitle }}</small>
                      </div>
                    </div>

                    <div class="offer-readiness-section__meta">
                      <span class="offer-readiness-section__progress" :class="`tone-${section.state}`">{{ section.progress }}</span>
                      <AppIcon :name="section.state === 'done' ? 'checkCircle' : 'alert'" :size="17" :class="`tone-${section.state}`" />
                      <AppIcon :name="expandedSection === section.id ? 'chevronUp' : 'chevronRight'" :size="16" />
                    </div>
                  </button>

                  <div v-if="expandedSection === section.id && section.rows.length" class="offer-readiness-section__details">
                    <div class="offer-readiness-table">
                      <div class="offer-readiness-table__head">
                        <span>Requirement</span>
                        <span>Status</span>
                        <span>Details</span>
                        <span>Action</span>
                      </div>

                      <article
                        v-for="row in section.rows"
                        :key="row[0]"
                        class="offer-readiness-table__row"
                      >
                        <strong>{{ row[0] }}</strong>
                        <span class="offer-readiness-status" :class="`tone-${row[4]}`">
                          <i />
                          {{ row[1] }}
                        </span>
                        <p>{{ row[2] }}</p>
                        <button type="button">{{ row[3] }}</button>
                      </article>
                    </div>

                    <button type="button" class="offer-readiness-add-manual">
                      <AppIcon name="plus" :size="14" />
                      <span>Add Manual Checklist Item</span>
                    </button>
                  </div>
                </article>
              </div>
            </section>
          </main>

          <aside class="offer-readiness-rail">
            <section class="offer-readiness-rail-card">
              <h3>Readiness Overview</h3>

              <div class="offer-readiness-overview">
                <div class="offer-readiness-overview__ring">
                  <span>75%</span>
                  <small>Ready</small>
                </div>

                <ul>
                  <li><i class="done" /> Completed <strong>9</strong></li>
                  <li><i class="pending" /> Pending <strong>3</strong></li>
                  <li><i class="idle" /> Not started <strong>0</strong></li>
                </ul>
              </div>

              <div class="offer-readiness-pending">
                <strong>Pending Items (3)</strong>
                <article v-for="item in pendingItems" :key="item[0]">
                  <span><AppIcon name="alert" :size="15" /></span>
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <small>{{ item[1] }}</small>
                  </div>
                  <AppIcon name="chevronRight" :size="15" />
                </article>
              </div>
            </section>

            <section class="offer-readiness-rail-card">
              <h3>Offer Details</h3>
              <dl class="offer-readiness-offer-details">
                <div v-for="item in offerDetails" :key="item[0]">
                  <dt>{{ item[0] }}</dt>
                  <dd>{{ item[1] }}</dd>
                </div>
              </dl>

              <button type="button" class="offer-readiness-link-button">
                <span>View Offer Details</span>
                <AppIcon name="external-link" :size="15" />
              </button>
            </section>

            <section class="offer-readiness-rail-card success">
              <div>
                <strong>Nearly ready!</strong>
                <p>Complete the pending items to move {{ candidateName.split(' ')[0] }} to the Offer stage.</p>
              </div>
              <span class="offer-readiness-rail-card__icon">
                <AppIcon name="document" :size="18" />
              </span>
            </section>
          </aside>
        </div>

        <footer class="offer-readiness-modal__foot">
          <div class="offer-readiness-footnote">
            <span class="offer-readiness-footnote__icon"><AppIcon name="clipboard-check" :size="15" /></span>
            <div>
              <strong>All checks must be complete</strong>
              <span>to move this candidate to Offer.</span>
            </div>
          </div>

          <div class="offer-readiness-foot-actions">
            <button type="button" class="notify">
              <AppIcon name="bell" :size="16" />
              <span>Notify HR</span>
            </button>

            <button type="button" class="move" @click="moveToOffer">
              <div>
                <strong>Move to Offer</strong>
                <small>3 items pending</small>
              </div>
              <span class="offer-readiness-foot-actions__split">
                <AppIcon name="chevronDown" :size="16" />
              </span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.offer-readiness-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(7px);
}

.offer-readiness-modal {
  width: min(1600px, 100%);
  max-height: calc(100vh - 32px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.offer-readiness-modal__head,
.offer-readiness-modal__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #e8eef7;
}

.offer-readiness-modal__foot {
  border-top: 1px solid #e8eef7;
  border-bottom: none;
  background: #fbfcff;
}

.offer-readiness-modal__title {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.offer-readiness-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #edf0ff;
  color: #5b4bff;
  flex-shrink: 0;
}

.offer-readiness-modal__title h2 {
  margin: 0;
  font-size: 1.95rem;
  font-weight: 800;
  color: #1f2a44;
}

.offer-readiness-modal__title p {
  margin: 4px 0 0;
  color: #7183a6;
  font-size: 1.02rem;
}

.offer-readiness-modal__head > button {
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

.offer-readiness-modal__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr) 300px;
  gap: 0;
}

.offer-readiness-sidebar,
.offer-readiness-rail {
  padding: 22px;
  background: #fbfcff;
}

.offer-readiness-sidebar {
  border-right: 1px solid #e8eef7;
}

.offer-readiness-rail {
  border-left: 1px solid #e8eef7;
}

.offer-readiness-main {
  padding: 18px 24px 24px;
}

.offer-readiness-candidate,
.offer-readiness-sidebar-note,
.offer-readiness-content,
.offer-readiness-rail-card {
  border: 1px solid #dfe7f5;
  border-radius: 18px;
  background: #ffffff;
}

.offer-readiness-candidate {
  padding: 18px;
}

.offer-readiness-candidate > strong,
.offer-readiness-content__head h3,
.offer-readiness-rail-card h3,
.offer-readiness-pending strong,
.offer-readiness-footnote strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.offer-readiness-candidate__status {
  margin-top: 12px;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: #ddf9e8;
  color: #16a34a;
  font-size: 0.78rem;
  font-weight: 800;
}

.offer-readiness-candidate__person {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.offer-readiness-candidate__person span {
  width: 54px;
  height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #d0d9e8 0%, #667085 100%);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
  flex-shrink: 0;
}

.offer-readiness-candidate__person h3 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.55rem;
  font-weight: 800;
}

.offer-readiness-candidate__person p,
.offer-readiness-candidate__person em,
.offer-readiness-content__head p,
.offer-readiness-table__row p,
.offer-readiness-rail-card p,
.offer-readiness-pending small,
.offer-readiness-footnote span {
  color: #7183a6;
}

.offer-readiness-candidate__person em {
  display: block;
  margin-top: 4px;
  font-style: normal;
  color: #16a34a;
  font-weight: 700;
}

.offer-readiness-candidate__meta {
  margin: 18px 0 0;
  padding-top: 16px;
  border-top: 1px solid #edf2f9;
}

.offer-readiness-candidate__meta div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.offer-readiness-candidate__meta div + div {
  margin-top: 10px;
}

.offer-readiness-candidate__meta dt {
  color: #7f8faf;
}

.offer-readiness-candidate__meta dd {
  margin: 0;
  color: #1f2a44;
  font-weight: 700;
  text-align: right;
}

.offer-readiness-steps {
  margin-top: 18px;
  display: grid;
  gap: 8px;
}

.offer-readiness-step {
  width: 100%;
  padding: 14px 16px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border: 1px solid #edf2f9;
  border-radius: 16px;
  background: #ffffff;
  text-align: left;
}

.offer-readiness-step__icon {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.offer-readiness-step strong {
  display: block;
  color: #1f2a44;
  font-size: 0.98rem;
  font-weight: 700;
}

.offer-readiness-step small {
  display: block;
  margin-top: 4px;
  font-size: 0.82rem;
  color: #5b4bff;
  font-weight: 700;
}

.offer-readiness-step.is-done .offer-readiness-step__icon {
  color: #16a34a;
}

.offer-readiness-step.is-active {
  border-color: #cfd7ff;
  background: #eef1ff;
}

.offer-readiness-step.is-active .offer-readiness-step__icon {
  color: #4f46e5;
}

.offer-readiness-step.is-locked {
  opacity: 0.45;
}

.offer-readiness-sidebar-note {
  margin-top: 18px;
  padding: 16px;
  display: flex;
  gap: 10px;
  background: #f7f9ff;
}

.offer-readiness-sidebar-note p {
  margin: 0;
  line-height: 1.6;
}

.offer-readiness-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.offer-readiness-toolbar button {
  height: 40px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #ffffff;
  color: #44526d;
  font-weight: 700;
  cursor: pointer;
}

.offer-readiness-toolbar button.accent {
  color: #4f46e5;
  border-color: #cfd7ff;
  background: #f8f9ff;
}

.offer-readiness-toggle {
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #5f708f;
}

.offer-readiness-content {
  margin-top: 16px;
  padding: 20px;
}

.offer-readiness-content__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.offer-readiness-content__head h3 {
  margin: 0;
  font-size: 1.9rem;
}

.offer-readiness-content__head p {
  margin: 6px 0 0;
  line-height: 1.55;
  max-width: 760px;
}

.offer-readiness-progress-pill {
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff3e8;
  color: #f97316;
  font-size: 0.84rem;
  font-weight: 800;
  white-space: nowrap;
}

.offer-readiness-sections {
  margin-top: 22px;
  display: grid;
  gap: 14px;
}

.offer-readiness-section {
  border: 1px solid #dfe7f5;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.offer-readiness-section.is-expanded {
  border-color: #cfd7ff;
  box-shadow: 0 0 0 2px rgba(91, 75, 255, 0.08);
}

.offer-readiness-section__summary {
  width: 100%;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: none;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
}

.offer-readiness-section__identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.offer-readiness-section__icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eef1ff;
  color: #5b4bff;
  flex-shrink: 0;
}

.offer-readiness-section__identity strong {
  display: block;
  color: #1f2a44;
  font-size: 1.05rem;
  font-weight: 800;
}

.offer-readiness-section__identity small,
.offer-readiness-table__head {
  color: #94a3bd;
}

.offer-readiness-section__meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.offer-readiness-section__progress {
  font-weight: 800;
  white-space: nowrap;
}

.offer-readiness-section__progress.tone-done,
.offer-readiness-status.tone-done {
  color: #16a34a;
}

.offer-readiness-section__progress.tone-warning,
.offer-readiness-status.tone-pending {
  color: #f97316;
}

.offer-readiness-section__details {
  padding: 0 18px 16px;
  border-top: 1px solid #edf2f9;
}

.offer-readiness-table {
  margin-top: 6px;
}

.offer-readiness-table__head,
.offer-readiness-table__row {
  display: grid;
  grid-template-columns: 1.2fr 140px 1.6fr 130px;
  gap: 16px;
  align-items: center;
}

.offer-readiness-table__head {
  padding: 16px 6px 10px;
  font-size: 0.82rem;
  font-weight: 800;
}

.offer-readiness-table__row {
  padding: 14px 6px;
  border-top: 1px solid #edf2f9;
}

.offer-readiness-table__row strong {
  color: #1f2a44;
  font-size: 0.98rem;
}

.offer-readiness-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.offer-readiness-status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.offer-readiness-table__row p {
  margin: 0;
}

.offer-readiness-table__row button,
.offer-readiness-link-button {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  background: #ffffff;
  color: #4f46e5;
  font-weight: 700;
  cursor: pointer;
}

.offer-readiness-add-manual {
  margin-top: 8px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #4f46e5;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
}

.offer-readiness-rail-card + .offer-readiness-rail-card {
  margin-top: 18px;
}

.offer-readiness-rail-card {
  padding: 18px;
}

.offer-readiness-overview {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 22px;
}

.offer-readiness-overview__ring {
  width: 118px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at center, #ffffff 58%, transparent 59%),
    conic-gradient(#ef5da8 0 270deg, #edf2f9 270deg 360deg);
  display: grid;
  place-items: center;
  text-align: center;
}

.offer-readiness-overview__ring span {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #1f2a44;
}

.offer-readiness-overview__ring small {
  display: block;
  margin-top: 4px;
  color: #94a3bd;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.offer-readiness-overview ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.offer-readiness-overview li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5f708f;
}

.offer-readiness-overview li i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.offer-readiness-overview li i.done {
  background: #22c55e;
}

.offer-readiness-overview li i.pending {
  background: #f97316;
}

.offer-readiness-overview li i.idle {
  background: #818cf8;
}

.offer-readiness-overview li strong {
  margin-left: auto;
  color: #1f2a44;
}

.offer-readiness-pending {
  margin-top: 24px;
}

.offer-readiness-pending article {
  margin-top: 12px;
  padding: 14px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 16px;
  gap: 12px;
  align-items: center;
  border: 1px solid #edf2f9;
  border-radius: 16px;
  background: #fbfcff;
}

.offer-readiness-pending article span:first-child {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #fff0e4;
  color: #f97316;
}

.offer-readiness-pending article strong,
.offer-readiness-offer-details dd {
  color: #1f2a44;
}

.offer-readiness-offer-details {
  margin: 16px 0 0;
}

.offer-readiness-offer-details div {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.offer-readiness-offer-details div + div {
  margin-top: 12px;
}

.offer-readiness-offer-details dt {
  color: #7f8faf;
}

.offer-readiness-offer-details dd {
  margin: 0;
  text-align: right;
  font-weight: 700;
}

.offer-readiness-link-button {
  width: 100%;
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.offer-readiness-rail-card.success {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #edfdf3;
  border-color: #cdeed8;
}

.offer-readiness-rail-card.success strong {
  color: #16794a;
}

.offer-readiness-rail-card__icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #ffffff;
  color: #16a34a;
  flex-shrink: 0;
}

.offer-readiness-footnote {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.offer-readiness-footnote__icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eef1ff;
  color: #5b4bff;
  flex-shrink: 0;
}

.offer-readiness-foot-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.offer-readiness-foot-actions button {
  height: 58px;
  border-radius: 16px;
  cursor: pointer;
}

.offer-readiness-foot-actions button.notify {
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  color: #1f2a44;
  font-weight: 700;
}

.offer-readiness-foot-actions button.move {
  padding: 0 0 0 22px;
  display: inline-flex;
  align-items: center;
  border: none;
  background: linear-gradient(135deg, #5b4bff 0%, #4f46e5 100%);
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(91, 75, 255, 0.22);
}

.offer-readiness-foot-actions button.move strong {
  display: block;
  font-size: 1.02rem;
}

.offer-readiness-foot-actions button.move small {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.82);
}

.offer-readiness-foot-actions__split {
  width: 44px;
  height: 58px;
  margin-left: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.tone-done {
  color: #16a34a;
}

.tone-warning {
  color: #f97316;
}

@media (max-width: 1360px) {
  .offer-readiness-modal__body {
    grid-template-columns: 264px minmax(0, 1fr);
  }

  .offer-readiness-rail {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .offer-readiness-rail-card + .offer-readiness-rail-card {
    margin-top: 0;
  }
}

@media (max-width: 1080px) {
  .offer-readiness-modal__body {
    grid-template-columns: 1fr;
  }

  .offer-readiness-toolbar,
  .offer-readiness-content__head,
  .offer-readiness-modal__foot {
    flex-direction: column;
    align-items: stretch;
  }

  .offer-readiness-table__head,
  .offer-readiness-table__row,
  .offer-readiness-rail,
  .offer-readiness-overview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .offer-readiness-overlay {
    padding: 8px;
  }

  .offer-readiness-modal {
    max-height: calc(100vh - 16px);
    border-radius: 18px;
  }

  .offer-readiness-modal__head,
  .offer-readiness-modal__body,
  .offer-readiness-modal__foot {
    padding: 14px;
  }

  .offer-readiness-modal__body {
    gap: 14px;
  }

  .offer-readiness-foot-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .offer-readiness-foot-actions button.move {
    justify-content: space-between;
  }
}
</style>
