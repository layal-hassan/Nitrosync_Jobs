<script setup>
import { computed, ref } from 'vue'
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
    default: 'Interview Stage',
  },
})

const emit = defineEmits(['close'])

const noteText = ref(`Strong portfolio with great visual design skills.\n\nGood communication during the interview.\n\nShowed deep understanding of user experience and design systems.\n\nWould be a good fit for our product team.`)
const saveMenuOpen = ref(false)
const selectedVisibility = ref('Hiring Team')

const tags = ref(['Interview', 'Design'])

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const characterCount = computed(() => noteText.value.length)

function closeOverlay() {
  saveMenuOpen.value = false
  emit('close')
}

function toggleSaveMenu() {
  saveMenuOpen.value = !saveMenuOpen.value
}

function saveAndClose() {
  saveMenuOpen.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="add-note-overlay" @click.self="closeOverlay">
      <section class="add-note-modal">
        <header class="add-note-modal__head">
          <div class="add-note-modal__title">
            <span class="add-note-modal__title-icon">
              <AppIcon name="edit" :size="18" />
            </span>
            <div>
              <h2>Add Note</h2>
              <p>Add a note about {{ candidateName }}</p>
            </div>
          </div>

          <button class="add-note-modal__close" type="button" aria-label="Close Add Note" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="add-note-modal__body">
          <section class="add-note-top-grid">
            <div class="add-note-field">
              <label>Note about</label>
              <button type="button" class="add-note-select">
                <div class="add-note-select__candidate">
                  <span class="add-note-select__avatar">{{ candidateInitials }}</span>
                  <div>
                    <strong>{{ candidateName }}</strong>
                    <small>{{ candidateRole }} - <span>{{ candidateStage }}</span></small>
                  </div>
                </div>
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>

            <div class="add-note-field">
              <label>Note visibility</label>
              <button type="button" class="add-note-select">
                <div class="add-note-select__candidate">
                  <span class="add-note-select__icon"><AppIcon name="lock" :size="16" /></span>
                  <div>
                    <strong>{{ selectedVisibility }}</strong>
                    <small>Visible to all hiring team members</small>
                  </div>
                </div>
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>
          </section>

          <section class="add-note-editor">
            <label>Note <span>*</span></label>

            <div class="add-note-editor__shell">
              <div class="add-note-editor__toolbar">
                <div class="add-note-editor__toolbar-group">
                  <button type="button">Normal</button>
                  <button type="button">B</button>
                  <button type="button">I</button>
                  <button type="button">U</button>
                  <button type="button">List</button>
                  <button type="button"><AppIcon name="link" :size="14" /></button>
                </div>

                <div class="add-note-editor__toolbar-group">
                  <button type="button"><AppIcon name="sparkles" :size="14" /> AI Assist</button>
                </div>
              </div>

              <textarea v-model="noteText" />

              <div class="add-note-editor__count">Characters: {{ characterCount }}</div>
            </div>
          </section>

          <section class="add-note-bottom-grid">
            <div class="add-note-field">
              <label>Add tags <small>(optional)</small></label>
              <button type="button" class="add-note-select is-tags">
                <div class="add-note-tags">
                  <span v-for="tag in tags" :key="tag">{{ tag }} <i>x</i></span>
                </div>
                <AppIcon name="chevronDown" :size="16" />
              </button>
            </div>

            <div class="add-note-field">
              <label>Set reminder <small>(optional)</small></label>
              <div class="add-note-reminder">
                <button type="button" class="add-note-select is-small">
                  <span><AppIcon name="calendar" :size="15" /> 22 May, 2024</span>
                </button>
                <button type="button" class="add-note-select is-time">
                  <span>10:00 AM</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
              </div>
              <p>We'll remind you on Slack and email</p>
            </div>
          </section>

          <section class="add-note-follow-up">
            <label>
              <input checked type="checkbox">
              <span class="add-note-follow-up__checkbox"><AppIcon name="check" :size="12" /></span>
              <span>
                <strong>Also create a follow-up task</strong>
                <small>This will create a task to follow up on this note</small>
              </span>
            </label>
          </section>
        </div>

        <footer class="add-note-modal__footer">
          <button class="add-note-button add-note-button--ghost" type="button" @click="closeOverlay">Cancel</button>

          <div class="add-note-modal__actions">
            <button class="add-note-button add-note-button--ghost" type="button" @click="saveAndClose">
              <AppIcon name="cloud-upload" :size="15" />
              <span>Save Draft</span>
            </button>

            <div class="add-note-split-button">
              <button class="add-note-button add-note-button--primary" type="button" @click="saveAndClose">
                <AppIcon name="checkCircle" :size="15" />
                <span>Save Note</span>
              </button>
              <button class="add-note-split-button__toggle" type="button" @click="toggleSaveMenu">
                <AppIcon name="chevronDown" :size="16" />
              </button>

              <div v-if="saveMenuOpen" class="add-note-save-menu">
                <button type="button" @click="saveAndClose">
                  <AppIcon name="refresh" :size="14" />
                  <span>Save & Create Task</span>
                </button>
                <button type="button" @click="saveAndClose">
                  <AppIcon name="alert" :size="14" />
                  <span>Save & Notify Team</span>
                </button>
                <button type="button" @click="saveAndClose">
                  <AppIcon name="plus" :size="14" />
                  <span>Save & Add Another Note</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.add-note-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(21, 28, 42, 0.52);
  backdrop-filter: blur(5px);
}

.add-note-modal {
  width: min(100%, 980px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 22px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.22);
}

.add-note-modal__head,
.add-note-modal__title,
.add-note-top-grid,
.add-note-select,
.add-note-select__candidate,
.add-note-editor__toolbar,
.add-note-editor__toolbar-group,
.add-note-bottom-grid,
.add-note-reminder,
.add-note-follow-up label,
.add-note-modal__footer,
.add-note-modal__actions,
.add-note-button,
.add-note-split-button,
.add-note-save-menu button,
.add-note-tags {
  display: flex;
  align-items: center;
}

.add-note-modal__head,
.add-note-modal__footer,
.add-note-editor__toolbar,
.add-note-select,
.add-note-save-menu button {
  justify-content: space-between;
}

.add-note-modal__head {
  padding: 20px 24px;
  border-bottom: 1px solid #edf2fb;
}

.add-note-modal__title {
  gap: 14px;
}

.add-note-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff1f8;
  color: #ff67b5;
}

.add-note-modal__title h2,
.add-note-field label,
.add-note-select strong,
.add-note-follow-up strong {
  margin: 0;
  color: #1f2940;
}

.add-note-modal__title p,
.add-note-select small,
.add-note-field p,
.add-note-follow-up small {
  margin: 0;
  color: #738199;
}

.add-note-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #97a5bb;
  cursor: pointer;
}

.add-note-modal__body {
  overflow: auto;
  padding: 28px 32px;
}

.add-note-top-grid,
.add-note-bottom-grid {
  gap: 24px;
}

.add-note-top-grid > *,
.add-note-bottom-grid > * {
  flex: 1;
}

.add-note-field label {
  display: block;
  margin-bottom: 10px;
  font-size: 0.95rem;
  font-weight: 700;
}

.add-note-field label span {
  color: #ff67b5;
}

.add-note-field label small {
  color: #94a1b8;
}

.add-note-select {
  width: 100%;
  min-height: 62px;
  padding: 0 16px;
  border: 1px solid #dce5f2;
  border-radius: 14px;
  background: #fff;
  color: #738199;
  font: inherit;
  cursor: pointer;
}

.add-note-select__avatar,
.add-note-select__icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f3f6fb 0%, #e4ebf4 100%);
  color: #7b8aa6;
  font-weight: 800;
}

.add-note-select__candidate {
  gap: 12px;
}

.add-note-select small span {
  color: #ff67b5;
}

.add-note-editor {
  margin-top: 24px;
}

.add-note-editor__shell {
  border: 1px solid #dce5f2;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.add-note-editor__toolbar {
  padding: 10px 14px;
  border-bottom: 1px solid #edf2fb;
}

.add-note-editor__toolbar-group {
  gap: 10px;
}

.add-note-editor__toolbar button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #3a4762;
  font: inherit;
  cursor: pointer;
}

.add-note-editor__toolbar-group:last-child button {
  background: #fff1f8;
  color: #ff67b5;
  font-weight: 700;
}

.add-note-editor textarea {
  width: 100%;
  min-height: 270px;
  padding: 20px;
  border: 0;
  resize: vertical;
  color: #1f2940;
  font: inherit;
  line-height: 1.9;
}

.add-note-editor__count {
  padding: 0 20px 12px;
  text-align: right;
  color: #94a1b8;
  font-size: 0.82rem;
}

.add-note-bottom-grid {
  margin-top: 24px;
}

.add-note-select.is-tags {
  min-height: 48px;
}

.add-note-tags {
  gap: 8px;
  flex-wrap: wrap;
}

.add-note-tags span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #fff1f8;
  color: #ff67b5;
  font-size: 0.86rem;
}

.add-note-tags i {
  font-style: normal;
}

.add-note-reminder {
  gap: 10px;
}

.add-note-select.is-small,
.add-note-select.is-time {
  min-height: 48px;
}

.add-note-select.is-time {
  max-width: 160px;
}

.add-note-follow-up {
  margin-top: 26px;
  padding: 18px 16px;
  border: 1px solid #edf2fb;
  border-radius: 16px;
  background: #fbfcff;
}

.add-note-follow-up label {
  gap: 12px;
  align-items: flex-start;
}

.add-note-follow-up input {
  display: none;
}

.add-note-follow-up__checkbox {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  border-radius: 8px;
  background: #ff67b5;
  color: #fff;
}

.add-note-follow-up strong,
.add-note-follow-up small {
  display: block;
}

.add-note-follow-up small {
  margin-top: 4px;
}

.add-note-modal__footer {
  padding: 16px 32px 24px;
  border-top: 1px solid #edf2fb;
}

.add-note-modal__actions {
  gap: 12px;
}

.add-note-button {
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.add-note-button--ghost {
  border: 1px solid #dce5f2;
  background: #fff;
  color: #2e3952;
}

.add-note-button--primary {
  border: 0;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  box-shadow: 0 16px 28px rgba(235, 94, 171, 0.18);
}

.add-note-split-button {
  position: relative;
}

.add-note-split-button .add-note-button {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.add-note-split-button__toggle {
  width: 46px;
  height: 42px;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.24);
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  background: linear-gradient(90deg, #ff6db6 0%, #eb5eab 100%);
  color: #fff;
  cursor: pointer;
}

.add-note-save-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
  width: 240px;
  padding: 10px;
  border: 1px solid #e6ecf5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.16);
}

.add-note-save-menu button {
  width: 100%;
  min-height: 42px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #2e3952;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 900px) {
  .add-note-top-grid,
  .add-note-bottom-grid,
  .add-note-reminder,
  .add-note-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .add-note-select.is-time {
    max-width: none;
  }
}

@media (max-width: 720px) {
  .add-note-overlay {
    padding: 12px;
  }

  .add-note-modal {
    max-height: calc(100vh - 24px);
    border-radius: 18px;
  }

  .add-note-modal__body,
  .add-note-modal__head,
  .add-note-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .add-note-modal__title,
  .add-note-modal__actions {
    width: 100%;
  }

  .add-note-modal__actions,
  .add-note-split-button {
    display: grid;
  }

  .add-note-button,
  .add-note-split-button__toggle {
    width: 100%;
  }

  .add-note-split-button .add-note-button {
    border-radius: 12px;
  }

  .add-note-split-button__toggle {
    border-left: 0;
    border-radius: 12px;
  }

  .add-note-save-menu {
    position: static;
    width: 100%;
    margin-top: 12px;
  }
}
</style>
