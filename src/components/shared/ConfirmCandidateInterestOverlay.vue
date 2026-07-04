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
const templateName = ref('Interest Confirmation')
const message = ref('')
const moveToQualified = ref(true)
const notifyIfNoResponse = ref(true)
const notifyAfter = ref('3 days')

const responseButtons = [
  { label: "Yes, I'm Interested", tone: 'green', icon: 'check' },
  { label: "I'd Like More Information", tone: 'orange', icon: 'info' },
  { label: 'Not Interested', tone: 'red', icon: 'close' },
]

const deliveryOptions = [
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'sms', label: 'SMS', icon: 'message' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'phone' },
]

const howItWorksSteps = [
  { title: 'You send', copy: "We'll send the email to Ava Martinez", tone: 'pink', icon: 'mail' },
  { title: 'Candidate clicks', copy: 'Ava will respond using the buttons in the email', tone: 'green', icon: 'cursor' },
  { title: 'Status updated', copy: "We'll update the candidate status automatically", tone: 'blue', icon: 'refresh' },
  { title: "You're notified", copy: "We'll notify you of the response", tone: 'pink', icon: 'bell' },
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
    `Before moving forward, we'd like to confirm that you're still interested in the ${props.candidateRole} opportunity.`,
    '',
    'Please select one of the options below.',
    '',
    'Best regards,',
    'Sophia Carter',
    'Talent Partner',
  ].join('\n')
}

function resetForm() {
  flowState.value = 'compose'
  sendVia.value = 'email'
  templateName.value = 'Interest Confirmation'
  message.value = buildDefaultMessage()
  moveToQualified.value = true
  notifyIfNoResponse.value = true
  notifyAfter.value = '3 days'
}

function closeOverlay() {
  emit('close')
}

function sendConfirmation() {
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
      class="confirm-interest-overlay"
      :class="{ 'is-success': flowState === 'success' }"
      @click.self="closeOverlay"
    >
      <section v-if="flowState === 'compose'" class="confirm-interest-modal">
        <header class="confirm-interest-modal__head">
          <div class="confirm-interest-modal__title">
            <span class="confirm-interest-modal__title-icon">
              <AppIcon name="mail" :size="22" />
            </span>
            <div>
              <h2>Confirm Candidate Interest</h2>
              <p>Check if the candidate is still interested in this opportunity</p>
            </div>
          </div>

          <button class="confirm-interest-modal__close" type="button" aria-label="Close confirm interest" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="confirm-interest-modal__body">
          <div class="confirm-interest-layout">
            <section class="confirm-interest-main">
              <article class="confirm-interest-profile">
                <div class="confirm-interest-profile__avatar">{{ candidateInitials }}</div>
                <div class="confirm-interest-profile__copy">
                  <strong>{{ candidateName }}</strong>
                  <span>{{ candidateRole }}</span>
                  <div class="confirm-interest-profile__meta">
                    <em>APPLIED</em>
                    <i></i>
                    <small>Applied on {{ candidateAppliedOn }}</small>
                    <i></i>
                    <b>{{ candidateMatch }}</b>
                  </div>
                </div>
              </article>

              <div class="confirm-interest-section">
                <h3>1. Send via</h3>
                <div class="confirm-interest-channel-grid">
                  <button
                    v-for="option in deliveryOptions"
                    :key="option.id"
                    class="confirm-interest-channel"
                    :class="{ 'is-active': sendVia === option.id }"
                    type="button"
                    @click="sendVia = option.id"
                  >
                    <AppIcon :name="option.icon" :size="18" />
                    <span>{{ option.label }}</span>
                  </button>
                </div>
              </div>

              <div class="confirm-interest-section">
                <h3>2. Message template</h3>
                <button class="confirm-interest-template" type="button">
                  <span>{{ templateName }}</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>

                <div class="confirm-interest-editor">
                  <textarea v-model="message" rows="12"></textarea>
                </div>
              </div>

              <div class="confirm-interest-section">
                <h3>3. Candidate response buttons <span>(shown in email)</span></h3>
                <div class="confirm-interest-response-grid">
                  <button
                    v-for="item in responseButtons"
                    :key="item.label"
                    class="confirm-interest-response"
                    :class="`is-${item.tone}`"
                    type="button"
                  >
                    <AppIcon :name="item.icon" :size="14" />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </div>

              <div class="confirm-interest-section">
                <h3>4. Automation</h3>

                <label class="confirm-interest-check">
                  <input v-model="moveToQualified" type="checkbox">
                  <span class="confirm-interest-check__box"><AppIcon name="check" :size="13" /></span>
                  <span>Move to "Qualified" if candidate selects "Yes, I'm Interested"</span>
                  <AppIcon name="info" :size="14" />
                </label>

                <label class="confirm-interest-check">
                  <input v-model="notifyIfNoResponse" type="checkbox">
                  <span class="confirm-interest-check__box"><AppIcon name="check" :size="13" /></span>
                  <span>Notify me if no response after</span>
                  <button class="confirm-interest-delay" type="button">{{ notifyAfter }}</button>
                </label>
              </div>
            </section>

            <aside class="confirm-interest-side">
              <section class="confirm-interest-side__panel is-insight">
                <div class="confirm-interest-side__title">
                  <span class="confirm-interest-side__title-icon">
                    <AppIcon name="sparkles" :size="15" />
                  </span>
                  <strong>Nitro Insight</strong>
                </div>

                <div class="confirm-interest-insight">
                  <small>RESPONSE PROBABILITY</small>
                  <strong>94%</strong>
                  <div class="confirm-interest-insight__bar">
                    <span />
                  </div>
                </div>

                <div class="confirm-interest-insight">
                  <small>BEST SEND TIME</small>
                  <strong>Today, 09:00 AM</strong>
                </div>

                <div class="confirm-interest-side__note">
                  <AppIcon name="trend-up" :size="15" />
                  <span>Based on candidate activity and engagement data</span>
                </div>
              </section>

              <section class="confirm-interest-side__panel">
                <div class="confirm-interest-side__title">
                  <strong>How it works</strong>
                </div>

                <div class="confirm-interest-steps">
                  <article v-for="step in howItWorksSteps" :key="step.title" class="confirm-interest-step">
                    <span class="confirm-interest-step__icon" :class="`is-${step.tone}`">
                      <AppIcon :name="step.icon" :size="14" />
                    </span>
                    <div>
                      <strong>{{ step.title }}</strong>
                      <p>{{ step.copy }}</p>
                    </div>
                  </article>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <footer class="confirm-interest-modal__footer">
          <button class="confirm-interest-button confirm-interest-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="confirm-interest-button confirm-interest-button--primary" type="button" @click="sendConfirmation">
            <AppIcon name="alert" :size="15" />
            <span>Send Confirmation</span>
          </button>
        </footer>
      </section>

      <section v-else class="confirm-interest-success">
        <button class="confirm-interest-success__close" type="button" aria-label="Close confirmation sent" @click="closeOverlay">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="confirm-interest-success__icon">
          <AppIcon name="checkCircle" :size="36" />
        </div>

        <h2>Confirmation Sent</h2>
        <p>The interest confirmation email has been sent to {{ candidateName }}.</p>

        <div class="confirm-interest-success__hint">
          <AppIcon name="sparkles" :size="14" />
          <span>NitroSync AI will notify you once she responds.</span>
        </div>

        <button class="confirm-interest-button confirm-interest-button--primary confirm-interest-success__button" type="button" @click="closeOverlay">
          <span>Back to Pipeline</span>
          <AppIcon name="chevronRight" :size="15" />
        </button>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-interest-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(3px);
}

.confirm-interest-overlay.is-success {
  background: rgba(215, 221, 229, 0.66);
  backdrop-filter: blur(6px);
}

.confirm-interest-modal,
.confirm-interest-success {
  width: min(100%, 1120px);
  max-height: calc(100vh - 48px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.3);
}

.confirm-interest-modal {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
}

.confirm-interest-modal__head,
.confirm-interest-modal__title,
.confirm-interest-profile,
.confirm-interest-channel,
.confirm-interest-template,
.confirm-interest-check,
.confirm-interest-modal__footer,
.confirm-interest-button,
.confirm-interest-side__title,
.confirm-interest-side__note,
.confirm-interest-step,
.confirm-interest-success,
.confirm-interest-success__hint {
  display: flex;
  align-items: center;
}

.confirm-interest-modal__head,
.confirm-interest-modal__footer {
  justify-content: space-between;
}

.confirm-interest-modal__head {
  padding: 22px 28px;
  border-bottom: 1px solid #edf2fb;
}

.confirm-interest-modal__title {
  gap: 16px;
}

.confirm-interest-modal__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff1f8;
  color: #ff66b4;
}

.confirm-interest-modal__title h2,
.confirm-interest-success h2 {
  margin: 0;
  color: #1f2940;
}

.confirm-interest-modal__title p,
.confirm-interest-step p,
.confirm-interest-success p {
  margin: 4px 0 0;
  color: #738199;
}

.confirm-interest-modal__close,
.confirm-interest-success__close {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.confirm-interest-modal__body {
  overflow: auto;
  padding: 24px 28px;
}

.confirm-interest-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
}

.confirm-interest-main {
  min-width: 0;
}

.confirm-interest-profile {
  gap: 14px;
  padding: 18px;
  border: 1px solid #e9eef7;
  border-radius: 18px;
  background: #fff;
}

.confirm-interest-profile__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
  flex: 0 0 64px;
}

.confirm-interest-profile__copy strong,
.confirm-interest-section h3,
.confirm-interest-insight strong,
.confirm-interest-step strong,
.confirm-interest-side__title strong,
.confirm-interest-success__hint span {
  color: #1f2940;
}

.confirm-interest-profile__copy strong {
  display: block;
  font-size: 1.05rem;
}

.confirm-interest-profile__copy span {
  display: block;
  margin-top: 3px;
  color: #738199;
}

.confirm-interest-profile__meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.confirm-interest-profile__meta em,
.confirm-interest-profile__meta b {
  font-style: normal;
  font-size: 0.8rem;
  font-weight: 800;
}

.confirm-interest-profile__meta em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: #eef4ff;
  color: #4f7fff;
}

.confirm-interest-profile__meta small {
  color: #8a97ad;
}

.confirm-interest-profile__meta i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ccd4e1;
}

.confirm-interest-profile__meta b {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: #e7f8ee;
  color: #21a45f;
}

.confirm-interest-section {
  margin-top: 16px;
}

.confirm-interest-section h3 {
  margin: 0 0 12px;
  font-size: 0.98rem;
}

.confirm-interest-section h3 span {
  color: #97a3b8;
  font-weight: 600;
}

.confirm-interest-channel-grid,
.confirm-interest-response-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.confirm-interest-channel {
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
  background: #fff;
  color: #44506b;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.confirm-interest-channel.is-active {
  border-color: #ff71ba;
  box-shadow: inset 0 0 0 1px #ff71ba;
  color: #ff67b5;
}

.confirm-interest-template,
.confirm-interest-editor textarea {
  width: 100%;
  border: 1px solid #dde5f1;
  border-radius: 14px;
  background: #fff;
  color: #2b3550;
  font: inherit;
}

.confirm-interest-template {
  justify-content: space-between;
  min-height: 46px;
  padding: 0 16px;
  cursor: pointer;
}

.confirm-interest-editor textarea {
  min-height: 270px;
  padding: 18px 22px;
  resize: vertical;
  outline: 0;
  line-height: 1.7;
}

.confirm-interest-response {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.confirm-interest-response.is-green {
  border: 1px solid #bfe8cd;
  background: #effcf4;
  color: #17924d;
}

.confirm-interest-response.is-orange {
  border: 1px solid #ffd3ab;
  background: #fff7ed;
  color: #df6a0d;
}

.confirm-interest-response.is-red {
  border: 1px solid #ffc7c7;
  background: #fff3f3;
  color: #dd4040;
}

.confirm-interest-check {
  gap: 10px;
  margin-top: 12px;
  color: #354158;
  cursor: pointer;
}

.confirm-interest-check input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.confirm-interest-check__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid #f2a5cd;
  border-radius: 7px;
  background: #fff;
  color: transparent;
  flex: 0 0 22px;
}

.confirm-interest-check input:checked + .confirm-interest-check__box {
  border-color: #ff69b6;
  background: #ff69b6;
  color: #fff;
}

.confirm-interest-delay {
  min-height: 28px;
  padding: 0 12px;
  border: 1px solid #dce4ef;
  border-radius: 8px;
  background: #fff;
  color: #46546e;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.confirm-interest-side {
  display: grid;
  align-content: start;
  gap: 22px;
}

.confirm-interest-side__panel {
  padding: 24px;
  border: 1px solid #edf2fb;
  border-radius: 18px;
  background: #fff;
}

.confirm-interest-side__panel.is-insight {
  border-color: #ffd8eb;
  background: #fffaff;
}

.confirm-interest-side__title {
  gap: 10px;
}

.confirm-interest-side__title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #fff1f8;
  color: #ff67b5;
}

.confirm-interest-insight {
  margin-top: 20px;
}

.confirm-interest-insight small {
  display: block;
  color: #7e8aa1;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.confirm-interest-insight strong {
  display: block;
  margin-top: 6px;
  font-size: 1.9rem;
}

.confirm-interest-insight__bar {
  height: 4px;
  margin-top: 14px;
  border-radius: 999px;
  background: #e8e3e8;
  overflow: hidden;
}

.confirm-interest-insight__bar span {
  display: block;
  width: 94%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff67b5 0%, #f05baa 100%);
}

.confirm-interest-side__note {
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px dashed #f0d6e5;
  color: #5e6a84;
}

.confirm-interest-steps {
  display: grid;
  gap: 18px;
  margin-top: 20px;
}

.confirm-interest-step {
  align-items: flex-start;
  gap: 12px;
}

.confirm-interest-step__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex: 0 0 26px;
}

.confirm-interest-step__icon.is-pink {
  background: #fff1f8;
  color: #ff67b5;
}

.confirm-interest-step__icon.is-green {
  background: #eafbf0;
  color: #22b161;
}

.confirm-interest-step__icon.is-blue {
  background: #eef4ff;
  color: #5a7fff;
}

.confirm-interest-step div {
  position: relative;
}

.confirm-interest-step:not(:last-child) div::after {
  content: '';
  position: absolute;
  left: -25px;
  top: 28px;
  width: 1px;
  height: calc(100% + 8px);
  border-left: 1px dashed #dde5f1;
}

.confirm-interest-step p {
  line-height: 1.45;
}

.confirm-interest-modal__footer {
  padding: 18px 28px 24px;
  border-top: 1px solid #edf2fb;
}

.confirm-interest-button {
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

.confirm-interest-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #42506d;
}

.confirm-interest-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.2);
}

.confirm-interest-success {
  position: relative;
  width: min(100%, 480px);
  max-height: none;
  padding: 22px 30px 32px;
  display: grid;
  gap: 18px;
  justify-items: center;
  text-align: center;
}

.confirm-interest-success__close {
  position: absolute;
  top: 14px;
  right: 14px;
}

.confirm-interest-success__icon {
  margin-top: 18px;
  color: #f066b2;
}

.confirm-interest-success h2 {
  font-size: 1.1rem;
}

.confirm-interest-success p {
  max-width: 290px;
  line-height: 1.45;
}

.confirm-interest-success__hint {
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #f7c8e1;
  border-radius: 10px;
  background: #fffafd;
  color: #6a5362;
}

.confirm-interest-success__hint :deep(svg) {
  color: #d84895;
}

.confirm-interest-success__button {
  width: 100%;
}

@media (max-width: 980px) {
  .confirm-interest-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .confirm-interest-overlay {
    padding: 12px;
  }

  .confirm-interest-modal,
  .confirm-interest-success {
    width: 100%;
    max-height: calc(100vh - 24px);
    border-radius: 20px;
  }

  .confirm-interest-modal__body,
  .confirm-interest-modal__head,
  .confirm-interest-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .confirm-interest-channel-grid,
  .confirm-interest-response-grid {
    grid-template-columns: 1fr;
  }

  .confirm-interest-modal__head,
  .confirm-interest-modal__footer,
  .confirm-interest-profile {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .confirm-interest-button {
    width: 100%;
  }
}
</style>
