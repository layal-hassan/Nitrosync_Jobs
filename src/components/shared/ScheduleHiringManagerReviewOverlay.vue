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
  candidateMatch: {
    type: String,
    default: '92% match',
  },
})

const emit = defineEmits(['close'])

const focusOptions = [
  'Experience',
  'Team Fit',
  'Salary Alignment',
  'Portfolio Review',
  'Final Approval',
]

const expectedOutcomeOptions = ['Gather Feedback', 'Approve for shortlist', 'Move to final round', 'Hold for later review']
const hiringManagerOptions = [
  { name: 'James Carter', role: 'Hiring Manager' },
  { name: 'Sarah Ahmed', role: 'Design Director' },
  { name: 'Olivia Davis', role: 'Product Lead' },
]
const reviewDateOptions = ['Jun 24, 2025', 'Jun 25, 2025', 'Jun 26, 2025']
const reviewTimeOptions = ['02:00 PM - 02:30 PM', '03:00 PM - 03:30 PM', '04:30 PM - 05:00 PM']
const durationOptions = ['30 min', '45 min', '60 min']
const timezoneOptions = ['(GMT+5:30) India Standard Time', '(GMT+3:00) Arabia Standard Time', '(GMT+1:00) Central European Time']

const selectedFocus = ref([])
const expectedOutcome = ref(expectedOutcomeOptions[0])
const additionalNotes = ref('')
const selectedHiringManager = ref(hiringManagerOptions[0])
const selectedDate = ref(reviewDateOptions[0])
const selectedTime = ref(reviewTimeOptions[0])
const selectedDuration = ref(durationOptions[0])
const selectedTimezone = ref(timezoneOptions[0])
const sendCalendarInvitation = ref(true)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => props.candidateName.split(' ').filter(Boolean)[0] ?? 'Candidate')
const normalizedMatch = computed(() => props.candidateMatch.replace(/match/i, 'Match'))
const journeySteps = computed(() => ([
  { id: 1, title: 'Screening', note: 'May 14', complete: true },
  { id: 2, title: 'HM Review', note: 'Current step', current: true },
  { id: 3, title: 'Portfolio Review', note: 'May 18', complete: true },
  { id: 4, title: 'Final Round', note: 'Not scheduled' },
  { id: 5, title: 'Offer', note: 'Not started' },
]))

function resetForm() {
  selectedFocus.value = ['Experience', 'Team Fit', 'Salary Alignment', 'Portfolio Review']
  expectedOutcome.value = expectedOutcomeOptions[0]
  additionalNotes.value = ''
  selectedHiringManager.value = hiringManagerOptions[0]
  selectedDate.value = reviewDateOptions[0]
  selectedTime.value = reviewTimeOptions[0]
  selectedDuration.value = durationOptions[0]
  selectedTimezone.value = timezoneOptions[0]
  sendCalendarInvitation.value = true
}

function toggleFocus(option) {
  if (selectedFocus.value.includes(option)) {
    selectedFocus.value = selectedFocus.value.filter((item) => item !== option)
    return
  }

  selectedFocus.value = [...selectedFocus.value, option]
}

function closeOverlay() {
  emit('close')
}

function scheduleReview() {
  emit('close')
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="hm-review-overlay" @click.self="closeOverlay">
      <section class="hm-review-modal">
        <header class="hm-review-modal__head">
          <div class="hm-review-modal__title">
            <span class="hm-review-modal__title-icon">
              <AppIcon name="calendar" :size="22" />
            </span>
            <div>
              <h2>Schedule Hiring Manager Review</h2>
              <p>Plan a hiring manager review to gather feedback and move this candidate forward.</p>
            </div>
          </div>

          <button class="hm-review-modal__close" type="button" aria-label="Close schedule review" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="hm-review-modal__body">
          <section class="hm-review-profile">
            <div class="hm-review-profile__main">
              <span class="hm-review-profile__avatar">{{ candidateInitials }}</span>
              <div class="hm-review-profile__copy">
                <div class="hm-review-profile__title-row">
                  <strong>{{ candidateName }}</strong>
                  <span>{{ candidateStage }}</span>
                </div>
                <p>{{ candidateRole }} <i aria-hidden="true"></i> Design Team</p>
                <div class="hm-review-profile__links">
                  <button type="button"><AppIcon name="document" :size="13" /> Resume</button>
                  <button type="button"><AppIcon name="star" :size="13" /> Scorecards</button>
                  <button type="button"><AppIcon name="document" :size="13" /> Notes</button>
                  <button type="button"><AppIcon name="clock" :size="13" /> Timeline</button>
                </div>
              </div>
            </div>

            <div class="hm-review-profile__stats">
              <article class="hm-review-stat-card">
                <small><AppIcon name="sparkles" :size="14" /> Strong Hire</small>
                <strong>{{ normalizedMatch }}</strong>
                <span class="is-healthy"></span>
              </article>

              <article class="hm-review-risk-card">
                <strong><AppIcon name="alert" :size="16" /> Candidate has another offer.</strong>
                <span>Decision needed by Jun 27, 2025.</span>
              </article>
            </div>
          </section>

          <div class="hm-review-grid">
            <section class="hm-review-panel">
              <div class="hm-review-section-title">
                <h3>Interview Journey</h3>
              </div>

              <div class="hm-review-journey">
                <article
                  v-for="step in journeySteps"
                  :key="step.id"
                  class="hm-review-journey__step"
                  :class="{ 'is-current': step.current, 'is-complete': step.complete }"
                >
                  <span class="hm-review-journey__badge">
                    <AppIcon v-if="step.complete" name="checkCircle" :size="16" />
                    <template v-else>{{ step.id }}</template>
                  </span>
                  <strong>{{ step.title }}</strong>
                  <small>{{ step.note }}</small>
                </article>
              </div>

              <div class="hm-review-section-title">
                <h3>Review Purpose</h3>
              </div>

              <div class="hm-review-field">
                <label>Focus <AppIcon name="info" :size="14" /></label>
                <div class="hm-review-chip-grid">
                  <button
                    v-for="option in focusOptions"
                    :key="option"
                    class="hm-review-chip"
                    :class="{ 'is-selected': selectedFocus.includes(option) }"
                    type="button"
                    @click="toggleFocus(option)"
                  >
                    <span class="hm-review-chip__check">
                      <AppIcon v-if="selectedFocus.includes(option)" name="check" :size="12" />
                    </span>
                    <span>{{ option }}</span>
                  </button>
                </div>
              </div>

              <div class="hm-review-field">
                <label>Expected Outcome <span>*</span></label>
                <button class="hm-review-select" type="button">
                  <div class="hm-review-select__copy">
                    <AppIcon name="target" :size="16" />
                    <span>{{ expectedOutcome }}</span>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>

              <div class="hm-review-field">
                <label>Additional Notes <small>(Optional)</small></label>
                <textarea
                  v-model="additionalNotes"
                  rows="5"
                  :placeholder="`Add any context for the hiring manager before ${candidateFirstName}'s review...`"
                />
              </div>
            </section>

            <section class="hm-review-panel hm-review-panel--schedule">
              <div class="hm-review-section-title">
                <h3>Schedule</h3>
              </div>

              <div class="hm-review-field">
                <label>Hiring Manager <span>*</span></label>
                <button class="hm-review-select hm-review-select--person" type="button">
                  <div class="hm-review-select__person">
                    <span class="hm-review-select__avatar">
                      {{ selectedHiringManager.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }}
                    </span>
                    <div>
                      <strong>{{ selectedHiringManager.name }}</strong>
                      <small>{{ selectedHiringManager.role }}</small>
                    </div>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>

              <div class="hm-review-row">
                <div class="hm-review-field">
                  <label>Date <span>*</span></label>
                  <button class="hm-review-select" type="button">
                    <div class="hm-review-select__copy">
                      <AppIcon name="calendar" :size="16" />
                      <span>{{ selectedDate }}</span>
                    </div>
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>

                <div class="hm-review-field">
                  <label>Time <span>*</span></label>
                  <button class="hm-review-select" type="button">
                    <div class="hm-review-select__copy">
                      <AppIcon name="clock" :size="16" />
                      <span>{{ selectedTime }}</span>
                    </div>
                    <AppIcon name="chevronDown" :size="16" />
                  </button>
                </div>
              </div>

              <div class="hm-review-field">
                <label>Duration</label>
                <button class="hm-review-select" type="button">
                  <div class="hm-review-select__copy">
                    <AppIcon name="clock" :size="16" />
                    <span>{{ selectedDuration }}</span>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>

              <div class="hm-review-field">
                <label>Time Zone</label>
                <button class="hm-review-select" type="button">
                  <div class="hm-review-select__copy">
                    <AppIcon name="mapPin" :size="16" />
                    <span>{{ selectedTimezone }}</span>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>

              <div class="hm-review-participants">
                <strong>Optional Participants</strong>
                <button type="button">
                  <AppIcon name="plus" :size="16" />
                  <span>Add Participant</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer class="hm-review-modal__footer">
          <label class="hm-review-checkbox">
            <input v-model="sendCalendarInvitation" type="checkbox">
            <span class="hm-review-checkbox__box">
              <AppIcon v-if="sendCalendarInvitation" name="check" :size="12" />
            </span>
            <span class="hm-review-checkbox__copy">
              <strong>Send calendar invitation</strong>
              <small>An email will be sent to the hiring manager with meeting details.</small>
            </span>
          </label>

          <div class="hm-review-modal__actions">
            <button class="hm-review-button hm-review-button--ghost" type="button" @click="closeOverlay">Cancel</button>
            <button class="hm-review-button hm-review-button--primary" type="button" @click="scheduleReview">Schedule Review</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.hm-review-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 32px;
  background: rgba(27, 33, 45, 0.42);
  backdrop-filter: blur(6px);
}

.hm-review-modal {
  width: min(100%, 1150px);
  max-height: calc(100vh - 64px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.28);
}

.hm-review-modal__head,
.hm-review-modal__title,
.hm-review-profile,
.hm-review-profile__main,
.hm-review-profile__title-row,
.hm-review-profile__links,
.hm-review-profile__stats,
.hm-review-stat-card small,
.hm-review-risk-card strong,
.hm-review-section-title,
.hm-review-row,
.hm-review-chip,
.hm-review-select,
.hm-review-select__copy,
.hm-review-select__person,
.hm-review-participants button,
.hm-review-modal__footer,
.hm-review-checkbox,
.hm-review-modal__actions,
.hm-review-button,
.hm-review-checkbox__copy {
  display: flex;
  align-items: center;
}

.hm-review-modal__head,
.hm-review-modal__footer,
.hm-review-profile,
.hm-review-modal__actions {
  justify-content: space-between;
}

.hm-review-modal__head {
  padding: 24px 32px;
  border-bottom: 1px solid #eef2f8;
}

.hm-review-modal__title {
  gap: 16px;
}

.hm-review-modal__title-icon {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #fff2f9;
  color: #ff5aac;
}

.hm-review-modal__title h2 {
  margin: 0;
  color: #1f2a3d;
  font-size: 2rem;
  line-height: 1.05;
}

.hm-review-modal__title p {
  margin: 8px 0 0;
  color: #748198;
  font-size: 1rem;
}

.hm-review-modal__close {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #98a2b3;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.hm-review-modal__body {
  overflow: auto;
  padding: 32px;
}

.hm-review-profile {
  gap: 24px;
  align-items: flex-start;
}

.hm-review-profile__main {
  gap: 20px;
  min-width: 0;
}

.hm-review-profile__avatar,
.hm-review-select__avatar {
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd9ef 0%, #f8faff 100%);
  color: #ff5aac;
  font-size: 1.5rem;
  font-weight: 800;
  flex: 0 0 72px;
}

.hm-review-profile__copy {
  min-width: 0;
}

.hm-review-profile__title-row {
  gap: 12px;
  flex-wrap: wrap;
}

.hm-review-profile__title-row strong {
  color: #1d2939;
  font-size: 1.15rem;
}

.hm-review-profile__title-row span {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eaf7ee;
  color: #16934d;
  font-size: 0.82rem;
  font-weight: 700;
}

.hm-review-profile__copy p {
  margin: 8px 0 14px;
  color: #5f6b7e;
  font-size: 0.98rem;
}

.hm-review-profile__copy p i {
  display: inline-block;
  width: 4px;
  height: 4px;
  margin: 0 10px;
  border-radius: 50%;
  background: #c7cfdd;
  vertical-align: middle;
}

.hm-review-profile__links {
  flex-wrap: wrap;
  gap: 18px;
}

.hm-review-profile__links button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #ff5aac;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
}

.hm-review-profile__stats {
  gap: 16px;
  margin-left: auto;
}

.hm-review-stat-card,
.hm-review-risk-card {
  min-width: 0;
  padding: 18px 20px;
  border: 1px solid #eef2f8;
  border-radius: 16px;
  background: #fff;
}

.hm-review-stat-card {
  min-width: 188px;
}

.hm-review-stat-card small {
  gap: 6px;
  color: #ff5aac;
  font-size: 0.9rem;
  font-weight: 700;
}

.hm-review-stat-card strong {
  display: block;
  margin-top: 10px;
  color: #1d2939;
  font-size: 1.15rem;
}

.hm-review-stat-card .is-healthy {
  display: inline-flex;
  width: 9px;
  height: 9px;
  margin-left: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.hm-review-risk-card {
  max-width: 258px;
  background: #fff7f7;
  border-color: #ffd6d4;
}

.hm-review-risk-card strong {
  gap: 8px;
  color: #d92d20;
  font-size: 0.98rem;
}

.hm-review-risk-card span {
  display: block;
  margin-top: 6px;
  color: #6b7280;
  font-size: 0.9rem;
}

.hm-review-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(320px, 0.96fr);
  gap: 28px;
  margin-top: 34px;
}

.hm-review-panel {
  min-width: 0;
}

.hm-review-panel--schedule {
  padding: 26px 24px;
  border: 1px solid #edf2f7;
  border-radius: 22px;
  background: #fcfdff;
}

.hm-review-section-title {
  justify-content: space-between;
  margin-bottom: 18px;
}

.hm-review-section-title h3 {
  margin: 0;
  color: #1f2a3d;
  font-size: 1rem;
}

.hm-review-journey {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 42px;
}

.hm-review-journey__step {
  padding: 14px 12px;
  border: 1px solid #e8edf4;
  border-radius: 14px;
  background: #fff;
  text-align: left;
}

.hm-review-journey__step.is-current {
  border-color: #ff7abc;
  box-shadow: inset 0 0 0 1px rgba(255, 122, 188, 0.18);
}

.hm-review-journey__step.is-complete:not(.is-current) .hm-review-journey__badge {
  background: #22c55e;
  color: #fff;
}

.hm-review-journey__badge {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #eef2f8;
  color: #98a2b3;
  font-size: 0.85rem;
  font-weight: 700;
}

.hm-review-journey__step.is-current .hm-review-journey__badge {
  background: #ff7abc;
  color: #fff;
}

.hm-review-journey__step strong,
.hm-review-journey__step small {
  display: block;
}

.hm-review-journey__step strong {
  margin-top: 14px;
  color: #1f2a3d;
  font-size: 0.96rem;
  line-height: 1.25;
}

.hm-review-journey__step small {
  margin-top: 8px;
  color: #98a2b3;
  font-size: 0.82rem;
  line-height: 1.3;
}

.hm-review-field + .hm-review-field,
.hm-review-row + .hm-review-field,
.hm-review-field + .hm-review-row,
.hm-review-row + .hm-review-row,
.hm-review-section-title + .hm-review-field {
  margin-top: 20px;
}

.hm-review-field label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  color: #344054;
  font-size: 0.94rem;
  font-weight: 700;
}

.hm-review-field label span {
  color: #ff5aac;
}

.hm-review-field label small {
  color: #98a2b3;
  font-size: 0.92em;
}

.hm-review-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hm-review-chip {
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  color: #475467;
  cursor: pointer;
  font-size: 0.95rem;
}

.hm-review-chip.is-selected {
  border-color: #ff8ac5;
  background: #fff5fa;
  color: #1f2a3d;
}

.hm-review-chip__check {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d6deea;
  border-radius: 6px;
  color: transparent;
  background: #fff;
  flex: 0 0 18px;
}

.hm-review-chip.is-selected .hm-review-chip__check,
.hm-review-checkbox input:checked + .hm-review-checkbox__box {
  border-color: #ff66ad;
  background: #ff66ad;
  color: #fff;
}

.hm-review-select,
.hm-review-field textarea {
  width: 100%;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  background: #fff;
}

.hm-review-select {
  justify-content: space-between;
  gap: 14px;
  min-height: 48px;
  padding: 0 16px;
  color: #344054;
  cursor: pointer;
}

.hm-review-select__copy {
  gap: 10px;
  min-width: 0;
}

.hm-review-select__copy span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hm-review-select--person {
  min-height: 64px;
}

.hm-review-select__person {
  gap: 12px;
}

.hm-review-select__avatar {
  width: 40px;
  height: 40px;
  font-size: 0.92rem;
  flex-basis: 40px;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
}

.hm-review-select__person strong,
.hm-review-select__person small {
  display: block;
  text-align: left;
}

.hm-review-select__person strong {
  color: #1f2a3d;
  font-size: 0.95rem;
}

.hm-review-select__person small {
  margin-top: 4px;
  color: #98a2b3;
  font-size: 0.84rem;
}

.hm-review-row {
  gap: 16px;
}

.hm-review-row > .hm-review-field {
  flex: 1 1 0;
  margin-top: 0;
}

.hm-review-field textarea {
  min-height: 142px;
  padding: 14px 16px;
  color: #344054;
  resize: vertical;
}

.hm-review-field textarea::placeholder {
  color: #98a2b3;
}

.hm-review-participants {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #edf2f7;
}

.hm-review-participants strong {
  display: block;
  color: #98a2b3;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hm-review-participants button {
  gap: 8px;
  margin-top: 12px;
  padding: 0;
  color: #ff5aac;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
}

.hm-review-modal__footer {
  gap: 24px;
  padding: 22px 32px;
  border-top: 1px solid #eef2f8;
}

.hm-review-checkbox {
  gap: 12px;
}

.hm-review-checkbox input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.hm-review-checkbox__box {
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d6deea;
  border-radius: 7px;
  color: transparent;
  background: #fff;
  flex: 0 0 22px;
}

.hm-review-checkbox__copy {
  align-items: flex-start;
  flex-direction: column;
}

.hm-review-checkbox__copy strong {
  color: #1f2a3d;
  font-size: 0.98rem;
}

.hm-review-checkbox__copy small {
  margin-top: 2px;
  color: #667085;
  font-size: 0.88rem;
}

.hm-review-modal__actions {
  gap: 14px;
  margin-left: auto;
}

.hm-review-button {
  min-width: 136px;
  height: 48px;
  justify-content: center;
  border-radius: 14px;
  border: 1px solid transparent;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.hm-review-button--ghost {
  color: #344054;
  border-color: #d9e2ee;
  background: #fff;
}

.hm-review-button--primary {
  color: #fff;
  background: linear-gradient(90deg, #ff67ad 0%, #f15ea8 100%);
  box-shadow: 0 12px 24px rgba(241, 94, 168, 0.22);
}

@media (max-width: 1100px) {
  .hm-review-profile,
  .hm-review-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .hm-review-profile__stats,
  .hm-review-modal__actions {
    margin-left: 0;
  }

  .hm-review-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .hm-review-overlay {
    padding: 14px;
  }

  .hm-review-modal {
    max-height: calc(100vh - 28px);
    border-radius: 22px;
  }

  .hm-review-modal__head,
  .hm-review-modal__body,
  .hm-review-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hm-review-modal__title h2 {
    font-size: 1.5rem;
  }

  .hm-review-journey {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hm-review-row {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .hm-review-profile__main,
  .hm-review-modal__title,
  .hm-review-checkbox,
  .hm-review-modal__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hm-review-profile__avatar {
    width: 60px;
    height: 60px;
    flex-basis: 60px;
  }

  .hm-review-profile__stats {
    flex-direction: column;
  }

  .hm-review-stat-card,
  .hm-review-risk-card,
  .hm-review-button {
    width: 100%;
    max-width: none;
  }

  .hm-review-journey {
    grid-template-columns: 1fr;
  }
}
</style>
