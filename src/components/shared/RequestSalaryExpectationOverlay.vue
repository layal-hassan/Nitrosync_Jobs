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
    default: 'Ava Martinez',
  },
  candidateRole: {
    type: String,
    default: 'Product Designer',
  },
  candidateMatch: {
    type: String,
    default: '92% Match',
  },
  candidateAppliedOn: {
    type: String,
    default: '23 May 2025',
  },
})

const emit = defineEmits(['close'])

const flowState = ref('compose')
const sendVia = ref('email')
const templateName = ref('Salary Expectation Request')
const message = ref('')
const currency = ref('SEK (Swedish Krona)')
const payPeriod = ref('Monthly')
const employmentPreference = ref('Full-time')
const salaryMin = ref('50,000')
const salaryMax = ref('60,000')
const noticePeriod = ref('')
const comments = ref('')

const channelOptions = [
  { id: 'email', label: 'Email', note: 'Configured', icon: 'mail', configured: true },
  { id: 'sms', label: 'SMS', note: 'Not configured', icon: 'message', configured: false },
  { id: 'whatsapp', label: 'WhatsApp', note: 'Not configured', icon: 'phone', configured: false },
]

const automationItems = [
  'Notify me when candidate responds',
  'Flag if expectation is above budget',
  'Suggest next action after response',
]

const nextSteps = [
  'We send the salary request',
  'Candidate submits the information via secure form',
  'We analyze and notify you with salary fit insight',
  'Suggested next steps based on the response',
]

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function buildDefaultMessage() {
  return [
    `Hi ${props.candidateName.split(' ')[0] || 'there'},`,
    '',
    'Thank you for your application.',
    '',
    `Before moving forward, we'd like to understand your salary expectations for the ${props.candidateRole} role.`,
    '',
    'Please share your expected salary range and preferred employment setup.',
    '',
    'Best regards,',
    'Sophia Carter',
    'Talent Partner',
  ].join('\n')
}

function resetForm() {
  flowState.value = 'compose'
  sendVia.value = 'email'
  templateName.value = 'Salary Expectation Request'
  message.value = buildDefaultMessage()
  currency.value = 'SEK (Swedish Krona)'
  payPeriod.value = 'Monthly'
  employmentPreference.value = 'Full-time'
  salaryMin.value = '50,000'
  salaryMax.value = '60,000'
  noticePeriod.value = ''
  comments.value = ''
}

function closeOverlay() {
  emit('close')
}

function sendSalaryRequest() {
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
      class="salary-request-overlay"
      :class="{ 'is-success': flowState === 'success' }"
      @click.self="closeOverlay"
    >
      <section v-if="flowState === 'compose'" class="salary-request-modal">
        <header class="salary-request-modal__head">
          <div class="salary-request-modal__title">
            <span class="salary-request-modal__title-icon">
              <AppIcon name="wallet" :size="20" />
            </span>
            <div>
              <h2>Request Salary Expectation</h2>
              <p>Ask the candidate for their salary expectations</p>
            </div>
          </div>

          <button class="salary-request-modal__close" type="button" aria-label="Close salary request" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="salary-request-modal__body">
          <div class="salary-request-layout">
            <section class="salary-request-main">
              <article class="salary-request-profile">
                <div class="salary-request-profile__avatar">{{ candidateInitials }}</div>
                <div class="salary-request-profile__copy">
                  <strong>{{ candidateName }}</strong>
                  <span>{{ candidateRole }}</span>
                  <div class="salary-request-profile__meta">
                    <em>Applied</em>
                    <i></i>
                    <small>Applied on {{ candidateAppliedOn }}</small>
                    <i></i>
                    <b>{{ candidateMatch }}</b>
                  </div>
                </div>
              </article>

              <div class="salary-request-section">
                <h3>1. Send via</h3>
                <div class="salary-request-channel-grid">
                  <button
                    v-for="option in channelOptions"
                    :key="option.id"
                    class="salary-request-channel"
                    :class="{ 'is-active': sendVia === option.id }"
                    type="button"
                    @click="option.configured ? (sendVia = option.id) : null"
                  >
                    <div class="salary-request-channel__top">
                      <span class="salary-request-channel__label">
                        <AppIcon :name="option.icon" :size="16" />
                        <span>{{ option.label }}</span>
                      </span>
                      <AppIcon v-if="!option.configured" name="alert" :size="12" class="salary-request-channel__warning" />
                    </div>
                    <small>{{ option.note }}</small>
                  </button>
                </div>

                <div class="salary-request-channel-note">
                  <AppIcon name="info" :size="14" />
                  <span>SMS and WhatsApp are not configured. Go to Settings &gt; Communications to set them up.</span>
                </div>
              </div>

              <div class="salary-request-section">
                <h3>2. Message template</h3>
                <button class="salary-request-template" type="button">
                  <span>{{ templateName }}</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>

                <textarea v-model="message" class="salary-request-message" rows="11"></textarea>
              </div>

              <div class="salary-request-section">
                <h3>3. Information we'll collect from the candidate</h3>

                <div class="salary-request-fields">
                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="wallet" :size="13" />
                      <strong>Expected salary range</strong>
                      <em>*</em>
                    </div>
                    <div class="salary-request-range">
                      <label>
                        <small>Min</small>
                        <input v-model="salaryMin" type="text">
                      </label>
                      <span>-</span>
                      <label>
                        <small>Max</small>
                        <input v-model="salaryMax" type="text">
                      </label>
                    </div>
                  </article>

                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="wallet" :size="13" />
                      <strong>Currency</strong>
                      <em>*</em>
                    </div>
                    <label class="salary-request-select">
                      <select v-model="currency">
                        <option>SEK (Swedish Krona)</option>
                        <option>EUR (Euro)</option>
                        <option>USD (US Dollar)</option>
                      </select>
                    </label>
                  </article>

                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="calendar" :size="13" />
                      <strong>Pay period</strong>
                      <em>*</em>
                    </div>
                    <label class="salary-request-select">
                      <select v-model="payPeriod">
                        <option>Monthly</option>
                        <option>Yearly</option>
                        <option>Hourly</option>
                      </select>
                    </label>
                  </article>

                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="briefcase" :size="13" />
                      <strong>Employment preference</strong>
                      <em>*</em>
                    </div>
                    <label class="salary-request-select">
                      <select v-model="employmentPreference">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                    </label>
                  </article>

                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="calendar" :size="13" />
                      <strong>Notice period / earliest start date</strong>
                    </div>
                    <label class="salary-request-input">
                      <input v-model="noticePeriod" type="text" placeholder="Optional">
                    </label>
                  </article>

                  <article class="salary-request-field-card">
                    <div class="salary-request-field-card__label">
                      <AppIcon name="document" :size="13" />
                      <strong>Additional comments</strong>
                    </div>
                    <label class="salary-request-input">
                      <input v-model="comments" type="text" placeholder="Optional">
                    </label>
                  </article>
                </div>

                <div class="salary-request-footer-note">
                  <AppIcon name="lock" :size="14" />
                  <span>Candidate will submit this information securely via a simple form.</span>
                </div>
              </div>
            </section>

            <aside class="salary-request-side">
              <section class="salary-request-side__panel is-insight">
                <div class="salary-request-side__title">
                  <span class="salary-request-side__title-icon">
                    <AppIcon name="sparkles" :size="15" />
                  </span>
                  <strong>Nitro Insight</strong>
                </div>

                <div class="salary-request-side__metric">
                  <small>ROLE BUDGET RANGE</small>
                  <strong>50,000 - 62,000 SEK / month</strong>
                </div>

                <div class="salary-request-side__metric">
                  <small>MARKET RANGE (PRODUCT DESIGNER)</small>
                  <strong>48,000 - 58,000 SEK / month</strong>
                </div>

                <article class="salary-request-side__fit">
                  <div class="salary-request-side__fit-head">
                    <span>AI SALARY FIT PREDICTION</span>
                  </div>
                  <strong>Likely aligned</strong>
                  <p>Based on role budget, market data and candidate profile</p>
                </article>
              </section>

              <section class="salary-request-side__panel">
                <div class="salary-request-side__title">
                  <span class="salary-request-side__title-icon">
                    <AppIcon name="spark" :size="15" />
                  </span>
                  <strong>Automation</strong>
                </div>

                <div class="salary-request-side__checks">
                  <div v-for="item in automationItems" :key="item" class="salary-request-side__check">
                    <AppIcon name="check" :size="13" />
                    <span>{{ item }}</span>
                  </div>
                </div>

                <h4>What happens next?</h4>
                <div class="salary-request-side__steps">
                  <div v-for="step in nextSteps" :key="step" class="salary-request-side__step">
                    <span></span>
                    <p>{{ step }}</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="salary-request-modal__footer">
          <button class="salary-request-button salary-request-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="salary-request-button salary-request-button--primary" type="button" @click="sendSalaryRequest">
            <AppIcon name="alert" :size="14" />
            <span>Send Salary Request</span>
          </button>
        </footer>
      </section>

      <section v-else class="salary-request-success">
        <div class="salary-request-success__icon">
          <AppIcon name="checkCircle" :size="38" />
        </div>

        <h2>Salary Request Sent</h2>
        <p>The request has been sent to {{ candidateName }}. You'll be notified as soon as they provide their expectations.</p>

        <button class="salary-request-button salary-request-button--primary salary-request-success__button" type="button" @click="closeOverlay">
          Back to Pipeline
        </button>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.salary-request-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(17, 24, 39, 0.56);
  backdrop-filter: blur(5px);
}

.salary-request-overlay.is-success {
  background: rgba(190, 197, 207, 0.62);
  backdrop-filter: blur(7px);
}

.salary-request-modal,
.salary-request-success {
  width: min(100%, 1180px);
  max-height: calc(100vh - 48px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.26);
}

.salary-request-modal {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.salary-request-modal__head,
.salary-request-modal__title,
.salary-request-profile,
.salary-request-template,
.salary-request-channel,
.salary-request-modal__footer,
.salary-request-button,
.salary-request-side__title,
.salary-request-side__check,
.salary-request-success {
  display: flex;
  align-items: center;
}

.salary-request-modal__head,
.salary-request-modal__footer {
  justify-content: space-between;
}

.salary-request-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.salary-request-modal__title {
  gap: 14px;
}

.salary-request-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.salary-request-modal__title h2,
.salary-request-success h2 {
  margin: 0;
  color: #1f2940;
}

.salary-request-modal__title p,
.salary-request-side__fit p,
.salary-request-side__step p,
.salary-request-success p {
  margin: 4px 0 0;
  color: #738199;
}

.salary-request-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.salary-request-modal__body {
  overflow: auto;
  padding: 20px 24px;
}

.salary-request-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 22px;
}

.salary-request-main {
  min-width: 0;
}

.salary-request-profile {
  gap: 14px;
  padding: 16px;
  border: 1px solid #e9eef7;
  border-radius: 16px;
  background: #fbfcff;
}

.salary-request-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
  flex: 0 0 52px;
}

.salary-request-profile__copy strong,
.salary-request-section h3,
.salary-request-field-card__label strong,
.salary-request-side__title strong,
.salary-request-side__metric strong,
.salary-request-side__fit strong {
  color: #1f2940;
}

.salary-request-profile__copy strong {
  display: block;
  font-size: 1.02rem;
}

.salary-request-profile__copy span {
  display: block;
  margin-top: 3px;
  color: #738199;
}

.salary-request-profile__meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.salary-request-profile__meta em,
.salary-request-profile__meta b {
  font-style: normal;
  font-weight: 800;
  font-size: 0.78rem;
}

.salary-request-profile__meta em {
  color: #ff67b5;
}

.salary-request-profile__meta small {
  color: #8b97ab;
}

.salary-request-profile__meta i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cfd7e3;
}

.salary-request-profile__meta b {
  color: #21a45f;
}

.salary-request-section {
  margin-top: 16px;
}

.salary-request-section h3 {
  margin: 0 0 12px;
  font-size: 0.94rem;
}

.salary-request-channel-grid,
.salary-request-fields {
  display: grid;
  gap: 12px;
}

.salary-request-channel-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.salary-request-channel {
  display: grid;
  gap: 6px;
  min-height: 74px;
  padding: 14px;
  border: 1px solid #dde5f0;
  border-radius: 14px;
  background: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.salary-request-channel.is-active {
  border-color: #ff6db6;
  box-shadow: inset 0 0 0 1px #ff6db6;
}

.salary-request-channel__top,
.salary-request-channel__label {
  display: flex;
  align-items: center;
}

.salary-request-channel__top {
  justify-content: space-between;
  gap: 10px;
}

.salary-request-channel__label {
  gap: 8px;
  color: #44506b;
  font-weight: 700;
}

.salary-request-channel.is-active .salary-request-channel__label {
  color: #ff67b5;
}

.salary-request-channel small {
  color: #9aa5b7;
}

.salary-request-channel__warning {
  color: #ff9e43;
}

.salary-request-channel-note,
.salary-request-footer-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f7f9fc;
  color: #7b879d;
  font-size: 0.8rem;
}

.salary-request-template,
.salary-request-message,
.salary-request-select select,
.salary-request-input input,
.salary-request-range input {
  width: 100%;
  border: 1px solid #dde5f0;
  border-radius: 12px;
  background: #fff;
  color: #2b3550;
  font: inherit;
}

.salary-request-template {
  justify-content: space-between;
  min-height: 46px;
  padding: 0 16px;
  cursor: pointer;
}

.salary-request-message {
  min-height: 180px;
  margin-top: 10px;
  padding: 18px;
  resize: vertical;
  outline: 0;
  line-height: 1.7;
}

.salary-request-fields {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.salary-request-field-card {
  padding: 14px;
  border: 1px solid #e8edf6;
  border-radius: 14px;
  background: #fff;
}

.salary-request-field-card__label {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}

.salary-request-field-card__label :deep(svg) {
  color: #ff67b5;
}

.salary-request-field-card__label em {
  color: #ff67b5;
  font-style: normal;
  font-weight: 800;
}

.salary-request-range {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 8px;
  align-items: end;
}

.salary-request-range label,
.salary-request-select,
.salary-request-input {
  display: grid;
  gap: 6px;
}

.salary-request-range small {
  color: #97a3b8;
}

.salary-request-range input,
.salary-request-input input,
.salary-request-select select {
  min-height: 42px;
  padding: 0 12px;
  outline: 0;
}

.salary-request-side {
  display: grid;
  align-content: start;
  gap: 18px;
}

.salary-request-side__panel {
  padding: 18px;
  border: 1px solid #edf2fb;
  border-radius: 16px;
  background: #fff;
}

.salary-request-side__panel.is-insight {
  background: #fffaff;
  border-color: #ffd8eb;
}

.salary-request-side__title {
  gap: 8px;
}

.salary-request-side__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  color: #ff67b5;
  background: #fff1f8;
}

.salary-request-side__metric {
  margin-top: 18px;
}

.salary-request-side__metric small,
.salary-request-side__fit-head span {
  display: block;
  color: #8d98ab;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.salary-request-side__metric strong {
  display: block;
  margin-top: 6px;
  color: #ff67b5;
  font-size: 0.98rem;
  line-height: 1.45;
}

.salary-request-side__fit {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
}

.salary-request-side__fit strong {
  display: block;
  margin-top: 8px;
  color: #20a55f;
}

.salary-request-side__fit p {
  line-height: 1.5;
}

.salary-request-side__checks {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.salary-request-side__check {
  gap: 8px;
  color: #54627d;
}

.salary-request-side__check :deep(svg) {
  color: #ff67b5;
}

.salary-request-side h4 {
  margin: 18px 0 0;
  color: #1f2940;
  font-size: 0.92rem;
}

.salary-request-side__steps {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.salary-request-side__step {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
}

.salary-request-side__step span {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: #ff67b5;
}

.salary-request-side__step p {
  line-height: 1.45;
}

.salary-request-modal__footer {
  padding: 18px 24px 24px;
  border-top: 1px solid #edf2fb;
}

.salary-request-button {
  justify-content: center;
  gap: 8px;
  min-width: 132px;
  height: 42px;
  padding: 0 20px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.salary-request-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.salary-request-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

.salary-request-success {
  width: min(100%, 520px);
  max-height: none;
  padding: 34px 36px 32px;
  display: grid;
  gap: 18px;
  justify-items: center;
  text-align: center;
}

.salary-request-success__icon {
  display: grid;
  place-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #fff1f8;
  color: #f066b2;
}

.salary-request-success h2 {
  font-size: 1.1rem;
}

.salary-request-success p {
  max-width: 340px;
  line-height: 1.5;
}

.salary-request-success__button {
  width: 100%;
  max-width: 416px;
  height: 46px;
  border-radius: 999px;
}

@media (max-width: 1080px) {
  .salary-request-layout,
  .salary-request-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .salary-request-overlay {
    padding: 12px;
  }

  .salary-request-modal,
  .salary-request-success {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .salary-request-modal__body,
  .salary-request-modal__head,
  .salary-request-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .salary-request-modal__head,
  .salary-request-modal__footer {
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .salary-request-channel-grid {
    grid-template-columns: 1fr;
  }

  .salary-request-button {
    width: 100%;
  }
}
</style>
