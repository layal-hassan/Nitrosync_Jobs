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
  candidateAppliedOn: {
    type: String,
    default: '10 May 2025',
  },
})

const emit = defineEmits(['close', 'view-profile', 'screening-scheduled'])

const interviewMethods = [
  {
    id: 'phone',
    label: 'Use my phone',
    description: "You'll call the candidate from your own phone.",
    icon: 'phone',
  },
  {
    id: 'video',
    label: 'Video call',
    description: "We'll send the meeting link to the candidate.",
    icon: 'video',
  },
  {
    id: 'ai',
    label: 'AI screening',
    description: "Let NitroSync's AI conduct the screening.",
    icon: 'sparkles',
    tag: 'AI',
  },
]

const dateOptions = ['20 May 2025', '21 May 2025', '22 May 2025']
const timeOptions = ['02:00 PM', '03:00 PM', '04:00 PM']
const durationOptions = ['30 Minutes', '45 Minutes', '60 Minutes']
const timezoneOptions = ['(GMT+2) Stockholm', '(GMT+3) Riyadh', '(GMT+1) Berlin']
const visibilityOptions = ['Hide until start time', 'Show immediately', 'Hide until 15 min before']
const reminderOffsetOptions = ['1 day before', '2 hours before', '30 minutes before']
const reminderTimeOptions = ['10:00 AM', '09:00 AM', '08:30 AM']
const platformOptions = ['Google Meet', 'Zoom', 'Microsoft Teams']
const aiStyleOptions = ['Structured interview', 'Behavioral interview', 'Fast qualification']
const aiSummaryOptions = ['Send after completion', 'Send to recruiter instantly', 'Attach to candidate profile only']
const aiKitTitle = 'Product Designer - Screening Kit'
const aiKitMeta = '8 questions - ~20 minutes - Skills, Experience, Problem solving'
const aiDeadlineOptions = ['23 May 2025, 11:59 PM', '24 May 2025, 11:59 PM', '25 May 2025, 11:59 PM']

const flowState = ref('draft')
const selectedMethod = ref('phone')
const selectedDate = ref(dateOptions[0])
const selectedTime = ref(timeOptions[0])
const selectedDuration = ref(durationOptions[0])
const selectedTimezone = ref(timezoneOptions[0])
const phoneNumber = ref('+46 73 456 78 90')
const selectedVisibility = ref(visibilityOptions[0])
const selectedReminderOffset = ref(reminderOffsetOptions[0])
const selectedReminderTime = ref(reminderTimeOptions[0])
const selectedPlatform = ref(platformOptions[0])
const selectedAiStyle = ref(aiStyleOptions[0])
const selectedAiSummary = ref(aiSummaryOptions[0])
const selectedAiDeadline = ref(aiDeadlineOptions[0])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateEmail = computed(() => (
  `${props.candidateName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`
))

const selectedMethodMeta = computed(() => (
  interviewMethods.find((option) => option.id === selectedMethod.value) ?? interviewMethods[0]
))

const draftModalTitle = computed(() => (
  selectedMethod.value === 'phone'
    ? 'Schedule Phone Screening'
    : selectedMethod.value === 'video'
      ? 'Schedule Screening'
      : 'Schedule Screening'
))

const scheduleButtonLabel = computed(() => (
  selectedMethod.value === 'phone'
    ? 'Schedule Screening'
    : selectedMethod.value === 'video'
      ? 'Schedule Video Call'
      : 'Schedule AI Screening'
))

const methodNote = computed(() => (
  selectedMethod.value === 'phone'
    ? 'You will call the candidate using your own phone.'
    : selectedMethod.value === 'video'
      ? 'The meeting link will be included in the invitation email.'
      : "NitroSync's AI will run the interview and send the summary automatically."
))

const detailMethodSummary = computed(() => (
  selectedMethod.value === 'phone'
    ? "You'll call the candidate"
    : selectedMethod.value === 'video'
      ? "We'll send the meeting link to the candidate"
      : "NitroSync AI will conduct the interview"
))

const detailMethodValue = computed(() => (
  selectedMethod.value === 'phone'
    ? 'Use my phone (You will call)'
    : selectedMethod.value === 'video'
      ? `Video call (${selectedPlatform.value})`
      : `AI screening (${selectedAiStyle.value})`
))

const detailSecondaryRowLabel = computed(() => (
  selectedMethod.value === 'phone'
    ? 'Candidate phone number'
    : selectedMethod.value === 'video'
      ? 'Meeting link'
      : 'Summary delivery'
))

const detailSecondaryRowValue = computed(() => (
  selectedMethod.value === 'phone'
    ? phoneNumber.value
    : selectedMethod.value === 'video'
      ? 'Will be sent to candidate after scheduling'
      : selectedAiSummary.value
))

const detailNoteText = computed(() => (
  selectedMethod.value === 'phone'
    ? 'The candidate will see their phone number 5 minutes before the interview.'
    : selectedMethod.value === 'video'
      ? 'The meeting link will be sent to the candidate in the invitation email.'
      : 'The AI interview link and summary will be delivered automatically.'
))

const detailPrimaryStatTitle = computed(() => (
  selectedMethod.value === 'ai' ? 'Tuesday, 20 May 2025' : selectedDate.value
))

const detailPrimaryStatLines = computed(() => (
  selectedMethod.value === 'ai'
    ? ['AI link will be sent', '10:00 AM', selectedTimezone.value]
    : [scheduledWindowLabel.value, selectedTimezone.value]
))

const detailThirdStatTitle = computed(() => (
  selectedMethod.value === 'ai' ? '23 May 2025 11:59 PM' : 'Starts in 23h 45m'
))

const detailThirdStatLines = computed(() => (
  selectedMethod.value === 'ai'
    ? ['3 days to complete']
    : ['Be ready 5 min early']
))

const scheduledWindowLabel = computed(() => {
  const [timePart, meridiem = 'AM'] = selectedTime.value.split(' ')
  const [hourText = '0', minuteText = '00'] = timePart.split(':')
  let hour = Number(hourText)
  const minute = Number(minuteText)

  if (meridiem === 'PM' && hour !== 12) hour += 12
  if (meridiem === 'AM' && hour === 12) hour = 0

  const durationMinutes = Number.parseInt(selectedDuration.value, 10) || 30
  const totalMinutes = hour * 60 + minute + durationMinutes
  const endHour24 = Math.floor(totalMinutes / 60) % 24
  const endMinute = totalMinutes % 60
  const endMeridiem = endHour24 >= 12 ? 'PM' : 'AM'
  const endHour12 = endHour24 % 12 || 12
  const endMinuteLabel = String(endMinute).padStart(2, '0')

  return `${selectedTime.value} - ${String(endHour12).padStart(2, '0')}:${endMinuteLabel} ${endMeridiem}`
})

const callActionLabel = computed(() => (
  selectedMethod.value === 'phone'
    ? 'Call Candidate (When Ready)'
    : selectedMethod.value === 'video'
      ? 'Join Call (When Ready)'
      : 'Launch AI Screening'
))

const participantBadgeLabel = computed(() => (
  selectedMethod.value === 'ai' ? 'AI invite will be sent' : 'Invitation will be sent'
))

function resetForm() {
  flowState.value = 'draft'
  selectedMethod.value = 'phone'
  selectedDate.value = dateOptions[0]
  selectedTime.value = timeOptions[0]
  selectedDuration.value = durationOptions[0]
  selectedTimezone.value = timezoneOptions[0]
  phoneNumber.value = '+46 73 456 78 90'
  selectedVisibility.value = visibilityOptions[0]
  selectedReminderOffset.value = reminderOffsetOptions[0]
  selectedReminderTime.value = reminderTimeOptions[0]
  selectedPlatform.value = platformOptions[0]
  selectedAiStyle.value = aiStyleOptions[0]
  selectedAiSummary.value = aiSummaryOptions[0]
  selectedAiDeadline.value = aiDeadlineOptions[0]
}

function closeOverlay() {
  emit('close')
}

function scheduleScreening() {
  emit('screening-scheduled', {
    method: selectedMethod.value,
    summaryAvailable: selectedMethod.value === 'ai',
  })
  flowState.value = 'scheduled'
}

function returnToForm() {
  flowState.value = 'draft'
}

function viewCandidateProfile() {
  emit('view-profile')
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
    <div v-if="open" class="screening-overlay" @click.self="closeOverlay">
      <section v-if="flowState === 'draft'" class="screening-sheet">
        <header class="screening-sheet__header">
          <div class="screening-sheet__title">
            <span class="screening-sheet__title-icon">
              <AppIcon :name="selectedMethodMeta.icon" :size="18" />
            </span>
            <div>
              <h2>{{ draftModalTitle }}</h2>
              <p>Set up how you want to conduct this screening.</p>
            </div>
          </div>

          <button class="screening-sheet__close" type="button" aria-label="Close screening" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <section class="screening-profile">
          <div class="screening-profile__identity">
            <span class="screening-profile__avatar">{{ candidateInitials }}</span>
            <div class="screening-profile__copy">
              <strong>{{ candidateName }}</strong>
              <span>{{ candidateRole }}</span>
            </div>
            <span class="screening-profile__badge">{{ candidateStage }}</span>
          </div>

          <dl class="screening-profile__meta">
            <div>
              <dt>Stage</dt>
              <dd>{{ candidateStage }}</dd>
            </div>
            <div>
              <dt>Applied on</dt>
              <dd>{{ candidateAppliedOn }}</dd>
            </div>
          </dl>
        </section>

        <div class="screening-sheet__body">
          <section class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">1</span>
              <div>
                <h3>Interview method</h3>
                <p>Choose how you want to conduct this screening.</p>
              </div>
            </div>

            <div class="screening-methods">
              <button
                v-for="option in interviewMethods"
                :key="option.id"
                class="screening-method-card"
                :class="{ 'is-active': selectedMethod === option.id }"
                type="button"
                @click="selectedMethod = option.id"
              >
                <div class="screening-method-card__top">
                  <span class="screening-method-card__icon">
                    <AppIcon :name="option.icon" :size="16" />
                  </span>
                  <span v-if="option.tag" class="screening-method-card__tag">{{ option.tag }}</span>
                </div>
                <strong>{{ option.label }}</strong>
                <p>{{ option.description }}</p>
                <span class="screening-method-card__radio">
                  <i />
                </span>
              </button>
            </div>
          </section>

          <section v-if="selectedMethod !== 'ai'" class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">2</span>
              <div>
                <h3>Date &amp; time</h3>
              </div>
            </div>

            <div class="screening-fields screening-fields--schedule">
              <label class="screening-field">
                <span>Date</span>
                <div class="screening-select">
                  <AppIcon name="calendar" :size="15" />
                  <select v-model="selectedDate">
                    <option v-for="option in dateOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <label class="screening-field">
                <span>Time</span>
                <div class="screening-select">
                  <AppIcon name="clock" :size="15" />
                  <select v-model="selectedTime">
                    <option v-for="option in timeOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <label class="screening-field">
                <span>Duration</span>
                <div class="screening-select">
                  <AppIcon name="clock" :size="15" />
                  <select v-model="selectedDuration">
                    <option v-for="option in durationOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <label class="screening-field">
                <span>Time zone</span>
                <div class="screening-select">
                  <AppIcon name="mapPin" :size="15" />
                  <select v-model="selectedTimezone">
                    <option v-for="option in timezoneOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>
            </div>
          </section>

          <section v-if="selectedMethod !== 'ai'" class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">3</span>
              <div v-if="selectedMethod === 'phone'">
                <h3>Candidate phone number</h3>
              </div>
              <div v-else-if="selectedMethod === 'video'">
                <h3>Video call details</h3>
              </div>
              <div v-else>
                <h3>AI screening details</h3>
              </div>
            </div>

            <div v-if="selectedMethod === 'phone'" class="screening-fields screening-fields--contact">
              <label class="screening-field">
                <span>Phone number</span>
                <div class="screening-input">
                  <span class="screening-flag" aria-hidden="true">
                    <i class="screening-flag__cross-y" />
                    <i class="screening-flag__cross-x" />
                  </span>
                  <input v-model="phoneNumber" type="text">
                </div>
              </label>

              <label class="screening-field">
                <span>Visibility</span>
                <div class="screening-select">
                  <AppIcon name="lock" :size="15" />
                  <select v-model="selectedVisibility">
                    <option v-for="option in visibilityOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>
            </div>

            <div v-else-if="selectedMethod === 'video'" class="screening-fields screening-fields--video">
              <label class="screening-field">
                <span>Platform</span>
                <div class="screening-select">
                  <AppIcon name="video" :size="15" />
                  <select v-model="selectedPlatform">
                    <option v-for="option in platformOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <div class="screening-field">
                <span>Meeting link</span>
                <div class="screening-message-card">
                  <AppIcon name="link" :size="15" />
                  <p>A unique meeting link will be generated and sent to the candidate automatically.</p>
                </div>
              </div>
            </div>

            <div v-else class="screening-fields screening-fields--video">
              <label class="screening-field">
                <span>Interview style</span>
                <div class="screening-select">
                  <AppIcon name="sparkles" :size="15" />
                  <select v-model="selectedAiStyle">
                    <option v-for="option in aiStyleOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <label class="screening-field">
                <span>Summary delivery</span>
                <div class="screening-select">
                  <AppIcon name="document" :size="15" />
                  <select v-model="selectedAiSummary">
                    <option v-for="option in aiSummaryOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>
            </div>

            <div class="screening-info">
              <AppIcon name="info" :size="14" />
              <span>{{ methodNote }}</span>
            </div>
          </section>

          <section v-if="selectedMethod === 'ai'" class="screening-step screening-step--ai-intro">
            <div class="screening-info screening-info--ai">
              <AppIcon name="sparkles" :size="15" />
              <span>Our AI will ask the candidate pre-set questions, evaluate the responses and share a detailed report with you.</span>
            </div>
          </section>

          <section v-if="selectedMethod === 'ai'" class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">2</span>
              <div>
                <h3>AI screening details</h3>
              </div>
            </div>

            <div class="screening-field">
              <span>AI interview kit</span>
              <button class="screening-kit-card" type="button">
                <span class="screening-kit-card__icon">
                  <AppIcon name="document" :size="15" />
                </span>
                <span class="screening-kit-card__copy">
                  <strong>{{ aiKitTitle }}</strong>
                  <small>{{ aiKitMeta }}</small>
                </span>
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>
          </section>

          <section v-if="selectedMethod === 'ai'" class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">3</span>
              <div>
                <h3>Date &amp; time</h3>
              </div>
            </div>

            <div class="screening-fields screening-fields--ai-datetime">
              <label class="screening-field">
                <span>Send to candidate on</span>
                <div class="screening-select">
                  <AppIcon name="calendar" :size="15" />
                  <select v-model="selectedDate">
                    <option v-for="option in dateOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </label>

              <label class="screening-field">
                <span>Deadline for completion</span>
                <div class="screening-select">
                  <AppIcon name="clock" :size="15" />
                  <select v-model="selectedAiDeadline">
                    <option v-for="option in aiDeadlineOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
                <small class="screening-field__hint">3 days to complete</small>
              </label>
            </div>

            <div class="screening-info screening-info--ai-date">
              <AppIcon name="clock" :size="14" />
              <span>The candidate will receive an email with the screening link and instructions.</span>
            </div>
          </section>

          <section v-if="selectedMethod !== 'ai'" class="screening-step">
            <div class="screening-step__head">
              <span class="screening-step__number">4</span>
              <div>
                <h3>Setup reminder <small>(optional)</small></h3>
              </div>
            </div>

            <label class="screening-field screening-field--reminder">
              <span>Add a reminder for yourself</span>
              <div class="screening-reminder-row">
                <div class="screening-select">
                  <select v-model="selectedReminderOffset">
                    <option v-for="option in reminderOffsetOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
                <span class="screening-reminder-row__at">at</span>
                <div class="screening-select">
                  <select v-model="selectedReminderTime">
                    <option v-for="option in reminderTimeOptions" :key="option" :value="option">{{ option }}</option>
                  </select>
                </div>
              </div>
            </label>

            <button class="screening-add-reminder" type="button">
              <AppIcon name="plus" :size="13" />
              <span>Add another reminder</span>
            </button>
          </section>
        </div>

        <footer class="screening-sheet__footer">
          <button class="screening-button screening-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="screening-button screening-button--primary" type="button" @click="scheduleScreening">
            <AppIcon :name="selectedMethodMeta.icon" :size="15" />
            <span>{{ scheduleButtonLabel }}</span>
          </button>
        </footer>
      </section>

      <section v-else class="screening-detail">
        <header class="screening-detail__header">
          <div class="screening-detail__title">
            <button class="screening-detail__back" type="button" aria-label="Back to edit screening" @click="returnToForm">
              <AppIcon name="chevronLeft" :size="18" />
            </button>
            <div>
              <div class="screening-detail__title-row">
                <h2>Screening Details</h2>
                <span class="screening-detail__status">Scheduled</span>
              </div>
            </div>
          </div>

          <div class="screening-detail__header-actions">
            <button class="screening-detail__ghost-action" type="button" @click="returnToForm">
              <AppIcon name="calendar" :size="15" />
              <span>Reschedule</span>
            </button>
            <button class="screening-detail__more" type="button" aria-label="More actions">
              <AppIcon name="more" :size="16" />
            </button>
          </div>
        </header>

        <div class="screening-detail__body">
          <section class="screening-detail__stats">
            <article class="screening-detail__stat-card">
              <span class="screening-detail__stat-icon is-pink"><AppIcon name="calendar" :size="16" /></span>
              <div>
                <strong>{{ detailPrimaryStatTitle }}</strong>
                <small v-for="line in detailPrimaryStatLines" :key="line">{{ line }}</small>
              </div>
            </article>

            <article class="screening-detail__stat-card">
              <span class="screening-detail__stat-icon is-soft-pink"><AppIcon :name="selectedMethodMeta.icon" :size="16" /></span>
              <div>
                <strong>{{ selectedMethodMeta.label }}</strong>
                <small>{{ detailMethodSummary }}</small>
              </div>
            </article>

            <article class="screening-detail__stat-card">
              <span class="screening-detail__stat-icon is-violet"><AppIcon name="clock" :size="16" /></span>
              <div>
                <strong>{{ detailThirdStatTitle }}</strong>
                <small v-for="line in detailThirdStatLines" :key="line">{{ line }}</small>
              </div>
            </article>
          </section>

          <section class="screening-detail__section">
            <h3>Participants</h3>
            <div class="screening-detail__participants">
              <article class="screening-detail__participant-card">
                <span class="screening-detail__participant-avatar is-photo">MC</span>
                <div>
                  <small>Recruiter</small>
                  <strong>Michael Chen</strong>
                  <span>Senior Recruiter</span>
                </div>
                <em>You</em>
              </article>

              <article class="screening-detail__participant-card">
                <span class="screening-detail__participant-avatar">{{ candidateInitials }}</span>
                <div>
                  <small>Candidate</small>
                  <strong>{{ candidateName }}</strong>
                  <span>{{ candidateRole }}</span>
                  <span>{{ selectedMethod === 'ai' ? candidateEmail : phoneNumber }}</span>
                </div>
                <em class="is-invite">{{ participantBadgeLabel }}</em>
              </article>
            </div>
          </section>

          <div class="screening-detail__grid">
            <section class="screening-detail__section screening-detail__panel">
              <h3>{{ selectedMethod === 'ai' ? 'AI screening summary' : 'Call Details' }}</h3>
              <dl v-if="selectedMethod !== 'ai'" class="screening-detail__definition-list">
                <div><dt>Interview method</dt><dd>{{ detailMethodValue }}</dd></div>
                <div><dt>{{ detailSecondaryRowLabel }}</dt><dd>{{ detailSecondaryRowValue }}</dd></div>
                <div><dt>Duration</dt><dd>{{ selectedDuration }}</dd></div>
                <div><dt>Time zone</dt><dd>{{ selectedTimezone }}</dd></div>
                <div v-if="selectedMethod === 'phone'"><dt>Visibility</dt><dd>{{ selectedVisibility }}</dd></div>
              </dl>
              <dl v-else class="screening-detail__definition-list">
                <div><dt>AI interview kit</dt><dd>{{ aiKitTitle }}</dd></div>
                <div><dt>Questions</dt><dd>8 questions</dd></div>
                <div><dt>Estimated time</dt><dd>~20 minutes</dd></div>
                <div><dt>Focus areas</dt><dd>Design thinking, Problem solving, Communication, User empathy</dd></div>
              </dl>

              <div class="screening-detail__note">
                <AppIcon name="info" :size="14" />
                <span>{{ detailNoteText }}</span>
              </div>
            </section>

            <section class="screening-detail__section screening-detail__panel">
              <h3>Actions</h3>
              <div class="screening-detail__action-list">
                <button class="screening-detail__action-button" type="button" @click="returnToForm">
                  <AppIcon name="edit" :size="15" />
                  <span>Edit Details</span>
                </button>
                <button class="screening-detail__action-button is-danger" type="button" @click="closeOverlay">
                  <AppIcon name="close" :size="15" />
                  <span>Cancel Screening</span>
                </button>
              </div>
            </section>
          </div>

          <div class="screening-detail__grid screening-detail__grid--bottom">
            <section class="screening-detail__section screening-detail__panel">
              <h3>{{ selectedMethod === 'ai' ? 'Activity' : 'Reminder' }}</h3>
              <template v-if="selectedMethod !== 'ai'">
              <div class="screening-detail__mini-card">
                <AppIcon name="bell" :size="16" />
                <div>
                  <strong>You'll be reminded</strong>
                  <small>{{ selectedReminderOffset }} at {{ selectedReminderTime }}</small>
                </div>
              </div>
              <button class="screening-detail__text-link" type="button" @click="returnToForm">Manage reminders</button>
              </template>
              <template v-else>
                <div class="screening-detail__activity-list">
                  <article class="screening-detail__activity-item">
                    <span class="screening-detail__activity-icon"><AppIcon name="mail" :size="14" /></span>
                    <div>
                      <strong>Invitation will be sent to candidate</strong>
                      <small>20 May 2025 at 10:00 AM</small>
                    </div>
                  </article>
                  <article class="screening-detail__activity-item">
                    <span class="screening-detail__activity-icon is-pink"><AppIcon name="calendar" :size="14" /></span>
                    <div>
                      <strong>Screening deadline</strong>
                      <small>{{ selectedAiDeadline }}</small>
                    </div>
                  </article>
                </div>
              </template>
            </section>

            <section class="screening-detail__section screening-detail__panel">
              <h3>{{ selectedMethod === 'ai' ? 'Reminder' : 'Activity' }}</h3>
              <template v-if="selectedMethod !== 'ai'">
                <div class="screening-detail__activity-list">
                  <article class="screening-detail__activity-item">
                    <span class="screening-detail__activity-icon"><AppIcon name="mail" :size="14" /></span>
                    <div>
                      <strong>Invitation will be sent to candidate</strong>
                      <small>After scheduling</small>
                    </div>
                  </article>
                  <article class="screening-detail__activity-item">
                    <span class="screening-detail__activity-icon is-pink"><AppIcon name="calendar" :size="14" /></span>
                    <div>
                      <strong>Screening scheduled</strong>
                      <small>16 May 2025 at 10:30 AM</small>
                    </div>
                  </article>
                </div>
              </template>
              <template v-else>
                <div class="screening-detail__mini-card">
                  <AppIcon name="bell" :size="16" />
                  <div>
                    <strong>You'll be reminded</strong>
                    <small>1 day before the deadline</small>
                  </div>
                </div>
                <button class="screening-detail__text-link" type="button" @click="returnToForm">Manage reminders</button>
              </template>
            </section>

            <section class="screening-detail__section screening-detail__panel screening-detail__panel--ready">
              <h3>Get Ready</h3>
              <div class="screening-detail__ready">
                <small>{{ selectedMethod === 'ai' ? 'Deadline in' : 'Interview starts in' }}</small>
                <strong>{{ selectedMethod === 'ai' ? '3 days' : '23h 45m' }}</strong>
                <span v-if="selectedMethod === 'ai'" class="screening-detail__ready-meta">{{ selectedAiDeadline }}</span>
              </div>
              <button class="screening-detail__call-button" type="button">
                <AppIcon :name="selectedMethodMeta.icon" :size="15" />
                <span>{{ selectedMethod === 'ai' ? 'View Screening Kit' : callActionLabel }}</span>
              </button>
              <button class="screening-detail__view-button" type="button" @click="viewCandidateProfile">
                <AppIcon name="eye" :size="14" />
                <span>{{ selectedMethod === 'ai' ? 'View Details' : 'View Details' }}</span>
              </button>
            </section>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style>
.screening-overlay {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 24px;
  overflow-y: auto;
  background: rgba(16, 24, 40, 0.28);
  backdrop-filter: blur(4px);
}

.screening-sheet,
.screening-success {
  width: 640px;
  max-width: calc(100vw - 32px);
  border: 1px solid #eef1f6;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 28px 60px rgba(17, 24, 39, 0.16);
  box-sizing: border-box;
}

.screening-sheet {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - 40px);
}

.screening-sheet__header,
.screening-sheet__title,
.screening-profile__identity,
.screening-step__head,
.screening-method-card__top,
.screening-select,
.screening-input,
.screening-info,
.screening-reminder-row,
.screening-add-reminder,
.screening-sheet__footer,
.screening-button,
.screening-success__footer,
.screening-success__actions {
  display: flex;
  align-items: center;
}

.screening-sheet__header,
.screening-sheet__footer,
.screening-success__footer {
  justify-content: space-between;
}

.screening-sheet__header {
  padding: 24px 24px 14px;
}

.screening-sheet__title {
  gap: 14px;
  min-width: 0;
}

.screening-sheet__title-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  flex: 0 0 40px;
  border-radius: 50%;
  color: #ff4ea3;
  background: rgba(255, 78, 163, 0.1);
}

.screening-sheet__title h2,
.screening-success h2,
.screening-step__head h3 {
  margin: 0;
  color: #1f2f56;
}

.screening-sheet__title h2 {
  font-size: 18px;
  font-weight: 700;
}

.screening-sheet__title p,
.screening-method-card p,
.screening-field > span,
.screening-profile__copy span,
.screening-profile__meta dt,
.screening-info span,
.screening-success p,
.screening-success__summary span {
  margin: 0;
  color: #7d8baa;
  font-size: 14px;
  line-height: 1.5;
}

.screening-sheet__close,
.screening-success__close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: #92a0bc;
  background: transparent;
  cursor: pointer;
}

.screening-profile {
  flex: 0 0 auto;
  padding: 0 24px 20px;
}

.screening-profile__identity {
  gap: 12px;
}

.screening-profile__avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(135deg, #d99c53 0%, #1f7a5a 100%);
}

.screening-profile__copy {
  min-width: 0;
}

.screening-profile__copy strong,
.screening-profile__meta dd,
.screening-method-card strong,
.screening-success__summary strong {
  display: block;
  color: #233457;
}

.screening-profile__copy strong {
  font-size: 15px;
  font-weight: 700;
}

.screening-profile__badge {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 999px;
  color: #5966ff;
  font-size: 11px;
  font-weight: 700;
  background: #eef0ff;
}

.screening-profile__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin: 18px 0 0;
}

.screening-profile__meta div:last-child {
  text-align: right;
}

.screening-profile__meta dd {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 700;
}

.screening-sheet__body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0 24px 12px;
  overflow-y: auto;
}

.screening-step + .screening-step {
  margin-top: 28px;
}

.screening-step__head {
  gap: 12px;
  margin-bottom: 14px;
}

.screening-step__number {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  flex: 0 0 22px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4ea3 0%, #ff6abb 100%);
}

.screening-step__head h3 {
  font-size: 16px;
  font-weight: 700;
}

.screening-step__head h3 small {
  color: #9aa6bf;
  font-size: 12px;
  font-weight: 600;
}

.screening-step__head p {
  margin: 4px 0 0;
  color: #7382a3;
  font-size: 14px;
}

.screening-methods {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.screening-method-card {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  display: block;
  width: 100%;
  min-height: 160px;
  padding: 16px 14px 34px;
  border: 1px solid #ebeff5;
  border-radius: 14px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
}

.screening-method-card.is-active {
  border-color: #ff5aa8;
  box-shadow: 0 0 0 1px rgba(255, 90, 168, 0.14);
  background: #fffdfd;
}

.screening-method-card__top {
  justify-content: space-between;
  margin-bottom: 14px;
}

.screening-method-card__icon {
  color: #ff5aa8;
}

.screening-method-card__tag {
  padding: 2px 6px;
  border-radius: 999px;
  color: #ff5aa8;
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 90, 168, 0.12);
}

.screening-method-card strong {
  font-size: 14px;
  font-weight: 700;
}

.screening-method-card p {
  margin-top: 8px;
  padding-right: 6px;
  font-size: 13px;
}

.screening-method-card__radio {
  position: absolute;
  left: 14px;
  bottom: 14px;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border: 1px solid #d3daea;
  border-radius: 50%;
}

.screening-method-card__radio i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
}

.screening-method-card.is-active .screening-method-card__radio {
  border-color: #ff5aa8;
}

.screening-method-card.is-active .screening-method-card__radio i {
  background: #ff5aa8;
}

.screening-fields {
  display: grid;
  gap: 14px;
}

.screening-fields--schedule {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.screening-fields--contact {
  grid-template-columns: minmax(0, 1.2fr) minmax(200px, 0.8fr);
}

.screening-fields--video {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.screening-fields--ai-datetime {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
}

.screening-field {
  display: block;
}

.screening-field > span {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
}

.screening-field__hint {
  display: block;
  margin-top: 8px;
  color: #7d8baa;
  font-size: 12px;
}

.screening-select,
.screening-input {
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #e6ebf3;
  border-radius: 12px;
  background: #ffffff;
}

.screening-select {
  color: #223457;
}

.screening-select svg,
.screening-input svg {
  color: #ff5aa8;
  flex: 0 0 auto;
}

.screening-select select,
.screening-input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  color: #223457;
  font: inherit;
  font-size: 14px;
  background: transparent;
  appearance: none;
  box-sizing: border-box;
}

.screening-input input {
  padding: 0;
}

.screening-flag {
  position: relative;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  overflow: hidden;
  border-radius: 50%;
  background: #2563eb;
}

.screening-flag__cross-y,
.screening-flag__cross-x {
  position: absolute;
  background: #facc15;
}

.screening-flag__cross-y {
  top: 0;
  bottom: 0;
  left: 4px;
  width: 3px;
}

.screening-flag__cross-x {
  left: 0;
  right: 0;
  top: 5px;
  height: 3px;
}

.screening-info {
  gap: 10px;
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid #ecefff;
  border-radius: 12px;
  color: #687896;
  background: #f7f8ff;
}

.screening-info svg {
  color: #5966ff;
  flex: 0 0 auto;
}

.screening-info--ai {
  margin-top: 0;
  border-color: #f4dbe9;
  background: linear-gradient(180deg, #fffafc 0%, #fff4f9 100%);
}

.screening-info--ai svg {
  color: #ff4ea3;
}

.screening-info--ai-date {
  border-color: #f4dbe9;
  background: linear-gradient(180deg, #fffafc 0%, #fff4f9 100%);
}

.screening-info--ai-date svg {
  color: #ff4ea3;
}

.screening-step--ai-intro {
  margin-top: 18px;
}

.screening-kit-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 12px 14px;
  border: 1px solid #e6ebf3;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
}

.screening-kit-card__icon {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  flex: 0 0 32px;
  border-radius: 10px;
  color: #ff4ea3;
  background: #fff0f7;
}

.screening-kit-card__copy {
  min-width: 0;
  flex: 1 1 auto;
}

.screening-kit-card__copy strong {
  display: block;
  color: #233457;
  font-size: 14px;
  font-weight: 700;
}

.screening-kit-card__copy small {
  display: block;
  margin-top: 4px;
  color: #7d8baa;
  font-size: 11px;
  line-height: 1.4;
}

.screening-message-card {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  min-height: 46px;
  padding: 13px 14px;
  border: 1px solid #f4dbe9;
  border-radius: 12px;
  background: linear-gradient(180deg, #fffafc 0%, #fff4f9 100%);
  box-sizing: border-box;
}

.screening-message-card svg {
  color: #ff4ea3;
  flex: 0 0 auto;
  margin-top: 1px;
}

.screening-message-card p {
  margin: 0;
  color: #7b89a7;
  font-size: 13px;
  line-height: 1.45;
}

.screening-field--reminder > span {
  margin-bottom: 8px;
}

.screening-reminder-row {
  gap: 12px;
}

.screening-reminder-row .screening-select {
  flex: 1 1 0;
}

.screening-reminder-row__at {
  color: #7b89a7;
  font-size: 13px;
}

.screening-add-reminder {
  gap: 6px;
  margin-top: 12px;
  padding: 0;
  border: 0;
  color: #ff4ea3;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
  cursor: pointer;
}

.screening-sheet__footer {
  flex: 0 0 auto;
  padding: 18px 24px 24px;
}

.screening-button {
  appearance: none;
  -webkit-appearance: none;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.screening-button--ghost {
  border: 1px solid #dbe3ef;
  color: #30415f;
  background: #ffffff;
}

.screening-button--primary {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #ff4ea3 0%, #ff65b5 100%);
  box-shadow: 0 14px 24px rgba(255, 78, 163, 0.24);
}

.screening-detail {
  width: min(100%, 920px);
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  border: 1px solid #eef1f6;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 28px 60px rgba(17, 24, 39, 0.16);
  overflow: hidden;
}

.screening-detail__header,
.screening-detail__title,
.screening-detail__title-row,
.screening-detail__header-actions,
.screening-detail__ghost-action,
.screening-detail__stats,
.screening-detail__stat-card,
.screening-detail__stat-icon,
.screening-detail__participants,
.screening-detail__participant-card,
.screening-detail__grid,
.screening-detail__action-button,
.screening-detail__mini-card,
.screening-detail__activity-item,
.screening-detail__activity-icon,
.screening-detail__call-button,
.screening-detail__view-button,
.screening-detail__note,
.screening-detail__ready {
  display: flex;
  align-items: center;
}

.screening-detail__header {
  justify-content: space-between;
  gap: 20px;
  padding: 18px 20px;
  border-bottom: 1px solid #eef2f8;
}

.screening-detail__title {
  gap: 12px;
  min-width: 0;
}

.screening-detail__back,
.screening-detail__more {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  color: #6f7f9c;
  background: transparent;
  cursor: pointer;
}

.screening-detail__title-row {
  gap: 10px;
}

.screening-detail__title h2 {
  margin: 0;
  color: #223457;
  font-size: 18px;
  font-weight: 700;
}

.screening-detail__status {
  padding: 4px 10px;
  border-radius: 999px;
  color: #14a46b;
  font-size: 11px;
  font-weight: 700;
  background: #eafaf2;
}

.screening-detail__header-actions {
  gap: 10px;
}

.screening-detail__ghost-action {
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #e8edf5;
  border-radius: 10px;
  color: #223457;
  font-size: 12px;
  font-weight: 700;
  background: #ffffff;
  cursor: pointer;
}

.screening-detail__body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 18px 20px 20px;
  overflow-y: auto;
}

.screening-detail__stats,
.screening-detail__participants,
.screening-detail__grid {
  gap: 14px;
}

.screening-detail__stats {
  align-items: stretch;
}

.screening-detail__stat-card,
.screening-detail__participant-card,
.screening-detail__panel {
  border: 1px solid #eef2f8;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.screening-detail__stat-card {
  flex: 1 1 0;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.screening-detail__stat-icon {
  width: 34px;
  height: 34px;
  justify-content: center;
  border-radius: 10px;
  color: #ff4ea3;
  background: #fff0f7;
  flex: 0 0 34px;
}

.screening-detail__stat-icon.is-violet {
  color: #6457ff;
  background: #f1efff;
}

.screening-detail__stat-icon.is-soft-pink {
  color: #ff4ea3;
  background: #fff6fb;
}

.screening-detail__stat-card strong,
.screening-detail__participant-card strong,
.screening-detail__definition-list dd,
.screening-detail__mini-card strong,
.screening-detail__activity-item strong,
.screening-detail__ready strong {
  display: block;
  color: #223457;
}

.screening-detail__stat-card strong {
  font-size: 13px;
  font-weight: 700;
}

.screening-detail__stat-card small,
.screening-detail__participant-card small,
.screening-detail__participant-card span,
.screening-detail__definition-list dt,
.screening-detail__mini-card small,
.screening-detail__activity-item small,
.screening-detail__ready small,
.screening-detail__note span {
  display: block;
  color: #7a88a5;
  font-size: 12px;
  line-height: 1.45;
}

.screening-detail__section {
  margin-top: 18px;
}

.screening-detail__section h3 {
  margin: 0 0 12px;
  color: #25345a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.screening-detail__participants {
  align-items: stretch;
}

.screening-detail__participant-card {
  flex: 1 1 0;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
}

.screening-detail__participant-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  border-radius: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(135deg, #d99c53 0%, #1f7a5a 100%);
}

.screening-detail__participant-avatar.is-photo {
  background: linear-gradient(135deg, #30435f 0%, #56749b 100%);
}

.screening-detail__participant-card em {
  margin-left: auto;
  align-self: center;
  padding: 3px 8px;
  border-radius: 999px;
  color: #14a46b;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  background: #eafaf2;
}

.screening-detail__participant-card em.is-invite {
  color: #5966ff;
  background: #eef0ff;
}

.screening-detail__grid {
  align-items: stretch;
}

.screening-detail__grid > * {
  flex: 1 1 0;
}

.screening-detail__grid--bottom > :last-child {
  flex: 0.88 1 0;
}

.screening-detail__panel {
  padding: 16px;
}

.screening-detail__definition-list {
  margin: 0;
}

.screening-detail__definition-list div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 9px 0;
  border-bottom: 1px solid #f3f5fa;
}

.screening-detail__definition-list div:last-child {
  border-bottom: 0;
}

.screening-detail__definition-list dd {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}

.screening-detail__action-list {
  display: grid;
  gap: 12px;
}

.screening-detail__action-button {
  justify-content: flex-start;
  gap: 10px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid #e8edf5;
  border-radius: 12px;
  color: #223457;
  font-size: 13px;
  font-weight: 700;
  background: #ffffff;
  cursor: pointer;
}

.screening-detail__action-button.is-danger {
  color: #ef4444;
}

.screening-detail__note {
  gap: 10px;
  margin-top: 14px;
  padding: 12px 14px;
  border: 1px solid #ecefff;
  border-radius: 12px;
  background: #f7f8ff;
}

.screening-detail__note svg {
  color: #5966ff;
  flex: 0 0 auto;
}

.screening-detail__mini-card {
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0 14px;
}

.screening-detail__text-link {
  padding: 0;
  border: 0;
  color: #5966ff;
  font-size: 12px;
  font-weight: 700;
  background: transparent;
  cursor: pointer;
}

.screening-detail__activity-list {
  display: grid;
  gap: 14px;
}

.screening-detail__activity-item {
  gap: 10px;
  align-items: flex-start;
}

.screening-detail__activity-icon {
  width: 28px;
  height: 28px;
  justify-content: center;
  border-radius: 8px;
  color: #5966ff;
  background: #eef0ff;
  flex: 0 0 28px;
}

.screening-detail__activity-icon.is-pink {
  color: #ff4ea3;
  background: #fff0f7;
}

.screening-detail__panel--ready {
  background: linear-gradient(180deg, #ffffff 0%, #fff8fc 100%);
}

.screening-detail__ready {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 16px;
}

.screening-detail__ready strong {
  font-size: 28px;
  font-weight: 800;
}

.screening-detail__ready-meta {
  margin-top: 2px;
  color: #7a88a5;
  font-size: 12px;
}

.screening-detail__call-button,
.screening-detail__view-button {
  width: 100%;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.screening-detail__call-button {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #ff4ea3 0%, #ff65b5 100%);
  box-shadow: 0 14px 24px rgba(255, 78, 163, 0.24);
}

.screening-detail__view-button {
  margin-top: 10px;
  border: 1px solid #f1d8e7;
  color: #ff4ea3;
  background: #ffffff;
}

.screening-success {
  position: relative;
  padding: 26px 22px 20px;
  text-align: center;
}

.screening-success__icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
  border-radius: 50%;
  color: #ffffff;
  background: linear-gradient(135deg, #ff4ea3 0%, #ff65b5 100%);
}

.screening-success h2 {
  font-size: 18px;
  font-weight: 700;
}

.screening-success p {
  margin-top: 8px;
  font-size: 12px;
}

.screening-success__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #eef2f8;
  border-radius: 14px;
  background: #fbfcff;
  text-align: left;
}

.screening-success__summary strong {
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
}

.screening-success__footer {
  gap: 10px;
  margin-top: 18px;
}

.screening-success__actions {
  gap: 10px;
}

@media (max-width: 480px) {
  .screening-overlay {
    padding: 12px;
    align-items: flex-start;
  }

  .screening-sheet,
  .screening-success,
  .screening-detail {
    width: 100%;
    border-radius: 18px;
  }

  .screening-methods,
  .screening-fields--schedule,
  .screening-fields--contact,
  .screening-success__summary,
  .screening-detail__stats,
  .screening-detail__participants,
  .screening-detail__grid {
    grid-template-columns: 1fr;
  }

  .screening-detail__stats,
  .screening-detail__participants,
  .screening-detail__grid,
  .screening-detail__header,
  .screening-detail__title,
  .screening-detail__header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .screening-detail__participant-card,
  .screening-detail__stat-card {
    width: 100%;
  }

  .screening-detail__participant-card em {
    margin-left: 0;
    align-self: flex-start;
  }

  .screening-detail__definition-list div,
  .screening-success__summary {
    grid-template-columns: 1fr;
  }

  .screening-sheet__footer,
  .screening-success__footer,
  .screening-success__actions,
  .screening-reminder-row {
    flex-direction: column;
    align-items: stretch;
  }

  .screening-profile__meta {
    grid-template-columns: 1fr;
  }

  .screening-profile__meta div:last-child {
    text-align: left;
  }
}
</style>
