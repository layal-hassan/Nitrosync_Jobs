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
    default: 'Frontend Developer',
  },
  candidateStage: {
    type: String,
    default: 'Engineering',
  },
})

const emit = defineEmits(['close', 'send-request'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const reminderOptions = [
  { label: 'Send now', value: 'now' },
  { label: 'In 24 hours', value: '24h' },
  { label: 'In 2 days', value: '2d' },
  { label: 'Custom date', value: 'custom' },
]

const selectedReminder = ref('now')
const selectedInterviewer = ref('Priya Singh (Interviewer)')
const personalMessage = ref("Hi Priya, just a gentle reminder to share your feedback for Sarah's interview.\nIt helps us keep the process moving forward. Thank you!")

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function closeOverlay() {
  emit('close')
}

function submitRequest() {
  emit('send-request')
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
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="request-feedback-overlay" @click.self="closeOverlay">
      <section class="request-feedback-modal">
        <header class="request-feedback-modal__header">
          <div class="request-feedback-modal__title">
            <span class="request-feedback-modal__icon">
              <AppIcon name="message" :size="20" />
            </span>
            <div>
              <h2>Request Feedback</h2>
              <p>Send a reminder to request feedback</p>
            </div>
          </div>

          <button class="request-feedback-modal__close" type="button" aria-label="Close request feedback" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <section class="request-feedback-candidate">
          <div class="request-feedback-candidate__profile">
            <span class="request-feedback-candidate__avatar">{{ candidateInitials }}</span>

            <div>
              <div class="request-feedback-candidate__identity">
                <strong>{{ candidateName }}</strong>
                <span>{{ candidateRole }}</span>
                <em>Interview Round 2</em>
              </div>

              <div class="request-feedback-candidate__meta">
                <span><AppIcon name="briefcase" :size="14" /> {{ candidateStage }}</span>
                <span><AppIcon name="calendar" :size="14" /> Completed 2 days ago</span>
              </div>
            </div>
          </div>

          <aside class="request-feedback-candidate__status">
            <small>Awaiting Feedback From</small>
            <strong>Priya Singh</strong>
            <span>Interviewer</span>
          </aside>
        </section>

        <div class="request-feedback-form">
          <label class="request-feedback-field">
            <span>Who do you want to request feedback from?</span>
            <div class="request-feedback-select">
              <AppIcon name="user" :size="16" />
              <select v-model="selectedInterviewer">
                <option>Priya Singh (Interviewer)</option>
                <option>Emma Wilson (Hiring Manager)</option>
                <option>Michael Chen (Panel Interviewer)</option>
              </select>
              <AppIcon name="chevronDown" :size="16" />
            </div>
          </label>

          <label class="request-feedback-field">
            <span>Add a personal message <small>(optional)</small></span>
            <div class="request-feedback-textarea-wrap">
              <textarea v-model="personalMessage" rows="5" />
              <small>{{ personalMessage.length }}/500</small>
            </div>
          </label>

          <div class="request-feedback-field">
            <span>Reminder settings</span>
            <div class="request-feedback-options">
              <button
                v-for="option in reminderOptions"
                :key="option.value"
                type="button"
                class="request-feedback-option"
                :class="{ 'is-active': selectedReminder === option.value }"
                @click="selectedReminder = option.value"
              >
                <i />
                <span>{{ option.label }}</span>
                <AppIcon v-if="option.value === 'custom'" name="calendar" :size="14" />
              </button>
            </div>
          </div>

          <section class="request-feedback-preview">
            <span class="request-feedback-preview__icon">
              <AppIcon name="mail" :size="18" />
            </span>
            <div>
              <strong>Preview of reminder</strong>
              <p>Priya, you've been requested to provide feedback for {{ candidateName }} ({{ candidateRole }}) - Interview Round 2 completed 2 days ago.</p>
              <p>This is a friendly reminder to help keep the hiring process on track.</p>
            </div>
          </section>
        </div>

        <footer class="request-feedback-modal__footer">
          <button class="request-feedback-modal__secondary" type="button" @click="closeOverlay">Cancel</button>
          <button class="request-feedback-modal__primary" type="button" @click="submitRequest">
            <AppIcon name="share" :size="15" />
            <span>Send Request</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.request-feedback-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 22px;
  background: rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(10px);
}

.request-feedback-modal {
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  overflow: auto;
  border: 1px solid #e9edf5;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.16);
}

.request-feedback-modal__header,
.request-feedback-candidate,
.request-feedback-form,
.request-feedback-modal__footer {
  padding-left: 24px;
  padding-right: 24px;
}

.request-feedback-modal__header,
.request-feedback-modal__title,
.request-feedback-candidate,
.request-feedback-candidate__profile,
.request-feedback-candidate__identity,
.request-feedback-candidate__meta,
.request-feedback-select,
.request-feedback-options,
.request-feedback-option,
.request-feedback-preview,
.request-feedback-modal__footer {
  display: flex;
}

.request-feedback-modal__header {
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding-top: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid #edf1f7;
}

.request-feedback-modal__title {
  gap: 14px;
}

.request-feedback-modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  color: #ff4fa0;
  background: #ffedf6;
}

.request-feedback-modal__title h2 {
  margin: 0;
  color: #1f2a44;
  font-size: 1.1rem;
  font-weight: 800;
}

.request-feedback-modal__title p {
  margin: 5px 0 0;
  color: #76839a;
}

.request-feedback-modal__close {
  border: 0;
  background: transparent;
  color: #9aa4b8;
  cursor: pointer;
}

.request-feedback-candidate {
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 26px 24px 0;
  padding: 18px 20px;
  border: 1px solid #edf1f7;
  border-radius: 18px;
}

.request-feedback-candidate__profile {
  align-items: center;
  gap: 16px;
}

.request-feedback-candidate__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  color: #f04d98;
  font-size: 1.7rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff2f8 0%, #fdeaf4 100%);
}

.request-feedback-candidate__identity {
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.request-feedback-candidate__identity strong {
  color: #1f2a44;
  font-size: 1rem;
  font-weight: 800;
}

.request-feedback-candidate__identity span,
.request-feedback-candidate__identity em {
  color: #627189;
  font-style: normal;
}

.request-feedback-candidate__meta {
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 10px;
  color: #7a8598;
  font-size: 0.92rem;
}

.request-feedback-candidate__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.request-feedback-candidate__status {
  min-width: 176px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff6ec;
}

.request-feedback-candidate__status small {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  color: #f97316;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: #fff0dd;
}

.request-feedback-candidate__status strong,
.request-feedback-candidate__status span {
  display: block;
}

.request-feedback-candidate__status strong {
  margin-top: 10px;
  color: #1f2a44;
  font-size: 0.98rem;
  font-weight: 800;
}

.request-feedback-candidate__status span {
  margin-top: 4px;
  color: #76839a;
}

.request-feedback-form {
  padding-top: 24px;
  padding-bottom: 24px;
}

.request-feedback-field {
  display: block;
}

.request-feedback-field + .request-feedback-field,
.request-feedback-field + .request-feedback-preview,
.request-feedback-preview + .request-feedback-field {
  margin-top: 24px;
}

.request-feedback-field > span {
  display: block;
  margin-bottom: 10px;
  color: #1f2a44;
  font-weight: 700;
}

.request-feedback-field > span small {
  color: #97a2b6;
  font-weight: 600;
}

.request-feedback-select {
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px solid #d9e0ec;
  border-radius: 14px;
}

.request-feedback-select select {
  flex: 1;
  height: 44px;
  border: 0;
  background: transparent;
  color: #1f2a44;
  font-size: 0.95rem;
  outline: none;
}

.request-feedback-textarea-wrap {
  padding: 14px 16px 12px;
  border: 1px solid #d9e0ec;
  border-radius: 14px;
}

.request-feedback-textarea-wrap textarea {
  width: 100%;
  border: 0;
  resize: none;
  color: #1f2a44;
  font: inherit;
  line-height: 1.6;
  outline: none;
}

.request-feedback-textarea-wrap small {
  display: block;
  margin-top: 10px;
  color: #95a0b4;
  text-align: right;
}

.request-feedback-options {
  gap: 12px;
  flex-wrap: wrap;
}

.request-feedback-option {
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 14px 14px;
  border: 1px solid #d9e0ec;
  border-radius: 14px;
  background: #ffffff;
  color: #60708a;
  cursor: pointer;
}

.request-feedback-option.is-active {
  border-color: #ff4fa0;
  color: #1f2a44;
  background: #fff4f9;
}

.request-feedback-option i {
  width: 18px;
  height: 18px;
  border: 2px solid #c8d1df;
  border-radius: 50%;
  background: #ffffff;
}

.request-feedback-option.is-active i {
  border-color: #ff69b4;
  box-shadow: inset 0 0 0 4px #ff69b4;
}

.request-feedback-preview {
  gap: 14px;
  padding: 22px;
  border-radius: 16px;
  background: #f6f8fc;
}

.request-feedback-preview__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #ff4fa0;
  background: #fff0f7;
}

.request-feedback-preview strong {
  display: block;
  color: #1f2a44;
  font-weight: 800;
}

.request-feedback-preview p {
  margin: 6px 0 0;
  color: #65738d;
  line-height: 1.55;
}

.request-feedback-modal__footer {
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 0;
  padding-bottom: 24px;
}

.request-feedback-modal__secondary,
.request-feedback-modal__primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 110px;
  height: 42px;
  padding: 0 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
}

.request-feedback-modal__secondary {
  border: 1px solid #d7deea;
  background: #ffffff;
  color: #334155;
}

.request-feedback-modal__primary {
  border: 0;
  color: #ffffff;
  background: linear-gradient(135deg, #f15da9 0%, #ef77bd 100%);
}

@media (max-width: 760px) {
  .request-feedback-overlay {
    padding: 12px;
  }

  .request-feedback-modal {
    width: 100%;
    max-height: calc(100vh - 12px);
  }

  .request-feedback-candidate,
  .request-feedback-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .request-feedback-modal__footer button {
    width: 100%;
  }
}
</style>
