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
})

const emit = defineEmits(['close'])

const holdReason = ref('Budget approval pending')
const resumeDate = ref('15 July 2026')
const statusMode = ref('hold')
const internalNote = ref('Waiting for final budget approval before proceeding with technical interviews.')
const remindTeam = ref(true)
const reminderOffset = ref('3 days before')
const receiveUpdates = ref(true)
const keepInReports = ref(true)

const noteCount = computed(() => internalNote.value.length)
const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

function resetState() {
  holdReason.value = 'Budget approval pending'
  resumeDate.value = '15 July 2026'
  statusMode.value = 'hold'
  internalNote.value = 'Waiting for final budget approval before proceeding with technical interviews.'
  remindTeam.value = true
  reminderOffset.value = '3 days before'
  receiveUpdates.value = true
  keepInReports.value = true
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState()
    }
  },
)

function closeOverlay() {
  emit('close')
}

function submitHold() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="hold-overlay" @click.self="closeOverlay">
      <section class="hold-modal">
        <div class="hold-layout">
          <div class="hold-main">
            <header class="hold-modal__head">
              <div class="hold-modal__title">
                <span class="hold-modal__title-icon">
                  <AppIcon name="pause" :size="18" />
                </span>
                <div>
                  <h2>Put Candidate on Hold</h2>
                  <p>Pause this candidate in the hiring process without rejecting them.</p>
                </div>
              </div>

              <button class="hold-modal__close" type="button" aria-label="Close put on hold modal" @click="closeOverlay">
                <AppIcon name="close" :size="18" />
              </button>
            </header>

            <div class="hold-main__body">
              <section class="hold-field">
                <label>Hold Reason <span>*</span></label>
                <button class="hold-select" type="button">
                  <span>{{ holdReason }}</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </section>

              <section class="hold-field">
                <label>Expected Resume Date</label>
                <p>When should we revisit this candidate?</p>
                <button class="hold-select" type="button">
                  <span><AppIcon name="calendar" :size="15" /> {{ resumeDate }}</span>
                </button>
              </section>

              <section class="hold-field">
                <label>Candidate Status While On Hold</label>

                <button class="hold-radio-row" type="button" @click="statusMode = 'current'">
                  <span class="hold-radio" :class="{ 'is-active': statusMode === 'current' }" />
                  <span>Keep in current stage</span>
                </button>

                <button class="hold-radio-row" type="button" @click="statusMode = 'hold'">
                  <span class="hold-radio" :class="{ 'is-active': statusMode === 'hold' }" />
                  <span>Move to "On Hold"</span>
                </button>
              </section>

              <section class="hold-field">
                <label>Internal Note</label>
                <textarea v-model="internalNote" rows="5" />
                <div class="hold-note-meta">
                  <small>Visible only to hiring team.</small>
                  <small>{{ noteCount }} / 500</small>
                </div>
              </section>

              <section class="hold-field">
                <label>Follow-up Reminder</label>

                <label class="hold-check-row">
                  <input v-model="remindTeam" type="checkbox">
                  <span class="hold-check-box"><AppIcon name="check" :size="13" /></span>
                  <span>Remind hiring team before resume date</span>
                </label>

                <button class="hold-select hold-select--compact" type="button">
                  <span>{{ reminderOffset }}</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </section>

              <section class="hold-field">
                <label>Candidate Visibility</label>

                <label class="hold-check-row">
                  <input v-model="receiveUpdates" type="checkbox">
                  <span class="hold-check-box"><AppIcon name="check" :size="13" /></span>
                  <span>Candidate can continue receiving updates</span>
                </label>

                <label class="hold-check-row">
                  <input v-model="keepInReports" type="checkbox">
                  <span class="hold-check-box"><AppIcon name="check" :size="13" /></span>
                  <span>Keep candidate in reports &amp; analytics</span>
                </label>
              </section>
            </div>

            <footer class="hold-modal__footer">
              <button class="hold-button hold-button--ghost" type="button" @click="closeOverlay">Cancel</button>
              <button class="hold-button hold-button--primary" type="button" @click="submitHold">Put on Hold</button>
            </footer>
          </div>

          <aside class="hold-side">
            <article class="hold-side__success">
              <span class="hold-side__success-icon">
                <AppIcon name="check" :size="28" />
              </span>
              <h3>Candidate placed on hold</h3>

              <div class="hold-side__summary">
                <div>
                  <strong>Current Status:</strong>
                  <em>On Hold</em>
                </div>
                <div>
                  <strong>Reason:</strong>
                  <span>{{ holdReason }}</span>
                </div>
                <div>
                  <strong>Resume Review:</strong>
                  <span>{{ resumeDate }}</span>
                </div>
              </div>

              <div class="hold-side__actions">
                <button class="hold-button hold-button--ghost" type="button">View Candidate</button>
                <button class="hold-button hold-button--primary" type="button">Resume Process Now</button>
              </div>
            </article>

            <div class="hold-side__caption">On Hold Status in Candidate Profile</div>

            <article class="hold-profile-card">
              <header class="hold-profile-card__head">
                <div class="hold-profile-card__status">
                  <span><AppIcon name="pause" :size="14" /></span>
                  <strong>On Hold</strong>
                </div>

                <button type="button" aria-label="More">
                  <AppIcon name="dotsVertical" :size="16" />
                </button>
              </header>

              <div class="hold-profile-card__body">
                <strong>{{ holdReason }}</strong>
                <p><AppIcon name="calendar" :size="13" /> Resume review: {{ resumeDate }}</p>
              </div>

              <div class="hold-profile-card__meta">
                <span class="hold-profile-card__avatar">{{ candidateInitials }}</span>
                <small>Set by Sarah Chen • 3 days ago</small>
              </div>

              <footer class="hold-profile-card__footer">
                <button type="button">Resume Now</button>
                <button class="is-link" type="button">Edit Hold</button>
              </footer>
            </article>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.hold-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding: 24px;
  background: rgba(226, 233, 243, 0.86);
  backdrop-filter: blur(6px);
}

.hold-modal {
  width: min(100%, 1180px);
  margin: auto 0;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
}

.hold-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 580px;
  align-items: start;
}

.hold-main {
  min-width: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-right: 1px solid #edf2f8;
}

.hold-modal__head,
.hold-modal__title,
.hold-select,
.hold-radio-row,
.hold-check-row,
.hold-note-meta,
.hold-modal__footer,
.hold-button,
.hold-side__actions,
.hold-side__summary div,
.hold-profile-card__head,
.hold-profile-card__status,
.hold-profile-card__meta,
.hold-profile-card__footer {
  display: flex;
  align-items: center;
}

.hold-modal__head,
.hold-modal__footer,
.hold-select,
.hold-side__summary div,
.hold-profile-card__head,
.hold-profile-card__footer {
  justify-content: space-between;
}

.hold-modal__head {
  padding: 22px 24px;
  border-bottom: 1px solid #edf2f8;
}

.hold-modal__title {
  gap: 14px;
}

.hold-modal__title-icon {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff8e8;
  color: #f59e0b;
}

.hold-modal__title h2,
.hold-field label,
.hold-side__success h3,
.hold-profile-card__body strong {
  margin: 0;
  color: #1f2940;
}

.hold-modal__title h2 {
  font-size: 1rem;
}

.hold-modal__title p,
.hold-field p,
.hold-note-meta small,
.hold-side__caption,
.hold-profile-card__body p,
.hold-profile-card__meta small {
  margin: 0;
  color: #738199;
}

.hold-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.hold-main__body {
  overflow: auto;
  padding: 22px 24px 24px;
}

.hold-field + .hold-field {
  margin-top: 22px;
}

.hold-field label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.92rem;
  font-weight: 700;
}

.hold-field label span {
  color: #ef5ea9;
}

.hold-field p {
  margin-bottom: 10px;
  font-size: 0.82rem;
}

.hold-select,
.hold-field textarea {
  width: 100%;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #24304d;
  font: inherit;
}

.hold-select {
  min-height: 46px;
  padding: 0 14px;
}

.hold-select span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hold-select--compact {
  width: 200px;
  margin-top: 10px;
}

.hold-radio-row {
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #3a465f;
  font: inherit;
  cursor: pointer;
}

.hold-radio-row + .hold-radio-row {
  margin-top: 12px;
}

.hold-radio {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 2px solid #ced8e7;
  border-radius: 50%;
}

.hold-radio.is-active {
  border-color: #ef5ea9;
  box-shadow: inset 0 0 0 4px #ef5ea9;
}

.hold-field textarea {
  min-height: 106px;
  padding: 14px;
  resize: vertical;
  line-height: 1.6;
}

.hold-note-meta {
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.74rem;
}

.hold-check-row {
  gap: 10px;
  color: #3a465f;
  cursor: pointer;
}

.hold-check-row + .hold-check-row {
  margin-top: 12px;
}

.hold-check-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.hold-check-box {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  border-radius: 6px;
  background: #ef5ea9;
  color: #fff;
}

.hold-modal__footer {
  padding: 22px 24px 24px;
  border-top: 1px solid #edf2f8;
}

.hold-button {
  justify-content: center;
  min-width: 140px;
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.hold-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #3d4860;
}

.hold-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

.hold-side {
  padding: 40px 32px 32px;
  background: #f6f9fd;
}

.hold-side__success,
.hold-profile-card {
  padding: 28px 26px;
  border: 1px solid #e8eef7;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(19, 34, 68, 0.08);
}

.hold-side__success {
  text-align: center;
}

.hold-side__success-icon {
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #d8f6df;
  color: #22c55e;
}

.hold-side__success h3 {
  margin-top: 18px;
  font-size: 1rem;
}

.hold-side__summary {
  margin-top: 22px;
  padding-top: 10px;
  text-align: left;
}

.hold-side__summary div + div {
  margin-top: 14px;
}

.hold-side__summary strong {
  color: #717d92;
}

.hold-side__summary em {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff3cf;
  color: #d97706;
  font-style: normal;
  font-weight: 800;
}

.hold-side__summary span {
  color: #1f2940;
}

.hold-side__actions {
  gap: 12px;
  margin-top: 26px;
}

.hold-side__actions .hold-button {
  flex: 1;
}

.hold-side__caption {
  margin: 18px 0 16px;
  font-size: 0.86rem;
}

.hold-profile-card {
  overflow: hidden;
  padding: 0;
}

.hold-profile-card__head {
  padding: 18px 20px;
  background: #fff9e8;
  border-bottom: 1px solid #f0e7c8;
}

.hold-profile-card__status {
  gap: 10px;
}

.hold-profile-card__status span {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #f5cc6a;
  color: #f59e0b;
  background: #fff;
}

.hold-profile-card__head button {
  border: 0;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.hold-profile-card__body {
  padding: 20px;
}

.hold-profile-card__body strong {
  display: block;
  font-size: 0.96rem;
}

.hold-profile-card__body p {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

.hold-profile-card__meta {
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #edf2f8;
}

.hold-profile-card__avatar {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
}

.hold-profile-card__footer {
  gap: 14px;
  padding: 18px 20px 20px;
  border-top: 1px solid #edf2f8;
}

.hold-profile-card__footer button {
  min-width: 138px;
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.hold-profile-card__footer button:first-child {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #3d4860;
}

.hold-profile-card__footer button.is-link {
  min-width: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ef5ea9;
}

@media (max-width: 1120px) {
  .hold-layout {
    grid-template-columns: 1fr;
  }

  .hold-main {
    border-right: 0;
    border-bottom: 1px solid #edf2f8;
  }
}

@media (max-width: 720px) {
  .hold-overlay {
    padding: 12px;
  }

  .hold-modal {
    border-radius: 20px;
  }

  .hold-main__body,
  .hold-modal__head,
  .hold-modal__footer,
  .hold-side {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hold-modal__footer,
  .hold-side__actions,
  .hold-profile-card__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .hold-select--compact,
  .hold-button,
  .hold-side__actions .hold-button,
  .hold-profile-card__footer button {
    width: 100%;
  }

  .hold-side {
    padding-top: 24px;
  }
}
</style>
