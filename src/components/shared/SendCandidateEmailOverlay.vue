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
    default: 'UX Designer',
  },
  candidateStage: {
    type: String,
    default: 'Interview',
  },
  candidateAppliedOn: {
    type: String,
    default: '12 May, 2024',
  },
  candidateMatch: {
    type: String,
    default: '92% Match',
  },
})

const emit = defineEmits(['close'])

const flowState = ref('compose')
const sendOption = ref('schedule')
const templateLabel = ref('Use Template')
const subject = ref('')
const message = ref('')
const scheduledDate = ref('22 Jul 2024')
const scheduledTime = ref('09:00 AM')
const scheduledTimezone = ref('Europe/Stockholm (GMT+2)')

const variableTokens = ['{{CandidateName}}', '{{JobTitle}}', '{{CompanyName}}', '{{InterviewDate}}', '{{InterviewTime}}']
const attachments = ['Upload files or drag and drop']

const candidateEmail = computed(() => {
  const normalized = props.candidateName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  if (!normalized.length) {
    return 'candidate@email.com'
  }

  return `${normalized.join('.')}@email.com`
})

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const stageLabel = computed(() => `${props.candidateStage} stage`.toUpperCase())
const wordsCount = computed(() => {
  const content = message.value.trim()

  if (!content) {
    return 0
  }

  return content.split(/\s+/).length
})

const sendButtonLabel = computed(() => sendOption.value === 'schedule' ? 'Schedule Email' : 'Send Email')

function buildDefaultMessage() {
  return [
    'Hi {{CandidateName}},',
    '',
    'Thank you for your interest in the {{JobTitle}} position at {{CompanyName}}.',
    '',
    'We were impressed with your background and would like to invite you for an interview to learn more about your experience and discuss the role in detail.',
    '',
    'Please let us know your availability for the upcoming days.',
    '',
    'Best regards,',
    '{{RecruiterName}}',
    '{{CompanyName}}',
  ].join('\n')
}

function resetForm() {
  flowState.value = 'compose'
  sendOption.value = 'schedule'
  templateLabel.value = 'Use Template'
  subject.value = `Interview invitation for ${props.candidateRole}`
  message.value = buildDefaultMessage()
  scheduledDate.value = '22 Jul 2024'
  scheduledTime.value = '09:00 AM'
  scheduledTimezone.value = 'Europe/Stockholm (GMT+2)'
}

function closeOverlay() {
  emit('close')
}

function submitEmail() {
  flowState.value = 'success'
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
    <div
      v-if="open"
      class="send-email-overlay"
      :class="{ 'is-success': flowState === 'success' }"
      @click.self="closeOverlay"
    >
      <section v-if="flowState === 'compose'" class="send-email-modal">
        <header class="send-email-modal__head">
          <div class="send-email-modal__title">
            <span class="send-email-modal__title-icon">
              <AppIcon name="share" :size="20" />
            </span>
            <div>
              <h2>Send Email to Candidate</h2>
            </div>
          </div>

          <button class="send-email-modal__close" type="button" aria-label="Close send email" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="send-email-modal__body">
          <article class="send-email-profile">
            <div class="send-email-profile__main">
              <span class="send-email-profile__avatar">{{ candidateInitials }}</span>
              <div class="send-email-profile__copy">
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateEmail }}</small>
                <span>{{ candidateRole.toUpperCase() }} <i aria-hidden="true"></i> {{ stageLabel }}</span>
              </div>
            </div>

            <div class="send-email-profile__stats">
              <div>
                <small>Applied on</small>
                <strong>{{ candidateAppliedOn }}</strong>
              </div>
              <div>
                <small>Current Stage</small>
                <span class="send-email-profile__badge">{{ candidateStage }}</span>
              </div>
              <button type="button">
                <span>View Profile</span>
                <AppIcon name="external-link" :size="14" />
              </button>
            </div>
          </article>

          <div class="send-email-layout">
            <section class="send-email-compose">
              <button class="send-email-template-trigger" type="button">
                <span>{{ templateLabel }}</span>
                <AppIcon name="chevronDown" :size="16" />
              </button>

              <label class="send-email-field">
                <div class="send-email-field__head">
                  <strong>To</strong>
                  <div>
                    <span>CC</span>
                    <span>BCC</span>
                  </div>
                </div>
                <input :value="candidateEmail" type="text" readonly>
              </label>

              <label class="send-email-field">
                <div class="send-email-field__head">
                  <strong>Subject <span>*</span></strong>
                </div>
                <input v-model="subject" type="text">
              </label>

              <div class="send-email-editor">
                <div class="send-email-field__head">
                  <strong>Message <span>*</span></strong>
                </div>

                <div class="send-email-editor__toolbar">
                  <div class="send-email-editor__tools">
                    <button type="button">Paragraph</button>
                    <span></span>
                    <button type="button"><strong>B</strong></button>
                    <button type="button"><em>I</em></button>
                    <button type="button"><u>U</u></button>
                    <button type="button"><AppIcon name="list" :size="14" /></button>
                    <button type="button"><AppIcon name="list" :size="14" /></button>
                    <button type="button"><AppIcon name="link" :size="14" /></button>
                    <button type="button"><AppIcon name="document" :size="14" /></button>
                  </div>

                  <div class="send-email-editor__actions">
                    <button class="send-email-editor__insert" type="button">
                      <span>Insert Variable</span>
                      <AppIcon name="chevronDown" :size="14" />
                    </button>
                    <button class="send-email-editor__expand" type="button" aria-label="Expand editor">
                      <AppIcon name="external-link" :size="14" />
                    </button>
                  </div>
                </div>

                <textarea v-model="message" rows="12"></textarea>

                <div class="send-email-editor__footer">
                  <span>WORDS: {{ wordsCount }}</span>
                </div>
              </div>
            </section>

            <aside class="send-email-side">
              <section class="send-email-side__panel">
                <div class="send-email-side__title">
                  <strong>Send Options</strong>
                </div>

                <div class="send-email-option-list">
                  <label class="send-email-option">
                    <input v-model="sendOption" type="radio" value="now">
                    <span class="send-email-option__dot"></span>
                    <div class="send-email-option__copy">
                      <strong>Send now</strong>
                      <small>Send email immediately</small>
                    </div>
                  </label>

                  <label class="send-email-option">
                    <input v-model="sendOption" type="radio" value="schedule">
                    <span class="send-email-option__dot"></span>
                    <div class="send-email-option__copy">
                      <strong>Schedule email</strong>
                      <small>Choose date and time to send</small>
                    </div>
                  </label>
                </div>

                <div class="send-email-side__fields">
                  <label class="send-email-side__field">
                    <span>Date</span>
                    <button type="button">
                      <div>
                        <AppIcon name="calendar" :size="15" />
                        <strong>{{ scheduledDate }}</strong>
                      </div>
                      <AppIcon name="chevronDown" :size="15" />
                    </button>
                  </label>

                  <label class="send-email-side__field">
                    <span>Time</span>
                    <button type="button">
                      <div>
                        <AppIcon name="clock" :size="15" />
                        <strong>{{ scheduledTime }}</strong>
                      </div>
                      <AppIcon name="chevronDown" :size="15" />
                    </button>
                  </label>

                  <label class="send-email-side__field">
                    <span>Time Zone</span>
                    <button type="button">
                      <div>
                        <AppIcon name="mapPin" :size="15" />
                        <strong>{{ scheduledTimezone }}</strong>
                      </div>
                      <AppIcon name="chevronDown" :size="15" />
                    </button>
                  </label>
                </div>

                <article class="send-email-schedule-card">
                  <div class="send-email-schedule-card__icon">
                    <AppIcon name="calendar" :size="16" />
                  </div>
                  <div>
                    <small>Email will be sent on</small>
                    <strong>{{ scheduledDate }} at {{ scheduledTime }}</strong>
                    <span>{{ scheduledTimezone }}</span>
                    <button type="button">Edit schedule</button>
                  </div>
                </article>
              </section>

              <section class="send-email-side__panel">
                <div class="send-email-side__title">
                  <strong>Insert Variables</strong>
                  <AppIcon name="info" :size="14" />
                </div>

                <div class="send-email-variable-stack">
                  <button v-for="token in variableTokens" :key="token" type="button">{{ token }}</button>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="send-email-modal__footer">
          <div class="send-email-attachments">
            <strong>Attachments</strong>
            <button type="button">
              <AppIcon name="link" :size="16" />
              <span>{{ attachments[0] }}</span>
            </button>
          </div>

          <div class="send-email-modal__footer-actions">
            <button class="send-email-button send-email-button--ghost" type="button">Preview Email</button>
            <button class="send-email-button send-email-button--primary" type="button" @click="submitEmail">
              <AppIcon name="share" :size="16" />
              <span>{{ sendButtonLabel }}</span>
            </button>
          </div>
        </footer>
      </section>

      <section v-else class="send-email-success">
        <button class="send-email-success__close" type="button" aria-label="Dismiss email sent message" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="send-email-success__icon">
          <AppIcon name="checkCircle" :size="34" />
        </div>

        <h2>{{ sendOption === 'schedule' ? 'Email Scheduled' : 'Email Sent' }}</h2>
        <p>Your message to {{ candidateName }} is ready.</p>

        <button class="send-email-button send-email-button--primary send-email-success__button" type="button" @click="closeOverlay">
          Dismiss
        </button>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.send-email-overlay,
.send-email-overlay *,
.send-email-overlay *::before,
.send-email-overlay *::after {
  box-sizing: border-box;
}

.send-email-overlay button,
.send-email-overlay input,
.send-email-overlay textarea {
  font: inherit;
}

.send-email-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(20, 28, 48, 0.56);
  backdrop-filter: blur(7px);
}

.send-email-overlay.is-success {
  background: rgba(237, 241, 247, 0.88);
}

.send-email-modal,
.send-email-success {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  border-radius: 26px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.26);
}

.send-email-modal {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.send-email-modal__head,
.send-email-modal__title,
.send-email-profile,
.send-email-profile__main,
.send-email-profile__stats,
.send-email-profile__stats button,
.send-email-field__head,
.send-email-editor__toolbar,
.send-email-editor__tools,
.send-email-editor__actions,
.send-email-editor__insert,
.send-email-side__title,
.send-email-option,
.send-email-side__field button,
.send-email-side__field button > div,
.send-email-schedule-card,
.send-email-modal__footer,
.send-email-modal__footer-actions,
.send-email-button,
.send-email-success {
  display: flex;
  align-items: center;
}

.send-email-modal__head,
.send-email-modal__footer,
.send-email-profile,
.send-email-profile__stats,
.send-email-editor__toolbar,
.send-email-side__field button,
.send-email-modal__footer-actions {
  justify-content: space-between;
}

.send-email-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.send-email-modal__title {
  gap: 14px;
}

.send-email-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: #fff1f8;
  color: #ff61af;
}

.send-email-modal__title h2,
.send-email-success h2 {
  margin: 0;
  color: #222657;
}

.send-email-modal__title h2 {
  font-size: 1rem;
}

.send-email-modal__close,
.send-email-success__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #9ba8bc;
  cursor: pointer;
}

.send-email-modal__body {
  overflow: auto;
  padding: 22px 24px;
}

.send-email-profile {
  gap: 16px;
  padding: 18px;
  border: 1px solid #ecf1f8;
  border-radius: 16px;
  background: #fff;
}

.send-email-profile__main {
  gap: 16px;
  min-width: 0;
}

.send-email-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd9ef 0%, #f8faff 100%);
  color: #ff5aac;
  font-size: 1.25rem;
  font-weight: 800;
  flex: 0 0 56px;
}

.send-email-profile__copy strong,
.send-email-field__head strong,
.send-email-side__title strong,
.send-email-option__copy strong,
.send-email-attachments strong {
  color: #222657;
}

.send-email-profile__copy strong {
  display: block;
  font-size: 1rem;
}

.send-email-profile__copy small,
.send-email-profile__copy span,
.send-email-profile__stats small,
.send-email-option__copy small,
.send-email-side__field span,
.send-email-schedule-card small,
.send-email-schedule-card span,
.send-email-success p {
  color: #8a97ad;
}

.send-email-profile__copy small {
  display: block;
  margin-top: 4px;
  font-size: 0.95rem;
}

.send-email-profile__copy span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
}

.send-email-profile__copy span i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c6cedb;
}

.send-email-profile__stats {
  gap: 22px;
  margin-left: auto;
}

.send-email-profile__stats > div {
  display: grid;
  gap: 2px;
  min-width: 96px;
}

.send-email-profile__stats small {
  display: block;
  font-size: 0.82rem;
}

.send-email-profile__stats strong {
  display: block;
  margin-top: 5px;
  color: #1f2a3d;
  font-size: 0.96rem;
}

.send-email-profile__badge {
  display: inline-flex;
  margin-top: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff5aac;
  font-size: 0.84rem;
  font-weight: 700;
}

.send-email-profile__stats button {
  gap: 8px;
  min-width: 132px;
  height: 40px;
  padding: 0 16px;
  border: 1px solid #dde4ef;
  border-radius: 12px;
  background: #fff;
  color: #222657;
  cursor: pointer;
}

.send-email-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 348px;
  gap: 30px;
  margin-top: 20px;
}

.send-email-template-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  color: #1f2a3d;
  cursor: pointer;
}

.send-email-field {
  display: block;
  margin-top: 22px;
}

.send-email-field__head {
  margin-bottom: 10px;
}

.send-email-field__head strong {
  font-size: 0.95rem;
}

.send-email-field__head strong span {
  color: #ff5aac;
}

.send-email-field__head div {
  display: inline-flex;
  gap: 16px;
  color: #ff5aac;
  font-size: 0.84rem;
  font-weight: 700;
}

.send-email-field input,
.send-email-editor textarea {
  width: 100%;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  color: #1f2a3d;
}

.send-email-field input {
  height: 48px;
  padding: 0 14px;
}

.send-email-editor {
  margin-top: 22px;
}

.send-email-editor__toolbar {
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid #dbe3ef;
  border-bottom: 0;
  border-radius: 12px 12px 0 0;
  background: #fff;
}

.send-email-editor__tools {
  gap: 12px;
}

.send-email-editor__tools button,
.send-email-editor__insert,
.send-email-editor__expand {
  border: 0;
  background: transparent;
  color: #1f2a3d;
  cursor: pointer;
}

.send-email-editor__tools button:first-child {
  padding: 0;
  color: #445067;
}

.send-email-editor__tools span {
  width: 1px;
  height: 24px;
  background: #edf2f7;
}

.send-email-editor__actions {
  gap: 8px;
}

.send-email-editor__insert {
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
}

.send-email-editor__expand {
  width: 34px;
  height: 34px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
}

.send-email-editor textarea {
  min-height: 330px;
  padding: 18px 16px;
  border-radius: 0 0 12px 12px;
  resize: vertical;
  line-height: 1.7;
}

.send-email-editor__footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 4px 0;
}

.send-email-editor__footer span {
  color: #98a2b3;
  font-size: 0.76rem;
  font-weight: 700;
}

.send-email-side {
  min-width: 0;
}

.send-email-side__panel {
  padding: 22px 20px;
  border: 1px solid #ecf1f8;
  border-radius: 18px;
  background: #fff;
}

.send-email-side__panel + .send-email-side__panel {
  margin-top: 26px;
}

.send-email-side__title {
  gap: 8px;
  margin-bottom: 14px;
}

.send-email-side__title strong {
  font-size: 0.96rem;
}

.send-email-option-list {
  display: grid;
  gap: 12px;
}

.send-email-option {
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
}

.send-email-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.send-email-option__dot {
  width: 18px;
  height: 18px;
  border: 1px solid #cfd7e4;
  border-radius: 50%;
  background: #fff;
  flex: 0 0 18px;
}

.send-email-option input:checked + .send-email-option__dot {
  border-color: #ff5aac;
  box-shadow: inset 0 0 0 5px #ff5aac;
}

.send-email-option__copy strong,
.send-email-option__copy small {
  display: block;
}

.send-email-option__copy {
  min-width: 0;
}

.send-email-option__copy strong {
  font-size: 0.95rem;
  line-height: 1.25;
}

.send-email-option__copy small {
  margin-top: 3px;
  font-size: 0.86rem;
  line-height: 1.4;
}

.send-email-side__fields {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.send-email-side__field {
  display: block;
}

.send-email-side__field span {
  display: block;
  margin-bottom: 8px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.send-email-side__field button {
  width: 100%;
  min-height: 50px;
  padding: 0 12px;
  border: 1px solid #dbe3ef;
  border-radius: 12px;
  background: #fff;
  color: #1f2a3d;
  cursor: pointer;
}

.send-email-side__field button > div {
  gap: 10px;
}

.send-email-side__field strong {
  color: #1f2a3d;
  font-size: 0.92rem;
  font-weight: 500;
  line-height: 1.3;
  text-align: left;
}

.send-email-schedule-card {
  gap: 12px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #ffe1eb;
  border-radius: 14px;
  background: #fff8fb;
  align-items: flex-start;
}

.send-email-schedule-card__icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #ff5aac;
  background: #fff1f8;
  flex: 0 0 28px;
}

.send-email-schedule-card small,
.send-email-schedule-card strong,
.send-email-schedule-card span,
.send-email-schedule-card button {
  display: block;
}

.send-email-schedule-card strong {
  margin-top: 6px;
  color: #ff5aac;
  font-size: 0.94rem;
}

.send-email-schedule-card span {
  margin-top: 2px;
  font-size: 0.82rem;
}

.send-email-schedule-card button {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff5aac;
  cursor: pointer;
  font-size: 0.84rem;
  font-weight: 700;
}

.send-email-variable-stack {
  display: grid;
  gap: 8px;
}

.send-email-variable-stack button {
  width: 100%;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  background: #fafbfe;
  color: #445067;
  text-align: left;
  cursor: pointer;
}

.send-email-modal__footer {
  gap: 20px;
  padding: 18px 24px;
  border-top: 1px solid #edf2fb;
  background: #fff;
}

.send-email-attachments {
  min-width: 0;
  flex: 1 1 auto;
}

.send-email-attachments strong {
  display: block;
  margin-bottom: 10px;
  font-size: 0.92rem;
}

.send-email-attachments button {
  width: 100%;
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed #dbe3ef;
  border-radius: 14px;
  background: #fff;
  color: #ff5aac;
  cursor: pointer;
}

.send-email-button {
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

.send-email-button--ghost {
  color: #222657;
  border-color: #d9e2ee;
  background: #fff;
}

.send-email-button--primary {
  color: #fff;
  background: linear-gradient(90deg, #ff67ad 0%, #f15ea8 100%);
  box-shadow: 0 12px 24px rgba(241, 94, 168, 0.22);
}

.send-email-success {
  position: relative;
  padding: 38px 34px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.send-email-success__icon {
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: #eefbf3;
  color: #22b161;
}

.send-email-success p {
  margin: 10px 0 0;
}

.send-email-success__button {
  margin-top: 24px;
}

@media (max-width: 1180px) {
  .send-email-profile,
  .send-email-profile__stats,
  .send-email-modal__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .send-email-profile__stats {
    margin-left: 0;
  }

  .send-email-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .send-email-overlay {
    padding: 14px;
  }

  .send-email-modal,
  .send-email-success {
    max-height: calc(100vh - 28px);
    border-radius: 22px;
  }

  .send-email-modal__head,
  .send-email-modal__body,
  .send-email-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .send-email-profile__main,
  .send-email-modal__title,
  .send-email-modal__footer-actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (max-width: 620px) {
  .send-email-profile__stats button,
  .send-email-button,
  .send-email-modal__footer-actions,
  .send-email-button--ghost,
  .send-email-button--primary {
    width: 100%;
  }

  .send-email-editor__toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }

  .send-email-editor__tools,
  .send-email-editor__actions {
    flex-wrap: wrap;
  }
}
</style>
