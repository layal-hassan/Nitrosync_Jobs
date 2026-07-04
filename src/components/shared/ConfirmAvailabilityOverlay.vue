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
    default: 'John Smith',
  },
  candidateRole: {
    type: String,
    default: 'Software Engineer',
  },
  candidateStage: {
    type: String,
    default: 'Qualified',
  },
})

const emit = defineEmits(['close'])

const availabilityRows = [
  { id: 'mon', day: 'Mon, 24 May', time: '09:00 - 12:00', available: true },
  { id: 'tue', day: 'Tue, 25 May', time: '13:00 - 17:00', available: true, highlighted: true },
  { id: 'wed', day: 'Wed, 26 May', time: '10:00 - 15:00', available: true },
  { id: 'thu', day: 'Thu, 27 May', time: 'Not Available', available: false },
  { id: 'fri', day: 'Fri, 28 May', time: 'Not Available', available: false },
]

const interviewTypeOptions = ['Hiring Manager Review', 'Portfolio Review', 'Team Interview']
const durationOptions = ['45 Minutes', '30 Minutes', '60 Minutes']

const selectedSlotId = ref('tue')
const selectedInterviewType = ref(interviewTypeOptions[0])
const selectedDuration = ref(durationOptions[0])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const recommendedSlot = computed(() => (
  availabilityRows.find((row) => row.id === selectedSlotId.value)
  ?? availabilityRows.find((row) => row.available)
  ?? availabilityRows[0]
))

function resetForm() {
  selectedSlotId.value = 'tue'
  selectedInterviewType.value = interviewTypeOptions[0]
  selectedDuration.value = durationOptions[0]
}

function closeOverlay() {
  emit('close')
}

function confirmAvailability() {
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
    <div v-if="open" class="confirm-availability-overlay" @click.self="closeOverlay">
      <section class="confirm-availability-modal">
        <header class="confirm-availability-modal__head">
          <div class="confirm-availability-modal__title">
            <span class="confirm-availability-modal__title-icon">
              <AppIcon name="calendar" :size="20" />
            </span>
            <div>
              <h2>Confirm Availability</h2>
              <p>Review the candidate's availability and choose the best time.</p>
            </div>
          </div>

          <button class="confirm-availability-modal__close" type="button" aria-label="Close confirm availability" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="confirm-availability-modal__body">
          <section class="confirm-availability-profile">
            <div class="confirm-availability-profile__main">
              <span class="confirm-availability-profile__avatar">{{ candidateInitials }}</span>
              <div class="confirm-availability-profile__copy">
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <span>{{ candidateStage }}</span>
              </div>
            </div>

            <div class="confirm-availability-profile__submitted">
              <span class="confirm-availability-profile__submitted-icon">
                <AppIcon name="clock" :size="16" />
              </span>
              <div>
                <small>Availability Submitted</small>
                <strong>Today</strong>
              </div>
            </div>
          </section>

          <section class="confirm-availability-section">
            <div class="confirm-availability-section__title">
              <AppIcon name="calendar" :size="18" />
              <h3>Candidate Availability</h3>
            </div>

            <div class="confirm-availability-table">
              <div class="confirm-availability-table__head">
                <span>Day</span>
                <span>Available Time (Europe/Stockholm GMT+2)</span>
              </div>

              <button
                v-for="row in availabilityRows"
                :key="row.id"
                class="confirm-availability-table__row"
                :class="{
                  'is-active': selectedSlotId === row.id,
                  'is-highlighted': row.highlighted,
                  'is-unavailable': !row.available,
                }"
                type="button"
                @click="row.available ? (selectedSlotId = row.id) : null"
              >
                <span>{{ row.day }}</span>
                <span class="confirm-availability-table__slot">
                  <i :class="{ 'is-unavailable': !row.available }"></i>
                  <strong>{{ row.time }}</strong>
                </span>
              </button>
            </div>

            <p class="confirm-availability-timezone">
              <AppIcon name="clock" :size="14" />
              <span>Timezone: Europe/Stockholm (GMT+2)</span>
            </p>
          </section>

          <section class="confirm-availability-recommendation">
            <span class="confirm-availability-recommendation__badge">
              <AppIcon name="sparkles" :size="16" />
            </span>
            <small>Recommended Slot</small>
            <strong>{{ recommendedSlot.day }} <i></i> 14:00 - 15:00</strong>
            <p>Highest overlap with hiring team availability.</p>
          </section>

          <section class="confirm-availability-section">
            <div class="confirm-availability-section__title">
              <AppIcon name="users" :size="18" />
              <h3>Interview Setup</h3>
            </div>

            <div class="confirm-availability-setup">
              <label class="confirm-availability-field">
                <span>Interview Type</span>
                <div class="confirm-availability-select">
                  <AppIcon name="user" :size="16" />
                  <select v-model="selectedInterviewType">
                    <option v-for="option in interviewTypeOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <AppIcon name="chevronDown" :size="16" />
                </div>
              </label>

              <label class="confirm-availability-field">
                <span>Duration</span>
                <div class="confirm-availability-select">
                  <AppIcon name="clock" :size="16" />
                  <select v-model="selectedDuration">
                    <option v-for="option in durationOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                  <AppIcon name="chevronDown" :size="16" />
                </div>
              </label>
            </div>

            <article class="confirm-availability-note">
              <span class="confirm-availability-note__icon">
                <AppIcon name="message" :size="17" />
              </span>
              <div>
                <strong>Candidate Note</strong>
                <p>"I'm generally available in the afternoons."</p>
              </div>
            </article>
          </section>
        </div>

        <footer class="confirm-availability-modal__footer">
          <div class="confirm-availability-modal__footer-side">
            <button class="confirm-availability-button confirm-availability-button--ghost" type="button">
              <AppIcon name="mail" :size="15" />
              <span>Request More Availability</span>
            </button>
            <button class="confirm-availability-button confirm-availability-button--ghost" type="button">
              <AppIcon name="pause" :size="15" />
              <span>Put On Hold</span>
            </button>
          </div>

          <div class="confirm-availability-modal__footer-side">
            <button class="confirm-availability-button confirm-availability-button--ghost" type="button" @click="closeOverlay">Cancel</button>
            <button class="confirm-availability-button confirm-availability-button--primary" type="button" @click="confirmAvailability">
              <span>Confirm &amp; Continue</span>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-availability-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(14, 23, 43, 0.68);
  backdrop-filter: blur(7px);
}

.confirm-availability-modal {
  width: min(100%, 1060px);
  max-height: min(92vh, 980px);
  overflow: auto;
  border: 1px solid rgba(227, 233, 245, 0.95);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 34px 80px rgba(15, 23, 42, 0.22);
}

.confirm-availability-modal__head,
.confirm-availability-modal__title,
.confirm-availability-profile,
.confirm-availability-profile__main,
.confirm-availability-profile__submitted,
.confirm-availability-section__title,
.confirm-availability-table__head,
.confirm-availability-table__row,
.confirm-availability-table__slot,
.confirm-availability-timezone,
.confirm-availability-recommendation,
.confirm-availability-setup,
.confirm-availability-select,
.confirm-availability-note,
.confirm-availability-modal__footer,
.confirm-availability-modal__footer-side,
.confirm-availability-button {
  display: flex;
  align-items: center;
}

.confirm-availability-modal__head,
.confirm-availability-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px;
}

.confirm-availability-modal__head {
  border-bottom: 1px solid #e9eef8;
}

.confirm-availability-modal__title {
  gap: 16px;
}

.confirm-availability-modal__title-icon {
  width: 50px;
  height: 50px;
  justify-content: center;
  border-radius: 14px;
  color: #ff5da8;
  background: linear-gradient(180deg, #fff2f8 0%, #ffeaf4 100%);
}

.confirm-availability-modal__title h2 {
  margin: 0;
  color: #1d2740;
  font-size: 18px;
  font-weight: 700;
}

.confirm-availability-modal__title p {
  margin: 6px 0 0;
  color: #6d7894;
  font-size: 14px;
}

.confirm-availability-modal__close {
  border: 0;
  background: transparent;
  color: #9ba7bf;
  cursor: pointer;
}

.confirm-availability-modal__body {
  padding: 22px 28px 24px;
}

.confirm-availability-profile {
  justify-content: space-between;
  gap: 24px;
  padding: 18px 20px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfcff 0%, #f8fafe 100%);
}

.confirm-availability-profile__main {
  gap: 16px;
  min-width: 0;
}

.confirm-availability-profile__avatar {
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 27px;
  font-weight: 700;
  background: linear-gradient(135deg, #e5bf61 0%, #3f8d76 100%);
}

.confirm-availability-profile__copy strong {
  display: block;
  color: #16213f;
  font-size: 16px;
  font-weight: 700;
}

.confirm-availability-profile__copy p,
.confirm-availability-profile__submitted small,
.confirm-availability-table__head,
.confirm-availability-table__row span,
.confirm-availability-timezone,
.confirm-availability-recommendation small,
.confirm-availability-field span,
.confirm-availability-note p {
  color: #6f7a95;
  font-size: 14px;
}

.confirm-availability-profile__copy p {
  margin: 6px 0 8px;
}

.confirm-availability-profile__copy span {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 999px;
  color: #447df7;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #eaf1ff;
}

.confirm-availability-profile__submitted {
  gap: 12px;
  margin-left: auto;
}

.confirm-availability-profile__submitted-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: #5852ff;
  background: #edf0ff;
}

.confirm-availability-profile__submitted strong,
.confirm-availability-table__slot strong,
.confirm-availability-recommendation strong,
.confirm-availability-note strong {
  color: #1f2944;
}

.confirm-availability-section {
  margin-top: 24px;
}

.confirm-availability-section__title {
  gap: 10px;
  margin-bottom: 16px;
  color: #4b4efc;
}

.confirm-availability-section__title h3 {
  margin: 0;
  color: #1d2740;
  font-size: 16px;
  font-weight: 700;
}

.confirm-availability-table {
  border: 1px solid #e7edf8;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.confirm-availability-table__head {
  justify-content: space-between;
  gap: 16px;
  padding: 16px 22px;
  font-weight: 600;
  background: #f8fafe;
}

.confirm-availability-table__head span:last-child,
.confirm-availability-table__row span:last-child {
  width: min(100%, 360px);
}

.confirm-availability-table__row {
  width: 100%;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border: 0;
  border-top: 1px solid #edf1f8;
  background: #fff;
  cursor: pointer;
  text-align: left;
}

.confirm-availability-table__row.is-highlighted {
  background: #fff8fc;
}

.confirm-availability-table__row.is-active {
  background: #fff3f9;
}

.confirm-availability-table__row.is-unavailable {
  cursor: default;
}

.confirm-availability-table__slot {
  gap: 12px;
}

.confirm-availability-table__slot i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
}

.confirm-availability-table__slot i.is-unavailable {
  background: #a4afc3;
}

.confirm-availability-table__row.is-unavailable .confirm-availability-table__slot strong {
  color: #a1abc0;
  font-weight: 500;
}

.confirm-availability-timezone {
  gap: 8px;
  margin: 12px 0 0;
}

.confirm-availability-recommendation {
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-top: 22px;
  padding: 20px 24px 20px 42px;
  border: 1px solid #ffd7ea;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffafc 0%, #fff6fb 100%);
}

.confirm-availability-recommendation__badge {
  position: absolute;
  top: 26px;
  left: -15px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(180deg, #ff74b7 0%, #ef5ba7 100%);
  box-shadow: 0 12px 24px rgba(239, 91, 167, 0.26);
}

.confirm-availability-recommendation small {
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #f05aa8;
}

.confirm-availability-recommendation strong {
  font-size: 19px;
  font-weight: 800;
}

.confirm-availability-recommendation strong i {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin: 0 10px;
  border-radius: 50%;
  vertical-align: middle;
  background: #d0d7e6;
}

.confirm-availability-recommendation p {
  margin: 0;
  color: #66728f;
  font-size: 14px;
}

.confirm-availability-setup {
  gap: 16px;
}

.confirm-availability-field {
  flex: 1 1 0;
}

.confirm-availability-field span {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
}

.confirm-availability-select {
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 0 16px;
  border: 1px solid #d9e2f1;
  border-radius: 14px;
  background: #fff;
}

.confirm-availability-select :deep(select) {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  outline: none;
  color: #1f2944;
  font: inherit;
  background: transparent;
  appearance: none;
}

.confirm-availability-note {
  gap: 14px;
  margin-top: 16px;
  padding: 18px 20px;
  border: 1px solid #efe9ff;
  border-radius: 16px;
  background: #fcfbff;
}

.confirm-availability-note__icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #5852ff;
  background: #f2f0ff;
}

.confirm-availability-note strong {
  display: block;
  margin-bottom: 4px;
  color: #4b4efc;
  font-size: 15px;
}

.confirm-availability-note p {
  margin: 0;
}

.confirm-availability-modal__footer {
  border-top: 1px solid #e9eef8;
}

.confirm-availability-modal__footer-side {
  gap: 12px;
}

.confirm-availability-button {
  justify-content: center;
  gap: 8px;
  min-height: 54px;
  padding: 0 20px;
  border: 1px solid #d7dfef;
  border-radius: 14px;
  color: #344158;
  font-size: 15px;
  font-weight: 600;
  background: #fff;
  cursor: pointer;
}

.confirm-availability-button--primary {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(135deg, #ff62b1 0%, #ef5ba7 100%);
  box-shadow: 0 16px 30px rgba(239, 91, 167, 0.24);
}

@media (max-width: 980px) {
  .confirm-availability-profile,
  .confirm-availability-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .confirm-availability-profile__submitted {
    margin-left: 0;
  }

  .confirm-availability-setup,
  .confirm-availability-modal__footer-side {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 720px) {
  .confirm-availability-overlay {
    padding: 12px;
  }

  .confirm-availability-modal__head,
  .confirm-availability-modal__body,
  .confirm-availability-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .confirm-availability-table__head,
  .confirm-availability-table__row {
    display: grid;
    grid-template-columns: 1fr;
  }

  .confirm-availability-table__head span:last-child,
  .confirm-availability-table__row span:last-child {
    width: auto;
  }
}
</style>
