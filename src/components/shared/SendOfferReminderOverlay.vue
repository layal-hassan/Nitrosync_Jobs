<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'
import NitroSyncLogo from './NitroSyncLogo.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  candidateName: {
    type: String,
    default: 'Marvin McKinney',
  },
  candidateRole: {
    type: String,
    default: 'US Software Engineer',
  },
})

const emit = defineEmits(['close', 'send-reminder'])

const selectedTone = ref('friendly')
const selectedSchedule = ref('now')
const previewOpen = ref(false)
const previewDevice = ref('desktop')
const messageBody = ref(`Hi Marvin,

I just wanted to gently remind you about the offer we sent for the Senior Frontend Developer position.
We're excited about the possibility of you joining our team.
Please review the offer at your earliest convenience. Let us know if you have any questions.

Best regards,
Majda Razouqia
Team Lead`)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MM'
))

const candidateEmail = computed(() => `${props.candidateName.split(' ')[0]?.toLowerCase() || 'marvin'}.mckinney@email.com`)
const candidateFirstName = computed(() => props.candidateName.split(' ')[0] || 'Marvin')
const previewSubject = computed(() => 'Friendly reminder: Your offer from Nitrosync')

const ccRows = [
  ['Sarah Johnson', 'sarah.j@nitrosync.com', 'SJ', 'pink'],
  ['Majda R.', 'majda.r@nitrosync.com', 'M', 'violet'],
]

const reminderTypeRows = [
  ['friendly', 'Friendly reminder', 'A gentle nudge to review and accept the offer.', 'mail'],
  ['important', 'Important reminder', 'Highlight key details and next steps.', 'bell'],
  ['final', 'Final reminder', 'Final reminder before offer expiration.', 'clock'],
]

const activityRows = [
  ['Offer viewed', '2 times', 'checkCircle', 'green'],
  ['Total time spent', '6m 24s', 'clock', 'blue'],
  ['Viewed compensation', 'Yes', 'wallet', 'green'],
  ['Viewed benefits', 'No', 'gift', 'pink'],
  ['Downloaded offer', 'Yes', 'document', 'green'],
  ['Last activity', 'Yesterday, 11:18 AM', 'calendar', 'slate'],
]

const scheduleRows = [
  ['now', 'Send now', 'Send the reminder email immediately.', 'mail', 'pink'],
  ['later', 'Schedule for later', 'Pick a date and time to send.', 'calendar', 'slate'],
  ['auto', 'If no action in 48h', 'Send automatically if offer not accepted in 48 hours.', 'clock', 'green'],
  ['custom', 'Custom rule', 'Create a custom condition based on candidate activity.', 'clipboard-check', 'slate'],
]

const bodyOverflow = typeof document !== 'undefined' ? document.body.style.overflow : ''

watch(() => props.open, (isOpen) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = isOpen ? 'hidden' : bodyOverflow
}, { immediate: true })

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = bodyOverflow
  }
})

function closeOverlay() {
  previewOpen.value = false
  emit('close')
}

function openPreview() {
  previewOpen.value = true
}

function closePreview() {
  previewOpen.value = false
}

function submitReminder() {
  emit('send-reminder')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="send-offer-reminder-overlay" @click.self="closeOverlay">
      <section class="send-offer-reminder-modal" @click.stop>
        <header class="send-offer-reminder-header">
          <div class="send-offer-reminder-header__title">
            <span class="send-offer-reminder-header__icon">
              <AppIcon name="bell" :size="18" />
            </span>
            <div>
              <h2>Send Offer Reminder</h2>
              <p>Send a friendly reminder to help {{ candidateName.split(' ')[0] || 'Marvin' }} review and accept the offer.</p>
            </div>
          </div>

          <button type="button" class="send-offer-reminder-close" aria-label="Close" @click="closeOverlay">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <section class="send-offer-reminder-summary">
          <article class="send-offer-reminder-summary__offer">
            <span><AppIcon name="document" :size="16" /></span>
            <div>
              <strong>{{ candidateRole }} Offer</strong>
              <small>Offer ID: OFF-2026-1287</small>
              <button type="button">View offer details</button>
            </div>
          </article>

          <article class="send-offer-reminder-summary__candidate">
            <span>{{ candidateInitials }}</span>
            <div>
              <strong>{{ candidateName }}</strong>
              <small>{{ candidateEmail }}</small>
            </div>
          </article>

          <article>
            <span>Status</span>
            <strong>Waiting for Signature</strong>
            <small>Viewed yesterday, 11:18 AM</small>
          </article>

          <article>
            <span>Expires in</span>
            <strong>11 days</strong>
            <small>Jun 13, 2026</small>
          </article>
        </section>

        <div class="send-offer-reminder-layout">
          <section class="send-offer-reminder-main">
            <article class="send-offer-reminder-card">
              <h3>1. Recipient</h3>
              <div class="send-offer-reminder-field">
                <span>To (required)</span>
                <div class="send-offer-reminder-select">
                  <strong>{{ candidateName }} (Candidate)</strong>
                  <small>{{ candidateEmail }}</small>
                  <AppIcon name="chevronDown" :size="14" />
                </div>
              </div>

              <div class="send-offer-reminder-field">
                <span>CC (optional)</span>
                <div class="send-offer-reminder-cc">
                  <article v-for="item in ccRows" :key="item[0]">
                    <em :class="`is-${item[3]}`">{{ item[2] }}</em>
                    <div>
                      <strong>{{ item[0] }}</strong>
                      <small>{{ item[1] }}</small>
                    </div>
                    <button type="button" aria-label="Remove cc">
                      <AppIcon name="close" :size="12" />
                    </button>
                  </article>
                  <button type="button" class="send-offer-reminder-add">+ Add recipient</button>
                  <button type="button" class="send-offer-reminder-add">+ Add external CC</button>
                </div>
                <small>All internal recipients will be added in BCC and are not visible to the candidate.</small>
              </div>
            </article>

            <article class="send-offer-reminder-card">
              <h3>2. Reminder type</h3>
              <div class="send-offer-reminder-types">
                <button
                  v-for="item in reminderTypeRows"
                  :key="item[0]"
                  type="button"
                  class="send-offer-reminder-type"
                  :class="{ 'is-active': selectedTone === item[0] }"
                  @click="selectedTone = item[0]"
                >
                  <span><AppIcon :name="item[3]" :size="14" /></span>
                  <strong>{{ item[1] }}</strong>
                  <small>{{ item[2] }}</small>
                </button>
              </div>
            </article>

            <article class="send-offer-reminder-card">
              <div class="send-offer-reminder-card__head">
                <h3>3. Message</h3>
                <button type="button">Insert variable <AppIcon name="chevronDown" :size="13" /></button>
              </div>

              <div class="send-offer-reminder-toolbar">
                <button type="button">Tone</button>
                <button type="button">Friendly</button>
              </div>

              <div class="send-offer-reminder-editor">
                <div class="send-offer-reminder-editor__tools">
                  <button type="button">Normal</button>
                  <button type="button"><strong>B</strong></button>
                  <button type="button"><em>I</em></button>
                  <button type="button"><u>U</u></button>
                  <button type="button"><AppIcon name="list" :size="13" /></button>
                  <button type="button"><AppIcon name="link" :size="13" /></button>
                </div>
                <textarea v-model="messageBody" />
              </div>
            </article>

            <article class="send-offer-reminder-card">
              <h3>4. When to send</h3>
              <div class="send-offer-reminder-schedule">
                <button
                  v-for="item in scheduleRows"
                  :key="item[0]"
                  type="button"
                  class="send-offer-reminder-option"
                  :class="{ 'is-active': selectedSchedule === item[0] }"
                  @click="selectedSchedule = item[0]"
                >
                  <span :class="`is-${item[4]}`"><AppIcon :name="item[3]" :size="14" /></span>
                  <strong>{{ item[1] }}</strong>
                  <small>{{ item[2] }}</small>
                </button>
              </div>
            </article>
          </section>

          <aside class="send-offer-reminder-side">
            <article class="send-offer-reminder-card">
              <h3>Candidate activity</h3>
              <div class="send-offer-reminder-activity">
                <article v-for="item in activityRows" :key="item[0]">
                  <div>
                    <AppIcon :name="item[2]" :size="13" />
                    <span>{{ item[0] }}</span>
                  </div>
                  <strong :class="`is-${item[3]}`">{{ item[1] }}</strong>
                </article>
              </div>
            </article>

            <article class="send-offer-reminder-card">
              <h3>Reminder history</h3>
              <div class="send-offer-reminder-empty">
                <p>No reminders sent yet.</p>
                <small>This will be the first reminder.</small>
              </div>
            </article>

            <article class="send-offer-reminder-card">
              <div class="send-offer-reminder-card__head">
                <h3>Email preview</h3>
                <button type="button" @click="openPreview">Preview <AppIcon name="external-link" :size="12" /></button>
              </div>
              <div class="send-offer-reminder-preview">
                <strong>Subject: {{ previewSubject }}</strong>
                <p>{{ messageBody }}</p>
              </div>
              <div class="send-offer-reminder-link">
                <span>Offer link (for reference)</span>
                <div>
                  <small>https://offer.nitrosync.com/off/2026-1287</small>
                  <button type="button"><AppIcon name="copy" :size="13" /></button>
                </div>
              </div>
            </article>
          </aside>
        </div>

        <footer class="send-offer-reminder-footer">
          <button type="button" class="send-offer-reminder-footer__ghost" @click="closeOverlay">Cancel</button>
          <div class="send-offer-reminder-footer__actions">
            <button type="button" class="send-offer-reminder-footer__secondary" @click="openPreview">Preview email</button>
            <button type="button" class="send-offer-reminder-footer__secondary">Save as template</button>
            <button type="button" class="send-offer-reminder-footer__primary" @click="submitReminder">
              <AppIcon name="mail" :size="14" />
              <span>Send reminder</span>
            </button>
          </div>
        </footer>
      </section>

    </div>

    <section v-if="open && previewOpen" class="send-offer-reminder-preview-layer" @click.self="closePreview">
      <div class="send-offer-reminder-preview-modal" @click.stop>
        <header class="send-offer-reminder-preview-modal__header">
          <div class="send-offer-reminder-preview-modal__title">
            <span class="send-offer-reminder-preview-modal__title-icon">
              <AppIcon name="eye" :size="18" />
            </span>
            <div>
              <h2>Preview Email</h2>
              <p>This is how your email will look to the recipient.</p>
            </div>
          </div>

          <div class="send-offer-reminder-preview-modal__controls">
            <div class="send-offer-reminder-preview-modal__devices">
              <button
                type="button"
                :class="{ 'is-active': previewDevice === 'desktop' }"
                @click="previewDevice = 'desktop'"
              >
                <AppIcon name="grid" :size="14" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                :class="{ 'is-active': previewDevice === 'mobile' }"
                @click="previewDevice = 'mobile'"
              >
                <AppIcon name="phone" :size="14" />
                <span>Mobile</span>
              </button>
            </div>

            <button type="button" class="send-offer-reminder-preview-modal__close" aria-label="Close preview" @click="closePreview">
              <AppIcon name="close" :size="16" />
            </button>
          </div>
        </header>

        <div class="send-offer-reminder-preview-modal__body" :class="`is-${previewDevice}`">
          <section class="send-offer-reminder-preview-canvas">
            <div class="send-offer-reminder-preview-envelope">
              <div class="send-offer-reminder-preview-envelope__meta">
                <div>
                  <span>From</span>
                  <strong>Majda Razouqia &lt;offers@nitrosync.com&gt;</strong>
                </div>
                <div>
                  <span>To</span>
                  <strong>{{ candidateName }} &lt;{{ candidateEmail }}&gt;</strong>
                </div>
                <div>
                  <span>Subject</span>
                  <strong>{{ previewSubject }}</strong>
                </div>
              </div>

              <article class="send-offer-reminder-preview-email">
                <div class="send-offer-reminder-preview-email__brand">
                  <NitroSyncLogo size="xs" :show-tagline="false" />
                </div>

                <div class="send-offer-reminder-preview-email__body">
                  <p>Hi {{ candidateFirstName }},</p>
                  <p>{{ messageBody.split('\n\n')[1] }}</p>
                  <p>{{ messageBody.split('\n\n')[2] }}</p>
                  <p>Best regards,</p>
                  <p>Majda Razouqia<br>Team Lead, Talent Acquisition<br>Nitrosync</p>
                </div>

                <div class="send-offer-reminder-preview-email__offer">
                  <div>
                    <span><AppIcon name="document" :size="16" /></span>
                    <div>
                      <strong>{{ candidateRole }} Offer</strong>
                      <small>Offer ID: OFF-2026-1287</small>
                    </div>
                  </div>
                  <button type="button">View offer &amp; accept</button>
                </div>

                <div class="send-offer-reminder-preview-email__notice">
                  <span><AppIcon name="shield" :size="16" /></span>
                  <div>
                    <strong>Secure and private</strong>
                    <small>This offer is personal to you and should not be shared with others.</small>
                  </div>
                </div>

                <footer class="send-offer-reminder-preview-email__footer">
                  <small>Need help? Reply to this email or contact us at support@nitrosync.com</small>
                  <small>&copy; 2026 Nitrosync. All rights reserved.</small>
                </footer>
              </article>
            </div>
          </section>

          <aside class="send-offer-reminder-preview-side">
            <article class="send-offer-reminder-preview-panel">
              <h3>Email details</h3>
              <div class="send-offer-reminder-preview-detail-list">
                <div>
                  <span><AppIcon name="user" :size="14" /></span>
                  <div>
                    <small>From</small>
                    <strong>Majda Razouqia &lt;offers@nitrosync.com&gt;</strong>
                  </div>
                </div>
                <div>
                  <span><AppIcon name="mail" :size="14" /></span>
                  <div>
                    <small>To</small>
                    <strong>{{ candidateName }} &lt;{{ candidateEmail }}&gt;</strong>
                  </div>
                </div>
                <div>
                  <span><AppIcon name="document" :size="14" /></span>
                  <div>
                    <small>Subject</small>
                    <strong>{{ previewSubject }}</strong>
                  </div>
                </div>
                <div>
                  <span><AppIcon name="calendar" :size="14" /></span>
                  <div>
                    <small>Scheduled to send</small>
                    <strong>{{ selectedSchedule === 'later' ? 'Scheduled for later' : 'Send now' }}</strong>
                  </div>
                </div>
              </div>
              <button type="button" class="send-offer-reminder-preview-panel__link" @click="closePreview">Edit details</button>
            </article>

            <article class="send-offer-reminder-preview-panel">
              <h3>Personalization</h3>
              <div class="send-offer-reminder-preview-personalization">
                <div>
                  <strong>{{ candidateFirstName }}</strong>
                  <small>Candidate first name</small>
                </div>
                <div>
                  <strong>{{ candidateRole }} Offer</strong>
                  <small>Job title</small>
                </div>
                <div>
                  <strong>{{ candidateRole }}</strong>
                  <small>Position</small>
                </div>
                <div>
                  <strong>Nitrosync</strong>
                  <small>Company name</small>
                </div>
              </div>
              <button type="button" class="send-offer-reminder-preview-panel__link">Manage variables</button>
            </article>

            <article class="send-offer-reminder-preview-panel">
              <h3>Tips for better response</h3>
              <div class="send-offer-reminder-preview-tips">
                <div><AppIcon name="checkCircle" :size="14" /><span>Friendly tone increases response rate by 34%</span></div>
                <div><AppIcon name="checkCircle" :size="14" /><span>Including direct link to the offer helps</span></div>
                <div><AppIcon name="checkCircle" :size="14" /><span>Short and clear messages get higher replies</span></div>
                <div><AppIcon name="checkCircle" :size="14" /><span>Best time to send: Tue - Thu, 9 AM - 11 AM</span></div>
              </div>
              <button type="button" class="send-offer-reminder-preview-panel__link">Learn more about email best practices</button>
            </article>
          </aside>
        </div>

        <footer class="send-offer-reminder-preview-modal__footer">
          <button type="button" class="send-offer-reminder-footer__ghost" @click="closePreview">Close</button>
          <div class="send-offer-reminder-preview-modal__footer-actions">
            <button type="button" class="send-offer-reminder-footer__secondary">
              <AppIcon name="document" :size="14" />
              <span>Download email</span>
            </button>
            <button type="button" class="send-offer-reminder-footer__primary" @click="closePreview">
              <AppIcon name="mail" :size="14" />
              <span>Use this email</span>
            </button>
          </div>
        </footer>
      </div>
    </section>
  </Teleport>
</template>

<style scoped>
.send-offer-reminder-overlay,
.send-offer-reminder-overlay * {
  box-sizing: border-box;
}

.send-offer-reminder-overlay {
  position: fixed;
  inset: 0;
  z-index: 1450;
  padding: 18px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(10px);
}

.send-offer-reminder-modal {
  width: min(1380px, calc(100vw - 36px));
  margin: 0 auto;
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.22);
}

.send-offer-reminder-header,
.send-offer-reminder-header__title,
.send-offer-reminder-header__actions,
.send-offer-reminder-summary,
.send-offer-reminder-summary__offer,
.send-offer-reminder-summary__candidate,
.send-offer-reminder-card__head,
.send-offer-reminder-toolbar,
.send-offer-reminder-editor__tools,
.send-offer-reminder-activity article,
.send-offer-reminder-link div,
.send-offer-reminder-footer,
.send-offer-reminder-footer__actions {
  display: flex;
  align-items: center;
}

.send-offer-reminder-header,
.send-offer-reminder-summary,
.send-offer-reminder-layout,
.send-offer-reminder-footer {
  padding: 18px 22px;
}

.send-offer-reminder-header {
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid #edf1f8;
}

.send-offer-reminder-header__title {
  gap: 12px;
}

.send-offer-reminder-header__icon,
.send-offer-reminder-summary__offer > span,
.send-offer-reminder-type span,
.send-offer-reminder-option span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ff2d87;
  background: #fff1f7;
}

.send-offer-reminder-header h2,
.send-offer-reminder-card h3,
.send-offer-reminder-summary strong,
.send-offer-reminder-field strong,
.send-offer-reminder-type strong,
.send-offer-reminder-option strong,
.send-offer-reminder-activity strong,
.send-offer-reminder-preview strong {
  margin: 0;
  color: #1f2c4f;
}

.send-offer-reminder-header p,
.send-offer-reminder-summary span,
.send-offer-reminder-summary small,
.send-offer-reminder-field span,
.send-offer-reminder-field small,
.send-offer-reminder-type small,
.send-offer-reminder-option small,
.send-offer-reminder-activity span,
.send-offer-reminder-empty p,
.send-offer-reminder-empty small,
.send-offer-reminder-preview p,
.send-offer-reminder-link span,
.send-offer-reminder-link small {
  margin: 0;
  color: #7d8cab;
}

.send-offer-reminder-close,
.send-offer-reminder-header__actions button,
.send-offer-reminder-card__head button,
.send-offer-reminder-toolbar button,
.send-offer-reminder-editor__tools button,
.send-offer-reminder-footer__ghost,
.send-offer-reminder-footer__secondary,
.send-offer-reminder-footer__primary,
.send-offer-reminder-add {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #223251;
  background: #fff;
  font-size: 0.72rem;
  font-weight: 800;
}

.send-offer-reminder-close {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.send-offer-reminder-summary {
  gap: 12px;
  border-bottom: 1px solid #edf1f8;
}

.send-offer-reminder-summary > article {
  min-height: 84px;
  padding: 14px 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
  flex: 1 1 0;
}

.send-offer-reminder-summary__offer,
.send-offer-reminder-summary__candidate {
  gap: 12px;
}

.send-offer-reminder-summary__offer {
  flex: 1.4 1 0;
}

.send-offer-reminder-summary__offer button {
  margin-top: 8px;
  padding: 0;
  border: 0;
  color: #ff2d87;
  background: transparent;
  font-size: 0.72rem;
  font-weight: 800;
}

.send-offer-reminder-summary__candidate > span {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(180deg, #24345a 0%, #121826 100%);
  font-size: 0.78rem;
  font-weight: 800;
}

.send-offer-reminder-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 320px;
  gap: 16px;
  align-items: start;
}

.send-offer-reminder-main,
.send-offer-reminder-side,
.send-offer-reminder-cc,
.send-offer-reminder-types,
.send-offer-reminder-schedule,
.send-offer-reminder-activity {
  display: grid;
  gap: 14px;
}

.send-offer-reminder-card {
  padding: 16px;
  border: 1px solid #edf1f8;
  border-radius: 16px;
  background: #fff;
}

.send-offer-reminder-card h3 {
  margin-bottom: 14px;
}

.send-offer-reminder-field + .send-offer-reminder-field {
  margin-top: 14px;
}

.send-offer-reminder-select {
  margin-top: 8px;
  padding: 12px 14px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 10px;
  align-items: center;
}

.send-offer-reminder-select small {
  grid-column: 1 / 2;
}

.send-offer-reminder-cc {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 8px;
}

.send-offer-reminder-cc article {
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #e5ebf5;
  border-radius: 12px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.send-offer-reminder-cc em {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.send-offer-reminder-cc em.is-pink { background: #ff77ac; }
.send-offer-reminder-cc em.is-violet { background: #8b7bff; }

.send-offer-reminder-cc article button {
  padding: 0;
  border: 0;
  color: #94a3b8;
  background: transparent;
}

.send-offer-reminder-add {
  justify-content: center;
}

.send-offer-reminder-types {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.send-offer-reminder-type,
.send-offer-reminder-option {
  padding: 14px;
  border: 1px solid #e5ebf5;
  border-radius: 14px;
  display: grid;
  justify-items: start;
  gap: 8px;
  color: #223251;
  background: #fff;
  text-align: left;
}

.send-offer-reminder-type.is-active,
.send-offer-reminder-option.is-active {
  border-color: #ff9cc5;
  background: #fff7fb;
  box-shadow: inset 0 0 0 1px #ffd7e8;
}

.send-offer-reminder-card__head {
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.send-offer-reminder-toolbar {
  gap: 8px;
  margin-bottom: 10px;
}

.send-offer-reminder-editor {
  border: 1px solid #dfe6f2;
  border-radius: 14px;
  overflow: hidden;
}

.send-offer-reminder-editor__tools {
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid #edf1f8;
  background: #fbfcfe;
}

.send-offer-reminder-editor__tools button {
  min-height: 28px;
  padding: 0 10px;
  border-radius: 8px;
}

.send-offer-reminder-editor textarea {
  width: 100%;
  min-height: 170px;
  padding: 14px;
  border: 0;
  resize: vertical;
  color: #223251;
  font: inherit;
}

.send-offer-reminder-schedule {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.send-offer-reminder-option span.is-pink {
  color: #ff2d87;
  background: #fff1f7;
}

.send-offer-reminder-option span.is-green {
  color: #16a34a;
  background: #effcf4;
}

.send-offer-reminder-option span.is-slate {
  color: #64748b;
  background: #f6f8fb;
}

.send-offer-reminder-activity article {
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #edf1f8;
}

.send-offer-reminder-activity article:last-child {
  border-bottom: 0;
}

.send-offer-reminder-activity article > div {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.send-offer-reminder-activity strong.is-green { color: #16a34a; }
.send-offer-reminder-activity strong.is-pink { color: #ff2d87; }
.send-offer-reminder-activity strong.is-blue { color: #2563eb; }
.send-offer-reminder-activity strong.is-slate { color: #64748b; }

.send-offer-reminder-empty {
  padding: 22px 14px;
  border: 1px dashed #dfe6f2;
  border-radius: 14px;
  text-align: center;
}

.send-offer-reminder-preview {
  max-height: 220px;
  padding: 14px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  overflow: auto;
  background: #fbfcfe;
}

.send-offer-reminder-preview p {
  margin-top: 10px;
  white-space: pre-wrap;
  line-height: 1.5;
}

.send-offer-reminder-link {
  margin-top: 14px;
}

.send-offer-reminder-link div {
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
}

.send-offer-reminder-link div button {
  padding: 0;
  border: 0;
  color: #8b7bff;
  background: transparent;
}

.send-offer-reminder-footer {
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #edf1f8;
}

.send-offer-reminder-footer__actions {
  gap: 10px;
}

.send-offer-reminder-footer__primary {
  color: #fff;
  border-color: #5b49ff;
  background: linear-gradient(135deg, #6d5cff 0%, #4f46e5 100%);
}

.send-offer-reminder-preview-layer {
  position: fixed;
  inset: 0;
  z-index: 1460;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(13, 20, 36, 0.48);
  backdrop-filter: blur(7px);
}

.send-offer-reminder-preview-modal {
  width: min(1320px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  border: 1px solid #e8edf6;
  border-radius: 22px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.28);
}

.send-offer-reminder-preview-modal__header,
.send-offer-reminder-preview-modal__title,
.send-offer-reminder-preview-modal__controls,
.send-offer-reminder-preview-modal__devices,
.send-offer-reminder-preview-envelope__meta,
.send-offer-reminder-preview-email__brand,
.send-offer-reminder-preview-email__offer > div,
.send-offer-reminder-preview-email__notice,
.send-offer-reminder-preview-detail-list > div,
.send-offer-reminder-preview-tips > div,
.send-offer-reminder-preview-modal__footer,
.send-offer-reminder-preview-modal__footer-actions {
  display: flex;
  align-items: center;
}

.send-offer-reminder-preview-modal__header,
.send-offer-reminder-preview-modal__footer {
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
  border-bottom: 1px solid #edf1f8;
}

.send-offer-reminder-preview-modal__footer {
  border-top: 1px solid #edf1f8;
  border-bottom: 0;
}

.send-offer-reminder-preview-modal__title {
  gap: 12px;
}

.send-offer-reminder-preview-modal__title h2,
.send-offer-reminder-preview-panel h3,
.send-offer-reminder-preview-email__offer strong,
.send-offer-reminder-preview-detail-list strong,
.send-offer-reminder-preview-personalization strong {
  margin: 0;
  color: #1f2c4f;
}

.send-offer-reminder-preview-modal__title p,
.send-offer-reminder-preview-envelope__meta span,
.send-offer-reminder-preview-envelope__meta strong,
.send-offer-reminder-preview-email__body p,
.send-offer-reminder-preview-email__offer small,
.send-offer-reminder-preview-email__notice small,
.send-offer-reminder-preview-email__footer small,
.send-offer-reminder-preview-detail-list small,
.send-offer-reminder-preview-personalization small,
.send-offer-reminder-preview-tips span {
  margin: 0;
  color: #7d8cab;
}

.send-offer-reminder-preview-modal__title-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7c5cff;
  background: #f3efff;
}

.send-offer-reminder-preview-modal__devices {
  gap: 8px;
}

.send-offer-reminder-preview-modal__devices button,
.send-offer-reminder-preview-modal__close,
.send-offer-reminder-preview-panel__link {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid #dfe6f2;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  background: #fff;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
}

.send-offer-reminder-preview-modal__devices button.is-active {
  color: #ff2d87;
  border-color: #ffb8d4;
  background: #fff5fa;
}

.send-offer-reminder-preview-modal__close {
  width: 36px;
  padding: 0;
  justify-content: center;
}

.send-offer-reminder-preview-modal__body {
  min-height: 0;
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) 320px;
  gap: 18px;
  overflow: auto;
  background: #fbfcff;
}

.send-offer-reminder-preview-modal__body.is-mobile {
  grid-template-columns: minmax(0, 1fr) 280px;
}

.send-offer-reminder-preview-envelope {
  min-height: 100%;
  padding: 18px;
  border: 1px solid #e8edf6;
  border-radius: 20px;
  background: #fff;
}

.send-offer-reminder-preview-envelope__meta {
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #edf1f8;
}

.send-offer-reminder-preview-envelope__meta > div {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.send-offer-reminder-preview-email {
  width: min(100%, 760px);
  margin: 22px auto 0;
  padding: 26px;
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 16px 38px rgba(148, 163, 184, 0.12);
}

.send-offer-reminder-preview-modal__body.is-mobile .send-offer-reminder-preview-email {
  width: min(100%, 410px);
}

.send-offer-reminder-preview-email__brand {
  gap: 10px;
  margin-bottom: 24px;
  color: #1f2c4f;
}

.send-offer-reminder-preview-email__body {
  display: grid;
  gap: 16px;
  line-height: 1.65;
}

.send-offer-reminder-preview-email__body p {
  color: #334155;
}

.send-offer-reminder-preview-email__offer,
.send-offer-reminder-preview-email__notice {
  margin-top: 22px;
  padding: 16px 18px;
  border-radius: 16px;
}

.send-offer-reminder-preview-email__offer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid #ebe6ff;
  background: linear-gradient(135deg, #fff7fb 0%, #f6f3ff 100%);
}

.send-offer-reminder-preview-email__offer > div {
  gap: 12px;
}

.send-offer-reminder-preview-email__offer > div > span,
.send-offer-reminder-preview-email__notice > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.send-offer-reminder-preview-email__offer > div > span {
  color: #ff2d87;
  background: #fff;
}

.send-offer-reminder-preview-email__offer button {
  min-height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #6d5cff 0%, #4f46e5 100%);
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
}

.send-offer-reminder-preview-email__notice {
  gap: 12px;
  border: 1px solid #e6edff;
  background: #f7f9ff;
}

.send-offer-reminder-preview-email__notice > span {
  color: #6d5cff;
  background: #fff;
}

.send-offer-reminder-preview-email__footer {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf1f8;
  display: grid;
  gap: 8px;
  text-align: center;
}

.send-offer-reminder-preview-side {
  display: grid;
  gap: 16px;
  align-content: start;
}

.send-offer-reminder-preview-panel {
  padding: 16px;
  border: 1px solid #e8edf6;
  border-radius: 18px;
  background: #fff;
}

.send-offer-reminder-preview-panel h3 {
  margin-bottom: 14px;
}

.send-offer-reminder-preview-detail-list,
.send-offer-reminder-preview-personalization,
.send-offer-reminder-preview-tips {
  display: grid;
  gap: 12px;
}

.send-offer-reminder-preview-detail-list > div {
  gap: 10px;
  align-items: flex-start;
}

.send-offer-reminder-preview-detail-list > div > span {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #7c5cff;
  background: #f6f3ff;
  flex: 0 0 28px;
}

.send-offer-reminder-preview-detail-list > div > div,
.send-offer-reminder-preview-personalization > div {
  display: grid;
  gap: 4px;
}

.send-offer-reminder-preview-personalization {
  grid-template-columns: 1fr 1fr;
}

.send-offer-reminder-preview-personalization > div {
  padding: 12px;
  border: 1px solid #edf1f8;
  border-radius: 14px;
  background: #fbfcff;
}

.send-offer-reminder-preview-tips > div {
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
}

.send-offer-reminder-preview-tips :deep(svg) {
  color: #16a34a;
}

.send-offer-reminder-preview-panel__link {
  min-height: auto;
  padding: 0;
  margin-top: 14px;
  border: 0;
  border-radius: 0;
  color: #6d5cff;
  background: transparent;
}

.send-offer-reminder-preview-modal__footer-actions {
  gap: 10px;
}

@media (max-width: 1180px) {
  .send-offer-reminder-layout,
  .send-offer-reminder-summary,
  .send-offer-reminder-cc,
  .send-offer-reminder-schedule {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }

  .send-offer-reminder-summary__offer {
    grid-column: 1 / -1;
  }

  .send-offer-reminder-preview-modal__body,
  .send-offer-reminder-preview-modal__body.is-mobile {
    grid-template-columns: 1fr;
  }

  .send-offer-reminder-preview-envelope__meta,
  .send-offer-reminder-preview-personalization {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }
}

@media (max-width: 760px) {
  .send-offer-reminder-overlay {
    padding: 12px;
  }

  .send-offer-reminder-modal {
    width: min(100%, calc(100vw - 24px));
  }

  .send-offer-reminder-header,
  .send-offer-reminder-summary,
  .send-offer-reminder-layout,
  .send-offer-reminder-cc,
  .send-offer-reminder-types,
  .send-offer-reminder-schedule,
  .send-offer-reminder-footer {
    grid-template-columns: 1fr;
    display: grid;
  }

  .send-offer-reminder-preview-layer {
    padding: 12px;
  }

  .send-offer-reminder-preview-modal {
    width: min(100%, calc(100vw - 24px));
    max-height: calc(100vh - 24px);
  }

  .send-offer-reminder-preview-modal__header,
  .send-offer-reminder-preview-modal__footer,
  .send-offer-reminder-preview-envelope__meta,
  .send-offer-reminder-preview-email__offer,
  .send-offer-reminder-preview-personalization {
    display: grid;
    grid-template-columns: 1fr;
  }

  .send-offer-reminder-preview-modal__controls {
    justify-content: space-between;
  }

  .send-offer-reminder-preview-modal__body,
  .send-offer-reminder-preview-modal__body.is-mobile {
    padding: 16px;
  }

  .send-offer-reminder-preview-email {
    padding: 18px;
  }
}
</style>
