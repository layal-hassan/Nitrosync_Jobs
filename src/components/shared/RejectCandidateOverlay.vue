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
    default: 'Sophia Martinez',
  },
  candidateRole: {
    type: String,
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Technical Interview',
  },
  candidateAppliedOn: {
    type: String,
    default: 'May 08, 2024',
  },
})

const emit = defineEmits(['close'])

const rejectionReason = ref('Not enough experience')
const sendEmail = ref(true)
const disposition = ref('talent-pool')
const successOpen = ref(false)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const candidateFirstName = computed(() => props.candidateName.split(' ')[0] ?? props.candidateName)
const dispositionLabel = computed(() => (
  disposition.value === 'talent-pool'
    ? 'Moved to Talent Pool'
    : 'Rejected Permanently'
))
const communicationLabel = computed(() => (
  sendEmail.value
    ? 'Rejection email sent'
    : 'No email sent'
))

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    rejectionReason.value = 'Not enough experience'
    sendEmail.value = true
    disposition.value = 'talent-pool'
    successOpen.value = false
  }
})

function closeOverlay() {
  emit('close')
}

function submitRejection() {
  successOpen.value = true
}

function finishFlow() {
  successOpen.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="reject-candidate-overlay" @click.self="closeOverlay">
      <section v-if="!successOpen" class="reject-candidate-modal">
        <header class="reject-candidate-modal__head">
          <div class="reject-candidate-modal__title">
            <span class="reject-candidate-modal__title-icon">
              <AppIcon name="close" :size="18" />
            </span>
            <div>
              <h2>Reject Candidate</h2>
              <p>Move {{ candidateName }} to Rejected.</p>
            </div>
          </div>

          <button class="reject-candidate-modal__close" type="button" aria-label="Close Reject Candidate" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="reject-candidate-modal__body">
          <section class="reject-candidate-summary">
            <div class="reject-candidate-summary__profile">
              <span class="reject-candidate-summary__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <small>{{ candidateRole }}</small>
              </div>
            </div>

            <div class="reject-candidate-summary__meta">
              <article>
                <small>Current stage</small>
                <strong>{{ candidateStage }}</strong>
              </article>
              <article>
                <small>Applied on</small>
                <strong>{{ candidateAppliedOn }}</strong>
              </article>
            </div>
          </section>

          <section class="reject-candidate-field">
            <label>Rejection Reason <span>*</span></label>
            <button class="reject-candidate-select" type="button">
              <span><AppIcon name="close" :size="14" /> {{ rejectionReason }}</span>
              <AppIcon name="chevronDown" :size="16" />
            </button>
          </section>

          <section class="reject-candidate-field">
            <div class="reject-candidate-field__head">
              <label>Email Message</label>
              <button type="button">Select Email Template</button>
            </div>

            <div class="reject-candidate-editor">
              <div class="reject-candidate-editor__toolbar">
                <div>
                  <button type="button">B</button>
                  <button type="button">I</button>
                  <button type="button">List</button>
                </div>
                <button type="button">Insert Variable</button>
              </div>

              <textarea>Hi {{ candidateFirstName }},&#10;&#10;Thank you for taking the time to interview with us for the {{ candidateRole }} position. After careful consideration, we have decided not to move forward at this time.&#10;&#10;We appreciate your interest and wish you success in your search.</textarea>
            </div>
          </section>

          <section class="reject-candidate-field">
            <label>Candidate Communication</label>

            <button class="reject-candidate-radio-card is-pink" :class="{ 'is-active': sendEmail }" type="button" @click="sendEmail = true">
              <span class="reject-candidate-radio" :class="{ 'is-active': sendEmail }" />
              <span class="reject-candidate-radio-card__icon is-pink">
                <AppIcon name="mail" :size="15" />
              </span>
              <div>
                <strong>Send rejection email to candidate</strong>
                <small>They will receive an email about this decision.</small>
              </div>
            </button>

            <button class="reject-candidate-radio-card" :class="{ 'is-active': !sendEmail }" type="button" @click="sendEmail = false">
              <span class="reject-candidate-radio" :class="{ 'is-active': !sendEmail }" />
              <span class="reject-candidate-radio-card__icon">
                <AppIcon name="mail" :size="15" />
              </span>
              <div>
                <strong>Don't send email</strong>
                <small>You can contact the candidate manually.</small>
              </div>
            </button>
          </section>

          <section class="reject-candidate-field">
            <label>Keep Candidate?</label>

            <div class="reject-candidate-disposition-grid">
              <button class="reject-candidate-disposition-card" :class="{ 'is-active': disposition === 'reject' }" type="button" @click="disposition = 'reject'">
                <span class="reject-candidate-radio" :class="{ 'is-active': disposition === 'reject' }" />
                <span class="reject-candidate-radio-card__icon">
                  <AppIcon name="close" :size="15" />
                </span>
                <div>
                  <strong>Reject Permanently</strong>
                  <small>Remove from pipeline and do not keep for future roles.</small>
                </div>
              </button>

              <button class="reject-candidate-disposition-card is-pink" :class="{ 'is-active': disposition === 'talent-pool' }" type="button" @click="disposition = 'talent-pool'">
                <span class="reject-candidate-radio" :class="{ 'is-active': disposition === 'talent-pool' }" />
                <span class="reject-candidate-radio-card__icon is-pink">
                  <AppIcon name="archive" :size="15" />
                </span>
                <div>
                  <strong>Move to Talent Pool</strong>
                  <small>Keep this candidate for future opportunities.</small>
                </div>
              </button>
            </div>

            <div v-if="disposition === 'talent-pool'" class="reject-candidate-pool">
              <small>Talent Pool</small>
              <button type="button">
                <span>Future Opportunities</span>
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>
          </section>

          <section class="reject-candidate-ai-box">
            <small>AI Recommendation</small>
            <div class="reject-candidate-ai-box__grid">
              <article>
                <AppIcon name="message" :size="15" />
                <span>Strong interview feedback</span>
              </article>
              <article>
                <AppIcon name="star" :size="15" />
                <span>Score 4.2 / 5</span>
              </article>
              <article>
                <AppIcon name="archive" :size="15" />
                <span>Recommended action<br>Move to Talent Pool</span>
              </article>
            </div>
            <p>This candidate could be a great fit for other roles.</p>
          </section>
        </div>

        <footer class="reject-candidate-modal__footer">
          <button class="reject-candidate-button reject-candidate-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="reject-candidate-button reject-candidate-button--primary" type="button" @click="submitRejection">Reject Candidate</button>
        </footer>
      </section>

      <section v-else class="reject-candidate-success">
        <button class="reject-candidate-modal__close reject-candidate-success__close" type="button" aria-label="Close Reject Candidate Success" @click="finishFlow">
          <AppIcon name="close" :size="18" />
        </button>

        <div class="reject-candidate-success__hero">
          <span class="reject-candidate-success__spark reject-candidate-success__spark--left" />
          <span class="reject-candidate-success__spark reject-candidate-success__spark--right" />
          <span class="reject-candidate-success__spark reject-candidate-success__spark--bottom" />
          <span class="reject-candidate-success__check">
            <AppIcon name="check" :size="28" />
          </span>
        </div>

        <h2>Candidate rejected successfully!</h2>
        <p>{{ candidateName }} has been moved to the <span>Rejected</span> stage and her profile is now organized according to your selections.</p>

        <article class="reject-candidate-success__summary">
          <div>
            <span><AppIcon name="user" :size="16" /></span>
            <div class="reject-candidate-success__summary-copy">
              <strong>Candidate</strong>
              <em>{{ candidateName }}</em>
            </div>
          </div>
          <div>
            <span><AppIcon name="briefcase" :size="16" /></span>
            <div class="reject-candidate-success__summary-copy">
              <strong>Position</strong>
              <em>{{ candidateRole }}</em>
            </div>
          </div>
          <div>
            <span><AppIcon name="close" :size="16" /></span>
            <div class="reject-candidate-success__summary-copy">
              <strong>Rejection Reason</strong>
              <em>{{ rejectionReason }}</em>
            </div>
          </div>
          <div>
            <span><AppIcon name="archive" :size="16" /></span>
            <div class="reject-candidate-success__summary-copy">
              <strong>Disposition</strong>
              <em>{{ dispositionLabel }}</em>
            </div>
          </div>
          <div>
            <span><AppIcon name="mail" :size="16" /></span>
            <div class="reject-candidate-success__summary-copy">
              <strong>Communication</strong>
              <em>{{ communicationLabel }}</em>
            </div>
          </div>
        </article>

        <div class="reject-candidate-success__actions">
          <button class="reject-candidate-button reject-candidate-button--ghost" type="button" @click="finishFlow">{{ disposition === 'talent-pool' ? 'View Talent Pool' : 'Back to Pipeline' }}</button>
          <button class="reject-candidate-button reject-candidate-button--primary" type="button" @click="finishFlow">Done</button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.reject-candidate-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(32, 35, 47, 0.56);
  backdrop-filter: blur(5px);
}

.reject-candidate-modal,
.reject-candidate-success {
  width: min(100%, 720px);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 36px 90px rgba(15, 23, 42, 0.26);
}

.reject-candidate-modal {
  max-height: calc(100vh - 48px);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}

.reject-candidate-modal__head,
.reject-candidate-modal__title,
.reject-candidate-summary,
.reject-candidate-summary__profile,
.reject-candidate-summary__meta,
.reject-candidate-field__head,
.reject-candidate-select,
.reject-candidate-editor__toolbar,
.reject-candidate-editor__toolbar > div,
.reject-candidate-radio-card,
.reject-candidate-disposition-grid,
.reject-candidate-disposition-card,
.reject-candidate-pool button,
.reject-candidate-ai-box__grid,
.reject-candidate-modal__footer,
.reject-candidate-button,
.reject-candidate-success__actions,
.reject-candidate-success__summary div {
  display: flex;
  align-items: center;
}

.reject-candidate-modal__head,
.reject-candidate-modal__footer,
.reject-candidate-field__head,
.reject-candidate-select,
.reject-candidate-pool button {
  justify-content: space-between;
}

.reject-candidate-modal__head {
  padding: 18px 20px;
}

.reject-candidate-modal__title {
  gap: 14px;
}

.reject-candidate-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.reject-candidate-modal__title h2,
.reject-candidate-field label,
.reject-candidate-summary__profile strong,
.reject-candidate-radio-card strong,
.reject-candidate-disposition-card strong,
.reject-candidate-success h2 {
  margin: 0;
  color: #1f2940;
}

.reject-candidate-modal__title p,
.reject-candidate-summary__profile small,
.reject-candidate-summary__meta small,
.reject-candidate-summary__meta strong,
.reject-candidate-radio-card small,
.reject-candidate-disposition-card small,
.reject-candidate-ai-box p,
.reject-candidate-success p {
  margin: 0;
  color: #738199;
}

.reject-candidate-summary__profile strong {
  font-size: 1.02rem;
}

.reject-candidate-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.reject-candidate-modal__body {
  overflow: auto;
  padding: 0 20px 20px;
}

.reject-candidate-summary {
  gap: 18px;
  padding: 16px;
  border: 1px solid #dde6f2;
  border-radius: 16px;
  background: #fff;
}

.reject-candidate-summary__profile {
  gap: 14px;
  flex: 1;
}

.reject-candidate-summary__avatar {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f3f6fb 0%, #dfe8f5 100%);
  color: #7083a4;
  font-size: 1.1rem;
  font-weight: 800;
}

.reject-candidate-summary__meta {
  gap: 26px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.reject-candidate-summary__meta article small,
.reject-candidate-summary__meta article strong {
  display: block;
}

.reject-candidate-field {
  margin-top: 18px;
}

.reject-candidate-field label {
  display: block;
  margin-bottom: 10px;
  font-size: 0.9rem;
  font-weight: 700;
}

.reject-candidate-field label span {
  color: #ff67b5;
}

.reject-candidate-select,
.reject-candidate-pool button {
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #4a5671;
}

.reject-candidate-select span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.reject-candidate-field__head button {
  border: 0;
  background: transparent;
  color: #ff67b5;
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.reject-candidate-editor {
  border: 1px solid #dce5f2;
  border-radius: 14px;
  overflow: hidden;
}

.reject-candidate-editor__toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #edf2fb;
}

.reject-candidate-editor__toolbar > div {
  gap: 8px;
}

.reject-candidate-editor__toolbar button {
  min-height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #41506c;
  font: inherit;
  cursor: pointer;
}

.reject-candidate-editor textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 0;
  resize: vertical;
  color: #1f2940;
  font: inherit;
  line-height: 1.7;
}

.reject-candidate-radio-card,
.reject-candidate-disposition-card {
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #dce5f2;
  border-radius: 14px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.reject-candidate-radio-card + .reject-candidate-radio-card {
  margin-top: 10px;
}

.reject-candidate-radio {
  width: 18px;
  height: 18px;
  display: inline-flex;
  flex: 0 0 18px;
  border: 2px solid #cfd8e6;
  border-radius: 50%;
}

.reject-candidate-radio.is-active {
  border-color: #ff67b5;
  box-shadow: inset 0 0 0 4px #ff67b5;
}

.reject-candidate-radio-card__icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  border-radius: 10px;
  background: #f5f8fe;
  color: #8a97ab;
}

.reject-candidate-radio-card__icon.is-pink {
  background: #fff1f8;
  color: #ff67b5;
}

.reject-candidate-radio-card.is-active,
.reject-candidate-disposition-card.is-active {
  border-color: #ff8bc7;
  box-shadow: 0 10px 24px rgba(255, 95, 170, 0.08);
}

.reject-candidate-radio-card.is-active.is-pink,
.reject-candidate-disposition-card.is-active.is-pink {
  background: #fff8fc;
}

.reject-candidate-disposition-grid {
  gap: 12px;
  align-items: stretch;
}

.reject-candidate-disposition-card.is-active.is-pink {
  border-color: #ff67b5;
  background: #fff8fc;
}

.reject-candidate-pool {
  margin-top: 14px;
}

.reject-candidate-pool small {
  display: block;
  margin-bottom: 8px;
  color: #94a1b8;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
}

.reject-candidate-ai-box {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #e5ebfb;
  border-radius: 16px;
  background: #fbfcff;
}

.reject-candidate-ai-box small {
  display: block;
  color: #ff67b5;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.reject-candidate-ai-box__grid {
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.reject-candidate-ai-box__grid article {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #edf2fb;
  color: #2f3952;
}

.reject-candidate-ai-box p {
  margin-top: 12px;
}

.reject-candidate-modal__footer {
  padding: 10px 20px 18px;
}

.reject-candidate-button {
  justify-content: center;
  min-width: 136px;
  height: 40px;
  padding: 0 18px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.reject-candidate-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #2e3952;
}

.reject-candidate-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

.reject-candidate-success {
  position: relative;
  width: min(100%, 560px);
  padding: 24px 30px 30px;
  text-align: center;
}

.reject-candidate-success__close {
  position: absolute;
  top: 16px;
  right: 16px;
}

.reject-candidate-success__hero {
  display: grid;
  place-items: center;
  position: relative;
}

.reject-candidate-success__check {
  width: 76px;
  height: 76px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f062ad;
  color: #fff;
  box-shadow: 0 0 0 10px #fff2f8;
}

.reject-candidate-success__spark {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f6aacd;
}

.reject-candidate-success__spark--left {
  top: 8px;
  left: calc(50% - 54px);
}

.reject-candidate-success__spark--right {
  top: 30px;
  right: calc(50% - 60px);
  background: #d4d7df;
}

.reject-candidate-success__spark--bottom {
  top: 92px;
  right: calc(50% - 42px);
}

.reject-candidate-success h2 {
  margin-top: 34px;
  font-size: 1.35rem;
}

.reject-candidate-success p {
  max-width: 360px;
  margin: 14px auto 0;
  line-height: 1.55;
  font-size: 0.98rem;
}

.reject-candidate-success p span {
  color: #f062ad;
}

.reject-candidate-success__summary {
  display: grid;
  gap: 12px;
  margin-top: 22px;
  padding: 18px;
  border: 1px solid #e6ecf5;
  border-radius: 14px;
  text-align: left;
  background: #fff;
}

.reject-candidate-success__summary div {
  gap: 12px;
  align-items: center;
}

.reject-candidate-success__summary div + div {
  padding-top: 12px;
  border-top: 1px solid #edf2f8;
}

.reject-candidate-success__summary span {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f7f8fc;
  color: #7083a4;
}

.reject-candidate-success__summary-copy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
}

.reject-candidate-success__summary strong {
  color: #738199;
  font-weight: 600;
}

.reject-candidate-success__summary em {
  color: #1f2940;
  font-style: normal;
  font-weight: 700;
  text-align: right;
}

.reject-candidate-success__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 22px;
}

@media (max-width: 860px) {
  .reject-candidate-summary,
  .reject-candidate-summary__meta,
  .reject-candidate-disposition-grid,
  .reject-candidate-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .reject-candidate-ai-box__grid {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 720px) {
  .reject-candidate-overlay {
    padding: 12px;
  }

  .reject-candidate-modal,
  .reject-candidate-success {
    border-radius: 18px;
  }

  .reject-candidate-modal__head,
  .reject-candidate-modal__body,
  .reject-candidate-modal__footer,
  .reject-candidate-success {
    padding-left: 18px;
    padding-right: 18px;
  }

  .reject-candidate-button {
    width: 100%;
  }

  .reject-candidate-success__summary-copy {
    flex-direction: column;
    align-items: flex-start;
  }

  .reject-candidate-success__summary em {
    text-align: left;
  }
}
</style>
