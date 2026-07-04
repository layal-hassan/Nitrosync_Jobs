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
    default: 'Alex Johnson',
  },
  candidateRole: {
    type: String,
    default: 'Senior UX Designer',
  },
})

const emit = defineEmits(['close'])

const archiveReason = ref('Position filled')
const archiveNote = ref('')
const keepInReports = ref(true)
const keepInSearch = ref(true)
const notifyCandidate = ref(false)

const noteCount = computed(() => archiveNote.value.length)
const archivedDate = '15 May 2025'
const archivedBy = 'Sarah Chen'
const archivedByInitials = 'SC'

function resetState() {
  archiveReason.value = 'Position filled'
  archiveNote.value = ''
  keepInReports.value = true
  keepInSearch.value = true
  notifyCandidate.value = false
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

function submitArchive() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="archive-overlay" @click.self="closeOverlay">
      <section class="archive-modal">
        <div class="archive-layout">
          <div class="archive-main">
            <header class="archive-modal__head">
              <div class="archive-modal__title">
                <span class="archive-modal__title-icon">
                  <AppIcon name="archive" :size="18" />
                </span>
                <div>
                  <h2>Archive Candidate</h2>
                  <p>Remove this candidate from active pipelines. You can always find them in your archived candidates.</p>
                </div>
              </div>

              <button class="archive-modal__close" type="button" aria-label="Close archive candidate modal" @click="closeOverlay">
                <AppIcon name="close" :size="18" />
              </button>
            </header>

            <div class="archive-main__body">
              <section class="archive-field">
                <label>Archive Reason <span>*</span></label>
                <button class="archive-select" type="button">
                  <span>{{ archiveReason }}</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
                <small>Help your team understand why this candidate is being archived.</small>
              </section>

              <section class="archive-field">
                <label>Notes <em>(Optional)</em></label>
                <textarea v-model="archiveNote" rows="5" placeholder="Add a note (optional)" />
                <div class="archive-note-meta">
                  <small>Internal note visible only to your team.</small>
                  <small>{{ noteCount }} / 500</small>
                </div>
              </section>

              <section class="archive-field">
                <label>Candidate Visibility</label>

                <label class="archive-check-row">
                  <input v-model="keepInReports" type="checkbox">
                  <span class="archive-check-box"><AppIcon name="check" :size="13" /></span>
                  <span>Keep in reports &amp; analytics</span>
                </label>

                <label class="archive-check-row">
                  <input v-model="keepInSearch" type="checkbox">
                  <span class="archive-check-box"><AppIcon name="check" :size="13" /></span>
                  <span>Keep in candidate search results</span>
                </label>
              </section>

              <section class="archive-help-box">
                <div class="archive-help-box__title">
                  <AppIcon name="clock" :size="15" />
                  <strong>What happens when you archive a candidate?</strong>
                </div>
                <ul>
                  <li>They will be removed from all active pipelines and stages</li>
                  <li>They will not receive any further automated emails</li>
                  <li>You and your team can still view their profile anytime</li>
                </ul>
              </section>

              <section class="archive-field">
                <label>Notify Candidate</label>

                <button class="archive-radio-row" type="button" @click="notifyCandidate = !notifyCandidate">
                  <span class="archive-radio" :class="{ 'is-active': notifyCandidate }" />
                  <span>Send a personalized email (optional)</span>
                </button>

                <p class="archive-radio-note">Let the candidate know they won't be moving forward right now.</p>
              </section>
            </div>

            <footer class="archive-modal__footer">
              <button class="archive-button archive-button--ghost" type="button" @click="closeOverlay">Cancel</button>
              <button class="archive-button archive-button--primary" type="button" @click="submitArchive">Archive Candidate</button>
            </footer>
          </div>

          <aside class="archive-side">
            <article class="archive-side__success">
              <span class="archive-side__success-icon">
                <AppIcon name="check" :size="26" />
              </span>
              <h3>Candidate archived</h3>
              <p>{{ candidateName }} has been archived successfully.</p>

              <div class="archive-side__summary">
                <div>
                  <strong>Archive Reason:</strong>
                  <span>{{ archiveReason }}</span>
                </div>
                <div>
                  <strong>Archived On:</strong>
                  <span>{{ archivedDate }}</span>
                </div>
                <div>
                  <strong>Archived By:</strong>
                  <span>{{ archivedBy }}</span>
                </div>
              </div>

              <div class="archive-side__actions">
                <button class="archive-button archive-button--ghost" type="button">View Candidate Profile</button>
                <button class="archive-button archive-button--primary" type="button" @click="closeOverlay">Done</button>
              </div>
            </article>

            <div class="archive-side__caption">In Candidate Profile</div>

            <article class="archive-profile-card">
              <header class="archive-profile-card__head">
                <div class="archive-profile-card__status">
                  <span><AppIcon name="archive" :size="15" /></span>
                  <div>
                    <strong>Archived</strong>
                    <small>This candidate is no longer in active pipelines.</small>
                  </div>
                </div>

                <button type="button" aria-label="More">
                  <AppIcon name="dotsVertical" :size="16" />
                </button>
              </header>

              <div class="archive-profile-card__body">
                <div>
                  <strong><AppIcon name="calendar" :size="14" /> Archive Reason</strong>
                  <span>{{ archiveReason }}</span>
                </div>
                <div>
                  <strong><AppIcon name="clock" :size="14" /> Archived On</strong>
                  <span>{{ archivedDate }}</span>
                </div>
                <div>
                  <strong><AppIcon name="user" :size="14" /> Archived By</strong>
                  <span class="archive-profile-card__user">
                    <em>{{ archivedByInitials }}</em>
                    <span>{{ archivedBy }}</span>
                  </span>
                </div>
              </div>

              <footer class="archive-profile-card__footer">
                <button type="button">View Full Profile</button>
                <button class="is-link" type="button">Unarchive</button>
              </footer>
            </article>

            <div class="archive-tip">
              <div class="archive-tip__title">
                <AppIcon name="clock" :size="15" />
                <strong>You can unarchive anytime</strong>
              </div>
              <p>Unarchive this candidate to add them back to a pipeline or stage.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.archive-overlay {
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

.archive-modal {
  width: min(100%, 1180px);
  margin: auto 0;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.2);
}

.archive-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 500px;
  align-items: start;
}

.archive-main {
  min-width: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-right: 1px solid #edf2f8;
}

.archive-modal__head,
.archive-modal__title,
.archive-select,
.archive-check-row,
.archive-note-meta,
.archive-modal__footer,
.archive-button,
.archive-radio-row,
.archive-side__actions,
.archive-side__summary div,
.archive-profile-card__head,
.archive-profile-card__status,
.archive-profile-card__body div,
.archive-profile-card__footer,
.archive-profile-card__user,
.archive-tip__title {
  display: flex;
  align-items: center;
}

.archive-modal__head,
.archive-modal__footer,
.archive-select,
.archive-side__summary div,
.archive-profile-card__head,
.archive-profile-card__footer {
  justify-content: space-between;
}

.archive-modal__head {
  padding: 22px 24px;
  border-bottom: 1px solid #edf2f8;
}

.archive-modal__title {
  gap: 14px;
}

.archive-modal__title-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff1f8;
  color: #ef5ea9;
}

.archive-modal__title h2,
.archive-field label,
.archive-help-box__title strong,
.archive-side__success h3,
.archive-profile-card__status strong {
  margin: 0;
  color: #1f2940;
}

.archive-modal__title h2 {
  font-size: 1rem;
}

.archive-modal__title p,
.archive-field small,
.archive-note-meta small,
.archive-radio-note,
.archive-side__caption,
.archive-side__success p,
.archive-profile-card__status small,
.archive-tip p {
  margin: 0;
  color: #738199;
}

.archive-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.archive-main__body {
  overflow: auto;
  padding: 22px 24px 24px;
}

.archive-field + .archive-field,
.archive-help-box,
.archive-tip {
  margin-top: 22px;
}

.archive-field label {
  display: block;
  margin-bottom: 10px;
  font-size: 0.92rem;
  font-weight: 700;
}

.archive-field label span {
  color: #ef5ea9;
}

.archive-field label em {
  color: #9aa6ba;
  font-style: normal;
}

.archive-select,
.archive-field textarea {
  width: 100%;
  border: 1px solid #dce5f2;
  border-radius: 12px;
  background: #fff;
  color: #24304d;
  font: inherit;
}

.archive-select {
  min-height: 46px;
  padding: 0 14px;
  margin-bottom: 8px;
}

.archive-field textarea {
  min-height: 98px;
  padding: 14px;
  resize: vertical;
  line-height: 1.6;
}

.archive-note-meta {
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.74rem;
}

.archive-check-row {
  gap: 10px;
  color: #3a465f;
  cursor: pointer;
}

.archive-check-row + .archive-check-row {
  margin-top: 14px;
}

.archive-check-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.archive-check-box {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  border-radius: 50%;
  background: #ef5ea9;
  color: #fff;
}

.archive-help-box {
  padding: 16px 18px;
  border: 1px solid #d9e6ff;
  border-radius: 12px;
  background: #f7fbff;
}

.archive-help-box__title {
  gap: 10px;
  color: #315fda;
}

.archive-help-box ul {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  color: #315fda;
  font-size: 0.86rem;
}

.archive-help-box li {
  position: relative;
  padding-left: 18px;
}

.archive-help-box li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #ef5ea9;
  font-weight: 800;
}

.archive-radio-row {
  gap: 10px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #3a465f;
  font: inherit;
  cursor: pointer;
}

.archive-radio {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  border: 2px solid #ced8e7;
  border-radius: 50%;
}

.archive-radio.is-active {
  border-color: #ef5ea9;
  box-shadow: inset 0 0 0 4px #fff, 0 0 0 5px #ef5ea9;
  background: #ef5ea9;
}

.archive-radio-note {
  margin-top: 8px;
  padding-left: 28px;
}

.archive-modal__footer {
  padding: 22px 24px 24px;
  border-top: 1px solid #edf2f8;
}

.archive-button {
  justify-content: center;
  min-width: 140px;
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.archive-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #3d4860;
}

.archive-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

.archive-side {
  padding: 32px;
  background: #f6f9fd;
}

.archive-side__success,
.archive-profile-card,
.archive-tip {
  padding: 28px 26px;
  border: 1px solid #e8eef7;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 36px rgba(19, 34, 68, 0.08);
}

.archive-side__success {
  text-align: center;
}

.archive-side__success-icon {
  width: 56px;
  height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #22c55e;
}

.archive-side__success h3 {
  margin-top: 18px;
  font-size: 1rem;
}

.archive-side__success p {
  margin-top: 10px;
}

.archive-side__summary {
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid #edf2f8;
  text-align: left;
}

.archive-side__summary div + div {
  margin-top: 14px;
}

.archive-side__summary strong {
  color: #717d92;
}

.archive-side__summary span {
  color: #1f2940;
  font-weight: 600;
}

.archive-side__actions {
  gap: 12px;
  margin-top: 24px;
}

.archive-side__actions .archive-button {
  flex: 1;
}

.archive-side__caption {
  margin: 30px 0 16px;
  font-size: 0.86rem;
}

.archive-profile-card {
  padding: 0;
  overflow: hidden;
}

.archive-profile-card__head {
  padding: 18px 18px 16px;
}

.archive-profile-card__status {
  gap: 12px;
  align-items: flex-start;
}

.archive-profile-card__status span {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #eef2f7;
  color: #5b667a;
  flex: 0 0 40px;
}

.archive-profile-card__head button {
  border: 0;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.archive-profile-card__body {
  display: grid;
  gap: 14px;
  padding: 16px 18px 18px;
  border-top: 1px solid #edf2f8;
}

.archive-profile-card__body div {
  justify-content: space-between;
  gap: 12px;
}

.archive-profile-card__body strong {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #717d92;
  font-weight: 500;
}

.archive-profile-card__body span {
  color: #1f2940;
  font-weight: 600;
}

.archive-profile-card__user {
  gap: 8px;
}

.archive-profile-card__user em {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd27a 0%, #2a725f 100%);
  color: #fff;
  font-style: normal;
  font-size: 0.68rem;
  font-weight: 800;
}

.archive-profile-card__footer {
  padding: 18px;
  border-top: 1px solid #edf2f8;
}

.archive-profile-card__footer button {
  min-width: 132px;
  height: 38px;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.archive-profile-card__footer button:first-child {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #3d4860;
}

.archive-profile-card__footer button.is-link {
  min-width: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ef5ea9;
}

.archive-tip {
  margin-top: 16px;
  background: #f7fbff;
  border-color: #d9e6ff;
  box-shadow: none;
}

.archive-tip__title {
  gap: 10px;
  color: #315fda;
}

.archive-tip p {
  margin-top: 8px;
  color: #315fda;
}

@media (max-width: 1120px) {
  .archive-layout {
    grid-template-columns: 1fr;
  }

  .archive-main {
    border-right: 0;
    border-bottom: 1px solid #edf2f8;
  }
}

@media (max-width: 720px) {
  .archive-overlay {
    padding: 12px;
  }

  .archive-modal {
    border-radius: 20px;
  }

  .archive-main__body,
  .archive-modal__head,
  .archive-modal__footer,
  .archive-side {
    padding-left: 18px;
    padding-right: 18px;
  }

  .archive-modal__footer,
  .archive-side__actions,
  .archive-profile-card__footer,
  .archive-profile-card__body div {
    flex-direction: column;
    align-items: stretch;
  }

  .archive-button,
  .archive-side__actions .archive-button,
  .archive-profile-card__footer button {
    width: 100%;
  }
}
</style>
