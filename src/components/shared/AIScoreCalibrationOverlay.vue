<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

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
    default: 'Senior Frontend Developer',
  },
  candidateStage: {
    type: String,
    default: 'Validation',
  },
})

const emit = defineEmits(['close', 'request-hm-review'])

const previousBodyOverflow = ref('')
const previousHtmlOverflow = ref('')
const overlayOpenedAt = ref(0)
const bodyRef = ref(null)

const candidateInitials = computed(() => (
  props.candidateName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
))

const confidenceScore = 96

const profileFacts = computed(() => ([
  { label: 'Department', value: 'Engineering' },
  { label: 'Location', value: 'San Francisco, CA' },
  { label: 'Employment Type', value: 'Full-time' },
  { label: 'Current Stage', value: props.candidateStage, stage: true },
  { label: 'Last Updated', value: 'May 25, 2026 - 10:24 AM', meta: 'By NitroSync AI' },
]))

const evidenceRows = [
  { label: 'Interview scorecards', note: '5 scorecards from recruiter, tech, team & HM', score: '98%', icon: 'users', tone: 'pink' },
  { label: 'Assessments', note: '2 assessments including technical and cognitive', score: '91%', icon: 'chart-bars', tone: 'rose' },
  { label: 'References', note: '3 professional references', score: '100%', icon: 'users', tone: 'violet' },
  { label: 'Background check', note: 'Identity, criminal, employment, education', score: '100%', icon: 'shield', tone: 'orange' },
  { label: 'Work authorization', note: 'Right to work verified', score: '100%', icon: 'document', tone: 'green' },
  { label: 'HM feedback', note: 'Final recommendation from hiring manager', score: '93%', icon: 'star', tone: 'lavender' },
]

const whyNotHundred = [
  ['Leadership', 'Leadership was evaluated by only one interviewer.'],
  ['Assessment score', 'Assessment score was slightly lower than top-tier scores.'],
  ['Reference timing', 'One reference replied after reminder.'],
]

const conclusionPoints = [
  'The recommendation is reliable.',
  'All critical validation areas are complete.',
  'Move forward with confidence.',
]

const timelineRows = [
  ['AI Recommendation Generated', 'May 25, 2026 - 10:24 AM', true],
  ['Assessments Completed', 'May 24, 2026 - 5:15 PM', true],
  ['References Verified', 'May 24, 2026 - 11:30 AM', true],
  ['Background Check Passed', 'May 23, 2026 - 4:20 PM', true],
  ['Hiring Manager Review Pending', 'Next step', false],
]

const nextStepActions = [
  'Schedule Final Interview',
  'Request Hiring Manager Review',
  'Add to Backup List',
]

const confidenceRingStyle = computed(() => ({
  background: `conic-gradient(#ff4f9c 0deg ${confidenceScore * 3.6}deg, #eef2fb ${confidenceScore * 3.6}deg 360deg)`,
}))

function syncDocumentScrollLock(isOpen) {
  if (typeof document === 'undefined') {
    return
  }

  if (isOpen) {
    previousBodyOverflow.value = document.body.style.overflow
    previousHtmlOverflow.value = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
  document.documentElement.style.overflow = previousHtmlOverflow.value
}

function closeOverlay() {
  emit('close')
}

function runSecondaryAction(action) {
  if (action === 'Request Hiring Manager Review') {
    emit('request-hm-review')
  }
}

function handleBackdropClick() {
  if (Date.now() - overlayOpenedAt.value < 180) {
    return
  }

  closeOverlay()
}

watch(
  () => props.open,
  async (isOpen) => {
    syncDocumentScrollLock(isOpen)

    if (isOpen) {
      overlayOpenedAt.value = Date.now()
      await nextTick()

      if (bodyRef.value) {
        bodyRef.value.scrollTop = 0
      }
    }
  },
)

onBeforeUnmount(() => {
  syncDocumentScrollLock(false)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-confidence-overlay" @click.self="handleBackdropClick">
      <section class="ai-confidence-modal">
        <header class="ai-confidence-head">
          <div>
            <div class="ai-confidence-head__title">
              <span class="ai-confidence-head__icon">
                <AppIcon name="target" :size="16" />
              </span>
              <h2>AI Confidence Breakdown</h2>
              <em>AI</em>
            </div>
            <p>Understand how confident our AI is in this hiring recommendation.</p>
          </div>

          <button class="ai-confidence-head__close" type="button" aria-label="Close AI Confidence Breakdown" @click="closeOverlay">
            <AppIcon name="close" :size="16" />
          </button>
        </header>

        <div ref="bodyRef" class="ai-confidence-body">
          <section class="ai-confidence-profile">
            <div class="ai-confidence-profile__identity">
              <span class="ai-confidence-profile__avatar">{{ candidateInitials }}</span>
              <div>
                <strong>{{ candidateName }}</strong>
                <p>{{ candidateRole }}</p>
                <button type="button" class="ai-confidence-link">
                  <span>View candidate profile</span>
                  <AppIcon name="external-link" :size="12" />
                </button>
              </div>
            </div>

            <div class="ai-confidence-profile__facts">
              <article v-for="item in profileFacts" :key="item.label">
                <small>{{ item.label }}</small>
                <strong :class="{ 'is-stage': item.stage }">{{ item.value }}</strong>
                <span v-if="item.meta">{{ item.meta }}</span>
              </article>
            </div>
          </section>

          <div class="ai-confidence-top-grid">
            <section class="ai-confidence-card ai-confidence-card--overall">
              <div class="ai-confidence-overall">
                <div class="ai-confidence-ring" :style="confidenceRingStyle">
                  <div>
                    <strong>{{ confidenceScore }}%</strong>
                    <span>High Confidence</span>
                    <small>
                      <AppIcon name="shield" :size="11" />
                    </small>
                  </div>
                </div>

                <div class="ai-confidence-overall__content">
                  <div class="ai-confidence-card__head ai-confidence-card__head--inline">
                    <span>1.</span>
                    <strong>Overall Confidence</strong>
                  </div>

                  <div class="ai-confidence-overall__copy">
                  <p>Our AI is highly confident in this recommendation based on the evidence analyzed.</p>
                  </div>

                  <div class="ai-confidence-metrics">
                    <article><small>Confidence Level</small><strong>High</strong></article>
                    <article><small>Data Completeness</small><strong>98%</strong></article>
                    <article><small>Evidence Quality</small><strong>High</strong></article>
                  </div>
                </div>
              </div>
            </section>

            <section class="ai-confidence-card">
              <div class="ai-confidence-card__head">
                <span>2.</span>
                <strong>Evidence Used</strong>
              </div>

              <div class="ai-confidence-evidence">
                <article v-for="item in evidenceRows" :key="item.label">
                  <div class="ai-confidence-evidence__label">
                    <span class="is-icon" :class="`is-${item.tone}`">
                      <AppIcon :name="item.icon" :size="13" />
                    </span>
                    <div>
                      <strong>{{ item.label }}</strong>
                      <small>{{ item.note }}</small>
                    </div>
                  </div>
                  <em>{{ item.score }}</em>
                </article>
              </div>
            </section>
          </div>

          <div class="ai-confidence-middle-grid">
            <section class="ai-confidence-card">
              <div class="ai-confidence-card__head">
                <span>3.</span>
                <strong>Why isn't confidence 100%?</strong>
              </div>

              <div class="ai-confidence-alert-list">
                <article v-for="item in whyNotHundred" :key="item[0]">
                  <AppIcon name="alert" :size="13" />
                  <div>
                    <strong>{{ item[0] }}</strong>
                    <p>{{ item[1] }}</p>
                  </div>
                </article>
              </div>
            </section>

            <section class="ai-confidence-card ai-confidence-card--conclusion">
              <div class="ai-confidence-card__head">
                <span>4.</span>
                <strong>AI Conclusion</strong>
              </div>

              <ul class="ai-confidence-checks">
                <li v-for="item in conclusionPoints" :key="item">
                  <AppIcon name="check" :size="13" />
                  <span>{{ item }}</span>
                </li>
              </ul>
            </section>
          </div>

          <div class="ai-confidence-bottom-grid">
            <section class="ai-confidence-card">
              <div class="ai-confidence-card__head">
                <span>5.</span>
                <strong>Recommendation Audit Timeline</strong>
              </div>

              <div class="ai-confidence-timeline">
                <div class="ai-confidence-timeline__line" />
                <article v-for="item in timelineRows" :key="item[0]">
                  <span :class="{ 'is-pending': !item[2] }" />
                  <strong>{{ item[0] }}</strong>
                  <small>{{ item[1] }}</small>
                </article>
              </div>

              <p class="ai-confidence-note">
                <AppIcon name="info" :size="12" />
                <span>All times shown in your local time zone.</span>
              </p>
            </section>

            <section class="ai-confidence-card">
              <div class="ai-confidence-card__head">
                <span>6.</span>
                <strong>Recommended Next Step</strong>
              </div>

              <button type="button" class="ai-confidence-primary-action">
                <AppIcon name="sparkles" :size="14" />
                <span>Move to Offer</span>
              </button>

              <p class="ai-confidence-next-copy">
                Based on the strong validation across all critical areas, AI recommends moving this candidate to the Offer stage.
              </p>

              <small class="ai-confidence-other-label">Other actions</small>
              <div class="ai-confidence-secondary-actions">
                <button
                  v-for="item in nextStepActions"
                  :key="item"
                  type="button"
                  @click="runSecondaryAction(item)"
                >
                  {{ item }}
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer class="ai-confidence-foot">
          <div class="ai-confidence-foot__top">
            <label class="ai-confidence-foot__intro">
              <span>Override AI Recommendation</span>
              <small>If you disagree with the AI recommendation, provide a reason. This will be logged.</small>
            </label>

            <label class="ai-confidence-foot__field">
              <span>Reason</span>
              <select>
                <option>Select a reason</option>
              </select>
            </label>

            <label class="ai-confidence-foot__field">
              <span>Additional comments (optional)</span>
              <input type="text" placeholder="Add your comments here...">
            </label>

            <div class="ai-confidence-foot__primary">
              <button type="button" class="ai-confidence-override-button">Override Recommendation</button>
            </div>
          </div>

          <div class="ai-confidence-foot__bottom">
            <button type="button" class="ai-confidence-supporting">
              <AppIcon name="spark" :size="14" />
              <span>View supporting evidence</span>
            </button>
            <button type="button" class="ai-confidence-close-button" @click="closeOverlay">Close</button>
          </div>
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-confidence-overlay {
  position: fixed;
  inset: 0;
  z-index: 1710;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
}

.ai-confidence-modal {
  width: min(1460px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  overflow: hidden;
  border: 1px solid #e7edf8;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.14);
}

.ai-confidence-head,
.ai-confidence-head__title,
.ai-confidence-profile__identity,
.ai-confidence-overall,
.ai-confidence-card__head,
.ai-confidence-evidence article,
.ai-confidence-evidence__label,
.ai-confidence-alert-list article,
.ai-confidence-note,
.ai-confidence-foot__bottom,
.ai-confidence-foot__primary {
  display: flex;
  align-items: center;
}

.ai-confidence-head {
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.04) 0%, rgba(255, 255, 255, 0) 100%);
}

.ai-confidence-head__title {
  gap: 8px;
}

.ai-confidence-head__icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
}

.ai-confidence-head h2 {
  margin: 0;
  color: #243454;
  font-size: 1.05rem;
}

.ai-confidence-head em {
  padding: 2px 7px;
  border-radius: 999px;
  background: #fff0f7;
  color: #ff4f9c;
  font-style: normal;
  font-size: 0.62rem;
  font-weight: 800;
}

.ai-confidence-head p {
  margin: 2px 0 0;
  color: #8390aa;
  font-size: 0.7rem;
}

.ai-confidence-head__close,
.ai-confidence-primary-action,
.ai-confidence-secondary-actions button,
.ai-confidence-override-button,
.ai-confidence-supporting,
.ai-confidence-close-button {
  border: 1px solid #dfe6f5;
  background: #fff;
  font: inherit;
  cursor: pointer;
}

.ai-confidence-head__close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #66758f;
}

.ai-confidence-body {
  overflow: auto;
  padding: 12px;
  padding-bottom: 18px;
  background:
    radial-gradient(circle at top left, rgba(255, 79, 156, 0.05), transparent 18%),
    linear-gradient(180deg, #fff 0%, #fcfdff 100%);
}

.ai-confidence-profile,
.ai-confidence-card {
  border: 1px solid #edf2fb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(27, 39, 76, 0.04);
}

.ai-confidence-profile {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 14px;
  padding: 12px 16px;
}

.ai-confidence-profile__identity {
  align-items: flex-start;
  gap: 12px;
}

.ai-confidence-profile__avatar {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d1d1d 0%, #db8a6d 100%);
  color: #fff;
  font-weight: 800;
}

.ai-confidence-profile__identity strong {
  display: block;
  color: #243454;
  font-size: 0.92rem;
}

.ai-confidence-profile__identity p {
  margin: 3px 0 0;
  color: #73829d;
  font-size: 0.72rem;
}

.ai-confidence-link {
  margin-top: 7px;
  padding: 0;
  border: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #ff4f9c;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
}

.ai-confidence-profile__facts {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.ai-confidence-profile__facts small,
.ai-confidence-foot__intro span,
.ai-confidence-foot__field span,
.ai-confidence-metrics small {
  display: block;
  color: #95a1b6;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-confidence-profile__facts strong {
  display: block;
  margin-top: 5px;
  color: #243454;
  font-size: 0.74rem;
}

.ai-confidence-profile__facts span {
  display: block;
  margin-top: 4px;
  color: #8f9cb0;
  font-size: 0.63rem;
}

.ai-confidence-profile__facts strong.is-stage {
  color: #ff4f9c;
}

.ai-confidence-top-grid,
.ai-confidence-middle-grid,
.ai-confidence-bottom-grid,
.ai-confidence-foot__top {
  display: grid;
  gap: 10px;
}

.ai-confidence-top-grid {
  grid-template-columns: 1.08fr 1fr;
  margin-top: 10px;
}

.ai-confidence-middle-grid {
  grid-template-columns: 0.86fr 0.9fr;
  margin-top: 10px;
}

.ai-confidence-bottom-grid {
  grid-template-columns: 1.2fr 0.9fr;
  margin-top: 10px;
}

.ai-confidence-card {
  padding: 14px;
}

.ai-confidence-card--overall {
  background: linear-gradient(180deg, rgba(255, 90, 167, 0.05) 0%, #fff 100%);
}

.ai-confidence-card__head {
  gap: 8px;
}

.ai-confidence-card__head span {
  color: #ff4f9c;
  font-size: 0.76rem;
  font-weight: 800;
}

.ai-confidence-card__head strong {
  color: #243454;
  font-size: 0.82rem;
}

.ai-confidence-card__head--inline {
  margin-bottom: 6px;
}

.ai-confidence-overall {
  display: grid;
  grid-template-columns: 146px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}

.ai-confidence-ring {
  width: 116px;
  height: 116px;
  padding: 8px;
  border-radius: 50%;
  flex: 0 0 116px;
}

.ai-confidence-ring > div {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #fff;
  box-shadow: inset 0 0 0 1px #edf2fb;
  text-align: center;
}

.ai-confidence-ring strong {
  display: block;
  color: #1f2940;
  font-size: 1.85rem;
  line-height: 1;
}

.ai-confidence-ring span {
  display: block;
  margin-top: 4px;
  color: #ff4f9c;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-confidence-ring small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-top: 6px;
  border-radius: 50%;
  background: #fff4f8;
  color: #ff4f9c;
}

.ai-confidence-overall__content {
  display: grid;
  gap: 6px;
  align-content: center;
}

.ai-confidence-overall__copy {
  max-width: 430px;
}

.ai-confidence-overall__copy p,
.ai-confidence-next-copy,
.ai-confidence-alert-list p {
  margin: 0;
  color: #6e7d97;
  font-size: 0.72rem;
  line-height: 1.6;
}

.ai-confidence-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.ai-confidence-metrics strong {
  display: block;
  margin-top: 6px;
  color: #243454;
  font-size: 0.78rem;
}

.ai-confidence-evidence {
  display: grid;
  gap: 0;
  margin-top: 12px;
}

.ai-confidence-evidence article {
  justify-content: space-between;
  gap: 10px;
  padding: 10px 0;
  border-top: 1px solid #f2f5fb;
}

.ai-confidence-evidence article:first-child {
  padding-top: 2px;
  border-top: 0;
}

.ai-confidence-evidence__label {
  gap: 10px;
  min-width: 0;
}

.ai-confidence-evidence__label .is-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 26px;
}

.ai-confidence-evidence__label .is-pink {
  background: #fff0f7;
  color: #ff4f9c;
}

.ai-confidence-evidence__label .is-rose {
  background: #fff4f8;
  color: #ff709f;
}

.ai-confidence-evidence__label .is-violet {
  background: #f4f1ff;
  color: #8a63ff;
}

.ai-confidence-evidence__label .is-orange {
  background: #fff4e8;
  color: #fb923c;
}

.ai-confidence-evidence__label .is-green {
  background: #ecfbf3;
  color: #19b66b;
}

.ai-confidence-evidence__label .is-lavender {
  background: #f5f0ff;
  color: #aa71ff;
}

.ai-confidence-evidence__label strong {
  display: block;
  color: #243454;
  font-size: 0.74rem;
}

.ai-confidence-evidence__label small {
  display: block;
  margin-top: 3px;
  color: #7d8ba0;
  font-size: 0.67rem;
}

.ai-confidence-evidence em {
  color: #19b66b;
  font-style: normal;
  font-size: 0.72rem;
  font-weight: 800;
}

.ai-confidence-alert-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.ai-confidence-middle-grid > .ai-confidence-card:first-child {
  background: linear-gradient(180deg, rgba(251, 146, 60, 0.06) 0%, #fff 100%);
}

.ai-confidence-alert-list article {
  align-items: flex-start;
  gap: 8px;
}

.ai-confidence-alert-list article :deep(svg) {
  color: #fb923c;
  margin-top: 2px;
  flex: 0 0 auto;
}

.ai-confidence-alert-list strong,
.ai-confidence-timeline strong {
  display: block;
  color: #243454;
  font-size: 0.72rem;
}

.ai-confidence-card--conclusion {
  background: linear-gradient(180deg, #f9fffb 0%, #fff 100%);
}

.ai-confidence-checks {
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.ai-confidence-checks li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #5b6a85;
  font-size: 0.72rem;
}

.ai-confidence-checks li :deep(svg) {
  color: #19b66b;
  margin-top: 1px;
  flex: 0 0 auto;
}

.ai-confidence-timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}

.ai-confidence-timeline__line {
  position: absolute;
  top: 12px;
  left: 32px;
  right: 32px;
  height: 2px;
  background: linear-gradient(90deg, #ff4f9c 0%, #ff4f9c 78%, #f1c5d8 78%, #f1c5d8 100%);
}

.ai-confidence-timeline article {
  position: relative;
  z-index: 1;
  text-align: center;
  min-width: 0;
}

.ai-confidence-timeline article > span {
  width: 22px;
  height: 22px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: block;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  box-shadow: 0 0 0 5px #fff;
}

.ai-confidence-timeline article > span.is-pending {
  background: #fff;
  border: 2px solid #ff4f9c;
}

.ai-confidence-timeline small {
  display: block;
  margin-top: 5px;
  color: #8f9cb0;
  font-size: 0.63rem;
  line-height: 1.5;
}

.ai-confidence-timeline strong {
  line-height: 1.4;
}

.ai-confidence-note {
  gap: 7px;
  margin-top: 14px;
  color: #8f9cb0;
  font-size: 0.63rem;
}

.ai-confidence-primary-action {
  width: 100%;
  height: 40px;
  border-color: transparent;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
}

.ai-confidence-next-copy {
  margin-top: 12px;
}

.ai-confidence-other-label {
  display: block;
  margin-top: 12px;
  color: #8f9cb0;
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-confidence-secondary-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.ai-confidence-secondary-actions button {
  min-height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  color: #334155;
  font-size: 0.66rem;
  font-weight: 700;
}

.ai-confidence-foot {
  padding: 10px 16px 12px;
  border-top: 1px solid #edf2fb;
  background: linear-gradient(180deg, rgba(255, 79, 156, 0.03) 0%, #fff 100%);
}

.ai-confidence-foot__top {
  grid-template-columns: 260px 220px minmax(0, 1fr) auto;
  align-items: center;
}

.ai-confidence-foot__intro,
.ai-confidence-foot__field {
  display: grid;
  gap: 7px;
}

.ai-confidence-foot__intro small {
  color: #93a0b4;
  font-size: 0.63rem;
  line-height: 1.45;
}

.ai-confidence-foot__field select,
.ai-confidence-foot__field input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dfe6f5;
  border-radius: 9px;
  outline: none;
  background: #fff;
  color: #243454;
  font: inherit;
  font-size: 0.69rem;
}

.ai-confidence-foot__field input::placeholder {
  color: #9aa7bb;
}

.ai-confidence-override-button {
  height: 40px;
  padding: 0 18px;
  border-color: transparent;
  border-radius: 9px;
  background: linear-gradient(135deg, #ff5aa7 0%, #ff2d89 100%);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
}

.ai-confidence-foot__bottom {
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}

.ai-confidence-supporting,
.ai-confidence-close-button {
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
}

.ai-confidence-supporting {
  border-color: #ffd4e7;
  color: #ff4f9c;
  background: #fff8fc;
}

@media (max-width: 1320px) {
  .ai-confidence-top-grid,
  .ai-confidence-middle-grid,
  .ai-confidence-bottom-grid {
    grid-template-columns: 1fr;
  }

  .ai-confidence-profile__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 1040px) {
  .ai-confidence-profile,
  .ai-confidence-foot__top,
  .ai-confidence-metrics,
  .ai-confidence-secondary-actions {
    grid-template-columns: 1fr;
  }

  .ai-confidence-overall {
    grid-template-columns: 1fr;
  }

  .ai-confidence-overall__content {
    gap: 8px;
  }

  .ai-confidence-timeline {
    grid-template-columns: 1fr;
  }

  .ai-confidence-timeline__line {
    display: none;
  }

  .ai-confidence-timeline article {
    text-align: left;
  }

  .ai-confidence-timeline article > span {
    margin-left: 0;
  }

  .ai-confidence-foot__bottom {
    flex-wrap: wrap;
  }
}

@media (max-width: 720px) {
  .ai-confidence-overlay {
    padding: 10px;
  }

  .ai-confidence-modal {
    width: 100%;
    max-height: calc(100vh - 20px);
    border-radius: 16px;
  }

  .ai-confidence-head,
  .ai-confidence-body,
  .ai-confidence-foot {
    padding-left: 12px;
    padding-right: 12px;
  }

  .ai-confidence-profile__facts {
    grid-template-columns: 1fr;
  }

  .ai-confidence-overall {
    flex-direction: column;
  }
}
</style>
