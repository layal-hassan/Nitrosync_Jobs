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

const shareMode = ref('link')
const permission = ref('view')
const recipients = ref(['sophia.c@nitro.ai', 'marcus.v@nitro.ai'])
const message = ref('')
const copied = ref(false)

const shareLink = computed(() => `https://nitrosync.com/share/candidate/${props.candidateName.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 6) || 'candidate'}/8f3k2d9`)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    shareMode.value = 'link'
    permission.value = 'view'
    message.value = ''
    copied.value = false
  }
})

watch(shareMode, (mode) => {
  permission.value = mode === 'email' ? 'feedback' : 'view'
})

async function copyLink() {
  copied.value = true

  try {
    await navigator.clipboard.writeText(shareLink.value)
  } catch {
    // Ignore clipboard failures in local mock mode.
  }
}

function closeOverlay() {
  emit('close')
}

function submitShare() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="share-candidate-overlay" @click.self="closeOverlay">
      <section class="share-candidate-modal">
        <header class="share-candidate-modal__head">
          <div class="share-candidate-modal__title">
            <span class="share-candidate-modal__title-icon">
              <AppIcon name="share" :size="18" />
            </span>
            <div>
              <h2>Share Candidate</h2>
              <p>Share {{ candidateName }} with your team.</p>
            </div>
          </div>

          <button class="share-candidate-modal__close" type="button" aria-label="Close Share Candidate" @click="closeOverlay">
            <AppIcon name="close" :size="18" />
          </button>
        </header>

        <div class="share-candidate-modal__body">
          <section class="share-candidate-summary">
            <article class="share-candidate-summary__card">
              <div class="share-candidate-summary__profile">
                <span class="share-candidate-summary__avatar">
                  <span>{{ candidateInitials }}</span>
                </span>

                <div class="share-candidate-summary__identity">
                  <strong>{{ candidateName }}</strong>
                  <small>{{ candidateRole }}</small>
                </div>
              </div>

              <div class="share-candidate-summary__stats">
                <article>
                  <span class="share-candidate-summary__icon is-pink"><AppIcon name="user" :size="14" /></span>
                  <small>Current stage</small>
                  <strong>Technical Interview</strong>
                </article>
                <article>
                  <span class="share-candidate-summary__icon is-green"><AppIcon name="thumbsUp" :size="14" /></span>
                  <small>Recommendation</small>
                  <strong>Strong Hire</strong>
                </article>
                <article>
                  <span class="share-candidate-summary__icon is-purple"><AppIcon name="message" :size="14" /></span>
                  <small>Feedback</small>
                  <strong>3 interviews</strong>
                </article>
                <article>
                  <span class="share-candidate-summary__icon is-gold"><AppIcon name="star" :size="14" /></span>
                  <small>Avg score</small>
                  <strong>4.6 / 5</strong>
                </article>
              </div>
            </article>

            <div class="share-candidate-summary__notes">
              <p class="is-positive"><AppIcon name="checkCircle" :size="16" /> Includes profile, stage, recommendation, feedback summary and scorecards</p>
              <p><AppIcon name="lock" :size="16" /> Private recruiter notes are never shared.</p>
            </div>
          </section>

          <section class="share-candidate-section">
            <h3>How do you want to share?</h3>

            <div class="share-candidate-mode-grid">
              <button
                class="share-candidate-mode-card"
                :class="{ 'is-active': shareMode === 'link' }"
                type="button"
                @click="shareMode = 'link'"
              >
                <span class="share-candidate-mode-card__radio" :class="{ 'is-active': shareMode === 'link' }" />
                <span class="share-candidate-mode-card__icon is-pink"><AppIcon name="link" :size="16" /></span>
                <div>
                  <strong>Share Link</strong>
                  <small>Anyone with the link can view</small>
                </div>
              </button>

              <button
                class="share-candidate-mode-card"
                :class="{ 'is-active': shareMode === 'email' }"
                type="button"
                @click="shareMode = 'email'"
              >
                <span class="share-candidate-mode-card__radio" :class="{ 'is-active': shareMode === 'email' }" />
                <span class="share-candidate-mode-card__icon is-slate"><AppIcon name="mail" :size="16" /></span>
                <div>
                  <strong>Share via Email</strong>
                  <small>Send access to specific people</small>
                </div>
              </button>
            </div>
          </section>

          <template v-if="shareMode === 'link'">
            <section class="share-candidate-two-col">
              <div class="share-candidate-field">
                <label>Permission</label>
                <p>Choose what people can do with this share.</p>

                <button class="share-candidate-radio-row" :class="{ 'is-active': permission === 'view' }" type="button" @click="permission = 'view'">
                  <span class="share-candidate-radio" :class="{ 'is-active': permission === 'view' }" />
                  <div>
                    <strong>View Only</strong>
                    <small>People can view the candidate details.</small>
                  </div>
                </button>

                <button class="share-candidate-radio-row" :class="{ 'is-active': permission === 'feedback' }" type="button" @click="permission = 'feedback'">
                  <span class="share-candidate-radio" :class="{ 'is-active': permission === 'feedback' }" />
                  <div>
                    <strong>Can Provide Feedback</strong>
                    <small>People can view and provide feedback</small>
                  </div>
                </button>
              </div>

              <div class="share-candidate-field">
                <label>Link expiry</label>
                <p>Choose when this link expires.</p>

                <button class="share-candidate-select" type="button">
                  <span><AppIcon name="calendar" :size="15" /> Never</span>
                  <AppIcon name="chevronDown" :size="16" />
                </button>
                <small class="share-candidate-field__hint">The link will never expire</small>
              </div>
            </section>

            <section class="share-candidate-link-box">
              <div class="share-candidate-link-box__value">
                <AppIcon name="link" :size="16" />
                <span>{{ shareLink }}</span>
              </div>
              <button type="button" @click="copyLink">
                <AppIcon name="copy" :size="15" />
                <span>{{ copied ? 'Copied' : 'Copy Link' }}</span>
              </button>
            </section>
          </template>

          <template v-else>
            <section class="share-candidate-field share-candidate-field--full">
              <label>Recipients</label>
              <div class="share-candidate-recipients">
                <span v-for="item in recipients" :key="item">{{ item }} <i>x</i></span>
              </div>
              <small class="share-candidate-field__hint">Press Enter to add multiple recipients</small>
            </section>

            <section class="share-candidate-two-col">
              <div class="share-candidate-field">
                <label>Permission</label>
                <p>Choose what people can do with this share.</p>

                <button class="share-candidate-radio-row" :class="{ 'is-active': permission === 'view' }" type="button" @click="permission = 'view'">
                  <span class="share-candidate-radio" :class="{ 'is-active': permission === 'view' }" />
                  <div>
                    <strong>View Only</strong>
                    <small>People can view the candidate details.</small>
                  </div>
                </button>

                <button class="share-candidate-radio-row" :class="{ 'is-active': permission === 'feedback' }" type="button" @click="permission = 'feedback'">
                  <span class="share-candidate-radio" :class="{ 'is-active': permission === 'feedback' }" />
                  <div>
                    <strong>Can Provide Feedback</strong>
                    <small>People can view and provide feedback</small>
                  </div>
                </button>
              </div>

              <div class="share-candidate-field">
                <label>Message <small>(optional)</small></label>
                <textarea v-model="message" maxlength="300" placeholder="Add a personal note..." />
                <small class="share-candidate-field__hint is-right">{{ message.length }}/300</small>
              </div>
            </section>
          </template>
        </div>

        <footer class="share-candidate-modal__footer">
          <button class="share-candidate-button share-candidate-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="share-candidate-button share-candidate-button--primary" type="button" @click="submitShare">Done</button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.share-candidate-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 24px;
  background: rgba(17, 24, 39, 0.38);
  backdrop-filter: blur(7px);
}

.share-candidate-modal {
  width: min(100%, 780px);
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #eef2f8;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(17, 24, 39, 0.2);
}

.share-candidate-modal__head,
.share-candidate-modal__title,
.share-candidate-summary__profile,
.share-candidate-summary__stats,
.share-candidate-summary__notes p,
.share-candidate-mode-grid,
.share-candidate-mode-card,
.share-candidate-two-col,
.share-candidate-radio-row,
.share-candidate-select,
.share-candidate-link-box,
.share-candidate-link-box__value,
.share-candidate-modal__footer,
.share-candidate-button,
.share-candidate-recipients {
  display: flex;
  align-items: center;
}

.share-candidate-modal__head,
.share-candidate-link-box,
.share-candidate-modal__footer {
  justify-content: space-between;
}

.share-candidate-modal__head {
  padding: 28px 28px 20px;
}

.share-candidate-modal__title {
  gap: 16px;
}

.share-candidate-modal__title-icon {
  width: 46px;
  height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff1f8;
  color: #f169b3;
}

.share-candidate-modal__title h2,
.share-candidate-section h3,
.share-candidate-summary__identity strong,
.share-candidate-mode-card strong,
.share-candidate-field label,
.share-candidate-radio-row strong {
  margin: 0;
  color: #202739;
}

.share-candidate-modal__title h2 {
  font-size: 1.08rem;
  font-weight: 800;
}

.share-candidate-modal__title p,
.share-candidate-summary__identity small,
.share-candidate-summary__notes p,
.share-candidate-mode-card small,
.share-candidate-field p,
.share-candidate-field__hint,
.share-candidate-link-box__value,
.share-candidate-radio-row small {
  margin: 0;
  color: #6c7890;
}

.share-candidate-modal__close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #9aa3b5;
  cursor: pointer;
}

.share-candidate-modal__body {
  overflow: auto;
  padding: 0 28px 28px;
}

.share-candidate-summary {
  padding-bottom: 24px;
  border-bottom: 1px solid #edf1f7;
}

.share-candidate-summary__card {
  padding: 26px 28px 22px;
  border: 1px solid #e8edf5;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.04);
}

.share-candidate-summary__profile {
  gap: 18px;
}

.share-candidate-summary__avatar {
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 72px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 28% 30%, rgba(255, 255, 255, 0.94) 0 14px, transparent 15px),
    linear-gradient(135deg, #121826 0%, #26324f 100%);
  box-shadow: inset 0 0 0 8px #fff;
  color: #fff;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.share-candidate-summary__identity {
  display: grid;
  gap: 4px;
}

.share-candidate-summary__identity strong {
  font-size: 1.15rem;
}

.share-candidate-summary__stats {
  gap: 18px;
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid #edf1f7;
}

.share-candidate-summary__stats article {
  flex: 1;
  min-width: 0;
}

.share-candidate-summary__icon {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
}

.share-candidate-summary__icon.is-pink {
  background: #fff1f8;
  color: #f169b3;
}

.share-candidate-summary__icon.is-green {
  background: #ebfbf1;
  color: #24b062;
}

.share-candidate-summary__icon.is-purple {
  background: #f3edff;
  color: #8d56ff;
}

.share-candidate-summary__icon.is-gold {
  background: #fff6dc;
  color: #e0a700;
}

.share-candidate-summary__stats small,
.share-candidate-summary__stats strong {
  display: block;
  margin-top: 10px;
}

.share-candidate-summary__stats small {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8e98ac;
}

.share-candidate-summary__stats strong {
  color: #222b3c;
  font-size: 1rem;
}

.share-candidate-summary__notes {
  display: grid;
  gap: 12px;
  margin-top: 22px;
}

.share-candidate-summary__notes p {
  gap: 10px;
  font-size: 0.96rem;
  line-height: 1.45;
}

.share-candidate-summary__notes p.is-positive :deep(svg) {
  color: #22b857;
}

.share-candidate-summary__notes p:not(.is-positive) :deep(svg) {
  color: #96a2b6;
}

.share-candidate-section {
  margin-top: 26px;
}

.share-candidate-section h3 {
  font-size: 1.05rem;
  font-weight: 800;
}

.share-candidate-mode-grid {
  gap: 16px;
  margin-top: 18px;
}

.share-candidate-mode-card {
  gap: 14px;
  flex: 1;
  min-height: 76px;
  padding: 18px 20px;
  border: 1.5px solid #dfe6f1;
  border-radius: 16px;
  background: #fff;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.share-candidate-mode-card.is-active {
  border-color: #f169b3;
  background: #fffafb;
  box-shadow: 0 0 0 1px rgba(241, 105, 179, 0.14);
}

.share-candidate-mode-card__radio,
.share-candidate-radio {
  width: 22px;
  height: 22px;
  display: inline-flex;
  flex: 0 0 22px;
  border: 1.5px solid #cdd6e4;
  border-radius: 50%;
  background: #fff;
}

.share-candidate-mode-card__radio.is-active,
.share-candidate-radio.is-active {
  border-color: #f169b3;
  box-shadow: inset 0 0 0 5px #f169b3;
}

.share-candidate-mode-card__icon {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.share-candidate-mode-card__icon.is-pink {
  background: #fff1f8;
  color: #f169b3;
}

.share-candidate-mode-card__icon.is-slate {
  background: #f4f6fb;
  color: #6f7d96;
}

.share-candidate-two-col {
  gap: 24px;
  align-items: flex-start;
  margin-top: 26px;
}

.share-candidate-two-col > * {
  flex: 1;
}

.share-candidate-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.98rem;
  font-weight: 800;
}

.share-candidate-field label small {
  color: #8994a8;
  font-weight: 600;
}

.share-candidate-field p {
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.share-candidate-radio-row {
  gap: 12px;
  width: 100%;
  padding: 8px 0 12px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.share-candidate-radio-row.is-active strong {
  color: #202739;
}

.share-candidate-radio-row strong,
.share-candidate-radio-row small {
  display: block;
}

.share-candidate-select,
.share-candidate-field textarea,
.share-candidate-recipients,
.share-candidate-link-box {
  width: 100%;
  min-height: 48px;
  padding: 0 16px;
  border: 1px solid #dbe2ee;
  border-radius: 14px;
  background: #fff;
  color: #46526a;
}

.share-candidate-select {
  justify-content: space-between;
  font: inherit;
  cursor: pointer;
}

.share-candidate-select span,
.share-candidate-link-box__value {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.share-candidate-field__hint {
  display: block;
  margin-top: 12px;
  font-size: 0.84rem;
  font-style: italic;
  color: #a0a8b9;
}

.share-candidate-field__hint.is-right {
  text-align: right;
  font-style: normal;
}

.share-candidate-link-box {
  gap: 14px;
  margin-top: 24px;
}

.share-candidate-link-box__value {
  min-width: 0;
  color: #5c6880;
}

.share-candidate-link-box__value span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-candidate-link-box button {
  min-width: 126px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #ffd8ea;
  border-radius: 12px;
  background: #fff8fc;
  color: #f169b3;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.share-candidate-field--full {
  margin-top: 26px;
}

.share-candidate-recipients {
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 12px;
  padding-bottom: 12px;
}

.share-candidate-recipients span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff1f8;
  color: #f169b3;
}

.share-candidate-recipients i {
  font-style: normal;
}

.share-candidate-field textarea {
  min-height: 112px;
  padding-top: 14px;
  padding-bottom: 14px;
  resize: none;
  font: inherit;
}

.share-candidate-modal__footer {
  padding: 20px 28px 28px;
}

.share-candidate-button {
  justify-content: center;
  min-width: 114px;
  height: 44px;
  padding: 0 22px;
  border-radius: 12px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.share-candidate-button--ghost {
  border: 0;
  background: transparent;
  color: #2d3649;
}

.share-candidate-button--primary {
  border: 0;
  background: linear-gradient(90deg, #f26eb7 0%, #ea63ad 100%);
  color: #fff;
  box-shadow: 0 18px 30px rgba(234, 99, 173, 0.2);
}

@media (max-width: 860px) {
  .share-candidate-mode-grid,
  .share-candidate-two-col {
    flex-direction: column;
    align-items: stretch;
  }

  .share-candidate-summary__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .share-candidate-modal__footer {
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .share-candidate-overlay {
    padding: 12px;
  }

  .share-candidate-modal {
    border-radius: 22px;
  }

  .share-candidate-modal__head,
  .share-candidate-modal__body,
  .share-candidate-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .share-candidate-summary__card {
    padding: 20px 18px 18px;
  }

  .share-candidate-summary__profile {
    align-items: flex-start;
  }

  .share-candidate-summary__stats {
    grid-template-columns: 1fr;
  }

  .share-candidate-link-box,
  .share-candidate-modal__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .share-candidate-link-box button,
  .share-candidate-button {
    width: 100%;
  }
}
</style>
