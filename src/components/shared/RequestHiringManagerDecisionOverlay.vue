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
    default: 'Senior Product Designer',
  },
  candidateStage: {
    type: String,
    default: 'Qualified',
  },
  candidateMatch: {
    type: String,
    default: '92% match',
  },
})

const emit = defineEmits(['close'])

const decisionOptions = [
  { id: 'approve-interview', title: 'Approve for Interview', icon: 'calendar' },
  { id: 'approve-final', title: 'Approve for Final Round', icon: 'user' },
  { id: 'approve-offer', title: 'Approve Offer', icon: 'document' },
  { id: 'reject', title: 'Reject', icon: 'close' },
  { id: 'feedback-only', title: 'Feedback Only', icon: 'message' },
]
const focusOptions = ['Team Fit', 'Leadership', 'Portfolio', 'Salary Alignment', 'Growth Potential', 'Other']
const dueDateOptions = ['Jun 24, 2026', 'Jun 25, 2026', 'Jun 27, 2026']
const responseItems = [
  {
    title: 'Recommendation',
    note: 'Proceed, Hold or Reject',
    icon: 'user',
  },
  {
    title: 'Confidence Score',
    note: 'Rate confidence from 1 (low) to 5 (high)',
    icon: 'chart-bars',
  },
  {
    title: 'Key Risks / Concerns',
    note: 'Any risks or concerns to consider',
    icon: 'alert',
  },
  {
    title: 'Hiring Notes',
    note: 'Additional comments and final thoughts',
    icon: 'message',
  },
]

const selectedDecision = ref(decisionOptions[0].id)
const selectedFocus = ref([])
const selectedDueDate = ref(dueDateOptions[0])
const message = ref('')

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const normalizedMatch = computed(() => props.candidateMatch.replace(/match/i, 'Match'))
const messageCount = computed(() => message.value.length)

function resetForm() {
  selectedDecision.value = decisionOptions[0].id
  selectedFocus.value = ['Team Fit', 'Leadership', 'Portfolio', 'Salary Alignment']
  selectedDueDate.value = dueDateOptions[0]
  message.value = [
    'Please review the candidate and share your recommendation.',
    'Let me know if you have any questions!',
  ].join('\n')
}

function toggleFocus(option) {
  if (selectedFocus.value.includes(option)) {
    selectedFocus.value = selectedFocus.value.filter((item) => item !== option)
    return
  }

  selectedFocus.value = [...selectedFocus.value, option]
}

function closeOverlay() {
  emit('close')
}

function submitRequest() {
  emit('close')
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
    <div v-if="open" class="hm-decision-overlay" @click.self="closeOverlay">
      <section class="hm-decision-modal">
        <header class="hm-decision-modal__head">
          <div class="hm-decision-modal__title">
            <span class="hm-decision-modal__title-icon">
              <AppIcon name="user" :size="22" />
            </span>
            <div>
              <h2>Request Hiring Manager Decision</h2>
              <p>Send a decision request to your hiring manager with AI insights and context.</p>
            </div>
          </div>

          <button class="hm-decision-modal__close" type="button" aria-label="Close request decision" @click="closeOverlay">
            <AppIcon name="close" :size="20" />
          </button>
        </header>

        <div class="hm-decision-modal__body">
          <aside class="hm-decision-sidebar">
            <article class="hm-decision-profile-card">
              <span class="hm-decision-profile-card__avatar">{{ candidateInitials }}</span>
              <strong>{{ candidateName }}</strong>
              <p>{{ candidateRole }}</p>

              <div class="hm-decision-profile-card__chips">
                <span>Strong Hire</span>
                <span>{{ normalizedMatch }}</span>
                <span>Low Risk</span>
              </div>

              <div class="hm-decision-profile-card__meta">
                <div>
                  <small>Stage</small>
                  <strong>{{ candidateStage }}</strong>
                </div>
                <div>
                  <small>Recommended Next Step</small>
                  <strong>HM Interview</strong>
                </div>
                <div>
                  <small>AI Summary</small>
                  <strong>Strong Hire · 92% Match · Low Risk</strong>
                  <span>Top strengths: Portfolio, Leadership, Design Thinking</span>
                  <span>Salary slightly above target range</span>
                </div>
              </div>

              <div class="hm-decision-profile-card__links">
                <button type="button"><AppIcon name="document" :size="13" /> Resume</button>
                <button type="button"><AppIcon name="edit" :size="13" /> Interview Notes</button>
                <button type="button"><AppIcon name="star" :size="13" /> Scorecards</button>
                <button type="button"><AppIcon name="clock" :size="13" /> Timeline</button>
              </div>
            </article>

            <article class="hm-decision-context-card">
              <div class="hm-decision-context-card__head">
                <strong>Context shared automatically</strong>
                <button type="button">Preview <AppIcon name="external-link" :size="13" /></button>
              </div>
              <p>Resume, interview notes, evaluations, timeline and AI assessment.</p>
            </article>
          </aside>

          <section class="hm-decision-main">
            <div class="hm-decision-section">
              <h3>1. Decision Needed <span>*</span></h3>
              <p>What decision or feedback are you requesting?</p>

              <div class="hm-decision-options">
                <button
                  v-for="option in decisionOptions"
                  :key="option.id"
                  class="hm-decision-option"
                  :class="{ 'is-selected': selectedDecision === option.id }"
                  type="button"
                  @click="selectedDecision = option.id"
                >
                  <span class="hm-decision-option__icon">
                    <AppIcon :name="option.icon" :size="18" />
                  </span>
                  <span>{{ option.title }}</span>
                  <i v-if="selectedDecision === option.id" />
                </button>
              </div>
            </div>

            <div class="hm-decision-row">
              <div class="hm-decision-section hm-decision-section--focus">
                <h3>2. Review Focus</h3>
                <p>What areas should the hiring manager evaluate?</p>

                <div class="hm-decision-focus-grid">
                  <button
                    v-for="option in focusOptions"
                    :key="option"
                    class="hm-decision-focus"
                    :class="{ 'is-selected': selectedFocus.includes(option) }"
                    type="button"
                    @click="toggleFocus(option)"
                  >
                    <span class="hm-decision-focus__check">
                      <AppIcon v-if="selectedFocus.includes(option)" name="check" :size="12" />
                    </span>
                    <span>{{ option }}</span>
                  </button>
                </div>
              </div>

              <div class="hm-decision-section hm-decision-section--due">
                <h3>3. Response Needed By <span>*</span></h3>
                <p>Set a due date for the hiring manager's response.</p>

                <button class="hm-decision-select" type="button">
                  <div>
                    <AppIcon name="calendar" :size="16" />
                    <span>{{ selectedDueDate }}</span>
                  </div>
                  <AppIcon name="chevronDown" :size="16" />
                </button>

                <div class="hm-decision-reminder">
                  <AppIcon name="clock" :size="15" />
                  <span>Reminder will be sent automatically 24h before the due date.</span>
                </div>
              </div>
            </div>

            <div class="hm-decision-section">
              <h3>4. Message to Hiring Manager <small>(Optional)</small></h3>
              <p>Add any context or specific guidance for this decision.</p>

              <div class="hm-decision-textarea-wrap">
                <textarea v-model="message" rows="6" maxlength="300" />
                <small>{{ messageCount }} / 300</small>
              </div>
            </div>

            <div class="hm-decision-section">
              <h3>5. Hiring Manager Response</h3>
              <p>The hiring manager will be asked to provide the following.</p>

              <div class="hm-decision-response-grid">
                <article v-for="item in responseItems" :key="item.title" class="hm-decision-response-card">
                  <span class="hm-decision-response-card__icon">
                    <AppIcon :name="item.icon" :size="18" />
                  </span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.note }}</p>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>

        <footer class="hm-decision-modal__footer">
          <button class="hm-decision-button hm-decision-button--ghost" type="button" @click="closeOverlay">Cancel</button>
          <button class="hm-decision-button hm-decision-button--primary" type="button" @click="submitRequest">
            <AppIcon name="alert" :size="16" />
            <span>Send Decision Request</span>
          </button>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.hm-decision-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 28px;
  background: rgba(27, 33, 45, 0.42);
  backdrop-filter: blur(6px);
}

.hm-decision-modal {
  width: min(100%, 1150px);
  max-height: calc(100vh - 56px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 32px 90px rgba(15, 23, 42, 0.28);
}

.hm-decision-modal__head,
.hm-decision-modal__title,
.hm-decision-profile-card__chips,
.hm-decision-profile-card__links,
.hm-decision-context-card__head,
.hm-decision-option,
.hm-decision-row,
.hm-decision-focus,
.hm-decision-select,
.hm-decision-select > div,
.hm-decision-reminder,
.hm-decision-response-card,
.hm-decision-modal__footer,
.hm-decision-button {
  display: flex;
  align-items: center;
}

.hm-decision-modal__head,
.hm-decision-modal__footer,
.hm-decision-context-card__head,
.hm-decision-select,
.hm-decision-modal__footer {
  justify-content: space-between;
}

.hm-decision-modal__head {
  padding: 24px 32px;
  border-bottom: 1px solid #eef2f8;
}

.hm-decision-modal__title {
  gap: 16px;
}

.hm-decision-modal__title-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #fff2f9;
  color: #ff5aac;
}

.hm-decision-modal__title h2 {
  margin: 0;
  color: #1f2a3d;
  font-size: 1.35rem;
}

.hm-decision-modal__title p {
  margin: 6px 0 0;
  color: #748198;
  font-size: 0.98rem;
}

.hm-decision-modal__close {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #98a2b3;
  cursor: pointer;
}

.hm-decision-modal__body {
  min-height: 0;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  overflow: auto;
}

.hm-decision-sidebar {
  padding: 24px;
  border-right: 1px solid #eef2f8;
  background: #fff;
}

.hm-decision-profile-card,
.hm-decision-context-card {
  border: 1px solid #e9eef6;
  border-radius: 18px;
  background: #fff;
}

.hm-decision-profile-card {
  padding: 24px;
}

.hm-decision-profile-card__avatar {
  width: 88px;
  height: 88px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd9ef 0%, #f8faff 100%);
  color: #ff5aac;
  font-size: 1.7rem;
  font-weight: 800;
}

.hm-decision-profile-card strong {
  display: block;
  margin-top: 18px;
  color: #1f2a3d;
  font-size: 1rem;
}

.hm-decision-profile-card > p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 0.95rem;
}

.hm-decision-profile-card__chips {
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.hm-decision-profile-card__chips span {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef7ff;
  color: #1f9a55;
  font-size: 0.82rem;
  font-weight: 700;
}

.hm-decision-profile-card__chips span:nth-child(2) {
  background: #eefbf2;
}

.hm-decision-profile-card__chips span:nth-child(3) {
  background: #f1f5ff;
  color: #5680ff;
}

.hm-decision-profile-card__meta {
  margin-top: 22px;
  display: grid;
  gap: 18px;
}

.hm-decision-profile-card__meta small,
.hm-decision-profile-card__meta span {
  display: block;
}

.hm-decision-profile-card__meta small {
  color: #98a2b3;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hm-decision-profile-card__meta div strong {
  margin-top: 8px;
  font-size: 0.98rem;
}

.hm-decision-profile-card__meta div span {
  margin-top: 6px;
  color: #667085;
  font-size: 0.9rem;
  line-height: 1.45;
}

.hm-decision-profile-card__links {
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid #eef2f8;
}

.hm-decision-profile-card__links button,
.hm-decision-context-card__head button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff5aac;
  cursor: pointer;
}

.hm-decision-context-card {
  margin-top: 18px;
  padding: 18px;
  background: #f9fbff;
}

.hm-decision-context-card__head strong {
  margin: 0;
  font-size: 0.98rem;
}

.hm-decision-context-card__head button {
  font-size: 0.82rem;
  font-weight: 700;
}

.hm-decision-context-card p {
  margin: 10px 0 0;
  color: #667085;
  font-size: 0.92rem;
  line-height: 1.5;
}

.hm-decision-main {
  min-height: auto;
  overflow: visible;
  padding: 28px 32px;
}

.hm-decision-section + .hm-decision-section,
.hm-decision-row + .hm-decision-section {
  margin-top: 28px;
}

.hm-decision-section h3 {
  margin: 0;
  color: #1f2a3d;
  font-size: 1rem;
}

.hm-decision-section h3 span {
  color: #ff5aac;
}

.hm-decision-section h3 small {
  color: #98a2b3;
  font-size: 1em;
}

.hm-decision-section > p {
  margin: 12px 0 0;
  color: #667085;
  font-size: 0.96rem;
}

.hm-decision-options {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.hm-decision-option {
  position: relative;
  min-height: 104px;
  padding: 16px 14px;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #dbe3ef;
  border-radius: 16px;
  background: #fff;
  color: #344054;
  cursor: pointer;
  text-align: center;
}

.hm-decision-option.is-selected {
  border-color: #ff73b6;
  background: #fff7fb;
}

.hm-decision-option__icon {
  color: #93a0b5;
}

.hm-decision-option.is-selected .hm-decision-option__icon {
  color: #ff5aac;
}

.hm-decision-option span:last-child {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.25;
}

.hm-decision-option i {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff5aac;
}

.hm-decision-row {
  gap: 28px;
  align-items: flex-start;
}

.hm-decision-section--focus {
  flex: 1 1 auto;
  min-width: 0;
}

.hm-decision-section--due {
  width: 336px;
}

.hm-decision-focus-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.hm-decision-focus {
  gap: 12px;
  min-height: 66px;
  padding: 0 14px;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  background: #fff;
  color: #344054;
  cursor: pointer;
  text-align: left;
}

.hm-decision-focus.is-selected {
  border-color: #ff73b6;
  background: #fff7fb;
}

.hm-decision-focus__check {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d6deea;
  border-radius: 6px;
  color: transparent;
  background: #fff;
  flex: 0 0 20px;
}

.hm-decision-focus.is-selected .hm-decision-focus__check {
  border-color: #ff5aac;
  background: #ff5aac;
  color: #fff;
}

.hm-decision-select,
.hm-decision-textarea-wrap textarea,
.hm-decision-reminder,
.hm-decision-response-grid {
  margin-top: 18px;
}

.hm-decision-select {
  width: 100%;
  min-height: 50px;
  padding: 0 16px;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  background: #fff;
  color: #344054;
  cursor: pointer;
}

.hm-decision-select > div {
  gap: 10px;
}

.hm-decision-reminder {
  gap: 10px;
  padding: 16px;
  border: 1px solid #ffe0ea;
  border-radius: 14px;
  background: #fff8fb;
  color: #667085;
  font-size: 0.9rem;
}

.hm-decision-reminder :deep(svg) {
  color: #ff5aac;
  flex: 0 0 auto;
}

.hm-decision-textarea-wrap {
  position: relative;
  margin-top: 18px;
}

.hm-decision-textarea-wrap textarea {
  width: 100%;
  min-height: 128px;
  padding: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 14px;
  color: #344054;
  resize: vertical;
}

.hm-decision-textarea-wrap small {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: #98a2b3;
  font-size: 0.82rem;
}

.hm-decision-response-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  padding: 18px;
  border: 1px solid #e9eef6;
  border-radius: 18px;
  background: #fff;
}

.hm-decision-response-card {
  gap: 14px;
  min-width: 0;
}

.hm-decision-response-card__icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff2f9;
  color: #ff5aac;
  flex: 0 0 40px;
}

.hm-decision-response-card strong {
  display: block;
  color: #1f2a3d;
  font-size: 0.9rem;
}

.hm-decision-response-card p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 0.86rem;
  line-height: 1.5;
}

.hm-decision-modal__footer {
  gap: 14px;
  padding: 20px 32px;
  border-top: 1px solid #eef2f8;
}

.hm-decision-button {
  height: 48px;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.hm-decision-button--ghost {
  min-width: 116px;
  color: #344054;
  border-color: #d9e2ee;
  background: #fff;
}

.hm-decision-button--primary {
  min-width: 260px;
  color: #fff;
  background: linear-gradient(90deg, #ff67ad 0%, #f15ea8 100%);
  box-shadow: 0 12px 24px rgba(241, 94, 168, 0.22);
}

@media (max-width: 1180px) {
  .hm-decision-modal__body {
    grid-template-columns: 1fr;
  }

  .hm-decision-sidebar {
    border-right: 0;
    border-bottom: 1px solid #eef2f8;
  }
}

@media (max-width: 920px) {
  .hm-decision-overlay {
    padding: 14px;
  }

  .hm-decision-modal {
    max-height: calc(100vh - 28px);
    border-radius: 22px;
  }

  .hm-decision-modal__head,
  .hm-decision-main,
  .hm-decision-sidebar,
  .hm-decision-modal__footer {
    padding-left: 18px;
    padding-right: 18px;
  }

  .hm-decision-options,
  .hm-decision-response-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hm-decision-row {
    flex-direction: column;
  }

  .hm-decision-section--due {
    width: 100%;
  }
}

@media (max-width: 620px) {
  .hm-decision-modal__title {
    align-items: flex-start;
  }

  .hm-decision-options,
  .hm-decision-focus-grid,
  .hm-decision-response-grid {
    grid-template-columns: 1fr;
  }

  .hm-decision-modal__footer {
    flex-direction: column;
  }

  .hm-decision-button,
  .hm-decision-button--ghost,
  .hm-decision-button--primary {
    width: 100%;
    min-width: 0;
  }
}
</style>
