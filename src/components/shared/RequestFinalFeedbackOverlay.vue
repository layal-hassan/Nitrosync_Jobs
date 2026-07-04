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
    default: 'Michael Chen',
  },
  candidateRole: {
    type: String,
    default: 'Senior Software Engineer',
  },
})

const emit = defineEmits(['close', 'send-request'])

let previousBodyOverflow = ''
let previousHtmlOverflow = ''

const reminderOptions = [
  ['now', 'Send now', 'alert'],
  ['24h', 'In 24 hours', 'clock'],
  ['2d', 'In 2 days', 'calendar'],
  ['custom', 'Custom date', 'calendar'],
]

const reviewers = ref([
  { id: 'priya', name: 'Priya Patel', role: 'Product Manager', stage: 'Validation Interview', pending: true, due: 'Due now', selected: true, initials: 'PP' },
  { id: 'james', name: 'James Lee', role: 'Engineering Manager', stage: 'Validation Interview', pending: true, due: 'Due now', selected: true, initials: 'JL' },
])

const personalMessage = ref('')
const selectedReminder = ref('now')

const selectedCount = computed(() => reviewers.value.filter((item) => item.selected).length)
const messageCount = computed(() => personalMessage.value.length)

const previewNames = computed(() => reviewers.value
  .filter((item) => item.selected)
  .map((item) => item.name)
  .join(' and '))

function resetForm() {
  reviewers.value = reviewers.value.map((item) => ({ ...item, selected: true }))
  selectedReminder.value = 'now'
  personalMessage.value = [
    'Hi team, just a gentle reminder to share your final feedback for this candidate.',
    'Your feedback helps us make a confident and fair hiring decision.',
    'Thank you!',
  ].join('\n')
}

function closeOverlay() {
  emit('close')
}

function toggleReviewer(id) {
  reviewers.value = reviewers.value.map((item) => (
    item.id === id ? { ...item, selected: !item.selected } : item
  ))
}

function selectAll() {
  reviewers.value = reviewers.value.map((item) => ({ ...item, selected: true }))
}

function clearAll() {
  reviewers.value = reviewers.value.map((item) => ({ ...item, selected: false }))
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

    if (isOpen) {
      resetForm()
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="request-final-feedback-overlay" @click.self="closeOverlay">
      <section class="request-final-feedback-modal">
        <header class="request-final-feedback-modal__head">
          <div class="request-final-feedback-modal__title">
            <span><AppIcon name="message" :size="20" /></span>
            <div>
              <h2>Request Final Feedback</h2>
              <p>Request the remaining final evaluations before we can make a hiring decision.</p>
            </div>
          </div>

          <button type="button" aria-label="Close request final feedback" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="request-final-feedback-modal__body">
          <section class="request-final-feedback-status">
            <div class="request-final-feedback-status__meter">
              <h3>Final Feedback Status</h3>
              <div class="request-final-feedback-status__ring">
                <div>
                  <strong>2 / 4</strong>
                  <small>Submitted</small>
                </div>
              </div>
            </div>

            <div class="request-final-feedback-status__column">
              <small>Completed (2)</small>
              <article>
                <span class="is-complete">SJ</span>
                <div>
                  <strong>Sarah Johnson</strong>
                  <p>Interview Round 2</p>
                  <em>Submitted 2 days ago</em>
                </div>
              </article>
              <article>
                <span class="is-complete">DK</span>
                <div>
                  <strong>David Kim</strong>
                  <p>Technical Lead</p>
                  <em>Submitted 1 day ago</em>
                </div>
              </article>
            </div>

            <div class="request-final-feedback-status__column">
              <small>Pending (2)</small>
              <article>
                <span class="is-pending">PP</span>
                <div>
                  <strong>Priya Patel</strong>
                  <p>Product Manager</p>
                </div>
              </article>
              <article>
                <span class="is-pending">JL</span>
                <div>
                  <strong>James Lee</strong>
                  <p>Engineering Manager</p>
                </div>
              </article>
            </div>

            <aside class="request-final-feedback-status__recommendation">
              <small>
                <AppIcon name="sparkles" :size="14" />
                AI Recommendation
              </small>
              <p>The hiring decision cannot proceed until feedback from the remaining reviewers is received.</p>
              <p>Both reviewers evaluated required competencies for this role.</p>
            </aside>
          </section>

          <section class="request-final-feedback-section">
            <div class="request-final-feedback-section__head">
              <div>
                <h3>Who do you want to request feedback from?</h3>
                <p>We'll send a reminder to the selected reviewers.</p>
              </div>

              <div class="request-final-feedback-section__actions">
                <button type="button" @click="selectAll">Select all</button>
                <i />
                <button type="button" @click="clearAll">Clear all</button>
              </div>
            </div>

            <div class="request-final-feedback-reviewers">
              <button
                v-for="item in reviewers"
                :key="item.id"
                type="button"
                class="request-final-feedback-reviewer"
                :class="{ 'is-selected': item.selected }"
                @click="toggleReviewer(item.id)"
              >
                <span class="request-final-feedback-reviewer__check">
                  <AppIcon v-if="item.selected" name="check" :size="14" />
                </span>
                <span class="request-final-feedback-reviewer__avatar">{{ item.initials }}</span>
                <div class="request-final-feedback-reviewer__copy">
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.role }}</small>
                  <em>{{ item.stage }}</em>
                </div>
                <div class="request-final-feedback-reviewer__status">
                  <strong>Pending</strong>
                  <small>{{ item.due }}</small>
                </div>
              </button>
            </div>

            <div class="request-final-feedback-banner">
              <AppIcon name="info" :size="15" />
              <span>{{ selectedCount }} reviewers selected</span>
              <i>&bull;</i>
              <strong>Their feedback is required to complete the hiring decision.</strong>
            </div>
          </section>

          <div class="request-final-feedback-grid">
            <section class="request-final-feedback-section">
              <h3>Add a personal message <small>(optional)</small></h3>

              <div class="request-final-feedback-message">
                <textarea v-model="personalMessage" rows="5" maxlength="500" />
                <small>{{ messageCount }}/500</small>
              </div>
            </section>

            <aside class="request-final-feedback-why">
              <h3>Why this matters</h3>
              <ul>
                <li>Unlock the Hiring Decision</li>
                <li>Improve AI confidence</li>
                <li>Complete hiring committee review</li>
              </ul>
            </aside>
          </div>

          <section class="request-final-feedback-section">
            <h3>Reminder settings</h3>
            <div class="request-final-feedback-reminders">
              <button
                v-for="item in reminderOptions"
                :key="item[0]"
                type="button"
                :class="{ 'is-active': selectedReminder === item[0] }"
                @click="selectedReminder = item[0]"
              >
                <AppIcon :name="item[2]" :size="15" />
                <span>{{ item[1] }}</span>
              </button>
            </div>
          </section>

          <section class="request-final-feedback-preview">
            <span><AppIcon name="mail" :size="18" /></span>
            <div>
              <strong>Preview of reminder</strong>
              <p>{{ previewNames }}, you've been requested to provide final feedback for {{ candidateName }} — {{ candidateRole }}.</p>
              <small>This is a friendly reminder to help keep the hiring process on track.</small>
            </div>
            <button type="button" aria-label="Expand reminder preview">
              <AppIcon name="chevronDown" :size="16" />
            </button>
          </section>
        </div>

        <footer class="request-final-feedback-modal__footer">
          <button class="is-secondary" type="button" @click="closeOverlay">Cancel</button>
          <button class="is-primary" type="button" @click="submitRequest">
            <AppIcon name="alert" :size="15" />
            <span>Send Request</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.request-final-feedback-overlay {
  position: fixed;
  inset: 0;
  z-index: 1722;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(16, 24, 40, 0.34);
  backdrop-filter: blur(8px);
}

.request-final-feedback-modal {
  width: min(1080px, calc(100vw - 36px));
  max-height: calc(100vh - 36px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.28);
}

.request-final-feedback-modal__head,
.request-final-feedback-modal__title,
.request-final-feedback-status,
.request-final-feedback-status__column article,
.request-final-feedback-section__head,
.request-final-feedback-section__actions,
.request-final-feedback-reviewer,
.request-final-feedback-banner,
.request-final-feedback-grid,
.request-final-feedback-reminders,
.request-final-feedback-preview,
.request-final-feedback-modal__footer {
  display: flex;
  align-items: center;
}

.request-final-feedback-modal__head,
.request-final-feedback-section__head,
.request-final-feedback-modal__footer {
  justify-content: space-between;
}

.request-final-feedback-modal__head {
  padding: 20px 28px;
  border-bottom: 1px solid #edf1f7;
}

.request-final-feedback-modal__title {
  gap: 16px;
}

.request-final-feedback-modal__title > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff0f7;
  color: #ff5ca9;
}

.request-final-feedback-modal__title h2,
.request-final-feedback-section h3,
.request-final-feedback-status__meter h3,
.request-final-feedback-why h3 {
  margin: 0;
  color: #1f2940;
}

.request-final-feedback-modal__title p,
.request-final-feedback-section p,
.request-final-feedback-status__recommendation p,
.request-final-feedback-preview p,
.request-final-feedback-preview small {
  margin: 6px 0 0;
  color: #748197;
}

.request-final-feedback-modal__head button,
.request-final-feedback-preview button {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #96a4b8;
}

.request-final-feedback-modal__body {
  overflow: auto;
  padding: 24px;
}

.request-final-feedback-status,
.request-final-feedback-section,
.request-final-feedback-preview,
.request-final-feedback-why {
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: #fff;
}

.request-final-feedback-status {
  align-items: stretch;
  gap: 22px;
  padding: 22px;
}

.request-final-feedback-status__meter {
  width: 190px;
}

.request-final-feedback-status__ring {
  display: grid;
  place-items: center;
  width: 116px;
  height: 116px;
  margin-top: 22px;
  border-radius: 50%;
  background: conic-gradient(#f366b0 0deg 180deg, #f4d6e6 180deg 360deg);
}

.request-final-feedback-status__ring > div {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #fff;
}

.request-final-feedback-status__ring strong {
  color: #1f2940;
  font-size: 1.45rem;
}

.request-final-feedback-status__ring small,
.request-final-feedback-status__column small,
.request-final-feedback-status__recommendation small {
  color: #97a4b8;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
}

.request-final-feedback-status__column {
  flex: 1;
  padding-left: 22px;
  border-left: 1px solid #edf1f7;
}

.request-final-feedback-status__column article {
  gap: 12px;
  margin-top: 18px;
}

.request-final-feedback-status__column span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  background: linear-gradient(135deg, #d9a54b 0%, #2d3652 100%);
}

.request-final-feedback-status__column span.is-complete::after,
.request-final-feedback-status__column span.is-pending::after {
  content: '';
  position: absolute;
}

.request-final-feedback-status__column strong,
.request-final-feedback-reviewer__copy strong {
  display: block;
  color: #1f2940;
  font-size: 0.86rem;
}

.request-final-feedback-status__column p,
.request-final-feedback-reviewer__copy small {
  margin: 3px 0 0;
  color: #72819a;
  font-size: 0.74rem;
}

.request-final-feedback-status__column em {
  display: block;
  margin-top: 4px;
  color: #9aa6ba;
  font-size: 0.7rem;
  font-style: normal;
}

.request-final-feedback-status__recommendation {
  width: 210px;
  padding: 16px;
  border: 1px solid #f0deea;
  border-radius: 16px;
  background: #fffafe;
}

.request-final-feedback-status__recommendation small {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f456a2;
}

.request-final-feedback-section {
  margin-top: 18px;
  padding: 18px;
}

.request-final-feedback-section__actions {
  gap: 12px;
  color: #ef5ca7;
}

.request-final-feedback-section__actions button {
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 700;
}

.request-final-feedback-section__actions i {
  width: 1px;
  height: 18px;
  background: #e4dce7;
}

.request-final-feedback-reviewers {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.request-final-feedback-reviewer {
  gap: 12px;
  padding: 16px;
  border: 1px solid #f1dbe8;
  border-radius: 16px;
  background: #fff;
  text-align: left;
}

.request-final-feedback-reviewer.is-selected {
  background: #fffafd;
}

.request-final-feedback-reviewer__check,
.request-final-feedback-reviewer__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.request-final-feedback-reviewer__check {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f067b1;
  color: #fff;
  flex: 0 0 22px;
}

.request-final-feedback-reviewer__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.84rem;
  font-weight: 800;
  background: linear-gradient(135deg, #d99a52 0%, #2d3652 100%);
}

.request-final-feedback-reviewer__copy {
  min-width: 0;
}

.request-final-feedback-reviewer__copy em {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-top: 8px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef1ff;
  color: #5d61f5;
  font-size: 0.68rem;
  font-style: normal;
  font-weight: 700;
}

.request-final-feedback-reviewer__status {
  margin-left: auto;
  text-align: right;
}

.request-final-feedback-reviewer__status strong {
  display: block;
  color: #f39117;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
}

.request-final-feedback-reviewer__status small {
  display: block;
  margin-top: 4px;
  color: #a1abbd;
  font-size: 0.72rem;
}

.request-final-feedback-banner {
  gap: 10px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #f3f6ff;
  color: #5b63f2;
  font-size: 0.82rem;
}

.request-final-feedback-banner strong {
  font-weight: 700;
}

.request-final-feedback-grid {
  align-items: stretch;
  gap: 18px;
  margin-top: 18px;
}

.request-final-feedback-grid > *:first-child {
  flex: 1.8;
}

.request-final-feedback-grid > *:last-child {
  flex: 0.82;
}

.request-final-feedback-message {
  margin-top: 12px;
  padding: 16px;
  border: 1px solid #dce5f2;
  border-radius: 14px;
  background: #fff;
}

.request-final-feedback-message textarea {
  width: 100%;
  border: 0;
  resize: none;
  outline: none;
  background: transparent;
  color: #44566f;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.65;
}

.request-final-feedback-message small {
  display: block;
  margin-top: 10px;
  text-align: right;
  color: #9aa6ba;
  font-size: 0.72rem;
}

.request-final-feedback-why {
  padding: 20px;
  background: linear-gradient(180deg, #f5fff8 0%, #ffffff 100%);
  border-color: #d9f3e3;
}

.request-final-feedback-why ul {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.request-final-feedback-why li {
  position: relative;
  margin-top: 14px;
  padding-left: 22px;
  color: #43607b;
  font-size: 0.82rem;
}

.request-final-feedback-why li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #1ab05c;
  font-weight: 800;
}

.request-final-feedback-reminders {
  gap: 12px;
  margin-top: 14px;
}

.request-final-feedback-reminders button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  border: 1px solid #dce4f1;
  border-radius: 14px;
  background: #fff;
  color: #58677f;
  font: inherit;
  font-weight: 700;
}

.request-final-feedback-reminders button.is-active {
  border-color: #f26ab1;
  box-shadow: inset 0 0 0 1px #f26ab1;
  color: #f05da9;
}

.request-final-feedback-preview {
  gap: 14px;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid #e7edf6;
  border-radius: 18px;
  background: #fafcff;
  align-items: flex-start;
}

.request-final-feedback-preview > span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #fff0f7;
  color: #f25ca9;
  flex: 0 0 46px;
}

.request-final-feedback-preview strong {
  display: block;
  color: #1f2940;
  font-size: 0.9rem;
}

.request-final-feedback-preview p {
  color: #42566f;
  font-size: 0.9rem;
  line-height: 1.55;
}

.request-final-feedback-preview small {
  display: block;
  font-size: 0.8rem;
}

.request-final-feedback-modal__footer {
  padding: 18px 28px;
  border-top: 1px solid #edf1f7;
}

.request-final-feedback-modal__footer button {
  min-width: 120px;
  min-height: 44px;
  border-radius: 12px;
  font: inherit;
  font-weight: 700;
}

.request-final-feedback-modal__footer .is-secondary {
  border: 1px solid #dce4f1;
  background: #fff;
  color: #42566f;
}

.request-final-feedback-modal__footer .is-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  background: linear-gradient(90deg, #ff63af 0%, #f159a4 100%);
  color: #fff;
}

@media (max-width: 980px) {
  .request-final-feedback-status,
  .request-final-feedback-grid {
    display: grid;
  }

  .request-final-feedback-reviewers {
    grid-template-columns: 1fr;
  }

  .request-final-feedback-reminders {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .request-final-feedback-overlay {
    padding: 10px;
  }

  .request-final-feedback-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
  }

  .request-final-feedback-modal__head,
  .request-final-feedback-modal__body,
  .request-final-feedback-modal__footer {
    padding-left: 14px;
    padding-right: 14px;
  }

  .request-final-feedback-modal__footer {
    display: grid;
    gap: 12px;
  }

  .request-final-feedback-reminders {
    grid-template-columns: 1fr;
  }
}
</style>
